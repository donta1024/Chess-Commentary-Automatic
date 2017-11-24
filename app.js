/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , fensubmit = require('./routes/fensubmit')
  , pgnsubmit = require('./routes/pgnsubmit')
  , http = require('http')
  , path = require('path');

var app = express();

var bodyparser = require('body-parser');


// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'ejs');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// body parser initialize
app.use(bodyparser.urlencoded({
    extended: true
}));
app.use(bodyparser.json());


// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);
app.post('/fensubmit', fensubmit.start);
app.post('/pgnsubmit', pgnsubmit.start);


function serverSet(app,callback){
	var server = http.createServer(app);
	server.timeout = 10 * 60 * 1000;
	callback(app, server);
}

function serverStart(app,server){
	server.listen(app.get('port'), function(){
	  console.log('Express server listening on port ' + app.get('port'));
	});
}

serverSet(app,serverStart);

