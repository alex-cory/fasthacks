#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var path = require('path');
var pygmentize = require('pygmentize-bundled');
var childproc = require('child_process');
// var glob = require('multi-glob').glob;
var termkit = require( 'termkit.js' ) ;
var term = termkit.terminal ;

var formats = [
  {
    ext: ['log', ''],
    lang: 'sh'
  },
  {
    ext: ['md'],
    lang: 'rst'
  },
  {
    ext: ['conf', 'notes', 'curl', 'ping', 'config'],
    lang: 'cfg'
  }
];

/**
 * Polyfill helper for finding syntax for languages that aren't supported
 */
function parse(fileExt) {
  var lang = 'sh';
  for (var format of formats) {
    for (var ext of format.ext) {
      if (fileExt == ext) {
        return format.lang;
      } else {
        return fileExt;
      }
    }
  }
}

program
  .arguments('<input>')
  // .option('-u, --username <username>', 'The user to authenticate as')
  // .option('-p, --password <password>', 'The user\'s password')
  .action(function(input) {

    var file = {};
    file.path = input;
    file.name = path.basename(file.path);
    file.ext = path.extname(file.path).slice(1, path.extname(file.path).length);

    var options = {};
    options.lang = parse(file.ext);
    options.format = 'console';

    fs.readFile(file.path, 'utf8', function (err,chunk) {
      if (err) { return console.log(err); }

      file.content = chunk;

      pygmentize(options, file.content, function (err, result) {
        file.content = result.toString();
        process.stdout.write(result); // to just spit it out

        // loadOverlay(file);
      });
    });
  })
  .parse(process.argv);

// var mod = process.argv[2];
//
// var lines = [];
// var line = 0;
//
// var rows = term.height - 1;
// var pageNum = 1;
// var lastShown = 0;
//
// var nextStatus = '';
//
// function statusLine(str) {
//   term.moveTo(1,term.height);
//   if (!str) str = "q: quit, n/p/pgup/pgdown, up/down arrow: scroll, /: search" +
//       "  Line " + (line+1) + " of " + lines.length;
//     term.eraseLine();
//   term.dim.bgBlack.white(str);
//   term.column(1);
// }
//
// var search = '';
// function search(text) {
//   search = text;
//   statusLine('Searching for "'+text+'"');
//   setTimeout(function() {
//     var found = false;
//     var l = line;
//     do {
//       l++;
//       found = l<lines.length &&lines[l].indexOf(text)>=0;
//     } while (!found && l < lines.length);
//     if (found) {
//       line = l;
//       nextStatus = 'Found ' + text;
//       showPage(l);
//     } else {
//       statusLine('Not found.');
//     }
//   }, 1);
// }

// function showPage(startLine) {
//   term.clear();
//   var endLine = startLine + rows;
//   var i = startLine;
//
//   function inner() {
//     if (i < lines.length -1) {
//       console.log(lines[i]);
//     }
//     if (i-startLine < (rows-3)) {
//       i+=1;
//       inner();
//     } else {
//       term.getCursorLocation(function(err, x, y) {
//         if (y < rows-1 && i < endLine && i<lines.length-1) {
//           i += 1;
//           inner();
//         } else {
//           statusLine(nextStatus);
//           if (nextStatus) nextStatus = '';
//           lastShown = i;
//         }
//       });
//     }
//   }
//   inner();
// }

// function showLine(line) {
//   if (line < lines.length-1) {
//     term.moveTo(1, term.height);
//     term.eraseLine();
//     console.log(lines[line]);
//   }
//   statusLine();
// }

// var tries = 0;
// var inp = true;

