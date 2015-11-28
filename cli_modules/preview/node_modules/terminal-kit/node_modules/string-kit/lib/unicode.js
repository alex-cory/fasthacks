/*
	The Cedric's Swiss Knife (CSK) - CSK string toolbox

	Copyright (c) 2015 Cédric Ronvel 
	
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



/*
	Javascript does not use UTF-8 but UCS-2.
	The purpose of this module is to process correctly strings containing UTF-8 characters that take more than 2 bytes.
	
	Note: in monospace font, any single unicode character that has a length of 2 is a full-width char, and therefore
	is displayed in 2 monospace cells.
*/



// Load modules
var punycode = require( 'punycode' ) ;



// Create the module and export it
var unicode = {} ;
module.exports = unicode ;



// Get the length of an unicode string
unicode.length = function length( str )
{
	return punycode.ucs2.decode( str ).length ;
} ;



// Return an array of chars
unicode.toArray = function toArray( str )
{
	return punycode.ucs2.decode( str ).map( function( code ) {
		return punycode.ucs2.encode( [ code ] ) ;
	} ) ;
} ;



/*
	Return:
		0: single char
		1: leading surrogate
		2: trailing surrogate
*/
unicode.surrogatePair = function surrogatePair( char )
{
	if ( typeof char !== 'string' || char.length < 1 ) { return undefined ; }
	
	var code = char.charCodeAt( 0 ) ;
	
	if ( code < 0xd800 || code >= 0xe000 ) { return 0 ; }
	else if ( code < 0xdc00 ) { return 1 ; }
	else { return -1 ; }
} ;




