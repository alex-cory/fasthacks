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
    '<?xml version="1.0" encoding="utf-8"?>'
  , '<s:Application  xmlns:fx="http://ns.adobe.com/mxml/2009"'
  , '                xmlns:s="library://ns.adobe.com/flex/spark">'
  , ' <fx:Script>'
  , ' <![CDATA['
  , '   import mx.controls.Alert;'
  , '   '
  , '   public function myFunction(message:String):void {'
  , '     Alert.show(message);'
  , '   }'
  , ' ]]>'
  , ' </fx:Script>'
  , '</s:Application>'
].join('\n');

// Note: we specifically request xhtml highlighting in order to make sure the ActionScript highlighter kicks in for ![CDATA sections
var language        =  nsh.getLanguage('xhtml');
var highlightedCode =  nsh.highlight(code, language);

var  html = [
        '<!DOCTYPE HTML>'
      , '<html>'
      , '<head>'
      , '   <meta http-equiv="content-type" content="text/html; charset=utf-8"/>'
      , '   <title>Page of Self with inline ActionScript</title>'
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

