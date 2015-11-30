
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');

var app = express();

// all environments
app.set('port', process.env.PORT || 3000);
app.set('views', __dirname + '/views');
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.bodyParser());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}
//                  .-- the Number Argument is passed in here from the URL (aka user input)
app.get('/flight/:number', routes.flight);
//         request?      ,    response?


http.createServer(app).listen(app.get('port'), function(){
  console.log("Houston, we're a go on port " + app.get('port'));
});

