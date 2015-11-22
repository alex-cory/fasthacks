// var nsh      =  require('./node_modules/node-syntaxhighlighter')
//   , fs       =  require('fs')
//   , language =  nsh.getLanguage('js')
//   , code     =  fs.readFileSync(__filename).toString()
//   ;
//
// console.log(
//   nsh.highlight(code, language)
// );
//

var hljs = require('highlight.js');
var fs = require('fs');
var file = 'package.json';
fs.readFile(file, 'utf8', function (err,data) {
  if (err) { return console.log(err); }
    
      // console.log(highlight('javascript to highlight', {
      //   // optional options
      //   language: 'javascript', // will auto-detect if omitted
      //   theme: 'default' // a highlight.js theme
      // }));
      console.log(hljs.highlightAuto(data.replace(/\n/gi, '')).value);
      // console.log(cardinal.highlight(data, {linenos: true}));
});
