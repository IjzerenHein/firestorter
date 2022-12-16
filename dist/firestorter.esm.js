import { observable, onBecomeUnobserved, onBecomeObserved, toJS, runInAction, reaction, autorun, makeObservable, computed } from 'mobx';
import isEqual from 'lodash.isequal';

function asyncGeneratorStep(gen, resolve, reject, _next, _throw, key, arg) {
  try {
    var info = gen[key](arg);
    var value = info.value;
  } catch (error) {
    reject(error);
    return;
  }

  if (info.done) {
    resolve(value);
  } else {
    Promise.resolve(value).then(_next, _throw);
  }
}

function _asyncToGenerator(fn) {
  return function () {
    var self = this,
        args = arguments;
    return new Promise(function (resolve, reject) {
      var gen = fn.apply(self, args);

      function _next(value) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "next", value);
      }

      function _throw(err) {
        asyncGeneratorStep(gen, resolve, reject, _next, _throw, "throw", err);
      }

      _next(undefined);
    });
  };
}

function _defineProperties(target, props) {
  for (var i = 0; i < props.length; i++) {
    var descriptor = props[i];
    descriptor.enumerable = descriptor.enumerable || false;
    descriptor.configurable = true;
    if ("value" in descriptor) descriptor.writable = true;
    Object.defineProperty(target, descriptor.key, descriptor);
  }
}

function _createClass(Constructor, protoProps, staticProps) {
  if (protoProps) _defineProperties(Constructor.prototype, protoProps);
  if (staticProps) _defineProperties(Constructor, staticProps);
  Object.defineProperty(Constructor, "prototype", {
    writable: false
  });
  return Constructor;
}

function _extends() {
  _extends = Object.assign || function (target) {
    for (var i = 1; i < arguments.length; i++) {
      var source = arguments[i];

      for (var key in source) {
        if (Object.prototype.hasOwnProperty.call(source, key)) {
          target[key] = source[key];
        }
      }
    }

    return target;
  };

  return _extends.apply(this, arguments);
}

function _inheritsLoose(subClass, superClass) {
  subClass.prototype = Object.create(superClass.prototype);
  subClass.prototype.constructor = subClass;

  _setPrototypeOf(subClass, superClass);
}

function _setPrototypeOf(o, p) {
  _setPrototypeOf = Object.setPrototypeOf || function _setPrototypeOf(o, p) {
    o.__proto__ = p;
    return o;
  };

  return _setPrototypeOf(o, p);
}

function _objectWithoutPropertiesLoose(source, excluded) {
  if (source == null) return {};
  var target = {};
  var sourceKeys = Object.keys(source);
  var key, i;

  for (i = 0; i < sourceKeys.length; i++) {
    key = sourceKeys[i];
    if (excluded.indexOf(key) >= 0) continue;
    target[key] = source[key];
  }

  return target;
}

function _assertThisInitialized(self) {
  if (self === void 0) {
    throw new ReferenceError("this hasn't been initialised - super() hasn't been called");
  }

  return self;
}

function _unsupportedIterableToArray(o, minLen) {
  if (!o) return;
  if (typeof o === "string") return _arrayLikeToArray(o, minLen);
  var n = Object.prototype.toString.call(o).slice(8, -1);
  if (n === "Object" && o.constructor) n = o.constructor.name;
  if (n === "Map" || n === "Set") return Array.from(o);
  if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
}

function _arrayLikeToArray(arr, len) {
  if (len == null || len > arr.length) len = arr.length;

  for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];

  return arr2;
}

function _createForOfIteratorHelperLoose(o, allowArrayLike) {
  var it = typeof Symbol !== "undefined" && o[Symbol.iterator] || o["@@iterator"];
  if (it) return (it = it.call(o)).next.bind(it);

  if (Array.isArray(o) || (it = _unsupportedIterableToArray(o)) || allowArrayLike && o && typeof o.length === "number") {
    if (it) o = it;
    var i = 0;
    return function () {
      if (i >= o.length) return {
        done: true
      };
      return {
        done: false,
        value: o[i++]
      };
    };
  }

  throw new TypeError("Invalid attempt to iterate non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
}

function createCommonjsModule(fn, module) {
	return module = { exports: {} }, fn(module, module.exports), module.exports;
}

var runtime_1 = createCommonjsModule(function (module) {
/**
 * Copyright (c) 2014-present, Facebook, Inc.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE file in the root directory of this source tree.
 */

var runtime = (function (exports) {

  var Op = Object.prototype;
  var hasOwn = Op.hasOwnProperty;
  var undefined$1; // More compressible than void 0.
  var $Symbol = typeof Symbol === "function" ? Symbol : {};
  var iteratorSymbol = $Symbol.iterator || "@@iterator";
  var asyncIteratorSymbol = $Symbol.asyncIterator || "@@asyncIterator";
  var toStringTagSymbol = $Symbol.toStringTag || "@@toStringTag";

  function define(obj, key, value) {
    Object.defineProperty(obj, key, {
      value: value,
      enumerable: true,
      configurable: true,
      writable: true
    });
    return obj[key];
  }
  try {
    // IE 8 has a broken Object.defineProperty that only works on DOM objects.
    define({}, "");
  } catch (err) {
    define = function(obj, key, value) {
      return obj[key] = value;
    };
  }

  function wrap(innerFn, outerFn, self, tryLocsList) {
    // If outerFn provided and outerFn.prototype is a Generator, then outerFn.prototype instanceof Generator.
    var protoGenerator = outerFn && outerFn.prototype instanceof Generator ? outerFn : Generator;
    var generator = Object.create(protoGenerator.prototype);
    var context = new Context(tryLocsList || []);

    // The ._invoke method unifies the implementations of the .next,
    // .throw, and .return methods.
    generator._invoke = makeInvokeMethod(innerFn, self, context);

    return generator;
  }
  exports.wrap = wrap;

  // Try/catch helper to minimize deoptimizations. Returns a completion
  // record like context.tryEntries[i].completion. This interface could
  // have been (and was previously) designed to take a closure to be
  // invoked without arguments, but in all the cases we care about we
  // already have an existing method we want to call, so there's no need
  // to create a new function object. We can even get away with assuming
  // the method takes exactly one argument, since that happens to be true
  // in every case, so we don't have to touch the arguments object. The
  // only additional allocation required is the completion record, which
  // has a stable shape and so hopefully should be cheap to allocate.
  function tryCatch(fn, obj, arg) {
    try {
      return { type: "normal", arg: fn.call(obj, arg) };
    } catch (err) {
      return { type: "throw", arg: err };
    }
  }

  var GenStateSuspendedStart = "suspendedStart";
  var GenStateSuspendedYield = "suspendedYield";
  var GenStateExecuting = "executing";
  var GenStateCompleted = "completed";

  // Returning this object from the innerFn has the same effect as
  // breaking out of the dispatch switch statement.
  var ContinueSentinel = {};

  // Dummy constructor functions that we use as the .constructor and
  // .constructor.prototype properties for functions that return Generator
  // objects. For full spec compliance, you may wish to configure your
  // minifier not to mangle the names of these two functions.
  function Generator() {}
  function GeneratorFunction() {}
  function GeneratorFunctionPrototype() {}

  // This is a polyfill for %IteratorPrototype% for environments that
  // don't natively support it.
  var IteratorPrototype = {};
  define(IteratorPrototype, iteratorSymbol, function () {
    return this;
  });

  var getProto = Object.getPrototypeOf;
  var NativeIteratorPrototype = getProto && getProto(getProto(values([])));
  if (NativeIteratorPrototype &&
      NativeIteratorPrototype !== Op &&
      hasOwn.call(NativeIteratorPrototype, iteratorSymbol)) {
    // This environment has a native %IteratorPrototype%; use it instead
    // of the polyfill.
    IteratorPrototype = NativeIteratorPrototype;
  }

  var Gp = GeneratorFunctionPrototype.prototype =
    Generator.prototype = Object.create(IteratorPrototype);
  GeneratorFunction.prototype = GeneratorFunctionPrototype;
  define(Gp, "constructor", GeneratorFunctionPrototype);
  define(GeneratorFunctionPrototype, "constructor", GeneratorFunction);
  GeneratorFunction.displayName = define(
    GeneratorFunctionPrototype,
    toStringTagSymbol,
    "GeneratorFunction"
  );

  // Helper for defining the .next, .throw, and .return methods of the
  // Iterator interface in terms of a single ._invoke method.
  function defineIteratorMethods(prototype) {
    ["next", "throw", "return"].forEach(function(method) {
      define(prototype, method, function(arg) {
        return this._invoke(method, arg);
      });
    });
  }

  exports.isGeneratorFunction = function(genFun) {
    var ctor = typeof genFun === "function" && genFun.constructor;
    return ctor
      ? ctor === GeneratorFunction ||
        // For the native GeneratorFunction constructor, the best we can
        // do is to check its .name property.
        (ctor.displayName || ctor.name) === "GeneratorFunction"
      : false;
  };

  exports.mark = function(genFun) {
    if (Object.setPrototypeOf) {
      Object.setPrototypeOf(genFun, GeneratorFunctionPrototype);
    } else {
      genFun.__proto__ = GeneratorFunctionPrototype;
      define(genFun, toStringTagSymbol, "GeneratorFunction");
    }
    genFun.prototype = Object.create(Gp);
    return genFun;
  };

  // Within the body of any async function, `await x` is transformed to
  // `yield regeneratorRuntime.awrap(x)`, so that the runtime can test
  // `hasOwn.call(value, "__await")` to determine if the yielded value is
  // meant to be awaited.
  exports.awrap = function(arg) {
    return { __await: arg };
  };

  function AsyncIterator(generator, PromiseImpl) {
    function invoke(method, arg, resolve, reject) {
      var record = tryCatch(generator[method], generator, arg);
      if (record.type === "throw") {
        reject(record.arg);
      } else {
        var result = record.arg;
        var value = result.value;
        if (value &&
            typeof value === "object" &&
            hasOwn.call(value, "__await")) {
          return PromiseImpl.resolve(value.__await).then(function(value) {
            invoke("next", value, resolve, reject);
          }, function(err) {
            invoke("throw", err, resolve, reject);
          });
        }

        return PromiseImpl.resolve(value).then(function(unwrapped) {
          // When a yielded Promise is resolved, its final value becomes
          // the .value of the Promise<{value,done}> result for the
          // current iteration.
          result.value = unwrapped;
          resolve(result);
        }, function(error) {
          // If a rejected Promise was yielded, throw the rejection back
          // into the async generator function so it can be handled there.
          return invoke("throw", error, resolve, reject);
        });
      }
    }

    var previousPromise;

    function enqueue(method, arg) {
      function callInvokeWithMethodAndArg() {
        return new PromiseImpl(function(resolve, reject) {
          invoke(method, arg, resolve, reject);
        });
      }

      return previousPromise =
        // If enqueue has been called before, then we want to wait until
        // all previous Promises have been resolved before calling invoke,
        // so that results are always delivered in the correct order. If
        // enqueue has not been called before, then it is important to
        // call invoke immediately, without waiting on a callback to fire,
        // so that the async generator function has the opportunity to do
        // any necessary setup in a predictable way. This predictability
        // is why the Promise constructor synchronously invokes its
        // executor callback, and why async functions synchronously
        // execute code before the first await. Since we implement simple
        // async functions in terms of async generators, it is especially
        // important to get this right, even though it requires care.
        previousPromise ? previousPromise.then(
          callInvokeWithMethodAndArg,
          // Avoid propagating failures to Promises returned by later
          // invocations of the iterator.
          callInvokeWithMethodAndArg
        ) : callInvokeWithMethodAndArg();
    }

    // Define the unified helper method that is used to implement .next,
    // .throw, and .return (see defineIteratorMethods).
    this._invoke = enqueue;
  }

  defineIteratorMethods(AsyncIterator.prototype);
  define(AsyncIterator.prototype, asyncIteratorSymbol, function () {
    return this;
  });
  exports.AsyncIterator = AsyncIterator;

  // Note that simple async functions are implemented on top of
  // AsyncIterator objects; they just return a Promise for the value of
  // the final result produced by the iterator.
  exports.async = function(innerFn, outerFn, self, tryLocsList, PromiseImpl) {
    if (PromiseImpl === void 0) PromiseImpl = Promise;

    var iter = new AsyncIterator(
      wrap(innerFn, outerFn, self, tryLocsList),
      PromiseImpl
    );

    return exports.isGeneratorFunction(outerFn)
      ? iter // If outerFn is a generator, return the full iterator.
      : iter.next().then(function(result) {
          return result.done ? result.value : iter.next();
        });
  };

  function makeInvokeMethod(innerFn, self, context) {
    var state = GenStateSuspendedStart;

    return function invoke(method, arg) {
      if (state === GenStateExecuting) {
        throw new Error("Generator is already running");
      }

      if (state === GenStateCompleted) {
        if (method === "throw") {
          throw arg;
        }

        // Be forgiving, per 25.3.3.3.3 of the spec:
        // https://people.mozilla.org/~jorendorff/es6-draft.html#sec-generatorresume
        return doneResult();
      }

      context.method = method;
      context.arg = arg;

      while (true) {
        var delegate = context.delegate;
        if (delegate) {
          var delegateResult = maybeInvokeDelegate(delegate, context);
          if (delegateResult) {
            if (delegateResult === ContinueSentinel) continue;
            return delegateResult;
          }
        }

        if (context.method === "next") {
          // Setting context._sent for legacy support of Babel's
          // function.sent implementation.
          context.sent = context._sent = context.arg;

        } else if (context.method === "throw") {
          if (state === GenStateSuspendedStart) {
            state = GenStateCompleted;
            throw context.arg;
          }

          context.dispatchException(context.arg);

        } else if (context.method === "return") {
          context.abrupt("return", context.arg);
        }

        state = GenStateExecuting;

        var record = tryCatch(innerFn, self, context);
        if (record.type === "normal") {
          // If an exception is thrown from innerFn, we leave state ===
          // GenStateExecuting and loop back for another invocation.
          state = context.done
            ? GenStateCompleted
            : GenStateSuspendedYield;

          if (record.arg === ContinueSentinel) {
            continue;
          }

          return {
            value: record.arg,
            done: context.done
          };

        } else if (record.type === "throw") {
          state = GenStateCompleted;
          // Dispatch the exception by looping back around to the
          // context.dispatchException(context.arg) call above.
          context.method = "throw";
          context.arg = record.arg;
        }
      }
    };
  }

  // Call delegate.iterator[context.method](context.arg) and handle the
  // result, either by returning a { value, done } result from the
  // delegate iterator, or by modifying context.method and context.arg,
  // setting context.delegate to null, and returning the ContinueSentinel.
  function maybeInvokeDelegate(delegate, context) {
    var method = delegate.iterator[context.method];
    if (method === undefined$1) {
      // A .throw or .return when the delegate iterator has no .throw
      // method always terminates the yield* loop.
      context.delegate = null;

      if (context.method === "throw") {
        // Note: ["return"] must be used for ES3 parsing compatibility.
        if (delegate.iterator["return"]) {
          // If the delegate iterator has a return method, give it a
          // chance to clean up.
          context.method = "return";
          context.arg = undefined$1;
          maybeInvokeDelegate(delegate, context);

          if (context.method === "throw") {
            // If maybeInvokeDelegate(context) changed context.method from
            // "return" to "throw", let that override the TypeError below.
            return ContinueSentinel;
          }
        }

        context.method = "throw";
        context.arg = new TypeError(
          "The iterator does not provide a 'throw' method");
      }

      return ContinueSentinel;
    }

    var record = tryCatch(method, delegate.iterator, context.arg);

    if (record.type === "throw") {
      context.method = "throw";
      context.arg = record.arg;
      context.delegate = null;
      return ContinueSentinel;
    }

    var info = record.arg;

    if (! info) {
      context.method = "throw";
      context.arg = new TypeError("iterator result is not an object");
      context.delegate = null;
      return ContinueSentinel;
    }

    if (info.done) {
      // Assign the result of the finished delegate to the temporary
      // variable specified by delegate.resultName (see delegateYield).
      context[delegate.resultName] = info.value;

      // Resume execution at the desired location (see delegateYield).
      context.next = delegate.nextLoc;

      // If context.method was "throw" but the delegate handled the
      // exception, let the outer generator proceed normally. If
      // context.method was "next", forget context.arg since it has been
      // "consumed" by the delegate iterator. If context.method was
      // "return", allow the original .return call to continue in the
      // outer generator.
      if (context.method !== "return") {
        context.method = "next";
        context.arg = undefined$1;
      }

    } else {
      // Re-yield the result returned by the delegate method.
      return info;
    }

    // The delegate iterator is finished, so forget it and continue with
    // the outer generator.
    context.delegate = null;
    return ContinueSentinel;
  }

  // Define Generator.prototype.{next,throw,return} in terms of the
  // unified ._invoke helper method.
  defineIteratorMethods(Gp);

  define(Gp, toStringTagSymbol, "Generator");

  // A Generator should always return itself as the iterator object when the
  // @@iterator function is called on it. Some browsers' implementations of the
  // iterator prototype chain incorrectly implement this, causing the Generator
  // object to not be returned from this call. This ensures that doesn't happen.
  // See https://github.com/facebook/regenerator/issues/274 for more details.
  define(Gp, iteratorSymbol, function() {
    return this;
  });

  define(Gp, "toString", function() {
    return "[object Generator]";
  });

  function pushTryEntry(locs) {
    var entry = { tryLoc: locs[0] };

    if (1 in locs) {
      entry.catchLoc = locs[1];
    }

    if (2 in locs) {
      entry.finallyLoc = locs[2];
      entry.afterLoc = locs[3];
    }

    this.tryEntries.push(entry);
  }

  function resetTryEntry(entry) {
    var record = entry.completion || {};
    record.type = "normal";
    delete record.arg;
    entry.completion = record;
  }

  function Context(tryLocsList) {
    // The root entry object (effectively a try statement without a catch
    // or a finally block) gives us a place to store values thrown from
    // locations where there is no enclosing try statement.
    this.tryEntries = [{ tryLoc: "root" }];
    tryLocsList.forEach(pushTryEntry, this);
    this.reset(true);
  }

  exports.keys = function(object) {
    var keys = [];
    for (var key in object) {
      keys.push(key);
    }
    keys.reverse();

    // Rather than returning an object with a next method, we keep
    // things simple and return the next function itself.
    return function next() {
      while (keys.length) {
        var key = keys.pop();
        if (key in object) {
          next.value = key;
          next.done = false;
          return next;
        }
      }

      // To avoid creating an additional object, we just hang the .value
      // and .done properties off the next function object itself. This
      // also ensures that the minifier will not anonymize the function.
      next.done = true;
      return next;
    };
  };

  function values(iterable) {
    if (iterable) {
      var iteratorMethod = iterable[iteratorSymbol];
      if (iteratorMethod) {
        return iteratorMethod.call(iterable);
      }

      if (typeof iterable.next === "function") {
        return iterable;
      }

      if (!isNaN(iterable.length)) {
        var i = -1, next = function next() {
          while (++i < iterable.length) {
            if (hasOwn.call(iterable, i)) {
              next.value = iterable[i];
              next.done = false;
              return next;
            }
          }

          next.value = undefined$1;
          next.done = true;

          return next;
        };

        return next.next = next;
      }
    }

    // Return an iterator with no values.
    return { next: doneResult };
  }
  exports.values = values;

  function doneResult() {
    return { value: undefined$1, done: true };
  }

  Context.prototype = {
    constructor: Context,

    reset: function(skipTempReset) {
      this.prev = 0;
      this.next = 0;
      // Resetting context._sent for legacy support of Babel's
      // function.sent implementation.
      this.sent = this._sent = undefined$1;
      this.done = false;
      this.delegate = null;

      this.method = "next";
      this.arg = undefined$1;

      this.tryEntries.forEach(resetTryEntry);

      if (!skipTempReset) {
        for (var name in this) {
          // Not sure about the optimal order of these conditions:
          if (name.charAt(0) === "t" &&
              hasOwn.call(this, name) &&
              !isNaN(+name.slice(1))) {
            this[name] = undefined$1;
          }
        }
      }
    },

    stop: function() {
      this.done = true;

      var rootEntry = this.tryEntries[0];
      var rootRecord = rootEntry.completion;
      if (rootRecord.type === "throw") {
        throw rootRecord.arg;
      }

      return this.rval;
    },

    dispatchException: function(exception) {
      if (this.done) {
        throw exception;
      }

      var context = this;
      function handle(loc, caught) {
        record.type = "throw";
        record.arg = exception;
        context.next = loc;

        if (caught) {
          // If the dispatched exception was caught by a catch block,
          // then let that catch block handle the exception normally.
          context.method = "next";
          context.arg = undefined$1;
        }

        return !! caught;
      }

      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        var record = entry.completion;

        if (entry.tryLoc === "root") {
          // Exception thrown outside of any try block that could handle
          // it, so set the completion value of the entire function to
          // throw the exception.
          return handle("end");
        }

        if (entry.tryLoc <= this.prev) {
          var hasCatch = hasOwn.call(entry, "catchLoc");
          var hasFinally = hasOwn.call(entry, "finallyLoc");

          if (hasCatch && hasFinally) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            } else if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else if (hasCatch) {
            if (this.prev < entry.catchLoc) {
              return handle(entry.catchLoc, true);
            }

          } else if (hasFinally) {
            if (this.prev < entry.finallyLoc) {
              return handle(entry.finallyLoc);
            }

          } else {
            throw new Error("try statement without catch or finally");
          }
        }
      }
    },

    abrupt: function(type, arg) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc <= this.prev &&
            hasOwn.call(entry, "finallyLoc") &&
            this.prev < entry.finallyLoc) {
          var finallyEntry = entry;
          break;
        }
      }

      if (finallyEntry &&
          (type === "break" ||
           type === "continue") &&
          finallyEntry.tryLoc <= arg &&
          arg <= finallyEntry.finallyLoc) {
        // Ignore the finally entry if control is not jumping to a
        // location outside the try/catch block.
        finallyEntry = null;
      }

      var record = finallyEntry ? finallyEntry.completion : {};
      record.type = type;
      record.arg = arg;

      if (finallyEntry) {
        this.method = "next";
        this.next = finallyEntry.finallyLoc;
        return ContinueSentinel;
      }

      return this.complete(record);
    },

    complete: function(record, afterLoc) {
      if (record.type === "throw") {
        throw record.arg;
      }

      if (record.type === "break" ||
          record.type === "continue") {
        this.next = record.arg;
      } else if (record.type === "return") {
        this.rval = this.arg = record.arg;
        this.method = "return";
        this.next = "end";
      } else if (record.type === "normal" && afterLoc) {
        this.next = afterLoc;
      }

      return ContinueSentinel;
    },

    finish: function(finallyLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.finallyLoc === finallyLoc) {
          this.complete(entry.completion, entry.afterLoc);
          resetTryEntry(entry);
          return ContinueSentinel;
        }
      }
    },

    "catch": function(tryLoc) {
      for (var i = this.tryEntries.length - 1; i >= 0; --i) {
        var entry = this.tryEntries[i];
        if (entry.tryLoc === tryLoc) {
          var record = entry.completion;
          if (record.type === "throw") {
            var thrown = record.arg;
            resetTryEntry(entry);
          }
          return thrown;
        }
      }

      // The context.catch method must only be called with a location
      // argument that corresponds to a known catch block.
      throw new Error("illegal catch attempt");
    },

    delegateYield: function(iterable, resultName, nextLoc) {
      this.delegate = {
        iterator: values(iterable),
        resultName: resultName,
        nextLoc: nextLoc
      };

      if (this.method === "next") {
        // Deliberately forget the last sent value so that we don't
        // accidentally pass it on to the delegate.
        this.arg = undefined$1;
      }

      return ContinueSentinel;
    }
  };

  // Regardless of whether this script is executing as a CommonJS module
  // or not, return the runtime object so that we can declare the variable
  // regeneratorRuntime in the outer scope, which allows this module to be
  // injected easily by `bin/regenerator --include-runtime script.js`.
  return exports;

}(
  // If this script is executing as a CommonJS module, use module.exports
  // as the regeneratorRuntime namespace. Otherwise create a new empty
  // object. Either way, the resulting object will be used to initialize
  // the regeneratorRuntime variable at the top of this file.
   module.exports 
));

