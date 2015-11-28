/*
	The Cedric's Swiss Knife (CSK) - CSK string toolbox

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

/*
	Escape collection.
*/



// Load modules
//var tree = require( 'tree-kit' ) ;



// From Mozilla Developper Network
// https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Regular_Expressions
exports.regExp = exports.regExpPattern = function escapeRegExpPattern( str ) {
	return str.replace( /([.*+?^${}()|\[\]\/\\])/g , '\\$1' ) ;
} ;

exports.regExpReplacement = function escapeRegExpReplacement( str ) {
	return str.replace( /\$/g , '$$$$' ) ;	// This replace any single $ by a double $$
} ;



exports.format = function escapeFormat( str ) {
	return str.replace( /%/g , '%%' ) ;	// This replace any single % by a double %%
} ;



exports.shellArg = function escapeShellArg( str ) {
	return '\'' + str.replace( /\'/g , "'\\''" ) + '\'' ;
} ;



var escapeControlMap = { '\r': '\\r', '\n': '\\n', '\t': '\\t', '\x7f': '\\x7f' } ;

// Escape \r \n \t so they become readable again, escape all ASCII control character as well, using \x syntaxe
exports.control = function escapeControl( str ) {
	return str.replace( /[\x00-\x1f\x7f]/g , function( match ) {
		if ( escapeControlMap[ match ] !== undefined ) { return escapeControlMap[ match ] ; }
		var hex = match.charCodeAt( 0 ).toString( 16 ) ;
		if ( hex.length % 2 ) { hex = '0' + hex ; }
		return '\\x' + hex ;
	} ) ;
} ;



var escapeHtmlMap = { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#039;' } ;

// Only escape & < > so this is suited for content outside tags
exports.html = function escapeHtml( str ) {
	return str.replace( /[&<>]/g , function( match ) { return escapeHtmlMap[ match ] ; } ) ;
} ;

// Escape & < > " so this is suited for content inside a double-quoted attribute
exports.htmlAttr = function escapeHtmlAttr( str ) {
	return str.replace( /[&<>"]/g , function( match ) { return escapeHtmlMap[ match ] ; } ) ;
} ;

// Escape all html special characters & < > " '
exports.htmlSpecialChars = function escapeHtmlSpecialChars( str ) {
	return str.replace( /[&<>"']/g , function( match ) { return escapeHtmlMap[ match ] ; } ) ;
} ;


