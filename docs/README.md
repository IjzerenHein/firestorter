# Firestorter

> Use Google Firestore in React with zero effort, using MobX 🤘

* 🎶 Simple, easy to use API, get up & running in minutes
* 🚀 Fast, only fetches and re-renders data when needed
* 🤘 No clutter, no complex stores/providers/actions/reducers, just go

**1. Initialize**

```js
import * as firebase from 'firebase/app';
import 'firebase/firestore';
import { initFirestorter } from 'firestorter';

// Initialize firebase app
firebase.initializeApp({...});

// Initialize `firestorter`
initFirestorter({ firebase: firebase });
```
> Firestorter also works with **react-native** and supports multi app environments

**2. Create a `Collection` or `Document`**

```js
import { Collection, Document } from 'firestorter';

const todos = new Collection('todos');
const user = new Document('users/8273872***');
```

**3. Wrap your Components with mobx's `observer` pattern**
```jsx
import * as React from 'react';
import { observer } from 'mobx-react';

const Todos = observer(class Todos extends React.Component {
  render() {
    return <div>
      {todos.docs.map((doc) => (
        <TodoItem
          key={doc.id}
          doc={doc} />
      ))}
    </div>;
  }
});

const TodoItem = observer(({doc}) => {
  const { finished, text } = doc.data;
  return <div>
    <input type='checkbox' checked={finished} />
    <input type='text' value={text} />
  </div>;
});
```

**That's it.** Your Components will now render your firestore data
and re-render when data in the back-end changes.

## How it works

Firestorter makes integrating Firestore real-time data into React easy as pie. It does this by providing a simple API for accessing Collection and Document data, whilst taking away the burden of managing snapshot listeners, data-caching and efficiently updating your React components.

It does this by intelligently tracking whether a Collection or Document should be listening for real-time updates (`onSnapshot` events) or not. Whenever a Component renders a Collection or Document, firestorter enables real-time updates on that resource. And whenever a Component stops using the resource _(e.g., component was unmounted)_, it stops listening for snapshot updates. This behavior really shines when multiple components are rendering collection/document data and it becomes more difficult to determine whether snapshot updates should be enabled or not.

## Features

- [Add, update & delete documents](./guides/AddUpdateDelete.md)
- [Super efficient Component re-rendering](./guides/FetchingData.md#automatic-fetching)
- [Declaratively link document/collection paths to document data](./guides/SourcesPathsAndReferences.md#reactive-path-functions)
- [Geo query support](./guides/GeoQueries.md)
- [Easily create aggregate collections from multiple queries](./guides/AggregateCollections.md)
- [Runtime schema validation](./guides/SchemaValidation.md) & [Type Generics](./guides/Generics.md)
- [Manual fetching mode for use with Unit-tests/Async-functions](./guides/FetchModes.md)
- [React-native support](./guides/Installation.md#usage-with-react-native)
- [TypeScript- & Flow typings](./guides/Generics.md)
- Works with Vue.js


Want to learn more, head over to the [Guides](./guides/Guides.md).





