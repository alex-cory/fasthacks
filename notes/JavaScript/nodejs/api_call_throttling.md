# API Call Throttling

## Libraries

#### 1. [node-rate-limiter](https://github.com/jhurliman/node-rate-limiter)
```js
var limiter = new RateLimiter(5, 'minute');var n = 0;
var x = 0;
console.log('0 minute');
setInterval(function() {
  console.log((++x)+' minute');
}, 60000);

setInterval(function() {
 limiter.removeTokens(1, function(err, remainingRequests) {
    console.log('request'+(n++)+' :: '+remainingRequests);
  });
}, 100);
```



#### 2. [async.queue](https://github.com/caolan/async#queue) (see [StackOverflow](http://stackoverflow.com/questions/20253425/throttle-and-queue-up-api-requests-due-to-per-second-cap))
```js
let docIds = [1,2,3,4]
let docs = []
let batchSize = 10  // amount of requests, aka concurrency
let waitTime = 1000 // 1 second

// Throttling the requests made to Google Drive API to 10/sec
let taskQueue = async.queue((task, callback) => {

	let options = {
		fileId: task.docId,
		fields: 'alternateLink,description,downloadUrl,fileSize,id,imageMediaMetadata(height,width),thumbnail,thumbnailLink,title,webContentLink,webViewLink'
	}

	// Making the request to Google Drive to get the data for each file
	drive.files.get(options, (err, response) => {
		if (err) {
		  console.log('The API returned an error: ' + err)
		  return
		}

		let data = response

		console.log(data);
		// docs.push(
		// 	new GoogleDoc(data)
		// )

	})

	// Wait 1 second
	setTimeout(() => {
		callback()
	}, waitTime)

// run 10 api calls each second
}, batchSize)

for (let docId of docIds) {
	// Push all the file id's into the task queue
  taskQueue.push({docId}, (err) => {
  	// Done
  	if (err) {
  		console.log(err)
  	}
  })
}
```



#### 3. [throttle-function](https://github.com/brianloveswords/throttle-function)
```js
const throttle = require('throttle-function')
const api = require('./api')

// call a maximum of 180 times per 15 minute window
var getWhatever = throttle(api.getWhatever, {
  window: 15 * 60, // window is in seconds
  limit: 180
})

// you can also use straight up milliseconds
getWhatever = throttle(api.getWhatever, 5000)

// this will fire off every 5 seconds instead of immediately
getWhatever()
getWhatever()
getWhatever()
```



#### 4. [timequeue](https://github.com/fent/timequeue.js)
```js
var TimeQueue = require('timequeue');

var n = 0;
function worker(callback) {
  console.log('request'+(n++));
  callback(null, 'good');
}

var x = 0;
console.log('0 minute');
setInterval(function() {
  console.log((++x)+' minute');
}, 60000);

var q = new TimeQueue(worker, { concurrency: 5, every: 60000 });
setInterval(function() {
  q.push();
}, 100);
```

#### 5. [node-function-rate-limit](https://github.com/wankdanker/node-function-rate-limit)
```js
var rateLimit = require('function-rate-limit');

var fn = rateLimit(5, 60000, function(n) {
  console.log('request'+n);
});

var x = 0;
console.log('0 minute');
setInterval(function() {
  console.log((++x)+' minute');
}, 60000);

var n = 0;
setInterval(function() {
  fn(n++);
}, 100);
```


#### [batch](https://github.com/visionmedia/batch)
```js
var Batch = require('batch')
  , batch = new Batch;

batch.concurrency(4);

ids.forEach(function(id){
  batch.push(function(done){
    User.get(id, done);
  });
});

batch.on('progress', function(e){

});

batch.end(function(err, users){

});
```

<!--
#### []()
```js

```
-->


## Videos
- [Exploring Async.js - async.queue](https://www.youtube.com/watch?v=WXF8RxqhP_c)

## Articles
- [node.js rate limiting / throttling / throttle](http://dreadjr.blogspot.com/2013/01/nodejs-rate-limiting-throttling.html)
- [Throttle and queue up API requests due to per second cap (StackOverflow)](http://stackoverflow.com/questions/20253425/throttle-and-queue-up-api-requests-due-to-per-second-cap)
- [Batch requests in Node.js (StackOverflow)](http://stackoverflow.com/questions/18319823/batch-requests-in-node-js)

## Stream Throttling
- [node-throttle](https://github.com/TooTallNate/node-throttle)
