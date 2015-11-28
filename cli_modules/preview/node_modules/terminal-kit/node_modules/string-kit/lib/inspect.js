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

/*
	Variable inspector.
*/



// Load modules
var tree = require( 'tree-kit' ) ;
var escape = require( './escape.js' ) ;
var ansi = require( './ansi.js' ) ;



/*
	Inspect a variable, return a string ready to be displayed with console.log(), or even as an HTML output.
	
	Options:
		* style:
			* 'none': (default) normal output suitable for console.log() or writing in a file
			* 'color': colorful output suitable for terminal
			* 'html': html output
		* depth: depth limit, default: 3
		* nofunc: do not display functions
		* funcDetails: display function's details
		* proto: display object's prototype
		* useInspect? use .inspect() methode when available on an object
*/

function inspect( runtime , options , variable )
{
	var i , funcName , length , propertyList , constructor , keyIsProperty ,
		type , pre , nextIndent , nextIndent2 , isArray , isFunc ,
		str = '' , key = '' , descriptorStr = '' , descriptor , nextAncestors ;
	
	
	// Things applied only for the first call, not for recursive call
	
	if ( ! runtime )
	{
		if ( arguments.length < 3 ) { variable = options ; options = {} ; }
		else if ( ! options || typeof options !== 'object' ) { options = {} ; }
		
		runtime = { depth: 0 , indent: '' , ancestors: [] } ;
		
		if ( ! options.style ) { options.style = inspectStyle.none ; }
		else if ( typeof options.style === 'string' ) { options.style = inspectStyle[ options.style ] ; }
		
		if ( options.depth === undefined ) { options.depth = 3 ; }
	}
	
	
	// Prepare things (indentation, key, descriptor, ... )
	
	type = typeof variable ;
	nextIndent = runtime.indent + options.style.tab ;
	nextIndent2 = nextIndent + options.style.tab ;
	
	if ( type === 'function' && options.nofunc ) { return '' ; }
	
	if ( runtime.key !== undefined )
	{
		if ( runtime.descriptor )
		{
			descriptorStr = [] ;
			
			if ( ! runtime.descriptor.configurable ) { descriptorStr.push( '-conf' ) ; }
			if ( ! runtime.descriptor.enumerable ) { descriptorStr.push( '-enum' ) ; }
			
			// Already displayed by runtime.forceType
			//if ( runtime.descriptor.get || runtime.descriptor.set ) { descriptorStr.push( 'getter/setter' ) ; } else
			if ( ! runtime.descriptor.writable ) { descriptorStr.push( '-w' ) ; }
			
			//if ( descriptorStr.length ) { descriptorStr = '(' + descriptorStr.join( ' ' ) + ')' ; }
			if ( descriptorStr.length ) { descriptorStr = descriptorStr.join( ' ' ) ; }
			else { descriptorStr = '' ; }
		}
		
		if ( runtime.keyIsProperty )
		{
			if ( keyNeedingQuotes( runtime.key ) )
			{
				key = '"' + options.style.key( runtime.key ) + '": ' ;
			}
			else
			{
				key = options.style.key( runtime.key ) + ': ' ;
			}
		}
		else
		{
			key = '[' + options.style.index( runtime.key ) + '] ' ;
		}
		
		if ( descriptorStr ) { descriptorStr = ' ' + options.style.type( descriptorStr ) ; }
	}
	
	pre = runtime.indent + key ;
	
	
	// Describe the current variable
	
	if ( variable === undefined )
	{
		str += pre + options.style.constant( 'undefined' ) + descriptorStr + options.style.nl ;
	}
	else if ( variable === null )
	{
		str += pre + options.style.constant( 'null' ) + descriptorStr + options.style.nl ;
	}
	else if ( variable === false )
	{
		str += pre + options.style.constant( 'false' ) + descriptorStr + options.style.nl ;
	}
	else if ( variable === true )
	{
		str += pre + options.style.constant( 'true' ) + descriptorStr + options.style.nl ;
	}
	else if ( type === 'number' )
	{
		str += pre + options.style.number( variable.toString() ) + ' ' + options.style.type( 'number' ) + descriptorStr + options.style.nl ;
	}
	else if ( type === 'string' )
	{
		str += pre + '"' + options.style.string( escape.control( variable ) ) + '" ' +
			options.style.type( 'string' ) + options.style.length( '(' + variable.length + ')' ) + descriptorStr + options.style.nl ;
	}
	else if ( Buffer.isBuffer( variable ) )
	{
		str += pre + options.style.inspect( variable.inspect() ) + ' ' +
			options.style.type( 'Buffer' ) + options.style.length( '(' + variable.length + ')' ) + descriptorStr + options.style.nl ;
	}
	else if ( type === 'object' || type === 'function' )
	{
		funcName = length = '' ;
		
		isFunc = false ;
		if ( type === 'function' )
		{
			isFunc = true ;
			funcName = ' ' + options.style.funcName( ( variable.name ? variable.name : '(anonymous)' ) ) ;
			length = options.style.length( '(' + variable.length + ')' ) ;
		}
		
		isArray = false ;
		if ( Array.isArray( variable ) )
		{
			isArray = true ;
			length = options.style.length( '(' + variable.length + ')' ) ;
		}
		
		if ( ! variable.constructor ) { constructor = '(no constructor)' ; }
		else if ( ! variable.constructor.name ) { constructor = '(anonymous)' ; }
		else { constructor = variable.constructor.name ; }
		
		constructor = options.style.constructorName( constructor ) ;
		
		if ( runtime.forceType ) { str += pre + options.style.type( runtime.forceType ) ; }
		else { str += pre + constructor + funcName + length + ' ' + options.style.type( type ) + descriptorStr ; }
		
		propertyList = Object.getOwnPropertyNames( variable ) ;
		
		if ( isFunc && ! options.funcDetails )
		{
			str += options.style.nl ;
		}
		else if ( ! propertyList.length && ! options.proto )
		{
			str += ' {}' + options.style.nl ;
		}
		else if ( runtime.depth >= options.depth )
		{
			str += ' ' + options.style.limit( '[depth limit]' ) + options.style.nl ;
		}
		else if ( runtime.ancestors.indexOf( variable ) !== -1 )
		{
			str += ' ' + options.style.limit( '[circular]' ) + options.style.nl ;
		}
		else
		{
			str += ' {' + options.style.nl ;
			
			// Do not use .concat() here, it doesn't works as expected with arrays...
			nextAncestors = runtime.ancestors.slice() ;
			nextAncestors.push( variable ) ;
			
			for ( i = 0 ; i < propertyList.length ; i ++ )
			{
				try {
					descriptor = Object.getOwnPropertyDescriptor( variable , propertyList[ i ] ) ;
					
					keyIsProperty = ! isArray || ! descriptor.enumerable || isNaN( propertyList[ i ] ) ;
					
					if ( descriptor.get || descriptor.set )
					{
						str += inspect( {
								depth: runtime.depth + 1 ,
								ancestors: nextAncestors ,
								indent: nextIndent ,
								key: propertyList[ i ] ,
								keyIsProperty: keyIsProperty ,
								descriptor: descriptor ,
								forceType: 'getter/setter'
							} ,
							options ,
							{ get: descriptor.get , set: descriptor.set }
						) ;
					}
					else
					{
						str += inspect( {
								depth: runtime.depth + 1 ,
								ancestors: nextAncestors ,
								indent: nextIndent ,
								key: propertyList[ i ] ,
								keyIsProperty: keyIsProperty ,
								descriptor: descriptor
							} ,
							options ,
							variable[ propertyList[ i ] ]
						) ;
					}
				}
				catch ( error ) {
					str += inspect( {
							depth: runtime.depth + 1 ,
							ancestors: nextAncestors ,
							indent: nextIndent ,
							key: propertyList[ i ] ,
							keyIsProperty: keyIsProperty ,
							descriptor: descriptor
						} ,
						options ,
						error
					) ;
				}
			}
			
			if ( options.proto )
			{
				str += inspect( {
						depth: runtime.depth + 1 ,
						ancestors: nextAncestors ,
						indent: nextIndent ,
						key: '__proto__' ,
						keyIsProperty: true
					} ,
					options ,
					variable.__proto__	// jshint ignore:line
				) ;
			}
			
			str += runtime.indent + '}' + options.style.nl ;
		}
	}
	
	
	// Finalizing
	
	if ( runtime.depth === 0 )
	{
		if ( options.style === 'html' ) { str = escape.html( str ) ; }
	}
	
	return str ;
}

