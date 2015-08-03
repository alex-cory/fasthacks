var mongoose = require('mongoose');

// This is a custom schema
module.exports = mongoose.model('Flight', {
	number: Number,
	origin: String,
	destination: String,
	departs: String,
	arrives: String,
	actualDepart: Number,
	actualArrive: Number,
});