
/**
 * Module dependencies.
 */

module.exports = function (flights, db) {
	var express = require('express');
	var MongoStore = require('connect-mongo')(express);		// passing in express as an argument to MongoStore
	var passport = require('./auth');
	var routes = require('./routes')(flights);				// passing flights as an argument to routes
	var path = require('path');
	var app = express();

	// all environments
	app.set('port', process.env.PORT || 3000);
	app.set('views', __dirname + '/views');
	app.set('view engine', 'jade');
	app.use(express.favicon());
	app.use(express.logger('dev'));
	// Database
	app.use(express.cookieParser());
	app.use(express.session({
		secret: 'keyboard cat',
		store: new MongoStore({
			mongoose_connection: db
		})
	}));
	// User Login
	app.use(passport.initialize());							// this initializes passport to be used for user login
	app.use(passport.session());							// you don't have to use a session, but for our sake, we are
	// -----
	app.use(express.bodyParser());
	app.use(express.methodOverride());
	app.use(function (req, res, next) {
		res.set('X-Powered-By', 'Flight Tracker');
		next();
	});
	app.use(app.router);
	app.use(express.static(path.join(__dirname, 'public')));

	// development only
	if ('development' == app.get('env')) {
	  app.use(express.errorHandler());
	}

	// Routes
	app.get('/flight/:number', routes.flight); 				// when someone visits http://localhost:3000/flight/18, it will show the json for that
															// 		flight
	app.put('/flight/:number/arrived', routes.arrived); 	// when someone visits http://localhost:3000/flight/18/arrived, it will add the current
															// 		time to the 'actualArrival' property
	app.get('/list', routes.list);							// when someone visits http://localhost:3000/list, it will list all the flights in HTML
															// 		format
	app.get('/arrivals', routes.arrivals);					// when someone visits http://localhost:3000/arrivals, it will list all the flights in HTML
															// 		format that have arrived along with the most recent flight visited
	app.get('/login', routes.login);						// when someone visits http://localhost:3000/login, it displays the login page
	app.post('/login', passport.authenticate('local', {		// when someone visits http://localhost:3000/login, and trys to "do login" it either
		failureRedirect: '/login',							// -- displays the login page because their login didn't work
															// OR
		successRedirect: '/user'							// -- it logs in the user in and redirects them to the user page (ie: their logged in page)
	}));
	app.get('/user', routes.user);							// when the page http://localhost:3000/user is loaded, this brings in the data about the
															// specific user
	return app;
}


