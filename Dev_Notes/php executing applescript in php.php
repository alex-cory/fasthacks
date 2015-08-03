<?php
// REFERENCE: http://goo.gl/6YN2g5
// create an apple script file next to your php file with the script in it, name it test.scpt

// Then use the following PHP code:
// Code:  								(MAKE SURE THE PATH TO osascript IS CORRECT!!!)

passthru("/usr/bin/osascript test.scpt");

// ie:

?>
