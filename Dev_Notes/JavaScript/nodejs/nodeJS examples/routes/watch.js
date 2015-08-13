var fs = require('fs');
console.log('Started');
var config = JSON.parse(fs.readFileSync('./config/config.json'));
console.log('Initial config: ', config);

// watch for the config file to be updated
fs.watchFile('./config/config.json', function(current, previous) {
	console.log('Config changed');
	// update the current config.json
	config = JSON.parse(fs.readFileSync('./config/config.json'));
	console.log("New config file: ", config);
});