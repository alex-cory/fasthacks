var passport = require('passport'),
	LocalStrategy = require('passport-local').Strategy;

passport.use(new LocalStrategy(
	function(username, password, done) {
		if (username === 'admin' && password === 'lynda') {
			return done(null, {username: 'admin'});
		}

		return done(null, false);
	}
));

passport.serializeUser(function(user, done) {
	done(null, user.username);
});

passport.deserializeUser(function(username, done) {
	done(null, {username: username});
});

module.exports = passport;