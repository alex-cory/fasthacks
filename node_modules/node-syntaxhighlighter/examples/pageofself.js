// Creates html version of itself and wraps it inside html page tags and finally opens it in the browser

var nsh      =  require('../node-syntaxhighlighter')
  , fs       =  require('fs')
  , exec     =  require('child_process').exec
  , code     =  fs.readFileSync(__filename).toString()
  , htmlFile =  './pageofself.html'
  ;

// Choose random style for kicks
var styles =  nsh.getStyles()
  , index  =  Math.floor(Math.random() * styles.length)
  , style  =  styles[index]
  ;

// Highlight code and generate html with style reference included
var language        =  nsh.getLanguage('js')
  , highlightedCode =  nsh.highlight(code, language);

var  html = [
        '<!DOCTYPE HTML>'
      , '<html>'
      , '<head>'
      , '   <meta http-equiv="content-type" content="text/html; charset=utf-8"/>'
      , '   <title>Page of Self</title>'
      , ' <link rel="stylesheet" href="./' + style.name + '.css" type="text/css" media="screen" charset="utf-8" />'
      , '</head>'
      , '<body>'
      , highlightedCode
      , '</body>'
      , '</html'
      ].join('\n');

// Copy style and write html
nsh.copyStyle(style, '.');
fs.writeFileSync(htmlFile, html);

console.log('Opening highlighted page. Using style', style.name);
exec('open ' + htmlFile);

