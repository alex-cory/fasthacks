/*
	The Cedric's Swiss Knife (CSK) - CSK string toolbox test suite

	Copyright (c) 2014 Cédric Ronvel 
	
	The MIT License (MIT)

	Permission is hereby granted, free of charge, to any person obtaining a copy
	of this software and associated documentation files (the "Software"), to deal
	in the Software without restriction, including without limitation the rights
	to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
	copies of the Software, and to permit persons to whom the Software is
	furnished to do so, subject to the following conditions:

	The above copyright notice and this permission notice shall be included in all
	copies or substantial portions of the Software.

	THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
	IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
	FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
	AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
	LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
	OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
	SOFTWARE.
*/

/* jshint unused:false */
/* global describe, it, before, after */


var string = require( '../lib/string.js' ) ;
var expect = require( 'expect.js' ) ;





			/* Tests */



describe( "format()" , function() {
	
	var format = string.format ;
	
	it( "should perform basic examples" , function() {
		
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
	} ) ;
	
	it( "%u should format unsigned integer" , function() {
		
		expect( format( '%u' , 123 ) ).to.be( '123' ) ;
		expect( format( '%u' , 0 ) ).to.be( '0' ) ;
		expect( format( '%u' , -123 ) ).to.be( '0' ) ;
		expect( format( '%u' ) ).to.be( '0' ) ;
	} ) ;
	
	it( "%U should format *positive* unsigned integer" , function() {
		
		expect( format( '%U' , 123 ) ).to.be( '123' ) ;
		expect( format( '%U' , 0 ) ).to.be( '1' ) ;
		expect( format( '%U' , -123 ) ).to.be( '1' ) ;
		expect( format( '%U' ) ).to.be( '1' ) ;
	} ) ;
	
	it( "should perform well the argument's index feature" , function() {
		
		expect( format( '%s%s%s' , 'A' , 'B' , 'C' ) ).to.be( 'ABC' ) ;
		expect( format( '%+1s%-1s%s' , 'A' , 'B' , 'C' ) ).to.be( 'BAC' ) ;
		expect( format( '%3s%s' , 'A' , 'B' , 'C' ) ).to.be( 'CBC' ) ;
	} ) ;
	
	it( "should perform well the mode arguments feature" , function() {
		
		expect( format( '%/P0/f' , 1/3 ) ).to.be( '0' ) ;
		expect( format( '%/P1/f' , 1/3 ) ).to.be( '0.3' ) ;
		expect( format( '%/P2/f' , 1/3 ) ).to.be( '0.33' ) ;
		expect( format( '%/F0/f' , 0.1 ) ).to.be( '0' ) ;
		expect( format( '%/F1/f' , 0.1 ) ).to.be( '0.1' ) ;
		expect( format( '%/F2/f' , 0.1 ) ).to.be( '0.10' ) ;
	} ) ;
	
	it( "format.count() should count the number of arguments found" , function() {
		
		expect( format.count( 'blah blih blah' ) ).to.be( 0 ) ;
		expect( format.count( 'blah blih %% blah' ) ).to.be( 0 ) ;
		expect( format.count( '%i %s' ) ).to.be( 2 ) ;
		expect( format.count( '%1i %1s' ) ).to.be( 1 ) ;
		expect( format.count( '%5i' ) ).to.be( 5 ) ;
		expect( format.count( '%[unexistant]' ) ).to.be( 0 ) ;
		expect( format.count( '%[unexistant:%a%a]' ) ).to.be( 2 ) ;
	} ) ;
	
	it( "format.hasFormatting() should return true if the string has formatting and thus need to be interpreted, or false otherwise" , function() {
		
		expect( format.hasFormatting( 'blah blih blah' ) ).to.be( false ) ;
		expect( format.hasFormatting( 'blah blih %% blah' ) ).to.be( true ) ;
		expect( format.hasFormatting( '%i %s' ) ).to.be( true ) ;
		expect( format.hasFormatting( '%[unexistant]' ) ).to.be( true ) ;
		expect( format.hasFormatting( '%[unexistant:%a%a]' ) ).to.be( true ) ;
	} ) ;
	
	it( "when using a filter object as the *this* context, the %[functionName] format should use a custom function to format the input" , function() {
		
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
	} ) ;
} ) ;



