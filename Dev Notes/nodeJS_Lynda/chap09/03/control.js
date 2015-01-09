var fs = require('fs');

var stream = fs.createReadStream('data.json');

stream.pause();

console.log('paused');

setTimeout(function() {
	console.log('resuming...');
	stream.resume();
}, 1000);

stream.on('data', function (chunk) {
	console.log('----------------begin chunk----------------');
	console.log(chunk.toString());
	console.log('----------------end chunk----------------');
});


stream.on('data', function (chunk) {
	console.log('CHUNK LENGTH WAS: ' + chunk.length);
});

stream.on('end', function  () {
	console.log('----------------reached file end----------------');
});