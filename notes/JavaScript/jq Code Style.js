
/* ----------------------------------------------------------------------------------------
    parentheses spacing   */


// Correct Example
$( document ).ready( function()
{

    find( 'input' );                                // doesn't necessarily have to be double spaced
                                                    // between curly braces but curly brace does need
});                                                 // need to br dropped down below function call


// Incorrect Example
$(document).ready(function(){ find( 'input' );
});


// Incorrect Example
$(document).ready(function(){
    find( 'input' );
});

/* ----------------------------------------------------------------------------------------
    NEXT EXAMPLE   */