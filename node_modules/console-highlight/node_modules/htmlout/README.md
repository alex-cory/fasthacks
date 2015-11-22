# htmlout

This library lets you use (a very restricted subset of) HTML to style console output.

## Example

Say you have this string in a variable called `html`:

```html
<p><span style="color: #0f0">Hello!</span> <strong>This text should be bold.</strong></p>
<p>And then <strike>here we have struck-out text</strike>, <u>underlined text</u>, etc.</p>
```

Now we pass that to `htmlout`:

```javascript
console.log(htmlout(html));
```

Output:

![Console output](http://i.imgur.com/cqBE08b.png)

You can even apply stylesheets. For instance, suppose you have the following CSS in a variable
called `css`:

```css
.info {
  color: blue;
}

.success {
  color: lime;
  text-decoration: underline;
}

.warning {
  color: orange;
  font-weight: bold;
}

.fail {
  color: red;
  background-color: yellow;
  font-weight: bold;
}
```

And then this is `html`:

```html
<p class="info">Here is some information.</p>
<p class="success">The mission was a success!</p>
<p class="warning">You are running low on fuel.</p>
<p class="fail">System failure!</p>
```

Then you use `htmlout.withCSS`:

```javascript
var withStylesheet = htmlout.withCSS(css);
console.log(withStylesheet(html));
```

Output:

![Console output](http://i.imgur.com/UwdktNB.png)

## Supported CSS Styles

Obviously (well, at least without herculean effort), it isn't possible to support all CSS styles
from a console. These are the styles that *are* at least partially supported:

- `color`
- `background-color`
- `font-style` (`normal` or `italic` *on some terminals*)
- `font-weight` (`normal` or `bold`)
- `text-decoration` (`none`, `underline`, `strikethrough` *on some terminals*)
- `text-transform` (`none`, `uppercase`, `lowercase`, or `capitalize`)

## Caveat

I've barely just started this project. It is not even close to complete. It's like 1% functional.
