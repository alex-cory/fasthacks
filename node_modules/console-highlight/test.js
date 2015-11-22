if (process.argv.length < 3) {
  console.error('Usage: node test.js [theme]');
  process.exit(1);
}

var theme = process.argv[2];

var highlight = require('./consoleHighlight');

var js = require('fs').readFileSync('consoleHighlight.js', 'utf8');

var output = highlight(js, {
  language: 'javascript',
  theme: theme
});

console.log('\n\n    ' + output.replace(/\n/g, '\n    ') + '\n\n');
