# react-firestore-mobx

Simple, intuitive & super efficient Firestore bindings for React, using Mobx observables.

- **Simple**, get up & running in minutes
- **Intuitive**, straightforward API, classes map to firestore concepts
- **Super efficient**, finely grained re-rendering because of mobx
- **Animation friendly**, animations just work because of efficient rendering 
- **No clutter**, no complex stores/providers/actions/reducers, just go

Because, React `+` Firestore `+` Mobx `===` ❤️


- [Installation](#installation)
- [Usage](#usage)
- [Examples](#examples)
- [Documentation](./docs/API.md)


## Installation

	yarn add react-firestore-mobx
	
*This will automatically install `mobx` and `mobx-react`*

## Usage

```js
import firebase from 'firebase';
import 'firebase/firestore';
import {setFirebaseApp, Collection} from 'firestore-react-mobx';
import {observer} from 'mobx-react';

// Initialize firebase app
firebase.initializeApp({...});

// Initialize `react-firestore-mobx`
setFirebaseApp(firebase);

// Create collection and listen for real-time updates
const todos = new Collection('todos').start();

// Observe collection and only re-render when
// documents are added/removed/moved in it.
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

// Observe doc and re-render when finished or text change.
// Does not re-render when other docs are
// added/removed/updated in the collection.
const TodoItem = observer(({doc}) => {
  const {finished, text} = doc.data;
  return <div>
    <input type='checkbox' checked={finished} />
    <input type='text' value={text} />
  </div>;
});

ReactDOM.render(<Todos />, document.getElementById('root'));
```

## Examples

- [TodoApp](https://rawgit.com/IjzerenHein/react-firestore-mobx/master/examples/todoApp/build/index.html) ([source](./examples/todoApp/src))


## Documentation

- [API Reference](./docs/API.md)


## Work in progress

react-firestore-mobx is being build as you read this. The essentials are done 
but more functionality and testing is still needed.

Todo:

- [ ] Per document fetching
- [ ] Per document real time updates
- [ ] Sub-collections in documents
- [ ] Revise Collection.add
- [ ] Collection.delete()
- [ ] Blobs
- [ ] GeoPoint ?
- [ ] Custom Documents ?
- [ ] Batch updates
- [ ] More testing


## License

[MIT](./LICENSE.txt)
