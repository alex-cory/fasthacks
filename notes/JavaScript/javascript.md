# Javascript Notes

#### Measure Your Code

When milliseconds arenot enough: performance.now 
  var t0 = performance.now();
  doSomething();
  var t1 = performance.now();
  console.log("Call to doSomething took " + (t1 - t0) + " milliseconds.")
Reference: http://bit.ly/1MMVU55
MDN: http://mzl.la/1IrWdEH

Console.time
  console.time('someFunction');
  someFunction(); // run whatever needs to be timed in between the statements
  console.timeEnd('someFunction');

Date.getTime()
  var start = new Date().getTime();

  for (i = 0; i < 50000; ++i) {
  // do something
  }

  var end = new Date().getTime();
  var time = end - start;
  alert('Execution time: ' + time);
StackOverflow: http://bit.ly/1IrWB60
