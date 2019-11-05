# Fetch modes

With Firestorter you can choose how data is fetched, either automatically **(recommended)** or manually. The updating mode of a Collection or Document in controlled through the `mode` property and can have one of these values:

- `auto` (**default**, starts/stops snapshot listeners depending on whether content is accessed)
- `off` (snapshot listeners are disabled, you need to call `fetch` explicitly)
- `on` (snapshot listeners are permanently turned on)


## Automatic fetching (**recommended**)

By default, Firestorter uses automatic fetching for all Collections and Documents.
Using the `auto` mode, Firestorter tracks whether the collection or document is accessed from within an observed Component or MobX reactive function. And when that is the case, it will automatically start listening for real-time snapshot updates on that collection or document.

This behavior is probably Firestorter biggest feature and takes away the burden of managing whether snapshot listeners should be started/stopped in your application.

In order to make this work, access to the Collection or Document should be performed from within a MobX reactive function, such as the `autorun` function or an observed React Component.

```js
// Store.js
export const todos = new Collection('todos');
```

```jsx
// TodoList.js
import { observer } from 'mobx-react';
import { todos } from './store';

// Wrapping component with `observer`, will make it
// update whenever the document content changes.
const TodoItem = observer(({doc}) => {
  const { finished, text } = doc.data;
  return <div>
    <input type='checkbox' checked={finished} />
    <input type='text' value={text} />
  </div>;
});

// Wrapping the list component with `observer` will make it
// update whenever the collection changes. In this case, because
// the document data is accessed solely from within the `TodoItem` component,
// the TodoList component will only update when a todo is added, removed
// or when its sort-order in the collection changes.
export default observer(class TodoList extends Component {
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
```

## Manual fetching (mode = "off")

To enable manual fetching, set the `mode` to `"off"` and call `fetch` explicitly.

```js
// Turn off automatic fetching
const col = new Collection('todos', {
  mode: 'off'
});

// Explicitely call fetch and wait for it
await col.fetch();

// Data is ready
col.docs.forEach(doc => console.log('doc.id:', doc.id));
```

That's it really, happy fetching.


## Always "on" fetching (not recommended)

Fetching may also be permanently turned on, regardless of whether any reactive functions/observed components are using the data.

To turn it permanently on, use:

```js
const col = new Collection('todos', {
  mode: 'on'
});
```

> [!DANGER]
> Using `mode = "on"` is dangerous and can cause memory and resource leaks when used incorrectly. This is because when `"on"` is used, the snapshot listeners are permanently turned on and keep the object alive, even when it is no longer accessed by any JavaScript code.

The following construct should therefore be avoided:

```jsx
export default observer(class TodoList extends Component {
  // Bad use of `mode = "on"`, which will cause a memory/resource leak
  // when the component class is destroyed
  const col = new Collection('todos', {
    mode: 'on'
  }); 
  render() {
    return <div>
      {this.col.map((doc) => (
        <TodoItem
          key={doc.id}
          doc={doc} />
      ))}
    </div>;
  }
}));
```


## Changing the mode

To change the mode after construction, use the `mode` property.

```js
// Create collection with mode = 'auto'
const col = new Collection('todos');
...

// Switch to manual mode and fetch explicitly
col.mode = "off";
await col.fetch();
```

## `isLoading` behavior

Depending on the [fetching mode](./guides/FetchingData.md), the `isLoading` property is updated as follows:

| Mode   | `isLoading` behavior                                                                                                                                                                 |
| ------ | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `auto` | Becomes `true` when the snapshot listeners are started, and `false` when the initial snapshot has been received. Is not updated when data changes after the initial snapshot.        |
| `off`  | Becomes `true` when the `fetch` is called, and `false` when `fetch` has completed.                                                                                                   |
| `on`   | Becomes `true` upon construction or setting the mode to `"on"` and `false` when the initial snapshot has been received. Is not updated when data changes after the initial snapshot. |


Besides using `isLoading`, there is also a Promise based way to wait for data to be loaded. Using the `ready()` method, it's possible to wait for (automatic) fetching to have completed. This is useful when for instance writing unit-tests or executing an async-function, and you need to be sure that the data has loaded.


## See also
- [Fetching data](./guides/FetchingData.md)
- [Queries](./guides/Queries.md)
