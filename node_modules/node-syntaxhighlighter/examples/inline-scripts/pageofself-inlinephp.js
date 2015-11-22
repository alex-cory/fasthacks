var nsh      =  require('../../node-syntaxhighlighter')
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

var code = [
    '<!DOCTYPE HTML>'
  , '<html>'
  , '<head>'
  , '   <meta http-equiv="content-type" content="text/html; charset=utf-8"/>'
  , '   <title>Page of Self with inline PHP</title>'
  , ' <link rel="stylesheet" href="'+style.name+'.css" type="text/css" media="screen" charset="utf-8" />'
  , '  <?'
  , '   /***********************************'
  , '   ** Multiline block comments'
  , '   **********************************/'
  , '   '
  , '   $stringWithUrl = "http://alexgorbatchev.com";'
  , '   '
  , '   ob_start("parseOutputBuffer");      // Start Code Buffering'
  , '   session_start();'
  , '   ?>'
  , '</head>'
  , '<body>'
  , '<h1>Page of Self with inline PHP</h1>'
  , '</body>'
  , '</html>'
].join('\n');

var language        =  nsh.getLanguage('html');
var highlightedCode =  nsh.highlight(code, language);

var  html = [
        '<!DOCTYPE HTML>'
      , '<html>'
      , '<head>'
      , '   <meta http-equiv="content-type" content="text/html; charset=utf-8"/>'
      , '   <title>Page of Self with inline PHP</title>'
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
