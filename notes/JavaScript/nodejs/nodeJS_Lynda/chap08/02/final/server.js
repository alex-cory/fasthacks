var http = require('http'),
	flights = require('./data'),
	db = require('./db'),
	repl = require('repl'),
	app = require('./app')(flights, db);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});

var prompt = repl.start({prompt: 'flights> '});

prompt.context.data = flights;