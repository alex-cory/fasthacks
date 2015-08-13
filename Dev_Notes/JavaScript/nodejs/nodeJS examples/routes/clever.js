/**
 * Goal:
 *  See if you can figure out the average number of students per section
 */

// Gets a list of sections you have access to.
var request = require('request');

var options = {
  method: 'GET',
  json: {},
  uri: 'https://api.clever.com/v1.1/sections',
  headers: {
    Authorization: 'Bearer DEMO_TOKEN'
  }
};

request(options, function(err, response, body) { console.log(body); });

// Retrieves a list of all students in the section.
var StudentOptions = {
  method: 'GET',
  json: {},
  uri: 'https://api.clever.com/v1.1/sections/530e5979049e75a9262d0af2/students',
  headers: {
    Authorization: 'Bearer DEMO_TOKEN'
  }
};

request(StudentOptions, function(err, response, body) { console.log(body); });

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