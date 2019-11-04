# Custom Documents

Depending on how you use Firestorter, you want to be implement custom Documents or Collections. This is useful when you want to add additional helper methods/properties to the document or class or want to perform schema validation.

The following basic example shows how you can create a custom Document class and use it with a Collection.

```js
import { Collection, Document } from 'firestorter';

// Custom album class
class Album extends Document {

  // Getter for the name field
  get name() {
    return this.data.name;
  }

  // Getter/setter for the editable rating field
  get rating() {
    return this.data.rating;
  }
  set rating(val: number) {
    this.update({
      rating: val
    });
  }
}

// Provide a `createDocument` factory function to instantiate
// the Album class
const albums = new Collection('albums', {
  createDocument: (source, options) => new Album(source, options)
});
```
