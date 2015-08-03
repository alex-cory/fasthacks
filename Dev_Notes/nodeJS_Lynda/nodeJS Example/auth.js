var passport = require('passport'), 						// passport handles login details
	LocalStrategy = require('passport-local').Strategy;		// this handles the strategy used (ie: basic form, facebook login, twitter, etc..)

passport.use(new LocalStrategy(								// passport is using a new strategy
	function(username, password, done) {
		if (username === 'admin' && password === 'lynda') { // if the username: admin, password: lynda
			return done(null, {username: 'admin'});			// the done function returns an object with the username in it
		}
															// -- this is typically where you would do a database verification of the user

		return done(null, false);							// otherwise return false (redirecting you to the login page)
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	done(null, {username: username});
});

module.exports = passport;