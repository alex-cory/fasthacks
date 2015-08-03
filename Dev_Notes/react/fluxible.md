#Fluxible

### react-intl

### react-i13n

### react-scrollable

### GraphQL
  - github.com/facebook/graphql
  - github.com/graphql/graphql-js
  - you can use instead of flux
  - ex query:
  {
    node(id: 1345678) {
      name
      friends(first: 2) {
        edges {
          node {
            name
          }
          cursor
        }
      }
    }
  }
  RETURNS: (didn't finish typing the entire response)
  {
    "1345678": {
      "name": "Alex Cory",
      "friends": {
        "name": "John",
        "name": "Dave"
      }
    }
  }

### Relay
  - application framework that they use for facebook
  - open source August 24th
  - 


## Performance Matters
  ### General
    - use images sparingly
    - optimize the ones you do use
    - cache images as long as possible
    - use name conventions to invalidate cache
    - consider separating scripts and styles that change frequently from scripts and styles that remain the same
    - e.g. separate your vendor code like Bootstrap from your app code.
    - don't use web fonts
    - icon fonts are shit too. they're big and they're hard to make accessible
    - you'r slowing down your website to make it less accessible
    - JavaScript animation are only performant if the main JS thread is not occupied.
  ### React
    - having problems with performance? 1st, check `shouldComponentUpdate()`
    - for components that never re-render, always return false
    - for performance bottlenecks, implement your own `shouldComponentUpdate()`
    - for other components, leave them alone. It can introduce hard to find bugs.

    #### React Performance Tools
    - printinclusive
    -
    -
    - 

    - DON'T ABUSE LIFECYCLE METHODS
    - 
    -

    - careful what you stick on state
    - don't make too small of components
    -

    - webpack can break your page into chunks that get loaded only on the necessary page
    - webpack does tree shaking dead code elimination
      - if you can't switch to webpack, uglify can at least get you dead code elimination.
      - otherwise `npm dedupe` can help you do it by hand
    - basically pulls the crap out of heavy libraries that aren't being used

    - svgs in react are expensive USE SPARINGLY
    -
    - HTTP2
      - SPDY



    BEST DEBUGGER
    <pre>{JSON.stringify(this.state, null, 2)}</pre>



