var fs = require('fs');
console.log('Starting');
fs.writeFile('./files/write-file.txt', 'hello world! :) Asynchronous!!', function(error) {
	console.log("Writen file");
});
console.log("finished!!");