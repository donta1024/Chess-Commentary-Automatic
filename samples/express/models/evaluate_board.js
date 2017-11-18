
/* requireでモジュール読み込み */
var stockfish = require("stockfish");

/* FEN形式のポジションと解析時間を入力として、解析を行うクラス。
　解析が終わるとis_finish_evaluationがtrueになり、解析結果がメンバー変数に格納される */
var EvaluateBoard = function(FEN_format_position,evaluation_time_length)
{
    var self    = this;
    this.engine = stockfish();
    
    /*解析結果は、JSON形式のほうが直感的に理解でき、バグ修正も容易。*/
    this.analysis_result = {
    	"best_move": "",
    	"calculated_line": "",
    	"total_evaluation_score": 0,
    	"material":{
    		"white": 0, "black": 0,"total": 0
    	},
    	"imbalance":{
    		"white": 0, "black": 0, "total": 0    		
    	},
    	"pawn":{
    		"white": 0, "black": 0, "total": 0    		
    	},
    	"knight":{
    		"white": 0, "black": 0, "total": 0    		
    	},   	
    	"bishop":{
    		"white": 0, "black": 0, "total": 0    		
    	},
    	"rook":{
    		"white": 0, "black": 0, "total": 0    		
    	},
    	"queen":{
    		"white": 0, "black": 0, "total": 0    		
    	},
    	"mobility":{
    		"white": 0, "black": 0, "total": 0    		
    	},
    	"king_safety":{
    		"white": 0,"black": 0, "total": 0    		
    	},
    	"threats":{
    		"white": 0, "black": 0, "total": 0    		
    	},
    	"passed_pawn":{
    		"white": 0, "black": 0, "total": 0    		
    	},
    	"space":{
    		"white": 0, "black": 0, "total": 0    		
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

        console.log(line);
        
        // チェスエンジンの準備ができた通知が来たときの処理
        if (line === "uciok") 
        {
        	this.send("position fen " + FEN_format_position); // ポジションの設定
            this.send("eval");                              // 局面評価開始
            this.send("d");                                 // 盤面をAA表示。関数に投入するため削除
            this.send("go ponder");                         // 候補手探索開始

            var f = this;
            setTimeout( function (){f.send("stop");} , 1000 * evaluation_time_length); // 何秒後に候補手探索を打ち切るかを設定
        }
        else if(line.indexOf("Total Evaluation:") > -1){
            match = line.match(/Total Evaluation:\s+(\S+)/);
            if(match){ self.analysis_result["total_evaluation_score"] = match[1]; }
        }
        // 候補手探索が打ち切られると通知される最善手に対する処理
        else if (line.indexOf("bestmove") > -1) {
            match = line.match(/bestmoveSan\s+(\S+)/);
            if (match) { self.analysis_result["best_move"] = match[1]; }
            self.is_finish_evaluation = true;
        }
    };

    this.executeCallbackfuncAfterEvaluationFinish = function(callback_func){
        if( this.is_finish_evaluation == true )
        {
            callback_func();
            return; 
        }
        setTimeout(function(){ self.executeCallbackfuncAfterEvaluationFinish(callback_func); }, 500);
    };

}

exports.EvaluateBoard = EvaluateBoard;
exports.analysis_result = EvaluateBoard.analysis_result;

/*
//局面評価クラスの使用方法のイメージ　
var position = "fen rnbqkbnr/pp1ppppp/8/2p5/4P3/5N2/PPPP1PPP/RNBQKB1R b KQkq - 1 2";
var evaluator = new EvaluateBoard(position,2);
evaluator.executeCallbackfuncAfterEvaluationFinish( function(){
    console.log(evaluator.analysis_result);
});
*/
