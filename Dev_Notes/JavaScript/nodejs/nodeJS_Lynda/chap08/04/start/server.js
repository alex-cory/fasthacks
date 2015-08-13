#!/usr/bin/env node

var http = require('http'),
	flights = require('./data'),
	db = require('./db'),
	argv = require('optimist').argv,
	repl = require('repl'),						// REPL: Read-Eval-Print-Loop 			(command line tools)
	app = require('./app')(flights, db);

http.createServer(app).listen(app.get('port'), function(){
  console.log('Express server listening on port ' + app.get('port'));
});


// var prompt = repl.start({prompt: 'flights>'});

// prompt.context.data = flights;		 			// where we can set any properties that we want to make global in this REPL

if (argv.flight && argv.destination) {
	flights[argv.flight].data.destination = argv.destination;
};