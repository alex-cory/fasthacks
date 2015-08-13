<?php

function getDistricts()
{
	return exec("curl -H 'Authorization: Bearer DEMO_TOKEN' -X GET https://api.clever.com/v1.1/districts");
}

// Retrieves a list of all students in the section.
function getAllStudentsFromSection($demoToken)
{
	return exec("curl -H 'Authorization: Bearer DEMO_TOKEN' -X GET https://api.clever.com/v1.1/sections/530e5979049e75a9262d0af2/students");
}

/**
 * Gets a list of sections you have access to.
 */
function getSections($demoToken)
{
	return exec("curl -H 'Authorization: Bearer DEMO_TOKEN' -X GET https://api.clever.com/v1.1/sections");
	// return getCleverData('', $demoToken);
}

/**
 * Lessen lines of code for getting clever data
 */
// function getCleverData($afterSections, $demoToken)
// {
// 	$ch = curl_init('https://api.clever.com/v1.1/sections' . $afterSections);
// 	curl_setopt( $curl, CURLOPT_HTTPHEADER, array( "Authorization: Bearer $demoToken" ) );
// 	// curl_setopt( $curl, CURLOPT_HTTPHEADER, array( "Authorization: Bearer $demoToken" ) );
// 	curl_setopt($ch, CURLOPT_RETURNTRANSFER,1);
// 	return json_decode(curl_exec($ch));
// }

// $sectionsTest = getSections('DEMO_TOKEN');
// var_dump($sectionsTest);


function getAverageNumberOfStudentsPerSection($demoToken)
{
	$students = getAllStudentsFromSection($demoToken); // TODO: fix
	var_dump($students);
	$sections = getSections($demoToken);
	var_dump($sections);
	// die('here');

	$numberOfSections = count($sections);
	$numberOfStudents = count($students);
	// add all the students / add all sections
	// return $numberOfStudents/$numberOfSections;
}

// $AverageNumberOfStudentsPerSection = getAverageNumberOfStudentsPerSection('DEMO_TOKEN');


// print_r($AverageNumberOfStudentsPerSection);

// Sudo Code for Logic
/**
 * $myArray = array();
 * foreach(sections as section) {
 * 		if (true == something to validate that section has people) {
 * 			foreach(section as student) {
 *
 * 			}
 * 		}
 * }
 */