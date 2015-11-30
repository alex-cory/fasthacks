var http = require('http'),
	flights = require('./data'),
	db = require('./db'),
	app = require('./app')(flights);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});