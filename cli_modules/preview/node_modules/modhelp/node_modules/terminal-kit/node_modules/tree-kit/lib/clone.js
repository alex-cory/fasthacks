/*
	The Cedric's Swiss Knife (CSK) - CSK object tree toolbox

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
	Stand-alone fork of extend.js, without options.
*/

exports.clone = function clone( originalObject , circular )
{
	// First create an empty object with
	// same prototype of our original source
	
	var propertyIndex , descriptor , keys , current , nextSource , indexOf ,
		copies = [ { source: originalObject , target: Object.create( Object.getPrototypeOf( originalObject ) ) } ] ,
		cloneObject = copies[ 0 ].target ,
		sourceReferences = [ originalObject ] ,
		targetReferences = [ cloneObject ] ;
	
	// First in, first out
	while ( current = copies.shift() )	// jshint ignore:line
	{
		keys = Object.getOwnPropertyNames( current.source ) ;

		for ( propertyIndex = 0 ; propertyIndex < keys.length ; propertyIndex ++ )
		{
			// Save the source's descriptor
			descriptor = Object.getOwnPropertyDescriptor( current.source , keys[ propertyIndex ] ) ;
			
			if ( ! descriptor.value || typeof descriptor.value !== 'object' )
			{
				Object.defineProperty( current.target , keys[ propertyIndex ] , descriptor ) ;
				continue ;
			}
			
			nextSource = descriptor.value ;
			descriptor.value = Array.isArray( nextSource ) ? [] : Object.create( Object.getPrototypeOf( nextSource ) ) ;
			
			if ( circular )
			{
				indexOf = sourceReferences.indexOf( nextSource ) ;
				
				if ( indexOf !== -1 )
				{
					// The source is already referenced, just assign reference
					descriptor.value = targetReferences[ indexOf ] ;
					Object.defineProperty( current.target , keys[ propertyIndex ] , descriptor ) ;
					continue ;
				}
				
				sourceReferences.push( nextSource ) ;
				targetReferences.push( descriptor.value ) ;
			}
			
			Object.defineProperty( current.target , keys[ propertyIndex ] , descriptor ) ;
			
			copies.push( { source: nextSource , target: descriptor.value } ) ;
		}
	}
	
	return cloneObject ;
} ;