describe( "Escape collection" , function() {
	
	it( "escape.control() should escape control characters" , function() {
		expect( string.escape.control( 'Hello\n\t... world!' ) ).to.be( 'Hello\\n\\t... world!' ) ;
		expect( string.escape.control( 'Hello\\n\\t... world!' ) ).to.be( 'Hello\\n\\t... world!' ) ;
		expect( string.escape.control( 'Hello\\\n\\\t... world!' ) ).to.be( 'Hello\\\\n\\\\t... world!' ) ;
		expect( string.escape.control( 'Hello\\\\n\\\\t... world!' ) ).to.be( 'Hello\\\\n\\\\t... world!' ) ;
		
		expect( string.escape.control( 'Nasty\x00chars\x1bhere\x7f!' ) ).to.be( 'Nasty\\x00chars\\x1bhere\\x7f!' ) ;
	} ) ;
	
	it( "escape.shellArg() should escape a string so that it will be suitable as a shell command's argument" , function() {
		//console.log( 'Shell arg:' , string.escape.shellArg( "Here's my shell's argument" ) ) ;
		expect( string.escape.shellArg( "Here's my shell's argument" ) ).to.be( "'Here'\\''s my shell'\\''s argument'" ) ;
	} ) ;
	
	it( "escape.regExp() should escape a string so that it will be suitable as a literal string into a regular expression pattern" , function() {
		//console.log( 'String in RegExp:' , string.escape.regExp( "(This) {is} [my] ^$tring^... +doesn't+ *it*? |yes| \\no\\ /maybe/" ) ) ;
		expect( string.escape.regExp( "(This) {is} [my] ^$tring^... +doesn't+ *it*? |yes| \\no\\ /maybe/" ) )
			.to.be( "\\(This\\) \\{is\\} \\[my\\] \\^\\$tring\\^\\.\\.\\. \\+doesn't\\+ \\*it\\*\\? \\|yes\\| \\\\no\\\\ \\/maybe\\/" ) ;
	} ) ;
	
	it( "escape.regExpReplacement() should escape a string so that it will be suitable as a literal string into a regular expression replacement" , function() {
		expect( string.escape.regExpReplacement( "$he love$ dollar$ $$$" ) ).to.be( "$$he love$$ dollar$$ $$$$$$" ) ;
		
		expect(
			'$he love$ dollar$ $$$'.replace(
				new RegExp( string.escape.regExp( '$' ) , 'g' ) ,
				string.escape.regExpReplacement( '$1' )
			) 
		).to.be( "$1he love$1 dollar$1 $1$1$1" ) ;
	} ) ;
	
	it( "escape.html() should escape a string so that it will be suitable as HTML content" , function() {
		//console.log( string.escape.html( "<This> isn't \"R&D\"" ) ) ;
		expect( string.escape.html( "<This> isn't \"R&D\"" ) ).to.be( "&lt;This&gt; isn't \"R&amp;D\"" ) ;
	} ) ;
	
	it( "escape.htmlAttr() should escape a string so that it will be suitable as an HTML tag attribute's value" , function() {
		//console.log( string.escape.htmlAttr( "<This> isn't \"R&D\"" ) ) ;
		expect( string.escape.htmlAttr( "<This> isn't \"R&D\"" ) ).to.be( "&lt;This&gt; isn't &quot;R&amp;D&quot;" ) ;
	} ) ;
	
	it( "escape.htmlSpecialChars() should escape all HTML special characters" , function() {
		//console.log( string.escape.htmlSpecialChars( "<This> isn't \"R&D\"" ) ) ;
		expect( string.escape.htmlSpecialChars( "<This> isn't \"R&D\"" ) ).to.be( "&lt;This&gt; isn&#039;t &quot;R&amp;D&quot;" ) ;
	} ) ;
} ) ;



describe( "Camel case" , function() {
	
	it( ".toCamelCase() should transform a string composed of alphanum - minus - underscore to a camelCase string" , function() {
		expect( string.toCamelCase( 'one-two-three' ) ).to.be( 'oneTwoThree' ) ;
		expect( string.toCamelCase( 'one_two_three' ) ).to.be( 'oneTwoThree' ) ;
		expect( string.toCamelCase( 'OnE-tWo_tHree' ) ).to.be( 'oneTwoThree' ) ;
		expect( string.toCamelCase( 'ONE-TWO-THREE' ) ).to.be( 'oneTwoThree' ) ;
	} ) ;
	
	it( ".toCamelCase() edge cases" , function() {
		expect( string.toCamelCase( '' ) ).to.be( '' ) ;
		expect( string.toCamelCase() ).to.be( '' ) ;
		expect( string.toCamelCase( 'u' ) ).to.be( 'u' ) ;
		expect( string.toCamelCase( 'U' ) ).to.be( 'u' ) ;
		expect( string.toCamelCase( 'U-b' ) ).to.be( 'uB' ) ;
		expect( string.toCamelCase( 'U-' ) ).to.be( 'u' ) ;
		expect( string.toCamelCase( '-U' ) ).to.be( 'u' ) ;
	} ) ;
} ) ;
	


describe( "inspect()" , function() {
	
	it( "should inspect a variable with default options accordingly" , function() {
		
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
	} ) ;
	
	it( "should pass the Array circular references bug" , function() {
		var array = [ [ 1 ] ] ;
		expect( string.inspect( array ) ).to.be( '<Array>(1) <object> {\n    [0] <Array>(1) <object> {\n        [0] 1 <number>\n        length: 1 <number> <-conf -enum>\n    }\n    length: 1 <number> <-conf -enum>\n}\n' ) ;
	} ) ;
} ) ;
	



 