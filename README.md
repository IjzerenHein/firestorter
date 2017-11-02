# react-firestore-mobx

Simple & super efficient Firestore to React bindings using Mobx observables.

Because Firestore, React and Mobx === ❤️


## Installation

	yarn add react-firestore-mobx
	
*This will automatically install `mobx` and `mobx-react`*.
	
## Usage

```js
import firebase from 'firebase';
import 'firebase/firestore';
import {Collection} from 'firestore-react-mobx';
import {observer} from 'mobx-react';

// Initialize firebase app
firebase.initializeApp({...});

// Create collection and listen for real-time updates
const db = firebase.firestore();
const todos = new Collection(db.collection('todos'), true);

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

- [TodoApp](https://cdn.rawgit.com/IjzerenHein/react-firestore-mobx/d706091d/examples/todoApp/build/index.html)([source](./examples/todoApp))


## Work in progress

- [ ] API Documentation
- [ ] Adding documents (Collection.update)
- [ ] Document.update
- [ ] Optimize observable rendering further
- [ ] More testing


## License

[MIT](./LICENSE.txt)
