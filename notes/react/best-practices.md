# React Best Practices <sub>(as of March 23 2018)</sub>

### Bad:
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

### Good:
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

