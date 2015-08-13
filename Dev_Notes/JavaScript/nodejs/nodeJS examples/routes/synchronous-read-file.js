var fs = require('fs');
console.log("starting");
var content = fs.readFileSync("./files/sample.txt");
console.log("Contents: \n" + content);
console.log("Carry on executing");