try {
  regeneratorRuntime = runtime;
} catch (accidentalStrictMode) {
  // This module should not be running in strict mode, so the above
  // assignment should always work unless something is misconfigured. Just
  // in case runtime.js accidentally runs in strict mode, in modern engines
  // we can explicitly access globalThis. In older engines we can escape
  // strict mode using a global Function call. This could conceivably fail
  // if a Content Security Policy forbids using Function, but in that case
  // the proper solution is to fix the accidental strict mode problem. If
  // you've misconfigured your bundler to force strict mode and applied a
  // CSP to forbid Function, and you're not willing to fix either of those
  // problems, please detail your unique predicament in a GitHub issue.
  if (typeof globalThis === "object") {
    globalThis.regeneratorRuntime = runtime;
  } else {
    Function("r", "regeneratorRuntime = r")(runtime);
  }
}
});

/**
 * Real-time updating mode.
 * @type Mode
 */
var Mode;

(function (Mode) {
  Mode["Auto"] = "auto";
  Mode["On"] = "on";
  Mode["Off"] = "off";
})(Mode || (Mode = {}));

/**
 * Creates a firestorter compat context.
 *
 * @param {Object} config - Configuration options
 * @param {Firebase} config.firebase - Firebase instance
 * @param {FirebaseApp | string} [config.app] - Firebase app instance or name
 * @param {Firestore} [config.firestore] - Firestore instance
 *
 * @example
 * import firebase from 'firebase/compat/app';
 * import 'firebase/compat/firestore';
 * import { Collection, Document, makeCompatContext } from 'firestorter'
 *
 * // Initialize firebase app
 * firebase.initializeApp({...});
 *
 * // Initialize global `firestorter` context
 * initFirestorter(makeCompatContext({ firebase: firebase }));
 *
 * // Create collection or document
 * const albums = new Collection('artists/Metallica/albums');
 * ...
 * const album = new Document('artists/Metallica/albums/BlackAlbum');
 * ...
 *
 * // Or create a custom context to connect to another Firebase app
 * const app2 = firebase.initializeApp({...});
 * const app2Context = makeCompatContext({ firebase: firebase, app: app2 });
 *
 * // Create collection or document
 * const albums2 = new Collection('artists/Metallica/albums', {context: app2Context});
 * ...
 * const album2 = new Document('artists/Metallica/albums/BlackAlbum', {context: app2Context});
 * ...
 */
function makeCompatContext(config) {
  var _config$firestore;

  var firebase = config.firebase; // Get app instance

  var app = config.app ? typeof config.app === 'string' ? firebase.app(config.app) : config.app : firebase.app(); // Get firestore instance

  var firestore = (_config$firestore = config.firestore) != null ? _config$firestore : app.firestore();

  if (!firestore) {
    throw new Error("firebase.firestore() returned `undefined`, did you forget `import 'firebase/firestore';` ?");
  }

  return {
    // @ts-ignore
    collection: function collection(path) {
      return firestore.collection(path);
    },
    // @ts-ignore
    doc: function doc(path) {
      return firestore.doc(path);
    },
    // @ts-ignore
    getDocs: function getDocs(ref) {
      return ref.get();
    },
    // @ts-ignore
    where: function where(fieldPath, opStr, value) {
      return [fieldPath, opStr, value];
    },
    // @ts-ignore
    query: function query(ref, where1, where2, where3) {
      // @ts-ignore
      ref = where1 ? ref.where(where1[0], where1[1], where1[2]) : ref; // @ts-ignore

      ref = where2 ? ref.where(where2[0], where2[1], where2[2]) : ref; // @ts-ignore

      ref = where3 ? ref.where(where3[0], where3[1], where3[2]) : ref;
      return ref;
    },
    // @ts-ignore
    addDoc: function addDoc(ref, data) {
      return ref.add(data);
    },
    // @ts-ignore
    getDoc: function getDoc(ref) {
      return ref.get();
    },
    // @ts-ignore
    setDoc: function setDoc(ref, data, options) {
      return ref.set(data, options);
    },
    // @ts-ignore
    updateDoc: function updateDoc(ref, fields) {
      return ref.update(fields);
    },
    // @ts-ignore
    deleteDoc: function deleteDoc(ref) {
      return ref["delete"]();
    },
    // @ts-ignore
    onSnapshot: function onSnapshot(ref, resultFn, errorFn) {
      return ref.onSnapshot(resultFn, errorFn);
    },
    // @ts-ignore
    deleteField: function deleteField() {
      return firebase.firestore.FieldValue["delete"]();
    },
    // @ts-ignore
    serverTimestamp: function serverTimestamp() {
      return firebase.firestore.FieldValue.serverTimestamp();
    }
  };
}

