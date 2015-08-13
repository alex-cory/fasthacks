var mongoose = require('mongoose');

mongoose.connect('<enter your connection string here>');

module.exports = mongoose.connection;