exports.inspect = inspect.bind( undefined , null ) ;



function keyNeedingQuotes( key )
{
	if ( ! key.length ) { return true ; }
	return false ;
}



function inspectError( options , error )
{
	var str = '' , stack , type , code ;
	
	if ( arguments.length < 2 ) { error = options ; options = {} ; }
	else if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	if ( ! ( error instanceof Error ) ) { return  ; }
	
	if ( ! options.style ) { options.style = inspectStyle.none ; }
	else if ( typeof options.style === 'string' ) { options.style = inspectStyle[ options.style ] ; }
	
	if ( error.stack ) { stack = inspectStack( options , error.stack ) ; }
	
	type = error.type || error.constructor.name ;
	code = error.code || error.name || error.errno || error.number ;
	
	str += options.style.errorType( type ) +
		( code ? ' [' + options.style.errorType( code ) + ']' : '' ) + ': ' ;
	str += options.style.errorMessage( error.message ) + '\n' ;
	
	if ( stack ) { str += options.style.errorStack( stack ) + '\n' ; }
	
	return str ;
}

exports.inspectError = inspectError ;



function inspectStack( options , stack )
{
	if ( arguments.length < 2 ) { stack = options ; options = {} ; }
	else if ( ! options || typeof options !== 'object' ) { options = {} ; }
	
	if ( ! options.style ) { options.style = inspectStyle.none ; }
	else if ( typeof options.style === 'string' ) { options.style = inspectStyle[ options.style ] ; }
	
	if ( ! stack ) { return ; }
	
	stack = stack.replace( /^[^\n]*\n/ , '' ) ;
	stack = stack.replace(
		/^\s*(at)\s+(?:([^\s:\(\)\[\]\n]+)\s)?(?:\[as ([^\s:\(\)\[\]\n]+)\]\s)?(?:\(?([^:\(\)\[\]\n]+):([0-9]+):([0-9]+)\)?)?$/mg ,
		function( matches , at , method , as , file , line , column ) {
			return options.style.errorStack( '    at ' ) +
				( method ? options.style.errorStackMethod( method ) + ' ' : '' ) +
				( as ? options.style.errorStack( '[as ' ) + options.style.errorStackMethodAs( as ) + options.style.errorStack( '] ' ) : '' ) +
				options.style.errorStack( '(' ) +
				( file ? options.style.errorStackFile( file ) : options.style.errorStack( 'unknown' ) ) +
				( line ? options.style.errorStack( ':' ) + options.style.errorStackLine( line ) : '' ) +
				( column ? options.style.errorStack( ':' ) + options.style.errorStackColumn( column ) : '' ) +
				options.style.errorStack( ')' ) ;
		}
	) ;
	
	return stack ;
}

