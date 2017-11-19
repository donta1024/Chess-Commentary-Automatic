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

exports.insertIntoMongoDB = insertIntoMongoDB;
