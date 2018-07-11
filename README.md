<!-- prettier-ignore -->
<h1 align="center">
  <img src="./logo3.jpg" /><br>
  Firestorter
</h1>

<span class="badge-npmversion"><a href="https://npmjs.org/package/badges" title="View this project on NPM"><img src="https://img.shields.io/npm/v/firestorter.svg" alt="NPM version" /></a></span>
[![Build Status](https://travis-ci.org/IjzerenHein/firestorter.svg?branch=master)](https://travis-ci.org/IjzerenHein/firestorter)
[![codecov](https://codecov.io/gh/IjzerenHein/firestorter/branch/master/graph/badge.svg)](https://codecov.io/gh/IjzerenHein/firestorter)
[![MIT licensed](https://img.shields.io/badge/license-MIT-blue.svg)](https://raw.githubusercontent.com/IjzerenHein/firestorter/master/LICENSE.txt)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)
[![Release Notes](https://release-notes.com/badges/v1.svg)](https://release-notes.com/@IjzerenHein/Firestorter)
[![Donate](https://img.shields.io/badge/Donate-PayPal-green.svg)](https://www.paypal.com/cgi-bin/webscr?cmd=_s-xclick&hosted_button_id=C7KAZKHW6MXYL)

> Use Firestore in React with zero effort 🤘

* 🎶 Simple, easy to use API, get up & running in minutes
* 🚀 Fast, only fetches and re-renders data when needed
* 🤘 No clutter, no complex stores/providers/actions/reducers, just go

Because, React `+` Firestore `+` Mobx `===` ❤️

![this-thing-really-moves](./this-thing-really-moves.gif)

## Index

* [Installation](#installation)
* [Usage](#usage)
* [How it works](#how-it-works)
* [Examples](#examples)
* [Documentation](./docs/API.md)
* [Work in progress](#work-in-progress)

## Installation

    yarn add firestorter

> Firestorter is compatible with MobX >= 4.x. If you want to use MobX 3.x, please use [Firestorter 0.9.3](https://github.com/IjzerenHein/firestorter/releases/tag/v0.9.3) or lower.

_Also install the `mobx`, `mobx-react` and `firebase` dependencies:_

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
const Todos = observer(class Todos extends Component {
  render() {
    return <div>
      {todos.docs.map((doc) => (
        <TodoItem
          key={todo.id}
          doc={doc} />
      ))}
    </div>;
  }
});

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

It does this by intelligently tracking whether a Collection or Document should be listening for real-time updates (`onSnapshot` events) or not. Whenever a Component renders a Collection or Document, firestorter enables real-time updates on that resource. And whenever a Component stops using the resource _(e.g., component was unmounted)_, it stops listening for snapshot updates. This behavior really shines when multiple components are rendering collection/document data and it becomes more difficult to determine whether snapshot updates should be enabled or not.

## Examples

* TodoApp [(view)](https://react-firestore-todo-app.stackblitz.io) [(source)](./examples/todoApp/src) [(Playground on StackBlitz)](https://stackblitz.com/edit/react-firestore-todo-app?file=Todos.js)

## Documentation

* [API Reference](./docs/API.md)
* [Introduction to Firestorter](https://medium.com/@hrutjes/building-a-react-firestore-app-with-zero-effort-and-mobx-525df611eabf)
* [Paths & References](./docs/PathsAndReferences.md)
* [Adding, Updating & Deleting documents](./docs/AddUpdateDelete.md)
* [Using Collections and Documents with a store](./docs/Store.md)
* [Using Queries](./docs/Queries.md)
* [Using Sub-collections](./docs/SubCollections.md)
* Real-time updating modes (coming soon)
* Using Collection and Document inside a Component (coming soon)
* Why you should create a component per document (coming soon)

## Work in progress

Hi ✋, and thanks for visiting this project in its early stages.
Firestorter is being built as you read this. The API is pretty stable, but more testing and documentation is still needed. Let me know if you run into problems or have requests 🤘

* [x] Collection class
* [x] Document class
* [x] Adding documents
* [x] Updating documents
* [x] Deleting documents
* [x] Queries
* [x] Changing of ref/path in Collection
* [x] Smart enable/disable real-time fetching based on whether collection is rendered
* [x] Real-time fetching (onSnapshot) always enabled mode
* [x] Manual fetching mode
* [x] Fetching property to indicate loading state
* [x] Per document fetching
* [x] Per document real time updates
* [x] Document Schemas (using superstruct)
* [x] Custom Document classes
* [x] Ability to set Document path, based on contents of another document
* [x] Document.set
* [x] Document.ready (Promise to check whether data is available)
* [x] Collection.ready (Promise to check whether docs are available)
* [x] Ability to set Collection path, based on contents of a document
* [x] Ability to set reactive query on Collection
* [X] FieldPath notation for Document.update
* [ ] Collection pagination (in progress)
* [ ] Sub-collections howto
* [ ] Revise Collection.add
* [ ] Delete all documents in a collection or query
* [ ] Blobs
* [ ] GeoPoint ?
* [ ] Batch updates
* [ ] More documentation / articles

## License

[MIT](./LICENSE.txt)

## Acknowledgements

* Thanks to all [sponsors](./sponsors.md) supporting this project
* Logo design by [Alex Prodrom](https://github.com/AlexProdrom)
