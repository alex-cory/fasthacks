var http = require('http'); // add the http module
var myServer = http.createServer(function (req, res) {
	// res.writeHead(200, {"Content-Type" : "text/plain"});
	res.writeHead(200, {"Content-Type" : "text/html"});
	// res.write('Hello');
	res.write('<strong>Hello</strong>');
	res.end();
});

myServer.listen(3000);
