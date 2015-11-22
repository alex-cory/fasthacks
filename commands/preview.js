#!/usr/bin/env node
var program = require('commander');
var fs = require('fs');
var path = require('path');
// var hljs = require('highlight.js');
// var cardinal = require('cardinal');
// var highlight = require('console-highlight');
// var highlight = require('../../cli-syntax-highlighter');
// console.log(process.cwd());
var pygmentize = require('pygmentize-bundled');

program
  .arguments('<input>')
  // .option('-u, --username <username>', 'The user to authenticate as')
  // .option('-p, --password <password>', 'The user\'s password')
  .action(function(input) {
    
    var file = {};
    // grab the file name
    file.name = input;
    // grab the file exstention (i.e. html, rb, js, etc.)
    file.ext = path.extname(file.name).slice(1,12);
    var options = {lang: file.ext, format: 'console'};
    if (file.ext == 'md') {
      options.lang = 'rst';
    } else if (file.ext == 'conf') {
      options.lang = 'cfg';
    }
    fs.readFile(file.name, 'utf8', function (err,chunk) {
      if (err) { return console.log(err); }

      file.contents = chunk;
      // run through Pygments and color it!
      pygmentize(options, file.contents, function (err, result) {
        process.stdout.write(result);
      });
      // console.log(cardinal.highlight(data, {linenos: true}));
    });
  })
  .parse(process.argv);


// #!/usr/bin/env node
// var program = require('commander');
// var fs = require('fs');
// var path = require('path');
// // var hljs = require('highlight.js');
// // var cardinal = require('cardinal');
// // var highlight = require('console-highlight');
// // var highlight = require('../../cli-syntax-highlighter');
// // console.log(process.cwd());
// var pygmentize = require('pygmentize-bundled');
//
// function highlight(code, options) {
//   // options || (options = {lang: 'sh', format: 'console'});
//
//   pygmentize(options, code, function (err, result) {
//     process.stdout.write(result);
//   });
// }
// // highlight({format: 'console' }, 'var a = "b";', function (err, result) {
// //   console.log(result.toString());
// // });
//
// program
//   .arguments('<file>')
//   // .option('-u, --username <username>', 'The user to authenticate as')
//   // .option('-p, --password <password>', 'The user\'s password')
//
//   .action(function(file) {
//     
//     var ext = path.extname(file);
//     var options = {lang: 'console', format: 'console', options: {startinline: 1}};
//     // options.lang = (ext != '' || ext != '.') ? ext.slice(1,1) : 'sh';
//     if (ext == '.md') {
//       options.format = 'rst';
//       options.lang = 'rst';
//     } else if (ext == '.conf') {
//       options.format = 'cfg';
//       options.lang = 'cfg';
//     }
//     fs.readFile(file, 'utf8', function (err,data) {
//       if (err) { return console.log(err); }
//
//       pygmentize(options, data, function (err, result) {
//         process.stdout.write(result);
//         // console.log(result);
//       });
//       // highlight(data, options);
//       // console.log(highlight(data#<{(|, {
//       //   // optional options
//       //   language: 'javascript', // will auto-detect if omitted
//       //   theme: 'default' // a highlight.js theme
//       // }|)}>#));
//       // console.log(cardinal.highlight(data, {linenos: true}));
//     });
//   })
//   .parse(process.argv);

//
// #!/usr/bin/env node
// var program = require('commander');
// var fs = require('fs');
// var path = require('path');
// // var hljs = require('highlight.js');
// // var cardinal = require('cardinal');
// // var highlight = require('console-highlight');
// // var highlight = require('../../cli-syntax-highlighter');
// // console.log(process.cwd());
// var pygmentize = require('pygmentize-bundled');
//
// function highlight(code, options) {
//   // options || (options = {lang: 'sh', format: 'console'});
//
//   pygmentize(options, code, function (err, result) {
//     process.stdout.write(result);
//   });
// }
// // highlight({format: 'console' }, 'var a = "b";', function (err, result) {
// //   console.log(result.toString());
// // });
//
// program
//   .arguments('<file>')
//   // .option('-u, --username <username>', 'The user to authenticate as')
//   // .option('-p, --password <password>', 'The user\'s password')
//
//   .action(function(file) {
//     
//     var ext = path.extname(file);
//     var options = {lang: 'console', format: 'console', options: {startinline: 1}};
//     // options.lang = (ext != '' || ext != '.') ? ext.slice(1,1) : 'sh';
//     if (ext == '.md') {
//       options.format = 'rst';
//       options.lang = 'rst';
//     } else if (ext == '.conf') {
//       options.format = 'cfg';
//       options.lang = 'cfg';
//     }
//     fs.readFile(file, 'utf8', function (err,data) {
//       if (err) { return console.log(err); }
//
//       pygmentize(options, data, function (err, result) {
//         process.stdout.write(result);
//         // console.log(result);
//       });
//       // highlight(data, options);
//       // console.log(highlight(data#<{(|, {
//       //   // optional options
//       //   language: 'javascript', // will auto-detect if omitted
//       //   theme: 'default' // a highlight.js theme
//       // }|)}>#));
//       // console.log(cardinal.highlight(data, {linenos: true}));
//     });
//   })
//   .parse(process.argv);
//
//
// //   })
// //   .parse(process.argv);
// //
// //
