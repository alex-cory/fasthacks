# node-syntaxhighlighter [![Build Status](https://secure.travis-ci.org/thlorenz/node-syntaxhighlighter.png)](http://travis-ci.org/thlorenz/node-syntaxhighlighter)

Node friendly version of [Alex Gorbachev's great SyntaxHighlighter](http://alexgorbatchev.com/SyntaxHighlighter/).

# Why

Using the [current version of SyntaxHighlighter](https://github.com/alexgorbatchev/SyntaxHighlighter) with nodejs is not straight forward.

Although it can be installed with npm by using the git repo url as package name, it is not obvious on how to use it with nodejs.

**node-syntaxhighlighter** tries to fix that and expose a nodejs friendly api to SyntaxHighlighter. 

# Example

```javascript
var nsh      =  require('node-syntaxhighlighter')
  , language =  nsh.getLanguage('js')
  , code     =  'var nshRocks = true;'
  ;

console.log(
  nsh.highlight(code, language)
);
```

Outputs:

```html
<div id="highlighter_310085" class="syntaxhighlighter  ">
    <table border="0" cellpadding="0" cellspacing="0">
        <tbody>
            <tr>
                <td class="gutter">
                    <div class="line number1 index0 alt2">1</div>
                </td>
                <td class="code">
                    <div class="container">
                        <div class="line number1 index0 alt2">
                            <code class="keyword">var</code>
                            <code class="plain">nshRocks =</code>
                            <code class="keyword">true</code>
                            <code class="plain">;</code>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</div>
```

More examples inside [examples folder](./node-syntaxhighlighter/tree/master/examples).

## Try full page example 


After installing the package run [pageofself](./node-syntaxhighlighter/blob/master/examples/pageofself.js) like so:

```shell
npm explore node-syntaxhighlighter
cd examples
node pageofself
```

# API

## *getLanguage(alias, strict = false)*

Resolves SyntaxHighlighter language for given alias and tries to use similar languages if strict is false.
Returns that language or undefined if not found.

- alias: can be any alias known to SyntaxHighlighter or a file extension, e.g.,'javascript', 'js' or '.js'
- strict: if false similar languages are returned if exact match isn't found

## *highlight(code, language[, options])*

Highlights given code with SyntaxHighlighter language using given options with exceptions (see below).

For more information about options consult the [SyntaxHighlighter configuration page](http://alexgorbatchev.com/SyntaxHighlighter/manual/configuration/).

- code: the code to highlight
- language: language object obtained via ***getLanguage***

**Option Exceptions:**

***'html-script'***: 

- this option is ignored, since node-syntaxhighlighter will automatically find contained scripts inside html and xhtml documents
- just highlight the page with ***'html'*** alias and code inside recognized script tags will be highlighted using the language specific highlighter
- for more information consult the [inline script examples](./node-syntaxhighlighter/tree/master/examples/inline-scripts) and the [inline script tests](./node-syntaxhighlighter/blob/master/test/inlinescripts.js)

## *getStyles()*

Returns all available styles in the following format:

```javascript
{ name: 'stylename', sourcePath: '/path/to/style.css' }
```

## *copyStyle(style, targetPath, callback)*

Copies the given ***style*** to the given ***target path*** as 'stylename.css' and invokes ***callback*** when finished.

- style: either its name (e.g., default) or one of the style objects returned from ***getStyles()***.
- targetPath: **full** path to which to copy the 'stylename.css'
- callback: invoked either with null or ***Error*** if an error occurred

## *copyStyles(targetPath, callback)*

Copies all available styles to the given ***target path*** as 'stylename.css' and invokes ***callback*** when finished.

- targetPath: **full** path to which to copy the styles
- callback: invoked either with null or ***Error*** if an error occurred

# Syncing with original SyntaxHighlighter

node-syntaxhighlighter includes a synchronization script which allows staying up to date with the original SyntaxHighlighter.

I will run this whenever a new version of SyntaxHighlighter becomes available and the publish the updated version.

The currently synced version is documented inside [package.json](./node-syntaxhighlighter/blob/master/package.json) as the "version-sync".

