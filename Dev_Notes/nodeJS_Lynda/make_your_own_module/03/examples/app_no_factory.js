var Flight = require('./flight_no_factory');

var pdxlax = {
	number: 847,
	origin: 'PDX',
	destination: 'LAX'
};

var pl = new Flight();
pl.fill(pdxlax);

pl.triggerDepart();

console.log(pl.getInformation());

var ausdca = {
	number: 382,
	origin: 'AUS',
	destination: 'DCA'
};

var ad = new Flight();
ad.fill(ausdca);

console.log(ad.getInformation());

console.log(pl.getInformation());

pl.data.origin = 'STL';

console.log(pl.getInformation());