exports.inspectStack = inspectStack ;



// Inspect's styles

var inspectStyle = {} ;

var inspectStyleNoop = function( str ) { return str ; } ;



inspectStyle.none = {
	tab: '    ' ,
	nl: '\n' ,
	limit: inspectStyleNoop ,
	type: function( str ) { return '<' + str + '>' ; } ,
	constant: inspectStyleNoop ,
	funcName: inspectStyleNoop ,
	constructorName: function( str ) { return '<' + str + '>' ; } ,
	length: inspectStyleNoop ,
	key: inspectStyleNoop ,
	index: inspectStyleNoop ,
	number: inspectStyleNoop ,
	inspect: inspectStyleNoop ,
	string: inspectStyleNoop ,
	errorType: inspectStyleNoop ,
	errorMessage: inspectStyleNoop ,
	errorStack: inspectStyleNoop ,
	errorStackMethod: inspectStyleNoop ,
	errorStackMethodAs: inspectStyleNoop ,
	errorStackFile: inspectStyleNoop ,
	errorStackLine: inspectStyleNoop ,
	errorStackColumn: inspectStyleNoop
} ;



inspectStyle.color = tree.extend( null , {} , inspectStyle.none , {
	limit: function( str ) { return ansi.bold + ansi.brightRed + str + ansi.reset ; } ,
	type: function( str ) { return ansi.italic + ansi.brightBlack + str + ansi.reset ; } ,
	constant: function( str ) { return ansi.cyan + str + ansi.reset ; } ,
	funcName: function( str ) { return ansi.italic + ansi.magenta + str + ansi.reset ; } ,
	constructorName: function( str ) { return ansi.magenta + str + ansi.reset ; } ,
	length: function( str ) { return ansi.italic + ansi.brightBlack + str + ansi.reset ; } ,
	key: function( str ) { return ansi.green + str + ansi.reset ; } ,
	index: function( str ) { return ansi.blue + str + ansi.reset ; } ,
	number: function( str ) { return ansi.cyan + str + ansi.reset ; } ,
	inspect: function( str ) { return ansi.cyan + str + ansi.reset ; } ,
	string: function( str ) { return ansi.blue + str + ansi.reset ; } ,
	errorType: function( str ) { return ansi.red + ansi.bold + str + ansi.reset ; } ,
	errorMessage: function( str ) { return ansi.red + ansi.italic + str + ansi.reset ; } ,
	errorStack: function( str ) { return ansi.brightBlack + str + ansi.reset ; } ,
	errorStackMethod: function( str ) { return ansi.brightYellow + str + ansi.reset ; } ,
	errorStackMethodAs: function( str ) { return ansi.yellow + str + ansi.reset ; } ,
	errorStackFile: function( str ) { return ansi.brightCyan + str + ansi.reset ; } ,
	errorStackLine: function( str ) { return ansi.blue + str + ansi.reset ; } ,
	errorStackColumn: function( str ) { return ansi.magenta + str + ansi.reset ; }
} ) ;



