<h1 align="center">
  <img src="./logo.jpg" style="max-height: 320px;"/><br>
  Firestorter
</h1>


Simple & fast Firestore bindings for React, using Mobx observables. 🤘

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

It does this by intelligently tracking whether a Component is actually rendering a Collection or Document. Whenever this is the case, firestorter starts listening for real-time updates on that Collection or Document. Whenever a Component stops using the Document or Collection *(e.g., because it was unmounted)*, it stops listening for snapshot updates. It is possible that multiple components are rendering a Collection. And only when the last one stops rendering it, will real-time snapshots be turned off.

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


## Work in progress

Firestoreter is being build as you read this. The essentials are done 
but more functionality and testing is still needed.

Still Todo:

- [ ] Per document fetching
- [ ] Per document real time updates
- [ ] Sub-collections in documents
- [ ] Revise Collection.add
- [ ] Collection.delete()
- [ ] Schemas
- [ ] Blobs
- [ ] GeoPoint ?
- [ ] Custom Documents ?
- [ ] Batch updates
- [ ] More testing


## License

[MIT](./LICENSE.txt)
