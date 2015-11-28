#!/usr/bin/env node
var marked = require('marked'),
    fs = require('fs'),
    request = require('request'),
    childproc = require('child_process'),
    glob = require('multi-glob').glob,
    term = require('terminal-kit').terminal,
    TerminalRenderer = require('marked-terminal');

marked.setOptions({ 
  renderer: new TerminalRenderer() 
}); 

var mod = process.argv[2];

var lines = [];
var line = 0;

var rows = term.height - 1;
var pageNum = 1;
var lastShown = 0;

var nextStatus = '';

function statusLine(str) {
  term.moveTo(1,term.height);
  if (!str) str = "q: quit, n/p/pgup/pgdown, up/down arrow: scroll, /: search" +
      "  Line " + (line+1) + " of " + lines.length;
  term.eraseLine();
  term.dim.bgBlack.white(str);
  term.column(1);               
}

var searched = '';
function search(text) {
  searched = text;
  statusLine('Searching for "'+text+'"');
  setTimeout(function() {
    var found = false;
    var l = line;
    do {
      l++;
      found = l<lines.length &&lines[l].indexOf(text)>=0;
    } while (!found && l < lines.length);
   if (found) {
     line = l;
     nextStatus = 'Found ' + text;
     showPage(l);
   } else {
     statusLine('Not found.');
   }
 }, 1);
}

function showPage(startLine) {
  term.clear();
  var endLine = startLine + rows;
  var i = startLine;

  function inner() {
    if (i < lines.length -1) {
      console.log(lines[i]);
    }
    if (i-startLine < (rows-3)) {
      i+=1;
      inner();
    } else {
      term.getCursorLocation(function(err, x, y) {
        if (y < rows-1 && i < endLine && i<lines.length-1) {
          i += 1;
          inner();
        } else {
          statusLine(nextStatus);
          if (nextStatus) nextStatus = '';
          lastShown = i;
        }
      });
    }
  }
  inner();
}

function showLine(line) {
  if (line < lines.length-1) {
    term.moveTo(1, term.height);
    term.eraseLine();
    console.log(lines[line]);
  }
  statusLine();
}

var tries = 0;
var inp = true;

function load(readme) {
  var rendered = marked(readme);
  lines = rendered.split('\n');

  term.grabInput(true);

  term.on('key', function(name, matches, data) {
    if (!inp) return false;
    switch (name) {
      case 'q':
        term.grabInput(false);
        process.exit(0);
        break;
      case 'DOWN':
        if (line < lines.length-1) line += 1;
        if (lastShown < line+rows-1) {
          lastShown += 1;
          showLine(lastShown);
        } else {
          showLine(line+rows-1);
        }
        break;
      case 'UP':
        if (line > 0) {
          line -= 1;
          term.moveTo(1,1);
          term.insertLine(1);
          term.moveTo(1,1);
          console.log(lines[line]);
          statusLine();
        }
        break;
      case 'p':
      case 'PAGE_UP':
        if (line > 0) line -= Math.round(rows/2);
        if (line < 0) line = 0;
        showPage(line); 
        break;
      case 'n':
      case 'PAGE_DOWN':
        if (line < lines.length-1) line += Math.round(rows/2);
        if (line > lines.length-1) line = lines.length-rows-1;
        if (lastShown+1<line) {
          lastShown +=1;
          line = lastShown;
        }
        showPage(line);
        break;
      case '/':
        //term.grabInput(false);
        inp = false;
        term.moveTo(1,term.height);
        term.eraseLine();
        term.dim.bgBlack.white("Enter search text (or enter to repeat last): "); 
        term.inputField({echo:true},function(er,text) {
          if (!text || text.length==0) text = searched;
          inp = true;
          term.grabInput(true);
          search(text);
        });        
        break;
    }
  });
  if (lines.length < rows) {
    console.log(rendered);
    term.grabInput(false);
    process.exit();
  } else {
    showPage(0);
  }
}

request('http://registry.npmjs.com/'+mod, function(e,r,pkg) {
  pkg = JSON.parse(pkg);
  load(pkg.readme);
});