var globalContext;
/**
 * Initializes `firestorter` with the firebase-app.
 *
 * @param {IContext | FirestorterCompatConfig} config - Configuration options
 *
 * @example
 * import { initializeApp } from 'firebase/app';
 * import { getFirestore } from 'firebase/firestore';
 * import { initFirestorter, Collection, Document } from 'firestorter';
 *
 * // Initialize firebase app
 * const app = initializeApp({...});
 * const firestore = getFirestore(app);
 *
 * // Initialize `firestorter`
 * initFirestorter({ app, firestore });
 *
 * // Create collection or document
 * const albums = new Collection('artists/Metallica/albums');
 * ...
 * const album = new Document('artists/Metallica/albums/BlackAlbum');
 * ...
 */

function initFirestorter(context) {
  if (globalContext) {
    throw new Error('Firestorter already initialized, did you accidentally call `initFirestorter()` again?');
  } // @ts-expect-error Property 'collection' does not exist on type 'IContext | FirestorterCompatConfig'.


  if (context.collection) {
    globalContext = context;
  } else {
    globalContext = makeCompatContext(context);
  }

  return globalContext;
}
function getContext(obj) {
  if (obj != null && obj.context) {
    return obj.context;
  }

  if (globalContext) {
    return globalContext;
  }

  if (obj) {
    throw new Error("No context for " + obj + " or globally. Did you forget to call `initFirestorter` or pass {context: ...} option?");
  }

  throw new Error("No global Firestore context. Did you forget to call `initFirestorter` ?");
}

/**
 * Helper function which merges data into the source
 * and returns the new object.
 *
 * @param {Object} data - JSON data
 * @param {Object} fields - JSON data that supports field-paths
 * @return {Object} Result
 */

function mergeUpdateData(data, fields, hasContext) {
  var res = _extends({}, data);

  var canonicalDelete = getContext(hasContext).deleteField();

  for (var key in fields) {
    if (fields.hasOwnProperty(key)) {
      // @ts-ignore
      var val = fields[key];
      var isDelete = canonicalDelete.isEqual ? canonicalDelete.isEqual(val) : isEqual(canonicalDelete, val);
      var paths = key.split('.');
      var dataVal = res;

      for (var i = 0; i < paths.length - 1; i++) {
        if (dataVal[paths[i]] === undefined) {
          if (isDelete) {
            dataVal = undefined;
            break;
          }

          dataVal[paths[i]] = {};
        } else {
          dataVal[paths[i]] = _extends({}, dataVal[paths[i]]);
        }

        dataVal = dataVal[paths[i]];
      }

      if (isDelete) {
        if (dataVal) {
          delete dataVal[paths[paths.length - 1]];
        }
      } else {
        dataVal[paths[paths.length - 1]] = val;
      }
    }
  }

  return res;
}
function verifyMode(mode) {
  switch (mode) {
    case 'auto':
    case 'off':
    case 'on':
      return mode;

    default:
      throw new Error('Invalid mode mode: ' + mode);
  }
}
/**
 * Checks whether the provided value is a valid Firestore Timestamp or Date.
 *
 * Use this function in combination with schemas, in order to validate
 * that the field in the document is indeed a timestamp.
 *
 * @param {Object} val - Value to check
 * @return {Boolean}
 *
 * @example
 * import { isTimestamp } from 'firestorter';
 *
 * const TaskSchema = struct({
 *  name: 'string',
 *  startDate: isTimestamp,
 *  duration: 'number'
 * });
 *
 * const doc = new Document('tasks/mytask', {
 *   schema: TaskSchema
 * });
 * await doc.fetch();
 * console.log('startDate: ', doc.data.startDate.toDate());
 */

function isTimestamp(val) {
  if (val instanceof Date) {
    return true;
  }

  return typeof val === 'object' && typeof val.seconds === 'number' && typeof val.nanoseconds === 'number';
}

/**
 * @ignore
 * Creates an observable which calls addObserverRef &
 * releaseObserverRef methods on the passed-in delegate class.
 * Effectively, this allows Firestorter to track whether
 * a Collection/Document is observed and real-time updating
 * needs to be enabled on it.
 */

function enhancedObservable(data, delegate) {
  var o = Array.isArray(data) ? observable.array(data) : observable.box(data);
  var isObserved = false;
  onBecomeUnobserved(o, undefined, function () {
    if (isObserved) {
      isObserved = false;
      delegate.releaseObserverRef();
    }
  });
  onBecomeObserved(o, undefined, function () {
    if (!isObserved) {
      isObserved = true;
      delegate.addObserverRef();
    }
  });
  return o;
}

/**
 * @private
 */

function resolveRef(value, hasContext) {
  if (typeof value === 'string') {
    return getContext(hasContext).doc(value);
  } else if (typeof value === 'function') {
    return resolveRef(value(), hasContext);
  } else {
    return value;
  }
}

var EMPTY_OPTIONS = {};
/**
 * Document represents a document stored in the firestore database.
 * Document is observable so that it can be efficiently linked to for instance
 * a React Component using `mobx-react`'s `observer` pattern. This ensures that
 * a component is only re-rendered when data that is accessed in the `render`
 * function has changed.
 *
 * @param {DocumentSource} [source] String-path, ref or function that returns a path or ref
 * @param {Object} [options] Configuration options
 * @param {String} [options.mode] See `Document.mode` (default: auto)
 * @param {Function} [options.schema] Superstruct schema for data validation
 * @param {firestore.DocumentSnapshot} [options.snapshot] Initial document snapshot
 * @param {firestore.SnapshotOptions} [options.snapshotOptions] Options that configure how data is retrieved from a snapshot
 * @param {boolean} [options.debug] Enables debug logging
 * @param {String} [options.debugName] Name to use when debug logging is enabled
 */

