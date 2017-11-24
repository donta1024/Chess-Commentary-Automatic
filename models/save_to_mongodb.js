var db;
var MongoClient = require('mongodb').MongoClient;
var assert = require("assert");

//Connection URL
var url = 'mongodb://localhost:27017/Chess-Commentary-Automatic';

function insertDocuments(db, table, insertJson, callback) {
    collection = db.collection(table);
    collection.insertOne(
        insertJson, function(err, result) {
            assert.equal(err, null);
            callback(result);
        });
}

function searchDocuments(db,table,fenPosition,callback){
	var result = null;
	collection = db.collection(table);
	collection.findOne({"fen_position":fenPosition},(err,result)=>{
		callback(result);		
	});

	return result;
}



var insertIntoMongoDB = function (table, insertJson){
	MongoClient.connect(url, function(err, mongodb) {
		  assert.equal(null, err);
		  console.log("Connected correctly to server");
		  db = mongodb;
		  
		  insertDocuments(db, table, insertJson, function() {
			  db.close();
		  });
	});
}

var searchFromMongoDB = function(table,fenPosition){
	var ret = null;
	MongoClient.connect(url, function(err, mongodb) {
		  assert.equal(null, err);
		  console.log("Connected correctly to server");
		  db = mongodb;
		  
		  ret = searchDocuments(db, table, fenPosition, function(result) {
			  db.close();
		  });
	});
	return ret;
}

exports.insertIntoMongoDB = insertIntoMongoDB;
exports.searchFromMongoDB = searchFromMongoDB;
