#!/usr/bin/env node

var repl = require('repl'),
	flight = require('./flight');

var prompt = repl.start({prompt: 'flight> '});

prompt.context.flight = flight;