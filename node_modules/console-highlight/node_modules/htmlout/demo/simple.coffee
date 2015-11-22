htmlout = require('../htmlout')

html =
  '''
  <p><span style="color: #0f0">Hello!</span> <strong>This text should be bold.</strong></p>
  <p>And then <strike>here we have struck-out text</strike>, <u>underlined text</u>, etc.</p>
  '''

console.log('HTML:')
console.log(html + '\n')

console.log('Styled:')
console.log(htmlout(html))
