# React Best Practices <sup>(as of March 23 2018)</sup>

General Good Rules to Live By
-----------------------------
1. **Readability > Optimization**. Soooo important. [Here's a good article from a guy with 15 years of software experience.](https://hackernoon.com/few-simple-rules-for-good-coding-my-15-years-experience-96cb29d4acd9)
2. **if your file is getting >200 lines, time to split it up into multiple files** (of course there's some exceptions, but 90%+ <200 lines).  This follows atomic design pattern.  In a nutshell, **make small, reusable components.** [Here's a good article.](http://bit.ly/2ugjBEr) I personally don't physically make folders for `molecules` and `organisms`, but the concept is super important to understand. It speeds up development and eliminates tech debt.
3. [Why not to use `renderXXX` methods and `condition && <X />` instead of `condition ? <X /> : null`?](https://github.com/airbnb/javascript/issues/520#issuecomment-306196763)

Examples
--------
### 1. Bad:
```javascript
import React from 'react'

class Cool extends React.Component {
	render() {
		const { children, className, specialProp, specialProp2 } = this.props
		return (
			<div classNamne={className}>
        {specialProp ? <div>{specialProp}</div> : null}
        {
          specialProp2 ?
          <div>{specialProp2}</div> :
          <div>sweet</div>
        }
        {children}
      </div>
		)
	}
}

export Cool
```

### 1. Good:
```javascript

// 1. this should be stateless because we're not using state
export const Cool = ({ children, specialProp, specialProp2, ...props }) => (
  // 2. className can be spread by grabing the rest of the props ^here. This allows extensability so you can pass
  //    any other html related prop like <Cool style={{ color: white }} /> for instance
  <div {...props}>
    // 3. if you're only checking to see if a variable exists, no need to use a ternary
    {specialProp && <div>{specialProp}</div>}
    // 4. wrapping your logical statements with parenthesis like this makes it much easier to follow.
    //    If #3 above was super nested, also wrap {specialProp && ( ... )}
    {specialProp2 ? (
      <div>{specialProp2}</div>
    ) : (
      <div>sweet</div>
    )}
    {children}
  </div>
)

```

### 2. Bad:
```javascript
import React from 'react'

class CreateEvent extends React.Component {
  renderTextField = ({
    input, 
    placeholder, 
    startAdornmentLabel, 
    meta: { touched, error }, 
    ...custom
  }) => (
    <FormControl fullWidth>
      <TextField
        {...input}
        {...custom}
        fullWidth
        placeholder={placeholder}
        error={Boolean(touched && error)}
        InputProps={{
          startAdornment: startAdornmentLabel ? <InputAdornment position="start">{startAdornmentLabel}</InputAdornment> : null,
        }}
      />
      {
        touched && error ?
          <FormHelperText error>{error}</FormHelperText> : null
      }
    </FormControl>
  );
  render() {
  	return (
		<div>
			// passing a method into a prop that says component, just pass a component
			<Field component={this.renderTextField} />
		</div>
	);
  }
}
```

### 2. Good:
```javascript
import React, { Component } from 'react'

class CreateEvent extends Component {
  state = { ... }
  render() {
  	return (
		<div>
			<Field component={TextField} />
		</div>
	);
  }
}

// this is a component, not a method
const TextField = ({ input, placeholder, startAdornmentLabel, meta: { touched, error }, ...custom }) => (
    <FormControl fullWidth>
      <TextField
        {...input}
        {...custom}
        fullWidth
        placeholder={placeholder}
        error={Boolean(touched && error)}
        InputProps={{
          startAdornment: startAdornmentLabel && <InputAdornment position="start">{startAdornmentLabel}</InputAdornment>,
        }}
      />
      {touched && error && <FormHelperText error>{error}</FormHelperText>}
    </FormControl>
);
```
