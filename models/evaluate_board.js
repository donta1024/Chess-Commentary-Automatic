
/* requireでモジュール読み込み */
var stockfish = require("stockfish");
var saveToMongoDB = require("./save_to_mongodb.js");
var tableName = "fen_analysis_result";

/* FEN形式のポジションと解析時間を入力として、解析を行うクラス。
　解析が終わるとis_finish_evaluationがtrueになり、解析結果がメンバー変数に格納される */
var EvaluateBoard = function(FEN_format_position,evaluation_time_length)
{
    var self    = this;
    this.engine = stockfish();
    
    /*解析結果は、JSON形式のほうが直感的に理解でき、バグ修正も容易。*/
    this.analysis_result = {
    	"fen_position":FEN_format_position,
    	"best_move": "",
    	"calculated_line": "",
    	"total_evaluation_score": 0,
    	"material":{
    		"white": null, "black": null, "total": {"MG": 0, "EG": 0}
    	},
    	"imbalance":{
    		"white": null, "black": null, "total": {"MG": 0, "EG": 0}    		
    	},
    	"pawn":{
    		"white": null, "black": null, "total": {"MG": 0, "EG": 0}    		
    	},
    	"knight":{
    		"white": {"MG": 0, "EG": 0}, "black": {"MG": 0, "EG": 0}, "total": {"MG": 0, "EG": 0}   		
    	},   	
    	"bishop":{
    		"white": {"MG": 0, "EG": 0}, "black": {"MG": 0, "EG": 0}, "total": {"MG": 0, "EG": 0}    		
    	},
    	"rook":{
    		"white": {"MG": 0, "EG": 0}, "black": {"MG": 0, "EG": 0}, "total": {"MG": 0, "EG": 0}    		
    	},
    	"queen":{
    		"white": {"MG": 0, "EG": 0}, "black": {"MG": 0, "EG": 0}, "total": {"MG": 0, "EG": 0}    		
    	},
    	"mobility":{
    		"white": {"MG": 0, "EG": 0}, "black": {"MG": 0, "EG": 0}, "total": {"MG": 0, "EG": 0}    		
    	},
    	"king_safety":{
    		"white": {"MG": 0, "EG": 0},"black": {"MG": 0, "EG": 0}, "total": {"MG": 0, "EG": 0}    		
    	},
    	"threats":{
    		"white": {"MG": 0, "EG": 0}, "black": {"MG": 0, "EG": 0}, "total": {"MG": 0, "EG": 0}    		
    	},
    	"passed_pawn":{
    		"white": {"MG": 0, "EG": 0}, "black": {"MG": 0, "EG": 0}, "total": {"MG": 0, "EG": 0}    		
    	},
    	"space":{
    		"white": {"MG": 0, "EG": 0}, "black": {"MG": 0, "EG": 0}, "total": {"MG": 0, "EG": 0}    		
    	},
    };
    
    /* deprecated */
    /* 解析結果を格納するメンバー変数 */
    this.best_move              = "";               // 最善手
    this.calculated_line        = "";               // エンジンが読んだ筋
    this.total_evaluation_score = 0;                // 現在の局面の評価値。単位はCP
    
    /* チェスエンジンを起動する */
    this.is_finish_evaluation = false;
    this.engine.postMessage("uci");

    /////////////* ここまでコンストラクタ *////////////////    
    /* 処理のメイン部分　エンジンから送られてくるメッセージを解析して処理する */
    this.engine.onmessage = function(line) {
    
        this.send = function(str){
            console.log("Sending: " + str)
            this.postMessage(str);
        };

        //console.log(line);
        
        // チェスエンジンの準備ができた通知が来たときの処理
        if (line === "uciok") 
        {
        	this.send("position fen " + FEN_format_position); // ポジションの設定
            this.send("eval");                              // 局面評価開始
            //this.send("d");                                 // 盤面をAA表示。関数に投入するため削除
            this.send("go ponder");                         // 候補手探索開始

            var f = this;
            setTimeout( function (){f.send("stop");} , 1000 * evaluation_time_length); // 何秒後に候補手探索を打ち切るかを設定
        }
        else if(line.indexOf("Total Evaluation:") > -1){
            match = line.match(/Total Evaluation:\s+(\S+)/);
            if(match){ self.analysis_result["total_evaluation_score"] = match[1] - 0; }
        }
        // 候補手探索が打ち切られると通知される最善手に対する処理
        else if (line.indexOf("bestmove") > -1) {
            match = line.match(/bestmoveSan\s+(\S+)/);
            if (match) { self.analysis_result["best_move"] = match[1]; }
            self.is_finish_evaluation = true;
        }
        //それぞれの評価値を受け取ってJSONに投入
        else if (line.indexOf("       Material") > -1){
        	match = line.match(/-?[0-9]+.[0-9]+/g);
        	if (match) {self.analysis_result = setEvaluation(match, self.analysis_result, "material");}
        }
        else if (line.indexOf("      Imbalance") > -1){
        	match = line.match(/-?[0-9]+.[0-9]+/g);
        	if (match) {self.analysis_result = setEvaluation(match, self.analysis_result, "imbalance");}
        }
        else if (line.indexOf("          Pawns") > -1){
        	match = line.match(/-?[0-9]+.[0-9]+/g);
        	if (match) {self.analysis_result = setEvaluation(match, self.analysis_result, "pawn");}
        }
        else if (line.indexOf("        Knights") > -1){
        	match = line.match(/-?[0-9]+.[0-9]+/g);
        	if (match) {self.analysis_result = setEvaluation(match, self.analysis_result, "knight");}
        }
        else if (line.indexOf("         Bishop") > -1){
        	match = line.match(/-?[0-9]+.[0-9]+/g);
        	if (match) {self.analysis_result = setEvaluation(match, self.analysis_result, "bishop");}
        }
        else if (line.indexOf("          Rooks") > -1){
        	match = line.match(/-?[0-9]+.[0-9]+/g);
        	if (match) {self.analysis_result = setEvaluation(match, self.analysis_result, "rook");}
        }
        else if (line.indexOf("         Queens") > -1){
        	match = line.match(/-?[0-9]+.[0-9]+/g);
        	if (match) {self.analysis_result = setEvaluation(match, self.analysis_result, "queen");}
        }
        else if (line.indexOf("       Mobility") > -1){
        	match = line.match(/-?[0-9]+.[0-9]+/g);
        	if (match) {self.analysis_result = setEvaluation(match, self.analysis_result, "mobility");}
        }
        else if (line.indexOf("    King safety") > -1){
        	match = line.match(/-?[0-9]+.[0-9]+/g);
        	if (match) {self.analysis_result = setEvaluation(match, self.analysis_result, "king_safety");}
        }
        else if (line.indexOf("        Threats") > -1){
        	match = line.match(/-?[0-9]+.[0-9]+/g);
        	if (match) {self.analysis_result = setEvaluation(match, self.analysis_result, "threats");}
        }
        else if (line.indexOf("   Passed pawns") > -1){
        	match = line.match(/-?[0-9]+.[0-9]+/g);
        	if (match) {self.analysis_result = setEvaluation(match, self.analysis_result, "passed_pawn");}
        }
        else if (line.indexOf("          Space") > -1){
        	match = line.match(/-?[0-9]+.[0-9]+/g);
        	if (match) {self.analysis_result = setEvaluation(match, self.analysis_result, "space");}
        }
        //最後にpvSanが現れたlineが、最善手のラインであるため、上書きしていく
        else if (line.indexOf("info depth") > -1){
        	match = line.match(/pvSan.*bmc/g);
        	if (match){
        		self.analysis_result["calculated_line"] = match[0].slice(6,-4);
        	}
        }
    };

    this.executeCallbackfuncAfterEvaluationFinish = function(callback_func){
        if( this.is_finish_evaluation == true )
        {
        	saveToMongoDB.insertIntoMongoDB(tableName,self.analysis_result);
            callback_func();
            return; 
        }
        setTimeout(function(){ self.executeCallbackfuncAfterEvaluationFinish(callback_func); }, 5000);
    };

}

exports.EvaluateBoard = EvaluateBoard;
exports.analysis_result = EvaluateBoard.analysis_result;

function setEvaluation(match, resultJson, resultKey){
	if (match.length == 2){
		resultJson[resultKey]["total"]["MG"] = match[0] - 0;
		resultJson[resultKey]["total"]["EG"] = match[1] - 0;
	}
	else if (match.length == 6){
		resultJson[resultKey]["white"]["MG"] = match[0] - 0;
		resultJson[resultKey]["white"]["EG"] = match[1] - 0;
		resultJson[resultKey]["black"]["MG"] = match[2] - 0;
		resultJson[resultKey]["black"]["EG"] = match[3] - 0;
		resultJson[resultKey]["total"]["MG"] = match[4] - 0;
		resultJson[resultKey]["total"]["EG"] = match[5] - 0;
	}
	return resultJson;
}