var Document = /*#__PURE__*/function () {
  function Document(source, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var _options = options,
        schema = _options.schema,
        snapshot = _options.snapshot,
        snapshotOptions = _options.snapshotOptions,
        mode = _options.mode,
        debug = _options.debug,
        debugName = _options.debugName,
        context = _options.context;
    this.debugInstanceName = debugName;
    this.sourceInput = source;
    this.ctx = context;
    this.refObservable = observable.box(resolveRef(source, this));
    this.docSchema = schema;
    this.isVerbose = debug || false;
    this.snapshotObservable = enhancedObservable(snapshot, this);
    this.snapshotOptions = snapshotOptions;
    this.collectionRefCount = 0;
    this.observedRefCount = 0;
    var data = snapshot ? snapshot.data(this.snapshotOptions) : undefined;

    if (data) {
      data = this._validateSchema(data);
    }

    this.dataObservable = enhancedObservable(data || EMPTY_OPTIONS, this);
    this.modeObservable = observable.box(verifyMode(mode || Mode.Auto));
    this.isLoadingObservable = observable.box(false);

    this._updateSourceObserver();

    if (mode === Mode.On) {
      runInAction(function () {
        return _this._updateRealtimeUpdates();
      });
    }
  }
  /**
   * Returns the superstruct schema used to validate the
   * document, or undefined.
   *
   * @type {Function}
   */


  var _proto = Document.prototype;

  /**
   * Updates one or more fields in the document.
   *
   * The update will fail if applied to a document that does
   * not exist.
   *
   * @param {Object} fields - Fields to update
   * @return {Promise}
   *
   * @example
   * await todoDoc.update({
   *   finished: true,
   *   text: 'O yeah, checked this one off',
   *   foo: {
   *     bar: 10
   *   }
   * });
   */
  _proto.update = function update(fields) {
    var ref = this.refObservable.get();

    if (this.docSchema) {
      if (!this.snapshot) {
        console.warn(this.debugName + " - Unable to verify schema in .update() because the document has not been fetched yet");
      } else {
        try {
          this._validateSchema(mergeUpdateData(toJS(this.data), fields));
        } catch (err) {
          return Promise.reject(err);
        }
      }
    }

    return getContext(this).updateDoc(ref, fields);
  }
  /**
   * Writes to the document.
   *
   * If the document does not exist yet, it will be created.
   * If you pass options, the provided data can be merged into
   * the existing document.
   *
   * @param {Object} data - An object of the fields and values for the document
   * @param {Object} [options] - Set behaviour options
   * @param {Boolean} [options.merge] - Set to `true` to only replace the values specified in the data argument. Fields omitted will remain untouched.
   * @return {Promise}
   *
   * @example
   * const todo = new Document('todos/mynewtodo');
   * await todo.set({
   *   finished: false,
   *   text: 'this is awesome'
   * });
   */
  ;

  _proto.set = function set(data, options) {
    if (this.docSchema) {
      try {
        if (options != null && options.merge) {
          this._validateSchema(mergeUpdateData(toJS(this.data), data));
        } else {
          this._validateSchema(data);
        }
      } catch (err) {
        return Promise.reject(err);
      }
    }

    return getContext(this).setDoc(this.refObservable.get(), data, options);
  }
  /**
   * Deletes the document in Firestore.
   *
   * Returns a promise that resolves once the document has been
   * successfully deleted from the backend (Note that it won't
   * resolve while you're offline).
   *
   * @return {Promise}
   */
  ;

  _proto["delete"] = function _delete() {
    return getContext(this).deleteDoc(this.refObservable.get());
  }
  /**
   * Fetches new data from firestore. Use this to manually fetch
   * new data when `mode` is set to 'off'.
   *
   * @return {Promise}
   * @fullfil {Document<T>} This document
   *
   * @example
   * const doc = new Document('albums/splinter');
   * await doc.fetch();
   * console.log('data: ', doc.data);
   */
  ;

  _proto.fetch =
  /*#__PURE__*/
  function () {
    var _fetch = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var _this2 = this;

      var ref, snapshot;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (this.isVerbose) {
                console.debug(this.debugName + " - fetching...");
              }

              if (!this.collectionRefCount) {
                _context.next = 3;
                break;
              }

              throw new Error('Should not call fetch on Document that is controlled by a Collection');

            case 3:
              if (!this.isActive) {
                _context.next = 5;
                break;
              }

              throw new Error('Should not call fetch when real-time updating is active');

            case 5:
              if (!this.isLoadingObservable.get()) {
                _context.next = 7;
                break;
              }

              throw new Error('Fetch already in progress');

            case 7:
              ref = this.refObservable.get();

              if (ref) {
                _context.next = 10;
                break;
              }

              throw new Error('No ref or path set on Document');

            case 10:
              runInAction(function () {
                _this2._ready(false);

                _this2.isLoadingObservable.set(true);
              });
              _context.prev = 11;
              _context.next = 14;
              return getContext(this).getDoc(ref);

            case 14:
              snapshot = _context.sent;
              runInAction(function () {
                _this2.isLoadingObservable.set(false);

                _this2._updateFromSnapshot(snapshot);

                if (_this2.isVerbose) {
                  console.debug(_this2.debugName + " - fetched: " + JSON.stringify(toJS(_this2.data)));
                }
              });

              this._ready(true);

              _context.next = 24;
              break;

            case 19:
              _context.prev = 19;
              _context.t0 = _context["catch"](11);
              console.log(this.debugName + " - fetch failed: " + _context.t0.message);
              runInAction(function () {
                _this2.isLoadingObservable.set(false);

                _this2._updateFromSnapshot(undefined);

                _this2._ready(true);
              });
              throw _context.t0;

            case 24:
              return _context.abrupt("return", this);

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[11, 19]]);
    }));

    function fetch() {
      return _fetch.apply(this, arguments);
    }

    return fetch;
  }()
  /**
   * True when new data is being loaded.
   *
   * Loads are performed in these cases:
   *
   * - When real-time updating is started
   * - When a different `ref` or `path` is set
   * - When a `query` is set or cleared
   * - When `fetch` is explicitly called
   *
   * @type {boolean}
   *
   * @example
   * const doc = new Document('albums/splinter', {mode: 'off'});
   * console.log(doc.isLoading); 	// false
   * doc.fetch(); 								// start fetch
   * console.log(doc.isLoading); 	// true
   * await doc.ready(); 					// wait for fetch to complete
   * console.log(doc.isLoading); 	// false
   *
   * @example
   * const doc = new Document('albums/splinter');
   * console.log(doc.isLoading); 	// false
   * const dispose = autorun(() => {
   *   console.log(doc.data);			// start observing document data
   * });
   * console.log(doc.isLoading); 	// true
   * ...
   * dispose();										// stop observing document data
   * console.log(doc.isLoading); 	// false
   */
  ;

  /**
   * Promise that is resolved when the Document has
   * data ready to be consumed.
   *
   * Use this function to for instance wait for
   * the initial snapshot update to complete, or to wait
   * for fresh data after changing the path/ref.
   *
   * @return {Promise}
   *
   * @example
   * const doc = new Document('albums/splinter', {mode: 'on'});
   * await doc.ready();
   * console.log('data: ', doc.data);
   *
   * @example
   * const doc = new Document('albums/splinter', {mode: 'on'});
   * await doc.ready();
   * ...
   * // Changing the path causes a new snapshot update
   * doc.path = 'albums/americana';
   * await doc.ready();
   * console.log('data: ', doc.data);
   */
  _proto.ready = function ready() {
    this.readyPromise = this.readyPromise || Promise.resolve();
    return this.readyPromise;
  };

  _proto.toString = function toString() {
    return this.debugName;
  }
  /**
   * @private
   */
  ;

  /**
   * Called whenever a property of this class becomes observed.
   * @private
   */
  _proto.addObserverRef = function addObserverRef() {
    var _this3 = this;

    if (this.isVerbose) {
      console.debug(this.debugName + " - addRef (" + (this.observedRefCount + 1) + ")");
    }

    var res = ++this.observedRefCount;

    if (res === 1) {
      runInAction(function () {
        return _this3._updateRealtimeUpdates();
      });
    }

    return res;
  }
  /**
   * Called whenever a property of this class becomes un-observed.
   * @private
   */
  ;

  _proto.releaseObserverRef = function releaseObserverRef() {
    var _this4 = this;

    if (this.isVerbose) {
      console.debug(this.debugName + " - releaseRef (" + (this.observedRefCount - 1) + ")");
    }

    var res = --this.observedRefCount;

    if (!res) {
      runInAction(function () {
        return _this4._updateRealtimeUpdates();
      });
    }

    return res;
  }
  /**
   * ICollectionDocument
   * @private
   */
  ;

  _proto.addCollectionRef = function addCollectionRef() {
    return ++this.collectionRefCount;
  };

  _proto.releaseCollectionRef = function releaseCollectionRef() {
    return --this.collectionRefCount;
  };

  _proto.updateFromCollectionSnapshot = function updateFromCollectionSnapshot(snapshot) {
    return this._updateFromSnapshot(snapshot);
  }
  /**
   * @private
   */
  ;

  _proto._updateFromSnapshot = function _updateFromSnapshot(snapshot) {
    var data = snapshot ? snapshot.data(this.snapshotOptions) : undefined;

    if (data) {
      data = this._validateSchema(data);
    } else {
      data = {};
    }

    this.snapshotObservable.set(snapshot);

    if (!isEqual(data, this.dataObservable.get())) {
      this.dataObservable.set(data);
    }
  }
  /**
   * @private
   */
  ;

  _proto._ready = function _ready(complete) {
    var _this5 = this;

    if (complete) {
      var readyResolve = this.readyResolveFn;

      if (readyResolve) {
        this.readyResolveFn = undefined;
        readyResolve();
      }
    } else if (!this.readyResolveFn) {
      this.readyPromise = new Promise(function (resolve) {
        _this5.readyResolveFn = resolve;
      });
    }
  }
  /**
   * @private
   */
  ;

  _proto._onSnapshot = function _onSnapshot(snapshot) {
    var _this6 = this;

    runInAction(function () {
      if (_this6.isVerbose) {
        console.debug(_this6.debugName + " - onSnapshot");
      }

      _this6.isLoadingObservable.set(false);

      try {
        _this6._updateFromSnapshot(snapshot);
      } catch (err) {
        console.error(err.message);
      }

      _this6._ready(true);
    });
  }
  /**
   * @private
   */
  ;

  _proto._onSnapshotError = function _onSnapshotError(error) {
    console.warn(this.debugName + " - onSnapshotError: " + error.message);
  }
  /**
   * @private
   */
  ;

  _proto._updateRealtimeUpdates = function _updateRealtimeUpdates(force) {
    var _this7 = this;

    var newActive = false;

    switch (this.modeObservable.get()) {
      case Mode.Auto:
        newActive = !!this.observedRefCount;
        break;

      case Mode.Off:
        newActive = false;
        break;

      case Mode.On:
        newActive = true;
        break;
    } // Start/stop listening for snapshot updates


    if (this.collectionRefCount || !this.refObservable.get()) {
      newActive = false;
    }

    var active = !!this.onSnapshotUnsubscribeFn;

    if (newActive && (!active || force)) {
      var _this$onSnapshotUnsub;

      if (this.isVerbose) {
        console.debug(this.debugName + " - " + (active ? 're-' : '') + "start (" + this.modeObservable.get() + ":" + this.observedRefCount + ")");
      }

      this._ready(false);

      this.isLoadingObservable.set(true);
      (_this$onSnapshotUnsub = this.onSnapshotUnsubscribeFn) == null ? void 0 : _this$onSnapshotUnsub.call(this);
      this.onSnapshotUnsubscribeFn = getContext(this).onSnapshot(this.refObservable.get(), function (snapshot) {
        return _this7._onSnapshot(snapshot);
      }, function (err) {
        return _this7._onSnapshotError(err);
      });
    } else if (!newActive && active) {
      var _this$onSnapshotUnsub2;

      if (this.isVerbose) {
        console.debug(this.debugName + " - stop (" + this.modeObservable.get() + ":" + this.observedRefCount + ")");
      }

      (_this$onSnapshotUnsub2 = this.onSnapshotUnsubscribeFn) == null ? void 0 : _this$onSnapshotUnsub2.call(this);
      this.onSnapshotUnsubscribeFn = undefined;

      if (this.isLoadingObservable.get()) {
        this.isLoadingObservable.set(false);
      }

      this._ready(true);
    }
  }
  /**
   * @private
   */
  ;

  _proto._updateSourceObserver = function _updateSourceObserver() {
    var _this8 = this;

    if (this.sourceDisposerFn) {
      this.sourceDisposerFn();
      this.sourceDisposerFn = undefined;
    }

    if (typeof this.sourceInput === 'function') {
      this.sourceDisposerFn = reaction(function () {
        return _this8.sourceInput();
      }, function (value) {
        runInAction(function () {
          // TODO, check whether path has changed
          _this8.refObservable.set(resolveRef(value, _this8));

          _this8._updateRealtimeUpdates(true);
        });
      });
    }
  }
  /**
   * @private
   */
  ;

  _proto._validateSchema = function _validateSchema(data) {
    if (!this.docSchema) {
      return data;
    }

    try {
      data = this.docSchema(data);
    } catch (err) {
      // console.log(JSON.stringify(err));
      throw new Error('Invalid value at "' + err.path + '" for ' + (this.debugInstanceName || this.constructor.name) + ' with id "' + this.id + '": ' + err.message);
    }

    return data;
  };

  _createClass(Document, [{
    key: "schema",
    get: function get() {
      return this.docSchema;
    }
    /**
     * Returns the data inside the firestore document.
     *
     * @type {Object}
     *
     * @example
     * todos.docs.map((doc) => {
     *   console.log(doc.data);
     *   // {
     *   //   finished: false
     *   //   text: 'Must do this'
     *   // }
     * });
     */

  }, {
    key: "data",
    get: function get() {
      return this.dataObservable.get();
    }
    /**
     * True whenever the document has fetched any data.
     *
     * @type {boolean}
     */

  }, {
    key: "hasData",
    get: function get() {
      var snapshot = this.snapshot;
      if (!snapshot) return false;
      return typeof snapshot.exists === 'boolean' ? snapshot.exists : snapshot.exists();
    }
    /**
     * Firestore document reference.
     *
     * Use this property to get or set the
     * underlying document reference.
     *
     * Alternatively, you can also use `path` to change the
     * reference in more a readable way.
     *
     * @type {firestore.DocumentReference | Function}
     *
     * @example
     * const doc = new Document('albums/splinter');
     *
     * // Get the DocumentReference for `albums/splinter`
     * const ref = doc.ref;
     *
     * // Switch to another document
     * doc.ref = firebase.firestore().doc('albums/americana');
     */

  }, {
    key: "ref",
    get: function get() {
      return this.refObservable.get();
    },
    set: function set(ref) {
      this.source = ref;
    }
    /**
     * Id of the firestore document.
     *
     * To get the full-path of the document, use `path`.
     *
     * @type {string}
     */

  }, {
    key: "id",
    get: function get() {
      var ref = this.refObservable.get();
      return ref ? ref.id : undefined;
    }
    /**
     * Path of the document (e.g. 'albums/blackAlbum').
     *
     * Use this property to switch to another document in
     * the back-end. Effectively, it is a more compact
     * and readable way of setting a new ref.
     *
     * @type {string | Function}
     *
     * @example
     * const doc = new Document('artists/Metallica');
     * ...
     * // Switch to another document in the back-end
     * doc.path = 'artists/EaglesOfDeathMetal';
     *
     * // Or, you can use a reactive function to link
     * // to the contents of another document.
     * const doc2 = new Document('settings/activeArtist');
     * doc.path = () => 'artists/' + doc2.data.artistId;
     */

  }, {
    key: "path",
    get: function get() {
      var _this$refObservable;

      // if we call toString() during initialization, eg to throw an error referring to this
      // document, this would throw an undefined error without the guard.
      var ref = (_this$refObservable = this.refObservable) == null ? void 0 : _this$refObservable.get();

      if (!ref) {
        return undefined;
      }

      var path = ref.id;

      while (ref.parent) {
        path = ref.parent.id + '/' + path; // @ts-ignore

        ref = ref.parent;
      }

      return path;
    },
    set: function set(documentPath) {
      this.source = documentPath;
    }
    /**
     * @private
     */

  }, {
    key: "source",
    get: function get() {
      return this.sourceInput;
    },
    set: function set(source) {
      var _this9 = this;

      if (this.collectionRefCount) {
        throw new Error('Cannot change source on Document that is controlled by a Collection');
      }

      if (this.sourceInput === source) {
        return;
      }

      this.sourceInput = source;

      this._updateSourceObserver();

      runInAction(function () {
        _this9.refObservable.set(resolveRef(source, _this9));

        _this9._updateRealtimeUpdates(true);
      });
    }
    /**
     * Real-time updating mode.
     *
     * Can be set to any of the following values:
     * - "auto" (enables real-time updating when the document becomes observed)
     * - "off" (no real-time updating, you need to call fetch explicitly)
     * - "on" (real-time updating is permanently enabled)
     *
     * @type {string}
     */

  }, {
    key: "mode",
    get: function get() {
      return this.modeObservable.get();
    },
    set: function set(mode) {
      var _this10 = this;

      if (this.modeObservable.get() === mode) {
        return;
      }

      verifyMode(mode);
      runInAction(function () {
        _this10.modeObservable.set(mode);

        _this10._updateRealtimeUpdates();
      });
    }
    /**
     * Returns true when the Document is actively listening
     * for changes in the firestore back-end.
     *
     * @type {boolean}
     */

  }, {
    key: "isActive",
    get: function get() {
      return !!this.onSnapshotUnsubscribeFn;
    }
    /**
     * Underlying firestore snapshot.
     *
     * @type {firestore.DocumentSnapshot}
     */

  }, {
    key: "snapshot",
    get: function get() {
      return this.snapshotObservable.get();
    }
  }, {
    key: "isLoading",
    get: function get() {
      this.dataObservable.get(); // access data

      return this.isLoadingObservable.get();
    }
    /**
     * True when a snapshot has been obtained from the Firestore
     * back-end. This property indicates whether an initial fetch/get call
     * to Firestore has completed processing. This doesn't however mean that data
     * is available, as the returned snapshot may contain a value indicating
     * that the document doesn't exist. Use `hasData` to check whether any
     * data was succesfully retrieved.
     *
     * @type {boolean}
     */

  }, {
    key: "isLoaded",
    get: function get() {
      var snapshot = this.snapshot;
      return !!snapshot;
    }
  }, {
    key: "debugName",
    get: function get() {
      return (this.debugInstanceName || this.constructor.name) + " (" + this.path + ")";
    }
    /**
     * @private
     */

  }, {
    key: "context",
    get: function get() {
      return this.ctx;
    }
  }]);

  return Document;
}();

/**
 * The Collection class lays at the heart of `firestorter`.
 * It represents a collection in Firestore and its queried data. It is
 * observable so that it can be efficiently linked to a React Component
 * using `mobx-react`'s `observer` pattern.
 *
 * Collection supports three modes of real-time updating:
 * - "auto" (real-time updating is enabled on demand) (default)
 * - "on" (real-time updating is permanently turned on)
 * - "off" (real-time updating is turned off, use `.fetch` explicitly)
 *
 * The "auto" mode ensures that Collection only communicates with
 * the firestore back-end whever the Collection is actually
 * rendered by a Component. This prevents unneccesary background
 * updates and leads to the best possible performance.
 *
 * When real-time updates are enabled, data is automatically fetched
 * from Firestore whenever it changes in the back-end (using `onSnapshot`).
 * This enables almost magical instant updates. When data is changed,
 * only those documents are updated that have actually changed. Document
 * objects are re-used where possible, and just their data is updated.
 * The same is true for the `docs` property. If no documents where
 * added, removed, re-ordered, then the `docs` property itself will not
 * change.
 *
 * Alternatively, you can keep real-time updates turned off and fetch
 * manually. This will update the Collection as efficiently as possible.
 * If nothing has changed on the back-end, no new Documents would be
 * created or modified.
 *
 * @param {CollectionSource} [source] String-path, ref or function that returns a path or ref
 * @param {Object} [options] Configuration options
 * @param {Function|Query} [options.query] See `Collection.query`
 * @param {String} [options.mode] See `Collection.mode`
 * @param {Function} [options.createDocument] Factory function for creating documents `(source, options) => new Document(source, options)`
 * @param {boolean} [options.minimizeUpdates] Enables additional algorithms to reduces updates to your app (e.g. when snapshots are received in rapid succession)
 * @param {boolean} [options.debug] Enables debug logging
 * @param {String} [options.debugName] Name to use when debug logging is enabled
 *
 * @example
 * import {Collection} from 'firestorter';
 *
 * // Create a collection using path (preferred)
 * const col = new Collection('artists/Metallica/albums');
 *
 * // Create a collection using a reference
 * const col2 = new Collection(firebase.firestore().collection('todos'));
 *
 * // Create a collection and permanently start real-time updating
 * const col2 = new Collection('artists', {
 *   mode: 'on'
 * });
 *
 * // Create a collection with a query on it
 * const col3 = new Collection('artists', {
 *   query: (ref) => ref.orderBy('name', 'asc')
 * });
 *
 * @example
 * // In manual mode, just call `fetch` explicitly
 * const col = new Collection('albums', {mode: 'off'});
 * col.fetch().then((collection) => {
 *   collection.docs.forEach((doc) => console.log(doc));
 * });
 *
 * // Yo can use the `isLoading` property to see whether a fetch
 * // is in progress
 * console.log(col.isLoading);
 */

