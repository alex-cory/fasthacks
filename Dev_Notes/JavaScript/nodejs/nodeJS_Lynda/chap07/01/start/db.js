var mongoose = require('mongoose');
// var un = 'flights'; // username
// var pw = 'flights'; // password

// mongoose.connect('mongodb://' + un + ':' + pw + '@ds049150.mongolab.com:49150/flights');
mongoose.connect('mongodb://flights:flights@ds049150.mongolab.com:49150/flights');

module.exports = mongoose.connection;