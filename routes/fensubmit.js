
/*
 * Action Submit
 */

var evaluateBoard = require("../models/evaluate_board");

exports.start = function(req,res){
	var body = req.body;
	
	var analyzeResult = "";
    var analyze_string = body.FENtoAnalyze.replace('/\+/g',' ');
    
    console.log("FEN string: " + analyze_string);
		
	evaluator = new evaluateBoard.EvaluateBoard(analyze_string,2);

	evaluator.executeCallbackfuncAfterEvaluationFinish( function(){

	    console.log("Res:");
	    console.log(evaluator.analysis_result);
	    analyzeResult = JSON.stringify(evaluator.analysis_result);

	    res.render('fensubmit',{'FEN':analyze_string,"analyzeResult":analyzeResult});
	});
}