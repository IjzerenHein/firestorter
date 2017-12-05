<h1 align="center">
  <img src="./logo2.jpg" /><br>
  Firestorter
</h1>


Simple & super fast Firestore bindings for React, using Mobx observables. 🤘

- **Simple**, easy to use API, get up & running in minutes
- **Fast**, only queries and re-renders data when needed
- **No clutter**, no complex stores/providers/actions/reducers, just go

Because, React `+` Firestore `+` Mobx `===` ❤️

![this-thing-really-moves](./this-thing-really-moves.gif)

## Index

- [Installation](#installation)
- [Usage](#usage)
- [How it works](#how-it-works)
- [Examples](#examples)
- [Documentation](./docs/API.md)
- [Work in progress](#work-in-progress)


## Installation

	yarn add firestorter
	
*firestorter has a peer-dependency on `firebase`, `mobx` and `mobx-react`. To install these, use:*

	yarn add firebase mobx mobx-react

## Usage

```js
import firebase from 'firebase';
import 'firebase/firestore';
import {initFirestorter, Collection} from 'firestorter';
import {observer} from 'mobx-react';

// Initialize firebase app
firebase.initializeApp({...});

// Initialize `firestorter`
initFirestorter({firebase: firebase});

// Define collection
const todos = new Collection('todos');

// Wrap your Components with mobx's `observer` pattern
@observer class Todos extends Component {
  render() {
    return <div>
      {todos.docs.map((doc) => (
        <TodoItem
          key={todo.id}
          doc={doc} />
      ))}
    </div>;
  }
}

const TodoItem = observer(({doc}) => {
  const {finished, text} = doc.data;
  return <div>
    <input type='checkbox' checked={finished} />
    <input type='text' value={text} />
  </div>;
});

ReactDOM.render(<Todos />, document.getElementById('root'));
```

**That's it.** Your Components will now render your firestore data
and re-render when data in the back-end changes.


## How it works

Firestorter makes integrating Firestore real-time data into React easy as pie. It does this by providing a simple API for accessing Collection and Document data, whilst taking away the burden of managing snapshot listeners, data-caching and efficiently updating your React components.

It does this by intelligently tracking whether a Collection or Document should be listening for real-time updates (`onSnapshot` events) or not. Whenever a Component renders a Collection or Document, firestorter enables real-time updates on that resource. And whenever a Component stops using the resource *(e.g., component was unmounted)*, it stops listening for snapshot updates. This behavior really shines when multiple components are rendering collection/document data and it becomes more difficult to determine whether snapshot updates should be enabled or not.


## Examples

- [TodoApp](https://rawgit.com/IjzerenHein/firestorter/master/examples/todoApp/build/index.html) ([source](./examples/todoApp/src))


## Documentation

- [API Reference](./docs/API.md)
- [Using Collections and Documents with a store](./docs/Store.md)
- Real-time updating modes (coming soon)
- Using Collection and Document inside a Component (coming soon)
- Using Queries (coming soon)
- Why you should create a component per document (coming soon)


## Work in progress

Hi ✋, and thanks for visiting this project in it's early stages.
Firestorter is being build as you read this. The API is pretty stable, but more testing and documentation is still needed. Let me know if you run into problems or have requests 🤘

- [x] Collection class
- [x] Document class
- [x] Adding documents
- [x] Updating documents
- [x] Deleting documents
- [x] Queries
- [x] Changing of ref/path in Collection
- [x] Smart enable/disable real-time fetching based on whether collection is rendered
- [x] Real-time fetching (onSnapshot) always enabled mode
- [x] Manual fetching mode
- [x] Fetching property to indicate loading state
- [x] Per document fetching
- [x] Per document real time updates
- [ ] Sub-collections in documents
- [ ] Revise Collection.add
- [ ] Delete all documents in a collection or query
- [ ] Schemas / custom documents
- [ ] Blobs
- [ ] GeoPoint ?
- [ ] Batch updates
- [ ] More documentation / articles


## License

[MIT](./LICENSE.txt)
