fs = require('fs')
https = require('https')
hljs = require('highlight.js')
htmlout = require('../htmlout')

# Usage: coffee demo.coffee [name of highlight.js theme]
theme = if process.argv.length > 2 then process.argv.pop() else 'default'

js = fs.readFileSync('./htmlout.js', 'utf8')
html = hljs.highlight('javascript', js).value

request = https.get "https://raw.github.com/isagalaev/highlight.js/master/src/styles/#{theme}.css", (res) ->
  if res.statusCode != 200
    console.error(res.statusCode)
    process.exit(1)

  css = ''
  res.on 'data', (data) ->
    css += data

  res.on 'end', ->
    output = htmlout.withCSS(css)
    console.log(output('<pre class="hljs">' + html + '</pre>'))

request.on 'error', (e) ->
  console.error("Failed to download CSS: #{e.message}")
  process.exit(1)
