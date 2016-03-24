# API Call Throttling

## Libraries

#### 1. [throttle-function](https://github.com/brianloveswords/throttle-function)
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

#### 2. [node-rate-limiter](https://github.com/jhurliman/node-rate-limiter)
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

#### 3. [timequeue](https://github.com/fent/timequeue.js)
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

#### [node-function-rate-limit](https://github.com/wankdanker/node-function-rate-limit)
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

#### []()
```js

```

#### []()
```js

```

## Videos
- [Exploring Async.js - async.queue](https://www.youtube.com/watch?v=WXF8RxqhP_c)

## Articles
- [node.js rate limiting / throttling / throttle](http://dreadjr.blogspot.com/2013/01/nodejs-rate-limiting-throttling.html)
- [Throttle and queue up API requests due to per second cap (StackOverflow)](http://stackoverflow.com/questions/20253425/throttle-and-queue-up-api-requests-due-to-per-second-cap)
