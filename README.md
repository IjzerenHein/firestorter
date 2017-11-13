<h1 align="center">
  <img src="./logo2.jpg" /><br>
  Firestorter
</h1>


Simple & super fast Firestore bindings for React, using Mobx observables. 🤘

- **Simple**, easy to use API, get up & running in minutes
- **Fast**, only queries and re-renders data when needed
- **No clutter**, no complex stores/providers/actions/reducers, just go


![this-thing-really-moves](./this-thing-really-moves.gif)

Because, React `+` Firestore `+` Mobx `===` ❤️

## Index

- [Work in progress](#work-in-progress)
- [Installation](#installation)
- [Usage](#usage)
- [How it works](#how-it-works)
- [Examples](#examples)
- [Documentation](./docs/API.md)
- [Todo](#todo)


## Work in progress

*Thank you for checking out this repo in its early stages. This project was 
previously known as `react-firestore-mobx` and is under active development.
Its API may therefore still change a bit as I work out the kinks.
This message will disappear when I feel the API is solid.*


## Installation

	yarn add firestorter
	
*This will automatically install `mobx` and `mobx-react`*

## Usage

```js
import firebase from 'firebase';
import 'firebase/firestore';
import {setFirebaseApp, Collection} from 'firestorter';
import {observer} from 'mobx-react';

// Initialize firebase app
firebase.initializeApp({...});

// Initialize `firestorter`
setFirebaseApp(firebase);

// Define collection
const todos = new Collection('todos');

// Wrap your Components with mobx's `observer` when
// you use a Firestorter Collection- or Document
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

That's it.


## How it works

Firestorter makes integrating Firestore real-time data into React easy as pie. It does this by providing a simple API for accessing Collection and Document data, whilst taking away the burden of managing snapshot listeners, data-caching and efficiently updating your React components.

It does this by intelligently tracking whether a Collection or Document should be listening for real-time updates (`onSnapshot` events) or not. Whenever a Component renders a Collection or Document, firestorter enables real-time updates on that resource. And whenever a Component stops using the resource *(e.g., component was unmounted)*, it stops listening for snapshot updates. This behavior really shines when multiple components are rendering collection/document data and it becomes more difficult to determine whether snapshot updates should be enabled or not.

More to come..

## Examples

- [TodoApp](https://rawgit.com/IjzerenHein/firestorter/master/examples/todoApp/build/index.html) ([source](./examples/todoApp/src))


## Documentation

- [API Reference](./docs/API.md)
- Why you should create a component per document (coming soon)
- Using Queries (coming soon)
- Creating a Collection/Document inside a Component (coming soon)
- Permanently keep a Collection/Document up to date (coming soon)
- Manual fetching (coming soon)


## Todo

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
- [ ] Per document fetching
- [ ] Per document real time updates
- [ ] Sub-collections in documents
- [ ] Revise Collection.add
- [ ] Delete all documents in a collection or query
- [ ] Schemas / custom documents
- [ ] Blobs
- [ ] GeoPoint ?
- [ ] Batch updates


## License

[MIT](./LICENSE.txt)
