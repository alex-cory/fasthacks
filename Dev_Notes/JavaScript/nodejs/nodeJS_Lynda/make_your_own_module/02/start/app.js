var flight = require('./flight');

flight.setOrigin('LAX');
flight.setDestination('DCA');
flight.setNumber(462);

console.log(flight.getInfo());

var anotherFlight = require('./flight');

console.log(anotherFlight.getInfo());