var Collection = /*#__PURE__*/function () {
  // private _limit: any;
  // private _cursor: any;
  function Collection(source, options) {
    var _this = this;

    if (options === void 0) {
      options = {};
    }

    var _options = options,
        query = _options.query,
        createDocument = _options.createDocument,
        mode = _options.mode,
        debug = _options.debug,
        debugName = _options.debugName,
        _options$minimizeUpda = _options.minimizeUpdates,
        minimizeUpdates = _options$minimizeUpda === void 0 ? false : _options$minimizeUpda,
        _options$initialLocal = _options.initialLocalSnapshotDetectTime,
        initialLocalSnapshotDetectTime = _options$initialLocal === void 0 ? 50 : _options$initialLocal,
        _options$initialLocal2 = _options.initialLocalSnapshotDebounceTime,
        initialLocalSnapshotDebounceTime = _options$initialLocal2 === void 0 ? 1000 : _options$initialLocal2,
        context = _options.context;
    this.isVerbose = debug || false;
    this.debugInstanceName = debugName;
    this.isMinimizingUpdates = minimizeUpdates;
    this.initialLocalSnapshotDetectTime = initialLocalSnapshotDetectTime;
    this.initialLocalSnapshotDebounceTime = initialLocalSnapshotDebounceTime;
    this.docLookup = {};
    this.observedRefCount = 0;
    this.sourceInput = source;
    this.refObservable = observable.box(undefined);
    this.queryInput = query;
    this.queryRefObservable = observable.box(undefined); // this._limit = observable.box(limit || undefined);
    // this._cursor = observable.box(undefined);

    this.modeObservable = observable.box(verifyMode(mode || Mode.Auto));
    this.isLoadingObservable = observable.box(false);
    this.isLoadedObservable = observable.box(false);
    this.hasDocsObservable = enhancedObservable(false, this);
    this.docsObservable = enhancedObservable([], this);
    this.ctx = context;

    if (createDocument) {
      this.createDocument = createDocument;
    } else {
      this.createDocument = function (docSource, docOptions) {
        return new Document(docSource, docOptions);
      };
    }

    runInAction(function () {
      return _this._updateRealtimeUpdates(true, true);
    });
  }
  /**
   * Array of all the documents that have been fetched
   * from firestore.
   *
   * @type {Array}
   *
   * @example
   * collection.docs.forEach((doc) => {
   *   console.log(doc.data);
   * });
   */


  var _proto = Collection.prototype;

  /**
   * Fetches new data from firestore. Use this to manually fetch
   * new data when `mode` is set to 'off'.
   *
   * @return {Promise}
   * @fulfil {Collection} - This collection
   * @reject {Error} - Error describing the cause of the problem
   *
   * @example
   * const col = new Collection('albums', 'off');
   * col.fetch().then(({docs}) => {
   *   docs.forEach(doc => console.log(doc));
   * });
   */
  _proto.fetch =
  /*#__PURE__*/
  function () {
    var _fetch = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee() {
      var _this2 = this;

      var colRef, queryRef, ref, snapshot;
      return runtime_1.wrap(function _callee$(_context) {
        while (1) {
          switch (_context.prev = _context.next) {
            case 0:
              if (this.isVerbose) {
                console.debug(this.debugName + " - fetching...");
              }

              if (!this.isActive) {
                _context.next = 3;
                break;
              }

              throw new Error('Should not call fetch when real-time updating is active');

            case 3:
              if (!this.isLoadingObservable.get()) {
                _context.next = 5;
                break;
              }

              throw new Error('Fetch already in progress');

            case 5:
              colRef = this._resolveRef(this.sourceInput);
              queryRef = this._resolveQuery(colRef, this.queryInput);
              ref = queryRef !== undefined ? queryRef : colRef;

              if (ref) {
                _context.next = 10;
                break;
              }

              throw new Error('No ref, path or query set on Collection');

            case 10:
              runInAction(function () {
                _this2._ready(false);

                _this2.isLoadingObservable.set(true);
              });
              _context.prev = 11;
              _context.next = 14;
              return getContext(this).getDocs(ref);

            case 14:
              snapshot = _context.sent;
              runInAction(function () {
                _this2.isLoadingObservable.set(false);

                _this2._updateFromSnapshot(snapshot);

                if (_this2.isVerbose) {
                  console.debug(_this2.debugName + " - fetched " + snapshot.docs.length + " documents");
                }
              });

              this._ready(true);

              return _context.abrupt("return", this);

            case 20:
              _context.prev = 20;
              _context.t0 = _context["catch"](11);
              console.log(this.debugName + " - fetch failed: " + _context.t0.message);
              runInAction(function () {
                _this2.isLoadingObservable.set(false);

                _this2._updateFromSnapshot(undefined);

                _this2._ready(true);
              });
              throw _context.t0;

            case 25:
            case "end":
              return _context.stop();
          }
        }
      }, _callee, this, [[11, 20]]);
    }));

    function fetch() {
      return _fetch.apply(this, arguments);
    }

    return fetch;
  }()
  /**
   * True when new data is being loaded.
   *
   * Fetches are performed in these cases:
   *
   * - When real-time updating is started
   * - When a different `ref` or `path` is set
   * - When a `query` is set or cleared
   * - When `fetch` is explicitly called
   *
   * @type {boolean}
   *
   * @example
   * const col = new Collection('albums', {mode: 'off'});
   * console.log(col.isLoading);  // false
   * col.fetch();                 // start fetch
   * console.log(col.isLoading);  // true
   * await col.ready();           // wait for fetch to complete
   * console.log(col.isLoading);  // false
   *
   * @example
   * const col = new Collection('albums');
   * console.log(col.isLoading);  // false
   * const dispose = autorun(() => {
   *   console.log(col.docs);     // start observing collection data
   * });
   * console.log(col.isLoading);  // true
   * ...
   * dispose();                   // stop observing collection data
   * console.log(col.isLoading);  // false
   */
  ;

  /**
   * Promise that is resolved when the Collection has
   * finished fetching its (initial) documents.
   *
   * Use this method to for instance wait for
   * the initial snapshot update to complete, or to wait
   * for fresh data after changing the path/ref.
   *
   * @return {Promise}
   *
   * @example
   * const col = new Collection('albums', {mode: 'on'});
   * await col.ready();
   * console.log('albums: ', col.docs);
   *
   * @example
   * const col = new Collection('artists/FooFighters/albums', {mode: 'on'});
   * await col.ready();
   * ...
   * // Changing the path causes a new snapshot update
   * col.path = 'artists/TheOffspring/albums';
   * await col.ready();
   * console.log('albums: ', col.docs);
   */
  _proto.ready = function ready() {
    this.readyPromise = this.readyPromise || Promise.resolve(null);
    return this.readyPromise;
  }
  /**
   * Add a new document to this collection with the specified
   * data, assigning it a document ID automatically.
   *
   * @param {Object} data - JSON data for the new document
   * @return {Promise}
   * @fulfil {Document} - The newly created document
   * @reject {Error} - Error, e.g. a schema validation error or Firestore error
   *
   * @example
   * const doc = await collection.add({
   *   finished: false,
   *   text: 'New todo',
   *   options: {
   *     highPrio: true
   *   }
   * });
   * console.log(doc.id); // print id of new document
   *
   * @example
   * // If you want to create a document with a custom Id, then
   * // use the Document class instead, like this
   * const docWithCustomId = new Document('todos/mytodoid');
   * await docWithCustomId.set({
   *   finished: false,
   *   text: 'New todo',
   * });
   */
  ;

  _proto.add =
  /*#__PURE__*/
  function () {
    var _add = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee2(_data) {
      var ref, _getContext, addDoc, getDoc, ref2, snapshot;

      return runtime_1.wrap(function _callee2$(_context2) {
        while (1) {
          switch (_context2.prev = _context2.next) {
            case 0:
              ref = this.ref;

              if (ref) {
                _context2.next = 3;
                break;
              }

              throw new Error('No valid collection reference');

            case 3:
              // REVISIT: can we know to skip this if schemas not in use?
              // Validate schema using a dummy snapshot
              this.createDocument(undefined, {
                context: this.context,
                snapshot: {
                  data: function data() {
                    return _data;
                  },
                  exists: function exists() {
                    return true;
                  },
                  get: function get(fieldPath) {
                    return _data[fieldPath];
                  },
                  id: '',
                  // @ts-ignore Type 'undefined' is not assignable to type 'SnapshotMetadata'
                  metadata: undefined,
                  // @ts-ignore Type 'undefined' is not assignable to type 'DocumentReference<DocumentData>'
                  ref: undefined
                }
              }); // Add to firestore

              _getContext = getContext(this), addDoc = _getContext.addDoc, getDoc = _getContext.getDoc;
              _context2.next = 7;
              return addDoc(ref, _data);

            case 7:
              ref2 = _context2.sent;
              _context2.next = 10;
              return getDoc(ref2);

            case 10:
              snapshot = _context2.sent;
              return _context2.abrupt("return", this.createDocument(snapshot.ref, {
                context: this.context,
                snapshot: snapshot
              }));

            case 12:
            case "end":
              return _context2.stop();
          }
        }
      }, _callee2, this);
    }));

    function add(_x) {
      return _add.apply(this, arguments);
    }

    return add;
  }()
  /**
   * Deletes all the documents in the collection or query.
   * @ignore
   * TODO - Not implemented yet
   */
  ;

  _proto.deleteAll =
  /*#__PURE__*/
  function () {
    var _deleteAll = /*#__PURE__*/_asyncToGenerator( /*#__PURE__*/runtime_1.mark(function _callee3() {
      var ref;
      return runtime_1.wrap(function _callee3$(_context3) {
        while (1) {
          switch (_context3.prev = _context3.next) {
            case 0:
              ref = this.ref;

              if (ref) {
                _context3.next = 3;
                break;
              }

              throw new Error('No valid collection reference');

            case 3:
            case "end":
              return _context3.stop();
          }
        }
      }, _callee3, this);
    }));

    function deleteAll() {
      return _deleteAll.apply(this, arguments);
    }

    return deleteAll;
  }();

  _proto.toString = function toString() {
    return this.debugName;
  }
  /**
   * @private
   */
  ;

  /**
   * Limit used for query pagination.
   */

  /* get limit(): ?number {
        return this._limit.get();
    }
    set limit(val: ?number) {
        this._limit.set(val || undefined);
    } */

  /**
   * Paginates to the start of the collection,
   * resetting any pagination cursor that exists.
   */

  /* paginateToStart() {
        this._cursor.set(undefined);
    } */

  /**
   * Paginates to the next page. This sets the cursor
   * to `startAfter` the last document.
   *
   * @return {Boolean} False in case pagination was not possible
   */

  /* paginateNext(): boolean {
        if (!this.canPaginateNext) return false;
        this._cursor.set({
            type: 'startAfter',
            value: this.docs[this.docs.length - 1].ref
        });
        return true;
    } */

  /**
   * Paginates to the previous page. This sets the cursor
   * to `endBefore` the first document in `docs`.
   *
   * @return {Boolean} False in case pagination was not possible
   */

  /* paginatePrevious(): boolean {
        if (!this.canPaginatePrevious) return false;
        if (!this.docs.length) {
            this._cursor.set(undefined);
            return true;
        }
        this._cursor.set({
            type: 'endBefore',
            value: this.docs[0].ref
        });
        return true;
    }
       get canPaginateNext(): boolean {
        if (!this.limit) return false;
        return this.docs.length >= this.limit;
    }
       get canPaginatePrevious(): boolean {
        if (!this.limit) return false;
        return this._cursor.get() ? true : false;
    } */

  /**
   * Called whenever a property of this class becomes observed.
   * @private
   */
  _proto.addObserverRef = function addObserverRef() {
    var _this3 = this;

    if (this.isVerbose) {
      console.debug(this.debugName + " - addRef (" + (this.observedRefCount + 1) + ")");
    }

    var res = ++this.observedRefCount;

    if (res === 1) {
      runInAction(function () {
        return _this3._updateRealtimeUpdates();
      });
    }

    return res;
  }
  /**
   * Called whenever a property of this class becomes un-observed.
   * @private
   */
  ;

  _proto.releaseObserverRef = function releaseObserverRef() {
    var _this4 = this;

    if (this.isVerbose) {
      console.debug(this.debugName + " - releaseRef (" + (this.observedRefCount - 1) + ")");
    }

    var res = --this.observedRefCount;

    if (!res) {
      runInAction(function () {
        return _this4._updateRealtimeUpdates();
      });
    }

    return res;
  };

  _proto._ready = function _ready(complete) {
    var _this5 = this;

    if (complete) {
      var readyResolve = this.readyResolveFn;

      if (readyResolve) {
        this.readyResolveFn = undefined;
        readyResolve(null);
      }
    } else if (!this.readyResolveFn) {
      this.readyPromise = new Promise(function (resolve) {
        _this5.readyResolveFn = resolve;
      });
    }
  };

  _proto._resolveRef = function _resolveRef(source) {
    if (this.sourceCache === source) {
      return this.sourceCacheRef;
    }

    var ref;

    if (typeof source === 'string') {
      ref = getContext(this).collection(source);
    } else if (typeof source === 'function') {
      ref = this._resolveRef(source());
      return ref; // don't set cache in this case
    } else {
      ref = source;
    }

    this.sourceCache = source;
    this.sourceCacheRef = ref;
    return ref;
  };

  _proto._resolveQuery = function _resolveQuery(collectionRef, query) {
    var ref = query;

    if (typeof query === 'function') {
      ref = query(collectionRef);
    } // Apply pagination cursor

    /* const cursor = this._cursor.get();
        if (cursor) {
            ref = ref || collectionRef;
            switch (cursor.type) {
                case 'startAfter': ref = ref.startAfter(cursor.value); break;
                case 'startAt': ref = ref.startAt(cursor.value); break;
                case 'endBefore': ref = ref.endBefore(cursor.value); break;
                case 'endAt': ref = ref.endAt(cursor.value); break;
            }
        }
             // Apply fetch limit
        const limit = this.limit;
        if (limit) {
            ref = ref || collectionRef;
            ref = ref.limit(limit);
        } */


    return ref;
  }
  /**
   * @private
   */
  ;

  _proto._onSnapshot = function _onSnapshot(snapshot) {
    var _this6 = this;

    // Firestore sometimes returns multiple snapshots initially.
    // The first one containing cached results, followed by a second
    // snapshot which was fetched from the cloud.
    if (this.initialLocalSnapshotDebounceTimer) {
      clearTimeout(this.initialLocalSnapshotDebounceTimer);
      this.initialLocalSnapshotDebounceTimer = undefined;

      if (this.isVerbose) {
        console.debug(this.debugName + " - cancelling initial debounced snapshot, because a newer snapshot has been received");
      }
    }

    if (this.isMinimizingUpdates) {
      var _this$initialLocalSna, _this$initialLocalSna2;

      var timeElapsed = Date.now() - ((_this$initialLocalSna = this.initialLocalSnapshotStartTime) != null ? _this$initialLocalSna : 0);
      this.initialLocalSnapshotStartTime = 0;

      if (timeElapsed >= 0 && timeElapsed < ((_this$initialLocalSna2 = this.initialLocalSnapshotDetectTime) != null ? _this$initialLocalSna2 : 0)) {
        if (this.isVerbose) {
          console.debug(this.debugName + " - local snapshot detected (" + timeElapsed + "ms < " + this.initialLocalSnapshotDetectTime + "ms threshold), debouncing " + this.initialLocalSnapshotDebounceTime + " msec...");
        }

        this.initialLocalSnapshotDebounceTimer = setTimeout(function () {
          _this6.initialLocalSnapshotDebounceTimer = undefined;

          _this6._onSnapshot(snapshot);
        }, this.initialLocalSnapshotDebounceTime);
        return;
      }
    } // Process snapshot


    runInAction(function () {
      if (_this6.isVerbose) {
        console.debug(_this6.debugName + " - onSnapshot");
      }

      _this6.isLoadingObservable.set(false);

      _this6._updateFromSnapshot(snapshot);

      _this6._ready(true);
    });
  }
  /**
   * @private
   */
  ;

  _proto._onSnapshotError = function _onSnapshotError(error) {
    console.warn(this.debugName + " - onSnapshotError: " + error.message);
  }
  /**
   * @private
   */
  ;

  _proto._updateFromSnapshot = function _updateFromSnapshot(snapshot) {
    var _this7 = this;

    var newDocs = [];

    if (snapshot) {
      snapshot.docs.forEach(function (docSnapshot) {
        var doc = _this7.docLookup[docSnapshot.id];

        try {
          if (doc) {
            doc.updateFromCollectionSnapshot(docSnapshot);
          } else {
            doc = _this7.createDocument(docSnapshot.ref, {
              context: _this7.context,
              snapshot: docSnapshot
            });
            _this7.docLookup[doc.id] = doc;
          }

          doc.addCollectionRef();
          newDocs.push(doc);
        } catch (err) {
          console.error(err.message);
        }
      });
    }

    this.docsObservable.forEach(function (doc) {
      if (!doc.releaseCollectionRef()) {
        delete _this7.docLookup[doc.id || ''];
      }
    });
    this.hasDocsObservable.set(!!newDocs.length);
    this.isLoadedObservable.set(true);

    if (this.docsObservable.length !== newDocs.length) {
      this.docsObservable.replace(newDocs);
    } else {
      for (var i = 0, n = newDocs.length; i < n; i++) {
        if (newDocs[i] !== this.docsObservable[i]) {
          this.docsObservable.replace(newDocs);
          break;
        }
      }
    }
  }
  /**
   * @private
   */
  ;

  _proto._updateRealtimeUpdates = function _updateRealtimeUpdates(updateSourceRef, updateQueryRef) {
    var _this8 = this;

    var newActive = false;
    var active = !!this.onSnapshotUnsubscribe;

    switch (this.modeObservable.get()) {
      case Mode.Auto:
        newActive = !!this.observedRefCount;
        break;

      case Mode.Off:
        newActive = false;
        break;

      case Mode.On:
        newActive = true;
        break;
    } // Update source & query ref if needed


    if (newActive && !active) {
      updateSourceRef = true;
      updateQueryRef = true;
    }

    if (updateSourceRef) {
      this.refObservable.set(this._resolveRef(this.sourceInput));
    }

    if (updateQueryRef) {
      this.queryRefObservable.set(this._resolveQuery(this.refObservable.get(), this.queryInput));
    } // Upon de-activation, stop any observed reactions or
    // snapshot listeners.


    if (!newActive) {
      if (this.refDisposerFn) {
        this.refDisposerFn();
        this.refDisposerFn = undefined;
      }

      this.onSnapshotRefCache = undefined;

      if (this.onSnapshotUnsubscribe) {
        if (this.isVerbose) {
          console.debug(this.debugName + " - stop (" + this.modeObservable.get() + ":" + this.observedRefCount + ")");
        }

        this.onSnapshotUnsubscribe();
        this.onSnapshotUnsubscribe = undefined;

        if (this.isLoadingObservable.get()) {
          this.isLoadingObservable.set(false);
        }

        this._ready(true);
      }

      return;
    } // Start listening for ref-changes


    if (!this.refDisposerFn) {
      var initialSourceRef = this.refObservable.get();
      var initialQueryRef = this.queryRefObservable.get();
      this.refDisposerFn = reaction(function () {
        var sourceRef = _this8._resolveRef(_this8.sourceInput);

        var queryRef2 = _this8._resolveQuery(sourceRef, _this8.queryInput);

        if (initialSourceRef) {
          sourceRef = initialSourceRef;
          queryRef2 = initialQueryRef;
          initialSourceRef = undefined;
          initialQueryRef = undefined;
        }

        return {
          queryRef2: queryRef2,
          sourceRef: sourceRef
        };
      }, function (_ref) {
        var sourceRef = _ref.sourceRef,
            queryRef2 = _ref.queryRef2;
        runInAction(function () {
          if (_this8.refObservable.get() !== sourceRef || _this8.queryRefObservable.get() !== queryRef2) {
            _this8.refObservable.set(sourceRef);

            _this8.queryRefObservable.set(queryRef2);

            _this8._updateRealtimeUpdates();
          }
        });
      });
    } // Resolve ref and check whether it has changed


    var queryRef = this.queryRefObservable.get();
    var ref = queryRef !== undefined ? queryRef : this.refObservable.get();

    if (this.onSnapshotRefCache === ref) {
      return;
    }

    this.onSnapshotRefCache = ref; // Stop any existing listener

    if (this.onSnapshotUnsubscribe) {
      this.onSnapshotUnsubscribe();
      this.onSnapshotUnsubscribe = undefined;
    } // If no valid ref exists, then clear the collection so no "old"
    // documents are visible.


    if (!ref) {
      if (this.docsObservable.length) {
        this._updateFromSnapshot({
          docChanges: function docChanges(options) {
            return [];
          },
          docs: [],
          empty: true,
          forEach: function forEach() {
            return true;
          },
          // @ts-ignore Type 'undefined' is not assignable to type 'SnapshotMetadata'
          metadata: undefined,
          query: queryRef,
          size: 0
        });
      }

      return;
    } // Start listener


    if (this.isVerbose) {
      console.debug(this.debugName + " - " + (active ? 're-' : '') + "start (" + this.modeObservable.get() + ":" + this.observedRefCount + ")");
    }

    this._ready(false);

    this.isLoadingObservable.set(true);
    this.initialLocalSnapshotStartTime = Date.now();
    this.onSnapshotUnsubscribe = getContext(this).onSnapshot(ref, function (snapshot) {
      return _this8._onSnapshot(snapshot);
    }, function (err) {
      return _this8._onSnapshotError(err);
    });
  };

  _createClass(Collection, [{
    key: "docs",
    get: function get() {
      return this.docsObservable;
    }
    /**
     * True whenever the docs array is not empty.
     *
     * @type {boolean}
     */

  }, {
    key: "hasDocs",
    get: function get() {
      return this.hasDocsObservable.get();
    }
    /**
     * Firestore collection reference.
     *
     * Use this property to get or set the collection
     * reference. When set, a fetch to the new collection
     * is performed.
     *
     * Alternatively, you can also use `path` to change the
     * reference in more a readable way.
     *
     * @type {firestore.CollectionReference | Function}
     *
     * @example
     * const col = new Collection(firebase.firestore().collection('albums/splinter/tracks'));
     * ...
     * // Switch to another collection
     * col.ref = firebase.firestore().collection('albums/americana/tracks');
     */

  }, {
    key: "ref",
    get: function get() {
      var ref = this.refObservable.get();

      if (!this.refDisposerFn) {
        ref = this._resolveRef(this.sourceInput);
      }

      return ref;
    },
    set: function set(ref) {
      this.source = ref;
    }
    /**
     * Id of the Firestore collection (e.g. 'tracks').
     *
     * To get the full-path of the collection, use `path`.
     *
     * @type {string}
     */

  }, {
    key: "id",
    get: function get() {
      var ref = this.ref;
      return ref ? ref.id : undefined;
    }
    /**
     * Path of the collection (e.g. 'albums/blackAlbum/tracks').
     *
     * Use this property to switch to another collection in
     * the back-end. Effectively, it is a more compact
     * and readable way of setting a new ref.
     *
     * @type {string | Function}
     *
     * @example
     * const col = new Collection('artists/Metallica/albums');
     * ...
     * // Switch to another collection in the back-end
     * col.path = 'artists/EaglesOfDeathMetal/albums';
     */

  }, {
    key: "path",
    get: function get() {
      var ref = this.ref;

      if (!ref) {
        return undefined;
      }

      var path = ref.id;

      while (ref.parent) {
        path = ref.parent.id + '/' + path;
        ref = ref.parent;
      }

      return path;
    },
    set: function set(collectionPath) {
      this.source = collectionPath;
    }
    /**
     * @private
     */

  }, {
    key: "source",
    get: function get() {
      return this.sourceInput;
    },
    set: function set(source) {
      var _this9 = this;

      if (this.sourceInput === source) {
        return;
      }

      runInAction(function () {
        _this9.sourceInput = source; // Stop any reactions

        if (_this9.refDisposerFn) {
          _this9.refDisposerFn();

          _this9.refDisposerFn = undefined;
        } // Update real-time updating


        _this9._updateRealtimeUpdates(true);
      });
    }
    /**
     * Use this property to set any order-by, where,
     * limit or start/end criteria. When set, that query
     * is used to retrieve any data. When cleared (`undefined`),
     * the collection reference is used.
     *
     * The query can be a Function of the form
     * `(firestore.CollectionReference) => firestore.Query | null | undefined`.
     * Where returning `null` will result in an empty collection,
     * and returning `undefined` will revert to using the collection
     * reference (the entire collection).
     *
     * If the query function makes use of any observable values then
     * it will be re-run when those values change.
     *
     * query can be set to a direct Firestore `Query` object but this
     * is an uncommon usage.
     *
     * @type {firestore.Query | Function}
     *
     * @example
     * const todos = new Collection('todos');
     *
     * // Sort the collection
     * todos.query = (ref) => ref.orderBy('text', 'asc');
     *
     * // Order, filter & limit
     * todos.query = (ref) => ref.where('finished', '==', false).orderBy('finished', 'asc').limit(20);
     *
     * // React to changes in observable and force empty collection when required
     * todos.query = (ref) => authStore.uid ? ref.where('owner', '==', authStore.uid) : null;
     *
     * // Clear the query, will cause whole collection to be fetched
     * todos.query = undefined;
     */

  }, {
    key: "query",
    get: function get() {
      return this.queryInput;
    },
    set: function set(query) {
      var _this10 = this;

      if (this.queryInput === query) {
        return;
      }

      runInAction(function () {
        _this10.queryInput = query; // Stop any reactions

        if (_this10.refDisposerFn) {
          _this10.refDisposerFn();

          _this10.refDisposerFn = undefined;
        } // Update real-time updating


        _this10._updateRealtimeUpdates(undefined, true);
      });
    }
    /**
     * @private
     * firestore.Query -> a valid query exists, use that
     * null -> the query function returned `null` to disable the collection
     * undefined -> no query defined, use collection ref instead
     */

  }, {
    key: "queryRef",
    get: function get() {
      return this.queryRefObservable.get();
    }
    /**
     * Real-time updating mode.
     *
     * Can be set to any of the following values:
     * - "auto" (enables real-time updating when the collection is observed)
     * - "off" (no real-time updating, you need to call fetch explicitly)
     * - "on" (real-time updating is permanently enabled)
     *
     * @type {string}
     */

  }, {
    key: "mode",
    get: function get() {
      return this.modeObservable.get();
    },
    set: function set(mode) {
      var _this11 = this;

      if (this.modeObservable.get() === mode) {
        return;
      }

      verifyMode(mode);
      runInAction(function () {
        _this11.modeObservable.set(mode);

        _this11._updateRealtimeUpdates();
      });
    }
    /**
     * Returns true when the Collection is actively listening
     * for changes in the firestore back-end.
     *
     * @type {boolean}
     */

  }, {
    key: "isActive",
    get: function get() {
      return !!this.onSnapshotUnsubscribe;
    }
  }, {
    key: "isLoading",
    get: function get() {
      return this.isLoadingObservable.get();
    }
    /**
     * True when a query snapshot has been retrieved at least once.
     * This however does not mean that any documents have been retrieved,
     * as the number of returned document may have been 0.
     * Use `hasDocs` to check whether any documents have been retrieved.
     *
     * @type {boolean}
     */

  }, {
    key: "isLoaded",
    get: function get() {
      return this.isLoadedObservable.get();
    }
  }, {
    key: "debugName",
    get: function get() {
      return (this.debugInstanceName || this.constructor.name) + " (" + this.path + ")";
    }
    /**
     * @private
     */

  }, {
    key: "context",
    get: function get() {
      return this.ctx;
    }
  }]);

  return Collection;
}();

