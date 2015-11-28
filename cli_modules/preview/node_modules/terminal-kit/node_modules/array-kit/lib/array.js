/*
	The Cedric's Swiss Knife (CSK) - CSK array toolbox

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



// Load modules
var tree = require( 'tree-kit' ) ;



var arrayKit = {} ;
module.exports = arrayKit ;



// Tier 0: add polyfills to arrayKit
var fn ;
var polyfill = require( './polyfill.js' ) ;

for ( fn in polyfill )
{
	arrayKit[ fn ] = function( array ) {
		return polyfill[ fn ].apply( array , Array.prototype.slice.call( arguments , 1 ) ) ;
	} ; // jshint ignore:line
}



/*
tree.extend( null , arrayKit ,
	
	// Tier 1
) ;



tree.extend( null , arrayKit ,
	
	// Tier 2
	// Tier 3
) ;
*/



// Install all polyfill into String.prototype
arrayKit.installPolyfills = function installPolyfills()
{
	var fn ;
	
	for ( fn in polyfill )
	{
		if ( ! String.prototype[ fn ] )
		{
			String.prototype[ fn ] = polyfill[ fn ] ;
		}
	}
} ;




