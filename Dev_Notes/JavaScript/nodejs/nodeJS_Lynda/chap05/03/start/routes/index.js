
/*
 * GET home page.
 */

// Data
var flights = require('../../data');

// Class
var flight = require('../flight');

// Looping through flights array
for(var number in flights) {
	flights[number] = flight(flights[number]);
}

// exports.flight = function(req, res){
//   res.json(flight1.getInformation());
// };

exports.flight = function(req, res){
	var number = req.param('number');

	if (typeof flights[number] === 'undefined') {
		res.status(404).json({status: 'error'});
	} else {
		res.json(flights[number].getInformation());
	}
};