// function loadOverlay(file) {
//
//   function terminate() {
//     setTimeout( function() {
//       //term.brightBlack( 'About to exit...\n' ) ;
//       term.grabInput( false ) ;
//       term.fullscreen( false ) ;
//       term.applicationKeypad( false ) ;
//       term.beep() ;
//
//       // Add a 100ms delay, so the terminal will be ready when the process effectively exit, preventing bad escape sequences drop
//       setTimeout( function() { process.exit() } , 100 ) ;
//     } , 100 ) ;
//   } 
//
//
//
//   term.fullscreen() ;
//   term.moveTo( 0 , 1 ).bgWhite.blue( 'Welcome to Neon!   ' ).bgWhite.green( 'CTRL-C to quit' ) ;
//   term.grabInput() ;
//
//
//
//   var attrs = [
//     termkit.ScreenBuffer.DEFAULT_ATTR ,
//     { color: 'red', bgColor: 'black' } ,
//     { color: 'green', bgColor: 'black' } ,
//     { color: 'blue', bgColor: 'black' } ,
//     { color: 'red', bgColor: 'black' , bold: true , italic: true } ,
//     { color: 'red', bgColor: 'yellow' } ,
//   ] ;
//
//   var attrsIndex = 0 ;
//
//   var emptyAttrs = [
//     { bgColor: 'yellow' } ,
//     { bgColor: 'brightYellow' } ,
//     { bgColor: 'red' } ,
//     { bgColor: 'blue' } ,
//     termkit.ScreenBuffer.DEFAULT_ATTR ,
//   ] ;
//
//   var emptyAttrsIndex = 0 ;
//
//
//
//   term.on( 'key' , function( key , matches , data ) {
//
//     switch (key) {
//       case 'k':
//       case 'UP':
//         tbuf.scrollUp(25)
//         break;
//       case 'j':
//       case 'DOWN':
//         tbuf.scrollDown(25);
//         break ;
//       case 'CTRL_C' :
//         terminate() ;
//         break ;
//     }
//   });
//
//   var sbuf = termkit.ScreenBuffer.create( { dst: term , width: 20 , height: 8 , x: 2 , y: 2 } ) ;
//
//   var tbuf = termkit.TextBuffer.create({dst: sbuf}) ;
//   tbuf.setEmptyCellAttr( emptyAttrs[ emptyAttrsIndex ] ) ;
// //   file.lines = file.content.split('\n');
// //
// //   term.grabInput(true);
// //
// //   term.on('key', function(name, matches, data) {
// //     if (!inp) return false;
// //     switch (name) {
// //       case 'q':
// //         term.grabInput(false);
// //         process.exit(0);
// //       break;
// //       // case 'DOWN':
// //       //   if (line < lines.length-1) line += 1;
// //       //   if (lastShown < line+rows-1) {
// //       //     lastShown += 1;
// //       //     showLine(lastShown);
// //       //   } else {
// //       //     showLine(line+rows-1);
// //       //   }
// //       // break;
// //       // case 'UP':
// //       //   if (line > 0) {
// //       //     line -= 1;
// //       //     term.moveTo(1,1);
// //       //     term.insertLine(1);
// //       //     term.moveTo(1,1);
// //       //     console.log(lines[line]);
// //       //     statusLine();
// //       //   }
// //       // break;
// //       // case 'p':
// //       // case 'PAGE_UP':
// //       //   if (line > 0) line -= Math.round(rows/2);
// //       //   if (line < 0) line = 0;
// //       //   showPage(line);
// //       // break;
// //       // case 'n':
// //       // case 'PAGE_DOWN':
// //       //   if (line < lines.length-1) line += Math.round(rows/2);
// //       //   if (line > lines.length-1) line = lines.length-rows-1;
// //       //   if (lastShown+1<line) {
// //       //     lastShown +=1;
// //       //     line = lastShown;
// //       //   }
// //       //   showPage(line);
// //       // break;
// //       // case '/':
// //       //   term.grabInput(false);
// //       //   inp = false;
// //       //   term.moveTo(1,term.height);
// //       //   term.eraseLine();
// //       //   term.dim.bgBlack.white("Enter search text (or enter to repeat last): ");
// //       //   term.inputField({echo:true},function(er,text) {
// //       //     if (!text || text.length==0) text = search;
// //       //     inp = true;
// //       //     term.grabInput(true);
// //       //     search(text);
// //       //   });
// //       // break;
// //     }
// //   });
// //   // if (lines.length < rows) {
// //   //   console.log(rendered);
// //   //   term.grabInput(false);
// //   //   process.exit();
// //   // } else {
// //   //   showPage(0);
// //   // }
// }
//
//
//
//
//
//
// // function terminate() {
// //   setTimeout( function() {
// //     //term.brightBlack( 'About to exit...\n' ) ;
// //     term.grabInput( false ) ;
// //     term.fullscreen( false ) ;
// //     term.applicationKeypad( false ) ;
// //     term.beep() ;
// //
// //     // Add a 100ms delay, so the terminal will be ready when the process effectively exit, preventing bad escape sequences drop
// //     setTimeout( function() { process.exit() } , 100 ) ;
// //   } , 100 ) ;
// // }
// //
// //
// //
// // term.fullscreen() ;
// // term.moveTo( 0 , 1 ).bgWhite.blue( 'Welcome to Neon!   ' ).bgWhite.green( 'CTRL-C to quit' ) ;
// // term.grabInput() ;
// //
// //
// //
