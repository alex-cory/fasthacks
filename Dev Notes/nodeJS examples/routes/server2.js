var fs = require('fs');
var config = JSON.parse(fs.readFileSync('./config/config.json'));
var host = config.host;
var port = config.port;
var express = require('express');

console.log('Started');
// var app = express.createServer(); 			// <- typically this would be "http.createServer()," but since express has it built in, we use "express"
var app = express();
// app.set('port', process.env.PORT || 3000);
// app.set('host', process.env.HOST || '192.168.10.112');


app.use(express.static(__dirname + "/public"));  // this tells express to use this directory for static files


// app.get('/', function(req, res){
//   res.send('hello world');
// });
app.get('/', function (req, res) {
  res.render('index', { title: 'Hey', message: 'Hello there!'});
});

// app.listen(port, host);

var server = app.listen(port, function() {
    console.log('Listening on port %d', server.address().port);
});