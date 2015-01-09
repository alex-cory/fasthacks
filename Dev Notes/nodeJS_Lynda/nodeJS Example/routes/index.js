
/*
 * GET home page.
 */

var FlightSchema = require('../schemas/flight');

module.exports = function (flights) {
	var flight = require('../flight');

	for(var number in flights) {
		flights[number] = flight(flights[number]);
	}

	var functions = {};

	functions.flight = function(req, res){
		var number = req.param('number');

		// used for finding the last flight number accessed.  Sets the 'lastNumber' variable in the session
		req.session.lastNumber = number;

		if (typeof flights[number] === 'undefined') {
			res.status(404).json({status: 'error'});
		} else {
			res.json(flights[number].getInformation());
		}
	};

	functions.arrived = function (req, res) {
		var number = req.param('number');

		if (typeof flights[number] === 'undefined') {
			res.status(404).json({status: 'error'});
		} else {
			flights[number].triggerArrive();

			var record = new FlightSchema(
				flights[number].getInformation()
			);

			record.save(function(err) {
				if (err) {
					console.log(err);
					res.status(500).json({status: 'failure'});
				} else {
					res.json({status: 'success'});
				}
			});

			res.json({status: 'done'});
		}
	};

	functions.list = function (req, res) {
		res.render('list', {
			title: 'All Flights',							// title of page when someone visits http://localhost:3000/list
			flights: flights 								// passing in flights array to the http://localhost:3000/list page
		});
	};

	functions.arrivals = function(req, res) {
		FlightSchema.find()									// FlightSchema is used as a way to transfer data back and forth between the db
		.setOptions({sort: 'actualArrive'})					// this is limiting the list to be displayed by only those that have actualArrivals
		.exec(function(err, arrivals) {						// the second argument is an array of the flights with actualArrival's that are set
			if (err) {
				res.status(500).json({status: 'failure'}); 	// throw an error if something goes wrong
			} else {
				res.render('arrivals', {
					title: 'Arrivals',
					arrivals: arrivals,
					lastNumber: req.session.lastNumber		// setting the 'lastNumber' variable from the session 'lastNumber' so it can be used in
															// 		the arrivals page
				});
			}
		});
	};

	functions.login = function (req, res) {
		res.render('login', {title: 'Log In'});				// load the login page and give it the Title "Log In"   << called from app.js >>
	};

	functions.user = function (req, res) {
		if (req.session.passport.user === undefined) {		// if the user's login doesn't work
			res.redirect('/login');							// redirect them back to the login page
		} else {
			res.render('/user', {							// this is loading the user page
				title: 'Welcome!',							// when the user is logged in this will display as the title of the page
				user: req.user 								// this is pulling the specific user's data from the request
			});
		}
	};

	return functions;
};
