# Firestorter

Use Firestore in React with zero effort, using MobX 🤘

## [Unreleased]

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
