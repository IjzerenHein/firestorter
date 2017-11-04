module.exports =
/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId]) {
/******/ 			return installedModules[moduleId].exports;
/******/ 		}
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			i: moduleId,
/******/ 			l: false,
/******/ 			exports: {}
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.l = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// define getter function for harmony exports
/******/ 	__webpack_require__.d = function(exports, name, getter) {
/******/ 		if(!__webpack_require__.o(exports, name)) {
/******/ 			Object.defineProperty(exports, name, {
/******/ 				configurable: false,
/******/ 				enumerable: true,
/******/ 				get: getter
/******/ 			});
/******/ 		}
/******/ 	};
/******/
/******/ 	// getDefaultExport function for compatibility with non-harmony modules
/******/ 	__webpack_require__.n = function(module) {
/******/ 		var getter = module && module.__esModule ?
/******/ 			function getDefault() { return module['default']; } :
/******/ 			function getModuleExports() { return module; };
/******/ 		__webpack_require__.d(getter, 'a', getter);
/******/ 		return getter;
/******/ 	};
/******/
/******/ 	// Object.prototype.hasOwnProperty.call
/******/ 	__webpack_require__.o = function(object, property) { return Object.prototype.hasOwnProperty.call(object, property); };
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(__webpack_require__.s = 2);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports) {

module.exports = require("mobx");

/***/ }),
/* 1 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = __webpack_require__(0);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Document = function () {
	function Document(snapshot) {
		_classCallCheck(this, Document);

		this._snapshot = snapshot;
		this._createTime = (0, _mobx.observable)(snapshot.createTime);
		this._updateTime = (0, _mobx.observable)(snapshot.updateTime);
		this._readTime = (0, _mobx.observable)(snapshot.readTime);
		this._data = (0, _mobx.observable)(snapshot.data());
		this._refCount = 1;
	}

	_createClass(Document, [{
		key: 'onFinalRelease',


		// TODO - realtime?

		/**
   * Overidable method that is called whenever the collection
   * or any of its associated queries are no longer referencing
   * this document. This function can be used to perform
   * optional cleanup.
   */
		value: function onFinalRelease() {}
		// Override to implement


		/**
   * Firestore document reference.
   * @readonly
   * @type {DocumentReference}
   */

	}, {
		key: 'update',


		/**
   * Updates one or more fields in the document.
   *
   * @return {Promise}
   */
		value: function update(fields) {
			return this.ref.update(fields);
		}

		/**
   * Deletes the document in Firestore from its parent collection.
   *
   * @return {Promise}
   */

	}, {
		key: 'delete',
		value: function _delete() {
			return this.ref.delete();
		}
	}, {
		key: 'ref',
		get: function get() {
			return this._snapshot.ref;
		}

		/**
   * Underlying firestore snapshot.
   * @type {DocumentSnapshot}
   */

	}, {
		key: 'snapshot',
		get: function get() {
			return this._snapshot;
		},
		set: function set(snapshot) {
			this._snapshot = snapshot;
			this._createTime.set(snapshot.createTime);
			this._updateTime.set(snapshot.updateTime);
			this._readTime.set(snapshot.readTime);

			var data = snapshot.data();
			for (var key in data) {
				this._data[key] = data[key];
			}
		}

		/**
   * Id of the Firestore document.
   * @readonly
   * @type {String}
   */

	}, {
		key: 'id',
		get: function get() {
			return this._snapshot.ref.id;
		}

		/**
   * Data inside the Firestore document.
   * @type {Object}
   */

	}, {
		key: 'data',
		get: function get() {
			return this._data;
		},
		set: function set(data) {}
		// TODO


		/**
   * Time the document was created in firestore.
   * @readonly
   * @type {String}
   */

	}, {
		key: 'createTime',
		get: function get() {
			return this._readTime.get();
		}

		/**
   * Time the document was last updated in firestore.
   * @readonly
   * @type {String}
   */

	}, {
		key: 'updateTime',
		get: function get() {
			return this._updateTime.get();
		}

		/**
   * Time this document was last read from firestore.
   * @readonly
   * @type {String}
   */

	}, {
		key: 'readTime',
		get: function get() {
			return this._readTime.get();
		}
	}], [{
		key: 'create',
		value: function create(snapshot) {
			return new Document(snapshot);
		}
	}]);

	return Document;
}();

