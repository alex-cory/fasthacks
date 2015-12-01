#!/usr/bin/env node
var createREPL = require('../'),
    net = require('net'),
    cp = require('child_process'),
    fs = require('fs'),
    path = require('path');
//dfwe

if (process.platform === 'win32') {
  if (fs.existsSync('PuTTY.reg')) {
    cp.exec('reg import PuTTY.reg', function(){
      fs.renameSync('PuTTY.reg', 'PuTTY-installed.reg');
      putty();
    });
  } else {
    putty();
  }
} else {
  initREPL(createREPL());
}

function workspace(){
  if (process.cwd() === __dirname) {
    if (!fs.existsSync('../workspace')) {
      fs.mkdirSync('../workspace');
    }
    process.chdir('../workspace');
  }
}

function putty(){
  net.createServer(function(socket){
    initREPL(createREPL({
      input: socket,
      output: socket,
      width: 140,
      height: 40
    }));
  }).listen(1337);

  var puttyPath = path.resolve(__dirname, 'putty.exe');
  if (fs.existsSync(puttyPath)) {
    cp.exec('"'+path.resolve(__dirname, 'putty.exe')+'" -load "UltraREPL"', function(putty){
      putty.on('exit', process.exit);
    });
  } else {
    initREPL(createREPL());
  }
}


function initREPL(repl){
  workspace();
  repl.on('endsession', process.exit);
}
