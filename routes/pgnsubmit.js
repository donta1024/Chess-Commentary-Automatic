/*
 * Action PGN Submit
 */

var evaluateBoard = require("../models/evaluate_board");
var async = require('async');
var Step = require('step');
const Chessjs = require("chess.js").Chess;
const chess = new Chessjs();
const chessCurrent = new Chessjs();
const startPos = chessCurrent.fen();

exports.start = function(req,res){
	var body = req.body;
	var analyzeResult = "";
	var analyzeResults = "";
	var ct = 0;
	var pgn = body.PGNtoAnalyze.replace('/\+/g',' ');


	chess.load_pgn(pgn);
	var fens = chess.history().map(move => {
		  chessCurrent.move(move);

		  return chessCurrent.fen();
	});
	console.log(fens);
				
	async.forEachSeries(fens,function(fen,callback){
		evaluator = new evaluateBoard.EvaluateBoard(fen,2);
		
		evaluator.executeCallbackfuncAfterEvaluationFinish( function(){
			ct += 1;
		    console.log("Res:");
		    console.log(evaluator.analysis_result);
		    analyzeResults += JSON.stringify(evaluator.analysis_result);
		    if (ct == fens.length){
		    	res.render("pgnsubmit",{"analyzeResult":analyzeResults});
		    }
		});
		setTimeout(callback, 6000);
	},
	console.log("Finish Eval!"));
}