exports.default = Document;

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Document = exports.Collection = undefined;

var _Collection = __webpack_require__(3);

var _Collection2 = _interopRequireDefault(_Collection);

var _Document = __webpack_require__(1);

var _Document2 = _interopRequireDefault(_Document);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Collection = _Collection2.default;
exports.Document = _Document2.default;

/***/ }),
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = __webpack_require__(0);

var _Document = __webpack_require__(1);

var _Document2 = _interopRequireDefault(_Document);

var _DocumentStore = __webpack_require__(4);

var _DocumentStore2 = _interopRequireDefault(_DocumentStore);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Collection = function () {
	function Collection(ref, query) {
		_classCallCheck(this, Collection);

		this._docStore = new _DocumentStore2.default();
		this._createDocFn = _Document2.default.create;
		this._ref = (0, _mobx.observable)(ref);
		this._query = (0, _mobx.observable)(query);
		this._realtime = (0, _mobx.observable)(false);
		this._fetching = (0, _mobx.observable)(false);
		this._docs = (0, _mobx.observable)([]);
		this._onSnapshot = this._onSnapshot.bind(this);
	}

	/**
  * Array of documents.
  * @readonly
  * @type Array(Document)
  */


	_createClass(Collection, [{
		key: 'start',


		/**
   * Enables realtime updating and returns this object.
   *
   * @return {Collection} This collection
   */
		value: function start() {
			this.realtime = true;
			return this;
		}

		/**
   * Stops realtime updating and returns this object.
   *
   * @return {Collection} This collection
   */

	}, {
		key: 'stop',
		value: function stop() {
			this.realtime = false;
			return this;
		}

		/**
   * Fetches new data from firestore. Use this to manualle fetch
   * new data when `realtime` is disabled.
   *
   * @return {Promise} this query
   */

	}, {
		key: 'fetch',
		value: function fetch() {
			var _this = this;

			this._fetching.set(true);
			return new Promise(function (resolve, reject) {
				var ref = _this._query.get() || _this._ref.get();
				ref.then(function (snapshot) {
					_this._fetching.set(false);
					_this._updateFromSnapshot(snapshot);
					resolve(_this);
				}, function (err) {
					_this._fetching.set(false);
					reject(err);
				});
			});
		}

		/**
   * True when a fetch is in progress
   * @property
   * @type {bool}
   */

	}, {
		key: 'add',


		/**
   * Add a new document to this collection with the specified
   * data, assigning it a document ID automatically.
   *
   * @param {Object} data
   * @return {Promise} Promise to Document object
   */
		value: function add(data) {
			var _this2 = this;

			return new Promise(function (resolve, reject) {
				_this2.ref.add(data).then(function (ref) {
					ref.get().then(function (snapshot) {
						var doc = _this2._createDocFn(snapshot);
						resolve(doc);
					}, reject);
				}, reject);
			});
		}

		/**
   * Deletes all the documents in the collection or query.
   *
   * @return {Promise} Number of documents deleted
   */

	}, {
		key: 'deleteAll',
		value: function deleteAll() {}
		// TODO


		/**
   * @private
   */

	}, {
		key: '_onSnapshot',
		value: function _onSnapshot(snapshot) {
			this._fetching.set(false);
			this._updateFromSnapshot(snapshot);
		}

		/**
   * @private
   */

	}, {
		key: '_updateFromSnapshot',
		value: function _updateFromSnapshot(snapshot) {
			var _this3 = this;

			var newDocs = snapshot.docs.map(function (snapshot) {
				var doc = _this3._docStore.getAndAddRef(snapshot.id);
				if (doc) {
					doc.snapshot = snapshot;
				} else {
					doc = _this3._docStore.add(_this3._createDocFn(snapshot));
				}
				return doc;
			});
			this._docStore.releaseRefs(this._docs);

			if (this._docs.length !== newDocs.length) {
				this._docs.replace(newDocs);
			} else {
				for (var i = 0, n = newDocs.length; i < n; i++) {
					if (newDocs[i] !== this._docs[i]) {
						this._docs.replace(newDocs);
						break;
					}
				}
			}
		}
	}, {
		key: 'docs',
		get: function get() {
			return this._docs;
		}

		/**
   * Firestore collection reference.
   * @type {CollectionReference}
   */

	}, {
		key: 'ref',
		get: function get() {
			return this._ref.get();
		},
		set: function set(ref) {
			if (this._ref.get() === ref) return;
			this._ref.set(ref);
			if (!this._realtime.get()) return;
			if (!this._query.get()) {
				if (this._onSnapshotUnsubscribe) this._onSnapshotUnsubscribe();
				this._fetching.set(true);
				this._onSnapshotUnsubscribe = ref.onSnapshot(this._onSnapshot);
			}
		}

		/**
   * Firestore query.
   * @type {Query}
   */

	}, {
		key: 'query',
		get: function get() {
			return this._query.get();
		},
		set: function set(query) {
			if (this._query.get() === query) return;
			this._query.set(query);
			if (!this._realtime.get()) return;
			if (this._onSnapshotUnsubscribe) {
				this._onSnapshotUnsubscribe();
				this._onSnapshotUnsubscribe = undefined;
			}
			if (query) {
				this._fetching.set(true);
				this._onSnapshotUnsubscribe = query.onSnapshot(this._onSnapshot);
			} else if (this._ref.get()) {
				this._fetching.set(true);
				this._onSnapshotUnsubscribe = this._ref.get().onSnapshot(this._onSnapshot);
			}
		}

		/**
   * True when the firestore is monitored for real-time updates
   * @property
   * @type {bool}
   */

	}, {
		key: 'realtime',
		get: function get() {
			return this._realtime.get();
		},
		set: function set(realtime) {
			if (this._realtime.get() === realtime) return;
			if (this._onSnapshotUnsubscribe) {
				this._onSnapshotUnsubscribe();
				this._onSnapshotUnsubscribe = undefined;
			}
			if (realtime) {
				this._fetching.set(true);
				this._onSnapshotUnsubscribe = this._ref.get().onSnapshot(this._onSnapshot);
			}
			this._realtime.set(realtime);
		}
	}, {
		key: 'fetching',
		get: function get() {
			return this._fetching.get();
		}
	}]);

	return Collection;
}();

exports.default = Collection;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

/**
 * The DocumentStore stores a reference to all in-use documents.
 * It enables recycling of Documents so that a fetch doesn't create
 * new documents, but instead uses the existing ones. This is
 * important to ensure that no unneccesary rendering is performed.
 */
var DocumentStore = function () {
	function DocumentStore() {
		_classCallCheck(this, DocumentStore);

		this._docs = {};
	}

	_createClass(DocumentStore, [{
		key: 'add',
		value: function add(doc) {
			if (this._docs[doc.id]) throw new Error('Document is already in DocumentStore: ' + doc.id);
			this._docs[doc.id] = doc;
			return doc;
		}
	}, {
		key: 'releaseRefs',
		value: function releaseRefs(docs) {
			var _this = this;

			docs.forEach(function (doc) {
				doc._refCount--;
				if (!doc._refCount) {
					doc.onFinalRelease();
					delete _this._docs[doc.id];
				}
			});
		}
	}, {
		key: 'getAndAddRef',
		value: function getAndAddRef(id) {
			var doc = this._docs[id];
			if (doc) doc._refCount++;
			return doc;
		}
	}]);

	return DocumentStore;
}();

exports.default = DocumentStore;

/***/ })
/******/ ]);