/**
 * Collection that aggregates documents from multiple queries into
 * a single, easy accessible collection.
 *
 * AggregateCollection is driven by the `queries` function, which defines what
 * queries should be executed on the Firestore cloud back-end. GeoQuery is
 * for instance a more specific use-case of a aggregated-collection using a range
 * of geo-hash queries.
 *
 * @param {CollectionSource} [source] String-path, ref or function that returns a path or ref
 * @param {Object} [options] Configuration options
 * @param {AggregateCollectionQueriesFn} [options.queries] See `AggregateCollection.queries`
 * @param {Function} [options.createDocument] Factory function for creating documents `(source, options) => new Document(source, options)`
 * @param {Function} [options.orderBy] Client side sort function
 * @param {Function} [options.filterBy] Client side filter function
 * @param {boolean} [options.debug] Enables debug logging
 * @param {String} [options.debugName] Name to use when debug logging is enabled
 *
 * @example
 * import {AggregateCollection} from 'firestorter';
 *
 * // Query all unfinished todos for a set of users
 * const userIds = ['pinky', 'brain'];
 * const col = new AggregateCollection('todos', {
 *   queries: () => userIds.map(userId => ({
 *     key: userId, // unique-key by which the query is re-used/cached
 *     query: (ref) => ref.where('userId', '==', userId).where('finished', '==', false)
 *   }))
 * });
 */

