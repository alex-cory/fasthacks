var http = require('http'),
	flights = require('./data'),
	db = require('./db'),
	app = require('./app')(flights, db);	// these variables are passed in here for unit testing purposes and to be used throughout the app

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});