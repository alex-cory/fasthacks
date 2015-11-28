// Prints html version of itself to be used with a syntaxhighlighter style

var nsh      =  require('../node-syntaxhighlighter')
  , fs       =  require('fs')
  , language =  nsh.getLanguage('js')
  , code     =  fs.readFileSync(__filename).toString()
  ;

console.log(
  nsh.highlight(code, language)
);


