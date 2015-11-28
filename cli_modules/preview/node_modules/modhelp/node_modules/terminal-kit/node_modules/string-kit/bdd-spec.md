# TOC
   - [format()](#format)
   - [Escape collection](#escape-collection)
   - [Camel case](#camel-case)
   - [inspect()](#inspect)
   - [Unicode](#unicode)
<a name=""></a>
 
<a name="format"></a>
# format()
should perform basic examples.

```js
expect( format( 'Hello world' ) ).to.be( 'Hello world' ) ;
expect( format( 'Hello %s' , 'world' ) ).to.be( 'Hello world' ) ;
expect( format( 'Hello %s %s, how are you?' , 'Joe' , 'Doe' ) ).to.be( 'Hello Joe Doe, how are you?' ) ;
expect( format( 'I have %i cookies.' , 3 ) ).to.be( 'I have 3 cookies.' ) ;
expect( format( 'This company regains %d%% of market share.' , 36 ) ).to.be( 'This company regains 36% of market share.' ) ;
expect( format( '11/8=%f' , 11/8 ) ).to.be( '11/8=1.375' ) ;
expect( format( 'Binary %b %b' , 11 , 123 ) ).to.be( 'Binary 1011 1111011' ) ;
expect( format( 'Octal %o %o' , 11 , 123 ) ).to.be( 'Octal 13 173' ) ;
expect( format( 'Hexa %h %x %x' , 11 , 11 , 123 ) ).to.be( 'Hexa b 0b 7b' ) ;
expect( format( 'JSON %J' , {hello:'world',here:'is',my:{wonderful:'object'}} ) ).to.be( 'JSON {"hello":"world","here":"is","my":{"wonderful":"object"}}' ) ;
expect( format( 'Inspect %I' , {hello:'world',here:'is',my:{wonderful:'object'}} ) ).to.be( 'Inspect <Object> <object> {\n    hello: "world" <string>(5)\n    here: "is" <string>(2)\n    my: <Object> <object> {\n        wonderful: "object" <string>(6)\n    }\n}\n' ) ;
```

%u should format unsigned integer.

```js
expect( format( '%u' , 123 ) ).to.be( '123' ) ;
expect( format( '%u' , 0 ) ).to.be( '0' ) ;
expect( format( '%u' , -123 ) ).to.be( '0' ) ;
expect( format( '%u' ) ).to.be( '0' ) ;
```

%U should format *positive* unsigned integer.

```js
expect( format( '%U' , 123 ) ).to.be( '123' ) ;
expect( format( '%U' , 0 ) ).to.be( '1' ) ;
expect( format( '%U' , -123 ) ).to.be( '1' ) ;
expect( format( '%U' ) ).to.be( '1' ) ;
```

should perform well the argument's index feature.

```js
expect( format( '%s%s%s' , 'A' , 'B' , 'C' ) ).to.be( 'ABC' ) ;
expect( format( '%+1s%-1s%s' , 'A' , 'B' , 'C' ) ).to.be( 'BAC' ) ;
expect( format( '%3s%s' , 'A' , 'B' , 'C' ) ).to.be( 'CBC' ) ;
```

should perform well the mode arguments feature.

```js
expect( format( '%/P0/f' , 1/3 ) ).to.be( '0' ) ;
expect( format( '%/P1/f' , 1/3 ) ).to.be( '0.3' ) ;
expect( format( '%/P2/f' , 1/3 ) ).to.be( '0.33' ) ;
expect( format( '%/F0/f' , 0.1 ) ).to.be( '0' ) ;
expect( format( '%/F1/f' , 0.1 ) ).to.be( '0.1' ) ;
expect( format( '%/F2/f' , 0.1 ) ).to.be( '0.10' ) ;
```

format.count() should count the number of arguments found.

```js
expect( format.count( 'blah blih blah' ) ).to.be( 0 ) ;
expect( format.count( 'blah blih %% blah' ) ).to.be( 0 ) ;
expect( format.count( '%i %s' ) ).to.be( 2 ) ;
expect( format.count( '%1i %1s' ) ).to.be( 1 ) ;
expect( format.count( '%5i' ) ).to.be( 5 ) ;
expect( format.count( '%[unexistant]' ) ).to.be( 0 ) ;
expect( format.count( '%[unexistant:%a%a]' ) ).to.be( 2 ) ;
```

format.hasFormatting() should return true if the string has formatting and thus need to be interpreted, or false otherwise.

```js
expect( format.hasFormatting( 'blah blih blah' ) ).to.be( false ) ;
expect( format.hasFormatting( 'blah blih %% blah' ) ).to.be( true ) ;
expect( format.hasFormatting( '%i %s' ) ).to.be( true ) ;
expect( format.hasFormatting( '%[unexistant]' ) ).to.be( true ) ;
expect( format.hasFormatting( '%[unexistant:%a%a]' ) ).to.be( true ) ;
```

when using a filter object as the *this* context, the %[functionName] format should use a custom function to format the input.

```js
var filters = {
	fixed: function() { return 'F' ; } ,
	double: function( str ) { return '' + str + str ; } ,
	fxy: function( a , b ) { return '' + ( a * a + b ) ; }
} ;

expect( format.call( filters , '%[fixed]' ) ).to.be( 'F' ) ;
expect( format.call( filters , '%[fixed]%s%s%s' , 'A' , 'B' , 'C' ) ).to.be( 'FABC' ) ;
expect( format.call( filters , '%s%[fxy:%a%a]' , 'f(x,y)=' , 5 , 3 ) ).to.be( 'f(x,y)=28' ) ;
expect( format.call( filters , '%s%[fxy:%+1a%-1a]' , 'f(x,y)=' , 5 , 3 ) ).to.be( 'f(x,y)=14' ) ;
expect( format.call( filters , '%[unexistant]' ) ).to.be( '' ) ;
```

<a name="escape-collection"></a>
# Escape collection
escape.control() should escape control characters.

```js
expect( string.escape.control( 'Hello\n\t... world!' ) ).to.be( 'Hello\\n\\t... world!' ) ;
expect( string.escape.control( 'Hello\\n\\t... world!' ) ).to.be( 'Hello\\n\\t... world!' ) ;
expect( string.escape.control( 'Hello\\\n\\\t... world!' ) ).to.be( 'Hello\\\\n\\\\t... world!' ) ;
expect( string.escape.control( 'Hello\\\\n\\\\t... world!' ) ).to.be( 'Hello\\\\n\\\\t... world!' ) ;

expect( string.escape.control( 'Nasty\x00chars\x1bhere\x7f!' ) ).to.be( 'Nasty\\x00chars\\x1bhere\\x7f!' ) ;
```

escape.shellArg() should escape a string so that it will be suitable as a shell command's argument.

```js
//console.log( 'Shell arg:' , string.escape.shellArg( "Here's my shell's argument" ) ) ;
expect( string.escape.shellArg( "Here's my shell's argument" ) ).to.be( "'Here'\\''s my shell'\\''s argument'" ) ;
```

escape.regExp() should escape a string so that it will be suitable as a literal string into a regular expression pattern.

```js
//console.log( 'String in RegExp:' , string.escape.regExp( "(This) {is} [my] ^$tring^... +doesn't+ *it*? |yes| \\no\\ /maybe/" ) ) ;
expect( string.escape.regExp( "(This) {is} [my] ^$tring^... +doesn't+ *it*? |yes| \\no\\ /maybe/" ) )
	.to.be( "\\(This\\) \\{is\\} \\[my\\] \\^\\$tring\\^\\.\\.\\. \\+doesn't\\+ \\*it\\*\\? \\|yes\\| \\\\no\\\\ \\/maybe\\/" ) ;
```

escape.regExpReplacement() should escape a string so that it will be suitable as a literal string into a regular expression replacement.

```js
expect( string.escape.regExpReplacement( "$he love$ dollar$ $$$" ) ).to.be( "$$he love$$ dollar$$ $$$$$$" ) ;

expect(
	'$he love$ dollar$ $$$'.replace(
		new RegExp( string.escape.regExp( '$' ) , 'g' ) ,
		string.escape.regExpReplacement( '$1' )
	) 
).to.be( "$1he love$1 dollar$1 $1$1$1" ) ;
```

escape.html() should escape a string so that it will be suitable as HTML content.

```js
//console.log( string.escape.html( "<This> isn't \"R&D\"" ) ) ;
expect( string.escape.html( "<This> isn't \"R&D\"" ) ).to.be( "&lt;This&gt; isn't \"R&amp;D\"" ) ;
```

escape.htmlAttr() should escape a string so that it will be suitable as an HTML tag attribute's value.

```js
//console.log( string.escape.htmlAttr( "<This> isn't \"R&D\"" ) ) ;
expect( string.escape.htmlAttr( "<This> isn't \"R&D\"" ) ).to.be( "&lt;This&gt; isn't &quot;R&amp;D&quot;" ) ;
```

escape.htmlSpecialChars() should escape all HTML special characters.

```js
//console.log( string.escape.htmlSpecialChars( "<This> isn't \"R&D\"" ) ) ;
expect( string.escape.htmlSpecialChars( "<This> isn't \"R&D\"" ) ).to.be( "&lt;This&gt; isn&#039;t &quot;R&amp;D&quot;" ) ;
```

<a name="camel-case"></a>
# Camel case
.toCamelCase() should transform a string composed of alphanum - minus - underscore to a camelCase string.

```js
expect( string.toCamelCase( 'one-two-three' ) ).to.be( 'oneTwoThree' ) ;
expect( string.toCamelCase( 'one_two_three' ) ).to.be( 'oneTwoThree' ) ;
expect( string.toCamelCase( 'OnE-tWo_tHree' ) ).to.be( 'oneTwoThree' ) ;
expect( string.toCamelCase( 'ONE-TWO-THREE' ) ).to.be( 'oneTwoThree' ) ;
```

.toCamelCase() edge cases.

```js
expect( string.toCamelCase( '' ) ).to.be( '' ) ;
expect( string.toCamelCase() ).to.be( '' ) ;
expect( string.toCamelCase( 'u' ) ).to.be( 'u' ) ;
expect( string.toCamelCase( 'U' ) ).to.be( 'u' ) ;
expect( string.toCamelCase( 'U-b' ) ).to.be( 'uB' ) ;
expect( string.toCamelCase( 'U-' ) ).to.be( 'u' ) ;
expect( string.toCamelCase( '-U' ) ).to.be( 'u' ) ;
```

<a name="inspect"></a>
# inspect()
should inspect a variable with default options accordingly.

```js
var MyClass = function MyClass() {
	this.variable = 1 ;
} ;

MyClass.prototype.report = function report() { console.log( 'Variable value:' , this.variable ) ; } ;
MyClass.staticFunc = function staticFunc() { console.log( 'Static function.' ) ; } ;

var sparseArray = [] ;
sparseArray[ 3 ] = 'three' ;
sparseArray[ 10 ] = 'ten' ;
sparseArray[ 20 ] = 'twenty' ;
sparseArray.customProperty = 'customProperty' ;

var object = {
	a: 'A' ,
	b: 2 ,
	str: 'Woot\nWoot\rWoot\tWoot' ,
	sub: {
		u: undefined ,
		n: null ,
		t: true ,
		f: false
	} ,
	emptyString: '' ,
	emptyObject: {} ,
	list: [ 'one','two','three' ] ,
	emptyList: [] ,
	sparseArray: sparseArray ,
	hello: function hello() { console.log( 'Hello!' ) ; } ,
	anonymous: function() { console.log( 'anonymous...' ) ; } ,
	class: MyClass ,
	instance: new MyClass() ,
	buf: new Buffer( 'This is a buffer!' )
} ;

object.sub.circular = object ;

Object.defineProperties( object , {
	c: { value: '3' } ,
	d: {
		get: function() { throw new Error( 'Should not be called by the test' ) ; } ,
		set: function( value ) {}
	}
} ) ;

//console.log( '>>>>>' , string.escape.control( string.inspect( object ) ) ) ;
//console.log( string.inspect( { style: 'color' } , object ) ) ;
expect( string.inspect( object ) ).to.be( '<Object> <object> {\n    a: "A" <string>(1)\n    b: 2 <number>\n    str: "Woot\\nWoot\\rWoot\\tWoot" <string>(19)\n    sub: <Object> <object> {\n        u: undefined\n        n: null\n        t: true\n        f: false\n        circular: <Object> <object> [circular]\n    }\n    emptyString: "" <string>(0)\n    emptyObject: <Object> <object> {}\n    list: <Array>(3) <object> {\n        [0] "one" <string>(3)\n        [1] "two" <string>(3)\n        [2] "three" <string>(5)\n        length: 3 <number> <-conf -enum>\n    }\n    emptyList: <Array>(0) <object> {\n        length: 0 <number> <-conf -enum>\n    }\n    sparseArray: <Array>(21) <object> {\n        [3] "three" <string>(5)\n        [10] "ten" <string>(3)\n        [20] "twenty" <string>(6)\n        length: 21 <number> <-conf -enum>\n        customProperty: "customProperty" <string>(14)\n    }\n    hello: <Function> hello(0) <function>\n    anonymous: <Function> (anonymous)(0) <function>\n    class: <Function> MyClass(0) <function>\n    instance: <MyClass> <object> {\n        variable: 1 <number>\n    }\n    buf: <Buffer 54 68 69 73 20 69 73 20 61 20 62 75 66 66 65 72 21> <Buffer>(17)\n    c: "3" <string>(1) <-conf -enum -w>\n    d: <getter/setter> {\n        get: <Function> (anonymous)(0) <function>\n        set: <Function> (anonymous)(1) <function>\n    }\n}\n' ) ;
//console.log( string.inspect( { style: 'color' } , object ) ) ;
```

should pass the Array circular references bug.

```js
var array = [ [ 1 ] ] ;
expect( string.inspect( array ) ).to.be( '<Array>(1) <object> {\n    [0] <Array>(1) <object> {\n        [0] 1 <number>\n        length: 1 <number> <-conf -enum>\n    }\n    length: 1 <number> <-conf -enum>\n}\n' ) ;
```

<a name="unicode"></a>
# Unicode
unicode.length() should report correctly the length of a string.

```js
expect( string.unicode.length( '' ) ).to.be( 0 ) ;
expect( string.unicode.length( 'a' ) ).to.be( 1 ) ;
expect( string.unicode.length( 'abc' ) ).to.be( 3 ) ;
expect( string.unicode.length( '\x1b[' ) ).to.be( 2 ) ;
expect( string.unicode.length( '𝌆' ) ).to.be( 1 ) ;
expect( string.unicode.length( 'a𝌆' ) ).to.be( 2 ) ;
expect( string.unicode.length( 'a𝌆a𝌆a' ) ).to.be( 5 ) ;
expect( string.unicode.length( 'é𝌆é𝌆é' ) ).to.be( 5 ) ;
expect( string.unicode.length( '䷆䷆' ) ).to.be( 2 ) ;
expect( string.unicode.length( '備' ) ).to.be( 1 ) ;
expect( string.unicode.length( '備備' ) ).to.be( 2 ) ;
expect( string.unicode.length( '備-備' ) ).to.be( 3 ) ;
```

unicode.toArray() should produce an array of character.

```js
expect( string.unicode.toArray( '' ) ).to.eql( [] ) ;
expect( string.unicode.toArray( 'a' ) ).to.eql( [ 'a' ] ) ;
expect( string.unicode.toArray( 'abc' ) ).to.eql( [ 'a' , 'b' , 'c' ] ) ;
expect( string.unicode.toArray( '\x1b[' ) ).to.eql( [ '\x1b' , '[' ] ) ;
expect( string.unicode.toArray( '𝌆' ) ).to.eql( [ '𝌆' ] ) ;
expect( string.unicode.toArray( 'a𝌆' ) ).to.eql( [ 'a' , '𝌆' ] ) ;
expect( string.unicode.toArray( 'a𝌆a𝌆a' ) ).to.eql( [ 'a' , '𝌆' , 'a' , '𝌆' , 'a' ] ) ;
expect( string.unicode.toArray( 'é𝌆é𝌆é' ) ).to.eql( [ 'é' , '𝌆' , 'é' , '𝌆' , 'é' ] ) ;
expect( string.unicode.toArray( '䷆䷆' ) ).to.eql( [ '䷆' , '䷆' ] ) ;
expect( string.unicode.toArray( '備' ) ).to.eql( [ '備' ] ) ;
expect( string.unicode.toArray( '備備' ) ).to.eql( [ '備' , '備' ] ) ;
expect( string.unicode.toArray( '備-備' ) ).to.eql( [ '備' , '-' , '備' ] ) ;
```

unicode.surrogatePair() should return 0 for single char, 1 for leading surrogate, -1 for trailing surrogate.

```js
expect( string.unicode.surrogatePair( 'a' ) ).to.be( 0 ) ;
expect( '𝌆'.length ).to.be( 2 ) ;
expect( string.unicode.surrogatePair( '𝌆'[0] ) ).to.be( 1 ) ;
expect( string.unicode.surrogatePair( '𝌆'[1] ) ).to.be( -1 ) ;
expect( '備'.length ).to.be( 2 ) ;
expect( string.unicode.surrogatePair( '備'[0] ) ).to.be( 1 ) ;
expect( string.unicode.surrogatePair( '備'[1] ) ).to.be( -1 ) ;

// Can be wide or not, but expressed in only 1 code unit
expect( '䷆'.length ).to.be( 1 ) ;
expect( string.unicode.surrogatePair( '䷆'[0] ) ).to.be( 0 ) ;
expect( string.unicode.surrogatePair( '䷆'[1] ) ).to.be( undefined ) ;
```

