#!/usr/bin/env node

var http = require('http'),
	flights = require('./data'),
	db = require('./db'),
	repl = require('repl'),						// REPL: Read-Eval-Print-Loop 			(command line tools)
	argv = require('optimist').argv,
	app = require('./app')(flights, db);

http.createServer(app).listen(app.get('port'), function(){
  console.log("Houston, we're a go on port " + app.get('port'));
});


var prompt = repl.start({prompt: 'airline>'}); 		// setting up a REPL:
prompt.context.flight = flights;		 			// passing in 'flights' to the 'data' variable
													// context- where we can set any properties that we want to make global in this REPL

// console.log(argv); 								// when typing the terminal command: 'node server --flight 567 --destination LAX' it returns
													// 		an object instead of an array unlike the command directly below does
// console.log(process.argv);

if (argv.flight && argv.destination) {
	flights[argv.flight].data.destination = argv.destination;
};