var AggregateCollection = /*#__PURE__*/function () {
  function AggregateCollection(source, options) {
    var _this = this;

    this.observedRefCount = 0;
    /**
     * @private
     */

    this._onCreateDocument = function (source, options) {
      if (!source) {
        return _this.createDocument(source, options);
      } // @ts-ignore


      var doc = source.id ? _this.documentRecycleMap[source.id] : null;
      return doc || _this.createDocument(source, options);
    };

    makeObservable(this, {
      docs: computed
    });
    this.collectionSource = source;

    if (options.createDocument) {
      this.createDocument = options.createDocument;
    } else {
      this.createDocument = function (docSource, docOptions) {
        return new Document(docSource, docOptions);
      };
    }

    this.queriesFn = options.queries;
    this.orderBy = options.orderBy;
    this.filterBy = options.filterBy;
    this.debug = options.debug || false;
    this.debugInstanceName = options.debugName;
    this.collections = enhancedObservable([], this);
    this.prevCollections = [];
    this.collectionRecycleMap = {};
    this.documentRecycleMap = {};
    this.ctx = options.context;
  }
  /**
   * Array of all the documents that have been fetched
   * from firestore.
   *
   * @type {Array}
   *
   * @example
   * aggregateCollection.docs.forEach((doc) => {
   *   console.log(doc.data);
   * });
   */


  var _proto = AggregateCollection.prototype;

  _proto.toString = function toString() {
    return this.debugName;
  }
  /**
   * @private
   */
  ;

  /**
   * Called whenever a property of this class becomes observed.
   * @private
   */
  _proto.addObserverRef = function addObserverRef() {
    var _this2 = this;

    var res = ++this.observedRefCount;

    if (res === 1) {
      this.disposer = autorun(function () {
        var queries = _this2.queriesFn();

        runInAction(function () {
          return _this2._updateQueries(queries);
        });
      });
    }

    return res;
  }
  /**
   * Called whenever a property of this class becomes un-observed.
   * @private
   */
  ;

  _proto.releaseObserverRef = function releaseObserverRef() {
    var res = --this.observedRefCount;

    if (res <= 0) {
      if (this.disposer) {
        this.disposer();
        this.disposer = undefined;
      }
    }

    return res;
  }
  /**
   * @private
   */
  ;

  _proto._updateQueries = function _updateQueries(queries) {
    var _this3 = this;

    if (!queries) {
      return;
    }

    if (this.debug) {
      console.debug(this.debugName, 'updateQueries: ', queries);
    } // Copy all current documents into the document recyle map


    this.documentRecycleMap = {};
    Object.values(this.collectionRecycleMap).forEach(function (query) {
      query.docs.forEach(function (doc) {
        _this3.documentRecycleMap[doc.id] = doc;
      });
    }); // console.log(Object.keys(this._documentRecycleMap));

    var cols = queries.map(function (_query) {
      var col = _this3.collectionRecycleMap[_query.key];

      if (!col) {
        col = new Collection(_this3.collectionSource, {
          createDocument: _this3._onCreateDocument,
          debug: _this3.debug,
          debugName: _this3.debugName + '.col: ' + _query.key,
          query: function query(ref) {
            return ref ? _query.query(ref) : ref;
          }
        });
      }

      return col;
    }); // Update the query recycle map

    this.collectionRecycleMap = {};
    cols.forEach(function (col, index) {
      var query = queries[index];
      _this3.collectionRecycleMap[query.key] = col;
    }); // Update the queries

    if (!isEqual(cols, this.collections.slice(0))) {
      this.collections.replace(cols);
    }
  };

  _createClass(AggregateCollection, [{
    key: "docs",
    get: function get() {
      var docs = []; // Aggregrate all docs from the queries

      var hasAllData = true;
      this.collections.forEach(function (col) {
        if (col.isLoading) {
          hasAllData = false;
        }

        col.docs.forEach(function (doc) {
          return docs.push(doc);
        });
      }); // If new queries have been added but have not yet
      // completed loading, use the previous queries instead
      // (until) all data has loaded

      if (!hasAllData && this.prevCollections.length) {
        // console.log('usingPrevQueries');
        docs = [];
        this.prevCollections.forEach(function (col) {
          col.docs.forEach(function (doc) {
            return docs.push(doc);
          });
        });
      } else if (hasAllData) {
        // console.log('+++ ALL DATA AVAIL');
        this.prevCollections = this.collections.slice(0);
      } // console.log('unfilteredDocs: ', docs.length);


      if (this.filterBy) {
        docs = docs.filter(this.filterBy);
      }

      if (this.orderBy) {
        docs.sort(this.orderBy);
      } // console.log('docs: ', docs.length);


      return docs;
    }
    /**
     * True whenever any documents have been fetched.
     *
     * @type {boolean}
     */

  }, {
    key: "hasDocs",
    get: function get() {
      return this.docs.length > 0;
    }
    /**
     * Array of all the collections inside this aggregate
     * collection.
     *
     * @type {Array}
     *
     * @example
     * aggregateCollection.cols.forEach((col) => {
     *   console.log(col.docs.length);
     * });
     */

  }, {
    key: "cols",
    get: function get() {
      return this.collections;
    }
    /**
     * Queries function.
     *
     * @type {Function}
     */

  }, {
    key: "queries",
    get: function get() {
      return this.queriesFn;
    }
    /**
     * True when new data is being loaded.
     *
     * @type {boolean}
     */

  }, {
    key: "isLoading",
    get: function get() {
      return this.collections.reduce(function (acc, col) {
        return acc || col.isLoading;
      }, false);
    }
    /**
     * True when data for all underlying collections has been loaded.
     *
     * @type {boolean}
     */

  }, {
    key: "isLoaded",
    get: function get() {
      return this.collections.reduce(function (acc, col) {
        return acc ? col.isLoaded : false;
      }, true);
    }
    /**
     * @private
     */

  }, {
    key: "debugName",
    get: function get() {
      return "" + (this.debugInstanceName || this.constructor.name);
    }
  }, {
    key: "context",
    get: function get() {
      return this.ctx;
    }
  }]);

  return AggregateCollection;
}();

// Taken from https://github.com/firebase/geofire-js/blob/master/src/utils.ts
// And slightly modified to remove warnings and add the IGeoPoint type.
// Default geohash length
var GEOHASH_PRECISION = 10; // Characters used in location geohashes

var BASE32 = '0123456789bcdefghjkmnpqrstuvwxyz'; // The meridional circumference of the earth in meters

var EARTH_MERI_CIRCUMFERENCE = 40007860; // Length of a degree latitude at the equator

var METERS_PER_DEGREE_LATITUDE = 110574; // Number of bits per geohash character

var BITS_PER_CHAR = 5; // Maximum length of a geohash in bits

var MAXIMUM_BITS_PRECISION = 22 * BITS_PER_CHAR; // Equatorial radius of the earth in meters

var EARTH_EQ_RADIUS = 6378137.0; // The following value assumes a polar radius of
// const EARTH_POL_RADIUS = 6356752.3;
// The formulate to calculate E2 is
// E2 == (EARTH_EQ_RADIUS^2-EARTH_POL_RADIUS^2)/(EARTH_EQ_RADIUS^2)
// The exact value is used here to avoid rounding errors

var E2 = 0.00669447819799; // Cutoff for rounding errors on double calculations

var EPSILON = 1e-12;
/*
function fromGeoPoint(point: IGeoPoint): number[] {
    return [point.latitude, point.longitude];
} */

function toGeoPoint(location) {
  return {
    latitude: location[0],
    longitude: location[1]
  };
}

function log2(x) {
  return Math.log(x) / Math.log(2);
}
/**
 * Validates the inputted location and throws an error if it is invalid.
 * @private
 * @param {object} location The {latitude, longitude} to be verified.
 */


function validateLatitude(latitude) {
  if (typeof latitude !== 'number' || isNaN(latitude)) {
    throw new Error('latitude must be a number');
  } else if (latitude < -90 || latitude > 90) {
    throw new Error('latitude must be within the range [-90, 90]');
  }
}
/**
 * @private
 */


function validateLongitude(longitude) {
  if (typeof longitude !== 'number' || isNaN(longitude)) {
    throw new Error('longitude must be a number');
  } else if (longitude < -180 || longitude > 180) {
    throw new Error('longitude must be within the range [-180, 180]');
  }
}
/**
 * @private
 */


function validateLocation(location) {
  try {
    if (!location) {
      throw new Error('location is empty');
    }

    validateLatitude(location.latitude);
    validateLongitude(location.longitude);
  } catch (err) {
    throw new Error("Invalid location \"" + location + "\": " + err.message);
  }
}
/**
 * @private
 */


function validateRegion(region) {
  try {
    if (!region) {
      throw new Error('region is empty');
    }

    validateLatitude(region.latitude);
    validateLatitude(region.latitudeDelta);
    validateLongitude(region.longitude);
    validateLongitude(region.longitudeDelta);
  } catch (err) {
    throw new Error("Invalid region \"" + region + "\": " + err.message);
  }
}
/**
 * Validates the inputted geohash and throws an error if it is invalid.
 * @private
 * @param {string} geohash The geohash to be validated.
 */


function validateGeohash(geohash) {
  var error;

  if (typeof geohash !== 'string') {
    error = 'geohash must be a string';
  } else if (geohash.length === 0) {
    error = 'geohash cannot be the empty string';
  } else {
    for (var _iterator = _createForOfIteratorHelperLoose(geohash), _step; !(_step = _iterator()).done;) {
      var letter = _step.value;

      if (BASE32.indexOf(letter) === -1) {
        error = "geohash cannot contain '" + letter + "'";
      }
    }
  }

  if (typeof error !== 'undefined') {
    throw new Error("Invalid geohash '" + geohash + "': " + error);
  }
}
/**
 * Converts a region into its geo points (nortEast, southWest, etc..).
 *
 * @param {IGeoRegion} region The region to convert
 */


function geoRegionToPoints(region) {
  var north = region.latitude - region.latitudeDelta * 0.5;
  var south = region.latitude + region.latitudeDelta * 0.5;
  var east = wrapLongitude(region.longitude + region.longitudeDelta * 0.5);
  var west = wrapLongitude(region.longitude - region.longitudeDelta * 0.5);
  return {
    northEast: {
      latitude: north,
      longitude: east
    },
    northWest: {
      latitude: north,
      longitude: west
    },
    southEast: {
      latitude: south,
      longitude: east
    },
    southWest: {
      latitude: south,
      longitude: west
    }
  };
}
/**
 * Converts degrees to radians.
 * @private
 * @param {number} degrees The number of degrees to be converted to radians.
 * @returns The number of radians equal to the inputted number of degrees.
 */

function degreesToRadians(degrees) {
  if (typeof degrees !== 'number' || isNaN(degrees)) {
    throw new Error('Error: degrees must be a number');
  }

  return degrees * Math.PI / 180;
}
/**
 * Encodes a geographical position (latitude/longitude) into a geohash tile.
 *
 * @param {object} location The {latitude, longitude} to encode into a geohash.
 * @param {number} [precision] The length of the geohash to create. If no precision is specified, the
 * default precision of `10` is used.
 * @returns The geohash of the inputted location.
 */


function encodeGeohash(location, precision) {
  if (precision === void 0) {
    precision = GEOHASH_PRECISION;
  }

  validateLocation(location);

  if (typeof precision !== 'undefined') {
    if (typeof precision !== 'number' || isNaN(precision)) {
      throw new Error('precision must be a number');
    } else if (precision <= 0) {
      throw new Error('precision must be greater than 0');
    } else if (precision > 22) {
      throw new Error('precision cannot be greater than 22');
    } else if (Math.round(precision) !== precision) {
      throw new Error('precision must be an integer');
    }
  }

  var latitudeRange = {
    max: 90,
    min: -90
  };
  var longitudeRange = {
    max: 180,
    min: -180
  };
  var hash = '';
  var hashVal = 0;
  var bits = 0;
  var even = 1;

  while (hash.length < precision) {
    var val = even ? location.longitude : location.latitude;
    var range = even ? longitudeRange : latitudeRange;
    var mid = (range.min + range.max) / 2;

    if (val > mid) {
      hashVal = (hashVal << 1) + 1;
      range.min = mid;
    } else {
      hashVal = (hashVal << 1) + 0;
      range.max = mid;
    }

    even = !even;

    if (bits < 4) {
      bits++;
    } else {
      bits = 0;
      hash += BASE32[hashVal];
      hashVal = 0;
    }
  }

  return hash;
}
/**
 * Decodes a geohash tile into a geographical position (latitude/longitude).
 *
 * @param {string} geohash - Geohash tile
 */

function decodeGeohash(geohash) {
  validateGeohash(geohash);
  var evenBit = true;
  var latMin = -90;
  var latMax = 90;
  var lonMin = -180;
  var lonMax = 180;

  for (var i = 0; i < geohash.length; i++) {
    var chr = geohash.charAt(i);
    var idx = BASE32.indexOf(chr);

    if (idx < 0) {
      throw new Error('Invalid geohash');
    }

    for (var n = 4; n >= 0; n--) {
      var bitN = idx >> n & 1;

      if (evenBit) {
        // longitude
        var lonMid = (lonMin + lonMax) / 2;

        if (bitN === 1) {
          lonMin = lonMid;
        } else {
          lonMax = lonMid;
        }
      } else {
        // latitude
        var latMid = (latMin + latMax) / 2;

        if (bitN === 1) {
          latMin = latMid;
        } else {
          latMax = latMid;
        }
      }

      evenBit = !evenBit;
    }
  }

  return [{
    latitude: latMin,
    longitude: lonMin
  }, {
    latitude: latMax,
    longitude: lonMax
  }];
}
/**
 * Calculates the number of longitude degrees over a given distance and at a given latitude.
 *
 * @param {number} distance The distance to convert.
 * @param {number} latitude The latitude at which to calculate.
 * @returns The number of degrees the distance corresponds to.
 */

function metersToLongitudeDegrees(distance, latitude) {
  var radians = degreesToRadians(latitude);
  var num = Math.cos(radians) * EARTH_EQ_RADIUS * Math.PI / 180;
  var denom = 1 / Math.sqrt(1 - E2 * Math.sin(radians) * Math.sin(radians));
  var deltaDeg = num * denom;

  if (deltaDeg < EPSILON) {
    return distance > 0 ? 360 : 0;
  } else {
    return Math.min(360, distance / deltaDeg);
  }
}
/**
 * Calculates the number of latitude degrees over a given distance.
 *
 * @param {number} distance The distance to convert.
 * @returns The number of degrees the distance corresponds to.
 */

function metersToLatitudeDegrees(distance) {
  return distance / METERS_PER_DEGREE_LATITUDE;
}
/**
 * Calculates the bits necessary to reach a given resolution, in meters, for the longitude at a
 * given latitude.
 * @ignore
 * @param {number} resolution The desired resolution.
 * @param {number} latitude The latitude used in the conversion.
 * @return The bits necessary to reach a given resolution, in meters.
 */

function longitudeBitsForResolution(resolution, latitude) {
  var degs = metersToLongitudeDegrees(resolution, latitude);
  return Math.abs(degs) > 0.000001 ? Math.max(1, log2(360 / degs)) : 1;
}
/**
 * Calculates the bits necessary to reach a given resolution, in meters, for the latitude.
 * @ignore
 * @param {number} resolution The bits necessary to reach a given resolution, in meters.
 * @returns Bits necessary to reach a given resolution, in meters, for the latitude.
 */

function latitudeBitsForResolution(resolution) {
  return Math.min(log2(EARTH_MERI_CIRCUMFERENCE / 2 / resolution), MAXIMUM_BITS_PRECISION);
}
/**
 * Wraps the longitude to [-180,180].
 * @private
 * @param {number} longitude The longitude to wrap.
 * @returns longitude The resulting longitude.
 */

function wrapLongitude(longitude) {
  if (longitude <= 180 && longitude >= -180) {
    return longitude;
  }

  var adjusted = longitude + 180;

  if (adjusted > 0) {
    return adjusted % 360 - 180;
  } else {
    return 180 - -adjusted % 360;
  }
}
/**
 * Calculates the maximum number of bits of a geohash to get a bounding box that is larger than a
 * given size at the given coordinate.
 * @ignore
 * @param {object} coordinate The coordinate as a {latitude, longitude}.
 * @param {number} size The size of the bounding box.
 * @returns The number of bits necessary for the geohash.
 */

function boundingBoxBits(coordinate, size) {
  var latDeltaDegrees = size / METERS_PER_DEGREE_LATITUDE;
  var latitudeNorth = Math.min(90, coordinate.latitude + latDeltaDegrees);
  var latitudeSouth = Math.max(-90, coordinate.latitude - latDeltaDegrees);
  var bitsLat = Math.floor(latitudeBitsForResolution(size)) * 2;
  var bitsLongNorth = Math.floor(longitudeBitsForResolution(size, latitudeNorth)) * 2 - 1;
  var bitsLongSouth = Math.floor(longitudeBitsForResolution(size, latitudeSouth)) * 2 - 1;
  return Math.min(bitsLat, bitsLongNorth, bitsLongSouth, MAXIMUM_BITS_PRECISION);
}

