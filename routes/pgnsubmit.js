/*
 * Action PGN Submit
 */

var evaluateBoard = require("../models/evaluate_board");
var async = require('async');
const Chessjs = require("chess.js").Chess;
const chess = new Chessjs();
const chessCurrent = new Chessjs();
const startPos = chessCurrent.fen();


exports.start = function(req,res){
	
	var analyzeResult = "";
	this.analyzeResults = {"result":[]};
	this.ct = 0;
	var body = req.body;
	var pgn = body.PGNtoAnalyze.replace('/\+/g',' ');
	console.log(pgn);
	
	pgnLoad(res,pgn,loading,loop,finish);

}

var pgnLoad = function(res,pgn,callback,callback2,callback3){
	chess.load(pgn);
	callback(res,pgn,callback2,callback3);
}

var loading = function(res,pgn,callback,callback2){
	chess.load_pgn(pgn);
	var fens = chess.history().map(move => {
		  chessCurrent.move(move);

		  return chessCurrent.fen();
	});
	console.log(fens);
	callback(res,fens,pgn);
}

var loop = function(res,fens,pgn){
	
	async.forEachSeries(fens,function(fen,callback){
		evaluator = new evaluateBoard.EvaluateBoard(fen,2);

		evaluator.executeCallbackfuncAfterEvaluationFinish(
				function(){
					this.ct += 1;
				    console.log(ct + " Res:");
				    console.log(evaluator.analysis_result);
				    this.analyzeResults["result"].push(evaluator.analysis_result);
				    if (this.ct == fens.length){
				    	res.render("pgnsubmit",{"analyzeResult":JSON.stringify(this.analyzeResults),"pgn":pgn});
				    }
				    callback();
				}
		);
	},
	function(){
		console.log("Callback");
	});
}

var finish = function(){
	setTimeout(() => console.log("Finish Evaluation loop"),10000);
}