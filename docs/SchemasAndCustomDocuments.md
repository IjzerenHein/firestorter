## Schema validation and Custom documents

Firestorter offers document JSON data validation through [superstruct](https://github.com/ianstormtaylor/superstruct)
schemas. These schemas validate that the data is as expected and adds an
important safe-guard when writing to Firestore, to ensure the data conforms
to your data-specification.

### Creating schemas

Schemas can be created using the [superstruct](https://github.com/ianstormtaylor/superstruct) library.
Superstruct allows you to define a function that can verify JavaScript objects
against a pre-defined schema (aka structs). Please read the [superstruct documentation](https://github.com/ianstormtaylor/superstruct#documentation) on how to define structs.

If not already installed, add `superstruct` to your project.

    yarn add superstruct

Create a schema using the `struct` function.

```js
import { struct } from 'superstruct'

const ArticleSchema = struct({
  title: 'string',
  is_published: 'boolean?',
  tags: ['string'],
  author: {
    id: 'number',
  },
});
```

### Timestamps

In Firestore, date/time is represented using `Timestamp` objects which have
a higher precision than `Date`. To use these timestamps in schemas, use
the `isTimestamp` helper function.

```js
import { isTimestamp } from 'firestorter';

const TaskSchema = struct({
  name: 'string',
  startDate: isTimestamp,
  duration: 'number'
});

const doc = new Document('tasks/mytask', {
  schema: TaskSchema
});
await doc.fetch();
console.log('startDate: ', doc.data.startDate.toDate());
```

### Custom documents

Once a schema has been created, it can be assigned to a Document.

```js
// Create a custom document class with a schema
class Article extends Document {
  constructor(source, options = {}) {
    super(source, {
      schema: ArticleSchema,
      ...options
    });
  }
}
```

Whenever the Document reads or writes data from/to Firestore, it will first
validate the data against the schema. For instance, when updating
a document, invalid JSON would cause an exception when calling `.update` or `.set`.
When the validation fails, no data is written to Firestore and th returned
promise is rejected with a descriptive error.

❌  Invalid JSON
```js
const doc = new Article('articles/firestorter');
await doc.update({
  'author.id': 'hent'
});
// This throws an exception because `author.id` should be a number
```

✅  Correct JSON
```js
await doc.update({
  'title': 'Firestorter, because React `+` Firestore `+` Mobx `===` ❤️'
});
```

### Using with Collections

By default, Collections create and use **plain** documents without
any schema validation. To use schema validation with Collections, 
create a custom Document and assign it to the Collection.

```js
import { Collection } from 'firestorter';

const articles = new Collection('articles', {
  createDocument: (source, options) => new Article(source, options)
});
```

When using TypeScript, you can take this one step further and
use generics to ensure that `.docs` and `.add` use your custom
document type.

```ts
import { Collection } from 'firestorter';

const articles = new Collection<Article>('articles', {
  createDocument: (source, options) => new Article(source, options)
});

// .add now uses the correct 'Article' type
const article: Article = await articles.add({
  title: 'Lorum ipsum',
  tags: [],
  author: {
    id: 20
  }
});
```
