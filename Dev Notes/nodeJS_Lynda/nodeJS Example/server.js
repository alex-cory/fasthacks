var http = require('http'),
	flights = require('./data'),
	db = require('./db'),
	repl = require('repl'),						// REPL: Read-Eval-Print-Loop 			(command line tools)
	argv = require('optimist').argv,
	app = require('./app')(flights, db);		// these variables are passed in here for unit testing purposes and to be used throughout the app

http.createServer(app).listen(app.get('port'), function(){
	console.log("Houston, we're a go on port " + app.get('port'));
});

// var prompt = argv.start({prompt: 'flights>'});

// prompt.context.data = flights;		 			// where we can set any properties that we want to make global in this REPL