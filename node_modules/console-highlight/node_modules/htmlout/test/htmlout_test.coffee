require 'should'

htmlout = require('../htmlout')

describe 'htmlout', ->
  it 'reads style attributes directly', ->
    htmlout('<span style="color: #f00;">foo</span>').should.eql(
      '\x1B[91mfoo\x1B[39m'
    )

  it 'applies parent styling to text nodes', ->
    html =
      '<div style="color: #1e90ff;">' +
        '<span style="color: #0f0;">Hello</span>' +
        ' there, ' +
        '<span style="color: #f00;">world!</span>' +
      '</div>'
    htmlout(html).should.eql(
      '\x1B[92mHello\x1B[39m\x1B[34m there, \x1B[39m\x1B[91mworld!\x1B[39m'
    )

  it 'defaults to treating whitespace as insignificant', ->
    html =
      '''
      <p>
        This is a paragraph.  It has two spaces after each sentence.  It also
        has line breaks in it.  All of that should be collapsed.
      </p>
      '''
    htmlout(html).should.eql('This is a paragraph. It has two spaces after ' +
      'each sentence. It also has line breaks in it. All of that should be ' +
      'collapsed.')

  it 'treats whitespace as significant for <pre> elements', ->
    html =
      '''
      <pre>var foo = function() {
        return 'blah';
      }</pre>
      '''
    htmlout(html).should.eql(
      '''
      var foo = function() {
        return 'blah';
      }
      '''
    )

  it 'treats whitespace as significant within <pre> elements', ->
    html =
      '''
      <pre><code>var foo = <span class="function-def">function() {
        return 'blah';
      }</span></code></pre>
      '''
    htmlout(html).should.eql(
      '''
      var foo = function() {
        return 'blah';
      }
      '''
    )

  it 'splits color sequences across lines, if necessary', ->
    css =
      '''
      pre { color: #0f0; }
      '''
    html =
      '''
      <pre>var foo = function() {
        return 'blah';
      };</pre>
      '''
    htmlout.withCSS(css)(html).should.eql(
      '''
      \x1B[92mvar foo = function() {\x1B[39m
      \x1B[92m  return 'blah';\x1B[39m
      \x1B[92m};\x1B[39m
      '''
    )

  it 'inserts line breaks after block-level elements', ->
    html =
      '''
      <div>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </div>
      '''
    htmlout(html).should.eql(
      '''
      Paragraph 1
      Paragraph 2
      '''
    )

  it 'inserts line breaks in the right places for', ->
    html =
      '''
      <div>
        <h1>Heading</h1>
        <h2>Subheading</h2>
        <div>
          <span>Lorem</span> <span>Ipsum</span>
        </div>
        <p>Paragraph 1</p>
        <p>Paragraph 2</p>
      </div>
      '''
    htmlout(html).should.eql(
      '''
      Heading
      Subheading
      Lorem Ipsum
      Paragraph 1
      Paragraph 2
      '''
    )

  it 'applies background color to the entire "box" for block elements', ->
    html =
      '''
      <pre style="background-color: #000; color: #fff;">function greet() {
        console.log('Hello!');
      }</pre>
      '''
    htmlout(html).should.eql(
      '''
      \x1B[39m\x1B[40mfunction greet() {      \x1B[49m\x1B[39m
      \x1B[39m\x1B[40m  console.log('Hello!');\x1B[49m\x1B[39m
      \x1B[39m\x1B[40m}                       \x1B[49m\x1B[39m
      '''
    )

  it 'understands stylesheets', ->
    css =
      '''
      .highlight { color: #ff0; }
      '''
    htmlout.withCSS(css)('<span class="highlight">blah</span>').should.eql(
      '\x1B[93mblah\x1B[39m'
    )

  it 'can apply extended colors', ->
    htmlout('<span style="color: #005FFF;">howdy</span>').should.eql(
      '\x1B[38;5;27mhowdy\x1B[39m'
    )

  it 'can apply extended background colors', ->
    htmlout('<span style="background-color: #005FFF;">howdy</span>').should.eql(
      '\x1B[48;5;27mhowdy\x1B[49m'
    )

  it 'can apply the text-transform property', ->
    htmlout('<span style="text-transform: uppercase;">shout</span>')
      .should.eql('SHOUT')

  it 'defaults <strong> and <b> elements to bold', ->
    htmlout('<strong>foo</strong> bar <b>baz</b>').should.eql(
      '\x1B[1mfoo\x1B[22m bar \x1B[1mbaz\x1B[22m'
    )

  it 'defaults <em> and <i> elements to italic', ->
    htmlout('<em>foo</em> bar <i>baz</i>').should.eql(
      '\x1B[3mfoo\x1B[23m bar \x1B[3mbaz\x1B[23m'
    )

  it 'defaults <u> elements to underlined', ->
    htmlout('<u>blah</u>').should.eql(
      '\x1B[4mblah\x1B[24m'
    )

  it 'defaults <strike> and <del> elements to strikethrough', ->
    htmlout('<strike>struck</strike> and <del>deleted</del>').should.eql(
      '\x1B[9mstruck\x1B[29m and \x1B[9mdeleted\x1B[29m'
    )
