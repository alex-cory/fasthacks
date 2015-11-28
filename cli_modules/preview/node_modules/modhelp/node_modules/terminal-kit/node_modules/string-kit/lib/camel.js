/*
	The Cedric's Swiss Knife (CSK) - CSK string toolbox

	Copyright (c) 2014 - 2015 Cédric Ronvel 
	
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



var camel = {} ;
module.exports = camel ;



// Transform alphanum separated by underscore or minus to camel case
camel.toCamelCase = function toCamelCase( str )
{
	var i , iMax , splitted , first = true ;
	
	if ( ! str || typeof str !== 'string' ) { return '' ; }
	
	splitted = str.split( /[ _-]+/ ) ;
	
	iMax = splitted.length ;
	
	splitted[ 0 ] = splitted[ 0 ].toLowerCase() ;
	
	for ( i = 0 ; i < iMax ; i ++ )
	{
		if ( ! splitted[ i ] ) { continue ; }
		
		if ( first )
		{
			splitted[ i ] = splitted[ i ].toLowerCase() ;
			first = false ;
		}
		else
		{
			splitted[ i ] = splitted[ i ][ 0 ].toUpperCase() + splitted[ i ].slice( 1 ).toLowerCase() ;
		}
	}
	
	return splitted.join( '' ) ;
} ;