function boundingBoxBitsForRegion(region) {
  var _geoRegionToPoints = geoRegionToPoints(region),
      northEast = _geoRegionToPoints.northEast,
      southEast = _geoRegionToPoints.southEast,
      northWest = _geoRegionToPoints.northWest,
      southWest = _geoRegionToPoints.southWest;

  var bitsLat = Math.floor(latitudeBitsForResolution(calculateGeoDistance(northEast, southEast) * 0.5)) * 2;
  var bitsLongNorth = Math.floor(longitudeBitsForResolution(calculateGeoDistance(northEast, northWest) * 0.5, northWest.latitude)) * 2 - 1;
  var bitsLongSouth = Math.floor(longitudeBitsForResolution(calculateGeoDistance(southEast, southWest) * 0.5, southWest.latitude)) * 2 - 1;
  return Math.min(bitsLat, bitsLongNorth, bitsLongSouth, MAXIMUM_BITS_PRECISION);
}
/**
 * Calculates eight points on the bounding box and the center of a given circle. At least one
 * geohash of these nine coordinates, truncated to a precision of at most radius, are guaranteed
 * to be prefixes of any geohash that lies within the circle.
 * @ignore
 * @param {object} center The center given as {latitude, longitude}.
 * @param {number} radius The radius of the circle in meters.
 * @returns The eight bounding box points.
 */


function boundingBoxCoordinates(center, radius) {
  var latDegrees = radius / METERS_PER_DEGREE_LATITUDE;
  var latitudeNorth = Math.min(90, center.latitude + latDegrees);
  var latitudeSouth = Math.max(-90, center.latitude - latDegrees);
  var longDegsNorth = metersToLongitudeDegrees(radius, latitudeNorth);
  var longDegsSouth = metersToLongitudeDegrees(radius, latitudeSouth);
  var longDegs = Math.max(longDegsNorth, longDegsSouth);
  return [[center.latitude, center.longitude], [center.latitude, wrapLongitude(center.longitude - longDegs)], [center.latitude, wrapLongitude(center.longitude + longDegs)], [latitudeNorth, center.longitude], [latitudeNorth, wrapLongitude(center.longitude - longDegs)], [latitudeNorth, wrapLongitude(center.longitude + longDegs)], [latitudeSouth, center.longitude], [latitudeSouth, wrapLongitude(center.longitude - longDegs)], [latitudeSouth, wrapLongitude(center.longitude + longDegs)]];
}
/**
 * Calculates eight points on the bounding box and the center of a region box. At least one
 * geohash of these nine coordinates, truncated to a precision of at most radius, are guaranteed
 * to be prefixes of any geohash that lies within the circle.
 * @ignore
 * @param {object} region The region given as {latitude, longitude, latitudeDelta, longitudeDelta}.
 * @returns The eight bounding box points.
 */


function boundingBoxCoordinatesForRegion(region) {
  var _geoRegionToPoints2 = geoRegionToPoints(region),
      northEast = _geoRegionToPoints2.northEast,
      northWest = _geoRegionToPoints2.northWest,
      southWest = _geoRegionToPoints2.southWest;

  return [[region.latitude, region.longitude], [region.latitude, northEast.longitude], [region.latitude, northWest.longitude], [northWest.latitude, region.longitude], [northWest.latitude, northEast.longitude], [northWest.latitude, northWest.longitude], [southWest.latitude, region.longitude], [southWest.latitude, northEast.longitude], [southWest.latitude, northWest.longitude]];
}
/**
 * Calculates the bounding box query for a geohash with x bits precision.
 * @ignore
 * @param {string} geohash The geohash whose bounding box query to generate.
 * @param {number} bits The number of bits of precision.
 * @returns A [start, end] pair of geohashes.
 */


function geohashQuery(geohash1, bits) {
  validateGeohash(geohash1);
  var precision = Math.ceil(bits / BITS_PER_CHAR);

  if (geohash1.length < precision) {
    return [geohash1, geohash1 + '~'];
  }

  var geohash = geohash1.substring(0, precision);
  var base = geohash.substring(0, geohash.length - 1);
  var lastValue = BASE32.indexOf(geohash.charAt(geohash.length - 1));
  var significantBits = bits - base.length * BITS_PER_CHAR;
  var unusedBits = BITS_PER_CHAR - significantBits; // delete unused bits

  var startValue = lastValue >> unusedBits << unusedBits;
  var endValue = startValue + (1 << unusedBits);

  if (endValue > 31) {
    return [base + BASE32[startValue], base + '~'];
  } else {
    return [base + BASE32[startValue], base + BASE32[endValue]];
  }
}
/**
 * Calculates a set of geohash queries to fully contain a given circle. A query is a [start, end] pair
 * where any geohash is guaranteed to be lexiographically larger then start and smaller than end.
 *
 * @param {object} center The center given as {latitude, longitude}.
 * @param {number} radius The radius of the circle in meters.
 * @return An array of geohashes containing a [start, end] pair.
 */


function getGeohashesForRadius(center, radius) {
  validateLocation(center);
  var bits = Math.max(1, boundingBoxBits(center, radius));
  var precision = Math.ceil(bits / BITS_PER_CHAR);
  var coordinates = boundingBoxCoordinates(center, radius);
  var queries = coordinates.map(function (coordinate) {
    return geohashQuery(encodeGeohash(toGeoPoint(coordinate), precision), bits);
  }); // remove duplicates

  return queries.filter(function (query, index) {
    return !queries.some(function (other, otherIndex) {
      return index > otherIndex && query[0] === other[0] && query[1] === other[1];
    });
  });
}
/**
 * Calculates a set of geohash queries to fully contain a given region box. A query is a [start, end] pair
 * where any geohash is guaranteed to be lexiographically larger then start and smaller than end.
 *
 * @param {object} region The region given as {latitude, longitude, latitudeDelta, longitudeDelta}.
 * @return An array of geohashes containing a [start, end] pair.
 */

function getGeohashesForRegion(region) {
  validateRegion(region);
  var bits = Math.max(1, boundingBoxBitsForRegion(region));
  var precision = Math.ceil(bits / BITS_PER_CHAR);
  var coordinates = boundingBoxCoordinatesForRegion(region);
  var queries = coordinates.map(function (coordinate) {
    var geohash = encodeGeohash(toGeoPoint(coordinate), precision);
    var query = geohashQuery(geohash, bits);
    /* console.log(
            geohash,
            ", index: ",
            index,
            ", query: ",
            query,
            ", precision: ",
            precision
        ); */

    return query;
  }); // remove duplicates

  return queries.filter(function (query, index) {
    return !queries.some(function (other, otherIndex) {
      return index > otherIndex && query[0] === other[0] && query[1] === other[1];
    });
  });
}
/**
 * Flattens a query start-geohash; and end-geohash into all its individual geohash components.
 *
 * @param {string} geohash1 The geohash from range
 * @param {string} geohash2 The geohash to range
 */

function flattenGeohashRange(geohash1, geohash2) {
  if (geohash1.length !== geohash2.length) {
    throw new Error('Geohash lengths must be the same');
  }

  var res = [geohash1];
  var hash = geohash1;

  while (hash < geohash2) {
    for (var i = geohash1.length - 1; i >= 0; i--) {
      var idx = BASE32.indexOf(hash.charAt(i));

      if (idx < BASE32.length - 1) {
        hash = hash.substring(0, i) + BASE32[idx + 1] + hash.substring(i + 1);

        if (hash < geohash2) {
          res.push(hash);
        }

        break;
      } else {
        hash = hash.substring(0, i) + BASE32[0] + hash.substring(i + 1);
      }

      if (hash >= geohash2) {
        break;
      }
    }
  }

  return res;
}
/**
 * Flattens a set of geo-hash queries into a single array of geohash tiles.
 *
 * @param {string[][]} geohashes The geohashes array
 */

function flattenGeohashes(geohashes) {
  var set = new Set();
  geohashes.forEach(function (a) {
    return flattenGeohashRange(a[0], a[1]).forEach(function (geohash) {
      return set.add(geohash);
    });
  });
  return Array.from(set);
}
/**
 * Method which calculates the distance, in meters, between two locations,
 * via the Haversine formula. Note that this is approximate due to the fact that the
 * Earth's radius varies between 6356.752 km and 6378.137 km.
 *
 * @param {object} location1 The {latitude, longitude} of the first location.
 * @param {object} location2 The {latitude, longitude} of the second location.
 * @returns The distance, in meters, between the inputted locations.
 */

function calculateGeoDistance(location1, location2) {
  validateLocation(location1);
  validateLocation(location2);
  var radius = 6371; // Earth's radius in kilometers

  var latDelta = degreesToRadians(location2.latitude - location1.latitude);
  var lonDelta = degreesToRadians(location2.longitude - location1.longitude);
  var a = Math.sin(latDelta / 2) * Math.sin(latDelta / 2) + Math.cos(degreesToRadians(location1.latitude)) * Math.cos(degreesToRadians(location2.latitude)) * Math.sin(lonDelta / 2) * Math.sin(lonDelta / 2);
  var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return radius * c * 1000;
}
function insideGeoRegion(point, region) {
  if (point.latitude < region.latitude - region.latitudeDelta * 0.5 || point.latitude > region.latitude + region.latitudeDelta * 0.5) {
    return false;
  } // TODO - wrap longitude?


  if (point.longitude < region.longitude - region.longitudeDelta * 0.5 || point.longitude > region.longitude + region.longitudeDelta * 0.5) {
    return false;
  }

  return true;
}

var _excluded = ["region", "fieldPath", "filterBy"];
/**
 * GeoQuery makes it possible to perform efficient geographical based queries
 * with the use of geo-hashes.
 *
 * In order to use GeoQuery, each document needs a `geohash` field stored in the
 * root of the document. The value of the `geohash` field should be a geo-hash
 * encoded using `encodeGeohash`.
 *
 * @extends AggregateCollection
 * @param {CollectionSource} [source] String-path, ref or function that returns a path or ref
 * @param {Object} [options] Configuration options
 * @param {IGeoRegion} [options.region] See `GeoQuery.region`
 * @param {string} [options.fieldPath] Field to query on (default = `geohash`)
 *
 * @example
 *
 * const query = new GeoQuery('bookings', {
 *   region = {
 *     latitude: 51.45663,
 *     longitude: 5.223,
 *     latitudeDelta: 0.1,
 *     longitudeDelta: 0.1,
 *   }
 * });
 *
 * // Bookings needs to contain documents with a `geohash`
 * // field in the root, like this:
 * // {
 * //   ...
 * //   geohash: 'jhdb23'
 * //   ...
 * // }
 *
 * autorun(() => {
 *   query.docs.map(doc => console.log('doc: ', doc.id, doc.data));
 * });
 */

var GeoQuery = /*#__PURE__*/function (_AggregateCollection) {
  _inheritsLoose(GeoQuery, _AggregateCollection);

  function GeoQuery(source, options) {
    var _this;

    var _ref = options || {},
        region = _ref.region,
        _ref$fieldPath = _ref.fieldPath,
        fieldPath = _ref$fieldPath === void 0 ? 'geohash' : _ref$fieldPath,
        filterBy = _ref.filterBy,
        otherOptions = _objectWithoutPropertiesLoose(_ref, _excluded);

    var regionObservable = observable.box(region);
    _this = _AggregateCollection.call(this, source, _extends({
      filterBy: filterBy ? function (doc) {
        var regionVal = regionObservable.get();
        regionVal = typeof regionVal === 'function' ? regionVal() : regionVal;
        return filterBy(doc, regionVal);
      } : undefined,
      queries: function queries() {
        var regionVal = regionObservable.get();
        regionVal = typeof regionVal === 'function' ? regionVal() : regionVal;
        var geohashes = regionVal ? getGeohashesForRegion(regionVal) : undefined;

        if (!geohashes) {
          return null;
        }

        var _getContext = getContext(_assertThisInitialized(_this)),
            _query = _getContext.query,
            where = _getContext.where;

        return geohashes.map(function (geohash) {
          return {
            geohash: geohash,
            key: geohash[0] + "-" + geohash[1],
            query: function query(ref) {
              return _query(ref, where(fieldPath, '>=', geohash[0]), where(fieldPath, '<', geohash[1]));
            }
          };
        });
      }
    }, otherOptions)) || this;
    _this.regionObservable = regionObservable;
    makeObservable(_assertThisInitialized(_this), {
      geohashes: computed
    });
    return _this;
  }
  /**
   * Geographical region to query for.
   *
   * Use this property to get or set the region in which
   * to perform a aggregate geohash query.
   *
   * @type {GeoQueryRegion}
   *
   * @example
   * const query = new GeoQuery('bookings');
   *
   * // Bookings needs to contain documents with a `geohash`
   * // field in the root, like this:
   * // {
   * //   ...
   * //   geohash: 'jhdb23'
   * //   ...
   * // }
   *
   * ...
   * // Set the region to query for
   * query.region = {
   *   latitude: 51.45663,
   *   longitude: 5.223,
   *   latitudeDelta: 0.1,
   *   longitudeDelta: 0.1,
   * }
   */


  _createClass(GeoQuery, [{
    key: "region",
    get: function get() {
      return this.regionObservable.get();
    },
    set: function set(val) {
      var _this2 = this;

      runInAction(function () {
        return _this2.regionObservable.set(val);
      });
    }
    /**
     * Geo-hashes that are queries for the given region.
     *
     * @type {GeoQueryHash[]}
     *
     * @example
     * const query = new GeoQuery('bookings', {
     *   region: {
     *     latitude: 51.45663,
     *     longitude: 5.223,
     *     latitudeDelta: 0.1,
     *     longitudeDelta: 0.1
     *   }
     * });
     * ...
     * // Get the in-use geohashes
     * console.log(query.geohashes);
     * // [['todo', 'todo2], ...]
     */

  }, {
    key: "geohashes",
    get: function get() {
      var queries = this.queries();
      return queries ? queries.map(function (query) {
        return query.geohash;
      }) : [];
    }
  }]);

  return GeoQuery;
}(AggregateCollection);

var ModuleName = 'firestorter';

export { AggregateCollection, Collection, Document, GeoQuery, Mode, ModuleName, calculateGeoDistance, decodeGeohash, encodeGeohash, flattenGeohashRange, flattenGeohashes, geoRegionToPoints, getContext, getGeohashesForRadius, getGeohashesForRegion, initFirestorter, insideGeoRegion, isTimestamp, makeCompatContext, mergeUpdateData, metersToLatitudeDegrees, metersToLongitudeDegrees };
//# sourceMappingURL=firestorter.esm.js.map
