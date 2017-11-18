
/*
 * Action Submit
 */

var evaluateBoard = require("../models/evaluate_board");

exports.start = function(req,res){
	var body = req.body;
	
	var analyzeResult = "";
	
	evaluator = new evaluateBoard.EvaluateBoard(body.FENtoAnalyze,2);
	
	
	evaluator.executeCallbackfuncAfterEvaluationFinish( function(){

	    console.log("Res:");
	    console.log(evaluator.analysis_result);
	    analyzeResult = JSON.stringify(evaluator.analysis_result);

	    res.render('fensubmit',{'FEN':body.FENtoAnalyze,"analyzeResult":analyzeResult});
	});
}