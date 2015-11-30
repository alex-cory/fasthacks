
/*
 * GET home page.
 */

var flight = require('../flight');

var flight1 = flight({
	number: 1,
	origin: 'LAX',
	destination: 'DCA',
	departs: '9AM',
	arrives: '4PM'
});

var flight2 = flight({
	number: 2,
	origin: 'LAX',
	destination: 'PDX',
	departs: '10AM',
	arrives: '12PM'
});

exports.flight1 = function(req, res){
	res.json(flight1.getInformation());
};

exports.flight2 = function(req, res){
	res.json(flight2.getInformation());
};

// exports.index = function(req, res){
// res.render('index', { title: 'Express' });
// };
