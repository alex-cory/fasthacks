var http = require('http');
var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config/config.json')); // synchronously because we don't want to start the server before it has the data from the config file

console.log('Starting');
var host = config.host;
var port = config.port;

// var host = '192.168.10.112';
// var port = '1337';

/**
 * Server
 * @param  {[type]} request  the URL the person requested, and headers, and other bits and pieces
 * @param  {[type]} response the objects where we need to send our response and text and when we send, it goes to client
 * @return {[type]}          this is what goes into the web browser (ie: hello world)
 */
var server = http.createServer(function(request, response) {
	console.log('Recieved request' + request.url);
	// we always know the browser is going to return a '/' so we don't need to add one after './views'
	fs.readFile('./files' + request.url, function(error, data) { // data = everything after the domain.com/this_stuff
		if (error) {
			response.writeHead(404, {'Content-type' : 'text/plain'});
			response.end('Sorry! :(  We couldn\'t find the page you were looking for! Dangit!');
		} else {
			response.writeHead(200, {'Content-type' : 'text/html'});
			response.end(data);
		};
	});
	// response.writeHead(200, {'Content-type' : 'text/plain'});
	// // This:
	// // response.write('Hello World!');
	// // response.end();
	// // Or:
	// response.end('Hello World');
});
server.listen(port, host, function() {
	console.log('Listening on \nhost:' + host + '\nport: ' + port + ' \n(ie: ' + host + ':' + port + ')');
});
fs.watchFile('./config/config.json', function() {
	config = JSON.parse(fs.readFileSync('./config/config.json'));
	host = config.host;
	port = config.port;
	server.close();
	console.log('Now listening on \nhost:' + host + '\nport: ' + port + ' \n(ie: ' + host + ':' + port + ')');
});