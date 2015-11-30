<?php

    // these two constants are used to create root-relative web addresses
    // and absolute server paths throughout all the code

	define("BASE_URL","/"); //(goes in links) -- used so that you can put a folder in there if you wanted to work on a branch or what not ex: /something/
	define("ROOT_PATH",$_SERVER["DOCUMENT_ROOT"] . "/"); //(goes in includes & requires)

	// For when htdocs/ is set as the root folder instead of shirts4mike/	
	// define("BASE_URL","/shirts4mike2/"); //(goes in links) -- used so that you can put a folder in there if you wanted to work on a branch or what not ex: /something/
	// define("ROOT_PATH",$_SERVER["DOCUMENT_ROOT"] . "shirts4mike2/"); //(goes in includes & requires)