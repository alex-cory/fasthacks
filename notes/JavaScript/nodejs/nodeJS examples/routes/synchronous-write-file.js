var fs = require('fs');
console.log('Starting');
fs.writeFileSync('./files/write-file.txt', 'hello world! :) Synchronous!!');
console.log("finished!!");