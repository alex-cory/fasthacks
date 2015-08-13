var fs = require('fs');

var stream = fs.createReadStream('data.json'),
	writable = fs.createWriteStream('copy.json');

stream.pipe(process.stdout);

stream.pipe(writable);