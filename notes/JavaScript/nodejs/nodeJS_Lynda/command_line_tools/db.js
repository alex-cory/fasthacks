var mongoose = require('mongoose');

mongoose.connect('mongodb://flights:flights@ds049150.mongolab.com:49150/flights');

module.exports = mongoose.connection;