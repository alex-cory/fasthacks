/*jshint asi:true, esnext:true */

var should = require('should')
  , nsh = require('../node-syntaxhighlighter')
  ;

describe('inline scripts', function () {
  describe('highlighting inline javascript', function () {

      var code = [
          '<!DOCTYPE HTML>'
        , '<html>'
        , '<head>'
        , '   <meta http-equiv="content-type" content="text/html; charset=utf-8"/>'
        , '   <title>Page of Self with inline JavaScript</title>'
        , ' <script>'
        , '    var foo = bar( function() {'
        , '      alert("foo");'
        , '    });'
        , ' </script>'
        , '</head>'
        , '<body>'
        , '<h1>Page of Self with inline JavaScript</h1>'
        , '</body>'
        , '</html>'
      ].join('\n')

      , expectedLines = [
          '<div class="line number7 index0 alt2"><code class="keyword">var</code> <code class="plain">foo = bar( </code><code class="keyword">function</code><code class="plain">() {</code></div>'
        , '<div class="line number8 index1 alt1"><code class="undefined spaces">&nbsp;&nbsp;</code><code class="plain">alert(</code><code class="string">"foo"</code><code class="plain">);</code></div>'
        , '<div class="line number9 index2 alt2"><code class="plain">});</code></div>'
        ]
      , highlight
      ;
    
    describe('when I specify html when getting the language', function () {
      beforeEach(function () {
        var language = nsh.getLanguage('html');

        highlight = nsh.highlight(code, language);
      })

      it('highlights each javascript line', function () {
        expectedLines.forEach(function (line) {
          highlight.should.include(line);
        });
      })
    })
  })
  
  describe('highlighting inline action script', function () {

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
        ].join('\n')

      , expectedLines = [
            '<div class="line number5 index4 alt2"><code class="undefined spaces">&nbsp;</code><code class="color2">&lt;![CDATA[</code></div>'
          , '<div class="line number6 index0 alt1"><code class="keyword">import</code> <code class="plain">mx.controls.Alert;</code></div>'
          , '<div class="line number7 index1 alt2">&nbsp;</div>'
          , '<div class="line number8 index2 alt1"><code class="keyword">public</code> <code class="color3">function</code> <code class="plain">myFunction(message:</code><code class="keyword">String</code><code class="plain">):</code><code class="keyword">void</code> <code class="plain">{</code></div>'
          , '<div class="line number9 index3 alt2"><code class="undefined spaces">&nbsp;&nbsp;</code><code class="plain">Alert.show(message);</code></div>'
          , '<div class="line number10 index4 alt1"><code class="plain">}</code></div>'
          , '<div class="line number11 index10 alt2"><code class="undefined spaces">&nbsp;</code><code class="color2">]]></code></div>'
        ]
      , highlight
      ;
    
      describe('when I specify xhtml when getting the language', function () {
        beforeEach(function () {
          var language = nsh.getLanguage('xhtml');

          highlight = nsh.highlight(code, language);
        })

        it('highlights each action script line', function () {
          expectedLines.forEach(function (line) {
            highlight.should.include(line);
          });
        })
      })

      describe('when I specify html when getting the language', function () {
        beforeEach(function () {
          var language = nsh.getLanguage('html');

          highlight = nsh.highlight(code, language);
        })

        it('does not highlight the inlined action script', function () {
          highlight.should.not.include(expectedLines[1]);
        })
      })
  })

  describe('highlighting inline php script', function () {

    var code = [
        '<!DOCTYPE HTML>'
      , '<html>'
      , '<head>'
      , '   <meta http-equiv="content-type" content="text/html; charset=utf-8"/>'
      , '   <title>Page of Self with inline PHP</title>'
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
    ].join('\n')
    , expectedLines = [
        '<div class="line number7 index0 alt2"><code class="comments">/***********************************</code></div>'
      , '<div class="line number8 index1 alt1"><code class="comments">** Multiline block comments</code></div>'
      , '<div class="line number9 index2 alt2"><code class="comments">**********************************/</code></div>'
      , '<div class="line number10 index3 alt1">&nbsp;</div>'
      , '<div class="line number11 index4 alt2"><code class="variable">$stringWithUrl</code> <code class="plain">= </code><code class="string">"<a href="http://alexgorbatchev.com">http://alexgorbatchev.com</a>"</code><code class="plain">;</code></div>'
      , '<div class="line number12 index5 alt1">&nbsp;</div>'
      , '<div class="line number13 index6 alt2"><code class="plain">ob_start(</code><code class="string">"parseOutputBuffer"</code><code class="plain">);&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; </code><code class="comments">// Start Code Buffering</code></div>'
      , '<div class="line number14 index7 alt1"><code class="plain">session_start();</code></div>'
      ]
    , highlight
    ; 

    describe('when I specify html when getting the language', function () {
      beforeEach(function () {
        var language = nsh.getLanguage('html');

        highlight = nsh.highlight(code, language);
      })

      it('highlights each php script line', function () {
        expectedLines.forEach(function (line) {
          highlight.should.include(line);
        });
      })
    })
  })
})
