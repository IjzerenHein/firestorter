# Aggregate collections

In Google Firestore, data is stored as Collections and Documents. Through a collection, you can fetch a certain set of documents using [simple or compound queries](https://firebase.google.com/docs/firestore/query-data/queries). There are however important limitations in what queries can be executed, in order to keep the Firestore back-end fast and scalable, even for the largest of datasets.

In your application it is however sometimes still neccessary to execute multiple queries, to get to all the data that you need. You may need to aggregate the results of multiple queries into a single collection. Using Firestorter this can be quickly and efficiently achieved using the `AggregateCollection` class.

```js
import { AggregateCollection } from 'firestorter';

// Create an aggregate collection that queries all albums
// for a set of artists
const artistIds = ['271769372', '28379822', '2278372982'];
const albums = new AggregateCollection('albums', {

  // The queries function should return an array of `{key, query}`
  // objects. The key is important and will ensure that queries
  // can be recycled.
  queries: () => artistIds.map(artistId => ({
    key: `artist:${artistId}`,
    query: ref => ref.where('artistId', '==', artistId)
  }))
});

// Start listening for updates on the aggregate collection
autorun(() => {
  albums.docs.forEach(doc =>  console.log('albumId: ', doc.id));
});
```


## Sorting results

Since the aggregation of data is performed client-side by Firestorter, the documents may not be sorted in the way that you want. In order to sort the documents, provide a `orderBy` function.

```js
const albums = new AggregateCollection('albums', {
  ...
  orderBy: (a, b) => {
    return a.data.createdAt.toDate().getTime() - b.data.createdAt.toDate().getTime();
  }
});
```



## Filtering results

In case the queries return unwanted documents, they can be filtered out using the `filterBy` function.

```js
const albums = new AggregateCollection('albums', {
  ...
  filterBy: doc => doc.data.published // filter out all un-published docs
});
```

> If queries return duplicate documents, these duplicates are automatically removed from the results. No `filterBy` function needs to be defined for that.



