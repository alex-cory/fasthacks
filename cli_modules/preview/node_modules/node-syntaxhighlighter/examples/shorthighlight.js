var nsh      =  require('../node-syntaxhighlighter')
  , language =  nsh.getLanguage('js')
  , code     =  'var nshRocks = true;'
  ;

console.log(
  nsh.highlight(code, language)
);