inspectStyle.html = tree.extend( null , {} , inspectStyle.none , {
	tab: '&nbsp;&nbsp;&nbsp;&nbsp;' ,
	nl: '<br />' ,
	limit: function( str ) { return '<span style="color:red">' + str + '</span>' ; } ,
	type: function( str ) { return '<i style="color:gray">' + str + '</i>' ; } ,
	constant: function( str ) { return '<span style="color:cyan">' + str + '</span>' ; } ,
	funcName: function( str ) { return '<i style="color:magenta">' + str + '</i>' ; } ,
	constructorName: function( str ) { return '<span style="color:magenta">' + str + '</span>' ; } ,
	length: function( str ) { return '<i style="color:gray">' + str + '</i>' ; } ,
	key: function( str ) { return '<span style="color:green">' + str + '</span>' ; } ,
	index: function( str ) { return '<span style="color:blue">' + str + '</span>' ; } ,
	number: function( str ) { return '<span style="color:cyan">' + str + '</span>' ; } ,
	inspect: function( str ) { return '<span style="color:cyan">' + str + '</span>' ; } ,
	string: function( str ) { return '<span style="color:blue">' + str + '</span>' ; } ,
	errorType: function( str ) { return '<span style="color:red">' + str + '</span>' ; } ,
	errorMessage: function( str ) { return '<span style="color:red">' + str + '</span>' ; } ,
	errorStack: function( str ) { return '<span style="color:gray">' + str + '</span>' ; } ,
	errorStackMethod: function( str ) { return '<span style="color:yellow">' + str + '</span>' ; } ,
	errorStackMethodAs: function( str ) { return '<span style="color:yellow">' + str + '</span>' ; } ,
	errorStackFile: function( str ) { return '<span style="color:cyan">' + str + '</span>' ; } ,
	errorStackLine: function( str ) { return '<span style="color:blue">' + str + '</span>' ; } ,
	errorStackColumn: function( str ) { return '<span style="color:gray">' + str + '</span>' ; }
} ) ;



