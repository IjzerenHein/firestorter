# Generics

Firestorter is written in TypeScript and contains both TypeScript & Flow typings and generics. Using generics, Documents can be provided a data-type for the `data` property. This helps in finding problems at compile time, when for instance a field is accessed that is absent from the type-definition.

If you are looking for run-time type validation, have a look at [Schema validation](./guides/SchemaValidation.md).

## Document generics

To use document generics, pass a `type` or `interface` to the Document class.

```tsx
import { Document } from "firestorter";

type TodoType = {
	text: string;
	finished: boolean;
};

const todo = new Document<TodoType>();
await todo.fetch();

console.log('todo ' + todo.data.message); // <-- Good
console.log('is done: ' + todo.data.done);// <-- Error, `done` does not exist in TodoType
```

## Collection generics

Similar to Document generics, Collections can be provided a custom Document type.

```tsx
import { Document, Collection } from "firestorter";

type TodoType = {
	text: string;
	finished: boolean;
};

const todos = new Collection<Document<TodoType>>("todos");
await todos.fetch();

todos.docs.forEach(doc => {
  console.log('todo ' + doc.data.message); // <-- Good
  console.log('is done: ' + doc.data.done);// <-- Error, `done` does not exist in TodoType
});
```

