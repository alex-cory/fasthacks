

# String Kit

A string manipulation toolbox, featuring a string formatter (inspired by sprintf), a variable inspector
(output featuring ANSI colors and HTML) and various escape functions (shell argument, regexp, html, etc).

* License: MIT
* Current status: beta
* Platform: Node.js only (browser support is planned)



# Install

Use Node Package Manager:

    npm install string-kit



# Reference

* [.format()](#ref.format)
* [.format.count()](#ref.format.count)
* [.inspect()](#ref.inspect)
* Escape functions collection
	* [.escape.shellArg()](#ref.escape.shellArg)
	* [.escape.regExp()](#ref.escape.regExp)
	* [.escape.regExpPattern()](#ref.escape.regExp)
	* [.escape.regExpReplacement()](#ref.escape.regExpReplacement)
	* [.escape.html()](#ref.escape.html)
	* [.escape.htmlAttr()](#ref.escape.htmlAttr)
	* [.escape.htmlSpecialChars()](#ref.escape.htmlSpecialChars)
	* [.escape.control()](#ref.escape.control)



<a name="ref.format"></a>
### .format( formatString , ... )

* formatString `String` a string containing some `sprintf()`-like formating
* ... `mixed` a variable list of arguments to insert into the formatString

This function is inspired by the `C`'s `sprintf()` function.

Basicly, if `formatString` includes *format specifiers* (subsequences beginning with %), the additional arguments
following `formatString` are formatted and inserted in the resulting string replacing their respective specifiers.

Also it diverges from `C` in quite a few places.

Basic usage:
```js
var format = require( 'string-kit' ).format ;
console.log( format( 'Hello %s %s, how are you?' , 'Joe' , 'Doe' ) ) ;
// Output: 'Hello Joe Doe, how are you?'
```

Specifiers:
* %% write a single %
* %s string
* %f float
* %d *or* %i integer
* %u unsigned integer
* %U unsigned positive integer (>0)
* %h unsigned hexadecimal
* %x unsigned hexadecimal, force pair of symbols (e.g. 'f' -> '0f')
* %o unsigned octal
* %b unsigned binary
* %I call string-kit's inspect()
* %E call string-kit's inspectError()
* %J JSON.stringify()
* %D drop, the argument does not produce anything but is eaten anyway
* %[ filter function existing in the *this* context, e.g. %[filter:%a%a]
* %a argument for a filter function

Few examples:
```js
var format = require( 'string-kit' ).format ;

console.log( format( 'This company regains %d%% of market share.' , 36 ) ) ;
// Output: 'This company regains 36% of market share.'

console.log( format( '11/8=%f' , 11/8 ) ) ;
// Output: '11/8=1.375'

console.log( format( 'Hexa %h %x' , 11 , 11 ) ) ;
// Output: 'Hexa b 0b'
```

We can insert a number between the *%* sign and the letter of the specifier, this way, rather than using the next
argument, it uses the *Nth* argument, this is the absolute position:
```js
console.log( format( '%2s%1s%3s' , 'A' , 'B' , 'C' ) ) ; // 'BAC'
```

Also, the internal pointer is moved anyway, so the *Nth* format specifier still use the *Nth* argument if it doesn't
specify any position:
```js
console.log( format( '%2s%s%s' , 'A' , 'B' , 'C' ) ) ; // 'BBC'
```

If the number is preceded by a *plus* or a *minus* sign, the relative position is used rather than the absolute position.
```js
console.log( format( '%+1s%-1s%s' , 'A' , 'B' , 'C' ) ) ; // 'BAC'
```

Use case: language.
```js
var hello = {
	en: 'Hello %s %s!' ,
	jp: 'Konnichiwa %2s %1s!'
} ;

console.log( format( hello[ lang ] , firstName , lastName ) ) ;
// Output the appropriate greeting in a language.
// In japanese the last name will come before the first name,
// but the argument list doesn't need to be changed.
```

The mysterious `%[` format specifier is used when we want custom formatter.
Firstly we need to build an object containing one or many functions.
Then, `format()` should be used with `call()`, to pass the functions collection as the *this* context.

The `%[` is followed by the function's name, followed by a `:`, followed by a variable list of arguments using `%a`.
It is still possible to use relative and absolute positionning.
The whole *format specifier* is finished when a `]` is encountered.

Example:
```js
var filters = {
	fxy: function( a , b ) { return '' + ( a * a + b ) ; }
} ;

console.log( format.call( filters , '%s%[fxy:%a%a]' , 'f(x,y)=' , 5 , 3 ) ) ;
// Output: 'f(x,y)=28'

console.log( format.call( filters , '%s%[fxy:%+1a%-1a]' , 'f(x,y)=' , 5 , 3 ) ) ;
// Output: 'f(x,y)=14'
```



<a name="ref.format.count"></a>
### .format.count( formatString )

* formatString `String` a string containing some `sprintf()`-like formating

It just counts the number of *format specifier* in the `formatString`.



<a name="ref.inspect"></a>
### .inspect( [options] , variable )

* options `Object` display options, the following key are possible:
	* style `String` this is the style to use, the value can be:
		* 'none': (default) normal output suitable for console.log() or writing into a file
		* 'color': colorful output suitable for terminal
		* 'html': html output
	* depth: depth limit, default: 3
	* nofunc: do not display functions
	* funcDetails: display function's details
	* proto: display object's prototype
* variable `mixed` anything we want to inspect/debug

It inspect a variable, and return a string ready to be displayed with console.log(), or even as HTML output.

It produces a slightly better output than node's `util.inspect()`, with more options to control what should be displayed.

Since `options` come first, it is possible to use `bind()` to create some custom variable inspector.

For example:
```js
var colorInspect = require( 'string-kit' ).inspect.bind( undefined , { style: 'color' } ) ;
```



## Escape functions collection



<a name="ref.escape.shellArg"></a>
### .escape.shellArg( str )

* str `String` the string to filter

It escapes the string so that it will be suitable as a shell command's argument.



<a name="ref.escape.regExp"></a>
### .escape.regExp( str ) , .escape.regExpPattern( str ) 

* str `String` the string to filter

It escapes the string so that it will be suitable to inject it in a regular expression's pattern as a literal string.

Example of a search and replace from a user's input:
```js
var result = data.replace(
	new RegExp( stringKit.escape.regExp( userInputSearch ) , 'g' ) ,
	stringKit.escape.regExpReplacement( userInputReplace )
) ;
```



<a name="ref.escape.regExpReplacement"></a>
### .escape.regExpReplacement( str )

* str `String` the string to filter

It escapes the string so that it will be suitable as a literal string for a regular expression's replacement.



<a name="ref.escape.html"></a>
### .escape.html( str )

* str `String` the string to filter

It escapes the string so that it will be suitable as HTML content.

Only  `< > &` are replaced by HTML entities.



<a name="ref.escape.htmlAttr"></a>
### .escape.htmlAttr( str )

* str `String` the string to filter

It escapes the string so that it will be suitable as an HTML tag attribute's value.

Only  `< > & "` are replaced by HTML entities.

It assumes valid HTML: the attribute's value should be into double quote, not in single quote.



<a name="ref.escape.htmlSpecialChars"></a>
### .escape.htmlSpecialChars( str )

* str `String` the string to filter

It escapes all HTML special characters, `< > & " '` are replaced by HTML entities.



<a name="ref.escape.control"></a>
### .escape.control( str )

* str `String` the string to filter

It escapes all ASCII control characters (code lesser than or equals to 0x1F, or *backspace*).

*Carriage return*, *newline* and *tabulation* are respectively replaced by `\r`, `\n` and `\t`.
Other characters are replaced by the unicode notation, e.g. `NUL` is replaced by `\x00`.





Full BDD spec generated by Mocha:


