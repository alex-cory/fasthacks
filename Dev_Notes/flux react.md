# Flux Notes

### People
  - From This Video: http://bit.ly/1I3yHYn
    - Pete Hunt
      - Engineering Manager
      - React Team
      - Manage Instagram Web Team
    - Tom
    - Jane
  -

### Definition:
  - Flux is the application architecture that Facebook uses for building
    client-side web applications. It complements React's composable view
    components by utilizing a unidirectional data flow. It's more of a
    pattern rather than a formal framework

### Quotes
  - "We should do our utmost to shorten the conceptual gap between the static
     program and the dynamic process, to make the correspondence between the
     program and the process as trivial as possible." -Edsger W. Dijkstra
  - "Simplicity is prerequisite for reliability" -Edsger W. Dijkstra
  - "We want to build better systems in less time.  In order to do that
     we need to predict what our systems are going to do, and you can't
     predict what you don't understand. So we need to make our systems
     simple enough to fit inside our heads when we're working on a problem
     so we can understand them, predict what they're going to do, and
     build higher quality software in less time." -Pete Hunt

### Layout

    .------------.  .------------.  .------------.  .------------.
    |            |  |            |  |            |  |            |
    |   Action   |->| Dispatcher |->|    Store   |->|    View    |
    |            |  |            |  |            |  |            |
    '------------'  '------------'  '------------'  '------------'
                          ^         .------------.        |
                          |         |            |        |
                          '---------|   Action   |--------'
                                    |            |
                                    '------------'
### Action
  - simple objects containing the new data and an identifying type
    property.
  - Actions most often originate from user interactions with the views [2]

### Action Creators
  - action creators are nothing more than a call into the dispatcher.

###
  -

### Controller Views
  - Controller-views listen for these events and retrieve data from the stores in an event handler. [2]
    The controller-views call their own `render()` method via `setState()` or `forceUpdate(),`
    updating themselves and all of their children. [2]

### Dispatcher
  - Kind of acts like the traffic controller
  - invokes the callbacks that the stores have registered with it, effectively dispatching the
    data payload contained in the actions to all stores. [2]
  -
  -

### Store
  - Data layer that basically updates whenever you get a new action

### View
  - The views re-render whatever the stores say have changed

### Application State
  - All application state should live in the store.
  - Application state is maintained only in the stores [2]

### UI State
  - All UI State should live in the components.

### LoD: The Law of Demeter (aka: principle of least knowledge)
  - a design guideline for developing software, particularly object-oriented
    programs. In its general form, the LoD is a specific case of loose
    coupling. The guideline was proposed at Northeastern University towards
    the end of 1987, and can be succinctly summarized in each of the following
    ways:
    - Each unit should have only limited knowledge about other units:
      only units "closely" related to the current unit.
    - Each unit should only talk to its friends; don't talk to strangers.
    - Only talk to your immediate friends.
  - The fundamental notion is that a given object should assume as little
    as possible about the structure or properties of anything else
    (including its subcomponents), in accordance with the principle of
    "information hiding".
  - Wikipedia: http://bit.ly/1JMLNh0

### React Components setState
  - If a React component fetches it's own data, it will usually do so in the `componentDidMount` method. [1]
  - this.state should be treated as immutable
  - State should only be set on mounted components, or those components that are inserted into the dom.
  + `ASSURE COMPONENT IS MOUNTED`
  - If the component is mounted, setState is a safe bet. `If it’s not mounted, never setState.`

### Action Creators
  - action creators are nothing more than a call into the dispatcher.

###
  -

###
  -

###
  -

###
  -

###
  -



## REFERENCES:
  - [1] Set State in Callbacks in React: http://bit.ly/1GogiEG
  - [2] Structure and Data Flow: https://github.com/facebook/flux
  -
  -
  -


