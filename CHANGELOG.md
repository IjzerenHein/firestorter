# Firestorter

Use Firestore in React with zero effort, using MobX 🤘

## [Unreleased]

## [3.0.1] - 2020-12-23

### Added

- Add support for MobX 6! 🤘🤘🤘🤘🤘🤘
- Add `FirestorterConfig` type definition.

### Removed

- MobX 5 and 4 are no longer supported. Use `firestorter@2` instead.
- Removed the deprecated `makeContext` function. Use `makeFirestorterContext` instead.

## [2.0.1] - 2019-12-02

### Added

- Added new `isLoaded` property for checking whether data/docs have been loaded initially

## [2.0.0] - 2019-11-07

### Added

- Added new `AggregateCollection` class
- Added new `GeoQuery` class for performing geographical queries
- Added geographical helper functions
- Added flow-typings
- Added whole new Documentation website 🤘

### Changed

- `makeContext` has been renamed to `makeFirestorterContext`

### Removed

- Removed the deprecated `DocumentClass` constructor option for `Collection`

## [1.2.3] - 2019-10-16

### Fixed

- Fixed `mergeUpdateData` throwing an exception when FieldValue.delete() is used with react-native-firebase

### Changed

- Improved `Collection.hasDocs` to be more efficient and work nicely with `computedRequiresReaction` (it's no longer computed)

## [1.2.2] - 2019-03-19

### Fixed

- Added `Document.hasDocs` which only reacts when the collection becomes empty/non-empty, but not when the document-count changes (thanks @damonmaria)
- Added debug logging for `Collection.fetch`

## [1.2.1] - 2019-02-17

### Fixed

- Fixed return type definition for `Document.fetch` to be `Promise<Document<T>>` (thanks @damonmaria)

## [1.2.0] - 2019-01-30

### Added

- Added "context" option which makes it possible to use multiple firebase projects (thanks @justjake)
- Added document data generics for `Document`

### Fixed

- Fixed query function type in TypeScript, which could not return `null` to disable the collection
- Fixed peer-dependency warning when using Firestorter with MobX 4 (e.g. on react-native)
- Improved the (somewhat) confusing TypeScript documentation

## [1.1.1] - 2018-11-29

### Fixed

- Fixed `Mode` import not working

## [1.1.0] - 2018-11-23

### Added

- Added support for MobX strict mode (`enforceActions: 'always'`)
- Added `Document.hasData`, which can be used to check whether the document exists/has been fetched
- Added Document `snapshotOptions` option, to control how Firestore server-timestamps are handled in snapshots
- Added support for handling `Timestamp`s in schemas, using the new `isTimestamp` helper function

### Fixed

- Fixed various TypeScript type definition errors
- Fixed `Document.data` not cleared after getting get a fetch-error
- Fixed `Collection.docs` not cleared after changing path/ref to a non-accessible collection

## [1.0.4] - 2018-11-20

### Added

- Added TypeScript as a first-class language (converted to TypeScript and added type-bindings)
- Added Collection `createDocument` factory function, in which documents can be created based on the snapshot data (`new Collection({createDocument: (source, options) => return new Document(source, options)}))`)
- Added documentation for using firestorter with TypeScript and react-native

### Fixed

- Fixed exception when accessing `Document.source` or `Collection.source`

### Removed

- Removed deprecated `active` property from Collection & Document (use `isActive` instead)
- Removed deprecated `fetching` property from Collection & Document (use `isLoading` instead)

### Deprecated

- The Collection `DocumentClass` constructor option has been deprecated (use `createDocument` instead)

## [0.16.1] - 2018-09-28

### Fixed

- Fixed schema validation in `Document.update` or `Document.set` sometimes failed, when data document data contained arrays or sub-objects

## [0.16.0] - 2018-09-24

### Added

- Added ability to disable the Collection by returning `null` from a query function (this may break some things)
- Added automatic removal of all documents from a Collection when it is disabled (when `path` or `ref` is cleared or query is set to `null`)

### Changed

- Made snapshot errors more verbose so simplify debugging

## [0.15.4] - 2018-09-14

### Fixed

- Fixed exception when calling `.update()` on a document with a schema, that has not yet been fetched

## [0.15.3] - 2018-09-13

### Fixed

- Fixed `lodash.isequal` not defined as a direct dependency

## [0.15.2] - 2018-09-12

### Added

- Added logging of `onSnapshot` errors

### Fixed

- Fixed exception when fetching a Document which doesn’t exist and which has a schema defined

## [0.15.1] - 2018-09-05

### Added

- Added log-message when Document snapshot failed

### Fixed

- Fixed schema validation error not using the `debugName` when specified to constructor

## [0.15.0] - 2018-08-31

### Added

- Added support for code-debugging and smaller bundles on react-native (`react-native` entry in package.json)
- Added support for specifying a specific firebase-app to use, instead of always using the default firebase app (`initFirestorter({firebase, app})`)

## [0.14.2] - 2018-07-12

### Fixed

- Fixed Document not triggering a reaction after calling `Document.update` with a field-path

### Added

- Added debug statement to log `Document` snapshot updates

## [0.14.1] - 2018-07-11

### Fixed

- Fixed schema violation in `Document.update/set` when using a dotted FieldPath.
- Fixed schema violation in `Document.update/set` when deleting fields using FieldValue.delete().

## [0.14.0] - 2018-06-17

### Added

- Added `Collection.minimizeUpdates` option to prevent multiple updates when starting real-time updates on a Collection. This happens when some of the query results are loally cached, causing Firestore to fire multiple `onSnapshot` events. Enabling this option causes Firestorter to skip/debounce the first local snapshot, in favor of the full result received slightly later from the cloud.

### Fixed

- Fixed unneccessary re-start of real-time updates on `Collection` when the query changes.

## [0.12.1] - 2018-06-11

### Changed

- Replaced `fetching` with the `isLoading` property (better name + isLoading also causes realtime updates to become active, fixes #18)
- Renamed `active` prop to `isActive` (active still supported but shows deprecation warning)

### Fixed

- Fixed `Collection.add` still writing to firestore when schema didn't validate

### Removed

- Removed obsolete firestore snapshot fields `Document.createTime`, `Document.updateTime` and `Document.readTime`

## [0.11.1] - 2018-06-04

### Fixed

- Fixed `Document.update` throwing exception when schema was used.

## [0.11.0] - 2018-05-30

### Added

- Added new method for defining queries using an observed function (e.g. `col.query = (ref) => ref.orderBy('text', 'asc')`). This is now the new recommended way for defining queries.

## [0.10.0] - 2018-03-27

### Added

- Added support for MobX 4 (for MobX 3.x, use 0.9.3 or lower)
- Added donation link and sponsor acknowledgements
- Added CHANGELOG.md & release-notes badge

## [0.9.3] - 2018-01-21

### Added

- Made `getFirestore` available externally

## [0.9.2] - 2018-01-21

### Added

- Added code coverage
- Added additional unit tests

### Fixed

- Fixed Promise not rejected on `Collection.add`, when invalid doc-data was specified

### Changed

- Removed firebase as a peer dependency
- Various updates to docs

## [0.9.1] - 2018-01-07

### Added

- Added `Document.ready` and `Collection.ready`
- Added lots of unit tests

### Changed

- Path observations are now immediate
- Updated docs

## [0.9.0] - 2018-01-01

### Added

- Added ability to specify reactive-functions to the ref, path and query property of Document & Collection
- Added `Document.active` and `Collection.active` property which indicates whether real-time updating is current active
- Added `Document.set` operation
- Added unit tests for Document & Collection (wip)

### Changed

- The realtimeUpdating property has been renamed to mode (realtimeUpdating has been deprecated and will be removed soon)
- Many documentation updates

### Fixed

- Minor fixes
