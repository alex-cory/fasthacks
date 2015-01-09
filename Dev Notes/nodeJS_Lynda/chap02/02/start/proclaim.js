var whisper = function (message) {
	console.log('proclaiming: ' + message);
};

exports.softly = whisper;

exports.loudly = function (message) {
	console.log('PROCLAIMING: ' + message);
};