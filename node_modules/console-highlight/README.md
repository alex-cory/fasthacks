# console-highlight

Get syntax highlighting in the console.

Usage:

```javascript
var highlight = require('console-highlight');

console.log(highlight('javascript to highlight', {
  // optional options
  language: 'javascript', // will auto-detect if omitted
  theme: 'default' // a highlight.js theme
}));
```

Example output (using the 'monokai' theme):

![Console output](http://i.imgur.com/1tDoa0x.png)
