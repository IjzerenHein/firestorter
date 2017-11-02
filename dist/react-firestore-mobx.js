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
/******/ 	return __webpack_require__(__webpack_require__.s = 3);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = __webpack_require__(1);

var _Document = __webpack_require__(2);

var _Document2 = _interopRequireDefault(_Document);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Query = function () {
	function Query(ref, realtime, docFactoryFn) {
		_classCallCheck(this, Query);

		this._ref = ref;
		this._createDocFn = docFactoryFn || _Document2.default.create;
		this._realtime = (0, _mobx.observable)(false);
		this._fetching = (0, _mobx.observable)(false);
		this._docs = (0, _mobx.observable)([]);
		this._onSnapshot = this._onSnapshot.bind(this);
		if (realtime) this.realtime = true;
	}

	_createClass(Query, [{
		key: 'fetch',


		/**
   * Fetches new data from firestore. Use this when `realtime`
   * updates are disabled, to manually fetch new data.
   *
   * @return {Promise} this query
   */
		value: function fetch() {
			var _this = this;

			this._fetching.set(true);
			return new Promise(function (resolve, reject) {
				_this._ref.get().then(function (snapshot) {
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
		key: '_onSnapshot',


		/**
   * @private
   */
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
			var docs = snapshot.docs;
			var oldArray = this._docs.slice(0);
			var newArray = [];

			for (var i = 0, n = docs.length; i < n; i++) {
				var docSnapshot = docs[i];

				// Find existing document and re-use that when possible
				var doc = void 0;
				for (var j = 0; j < oldArray.length; j++) {
					var oldDoc = oldArray[j];
					if (oldDoc.id === docSnapshot.id) {
						doc = oldDoc;
						oldArray.splice(j, 1);
						break;
					}
				}

				// Create/update document
				if (!doc) {
					doc = this._createDocFn(docSnapshot);
				} else {
					doc.snapshot = docSnapshot;
				}
				newArray.push(doc);
			}

			// TODO, stop monitoring old stuff?

			if (this._docs.length !== newArray.length) {
				this._docs.replace(newArray);
			} else {
				for (var _i = 0, _n = newArray.length; _i < _n; _i++) {
					if (newArray[_i] !== this._docs[_i]) {
						this._docs.replace(newArray);
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
   * Firestore query reference.
   * @type {QueryReference|CollectionReference}
   */

	}, {
		key: 'ref',
		get: function get() {
			return this._ref;
		},
		set: function set(ref) {
			if (this._ref === ref) return;
			this._ref = ref;
			if (!this._realtime.get()) return;
			if (this._onSnapshotUnsubscribe) {
				this._onSnapshotUnsubscribe();
			}
			this._onSnapshotUnsubscribe = this._ref.onSnapshot(this._onSnapshot);
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
				this._onSnapshotUnsubscribe = this._ref.onSnapshot(this._onSnapshot);
			}
			this._realtime.set(realtime);
		}
	}, {
		key: 'fetching',
		get: function get() {
			return this._fetching.get();
		}
	}]);

	return Query;
}();

exports.default = Query;

/***/ }),
/* 1 */
/***/ (function(module, exports) {

module.exports = require("mobx");

/***/ }),
/* 2 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _mobx = __webpack_require__(1);

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

var Document = function () {
	function Document(snapshot) {
		_classCallCheck(this, Document);

		this._snapshot = snapshot;
		this._createTime = (0, _mobx.observable)(snapshot.createTime);
		this._updateTime = (0, _mobx.observable)(snapshot.updateTime);
		this._readTime = (0, _mobx.observable)(snapshot.readTime);
		this._data = (0, _mobx.observable)(snapshot.data());
	}

	_createClass(Document, [{
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


		// TODO - realtime?

		/**
   * Firestore document reference.
   * @readonly
   * @type {DocumentReference}
   */
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
/* 3 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.Document = exports.Query = exports.Collection = undefined;

var _Collection = __webpack_require__(4);

var _Collection2 = _interopRequireDefault(_Collection);

var _Query = __webpack_require__(0);

var _Query2 = _interopRequireDefault(_Query);

var _Document = __webpack_require__(2);

var _Document2 = _interopRequireDefault(_Document);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

exports.Collection = _Collection2.default;
exports.Query = _Query2.default;
exports.Document = _Document2.default;

/***/ }),
/* 4 */
/***/ (function(module, exports, __webpack_require__) {

"use strict";


Object.defineProperty(exports, "__esModule", {
	value: true
});

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

var _Query2 = __webpack_require__(0);

var _Query3 = _interopRequireDefault(_Query2);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

var Collection = function (_Query) {
	_inherits(Collection, _Query);

	function Collection() {
		_classCallCheck(this, Collection);

		return _possibleConstructorReturn(this, (Collection.__proto__ || Object.getPrototypeOf(Collection)).apply(this, arguments));
	}

	_createClass(Collection, [{
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
						var doc = _this2._createDocument(snapshot);
						resolve(doc);
					}, reject);
				}, reject);
			});
		}
	}]);

	return Collection;
}(_Query3.default);

exports.default = Collection;

/***/ })
/******/ ]);