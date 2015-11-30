
/*
 * GET home page.
 */

var flights = require('../data');

var flight = require('../flight');

for(var number in flights) {
	flights[number] = flight(flights[number]);
}

exports.flight = function(req, res){
	var number = req.param('number');

	if (typeof flights[number] === 'undefined') {
		res.status(404).json({status: 'error'});
	} else {
		res.json(flights[number].getInformation());
	}
};

exports.arrived = function (req, res) {
	var number = req.param('number');

	if (typeof flights[number] === 'undefined') {
		res.status(404).json({status: 'error'});
	} else {
		flights[number].triggerArrive();
		res.json({status: 'done'});
	}
};