var db;
var MongoClient = require('mongodb').MongoClient;


//Connection URL
var url = 'mongodb://localhost:27017/Chess-Commentary-Automatic';

MongoClient.connect(url, function(err, mongodb) {
	  console.log("Connected correctly to server");
	  db = mongodb;
});

var collection = function( name ) {
	  return db.collection( name );
};

exports.collection = collection;

collection = collection("test");
collection.insertOne();