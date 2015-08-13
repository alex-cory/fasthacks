var mongoose = require('mongoose');
// mongodb website used: https://mongolab.com/
mongoose.connect('mongodb://flights:flights@ds049150.mongolab.com:49150/flights');

module.exports = mongoose.connection; // this makes the connection above available throughout the app