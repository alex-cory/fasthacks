var net = require('net'),
    fs = require('fs');

var server = net.createServer(function (connect) {

    var log = fs.createWriteStream('eli.log');

    console.log('Connection established');

    connect.on('end', function() {
        console.log('Connection ended');
    });

    connect.write("Welcome to our airline customer hotline.\r\n");
    connect.write("We call it ELI: the Electronic Listening Interface.\r\n");
    connect.write("We'll repeat back your message and log it for further review.\r\n");

    connect.pipe(connect).pipe(log);

});

server.listen(7777, function() {
    console.log('Server ready on port 7777');
});

/**
 * Commands to run.
 *
 * Terminal 1:                      | Terminal 2:
 * - node tcp.js                    | - telnet localhost 7777
 *                                  | + TO EXIT:
 *                                  |   -   ⌃]
 *                                  |   -   quit
 *
 *
 */