# Debugging

Sometimes it is useful to see what a Collection or Document is doing, in order to trouble-shoot problems or understand behavior.

Collections and Documents support a `debug` and `debugName` property, which enables debug logging to the console. To enable debug logging, set the `debug` property to `true`.

```js
const col = new Collection('todos', {
  debug: true,
  debugName: 'Todos' // optional
});

const doc = new Document('todos/12452232', {
  debug: true,
  debugName: 'Todo' // optional
});
```
