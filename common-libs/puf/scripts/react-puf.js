(function(f){if(typeof exports==="object"&&typeof module!=="undefined"){module.exports=f()}else if(typeof define==="function"&&define.amd){define([],f)}else{var g;if(typeof window!=="undefined"){g=window}else if(typeof global!=="undefined"){g=global}else if(typeof self!=="undefined"){g=self}else{g=this}g.Puf = f()}})(function(){var define,module,exports;return (function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
// shim for using process in browser

var process = module.exports = {};

// cached from whatever global is present so that test runners that stub it
// don't break things.  But we need to wrap it in a try catch in case it is
// wrapped in strict mode code which doesn't define any globals.  It's inside a
// function because try/catches deoptimize in certain engines.

var cachedSetTimeout;
var cachedClearTimeout;

(function () {
  try {
    cachedSetTimeout = setTimeout;
  } catch (e) {
    cachedSetTimeout = function () {
      throw new Error('setTimeout is not defined');
    }
  }
  try {
    cachedClearTimeout = clearTimeout;
  } catch (e) {
    cachedClearTimeout = function () {
      throw new Error('clearTimeout is not defined');
    }
  }
} ())
var queue = [];
var draining = false;
var currentQueue;
var queueIndex = -1;

function cleanUpNextTick() {
    if (!draining || !currentQueue) {
        return;
    }
    draining = false;
    if (currentQueue.length) {
        queue = currentQueue.concat(queue);
    } else {
        queueIndex = -1;
    }
    if (queue.length) {
        drainQueue();
    }
}

function drainQueue() {
    if (draining) {
        return;
    }
    var timeout = cachedSetTimeout(cleanUpNextTick);
    draining = true;

    var len = queue.length;
    while(len) {
        currentQueue = queue;
        queue = [];
        while (++queueIndex < len) {
            if (currentQueue) {
                currentQueue[queueIndex].run();
            }
        }
        queueIndex = -1;
        len = queue.length;
    }
    currentQueue = null;
    draining = false;
    cachedClearTimeout(timeout);
}

process.nextTick = function (fun) {
    var args = new Array(arguments.length - 1);
    if (arguments.length > 1) {
        for (var i = 1; i < arguments.length; i++) {
            args[i - 1] = arguments[i];
        }
    }
    queue.push(new Item(fun, args));
    if (queue.length === 1 && !draining) {
        cachedSetTimeout(drainQueue, 0);
    }
};

// v8 likes predictible objects
function Item(fun, array) {
    this.fun = fun;
    this.array = array;
}
Item.prototype.run = function () {
    this.fun.apply(null, this.array);
};
process.title = 'browser';
process.browser = true;
process.env = {};
process.argv = [];
process.version = ''; // empty string to avoid regexp issues
process.versions = {};

function noop() {}

process.on = noop;
process.addListener = noop;
process.once = noop;
process.off = noop;
process.removeListener = noop;
process.removeAllListeners = noop;
process.emit = noop;

process.binding = function (name) {
    throw new Error('process.binding is not supported');
};

process.cwd = function () { return '/' };
process.chdir = function (dir) {
    throw new Error('process.chdir is not supported');
};
process.umask = function() { return 0; };

},{}],2:[function(require,module,exports){
/*!
  Copyright (c) 2016 Jed Watson.
  Licensed under the MIT License (MIT), see
  http://jedwatson.github.io/classnames
*/
/* global define */

(function () {
	'use strict';

	var hasOwn = {}.hasOwnProperty;

	function classNames () {
		var classes = [];

		for (var i = 0; i < arguments.length; i++) {
			var arg = arguments[i];
			if (!arg) continue;

			var argType = typeof arg;

			if (argType === 'string' || argType === 'number') {
				classes.push(arg);
			} else if (Array.isArray(arg)) {
				classes.push(classNames.apply(null, arg));
			} else if (argType === 'object') {
				for (var key in arg) {
					if (hasOwn.call(arg, key) && arg[key]) {
						classes.push(key);
					}
				}
			}
		}

		return classes.join(' ');
	}

	if (typeof module !== 'undefined' && module.exports) {
		module.exports = classNames;
	} else if (typeof define === 'function' && typeof define.amd === 'object' && define.amd) {
		// register as 'classnames', consistent with npm package name
		define('classnames', [], function () {
			return classNames;
		});
	} else {
		window.classNames = classNames;
	}
}());

},{}],3:[function(require,module,exports){
'use strict';
/* eslint-disable no-unused-vars */
var hasOwnProperty = Object.prototype.hasOwnProperty;
var propIsEnumerable = Object.prototype.propertyIsEnumerable;

function toObject(val) {
	if (val === null || val === undefined) {
		throw new TypeError('Object.assign cannot be called with null or undefined');
	}

	return Object(val);
}

function shouldUseNative() {
	try {
		if (!Object.assign) {
			return false;
		}

		// Detect buggy property enumeration order in older V8 versions.

		// https://bugs.chromium.org/p/v8/issues/detail?id=4118
		var test1 = new String('abc');  // eslint-disable-line
		test1[5] = 'de';
		if (Object.getOwnPropertyNames(test1)[0] === '5') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test2 = {};
		for (var i = 0; i < 10; i++) {
			test2['_' + String.fromCharCode(i)] = i;
		}
		var order2 = Object.getOwnPropertyNames(test2).map(function (n) {
			return test2[n];
		});
		if (order2.join('') !== '0123456789') {
			return false;
		}

		// https://bugs.chromium.org/p/v8/issues/detail?id=3056
		var test3 = {};
		'abcdefghijklmnopqrst'.split('').forEach(function (letter) {
			test3[letter] = letter;
		});
		if (Object.keys(Object.assign({}, test3)).join('') !==
				'abcdefghijklmnopqrst') {
			return false;
		}

		return true;
	} catch (e) {
		// We don't expect any of the above to throw, but better to be safe.
		return false;
	}
}

module.exports = shouldUseNative() ? Object.assign : function (target, source) {
	var from;
	var to = toObject(target);
	var symbols;

	for (var s = 1; s < arguments.length; s++) {
		from = Object(arguments[s]);

		for (var key in from) {
			if (hasOwnProperty.call(from, key)) {
				to[key] = from[key];
			}
		}

		if (Object.getOwnPropertySymbols) {
			symbols = Object.getOwnPropertySymbols(from);
			for (var i = 0; i < symbols.length; i++) {
				if (propIsEnumerable.call(from, symbols[i])) {
					to[symbols[i]] = from[symbols[i]];
				}
			}
		}
	}

	return to;
};

},{}],4:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule KeyEscapeUtils
 * 
 */

'use strict';

/**
 * Escape and wrap key so it is safe to use as a reactid
 *
 * @param {string} key to be escaped.
 * @return {string} the escaped key.
 */

function escape(key) {
  var escapeRegex = /[=:]/g;
  var escaperLookup = {
    '=': '=0',
    ':': '=2'
  };
  var escapedString = ('' + key).replace(escapeRegex, function (match) {
    return escaperLookup[match];
  });

  return '$' + escapedString;
}

/**
 * Unescape and unwrap key for human-readable display
 *
 * @param {string} key to unescape.
 * @return {string} the unescaped key.
 */
function unescape(key) {
  var unescapeRegex = /(=0|=2)/g;
  var unescaperLookup = {
    '=0': '=',
    '=2': ':'
  };
  var keySubstring = key[0] === '.' && key[1] === '$' ? key.substring(2) : key.substring(1);

  return ('' + keySubstring).replace(unescapeRegex, function (match) {
    return unescaperLookup[match];
  });
}

var KeyEscapeUtils = {
  escape: escape,
  unescape: unescape
};

module.exports = KeyEscapeUtils;
},{}],5:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule PooledClass
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var invariant = require('fbjs/lib/invariant');

/**
 * Static poolers. Several custom versions for each potential number of
 * arguments. A completely generic pooler is easy to implement, but would
 * require accessing the `arguments` object. In each of these, `this` refers to
 * the Class itself, not an instance. If any others are needed, simply add them
 * here, or in their own files.
 */
var oneArgumentPooler = function (copyFieldsFrom) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, copyFieldsFrom);
    return instance;
  } else {
    return new Klass(copyFieldsFrom);
  }
};

var twoArgumentPooler = function (a1, a2) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2);
    return instance;
  } else {
    return new Klass(a1, a2);
  }
};

var threeArgumentPooler = function (a1, a2, a3) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3);
    return instance;
  } else {
    return new Klass(a1, a2, a3);
  }
};

var fourArgumentPooler = function (a1, a2, a3, a4) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4);
  }
};

var fiveArgumentPooler = function (a1, a2, a3, a4, a5) {
  var Klass = this;
  if (Klass.instancePool.length) {
    var instance = Klass.instancePool.pop();
    Klass.call(instance, a1, a2, a3, a4, a5);
    return instance;
  } else {
    return new Klass(a1, a2, a3, a4, a5);
  }
};

var standardReleaser = function (instance) {
  var Klass = this;
  !(instance instanceof Klass) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Trying to release an instance into a pool of a different type.') : _prodInvariant('25') : void 0;
  instance.destructor();
  if (Klass.instancePool.length < Klass.poolSize) {
    Klass.instancePool.push(instance);
  }
};

var DEFAULT_POOL_SIZE = 10;
var DEFAULT_POOLER = oneArgumentPooler;

/**
 * Augments `CopyConstructor` to be a poolable class, augmenting only the class
 * itself (statically) not adding any prototypical fields. Any CopyConstructor
 * you give this may have a `poolSize` property, and will look for a
 * prototypical `destructor` on instances.
 *
 * @param {Function} CopyConstructor Constructor that can be used to reset.
 * @param {Function} pooler Customizable pooler.
 */
var addPoolingTo = function (CopyConstructor, pooler) {
  var NewKlass = CopyConstructor;
  NewKlass.instancePool = [];
  NewKlass.getPooled = pooler || DEFAULT_POOLER;
  if (!NewKlass.poolSize) {
    NewKlass.poolSize = DEFAULT_POOL_SIZE;
  }
  NewKlass.release = standardReleaser;
  return NewKlass;
};

var PooledClass = {
  addPoolingTo: addPoolingTo,
  oneArgumentPooler: oneArgumentPooler,
  twoArgumentPooler: twoArgumentPooler,
  threeArgumentPooler: threeArgumentPooler,
  fourArgumentPooler: fourArgumentPooler,
  fiveArgumentPooler: fiveArgumentPooler
};

module.exports = PooledClass;
}).call(this,require('_process'))

},{"./reactProdInvariant":26,"_process":1,"fbjs/lib/invariant":30}],6:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule React
 */

'use strict';

var _assign = require('object-assign');

var ReactChildren = require('./ReactChildren');
var ReactComponent = require('./ReactComponent');
var ReactPureComponent = require('./ReactPureComponent');
var ReactClass = require('./ReactClass');
var ReactDOMFactories = require('./ReactDOMFactories');
var ReactElement = require('./ReactElement');
var ReactPropTypes = require('./ReactPropTypes');
var ReactVersion = require('./ReactVersion');

var onlyChild = require('./onlyChild');
var warning = require('fbjs/lib/warning');

var createElement = ReactElement.createElement;
var createFactory = ReactElement.createFactory;
var cloneElement = ReactElement.cloneElement;

if (process.env.NODE_ENV !== 'production') {
  var ReactElementValidator = require('./ReactElementValidator');
  createElement = ReactElementValidator.createElement;
  createFactory = ReactElementValidator.createFactory;
  cloneElement = ReactElementValidator.cloneElement;
}

var __spread = _assign;

if (process.env.NODE_ENV !== 'production') {
  var warned = false;
  __spread = function () {
    process.env.NODE_ENV !== 'production' ? warning(warned, 'React.__spread is deprecated and should not be used. Use ' + 'Object.assign directly or another helper function with similar ' + 'semantics. You may be seeing this warning due to your compiler. ' + 'See https://fb.me/react-spread-deprecation for more details.') : void 0;
    warned = true;
    return _assign.apply(null, arguments);
  };
}

var React = {

  // Modern

  Children: {
    map: ReactChildren.map,
    forEach: ReactChildren.forEach,
    count: ReactChildren.count,
    toArray: ReactChildren.toArray,
    only: onlyChild
  },

  Component: ReactComponent,
  PureComponent: ReactPureComponent,

  createElement: createElement,
  cloneElement: cloneElement,
  isValidElement: ReactElement.isValidElement,

  // Classic

  PropTypes: ReactPropTypes,
  createClass: ReactClass.createClass,
  createFactory: createFactory,
  createMixin: function (mixin) {
    // Currently a noop. Will be used to validate and trace mixins.
    return mixin;
  },

  // This looks DOM specific but these are actually isomorphic helpers
  // since they are just generating DOM strings.
  DOM: ReactDOMFactories,

  version: ReactVersion,

  // Deprecated hook for JSX spread, don't use this for anything.
  __spread: __spread
};

module.exports = React;
}).call(this,require('_process'))

},{"./ReactChildren":7,"./ReactClass":8,"./ReactComponent":9,"./ReactDOMFactories":12,"./ReactElement":13,"./ReactElementValidator":14,"./ReactPropTypes":18,"./ReactPureComponent":20,"./ReactVersion":21,"./onlyChild":25,"_process":1,"fbjs/lib/warning":33,"object-assign":3}],7:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactChildren
 */

'use strict';

var PooledClass = require('./PooledClass');
var ReactElement = require('./ReactElement');

var emptyFunction = require('fbjs/lib/emptyFunction');
var traverseAllChildren = require('./traverseAllChildren');

var twoArgumentPooler = PooledClass.twoArgumentPooler;
var fourArgumentPooler = PooledClass.fourArgumentPooler;

var userProvidedKeyEscapeRegex = /\/+/g;
function escapeUserProvidedKey(text) {
  return ('' + text).replace(userProvidedKeyEscapeRegex, '$&/');
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * traversal. Allows avoiding binding callbacks.
 *
 * @constructor ForEachBookKeeping
 * @param {!function} forEachFunction Function to perform traversal with.
 * @param {?*} forEachContext Context to perform context with.
 */
function ForEachBookKeeping(forEachFunction, forEachContext) {
  this.func = forEachFunction;
  this.context = forEachContext;
  this.count = 0;
}
ForEachBookKeeping.prototype.destructor = function () {
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass.addPoolingTo(ForEachBookKeeping, twoArgumentPooler);

function forEachSingleChild(bookKeeping, child, name) {
  var func = bookKeeping.func;
  var context = bookKeeping.context;

  func.call(context, child, bookKeeping.count++);
}

/**
 * Iterates through children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.foreach
 *
 * The provided forEachFunc(child, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} forEachFunc
 * @param {*} forEachContext Context for forEachContext.
 */
function forEachChildren(children, forEachFunc, forEachContext) {
  if (children == null) {
    return children;
  }
  var traverseContext = ForEachBookKeeping.getPooled(forEachFunc, forEachContext);
  traverseAllChildren(children, forEachSingleChild, traverseContext);
  ForEachBookKeeping.release(traverseContext);
}

/**
 * PooledClass representing the bookkeeping associated with performing a child
 * mapping. Allows avoiding binding callbacks.
 *
 * @constructor MapBookKeeping
 * @param {!*} mapResult Object containing the ordered map of results.
 * @param {!function} mapFunction Function to perform mapping with.
 * @param {?*} mapContext Context to perform mapping with.
 */
function MapBookKeeping(mapResult, keyPrefix, mapFunction, mapContext) {
  this.result = mapResult;
  this.keyPrefix = keyPrefix;
  this.func = mapFunction;
  this.context = mapContext;
  this.count = 0;
}
MapBookKeeping.prototype.destructor = function () {
  this.result = null;
  this.keyPrefix = null;
  this.func = null;
  this.context = null;
  this.count = 0;
};
PooledClass.addPoolingTo(MapBookKeeping, fourArgumentPooler);

function mapSingleChildIntoContext(bookKeeping, child, childKey) {
  var result = bookKeeping.result;
  var keyPrefix = bookKeeping.keyPrefix;
  var func = bookKeeping.func;
  var context = bookKeeping.context;


  var mappedChild = func.call(context, child, bookKeeping.count++);
  if (Array.isArray(mappedChild)) {
    mapIntoWithKeyPrefixInternal(mappedChild, result, childKey, emptyFunction.thatReturnsArgument);
  } else if (mappedChild != null) {
    if (ReactElement.isValidElement(mappedChild)) {
      mappedChild = ReactElement.cloneAndReplaceKey(mappedChild,
      // Keep both the (mapped) and old keys if they differ, just as
      // traverseAllChildren used to do for objects as children
      keyPrefix + (mappedChild.key && (!child || child.key !== mappedChild.key) ? escapeUserProvidedKey(mappedChild.key) + '/' : '') + childKey);
    }
    result.push(mappedChild);
  }
}

function mapIntoWithKeyPrefixInternal(children, array, prefix, func, context) {
  var escapedPrefix = '';
  if (prefix != null) {
    escapedPrefix = escapeUserProvidedKey(prefix) + '/';
  }
  var traverseContext = MapBookKeeping.getPooled(array, escapedPrefix, func, context);
  traverseAllChildren(children, mapSingleChildIntoContext, traverseContext);
  MapBookKeeping.release(traverseContext);
}

/**
 * Maps children that are typically specified as `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.map
 *
 * The provided mapFunction(child, key, index) will be called for each
 * leaf child.
 *
 * @param {?*} children Children tree container.
 * @param {function(*, int)} func The map function.
 * @param {*} context Context for mapFunction.
 * @return {object} Object containing the ordered map of results.
 */
function mapChildren(children, func, context) {
  if (children == null) {
    return children;
  }
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, func, context);
  return result;
}

function forEachSingleChildDummy(traverseContext, child, name) {
  return null;
}

/**
 * Count the number of children that are typically specified as
 * `props.children`.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.count
 *
 * @param {?*} children Children tree container.
 * @return {number} The number of children.
 */
function countChildren(children, context) {
  return traverseAllChildren(children, forEachSingleChildDummy, null);
}

/**
 * Flatten a children object (typically specified as `props.children`) and
 * return an array with appropriately re-keyed children.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.toarray
 */
function toArray(children) {
  var result = [];
  mapIntoWithKeyPrefixInternal(children, result, null, emptyFunction.thatReturnsArgument);
  return result;
}

var ReactChildren = {
  forEach: forEachChildren,
  map: mapChildren,
  mapIntoWithKeyPrefixInternal: mapIntoWithKeyPrefixInternal,
  count: countChildren,
  toArray: toArray
};

module.exports = ReactChildren;
},{"./PooledClass":5,"./ReactElement":13,"./traverseAllChildren":27,"fbjs/lib/emptyFunction":28}],8:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactClass
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant'),
    _assign = require('object-assign');

var ReactComponent = require('./ReactComponent');
var ReactElement = require('./ReactElement');
var ReactPropTypeLocations = require('./ReactPropTypeLocations');
var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var keyMirror = require('fbjs/lib/keyMirror');
var keyOf = require('fbjs/lib/keyOf');
var warning = require('fbjs/lib/warning');

var MIXINS_KEY = keyOf({ mixins: null });

/**
 * Policies that describe methods in `ReactClassInterface`.
 */
var SpecPolicy = keyMirror({
  /**
   * These methods may be defined only once by the class specification or mixin.
   */
  DEFINE_ONCE: null,
  /**
   * These methods may be defined by both the class specification and mixins.
   * Subsequent definitions will be chained. These methods must return void.
   */
  DEFINE_MANY: null,
  /**
   * These methods are overriding the base class.
   */
  OVERRIDE_BASE: null,
  /**
   * These methods are similar to DEFINE_MANY, except we assume they return
   * objects. We try to merge the keys of the return values of all the mixed in
   * functions. If there is a key conflict we throw.
   */
  DEFINE_MANY_MERGED: null
});

var injectedMixins = [];

/**
 * Composite components are higher-level components that compose other composite
 * or host components.
 *
 * To create a new type of `ReactClass`, pass a specification of
 * your new class to `React.createClass`. The only requirement of your class
 * specification is that you implement a `render` method.
 *
 *   var MyComponent = React.createClass({
 *     render: function() {
 *       return <div>Hello World</div>;
 *     }
 *   });
 *
 * The class specification supports a specific protocol of methods that have
 * special meaning (e.g. `render`). See `ReactClassInterface` for
 * more the comprehensive protocol. Any other properties and methods in the
 * class specification will be available on the prototype.
 *
 * @interface ReactClassInterface
 * @internal
 */
var ReactClassInterface = {

  /**
   * An array of Mixin objects to include when defining your component.
   *
   * @type {array}
   * @optional
   */
  mixins: SpecPolicy.DEFINE_MANY,

  /**
   * An object containing properties and methods that should be defined on
   * the component's constructor instead of its prototype (static methods).
   *
   * @type {object}
   * @optional
   */
  statics: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of prop types for this component.
   *
   * @type {object}
   * @optional
   */
  propTypes: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of context types for this component.
   *
   * @type {object}
   * @optional
   */
  contextTypes: SpecPolicy.DEFINE_MANY,

  /**
   * Definition of context types this component sets for its children.
   *
   * @type {object}
   * @optional
   */
  childContextTypes: SpecPolicy.DEFINE_MANY,

  // ==== Definition methods ====

  /**
   * Invoked when the component is mounted. Values in the mapping will be set on
   * `this.props` if that prop is not specified (i.e. using an `in` check).
   *
   * This method is invoked before `getInitialState` and therefore cannot rely
   * on `this.state` or use `this.setState`.
   *
   * @return {object}
   * @optional
   */
  getDefaultProps: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * Invoked once before the component is mounted. The return value will be used
   * as the initial value of `this.state`.
   *
   *   getInitialState: function() {
   *     return {
   *       isOn: false,
   *       fooBaz: new BazFoo()
   *     }
   *   }
   *
   * @return {object}
   * @optional
   */
  getInitialState: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * @return {object}
   * @optional
   */
  getChildContext: SpecPolicy.DEFINE_MANY_MERGED,

  /**
   * Uses props from `this.props` and state from `this.state` to render the
   * structure of the component.
   *
   * No guarantees are made about when or how often this method is invoked, so
   * it must not have side effects.
   *
   *   render: function() {
   *     var name = this.props.name;
   *     return <div>Hello, {name}!</div>;
   *   }
   *
   * @return {ReactComponent}
   * @nosideeffects
   * @required
   */
  render: SpecPolicy.DEFINE_ONCE,

  // ==== Delegate methods ====

  /**
   * Invoked when the component is initially created and about to be mounted.
   * This may have side effects, but any external subscriptions or data created
   * by this method must be cleaned up in `componentWillUnmount`.
   *
   * @optional
   */
  componentWillMount: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component has been mounted and has a DOM representation.
   * However, there is no guarantee that the DOM node is in the document.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been mounted (initialized and rendered) for the first time.
   *
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidMount: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked before the component receives new props.
   *
   * Use this as an opportunity to react to a prop transition by updating the
   * state using `this.setState`. Current props are accessed via `this.props`.
   *
   *   componentWillReceiveProps: function(nextProps, nextContext) {
   *     this.setState({
   *       likesIncreasing: nextProps.likeCount > this.props.likeCount
   *     });
   *   }
   *
   * NOTE: There is no equivalent `componentWillReceiveState`. An incoming prop
   * transition may cause a state change, but the opposite is not true. If you
   * need it, you are probably looking for `componentWillUpdate`.
   *
   * @param {object} nextProps
   * @optional
   */
  componentWillReceiveProps: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked while deciding if the component should be updated as a result of
   * receiving new props, state and/or context.
   *
   * Use this as an opportunity to `return false` when you're certain that the
   * transition to the new props/state/context will not require a component
   * update.
   *
   *   shouldComponentUpdate: function(nextProps, nextState, nextContext) {
   *     return !equal(nextProps, this.props) ||
   *       !equal(nextState, this.state) ||
   *       !equal(nextContext, this.context);
   *   }
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @return {boolean} True if the component should update.
   * @optional
   */
  shouldComponentUpdate: SpecPolicy.DEFINE_ONCE,

  /**
   * Invoked when the component is about to update due to a transition from
   * `this.props`, `this.state` and `this.context` to `nextProps`, `nextState`
   * and `nextContext`.
   *
   * Use this as an opportunity to perform preparation before an update occurs.
   *
   * NOTE: You **cannot** use `this.setState()` in this method.
   *
   * @param {object} nextProps
   * @param {?object} nextState
   * @param {?object} nextContext
   * @param {ReactReconcileTransaction} transaction
   * @optional
   */
  componentWillUpdate: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component's DOM representation has been updated.
   *
   * Use this as an opportunity to operate on the DOM when the component has
   * been updated.
   *
   * @param {object} prevProps
   * @param {?object} prevState
   * @param {?object} prevContext
   * @param {DOMElement} rootNode DOM element representing the component.
   * @optional
   */
  componentDidUpdate: SpecPolicy.DEFINE_MANY,

  /**
   * Invoked when the component is about to be removed from its parent and have
   * its DOM representation destroyed.
   *
   * Use this as an opportunity to deallocate any external resources.
   *
   * NOTE: There is no `componentDidUnmount` since your component will have been
   * destroyed by that point.
   *
   * @optional
   */
  componentWillUnmount: SpecPolicy.DEFINE_MANY,

  // ==== Advanced methods ====

  /**
   * Updates the component's currently mounted DOM representation.
   *
   * By default, this implements React's rendering and reconciliation algorithm.
   * Sophisticated clients may wish to override this.
   *
   * @param {ReactReconcileTransaction} transaction
   * @internal
   * @overridable
   */
  updateComponent: SpecPolicy.OVERRIDE_BASE

};

/**
 * Mapping from class specification keys to special processing functions.
 *
 * Although these are declared like instance properties in the specification
 * when defining classes using `React.createClass`, they are actually static
 * and are accessible on the constructor instead of the prototype. Despite
 * being static, they must be defined outside of the "statics" key under
 * which all other static methods are defined.
 */
var RESERVED_SPEC_KEYS = {
  displayName: function (Constructor, displayName) {
    Constructor.displayName = displayName;
  },
  mixins: function (Constructor, mixins) {
    if (mixins) {
      for (var i = 0; i < mixins.length; i++) {
        mixSpecIntoComponent(Constructor, mixins[i]);
      }
    }
  },
  childContextTypes: function (Constructor, childContextTypes) {
    if (process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor, childContextTypes, ReactPropTypeLocations.childContext);
    }
    Constructor.childContextTypes = _assign({}, Constructor.childContextTypes, childContextTypes);
  },
  contextTypes: function (Constructor, contextTypes) {
    if (process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor, contextTypes, ReactPropTypeLocations.context);
    }
    Constructor.contextTypes = _assign({}, Constructor.contextTypes, contextTypes);
  },
  /**
   * Special case getDefaultProps which should move into statics but requires
   * automatic merging.
   */
  getDefaultProps: function (Constructor, getDefaultProps) {
    if (Constructor.getDefaultProps) {
      Constructor.getDefaultProps = createMergedResultFunction(Constructor.getDefaultProps, getDefaultProps);
    } else {
      Constructor.getDefaultProps = getDefaultProps;
    }
  },
  propTypes: function (Constructor, propTypes) {
    if (process.env.NODE_ENV !== 'production') {
      validateTypeDef(Constructor, propTypes, ReactPropTypeLocations.prop);
    }
    Constructor.propTypes = _assign({}, Constructor.propTypes, propTypes);
  },
  statics: function (Constructor, statics) {
    mixStaticSpecIntoComponent(Constructor, statics);
  },
  autobind: function () {} };

// noop
function validateTypeDef(Constructor, typeDef, location) {
  for (var propName in typeDef) {
    if (typeDef.hasOwnProperty(propName)) {
      // use a warning instead of an invariant so components
      // don't show up in prod but only in __DEV__
      process.env.NODE_ENV !== 'production' ? warning(typeof typeDef[propName] === 'function', '%s: %s type `%s` is invalid; it must be a function, usually from ' + 'React.PropTypes.', Constructor.displayName || 'ReactClass', ReactPropTypeLocationNames[location], propName) : void 0;
    }
  }
}

function validateMethodOverride(isAlreadyDefined, name) {
  var specPolicy = ReactClassInterface.hasOwnProperty(name) ? ReactClassInterface[name] : null;

  // Disallow overriding of base class methods unless explicitly allowed.
  if (ReactClassMixin.hasOwnProperty(name)) {
    !(specPolicy === SpecPolicy.OVERRIDE_BASE) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to override `%s` from your class specification. Ensure that your method names do not overlap with React methods.', name) : _prodInvariant('73', name) : void 0;
  }

  // Disallow defining methods more than once unless explicitly allowed.
  if (isAlreadyDefined) {
    !(specPolicy === SpecPolicy.DEFINE_MANY || specPolicy === SpecPolicy.DEFINE_MANY_MERGED) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClassInterface: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('74', name) : void 0;
  }
}

/**
 * Mixin helper which handles policy validation and reserved
 * specification keys when building React classes.
 */
function mixSpecIntoComponent(Constructor, spec) {
  if (!spec) {
    if (process.env.NODE_ENV !== 'production') {
      var typeofSpec = typeof spec;
      var isMixinValid = typeofSpec === 'object' && spec !== null;

      process.env.NODE_ENV !== 'production' ? warning(isMixinValid, '%s: You\'re attempting to include a mixin that is either null ' + 'or not an object. Check the mixins included by the component, ' + 'as well as any mixins they include themselves. ' + 'Expected object but got %s.', Constructor.displayName || 'ReactClass', spec === null ? null : typeofSpec) : void 0;
    }

    return;
  }

  !(typeof spec !== 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component class or function as a mixin. Instead, just use a regular object.') : _prodInvariant('75') : void 0;
  !!ReactElement.isValidElement(spec) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You\'re attempting to use a component as a mixin. Instead, just use a regular object.') : _prodInvariant('76') : void 0;

  var proto = Constructor.prototype;
  var autoBindPairs = proto.__reactAutoBindPairs;

  // By handling mixins before any other properties, we ensure the same
  // chaining order is applied to methods with DEFINE_MANY policy, whether
  // mixins are listed before or after these methods in the spec.
  if (spec.hasOwnProperty(MIXINS_KEY)) {
    RESERVED_SPEC_KEYS.mixins(Constructor, spec.mixins);
  }

  for (var name in spec) {
    if (!spec.hasOwnProperty(name)) {
      continue;
    }

    if (name === MIXINS_KEY) {
      // We have already handled mixins in a special case above.
      continue;
    }

    var property = spec[name];
    var isAlreadyDefined = proto.hasOwnProperty(name);
    validateMethodOverride(isAlreadyDefined, name);

    if (RESERVED_SPEC_KEYS.hasOwnProperty(name)) {
      RESERVED_SPEC_KEYS[name](Constructor, property);
    } else {
      // Setup methods on prototype:
      // The following member methods should not be automatically bound:
      // 1. Expected ReactClass methods (in the "interface").
      // 2. Overridden methods (that were mixed in).
      var isReactClassMethod = ReactClassInterface.hasOwnProperty(name);
      var isFunction = typeof property === 'function';
      var shouldAutoBind = isFunction && !isReactClassMethod && !isAlreadyDefined && spec.autobind !== false;

      if (shouldAutoBind) {
        autoBindPairs.push(name, property);
        proto[name] = property;
      } else {
        if (isAlreadyDefined) {
          var specPolicy = ReactClassInterface[name];

          // These cases should already be caught by validateMethodOverride.
          !(isReactClassMethod && (specPolicy === SpecPolicy.DEFINE_MANY_MERGED || specPolicy === SpecPolicy.DEFINE_MANY)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: Unexpected spec policy %s for key %s when mixing in component specs.', specPolicy, name) : _prodInvariant('77', specPolicy, name) : void 0;

          // For methods which are defined more than once, call the existing
          // methods before calling the new property, merging if appropriate.
          if (specPolicy === SpecPolicy.DEFINE_MANY_MERGED) {
            proto[name] = createMergedResultFunction(proto[name], property);
          } else if (specPolicy === SpecPolicy.DEFINE_MANY) {
            proto[name] = createChainedFunction(proto[name], property);
          }
        } else {
          proto[name] = property;
          if (process.env.NODE_ENV !== 'production') {
            // Add verbose displayName to the function, which helps when looking
            // at profiling tools.
            if (typeof property === 'function' && spec.displayName) {
              proto[name].displayName = spec.displayName + '_' + name;
            }
          }
        }
      }
    }
  }
}

function mixStaticSpecIntoComponent(Constructor, statics) {
  if (!statics) {
    return;
  }
  for (var name in statics) {
    var property = statics[name];
    if (!statics.hasOwnProperty(name)) {
      continue;
    }

    var isReserved = name in RESERVED_SPEC_KEYS;
    !!isReserved ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define a reserved property, `%s`, that shouldn\'t be on the "statics" key. Define it as an instance property instead; it will still be accessible on the constructor.', name) : _prodInvariant('78', name) : void 0;

    var isInherited = name in Constructor;
    !!isInherited ? process.env.NODE_ENV !== 'production' ? invariant(false, 'ReactClass: You are attempting to define `%s` on your component more than once. This conflict may be due to a mixin.', name) : _prodInvariant('79', name) : void 0;
    Constructor[name] = property;
  }
}

/**
 * Merge two objects, but throw if both contain the same key.
 *
 * @param {object} one The first object, which is mutated.
 * @param {object} two The second object
 * @return {object} one after it has been mutated to contain everything in two.
 */
function mergeIntoWithNoDuplicateKeys(one, two) {
  !(one && two && typeof one === 'object' && typeof two === 'object') ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Cannot merge non-objects.') : _prodInvariant('80') : void 0;

  for (var key in two) {
    if (two.hasOwnProperty(key)) {
      !(one[key] === undefined) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'mergeIntoWithNoDuplicateKeys(): Tried to merge two objects with the same key: `%s`. This conflict may be due to a mixin; in particular, this may be caused by two getInitialState() or getDefaultProps() methods returning objects with clashing keys.', key) : _prodInvariant('81', key) : void 0;
      one[key] = two[key];
    }
  }
  return one;
}

/**
 * Creates a function that invokes two functions and merges their return values.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createMergedResultFunction(one, two) {
  return function mergedResult() {
    var a = one.apply(this, arguments);
    var b = two.apply(this, arguments);
    if (a == null) {
      return b;
    } else if (b == null) {
      return a;
    }
    var c = {};
    mergeIntoWithNoDuplicateKeys(c, a);
    mergeIntoWithNoDuplicateKeys(c, b);
    return c;
  };
}

/**
 * Creates a function that invokes two functions and ignores their return vales.
 *
 * @param {function} one Function to invoke first.
 * @param {function} two Function to invoke second.
 * @return {function} Function that invokes the two argument functions.
 * @private
 */
function createChainedFunction(one, two) {
  return function chainedFunction() {
    one.apply(this, arguments);
    two.apply(this, arguments);
  };
}

/**
 * Binds a method to the component.
 *
 * @param {object} component Component whose method is going to be bound.
 * @param {function} method Method to be bound.
 * @return {function} The bound method.
 */
function bindAutoBindMethod(component, method) {
  var boundMethod = method.bind(component);
  if (process.env.NODE_ENV !== 'production') {
    boundMethod.__reactBoundContext = component;
    boundMethod.__reactBoundMethod = method;
    boundMethod.__reactBoundArguments = null;
    var componentName = component.constructor.displayName;
    var _bind = boundMethod.bind;
    boundMethod.bind = function (newThis) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      // User is trying to bind() an autobound method; we effectively will
      // ignore the value of "this" that the user is trying to use, so
      // let's warn.
      if (newThis !== component && newThis !== null) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): React component methods may only be bound to the ' + 'component instance. See %s', componentName) : void 0;
      } else if (!args.length) {
        process.env.NODE_ENV !== 'production' ? warning(false, 'bind(): You are binding a component method to the component. ' + 'React does this for you automatically in a high-performance ' + 'way, so you can safely remove this call. See %s', componentName) : void 0;
        return boundMethod;
      }
      var reboundMethod = _bind.apply(boundMethod, arguments);
      reboundMethod.__reactBoundContext = component;
      reboundMethod.__reactBoundMethod = method;
      reboundMethod.__reactBoundArguments = args;
      return reboundMethod;
    };
  }
  return boundMethod;
}

/**
 * Binds all auto-bound methods in a component.
 *
 * @param {object} component Component whose method is going to be bound.
 */
function bindAutoBindMethods(component) {
  var pairs = component.__reactAutoBindPairs;
  for (var i = 0; i < pairs.length; i += 2) {
    var autoBindKey = pairs[i];
    var method = pairs[i + 1];
    component[autoBindKey] = bindAutoBindMethod(component, method);
  }
}

/**
 * Add more to the ReactClass base class. These are all legacy features and
 * therefore not already part of the modern ReactComponent.
 */
var ReactClassMixin = {

  /**
   * TODO: This will be deprecated because state should always keep a consistent
   * type signature and the only use case for this, is to avoid that.
   */
  replaceState: function (newState, callback) {
    this.updater.enqueueReplaceState(this, newState);
    if (callback) {
      this.updater.enqueueCallback(this, callback, 'replaceState');
    }
  },

  /**
   * Checks whether or not this composite component is mounted.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function () {
    return this.updater.isMounted(this);
  }
};

var ReactClassComponent = function () {};
_assign(ReactClassComponent.prototype, ReactComponent.prototype, ReactClassMixin);

/**
 * Module for creating composite components.
 *
 * @class ReactClass
 */
var ReactClass = {

  /**
   * Creates a composite component class given a class specification.
   * See https://facebook.github.io/react/docs/top-level-api.html#react.createclass
   *
   * @param {object} spec Class specification (which must define `render`).
   * @return {function} Component constructor function.
   * @public
   */
  createClass: function (spec) {
    var Constructor = function (props, context, updater) {
      // This constructor gets overridden by mocks. The argument is used
      // by mocks to assert on what gets mounted.

      if (process.env.NODE_ENV !== 'production') {
        process.env.NODE_ENV !== 'production' ? warning(this instanceof Constructor, 'Something is calling a React component directly. Use a factory or ' + 'JSX instead. See: https://fb.me/react-legacyfactory') : void 0;
      }

      // Wire up auto-binding
      if (this.__reactAutoBindPairs.length) {
        bindAutoBindMethods(this);
      }

      this.props = props;
      this.context = context;
      this.refs = emptyObject;
      this.updater = updater || ReactNoopUpdateQueue;

      this.state = null;

      // ReactClasses doesn't have constructors. Instead, they use the
      // getInitialState and componentWillMount methods for initialization.

      var initialState = this.getInitialState ? this.getInitialState() : null;
      if (process.env.NODE_ENV !== 'production') {
        // We allow auto-mocks to proceed as if they're returning null.
        if (initialState === undefined && this.getInitialState._isMockFunction) {
          // This is probably bad practice. Consider warning here and
          // deprecating this convenience.
          initialState = null;
        }
      }
      !(typeof initialState === 'object' && !Array.isArray(initialState)) ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s.getInitialState(): must return an object or null', Constructor.displayName || 'ReactCompositeComponent') : _prodInvariant('82', Constructor.displayName || 'ReactCompositeComponent') : void 0;

      this.state = initialState;
    };
    Constructor.prototype = new ReactClassComponent();
    Constructor.prototype.constructor = Constructor;
    Constructor.prototype.__reactAutoBindPairs = [];

    injectedMixins.forEach(mixSpecIntoComponent.bind(null, Constructor));

    mixSpecIntoComponent(Constructor, spec);

    // Initialize the defaultProps property after all mixins have been merged.
    if (Constructor.getDefaultProps) {
      Constructor.defaultProps = Constructor.getDefaultProps();
    }

    if (process.env.NODE_ENV !== 'production') {
      // This is a tag to indicate that the use of these method names is ok,
      // since it's used with createClass. If it's not, then it's likely a
      // mistake so we'll warn you to use the static property, property
      // initializer or constructor respectively.
      if (Constructor.getDefaultProps) {
        Constructor.getDefaultProps.isReactClassApproved = {};
      }
      if (Constructor.prototype.getInitialState) {
        Constructor.prototype.getInitialState.isReactClassApproved = {};
      }
    }

    !Constructor.prototype.render ? process.env.NODE_ENV !== 'production' ? invariant(false, 'createClass(...): Class specification must implement a `render` method.') : _prodInvariant('83') : void 0;

    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentShouldUpdate, '%s has a method called ' + 'componentShouldUpdate(). Did you mean shouldComponentUpdate()? ' + 'The name is phrased as a question because the function is ' + 'expected to return a value.', spec.displayName || 'A component') : void 0;
      process.env.NODE_ENV !== 'production' ? warning(!Constructor.prototype.componentWillRecieveProps, '%s has a method called ' + 'componentWillRecieveProps(). Did you mean componentWillReceiveProps()?', spec.displayName || 'A component') : void 0;
    }

    // Reduce time spent doing lookups by setting these on the prototype.
    for (var methodName in ReactClassInterface) {
      if (!Constructor.prototype[methodName]) {
        Constructor.prototype[methodName] = null;
      }
    }

    return Constructor;
  },

  injection: {
    injectMixin: function (mixin) {
      injectedMixins.push(mixin);
    }
  }

};

module.exports = ReactClass;
}).call(this,require('_process'))

},{"./ReactComponent":9,"./ReactElement":13,"./ReactNoopUpdateQueue":15,"./ReactPropTypeLocationNames":16,"./ReactPropTypeLocations":17,"./reactProdInvariant":26,"_process":1,"fbjs/lib/emptyObject":29,"fbjs/lib/invariant":30,"fbjs/lib/keyMirror":31,"fbjs/lib/keyOf":32,"fbjs/lib/warning":33,"object-assign":3}],9:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponent
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var canDefineProperty = require('./canDefineProperty');
var emptyObject = require('fbjs/lib/emptyObject');
var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

/**
 * Base class helpers for the updating state of a component.
 */
function ReactComponent(props, context, updater) {
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

ReactComponent.prototype.isReactComponent = {};

/**
 * Sets a subset of the state. Always use this to mutate
 * state. You should treat `this.state` as immutable.
 *
 * There is no guarantee that `this.state` will be immediately updated, so
 * accessing `this.state` after calling this method may return the old value.
 *
 * There is no guarantee that calls to `setState` will run synchronously,
 * as they may eventually be batched together.  You can provide an optional
 * callback that will be executed when the call to setState is actually
 * completed.
 *
 * When a function is provided to setState, it will be called at some point in
 * the future (not synchronously). It will be called with the up to date
 * component arguments (state, props, context). These values can be different
 * from this.* because your function may be called after receiveProps but before
 * shouldComponentUpdate, and this new state, props, and context will not yet be
 * assigned to this.
 *
 * @param {object|function} partialState Next partial state or function to
 *        produce next partial state to be merged with current state.
 * @param {?function} callback Called after state is updated.
 * @final
 * @protected
 */
ReactComponent.prototype.setState = function (partialState, callback) {
  !(typeof partialState === 'object' || typeof partialState === 'function' || partialState == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'setState(...): takes an object of state variables to update or a function which returns an object of state variables.') : _prodInvariant('85') : void 0;
  this.updater.enqueueSetState(this, partialState);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'setState');
  }
};

/**
 * Forces an update. This should only be invoked when it is known with
 * certainty that we are **not** in a DOM transaction.
 *
 * You may want to call this when you know that some deeper aspect of the
 * component's state has changed but `setState` was not called.
 *
 * This will not invoke `shouldComponentUpdate`, but it will invoke
 * `componentWillUpdate` and `componentDidUpdate`.
 *
 * @param {?function} callback Called after update is complete.
 * @final
 * @protected
 */
ReactComponent.prototype.forceUpdate = function (callback) {
  this.updater.enqueueForceUpdate(this);
  if (callback) {
    this.updater.enqueueCallback(this, callback, 'forceUpdate');
  }
};

/**
 * Deprecated APIs. These APIs used to exist on classic React classes but since
 * we would like to deprecate them, we're not going to move them over to this
 * modern base class. Instead, we define a getter that warns if it's accessed.
 */
if (process.env.NODE_ENV !== 'production') {
  var deprecatedAPIs = {
    isMounted: ['isMounted', 'Instead, make sure to clean up subscriptions and pending requests in ' + 'componentWillUnmount to prevent memory leaks.'],
    replaceState: ['replaceState', 'Refactor your code to use setState instead (see ' + 'https://github.com/facebook/react/issues/3236).']
  };
  var defineDeprecationWarning = function (methodName, info) {
    if (canDefineProperty) {
      Object.defineProperty(ReactComponent.prototype, methodName, {
        get: function () {
          process.env.NODE_ENV !== 'production' ? warning(false, '%s(...) is deprecated in plain JavaScript React classes. %s', info[0], info[1]) : void 0;
          return undefined;
        }
      });
    }
  };
  for (var fnName in deprecatedAPIs) {
    if (deprecatedAPIs.hasOwnProperty(fnName)) {
      defineDeprecationWarning(fnName, deprecatedAPIs[fnName]);
    }
  }
}

module.exports = ReactComponent;
}).call(this,require('_process'))

},{"./ReactNoopUpdateQueue":15,"./canDefineProperty":22,"./reactProdInvariant":26,"_process":1,"fbjs/lib/emptyObject":29,"fbjs/lib/invariant":30,"fbjs/lib/warning":33}],10:[function(require,module,exports){
(function (process){
/**
 * Copyright 2016-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactComponentTreeHook
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

function isNative(fn) {
  // Based on isNative() from Lodash
  var funcToString = Function.prototype.toString;
  var hasOwnProperty = Object.prototype.hasOwnProperty;
  var reIsNative = RegExp('^' + funcToString
  // Take an example native function source for comparison
  .call(hasOwnProperty)
  // Strip regex characters so we can use it for regex
  .replace(/[\\^$.*+?()[\]{}|]/g, '\\$&')
  // Remove hasOwnProperty from the template to make it generic
  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$');
  try {
    var source = funcToString.call(fn);
    return reIsNative.test(source);
  } catch (err) {
    return false;
  }
}

var canUseCollections =
// Array.from
typeof Array.from === 'function' &&
// Map
typeof Map === 'function' && isNative(Map) &&
// Map.prototype.keys
Map.prototype != null && typeof Map.prototype.keys === 'function' && isNative(Map.prototype.keys) &&
// Set
typeof Set === 'function' && isNative(Set) &&
// Set.prototype.keys
Set.prototype != null && typeof Set.prototype.keys === 'function' && isNative(Set.prototype.keys);

var itemMap;
var rootIDSet;

var itemByKey;
var rootByKey;

if (canUseCollections) {
  itemMap = new Map();
  rootIDSet = new Set();
} else {
  itemByKey = {};
  rootByKey = {};
}

var unmountedIDs = [];

// Use non-numeric keys to prevent V8 performance issues:
// https://github.com/facebook/react/pull/7232
function getKeyFromID(id) {
  return '.' + id;
}
function getIDFromKey(key) {
  return parseInt(key.substr(1), 10);
}

function get(id) {
  if (canUseCollections) {
    return itemMap.get(id);
  } else {
    var key = getKeyFromID(id);
    return itemByKey[key];
  }
}

function remove(id) {
  if (canUseCollections) {
    itemMap['delete'](id);
  } else {
    var key = getKeyFromID(id);
    delete itemByKey[key];
  }
}

function create(id, element, parentID) {
  var item = {
    element: element,
    parentID: parentID,
    text: null,
    childIDs: [],
    isMounted: false,
    updateCount: 0
  };

  if (canUseCollections) {
    itemMap.set(id, item);
  } else {
    var key = getKeyFromID(id);
    itemByKey[key] = item;
  }
}

function addRoot(id) {
  if (canUseCollections) {
    rootIDSet.add(id);
  } else {
    var key = getKeyFromID(id);
    rootByKey[key] = true;
  }
}

function removeRoot(id) {
  if (canUseCollections) {
    rootIDSet['delete'](id);
  } else {
    var key = getKeyFromID(id);
    delete rootByKey[key];
  }
}

function getRegisteredIDs() {
  if (canUseCollections) {
    return Array.from(itemMap.keys());
  } else {
    return Object.keys(itemByKey).map(getIDFromKey);
  }
}

function getRootIDs() {
  if (canUseCollections) {
    return Array.from(rootIDSet.keys());
  } else {
    return Object.keys(rootByKey).map(getIDFromKey);
  }
}

function purgeDeep(id) {
  var item = get(id);
  if (item) {
    var childIDs = item.childIDs;

    remove(id);
    childIDs.forEach(purgeDeep);
  }
}

function describeComponentFrame(name, source, ownerName) {
  return '\n    in ' + name + (source ? ' (at ' + source.fileName.replace(/^.*[\\\/]/, '') + ':' + source.lineNumber + ')' : ownerName ? ' (created by ' + ownerName + ')' : '');
}

function getDisplayName(element) {
  if (element == null) {
    return '#empty';
  } else if (typeof element === 'string' || typeof element === 'number') {
    return '#text';
  } else if (typeof element.type === 'string') {
    return element.type;
  } else {
    return element.type.displayName || element.type.name || 'Unknown';
  }
}

function describeID(id) {
  var name = ReactComponentTreeHook.getDisplayName(id);
  var element = ReactComponentTreeHook.getElement(id);
  var ownerID = ReactComponentTreeHook.getOwnerID(id);
  var ownerName;
  if (ownerID) {
    ownerName = ReactComponentTreeHook.getDisplayName(ownerID);
  }
  process.env.NODE_ENV !== 'production' ? warning(element, 'ReactComponentTreeHook: Missing React element for debugID %s when ' + 'building stack', id) : void 0;
  return describeComponentFrame(name, element && element._source, ownerName);
}

var ReactComponentTreeHook = {
  onSetChildren: function (id, nextChildIDs) {
    var item = get(id);
    item.childIDs = nextChildIDs;

    for (var i = 0; i < nextChildIDs.length; i++) {
      var nextChildID = nextChildIDs[i];
      var nextChild = get(nextChildID);
      !nextChild ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected hook events to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('140') : void 0;
      !(nextChild.childIDs != null || typeof nextChild.element !== 'object' || nextChild.element == null) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onSetChildren() to fire for a container child before its parent includes it in onSetChildren().') : _prodInvariant('141') : void 0;
      !nextChild.isMounted ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onMountComponent() to fire for the child before its parent includes it in onSetChildren().') : _prodInvariant('71') : void 0;
      if (nextChild.parentID == null) {
        nextChild.parentID = id;
        // TODO: This shouldn't be necessary but mounting a new root during in
        // componentWillMount currently causes not-yet-mounted components to
        // be purged from our tree data so their parent ID is missing.
      }
      !(nextChild.parentID === id) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Expected onBeforeMountComponent() parent and onSetChildren() to be consistent (%s has parents %s and %s).', nextChildID, nextChild.parentID, id) : _prodInvariant('142', nextChildID, nextChild.parentID, id) : void 0;
    }
  },
  onBeforeMountComponent: function (id, element, parentID) {
    create(id, element, parentID);
  },
  onBeforeUpdateComponent: function (id, element) {
    var item = get(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.element = element;
  },
  onMountComponent: function (id) {
    var item = get(id);
    item.isMounted = true;
    var isRoot = item.parentID === 0;
    if (isRoot) {
      addRoot(id);
    }
  },
  onUpdateComponent: function (id) {
    var item = get(id);
    if (!item || !item.isMounted) {
      // We may end up here as a result of setState() in componentWillUnmount().
      // In this case, ignore the element.
      return;
    }
    item.updateCount++;
  },
  onUnmountComponent: function (id) {
    var item = get(id);
    if (item) {
      // We need to check if it exists.
      // `item` might not exist if it is inside an error boundary, and a sibling
      // error boundary child threw while mounting. Then this instance never
      // got a chance to mount, but it still gets an unmounting event during
      // the error boundary cleanup.
      item.isMounted = false;
      var isRoot = item.parentID === 0;
      if (isRoot) {
        removeRoot(id);
      }
    }
    unmountedIDs.push(id);
  },
  purgeUnmountedComponents: function () {
    if (ReactComponentTreeHook._preventPurging) {
      // Should only be used for testing.
      return;
    }

    for (var i = 0; i < unmountedIDs.length; i++) {
      var id = unmountedIDs[i];
      purgeDeep(id);
    }
    unmountedIDs.length = 0;
  },
  isMounted: function (id) {
    var item = get(id);
    return item ? item.isMounted : false;
  },
  getCurrentStackAddendum: function (topElement) {
    var info = '';
    if (topElement) {
      var type = topElement.type;
      var name = typeof type === 'function' ? type.displayName || type.name : type;
      var owner = topElement._owner;
      info += describeComponentFrame(name || 'Unknown', topElement._source, owner && owner.getName());
    }

    var currentOwner = ReactCurrentOwner.current;
    var id = currentOwner && currentOwner._debugID;

    info += ReactComponentTreeHook.getStackAddendumByID(id);
    return info;
  },
  getStackAddendumByID: function (id) {
    var info = '';
    while (id) {
      info += describeID(id);
      id = ReactComponentTreeHook.getParentID(id);
    }
    return info;
  },
  getChildIDs: function (id) {
    var item = get(id);
    return item ? item.childIDs : [];
  },
  getDisplayName: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element) {
      return null;
    }
    return getDisplayName(element);
  },
  getElement: function (id) {
    var item = get(id);
    return item ? item.element : null;
  },
  getOwnerID: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (!element || !element._owner) {
      return null;
    }
    return element._owner._debugID;
  },
  getParentID: function (id) {
    var item = get(id);
    return item ? item.parentID : null;
  },
  getSource: function (id) {
    var item = get(id);
    var element = item ? item.element : null;
    var source = element != null ? element._source : null;
    return source;
  },
  getText: function (id) {
    var element = ReactComponentTreeHook.getElement(id);
    if (typeof element === 'string') {
      return element;
    } else if (typeof element === 'number') {
      return '' + element;
    } else {
      return null;
    }
  },
  getUpdateCount: function (id) {
    var item = get(id);
    return item ? item.updateCount : 0;
  },


  getRegisteredIDs: getRegisteredIDs,

  getRootIDs: getRootIDs
};

module.exports = ReactComponentTreeHook;
}).call(this,require('_process'))

},{"./ReactCurrentOwner":11,"./reactProdInvariant":26,"_process":1,"fbjs/lib/invariant":30,"fbjs/lib/warning":33}],11:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactCurrentOwner
 */

'use strict';

/**
 * Keeps track of the current owner.
 *
 * The current owner is the component who should own any components that are
 * currently being constructed.
 */

var ReactCurrentOwner = {

  /**
   * @internal
   * @type {ReactComponent}
   */
  current: null

};

module.exports = ReactCurrentOwner;
},{}],12:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactDOMFactories
 */

'use strict';

var ReactElement = require('./ReactElement');

/**
 * Create a factory that creates HTML tag elements.
 *
 * @private
 */
var createDOMFactory = ReactElement.createFactory;
if (process.env.NODE_ENV !== 'production') {
  var ReactElementValidator = require('./ReactElementValidator');
  createDOMFactory = ReactElementValidator.createFactory;
}

/**
 * Creates a mapping from supported HTML tags to `ReactDOMComponent` classes.
 * This is also accessible via `React.DOM`.
 *
 * @public
 */
var ReactDOMFactories = {
  a: createDOMFactory('a'),
  abbr: createDOMFactory('abbr'),
  address: createDOMFactory('address'),
  area: createDOMFactory('area'),
  article: createDOMFactory('article'),
  aside: createDOMFactory('aside'),
  audio: createDOMFactory('audio'),
  b: createDOMFactory('b'),
  base: createDOMFactory('base'),
  bdi: createDOMFactory('bdi'),
  bdo: createDOMFactory('bdo'),
  big: createDOMFactory('big'),
  blockquote: createDOMFactory('blockquote'),
  body: createDOMFactory('body'),
  br: createDOMFactory('br'),
  button: createDOMFactory('button'),
  canvas: createDOMFactory('canvas'),
  caption: createDOMFactory('caption'),
  cite: createDOMFactory('cite'),
  code: createDOMFactory('code'),
  col: createDOMFactory('col'),
  colgroup: createDOMFactory('colgroup'),
  data: createDOMFactory('data'),
  datalist: createDOMFactory('datalist'),
  dd: createDOMFactory('dd'),
  del: createDOMFactory('del'),
  details: createDOMFactory('details'),
  dfn: createDOMFactory('dfn'),
  dialog: createDOMFactory('dialog'),
  div: createDOMFactory('div'),
  dl: createDOMFactory('dl'),
  dt: createDOMFactory('dt'),
  em: createDOMFactory('em'),
  embed: createDOMFactory('embed'),
  fieldset: createDOMFactory('fieldset'),
  figcaption: createDOMFactory('figcaption'),
  figure: createDOMFactory('figure'),
  footer: createDOMFactory('footer'),
  form: createDOMFactory('form'),
  h1: createDOMFactory('h1'),
  h2: createDOMFactory('h2'),
  h3: createDOMFactory('h3'),
  h4: createDOMFactory('h4'),
  h5: createDOMFactory('h5'),
  h6: createDOMFactory('h6'),
  head: createDOMFactory('head'),
  header: createDOMFactory('header'),
  hgroup: createDOMFactory('hgroup'),
  hr: createDOMFactory('hr'),
  html: createDOMFactory('html'),
  i: createDOMFactory('i'),
  iframe: createDOMFactory('iframe'),
  img: createDOMFactory('img'),
  input: createDOMFactory('input'),
  ins: createDOMFactory('ins'),
  kbd: createDOMFactory('kbd'),
  keygen: createDOMFactory('keygen'),
  label: createDOMFactory('label'),
  legend: createDOMFactory('legend'),
  li: createDOMFactory('li'),
  link: createDOMFactory('link'),
  main: createDOMFactory('main'),
  map: createDOMFactory('map'),
  mark: createDOMFactory('mark'),
  menu: createDOMFactory('menu'),
  menuitem: createDOMFactory('menuitem'),
  meta: createDOMFactory('meta'),
  meter: createDOMFactory('meter'),
  nav: createDOMFactory('nav'),
  noscript: createDOMFactory('noscript'),
  object: createDOMFactory('object'),
  ol: createDOMFactory('ol'),
  optgroup: createDOMFactory('optgroup'),
  option: createDOMFactory('option'),
  output: createDOMFactory('output'),
  p: createDOMFactory('p'),
  param: createDOMFactory('param'),
  picture: createDOMFactory('picture'),
  pre: createDOMFactory('pre'),
  progress: createDOMFactory('progress'),
  q: createDOMFactory('q'),
  rp: createDOMFactory('rp'),
  rt: createDOMFactory('rt'),
  ruby: createDOMFactory('ruby'),
  s: createDOMFactory('s'),
  samp: createDOMFactory('samp'),
  script: createDOMFactory('script'),
  section: createDOMFactory('section'),
  select: createDOMFactory('select'),
  small: createDOMFactory('small'),
  source: createDOMFactory('source'),
  span: createDOMFactory('span'),
  strong: createDOMFactory('strong'),
  style: createDOMFactory('style'),
  sub: createDOMFactory('sub'),
  summary: createDOMFactory('summary'),
  sup: createDOMFactory('sup'),
  table: createDOMFactory('table'),
  tbody: createDOMFactory('tbody'),
  td: createDOMFactory('td'),
  textarea: createDOMFactory('textarea'),
  tfoot: createDOMFactory('tfoot'),
  th: createDOMFactory('th'),
  thead: createDOMFactory('thead'),
  time: createDOMFactory('time'),
  title: createDOMFactory('title'),
  tr: createDOMFactory('tr'),
  track: createDOMFactory('track'),
  u: createDOMFactory('u'),
  ul: createDOMFactory('ul'),
  'var': createDOMFactory('var'),
  video: createDOMFactory('video'),
  wbr: createDOMFactory('wbr'),

  // SVG
  circle: createDOMFactory('circle'),
  clipPath: createDOMFactory('clipPath'),
  defs: createDOMFactory('defs'),
  ellipse: createDOMFactory('ellipse'),
  g: createDOMFactory('g'),
  image: createDOMFactory('image'),
  line: createDOMFactory('line'),
  linearGradient: createDOMFactory('linearGradient'),
  mask: createDOMFactory('mask'),
  path: createDOMFactory('path'),
  pattern: createDOMFactory('pattern'),
  polygon: createDOMFactory('polygon'),
  polyline: createDOMFactory('polyline'),
  radialGradient: createDOMFactory('radialGradient'),
  rect: createDOMFactory('rect'),
  stop: createDOMFactory('stop'),
  svg: createDOMFactory('svg'),
  text: createDOMFactory('text'),
  tspan: createDOMFactory('tspan')
};

module.exports = ReactDOMFactories;
}).call(this,require('_process'))

},{"./ReactElement":13,"./ReactElementValidator":14,"_process":1}],13:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactElement
 */

'use strict';

var _assign = require('object-assign');

var ReactCurrentOwner = require('./ReactCurrentOwner');

var warning = require('fbjs/lib/warning');
var canDefineProperty = require('./canDefineProperty');
var hasOwnProperty = Object.prototype.hasOwnProperty;

// The Symbol used to tag the ReactElement type. If there is no native Symbol
// nor polyfill, then a plain number is used for performance.
var REACT_ELEMENT_TYPE = typeof Symbol === 'function' && Symbol['for'] && Symbol['for']('react.element') || 0xeac7;

var RESERVED_PROPS = {
  key: true,
  ref: true,
  __self: true,
  __source: true
};

var specialPropKeyWarningShown, specialPropRefWarningShown;

function hasValidRef(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (hasOwnProperty.call(config, 'ref')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'ref').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.ref !== undefined;
}

function hasValidKey(config) {
  if (process.env.NODE_ENV !== 'production') {
    if (hasOwnProperty.call(config, 'key')) {
      var getter = Object.getOwnPropertyDescriptor(config, 'key').get;
      if (getter && getter.isReactWarning) {
        return false;
      }
    }
  }
  return config.key !== undefined;
}

function defineKeyPropWarningGetter(props, displayName) {
  var warnAboutAccessingKey = function () {
    if (!specialPropKeyWarningShown) {
      specialPropKeyWarningShown = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s: `key` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
    }
  };
  warnAboutAccessingKey.isReactWarning = true;
  Object.defineProperty(props, 'key', {
    get: warnAboutAccessingKey,
    configurable: true
  });
}

function defineRefPropWarningGetter(props, displayName) {
  var warnAboutAccessingRef = function () {
    if (!specialPropRefWarningShown) {
      specialPropRefWarningShown = true;
      process.env.NODE_ENV !== 'production' ? warning(false, '%s: `ref` is not a prop. Trying to access it will result ' + 'in `undefined` being returned. If you need to access the same ' + 'value within the child component, you should pass it as a different ' + 'prop. (https://fb.me/react-special-props)', displayName) : void 0;
    }
  };
  warnAboutAccessingRef.isReactWarning = true;
  Object.defineProperty(props, 'ref', {
    get: warnAboutAccessingRef,
    configurable: true
  });
}

/**
 * Factory method to create a new React element. This no longer adheres to
 * the class pattern, so do not use new to call it. Also, no instanceof check
 * will work. Instead test $$typeof field against Symbol.for('react.element') to check
 * if something is a React Element.
 *
 * @param {*} type
 * @param {*} key
 * @param {string|object} ref
 * @param {*} self A *temporary* helper to detect places where `this` is
 * different from the `owner` when React.createElement is called, so that we
 * can warn. We want to get rid of owner and replace string `ref`s with arrow
 * functions, and as long as `this` and owner are the same, there will be no
 * change in behavior.
 * @param {*} source An annotation object (added by a transpiler or otherwise)
 * indicating filename, line number, and/or other information.
 * @param {*} owner
 * @param {*} props
 * @internal
 */
var ReactElement = function (type, key, ref, self, source, owner, props) {
  var element = {
    // This tag allow us to uniquely identify this as a React Element
    $$typeof: REACT_ELEMENT_TYPE,

    // Built-in properties that belong on the element
    type: type,
    key: key,
    ref: ref,
    props: props,

    // Record the component responsible for creating this element.
    _owner: owner
  };

  if (process.env.NODE_ENV !== 'production') {
    // The validation flag is currently mutative. We put it on
    // an external backing store so that we can freeze the whole object.
    // This can be replaced with a WeakMap once they are implemented in
    // commonly used development environments.
    element._store = {};
    var shadowChildren = Array.isArray(props.children) ? props.children.slice(0) : props.children;

    // To make comparing ReactElements easier for testing purposes, we make
    // the validation flag non-enumerable (where possible, which should
    // include every environment we run tests in), so the test framework
    // ignores it.
    if (canDefineProperty) {
      Object.defineProperty(element._store, 'validated', {
        configurable: false,
        enumerable: false,
        writable: true,
        value: false
      });
      // self and source are DEV only properties.
      Object.defineProperty(element, '_self', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: self
      });
      Object.defineProperty(element, '_shadowChildren', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: shadowChildren
      });
      // Two elements created in two different places should be considered
      // equal for testing purposes and therefore we hide it from enumeration.
      Object.defineProperty(element, '_source', {
        configurable: false,
        enumerable: false,
        writable: false,
        value: source
      });
    } else {
      element._store.validated = false;
      element._self = self;
      element._shadowChildren = shadowChildren;
      element._source = source;
    }
    if (Object.freeze) {
      Object.freeze(element.props);
      Object.freeze(element);
    }
  }

  return element;
};

/**
 * Create and return a new ReactElement of the given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createelement
 */
ReactElement.createElement = function (type, config, children) {
  var propName;

  // Reserved names are extracted
  var props = {};

  var key = null;
  var ref = null;
  var self = null;
  var source = null;

  if (config != null) {
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(
      /* eslint-disable no-proto */
      config.__proto__ == null || config.__proto__ === Object.prototype,
      /* eslint-enable no-proto */
      'React.createElement(...): Expected props argument to be a plain object. ' + 'Properties defined in its prototype chain will be ignored.') : void 0;
    }

    if (hasValidRef(config)) {
      ref = config.ref;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    self = config.__self === undefined ? null : config.__self;
    source = config.__source === undefined ? null : config.__source;
    // Remaining properties are added to a new props object
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        props[propName] = config[propName];
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  // Resolve default props
  if (type && type.defaultProps) {
    var defaultProps = type.defaultProps;
    for (propName in defaultProps) {
      if (props[propName] === undefined) {
        props[propName] = defaultProps[propName];
      }
    }
  }
  if (process.env.NODE_ENV !== 'production') {
    if (key || ref) {
      if (typeof props.$$typeof === 'undefined' || props.$$typeof !== REACT_ELEMENT_TYPE) {
        var displayName = typeof type === 'function' ? type.displayName || type.name || 'Unknown' : type;
        if (key) {
          defineKeyPropWarningGetter(props, displayName);
        }
        if (ref) {
          defineRefPropWarningGetter(props, displayName);
        }
      }
    }
  }
  return ReactElement(type, key, ref, self, source, ReactCurrentOwner.current, props);
};

/**
 * Return a function that produces ReactElements of a given type.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.createfactory
 */
ReactElement.createFactory = function (type) {
  var factory = ReactElement.createElement.bind(null, type);
  // Expose the type on the factory and the prototype so that it can be
  // easily accessed on elements. E.g. `<Foo />.type === Foo`.
  // This should not be named `constructor` since this may not be the function
  // that created the element, and it may not even be a constructor.
  // Legacy hook TODO: Warn if this is accessed
  factory.type = type;
  return factory;
};

ReactElement.cloneAndReplaceKey = function (oldElement, newKey) {
  var newElement = ReactElement(oldElement.type, newKey, oldElement.ref, oldElement._self, oldElement._source, oldElement._owner, oldElement.props);

  return newElement;
};

/**
 * Clone and return a new ReactElement using element as the starting point.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.cloneelement
 */
ReactElement.cloneElement = function (element, config, children) {
  var propName;

  // Original props are copied
  var props = _assign({}, element.props);

  // Reserved names are extracted
  var key = element.key;
  var ref = element.ref;
  // Self is preserved since the owner is preserved.
  var self = element._self;
  // Source is preserved since cloneElement is unlikely to be targeted by a
  // transpiler, and the original source is probably a better indicator of the
  // true owner.
  var source = element._source;

  // Owner will be preserved, unless ref is overridden
  var owner = element._owner;

  if (config != null) {
    if (process.env.NODE_ENV !== 'production') {
      process.env.NODE_ENV !== 'production' ? warning(
      /* eslint-disable no-proto */
      config.__proto__ == null || config.__proto__ === Object.prototype,
      /* eslint-enable no-proto */
      'React.cloneElement(...): Expected props argument to be a plain object. ' + 'Properties defined in its prototype chain will be ignored.') : void 0;
    }

    if (hasValidRef(config)) {
      // Silently steal the ref from the parent.
      ref = config.ref;
      owner = ReactCurrentOwner.current;
    }
    if (hasValidKey(config)) {
      key = '' + config.key;
    }

    // Remaining properties override existing props
    var defaultProps;
    if (element.type && element.type.defaultProps) {
      defaultProps = element.type.defaultProps;
    }
    for (propName in config) {
      if (hasOwnProperty.call(config, propName) && !RESERVED_PROPS.hasOwnProperty(propName)) {
        if (config[propName] === undefined && defaultProps !== undefined) {
          // Resolve default props
          props[propName] = defaultProps[propName];
        } else {
          props[propName] = config[propName];
        }
      }
    }
  }

  // Children can be more than one argument, and those are transferred onto
  // the newly allocated props object.
  var childrenLength = arguments.length - 2;
  if (childrenLength === 1) {
    props.children = children;
  } else if (childrenLength > 1) {
    var childArray = Array(childrenLength);
    for (var i = 0; i < childrenLength; i++) {
      childArray[i] = arguments[i + 2];
    }
    props.children = childArray;
  }

  return ReactElement(element.type, key, ref, self, source, owner, props);
};

/**
 * Verifies the object is a ReactElement.
 * See https://facebook.github.io/react/docs/top-level-api.html#react.isvalidelement
 * @param {?object} object
 * @return {boolean} True if `object` is a valid component.
 * @final
 */
ReactElement.isValidElement = function (object) {
  return typeof object === 'object' && object !== null && object.$$typeof === REACT_ELEMENT_TYPE;
};

ReactElement.REACT_ELEMENT_TYPE = REACT_ELEMENT_TYPE;

module.exports = ReactElement;
}).call(this,require('_process'))

},{"./ReactCurrentOwner":11,"./canDefineProperty":22,"_process":1,"fbjs/lib/warning":33,"object-assign":3}],14:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactElementValidator
 */

/**
 * ReactElementValidator provides a wrapper around a element factory
 * which validates the props passed to the element. This is intended to be
 * used only in DEV and could be replaced by a static type checker for languages
 * that support it.
 */

'use strict';

var ReactCurrentOwner = require('./ReactCurrentOwner');
var ReactComponentTreeHook = require('./ReactComponentTreeHook');
var ReactElement = require('./ReactElement');
var ReactPropTypeLocations = require('./ReactPropTypeLocations');

var checkReactTypeSpec = require('./checkReactTypeSpec');

var canDefineProperty = require('./canDefineProperty');
var getIteratorFn = require('./getIteratorFn');
var warning = require('fbjs/lib/warning');

function getDeclarationErrorAddendum() {
  if (ReactCurrentOwner.current) {
    var name = ReactCurrentOwner.current.getName();
    if (name) {
      return ' Check the render method of `' + name + '`.';
    }
  }
  return '';
}

/**
 * Warn if there's no key explicitly set on dynamic arrays of children or
 * object keys are not valid. This allows us to keep track of children between
 * updates.
 */
var ownerHasKeyUseWarning = {};

function getCurrentComponentErrorInfo(parentType) {
  var info = getDeclarationErrorAddendum();

  if (!info) {
    var parentName = typeof parentType === 'string' ? parentType : parentType.displayName || parentType.name;
    if (parentName) {
      info = ' Check the top-level render call using <' + parentName + '>.';
    }
  }
  return info;
}

/**
 * Warn if the element doesn't have an explicit key assigned to it.
 * This element is in an array. The array could grow and shrink or be
 * reordered. All children that haven't already been validated are required to
 * have a "key" property assigned to it. Error statuses are cached so a warning
 * will only be shown once.
 *
 * @internal
 * @param {ReactElement} element Element that requires a key.
 * @param {*} parentType element's parent's type.
 */
function validateExplicitKey(element, parentType) {
  if (!element._store || element._store.validated || element.key != null) {
    return;
  }
  element._store.validated = true;

  var memoizer = ownerHasKeyUseWarning.uniqueKey || (ownerHasKeyUseWarning.uniqueKey = {});

  var currentComponentErrorInfo = getCurrentComponentErrorInfo(parentType);
  if (memoizer[currentComponentErrorInfo]) {
    return;
  }
  memoizer[currentComponentErrorInfo] = true;

  // Usually the current owner is the offender, but if it accepts children as a
  // property, it may be the creator of the child that's responsible for
  // assigning it a key.
  var childOwner = '';
  if (element && element._owner && element._owner !== ReactCurrentOwner.current) {
    // Give the component that originally created this child.
    childOwner = ' It was passed a child from ' + element._owner.getName() + '.';
  }

  process.env.NODE_ENV !== 'production' ? warning(false, 'Each child in an array or iterator should have a unique "key" prop.' + '%s%s See https://fb.me/react-warning-keys for more information.%s', currentComponentErrorInfo, childOwner, ReactComponentTreeHook.getCurrentStackAddendum(element)) : void 0;
}

/**
 * Ensure that every element either is passed in a static location, in an
 * array with an explicit keys property defined, or in an object literal
 * with valid key property.
 *
 * @internal
 * @param {ReactNode} node Statically passed child of any type.
 * @param {*} parentType node's parent's type.
 */
function validateChildKeys(node, parentType) {
  if (typeof node !== 'object') {
    return;
  }
  if (Array.isArray(node)) {
    for (var i = 0; i < node.length; i++) {
      var child = node[i];
      if (ReactElement.isValidElement(child)) {
        validateExplicitKey(child, parentType);
      }
    }
  } else if (ReactElement.isValidElement(node)) {
    // This element was passed in a valid location.
    if (node._store) {
      node._store.validated = true;
    }
  } else if (node) {
    var iteratorFn = getIteratorFn(node);
    // Entry iterators provide implicit keys.
    if (iteratorFn) {
      if (iteratorFn !== node.entries) {
        var iterator = iteratorFn.call(node);
        var step;
        while (!(step = iterator.next()).done) {
          if (ReactElement.isValidElement(step.value)) {
            validateExplicitKey(step.value, parentType);
          }
        }
      }
    }
  }
}

/**
 * Given an element, validate that its props follow the propTypes definition,
 * provided by the type.
 *
 * @param {ReactElement} element
 */
function validatePropTypes(element) {
  var componentClass = element.type;
  if (typeof componentClass !== 'function') {
    return;
  }
  var name = componentClass.displayName || componentClass.name;
  if (componentClass.propTypes) {
    checkReactTypeSpec(componentClass.propTypes, element.props, ReactPropTypeLocations.prop, name, element, null);
  }
  if (typeof componentClass.getDefaultProps === 'function') {
    process.env.NODE_ENV !== 'production' ? warning(componentClass.getDefaultProps.isReactClassApproved, 'getDefaultProps is only used on classic React.createClass ' + 'definitions. Use a static property named `defaultProps` instead.') : void 0;
  }
}

var ReactElementValidator = {

  createElement: function (type, props, children) {
    var validType = typeof type === 'string' || typeof type === 'function';
    // We warn in this case but don't throw. We expect the element creation to
    // succeed and there will likely be errors in render.
    if (!validType) {
      process.env.NODE_ENV !== 'production' ? warning(false, 'React.createElement: type should not be null, undefined, boolean, or ' + 'number. It should be a string (for DOM elements) or a ReactClass ' + '(for composite components).%s', getDeclarationErrorAddendum()) : void 0;
    }

    var element = ReactElement.createElement.apply(this, arguments);

    // The result can be nullish if a mock or a custom function is used.
    // TODO: Drop this when these are no longer allowed as the type argument.
    if (element == null) {
      return element;
    }

    // Skip key warning if the type isn't valid since our key validation logic
    // doesn't expect a non-string/function type and can throw confusing errors.
    // We don't want exception behavior to differ between dev and prod.
    // (Rendering will throw with a helpful message and as soon as the type is
    // fixed, the key warnings will appear.)
    if (validType) {
      for (var i = 2; i < arguments.length; i++) {
        validateChildKeys(arguments[i], type);
      }
    }

    validatePropTypes(element);

    return element;
  },

  createFactory: function (type) {
    var validatedFactory = ReactElementValidator.createElement.bind(null, type);
    // Legacy hook TODO: Warn if this is accessed
    validatedFactory.type = type;

    if (process.env.NODE_ENV !== 'production') {
      if (canDefineProperty) {
        Object.defineProperty(validatedFactory, 'type', {
          enumerable: false,
          get: function () {
            process.env.NODE_ENV !== 'production' ? warning(false, 'Factory.type is deprecated. Access the class directly ' + 'before passing it to createFactory.') : void 0;
            Object.defineProperty(this, 'type', {
              value: type
            });
            return type;
          }
        });
      }
    }

    return validatedFactory;
  },

  cloneElement: function (element, props, children) {
    var newElement = ReactElement.cloneElement.apply(this, arguments);
    for (var i = 2; i < arguments.length; i++) {
      validateChildKeys(arguments[i], newElement.type);
    }
    validatePropTypes(newElement);
    return newElement;
  }

};

module.exports = ReactElementValidator;
}).call(this,require('_process'))

},{"./ReactComponentTreeHook":10,"./ReactCurrentOwner":11,"./ReactElement":13,"./ReactPropTypeLocations":17,"./canDefineProperty":22,"./checkReactTypeSpec":23,"./getIteratorFn":24,"_process":1,"fbjs/lib/warning":33}],15:[function(require,module,exports){
(function (process){
/**
 * Copyright 2015-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactNoopUpdateQueue
 */

'use strict';

var warning = require('fbjs/lib/warning');

function warnNoop(publicInstance, callerName) {
  if (process.env.NODE_ENV !== 'production') {
    var constructor = publicInstance.constructor;
    process.env.NODE_ENV !== 'production' ? warning(false, '%s(...): Can only update a mounted or mounting component. ' + 'This usually means you called %s() on an unmounted component. ' + 'This is a no-op. Please check the code for the %s component.', callerName, callerName, constructor && (constructor.displayName || constructor.name) || 'ReactClass') : void 0;
  }
}

/**
 * This is the abstract API for an update queue.
 */
var ReactNoopUpdateQueue = {

  /**
   * Checks whether or not this composite component is mounted.
   * @param {ReactClass} publicInstance The instance we want to test.
   * @return {boolean} True if mounted, false otherwise.
   * @protected
   * @final
   */
  isMounted: function (publicInstance) {
    return false;
  },

  /**
   * Enqueue a callback that will be executed after all the pending updates
   * have processed.
   *
   * @param {ReactClass} publicInstance The instance to use as `this` context.
   * @param {?function} callback Called after state is updated.
   * @internal
   */
  enqueueCallback: function (publicInstance, callback) {},

  /**
   * Forces an update. This should only be invoked when it is known with
   * certainty that we are **not** in a DOM transaction.
   *
   * You may want to call this when you know that some deeper aspect of the
   * component's state has changed but `setState` was not called.
   *
   * This will not invoke `shouldComponentUpdate`, but it will invoke
   * `componentWillUpdate` and `componentDidUpdate`.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @internal
   */
  enqueueForceUpdate: function (publicInstance) {
    warnNoop(publicInstance, 'forceUpdate');
  },

  /**
   * Replaces all of the state. Always use this or `setState` to mutate state.
   * You should treat `this.state` as immutable.
   *
   * There is no guarantee that `this.state` will be immediately updated, so
   * accessing `this.state` after calling this method may return the old value.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} completeState Next state.
   * @internal
   */
  enqueueReplaceState: function (publicInstance, completeState) {
    warnNoop(publicInstance, 'replaceState');
  },

  /**
   * Sets a subset of the state. This only exists because _pendingState is
   * internal. This provides a merging strategy that is not available to deep
   * properties which is confusing. TODO: Expose pendingState or don't use it
   * during the merge.
   *
   * @param {ReactClass} publicInstance The instance that should rerender.
   * @param {object} partialState Next partial state to be merged with state.
   * @internal
   */
  enqueueSetState: function (publicInstance, partialState) {
    warnNoop(publicInstance, 'setState');
  }
};

module.exports = ReactNoopUpdateQueue;
}).call(this,require('_process'))

},{"_process":1,"fbjs/lib/warning":33}],16:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypeLocationNames
 */

'use strict';

var ReactPropTypeLocationNames = {};

if (process.env.NODE_ENV !== 'production') {
  ReactPropTypeLocationNames = {
    prop: 'prop',
    context: 'context',
    childContext: 'child context'
  };
}

module.exports = ReactPropTypeLocationNames;
}).call(this,require('_process'))

},{"_process":1}],17:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypeLocations
 */

'use strict';

var keyMirror = require('fbjs/lib/keyMirror');

var ReactPropTypeLocations = keyMirror({
  prop: null,
  context: null,
  childContext: null
});

module.exports = ReactPropTypeLocations;
},{"fbjs/lib/keyMirror":31}],18:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypes
 */

'use strict';

var ReactElement = require('./ReactElement');
var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactPropTypesSecret = require('./ReactPropTypesSecret');

var emptyFunction = require('fbjs/lib/emptyFunction');
var getIteratorFn = require('./getIteratorFn');
var warning = require('fbjs/lib/warning');

/**
 * Collection of methods that allow declaration and validation of props that are
 * supplied to React components. Example usage:
 *
 *   var Props = require('ReactPropTypes');
 *   var MyArticle = React.createClass({
 *     propTypes: {
 *       // An optional string prop named "description".
 *       description: Props.string,
 *
 *       // A required enum prop named "category".
 *       category: Props.oneOf(['News','Photos']).isRequired,
 *
 *       // A prop named "dialog" that requires an instance of Dialog.
 *       dialog: Props.instanceOf(Dialog).isRequired
 *     },
 *     render: function() { ... }
 *   });
 *
 * A more formal specification of how these methods are used:
 *
 *   type := array|bool|func|object|number|string|oneOf([...])|instanceOf(...)
 *   decl := ReactPropTypes.{type}(.isRequired)?
 *
 * Each and every declaration produces a function with the same signature. This
 * allows the creation of custom validation functions. For example:
 *
 *  var MyLink = React.createClass({
 *    propTypes: {
 *      // An optional string or URI prop named "href".
 *      href: function(props, propName, componentName) {
 *        var propValue = props[propName];
 *        if (propValue != null && typeof propValue !== 'string' &&
 *            !(propValue instanceof URI)) {
 *          return new Error(
 *            'Expected a string or an URI for ' + propName + ' in ' +
 *            componentName
 *          );
 *        }
 *      }
 *    },
 *    render: function() {...}
 *  });
 *
 * @internal
 */

var ANONYMOUS = '<<anonymous>>';

var ReactPropTypes = {
  array: createPrimitiveTypeChecker('array'),
  bool: createPrimitiveTypeChecker('boolean'),
  func: createPrimitiveTypeChecker('function'),
  number: createPrimitiveTypeChecker('number'),
  object: createPrimitiveTypeChecker('object'),
  string: createPrimitiveTypeChecker('string'),
  symbol: createPrimitiveTypeChecker('symbol'),

  any: createAnyTypeChecker(),
  arrayOf: createArrayOfTypeChecker,
  element: createElementTypeChecker(),
  instanceOf: createInstanceTypeChecker,
  node: createNodeChecker(),
  objectOf: createObjectOfTypeChecker,
  oneOf: createEnumTypeChecker,
  oneOfType: createUnionTypeChecker,
  shape: createShapeTypeChecker
};

/**
 * inlined Object.is polyfill to avoid requiring consumers ship their own
 * https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Object/is
 */
/*eslint-disable no-self-compare*/
function is(x, y) {
  // SameValue algorithm
  if (x === y) {
    // Steps 1-5, 7-10
    // Steps 6.b-6.e: +0 != -0
    return x !== 0 || 1 / x === 1 / y;
  } else {
    // Step 6.a: NaN == NaN
    return x !== x && y !== y;
  }
}
/*eslint-enable no-self-compare*/

/**
 * We use an Error-like object for backward compatibility as people may call
 * PropTypes directly and inspect their output. However we don't use real
 * Errors anymore. We don't inspect their stack anyway, and creating them
 * is prohibitively expensive if they are created too often, such as what
 * happens in oneOfType() for any type before the one that matched.
 */
function PropTypeError(message) {
  this.message = message;
  this.stack = '';
}
// Make `instanceof Error` still work for returned errors.
PropTypeError.prototype = Error.prototype;

function createChainableTypeChecker(validate) {
  if (process.env.NODE_ENV !== 'production') {
    var manualPropTypeCallCache = {};
  }
  function checkType(isRequired, props, propName, componentName, location, propFullName, secret) {
    componentName = componentName || ANONYMOUS;
    propFullName = propFullName || propName;
    if (process.env.NODE_ENV !== 'production') {
      if (secret !== ReactPropTypesSecret && typeof console !== 'undefined') {
        var cacheKey = componentName + ':' + propName;
        if (!manualPropTypeCallCache[cacheKey]) {
          process.env.NODE_ENV !== 'production' ? warning(false, 'You are manually calling a React.PropTypes validation ' + 'function for the `%s` prop on `%s`. This is deprecated ' + 'and will not work in the next major version. You may be ' + 'seeing this warning due to a third-party PropTypes library. ' + 'See https://fb.me/react-warning-dont-call-proptypes for details.', propFullName, componentName) : void 0;
          manualPropTypeCallCache[cacheKey] = true;
        }
      }
    }
    if (props[propName] == null) {
      var locationName = ReactPropTypeLocationNames[location];
      if (isRequired) {
        return new PropTypeError('Required ' + locationName + ' `' + propFullName + '` was not specified in ' + ('`' + componentName + '`.'));
      }
      return null;
    } else {
      return validate(props, propName, componentName, location, propFullName);
    }
  }

  var chainedCheckType = checkType.bind(null, false);
  chainedCheckType.isRequired = checkType.bind(null, true);

  return chainedCheckType;
}

function createPrimitiveTypeChecker(expectedType) {
  function validate(props, propName, componentName, location, propFullName, secret) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== expectedType) {
      var locationName = ReactPropTypeLocationNames[location];
      // `propValue` being instance of, say, date/regexp, pass the 'object'
      // check, but we can offer a more precise error message here rather than
      // 'of type `object`'.
      var preciseType = getPreciseType(propValue);

      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + preciseType + '` supplied to `' + componentName + '`, expected ') + ('`' + expectedType + '`.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createAnyTypeChecker() {
  return createChainableTypeChecker(emptyFunction.thatReturns(null));
}

function createArrayOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location, propFullName) {
    if (typeof typeChecker !== 'function') {
      return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside arrayOf.');
    }
    var propValue = props[propName];
    if (!Array.isArray(propValue)) {
      var locationName = ReactPropTypeLocationNames[location];
      var propType = getPropType(propValue);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an array.'));
    }
    for (var i = 0; i < propValue.length; i++) {
      var error = typeChecker(propValue, i, componentName, location, propFullName + '[' + i + ']', ReactPropTypesSecret);
      if (error instanceof Error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createElementTypeChecker() {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    if (!ReactElement.isValidElement(propValue)) {
      var locationName = ReactPropTypeLocationNames[location];
      var propType = getPropType(propValue);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected a single ReactElement.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createInstanceTypeChecker(expectedClass) {
  function validate(props, propName, componentName, location, propFullName) {
    if (!(props[propName] instanceof expectedClass)) {
      var locationName = ReactPropTypeLocationNames[location];
      var expectedClassName = expectedClass.name || ANONYMOUS;
      var actualClassName = getClassName(props[propName]);
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + actualClassName + '` supplied to `' + componentName + '`, expected ') + ('instance of `' + expectedClassName + '`.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createEnumTypeChecker(expectedValues) {
  if (!Array.isArray(expectedValues)) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOf, expected an instance of array.') : void 0;
    return emptyFunction.thatReturnsNull;
  }

  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    for (var i = 0; i < expectedValues.length; i++) {
      if (is(propValue, expectedValues[i])) {
        return null;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    var valuesString = JSON.stringify(expectedValues);
    return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of value `' + propValue + '` ' + ('supplied to `' + componentName + '`, expected one of ' + valuesString + '.'));
  }
  return createChainableTypeChecker(validate);
}

function createObjectOfTypeChecker(typeChecker) {
  function validate(props, propName, componentName, location, propFullName) {
    if (typeof typeChecker !== 'function') {
      return new PropTypeError('Property `' + propFullName + '` of component `' + componentName + '` has invalid PropType notation inside objectOf.');
    }
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type ' + ('`' + propType + '` supplied to `' + componentName + '`, expected an object.'));
    }
    for (var key in propValue) {
      if (propValue.hasOwnProperty(key)) {
        var error = typeChecker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
        if (error instanceof Error) {
          return error;
        }
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createUnionTypeChecker(arrayOfTypeCheckers) {
  if (!Array.isArray(arrayOfTypeCheckers)) {
    process.env.NODE_ENV !== 'production' ? warning(false, 'Invalid argument supplied to oneOfType, expected an instance of array.') : void 0;
    return emptyFunction.thatReturnsNull;
  }

  function validate(props, propName, componentName, location, propFullName) {
    for (var i = 0; i < arrayOfTypeCheckers.length; i++) {
      var checker = arrayOfTypeCheckers[i];
      if (checker(props, propName, componentName, location, propFullName, ReactPropTypesSecret) == null) {
        return null;
      }
    }

    var locationName = ReactPropTypeLocationNames[location];
    return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`.'));
  }
  return createChainableTypeChecker(validate);
}

function createNodeChecker() {
  function validate(props, propName, componentName, location, propFullName) {
    if (!isNode(props[propName])) {
      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` supplied to ' + ('`' + componentName + '`, expected a ReactNode.'));
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function createShapeTypeChecker(shapeTypes) {
  function validate(props, propName, componentName, location, propFullName) {
    var propValue = props[propName];
    var propType = getPropType(propValue);
    if (propType !== 'object') {
      var locationName = ReactPropTypeLocationNames[location];
      return new PropTypeError('Invalid ' + locationName + ' `' + propFullName + '` of type `' + propType + '` ' + ('supplied to `' + componentName + '`, expected `object`.'));
    }
    for (var key in shapeTypes) {
      var checker = shapeTypes[key];
      if (!checker) {
        continue;
      }
      var error = checker(propValue, key, componentName, location, propFullName + '.' + key, ReactPropTypesSecret);
      if (error) {
        return error;
      }
    }
    return null;
  }
  return createChainableTypeChecker(validate);
}

function isNode(propValue) {
  switch (typeof propValue) {
    case 'number':
    case 'string':
    case 'undefined':
      return true;
    case 'boolean':
      return !propValue;
    case 'object':
      if (Array.isArray(propValue)) {
        return propValue.every(isNode);
      }
      if (propValue === null || ReactElement.isValidElement(propValue)) {
        return true;
      }

      var iteratorFn = getIteratorFn(propValue);
      if (iteratorFn) {
        var iterator = iteratorFn.call(propValue);
        var step;
        if (iteratorFn !== propValue.entries) {
          while (!(step = iterator.next()).done) {
            if (!isNode(step.value)) {
              return false;
            }
          }
        } else {
          // Iterator will provide entry [k,v] tuples rather than values.
          while (!(step = iterator.next()).done) {
            var entry = step.value;
            if (entry) {
              if (!isNode(entry[1])) {
                return false;
              }
            }
          }
        }
      } else {
        return false;
      }

      return true;
    default:
      return false;
  }
}

function isSymbol(propType, propValue) {
  // Native Symbol.
  if (propType === 'symbol') {
    return true;
  }

  // 19.4.3.5 Symbol.prototype[@@toStringTag] === 'Symbol'
  if (propValue['@@toStringTag'] === 'Symbol') {
    return true;
  }

  // Fallback for non-spec compliant Symbols which are polyfilled.
  if (typeof Symbol === 'function' && propValue instanceof Symbol) {
    return true;
  }

  return false;
}

// Equivalent of `typeof` but with special handling for array and regexp.
function getPropType(propValue) {
  var propType = typeof propValue;
  if (Array.isArray(propValue)) {
    return 'array';
  }
  if (propValue instanceof RegExp) {
    // Old webkits (at least until Android 4.0) return 'function' rather than
    // 'object' for typeof a RegExp. We'll normalize this here so that /bla/
    // passes PropTypes.object.
    return 'object';
  }
  if (isSymbol(propType, propValue)) {
    return 'symbol';
  }
  return propType;
}

// This handles more types than `getPropType`. Only used for error messages.
// See `createPrimitiveTypeChecker`.
function getPreciseType(propValue) {
  var propType = getPropType(propValue);
  if (propType === 'object') {
    if (propValue instanceof Date) {
      return 'date';
    } else if (propValue instanceof RegExp) {
      return 'regexp';
    }
  }
  return propType;
}

// Returns class name of the object, if any.
function getClassName(propValue) {
  if (!propValue.constructor || !propValue.constructor.name) {
    return ANONYMOUS;
  }
  return propValue.constructor.name;
}

module.exports = ReactPropTypes;
}).call(this,require('_process'))

},{"./ReactElement":13,"./ReactPropTypeLocationNames":16,"./ReactPropTypesSecret":19,"./getIteratorFn":24,"_process":1,"fbjs/lib/emptyFunction":28,"fbjs/lib/warning":33}],19:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPropTypesSecret
 */

'use strict';

var ReactPropTypesSecret = 'SECRET_DO_NOT_PASS_THIS_OR_YOU_WILL_BE_FIRED';

module.exports = ReactPropTypesSecret;
},{}],20:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactPureComponent
 */

'use strict';

var _assign = require('object-assign');

var ReactComponent = require('./ReactComponent');
var ReactNoopUpdateQueue = require('./ReactNoopUpdateQueue');

var emptyObject = require('fbjs/lib/emptyObject');

/**
 * Base class helpers for the updating state of a component.
 */
function ReactPureComponent(props, context, updater) {
  // Duplicated from ReactComponent.
  this.props = props;
  this.context = context;
  this.refs = emptyObject;
  // We initialize the default updater but the real one gets injected by the
  // renderer.
  this.updater = updater || ReactNoopUpdateQueue;
}

function ComponentDummy() {}
ComponentDummy.prototype = ReactComponent.prototype;
ReactPureComponent.prototype = new ComponentDummy();
ReactPureComponent.prototype.constructor = ReactPureComponent;
// Avoid an extra prototype jump for these methods.
_assign(ReactPureComponent.prototype, ReactComponent.prototype);
ReactPureComponent.prototype.isPureReactComponent = true;

module.exports = ReactPureComponent;
},{"./ReactComponent":9,"./ReactNoopUpdateQueue":15,"fbjs/lib/emptyObject":29,"object-assign":3}],21:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule ReactVersion
 */

'use strict';

module.exports = '15.3.1';
},{}],22:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule canDefineProperty
 */

'use strict';

var canDefineProperty = false;
if (process.env.NODE_ENV !== 'production') {
  try {
    Object.defineProperty({}, 'x', { get: function () {} });
    canDefineProperty = true;
  } catch (x) {
    // IE will fail on defineProperty
  }
}

module.exports = canDefineProperty;
}).call(this,require('_process'))

},{"_process":1}],23:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule checkReactTypeSpec
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactPropTypeLocationNames = require('./ReactPropTypeLocationNames');
var ReactPropTypesSecret = require('./ReactPropTypesSecret');

var invariant = require('fbjs/lib/invariant');
var warning = require('fbjs/lib/warning');

var ReactComponentTreeHook;

if (typeof process !== 'undefined' && process.env && process.env.NODE_ENV === 'test') {
  // Temporary hack.
  // Inline requires don't work well with Jest:
  // https://github.com/facebook/react/issues/7240
  // Remove the inline requires when we don't need them anymore:
  // https://github.com/facebook/react/pull/7178
  ReactComponentTreeHook = require('./ReactComponentTreeHook');
}

var loggedTypeFailures = {};

/**
 * Assert that the values match with the type specs.
 * Error messages are memorized and will only be shown once.
 *
 * @param {object} typeSpecs Map of name to a ReactPropType
 * @param {object} values Runtime values that need to be type-checked
 * @param {string} location e.g. "prop", "context", "child context"
 * @param {string} componentName Name of the component for error messages.
 * @param {?object} element The React element that is being type-checked
 * @param {?number} debugID The React component instance that is being type-checked
 * @private
 */
function checkReactTypeSpec(typeSpecs, values, location, componentName, element, debugID) {
  for (var typeSpecName in typeSpecs) {
    if (typeSpecs.hasOwnProperty(typeSpecName)) {
      var error;
      // Prop type validation may throw. In case they do, we don't want to
      // fail the render phase where it didn't fail before. So we log it.
      // After these have been cleaned up, we'll let them throw.
      try {
        // This is intentionally an invariant that gets caught. It's the same
        // behavior as without this statement except with a better message.
        !(typeof typeSpecs[typeSpecName] === 'function') ? process.env.NODE_ENV !== 'production' ? invariant(false, '%s: %s type `%s` is invalid; it must be a function, usually from React.PropTypes.', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : _prodInvariant('84', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName) : void 0;
        error = typeSpecs[typeSpecName](values, typeSpecName, componentName, location, null, ReactPropTypesSecret);
      } catch (ex) {
        error = ex;
      }
      process.env.NODE_ENV !== 'production' ? warning(!error || error instanceof Error, '%s: type specification of %s `%s` is invalid; the type checker ' + 'function must return `null` or an `Error` but returned a %s. ' + 'You may have forgotten to pass an argument to the type checker ' + 'creator (arrayOf, instanceOf, objectOf, oneOf, oneOfType, and ' + 'shape all require an argument).', componentName || 'React class', ReactPropTypeLocationNames[location], typeSpecName, typeof error) : void 0;
      if (error instanceof Error && !(error.message in loggedTypeFailures)) {
        // Only monitor this failure once because there tends to be a lot of the
        // same error.
        loggedTypeFailures[error.message] = true;

        var componentStackInfo = '';

        if (process.env.NODE_ENV !== 'production') {
          if (!ReactComponentTreeHook) {
            ReactComponentTreeHook = require('./ReactComponentTreeHook');
          }
          if (debugID !== null) {
            componentStackInfo = ReactComponentTreeHook.getStackAddendumByID(debugID);
          } else if (element !== null) {
            componentStackInfo = ReactComponentTreeHook.getCurrentStackAddendum(element);
          }
        }

        process.env.NODE_ENV !== 'production' ? warning(false, 'Failed %s type: %s%s', location, error.message, componentStackInfo) : void 0;
      }
    }
  }
}

module.exports = checkReactTypeSpec;
}).call(this,require('_process'))

},{"./ReactComponentTreeHook":10,"./ReactPropTypeLocationNames":16,"./ReactPropTypesSecret":19,"./reactProdInvariant":26,"_process":1,"fbjs/lib/invariant":30,"fbjs/lib/warning":33}],24:[function(require,module,exports){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule getIteratorFn
 * 
 */

'use strict';

/* global Symbol */

var ITERATOR_SYMBOL = typeof Symbol === 'function' && Symbol.iterator;
var FAUX_ITERATOR_SYMBOL = '@@iterator'; // Before Symbol spec.

/**
 * Returns the iterator method function contained on the iterable object.
 *
 * Be sure to invoke the function with the iterable as context:
 *
 *     var iteratorFn = getIteratorFn(myIterable);
 *     if (iteratorFn) {
 *       var iterator = iteratorFn.call(myIterable);
 *       ...
 *     }
 *
 * @param {?object} maybeIterable
 * @return {?function}
 */
function getIteratorFn(maybeIterable) {
  var iteratorFn = maybeIterable && (ITERATOR_SYMBOL && maybeIterable[ITERATOR_SYMBOL] || maybeIterable[FAUX_ITERATOR_SYMBOL]);
  if (typeof iteratorFn === 'function') {
    return iteratorFn;
  }
}

module.exports = getIteratorFn;
},{}],25:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule onlyChild
 */
'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactElement = require('./ReactElement');

var invariant = require('fbjs/lib/invariant');

/**
 * Returns the first child in a collection of children and verifies that there
 * is only one child in the collection.
 *
 * See https://facebook.github.io/react/docs/top-level-api.html#react.children.only
 *
 * The current implementation of this function assumes that a single child gets
 * passed without a wrapper, but the purpose of this helper function is to
 * abstract away the particular structure of children.
 *
 * @param {?object} children Child collection structure.
 * @return {ReactElement} The first and only `ReactElement` contained in the
 * structure.
 */
function onlyChild(children) {
  !ReactElement.isValidElement(children) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'React.Children.only expected to receive a single React element child.') : _prodInvariant('143') : void 0;
  return children;
}

module.exports = onlyChild;
}).call(this,require('_process'))

},{"./ReactElement":13,"./reactProdInvariant":26,"_process":1,"fbjs/lib/invariant":30}],26:[function(require,module,exports){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule reactProdInvariant
 * 
 */
'use strict';

/**
 * WARNING: DO NOT manually require this module.
 * This is a replacement for `invariant(...)` used by the error code system
 * and will _only_ be required by the corresponding babel pass.
 * It always throws.
 */

function reactProdInvariant(code) {
  var argCount = arguments.length - 1;

  var message = 'Minified React error #' + code + '; visit ' + 'http://facebook.github.io/react/docs/error-decoder.html?invariant=' + code;

  for (var argIdx = 0; argIdx < argCount; argIdx++) {
    message += '&args[]=' + encodeURIComponent(arguments[argIdx + 1]);
  }

  message += ' for the full message or use the non-minified dev environment' + ' for full errors and additional helpful warnings.';

  var error = new Error(message);
  error.name = 'Invariant Violation';
  error.framesToPop = 1; // we don't care about reactProdInvariant's own frame

  throw error;
}

module.exports = reactProdInvariant;
},{}],27:[function(require,module,exports){
(function (process){
/**
 * Copyright 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @providesModule traverseAllChildren
 */

'use strict';

var _prodInvariant = require('./reactProdInvariant');

var ReactCurrentOwner = require('./ReactCurrentOwner');
var ReactElement = require('./ReactElement');

var getIteratorFn = require('./getIteratorFn');
var invariant = require('fbjs/lib/invariant');
var KeyEscapeUtils = require('./KeyEscapeUtils');
var warning = require('fbjs/lib/warning');

var SEPARATOR = '.';
var SUBSEPARATOR = ':';

/**
 * TODO: Test that a single child and an array with one item have the same key
 * pattern.
 */

var didWarnAboutMaps = false;

/**
 * Generate a key string that identifies a component within a set.
 *
 * @param {*} component A component that could contain a manual key.
 * @param {number} index Index that is used if a manual key is not provided.
 * @return {string}
 */
function getComponentKey(component, index) {
  // Do some typechecking here since we call this blindly. We want to ensure
  // that we don't block potential future ES APIs.
  if (component && typeof component === 'object' && component.key != null) {
    // Explicit key
    return KeyEscapeUtils.escape(component.key);
  }
  // Implicit key determined by the index in the set
  return index.toString(36);
}

/**
 * @param {?*} children Children tree container.
 * @param {!string} nameSoFar Name of the key path so far.
 * @param {!function} callback Callback to invoke with each child found.
 * @param {?*} traverseContext Used to pass information throughout the traversal
 * process.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildrenImpl(children, nameSoFar, callback, traverseContext) {
  var type = typeof children;

  if (type === 'undefined' || type === 'boolean') {
    // All of the above are perceived as null.
    children = null;
  }

  if (children === null || type === 'string' || type === 'number' || ReactElement.isValidElement(children)) {
    callback(traverseContext, children,
    // If it's the only child, treat the name as if it was wrapped in an array
    // so that it's consistent if the number of children grows.
    nameSoFar === '' ? SEPARATOR + getComponentKey(children, 0) : nameSoFar);
    return 1;
  }

  var child;
  var nextName;
  var subtreeCount = 0; // Count of children found in the current subtree.
  var nextNamePrefix = nameSoFar === '' ? SEPARATOR : nameSoFar + SUBSEPARATOR;

  if (Array.isArray(children)) {
    for (var i = 0; i < children.length; i++) {
      child = children[i];
      nextName = nextNamePrefix + getComponentKey(child, i);
      subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
    }
  } else {
    var iteratorFn = getIteratorFn(children);
    if (iteratorFn) {
      var iterator = iteratorFn.call(children);
      var step;
      if (iteratorFn !== children.entries) {
        var ii = 0;
        while (!(step = iterator.next()).done) {
          child = step.value;
          nextName = nextNamePrefix + getComponentKey(child, ii++);
          subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
        }
      } else {
        if (process.env.NODE_ENV !== 'production') {
          var mapsAsChildrenAddendum = '';
          if (ReactCurrentOwner.current) {
            var mapsAsChildrenOwnerName = ReactCurrentOwner.current.getName();
            if (mapsAsChildrenOwnerName) {
              mapsAsChildrenAddendum = ' Check the render method of `' + mapsAsChildrenOwnerName + '`.';
            }
          }
          process.env.NODE_ENV !== 'production' ? warning(didWarnAboutMaps, 'Using Maps as children is not yet fully supported. It is an ' + 'experimental feature that might be removed. Convert it to a ' + 'sequence / iterable of keyed ReactElements instead.%s', mapsAsChildrenAddendum) : void 0;
          didWarnAboutMaps = true;
        }
        // Iterator will provide entry [k,v] tuples rather than values.
        while (!(step = iterator.next()).done) {
          var entry = step.value;
          if (entry) {
            child = entry[1];
            nextName = nextNamePrefix + KeyEscapeUtils.escape(entry[0]) + SUBSEPARATOR + getComponentKey(child, 0);
            subtreeCount += traverseAllChildrenImpl(child, nextName, callback, traverseContext);
          }
        }
      }
    } else if (type === 'object') {
      var addendum = '';
      if (process.env.NODE_ENV !== 'production') {
        addendum = ' If you meant to render a collection of children, use an array ' + 'instead or wrap the object using createFragment(object) from the ' + 'React add-ons.';
        if (children._isReactElement) {
          addendum = ' It looks like you\'re using an element created by a different ' + 'version of React. Make sure to use only one copy of React.';
        }
        if (ReactCurrentOwner.current) {
          var name = ReactCurrentOwner.current.getName();
          if (name) {
            addendum += ' Check the render method of `' + name + '`.';
          }
        }
      }
      var childrenString = String(children);
      !false ? process.env.NODE_ENV !== 'production' ? invariant(false, 'Objects are not valid as a React child (found: %s).%s', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : _prodInvariant('31', childrenString === '[object Object]' ? 'object with keys {' + Object.keys(children).join(', ') + '}' : childrenString, addendum) : void 0;
    }
  }

  return subtreeCount;
}

/**
 * Traverses children that are typically specified as `props.children`, but
 * might also be specified through attributes:
 *
 * - `traverseAllChildren(this.props.children, ...)`
 * - `traverseAllChildren(this.props.leftPanelChildren, ...)`
 *
 * The `traverseContext` is an optional argument that is passed through the
 * entire traversal. It can be used to store accumulations or anything else that
 * the callback might find relevant.
 *
 * @param {?*} children Children tree object.
 * @param {!function} callback To invoke upon traversing each child.
 * @param {?*} traverseContext Context for traversal.
 * @return {!number} The number of children in this subtree.
 */
function traverseAllChildren(children, callback, traverseContext) {
  if (children == null) {
    return 0;
  }

  return traverseAllChildrenImpl(children, '', callback, traverseContext);
}

module.exports = traverseAllChildren;
}).call(this,require('_process'))

},{"./KeyEscapeUtils":4,"./ReactCurrentOwner":11,"./ReactElement":13,"./getIteratorFn":24,"./reactProdInvariant":26,"_process":1,"fbjs/lib/invariant":30,"fbjs/lib/warning":33}],28:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * 
 */

function makeEmptyFunction(arg) {
  return function () {
    return arg;
  };
}

/**
 * This function accepts and discards inputs; it has no side effects. This is
 * primarily useful idiomatically for overridable function endpoints which
 * always need to be callable, since JS lacks a null-call idiom ala Cocoa.
 */
var emptyFunction = function emptyFunction() {};

emptyFunction.thatReturns = makeEmptyFunction;
emptyFunction.thatReturnsFalse = makeEmptyFunction(false);
emptyFunction.thatReturnsTrue = makeEmptyFunction(true);
emptyFunction.thatReturnsNull = makeEmptyFunction(null);
emptyFunction.thatReturnsThis = function () {
  return this;
};
emptyFunction.thatReturnsArgument = function (arg) {
  return arg;
};

module.exports = emptyFunction;
},{}],29:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var emptyObject = {};

if (process.env.NODE_ENV !== 'production') {
  Object.freeze(emptyObject);
}

module.exports = emptyObject;
}).call(this,require('_process'))

},{"_process":1}],30:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

/**
 * Use invariant() to assert state which your program assumes to be true.
 *
 * Provide sprintf-style format (only %s is supported) and arguments
 * to provide information about what broke and what you were
 * expecting.
 *
 * The invariant message will be stripped in production, but the invariant
 * will remain to ensure logic does not differ in production.
 */

function invariant(condition, format, a, b, c, d, e, f) {
  if (process.env.NODE_ENV !== 'production') {
    if (format === undefined) {
      throw new Error('invariant requires an error message argument');
    }
  }

  if (!condition) {
    var error;
    if (format === undefined) {
      error = new Error('Minified exception occurred; use the non-minified dev environment ' + 'for the full error message and additional helpful warnings.');
    } else {
      var args = [a, b, c, d, e, f];
      var argIndex = 0;
      error = new Error(format.replace(/%s/g, function () {
        return args[argIndex++];
      }));
      error.name = 'Invariant Violation';
    }

    error.framesToPop = 1; // we don't care about invariant's own frame
    throw error;
  }
}

module.exports = invariant;
}).call(this,require('_process'))

},{"_process":1}],31:[function(require,module,exports){
(function (process){
/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 * @typechecks static-only
 */

'use strict';

var invariant = require('./invariant');

/**
 * Constructs an enumeration with keys equal to their value.
 *
 * For example:
 *
 *   var COLORS = keyMirror({blue: null, red: null});
 *   var myColor = COLORS.blue;
 *   var isColorValid = !!COLORS[myColor];
 *
 * The last line could not be performed if the values of the generated enum were
 * not equal to their keys.
 *
 *   Input:  {key1: val1, key2: val2}
 *   Output: {key1: key1, key2: key2}
 *
 * @param {object} obj
 * @return {object}
 */
var keyMirror = function keyMirror(obj) {
  var ret = {};
  var key;
  !(obj instanceof Object && !Array.isArray(obj)) ? process.env.NODE_ENV !== 'production' ? invariant(false, 'keyMirror(...): Argument must be an object.') : invariant(false) : void 0;
  for (key in obj) {
    if (!obj.hasOwnProperty(key)) {
      continue;
    }
    ret[key] = key;
  }
  return ret;
};

module.exports = keyMirror;
}).call(this,require('_process'))

},{"./invariant":30,"_process":1}],32:[function(require,module,exports){
"use strict";

/**
 * Copyright (c) 2013-present, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

/**
 * Allows extraction of a minified key. Let's the build system minify keys
 * without losing the ability to dynamically use key strings as values
 * themselves. Pass in an object with a single key/val pair and it will return
 * you the string key of that single record. Suppose you want to grab the
 * value for a key 'className' inside of an object. Key/val minification may
 * have aliased that key to be 'xa12'. keyOf({className: null}) will return
 * 'xa12' in that case. Resolve keys you want to use once at startup time, then
 * reuse those resolutions.
 */
var keyOf = function keyOf(oneKeyObj) {
  var key;
  for (key in oneKeyObj) {
    if (!oneKeyObj.hasOwnProperty(key)) {
      continue;
    }
    return key;
  }
  return null;
};

module.exports = keyOf;
},{}],33:[function(require,module,exports){
(function (process){
/**
 * Copyright 2014-2015, Facebook, Inc.
 * All rights reserved.
 *
 * This source code is licensed under the BSD-style license found in the
 * LICENSE file in the root directory of this source tree. An additional grant
 * of patent rights can be found in the PATENTS file in the same directory.
 *
 */

'use strict';

var emptyFunction = require('./emptyFunction');

/**
 * Similar to invariant but only logs a warning if the condition is not met.
 * This can be used to log issues in development environments in critical
 * paths. Removing the logging code for production environments will keep the
 * same logic and follow the same code paths.
 */

var warning = emptyFunction;

if (process.env.NODE_ENV !== 'production') {
  (function () {
    var printWarning = function printWarning(format) {
      for (var _len = arguments.length, args = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
        args[_key - 1] = arguments[_key];
      }

      var argIndex = 0;
      var message = 'Warning: ' + format.replace(/%s/g, function () {
        return args[argIndex++];
      });
      if (typeof console !== 'undefined') {
        console.error(message);
      }
      try {
        // --- Welcome to debugging React ---
        // This error was thrown as a convenience so that you can use this stack
        // to find the callsite that caused this warning to fire.
        throw new Error(message);
      } catch (x) {}
    };

    warning = function warning(condition, format) {
      if (format === undefined) {
        throw new Error('`warning(condition, format, ...args)` requires a warning ' + 'message argument');
      }

      if (format.indexOf('Failed Composite propType: ') === 0) {
        return; // Ignore CompositeComponent proptype check.
      }

      if (!condition) {
        for (var _len2 = arguments.length, args = Array(_len2 > 2 ? _len2 - 2 : 0), _key2 = 2; _key2 < _len2; _key2++) {
          args[_key2 - 2] = arguments[_key2];
        }

        printWarning.apply(undefined, [format].concat(args));
      }
    };
  })();
}

module.exports = warning;
}).call(this,require('_process'))

},{"./emptyFunction":28,"_process":1}],34:[function(require,module,exports){
'use strict';

module.exports = require('./lib/React');

},{"./lib/React":6}],35:[function(require,module,exports){
'use strict';

module.exports = require('./src/Puf');

},{"./src/Puf":36}],36:[function(require,module,exports){
/**
 * React Puf Bundle
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/08
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 */
'use strict';

// components
// Elements

var Alert = require('./components/Alert');
var Modal = require('./components/Modal').Modal;
var ModalHeader = require('./components/Modal').ModalHeader;
var ModalBody = require('./components/Modal').ModalBody;
var ModalFooter = require('./components/Modal').ModalFooter;
var Panel = require('./components/Panel').Panel;
var PanelHeader = require('./components/Panel').PanelHeader;
var PanelBody = require('./components/Panel').PanelBody;
var PanelFooter = require('./components/Panel').PanelFooter;
var HiddenContent = require('./components/HiddenContent');
var MainFrameSplitter = require('./components/MainFrameSplitter');

// Form Elements
var Checkbox = require('./components/Checkbox').Checkbox;
var HCheckbox = require('./components/Checkbox').HCheckbox;
var RadioGroup = require('./components/radio/RadioGroup');
var Radio = require('./components/radio/Radio');
var Fieldset = require('./components/Fieldset');

// Etc Elements
//var TabSet = require('./components/tabs/TabSet');
//var Tabs = require('./components/tabs/Tabs');
//var Tab = require('./components/tabs/Tab');
//var TabContents = require('./components/tabs/TabContents');
//var TabContent = require('./components/tabs/TabContent');

// Kendo
var TreeView = require('./kendo/TreeView');
var Grid = require('./kendo/Grid');
var DropDownList = require('./kendo/DropDownList');
var DatePicker = require('./kendo/DatePicker');
var DateRangePicker = require('./kendo/DateRangePicker');
var TabStrip = require('./kendo/tabstrip/TabStrip');
var Tabs = require('./kendo/tabstrip/Tabs');
var Tab = require('./kendo/tabstrip/Tab');
var TabContent = require('./kendo/tabstrip/TabContent');
var PanelBar = require('./kendo/PanelBar');
var MultiSelect = require('./kendo/MultiSelect');
var NumericTextBox = require('./kendo/NumericTextBox');
var ProgressBar = require('./kendo/ProgressBar');
var Window = require('./kendo/Window');
var AutoComplete = require('./kendo/AutoComplete');

// Services
var Util = require('./services/Util');
var DateUtil = require('./services/DateUtil');
var NumberUtil = require('./services/NumberUtil');
var RegExp = require('./services/RegExp');
var Resource = require('./services/Resource');

var Puf = {
    // Elements
    Alert: Alert,
    Modal: Modal,
    ModalHeader: ModalHeader,
    ModalBody: ModalBody,
    ModalFooter: ModalFooter,
    Panel: Panel,
    PanelHeader: PanelHeader,
    PanelBody: PanelBody,
    PanelFooter: PanelFooter,
    HiddenContent: HiddenContent,
    MainFrameSplitter: MainFrameSplitter,

    // Form Elements
    Checkbox: Checkbox,
    HCheckbox: HCheckbox,
    RadioGroup: RadioGroup,
    Radio: Radio,
    Fieldset: Fieldset,

    // Etc Elements
    //TabSet: TabSet,
    //Tabs: Tabs,
    //Tab: Tab,
    //TabContents: TabContents,
    //TabContent: TabContent,

    // Kendo
    TreeView: TreeView,
    Grid: Grid,
    DropDownList: DropDownList,
    DatePicker: DatePicker,
    DateRangePicker: DateRangePicker,
    TabStrip: TabStrip,
    Tabs: Tabs,
    Tab: Tab,
    TabContent: TabContent,
    PanelBar: PanelBar.PanelBar,
    PanelBarPane: PanelBar.PanelBarPane,
    MultiSelect: MultiSelect,
    NumericTextBox: NumericTextBox,
    ProgressBar: ProgressBar,
    Window: Window,
    AutoComplete: AutoComplete,

    // Services
    Util: Util,
    DateUtil: DateUtil,
    NumberUtil: NumberUtil,
    RegExp: RegExp,
    Resource: Resource
};

module.exports = Puf;

},{"./components/Alert":37,"./components/Checkbox":38,"./components/Fieldset":39,"./components/HiddenContent":40,"./components/MainFrameSplitter":41,"./components/Modal":42,"./components/Panel":43,"./components/radio/Radio":44,"./components/radio/RadioGroup":45,"./kendo/AutoComplete":46,"./kendo/DatePicker":47,"./kendo/DateRangePicker":48,"./kendo/DropDownList":49,"./kendo/Grid":50,"./kendo/MultiSelect":51,"./kendo/NumericTextBox":52,"./kendo/PanelBar":53,"./kendo/ProgressBar":54,"./kendo/TreeView":55,"./kendo/Window":56,"./kendo/tabstrip/Tab":57,"./kendo/tabstrip/TabContent":58,"./kendo/tabstrip/TabStrip":59,"./kendo/tabstrip/Tabs":60,"./services/DateUtil":61,"./services/NumberUtil":62,"./services/RegExp":63,"./services/Resource":64,"./services/Util":65}],37:[function(require,module,exports){
/**
 * Alert component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/24
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.Alert ref="alert" title="타이틀" message="메시지" onOk={this.onOk} />
 * <Pum.Alert ref="confirm" type="confirm" title="타이틀" message="메시지" onOk={this.onConfirm} onCancel={this.onCancel}/>
 *
 * bootstrap component
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var Alert = React.createClass({
    displayName: 'Alert',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        type: PropTypes.string, // null/confirm (default: null)
        title: PropTypes.string,
        titleIconClassName: PropTypes.string,
        message: PropTypes.string,
        okLabel: PropTypes.string,
        cancelLabel: PropTypes.string,
        okClassName: PropTypes.string,
        cancelClassName: PropTypes.string,
        onOk: PropTypes.func,
        onCancel: PropTypes.func,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },
    id: '',
    show: function show(okFunc, cancelFunc) {
        var alert = $('#' + this.id);
        alert.modal('show');

        this.okFunc = okFunc;
        this.cancelFunc = cancelFunc;
    },
    hide: function hide() {
        var alert = $('#' + this.id);
        alert.modal('hide');
    },
    setMessage: function setMessage(message) {
        if (typeof message === 'string') {
            this.setState({ message: message });
        }
    },
    onOk: function onOk(event) {
        // custom event emit 에 대해서 연구 필요
        this.hide();

        // okFunc
        if (typeof this.okFunc === 'function') {
            this.okFunc();
        }

        // onOk
        if (typeof this.props.onOk === 'function') {
            this.props.onOk();
        }
    },
    onCancel: function onCancel(event) {
        // custom event emit 에 대해서 연구 필요
        this.hide();

        // cancelFunc
        if (typeof this.cancelFunc === 'function') {
            this.cancelFunc();
        }

        // onCancel
        if (typeof this.props.onCancel === 'function') {
            this.props.onCancel();
        }
    },
    getDefaultProps: function getDefaultProps() {
        return { title: 'Title', okLabel: $ps_locale.confirm, cancelLabel: $ps_locale.cancel };
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        var _props = this.props;
        var title = _props.title;
        var message = _props.message;

        return { title: title, message: message };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        this.setState({ title: nextProps.title, message: nextProps.message });
    },
    render: function render() {
        // 필수 항목
        var _props2 = this.props;
        var className = _props2.className;
        var type = _props2.type;
        var okLabel = _props2.okLabel;
        var cancelLabel = _props2.cancelLabel;
        var okClassName = _props2.okClassName;
        var cancelClassName = _props2.cancelClassName;
        var titleIconClassName = _props2.titleIconClassName;
        var width = _props2.width;


        var cancelButton;
        if (type === 'confirm') {
            cancelButton = React.createElement(
                'button',
                { type: 'button', className: classNames('btn', 'btn-cancel', cancelClassName), onClick: this.onCancel, 'data-dismiss': 'modal' },
                cancelLabel
            );
        }

        return React.createElement(
            'div',
            { id: this.id, className: classNames('modal', 'modal-alert', className), role: 'dialog', 'aria-labelledby': '', 'aria-hidden': 'true', 'data-backdrop': 'static', 'data-keyboard': 'false' },
            React.createElement(
                'div',
                { className: 'modal-dialog modal-sm', style: { width: width } },
                React.createElement(
                    'div',
                    { className: 'modal-content' },
                    React.createElement(
                        'div',
                        { className: 'modal-header' },
                        React.createElement('span', { className: classNames('title-icon', titleIconClassName) }),
                        React.createElement(
                            'span',
                            { className: 'modal-title' },
                            this.state.title
                        )
                    ),
                    React.createElement(
                        'div',
                        { className: 'modal-body' },
                        this.state.message
                    ),
                    React.createElement(
                        'div',
                        { className: 'modal-footer' },
                        React.createElement(
                            'button',
                            { type: 'button', className: classNames('btn', 'btn-ok', okClassName), onClick: this.onOk },
                            okLabel
                        ),
                        cancelButton
                    )
                )
            )
        );
    }
});

module.exports = Alert;

},{"../services/Util":65,"classnames":2,"react":34}],38:[function(require,module,exports){
/**
 * CheckBox component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/14
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.CheckBox name="name1" value="value1" onChange={this.onChange} checked={true}> 체크박스</Pum.CheckBox>
 *
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var Checkbox = React.createClass({
    displayName: 'Checkbox',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.string,
        checked: PropTypes.bool,
        onChange: PropTypes.func
    },
    onChange: function onChange(event) {
        //console.log(event);
        var checked = !this.state.checked;
        //console.log(checked);
        this.setState({ checked: checked });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(event, checked);
        }
    },
    setValue: function setValue() {
        var checked = this.state.checked,
            $checkbox = $('input:checkbox[name="' + this.props.name + '"]');
        if (typeof this.props.value === 'undefined') {
            // true/false 설정
            $checkbox.val(checked);
        } else {
            if (checked === true) {
                $checkbox.val(this.props.value);
            } else {
                $checkbox.val(null);
            }
        }
    },
    setStateObject: function setStateObject(props) {
        //let value = props.value;
        //if(typeof value === 'undefined') {
        //    value = null;
        //}

        var checked = props.checked;
        if (typeof checked === 'undefined') {
            checked = false;
        }

        return {
            //value: value,
            checked: checked
        };
    },
    getInitialState: function getInitialState() {
        return this.setStateObject(this.props);
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.setValue();
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        this.setState(this.setStateObject(nextProps));
    },
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        // 컴포넌트의 업데이트가 DOM에 반영된 직후에 호출(최초 렌더링 시에는 호출되지 않음)
        //console.log(prevProps);
        //console.log(prevState);
        //console.log(this.state);
        this.setValue();
    },
    render: function render() {
        // 필수 항목
        var _props = this.props;
        var className = _props.className;
        var name = _props.name;
        var children = _props.children;

        return React.createElement(
            'div',
            { className: 'checkbox' },
            React.createElement(
                'label',
                null,
                React.createElement('input', { type: 'checkbox', className: className, name: name, checked: this.state.checked,
                    onChange: this.onChange }),
                React.createElement(
                    'span',
                    { className: 'lbl' },
                    children
                )
            )
        );
    }
});

var HCheckbox = React.createClass({
    displayName: 'HCheckbox',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        name: PropTypes.string,
        value: PropTypes.string,
        checked: PropTypes.bool,
        onChange: PropTypes.func
    },
    onChange: function onChange(event) {
        //console.log(event);
        var checked = !this.state.checked;
        //console.log(checked);
        this.setState({ checked: checked });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(event, checked);
        }
    },
    setValue: function setValue() {
        var checked = this.state.checked,
            $checkbox = $('input:checkbox[name="' + this.props.name + '"]');
        if (typeof this.props.value === 'undefined') {
            // true/false 설정
            $checkbox.val(checked);
        } else {
            if (checked === true) {
                $checkbox.val(this.props.value);
            } else {
                $checkbox.val(null);
            }
        }
    },
    setStateObject: function setStateObject(props) {
        //let value = props.value;
        //if(typeof value === 'undefined') {
        //    value = null;
        //}

        var checked = props.checked;
        if (typeof checked === 'undefined') {
            checked = false;
        }

        return {
            //value: value,
            checked: checked
        };
    },
    getInitialState: function getInitialState() {
        return this.setStateObject(this.props);
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.setValue();
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        this.setState(this.setStateObject(nextProps));
    },
    componentDidUpdate: function componentDidUpdate(prevProps, prevState) {
        // 컴포넌트의 업데이트가 DOM에 반영된 직후에 호출(최초 렌더링 시에는 호출되지 않음)
        //console.log(prevProps);
        //console.log(prevState);
        //console.log(this.state);
        this.setValue();
    },
    render: function render() {
        // 필수 항목
        var _props2 = this.props;
        var className = _props2.className;
        var name = _props2.name;
        var children = _props2.children;

        return React.createElement(
            'label',
            { className: 'checkbox-inline' },
            React.createElement('input', { type: 'checkbox', className: className, name: name, checked: this.state.checked,
                onChange: this.onChange }),
            React.createElement(
                'span',
                { className: 'lbl' },
                children
            )
        );
    }
});

module.exports = {
    Checkbox: Checkbox,
    HCheckbox: HCheckbox
};

},{"../services/Util":65,"classnames":2,"react":34}],39:[function(require,module,exports){
/**
 * Fieldset component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/30
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.Fieldset />
 *
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var Fieldset = React.createClass({
    displayName: 'Fieldset',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        legend: PropTypes.string,
        expand: PropTypes.bool,
        collapsible: PropTypes.bool,
        onToggle: PropTypes.func,
        onInit: PropTypes.func
    },
    id: '',
    toggle: function toggle(props) {
        if (this.props.collapsible === true) {
            if (typeof props.expand !== 'undefined') {
                this.setState({ expand: props.expand });
            } else {
                this.setState({ expand: true });
            }
        }
    },
    onToggle: function onToggle(event) {
        var expand = !this.state.expand;
        this.toggle({ expand: expand });

        if (typeof this.props.onToggle === 'function') {
            this.props.onToggle(expand);
        }
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { legend: 'Title', collapsible: true, expand: true };
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        return { expand: this.props.expand };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        if (typeof this.props.onInit === 'function') {
            var data = {};
            data.expand = this.state.expand;
            this.props.onInit(data);
        }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        this.toggle(nextProps);
    },
    render: function render() {
        // 필수 항목
        var _props = this.props;
        var className = _props.className;
        var legend = _props.legend;
        var collapsible = _props.collapsible;


        var display,
            collapsed = false;
        if (this.state.expand === true) {
            display = 'block';
        } else {
            display = 'none';
            if (collapsible === true) {
                collapsed = true;
            }
        }

        return React.createElement(
            'fieldset',
            { className: classNames('fieldset', className, { collapsible: collapsible, collapsed: collapsed }) },
            React.createElement(
                'legend',
                { onClick: this.onToggle, name: this.id },
                ' ',
                legend
            ),
            React.createElement(
                'div',
                { style: { display: display } },
                React.createElement(
                    'div',
                    { id: this.id },
                    this.props.children
                )
            )
        );
    }
});

module.exports = Fieldset;

},{"../services/Util":65,"classnames":2,"react":34}],40:[function(require,module,exports){
/**
 * HiddenContent component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/10
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.HiddenContent id={id} />
 *
 */
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

//var React = require('react');
//var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var HiddenContent = _react2.default.createClass({
    displayName: 'HiddenContent',
    propTypes: {
        id: _react.PropTypes.string,
        className: _react.PropTypes.string,
        expandLabel: _react.PropTypes.string,
        collapseLabel: _react.PropTypes.string,
        expandIcon: _react.PropTypes.string,
        collapseIcon: _react.PropTypes.string,
        isBottom: _react.PropTypes.bool
    },
    id: '',
    onExpandCollapse: function onExpandCollapse(event) {
        //var node = event.target,
        //    aTag = node.parentNode;
        var aTag = event.target;
        if ($(aTag).next().css('display') === 'none') {
            this.setState({ label: this.props.collapseLabel, icon: this.props.collapseIcon });
            $(aTag).next().css('display', 'block');
        } else {
            this.setState({ label: this.props.expandLabel, icon: this.props.expandIcon });
            $(aTag).next().css('display', 'none');
        }
    },
    onBottomCollapse: function onBottomCollapse(event) {
        var node = event.target,
            div = node.parentNode; //.parentNode;
        $(div).css('display', 'none');
        this.setState({ label: this.props.expandLabel, icon: this.props.expandIcon });
    },
    getInitialState: function getInitialState() {

        var label = this.props.expandLabel;
        if (typeof label === 'undefined') {
            label = 'Expand';
        }

        var icon = this.props.expandIcon;

        return { label: label, icon: icon };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    render: function render() {
        // 필수 항목
        var Icon;
        if (typeof this.state.icon === 'string') {
            Icon = _react2.default.createElement(
                'i',
                { className: this.state.icon },
                ' '
            );
        }

        // 맨 아래 접기버튼 처리
        var BottomButton;
        if (this.props.isBottom === true) {
            var CollapseIcon = void 0;
            if (typeof this.props.collapseIcon === 'string') {
                CollapseIcon = _react2.default.createElement(
                    'i',
                    { className: this.props.collapseIcon },
                    ' '
                );
            }

            // # 와 react-router 충돌문제 해결해야 함
            BottomButton = _react2.default.createElement(
                'a',
                { href: '#' + this.id, onClick: this.onBottomCollapse },
                CollapseIcon,
                this.props.collapseLabel
            );
        }

        return _react2.default.createElement(
            'div',
            { className: classNames('hidden-content', this.props.className) },
            _react2.default.createElement(
                'a',
                { href: 'javascript:void(0)', onClick: this.onExpandCollapse, name: this.id },
                Icon,
                this.state.label
            ),
            _react2.default.createElement(
                'div',
                { style: { display: 'none' } },
                _react2.default.createElement(
                    'div',
                    { id: this.id },
                    this.props.children
                ),
                BottomButton
            )
        );
    }
});

module.exports = HiddenContent;

},{"../services/Util":65,"classnames":2,"react":34}],41:[function(require,module,exports){
/**
 * Splitter component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/03
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.Splitter />
 *
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var Splitter = React.createClass({
    displayName: 'Splitter',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        type: PropTypes.oneOf(['h', 'v']).isRequired,
        position: PropTypes.oneOf(['left', 'right', 'top', 'bottom']).isRequired,
        //leftPane: PropTypes.string,
        //rightPane: PropTypes.string,
        minLeft: PropTypes.number.isRequired,
        minRight: PropTypes.number.isRequired,
        maxLeft: PropTypes.number.isRequired,
        maxRight: PropTypes.number.isRequired,
        onResize: PropTypes.func
    },
    id: '',
    onResize: function onResize(e) {
        if (this.props.onResize) {
            this.props.onResize(e);
        }
    },
    //-----------------------------
    // private
    splitterActiveFlag: false,
    splitterObj: false,
    splitterMouseDown: function splitterMouseDown(e) {
        if (!this.splitterActiveFlag && this.state.expand === true) {
            // document.getElementById(this.id)
            if (this.$splitter[0].setCapture) {
                this.$splitter[0].setCapture();
            } else {
                document.addEventListener('mouseup', this.splitterMouseUp, true);
                document.addEventListener('mousemove', this.splitterMouseMove, true);
                e.preventDefault();
            }
            this.splitterActiveFlag = true;
            this.splitterObj = this.$splitter[0];

            //leftsidebarCollapseWidth = $('.leftsidebar-collapse').outerWidth(true);
            this.splitterWidth = this.$splitter.outerWidth(true);

            /*splitterParentObj = b.parentElement;
             console.log(splitterObj.offsetLeft);
             console.log(splitterObj.parentElement.offsetLeft);*/
        }
    },
    splitterMouseUp: function splitterMouseUp(e) {
        if (this.splitterActiveFlag) {
            //        var a = document.getElementById("toc");
            //        var c = document.getElementById("content");
            //        changeQSearchboxWidth();
            //        a.style.width = (splitterObj.offsetLeft - 20) + "px";
            //        c.style.left = (splitterObj.offsetLeft + 10) + "px";

            var _props = this.props;
            var type = _props.type;
            var position = _props.position;


            if (type === 'h') {
                if (position === 'left') {
                    this.$splitter.prev().outerWidth(this.splitterObj.offsetLeft);
                    this.$splitter.next().offset({ left: this.splitterObj.offsetLeft + this.splitterWidth });
                } else if (position === 'right') {
                    this.hRightSplitterOffsetRight = this.$splitter.parent().outerWidth(true) - this.splitterObj.offsetLeft;
                    this.$splitter.prev().css('right', this.hRightSplitterOffsetRight);
                    this.$splitter.next().outerWidth(this.hRightSplitterOffsetRight - this.splitterWidth);

                    //this.$splitter.prev().offset({ right: this.splitterObj.offsetRight });
                    //this.$splitter.next().outerWidth(this.splitterObj.offsetRight - this.splitterWidth);
                }
            }

            if (this.splitterObj.releaseCapture) {
                this.splitterObj.releaseCapture();
            } else {
                document.removeEventListener('mouseup', this.splitterMouseUp, true);
                document.removeEventListener('mousemove', this.splitterMouseMove, true);
                e.preventDefault();
            }
            this.splitterActiveFlag = false;
            this.saveSplitterPos();
            //this.onResize();
            this.$splitter.trigger('resize');
        }
    },
    splitterMouseMove: function splitterMouseMove(e) {
        var _props2 = this.props;
        var type = _props2.type;
        var position = _props2.position;
        var minLeft = _props2.minLeft;
        var minRight = _props2.minRight;
        var maxLeft = _props2.maxLeft;
        var maxRight = _props2.maxRight;


        if (this.splitterActiveFlag) {
            if (type === 'h') {
                if (position === 'left') {
                    if (e.clientX >= minLeft && e.clientX <= maxLeft) {
                        this.splitterObj.style.left = e.clientX + 'px';
                        if (!this.splitterObj.releaseCapture) {
                            e.preventDefault();
                        }
                    }
                } else if (position === 'right') {
                    if (e.clientX <= document.documentElement.clientWidth - minRight && e.clientX >= document.documentElement.clientWidth - maxRight) {
                        this.splitterObj.style.left = e.clientX + 'px';
                        if (!this.splitterObj.releaseCapture) {
                            e.preventDefault();
                        }
                    }
                }
            }
            /*
            if (e.clientX >= this.props.minLeft && e.clientX <= document.documentElement.clientWidth - this.props.minRight) {
                this.splitterObj.style.left = e.clientX + 'px';
                if(!this.splitterObj.releaseCapture) {
                    e.preventDefault();
                }
            }
            */
        }
    },
    splitterOpen: function splitterOpen() {
        var _props3 = this.props;
        var type = _props3.type;
        var position = _props3.position;


        if (type === 'h') {
            if (position === 'left') {
                this.$splitter.prev().offset({ left: 0 });
                this.$splitter.offset({ left: this.leftFrameWidth });
                this.$splitter.next().offset({ left: this.leftFrameWidth + this.splitterWidth });
            } else if (position === 'right') {
                this.$splitter.prev().css('right', this.rightFrameWidth + this.splitterWidth);
                this.$splitter.offset({ left: this.$splitter.parent().outerWidth(true) - this.rightFrameWidth - this.splitterWidth });
                this.$splitter.next().outerWidth(this.rightFrameWidth);
            }
        }

        this.$splitter.css('cursor', 'e-resize');

        /*
         this.$splitter.prev().on('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend', function(e) {
            this.$splitter.css('display', 'block');
        });
        */
        this.setState({ expand: true });
        this.$splitter.trigger('resize');
    },
    splitterClose: function splitterClose() {
        var _props4 = this.props;
        var type = _props4.type;
        var position = _props4.position;


        if (type === 'h') {
            this.splitterWidth = this.$splitter.outerWidth(true);

            if (position === 'left') {
                this.leftFrameWidth = this.$splitter.prev().outerWidth(true);

                this.$splitter.prev().offset({ left: this.leftFrameWidth * -1 });
                this.$splitter.offset({ left: 0 });
                this.$splitter.next().offset({ left: this.splitterWidth });
            } else if (position === 'right') {
                this.rightFrameWidth = this.$splitter.next().outerWidth(true);

                this.$splitter.prev().css('right', this.splitterWidth);
                this.$splitter.offset({ left: this.$splitter.parent().outerWidth(true) - this.splitterWidth });
                this.$splitter.next().outerWidth(0);
            }
        }

        this.$splitter.css('cursor', 'default');
        //this.$splitter.prev().off('webkitTransitionEnd otransitionend oTransitionEnd msTransitionEnd transitionend');
        this.setState({ expand: false });
        this.$splitter.trigger('resize');
    },
    expandCollapse: function expandCollapse(e) {
        if (this.state.expand === true) {
            this.splitterClose();
        } else {
            this.splitterOpen();
        }
    },
    saveSplitterPos: function saveSplitterPos() {
        var _props5 = this.props;
        var type = _props5.type;
        var position = _props5.position;

        var a = this.$splitter[0]; //document.getElementById(this.id);
        if (a) {
            if (type === 'h') {
                if (position === 'left') {
                    Util.setCookie('hsplitterLeftPosition', a.offsetLeft, 365);
                } else if (position === 'right') {
                    Util.setCookie('hsplitterRightPosition', this.hRightSplitterOffsetRight, 365);
                }
            }
        }
    },
    resizeSplitterPos: function resizeSplitterPos() {
        var _props6 = this.props;
        var type = _props6.type;
        var position = _props6.position;

        if (type === 'h') {
            if (position === 'right') {
                var rightFrameWidth = 0;
                if (this.state.expand === true) {
                    rightFrameWidth = this.$splitter.next().outerWidth(true);
                }
                this.$splitter.offset({ left: this.$splitter.parent().outerWidth(true) - rightFrameWidth - this.splitterWidth });
            }
        }
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { type: 'h', position: 'left', minLeft: 50, minRight: 50, maxLeft: 500, maxRight: 500 };
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        return { expand: true };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$splitter = $('#' + this.id);

        // Events
        this.$splitter.on('resize', this.onResize);

        var _this = this;
        $(window).on('resize', function (e) {
            // splitter에서 발생시키는 resize 이벤트와 구별
            if (e.target === this) {
                //_this.resizeSplitterPos();
                // splitterOpen/splitterClose 함수 실행과 시간차를 두어야 적용됨
                setTimeout(_this.resizeSplitterPos, 1);
            }
        });
    },
    render: function render() {
        // 필수 항목
        var _props7 = this.props;
        var className = _props7.className;
        var type = _props7.type;
        var position = _props7.position;


        var h = true;
        if (type !== 'h') {
            h = false;
        }

        var l = true;
        if (position !== 'left') {
            l = false;
        }

        var display = 'block';
        if (!this.state.expand) {
            display = 'none';
        }

        return React.createElement(
            'div',
            { id: this.id, className: classNames({ 'mainframe-splitter': true, 'h-splitter': h, 'v-splitter': !h, 'left-splitter': l, 'right-splitter': !l }, className),
                onMouseDown: this.splitterMouseDown, onMouseUp: this.splitterMouseUp, onMouseMove: this.splitterMouseMove },
            React.createElement('div', { className: classNames({ 'splitter-collapse': this.state.expand, 'splitter-expand': !this.state.expand }), onMouseUp: this.expandCollapse }),
            React.createElement('div', { className: 'splitter-resize-handle', style: { display: display } })
        );
    }
});

module.exports = Splitter;

},{"../services/Util":65,"classnames":2,"react":34}],42:[function(require,module,exports){
/**
 * Modal component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/25
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.Modal ref="modal" width="700px">
 *   <Pum.ModalHeader>Modal Title</Pum.ModalHeader>
 *   <Pum.ModalBody>Modal Body</Pum.ModalBody>
 *   <Pum.ModalFooter>Modal Footer</Pum.ModalFooter>
 * </Pum.Modal>
 *
 * bootstrap component
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var ModalHeader = React.createClass({
    displayName: 'ModalHeader',
    propTypes: {
        className: PropTypes.string
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { className: classNames('modal-header', this.props.className) },
            React.createElement(
                'button',
                { type: 'button', className: 'close', 'data-dismiss': 'modal' },
                React.createElement(
                    'span',
                    { 'aria-hidden': 'true' },
                    '×'
                ),
                React.createElement(
                    'span',
                    { className: 'sr-only' },
                    'Close'
                )
            ),
            React.createElement(
                'span',
                { className: 'modal-title' },
                this.props.children
            )
        );
    }
});

var ModalBody = React.createClass({
    displayName: 'ModalBody',
    propTypes: {
        className: PropTypes.string
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { className: classNames('modal-body', this.props.className) },
            this.props.children
        );
    }
});

var ModalFooter = React.createClass({
    displayName: 'ModalFooter',
    propTypes: {
        className: PropTypes.string
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { className: classNames('modal-footer', this.props.className) },
            this.props.children
        );
    }
});

var Modal = React.createClass({
    displayName: 'Modal',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        backdrop: PropTypes.bool,
        onShow: PropTypes.func,
        onHide: PropTypes.func,
        init: PropTypes.func
    },
    id: '',
    show: function show() {
        var alert = $('#' + this.id);
        alert.modal('show');
        /*
        if(this.props.backdrop === true) {
            alert.modal('show');
        }else {
            alert.modal({
                backdrop: 'static',
                keyboard: false
            });
        }
        */
    },
    hide: function hide() {
        var alert = $('#' + this.id);
        alert.modal('hide');
    },
    onShow: function onShow(event) {
        if (typeof this.props.onShow === 'function') {
            this.props.onShow(event);
            //event.stopImmediatePropagation();
        }
    },
    onHide: function onHide(event) {
        if (typeof this.props.onHide === 'function') {
            this.props.onHide(event);
            //event.stopImmediatePropagation();
        }
    },
    getChildren: function getChildren() {
        var children = this.props.children;

        return React.Children.map(children, function (child) {
            if (child === null) {
                return null;
            }

            return React.cloneElement(child, {});
        });
    },
    getDefaultProps: function getDefaultProps() {
        return { backdrop: false };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        var $modal = $('#' + this.id);
        if (this.props.backdrop === false) {
            $modal.attr('data-backdrop', 'static');
            $modal.attr('data-keyboard', false);
        }

        $modal.on('shown.bs.modal', this.onShow);
        $modal.on('hidden.bs.modal', this.onHide);

        if (typeof this.props.init === 'function') {
            var data = {};
            data.$modal = $modal;
            this.props.init(data);
        }
    },
    render: function render() {
        // 필수 항목
        var _props = this.props;
        var className = _props.className;
        var width = _props.width;


        return React.createElement(
            'div',
            { id: this.id, className: classNames('modal', 'fade', className), role: 'dialog', 'aria-labelledby': '', 'aria-hidden': 'true' },
            React.createElement(
                'div',
                { className: 'modal-dialog', style: { width: width } },
                React.createElement(
                    'div',
                    { className: 'modal-content' },
                    this.getChildren()
                )
            )
        );
    }
});

module.exports = {
    Modal: Modal,
    ModalHeader: ModalHeader,
    ModalBody: ModalBody,
    ModalFooter: ModalFooter
};

},{"../services/Util":65,"classnames":2,"react":34}],43:[function(require,module,exports){
/**
 * Panel component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/30
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.Panel  />
 *
 * bootstrap component
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var PanelHeader = React.createClass({
    displayName: 'PanelHeader',
    propTypes: {
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        var _props = this.props;
        var width = _props.width;
        var height = _props.height;

        return { width: width, height: height };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        var width = nextProps.width;
        var height = nextProps.height;

        this.setState({ width: width, height: height });
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { className: 'panel-heading', style: { width: this.state.width, height: this.state.height } },
            React.createElement(
                'div',
                { className: 'panel-title' },
                this.props.children
            )
        );
    }
});

var PanelBody = React.createClass({
    displayName: 'PanelBody',
    propTypes: {
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        var _props2 = this.props;
        var width = _props2.width;
        var height = _props2.height;

        return { width: width, height: height };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        var width = nextProps.width;
        var height = nextProps.height;

        this.setState({ width: width, height: height });
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { className: 'panel-body', style: { width: this.state.width, height: this.state.height } },
            this.props.children
        );
    }
});

var PanelFooter = React.createClass({
    displayName: 'PanelFooter',
    propTypes: {
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number])
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        var _props3 = this.props;
        var width = _props3.width;
        var height = _props3.height;

        return { width: width, height: height };
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        var width = nextProps.width;
        var height = nextProps.height;

        this.setState({ width: width, height: height });
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { className: 'panel-footer', style: { width: this.state.width, height: this.state.height } },
            this.props.children
        );
    }
});

var Panel = React.createClass({
    displayName: 'Panel',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        onInit: PropTypes.func
    },
    id: '',
    getChildren: function getChildren() {
        var children = this.props.children;

        return React.Children.map(children, function (child) {
            if (child === null) {
                return null;
            }

            return React.cloneElement(child, {});
        });
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { className: 'panel-default' };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        if (typeof this.props.onInit === 'function') {
            this.props.onInit();
        }
    },
    render: function render() {
        // 필수 항목
        var className = this.props.className;


        return React.createElement(
            'div',
            { className: classNames('panel', className) },
            this.getChildren()
        );
    }
});

module.exports = {
    Panel: Panel,
    PanelHeader: PanelHeader,
    PanelBody: PanelBody,
    PanelFooter: PanelFooter
};

},{"../services/Util":65,"classnames":2,"react":34}],44:[function(require,module,exports){
/**
 * Radio component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/17
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.Radio options="{options}" />
 *
 */
'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classNames = require('classnames');

var Radio = _react2.default.createClass({
    displayName: 'Radio',
    propTypes: {
        className: _react.PropTypes.string,
        name: _react.PropTypes.string,
        selectedValue: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.bool]),
        onChange: _react.PropTypes.func,
        value: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.bool])
    },
    render: function render() {
        // 필수 항목
        var _props = this.props;
        var className = _props.className;
        var name = _props.name;
        var selectedValue = _props.selectedValue;
        var onChange = _props.onChange;
        var value = _props.value;

        var optional = {};
        if (selectedValue !== undefined) {
            optional.checked = this.props.value === selectedValue;
        }
        /*
        if(typeof onChange === 'function') {
            optional.onChange = onChange.bind(null, this.props.value);
        }
        */
        optional.onChange = onChange.bind(null, this.props.value);

        return _react2.default.createElement(
            'div',
            { className: 'radio' },
            _react2.default.createElement(
                'label',
                null,
                _react2.default.createElement('input', _extends({ type: 'radio', className: className, name: name, value: value
                }, optional)),
                _react2.default.createElement(
                    'span',
                    { className: 'lbl' },
                    this.props.children
                )
            )
        );
    }
});

module.exports = Radio;

},{"classnames":2,"react":34}],45:[function(require,module,exports){
/**
 * RadioGroup component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/17
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Pum.RadioGroup options="{options}" />
 *
 */
'use strict';

var _react = require('react');

var _react2 = _interopRequireDefault(_react);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var classNames = require('classnames');

var RadioGroup = _react2.default.createClass({
    displayName: 'RadioGroup',
    propTypes: {
        className: _react.PropTypes.string,
        name: _react.PropTypes.string,
        selectedValue: _react.PropTypes.oneOfType([_react.PropTypes.string, _react.PropTypes.number, _react.PropTypes.bool]),
        onChange: _react.PropTypes.func,
        horizontal: _react.PropTypes.bool
    },
    onChange: function onChange(value, event) {
        this.setState({ selectedValue: value });
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(event, value);
        }
    },
    getChildren: function getChildren() {
        var _props = this.props;
        var className = _props.className;
        var name = _props.name;
        var children = _props.children;
        var selectedValue = this.state.selectedValue;
        var onChange = this.onChange;

        return _react2.default.Children.map(children, function (radio) {
            if (radio === null) {
                return null;
            }

            return _react2.default.cloneElement(radio, {
                className: className,
                name: name,
                selectedValue: selectedValue,
                onChange: onChange
            });
        });
    },
    setStateObject: function setStateObject(props) {
        var selectedValue = props.selectedValue;
        if (typeof selectedValue === 'undefined') {
            selectedValue = null;
        }

        return {
            selectedValue: selectedValue
        };
    },
    getInitialState: function getInitialState() {
        return this.setStateObject(this.props);
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        //console.log('componentDidMount');
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        this.setState(this.setStateObject(nextProps));
    },
    render: function render() {
        // 필수 항목
        return _react2.default.createElement(
            'div',
            { className: classNames({ 'radio-horizontal': this.props.horizontal }) },
            this.getChildren()
        );
    }
});

module.exports = RadioGroup;

},{"classnames":2,"react":34}],46:[function(require,module,exports){
/**
 * AutoComplete component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/09/09
 * author <a href="mailto:jyt@nkia.co.kr">Jung Young-Tai</a>
 *
 * example:
 * <Puf.AutoComplete options={options} />
 *
 * Kendo AutoComplete 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var AutoComplete = React.createClass({
    displayName: 'AutoComplete',
    propTypes: {
        id: PropTypes.string,
        name: PropTypes.string,
        host: PropTypes.string, // 서버 정보(Cross Browser Access)
        url: PropTypes.string,
        method: PropTypes.string,
        data: PropTypes.object,
        placeholder: PropTypes.string,
        dataSource: PropTypes.oneOfType([PropTypes.array, PropTypes.object]),
        template: PropTypes.string,
        filter: PropTypes.string,
        separator: PropTypes.string,
        minLength: PropTypes.number,
        dataTextField: PropTypes.string,
        parameterMapField: PropTypes.object // Parameter Control 객체(필터처리)
    },
    id: '',
    $autoComplete: undefined,
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { method: 'POST', listField: 'resultValue.list', totalField: 'resultValue.totalCount', placeholder: $ps_locale.autoComplete, filter: "startswith", separator: ", ", template: null, dataTextField: null, minLength: 1 };
    },
    componentWillMount: function componentWillMount() {
        /// 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }
        this.id = id;
    },
    getDataSource: function getDataSource(props) {
        var host = props.host;
        var url = props.url;
        var method = props.method;
        var data = props.data;
        var listField = props.listField;
        var totalField = props.totalField;
        var parameterMapField = props.parameterMapField;


        var dataSource = new kendo.data.DataSource({
            transport: {
                read: {
                    url: host && host !== null && host.length > 0 ? host + url : url,
                    type: method,
                    dataType: 'json',
                    data: data, // search (@RequestBody GridParam gridParam 로 받는다.)
                    contentType: 'application/json; charset=utf-8'
                },
                parameterMap: function parameterMap(data, type) {
                    if (type == "read" && parameterMapField !== null) {
                        // Filter Array => Json Object Copy
                        if (parameterMapField.filtersToJson && data.filter && data.filter.filters) {
                            var filters = data.filter.filters;
                            filters.map(function (filter) {
                                data[parameterMapField.searchField] = filter.value;
                            });
                        }
                    }
                    return JSON.stringify(data);
                }
            },
            schema: {
                // returned in the "listField" field of the response
                data: function data(response) {
                    var arr = [],
                        gridList = response;

                    if (listField && listField.length > 0 && listField != 'null') {
                        arr = listField.split('.');
                    }
                    for (var i in arr) {
                        //console.log(arr[i]);
                        if (!gridList) {
                            gridList = [];
                            break;
                        }
                        gridList = gridList[arr[i]];
                    }
                    return gridList;
                },
                // returned in the "totalField" field of the response
                total: function total(response) {
                    //console.log(response);
                    var arr = [],
                        total = response;
                    if (totalField && totalField.length > 0 && totalField != 'null') {
                        arr = totalField.split('.');
                    }
                    for (var i in arr) {
                        //console.log(arr[i]);
                        if (!total) {
                            total = 0;
                            break;
                        }
                        total = total[arr[i]];
                    }
                    return total;
                }
            },
            serverFiltering: true
        });
        return dataSource;
    },
    getOptions: function getOptions(props) {
        var placeholder = props.placeholder;
        var template = props.template;
        var dataTextField = props.dataTextField;
        var minLength = props.minLength;
        var separator = props.separator;

        var dataSource = this.getDataSource(props);

        var options = {
            placeholder: placeholder,
            template: template,
            dataSource: dataSource,
            dataTextField: dataTextField,
            minLength: minLength,
            separator: separator
        };
        return options;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$autoComplete = $('#' + this.id);
        //console.log(this.getOptions(this.props));
        this.autoComplete = this.$autoComplete.kendoAutoComplete(this.getOptions(this.props));
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {},
    render: function render() {
        // 필수 항목
        var inputStyle = {
            width: "100%"
        };
        var _props = this.props;
        var name = _props.name;
        var className = _props.className;

        return React.createElement('input', { id: this.id, name: name, className: classNames(className), style: inputStyle });
    }
});

module.exports = AutoComplete;

},{"../services/Util":65,"classnames":2,"react":34}],47:[function(require,module,exports){
/**
 * DatePicker component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/06/05
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.DatePicker options={options} />
 *
 * Kendo DatePicker 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');
var DateUtil = require('../services/DateUtil');

var DatePicker = React.createClass({
    displayName: 'DatePicker',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        name: PropTypes.string,
        date: PropTypes.oneOfType([PropTypes.string, // YYYY-MM-DD HH:mm:ss format의 string
        PropTypes.object // Date
        ]),
        min: PropTypes.oneOfType([PropTypes.string, // YYYY-MM-DD HH:mm:ss format의 string
        PropTypes.object // Date
        ]),
        max: PropTypes.oneOfType([PropTypes.string, // YYYY-MM-DD HH:mm:ss format의 string
        PropTypes.object // Date
        ]),
        timePicker: PropTypes.bool,
        interval: PropTypes.number,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        disabled: PropTypes.bool,
        onChange: PropTypes.func,
        onClose: PropTypes.func,
        onOpen: PropTypes.func,
        init: PropTypes.func
    },
    id: '',
    //-----------------------------
    // api
    open: function open() {
        this.datePicker.open();
    },
    close: function close() {
        this.datePicker.close();
    },
    readonly: function readonly() {
        this.datePicker.readonly();
    },
    getDate: function getDate() {
        var date = this.datePicker.value(); // Date 객체 리턴함
        //console.log(date);
        //console.log(typeof date);
        return DateUtil.getDateToString(date); // YYYY-MM-DD HH:mm:ss format의 string
    },
    setDate: function setDate(date) {
        /*
        if(typeof date === 'undefined') {
            this.datePicker.value(new Date());
        }else if(typeof date === 'string' || typeof date.getMonth === 'function') {
            // YYYY-MM-DD HH:mm:ss format의 string
            this.datePicker.value(date);
        }
        */
        // YYYY-MM-DD HH:mm:ss format의 string
        if (typeof date === 'string' || typeof date.getMonth === 'function') {
            this.datePicker.value(date);
        }
    },
    enable: function enable(b) {
        if (typeof b === 'undefined') {
            b = true;
        }
        this.datePicker.enable(b);
    },
    min: function min(date) {
        if (typeof date === 'string' || typeof date.getMonth === 'function') {
            this.datePicker.min(date);
        }
    },
    max: function max(date) {
        if (typeof date === 'string' || typeof date.getMonth === 'function') {
            this.datePicker.max(date);
        }
    },
    //-----------------------------
    // event
    onChange: function onChange(e) {
        //console.log('onChange');
        if (typeof this.props.onChange === 'function') {
            var date = this.getDate();
            this.props.onChange(date);

            //event.stopImmediatePropagation();
        }
    },
    onClose: function onClose(e) {
        //console.log('onClose');
        //e.preventDefault(); //prevent popup closing
        if (typeof this.props.onClose === 'function') {
            this.props.onClose(e);

            //event.stopImmediatePropagation();
        }
    },
    onOpen: function onOpen(e) {
        //console.log('onOpen');
        //e.preventDefault(); //prevent popup opening
        if (typeof this.props.onOpen === 'function') {
            this.props.onOpen(e);

            //event.stopImmediatePropagation();
        }
    },
    //-----------------------------
    /*
    setStateObject: function(props) {
         let disabled = props.disabled;
        if(typeof disabled === 'undefined') {
            disabled = false;
        }
         return {
            disabled: disabled
        };
    },
    */
    getTimeOptions: function getTimeOptions() {
        var interval = this.props.interval;


        var intervalValue;
        if (typeof interval === 'undefined') {
            intervalValue = 5;
        } else {
            intervalValue = interval;
        }

        return {
            timeFormat: 'HH:mm',
            interval: intervalValue
        };
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var date = _props.date;
        var timePicker = _props.timePicker;
        var min = _props.min;
        var max = _props.max;


        var dateValue;
        if (typeof date === 'undefined') {
            dateValue = new Date();
        } else if (typeof date === 'string' || typeof date.getMonth === 'function') {
            dateValue = date;
        }

        var format = 'yyyy-MM-dd',
            timeOptions;
        if (timePicker === true) {
            format = 'yyyy-MM-dd HH:mm';
            timeOptions = this.getTimeOptions();
        }

        var options = {
            value: dateValue,
            format: format,
            culture: 'ko-KR', // http://docs.telerik.com/kendo-ui/framework/globalization/overview
            change: this.onChange,
            close: this.onClose,
            open: this.onOpen
        };

        $.extend(options, timeOptions);

        // min
        if (typeof min !== 'undefined') {
            $.extend(options, { min: min });
        }

        // max
        if (typeof max !== 'undefined') {
            $.extend(options, { max: max });
        }

        return options;
    },
    /*
    getInitialState: function() {
    // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        return this.setStateObject(this.props);
    },
    */
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$datePicker = $('#' + this.id);

        if (this.props.timePicker === true) {
            this.datePicker = this.$datePicker.kendoDateTimePicker(this.getOptions()).data('kendoDateTimePicker');
        } else {
            this.datePicker = this.$datePicker.kendoDatePicker(this.getOptions()).data('kendoDatePicker');
        }

        if (this.props.disabled === true) {
            this.enable(false);
        }

        if (typeof this.props.init === 'function') {
            var data = {};
            data.$datePicker = this.$datePicker;
            data.datePicker = this.datePicker;
            this.props.init(data);
        }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        //this.setState(this.setStateObject(nextProps));
        this.setDate(nextProps.date);
        this.enable(!nextProps.disabled);
    },
    render: function render() {
        // 필수 항목
        var _props2 = this.props;
        var className = _props2.className;
        var name = _props2.name;
        var width = _props2.width;


        return React.createElement('input', { id: this.id, className: classNames(className), name: name, style: { width: width } });
    }
});

module.exports = DatePicker;

},{"../services/DateUtil":61,"../services/Util":65,"classnames":2,"react":34}],48:[function(require,module,exports){
/**
 * DateRangePicker component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/06/05
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.DateRangePicker options={options} />
 *
 * Kendo DatePicker 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');
var DateUtil = require('../services/DateUtil');

var DateRangePicker = React.createClass({
    displayName: 'DateRangePicker',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        startName: PropTypes.string,
        endName: PropTypes.string,
        startDate: PropTypes.oneOfType([PropTypes.string, // YYYY-MM-DD HH:mm:ss format의 string
        PropTypes.object // Date
        ]),
        endDate: PropTypes.oneOfType([PropTypes.string, // YYYY-MM-DD HH:mm:ss format의 string
        PropTypes.object // Date
        ]),
        disabled: PropTypes.bool,
        timePicker: PropTypes.bool,
        onChange: PropTypes.func,
        init: PropTypes.func
    },
    id: '',
    //-----------------------------
    // api
    getStartDate: function getStartDate() {
        var date = this.startPicker.value(); // Date 객체 리턴함
        //console.log(date);
        //console.log(typeof date);
        return DateUtil.getDateToString(date); // YYYY-MM-DD HH:mm:ss format의 string
    },
    getEndDate: function getEndDate() {
        var date = this.endPicker.value(); // Date 객체 리턴함
        return DateUtil.getDateToString(date); // YYYY-MM-DD HH:mm:ss format의 string
    },
    setStartDate: function setStartDate(date) {
        // YYYY-MM-DD HH:mm:ss format의 string
        if (typeof date === 'string' || typeof date.getMonth === 'function') {
            this.startPicker.value(date);
            this.onStartChange(date);
        }
    },
    setEndDate: function setEndDate(date) {
        // YYYY-MM-DD HH:mm:ss format의 string
        if (typeof date === 'string' || typeof date.getMonth === 'function') {
            this.endPicker.value(date);
            this.onEndChange(date);
        }
    },
    enable: function enable(b) {
        if (typeof b === 'undefined') {
            b = true;
        }
        this.startPicker.enable(b);
        this.endPicker.enable(b);
    },
    //-----------------------------
    onStartInit: function onStartInit(data) {
        this.startPicker = data.datePicker;
    },
    onEndInit: function onEndInit(data) {
        this.endPicker = data.datePicker;
    },
    onStartChange: function onStartChange(date) {
        this.endPicker.min(date);
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(this.getStartDate(), this.getEndDate());
            //event.stopImmediatePropagation();
        }
        //var startDate = this.startPicker.value(),
        //    endDate = this.endPicker.value();
        //
        //if (startDate) {
        //    this.endPicker.min(startDate);
        //} else if (endDate) {
        //    this.startPicker.max(endDate);
        //} else {
        //    endDate = new Date();
        //    start.max(endDate);
        //    end.min(endDate);
        //}
    },
    onEndChange: function onEndChange(date) {
        this.startPicker.max(date);
        if (typeof this.props.onChange === 'function') {
            this.props.onChange(this.getStartDate(), this.getEndDate());
            //event.stopImmediatePropagation();
        }
    },
    setStateObject: function setStateObject(props) {
        // startDate 처리
        var startDate = props.startDate;

        // endDate 처리
        var endDate = props.endDate;

        // disabled 처리
        var disabled = props.disabled;
        if (typeof disabled === 'undefined') {
            disabled = false;
        }

        return {
            startDate: startDate,
            endDate: endDate,
            disabled: disabled
        };
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { startName: 'startDate', endName: 'endDate' };
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        return this.setStateObject(this.props);
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.startPicker.max(this.endPicker.value());
        this.endPicker.min(this.startPicker.value());

        if (typeof this.props.init === 'function') {
            var data = {};
            data.startPicker = this.startPicker;
            data.endPicker = this.endPicker;
            this.props.init(data);
        }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        this.setState(this.setStateObject(nextProps));
    },
    render: function render() {
        // 필수 항목
        var _props = this.props;
        var className = _props.className;
        var startName = _props.startName;
        var endName = _props.endName;
        var timePicker = _props.timePicker;
        var _state = this.state;
        var startDate = _state.startDate;
        var endDate = _state.endDate;
        var disabled = _state.disabled;


        return React.createElement(
            'div',
            { className: 'datepicker-group' },
            React.createElement(Puf.DatePicker, { className: className, name: startName, date: startDate, init: this.onStartInit, onChange: this.onStartChange,
                timePicker: timePicker, disabled: disabled }),
            ' ',
            React.createElement(Puf.DatePicker, { className: className, name: endName, date: endDate, init: this.onEndInit, onChange: this.onEndChange,
                timePicker: timePicker, disabled: disabled })
        );
    }
});

module.exports = DateRangePicker;

},{"../services/DateUtil":61,"../services/Util":65,"classnames":2,"react":34}],49:[function(require,module,exports){
/**
 * DropDownList component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/05/03
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.DropDownList options={options} />
 *
 * Kendo DropDownList 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var DropDownList = React.createClass({
    displayName: 'DropDownList',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        name: PropTypes.string,
        url: PropTypes.string,
        method: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        optionLabel: PropTypes.string,
        dataTextField: PropTypes.string,
        dataValueField: PropTypes.string,
        selectedItem: PropTypes.object,
        selectedValue: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        selectedIndex: PropTypes.number,
        items: PropTypes.array,
        headerTemplate: PropTypes.string,
        valueTemplate: PropTypes.string,
        template: PropTypes.string,
        disabled: PropTypes.bool,
        onSelect: PropTypes.func,
        onChange: PropTypes.func,
        onClose: PropTypes.func,
        onOpen: PropTypes.func,
        onFiltering: PropTypes.func,
        onDataBound: PropTypes.func
    },
    id: '',
    open: function open() {
        this.dropdownlist.open();
    },
    close: function close() {
        this.dropdownlist.close();
    },
    select: function select(index) {
        this.dropdownlist.select(index);
    },
    value: function value(_value) {
        this.dropdownlist.value(_value);
    },
    //-----------------------------
    // api

    //-----------------------------
    // event
    onSelect: function onSelect(e) {
        //console.log('onSelect');
        //console.log(event);
        var dropdownlist = this.$dropDownList.data('kendoDropDownList'),
            dataItem = dropdownlist.dataItem(e.item);
        //console.log(dataItem);
        //console.log(dataItem[this.props.dataValueField]);
        //$('[name=' + this.props.name + ']').val(dataItem.value);
        //$('input[name=displayData]').val(dataItem[this.props.dataValueField]);
        //this.$dropDownList.val(dataItem[this.props.dataValueField]);

        if (typeof this.props.onSelect === 'function') {
            var selectedItem = dataItem,
                selectedValue = dataItem[this.props.dataValueField];
            this.props.onSelect(e, selectedItem, selectedValue);

            //e.stopImmediatePropagation();
        }
    },
    onChange: function onChange(e) {
        //console.log('onChange');
        //console.log(event);

        if (typeof this.props.onChange === 'function') {
            this.props.onChange(e);

            //event.stopImmediatePropagation();
        }
    },
    onClose: function onClose(e) {
        //console.log('onClose');
        //console.log(event);

        if (typeof this.props.onClose === 'function') {
            this.props.onClose(e);

            //event.stopImmediatePropagation();
        }
    },
    onOpen: function onOpen(e) {
        //console.log('onOpen');
        //console.log(event);

        if (typeof this.props.onOpen === 'function') {
            this.props.onOpen(e);

            //event.stopImmediatePropagation();
        }
    },
    onFiltering: function onFiltering(e) {

        if (typeof this.props.onFiltering !== 'undefined') {
            this.props.onFiltering(e);
        }
    },
    onDataBound: function onDataBound(event) {
        //console.log('onDataBound');
        //console.log(event);

        if (typeof this.props.onDataBound === 'function') {
            this.props.onDataBound(event);

            //event.stopImmediatePropagation();
        }
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var url = _props.url;
        var method = _props.method;
        var items = _props.items;
        var selectedIndex = _props.selectedIndex;
        var selectedValue = _props.selectedValue;
        var dataTextField = _props.dataTextField;
        var dataValueField = _props.dataValueField;
        var headerTemplate = _props.headerTemplate;
        var valueTemplate = _props.valueTemplate;
        var template = _props.template;


        var options = {
            dataTextField: dataTextField,
            dataValueField: dataValueField,
            dataSource: []
        };

        // dataSource
        // url
        if (typeof url !== 'undefined') {
            $.extend(options, { dataSource: {
                    transport: {
                        read: {
                            url: url,
                            type: method,
                            dataType: 'json'
                        }
                    }
                } });
        } else if (typeof items !== 'undefined') {
            $.extend(options, { dataSource: items });
        }

        // selectedIndex
        if (typeof selectedIndex !== 'undefined') {
            $.extend(options, { index: selectedIndex });
        }

        // selectedValue
        if (typeof selectedValue !== 'undefined') {
            $.extend(options, { value: selectedValue });
        }

        // headerTemplate
        if (typeof headerTemplate !== 'undefined') {
            $.extend(options, { headerTemplate: headerTemplate });
        }

        // valueTemplate
        if (typeof valueTemplate !== 'undefined') {
            $.extend(options, { valueTemplate: valueTemplate });
        }

        // template
        if (typeof template !== 'undefined') {
            $.extend(options, { template: template });
        }

        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.		
        return { width: '100%', dataTextField: 'text', dataValueField: 'value', selectedIndex: 0 };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)      
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$dropDownList = $('#' + this.id);
        this.dropdownlist = this.$dropDownList.kendoDropDownList(this.getOptions()).data('kendoDropDownList');

        // Events
        this.dropdownlist.bind('select', this.onSelect);
        this.dropdownlist.bind('change', this.onChange);
        this.dropdownlist.bind('open', this.onOpen);
        this.dropdownlist.bind('close', this.onClose);
        this.dropdownlist.bind('filtering', this.onFiltering);
        this.dropdownlist.bind('dataBound', this.onDataBound);

        // dropdownlist 초기 선택 (getOptions() 에서 처리)
        /*
        if(typeof this.props.selectedValue !== 'undefined') {
            this.dropdownlist.value(this.props.selectedValue);
        }else {
            this.dropdownlist.select(0);
        }
        */

        /*
        if(typeof this.props.init === 'function') {
            var data = {};
            data.$dropDownList = this.$dropDownList;
            data.dropdownlist = this.dropdownlist;
            this.props.init(data);
        }
        */
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        if (typeof nextProps.selectedValue !== 'undefined') {
            this.dropdownlist.value(nextProps.selectedValue);
        }
    },
    render: function render() {
        // 필수 항목       
        var _props2 = this.props;
        var className = _props2.className;
        var name = _props2.name;
        var width = _props2.width;


        return React.createElement('input', { id: this.id, name: name, style: { width: width } });
    }
});

module.exports = DropDownList;

},{"../services/Util":65,"classnames":2,"react":34}],50:[function(require,module,exports){
/**
 * Grid component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/04/17
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.Grid options={options} />
 *
 * Kendo Grid 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var Grid = React.createClass({
    displayName: 'Grid',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        host: PropTypes.string, // 서버 정보(Cross Browser Access)
        url: PropTypes.string,
        method: PropTypes.string,
        checkboxField: PropTypes.string,
        data: PropTypes.object,
        columns: PropTypes.array,
        selectedIds: PropTypes.array,
        listField: PropTypes.string,
        totalField: PropTypes.string,
        checkField: PropTypes.string,
        onSelectRow: PropTypes.func,
        onChange: PropTypes.func,
        resizable: PropTypes.bool,
        filterable: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        sortable: PropTypes.bool,
        pageable: PropTypes.oneOfType([PropTypes.bool, PropTypes.object]),
        pageSize: PropTypes.number,
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),

        /*
          Grid selectable 설정값
          "row" - the user can select a single row.
          "cell" - the user can select a single cell.
          "multiple, row" - the user can select multiple rows.
          "multiple, cell" - the user can select multiple cells.
        */
        selectMode: PropTypes.oneOf(['row', 'cell']), // Grid Select Row 또는 Cell 선택
        multiple: PropTypes.bool, // 셀렉트 multiple 지원
        /*
          Grid parameterMapField 설정값
          skip: "start", - paging skip 변수 입력된 값(key)으로 복제
          take: "limit", - paging limit 변수 입력된 값(key)으로 복제
          convertSort: true, - sort parameter 복제 여부
          field:"property",  - sort field 변수 입력된 값(key)으로 복제
          dir: "direction",  - sort dir 변수 입력된 값(key)으로 복제
          filtersToJson: true,      - filter 정보를 json으로 변환해서 일반 파라미터 처럼 처리
          filterPrefix: "search_",  - filter json으로 변환시 prefix가 필요한 경우 prefix를 붙여서 반환
          filterFieldToLowerCase: true  - filter의 field를 lowerCase(소문자)로 반환
        */
        parameterMapField: PropTypes.object, // Parameter Control 객체(데이터 복사, 필터처리, Sorting 파리미터 정의 등)
        scrollable: PropTypes.bool // 좌우 스크롤 생성
    },
    id: '',
    $grid: undefined,
    checkedIds: {},
    checkedItems: {},
    /*
    * Grid Change Event(Select Event), dataSet으로 정의하여 받는다.
    * rowIndex
    * cellIndex
    * data
    * rows
    */
    onChange: function onChange() {
        var grid = this.grid;
        if (typeof this.props.onChange === 'function') {
            //var data = event.node;
            var dataSet = {};
            if (this.props.selectMode === "cell") {
                var row = $(grid.select()).closest("tr");
                var cell = grid.select();
                var cellText = $(cell).text();
                dataSet.rowIndex = $("tr", grid.tbody).index(row);
                dataSet.cellIndex = grid.cellIndex(cell);
                dataSet.data = $(cell).text();
            } else {
                var rows = grid.select();

                if (rows.length > 1) {
                    (function () {
                        var rowsData = [];
                        rows.each(function () {
                            rowsData.push(grid.dataItem($(this)));
                        });
                        dataSet.rows = rows;
                        dataSet.data = rowsData;
                    })();
                } else {
                    dataSet.rows = rows;
                    dataSet.data = grid.dataItem(rows);
                }
            }
            this.props.onChange(dataSet);
        }
    },

    setSelectedIds: function setSelectedIds(props) {
        var checkField = props.checkField;
        var selectedIds = props.selectedIds;


        if (selectedIds !== null && typeof selectedIds !== 'undefined' && selectedIds.length > 0) {
            var rows = this.grid.table.find('tr').find('td:first input').closest('tr'),
                _this = this;

            rows.each(function (index, row) {
                var $checkbox = $(row).find('input:checkbox.checkbox'),
                    dataItem = _this.grid.dataItem(row),
                    checked = false;

                for (var i = 0; i < selectedIds.length; i++) {

                    if (checkField !== null && typeof checkField !== 'undefined') {
                        if (dataItem[checkField] == selectedIds[i]) {
                            checked = true;
                            break;
                        }
                    } else {
                        if ($checkbox.val() == selectedIds[i]) {
                            checked = true;
                            break;
                        }
                    }
                }

                $checkbox.attr('checked', checked);
                _this.selectCheckbox($checkbox, checked, $(row));
            });
        }
    },
    onSelectRow: function onSelectRow(event) {

        if (typeof this.props.onSelectRow === 'function') {
            var ids = [],
                items = [];
            for (var key in this.checkedIds) {
                if (this.checkedIds[key]) {
                    ids.push(key);
                    items.push(this.checkedItems[key]);
                }
            }

            this.props.onSelectRow(event, ids, items);
        }
    },
    onCheckboxHeader: function onCheckboxHeader(event) {
        var checked = $(event.target).is(':checked');

        var rows = this.grid.table.find("tr").find("td:first input").closest("tr"),
            _this = this;

        rows.each(function (index, row) {
            var $checkbox = $(row).find('input:checkbox.checkbox');
            $checkbox.attr('checked', checked);

            _this.selectCheckbox($checkbox, checked, $(row));
        });

        this.onSelectRow(event);
    },
    onCheckboxRow: function onCheckboxRow(event) {
        var checked = event.target.checked,
            $row = $(event.target).closest('tr');

        this.selectCheckbox($(event.target), checked, $row);
        this.onSelectRow(event);
    },
    selectCheckbox: function selectCheckbox($checkbox, checked, $row) {

        var dataItem = this.grid.dataItem($row);

        if (this.props.checkField !== null && typeof this.props.checkField !== 'undefined') {
            this.checkedIds[dataItem[this.props.checkField]] = checked;
            this.checkedItems[dataItem[this.props.checkField]] = dataItem;
        } else {
            this.checkedIds[$checkbox.val()] = checked;
            this.checkedItems[$checkbox.val()] = dataItem;
        }

        if (checked) {
            //-select the row
            $row.addClass("k-state-selected");
        } else {
            //-remove selection
            $row.removeClass("k-state-selected");
        }
    },
    getCheckboxColumn: function getCheckboxColumn(checkboxField) {
        return {
            field: checkboxField,
            headerTemplate: '<input type="checkbox" class="checkbox" />',
            //headerTemplate: '<div class="checkbox"><label><input type="checkbox" /></label></div>',
            headerAttributes: {
                'class': 'table-header-cell',
                style: 'text-align: center'
            },
            template: '<input type="checkbox" class="checkbox" value="#=' + checkboxField + '#" />',
            attributes: {
                align: 'center'
            },
            width: 50,
            sortable: false
        };
    },
    onDataBound: function onDataBound(arg) {
        // selected check
        this.setSelectedIds(this.props);
    },
    getDataSource: function getDataSource(props) {
        var host = props.host;
        var url = props.url;
        var method = props.method;
        var data = props.data;
        var listField = props.listField;
        var totalField = props.totalField;
        var pageable = props.pageable;
        var pageSize = props.pageSize;
        var parameterMapField = props.parameterMapField;

        // pageSize

        var _pageSize = 0,
            _pageable = false;
        if (pageable) {
            _pageSize = pageSize;
            _pageable = true;
        }

        // http://itq.nl/kendo-ui-grid-with-server-paging-filtering-and-sorting-with-mvc3/
        // https://blog.longle.net/2012/04/13/teleriks-html5-kendo-ui-grid-with-server-side-paging-sorting-filtering-with-mvc3-ef4-dynamic-linq/
        var dataSource = new kendo.data.DataSource({
            transport: {
                /*
                read: function(options) {
                    $.ajax({
                        type: method,
                        url: url,
                        //contentType: "application/json; charset=utf-8", 이것 설정하면 data 전송 안됨
                        dataType: 'json',
                        data: data,//JSON.stringify({key: "value"}),
                        success: function(data) {
                            //console.log(data);
                             var arr = [], gridList = data;
                            if(listField && listField.length > 0 && listField != 'null') {
                                arr = listField.split('.');
                            }
                            for(var i in arr) {
                                //console.log(arr[i]);
                                gridList = gridList[arr[i]];
                            }
                            options.success(gridList);
                            //options.success(data.resultValue.list);
                        }
                    });
                }
                */
                read: {
                    url: host && host !== null && host.length > 0 ? host + url : url,
                    type: method,
                    dataType: 'json',
                    data: data, // search (@RequestBody GridParam gridParam 로 받는다.)
                    contentType: 'application/json; charset=utf-8'
                },
                parameterMap: function parameterMap(data, type) {
                    if (type == "read" && parameterMapField !== null) {
                        // 데이터 읽어올때 필요한 데이터(ex:페이지관련)가 있으면 data를 copy한다.
                        for (var copy in parameterMapField) {
                            if (typeof parameterMapField[copy] === "string" && copy in data) {
                                data[parameterMapField[copy]] = data[copy];
                            }
                        }
                        // Filter Array => Json Object Copy
                        if (parameterMapField.filtersToJson && data.filter && data.filter.filters) {
                            var filters = data.filter.filters;
                            filters.map(function (filter) {
                                var field = parameterMapField.filterPrefix ? parameterMapField.filterPrefix + filter.field : filter.field;
                                if (parameterMapField.filterFieldToLowerCase) {
                                    data[field.toLowerCase()] = filter.value;
                                } else {
                                    data[field] = filter.value;
                                }
                            });
                        }
                        // Sort Array => Field, Dir Convert
                        if (parameterMapField.convertSort && data.sort) {
                            data.sort.map(function (sortData) {
                                if ("field" in parameterMapField) {
                                    sortData[parameterMapField.field] = sortData.field;
                                }
                                if ("dir" in parameterMapField) {
                                    sortData[parameterMapField.dir] = sortData.dir;
                                }
                            });
                        }
                    }

                    //console.log(data);
                    // paging 처리시 서버로 보내지는 그리드 관련 데이터 {take: 20, skip: 0, page: 1, pageSize: 20}
                    // no paging 처리시에는 {} 을 서버로 보낸다.
                    // @RequestBody GridParam gridParam 로 받는다.
                    return JSON.stringify(data);
                }
            },
            schema: {
                // returned in the "listField" field of the response
                data: function data(response) {
                    //console.log(response);
                    var arr = [],
                        gridList = response;

                    if (listField && listField.length > 0 && listField != 'null') {
                        arr = listField.split('.');
                    }
                    for (var i in arr) {
                        //console.log(arr[i]);
                        if (!gridList) {
                            gridList = [];
                            break;
                        }
                        gridList = gridList[arr[i]];
                    }
                    return gridList;
                },
                // returned in the "totalField" field of the response
                total: function total(response) {
                    //console.log(response);
                    var arr = [],
                        total = response;
                    if (totalField && totalField.length > 0 && totalField != 'null') {
                        arr = totalField.split('.');
                    }
                    for (var i in arr) {
                        //console.log(arr[i]);
                        if (!total) {
                            total = 0;
                            break;
                        }
                        total = total[arr[i]];
                    }
                    return total;
                }
            },
            pageSize: _pageSize,
            serverPaging: _pageable,
            serverFiltering: _pageable,
            serverSorting: _pageable
        });

        return dataSource;
    },
    getOptions: function getOptions(props) {
        var resizable = props.resizable;
        var filterable = props.filterable;
        var sortable = props.sortable;
        var pageable = props.pageable;
        var height = props.height;
        var checkboxField = props.checkboxField;
        var selectMode = props.selectMode;
        var multiple = props.multiple;
        var scrollable = props.scrollable;


        var dataSource = this.getDataSource(props);

        var columns = props.columns;
        if (typeof checkboxField !== 'undefined') {
            var b = true;
            for (var i in columns) {
                if (checkboxField == columns[i].field) {
                    b = false;
                    break;
                }
            }
            if (b === true) {
                columns.unshift(this.getCheckboxColumn(checkboxField));
            }
        }

        var filter;
        if (typeof filterable === 'boolean' && filterable === true) {
            filter = {
                extra: false,
                operators: {
                    string: {
                        contains: 'contains'
                    },
                    number: {
                        eq: 'eq' /*,
                                 neq: "Diverso da",
                                 gte: "Maggiore o uguale a",
                                 gt: "Maggiore di",
                                 lte: "Minore o uguale a",
                                 lt: "Minore di"*/
                    },
                    date: {
                        eq: 'eq' /*,
                                 neq: "Diverso da",
                                 gte: "Successiva o uguale al",
                                 gt: "Successiva al",
                                 lte: "Precedente o uguale al",
                                 lt: "Precedente al"*/
                    },
                    enums: {
                        contains: 'contains'
                    }
                },
                ui: function ui(element) {
                    var $parent = element.parent();
                    while ($parent.children().length > 1) {
                        $($parent.children()[0]).remove();
                    }$parent.prepend('<input type="text" data-bind="value:filters[0].value" class="k-textbox">');
                    $parent.find('button:submit.k-button.k-primary').html('필터');
                    $parent.find('button:reset.k-button').html('초기화');
                }
            };
        } else {
            filter = filterable;
        }

        var _pageable;
        if (typeof pageable === 'boolean' && pageable === true) {
            _pageable = {
                buttonCount: 5,
                pageSizes: [10, 20, 30, 50, 100],
                messages: {
                    display: $ps_locale.grid.recordtext, //'{0}-{1}/{2}',
                    empty: '',
                    //of: '/{0}',
                    itemsPerPage: $ps_locale.grid.rowsPerPage
                }
            };
        } else {
            _pageable = pageable;
        }

        var options = {
            //dataSource: {
            //    transport: {
            //        read: {
            //            type: method,
            //            url: url,
            //            //data: data,
            //            dataType: 'json'
            //        }
            //    }//,
            //    //schema: {
            //    //    data: 'data'
            //    //},
            //    //pageSize: 20,
            //    //serverPaging: true,
            //    //serverFiltering: true,
            //    //serverSorting: true
            //},
            dataSource: dataSource,
            columns: columns,
            noRecords: {
                template: $ps_locale.grid.emptyrecords
            },
            height: height,
            dataBound: this.onDataBound,
            resizable: resizable,
            filterable: filter,
            sortable: sortable,
            scrollable: scrollable,
            pageable: _pageable,
            selectable: multiple ? "multiple ," + selectMode : selectMode
        };

        if (typeof height === 'number' || typeof height === 'string') {
            $.extend(options, { height: height });
        }

        /*
        if(typeof onChange === 'function'){
          $.extend(options, {change: this.onChangeRow});
        }
        */
        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { method: 'POST', listField: 'resultValue.list', totalField: 'resultValue.totalCount', resizable: true, filterable: false, sortable: true, pageable: true, pageSize: 20, selectMode: null, multiple: false, parameterMapField: null, scrollable: false };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$grid = $('#' + this.id);

        //console.log(this.getOptions(this.props));
        this.grid = this.$grid.kendoGrid(this.getOptions(this.props)).data('kendoGrid');

        /*
        var _this = this;
        $(window).resize(function(){
            //_this.$grid.data("kendoGrid").resize();
            _this.autoResizeGrid();
        });
        */
        // bind click event to the checkbox
        //console.log(grid);
        // Events
        this.grid.bind('change', this.onChange);

        this.grid.table.on('click', '.checkbox', this.onCheckboxRow); // checkbox
        this.grid.thead.on('click', '.checkbox', this.onCheckboxHeader); // header checkbox

        if (typeof this.props.init === 'function') {
            var data = {};
            data.$grid = this.$grid;
            data.grid = this.grid;
            this.props.init(data);
        }
    },
    componentWillReceiveProps: function componentWillReceiveProps(nextProps) {
        // 컴포넌트가 새로운 props를 받을 때 호출(최초 렌더링 시에는 호출되지 않음)
        /* dataSource 에 관련된 값이 바뀌어야 다시 데이터 로딩하는 방식은 일단 보류
        화면에서 refresh 가 안됨
        const {url, method, data, listField} = this.props;
         var b = false;
        for(var key in data) {
            if(nextProps.data[key] != data[key]) {
                b = true;
                break;
            }
        }
         if(nextProps.url != url || b == true) {
            //console.log('setDataSource');
            var grid = $('#'+this.id).data("kendoGrid");
            grid.setDataSource(this.getDataSource(nextProps));
        }
        */
        this.grid.setDataSource(this.getDataSource(nextProps));
        this.checkedIds = [];
        this.grid.thead.find('.checkbox').attr('checked', false);
        // setDataSource 가 일어나면 header checkbox click 이벤트 리스너가 사라져서 다시 설정
        this.grid.thead.on('click', '.checkbox', this.onCheckboxHeader); // header checkbox

        // selected check
        this.setSelectedIds(nextProps);
    },
    render: function render() {
        // 필수 항목
        var className = this.props.className;


        return React.createElement('div', { id: this.id, className: classNames(className) });
    }
});

module.exports = Grid;

},{"../services/Util":65,"classnames":2,"react":34}],51:[function(require,module,exports){
/**
 * MultiSelect component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/23
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.MultiSelect options={options} />
 *
 * Kendo MultiSelect 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var MultiSelect = React.createClass({
    displayName: 'MultiSelect',
    propTypes: {
        id: PropTypes.string,
        name: PropTypes.string,
        className: PropTypes.string,
        host: PropTypes.string, // 서버 정보(Cross Browser Access)
        url: PropTypes.string,
        method: PropTypes.string,
        data: PropTypes.object,
        items: PropTypes.array,
        placeholder: PropTypes.string,
        listField: PropTypes.string,
        dataTextField: PropTypes.string,
        dataValueField: PropTypes.string,
        multiple: PropTypes.bool, // 다중선택을 지원하며, 닫히지 않고 여러개를 선택할 수 있다.
        headerTemplate: PropTypes.string,
        itemTemplate: PropTypes.string,
        tagTemplate: PropTypes.string,
        height: PropTypes.number,
        onSelect: PropTypes.func,
        onChange: PropTypes.func,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onFiltering: PropTypes.func,
        onDataBound: PropTypes.func,
        minLength: PropTypes.number, // 검색시 필요한 최소 단어 길이
        maxSelectedItems: PropTypes.number, // 최대 선택 수
        parameterMapField: PropTypes.object, // Paging, FilterJson
        serverFiltering: PropTypes.bool, // 서버 Filtering(검색조건에 따른 리스트업)
        serverPaging: PropTypes.bool, // 서버 Paging(멀티셀렉트 리스트 제한)
        pageSize: PropTypes.number, // 서버사이드 Page Size
        filterFields: PropTypes.array // 필터 필드 정의(or로 다중 검색시 제공)
    },
    id: '',
    onSelect: function onSelect(e) {
        var dataItem = this.multiSelect.dataSource.view()[e.item.index()];

        if (typeof this.props.onSelect !== 'undefined') {
            this.props.onSelect(e);
        }
    },
    onChange: function onChange(e) {
        if (typeof this.props.onChange !== 'undefined') {
            this.props.onChange(e);
        }
    },
    onOpen: function onOpen(e) {
        if (typeof this.props.onOpen !== 'undefined') {
            this.props.onOpen(e);
        }
    },
    onClose: function onClose(e) {
        if (typeof this.props.onClose !== 'undefined') {
            this.props.onClose(e);
        }
    },
    onFiltering: function onFiltering(e) {
        if (typeof this.props.onFiltering !== 'undefined') {
            this.props.onFiltering(e);
        }
    },
    onDataBound: function onDataBound(e) {

        if (typeof this.props.onDataBound !== 'undefined') {}
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var host = _props.host;
        var url = _props.url;
        var data = _props.data;
        var method = _props.method;
        var items = _props.items;
        var placeholder = _props.placeholder;
        var listField = _props.listField;
        var dataTextField = _props.dataTextField;
        var dataValueField = _props.dataValueField;
        var headerTemplate = _props.headerTemplate;
        var itemTemplate = _props.itemTemplate;
        var tagTemplate = _props.tagTemplate;
        var height = _props.height;
        var multiple = _props.multiple;
        var minLength = _props.minLength;
        var maxSelectedItems = _props.maxSelectedItems;
        var parameterMapField = _props.parameterMapField;
        var serverFiltering = _props.serverFiltering;
        var serverPaging = _props.serverPaging;
        var pageSize = _props.pageSize;
        var filterFields = _props.filterFields;


        var options = {
            placeholder: placeholder,
            dataTextField: dataTextField,
            dataValueField: dataValueField,
            dataSource: []
        };

        if (multiple) {
            $.extend(options, { autoClose: false });
        }

        if (minLength > 0) {
            $.extend(options, { minLength: minLength });
        }

        if (maxSelectedItems !== null) {
            $.extend(options, { maxSelectedItems: maxSelectedItems });
        }

        // dataSource
        // url
        if (url && url !== null && url.length > 0) {
            $.extend(options, { dataSource: {
                    transport: {
                        read: {
                            url: host && host !== null && host.length > 0 ? host + url : url,
                            type: method,
                            dataType: 'json',
                            data: data, // search (@RequestBody GridParam gridParam 로 받는다.)
                            contentType: 'application/json; charset=utf-8'
                        },
                        parameterMap: function parameterMap(data, type) {
                            if (type == "read" && parameterMapField !== null) {
                                // 데이터 읽어올때 필요한 데이터(ex:페이지관련)가 있으면 data를 copy한다.
                                for (var copy in parameterMapField) {
                                    if (typeof parameterMapField[copy] === "string" && copy in data) {
                                        data[parameterMapField[copy]] = data[copy];
                                    }
                                }

                                if (parameterMapField.filtersToJson && data.filter && data.filter.filters) {
                                    // Filter Array => Json Object Copy
                                    var filters = data.filter.filters;
                                    filters.map(function (filter) {
                                        var field = parameterMapField.filterPrefix ? parameterMapField.filterPrefix + filter.field : filter.field;
                                        if (parameterMapField.filterFieldToLowerCase) {
                                            data[field.toLowerCase()] = filter.value;
                                        } else {
                                            data[field] = filter.value;
                                        }
                                    });
                                }
                            }
                            return JSON.stringify(data);
                        }
                    },
                    schema: {
                        // returned in the "listField" field of the response
                        data: function data(response) {
                            var listFields = [],
                                dataList = response;
                            if (listField && listField.length > 0 && listField != 'null') {
                                listFields = listField.split('.');
                                listFields.map(function (field) {
                                    dataList = dataList[field];
                                });
                            }
                            return dataList;
                        }
                    },
                    serverFiltering: serverFiltering,
                    serverPaging: serverPaging,
                    pageSize: pageSize
                } });
        } else if (typeof items !== 'undefined') {
            $.extend(options, { dataSource: items });
        }

        // headerTemplate
        if (typeof headerTemplate !== 'undefined') {
            $.extend(options, { headerTemplate: headerTemplate });
        }

        // itemTemplate
        if (typeof itemTemplate !== 'undefined') {
            $.extend(options, { itemTemplate: itemTemplate });
        }

        // tagTemplate
        if (typeof tagTemplate !== 'undefined') {
            $.extend(options, { tagTemplate: tagTemplate });
        }

        // height
        if (typeof height !== 'undefined') {
            $.extend(options, { height: height });
        }
        if (filterFields !== null && Array.isArray(filterFields)) {
            $.extend(options, { filtering: function filtering(e) {
                    if (e.filter) {
                        var value;
                        var newFilter;

                        (function () {
                            var fields = filterFields;
                            value = e.filter.value;


                            var newFields = [];
                            fields.map(function (field) {
                                newFields.push({
                                    field: field,
                                    operator: "contains",
                                    value: value
                                });
                            });

                            newFilter = {
                                filters: newFields,
                                logic: "or"
                            };

                            e.sender.dataSource.filter(newFilter);
                            e.preventDefault();
                        })();
                    }
                    e.preventDefault();
                } });
        }
        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { method: 'POST', listField: 'resultValue.list', placeholder: $ps_locale.select, dataTextField: 'text', dataValueField: 'value', multiple: false, minLength: 0, maxSelectedItems: null, serverFiltering: false, serverPaging: false, pageSize: 10, filterFields: null };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }
        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$multiSelect = $('#' + this.id);
        this.multiSelect = this.$multiSelect.kendoMultiSelect(this.getOptions()).data('kendoMultiSelect');

        // Events
        this.multiSelect.bind('select', this.onSelect);
        this.multiSelect.bind('change', this.onChange);
        this.multiSelect.bind('open', this.onOpen);
        this.multiSelect.bind('close', this.onClose);
        this.multiSelect.bind('filtering', this.onFiltering);
        this.multiSelect.bind('dataBound', this.onDataBound);
    },
    render: function render() {
        // 필수 항목
        var _props2 = this.props;
        var className = _props2.className;
        var name = _props2.name;
        var multiple = _props2.multiple;


        return React.createElement('select', { id: this.id, name: name, multiple: multiple, className: classNames(className) });
    }
});

module.exports = MultiSelect;

},{"../services/Util":65,"classnames":2,"react":34}],52:[function(require,module,exports){
/**
 * NumericTextBox component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/31
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.NumericTextBox options={options} />
 *
 * Kendo NumericTextBox 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var NumericTextBox = React.createClass({
    displayName: 'NumericTextBox',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        name: PropTypes.string,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        format: PropTypes.string,
        value: PropTypes.number,
        step: PropTypes.number,
        min: PropTypes.number,
        max: PropTypes.number,
        decimals: PropTypes.number,
        placeholder: PropTypes.string,
        downArrowText: PropTypes.string,
        upArrowText: PropTypes.string
    },
    id: '',
    getOptions: function getOptions() {
        var _props = this.props;
        var format = _props.format;
        var value = _props.value;
        var step = _props.step;
        var min = _props.min;
        var max = _props.max;
        var decimals = _props.decimals;
        var placeholder = _props.placeholder;
        var downArrowText = _props.downArrowText;
        var upArrowText = _props.upArrowText;


        var options = {
            format: format,
            value: value,
            downArrowText: downArrowText,
            upArrowText: upArrowText
        };

        // step
        if (typeof step !== 'undefined') {
            $.extend(options, { step: step });
        }

        // min
        if (typeof min !== 'undefined') {
            $.extend(options, { min: min });
        }

        // max
        if (typeof max !== 'undefined') {
            $.extend(options, { max: max });
        }

        // decimals
        if (typeof decimals !== 'undefined') {
            $.extend(options, { decimals: decimals });
        }

        // placeholder
        if (typeof placeholder !== 'undefined') {
            $.extend(options, { placeholder: placeholder });
        }

        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { format: 'n0', value: 1, downArrowText: '', upArrowText: '' };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$numericTextBox = $('#' + this.id);
        this.numericTextBox = this.$numericTextBox.kendoNumericTextBox(this.getOptions()).data('kendoNumericTextBox');
    },
    render: function render() {
        // 필수 항목
        var _props2 = this.props;
        var className = _props2.className;
        var name = _props2.name;
        var width = _props2.width;


        return React.createElement('input', { id: this.id, name: name, style: { width: width } });
    }
});

module.exports = NumericTextBox;

},{"../services/Util":65,"classnames":2,"react":34}],53:[function(require,module,exports){
/**
 * PanelBar component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/18
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.PanelBar options={options} />
 *
 * Kendo PanelBar 라이브러리에 종속적이다.
 */
'use strict';

var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var PanelBar = React.createClass({
    displayName: 'PanelBar',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        contentUrls: PropTypes.array
    },
    id: '',
    expand: function expand($item) {
        this.panelBar.expand($item);
    },
    onSelect: function onSelect(e) {},
    getOptions: function getOptions() {
        return {};
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { value: 'default value' };
    },
    getInitialState: function getInitialState() {
        // 컴포넌트가 마운트되기 전 (한번 호출) / 리턴값은 this.state의 초기값으로 사용
        return { data: [] };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$panelBar = $('#' + this.id);
        this.panelBar = this.$panelBar.kendoPanelBar(this.getOptions()).data('kendoPanelBar');

        // Events
        this.panelBar.bind('select', this.onSelect);
    },
    render: function render() {
        // 필수 항목
        var _props = this.props;
        var className = _props.className;
        var children = _props.children;


        return React.createElement(
            'ul',
            { id: this.id, className: classNames(className) },
            children
        );
    }
});

var PanelBarPane = React.createClass({
    displayName: 'PanelBarPane',
    propTypes: {
        id: PropTypes.string,
        title: PropTypes.string,
        items: PropTypes.array
    },
    getContent: function getContent() {
        var _props2 = this.props;
        var items = _props2.items;
        var children = _props2.children;
        var contentUrls = _props2.contentUrls;

        var content;

        if (items) {
            var _items = items.map(function (item) {
                if ((typeof item === 'undefined' ? 'undefined' : _typeof(item)) === 'object') {
                    var icon, text;
                    if (item.hasOwnProperty('spriteCssClass')) {
                        icon = React.createElement('span', { className: classNames(item.spriteCssClass) });
                    }
                    if (item.hasOwnProperty('imageUrl')) {
                        icon = React.createElement('img', { src: item.imageUrl });
                    }

                    if (item.hasOwnProperty('text')) {
                        text = item.text;
                    }

                    var data;
                    if (item.hasOwnProperty('data')) {
                        data = { data: JSON.stringify(item.data) };
                    }
                    //return (<li key={Util.uniqueID()}>{icon} {text}</li>);
                    return React.createElement(
                        'li',
                        data,
                        icon,
                        ' ',
                        text
                    );
                    //return <PanelBarPaneItem data={data}>{icon} {text}</PanelBarPaneItem>;
                } else {
                    //return (<li key={Util.uniqueID()}>{item}</li>);
                    return React.createElement(
                        'li',
                        null,
                        item
                    );
                }
            });
            content = React.createElement(
                'ul',
                null,
                _items
            );
        } else if (children) {
            content = children;
        } else {
            // contentUrls 이라고 판단
            content = React.createElement('div', null);
        }

        return content;
    },
    render: function render() {
        // 필수 항목
        var _props3 = this.props;
        var id = _props3.id;
        var title = _props3.title;


        var _id;
        if (id) {
            _id = { id: id };
        }
        return React.createElement(
            'li',
            _id,
            title,
            this.getContent()
        );
    }
});

var PanelBarPaneItem = React.createClass({
    displayName: 'PanelBarPaneItem',

    render: function render() {
        var data = this.props.data;

        return React.createElement(
            'li',
            data,
            this.props.children
        );
    }
});

module.exports = {
    PanelBar: PanelBar,
    PanelBarPane: PanelBarPane
};

},{"../services/Util":65,"classnames":2,"react":34}],54:[function(require,module,exports){
/**
 * ProgressBar component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/09/06
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.ProgressBar options={options} />
 *
 * Kendo ProgressBar 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var ProgressBar = React.createClass({
    displayName: 'ProgressBar',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        type: PropTypes.oneOf(['value', 'percent', 'chunk']),
        value: PropTypes.number,
        animation: PropTypes.oneOfType([PropTypes.number, PropTypes.bool, PropTypes.object]),
        min: PropTypes.number,
        max: PropTypes.number,
        enable: PropTypes.bool,
        orientation: PropTypes.oneOf(['horizontal', 'vertical']),
        onChange: PropTypes.func,
        onComplete: PropTypes.func
    },
    id: '',
    //-----------------------------
    // api
    value: function value(v) {
        if (arguments.length == 0) {
            return this.progressBar.value();
        } else {
            return this.progressBar.value(v);
        }
    },
    enable: function enable(b) {
        if (arguments.length == 0) {
            this.progressBar.enable();
        } else {
            this.progressBar.enable(b);
        }
    },
    //-----------------------------
    // event
    onChange: function onChange(e) {

        if (typeof this.props.onChange !== 'undefined') {
            this.props.onChange(e.value);
        }
    },
    onComplete: function onComplete(e) {

        if (typeof this.props.onComplete !== 'undefined') {
            this.props.onComplete(e.value);
        }
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var type = _props.type;
        var value = _props.value;
        var animation = _props.animation;
        var enable = _props.enable;
        var orientation = _props.orientation;

        // animation

        var _animation;
        if (typeof animation === 'number') {
            _animation = { duration: animation };
        } else if (animation === true) {
            _animation = { duration: 600 };
        } else {
            _animation = animation;
        }

        var options = {
            type: type,
            value: value,
            animation: _animation,
            enable: enable,
            orientation: orientation
        };

        // min
        if (typeof min !== 'undefined') {
            $.extend(options, { min: min });
        }

        // max
        if (typeof max !== 'undefined') {
            $.extend(options, { max: max });
        }

        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { type: 'value', value: 0, animation: { duration: 600 }, enable: true, orientation: 'horizontal' };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$progressBar = $('#' + this.id);
        this.progressBar = this.$progressBar.kendoProgressBar(this.getOptions()).data('kendoProgressBar');

        // Events
        this.progressBar.bind('change', this.onChange);
        this.progressBar.bind('complete', this.onComplete);
    },
    render: function render() {
        // 필수 항목
        var className = this.props.className;


        return React.createElement('div', { id: this.id, className: classNames(className) });
    }
});

module.exports = ProgressBar;

},{"../services/Util":65,"classnames":2,"react":34}],55:[function(require,module,exports){
/**
 * TreeView component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/04/15
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.TreeView options={options} />
 *
 * Kendo TreeView 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var TreeView = React.createClass({
    displayName: 'TreeView',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        options: PropTypes.object,
        host: PropTypes.string,
        url: PropTypes.string,
        method: PropTypes.string,
        items: PropTypes.array,
        data: PropTypes.object,
        onDemand: PropTypes.bool,
        dataTextField: PropTypes.oneOfType([PropTypes.string, PropTypes.array]),
        childrenField: PropTypes.string,
        checkboxes: PropTypes.bool,
        dragAndDrop: PropTypes.bool,
        template: PropTypes.string,
        onSelect: PropTypes.func,
        onChange: PropTypes.func,
        onClick: PropTypes.func,
        onDblclick: PropTypes.func,
        onCollapse: PropTypes.func,
        onExpand: PropTypes.func
    },
    id: '',
    //-----------------------------
    // api
    dataItem: function dataItem(node) {
        return this.treeView.dataItem(node);
    },
    parent: function parent(node) {
        return this.treeView.parent(node);
    },
    select: function select(node) {
        if (arguments.length === 0) {
            return this.treeView.select();
        } else {
            return this.treeView.select(node);
        }
    },
    append: function append(nodeData, parentNode, success) {
        return this.treeView.append(nodeData, parentNode, success);
    },
    remove: function remove(node) {
        this.treeView.remove(node);
    },
    expand: function expand(node) {
        this.treeView.expand(node);
    },
    expandAll: function expandAll() {
        this.treeView.expand('.k-item');
    },
    collapse: function collapse(node) {
        this.treeView.collapse(node);
    },
    collapseAll: function collapseAll() {
        this.treeView.collapse('.k-item');
    },
    enable: function enable(node) {
        this.treeView.enable(node);
    },
    disable: function disable(node) {
        this.treeView.enable(node, false);
    },
    enableAll: function enableAll() {
        this.treeView.enable('.k-item');
    },
    disableAll: function disableAll() {
        this.treeView.enable('.k-item', false);
    },
    filter: function filter(value) {
        if (value !== "") {
            this.treeView.dataSource.filter({
                field: this.props.dataTextField,
                operator: 'contains',
                value: value
            });
        } else {
            this.treeView.dataSource.filter({});
        }
    },
    sort: function sort(dir) {
        // dir은 'asc' or 'desc'
        this.treeView.dataSource.sort({
            field: this.props.dataTextField,
            dir: dir
        });
    },
    //-----------------------------
    // event
    onSelect: function onSelect(event) {
        // 같은 노드를 select 할 경우 이벤트 발생하도록 하기 위해
        // click 이벤트시 k-state-selected 제거하고
        // select 이벤트시 추가한다.
        //console.log('treeview select');


        //$(event.node).find('span.k-in').addClass('k-state-selected');
        var node, selectedItem;

        if (typeof event.node === 'undefined') {
            //console.log('dispatch click');
            node = event;
            //$(node).find('span.k-in').addClass('k-state-selected');
            $(node).children(':first').find('span.k-in').addClass('k-state-selected');
            this.onSelectCall = false;
        } else {
            //console.log('click');
            node = event.node;
            this.onSelectCall = true;
        }
        selectedItem = this.treeView.dataItem(node);
        //var selectedItem = this.treeView.dataItem(event.node);
        //console.log(selectedItem);

        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(event, selectedItem);

            //event.stopImmediatePropagation();
        }
    },
    onCheck: function onCheck(event) {
        //console.log("Checkbox changed: ");
        //console.log(event.node);
    },
    onChange: function onChange(event) {
        //console.log("Selection changed");
        //console.log(event);

        if (typeof this.props.onChange === 'function') {
            //var data = event.node;
            this.props.onChange(event);
            //event.stopImmediatePropagation();
        }
    },
    onCollapse: function onCollapse(event) {
        //console.log("Collapsing ");
        //console.log(event.node);
        var selectedItem = this.treeView.dataItem(event.node);
        //console.log(selectedItem);
        if (typeof this.props.onCollapse === 'function') {
            this.props.onCollapse(event, selectedItem);

            //event.stopImmediatePropagation();
        }
    },
    onExpand: function onExpand(event) {
        //console.log("Expanding ");
        //console.log(event.node);
        var selectedItem = this.treeView.dataItem(event.node);
        //console.log(selectedItem);
        if (typeof this.props.onExpand === 'function') {
            this.props.onExpand(event, selectedItem);

            //event.stopImmediatePropagation();
        }
    },
    onDragStart: function onDragStart(event) {
        //console.log("Started dragging ");
        //console.log(event.sourceNode);
        var selectedItem = this.treeView.dataItem(event.sourceNode);
        if (typeof this.props.onDragStart === 'function') {
            var item = selectedItem;
            this.props.onDragStart(event, item);

            //event.stopImmediatePropagation();
        }
    },
    onDrag: function onDrag(event) {
        //console.log("Dragging ");
        //console.log(event.sourceNode);
        var selectedItem = this.treeView.dataItem(event.sourceNode),
            parentNode = this.treeView.parent(event.dropTarget),
            parentItem = this.treeView.dataItem(parentNode);

        //console.log(parentItem);
        if (typeof this.props.onDrag === 'function') {
            this.props.onDrag(event, selectedItem, parentItem);

            //event.stopImmediatePropagation();
        }
    },
    onDrop: function onDrop(event) {
        //console.log("Dropped ");
        //console.log(event.valid);
        //console.log(event.sourceNode);
        //console.log(event.destinationNode);
        var selectedItem = this.treeView.dataItem(event.sourceNode),
            parentNode = this.treeView.parent(event.destinationNode),
            parentItem = this.treeView.dataItem(parentNode);

        //console.log(parentItem);
        if (typeof this.props.onDrop === 'function') {
            this.props.onDrop(event, selectedItem, parentItem);

            //event.stopImmediatePropagation();
        }
    },
    onDragEnd: function onDragEnd(event) {
        //console.log("Finished dragging ");
        //console.log(event.sourceNode);
        var selectedItem = this.treeView.dataItem(event.sourceNode),
            parentNode = this.treeView.parent(event.destinationNode),
            parentItem = this.treeView.dataItem(parentNode);

        if (typeof this.props.onDragEnd === 'function') {
            this.props.onDragEnd(event, selectedItem, parentItem);

            //event.stopImmediatePropagation();
        }
    },
    onNavigate: function onNavigate(event) {
        //console.log("Navigate ");
        //console.log(event.node);
    },
    onDataBound: function onDataBound(event) {
        console.log('onDataBound');
    },
    onClick: function onClick(event) {
        /*
        var node = $(event.target).closest(".k-item"),
            selectedItem = this.treeView.dataItem(node);
        console.log('treeview click');
        //console.log(selectedItem);
        if(typeof this.props.onClick === 'function') {
            this.props.onClick(event, selectedItem);
             //event.stopImmediatePropagation();
        }
        */
        // 같은 노드를 select 할 경우 이벤트 발생하도록 하기 위해
        // click 이벤트시 k-state-selected 제거하고
        // select 이벤트시 추가한다.
        //console.log($(event.target).hasClass('k-state-selected'));
        //console.log('treeview onclick');
        if (this.onSelectCall === false) {
            var node = $(event.target).closest(".k-item");
            $(event.target).removeClass('k-state-selected');
            this.treeView.trigger('select', node);
        }
        this.onSelectCall = false;
    },
    onDblclick: function onDblclick(event) {
        var node = $(event.target).closest(".k-item"),
            selectedItem = this.treeView.dataItem(node);
        //console.log('onDblclick');
        //console.log(selectedItem);

        if (typeof this.props.onDblclick === 'function') {
            this.props.onDblclick(event, selectedItem);

            //event.stopImmediatePropagation();
        }
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var host = _props.host;
        var url = _props.url;
        var method = _props.method;
        var data = _props.data;
        var items = _props.items;
        var onDemand = _props.onDemand;
        var dataTextField = _props.dataTextField;
        var childrenField = _props.childrenField;
        var checkboxes = _props.checkboxes;
        var dragAndDrop = _props.dragAndDrop;
        var template = _props.template;


        var options = {
            checkboxes: checkboxes, // true or false
            dataTextField: dataTextField,
            dataSource: [],
            dragAndDrop: dragAndDrop // true or false
        };

        //JSON.parse(JSON.stringify(data.treeVO).split('"children":').join('"items":')).items

        // dataSource
        // url
        if (typeof url !== 'undefined' && childrenField != "children") {

            $.extend(options, { dataSource: new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: host && host !== null && host.length > 0 ? host + url : url,
                            type: method,
                            dataType: 'json',
                            data: data,
                            contentType: 'application/json; charset=utf-8'
                        },
                        parameterMap: function parameterMap(data, type) {
                            return JSON.stringify(data);
                        }
                    },
                    schema: {
                        model: {
                            children: childrenField
                        }
                    }
                }) });
        } else if (typeof url !== 'undefined' && childrenField == "children") {
            $.extend(options, { dataSource: new kendo.data.HierarchicalDataSource({
                    transport: {
                        read: {
                            url: host && host !== null && host.length > 0 ? host + url : url,
                            type: method,
                            dataType: 'json',
                            data: data,
                            contentType: 'application/json; charset=utf-8'
                        },
                        parameterMap: function parameterMap(data, type) {
                            return JSON.stringify(data);
                        }
                    },
                    schema: {
                        model: {
                            children: "items"
                        },
                        data: function data(response) {
                            response.treeVO = JSON.parse(JSON.stringify(response.treeVO).split('"children":').join('"items":')).items;
                            return response.treeVO;
                        }
                    }
                }) });
        } else if (typeof items !== 'undefined') {
            $.extend(options, { dataSource: new kendo.data.HierarchicalDataSource({
                    data: items,
                    schema: {
                        model: {
                            children: childrenField
                        }
                    }
                }) });
        }

        // template
        if (typeof template !== 'undefined') {
            $.extend(options, { template: template });
        }

        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { onDemand: false, method: 'POST', dataTextField: 'text', childrenField: 'items', dragAndDrop: false };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$treeView = $('#' + this.id);
        this.treeView = this.$treeView.kendoTreeView(this.getOptions()).data('kendoTreeView');

        // Events
        this.treeView.bind('select', this.onSelect);
        this.treeView.bind('check', this.onCheck);
        this.treeView.bind('change', this.onChange);
        this.treeView.bind('collapse', this.onCollapse);
        this.treeView.bind('expand', this.onExpand);

        /* drag & drop events */
        this.treeView.bind('dragstart', this.onDragStart);
        this.treeView.bind('drag', this.onDrag);
        this.treeView.bind('drop', this.onDrop);
        this.treeView.bind('dragend', this.onDragEnd);
        this.treeView.bind('navigate', this.onNavigate);

        //this.$treeView.find('.k-in').on('click', this.onClick);       // click이 select 보다 먼저 발생
        this.$treeView.on('click', '.k-in', this.onClick); // click이 select 보다 나중에 발생
        this.$treeView.find('.k-in').on('dblclick', this.onDblclick);
    },
    render: function render() {
        // 필수 항목
        var className = this.props.className;


        return React.createElement('div', { id: this.id, className: classNames(className) });
    }
});

module.exports = TreeView;

},{"../services/Util":65,"classnames":2,"react":34}],56:[function(require,module,exports){
/**
 * Window component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/09/06
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.Window options={options} />
 *
 * Kendo Window 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;
var classNames = require('classnames');

var Util = require('../services/Util');

var Window = React.createClass({
    displayName: 'Window',
    propTypes: {
        id: PropTypes.string,
        className: PropTypes.string,
        title: PropTypes.string,
        visible: PropTypes.bool,
        actions: PropTypes.array, // ['Pin', 'Refresh', 'Minimize', 'Maximize', 'Close']
        modal: PropTypes.bool,
        resizable: PropTypes.bool,
        width: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        height: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
        minWidth: PropTypes.number,
        minHeight: PropTypes.number,
        onOpen: PropTypes.func,
        onClose: PropTypes.func,
        onResize: PropTypes.func,
        onDragStart: PropTypes.func,
        onDragEnd: PropTypes.func,
        onRefresh: PropTypes.func,
        onActivate: PropTypes.func,
        onDeactivate: PropTypes.func
    },
    id: '',
    //-----------------------------
    // api

    //-----------------------------
    // event
    onOpen: function onOpen(e) {

        if (typeof this.props.onOpen !== 'undefined') {
            this.props.onOpen(e);
        }
    },
    onClose: function onClose(e) {

        if (typeof this.props.onClose !== 'undefined') {
            this.props.onClose(e);
        }
    },
    onResize: function onResize(e) {

        if (typeof this.props.onResize !== 'undefined') {
            this.props.onResize(e);
        }
    },
    onDragStart: function onDragStart(e) {

        if (typeof this.props.onDragStart !== 'undefined') {
            this.props.onDragStart(e);
        }
    },
    onDragEnd: function onDragEnd(e) {

        if (typeof this.props.onDragEnd !== 'undefined') {
            this.props.onDragEnd(e);
        }
    },
    onRefresh: function onRefresh(e) {

        if (typeof this.props.onRefresh !== 'undefined') {
            this.props.onRefresh(e);
        }
    },
    onActivate: function onActivate(e) {

        if (typeof this.props.onActivate !== 'undefined') {
            this.props.onActivate(e);
        }
    },
    onDeactivate: function onDeactivate(e) {

        if (typeof this.props.onDeactivate !== 'undefined') {
            this.props.onDeactivate(e);
        }
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var title = _props.title;
        var visible = _props.visible;
        var actions = _props.actions;
        var modal = _props.modal;
        var resizable = _props.resizable;
        var width = _props.width;
        var height = _props.height;
        var minWidth = _props.minWidth;
        var minHeight = _props.minHeight;


        var options = {
            title: title,
            visible: visible,
            actions: actions,
            modal: modal,
            resizable: resizable,
            minWidth: minWidth,
            minHeight: minHeight
        };

        // width
        if (typeof width !== 'undefined') {
            $.extend(options, { width: width });
        }

        // height
        if (typeof height !== 'undefined') {
            $.extend(options, { height: height });
        }

        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { title: 'Title', visible: true, actions: ['Pin', 'Minimize', 'Maximize', 'Close'], modal: false, resizable: true, minWidth: 150, minHeight: 100 };
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$window = $('#' + this.id);
        this.window = this.$window.kendoWindow(this.getOptions()).data('kendoWindow');

        // Events
        this.window.bind('open', this.onOpen);
        this.window.bind('close', this.onClose);
        this.window.bind('resize', this.onResize);
        this.window.bind('dragstart', this.onDragStart);
        this.window.bind('dragend', this.onDragEnd);
        this.window.bind('refresh', this.onRefresh);
        this.window.bind('activate', this.onActivate);
        this.window.bind('deactivate', this.onDeactivate);
    },
    render: function render() {
        // 필수 항목
        var _props2 = this.props;
        var className = _props2.className;
        var children = _props2.children;


        return React.createElement(
            'div',
            { id: this.id, className: classNames(className) },
            children
        );
    }
});

module.exports = Window;

},{"../services/Util":65,"classnames":2,"react":34}],57:[function(require,module,exports){
/**
 * Tab component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/06
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.Tab />
 *
 * Kendo TabStrip 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');

var Tab = React.createClass({
    displayName: 'Tab',
    render: function render() {
        // 필수 항목
        return React.createElement(
            'li',
            null,
            this.props.children
        );
    }
});

module.exports = Tab;

},{"react":34}],58:[function(require,module,exports){
/**
 * TabContent component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/06
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.TabContent />
 *
 * Kendo TabStrip ���̺귯���� �������̴�.
 */
'use strict';

var React = require('react');

var TabContent = React.createClass({
    displayName: 'TabContent',
    render: function render() {
        // �ʼ� �׸�
        return React.createElement(
            'div',
            null,
            this.props.children
        );
    }
});

module.exports = TabContent;

},{"react":34}],59:[function(require,module,exports){
/**
 * TabStrip component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/06
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.TabStrip className={className} selectedIndex={0} onSelect={func} />
 *
 * Kendo TabStrip 라이브러리에 종속적이다.
 */
'use strict';

var React = require('react');
var PropTypes = require('react').PropTypes;

var Util = require('../../services/Util');

var TabStrip = React.createClass({
    displayName: 'TabStrip',
    propTypes: {
        className: PropTypes.string,
        selectedIndex: PropTypes.number,
        contentUrls: PropTypes.array,
        animation: PropTypes.oneOfType([PropTypes.object, PropTypes.bool]),
        tabPosition: PropTypes.oneOf(['left', 'right', 'bottom']),
        onSelect: PropTypes.func,
        onActivate: PropTypes.func,
        onShow: PropTypes.func,
        onContentLoad: PropTypes.func,
        onError: PropTypes.func
    },
    id: '',
    select: function select(index) {
        this.tabstrip.select(index);
    },
    onSelect: function onSelect(e) {
        //console.log('onSelect');
        //console.log(e);
        if (typeof this.props.onSelect === 'function') {
            this.props.onSelect(e); // e.item, index 알아내서 넘기자
        }
    },
    onActivate: function onActivate(e) {
        //console.log('onActivate');
        //console.log(e);
        if (typeof this.props.onActivate === 'function') {
            this.props.onActivate(e);
        }
    },
    onShow: function onShow(e) {
        //console.log('onShow');
        //console.log(e);
        if (typeof this.props.onShow === 'function') {
            this.props.onShow(e);
        }
    },
    onContentLoad: function onContentLoad(e) {
        //console.log('onContentLoad');
        //console.log(e);
        if (typeof this.props.onContentLoad === 'function') {
            this.props.onContentLoad(e);
        }
    },
    onError: function onError(e) {
        //console.log('onError');
        //console.log(e);
        if (typeof this.props.onError === 'function') {
            this.props.onError(e);
        }
    },
    getChildren: function getChildren() {
        var children = this.props.children,
            count = 0;

        return React.Children.map(children, function (child) {
            if (child === null) {
                return null;
            }
            var result;

            // Tabs
            if (count++ === 0) {
                result = React.cloneElement(child, {
                    children: React.Children.map(child.props.children, function (tab) {
                        if (tab === null) {
                            return null;
                        }

                        return React.cloneElement(tab);
                    })
                });
            } else {
                // TabContent
                result = React.cloneElement(child);
            }
            return result;
        });
    },
    getOptions: function getOptions() {
        var _props = this.props;
        var animation = _props.animation;
        var contentUrls = _props.contentUrls;
        var tabPosition = _props.tabPosition;

        // animation (false|object) true는 유효하지 않음

        var _animation;
        if (typeof animation === 'boolean' && animation === true) {
            _animation = {
                open: {
                    effects: 'fadeIn'
                }
            };
        } else {
            _animation = animation;
        }

        var options = {
            animation: _animation
        };

        // tabPosition
        if (tabPosition) {
            $.extend(options, { tabPosition: tabPosition });
        }

        // contentUrls
        if (contentUrls) {
            $.extend(options, { contentUrls: contentUrls });
        }

        return options;
    },
    getDefaultProps: function getDefaultProps() {
        // 클래스가 생성될 때 한번 호출되고 캐시된다.
        // 부모 컴포넌트에서 prop이 넘어오지 않은 경우 (in 연산자로 확인) 매핑의 값이 this.props에 설정된다.
        return { selectedIndex: 0, animation: false };
    },
    getInitialState: function getInitialState() {

        return {};
    },
    componentWillMount: function componentWillMount() {
        // 최초 렌더링이 일어나기 직전(한번 호출)
        var id = this.props.id;
        if (typeof id === 'undefined') {
            id = Util.getUUID();
        }

        this.id = id;
    },
    componentDidMount: function componentDidMount() {
        // 최초 렌더링이 일어난 다음(한번 호출)
        this.$tabstrip = $('#' + this.id);
        this.tabstrip = this.$tabstrip.kendoTabStrip(this.getOptions()).data('kendoTabStrip');

        // Events
        this.tabstrip.bind('select', this.onSelect);
        this.tabstrip.bind('activate', this.onActivate);
        this.tabstrip.bind('show', this.onShow);
        this.tabstrip.bind('contentLoad', this.onContentLoad);
        this.tabstrip.bind('error', this.onError);

        this.select(this.props.selectedIndex);
    },
    render: function render() {
        // 필수 항목
        return React.createElement(
            'div',
            { id: this.id, className: this.props.className },
            this.getChildren()
        );
    }
});

module.exports = TabStrip;

},{"../../services/Util":65,"react":34}],60:[function(require,module,exports){
/**
 * Tabs component
 *
 * version <tt>$ Version: 1.0 $</tt> date:2016/08/06
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 *
 * example:
 * <Puf.Tabs />
 *
 * Kendo TabStrip ���̺귯���� �������̴�.
 */
'use strict';

var React = require('react');

var Tabs = React.createClass({
    displayName: 'Tabs',
    render: function render() {
        // �ʼ� �׸�
        return React.createElement(
            'ul',
            null,
            this.props.children
        );
    }
});

module.exports = Tabs;

},{"react":34}],61:[function(require,module,exports){
/**
 * ps-util services
 * 
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/01
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 * 
 * example:
 * app.controller('Ctrl', ['$scope', 'psUtil', function($scope, psUtil) {
 * 	   var rootPath = psUtil.getRootPath();
 * }]);
 * 
 */
'use strict';

function getDateToString(date) {
	var year = date.getFullYear(),
	    month = zerofill(date.getMonth() + 1, 2),
	    day = zerofill(date.getDate(), 2),
	    hours = date.getHours() < 0 ? '00' : zerofill(date.getHours(), 2),
	    // daterangepicker hours 9시간 오버표시되는 버그로 인해 빼준다.
	minutes = zerofill(date.getMinutes(), 2),
	    seconds = zerofill(date.getSeconds(), 2),
	    dateString = year + '-' + month + '-' + day + ' ' + hours + ':' + minutes + ':' + seconds;

	return dateString;
}

function zerofill(n, digits) {
	var zero = '';
	n = n.toString();

	if (n.length < digits) {
		for (var i = 0; i < digits - n.length; i++) {
			zero += '0';
		}
	}

	return zero + n;
}

module.exports = {
	getDateToString: getDateToString
};

},{}],62:[function(require,module,exports){
/**
 * NumberUtil services
 * 
 * version <tt>$ Version: 1.0 $</tt> date:2016/05/19
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 * 
 * example:
 * var NumberUtil = require('../services/NumberUtil');
 * NumberUtil.digit();
 *
 * Puf.NumberUtil.digit();
 */
'use strict';

function digit(i) {
  var displayText;
  if (i < 10) {
    displayText = '0' + i;
  } else {
    displayText = i.toString();
  }
  return displayText;
}

module.exports = {
  digit: digit
};

},{}],63:[function(require,module,exports){
/**
 * RegExp services
 * 
 * version <tt>$ Version: 1.0 $</tt> date:2016/05/20
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 * 
 * example:
 * var RegExp = require('../services/RegExp');
 * RegExp.checkEmail(strValue);
 *
 * Puf.RegExp.checkEmail(strValue);
 */
'use strict';

var regExp_EMAIL = /[0-9a-zA-Z][_0-9a-zA-Z-]*@[_0-9a-zA-Z-]+(\.[_0-9a-zA-Z-]+){1,2}$/;

function checkEmail(strValue) {
  if (!strValue.match(regExp_EMAIL)) {
    return false;
  }
  return true;
}

module.exports = {
  checkEmail: checkEmail
};

},{}],64:[function(require,module,exports){
/**
 * Resource services
 * 
 * version <tt>$ Version: 1.0 $</tt> date:2016/06/03
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 * 
 * example:
 * Puf.Resource.loadResource();
 * Puf.Resource.i18n(key);
 *
 * 다국어 처리
 */
'use strict';

// load properties

var loadResource = function loadResource(name, path, mode, language, callback) {

	$.i18n.properties({
		name: name,
		path: path,
		mode: mode,
		language: language,
		callback: callback
		/*
  function() {
  	// Accessing a simple value through the map
  	jQuery.i18n.prop('msg_hello');
  	// Accessing a value with placeholders through the map
  	jQuery.i18n.prop('msg_complex', 'John');
  			// Accessing a simple value through a JS variable
  	alert(msg_hello +' '+ msg_world);
  	// Accessing a value with placeholders through a JS function
  	alert(msg_complex('John'));
  	alert(msg_hello);
     }
     */
	});
};

var i18n = function i18n(key) {
	//var args = '\'' + key + '\'';
	//for (var i=1; i<arguments.length; i++) {
	//   args += ', \'' + arguments[i] + '\'';
	//}
	//return eval('$.i18n.prop(' + args + ')');
	return $.i18n.prop.apply(this, arguments);
};

var i18nByKey = function i18nByKey(key) {
	//var args = '\'' + key + '\'';
	//for (var i=1; i<arguments.length; i++) {
	//	args += ', \'' + $.i18n.prop(arguments[i]) + '\'';
	//}
	//return eval('$.i18n.prop(' + args + ')');
	var args = [key];
	for (var i = 1; i < arguments.length; i++) {
		args.push($.i18n.prop(arguments[i]));
	}
	return $.i18n.prop.apply(this, args);
};

module.exports = {
	loadResource: loadResource,
	i18n: i18n,
	i18nByKey: i18nByKey
};

},{}],65:[function(require,module,exports){
/**
 * Util services
 * 
 * version <tt>$ Version: 1.0 $</tt> date:2016/03/01
 * author <a href="mailto:hrahn@nkia.co.kr">Ahn Hyung-Ro</a>
 * 
 * example:
 * var Util = require('../services/Util');
 * Util.getUUID();
 *
 */
'use strict';

function getUUID() {
	return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
		var r = Math.random() * 16 | 0,
		    v = c == 'x' ? r : r & 0x3 | 0x8;
		return v.toString(16);
	});
}

function uniqueID() {
	return 'id-' + Math.random().toString(36).substr(2, 9);
}

function sleep(milliseconds) {
	var start = new Date().getTime();
	for (var i = 0; i < 1e7; i++) {
		if (new Date().getTime() - start > milliseconds) {
			break;
		}
	}
}

// 시작페이지로 설정
function setStartPage(obj, url) {
	obj.style.behavior = 'url(#default#homepage)';
	//obj.setHomePage('http://internet.scourt.go.kr/');
	obj.setHomePage(url);
}

// 쿠키 설정
/*
function setCookie(name, value, expires) {
	// alert(name + ", " + value + ", " + expires);
	document.cookie = name + "=" + escape(value) + "; path=/; expires=" + expires.toGMTString();
}
*/
function setCookie(cname, cvalue, exdays, cdomain) {
	var d = new Date();
	d.setTime(d.getTime() + exdays * 24 * 60 * 60 * 1000);
	var expires = 'expires=' + d.toUTCString();
	var domain;
	if (cdomain) {
		domain = '; domain=' + cdomain;
	}
	document.cookie = cname + '=' + escape(cvalue) + '; path=/; ' + expires + domain;
}

// 쿠키 가져오기
/*
function getCookie(Name) {
	var search = Name + "="
	if (document.cookie.length > 0) { // 쿠키가 설정되어 있다면
		offset = document.cookie.indexOf(search)
		if (offset != -1) { // 쿠키가 존재하면
			offset += search.length
			// set index of beginning of value
			end = document.cookie.indexOf(";", offset)
			// 쿠키 값의 마지막 위치 인덱스 번호 설정
			if (end == -1)
				end = document.cookie.length
			return unescape(document.cookie.substring(offset, end))
		}
	}
	return "";
}
*/
function getCookie(cname) {
	var name = cname + '=';
	var ca = document.cookie.split(';');
	for (var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') {
			c = c.substring(1);
		}
		if (c.indexOf(name) == 0) {
			return unescape(c.substring(name.length, c.length));
		}
	}
	return '';
}

module.exports = {
	getUUID: getUUID,
	uniqueID: uniqueID,
	sleep: sleep,
	setCookie: setCookie,
	getCookie: getCookie
};

//angular.module('ps.services.util', [])
//.factory('psUtil', ['$window', '$location', function($window, $location) {
//	var factory = {};
//	factory.show = function(msg) {
//        $window.alert(msg);
//    };
//
//    factory.reverse = function(name) {
//		return name.split("").reverse().join("");
//	};
//
//	// root path
//	factory.getRootPath = function() {
//		// js에서 ContextPath 를 얻을 수 없음 - Root Path를 얻어서 응용하자.
//		/*var offset=location.href.indexOf(location.host)+location.host.length;
//	    var ctxPath=location.href.substring(offset,location.href.indexOf('/',offset+1));
//	    return ctxPath;*/
//
//	    var offset = $window.location.href.indexOf($window.location.host) + $window.location.host.length;
//	    var ctxPath = $window.location.href.substring(offset, $window.location.href.indexOf('/', offset + 1));
//	    return ctxPath;
//	};
//
//	// uuid
//	factory.getUUID = function() {
//		return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
//			var r = Math.random()*16|0, v = c == 'x' ? r : (r&0x3|0x8);
//			return v.toString(16);
//		});
//	};
//
//	// tooltip
//	factory.tooltip = function(selector) {
//
//		if(typeof selector === 'undefined') {
//			selector = '[data-toggle="tooltip"]';
//		}
////		$(selector).bsTooltip();
//		$(selector).tooltip();
//	};
//
//    return factory;
//}]);

},{}]},{},[35])(35)
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbIm5vZGVfbW9kdWxlcy9icm93c2VyaWZ5L25vZGVfbW9kdWxlcy9icm93c2VyLXBhY2svX3ByZWx1ZGUuanMiLCJub2RlX21vZHVsZXMvYnJvd3NlcmlmeS9ub2RlX21vZHVsZXMvcHJvY2Vzcy9icm93c2VyLmpzIiwibm9kZV9tb2R1bGVzL2NsYXNzbmFtZXMvaW5kZXguanMiLCJub2RlX21vZHVsZXMvb2JqZWN0LWFzc2lnbi9pbmRleC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvS2V5RXNjYXBlVXRpbHMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL1Bvb2xlZENsYXNzLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9SZWFjdC5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvUmVhY3RDaGlsZHJlbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvUmVhY3RDbGFzcy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvUmVhY3RDb21wb25lbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL1JlYWN0Q29tcG9uZW50VHJlZUhvb2suanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL1JlYWN0Q3VycmVudE93bmVyLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9SZWFjdERPTUZhY3Rvcmllcy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvUmVhY3RFbGVtZW50LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9SZWFjdEVsZW1lbnRWYWxpZGF0b3IuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL1JlYWN0Tm9vcFVwZGF0ZVF1ZXVlLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9SZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvUmVhY3RQcm9wVHlwZUxvY2F0aW9ucy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvUmVhY3RQcm9wVHlwZXMuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL1JlYWN0UHJvcFR5cGVzU2VjcmV0LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9SZWFjdFB1cmVDb21wb25lbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL1JlYWN0VmVyc2lvbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvY2FuRGVmaW5lUHJvcGVydHkuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL2NoZWNrUmVhY3RUeXBlU3BlYy5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvZ2V0SXRlcmF0b3JGbi5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9saWIvb25seUNoaWxkLmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L2xpYi9yZWFjdFByb2RJbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvbGliL3RyYXZlcnNlQWxsQ2hpbGRyZW4uanMiLCJub2RlX21vZHVsZXMvcmVhY3Qvbm9kZV9tb2R1bGVzL2ZianMvbGliL2VtcHR5RnVuY3Rpb24uanMiLCJub2RlX21vZHVsZXMvcmVhY3Qvbm9kZV9tb2R1bGVzL2ZianMvbGliL2VtcHR5T2JqZWN0LmpzIiwibm9kZV9tb2R1bGVzL3JlYWN0L25vZGVfbW9kdWxlcy9mYmpzL2xpYi9pbnZhcmlhbnQuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qvbm9kZV9tb2R1bGVzL2ZianMvbGliL2tleU1pcnJvci5qcyIsIm5vZGVfbW9kdWxlcy9yZWFjdC9ub2RlX21vZHVsZXMvZmJqcy9saWIva2V5T2YuanMiLCJub2RlX21vZHVsZXMvcmVhY3Qvbm9kZV9tb2R1bGVzL2ZianMvbGliL3dhcm5pbmcuanMiLCJub2RlX21vZHVsZXMvcmVhY3QvcmVhY3QuanMiLCJyZWFjdC1wdWYuanMiLCJzcmNcXFB1Zi5qcyIsInNyY1xcY29tcG9uZW50c1xcQWxlcnQuanMiLCJzcmNcXGNvbXBvbmVudHNcXENoZWNrYm94LmpzIiwic3JjXFxjb21wb25lbnRzXFxGaWVsZHNldC5qcyIsInNyY1xcY29tcG9uZW50c1xcSGlkZGVuQ29udGVudC5qcyIsInNyY1xcY29tcG9uZW50c1xcTWFpbkZyYW1lU3BsaXR0ZXIuanMiLCJzcmNcXGNvbXBvbmVudHNcXE1vZGFsLmpzIiwic3JjXFxjb21wb25lbnRzXFxQYW5lbC5qcyIsInNyY1xcY29tcG9uZW50c1xccmFkaW9cXFJhZGlvLmpzIiwic3JjXFxjb21wb25lbnRzXFxyYWRpb1xcUmFkaW9Hcm91cC5qcyIsInNyY1xca2VuZG9cXEF1dG9Db21wbGV0ZS5qcyIsInNyY1xca2VuZG9cXERhdGVQaWNrZXIuanMiLCJzcmNcXGtlbmRvXFxEYXRlUmFuZ2VQaWNrZXIuanMiLCJzcmNcXGtlbmRvXFxEcm9wRG93bkxpc3QuanMiLCJzcmNcXGtlbmRvXFxHcmlkLmpzIiwic3JjXFxrZW5kb1xcTXVsdGlTZWxlY3QuanMiLCJzcmNcXGtlbmRvXFxOdW1lcmljVGV4dEJveC5qcyIsInNyY1xca2VuZG9cXFBhbmVsQmFyLmpzIiwic3JjXFxrZW5kb1xcUHJvZ3Jlc3NCYXIuanMiLCJzcmNcXGtlbmRvXFxUcmVlVmlldy5qcyIsInNyY1xca2VuZG9cXFdpbmRvdy5qcyIsInNyY1xca2VuZG9cXHRhYnN0cmlwXFxUYWIuanMiLCJzcmNcXGtlbmRvXFx0YWJzdHJpcFxcVGFiQ29udGVudC5qcyIsInNyY1xca2VuZG9cXHRhYnN0cmlwXFxUYWJTdHJpcC5qcyIsInNyY1xca2VuZG9cXHRhYnN0cmlwXFxUYWJzLmpzIiwic3JjXFxzZXJ2aWNlc1xcRGF0ZVV0aWwuanMiLCJzcmNcXHNlcnZpY2VzXFxOdW1iZXJVdGlsLmpzIiwic3JjXFxzZXJ2aWNlc1xcUmVnRXhwLmpzIiwic3JjXFxzZXJ2aWNlc1xcUmVzb3VyY2UuanMiLCJzcmNcXHNlcnZpY2VzXFxVdGlsLmpzIl0sIm5hbWVzIjpbXSwibWFwcGluZ3MiOiJBQUFBO0FDQUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3ZIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7QUNoREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ25GQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUMxREE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDeEhBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUN4RkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDOUxBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMzdEJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3JIQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNyVkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQzlCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ3pLQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUMzV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7OztBQ25PQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDL0ZBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3ZCQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7O0FDckJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5YUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FDZkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQ3pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUNiQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDdkJBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3RGQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7QUN4Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7OztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3RDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOzs7O0FDdEtBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ3JDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTs7Ozs7QUNsQkE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7O0FDaERBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUM5Q0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7OztBQ2pDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7Ozs7QUNqRUE7QUFDQTtBQUNBO0FBQ0E7O0FDSEE7O0FBRUEsT0FBTyxPQUFQLEdBQWlCLFFBQVEsV0FBUixDQUFqQjs7O0FDRkE7Ozs7Ozs7QUFPQTs7QUFFQTtBQUNBOztBQUNBLElBQUksUUFBUSxRQUFRLG9CQUFSLENBQVo7QUFDQSxJQUFJLFFBQVEsUUFBUSxvQkFBUixFQUE4QixLQUExQztBQUNBLElBQUksY0FBYyxRQUFRLG9CQUFSLEVBQThCLFdBQWhEO0FBQ0EsSUFBSSxZQUFZLFFBQVEsb0JBQVIsRUFBOEIsU0FBOUM7QUFDQSxJQUFJLGNBQWMsUUFBUSxvQkFBUixFQUE4QixXQUFoRDtBQUNBLElBQUksUUFBUSxRQUFRLG9CQUFSLEVBQThCLEtBQTFDO0FBQ0EsSUFBSSxjQUFjLFFBQVEsb0JBQVIsRUFBOEIsV0FBaEQ7QUFDQSxJQUFJLFlBQVksUUFBUSxvQkFBUixFQUE4QixTQUE5QztBQUNBLElBQUksY0FBYyxRQUFRLG9CQUFSLEVBQThCLFdBQWhEO0FBQ0EsSUFBSSxnQkFBZ0IsUUFBUSw0QkFBUixDQUFwQjtBQUNBLElBQUksb0JBQW9CLFFBQVEsZ0NBQVIsQ0FBeEI7O0FBRUE7QUFDQSxJQUFJLFdBQVcsUUFBUSx1QkFBUixFQUFpQyxRQUFoRDtBQUNBLElBQUksWUFBWSxRQUFRLHVCQUFSLEVBQWlDLFNBQWpEO0FBQ0EsSUFBSSxhQUFhLFFBQVEsK0JBQVIsQ0FBakI7QUFDQSxJQUFJLFFBQVEsUUFBUSwwQkFBUixDQUFaO0FBQ0EsSUFBSSxXQUFXLFFBQVEsdUJBQVIsQ0FBZjs7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxJQUFJLFdBQVcsUUFBUSxrQkFBUixDQUFmO0FBQ0EsSUFBSSxPQUFPLFFBQVEsY0FBUixDQUFYO0FBQ0EsSUFBSSxlQUFlLFFBQVEsc0JBQVIsQ0FBbkI7QUFDQSxJQUFJLGFBQWEsUUFBUSxvQkFBUixDQUFqQjtBQUNBLElBQUksa0JBQWtCLFFBQVEseUJBQVIsQ0FBdEI7QUFDQSxJQUFJLFdBQVcsUUFBUSwyQkFBUixDQUFmO0FBQ0EsSUFBSSxPQUFPLFFBQVEsdUJBQVIsQ0FBWDtBQUNBLElBQUksTUFBTSxRQUFRLHNCQUFSLENBQVY7QUFDQSxJQUFJLGFBQWEsUUFBUSw2QkFBUixDQUFqQjtBQUNBLElBQUksV0FBVyxRQUFRLGtCQUFSLENBQWY7QUFDQSxJQUFJLGNBQWMsUUFBUSxxQkFBUixDQUFsQjtBQUNBLElBQUksaUJBQWlCLFFBQVEsd0JBQVIsQ0FBckI7QUFDQSxJQUFJLGNBQWMsUUFBUSxxQkFBUixDQUFsQjtBQUNBLElBQUksU0FBUyxRQUFRLGdCQUFSLENBQWI7QUFDQSxJQUFJLGVBQWUsUUFBUSxzQkFBUixDQUFuQjs7QUFFQTtBQUNBLElBQUksT0FBTyxRQUFRLGlCQUFSLENBQVg7QUFDQSxJQUFJLFdBQVcsUUFBUSxxQkFBUixDQUFmO0FBQ0EsSUFBSSxhQUFhLFFBQVEsdUJBQVIsQ0FBakI7QUFDQSxJQUFJLFNBQVMsUUFBUSxtQkFBUixDQUFiO0FBQ0EsSUFBSSxXQUFXLFFBQVEscUJBQVIsQ0FBZjs7QUFFQSxJQUFJLE1BQU07QUFDTjtBQUNBLFdBQU8sS0FGRDtBQUdOLFdBQU8sS0FIRDtBQUlOLGlCQUFhLFdBSlA7QUFLTixlQUFXLFNBTEw7QUFNTixpQkFBYSxXQU5QO0FBT04sV0FBTyxLQVBEO0FBUU4saUJBQWEsV0FSUDtBQVNOLGVBQVcsU0FUTDtBQVVOLGlCQUFhLFdBVlA7QUFXTixtQkFBZSxhQVhUO0FBWU4sdUJBQW1CLGlCQVpiOztBQWNOO0FBQ0EsY0FBVSxRQWZKO0FBZ0JOLGVBQVcsU0FoQkw7QUFpQk4sZ0JBQVksVUFqQk47QUFrQk4sV0FBTyxLQWxCRDtBQW1CTixjQUFVLFFBbkJKOztBQXFCTjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBRUE7QUFDQSxjQUFVLFFBN0JKO0FBOEJOLFVBQU0sSUE5QkE7QUErQk4sa0JBQWMsWUEvQlI7QUFnQ04sZ0JBQVksVUFoQ047QUFpQ04scUJBQWlCLGVBakNYO0FBa0NOLGNBQVUsUUFsQ0o7QUFtQ04sVUFBTSxJQW5DQTtBQW9DTixTQUFLLEdBcENDO0FBcUNOLGdCQUFZLFVBckNOO0FBc0NOLGNBQVUsU0FBUyxRQXRDYjtBQXVDTixrQkFBYyxTQUFTLFlBdkNqQjtBQXdDTixpQkFBYSxXQXhDUDtBQXlDTixvQkFBZ0IsY0F6Q1Y7QUEwQ04saUJBQWEsV0ExQ1A7QUEyQ04sWUFBUSxNQTNDRjtBQTRDTixrQkFBYyxZQTVDUjs7QUE4Q047QUFDQSxVQUFNLElBL0NBO0FBZ0ROLGNBQVUsUUFoREo7QUFpRE4sZ0JBQVksVUFqRE47QUFrRE4sWUFBUSxNQWxERjtBQW1ETixjQUFVO0FBbkRKLENBQVY7O0FBc0RBLE9BQU8sT0FBUCxHQUFpQixHQUFqQjs7O0FDbkhBOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLFFBQVEsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJLFlBQVksUUFBUSxPQUFSLEVBQWlCLFNBQWpDO0FBQ0EsSUFBSSxhQUFhLFFBQVEsWUFBUixDQUFqQjs7QUFFQSxJQUFJLE9BQU8sUUFBUSxrQkFBUixDQUFYOztBQUVBLElBQUksUUFBUSxNQUFNLFdBQU4sQ0FBa0I7QUFDMUIsaUJBQWEsT0FEYTtBQUUxQixlQUFXO0FBQ1AsWUFBSSxVQUFVLE1BRFA7QUFFUCxtQkFBVyxVQUFVLE1BRmQ7QUFHUCxjQUFNLFVBQVUsTUFIVCxFQUc2QjtBQUNwQyxlQUFPLFVBQVUsTUFKVjtBQUtQLDRCQUFvQixVQUFVLE1BTHZCO0FBTVAsaUJBQVMsVUFBVSxNQU5aO0FBT1AsaUJBQVMsVUFBVSxNQVBaO0FBUVAscUJBQWEsVUFBVSxNQVJoQjtBQVNQLHFCQUFhLFVBQVUsTUFUaEI7QUFVUCx5QkFBaUIsVUFBVSxNQVZwQjtBQVdQLGNBQU0sVUFBVSxJQVhUO0FBWVAsa0JBQVUsVUFBVSxJQVpiO0FBYVAsZUFBTyxVQUFVLFNBQVYsQ0FBb0IsQ0FDdkIsVUFBVSxNQURhLEVBRXZCLFVBQVUsTUFGYSxDQUFwQjtBQWJBLEtBRmU7QUFvQjFCLFFBQUksRUFwQnNCO0FBcUIxQixVQUFNLGNBQVMsTUFBVCxFQUFpQixVQUFqQixFQUE2QjtBQUMvQixZQUFJLFFBQVEsRUFBRSxNQUFJLEtBQUssRUFBWCxDQUFaO0FBQ0EsY0FBTSxLQUFOLENBQVksTUFBWjs7QUFFQSxhQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsYUFBSyxVQUFMLEdBQWtCLFVBQWxCO0FBQ0gsS0EzQnlCO0FBNEIxQixVQUFNLGdCQUFXO0FBQ2IsWUFBSSxRQUFRLEVBQUUsTUFBSSxLQUFLLEVBQVgsQ0FBWjtBQUNBLGNBQU0sS0FBTixDQUFZLE1BQVo7QUFDSCxLQS9CeUI7QUFnQzFCLGdCQUFZLG9CQUFTLE9BQVQsRUFBa0I7QUFDMUIsWUFBRyxPQUFPLE9BQVAsS0FBbUIsUUFBdEIsRUFBZ0M7QUFDNUIsaUJBQUssUUFBTCxDQUFjLEVBQUMsU0FBUyxPQUFWLEVBQWQ7QUFDSDtBQUNKLEtBcEN5QjtBQXFDMUIsVUFBTSxjQUFTLEtBQVQsRUFBZ0I7QUFDbEI7QUFDQSxhQUFLLElBQUw7O0FBRUE7QUFDQSxZQUFHLE9BQU8sS0FBSyxNQUFaLEtBQXVCLFVBQTFCLEVBQXNDO0FBQ2xDLGlCQUFLLE1BQUw7QUFDSDs7QUFFRDtBQUNBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxJQUFsQixLQUEyQixVQUE5QixFQUEwQztBQUN0QyxpQkFBSyxLQUFMLENBQVcsSUFBWDtBQUNIO0FBQ0osS0FsRHlCO0FBbUQxQixjQUFVLGtCQUFTLEtBQVQsRUFBZ0I7QUFDdEI7QUFDQSxhQUFLLElBQUw7O0FBRUE7QUFDQSxZQUFHLE9BQU8sS0FBSyxVQUFaLEtBQTJCLFVBQTlCLEVBQTBDO0FBQ3RDLGlCQUFLLFVBQUw7QUFDSDs7QUFFRDtBQUNBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxRQUFsQixLQUErQixVQUFsQyxFQUE4QztBQUMxQyxpQkFBSyxLQUFMLENBQVcsUUFBWDtBQUNIO0FBQ0osS0FoRXlCO0FBaUUxQixxQkFBaUIsMkJBQVc7QUFDeEIsZUFBTyxFQUFDLE9BQU8sT0FBUixFQUFpQixTQUFTLFdBQVcsT0FBckMsRUFBOEMsYUFBYSxXQUFXLE1BQXRFLEVBQVA7QUFDSCxLQW5FeUI7QUFvRTFCLHFCQUFpQiwyQkFBVztBQUN4QjtBQUR3QixxQkFFQyxLQUFLLEtBRk47QUFBQSxZQUVqQixLQUZpQixVQUVqQixLQUZpQjtBQUFBLFlBRVYsT0FGVSxVQUVWLE9BRlU7O0FBR3hCLGVBQU8sRUFBQyxPQUFPLEtBQVIsRUFBZSxTQUFTLE9BQXhCLEVBQVA7QUFDSCxLQXhFeUI7QUF5RTFCLHdCQUFvQiw4QkFBVztBQUMzQjtBQUNBLFlBQUksS0FBSyxLQUFLLEtBQUwsQ0FBVyxFQUFwQjtBQUNBLFlBQUcsT0FBTyxFQUFQLEtBQWMsV0FBakIsRUFBOEI7QUFDMUIsaUJBQUssS0FBSyxPQUFMLEVBQUw7QUFDSDs7QUFFRCxhQUFLLEVBQUwsR0FBVSxFQUFWO0FBQ0gsS0FqRnlCO0FBa0YxQiwrQkFBMkIsbUNBQVMsU0FBVCxFQUFvQjtBQUMzQztBQUNBLGFBQUssUUFBTCxDQUFjLEVBQUMsT0FBTyxVQUFVLEtBQWxCLEVBQXlCLFNBQVMsVUFBVSxPQUE1QyxFQUFkO0FBQ0gsS0FyRnlCO0FBc0YxQixZQUFRLGtCQUFXO0FBQ2Y7QUFEZSxzQkFFMEYsS0FBSyxLQUYvRjtBQUFBLFlBRVIsU0FGUSxXQUVSLFNBRlE7QUFBQSxZQUVHLElBRkgsV0FFRyxJQUZIO0FBQUEsWUFFUyxPQUZULFdBRVMsT0FGVDtBQUFBLFlBRWtCLFdBRmxCLFdBRWtCLFdBRmxCO0FBQUEsWUFFK0IsV0FGL0IsV0FFK0IsV0FGL0I7QUFBQSxZQUU0QyxlQUY1QyxXQUU0QyxlQUY1QztBQUFBLFlBRTZELGtCQUY3RCxXQUU2RCxrQkFGN0Q7QUFBQSxZQUVpRixLQUZqRixXQUVpRixLQUZqRjs7O0FBSWYsWUFBSSxZQUFKO0FBQ0EsWUFBRyxTQUFTLFNBQVosRUFBdUI7QUFDbkIsMkJBQWU7QUFBQTtBQUFBLGtCQUFRLE1BQUssUUFBYixFQUFzQixXQUFXLFdBQVcsS0FBWCxFQUFrQixZQUFsQixFQUFnQyxlQUFoQyxDQUFqQyxFQUFtRixTQUFTLEtBQUssUUFBakcsRUFBMkcsZ0JBQWEsT0FBeEg7QUFBaUk7QUFBakksYUFBZjtBQUNIOztBQUVELGVBQ0k7QUFBQTtBQUFBLGNBQUssSUFBSSxLQUFLLEVBQWQsRUFBa0IsV0FBVyxXQUFXLE9BQVgsRUFBb0IsYUFBcEIsRUFBbUMsU0FBbkMsQ0FBN0IsRUFBNEUsTUFBSyxRQUFqRixFQUEwRixtQkFBZ0IsRUFBMUcsRUFBNkcsZUFBWSxNQUF6SCxFQUFnSSxpQkFBYyxRQUE5SSxFQUF1SixpQkFBYyxPQUFySztBQUNJO0FBQUE7QUFBQSxrQkFBSyxXQUFVLHVCQUFmLEVBQXVDLE9BQU8sRUFBQyxPQUFPLEtBQVIsRUFBOUM7QUFDSTtBQUFBO0FBQUEsc0JBQUssV0FBVSxlQUFmO0FBQ0k7QUFBQTtBQUFBLDBCQUFLLFdBQVUsY0FBZjtBQUNJLHNEQUFNLFdBQVcsV0FBVyxZQUFYLEVBQXlCLGtCQUF6QixDQUFqQixHQURKO0FBRUk7QUFBQTtBQUFBLDhCQUFNLFdBQVUsYUFBaEI7QUFBK0IsaUNBQUssS0FBTCxDQUFXO0FBQTFDO0FBRkoscUJBREo7QUFLSTtBQUFBO0FBQUEsMEJBQUssV0FBVSxZQUFmO0FBQ0ssNkJBQUssS0FBTCxDQUFXO0FBRGhCLHFCQUxKO0FBUUk7QUFBQTtBQUFBLDBCQUFLLFdBQVUsY0FBZjtBQUNJO0FBQUE7QUFBQSw4QkFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVyxXQUFXLEtBQVgsRUFBa0IsUUFBbEIsRUFBNEIsV0FBNUIsQ0FBakMsRUFBMkUsU0FBUyxLQUFLLElBQXpGO0FBQWdHO0FBQWhHLHlCQURKO0FBRUs7QUFGTDtBQVJKO0FBREo7QUFESixTQURKO0FBbUJIO0FBbEh5QixDQUFsQixDQUFaOztBQXFIQSxPQUFPLE9BQVAsR0FBaUIsS0FBakI7OztBQ3pJQTs7Ozs7Ozs7OztBQVVBOztBQUVBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksWUFBWSxRQUFRLE9BQVIsRUFBaUIsU0FBakM7QUFDQSxJQUFJLGFBQWEsUUFBUSxZQUFSLENBQWpCOztBQUVBLElBQUksT0FBTyxRQUFRLGtCQUFSLENBQVg7O0FBRUEsSUFBSSxXQUFXLE1BQU0sV0FBTixDQUFrQjtBQUM3QixpQkFBYSxVQURnQjtBQUU3QixlQUFXO0FBQ1AsWUFBSSxVQUFVLE1BRFA7QUFFUCxtQkFBVyxVQUFVLE1BRmQ7QUFHUCxjQUFNLFVBQVUsTUFIVDtBQUlQLGVBQU8sVUFBVSxNQUpWO0FBS1AsaUJBQVMsVUFBVSxJQUxaO0FBTVAsa0JBQVUsVUFBVTtBQU5iLEtBRmtCO0FBVTdCLGNBQVUsa0JBQVMsS0FBVCxFQUFnQjtBQUN0QjtBQUNBLFlBQUksVUFBVSxDQUFDLEtBQUssS0FBTCxDQUFXLE9BQTFCO0FBQ0E7QUFDQSxhQUFLLFFBQUwsQ0FBYyxFQUFDLFNBQVMsT0FBVixFQUFkO0FBQ0EsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLFFBQWxCLEtBQStCLFVBQWxDLEVBQThDO0FBQzFDLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLEtBQXBCLEVBQTJCLE9BQTNCO0FBQ0g7QUFDSixLQWxCNEI7QUFtQjdCLGNBQVUsb0JBQVc7QUFDakIsWUFBSSxVQUFVLEtBQUssS0FBTCxDQUFXLE9BQXpCO0FBQUEsWUFDSSxZQUFZLEVBQUUsMEJBQTBCLEtBQUssS0FBTCxDQUFXLElBQXJDLEdBQTRDLElBQTlDLENBRGhCO0FBRUEsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQWxCLEtBQTRCLFdBQS9CLEVBQTRDO0FBQ3hDO0FBQ0Esc0JBQVUsR0FBVixDQUFjLE9BQWQ7QUFDSCxTQUhELE1BR007QUFDRixnQkFBRyxZQUFZLElBQWYsRUFBcUI7QUFDakIsMEJBQVUsR0FBVixDQUFjLEtBQUssS0FBTCxDQUFXLEtBQXpCO0FBQ0gsYUFGRCxNQUVNO0FBQ0YsMEJBQVUsR0FBVixDQUFjLElBQWQ7QUFDSDtBQUNKO0FBQ0osS0FoQzRCO0FBaUM3QixvQkFBZ0Isd0JBQVMsS0FBVCxFQUFnQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxZQUFJLFVBQVUsTUFBTSxPQUFwQjtBQUNBLFlBQUcsT0FBTyxPQUFQLEtBQW1CLFdBQXRCLEVBQW1DO0FBQy9CLHNCQUFVLEtBQVY7QUFDSDs7QUFFRCxlQUFPO0FBQ0g7QUFDQSxxQkFBUztBQUZOLFNBQVA7QUFJSCxLQWhENEI7QUFpRDdCLHFCQUFpQiwyQkFBVztBQUN4QixlQUFPLEtBQUssY0FBTCxDQUFvQixLQUFLLEtBQXpCLENBQVA7QUFDSCxLQW5ENEI7QUFvRDdCLHVCQUFtQiw2QkFBVztBQUMxQjtBQUNBLGFBQUssUUFBTDtBQUNILEtBdkQ0QjtBQXdEN0IsK0JBQTJCLG1DQUFTLFNBQVQsRUFBb0I7QUFDM0M7QUFDQSxhQUFLLFFBQUwsQ0FBYyxLQUFLLGNBQUwsQ0FBb0IsU0FBcEIsQ0FBZDtBQUNILEtBM0Q0QjtBQTREN0Isd0JBQW9CLDRCQUFTLFNBQVQsRUFBb0IsU0FBcEIsRUFBK0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLLFFBQUw7QUFDSCxLQWxFNEI7QUFtRTdCLFlBQVEsa0JBQVc7QUFDZjtBQURlLHFCQUVxQixLQUFLLEtBRjFCO0FBQUEsWUFFUixTQUZRLFVBRVIsU0FGUTtBQUFBLFlBRUcsSUFGSCxVQUVHLElBRkg7QUFBQSxZQUVTLFFBRlQsVUFFUyxRQUZUOztBQUdmLGVBQ0k7QUFBQTtBQUFBLGNBQUssV0FBVSxVQUFmO0FBQ0k7QUFBQTtBQUFBO0FBQ0ksK0NBQU8sTUFBSyxVQUFaLEVBQXVCLFdBQVcsU0FBbEMsRUFBNkMsTUFBTSxJQUFuRCxFQUF5RCxTQUFTLEtBQUssS0FBTCxDQUFXLE9BQTdFO0FBQ0ksOEJBQVUsS0FBSyxRQURuQixHQURKO0FBR0k7QUFBQTtBQUFBLHNCQUFNLFdBQVUsS0FBaEI7QUFBdUI7QUFBdkI7QUFISjtBQURKLFNBREo7QUFVSDtBQWhGNEIsQ0FBbEIsQ0FBZjs7QUFtRkEsSUFBSSxZQUFZLE1BQU0sV0FBTixDQUFrQjtBQUM5QixpQkFBYSxXQURpQjtBQUU5QixlQUFXO0FBQ1AsWUFBSSxVQUFVLE1BRFA7QUFFUCxtQkFBVyxVQUFVLE1BRmQ7QUFHUCxjQUFNLFVBQVUsTUFIVDtBQUlQLGVBQU8sVUFBVSxNQUpWO0FBS1AsaUJBQVMsVUFBVSxJQUxaO0FBTVAsa0JBQVUsVUFBVTtBQU5iLEtBRm1CO0FBVTlCLGNBQVUsa0JBQVMsS0FBVCxFQUFnQjtBQUN0QjtBQUNBLFlBQUksVUFBVSxDQUFDLEtBQUssS0FBTCxDQUFXLE9BQTFCO0FBQ0E7QUFDQSxhQUFLLFFBQUwsQ0FBYyxFQUFDLFNBQVMsT0FBVixFQUFkO0FBQ0EsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLFFBQWxCLEtBQStCLFVBQWxDLEVBQThDO0FBQzFDLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLEtBQXBCLEVBQTJCLE9BQTNCO0FBQ0g7QUFFSixLQW5CNkI7QUFvQjlCLGNBQVUsb0JBQVc7QUFDakIsWUFBSSxVQUFVLEtBQUssS0FBTCxDQUFXLE9BQXpCO0FBQUEsWUFDSSxZQUFZLEVBQUUsMEJBQTBCLEtBQUssS0FBTCxDQUFXLElBQXJDLEdBQTRDLElBQTlDLENBRGhCO0FBRUEsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLEtBQWxCLEtBQTRCLFdBQS9CLEVBQTRDO0FBQ3hDO0FBQ0Esc0JBQVUsR0FBVixDQUFjLE9BQWQ7QUFDSCxTQUhELE1BR007QUFDRixnQkFBRyxZQUFZLElBQWYsRUFBcUI7QUFDakIsMEJBQVUsR0FBVixDQUFjLEtBQUssS0FBTCxDQUFXLEtBQXpCO0FBQ0gsYUFGRCxNQUVNO0FBQ0YsMEJBQVUsR0FBVixDQUFjLElBQWQ7QUFDSDtBQUNKO0FBQ0osS0FqQzZCO0FBa0M5QixvQkFBZ0Isd0JBQVMsS0FBVCxFQUFnQjtBQUM1QjtBQUNBO0FBQ0E7QUFDQTs7QUFFQSxZQUFJLFVBQVUsTUFBTSxPQUFwQjtBQUNBLFlBQUcsT0FBTyxPQUFQLEtBQW1CLFdBQXRCLEVBQW1DO0FBQy9CLHNCQUFVLEtBQVY7QUFDSDs7QUFFRCxlQUFPO0FBQ0g7QUFDQSxxQkFBUztBQUZOLFNBQVA7QUFJSCxLQWpENkI7QUFrRDlCLHFCQUFpQiwyQkFBVztBQUN4QixlQUFPLEtBQUssY0FBTCxDQUFvQixLQUFLLEtBQXpCLENBQVA7QUFDSCxLQXBENkI7QUFxRDlCLHVCQUFtQiw2QkFBVztBQUMxQjtBQUNBLGFBQUssUUFBTDtBQUNILEtBeEQ2QjtBQXlEOUIsK0JBQTJCLG1DQUFTLFNBQVQsRUFBb0I7QUFDM0M7QUFDQSxhQUFLLFFBQUwsQ0FBYyxLQUFLLGNBQUwsQ0FBb0IsU0FBcEIsQ0FBZDtBQUNILEtBNUQ2QjtBQTZEOUIsd0JBQW9CLDRCQUFTLFNBQVQsRUFBb0IsU0FBcEIsRUFBK0I7QUFDL0M7QUFDQTtBQUNBO0FBQ0E7QUFDQSxhQUFLLFFBQUw7QUFDSCxLQW5FNkI7QUFvRTlCLFlBQVEsa0JBQVc7QUFDZjtBQURlLHNCQUVxQixLQUFLLEtBRjFCO0FBQUEsWUFFUixTQUZRLFdBRVIsU0FGUTtBQUFBLFlBRUcsSUFGSCxXQUVHLElBRkg7QUFBQSxZQUVTLFFBRlQsV0FFUyxRQUZUOztBQUdmLGVBRUk7QUFBQTtBQUFBLGNBQU8sV0FBVSxpQkFBakI7QUFDSSwyQ0FBTyxNQUFLLFVBQVosRUFBdUIsV0FBVyxTQUFsQyxFQUE2QyxNQUFNLElBQW5ELEVBQXlELFNBQVMsS0FBSyxLQUFMLENBQVcsT0FBN0U7QUFDSSwwQkFBVSxLQUFLLFFBRG5CLEdBREo7QUFHUTtBQUFBO0FBQUEsa0JBQU0sV0FBVSxLQUFoQjtBQUF1QjtBQUF2QjtBQUhSLFNBRko7QUFVSDtBQWpGNkIsQ0FBbEIsQ0FBaEI7O0FBb0ZBLE9BQU8sT0FBUCxHQUFpQjtBQUNiLGNBQVUsUUFERztBQUViLGVBQVc7QUFGRSxDQUFqQjs7O0FDekxBOzs7Ozs7Ozs7O0FBVUE7O0FBRUEsSUFBSSxRQUFRLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSSxZQUFZLFFBQVEsT0FBUixFQUFpQixTQUFqQztBQUNBLElBQUksYUFBYSxRQUFRLFlBQVIsQ0FBakI7O0FBRUEsSUFBSSxPQUFPLFFBQVEsa0JBQVIsQ0FBWDs7QUFFQSxJQUFJLFdBQVcsTUFBTSxXQUFOLENBQWtCO0FBQzdCLGlCQUFhLFVBRGdCO0FBRTdCLGVBQVc7QUFDUCxZQUFJLFVBQVUsTUFEUDtBQUVQLG1CQUFXLFVBQVUsTUFGZDtBQUdQLGdCQUFRLFVBQVUsTUFIWDtBQUlQLGdCQUFRLFVBQVUsSUFKWDtBQUtQLHFCQUFhLFVBQVUsSUFMaEI7QUFNUCxrQkFBVSxVQUFVLElBTmI7QUFPUCxnQkFBUSxVQUFVO0FBUFgsS0FGa0I7QUFXN0IsUUFBSSxFQVh5QjtBQVk3QixZQUFRLGdCQUFTLEtBQVQsRUFBZ0I7QUFDcEIsWUFBRyxLQUFLLEtBQUwsQ0FBVyxXQUFYLEtBQTJCLElBQTlCLEVBQW9DO0FBQ2hDLGdCQUFHLE9BQU8sTUFBTSxNQUFiLEtBQXdCLFdBQTNCLEVBQXdDO0FBQ3BDLHFCQUFLLFFBQUwsQ0FBYyxFQUFDLFFBQVEsTUFBTSxNQUFmLEVBQWQ7QUFDSCxhQUZELE1BRU07QUFDRixxQkFBSyxRQUFMLENBQWMsRUFBQyxRQUFRLElBQVQsRUFBZDtBQUNIO0FBQ0o7QUFDSixLQXBCNEI7QUFxQjdCLGNBQVUsa0JBQVMsS0FBVCxFQUFnQjtBQUN0QixZQUFJLFNBQVMsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxNQUF6QjtBQUNBLGFBQUssTUFBTCxDQUFZLEVBQUMsUUFBUSxNQUFULEVBQVo7O0FBRUEsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLFFBQWxCLEtBQStCLFVBQWxDLEVBQThDO0FBQzFDLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLE1BQXBCO0FBQ0g7QUFDSixLQTVCNEI7QUE2QmhDLHFCQUFpQiwyQkFBVztBQUMzQjtBQUNBO0FBQ0EsZUFBTyxFQUFDLFFBQVEsT0FBVCxFQUFrQixhQUFhLElBQS9CLEVBQXFDLFFBQVEsSUFBN0MsRUFBUDtBQUNBLEtBakMrQjtBQWtDN0IscUJBQWlCLDJCQUFXO0FBQzlCO0FBQ00sZUFBTyxFQUFDLFFBQVEsS0FBSyxLQUFMLENBQVcsTUFBcEIsRUFBUDtBQUNILEtBckM0QjtBQXNDN0Isd0JBQW9CLDhCQUFXO0FBQzNCO0FBQ0EsWUFBSSxLQUFLLEtBQUssS0FBTCxDQUFXLEVBQXBCO0FBQ0EsWUFBRyxPQUFPLEVBQVAsS0FBYyxXQUFqQixFQUE4QjtBQUMxQixpQkFBSyxLQUFLLE9BQUwsRUFBTDtBQUNIOztBQUVELGFBQUssRUFBTCxHQUFVLEVBQVY7QUFDSCxLQTlDNEI7QUErQzdCLHVCQUFtQiw2QkFBVztBQUMxQjtBQUNBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUFsQixLQUE2QixVQUFoQyxFQUE0QztBQUN4QyxnQkFBSSxPQUFPLEVBQVg7QUFDQSxpQkFBSyxNQUFMLEdBQWMsS0FBSyxLQUFMLENBQVcsTUFBekI7QUFDQSxpQkFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixJQUFsQjtBQUNIO0FBQ0osS0F0RDRCO0FBdUQ3QiwrQkFBMkIsbUNBQVMsU0FBVCxFQUFvQjtBQUMzQztBQUNBLGFBQUssTUFBTCxDQUFZLFNBQVo7QUFDSCxLQTFENEI7QUEyRDdCLFlBQVEsa0JBQVc7QUFDZjtBQURlLHFCQUUwQixLQUFLLEtBRi9CO0FBQUEsWUFFUixTQUZRLFVBRVIsU0FGUTtBQUFBLFlBRUcsTUFGSCxVQUVHLE1BRkg7QUFBQSxZQUVXLFdBRlgsVUFFVyxXQUZYOzs7QUFJZixZQUFJLE9BQUo7QUFBQSxZQUFhLFlBQVksS0FBekI7QUFDQSxZQUFHLEtBQUssS0FBTCxDQUFXLE1BQVgsS0FBc0IsSUFBekIsRUFBK0I7QUFDM0Isc0JBQVUsT0FBVjtBQUNILFNBRkQsTUFFTTtBQUNGLHNCQUFVLE1BQVY7QUFDQSxnQkFBRyxnQkFBZ0IsSUFBbkIsRUFBeUI7QUFDckIsNEJBQVksSUFBWjtBQUNIO0FBQ0o7O0FBRUQsZUFDSTtBQUFBO0FBQUEsY0FBVSxXQUFXLFdBQVcsVUFBWCxFQUF1QixTQUF2QixFQUFrQyxFQUFDLGFBQWEsV0FBZCxFQUEyQixXQUFXLFNBQXRDLEVBQWxDLENBQXJCO0FBQ0k7QUFBQTtBQUFBLGtCQUFRLFNBQVMsS0FBSyxRQUF0QixFQUFnQyxNQUFNLEtBQUssRUFBM0M7QUFBQTtBQUFpRDtBQUFqRCxhQURKO0FBRUk7QUFBQTtBQUFBLGtCQUFLLE9BQU8sRUFBQyxTQUFTLE9BQVYsRUFBWjtBQUNJO0FBQUE7QUFBQSxzQkFBSyxJQUFJLEtBQUssRUFBZDtBQUFvQix5QkFBSyxLQUFMLENBQVc7QUFBL0I7QUFESjtBQUZKLFNBREo7QUFTSDtBQWxGNEIsQ0FBbEIsQ0FBZjs7QUFxRkEsT0FBTyxPQUFQLEdBQWlCLFFBQWpCOzs7QUN2R0E7Ozs7Ozs7Ozs7QUFVQTs7QUFFQTs7Ozs7O0FBQ0E7QUFDQTtBQUNBLElBQUksYUFBYSxRQUFRLFlBQVIsQ0FBakI7O0FBRUEsSUFBSSxPQUFPLFFBQVEsa0JBQVIsQ0FBWDs7QUFFQSxJQUFJLGdCQUFnQixnQkFBTSxXQUFOLENBQWtCO0FBQ2xDLGlCQUFhLGVBRHFCO0FBRWxDLGVBQVc7QUFDUCxZQUFJLGlCQUFVLE1BRFA7QUFFUCxtQkFBVyxpQkFBVSxNQUZkO0FBR1AscUJBQWEsaUJBQVUsTUFIaEI7QUFJUCx1QkFBZSxpQkFBVSxNQUpsQjtBQUtQLG9CQUFZLGlCQUFVLE1BTGY7QUFNUCxzQkFBYyxpQkFBVSxNQU5qQjtBQU9QLGtCQUFVLGlCQUFVO0FBUGIsS0FGdUI7QUFXbEMsUUFBSSxFQVg4QjtBQVlsQyxzQkFBa0IsMEJBQVMsS0FBVCxFQUFnQjtBQUM5QjtBQUNBO0FBQ0EsWUFBSSxPQUFPLE1BQU0sTUFBakI7QUFDQSxZQUFHLEVBQUUsSUFBRixFQUFRLElBQVIsR0FBZSxHQUFmLENBQW1CLFNBQW5CLE1BQWtDLE1BQXJDLEVBQTZDO0FBQ3pDLGlCQUFLLFFBQUwsQ0FBYyxFQUFDLE9BQU8sS0FBSyxLQUFMLENBQVcsYUFBbkIsRUFBa0MsTUFBTSxLQUFLLEtBQUwsQ0FBVyxZQUFuRCxFQUFkO0FBQ0EsY0FBRSxJQUFGLEVBQVEsSUFBUixHQUFlLEdBQWYsQ0FBbUIsU0FBbkIsRUFBOEIsT0FBOUI7QUFDSCxTQUhELE1BR007QUFDRixpQkFBSyxRQUFMLENBQWMsRUFBQyxPQUFPLEtBQUssS0FBTCxDQUFXLFdBQW5CLEVBQWdDLE1BQU0sS0FBSyxLQUFMLENBQVcsVUFBakQsRUFBZDtBQUNBLGNBQUUsSUFBRixFQUFRLElBQVIsR0FBZSxHQUFmLENBQW1CLFNBQW5CLEVBQThCLE1BQTlCO0FBQ0g7QUFFSixLQXhCaUM7QUF5QmxDLHNCQUFrQiwwQkFBUyxLQUFULEVBQWdCO0FBQzlCLFlBQUksT0FBTyxNQUFNLE1BQWpCO0FBQUEsWUFDSSxNQUFNLEtBQUssVUFEZixDQUQ4QixDQUVKO0FBQzFCLFVBQUUsR0FBRixFQUFPLEdBQVAsQ0FBVyxTQUFYLEVBQXNCLE1BQXRCO0FBQ0EsYUFBSyxRQUFMLENBQWMsRUFBQyxPQUFPLEtBQUssS0FBTCxDQUFXLFdBQW5CLEVBQWdDLE1BQU0sS0FBSyxLQUFMLENBQVcsVUFBakQsRUFBZDtBQUNILEtBOUJpQztBQStCbEMscUJBQWlCLDJCQUFXOztBQUV4QixZQUFJLFFBQVEsS0FBSyxLQUFMLENBQVcsV0FBdkI7QUFDQSxZQUFHLE9BQU8sS0FBUCxLQUFpQixXQUFwQixFQUFpQztBQUM3QixvQkFBUSxRQUFSO0FBQ0g7O0FBRUQsWUFBSSxPQUFPLEtBQUssS0FBTCxDQUFXLFVBQXRCOztBQUVBLGVBQU8sRUFBQyxPQUFPLEtBQVIsRUFBZSxNQUFNLElBQXJCLEVBQVA7QUFDSCxLQXpDaUM7QUEwQ2xDLHdCQUFvQiw4QkFBVztBQUMzQjtBQUNBLFlBQUksS0FBSyxLQUFLLEtBQUwsQ0FBVyxFQUFwQjtBQUNBLFlBQUcsT0FBTyxFQUFQLEtBQWMsV0FBakIsRUFBOEI7QUFDMUIsaUJBQUssS0FBSyxPQUFMLEVBQUw7QUFDSDs7QUFFRCxhQUFLLEVBQUwsR0FBVSxFQUFWO0FBQ0gsS0FsRGlDO0FBbURsQyxZQUFRLGtCQUFXO0FBQ2Y7QUFDQSxZQUFJLElBQUo7QUFDQSxZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsSUFBbEIsS0FBMkIsUUFBOUIsRUFBd0M7QUFDcEMsbUJBQU87QUFBQTtBQUFBLGtCQUFHLFdBQVcsS0FBSyxLQUFMLENBQVcsSUFBekI7QUFBZ0M7QUFBaEMsYUFBUDtBQUNIOztBQUVEO0FBQ0EsWUFBSSxZQUFKO0FBQ0EsWUFBRyxLQUFLLEtBQUwsQ0FBVyxRQUFYLEtBQXdCLElBQTNCLEVBQWlDO0FBQzdCLGdCQUFJLHFCQUFKO0FBQ0EsZ0JBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxZQUFsQixLQUFtQyxRQUF0QyxFQUFnRDtBQUM1QywrQkFBZTtBQUFBO0FBQUEsc0JBQUcsV0FBVyxLQUFLLEtBQUwsQ0FBVyxZQUF6QjtBQUF3QztBQUF4QyxpQkFBZjtBQUNIOztBQUVEO0FBQ0EsMkJBQWU7QUFBQTtBQUFBLGtCQUFHLE1BQU0sTUFBTSxLQUFLLEVBQXBCLEVBQXdCLFNBQVMsS0FBSyxnQkFBdEM7QUFBeUQsNEJBQXpEO0FBQXVFLHFCQUFLLEtBQUwsQ0FBVztBQUFsRixhQUFmO0FBQ0g7O0FBRUQsZUFDSTtBQUFBO0FBQUEsY0FBSyxXQUFXLFdBQVcsZ0JBQVgsRUFBNkIsS0FBSyxLQUFMLENBQVcsU0FBeEMsQ0FBaEI7QUFDSTtBQUFBO0FBQUEsa0JBQUcsTUFBSyxvQkFBUixFQUE2QixTQUFTLEtBQUssZ0JBQTNDLEVBQTZELE1BQU0sS0FBSyxFQUF4RTtBQUE2RSxvQkFBN0U7QUFBbUYscUJBQUssS0FBTCxDQUFXO0FBQTlGLGFBREo7QUFFSTtBQUFBO0FBQUEsa0JBQUssT0FBTyxFQUFDLFNBQVMsTUFBVixFQUFaO0FBQ0k7QUFBQTtBQUFBLHNCQUFLLElBQUksS0FBSyxFQUFkO0FBQW1CLHlCQUFLLEtBQUwsQ0FBVztBQUE5QixpQkFESjtBQUVLO0FBRkw7QUFGSixTQURKO0FBU0g7QUEvRWlDLENBQWxCLENBQXBCOztBQWtGQSxPQUFPLE9BQVAsR0FBaUIsYUFBakI7OztBQ3JHQTs7Ozs7Ozs7OztBQVVBOztBQUVBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksWUFBWSxRQUFRLE9BQVIsRUFBaUIsU0FBakM7QUFDQSxJQUFJLGFBQWEsUUFBUSxZQUFSLENBQWpCOztBQUVBLElBQUksT0FBTyxRQUFRLGtCQUFSLENBQVg7O0FBRUEsSUFBSSxXQUFXLE1BQU0sV0FBTixDQUFrQjtBQUM3QixpQkFBYSxVQURnQjtBQUU3QixlQUFXO0FBQ1AsWUFBSSxVQUFVLE1BRFA7QUFFUCxtQkFBVyxVQUFVLE1BRmQ7QUFHUCxjQUFNLFVBQVUsS0FBVixDQUFnQixDQUFDLEdBQUQsRUFBTSxHQUFOLENBQWhCLEVBQTRCLFVBSDNCO0FBSVAsa0JBQVUsVUFBVSxLQUFWLENBQWdCLENBQUMsTUFBRCxFQUFTLE9BQVQsRUFBa0IsS0FBbEIsRUFBeUIsUUFBekIsQ0FBaEIsRUFBb0QsVUFKdkQ7QUFLUDtBQUNBO0FBQ0EsaUJBQVMsVUFBVSxNQUFWLENBQWlCLFVBUG5CO0FBUVAsa0JBQVUsVUFBVSxNQUFWLENBQWlCLFVBUnBCO0FBU1AsaUJBQVMsVUFBVSxNQUFWLENBQWlCLFVBVG5CO0FBVVAsa0JBQVUsVUFBVSxNQUFWLENBQWlCLFVBVnBCO0FBV1Asa0JBQVUsVUFBVTtBQVhiLEtBRmtCO0FBZTdCLFFBQUksRUFmeUI7QUFnQjdCLGNBQVUsa0JBQVMsQ0FBVCxFQUFZO0FBQ2xCLFlBQUcsS0FBSyxLQUFMLENBQVcsUUFBZCxFQUF3QjtBQUNwQixpQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixDQUFwQjtBQUNIO0FBQ0osS0FwQjRCO0FBcUI3QjtBQUNBO0FBQ0Esd0JBQW9CLEtBdkJTO0FBd0I3QixpQkFBYSxLQXhCZ0I7QUF5QjdCLHVCQUFtQiwyQkFBUyxDQUFULEVBQVk7QUFDM0IsWUFBSSxDQUFDLEtBQUssa0JBQU4sSUFBNEIsS0FBSyxLQUFMLENBQVcsTUFBWCxLQUFzQixJQUF0RCxFQUE0RDtBQUN4RDtBQUNBLGdCQUFJLEtBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsVUFBdEIsRUFBa0M7QUFDOUIscUJBQUssU0FBTCxDQUFlLENBQWYsRUFBa0IsVUFBbEI7QUFDSCxhQUZELE1BRU07QUFDRix5QkFBUyxnQkFBVCxDQUEwQixTQUExQixFQUFxQyxLQUFLLGVBQTFDLEVBQTJELElBQTNEO0FBQ0EseUJBQVMsZ0JBQVQsQ0FBMEIsV0FBMUIsRUFBdUMsS0FBSyxpQkFBNUMsRUFBK0QsSUFBL0Q7QUFDQSxrQkFBRSxjQUFGO0FBQ0g7QUFDRCxpQkFBSyxrQkFBTCxHQUEwQixJQUExQjtBQUNBLGlCQUFLLFdBQUwsR0FBbUIsS0FBSyxTQUFMLENBQWUsQ0FBZixDQUFuQjs7QUFFQTtBQUNBLGlCQUFLLGFBQUwsR0FBcUIsS0FBSyxTQUFMLENBQWUsVUFBZixDQUEwQixJQUExQixDQUFyQjs7QUFFQTs7O0FBR0g7QUFDSixLQTdDNEI7QUE4QzdCLHFCQUFpQix5QkFBUyxDQUFULEVBQVk7QUFDekIsWUFBSSxLQUFLLGtCQUFULEVBQTZCO0FBQ2pDO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7O0FBTGlDLHlCQU9FLEtBQUssS0FQUDtBQUFBLGdCQU9qQixJQVBpQixVQU9qQixJQVBpQjtBQUFBLGdCQU9YLFFBUFcsVUFPWCxRQVBXOzs7QUFTekIsZ0JBQUcsU0FBUyxHQUFaLEVBQWlCO0FBQ2Isb0JBQUcsYUFBYSxNQUFoQixFQUF3QjtBQUNwQix5QkFBSyxTQUFMLENBQWUsSUFBZixHQUFzQixVQUF0QixDQUFpQyxLQUFLLFdBQUwsQ0FBaUIsVUFBbEQ7QUFDQSx5QkFBSyxTQUFMLENBQWUsSUFBZixHQUFzQixNQUF0QixDQUE2QixFQUFFLE1BQU8sS0FBSyxXQUFMLENBQWlCLFVBQWpCLEdBQThCLEtBQUssYUFBNUMsRUFBN0I7QUFDSCxpQkFIRCxNQUdNLElBQUcsYUFBYSxPQUFoQixFQUF5QjtBQUMzQix5QkFBSyx5QkFBTCxHQUFpQyxLQUFLLFNBQUwsQ0FBZSxNQUFmLEdBQXdCLFVBQXhCLENBQW1DLElBQW5DLElBQTJDLEtBQUssV0FBTCxDQUFpQixVQUE3RjtBQUNBLHlCQUFLLFNBQUwsQ0FBZSxJQUFmLEdBQXNCLEdBQXRCLENBQTBCLE9BQTFCLEVBQW1DLEtBQUsseUJBQXhDO0FBQ0EseUJBQUssU0FBTCxDQUFlLElBQWYsR0FBc0IsVUFBdEIsQ0FBaUMsS0FBSyx5QkFBTCxHQUFpQyxLQUFLLGFBQXZFOztBQUVBO0FBQ0E7QUFDSDtBQUVKOztBQUVELGdCQUFHLEtBQUssV0FBTCxDQUFpQixjQUFwQixFQUFvQztBQUNoQyxxQkFBSyxXQUFMLENBQWlCLGNBQWpCO0FBQ0gsYUFGRCxNQUVNO0FBQ0YseUJBQVMsbUJBQVQsQ0FBNkIsU0FBN0IsRUFBd0MsS0FBSyxlQUE3QyxFQUE4RCxJQUE5RDtBQUNBLHlCQUFTLG1CQUFULENBQTZCLFdBQTdCLEVBQTBDLEtBQUssaUJBQS9DLEVBQWtFLElBQWxFO0FBQ0Esa0JBQUUsY0FBRjtBQUNIO0FBQ0QsaUJBQUssa0JBQUwsR0FBMEIsS0FBMUI7QUFDQSxpQkFBSyxlQUFMO0FBQ0E7QUFDQSxpQkFBSyxTQUFMLENBQWUsT0FBZixDQUF1QixRQUF2QjtBQUNIO0FBQ0osS0FuRjRCO0FBb0Y3Qix1QkFBbUIsMkJBQVMsQ0FBVCxFQUFZO0FBQUEsc0JBQ3NDLEtBQUssS0FEM0M7QUFBQSxZQUNuQixJQURtQixXQUNuQixJQURtQjtBQUFBLFlBQ2IsUUFEYSxXQUNiLFFBRGE7QUFBQSxZQUNILE9BREcsV0FDSCxPQURHO0FBQUEsWUFDTSxRQUROLFdBQ00sUUFETjtBQUFBLFlBQ2dCLE9BRGhCLFdBQ2dCLE9BRGhCO0FBQUEsWUFDeUIsUUFEekIsV0FDeUIsUUFEekI7OztBQUczQixZQUFJLEtBQUssa0JBQVQsRUFBNkI7QUFDekIsZ0JBQUcsU0FBUyxHQUFaLEVBQWlCO0FBQ2Isb0JBQUcsYUFBYSxNQUFoQixFQUF3QjtBQUNwQix3QkFBSSxFQUFFLE9BQUYsSUFBYSxPQUFiLElBQXdCLEVBQUUsT0FBRixJQUFhLE9BQXpDLEVBQWtEO0FBQzlDLDZCQUFLLFdBQUwsQ0FBaUIsS0FBakIsQ0FBdUIsSUFBdkIsR0FBOEIsRUFBRSxPQUFGLEdBQVksSUFBMUM7QUFDQSw0QkFBRyxDQUFDLEtBQUssV0FBTCxDQUFpQixjQUFyQixFQUFxQztBQUNqQyw4QkFBRSxjQUFGO0FBQ0g7QUFDSjtBQUNKLGlCQVBELE1BT00sSUFBRyxhQUFhLE9BQWhCLEVBQXlCO0FBQzNCLHdCQUFJLEVBQUUsT0FBRixJQUFhLFNBQVMsZUFBVCxDQUF5QixXQUF6QixHQUF1QyxRQUFwRCxJQUFnRSxFQUFFLE9BQUYsSUFBYSxTQUFTLGVBQVQsQ0FBeUIsV0FBekIsR0FBdUMsUUFBeEgsRUFBa0k7QUFDOUgsNkJBQUssV0FBTCxDQUFpQixLQUFqQixDQUF1QixJQUF2QixHQUE4QixFQUFFLE9BQUYsR0FBWSxJQUExQztBQUNBLDRCQUFHLENBQUMsS0FBSyxXQUFMLENBQWlCLGNBQXJCLEVBQXFDO0FBQ2pDLDhCQUFFLGNBQUY7QUFDSDtBQUNKO0FBQ0o7QUFDSjtBQUNEOzs7Ozs7OztBQVFIO0FBQ0osS0FsSDRCO0FBbUg3QixrQkFBYyx3QkFBWTtBQUFBLHNCQUNLLEtBQUssS0FEVjtBQUFBLFlBQ2QsSUFEYyxXQUNkLElBRGM7QUFBQSxZQUNSLFFBRFEsV0FDUixRQURROzs7QUFHdEIsWUFBRyxTQUFTLEdBQVosRUFBaUI7QUFDYixnQkFBRyxhQUFhLE1BQWhCLEVBQXdCO0FBQ3BCLHFCQUFLLFNBQUwsQ0FBZSxJQUFmLEdBQXNCLE1BQXRCLENBQTZCLEVBQUUsTUFBTSxDQUFSLEVBQTdCO0FBQ0EscUJBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsRUFBRSxNQUFNLEtBQUssY0FBYixFQUF0QjtBQUNBLHFCQUFLLFNBQUwsQ0FBZSxJQUFmLEdBQXNCLE1BQXRCLENBQTZCLEVBQUUsTUFBTyxLQUFLLGNBQUwsR0FBc0IsS0FBSyxhQUFwQyxFQUE3QjtBQUNILGFBSkQsTUFJTSxJQUFHLGFBQWEsT0FBaEIsRUFBeUI7QUFDM0IscUJBQUssU0FBTCxDQUFlLElBQWYsR0FBc0IsR0FBdEIsQ0FBMEIsT0FBMUIsRUFBb0MsS0FBSyxlQUFMLEdBQXVCLEtBQUssYUFBaEU7QUFDQSxxQkFBSyxTQUFMLENBQWUsTUFBZixDQUFzQixFQUFFLE1BQU8sS0FBSyxTQUFMLENBQWUsTUFBZixHQUF3QixVQUF4QixDQUFtQyxJQUFuQyxJQUEyQyxLQUFLLGVBQWhELEdBQWtFLEtBQUssYUFBaEYsRUFBdEI7QUFDQSxxQkFBSyxTQUFMLENBQWUsSUFBZixHQUFzQixVQUF0QixDQUFpQyxLQUFLLGVBQXRDO0FBQ0g7QUFDSjs7QUFFRCxhQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLFFBQW5CLEVBQTZCLFVBQTdCOztBQUVBOzs7OztBQUtBLGFBQUssUUFBTCxDQUFjLEVBQUMsUUFBUSxJQUFULEVBQWQ7QUFDQSxhQUFLLFNBQUwsQ0FBZSxPQUFmLENBQXVCLFFBQXZCO0FBQ0gsS0EzSTRCO0FBNEk3QixtQkFBZSx5QkFBWTtBQUFBLHNCQUNJLEtBQUssS0FEVDtBQUFBLFlBQ2YsSUFEZSxXQUNmLElBRGU7QUFBQSxZQUNULFFBRFMsV0FDVCxRQURTOzs7QUFHdkIsWUFBRyxTQUFTLEdBQVosRUFBaUI7QUFDYixpQkFBSyxhQUFMLEdBQXFCLEtBQUssU0FBTCxDQUFlLFVBQWYsQ0FBMEIsSUFBMUIsQ0FBckI7O0FBRUEsZ0JBQUcsYUFBYSxNQUFoQixFQUF3QjtBQUNwQixxQkFBSyxjQUFMLEdBQXNCLEtBQUssU0FBTCxDQUFlLElBQWYsR0FBc0IsVUFBdEIsQ0FBaUMsSUFBakMsQ0FBdEI7O0FBRUEscUJBQUssU0FBTCxDQUFlLElBQWYsR0FBc0IsTUFBdEIsQ0FBNkIsRUFBRSxNQUFPLEtBQUssY0FBTCxHQUFzQixDQUFDLENBQWhDLEVBQTdCO0FBQ0EscUJBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsRUFBRSxNQUFNLENBQVIsRUFBdEI7QUFDQSxxQkFBSyxTQUFMLENBQWUsSUFBZixHQUFzQixNQUF0QixDQUE2QixFQUFFLE1BQU0sS0FBSyxhQUFiLEVBQTdCO0FBQ0gsYUFORCxNQU1NLElBQUcsYUFBYSxPQUFoQixFQUF5QjtBQUMzQixxQkFBSyxlQUFMLEdBQXVCLEtBQUssU0FBTCxDQUFlLElBQWYsR0FBc0IsVUFBdEIsQ0FBaUMsSUFBakMsQ0FBdkI7O0FBRUEscUJBQUssU0FBTCxDQUFlLElBQWYsR0FBc0IsR0FBdEIsQ0FBMEIsT0FBMUIsRUFBbUMsS0FBSyxhQUF4QztBQUNBLHFCQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLEVBQUUsTUFBTyxLQUFLLFNBQUwsQ0FBZSxNQUFmLEdBQXdCLFVBQXhCLENBQW1DLElBQW5DLElBQTJDLEtBQUssYUFBekQsRUFBdEI7QUFDQSxxQkFBSyxTQUFMLENBQWUsSUFBZixHQUFzQixVQUF0QixDQUFpQyxDQUFqQztBQUNIO0FBQ0o7O0FBRUQsYUFBSyxTQUFMLENBQWUsR0FBZixDQUFtQixRQUFuQixFQUE2QixTQUE3QjtBQUNBO0FBQ0EsYUFBSyxRQUFMLENBQWMsRUFBQyxRQUFRLEtBQVQsRUFBZDtBQUNBLGFBQUssU0FBTCxDQUFlLE9BQWYsQ0FBdUIsUUFBdkI7QUFDSCxLQXJLNEI7QUFzSzdCLG9CQUFnQix3QkFBUyxDQUFULEVBQVk7QUFDeEIsWUFBRyxLQUFLLEtBQUwsQ0FBVyxNQUFYLEtBQXNCLElBQXpCLEVBQStCO0FBQzNCLGlCQUFLLGFBQUw7QUFDSCxTQUZELE1BRU07QUFDRixpQkFBSyxZQUFMO0FBQ0g7QUFDSixLQTVLNEI7QUE2SzdCLHFCQUFpQiwyQkFBVztBQUFBLHNCQUNHLEtBQUssS0FEUjtBQUFBLFlBQ2hCLElBRGdCLFdBQ2hCLElBRGdCO0FBQUEsWUFDVixRQURVLFdBQ1YsUUFEVTs7QUFFeEIsWUFBSSxJQUFJLEtBQUssU0FBTCxDQUFlLENBQWYsQ0FBUixDQUZ3QixDQUVFO0FBQzFCLFlBQUcsQ0FBSCxFQUFNO0FBQ0YsZ0JBQUcsU0FBUyxHQUFaLEVBQWlCO0FBQ2Isb0JBQUcsYUFBYSxNQUFoQixFQUF3QjtBQUNwQix5QkFBSyxTQUFMLENBQWUsdUJBQWYsRUFBd0MsRUFBRSxVQUExQyxFQUFzRCxHQUF0RDtBQUNILGlCQUZELE1BRU0sSUFBRyxhQUFhLE9BQWhCLEVBQXlCO0FBQzNCLHlCQUFLLFNBQUwsQ0FBZSx3QkFBZixFQUF5QyxLQUFLLHlCQUE5QyxFQUF5RSxHQUF6RTtBQUNIO0FBQ0o7QUFDSjtBQUNKLEtBekw0QjtBQTBMN0IsdUJBQW1CLDZCQUFXO0FBQUEsc0JBQ0MsS0FBSyxLQUROO0FBQUEsWUFDbEIsSUFEa0IsV0FDbEIsSUFEa0I7QUFBQSxZQUNaLFFBRFksV0FDWixRQURZOztBQUUxQixZQUFHLFNBQVMsR0FBWixFQUFpQjtBQUNiLGdCQUFHLGFBQWEsT0FBaEIsRUFBeUI7QUFDckIsb0JBQUksa0JBQWtCLENBQXRCO0FBQ0Esb0JBQUcsS0FBSyxLQUFMLENBQVcsTUFBWCxLQUFzQixJQUF6QixFQUErQjtBQUMzQixzQ0FBa0IsS0FBSyxTQUFMLENBQWUsSUFBZixHQUFzQixVQUF0QixDQUFpQyxJQUFqQyxDQUFsQjtBQUNIO0FBQ0QscUJBQUssU0FBTCxDQUFlLE1BQWYsQ0FBc0IsRUFBRSxNQUFPLEtBQUssU0FBTCxDQUFlLE1BQWYsR0FBd0IsVUFBeEIsQ0FBbUMsSUFBbkMsSUFBMkMsZUFBM0MsR0FBNkQsS0FBSyxhQUEzRSxFQUF0QjtBQUNIO0FBQ0o7QUFDSixLQXJNNEI7QUFzTWhDLHFCQUFpQiwyQkFBVztBQUMzQjtBQUNBO0FBQ0EsZUFBTyxFQUFDLE1BQU0sR0FBUCxFQUFZLFVBQVUsTUFBdEIsRUFBOEIsU0FBUyxFQUF2QyxFQUEyQyxVQUFVLEVBQXJELEVBQXlELFNBQVMsR0FBbEUsRUFBdUUsVUFBVSxHQUFqRixFQUFQO0FBQ0EsS0ExTStCO0FBMk03QixxQkFBaUIsMkJBQVc7QUFDOUI7QUFDTSxlQUFPLEVBQUMsUUFBUSxJQUFULEVBQVA7QUFDSCxLQTlNNEI7QUErTTdCLHdCQUFvQiw4QkFBVztBQUMzQjtBQUNBLFlBQUksS0FBSyxLQUFLLEtBQUwsQ0FBVyxFQUFwQjtBQUNBLFlBQUcsT0FBTyxFQUFQLEtBQWMsV0FBakIsRUFBOEI7QUFDMUIsaUJBQUssS0FBSyxPQUFMLEVBQUw7QUFDSDs7QUFFRCxhQUFLLEVBQUwsR0FBVSxFQUFWO0FBQ0gsS0F2TjRCO0FBd043Qix1QkFBbUIsNkJBQVc7QUFDMUI7QUFDQSxhQUFLLFNBQUwsR0FBaUIsRUFBRSxNQUFJLEtBQUssRUFBWCxDQUFqQjs7QUFFQTtBQUNBLGFBQUssU0FBTCxDQUFlLEVBQWYsQ0FBa0IsUUFBbEIsRUFBNEIsS0FBSyxRQUFqQzs7QUFFQSxZQUFJLFFBQVEsSUFBWjtBQUNBLFVBQUUsTUFBRixFQUFVLEVBQVYsQ0FBYSxRQUFiLEVBQXVCLFVBQVMsQ0FBVCxFQUFZO0FBQy9CO0FBQ0EsZ0JBQUcsRUFBRSxNQUFGLEtBQWEsSUFBaEIsRUFBc0I7QUFDbEI7QUFDQTtBQUNBLDJCQUFXLE1BQU0saUJBQWpCLEVBQW9DLENBQXBDO0FBQ0g7QUFDSixTQVBEO0FBUUgsS0F4TzRCO0FBeU83QixZQUFRLGtCQUFXO0FBQ2Y7QUFEZSxzQkFFcUIsS0FBSyxLQUYxQjtBQUFBLFlBRVIsU0FGUSxXQUVSLFNBRlE7QUFBQSxZQUVHLElBRkgsV0FFRyxJQUZIO0FBQUEsWUFFUyxRQUZULFdBRVMsUUFGVDs7O0FBSWYsWUFBSSxJQUFJLElBQVI7QUFDQSxZQUFHLFNBQVMsR0FBWixFQUFpQjtBQUNiLGdCQUFJLEtBQUo7QUFDSDs7QUFFRCxZQUFJLElBQUksSUFBUjtBQUNBLFlBQUcsYUFBYSxNQUFoQixFQUF3QjtBQUNwQixnQkFBSSxLQUFKO0FBQ0g7O0FBRUQsWUFBSSxVQUFVLE9BQWQ7QUFDQSxZQUFHLENBQUMsS0FBSyxLQUFMLENBQVcsTUFBZixFQUF1QjtBQUNuQixzQkFBVSxNQUFWO0FBQ0g7O0FBRUQsZUFDSTtBQUFBO0FBQUEsY0FBSyxJQUFJLEtBQUssRUFBZCxFQUFrQixXQUFXLFdBQVcsRUFBQyxzQkFBc0IsSUFBdkIsRUFBNkIsY0FBYyxDQUEzQyxFQUE4QyxjQUFjLENBQUMsQ0FBN0QsRUFBZ0UsaUJBQWlCLENBQWpGLEVBQW9GLGtCQUFrQixDQUFDLENBQXZHLEVBQVgsRUFBc0gsU0FBdEgsQ0FBN0I7QUFDSSw2QkFBYSxLQUFLLGlCQUR0QixFQUN5QyxXQUFXLEtBQUssZUFEekQsRUFDMEUsYUFBYSxLQUFLLGlCQUQ1RjtBQUVJLHlDQUFLLFdBQVcsV0FBVyxFQUFDLHFCQUFxQixLQUFLLEtBQUwsQ0FBVyxNQUFqQyxFQUF5QyxtQkFBbUIsQ0FBQyxLQUFLLEtBQUwsQ0FBVyxNQUF4RSxFQUFYLENBQWhCLEVBQTZHLFdBQVcsS0FBSyxjQUE3SCxHQUZKO0FBR0kseUNBQUssV0FBVSx3QkFBZixFQUF3QyxPQUFPLEVBQUMsU0FBUyxPQUFWLEVBQS9DO0FBSEosU0FESjtBQU9IO0FBblE0QixDQUFsQixDQUFmOztBQXNRQSxPQUFPLE9BQVAsR0FBaUIsUUFBakI7OztBQ3hSQTs7Ozs7Ozs7Ozs7Ozs7O0FBZUE7O0FBRUEsSUFBSSxRQUFRLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSSxZQUFZLFFBQVEsT0FBUixFQUFpQixTQUFqQztBQUNBLElBQUksYUFBYSxRQUFRLFlBQVIsQ0FBakI7O0FBRUEsSUFBSSxPQUFPLFFBQVEsa0JBQVIsQ0FBWDs7QUFFQSxJQUFJLGNBQWMsTUFBTSxXQUFOLENBQWtCO0FBQ2hDLGlCQUFhLGFBRG1CO0FBRWhDLGVBQVc7QUFDUCxtQkFBVyxVQUFVO0FBRGQsS0FGcUI7QUFLaEMsWUFBUSxrQkFBVztBQUNmO0FBQ0EsZUFDSTtBQUFBO0FBQUEsY0FBSyxXQUFXLFdBQVcsY0FBWCxFQUEyQixLQUFLLEtBQUwsQ0FBVyxTQUF0QyxDQUFoQjtBQUNJO0FBQUE7QUFBQSxrQkFBUSxNQUFLLFFBQWIsRUFBc0IsV0FBVSxPQUFoQyxFQUF3QyxnQkFBYSxPQUFyRDtBQUE2RDtBQUFBO0FBQUEsc0JBQU0sZUFBWSxNQUFsQjtBQUFBO0FBQUEsaUJBQTdEO0FBQW9HO0FBQUE7QUFBQSxzQkFBTSxXQUFVLFNBQWhCO0FBQUE7QUFBQTtBQUFwRyxhQURKO0FBRUk7QUFBQTtBQUFBLGtCQUFNLFdBQVUsYUFBaEI7QUFBK0IscUJBQUssS0FBTCxDQUFXO0FBQTFDO0FBRkosU0FESjtBQU1IO0FBYitCLENBQWxCLENBQWxCOztBQWdCQSxJQUFJLFlBQVksTUFBTSxXQUFOLENBQWtCO0FBQzlCLGlCQUFhLFdBRGlCO0FBRTlCLGVBQVc7QUFDUCxtQkFBVyxVQUFVO0FBRGQsS0FGbUI7QUFLOUIsWUFBUSxrQkFBVztBQUNmO0FBQ0EsZUFDSTtBQUFBO0FBQUEsY0FBSyxXQUFXLFdBQVcsWUFBWCxFQUF5QixLQUFLLEtBQUwsQ0FBVyxTQUFwQyxDQUFoQjtBQUFpRSxpQkFBSyxLQUFMLENBQVc7QUFBNUUsU0FESjtBQUdIO0FBVjZCLENBQWxCLENBQWhCOztBQWFBLElBQUksY0FBYyxNQUFNLFdBQU4sQ0FBa0I7QUFDaEMsaUJBQWEsYUFEbUI7QUFFaEMsZUFBVztBQUNQLG1CQUFXLFVBQVU7QUFEZCxLQUZxQjtBQUtoQyxZQUFRLGtCQUFXO0FBQ2Y7QUFDQSxlQUNJO0FBQUE7QUFBQSxjQUFLLFdBQVcsV0FBVyxjQUFYLEVBQTJCLEtBQUssS0FBTCxDQUFXLFNBQXRDLENBQWhCO0FBQW1FLGlCQUFLLEtBQUwsQ0FBVztBQUE5RSxTQURKO0FBR0g7QUFWK0IsQ0FBbEIsQ0FBbEI7O0FBYUEsSUFBSSxRQUFRLE1BQU0sV0FBTixDQUFrQjtBQUMxQixpQkFBYSxPQURhO0FBRTFCLGVBQVc7QUFDUCxZQUFJLFVBQVUsTUFEUDtBQUVQLG1CQUFXLFVBQVUsTUFGZDtBQUdQLGVBQU8sVUFBVSxTQUFWLENBQW9CLENBQ3ZCLFVBQVUsTUFEYSxFQUV2QixVQUFVLE1BRmEsQ0FBcEIsQ0FIQTtBQU9QLGtCQUFVLFVBQVUsSUFQYjtBQVFQLGdCQUFRLFVBQVUsSUFSWDtBQVNQLGdCQUFRLFVBQVUsSUFUWDtBQVVQLGNBQU0sVUFBVTtBQVZULEtBRmU7QUFjMUIsUUFBSSxFQWRzQjtBQWUxQixVQUFNLGdCQUFXO0FBQ2IsWUFBSSxRQUFRLEVBQUUsTUFBSSxLQUFLLEVBQVgsQ0FBWjtBQUNBLGNBQU0sS0FBTixDQUFZLE1BQVo7QUFDQTs7Ozs7Ozs7OztBQVVILEtBNUJ5QjtBQTZCMUIsVUFBTSxnQkFBVztBQUNiLFlBQUksUUFBUSxFQUFFLE1BQUksS0FBSyxFQUFYLENBQVo7QUFDQSxjQUFNLEtBQU4sQ0FBWSxNQUFaO0FBQ0gsS0FoQ3lCO0FBaUMxQixZQUFRLGdCQUFTLEtBQVQsRUFBZ0I7QUFDcEIsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLE1BQWxCLEtBQTZCLFVBQWhDLEVBQTRDO0FBQ3hDLGlCQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLEtBQWxCO0FBQ0E7QUFDSDtBQUNKLEtBdEN5QjtBQXVDMUIsWUFBUSxnQkFBUyxLQUFULEVBQWdCO0FBQ3BCLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUFsQixLQUE2QixVQUFoQyxFQUE0QztBQUN4QyxpQkFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixLQUFsQjtBQUNBO0FBQ0g7QUFDSixLQTVDeUI7QUE2QzFCLGlCQUFhLHVCQUFXO0FBQ3BCLFlBQUksV0FBVyxLQUFLLEtBQUwsQ0FBVyxRQUExQjs7QUFFQSxlQUFPLE1BQU0sUUFBTixDQUFlLEdBQWYsQ0FBbUIsUUFBbkIsRUFBNkIsVUFBQyxLQUFELEVBQVc7QUFDM0MsZ0JBQUcsVUFBVSxJQUFiLEVBQW1CO0FBQ2YsdUJBQU8sSUFBUDtBQUNIOztBQUVELG1CQUFPLE1BQU0sWUFBTixDQUFtQixLQUFuQixFQUEwQixFQUExQixDQUFQO0FBQ0gsU0FOTSxDQUFQO0FBT0gsS0F2RHlCO0FBd0QxQixxQkFBaUIsMkJBQVc7QUFDeEIsZUFBTyxFQUFDLFVBQVUsS0FBWCxFQUFQO0FBQ0gsS0ExRHlCO0FBMkQxQix3QkFBb0IsOEJBQVc7QUFDM0I7QUFDQSxZQUFJLEtBQUssS0FBSyxLQUFMLENBQVcsRUFBcEI7QUFDQSxZQUFHLE9BQU8sRUFBUCxLQUFjLFdBQWpCLEVBQThCO0FBQzFCLGlCQUFLLEtBQUssT0FBTCxFQUFMO0FBQ0g7O0FBRUQsYUFBSyxFQUFMLEdBQVUsRUFBVjtBQUNILEtBbkV5QjtBQW9FMUIsdUJBQW1CLDZCQUFXO0FBQzFCO0FBQ0EsWUFBSSxTQUFTLEVBQUUsTUFBSSxLQUFLLEVBQVgsQ0FBYjtBQUNBLFlBQUcsS0FBSyxLQUFMLENBQVcsUUFBWCxLQUF3QixLQUEzQixFQUFrQztBQUM5QixtQkFBTyxJQUFQLENBQVksZUFBWixFQUE2QixRQUE3QjtBQUNBLG1CQUFPLElBQVAsQ0FBWSxlQUFaLEVBQTZCLEtBQTdCO0FBQ0g7O0FBRUQsZUFBTyxFQUFQLENBQVUsZ0JBQVYsRUFBNEIsS0FBSyxNQUFqQztBQUNBLGVBQU8sRUFBUCxDQUFVLGlCQUFWLEVBQTZCLEtBQUssTUFBbEM7O0FBRUEsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLElBQWxCLEtBQTJCLFVBQTlCLEVBQTBDO0FBQ3RDLGdCQUFJLE9BQU8sRUFBWDtBQUNBLGlCQUFLLE1BQUwsR0FBYyxNQUFkO0FBQ0EsaUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEI7QUFDSDtBQUNKLEtBcEZ5QjtBQXFGMUIsWUFBUSxrQkFBVztBQUNmO0FBRGUscUJBRVksS0FBSyxLQUZqQjtBQUFBLFlBRVIsU0FGUSxVQUVSLFNBRlE7QUFBQSxZQUVHLEtBRkgsVUFFRyxLQUZIOzs7QUFJZixlQUNJO0FBQUE7QUFBQSxjQUFLLElBQUksS0FBSyxFQUFkLEVBQWtCLFdBQVcsV0FBVyxPQUFYLEVBQW9CLE1BQXBCLEVBQTRCLFNBQTVCLENBQTdCLEVBQXFFLE1BQUssUUFBMUUsRUFBbUYsbUJBQWdCLEVBQW5HLEVBQXNHLGVBQVksTUFBbEg7QUFDSTtBQUFBO0FBQUEsa0JBQUssV0FBVSxjQUFmLEVBQThCLE9BQU8sRUFBQyxPQUFPLEtBQVIsRUFBckM7QUFDSTtBQUFBO0FBQUEsc0JBQUssV0FBVSxlQUFmO0FBQ0sseUJBQUssV0FBTDtBQURMO0FBREo7QUFESixTQURKO0FBU0g7QUFsR3lCLENBQWxCLENBQVo7O0FBcUdBLE9BQU8sT0FBUCxHQUFpQjtBQUNiLFdBQU8sS0FETTtBQUViLGlCQUFhLFdBRkE7QUFHYixlQUFXLFNBSEU7QUFJYixpQkFBYTtBQUpBLENBQWpCOzs7QUN0S0E7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxRQUFRLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSSxZQUFZLFFBQVEsT0FBUixFQUFpQixTQUFqQztBQUNBLElBQUksYUFBYSxRQUFRLFlBQVIsQ0FBakI7O0FBRUEsSUFBSSxPQUFPLFFBQVEsa0JBQVIsQ0FBWDs7QUFFQSxJQUFJLGNBQWMsTUFBTSxXQUFOLENBQWtCO0FBQ2hDLGlCQUFhLGFBRG1CO0FBRWhDLGVBQVc7QUFDUCxlQUFPLFVBQVUsU0FBVixDQUFvQixDQUN2QixVQUFVLE1BRGEsRUFFdkIsVUFBVSxNQUZhLENBQXBCLENBREE7QUFLUCxnQkFBUSxVQUFVLFNBQVYsQ0FBb0IsQ0FDeEIsVUFBVSxNQURjLEVBRXhCLFVBQVUsTUFGYyxDQUFwQjtBQUxELEtBRnFCO0FBWWhDLHFCQUFpQiwyQkFBVztBQUN4QjtBQUR3QixxQkFFQSxLQUFLLEtBRkw7QUFBQSxZQUVqQixLQUZpQixVQUVqQixLQUZpQjtBQUFBLFlBRVYsTUFGVSxVQUVWLE1BRlU7O0FBR3hCLGVBQU8sRUFBQyxPQUFPLEtBQVIsRUFBZSxRQUFRLE1BQXZCLEVBQVA7QUFDSCxLQWhCK0I7QUFpQmhDLCtCQUEyQixtQ0FBUyxTQUFULEVBQW9CO0FBQzNDO0FBRDJDLFlBRXBDLEtBRm9DLEdBRW5CLFNBRm1CLENBRXBDLEtBRm9DO0FBQUEsWUFFN0IsTUFGNkIsR0FFbkIsU0FGbUIsQ0FFN0IsTUFGNkI7O0FBRzNDLGFBQUssUUFBTCxDQUFjLEVBQUMsT0FBTyxLQUFSLEVBQWUsUUFBUSxNQUF2QixFQUFkO0FBQ0gsS0FyQitCO0FBc0JoQyxZQUFRLGtCQUFXO0FBQ2Y7QUFDQSxlQUNJO0FBQUE7QUFBQSxjQUFLLFdBQVUsZUFBZixFQUErQixPQUFPLEVBQUMsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFuQixFQUEwQixRQUFRLEtBQUssS0FBTCxDQUFXLE1BQTdDLEVBQXRDO0FBQ0k7QUFBQTtBQUFBLGtCQUFLLFdBQVUsYUFBZjtBQUE4QixxQkFBSyxLQUFMLENBQVc7QUFBekM7QUFESixTQURKO0FBS0g7QUE3QitCLENBQWxCLENBQWxCOztBQWdDQSxJQUFJLFlBQVksTUFBTSxXQUFOLENBQWtCO0FBQzlCLGlCQUFhLFdBRGlCO0FBRTlCLGVBQVc7QUFDUCxlQUFPLFVBQVUsU0FBVixDQUFvQixDQUN2QixVQUFVLE1BRGEsRUFFdkIsVUFBVSxNQUZhLENBQXBCLENBREE7QUFLUCxnQkFBUSxVQUFVLFNBQVYsQ0FBb0IsQ0FDeEIsVUFBVSxNQURjLEVBRXhCLFVBQVUsTUFGYyxDQUFwQjtBQUxELEtBRm1CO0FBWTlCLHFCQUFpQiwyQkFBVztBQUN4QjtBQUR3QixzQkFFQSxLQUFLLEtBRkw7QUFBQSxZQUVqQixLQUZpQixXQUVqQixLQUZpQjtBQUFBLFlBRVYsTUFGVSxXQUVWLE1BRlU7O0FBR3hCLGVBQU8sRUFBQyxPQUFPLEtBQVIsRUFBZSxRQUFRLE1BQXZCLEVBQVA7QUFDSCxLQWhCNkI7QUFpQjlCLCtCQUEyQixtQ0FBUyxTQUFULEVBQW9CO0FBQzNDO0FBRDJDLFlBRXBDLEtBRm9DLEdBRW5CLFNBRm1CLENBRXBDLEtBRm9DO0FBQUEsWUFFN0IsTUFGNkIsR0FFbkIsU0FGbUIsQ0FFN0IsTUFGNkI7O0FBRzNDLGFBQUssUUFBTCxDQUFjLEVBQUMsT0FBTyxLQUFSLEVBQWUsUUFBUSxNQUF2QixFQUFkO0FBQ0gsS0FyQjZCO0FBc0I5QixZQUFRLGtCQUFXO0FBQ2Y7QUFDQSxlQUNJO0FBQUE7QUFBQSxjQUFLLFdBQVUsWUFBZixFQUE0QixPQUFPLEVBQUMsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFuQixFQUEwQixRQUFRLEtBQUssS0FBTCxDQUFXLE1BQTdDLEVBQW5DO0FBQTBGLGlCQUFLLEtBQUwsQ0FBVztBQUFyRyxTQURKO0FBR0g7QUEzQjZCLENBQWxCLENBQWhCOztBQThCQSxJQUFJLGNBQWMsTUFBTSxXQUFOLENBQWtCO0FBQ2hDLGlCQUFhLGFBRG1CO0FBRWhDLGVBQVc7QUFDUCxlQUFPLFVBQVUsU0FBVixDQUFvQixDQUN2QixVQUFVLE1BRGEsRUFFdkIsVUFBVSxNQUZhLENBQXBCLENBREE7QUFLUCxnQkFBUSxVQUFVLFNBQVYsQ0FBb0IsQ0FDeEIsVUFBVSxNQURjLEVBRXhCLFVBQVUsTUFGYyxDQUFwQjtBQUxELEtBRnFCO0FBWWhDLHFCQUFpQiwyQkFBVztBQUN4QjtBQUR3QixzQkFFQSxLQUFLLEtBRkw7QUFBQSxZQUVqQixLQUZpQixXQUVqQixLQUZpQjtBQUFBLFlBRVYsTUFGVSxXQUVWLE1BRlU7O0FBR3hCLGVBQU8sRUFBQyxPQUFPLEtBQVIsRUFBZSxRQUFRLE1BQXZCLEVBQVA7QUFDSCxLQWhCK0I7QUFpQmhDLCtCQUEyQixtQ0FBUyxTQUFULEVBQW9CO0FBQzNDO0FBRDJDLFlBRXBDLEtBRm9DLEdBRW5CLFNBRm1CLENBRXBDLEtBRm9DO0FBQUEsWUFFN0IsTUFGNkIsR0FFbkIsU0FGbUIsQ0FFN0IsTUFGNkI7O0FBRzNDLGFBQUssUUFBTCxDQUFjLEVBQUMsT0FBTyxLQUFSLEVBQWUsUUFBUSxNQUF2QixFQUFkO0FBQ0gsS0FyQitCO0FBc0JoQyxZQUFRLGtCQUFXO0FBQ2Y7QUFDQSxlQUNJO0FBQUE7QUFBQSxjQUFLLFdBQVUsY0FBZixFQUE4QixPQUFPLEVBQUMsT0FBTyxLQUFLLEtBQUwsQ0FBVyxLQUFuQixFQUEwQixRQUFRLEtBQUssS0FBTCxDQUFXLE1BQTdDLEVBQXJDO0FBQTRGLGlCQUFLLEtBQUwsQ0FBVztBQUF2RyxTQURKO0FBR0g7QUEzQitCLENBQWxCLENBQWxCOztBQThCQSxJQUFJLFFBQVEsTUFBTSxXQUFOLENBQWtCO0FBQzFCLGlCQUFhLE9BRGE7QUFFMUIsZUFBVztBQUNQLFlBQUksVUFBVSxNQURQO0FBRVAsbUJBQVcsVUFBVSxNQUZkO0FBR1AsZ0JBQVEsVUFBVTtBQUhYLEtBRmU7QUFPMUIsUUFBSSxFQVBzQjtBQVExQixpQkFBYSx1QkFBVztBQUNwQixZQUFJLFdBQVcsS0FBSyxLQUFMLENBQVcsUUFBMUI7O0FBRUEsZUFBTyxNQUFNLFFBQU4sQ0FBZSxHQUFmLENBQW1CLFFBQW5CLEVBQTZCLFVBQUMsS0FBRCxFQUFXO0FBQzNDLGdCQUFHLFVBQVUsSUFBYixFQUFtQjtBQUNmLHVCQUFPLElBQVA7QUFDSDs7QUFFRCxtQkFBTyxNQUFNLFlBQU4sQ0FBbUIsS0FBbkIsRUFBMEIsRUFBMUIsQ0FBUDtBQUNILFNBTk0sQ0FBUDtBQU9ILEtBbEJ5QjtBQW1CN0IscUJBQWlCLDJCQUFXO0FBQzNCO0FBQ0E7QUFDQSxlQUFPLEVBQUMsV0FBVyxlQUFaLEVBQVA7QUFDQSxLQXZCNEI7QUF3QjFCLHdCQUFvQiw4QkFBVztBQUMzQjtBQUNBLFlBQUksS0FBSyxLQUFLLEtBQUwsQ0FBVyxFQUFwQjtBQUNBLFlBQUcsT0FBTyxFQUFQLEtBQWMsV0FBakIsRUFBOEI7QUFDMUIsaUJBQUssS0FBSyxPQUFMLEVBQUw7QUFDSDs7QUFFRCxhQUFLLEVBQUwsR0FBVSxFQUFWO0FBQ0gsS0FoQ3lCO0FBaUMxQix1QkFBbUIsNkJBQVc7QUFDMUI7QUFDQSxZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsTUFBbEIsS0FBNkIsVUFBaEMsRUFBNEM7QUFDeEMsaUJBQUssS0FBTCxDQUFXLE1BQVg7QUFDSDtBQUNKLEtBdEN5QjtBQXVDMUIsWUFBUSxrQkFBVztBQUNmO0FBRGUsWUFFUixTQUZRLEdBRUssS0FBSyxLQUZWLENBRVIsU0FGUTs7O0FBSWYsZUFDSTtBQUFBO0FBQUEsY0FBSyxXQUFXLFdBQVcsT0FBWCxFQUFvQixTQUFwQixDQUFoQjtBQUFpRCxpQkFBSyxXQUFMO0FBQWpELFNBREo7QUFHSDtBQTlDeUIsQ0FBbEIsQ0FBWjs7QUFpREEsT0FBTyxPQUFQLEdBQWlCO0FBQ2IsV0FBTyxLQURNO0FBRWIsaUJBQWEsV0FGQTtBQUdiLGVBQVcsU0FIRTtBQUliLGlCQUFhO0FBSkEsQ0FBakI7OztBQ2hLQTs7Ozs7Ozs7OztBQVVBOzs7O0FBRUE7Ozs7OztBQUNBLElBQUksYUFBYSxRQUFRLFlBQVIsQ0FBakI7O0FBRUEsSUFBSSxRQUFRLGdCQUFNLFdBQU4sQ0FBa0I7QUFDMUIsaUJBQWEsT0FEYTtBQUUxQixlQUFXO0FBQ1AsbUJBQVcsaUJBQVUsTUFEZDtBQUVQLGNBQU0saUJBQVUsTUFGVDtBQUdQLHVCQUFlLGlCQUFVLFNBQVYsQ0FBb0IsQ0FDL0IsaUJBQVUsTUFEcUIsRUFFL0IsaUJBQVUsTUFGcUIsRUFHL0IsaUJBQVUsSUFIcUIsQ0FBcEIsQ0FIUjtBQVFQLGtCQUFVLGlCQUFVLElBUmI7QUFTUCxlQUFPLGlCQUFVLFNBQVYsQ0FBb0IsQ0FDdkIsaUJBQVUsTUFEYSxFQUV2QixpQkFBVSxNQUZhLEVBR3ZCLGlCQUFVLElBSGEsQ0FBcEI7QUFUQSxLQUZlO0FBaUIxQixZQUFRLGtCQUFXO0FBQ2Y7QUFEZSxxQkFFMkMsS0FBSyxLQUZoRDtBQUFBLFlBRVIsU0FGUSxVQUVSLFNBRlE7QUFBQSxZQUVHLElBRkgsVUFFRyxJQUZIO0FBQUEsWUFFUyxhQUZULFVBRVMsYUFGVDtBQUFBLFlBRXdCLFFBRnhCLFVBRXdCLFFBRnhCO0FBQUEsWUFFa0MsS0FGbEMsVUFFa0MsS0FGbEM7O0FBR2YsWUFBTSxXQUFXLEVBQWpCO0FBQ0EsWUFBRyxrQkFBa0IsU0FBckIsRUFBZ0M7QUFDNUIscUJBQVMsT0FBVCxHQUFvQixLQUFLLEtBQUwsQ0FBVyxLQUFYLEtBQXFCLGFBQXpDO0FBQ0g7QUFDRDs7Ozs7QUFLQSxpQkFBUyxRQUFULEdBQW9CLFNBQVMsSUFBVCxDQUFjLElBQWQsRUFBb0IsS0FBSyxLQUFMLENBQVcsS0FBL0IsQ0FBcEI7O0FBRUEsZUFDSTtBQUFBO0FBQUEsY0FBSyxXQUFVLE9BQWY7QUFDSTtBQUFBO0FBQUE7QUFDSSxrRUFBTyxNQUFLLE9BQVosRUFBb0IsV0FBVyxTQUEvQixFQUEwQyxNQUFNLElBQWhELEVBQXNELE9BQU87QUFBN0QsbUJBQ1EsUUFEUixFQURKO0FBR0k7QUFBQTtBQUFBLHNCQUFNLFdBQVUsS0FBaEI7QUFBdUIseUJBQUssS0FBTCxDQUFXO0FBQWxDO0FBSEo7QUFESixTQURKO0FBU0g7QUF4Q3lCLENBQWxCLENBQVo7O0FBMkNBLE9BQU8sT0FBUCxHQUFpQixLQUFqQjs7O0FDMURBOzs7Ozs7Ozs7O0FBVUE7O0FBRUE7Ozs7OztBQUNBLElBQUksYUFBYSxRQUFRLFlBQVIsQ0FBakI7O0FBRUEsSUFBSSxhQUFhLGdCQUFNLFdBQU4sQ0FBa0I7QUFDL0IsaUJBQWEsWUFEa0I7QUFFL0IsZUFBVztBQUNQLG1CQUFXLGlCQUFVLE1BRGQ7QUFFUCxjQUFNLGlCQUFVLE1BRlQ7QUFHUCx1QkFBZSxpQkFBVSxTQUFWLENBQW9CLENBQy9CLGlCQUFVLE1BRHFCLEVBRS9CLGlCQUFVLE1BRnFCLEVBRy9CLGlCQUFVLElBSHFCLENBQXBCLENBSFI7QUFRUCxrQkFBVSxpQkFBVSxJQVJiO0FBU1Asb0JBQVksaUJBQVU7QUFUZixLQUZvQjtBQWEvQixjQUFVLGtCQUFTLEtBQVQsRUFBZ0IsS0FBaEIsRUFBdUI7QUFDN0IsYUFBSyxRQUFMLENBQWMsRUFBQyxlQUFlLEtBQWhCLEVBQWQ7QUFDQSxZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsUUFBbEIsS0FBK0IsVUFBbEMsRUFBOEM7QUFDMUMsaUJBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsS0FBcEIsRUFBMkIsS0FBM0I7QUFDSDtBQUNKLEtBbEI4QjtBQW1CL0IsaUJBQWEsdUJBQVc7QUFBQSxxQkFDZ0IsS0FBSyxLQURyQjtBQUFBLFlBQ2IsU0FEYSxVQUNiLFNBRGE7QUFBQSxZQUNGLElBREUsVUFDRixJQURFO0FBQ2QsWUFBa0IsUUFBbEIsVUFBa0IsUUFBbEI7QUFDRiw0QkFBZ0IsS0FBSyxLQUFMLENBQVcsYUFBM0I7QUFDQSx1QkFBVyxLQUFLLFFBQWhCOztBQUVKLGVBQU8sZ0JBQU0sUUFBTixDQUFlLEdBQWYsQ0FBbUIsUUFBbkIsRUFBNkIsVUFBQyxLQUFELEVBQVc7QUFDM0MsZ0JBQUcsVUFBVSxJQUFiLEVBQW1CO0FBQ2YsdUJBQU8sSUFBUDtBQUNIOztBQUVELG1CQUFPLGdCQUFNLFlBQU4sQ0FBbUIsS0FBbkIsRUFBMEI7QUFDN0Isb0NBRDZCO0FBRTdCLDBCQUY2QjtBQUc3Qiw0Q0FINkI7QUFJN0I7QUFKNkIsYUFBMUIsQ0FBUDtBQU1ILFNBWE0sQ0FBUDtBQVlILEtBcEM4QjtBQXFDL0Isb0JBQWdCLHdCQUFTLEtBQVQsRUFBZ0I7QUFDNUIsWUFBSSxnQkFBZ0IsTUFBTSxhQUExQjtBQUNBLFlBQUcsT0FBTyxhQUFQLEtBQXlCLFdBQTVCLEVBQXlDO0FBQ3JDLDRCQUFnQixJQUFoQjtBQUNIOztBQUVELGVBQU87QUFDSCwyQkFBZTtBQURaLFNBQVA7QUFHSCxLQTlDOEI7QUErQy9CLHFCQUFpQiwyQkFBVztBQUN4QixlQUFPLEtBQUssY0FBTCxDQUFvQixLQUFLLEtBQXpCLENBQVA7QUFDSCxLQWpEOEI7QUFrRC9CLHVCQUFtQiw2QkFBVztBQUMxQjtBQUNBO0FBQ0gsS0FyRDhCO0FBc0QvQiwrQkFBMkIsbUNBQVMsU0FBVCxFQUFvQjtBQUMzQztBQUNBLGFBQUssUUFBTCxDQUFjLEtBQUssY0FBTCxDQUFvQixTQUFwQixDQUFkO0FBQ0gsS0F6RDhCO0FBMEQvQixZQUFRLGtCQUFXO0FBQ2Y7QUFDQSxlQUNJO0FBQUE7QUFBQSxjQUFLLFdBQVcsV0FBVyxFQUFDLG9CQUFvQixLQUFLLEtBQUwsQ0FBVyxVQUFoQyxFQUFYLENBQWhCO0FBQ0ssaUJBQUssV0FBTDtBQURMLFNBREo7QUFLSDtBQWpFOEIsQ0FBbEIsQ0FBakI7O0FBb0VBLE9BQU8sT0FBUCxHQUFpQixVQUFqQjs7O0FDbkZBOzs7Ozs7Ozs7OztBQVdBOztBQUVBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksWUFBWSxRQUFRLE9BQVIsRUFBaUIsU0FBakM7QUFDQSxJQUFJLGFBQWEsUUFBUSxZQUFSLENBQWpCOztBQUVBLElBQUksT0FBTyxRQUFRLGtCQUFSLENBQVg7O0FBRUEsSUFBSSxlQUFlLE1BQU0sV0FBTixDQUFrQjtBQUNqQyxpQkFBYSxjQURvQjtBQUVqQyxlQUFXO0FBQ1AsWUFBSSxVQUFVLE1BRFA7QUFFUCxjQUFNLFVBQVUsTUFGVDtBQUdQLGNBQU0sVUFBVSxNQUhULEVBR2lCO0FBQ3hCLGFBQUssVUFBVSxNQUpSO0FBS1AsZ0JBQVEsVUFBVSxNQUxYO0FBTVAsY0FBTSxVQUFVLE1BTlQ7QUFPUCxxQkFBYSxVQUFVLE1BUGhCO0FBUVAsb0JBQVksVUFBVSxTQUFWLENBQW9CLENBQzVCLFVBQVUsS0FEa0IsRUFFNUIsVUFBVSxNQUZrQixDQUFwQixDQVJMO0FBWVAsa0JBQVUsVUFBVSxNQVpiO0FBYVAsZ0JBQVEsVUFBVSxNQWJYO0FBY1AsbUJBQVcsVUFBVSxNQWRkO0FBZVAsbUJBQVcsVUFBVSxNQWZkO0FBZ0JQLHVCQUFlLFVBQVUsTUFoQmxCO0FBaUJQLDJCQUFtQixVQUFVLE1BakJ0QixDQWlCOEI7QUFqQjlCLEtBRnNCO0FBcUJqQyxRQUFJLEVBckI2QjtBQXNCakMsbUJBQWUsU0F0QmtCO0FBdUJwQyxxQkFBaUIsMkJBQVc7QUFDM0I7QUFDQTtBQUNNLGVBQU8sRUFBQyxRQUFRLE1BQVQsRUFBaUIsV0FBVyxrQkFBNUIsRUFBZ0QsWUFBWSx3QkFBNUQsRUFBc0YsYUFBYSxXQUFXLFlBQTlHLEVBQTRILFFBQVEsWUFBcEksRUFBa0osV0FBVyxJQUE3SixFQUFtSyxVQUFVLElBQTdLLEVBQW1MLGVBQWUsSUFBbE0sRUFBd00sV0FBVyxDQUFuTixFQUFQO0FBQ04sS0EzQm1DO0FBNEJqQyx3QkFBb0IsOEJBQVc7QUFDM0I7QUFDQSxZQUFJLEtBQUssS0FBSyxLQUFMLENBQVcsRUFBcEI7QUFDQSxZQUFHLE9BQU8sRUFBUCxLQUFjLFdBQWpCLEVBQThCO0FBQzFCLGlCQUFLLEtBQUssT0FBTCxFQUFMO0FBQ0g7QUFDRCxhQUFLLEVBQUwsR0FBVSxFQUFWO0FBQ0gsS0FuQ2dDO0FBb0NqQyxtQkFBZSx1QkFBUyxLQUFULEVBQWdCO0FBQUEsWUFDcEIsSUFEb0IsR0FDaUQsS0FEakQsQ0FDcEIsSUFEb0I7QUFBQSxZQUNkLEdBRGMsR0FDaUQsS0FEakQsQ0FDZCxHQURjO0FBQUEsWUFDVCxNQURTLEdBQ2lELEtBRGpELENBQ1QsTUFEUztBQUFBLFlBQ0QsSUFEQyxHQUNpRCxLQURqRCxDQUNELElBREM7QUFBQSxZQUNLLFNBREwsR0FDaUQsS0FEakQsQ0FDSyxTQURMO0FBQUEsWUFDZ0IsVUFEaEIsR0FDaUQsS0FEakQsQ0FDZ0IsVUFEaEI7QUFBQSxZQUM0QixpQkFENUIsR0FDaUQsS0FEakQsQ0FDNEIsaUJBRDVCOzs7QUFHM0IsWUFBSSxhQUFhLElBQUksTUFBTSxJQUFOLENBQVcsVUFBZixDQUEwQjtBQUN2Qyx1QkFBVztBQUNQLHNCQUFNO0FBQ0YseUJBQU0sUUFBUSxTQUFTLElBQWpCLElBQXlCLEtBQUssTUFBTCxHQUFjLENBQXhDLEdBQTZDLE9BQU8sR0FBcEQsR0FBMEQsR0FEN0Q7QUFFRiwwQkFBTSxNQUZKO0FBR0YsOEJBQVUsTUFIUjtBQUlGLDBCQUFNLElBSkosRUFJZTtBQUNqQixpQ0FBYTtBQUxYLGlCQURDO0FBUVAsOEJBQWMsc0JBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUI7QUFDL0Isd0JBQUcsUUFBUSxNQUFSLElBQWtCLHNCQUFzQixJQUEzQyxFQUFnRDtBQUM1QztBQUNBLDRCQUFHLGtCQUFrQixhQUFsQixJQUFtQyxLQUFLLE1BQXhDLElBQWtELEtBQUssTUFBTCxDQUFZLE9BQWpFLEVBQXlFO0FBQ3JFLGdDQUFJLFVBQVUsS0FBSyxNQUFMLENBQVksT0FBMUI7QUFDQSxvQ0FBUSxHQUFSLENBQVksVUFBQyxNQUFELEVBQVk7QUFDcEIscUNBQUssa0JBQWtCLFdBQXZCLElBQXNDLE9BQU8sS0FBN0M7QUFDSCw2QkFGRDtBQUdIO0FBQ0o7QUFDRCwyQkFBTyxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQVA7QUFDSDtBQW5CTSxhQUQ0QjtBQXNCdkMsb0JBQVE7QUFDSjtBQUNBLHNCQUFNLGNBQVMsUUFBVCxFQUFtQjtBQUNyQix3QkFBSSxNQUFNLEVBQVY7QUFBQSx3QkFBYyxXQUFXLFFBQXpCOztBQUVBLHdCQUFHLGFBQWEsVUFBVSxNQUFWLEdBQW1CLENBQWhDLElBQXFDLGFBQWEsTUFBckQsRUFBNkQ7QUFDekQsOEJBQU0sVUFBVSxLQUFWLENBQWdCLEdBQWhCLENBQU47QUFDSDtBQUNELHlCQUFJLElBQUksQ0FBUixJQUFhLEdBQWIsRUFBa0I7QUFDZDtBQUNBLDRCQUFHLENBQUMsUUFBSixFQUFjO0FBQ1YsdUNBQVcsRUFBWDtBQUNBO0FBQ0g7QUFDRCxtQ0FBVyxTQUFTLElBQUksQ0FBSixDQUFULENBQVg7QUFDSDtBQUNELDJCQUFPLFFBQVA7QUFDSCxpQkFqQkc7QUFrQko7QUFDQSx1QkFBTyxlQUFTLFFBQVQsRUFBbUI7QUFDdEI7QUFDQSx3QkFBSSxNQUFNLEVBQVY7QUFBQSx3QkFBYyxRQUFRLFFBQXRCO0FBQ0Esd0JBQUcsY0FBYyxXQUFXLE1BQVgsR0FBb0IsQ0FBbEMsSUFBdUMsY0FBYyxNQUF4RCxFQUFnRTtBQUM1RCw4QkFBTSxXQUFXLEtBQVgsQ0FBaUIsR0FBakIsQ0FBTjtBQUNIO0FBQ0QseUJBQUksSUFBSSxDQUFSLElBQWEsR0FBYixFQUFrQjtBQUNkO0FBQ0EsNEJBQUcsQ0FBQyxLQUFKLEVBQVc7QUFDUCxvQ0FBUSxDQUFSO0FBQ0E7QUFDSDtBQUNELGdDQUFRLE1BQU0sSUFBSSxDQUFKLENBQU4sQ0FBUjtBQUNIO0FBQ0QsMkJBQU8sS0FBUDtBQUNIO0FBbENHLGFBdEIrQjtBQTBEdkMsNkJBQWlCO0FBMURzQixTQUExQixDQUFqQjtBQTREQSxlQUFPLFVBQVA7QUFDSCxLQXBHZ0M7QUFxR2pDLGdCQUFZLG9CQUFTLEtBQVQsRUFBZ0I7QUFBQSxZQUNqQixXQURpQixHQUM2QyxLQUQ3QyxDQUNqQixXQURpQjtBQUFBLFlBQ0osUUFESSxHQUM2QyxLQUQ3QyxDQUNKLFFBREk7QUFBQSxZQUNNLGFBRE4sR0FDNkMsS0FEN0MsQ0FDTSxhQUROO0FBQUEsWUFDcUIsU0FEckIsR0FDNkMsS0FEN0MsQ0FDcUIsU0FEckI7QUFBQSxZQUNnQyxTQURoQyxHQUM2QyxLQUQ3QyxDQUNnQyxTQURoQzs7QUFFeEIsWUFBSSxhQUFhLEtBQUssYUFBTCxDQUFtQixLQUFuQixDQUFqQjs7QUFFQSxZQUFJLFVBQVU7QUFDVix5QkFBYSxXQURIO0FBRVYsc0JBQVUsUUFGQTtBQUdWLHdCQUFZLFVBSEY7QUFJViwyQkFBZSxhQUpMO0FBS1YsdUJBQVcsU0FMRDtBQU1WLHVCQUFXO0FBTkQsU0FBZDtBQVFBLGVBQU8sT0FBUDtBQUNILEtBbEhnQztBQW1IakMsdUJBQW1CLDZCQUFXO0FBQzFCO0FBQ0EsYUFBSyxhQUFMLEdBQXFCLEVBQUUsTUFBSSxLQUFLLEVBQVgsQ0FBckI7QUFDQTtBQUNBLGFBQUssWUFBTCxHQUFvQixLQUFLLGFBQUwsQ0FBbUIsaUJBQW5CLENBQXFDLEtBQUssVUFBTCxDQUFnQixLQUFLLEtBQXJCLENBQXJDLENBQXBCO0FBQ0gsS0F4SGdDO0FBeUhqQywrQkFBMkIsbUNBQVMsU0FBVCxFQUFvQixDQUU5QyxDQTNIZ0M7QUE0SGpDLFlBQVEsa0JBQVc7QUFDZjtBQUNBLFlBQUksYUFBYTtBQUNiLG1CQUFPO0FBRE0sU0FBakI7QUFGZSxxQkFLYSxLQUFLLEtBTGxCO0FBQUEsWUFLUCxJQUxPLFVBS1AsSUFMTztBQUFBLFlBS0QsU0FMQyxVQUtELFNBTEM7O0FBTWYsZUFDSSwrQkFBTyxJQUFJLEtBQUssRUFBaEIsRUFBb0IsTUFBTSxJQUExQixFQUFnQyxXQUFXLFdBQVcsU0FBWCxDQUEzQyxFQUFrRSxPQUFPLFVBQXpFLEdBREo7QUFHSDtBQXJJZ0MsQ0FBbEIsQ0FBbkI7O0FBd0lBLE9BQU8sT0FBUCxHQUFpQixZQUFqQjs7O0FDM0pBOzs7Ozs7Ozs7OztBQVdBOztBQUVBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksWUFBWSxRQUFRLE9BQVIsRUFBaUIsU0FBakM7QUFDQSxJQUFJLGFBQWEsUUFBUSxZQUFSLENBQWpCOztBQUVBLElBQUksT0FBTyxRQUFRLGtCQUFSLENBQVg7QUFDQSxJQUFJLFdBQVcsUUFBUSxzQkFBUixDQUFmOztBQUVBLElBQUksYUFBYSxNQUFNLFdBQU4sQ0FBa0I7QUFDL0IsaUJBQWEsWUFEa0I7QUFFL0IsZUFBVztBQUNQLFlBQUksVUFBVSxNQURQO0FBRVAsbUJBQVcsVUFBVSxNQUZkO0FBR1AsY0FBTSxVQUFVLE1BSFQ7QUFJUCxjQUFNLFVBQVUsU0FBVixDQUFvQixDQUN0QixVQUFVLE1BRFksRUFDVTtBQUNoQyxrQkFBVSxNQUZZLENBRVU7QUFGVixTQUFwQixDQUpDO0FBUVAsYUFBSyxVQUFVLFNBQVYsQ0FBb0IsQ0FDckIsVUFBVSxNQURXLEVBQ1c7QUFDaEMsa0JBQVUsTUFGVyxDQUVXO0FBRlgsU0FBcEIsQ0FSRTtBQVlQLGFBQUssVUFBVSxTQUFWLENBQW9CLENBQ3JCLFVBQVUsTUFEVyxFQUNXO0FBQ2hDLGtCQUFVLE1BRlcsQ0FFVztBQUZYLFNBQXBCLENBWkU7QUFnQlAsb0JBQVksVUFBVSxJQWhCZjtBQWlCUCxrQkFBVSxVQUFVLE1BakJiO0FBa0JQLGVBQU8sVUFBVSxTQUFWLENBQW9CLENBQ3ZCLFVBQVUsTUFEYSxFQUV2QixVQUFVLE1BRmEsQ0FBcEIsQ0FsQkE7QUFzQlAsa0JBQVUsVUFBVSxJQXRCYjtBQXVCUCxrQkFBVSxVQUFVLElBdkJiO0FBd0JQLGlCQUFTLFVBQVUsSUF4Qlo7QUF5QlAsZ0JBQVEsVUFBVSxJQXpCWDtBQTBCUCxjQUFNLFVBQVU7QUExQlQsS0FGb0I7QUE4Qi9CLFFBQUksRUE5QjJCO0FBK0IvQjtBQUNBO0FBQ0EsVUFBTSxnQkFBVztBQUNiLGFBQUssVUFBTCxDQUFnQixJQUFoQjtBQUNILEtBbkM4QjtBQW9DL0IsV0FBTyxpQkFBVztBQUNkLGFBQUssVUFBTCxDQUFnQixLQUFoQjtBQUNILEtBdEM4QjtBQXVDL0IsY0FBVSxvQkFBVztBQUNqQixhQUFLLFVBQUwsQ0FBZ0IsUUFBaEI7QUFDSCxLQXpDOEI7QUEwQy9CLGFBQVMsbUJBQVc7QUFDaEIsWUFBSSxPQUFPLEtBQUssVUFBTCxDQUFnQixLQUFoQixFQUFYLENBRGdCLENBQ29CO0FBQ3BDO0FBQ0E7QUFDQSxlQUFPLFNBQVMsZUFBVCxDQUF5QixJQUF6QixDQUFQLENBSmdCLENBSTBCO0FBQzdDLEtBL0M4QjtBQWdEL0IsYUFBUyxpQkFBUyxJQUFULEVBQWU7QUFDcEI7Ozs7Ozs7O0FBUUE7QUFDQSxZQUFHLE9BQU8sSUFBUCxLQUFnQixRQUFoQixJQUE0QixPQUFPLEtBQUssUUFBWixLQUF5QixVQUF4RCxFQUFvRTtBQUNoRSxpQkFBSyxVQUFMLENBQWdCLEtBQWhCLENBQXNCLElBQXRCO0FBQ0g7QUFDSixLQTdEOEI7QUE4RC9CLFlBQVEsZ0JBQVMsQ0FBVCxFQUFZO0FBQ2hCLFlBQUcsT0FBTyxDQUFQLEtBQWEsV0FBaEIsRUFBNkI7QUFDekIsZ0JBQUksSUFBSjtBQUNIO0FBQ0QsYUFBSyxVQUFMLENBQWdCLE1BQWhCLENBQXVCLENBQXZCO0FBQ0gsS0FuRThCO0FBb0UvQixTQUFLLGFBQVMsSUFBVCxFQUFlO0FBQ2hCLFlBQUcsT0FBTyxJQUFQLEtBQWdCLFFBQWhCLElBQTRCLE9BQU8sS0FBSyxRQUFaLEtBQXlCLFVBQXhELEVBQW9FO0FBQ2hFLGlCQUFLLFVBQUwsQ0FBZ0IsR0FBaEIsQ0FBb0IsSUFBcEI7QUFDSDtBQUNKLEtBeEU4QjtBQXlFL0IsU0FBSyxhQUFTLElBQVQsRUFBZTtBQUNoQixZQUFHLE9BQU8sSUFBUCxLQUFnQixRQUFoQixJQUE0QixPQUFPLEtBQUssUUFBWixLQUF5QixVQUF4RCxFQUFvRTtBQUNoRSxpQkFBSyxVQUFMLENBQWdCLEdBQWhCLENBQW9CLElBQXBCO0FBQ0g7QUFDSixLQTdFOEI7QUE4RS9CO0FBQ0E7QUFDQSxjQUFVLGtCQUFTLENBQVQsRUFBWTtBQUNsQjtBQUNBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxRQUFsQixLQUErQixVQUFsQyxFQUE4QztBQUMxQyxnQkFBSSxPQUFPLEtBQUssT0FBTCxFQUFYO0FBQ0EsaUJBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsSUFBcEI7O0FBRUE7QUFDSDtBQUNKLEtBeEY4QjtBQXlGL0IsYUFBUyxpQkFBUyxDQUFULEVBQVk7QUFDakI7QUFDQTtBQUNBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxPQUFsQixLQUE4QixVQUFqQyxFQUE2QztBQUN6QyxpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixDQUFuQjs7QUFFQTtBQUNIO0FBQ0osS0FqRzhCO0FBa0cvQixZQUFRLGdCQUFTLENBQVQsRUFBWTtBQUNoQjtBQUNBO0FBQ0EsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLE1BQWxCLEtBQTZCLFVBQWhDLEVBQTRDO0FBQ3hDLGlCQUFLLEtBQUwsQ0FBVyxNQUFYLENBQWtCLENBQWxCOztBQUVBO0FBQ0g7QUFDSixLQTFHOEI7QUEyRy9CO0FBQ0E7Ozs7Ozs7Ozs7O0FBYUEsb0JBQWdCLDBCQUFXO0FBQUEsWUFDaEIsUUFEZ0IsR0FDSixLQUFLLEtBREQsQ0FDaEIsUUFEZ0I7OztBQUd2QixZQUFJLGFBQUo7QUFDQSxZQUFHLE9BQU8sUUFBUCxLQUFvQixXQUF2QixFQUFvQztBQUNoQyw0QkFBZ0IsQ0FBaEI7QUFDSCxTQUZELE1BRU07QUFDRiw0QkFBZ0IsUUFBaEI7QUFDSDs7QUFFRCxlQUFPO0FBQ0gsd0JBQVksT0FEVDtBQUVILHNCQUFVO0FBRlAsU0FBUDtBQUlILEtBdkk4QjtBQXdJL0IsZ0JBQVksc0JBQVc7QUFBQSxxQkFDa0IsS0FBSyxLQUR2QjtBQUFBLFlBQ1osSUFEWSxVQUNaLElBRFk7QUFBQSxZQUNOLFVBRE0sVUFDTixVQURNO0FBQUEsWUFDTSxHQUROLFVBQ00sR0FETjtBQUFBLFlBQ1csR0FEWCxVQUNXLEdBRFg7OztBQUduQixZQUFJLFNBQUo7QUFDQSxZQUFHLE9BQU8sSUFBUCxLQUFnQixXQUFuQixFQUFnQztBQUM1Qix3QkFBWSxJQUFJLElBQUosRUFBWjtBQUNILFNBRkQsTUFFTSxJQUFHLE9BQU8sSUFBUCxLQUFnQixRQUFoQixJQUE0QixPQUFPLEtBQUssUUFBWixLQUF5QixVQUF4RCxFQUFvRTtBQUN0RSx3QkFBWSxJQUFaO0FBQ0g7O0FBRUQsWUFBSSxTQUFTLFlBQWI7QUFBQSxZQUNJLFdBREo7QUFFQSxZQUFHLGVBQWUsSUFBbEIsRUFBd0I7QUFDcEIscUJBQVMsa0JBQVQ7QUFDQSwwQkFBYyxLQUFLLGNBQUwsRUFBZDtBQUNIOztBQUVELFlBQUksVUFBVTtBQUNWLG1CQUFPLFNBREc7QUFFVixvQkFBUSxNQUZFO0FBR1YscUJBQVMsT0FIQyxFQUdjO0FBQ3hCLG9CQUFRLEtBQUssUUFKSDtBQUtWLG1CQUFPLEtBQUssT0FMRjtBQU1WLGtCQUFNLEtBQUs7QUFORCxTQUFkOztBQVNBLFVBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsV0FBbEI7O0FBRUE7QUFDQSxZQUFHLE9BQU8sR0FBUCxLQUFlLFdBQWxCLEVBQStCO0FBQzNCLGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBQyxLQUFLLEdBQU4sRUFBbEI7QUFDSDs7QUFFRDtBQUNBLFlBQUcsT0FBTyxHQUFQLEtBQWUsV0FBbEIsRUFBK0I7QUFDM0IsY0FBRSxNQUFGLENBQVMsT0FBVCxFQUFrQixFQUFDLEtBQUssR0FBTixFQUFsQjtBQUNIOztBQUVELGVBQU8sT0FBUDtBQUNILEtBL0s4QjtBQWdML0I7Ozs7OztBQU1BLHdCQUFvQiw4QkFBVztBQUMzQjtBQUNBLFlBQUksS0FBSyxLQUFLLEtBQUwsQ0FBVyxFQUFwQjtBQUNBLFlBQUcsT0FBTyxFQUFQLEtBQWMsV0FBakIsRUFBOEI7QUFDMUIsaUJBQUssS0FBSyxPQUFMLEVBQUw7QUFDSDs7QUFFRCxhQUFLLEVBQUwsR0FBVSxFQUFWO0FBQ0gsS0E5TDhCO0FBK0wvQix1QkFBbUIsNkJBQVc7QUFDMUI7QUFDQSxhQUFLLFdBQUwsR0FBbUIsRUFBRSxNQUFJLEtBQUssRUFBWCxDQUFuQjs7QUFFQSxZQUFHLEtBQUssS0FBTCxDQUFXLFVBQVgsS0FBMEIsSUFBN0IsRUFBbUM7QUFDL0IsaUJBQUssVUFBTCxHQUFrQixLQUFLLFdBQUwsQ0FBaUIsbUJBQWpCLENBQXFDLEtBQUssVUFBTCxFQUFyQyxFQUF3RCxJQUF4RCxDQUE2RCxxQkFBN0QsQ0FBbEI7QUFDSCxTQUZELE1BRU07QUFDRixpQkFBSyxVQUFMLEdBQWtCLEtBQUssV0FBTCxDQUFpQixlQUFqQixDQUFpQyxLQUFLLFVBQUwsRUFBakMsRUFBb0QsSUFBcEQsQ0FBeUQsaUJBQXpELENBQWxCO0FBQ0g7O0FBRUQsWUFBRyxLQUFLLEtBQUwsQ0FBVyxRQUFYLEtBQXdCLElBQTNCLEVBQWlDO0FBQzdCLGlCQUFLLE1BQUwsQ0FBWSxLQUFaO0FBQ0g7O0FBRUQsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLElBQWxCLEtBQTJCLFVBQTlCLEVBQTBDO0FBQ3RDLGdCQUFJLE9BQU8sRUFBWDtBQUNBLGlCQUFLLFdBQUwsR0FBbUIsS0FBSyxXQUF4QjtBQUNBLGlCQUFLLFVBQUwsR0FBa0IsS0FBSyxVQUF2QjtBQUNBLGlCQUFLLEtBQUwsQ0FBVyxJQUFYLENBQWdCLElBQWhCO0FBQ0g7QUFDSixLQW5OOEI7QUFvTi9CLCtCQUEyQixtQ0FBUyxTQUFULEVBQW9CO0FBQzNDO0FBQ0E7QUFDQSxhQUFLLE9BQUwsQ0FBYSxVQUFVLElBQXZCO0FBQ0EsYUFBSyxNQUFMLENBQVksQ0FBQyxVQUFVLFFBQXZCO0FBQ0gsS0F6TjhCO0FBME4vQixZQUFRLGtCQUFXO0FBQ2Y7QUFEZSxzQkFFa0IsS0FBSyxLQUZ2QjtBQUFBLFlBRVIsU0FGUSxXQUVSLFNBRlE7QUFBQSxZQUVHLElBRkgsV0FFRyxJQUZIO0FBQUEsWUFFUyxLQUZULFdBRVMsS0FGVDs7O0FBSWYsZUFDSSwrQkFBTyxJQUFJLEtBQUssRUFBaEIsRUFBb0IsV0FBVyxXQUFXLFNBQVgsQ0FBL0IsRUFBc0QsTUFBTSxJQUE1RCxFQUFrRSxPQUFPLEVBQUMsT0FBTyxLQUFSLEVBQXpFLEdBREo7QUFHSDtBQWpPOEIsQ0FBbEIsQ0FBakI7O0FBb09BLE9BQU8sT0FBUCxHQUFpQixVQUFqQjs7O0FDeFBBOzs7Ozs7Ozs7OztBQVdBOztBQUVBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksWUFBWSxRQUFRLE9BQVIsRUFBaUIsU0FBakM7QUFDQSxJQUFJLGFBQWEsUUFBUSxZQUFSLENBQWpCOztBQUVBLElBQUksT0FBTyxRQUFRLGtCQUFSLENBQVg7QUFDQSxJQUFJLFdBQVcsUUFBUSxzQkFBUixDQUFmOztBQUVBLElBQUksa0JBQWtCLE1BQU0sV0FBTixDQUFrQjtBQUNwQyxpQkFBYSxpQkFEdUI7QUFFcEMsZUFBVztBQUNQLFlBQUksVUFBVSxNQURQO0FBRVAsbUJBQVcsVUFBVSxNQUZkO0FBR1AsbUJBQVcsVUFBVSxNQUhkO0FBSVAsaUJBQVMsVUFBVSxNQUpaO0FBS1AsbUJBQVcsVUFBVSxTQUFWLENBQW9CLENBQzNCLFVBQVUsTUFEaUIsRUFDSztBQUNoQyxrQkFBVSxNQUZpQixDQUVLO0FBRkwsU0FBcEIsQ0FMSjtBQVNQLGlCQUFTLFVBQVUsU0FBVixDQUFvQixDQUN6QixVQUFVLE1BRGUsRUFDTztBQUNoQyxrQkFBVSxNQUZlLENBRU87QUFGUCxTQUFwQixDQVRGO0FBYVAsa0JBQVUsVUFBVSxJQWJiO0FBY1Asb0JBQVksVUFBVSxJQWRmO0FBZVAsa0JBQVUsVUFBVSxJQWZiO0FBZ0JQLGNBQU0sVUFBVTtBQWhCVCxLQUZ5QjtBQW9CcEMsUUFBSSxFQXBCZ0M7QUFxQnBDO0FBQ0E7QUFDQSxrQkFBYyx3QkFBVztBQUNyQixZQUFJLE9BQU8sS0FBSyxXQUFMLENBQWlCLEtBQWpCLEVBQVgsQ0FEcUIsQ0FDdUI7QUFDNUM7QUFDQTtBQUNBLGVBQU8sU0FBUyxlQUFULENBQXlCLElBQXpCLENBQVAsQ0FKcUIsQ0FJdUI7QUFDL0MsS0E1Qm1DO0FBNkJwQyxnQkFBWSxzQkFBVztBQUNuQixZQUFJLE9BQU8sS0FBSyxTQUFMLENBQWUsS0FBZixFQUFYLENBRG1CLENBQ3lCO0FBQzVDLGVBQU8sU0FBUyxlQUFULENBQXlCLElBQXpCLENBQVAsQ0FGbUIsQ0FFeUI7QUFDL0MsS0FoQ21DO0FBaUNwQyxrQkFBYyxzQkFBUyxJQUFULEVBQWU7QUFDekI7QUFDQSxZQUFHLE9BQU8sSUFBUCxLQUFnQixRQUFoQixJQUE0QixPQUFPLEtBQUssUUFBWixLQUF5QixVQUF4RCxFQUFvRTtBQUNoRSxpQkFBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLElBQXZCO0FBQ0EsaUJBQUssYUFBTCxDQUFtQixJQUFuQjtBQUNIO0FBQ0osS0F2Q21DO0FBd0NwQyxnQkFBWSxvQkFBUyxJQUFULEVBQWU7QUFDdkI7QUFDQSxZQUFHLE9BQU8sSUFBUCxLQUFnQixRQUFoQixJQUE0QixPQUFPLEtBQUssUUFBWixLQUF5QixVQUF4RCxFQUFvRTtBQUNoRSxpQkFBSyxTQUFMLENBQWUsS0FBZixDQUFxQixJQUFyQjtBQUNBLGlCQUFLLFdBQUwsQ0FBaUIsSUFBakI7QUFDSDtBQUNKLEtBOUNtQztBQStDcEMsWUFBUSxnQkFBUyxDQUFULEVBQVk7QUFDaEIsWUFBRyxPQUFPLENBQVAsS0FBYSxXQUFoQixFQUE2QjtBQUN6QixnQkFBSSxJQUFKO0FBQ0g7QUFDRCxhQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBd0IsQ0FBeEI7QUFDQSxhQUFLLFNBQUwsQ0FBZSxNQUFmLENBQXNCLENBQXRCO0FBQ0gsS0FyRG1DO0FBc0RwQztBQUNBLGlCQUFhLHFCQUFTLElBQVQsRUFBZTtBQUN4QixhQUFLLFdBQUwsR0FBbUIsS0FBSyxVQUF4QjtBQUNILEtBekRtQztBQTBEcEMsZUFBVyxtQkFBUyxJQUFULEVBQWU7QUFDdEIsYUFBSyxTQUFMLEdBQWlCLEtBQUssVUFBdEI7QUFDSCxLQTVEbUM7QUE2RHBDLG1CQUFlLHVCQUFTLElBQVQsRUFBZTtBQUMxQixhQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLElBQW5CO0FBQ0EsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLFFBQWxCLEtBQStCLFVBQWxDLEVBQThDO0FBQzFDLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLEtBQUssWUFBTCxFQUFwQixFQUF5QyxLQUFLLFVBQUwsRUFBekM7QUFDQTtBQUNIO0FBQ0Q7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0gsS0EvRW1DO0FBZ0ZwQyxpQkFBYSxxQkFBUyxJQUFULEVBQWU7QUFDeEIsYUFBSyxXQUFMLENBQWlCLEdBQWpCLENBQXFCLElBQXJCO0FBQ0EsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLFFBQWxCLEtBQStCLFVBQWxDLEVBQThDO0FBQzFDLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLEtBQUssWUFBTCxFQUFwQixFQUF5QyxLQUFLLFVBQUwsRUFBekM7QUFDQTtBQUNIO0FBQ0osS0F0Rm1DO0FBdUZwQyxvQkFBZ0Isd0JBQVMsS0FBVCxFQUFnQjtBQUM1QjtBQUNBLFlBQUksWUFBWSxNQUFNLFNBQXRCOztBQUVBO0FBQ0EsWUFBSSxVQUFVLE1BQU0sT0FBcEI7O0FBRUE7QUFDQSxZQUFJLFdBQVcsTUFBTSxRQUFyQjtBQUNBLFlBQUcsT0FBTyxRQUFQLEtBQW9CLFdBQXZCLEVBQW9DO0FBQ2hDLHVCQUFXLEtBQVg7QUFDSDs7QUFFRCxlQUFPO0FBQ0gsdUJBQVcsU0FEUjtBQUVILHFCQUFTLE9BRk47QUFHSCxzQkFBVTtBQUhQLFNBQVA7QUFLSCxLQXpHbUM7QUEwR3BDLHFCQUFpQiwyQkFBVztBQUN4QjtBQUNBO0FBQ0EsZUFBTyxFQUFDLFdBQVcsV0FBWixFQUF5QixTQUFTLFNBQWxDLEVBQVA7QUFDSCxLQTlHbUM7QUErR3BDLHFCQUFpQiwyQkFBVztBQUN4QjtBQUNBLGVBQU8sS0FBSyxjQUFMLENBQW9CLEtBQUssS0FBekIsQ0FBUDtBQUNILEtBbEhtQztBQW1IcEMsdUJBQW1CLDZCQUFXO0FBQzFCO0FBQ0EsYUFBSyxXQUFMLENBQWlCLEdBQWpCLENBQXFCLEtBQUssU0FBTCxDQUFlLEtBQWYsRUFBckI7QUFDQSxhQUFLLFNBQUwsQ0FBZSxHQUFmLENBQW1CLEtBQUssV0FBTCxDQUFpQixLQUFqQixFQUFuQjs7QUFFQSxZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsSUFBbEIsS0FBMkIsVUFBOUIsRUFBMEM7QUFDdEMsZ0JBQUksT0FBTyxFQUFYO0FBQ0EsaUJBQUssV0FBTCxHQUFtQixLQUFLLFdBQXhCO0FBQ0EsaUJBQUssU0FBTCxHQUFpQixLQUFLLFNBQXRCO0FBQ0EsaUJBQUssS0FBTCxDQUFXLElBQVgsQ0FBZ0IsSUFBaEI7QUFDSDtBQUNKLEtBOUhtQztBQStIcEMsK0JBQTJCLG1DQUFTLFNBQVQsRUFBb0I7QUFDM0M7QUFDQSxhQUFLLFFBQUwsQ0FBYyxLQUFLLGNBQUwsQ0FBb0IsU0FBcEIsQ0FBZDtBQUNILEtBbEltQztBQW1JcEMsWUFBUSxrQkFBVztBQUNmO0FBRGUscUJBRXFDLEtBQUssS0FGMUM7QUFBQSxZQUVSLFNBRlEsVUFFUixTQUZRO0FBQUEsWUFFRyxTQUZILFVBRUcsU0FGSDtBQUFBLFlBRWMsT0FGZCxVQUVjLE9BRmQ7QUFBQSxZQUV1QixVQUZ2QixVQUV1QixVQUZ2QjtBQUFBLHFCQUd3QixLQUFLLEtBSDdCO0FBQUEsWUFHUixTQUhRLFVBR1IsU0FIUTtBQUFBLFlBR0csT0FISCxVQUdHLE9BSEg7QUFBQSxZQUdZLFFBSFosVUFHWSxRQUhaOzs7QUFLZixlQUNJO0FBQUE7QUFBQSxjQUFLLFdBQVUsa0JBQWY7QUFDSSxnQ0FBQyxHQUFELENBQUssVUFBTCxJQUFnQixXQUFXLFNBQTNCLEVBQXNDLE1BQU0sU0FBNUMsRUFBdUQsTUFBTSxTQUE3RCxFQUF3RSxNQUFNLEtBQUssV0FBbkYsRUFBZ0csVUFBVSxLQUFLLGFBQS9HO0FBQ2dCLDRCQUFZLFVBRDVCLEVBQ3dDLFVBQVUsUUFEbEQsR0FESjtBQUVtRSxlQUZuRTtBQUdJLGdDQUFDLEdBQUQsQ0FBSyxVQUFMLElBQWdCLFdBQVcsU0FBM0IsRUFBc0MsTUFBTSxPQUE1QyxFQUFxRCxNQUFNLE9BQTNELEVBQW9FLE1BQU0sS0FBSyxTQUEvRSxFQUEwRixVQUFVLEtBQUssV0FBekc7QUFDZ0IsNEJBQVksVUFENUIsRUFDd0MsVUFBVSxRQURsRDtBQUhKLFNBREo7QUFRSDtBQWhKbUMsQ0FBbEIsQ0FBdEI7O0FBbUpBLE9BQU8sT0FBUCxHQUFpQixlQUFqQjs7O0FDdktBOzs7Ozs7Ozs7OztBQVdBOztBQUVBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksWUFBWSxRQUFRLE9BQVIsRUFBaUIsU0FBakM7QUFDQSxJQUFJLGFBQWEsUUFBUSxZQUFSLENBQWpCOztBQUVBLElBQUksT0FBTyxRQUFRLGtCQUFSLENBQVg7O0FBRUEsSUFBSSxlQUFlLE1BQU0sV0FBTixDQUFrQjtBQUNqQyxpQkFBYSxjQURvQjtBQUVqQyxlQUFXO0FBQ1AsWUFBSSxVQUFVLE1BRFA7QUFFUCxtQkFBVyxVQUFVLE1BRmQ7QUFHUCxjQUFNLFVBQVUsTUFIVDtBQUlQLGFBQUssVUFBVSxNQUpSO0FBS1AsZ0JBQVEsVUFBVSxNQUxYO0FBTVAsZUFBTyxVQUFVLFNBQVYsQ0FBb0IsQ0FDdkIsVUFBVSxNQURhLEVBRXZCLFVBQVUsTUFGYSxDQUFwQixDQU5BO0FBVVAscUJBQWEsVUFBVSxNQVZoQjtBQVdQLHVCQUFlLFVBQVUsTUFYbEI7QUFZUCx3QkFBZ0IsVUFBVSxNQVpuQjtBQWFQLHNCQUFjLFVBQVUsTUFiakI7QUFjUCx1QkFBZSxVQUFVLFNBQVYsQ0FBb0IsQ0FDL0IsVUFBVSxNQURxQixFQUUvQixVQUFVLE1BRnFCLENBQXBCLENBZFI7QUFrQlAsdUJBQWUsVUFBVSxNQWxCbEI7QUFtQlAsZUFBTyxVQUFVLEtBbkJWO0FBb0JQLHdCQUFnQixVQUFVLE1BcEJuQjtBQXFCUCx1QkFBZSxVQUFVLE1BckJsQjtBQXNCUCxrQkFBVSxVQUFVLE1BdEJiO0FBdUJQLGtCQUFVLFVBQVUsSUF2QmI7QUF3QlAsa0JBQVUsVUFBVSxJQXhCYjtBQXlCUCxrQkFBVSxVQUFVLElBekJiO0FBMEJQLGlCQUFTLFVBQVUsSUExQlo7QUEyQlAsZ0JBQVEsVUFBVSxJQTNCWDtBQTRCUCxxQkFBYSxVQUFVLElBNUJoQjtBQTZCUCxxQkFBYSxVQUFVO0FBN0JoQixLQUZzQjtBQWlDakMsUUFBSSxFQWpDNkI7QUFrQ2pDLFVBQU0sZ0JBQVc7QUFDYixhQUFLLFlBQUwsQ0FBa0IsSUFBbEI7QUFDSCxLQXBDZ0M7QUFxQ2pDLFdBQU8saUJBQVc7QUFDZCxhQUFLLFlBQUwsQ0FBa0IsS0FBbEI7QUFDSCxLQXZDZ0M7QUF3Q2pDLFlBQVEsZ0JBQVMsS0FBVCxFQUFnQjtBQUNwQixhQUFLLFlBQUwsQ0FBa0IsTUFBbEIsQ0FBeUIsS0FBekI7QUFDSCxLQTFDZ0M7QUEyQ2pDLFdBQU8sZUFBUyxNQUFULEVBQWdCO0FBQ25CLGFBQUssWUFBTCxDQUFrQixLQUFsQixDQUF3QixNQUF4QjtBQUNILEtBN0NnQztBQThDakM7QUFDQTs7QUFFQTtBQUNBO0FBQ0EsY0FBVSxrQkFBUyxDQUFULEVBQVk7QUFDckI7QUFDQTtBQUNHLFlBQUksZUFBZSxLQUFLLGFBQUwsQ0FBbUIsSUFBbkIsQ0FBd0IsbUJBQXhCLENBQW5CO0FBQUEsWUFDSSxXQUFXLGFBQWEsUUFBYixDQUFzQixFQUFFLElBQXhCLENBRGY7QUFFQTtBQUNBO0FBQ0E7QUFDQTtBQUNBOztBQUVILFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxRQUFsQixLQUErQixVQUFsQyxFQUE4QztBQUN2QyxnQkFBSSxlQUFlLFFBQW5CO0FBQUEsZ0JBQ0ksZ0JBQWdCLFNBQVMsS0FBSyxLQUFMLENBQVcsY0FBcEIsQ0FEcEI7QUFFQSxpQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixDQUFwQixFQUF1QixZQUF2QixFQUFxQyxhQUFyQzs7QUFFQTtBQUNIO0FBQ0osS0FyRWdDO0FBc0VqQyxjQUFVLGtCQUFTLENBQVQsRUFBWTtBQUNyQjtBQUNBOztBQUVBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxRQUFsQixLQUErQixVQUFsQyxFQUE4QztBQUN2QyxpQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixDQUFwQjs7QUFFQTtBQUNIO0FBQ0osS0EvRWdDO0FBZ0ZqQyxhQUFTLGlCQUFTLENBQVQsRUFBWTtBQUNwQjtBQUNBOztBQUVBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxPQUFsQixLQUE4QixVQUFqQyxFQUE2QztBQUN0QyxpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixDQUFuQjs7QUFFQTtBQUNIO0FBQ0osS0F6RmdDO0FBMEZqQyxZQUFRLGdCQUFTLENBQVQsRUFBWTtBQUNuQjtBQUNBOztBQUVBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUFsQixLQUE2QixVQUFoQyxFQUE0QztBQUNyQyxpQkFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixDQUFsQjs7QUFFQTtBQUNIO0FBQ0osS0FuR2dDO0FBb0dqQyxpQkFBYSxxQkFBUyxDQUFULEVBQVk7O0FBRXJCLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxXQUFsQixLQUFrQyxXQUFyQyxFQUFrRDtBQUM5QyxpQkFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixDQUF2QjtBQUNIO0FBQ0osS0F6R2dDO0FBMEdqQyxpQkFBYSxxQkFBUyxLQUFULEVBQWdCO0FBQzVCO0FBQ0E7O0FBRUEsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLFdBQWxCLEtBQWtDLFVBQXJDLEVBQWlEO0FBQzFDLGlCQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLEtBQXZCOztBQUVBO0FBQ0g7QUFDSixLQW5IZ0M7QUFvSGpDLGdCQUFZLHNCQUFXO0FBQUEscUJBQ2lILEtBQUssS0FEdEg7QUFBQSxZQUNaLEdBRFksVUFDWixHQURZO0FBQUEsWUFDUCxNQURPLFVBQ1AsTUFETztBQUFBLFlBQ0MsS0FERCxVQUNDLEtBREQ7QUFBQSxZQUNRLGFBRFIsVUFDUSxhQURSO0FBQUEsWUFDdUIsYUFEdkIsVUFDdUIsYUFEdkI7QUFBQSxZQUNzQyxhQUR0QyxVQUNzQyxhQUR0QztBQUFBLFlBQ3FELGNBRHJELFVBQ3FELGNBRHJEO0FBQUEsWUFDcUUsY0FEckUsVUFDcUUsY0FEckU7QUFBQSxZQUNxRixhQURyRixVQUNxRixhQURyRjtBQUFBLFlBQ29HLFFBRHBHLFVBQ29HLFFBRHBHOzs7QUFHbkIsWUFBSSxVQUFVO0FBQ1YsMkJBQWUsYUFETDtBQUVWLDRCQUFnQixjQUZOO0FBR1Ysd0JBQVk7QUFIRixTQUFkOztBQU1BO0FBQ0E7QUFDQSxZQUFHLE9BQU8sR0FBUCxLQUFlLFdBQWxCLEVBQStCO0FBQzNCLGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBRSxZQUFZO0FBQzVCLCtCQUFXO0FBQ1AsOEJBQU07QUFDRixpQ0FBSyxHQURIO0FBRUYsa0NBQU0sTUFGSjtBQUdGLHNDQUFVO0FBSFI7QUFEQztBQURpQixpQkFBZCxFQUFsQjtBQVVILFNBWEQsTUFXTSxJQUFHLE9BQU8sS0FBUCxLQUFpQixXQUFwQixFQUFpQztBQUNuQyxjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsWUFBWSxLQUFkLEVBQWxCO0FBQ0g7O0FBRUQ7QUFDQSxZQUFHLE9BQU8sYUFBUCxLQUF5QixXQUE1QixFQUF5QztBQUNyQyxjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsT0FBTyxhQUFULEVBQWxCO0FBQ0g7O0FBRUQ7QUFDQSxZQUFHLE9BQU8sYUFBUCxLQUF5QixXQUE1QixFQUF5QztBQUNyQyxjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsT0FBTyxhQUFULEVBQWxCO0FBQ0g7O0FBRUQ7QUFDQSxZQUFHLE9BQU8sY0FBUCxLQUEwQixXQUE3QixFQUEwQztBQUN0QyxjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsZ0JBQWdCLGNBQWxCLEVBQWxCO0FBQ0g7O0FBRUQ7QUFDQSxZQUFHLE9BQU8sYUFBUCxLQUF5QixXQUE1QixFQUF5QztBQUNyQyxjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsZUFBZSxhQUFqQixFQUFsQjtBQUNIOztBQUVEO0FBQ0EsWUFBRyxPQUFPLFFBQVAsS0FBb0IsV0FBdkIsRUFBb0M7QUFDaEMsY0FBRSxNQUFGLENBQVMsT0FBVCxFQUFrQixFQUFFLFVBQVUsUUFBWixFQUFsQjtBQUNIOztBQUVELGVBQU8sT0FBUDtBQUNILEtBeEtnQztBQXlLakMscUJBQWlCLDJCQUFXO0FBQzlCO0FBQ0E7QUFDQSxlQUFPLEVBQUMsT0FBTyxNQUFSLEVBQWdCLGVBQWUsTUFBL0IsRUFBdUMsZ0JBQWdCLE9BQXZELEVBQWdFLGVBQWUsQ0FBL0UsRUFBUDtBQUNBLEtBN0ttQztBQThLakMsd0JBQW9CLDhCQUFXO0FBQzNCO0FBQ0EsWUFBSSxLQUFLLEtBQUssS0FBTCxDQUFXLEVBQXBCO0FBQ0EsWUFBRyxPQUFPLEVBQVAsS0FBYyxXQUFqQixFQUE4QjtBQUMxQixpQkFBSyxLQUFLLE9BQUwsRUFBTDtBQUNIOztBQUVELGFBQUssRUFBTCxHQUFVLEVBQVY7QUFDSCxLQXRMZ0M7QUF1TGpDLHVCQUFtQiw2QkFBVztBQUMxQjtBQUNILGFBQUssYUFBTCxHQUFxQixFQUFFLE1BQUksS0FBSyxFQUFYLENBQXJCO0FBQ0csYUFBSyxZQUFMLEdBQW9CLEtBQUssYUFBTCxDQUFtQixpQkFBbkIsQ0FBcUMsS0FBSyxVQUFMLEVBQXJDLEVBQXdELElBQXhELENBQTZELG1CQUE3RCxDQUFwQjs7QUFFQTtBQUNBLGFBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixRQUF2QixFQUFpQyxLQUFLLFFBQXRDO0FBQ0EsYUFBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLFFBQXZCLEVBQWlDLEtBQUssUUFBdEM7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsTUFBdkIsRUFBK0IsS0FBSyxNQUFwQztBQUNBLGFBQUssWUFBTCxDQUFrQixJQUFsQixDQUF1QixPQUF2QixFQUFnQyxLQUFLLE9BQXJDO0FBQ0EsYUFBSyxZQUFMLENBQWtCLElBQWxCLENBQXVCLFdBQXZCLEVBQW9DLEtBQUssV0FBekM7QUFDQSxhQUFLLFlBQUwsQ0FBa0IsSUFBbEIsQ0FBdUIsV0FBdkIsRUFBb0MsS0FBSyxXQUF6Qzs7QUFFQTtBQUNBOzs7Ozs7OztBQVFBOzs7Ozs7OztBQVFILEtBck5nQztBQXNOakMsK0JBQTJCLG1DQUFTLFNBQVQsRUFBb0I7QUFDM0M7QUFDQSxZQUFHLE9BQU8sVUFBVSxhQUFqQixLQUFtQyxXQUF0QyxFQUFtRDtBQUMvQyxpQkFBSyxZQUFMLENBQWtCLEtBQWxCLENBQXdCLFVBQVUsYUFBbEM7QUFDSDtBQUNKLEtBM05nQztBQTROakMsWUFBUSxrQkFBVztBQUNmO0FBRGUsc0JBRWtCLEtBQUssS0FGdkI7QUFBQSxZQUVSLFNBRlEsV0FFUixTQUZRO0FBQUEsWUFFRyxJQUZILFdBRUcsSUFGSDtBQUFBLFlBRVMsS0FGVCxXQUVTLEtBRlQ7OztBQUlmLGVBQ0MsK0JBQU8sSUFBSSxLQUFLLEVBQWhCLEVBQW9CLE1BQU0sSUFBMUIsRUFBZ0MsT0FBTyxFQUFDLE9BQU8sS0FBUixFQUF2QyxHQUREO0FBR0g7QUFuT2dDLENBQWxCLENBQW5COztBQXNPQSxPQUFPLE9BQVAsR0FBaUIsWUFBakI7OztBQ3pQQTs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLFFBQVEsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJLFlBQVksUUFBUSxPQUFSLEVBQWlCLFNBQWpDO0FBQ0EsSUFBSSxhQUFhLFFBQVEsWUFBUixDQUFqQjs7QUFFQSxJQUFJLE9BQU8sUUFBUSxrQkFBUixDQUFYOztBQUVBLElBQUksT0FBTyxNQUFNLFdBQU4sQ0FBa0I7QUFDekIsaUJBQWEsTUFEWTtBQUV6QixlQUFXO0FBQ1AsWUFBSSxVQUFVLE1BRFA7QUFFUCxtQkFBVyxVQUFVLE1BRmQ7QUFHUCxjQUFNLFVBQVUsTUFIVCxFQUdpQjtBQUN4QixhQUFLLFVBQVUsTUFKUjtBQUtQLGdCQUFRLFVBQVUsTUFMWDtBQU1QLHVCQUFlLFVBQVUsTUFObEI7QUFPUCxjQUFNLFVBQVUsTUFQVDtBQVFQLGlCQUFTLFVBQVUsS0FSWjtBQVNQLHFCQUFhLFVBQVUsS0FUaEI7QUFVUCxtQkFBVyxVQUFVLE1BVmQ7QUFXUCxvQkFBWSxVQUFVLE1BWGY7QUFZUCxvQkFBWSxVQUFVLE1BWmY7QUFhUCxxQkFBYSxVQUFVLElBYmhCO0FBY1Asa0JBQVUsVUFBVSxJQWRiO0FBZVAsbUJBQVcsVUFBVSxJQWZkO0FBZ0JQLG9CQUFZLFVBQVUsU0FBVixDQUFvQixDQUM1QixVQUFVLElBRGtCLEVBRTVCLFVBQVUsTUFGa0IsQ0FBcEIsQ0FoQkw7QUFvQlAsa0JBQVUsVUFBVSxJQXBCYjtBQXFCUCxrQkFBVSxVQUFVLFNBQVYsQ0FBb0IsQ0FDMUIsVUFBVSxJQURnQixFQUUxQixVQUFVLE1BRmdCLENBQXBCLENBckJIO0FBeUJQLGtCQUFVLFVBQVUsTUF6QmI7QUEwQlAsZ0JBQVEsVUFBVSxTQUFWLENBQW9CLENBQ3hCLFVBQVUsTUFEYyxFQUV4QixVQUFVLE1BRmMsQ0FBcEIsQ0ExQkQ7O0FBK0JQOzs7Ozs7O0FBT0Esb0JBQVksVUFBVSxLQUFWLENBQWdCLENBQUMsS0FBRCxFQUFPLE1BQVAsQ0FBaEIsQ0F0Q0wsRUFzQ3NDO0FBQzdDLGtCQUFVLFVBQVUsSUF2Q2IsRUF1Q3FCO0FBQzVCOzs7Ozs7Ozs7OztBQVdBLDJCQUFtQixVQUFVLE1BbkR0QixFQW1EK0I7QUFDdEMsb0JBQVksVUFBVSxJQXBEZixDQW9Eb0I7QUFwRHBCLEtBRmM7QUF3RHpCLFFBQUksRUF4RHFCO0FBeUR6QixXQUFPLFNBekRrQjtBQTBEekIsZ0JBQVksRUExRGE7QUEyRHpCLGtCQUFjLEVBM0RXO0FBNER6Qjs7Ozs7OztBQU9BLGNBQVUsb0JBQVc7QUFDakIsWUFBSSxPQUFPLEtBQUssSUFBaEI7QUFDQSxZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsUUFBbEIsS0FBK0IsVUFBbEMsRUFBOEM7QUFDMUM7QUFDQSxnQkFBSSxVQUFVLEVBQWQ7QUFDQSxnQkFBRyxLQUFLLEtBQUwsQ0FBVyxVQUFYLEtBQTBCLE1BQTdCLEVBQW9DO0FBQ2hDLG9CQUFJLE1BQU0sRUFBRSxLQUFLLE1BQUwsRUFBRixFQUFpQixPQUFqQixDQUF5QixJQUF6QixDQUFWO0FBQ0Esb0JBQUksT0FBTyxLQUFLLE1BQUwsRUFBWDtBQUNBLG9CQUFJLFdBQVcsRUFBRSxJQUFGLEVBQVEsSUFBUixFQUFmO0FBQ0Esd0JBQVEsUUFBUixHQUFtQixFQUFFLElBQUYsRUFBUSxLQUFLLEtBQWIsRUFBb0IsS0FBcEIsQ0FBMEIsR0FBMUIsQ0FBbkI7QUFDQSx3QkFBUSxTQUFSLEdBQW9CLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBcEI7QUFDQSx3QkFBUSxJQUFSLEdBQWUsRUFBRSxJQUFGLEVBQVEsSUFBUixFQUFmO0FBQ0gsYUFQRCxNQU9LO0FBQ0Qsb0JBQUksT0FBTyxLQUFLLE1BQUwsRUFBWDs7QUFFQSxvQkFBRyxLQUFLLE1BQUwsR0FBYyxDQUFqQixFQUFtQjtBQUFBO0FBQ2YsNEJBQUksV0FBVyxFQUFmO0FBQ0EsNkJBQUssSUFBTCxDQUFVLFlBQVk7QUFDbEIscUNBQVMsSUFBVCxDQUFjLEtBQUssUUFBTCxDQUFjLEVBQUUsSUFBRixDQUFkLENBQWQ7QUFDSCx5QkFGRDtBQUdBLGdDQUFRLElBQVIsR0FBZSxJQUFmO0FBQ0EsZ0NBQVEsSUFBUixHQUFlLFFBQWY7QUFOZTtBQU9sQixpQkFQRCxNQU9LO0FBQ0QsNEJBQVEsSUFBUixHQUFlLElBQWY7QUFDQSw0QkFBUSxJQUFSLEdBQWUsS0FBSyxRQUFMLENBQWMsSUFBZCxDQUFmO0FBQ0g7QUFDSjtBQUNELGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLE9BQXBCO0FBQ0g7QUFDSixLQWhHd0I7O0FBa0d6QixvQkFBZ0Isd0JBQVMsS0FBVCxFQUFnQjtBQUFBLFlBQ3JCLFVBRHFCLEdBQ00sS0FETixDQUNyQixVQURxQjtBQUFBLFlBQ1QsV0FEUyxHQUNNLEtBRE4sQ0FDVCxXQURTOzs7QUFHNUIsWUFBRyxnQkFBZ0IsSUFBaEIsSUFBd0IsT0FBTyxXQUFQLEtBQXVCLFdBQS9DLElBQThELFlBQVksTUFBWixHQUFxQixDQUF0RixFQUF5RjtBQUNyRixnQkFBSSxPQUFPLEtBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsSUFBaEIsQ0FBcUIsSUFBckIsRUFBMkIsSUFBM0IsQ0FBZ0MsZ0JBQWhDLEVBQWtELE9BQWxELENBQTBELElBQTFELENBQVg7QUFBQSxnQkFDSSxRQUFRLElBRFo7O0FBR0EsaUJBQUssSUFBTCxDQUFVLFVBQVMsS0FBVCxFQUFnQixHQUFoQixFQUFxQjtBQUMzQixvQkFBSSxZQUFZLEVBQUUsR0FBRixFQUFPLElBQVAsQ0FBWSx5QkFBWixDQUFoQjtBQUFBLG9CQUNJLFdBQVcsTUFBTSxJQUFOLENBQVcsUUFBWCxDQUFvQixHQUFwQixDQURmO0FBQUEsb0JBRUksVUFBVSxLQUZkOztBQUlBLHFCQUFJLElBQUksSUFBRSxDQUFWLEVBQWEsSUFBRSxZQUFZLE1BQTNCLEVBQW1DLEdBQW5DLEVBQXdDOztBQUVwQyx3QkFBRyxlQUFlLElBQWYsSUFBdUIsT0FBTyxVQUFQLEtBQXNCLFdBQWhELEVBQTZEO0FBQ3pELDRCQUFHLFNBQVMsVUFBVCxLQUF3QixZQUFZLENBQVosQ0FBM0IsRUFBMkM7QUFDdkMsc0NBQVUsSUFBVjtBQUNBO0FBQ0g7QUFFSixxQkFORCxNQU1NO0FBQ0YsNEJBQUcsVUFBVSxHQUFWLE1BQW1CLFlBQVksQ0FBWixDQUF0QixFQUFzQztBQUNsQyxzQ0FBVSxJQUFWO0FBQ0E7QUFDSDtBQUNKO0FBQ0o7O0FBRUQsMEJBQVUsSUFBVixDQUFlLFNBQWYsRUFBMEIsT0FBMUI7QUFDQSxzQkFBTSxjQUFOLENBQXFCLFNBQXJCLEVBQWdDLE9BQWhDLEVBQXlDLEVBQUUsR0FBRixDQUF6QztBQUNILGFBdkJEO0FBd0JIO0FBRUosS0FuSXdCO0FBb0l6QixpQkFBYSxxQkFBUyxLQUFULEVBQWdCOztBQUV6QixZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsV0FBbEIsS0FBa0MsVUFBckMsRUFBaUQ7QUFDN0MsZ0JBQUksTUFBTSxFQUFWO0FBQUEsZ0JBQWMsUUFBUSxFQUF0QjtBQUNBLGlCQUFJLElBQUksR0FBUixJQUFlLEtBQUssVUFBcEIsRUFBZ0M7QUFDNUIsb0JBQUcsS0FBSyxVQUFMLENBQWdCLEdBQWhCLENBQUgsRUFBeUI7QUFDckIsd0JBQUksSUFBSixDQUFTLEdBQVQ7QUFDQSwwQkFBTSxJQUFOLENBQVcsS0FBSyxZQUFMLENBQWtCLEdBQWxCLENBQVg7QUFDSDtBQUNKOztBQUVELGlCQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLEtBQXZCLEVBQThCLEdBQTlCLEVBQW1DLEtBQW5DO0FBQ0g7QUFDSixLQWpKd0I7QUFrSnpCLHNCQUFrQiwwQkFBUyxLQUFULEVBQWdCO0FBQzlCLFlBQUksVUFBVSxFQUFFLE1BQU0sTUFBUixFQUFnQixFQUFoQixDQUFtQixVQUFuQixDQUFkOztBQUVBLFlBQUksT0FBTyxLQUFLLElBQUwsQ0FBVSxLQUFWLENBQWdCLElBQWhCLENBQXFCLElBQXJCLEVBQTJCLElBQTNCLENBQWdDLGdCQUFoQyxFQUFrRCxPQUFsRCxDQUEwRCxJQUExRCxDQUFYO0FBQUEsWUFDSSxRQUFRLElBRFo7O0FBR0EsYUFBSyxJQUFMLENBQVUsVUFBUyxLQUFULEVBQWdCLEdBQWhCLEVBQXFCO0FBQzNCLGdCQUFJLFlBQVksRUFBRSxHQUFGLEVBQU8sSUFBUCxDQUFZLHlCQUFaLENBQWhCO0FBQ0Esc0JBQVUsSUFBVixDQUFlLFNBQWYsRUFBMEIsT0FBMUI7O0FBRUEsa0JBQU0sY0FBTixDQUFxQixTQUFyQixFQUFnQyxPQUFoQyxFQUF5QyxFQUFFLEdBQUYsQ0FBekM7QUFDSCxTQUxEOztBQU9BLGFBQUssV0FBTCxDQUFpQixLQUFqQjtBQUNILEtBaEt3QjtBQWlLekIsbUJBQWUsdUJBQVMsS0FBVCxFQUFnQjtBQUMzQixZQUFJLFVBQVUsTUFBTSxNQUFOLENBQWEsT0FBM0I7QUFBQSxZQUNJLE9BQU8sRUFBRSxNQUFNLE1BQVIsRUFBZ0IsT0FBaEIsQ0FBd0IsSUFBeEIsQ0FEWDs7QUFHQSxhQUFLLGNBQUwsQ0FBb0IsRUFBRSxNQUFNLE1BQVIsQ0FBcEIsRUFBcUMsT0FBckMsRUFBOEMsSUFBOUM7QUFDQSxhQUFLLFdBQUwsQ0FBaUIsS0FBakI7QUFDSCxLQXZLd0I7QUF3S3pCLG9CQUFnQix3QkFBUyxTQUFULEVBQW9CLE9BQXBCLEVBQTZCLElBQTdCLEVBQW1DOztBQUUvQyxZQUFJLFdBQVcsS0FBSyxJQUFMLENBQVUsUUFBVixDQUFtQixJQUFuQixDQUFmOztBQUVBLFlBQUcsS0FBSyxLQUFMLENBQVcsVUFBWCxLQUEwQixJQUExQixJQUFrQyxPQUFPLEtBQUssS0FBTCxDQUFXLFVBQWxCLEtBQWlDLFdBQXRFLEVBQW1GO0FBQy9FLGlCQUFLLFVBQUwsQ0FBZ0IsU0FBUyxLQUFLLEtBQUwsQ0FBVyxVQUFwQixDQUFoQixJQUFtRCxPQUFuRDtBQUNBLGlCQUFLLFlBQUwsQ0FBa0IsU0FBUyxLQUFLLEtBQUwsQ0FBVyxVQUFwQixDQUFsQixJQUFxRCxRQUFyRDtBQUNILFNBSEQsTUFHTTtBQUNGLGlCQUFLLFVBQUwsQ0FBZ0IsVUFBVSxHQUFWLEVBQWhCLElBQW1DLE9BQW5DO0FBQ0EsaUJBQUssWUFBTCxDQUFrQixVQUFVLEdBQVYsRUFBbEIsSUFBcUMsUUFBckM7QUFDSDs7QUFFRCxZQUFHLE9BQUgsRUFBWTtBQUNSO0FBQ0EsaUJBQUssUUFBTCxDQUFjLGtCQUFkO0FBQ0gsU0FIRCxNQUdNO0FBQ0Y7QUFDQSxpQkFBSyxXQUFMLENBQWlCLGtCQUFqQjtBQUNIO0FBQ0osS0EzTHdCO0FBNEx6Qix1QkFBbUIsMkJBQVMsYUFBVCxFQUF3QjtBQUN2QyxlQUFPO0FBQ0gsbUJBQU8sYUFESjtBQUVILDRCQUFnQiw0Q0FGYjtBQUdIO0FBQ0EsOEJBQWtCO0FBQ2QseUJBQVMsbUJBREs7QUFFZCx1QkFBTztBQUZPLGFBSmY7QUFRSCxzQkFBVSxzREFBc0QsYUFBdEQsR0FBc0UsT0FSN0U7QUFTSCx3QkFBWTtBQUNSLHVCQUFPO0FBREMsYUFUVDtBQVlILG1CQUFPLEVBWko7QUFhSCxzQkFBVTtBQWJQLFNBQVA7QUFlSCxLQTVNd0I7QUE2TXpCLGlCQUFhLHFCQUFTLEdBQVQsRUFBYztBQUN2QjtBQUNBLGFBQUssY0FBTCxDQUFvQixLQUFLLEtBQXpCO0FBQ0gsS0FoTndCO0FBaU56QixtQkFBZSx1QkFBUyxLQUFULEVBQWdCO0FBQUEsWUFDcEIsSUFEb0IsR0FDcUUsS0FEckUsQ0FDcEIsSUFEb0I7QUFBQSxZQUNkLEdBRGMsR0FDcUUsS0FEckUsQ0FDZCxHQURjO0FBQUEsWUFDVCxNQURTLEdBQ3FFLEtBRHJFLENBQ1QsTUFEUztBQUFBLFlBQ0QsSUFEQyxHQUNxRSxLQURyRSxDQUNELElBREM7QUFBQSxZQUNLLFNBREwsR0FDcUUsS0FEckUsQ0FDSyxTQURMO0FBQUEsWUFDZ0IsVUFEaEIsR0FDcUUsS0FEckUsQ0FDZ0IsVUFEaEI7QUFBQSxZQUM0QixRQUQ1QixHQUNxRSxLQURyRSxDQUM0QixRQUQ1QjtBQUFBLFlBQ3NDLFFBRHRDLEdBQ3FFLEtBRHJFLENBQ3NDLFFBRHRDO0FBQUEsWUFDZ0QsaUJBRGhELEdBQ3FFLEtBRHJFLENBQ2dELGlCQURoRDs7QUFHM0I7O0FBQ0EsWUFBSSxZQUFZLENBQWhCO0FBQUEsWUFBbUIsWUFBWSxLQUEvQjtBQUNBLFlBQUcsUUFBSCxFQUFhO0FBQ1Qsd0JBQVksUUFBWjtBQUNBLHdCQUFZLElBQVo7QUFDSDs7QUFFRDtBQUNBO0FBQ0EsWUFBSSxhQUFhLElBQUksTUFBTSxJQUFOLENBQVcsVUFBZixDQUEwQjtBQUN2Qyx1QkFBVztBQUNQOzs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7Ozs7QUF5QkEsc0JBQU07QUFDRix5QkFBTSxRQUFRLFNBQVMsSUFBakIsSUFBeUIsS0FBSyxNQUFMLEdBQWMsQ0FBeEMsR0FBNkMsT0FBTyxHQUFwRCxHQUEwRCxHQUQ3RDtBQUVGLDBCQUFNLE1BRko7QUFHRiw4QkFBVSxNQUhSO0FBSUYsMEJBQU0sSUFKSixFQUllO0FBQ2pCLGlDQUFhO0FBTFgsaUJBMUJDO0FBaUNQLDhCQUFjLHNCQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCO0FBQy9CLHdCQUFHLFFBQVEsTUFBUixJQUFrQixzQkFBc0IsSUFBM0MsRUFBZ0Q7QUFDL0M7QUFDRyw2QkFBSSxJQUFJLElBQVIsSUFBZ0IsaUJBQWhCLEVBQWtDO0FBQzlCLGdDQUFHLE9BQU8sa0JBQWtCLElBQWxCLENBQVAsS0FBbUMsUUFBbkMsSUFBaUQsUUFBUSxJQUE1RCxFQUFtRTtBQUMvRCxxQ0FBSyxrQkFBa0IsSUFBbEIsQ0FBTCxJQUFnQyxLQUFLLElBQUwsQ0FBaEM7QUFDSDtBQUNKO0FBQ0Q7QUFDQSw0QkFBRyxrQkFBa0IsYUFBbEIsSUFBbUMsS0FBSyxNQUF4QyxJQUFrRCxLQUFLLE1BQUwsQ0FBWSxPQUFqRSxFQUF5RTtBQUNyRSxnQ0FBSSxVQUFVLEtBQUssTUFBTCxDQUFZLE9BQTFCO0FBQ0Esb0NBQVEsR0FBUixDQUFZLFVBQUMsTUFBRCxFQUFZO0FBQ3BCLG9DQUFJLFFBQVMsa0JBQWtCLFlBQW5CLEdBQW1DLGtCQUFrQixZQUFsQixHQUFpQyxPQUFPLEtBQTNFLEdBQW1GLE9BQU8sS0FBdEc7QUFDQSxvQ0FBRyxrQkFBa0Isc0JBQXJCLEVBQTRDO0FBQ3hDLHlDQUFLLE1BQU0sV0FBTixFQUFMLElBQTRCLE9BQU8sS0FBbkM7QUFDSCxpQ0FGRCxNQUVLO0FBQ0QseUNBQUssS0FBTCxJQUFjLE9BQU8sS0FBckI7QUFDSDtBQUNKLDZCQVBEO0FBUUg7QUFDRDtBQUNBLDRCQUFHLGtCQUFrQixXQUFsQixJQUFpQyxLQUFLLElBQXpDLEVBQThDO0FBQzFDLGlDQUFLLElBQUwsQ0FBVSxHQUFWLENBQWMsVUFBQyxRQUFELEVBQWE7QUFDdkIsb0NBQUcsV0FBVyxpQkFBZCxFQUFnQztBQUM1Qiw2Q0FBUyxrQkFBa0IsS0FBM0IsSUFBb0MsU0FBUyxLQUE3QztBQUNIO0FBQ0Qsb0NBQUcsU0FBUyxpQkFBWixFQUE4QjtBQUMxQiw2Q0FBUyxrQkFBa0IsR0FBM0IsSUFBa0MsU0FBUyxHQUEzQztBQUNIO0FBQ0osNkJBUEQ7QUFRSDtBQUNKOztBQUVEO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsMkJBQU8sS0FBSyxTQUFMLENBQWUsSUFBZixDQUFQO0FBQ0g7QUF2RU0sYUFENEI7QUEwRXZDLG9CQUFRO0FBQ0o7QUFDQSxzQkFBTSxjQUFTLFFBQVQsRUFBbUI7QUFDckI7QUFDQSx3QkFBSSxNQUFNLEVBQVY7QUFBQSx3QkFBYyxXQUFXLFFBQXpCOztBQUVBLHdCQUFHLGFBQWEsVUFBVSxNQUFWLEdBQW1CLENBQWhDLElBQXFDLGFBQWEsTUFBckQsRUFBNkQ7QUFDekQsOEJBQU0sVUFBVSxLQUFWLENBQWdCLEdBQWhCLENBQU47QUFDSDtBQUNELHlCQUFJLElBQUksQ0FBUixJQUFhLEdBQWIsRUFBa0I7QUFDZDtBQUNBLDRCQUFHLENBQUMsUUFBSixFQUFjO0FBQ1YsdUNBQVcsRUFBWDtBQUNBO0FBQ0g7QUFDRCxtQ0FBVyxTQUFTLElBQUksQ0FBSixDQUFULENBQVg7QUFDSDtBQUNELDJCQUFPLFFBQVA7QUFDSCxpQkFsQkc7QUFtQko7QUFDQSx1QkFBTyxlQUFTLFFBQVQsRUFBbUI7QUFDdEI7QUFDQSx3QkFBSSxNQUFNLEVBQVY7QUFBQSx3QkFBYyxRQUFRLFFBQXRCO0FBQ0Esd0JBQUcsY0FBYyxXQUFXLE1BQVgsR0FBb0IsQ0FBbEMsSUFBdUMsY0FBYyxNQUF4RCxFQUFnRTtBQUM1RCw4QkFBTSxXQUFXLEtBQVgsQ0FBaUIsR0FBakIsQ0FBTjtBQUNIO0FBQ0QseUJBQUksSUFBSSxDQUFSLElBQWEsR0FBYixFQUFrQjtBQUNkO0FBQ0EsNEJBQUcsQ0FBQyxLQUFKLEVBQVc7QUFDUCxvQ0FBUSxDQUFSO0FBQ0E7QUFDSDtBQUNELGdDQUFRLE1BQU0sSUFBSSxDQUFKLENBQU4sQ0FBUjtBQUNIO0FBQ0QsMkJBQU8sS0FBUDtBQUNIO0FBbkNHLGFBMUUrQjtBQStHdkMsc0JBQVUsU0EvRzZCO0FBZ0h2QywwQkFBYyxTQWhIeUI7QUFpSHZDLDZCQUFpQixTQWpIc0I7QUFrSHZDLDJCQUFlO0FBbEh3QixTQUExQixDQUFqQjs7QUFxSEEsZUFBTyxVQUFQO0FBQ0gsS0FuVndCO0FBb1Z6QixnQkFBWSxvQkFBUyxLQUFULEVBQWdCO0FBQUEsWUFDakIsU0FEaUIsR0FDcUYsS0FEckYsQ0FDakIsU0FEaUI7QUFBQSxZQUNOLFVBRE0sR0FDcUYsS0FEckYsQ0FDTixVQURNO0FBQUEsWUFDTSxRQUROLEdBQ3FGLEtBRHJGLENBQ00sUUFETjtBQUFBLFlBQ2dCLFFBRGhCLEdBQ3FGLEtBRHJGLENBQ2dCLFFBRGhCO0FBQUEsWUFDMEIsTUFEMUIsR0FDcUYsS0FEckYsQ0FDMEIsTUFEMUI7QUFBQSxZQUNrQyxhQURsQyxHQUNxRixLQURyRixDQUNrQyxhQURsQztBQUFBLFlBQ2lELFVBRGpELEdBQ3FGLEtBRHJGLENBQ2lELFVBRGpEO0FBQUEsWUFDNkQsUUFEN0QsR0FDcUYsS0FEckYsQ0FDNkQsUUFEN0Q7QUFBQSxZQUN1RSxVQUR2RSxHQUNxRixLQURyRixDQUN1RSxVQUR2RTs7O0FBR3hCLFlBQUksYUFBYSxLQUFLLGFBQUwsQ0FBbUIsS0FBbkIsQ0FBakI7O0FBRUEsWUFBSSxVQUFVLE1BQU0sT0FBcEI7QUFDQSxZQUFHLE9BQU8sYUFBUCxLQUF5QixXQUE1QixFQUF5QztBQUNyQyxnQkFBSSxJQUFJLElBQVI7QUFDQSxpQkFBSSxJQUFJLENBQVIsSUFBYSxPQUFiLEVBQXNCO0FBQ2xCLG9CQUFHLGlCQUFpQixRQUFRLENBQVIsRUFBVyxLQUEvQixFQUFzQztBQUNsQyx3QkFBSSxLQUFKO0FBQ0E7QUFDSDtBQUNKO0FBQ0QsZ0JBQUcsTUFBTSxJQUFULEVBQWU7QUFDWCx3QkFBUSxPQUFSLENBQWdCLEtBQUssaUJBQUwsQ0FBdUIsYUFBdkIsQ0FBaEI7QUFDSDtBQUNKOztBQUVELFlBQUksTUFBSjtBQUNBLFlBQUcsT0FBTyxVQUFQLEtBQXNCLFNBQXRCLElBQW1DLGVBQWUsSUFBckQsRUFBMkQ7QUFDdkQscUJBQVM7QUFDTCx1QkFBTyxLQURGO0FBRUwsMkJBQVc7QUFDUCw0QkFBUTtBQUNKLGtDQUFVO0FBRE4scUJBREQ7QUFJUCw0QkFBUTtBQUNKLDRCQUFJLElBREEsQ0FDSTs7Ozs7O0FBREoscUJBSkQ7QUFZUCwwQkFBTTtBQUNGLDRCQUFJLElBREYsQ0FDTTs7Ozs7O0FBRE4scUJBWkM7QUFvQlAsMkJBQU87QUFDSCxrQ0FBVTtBQURQO0FBcEJBLGlCQUZOO0FBMEJMLG9CQUFJLFlBQVMsT0FBVCxFQUFrQjtBQUNsQix3QkFBSSxVQUFVLFFBQVEsTUFBUixFQUFkO0FBQ0EsMkJBQU0sUUFBUSxRQUFSLEdBQW1CLE1BQW5CLEdBQTRCLENBQWxDO0FBQ0ksMEJBQUUsUUFBUSxRQUFSLEdBQW1CLENBQW5CLENBQUYsRUFBeUIsTUFBekI7QUFESixxQkFHQSxRQUFRLE9BQVIsQ0FBZ0IsMEVBQWhCO0FBQ0EsNEJBQVEsSUFBUixDQUFhLGtDQUFiLEVBQWlELElBQWpELENBQXNELElBQXREO0FBQ0EsNEJBQVEsSUFBUixDQUFhLHVCQUFiLEVBQXNDLElBQXRDLENBQTJDLEtBQTNDO0FBQ0g7QUFsQ0ksYUFBVDtBQW9DSCxTQXJDRCxNQXFDTTtBQUNGLHFCQUFTLFVBQVQ7QUFDSDs7QUFFRCxZQUFJLFNBQUo7QUFDQSxZQUFHLE9BQU8sUUFBUCxLQUFvQixTQUFwQixJQUFpQyxhQUFhLElBQWpELEVBQXVEO0FBQ25ELHdCQUFZO0FBQ1IsNkJBQWEsQ0FETDtBQUVSLDJCQUFXLENBQUMsRUFBRCxFQUFLLEVBQUwsRUFBUyxFQUFULEVBQWEsRUFBYixFQUFpQixHQUFqQixDQUZIO0FBR1IsMEJBQVU7QUFDTiw2QkFBUyxXQUFXLElBQVgsQ0FBZ0IsVUFEbkIsRUFDOEI7QUFDcEMsMkJBQU8sRUFGRDtBQUdOO0FBQ0Esa0NBQWMsV0FBVyxJQUFYLENBQWdCO0FBSnhCO0FBSEYsYUFBWjtBQVVILFNBWEQsTUFXTTtBQUNGLHdCQUFZLFFBQVo7QUFDSDs7QUFFRCxZQUFJLFVBQVU7QUFDVjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0Esd0JBQVksVUFsQkY7QUFtQlYscUJBQVMsT0FuQkM7QUFvQlYsdUJBQVc7QUFDUCwwQkFBVSxXQUFXLElBQVgsQ0FBZ0I7QUFEbkIsYUFwQkQ7QUF1QlYsb0JBQVEsTUF2QkU7QUF3QlYsdUJBQVcsS0FBSyxXQXhCTjtBQXlCVix1QkFBVyxTQXpCRDtBQTBCVix3QkFBWSxNQTFCRjtBQTJCVixzQkFBVSxRQTNCQTtBQTRCVix3QkFBWSxVQTVCRjtBQTZCVixzQkFBVSxTQTdCQTtBQThCVix3QkFBYSxRQUFELEdBQWEsZUFBZSxVQUE1QixHQUF5QztBQTlCM0MsU0FBZDs7QUFpQ0EsWUFBRyxPQUFPLE1BQVAsS0FBa0IsUUFBbEIsSUFBOEIsT0FBTyxNQUFQLEtBQWtCLFFBQW5ELEVBQTZEO0FBQ3pELGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBQyxRQUFRLE1BQVQsRUFBbEI7QUFDSDs7QUFFRDs7Ozs7QUFLQSxlQUFPLE9BQVA7QUFDSCxLQTVjd0I7QUE2YzVCLHFCQUFpQiwyQkFBVztBQUMzQjtBQUNBO0FBQ00sZUFBTyxFQUFDLFFBQVEsTUFBVCxFQUFpQixXQUFXLGtCQUE1QixFQUFnRCxZQUFZLHdCQUE1RCxFQUFzRixXQUFXLElBQWpHLEVBQXVHLFlBQVksS0FBbkgsRUFBMEgsVUFBVSxJQUFwSSxFQUEwSSxVQUFVLElBQXBKLEVBQTBKLFVBQVUsRUFBcEssRUFBd0ssWUFBWSxJQUFwTCxFQUEwTCxVQUFVLEtBQXBNLEVBQTJNLG1CQUFtQixJQUE5TixFQUFvTyxZQUFZLEtBQWhQLEVBQVA7QUFDTixLQWpkMkI7QUFrZHpCLHdCQUFvQiw4QkFBVztBQUMzQjtBQUNBLFlBQUksS0FBSyxLQUFLLEtBQUwsQ0FBVyxFQUFwQjtBQUNBLFlBQUcsT0FBTyxFQUFQLEtBQWMsV0FBakIsRUFBOEI7QUFDMUIsaUJBQUssS0FBSyxPQUFMLEVBQUw7QUFDSDs7QUFFRCxhQUFLLEVBQUwsR0FBVSxFQUFWO0FBQ0gsS0ExZHdCO0FBMmR6Qix1QkFBbUIsNkJBQVc7QUFDMUI7QUFDQSxhQUFLLEtBQUwsR0FBYSxFQUFFLE1BQUksS0FBSyxFQUFYLENBQWI7O0FBRUE7QUFDQSxhQUFLLElBQUwsR0FBWSxLQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLEtBQUssVUFBTCxDQUFnQixLQUFLLEtBQXJCLENBQXJCLEVBQWtELElBQWxELENBQXVELFdBQXZELENBQVo7O0FBRUE7Ozs7Ozs7QUFPQTtBQUNBO0FBQ0E7QUFDQSxhQUFLLElBQUwsQ0FBVSxJQUFWLENBQWUsUUFBZixFQUF5QixLQUFLLFFBQTlCOztBQUVBLGFBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsRUFBaEIsQ0FBbUIsT0FBbkIsRUFBNEIsV0FBNUIsRUFBMEMsS0FBSyxhQUEvQyxFQW5CMEIsQ0FtQjZDO0FBQ3ZFLGFBQUssSUFBTCxDQUFVLEtBQVYsQ0FBZ0IsRUFBaEIsQ0FBbUIsT0FBbkIsRUFBNEIsV0FBNUIsRUFBMEMsS0FBSyxnQkFBL0MsRUFwQjBCLENBb0I2Qzs7QUFFdkUsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLElBQWxCLEtBQTJCLFVBQTlCLEVBQTBDO0FBQ3RDLGdCQUFJLE9BQU8sRUFBWDtBQUNBLGlCQUFLLEtBQUwsR0FBYSxLQUFLLEtBQWxCO0FBQ0EsaUJBQUssSUFBTCxHQUFZLEtBQUssSUFBakI7QUFDQSxpQkFBSyxLQUFMLENBQVcsSUFBWCxDQUFnQixJQUFoQjtBQUNIO0FBQ0osS0F2ZndCO0FBd2Z6QiwrQkFBMkIsbUNBQVMsU0FBVCxFQUFvQjtBQUMzQztBQUNBOzs7Ozs7Ozs7Ozs7Ozs7O0FBa0JBLGFBQUssSUFBTCxDQUFVLGFBQVYsQ0FBd0IsS0FBSyxhQUFMLENBQW1CLFNBQW5CLENBQXhCO0FBQ0EsYUFBSyxVQUFMLEdBQWtCLEVBQWxCO0FBQ0EsYUFBSyxJQUFMLENBQVUsS0FBVixDQUFnQixJQUFoQixDQUFxQixXQUFyQixFQUFrQyxJQUFsQyxDQUF1QyxTQUF2QyxFQUFrRCxLQUFsRDtBQUNBO0FBQ0EsYUFBSyxJQUFMLENBQVUsS0FBVixDQUFnQixFQUFoQixDQUFtQixPQUFuQixFQUE0QixXQUE1QixFQUEwQyxLQUFLLGdCQUEvQyxFQXhCMkMsQ0F3QjRCOztBQUV2RTtBQUNBLGFBQUssY0FBTCxDQUFvQixTQUFwQjtBQUNILEtBcGhCd0I7QUFxaEJ6QixZQUFRLGtCQUFXO0FBQ2Y7QUFEZSxZQUVSLFNBRlEsR0FFSyxLQUFLLEtBRlYsQ0FFUixTQUZROzs7QUFJZixlQUNJLDZCQUFLLElBQUksS0FBSyxFQUFkLEVBQWtCLFdBQVcsV0FBVyxTQUFYLENBQTdCLEdBREo7QUFHSDtBQTVoQndCLENBQWxCLENBQVg7O0FBK2hCQSxPQUFPLE9BQVAsR0FBaUIsSUFBakI7OztBQ2xqQkE7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxRQUFRLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSSxZQUFZLFFBQVEsT0FBUixFQUFpQixTQUFqQztBQUNBLElBQUksYUFBYSxRQUFRLFlBQVIsQ0FBakI7O0FBRUEsSUFBSSxPQUFPLFFBQVEsa0JBQVIsQ0FBWDs7QUFFQSxJQUFJLGNBQWMsTUFBTSxXQUFOLENBQWtCO0FBQ2hDLGlCQUFhLGFBRG1CO0FBRWhDLGVBQVc7QUFDUCxZQUFJLFVBQVUsTUFEUDtBQUVQLGNBQU0sVUFBVSxNQUZUO0FBR1AsbUJBQVcsVUFBVSxNQUhkO0FBSVAsY0FBTSxVQUFVLE1BSlQsRUFJaUI7QUFDeEIsYUFBSyxVQUFVLE1BTFI7QUFNUCxnQkFBUSxVQUFVLE1BTlg7QUFPUCxjQUFNLFVBQVUsTUFQVDtBQVFQLGVBQU8sVUFBVSxLQVJWO0FBU1AscUJBQWEsVUFBVSxNQVRoQjtBQVVQLG1CQUFXLFVBQVUsTUFWZDtBQVdQLHVCQUFlLFVBQVUsTUFYbEI7QUFZUCx3QkFBZ0IsVUFBVSxNQVpuQjtBQWFQLGtCQUFVLFVBQVUsSUFiYixFQWE2QjtBQUNwQyx3QkFBZ0IsVUFBVSxNQWRuQjtBQWVQLHNCQUFjLFVBQVUsTUFmakI7QUFnQlAscUJBQWEsVUFBVSxNQWhCaEI7QUFpQlAsZ0JBQVEsVUFBVSxNQWpCWDtBQWtCUCxrQkFBVSxVQUFVLElBbEJiO0FBbUJQLGtCQUFVLFVBQVUsSUFuQmI7QUFvQlAsZ0JBQVEsVUFBVSxJQXBCWDtBQXFCUCxpQkFBUyxVQUFVLElBckJaO0FBc0JQLHFCQUFhLFVBQVUsSUF0QmhCO0FBdUJQLHFCQUFhLFVBQVUsSUF2QmhCO0FBd0JQLG1CQUFXLFVBQVUsTUF4QmQsRUF3QmlDO0FBQ3hDLDBCQUFrQixVQUFVLE1BekJyQixFQXlCaUM7QUFDeEMsMkJBQW1CLFVBQVUsTUExQnRCLEVBMEJpQztBQUN4Qyx5QkFBaUIsVUFBVSxJQTNCcEIsRUEyQjZCO0FBQ3BDLHNCQUFjLFVBQVUsSUE1QmpCLEVBNEJ5QjtBQUNoQyxrQkFBVSxVQUFVLE1BN0JiLEVBNkJ5QjtBQUNoQyxzQkFBYyxVQUFVLEtBOUJqQixDQThCeUI7QUE5QnpCLEtBRnFCO0FBa0NoQyxRQUFJLEVBbEM0QjtBQW1DaEMsY0FBVSxrQkFBUyxDQUFULEVBQVk7QUFDbEIsWUFBSSxXQUFXLEtBQUssV0FBTCxDQUFpQixVQUFqQixDQUE0QixJQUE1QixHQUFtQyxFQUFFLElBQUYsQ0FBTyxLQUFQLEVBQW5DLENBQWY7O0FBRUEsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLFFBQWxCLEtBQStCLFdBQWxDLEVBQStDO0FBQzNDLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLENBQXBCO0FBQ0g7QUFDSixLQXpDK0I7QUEwQ2hDLGNBQVUsa0JBQVMsQ0FBVCxFQUFZO0FBQ2xCLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxRQUFsQixLQUErQixXQUFsQyxFQUErQztBQUMzQyxpQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixDQUFwQjtBQUNIO0FBQ0osS0E5QytCO0FBK0NoQyxZQUFRLGdCQUFTLENBQVQsRUFBWTtBQUNoQixZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsTUFBbEIsS0FBNkIsV0FBaEMsRUFBNkM7QUFDekMsaUJBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsQ0FBbEI7QUFDSDtBQUNKLEtBbkQrQjtBQW9EaEMsYUFBUyxpQkFBUyxDQUFULEVBQVk7QUFDakIsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLE9BQWxCLEtBQThCLFdBQWpDLEVBQThDO0FBQzFDLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLENBQW5CO0FBQ0g7QUFDSixLQXhEK0I7QUF5RGhDLGlCQUFhLHFCQUFTLENBQVQsRUFBWTtBQUNyQixZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsV0FBbEIsS0FBa0MsV0FBckMsRUFBa0Q7QUFDOUMsaUJBQUssS0FBTCxDQUFXLFdBQVgsQ0FBdUIsQ0FBdkI7QUFDSDtBQUNKLEtBN0QrQjtBQThEaEMsaUJBQWEscUJBQVMsQ0FBVCxFQUFZOztBQUVyQixZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsV0FBbEIsS0FBa0MsV0FBckMsRUFBa0QsQ0FDakQ7QUFDSixLQWxFK0I7QUFtRWhDLGdCQUFZLHNCQUFXO0FBQUEscUJBQ21QLEtBQUssS0FEeFA7QUFBQSxZQUNYLElBRFcsVUFDWCxJQURXO0FBQUEsWUFDTCxHQURLLFVBQ0wsR0FESztBQUFBLFlBQ0EsSUFEQSxVQUNBLElBREE7QUFBQSxZQUNNLE1BRE4sVUFDTSxNQUROO0FBQUEsWUFDYyxLQURkLFVBQ2MsS0FEZDtBQUFBLFlBQ3FCLFdBRHJCLFVBQ3FCLFdBRHJCO0FBQUEsWUFDa0MsU0FEbEMsVUFDa0MsU0FEbEM7QUFBQSxZQUM2QyxhQUQ3QyxVQUM2QyxhQUQ3QztBQUFBLFlBQzRELGNBRDVELFVBQzRELGNBRDVEO0FBQUEsWUFDNEUsY0FENUUsVUFDNEUsY0FENUU7QUFBQSxZQUM0RixZQUQ1RixVQUM0RixZQUQ1RjtBQUFBLFlBQzBHLFdBRDFHLFVBQzBHLFdBRDFHO0FBQUEsWUFDdUgsTUFEdkgsVUFDdUgsTUFEdkg7QUFBQSxZQUMrSCxRQUQvSCxVQUMrSCxRQUQvSDtBQUFBLFlBQ3lJLFNBRHpJLFVBQ3lJLFNBRHpJO0FBQUEsWUFDb0osZ0JBRHBKLFVBQ29KLGdCQURwSjtBQUFBLFlBQ3NLLGlCQUR0SyxVQUNzSyxpQkFEdEs7QUFBQSxZQUN5TCxlQUR6TCxVQUN5TCxlQUR6TDtBQUFBLFlBQzBNLFlBRDFNLFVBQzBNLFlBRDFNO0FBQUEsWUFDd04sUUFEeE4sVUFDd04sUUFEeE47QUFBQSxZQUNrTyxZQURsTyxVQUNrTyxZQURsTzs7O0FBR25CLFlBQUksVUFBVTtBQUNWLHlCQUFhLFdBREg7QUFFViwyQkFBZSxhQUZMO0FBR1YsNEJBQWdCLGNBSE47QUFJVix3QkFBWTtBQUpGLFNBQWQ7O0FBT0EsWUFBRyxRQUFILEVBQVk7QUFDUixjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsV0FBVyxLQUFiLEVBQWxCO0FBQ0g7O0FBRUQsWUFBRyxZQUFZLENBQWYsRUFBaUI7QUFDYixjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsV0FBVyxTQUFiLEVBQWxCO0FBQ0g7O0FBRUQsWUFBRyxxQkFBcUIsSUFBeEIsRUFBNkI7QUFDekIsY0FBRSxNQUFGLENBQVMsT0FBVCxFQUFrQixFQUFFLGtCQUFrQixnQkFBcEIsRUFBbEI7QUFDSDs7QUFFRDtBQUNBO0FBQ0EsWUFBRyxPQUFPLFFBQVEsSUFBZixJQUF1QixJQUFJLE1BQUosR0FBYSxDQUF2QyxFQUEwQztBQUN0QyxjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsWUFBWTtBQUM1QiwrQkFBVztBQUNQLDhCQUFNO0FBQ0YsaUNBQU0sUUFBUSxTQUFTLElBQWpCLElBQXlCLEtBQUssTUFBTCxHQUFjLENBQXhDLEdBQTZDLE9BQU8sR0FBcEQsR0FBMEQsR0FEN0Q7QUFFRixrQ0FBTSxNQUZKO0FBR0Ysc0NBQVUsTUFIUjtBQUlGLGtDQUFNLElBSkosRUFJZTtBQUNqQix5Q0FBYTtBQUxYLHlCQURDO0FBUVAsc0NBQWMsc0JBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUI7QUFDL0IsZ0NBQUcsUUFBUSxNQUFSLElBQWtCLHNCQUFzQixJQUEzQyxFQUFnRDtBQUM1QztBQUNBLHFDQUFJLElBQUksSUFBUixJQUFnQixpQkFBaEIsRUFBa0M7QUFDOUIsd0NBQUcsT0FBTyxrQkFBa0IsSUFBbEIsQ0FBUCxLQUFtQyxRQUFuQyxJQUFpRCxRQUFRLElBQTVELEVBQW1FO0FBQy9ELDZDQUFLLGtCQUFrQixJQUFsQixDQUFMLElBQWdDLEtBQUssSUFBTCxDQUFoQztBQUNIO0FBQ0o7O0FBRUQsb0NBQUcsa0JBQWtCLGFBQWxCLElBQW1DLEtBQUssTUFBeEMsSUFBa0QsS0FBSyxNQUFMLENBQVksT0FBakUsRUFBeUU7QUFDckU7QUFDQSx3Q0FBSSxVQUFVLEtBQUssTUFBTCxDQUFZLE9BQTFCO0FBQ0EsNENBQVEsR0FBUixDQUFZLFVBQUMsTUFBRCxFQUFZO0FBQ3BCLDRDQUFJLFFBQVMsa0JBQWtCLFlBQW5CLEdBQW1DLGtCQUFrQixZQUFsQixHQUFpQyxPQUFPLEtBQTNFLEdBQW1GLE9BQU8sS0FBdEc7QUFDQSw0Q0FBRyxrQkFBa0Isc0JBQXJCLEVBQTRDO0FBQ3hDLGlEQUFLLE1BQU0sV0FBTixFQUFMLElBQTRCLE9BQU8sS0FBbkM7QUFDSCx5Q0FGRCxNQUVLO0FBQ0QsaURBQUssS0FBTCxJQUFjLE9BQU8sS0FBckI7QUFDSDtBQUNKLHFDQVBEO0FBUUg7QUFDSjtBQUNELG1DQUFPLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBUDtBQUNIO0FBL0JNLHFCQURpQjtBQWtDNUIsNEJBQVE7QUFDSjtBQUNBLDhCQUFNLGNBQVMsUUFBVCxFQUFtQjtBQUNyQixnQ0FBSSxhQUFhLEVBQWpCO0FBQUEsZ0NBQXFCLFdBQVcsUUFBaEM7QUFDQSxnQ0FBRyxhQUFhLFVBQVUsTUFBVixHQUFtQixDQUFoQyxJQUFxQyxhQUFhLE1BQXJELEVBQTZEO0FBQ3pELDZDQUFhLFVBQVUsS0FBVixDQUFnQixHQUFoQixDQUFiO0FBQ0EsMkNBQVcsR0FBWCxDQUNJLFVBQUMsS0FBRCxFQUFXO0FBQ1AsK0NBQVcsU0FBUyxLQUFULENBQVg7QUFDSCxpQ0FITDtBQUtIO0FBQ0QsbUNBQU8sUUFBUDtBQUNIO0FBYkcscUJBbENvQjtBQWlENUIscUNBQWlCLGVBakRXO0FBa0Q1QixrQ0FBYyxZQWxEYztBQW1ENUIsOEJBQVU7QUFuRGtCLGlCQUFkLEVBQWxCO0FBc0RILFNBdkRELE1BdURNLElBQUcsT0FBTyxLQUFQLEtBQWlCLFdBQXBCLEVBQWlDO0FBQ25DLGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBRSxZQUFZLEtBQWQsRUFBbEI7QUFDSDs7QUFFRDtBQUNBLFlBQUcsT0FBTyxjQUFQLEtBQTBCLFdBQTdCLEVBQTBDO0FBQ3RDLGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBRSxnQkFBZ0IsY0FBbEIsRUFBbEI7QUFDSDs7QUFFRDtBQUNBLFlBQUcsT0FBTyxZQUFQLEtBQXdCLFdBQTNCLEVBQXdDO0FBQ3BDLGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBRSxjQUFjLFlBQWhCLEVBQWxCO0FBQ0g7O0FBRUQ7QUFDQSxZQUFHLE9BQU8sV0FBUCxLQUF1QixXQUExQixFQUF1QztBQUNuQyxjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsYUFBYSxXQUFmLEVBQWxCO0FBQ0g7O0FBRUQ7QUFDQSxZQUFHLE9BQU8sTUFBUCxLQUFrQixXQUFyQixFQUFrQztBQUM5QixjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsUUFBUSxNQUFWLEVBQWxCO0FBQ0g7QUFDRCxZQUFHLGlCQUFpQixJQUFqQixJQUF5QixNQUFNLE9BQU4sQ0FBYyxZQUFkLENBQTVCLEVBQXdEO0FBQ3BELGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBRSxXQUFXLG1CQUFVLENBQVYsRUFBYTtBQUN4Qyx3QkFBSSxFQUFFLE1BQU4sRUFBYztBQUFBLDRCQUVOLEtBRk07QUFBQSw0QkFhTixTQWJNOztBQUFBO0FBQ1YsZ0NBQUksU0FBUyxZQUFiO0FBQ0ksb0NBQVEsRUFBRSxNQUFGLENBQVMsS0FGWDs7O0FBSVYsZ0NBQUksWUFBWSxFQUFoQjtBQUNBLG1DQUFPLEdBQVAsQ0FBVyxpQkFBUztBQUNoQiwwQ0FBVSxJQUFWLENBQWU7QUFDWCwyQ0FBTyxLQURJO0FBRVgsOENBQVUsVUFGQztBQUdYLDJDQUFPO0FBSEksaUNBQWY7QUFLSCw2QkFORDs7QUFRSSx3Q0FBWTtBQUNaLHlDQUFTLFNBREc7QUFFWix1Q0FBTztBQUZLLDZCQWJOOztBQWlCViw4QkFBRSxNQUFGLENBQVMsVUFBVCxDQUFvQixNQUFwQixDQUEyQixTQUEzQjtBQUNBLDhCQUFFLGNBQUY7QUFsQlU7QUFtQmI7QUFDRCxzQkFBRSxjQUFGO0FBQ0gsaUJBdEJpQixFQUFsQjtBQXVCSDtBQUNELGVBQU8sT0FBUDtBQUNILEtBbk0rQjtBQW9NbkMscUJBQWlCLDJCQUFXO0FBQzNCO0FBQ0E7QUFDQSxlQUFPLEVBQUMsUUFBUSxNQUFULEVBQWlCLFdBQVcsa0JBQTVCLEVBQWdELGFBQWEsV0FBVyxNQUF4RSxFQUFnRixlQUFlLE1BQS9GLEVBQXVHLGdCQUFnQixPQUF2SCxFQUFnSSxVQUFVLEtBQTFJLEVBQWlKLFdBQVcsQ0FBNUosRUFBK0osa0JBQWtCLElBQWpMLEVBQXVMLGlCQUFpQixLQUF4TSxFQUErTSxjQUFjLEtBQTdOLEVBQW9PLFVBQVUsRUFBOU8sRUFBa1AsY0FBYyxJQUFoUSxFQUFQO0FBQ0EsS0F4TWtDO0FBeU1oQyx3QkFBb0IsOEJBQVc7QUFDM0I7QUFDQSxZQUFJLEtBQUssS0FBSyxLQUFMLENBQVcsRUFBcEI7QUFDQSxZQUFHLE9BQU8sRUFBUCxLQUFjLFdBQWpCLEVBQThCO0FBQzFCLGlCQUFLLEtBQUssT0FBTCxFQUFMO0FBQ0g7QUFDRCxhQUFLLEVBQUwsR0FBVSxFQUFWO0FBQ0gsS0FoTitCO0FBaU5oQyx1QkFBbUIsNkJBQVc7QUFDMUI7QUFDQSxhQUFLLFlBQUwsR0FBb0IsRUFBRSxNQUFJLEtBQUssRUFBWCxDQUFwQjtBQUNBLGFBQUssV0FBTCxHQUFtQixLQUFLLFlBQUwsQ0FBa0IsZ0JBQWxCLENBQW1DLEtBQUssVUFBTCxFQUFuQyxFQUFzRCxJQUF0RCxDQUEyRCxrQkFBM0QsQ0FBbkI7O0FBRUE7QUFDQSxhQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsUUFBdEIsRUFBZ0MsS0FBSyxRQUFyQztBQUNBLGFBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixRQUF0QixFQUFnQyxLQUFLLFFBQXJDO0FBQ0EsYUFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLE1BQXRCLEVBQThCLEtBQUssTUFBbkM7QUFDQSxhQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsT0FBdEIsRUFBK0IsS0FBSyxPQUFwQztBQUNBLGFBQUssV0FBTCxDQUFpQixJQUFqQixDQUFzQixXQUF0QixFQUFtQyxLQUFLLFdBQXhDO0FBQ0EsYUFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLFdBQXRCLEVBQW1DLEtBQUssV0FBeEM7QUFDSCxLQTdOK0I7QUE4TmhDLFlBQVEsa0JBQVc7QUFDZjtBQURlLHNCQUV1QixLQUFLLEtBRjVCO0FBQUEsWUFFUCxTQUZPLFdBRVAsU0FGTztBQUFBLFlBRUksSUFGSixXQUVJLElBRko7QUFBQSxZQUVVLFFBRlYsV0FFVSxRQUZWOzs7QUFJZixlQUNJLGdDQUFRLElBQUksS0FBSyxFQUFqQixFQUFxQixNQUFNLElBQTNCLEVBQWlDLFVBQVUsUUFBM0MsRUFBcUQsV0FBVyxXQUFXLFNBQVgsQ0FBaEUsR0FESjtBQUdIO0FBck8rQixDQUFsQixDQUFsQjs7QUF3T0EsT0FBTyxPQUFQLEdBQWlCLFdBQWpCOzs7QUMzUEE7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxRQUFRLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSSxZQUFZLFFBQVEsT0FBUixFQUFpQixTQUFqQztBQUNBLElBQUksYUFBYSxRQUFRLFlBQVIsQ0FBakI7O0FBRUEsSUFBSSxPQUFPLFFBQVEsa0JBQVIsQ0FBWDs7QUFFQSxJQUFJLGlCQUFpQixNQUFNLFdBQU4sQ0FBa0I7QUFDbkMsaUJBQWEsZ0JBRHNCO0FBRW5DLGVBQVc7QUFDUCxZQUFJLFVBQVUsTUFEUDtBQUVQLG1CQUFXLFVBQVUsTUFGZDtBQUdQLGNBQU0sVUFBVSxNQUhUO0FBSVAsZUFBTyxVQUFVLFNBQVYsQ0FBb0IsQ0FDdkIsVUFBVSxNQURhLEVBRXZCLFVBQVUsTUFGYSxDQUFwQixDQUpBO0FBUVAsZ0JBQVEsVUFBVSxNQVJYO0FBU1AsZUFBTyxVQUFVLE1BVFY7QUFVUCxjQUFNLFVBQVUsTUFWVDtBQVdQLGFBQUssVUFBVSxNQVhSO0FBWVAsYUFBSyxVQUFVLE1BWlI7QUFhUCxrQkFBVSxVQUFVLE1BYmI7QUFjUCxxQkFBYSxVQUFVLE1BZGhCO0FBZVAsdUJBQWUsVUFBVSxNQWZsQjtBQWdCUCxxQkFBYSxVQUFVO0FBaEJoQixLQUZ3QjtBQW9CbkMsUUFBSSxFQXBCK0I7QUFxQm5DLGdCQUFZLHNCQUFXO0FBQUEscUJBQzBFLEtBQUssS0FEL0U7QUFBQSxZQUNYLE1BRFcsVUFDWCxNQURXO0FBQUEsWUFDSCxLQURHLFVBQ0gsS0FERztBQUFBLFlBQ0ksSUFESixVQUNJLElBREo7QUFBQSxZQUNVLEdBRFYsVUFDVSxHQURWO0FBQUEsWUFDZSxHQURmLFVBQ2UsR0FEZjtBQUFBLFlBQ29CLFFBRHBCLFVBQ29CLFFBRHBCO0FBQUEsWUFDOEIsV0FEOUIsVUFDOEIsV0FEOUI7QUFBQSxZQUMyQyxhQUQzQyxVQUMyQyxhQUQzQztBQUFBLFlBQzBELFdBRDFELFVBQzBELFdBRDFEOzs7QUFHbkIsWUFBSSxVQUFVO0FBQ1Ysb0JBQVEsTUFERTtBQUVWLG1CQUFPLEtBRkc7QUFHViwyQkFBZSxhQUhMO0FBSVYseUJBQWE7QUFKSCxTQUFkOztBQU9BO0FBQ0EsWUFBRyxPQUFPLElBQVAsS0FBZ0IsV0FBbkIsRUFBZ0M7QUFDNUIsY0FBRSxNQUFGLENBQVMsT0FBVCxFQUFrQixFQUFFLE1BQU0sSUFBUixFQUFsQjtBQUNIOztBQUVEO0FBQ0EsWUFBRyxPQUFPLEdBQVAsS0FBZSxXQUFsQixFQUErQjtBQUMzQixjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsS0FBSyxHQUFQLEVBQWxCO0FBQ0g7O0FBRUQ7QUFDQSxZQUFHLE9BQU8sR0FBUCxLQUFlLFdBQWxCLEVBQStCO0FBQzNCLGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBRSxLQUFLLEdBQVAsRUFBbEI7QUFDSDs7QUFFRDtBQUNBLFlBQUcsT0FBTyxRQUFQLEtBQW9CLFdBQXZCLEVBQW9DO0FBQ2hDLGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBRSxVQUFVLFFBQVosRUFBbEI7QUFDSDs7QUFFRDtBQUNBLFlBQUcsT0FBTyxXQUFQLEtBQXVCLFdBQTFCLEVBQXVDO0FBQ25DLGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBRSxhQUFhLFdBQWYsRUFBbEI7QUFDSDs7QUFFRCxlQUFPLE9BQVA7QUFDSCxLQXpEa0M7QUEwRHRDLHFCQUFpQiwyQkFBVztBQUMzQjtBQUNBO0FBQ0EsZUFBTyxFQUFFLFFBQVEsSUFBVixFQUFnQixPQUFPLENBQXZCLEVBQTBCLGVBQWUsRUFBekMsRUFBNkMsYUFBYSxFQUExRCxFQUFQO0FBQ0EsS0E5RHFDO0FBK0RuQyx3QkFBb0IsOEJBQVc7QUFDM0I7QUFDQSxZQUFJLEtBQUssS0FBSyxLQUFMLENBQVcsRUFBcEI7QUFDQSxZQUFHLE9BQU8sRUFBUCxLQUFjLFdBQWpCLEVBQThCO0FBQzFCLGlCQUFLLEtBQUssT0FBTCxFQUFMO0FBQ0g7O0FBRUQsYUFBSyxFQUFMLEdBQVUsRUFBVjtBQUNILEtBdkVrQztBQXdFbkMsdUJBQW1CLDZCQUFXO0FBQzFCO0FBQ0EsYUFBSyxlQUFMLEdBQXVCLEVBQUUsTUFBSSxLQUFLLEVBQVgsQ0FBdkI7QUFDQSxhQUFLLGNBQUwsR0FBc0IsS0FBSyxlQUFMLENBQXFCLG1CQUFyQixDQUF5QyxLQUFLLFVBQUwsRUFBekMsRUFBNEQsSUFBNUQsQ0FBaUUscUJBQWpFLENBQXRCO0FBQ0gsS0E1RWtDO0FBNkVuQyxZQUFRLGtCQUFXO0FBQ2Y7QUFEZSxzQkFFb0IsS0FBSyxLQUZ6QjtBQUFBLFlBRVAsU0FGTyxXQUVQLFNBRk87QUFBQSxZQUVJLElBRkosV0FFSSxJQUZKO0FBQUEsWUFFVSxLQUZWLFdBRVUsS0FGVjs7O0FBSWYsZUFDSSwrQkFBTyxJQUFJLEtBQUssRUFBaEIsRUFBb0IsTUFBTSxJQUExQixFQUFnQyxPQUFPLEVBQUMsT0FBTyxLQUFSLEVBQXZDLEdBREo7QUFHSDtBQXBGa0MsQ0FBbEIsQ0FBckI7O0FBdUZBLE9BQU8sT0FBUCxHQUFpQixjQUFqQjs7O0FDMUdBOzs7Ozs7Ozs7OztBQVdBOzs7O0FBRUEsSUFBSSxRQUFRLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSSxZQUFZLFFBQVEsT0FBUixFQUFpQixTQUFqQztBQUNBLElBQUksYUFBYSxRQUFRLFlBQVIsQ0FBakI7O0FBRUEsSUFBSSxPQUFPLFFBQVEsa0JBQVIsQ0FBWDs7QUFFQSxJQUFJLFdBQVcsTUFBTSxXQUFOLENBQWtCO0FBQzdCLGlCQUFhLFVBRGdCO0FBRTdCLGVBQVc7QUFDUCxZQUFJLFVBQVUsTUFEUDtBQUVQLG1CQUFXLFVBQVUsTUFGZDtBQUdQLHFCQUFhLFVBQVU7QUFIaEIsS0FGa0I7QUFPN0IsUUFBSSxFQVB5QjtBQVE3QixZQUFRLGdCQUFTLEtBQVQsRUFBZ0I7QUFDcEIsYUFBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixLQUFyQjtBQUNILEtBVjRCO0FBVzdCLGNBQVUsa0JBQVMsQ0FBVCxFQUFZLENBRXJCLENBYjRCO0FBYzdCLGdCQUFZLHNCQUFXO0FBQ25CLGVBQU8sRUFBUDtBQUNILEtBaEI0QjtBQWlCaEMscUJBQWlCLDJCQUFXO0FBQzNCO0FBQ0E7QUFDQSxlQUFPLEVBQUMsT0FBTyxlQUFSLEVBQVA7QUFDQSxLQXJCK0I7QUFzQjdCLHFCQUFpQiwyQkFBVztBQUM5QjtBQUNNLGVBQU8sRUFBQyxNQUFNLEVBQVAsRUFBUDtBQUNILEtBekI0QjtBQTBCN0Isd0JBQW9CLDhCQUFXO0FBQzNCO0FBQ0EsWUFBSSxLQUFLLEtBQUssS0FBTCxDQUFXLEVBQXBCO0FBQ0EsWUFBRyxPQUFPLEVBQVAsS0FBYyxXQUFqQixFQUE4QjtBQUMxQixpQkFBSyxLQUFLLE9BQUwsRUFBTDtBQUNIOztBQUVELGFBQUssRUFBTCxHQUFVLEVBQVY7QUFDSCxLQWxDNEI7QUFtQzdCLHVCQUFtQiw2QkFBVztBQUMxQjtBQUNBLGFBQUssU0FBTCxHQUFpQixFQUFFLE1BQUksS0FBSyxFQUFYLENBQWpCO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLEtBQUssU0FBTCxDQUFlLGFBQWYsQ0FBNkIsS0FBSyxVQUFMLEVBQTdCLEVBQWdELElBQWhELENBQXFELGVBQXJELENBQWhCOztBQUVBO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixRQUFuQixFQUE2QixLQUFLLFFBQWxDO0FBQ0gsS0ExQzRCO0FBMkM3QixZQUFRLGtCQUFXO0FBQ2Y7QUFEZSxxQkFFZSxLQUFLLEtBRnBCO0FBQUEsWUFFUixTQUZRLFVBRVIsU0FGUTtBQUFBLFlBRUcsUUFGSCxVQUVHLFFBRkg7OztBQUlmLGVBQ0k7QUFBQTtBQUFBLGNBQUksSUFBSSxLQUFLLEVBQWIsRUFBaUIsV0FBVyxXQUFXLFNBQVgsQ0FBNUI7QUFBb0Q7QUFBcEQsU0FESjtBQUdIO0FBbEQ0QixDQUFsQixDQUFmOztBQXFEQSxJQUFJLGVBQWUsTUFBTSxXQUFOLENBQWtCO0FBQ2pDLGlCQUFhLGNBRG9CO0FBRWpDLGVBQVc7QUFDUCxZQUFJLFVBQVUsTUFEUDtBQUVQLGVBQU8sVUFBVSxNQUZWO0FBR1AsZUFBTyxVQUFVO0FBSFYsS0FGc0I7QUFPakMsZ0JBQVksc0JBQVc7QUFBQSxzQkFDb0IsS0FBSyxLQUR6QjtBQUFBLFlBQ1osS0FEWSxXQUNaLEtBRFk7QUFBQSxZQUNMLFFBREssV0FDTCxRQURLO0FBQUEsWUFDSyxXQURMLFdBQ0ssV0FETDs7QUFFbkIsWUFBSSxPQUFKOztBQUVBLFlBQUcsS0FBSCxFQUFVO0FBQ04sZ0JBQUksU0FBUyxNQUFNLEdBQU4sQ0FBVSxVQUFTLElBQVQsRUFBZTtBQUNsQyxvQkFBRyxRQUFPLElBQVAseUNBQU8sSUFBUCxPQUFnQixRQUFuQixFQUE2QjtBQUN6Qix3QkFBSSxJQUFKLEVBQVUsSUFBVjtBQUNBLHdCQUFHLEtBQUssY0FBTCxDQUFvQixnQkFBcEIsQ0FBSCxFQUEwQztBQUN0QywrQkFBTyw4QkFBTSxXQUFXLFdBQVcsS0FBSyxjQUFoQixDQUFqQixHQUFQO0FBQ0g7QUFDRCx3QkFBRyxLQUFLLGNBQUwsQ0FBb0IsVUFBcEIsQ0FBSCxFQUFvQztBQUNoQywrQkFBTyw2QkFBSyxLQUFLLEtBQUssUUFBZixHQUFQO0FBQ0g7O0FBRUQsd0JBQUcsS0FBSyxjQUFMLENBQW9CLE1BQXBCLENBQUgsRUFBZ0M7QUFDNUIsK0JBQU8sS0FBSyxJQUFaO0FBQ0g7O0FBRUQsd0JBQUksSUFBSjtBQUNBLHdCQUFHLEtBQUssY0FBTCxDQUFvQixNQUFwQixDQUFILEVBQWdDO0FBQzVCLCtCQUFPLEVBQUUsTUFBTSxLQUFLLFNBQUwsQ0FBZSxLQUFLLElBQXBCLENBQVIsRUFBUDtBQUNIO0FBQ0Q7QUFDQSwyQkFBUTtBQUFBO0FBQVEsNEJBQVI7QUFBZSw0QkFBZjtBQUFBO0FBQXNCO0FBQXRCLHFCQUFSO0FBQ0E7QUFDSCxpQkFwQkQsTUFvQk07QUFDRjtBQUNBLDJCQUFRO0FBQUE7QUFBQTtBQUFLO0FBQUwscUJBQVI7QUFDSDtBQUNKLGFBekJZLENBQWI7QUEwQkEsc0JBQVU7QUFBQTtBQUFBO0FBQUs7QUFBTCxhQUFWO0FBRUgsU0E3QkQsTUE2Qk0sSUFBRyxRQUFILEVBQWE7QUFDZixzQkFBVSxRQUFWO0FBRUgsU0FISyxNQUdBO0FBQ0Y7QUFDQSxzQkFBVSxnQ0FBVjtBQUNIOztBQUVELGVBQU8sT0FBUDtBQUNILEtBakRnQztBQWtEakMsWUFBUSxrQkFBVztBQUNmO0FBRGUsc0JBRUssS0FBSyxLQUZWO0FBQUEsWUFFUixFQUZRLFdBRVIsRUFGUTtBQUFBLFlBRUosS0FGSSxXQUVKLEtBRkk7OztBQUlmLFlBQUksR0FBSjtBQUNBLFlBQUcsRUFBSCxFQUFPO0FBQ0gsa0JBQU0sRUFBQyxJQUFJLEVBQUwsRUFBTjtBQUNIO0FBQ0QsZUFDSTtBQUFBO0FBQVEsZUFBUjtBQUNLLGlCQURMO0FBRUssaUJBQUssVUFBTDtBQUZMLFNBREo7QUFNSDtBQWhFZ0MsQ0FBbEIsQ0FBbkI7O0FBbUVBLElBQUksbUJBQW1CLE1BQU0sV0FBTixDQUFrQjtBQUFBOztBQUNyQyxZQUFRLGtCQUFXO0FBQUEsWUFDUCxJQURPLEdBQ0UsS0FBSyxLQURQLENBQ1AsSUFETzs7QUFFZixlQUFRO0FBQUE7QUFBUSxnQkFBUjtBQUFlLGlCQUFLLEtBQUwsQ0FBVztBQUExQixTQUFSO0FBQ0g7QUFKb0MsQ0FBbEIsQ0FBdkI7O0FBT0EsT0FBTyxPQUFQLEdBQWlCO0FBQ2IsY0FBVSxRQURHO0FBRWIsa0JBQWM7QUFGRCxDQUFqQjs7O0FDbEpBOzs7Ozs7Ozs7OztBQVdBOztBQUVBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjtBQUNBLElBQUksWUFBWSxRQUFRLE9BQVIsRUFBaUIsU0FBakM7QUFDQSxJQUFJLGFBQWEsUUFBUSxZQUFSLENBQWpCOztBQUVBLElBQUksT0FBTyxRQUFRLGtCQUFSLENBQVg7O0FBRUEsSUFBSSxjQUFjLE1BQU0sV0FBTixDQUFrQjtBQUNoQyxpQkFBYSxhQURtQjtBQUVoQyxlQUFXO0FBQ1AsWUFBSSxVQUFVLE1BRFA7QUFFUCxtQkFBVyxVQUFVLE1BRmQ7QUFHUCxjQUFNLFVBQVUsS0FBVixDQUFnQixDQUFDLE9BQUQsRUFBVSxTQUFWLEVBQXFCLE9BQXJCLENBQWhCLENBSEM7QUFJUCxlQUFPLFVBQVUsTUFKVjtBQUtQLG1CQUFXLFVBQVUsU0FBVixDQUFvQixDQUMzQixVQUFVLE1BRGlCLEVBRTNCLFVBQVUsSUFGaUIsRUFHM0IsVUFBVSxNQUhpQixDQUFwQixDQUxKO0FBVVAsYUFBSyxVQUFVLE1BVlI7QUFXUCxhQUFLLFVBQVUsTUFYUjtBQVlQLGdCQUFRLFVBQVUsSUFaWDtBQWFQLHFCQUFhLFVBQVUsS0FBVixDQUFnQixDQUFDLFlBQUQsRUFBZSxVQUFmLENBQWhCLENBYk47QUFjUCxrQkFBVSxVQUFVLElBZGI7QUFlUCxvQkFBWSxVQUFVO0FBZmYsS0FGcUI7QUFtQmhDLFFBQUksRUFuQjRCO0FBb0JoQztBQUNBO0FBQ0EsV0FBTyxlQUFTLENBQVQsRUFBWTtBQUNmLFlBQUcsVUFBVSxNQUFWLElBQW9CLENBQXZCLEVBQTBCO0FBQ3RCLG1CQUFPLEtBQUssV0FBTCxDQUFpQixLQUFqQixFQUFQO0FBQ0gsU0FGRCxNQUVNO0FBQ0YsbUJBQU8sS0FBSyxXQUFMLENBQWlCLEtBQWpCLENBQXVCLENBQXZCLENBQVA7QUFDSDtBQUNKLEtBNUIrQjtBQTZCaEMsWUFBUSxnQkFBUyxDQUFULEVBQVk7QUFDaEIsWUFBRyxVQUFVLE1BQVYsSUFBb0IsQ0FBdkIsRUFBMEI7QUFDdEIsaUJBQUssV0FBTCxDQUFpQixNQUFqQjtBQUNILFNBRkQsTUFFTTtBQUNGLGlCQUFLLFdBQUwsQ0FBaUIsTUFBakIsQ0FBd0IsQ0FBeEI7QUFDSDtBQUNKLEtBbkMrQjtBQW9DaEM7QUFDQTtBQUNBLGNBQVUsa0JBQVMsQ0FBVCxFQUFZOztBQUVsQixZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsUUFBbEIsS0FBK0IsV0FBbEMsRUFBK0M7QUFDM0MsaUJBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsRUFBRSxLQUF0QjtBQUNIO0FBQ0osS0EzQytCO0FBNENoQyxnQkFBWSxvQkFBUyxDQUFULEVBQVk7O0FBRXBCLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxVQUFsQixLQUFpQyxXQUFwQyxFQUFpRDtBQUM3QyxpQkFBSyxLQUFMLENBQVcsVUFBWCxDQUFzQixFQUFFLEtBQXhCO0FBQ0g7QUFDSixLQWpEK0I7QUFrRGhDLGdCQUFZLHNCQUFXO0FBQUEscUJBQ3FDLEtBQUssS0FEMUM7QUFBQSxZQUNYLElBRFcsVUFDWCxJQURXO0FBQUEsWUFDTCxLQURLLFVBQ0wsS0FESztBQUFBLFlBQ0UsU0FERixVQUNFLFNBREY7QUFBQSxZQUNhLE1BRGIsVUFDYSxNQURiO0FBQUEsWUFDcUIsV0FEckIsVUFDcUIsV0FEckI7O0FBR25COztBQUNBLFlBQUksVUFBSjtBQUNBLFlBQUcsT0FBTyxTQUFQLEtBQXFCLFFBQXhCLEVBQWtDO0FBQzlCLHlCQUFhLEVBQUUsVUFBVSxTQUFaLEVBQWI7QUFDSCxTQUZELE1BRU0sSUFBRyxjQUFjLElBQWpCLEVBQXVCO0FBQ3pCLHlCQUFhLEVBQUUsVUFBVSxHQUFaLEVBQWI7QUFDSCxTQUZLLE1BRUE7QUFDRix5QkFBYSxTQUFiO0FBQ0g7O0FBRUQsWUFBSSxVQUFVO0FBQ1Ysa0JBQU0sSUFESTtBQUVWLG1CQUFPLEtBRkc7QUFHVix1QkFBVyxVQUhEO0FBSVYsb0JBQVEsTUFKRTtBQUtWLHlCQUFhO0FBTEgsU0FBZDs7QUFRQTtBQUNBLFlBQUcsT0FBTyxHQUFQLEtBQWUsV0FBbEIsRUFBK0I7QUFDM0IsY0FBRSxNQUFGLENBQVMsT0FBVCxFQUFrQixFQUFFLEtBQUssR0FBUCxFQUFsQjtBQUNIOztBQUVEO0FBQ0EsWUFBRyxPQUFPLEdBQVAsS0FBZSxXQUFsQixFQUErQjtBQUMzQixjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsS0FBSyxHQUFQLEVBQWxCO0FBQ0g7O0FBRUQsZUFBTyxPQUFQO0FBQ0gsS0FsRitCO0FBbUZuQyxxQkFBaUIsMkJBQVc7QUFDM0I7QUFDQTtBQUNBLGVBQU8sRUFBRSxNQUFNLE9BQVIsRUFBaUIsT0FBTyxDQUF4QixFQUEyQixXQUFXLEVBQUUsVUFBVSxHQUFaLEVBQXRDLEVBQXlELFFBQVEsSUFBakUsRUFBdUUsYUFBYSxZQUFwRixFQUFQO0FBQ0EsS0F2RmtDO0FBd0ZoQyx3QkFBb0IsOEJBQVc7QUFDM0I7QUFDQSxZQUFJLEtBQUssS0FBSyxLQUFMLENBQVcsRUFBcEI7QUFDQSxZQUFHLE9BQU8sRUFBUCxLQUFjLFdBQWpCLEVBQThCO0FBQzFCLGlCQUFLLEtBQUssT0FBTCxFQUFMO0FBQ0g7O0FBRUQsYUFBSyxFQUFMLEdBQVUsRUFBVjtBQUNILEtBaEcrQjtBQWlHaEMsdUJBQW1CLDZCQUFXO0FBQzFCO0FBQ0EsYUFBSyxZQUFMLEdBQW9CLEVBQUUsTUFBSSxLQUFLLEVBQVgsQ0FBcEI7QUFDQSxhQUFLLFdBQUwsR0FBbUIsS0FBSyxZQUFMLENBQWtCLGdCQUFsQixDQUFtQyxLQUFLLFVBQUwsRUFBbkMsRUFBc0QsSUFBdEQsQ0FBMkQsa0JBQTNELENBQW5COztBQUVBO0FBQ0EsYUFBSyxXQUFMLENBQWlCLElBQWpCLENBQXNCLFFBQXRCLEVBQWdDLEtBQUssUUFBckM7QUFDQSxhQUFLLFdBQUwsQ0FBaUIsSUFBakIsQ0FBc0IsVUFBdEIsRUFBa0MsS0FBSyxVQUF2QztBQUNILEtBekcrQjtBQTBHaEMsWUFBUSxrQkFBVztBQUNmO0FBRGUsWUFFUCxTQUZPLEdBRU8sS0FBSyxLQUZaLENBRVAsU0FGTzs7O0FBSWYsZUFDSSw2QkFBSyxJQUFJLEtBQUssRUFBZCxFQUFrQixXQUFXLFdBQVcsU0FBWCxDQUE3QixHQURKO0FBR0g7QUFqSCtCLENBQWxCLENBQWxCOztBQW9IQSxPQUFPLE9BQVAsR0FBaUIsV0FBakI7OztBQ3ZJQTs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLFFBQVEsUUFBUSxPQUFSLENBQVo7QUFDQSxJQUFJLFlBQVksUUFBUSxPQUFSLEVBQWlCLFNBQWpDO0FBQ0EsSUFBSSxhQUFhLFFBQVEsWUFBUixDQUFqQjs7QUFFQSxJQUFJLE9BQU8sUUFBUSxrQkFBUixDQUFYOztBQUVBLElBQUksV0FBVyxNQUFNLFdBQU4sQ0FBa0I7QUFDN0IsaUJBQWEsVUFEZ0I7QUFFN0IsZUFBVztBQUNQLFlBQUksVUFBVSxNQURQO0FBRVAsbUJBQVcsVUFBVSxNQUZkO0FBR1AsaUJBQVMsVUFBVSxNQUhaO0FBSVAsY0FBTSxVQUFVLE1BSlQ7QUFLUCxhQUFLLFVBQVUsTUFMUjtBQU1QLGdCQUFRLFVBQVUsTUFOWDtBQU9QLGVBQU8sVUFBVSxLQVBWO0FBUVAsY0FBTSxVQUFVLE1BUlQ7QUFTUCxrQkFBVSxVQUFVLElBVGI7QUFVUCx1QkFBZSxVQUFVLFNBQVYsQ0FBb0IsQ0FDL0IsVUFBVSxNQURxQixFQUUvQixVQUFVLEtBRnFCLENBQXBCLENBVlI7QUFjUCx1QkFBZSxVQUFVLE1BZGxCO0FBZVAsb0JBQVksVUFBVSxJQWZmO0FBZ0JQLHFCQUFhLFVBQVUsSUFoQmhCO0FBaUJQLGtCQUFVLFVBQVUsTUFqQmI7QUFrQlAsa0JBQVUsVUFBVSxJQWxCYjtBQW1CUCxrQkFBVSxVQUFVLElBbkJiO0FBb0JQLGlCQUFTLFVBQVUsSUFwQlo7QUFxQlAsb0JBQVksVUFBVSxJQXJCZjtBQXNCUCxvQkFBWSxVQUFVLElBdEJmO0FBdUJQLGtCQUFVLFVBQVU7QUF2QmIsS0FGa0I7QUEyQjdCLFFBQUksRUEzQnlCO0FBNEI3QjtBQUNBO0FBQ0EsY0FBVSxrQkFBUyxJQUFULEVBQWU7QUFDckIsZUFBTyxLQUFLLFFBQUwsQ0FBYyxRQUFkLENBQXVCLElBQXZCLENBQVA7QUFDSCxLQWhDNEI7QUFpQzdCLFlBQVEsZ0JBQVMsSUFBVCxFQUFlO0FBQ25CLGVBQU8sS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixJQUFyQixDQUFQO0FBQ0gsS0FuQzRCO0FBb0M3QixZQUFRLGdCQUFTLElBQVQsRUFBZTtBQUNuQixZQUFHLFVBQVUsTUFBVixLQUFxQixDQUF4QixFQUEyQjtBQUN2QixtQkFBTyxLQUFLLFFBQUwsQ0FBYyxNQUFkLEVBQVA7QUFDSCxTQUZELE1BRU07QUFDRixtQkFBTyxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLElBQXJCLENBQVA7QUFDSDtBQUNKLEtBMUM0QjtBQTJDN0IsWUFBUSxnQkFBUyxRQUFULEVBQW1CLFVBQW5CLEVBQStCLE9BQS9CLEVBQXdDO0FBQzVDLGVBQU8sS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixRQUFyQixFQUErQixVQUEvQixFQUEyQyxPQUEzQyxDQUFQO0FBQ0gsS0E3QzRCO0FBOEM3QixZQUFRLGdCQUFTLElBQVQsRUFBZTtBQUNuQixhQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLElBQXJCO0FBQ0gsS0FoRDRCO0FBaUQ3QixZQUFRLGdCQUFTLElBQVQsRUFBZTtBQUNuQixhQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLElBQXJCO0FBQ0gsS0FuRDRCO0FBb0Q3QixlQUFXLHFCQUFXO0FBQ2xCLGFBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsU0FBckI7QUFDSCxLQXRENEI7QUF1RDdCLGNBQVUsa0JBQVMsSUFBVCxFQUFlO0FBQ3JCLGFBQUssUUFBTCxDQUFjLFFBQWQsQ0FBdUIsSUFBdkI7QUFDSCxLQXpENEI7QUEwRDdCLGlCQUFhLHVCQUFXO0FBQ3BCLGFBQUssUUFBTCxDQUFjLFFBQWQsQ0FBdUIsU0FBdkI7QUFDSCxLQTVENEI7QUE2RDdCLFlBQVEsZ0JBQVMsSUFBVCxFQUFlO0FBQ25CLGFBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsSUFBckI7QUFDSCxLQS9ENEI7QUFnRTdCLGFBQVMsaUJBQVMsSUFBVCxFQUFlO0FBQ3BCLGFBQUssUUFBTCxDQUFjLE1BQWQsQ0FBcUIsSUFBckIsRUFBMkIsS0FBM0I7QUFDSCxLQWxFNEI7QUFtRTdCLGVBQVcscUJBQVc7QUFDbEIsYUFBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixTQUFyQjtBQUNILEtBckU0QjtBQXNFN0IsZ0JBQVksc0JBQVc7QUFDbkIsYUFBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixTQUFyQixFQUFnQyxLQUFoQztBQUNILEtBeEU0QjtBQXlFN0IsWUFBUSxnQkFBUyxLQUFULEVBQWdCO0FBQ3BCLFlBQUcsVUFBVSxFQUFiLEVBQWlCO0FBQ2IsaUJBQUssUUFBTCxDQUFjLFVBQWQsQ0FBeUIsTUFBekIsQ0FBZ0M7QUFDNUIsdUJBQU8sS0FBSyxLQUFMLENBQVcsYUFEVTtBQUU1QiwwQkFBVSxVQUZrQjtBQUc1Qix1QkFBTztBQUhxQixhQUFoQztBQUtILFNBTkQsTUFNTTtBQUNGLGlCQUFLLFFBQUwsQ0FBYyxVQUFkLENBQXlCLE1BQXpCLENBQWdDLEVBQWhDO0FBQ0g7QUFDSixLQW5GNEI7QUFvRjdCLFVBQU0sY0FBUyxHQUFULEVBQWM7QUFDaEI7QUFDQSxhQUFLLFFBQUwsQ0FBYyxVQUFkLENBQXlCLElBQXpCLENBQThCO0FBQzFCLG1CQUFPLEtBQUssS0FBTCxDQUFXLGFBRFE7QUFFMUIsaUJBQUs7QUFGcUIsU0FBOUI7QUFJSCxLQTFGNEI7QUEyRjdCO0FBQ0E7QUFDQSxjQUFVLGtCQUFTLEtBQVQsRUFBZ0I7QUFDdEI7QUFDQTtBQUNBO0FBQ0E7OztBQUdBO0FBQ0EsWUFBSSxJQUFKLEVBQVUsWUFBVjs7QUFFQSxZQUFHLE9BQU8sTUFBTSxJQUFiLEtBQXNCLFdBQXpCLEVBQXNDO0FBQ2xDO0FBQ0EsbUJBQU8sS0FBUDtBQUNBO0FBQ0EsY0FBRSxJQUFGLEVBQVEsUUFBUixDQUFpQixRQUFqQixFQUEyQixJQUEzQixDQUFnQyxXQUFoQyxFQUE2QyxRQUE3QyxDQUFzRCxrQkFBdEQ7QUFDQSxpQkFBSyxZQUFMLEdBQW9CLEtBQXBCO0FBQ0gsU0FORCxNQU1NO0FBQ0Y7QUFDQSxtQkFBTyxNQUFNLElBQWI7QUFDQSxpQkFBSyxZQUFMLEdBQW9CLElBQXBCO0FBQ0g7QUFDRCx1QkFBZSxLQUFLLFFBQUwsQ0FBYyxRQUFkLENBQXVCLElBQXZCLENBQWY7QUFDQTtBQUNBOztBQUVBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxRQUFsQixLQUErQixVQUFsQyxFQUE4QztBQUMxQyxpQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixLQUFwQixFQUEyQixZQUEzQjs7QUFFQTtBQUNIO0FBQ0osS0EzSDRCO0FBNEg3QixhQUFTLGlCQUFTLEtBQVQsRUFBZ0I7QUFDckI7QUFDQTtBQUNILEtBL0g0QjtBQWdJN0IsY0FBVSxrQkFBUyxLQUFULEVBQWdCO0FBQ3RCO0FBQ0E7O0FBRUEsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLFFBQWxCLEtBQStCLFVBQWxDLEVBQThDO0FBQzFDO0FBQ0EsaUJBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsS0FBcEI7QUFDQTtBQUNIO0FBQ0osS0F6STRCO0FBMEk3QixnQkFBWSxvQkFBUyxLQUFULEVBQWdCO0FBQ3hCO0FBQ0E7QUFDQSxZQUFJLGVBQWUsS0FBSyxRQUFMLENBQWMsUUFBZCxDQUF1QixNQUFNLElBQTdCLENBQW5CO0FBQ0E7QUFDQSxZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsVUFBbEIsS0FBaUMsVUFBcEMsRUFBZ0Q7QUFDNUMsaUJBQUssS0FBTCxDQUFXLFVBQVgsQ0FBc0IsS0FBdEIsRUFBNkIsWUFBN0I7O0FBRUE7QUFDSDtBQUNKLEtBcEo0QjtBQXFKN0IsY0FBVSxrQkFBUyxLQUFULEVBQWdCO0FBQ3RCO0FBQ0E7QUFDQSxZQUFJLGVBQWUsS0FBSyxRQUFMLENBQWMsUUFBZCxDQUF1QixNQUFNLElBQTdCLENBQW5CO0FBQ0E7QUFDQSxZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsUUFBbEIsS0FBK0IsVUFBbEMsRUFBOEM7QUFDMUMsaUJBQUssS0FBTCxDQUFXLFFBQVgsQ0FBb0IsS0FBcEIsRUFBMkIsWUFBM0I7O0FBRUE7QUFDSDtBQUNKLEtBL0o0QjtBQWdLN0IsaUJBQWEscUJBQVMsS0FBVCxFQUFnQjtBQUN6QjtBQUNBO0FBQ0EsWUFBSSxlQUFlLEtBQUssUUFBTCxDQUFjLFFBQWQsQ0FBdUIsTUFBTSxVQUE3QixDQUFuQjtBQUNBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxXQUFsQixLQUFrQyxVQUFyQyxFQUFpRDtBQUM3QyxnQkFBSSxPQUFPLFlBQVg7QUFDQSxpQkFBSyxLQUFMLENBQVcsV0FBWCxDQUF1QixLQUF2QixFQUE4QixJQUE5Qjs7QUFFQTtBQUNIO0FBQ0osS0ExSzRCO0FBMks3QixZQUFRLGdCQUFTLEtBQVQsRUFBZ0I7QUFDcEI7QUFDQTtBQUNBLFlBQUksZUFBZSxLQUFLLFFBQUwsQ0FBYyxRQUFkLENBQXVCLE1BQU0sVUFBN0IsQ0FBbkI7QUFBQSxZQUNJLGFBQWEsS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixNQUFNLFVBQTNCLENBRGpCO0FBQUEsWUFFSSxhQUFhLEtBQUssUUFBTCxDQUFjLFFBQWQsQ0FBdUIsVUFBdkIsQ0FGakI7O0FBSUE7QUFDQSxZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsTUFBbEIsS0FBNkIsVUFBaEMsRUFBNEM7QUFDeEMsaUJBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsS0FBbEIsRUFBeUIsWUFBekIsRUFBdUMsVUFBdkM7O0FBRUE7QUFDSDtBQUNKLEtBeEw0QjtBQXlMN0IsWUFBUSxnQkFBUyxLQUFULEVBQWdCO0FBQ3BCO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsWUFBSSxlQUFlLEtBQUssUUFBTCxDQUFjLFFBQWQsQ0FBdUIsTUFBTSxVQUE3QixDQUFuQjtBQUFBLFlBQ0ksYUFBYSxLQUFLLFFBQUwsQ0FBYyxNQUFkLENBQXFCLE1BQU0sZUFBM0IsQ0FEakI7QUFBQSxZQUVJLGFBQWEsS0FBSyxRQUFMLENBQWMsUUFBZCxDQUF1QixVQUF2QixDQUZqQjs7QUFJQTtBQUNBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUFsQixLQUE2QixVQUFoQyxFQUE0QztBQUN4QyxpQkFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixLQUFsQixFQUF5QixZQUF6QixFQUF1QyxVQUF2Qzs7QUFFQTtBQUNIO0FBQ0osS0F4TTRCO0FBeU03QixlQUFXLG1CQUFTLEtBQVQsRUFBZ0I7QUFDdkI7QUFDQTtBQUNBLFlBQUksZUFBZSxLQUFLLFFBQUwsQ0FBYyxRQUFkLENBQXVCLE1BQU0sVUFBN0IsQ0FBbkI7QUFBQSxZQUNJLGFBQWEsS0FBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixNQUFNLGVBQTNCLENBRGpCO0FBQUEsWUFFSSxhQUFhLEtBQUssUUFBTCxDQUFjLFFBQWQsQ0FBdUIsVUFBdkIsQ0FGakI7O0FBSUEsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLFNBQWxCLEtBQWdDLFVBQW5DLEVBQStDO0FBQzNDLGlCQUFLLEtBQUwsQ0FBVyxTQUFYLENBQXFCLEtBQXJCLEVBQTRCLFlBQTVCLEVBQTBDLFVBQTFDOztBQUVBO0FBQ0g7QUFDSixLQXJONEI7QUFzTjdCLGdCQUFZLG9CQUFTLEtBQVQsRUFBZ0I7QUFDeEI7QUFDQTtBQUNILEtBek40QjtBQTBON0IsaUJBQWEscUJBQVMsS0FBVCxFQUFnQjtBQUN6QixnQkFBUSxHQUFSLENBQVksYUFBWjtBQUNILEtBNU40QjtBQTZON0IsYUFBUyxpQkFBUyxLQUFULEVBQWdCO0FBQ3JCOzs7Ozs7Ozs7O0FBV0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBLFlBQUcsS0FBSyxZQUFMLEtBQXNCLEtBQXpCLEVBQWdDO0FBQzVCLGdCQUFJLE9BQU8sRUFBRSxNQUFNLE1BQVIsRUFBZ0IsT0FBaEIsQ0FBd0IsU0FBeEIsQ0FBWDtBQUNBLGNBQUUsTUFBTSxNQUFSLEVBQWdCLFdBQWhCLENBQTRCLGtCQUE1QjtBQUNBLGlCQUFLLFFBQUwsQ0FBYyxPQUFkLENBQXNCLFFBQXRCLEVBQWdDLElBQWhDO0FBQ0g7QUFDRCxhQUFLLFlBQUwsR0FBb0IsS0FBcEI7QUFDSCxLQXBQNEI7QUFxUDdCLGdCQUFZLG9CQUFTLEtBQVQsRUFBZ0I7QUFDeEIsWUFBSSxPQUFPLEVBQUUsTUFBTSxNQUFSLEVBQWdCLE9BQWhCLENBQXdCLFNBQXhCLENBQVg7QUFBQSxZQUNJLGVBQWUsS0FBSyxRQUFMLENBQWMsUUFBZCxDQUF1QixJQUF2QixDQURuQjtBQUVBO0FBQ0E7O0FBRUEsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLFVBQWxCLEtBQWlDLFVBQXBDLEVBQWdEO0FBQzVDLGlCQUFLLEtBQUwsQ0FBVyxVQUFYLENBQXNCLEtBQXRCLEVBQTZCLFlBQTdCOztBQUVBO0FBQ0g7QUFDSixLQWhRNEI7QUFpUTdCLGdCQUFZLHNCQUFXO0FBQUEscUJBQ21HLEtBQUssS0FEeEc7QUFBQSxZQUNYLElBRFcsVUFDWCxJQURXO0FBQUEsWUFDTCxHQURLLFVBQ0wsR0FESztBQUFBLFlBQ0EsTUFEQSxVQUNBLE1BREE7QUFBQSxZQUNRLElBRFIsVUFDUSxJQURSO0FBQUEsWUFDYyxLQURkLFVBQ2MsS0FEZDtBQUFBLFlBQ3FCLFFBRHJCLFVBQ3FCLFFBRHJCO0FBQUEsWUFDK0IsYUFEL0IsVUFDK0IsYUFEL0I7QUFBQSxZQUM4QyxhQUQ5QyxVQUM4QyxhQUQ5QztBQUFBLFlBQzZELFVBRDdELFVBQzZELFVBRDdEO0FBQUEsWUFDeUUsV0FEekUsVUFDeUUsV0FEekU7QUFBQSxZQUNzRixRQUR0RixVQUNzRixRQUR0Rjs7O0FBR25CLFlBQUksVUFBVTtBQUNWLHdCQUFZLFVBREYsRUFDc0I7QUFDaEMsMkJBQWUsYUFGTDtBQUdWLHdCQUFZLEVBSEY7QUFJVix5QkFBYSxXQUpILENBSXNCO0FBSnRCLFNBQWQ7O0FBT0E7O0FBRUE7QUFDQTtBQUNBLFlBQUcsT0FBTyxHQUFQLEtBQWUsV0FBZixJQUE4QixpQkFBaUIsVUFBbEQsRUFBOEQ7O0FBRTFELGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBRSxZQUFZLElBQUksTUFBTSxJQUFOLENBQVcsc0JBQWYsQ0FBc0M7QUFDbEUsK0JBQVc7QUFDUCw4QkFBTTtBQUNGLGlDQUFNLFFBQVEsU0FBUyxJQUFqQixJQUF5QixLQUFLLE1BQUwsR0FBYyxDQUF4QyxHQUE2QyxPQUFPLEdBQXBELEdBQTBELEdBRDdEO0FBRUYsa0NBQU0sTUFGSjtBQUdGLHNDQUFVLE1BSFI7QUFJRixrQ0FBTSxJQUpKO0FBS0YseUNBQWE7QUFMWCx5QkFEQztBQVFQLHNDQUFjLHNCQUFTLElBQVQsRUFBZSxJQUFmLEVBQXFCO0FBQy9CLG1DQUFPLEtBQUssU0FBTCxDQUFlLElBQWYsQ0FBUDtBQUNIO0FBVk0scUJBRHVEO0FBYWxFLDRCQUFRO0FBQ0osK0JBQU87QUFDSCxzQ0FBVTtBQURQO0FBREg7QUFiMEQsaUJBQXRDLENBQWQsRUFBbEI7QUFvQkgsU0F0QkQsTUFzQk0sSUFBRyxPQUFPLEdBQVAsS0FBZSxXQUFmLElBQThCLGlCQUFpQixVQUFsRCxFQUE4RDtBQUNoRSxjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsWUFBWSxJQUFJLE1BQU0sSUFBTixDQUFXLHNCQUFmLENBQXNDO0FBQ2xFLCtCQUFXO0FBQ1AsOEJBQU07QUFDRixpQ0FBTSxRQUFRLFNBQVMsSUFBakIsSUFBeUIsS0FBSyxNQUFMLEdBQWMsQ0FBeEMsR0FBNkMsT0FBTyxHQUFwRCxHQUEwRCxHQUQ3RDtBQUVGLGtDQUFNLE1BRko7QUFHRixzQ0FBVSxNQUhSO0FBSUYsa0NBQU0sSUFKSjtBQUtGLHlDQUFhO0FBTFgseUJBREM7QUFRUCxzQ0FBYyxzQkFBUyxJQUFULEVBQWUsSUFBZixFQUFxQjtBQUMvQixtQ0FBTyxLQUFLLFNBQUwsQ0FBZSxJQUFmLENBQVA7QUFDSDtBQVZNLHFCQUR1RDtBQWFsRSw0QkFBUTtBQUNKLCtCQUFPO0FBQ0gsc0NBQVU7QUFEUCx5QkFESDtBQUlKLDhCQUFNLGNBQVMsUUFBVCxFQUFtQjtBQUNyQixxQ0FBUyxNQUFULEdBQWtCLEtBQUssS0FBTCxDQUFXLEtBQUssU0FBTCxDQUFlLFNBQVMsTUFBeEIsRUFBZ0MsS0FBaEMsQ0FBc0MsYUFBdEMsRUFBcUQsSUFBckQsQ0FBMEQsVUFBMUQsQ0FBWCxFQUFrRixLQUFwRztBQUNBLG1DQUFPLFNBQVMsTUFBaEI7QUFDSDtBQVBHO0FBYjBELGlCQUF0QyxDQUFkLEVBQWxCO0FBd0JILFNBekJLLE1BeUJBLElBQUcsT0FBTyxLQUFQLEtBQWlCLFdBQXBCLEVBQWlDO0FBQ25DLGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBRSxZQUFZLElBQUksTUFBTSxJQUFOLENBQVcsc0JBQWYsQ0FBc0M7QUFDbEUsMEJBQU0sS0FENEQ7QUFFbEUsNEJBQVE7QUFDSiwrQkFBTztBQUNILHNDQUFVO0FBRFA7QUFESDtBQUYwRCxpQkFBdEMsQ0FBZCxFQUFsQjtBQVFIOztBQUVEO0FBQ0EsWUFBRyxPQUFPLFFBQVAsS0FBb0IsV0FBdkIsRUFBb0M7QUFDaEMsY0FBRSxNQUFGLENBQVMsT0FBVCxFQUFrQixFQUFFLFVBQVUsUUFBWixFQUFsQjtBQUNIOztBQUVELGVBQU8sT0FBUDtBQUNILEtBL1U0QjtBQWdWN0IscUJBQWlCLDJCQUFXO0FBQ3hCO0FBQ0E7QUFDQSxlQUFPLEVBQUMsVUFBVSxLQUFYLEVBQWtCLFFBQVEsTUFBMUIsRUFBa0MsZUFBZSxNQUFqRCxFQUF5RCxlQUFlLE9BQXhFLEVBQWlGLGFBQWEsS0FBOUYsRUFBUDtBQUNILEtBcFY0QjtBQXFWN0Isd0JBQW9CLDhCQUFXO0FBQzNCO0FBQ0EsWUFBSSxLQUFLLEtBQUssS0FBTCxDQUFXLEVBQXBCO0FBQ0EsWUFBRyxPQUFPLEVBQVAsS0FBYyxXQUFqQixFQUE4QjtBQUMxQixpQkFBSyxLQUFLLE9BQUwsRUFBTDtBQUNIOztBQUVELGFBQUssRUFBTCxHQUFVLEVBQVY7QUFDSCxLQTdWNEI7QUE4VjdCLHVCQUFtQiw2QkFBVztBQUMxQjtBQUNBLGFBQUssU0FBTCxHQUFpQixFQUFFLE1BQUksS0FBSyxFQUFYLENBQWpCO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLEtBQUssU0FBTCxDQUFlLGFBQWYsQ0FBNkIsS0FBSyxVQUFMLEVBQTdCLEVBQWdELElBQWhELENBQXFELGVBQXJELENBQWhCOztBQUVBO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixRQUFuQixFQUE2QixLQUFLLFFBQWxDO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixPQUFuQixFQUE0QixLQUFLLE9BQWpDO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixRQUFuQixFQUE2QixLQUFLLFFBQWxDO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixVQUFuQixFQUErQixLQUFLLFVBQXBDO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixRQUFuQixFQUE2QixLQUFLLFFBQWxDOztBQUVBO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixXQUFuQixFQUFnQyxLQUFLLFdBQXJDO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixNQUFuQixFQUEyQixLQUFLLE1BQWhDO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixNQUFuQixFQUEyQixLQUFLLE1BQWhDO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixTQUFuQixFQUE4QixLQUFLLFNBQW5DO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixVQUFuQixFQUErQixLQUFLLFVBQXBDOztBQUVBO0FBQ0EsYUFBSyxTQUFMLENBQWUsRUFBZixDQUFrQixPQUFsQixFQUEyQixPQUEzQixFQUFvQyxLQUFLLE9BQXpDLEVBcEIwQixDQW9Cc0M7QUFDaEUsYUFBSyxTQUFMLENBQWUsSUFBZixDQUFvQixPQUFwQixFQUE2QixFQUE3QixDQUFnQyxVQUFoQyxFQUE0QyxLQUFLLFVBQWpEO0FBRUgsS0FyWDRCO0FBc1g3QixZQUFRLGtCQUFXO0FBQ2Y7QUFEZSxZQUVSLFNBRlEsR0FFSyxLQUFLLEtBRlYsQ0FFUixTQUZROzs7QUFJZixlQUNJLDZCQUFLLElBQUksS0FBSyxFQUFkLEVBQWtCLFdBQVcsV0FBVyxTQUFYLENBQTdCLEdBREo7QUFHSDtBQTdYNEIsQ0FBbEIsQ0FBZjs7QUFnWUEsT0FBTyxPQUFQLEdBQWlCLFFBQWpCOzs7QUNuWkE7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxRQUFRLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSSxZQUFZLFFBQVEsT0FBUixFQUFpQixTQUFqQztBQUNBLElBQUksYUFBYSxRQUFRLFlBQVIsQ0FBakI7O0FBRUEsSUFBSSxPQUFPLFFBQVEsa0JBQVIsQ0FBWDs7QUFFQSxJQUFJLFNBQVMsTUFBTSxXQUFOLENBQWtCO0FBQzNCLGlCQUFhLFFBRGM7QUFFM0IsZUFBVztBQUNQLFlBQUksVUFBVSxNQURQO0FBRVAsbUJBQVcsVUFBVSxNQUZkO0FBR1AsZUFBTyxVQUFVLE1BSFY7QUFJUCxpQkFBUyxVQUFVLElBSlo7QUFLUCxpQkFBUyxVQUFVLEtBTFosRUFLeUI7QUFDaEMsZUFBTyxVQUFVLElBTlY7QUFPUCxtQkFBVyxVQUFVLElBUGQ7QUFRUCxlQUFPLFVBQVUsU0FBVixDQUFvQixDQUN2QixVQUFVLE1BRGEsRUFFdkIsVUFBVSxNQUZhLENBQXBCLENBUkE7QUFZUCxnQkFBUSxVQUFVLFNBQVYsQ0FBb0IsQ0FDeEIsVUFBVSxNQURjLEVBRXhCLFVBQVUsTUFGYyxDQUFwQixDQVpEO0FBZ0JQLGtCQUFVLFVBQVUsTUFoQmI7QUFpQlAsbUJBQVcsVUFBVSxNQWpCZDtBQWtCUCxnQkFBUSxVQUFVLElBbEJYO0FBbUJQLGlCQUFTLFVBQVUsSUFuQlo7QUFvQlAsa0JBQVUsVUFBVSxJQXBCYjtBQXFCUCxxQkFBYSxVQUFVLElBckJoQjtBQXNCUCxtQkFBVyxVQUFVLElBdEJkO0FBdUJQLG1CQUFXLFVBQVUsSUF2QmQ7QUF3QlAsb0JBQVksVUFBVSxJQXhCZjtBQXlCUCxzQkFBYyxVQUFVO0FBekJqQixLQUZnQjtBQTZCM0IsUUFBSSxFQTdCdUI7QUE4QjNCO0FBQ0E7O0FBRUE7QUFDQTtBQUNBLFlBQVEsZ0JBQVMsQ0FBVCxFQUFZOztBQUVoQixZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsTUFBbEIsS0FBNkIsV0FBaEMsRUFBNkM7QUFDekMsaUJBQUssS0FBTCxDQUFXLE1BQVgsQ0FBa0IsQ0FBbEI7QUFDSDtBQUNKLEtBeEMwQjtBQXlDM0IsYUFBUyxpQkFBUyxDQUFULEVBQVk7O0FBRWpCLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxPQUFsQixLQUE4QixXQUFqQyxFQUE4QztBQUMxQyxpQkFBSyxLQUFMLENBQVcsT0FBWCxDQUFtQixDQUFuQjtBQUNIO0FBQ0osS0E5QzBCO0FBK0MzQixjQUFVLGtCQUFTLENBQVQsRUFBWTs7QUFFbEIsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLFFBQWxCLEtBQStCLFdBQWxDLEVBQStDO0FBQzNDLGlCQUFLLEtBQUwsQ0FBVyxRQUFYLENBQW9CLENBQXBCO0FBQ0g7QUFDSixLQXBEMEI7QUFxRDNCLGlCQUFhLHFCQUFTLENBQVQsRUFBWTs7QUFFckIsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLFdBQWxCLEtBQWtDLFdBQXJDLEVBQWtEO0FBQzlDLGlCQUFLLEtBQUwsQ0FBVyxXQUFYLENBQXVCLENBQXZCO0FBQ0g7QUFDSixLQTFEMEI7QUEyRDNCLGVBQVcsbUJBQVMsQ0FBVCxFQUFZOztBQUVuQixZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsU0FBbEIsS0FBZ0MsV0FBbkMsRUFBZ0Q7QUFDNUMsaUJBQUssS0FBTCxDQUFXLFNBQVgsQ0FBcUIsQ0FBckI7QUFDSDtBQUNKLEtBaEUwQjtBQWlFM0IsZUFBVyxtQkFBUyxDQUFULEVBQVk7O0FBRW5CLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxTQUFsQixLQUFnQyxXQUFuQyxFQUFnRDtBQUM1QyxpQkFBSyxLQUFMLENBQVcsU0FBWCxDQUFxQixDQUFyQjtBQUNIO0FBQ0osS0F0RTBCO0FBdUUzQixnQkFBWSxvQkFBUyxDQUFULEVBQVk7O0FBRXBCLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxVQUFsQixLQUFpQyxXQUFwQyxFQUFpRDtBQUM3QyxpQkFBSyxLQUFMLENBQVcsVUFBWCxDQUFzQixDQUF0QjtBQUNIO0FBQ0osS0E1RTBCO0FBNkUzQixrQkFBYyxzQkFBUyxDQUFULEVBQVk7O0FBRXRCLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxZQUFsQixLQUFtQyxXQUF0QyxFQUFtRDtBQUMvQyxpQkFBSyxLQUFMLENBQVcsWUFBWCxDQUF3QixDQUF4QjtBQUNIO0FBQ0osS0FsRjBCO0FBbUYzQixnQkFBWSxzQkFBVztBQUFBLHFCQUN1RSxLQUFLLEtBRDVFO0FBQUEsWUFDWCxLQURXLFVBQ1gsS0FEVztBQUFBLFlBQ0osT0FESSxVQUNKLE9BREk7QUFBQSxZQUNLLE9BREwsVUFDSyxPQURMO0FBQUEsWUFDYyxLQURkLFVBQ2MsS0FEZDtBQUFBLFlBQ3FCLFNBRHJCLFVBQ3FCLFNBRHJCO0FBQUEsWUFDZ0MsS0FEaEMsVUFDZ0MsS0FEaEM7QUFBQSxZQUN1QyxNQUR2QyxVQUN1QyxNQUR2QztBQUFBLFlBQytDLFFBRC9DLFVBQytDLFFBRC9DO0FBQUEsWUFDeUQsU0FEekQsVUFDeUQsU0FEekQ7OztBQUduQixZQUFJLFVBQVU7QUFDVixtQkFBTyxLQURHO0FBRVYscUJBQVMsT0FGQztBQUdWLHFCQUFTLE9BSEM7QUFJVixtQkFBTyxLQUpHO0FBS1YsdUJBQVcsU0FMRDtBQU1WLHNCQUFVLFFBTkE7QUFPVix1QkFBVztBQVBELFNBQWQ7O0FBVUE7QUFDQSxZQUFHLE9BQU8sS0FBUCxLQUFpQixXQUFwQixFQUFpQztBQUM3QixjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsT0FBTyxLQUFULEVBQWxCO0FBQ0g7O0FBRUQ7QUFDQSxZQUFHLE9BQU8sTUFBUCxLQUFrQixXQUFyQixFQUFrQztBQUM5QixjQUFFLE1BQUYsQ0FBUyxPQUFULEVBQWtCLEVBQUUsUUFBUSxNQUFWLEVBQWxCO0FBQ0g7O0FBRUQsZUFBTyxPQUFQO0FBQ0gsS0EzRzBCO0FBNEc5QixxQkFBaUIsMkJBQVc7QUFDM0I7QUFDQTtBQUNBLGVBQU8sRUFBRSxPQUFPLE9BQVQsRUFBa0IsU0FBUyxJQUEzQixFQUFpQyxTQUFTLENBQUMsS0FBRCxFQUFRLFVBQVIsRUFBb0IsVUFBcEIsRUFBZ0MsT0FBaEMsQ0FBMUMsRUFBb0YsT0FBTyxLQUEzRixFQUFrRyxXQUFXLElBQTdHLEVBQW1ILFVBQVUsR0FBN0gsRUFBa0ksV0FBVyxHQUE3SSxFQUFQO0FBQ0EsS0FoSDZCO0FBaUgzQix3QkFBb0IsOEJBQVc7QUFDM0I7QUFDQSxZQUFJLEtBQUssS0FBSyxLQUFMLENBQVcsRUFBcEI7QUFDQSxZQUFHLE9BQU8sRUFBUCxLQUFjLFdBQWpCLEVBQThCO0FBQzFCLGlCQUFLLEtBQUssT0FBTCxFQUFMO0FBQ0g7O0FBRUQsYUFBSyxFQUFMLEdBQVUsRUFBVjtBQUNILEtBekgwQjtBQTBIM0IsdUJBQW1CLDZCQUFXO0FBQzFCO0FBQ0EsYUFBSyxPQUFMLEdBQWUsRUFBRSxNQUFJLEtBQUssRUFBWCxDQUFmO0FBQ0EsYUFBSyxNQUFMLEdBQWMsS0FBSyxPQUFMLENBQWEsV0FBYixDQUF5QixLQUFLLFVBQUwsRUFBekIsRUFBNEMsSUFBNUMsQ0FBaUQsYUFBakQsQ0FBZDs7QUFFQTtBQUNBLGFBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsTUFBakIsRUFBeUIsS0FBSyxNQUE5QjtBQUNBLGFBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsT0FBakIsRUFBMEIsS0FBSyxPQUEvQjtBQUNBLGFBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsUUFBakIsRUFBMkIsS0FBSyxRQUFoQztBQUNBLGFBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsV0FBakIsRUFBOEIsS0FBSyxXQUFuQztBQUNBLGFBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsU0FBakIsRUFBNEIsS0FBSyxTQUFqQztBQUNBLGFBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsU0FBakIsRUFBNEIsS0FBSyxTQUFqQztBQUNBLGFBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsVUFBakIsRUFBNkIsS0FBSyxVQUFsQztBQUNBLGFBQUssTUFBTCxDQUFZLElBQVosQ0FBaUIsWUFBakIsRUFBK0IsS0FBSyxZQUFwQztBQUdILEtBMUkwQjtBQTJJM0IsWUFBUSxrQkFBVztBQUNmO0FBRGUsc0JBRWlCLEtBQUssS0FGdEI7QUFBQSxZQUVQLFNBRk8sV0FFUCxTQUZPO0FBQUEsWUFFSSxRQUZKLFdBRUksUUFGSjs7O0FBSWYsZUFDSTtBQUFBO0FBQUEsY0FBSyxJQUFJLEtBQUssRUFBZCxFQUFrQixXQUFXLFdBQVcsU0FBWCxDQUE3QjtBQUFxRDtBQUFyRCxTQURKO0FBR0g7QUFsSjBCLENBQWxCLENBQWI7O0FBcUpBLE9BQU8sT0FBUCxHQUFpQixNQUFqQjs7O0FDeEtBOzs7Ozs7Ozs7OztBQVdBOztBQUVBLElBQUksUUFBUSxRQUFRLE9BQVIsQ0FBWjs7QUFFQSxJQUFJLE1BQU0sTUFBTSxXQUFOLENBQWtCO0FBQ3BCLGlCQUFhLEtBRE87QUFFcEIsWUFBUSxrQkFBVztBQUNmO0FBQ0EsZUFDSTtBQUFBO0FBQUE7QUFBSyxpQkFBSyxLQUFMLENBQVc7QUFBaEIsU0FESjtBQUdIO0FBUG1CLENBQWxCLENBQVY7O0FBVUEsT0FBTyxPQUFQLEdBQWlCLEdBQWpCOzs7QUN6QkE7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxRQUFRLFFBQVEsT0FBUixDQUFaOztBQUVBLElBQUksYUFBYSxNQUFNLFdBQU4sQ0FBa0I7QUFDM0IsaUJBQWEsWUFEYztBQUUzQixZQUFRLGtCQUFXO0FBQ2Y7QUFDQSxlQUNJO0FBQUE7QUFBQTtBQUNLLGlCQUFLLEtBQUwsQ0FBVztBQURoQixTQURKO0FBS0g7QUFUMEIsQ0FBbEIsQ0FBakI7O0FBWUEsT0FBTyxPQUFQLEdBQWlCLFVBQWpCOzs7QUMzQkE7Ozs7Ozs7Ozs7O0FBV0E7O0FBRUEsSUFBSSxRQUFRLFFBQVEsT0FBUixDQUFaO0FBQ0EsSUFBSSxZQUFZLFFBQVEsT0FBUixFQUFpQixTQUFqQzs7QUFFQSxJQUFJLE9BQU8sUUFBUSxxQkFBUixDQUFYOztBQUVBLElBQUksV0FBVyxNQUFNLFdBQU4sQ0FBa0I7QUFDN0IsaUJBQWEsVUFEZ0I7QUFFN0IsZUFBVztBQUNQLG1CQUFXLFVBQVUsTUFEZDtBQUVQLHVCQUFlLFVBQVUsTUFGbEI7QUFHUCxxQkFBYSxVQUFVLEtBSGhCO0FBSVAsbUJBQVcsVUFBVSxTQUFWLENBQW9CLENBQzNCLFVBQVUsTUFEaUIsRUFFM0IsVUFBVSxJQUZpQixDQUFwQixDQUpKO0FBUVAscUJBQWEsVUFBVSxLQUFWLENBQWdCLENBQUMsTUFBRCxFQUFRLE9BQVIsRUFBZ0IsUUFBaEIsQ0FBaEIsQ0FSTjtBQVNQLGtCQUFVLFVBQVUsSUFUYjtBQVVQLG9CQUFZLFVBQVUsSUFWZjtBQVdQLGdCQUFRLFVBQVUsSUFYWDtBQVlQLHVCQUFlLFVBQVUsSUFabEI7QUFhUCxpQkFBUyxVQUFVO0FBYlosS0FGa0I7QUFpQjdCLFFBQUksRUFqQnlCO0FBa0I3QixZQUFRLGdCQUFTLEtBQVQsRUFBZ0I7QUFDcEIsYUFBSyxRQUFMLENBQWMsTUFBZCxDQUFxQixLQUFyQjtBQUNILEtBcEI0QjtBQXFCN0IsY0FBVSxrQkFBUyxDQUFULEVBQVk7QUFDbEI7QUFDQTtBQUNBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxRQUFsQixLQUErQixVQUFsQyxFQUE4QztBQUMxQyxpQkFBSyxLQUFMLENBQVcsUUFBWCxDQUFvQixDQUFwQixFQUQwQyxDQUNsQjtBQUMzQjtBQUNKLEtBM0I0QjtBQTRCN0IsZ0JBQVksb0JBQVMsQ0FBVCxFQUFZO0FBQ3BCO0FBQ0E7QUFDQSxZQUFHLE9BQU8sS0FBSyxLQUFMLENBQVcsVUFBbEIsS0FBaUMsVUFBcEMsRUFBZ0Q7QUFDNUMsaUJBQUssS0FBTCxDQUFXLFVBQVgsQ0FBc0IsQ0FBdEI7QUFDSDtBQUNKLEtBbEM0QjtBQW1DN0IsWUFBUSxnQkFBUyxDQUFULEVBQVk7QUFDaEI7QUFDQTtBQUNBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxNQUFsQixLQUE2QixVQUFoQyxFQUE0QztBQUN4QyxpQkFBSyxLQUFMLENBQVcsTUFBWCxDQUFrQixDQUFsQjtBQUNIO0FBQ0osS0F6QzRCO0FBMEM3QixtQkFBZSx1QkFBUyxDQUFULEVBQVk7QUFDdkI7QUFDQTtBQUNBLFlBQUcsT0FBTyxLQUFLLEtBQUwsQ0FBVyxhQUFsQixLQUFvQyxVQUF2QyxFQUFtRDtBQUMvQyxpQkFBSyxLQUFMLENBQVcsYUFBWCxDQUF5QixDQUF6QjtBQUNIO0FBQ0osS0FoRDRCO0FBaUQ3QixhQUFTLGlCQUFTLENBQVQsRUFBWTtBQUNqQjtBQUNBO0FBQ0EsWUFBRyxPQUFPLEtBQUssS0FBTCxDQUFXLE9BQWxCLEtBQThCLFVBQWpDLEVBQTZDO0FBQ3pDLGlCQUFLLEtBQUwsQ0FBVyxPQUFYLENBQW1CLENBQW5CO0FBQ0g7QUFDSixLQXZENEI7QUF3RDdCLGlCQUFhLHVCQUFXO0FBQ3BCLFlBQUksV0FBVyxLQUFLLEtBQUwsQ0FBVyxRQUExQjtBQUFBLFlBQ0ksUUFBUSxDQURaOztBQUdBLGVBQU8sTUFBTSxRQUFOLENBQWUsR0FBZixDQUFtQixRQUFuQixFQUE2QixVQUFDLEtBQUQsRUFBVztBQUMzQyxnQkFBRyxVQUFVLElBQWIsRUFBbUI7QUFDZix1QkFBTyxJQUFQO0FBQ0g7QUFDRCxnQkFBSSxNQUFKOztBQUVBO0FBQ0EsZ0JBQUcsWUFBWSxDQUFmLEVBQWtCO0FBQ2QseUJBQVMsTUFBTSxZQUFOLENBQW1CLEtBQW5CLEVBQTBCO0FBQy9CLDhCQUFVLE1BQU0sUUFBTixDQUFlLEdBQWYsQ0FBbUIsTUFBTSxLQUFOLENBQVksUUFBL0IsRUFBeUMsVUFBQyxHQUFELEVBQVM7QUFDeEQsNEJBQUcsUUFBUSxJQUFYLEVBQWlCO0FBQ2IsbUNBQU8sSUFBUDtBQUNIOztBQUVELCtCQUFPLE1BQU0sWUFBTixDQUFtQixHQUFuQixDQUFQO0FBQ0gscUJBTlM7QUFEcUIsaUJBQTFCLENBQVQ7QUFVSCxhQVhELE1BV007QUFDRjtBQUNBLHlCQUFTLE1BQU0sWUFBTixDQUFtQixLQUFuQixDQUFUO0FBQ0g7QUFDRCxtQkFBTyxNQUFQO0FBQ0gsU0F2Qk0sQ0FBUDtBQXdCSCxLQXBGNEI7QUFxRjdCLGdCQUFZLHNCQUFXO0FBQUEscUJBQzJCLEtBQUssS0FEaEM7QUFBQSxZQUNaLFNBRFksVUFDWixTQURZO0FBQUEsWUFDRCxXQURDLFVBQ0QsV0FEQztBQUFBLFlBQ1ksV0FEWixVQUNZLFdBRFo7O0FBR25COztBQUNBLFlBQUksVUFBSjtBQUNBLFlBQUcsT0FBTyxTQUFQLEtBQXFCLFNBQXJCLElBQWtDLGNBQWMsSUFBbkQsRUFBeUQ7QUFDckQseUJBQWE7QUFDVCxzQkFBTTtBQUNGLDZCQUFTO0FBRFA7QUFERyxhQUFiO0FBS0gsU0FORCxNQU1NO0FBQ0YseUJBQWEsU0FBYjtBQUNIOztBQUVELFlBQUksVUFBVTtBQUNWLHVCQUFXO0FBREQsU0FBZDs7QUFJQTtBQUNBLFlBQUcsV0FBSCxFQUFnQjtBQUNaLGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBQyxhQUFhLFdBQWQsRUFBbEI7QUFDSDs7QUFFRDtBQUNBLFlBQUcsV0FBSCxFQUFnQjtBQUNaLGNBQUUsTUFBRixDQUFTLE9BQVQsRUFBa0IsRUFBQyxhQUFhLFdBQWQsRUFBbEI7QUFDSDs7QUFFRCxlQUFPLE9BQVA7QUFDSCxLQW5INEI7QUFvSDdCLHFCQUFpQiwyQkFBVztBQUN4QjtBQUNBO0FBQ0EsZUFBTyxFQUFDLGVBQWUsQ0FBaEIsRUFBbUIsV0FBVyxLQUE5QixFQUFQO0FBQ0gsS0F4SDRCO0FBeUg3QixxQkFBaUIsMkJBQVc7O0FBRXhCLGVBQU8sRUFBUDtBQUNILEtBNUg0QjtBQTZIN0Isd0JBQW9CLDhCQUFXO0FBQzNCO0FBQ0EsWUFBSSxLQUFLLEtBQUssS0FBTCxDQUFXLEVBQXBCO0FBQ0EsWUFBRyxPQUFPLEVBQVAsS0FBYyxXQUFqQixFQUE4QjtBQUMxQixpQkFBSyxLQUFLLE9BQUwsRUFBTDtBQUNIOztBQUVELGFBQUssRUFBTCxHQUFVLEVBQVY7QUFDSCxLQXJJNEI7QUFzSTdCLHVCQUFtQiw2QkFBVztBQUMxQjtBQUNBLGFBQUssU0FBTCxHQUFpQixFQUFFLE1BQUksS0FBSyxFQUFYLENBQWpCO0FBQ0EsYUFBSyxRQUFMLEdBQWdCLEtBQUssU0FBTCxDQUFlLGFBQWYsQ0FBNkIsS0FBSyxVQUFMLEVBQTdCLEVBQWdELElBQWhELENBQXFELGVBQXJELENBQWhCOztBQUVBO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixRQUFuQixFQUE2QixLQUFLLFFBQWxDO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixVQUFuQixFQUErQixLQUFLLFVBQXBDO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixNQUFuQixFQUEyQixLQUFLLE1BQWhDO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixhQUFuQixFQUFrQyxLQUFLLGFBQXZDO0FBQ0EsYUFBSyxRQUFMLENBQWMsSUFBZCxDQUFtQixPQUFuQixFQUE0QixLQUFLLE9BQWpDOztBQUVBLGFBQUssTUFBTCxDQUFZLEtBQUssS0FBTCxDQUFXLGFBQXZCO0FBQ0gsS0FuSjRCO0FBb0o3QixZQUFRLGtCQUFXO0FBQ2Y7QUFDQSxlQUNJO0FBQUE7QUFBQSxjQUFLLElBQUksS0FBSyxFQUFkLEVBQWtCLFdBQVcsS0FBSyxLQUFMLENBQVcsU0FBeEM7QUFDSyxpQkFBSyxXQUFMO0FBREwsU0FESjtBQUtIO0FBM0o0QixDQUFsQixDQUFmOztBQThKQSxPQUFPLE9BQVAsR0FBaUIsUUFBakI7OztBQ2hMQTs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxJQUFJLFFBQVEsUUFBUSxPQUFSLENBQVo7O0FBRUEsSUFBSSxPQUFPLE1BQU0sV0FBTixDQUFrQjtBQUNyQixpQkFBYSxNQURRO0FBRXJCLFlBQVEsa0JBQVc7QUFDZjtBQUNBLGVBQ0k7QUFBQTtBQUFBO0FBQUssaUJBQUssS0FBTCxDQUFXO0FBQWhCLFNBREo7QUFHSDtBQVBvQixDQUFsQixDQUFYOztBQVVBLE9BQU8sT0FBUCxHQUFpQixJQUFqQjs7O0FDekJBOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxTQUFTLGVBQVQsQ0FBeUIsSUFBekIsRUFBK0I7QUFDOUIsS0FBSSxPQUFPLEtBQUssV0FBTCxFQUFYO0FBQUEsS0FDQyxRQUFRLFNBQVMsS0FBSyxRQUFMLEtBQWtCLENBQTNCLEVBQThCLENBQTlCLENBRFQ7QUFBQSxLQUVDLE1BQU0sU0FBUyxLQUFLLE9BQUwsRUFBVCxFQUF5QixDQUF6QixDQUZQO0FBQUEsS0FHQyxRQUFTLEtBQUssUUFBTCxLQUFrQixDQUFuQixHQUF3QixJQUF4QixHQUErQixTQUFTLEtBQUssUUFBTCxFQUFULEVBQTBCLENBQTFCLENBSHhDO0FBQUEsS0FHc0U7QUFDckUsV0FBVSxTQUFTLEtBQUssVUFBTCxFQUFULEVBQTRCLENBQTVCLENBSlg7QUFBQSxLQUtDLFVBQVUsU0FBUyxLQUFLLFVBQUwsRUFBVCxFQUE0QixDQUE1QixDQUxYO0FBQUEsS0FNQyxhQUFhLE9BQU8sR0FBUCxHQUFhLEtBQWIsR0FBcUIsR0FBckIsR0FBMkIsR0FBM0IsR0FBaUMsR0FBakMsR0FBdUMsS0FBdkMsR0FBK0MsR0FBL0MsR0FBcUQsT0FBckQsR0FBK0QsR0FBL0QsR0FBcUUsT0FObkY7O0FBUUEsUUFBTyxVQUFQO0FBQ0E7O0FBRUQsU0FBUyxRQUFULENBQWtCLENBQWxCLEVBQXFCLE1BQXJCLEVBQTZCO0FBQzVCLEtBQUksT0FBTyxFQUFYO0FBQ0EsS0FBSSxFQUFFLFFBQUYsRUFBSjs7QUFFQSxLQUFJLEVBQUUsTUFBRixHQUFXLE1BQWYsRUFBdUI7QUFDdEIsT0FBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLFNBQVMsRUFBRSxNQUEvQixFQUF1QyxHQUF2QyxFQUE0QztBQUMzQyxXQUFRLEdBQVI7QUFDQTtBQUNEOztBQUVELFFBQU8sT0FBTyxDQUFkO0FBQ0E7O0FBRUQsT0FBTyxPQUFQLEdBQWlCO0FBQ2hCLGtCQUFpQjtBQURELENBQWpCOzs7QUN2Q0E7Ozs7Ozs7Ozs7OztBQVlBOztBQUVBLFNBQVMsS0FBVCxDQUFlLENBQWYsRUFBa0I7QUFDakIsTUFBSSxXQUFKO0FBQ0EsTUFBRyxJQUFFLEVBQUwsRUFBUztBQUNSLGtCQUFjLE1BQUksQ0FBbEI7QUFDQSxHQUZELE1BRU07QUFDTCxrQkFBYyxFQUFFLFFBQUYsRUFBZDtBQUNBO0FBQ0QsU0FBTyxXQUFQO0FBQ0E7O0FBRUQsT0FBTyxPQUFQLEdBQWlCO0FBQ2hCLFNBQU87QUFEUyxDQUFqQjs7O0FDeEJBOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQSxJQUFJLGVBQWUsa0VBQW5COztBQUVBLFNBQVMsVUFBVCxDQUFvQixRQUFwQixFQUE4QjtBQUM3QixNQUFJLENBQUMsU0FBUyxLQUFULENBQWUsWUFBZixDQUFMLEVBQW1DO0FBQ2xDLFdBQU8sS0FBUDtBQUNBO0FBQ0QsU0FBTyxJQUFQO0FBQ0E7O0FBRUQsT0FBTyxPQUFQLEdBQWlCO0FBQ2hCLGNBQVk7QUFESSxDQUFqQjs7O0FDdkJBOzs7Ozs7Ozs7Ozs7QUFZQTs7QUFFQTs7QUFDQSxJQUFJLGVBQWUsU0FBZixZQUFlLENBQVMsSUFBVCxFQUFlLElBQWYsRUFBcUIsSUFBckIsRUFBMkIsUUFBM0IsRUFBcUMsUUFBckMsRUFBK0M7O0FBRWpFLEdBQUUsSUFBRixDQUFPLFVBQVAsQ0FBa0I7QUFDZCxRQUFNLElBRFE7QUFFZCxRQUFNLElBRlE7QUFHZCxRQUFNLElBSFE7QUFJZCxZQUFVLFFBSkk7QUFLZCxZQUFVO0FBQ2I7Ozs7Ozs7Ozs7Ozs7QUFOaUIsRUFBbEI7QUFxQkEsQ0F2QkQ7O0FBeUJBLElBQUksT0FBTyxTQUFQLElBQU8sQ0FBUyxHQUFULEVBQWM7QUFDeEI7QUFDQTtBQUNJO0FBQ0o7QUFDQTtBQUNBLFFBQU8sRUFBRSxJQUFGLENBQU8sSUFBUCxDQUFZLEtBQVosQ0FBa0IsSUFBbEIsRUFBd0IsU0FBeEIsQ0FBUDtBQUNBLENBUEQ7O0FBU0EsSUFBSSxZQUFZLFNBQVosU0FBWSxDQUFTLEdBQVQsRUFBYztBQUM3QjtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EsS0FBSSxPQUFPLENBQUMsR0FBRCxDQUFYO0FBQ0EsTUFBSyxJQUFJLElBQUUsQ0FBWCxFQUFjLElBQUUsVUFBVSxNQUExQixFQUFrQyxHQUFsQyxFQUF1QztBQUN0QyxPQUFLLElBQUwsQ0FBVSxFQUFFLElBQUYsQ0FBTyxJQUFQLENBQVksVUFBVSxDQUFWLENBQVosQ0FBVjtBQUNBO0FBQ0QsUUFBTyxFQUFFLElBQUYsQ0FBTyxJQUFQLENBQVksS0FBWixDQUFrQixJQUFsQixFQUF3QixJQUF4QixDQUFQO0FBQ0EsQ0FYRDs7QUFhQSxPQUFPLE9BQVAsR0FBaUI7QUFDaEIsZUFBYyxZQURFO0FBRWhCLE9BQU0sSUFGVTtBQUdoQixZQUFXO0FBSEssQ0FBakI7OztBQzlEQTs7Ozs7Ozs7Ozs7QUFXQTs7QUFFQSxTQUFTLE9BQVQsR0FBbUI7QUFDbEIsUUFBTyx1Q0FBdUMsT0FBdkMsQ0FBK0MsT0FBL0MsRUFBd0QsVUFBUyxDQUFULEVBQVk7QUFDMUUsTUFBSSxJQUFJLEtBQUssTUFBTCxLQUFjLEVBQWQsR0FBaUIsQ0FBekI7QUFBQSxNQUE0QixJQUFJLEtBQUssR0FBTCxHQUFXLENBQVgsR0FBZ0IsSUFBRSxHQUFGLEdBQU0sR0FBdEQ7QUFDQSxTQUFPLEVBQUUsUUFBRixDQUFXLEVBQVgsQ0FBUDtBQUNBLEVBSE0sQ0FBUDtBQUlBOztBQUVELFNBQVMsUUFBVCxHQUFvQjtBQUNuQixRQUFPLFFBQVEsS0FBSyxNQUFMLEdBQWMsUUFBZCxDQUF1QixFQUF2QixFQUEyQixNQUEzQixDQUFrQyxDQUFsQyxFQUFxQyxDQUFyQyxDQUFmO0FBQ0E7O0FBRUQsU0FBUyxLQUFULENBQWUsWUFBZixFQUE2QjtBQUM1QixLQUFJLFFBQVEsSUFBSSxJQUFKLEdBQVcsT0FBWCxFQUFaO0FBQ0EsTUFBSyxJQUFJLElBQUksQ0FBYixFQUFnQixJQUFJLEdBQXBCLEVBQXlCLEdBQXpCLEVBQThCO0FBQzdCLE1BQUssSUFBSSxJQUFKLEdBQVcsT0FBWCxLQUF1QixLQUF4QixHQUFpQyxZQUFyQyxFQUFtRDtBQUNsRDtBQUNBO0FBQ0Q7QUFDRDs7QUFFRDtBQUNBLFNBQVMsWUFBVCxDQUFzQixHQUF0QixFQUEyQixHQUEzQixFQUFnQztBQUMvQixLQUFJLEtBQUosQ0FBVSxRQUFWLEdBQW1CLHdCQUFuQjtBQUNBO0FBQ0EsS0FBSSxXQUFKLENBQWdCLEdBQWhCO0FBQ0E7O0FBRUQ7QUFDQTs7Ozs7O0FBTUEsU0FBUyxTQUFULENBQW1CLEtBQW5CLEVBQTBCLE1BQTFCLEVBQWtDLE1BQWxDLEVBQTBDLE9BQTFDLEVBQW1EO0FBQ2xELEtBQUksSUFBSSxJQUFJLElBQUosRUFBUjtBQUNBLEdBQUUsT0FBRixDQUFVLEVBQUUsT0FBRixLQUFlLFNBQU8sRUFBUCxHQUFVLEVBQVYsR0FBYSxFQUFiLEdBQWdCLElBQXpDO0FBQ0EsS0FBSSxVQUFVLGFBQWEsRUFBRSxXQUFGLEVBQTNCO0FBQ0EsS0FBSSxNQUFKO0FBQ0EsS0FBRyxPQUFILEVBQVk7QUFDWCxXQUFTLGNBQWMsT0FBdkI7QUFDQTtBQUNELFVBQVMsTUFBVCxHQUFrQixRQUFRLEdBQVIsR0FBYyxPQUFPLE1BQVAsQ0FBZCxHQUErQixZQUEvQixHQUE4QyxPQUE5QyxHQUF3RCxNQUExRTtBQUNBOztBQUVEO0FBQ0E7Ozs7Ozs7Ozs7Ozs7Ozs7OztBQWtCQSxTQUFTLFNBQVQsQ0FBbUIsS0FBbkIsRUFBMEI7QUFDekIsS0FBSSxPQUFPLFFBQVEsR0FBbkI7QUFDQSxLQUFJLEtBQUssU0FBUyxNQUFULENBQWdCLEtBQWhCLENBQXNCLEdBQXRCLENBQVQ7QUFDQSxNQUFJLElBQUksSUFBSSxDQUFaLEVBQWUsSUFBRyxHQUFHLE1BQXJCLEVBQTZCLEdBQTdCLEVBQWtDO0FBQ2pDLE1BQUksSUFBSSxHQUFHLENBQUgsQ0FBUjtBQUNBLFNBQU8sRUFBRSxNQUFGLENBQVMsQ0FBVCxLQUFhLEdBQXBCLEVBQXlCO0FBQ3hCLE9BQUksRUFBRSxTQUFGLENBQVksQ0FBWixDQUFKO0FBQ0E7QUFDRCxNQUFJLEVBQUUsT0FBRixDQUFVLElBQVYsS0FBbUIsQ0FBdkIsRUFBMEI7QUFDekIsVUFBTyxTQUFTLEVBQUUsU0FBRixDQUFZLEtBQUssTUFBakIsRUFBeUIsRUFBRSxNQUEzQixDQUFULENBQVA7QUFDQTtBQUNEO0FBQ0QsUUFBTyxFQUFQO0FBQ0E7O0FBRUQsT0FBTyxPQUFQLEdBQWlCO0FBQ2hCLFVBQVMsT0FETztBQUVoQixXQUFVLFFBRk07QUFHaEIsUUFBTyxLQUhTO0FBSWhCLFlBQVcsU0FKSztBQUtoQixZQUFXO0FBTEssQ0FBakI7O0FBUUE7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0E7QUFDQTtBQUNBO0FBQ0EiLCJmaWxlIjoiZ2VuZXJhdGVkLmpzIiwic291cmNlUm9vdCI6IiIsInNvdXJjZXNDb250ZW50IjpbIihmdW5jdGlvbiBlKHQsbixyKXtmdW5jdGlvbiBzKG8sdSl7aWYoIW5bb10pe2lmKCF0W29dKXt2YXIgYT10eXBlb2YgcmVxdWlyZT09XCJmdW5jdGlvblwiJiZyZXF1aXJlO2lmKCF1JiZhKXJldHVybiBhKG8sITApO2lmKGkpcmV0dXJuIGkobywhMCk7dmFyIGY9bmV3IEVycm9yKFwiQ2Fubm90IGZpbmQgbW9kdWxlICdcIitvK1wiJ1wiKTt0aHJvdyBmLmNvZGU9XCJNT0RVTEVfTk9UX0ZPVU5EXCIsZn12YXIgbD1uW29dPXtleHBvcnRzOnt9fTt0W29dWzBdLmNhbGwobC5leHBvcnRzLGZ1bmN0aW9uKGUpe3ZhciBuPXRbb11bMV1bZV07cmV0dXJuIHMobj9uOmUpfSxsLGwuZXhwb3J0cyxlLHQsbixyKX1yZXR1cm4gbltvXS5leHBvcnRzfXZhciBpPXR5cGVvZiByZXF1aXJlPT1cImZ1bmN0aW9uXCImJnJlcXVpcmU7Zm9yKHZhciBvPTA7bzxyLmxlbmd0aDtvKyspcyhyW29dKTtyZXR1cm4gc30pIiwiLy8gc2hpbSBmb3IgdXNpbmcgcHJvY2VzcyBpbiBicm93c2VyXG5cbnZhciBwcm9jZXNzID0gbW9kdWxlLmV4cG9ydHMgPSB7fTtcblxuLy8gY2FjaGVkIGZyb20gd2hhdGV2ZXIgZ2xvYmFsIGlzIHByZXNlbnQgc28gdGhhdCB0ZXN0IHJ1bm5lcnMgdGhhdCBzdHViIGl0XG4vLyBkb24ndCBicmVhayB0aGluZ3MuICBCdXQgd2UgbmVlZCB0byB3cmFwIGl0IGluIGEgdHJ5IGNhdGNoIGluIGNhc2UgaXQgaXNcbi8vIHdyYXBwZWQgaW4gc3RyaWN0IG1vZGUgY29kZSB3aGljaCBkb2Vzbid0IGRlZmluZSBhbnkgZ2xvYmFscy4gIEl0J3MgaW5zaWRlIGFcbi8vIGZ1bmN0aW9uIGJlY2F1c2UgdHJ5L2NhdGNoZXMgZGVvcHRpbWl6ZSBpbiBjZXJ0YWluIGVuZ2luZXMuXG5cbnZhciBjYWNoZWRTZXRUaW1lb3V0O1xudmFyIGNhY2hlZENsZWFyVGltZW91dDtcblxuKGZ1bmN0aW9uICgpIHtcbiAgdHJ5IHtcbiAgICBjYWNoZWRTZXRUaW1lb3V0ID0gc2V0VGltZW91dDtcbiAgfSBjYXRjaCAoZSkge1xuICAgIGNhY2hlZFNldFRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ3NldFRpbWVvdXQgaXMgbm90IGRlZmluZWQnKTtcbiAgICB9XG4gIH1cbiAgdHJ5IHtcbiAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBjbGVhclRpbWVvdXQ7XG4gIH0gY2F0Y2ggKGUpIHtcbiAgICBjYWNoZWRDbGVhclRpbWVvdXQgPSBmdW5jdGlvbiAoKSB7XG4gICAgICB0aHJvdyBuZXcgRXJyb3IoJ2NsZWFyVGltZW91dCBpcyBub3QgZGVmaW5lZCcpO1xuICAgIH1cbiAgfVxufSAoKSlcbnZhciBxdWV1ZSA9IFtdO1xudmFyIGRyYWluaW5nID0gZmFsc2U7XG52YXIgY3VycmVudFF1ZXVlO1xudmFyIHF1ZXVlSW5kZXggPSAtMTtcblxuZnVuY3Rpb24gY2xlYW5VcE5leHRUaWNrKCkge1xuICAgIGlmICghZHJhaW5pbmcgfHwgIWN1cnJlbnRRdWV1ZSkge1xuICAgICAgICByZXR1cm47XG4gICAgfVxuICAgIGRyYWluaW5nID0gZmFsc2U7XG4gICAgaWYgKGN1cnJlbnRRdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgcXVldWUgPSBjdXJyZW50UXVldWUuY29uY2F0KHF1ZXVlKTtcbiAgICB9IGVsc2Uge1xuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgfVxuICAgIGlmIChxdWV1ZS5sZW5ndGgpIHtcbiAgICAgICAgZHJhaW5RdWV1ZSgpO1xuICAgIH1cbn1cblxuZnVuY3Rpb24gZHJhaW5RdWV1ZSgpIHtcbiAgICBpZiAoZHJhaW5pbmcpIHtcbiAgICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICB2YXIgdGltZW91dCA9IGNhY2hlZFNldFRpbWVvdXQoY2xlYW5VcE5leHRUaWNrKTtcbiAgICBkcmFpbmluZyA9IHRydWU7XG5cbiAgICB2YXIgbGVuID0gcXVldWUubGVuZ3RoO1xuICAgIHdoaWxlKGxlbikge1xuICAgICAgICBjdXJyZW50UXVldWUgPSBxdWV1ZTtcbiAgICAgICAgcXVldWUgPSBbXTtcbiAgICAgICAgd2hpbGUgKCsrcXVldWVJbmRleCA8IGxlbikge1xuICAgICAgICAgICAgaWYgKGN1cnJlbnRRdWV1ZSkge1xuICAgICAgICAgICAgICAgIGN1cnJlbnRRdWV1ZVtxdWV1ZUluZGV4XS5ydW4oKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgICBxdWV1ZUluZGV4ID0gLTE7XG4gICAgICAgIGxlbiA9IHF1ZXVlLmxlbmd0aDtcbiAgICB9XG4gICAgY3VycmVudFF1ZXVlID0gbnVsbDtcbiAgICBkcmFpbmluZyA9IGZhbHNlO1xuICAgIGNhY2hlZENsZWFyVGltZW91dCh0aW1lb3V0KTtcbn1cblxucHJvY2Vzcy5uZXh0VGljayA9IGZ1bmN0aW9uIChmdW4pIHtcbiAgICB2YXIgYXJncyA9IG5ldyBBcnJheShhcmd1bWVudHMubGVuZ3RoIC0gMSk7XG4gICAgaWYgKGFyZ3VtZW50cy5sZW5ndGggPiAxKSB7XG4gICAgICAgIGZvciAodmFyIGkgPSAxOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgICAgICBhcmdzW2kgLSAxXSA9IGFyZ3VtZW50c1tpXTtcbiAgICAgICAgfVxuICAgIH1cbiAgICBxdWV1ZS5wdXNoKG5ldyBJdGVtKGZ1biwgYXJncykpO1xuICAgIGlmIChxdWV1ZS5sZW5ndGggPT09IDEgJiYgIWRyYWluaW5nKSB7XG4gICAgICAgIGNhY2hlZFNldFRpbWVvdXQoZHJhaW5RdWV1ZSwgMCk7XG4gICAgfVxufTtcblxuLy8gdjggbGlrZXMgcHJlZGljdGlibGUgb2JqZWN0c1xuZnVuY3Rpb24gSXRlbShmdW4sIGFycmF5KSB7XG4gICAgdGhpcy5mdW4gPSBmdW47XG4gICAgdGhpcy5hcnJheSA9IGFycmF5O1xufVxuSXRlbS5wcm90b3R5cGUucnVuID0gZnVuY3Rpb24gKCkge1xuICAgIHRoaXMuZnVuLmFwcGx5KG51bGwsIHRoaXMuYXJyYXkpO1xufTtcbnByb2Nlc3MudGl0bGUgPSAnYnJvd3Nlcic7XG5wcm9jZXNzLmJyb3dzZXIgPSB0cnVlO1xucHJvY2Vzcy5lbnYgPSB7fTtcbnByb2Nlc3MuYXJndiA9IFtdO1xucHJvY2Vzcy52ZXJzaW9uID0gJyc7IC8vIGVtcHR5IHN0cmluZyB0byBhdm9pZCByZWdleHAgaXNzdWVzXG5wcm9jZXNzLnZlcnNpb25zID0ge307XG5cbmZ1bmN0aW9uIG5vb3AoKSB7fVxuXG5wcm9jZXNzLm9uID0gbm9vcDtcbnByb2Nlc3MuYWRkTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5vbmNlID0gbm9vcDtcbnByb2Nlc3Mub2ZmID0gbm9vcDtcbnByb2Nlc3MucmVtb3ZlTGlzdGVuZXIgPSBub29wO1xucHJvY2Vzcy5yZW1vdmVBbGxMaXN0ZW5lcnMgPSBub29wO1xucHJvY2Vzcy5lbWl0ID0gbm9vcDtcblxucHJvY2Vzcy5iaW5kaW5nID0gZnVuY3Rpb24gKG5hbWUpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuYmluZGluZyBpcyBub3Qgc3VwcG9ydGVkJyk7XG59O1xuXG5wcm9jZXNzLmN3ZCA9IGZ1bmN0aW9uICgpIHsgcmV0dXJuICcvJyB9O1xucHJvY2Vzcy5jaGRpciA9IGZ1bmN0aW9uIChkaXIpIHtcbiAgICB0aHJvdyBuZXcgRXJyb3IoJ3Byb2Nlc3MuY2hkaXIgaXMgbm90IHN1cHBvcnRlZCcpO1xufTtcbnByb2Nlc3MudW1hc2sgPSBmdW5jdGlvbigpIHsgcmV0dXJuIDA7IH07XG4iLCIvKiFcbiAgQ29weXJpZ2h0IChjKSAyMDE2IEplZCBXYXRzb24uXG4gIExpY2Vuc2VkIHVuZGVyIHRoZSBNSVQgTGljZW5zZSAoTUlUKSwgc2VlXG4gIGh0dHA6Ly9qZWR3YXRzb24uZ2l0aHViLmlvL2NsYXNzbmFtZXNcbiovXG4vKiBnbG9iYWwgZGVmaW5lICovXG5cbihmdW5jdGlvbiAoKSB7XG5cdCd1c2Ugc3RyaWN0JztcblxuXHR2YXIgaGFzT3duID0ge30uaGFzT3duUHJvcGVydHk7XG5cblx0ZnVuY3Rpb24gY2xhc3NOYW1lcyAoKSB7XG5cdFx0dmFyIGNsYXNzZXMgPSBbXTtcblxuXHRcdGZvciAodmFyIGkgPSAwOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR2YXIgYXJnID0gYXJndW1lbnRzW2ldO1xuXHRcdFx0aWYgKCFhcmcpIGNvbnRpbnVlO1xuXG5cdFx0XHR2YXIgYXJnVHlwZSA9IHR5cGVvZiBhcmc7XG5cblx0XHRcdGlmIChhcmdUeXBlID09PSAnc3RyaW5nJyB8fCBhcmdUeXBlID09PSAnbnVtYmVyJykge1xuXHRcdFx0XHRjbGFzc2VzLnB1c2goYXJnKTtcblx0XHRcdH0gZWxzZSBpZiAoQXJyYXkuaXNBcnJheShhcmcpKSB7XG5cdFx0XHRcdGNsYXNzZXMucHVzaChjbGFzc05hbWVzLmFwcGx5KG51bGwsIGFyZykpO1xuXHRcdFx0fSBlbHNlIGlmIChhcmdUeXBlID09PSAnb2JqZWN0Jykge1xuXHRcdFx0XHRmb3IgKHZhciBrZXkgaW4gYXJnKSB7XG5cdFx0XHRcdFx0aWYgKGhhc093bi5jYWxsKGFyZywga2V5KSAmJiBhcmdba2V5XSkge1xuXHRcdFx0XHRcdFx0Y2xhc3Nlcy5wdXNoKGtleSk7XG5cdFx0XHRcdFx0fVxuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXG5cdFx0cmV0dXJuIGNsYXNzZXMuam9pbignICcpO1xuXHR9XG5cblx0aWYgKHR5cGVvZiBtb2R1bGUgIT09ICd1bmRlZmluZWQnICYmIG1vZHVsZS5leHBvcnRzKSB7XG5cdFx0bW9kdWxlLmV4cG9ydHMgPSBjbGFzc05hbWVzO1xuXHR9IGVsc2UgaWYgKHR5cGVvZiBkZWZpbmUgPT09ICdmdW5jdGlvbicgJiYgdHlwZW9mIGRlZmluZS5hbWQgPT09ICdvYmplY3QnICYmIGRlZmluZS5hbWQpIHtcblx0XHQvLyByZWdpc3RlciBhcyAnY2xhc3NuYW1lcycsIGNvbnNpc3RlbnQgd2l0aCBucG0gcGFja2FnZSBuYW1lXG5cdFx0ZGVmaW5lKCdjbGFzc25hbWVzJywgW10sIGZ1bmN0aW9uICgpIHtcblx0XHRcdHJldHVybiBjbGFzc05hbWVzO1xuXHRcdH0pO1xuXHR9IGVsc2Uge1xuXHRcdHdpbmRvdy5jbGFzc05hbWVzID0gY2xhc3NOYW1lcztcblx0fVxufSgpKTtcbiIsIid1c2Ugc3RyaWN0Jztcbi8qIGVzbGludC1kaXNhYmxlIG5vLXVudXNlZC12YXJzICovXG52YXIgaGFzT3duUHJvcGVydHkgPSBPYmplY3QucHJvdG90eXBlLmhhc093blByb3BlcnR5O1xudmFyIHByb3BJc0VudW1lcmFibGUgPSBPYmplY3QucHJvdG90eXBlLnByb3BlcnR5SXNFbnVtZXJhYmxlO1xuXG5mdW5jdGlvbiB0b09iamVjdCh2YWwpIHtcblx0aWYgKHZhbCA9PT0gbnVsbCB8fCB2YWwgPT09IHVuZGVmaW5lZCkge1xuXHRcdHRocm93IG5ldyBUeXBlRXJyb3IoJ09iamVjdC5hc3NpZ24gY2Fubm90IGJlIGNhbGxlZCB3aXRoIG51bGwgb3IgdW5kZWZpbmVkJyk7XG5cdH1cblxuXHRyZXR1cm4gT2JqZWN0KHZhbCk7XG59XG5cbmZ1bmN0aW9uIHNob3VsZFVzZU5hdGl2ZSgpIHtcblx0dHJ5IHtcblx0XHRpZiAoIU9iamVjdC5hc3NpZ24pIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBEZXRlY3QgYnVnZ3kgcHJvcGVydHkgZW51bWVyYXRpb24gb3JkZXIgaW4gb2xkZXIgVjggdmVyc2lvbnMuXG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD00MTE4XG5cdFx0dmFyIHRlc3QxID0gbmV3IFN0cmluZygnYWJjJyk7ICAvLyBlc2xpbnQtZGlzYWJsZS1saW5lXG5cdFx0dGVzdDFbNV0gPSAnZGUnO1xuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlOYW1lcyh0ZXN0MSlbMF0gPT09ICc1Jykge1xuXHRcdFx0cmV0dXJuIGZhbHNlO1xuXHRcdH1cblxuXHRcdC8vIGh0dHBzOi8vYnVncy5jaHJvbWl1bS5vcmcvcC92OC9pc3N1ZXMvZGV0YWlsP2lkPTMwNTZcblx0XHR2YXIgdGVzdDIgPSB7fTtcblx0XHRmb3IgKHZhciBpID0gMDsgaSA8IDEwOyBpKyspIHtcblx0XHRcdHRlc3QyWydfJyArIFN0cmluZy5mcm9tQ2hhckNvZGUoaSldID0gaTtcblx0XHR9XG5cdFx0dmFyIG9yZGVyMiA9IE9iamVjdC5nZXRPd25Qcm9wZXJ0eU5hbWVzKHRlc3QyKS5tYXAoZnVuY3Rpb24gKG4pIHtcblx0XHRcdHJldHVybiB0ZXN0MltuXTtcblx0XHR9KTtcblx0XHRpZiAob3JkZXIyLmpvaW4oJycpICE9PSAnMDEyMzQ1Njc4OScpIHtcblx0XHRcdHJldHVybiBmYWxzZTtcblx0XHR9XG5cblx0XHQvLyBodHRwczovL2J1Z3MuY2hyb21pdW0ub3JnL3AvdjgvaXNzdWVzL2RldGFpbD9pZD0zMDU2XG5cdFx0dmFyIHRlc3QzID0ge307XG5cdFx0J2FiY2RlZmdoaWprbG1ub3BxcnN0Jy5zcGxpdCgnJykuZm9yRWFjaChmdW5jdGlvbiAobGV0dGVyKSB7XG5cdFx0XHR0ZXN0M1tsZXR0ZXJdID0gbGV0dGVyO1xuXHRcdH0pO1xuXHRcdGlmIChPYmplY3Qua2V5cyhPYmplY3QuYXNzaWduKHt9LCB0ZXN0MykpLmpvaW4oJycpICE9PVxuXHRcdFx0XHQnYWJjZGVmZ2hpamtsbW5vcHFyc3QnKSB7XG5cdFx0XHRyZXR1cm4gZmFsc2U7XG5cdFx0fVxuXG5cdFx0cmV0dXJuIHRydWU7XG5cdH0gY2F0Y2ggKGUpIHtcblx0XHQvLyBXZSBkb24ndCBleHBlY3QgYW55IG9mIHRoZSBhYm92ZSB0byB0aHJvdywgYnV0IGJldHRlciB0byBiZSBzYWZlLlxuXHRcdHJldHVybiBmYWxzZTtcblx0fVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHNob3VsZFVzZU5hdGl2ZSgpID8gT2JqZWN0LmFzc2lnbiA6IGZ1bmN0aW9uICh0YXJnZXQsIHNvdXJjZSkge1xuXHR2YXIgZnJvbTtcblx0dmFyIHRvID0gdG9PYmplY3QodGFyZ2V0KTtcblx0dmFyIHN5bWJvbHM7XG5cblx0Zm9yICh2YXIgcyA9IDE7IHMgPCBhcmd1bWVudHMubGVuZ3RoOyBzKyspIHtcblx0XHRmcm9tID0gT2JqZWN0KGFyZ3VtZW50c1tzXSk7XG5cblx0XHRmb3IgKHZhciBrZXkgaW4gZnJvbSkge1xuXHRcdFx0aWYgKGhhc093blByb3BlcnR5LmNhbGwoZnJvbSwga2V5KSkge1xuXHRcdFx0XHR0b1trZXldID0gZnJvbVtrZXldO1xuXHRcdFx0fVxuXHRcdH1cblxuXHRcdGlmIChPYmplY3QuZ2V0T3duUHJvcGVydHlTeW1ib2xzKSB7XG5cdFx0XHRzeW1ib2xzID0gT2JqZWN0LmdldE93blByb3BlcnR5U3ltYm9scyhmcm9tKTtcblx0XHRcdGZvciAodmFyIGkgPSAwOyBpIDwgc3ltYm9scy5sZW5ndGg7IGkrKykge1xuXHRcdFx0XHRpZiAocHJvcElzRW51bWVyYWJsZS5jYWxsKGZyb20sIHN5bWJvbHNbaV0pKSB7XG5cdFx0XHRcdFx0dG9bc3ltYm9sc1tpXV0gPSBmcm9tW3N5bWJvbHNbaV1dO1xuXHRcdFx0XHR9XG5cdFx0XHR9XG5cdFx0fVxuXHR9XG5cblx0cmV0dXJuIHRvO1xufTtcbiIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBLZXlFc2NhcGVVdGlsc1xuICogXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG4vKipcbiAqIEVzY2FwZSBhbmQgd3JhcCBrZXkgc28gaXQgaXMgc2FmZSB0byB1c2UgYXMgYSByZWFjdGlkXG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSB0byBiZSBlc2NhcGVkLlxuICogQHJldHVybiB7c3RyaW5nfSB0aGUgZXNjYXBlZCBrZXkuXG4gKi9cblxuZnVuY3Rpb24gZXNjYXBlKGtleSkge1xuICB2YXIgZXNjYXBlUmVnZXggPSAvWz06XS9nO1xuICB2YXIgZXNjYXBlckxvb2t1cCA9IHtcbiAgICAnPSc6ICc9MCcsXG4gICAgJzonOiAnPTInXG4gIH07XG4gIHZhciBlc2NhcGVkU3RyaW5nID0gKCcnICsga2V5KS5yZXBsYWNlKGVzY2FwZVJlZ2V4LCBmdW5jdGlvbiAobWF0Y2gpIHtcbiAgICByZXR1cm4gZXNjYXBlckxvb2t1cFttYXRjaF07XG4gIH0pO1xuXG4gIHJldHVybiAnJCcgKyBlc2NhcGVkU3RyaW5nO1xufVxuXG4vKipcbiAqIFVuZXNjYXBlIGFuZCB1bndyYXAga2V5IGZvciBodW1hbi1yZWFkYWJsZSBkaXNwbGF5XG4gKlxuICogQHBhcmFtIHtzdHJpbmd9IGtleSB0byB1bmVzY2FwZS5cbiAqIEByZXR1cm4ge3N0cmluZ30gdGhlIHVuZXNjYXBlZCBrZXkuXG4gKi9cbmZ1bmN0aW9uIHVuZXNjYXBlKGtleSkge1xuICB2YXIgdW5lc2NhcGVSZWdleCA9IC8oPTB8PTIpL2c7XG4gIHZhciB1bmVzY2FwZXJMb29rdXAgPSB7XG4gICAgJz0wJzogJz0nLFxuICAgICc9Mic6ICc6J1xuICB9O1xuICB2YXIga2V5U3Vic3RyaW5nID0ga2V5WzBdID09PSAnLicgJiYga2V5WzFdID09PSAnJCcgPyBrZXkuc3Vic3RyaW5nKDIpIDoga2V5LnN1YnN0cmluZygxKTtcblxuICByZXR1cm4gKCcnICsga2V5U3Vic3RyaW5nKS5yZXBsYWNlKHVuZXNjYXBlUmVnZXgsIGZ1bmN0aW9uIChtYXRjaCkge1xuICAgIHJldHVybiB1bmVzY2FwZXJMb29rdXBbbWF0Y2hdO1xuICB9KTtcbn1cblxudmFyIEtleUVzY2FwZVV0aWxzID0ge1xuICBlc2NhcGU6IGVzY2FwZSxcbiAgdW5lc2NhcGU6IHVuZXNjYXBlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IEtleUVzY2FwZVV0aWxzOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBQb29sZWRDbGFzc1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIF9wcm9kSW52YXJpYW50ID0gcmVxdWlyZSgnLi9yZWFjdFByb2RJbnZhcmlhbnQnKTtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xuXG4vKipcbiAqIFN0YXRpYyBwb29sZXJzLiBTZXZlcmFsIGN1c3RvbSB2ZXJzaW9ucyBmb3IgZWFjaCBwb3RlbnRpYWwgbnVtYmVyIG9mXG4gKiBhcmd1bWVudHMuIEEgY29tcGxldGVseSBnZW5lcmljIHBvb2xlciBpcyBlYXN5IHRvIGltcGxlbWVudCwgYnV0IHdvdWxkXG4gKiByZXF1aXJlIGFjY2Vzc2luZyB0aGUgYGFyZ3VtZW50c2Agb2JqZWN0LiBJbiBlYWNoIG9mIHRoZXNlLCBgdGhpc2AgcmVmZXJzIHRvXG4gKiB0aGUgQ2xhc3MgaXRzZWxmLCBub3QgYW4gaW5zdGFuY2UuIElmIGFueSBvdGhlcnMgYXJlIG5lZWRlZCwgc2ltcGx5IGFkZCB0aGVtXG4gKiBoZXJlLCBvciBpbiB0aGVpciBvd24gZmlsZXMuXG4gKi9cbnZhciBvbmVBcmd1bWVudFBvb2xlciA9IGZ1bmN0aW9uIChjb3B5RmllbGRzRnJvbSkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBjb3B5RmllbGRzRnJvbSk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoY29weUZpZWxkc0Zyb20pO1xuICB9XG59O1xuXG52YXIgdHdvQXJndW1lbnRQb29sZXIgPSBmdW5jdGlvbiAoYTEsIGEyKSB7XG4gIHZhciBLbGFzcyA9IHRoaXM7XG4gIGlmIChLbGFzcy5pbnN0YW5jZVBvb2wubGVuZ3RoKSB7XG4gICAgdmFyIGluc3RhbmNlID0gS2xhc3MuaW5zdGFuY2VQb29sLnBvcCgpO1xuICAgIEtsYXNzLmNhbGwoaW5zdGFuY2UsIGExLCBhMik7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoYTEsIGEyKTtcbiAgfVxufTtcblxudmFyIHRocmVlQXJndW1lbnRQb29sZXIgPSBmdW5jdGlvbiAoYTEsIGEyLCBhMykge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBhMSwgYTIsIGEzKTtcbiAgICByZXR1cm4gaW5zdGFuY2U7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIG5ldyBLbGFzcyhhMSwgYTIsIGEzKTtcbiAgfVxufTtcblxudmFyIGZvdXJBcmd1bWVudFBvb2xlciA9IGZ1bmN0aW9uIChhMSwgYTIsIGEzLCBhNCkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBhMSwgYTIsIGEzLCBhNCk7XG4gICAgcmV0dXJuIGluc3RhbmNlO1xuICB9IGVsc2Uge1xuICAgIHJldHVybiBuZXcgS2xhc3MoYTEsIGEyLCBhMywgYTQpO1xuICB9XG59O1xuXG52YXIgZml2ZUFyZ3VtZW50UG9vbGVyID0gZnVuY3Rpb24gKGExLCBhMiwgYTMsIGE0LCBhNSkge1xuICB2YXIgS2xhc3MgPSB0aGlzO1xuICBpZiAoS2xhc3MuaW5zdGFuY2VQb29sLmxlbmd0aCkge1xuICAgIHZhciBpbnN0YW5jZSA9IEtsYXNzLmluc3RhbmNlUG9vbC5wb3AoKTtcbiAgICBLbGFzcy5jYWxsKGluc3RhbmNlLCBhMSwgYTIsIGEzLCBhNCwgYTUpO1xuICAgIHJldHVybiBpbnN0YW5jZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gbmV3IEtsYXNzKGExLCBhMiwgYTMsIGE0LCBhNSk7XG4gIH1cbn07XG5cbnZhciBzdGFuZGFyZFJlbGVhc2VyID0gZnVuY3Rpb24gKGluc3RhbmNlKSB7XG4gIHZhciBLbGFzcyA9IHRoaXM7XG4gICEoaW5zdGFuY2UgaW5zdGFuY2VvZiBLbGFzcykgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnVHJ5aW5nIHRvIHJlbGVhc2UgYW4gaW5zdGFuY2UgaW50byBhIHBvb2wgb2YgYSBkaWZmZXJlbnQgdHlwZS4nKSA6IF9wcm9kSW52YXJpYW50KCcyNScpIDogdm9pZCAwO1xuICBpbnN0YW5jZS5kZXN0cnVjdG9yKCk7XG4gIGlmIChLbGFzcy5pbnN0YW5jZVBvb2wubGVuZ3RoIDwgS2xhc3MucG9vbFNpemUpIHtcbiAgICBLbGFzcy5pbnN0YW5jZVBvb2wucHVzaChpbnN0YW5jZSk7XG4gIH1cbn07XG5cbnZhciBERUZBVUxUX1BPT0xfU0laRSA9IDEwO1xudmFyIERFRkFVTFRfUE9PTEVSID0gb25lQXJndW1lbnRQb29sZXI7XG5cbi8qKlxuICogQXVnbWVudHMgYENvcHlDb25zdHJ1Y3RvcmAgdG8gYmUgYSBwb29sYWJsZSBjbGFzcywgYXVnbWVudGluZyBvbmx5IHRoZSBjbGFzc1xuICogaXRzZWxmIChzdGF0aWNhbGx5KSBub3QgYWRkaW5nIGFueSBwcm90b3R5cGljYWwgZmllbGRzLiBBbnkgQ29weUNvbnN0cnVjdG9yXG4gKiB5b3UgZ2l2ZSB0aGlzIG1heSBoYXZlIGEgYHBvb2xTaXplYCBwcm9wZXJ0eSwgYW5kIHdpbGwgbG9vayBmb3IgYVxuICogcHJvdG90eXBpY2FsIGBkZXN0cnVjdG9yYCBvbiBpbnN0YW5jZXMuXG4gKlxuICogQHBhcmFtIHtGdW5jdGlvbn0gQ29weUNvbnN0cnVjdG9yIENvbnN0cnVjdG9yIHRoYXQgY2FuIGJlIHVzZWQgdG8gcmVzZXQuXG4gKiBAcGFyYW0ge0Z1bmN0aW9ufSBwb29sZXIgQ3VzdG9taXphYmxlIHBvb2xlci5cbiAqL1xudmFyIGFkZFBvb2xpbmdUbyA9IGZ1bmN0aW9uIChDb3B5Q29uc3RydWN0b3IsIHBvb2xlcikge1xuICB2YXIgTmV3S2xhc3MgPSBDb3B5Q29uc3RydWN0b3I7XG4gIE5ld0tsYXNzLmluc3RhbmNlUG9vbCA9IFtdO1xuICBOZXdLbGFzcy5nZXRQb29sZWQgPSBwb29sZXIgfHwgREVGQVVMVF9QT09MRVI7XG4gIGlmICghTmV3S2xhc3MucG9vbFNpemUpIHtcbiAgICBOZXdLbGFzcy5wb29sU2l6ZSA9IERFRkFVTFRfUE9PTF9TSVpFO1xuICB9XG4gIE5ld0tsYXNzLnJlbGVhc2UgPSBzdGFuZGFyZFJlbGVhc2VyO1xuICByZXR1cm4gTmV3S2xhc3M7XG59O1xuXG52YXIgUG9vbGVkQ2xhc3MgPSB7XG4gIGFkZFBvb2xpbmdUbzogYWRkUG9vbGluZ1RvLFxuICBvbmVBcmd1bWVudFBvb2xlcjogb25lQXJndW1lbnRQb29sZXIsXG4gIHR3b0FyZ3VtZW50UG9vbGVyOiB0d29Bcmd1bWVudFBvb2xlcixcbiAgdGhyZWVBcmd1bWVudFBvb2xlcjogdGhyZWVBcmd1bWVudFBvb2xlcixcbiAgZm91ckFyZ3VtZW50UG9vbGVyOiBmb3VyQXJndW1lbnRQb29sZXIsXG4gIGZpdmVBcmd1bWVudFBvb2xlcjogZml2ZUFyZ3VtZW50UG9vbGVyXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFBvb2xlZENsYXNzOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIF9hc3NpZ24gPSByZXF1aXJlKCdvYmplY3QtYXNzaWduJyk7XG5cbnZhciBSZWFjdENoaWxkcmVuID0gcmVxdWlyZSgnLi9SZWFjdENoaWxkcmVuJyk7XG52YXIgUmVhY3RDb21wb25lbnQgPSByZXF1aXJlKCcuL1JlYWN0Q29tcG9uZW50Jyk7XG52YXIgUmVhY3RQdXJlQ29tcG9uZW50ID0gcmVxdWlyZSgnLi9SZWFjdFB1cmVDb21wb25lbnQnKTtcbnZhciBSZWFjdENsYXNzID0gcmVxdWlyZSgnLi9SZWFjdENsYXNzJyk7XG52YXIgUmVhY3RET01GYWN0b3JpZXMgPSByZXF1aXJlKCcuL1JlYWN0RE9NRmFjdG9yaWVzJyk7XG52YXIgUmVhY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9SZWFjdEVsZW1lbnQnKTtcbnZhciBSZWFjdFByb3BUeXBlcyA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZXMnKTtcbnZhciBSZWFjdFZlcnNpb24gPSByZXF1aXJlKCcuL1JlYWN0VmVyc2lvbicpO1xuXG52YXIgb25seUNoaWxkID0gcmVxdWlyZSgnLi9vbmx5Q2hpbGQnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG52YXIgY3JlYXRlRWxlbWVudCA9IFJlYWN0RWxlbWVudC5jcmVhdGVFbGVtZW50O1xudmFyIGNyZWF0ZUZhY3RvcnkgPSBSZWFjdEVsZW1lbnQuY3JlYXRlRmFjdG9yeTtcbnZhciBjbG9uZUVsZW1lbnQgPSBSZWFjdEVsZW1lbnQuY2xvbmVFbGVtZW50O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICB2YXIgUmVhY3RFbGVtZW50VmFsaWRhdG9yID0gcmVxdWlyZSgnLi9SZWFjdEVsZW1lbnRWYWxpZGF0b3InKTtcbiAgY3JlYXRlRWxlbWVudCA9IFJlYWN0RWxlbWVudFZhbGlkYXRvci5jcmVhdGVFbGVtZW50O1xuICBjcmVhdGVGYWN0b3J5ID0gUmVhY3RFbGVtZW50VmFsaWRhdG9yLmNyZWF0ZUZhY3Rvcnk7XG4gIGNsb25lRWxlbWVudCA9IFJlYWN0RWxlbWVudFZhbGlkYXRvci5jbG9uZUVsZW1lbnQ7XG59XG5cbnZhciBfX3NwcmVhZCA9IF9hc3NpZ247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciB3YXJuZWQgPSBmYWxzZTtcbiAgX19zcHJlYWQgPSBmdW5jdGlvbiAoKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcod2FybmVkLCAnUmVhY3QuX19zcHJlYWQgaXMgZGVwcmVjYXRlZCBhbmQgc2hvdWxkIG5vdCBiZSB1c2VkLiBVc2UgJyArICdPYmplY3QuYXNzaWduIGRpcmVjdGx5IG9yIGFub3RoZXIgaGVscGVyIGZ1bmN0aW9uIHdpdGggc2ltaWxhciAnICsgJ3NlbWFudGljcy4gWW91IG1heSBiZSBzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byB5b3VyIGNvbXBpbGVyLiAnICsgJ1NlZSBodHRwczovL2ZiLm1lL3JlYWN0LXNwcmVhZC1kZXByZWNhdGlvbiBmb3IgbW9yZSBkZXRhaWxzLicpIDogdm9pZCAwO1xuICAgIHdhcm5lZCA9IHRydWU7XG4gICAgcmV0dXJuIF9hc3NpZ24uYXBwbHkobnVsbCwgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxudmFyIFJlYWN0ID0ge1xuXG4gIC8vIE1vZGVyblxuXG4gIENoaWxkcmVuOiB7XG4gICAgbWFwOiBSZWFjdENoaWxkcmVuLm1hcCxcbiAgICBmb3JFYWNoOiBSZWFjdENoaWxkcmVuLmZvckVhY2gsXG4gICAgY291bnQ6IFJlYWN0Q2hpbGRyZW4uY291bnQsXG4gICAgdG9BcnJheTogUmVhY3RDaGlsZHJlbi50b0FycmF5LFxuICAgIG9ubHk6IG9ubHlDaGlsZFxuICB9LFxuXG4gIENvbXBvbmVudDogUmVhY3RDb21wb25lbnQsXG4gIFB1cmVDb21wb25lbnQ6IFJlYWN0UHVyZUNvbXBvbmVudCxcblxuICBjcmVhdGVFbGVtZW50OiBjcmVhdGVFbGVtZW50LFxuICBjbG9uZUVsZW1lbnQ6IGNsb25lRWxlbWVudCxcbiAgaXNWYWxpZEVsZW1lbnQ6IFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudCxcblxuICAvLyBDbGFzc2ljXG5cbiAgUHJvcFR5cGVzOiBSZWFjdFByb3BUeXBlcyxcbiAgY3JlYXRlQ2xhc3M6IFJlYWN0Q2xhc3MuY3JlYXRlQ2xhc3MsXG4gIGNyZWF0ZUZhY3Rvcnk6IGNyZWF0ZUZhY3RvcnksXG4gIGNyZWF0ZU1peGluOiBmdW5jdGlvbiAobWl4aW4pIHtcbiAgICAvLyBDdXJyZW50bHkgYSBub29wLiBXaWxsIGJlIHVzZWQgdG8gdmFsaWRhdGUgYW5kIHRyYWNlIG1peGlucy5cbiAgICByZXR1cm4gbWl4aW47XG4gIH0sXG5cbiAgLy8gVGhpcyBsb29rcyBET00gc3BlY2lmaWMgYnV0IHRoZXNlIGFyZSBhY3R1YWxseSBpc29tb3JwaGljIGhlbHBlcnNcbiAgLy8gc2luY2UgdGhleSBhcmUganVzdCBnZW5lcmF0aW5nIERPTSBzdHJpbmdzLlxuICBET006IFJlYWN0RE9NRmFjdG9yaWVzLFxuXG4gIHZlcnNpb246IFJlYWN0VmVyc2lvbixcblxuICAvLyBEZXByZWNhdGVkIGhvb2sgZm9yIEpTWCBzcHJlYWQsIGRvbid0IHVzZSB0aGlzIGZvciBhbnl0aGluZy5cbiAgX19zcHJlYWQ6IF9fc3ByZWFkXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdENoaWxkcmVuXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUG9vbGVkQ2xhc3MgPSByZXF1aXJlKCcuL1Bvb2xlZENsYXNzJyk7XG52YXIgUmVhY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9SZWFjdEVsZW1lbnQnKTtcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgdHJhdmVyc2VBbGxDaGlsZHJlbiA9IHJlcXVpcmUoJy4vdHJhdmVyc2VBbGxDaGlsZHJlbicpO1xuXG52YXIgdHdvQXJndW1lbnRQb29sZXIgPSBQb29sZWRDbGFzcy50d29Bcmd1bWVudFBvb2xlcjtcbnZhciBmb3VyQXJndW1lbnRQb29sZXIgPSBQb29sZWRDbGFzcy5mb3VyQXJndW1lbnRQb29sZXI7XG5cbnZhciB1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCA9IC9cXC8rL2c7XG5mdW5jdGlvbiBlc2NhcGVVc2VyUHJvdmlkZWRLZXkodGV4dCkge1xuICByZXR1cm4gKCcnICsgdGV4dCkucmVwbGFjZSh1c2VyUHJvdmlkZWRLZXlFc2NhcGVSZWdleCwgJyQmLycpO1xufVxuXG4vKipcbiAqIFBvb2xlZENsYXNzIHJlcHJlc2VudGluZyB0aGUgYm9va2tlZXBpbmcgYXNzb2NpYXRlZCB3aXRoIHBlcmZvcm1pbmcgYSBjaGlsZFxuICogdHJhdmVyc2FsLiBBbGxvd3MgYXZvaWRpbmcgYmluZGluZyBjYWxsYmFja3MuXG4gKlxuICogQGNvbnN0cnVjdG9yIEZvckVhY2hCb29rS2VlcGluZ1xuICogQHBhcmFtIHshZnVuY3Rpb259IGZvckVhY2hGdW5jdGlvbiBGdW5jdGlvbiB0byBwZXJmb3JtIHRyYXZlcnNhbCB3aXRoLlxuICogQHBhcmFtIHs/Kn0gZm9yRWFjaENvbnRleHQgQ29udGV4dCB0byBwZXJmb3JtIGNvbnRleHQgd2l0aC5cbiAqL1xuZnVuY3Rpb24gRm9yRWFjaEJvb2tLZWVwaW5nKGZvckVhY2hGdW5jdGlvbiwgZm9yRWFjaENvbnRleHQpIHtcbiAgdGhpcy5mdW5jID0gZm9yRWFjaEZ1bmN0aW9uO1xuICB0aGlzLmNvbnRleHQgPSBmb3JFYWNoQ29udGV4dDtcbiAgdGhpcy5jb3VudCA9IDA7XG59XG5Gb3JFYWNoQm9va0tlZXBpbmcucHJvdG90eXBlLmRlc3RydWN0b3IgPSBmdW5jdGlvbiAoKSB7XG4gIHRoaXMuZnVuYyA9IG51bGw7XG4gIHRoaXMuY29udGV4dCA9IG51bGw7XG4gIHRoaXMuY291bnQgPSAwO1xufTtcblBvb2xlZENsYXNzLmFkZFBvb2xpbmdUbyhGb3JFYWNoQm9va0tlZXBpbmcsIHR3b0FyZ3VtZW50UG9vbGVyKTtcblxuZnVuY3Rpb24gZm9yRWFjaFNpbmdsZUNoaWxkKGJvb2tLZWVwaW5nLCBjaGlsZCwgbmFtZSkge1xuICB2YXIgZnVuYyA9IGJvb2tLZWVwaW5nLmZ1bmM7XG4gIHZhciBjb250ZXh0ID0gYm9va0tlZXBpbmcuY29udGV4dDtcblxuICBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xufVxuXG4vKipcbiAqIEl0ZXJhdGVzIHRocm91Z2ggY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhcyBgcHJvcHMuY2hpbGRyZW5gLlxuICpcbiAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5jaGlsZHJlbi5mb3JlYWNoXG4gKlxuICogVGhlIHByb3ZpZGVkIGZvckVhY2hGdW5jKGNoaWxkLCBpbmRleCkgd2lsbCBiZSBjYWxsZWQgZm9yIGVhY2hcbiAqIGxlYWYgY2hpbGQuXG4gKlxuICogQHBhcmFtIHs/Kn0gY2hpbGRyZW4gQ2hpbGRyZW4gdHJlZSBjb250YWluZXIuXG4gKiBAcGFyYW0ge2Z1bmN0aW9uKCosIGludCl9IGZvckVhY2hGdW5jXG4gKiBAcGFyYW0geyp9IGZvckVhY2hDb250ZXh0IENvbnRleHQgZm9yIGZvckVhY2hDb250ZXh0LlxuICovXG5mdW5jdGlvbiBmb3JFYWNoQ2hpbGRyZW4oY2hpbGRyZW4sIGZvckVhY2hGdW5jLCBmb3JFYWNoQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiBjaGlsZHJlbjtcbiAgfVxuICB2YXIgdHJhdmVyc2VDb250ZXh0ID0gRm9yRWFjaEJvb2tLZWVwaW5nLmdldFBvb2xlZChmb3JFYWNoRnVuYywgZm9yRWFjaENvbnRleHQpO1xuICB0cmF2ZXJzZUFsbENoaWxkcmVuKGNoaWxkcmVuLCBmb3JFYWNoU2luZ2xlQ2hpbGQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIEZvckVhY2hCb29rS2VlcGluZy5yZWxlYXNlKHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbi8qKlxuICogUG9vbGVkQ2xhc3MgcmVwcmVzZW50aW5nIHRoZSBib29ra2VlcGluZyBhc3NvY2lhdGVkIHdpdGggcGVyZm9ybWluZyBhIGNoaWxkXG4gKiBtYXBwaW5nLiBBbGxvd3MgYXZvaWRpbmcgYmluZGluZyBjYWxsYmFja3MuXG4gKlxuICogQGNvbnN0cnVjdG9yIE1hcEJvb2tLZWVwaW5nXG4gKiBAcGFyYW0geyEqfSBtYXBSZXN1bHQgT2JqZWN0IGNvbnRhaW5pbmcgdGhlIG9yZGVyZWQgbWFwIG9mIHJlc3VsdHMuXG4gKiBAcGFyYW0geyFmdW5jdGlvbn0gbWFwRnVuY3Rpb24gRnVuY3Rpb24gdG8gcGVyZm9ybSBtYXBwaW5nIHdpdGguXG4gKiBAcGFyYW0gez8qfSBtYXBDb250ZXh0IENvbnRleHQgdG8gcGVyZm9ybSBtYXBwaW5nIHdpdGguXG4gKi9cbmZ1bmN0aW9uIE1hcEJvb2tLZWVwaW5nKG1hcFJlc3VsdCwga2V5UHJlZml4LCBtYXBGdW5jdGlvbiwgbWFwQ29udGV4dCkge1xuICB0aGlzLnJlc3VsdCA9IG1hcFJlc3VsdDtcbiAgdGhpcy5rZXlQcmVmaXggPSBrZXlQcmVmaXg7XG4gIHRoaXMuZnVuYyA9IG1hcEZ1bmN0aW9uO1xuICB0aGlzLmNvbnRleHQgPSBtYXBDb250ZXh0O1xuICB0aGlzLmNvdW50ID0gMDtcbn1cbk1hcEJvb2tLZWVwaW5nLnByb3RvdHlwZS5kZXN0cnVjdG9yID0gZnVuY3Rpb24gKCkge1xuICB0aGlzLnJlc3VsdCA9IG51bGw7XG4gIHRoaXMua2V5UHJlZml4ID0gbnVsbDtcbiAgdGhpcy5mdW5jID0gbnVsbDtcbiAgdGhpcy5jb250ZXh0ID0gbnVsbDtcbiAgdGhpcy5jb3VudCA9IDA7XG59O1xuUG9vbGVkQ2xhc3MuYWRkUG9vbGluZ1RvKE1hcEJvb2tLZWVwaW5nLCBmb3VyQXJndW1lbnRQb29sZXIpO1xuXG5mdW5jdGlvbiBtYXBTaW5nbGVDaGlsZEludG9Db250ZXh0KGJvb2tLZWVwaW5nLCBjaGlsZCwgY2hpbGRLZXkpIHtcbiAgdmFyIHJlc3VsdCA9IGJvb2tLZWVwaW5nLnJlc3VsdDtcbiAgdmFyIGtleVByZWZpeCA9IGJvb2tLZWVwaW5nLmtleVByZWZpeDtcbiAgdmFyIGZ1bmMgPSBib29rS2VlcGluZy5mdW5jO1xuICB2YXIgY29udGV4dCA9IGJvb2tLZWVwaW5nLmNvbnRleHQ7XG5cblxuICB2YXIgbWFwcGVkQ2hpbGQgPSBmdW5jLmNhbGwoY29udGV4dCwgY2hpbGQsIGJvb2tLZWVwaW5nLmNvdW50KyspO1xuICBpZiAoQXJyYXkuaXNBcnJheShtYXBwZWRDaGlsZCkpIHtcbiAgICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKG1hcHBlZENoaWxkLCByZXN1bHQsIGNoaWxkS2V5LCBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zQXJndW1lbnQpO1xuICB9IGVsc2UgaWYgKG1hcHBlZENoaWxkICE9IG51bGwpIHtcbiAgICBpZiAoUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KG1hcHBlZENoaWxkKSkge1xuICAgICAgbWFwcGVkQ2hpbGQgPSBSZWFjdEVsZW1lbnQuY2xvbmVBbmRSZXBsYWNlS2V5KG1hcHBlZENoaWxkLFxuICAgICAgLy8gS2VlcCBib3RoIHRoZSAobWFwcGVkKSBhbmQgb2xkIGtleXMgaWYgdGhleSBkaWZmZXIsIGp1c3QgYXNcbiAgICAgIC8vIHRyYXZlcnNlQWxsQ2hpbGRyZW4gdXNlZCB0byBkbyBmb3Igb2JqZWN0cyBhcyBjaGlsZHJlblxuICAgICAga2V5UHJlZml4ICsgKG1hcHBlZENoaWxkLmtleSAmJiAoIWNoaWxkIHx8IGNoaWxkLmtleSAhPT0gbWFwcGVkQ2hpbGQua2V5KSA/IGVzY2FwZVVzZXJQcm92aWRlZEtleShtYXBwZWRDaGlsZC5rZXkpICsgJy8nIDogJycpICsgY2hpbGRLZXkpO1xuICAgIH1cbiAgICByZXN1bHQucHVzaChtYXBwZWRDaGlsZCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gbWFwSW50b1dpdGhLZXlQcmVmaXhJbnRlcm5hbChjaGlsZHJlbiwgYXJyYXksIHByZWZpeCwgZnVuYywgY29udGV4dCkge1xuICB2YXIgZXNjYXBlZFByZWZpeCA9ICcnO1xuICBpZiAocHJlZml4ICE9IG51bGwpIHtcbiAgICBlc2NhcGVkUHJlZml4ID0gZXNjYXBlVXNlclByb3ZpZGVkS2V5KHByZWZpeCkgKyAnLyc7XG4gIH1cbiAgdmFyIHRyYXZlcnNlQ29udGV4dCA9IE1hcEJvb2tLZWVwaW5nLmdldFBvb2xlZChhcnJheSwgZXNjYXBlZFByZWZpeCwgZnVuYywgY29udGV4dCk7XG4gIHRyYXZlcnNlQWxsQ2hpbGRyZW4oY2hpbGRyZW4sIG1hcFNpbmdsZUNoaWxkSW50b0NvbnRleHQsIHRyYXZlcnNlQ29udGV4dCk7XG4gIE1hcEJvb2tLZWVwaW5nLnJlbGVhc2UodHJhdmVyc2VDb250ZXh0KTtcbn1cblxuLyoqXG4gKiBNYXBzIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy90b3AtbGV2ZWwtYXBpLmh0bWwjcmVhY3QuY2hpbGRyZW4ubWFwXG4gKlxuICogVGhlIHByb3ZpZGVkIG1hcEZ1bmN0aW9uKGNoaWxkLCBrZXksIGluZGV4KSB3aWxsIGJlIGNhbGxlZCBmb3IgZWFjaFxuICogbGVhZiBjaGlsZC5cbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7ZnVuY3Rpb24oKiwgaW50KX0gZnVuYyBUaGUgbWFwIGZ1bmN0aW9uLlxuICogQHBhcmFtIHsqfSBjb250ZXh0IENvbnRleHQgZm9yIG1hcEZ1bmN0aW9uLlxuICogQHJldHVybiB7b2JqZWN0fSBPYmplY3QgY29udGFpbmluZyB0aGUgb3JkZXJlZCBtYXAgb2YgcmVzdWx0cy5cbiAqL1xuZnVuY3Rpb24gbWFwQ2hpbGRyZW4oY2hpbGRyZW4sIGZ1bmMsIGNvbnRleHQpIHtcbiAgaWYgKGNoaWxkcmVuID09IG51bGwpIHtcbiAgICByZXR1cm4gY2hpbGRyZW47XG4gIH1cbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCByZXN1bHQsIG51bGwsIGZ1bmMsIGNvbnRleHQpO1xuICByZXR1cm4gcmVzdWx0O1xufVxuXG5mdW5jdGlvbiBmb3JFYWNoU2luZ2xlQ2hpbGREdW1teSh0cmF2ZXJzZUNvbnRleHQsIGNoaWxkLCBuYW1lKSB7XG4gIHJldHVybiBudWxsO1xufVxuXG4vKipcbiAqIENvdW50IHRoZSBudW1iZXIgb2YgY2hpbGRyZW4gdGhhdCBhcmUgdHlwaWNhbGx5IHNwZWNpZmllZCBhc1xuICogYHByb3BzLmNoaWxkcmVuYC5cbiAqXG4gKiBTZWUgaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy90b3AtbGV2ZWwtYXBpLmh0bWwjcmVhY3QuY2hpbGRyZW4uY291bnRcbiAqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEByZXR1cm4ge251bWJlcn0gVGhlIG51bWJlciBvZiBjaGlsZHJlbi5cbiAqL1xuZnVuY3Rpb24gY291bnRDaGlsZHJlbihjaGlsZHJlbiwgY29udGV4dCkge1xuICByZXR1cm4gdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgZm9yRWFjaFNpbmdsZUNoaWxkRHVtbXksIG51bGwpO1xufVxuXG4vKipcbiAqIEZsYXR0ZW4gYSBjaGlsZHJlbiBvYmplY3QgKHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYCkgYW5kXG4gKiByZXR1cm4gYW4gYXJyYXkgd2l0aCBhcHByb3ByaWF0ZWx5IHJlLWtleWVkIGNoaWxkcmVuLlxuICpcbiAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5jaGlsZHJlbi50b2FycmF5XG4gKi9cbmZ1bmN0aW9uIHRvQXJyYXkoY2hpbGRyZW4pIHtcbiAgdmFyIHJlc3VsdCA9IFtdO1xuICBtYXBJbnRvV2l0aEtleVByZWZpeEludGVybmFsKGNoaWxkcmVuLCByZXN1bHQsIG51bGwsIGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNBcmd1bWVudCk7XG4gIHJldHVybiByZXN1bHQ7XG59XG5cbnZhciBSZWFjdENoaWxkcmVuID0ge1xuICBmb3JFYWNoOiBmb3JFYWNoQ2hpbGRyZW4sXG4gIG1hcDogbWFwQ2hpbGRyZW4sXG4gIG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWw6IG1hcEludG9XaXRoS2V5UHJlZml4SW50ZXJuYWwsXG4gIGNvdW50OiBjb3VudENoaWxkcmVuLFxuICB0b0FycmF5OiB0b0FycmF5XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0Q2hpbGRyZW47IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0Q2xhc3NcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfcHJvZEludmFyaWFudCA9IHJlcXVpcmUoJy4vcmVhY3RQcm9kSW52YXJpYW50JyksXG4gICAgX2Fzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxudmFyIFJlYWN0Q29tcG9uZW50ID0gcmVxdWlyZSgnLi9SZWFjdENvbXBvbmVudCcpO1xudmFyIFJlYWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vUmVhY3RFbGVtZW50Jyk7XG52YXIgUmVhY3RQcm9wVHlwZUxvY2F0aW9ucyA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZUxvY2F0aW9ucycpO1xudmFyIFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzID0gcmVxdWlyZSgnLi9SZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcycpO1xudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0gcmVxdWlyZSgnLi9SZWFjdE5vb3BVcGRhdGVRdWV1ZScpO1xuXG52YXIgZW1wdHlPYmplY3QgPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eU9iamVjdCcpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIGtleU1pcnJvciA9IHJlcXVpcmUoJ2ZianMvbGliL2tleU1pcnJvcicpO1xudmFyIGtleU9mID0gcmVxdWlyZSgnZmJqcy9saWIva2V5T2YnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG52YXIgTUlYSU5TX0tFWSA9IGtleU9mKHsgbWl4aW5zOiBudWxsIH0pO1xuXG4vKipcbiAqIFBvbGljaWVzIHRoYXQgZGVzY3JpYmUgbWV0aG9kcyBpbiBgUmVhY3RDbGFzc0ludGVyZmFjZWAuXG4gKi9cbnZhciBTcGVjUG9saWN5ID0ga2V5TWlycm9yKHtcbiAgLyoqXG4gICAqIFRoZXNlIG1ldGhvZHMgbWF5IGJlIGRlZmluZWQgb25seSBvbmNlIGJ5IHRoZSBjbGFzcyBzcGVjaWZpY2F0aW9uIG9yIG1peGluLlxuICAgKi9cbiAgREVGSU5FX09OQ0U6IG51bGwsXG4gIC8qKlxuICAgKiBUaGVzZSBtZXRob2RzIG1heSBiZSBkZWZpbmVkIGJ5IGJvdGggdGhlIGNsYXNzIHNwZWNpZmljYXRpb24gYW5kIG1peGlucy5cbiAgICogU3Vic2VxdWVudCBkZWZpbml0aW9ucyB3aWxsIGJlIGNoYWluZWQuIFRoZXNlIG1ldGhvZHMgbXVzdCByZXR1cm4gdm9pZC5cbiAgICovXG4gIERFRklORV9NQU5ZOiBudWxsLFxuICAvKipcbiAgICogVGhlc2UgbWV0aG9kcyBhcmUgb3ZlcnJpZGluZyB0aGUgYmFzZSBjbGFzcy5cbiAgICovXG4gIE9WRVJSSURFX0JBU0U6IG51bGwsXG4gIC8qKlxuICAgKiBUaGVzZSBtZXRob2RzIGFyZSBzaW1pbGFyIHRvIERFRklORV9NQU5ZLCBleGNlcHQgd2UgYXNzdW1lIHRoZXkgcmV0dXJuXG4gICAqIG9iamVjdHMuIFdlIHRyeSB0byBtZXJnZSB0aGUga2V5cyBvZiB0aGUgcmV0dXJuIHZhbHVlcyBvZiBhbGwgdGhlIG1peGVkIGluXG4gICAqIGZ1bmN0aW9ucy4gSWYgdGhlcmUgaXMgYSBrZXkgY29uZmxpY3Qgd2UgdGhyb3cuXG4gICAqL1xuICBERUZJTkVfTUFOWV9NRVJHRUQ6IG51bGxcbn0pO1xuXG52YXIgaW5qZWN0ZWRNaXhpbnMgPSBbXTtcblxuLyoqXG4gKiBDb21wb3NpdGUgY29tcG9uZW50cyBhcmUgaGlnaGVyLWxldmVsIGNvbXBvbmVudHMgdGhhdCBjb21wb3NlIG90aGVyIGNvbXBvc2l0ZVxuICogb3IgaG9zdCBjb21wb25lbnRzLlxuICpcbiAqIFRvIGNyZWF0ZSBhIG5ldyB0eXBlIG9mIGBSZWFjdENsYXNzYCwgcGFzcyBhIHNwZWNpZmljYXRpb24gb2ZcbiAqIHlvdXIgbmV3IGNsYXNzIHRvIGBSZWFjdC5jcmVhdGVDbGFzc2AuIFRoZSBvbmx5IHJlcXVpcmVtZW50IG9mIHlvdXIgY2xhc3NcbiAqIHNwZWNpZmljYXRpb24gaXMgdGhhdCB5b3UgaW1wbGVtZW50IGEgYHJlbmRlcmAgbWV0aG9kLlxuICpcbiAqICAgdmFyIE15Q29tcG9uZW50ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICogICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gKiAgICAgICByZXR1cm4gPGRpdj5IZWxsbyBXb3JsZDwvZGl2PjtcbiAqICAgICB9XG4gKiAgIH0pO1xuICpcbiAqIFRoZSBjbGFzcyBzcGVjaWZpY2F0aW9uIHN1cHBvcnRzIGEgc3BlY2lmaWMgcHJvdG9jb2wgb2YgbWV0aG9kcyB0aGF0IGhhdmVcbiAqIHNwZWNpYWwgbWVhbmluZyAoZS5nLiBgcmVuZGVyYCkuIFNlZSBgUmVhY3RDbGFzc0ludGVyZmFjZWAgZm9yXG4gKiBtb3JlIHRoZSBjb21wcmVoZW5zaXZlIHByb3RvY29sLiBBbnkgb3RoZXIgcHJvcGVydGllcyBhbmQgbWV0aG9kcyBpbiB0aGVcbiAqIGNsYXNzIHNwZWNpZmljYXRpb24gd2lsbCBiZSBhdmFpbGFibGUgb24gdGhlIHByb3RvdHlwZS5cbiAqXG4gKiBAaW50ZXJmYWNlIFJlYWN0Q2xhc3NJbnRlcmZhY2VcbiAqIEBpbnRlcm5hbFxuICovXG52YXIgUmVhY3RDbGFzc0ludGVyZmFjZSA9IHtcblxuICAvKipcbiAgICogQW4gYXJyYXkgb2YgTWl4aW4gb2JqZWN0cyB0byBpbmNsdWRlIHdoZW4gZGVmaW5pbmcgeW91ciBjb21wb25lbnQuXG4gICAqXG4gICAqIEB0eXBlIHthcnJheX1cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBtaXhpbnM6IFNwZWNQb2xpY3kuREVGSU5FX01BTlksXG5cbiAgLyoqXG4gICAqIEFuIG9iamVjdCBjb250YWluaW5nIHByb3BlcnRpZXMgYW5kIG1ldGhvZHMgdGhhdCBzaG91bGQgYmUgZGVmaW5lZCBvblxuICAgKiB0aGUgY29tcG9uZW50J3MgY29uc3RydWN0b3IgaW5zdGVhZCBvZiBpdHMgcHJvdG90eXBlIChzdGF0aWMgbWV0aG9kcykuXG4gICAqXG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqIEBvcHRpb25hbFxuICAgKi9cbiAgc3RhdGljczogU3BlY1BvbGljeS5ERUZJTkVfTUFOWSxcblxuICAvKipcbiAgICogRGVmaW5pdGlvbiBvZiBwcm9wIHR5cGVzIGZvciB0aGlzIGNvbXBvbmVudC5cbiAgICpcbiAgICogQHR5cGUge29iamVjdH1cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBwcm9wVHlwZXM6IFNwZWNQb2xpY3kuREVGSU5FX01BTlksXG5cbiAgLyoqXG4gICAqIERlZmluaXRpb24gb2YgY29udGV4dCB0eXBlcyBmb3IgdGhpcyBjb21wb25lbnQuXG4gICAqXG4gICAqIEB0eXBlIHtvYmplY3R9XG4gICAqIEBvcHRpb25hbFxuICAgKi9cbiAgY29udGV4dFR5cGVzOiBTcGVjUG9saWN5LkRFRklORV9NQU5ZLFxuXG4gIC8qKlxuICAgKiBEZWZpbml0aW9uIG9mIGNvbnRleHQgdHlwZXMgdGhpcyBjb21wb25lbnQgc2V0cyBmb3IgaXRzIGNoaWxkcmVuLlxuICAgKlxuICAgKiBAdHlwZSB7b2JqZWN0fVxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGNoaWxkQ29udGV4dFR5cGVzOiBTcGVjUG9saWN5LkRFRklORV9NQU5ZLFxuXG4gIC8vID09PT0gRGVmaW5pdGlvbiBtZXRob2RzID09PT1cblxuICAvKipcbiAgICogSW52b2tlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgbW91bnRlZC4gVmFsdWVzIGluIHRoZSBtYXBwaW5nIHdpbGwgYmUgc2V0IG9uXG4gICAqIGB0aGlzLnByb3BzYCBpZiB0aGF0IHByb3AgaXMgbm90IHNwZWNpZmllZCAoaS5lLiB1c2luZyBhbiBgaW5gIGNoZWNrKS5cbiAgICpcbiAgICogVGhpcyBtZXRob2QgaXMgaW52b2tlZCBiZWZvcmUgYGdldEluaXRpYWxTdGF0ZWAgYW5kIHRoZXJlZm9yZSBjYW5ub3QgcmVseVxuICAgKiBvbiBgdGhpcy5zdGF0ZWAgb3IgdXNlIGB0aGlzLnNldFN0YXRlYC5cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGdldERlZmF1bHRQcm9wczogU3BlY1BvbGljeS5ERUZJTkVfTUFOWV9NRVJHRUQsXG5cbiAgLyoqXG4gICAqIEludm9rZWQgb25jZSBiZWZvcmUgdGhlIGNvbXBvbmVudCBpcyBtb3VudGVkLiBUaGUgcmV0dXJuIHZhbHVlIHdpbGwgYmUgdXNlZFxuICAgKiBhcyB0aGUgaW5pdGlhbCB2YWx1ZSBvZiBgdGhpcy5zdGF0ZWAuXG4gICAqXG4gICAqICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICogICAgIHJldHVybiB7XG4gICAqICAgICAgIGlzT246IGZhbHNlLFxuICAgKiAgICAgICBmb29CYXo6IG5ldyBCYXpGb28oKVxuICAgKiAgICAgfVxuICAgKiAgIH1cbiAgICpcbiAgICogQHJldHVybiB7b2JqZWN0fVxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGdldEluaXRpYWxTdGF0ZTogU3BlY1BvbGljeS5ERUZJTkVfTUFOWV9NRVJHRUQsXG5cbiAgLyoqXG4gICAqIEByZXR1cm4ge29iamVjdH1cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBnZXRDaGlsZENvbnRleHQ6IFNwZWNQb2xpY3kuREVGSU5FX01BTllfTUVSR0VELFxuXG4gIC8qKlxuICAgKiBVc2VzIHByb3BzIGZyb20gYHRoaXMucHJvcHNgIGFuZCBzdGF0ZSBmcm9tIGB0aGlzLnN0YXRlYCB0byByZW5kZXIgdGhlXG4gICAqIHN0cnVjdHVyZSBvZiB0aGUgY29tcG9uZW50LlxuICAgKlxuICAgKiBObyBndWFyYW50ZWVzIGFyZSBtYWRlIGFib3V0IHdoZW4gb3IgaG93IG9mdGVuIHRoaXMgbWV0aG9kIGlzIGludm9rZWQsIHNvXG4gICAqIGl0IG11c3Qgbm90IGhhdmUgc2lkZSBlZmZlY3RzLlxuICAgKlxuICAgKiAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAqICAgICB2YXIgbmFtZSA9IHRoaXMucHJvcHMubmFtZTtcbiAgICogICAgIHJldHVybiA8ZGl2PkhlbGxvLCB7bmFtZX0hPC9kaXY+O1xuICAgKiAgIH1cbiAgICpcbiAgICogQHJldHVybiB7UmVhY3RDb21wb25lbnR9XG4gICAqIEBub3NpZGVlZmZlY3RzXG4gICAqIEByZXF1aXJlZFxuICAgKi9cbiAgcmVuZGVyOiBTcGVjUG9saWN5LkRFRklORV9PTkNFLFxuXG4gIC8vID09PT0gRGVsZWdhdGUgbWV0aG9kcyA9PT09XG5cbiAgLyoqXG4gICAqIEludm9rZWQgd2hlbiB0aGUgY29tcG9uZW50IGlzIGluaXRpYWxseSBjcmVhdGVkIGFuZCBhYm91dCB0byBiZSBtb3VudGVkLlxuICAgKiBUaGlzIG1heSBoYXZlIHNpZGUgZWZmZWN0cywgYnV0IGFueSBleHRlcm5hbCBzdWJzY3JpcHRpb25zIG9yIGRhdGEgY3JlYXRlZFxuICAgKiBieSB0aGlzIG1ldGhvZCBtdXN0IGJlIGNsZWFuZWQgdXAgaW4gYGNvbXBvbmVudFdpbGxVbm1vdW50YC5cbiAgICpcbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBjb21wb25lbnRXaWxsTW91bnQ6IFNwZWNQb2xpY3kuREVGSU5FX01BTlksXG5cbiAgLyoqXG4gICAqIEludm9rZWQgd2hlbiB0aGUgY29tcG9uZW50IGhhcyBiZWVuIG1vdW50ZWQgYW5kIGhhcyBhIERPTSByZXByZXNlbnRhdGlvbi5cbiAgICogSG93ZXZlciwgdGhlcmUgaXMgbm8gZ3VhcmFudGVlIHRoYXQgdGhlIERPTSBub2RlIGlzIGluIHRoZSBkb2N1bWVudC5cbiAgICpcbiAgICogVXNlIHRoaXMgYXMgYW4gb3Bwb3J0dW5pdHkgdG8gb3BlcmF0ZSBvbiB0aGUgRE9NIHdoZW4gdGhlIGNvbXBvbmVudCBoYXNcbiAgICogYmVlbiBtb3VudGVkIChpbml0aWFsaXplZCBhbmQgcmVuZGVyZWQpIGZvciB0aGUgZmlyc3QgdGltZS5cbiAgICpcbiAgICogQHBhcmFtIHtET01FbGVtZW50fSByb290Tm9kZSBET00gZWxlbWVudCByZXByZXNlbnRpbmcgdGhlIGNvbXBvbmVudC5cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBjb21wb25lbnREaWRNb3VudDogU3BlY1BvbGljeS5ERUZJTkVfTUFOWSxcblxuICAvKipcbiAgICogSW52b2tlZCBiZWZvcmUgdGhlIGNvbXBvbmVudCByZWNlaXZlcyBuZXcgcHJvcHMuXG4gICAqXG4gICAqIFVzZSB0aGlzIGFzIGFuIG9wcG9ydHVuaXR5IHRvIHJlYWN0IHRvIGEgcHJvcCB0cmFuc2l0aW9uIGJ5IHVwZGF0aW5nIHRoZVxuICAgKiBzdGF0ZSB1c2luZyBgdGhpcy5zZXRTdGF0ZWAuIEN1cnJlbnQgcHJvcHMgYXJlIGFjY2Vzc2VkIHZpYSBgdGhpcy5wcm9wc2AuXG4gICAqXG4gICAqICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzLCBuZXh0Q29udGV4dCkge1xuICAgKiAgICAgdGhpcy5zZXRTdGF0ZSh7XG4gICAqICAgICAgIGxpa2VzSW5jcmVhc2luZzogbmV4dFByb3BzLmxpa2VDb3VudCA+IHRoaXMucHJvcHMubGlrZUNvdW50XG4gICAqICAgICB9KTtcbiAgICogICB9XG4gICAqXG4gICAqIE5PVEU6IFRoZXJlIGlzIG5vIGVxdWl2YWxlbnQgYGNvbXBvbmVudFdpbGxSZWNlaXZlU3RhdGVgLiBBbiBpbmNvbWluZyBwcm9wXG4gICAqIHRyYW5zaXRpb24gbWF5IGNhdXNlIGEgc3RhdGUgY2hhbmdlLCBidXQgdGhlIG9wcG9zaXRlIGlzIG5vdCB0cnVlLiBJZiB5b3VcbiAgICogbmVlZCBpdCwgeW91IGFyZSBwcm9iYWJseSBsb29raW5nIGZvciBgY29tcG9uZW50V2lsbFVwZGF0ZWAuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBuZXh0UHJvcHNcbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBTcGVjUG9saWN5LkRFRklORV9NQU5ZLFxuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoaWxlIGRlY2lkaW5nIGlmIHRoZSBjb21wb25lbnQgc2hvdWxkIGJlIHVwZGF0ZWQgYXMgYSByZXN1bHQgb2ZcbiAgICogcmVjZWl2aW5nIG5ldyBwcm9wcywgc3RhdGUgYW5kL29yIGNvbnRleHQuXG4gICAqXG4gICAqIFVzZSB0aGlzIGFzIGFuIG9wcG9ydHVuaXR5IHRvIGByZXR1cm4gZmFsc2VgIHdoZW4geW91J3JlIGNlcnRhaW4gdGhhdCB0aGVcbiAgICogdHJhbnNpdGlvbiB0byB0aGUgbmV3IHByb3BzL3N0YXRlL2NvbnRleHQgd2lsbCBub3QgcmVxdWlyZSBhIGNvbXBvbmVudFxuICAgKiB1cGRhdGUuXG4gICAqXG4gICAqICAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBmdW5jdGlvbihuZXh0UHJvcHMsIG5leHRTdGF0ZSwgbmV4dENvbnRleHQpIHtcbiAgICogICAgIHJldHVybiAhZXF1YWwobmV4dFByb3BzLCB0aGlzLnByb3BzKSB8fFxuICAgKiAgICAgICAhZXF1YWwobmV4dFN0YXRlLCB0aGlzLnN0YXRlKSB8fFxuICAgKiAgICAgICAhZXF1YWwobmV4dENvbnRleHQsIHRoaXMuY29udGV4dCk7XG4gICAqICAgfVxuICAgKlxuICAgKiBAcGFyYW0ge29iamVjdH0gbmV4dFByb3BzXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbmV4dFN0YXRlXG4gICAqIEBwYXJhbSB7P29iamVjdH0gbmV4dENvbnRleHRcbiAgICogQHJldHVybiB7Ym9vbGVhbn0gVHJ1ZSBpZiB0aGUgY29tcG9uZW50IHNob3VsZCB1cGRhdGUuXG4gICAqIEBvcHRpb25hbFxuICAgKi9cbiAgc2hvdWxkQ29tcG9uZW50VXBkYXRlOiBTcGVjUG9saWN5LkRFRklORV9PTkNFLFxuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoZW4gdGhlIGNvbXBvbmVudCBpcyBhYm91dCB0byB1cGRhdGUgZHVlIHRvIGEgdHJhbnNpdGlvbiBmcm9tXG4gICAqIGB0aGlzLnByb3BzYCwgYHRoaXMuc3RhdGVgIGFuZCBgdGhpcy5jb250ZXh0YCB0byBgbmV4dFByb3BzYCwgYG5leHRTdGF0ZWBcbiAgICogYW5kIGBuZXh0Q29udGV4dGAuXG4gICAqXG4gICAqIFVzZSB0aGlzIGFzIGFuIG9wcG9ydHVuaXR5IHRvIHBlcmZvcm0gcHJlcGFyYXRpb24gYmVmb3JlIGFuIHVwZGF0ZSBvY2N1cnMuXG4gICAqXG4gICAqIE5PVEU6IFlvdSAqKmNhbm5vdCoqIHVzZSBgdGhpcy5zZXRTdGF0ZSgpYCBpbiB0aGlzIG1ldGhvZC5cbiAgICpcbiAgICogQHBhcmFtIHtvYmplY3R9IG5leHRQcm9wc1xuICAgKiBAcGFyYW0gez9vYmplY3R9IG5leHRTdGF0ZVxuICAgKiBAcGFyYW0gez9vYmplY3R9IG5leHRDb250ZXh0XG4gICAqIEBwYXJhbSB7UmVhY3RSZWNvbmNpbGVUcmFuc2FjdGlvbn0gdHJhbnNhY3Rpb25cbiAgICogQG9wdGlvbmFsXG4gICAqL1xuICBjb21wb25lbnRXaWxsVXBkYXRlOiBTcGVjUG9saWN5LkRFRklORV9NQU5ZLFxuXG4gIC8qKlxuICAgKiBJbnZva2VkIHdoZW4gdGhlIGNvbXBvbmVudCdzIERPTSByZXByZXNlbnRhdGlvbiBoYXMgYmVlbiB1cGRhdGVkLlxuICAgKlxuICAgKiBVc2UgdGhpcyBhcyBhbiBvcHBvcnR1bml0eSB0byBvcGVyYXRlIG9uIHRoZSBET00gd2hlbiB0aGUgY29tcG9uZW50IGhhc1xuICAgKiBiZWVuIHVwZGF0ZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBwcmV2UHJvcHNcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBwcmV2U3RhdGVcbiAgICogQHBhcmFtIHs/b2JqZWN0fSBwcmV2Q29udGV4dFxuICAgKiBAcGFyYW0ge0RPTUVsZW1lbnR9IHJvb3ROb2RlIERPTSBlbGVtZW50IHJlcHJlc2VudGluZyB0aGUgY29tcG9uZW50LlxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGNvbXBvbmVudERpZFVwZGF0ZTogU3BlY1BvbGljeS5ERUZJTkVfTUFOWSxcblxuICAvKipcbiAgICogSW52b2tlZCB3aGVuIHRoZSBjb21wb25lbnQgaXMgYWJvdXQgdG8gYmUgcmVtb3ZlZCBmcm9tIGl0cyBwYXJlbnQgYW5kIGhhdmVcbiAgICogaXRzIERPTSByZXByZXNlbnRhdGlvbiBkZXN0cm95ZWQuXG4gICAqXG4gICAqIFVzZSB0aGlzIGFzIGFuIG9wcG9ydHVuaXR5IHRvIGRlYWxsb2NhdGUgYW55IGV4dGVybmFsIHJlc291cmNlcy5cbiAgICpcbiAgICogTk9URTogVGhlcmUgaXMgbm8gYGNvbXBvbmVudERpZFVubW91bnRgIHNpbmNlIHlvdXIgY29tcG9uZW50IHdpbGwgaGF2ZSBiZWVuXG4gICAqIGRlc3Ryb3llZCBieSB0aGF0IHBvaW50LlxuICAgKlxuICAgKiBAb3B0aW9uYWxcbiAgICovXG4gIGNvbXBvbmVudFdpbGxVbm1vdW50OiBTcGVjUG9saWN5LkRFRklORV9NQU5ZLFxuXG4gIC8vID09PT0gQWR2YW5jZWQgbWV0aG9kcyA9PT09XG5cbiAgLyoqXG4gICAqIFVwZGF0ZXMgdGhlIGNvbXBvbmVudCdzIGN1cnJlbnRseSBtb3VudGVkIERPTSByZXByZXNlbnRhdGlvbi5cbiAgICpcbiAgICogQnkgZGVmYXVsdCwgdGhpcyBpbXBsZW1lbnRzIFJlYWN0J3MgcmVuZGVyaW5nIGFuZCByZWNvbmNpbGlhdGlvbiBhbGdvcml0aG0uXG4gICAqIFNvcGhpc3RpY2F0ZWQgY2xpZW50cyBtYXkgd2lzaCB0byBvdmVycmlkZSB0aGlzLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0UmVjb25jaWxlVHJhbnNhY3Rpb259IHRyYW5zYWN0aW9uXG4gICAqIEBpbnRlcm5hbFxuICAgKiBAb3ZlcnJpZGFibGVcbiAgICovXG4gIHVwZGF0ZUNvbXBvbmVudDogU3BlY1BvbGljeS5PVkVSUklERV9CQVNFXG5cbn07XG5cbi8qKlxuICogTWFwcGluZyBmcm9tIGNsYXNzIHNwZWNpZmljYXRpb24ga2V5cyB0byBzcGVjaWFsIHByb2Nlc3NpbmcgZnVuY3Rpb25zLlxuICpcbiAqIEFsdGhvdWdoIHRoZXNlIGFyZSBkZWNsYXJlZCBsaWtlIGluc3RhbmNlIHByb3BlcnRpZXMgaW4gdGhlIHNwZWNpZmljYXRpb25cbiAqIHdoZW4gZGVmaW5pbmcgY2xhc3NlcyB1c2luZyBgUmVhY3QuY3JlYXRlQ2xhc3NgLCB0aGV5IGFyZSBhY3R1YWxseSBzdGF0aWNcbiAqIGFuZCBhcmUgYWNjZXNzaWJsZSBvbiB0aGUgY29uc3RydWN0b3IgaW5zdGVhZCBvZiB0aGUgcHJvdG90eXBlLiBEZXNwaXRlXG4gKiBiZWluZyBzdGF0aWMsIHRoZXkgbXVzdCBiZSBkZWZpbmVkIG91dHNpZGUgb2YgdGhlIFwic3RhdGljc1wiIGtleSB1bmRlclxuICogd2hpY2ggYWxsIG90aGVyIHN0YXRpYyBtZXRob2RzIGFyZSBkZWZpbmVkLlxuICovXG52YXIgUkVTRVJWRURfU1BFQ19LRVlTID0ge1xuICBkaXNwbGF5TmFtZTogZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBkaXNwbGF5TmFtZSkge1xuICAgIENvbnN0cnVjdG9yLmRpc3BsYXlOYW1lID0gZGlzcGxheU5hbWU7XG4gIH0sXG4gIG1peGluczogZnVuY3Rpb24gKENvbnN0cnVjdG9yLCBtaXhpbnMpIHtcbiAgICBpZiAobWl4aW5zKSB7XG4gICAgICBmb3IgKHZhciBpID0gMDsgaSA8IG1peGlucy5sZW5ndGg7IGkrKykge1xuICAgICAgICBtaXhTcGVjSW50b0NvbXBvbmVudChDb25zdHJ1Y3RvciwgbWl4aW5zW2ldKTtcbiAgICAgIH1cbiAgICB9XG4gIH0sXG4gIGNoaWxkQ29udGV4dFR5cGVzOiBmdW5jdGlvbiAoQ29uc3RydWN0b3IsIGNoaWxkQ29udGV4dFR5cGVzKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhbGlkYXRlVHlwZURlZihDb25zdHJ1Y3RvciwgY2hpbGRDb250ZXh0VHlwZXMsIFJlYWN0UHJvcFR5cGVMb2NhdGlvbnMuY2hpbGRDb250ZXh0KTtcbiAgICB9XG4gICAgQ29uc3RydWN0b3IuY2hpbGRDb250ZXh0VHlwZXMgPSBfYXNzaWduKHt9LCBDb25zdHJ1Y3Rvci5jaGlsZENvbnRleHRUeXBlcywgY2hpbGRDb250ZXh0VHlwZXMpO1xuICB9LFxuICBjb250ZXh0VHlwZXM6IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgY29udGV4dFR5cGVzKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhbGlkYXRlVHlwZURlZihDb25zdHJ1Y3RvciwgY29udGV4dFR5cGVzLCBSZWFjdFByb3BUeXBlTG9jYXRpb25zLmNvbnRleHQpO1xuICAgIH1cbiAgICBDb25zdHJ1Y3Rvci5jb250ZXh0VHlwZXMgPSBfYXNzaWduKHt9LCBDb25zdHJ1Y3Rvci5jb250ZXh0VHlwZXMsIGNvbnRleHRUeXBlcyk7XG4gIH0sXG4gIC8qKlxuICAgKiBTcGVjaWFsIGNhc2UgZ2V0RGVmYXVsdFByb3BzIHdoaWNoIHNob3VsZCBtb3ZlIGludG8gc3RhdGljcyBidXQgcmVxdWlyZXNcbiAgICogYXV0b21hdGljIG1lcmdpbmcuXG4gICAqL1xuICBnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgZ2V0RGVmYXVsdFByb3BzKSB7XG4gICAgaWYgKENvbnN0cnVjdG9yLmdldERlZmF1bHRQcm9wcykge1xuICAgICAgQ29uc3RydWN0b3IuZ2V0RGVmYXVsdFByb3BzID0gY3JlYXRlTWVyZ2VkUmVzdWx0RnVuY3Rpb24oQ29uc3RydWN0b3IuZ2V0RGVmYXVsdFByb3BzLCBnZXREZWZhdWx0UHJvcHMpO1xuICAgIH0gZWxzZSB7XG4gICAgICBDb25zdHJ1Y3Rvci5nZXREZWZhdWx0UHJvcHMgPSBnZXREZWZhdWx0UHJvcHM7XG4gICAgfVxuICB9LFxuICBwcm9wVHlwZXM6IGZ1bmN0aW9uIChDb25zdHJ1Y3RvciwgcHJvcFR5cGVzKSB7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIHZhbGlkYXRlVHlwZURlZihDb25zdHJ1Y3RvciwgcHJvcFR5cGVzLCBSZWFjdFByb3BUeXBlTG9jYXRpb25zLnByb3ApO1xuICAgIH1cbiAgICBDb25zdHJ1Y3Rvci5wcm9wVHlwZXMgPSBfYXNzaWduKHt9LCBDb25zdHJ1Y3Rvci5wcm9wVHlwZXMsIHByb3BUeXBlcyk7XG4gIH0sXG4gIHN0YXRpY3M6IGZ1bmN0aW9uIChDb25zdHJ1Y3Rvciwgc3RhdGljcykge1xuICAgIG1peFN0YXRpY1NwZWNJbnRvQ29tcG9uZW50KENvbnN0cnVjdG9yLCBzdGF0aWNzKTtcbiAgfSxcbiAgYXV0b2JpbmQ6IGZ1bmN0aW9uICgpIHt9IH07XG5cbi8vIG5vb3BcbmZ1bmN0aW9uIHZhbGlkYXRlVHlwZURlZihDb25zdHJ1Y3RvciwgdHlwZURlZiwgbG9jYXRpb24pIHtcbiAgZm9yICh2YXIgcHJvcE5hbWUgaW4gdHlwZURlZikge1xuICAgIGlmICh0eXBlRGVmLmhhc093blByb3BlcnR5KHByb3BOYW1lKSkge1xuICAgICAgLy8gdXNlIGEgd2FybmluZyBpbnN0ZWFkIG9mIGFuIGludmFyaWFudCBzbyBjb21wb25lbnRzXG4gICAgICAvLyBkb24ndCBzaG93IHVwIGluIHByb2QgYnV0IG9ubHkgaW4gX19ERVZfX1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcodHlwZW9mIHR5cGVEZWZbcHJvcE5hbWVdID09PSAnZnVuY3Rpb24nLCAnJXM6ICVzIHR5cGUgYCVzYCBpcyBpbnZhbGlkOyBpdCBtdXN0IGJlIGEgZnVuY3Rpb24sIHVzdWFsbHkgZnJvbSAnICsgJ1JlYWN0LlByb3BUeXBlcy4nLCBDb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCAnUmVhY3RDbGFzcycsIFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXSwgcHJvcE5hbWUpIDogdm9pZCAwO1xuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiB2YWxpZGF0ZU1ldGhvZE92ZXJyaWRlKGlzQWxyZWFkeURlZmluZWQsIG5hbWUpIHtcbiAgdmFyIHNwZWNQb2xpY3kgPSBSZWFjdENsYXNzSW50ZXJmYWNlLmhhc093blByb3BlcnR5KG5hbWUpID8gUmVhY3RDbGFzc0ludGVyZmFjZVtuYW1lXSA6IG51bGw7XG5cbiAgLy8gRGlzYWxsb3cgb3ZlcnJpZGluZyBvZiBiYXNlIGNsYXNzIG1ldGhvZHMgdW5sZXNzIGV4cGxpY2l0bHkgYWxsb3dlZC5cbiAgaWYgKFJlYWN0Q2xhc3NNaXhpbi5oYXNPd25Qcm9wZXJ0eShuYW1lKSkge1xuICAgICEoc3BlY1BvbGljeSA9PT0gU3BlY1BvbGljeS5PVkVSUklERV9CQVNFKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdENsYXNzSW50ZXJmYWNlOiBZb3UgYXJlIGF0dGVtcHRpbmcgdG8gb3ZlcnJpZGUgYCVzYCBmcm9tIHlvdXIgY2xhc3Mgc3BlY2lmaWNhdGlvbi4gRW5zdXJlIHRoYXQgeW91ciBtZXRob2QgbmFtZXMgZG8gbm90IG92ZXJsYXAgd2l0aCBSZWFjdCBtZXRob2RzLicsIG5hbWUpIDogX3Byb2RJbnZhcmlhbnQoJzczJywgbmFtZSkgOiB2b2lkIDA7XG4gIH1cblxuICAvLyBEaXNhbGxvdyBkZWZpbmluZyBtZXRob2RzIG1vcmUgdGhhbiBvbmNlIHVubGVzcyBleHBsaWNpdGx5IGFsbG93ZWQuXG4gIGlmIChpc0FscmVhZHlEZWZpbmVkKSB7XG4gICAgIShzcGVjUG9saWN5ID09PSBTcGVjUG9saWN5LkRFRklORV9NQU5ZIHx8IHNwZWNQb2xpY3kgPT09IFNwZWNQb2xpY3kuREVGSU5FX01BTllfTUVSR0VEKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdENsYXNzSW50ZXJmYWNlOiBZb3UgYXJlIGF0dGVtcHRpbmcgdG8gZGVmaW5lIGAlc2Agb24geW91ciBjb21wb25lbnQgbW9yZSB0aGFuIG9uY2UuIFRoaXMgY29uZmxpY3QgbWF5IGJlIGR1ZSB0byBhIG1peGluLicsIG5hbWUpIDogX3Byb2RJbnZhcmlhbnQoJzc0JywgbmFtZSkgOiB2b2lkIDA7XG4gIH1cbn1cblxuLyoqXG4gKiBNaXhpbiBoZWxwZXIgd2hpY2ggaGFuZGxlcyBwb2xpY3kgdmFsaWRhdGlvbiBhbmQgcmVzZXJ2ZWRcbiAqIHNwZWNpZmljYXRpb24ga2V5cyB3aGVuIGJ1aWxkaW5nIFJlYWN0IGNsYXNzZXMuXG4gKi9cbmZ1bmN0aW9uIG1peFNwZWNJbnRvQ29tcG9uZW50KENvbnN0cnVjdG9yLCBzcGVjKSB7XG4gIGlmICghc3BlYykge1xuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICB2YXIgdHlwZW9mU3BlYyA9IHR5cGVvZiBzcGVjO1xuICAgICAgdmFyIGlzTWl4aW5WYWxpZCA9IHR5cGVvZlNwZWMgPT09ICdvYmplY3QnICYmIHNwZWMgIT09IG51bGw7XG5cbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGlzTWl4aW5WYWxpZCwgJyVzOiBZb3VcXCdyZSBhdHRlbXB0aW5nIHRvIGluY2x1ZGUgYSBtaXhpbiB0aGF0IGlzIGVpdGhlciBudWxsICcgKyAnb3Igbm90IGFuIG9iamVjdC4gQ2hlY2sgdGhlIG1peGlucyBpbmNsdWRlZCBieSB0aGUgY29tcG9uZW50LCAnICsgJ2FzIHdlbGwgYXMgYW55IG1peGlucyB0aGV5IGluY2x1ZGUgdGhlbXNlbHZlcy4gJyArICdFeHBlY3RlZCBvYmplY3QgYnV0IGdvdCAlcy4nLCBDb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCAnUmVhY3RDbGFzcycsIHNwZWMgPT09IG51bGwgPyBudWxsIDogdHlwZW9mU3BlYykgOiB2b2lkIDA7XG4gICAgfVxuXG4gICAgcmV0dXJuO1xuICB9XG5cbiAgISh0eXBlb2Ygc3BlYyAhPT0gJ2Z1bmN0aW9uJykgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnUmVhY3RDbGFzczogWW91XFwncmUgYXR0ZW1wdGluZyB0byB1c2UgYSBjb21wb25lbnQgY2xhc3Mgb3IgZnVuY3Rpb24gYXMgYSBtaXhpbi4gSW5zdGVhZCwganVzdCB1c2UgYSByZWd1bGFyIG9iamVjdC4nKSA6IF9wcm9kSW52YXJpYW50KCc3NScpIDogdm9pZCAwO1xuICAhIVJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudChzcGVjKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdENsYXNzOiBZb3VcXCdyZSBhdHRlbXB0aW5nIHRvIHVzZSBhIGNvbXBvbmVudCBhcyBhIG1peGluLiBJbnN0ZWFkLCBqdXN0IHVzZSBhIHJlZ3VsYXIgb2JqZWN0LicpIDogX3Byb2RJbnZhcmlhbnQoJzc2JykgOiB2b2lkIDA7XG5cbiAgdmFyIHByb3RvID0gQ29uc3RydWN0b3IucHJvdG90eXBlO1xuICB2YXIgYXV0b0JpbmRQYWlycyA9IHByb3RvLl9fcmVhY3RBdXRvQmluZFBhaXJzO1xuXG4gIC8vIEJ5IGhhbmRsaW5nIG1peGlucyBiZWZvcmUgYW55IG90aGVyIHByb3BlcnRpZXMsIHdlIGVuc3VyZSB0aGUgc2FtZVxuICAvLyBjaGFpbmluZyBvcmRlciBpcyBhcHBsaWVkIHRvIG1ldGhvZHMgd2l0aCBERUZJTkVfTUFOWSBwb2xpY3ksIHdoZXRoZXJcbiAgLy8gbWl4aW5zIGFyZSBsaXN0ZWQgYmVmb3JlIG9yIGFmdGVyIHRoZXNlIG1ldGhvZHMgaW4gdGhlIHNwZWMuXG4gIGlmIChzcGVjLmhhc093blByb3BlcnR5KE1JWElOU19LRVkpKSB7XG4gICAgUkVTRVJWRURfU1BFQ19LRVlTLm1peGlucyhDb25zdHJ1Y3Rvciwgc3BlYy5taXhpbnMpO1xuICB9XG5cbiAgZm9yICh2YXIgbmFtZSBpbiBzcGVjKSB7XG4gICAgaWYgKCFzcGVjLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG5cbiAgICBpZiAobmFtZSA9PT0gTUlYSU5TX0tFWSkge1xuICAgICAgLy8gV2UgaGF2ZSBhbHJlYWR5IGhhbmRsZWQgbWl4aW5zIGluIGEgc3BlY2lhbCBjYXNlIGFib3ZlLlxuICAgICAgY29udGludWU7XG4gICAgfVxuXG4gICAgdmFyIHByb3BlcnR5ID0gc3BlY1tuYW1lXTtcbiAgICB2YXIgaXNBbHJlYWR5RGVmaW5lZCA9IHByb3RvLmhhc093blByb3BlcnR5KG5hbWUpO1xuICAgIHZhbGlkYXRlTWV0aG9kT3ZlcnJpZGUoaXNBbHJlYWR5RGVmaW5lZCwgbmFtZSk7XG5cbiAgICBpZiAoUkVTRVJWRURfU1BFQ19LRVlTLmhhc093blByb3BlcnR5KG5hbWUpKSB7XG4gICAgICBSRVNFUlZFRF9TUEVDX0tFWVNbbmFtZV0oQ29uc3RydWN0b3IsIHByb3BlcnR5KTtcbiAgICB9IGVsc2Uge1xuICAgICAgLy8gU2V0dXAgbWV0aG9kcyBvbiBwcm90b3R5cGU6XG4gICAgICAvLyBUaGUgZm9sbG93aW5nIG1lbWJlciBtZXRob2RzIHNob3VsZCBub3QgYmUgYXV0b21hdGljYWxseSBib3VuZDpcbiAgICAgIC8vIDEuIEV4cGVjdGVkIFJlYWN0Q2xhc3MgbWV0aG9kcyAoaW4gdGhlIFwiaW50ZXJmYWNlXCIpLlxuICAgICAgLy8gMi4gT3ZlcnJpZGRlbiBtZXRob2RzICh0aGF0IHdlcmUgbWl4ZWQgaW4pLlxuICAgICAgdmFyIGlzUmVhY3RDbGFzc01ldGhvZCA9IFJlYWN0Q2xhc3NJbnRlcmZhY2UuaGFzT3duUHJvcGVydHkobmFtZSk7XG4gICAgICB2YXIgaXNGdW5jdGlvbiA9IHR5cGVvZiBwcm9wZXJ0eSA9PT0gJ2Z1bmN0aW9uJztcbiAgICAgIHZhciBzaG91bGRBdXRvQmluZCA9IGlzRnVuY3Rpb24gJiYgIWlzUmVhY3RDbGFzc01ldGhvZCAmJiAhaXNBbHJlYWR5RGVmaW5lZCAmJiBzcGVjLmF1dG9iaW5kICE9PSBmYWxzZTtcblxuICAgICAgaWYgKHNob3VsZEF1dG9CaW5kKSB7XG4gICAgICAgIGF1dG9CaW5kUGFpcnMucHVzaChuYW1lLCBwcm9wZXJ0eSk7XG4gICAgICAgIHByb3RvW25hbWVdID0gcHJvcGVydHk7XG4gICAgICB9IGVsc2Uge1xuICAgICAgICBpZiAoaXNBbHJlYWR5RGVmaW5lZCkge1xuICAgICAgICAgIHZhciBzcGVjUG9saWN5ID0gUmVhY3RDbGFzc0ludGVyZmFjZVtuYW1lXTtcblxuICAgICAgICAgIC8vIFRoZXNlIGNhc2VzIHNob3VsZCBhbHJlYWR5IGJlIGNhdWdodCBieSB2YWxpZGF0ZU1ldGhvZE92ZXJyaWRlLlxuICAgICAgICAgICEoaXNSZWFjdENsYXNzTWV0aG9kICYmIChzcGVjUG9saWN5ID09PSBTcGVjUG9saWN5LkRFRklORV9NQU5ZX01FUkdFRCB8fCBzcGVjUG9saWN5ID09PSBTcGVjUG9saWN5LkRFRklORV9NQU5ZKSkgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnUmVhY3RDbGFzczogVW5leHBlY3RlZCBzcGVjIHBvbGljeSAlcyBmb3Iga2V5ICVzIHdoZW4gbWl4aW5nIGluIGNvbXBvbmVudCBzcGVjcy4nLCBzcGVjUG9saWN5LCBuYW1lKSA6IF9wcm9kSW52YXJpYW50KCc3NycsIHNwZWNQb2xpY3ksIG5hbWUpIDogdm9pZCAwO1xuXG4gICAgICAgICAgLy8gRm9yIG1ldGhvZHMgd2hpY2ggYXJlIGRlZmluZWQgbW9yZSB0aGFuIG9uY2UsIGNhbGwgdGhlIGV4aXN0aW5nXG4gICAgICAgICAgLy8gbWV0aG9kcyBiZWZvcmUgY2FsbGluZyB0aGUgbmV3IHByb3BlcnR5LCBtZXJnaW5nIGlmIGFwcHJvcHJpYXRlLlxuICAgICAgICAgIGlmIChzcGVjUG9saWN5ID09PSBTcGVjUG9saWN5LkRFRklORV9NQU5ZX01FUkdFRCkge1xuICAgICAgICAgICAgcHJvdG9bbmFtZV0gPSBjcmVhdGVNZXJnZWRSZXN1bHRGdW5jdGlvbihwcm90b1tuYW1lXSwgcHJvcGVydHkpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoc3BlY1BvbGljeSA9PT0gU3BlY1BvbGljeS5ERUZJTkVfTUFOWSkge1xuICAgICAgICAgICAgcHJvdG9bbmFtZV0gPSBjcmVhdGVDaGFpbmVkRnVuY3Rpb24ocHJvdG9bbmFtZV0sIHByb3BlcnR5KTtcbiAgICAgICAgICB9XG4gICAgICAgIH0gZWxzZSB7XG4gICAgICAgICAgcHJvdG9bbmFtZV0gPSBwcm9wZXJ0eTtcbiAgICAgICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICAgICAgLy8gQWRkIHZlcmJvc2UgZGlzcGxheU5hbWUgdG8gdGhlIGZ1bmN0aW9uLCB3aGljaCBoZWxwcyB3aGVuIGxvb2tpbmdcbiAgICAgICAgICAgIC8vIGF0IHByb2ZpbGluZyB0b29scy5cbiAgICAgICAgICAgIGlmICh0eXBlb2YgcHJvcGVydHkgPT09ICdmdW5jdGlvbicgJiYgc3BlYy5kaXNwbGF5TmFtZSkge1xuICAgICAgICAgICAgICBwcm90b1tuYW1lXS5kaXNwbGF5TmFtZSA9IHNwZWMuZGlzcGxheU5hbWUgKyAnXycgKyBuYW1lO1xuICAgICAgICAgICAgfVxuICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgICAgfVxuICAgIH1cbiAgfVxufVxuXG5mdW5jdGlvbiBtaXhTdGF0aWNTcGVjSW50b0NvbXBvbmVudChDb25zdHJ1Y3Rvciwgc3RhdGljcykge1xuICBpZiAoIXN0YXRpY3MpIHtcbiAgICByZXR1cm47XG4gIH1cbiAgZm9yICh2YXIgbmFtZSBpbiBzdGF0aWNzKSB7XG4gICAgdmFyIHByb3BlcnR5ID0gc3RhdGljc1tuYW1lXTtcbiAgICBpZiAoIXN0YXRpY3MuaGFzT3duUHJvcGVydHkobmFtZSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cblxuICAgIHZhciBpc1Jlc2VydmVkID0gbmFtZSBpbiBSRVNFUlZFRF9TUEVDX0tFWVM7XG4gICAgISFpc1Jlc2VydmVkID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0Q2xhc3M6IFlvdSBhcmUgYXR0ZW1wdGluZyB0byBkZWZpbmUgYSByZXNlcnZlZCBwcm9wZXJ0eSwgYCVzYCwgdGhhdCBzaG91bGRuXFwndCBiZSBvbiB0aGUgXCJzdGF0aWNzXCIga2V5LiBEZWZpbmUgaXQgYXMgYW4gaW5zdGFuY2UgcHJvcGVydHkgaW5zdGVhZDsgaXQgd2lsbCBzdGlsbCBiZSBhY2Nlc3NpYmxlIG9uIHRoZSBjb25zdHJ1Y3Rvci4nLCBuYW1lKSA6IF9wcm9kSW52YXJpYW50KCc3OCcsIG5hbWUpIDogdm9pZCAwO1xuXG4gICAgdmFyIGlzSW5oZXJpdGVkID0gbmFtZSBpbiBDb25zdHJ1Y3RvcjtcbiAgICAhIWlzSW5oZXJpdGVkID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ1JlYWN0Q2xhc3M6IFlvdSBhcmUgYXR0ZW1wdGluZyB0byBkZWZpbmUgYCVzYCBvbiB5b3VyIGNvbXBvbmVudCBtb3JlIHRoYW4gb25jZS4gVGhpcyBjb25mbGljdCBtYXkgYmUgZHVlIHRvIGEgbWl4aW4uJywgbmFtZSkgOiBfcHJvZEludmFyaWFudCgnNzknLCBuYW1lKSA6IHZvaWQgMDtcbiAgICBDb25zdHJ1Y3RvcltuYW1lXSA9IHByb3BlcnR5O1xuICB9XG59XG5cbi8qKlxuICogTWVyZ2UgdHdvIG9iamVjdHMsIGJ1dCB0aHJvdyBpZiBib3RoIGNvbnRhaW4gdGhlIHNhbWUga2V5LlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvbmUgVGhlIGZpcnN0IG9iamVjdCwgd2hpY2ggaXMgbXV0YXRlZC5cbiAqIEBwYXJhbSB7b2JqZWN0fSB0d28gVGhlIHNlY29uZCBvYmplY3RcbiAqIEByZXR1cm4ge29iamVjdH0gb25lIGFmdGVyIGl0IGhhcyBiZWVuIG11dGF0ZWQgdG8gY29udGFpbiBldmVyeXRoaW5nIGluIHR3by5cbiAqL1xuZnVuY3Rpb24gbWVyZ2VJbnRvV2l0aE5vRHVwbGljYXRlS2V5cyhvbmUsIHR3bykge1xuICAhKG9uZSAmJiB0d28gJiYgdHlwZW9mIG9uZSA9PT0gJ29iamVjdCcgJiYgdHlwZW9mIHR3byA9PT0gJ29iamVjdCcpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ21lcmdlSW50b1dpdGhOb0R1cGxpY2F0ZUtleXMoKTogQ2Fubm90IG1lcmdlIG5vbi1vYmplY3RzLicpIDogX3Byb2RJbnZhcmlhbnQoJzgwJykgOiB2b2lkIDA7XG5cbiAgZm9yICh2YXIga2V5IGluIHR3bykge1xuICAgIGlmICh0d28uaGFzT3duUHJvcGVydHkoa2V5KSkge1xuICAgICAgIShvbmVba2V5XSA9PT0gdW5kZWZpbmVkKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdtZXJnZUludG9XaXRoTm9EdXBsaWNhdGVLZXlzKCk6IFRyaWVkIHRvIG1lcmdlIHR3byBvYmplY3RzIHdpdGggdGhlIHNhbWUga2V5OiBgJXNgLiBUaGlzIGNvbmZsaWN0IG1heSBiZSBkdWUgdG8gYSBtaXhpbjsgaW4gcGFydGljdWxhciwgdGhpcyBtYXkgYmUgY2F1c2VkIGJ5IHR3byBnZXRJbml0aWFsU3RhdGUoKSBvciBnZXREZWZhdWx0UHJvcHMoKSBtZXRob2RzIHJldHVybmluZyBvYmplY3RzIHdpdGggY2xhc2hpbmcga2V5cy4nLCBrZXkpIDogX3Byb2RJbnZhcmlhbnQoJzgxJywga2V5KSA6IHZvaWQgMDtcbiAgICAgIG9uZVtrZXldID0gdHdvW2tleV07XG4gICAgfVxuICB9XG4gIHJldHVybiBvbmU7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIGZ1bmN0aW9uIHRoYXQgaW52b2tlcyB0d28gZnVuY3Rpb25zIGFuZCBtZXJnZXMgdGhlaXIgcmV0dXJuIHZhbHVlcy5cbiAqXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSBvbmUgRnVuY3Rpb24gdG8gaW52b2tlIGZpcnN0LlxuICogQHBhcmFtIHtmdW5jdGlvbn0gdHdvIEZ1bmN0aW9uIHRvIGludm9rZSBzZWNvbmQuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gRnVuY3Rpb24gdGhhdCBpbnZva2VzIHRoZSB0d28gYXJndW1lbnQgZnVuY3Rpb25zLlxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY3JlYXRlTWVyZ2VkUmVzdWx0RnVuY3Rpb24ob25lLCB0d28pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIG1lcmdlZFJlc3VsdCgpIHtcbiAgICB2YXIgYSA9IG9uZS5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuICAgIHZhciBiID0gdHdvLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG4gICAgaWYgKGEgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGI7XG4gICAgfSBlbHNlIGlmIChiID09IG51bGwpIHtcbiAgICAgIHJldHVybiBhO1xuICAgIH1cbiAgICB2YXIgYyA9IHt9O1xuICAgIG1lcmdlSW50b1dpdGhOb0R1cGxpY2F0ZUtleXMoYywgYSk7XG4gICAgbWVyZ2VJbnRvV2l0aE5vRHVwbGljYXRlS2V5cyhjLCBiKTtcbiAgICByZXR1cm4gYztcbiAgfTtcbn1cblxuLyoqXG4gKiBDcmVhdGVzIGEgZnVuY3Rpb24gdGhhdCBpbnZva2VzIHR3byBmdW5jdGlvbnMgYW5kIGlnbm9yZXMgdGhlaXIgcmV0dXJuIHZhbGVzLlxuICpcbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG9uZSBGdW5jdGlvbiB0byBpbnZva2UgZmlyc3QuXG4gKiBAcGFyYW0ge2Z1bmN0aW9ufSB0d28gRnVuY3Rpb24gdG8gaW52b2tlIHNlY29uZC5cbiAqIEByZXR1cm4ge2Z1bmN0aW9ufSBGdW5jdGlvbiB0aGF0IGludm9rZXMgdGhlIHR3byBhcmd1bWVudCBmdW5jdGlvbnMuXG4gKiBAcHJpdmF0ZVxuICovXG5mdW5jdGlvbiBjcmVhdGVDaGFpbmVkRnVuY3Rpb24ob25lLCB0d28pIHtcbiAgcmV0dXJuIGZ1bmN0aW9uIGNoYWluZWRGdW5jdGlvbigpIHtcbiAgICBvbmUuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICB0d28uYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgfTtcbn1cblxuLyoqXG4gKiBCaW5kcyBhIG1ldGhvZCB0byB0aGUgY29tcG9uZW50LlxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBjb21wb25lbnQgQ29tcG9uZW50IHdob3NlIG1ldGhvZCBpcyBnb2luZyB0byBiZSBib3VuZC5cbiAqIEBwYXJhbSB7ZnVuY3Rpb259IG1ldGhvZCBNZXRob2QgdG8gYmUgYm91bmQuXG4gKiBAcmV0dXJuIHtmdW5jdGlvbn0gVGhlIGJvdW5kIG1ldGhvZC5cbiAqL1xuZnVuY3Rpb24gYmluZEF1dG9CaW5kTWV0aG9kKGNvbXBvbmVudCwgbWV0aG9kKSB7XG4gIHZhciBib3VuZE1ldGhvZCA9IG1ldGhvZC5iaW5kKGNvbXBvbmVudCk7XG4gIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgYm91bmRNZXRob2QuX19yZWFjdEJvdW5kQ29udGV4dCA9IGNvbXBvbmVudDtcbiAgICBib3VuZE1ldGhvZC5fX3JlYWN0Qm91bmRNZXRob2QgPSBtZXRob2Q7XG4gICAgYm91bmRNZXRob2QuX19yZWFjdEJvdW5kQXJndW1lbnRzID0gbnVsbDtcbiAgICB2YXIgY29tcG9uZW50TmFtZSA9IGNvbXBvbmVudC5jb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZTtcbiAgICB2YXIgX2JpbmQgPSBib3VuZE1ldGhvZC5iaW5kO1xuICAgIGJvdW5kTWV0aG9kLmJpbmQgPSBmdW5jdGlvbiAobmV3VGhpcykge1xuICAgICAgZm9yICh2YXIgX2xlbiA9IGFyZ3VtZW50cy5sZW5ndGgsIGFyZ3MgPSBBcnJheShfbGVuID4gMSA/IF9sZW4gLSAxIDogMCksIF9rZXkgPSAxOyBfa2V5IDwgX2xlbjsgX2tleSsrKSB7XG4gICAgICAgIGFyZ3NbX2tleSAtIDFdID0gYXJndW1lbnRzW19rZXldO1xuICAgICAgfVxuXG4gICAgICAvLyBVc2VyIGlzIHRyeWluZyB0byBiaW5kKCkgYW4gYXV0b2JvdW5kIG1ldGhvZDsgd2UgZWZmZWN0aXZlbHkgd2lsbFxuICAgICAgLy8gaWdub3JlIHRoZSB2YWx1ZSBvZiBcInRoaXNcIiB0aGF0IHRoZSB1c2VyIGlzIHRyeWluZyB0byB1c2UsIHNvXG4gICAgICAvLyBsZXQncyB3YXJuLlxuICAgICAgaWYgKG5ld1RoaXMgIT09IGNvbXBvbmVudCAmJiBuZXdUaGlzICE9PSBudWxsKSB7XG4gICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnYmluZCgpOiBSZWFjdCBjb21wb25lbnQgbWV0aG9kcyBtYXkgb25seSBiZSBib3VuZCB0byB0aGUgJyArICdjb21wb25lbnQgaW5zdGFuY2UuIFNlZSAlcycsIGNvbXBvbmVudE5hbWUpIDogdm9pZCAwO1xuICAgICAgfSBlbHNlIGlmICghYXJncy5sZW5ndGgpIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdiaW5kKCk6IFlvdSBhcmUgYmluZGluZyBhIGNvbXBvbmVudCBtZXRob2QgdG8gdGhlIGNvbXBvbmVudC4gJyArICdSZWFjdCBkb2VzIHRoaXMgZm9yIHlvdSBhdXRvbWF0aWNhbGx5IGluIGEgaGlnaC1wZXJmb3JtYW5jZSAnICsgJ3dheSwgc28geW91IGNhbiBzYWZlbHkgcmVtb3ZlIHRoaXMgY2FsbC4gU2VlICVzJywgY29tcG9uZW50TmFtZSkgOiB2b2lkIDA7XG4gICAgICAgIHJldHVybiBib3VuZE1ldGhvZDtcbiAgICAgIH1cbiAgICAgIHZhciByZWJvdW5kTWV0aG9kID0gX2JpbmQuYXBwbHkoYm91bmRNZXRob2QsIGFyZ3VtZW50cyk7XG4gICAgICByZWJvdW5kTWV0aG9kLl9fcmVhY3RCb3VuZENvbnRleHQgPSBjb21wb25lbnQ7XG4gICAgICByZWJvdW5kTWV0aG9kLl9fcmVhY3RCb3VuZE1ldGhvZCA9IG1ldGhvZDtcbiAgICAgIHJlYm91bmRNZXRob2QuX19yZWFjdEJvdW5kQXJndW1lbnRzID0gYXJncztcbiAgICAgIHJldHVybiByZWJvdW5kTWV0aG9kO1xuICAgIH07XG4gIH1cbiAgcmV0dXJuIGJvdW5kTWV0aG9kO1xufVxuXG4vKipcbiAqIEJpbmRzIGFsbCBhdXRvLWJvdW5kIG1ldGhvZHMgaW4gYSBjb21wb25lbnQuXG4gKlxuICogQHBhcmFtIHtvYmplY3R9IGNvbXBvbmVudCBDb21wb25lbnQgd2hvc2UgbWV0aG9kIGlzIGdvaW5nIHRvIGJlIGJvdW5kLlxuICovXG5mdW5jdGlvbiBiaW5kQXV0b0JpbmRNZXRob2RzKGNvbXBvbmVudCkge1xuICB2YXIgcGFpcnMgPSBjb21wb25lbnQuX19yZWFjdEF1dG9CaW5kUGFpcnM7XG4gIGZvciAodmFyIGkgPSAwOyBpIDwgcGFpcnMubGVuZ3RoOyBpICs9IDIpIHtcbiAgICB2YXIgYXV0b0JpbmRLZXkgPSBwYWlyc1tpXTtcbiAgICB2YXIgbWV0aG9kID0gcGFpcnNbaSArIDFdO1xuICAgIGNvbXBvbmVudFthdXRvQmluZEtleV0gPSBiaW5kQXV0b0JpbmRNZXRob2QoY29tcG9uZW50LCBtZXRob2QpO1xuICB9XG59XG5cbi8qKlxuICogQWRkIG1vcmUgdG8gdGhlIFJlYWN0Q2xhc3MgYmFzZSBjbGFzcy4gVGhlc2UgYXJlIGFsbCBsZWdhY3kgZmVhdHVyZXMgYW5kXG4gKiB0aGVyZWZvcmUgbm90IGFscmVhZHkgcGFydCBvZiB0aGUgbW9kZXJuIFJlYWN0Q29tcG9uZW50LlxuICovXG52YXIgUmVhY3RDbGFzc01peGluID0ge1xuXG4gIC8qKlxuICAgKiBUT0RPOiBUaGlzIHdpbGwgYmUgZGVwcmVjYXRlZCBiZWNhdXNlIHN0YXRlIHNob3VsZCBhbHdheXMga2VlcCBhIGNvbnNpc3RlbnRcbiAgICogdHlwZSBzaWduYXR1cmUgYW5kIHRoZSBvbmx5IHVzZSBjYXNlIGZvciB0aGlzLCBpcyB0byBhdm9pZCB0aGF0LlxuICAgKi9cbiAgcmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAobmV3U3RhdGUsIGNhbGxiYWNrKSB7XG4gICAgdGhpcy51cGRhdGVyLmVucXVldWVSZXBsYWNlU3RhdGUodGhpcywgbmV3U3RhdGUpO1xuICAgIGlmIChjYWxsYmFjaykge1xuICAgICAgdGhpcy51cGRhdGVyLmVucXVldWVDYWxsYmFjayh0aGlzLCBjYWxsYmFjaywgJ3JlcGxhY2VTdGF0ZScpO1xuICAgIH1cbiAgfSxcblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoaXMgY29tcG9zaXRlIGNvbXBvbmVudCBpcyBtb3VudGVkLlxuICAgKiBAcmV0dXJuIHtib29sZWFufSBUcnVlIGlmIG1vdW50ZWQsIGZhbHNlIG90aGVyd2lzZS5cbiAgICogQHByb3RlY3RlZFxuICAgKiBAZmluYWxcbiAgICovXG4gIGlzTW91bnRlZDogZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiB0aGlzLnVwZGF0ZXIuaXNNb3VudGVkKHRoaXMpO1xuICB9XG59O1xuXG52YXIgUmVhY3RDbGFzc0NvbXBvbmVudCA9IGZ1bmN0aW9uICgpIHt9O1xuX2Fzc2lnbihSZWFjdENsYXNzQ29tcG9uZW50LnByb3RvdHlwZSwgUmVhY3RDb21wb25lbnQucHJvdG90eXBlLCBSZWFjdENsYXNzTWl4aW4pO1xuXG4vKipcbiAqIE1vZHVsZSBmb3IgY3JlYXRpbmcgY29tcG9zaXRlIGNvbXBvbmVudHMuXG4gKlxuICogQGNsYXNzIFJlYWN0Q2xhc3NcbiAqL1xudmFyIFJlYWN0Q2xhc3MgPSB7XG5cbiAgLyoqXG4gICAqIENyZWF0ZXMgYSBjb21wb3NpdGUgY29tcG9uZW50IGNsYXNzIGdpdmVuIGEgY2xhc3Mgc3BlY2lmaWNhdGlvbi5cbiAgICogU2VlIGh0dHBzOi8vZmFjZWJvb2suZ2l0aHViLmlvL3JlYWN0L2RvY3MvdG9wLWxldmVsLWFwaS5odG1sI3JlYWN0LmNyZWF0ZWNsYXNzXG4gICAqXG4gICAqIEBwYXJhbSB7b2JqZWN0fSBzcGVjIENsYXNzIHNwZWNpZmljYXRpb24gKHdoaWNoIG11c3QgZGVmaW5lIGByZW5kZXJgKS5cbiAgICogQHJldHVybiB7ZnVuY3Rpb259IENvbXBvbmVudCBjb25zdHJ1Y3RvciBmdW5jdGlvbi5cbiAgICogQHB1YmxpY1xuICAgKi9cbiAgY3JlYXRlQ2xhc3M6IGZ1bmN0aW9uIChzcGVjKSB7XG4gICAgdmFyIENvbnN0cnVjdG9yID0gZnVuY3Rpb24gKHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gICAgICAvLyBUaGlzIGNvbnN0cnVjdG9yIGdldHMgb3ZlcnJpZGRlbiBieSBtb2Nrcy4gVGhlIGFyZ3VtZW50IGlzIHVzZWRcbiAgICAgIC8vIGJ5IG1vY2tzIHRvIGFzc2VydCBvbiB3aGF0IGdldHMgbW91bnRlZC5cblxuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcodGhpcyBpbnN0YW5jZW9mIENvbnN0cnVjdG9yLCAnU29tZXRoaW5nIGlzIGNhbGxpbmcgYSBSZWFjdCBjb21wb25lbnQgZGlyZWN0bHkuIFVzZSBhIGZhY3Rvcnkgb3IgJyArICdKU1ggaW5zdGVhZC4gU2VlOiBodHRwczovL2ZiLm1lL3JlYWN0LWxlZ2FjeWZhY3RvcnknKSA6IHZvaWQgMDtcbiAgICAgIH1cblxuICAgICAgLy8gV2lyZSB1cCBhdXRvLWJpbmRpbmdcbiAgICAgIGlmICh0aGlzLl9fcmVhY3RBdXRvQmluZFBhaXJzLmxlbmd0aCkge1xuICAgICAgICBiaW5kQXV0b0JpbmRNZXRob2RzKHRoaXMpO1xuICAgICAgfVxuXG4gICAgICB0aGlzLnByb3BzID0gcHJvcHM7XG4gICAgICB0aGlzLmNvbnRleHQgPSBjb250ZXh0O1xuICAgICAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gICAgICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xuXG4gICAgICB0aGlzLnN0YXRlID0gbnVsbDtcblxuICAgICAgLy8gUmVhY3RDbGFzc2VzIGRvZXNuJ3QgaGF2ZSBjb25zdHJ1Y3RvcnMuIEluc3RlYWQsIHRoZXkgdXNlIHRoZVxuICAgICAgLy8gZ2V0SW5pdGlhbFN0YXRlIGFuZCBjb21wb25lbnRXaWxsTW91bnQgbWV0aG9kcyBmb3IgaW5pdGlhbGl6YXRpb24uXG5cbiAgICAgIHZhciBpbml0aWFsU3RhdGUgPSB0aGlzLmdldEluaXRpYWxTdGF0ZSA/IHRoaXMuZ2V0SW5pdGlhbFN0YXRlKCkgOiBudWxsO1xuICAgICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgICAgLy8gV2UgYWxsb3cgYXV0by1tb2NrcyB0byBwcm9jZWVkIGFzIGlmIHRoZXkncmUgcmV0dXJuaW5nIG51bGwuXG4gICAgICAgIGlmIChpbml0aWFsU3RhdGUgPT09IHVuZGVmaW5lZCAmJiB0aGlzLmdldEluaXRpYWxTdGF0ZS5faXNNb2NrRnVuY3Rpb24pIHtcbiAgICAgICAgICAvLyBUaGlzIGlzIHByb2JhYmx5IGJhZCBwcmFjdGljZS4gQ29uc2lkZXIgd2FybmluZyBoZXJlIGFuZFxuICAgICAgICAgIC8vIGRlcHJlY2F0aW5nIHRoaXMgY29udmVuaWVuY2UuXG4gICAgICAgICAgaW5pdGlhbFN0YXRlID0gbnVsbDtcbiAgICAgICAgfVxuICAgICAgfVxuICAgICAgISh0eXBlb2YgaW5pdGlhbFN0YXRlID09PSAnb2JqZWN0JyAmJiAhQXJyYXkuaXNBcnJheShpbml0aWFsU3RhdGUpKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICclcy5nZXRJbml0aWFsU3RhdGUoKTogbXVzdCByZXR1cm4gYW4gb2JqZWN0IG9yIG51bGwnLCBDb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCAnUmVhY3RDb21wb3NpdGVDb21wb25lbnQnKSA6IF9wcm9kSW52YXJpYW50KCc4MicsIENvbnN0cnVjdG9yLmRpc3BsYXlOYW1lIHx8ICdSZWFjdENvbXBvc2l0ZUNvbXBvbmVudCcpIDogdm9pZCAwO1xuXG4gICAgICB0aGlzLnN0YXRlID0gaW5pdGlhbFN0YXRlO1xuICAgIH07XG4gICAgQ29uc3RydWN0b3IucHJvdG90eXBlID0gbmV3IFJlYWN0Q2xhc3NDb21wb25lbnQoKTtcbiAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUuY29uc3RydWN0b3IgPSBDb25zdHJ1Y3RvcjtcbiAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGUuX19yZWFjdEF1dG9CaW5kUGFpcnMgPSBbXTtcblxuICAgIGluamVjdGVkTWl4aW5zLmZvckVhY2gobWl4U3BlY0ludG9Db21wb25lbnQuYmluZChudWxsLCBDb25zdHJ1Y3RvcikpO1xuXG4gICAgbWl4U3BlY0ludG9Db21wb25lbnQoQ29uc3RydWN0b3IsIHNwZWMpO1xuXG4gICAgLy8gSW5pdGlhbGl6ZSB0aGUgZGVmYXVsdFByb3BzIHByb3BlcnR5IGFmdGVyIGFsbCBtaXhpbnMgaGF2ZSBiZWVuIG1lcmdlZC5cbiAgICBpZiAoQ29uc3RydWN0b3IuZ2V0RGVmYXVsdFByb3BzKSB7XG4gICAgICBDb25zdHJ1Y3Rvci5kZWZhdWx0UHJvcHMgPSBDb25zdHJ1Y3Rvci5nZXREZWZhdWx0UHJvcHMoKTtcbiAgICB9XG5cbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgLy8gVGhpcyBpcyBhIHRhZyB0byBpbmRpY2F0ZSB0aGF0IHRoZSB1c2Ugb2YgdGhlc2UgbWV0aG9kIG5hbWVzIGlzIG9rLFxuICAgICAgLy8gc2luY2UgaXQncyB1c2VkIHdpdGggY3JlYXRlQ2xhc3MuIElmIGl0J3Mgbm90LCB0aGVuIGl0J3MgbGlrZWx5IGFcbiAgICAgIC8vIG1pc3Rha2Ugc28gd2UnbGwgd2FybiB5b3UgdG8gdXNlIHRoZSBzdGF0aWMgcHJvcGVydHksIHByb3BlcnR5XG4gICAgICAvLyBpbml0aWFsaXplciBvciBjb25zdHJ1Y3RvciByZXNwZWN0aXZlbHkuXG4gICAgICBpZiAoQ29uc3RydWN0b3IuZ2V0RGVmYXVsdFByb3BzKSB7XG4gICAgICAgIENvbnN0cnVjdG9yLmdldERlZmF1bHRQcm9wcy5pc1JlYWN0Q2xhc3NBcHByb3ZlZCA9IHt9O1xuICAgICAgfVxuICAgICAgaWYgKENvbnN0cnVjdG9yLnByb3RvdHlwZS5nZXRJbml0aWFsU3RhdGUpIHtcbiAgICAgICAgQ29uc3RydWN0b3IucHJvdG90eXBlLmdldEluaXRpYWxTdGF0ZS5pc1JlYWN0Q2xhc3NBcHByb3ZlZCA9IHt9O1xuICAgICAgfVxuICAgIH1cblxuICAgICFDb25zdHJ1Y3Rvci5wcm90b3R5cGUucmVuZGVyID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJ2NyZWF0ZUNsYXNzKC4uLik6IENsYXNzIHNwZWNpZmljYXRpb24gbXVzdCBpbXBsZW1lbnQgYSBgcmVuZGVyYCBtZXRob2QuJykgOiBfcHJvZEludmFyaWFudCgnODMnKSA6IHZvaWQgMDtcblxuICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyghQ29uc3RydWN0b3IucHJvdG90eXBlLmNvbXBvbmVudFNob3VsZFVwZGF0ZSwgJyVzIGhhcyBhIG1ldGhvZCBjYWxsZWQgJyArICdjb21wb25lbnRTaG91bGRVcGRhdGUoKS4gRGlkIHlvdSBtZWFuIHNob3VsZENvbXBvbmVudFVwZGF0ZSgpPyAnICsgJ1RoZSBuYW1lIGlzIHBocmFzZWQgYXMgYSBxdWVzdGlvbiBiZWNhdXNlIHRoZSBmdW5jdGlvbiBpcyAnICsgJ2V4cGVjdGVkIHRvIHJldHVybiBhIHZhbHVlLicsIHNwZWMuZGlzcGxheU5hbWUgfHwgJ0EgY29tcG9uZW50JykgOiB2b2lkIDA7XG4gICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyghQ29uc3RydWN0b3IucHJvdG90eXBlLmNvbXBvbmVudFdpbGxSZWNpZXZlUHJvcHMsICclcyBoYXMgYSBtZXRob2QgY2FsbGVkICcgKyAnY29tcG9uZW50V2lsbFJlY2lldmVQcm9wcygpLiBEaWQgeW91IG1lYW4gY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wcygpPycsIHNwZWMuZGlzcGxheU5hbWUgfHwgJ0EgY29tcG9uZW50JykgOiB2b2lkIDA7XG4gICAgfVxuXG4gICAgLy8gUmVkdWNlIHRpbWUgc3BlbnQgZG9pbmcgbG9va3VwcyBieSBzZXR0aW5nIHRoZXNlIG9uIHRoZSBwcm90b3R5cGUuXG4gICAgZm9yICh2YXIgbWV0aG9kTmFtZSBpbiBSZWFjdENsYXNzSW50ZXJmYWNlKSB7XG4gICAgICBpZiAoIUNvbnN0cnVjdG9yLnByb3RvdHlwZVttZXRob2ROYW1lXSkge1xuICAgICAgICBDb25zdHJ1Y3Rvci5wcm90b3R5cGVbbWV0aG9kTmFtZV0gPSBudWxsO1xuICAgICAgfVxuICAgIH1cblxuICAgIHJldHVybiBDb25zdHJ1Y3RvcjtcbiAgfSxcblxuICBpbmplY3Rpb246IHtcbiAgICBpbmplY3RNaXhpbjogZnVuY3Rpb24gKG1peGluKSB7XG4gICAgICBpbmplY3RlZE1peGlucy5wdXNoKG1peGluKTtcbiAgICB9XG4gIH1cblxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdENsYXNzOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdENvbXBvbmVudFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIF9wcm9kSW52YXJpYW50ID0gcmVxdWlyZSgnLi9yZWFjdFByb2RJbnZhcmlhbnQnKTtcblxudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0gcmVxdWlyZSgnLi9SZWFjdE5vb3BVcGRhdGVRdWV1ZScpO1xuXG52YXIgY2FuRGVmaW5lUHJvcGVydHkgPSByZXF1aXJlKCcuL2NhbkRlZmluZVByb3BlcnR5Jyk7XG52YXIgZW1wdHlPYmplY3QgPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eU9iamVjdCcpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbi8qKlxuICogQmFzZSBjbGFzcyBoZWxwZXJzIGZvciB0aGUgdXBkYXRpbmcgc3RhdGUgb2YgYSBjb21wb25lbnQuXG4gKi9cbmZ1bmN0aW9uIFJlYWN0Q29tcG9uZW50KHByb3BzLCBjb250ZXh0LCB1cGRhdGVyKSB7XG4gIHRoaXMucHJvcHMgPSBwcm9wcztcbiAgdGhpcy5jb250ZXh0ID0gY29udGV4dDtcbiAgdGhpcy5yZWZzID0gZW1wdHlPYmplY3Q7XG4gIC8vIFdlIGluaXRpYWxpemUgdGhlIGRlZmF1bHQgdXBkYXRlciBidXQgdGhlIHJlYWwgb25lIGdldHMgaW5qZWN0ZWQgYnkgdGhlXG4gIC8vIHJlbmRlcmVyLlxuICB0aGlzLnVwZGF0ZXIgPSB1cGRhdGVyIHx8IFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlO1xufVxuXG5SZWFjdENvbXBvbmVudC5wcm90b3R5cGUuaXNSZWFjdENvbXBvbmVudCA9IHt9O1xuXG4vKipcbiAqIFNldHMgYSBzdWJzZXQgb2YgdGhlIHN0YXRlLiBBbHdheXMgdXNlIHRoaXMgdG8gbXV0YXRlXG4gKiBzdGF0ZS4gWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGB0aGlzLnN0YXRlYCB3aWxsIGJlIGltbWVkaWF0ZWx5IHVwZGF0ZWQsIHNvXG4gKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICpcbiAqIFRoZXJlIGlzIG5vIGd1YXJhbnRlZSB0aGF0IGNhbGxzIHRvIGBzZXRTdGF0ZWAgd2lsbCBydW4gc3luY2hyb25vdXNseSxcbiAqIGFzIHRoZXkgbWF5IGV2ZW50dWFsbHkgYmUgYmF0Y2hlZCB0b2dldGhlci4gIFlvdSBjYW4gcHJvdmlkZSBhbiBvcHRpb25hbFxuICogY2FsbGJhY2sgdGhhdCB3aWxsIGJlIGV4ZWN1dGVkIHdoZW4gdGhlIGNhbGwgdG8gc2V0U3RhdGUgaXMgYWN0dWFsbHlcbiAqIGNvbXBsZXRlZC5cbiAqXG4gKiBXaGVuIGEgZnVuY3Rpb24gaXMgcHJvdmlkZWQgdG8gc2V0U3RhdGUsIGl0IHdpbGwgYmUgY2FsbGVkIGF0IHNvbWUgcG9pbnQgaW5cbiAqIHRoZSBmdXR1cmUgKG5vdCBzeW5jaHJvbm91c2x5KS4gSXQgd2lsbCBiZSBjYWxsZWQgd2l0aCB0aGUgdXAgdG8gZGF0ZVxuICogY29tcG9uZW50IGFyZ3VtZW50cyAoc3RhdGUsIHByb3BzLCBjb250ZXh0KS4gVGhlc2UgdmFsdWVzIGNhbiBiZSBkaWZmZXJlbnRcbiAqIGZyb20gdGhpcy4qIGJlY2F1c2UgeW91ciBmdW5jdGlvbiBtYXkgYmUgY2FsbGVkIGFmdGVyIHJlY2VpdmVQcm9wcyBidXQgYmVmb3JlXG4gKiBzaG91bGRDb21wb25lbnRVcGRhdGUsIGFuZCB0aGlzIG5ldyBzdGF0ZSwgcHJvcHMsIGFuZCBjb250ZXh0IHdpbGwgbm90IHlldCBiZVxuICogYXNzaWduZWQgdG8gdGhpcy5cbiAqXG4gKiBAcGFyYW0ge29iamVjdHxmdW5jdGlvbn0gcGFydGlhbFN0YXRlIE5leHQgcGFydGlhbCBzdGF0ZSBvciBmdW5jdGlvbiB0b1xuICogICAgICAgIHByb2R1Y2UgbmV4dCBwYXJ0aWFsIHN0YXRlIHRvIGJlIG1lcmdlZCB3aXRoIGN1cnJlbnQgc3RhdGUuXG4gKiBAcGFyYW0gez9mdW5jdGlvbn0gY2FsbGJhY2sgQ2FsbGVkIGFmdGVyIHN0YXRlIGlzIHVwZGF0ZWQuXG4gKiBAZmluYWxcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuUmVhY3RDb21wb25lbnQucHJvdG90eXBlLnNldFN0YXRlID0gZnVuY3Rpb24gKHBhcnRpYWxTdGF0ZSwgY2FsbGJhY2spIHtcbiAgISh0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnb2JqZWN0JyB8fCB0eXBlb2YgcGFydGlhbFN0YXRlID09PSAnZnVuY3Rpb24nIHx8IHBhcnRpYWxTdGF0ZSA9PSBudWxsKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdzZXRTdGF0ZSguLi4pOiB0YWtlcyBhbiBvYmplY3Qgb2Ygc3RhdGUgdmFyaWFibGVzIHRvIHVwZGF0ZSBvciBhIGZ1bmN0aW9uIHdoaWNoIHJldHVybnMgYW4gb2JqZWN0IG9mIHN0YXRlIHZhcmlhYmxlcy4nKSA6IF9wcm9kSW52YXJpYW50KCc4NScpIDogdm9pZCAwO1xuICB0aGlzLnVwZGF0ZXIuZW5xdWV1ZVNldFN0YXRlKHRoaXMsIHBhcnRpYWxTdGF0ZSk7XG4gIGlmIChjYWxsYmFjaykge1xuICAgIHRoaXMudXBkYXRlci5lbnF1ZXVlQ2FsbGJhY2sodGhpcywgY2FsbGJhY2ssICdzZXRTdGF0ZScpO1xuICB9XG59O1xuXG4vKipcbiAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAqIGNlcnRhaW50eSB0aGF0IHdlIGFyZSAqKm5vdCoqIGluIGEgRE9NIHRyYW5zYWN0aW9uLlxuICpcbiAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAqIGNvbXBvbmVudCdzIHN0YXRlIGhhcyBjaGFuZ2VkIGJ1dCBgc2V0U3RhdGVgIHdhcyBub3QgY2FsbGVkLlxuICpcbiAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAqIGBjb21wb25lbnRXaWxsVXBkYXRlYCBhbmQgYGNvbXBvbmVudERpZFVwZGF0ZWAuXG4gKlxuICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciB1cGRhdGUgaXMgY29tcGxldGUuXG4gKiBAZmluYWxcbiAqIEBwcm90ZWN0ZWRcbiAqL1xuUmVhY3RDb21wb25lbnQucHJvdG90eXBlLmZvcmNlVXBkYXRlID0gZnVuY3Rpb24gKGNhbGxiYWNrKSB7XG4gIHRoaXMudXBkYXRlci5lbnF1ZXVlRm9yY2VVcGRhdGUodGhpcyk7XG4gIGlmIChjYWxsYmFjaykge1xuICAgIHRoaXMudXBkYXRlci5lbnF1ZXVlQ2FsbGJhY2sodGhpcywgY2FsbGJhY2ssICdmb3JjZVVwZGF0ZScpO1xuICB9XG59O1xuXG4vKipcbiAqIERlcHJlY2F0ZWQgQVBJcy4gVGhlc2UgQVBJcyB1c2VkIHRvIGV4aXN0IG9uIGNsYXNzaWMgUmVhY3QgY2xhc3NlcyBidXQgc2luY2VcbiAqIHdlIHdvdWxkIGxpa2UgdG8gZGVwcmVjYXRlIHRoZW0sIHdlJ3JlIG5vdCBnb2luZyB0byBtb3ZlIHRoZW0gb3ZlciB0byB0aGlzXG4gKiBtb2Rlcm4gYmFzZSBjbGFzcy4gSW5zdGVhZCwgd2UgZGVmaW5lIGEgZ2V0dGVyIHRoYXQgd2FybnMgaWYgaXQncyBhY2Nlc3NlZC5cbiAqL1xuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgdmFyIGRlcHJlY2F0ZWRBUElzID0ge1xuICAgIGlzTW91bnRlZDogWydpc01vdW50ZWQnLCAnSW5zdGVhZCwgbWFrZSBzdXJlIHRvIGNsZWFuIHVwIHN1YnNjcmlwdGlvbnMgYW5kIHBlbmRpbmcgcmVxdWVzdHMgaW4gJyArICdjb21wb25lbnRXaWxsVW5tb3VudCB0byBwcmV2ZW50IG1lbW9yeSBsZWFrcy4nXSxcbiAgICByZXBsYWNlU3RhdGU6IFsncmVwbGFjZVN0YXRlJywgJ1JlZmFjdG9yIHlvdXIgY29kZSB0byB1c2Ugc2V0U3RhdGUgaW5zdGVhZCAoc2VlICcgKyAnaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L2lzc3Vlcy8zMjM2KS4nXVxuICB9O1xuICB2YXIgZGVmaW5lRGVwcmVjYXRpb25XYXJuaW5nID0gZnVuY3Rpb24gKG1ldGhvZE5hbWUsIGluZm8pIHtcbiAgICBpZiAoY2FuRGVmaW5lUHJvcGVydHkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShSZWFjdENvbXBvbmVudC5wcm90b3R5cGUsIG1ldGhvZE5hbWUsIHtcbiAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICclcyguLi4pIGlzIGRlcHJlY2F0ZWQgaW4gcGxhaW4gSmF2YVNjcmlwdCBSZWFjdCBjbGFzc2VzLiAlcycsIGluZm9bMF0sIGluZm9bMV0pIDogdm9pZCAwO1xuICAgICAgICAgIHJldHVybiB1bmRlZmluZWQ7XG4gICAgICAgIH1cbiAgICAgIH0pO1xuICAgIH1cbiAgfTtcbiAgZm9yICh2YXIgZm5OYW1lIGluIGRlcHJlY2F0ZWRBUElzKSB7XG4gICAgaWYgKGRlcHJlY2F0ZWRBUElzLmhhc093blByb3BlcnR5KGZuTmFtZSkpIHtcbiAgICAgIGRlZmluZURlcHJlY2F0aW9uV2FybmluZyhmbk5hbWUsIGRlcHJlY2F0ZWRBUElzW2ZuTmFtZV0pO1xuICAgIH1cbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0Q29tcG9uZW50OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTYtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdENvbXBvbmVudFRyZWVIb29rXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX3Byb2RJbnZhcmlhbnQgPSByZXF1aXJlKCcuL3JlYWN0UHJvZEludmFyaWFudCcpO1xuXG52YXIgUmVhY3RDdXJyZW50T3duZXIgPSByZXF1aXJlKCcuL1JlYWN0Q3VycmVudE93bmVyJyk7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG5mdW5jdGlvbiBpc05hdGl2ZShmbikge1xuICAvLyBCYXNlZCBvbiBpc05hdGl2ZSgpIGZyb20gTG9kYXNoXG4gIHZhciBmdW5jVG9TdHJpbmcgPSBGdW5jdGlvbi5wcm90b3R5cGUudG9TdHJpbmc7XG4gIHZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG4gIHZhciByZUlzTmF0aXZlID0gUmVnRXhwKCdeJyArIGZ1bmNUb1N0cmluZ1xuICAvLyBUYWtlIGFuIGV4YW1wbGUgbmF0aXZlIGZ1bmN0aW9uIHNvdXJjZSBmb3IgY29tcGFyaXNvblxuICAuY2FsbChoYXNPd25Qcm9wZXJ0eSlcbiAgLy8gU3RyaXAgcmVnZXggY2hhcmFjdGVycyBzbyB3ZSBjYW4gdXNlIGl0IGZvciByZWdleFxuICAucmVwbGFjZSgvW1xcXFxeJC4qKz8oKVtcXF17fXxdL2csICdcXFxcJCYnKVxuICAvLyBSZW1vdmUgaGFzT3duUHJvcGVydHkgZnJvbSB0aGUgdGVtcGxhdGUgdG8gbWFrZSBpdCBnZW5lcmljXG4gIC5yZXBsYWNlKC9oYXNPd25Qcm9wZXJ0eXwoZnVuY3Rpb24pLio/KD89XFxcXFxcKCl8IGZvciAuKz8oPz1cXFxcXFxdKS9nLCAnJDEuKj8nKSArICckJyk7XG4gIHRyeSB7XG4gICAgdmFyIHNvdXJjZSA9IGZ1bmNUb1N0cmluZy5jYWxsKGZuKTtcbiAgICByZXR1cm4gcmVJc05hdGl2ZS50ZXN0KHNvdXJjZSk7XG4gIH0gY2F0Y2ggKGVycikge1xuICAgIHJldHVybiBmYWxzZTtcbiAgfVxufVxuXG52YXIgY2FuVXNlQ29sbGVjdGlvbnMgPVxuLy8gQXJyYXkuZnJvbVxudHlwZW9mIEFycmF5LmZyb20gPT09ICdmdW5jdGlvbicgJiZcbi8vIE1hcFxudHlwZW9mIE1hcCA9PT0gJ2Z1bmN0aW9uJyAmJiBpc05hdGl2ZShNYXApICYmXG4vLyBNYXAucHJvdG90eXBlLmtleXNcbk1hcC5wcm90b3R5cGUgIT0gbnVsbCAmJiB0eXBlb2YgTWFwLnByb3RvdHlwZS5rZXlzID09PSAnZnVuY3Rpb24nICYmIGlzTmF0aXZlKE1hcC5wcm90b3R5cGUua2V5cykgJiZcbi8vIFNldFxudHlwZW9mIFNldCA9PT0gJ2Z1bmN0aW9uJyAmJiBpc05hdGl2ZShTZXQpICYmXG4vLyBTZXQucHJvdG90eXBlLmtleXNcblNldC5wcm90b3R5cGUgIT0gbnVsbCAmJiB0eXBlb2YgU2V0LnByb3RvdHlwZS5rZXlzID09PSAnZnVuY3Rpb24nICYmIGlzTmF0aXZlKFNldC5wcm90b3R5cGUua2V5cyk7XG5cbnZhciBpdGVtTWFwO1xudmFyIHJvb3RJRFNldDtcblxudmFyIGl0ZW1CeUtleTtcbnZhciByb290QnlLZXk7XG5cbmlmIChjYW5Vc2VDb2xsZWN0aW9ucykge1xuICBpdGVtTWFwID0gbmV3IE1hcCgpO1xuICByb290SURTZXQgPSBuZXcgU2V0KCk7XG59IGVsc2Uge1xuICBpdGVtQnlLZXkgPSB7fTtcbiAgcm9vdEJ5S2V5ID0ge307XG59XG5cbnZhciB1bm1vdW50ZWRJRHMgPSBbXTtcblxuLy8gVXNlIG5vbi1udW1lcmljIGtleXMgdG8gcHJldmVudCBWOCBwZXJmb3JtYW5jZSBpc3N1ZXM6XG4vLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvcHVsbC83MjMyXG5mdW5jdGlvbiBnZXRLZXlGcm9tSUQoaWQpIHtcbiAgcmV0dXJuICcuJyArIGlkO1xufVxuZnVuY3Rpb24gZ2V0SURGcm9tS2V5KGtleSkge1xuICByZXR1cm4gcGFyc2VJbnQoa2V5LnN1YnN0cigxKSwgMTApO1xufVxuXG5mdW5jdGlvbiBnZXQoaWQpIHtcbiAgaWYgKGNhblVzZUNvbGxlY3Rpb25zKSB7XG4gICAgcmV0dXJuIGl0ZW1NYXAuZ2V0KGlkKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIga2V5ID0gZ2V0S2V5RnJvbUlEKGlkKTtcbiAgICByZXR1cm4gaXRlbUJ5S2V5W2tleV07XG4gIH1cbn1cblxuZnVuY3Rpb24gcmVtb3ZlKGlkKSB7XG4gIGlmIChjYW5Vc2VDb2xsZWN0aW9ucykge1xuICAgIGl0ZW1NYXBbJ2RlbGV0ZSddKGlkKTtcbiAgfSBlbHNlIHtcbiAgICB2YXIga2V5ID0gZ2V0S2V5RnJvbUlEKGlkKTtcbiAgICBkZWxldGUgaXRlbUJ5S2V5W2tleV07XG4gIH1cbn1cblxuZnVuY3Rpb24gY3JlYXRlKGlkLCBlbGVtZW50LCBwYXJlbnRJRCkge1xuICB2YXIgaXRlbSA9IHtcbiAgICBlbGVtZW50OiBlbGVtZW50LFxuICAgIHBhcmVudElEOiBwYXJlbnRJRCxcbiAgICB0ZXh0OiBudWxsLFxuICAgIGNoaWxkSURzOiBbXSxcbiAgICBpc01vdW50ZWQ6IGZhbHNlLFxuICAgIHVwZGF0ZUNvdW50OiAwXG4gIH07XG5cbiAgaWYgKGNhblVzZUNvbGxlY3Rpb25zKSB7XG4gICAgaXRlbU1hcC5zZXQoaWQsIGl0ZW0pO1xuICB9IGVsc2Uge1xuICAgIHZhciBrZXkgPSBnZXRLZXlGcm9tSUQoaWQpO1xuICAgIGl0ZW1CeUtleVtrZXldID0gaXRlbTtcbiAgfVxufVxuXG5mdW5jdGlvbiBhZGRSb290KGlkKSB7XG4gIGlmIChjYW5Vc2VDb2xsZWN0aW9ucykge1xuICAgIHJvb3RJRFNldC5hZGQoaWQpO1xuICB9IGVsc2Uge1xuICAgIHZhciBrZXkgPSBnZXRLZXlGcm9tSUQoaWQpO1xuICAgIHJvb3RCeUtleVtrZXldID0gdHJ1ZTtcbiAgfVxufVxuXG5mdW5jdGlvbiByZW1vdmVSb290KGlkKSB7XG4gIGlmIChjYW5Vc2VDb2xsZWN0aW9ucykge1xuICAgIHJvb3RJRFNldFsnZGVsZXRlJ10oaWQpO1xuICB9IGVsc2Uge1xuICAgIHZhciBrZXkgPSBnZXRLZXlGcm9tSUQoaWQpO1xuICAgIGRlbGV0ZSByb290QnlLZXlba2V5XTtcbiAgfVxufVxuXG5mdW5jdGlvbiBnZXRSZWdpc3RlcmVkSURzKCkge1xuICBpZiAoY2FuVXNlQ29sbGVjdGlvbnMpIHtcbiAgICByZXR1cm4gQXJyYXkuZnJvbShpdGVtTWFwLmtleXMoKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKGl0ZW1CeUtleSkubWFwKGdldElERnJvbUtleSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZ2V0Um9vdElEcygpIHtcbiAgaWYgKGNhblVzZUNvbGxlY3Rpb25zKSB7XG4gICAgcmV0dXJuIEFycmF5LmZyb20ocm9vdElEU2V0LmtleXMoKSk7XG4gIH0gZWxzZSB7XG4gICAgcmV0dXJuIE9iamVjdC5rZXlzKHJvb3RCeUtleSkubWFwKGdldElERnJvbUtleSk7XG4gIH1cbn1cblxuZnVuY3Rpb24gcHVyZ2VEZWVwKGlkKSB7XG4gIHZhciBpdGVtID0gZ2V0KGlkKTtcbiAgaWYgKGl0ZW0pIHtcbiAgICB2YXIgY2hpbGRJRHMgPSBpdGVtLmNoaWxkSURzO1xuXG4gICAgcmVtb3ZlKGlkKTtcbiAgICBjaGlsZElEcy5mb3JFYWNoKHB1cmdlRGVlcCk7XG4gIH1cbn1cblxuZnVuY3Rpb24gZGVzY3JpYmVDb21wb25lbnRGcmFtZShuYW1lLCBzb3VyY2UsIG93bmVyTmFtZSkge1xuICByZXR1cm4gJ1xcbiAgICBpbiAnICsgbmFtZSArIChzb3VyY2UgPyAnIChhdCAnICsgc291cmNlLmZpbGVOYW1lLnJlcGxhY2UoL14uKltcXFxcXFwvXS8sICcnKSArICc6JyArIHNvdXJjZS5saW5lTnVtYmVyICsgJyknIDogb3duZXJOYW1lID8gJyAoY3JlYXRlZCBieSAnICsgb3duZXJOYW1lICsgJyknIDogJycpO1xufVxuXG5mdW5jdGlvbiBnZXREaXNwbGF5TmFtZShlbGVtZW50KSB7XG4gIGlmIChlbGVtZW50ID09IG51bGwpIHtcbiAgICByZXR1cm4gJyNlbXB0eSc7XG4gIH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBlbGVtZW50ID09PSAnbnVtYmVyJykge1xuICAgIHJldHVybiAnI3RleHQnO1xuICB9IGVsc2UgaWYgKHR5cGVvZiBlbGVtZW50LnR5cGUgPT09ICdzdHJpbmcnKSB7XG4gICAgcmV0dXJuIGVsZW1lbnQudHlwZTtcbiAgfSBlbHNlIHtcbiAgICByZXR1cm4gZWxlbWVudC50eXBlLmRpc3BsYXlOYW1lIHx8IGVsZW1lbnQudHlwZS5uYW1lIHx8ICdVbmtub3duJztcbiAgfVxufVxuXG5mdW5jdGlvbiBkZXNjcmliZUlEKGlkKSB7XG4gIHZhciBuYW1lID0gUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXREaXNwbGF5TmFtZShpZCk7XG4gIHZhciBlbGVtZW50ID0gUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXRFbGVtZW50KGlkKTtcbiAgdmFyIG93bmVySUQgPSBSZWFjdENvbXBvbmVudFRyZWVIb29rLmdldE93bmVySUQoaWQpO1xuICB2YXIgb3duZXJOYW1lO1xuICBpZiAob3duZXJJRCkge1xuICAgIG93bmVyTmFtZSA9IFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0RGlzcGxheU5hbWUob3duZXJJRCk7XG4gIH1cbiAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZWxlbWVudCwgJ1JlYWN0Q29tcG9uZW50VHJlZUhvb2s6IE1pc3NpbmcgUmVhY3QgZWxlbWVudCBmb3IgZGVidWdJRCAlcyB3aGVuICcgKyAnYnVpbGRpbmcgc3RhY2snLCBpZCkgOiB2b2lkIDA7XG4gIHJldHVybiBkZXNjcmliZUNvbXBvbmVudEZyYW1lKG5hbWUsIGVsZW1lbnQgJiYgZWxlbWVudC5fc291cmNlLCBvd25lck5hbWUpO1xufVxuXG52YXIgUmVhY3RDb21wb25lbnRUcmVlSG9vayA9IHtcbiAgb25TZXRDaGlsZHJlbjogZnVuY3Rpb24gKGlkLCBuZXh0Q2hpbGRJRHMpIHtcbiAgICB2YXIgaXRlbSA9IGdldChpZCk7XG4gICAgaXRlbS5jaGlsZElEcyA9IG5leHRDaGlsZElEcztcblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgbmV4dENoaWxkSURzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgbmV4dENoaWxkSUQgPSBuZXh0Q2hpbGRJRHNbaV07XG4gICAgICB2YXIgbmV4dENoaWxkID0gZ2V0KG5leHRDaGlsZElEKTtcbiAgICAgICFuZXh0Q2hpbGQgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnRXhwZWN0ZWQgaG9vayBldmVudHMgdG8gZmlyZSBmb3IgdGhlIGNoaWxkIGJlZm9yZSBpdHMgcGFyZW50IGluY2x1ZGVzIGl0IGluIG9uU2V0Q2hpbGRyZW4oKS4nKSA6IF9wcm9kSW52YXJpYW50KCcxNDAnKSA6IHZvaWQgMDtcbiAgICAgICEobmV4dENoaWxkLmNoaWxkSURzICE9IG51bGwgfHwgdHlwZW9mIG5leHRDaGlsZC5lbGVtZW50ICE9PSAnb2JqZWN0JyB8fCBuZXh0Q2hpbGQuZWxlbWVudCA9PSBudWxsKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdFeHBlY3RlZCBvblNldENoaWxkcmVuKCkgdG8gZmlyZSBmb3IgYSBjb250YWluZXIgY2hpbGQgYmVmb3JlIGl0cyBwYXJlbnQgaW5jbHVkZXMgaXQgaW4gb25TZXRDaGlsZHJlbigpLicpIDogX3Byb2RJbnZhcmlhbnQoJzE0MScpIDogdm9pZCAwO1xuICAgICAgIW5leHRDaGlsZC5pc01vdW50ZWQgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnRXhwZWN0ZWQgb25Nb3VudENvbXBvbmVudCgpIHRvIGZpcmUgZm9yIHRoZSBjaGlsZCBiZWZvcmUgaXRzIHBhcmVudCBpbmNsdWRlcyBpdCBpbiBvblNldENoaWxkcmVuKCkuJykgOiBfcHJvZEludmFyaWFudCgnNzEnKSA6IHZvaWQgMDtcbiAgICAgIGlmIChuZXh0Q2hpbGQucGFyZW50SUQgPT0gbnVsbCkge1xuICAgICAgICBuZXh0Q2hpbGQucGFyZW50SUQgPSBpZDtcbiAgICAgICAgLy8gVE9ETzogVGhpcyBzaG91bGRuJ3QgYmUgbmVjZXNzYXJ5IGJ1dCBtb3VudGluZyBhIG5ldyByb290IGR1cmluZyBpblxuICAgICAgICAvLyBjb21wb25lbnRXaWxsTW91bnQgY3VycmVudGx5IGNhdXNlcyBub3QteWV0LW1vdW50ZWQgY29tcG9uZW50cyB0b1xuICAgICAgICAvLyBiZSBwdXJnZWQgZnJvbSBvdXIgdHJlZSBkYXRhIHNvIHRoZWlyIHBhcmVudCBJRCBpcyBtaXNzaW5nLlxuICAgICAgfVxuICAgICAgIShuZXh0Q2hpbGQucGFyZW50SUQgPT09IGlkKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdFeHBlY3RlZCBvbkJlZm9yZU1vdW50Q29tcG9uZW50KCkgcGFyZW50IGFuZCBvblNldENoaWxkcmVuKCkgdG8gYmUgY29uc2lzdGVudCAoJXMgaGFzIHBhcmVudHMgJXMgYW5kICVzKS4nLCBuZXh0Q2hpbGRJRCwgbmV4dENoaWxkLnBhcmVudElELCBpZCkgOiBfcHJvZEludmFyaWFudCgnMTQyJywgbmV4dENoaWxkSUQsIG5leHRDaGlsZC5wYXJlbnRJRCwgaWQpIDogdm9pZCAwO1xuICAgIH1cbiAgfSxcbiAgb25CZWZvcmVNb3VudENvbXBvbmVudDogZnVuY3Rpb24gKGlkLCBlbGVtZW50LCBwYXJlbnRJRCkge1xuICAgIGNyZWF0ZShpZCwgZWxlbWVudCwgcGFyZW50SUQpO1xuICB9LFxuICBvbkJlZm9yZVVwZGF0ZUNvbXBvbmVudDogZnVuY3Rpb24gKGlkLCBlbGVtZW50KSB7XG4gICAgdmFyIGl0ZW0gPSBnZXQoaWQpO1xuICAgIGlmICghaXRlbSB8fCAhaXRlbS5pc01vdW50ZWQpIHtcbiAgICAgIC8vIFdlIG1heSBlbmQgdXAgaGVyZSBhcyBhIHJlc3VsdCBvZiBzZXRTdGF0ZSgpIGluIGNvbXBvbmVudFdpbGxVbm1vdW50KCkuXG4gICAgICAvLyBJbiB0aGlzIGNhc2UsIGlnbm9yZSB0aGUgZWxlbWVudC5cbiAgICAgIHJldHVybjtcbiAgICB9XG4gICAgaXRlbS5lbGVtZW50ID0gZWxlbWVudDtcbiAgfSxcbiAgb25Nb3VudENvbXBvbmVudDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXQoaWQpO1xuICAgIGl0ZW0uaXNNb3VudGVkID0gdHJ1ZTtcbiAgICB2YXIgaXNSb290ID0gaXRlbS5wYXJlbnRJRCA9PT0gMDtcbiAgICBpZiAoaXNSb290KSB7XG4gICAgICBhZGRSb290KGlkKTtcbiAgICB9XG4gIH0sXG4gIG9uVXBkYXRlQ29tcG9uZW50OiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgaXRlbSA9IGdldChpZCk7XG4gICAgaWYgKCFpdGVtIHx8ICFpdGVtLmlzTW91bnRlZCkge1xuICAgICAgLy8gV2UgbWF5IGVuZCB1cCBoZXJlIGFzIGEgcmVzdWx0IG9mIHNldFN0YXRlKCkgaW4gY29tcG9uZW50V2lsbFVubW91bnQoKS5cbiAgICAgIC8vIEluIHRoaXMgY2FzZSwgaWdub3JlIHRoZSBlbGVtZW50LlxuICAgICAgcmV0dXJuO1xuICAgIH1cbiAgICBpdGVtLnVwZGF0ZUNvdW50Kys7XG4gIH0sXG4gIG9uVW5tb3VudENvbXBvbmVudDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXQoaWQpO1xuICAgIGlmIChpdGVtKSB7XG4gICAgICAvLyBXZSBuZWVkIHRvIGNoZWNrIGlmIGl0IGV4aXN0cy5cbiAgICAgIC8vIGBpdGVtYCBtaWdodCBub3QgZXhpc3QgaWYgaXQgaXMgaW5zaWRlIGFuIGVycm9yIGJvdW5kYXJ5LCBhbmQgYSBzaWJsaW5nXG4gICAgICAvLyBlcnJvciBib3VuZGFyeSBjaGlsZCB0aHJldyB3aGlsZSBtb3VudGluZy4gVGhlbiB0aGlzIGluc3RhbmNlIG5ldmVyXG4gICAgICAvLyBnb3QgYSBjaGFuY2UgdG8gbW91bnQsIGJ1dCBpdCBzdGlsbCBnZXRzIGFuIHVubW91bnRpbmcgZXZlbnQgZHVyaW5nXG4gICAgICAvLyB0aGUgZXJyb3IgYm91bmRhcnkgY2xlYW51cC5cbiAgICAgIGl0ZW0uaXNNb3VudGVkID0gZmFsc2U7XG4gICAgICB2YXIgaXNSb290ID0gaXRlbS5wYXJlbnRJRCA9PT0gMDtcbiAgICAgIGlmIChpc1Jvb3QpIHtcbiAgICAgICAgcmVtb3ZlUm9vdChpZCk7XG4gICAgICB9XG4gICAgfVxuICAgIHVubW91bnRlZElEcy5wdXNoKGlkKTtcbiAgfSxcbiAgcHVyZ2VVbm1vdW50ZWRDb21wb25lbnRzOiBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKFJlYWN0Q29tcG9uZW50VHJlZUhvb2suX3ByZXZlbnRQdXJnaW5nKSB7XG4gICAgICAvLyBTaG91bGQgb25seSBiZSB1c2VkIGZvciB0ZXN0aW5nLlxuICAgICAgcmV0dXJuO1xuICAgIH1cblxuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgdW5tb3VudGVkSURzLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgaWQgPSB1bm1vdW50ZWRJRHNbaV07XG4gICAgICBwdXJnZURlZXAoaWQpO1xuICAgIH1cbiAgICB1bm1vdW50ZWRJRHMubGVuZ3RoID0gMDtcbiAgfSxcbiAgaXNNb3VudGVkOiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgaXRlbSA9IGdldChpZCk7XG4gICAgcmV0dXJuIGl0ZW0gPyBpdGVtLmlzTW91bnRlZCA6IGZhbHNlO1xuICB9LFxuICBnZXRDdXJyZW50U3RhY2tBZGRlbmR1bTogZnVuY3Rpb24gKHRvcEVsZW1lbnQpIHtcbiAgICB2YXIgaW5mbyA9ICcnO1xuICAgIGlmICh0b3BFbGVtZW50KSB7XG4gICAgICB2YXIgdHlwZSA9IHRvcEVsZW1lbnQudHlwZTtcbiAgICAgIHZhciBuYW1lID0gdHlwZW9mIHR5cGUgPT09ICdmdW5jdGlvbicgPyB0eXBlLmRpc3BsYXlOYW1lIHx8IHR5cGUubmFtZSA6IHR5cGU7XG4gICAgICB2YXIgb3duZXIgPSB0b3BFbGVtZW50Ll9vd25lcjtcbiAgICAgIGluZm8gKz0gZGVzY3JpYmVDb21wb25lbnRGcmFtZShuYW1lIHx8ICdVbmtub3duJywgdG9wRWxlbWVudC5fc291cmNlLCBvd25lciAmJiBvd25lci5nZXROYW1lKCkpO1xuICAgIH1cblxuICAgIHZhciBjdXJyZW50T3duZXIgPSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50O1xuICAgIHZhciBpZCA9IGN1cnJlbnRPd25lciAmJiBjdXJyZW50T3duZXIuX2RlYnVnSUQ7XG5cbiAgICBpbmZvICs9IFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0U3RhY2tBZGRlbmR1bUJ5SUQoaWQpO1xuICAgIHJldHVybiBpbmZvO1xuICB9LFxuICBnZXRTdGFja0FkZGVuZHVtQnlJRDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGluZm8gPSAnJztcbiAgICB3aGlsZSAoaWQpIHtcbiAgICAgIGluZm8gKz0gZGVzY3JpYmVJRChpZCk7XG4gICAgICBpZCA9IFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0UGFyZW50SUQoaWQpO1xuICAgIH1cbiAgICByZXR1cm4gaW5mbztcbiAgfSxcbiAgZ2V0Q2hpbGRJRHM6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBpdGVtID0gZ2V0KGlkKTtcbiAgICByZXR1cm4gaXRlbSA/IGl0ZW0uY2hpbGRJRHMgOiBbXTtcbiAgfSxcbiAgZ2V0RGlzcGxheU5hbWU6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBlbGVtZW50ID0gUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXRFbGVtZW50KGlkKTtcbiAgICBpZiAoIWVsZW1lbnQpIHtcbiAgICAgIHJldHVybiBudWxsO1xuICAgIH1cbiAgICByZXR1cm4gZ2V0RGlzcGxheU5hbWUoZWxlbWVudCk7XG4gIH0sXG4gIGdldEVsZW1lbnQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBpdGVtID0gZ2V0KGlkKTtcbiAgICByZXR1cm4gaXRlbSA/IGl0ZW0uZWxlbWVudCA6IG51bGw7XG4gIH0sXG4gIGdldE93bmVySUQ6IGZ1bmN0aW9uIChpZCkge1xuICAgIHZhciBlbGVtZW50ID0gUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXRFbGVtZW50KGlkKTtcbiAgICBpZiAoIWVsZW1lbnQgfHwgIWVsZW1lbnQuX293bmVyKSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gICAgcmV0dXJuIGVsZW1lbnQuX293bmVyLl9kZWJ1Z0lEO1xuICB9LFxuICBnZXRQYXJlbnRJRDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXQoaWQpO1xuICAgIHJldHVybiBpdGVtID8gaXRlbS5wYXJlbnRJRCA6IG51bGw7XG4gIH0sXG4gIGdldFNvdXJjZTogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGl0ZW0gPSBnZXQoaWQpO1xuICAgIHZhciBlbGVtZW50ID0gaXRlbSA/IGl0ZW0uZWxlbWVudCA6IG51bGw7XG4gICAgdmFyIHNvdXJjZSA9IGVsZW1lbnQgIT0gbnVsbCA/IGVsZW1lbnQuX3NvdXJjZSA6IG51bGw7XG4gICAgcmV0dXJuIHNvdXJjZTtcbiAgfSxcbiAgZ2V0VGV4dDogZnVuY3Rpb24gKGlkKSB7XG4gICAgdmFyIGVsZW1lbnQgPSBSZWFjdENvbXBvbmVudFRyZWVIb29rLmdldEVsZW1lbnQoaWQpO1xuICAgIGlmICh0eXBlb2YgZWxlbWVudCA9PT0gJ3N0cmluZycpIHtcbiAgICAgIHJldHVybiBlbGVtZW50O1xuICAgIH0gZWxzZSBpZiAodHlwZW9mIGVsZW1lbnQgPT09ICdudW1iZXInKSB7XG4gICAgICByZXR1cm4gJycgKyBlbGVtZW50O1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gbnVsbDtcbiAgICB9XG4gIH0sXG4gIGdldFVwZGF0ZUNvdW50OiBmdW5jdGlvbiAoaWQpIHtcbiAgICB2YXIgaXRlbSA9IGdldChpZCk7XG4gICAgcmV0dXJuIGl0ZW0gPyBpdGVtLnVwZGF0ZUNvdW50IDogMDtcbiAgfSxcblxuXG4gIGdldFJlZ2lzdGVyZWRJRHM6IGdldFJlZ2lzdGVyZWRJRHMsXG5cbiAgZ2V0Um9vdElEczogZ2V0Um9vdElEc1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdENvbXBvbmVudFRyZWVIb29rOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdEN1cnJlbnRPd25lclxuICovXG5cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBLZWVwcyB0cmFjayBvZiB0aGUgY3VycmVudCBvd25lci5cbiAqXG4gKiBUaGUgY3VycmVudCBvd25lciBpcyB0aGUgY29tcG9uZW50IHdobyBzaG91bGQgb3duIGFueSBjb21wb25lbnRzIHRoYXQgYXJlXG4gKiBjdXJyZW50bHkgYmVpbmcgY29uc3RydWN0ZWQuXG4gKi9cblxudmFyIFJlYWN0Q3VycmVudE93bmVyID0ge1xuXG4gIC8qKlxuICAgKiBAaW50ZXJuYWxcbiAgICogQHR5cGUge1JlYWN0Q29tcG9uZW50fVxuICAgKi9cbiAgY3VycmVudDogbnVsbFxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0Q3VycmVudE93bmVyOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdERPTUZhY3Rvcmllc1xuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vUmVhY3RFbGVtZW50Jyk7XG5cbi8qKlxuICogQ3JlYXRlIGEgZmFjdG9yeSB0aGF0IGNyZWF0ZXMgSFRNTCB0YWcgZWxlbWVudHMuXG4gKlxuICogQHByaXZhdGVcbiAqL1xudmFyIGNyZWF0ZURPTUZhY3RvcnkgPSBSZWFjdEVsZW1lbnQuY3JlYXRlRmFjdG9yeTtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHZhciBSZWFjdEVsZW1lbnRWYWxpZGF0b3IgPSByZXF1aXJlKCcuL1JlYWN0RWxlbWVudFZhbGlkYXRvcicpO1xuICBjcmVhdGVET01GYWN0b3J5ID0gUmVhY3RFbGVtZW50VmFsaWRhdG9yLmNyZWF0ZUZhY3Rvcnk7XG59XG5cbi8qKlxuICogQ3JlYXRlcyBhIG1hcHBpbmcgZnJvbSBzdXBwb3J0ZWQgSFRNTCB0YWdzIHRvIGBSZWFjdERPTUNvbXBvbmVudGAgY2xhc3Nlcy5cbiAqIFRoaXMgaXMgYWxzbyBhY2Nlc3NpYmxlIHZpYSBgUmVhY3QuRE9NYC5cbiAqXG4gKiBAcHVibGljXG4gKi9cbnZhciBSZWFjdERPTUZhY3RvcmllcyA9IHtcbiAgYTogY3JlYXRlRE9NRmFjdG9yeSgnYScpLFxuICBhYmJyOiBjcmVhdGVET01GYWN0b3J5KCdhYmJyJyksXG4gIGFkZHJlc3M6IGNyZWF0ZURPTUZhY3RvcnkoJ2FkZHJlc3MnKSxcbiAgYXJlYTogY3JlYXRlRE9NRmFjdG9yeSgnYXJlYScpLFxuICBhcnRpY2xlOiBjcmVhdGVET01GYWN0b3J5KCdhcnRpY2xlJyksXG4gIGFzaWRlOiBjcmVhdGVET01GYWN0b3J5KCdhc2lkZScpLFxuICBhdWRpbzogY3JlYXRlRE9NRmFjdG9yeSgnYXVkaW8nKSxcbiAgYjogY3JlYXRlRE9NRmFjdG9yeSgnYicpLFxuICBiYXNlOiBjcmVhdGVET01GYWN0b3J5KCdiYXNlJyksXG4gIGJkaTogY3JlYXRlRE9NRmFjdG9yeSgnYmRpJyksXG4gIGJkbzogY3JlYXRlRE9NRmFjdG9yeSgnYmRvJyksXG4gIGJpZzogY3JlYXRlRE9NRmFjdG9yeSgnYmlnJyksXG4gIGJsb2NrcXVvdGU6IGNyZWF0ZURPTUZhY3RvcnkoJ2Jsb2NrcXVvdGUnKSxcbiAgYm9keTogY3JlYXRlRE9NRmFjdG9yeSgnYm9keScpLFxuICBicjogY3JlYXRlRE9NRmFjdG9yeSgnYnInKSxcbiAgYnV0dG9uOiBjcmVhdGVET01GYWN0b3J5KCdidXR0b24nKSxcbiAgY2FudmFzOiBjcmVhdGVET01GYWN0b3J5KCdjYW52YXMnKSxcbiAgY2FwdGlvbjogY3JlYXRlRE9NRmFjdG9yeSgnY2FwdGlvbicpLFxuICBjaXRlOiBjcmVhdGVET01GYWN0b3J5KCdjaXRlJyksXG4gIGNvZGU6IGNyZWF0ZURPTUZhY3RvcnkoJ2NvZGUnKSxcbiAgY29sOiBjcmVhdGVET01GYWN0b3J5KCdjb2wnKSxcbiAgY29sZ3JvdXA6IGNyZWF0ZURPTUZhY3RvcnkoJ2NvbGdyb3VwJyksXG4gIGRhdGE6IGNyZWF0ZURPTUZhY3RvcnkoJ2RhdGEnKSxcbiAgZGF0YWxpc3Q6IGNyZWF0ZURPTUZhY3RvcnkoJ2RhdGFsaXN0JyksXG4gIGRkOiBjcmVhdGVET01GYWN0b3J5KCdkZCcpLFxuICBkZWw6IGNyZWF0ZURPTUZhY3RvcnkoJ2RlbCcpLFxuICBkZXRhaWxzOiBjcmVhdGVET01GYWN0b3J5KCdkZXRhaWxzJyksXG4gIGRmbjogY3JlYXRlRE9NRmFjdG9yeSgnZGZuJyksXG4gIGRpYWxvZzogY3JlYXRlRE9NRmFjdG9yeSgnZGlhbG9nJyksXG4gIGRpdjogY3JlYXRlRE9NRmFjdG9yeSgnZGl2JyksXG4gIGRsOiBjcmVhdGVET01GYWN0b3J5KCdkbCcpLFxuICBkdDogY3JlYXRlRE9NRmFjdG9yeSgnZHQnKSxcbiAgZW06IGNyZWF0ZURPTUZhY3RvcnkoJ2VtJyksXG4gIGVtYmVkOiBjcmVhdGVET01GYWN0b3J5KCdlbWJlZCcpLFxuICBmaWVsZHNldDogY3JlYXRlRE9NRmFjdG9yeSgnZmllbGRzZXQnKSxcbiAgZmlnY2FwdGlvbjogY3JlYXRlRE9NRmFjdG9yeSgnZmlnY2FwdGlvbicpLFxuICBmaWd1cmU6IGNyZWF0ZURPTUZhY3RvcnkoJ2ZpZ3VyZScpLFxuICBmb290ZXI6IGNyZWF0ZURPTUZhY3RvcnkoJ2Zvb3RlcicpLFxuICBmb3JtOiBjcmVhdGVET01GYWN0b3J5KCdmb3JtJyksXG4gIGgxOiBjcmVhdGVET01GYWN0b3J5KCdoMScpLFxuICBoMjogY3JlYXRlRE9NRmFjdG9yeSgnaDInKSxcbiAgaDM6IGNyZWF0ZURPTUZhY3RvcnkoJ2gzJyksXG4gIGg0OiBjcmVhdGVET01GYWN0b3J5KCdoNCcpLFxuICBoNTogY3JlYXRlRE9NRmFjdG9yeSgnaDUnKSxcbiAgaDY6IGNyZWF0ZURPTUZhY3RvcnkoJ2g2JyksXG4gIGhlYWQ6IGNyZWF0ZURPTUZhY3RvcnkoJ2hlYWQnKSxcbiAgaGVhZGVyOiBjcmVhdGVET01GYWN0b3J5KCdoZWFkZXInKSxcbiAgaGdyb3VwOiBjcmVhdGVET01GYWN0b3J5KCdoZ3JvdXAnKSxcbiAgaHI6IGNyZWF0ZURPTUZhY3RvcnkoJ2hyJyksXG4gIGh0bWw6IGNyZWF0ZURPTUZhY3RvcnkoJ2h0bWwnKSxcbiAgaTogY3JlYXRlRE9NRmFjdG9yeSgnaScpLFxuICBpZnJhbWU6IGNyZWF0ZURPTUZhY3RvcnkoJ2lmcmFtZScpLFxuICBpbWc6IGNyZWF0ZURPTUZhY3RvcnkoJ2ltZycpLFxuICBpbnB1dDogY3JlYXRlRE9NRmFjdG9yeSgnaW5wdXQnKSxcbiAgaW5zOiBjcmVhdGVET01GYWN0b3J5KCdpbnMnKSxcbiAga2JkOiBjcmVhdGVET01GYWN0b3J5KCdrYmQnKSxcbiAga2V5Z2VuOiBjcmVhdGVET01GYWN0b3J5KCdrZXlnZW4nKSxcbiAgbGFiZWw6IGNyZWF0ZURPTUZhY3RvcnkoJ2xhYmVsJyksXG4gIGxlZ2VuZDogY3JlYXRlRE9NRmFjdG9yeSgnbGVnZW5kJyksXG4gIGxpOiBjcmVhdGVET01GYWN0b3J5KCdsaScpLFxuICBsaW5rOiBjcmVhdGVET01GYWN0b3J5KCdsaW5rJyksXG4gIG1haW46IGNyZWF0ZURPTUZhY3RvcnkoJ21haW4nKSxcbiAgbWFwOiBjcmVhdGVET01GYWN0b3J5KCdtYXAnKSxcbiAgbWFyazogY3JlYXRlRE9NRmFjdG9yeSgnbWFyaycpLFxuICBtZW51OiBjcmVhdGVET01GYWN0b3J5KCdtZW51JyksXG4gIG1lbnVpdGVtOiBjcmVhdGVET01GYWN0b3J5KCdtZW51aXRlbScpLFxuICBtZXRhOiBjcmVhdGVET01GYWN0b3J5KCdtZXRhJyksXG4gIG1ldGVyOiBjcmVhdGVET01GYWN0b3J5KCdtZXRlcicpLFxuICBuYXY6IGNyZWF0ZURPTUZhY3RvcnkoJ25hdicpLFxuICBub3NjcmlwdDogY3JlYXRlRE9NRmFjdG9yeSgnbm9zY3JpcHQnKSxcbiAgb2JqZWN0OiBjcmVhdGVET01GYWN0b3J5KCdvYmplY3QnKSxcbiAgb2w6IGNyZWF0ZURPTUZhY3RvcnkoJ29sJyksXG4gIG9wdGdyb3VwOiBjcmVhdGVET01GYWN0b3J5KCdvcHRncm91cCcpLFxuICBvcHRpb246IGNyZWF0ZURPTUZhY3RvcnkoJ29wdGlvbicpLFxuICBvdXRwdXQ6IGNyZWF0ZURPTUZhY3RvcnkoJ291dHB1dCcpLFxuICBwOiBjcmVhdGVET01GYWN0b3J5KCdwJyksXG4gIHBhcmFtOiBjcmVhdGVET01GYWN0b3J5KCdwYXJhbScpLFxuICBwaWN0dXJlOiBjcmVhdGVET01GYWN0b3J5KCdwaWN0dXJlJyksXG4gIHByZTogY3JlYXRlRE9NRmFjdG9yeSgncHJlJyksXG4gIHByb2dyZXNzOiBjcmVhdGVET01GYWN0b3J5KCdwcm9ncmVzcycpLFxuICBxOiBjcmVhdGVET01GYWN0b3J5KCdxJyksXG4gIHJwOiBjcmVhdGVET01GYWN0b3J5KCdycCcpLFxuICBydDogY3JlYXRlRE9NRmFjdG9yeSgncnQnKSxcbiAgcnVieTogY3JlYXRlRE9NRmFjdG9yeSgncnVieScpLFxuICBzOiBjcmVhdGVET01GYWN0b3J5KCdzJyksXG4gIHNhbXA6IGNyZWF0ZURPTUZhY3RvcnkoJ3NhbXAnKSxcbiAgc2NyaXB0OiBjcmVhdGVET01GYWN0b3J5KCdzY3JpcHQnKSxcbiAgc2VjdGlvbjogY3JlYXRlRE9NRmFjdG9yeSgnc2VjdGlvbicpLFxuICBzZWxlY3Q6IGNyZWF0ZURPTUZhY3RvcnkoJ3NlbGVjdCcpLFxuICBzbWFsbDogY3JlYXRlRE9NRmFjdG9yeSgnc21hbGwnKSxcbiAgc291cmNlOiBjcmVhdGVET01GYWN0b3J5KCdzb3VyY2UnKSxcbiAgc3BhbjogY3JlYXRlRE9NRmFjdG9yeSgnc3BhbicpLFxuICBzdHJvbmc6IGNyZWF0ZURPTUZhY3RvcnkoJ3N0cm9uZycpLFxuICBzdHlsZTogY3JlYXRlRE9NRmFjdG9yeSgnc3R5bGUnKSxcbiAgc3ViOiBjcmVhdGVET01GYWN0b3J5KCdzdWInKSxcbiAgc3VtbWFyeTogY3JlYXRlRE9NRmFjdG9yeSgnc3VtbWFyeScpLFxuICBzdXA6IGNyZWF0ZURPTUZhY3RvcnkoJ3N1cCcpLFxuICB0YWJsZTogY3JlYXRlRE9NRmFjdG9yeSgndGFibGUnKSxcbiAgdGJvZHk6IGNyZWF0ZURPTUZhY3RvcnkoJ3Rib2R5JyksXG4gIHRkOiBjcmVhdGVET01GYWN0b3J5KCd0ZCcpLFxuICB0ZXh0YXJlYTogY3JlYXRlRE9NRmFjdG9yeSgndGV4dGFyZWEnKSxcbiAgdGZvb3Q6IGNyZWF0ZURPTUZhY3RvcnkoJ3Rmb290JyksXG4gIHRoOiBjcmVhdGVET01GYWN0b3J5KCd0aCcpLFxuICB0aGVhZDogY3JlYXRlRE9NRmFjdG9yeSgndGhlYWQnKSxcbiAgdGltZTogY3JlYXRlRE9NRmFjdG9yeSgndGltZScpLFxuICB0aXRsZTogY3JlYXRlRE9NRmFjdG9yeSgndGl0bGUnKSxcbiAgdHI6IGNyZWF0ZURPTUZhY3RvcnkoJ3RyJyksXG4gIHRyYWNrOiBjcmVhdGVET01GYWN0b3J5KCd0cmFjaycpLFxuICB1OiBjcmVhdGVET01GYWN0b3J5KCd1JyksXG4gIHVsOiBjcmVhdGVET01GYWN0b3J5KCd1bCcpLFxuICAndmFyJzogY3JlYXRlRE9NRmFjdG9yeSgndmFyJyksXG4gIHZpZGVvOiBjcmVhdGVET01GYWN0b3J5KCd2aWRlbycpLFxuICB3YnI6IGNyZWF0ZURPTUZhY3RvcnkoJ3dicicpLFxuXG4gIC8vIFNWR1xuICBjaXJjbGU6IGNyZWF0ZURPTUZhY3RvcnkoJ2NpcmNsZScpLFxuICBjbGlwUGF0aDogY3JlYXRlRE9NRmFjdG9yeSgnY2xpcFBhdGgnKSxcbiAgZGVmczogY3JlYXRlRE9NRmFjdG9yeSgnZGVmcycpLFxuICBlbGxpcHNlOiBjcmVhdGVET01GYWN0b3J5KCdlbGxpcHNlJyksXG4gIGc6IGNyZWF0ZURPTUZhY3RvcnkoJ2cnKSxcbiAgaW1hZ2U6IGNyZWF0ZURPTUZhY3RvcnkoJ2ltYWdlJyksXG4gIGxpbmU6IGNyZWF0ZURPTUZhY3RvcnkoJ2xpbmUnKSxcbiAgbGluZWFyR3JhZGllbnQ6IGNyZWF0ZURPTUZhY3RvcnkoJ2xpbmVhckdyYWRpZW50JyksXG4gIG1hc2s6IGNyZWF0ZURPTUZhY3RvcnkoJ21hc2snKSxcbiAgcGF0aDogY3JlYXRlRE9NRmFjdG9yeSgncGF0aCcpLFxuICBwYXR0ZXJuOiBjcmVhdGVET01GYWN0b3J5KCdwYXR0ZXJuJyksXG4gIHBvbHlnb246IGNyZWF0ZURPTUZhY3RvcnkoJ3BvbHlnb24nKSxcbiAgcG9seWxpbmU6IGNyZWF0ZURPTUZhY3RvcnkoJ3BvbHlsaW5lJyksXG4gIHJhZGlhbEdyYWRpZW50OiBjcmVhdGVET01GYWN0b3J5KCdyYWRpYWxHcmFkaWVudCcpLFxuICByZWN0OiBjcmVhdGVET01GYWN0b3J5KCdyZWN0JyksXG4gIHN0b3A6IGNyZWF0ZURPTUZhY3RvcnkoJ3N0b3AnKSxcbiAgc3ZnOiBjcmVhdGVET01GYWN0b3J5KCdzdmcnKSxcbiAgdGV4dDogY3JlYXRlRE9NRmFjdG9yeSgndGV4dCcpLFxuICB0c3BhbjogY3JlYXRlRE9NRmFjdG9yeSgndHNwYW4nKVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdERPTUZhY3RvcmllczsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RFbGVtZW50XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2Fzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxudmFyIFJlYWN0Q3VycmVudE93bmVyID0gcmVxdWlyZSgnLi9SZWFjdEN1cnJlbnRPd25lcicpO1xuXG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcbnZhciBjYW5EZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vY2FuRGVmaW5lUHJvcGVydHknKTtcbnZhciBoYXNPd25Qcm9wZXJ0eSA9IE9iamVjdC5wcm90b3R5cGUuaGFzT3duUHJvcGVydHk7XG5cbi8vIFRoZSBTeW1ib2wgdXNlZCB0byB0YWcgdGhlIFJlYWN0RWxlbWVudCB0eXBlLiBJZiB0aGVyZSBpcyBubyBuYXRpdmUgU3ltYm9sXG4vLyBub3IgcG9seWZpbGwsIHRoZW4gYSBwbGFpbiBudW1iZXIgaXMgdXNlZCBmb3IgcGVyZm9ybWFuY2UuXG52YXIgUkVBQ1RfRUxFTUVOVF9UWVBFID0gdHlwZW9mIFN5bWJvbCA9PT0gJ2Z1bmN0aW9uJyAmJiBTeW1ib2xbJ2ZvciddICYmIFN5bWJvbFsnZm9yJ10oJ3JlYWN0LmVsZW1lbnQnKSB8fCAweGVhYzc7XG5cbnZhciBSRVNFUlZFRF9QUk9QUyA9IHtcbiAga2V5OiB0cnVlLFxuICByZWY6IHRydWUsXG4gIF9fc2VsZjogdHJ1ZSxcbiAgX19zb3VyY2U6IHRydWVcbn07XG5cbnZhciBzcGVjaWFsUHJvcEtleVdhcm5pbmdTaG93biwgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd247XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkUmVmKGNvbmZpZykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgJ3JlZicpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdyZWYnKS5nZXQ7XG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb25maWcucmVmICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGhhc1ZhbGlkS2V5KGNvbmZpZykge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgJ2tleScpKSB7XG4gICAgICB2YXIgZ2V0dGVyID0gT2JqZWN0LmdldE93blByb3BlcnR5RGVzY3JpcHRvcihjb25maWcsICdrZXknKS5nZXQ7XG4gICAgICBpZiAoZ2V0dGVyICYmIGdldHRlci5pc1JlYWN0V2FybmluZykge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG4gICAgfVxuICB9XG4gIHJldHVybiBjb25maWcua2V5ICE9PSB1bmRlZmluZWQ7XG59XG5cbmZ1bmN0aW9uIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSkge1xuICB2YXIgd2FybkFib3V0QWNjZXNzaW5nS2V5ID0gZnVuY3Rpb24gKCkge1xuICAgIGlmICghc3BlY2lhbFByb3BLZXlXYXJuaW5nU2hvd24pIHtcbiAgICAgIHNwZWNpYWxQcm9wS2V5V2FybmluZ1Nob3duID0gdHJ1ZTtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnJXM6IGBrZXlgIGlzIG5vdCBhIHByb3AuIFRyeWluZyB0byBhY2Nlc3MgaXQgd2lsbCByZXN1bHQgJyArICdpbiBgdW5kZWZpbmVkYCBiZWluZyByZXR1cm5lZC4gSWYgeW91IG5lZWQgdG8gYWNjZXNzIHRoZSBzYW1lICcgKyAndmFsdWUgd2l0aGluIHRoZSBjaGlsZCBjb21wb25lbnQsIHlvdSBzaG91bGQgcGFzcyBpdCBhcyBhIGRpZmZlcmVudCAnICsgJ3Byb3AuIChodHRwczovL2ZiLm1lL3JlYWN0LXNwZWNpYWwtcHJvcHMpJywgZGlzcGxheU5hbWUpIDogdm9pZCAwO1xuICAgIH1cbiAgfTtcbiAgd2FybkFib3V0QWNjZXNzaW5nS2V5LmlzUmVhY3RXYXJuaW5nID0gdHJ1ZTtcbiAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHByb3BzLCAna2V5Jywge1xuICAgIGdldDogd2FybkFib3V0QWNjZXNzaW5nS2V5LFxuICAgIGNvbmZpZ3VyYWJsZTogdHJ1ZVxuICB9KTtcbn1cblxuZnVuY3Rpb24gZGVmaW5lUmVmUHJvcFdhcm5pbmdHZXR0ZXIocHJvcHMsIGRpc3BsYXlOYW1lKSB7XG4gIHZhciB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYgPSBmdW5jdGlvbiAoKSB7XG4gICAgaWYgKCFzcGVjaWFsUHJvcFJlZldhcm5pbmdTaG93bikge1xuICAgICAgc3BlY2lhbFByb3BSZWZXYXJuaW5nU2hvd24gPSB0cnVlO1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICclczogYHJlZmAgaXMgbm90IGEgcHJvcC4gVHJ5aW5nIHRvIGFjY2VzcyBpdCB3aWxsIHJlc3VsdCAnICsgJ2luIGB1bmRlZmluZWRgIGJlaW5nIHJldHVybmVkLiBJZiB5b3UgbmVlZCB0byBhY2Nlc3MgdGhlIHNhbWUgJyArICd2YWx1ZSB3aXRoaW4gdGhlIGNoaWxkIGNvbXBvbmVudCwgeW91IHNob3VsZCBwYXNzIGl0IGFzIGEgZGlmZmVyZW50ICcgKyAncHJvcC4gKGh0dHBzOi8vZmIubWUvcmVhY3Qtc3BlY2lhbC1wcm9wcyknLCBkaXNwbGF5TmFtZSkgOiB2b2lkIDA7XG4gICAgfVxuICB9O1xuICB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYuaXNSZWFjdFdhcm5pbmcgPSB0cnVlO1xuICBPYmplY3QuZGVmaW5lUHJvcGVydHkocHJvcHMsICdyZWYnLCB7XG4gICAgZ2V0OiB3YXJuQWJvdXRBY2Nlc3NpbmdSZWYsXG4gICAgY29uZmlndXJhYmxlOiB0cnVlXG4gIH0pO1xufVxuXG4vKipcbiAqIEZhY3RvcnkgbWV0aG9kIHRvIGNyZWF0ZSBhIG5ldyBSZWFjdCBlbGVtZW50LiBUaGlzIG5vIGxvbmdlciBhZGhlcmVzIHRvXG4gKiB0aGUgY2xhc3MgcGF0dGVybiwgc28gZG8gbm90IHVzZSBuZXcgdG8gY2FsbCBpdC4gQWxzbywgbm8gaW5zdGFuY2VvZiBjaGVja1xuICogd2lsbCB3b3JrLiBJbnN0ZWFkIHRlc3QgJCR0eXBlb2YgZmllbGQgYWdhaW5zdCBTeW1ib2wuZm9yKCdyZWFjdC5lbGVtZW50JykgdG8gY2hlY2tcbiAqIGlmIHNvbWV0aGluZyBpcyBhIFJlYWN0IEVsZW1lbnQuXG4gKlxuICogQHBhcmFtIHsqfSB0eXBlXG4gKiBAcGFyYW0geyp9IGtleVxuICogQHBhcmFtIHtzdHJpbmd8b2JqZWN0fSByZWZcbiAqIEBwYXJhbSB7Kn0gc2VsZiBBICp0ZW1wb3JhcnkqIGhlbHBlciB0byBkZXRlY3QgcGxhY2VzIHdoZXJlIGB0aGlzYCBpc1xuICogZGlmZmVyZW50IGZyb20gdGhlIGBvd25lcmAgd2hlbiBSZWFjdC5jcmVhdGVFbGVtZW50IGlzIGNhbGxlZCwgc28gdGhhdCB3ZVxuICogY2FuIHdhcm4uIFdlIHdhbnQgdG8gZ2V0IHJpZCBvZiBvd25lciBhbmQgcmVwbGFjZSBzdHJpbmcgYHJlZmBzIHdpdGggYXJyb3dcbiAqIGZ1bmN0aW9ucywgYW5kIGFzIGxvbmcgYXMgYHRoaXNgIGFuZCBvd25lciBhcmUgdGhlIHNhbWUsIHRoZXJlIHdpbGwgYmUgbm9cbiAqIGNoYW5nZSBpbiBiZWhhdmlvci5cbiAqIEBwYXJhbSB7Kn0gc291cmNlIEFuIGFubm90YXRpb24gb2JqZWN0IChhZGRlZCBieSBhIHRyYW5zcGlsZXIgb3Igb3RoZXJ3aXNlKVxuICogaW5kaWNhdGluZyBmaWxlbmFtZSwgbGluZSBudW1iZXIsIGFuZC9vciBvdGhlciBpbmZvcm1hdGlvbi5cbiAqIEBwYXJhbSB7Kn0gb3duZXJcbiAqIEBwYXJhbSB7Kn0gcHJvcHNcbiAqIEBpbnRlcm5hbFxuICovXG52YXIgUmVhY3RFbGVtZW50ID0gZnVuY3Rpb24gKHR5cGUsIGtleSwgcmVmLCBzZWxmLCBzb3VyY2UsIG93bmVyLCBwcm9wcykge1xuICB2YXIgZWxlbWVudCA9IHtcbiAgICAvLyBUaGlzIHRhZyBhbGxvdyB1cyB0byB1bmlxdWVseSBpZGVudGlmeSB0aGlzIGFzIGEgUmVhY3QgRWxlbWVudFxuICAgICQkdHlwZW9mOiBSRUFDVF9FTEVNRU5UX1RZUEUsXG5cbiAgICAvLyBCdWlsdC1pbiBwcm9wZXJ0aWVzIHRoYXQgYmVsb25nIG9uIHRoZSBlbGVtZW50XG4gICAgdHlwZTogdHlwZSxcbiAgICBrZXk6IGtleSxcbiAgICByZWY6IHJlZixcbiAgICBwcm9wczogcHJvcHMsXG5cbiAgICAvLyBSZWNvcmQgdGhlIGNvbXBvbmVudCByZXNwb25zaWJsZSBmb3IgY3JlYXRpbmcgdGhpcyBlbGVtZW50LlxuICAgIF9vd25lcjogb3duZXJcbiAgfTtcblxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIC8vIFRoZSB2YWxpZGF0aW9uIGZsYWcgaXMgY3VycmVudGx5IG11dGF0aXZlLiBXZSBwdXQgaXQgb25cbiAgICAvLyBhbiBleHRlcm5hbCBiYWNraW5nIHN0b3JlIHNvIHRoYXQgd2UgY2FuIGZyZWV6ZSB0aGUgd2hvbGUgb2JqZWN0LlxuICAgIC8vIFRoaXMgY2FuIGJlIHJlcGxhY2VkIHdpdGggYSBXZWFrTWFwIG9uY2UgdGhleSBhcmUgaW1wbGVtZW50ZWQgaW5cbiAgICAvLyBjb21tb25seSB1c2VkIGRldmVsb3BtZW50IGVudmlyb25tZW50cy5cbiAgICBlbGVtZW50Ll9zdG9yZSA9IHt9O1xuICAgIHZhciBzaGFkb3dDaGlsZHJlbiA9IEFycmF5LmlzQXJyYXkocHJvcHMuY2hpbGRyZW4pID8gcHJvcHMuY2hpbGRyZW4uc2xpY2UoMCkgOiBwcm9wcy5jaGlsZHJlbjtcblxuICAgIC8vIFRvIG1ha2UgY29tcGFyaW5nIFJlYWN0RWxlbWVudHMgZWFzaWVyIGZvciB0ZXN0aW5nIHB1cnBvc2VzLCB3ZSBtYWtlXG4gICAgLy8gdGhlIHZhbGlkYXRpb24gZmxhZyBub24tZW51bWVyYWJsZSAod2hlcmUgcG9zc2libGUsIHdoaWNoIHNob3VsZFxuICAgIC8vIGluY2x1ZGUgZXZlcnkgZW52aXJvbm1lbnQgd2UgcnVuIHRlc3RzIGluKSwgc28gdGhlIHRlc3QgZnJhbWV3b3JrXG4gICAgLy8gaWdub3JlcyBpdC5cbiAgICBpZiAoY2FuRGVmaW5lUHJvcGVydHkpIHtcbiAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eShlbGVtZW50Ll9zdG9yZSwgJ3ZhbGlkYXRlZCcsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiB0cnVlLFxuICAgICAgICB2YWx1ZTogZmFsc2VcbiAgICAgIH0pO1xuICAgICAgLy8gc2VsZiBhbmQgc291cmNlIGFyZSBERVYgb25seSBwcm9wZXJ0aWVzLlxuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc2VsZicsIHtcbiAgICAgICAgY29uZmlndXJhYmxlOiBmYWxzZSxcbiAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgIHdyaXRhYmxlOiBmYWxzZSxcbiAgICAgICAgdmFsdWU6IHNlbGZcbiAgICAgIH0pO1xuICAgICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KGVsZW1lbnQsICdfc2hhZG93Q2hpbGRyZW4nLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBzaGFkb3dDaGlsZHJlblxuICAgICAgfSk7XG4gICAgICAvLyBUd28gZWxlbWVudHMgY3JlYXRlZCBpbiB0d28gZGlmZmVyZW50IHBsYWNlcyBzaG91bGQgYmUgY29uc2lkZXJlZFxuICAgICAgLy8gZXF1YWwgZm9yIHRlc3RpbmcgcHVycG9zZXMgYW5kIHRoZXJlZm9yZSB3ZSBoaWRlIGl0IGZyb20gZW51bWVyYXRpb24uXG4gICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkoZWxlbWVudCwgJ19zb3VyY2UnLCB7XG4gICAgICAgIGNvbmZpZ3VyYWJsZTogZmFsc2UsXG4gICAgICAgIGVudW1lcmFibGU6IGZhbHNlLFxuICAgICAgICB3cml0YWJsZTogZmFsc2UsXG4gICAgICAgIHZhbHVlOiBzb3VyY2VcbiAgICAgIH0pO1xuICAgIH0gZWxzZSB7XG4gICAgICBlbGVtZW50Ll9zdG9yZS52YWxpZGF0ZWQgPSBmYWxzZTtcbiAgICAgIGVsZW1lbnQuX3NlbGYgPSBzZWxmO1xuICAgICAgZWxlbWVudC5fc2hhZG93Q2hpbGRyZW4gPSBzaGFkb3dDaGlsZHJlbjtcbiAgICAgIGVsZW1lbnQuX3NvdXJjZSA9IHNvdXJjZTtcbiAgICB9XG4gICAgaWYgKE9iamVjdC5mcmVlemUpIHtcbiAgICAgIE9iamVjdC5mcmVlemUoZWxlbWVudC5wcm9wcyk7XG4gICAgICBPYmplY3QuZnJlZXplKGVsZW1lbnQpO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBlbGVtZW50O1xufTtcblxuLyoqXG4gKiBDcmVhdGUgYW5kIHJldHVybiBhIG5ldyBSZWFjdEVsZW1lbnQgb2YgdGhlIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy90b3AtbGV2ZWwtYXBpLmh0bWwjcmVhY3QuY3JlYXRlZWxlbWVudFxuICovXG5SZWFjdEVsZW1lbnQuY3JlYXRlRWxlbWVudCA9IGZ1bmN0aW9uICh0eXBlLCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIHZhciBwcm9wTmFtZTtcblxuICAvLyBSZXNlcnZlZCBuYW1lcyBhcmUgZXh0cmFjdGVkXG4gIHZhciBwcm9wcyA9IHt9O1xuXG4gIHZhciBrZXkgPSBudWxsO1xuICB2YXIgcmVmID0gbnVsbDtcbiAgdmFyIHNlbGYgPSBudWxsO1xuICB2YXIgc291cmNlID0gbnVsbDtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuICAgICAgY29uZmlnLl9fcHJvdG9fXyA9PSBudWxsIHx8IGNvbmZpZy5fX3Byb3RvX18gPT09IE9iamVjdC5wcm90b3R5cGUsXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXByb3RvICovXG4gICAgICAnUmVhY3QuY3JlYXRlRWxlbWVudCguLi4pOiBFeHBlY3RlZCBwcm9wcyBhcmd1bWVudCB0byBiZSBhIHBsYWluIG9iamVjdC4gJyArICdQcm9wZXJ0aWVzIGRlZmluZWQgaW4gaXRzIHByb3RvdHlwZSBjaGFpbiB3aWxsIGJlIGlnbm9yZWQuJykgOiB2b2lkIDA7XG4gICAgfVxuXG4gICAgaWYgKGhhc1ZhbGlkUmVmKGNvbmZpZykpIHtcbiAgICAgIHJlZiA9IGNvbmZpZy5yZWY7XG4gICAgfVxuICAgIGlmIChoYXNWYWxpZEtleShjb25maWcpKSB7XG4gICAgICBrZXkgPSAnJyArIGNvbmZpZy5rZXk7XG4gICAgfVxuXG4gICAgc2VsZiA9IGNvbmZpZy5fX3NlbGYgPT09IHVuZGVmaW5lZCA/IG51bGwgOiBjb25maWcuX19zZWxmO1xuICAgIHNvdXJjZSA9IGNvbmZpZy5fX3NvdXJjZSA9PT0gdW5kZWZpbmVkID8gbnVsbCA6IGNvbmZpZy5fX3NvdXJjZTtcbiAgICAvLyBSZW1haW5pbmcgcHJvcGVydGllcyBhcmUgYWRkZWQgdG8gYSBuZXcgcHJvcHMgb2JqZWN0XG4gICAgZm9yIChwcm9wTmFtZSBpbiBjb25maWcpIHtcbiAgICAgIGlmIChoYXNPd25Qcm9wZXJ0eS5jYWxsKGNvbmZpZywgcHJvcE5hbWUpICYmICFSRVNFUlZFRF9QUk9QUy5oYXNPd25Qcm9wZXJ0eShwcm9wTmFtZSkpIHtcbiAgICAgICAgcHJvcHNbcHJvcE5hbWVdID0gY29uZmlnW3Byb3BOYW1lXTtcbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH1cblxuICAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcbiAgaWYgKHR5cGUgJiYgdHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICB2YXIgZGVmYXVsdFByb3BzID0gdHlwZS5kZWZhdWx0UHJvcHM7XG4gICAgZm9yIChwcm9wTmFtZSBpbiBkZWZhdWx0UHJvcHMpIHtcbiAgICAgIGlmIChwcm9wc1twcm9wTmFtZV0gPT09IHVuZGVmaW5lZCkge1xuICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgfVxuICAgIH1cbiAgfVxuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmIChrZXkgfHwgcmVmKSB7XG4gICAgICBpZiAodHlwZW9mIHByb3BzLiQkdHlwZW9mID09PSAndW5kZWZpbmVkJyB8fCBwcm9wcy4kJHR5cGVvZiAhPT0gUkVBQ1RfRUxFTUVOVF9UWVBFKSB7XG4gICAgICAgIHZhciBkaXNwbGF5TmFtZSA9IHR5cGVvZiB0eXBlID09PSAnZnVuY3Rpb24nID8gdHlwZS5kaXNwbGF5TmFtZSB8fCB0eXBlLm5hbWUgfHwgJ1Vua25vd24nIDogdHlwZTtcbiAgICAgICAgaWYgKGtleSkge1xuICAgICAgICAgIGRlZmluZUtleVByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICAgIH1cbiAgICAgICAgaWYgKHJlZikge1xuICAgICAgICAgIGRlZmluZVJlZlByb3BXYXJuaW5nR2V0dGVyKHByb3BzLCBkaXNwbGF5TmFtZSk7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cbiAgcmV0dXJuIFJlYWN0RWxlbWVudCh0eXBlLCBrZXksIHJlZiwgc2VsZiwgc291cmNlLCBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50LCBwcm9wcyk7XG59O1xuXG4vKipcbiAqIFJldHVybiBhIGZ1bmN0aW9uIHRoYXQgcHJvZHVjZXMgUmVhY3RFbGVtZW50cyBvZiBhIGdpdmVuIHR5cGUuXG4gKiBTZWUgaHR0cHM6Ly9mYWNlYm9vay5naXRodWIuaW8vcmVhY3QvZG9jcy90b3AtbGV2ZWwtYXBpLmh0bWwjcmVhY3QuY3JlYXRlZmFjdG9yeVxuICovXG5SZWFjdEVsZW1lbnQuY3JlYXRlRmFjdG9yeSA9IGZ1bmN0aW9uICh0eXBlKSB7XG4gIHZhciBmYWN0b3J5ID0gUmVhY3RFbGVtZW50LmNyZWF0ZUVsZW1lbnQuYmluZChudWxsLCB0eXBlKTtcbiAgLy8gRXhwb3NlIHRoZSB0eXBlIG9uIHRoZSBmYWN0b3J5IGFuZCB0aGUgcHJvdG90eXBlIHNvIHRoYXQgaXQgY2FuIGJlXG4gIC8vIGVhc2lseSBhY2Nlc3NlZCBvbiBlbGVtZW50cy4gRS5nLiBgPEZvbyAvPi50eXBlID09PSBGb29gLlxuICAvLyBUaGlzIHNob3VsZCBub3QgYmUgbmFtZWQgYGNvbnN0cnVjdG9yYCBzaW5jZSB0aGlzIG1heSBub3QgYmUgdGhlIGZ1bmN0aW9uXG4gIC8vIHRoYXQgY3JlYXRlZCB0aGUgZWxlbWVudCwgYW5kIGl0IG1heSBub3QgZXZlbiBiZSBhIGNvbnN0cnVjdG9yLlxuICAvLyBMZWdhY3kgaG9vayBUT0RPOiBXYXJuIGlmIHRoaXMgaXMgYWNjZXNzZWRcbiAgZmFjdG9yeS50eXBlID0gdHlwZTtcbiAgcmV0dXJuIGZhY3Rvcnk7XG59O1xuXG5SZWFjdEVsZW1lbnQuY2xvbmVBbmRSZXBsYWNlS2V5ID0gZnVuY3Rpb24gKG9sZEVsZW1lbnQsIG5ld0tleSkge1xuICB2YXIgbmV3RWxlbWVudCA9IFJlYWN0RWxlbWVudChvbGRFbGVtZW50LnR5cGUsIG5ld0tleSwgb2xkRWxlbWVudC5yZWYsIG9sZEVsZW1lbnQuX3NlbGYsIG9sZEVsZW1lbnQuX3NvdXJjZSwgb2xkRWxlbWVudC5fb3duZXIsIG9sZEVsZW1lbnQucHJvcHMpO1xuXG4gIHJldHVybiBuZXdFbGVtZW50O1xufTtcblxuLyoqXG4gKiBDbG9uZSBhbmQgcmV0dXJuIGEgbmV3IFJlYWN0RWxlbWVudCB1c2luZyBlbGVtZW50IGFzIHRoZSBzdGFydGluZyBwb2ludC5cbiAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5jbG9uZWVsZW1lbnRcbiAqL1xuUmVhY3RFbGVtZW50LmNsb25lRWxlbWVudCA9IGZ1bmN0aW9uIChlbGVtZW50LCBjb25maWcsIGNoaWxkcmVuKSB7XG4gIHZhciBwcm9wTmFtZTtcblxuICAvLyBPcmlnaW5hbCBwcm9wcyBhcmUgY29waWVkXG4gIHZhciBwcm9wcyA9IF9hc3NpZ24oe30sIGVsZW1lbnQucHJvcHMpO1xuXG4gIC8vIFJlc2VydmVkIG5hbWVzIGFyZSBleHRyYWN0ZWRcbiAgdmFyIGtleSA9IGVsZW1lbnQua2V5O1xuICB2YXIgcmVmID0gZWxlbWVudC5yZWY7XG4gIC8vIFNlbGYgaXMgcHJlc2VydmVkIHNpbmNlIHRoZSBvd25lciBpcyBwcmVzZXJ2ZWQuXG4gIHZhciBzZWxmID0gZWxlbWVudC5fc2VsZjtcbiAgLy8gU291cmNlIGlzIHByZXNlcnZlZCBzaW5jZSBjbG9uZUVsZW1lbnQgaXMgdW5saWtlbHkgdG8gYmUgdGFyZ2V0ZWQgYnkgYVxuICAvLyB0cmFuc3BpbGVyLCBhbmQgdGhlIG9yaWdpbmFsIHNvdXJjZSBpcyBwcm9iYWJseSBhIGJldHRlciBpbmRpY2F0b3Igb2YgdGhlXG4gIC8vIHRydWUgb3duZXIuXG4gIHZhciBzb3VyY2UgPSBlbGVtZW50Ll9zb3VyY2U7XG5cbiAgLy8gT3duZXIgd2lsbCBiZSBwcmVzZXJ2ZWQsIHVubGVzcyByZWYgaXMgb3ZlcnJpZGRlblxuICB2YXIgb3duZXIgPSBlbGVtZW50Ll9vd25lcjtcblxuICBpZiAoY29uZmlnICE9IG51bGwpIHtcbiAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoXG4gICAgICAvKiBlc2xpbnQtZGlzYWJsZSBuby1wcm90byAqL1xuICAgICAgY29uZmlnLl9fcHJvdG9fXyA9PSBudWxsIHx8IGNvbmZpZy5fX3Byb3RvX18gPT09IE9iamVjdC5wcm90b3R5cGUsXG4gICAgICAvKiBlc2xpbnQtZW5hYmxlIG5vLXByb3RvICovXG4gICAgICAnUmVhY3QuY2xvbmVFbGVtZW50KC4uLik6IEV4cGVjdGVkIHByb3BzIGFyZ3VtZW50IHRvIGJlIGEgcGxhaW4gb2JqZWN0LiAnICsgJ1Byb3BlcnRpZXMgZGVmaW5lZCBpbiBpdHMgcHJvdG90eXBlIGNoYWluIHdpbGwgYmUgaWdub3JlZC4nKSA6IHZvaWQgMDtcbiAgICB9XG5cbiAgICBpZiAoaGFzVmFsaWRSZWYoY29uZmlnKSkge1xuICAgICAgLy8gU2lsZW50bHkgc3RlYWwgdGhlIHJlZiBmcm9tIHRoZSBwYXJlbnQuXG4gICAgICByZWYgPSBjb25maWcucmVmO1xuICAgICAgb3duZXIgPSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50O1xuICAgIH1cbiAgICBpZiAoaGFzVmFsaWRLZXkoY29uZmlnKSkge1xuICAgICAga2V5ID0gJycgKyBjb25maWcua2V5O1xuICAgIH1cblxuICAgIC8vIFJlbWFpbmluZyBwcm9wZXJ0aWVzIG92ZXJyaWRlIGV4aXN0aW5nIHByb3BzXG4gICAgdmFyIGRlZmF1bHRQcm9wcztcbiAgICBpZiAoZWxlbWVudC50eXBlICYmIGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHMpIHtcbiAgICAgIGRlZmF1bHRQcm9wcyA9IGVsZW1lbnQudHlwZS5kZWZhdWx0UHJvcHM7XG4gICAgfVxuICAgIGZvciAocHJvcE5hbWUgaW4gY29uZmlnKSB7XG4gICAgICBpZiAoaGFzT3duUHJvcGVydHkuY2FsbChjb25maWcsIHByb3BOYW1lKSAmJiAhUkVTRVJWRURfUFJPUFMuaGFzT3duUHJvcGVydHkocHJvcE5hbWUpKSB7XG4gICAgICAgIGlmIChjb25maWdbcHJvcE5hbWVdID09PSB1bmRlZmluZWQgJiYgZGVmYXVsdFByb3BzICE9PSB1bmRlZmluZWQpIHtcbiAgICAgICAgICAvLyBSZXNvbHZlIGRlZmF1bHQgcHJvcHNcbiAgICAgICAgICBwcm9wc1twcm9wTmFtZV0gPSBkZWZhdWx0UHJvcHNbcHJvcE5hbWVdO1xuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIHByb3BzW3Byb3BOYW1lXSA9IGNvbmZpZ1twcm9wTmFtZV07XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gIH1cblxuICAvLyBDaGlsZHJlbiBjYW4gYmUgbW9yZSB0aGFuIG9uZSBhcmd1bWVudCwgYW5kIHRob3NlIGFyZSB0cmFuc2ZlcnJlZCBvbnRvXG4gIC8vIHRoZSBuZXdseSBhbGxvY2F0ZWQgcHJvcHMgb2JqZWN0LlxuICB2YXIgY2hpbGRyZW5MZW5ndGggPSBhcmd1bWVudHMubGVuZ3RoIC0gMjtcbiAgaWYgKGNoaWxkcmVuTGVuZ3RoID09PSAxKSB7XG4gICAgcHJvcHMuY2hpbGRyZW4gPSBjaGlsZHJlbjtcbiAgfSBlbHNlIGlmIChjaGlsZHJlbkxlbmd0aCA+IDEpIHtcbiAgICB2YXIgY2hpbGRBcnJheSA9IEFycmF5KGNoaWxkcmVuTGVuZ3RoKTtcbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IGNoaWxkcmVuTGVuZ3RoOyBpKyspIHtcbiAgICAgIGNoaWxkQXJyYXlbaV0gPSBhcmd1bWVudHNbaSArIDJdO1xuICAgIH1cbiAgICBwcm9wcy5jaGlsZHJlbiA9IGNoaWxkQXJyYXk7XG4gIH1cblxuICByZXR1cm4gUmVhY3RFbGVtZW50KGVsZW1lbnQudHlwZSwga2V5LCByZWYsIHNlbGYsIHNvdXJjZSwgb3duZXIsIHByb3BzKTtcbn07XG5cbi8qKlxuICogVmVyaWZpZXMgdGhlIG9iamVjdCBpcyBhIFJlYWN0RWxlbWVudC5cbiAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5pc3ZhbGlkZWxlbWVudFxuICogQHBhcmFtIHs/b2JqZWN0fSBvYmplY3RcbiAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgYG9iamVjdGAgaXMgYSB2YWxpZCBjb21wb25lbnQuXG4gKiBAZmluYWxcbiAqL1xuUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50ID0gZnVuY3Rpb24gKG9iamVjdCkge1xuICByZXR1cm4gdHlwZW9mIG9iamVjdCA9PT0gJ29iamVjdCcgJiYgb2JqZWN0ICE9PSBudWxsICYmIG9iamVjdC4kJHR5cGVvZiA9PT0gUkVBQ1RfRUxFTUVOVF9UWVBFO1xufTtcblxuUmVhY3RFbGVtZW50LlJFQUNUX0VMRU1FTlRfVFlQRSA9IFJFQUNUX0VMRU1FTlRfVFlQRTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdEVsZW1lbnQ7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxNC1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0RWxlbWVudFZhbGlkYXRvclxuICovXG5cbi8qKlxuICogUmVhY3RFbGVtZW50VmFsaWRhdG9yIHByb3ZpZGVzIGEgd3JhcHBlciBhcm91bmQgYSBlbGVtZW50IGZhY3RvcnlcbiAqIHdoaWNoIHZhbGlkYXRlcyB0aGUgcHJvcHMgcGFzc2VkIHRvIHRoZSBlbGVtZW50LiBUaGlzIGlzIGludGVuZGVkIHRvIGJlXG4gKiB1c2VkIG9ubHkgaW4gREVWIGFuZCBjb3VsZCBiZSByZXBsYWNlZCBieSBhIHN0YXRpYyB0eXBlIGNoZWNrZXIgZm9yIGxhbmd1YWdlc1xuICogdGhhdCBzdXBwb3J0IGl0LlxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0Q3VycmVudE93bmVyID0gcmVxdWlyZSgnLi9SZWFjdEN1cnJlbnRPd25lcicpO1xudmFyIFJlYWN0Q29tcG9uZW50VHJlZUhvb2sgPSByZXF1aXJlKCcuL1JlYWN0Q29tcG9uZW50VHJlZUhvb2snKTtcbnZhciBSZWFjdEVsZW1lbnQgPSByZXF1aXJlKCcuL1JlYWN0RWxlbWVudCcpO1xudmFyIFJlYWN0UHJvcFR5cGVMb2NhdGlvbnMgPSByZXF1aXJlKCcuL1JlYWN0UHJvcFR5cGVMb2NhdGlvbnMnKTtcblxudmFyIGNoZWNrUmVhY3RUeXBlU3BlYyA9IHJlcXVpcmUoJy4vY2hlY2tSZWFjdFR5cGVTcGVjJyk7XG5cbnZhciBjYW5EZWZpbmVQcm9wZXJ0eSA9IHJlcXVpcmUoJy4vY2FuRGVmaW5lUHJvcGVydHknKTtcbnZhciBnZXRJdGVyYXRvckZuID0gcmVxdWlyZSgnLi9nZXRJdGVyYXRvckZuJyk7XG52YXIgd2FybmluZyA9IHJlcXVpcmUoJ2ZianMvbGliL3dhcm5pbmcnKTtcblxuZnVuY3Rpb24gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCkge1xuICBpZiAoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgIHZhciBuYW1lID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC5nZXROYW1lKCk7XG4gICAgaWYgKG5hbWUpIHtcbiAgICAgIHJldHVybiAnIENoZWNrIHRoZSByZW5kZXIgbWV0aG9kIG9mIGAnICsgbmFtZSArICdgLic7XG4gICAgfVxuICB9XG4gIHJldHVybiAnJztcbn1cblxuLyoqXG4gKiBXYXJuIGlmIHRoZXJlJ3Mgbm8ga2V5IGV4cGxpY2l0bHkgc2V0IG9uIGR5bmFtaWMgYXJyYXlzIG9mIGNoaWxkcmVuIG9yXG4gKiBvYmplY3Qga2V5cyBhcmUgbm90IHZhbGlkLiBUaGlzIGFsbG93cyB1cyB0byBrZWVwIHRyYWNrIG9mIGNoaWxkcmVuIGJldHdlZW5cbiAqIHVwZGF0ZXMuXG4gKi9cbnZhciBvd25lckhhc0tleVVzZVdhcm5pbmcgPSB7fTtcblxuZnVuY3Rpb24gZ2V0Q3VycmVudENvbXBvbmVudEVycm9ySW5mbyhwYXJlbnRUeXBlKSB7XG4gIHZhciBpbmZvID0gZ2V0RGVjbGFyYXRpb25FcnJvckFkZGVuZHVtKCk7XG5cbiAgaWYgKCFpbmZvKSB7XG4gICAgdmFyIHBhcmVudE5hbWUgPSB0eXBlb2YgcGFyZW50VHlwZSA9PT0gJ3N0cmluZycgPyBwYXJlbnRUeXBlIDogcGFyZW50VHlwZS5kaXNwbGF5TmFtZSB8fCBwYXJlbnRUeXBlLm5hbWU7XG4gICAgaWYgKHBhcmVudE5hbWUpIHtcbiAgICAgIGluZm8gPSAnIENoZWNrIHRoZSB0b3AtbGV2ZWwgcmVuZGVyIGNhbGwgdXNpbmcgPCcgKyBwYXJlbnROYW1lICsgJz4uJztcbiAgICB9XG4gIH1cbiAgcmV0dXJuIGluZm87XG59XG5cbi8qKlxuICogV2FybiBpZiB0aGUgZWxlbWVudCBkb2Vzbid0IGhhdmUgYW4gZXhwbGljaXQga2V5IGFzc2lnbmVkIHRvIGl0LlxuICogVGhpcyBlbGVtZW50IGlzIGluIGFuIGFycmF5LiBUaGUgYXJyYXkgY291bGQgZ3JvdyBhbmQgc2hyaW5rIG9yIGJlXG4gKiByZW9yZGVyZWQuIEFsbCBjaGlsZHJlbiB0aGF0IGhhdmVuJ3QgYWxyZWFkeSBiZWVuIHZhbGlkYXRlZCBhcmUgcmVxdWlyZWQgdG9cbiAqIGhhdmUgYSBcImtleVwiIHByb3BlcnR5IGFzc2lnbmVkIHRvIGl0LiBFcnJvciBzdGF0dXNlcyBhcmUgY2FjaGVkIHNvIGEgd2FybmluZ1xuICogd2lsbCBvbmx5IGJlIHNob3duIG9uY2UuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0RWxlbWVudH0gZWxlbWVudCBFbGVtZW50IHRoYXQgcmVxdWlyZXMgYSBrZXkuXG4gKiBAcGFyYW0geyp9IHBhcmVudFR5cGUgZWxlbWVudCdzIHBhcmVudCdzIHR5cGUuXG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlRXhwbGljaXRLZXkoZWxlbWVudCwgcGFyZW50VHlwZSkge1xuICBpZiAoIWVsZW1lbnQuX3N0b3JlIHx8IGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCB8fCBlbGVtZW50LmtleSAhPSBudWxsKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGVsZW1lbnQuX3N0b3JlLnZhbGlkYXRlZCA9IHRydWU7XG5cbiAgdmFyIG1lbW9pemVyID0gb3duZXJIYXNLZXlVc2VXYXJuaW5nLnVuaXF1ZUtleSB8fCAob3duZXJIYXNLZXlVc2VXYXJuaW5nLnVuaXF1ZUtleSA9IHt9KTtcblxuICB2YXIgY3VycmVudENvbXBvbmVudEVycm9ySW5mbyA9IGdldEN1cnJlbnRDb21wb25lbnRFcnJvckluZm8ocGFyZW50VHlwZSk7XG4gIGlmIChtZW1vaXplcltjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSkge1xuICAgIHJldHVybjtcbiAgfVxuICBtZW1vaXplcltjdXJyZW50Q29tcG9uZW50RXJyb3JJbmZvXSA9IHRydWU7XG5cbiAgLy8gVXN1YWxseSB0aGUgY3VycmVudCBvd25lciBpcyB0aGUgb2ZmZW5kZXIsIGJ1dCBpZiBpdCBhY2NlcHRzIGNoaWxkcmVuIGFzIGFcbiAgLy8gcHJvcGVydHksIGl0IG1heSBiZSB0aGUgY3JlYXRvciBvZiB0aGUgY2hpbGQgdGhhdCdzIHJlc3BvbnNpYmxlIGZvclxuICAvLyBhc3NpZ25pbmcgaXQgYSBrZXkuXG4gIHZhciBjaGlsZE93bmVyID0gJyc7XG4gIGlmIChlbGVtZW50ICYmIGVsZW1lbnQuX293bmVyICYmIGVsZW1lbnQuX293bmVyICE9PSBSZWFjdEN1cnJlbnRPd25lci5jdXJyZW50KSB7XG4gICAgLy8gR2l2ZSB0aGUgY29tcG9uZW50IHRoYXQgb3JpZ2luYWxseSBjcmVhdGVkIHRoaXMgY2hpbGQuXG4gICAgY2hpbGRPd25lciA9ICcgSXQgd2FzIHBhc3NlZCBhIGNoaWxkIGZyb20gJyArIGVsZW1lbnQuX293bmVyLmdldE5hbWUoKSArICcuJztcbiAgfVxuXG4gIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnRWFjaCBjaGlsZCBpbiBhbiBhcnJheSBvciBpdGVyYXRvciBzaG91bGQgaGF2ZSBhIHVuaXF1ZSBcImtleVwiIHByb3AuJyArICclcyVzIFNlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmcta2V5cyBmb3IgbW9yZSBpbmZvcm1hdGlvbi4lcycsIGN1cnJlbnRDb21wb25lbnRFcnJvckluZm8sIGNoaWxkT3duZXIsIFJlYWN0Q29tcG9uZW50VHJlZUhvb2suZ2V0Q3VycmVudFN0YWNrQWRkZW5kdW0oZWxlbWVudCkpIDogdm9pZCAwO1xufVxuXG4vKipcbiAqIEVuc3VyZSB0aGF0IGV2ZXJ5IGVsZW1lbnQgZWl0aGVyIGlzIHBhc3NlZCBpbiBhIHN0YXRpYyBsb2NhdGlvbiwgaW4gYW5cbiAqIGFycmF5IHdpdGggYW4gZXhwbGljaXQga2V5cyBwcm9wZXJ0eSBkZWZpbmVkLCBvciBpbiBhbiBvYmplY3QgbGl0ZXJhbFxuICogd2l0aCB2YWxpZCBrZXkgcHJvcGVydHkuXG4gKlxuICogQGludGVybmFsXG4gKiBAcGFyYW0ge1JlYWN0Tm9kZX0gbm9kZSBTdGF0aWNhbGx5IHBhc3NlZCBjaGlsZCBvZiBhbnkgdHlwZS5cbiAqIEBwYXJhbSB7Kn0gcGFyZW50VHlwZSBub2RlJ3MgcGFyZW50J3MgdHlwZS5cbiAqL1xuZnVuY3Rpb24gdmFsaWRhdGVDaGlsZEtleXMobm9kZSwgcGFyZW50VHlwZSkge1xuICBpZiAodHlwZW9mIG5vZGUgIT09ICdvYmplY3QnKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIGlmIChBcnJheS5pc0FycmF5KG5vZGUpKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBub2RlLmxlbmd0aDsgaSsrKSB7XG4gICAgICB2YXIgY2hpbGQgPSBub2RlW2ldO1xuICAgICAgaWYgKFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudChjaGlsZCkpIHtcbiAgICAgICAgdmFsaWRhdGVFeHBsaWNpdEtleShjaGlsZCwgcGFyZW50VHlwZSk7XG4gICAgICB9XG4gICAgfVxuICB9IGVsc2UgaWYgKFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudChub2RlKSkge1xuICAgIC8vIFRoaXMgZWxlbWVudCB3YXMgcGFzc2VkIGluIGEgdmFsaWQgbG9jYXRpb24uXG4gICAgaWYgKG5vZGUuX3N0b3JlKSB7XG4gICAgICBub2RlLl9zdG9yZS52YWxpZGF0ZWQgPSB0cnVlO1xuICAgIH1cbiAgfSBlbHNlIGlmIChub2RlKSB7XG4gICAgdmFyIGl0ZXJhdG9yRm4gPSBnZXRJdGVyYXRvckZuKG5vZGUpO1xuICAgIC8vIEVudHJ5IGl0ZXJhdG9ycyBwcm92aWRlIGltcGxpY2l0IGtleXMuXG4gICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgIGlmIChpdGVyYXRvckZuICE9PSBub2RlLmVudHJpZXMpIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKG5vZGUpO1xuICAgICAgICB2YXIgc3RlcDtcbiAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgIGlmIChSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQoc3RlcC52YWx1ZSkpIHtcbiAgICAgICAgICAgIHZhbGlkYXRlRXhwbGljaXRLZXkoc3RlcC52YWx1ZSwgcGFyZW50VHlwZSk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbi8qKlxuICogR2l2ZW4gYW4gZWxlbWVudCwgdmFsaWRhdGUgdGhhdCBpdHMgcHJvcHMgZm9sbG93IHRoZSBwcm9wVHlwZXMgZGVmaW5pdGlvbixcbiAqIHByb3ZpZGVkIGJ5IHRoZSB0eXBlLlxuICpcbiAqIEBwYXJhbSB7UmVhY3RFbGVtZW50fSBlbGVtZW50XG4gKi9cbmZ1bmN0aW9uIHZhbGlkYXRlUHJvcFR5cGVzKGVsZW1lbnQpIHtcbiAgdmFyIGNvbXBvbmVudENsYXNzID0gZWxlbWVudC50eXBlO1xuICBpZiAodHlwZW9mIGNvbXBvbmVudENsYXNzICE9PSAnZnVuY3Rpb24nKSB7XG4gICAgcmV0dXJuO1xuICB9XG4gIHZhciBuYW1lID0gY29tcG9uZW50Q2xhc3MuZGlzcGxheU5hbWUgfHwgY29tcG9uZW50Q2xhc3MubmFtZTtcbiAgaWYgKGNvbXBvbmVudENsYXNzLnByb3BUeXBlcykge1xuICAgIGNoZWNrUmVhY3RUeXBlU3BlYyhjb21wb25lbnRDbGFzcy5wcm9wVHlwZXMsIGVsZW1lbnQucHJvcHMsIFJlYWN0UHJvcFR5cGVMb2NhdGlvbnMucHJvcCwgbmFtZSwgZWxlbWVudCwgbnVsbCk7XG4gIH1cbiAgaWYgKHR5cGVvZiBjb21wb25lbnRDbGFzcy5nZXREZWZhdWx0UHJvcHMgPT09ICdmdW5jdGlvbicpIHtcbiAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhjb21wb25lbnRDbGFzcy5nZXREZWZhdWx0UHJvcHMuaXNSZWFjdENsYXNzQXBwcm92ZWQsICdnZXREZWZhdWx0UHJvcHMgaXMgb25seSB1c2VkIG9uIGNsYXNzaWMgUmVhY3QuY3JlYXRlQ2xhc3MgJyArICdkZWZpbml0aW9ucy4gVXNlIGEgc3RhdGljIHByb3BlcnR5IG5hbWVkIGBkZWZhdWx0UHJvcHNgIGluc3RlYWQuJykgOiB2b2lkIDA7XG4gIH1cbn1cblxudmFyIFJlYWN0RWxlbWVudFZhbGlkYXRvciA9IHtcblxuICBjcmVhdGVFbGVtZW50OiBmdW5jdGlvbiAodHlwZSwgcHJvcHMsIGNoaWxkcmVuKSB7XG4gICAgdmFyIHZhbGlkVHlwZSA9IHR5cGVvZiB0eXBlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgdHlwZSA9PT0gJ2Z1bmN0aW9uJztcbiAgICAvLyBXZSB3YXJuIGluIHRoaXMgY2FzZSBidXQgZG9uJ3QgdGhyb3cuIFdlIGV4cGVjdCB0aGUgZWxlbWVudCBjcmVhdGlvbiB0b1xuICAgIC8vIHN1Y2NlZWQgYW5kIHRoZXJlIHdpbGwgbGlrZWx5IGJlIGVycm9ycyBpbiByZW5kZXIuXG4gICAgaWYgKCF2YWxpZFR5cGUpIHtcbiAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnUmVhY3QuY3JlYXRlRWxlbWVudDogdHlwZSBzaG91bGQgbm90IGJlIG51bGwsIHVuZGVmaW5lZCwgYm9vbGVhbiwgb3IgJyArICdudW1iZXIuIEl0IHNob3VsZCBiZSBhIHN0cmluZyAoZm9yIERPTSBlbGVtZW50cykgb3IgYSBSZWFjdENsYXNzICcgKyAnKGZvciBjb21wb3NpdGUgY29tcG9uZW50cykuJXMnLCBnZXREZWNsYXJhdGlvbkVycm9yQWRkZW5kdW0oKSkgOiB2b2lkIDA7XG4gICAgfVxuXG4gICAgdmFyIGVsZW1lbnQgPSBSZWFjdEVsZW1lbnQuY3JlYXRlRWxlbWVudC5hcHBseSh0aGlzLCBhcmd1bWVudHMpO1xuXG4gICAgLy8gVGhlIHJlc3VsdCBjYW4gYmUgbnVsbGlzaCBpZiBhIG1vY2sgb3IgYSBjdXN0b20gZnVuY3Rpb24gaXMgdXNlZC5cbiAgICAvLyBUT0RPOiBEcm9wIHRoaXMgd2hlbiB0aGVzZSBhcmUgbm8gbG9uZ2VyIGFsbG93ZWQgYXMgdGhlIHR5cGUgYXJndW1lbnQuXG4gICAgaWYgKGVsZW1lbnQgPT0gbnVsbCkge1xuICAgICAgcmV0dXJuIGVsZW1lbnQ7XG4gICAgfVxuXG4gICAgLy8gU2tpcCBrZXkgd2FybmluZyBpZiB0aGUgdHlwZSBpc24ndCB2YWxpZCBzaW5jZSBvdXIga2V5IHZhbGlkYXRpb24gbG9naWNcbiAgICAvLyBkb2Vzbid0IGV4cGVjdCBhIG5vbi1zdHJpbmcvZnVuY3Rpb24gdHlwZSBhbmQgY2FuIHRocm93IGNvbmZ1c2luZyBlcnJvcnMuXG4gICAgLy8gV2UgZG9uJ3Qgd2FudCBleGNlcHRpb24gYmVoYXZpb3IgdG8gZGlmZmVyIGJldHdlZW4gZGV2IGFuZCBwcm9kLlxuICAgIC8vIChSZW5kZXJpbmcgd2lsbCB0aHJvdyB3aXRoIGEgaGVscGZ1bCBtZXNzYWdlIGFuZCBhcyBzb29uIGFzIHRoZSB0eXBlIGlzXG4gICAgLy8gZml4ZWQsIHRoZSBrZXkgd2FybmluZ3Mgd2lsbCBhcHBlYXIuKVxuICAgIGlmICh2YWxpZFR5cGUpIHtcbiAgICAgIGZvciAodmFyIGkgPSAyOyBpIDwgYXJndW1lbnRzLmxlbmd0aDsgaSsrKSB7XG4gICAgICAgIHZhbGlkYXRlQ2hpbGRLZXlzKGFyZ3VtZW50c1tpXSwgdHlwZSk7XG4gICAgICB9XG4gICAgfVxuXG4gICAgdmFsaWRhdGVQcm9wVHlwZXMoZWxlbWVudCk7XG5cbiAgICByZXR1cm4gZWxlbWVudDtcbiAgfSxcblxuICBjcmVhdGVGYWN0b3J5OiBmdW5jdGlvbiAodHlwZSkge1xuICAgIHZhciB2YWxpZGF0ZWRGYWN0b3J5ID0gUmVhY3RFbGVtZW50VmFsaWRhdG9yLmNyZWF0ZUVsZW1lbnQuYmluZChudWxsLCB0eXBlKTtcbiAgICAvLyBMZWdhY3kgaG9vayBUT0RPOiBXYXJuIGlmIHRoaXMgaXMgYWNjZXNzZWRcbiAgICB2YWxpZGF0ZWRGYWN0b3J5LnR5cGUgPSB0eXBlO1xuXG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGlmIChjYW5EZWZpbmVQcm9wZXJ0eSkge1xuICAgICAgICBPYmplY3QuZGVmaW5lUHJvcGVydHkodmFsaWRhdGVkRmFjdG9yeSwgJ3R5cGUnLCB7XG4gICAgICAgICAgZW51bWVyYWJsZTogZmFsc2UsXG4gICAgICAgICAgZ2V0OiBmdW5jdGlvbiAoKSB7XG4gICAgICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ZhY3RvcnkudHlwZSBpcyBkZXByZWNhdGVkLiBBY2Nlc3MgdGhlIGNsYXNzIGRpcmVjdGx5ICcgKyAnYmVmb3JlIHBhc3NpbmcgaXQgdG8gY3JlYXRlRmFjdG9yeS4nKSA6IHZvaWQgMDtcbiAgICAgICAgICAgIE9iamVjdC5kZWZpbmVQcm9wZXJ0eSh0aGlzLCAndHlwZScsIHtcbiAgICAgICAgICAgICAgdmFsdWU6IHR5cGVcbiAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgcmV0dXJuIHR5cGU7XG4gICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICAgIH1cbiAgICB9XG5cbiAgICByZXR1cm4gdmFsaWRhdGVkRmFjdG9yeTtcbiAgfSxcblxuICBjbG9uZUVsZW1lbnQ6IGZ1bmN0aW9uIChlbGVtZW50LCBwcm9wcywgY2hpbGRyZW4pIHtcbiAgICB2YXIgbmV3RWxlbWVudCA9IFJlYWN0RWxlbWVudC5jbG9uZUVsZW1lbnQuYXBwbHkodGhpcywgYXJndW1lbnRzKTtcbiAgICBmb3IgKHZhciBpID0gMjsgaSA8IGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFsaWRhdGVDaGlsZEtleXMoYXJndW1lbnRzW2ldLCBuZXdFbGVtZW50LnR5cGUpO1xuICAgIH1cbiAgICB2YWxpZGF0ZVByb3BUeXBlcyhuZXdFbGVtZW50KTtcbiAgICByZXR1cm4gbmV3RWxlbWVudDtcbiAgfVxuXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0RWxlbWVudFZhbGlkYXRvcjsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE1LXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3ROb29wVXBkYXRlUXVldWVcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciB3YXJuaW5nID0gcmVxdWlyZSgnZmJqcy9saWIvd2FybmluZycpO1xuXG5mdW5jdGlvbiB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgY2FsbGVyTmFtZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHZhciBjb25zdHJ1Y3RvciA9IHB1YmxpY0luc3RhbmNlLmNvbnN0cnVjdG9yO1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnJXMoLi4uKTogQ2FuIG9ubHkgdXBkYXRlIGEgbW91bnRlZCBvciBtb3VudGluZyBjb21wb25lbnQuICcgKyAnVGhpcyB1c3VhbGx5IG1lYW5zIHlvdSBjYWxsZWQgJXMoKSBvbiBhbiB1bm1vdW50ZWQgY29tcG9uZW50LiAnICsgJ1RoaXMgaXMgYSBuby1vcC4gUGxlYXNlIGNoZWNrIHRoZSBjb2RlIGZvciB0aGUgJXMgY29tcG9uZW50LicsIGNhbGxlck5hbWUsIGNhbGxlck5hbWUsIGNvbnN0cnVjdG9yICYmIChjb25zdHJ1Y3Rvci5kaXNwbGF5TmFtZSB8fCBjb25zdHJ1Y3Rvci5uYW1lKSB8fCAnUmVhY3RDbGFzcycpIDogdm9pZCAwO1xuICB9XG59XG5cbi8qKlxuICogVGhpcyBpcyB0aGUgYWJzdHJhY3QgQVBJIGZvciBhbiB1cGRhdGUgcXVldWUuXG4gKi9cbnZhciBSZWFjdE5vb3BVcGRhdGVRdWV1ZSA9IHtcblxuICAvKipcbiAgICogQ2hlY2tzIHdoZXRoZXIgb3Igbm90IHRoaXMgY29tcG9zaXRlIGNvbXBvbmVudCBpcyBtb3VudGVkLlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB3ZSB3YW50IHRvIHRlc3QuXG4gICAqIEByZXR1cm4ge2Jvb2xlYW59IFRydWUgaWYgbW91bnRlZCwgZmFsc2Ugb3RoZXJ3aXNlLlxuICAgKiBAcHJvdGVjdGVkXG4gICAqIEBmaW5hbFxuICAgKi9cbiAgaXNNb3VudGVkOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UpIHtcbiAgICByZXR1cm4gZmFsc2U7XG4gIH0sXG5cbiAgLyoqXG4gICAqIEVucXVldWUgYSBjYWxsYmFjayB0aGF0IHdpbGwgYmUgZXhlY3V0ZWQgYWZ0ZXIgYWxsIHRoZSBwZW5kaW5nIHVwZGF0ZXNcbiAgICogaGF2ZSBwcm9jZXNzZWQuXG4gICAqXG4gICAqIEBwYXJhbSB7UmVhY3RDbGFzc30gcHVibGljSW5zdGFuY2UgVGhlIGluc3RhbmNlIHRvIHVzZSBhcyBgdGhpc2AgY29udGV4dC5cbiAgICogQHBhcmFtIHs/ZnVuY3Rpb259IGNhbGxiYWNrIENhbGxlZCBhZnRlciBzdGF0ZSBpcyB1cGRhdGVkLlxuICAgKiBAaW50ZXJuYWxcbiAgICovXG4gIGVucXVldWVDYWxsYmFjazogZnVuY3Rpb24gKHB1YmxpY0luc3RhbmNlLCBjYWxsYmFjaykge30sXG5cbiAgLyoqXG4gICAqIEZvcmNlcyBhbiB1cGRhdGUuIFRoaXMgc2hvdWxkIG9ubHkgYmUgaW52b2tlZCB3aGVuIGl0IGlzIGtub3duIHdpdGhcbiAgICogY2VydGFpbnR5IHRoYXQgd2UgYXJlICoqbm90KiogaW4gYSBET00gdHJhbnNhY3Rpb24uXG4gICAqXG4gICAqIFlvdSBtYXkgd2FudCB0byBjYWxsIHRoaXMgd2hlbiB5b3Uga25vdyB0aGF0IHNvbWUgZGVlcGVyIGFzcGVjdCBvZiB0aGVcbiAgICogY29tcG9uZW50J3Mgc3RhdGUgaGFzIGNoYW5nZWQgYnV0IGBzZXRTdGF0ZWAgd2FzIG5vdCBjYWxsZWQuXG4gICAqXG4gICAqIFRoaXMgd2lsbCBub3QgaW52b2tlIGBzaG91bGRDb21wb25lbnRVcGRhdGVgLCBidXQgaXQgd2lsbCBpbnZva2VcbiAgICogYGNvbXBvbmVudFdpbGxVcGRhdGVgIGFuZCBgY29tcG9uZW50RGlkVXBkYXRlYC5cbiAgICpcbiAgICogQHBhcmFtIHtSZWFjdENsYXNzfSBwdWJsaWNJbnN0YW5jZSBUaGUgaW5zdGFuY2UgdGhhdCBzaG91bGQgcmVyZW5kZXIuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZUZvcmNlVXBkYXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ2ZvcmNlVXBkYXRlJyk7XG4gIH0sXG5cbiAgLyoqXG4gICAqIFJlcGxhY2VzIGFsbCBvZiB0aGUgc3RhdGUuIEFsd2F5cyB1c2UgdGhpcyBvciBgc2V0U3RhdGVgIHRvIG11dGF0ZSBzdGF0ZS5cbiAgICogWW91IHNob3VsZCB0cmVhdCBgdGhpcy5zdGF0ZWAgYXMgaW1tdXRhYmxlLlxuICAgKlxuICAgKiBUaGVyZSBpcyBubyBndWFyYW50ZWUgdGhhdCBgdGhpcy5zdGF0ZWAgd2lsbCBiZSBpbW1lZGlhdGVseSB1cGRhdGVkLCBzb1xuICAgKiBhY2Nlc3NpbmcgYHRoaXMuc3RhdGVgIGFmdGVyIGNhbGxpbmcgdGhpcyBtZXRob2QgbWF5IHJldHVybiB0aGUgb2xkIHZhbHVlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IGNvbXBsZXRlU3RhdGUgTmV4dCBzdGF0ZS5cbiAgICogQGludGVybmFsXG4gICAqL1xuICBlbnF1ZXVlUmVwbGFjZVN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIGNvbXBsZXRlU3RhdGUpIHtcbiAgICB3YXJuTm9vcChwdWJsaWNJbnN0YW5jZSwgJ3JlcGxhY2VTdGF0ZScpO1xuICB9LFxuXG4gIC8qKlxuICAgKiBTZXRzIGEgc3Vic2V0IG9mIHRoZSBzdGF0ZS4gVGhpcyBvbmx5IGV4aXN0cyBiZWNhdXNlIF9wZW5kaW5nU3RhdGUgaXNcbiAgICogaW50ZXJuYWwuIFRoaXMgcHJvdmlkZXMgYSBtZXJnaW5nIHN0cmF0ZWd5IHRoYXQgaXMgbm90IGF2YWlsYWJsZSB0byBkZWVwXG4gICAqIHByb3BlcnRpZXMgd2hpY2ggaXMgY29uZnVzaW5nLiBUT0RPOiBFeHBvc2UgcGVuZGluZ1N0YXRlIG9yIGRvbid0IHVzZSBpdFxuICAgKiBkdXJpbmcgdGhlIG1lcmdlLlxuICAgKlxuICAgKiBAcGFyYW0ge1JlYWN0Q2xhc3N9IHB1YmxpY0luc3RhbmNlIFRoZSBpbnN0YW5jZSB0aGF0IHNob3VsZCByZXJlbmRlci5cbiAgICogQHBhcmFtIHtvYmplY3R9IHBhcnRpYWxTdGF0ZSBOZXh0IHBhcnRpYWwgc3RhdGUgdG8gYmUgbWVyZ2VkIHdpdGggc3RhdGUuXG4gICAqIEBpbnRlcm5hbFxuICAgKi9cbiAgZW5xdWV1ZVNldFN0YXRlOiBmdW5jdGlvbiAocHVibGljSW5zdGFuY2UsIHBhcnRpYWxTdGF0ZSkge1xuICAgIHdhcm5Ob29wKHB1YmxpY0luc3RhbmNlLCAnc2V0U3RhdGUnKTtcbiAgfVxufTtcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdE5vb3BVcGRhdGVRdWV1ZTsiLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcyA9IHt9O1xuXG5pZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcyA9IHtcbiAgICBwcm9wOiAncHJvcCcsXG4gICAgY29udGV4dDogJ2NvbnRleHQnLFxuICAgIGNoaWxkQ29udGV4dDogJ2NoaWxkIGNvbnRleHQnXG4gIH07XG59XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXM7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0UHJvcFR5cGVMb2NhdGlvbnNcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBrZXlNaXJyb3IgPSByZXF1aXJlKCdmYmpzL2xpYi9rZXlNaXJyb3InKTtcblxudmFyIFJlYWN0UHJvcFR5cGVMb2NhdGlvbnMgPSBrZXlNaXJyb3Ioe1xuICBwcm9wOiBudWxsLFxuICBjb250ZXh0OiBudWxsLFxuICBjaGlsZENvbnRleHQ6IG51bGxcbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbnM7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIFJlYWN0UHJvcFR5cGVzXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3RFbGVtZW50ID0gcmVxdWlyZSgnLi9SZWFjdEVsZW1lbnQnKTtcbnZhciBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcyA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXMnKTtcbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcblxudmFyIGVtcHR5RnVuY3Rpb24gPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eUZ1bmN0aW9uJyk7XG52YXIgZ2V0SXRlcmF0b3JGbiA9IHJlcXVpcmUoJy4vZ2V0SXRlcmF0b3JGbicpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbi8qKlxuICogQ29sbGVjdGlvbiBvZiBtZXRob2RzIHRoYXQgYWxsb3cgZGVjbGFyYXRpb24gYW5kIHZhbGlkYXRpb24gb2YgcHJvcHMgdGhhdCBhcmVcbiAqIHN1cHBsaWVkIHRvIFJlYWN0IGNvbXBvbmVudHMuIEV4YW1wbGUgdXNhZ2U6XG4gKlxuICogICB2YXIgUHJvcHMgPSByZXF1aXJlKCdSZWFjdFByb3BUeXBlcycpO1xuICogICB2YXIgTXlBcnRpY2xlID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICogICAgIHByb3BUeXBlczoge1xuICogICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIHByb3AgbmFtZWQgXCJkZXNjcmlwdGlvblwiLlxuICogICAgICAgZGVzY3JpcHRpb246IFByb3BzLnN0cmluZyxcbiAqXG4gKiAgICAgICAvLyBBIHJlcXVpcmVkIGVudW0gcHJvcCBuYW1lZCBcImNhdGVnb3J5XCIuXG4gKiAgICAgICBjYXRlZ29yeTogUHJvcHMub25lT2YoWydOZXdzJywnUGhvdG9zJ10pLmlzUmVxdWlyZWQsXG4gKlxuICogICAgICAgLy8gQSBwcm9wIG5hbWVkIFwiZGlhbG9nXCIgdGhhdCByZXF1aXJlcyBhbiBpbnN0YW5jZSBvZiBEaWFsb2cuXG4gKiAgICAgICBkaWFsb2c6IFByb3BzLmluc3RhbmNlT2YoRGlhbG9nKS5pc1JlcXVpcmVkXG4gKiAgICAgfSxcbiAqICAgICByZW5kZXI6IGZ1bmN0aW9uKCkgeyAuLi4gfVxuICogICB9KTtcbiAqXG4gKiBBIG1vcmUgZm9ybWFsIHNwZWNpZmljYXRpb24gb2YgaG93IHRoZXNlIG1ldGhvZHMgYXJlIHVzZWQ6XG4gKlxuICogICB0eXBlIDo9IGFycmF5fGJvb2x8ZnVuY3xvYmplY3R8bnVtYmVyfHN0cmluZ3xvbmVPZihbLi4uXSl8aW5zdGFuY2VPZiguLi4pXG4gKiAgIGRlY2wgOj0gUmVhY3RQcm9wVHlwZXMue3R5cGV9KC5pc1JlcXVpcmVkKT9cbiAqXG4gKiBFYWNoIGFuZCBldmVyeSBkZWNsYXJhdGlvbiBwcm9kdWNlcyBhIGZ1bmN0aW9uIHdpdGggdGhlIHNhbWUgc2lnbmF0dXJlLiBUaGlzXG4gKiBhbGxvd3MgdGhlIGNyZWF0aW9uIG9mIGN1c3RvbSB2YWxpZGF0aW9uIGZ1bmN0aW9ucy4gRm9yIGV4YW1wbGU6XG4gKlxuICogIHZhciBNeUxpbmsgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gKiAgICBwcm9wVHlwZXM6IHtcbiAqICAgICAgLy8gQW4gb3B0aW9uYWwgc3RyaW5nIG9yIFVSSSBwcm9wIG5hbWVkIFwiaHJlZlwiLlxuICogICAgICBocmVmOiBmdW5jdGlvbihwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUpIHtcbiAqICAgICAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICogICAgICAgIGlmIChwcm9wVmFsdWUgIT0gbnVsbCAmJiB0eXBlb2YgcHJvcFZhbHVlICE9PSAnc3RyaW5nJyAmJlxuICogICAgICAgICAgICAhKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFVSSSkpIHtcbiAqICAgICAgICAgIHJldHVybiBuZXcgRXJyb3IoXG4gKiAgICAgICAgICAgICdFeHBlY3RlZCBhIHN0cmluZyBvciBhbiBVUkkgZm9yICcgKyBwcm9wTmFtZSArICcgaW4gJyArXG4gKiAgICAgICAgICAgIGNvbXBvbmVudE5hbWVcbiAqICAgICAgICAgICk7XG4gKiAgICAgICAgfVxuICogICAgICB9XG4gKiAgICB9LFxuICogICAgcmVuZGVyOiBmdW5jdGlvbigpIHsuLi59XG4gKiAgfSk7XG4gKlxuICogQGludGVybmFsXG4gKi9cblxudmFyIEFOT05ZTU9VUyA9ICc8PGFub255bW91cz4+JztcblxudmFyIFJlYWN0UHJvcFR5cGVzID0ge1xuICBhcnJheTogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ2FycmF5JyksXG4gIGJvb2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdib29sZWFuJyksXG4gIGZ1bmM6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdmdW5jdGlvbicpLFxuICBudW1iZXI6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdudW1iZXInKSxcbiAgb2JqZWN0OiBjcmVhdGVQcmltaXRpdmVUeXBlQ2hlY2tlcignb2JqZWN0JyksXG4gIHN0cmluZzogY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXIoJ3N0cmluZycpLFxuICBzeW1ib2w6IGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKCdzeW1ib2wnKSxcblxuICBhbnk6IGNyZWF0ZUFueVR5cGVDaGVja2VyKCksXG4gIGFycmF5T2Y6IGNyZWF0ZUFycmF5T2ZUeXBlQ2hlY2tlcixcbiAgZWxlbWVudDogY3JlYXRlRWxlbWVudFR5cGVDaGVja2VyKCksXG4gIGluc3RhbmNlT2Y6IGNyZWF0ZUluc3RhbmNlVHlwZUNoZWNrZXIsXG4gIG5vZGU6IGNyZWF0ZU5vZGVDaGVja2VyKCksXG4gIG9iamVjdE9mOiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyLFxuICBvbmVPZjogY3JlYXRlRW51bVR5cGVDaGVja2VyLFxuICBvbmVPZlR5cGU6IGNyZWF0ZVVuaW9uVHlwZUNoZWNrZXIsXG4gIHNoYXBlOiBjcmVhdGVTaGFwZVR5cGVDaGVja2VyXG59O1xuXG4vKipcbiAqIGlubGluZWQgT2JqZWN0LmlzIHBvbHlmaWxsIHRvIGF2b2lkIHJlcXVpcmluZyBjb25zdW1lcnMgc2hpcCB0aGVpciBvd25cbiAqIGh0dHBzOi8vZGV2ZWxvcGVyLm1vemlsbGEub3JnL2VuLVVTL2RvY3MvV2ViL0phdmFTY3JpcHQvUmVmZXJlbmNlL0dsb2JhbF9PYmplY3RzL09iamVjdC9pc1xuICovXG4vKmVzbGludC1kaXNhYmxlIG5vLXNlbGYtY29tcGFyZSovXG5mdW5jdGlvbiBpcyh4LCB5KSB7XG4gIC8vIFNhbWVWYWx1ZSBhbGdvcml0aG1cbiAgaWYgKHggPT09IHkpIHtcbiAgICAvLyBTdGVwcyAxLTUsIDctMTBcbiAgICAvLyBTdGVwcyA2LmItNi5lOiArMCAhPSAtMFxuICAgIHJldHVybiB4ICE9PSAwIHx8IDEgLyB4ID09PSAxIC8geTtcbiAgfSBlbHNlIHtcbiAgICAvLyBTdGVwIDYuYTogTmFOID09IE5hTlxuICAgIHJldHVybiB4ICE9PSB4ICYmIHkgIT09IHk7XG4gIH1cbn1cbi8qZXNsaW50LWVuYWJsZSBuby1zZWxmLWNvbXBhcmUqL1xuXG4vKipcbiAqIFdlIHVzZSBhbiBFcnJvci1saWtlIG9iamVjdCBmb3IgYmFja3dhcmQgY29tcGF0aWJpbGl0eSBhcyBwZW9wbGUgbWF5IGNhbGxcbiAqIFByb3BUeXBlcyBkaXJlY3RseSBhbmQgaW5zcGVjdCB0aGVpciBvdXRwdXQuIEhvd2V2ZXIgd2UgZG9uJ3QgdXNlIHJlYWxcbiAqIEVycm9ycyBhbnltb3JlLiBXZSBkb24ndCBpbnNwZWN0IHRoZWlyIHN0YWNrIGFueXdheSwgYW5kIGNyZWF0aW5nIHRoZW1cbiAqIGlzIHByb2hpYml0aXZlbHkgZXhwZW5zaXZlIGlmIHRoZXkgYXJlIGNyZWF0ZWQgdG9vIG9mdGVuLCBzdWNoIGFzIHdoYXRcbiAqIGhhcHBlbnMgaW4gb25lT2ZUeXBlKCkgZm9yIGFueSB0eXBlIGJlZm9yZSB0aGUgb25lIHRoYXQgbWF0Y2hlZC5cbiAqL1xuZnVuY3Rpb24gUHJvcFR5cGVFcnJvcihtZXNzYWdlKSB7XG4gIHRoaXMubWVzc2FnZSA9IG1lc3NhZ2U7XG4gIHRoaXMuc3RhY2sgPSAnJztcbn1cbi8vIE1ha2UgYGluc3RhbmNlb2YgRXJyb3JgIHN0aWxsIHdvcmsgZm9yIHJldHVybmVkIGVycm9ycy5cblByb3BUeXBlRXJyb3IucHJvdG90eXBlID0gRXJyb3IucHJvdG90eXBlO1xuXG5mdW5jdGlvbiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSkge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIHZhciBtYW51YWxQcm9wVHlwZUNhbGxDYWNoZSA9IHt9O1xuICB9XG4gIGZ1bmN0aW9uIGNoZWNrVHlwZShpc1JlcXVpcmVkLCBwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgIGNvbXBvbmVudE5hbWUgPSBjb21wb25lbnROYW1lIHx8IEFOT05ZTU9VUztcbiAgICBwcm9wRnVsbE5hbWUgPSBwcm9wRnVsbE5hbWUgfHwgcHJvcE5hbWU7XG4gICAgaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgICAgIGlmIChzZWNyZXQgIT09IFJlYWN0UHJvcFR5cGVzU2VjcmV0ICYmIHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICB2YXIgY2FjaGVLZXkgPSBjb21wb25lbnROYW1lICsgJzonICsgcHJvcE5hbWU7XG4gICAgICAgIGlmICghbWFudWFsUHJvcFR5cGVDYWxsQ2FjaGVbY2FjaGVLZXldKSB7XG4gICAgICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdZb3UgYXJlIG1hbnVhbGx5IGNhbGxpbmcgYSBSZWFjdC5Qcm9wVHlwZXMgdmFsaWRhdGlvbiAnICsgJ2Z1bmN0aW9uIGZvciB0aGUgYCVzYCBwcm9wIG9uIGAlc2AuIFRoaXMgaXMgZGVwcmVjYXRlZCAnICsgJ2FuZCB3aWxsIG5vdCB3b3JrIGluIHRoZSBuZXh0IG1ham9yIHZlcnNpb24uIFlvdSBtYXkgYmUgJyArICdzZWVpbmcgdGhpcyB3YXJuaW5nIGR1ZSB0byBhIHRoaXJkLXBhcnR5IFByb3BUeXBlcyBsaWJyYXJ5LiAnICsgJ1NlZSBodHRwczovL2ZiLm1lL3JlYWN0LXdhcm5pbmctZG9udC1jYWxsLXByb3B0eXBlcyBmb3IgZGV0YWlscy4nLCBwcm9wRnVsbE5hbWUsIGNvbXBvbmVudE5hbWUpIDogdm9pZCAwO1xuICAgICAgICAgIG1hbnVhbFByb3BUeXBlQ2FsbENhY2hlW2NhY2hlS2V5XSA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgaWYgKHByb3BzW3Byb3BOYW1lXSA9PSBudWxsKSB7XG4gICAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgICAgaWYgKGlzUmVxdWlyZWQpIHtcbiAgICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdSZXF1aXJlZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHdhcyBub3Qgc3BlY2lmaWVkIGluICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLicpKTtcbiAgICAgIH1cbiAgICAgIHJldHVybiBudWxsO1xuICAgIH0gZWxzZSB7XG4gICAgICByZXR1cm4gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKTtcbiAgICB9XG4gIH1cblxuICB2YXIgY2hhaW5lZENoZWNrVHlwZSA9IGNoZWNrVHlwZS5iaW5kKG51bGwsIGZhbHNlKTtcbiAgY2hhaW5lZENoZWNrVHlwZS5pc1JlcXVpcmVkID0gY2hlY2tUeXBlLmJpbmQobnVsbCwgdHJ1ZSk7XG5cbiAgcmV0dXJuIGNoYWluZWRDaGVja1R5cGU7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVByaW1pdGl2ZVR5cGVDaGVja2VyKGV4cGVjdGVkVHlwZSkge1xuICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUsIHNlY3JldCkge1xuICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgdmFyIHByb3BUeXBlID0gZ2V0UHJvcFR5cGUocHJvcFZhbHVlKTtcbiAgICBpZiAocHJvcFR5cGUgIT09IGV4cGVjdGVkVHlwZSkge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIC8vIGBwcm9wVmFsdWVgIGJlaW5nIGluc3RhbmNlIG9mLCBzYXksIGRhdGUvcmVnZXhwLCBwYXNzIHRoZSAnb2JqZWN0J1xuICAgICAgLy8gY2hlY2ssIGJ1dCB3ZSBjYW4gb2ZmZXIgYSBtb3JlIHByZWNpc2UgZXJyb3IgbWVzc2FnZSBoZXJlIHJhdGhlciB0aGFuXG4gICAgICAvLyAnb2YgdHlwZSBgb2JqZWN0YCcuXG4gICAgICB2YXIgcHJlY2lzZVR5cGUgPSBnZXRQcmVjaXNlVHlwZShwcm9wVmFsdWUpO1xuXG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJlY2lzZVR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2AnICsgZXhwZWN0ZWRUeXBlICsgJ2AuJykpO1xuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBbnlUeXBlQ2hlY2tlcigpIHtcbiAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKGVtcHR5RnVuY3Rpb24udGhhdFJldHVybnMobnVsbCkpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVBcnJheU9mVHlwZUNoZWNrZXIodHlwZUNoZWNrZXIpIHtcbiAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgaWYgKHR5cGVvZiB0eXBlQ2hlY2tlciAhPT0gJ2Z1bmN0aW9uJykge1xuICAgICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdQcm9wZXJ0eSBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIGNvbXBvbmVudCBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCBoYXMgaW52YWxpZCBQcm9wVHlwZSBub3RhdGlvbiBpbnNpZGUgYXJyYXlPZi4nKTtcbiAgICB9XG4gICAgdmFyIHByb3BWYWx1ZSA9IHByb3BzW3Byb3BOYW1lXTtcbiAgICBpZiAoIUFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYW4gYXJyYXkuJykpO1xuICAgIH1cbiAgICBmb3IgKHZhciBpID0gMDsgaSA8IHByb3BWYWx1ZS5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBpLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lICsgJ1snICsgaSArICddJywgUmVhY3RQcm9wVHlwZXNTZWNyZXQpO1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgcmV0dXJuIGVycm9yO1xuICAgICAgfVxuICAgIH1cbiAgICByZXR1cm4gbnVsbDtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVFbGVtZW50VHlwZUNoZWNrZXIoKSB7XG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIHZhciBwcm9wVmFsdWUgPSBwcm9wc1twcm9wTmFtZV07XG4gICAgaWYgKCFSZWFjdEVsZW1lbnQuaXNWYWxpZEVsZW1lbnQocHJvcFZhbHVlKSkge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgICByZXR1cm4gbmV3IFByb3BUeXBlRXJyb3IoJ0ludmFsaWQgJyArIGxvY2F0aW9uTmFtZSArICcgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiB0eXBlICcgKyAoJ2AnICsgcHJvcFR5cGUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgYSBzaW5nbGUgUmVhY3RFbGVtZW50LicpKTtcbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlSW5zdGFuY2VUeXBlQ2hlY2tlcihleHBlY3RlZENsYXNzKSB7XG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIGlmICghKHByb3BzW3Byb3BOYW1lXSBpbnN0YW5jZW9mIGV4cGVjdGVkQ2xhc3MpKSB7XG4gICAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgICAgdmFyIGV4cGVjdGVkQ2xhc3NOYW1lID0gZXhwZWN0ZWRDbGFzcy5uYW1lIHx8IEFOT05ZTU9VUztcbiAgICAgIHZhciBhY3R1YWxDbGFzc05hbWUgPSBnZXRDbGFzc05hbWUocHJvcHNbcHJvcE5hbWVdKTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBhY3R1YWxDbGFzc05hbWUgKyAnYCBzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgJykgKyAoJ2luc3RhbmNlIG9mIGAnICsgZXhwZWN0ZWRDbGFzc05hbWUgKyAnYC4nKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZUVudW1UeXBlQ2hlY2tlcihleHBlY3RlZFZhbHVlcykge1xuICBpZiAoIUFycmF5LmlzQXJyYXkoZXhwZWN0ZWRWYWx1ZXMpKSB7XG4gICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoZmFsc2UsICdJbnZhbGlkIGFyZ3VtZW50IHN1cHBsaWVkIHRvIG9uZU9mLCBleHBlY3RlZCBhbiBpbnN0YW5jZSBvZiBhcnJheS4nKSA6IHZvaWQgMDtcbiAgICByZXR1cm4gZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc051bGw7XG4gIH1cblxuICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgZXhwZWN0ZWRWYWx1ZXMubGVuZ3RoOyBpKyspIHtcbiAgICAgIGlmIChpcyhwcm9wVmFsdWUsIGV4cGVjdGVkVmFsdWVzW2ldKSkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgIHZhciB2YWx1ZXNTdHJpbmcgPSBKU09OLnN0cmluZ2lmeShleHBlY3RlZFZhbHVlcyk7XG4gICAgcmV0dXJuIG5ldyBQcm9wVHlwZUVycm9yKCdJbnZhbGlkICcgKyBsb2NhdGlvbk5hbWUgKyAnIGAnICsgcHJvcEZ1bGxOYW1lICsgJ2Agb2YgdmFsdWUgYCcgKyBwcm9wVmFsdWUgKyAnYCAnICsgKCdzdXBwbGllZCB0byBgJyArIGNvbXBvbmVudE5hbWUgKyAnYCwgZXhwZWN0ZWQgb25lIG9mICcgKyB2YWx1ZXNTdHJpbmcgKyAnLicpKTtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVPYmplY3RPZlR5cGVDaGVja2VyKHR5cGVDaGVja2VyKSB7XG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIGlmICh0eXBlb2YgdHlwZUNoZWNrZXIgIT09ICdmdW5jdGlvbicpIHtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignUHJvcGVydHkgYCcgKyBwcm9wRnVsbE5hbWUgKyAnYCBvZiBjb21wb25lbnQgYCcgKyBjb21wb25lbnROYW1lICsgJ2AgaGFzIGludmFsaWQgUHJvcFR5cGUgbm90YXRpb24gaW5zaWRlIG9iamVjdE9mLicpO1xuICAgIH1cbiAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgJyArICgnYCcgKyBwcm9wVHlwZSArICdgIHN1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhbiBvYmplY3QuJykpO1xuICAgIH1cbiAgICBmb3IgKHZhciBrZXkgaW4gcHJvcFZhbHVlKSB7XG4gICAgICBpZiAocHJvcFZhbHVlLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgICAgdmFyIGVycm9yID0gdHlwZUNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IpIHtcbiAgICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICB9XG4gICAgcmV0dXJuIG51bGw7XG4gIH1cbiAgcmV0dXJuIGNyZWF0ZUNoYWluYWJsZVR5cGVDaGVja2VyKHZhbGlkYXRlKTtcbn1cblxuZnVuY3Rpb24gY3JlYXRlVW5pb25UeXBlQ2hlY2tlcihhcnJheU9mVHlwZUNoZWNrZXJzKSB7XG4gIGlmICghQXJyYXkuaXNBcnJheShhcnJheU9mVHlwZUNoZWNrZXJzKSkge1xuICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGZhbHNlLCAnSW52YWxpZCBhcmd1bWVudCBzdXBwbGllZCB0byBvbmVPZlR5cGUsIGV4cGVjdGVkIGFuIGluc3RhbmNlIG9mIGFycmF5LicpIDogdm9pZCAwO1xuICAgIHJldHVybiBlbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zTnVsbDtcbiAgfVxuXG4gIGZ1bmN0aW9uIHZhbGlkYXRlKHByb3BzLCBwcm9wTmFtZSwgY29tcG9uZW50TmFtZSwgbG9jYXRpb24sIHByb3BGdWxsTmFtZSkge1xuICAgIGZvciAodmFyIGkgPSAwOyBpIDwgYXJyYXlPZlR5cGVDaGVja2Vycy5sZW5ndGg7IGkrKykge1xuICAgICAgdmFyIGNoZWNrZXIgPSBhcnJheU9mVHlwZUNoZWNrZXJzW2ldO1xuICAgICAgaWYgKGNoZWNrZXIocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lLCBSZWFjdFByb3BUeXBlc1NlY3JldCkgPT0gbnVsbCkge1xuICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgIH1cbiAgICB9XG5cbiAgICB2YXIgbG9jYXRpb25OYW1lID0gUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dO1xuICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLicpKTtcbiAgfVxuICByZXR1cm4gY3JlYXRlQ2hhaW5hYmxlVHlwZUNoZWNrZXIodmFsaWRhdGUpO1xufVxuXG5mdW5jdGlvbiBjcmVhdGVOb2RlQ2hlY2tlcigpIHtcbiAgZnVuY3Rpb24gdmFsaWRhdGUocHJvcHMsIHByb3BOYW1lLCBjb21wb25lbnROYW1lLCBsb2NhdGlvbiwgcHJvcEZ1bGxOYW1lKSB7XG4gICAgaWYgKCFpc05vZGUocHJvcHNbcHJvcE5hbWVdKSkge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIHN1cHBsaWVkIHRvICcgKyAoJ2AnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBhIFJlYWN0Tm9kZS4nKSk7XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGNyZWF0ZVNoYXBlVHlwZUNoZWNrZXIoc2hhcGVUeXBlcykge1xuICBmdW5jdGlvbiB2YWxpZGF0ZShwcm9wcywgcHJvcE5hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUpIHtcbiAgICB2YXIgcHJvcFZhbHVlID0gcHJvcHNbcHJvcE5hbWVdO1xuICAgIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gICAgaWYgKHByb3BUeXBlICE9PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGxvY2F0aW9uTmFtZSA9IFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXTtcbiAgICAgIHJldHVybiBuZXcgUHJvcFR5cGVFcnJvcignSW52YWxpZCAnICsgbG9jYXRpb25OYW1lICsgJyBgJyArIHByb3BGdWxsTmFtZSArICdgIG9mIHR5cGUgYCcgKyBwcm9wVHlwZSArICdgICcgKyAoJ3N1cHBsaWVkIHRvIGAnICsgY29tcG9uZW50TmFtZSArICdgLCBleHBlY3RlZCBgb2JqZWN0YC4nKSk7XG4gICAgfVxuICAgIGZvciAodmFyIGtleSBpbiBzaGFwZVR5cGVzKSB7XG4gICAgICB2YXIgY2hlY2tlciA9IHNoYXBlVHlwZXNba2V5XTtcbiAgICAgIGlmICghY2hlY2tlcikge1xuICAgICAgICBjb250aW51ZTtcbiAgICAgIH1cbiAgICAgIHZhciBlcnJvciA9IGNoZWNrZXIocHJvcFZhbHVlLCBrZXksIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBwcm9wRnVsbE5hbWUgKyAnLicgKyBrZXksIFJlYWN0UHJvcFR5cGVzU2VjcmV0KTtcbiAgICAgIGlmIChlcnJvcikge1xuICAgICAgICByZXR1cm4gZXJyb3I7XG4gICAgICB9XG4gICAgfVxuICAgIHJldHVybiBudWxsO1xuICB9XG4gIHJldHVybiBjcmVhdGVDaGFpbmFibGVUeXBlQ2hlY2tlcih2YWxpZGF0ZSk7XG59XG5cbmZ1bmN0aW9uIGlzTm9kZShwcm9wVmFsdWUpIHtcbiAgc3dpdGNoICh0eXBlb2YgcHJvcFZhbHVlKSB7XG4gICAgY2FzZSAnbnVtYmVyJzpcbiAgICBjYXNlICdzdHJpbmcnOlxuICAgIGNhc2UgJ3VuZGVmaW5lZCc6XG4gICAgICByZXR1cm4gdHJ1ZTtcbiAgICBjYXNlICdib29sZWFuJzpcbiAgICAgIHJldHVybiAhcHJvcFZhbHVlO1xuICAgIGNhc2UgJ29iamVjdCc6XG4gICAgICBpZiAoQXJyYXkuaXNBcnJheShwcm9wVmFsdWUpKSB7XG4gICAgICAgIHJldHVybiBwcm9wVmFsdWUuZXZlcnkoaXNOb2RlKTtcbiAgICAgIH1cbiAgICAgIGlmIChwcm9wVmFsdWUgPT09IG51bGwgfHwgUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KHByb3BWYWx1ZSkpIHtcbiAgICAgICAgcmV0dXJuIHRydWU7XG4gICAgICB9XG5cbiAgICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihwcm9wVmFsdWUpO1xuICAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgICAgdmFyIGl0ZXJhdG9yID0gaXRlcmF0b3JGbi5jYWxsKHByb3BWYWx1ZSk7XG4gICAgICAgIHZhciBzdGVwO1xuICAgICAgICBpZiAoaXRlcmF0b3JGbiAhPT0gcHJvcFZhbHVlLmVudHJpZXMpIHtcbiAgICAgICAgICB3aGlsZSAoIShzdGVwID0gaXRlcmF0b3IubmV4dCgpKS5kb25lKSB7XG4gICAgICAgICAgICBpZiAoIWlzTm9kZShzdGVwLnZhbHVlKSkge1xuICAgICAgICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9IGVsc2Uge1xuICAgICAgICAgIC8vIEl0ZXJhdG9yIHdpbGwgcHJvdmlkZSBlbnRyeSBbayx2XSB0dXBsZXMgcmF0aGVyIHRoYW4gdmFsdWVzLlxuICAgICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgICBpZiAoZW50cnkpIHtcbiAgICAgICAgICAgICAgaWYgKCFpc05vZGUoZW50cnlbMV0pKSB7XG4gICAgICAgICAgICAgICAgcmV0dXJuIGZhbHNlO1xuICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9IGVsc2Uge1xuICAgICAgICByZXR1cm4gZmFsc2U7XG4gICAgICB9XG5cbiAgICAgIHJldHVybiB0cnVlO1xuICAgIGRlZmF1bHQ6XG4gICAgICByZXR1cm4gZmFsc2U7XG4gIH1cbn1cblxuZnVuY3Rpb24gaXNTeW1ib2wocHJvcFR5cGUsIHByb3BWYWx1ZSkge1xuICAvLyBOYXRpdmUgU3ltYm9sLlxuICBpZiAocHJvcFR5cGUgPT09ICdzeW1ib2wnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyAxOS40LjMuNSBTeW1ib2wucHJvdG90eXBlW0BAdG9TdHJpbmdUYWddID09PSAnU3ltYm9sJ1xuICBpZiAocHJvcFZhbHVlWydAQHRvU3RyaW5nVGFnJ10gPT09ICdTeW1ib2wnKSB7XG4gICAgcmV0dXJuIHRydWU7XG4gIH1cblxuICAvLyBGYWxsYmFjayBmb3Igbm9uLXNwZWMgY29tcGxpYW50IFN5bWJvbHMgd2hpY2ggYXJlIHBvbHlmaWxsZWQuXG4gIGlmICh0eXBlb2YgU3ltYm9sID09PSAnZnVuY3Rpb24nICYmIHByb3BWYWx1ZSBpbnN0YW5jZW9mIFN5bWJvbCkge1xuICAgIHJldHVybiB0cnVlO1xuICB9XG5cbiAgcmV0dXJuIGZhbHNlO1xufVxuXG4vLyBFcXVpdmFsZW50IG9mIGB0eXBlb2ZgIGJ1dCB3aXRoIHNwZWNpYWwgaGFuZGxpbmcgZm9yIGFycmF5IGFuZCByZWdleHAuXG5mdW5jdGlvbiBnZXRQcm9wVHlwZShwcm9wVmFsdWUpIHtcbiAgdmFyIHByb3BUeXBlID0gdHlwZW9mIHByb3BWYWx1ZTtcbiAgaWYgKEFycmF5LmlzQXJyYXkocHJvcFZhbHVlKSkge1xuICAgIHJldHVybiAnYXJyYXknO1xuICB9XG4gIGlmIChwcm9wVmFsdWUgaW5zdGFuY2VvZiBSZWdFeHApIHtcbiAgICAvLyBPbGQgd2Via2l0cyAoYXQgbGVhc3QgdW50aWwgQW5kcm9pZCA0LjApIHJldHVybiAnZnVuY3Rpb24nIHJhdGhlciB0aGFuXG4gICAgLy8gJ29iamVjdCcgZm9yIHR5cGVvZiBhIFJlZ0V4cC4gV2UnbGwgbm9ybWFsaXplIHRoaXMgaGVyZSBzbyB0aGF0IC9ibGEvXG4gICAgLy8gcGFzc2VzIFByb3BUeXBlcy5vYmplY3QuXG4gICAgcmV0dXJuICdvYmplY3QnO1xuICB9XG4gIGlmIChpc1N5bWJvbChwcm9wVHlwZSwgcHJvcFZhbHVlKSkge1xuICAgIHJldHVybiAnc3ltYm9sJztcbiAgfVxuICByZXR1cm4gcHJvcFR5cGU7XG59XG5cbi8vIFRoaXMgaGFuZGxlcyBtb3JlIHR5cGVzIHRoYW4gYGdldFByb3BUeXBlYC4gT25seSB1c2VkIGZvciBlcnJvciBtZXNzYWdlcy5cbi8vIFNlZSBgY3JlYXRlUHJpbWl0aXZlVHlwZUNoZWNrZXJgLlxuZnVuY3Rpb24gZ2V0UHJlY2lzZVR5cGUocHJvcFZhbHVlKSB7XG4gIHZhciBwcm9wVHlwZSA9IGdldFByb3BUeXBlKHByb3BWYWx1ZSk7XG4gIGlmIChwcm9wVHlwZSA9PT0gJ29iamVjdCcpIHtcbiAgICBpZiAocHJvcFZhbHVlIGluc3RhbmNlb2YgRGF0ZSkge1xuICAgICAgcmV0dXJuICdkYXRlJztcbiAgICB9IGVsc2UgaWYgKHByb3BWYWx1ZSBpbnN0YW5jZW9mIFJlZ0V4cCkge1xuICAgICAgcmV0dXJuICdyZWdleHAnO1xuICAgIH1cbiAgfVxuICByZXR1cm4gcHJvcFR5cGU7XG59XG5cbi8vIFJldHVybnMgY2xhc3MgbmFtZSBvZiB0aGUgb2JqZWN0LCBpZiBhbnkuXG5mdW5jdGlvbiBnZXRDbGFzc05hbWUocHJvcFZhbHVlKSB7XG4gIGlmICghcHJvcFZhbHVlLmNvbnN0cnVjdG9yIHx8ICFwcm9wVmFsdWUuY29uc3RydWN0b3IubmFtZSkge1xuICAgIHJldHVybiBBTk9OWU1PVVM7XG4gIH1cbiAgcmV0dXJuIHByb3BWYWx1ZS5jb25zdHJ1Y3Rvci5uYW1lO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IFJlYWN0UHJvcFR5cGVzOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdFByb3BUeXBlc1NlY3JldFxuICovXG5cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0UHJvcFR5cGVzU2VjcmV0ID0gJ1NFQ1JFVF9ET19OT1RfUEFTU19USElTX09SX1lPVV9XSUxMX0JFX0ZJUkVEJztcblxubW9kdWxlLmV4cG9ydHMgPSBSZWFjdFByb3BUeXBlc1NlY3JldDsiLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgUmVhY3RQdXJlQ29tcG9uZW50XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgX2Fzc2lnbiA9IHJlcXVpcmUoJ29iamVjdC1hc3NpZ24nKTtcblxudmFyIFJlYWN0Q29tcG9uZW50ID0gcmVxdWlyZSgnLi9SZWFjdENvbXBvbmVudCcpO1xudmFyIFJlYWN0Tm9vcFVwZGF0ZVF1ZXVlID0gcmVxdWlyZSgnLi9SZWFjdE5vb3BVcGRhdGVRdWV1ZScpO1xuXG52YXIgZW1wdHlPYmplY3QgPSByZXF1aXJlKCdmYmpzL2xpYi9lbXB0eU9iamVjdCcpO1xuXG4vKipcbiAqIEJhc2UgY2xhc3MgaGVscGVycyBmb3IgdGhlIHVwZGF0aW5nIHN0YXRlIG9mIGEgY29tcG9uZW50LlxuICovXG5mdW5jdGlvbiBSZWFjdFB1cmVDb21wb25lbnQocHJvcHMsIGNvbnRleHQsIHVwZGF0ZXIpIHtcbiAgLy8gRHVwbGljYXRlZCBmcm9tIFJlYWN0Q29tcG9uZW50LlxuICB0aGlzLnByb3BzID0gcHJvcHM7XG4gIHRoaXMuY29udGV4dCA9IGNvbnRleHQ7XG4gIHRoaXMucmVmcyA9IGVtcHR5T2JqZWN0O1xuICAvLyBXZSBpbml0aWFsaXplIHRoZSBkZWZhdWx0IHVwZGF0ZXIgYnV0IHRoZSByZWFsIG9uZSBnZXRzIGluamVjdGVkIGJ5IHRoZVxuICAvLyByZW5kZXJlci5cbiAgdGhpcy51cGRhdGVyID0gdXBkYXRlciB8fCBSZWFjdE5vb3BVcGRhdGVRdWV1ZTtcbn1cblxuZnVuY3Rpb24gQ29tcG9uZW50RHVtbXkoKSB7fVxuQ29tcG9uZW50RHVtbXkucHJvdG90eXBlID0gUmVhY3RDb21wb25lbnQucHJvdG90eXBlO1xuUmVhY3RQdXJlQ29tcG9uZW50LnByb3RvdHlwZSA9IG5ldyBDb21wb25lbnREdW1teSgpO1xuUmVhY3RQdXJlQ29tcG9uZW50LnByb3RvdHlwZS5jb25zdHJ1Y3RvciA9IFJlYWN0UHVyZUNvbXBvbmVudDtcbi8vIEF2b2lkIGFuIGV4dHJhIHByb3RvdHlwZSBqdW1wIGZvciB0aGVzZSBtZXRob2RzLlxuX2Fzc2lnbihSZWFjdFB1cmVDb21wb25lbnQucHJvdG90eXBlLCBSZWFjdENvbXBvbmVudC5wcm90b3R5cGUpO1xuUmVhY3RQdXJlQ29tcG9uZW50LnByb3RvdHlwZS5pc1B1cmVSZWFjdENvbXBvbmVudCA9IHRydWU7XG5cbm1vZHVsZS5leHBvcnRzID0gUmVhY3RQdXJlQ29tcG9uZW50OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBSZWFjdFZlcnNpb25cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbm1vZHVsZS5leHBvcnRzID0gJzE1LjMuMSc7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIGNhbkRlZmluZVByb3BlcnR5XG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgY2FuRGVmaW5lUHJvcGVydHkgPSBmYWxzZTtcbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIHRyeSB7XG4gICAgT2JqZWN0LmRlZmluZVByb3BlcnR5KHt9LCAneCcsIHsgZ2V0OiBmdW5jdGlvbiAoKSB7fSB9KTtcbiAgICBjYW5EZWZpbmVQcm9wZXJ0eSA9IHRydWU7XG4gIH0gY2F0Y2ggKHgpIHtcbiAgICAvLyBJRSB3aWxsIGZhaWwgb24gZGVmaW5lUHJvcGVydHlcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGNhbkRlZmluZVByb3BlcnR5OyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBjaGVja1JlYWN0VHlwZVNwZWNcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfcHJvZEludmFyaWFudCA9IHJlcXVpcmUoJy4vcmVhY3RQcm9kSW52YXJpYW50Jyk7XG5cbnZhciBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lcyA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXMnKTtcbnZhciBSZWFjdFByb3BUeXBlc1NlY3JldCA9IHJlcXVpcmUoJy4vUmVhY3RQcm9wVHlwZXNTZWNyZXQnKTtcblxudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbnZhciBSZWFjdENvbXBvbmVudFRyZWVIb29rO1xuXG5pZiAodHlwZW9mIHByb2Nlc3MgIT09ICd1bmRlZmluZWQnICYmIHByb2Nlc3MuZW52ICYmIHByb2Nlc3MuZW52Lk5PREVfRU5WID09PSAndGVzdCcpIHtcbiAgLy8gVGVtcG9yYXJ5IGhhY2suXG4gIC8vIElubGluZSByZXF1aXJlcyBkb24ndCB3b3JrIHdlbGwgd2l0aCBKZXN0OlxuICAvLyBodHRwczovL2dpdGh1Yi5jb20vZmFjZWJvb2svcmVhY3QvaXNzdWVzLzcyNDBcbiAgLy8gUmVtb3ZlIHRoZSBpbmxpbmUgcmVxdWlyZXMgd2hlbiB3ZSBkb24ndCBuZWVkIHRoZW0gYW55bW9yZTpcbiAgLy8gaHR0cHM6Ly9naXRodWIuY29tL2ZhY2Vib29rL3JlYWN0L3B1bGwvNzE3OFxuICBSZWFjdENvbXBvbmVudFRyZWVIb29rID0gcmVxdWlyZSgnLi9SZWFjdENvbXBvbmVudFRyZWVIb29rJyk7XG59XG5cbnZhciBsb2dnZWRUeXBlRmFpbHVyZXMgPSB7fTtcblxuLyoqXG4gKiBBc3NlcnQgdGhhdCB0aGUgdmFsdWVzIG1hdGNoIHdpdGggdGhlIHR5cGUgc3BlY3MuXG4gKiBFcnJvciBtZXNzYWdlcyBhcmUgbWVtb3JpemVkIGFuZCB3aWxsIG9ubHkgYmUgc2hvd24gb25jZS5cbiAqXG4gKiBAcGFyYW0ge29iamVjdH0gdHlwZVNwZWNzIE1hcCBvZiBuYW1lIHRvIGEgUmVhY3RQcm9wVHlwZVxuICogQHBhcmFtIHtvYmplY3R9IHZhbHVlcyBSdW50aW1lIHZhbHVlcyB0aGF0IG5lZWQgdG8gYmUgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0ge3N0cmluZ30gbG9jYXRpb24gZS5nLiBcInByb3BcIiwgXCJjb250ZXh0XCIsIFwiY2hpbGQgY29udGV4dFwiXG4gKiBAcGFyYW0ge3N0cmluZ30gY29tcG9uZW50TmFtZSBOYW1lIG9mIHRoZSBjb21wb25lbnQgZm9yIGVycm9yIG1lc3NhZ2VzLlxuICogQHBhcmFtIHs/b2JqZWN0fSBlbGVtZW50IFRoZSBSZWFjdCBlbGVtZW50IHRoYXQgaXMgYmVpbmcgdHlwZS1jaGVja2VkXG4gKiBAcGFyYW0gez9udW1iZXJ9IGRlYnVnSUQgVGhlIFJlYWN0IGNvbXBvbmVudCBpbnN0YW5jZSB0aGF0IGlzIGJlaW5nIHR5cGUtY2hlY2tlZFxuICogQHByaXZhdGVcbiAqL1xuZnVuY3Rpb24gY2hlY2tSZWFjdFR5cGVTcGVjKHR5cGVTcGVjcywgdmFsdWVzLCBsb2NhdGlvbiwgY29tcG9uZW50TmFtZSwgZWxlbWVudCwgZGVidWdJRCkge1xuICBmb3IgKHZhciB0eXBlU3BlY05hbWUgaW4gdHlwZVNwZWNzKSB7XG4gICAgaWYgKHR5cGVTcGVjcy5oYXNPd25Qcm9wZXJ0eSh0eXBlU3BlY05hbWUpKSB7XG4gICAgICB2YXIgZXJyb3I7XG4gICAgICAvLyBQcm9wIHR5cGUgdmFsaWRhdGlvbiBtYXkgdGhyb3cuIEluIGNhc2UgdGhleSBkbywgd2UgZG9uJ3Qgd2FudCB0b1xuICAgICAgLy8gZmFpbCB0aGUgcmVuZGVyIHBoYXNlIHdoZXJlIGl0IGRpZG4ndCBmYWlsIGJlZm9yZS4gU28gd2UgbG9nIGl0LlxuICAgICAgLy8gQWZ0ZXIgdGhlc2UgaGF2ZSBiZWVuIGNsZWFuZWQgdXAsIHdlJ2xsIGxldCB0aGVtIHRocm93LlxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gVGhpcyBpcyBpbnRlbnRpb25hbGx5IGFuIGludmFyaWFudCB0aGF0IGdldHMgY2F1Z2h0LiBJdCdzIHRoZSBzYW1lXG4gICAgICAgIC8vIGJlaGF2aW9yIGFzIHdpdGhvdXQgdGhpcyBzdGF0ZW1lbnQgZXhjZXB0IHdpdGggYSBiZXR0ZXIgbWVzc2FnZS5cbiAgICAgICAgISh0eXBlb2YgdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0gPT09ICdmdW5jdGlvbicpID8gcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IGludmFyaWFudChmYWxzZSwgJyVzOiAlcyB0eXBlIGAlc2AgaXMgaW52YWxpZDsgaXQgbXVzdCBiZSBhIGZ1bmN0aW9uLCB1c3VhbGx5IGZyb20gUmVhY3QuUHJvcFR5cGVzLicsIGNvbXBvbmVudE5hbWUgfHwgJ1JlYWN0IGNsYXNzJywgUmVhY3RQcm9wVHlwZUxvY2F0aW9uTmFtZXNbbG9jYXRpb25dLCB0eXBlU3BlY05hbWUpIDogX3Byb2RJbnZhcmlhbnQoJzg0JywgY29tcG9uZW50TmFtZSB8fCAnUmVhY3QgY2xhc3MnLCBSZWFjdFByb3BUeXBlTG9jYXRpb25OYW1lc1tsb2NhdGlvbl0sIHR5cGVTcGVjTmFtZSkgOiB2b2lkIDA7XG4gICAgICAgIGVycm9yID0gdHlwZVNwZWNzW3R5cGVTcGVjTmFtZV0odmFsdWVzLCB0eXBlU3BlY05hbWUsIGNvbXBvbmVudE5hbWUsIGxvY2F0aW9uLCBudWxsLCBSZWFjdFByb3BUeXBlc1NlY3JldCk7XG4gICAgICB9IGNhdGNoIChleCkge1xuICAgICAgICBlcnJvciA9IGV4O1xuICAgICAgfVxuICAgICAgcHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJyA/IHdhcm5pbmcoIWVycm9yIHx8IGVycm9yIGluc3RhbmNlb2YgRXJyb3IsICclczogdHlwZSBzcGVjaWZpY2F0aW9uIG9mICVzIGAlc2AgaXMgaW52YWxpZDsgdGhlIHR5cGUgY2hlY2tlciAnICsgJ2Z1bmN0aW9uIG11c3QgcmV0dXJuIGBudWxsYCBvciBhbiBgRXJyb3JgIGJ1dCByZXR1cm5lZCBhICVzLiAnICsgJ1lvdSBtYXkgaGF2ZSBmb3Jnb3R0ZW4gdG8gcGFzcyBhbiBhcmd1bWVudCB0byB0aGUgdHlwZSBjaGVja2VyICcgKyAnY3JlYXRvciAoYXJyYXlPZiwgaW5zdGFuY2VPZiwgb2JqZWN0T2YsIG9uZU9mLCBvbmVPZlR5cGUsIGFuZCAnICsgJ3NoYXBlIGFsbCByZXF1aXJlIGFuIGFyZ3VtZW50KS4nLCBjb21wb25lbnROYW1lIHx8ICdSZWFjdCBjbGFzcycsIFJlYWN0UHJvcFR5cGVMb2NhdGlvbk5hbWVzW2xvY2F0aW9uXSwgdHlwZVNwZWNOYW1lLCB0eXBlb2YgZXJyb3IpIDogdm9pZCAwO1xuICAgICAgaWYgKGVycm9yIGluc3RhbmNlb2YgRXJyb3IgJiYgIShlcnJvci5tZXNzYWdlIGluIGxvZ2dlZFR5cGVGYWlsdXJlcykpIHtcbiAgICAgICAgLy8gT25seSBtb25pdG9yIHRoaXMgZmFpbHVyZSBvbmNlIGJlY2F1c2UgdGhlcmUgdGVuZHMgdG8gYmUgYSBsb3Qgb2YgdGhlXG4gICAgICAgIC8vIHNhbWUgZXJyb3IuXG4gICAgICAgIGxvZ2dlZFR5cGVGYWlsdXJlc1tlcnJvci5tZXNzYWdlXSA9IHRydWU7XG5cbiAgICAgICAgdmFyIGNvbXBvbmVudFN0YWNrSW5mbyA9ICcnO1xuXG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgaWYgKCFSZWFjdENvbXBvbmVudFRyZWVIb29rKSB7XG4gICAgICAgICAgICBSZWFjdENvbXBvbmVudFRyZWVIb29rID0gcmVxdWlyZSgnLi9SZWFjdENvbXBvbmVudFRyZWVIb29rJyk7XG4gICAgICAgICAgfVxuICAgICAgICAgIGlmIChkZWJ1Z0lEICE9PSBudWxsKSB7XG4gICAgICAgICAgICBjb21wb25lbnRTdGFja0luZm8gPSBSZWFjdENvbXBvbmVudFRyZWVIb29rLmdldFN0YWNrQWRkZW5kdW1CeUlEKGRlYnVnSUQpO1xuICAgICAgICAgIH0gZWxzZSBpZiAoZWxlbWVudCAhPT0gbnVsbCkge1xuICAgICAgICAgICAgY29tcG9uZW50U3RhY2tJbmZvID0gUmVhY3RDb21wb25lbnRUcmVlSG9vay5nZXRDdXJyZW50U3RhY2tBZGRlbmR1bShlbGVtZW50KTtcbiAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gd2FybmluZyhmYWxzZSwgJ0ZhaWxlZCAlcyB0eXBlOiAlcyVzJywgbG9jYXRpb24sIGVycm9yLm1lc3NhZ2UsIGNvbXBvbmVudFN0YWNrSW5mbykgOiB2b2lkIDA7XG4gICAgICB9XG4gICAgfVxuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gY2hlY2tSZWFjdFR5cGVTcGVjOyIsIi8qKlxuICogQ29weXJpZ2h0IDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIEBwcm92aWRlc01vZHVsZSBnZXRJdGVyYXRvckZuXG4gKiBcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qIGdsb2JhbCBTeW1ib2wgKi9cblxudmFyIElURVJBVE9SX1NZTUJPTCA9IHR5cGVvZiBTeW1ib2wgPT09ICdmdW5jdGlvbicgJiYgU3ltYm9sLml0ZXJhdG9yO1xudmFyIEZBVVhfSVRFUkFUT1JfU1lNQk9MID0gJ0BAaXRlcmF0b3InOyAvLyBCZWZvcmUgU3ltYm9sIHNwZWMuXG5cbi8qKlxuICogUmV0dXJucyB0aGUgaXRlcmF0b3IgbWV0aG9kIGZ1bmN0aW9uIGNvbnRhaW5lZCBvbiB0aGUgaXRlcmFibGUgb2JqZWN0LlxuICpcbiAqIEJlIHN1cmUgdG8gaW52b2tlIHRoZSBmdW5jdGlvbiB3aXRoIHRoZSBpdGVyYWJsZSBhcyBjb250ZXh0OlxuICpcbiAqICAgICB2YXIgaXRlcmF0b3JGbiA9IGdldEl0ZXJhdG9yRm4obXlJdGVyYWJsZSk7XG4gKiAgICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAqICAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChteUl0ZXJhYmxlKTtcbiAqICAgICAgIC4uLlxuICogICAgIH1cbiAqXG4gKiBAcGFyYW0gez9vYmplY3R9IG1heWJlSXRlcmFibGVcbiAqIEByZXR1cm4gez9mdW5jdGlvbn1cbiAqL1xuZnVuY3Rpb24gZ2V0SXRlcmF0b3JGbihtYXliZUl0ZXJhYmxlKSB7XG4gIHZhciBpdGVyYXRvckZuID0gbWF5YmVJdGVyYWJsZSAmJiAoSVRFUkFUT1JfU1lNQk9MICYmIG1heWJlSXRlcmFibGVbSVRFUkFUT1JfU1lNQk9MXSB8fCBtYXliZUl0ZXJhYmxlW0ZBVVhfSVRFUkFUT1JfU1lNQk9MXSk7XG4gIGlmICh0eXBlb2YgaXRlcmF0b3JGbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgIHJldHVybiBpdGVyYXRvckZuO1xuICB9XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZ2V0SXRlcmF0b3JGbjsiLCIvKipcbiAqIENvcHlyaWdodCAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKiBAcHJvdmlkZXNNb2R1bGUgb25seUNoaWxkXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIF9wcm9kSW52YXJpYW50ID0gcmVxdWlyZSgnLi9yZWFjdFByb2RJbnZhcmlhbnQnKTtcblxudmFyIFJlYWN0RWxlbWVudCA9IHJlcXVpcmUoJy4vUmVhY3RFbGVtZW50Jyk7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCdmYmpzL2xpYi9pbnZhcmlhbnQnKTtcblxuLyoqXG4gKiBSZXR1cm5zIHRoZSBmaXJzdCBjaGlsZCBpbiBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4gYW5kIHZlcmlmaWVzIHRoYXQgdGhlcmVcbiAqIGlzIG9ubHkgb25lIGNoaWxkIGluIHRoZSBjb2xsZWN0aW9uLlxuICpcbiAqIFNlZSBodHRwczovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL3RvcC1sZXZlbC1hcGkuaHRtbCNyZWFjdC5jaGlsZHJlbi5vbmx5XG4gKlxuICogVGhlIGN1cnJlbnQgaW1wbGVtZW50YXRpb24gb2YgdGhpcyBmdW5jdGlvbiBhc3N1bWVzIHRoYXQgYSBzaW5nbGUgY2hpbGQgZ2V0c1xuICogcGFzc2VkIHdpdGhvdXQgYSB3cmFwcGVyLCBidXQgdGhlIHB1cnBvc2Ugb2YgdGhpcyBoZWxwZXIgZnVuY3Rpb24gaXMgdG9cbiAqIGFic3RyYWN0IGF3YXkgdGhlIHBhcnRpY3VsYXIgc3RydWN0dXJlIG9mIGNoaWxkcmVuLlxuICpcbiAqIEBwYXJhbSB7P29iamVjdH0gY2hpbGRyZW4gQ2hpbGQgY29sbGVjdGlvbiBzdHJ1Y3R1cmUuXG4gKiBAcmV0dXJuIHtSZWFjdEVsZW1lbnR9IFRoZSBmaXJzdCBhbmQgb25seSBgUmVhY3RFbGVtZW50YCBjb250YWluZWQgaW4gdGhlXG4gKiBzdHJ1Y3R1cmUuXG4gKi9cbmZ1bmN0aW9uIG9ubHlDaGlsZChjaGlsZHJlbikge1xuICAhUmVhY3RFbGVtZW50LmlzVmFsaWRFbGVtZW50KGNoaWxkcmVuKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdSZWFjdC5DaGlsZHJlbi5vbmx5IGV4cGVjdGVkIHRvIHJlY2VpdmUgYSBzaW5nbGUgUmVhY3QgZWxlbWVudCBjaGlsZC4nKSA6IF9wcm9kSW52YXJpYW50KCcxNDMnKSA6IHZvaWQgMDtcbiAgcmV0dXJuIGNoaWxkcmVuO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IG9ubHlDaGlsZDsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIHJlYWN0UHJvZEludmFyaWFudFxuICogXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuLyoqXG4gKiBXQVJOSU5HOiBETyBOT1QgbWFudWFsbHkgcmVxdWlyZSB0aGlzIG1vZHVsZS5cbiAqIFRoaXMgaXMgYSByZXBsYWNlbWVudCBmb3IgYGludmFyaWFudCguLi4pYCB1c2VkIGJ5IHRoZSBlcnJvciBjb2RlIHN5c3RlbVxuICogYW5kIHdpbGwgX29ubHlfIGJlIHJlcXVpcmVkIGJ5IHRoZSBjb3JyZXNwb25kaW5nIGJhYmVsIHBhc3MuXG4gKiBJdCBhbHdheXMgdGhyb3dzLlxuICovXG5cbmZ1bmN0aW9uIHJlYWN0UHJvZEludmFyaWFudChjb2RlKSB7XG4gIHZhciBhcmdDb3VudCA9IGFyZ3VtZW50cy5sZW5ndGggLSAxO1xuXG4gIHZhciBtZXNzYWdlID0gJ01pbmlmaWVkIFJlYWN0IGVycm9yICMnICsgY29kZSArICc7IHZpc2l0ICcgKyAnaHR0cDovL2ZhY2Vib29rLmdpdGh1Yi5pby9yZWFjdC9kb2NzL2Vycm9yLWRlY29kZXIuaHRtbD9pbnZhcmlhbnQ9JyArIGNvZGU7XG5cbiAgZm9yICh2YXIgYXJnSWR4ID0gMDsgYXJnSWR4IDwgYXJnQ291bnQ7IGFyZ0lkeCsrKSB7XG4gICAgbWVzc2FnZSArPSAnJmFyZ3NbXT0nICsgZW5jb2RlVVJJQ29tcG9uZW50KGFyZ3VtZW50c1thcmdJZHggKyAxXSk7XG4gIH1cblxuICBtZXNzYWdlICs9ICcgZm9yIHRoZSBmdWxsIG1lc3NhZ2Ugb3IgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50JyArICcgZm9yIGZ1bGwgZXJyb3JzIGFuZCBhZGRpdGlvbmFsIGhlbHBmdWwgd2FybmluZ3MuJztcblxuICB2YXIgZXJyb3IgPSBuZXcgRXJyb3IobWVzc2FnZSk7XG4gIGVycm9yLm5hbWUgPSAnSW52YXJpYW50IFZpb2xhdGlvbic7XG4gIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCByZWFjdFByb2RJbnZhcmlhbnQncyBvd24gZnJhbWVcblxuICB0aHJvdyBlcnJvcjtcbn1cblxubW9kdWxlLmV4cG9ydHMgPSByZWFjdFByb2RJbnZhcmlhbnQ7IiwiLyoqXG4gKiBDb3B5cmlnaHQgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHByb3ZpZGVzTW9kdWxlIHRyYXZlcnNlQWxsQ2hpbGRyZW5cbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBfcHJvZEludmFyaWFudCA9IHJlcXVpcmUoJy4vcmVhY3RQcm9kSW52YXJpYW50Jyk7XG5cbnZhciBSZWFjdEN1cnJlbnRPd25lciA9IHJlcXVpcmUoJy4vUmVhY3RDdXJyZW50T3duZXInKTtcbnZhciBSZWFjdEVsZW1lbnQgPSByZXF1aXJlKCcuL1JlYWN0RWxlbWVudCcpO1xuXG52YXIgZ2V0SXRlcmF0b3JGbiA9IHJlcXVpcmUoJy4vZ2V0SXRlcmF0b3JGbicpO1xudmFyIGludmFyaWFudCA9IHJlcXVpcmUoJ2ZianMvbGliL2ludmFyaWFudCcpO1xudmFyIEtleUVzY2FwZVV0aWxzID0gcmVxdWlyZSgnLi9LZXlFc2NhcGVVdGlscycpO1xudmFyIHdhcm5pbmcgPSByZXF1aXJlKCdmYmpzL2xpYi93YXJuaW5nJyk7XG5cbnZhciBTRVBBUkFUT1IgPSAnLic7XG52YXIgU1VCU0VQQVJBVE9SID0gJzonO1xuXG4vKipcbiAqIFRPRE86IFRlc3QgdGhhdCBhIHNpbmdsZSBjaGlsZCBhbmQgYW4gYXJyYXkgd2l0aCBvbmUgaXRlbSBoYXZlIHRoZSBzYW1lIGtleVxuICogcGF0dGVybi5cbiAqL1xuXG52YXIgZGlkV2FybkFib3V0TWFwcyA9IGZhbHNlO1xuXG4vKipcbiAqIEdlbmVyYXRlIGEga2V5IHN0cmluZyB0aGF0IGlkZW50aWZpZXMgYSBjb21wb25lbnQgd2l0aGluIGEgc2V0LlxuICpcbiAqIEBwYXJhbSB7Kn0gY29tcG9uZW50IEEgY29tcG9uZW50IHRoYXQgY291bGQgY29udGFpbiBhIG1hbnVhbCBrZXkuXG4gKiBAcGFyYW0ge251bWJlcn0gaW5kZXggSW5kZXggdGhhdCBpcyB1c2VkIGlmIGEgbWFudWFsIGtleSBpcyBub3QgcHJvdmlkZWQuXG4gKiBAcmV0dXJuIHtzdHJpbmd9XG4gKi9cbmZ1bmN0aW9uIGdldENvbXBvbmVudEtleShjb21wb25lbnQsIGluZGV4KSB7XG4gIC8vIERvIHNvbWUgdHlwZWNoZWNraW5nIGhlcmUgc2luY2Ugd2UgY2FsbCB0aGlzIGJsaW5kbHkuIFdlIHdhbnQgdG8gZW5zdXJlXG4gIC8vIHRoYXQgd2UgZG9uJ3QgYmxvY2sgcG90ZW50aWFsIGZ1dHVyZSBFUyBBUElzLlxuICBpZiAoY29tcG9uZW50ICYmIHR5cGVvZiBjb21wb25lbnQgPT09ICdvYmplY3QnICYmIGNvbXBvbmVudC5rZXkgIT0gbnVsbCkge1xuICAgIC8vIEV4cGxpY2l0IGtleVxuICAgIHJldHVybiBLZXlFc2NhcGVVdGlscy5lc2NhcGUoY29tcG9uZW50LmtleSk7XG4gIH1cbiAgLy8gSW1wbGljaXQga2V5IGRldGVybWluZWQgYnkgdGhlIGluZGV4IGluIHRoZSBzZXRcbiAgcmV0dXJuIGluZGV4LnRvU3RyaW5nKDM2KTtcbn1cblxuLyoqXG4gKiBAcGFyYW0gez8qfSBjaGlsZHJlbiBDaGlsZHJlbiB0cmVlIGNvbnRhaW5lci5cbiAqIEBwYXJhbSB7IXN0cmluZ30gbmFtZVNvRmFyIE5hbWUgb2YgdGhlIGtleSBwYXRoIHNvIGZhci5cbiAqIEBwYXJhbSB7IWZ1bmN0aW9ufSBjYWxsYmFjayBDYWxsYmFjayB0byBpbnZva2Ugd2l0aCBlYWNoIGNoaWxkIGZvdW5kLlxuICogQHBhcmFtIHs/Kn0gdHJhdmVyc2VDb250ZXh0IFVzZWQgdG8gcGFzcyBpbmZvcm1hdGlvbiB0aHJvdWdob3V0IHRoZSB0cmF2ZXJzYWxcbiAqIHByb2Nlc3MuXG4gKiBAcmV0dXJuIHshbnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuIGluIHRoaXMgc3VidHJlZS5cbiAqL1xuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbkltcGwoY2hpbGRyZW4sIG5hbWVTb0ZhciwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICB2YXIgdHlwZSA9IHR5cGVvZiBjaGlsZHJlbjtcblxuICBpZiAodHlwZSA9PT0gJ3VuZGVmaW5lZCcgfHwgdHlwZSA9PT0gJ2Jvb2xlYW4nKSB7XG4gICAgLy8gQWxsIG9mIHRoZSBhYm92ZSBhcmUgcGVyY2VpdmVkIGFzIG51bGwuXG4gICAgY2hpbGRyZW4gPSBudWxsO1xuICB9XG5cbiAgaWYgKGNoaWxkcmVuID09PSBudWxsIHx8IHR5cGUgPT09ICdzdHJpbmcnIHx8IHR5cGUgPT09ICdudW1iZXInIHx8IFJlYWN0RWxlbWVudC5pc1ZhbGlkRWxlbWVudChjaGlsZHJlbikpIHtcbiAgICBjYWxsYmFjayh0cmF2ZXJzZUNvbnRleHQsIGNoaWxkcmVuLFxuICAgIC8vIElmIGl0J3MgdGhlIG9ubHkgY2hpbGQsIHRyZWF0IHRoZSBuYW1lIGFzIGlmIGl0IHdhcyB3cmFwcGVkIGluIGFuIGFycmF5XG4gICAgLy8gc28gdGhhdCBpdCdzIGNvbnNpc3RlbnQgaWYgdGhlIG51bWJlciBvZiBjaGlsZHJlbiBncm93cy5cbiAgICBuYW1lU29GYXIgPT09ICcnID8gU0VQQVJBVE9SICsgZ2V0Q29tcG9uZW50S2V5KGNoaWxkcmVuLCAwKSA6IG5hbWVTb0Zhcik7XG4gICAgcmV0dXJuIDE7XG4gIH1cblxuICB2YXIgY2hpbGQ7XG4gIHZhciBuZXh0TmFtZTtcbiAgdmFyIHN1YnRyZWVDb3VudCA9IDA7IC8vIENvdW50IG9mIGNoaWxkcmVuIGZvdW5kIGluIHRoZSBjdXJyZW50IHN1YnRyZWUuXG4gIHZhciBuZXh0TmFtZVByZWZpeCA9IG5hbWVTb0ZhciA9PT0gJycgPyBTRVBBUkFUT1IgOiBuYW1lU29GYXIgKyBTVUJTRVBBUkFUT1I7XG5cbiAgaWYgKEFycmF5LmlzQXJyYXkoY2hpbGRyZW4pKSB7XG4gICAgZm9yICh2YXIgaSA9IDA7IGkgPCBjaGlsZHJlbi5sZW5ndGg7IGkrKykge1xuICAgICAgY2hpbGQgPSBjaGlsZHJlbltpXTtcbiAgICAgIG5leHROYW1lID0gbmV4dE5hbWVQcmVmaXggKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIGkpO1xuICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgfVxuICB9IGVsc2Uge1xuICAgIHZhciBpdGVyYXRvckZuID0gZ2V0SXRlcmF0b3JGbihjaGlsZHJlbik7XG4gICAgaWYgKGl0ZXJhdG9yRm4pIHtcbiAgICAgIHZhciBpdGVyYXRvciA9IGl0ZXJhdG9yRm4uY2FsbChjaGlsZHJlbik7XG4gICAgICB2YXIgc3RlcDtcbiAgICAgIGlmIChpdGVyYXRvckZuICE9PSBjaGlsZHJlbi5lbnRyaWVzKSB7XG4gICAgICAgIHZhciBpaSA9IDA7XG4gICAgICAgIHdoaWxlICghKHN0ZXAgPSBpdGVyYXRvci5uZXh0KCkpLmRvbmUpIHtcbiAgICAgICAgICBjaGlsZCA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIGdldENvbXBvbmVudEtleShjaGlsZCwgaWkrKyk7XG4gICAgICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgICAgIH1cbiAgICAgIH0gZWxzZSB7XG4gICAgICAgIGlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gICAgICAgICAgdmFyIG1hcHNBc0NoaWxkcmVuQWRkZW5kdW0gPSAnJztcbiAgICAgICAgICBpZiAoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgICAgICAgICAgdmFyIG1hcHNBc0NoaWxkcmVuT3duZXJOYW1lID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC5nZXROYW1lKCk7XG4gICAgICAgICAgICBpZiAobWFwc0FzQ2hpbGRyZW5Pd25lck5hbWUpIHtcbiAgICAgICAgICAgICAgbWFwc0FzQ2hpbGRyZW5BZGRlbmR1bSA9ICcgQ2hlY2sgdGhlIHJlbmRlciBtZXRob2Qgb2YgYCcgKyBtYXBzQXNDaGlsZHJlbk93bmVyTmFtZSArICdgLic7XG4gICAgICAgICAgICB9XG4gICAgICAgICAgfVxuICAgICAgICAgIHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyB3YXJuaW5nKGRpZFdhcm5BYm91dE1hcHMsICdVc2luZyBNYXBzIGFzIGNoaWxkcmVuIGlzIG5vdCB5ZXQgZnVsbHkgc3VwcG9ydGVkLiBJdCBpcyBhbiAnICsgJ2V4cGVyaW1lbnRhbCBmZWF0dXJlIHRoYXQgbWlnaHQgYmUgcmVtb3ZlZC4gQ29udmVydCBpdCB0byBhICcgKyAnc2VxdWVuY2UgLyBpdGVyYWJsZSBvZiBrZXllZCBSZWFjdEVsZW1lbnRzIGluc3RlYWQuJXMnLCBtYXBzQXNDaGlsZHJlbkFkZGVuZHVtKSA6IHZvaWQgMDtcbiAgICAgICAgICBkaWRXYXJuQWJvdXRNYXBzID0gdHJ1ZTtcbiAgICAgICAgfVxuICAgICAgICAvLyBJdGVyYXRvciB3aWxsIHByb3ZpZGUgZW50cnkgW2ssdl0gdHVwbGVzIHJhdGhlciB0aGFuIHZhbHVlcy5cbiAgICAgICAgd2hpbGUgKCEoc3RlcCA9IGl0ZXJhdG9yLm5leHQoKSkuZG9uZSkge1xuICAgICAgICAgIHZhciBlbnRyeSA9IHN0ZXAudmFsdWU7XG4gICAgICAgICAgaWYgKGVudHJ5KSB7XG4gICAgICAgICAgICBjaGlsZCA9IGVudHJ5WzFdO1xuICAgICAgICAgICAgbmV4dE5hbWUgPSBuZXh0TmFtZVByZWZpeCArIEtleUVzY2FwZVV0aWxzLmVzY2FwZShlbnRyeVswXSkgKyBTVUJTRVBBUkFUT1IgKyBnZXRDb21wb25lbnRLZXkoY2hpbGQsIDApO1xuICAgICAgICAgICAgc3VidHJlZUNvdW50ICs9IHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkLCBuZXh0TmFtZSwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG4gICAgICAgICAgfVxuICAgICAgICB9XG4gICAgICB9XG4gICAgfSBlbHNlIGlmICh0eXBlID09PSAnb2JqZWN0Jykge1xuICAgICAgdmFyIGFkZGVuZHVtID0gJyc7XG4gICAgICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgICAgICBhZGRlbmR1bSA9ICcgSWYgeW91IG1lYW50IHRvIHJlbmRlciBhIGNvbGxlY3Rpb24gb2YgY2hpbGRyZW4sIHVzZSBhbiBhcnJheSAnICsgJ2luc3RlYWQgb3Igd3JhcCB0aGUgb2JqZWN0IHVzaW5nIGNyZWF0ZUZyYWdtZW50KG9iamVjdCkgZnJvbSB0aGUgJyArICdSZWFjdCBhZGQtb25zLic7XG4gICAgICAgIGlmIChjaGlsZHJlbi5faXNSZWFjdEVsZW1lbnQpIHtcbiAgICAgICAgICBhZGRlbmR1bSA9ICcgSXQgbG9va3MgbGlrZSB5b3VcXCdyZSB1c2luZyBhbiBlbGVtZW50IGNyZWF0ZWQgYnkgYSBkaWZmZXJlbnQgJyArICd2ZXJzaW9uIG9mIFJlYWN0LiBNYWtlIHN1cmUgdG8gdXNlIG9ubHkgb25lIGNvcHkgb2YgUmVhY3QuJztcbiAgICAgICAgfVxuICAgICAgICBpZiAoUmVhY3RDdXJyZW50T3duZXIuY3VycmVudCkge1xuICAgICAgICAgIHZhciBuYW1lID0gUmVhY3RDdXJyZW50T3duZXIuY3VycmVudC5nZXROYW1lKCk7XG4gICAgICAgICAgaWYgKG5hbWUpIHtcbiAgICAgICAgICAgIGFkZGVuZHVtICs9ICcgQ2hlY2sgdGhlIHJlbmRlciBtZXRob2Qgb2YgYCcgKyBuYW1lICsgJ2AuJztcbiAgICAgICAgICB9XG4gICAgICAgIH1cbiAgICAgIH1cbiAgICAgIHZhciBjaGlsZHJlblN0cmluZyA9IFN0cmluZyhjaGlsZHJlbik7XG4gICAgICAhZmFsc2UgPyBwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nID8gaW52YXJpYW50KGZhbHNlLCAnT2JqZWN0cyBhcmUgbm90IHZhbGlkIGFzIGEgUmVhY3QgY2hpbGQgKGZvdW5kOiAlcykuJXMnLCBjaGlsZHJlblN0cmluZyA9PT0gJ1tvYmplY3QgT2JqZWN0XScgPyAnb2JqZWN0IHdpdGgga2V5cyB7JyArIE9iamVjdC5rZXlzKGNoaWxkcmVuKS5qb2luKCcsICcpICsgJ30nIDogY2hpbGRyZW5TdHJpbmcsIGFkZGVuZHVtKSA6IF9wcm9kSW52YXJpYW50KCczMScsIGNoaWxkcmVuU3RyaW5nID09PSAnW29iamVjdCBPYmplY3RdJyA/ICdvYmplY3Qgd2l0aCBrZXlzIHsnICsgT2JqZWN0LmtleXMoY2hpbGRyZW4pLmpvaW4oJywgJykgKyAnfScgOiBjaGlsZHJlblN0cmluZywgYWRkZW5kdW0pIDogdm9pZCAwO1xuICAgIH1cbiAgfVxuXG4gIHJldHVybiBzdWJ0cmVlQ291bnQ7XG59XG5cbi8qKlxuICogVHJhdmVyc2VzIGNoaWxkcmVuIHRoYXQgYXJlIHR5cGljYWxseSBzcGVjaWZpZWQgYXMgYHByb3BzLmNoaWxkcmVuYCwgYnV0XG4gKiBtaWdodCBhbHNvIGJlIHNwZWNpZmllZCB0aHJvdWdoIGF0dHJpYnV0ZXM6XG4gKlxuICogLSBgdHJhdmVyc2VBbGxDaGlsZHJlbih0aGlzLnByb3BzLmNoaWxkcmVuLCAuLi4pYFxuICogLSBgdHJhdmVyc2VBbGxDaGlsZHJlbih0aGlzLnByb3BzLmxlZnRQYW5lbENoaWxkcmVuLCAuLi4pYFxuICpcbiAqIFRoZSBgdHJhdmVyc2VDb250ZXh0YCBpcyBhbiBvcHRpb25hbCBhcmd1bWVudCB0aGF0IGlzIHBhc3NlZCB0aHJvdWdoIHRoZVxuICogZW50aXJlIHRyYXZlcnNhbC4gSXQgY2FuIGJlIHVzZWQgdG8gc3RvcmUgYWNjdW11bGF0aW9ucyBvciBhbnl0aGluZyBlbHNlIHRoYXRcbiAqIHRoZSBjYWxsYmFjayBtaWdodCBmaW5kIHJlbGV2YW50LlxuICpcbiAqIEBwYXJhbSB7Pyp9IGNoaWxkcmVuIENoaWxkcmVuIHRyZWUgb2JqZWN0LlxuICogQHBhcmFtIHshZnVuY3Rpb259IGNhbGxiYWNrIFRvIGludm9rZSB1cG9uIHRyYXZlcnNpbmcgZWFjaCBjaGlsZC5cbiAqIEBwYXJhbSB7Pyp9IHRyYXZlcnNlQ29udGV4dCBDb250ZXh0IGZvciB0cmF2ZXJzYWwuXG4gKiBAcmV0dXJuIHshbnVtYmVyfSBUaGUgbnVtYmVyIG9mIGNoaWxkcmVuIGluIHRoaXMgc3VidHJlZS5cbiAqL1xuZnVuY3Rpb24gdHJhdmVyc2VBbGxDaGlsZHJlbihjaGlsZHJlbiwgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCkge1xuICBpZiAoY2hpbGRyZW4gPT0gbnVsbCkge1xuICAgIHJldHVybiAwO1xuICB9XG5cbiAgcmV0dXJuIHRyYXZlcnNlQWxsQ2hpbGRyZW5JbXBsKGNoaWxkcmVuLCAnJywgY2FsbGJhY2ssIHRyYXZlcnNlQ29udGV4dCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gdHJhdmVyc2VBbGxDaGlsZHJlbjsiLCJcInVzZSBzdHJpY3RcIjtcblxuLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqIFxuICovXG5cbmZ1bmN0aW9uIG1ha2VFbXB0eUZ1bmN0aW9uKGFyZykge1xuICByZXR1cm4gZnVuY3Rpb24gKCkge1xuICAgIHJldHVybiBhcmc7XG4gIH07XG59XG5cbi8qKlxuICogVGhpcyBmdW5jdGlvbiBhY2NlcHRzIGFuZCBkaXNjYXJkcyBpbnB1dHM7IGl0IGhhcyBubyBzaWRlIGVmZmVjdHMuIFRoaXMgaXNcbiAqIHByaW1hcmlseSB1c2VmdWwgaWRpb21hdGljYWxseSBmb3Igb3ZlcnJpZGFibGUgZnVuY3Rpb24gZW5kcG9pbnRzIHdoaWNoXG4gKiBhbHdheXMgbmVlZCB0byBiZSBjYWxsYWJsZSwgc2luY2UgSlMgbGFja3MgYSBudWxsLWNhbGwgaWRpb20gYWxhIENvY29hLlxuICovXG52YXIgZW1wdHlGdW5jdGlvbiA9IGZ1bmN0aW9uIGVtcHR5RnVuY3Rpb24oKSB7fTtcblxuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJucyA9IG1ha2VFbXB0eUZ1bmN0aW9uO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0ZhbHNlID0gbWFrZUVtcHR5RnVuY3Rpb24oZmFsc2UpO1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc1RydWUgPSBtYWtlRW1wdHlGdW5jdGlvbih0cnVlKTtcbmVtcHR5RnVuY3Rpb24udGhhdFJldHVybnNOdWxsID0gbWFrZUVtcHR5RnVuY3Rpb24obnVsbCk7XG5lbXB0eUZ1bmN0aW9uLnRoYXRSZXR1cm5zVGhpcyA9IGZ1bmN0aW9uICgpIHtcbiAgcmV0dXJuIHRoaXM7XG59O1xuZW1wdHlGdW5jdGlvbi50aGF0UmV0dXJuc0FyZ3VtZW50ID0gZnVuY3Rpb24gKGFyZykge1xuICByZXR1cm4gYXJnO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBlbXB0eUZ1bmN0aW9uOyIsIi8qKlxuICogQ29weXJpZ2h0IChjKSAyMDEzLXByZXNlbnQsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlPYmplY3QgPSB7fTtcblxuaWYgKHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicpIHtcbiAgT2JqZWN0LmZyZWV6ZShlbXB0eU9iamVjdCk7XG59XG5cbm1vZHVsZS5leHBvcnRzID0gZW1wdHlPYmplY3Q7IiwiLyoqXG4gKiBDb3B5cmlnaHQgKGMpIDIwMTMtcHJlc2VudCwgRmFjZWJvb2ssIEluYy5cbiAqIEFsbCByaWdodHMgcmVzZXJ2ZWQuXG4gKlxuICogVGhpcyBzb3VyY2UgY29kZSBpcyBsaWNlbnNlZCB1bmRlciB0aGUgQlNELXN0eWxlIGxpY2Vuc2UgZm91bmQgaW4gdGhlXG4gKiBMSUNFTlNFIGZpbGUgaW4gdGhlIHJvb3QgZGlyZWN0b3J5IG9mIHRoaXMgc291cmNlIHRyZWUuIEFuIGFkZGl0aW9uYWwgZ3JhbnRcbiAqIG9mIHBhdGVudCByaWdodHMgY2FuIGJlIGZvdW5kIGluIHRoZSBQQVRFTlRTIGZpbGUgaW4gdGhlIHNhbWUgZGlyZWN0b3J5LlxuICpcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbi8qKlxuICogVXNlIGludmFyaWFudCgpIHRvIGFzc2VydCBzdGF0ZSB3aGljaCB5b3VyIHByb2dyYW0gYXNzdW1lcyB0byBiZSB0cnVlLlxuICpcbiAqIFByb3ZpZGUgc3ByaW50Zi1zdHlsZSBmb3JtYXQgKG9ubHkgJXMgaXMgc3VwcG9ydGVkKSBhbmQgYXJndW1lbnRzXG4gKiB0byBwcm92aWRlIGluZm9ybWF0aW9uIGFib3V0IHdoYXQgYnJva2UgYW5kIHdoYXQgeW91IHdlcmVcbiAqIGV4cGVjdGluZy5cbiAqXG4gKiBUaGUgaW52YXJpYW50IG1lc3NhZ2Ugd2lsbCBiZSBzdHJpcHBlZCBpbiBwcm9kdWN0aW9uLCBidXQgdGhlIGludmFyaWFudFxuICogd2lsbCByZW1haW4gdG8gZW5zdXJlIGxvZ2ljIGRvZXMgbm90IGRpZmZlciBpbiBwcm9kdWN0aW9uLlxuICovXG5cbmZ1bmN0aW9uIGludmFyaWFudChjb25kaXRpb24sIGZvcm1hdCwgYSwgYiwgYywgZCwgZSwgZikge1xuICBpZiAocHJvY2Vzcy5lbnYuTk9ERV9FTlYgIT09ICdwcm9kdWN0aW9uJykge1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgdGhyb3cgbmV3IEVycm9yKCdpbnZhcmlhbnQgcmVxdWlyZXMgYW4gZXJyb3IgbWVzc2FnZSBhcmd1bWVudCcpO1xuICAgIH1cbiAgfVxuXG4gIGlmICghY29uZGl0aW9uKSB7XG4gICAgdmFyIGVycm9yO1xuICAgIGlmIChmb3JtYXQgPT09IHVuZGVmaW5lZCkge1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoJ01pbmlmaWVkIGV4Y2VwdGlvbiBvY2N1cnJlZDsgdXNlIHRoZSBub24tbWluaWZpZWQgZGV2IGVudmlyb25tZW50ICcgKyAnZm9yIHRoZSBmdWxsIGVycm9yIG1lc3NhZ2UgYW5kIGFkZGl0aW9uYWwgaGVscGZ1bCB3YXJuaW5ncy4nKTtcbiAgICB9IGVsc2Uge1xuICAgICAgdmFyIGFyZ3MgPSBbYSwgYiwgYywgZCwgZSwgZl07XG4gICAgICB2YXIgYXJnSW5kZXggPSAwO1xuICAgICAgZXJyb3IgPSBuZXcgRXJyb3IoZm9ybWF0LnJlcGxhY2UoLyVzL2csIGZ1bmN0aW9uICgpIHtcbiAgICAgICAgcmV0dXJuIGFyZ3NbYXJnSW5kZXgrK107XG4gICAgICB9KSk7XG4gICAgICBlcnJvci5uYW1lID0gJ0ludmFyaWFudCBWaW9sYXRpb24nO1xuICAgIH1cblxuICAgIGVycm9yLmZyYW1lc1RvUG9wID0gMTsgLy8gd2UgZG9uJ3QgY2FyZSBhYm91dCBpbnZhcmlhbnQncyBvd24gZnJhbWVcbiAgICB0aHJvdyBlcnJvcjtcbiAgfVxufVxuXG5tb2R1bGUuZXhwb3J0cyA9IGludmFyaWFudDsiLCIvKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICogQHR5cGVjaGVja3Mgc3RhdGljLW9ubHlcbiAqL1xuXG4ndXNlIHN0cmljdCc7XG5cbnZhciBpbnZhcmlhbnQgPSByZXF1aXJlKCcuL2ludmFyaWFudCcpO1xuXG4vKipcbiAqIENvbnN0cnVjdHMgYW4gZW51bWVyYXRpb24gd2l0aCBrZXlzIGVxdWFsIHRvIHRoZWlyIHZhbHVlLlxuICpcbiAqIEZvciBleGFtcGxlOlxuICpcbiAqICAgdmFyIENPTE9SUyA9IGtleU1pcnJvcih7Ymx1ZTogbnVsbCwgcmVkOiBudWxsfSk7XG4gKiAgIHZhciBteUNvbG9yID0gQ09MT1JTLmJsdWU7XG4gKiAgIHZhciBpc0NvbG9yVmFsaWQgPSAhIUNPTE9SU1tteUNvbG9yXTtcbiAqXG4gKiBUaGUgbGFzdCBsaW5lIGNvdWxkIG5vdCBiZSBwZXJmb3JtZWQgaWYgdGhlIHZhbHVlcyBvZiB0aGUgZ2VuZXJhdGVkIGVudW0gd2VyZVxuICogbm90IGVxdWFsIHRvIHRoZWlyIGtleXMuXG4gKlxuICogICBJbnB1dDogIHtrZXkxOiB2YWwxLCBrZXkyOiB2YWwyfVxuICogICBPdXRwdXQ6IHtrZXkxOiBrZXkxLCBrZXkyOiBrZXkyfVxuICpcbiAqIEBwYXJhbSB7b2JqZWN0fSBvYmpcbiAqIEByZXR1cm4ge29iamVjdH1cbiAqL1xudmFyIGtleU1pcnJvciA9IGZ1bmN0aW9uIGtleU1pcnJvcihvYmopIHtcbiAgdmFyIHJldCA9IHt9O1xuICB2YXIga2V5O1xuICAhKG9iaiBpbnN0YW5jZW9mIE9iamVjdCAmJiAhQXJyYXkuaXNBcnJheShvYmopKSA/IHByb2Nlc3MuZW52Lk5PREVfRU5WICE9PSAncHJvZHVjdGlvbicgPyBpbnZhcmlhbnQoZmFsc2UsICdrZXlNaXJyb3IoLi4uKTogQXJndW1lbnQgbXVzdCBiZSBhbiBvYmplY3QuJykgOiBpbnZhcmlhbnQoZmFsc2UpIDogdm9pZCAwO1xuICBmb3IgKGtleSBpbiBvYmopIHtcbiAgICBpZiAoIW9iai5oYXNPd25Qcm9wZXJ0eShrZXkpKSB7XG4gICAgICBjb250aW51ZTtcbiAgICB9XG4gICAgcmV0W2tleV0gPSBrZXk7XG4gIH1cbiAgcmV0dXJuIHJldDtcbn07XG5cbm1vZHVsZS5leHBvcnRzID0ga2V5TWlycm9yOyIsIlwidXNlIHN0cmljdFwiO1xuXG4vKipcbiAqIENvcHlyaWdodCAoYykgMjAxMy1wcmVzZW50LCBGYWNlYm9vaywgSW5jLlxuICogQWxsIHJpZ2h0cyByZXNlcnZlZC5cbiAqXG4gKiBUaGlzIHNvdXJjZSBjb2RlIGlzIGxpY2Vuc2VkIHVuZGVyIHRoZSBCU0Qtc3R5bGUgbGljZW5zZSBmb3VuZCBpbiB0aGVcbiAqIExJQ0VOU0UgZmlsZSBpbiB0aGUgcm9vdCBkaXJlY3Rvcnkgb2YgdGhpcyBzb3VyY2UgdHJlZS4gQW4gYWRkaXRpb25hbCBncmFudFxuICogb2YgcGF0ZW50IHJpZ2h0cyBjYW4gYmUgZm91bmQgaW4gdGhlIFBBVEVOVFMgZmlsZSBpbiB0aGUgc2FtZSBkaXJlY3RvcnkuXG4gKlxuICovXG5cbi8qKlxuICogQWxsb3dzIGV4dHJhY3Rpb24gb2YgYSBtaW5pZmllZCBrZXkuIExldCdzIHRoZSBidWlsZCBzeXN0ZW0gbWluaWZ5IGtleXNcbiAqIHdpdGhvdXQgbG9zaW5nIHRoZSBhYmlsaXR5IHRvIGR5bmFtaWNhbGx5IHVzZSBrZXkgc3RyaW5ncyBhcyB2YWx1ZXNcbiAqIHRoZW1zZWx2ZXMuIFBhc3MgaW4gYW4gb2JqZWN0IHdpdGggYSBzaW5nbGUga2V5L3ZhbCBwYWlyIGFuZCBpdCB3aWxsIHJldHVyblxuICogeW91IHRoZSBzdHJpbmcga2V5IG9mIHRoYXQgc2luZ2xlIHJlY29yZC4gU3VwcG9zZSB5b3Ugd2FudCB0byBncmFiIHRoZVxuICogdmFsdWUgZm9yIGEga2V5ICdjbGFzc05hbWUnIGluc2lkZSBvZiBhbiBvYmplY3QuIEtleS92YWwgbWluaWZpY2F0aW9uIG1heVxuICogaGF2ZSBhbGlhc2VkIHRoYXQga2V5IHRvIGJlICd4YTEyJy4ga2V5T2Yoe2NsYXNzTmFtZTogbnVsbH0pIHdpbGwgcmV0dXJuXG4gKiAneGExMicgaW4gdGhhdCBjYXNlLiBSZXNvbHZlIGtleXMgeW91IHdhbnQgdG8gdXNlIG9uY2UgYXQgc3RhcnR1cCB0aW1lLCB0aGVuXG4gKiByZXVzZSB0aG9zZSByZXNvbHV0aW9ucy5cbiAqL1xudmFyIGtleU9mID0gZnVuY3Rpb24ga2V5T2Yob25lS2V5T2JqKSB7XG4gIHZhciBrZXk7XG4gIGZvciAoa2V5IGluIG9uZUtleU9iaikge1xuICAgIGlmICghb25lS2V5T2JqLmhhc093blByb3BlcnR5KGtleSkpIHtcbiAgICAgIGNvbnRpbnVlO1xuICAgIH1cbiAgICByZXR1cm4ga2V5O1xuICB9XG4gIHJldHVybiBudWxsO1xufTtcblxubW9kdWxlLmV4cG9ydHMgPSBrZXlPZjsiLCIvKipcbiAqIENvcHlyaWdodCAyMDE0LTIwMTUsIEZhY2Vib29rLCBJbmMuXG4gKiBBbGwgcmlnaHRzIHJlc2VydmVkLlxuICpcbiAqIFRoaXMgc291cmNlIGNvZGUgaXMgbGljZW5zZWQgdW5kZXIgdGhlIEJTRC1zdHlsZSBsaWNlbnNlIGZvdW5kIGluIHRoZVxuICogTElDRU5TRSBmaWxlIGluIHRoZSByb290IGRpcmVjdG9yeSBvZiB0aGlzIHNvdXJjZSB0cmVlLiBBbiBhZGRpdGlvbmFsIGdyYW50XG4gKiBvZiBwYXRlbnQgcmlnaHRzIGNhbiBiZSBmb3VuZCBpbiB0aGUgUEFURU5UUyBmaWxlIGluIHRoZSBzYW1lIGRpcmVjdG9yeS5cbiAqXG4gKi9cblxuJ3VzZSBzdHJpY3QnO1xuXG52YXIgZW1wdHlGdW5jdGlvbiA9IHJlcXVpcmUoJy4vZW1wdHlGdW5jdGlvbicpO1xuXG4vKipcbiAqIFNpbWlsYXIgdG8gaW52YXJpYW50IGJ1dCBvbmx5IGxvZ3MgYSB3YXJuaW5nIGlmIHRoZSBjb25kaXRpb24gaXMgbm90IG1ldC5cbiAqIFRoaXMgY2FuIGJlIHVzZWQgdG8gbG9nIGlzc3VlcyBpbiBkZXZlbG9wbWVudCBlbnZpcm9ubWVudHMgaW4gY3JpdGljYWxcbiAqIHBhdGhzLiBSZW1vdmluZyB0aGUgbG9nZ2luZyBjb2RlIGZvciBwcm9kdWN0aW9uIGVudmlyb25tZW50cyB3aWxsIGtlZXAgdGhlXG4gKiBzYW1lIGxvZ2ljIGFuZCBmb2xsb3cgdGhlIHNhbWUgY29kZSBwYXRocy5cbiAqL1xuXG52YXIgd2FybmluZyA9IGVtcHR5RnVuY3Rpb247XG5cbmlmIChwcm9jZXNzLmVudi5OT0RFX0VOViAhPT0gJ3Byb2R1Y3Rpb24nKSB7XG4gIChmdW5jdGlvbiAoKSB7XG4gICAgdmFyIHByaW50V2FybmluZyA9IGZ1bmN0aW9uIHByaW50V2FybmluZyhmb3JtYXQpIHtcbiAgICAgIGZvciAodmFyIF9sZW4gPSBhcmd1bWVudHMubGVuZ3RoLCBhcmdzID0gQXJyYXkoX2xlbiA+IDEgPyBfbGVuIC0gMSA6IDApLCBfa2V5ID0gMTsgX2tleSA8IF9sZW47IF9rZXkrKykge1xuICAgICAgICBhcmdzW19rZXkgLSAxXSA9IGFyZ3VtZW50c1tfa2V5XTtcbiAgICAgIH1cblxuICAgICAgdmFyIGFyZ0luZGV4ID0gMDtcbiAgICAgIHZhciBtZXNzYWdlID0gJ1dhcm5pbmc6ICcgKyBmb3JtYXQucmVwbGFjZSgvJXMvZywgZnVuY3Rpb24gKCkge1xuICAgICAgICByZXR1cm4gYXJnc1thcmdJbmRleCsrXTtcbiAgICAgIH0pO1xuICAgICAgaWYgKHR5cGVvZiBjb25zb2xlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICBjb25zb2xlLmVycm9yKG1lc3NhZ2UpO1xuICAgICAgfVxuICAgICAgdHJ5IHtcbiAgICAgICAgLy8gLS0tIFdlbGNvbWUgdG8gZGVidWdnaW5nIFJlYWN0IC0tLVxuICAgICAgICAvLyBUaGlzIGVycm9yIHdhcyB0aHJvd24gYXMgYSBjb252ZW5pZW5jZSBzbyB0aGF0IHlvdSBjYW4gdXNlIHRoaXMgc3RhY2tcbiAgICAgICAgLy8gdG8gZmluZCB0aGUgY2FsbHNpdGUgdGhhdCBjYXVzZWQgdGhpcyB3YXJuaW5nIHRvIGZpcmUuXG4gICAgICAgIHRocm93IG5ldyBFcnJvcihtZXNzYWdlKTtcbiAgICAgIH0gY2F0Y2ggKHgpIHt9XG4gICAgfTtcblxuICAgIHdhcm5pbmcgPSBmdW5jdGlvbiB3YXJuaW5nKGNvbmRpdGlvbiwgZm9ybWF0KSB7XG4gICAgICBpZiAoZm9ybWF0ID09PSB1bmRlZmluZWQpIHtcbiAgICAgICAgdGhyb3cgbmV3IEVycm9yKCdgd2FybmluZyhjb25kaXRpb24sIGZvcm1hdCwgLi4uYXJncylgIHJlcXVpcmVzIGEgd2FybmluZyAnICsgJ21lc3NhZ2UgYXJndW1lbnQnKTtcbiAgICAgIH1cblxuICAgICAgaWYgKGZvcm1hdC5pbmRleE9mKCdGYWlsZWQgQ29tcG9zaXRlIHByb3BUeXBlOiAnKSA9PT0gMCkge1xuICAgICAgICByZXR1cm47IC8vIElnbm9yZSBDb21wb3NpdGVDb21wb25lbnQgcHJvcHR5cGUgY2hlY2suXG4gICAgICB9XG5cbiAgICAgIGlmICghY29uZGl0aW9uKSB7XG4gICAgICAgIGZvciAodmFyIF9sZW4yID0gYXJndW1lbnRzLmxlbmd0aCwgYXJncyA9IEFycmF5KF9sZW4yID4gMiA/IF9sZW4yIC0gMiA6IDApLCBfa2V5MiA9IDI7IF9rZXkyIDwgX2xlbjI7IF9rZXkyKyspIHtcbiAgICAgICAgICBhcmdzW19rZXkyIC0gMl0gPSBhcmd1bWVudHNbX2tleTJdO1xuICAgICAgICB9XG5cbiAgICAgICAgcHJpbnRXYXJuaW5nLmFwcGx5KHVuZGVmaW5lZCwgW2Zvcm1hdF0uY29uY2F0KGFyZ3MpKTtcbiAgICAgIH1cbiAgICB9O1xuICB9KSgpO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHdhcm5pbmc7IiwiJ3VzZSBzdHJpY3QnO1xuXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vbGliL1JlYWN0Jyk7XG4iLCIndXNlIHN0cmljdCc7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IHJlcXVpcmUoJy4vc3JjL1B1ZicpO1xyXG4iLCIvKipcbiAqIFJlYWN0IFB1ZiBCdW5kbGVcbiAqXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzAzLzA4XG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxuICpcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG4vLyBjb21wb25lbnRzXG4vLyBFbGVtZW50c1xudmFyIEFsZXJ0ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL0FsZXJ0Jyk7XG52YXIgTW9kYWwgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvTW9kYWwnKS5Nb2RhbDtcbnZhciBNb2RhbEhlYWRlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9Nb2RhbCcpLk1vZGFsSGVhZGVyO1xudmFyIE1vZGFsQm9keSA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9Nb2RhbCcpLk1vZGFsQm9keTtcbnZhciBNb2RhbEZvb3RlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9Nb2RhbCcpLk1vZGFsRm9vdGVyO1xudmFyIFBhbmVsID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL1BhbmVsJykuUGFuZWw7XG52YXIgUGFuZWxIZWFkZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvUGFuZWwnKS5QYW5lbEhlYWRlcjtcbnZhciBQYW5lbEJvZHkgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvUGFuZWwnKS5QYW5lbEJvZHk7XG52YXIgUGFuZWxGb290ZXIgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvUGFuZWwnKS5QYW5lbEZvb3RlcjtcbnZhciBIaWRkZW5Db250ZW50ID0gcmVxdWlyZSgnLi9jb21wb25lbnRzL0hpZGRlbkNvbnRlbnQnKTtcbnZhciBNYWluRnJhbWVTcGxpdHRlciA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9NYWluRnJhbWVTcGxpdHRlcicpO1xuXG4vLyBGb3JtIEVsZW1lbnRzXG52YXIgQ2hlY2tib3ggPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvQ2hlY2tib3gnKS5DaGVja2JveDtcbnZhciBIQ2hlY2tib3ggPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvQ2hlY2tib3gnKS5IQ2hlY2tib3g7XG52YXIgUmFkaW9Hcm91cCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9yYWRpby9SYWRpb0dyb3VwJyk7XG52YXIgUmFkaW8gPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvcmFkaW8vUmFkaW8nKTtcbnZhciBGaWVsZHNldCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy9GaWVsZHNldCcpO1xuXG4vLyBFdGMgRWxlbWVudHNcbi8vdmFyIFRhYlNldCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy90YWJzL1RhYlNldCcpO1xuLy92YXIgVGFicyA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy90YWJzL1RhYnMnKTtcbi8vdmFyIFRhYiA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy90YWJzL1RhYicpO1xuLy92YXIgVGFiQ29udGVudHMgPSByZXF1aXJlKCcuL2NvbXBvbmVudHMvdGFicy9UYWJDb250ZW50cycpO1xuLy92YXIgVGFiQ29udGVudCA9IHJlcXVpcmUoJy4vY29tcG9uZW50cy90YWJzL1RhYkNvbnRlbnQnKTtcblxuLy8gS2VuZG9cbnZhciBUcmVlVmlldyA9IHJlcXVpcmUoJy4va2VuZG8vVHJlZVZpZXcnKTtcbnZhciBHcmlkID0gcmVxdWlyZSgnLi9rZW5kby9HcmlkJyk7XG52YXIgRHJvcERvd25MaXN0ID0gcmVxdWlyZSgnLi9rZW5kby9Ecm9wRG93bkxpc3QnKTtcbnZhciBEYXRlUGlja2VyID0gcmVxdWlyZSgnLi9rZW5kby9EYXRlUGlja2VyJyk7XG52YXIgRGF0ZVJhbmdlUGlja2VyID0gcmVxdWlyZSgnLi9rZW5kby9EYXRlUmFuZ2VQaWNrZXInKTtcbnZhciBUYWJTdHJpcCA9IHJlcXVpcmUoJy4va2VuZG8vdGFic3RyaXAvVGFiU3RyaXAnKTtcbnZhciBUYWJzID0gcmVxdWlyZSgnLi9rZW5kby90YWJzdHJpcC9UYWJzJyk7XG52YXIgVGFiID0gcmVxdWlyZSgnLi9rZW5kby90YWJzdHJpcC9UYWInKTtcbnZhciBUYWJDb250ZW50ID0gcmVxdWlyZSgnLi9rZW5kby90YWJzdHJpcC9UYWJDb250ZW50Jyk7XG52YXIgUGFuZWxCYXIgPSByZXF1aXJlKCcuL2tlbmRvL1BhbmVsQmFyJyk7XG52YXIgTXVsdGlTZWxlY3QgPSByZXF1aXJlKCcuL2tlbmRvL011bHRpU2VsZWN0Jyk7XG52YXIgTnVtZXJpY1RleHRCb3ggPSByZXF1aXJlKCcuL2tlbmRvL051bWVyaWNUZXh0Qm94Jyk7XG52YXIgUHJvZ3Jlc3NCYXIgPSByZXF1aXJlKCcuL2tlbmRvL1Byb2dyZXNzQmFyJyk7XG52YXIgV2luZG93ID0gcmVxdWlyZSgnLi9rZW5kby9XaW5kb3cnKTtcbnZhciBBdXRvQ29tcGxldGUgPSByZXF1aXJlKCcuL2tlbmRvL0F1dG9Db21wbGV0ZScpO1xuXG4vLyBTZXJ2aWNlc1xudmFyIFV0aWwgPSByZXF1aXJlKCcuL3NlcnZpY2VzL1V0aWwnKTtcbnZhciBEYXRlVXRpbCA9IHJlcXVpcmUoJy4vc2VydmljZXMvRGF0ZVV0aWwnKTtcbnZhciBOdW1iZXJVdGlsID0gcmVxdWlyZSgnLi9zZXJ2aWNlcy9OdW1iZXJVdGlsJyk7XG52YXIgUmVnRXhwID0gcmVxdWlyZSgnLi9zZXJ2aWNlcy9SZWdFeHAnKTtcbnZhciBSZXNvdXJjZSA9IHJlcXVpcmUoJy4vc2VydmljZXMvUmVzb3VyY2UnKTtcblxudmFyIFB1ZiA9IHtcbiAgICAvLyBFbGVtZW50c1xuICAgIEFsZXJ0OiBBbGVydCxcbiAgICBNb2RhbDogTW9kYWwsXG4gICAgTW9kYWxIZWFkZXI6IE1vZGFsSGVhZGVyLFxuICAgIE1vZGFsQm9keTogTW9kYWxCb2R5LFxuICAgIE1vZGFsRm9vdGVyOiBNb2RhbEZvb3RlcixcbiAgICBQYW5lbDogUGFuZWwsXG4gICAgUGFuZWxIZWFkZXI6IFBhbmVsSGVhZGVyLFxuICAgIFBhbmVsQm9keTogUGFuZWxCb2R5LFxuICAgIFBhbmVsRm9vdGVyOiBQYW5lbEZvb3RlcixcbiAgICBIaWRkZW5Db250ZW50OiBIaWRkZW5Db250ZW50LFxuICAgIE1haW5GcmFtZVNwbGl0dGVyOiBNYWluRnJhbWVTcGxpdHRlcixcblxuICAgIC8vIEZvcm0gRWxlbWVudHNcbiAgICBDaGVja2JveDogQ2hlY2tib3gsXG4gICAgSENoZWNrYm94OiBIQ2hlY2tib3gsXG4gICAgUmFkaW9Hcm91cDogUmFkaW9Hcm91cCxcbiAgICBSYWRpbzogUmFkaW8sXG4gICAgRmllbGRzZXQ6IEZpZWxkc2V0LFxuXG4gICAgLy8gRXRjIEVsZW1lbnRzXG4gICAgLy9UYWJTZXQ6IFRhYlNldCxcbiAgICAvL1RhYnM6IFRhYnMsXG4gICAgLy9UYWI6IFRhYixcbiAgICAvL1RhYkNvbnRlbnRzOiBUYWJDb250ZW50cyxcbiAgICAvL1RhYkNvbnRlbnQ6IFRhYkNvbnRlbnQsXG5cbiAgICAvLyBLZW5kb1xuICAgIFRyZWVWaWV3OiBUcmVlVmlldyxcbiAgICBHcmlkOiBHcmlkLFxuICAgIERyb3BEb3duTGlzdDogRHJvcERvd25MaXN0LFxuICAgIERhdGVQaWNrZXI6IERhdGVQaWNrZXIsXG4gICAgRGF0ZVJhbmdlUGlja2VyOiBEYXRlUmFuZ2VQaWNrZXIsXG4gICAgVGFiU3RyaXA6IFRhYlN0cmlwLFxuICAgIFRhYnM6IFRhYnMsXG4gICAgVGFiOiBUYWIsXG4gICAgVGFiQ29udGVudDogVGFiQ29udGVudCxcbiAgICBQYW5lbEJhcjogUGFuZWxCYXIuUGFuZWxCYXIsXG4gICAgUGFuZWxCYXJQYW5lOiBQYW5lbEJhci5QYW5lbEJhclBhbmUsXG4gICAgTXVsdGlTZWxlY3Q6IE11bHRpU2VsZWN0LFxuICAgIE51bWVyaWNUZXh0Qm94OiBOdW1lcmljVGV4dEJveCxcbiAgICBQcm9ncmVzc0JhcjogUHJvZ3Jlc3NCYXIsXG4gICAgV2luZG93OiBXaW5kb3csXG4gICAgQXV0b0NvbXBsZXRlOiBBdXRvQ29tcGxldGUsXG5cbiAgICAvLyBTZXJ2aWNlc1xuICAgIFV0aWw6IFV0aWwsXG4gICAgRGF0ZVV0aWw6IERhdGVVdGlsLFxuICAgIE51bWJlclV0aWw6IE51bWJlclV0aWwsXG4gICAgUmVnRXhwOiBSZWdFeHAsXG4gICAgUmVzb3VyY2U6IFJlc291cmNlXG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IFB1ZjtcbiIsIi8qKlxyXG4gKiBBbGVydCBjb21wb25lbnRcclxuICpcclxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wMy8yNFxyXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiA8UHVtLkFsZXJ0IHJlZj1cImFsZXJ0XCIgdGl0bGU9XCLtg4DsnbTti4BcIiBtZXNzYWdlPVwi66mU7Iuc7KeAXCIgb25Paz17dGhpcy5vbk9rfSAvPlxyXG4gKiA8UHVtLkFsZXJ0IHJlZj1cImNvbmZpcm1cIiB0eXBlPVwiY29uZmlybVwiIHRpdGxlPVwi7YOA7J207YuAXCIgbWVzc2FnZT1cIuuplOyLnOyngFwiIG9uT2s9e3RoaXMub25Db25maXJtfSBvbkNhbmNlbD17dGhpcy5vbkNhbmNlbH0vPlxyXG4gKlxyXG4gKiBib290c3RyYXAgY29tcG9uZW50XHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XHJcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xyXG5cclxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XHJcblxyXG52YXIgQWxlcnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBkaXNwbGF5TmFtZTogJ0FsZXJ0JyxcclxuICAgIHByb3BUeXBlczoge1xyXG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICB0eXBlOiBQcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAvLyBudWxsL2NvbmZpcm0gKGRlZmF1bHQ6IG51bGwpXHJcbiAgICAgICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgdGl0bGVJY29uQ2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIG1lc3NhZ2U6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgb2tMYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBjYW5jZWxMYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBva0NsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBjYW5jZWxDbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgb25PazogUHJvcFR5cGVzLmZ1bmMsXHJcbiAgICAgICAgb25DYW5jZWw6IFByb3BUeXBlcy5mdW5jLFxyXG4gICAgICAgIHdpZHRoOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcclxuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxyXG4gICAgICAgIF0pXHJcbiAgICB9LFxyXG4gICAgaWQ6ICcnLFxyXG4gICAgc2hvdzogZnVuY3Rpb24ob2tGdW5jLCBjYW5jZWxGdW5jKSB7XHJcbiAgICAgICAgdmFyIGFsZXJ0ID0gJCgnIycrdGhpcy5pZCk7XHJcbiAgICAgICAgYWxlcnQubW9kYWwoJ3Nob3cnKTtcclxuXHJcbiAgICAgICAgdGhpcy5va0Z1bmMgPSBva0Z1bmM7XHJcbiAgICAgICAgdGhpcy5jYW5jZWxGdW5jID0gY2FuY2VsRnVuYztcclxuICAgIH0sXHJcbiAgICBoaWRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgYWxlcnQgPSAkKCcjJyt0aGlzLmlkKTtcclxuICAgICAgICBhbGVydC5tb2RhbCgnaGlkZScpO1xyXG4gICAgfSxcclxuICAgIHNldE1lc3NhZ2U6IGZ1bmN0aW9uKG1lc3NhZ2UpIHtcclxuICAgICAgICBpZih0eXBlb2YgbWVzc2FnZSA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bWVzc2FnZTogbWVzc2FnZX0pO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbk9rOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIC8vIGN1c3RvbSBldmVudCBlbWl0IOyXkCDrjIDtlbTshJwg7Jew6rWsIO2VhOyalFxyXG4gICAgICAgIHRoaXMuaGlkZSgpO1xyXG5cclxuICAgICAgICAvLyBva0Z1bmNcclxuICAgICAgICBpZih0eXBlb2YgdGhpcy5va0Z1bmMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhpcy5va0Z1bmMoKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIC8vIG9uT2tcclxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbk9rID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25PaygpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBvbkNhbmNlbDogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICAvLyBjdXN0b20gZXZlbnQgZW1pdCDsl5Ag64yA7ZW07IScIOyXsOq1rCDtlYTsmpRcclxuICAgICAgICB0aGlzLmhpZGUoKTtcclxuXHJcbiAgICAgICAgLy8gY2FuY2VsRnVuY1xyXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLmNhbmNlbEZ1bmMgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhpcy5jYW5jZWxGdW5jKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICAvLyBvbkNhbmNlbFxyXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ2FuY2VsID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25DYW5jZWwoKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcclxuICAgICAgICByZXR1cm4ge3RpdGxlOiAnVGl0bGUnLCBva0xhYmVsOiAkcHNfbG9jYWxlLmNvbmZpcm0sIGNhbmNlbExhYmVsOiAkcHNfbG9jYWxlLmNhbmNlbH07XHJcbiAgICB9LFxyXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDsu7Ttj6zrhIztirjqsIAg66eI7Jq07Yq465CY6riwIOyghCAo7ZWc67KIIO2YuOy2nCkgLyDrpqzthLTqsJLsnYAgdGhpcy5zdGF0ZeydmCDstIjquLDqsJLsnLzroZwg7IKs7JqpXHJcbiAgICAgICAgY29uc3Qge3RpdGxlLCBtZXNzYWdlfSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIHt0aXRsZTogdGl0bGUsIG1lc3NhZ2U6IG1lc3NhZ2V9O1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpjquLAg7KeB7KCEKO2VnOuyiCDtmLjstpwpXHJcbiAgICAgICAgbGV0IGlkID0gdGhpcy5wcm9wcy5pZDtcclxuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGlkID0gVXRpbC5nZXRVVUlEKCk7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XHJcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOyDiOuhnOyatCBwcm9wc+ulvCDrsJvsnYQg65WMIO2YuOy2nCjstZzstIgg66CM642U66eBIOyLnOyXkOuKlCDtmLjstpzrkJjsp4Ag7JWK7J2MKVxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3RpdGxlOiBuZXh0UHJvcHMudGl0bGUsIG1lc3NhZ2U6IG5leHRQcm9wcy5tZXNzYWdlfSk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXHJcbiAgICAgICAgY29uc3Qge2NsYXNzTmFtZSwgdHlwZSwgb2tMYWJlbCwgY2FuY2VsTGFiZWwsIG9rQ2xhc3NOYW1lLCBjYW5jZWxDbGFzc05hbWUsIHRpdGxlSWNvbkNsYXNzTmFtZSwgd2lkdGh9ID0gdGhpcy5wcm9wcztcclxuXHJcbiAgICAgICAgdmFyIGNhbmNlbEJ1dHRvbjtcclxuICAgICAgICBpZih0eXBlID09PSAnY29uZmlybScpIHtcclxuICAgICAgICAgICAgY2FuY2VsQnV0dG9uID0gPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdidG4nLCAnYnRuLWNhbmNlbCcsIGNhbmNlbENsYXNzTmFtZSl9IG9uQ2xpY2s9e3RoaXMub25DYW5jZWx9IGRhdGEtZGlzbWlzcz1cIm1vZGFsXCI+e2NhbmNlbExhYmVsfTwvYnV0dG9uPjtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgaWQ9e3RoaXMuaWR9IGNsYXNzTmFtZT17Y2xhc3NOYW1lcygnbW9kYWwnLCAnbW9kYWwtYWxlcnQnLCBjbGFzc05hbWUpfSByb2xlPVwiZGlhbG9nXCIgYXJpYS1sYWJlbGxlZGJ5PVwiXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCIgZGF0YS1iYWNrZHJvcD1cInN0YXRpY1wiIGRhdGEta2V5Ym9hcmQ9XCJmYWxzZVwiPlxyXG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2cgbW9kYWwtc21cIiBzdHlsZT17e3dpZHRoOiB3aWR0aH19PlxyXG4gICAgICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwibW9kYWwtY29udGVudFwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWhlYWRlclwiPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgPHNwYW4gY2xhc3NOYW1lPXtjbGFzc05hbWVzKCd0aXRsZS1pY29uJywgdGl0bGVJY29uQ2xhc3NOYW1lKX0gLz5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vZGFsLXRpdGxlXCI+e3RoaXMuc3RhdGUudGl0bGV9PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1ib2R5XCI+XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICB7dGhpcy5zdGF0ZS5tZXNzYWdlfVxyXG4gICAgICAgICAgICAgICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1mb290ZXJcIj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIDxidXR0b24gdHlwZT1cImJ1dHRvblwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lcygnYnRuJywgJ2J0bi1vaycsIG9rQ2xhc3NOYW1lKX0gb25DbGljaz17dGhpcy5vbk9rfT57b2tMYWJlbH08L2J1dHRvbj5cclxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIHtjYW5jZWxCdXR0b259XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBBbGVydDsiLCIvKipcclxuICogQ2hlY2tCb3ggY29tcG9uZW50XHJcbiAqXHJcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDMvMTRcclxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cclxuICpcclxuICogZXhhbXBsZTpcclxuICogPFB1bS5DaGVja0JveCBuYW1lPVwibmFtZTFcIiB2YWx1ZT1cInZhbHVlMVwiIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfSBjaGVja2VkPXt0cnVlfT4g7LK07YGs67CV7IqkPC9QdW0uQ2hlY2tCb3g+XHJcbiAqXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XHJcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xyXG5cclxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XHJcblxyXG52YXIgQ2hlY2tib3ggPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBkaXNwbGF5TmFtZTogJ0NoZWNrYm94JyxcclxuICAgIHByb3BUeXBlczoge1xyXG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGNoZWNrZWQ6IFByb3BUeXBlcy5ib29sLFxyXG4gICAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xyXG4gICAgfSxcclxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coZXZlbnQpO1xyXG4gICAgICAgIHZhciBjaGVja2VkID0gIXRoaXMuc3RhdGUuY2hlY2tlZDtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNoZWNrZWQpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NoZWNrZWQ6IGNoZWNrZWR9KTtcclxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGV2ZW50LCBjaGVja2VkKTtcclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2V0VmFsdWU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHZhciBjaGVja2VkID0gdGhpcy5zdGF0ZS5jaGVja2VkLFxyXG4gICAgICAgICAgICAkY2hlY2tib3ggPSAkKCdpbnB1dDpjaGVja2JveFtuYW1lPVwiJyArIHRoaXMucHJvcHMubmFtZSArICdcIl0nKTtcclxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy52YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgLy8gdHJ1ZS9mYWxzZSDshKTsoJVcclxuICAgICAgICAgICAgJGNoZWNrYm94LnZhbChjaGVja2VkKTtcclxuICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgIGlmKGNoZWNrZWQgPT09IHRydWUpIHtcclxuICAgICAgICAgICAgICAgICRjaGVja2JveC52YWwodGhpcy5wcm9wcy52YWx1ZSk7XHJcbiAgICAgICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgICAgICRjaGVja2JveC52YWwobnVsbCk7XHJcbiAgICAgICAgICAgIH1cclxuICAgICAgICB9XHJcbiAgICB9LFxyXG4gICAgc2V0U3RhdGVPYmplY3Q6IGZ1bmN0aW9uKHByb3BzKSB7XHJcbiAgICAgICAgLy9sZXQgdmFsdWUgPSBwcm9wcy52YWx1ZTtcclxuICAgICAgICAvL2lmKHR5cGVvZiB2YWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAvLyAgICB2YWx1ZSA9IG51bGw7XHJcbiAgICAgICAgLy99XHJcblxyXG4gICAgICAgIGxldCBjaGVja2VkID0gcHJvcHMuY2hlY2tlZDtcclxuICAgICAgICBpZih0eXBlb2YgY2hlY2tlZCA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgY2hlY2tlZCA9IGZhbHNlO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgcmV0dXJuIHtcclxuICAgICAgICAgICAgLy92YWx1ZTogdmFsdWUsXHJcbiAgICAgICAgICAgIGNoZWNrZWQ6IGNoZWNrZWRcclxuICAgICAgICB9O1xyXG4gICAgfSxcclxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgcmV0dXJuIHRoaXMuc2V0U3RhdGVPYmplY3QodGhpcy5wcm9wcyk7XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KcIOuLpOydjCjtlZzrsogg7Zi47LacKVxyXG4gICAgICAgIHRoaXMuc2V0VmFsdWUoKTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcclxuICAgICAgICAvLyDsu7Ttj6zrhIztirjqsIAg7IOI66Gc7Jq0IHByb3Bz66W8IOuwm+ydhCDrlYwg7Zi47LacKOy1nOy0iCDroIzrjZTrp4Eg7Iuc7JeQ64qUIO2YuOy2nOuQmOyngCDslYrsnYwpXHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh0aGlzLnNldFN0YXRlT2JqZWN0KG5leHRQcm9wcykpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudERpZFVwZGF0ZTogZnVuY3Rpb24ocHJldlByb3BzLCBwcmV2U3RhdGUpIHtcclxuICAgICAgICAvLyDsu7Ttj6zrhIztirjsnZgg7JeF642w7J207Yq46rCAIERPTeyXkCDrsJjsmIHrkJwg7KeB7ZuE7JeQIO2YuOy2nCjstZzstIgg66CM642U66eBIOyLnOyXkOuKlCDtmLjstpzrkJjsp4Ag7JWK7J2MKVxyXG4gICAgICAgIC8vY29uc29sZS5sb2cocHJldlByb3BzKTtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHByZXZTdGF0ZSk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLnN0YXRlKTtcclxuICAgICAgICB0aGlzLnNldFZhbHVlKCk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXHJcbiAgICAgICAgY29uc3Qge2NsYXNzTmFtZSwgbmFtZSwgY2hpbGRyZW59ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImNoZWNrYm94XCI+XHJcbiAgICAgICAgICAgICAgICA8bGFiZWw+XHJcbiAgICAgICAgICAgICAgICAgICAgPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBuYW1lPXtuYW1lfSBjaGVja2VkPXt0aGlzLnN0YXRlLmNoZWNrZWR9XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIG9uQ2hhbmdlPXt0aGlzLm9uQ2hhbmdlfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImxibFwiPntjaGlsZHJlbn08L3NwYW4+XHJcbiAgICAgICAgICAgICAgICAgICAgey8qPGlucHV0IHR5cGU9XCJoaWRkZW5cIiBuYW1lPXt0aGlzLnByb3BzLm5hbWV9IHZhbHVlPXt0aGlzLnN0YXRlLnZhbHVlfT4qL31cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxudmFyIEhDaGVja2JveCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIGRpc3BsYXlOYW1lOiAnSENoZWNrYm94JyxcclxuICAgIHByb3BUeXBlczoge1xyXG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIHZhbHVlOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGNoZWNrZWQ6IFByb3BUeXBlcy5ib29sLFxyXG4gICAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuY1xyXG4gICAgfSxcclxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIC8vY29uc29sZS5sb2coZXZlbnQpO1xyXG4gICAgICAgIHZhciBjaGVja2VkID0gIXRoaXMuc3RhdGUuY2hlY2tlZDtcclxuICAgICAgICAvL2NvbnNvbGUubG9nKGNoZWNrZWQpO1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2NoZWNrZWQ6IGNoZWNrZWR9KTtcclxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xyXG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGV2ZW50LCBjaGVja2VkKTtcclxuICAgICAgICB9XHJcblxyXG4gICAgfSxcclxuICAgIHNldFZhbHVlOiBmdW5jdGlvbigpIHtcclxuICAgICAgICB2YXIgY2hlY2tlZCA9IHRoaXMuc3RhdGUuY2hlY2tlZCxcclxuICAgICAgICAgICAgJGNoZWNrYm94ID0gJCgnaW5wdXQ6Y2hlY2tib3hbbmFtZT1cIicgKyB0aGlzLnByb3BzLm5hbWUgKyAnXCJdJyk7XHJcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMudmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIC8vIHRydWUvZmFsc2Ug7ISk7KCVXHJcbiAgICAgICAgICAgICRjaGVja2JveC52YWwoY2hlY2tlZCk7XHJcbiAgICAgICAgfWVsc2Uge1xyXG4gICAgICAgICAgICBpZihjaGVja2VkID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgICAgICAkY2hlY2tib3gudmFsKHRoaXMucHJvcHMudmFsdWUpO1xyXG4gICAgICAgICAgICB9ZWxzZSB7XHJcbiAgICAgICAgICAgICAgICAkY2hlY2tib3gudmFsKG51bGwpO1xyXG4gICAgICAgICAgICB9XHJcbiAgICAgICAgfVxyXG4gICAgfSxcclxuICAgIHNldFN0YXRlT2JqZWN0OiBmdW5jdGlvbihwcm9wcykge1xyXG4gICAgICAgIC8vbGV0IHZhbHVlID0gcHJvcHMudmFsdWU7XHJcbiAgICAgICAgLy9pZih0eXBlb2YgdmFsdWUgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgLy8gICAgdmFsdWUgPSBudWxsO1xyXG4gICAgICAgIC8vfVxyXG5cclxuICAgICAgICBsZXQgY2hlY2tlZCA9IHByb3BzLmNoZWNrZWQ7XHJcbiAgICAgICAgaWYodHlwZW9mIGNoZWNrZWQgPT09ICd1bmRlZmluZWQnKSB7XHJcbiAgICAgICAgICAgIGNoZWNrZWQgPSBmYWxzZTtcclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiB7XHJcbiAgICAgICAgICAgIC8vdmFsdWU6IHZhbHVlLFxyXG4gICAgICAgICAgICBjaGVja2VkOiBjaGVja2VkXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlT2JqZWN0KHRoaXMucHJvcHMpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcclxuICAgICAgICB0aGlzLnNldFZhbHVlKCk7XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XHJcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOyDiOuhnOyatCBwcm9wc+ulvCDrsJvsnYQg65WMIO2YuOy2nCjstZzstIgg66CM642U66eBIOyLnOyXkOuKlCDtmLjstpzrkJjsp4Ag7JWK7J2MKVxyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUodGhpcy5zZXRTdGF0ZU9iamVjdChuZXh0UHJvcHMpKTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnREaWRVcGRhdGU6IGZ1bmN0aW9uKHByZXZQcm9wcywgcHJldlN0YXRlKSB7XHJcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq47J2YIOyXheuNsOydtO2KuOqwgCBET03sl5Ag67CY7JiB65CcIOynge2bhOyXkCDtmLjstpwo7LWc7LSIIOugjOuNlOungSDsi5zsl5DripQg7Zi47Lac65CY7KeAIOyViuydjClcclxuICAgICAgICAvL2NvbnNvbGUubG9nKHByZXZQcm9wcyk7XHJcbiAgICAgICAgLy9jb25zb2xlLmxvZyhwcmV2U3RhdGUpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5zdGF0ZSk7XHJcbiAgICAgICAgdGhpcy5zZXRWYWx1ZSgpO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxyXG4gICAgICAgIGNvbnN0IHtjbGFzc05hbWUsIG5hbWUsIGNoaWxkcmVufSA9IHRoaXMucHJvcHM7XHJcbiAgICAgICAgcmV0dXJuIChcclxuXHJcbiAgICAgICAgICAgIDxsYWJlbCBjbGFzc05hbWU9J2NoZWNrYm94LWlubGluZSc+XHJcbiAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cImNoZWNrYm94XCIgY2xhc3NOYW1lPXtjbGFzc05hbWV9IG5hbWU9e25hbWV9IGNoZWNrZWQ9e3RoaXMuc3RhdGUuY2hlY2tlZH1cclxuICAgICAgICAgICAgICAgICAgICBvbkNoYW5nZT17dGhpcy5vbkNoYW5nZX0gLz5cclxuICAgICAgICAgICAgICAgICAgICA8c3BhbiBjbGFzc05hbWU9XCJsYmxcIj57Y2hpbGRyZW59PC9zcGFuPlxyXG4gICAgICAgICAgICAgICAgICAgIHsvKjxpbnB1dCB0eXBlPVwiaGlkZGVuXCIgbmFtZT17dGhpcy5wcm9wcy5uYW1lfSB2YWx1ZT17dGhpcy5zdGF0ZS52YWx1ZX0+Ki99XHJcbiAgICAgICAgICAgIDwvbGFiZWw+XHJcblxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSB7XHJcbiAgICBDaGVja2JveDogQ2hlY2tib3gsXHJcbiAgICBIQ2hlY2tib3g6IEhDaGVja2JveFxyXG59OyIsIi8qKlxuICogRmllbGRzZXQgY29tcG9uZW50XG4gKlxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wMy8zMFxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqXG4gKiBleGFtcGxlOlxuICogPFB1bS5GaWVsZHNldCAvPlxuICpcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFByb3BUeXBlcyA9IHJlcXVpcmUoJ3JlYWN0JykuUHJvcFR5cGVzO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vc2VydmljZXMvVXRpbCcpO1xuXG52YXIgRmllbGRzZXQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdGaWVsZHNldCcsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGxlZ2VuZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgZXhwYW5kOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgY29sbGFwc2libGU6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICBvblRvZ2dsZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uSW5pdDogUHJvcFR5cGVzLmZ1bmNcbiAgICB9LFxuICAgIGlkOiAnJyxcbiAgICB0b2dnbGU6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgICAgIGlmKHRoaXMucHJvcHMuY29sbGFwc2libGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGlmKHR5cGVvZiBwcm9wcy5leHBhbmQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7ZXhwYW5kOiBwcm9wcy5leHBhbmR9KTtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNldFN0YXRlKHtleHBhbmQ6IHRydWV9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Ub2dnbGU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIHZhciBleHBhbmQgPSAhdGhpcy5zdGF0ZS5leHBhbmQ7XG4gICAgICAgIHRoaXMudG9nZ2xlKHtleHBhbmQ6IGV4cGFuZH0pO1xuXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uVG9nZ2xlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uVG9nZ2xlKGV4cGFuZCk7XG4gICAgICAgIH1cbiAgICB9LFxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdC8vIO2BtOuemOyKpOqwgCDsg53shLHrkKAg65WMIO2VnOuyiCDtmLjstpzrkJjqs6Ag7LqQ7Iuc65Cc64ukLlxuXHRcdC8vIOu2gOuqqCDsu7Ttj6zrhIztirjsl5DshJwgcHJvcOydtCDrhJjslrTsmKTsp4Ag7JWK7J2AIOqyveyasCAoaW4g7Jew7IKw7J6Q66GcIO2ZleyduCkg66ek7ZWR7J2YIOqwkuydtCB0aGlzLnByb3Bz7JeQIOyEpOygleuQnOuLpC5cblx0XHRyZXR1cm4ge2xlZ2VuZDogJ1RpdGxlJywgY29sbGFwc2libGU6IHRydWUsIGV4cGFuZDogdHJ1ZX07XG5cdH0sXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcblx0XHQvLyDsu7Ttj6zrhIztirjqsIAg66eI7Jq07Yq465CY6riwIOyghCAo7ZWc67KIIO2YuOy2nCkgLyDrpqzthLTqsJLsnYAgdGhpcy5zdGF0ZeydmCDstIjquLDqsJLsnLzroZwg7IKs7JqpXG4gICAgICAgIHJldHVybiB7ZXhwYW5kOiB0aGlzLnByb3BzLmV4cGFuZH07XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCmOq4sCDsp4HsoIQo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgbGV0IGlkID0gdGhpcy5wcm9wcy5pZDtcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWQgPSBVdGlsLmdldFVVSUQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uSW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgICAgIGRhdGEuZXhwYW5kID0gdGhpcy5zdGF0ZS5leHBhbmQ7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uSW5pdChkYXRhKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOqwgCDsg4jroZzsmrQgcHJvcHPrpbwg67Cb7J2EIOuVjCDtmLjstpwo7LWc7LSIIOugjOuNlOungSDsi5zsl5DripQg7Zi47Lac65CY7KeAIOyViuydjClcbiAgICAgICAgdGhpcy50b2dnbGUobmV4dFByb3BzKTtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgY29uc3Qge2NsYXNzTmFtZSwgbGVnZW5kLCBjb2xsYXBzaWJsZX0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHZhciBkaXNwbGF5LCBjb2xsYXBzZWQgPSBmYWxzZTtcbiAgICAgICAgaWYodGhpcy5zdGF0ZS5leHBhbmQgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGRpc3BsYXkgPSAnYmxvY2snO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBkaXNwbGF5ID0gJ25vbmUnO1xuICAgICAgICAgICAgaWYoY29sbGFwc2libGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb2xsYXBzZWQgPSB0cnVlO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxmaWVsZHNldCBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ2ZpZWxkc2V0JywgY2xhc3NOYW1lLCB7Y29sbGFwc2libGU6IGNvbGxhcHNpYmxlLCBjb2xsYXBzZWQ6IGNvbGxhcHNlZH0pfT5cbiAgICAgICAgICAgICAgICA8bGVnZW5kIG9uQ2xpY2s9e3RoaXMub25Ub2dnbGV9IG5hbWU9e3RoaXMuaWR9PiB7bGVnZW5kfTwvbGVnZW5kPlxuICAgICAgICAgICAgICAgIDxkaXYgc3R5bGU9e3tkaXNwbGF5OiBkaXNwbGF5fX0+XG4gICAgICAgICAgICAgICAgICAgIDxkaXYgaWQ9e3RoaXMuaWR9ID57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2Rpdj5cbiAgICAgICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgICAgIDwvZmllbGRzZXQ+XG5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBGaWVsZHNldDsiLCIvKipcclxuICogSGlkZGVuQ29udGVudCBjb21wb25lbnRcclxuICpcclxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wMy8xMFxyXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiA8UHVtLkhpZGRlbkNvbnRlbnQgaWQ9e2lkfSAvPlxyXG4gKlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxuaW1wb3J0IFJlYWN0LCB7UHJvcFR5cGVzfSBmcm9tICdyZWFjdCc7XHJcbi8vdmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuLy92YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XHJcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xyXG5cclxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XHJcblxyXG52YXIgSGlkZGVuQ29udGVudCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIGRpc3BsYXlOYW1lOiAnSGlkZGVuQ29udGVudCcsXHJcbiAgICBwcm9wVHlwZXM6IHtcclxuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgZXhwYW5kTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgY29sbGFwc2VMYWJlbDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBleHBhbmRJY29uOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGNvbGxhcHNlSWNvbjogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBpc0JvdHRvbTogUHJvcFR5cGVzLmJvb2xcclxuICAgIH0sXHJcbiAgICBpZDogJycsXHJcbiAgICBvbkV4cGFuZENvbGxhcHNlOiBmdW5jdGlvbihldmVudCkge1xyXG4gICAgICAgIC8vdmFyIG5vZGUgPSBldmVudC50YXJnZXQsXHJcbiAgICAgICAgLy8gICAgYVRhZyA9IG5vZGUucGFyZW50Tm9kZTtcclxuICAgICAgICB2YXIgYVRhZyA9IGV2ZW50LnRhcmdldDtcclxuICAgICAgICBpZigkKGFUYWcpLm5leHQoKS5jc3MoJ2Rpc3BsYXknKSA9PT0gJ25vbmUnKSB7XHJcbiAgICAgICAgICAgIHRoaXMuc2V0U3RhdGUoe2xhYmVsOiB0aGlzLnByb3BzLmNvbGxhcHNlTGFiZWwsIGljb246IHRoaXMucHJvcHMuY29sbGFwc2VJY29ufSk7XHJcbiAgICAgICAgICAgICQoYVRhZykubmV4dCgpLmNzcygnZGlzcGxheScsICdibG9jaycpO1xyXG4gICAgICAgIH1lbHNlIHtcclxuICAgICAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bGFiZWw6IHRoaXMucHJvcHMuZXhwYW5kTGFiZWwsIGljb246IHRoaXMucHJvcHMuZXhwYW5kSWNvbn0pO1xyXG4gICAgICAgICAgICAkKGFUYWcpLm5leHQoKS5jc3MoJ2Rpc3BsYXknLCAnbm9uZScpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICB9LFxyXG4gICAgb25Cb3R0b21Db2xsYXBzZTogZnVuY3Rpb24oZXZlbnQpIHtcclxuICAgICAgICBsZXQgbm9kZSA9IGV2ZW50LnRhcmdldCxcclxuICAgICAgICAgICAgZGl2ID0gbm9kZS5wYXJlbnROb2RlOy8vLnBhcmVudE5vZGU7XHJcbiAgICAgICAgJChkaXYpLmNzcygnZGlzcGxheScsICdub25lJyk7XHJcbiAgICAgICAgdGhpcy5zZXRTdGF0ZSh7bGFiZWw6IHRoaXMucHJvcHMuZXhwYW5kTGFiZWwsIGljb246IHRoaXMucHJvcHMuZXhwYW5kSWNvbn0pO1xyXG4gICAgfSxcclxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XHJcblxyXG4gICAgICAgIGxldCBsYWJlbCA9IHRoaXMucHJvcHMuZXhwYW5kTGFiZWw7XHJcbiAgICAgICAgaWYodHlwZW9mIGxhYmVsID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBsYWJlbCA9ICdFeHBhbmQnO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgbGV0IGljb24gPSB0aGlzLnByb3BzLmV4cGFuZEljb247XHJcblxyXG4gICAgICAgIHJldHVybiB7bGFiZWw6IGxhYmVsLCBpY29uOiBpY29ufTtcclxuICAgIH0sXHJcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxyXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XHJcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgdGhpcy5pZCA9IGlkO1xyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxyXG4gICAgICAgIHZhciBJY29uO1xyXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnN0YXRlLmljb24gPT09ICdzdHJpbmcnKSB7XHJcbiAgICAgICAgICAgIEljb24gPSA8aSBjbGFzc05hbWU9e3RoaXMuc3RhdGUuaWNvbn0+eydcXHUwMEEwJ308L2k+O1xyXG4gICAgICAgIH1cclxuXHJcbiAgICAgICAgLy8g66eoIOyVhOuemCDsoJHquLDrsoTtirwg7LKY66asXHJcbiAgICAgICAgdmFyIEJvdHRvbUJ1dHRvbjtcclxuICAgICAgICBpZih0aGlzLnByb3BzLmlzQm90dG9tID09PSB0cnVlKSB7XHJcbiAgICAgICAgICAgIGxldCBDb2xsYXBzZUljb247XHJcbiAgICAgICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLmNvbGxhcHNlSWNvbiA9PT0gJ3N0cmluZycpIHtcclxuICAgICAgICAgICAgICAgIENvbGxhcHNlSWNvbiA9IDxpIGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jb2xsYXBzZUljb259PnsnXFx1MDBBMCd9PC9pPjtcclxuICAgICAgICAgICAgfVxyXG5cclxuICAgICAgICAgICAgLy8gIyDsmYAgcmVhY3Qtcm91dGVyIOy2qeuPjOusuOygnCDtlbTqsrDtlbTslbwg7ZWoXHJcbiAgICAgICAgICAgIEJvdHRvbUJ1dHRvbiA9IDxhIGhyZWY9eycjJyArIHRoaXMuaWR9IG9uQ2xpY2s9e3RoaXMub25Cb3R0b21Db2xsYXBzZX0+e0NvbGxhcHNlSWNvbn17dGhpcy5wcm9wcy5jb2xsYXBzZUxhYmVsfTwvYT5cclxuICAgICAgICB9XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdoaWRkZW4tY29udGVudCcsIHRoaXMucHJvcHMuY2xhc3NOYW1lKX0+XHJcbiAgICAgICAgICAgICAgICA8YSBocmVmPVwiamF2YXNjcmlwdDp2b2lkKDApXCIgb25DbGljaz17dGhpcy5vbkV4cGFuZENvbGxhcHNlfSBuYW1lPXt0aGlzLmlkfT57SWNvbn17dGhpcy5zdGF0ZS5sYWJlbH08L2E+XHJcbiAgICAgICAgICAgICAgICA8ZGl2IHN0eWxlPXt7ZGlzcGxheTogJ25vbmUnfX0+XHJcbiAgICAgICAgICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5pZH0+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+XHJcbiAgICAgICAgICAgICAgICAgICAge0JvdHRvbUJ1dHRvbn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICA8L2Rpdj5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gSGlkZGVuQ29udGVudDsiLCIvKipcbiAqIFNwbGl0dGVyIGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDMvMDNcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdWYuU3BsaXR0ZXIgLz5cbiAqXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIFNwbGl0dGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnU3BsaXR0ZXInLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB0eXBlOiBQcm9wVHlwZXMub25lT2YoWydoJywgJ3YnXSkuaXNSZXF1aXJlZCxcbiAgICAgICAgcG9zaXRpb246IFByb3BUeXBlcy5vbmVPZihbJ2xlZnQnLCAncmlnaHQnLCAndG9wJywgJ2JvdHRvbSddKS5pc1JlcXVpcmVkLFxuICAgICAgICAvL2xlZnRQYW5lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAvL3JpZ2h0UGFuZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgbWluTGVmdDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgICBtaW5SaWdodDogUHJvcFR5cGVzLm51bWJlci5pc1JlcXVpcmVkLFxuICAgICAgICBtYXhMZWZ0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICAgIG1heFJpZ2h0OiBQcm9wVHlwZXMubnVtYmVyLmlzUmVxdWlyZWQsXG4gICAgICAgIG9uUmVzaXplOiBQcm9wVHlwZXMuZnVuY1xuICAgIH0sXG4gICAgaWQ6ICcnLFxuICAgIG9uUmVzaXplOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKHRoaXMucHJvcHMub25SZXNpemUpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25SZXNpemUoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBwcml2YXRlXG4gICAgc3BsaXR0ZXJBY3RpdmVGbGFnOiBmYWxzZSxcbiAgICBzcGxpdHRlck9iajogZmFsc2UsXG4gICAgc3BsaXR0ZXJNb3VzZURvd246IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgaWYgKCF0aGlzLnNwbGl0dGVyQWN0aXZlRmxhZyAmJiB0aGlzLnN0YXRlLmV4cGFuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgLy8gZG9jdW1lbnQuZ2V0RWxlbWVudEJ5SWQodGhpcy5pZClcbiAgICAgICAgICAgIGlmICh0aGlzLiRzcGxpdHRlclswXS5zZXRDYXB0dXJlKSB7XG4gICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXJbMF0uc2V0Q2FwdHVyZSgpO1xuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LmFkZEV2ZW50TGlzdGVuZXIoJ21vdXNldXAnLCB0aGlzLnNwbGl0dGVyTW91c2VVcCwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZG9jdW1lbnQuYWRkRXZlbnRMaXN0ZW5lcignbW91c2Vtb3ZlJywgdGhpcy5zcGxpdHRlck1vdXNlTW92ZSwgdHJ1ZSk7XG4gICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgdGhpcy5zcGxpdHRlckFjdGl2ZUZsYWcgPSB0cnVlO1xuICAgICAgICAgICAgdGhpcy5zcGxpdHRlck9iaiA9IHRoaXMuJHNwbGl0dGVyWzBdO1xuXG4gICAgICAgICAgICAvL2xlZnRzaWRlYmFyQ29sbGFwc2VXaWR0aCA9ICQoJy5sZWZ0c2lkZWJhci1jb2xsYXBzZScpLm91dGVyV2lkdGgodHJ1ZSk7XG4gICAgICAgICAgICB0aGlzLnNwbGl0dGVyV2lkdGggPSB0aGlzLiRzcGxpdHRlci5vdXRlcldpZHRoKHRydWUpO1xuXG4gICAgICAgICAgICAvKnNwbGl0dGVyUGFyZW50T2JqID0gYi5wYXJlbnRFbGVtZW50O1xuICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNwbGl0dGVyT2JqLm9mZnNldExlZnQpO1xuICAgICAgICAgICAgIGNvbnNvbGUubG9nKHNwbGl0dGVyT2JqLnBhcmVudEVsZW1lbnQub2Zmc2V0TGVmdCk7Ki9cbiAgICAgICAgfVxuICAgIH0sXG4gICAgc3BsaXR0ZXJNb3VzZVVwOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmICh0aGlzLnNwbGl0dGVyQWN0aXZlRmxhZykge1xuICAgIC8vICAgICAgICB2YXIgYSA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwidG9jXCIpO1xuICAgIC8vICAgICAgICB2YXIgYyA9IGRvY3VtZW50LmdldEVsZW1lbnRCeUlkKFwiY29udGVudFwiKTtcbiAgICAvLyAgICAgICAgY2hhbmdlUVNlYXJjaGJveFdpZHRoKCk7XG4gICAgLy8gICAgICAgIGEuc3R5bGUud2lkdGggPSAoc3BsaXR0ZXJPYmoub2Zmc2V0TGVmdCAtIDIwKSArIFwicHhcIjtcbiAgICAvLyAgICAgICAgYy5zdHlsZS5sZWZ0ID0gKHNwbGl0dGVyT2JqLm9mZnNldExlZnQgKyAxMCkgKyBcInB4XCI7XG5cbiAgICAgICAgICAgIGNvbnN0IHsgdHlwZSwgcG9zaXRpb24gfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgICAgIGlmKHR5cGUgPT09ICdoJykge1xuICAgICAgICAgICAgICAgIGlmKHBvc2l0aW9uID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIucHJldigpLm91dGVyV2lkdGgodGhpcy5zcGxpdHRlck9iai5vZmZzZXRMZWZ0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIubmV4dCgpLm9mZnNldCh7IGxlZnQ6ICh0aGlzLnNwbGl0dGVyT2JqLm9mZnNldExlZnQgKyB0aGlzLnNwbGl0dGVyV2lkdGgpIH0pO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKHBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuaFJpZ2h0U3BsaXR0ZXJPZmZzZXRSaWdodCA9IHRoaXMuJHNwbGl0dGVyLnBhcmVudCgpLm91dGVyV2lkdGgodHJ1ZSkgLSB0aGlzLnNwbGl0dGVyT2JqLm9mZnNldExlZnQ7XG4gICAgICAgICAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLnByZXYoKS5jc3MoJ3JpZ2h0JywgdGhpcy5oUmlnaHRTcGxpdHRlck9mZnNldFJpZ2h0KTtcbiAgICAgICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIubmV4dCgpLm91dGVyV2lkdGgodGhpcy5oUmlnaHRTcGxpdHRlck9mZnNldFJpZ2h0IC0gdGhpcy5zcGxpdHRlcldpZHRoKTtcblxuICAgICAgICAgICAgICAgICAgICAvL3RoaXMuJHNwbGl0dGVyLnByZXYoKS5vZmZzZXQoeyByaWdodDogdGhpcy5zcGxpdHRlck9iai5vZmZzZXRSaWdodCB9KTtcbiAgICAgICAgICAgICAgICAgICAgLy90aGlzLiRzcGxpdHRlci5uZXh0KCkub3V0ZXJXaWR0aCh0aGlzLnNwbGl0dGVyT2JqLm9mZnNldFJpZ2h0IC0gdGhpcy5zcGxpdHRlcldpZHRoKTtcbiAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgaWYodGhpcy5zcGxpdHRlck9iai5yZWxlYXNlQ2FwdHVyZSkge1xuICAgICAgICAgICAgICAgIHRoaXMuc3BsaXR0ZXJPYmoucmVsZWFzZUNhcHR1cmUoKTtcbiAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICBkb2N1bWVudC5yZW1vdmVFdmVudExpc3RlbmVyKCdtb3VzZXVwJywgdGhpcy5zcGxpdHRlck1vdXNlVXAsIHRydWUpO1xuICAgICAgICAgICAgICAgIGRvY3VtZW50LnJlbW92ZUV2ZW50TGlzdGVuZXIoJ21vdXNlbW92ZScsIHRoaXMuc3BsaXR0ZXJNb3VzZU1vdmUsIHRydWUpO1xuICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHRoaXMuc3BsaXR0ZXJBY3RpdmVGbGFnID0gZmFsc2U7XG4gICAgICAgICAgICB0aGlzLnNhdmVTcGxpdHRlclBvcygpO1xuICAgICAgICAgICAgLy90aGlzLm9uUmVzaXplKCk7XG4gICAgICAgICAgICB0aGlzLiRzcGxpdHRlci50cmlnZ2VyKCdyZXNpemUnKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc3BsaXR0ZXJNb3VzZU1vdmU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBwb3NpdGlvbiwgbWluTGVmdCwgbWluUmlnaHQsIG1heExlZnQsIG1heFJpZ2h0IH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIGlmICh0aGlzLnNwbGl0dGVyQWN0aXZlRmxhZykge1xuICAgICAgICAgICAgaWYodHlwZSA9PT0gJ2gnKSB7XG4gICAgICAgICAgICAgICAgaWYocG9zaXRpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgICAgICAgICBpZiAoZS5jbGllbnRYID49IG1pbkxlZnQgJiYgZS5jbGllbnRYIDw9IG1heExlZnQpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRoaXMuc3BsaXR0ZXJPYmouc3R5bGUubGVmdCA9IGUuY2xpZW50WCArICdweCc7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZighdGhpcy5zcGxpdHRlck9iai5yZWxlYXNlQ2FwdHVyZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1lbHNlIGlmKHBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIGlmIChlLmNsaWVudFggPD0gZG9jdW1lbnQuZG9jdW1lbnRFbGVtZW50LmNsaWVudFdpZHRoIC0gbWluUmlnaHQgJiYgZS5jbGllbnRYID49IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAtIG1heFJpZ2h0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICB0aGlzLnNwbGl0dGVyT2JqLnN0eWxlLmxlZnQgPSBlLmNsaWVudFggKyAncHgnO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXRoaXMuc3BsaXR0ZXJPYmoucmVsZWFzZUNhcHR1cmUpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAvKlxuICAgICAgICAgICAgaWYgKGUuY2xpZW50WCA+PSB0aGlzLnByb3BzLm1pbkxlZnQgJiYgZS5jbGllbnRYIDw9IGRvY3VtZW50LmRvY3VtZW50RWxlbWVudC5jbGllbnRXaWR0aCAtIHRoaXMucHJvcHMubWluUmlnaHQpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnNwbGl0dGVyT2JqLnN0eWxlLmxlZnQgPSBlLmNsaWVudFggKyAncHgnO1xuICAgICAgICAgICAgICAgIGlmKCF0aGlzLnNwbGl0dGVyT2JqLnJlbGVhc2VDYXB0dXJlKSB7XG4gICAgICAgICAgICAgICAgICAgIGUucHJldmVudERlZmF1bHQoKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICAqL1xuICAgICAgICB9XG4gICAgfSxcbiAgICBzcGxpdHRlck9wZW46IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBwb3NpdGlvbiB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICBpZih0eXBlID09PSAnaCcpIHtcbiAgICAgICAgICAgIGlmKHBvc2l0aW9uID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5wcmV2KCkub2Zmc2V0KHsgbGVmdDogMCB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5vZmZzZXQoeyBsZWZ0OiB0aGlzLmxlZnRGcmFtZVdpZHRoIH0pO1xuICAgICAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLm5leHQoKS5vZmZzZXQoeyBsZWZ0OiAodGhpcy5sZWZ0RnJhbWVXaWR0aCArIHRoaXMuc3BsaXR0ZXJXaWR0aCkgfSk7XG4gICAgICAgICAgICB9ZWxzZSBpZihwb3NpdGlvbiA9PT0gJ3JpZ2h0Jykge1xuICAgICAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLnByZXYoKS5jc3MoJ3JpZ2h0JywgKHRoaXMucmlnaHRGcmFtZVdpZHRoICsgdGhpcy5zcGxpdHRlcldpZHRoKSk7XG4gICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIub2Zmc2V0KHsgbGVmdDogKHRoaXMuJHNwbGl0dGVyLnBhcmVudCgpLm91dGVyV2lkdGgodHJ1ZSkgLSB0aGlzLnJpZ2h0RnJhbWVXaWR0aCAtIHRoaXMuc3BsaXR0ZXJXaWR0aCkgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIubmV4dCgpLm91dGVyV2lkdGgodGhpcy5yaWdodEZyYW1lV2lkdGgpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy4kc3BsaXR0ZXIuY3NzKCdjdXJzb3InLCAnZS1yZXNpemUnKTtcbiAgICAgICAgXG4gICAgICAgIC8qXG4gICAgICAgICB0aGlzLiRzcGxpdHRlci5wcmV2KCkub24oJ3dlYmtpdFRyYW5zaXRpb25FbmQgb3RyYW5zaXRpb25lbmQgb1RyYW5zaXRpb25FbmQgbXNUcmFuc2l0aW9uRW5kIHRyYW5zaXRpb25lbmQnLCBmdW5jdGlvbihlKSB7XG4gICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5jc3MoJ2Rpc3BsYXknLCAnYmxvY2snKTtcbiAgICAgICAgfSk7XG4gICAgICAgICovXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2V4cGFuZDogdHJ1ZX0pO1xuICAgICAgICB0aGlzLiRzcGxpdHRlci50cmlnZ2VyKCdyZXNpemUnKTtcbiAgICB9LFxuICAgIHNwbGl0dGVyQ2xvc2U6IGZ1bmN0aW9uICgpIHtcbiAgICAgICAgY29uc3QgeyB0eXBlLCBwb3NpdGlvbiB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICBpZih0eXBlID09PSAnaCcpIHtcbiAgICAgICAgICAgIHRoaXMuc3BsaXR0ZXJXaWR0aCA9IHRoaXMuJHNwbGl0dGVyLm91dGVyV2lkdGgodHJ1ZSk7XG5cbiAgICAgICAgICAgIGlmKHBvc2l0aW9uID09PSAnbGVmdCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLmxlZnRGcmFtZVdpZHRoID0gdGhpcy4kc3BsaXR0ZXIucHJldigpLm91dGVyV2lkdGgodHJ1ZSk7XG5cbiAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5wcmV2KCkub2Zmc2V0KHsgbGVmdDogKHRoaXMubGVmdEZyYW1lV2lkdGggKiAtMSkgfSk7XG4gICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIub2Zmc2V0KHsgbGVmdDogMCB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5uZXh0KCkub2Zmc2V0KHsgbGVmdDogdGhpcy5zcGxpdHRlcldpZHRoIH0pO1xuICAgICAgICAgICAgfWVsc2UgaWYocG9zaXRpb24gPT09ICdyaWdodCcpIHtcbiAgICAgICAgICAgICAgICB0aGlzLnJpZ2h0RnJhbWVXaWR0aCA9IHRoaXMuJHNwbGl0dGVyLm5leHQoKS5vdXRlcldpZHRoKHRydWUpO1xuXG4gICAgICAgICAgICAgICAgdGhpcy4kc3BsaXR0ZXIucHJldigpLmNzcygncmlnaHQnLCB0aGlzLnNwbGl0dGVyV2lkdGgpO1xuICAgICAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLm9mZnNldCh7IGxlZnQ6ICh0aGlzLiRzcGxpdHRlci5wYXJlbnQoKS5vdXRlcldpZHRoKHRydWUpIC0gdGhpcy5zcGxpdHRlcldpZHRoKSB9KTtcbiAgICAgICAgICAgICAgICB0aGlzLiRzcGxpdHRlci5uZXh0KCkub3V0ZXJXaWR0aCgwKTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuJHNwbGl0dGVyLmNzcygnY3Vyc29yJywgJ2RlZmF1bHQnKTtcbiAgICAgICAgLy90aGlzLiRzcGxpdHRlci5wcmV2KCkub2ZmKCd3ZWJraXRUcmFuc2l0aW9uRW5kIG90cmFuc2l0aW9uZW5kIG9UcmFuc2l0aW9uRW5kIG1zVHJhbnNpdGlvbkVuZCB0cmFuc2l0aW9uZW5kJyk7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe2V4cGFuZDogZmFsc2V9KTtcbiAgICAgICAgdGhpcy4kc3BsaXR0ZXIudHJpZ2dlcigncmVzaXplJyk7XG4gICAgfSxcbiAgICBleHBhbmRDb2xsYXBzZTogZnVuY3Rpb24oZSkge1xuICAgICAgICBpZih0aGlzLnN0YXRlLmV4cGFuZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5zcGxpdHRlckNsb3NlKCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHRoaXMuc3BsaXR0ZXJPcGVuKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNhdmVTcGxpdHRlclBvczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgcG9zaXRpb24gfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHZhciBhID0gdGhpcy4kc3BsaXR0ZXJbMF07Ly9kb2N1bWVudC5nZXRFbGVtZW50QnlJZCh0aGlzLmlkKTtcbiAgICAgICAgaWYoYSkge1xuICAgICAgICAgICAgaWYodHlwZSA9PT0gJ2gnKSB7XG4gICAgICAgICAgICAgICAgaWYocG9zaXRpb24gPT09ICdsZWZ0Jykge1xuICAgICAgICAgICAgICAgICAgICBVdGlsLnNldENvb2tpZSgnaHNwbGl0dGVyTGVmdFBvc2l0aW9uJywgYS5vZmZzZXRMZWZ0LCAzNjUpO1xuICAgICAgICAgICAgICAgIH1lbHNlIGlmKHBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICAgICAgICAgIFV0aWwuc2V0Q29va2llKCdoc3BsaXR0ZXJSaWdodFBvc2l0aW9uJywgdGhpcy5oUmlnaHRTcGxpdHRlck9mZnNldFJpZ2h0LCAzNjUpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVzaXplU3BsaXR0ZXJQb3M6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCB7IHR5cGUsIHBvc2l0aW9uIH0gPSB0aGlzLnByb3BzO1xuICAgICAgICBpZih0eXBlID09PSAnaCcpIHtcbiAgICAgICAgICAgIGlmKHBvc2l0aW9uID09PSAncmlnaHQnKSB7XG4gICAgICAgICAgICAgICAgdmFyIHJpZ2h0RnJhbWVXaWR0aCA9IDA7XG4gICAgICAgICAgICAgICAgaWYodGhpcy5zdGF0ZS5leHBhbmQgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICAgICAgcmlnaHRGcmFtZVdpZHRoID0gdGhpcy4kc3BsaXR0ZXIubmV4dCgpLm91dGVyV2lkdGgodHJ1ZSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIHRoaXMuJHNwbGl0dGVyLm9mZnNldCh7IGxlZnQ6ICh0aGlzLiRzcGxpdHRlci5wYXJlbnQoKS5vdXRlcldpZHRoKHRydWUpIC0gcmlnaHRGcmFtZVdpZHRoIC0gdGhpcy5zcGxpdHRlcldpZHRoKSB9KTtcbiAgICAgICAgICAgIH1cbiAgICAgICAgfVxuICAgIH0sXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG5cdFx0Ly8g67aA66qoIOy7tO2PrOuEjO2KuOyXkOyEnCBwcm9w7J20IOuEmOyWtOyYpOyngCDslYrsnYAg6rK97JqwIChpbiDsl7DsgrDsnpDroZwg7ZmV7J24KSDrp6TtlZHsnZgg6rCS7J20IHRoaXMucHJvcHPsl5Ag7ISk7KCV65Cc64ukLlxuXHRcdHJldHVybiB7dHlwZTogJ2gnLCBwb3NpdGlvbjogJ2xlZnQnLCBtaW5MZWZ0OiA1MCwgbWluUmlnaHQ6IDUwLCBtYXhMZWZ0OiA1MDAsIG1heFJpZ2h0OiA1MDB9O1xuXHR9LFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7Lu07Y+s64SM7Yq46rCAIOuniOyatO2KuOuQmOq4sCDsoIQgKO2VnOuyiCDtmLjstpwpIC8g66as7YS06rCS7J2AIHRoaXMuc3RhdGXsnZgg7LSI6riw6rCS7Jy866GcIOyCrOyaqVxuICAgICAgICByZXR1cm4ge2V4cGFuZDogdHJ1ZX07XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCmOq4sCDsp4HsoIQo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgbGV0IGlkID0gdGhpcy5wcm9wcy5pZDtcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWQgPSBVdGlsLmdldFVVSUQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIHRoaXMuJHNwbGl0dGVyID0gJCgnIycrdGhpcy5pZCk7XG5cbiAgICAgICAgLy8gRXZlbnRzXG4gICAgICAgIHRoaXMuJHNwbGl0dGVyLm9uKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplKTtcblxuICAgICAgICB2YXIgX3RoaXMgPSB0aGlzO1xuICAgICAgICAkKHdpbmRvdykub24oJ3Jlc2l6ZScsIGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgICAgIC8vIHNwbGl0dGVy7JeQ7IScIOuwnOyDneyLnO2CpOuKlCByZXNpemUg7J2067Kk7Yq47JmAIOq1rOuzhFxuICAgICAgICAgICAgaWYoZS50YXJnZXQgPT09IHRoaXMpIHtcbiAgICAgICAgICAgICAgICAvL190aGlzLnJlc2l6ZVNwbGl0dGVyUG9zKCk7XG4gICAgICAgICAgICAgICAgLy8gc3BsaXR0ZXJPcGVuL3NwbGl0dGVyQ2xvc2Ug7ZWo7IiYIOyLpO2WieqzvCDsi5zqsITssKjrpbwg65GQ7Ja07JW8IOyggeyaqeuQqFxuICAgICAgICAgICAgICAgIHNldFRpbWVvdXQoX3RoaXMucmVzaXplU3BsaXR0ZXJQb3MsIDEpO1xuICAgICAgICAgICAgfVxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgY29uc3Qge2NsYXNzTmFtZSwgdHlwZSwgcG9zaXRpb259ID0gdGhpcy5wcm9wcztcblxuICAgICAgICB2YXIgaCA9IHRydWU7XG4gICAgICAgIGlmKHR5cGUgIT09ICdoJykge1xuICAgICAgICAgICAgaCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIGwgPSB0cnVlO1xuICAgICAgICBpZihwb3NpdGlvbiAhPT0gJ2xlZnQnKSB7XG4gICAgICAgICAgICBsID0gZmFsc2U7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZGlzcGxheSA9ICdibG9jayc7XG4gICAgICAgIGlmKCF0aGlzLnN0YXRlLmV4cGFuZCkge1xuICAgICAgICAgICAgZGlzcGxheSA9ICdub25lJztcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLmlkfSBjbGFzc05hbWU9e2NsYXNzTmFtZXMoeydtYWluZnJhbWUtc3BsaXR0ZXInOiB0cnVlLCAnaC1zcGxpdHRlcic6IGgsICd2LXNwbGl0dGVyJzogIWgsICdsZWZ0LXNwbGl0dGVyJzogbCwgJ3JpZ2h0LXNwbGl0dGVyJzogIWx9LCBjbGFzc05hbWUpfVxuICAgICAgICAgICAgICAgIG9uTW91c2VEb3duPXt0aGlzLnNwbGl0dGVyTW91c2VEb3dufSBvbk1vdXNlVXA9e3RoaXMuc3BsaXR0ZXJNb3VzZVVwfSBvbk1vdXNlTW92ZT17dGhpcy5zcGxpdHRlck1vdXNlTW92ZX0+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZXMoeydzcGxpdHRlci1jb2xsYXBzZSc6IHRoaXMuc3RhdGUuZXhwYW5kLCAnc3BsaXR0ZXItZXhwYW5kJzogIXRoaXMuc3RhdGUuZXhwYW5kfSl9IG9uTW91c2VVcD17dGhpcy5leHBhbmRDb2xsYXBzZX0+PC9kaXY+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJzcGxpdHRlci1yZXNpemUtaGFuZGxlXCIgc3R5bGU9e3tkaXNwbGF5OiBkaXNwbGF5fX0+PC9kaXY+XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBTcGxpdHRlcjsiLCIvKipcbiAqIE1vZGFsIGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDMvMjVcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdW0uTW9kYWwgcmVmPVwibW9kYWxcIiB3aWR0aD1cIjcwMHB4XCI+XG4gKiAgIDxQdW0uTW9kYWxIZWFkZXI+TW9kYWwgVGl0bGU8L1B1bS5Nb2RhbEhlYWRlcj5cbiAqICAgPFB1bS5Nb2RhbEJvZHk+TW9kYWwgQm9keTwvUHVtLk1vZGFsQm9keT5cbiAqICAgPFB1bS5Nb2RhbEZvb3Rlcj5Nb2RhbCBGb290ZXI8L1B1bS5Nb2RhbEZvb3Rlcj5cbiAqIDwvUHVtLk1vZGFsPlxuICpcbiAqIGJvb3RzdHJhcCBjb21wb25lbnRcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFByb3BUeXBlcyA9IHJlcXVpcmUoJ3JlYWN0JykuUHJvcFR5cGVzO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vc2VydmljZXMvVXRpbCcpO1xuXG52YXIgTW9kYWxIZWFkZXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdNb2RhbEhlYWRlcicsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZ1xuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ21vZGFsLWhlYWRlcicsIHRoaXMucHJvcHMuY2xhc3NOYW1lKX0+XG4gICAgICAgICAgICAgICAgPGJ1dHRvbiB0eXBlPVwiYnV0dG9uXCIgY2xhc3NOYW1lPVwiY2xvc2VcIiBkYXRhLWRpc21pc3M9XCJtb2RhbFwiPjxzcGFuIGFyaWEtaGlkZGVuPVwidHJ1ZVwiPiZ0aW1lczs8L3NwYW4+PHNwYW4gY2xhc3NOYW1lPVwic3Itb25seVwiPkNsb3NlPC9zcGFuPjwvYnV0dG9uPlxuICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cIm1vZGFsLXRpdGxlXCI+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9zcGFuPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBNb2RhbEJvZHkgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdNb2RhbEJvZHknLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdtb2RhbC1ib2R5JywgdGhpcy5wcm9wcy5jbGFzc05hbWUpfT57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxudmFyIE1vZGFsRm9vdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnTW9kYWxGb290ZXInLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmdcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPXtjbGFzc05hbWVzKCdtb2RhbC1mb290ZXInLCB0aGlzLnByb3BzLmNsYXNzTmFtZSl9Pnt0aGlzLnByb3BzLmNoaWxkcmVufTwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgTW9kYWwgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdNb2RhbCcsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHdpZHRoOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyXG4gICAgICAgIF0pLFxuICAgICAgICBiYWNrZHJvcDogUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIG9uU2hvdzogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uSGlkZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIGluaXQ6IFByb3BUeXBlcy5mdW5jXG4gICAgfSxcbiAgICBpZDogJycsXG4gICAgc2hvdzogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBhbGVydCA9ICQoJyMnK3RoaXMuaWQpO1xuICAgICAgICBhbGVydC5tb2RhbCgnc2hvdycpO1xuICAgICAgICAvKlxuICAgICAgICBpZih0aGlzLnByb3BzLmJhY2tkcm9wID09PSB0cnVlKSB7XG4gICAgICAgICAgICBhbGVydC5tb2RhbCgnc2hvdycpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBhbGVydC5tb2RhbCh7XG4gICAgICAgICAgICAgICAgYmFja2Ryb3A6ICdzdGF0aWMnLFxuICAgICAgICAgICAgICAgIGtleWJvYXJkOiBmYWxzZVxuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICB9LFxuICAgIGhpZGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgYWxlcnQgPSAkKCcjJyt0aGlzLmlkKTtcbiAgICAgICAgYWxlcnQubW9kYWwoJ2hpZGUnKTtcbiAgICB9LFxuICAgIG9uU2hvdzogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25TaG93ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uU2hvdyhldmVudCk7XG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkhpZGU6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uSGlkZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkhpZGUoZXZlbnQpO1xuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0Q2hpbGRyZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnByb3BzLmNoaWxkcmVuO1xuXG4gICAgICAgIHJldHVybiBSZWFjdC5DaGlsZHJlbi5tYXAoY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgaWYoY2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgcmV0dXJuIFJlYWN0LmNsb25lRWxlbWVudChjaGlsZCwge30pO1xuICAgICAgICB9KTtcbiAgICB9LFxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIHJldHVybiB7YmFja2Ryb3A6IGZhbHNlfTtcbiAgICB9LFxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxuICAgICAgICBsZXQgaWQgPSB0aGlzLnByb3BzLmlkO1xuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgdmFyICRtb2RhbCA9ICQoJyMnK3RoaXMuaWQpO1xuICAgICAgICBpZih0aGlzLnByb3BzLmJhY2tkcm9wID09PSBmYWxzZSkge1xuICAgICAgICAgICAgJG1vZGFsLmF0dHIoJ2RhdGEtYmFja2Ryb3AnLCAnc3RhdGljJyk7XG4gICAgICAgICAgICAkbW9kYWwuYXR0cignZGF0YS1rZXlib2FyZCcsIGZhbHNlKTtcbiAgICAgICAgfVxuXG4gICAgICAgICRtb2RhbC5vbignc2hvd24uYnMubW9kYWwnLCB0aGlzLm9uU2hvdyk7XG4gICAgICAgICRtb2RhbC5vbignaGlkZGVuLmJzLm1vZGFsJywgdGhpcy5vbkhpZGUpO1xuXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLmluaXQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBkYXRhID0ge307XG4gICAgICAgICAgICBkYXRhLiRtb2RhbCA9ICRtb2RhbDtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuaW5pdChkYXRhKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxuICAgICAgICBjb25zdCB7Y2xhc3NOYW1lLCB3aWR0aH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLmlkfSBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ21vZGFsJywgJ2ZhZGUnLCBjbGFzc05hbWUpfSByb2xlPVwiZGlhbG9nXCIgYXJpYS1sYWJlbGxlZGJ5PVwiXCIgYXJpYS1oaWRkZW49XCJ0cnVlXCI+XG4gICAgICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJtb2RhbC1kaWFsb2dcIiBzdHlsZT17e3dpZHRoOiB3aWR0aH19PlxuICAgICAgICAgICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cIm1vZGFsLWNvbnRlbnRcIj5cbiAgICAgICAgICAgICAgICAgICAgICAgIHt0aGlzLmdldENoaWxkcmVuKCl9XG4gICAgICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIE1vZGFsOiBNb2RhbCxcbiAgICBNb2RhbEhlYWRlcjogTW9kYWxIZWFkZXIsXG4gICAgTW9kYWxCb2R5OiBNb2RhbEJvZHksXG4gICAgTW9kYWxGb290ZXI6IE1vZGFsRm9vdGVyXG59OyIsIi8qKlxuICogUGFuZWwgY29tcG9uZW50XG4gKlxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wMy8zMFxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqXG4gKiBleGFtcGxlOlxuICogPFB1bS5QYW5lbCAgLz5cbiAqXG4gKiBib290c3RyYXAgY29tcG9uZW50XG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIFBhbmVsSGVhZGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnUGFuZWxIZWFkZXInLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKSxcbiAgICAgICAgaGVpZ2h0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyXG4gICAgICAgIF0pXG4gICAgfSxcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDsu7Ttj6zrhIztirjqsIAg66eI7Jq07Yq465CY6riwIOyghCAo7ZWc67KIIO2YuOy2nCkgLyDrpqzthLTqsJLsnYAgdGhpcy5zdGF0ZeydmCDstIjquLDqsJLsnLzroZwg7IKs7JqpXG4gICAgICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiB7d2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodH07XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOyDiOuhnOyatCBwcm9wc+ulvCDrsJvsnYQg65WMIO2YuOy2nCjstZzstIgg66CM642U66eBIOyLnOyXkOuKlCDtmLjstpzrkJjsp4Ag7JWK7J2MKVxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBuZXh0UHJvcHM7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3dpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHR9KVxuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1oZWFkaW5nXCIgc3R5bGU9e3t3aWR0aDogdGhpcy5zdGF0ZS53aWR0aCwgaGVpZ2h0OiB0aGlzLnN0YXRlLmhlaWdodH19PlxuICAgICAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtdGl0bGVcIj57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2Rpdj5cbiAgICAgICAgICAgIDwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgUGFuZWxCb2R5ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnUGFuZWxCb2R5JyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgd2lkdGg6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIFByb3BUeXBlcy5udW1iZXJcbiAgICAgICAgXSksXG4gICAgICAgIGhlaWdodDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKVxuICAgIH0sXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOuniOyatO2KuOuQmOq4sCDsoIQgKO2VnOuyiCDtmLjstpwpIC8g66as7YS06rCS7J2AIHRoaXMuc3RhdGXsnZgg7LSI6riw6rCS7Jy866GcIOyCrOyaqVxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSB0aGlzLnByb3BzO1xuICAgICAgICByZXR1cm4ge3dpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHR9O1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOqwgCDsg4jroZzsmrQgcHJvcHPrpbwg67Cb7J2EIOuVjCDtmLjstpwo7LWc7LSIIOugjOuNlOungSDsi5zsl5DripQg7Zi47Lac65CY7KeAIOyViuydjClcbiAgICAgICAgY29uc3Qge3dpZHRoLCBoZWlnaHR9ID0gbmV4dFByb3BzO1xuICAgICAgICB0aGlzLnNldFN0YXRlKHt3aWR0aDogd2lkdGgsIGhlaWdodDogaGVpZ2h0fSlcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicGFuZWwtYm9keVwiIHN0eWxlPXt7d2lkdGg6IHRoaXMuc3RhdGUud2lkdGgsIGhlaWdodDogdGhpcy5zdGF0ZS5oZWlnaHR9fT57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxudmFyIFBhbmVsRm9vdGVyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnUGFuZWxGb290ZXInLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKSxcbiAgICAgICAgaGVpZ2h0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyXG4gICAgICAgIF0pXG4gICAgfSxcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDsu7Ttj6zrhIztirjqsIAg66eI7Jq07Yq465CY6riwIOyghCAo7ZWc67KIIO2YuOy2nCkgLyDrpqzthLTqsJLsnYAgdGhpcy5zdGF0ZeydmCDstIjquLDqsJLsnLzroZwg7IKs7JqpXG4gICAgICAgIGNvbnN0IHt3aWR0aCwgaGVpZ2h0fSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiB7d2lkdGg6IHdpZHRoLCBoZWlnaHQ6IGhlaWdodH07XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOyDiOuhnOyatCBwcm9wc+ulvCDrsJvsnYQg65WMIO2YuOy2nCjstZzstIgg66CM642U66eBIOyLnOyXkOuKlCDtmLjstpzrkJjsp4Ag7JWK7J2MKVxuICAgICAgICBjb25zdCB7d2lkdGgsIGhlaWdodH0gPSBuZXh0UHJvcHM7XG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3dpZHRoOiB3aWR0aCwgaGVpZ2h0OiBoZWlnaHR9KVxuICAgIH0sXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9XCJwYW5lbC1mb290ZXJcIiBzdHlsZT17e3dpZHRoOiB0aGlzLnN0YXRlLndpZHRoLCBoZWlnaHQ6IHRoaXMuc3RhdGUuaGVpZ2h0fX0+e3RoaXMucHJvcHMuY2hpbGRyZW59PC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBQYW5lbCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ1BhbmVsJyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb25Jbml0OiBQcm9wVHlwZXMuZnVuYyxcbiAgICB9LFxuICAgIGlkOiAnJyxcbiAgICBnZXRDaGlsZHJlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBjaGlsZHJlbiA9IHRoaXMucHJvcHMuY2hpbGRyZW47XG5cbiAgICAgICAgcmV0dXJuIFJlYWN0LkNoaWxkcmVuLm1hcChjaGlsZHJlbiwgKGNoaWxkKSA9PiB7XG4gICAgICAgICAgICBpZihjaGlsZCA9PT0gbnVsbCkge1xuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KGNoaWxkLCB7fSk7XG4gICAgICAgIH0pO1xuICAgIH0sXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG5cdFx0Ly8g67aA66qoIOy7tO2PrOuEjO2KuOyXkOyEnCBwcm9w7J20IOuEmOyWtOyYpOyngCDslYrsnYAg6rK97JqwIChpbiDsl7DsgrDsnpDroZwg7ZmV7J24KSDrp6TtlZHsnZgg6rCS7J20IHRoaXMucHJvcHPsl5Ag7ISk7KCV65Cc64ukLlxuXHRcdHJldHVybiB7Y2xhc3NOYW1lOiAncGFuZWwtZGVmYXVsdCd9O1xuXHR9LFxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxuICAgICAgICBsZXQgaWQgPSB0aGlzLnByb3BzLmlkO1xuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25Jbml0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uSW5pdCgpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIGNvbnN0IHtjbGFzc05hbWV9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZXMoJ3BhbmVsJywgY2xhc3NOYW1lKX0+e3RoaXMuZ2V0Q2hpbGRyZW4oKX08L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSB7XG4gICAgUGFuZWw6IFBhbmVsLFxuICAgIFBhbmVsSGVhZGVyOiBQYW5lbEhlYWRlcixcbiAgICBQYW5lbEJvZHk6IFBhbmVsQm9keSxcbiAgICBQYW5lbEZvb3RlcjogUGFuZWxGb290ZXJcbn07IiwiLyoqXHJcbiAqIFJhZGlvIGNvbXBvbmVudFxyXG4gKlxyXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzAzLzE3XHJcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XHJcbiAqXHJcbiAqIGV4YW1wbGU6XHJcbiAqIDxQdW0uUmFkaW8gb3B0aW9ucz1cIntvcHRpb25zfVwiIC8+XHJcbiAqXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcclxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XHJcblxyXG52YXIgUmFkaW8gPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBkaXNwbGF5TmFtZTogJ1JhZGlvJyxcclxuICAgIHByb3BUeXBlczoge1xyXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIHNlbGVjdGVkVmFsdWU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xyXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgICAgICAgICBQcm9wVHlwZXMuYm9vbCxcclxuICAgICAgICBdKSxcclxuICAgICAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXHJcbiAgICAgICAgdmFsdWU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xyXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyLFxyXG4gICAgICAgICAgICBQcm9wVHlwZXMuYm9vbCxcclxuICAgICAgICBdKVxyXG4gICAgfSxcclxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8g7ZWE7IiYIO2VreuqqVxyXG4gICAgICAgIGNvbnN0IHtjbGFzc05hbWUsIG5hbWUsIHNlbGVjdGVkVmFsdWUsIG9uQ2hhbmdlLCB2YWx1ZX0gPSB0aGlzLnByb3BzO1xyXG4gICAgICAgIGNvbnN0IG9wdGlvbmFsID0ge307XHJcbiAgICAgICAgaWYoc2VsZWN0ZWRWYWx1ZSAhPT0gdW5kZWZpbmVkKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbmFsLmNoZWNrZWQgPSAodGhpcy5wcm9wcy52YWx1ZSA9PT0gc2VsZWN0ZWRWYWx1ZSk7XHJcbiAgICAgICAgfVxyXG4gICAgICAgIC8qXHJcbiAgICAgICAgaWYodHlwZW9mIG9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XHJcbiAgICAgICAgICAgIG9wdGlvbmFsLm9uQ2hhbmdlID0gb25DaGFuZ2UuYmluZChudWxsLCB0aGlzLnByb3BzLnZhbHVlKTtcclxuICAgICAgICB9XHJcbiAgICAgICAgKi9cclxuICAgICAgICBvcHRpb25hbC5vbkNoYW5nZSA9IG9uQ2hhbmdlLmJpbmQobnVsbCwgdGhpcy5wcm9wcy52YWx1ZSk7XHJcblxyXG4gICAgICAgIHJldHVybiAoXHJcbiAgICAgICAgICAgIDxkaXYgY2xhc3NOYW1lPVwicmFkaW9cIj5cclxuICAgICAgICAgICAgICAgIDxsYWJlbD5cclxuICAgICAgICAgICAgICAgICAgICA8aW5wdXQgdHlwZT1cInJhZGlvXCIgY2xhc3NOYW1lPXtjbGFzc05hbWV9IG5hbWU9e25hbWV9IHZhbHVlPXt2YWx1ZX1cclxuICAgICAgICAgICAgICAgICAgICAgICAgey4uLm9wdGlvbmFsfSAvPlxyXG4gICAgICAgICAgICAgICAgICAgIDxzcGFuIGNsYXNzTmFtZT1cImxibFwiPnt0aGlzLnByb3BzLmNoaWxkcmVufTwvc3Bhbj5cclxuICAgICAgICAgICAgICAgIDwvbGFiZWw+XHJcbiAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICk7XHJcbiAgICB9XHJcbn0pO1xyXG5cclxubW9kdWxlLmV4cG9ydHMgPSBSYWRpbzsiLCIvKipcclxuICogUmFkaW9Hcm91cCBjb21wb25lbnRcclxuICpcclxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wMy8xN1xyXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiA8UHVtLlJhZGlvR3JvdXAgb3B0aW9ucz1cIntvcHRpb25zfVwiIC8+XHJcbiAqXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG5pbXBvcnQgUmVhY3QsIHtQcm9wVHlwZXN9IGZyb20gJ3JlYWN0JztcclxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XHJcblxyXG52YXIgUmFkaW9Hcm91cCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcclxuICAgIGRpc3BsYXlOYW1lOiAnUmFkaW9Hcm91cCcsXHJcbiAgICBwcm9wVHlwZXM6IHtcclxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgbmFtZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBzZWxlY3RlZFZhbHVlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcclxuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlcixcclxuICAgICAgICAgICAgUHJvcFR5cGVzLmJvb2wsXHJcbiAgICAgICAgXSksXHJcbiAgICAgICAgb25DaGFuZ2U6IFByb3BUeXBlcy5mdW5jLFxyXG4gICAgICAgIGhvcml6b250YWw6IFByb3BUeXBlcy5ib29sXHJcbiAgICB9LFxyXG4gICAgb25DaGFuZ2U6IGZ1bmN0aW9uKHZhbHVlLCBldmVudCkge1xyXG4gICAgICAgIHRoaXMuc2V0U3RhdGUoe3NlbGVjdGVkVmFsdWU6IHZhbHVlfSk7XHJcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcclxuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShldmVudCwgdmFsdWUpO1xyXG4gICAgICAgIH1cclxuICAgIH0sXHJcbiAgICBnZXRDaGlsZHJlbjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgY29uc3Qge2NsYXNzTmFtZSwgbmFtZSwgY2hpbGRyZW59ID0gdGhpcy5wcm9wcyxcclxuICAgICAgICAgICAgc2VsZWN0ZWRWYWx1ZSA9IHRoaXMuc3RhdGUuc2VsZWN0ZWRWYWx1ZSxcclxuICAgICAgICAgICAgb25DaGFuZ2UgPSB0aGlzLm9uQ2hhbmdlO1xyXG5cclxuICAgICAgICByZXR1cm4gUmVhY3QuQ2hpbGRyZW4ubWFwKGNoaWxkcmVuLCAocmFkaW8pID0+IHtcclxuICAgICAgICAgICAgaWYocmFkaW8gPT09IG51bGwpIHtcclxuICAgICAgICAgICAgICAgIHJldHVybiBudWxsO1xyXG4gICAgICAgICAgICB9XHJcblxyXG4gICAgICAgICAgICByZXR1cm4gUmVhY3QuY2xvbmVFbGVtZW50KHJhZGlvLCB7XHJcbiAgICAgICAgICAgICAgICBjbGFzc05hbWUsXHJcbiAgICAgICAgICAgICAgICBuYW1lLFxyXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRWYWx1ZSxcclxuICAgICAgICAgICAgICAgIG9uQ2hhbmdlXHJcbiAgICAgICAgICAgIH0pO1xyXG4gICAgICAgIH0pO1xyXG4gICAgfSxcclxuICAgIHNldFN0YXRlT2JqZWN0OiBmdW5jdGlvbihwcm9wcykge1xyXG4gICAgICAgIGxldCBzZWxlY3RlZFZhbHVlID0gcHJvcHMuc2VsZWN0ZWRWYWx1ZTtcclxuICAgICAgICBpZih0eXBlb2Ygc2VsZWN0ZWRWYWx1ZSA9PT0gJ3VuZGVmaW5lZCcpIHtcclxuICAgICAgICAgICAgc2VsZWN0ZWRWYWx1ZSA9IG51bGw7XHJcbiAgICAgICAgfVxyXG5cclxuICAgICAgICByZXR1cm4ge1xyXG4gICAgICAgICAgICBzZWxlY3RlZFZhbHVlOiBzZWxlY3RlZFZhbHVlXHJcbiAgICAgICAgfTtcclxuICAgIH0sXHJcbiAgICBnZXRJbml0aWFsU3RhdGU6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIHJldHVybiB0aGlzLnNldFN0YXRlT2JqZWN0KHRoaXMucHJvcHMpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcclxuICAgICAgICAvL2NvbnNvbGUubG9nKCdjb21wb25lbnREaWRNb3VudCcpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xyXG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOqwgCDsg4jroZzsmrQgcHJvcHPrpbwg67Cb7J2EIOuVjCDtmLjstpwo7LWc7LSIIOugjOuNlOungSDsi5zsl5DripQg7Zi47Lac65CY7KeAIOyViuydjClcclxuICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuc2V0U3RhdGVPYmplY3QobmV4dFByb3BzKSk7XHJcbiAgICB9LFxyXG4gICAgcmVuZGVyOiBmdW5jdGlvbigpIHtcclxuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXHJcbiAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgPGRpdiBjbGFzc05hbWU9e2NsYXNzTmFtZXMoeydyYWRpby1ob3Jpem9udGFsJzogdGhpcy5wcm9wcy5ob3Jpem9udGFsfSl9PlxyXG4gICAgICAgICAgICAgICAge3RoaXMuZ2V0Q2hpbGRyZW4oKX1cclxuICAgICAgICAgICAgPC9kaXY+XHJcbiAgICAgICAgKTtcclxuICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFJhZGlvR3JvdXA7IiwiLyoqXHJcbiAqIEF1dG9Db21wbGV0ZSBjb21wb25lbnRcclxuICpcclxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wOS8wOVxyXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpqeXRAbmtpYS5jby5rclwiPkp1bmcgWW91bmctVGFpPC9hPlxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiA8UHVmLkF1dG9Db21wbGV0ZSBvcHRpb25zPXtvcHRpb25zfSAvPlxyXG4gKlxyXG4gKiBLZW5kbyBBdXRvQ29tcGxldGUg65287J2067iM65+s66as7JeQIOyiheyGjeyggeydtOuLpC5cclxuICovXHJcbid1c2Ugc3RyaWN0JztcclxuXHJcbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XHJcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcclxudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XHJcblxyXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcclxuXHJcbnZhciBBdXRvQ29tcGxldGUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICBkaXNwbGF5TmFtZTogJ0F1dG9Db21wbGV0ZScsXHJcbiAgICBwcm9wVHlwZXM6IHtcclxuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGhvc3Q6IFByb3BUeXBlcy5zdHJpbmcsIC8vIOyEnOuyhCDsoJXrs7QoQ3Jvc3MgQnJvd3NlciBBY2Nlc3MpXHJcbiAgICAgICAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIG1ldGhvZDogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBkYXRhOiBQcm9wVHlwZXMub2JqZWN0LFxyXG4gICAgICAgIHBsYWNlaG9sZGVyOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIGRhdGFTb3VyY2U6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xyXG4gICAgICAgICAgICBQcm9wVHlwZXMuYXJyYXksXHJcbiAgICAgICAgICAgIFByb3BUeXBlcy5vYmplY3RcclxuICAgICAgICBdKSxcclxuICAgICAgICB0ZW1wbGF0ZTogUHJvcFR5cGVzLnN0cmluZyxcclxuICAgICAgICBmaWx0ZXI6IFByb3BUeXBlcy5zdHJpbmcsXHJcbiAgICAgICAgc2VwYXJhdG9yOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIG1pbkxlbmd0aDogUHJvcFR5cGVzLm51bWJlcixcclxuICAgICAgICBkYXRhVGV4dEZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxyXG4gICAgICAgIHBhcmFtZXRlck1hcEZpZWxkOiBQcm9wVHlwZXMub2JqZWN0ICAvLyBQYXJhbWV0ZXIgQ29udHJvbCDqsJ3ssrQo7ZWE7YSw7LKY66asKVxyXG4gICAgfSxcclxuICAgIGlkOiAnJyxcclxuICAgICRhdXRvQ29tcGxldGU6IHVuZGVmaW5lZCxcclxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xyXG5cdFx0Ly8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXHJcblx0XHQvLyDrtoDrqqgg7Lu07Y+s64SM7Yq47JeQ7IScIHByb3DsnbQg64SY7Ja07Jik7KeAIOyViuydgCDqsr3smrAgKGluIOyXsOyCsOyekOuhnCDtmZXsnbgpIOunpO2VkeydmCDqsJLsnbQgdGhpcy5wcm9wc+yXkCDshKTsoJXrkJzri6QuXHJcbiAgICAgICAgcmV0dXJuIHttZXRob2Q6ICdQT1NUJywgbGlzdEZpZWxkOiAncmVzdWx0VmFsdWUubGlzdCcsIHRvdGFsRmllbGQ6ICdyZXN1bHRWYWx1ZS50b3RhbENvdW50JywgcGxhY2Vob2xkZXI6ICRwc19sb2NhbGUuYXV0b0NvbXBsZXRlLCBmaWx0ZXI6IFwic3RhcnRzd2l0aFwiLCBzZXBhcmF0b3I6IFwiLCBcIiwgdGVtcGxhdGU6IG51bGwsIGRhdGFUZXh0RmllbGQ6IG51bGwsIG1pbkxlbmd0aDogMX07XHJcblx0fSxcclxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgLy8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxyXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XHJcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xyXG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xyXG4gICAgICAgIH1cclxuICAgICAgICB0aGlzLmlkID0gaWQ7XHJcbiAgICB9LFxyXG4gICAgZ2V0RGF0YVNvdXJjZTogZnVuY3Rpb24ocHJvcHMpIHtcclxuICAgICAgICBjb25zdCB7aG9zdCwgdXJsLCBtZXRob2QsIGRhdGEsIGxpc3RGaWVsZCwgdG90YWxGaWVsZCwgcGFyYW1ldGVyTWFwRmllbGR9ID0gcHJvcHM7XHJcblxyXG4gICAgICAgIGxldCBkYXRhU291cmNlID0gbmV3IGtlbmRvLmRhdGEuRGF0YVNvdXJjZSh7XHJcbiAgICAgICAgICAgIHRyYW5zcG9ydDoge1xyXG4gICAgICAgICAgICAgICAgcmVhZDoge1xyXG4gICAgICAgICAgICAgICAgICAgIHVybDogKGhvc3QgJiYgaG9zdCAhPT0gbnVsbCAmJiBob3N0Lmxlbmd0aCA+IDApID8gaG9zdCArIHVybCA6IHVybCxcclxuICAgICAgICAgICAgICAgICAgICB0eXBlOiBtZXRob2QsXHJcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcclxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBkYXRhLCAgICAgIC8vIHNlYXJjaCAoQFJlcXVlc3RCb2R5IEdyaWRQYXJhbSBncmlkUGFyYW0g66GcIOuwm+uKlOuLpC4pXHJcbiAgICAgICAgICAgICAgICAgICAgY29udGVudFR5cGU6ICdhcHBsaWNhdGlvbi9qc29uOyBjaGFyc2V0PXV0Zi04J1xyXG4gICAgICAgICAgICAgICAgfSxcclxuICAgICAgICAgICAgICAgIHBhcmFtZXRlck1hcDogZnVuY3Rpb24oZGF0YSwgdHlwZSkge1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHR5cGUgPT0gXCJyZWFkXCIgJiYgcGFyYW1ldGVyTWFwRmllbGQgIT09IG51bGwpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvLyBGaWx0ZXIgQXJyYXkgPT4gSnNvbiBPYmplY3QgQ29weVxyXG4gICAgICAgICAgICAgICAgICAgICAgICBpZihwYXJhbWV0ZXJNYXBGaWVsZC5maWx0ZXJzVG9Kc29uICYmIGRhdGEuZmlsdGVyICYmIGRhdGEuZmlsdGVyLmZpbHRlcnMpe1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlcnMgPSBkYXRhLmZpbHRlci5maWx0ZXJzO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVycy5tYXAoKGZpbHRlcikgPT4ge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbcGFyYW1ldGVyTWFwRmllbGQuc2VhcmNoRmllbGRdID0gZmlsdGVyLnZhbHVlO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuIEpTT04uc3RyaW5naWZ5KGRhdGEpO1xyXG4gICAgICAgICAgICAgICAgfVxyXG4gICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICBzY2hlbWE6IHtcclxuICAgICAgICAgICAgICAgIC8vIHJldHVybmVkIGluIHRoZSBcImxpc3RGaWVsZFwiIGZpZWxkIG9mIHRoZSByZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgZGF0YTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcclxuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyID0gW10sIGdyaWRMaXN0ID0gcmVzcG9uc2U7XHJcblxyXG4gICAgICAgICAgICAgICAgICAgIGlmKGxpc3RGaWVsZCAmJiBsaXN0RmllbGQubGVuZ3RoID4gMCAmJiBsaXN0RmllbGQgIT0gJ251bGwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyciA9IGxpc3RGaWVsZC5zcGxpdCgnLicpO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICBmb3IodmFyIGkgaW4gYXJyKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2coYXJyW2ldKTtcclxuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWdyaWRMaXN0KSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkTGlzdCA9IFtdO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZExpc3QgPSBncmlkTGlzdFthcnJbaV1dO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ3JpZExpc3Q7XHJcbiAgICAgICAgICAgICAgICB9LFxyXG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuZWQgaW4gdGhlIFwidG90YWxGaWVsZFwiIGZpZWxkIG9mIHRoZSByZXNwb25zZVxyXG4gICAgICAgICAgICAgICAgdG90YWw6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSk7XHJcbiAgICAgICAgICAgICAgICAgICAgdmFyIGFyciA9IFtdLCB0b3RhbCA9IHJlc3BvbnNlO1xyXG4gICAgICAgICAgICAgICAgICAgIGlmKHRvdGFsRmllbGQgJiYgdG90YWxGaWVsZC5sZW5ndGggPiAwICYmIHRvdGFsRmllbGQgIT0gJ251bGwnKSB7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGFyciA9IHRvdGFsRmllbGQuc3BsaXQoJy4nKTtcclxuICAgICAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpIGluIGFycikge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGFycltpXSk7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKCF0b3RhbCkge1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWwgPSAwO1xyXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgYnJlYWs7XHJcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWwgPSB0b3RhbFthcnJbaV1dO1xyXG4gICAgICAgICAgICAgICAgICAgIH1cclxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gdG90YWw7XHJcbiAgICAgICAgICAgICAgICB9XHJcbiAgICAgICAgICAgIH0sXHJcbiAgICAgICAgICAgIHNlcnZlckZpbHRlcmluZzogdHJ1ZVxyXG4gICAgICAgIH0pO1xyXG4gICAgICAgIHJldHVybiBkYXRhU291cmNlO1xyXG4gICAgfSxcclxuICAgIGdldE9wdGlvbnM6IGZ1bmN0aW9uKHByb3BzKSB7XHJcbiAgICAgICAgY29uc3Qge3BsYWNlaG9sZGVyLCB0ZW1wbGF0ZSwgZGF0YVRleHRGaWVsZCwgbWluTGVuZ3RoLCBzZXBhcmF0b3J9ID0gcHJvcHM7XHJcbiAgICAgICAgdmFyIGRhdGFTb3VyY2UgPSB0aGlzLmdldERhdGFTb3VyY2UocHJvcHMpO1xyXG5cclxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcclxuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyLFxyXG4gICAgICAgICAgICB0ZW1wbGF0ZTogdGVtcGxhdGUsXHJcbiAgICAgICAgICAgIGRhdGFTb3VyY2U6IGRhdGFTb3VyY2UsXHJcbiAgICAgICAgICAgIGRhdGFUZXh0RmllbGQ6IGRhdGFUZXh0RmllbGQsXHJcbiAgICAgICAgICAgIG1pbkxlbmd0aDogbWluTGVuZ3RoLFxyXG4gICAgICAgICAgICBzZXBhcmF0b3I6IHNlcGFyYXRvclxyXG4gICAgICAgIH07XHJcbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XHJcbiAgICB9LFxyXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KcIOuLpOydjCjtlZzrsogg7Zi47LacKVxyXG4gICAgICAgIHRoaXMuJGF1dG9Db21wbGV0ZSA9ICQoJyMnK3RoaXMuaWQpO1xyXG4gICAgICAgIC8vY29uc29sZS5sb2codGhpcy5nZXRPcHRpb25zKHRoaXMucHJvcHMpKTtcclxuICAgICAgICB0aGlzLmF1dG9Db21wbGV0ZSA9IHRoaXMuJGF1dG9Db21wbGV0ZS5rZW5kb0F1dG9Db21wbGV0ZSh0aGlzLmdldE9wdGlvbnModGhpcy5wcm9wcykpO1xyXG4gICAgfSxcclxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xyXG5cclxuICAgIH0sXHJcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcclxuICAgICAgICB2YXIgaW5wdXRTdHlsZSA9IHtcclxuICAgICAgICAgICAgd2lkdGg6IFwiMTAwJVwiXHJcbiAgICAgICAgfTtcclxuICAgICAgICBjb25zdCB7IG5hbWUsIGNsYXNzTmFtZSB9ID0gdGhpcy5wcm9wcztcclxuICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICA8aW5wdXQgaWQ9e3RoaXMuaWR9IG5hbWU9e25hbWV9IGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhjbGFzc05hbWUpfSBzdHlsZT17aW5wdXRTdHlsZX0gLz5cclxuICAgICAgICApO1xyXG4gICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gQXV0b0NvbXBsZXRlO1xyXG4iLCIvKipcbiAqIERhdGVQaWNrZXIgY29tcG9uZW50XG4gKlxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wNi8wNVxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqXG4gKiBleGFtcGxlOlxuICogPFB1Zi5EYXRlUGlja2VyIG9wdGlvbnM9e29wdGlvbnN9IC8+XG4gKlxuICogS2VuZG8gRGF0ZVBpY2tlciDrnbzsnbTruIzrn6zrpqzsl5Ag7KKF7IaN7KCB7J2064ukLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XG52YXIgRGF0ZVV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9EYXRlVXRpbCcpO1xuXG52YXIgRGF0ZVBpY2tlciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0RhdGVQaWNrZXInLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBkYXRlOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsICAgICAgICAgICAgICAgLy8gWVlZWS1NTS1ERCBISDptbTpzcyBmb3JtYXTsnZggc3RyaW5nXG4gICAgICAgICAgICBQcm9wVHlwZXMub2JqZWN0ICAgICAgICAgICAgICAgIC8vIERhdGVcbiAgICAgICAgXSksXG4gICAgICAgIG1pbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAgIC8vIFlZWVktTU0tREQgSEg6bW06c3MgZm9ybWF07J2YIHN0cmluZ1xuICAgICAgICAgICAgUHJvcFR5cGVzLm9iamVjdCAgICAgICAgICAgICAgICAvLyBEYXRlXG4gICAgICAgIF0pLFxuICAgICAgICBtYXg6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgICAgICAvLyBZWVlZLU1NLUREIEhIOm1tOnNzIGZvcm1hdOydmCBzdHJpbmdcbiAgICAgICAgICAgIFByb3BUeXBlcy5vYmplY3QgICAgICAgICAgICAgICAgLy8gRGF0ZVxuICAgICAgICBdKSxcbiAgICAgICAgdGltZVBpY2tlcjogUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGludGVydmFsOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKSxcbiAgICAgICAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbk9wZW46IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBpbml0OiBQcm9wVHlwZXMuZnVuY1xuICAgIH0sXG4gICAgaWQ6ICcnLFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBhcGlcbiAgICBvcGVuOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5kYXRlUGlja2VyLm9wZW4oKTtcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5kYXRlUGlja2VyLmNsb3NlKCk7XG4gICAgfSxcbiAgICByZWFkb25seTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZGF0ZVBpY2tlci5yZWFkb25seSgpO1xuICAgIH0sXG4gICAgZ2V0RGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRlID0gdGhpcy5kYXRlUGlja2VyLnZhbHVlKCk7IC8vIERhdGUg6rCd7LK0IOumrO2EtO2VqFxuICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKHR5cGVvZiBkYXRlKTtcbiAgICAgICAgcmV0dXJuIERhdGVVdGlsLmdldERhdGVUb1N0cmluZyhkYXRlKTsgICAgLy8gWVlZWS1NTS1ERCBISDptbTpzcyBmb3JtYXTsnZggc3RyaW5nXG4gICAgfSxcbiAgICBzZXREYXRlOiBmdW5jdGlvbihkYXRlKSB7XG4gICAgICAgIC8qXG4gICAgICAgIGlmKHR5cGVvZiBkYXRlID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5kYXRlUGlja2VyLnZhbHVlKG5ldyBEYXRlKCkpO1xuICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGRhdGUuZ2V0TW9udGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vIFlZWVktTU0tREQgSEg6bW06c3MgZm9ybWF07J2YIHN0cmluZ1xuICAgICAgICAgICAgdGhpcy5kYXRlUGlja2VyLnZhbHVlKGRhdGUpO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIC8vIFlZWVktTU0tREQgSEg6bW06c3MgZm9ybWF07J2YIHN0cmluZ1xuICAgICAgICBpZih0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGRhdGUuZ2V0TW9udGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0ZVBpY2tlci52YWx1ZShkYXRlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZW5hYmxlOiBmdW5jdGlvbihiKSB7XG4gICAgICAgIGlmKHR5cGVvZiBiID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgYiA9IHRydWU7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5kYXRlUGlja2VyLmVuYWJsZShiKTtcbiAgICB9LFxuICAgIG1pbjogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICBpZih0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGRhdGUuZ2V0TW9udGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0ZVBpY2tlci5taW4oZGF0ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG1heDogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICBpZih0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGRhdGUuZ2V0TW9udGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMuZGF0ZVBpY2tlci5tYXgoZGF0ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBldmVudFxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ29uQ2hhbmdlJyk7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZGF0ZSA9IHRoaXMuZ2V0RGF0ZSgpO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShkYXRlKTtcblxuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DbG9zZTogZnVuY3Rpb24oZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvbkNsb3NlJyk7XG4gICAgICAgIC8vZS5wcmV2ZW50RGVmYXVsdCgpOyAvL3ByZXZlbnQgcG9wdXAgY2xvc2luZ1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNsb3NlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoZSk7XG5cbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uT3BlbjogZnVuY3Rpb24oZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvbk9wZW4nKTtcbiAgICAgICAgLy9lLnByZXZlbnREZWZhdWx0KCk7IC8vcHJldmVudCBwb3B1cCBvcGVuaW5nXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uT3BlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbk9wZW4oZSk7XG5cbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvKlxuICAgIHNldFN0YXRlT2JqZWN0OiBmdW5jdGlvbihwcm9wcykge1xuXG4gICAgICAgIGxldCBkaXNhYmxlZCA9IHByb3BzLmRpc2FibGVkO1xuICAgICAgICBpZih0eXBlb2YgZGlzYWJsZWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIGRpc2FibGVkOiBkaXNhYmxlZFxuICAgICAgICB9O1xuICAgIH0sXG4gICAgKi9cbiAgICBnZXRUaW1lT3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHtpbnRlcnZhbH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHZhciBpbnRlcnZhbFZhbHVlO1xuICAgICAgICBpZih0eXBlb2YgaW50ZXJ2YWwgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpbnRlcnZhbFZhbHVlID0gNTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgaW50ZXJ2YWxWYWx1ZSA9IGludGVydmFsO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHRpbWVGb3JtYXQ6ICdISDptbScsXG4gICAgICAgICAgICBpbnRlcnZhbDogaW50ZXJ2YWxWYWx1ZVxuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3Qge2RhdGUsIHRpbWVQaWNrZXIsIG1pbiwgbWF4fSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgdmFyIGRhdGVWYWx1ZTtcbiAgICAgICAgaWYodHlwZW9mIGRhdGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkYXRlVmFsdWUgPSBuZXcgRGF0ZSgpO1xuICAgICAgICB9ZWxzZSBpZih0eXBlb2YgZGF0ZSA9PT0gJ3N0cmluZycgfHwgdHlwZW9mIGRhdGUuZ2V0TW9udGggPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIGRhdGVWYWx1ZSA9IGRhdGU7XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZm9ybWF0ID0gJ3l5eXktTU0tZGQnLFxuICAgICAgICAgICAgdGltZU9wdGlvbnM7XG4gICAgICAgIGlmKHRpbWVQaWNrZXIgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGZvcm1hdCA9ICd5eXl5LU1NLWRkIEhIOm1tJztcbiAgICAgICAgICAgIHRpbWVPcHRpb25zID0gdGhpcy5nZXRUaW1lT3B0aW9ucygpO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB2YWx1ZTogZGF0ZVZhbHVlLFxuICAgICAgICAgICAgZm9ybWF0OiBmb3JtYXQsXG4gICAgICAgICAgICBjdWx0dXJlOiAna28tS1InLCAgICAgICAvLyBodHRwOi8vZG9jcy50ZWxlcmlrLmNvbS9rZW5kby11aS9mcmFtZXdvcmsvZ2xvYmFsaXphdGlvbi9vdmVydmlld1xuICAgICAgICAgICAgY2hhbmdlOiB0aGlzLm9uQ2hhbmdlLFxuICAgICAgICAgICAgY2xvc2U6IHRoaXMub25DbG9zZSxcbiAgICAgICAgICAgIG9wZW46IHRoaXMub25PcGVuXG4gICAgICAgIH07XG5cbiAgICAgICAgJC5leHRlbmQob3B0aW9ucywgdGltZU9wdGlvbnMpO1xuXG4gICAgICAgIC8vIG1pblxuICAgICAgICBpZih0eXBlb2YgbWluICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywge21pbjogbWlufSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYXhcbiAgICAgICAgaWYodHlwZW9mIG1heCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHttYXg6IG1heH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfSxcbiAgICAvKlxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7Lu07Y+s64SM7Yq46rCAIOuniOyatO2KuOuQmOq4sCDsoIQgKO2VnOuyiCDtmLjstpwpIC8g66as7YS06rCS7J2AIHRoaXMuc3RhdGXsnZgg7LSI6riw6rCS7Jy866GcIOyCrOyaqVxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZU9iamVjdCh0aGlzLnByb3BzKTtcbiAgICB9LFxuICAgICovXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpjquLAg7KeB7KCEKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XG4gICAgICAgIGlmKHR5cGVvZiBpZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlkID0gVXRpbC5nZXRVVUlEKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfSxcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KcIOuLpOydjCjtlZzrsogg7Zi47LacKVxuICAgICAgICB0aGlzLiRkYXRlUGlja2VyID0gJCgnIycrdGhpcy5pZCk7XG5cbiAgICAgICAgaWYodGhpcy5wcm9wcy50aW1lUGlja2VyID09PSB0cnVlKSB7XG4gICAgICAgICAgICB0aGlzLmRhdGVQaWNrZXIgPSB0aGlzLiRkYXRlUGlja2VyLmtlbmRvRGF0ZVRpbWVQaWNrZXIodGhpcy5nZXRPcHRpb25zKCkpLmRhdGEoJ2tlbmRvRGF0ZVRpbWVQaWNrZXInKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgdGhpcy5kYXRlUGlja2VyID0gdGhpcy4kZGF0ZVBpY2tlci5rZW5kb0RhdGVQaWNrZXIodGhpcy5nZXRPcHRpb25zKCkpLmRhdGEoJ2tlbmRvRGF0ZVBpY2tlcicpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodGhpcy5wcm9wcy5kaXNhYmxlZCA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgdGhpcy5lbmFibGUoZmFsc2UpO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMuaW5pdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGRhdGEgPSB7fTtcbiAgICAgICAgICAgIGRhdGEuJGRhdGVQaWNrZXIgPSB0aGlzLiRkYXRlUGlja2VyO1xuICAgICAgICAgICAgZGF0YS5kYXRlUGlja2VyID0gdGhpcy5kYXRlUGlja2VyO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5pbml0KGRhdGEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOyDiOuhnOyatCBwcm9wc+ulvCDrsJvsnYQg65WMIO2YuOy2nCjstZzstIgg66CM642U66eBIOyLnOyXkOuKlCDtmLjstpzrkJjsp4Ag7JWK7J2MKVxuICAgICAgICAvL3RoaXMuc2V0U3RhdGUodGhpcy5zZXRTdGF0ZU9iamVjdChuZXh0UHJvcHMpKTtcbiAgICAgICAgdGhpcy5zZXREYXRlKG5leHRQcm9wcy5kYXRlKTtcbiAgICAgICAgdGhpcy5lbmFibGUoIW5leHRQcm9wcy5kaXNhYmxlZCk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIGNvbnN0IHtjbGFzc05hbWUsIG5hbWUsIHdpZHRofSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxpbnB1dCBpZD17dGhpcy5pZH0gY2xhc3NOYW1lPXtjbGFzc05hbWVzKGNsYXNzTmFtZSl9IG5hbWU9e25hbWV9IHN0eWxlPXt7d2lkdGg6IHdpZHRofX0gLz5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBEYXRlUGlja2VyOyIsIi8qKlxuICogRGF0ZVJhbmdlUGlja2VyIGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDYvMDVcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdWYuRGF0ZVJhbmdlUGlja2VyIG9wdGlvbnM9e29wdGlvbnN9IC8+XG4gKlxuICogS2VuZG8gRGF0ZVBpY2tlciDrnbzsnbTruIzrn6zrpqzsl5Ag7KKF7IaN7KCB7J2064ukLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XG52YXIgRGF0ZVV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9EYXRlVXRpbCcpO1xuXG52YXIgRGF0ZVJhbmdlUGlja2VyID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnRGF0ZVJhbmdlUGlja2VyJyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgc3RhcnROYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBlbmROYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBzdGFydERhdGU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZywgICAgICAgICAgICAgICAvLyBZWVlZLU1NLUREIEhIOm1tOnNzIGZvcm1hdOydmCBzdHJpbmdcbiAgICAgICAgICAgIFByb3BUeXBlcy5vYmplY3QgICAgICAgICAgICAgICAgLy8gRGF0ZVxuICAgICAgICBdKSxcbiAgICAgICAgZW5kRGF0ZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLCAgICAgICAgICAgICAgIC8vIFlZWVktTU0tREQgSEg6bW06c3MgZm9ybWF07J2YIHN0cmluZ1xuICAgICAgICAgICAgUHJvcFR5cGVzLm9iamVjdCAgICAgICAgICAgICAgICAvLyBEYXRlXG4gICAgICAgIF0pLFxuICAgICAgICBkaXNhYmxlZDogUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIHRpbWVQaWNrZXI6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIGluaXQ6IFByb3BUeXBlcy5mdW5jXG4gICAgfSxcbiAgICBpZDogJycsXG4gICAgLy8tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLVxuICAgIC8vIGFwaVxuICAgIGdldFN0YXJ0RGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRlID0gdGhpcy5zdGFydFBpY2tlci52YWx1ZSgpOyAgICAgICAgLy8gRGF0ZSDqsJ3ssrQg66as7YS07ZWoXG4gICAgICAgIC8vY29uc29sZS5sb2coZGF0ZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2codHlwZW9mIGRhdGUpO1xuICAgICAgICByZXR1cm4gRGF0ZVV0aWwuZ2V0RGF0ZVRvU3RyaW5nKGRhdGUpOyAgICAgIC8vIFlZWVktTU0tREQgSEg6bW06c3MgZm9ybWF07J2YIHN0cmluZ1xuICAgIH0sXG4gICAgZ2V0RW5kRGF0ZTogZnVuY3Rpb24oKSB7XG4gICAgICAgIHZhciBkYXRlID0gdGhpcy5lbmRQaWNrZXIudmFsdWUoKTsgICAgICAgICAgLy8gRGF0ZSDqsJ3ssrQg66as7YS07ZWoXG4gICAgICAgIHJldHVybiBEYXRlVXRpbC5nZXREYXRlVG9TdHJpbmcoZGF0ZSk7ICAgICAgLy8gWVlZWS1NTS1ERCBISDptbTpzcyBmb3JtYXTsnZggc3RyaW5nXG4gICAgfSxcbiAgICBzZXRTdGFydERhdGU6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgLy8gWVlZWS1NTS1ERCBISDptbTpzcyBmb3JtYXTsnZggc3RyaW5nXG4gICAgICAgIGlmKHR5cGVvZiBkYXRlID09PSAnc3RyaW5nJyB8fCB0eXBlb2YgZGF0ZS5nZXRNb250aCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5zdGFydFBpY2tlci52YWx1ZShkYXRlKTtcbiAgICAgICAgICAgIHRoaXMub25TdGFydENoYW5nZShkYXRlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0RW5kRGF0ZTogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICAvLyBZWVlZLU1NLUREIEhIOm1tOnNzIGZvcm1hdOydmCBzdHJpbmdcbiAgICAgICAgaWYodHlwZW9mIGRhdGUgPT09ICdzdHJpbmcnIHx8IHR5cGVvZiBkYXRlLmdldE1vbnRoID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLmVuZFBpY2tlci52YWx1ZShkYXRlKTtcbiAgICAgICAgICAgIHRoaXMub25FbmRDaGFuZ2UoZGF0ZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGVuYWJsZTogZnVuY3Rpb24oYikge1xuICAgICAgICBpZih0eXBlb2YgYiA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGIgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHRoaXMuc3RhcnRQaWNrZXIuZW5hYmxlKGIpO1xuICAgICAgICB0aGlzLmVuZFBpY2tlci5lbmFibGUoYik7XG4gICAgfSxcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgb25TdGFydEluaXQ6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgdGhpcy5zdGFydFBpY2tlciA9IGRhdGEuZGF0ZVBpY2tlcjtcbiAgICB9LFxuICAgIG9uRW5kSW5pdDogZnVuY3Rpb24oZGF0YSkge1xuICAgICAgICB0aGlzLmVuZFBpY2tlciA9IGRhdGEuZGF0ZVBpY2tlcjtcbiAgICB9LFxuICAgIG9uU3RhcnRDaGFuZ2U6IGZ1bmN0aW9uKGRhdGUpIHtcbiAgICAgICAgdGhpcy5lbmRQaWNrZXIubWluKGRhdGUpO1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNoYW5nZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZSh0aGlzLmdldFN0YXJ0RGF0ZSgpLCB0aGlzLmdldEVuZERhdGUoKSk7XG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgIC8vdmFyIHN0YXJ0RGF0ZSA9IHRoaXMuc3RhcnRQaWNrZXIudmFsdWUoKSxcbiAgICAgICAgLy8gICAgZW5kRGF0ZSA9IHRoaXMuZW5kUGlja2VyLnZhbHVlKCk7XG4gICAgICAgIC8vXG4gICAgICAgIC8vaWYgKHN0YXJ0RGF0ZSkge1xuICAgICAgICAvLyAgICB0aGlzLmVuZFBpY2tlci5taW4oc3RhcnREYXRlKTtcbiAgICAgICAgLy99IGVsc2UgaWYgKGVuZERhdGUpIHtcbiAgICAgICAgLy8gICAgdGhpcy5zdGFydFBpY2tlci5tYXgoZW5kRGF0ZSk7XG4gICAgICAgIC8vfSBlbHNlIHtcbiAgICAgICAgLy8gICAgZW5kRGF0ZSA9IG5ldyBEYXRlKCk7XG4gICAgICAgIC8vICAgIHN0YXJ0Lm1heChlbmREYXRlKTtcbiAgICAgICAgLy8gICAgZW5kLm1pbihlbmREYXRlKTtcbiAgICAgICAgLy99XG4gICAgfSxcbiAgICBvbkVuZENoYW5nZTogZnVuY3Rpb24oZGF0ZSkge1xuICAgICAgICB0aGlzLnN0YXJ0UGlja2VyLm1heChkYXRlKTtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UodGhpcy5nZXRTdGFydERhdGUoKSwgdGhpcy5nZXRFbmREYXRlKCkpO1xuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgc2V0U3RhdGVPYmplY3Q6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgICAgIC8vIHN0YXJ0RGF0ZSDsspjrpqxcbiAgICAgICAgbGV0IHN0YXJ0RGF0ZSA9IHByb3BzLnN0YXJ0RGF0ZTtcblxuICAgICAgICAvLyBlbmREYXRlIOyymOumrFxuICAgICAgICBsZXQgZW5kRGF0ZSA9IHByb3BzLmVuZERhdGU7XG5cbiAgICAgICAgLy8gZGlzYWJsZWQg7LKY66asXG4gICAgICAgIGxldCBkaXNhYmxlZCA9IHByb3BzLmRpc2FibGVkO1xuICAgICAgICBpZih0eXBlb2YgZGlzYWJsZWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBkaXNhYmxlZCA9IGZhbHNlO1xuICAgICAgICB9XG5cbiAgICAgICAgcmV0dXJuIHtcbiAgICAgICAgICAgIHN0YXJ0RGF0ZTogc3RhcnREYXRlLFxuICAgICAgICAgICAgZW5kRGF0ZTogZW5kRGF0ZSxcbiAgICAgICAgICAgIGRpc2FibGVkOiBkaXNhYmxlZFxuICAgICAgICB9O1xuICAgIH0sXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG4gICAgICAgIC8vIOu2gOuqqCDsu7Ttj6zrhIztirjsl5DshJwgcHJvcOydtCDrhJjslrTsmKTsp4Ag7JWK7J2AIOqyveyasCAoaW4g7Jew7IKw7J6Q66GcIO2ZleyduCkg66ek7ZWR7J2YIOqwkuydtCB0aGlzLnByb3Bz7JeQIOyEpOygleuQnOuLpC5cbiAgICAgICAgcmV0dXJuIHtzdGFydE5hbWU6ICdzdGFydERhdGUnLCBlbmROYW1lOiAnZW5kRGF0ZSd9O1xuICAgIH0sXG4gICAgZ2V0SW5pdGlhbFN0YXRlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOuniOyatO2KuOuQmOq4sCDsoIQgKO2VnOuyiCDtmLjstpwpIC8g66as7YS06rCS7J2AIHRoaXMuc3RhdGXsnZgg7LSI6riw6rCS7Jy866GcIOyCrOyaqVxuICAgICAgICByZXR1cm4gdGhpcy5zZXRTdGF0ZU9iamVjdCh0aGlzLnByb3BzKTtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIHRoaXMuc3RhcnRQaWNrZXIubWF4KHRoaXMuZW5kUGlja2VyLnZhbHVlKCkpO1xuICAgICAgICB0aGlzLmVuZFBpY2tlci5taW4odGhpcy5zdGFydFBpY2tlci52YWx1ZSgpKTtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5pbml0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICAgICAgZGF0YS5zdGFydFBpY2tlciA9IHRoaXMuc3RhcnRQaWNrZXI7XG4gICAgICAgICAgICBkYXRhLmVuZFBpY2tlciA9IHRoaXMuZW5kUGlja2VyO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5pbml0KGRhdGEpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBjb21wb25lbnRXaWxsUmVjZWl2ZVByb3BzOiBmdW5jdGlvbihuZXh0UHJvcHMpIHtcbiAgICAgICAgLy8g7Lu07Y+s64SM7Yq46rCAIOyDiOuhnOyatCBwcm9wc+ulvCDrsJvsnYQg65WMIO2YuOy2nCjstZzstIgg66CM642U66eBIOyLnOyXkOuKlCDtmLjstpzrkJjsp4Ag7JWK7J2MKVxuICAgICAgICB0aGlzLnNldFN0YXRlKHRoaXMuc2V0U3RhdGVPYmplY3QobmV4dFByb3BzKSk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIGNvbnN0IHtjbGFzc05hbWUsIHN0YXJ0TmFtZSwgZW5kTmFtZSwgdGltZVBpY2tlcn0gPSB0aGlzLnByb3BzO1xuICAgICAgICBjb25zdCB7c3RhcnREYXRlLCBlbmREYXRlLCBkaXNhYmxlZH0gPSB0aGlzLnN0YXRlO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGNsYXNzTmFtZT1cImRhdGVwaWNrZXItZ3JvdXBcIj5cbiAgICAgICAgICAgICAgICA8UHVmLkRhdGVQaWNrZXIgY2xhc3NOYW1lPXtjbGFzc05hbWV9IG5hbWU9e3N0YXJ0TmFtZX0gZGF0ZT17c3RhcnREYXRlfSBpbml0PXt0aGlzLm9uU3RhcnRJbml0fSBvbkNoYW5nZT17dGhpcy5vblN0YXJ0Q2hhbmdlfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB0aW1lUGlja2VyPXt0aW1lUGlja2VyfSBkaXNhYmxlZD17ZGlzYWJsZWR9IC8+eydcXHUwMEEwJ31cbiAgICAgICAgICAgICAgICA8UHVmLkRhdGVQaWNrZXIgY2xhc3NOYW1lPXtjbGFzc05hbWV9IG5hbWU9e2VuZE5hbWV9IGRhdGU9e2VuZERhdGV9IGluaXQ9e3RoaXMub25FbmRJbml0fSBvbkNoYW5nZT17dGhpcy5vbkVuZENoYW5nZX1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgdGltZVBpY2tlcj17dGltZVBpY2tlcn0gZGlzYWJsZWQ9e2Rpc2FibGVkfSAvPlxuICAgICAgICAgICAgPC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRGF0ZVJhbmdlUGlja2VyOyIsIi8qKlxuICogRHJvcERvd25MaXN0IGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDUvMDNcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdWYuRHJvcERvd25MaXN0IG9wdGlvbnM9e29wdGlvbnN9IC8+XG4gKlxuICogS2VuZG8gRHJvcERvd25MaXN0IOudvOydtOu4jOufrOumrOyXkCDsooXsho3soIHsnbTri6QuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIERyb3BEb3duTGlzdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ0Ryb3BEb3duTGlzdCcsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIHVybDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgbWV0aG9kOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKSxcbiAgICAgICAgb3B0aW9uTGFiZWw6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGRhdGFUZXh0RmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGRhdGFWYWx1ZUZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBzZWxlY3RlZEl0ZW06IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIHNlbGVjdGVkVmFsdWU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIFByb3BUeXBlcy5udW1iZXJcbiAgICAgICAgXSksXG4gICAgICAgIHNlbGVjdGVkSW5kZXg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgICAgIGhlYWRlclRlbXBsYXRlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB2YWx1ZVRlbXBsYXRlOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB0ZW1wbGF0ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgZGlzYWJsZWQ6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICBvblNlbGVjdDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25DbG9zZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uT3BlbjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRmlsdGVyaW5nOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25EYXRhQm91bmQ6IFByb3BUeXBlcy5mdW5jXG4gICAgfSxcbiAgICBpZDogJycsXG4gICAgb3BlbjogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMuZHJvcGRvd25saXN0Lm9wZW4oKTtcbiAgICB9LFxuICAgIGNsb3NlOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy5kcm9wZG93bmxpc3QuY2xvc2UoKTtcbiAgICB9LFxuICAgIHNlbGVjdDogZnVuY3Rpb24oaW5kZXgpIHtcbiAgICAgICAgdGhpcy5kcm9wZG93bmxpc3Quc2VsZWN0KGluZGV4KTtcbiAgICB9LFxuICAgIHZhbHVlOiBmdW5jdGlvbih2YWx1ZSkge1xuICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdC52YWx1ZSh2YWx1ZSk7XG4gICAgfSxcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gYXBpXG5cbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gZXZlbnRcbiAgICBvblNlbGVjdDogZnVuY3Rpb24oZSkge1xuICAgIFx0Ly9jb25zb2xlLmxvZygnb25TZWxlY3QnKTtcbiAgICBcdC8vY29uc29sZS5sb2coZXZlbnQpO1xuICAgICAgICB2YXIgZHJvcGRvd25saXN0ID0gdGhpcy4kZHJvcERvd25MaXN0LmRhdGEoJ2tlbmRvRHJvcERvd25MaXN0JyksXG4gICAgICAgICAgICBkYXRhSXRlbSA9IGRyb3Bkb3dubGlzdC5kYXRhSXRlbShlLml0ZW0pO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGFJdGVtKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhkYXRhSXRlbVt0aGlzLnByb3BzLmRhdGFWYWx1ZUZpZWxkXSk7XG4gICAgICAgIC8vJCgnW25hbWU9JyArIHRoaXMucHJvcHMubmFtZSArICddJykudmFsKGRhdGFJdGVtLnZhbHVlKTtcbiAgICAgICAgLy8kKCdpbnB1dFtuYW1lPWRpc3BsYXlEYXRhXScpLnZhbChkYXRhSXRlbVt0aGlzLnByb3BzLmRhdGFWYWx1ZUZpZWxkXSk7XG4gICAgICAgIC8vdGhpcy4kZHJvcERvd25MaXN0LnZhbChkYXRhSXRlbVt0aGlzLnByb3BzLmRhdGFWYWx1ZUZpZWxkXSk7XG5cbiAgICBcdGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uU2VsZWN0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtID0gZGF0YUl0ZW0sXG4gICAgICAgICAgICAgICAgc2VsZWN0ZWRWYWx1ZSA9IGRhdGFJdGVtW3RoaXMucHJvcHMuZGF0YVZhbHVlRmllbGRdO1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdChlLCBzZWxlY3RlZEl0ZW0sIHNlbGVjdGVkVmFsdWUpO1xuXG4gICAgICAgICAgICAvL2Uuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgXHQvL2NvbnNvbGUubG9nKCdvbkNoYW5nZScpO1xuICAgIFx0Ly9jb25zb2xlLmxvZyhldmVudCk7XG4gICAgXHRcbiAgICBcdGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGUpO1xuXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsb3NlOiBmdW5jdGlvbihlKSB7XG4gICAgXHQvL2NvbnNvbGUubG9nKCdvbkNsb3NlJyk7XG4gICAgXHQvL2NvbnNvbGUubG9nKGV2ZW50KTtcbiAgICBcdFxuICAgIFx0aWYodHlwZW9mIHRoaXMucHJvcHMub25DbG9zZSA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNsb3NlKGUpO1xuXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbk9wZW46IGZ1bmN0aW9uKGUpIHtcbiAgICBcdC8vY29uc29sZS5sb2coJ29uT3BlbicpO1xuICAgIFx0Ly9jb25zb2xlLmxvZyhldmVudCk7XG4gICAgXHRcbiAgICBcdGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uT3BlbiA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbk9wZW4oZSk7XG5cbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRmlsdGVyaW5nOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25GaWx0ZXJpbmcgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRmlsdGVyaW5nKGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkRhdGFCb3VuZDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICBcdC8vY29uc29sZS5sb2coJ29uRGF0YUJvdW5kJyk7XG4gICAgXHQvL2NvbnNvbGUubG9nKGV2ZW50KTtcbiAgICBcdFxuICAgIFx0aWYodHlwZW9mIHRoaXMucHJvcHMub25EYXRhQm91bmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25EYXRhQm91bmQoZXZlbnQpO1xuXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBnZXRPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3Qge3VybCwgbWV0aG9kLCBpdGVtcywgc2VsZWN0ZWRJbmRleCwgc2VsZWN0ZWRWYWx1ZSwgZGF0YVRleHRGaWVsZCwgZGF0YVZhbHVlRmllbGQsIGhlYWRlclRlbXBsYXRlLCB2YWx1ZVRlbXBsYXRlLCB0ZW1wbGF0ZSB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGRhdGFUZXh0RmllbGQ6IGRhdGFUZXh0RmllbGQsXG4gICAgICAgICAgICBkYXRhVmFsdWVGaWVsZDogZGF0YVZhbHVlRmllbGQsXG4gICAgICAgICAgICBkYXRhU291cmNlOiBbXVxuICAgICAgICB9O1xuXG4gICAgICAgIC8vIGRhdGFTb3VyY2VcbiAgICAgICAgLy8gdXJsXG4gICAgICAgIGlmKHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IGRhdGFTb3VyY2U6IHtcbiAgICAgICAgICAgICAgICB0cmFuc3BvcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nXG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9IH0pO1xuXG4gICAgICAgIH1lbHNlIGlmKHR5cGVvZiBpdGVtcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgZGF0YVNvdXJjZTogaXRlbXMgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBzZWxlY3RlZEluZGV4XG4gICAgICAgIGlmKHR5cGVvZiBzZWxlY3RlZEluZGV4ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBpbmRleDogc2VsZWN0ZWRJbmRleCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHNlbGVjdGVkVmFsdWVcbiAgICAgICAgaWYodHlwZW9mIHNlbGVjdGVkVmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IHZhbHVlOiBzZWxlY3RlZFZhbHVlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGVhZGVyVGVtcGxhdGVcbiAgICAgICAgaWYodHlwZW9mIGhlYWRlclRlbXBsYXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBoZWFkZXJUZW1wbGF0ZTogaGVhZGVyVGVtcGxhdGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyB2YWx1ZVRlbXBsYXRlXG4gICAgICAgIGlmKHR5cGVvZiB2YWx1ZVRlbXBsYXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyB2YWx1ZVRlbXBsYXRlOiB2YWx1ZVRlbXBsYXRlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGVtcGxhdGVcbiAgICAgICAgaWYodHlwZW9mIHRlbXBsYXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyB0ZW1wbGF0ZTogdGVtcGxhdGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9LFxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG5cdFx0Ly8g67aA66qoIOy7tO2PrOuEjO2KuOyXkOyEnCBwcm9w7J20IOuEmOyWtOyYpOyngCDslYrsnYAg6rK97JqwIChpbiDsl7DsgrDsnpDroZwg7ZmV7J24KSDrp6TtlZHsnZgg6rCS7J20IHRoaXMucHJvcHPsl5Ag7ISk7KCV65Cc64ukLlx0XHRcblx0XHRyZXR1cm4ge3dpZHRoOiAnMTAwJScsIGRhdGFUZXh0RmllbGQ6ICd0ZXh0JywgZGF0YVZhbHVlRmllbGQ6ICd2YWx1ZScsIHNlbGVjdGVkSW5kZXg6IDB9O1xuXHR9LFxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKSAgICAgIFxuICAgICAgICBsZXQgaWQgPSB0aGlzLnByb3BzLmlkO1xuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcbiAgICBcdHRoaXMuJGRyb3BEb3duTGlzdCA9ICQoJyMnK3RoaXMuaWQpO1xuICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdCA9IHRoaXMuJGRyb3BEb3duTGlzdC5rZW5kb0Ryb3BEb3duTGlzdCh0aGlzLmdldE9wdGlvbnMoKSkuZGF0YSgna2VuZG9Ecm9wRG93bkxpc3QnKTtcblxuICAgICAgICAvLyBFdmVudHNcbiAgICAgICAgdGhpcy5kcm9wZG93bmxpc3QuYmluZCgnc2VsZWN0JywgdGhpcy5vblNlbGVjdCk7XG4gICAgICAgIHRoaXMuZHJvcGRvd25saXN0LmJpbmQoJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UpO1xuICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdC5iaW5kKCdvcGVuJywgdGhpcy5vbk9wZW4pO1xuICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdC5iaW5kKCdjbG9zZScsIHRoaXMub25DbG9zZSk7XG4gICAgICAgIHRoaXMuZHJvcGRvd25saXN0LmJpbmQoJ2ZpbHRlcmluZycsIHRoaXMub25GaWx0ZXJpbmcpO1xuICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdC5iaW5kKCdkYXRhQm91bmQnLCB0aGlzLm9uRGF0YUJvdW5kKTtcblxuICAgICAgICAvLyBkcm9wZG93bmxpc3Qg7LSI6riwIOyEoO2DnSAoZ2V0T3B0aW9ucygpIOyXkOyEnCDsspjrpqwpXG4gICAgICAgIC8qXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLnNlbGVjdGVkVmFsdWUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdC52YWx1ZSh0aGlzLnByb3BzLnNlbGVjdGVkVmFsdWUpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICB0aGlzLmRyb3Bkb3dubGlzdC5zZWxlY3QoMCk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cblxuICAgICAgICAvKlxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5pbml0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICAgICAgZGF0YS4kZHJvcERvd25MaXN0ID0gdGhpcy4kZHJvcERvd25MaXN0O1xuICAgICAgICAgICAgZGF0YS5kcm9wZG93bmxpc3QgPSB0aGlzLmRyb3Bkb3dubGlzdDtcbiAgICAgICAgICAgIHRoaXMucHJvcHMuaW5pdChkYXRhKTtcbiAgICAgICAgfVxuICAgICAgICAqL1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbFJlY2VpdmVQcm9wczogZnVuY3Rpb24obmV4dFByb3BzKSB7XG4gICAgICAgIC8vIOy7tO2PrOuEjO2KuOqwgCDsg4jroZzsmrQgcHJvcHPrpbwg67Cb7J2EIOuVjCDtmLjstpwo7LWc7LSIIOugjOuNlOungSDsi5zsl5DripQg7Zi47Lac65CY7KeAIOyViuydjClcbiAgICAgICAgaWYodHlwZW9mIG5leHRQcm9wcy5zZWxlY3RlZFZhbHVlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5kcm9wZG93bmxpc3QudmFsdWUobmV4dFByb3BzLnNlbGVjdGVkVmFsdWUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpICAgICAgIFxuICAgICAgICBjb25zdCB7Y2xhc3NOYW1lLCBuYW1lLCB3aWR0aH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgIFx0PGlucHV0IGlkPXt0aGlzLmlkfSBuYW1lPXtuYW1lfSBzdHlsZT17e3dpZHRoOiB3aWR0aH19IC8+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gRHJvcERvd25MaXN0OyIsIi8qKlxuICogR3JpZCBjb21wb25lbnRcbiAqXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzA0LzE3XG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxuICpcbiAqIGV4YW1wbGU6XG4gKiA8UHVmLkdyaWQgb3B0aW9ucz17b3B0aW9uc30gLz5cbiAqXG4gKiBLZW5kbyBHcmlkIOudvOydtOu4jOufrOumrOyXkCDsooXsho3soIHsnbTri6QuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIEdyaWQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdHcmlkJyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgaG9zdDogUHJvcFR5cGVzLnN0cmluZywgLy8g7ISc67KEIOygleuztChDcm9zcyBCcm93c2VyIEFjY2VzcylcbiAgICAgICAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBtZXRob2Q6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNoZWNrYm94RmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGRhdGE6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIGNvbHVtbnM6IFByb3BUeXBlcy5hcnJheSxcbiAgICAgICAgc2VsZWN0ZWRJZHM6IFByb3BUeXBlcy5hcnJheSxcbiAgICAgICAgbGlzdEZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB0b3RhbEZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjaGVja0ZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBvblNlbGVjdFJvdzogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgcmVzaXphYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgZmlsdGVyYWJsZTogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgICAgIFByb3BUeXBlcy5vYmplY3RcbiAgICAgICAgXSksXG4gICAgICAgIHNvcnRhYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgcGFnZWFibGU6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgICAgICBQcm9wVHlwZXMub2JqZWN0XG4gICAgICAgIF0pLFxuICAgICAgICBwYWdlU2l6ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgaGVpZ2h0OiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyXG4gICAgICAgIF0pLFxuXG4gICAgICAgIC8qXG4gICAgICAgICAgR3JpZCBzZWxlY3RhYmxlIOyEpOygleqwklxuICAgICAgICAgIFwicm93XCIgLSB0aGUgdXNlciBjYW4gc2VsZWN0IGEgc2luZ2xlIHJvdy5cbiAgICAgICAgICBcImNlbGxcIiAtIHRoZSB1c2VyIGNhbiBzZWxlY3QgYSBzaW5nbGUgY2VsbC5cbiAgICAgICAgICBcIm11bHRpcGxlLCByb3dcIiAtIHRoZSB1c2VyIGNhbiBzZWxlY3QgbXVsdGlwbGUgcm93cy5cbiAgICAgICAgICBcIm11bHRpcGxlLCBjZWxsXCIgLSB0aGUgdXNlciBjYW4gc2VsZWN0IG11bHRpcGxlIGNlbGxzLlxuICAgICAgICAqL1xuICAgICAgICBzZWxlY3RNb2RlOiBQcm9wVHlwZXMub25lT2YoWydyb3cnLCdjZWxsJ10pLCAvLyBHcmlkIFNlbGVjdCBSb3cg65iQ64qUIENlbGwg7ISg7YOdXG4gICAgICAgIG11bHRpcGxlOiBQcm9wVHlwZXMuYm9vbCwgICAvLyDshYDroIntirggbXVsdGlwbGUg7KeA7JuQXG4gICAgICAgIC8qXG4gICAgICAgICAgR3JpZCBwYXJhbWV0ZXJNYXBGaWVsZCDshKTsoJXqsJJcbiAgICAgICAgICBza2lwOiBcInN0YXJ0XCIsIC0gcGFnaW5nIHNraXAg67OA7IiYIOyeheugpeuQnCDqsJIoa2V5KeycvOuhnCDrs7XsoJxcbiAgICAgICAgICB0YWtlOiBcImxpbWl0XCIsIC0gcGFnaW5nIGxpbWl0IOuzgOyImCDsnoXroKXrkJwg6rCSKGtleSnsnLzroZwg67O17KCcXG4gICAgICAgICAgY29udmVydFNvcnQ6IHRydWUsIC0gc29ydCBwYXJhbWV0ZXIg67O17KCcIOyXrOu2gFxuICAgICAgICAgIGZpZWxkOlwicHJvcGVydHlcIiwgIC0gc29ydCBmaWVsZCDrs4DsiJgg7J6F66Cl65CcIOqwkihrZXkp7Jy866GcIOuzteygnFxuICAgICAgICAgIGRpcjogXCJkaXJlY3Rpb25cIiwgIC0gc29ydCBkaXIg67OA7IiYIOyeheugpeuQnCDqsJIoa2V5KeycvOuhnCDrs7XsoJxcbiAgICAgICAgICBmaWx0ZXJzVG9Kc29uOiB0cnVlLCAgICAgIC0gZmlsdGVyIOygleuztOulvCBqc29u7Jy866GcIOuzgO2ZmO2VtOyEnCDsnbzrsJgg7YyM652866+47YSwIOyymOufvCDsspjrpqxcbiAgICAgICAgICBmaWx0ZXJQcmVmaXg6IFwic2VhcmNoX1wiLCAgLSBmaWx0ZXIganNvbuycvOuhnCDrs4DtmZjsi5wgcHJlZml46rCAIO2VhOyalO2VnCDqsr3smrAgcHJlZml466W8IOu2meyXrOyEnCDrsJjtmZhcbiAgICAgICAgICBmaWx0ZXJGaWVsZFRvTG93ZXJDYXNlOiB0cnVlICAtIGZpbHRlcuydmCBmaWVsZOulvCBsb3dlckNhc2Uo7IaM66y47J6QKeuhnCDrsJjtmZhcbiAgICAgICAgKi9cbiAgICAgICAgcGFyYW1ldGVyTWFwRmllbGQ6IFByb3BUeXBlcy5vYmplY3QsICAvLyBQYXJhbWV0ZXIgQ29udHJvbCDqsJ3ssrQo642w7J207YSwIOuzteyCrCwg7ZWE7YSw7LKY66asLCBTb3J0aW5nIO2MjOumrOuvuO2EsCDsoJXsnZgg65OxKVxuICAgICAgICBzY3JvbGxhYmxlOiBQcm9wVHlwZXMuYm9vbCAvLyDsoozsmrAg7Iqk7YGs66GkIOyDneyEsVxuICAgIH0sXG4gICAgaWQ6ICcnLFxuICAgICRncmlkOiB1bmRlZmluZWQsXG4gICAgY2hlY2tlZElkczoge30sXG4gICAgY2hlY2tlZEl0ZW1zOiB7fSxcbiAgICAvKlxuICAgICogR3JpZCBDaGFuZ2UgRXZlbnQoU2VsZWN0IEV2ZW50KSwgZGF0YVNldOycvOuhnCDsoJXsnZjtlZjsl6wg67Cb64qU64ukLlxuICAgICogcm93SW5kZXhcbiAgICAqIGNlbGxJbmRleFxuICAgICogZGF0YVxuICAgICogcm93c1xuICAgICovXG4gICAgb25DaGFuZ2U6IGZ1bmN0aW9uKCkge1xuICAgICAgICBsZXQgZ3JpZCA9IHRoaXMuZ3JpZDtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25DaGFuZ2UgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIC8vdmFyIGRhdGEgPSBldmVudC5ub2RlO1xuICAgICAgICAgICAgbGV0IGRhdGFTZXQgPSB7fTtcbiAgICAgICAgICAgIGlmKHRoaXMucHJvcHMuc2VsZWN0TW9kZSA9PT0gXCJjZWxsXCIpe1xuICAgICAgICAgICAgICAgIGxldCByb3cgPSAkKGdyaWQuc2VsZWN0KCkpLmNsb3Nlc3QoXCJ0clwiKTtcbiAgICAgICAgICAgICAgICBsZXQgY2VsbCA9IGdyaWQuc2VsZWN0KCk7XG4gICAgICAgICAgICAgICAgbGV0IGNlbGxUZXh0ID0gJChjZWxsKS50ZXh0KCk7XG4gICAgICAgICAgICAgICAgZGF0YVNldC5yb3dJbmRleCA9ICQoXCJ0clwiLCBncmlkLnRib2R5KS5pbmRleChyb3cpO1xuICAgICAgICAgICAgICAgIGRhdGFTZXQuY2VsbEluZGV4ID0gZ3JpZC5jZWxsSW5kZXgoY2VsbCk7XG4gICAgICAgICAgICAgICAgZGF0YVNldC5kYXRhID0gJChjZWxsKS50ZXh0KCk7XG4gICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICBsZXQgcm93cyA9IGdyaWQuc2VsZWN0KCk7XG5cbiAgICAgICAgICAgICAgICBpZihyb3dzLmxlbmd0aCA+IDEpe1xuICAgICAgICAgICAgICAgICAgICBsZXQgcm93c0RhdGEgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgcm93cy5lYWNoKGZ1bmN0aW9uICgpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHJvd3NEYXRhLnB1c2goZ3JpZC5kYXRhSXRlbSgkKHRoaXMpKSk7XG4gICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICBkYXRhU2V0LnJvd3MgPSByb3dzO1xuICAgICAgICAgICAgICAgICAgICBkYXRhU2V0LmRhdGEgPSByb3dzRGF0YTtcbiAgICAgICAgICAgICAgICB9ZWxzZXtcbiAgICAgICAgICAgICAgICAgICAgZGF0YVNldC5yb3dzID0gcm93cztcbiAgICAgICAgICAgICAgICAgICAgZGF0YVNldC5kYXRhID0gZ3JpZC5kYXRhSXRlbShyb3dzKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGRhdGFTZXQpO1xuICAgICAgICB9XG4gICAgfSxcblxuICAgIHNldFNlbGVjdGVkSWRzOiBmdW5jdGlvbihwcm9wcykge1xuICAgICAgICBjb25zdCB7Y2hlY2tGaWVsZCwgc2VsZWN0ZWRJZHN9ID0gcHJvcHM7XG5cbiAgICAgICAgaWYoc2VsZWN0ZWRJZHMgIT09IG51bGwgJiYgdHlwZW9mIHNlbGVjdGVkSWRzICE9PSAndW5kZWZpbmVkJyAmJiBzZWxlY3RlZElkcy5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICB2YXIgcm93cyA9IHRoaXMuZ3JpZC50YWJsZS5maW5kKCd0cicpLmZpbmQoJ3RkOmZpcnN0IGlucHV0JykuY2xvc2VzdCgndHInKSxcbiAgICAgICAgICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgICAgIHJvd3MuZWFjaChmdW5jdGlvbihpbmRleCwgcm93KSB7XG4gICAgICAgICAgICAgICAgdmFyICRjaGVja2JveCA9ICQocm93KS5maW5kKCdpbnB1dDpjaGVja2JveC5jaGVja2JveCcpLFxuICAgICAgICAgICAgICAgICAgICBkYXRhSXRlbSA9IF90aGlzLmdyaWQuZGF0YUl0ZW0ocm93KSxcbiAgICAgICAgICAgICAgICAgICAgY2hlY2tlZCA9IGZhbHNlO1xuXG4gICAgICAgICAgICAgICAgZm9yKHZhciBpPTA7IGk8c2VsZWN0ZWRJZHMubGVuZ3RoOyBpKyspIHtcblxuICAgICAgICAgICAgICAgICAgICBpZihjaGVja0ZpZWxkICE9PSBudWxsICYmIHR5cGVvZiBjaGVja0ZpZWxkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoZGF0YUl0ZW1bY2hlY2tGaWVsZF0gPT0gc2VsZWN0ZWRJZHNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZigkY2hlY2tib3gudmFsKCkgPT0gc2VsZWN0ZWRJZHNbaV0pIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBjaGVja2VkID0gdHJ1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICRjaGVja2JveC5hdHRyKCdjaGVja2VkJywgY2hlY2tlZCk7XG4gICAgICAgICAgICAgICAgX3RoaXMuc2VsZWN0Q2hlY2tib3goJGNoZWNrYm94LCBjaGVja2VkLCAkKHJvdykpO1xuICAgICAgICAgICAgfSk7XG4gICAgICAgIH1cblxuICAgIH0sXG4gICAgb25TZWxlY3RSb3c6IGZ1bmN0aW9uKGV2ZW50KSB7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25TZWxlY3RSb3cgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHZhciBpZHMgPSBbXSwgaXRlbXMgPSBbXTtcbiAgICAgICAgICAgIGZvcih2YXIga2V5IGluIHRoaXMuY2hlY2tlZElkcykge1xuICAgICAgICAgICAgICAgIGlmKHRoaXMuY2hlY2tlZElkc1trZXldKSB7XG4gICAgICAgICAgICAgICAgICAgIGlkcy5wdXNoKGtleSk7XG4gICAgICAgICAgICAgICAgICAgIGl0ZW1zLnB1c2godGhpcy5jaGVja2VkSXRlbXNba2V5XSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuXG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uU2VsZWN0Um93KGV2ZW50LCBpZHMsIGl0ZW1zKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DaGVja2JveEhlYWRlcjogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIGNoZWNrZWQgPSAkKGV2ZW50LnRhcmdldCkuaXMoJzpjaGVja2VkJyk7XG5cbiAgICAgICAgdmFyIHJvd3MgPSB0aGlzLmdyaWQudGFibGUuZmluZChcInRyXCIpLmZpbmQoXCJ0ZDpmaXJzdCBpbnB1dFwiKS5jbG9zZXN0KFwidHJcIiksXG4gICAgICAgICAgICBfdGhpcyA9IHRoaXM7XG5cbiAgICAgICAgcm93cy5lYWNoKGZ1bmN0aW9uKGluZGV4LCByb3cpIHtcbiAgICAgICAgICAgIHZhciAkY2hlY2tib3ggPSAkKHJvdykuZmluZCgnaW5wdXQ6Y2hlY2tib3guY2hlY2tib3gnKTtcbiAgICAgICAgICAgICRjaGVja2JveC5hdHRyKCdjaGVja2VkJywgY2hlY2tlZCk7XG5cbiAgICAgICAgICAgIF90aGlzLnNlbGVjdENoZWNrYm94KCRjaGVja2JveCwgY2hlY2tlZCwgJChyb3cpKTtcbiAgICAgICAgfSk7XG5cbiAgICAgICAgdGhpcy5vblNlbGVjdFJvdyhldmVudCk7XG4gICAgfSxcbiAgICBvbkNoZWNrYm94Um93OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICB2YXIgY2hlY2tlZCA9IGV2ZW50LnRhcmdldC5jaGVja2VkLFxuICAgICAgICAgICAgJHJvdyA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KCd0cicpO1xuXG4gICAgICAgIHRoaXMuc2VsZWN0Q2hlY2tib3goJChldmVudC50YXJnZXQpLCBjaGVja2VkLCAkcm93KTtcbiAgICAgICAgdGhpcy5vblNlbGVjdFJvdyhldmVudCk7XG4gICAgfSxcbiAgICBzZWxlY3RDaGVja2JveDogZnVuY3Rpb24oJGNoZWNrYm94LCBjaGVja2VkLCAkcm93KSB7XG5cbiAgICAgICAgdmFyIGRhdGFJdGVtID0gdGhpcy5ncmlkLmRhdGFJdGVtKCRyb3cpO1xuXG4gICAgICAgIGlmKHRoaXMucHJvcHMuY2hlY2tGaWVsZCAhPT0gbnVsbCAmJiB0eXBlb2YgdGhpcy5wcm9wcy5jaGVja0ZpZWxkICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5jaGVja2VkSWRzW2RhdGFJdGVtW3RoaXMucHJvcHMuY2hlY2tGaWVsZF1dID0gY2hlY2tlZDtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tlZEl0ZW1zW2RhdGFJdGVtW3RoaXMucHJvcHMuY2hlY2tGaWVsZF1dID0gZGF0YUl0ZW07XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tlZElkc1skY2hlY2tib3gudmFsKCldID0gY2hlY2tlZDtcbiAgICAgICAgICAgIHRoaXMuY2hlY2tlZEl0ZW1zWyRjaGVja2JveC52YWwoKV0gPSBkYXRhSXRlbTtcbiAgICAgICAgfVxuXG4gICAgICAgIGlmKGNoZWNrZWQpIHtcbiAgICAgICAgICAgIC8vLXNlbGVjdCB0aGUgcm93XG4gICAgICAgICAgICAkcm93LmFkZENsYXNzKFwiay1zdGF0ZS1zZWxlY3RlZFwiKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgLy8tcmVtb3ZlIHNlbGVjdGlvblxuICAgICAgICAgICAgJHJvdy5yZW1vdmVDbGFzcyhcImstc3RhdGUtc2VsZWN0ZWRcIik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldENoZWNrYm94Q29sdW1uOiBmdW5jdGlvbihjaGVja2JveEZpZWxkKSB7XG4gICAgICAgIHJldHVybiB7XG4gICAgICAgICAgICBmaWVsZDogY2hlY2tib3hGaWVsZCxcbiAgICAgICAgICAgIGhlYWRlclRlbXBsYXRlOiAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3hcIiAvPicsXG4gICAgICAgICAgICAvL2hlYWRlclRlbXBsYXRlOiAnPGRpdiBjbGFzcz1cImNoZWNrYm94XCI+PGxhYmVsPjxpbnB1dCB0eXBlPVwiY2hlY2tib3hcIiAvPjwvbGFiZWw+PC9kaXY+JyxcbiAgICAgICAgICAgIGhlYWRlckF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICAnY2xhc3MnOiAndGFibGUtaGVhZGVyLWNlbGwnLFxuICAgICAgICAgICAgICAgIHN0eWxlOiAndGV4dC1hbGlnbjogY2VudGVyJ1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIHRlbXBsYXRlOiAnPGlucHV0IHR5cGU9XCJjaGVja2JveFwiIGNsYXNzPVwiY2hlY2tib3hcIiB2YWx1ZT1cIiM9JyArIGNoZWNrYm94RmllbGQgKyAnI1wiIC8+JyxcbiAgICAgICAgICAgIGF0dHJpYnV0ZXM6IHtcbiAgICAgICAgICAgICAgICBhbGlnbjogJ2NlbnRlcidcbiAgICAgICAgICAgIH0sXG4gICAgICAgICAgICB3aWR0aDogNTAsXG4gICAgICAgICAgICBzb3J0YWJsZTogZmFsc2VcbiAgICAgICAgfTtcbiAgICB9LFxuICAgIG9uRGF0YUJvdW5kOiBmdW5jdGlvbihhcmcpIHtcbiAgICAgICAgLy8gc2VsZWN0ZWQgY2hlY2tcbiAgICAgICAgdGhpcy5zZXRTZWxlY3RlZElkcyh0aGlzLnByb3BzKTtcbiAgICB9LFxuICAgIGdldERhdGFTb3VyY2U6IGZ1bmN0aW9uKHByb3BzKSB7XG4gICAgICAgIGNvbnN0IHtob3N0LCB1cmwsIG1ldGhvZCwgZGF0YSwgbGlzdEZpZWxkLCB0b3RhbEZpZWxkLCBwYWdlYWJsZSwgcGFnZVNpemUsIHBhcmFtZXRlck1hcEZpZWxkfSA9IHByb3BzO1xuXG4gICAgICAgIC8vIHBhZ2VTaXplXG4gICAgICAgIHZhciBfcGFnZVNpemUgPSAwLCBfcGFnZWFibGUgPSBmYWxzZTtcbiAgICAgICAgaWYocGFnZWFibGUpIHtcbiAgICAgICAgICAgIF9wYWdlU2l6ZSA9IHBhZ2VTaXplO1xuICAgICAgICAgICAgX3BhZ2VhYmxlID0gdHJ1ZTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGh0dHA6Ly9pdHEubmwva2VuZG8tdWktZ3JpZC13aXRoLXNlcnZlci1wYWdpbmctZmlsdGVyaW5nLWFuZC1zb3J0aW5nLXdpdGgtbXZjMy9cbiAgICAgICAgLy8gaHR0cHM6Ly9ibG9nLmxvbmdsZS5uZXQvMjAxMi8wNC8xMy90ZWxlcmlrcy1odG1sNS1rZW5kby11aS1ncmlkLXdpdGgtc2VydmVyLXNpZGUtcGFnaW5nLXNvcnRpbmctZmlsdGVyaW5nLXdpdGgtbXZjMy1lZjQtZHluYW1pYy1saW5xL1xuICAgICAgICB2YXIgZGF0YVNvdXJjZSA9IG5ldyBrZW5kby5kYXRhLkRhdGFTb3VyY2Uoe1xuICAgICAgICAgICAgdHJhbnNwb3J0OiB7XG4gICAgICAgICAgICAgICAgLypcbiAgICAgICAgICAgICAgICByZWFkOiBmdW5jdGlvbihvcHRpb25zKSB7XG4gICAgICAgICAgICAgICAgICAgICQuYWpheCh7XG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IHVybCxcbiAgICAgICAgICAgICAgICAgICAgICAgIC8vY29udGVudFR5cGU6IFwiYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOFwiLCDsnbTqsoMg7ISk7KCV7ZWY66m0IGRhdGEg7KCE7IahIOyViOuQqFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsLy9KU09OLnN0cmluZ2lmeSh7a2V5OiBcInZhbHVlXCJ9KSxcbiAgICAgICAgICAgICAgICAgICAgICAgIHN1Y2Nlc3M6IGZ1bmN0aW9uKGRhdGEpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xuXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGFyciA9IFtdLCBncmlkTGlzdCA9IGRhdGE7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYobGlzdEZpZWxkICYmIGxpc3RGaWVsZC5sZW5ndGggPiAwICYmIGxpc3RGaWVsZCAhPSAnbnVsbCcpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgYXJyID0gbGlzdEZpZWxkLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcih2YXIgaSBpbiBhcnIpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhhcnJbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBncmlkTGlzdCA9IGdyaWRMaXN0W2FycltpXV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wdGlvbnMuc3VjY2VzcyhncmlkTGlzdCk7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgLy9vcHRpb25zLnN1Y2Nlc3MoZGF0YS5yZXN1bHRWYWx1ZS5saXN0KTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICovXG4gICAgICAgICAgICAgICAgcmVhZDoge1xuICAgICAgICAgICAgICAgICAgICB1cmw6IChob3N0ICYmIGhvc3QgIT09IG51bGwgJiYgaG9zdC5sZW5ndGggPiAwKSA/IGhvc3QgKyB1cmwgOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgIHR5cGU6IG1ldGhvZCxcbiAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSwgICAgICAvLyBzZWFyY2ggKEBSZXF1ZXN0Qm9keSBHcmlkUGFyYW0gZ3JpZFBhcmFtIOuhnCDrsJvripTri6QuKVxuICAgICAgICAgICAgICAgICAgICBjb250ZW50VHlwZTogJ2FwcGxpY2F0aW9uL2pzb247IGNoYXJzZXQ9dXRmLTgnXG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICBwYXJhbWV0ZXJNYXA6IGZ1bmN0aW9uKGRhdGEsIHR5cGUpIHtcbiAgICAgICAgICAgICAgICAgICAgaWYodHlwZSA9PSBcInJlYWRcIiAmJiBwYXJhbWV0ZXJNYXBGaWVsZCAhPT0gbnVsbCl7XG4gICAgICAgICAgICAgICAgICAgIFx0Ly8g642w7J207YSwIOydveyWtOyYrOuVjCDtlYTsmpTtlZwg642w7J207YSwKGV4Ou2OmOydtOyngOq0gOugqCnqsIAg7J6I7Jy866m0IGRhdGHrpbwgY29wee2VnOuLpC5cbiAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgY29weSBpbiBwYXJhbWV0ZXJNYXBGaWVsZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYodHlwZW9mIHBhcmFtZXRlck1hcEZpZWxkW2NvcHldID09PSBcInN0cmluZ1wiICYmICggY29weSBpbiBkYXRhICkpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW3BhcmFtZXRlck1hcEZpZWxkW2NvcHldXSA9IGRhdGFbY29weV07XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gRmlsdGVyIEFycmF5ID0+IEpzb24gT2JqZWN0IENvcHlcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtZXRlck1hcEZpZWxkLmZpbHRlcnNUb0pzb24gJiYgZGF0YS5maWx0ZXIgJiYgZGF0YS5maWx0ZXIuZmlsdGVycyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpbHRlcnMgPSBkYXRhLmZpbHRlci5maWx0ZXJzO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcnMubWFwKChmaWx0ZXIpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpZWxkID0gKHBhcmFtZXRlck1hcEZpZWxkLmZpbHRlclByZWZpeCkgPyBwYXJhbWV0ZXJNYXBGaWVsZC5maWx0ZXJQcmVmaXggKyBmaWx0ZXIuZmllbGQgOiBmaWx0ZXIuZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtZXRlck1hcEZpZWxkLmZpbHRlckZpZWxkVG9Mb3dlckNhc2Upe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtmaWVsZC50b0xvd2VyQ2FzZSgpXSA9IGZpbHRlci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ZpZWxkXSA9IGZpbHRlci52YWx1ZTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgLy8gU29ydCBBcnJheSA9PiBGaWVsZCwgRGlyIENvbnZlcnRcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtZXRlck1hcEZpZWxkLmNvbnZlcnRTb3J0ICYmIGRhdGEuc29ydCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YS5zb3J0Lm1hcCgoc29ydERhdGEpID0+e1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihcImZpZWxkXCIgaW4gcGFyYW1ldGVyTWFwRmllbGQpe1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgc29ydERhdGFbcGFyYW1ldGVyTWFwRmllbGQuZmllbGRdID0gc29ydERhdGEuZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgaWYoXCJkaXJcIiBpbiBwYXJhbWV0ZXJNYXBGaWVsZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBzb3J0RGF0YVtwYXJhbWV0ZXJNYXBGaWVsZC5kaXJdID0gc29ydERhdGEuZGlyO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAvL2NvbnNvbGUubG9nKGRhdGEpO1xuICAgICAgICAgICAgICAgICAgICAvLyBwYWdpbmcg7LKY66as7IucIOyEnOuyhOuhnCDrs7TrgrTsp4DripQg6re466as65OcIOq0gOugqCDrjbDsnbTthLAge3Rha2U6IDIwLCBza2lwOiAwLCBwYWdlOiAxLCBwYWdlU2l6ZTogMjB9XG4gICAgICAgICAgICAgICAgICAgIC8vIG5vIHBhZ2luZyDsspjrpqzsi5zsl5DripQge30g7J2EIOyEnOuyhOuhnCDrs7Trgrjri6QuXG4gICAgICAgICAgICAgICAgICAgIC8vIEBSZXF1ZXN0Qm9keSBHcmlkUGFyYW0gZ3JpZFBhcmFtIOuhnCDrsJvripTri6QuXG4gICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgLy8gcmV0dXJuZWQgaW4gdGhlIFwibGlzdEZpZWxkXCIgZmllbGQgb2YgdGhlIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgZGF0YTogZnVuY3Rpb24ocmVzcG9uc2UpIHtcbiAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhyZXNwb25zZSk7XG4gICAgICAgICAgICAgICAgICAgIHZhciBhcnIgPSBbXSwgZ3JpZExpc3QgPSByZXNwb25zZTtcblxuICAgICAgICAgICAgICAgICAgICBpZihsaXN0RmllbGQgJiYgbGlzdEZpZWxkLmxlbmd0aCA+IDAgJiYgbGlzdEZpZWxkICE9ICdudWxsJykge1xuICAgICAgICAgICAgICAgICAgICAgICAgYXJyID0gbGlzdEZpZWxkLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpIGluIGFycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhhcnJbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIWdyaWRMaXN0KSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZ3JpZExpc3QgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICBicmVhaztcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIGdyaWRMaXN0ID0gZ3JpZExpc3RbYXJyW2ldXTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICByZXR1cm4gZ3JpZExpc3Q7XG4gICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAvLyByZXR1cm5lZCBpbiB0aGUgXCJ0b3RhbEZpZWxkXCIgZmllbGQgb2YgdGhlIHJlc3BvbnNlXG4gICAgICAgICAgICAgICAgdG90YWw6IGZ1bmN0aW9uKHJlc3BvbnNlKSB7XG4gICAgICAgICAgICAgICAgICAgIC8vY29uc29sZS5sb2cocmVzcG9uc2UpO1xuICAgICAgICAgICAgICAgICAgICB2YXIgYXJyID0gW10sIHRvdGFsID0gcmVzcG9uc2U7XG4gICAgICAgICAgICAgICAgICAgIGlmKHRvdGFsRmllbGQgJiYgdG90YWxGaWVsZC5sZW5ndGggPiAwICYmIHRvdGFsRmllbGQgIT0gJ251bGwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBhcnIgPSB0b3RhbEZpZWxkLnNwbGl0KCcuJyk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgZm9yKHZhciBpIGluIGFycikge1xuICAgICAgICAgICAgICAgICAgICAgICAgLy9jb25zb2xlLmxvZyhhcnJbaV0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYoIXRvdGFsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdG90YWwgPSAwO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgdG90YWwgPSB0b3RhbFthcnJbaV1dO1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIHJldHVybiB0b3RhbDtcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9LFxuICAgICAgICAgICAgcGFnZVNpemU6IF9wYWdlU2l6ZSxcbiAgICAgICAgICAgIHNlcnZlclBhZ2luZzogX3BhZ2VhYmxlLFxuICAgICAgICAgICAgc2VydmVyRmlsdGVyaW5nOiBfcGFnZWFibGUsXG4gICAgICAgICAgICBzZXJ2ZXJTb3J0aW5nOiBfcGFnZWFibGVcbiAgICAgICAgfSk7XG5cbiAgICAgICAgcmV0dXJuIGRhdGFTb3VyY2U7XG4gICAgfSxcbiAgICBnZXRPcHRpb25zOiBmdW5jdGlvbihwcm9wcykge1xuICAgICAgICBjb25zdCB7cmVzaXphYmxlLCBmaWx0ZXJhYmxlLCBzb3J0YWJsZSwgcGFnZWFibGUsIGhlaWdodCwgY2hlY2tib3hGaWVsZCwgc2VsZWN0TW9kZSwgbXVsdGlwbGUsIHNjcm9sbGFibGV9ID0gcHJvcHM7XG5cbiAgICAgICAgdmFyIGRhdGFTb3VyY2UgPSB0aGlzLmdldERhdGFTb3VyY2UocHJvcHMpO1xuXG4gICAgICAgIHZhciBjb2x1bW5zID0gcHJvcHMuY29sdW1ucztcbiAgICAgICAgaWYodHlwZW9mIGNoZWNrYm94RmllbGQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB2YXIgYiA9IHRydWU7XG4gICAgICAgICAgICBmb3IodmFyIGkgaW4gY29sdW1ucykge1xuICAgICAgICAgICAgICAgIGlmKGNoZWNrYm94RmllbGQgPT0gY29sdW1uc1tpXS5maWVsZCkge1xuICAgICAgICAgICAgICAgICAgICBiID0gZmFsc2U7XG4gICAgICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIGlmKGIgPT09IHRydWUpIHtcbiAgICAgICAgICAgICAgICBjb2x1bW5zLnVuc2hpZnQodGhpcy5nZXRDaGVja2JveENvbHVtbihjaGVja2JveEZpZWxkKSk7XG4gICAgICAgICAgICB9XG4gICAgICAgIH1cblxuICAgICAgICB2YXIgZmlsdGVyO1xuICAgICAgICBpZih0eXBlb2YgZmlsdGVyYWJsZSA9PT0gJ2Jvb2xlYW4nICYmIGZpbHRlcmFibGUgPT09IHRydWUpIHtcbiAgICAgICAgICAgIGZpbHRlciA9IHtcbiAgICAgICAgICAgICAgICBleHRyYTogZmFsc2UsXG4gICAgICAgICAgICAgICAgb3BlcmF0b3JzOiB7XG4gICAgICAgICAgICAgICAgICAgIHN0cmluZzoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbnM6ICdjb250YWlucydcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgbnVtYmVyOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBlcTogJ2VxJy8qLFxuICAgICAgICAgICAgICAgICAgICAgICAgbmVxOiBcIkRpdmVyc28gZGFcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGd0ZTogXCJNYWdnaW9yZSBvIHVndWFsZSBhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBndDogXCJNYWdnaW9yZSBkaVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgbHRlOiBcIk1pbm9yZSBvIHVndWFsZSBhXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBsdDogXCJNaW5vcmUgZGlcIiovXG4gICAgICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgICAgIGRhdGU6IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGVxOiAnZXEnLyosXG4gICAgICAgICAgICAgICAgICAgICAgICBuZXE6IFwiRGl2ZXJzbyBkYVwiLFxuICAgICAgICAgICAgICAgICAgICAgICAgZ3RlOiBcIlN1Y2Nlc3NpdmEgbyB1Z3VhbGUgYWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGd0OiBcIlN1Y2Nlc3NpdmEgYWxcIixcbiAgICAgICAgICAgICAgICAgICAgICAgIGx0ZTogXCJQcmVjZWRlbnRlIG8gdWd1YWxlIGFsXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICBsdDogXCJQcmVjZWRlbnRlIGFsXCIqL1xuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBlbnVtczoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY29udGFpbnM6ICdjb250YWlucydcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgdWk6IGZ1bmN0aW9uKGVsZW1lbnQpIHtcbiAgICAgICAgICAgICAgICAgICAgdmFyICRwYXJlbnQgPSBlbGVtZW50LnBhcmVudCgpO1xuICAgICAgICAgICAgICAgICAgICB3aGlsZSgkcGFyZW50LmNoaWxkcmVuKCkubGVuZ3RoID4gMSlcbiAgICAgICAgICAgICAgICAgICAgICAgICQoJHBhcmVudC5jaGlsZHJlbigpWzBdKS5yZW1vdmUoKTtcblxuICAgICAgICAgICAgICAgICAgICAkcGFyZW50LnByZXBlbmQoJzxpbnB1dCB0eXBlPVwidGV4dFwiIGRhdGEtYmluZD1cInZhbHVlOmZpbHRlcnNbMF0udmFsdWVcIiBjbGFzcz1cImstdGV4dGJveFwiPicpO1xuICAgICAgICAgICAgICAgICAgICAkcGFyZW50LmZpbmQoJ2J1dHRvbjpzdWJtaXQuay1idXR0b24uay1wcmltYXJ5JykuaHRtbCgn7ZWE7YSwJyk7XG4gICAgICAgICAgICAgICAgICAgICRwYXJlbnQuZmluZCgnYnV0dG9uOnJlc2V0LmstYnV0dG9uJykuaHRtbCgn7LSI6riw7ZmUJyk7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgZmlsdGVyID0gZmlsdGVyYWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBfcGFnZWFibGU7XG4gICAgICAgIGlmKHR5cGVvZiBwYWdlYWJsZSA9PT0gJ2Jvb2xlYW4nICYmIHBhZ2VhYmxlID09PSB0cnVlKSB7XG4gICAgICAgICAgICBfcGFnZWFibGUgPSB7XG4gICAgICAgICAgICAgICAgYnV0dG9uQ291bnQ6IDUsXG4gICAgICAgICAgICAgICAgcGFnZVNpemVzOiBbMTAsIDIwLCAzMCwgNTAsIDEwMF0sXG4gICAgICAgICAgICAgICAgbWVzc2FnZXM6IHtcbiAgICAgICAgICAgICAgICAgICAgZGlzcGxheTogJHBzX2xvY2FsZS5ncmlkLnJlY29yZHRleHQsLy8nezB9LXsxfS97Mn0nLFxuICAgICAgICAgICAgICAgICAgICBlbXB0eTogJycsXG4gICAgICAgICAgICAgICAgICAgIC8vb2Y6ICcvezB9JyxcbiAgICAgICAgICAgICAgICAgICAgaXRlbXNQZXJQYWdlOiAkcHNfbG9jYWxlLmdyaWQucm93c1BlclBhZ2VcbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9O1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBfcGFnZWFibGUgPSBwYWdlYWJsZTtcbiAgICAgICAgfVxuXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgLy9kYXRhU291cmNlOiB7XG4gICAgICAgICAgICAvLyAgICB0cmFuc3BvcnQ6IHtcbiAgICAgICAgICAgIC8vICAgICAgICByZWFkOiB7XG4gICAgICAgICAgICAvLyAgICAgICAgICAgIHR5cGU6IG1ldGhvZCxcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgdXJsOiB1cmwsXG4gICAgICAgICAgICAvLyAgICAgICAgICAgIC8vZGF0YTogZGF0YSxcbiAgICAgICAgICAgIC8vICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJ1xuICAgICAgICAgICAgLy8gICAgICAgIH1cbiAgICAgICAgICAgIC8vICAgIH0vLyxcbiAgICAgICAgICAgIC8vICAgIC8vc2NoZW1hOiB7XG4gICAgICAgICAgICAvLyAgICAvLyAgICBkYXRhOiAnZGF0YSdcbiAgICAgICAgICAgIC8vICAgIC8vfSxcbiAgICAgICAgICAgIC8vICAgIC8vcGFnZVNpemU6IDIwLFxuICAgICAgICAgICAgLy8gICAgLy9zZXJ2ZXJQYWdpbmc6IHRydWUsXG4gICAgICAgICAgICAvLyAgICAvL3NlcnZlckZpbHRlcmluZzogdHJ1ZSxcbiAgICAgICAgICAgIC8vICAgIC8vc2VydmVyU29ydGluZzogdHJ1ZVxuICAgICAgICAgICAgLy99LFxuICAgICAgICAgICAgZGF0YVNvdXJjZTogZGF0YVNvdXJjZSxcbiAgICAgICAgICAgIGNvbHVtbnM6IGNvbHVtbnMsXG4gICAgICAgICAgICBub1JlY29yZHM6IHtcbiAgICAgICAgICAgICAgICB0ZW1wbGF0ZTogJHBzX2xvY2FsZS5ncmlkLmVtcHR5cmVjb3Jkc1xuICAgICAgICAgICAgfSxcbiAgICAgICAgICAgIGhlaWdodDogaGVpZ2h0LFxuICAgICAgICAgICAgZGF0YUJvdW5kOiB0aGlzLm9uRGF0YUJvdW5kLFxuICAgICAgICAgICAgcmVzaXphYmxlOiByZXNpemFibGUsXG4gICAgICAgICAgICBmaWx0ZXJhYmxlOiBmaWx0ZXIsXG4gICAgICAgICAgICBzb3J0YWJsZTogc29ydGFibGUsXG4gICAgICAgICAgICBzY3JvbGxhYmxlOiBzY3JvbGxhYmxlLFxuICAgICAgICAgICAgcGFnZWFibGU6IF9wYWdlYWJsZSxcbiAgICAgICAgICAgIHNlbGVjdGFibGU6IChtdWx0aXBsZSkgPyBcIm11bHRpcGxlICxcIiArIHNlbGVjdE1vZGUgOiBzZWxlY3RNb2RlXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYodHlwZW9mIGhlaWdodCA9PT0gJ251bWJlcicgfHwgdHlwZW9mIGhlaWdodCA9PT0gJ3N0cmluZycpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHtoZWlnaHQ6IGhlaWdodH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLypcbiAgICAgICAgaWYodHlwZW9mIG9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKXtcbiAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7Y2hhbmdlOiB0aGlzLm9uQ2hhbmdlUm93fSk7XG4gICAgICAgIH1cbiAgICAgICAgKi9cbiAgICAgICAgcmV0dXJuIG9wdGlvbnM7XG4gICAgfSxcblx0Z2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcblx0XHQvLyDtgbTrnpjsiqTqsIAg7IOd7ISx65CgIOuVjCDtlZzrsogg7Zi47Lac65CY6rOgIOy6kOyLnOuQnOuLpC5cblx0XHQvLyDrtoDrqqgg7Lu07Y+s64SM7Yq47JeQ7IScIHByb3DsnbQg64SY7Ja07Jik7KeAIOyViuydgCDqsr3smrAgKGluIOyXsOyCsOyekOuhnCDtmZXsnbgpIOunpO2VkeydmCDqsJLsnbQgdGhpcy5wcm9wc+yXkCDshKTsoJXrkJzri6QuXG4gICAgICAgIHJldHVybiB7bWV0aG9kOiAnUE9TVCcsIGxpc3RGaWVsZDogJ3Jlc3VsdFZhbHVlLmxpc3QnLCB0b3RhbEZpZWxkOiAncmVzdWx0VmFsdWUudG90YWxDb3VudCcsIHJlc2l6YWJsZTogdHJ1ZSwgZmlsdGVyYWJsZTogZmFsc2UsIHNvcnRhYmxlOiB0cnVlLCBwYWdlYWJsZTogdHJ1ZSwgcGFnZVNpemU6IDIwLCBzZWxlY3RNb2RlOiBudWxsLCBtdWx0aXBsZTogZmFsc2UsIHBhcmFtZXRlck1hcEZpZWxkOiBudWxsLCBzY3JvbGxhYmxlOiBmYWxzZX07XG5cdH0sXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpjquLAg7KeB7KCEKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XG4gICAgICAgIGlmKHR5cGVvZiBpZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlkID0gVXRpbC5nZXRVVUlEKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfSxcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KcIOuLpOydjCjtlZzrsogg7Zi47LacKVxuICAgICAgICB0aGlzLiRncmlkID0gJCgnIycrdGhpcy5pZCk7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyh0aGlzLmdldE9wdGlvbnModGhpcy5wcm9wcykpO1xuICAgICAgICB0aGlzLmdyaWQgPSB0aGlzLiRncmlkLmtlbmRvR3JpZCh0aGlzLmdldE9wdGlvbnModGhpcy5wcm9wcykpLmRhdGEoJ2tlbmRvR3JpZCcpO1xuXG4gICAgICAgIC8qXG4gICAgICAgIHZhciBfdGhpcyA9IHRoaXM7XG4gICAgICAgICQod2luZG93KS5yZXNpemUoZnVuY3Rpb24oKXtcbiAgICAgICAgICAgIC8vX3RoaXMuJGdyaWQuZGF0YShcImtlbmRvR3JpZFwiKS5yZXNpemUoKTtcbiAgICAgICAgICAgIF90aGlzLmF1dG9SZXNpemVHcmlkKCk7XG4gICAgICAgIH0pO1xuICAgICAgICAqL1xuICAgICAgICAvLyBiaW5kIGNsaWNrIGV2ZW50IHRvIHRoZSBjaGVja2JveFxuICAgICAgICAvL2NvbnNvbGUubG9nKGdyaWQpO1xuICAgICAgICAvLyBFdmVudHNcbiAgICAgICAgdGhpcy5ncmlkLmJpbmQoJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UpO1xuXG4gICAgICAgIHRoaXMuZ3JpZC50YWJsZS5vbignY2xpY2snLCAnLmNoZWNrYm94JyAsIHRoaXMub25DaGVja2JveFJvdyk7ICAgICAgICAgLy8gY2hlY2tib3hcbiAgICAgICAgdGhpcy5ncmlkLnRoZWFkLm9uKCdjbGljaycsICcuY2hlY2tib3gnICwgdGhpcy5vbkNoZWNrYm94SGVhZGVyKTsgICAgICAvLyBoZWFkZXIgY2hlY2tib3hcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5pbml0ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB2YXIgZGF0YSA9IHt9O1xuICAgICAgICAgICAgZGF0YS4kZ3JpZCA9IHRoaXMuJGdyaWQ7XG4gICAgICAgICAgICBkYXRhLmdyaWQgPSB0aGlzLmdyaWQ7XG4gICAgICAgICAgICB0aGlzLnByb3BzLmluaXQoZGF0YSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGNvbXBvbmVudFdpbGxSZWNlaXZlUHJvcHM6IGZ1bmN0aW9uKG5leHRQcm9wcykge1xuICAgICAgICAvLyDsu7Ttj6zrhIztirjqsIAg7IOI66Gc7Jq0IHByb3Bz66W8IOuwm+ydhCDrlYwg7Zi47LacKOy1nOy0iCDroIzrjZTrp4Eg7Iuc7JeQ64qUIO2YuOy2nOuQmOyngCDslYrsnYwpXG4gICAgICAgIC8qIGRhdGFTb3VyY2Ug7JeQIOq0gOugqOuQnCDqsJLsnbQg67CU64CM7Ja07JW8IOuLpOyLnCDrjbDsnbTthLAg66Gc65Sp7ZWY64qUIOuwqeyLneydgCDsnbzri6gg67O066WYXG4gICAgICAgIO2ZlOuptOyXkOyEnCByZWZyZXNoIOqwgCDslYjrkKhcbiAgICAgICAgY29uc3Qge3VybCwgbWV0aG9kLCBkYXRhLCBsaXN0RmllbGR9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICB2YXIgYiA9IGZhbHNlO1xuICAgICAgICBmb3IodmFyIGtleSBpbiBkYXRhKSB7XG4gICAgICAgICAgICBpZihuZXh0UHJvcHMuZGF0YVtrZXldICE9IGRhdGFba2V5XSkge1xuICAgICAgICAgICAgICAgIGIgPSB0cnVlO1xuICAgICAgICAgICAgICAgIGJyZWFrO1xuICAgICAgICAgICAgfVxuICAgICAgICB9XG5cbiAgICAgICAgaWYobmV4dFByb3BzLnVybCAhPSB1cmwgfHwgYiA9PSB0cnVlKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdzZXREYXRhU291cmNlJyk7XG4gICAgICAgICAgICB2YXIgZ3JpZCA9ICQoJyMnK3RoaXMuaWQpLmRhdGEoXCJrZW5kb0dyaWRcIik7XG4gICAgICAgICAgICBncmlkLnNldERhdGFTb3VyY2UodGhpcy5nZXREYXRhU291cmNlKG5leHRQcm9wcykpO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIHRoaXMuZ3JpZC5zZXREYXRhU291cmNlKHRoaXMuZ2V0RGF0YVNvdXJjZShuZXh0UHJvcHMpKTtcbiAgICAgICAgdGhpcy5jaGVja2VkSWRzID0gW107XG4gICAgICAgIHRoaXMuZ3JpZC50aGVhZC5maW5kKCcuY2hlY2tib3gnKS5hdHRyKCdjaGVja2VkJywgZmFsc2UpO1xuICAgICAgICAvLyBzZXREYXRhU291cmNlIOqwgCDsnbzslrTrgpjrqbQgaGVhZGVyIGNoZWNrYm94IGNsaWNrIOydtOuypO2KuCDrpqzsiqTrhIjqsIAg7IKs65287KC47IScIOuLpOyLnCDshKTsoJVcbiAgICAgICAgdGhpcy5ncmlkLnRoZWFkLm9uKCdjbGljaycsICcuY2hlY2tib3gnICwgdGhpcy5vbkNoZWNrYm94SGVhZGVyKTsgICAgICAvLyBoZWFkZXIgY2hlY2tib3hcblxuICAgICAgICAvLyBzZWxlY3RlZCBjaGVja1xuICAgICAgICB0aGlzLnNldFNlbGVjdGVkSWRzKG5leHRQcm9wcyk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIGNvbnN0IHtjbGFzc05hbWV9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5pZH0gY2xhc3NOYW1lPXtjbGFzc05hbWVzKGNsYXNzTmFtZSl9PjwvZGl2PlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG5tb2R1bGUuZXhwb3J0cyA9IEdyaWQ7XG4iLCIvKipcbiAqIE11bHRpU2VsZWN0IGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDgvMjNcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdWYuTXVsdGlTZWxlY3Qgb3B0aW9ucz17b3B0aW9uc30gLz5cbiAqXG4gKiBLZW5kbyBNdWx0aVNlbGVjdCDrnbzsnbTruIzrn6zrpqzsl5Ag7KKF7IaN7KCB7J2064ukLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XG5cbnZhciBNdWx0aVNlbGVjdCA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ011bHRpU2VsZWN0JyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIG5hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgaG9zdDogUHJvcFR5cGVzLnN0cmluZywgLy8g7ISc67KEIOygleuztChDcm9zcyBCcm93c2VyIEFjY2VzcylcbiAgICAgICAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBtZXRob2Q6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGRhdGE6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgICAgIHBsYWNlaG9sZGVyOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBsaXN0RmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGRhdGFUZXh0RmllbGQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGRhdGFWYWx1ZUZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBtdWx0aXBsZTogUHJvcFR5cGVzLmJvb2wsICAgICAgICAgICAvLyDri6TspJHshKDtg53snYQg7KeA7JuQ7ZWY66mwLCDri6vtnojsp4Ag7JWK6rOgIOyXrOufrOqwnOulvCDshKDtg53tlaAg7IiYIOyeiOuLpC5cbiAgICAgICAgaGVhZGVyVGVtcGxhdGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGl0ZW1UZW1wbGF0ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgdGFnVGVtcGxhdGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgb25TZWxlY3Q6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uT3BlbjogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ2xvc2U6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkZpbHRlcmluZzogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRGF0YUJvdW5kOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgbWluTGVuZ3RoOiBQcm9wVHlwZXMubnVtYmVyLCAgICAgICAgICAgIC8vIOqygOyDieyLnCDtlYTsmpTtlZwg7LWc7IaMIOuLqOyWtCDquLjsnbRcbiAgICAgICAgbWF4U2VsZWN0ZWRJdGVtczogUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIOy1nOuMgCDshKDtg50g7IiYXG4gICAgICAgIHBhcmFtZXRlck1hcEZpZWxkOiBQcm9wVHlwZXMub2JqZWN0LCAgICAvLyBQYWdpbmcsIEZpbHRlckpzb25cbiAgICAgICAgc2VydmVyRmlsdGVyaW5nOiBQcm9wVHlwZXMuYm9vbCwgICAgLy8g7ISc67KEIEZpbHRlcmluZyjqsoDsg4nsobDqsbTsl5Ag65Sw66W4IOumrOyKpO2KuOyXhSlcbiAgICAgICAgc2VydmVyUGFnaW5nOiBQcm9wVHlwZXMuYm9vbCwgICAvLyDshJzrsoQgUGFnaW5nKOupgO2LsOyFgOugie2KuCDrpqzsiqTtirgg7KCc7ZWcKVxuICAgICAgICBwYWdlU2l6ZTogUHJvcFR5cGVzLm51bWJlciwgICAgIC8vIOyEnOuyhOyCrOydtOuTnCBQYWdlIFNpemVcbiAgICAgICAgZmlsdGVyRmllbGRzOiBQcm9wVHlwZXMuYXJyYXkgICAvLyDtlYTthLAg7ZWE65OcIOygleydmChvcuuhnCDri6TspJEg6rKA7IOJ7IucIOygnOqztSlcbiAgICB9LFxuICAgIGlkOiAnJyxcbiAgICBvblNlbGVjdDogZnVuY3Rpb24oZSkge1xuICAgICAgICB2YXIgZGF0YUl0ZW0gPSB0aGlzLm11bHRpU2VsZWN0LmRhdGFTb3VyY2UudmlldygpW2UuaXRlbS5pbmRleCgpXTtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vblNlbGVjdCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25TZWxlY3QoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ2hhbmdlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNoYW5nZShlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25PcGVuOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uT3BlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25PcGVuKGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsb3NlOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ2xvc2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2xvc2UoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRmlsdGVyaW5nOiBmdW5jdGlvbihlKSB7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uRmlsdGVyaW5nICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkZpbHRlcmluZyhlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25EYXRhQm91bmQ6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkRhdGFCb3VuZCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0T3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHsgaG9zdCwgdXJsLCBkYXRhLCBtZXRob2QsIGl0ZW1zLCBwbGFjZWhvbGRlciwgbGlzdEZpZWxkLCBkYXRhVGV4dEZpZWxkLCBkYXRhVmFsdWVGaWVsZCwgaGVhZGVyVGVtcGxhdGUsIGl0ZW1UZW1wbGF0ZSwgdGFnVGVtcGxhdGUsIGhlaWdodCwgbXVsdGlwbGUsIG1pbkxlbmd0aCwgbWF4U2VsZWN0ZWRJdGVtcywgcGFyYW1ldGVyTWFwRmllbGQsIHNlcnZlckZpbHRlcmluZywgc2VydmVyUGFnaW5nLCBwYWdlU2l6ZSwgZmlsdGVyRmllbGRzIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHZhciBvcHRpb25zID0ge1xuICAgICAgICAgICAgcGxhY2Vob2xkZXI6IHBsYWNlaG9sZGVyLFxuICAgICAgICAgICAgZGF0YVRleHRGaWVsZDogZGF0YVRleHRGaWVsZCxcbiAgICAgICAgICAgIGRhdGFWYWx1ZUZpZWxkOiBkYXRhVmFsdWVGaWVsZCxcbiAgICAgICAgICAgIGRhdGFTb3VyY2U6IFtdXG4gICAgICAgIH07XG5cbiAgICAgICAgaWYobXVsdGlwbGUpe1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBhdXRvQ2xvc2U6IGZhbHNlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYobWluTGVuZ3RoID4gMCl7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IG1pbkxlbmd0aDogbWluTGVuZ3RoIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgaWYobWF4U2VsZWN0ZWRJdGVtcyAhPT0gbnVsbCl7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IG1heFNlbGVjdGVkSXRlbXM6IG1heFNlbGVjdGVkSXRlbXMgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBkYXRhU291cmNlXG4gICAgICAgIC8vIHVybFxuICAgICAgICBpZih1cmwgJiYgdXJsICE9PSBudWxsICYmIHVybC5sZW5ndGggPiAwKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IGRhdGFTb3VyY2U6IHtcbiAgICAgICAgICAgICAgICB0cmFuc3BvcnQ6IHtcbiAgICAgICAgICAgICAgICAgICAgcmVhZDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgdXJsOiAoaG9zdCAmJiBob3N0ICE9PSBudWxsICYmIGhvc3QubGVuZ3RoID4gMCkgPyBob3N0ICsgdXJsIDogdXJsLFxuICAgICAgICAgICAgICAgICAgICAgICAgdHlwZTogbWV0aG9kLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVR5cGU6ICdqc29uJyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGRhdGE6IGRhdGEsICAgICAgLy8gc2VhcmNoIChAUmVxdWVzdEJvZHkgR3JpZFBhcmFtIGdyaWRQYXJhbSDroZwg67Cb64qU64ukLilcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyTWFwOiBmdW5jdGlvbihkYXRhLCB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpZih0eXBlID09IFwicmVhZFwiICYmIHBhcmFtZXRlck1hcEZpZWxkICE9PSBudWxsKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAvLyDrjbDsnbTthLAg7J297Ja07Jis65WMIO2VhOyalO2VnCDrjbDsnbTthLAoZXg67Y6Y7J207KeA6rSA66CoKeqwgCDsnojsnLzrqbQgZGF0YeulvCBjb3B57ZWc64ukLlxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGZvcihsZXQgY29weSBpbiBwYXJhbWV0ZXJNYXBGaWVsZCl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHR5cGVvZiBwYXJhbWV0ZXJNYXBGaWVsZFtjb3B5XSA9PT0gXCJzdHJpbmdcIiAmJiAoIGNvcHkgaW4gZGF0YSApKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFbcGFyYW1ldGVyTWFwRmllbGRbY29weV1dID0gZGF0YVtjb3B5XTtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGlmKHBhcmFtZXRlck1hcEZpZWxkLmZpbHRlcnNUb0pzb24gJiYgZGF0YS5maWx0ZXIgJiYgZGF0YS5maWx0ZXIuZmlsdGVycyl7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIC8vIEZpbHRlciBBcnJheSA9PiBKc29uIE9iamVjdCBDb3B5XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxldCBmaWx0ZXJzID0gZGF0YS5maWx0ZXIuZmlsdGVycztcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZmlsdGVycy5tYXAoKGZpbHRlcikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgbGV0IGZpZWxkID0gKHBhcmFtZXRlck1hcEZpZWxkLmZpbHRlclByZWZpeCkgPyBwYXJhbWV0ZXJNYXBGaWVsZC5maWx0ZXJQcmVmaXggKyBmaWx0ZXIuZmllbGQgOiBmaWx0ZXIuZmllbGQ7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBpZihwYXJhbWV0ZXJNYXBGaWVsZC5maWx0ZXJGaWVsZFRvTG93ZXJDYXNlKXtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICBkYXRhW2ZpZWxkLnRvTG93ZXJDYXNlKCldID0gZmlsdGVyLnZhbHVlO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgfWVsc2V7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgZGF0YVtmaWVsZF0gPSBmaWx0ZXIudmFsdWU7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIH0pO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBKU09OLnN0cmluZ2lmeShkYXRhKTtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2NoZW1hOiB7XG4gICAgICAgICAgICAgICAgICAgIC8vIHJldHVybmVkIGluIHRoZSBcImxpc3RGaWVsZFwiIGZpZWxkIG9mIHRoZSByZXNwb25zZVxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgdmFyIGxpc3RGaWVsZHMgPSBbXSwgZGF0YUxpc3QgPSByZXNwb25zZTtcbiAgICAgICAgICAgICAgICAgICAgICAgIGlmKGxpc3RGaWVsZCAmJiBsaXN0RmllbGQubGVuZ3RoID4gMCAmJiBsaXN0RmllbGQgIT0gJ251bGwnKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgbGlzdEZpZWxkcyA9IGxpc3RGaWVsZC5zcGxpdCgnLicpO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgIGxpc3RGaWVsZHMubWFwKFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAoZmllbGQpID0+IHtcbiAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgIGRhdGFMaXN0ID0gZGF0YUxpc3RbZmllbGRdO1xuICAgICAgICAgICAgICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgKTtcbiAgICAgICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBkYXRhTGlzdDtcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH0sXG4gICAgICAgICAgICAgICAgc2VydmVyRmlsdGVyaW5nOiBzZXJ2ZXJGaWx0ZXJpbmcsXG4gICAgICAgICAgICAgICAgc2VydmVyUGFnaW5nOiBzZXJ2ZXJQYWdpbmcsXG4gICAgICAgICAgICAgICAgcGFnZVNpemU6IHBhZ2VTaXplXG4gICAgICAgICAgICB9IH0pO1xuXG4gICAgICAgIH1lbHNlIGlmKHR5cGVvZiBpdGVtcyAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgZGF0YVNvdXJjZTogaXRlbXMgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBoZWFkZXJUZW1wbGF0ZVxuICAgICAgICBpZih0eXBlb2YgaGVhZGVyVGVtcGxhdGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IGhlYWRlclRlbXBsYXRlOiBoZWFkZXJUZW1wbGF0ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGl0ZW1UZW1wbGF0ZVxuICAgICAgICBpZih0eXBlb2YgaXRlbVRlbXBsYXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBpdGVtVGVtcGxhdGU6IGl0ZW1UZW1wbGF0ZSB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIHRhZ1RlbXBsYXRlXG4gICAgICAgIGlmKHR5cGVvZiB0YWdUZW1wbGF0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgdGFnVGVtcGxhdGU6IHRhZ1RlbXBsYXRlIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gaGVpZ2h0XG4gICAgICAgIGlmKHR5cGVvZiBoZWlnaHQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IGhlaWdodDogaGVpZ2h0IH0pO1xuICAgICAgICB9XG4gICAgICAgIGlmKGZpbHRlckZpZWxkcyAhPT0gbnVsbCAmJiBBcnJheS5pc0FycmF5KGZpbHRlckZpZWxkcykpe1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBmaWx0ZXJpbmc6IGZ1bmN0aW9uIChlKSB7XG4gICAgICAgICAgICAgICAgaWYgKGUuZmlsdGVyKSB7XG4gICAgICAgICAgICAgICAgICAgIGxldCBmaWVsZHMgPSBmaWx0ZXJGaWVsZHM7XG4gICAgICAgICAgICAgICAgICAgIHZhciB2YWx1ZSA9IGUuZmlsdGVyLnZhbHVlO1xuXG4gICAgICAgICAgICAgICAgICAgIGxldCBuZXdGaWVsZHMgPSBbXTtcbiAgICAgICAgICAgICAgICAgICAgZmllbGRzLm1hcChmaWVsZCA9PiB7XG4gICAgICAgICAgICAgICAgICAgICAgICBuZXdGaWVsZHMucHVzaCh7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgZmllbGQ6IGZpZWxkLFxuICAgICAgICAgICAgICAgICAgICAgICAgICAgIG9wZXJhdG9yOiBcImNvbnRhaW5zXCIsXG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICAgICAgICAgICAgICB9KTtcbiAgICAgICAgICAgICAgICAgICAgfSk7XG5cbiAgICAgICAgICAgICAgICAgICAgdmFyIG5ld0ZpbHRlciA9IHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGZpbHRlcnM6IG5ld0ZpZWxkcyxcbiAgICAgICAgICAgICAgICAgICAgICAgIGxvZ2ljOiBcIm9yXCJcbiAgICAgICAgICAgICAgICAgICAgfTtcbiAgICAgICAgICAgICAgICAgICAgZS5zZW5kZXIuZGF0YVNvdXJjZS5maWx0ZXIobmV3RmlsdGVyKTtcbiAgICAgICAgICAgICAgICAgICAgZS5wcmV2ZW50RGVmYXVsdCgpO1xuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICBlLnByZXZlbnREZWZhdWx0KCk7XG4gICAgICAgICAgICB9IH0pO1xuICAgICAgICB9XG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH0sXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG5cdFx0Ly8g67aA66qoIOy7tO2PrOuEjO2KuOyXkOyEnCBwcm9w7J20IOuEmOyWtOyYpOyngCDslYrsnYAg6rK97JqwIChpbiDsl7DsgrDsnpDroZwg7ZmV7J24KSDrp6TtlZHsnZgg6rCS7J20IHRoaXMucHJvcHPsl5Ag7ISk7KCV65Cc64ukLlxuXHRcdHJldHVybiB7bWV0aG9kOiAnUE9TVCcsIGxpc3RGaWVsZDogJ3Jlc3VsdFZhbHVlLmxpc3QnLCBwbGFjZWhvbGRlcjogJHBzX2xvY2FsZS5zZWxlY3QsIGRhdGFUZXh0RmllbGQ6ICd0ZXh0JywgZGF0YVZhbHVlRmllbGQ6ICd2YWx1ZScsIG11bHRpcGxlOiBmYWxzZSwgbWluTGVuZ3RoOiAwLCBtYXhTZWxlY3RlZEl0ZW1zOiBudWxsLCBzZXJ2ZXJGaWx0ZXJpbmc6IGZhbHNlLCBzZXJ2ZXJQYWdpbmc6IGZhbHNlLCBwYWdlU2l6ZTogMTAsIGZpbHRlckZpZWxkczogbnVsbH07XG5cdH0sXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpjquLAg7KeB7KCEKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XG4gICAgICAgIGlmKHR5cGVvZiBpZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlkID0gVXRpbC5nZXRVVUlEKCk7XG4gICAgICAgIH1cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgdGhpcy4kbXVsdGlTZWxlY3QgPSAkKCcjJyt0aGlzLmlkKTtcbiAgICAgICAgdGhpcy5tdWx0aVNlbGVjdCA9IHRoaXMuJG11bHRpU2VsZWN0LmtlbmRvTXVsdGlTZWxlY3QodGhpcy5nZXRPcHRpb25zKCkpLmRhdGEoJ2tlbmRvTXVsdGlTZWxlY3QnKTtcblxuICAgICAgICAvLyBFdmVudHNcbiAgICAgICAgdGhpcy5tdWx0aVNlbGVjdC5iaW5kKCdzZWxlY3QnLCB0aGlzLm9uU2VsZWN0KTtcbiAgICAgICAgdGhpcy5tdWx0aVNlbGVjdC5iaW5kKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlKTtcbiAgICAgICAgdGhpcy5tdWx0aVNlbGVjdC5iaW5kKCdvcGVuJywgdGhpcy5vbk9wZW4pO1xuICAgICAgICB0aGlzLm11bHRpU2VsZWN0LmJpbmQoJ2Nsb3NlJywgdGhpcy5vbkNsb3NlKTtcbiAgICAgICAgdGhpcy5tdWx0aVNlbGVjdC5iaW5kKCdmaWx0ZXJpbmcnLCB0aGlzLm9uRmlsdGVyaW5nKTtcbiAgICAgICAgdGhpcy5tdWx0aVNlbGVjdC5iaW5kKCdkYXRhQm91bmQnLCB0aGlzLm9uRGF0YUJvdW5kKTtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgY29uc3QgeyBjbGFzc05hbWUsIG5hbWUsIG11bHRpcGxlIH0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8c2VsZWN0IGlkPXt0aGlzLmlkfSBuYW1lPXtuYW1lfSBtdWx0aXBsZT17bXVsdGlwbGV9IGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhjbGFzc05hbWUpfT48L3NlbGVjdD5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBNdWx0aVNlbGVjdDtcbiIsIi8qKlxuICogTnVtZXJpY1RleHRCb3ggY29tcG9uZW50XG4gKlxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wOC8zMVxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqXG4gKiBleGFtcGxlOlxuICogPFB1Zi5OdW1lcmljVGV4dEJveCBvcHRpb25zPXtvcHRpb25zfSAvPlxuICpcbiAqIEtlbmRvIE51bWVyaWNUZXh0Qm94IOudvOydtOu4jOufrOumrOyXkCDsooXsho3soIHsnbTri6QuXG4gKi9cbid1c2Ugc3RyaWN0JztcblxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcbnZhciBQcm9wVHlwZXMgPSByZXF1aXJlKCdyZWFjdCcpLlByb3BUeXBlcztcbnZhciBjbGFzc05hbWVzID0gcmVxdWlyZSgnY2xhc3NuYW1lcycpO1xuXG52YXIgVXRpbCA9IHJlcXVpcmUoJy4uL3NlcnZpY2VzL1V0aWwnKTtcblxudmFyIE51bWVyaWNUZXh0Qm94ID0gUmVhY3QuY3JlYXRlQ2xhc3Moe1xuICAgIGRpc3BsYXlOYW1lOiAnTnVtZXJpY1RleHRCb3gnLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBuYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB3aWR0aDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKSxcbiAgICAgICAgZm9ybWF0OiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB2YWx1ZTogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgc3RlcDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgbWluOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICBtYXg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgIGRlY2ltYWxzOiBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICBwbGFjZWhvbGRlcjogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgZG93bkFycm93VGV4dDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgdXBBcnJvd1RleHQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgfSxcbiAgICBpZDogJycsXG4gICAgZ2V0T3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHsgZm9ybWF0LCB2YWx1ZSwgc3RlcCwgbWluLCBtYXgsIGRlY2ltYWxzLCBwbGFjZWhvbGRlciwgZG93bkFycm93VGV4dCwgdXBBcnJvd1RleHQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBmb3JtYXQ6IGZvcm1hdCxcbiAgICAgICAgICAgIHZhbHVlOiB2YWx1ZSxcbiAgICAgICAgICAgIGRvd25BcnJvd1RleHQ6IGRvd25BcnJvd1RleHQsXG4gICAgICAgICAgICB1cEFycm93VGV4dDogdXBBcnJvd1RleHRcbiAgICAgICAgfTtcblxuICAgICAgICAvLyBzdGVwXG4gICAgICAgIGlmKHR5cGVvZiBzdGVwICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBzdGVwOiBzdGVwIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWluXG4gICAgICAgIGlmKHR5cGVvZiBtaW4gIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IG1pbjogbWluIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gbWF4XG4gICAgICAgIGlmKHR5cGVvZiBtYXggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IG1heDogbWF4IH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gZGVjaW1hbHNcbiAgICAgICAgaWYodHlwZW9mIGRlY2ltYWxzICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBkZWNpbWFsczogZGVjaW1hbHMgfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBwbGFjZWhvbGRlclxuICAgICAgICBpZih0eXBlb2YgcGxhY2Vob2xkZXIgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IHBsYWNlaG9sZGVyOiBwbGFjZWhvbGRlciB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH0sXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG5cdFx0Ly8g67aA66qoIOy7tO2PrOuEjO2KuOyXkOyEnCBwcm9w7J20IOuEmOyWtOyYpOyngCDslYrsnYAg6rK97JqwIChpbiDsl7DsgrDsnpDroZwg7ZmV7J24KSDrp6TtlZHsnZgg6rCS7J20IHRoaXMucHJvcHPsl5Ag7ISk7KCV65Cc64ukLlxuXHRcdHJldHVybiB7IGZvcm1hdDogJ24wJywgdmFsdWU6IDEsIGRvd25BcnJvd1RleHQ6ICcnLCB1cEFycm93VGV4dDogJycgfTtcblx0fSxcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCmOq4sCDsp4HsoIQo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgbGV0IGlkID0gdGhpcy5wcm9wcy5pZDtcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWQgPSBVdGlsLmdldFVVSUQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIHRoaXMuJG51bWVyaWNUZXh0Qm94ID0gJCgnIycrdGhpcy5pZCk7XG4gICAgICAgIHRoaXMubnVtZXJpY1RleHRCb3ggPSB0aGlzLiRudW1lcmljVGV4dEJveC5rZW5kb051bWVyaWNUZXh0Qm94KHRoaXMuZ2V0T3B0aW9ucygpKS5kYXRhKCdrZW5kb051bWVyaWNUZXh0Qm94Jyk7XG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIGNvbnN0IHsgY2xhc3NOYW1lLCBuYW1lLCB3aWR0aCB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGlucHV0IGlkPXt0aGlzLmlkfSBuYW1lPXtuYW1lfSBzdHlsZT17e3dpZHRoOiB3aWR0aH19IC8+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gTnVtZXJpY1RleHRCb3g7IiwiLyoqXG4gKiBQYW5lbEJhciBjb21wb25lbnRcbiAqXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzA4LzE4XG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxuICpcbiAqIGV4YW1wbGU6XG4gKiA8UHVmLlBhbmVsQmFyIG9wdGlvbnM9e29wdGlvbnN9IC8+XG4gKlxuICogS2VuZG8gUGFuZWxCYXIg65287J2067iM65+s66as7JeQIOyiheyGjeyggeydtOuLpC5cbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xudmFyIFByb3BUeXBlcyA9IHJlcXVpcmUoJ3JlYWN0JykuUHJvcFR5cGVzO1xudmFyIGNsYXNzTmFtZXMgPSByZXF1aXJlKCdjbGFzc25hbWVzJyk7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vc2VydmljZXMvVXRpbCcpO1xuXG52YXIgUGFuZWxCYXIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdQYW5lbEJhcicsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGlkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjbGFzc05hbWU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNvbnRlbnRVcmxzOiBQcm9wVHlwZXMuYXJyYXlcbiAgICB9LFxuICAgIGlkOiAnJyxcbiAgICBleHBhbmQ6IGZ1bmN0aW9uKCRpdGVtKSB7XG4gICAgICAgIHRoaXMucGFuZWxCYXIuZXhwYW5kKCRpdGVtKTtcbiAgICB9LFxuICAgIG9uU2VsZWN0OiBmdW5jdGlvbihlKSB7XG5cbiAgICB9LFxuICAgIGdldE9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICByZXR1cm4ge31cbiAgICB9LFxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdC8vIO2BtOuemOyKpOqwgCDsg53shLHrkKAg65WMIO2VnOuyiCDtmLjstpzrkJjqs6Ag7LqQ7Iuc65Cc64ukLlxuXHRcdC8vIOu2gOuqqCDsu7Ttj6zrhIztirjsl5DshJwgcHJvcOydtCDrhJjslrTsmKTsp4Ag7JWK7J2AIOqyveyasCAoaW4g7Jew7IKw7J6Q66GcIO2ZleyduCkg66ek7ZWR7J2YIOqwkuydtCB0aGlzLnByb3Bz7JeQIOyEpOygleuQnOuLpC5cblx0XHRyZXR1cm4ge3ZhbHVlOiAnZGVmYXVsdCB2YWx1ZSd9O1xuXHR9LFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7Lu07Y+s64SM7Yq46rCAIOuniOyatO2KuOuQmOq4sCDsoIQgKO2VnOuyiCDtmLjstpwpIC8g66as7YS06rCS7J2AIHRoaXMuc3RhdGXsnZgg7LSI6riw6rCS7Jy866GcIOyCrOyaqVxuICAgICAgICByZXR1cm4ge2RhdGE6IFtdfTtcbiAgICB9LFxuICAgIGNvbXBvbmVudFdpbGxNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KY6riwIOyngeyghCjtlZzrsogg7Zi47LacKVxuICAgICAgICBsZXQgaWQgPSB0aGlzLnByb3BzLmlkO1xuICAgICAgICBpZih0eXBlb2YgaWQgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICBpZCA9IFV0aWwuZ2V0VVVJRCgpO1xuICAgICAgICB9XG5cbiAgICAgICAgdGhpcy5pZCA9IGlkO1xuICAgIH0sXG4gICAgY29tcG9uZW50RGlkTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCnCDri6TsnYwo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgdGhpcy4kcGFuZWxCYXIgPSAkKCcjJyt0aGlzLmlkKTtcbiAgICAgICAgdGhpcy5wYW5lbEJhciA9IHRoaXMuJHBhbmVsQmFyLmtlbmRvUGFuZWxCYXIodGhpcy5nZXRPcHRpb25zKCkpLmRhdGEoJ2tlbmRvUGFuZWxCYXInKTtcblxuICAgICAgICAvLyBFdmVudHNcbiAgICAgICAgdGhpcy5wYW5lbEJhci5iaW5kKCdzZWxlY3QnLCB0aGlzLm9uU2VsZWN0KTtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgY29uc3Qge2NsYXNzTmFtZSwgY2hpbGRyZW59ID0gdGhpcy5wcm9wcztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPHVsIGlkPXt0aGlzLmlkfSBjbGFzc05hbWU9e2NsYXNzTmFtZXMoY2xhc3NOYW1lKX0+e2NoaWxkcmVufTwvdWw+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbnZhciBQYW5lbEJhclBhbmUgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdQYW5lbEJhclBhbmUnLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgdGl0bGU6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXlcbiAgICB9LFxuICAgIGdldENvbnRlbnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCB7aXRlbXMsIGNoaWxkcmVuLCBjb250ZW50VXJsc30gPSB0aGlzLnByb3BzO1xuICAgICAgICB2YXIgY29udGVudDtcblxuICAgICAgICBpZihpdGVtcykge1xuICAgICAgICAgICAgdmFyIF9pdGVtcyA9IGl0ZW1zLm1hcChmdW5jdGlvbihpdGVtKSB7XG4gICAgICAgICAgICAgICAgaWYodHlwZW9mIGl0ZW0gPT09ICdvYmplY3QnKSB7XG4gICAgICAgICAgICAgICAgICAgIHZhciBpY29uLCB0ZXh0O1xuICAgICAgICAgICAgICAgICAgICBpZihpdGVtLmhhc093blByb3BlcnR5KCdzcHJpdGVDc3NDbGFzcycpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBpY29uID0gPHNwYW4gY2xhc3NOYW1lPXtjbGFzc05hbWVzKGl0ZW0uc3ByaXRlQ3NzQ2xhc3MpfT48L3NwYW4+O1xuICAgICAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICAgICAgICAgIGlmKGl0ZW0uaGFzT3duUHJvcGVydHkoJ2ltYWdlVXJsJykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIGljb24gPSA8aW1nIHNyYz17aXRlbS5pbWFnZVVybH0gLz47XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICBpZihpdGVtLmhhc093blByb3BlcnR5KCd0ZXh0JykpIHtcbiAgICAgICAgICAgICAgICAgICAgICAgIHRleHQgPSBpdGVtLnRleHQ7XG4gICAgICAgICAgICAgICAgICAgIH1cblxuICAgICAgICAgICAgICAgICAgICB2YXIgZGF0YTtcbiAgICAgICAgICAgICAgICAgICAgaWYoaXRlbS5oYXNPd25Qcm9wZXJ0eSgnZGF0YScpKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhID0geyBkYXRhOiBKU09OLnN0cmluZ2lmeShpdGVtLmRhdGEpIH07XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gKDxsaSBrZXk9e1V0aWwudW5pcXVlSUQoKX0+e2ljb259IHt0ZXh0fTwvbGk+KTtcbiAgICAgICAgICAgICAgICAgICAgcmV0dXJuICg8bGkgey4uLmRhdGF9PntpY29ufSB7dGV4dH08L2xpPik7XG4gICAgICAgICAgICAgICAgICAgIC8vcmV0dXJuIDxQYW5lbEJhclBhbmVJdGVtIGRhdGE9e2RhdGF9PntpY29ufSB7dGV4dH08L1BhbmVsQmFyUGFuZUl0ZW0+O1xuICAgICAgICAgICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgICAgICAgICAgLy9yZXR1cm4gKDxsaSBrZXk9e1V0aWwudW5pcXVlSUQoKX0+e2l0ZW19PC9saT4pO1xuICAgICAgICAgICAgICAgICAgICByZXR1cm4gKDxsaT57aXRlbX08L2xpPik7XG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfSk7XG4gICAgICAgICAgICBjb250ZW50ID0gPHVsPntfaXRlbXN9PC91bD47XG5cbiAgICAgICAgfWVsc2UgaWYoY2hpbGRyZW4pIHtcbiAgICAgICAgICAgIGNvbnRlbnQgPSBjaGlsZHJlbjtcblxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICAvLyBjb250ZW50VXJscyDsnbTrnbzqs6Ag7YyQ64uoXG4gICAgICAgICAgICBjb250ZW50ID0gPGRpdj48L2Rpdj47XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gY29udGVudDtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgY29uc3Qge2lkLCB0aXRsZX0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHZhciBfaWQ7XG4gICAgICAgIGlmKGlkKSB7XG4gICAgICAgICAgICBfaWQgPSB7aWQ6IGlkfTtcbiAgICAgICAgfVxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGxpIHsuLi5faWR9PlxuICAgICAgICAgICAgICAgIHt0aXRsZX1cbiAgICAgICAgICAgICAgICB7dGhpcy5nZXRDb250ZW50KCl9XG4gICAgICAgICAgICA8L2xpPlxuICAgICAgICApO1xuICAgIH1cbn0pO1xuXG52YXIgUGFuZWxCYXJQYW5lSXRlbSA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCB7IGRhdGEgfSA9IHRoaXMucHJvcHM7XG4gICAgICAgIHJldHVybiAoPGxpIHsuLi5kYXRhfT57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2xpPik7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuICAgIFBhbmVsQmFyOiBQYW5lbEJhcixcbiAgICBQYW5lbEJhclBhbmU6IFBhbmVsQmFyUGFuZVxufTsiLCIvKipcbiAqIFByb2dyZXNzQmFyIGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDkvMDZcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdWYuUHJvZ3Jlc3NCYXIgb3B0aW9ucz17b3B0aW9uc30gLz5cbiAqXG4gKiBLZW5kbyBQcm9ncmVzc0JhciDrnbzsnbTruIzrn6zrpqzsl5Ag7KKF7IaN7KCB7J2064ukLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XG5cbnZhciBQcm9ncmVzc0JhciA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ1Byb2dyZXNzQmFyJyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgdHlwZTogUHJvcFR5cGVzLm9uZU9mKFsndmFsdWUnLCAncGVyY2VudCcsICdjaHVuayddKSxcbiAgICAgICAgdmFsdWU6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgIGFuaW1hdGlvbjogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMubnVtYmVyLFxuICAgICAgICAgICAgUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgICAgICBQcm9wVHlwZXMub2JqZWN0XG4gICAgICAgIF0pLFxuICAgICAgICBtaW46IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgIG1heDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgZW5hYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgb3JpZW50YXRpb246IFByb3BUeXBlcy5vbmVPZihbJ2hvcml6b250YWwnLCAndmVydGljYWwnXSksXG4gICAgICAgIG9uQ2hhbmdlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25Db21wbGV0ZTogUHJvcFR5cGVzLmZ1bmNcbiAgICB9LFxuICAgIGlkOiAnJyxcbiAgICAvLy0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tXG4gICAgLy8gYXBpXG4gICAgdmFsdWU6IGZ1bmN0aW9uKHYpIHtcbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PSAwKSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9ncmVzc0Jhci52YWx1ZSgpO1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICByZXR1cm4gdGhpcy5wcm9ncmVzc0Jhci52YWx1ZSh2KTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZW5hYmxlOiBmdW5jdGlvbihiKSB7XG4gICAgICAgIGlmKGFyZ3VtZW50cy5sZW5ndGggPT0gMCkge1xuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci5lbmFibGUoKTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgdGhpcy5wcm9ncmVzc0Jhci5lbmFibGUoYik7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBldmVudFxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25DaGFuZ2UgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ2hhbmdlKGUudmFsdWUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNvbXBsZXRlOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25Db21wbGV0ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25Db21wbGV0ZShlLnZhbHVlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0T3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHsgdHlwZSwgdmFsdWUsIGFuaW1hdGlvbiwgZW5hYmxlLCBvcmllbnRhdGlvbiB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICAvLyBhbmltYXRpb25cbiAgICAgICAgdmFyIF9hbmltYXRpb247XG4gICAgICAgIGlmKHR5cGVvZiBhbmltYXRpb24gPT09ICdudW1iZXInKSB7XG4gICAgICAgICAgICBfYW5pbWF0aW9uID0geyBkdXJhdGlvbjogYW5pbWF0aW9uIH07XG4gICAgICAgIH1lbHNlIGlmKGFuaW1hdGlvbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgX2FuaW1hdGlvbiA9IHsgZHVyYXRpb246IDYwMCB9O1xuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBfYW5pbWF0aW9uID0gYW5pbWF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0eXBlOiB0eXBlLFxuICAgICAgICAgICAgdmFsdWU6IHZhbHVlLFxuICAgICAgICAgICAgYW5pbWF0aW9uOiBfYW5pbWF0aW9uLFxuICAgICAgICAgICAgZW5hYmxlOiBlbmFibGUsXG4gICAgICAgICAgICBvcmllbnRhdGlvbjogb3JpZW50YXRpb25cbiAgICAgICAgfTtcblxuICAgICAgICAvLyBtaW5cbiAgICAgICAgaWYodHlwZW9mIG1pbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgbWluOiBtaW4gfSk7XG4gICAgICAgIH1cblxuICAgICAgICAvLyBtYXhcbiAgICAgICAgaWYodHlwZW9mIG1heCAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHsgbWF4OiBtYXggfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9LFxuXHRnZXREZWZhdWx0UHJvcHM6IGZ1bmN0aW9uKCkge1xuXHRcdC8vIO2BtOuemOyKpOqwgCDsg53shLHrkKAg65WMIO2VnOuyiCDtmLjstpzrkJjqs6Ag7LqQ7Iuc65Cc64ukLlxuXHRcdC8vIOu2gOuqqCDsu7Ttj6zrhIztirjsl5DshJwgcHJvcOydtCDrhJjslrTsmKTsp4Ag7JWK7J2AIOqyveyasCAoaW4g7Jew7IKw7J6Q66GcIO2ZleyduCkg66ek7ZWR7J2YIOqwkuydtCB0aGlzLnByb3Bz7JeQIOyEpOygleuQnOuLpC5cblx0XHRyZXR1cm4geyB0eXBlOiAndmFsdWUnLCB2YWx1ZTogMCwgYW5pbWF0aW9uOiB7IGR1cmF0aW9uOiA2MDAgfSwgZW5hYmxlOiB0cnVlLCBvcmllbnRhdGlvbjogJ2hvcml6b250YWwnIH07XG5cdH0sXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpjquLAg7KeB7KCEKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XG4gICAgICAgIGlmKHR5cGVvZiBpZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlkID0gVXRpbC5nZXRVVUlEKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfSxcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KcIOuLpOydjCjtlZzrsogg7Zi47LacKVxuICAgICAgICB0aGlzLiRwcm9ncmVzc0JhciA9ICQoJyMnK3RoaXMuaWQpO1xuICAgICAgICB0aGlzLnByb2dyZXNzQmFyID0gdGhpcy4kcHJvZ3Jlc3NCYXIua2VuZG9Qcm9ncmVzc0Jhcih0aGlzLmdldE9wdGlvbnMoKSkuZGF0YSgna2VuZG9Qcm9ncmVzc0JhcicpO1xuXG4gICAgICAgIC8vIEV2ZW50c1xuICAgICAgICB0aGlzLnByb2dyZXNzQmFyLmJpbmQoJ2NoYW5nZScsIHRoaXMub25DaGFuZ2UpO1xuICAgICAgICB0aGlzLnByb2dyZXNzQmFyLmJpbmQoJ2NvbXBsZXRlJywgdGhpcy5vbkNvbXBsZXRlKTtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgY29uc3QgeyBjbGFzc05hbWUgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgaWQ9e3RoaXMuaWR9IGNsYXNzTmFtZT17Y2xhc3NOYW1lcyhjbGFzc05hbWUpfT48L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBQcm9ncmVzc0JhcjsiLCIvKipcbiAqIFRyZWVWaWV3IGNvbXBvbmVudFxuICpcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDQvMTVcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKlxuICogZXhhbXBsZTpcbiAqIDxQdWYuVHJlZVZpZXcgb3B0aW9ucz17b3B0aW9uc30gLz5cbiAqXG4gKiBLZW5kbyBUcmVlVmlldyDrnbzsnbTruIzrn6zrpqzsl5Ag7KKF7IaN7KCB7J2064ukLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XG5cbnZhciBUcmVlVmlldyA9IFJlYWN0LmNyZWF0ZUNsYXNzKHtcbiAgICBkaXNwbGF5TmFtZTogJ1RyZWVWaWV3JyxcbiAgICBwcm9wVHlwZXM6IHtcbiAgICAgICAgaWQ6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb3B0aW9uczogUHJvcFR5cGVzLm9iamVjdCxcbiAgICAgICAgaG9zdDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgdXJsOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBtZXRob2Q6IFByb3BUeXBlcy5zdHJpbmcsXG4gICAgICAgIGl0ZW1zOiBQcm9wVHlwZXMuYXJyYXksXG4gICAgICAgIGRhdGE6IFByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgIG9uRGVtYW5kOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgZGF0YVRleHRGaWVsZDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLmFycmF5XG4gICAgICAgIF0pLFxuICAgICAgICBjaGlsZHJlbkZpZWxkOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICBjaGVja2JveGVzOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgZHJhZ0FuZERyb3A6IFByb3BUeXBlcy5ib29sLFxuICAgICAgICB0ZW1wbGF0ZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgb25TZWxlY3Q6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkNoYW5nZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uQ2xpY2s6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkRibGNsaWNrOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25Db2xsYXBzZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRXhwYW5kOiBQcm9wVHlwZXMuZnVuY1xuICAgIH0sXG4gICAgaWQ6ICcnLFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBhcGlcbiAgICBkYXRhSXRlbTogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmVlVmlldy5kYXRhSXRlbShub2RlKTtcbiAgICB9LFxuICAgIHBhcmVudDogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICByZXR1cm4gdGhpcy50cmVlVmlldy5wYXJlbnQobm9kZSk7XG4gICAgfSxcbiAgICBzZWxlY3Q6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgaWYoYXJndW1lbnRzLmxlbmd0aCA9PT0gMCkge1xuICAgICAgICAgICAgcmV0dXJuIHRoaXMudHJlZVZpZXcuc2VsZWN0KCk7XG4gICAgICAgIH1lbHNlIHtcbiAgICAgICAgICAgIHJldHVybiB0aGlzLnRyZWVWaWV3LnNlbGVjdChub2RlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgYXBwZW5kOiBmdW5jdGlvbihub2RlRGF0YSwgcGFyZW50Tm9kZSwgc3VjY2Vzcykge1xuICAgICAgICByZXR1cm4gdGhpcy50cmVlVmlldy5hcHBlbmQobm9kZURhdGEsIHBhcmVudE5vZGUsIHN1Y2Nlc3MpO1xuICAgIH0sXG4gICAgcmVtb3ZlOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHRoaXMudHJlZVZpZXcucmVtb3ZlKG5vZGUpO1xuICAgIH0sXG4gICAgZXhwYW5kOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHRoaXMudHJlZVZpZXcuZXhwYW5kKG5vZGUpO1xuICAgIH0sXG4gICAgZXhwYW5kQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50cmVlVmlldy5leHBhbmQoJy5rLWl0ZW0nKTtcbiAgICB9LFxuICAgIGNvbGxhcHNlOiBmdW5jdGlvbihub2RlKSB7XG4gICAgICAgIHRoaXMudHJlZVZpZXcuY29sbGFwc2Uobm9kZSk7XG4gICAgfSxcbiAgICBjb2xsYXBzZUFsbDogZnVuY3Rpb24oKSB7XG4gICAgICAgIHRoaXMudHJlZVZpZXcuY29sbGFwc2UoJy5rLWl0ZW0nKTtcbiAgICB9LFxuICAgIGVuYWJsZTogZnVuY3Rpb24obm9kZSkge1xuICAgICAgICB0aGlzLnRyZWVWaWV3LmVuYWJsZShub2RlKTtcbiAgICB9LFxuICAgIGRpc2FibGU6IGZ1bmN0aW9uKG5vZGUpIHtcbiAgICAgICAgdGhpcy50cmVlVmlldy5lbmFibGUobm9kZSwgZmFsc2UpO1xuICAgIH0sXG4gICAgZW5hYmxlQWxsOiBmdW5jdGlvbigpIHtcbiAgICAgICAgdGhpcy50cmVlVmlldy5lbmFibGUoJy5rLWl0ZW0nKTtcbiAgICB9LFxuICAgIGRpc2FibGVBbGw6IGZ1bmN0aW9uKCkge1xuICAgICAgICB0aGlzLnRyZWVWaWV3LmVuYWJsZSgnLmstaXRlbScsIGZhbHNlKTtcbiAgICB9LFxuICAgIGZpbHRlcjogZnVuY3Rpb24odmFsdWUpIHtcbiAgICAgICAgaWYodmFsdWUgIT09IFwiXCIpIHtcbiAgICAgICAgICAgIHRoaXMudHJlZVZpZXcuZGF0YVNvdXJjZS5maWx0ZXIoe1xuICAgICAgICAgICAgICAgIGZpZWxkOiB0aGlzLnByb3BzLmRhdGFUZXh0RmllbGQsXG4gICAgICAgICAgICAgICAgb3BlcmF0b3I6ICdjb250YWlucycsXG4gICAgICAgICAgICAgICAgdmFsdWU6IHZhbHVlXG4gICAgICAgICAgICB9KTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgdGhpcy50cmVlVmlldy5kYXRhU291cmNlLmZpbHRlcih7fSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIHNvcnQ6IGZ1bmN0aW9uKGRpcikge1xuICAgICAgICAvLyBkaXLsnYAgJ2FzYycgb3IgJ2Rlc2MnXG4gICAgICAgIHRoaXMudHJlZVZpZXcuZGF0YVNvdXJjZS5zb3J0KHtcbiAgICAgICAgICAgIGZpZWxkOiB0aGlzLnByb3BzLmRhdGFUZXh0RmllbGQsXG4gICAgICAgICAgICBkaXI6IGRpclxuICAgICAgICB9KTtcbiAgICB9LFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBldmVudFxuICAgIG9uU2VsZWN0OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvLyDqsJnsnYAg64W465Oc66W8IHNlbGVjdCDtlaAg6rK97JqwIOydtOuypO2KuCDrsJzsg53tlZjrj4TroZ0g7ZWY6riwIOychO2VtFxuICAgICAgICAvLyBjbGljayDsnbTrsqTtirjsi5wgay1zdGF0ZS1zZWxlY3RlZCDsoJzqsbDtlZjqs6BcbiAgICAgICAgLy8gc2VsZWN0IOydtOuypO2KuOyLnCDstpTqsIDtlZzri6QuXG4gICAgICAgIC8vY29uc29sZS5sb2coJ3RyZWV2aWV3IHNlbGVjdCcpO1xuXG5cbiAgICAgICAgLy8kKGV2ZW50Lm5vZGUpLmZpbmQoJ3NwYW4uay1pbicpLmFkZENsYXNzKCdrLXN0YXRlLXNlbGVjdGVkJyk7XG4gICAgICAgIHZhciBub2RlLCBzZWxlY3RlZEl0ZW07XG5cbiAgICAgICAgaWYodHlwZW9mIGV2ZW50Lm5vZGUgPT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAvL2NvbnNvbGUubG9nKCdkaXNwYXRjaCBjbGljaycpO1xuICAgICAgICAgICAgbm9kZSA9IGV2ZW50O1xuICAgICAgICAgICAgLy8kKG5vZGUpLmZpbmQoJ3NwYW4uay1pbicpLmFkZENsYXNzKCdrLXN0YXRlLXNlbGVjdGVkJyk7XG4gICAgICAgICAgICAkKG5vZGUpLmNoaWxkcmVuKCc6Zmlyc3QnKS5maW5kKCdzcGFuLmstaW4nKS5hZGRDbGFzcygnay1zdGF0ZS1zZWxlY3RlZCcpO1xuICAgICAgICAgICAgdGhpcy5vblNlbGVjdENhbGwgPSBmYWxzZTtcbiAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgLy9jb25zb2xlLmxvZygnY2xpY2snKTtcbiAgICAgICAgICAgIG5vZGUgPSBldmVudC5ub2RlO1xuICAgICAgICAgICAgdGhpcy5vblNlbGVjdENhbGwgPSB0cnVlO1xuICAgICAgICB9XG4gICAgICAgIHNlbGVjdGVkSXRlbSA9IHRoaXMudHJlZVZpZXcuZGF0YUl0ZW0obm9kZSk7XG4gICAgICAgIC8vdmFyIHNlbGVjdGVkSXRlbSA9IHRoaXMudHJlZVZpZXcuZGF0YUl0ZW0oZXZlbnQubm9kZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coc2VsZWN0ZWRJdGVtKTtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vblNlbGVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdChldmVudCwgc2VsZWN0ZWRJdGVtKTtcblxuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25DaGVjazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkNoZWNrYm94IGNoYW5nZWQ6IFwiKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudC5ub2RlKTtcbiAgICB9LFxuICAgIG9uQ2hhbmdlOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiU2VsZWN0aW9uIGNoYW5nZWRcIik7XG4gICAgICAgIC8vY29uc29sZS5sb2coZXZlbnQpO1xuXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ2hhbmdlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICAvL3ZhciBkYXRhID0gZXZlbnQubm9kZTtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25DaGFuZ2UoZXZlbnQpO1xuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Db2xsYXBzZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkNvbGxhcHNpbmcgXCIpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50Lm5vZGUpO1xuICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtID0gdGhpcy50cmVlVmlldy5kYXRhSXRlbShldmVudC5ub2RlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhzZWxlY3RlZEl0ZW0pO1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkNvbGxhcHNlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQ29sbGFwc2UoZXZlbnQsIHNlbGVjdGVkSXRlbSk7XG5cbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRXhwYW5kOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRXhwYW5kaW5nIFwiKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudC5ub2RlKTtcbiAgICAgICAgdmFyIHNlbGVjdGVkSXRlbSA9IHRoaXMudHJlZVZpZXcuZGF0YUl0ZW0oZXZlbnQubm9kZSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coc2VsZWN0ZWRJdGVtKTtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25FeHBhbmQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25FeHBhbmQoZXZlbnQsIHNlbGVjdGVkSXRlbSk7XG5cbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRHJhZ1N0YXJ0OiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiU3RhcnRlZCBkcmFnZ2luZyBcIik7XG4gICAgICAgIC8vY29uc29sZS5sb2coZXZlbnQuc291cmNlTm9kZSk7XG4gICAgICAgIHZhciBzZWxlY3RlZEl0ZW0gPSB0aGlzLnRyZWVWaWV3LmRhdGFJdGVtKGV2ZW50LnNvdXJjZU5vZGUpO1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkRyYWdTdGFydCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdmFyIGl0ZW0gPSBzZWxlY3RlZEl0ZW07XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0KGV2ZW50LCBpdGVtKTtcblxuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25EcmFnOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRHJhZ2dpbmcgXCIpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50LnNvdXJjZU5vZGUpO1xuICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtID0gdGhpcy50cmVlVmlldy5kYXRhSXRlbShldmVudC5zb3VyY2VOb2RlKSxcbiAgICAgICAgICAgIHBhcmVudE5vZGUgPSB0aGlzLnRyZWVWaWV3LnBhcmVudChldmVudC5kcm9wVGFyZ2V0KSxcbiAgICAgICAgICAgIHBhcmVudEl0ZW0gPSB0aGlzLnRyZWVWaWV3LmRhdGFJdGVtKHBhcmVudE5vZGUpO1xuXG4gICAgICAgIC8vY29uc29sZS5sb2cocGFyZW50SXRlbSk7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uRHJhZyA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkRyYWcoZXZlbnQsIHNlbGVjdGVkSXRlbSwgcGFyZW50SXRlbSk7XG5cbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRHJvcDogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIkRyb3BwZWQgXCIpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50LnZhbGlkKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudC5zb3VyY2VOb2RlKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudC5kZXN0aW5hdGlvbk5vZGUpO1xuICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtID0gdGhpcy50cmVlVmlldy5kYXRhSXRlbShldmVudC5zb3VyY2VOb2RlKSxcbiAgICAgICAgICAgIHBhcmVudE5vZGUgPSB0aGlzLnRyZWVWaWV3LnBhcmVudChldmVudC5kZXN0aW5hdGlvbk5vZGUpLFxuICAgICAgICAgICAgcGFyZW50SXRlbSA9IHRoaXMudHJlZVZpZXcuZGF0YUl0ZW0ocGFyZW50Tm9kZSk7XG5cbiAgICAgICAgLy9jb25zb2xlLmxvZyhwYXJlbnRJdGVtKTtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25Ecm9wID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRHJvcChldmVudCwgc2VsZWN0ZWRJdGVtLCBwYXJlbnRJdGVtKTtcblxuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25EcmFnRW5kOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKFwiRmluaXNoZWQgZHJhZ2dpbmcgXCIpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGV2ZW50LnNvdXJjZU5vZGUpO1xuICAgICAgICB2YXIgc2VsZWN0ZWRJdGVtID0gdGhpcy50cmVlVmlldy5kYXRhSXRlbShldmVudC5zb3VyY2VOb2RlKSxcbiAgICAgICAgICAgIHBhcmVudE5vZGUgPSB0aGlzLnRyZWVWaWV3LnBhcmVudChldmVudC5kZXN0aW5hdGlvbk5vZGUpLFxuICAgICAgICAgICAgcGFyZW50SXRlbSA9IHRoaXMudHJlZVZpZXcuZGF0YUl0ZW0ocGFyZW50Tm9kZSk7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25EcmFnRW5kID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRHJhZ0VuZChldmVudCwgc2VsZWN0ZWRJdGVtLCBwYXJlbnRJdGVtKTtcblxuICAgICAgICAgICAgLy9ldmVudC5zdG9wSW1tZWRpYXRlUHJvcGFnYXRpb24oKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25OYXZpZ2F0ZTogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhcIk5hdmlnYXRlIFwiKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhldmVudC5ub2RlKTtcbiAgICB9LFxuICAgIG9uRGF0YUJvdW5kOiBmdW5jdGlvbihldmVudCkge1xuICAgICAgICBjb25zb2xlLmxvZygnb25EYXRhQm91bmQnKTtcbiAgICB9LFxuICAgIG9uQ2xpY2s6IGZ1bmN0aW9uKGV2ZW50KSB7XG4gICAgICAgIC8qXG4gICAgICAgIHZhciBub2RlID0gJChldmVudC50YXJnZXQpLmNsb3Nlc3QoXCIuay1pdGVtXCIpLFxuICAgICAgICAgICAgc2VsZWN0ZWRJdGVtID0gdGhpcy50cmVlVmlldy5kYXRhSXRlbShub2RlKTtcbiAgICAgICAgY29uc29sZS5sb2coJ3RyZWV2aWV3IGNsaWNrJyk7XG4gICAgICAgIC8vY29uc29sZS5sb2coc2VsZWN0ZWRJdGVtKTtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25DbGljayA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkNsaWNrKGV2ZW50LCBzZWxlY3RlZEl0ZW0pO1xuXG4gICAgICAgICAgICAvL2V2ZW50LnN0b3BJbW1lZGlhdGVQcm9wYWdhdGlvbigpO1xuICAgICAgICB9XG4gICAgICAgICovXG4gICAgICAgIC8vIOqwmeydgCDrhbjrk5zrpbwgc2VsZWN0IO2VoCDqsr3smrAg7J2067Kk7Yq4IOuwnOyDne2VmOuPhOuhnSDtlZjquLAg7JyE7ZW0XG4gICAgICAgIC8vIGNsaWNrIOydtOuypO2KuOyLnCBrLXN0YXRlLXNlbGVjdGVkIOygnOqxsO2VmOqzoFxuICAgICAgICAvLyBzZWxlY3Qg7J2067Kk7Yq47IucIOy2lOqwgO2VnOuLpC5cbiAgICAgICAgLy9jb25zb2xlLmxvZygkKGV2ZW50LnRhcmdldCkuaGFzQ2xhc3MoJ2stc3RhdGUtc2VsZWN0ZWQnKSk7XG4gICAgICAgIC8vY29uc29sZS5sb2coJ3RyZWV2aWV3IG9uY2xpY2snKTtcbiAgICAgICAgaWYodGhpcy5vblNlbGVjdENhbGwgPT09IGZhbHNlKSB7XG4gICAgICAgICAgICB2YXIgbm9kZSA9ICQoZXZlbnQudGFyZ2V0KS5jbG9zZXN0KFwiLmstaXRlbVwiKTtcbiAgICAgICAgICAgICQoZXZlbnQudGFyZ2V0KS5yZW1vdmVDbGFzcygnay1zdGF0ZS1zZWxlY3RlZCcpO1xuICAgICAgICAgICAgdGhpcy50cmVlVmlldy50cmlnZ2VyKCdzZWxlY3QnLCBub2RlKTtcbiAgICAgICAgfVxuICAgICAgICB0aGlzLm9uU2VsZWN0Q2FsbCA9IGZhbHNlO1xuICAgIH0sXG4gICAgb25EYmxjbGljazogZnVuY3Rpb24oZXZlbnQpIHtcbiAgICAgICAgdmFyIG5vZGUgPSAkKGV2ZW50LnRhcmdldCkuY2xvc2VzdChcIi5rLWl0ZW1cIiksXG4gICAgICAgICAgICBzZWxlY3RlZEl0ZW0gPSB0aGlzLnRyZWVWaWV3LmRhdGFJdGVtKG5vZGUpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvbkRibGNsaWNrJyk7XG4gICAgICAgIC8vY29uc29sZS5sb2coc2VsZWN0ZWRJdGVtKTtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkRibGNsaWNrID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRGJsY2xpY2soZXZlbnQsIHNlbGVjdGVkSXRlbSk7XG5cbiAgICAgICAgICAgIC8vZXZlbnQuc3RvcEltbWVkaWF0ZVByb3BhZ2F0aW9uKCk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIGdldE9wdGlvbnM6IGZ1bmN0aW9uKCkge1xuICAgICAgICBjb25zdCB7IGhvc3QsIHVybCwgbWV0aG9kLCBkYXRhLCBpdGVtcywgb25EZW1hbmQsIGRhdGFUZXh0RmllbGQsIGNoaWxkcmVuRmllbGQsIGNoZWNrYm94ZXMsIGRyYWdBbmREcm9wLCB0ZW1wbGF0ZSB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICB2YXIgb3B0aW9ucyA9IHtcbiAgICAgICAgICAgIGNoZWNrYm94ZXM6IGNoZWNrYm94ZXMsICAgICAgICAgLy8gdHJ1ZSBvciBmYWxzZVxuICAgICAgICAgICAgZGF0YVRleHRGaWVsZDogZGF0YVRleHRGaWVsZCxcbiAgICAgICAgICAgIGRhdGFTb3VyY2U6IFtdLFxuICAgICAgICAgICAgZHJhZ0FuZERyb3A6IGRyYWdBbmREcm9wICAgICAgICAvLyB0cnVlIG9yIGZhbHNlXG4gICAgICAgIH07XG5cbiAgICAgICAgLy9KU09OLnBhcnNlKEpTT04uc3RyaW5naWZ5KGRhdGEudHJlZVZPKS5zcGxpdCgnXCJjaGlsZHJlblwiOicpLmpvaW4oJ1wiaXRlbXNcIjonKSkuaXRlbXNcblxuICAgICAgICAvLyBkYXRhU291cmNlXG4gICAgICAgIC8vIHVybFxuICAgICAgICBpZih0eXBlb2YgdXJsICE9PSAndW5kZWZpbmVkJyAmJiBjaGlsZHJlbkZpZWxkICE9IFwiY2hpbGRyZW5cIikge1xuXG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IGRhdGFTb3VyY2U6IG5ldyBrZW5kby5kYXRhLkhpZXJhcmNoaWNhbERhdGFTb3VyY2Uoe1xuICAgICAgICAgICAgICAgIHRyYW5zcG9ydDoge1xuICAgICAgICAgICAgICAgICAgICByZWFkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IChob3N0ICYmIGhvc3QgIT09IG51bGwgJiYgaG9zdC5sZW5ndGggPiAwKSA/IGhvc3QgKyB1cmwgOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyTWFwOiBmdW5jdGlvbihkYXRhLCB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuRmllbGRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pIH0pO1xuXG4gICAgICAgIH1lbHNlIGlmKHR5cGVvZiB1cmwgIT09ICd1bmRlZmluZWQnICYmIGNoaWxkcmVuRmllbGQgPT0gXCJjaGlsZHJlblwiKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IGRhdGFTb3VyY2U6IG5ldyBrZW5kby5kYXRhLkhpZXJhcmNoaWNhbERhdGFTb3VyY2Uoe1xuICAgICAgICAgICAgICAgIHRyYW5zcG9ydDoge1xuICAgICAgICAgICAgICAgICAgICByZWFkOiB7XG4gICAgICAgICAgICAgICAgICAgICAgICB1cmw6IChob3N0ICYmIGhvc3QgIT09IG51bGwgJiYgaG9zdC5sZW5ndGggPiAwKSA/IGhvc3QgKyB1cmwgOiB1cmwsXG4gICAgICAgICAgICAgICAgICAgICAgICB0eXBlOiBtZXRob2QsXG4gICAgICAgICAgICAgICAgICAgICAgICBkYXRhVHlwZTogJ2pzb24nLFxuICAgICAgICAgICAgICAgICAgICAgICAgZGF0YTogZGF0YSxcbiAgICAgICAgICAgICAgICAgICAgICAgIGNvbnRlbnRUeXBlOiAnYXBwbGljYXRpb24vanNvbjsgY2hhcnNldD11dGYtOCdcbiAgICAgICAgICAgICAgICAgICAgfSxcbiAgICAgICAgICAgICAgICAgICAgcGFyYW1ldGVyTWFwOiBmdW5jdGlvbihkYXRhLCB0eXBlKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICByZXR1cm4gSlNPTi5zdHJpbmdpZnkoZGF0YSk7XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFwiaXRlbXNcIlxuICAgICAgICAgICAgICAgICAgICB9LFxuICAgICAgICAgICAgICAgICAgICBkYXRhOiBmdW5jdGlvbihyZXNwb25zZSkge1xuICAgICAgICAgICAgICAgICAgICAgICAgcmVzcG9uc2UudHJlZVZPID0gSlNPTi5wYXJzZShKU09OLnN0cmluZ2lmeShyZXNwb25zZS50cmVlVk8pLnNwbGl0KCdcImNoaWxkcmVuXCI6Jykuam9pbignXCJpdGVtc1wiOicpKS5pdGVtcztcbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiByZXNwb25zZS50cmVlVk87XG4gICAgICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgICAgICB9XG4gICAgICAgICAgICB9KSB9KTtcblxuICAgICAgICB9ZWxzZSBpZih0eXBlb2YgaXRlbXMgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IGRhdGFTb3VyY2U6IG5ldyBrZW5kby5kYXRhLkhpZXJhcmNoaWNhbERhdGFTb3VyY2Uoe1xuICAgICAgICAgICAgICAgIGRhdGE6IGl0ZW1zLFxuICAgICAgICAgICAgICAgIHNjaGVtYToge1xuICAgICAgICAgICAgICAgICAgICBtb2RlbDoge1xuICAgICAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IGNoaWxkcmVuRmllbGRcbiAgICAgICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgICAgIH1cbiAgICAgICAgICAgIH0pIH0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gdGVtcGxhdGVcbiAgICAgICAgaWYodHlwZW9mIHRlbXBsYXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyB0ZW1wbGF0ZTogdGVtcGxhdGUgfSk7XG4gICAgICAgIH1cblxuICAgICAgICByZXR1cm4gb3B0aW9ucztcbiAgICB9LFxuICAgIGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2BtOuemOyKpOqwgCDsg53shLHrkKAg65WMIO2VnOuyiCDtmLjstpzrkJjqs6Ag7LqQ7Iuc65Cc64ukLlxuICAgICAgICAvLyDrtoDrqqgg7Lu07Y+s64SM7Yq47JeQ7IScIHByb3DsnbQg64SY7Ja07Jik7KeAIOyViuydgCDqsr3smrAgKGluIOyXsOyCsOyekOuhnCDtmZXsnbgpIOunpO2VkeydmCDqsJLsnbQgdGhpcy5wcm9wc+yXkCDshKTsoJXrkJzri6QuXG4gICAgICAgIHJldHVybiB7b25EZW1hbmQ6IGZhbHNlLCBtZXRob2Q6ICdQT1NUJywgZGF0YVRleHRGaWVsZDogJ3RleHQnLCBjaGlsZHJlbkZpZWxkOiAnaXRlbXMnLCBkcmFnQW5kRHJvcDogZmFsc2V9O1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpjquLAg7KeB7KCEKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XG4gICAgICAgIGlmKHR5cGVvZiBpZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlkID0gVXRpbC5nZXRVVUlEKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfSxcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KcIOuLpOydjCjtlZzrsogg7Zi47LacKVxuICAgICAgICB0aGlzLiR0cmVlVmlldyA9ICQoJyMnK3RoaXMuaWQpO1xuICAgICAgICB0aGlzLnRyZWVWaWV3ID0gdGhpcy4kdHJlZVZpZXcua2VuZG9UcmVlVmlldyh0aGlzLmdldE9wdGlvbnMoKSkuZGF0YSgna2VuZG9UcmVlVmlldycpO1xuXG4gICAgICAgIC8vIEV2ZW50c1xuICAgICAgICB0aGlzLnRyZWVWaWV3LmJpbmQoJ3NlbGVjdCcsIHRoaXMub25TZWxlY3QpO1xuICAgICAgICB0aGlzLnRyZWVWaWV3LmJpbmQoJ2NoZWNrJywgdGhpcy5vbkNoZWNrKTtcbiAgICAgICAgdGhpcy50cmVlVmlldy5iaW5kKCdjaGFuZ2UnLCB0aGlzLm9uQ2hhbmdlKTtcbiAgICAgICAgdGhpcy50cmVlVmlldy5iaW5kKCdjb2xsYXBzZScsIHRoaXMub25Db2xsYXBzZSk7XG4gICAgICAgIHRoaXMudHJlZVZpZXcuYmluZCgnZXhwYW5kJywgdGhpcy5vbkV4cGFuZCk7XG5cbiAgICAgICAgLyogZHJhZyAmIGRyb3AgZXZlbnRzICovXG4gICAgICAgIHRoaXMudHJlZVZpZXcuYmluZCgnZHJhZ3N0YXJ0JywgdGhpcy5vbkRyYWdTdGFydCk7XG4gICAgICAgIHRoaXMudHJlZVZpZXcuYmluZCgnZHJhZycsIHRoaXMub25EcmFnKTtcbiAgICAgICAgdGhpcy50cmVlVmlldy5iaW5kKCdkcm9wJywgdGhpcy5vbkRyb3ApO1xuICAgICAgICB0aGlzLnRyZWVWaWV3LmJpbmQoJ2RyYWdlbmQnLCB0aGlzLm9uRHJhZ0VuZCk7XG4gICAgICAgIHRoaXMudHJlZVZpZXcuYmluZCgnbmF2aWdhdGUnLCB0aGlzLm9uTmF2aWdhdGUpO1xuXG4gICAgICAgIC8vdGhpcy4kdHJlZVZpZXcuZmluZCgnLmstaW4nKS5vbignY2xpY2snLCB0aGlzLm9uQ2xpY2spOyAgICAgICAvLyBjbGlja+ydtCBzZWxlY3Qg67O064ukIOuovOyggCDrsJzsg51cbiAgICAgICAgdGhpcy4kdHJlZVZpZXcub24oJ2NsaWNrJywgJy5rLWluJywgdGhpcy5vbkNsaWNrKTsgICAgICAgICAgICAgIC8vIGNsaWNr7J20IHNlbGVjdCDrs7Tri6Qg64KY7KSR7JeQIOuwnOyDnVxuICAgICAgICB0aGlzLiR0cmVlVmlldy5maW5kKCcuay1pbicpLm9uKCdkYmxjbGljaycsIHRoaXMub25EYmxjbGljayk7XG5cbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgY29uc3Qge2NsYXNzTmFtZX0gPSB0aGlzLnByb3BzO1xuXG4gICAgICAgIHJldHVybiAoXG4gICAgICAgICAgICA8ZGl2IGlkPXt0aGlzLmlkfSBjbGFzc05hbWU9e2NsYXNzTmFtZXMoY2xhc3NOYW1lKX0+PC9kaXY+XG4gICAgICAgICk7XG4gICAgfVxufSk7XG5cbm1vZHVsZS5leHBvcnRzID0gVHJlZVZpZXc7XG4iLCIvKipcbiAqIFdpbmRvdyBjb21wb25lbnRcbiAqXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzA5LzA2XG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxuICpcbiAqIGV4YW1wbGU6XG4gKiA8UHVmLldpbmRvdyBvcHRpb25zPXtvcHRpb25zfSAvPlxuICpcbiAqIEtlbmRvIFdpbmRvdyDrnbzsnbTruIzrn6zrpqzsl5Ag7KKF7IaN7KCB7J2064ukLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XG52YXIgY2xhc3NOYW1lcyA9IHJlcXVpcmUoJ2NsYXNzbmFtZXMnKTtcblxudmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XG5cbnZhciBXaW5kb3cgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdXaW5kb3cnLFxuICAgIHByb3BUeXBlczoge1xuICAgICAgICBpZDogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgY2xhc3NOYW1lOiBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICB0aXRsZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgdmlzaWJsZTogUHJvcFR5cGVzLmJvb2wsXG4gICAgICAgIGFjdGlvbnM6IFByb3BUeXBlcy5hcnJheSwgICAgICAgLy8gWydQaW4nLCAnUmVmcmVzaCcsICdNaW5pbWl6ZScsICdNYXhpbWl6ZScsICdDbG9zZSddXG4gICAgICAgIG1vZGFsOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgcmVzaXphYmxlOiBQcm9wVHlwZXMuYm9vbCxcbiAgICAgICAgd2lkdGg6IFByb3BUeXBlcy5vbmVPZlR5cGUoW1xuICAgICAgICAgICAgUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgICAgIFByb3BUeXBlcy5udW1iZXJcbiAgICAgICAgXSksXG4gICAgICAgIGhlaWdodDogUHJvcFR5cGVzLm9uZU9mVHlwZShbXG4gICAgICAgICAgICBQcm9wVHlwZXMuc3RyaW5nLFxuICAgICAgICAgICAgUHJvcFR5cGVzLm51bWJlclxuICAgICAgICBdKSxcbiAgICAgICAgbWluV2lkdGg6IFByb3BUeXBlcy5udW1iZXIsXG4gICAgICAgIG1pbkhlaWdodDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgb25PcGVuOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25DbG9zZTogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uUmVzaXplOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25EcmFnU3RhcnQ6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkRyYWdFbmQ6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvblJlZnJlc2g6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkFjdGl2YXRlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25EZWFjdGl2YXRlOiBQcm9wVHlwZXMuZnVuY1xuICAgIH0sXG4gICAgaWQ6ICcnLFxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBhcGlcblxuICAgIC8vLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS0tLS1cbiAgICAvLyBldmVudFxuICAgIG9uT3BlbjogZnVuY3Rpb24oZSkge1xuXG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uT3BlbiAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25PcGVuKGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkNsb3NlOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25DbG9zZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25DbG9zZShlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25SZXNpemU6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vblJlc2l6ZSAhPT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25SZXNpemUoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uRHJhZ1N0YXJ0OiBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25EcmFnU3RhcnQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRHJhZ1N0YXJ0KGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkRyYWdFbmQ6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkRyYWdFbmQgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRHJhZ0VuZChlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25SZWZyZXNoOiBmdW5jdGlvbihlKSB7XG5cbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25SZWZyZXNoICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblJlZnJlc2goZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQWN0aXZhdGU6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkFjdGl2YXRlICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vbkFjdGl2YXRlKGUpO1xuICAgICAgICB9XG4gICAgfSxcbiAgICBvbkRlYWN0aXZhdGU6IGZ1bmN0aW9uKGUpIHtcblxuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkRlYWN0aXZhdGUgIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uRGVhY3RpdmF0ZShlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0T3B0aW9uczogZnVuY3Rpb24oKSB7XG4gICAgICAgIGNvbnN0IHsgdGl0bGUsIHZpc2libGUsIGFjdGlvbnMsIG1vZGFsLCByZXNpemFibGUsIHdpZHRoLCBoZWlnaHQsIG1pbldpZHRoLCBtaW5IZWlnaHQgfSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICB0aXRsZTogdGl0bGUsXG4gICAgICAgICAgICB2aXNpYmxlOiB2aXNpYmxlLFxuICAgICAgICAgICAgYWN0aW9uczogYWN0aW9ucyxcbiAgICAgICAgICAgIG1vZGFsOiBtb2RhbCxcbiAgICAgICAgICAgIHJlc2l6YWJsZTogcmVzaXphYmxlLFxuICAgICAgICAgICAgbWluV2lkdGg6IG1pbldpZHRoLFxuICAgICAgICAgICAgbWluSGVpZ2h0OiBtaW5IZWlnaHRcbiAgICAgICAgfTtcblxuICAgICAgICAvLyB3aWR0aFxuICAgICAgICBpZih0eXBlb2Ygd2lkdGggIT09ICd1bmRlZmluZWQnKSB7XG4gICAgICAgICAgICAkLmV4dGVuZChvcHRpb25zLCB7IHdpZHRoOiB3aWR0aCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIC8vIGhlaWdodFxuICAgICAgICBpZih0eXBlb2YgaGVpZ2h0ICE9PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywgeyBoZWlnaHQ6IGhlaWdodCB9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH0sXG5cdGdldERlZmF1bHRQcm9wczogZnVuY3Rpb24oKSB7XG5cdFx0Ly8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG5cdFx0Ly8g67aA66qoIOy7tO2PrOuEjO2KuOyXkOyEnCBwcm9w7J20IOuEmOyWtOyYpOyngCDslYrsnYAg6rK97JqwIChpbiDsl7DsgrDsnpDroZwg7ZmV7J24KSDrp6TtlZHsnZgg6rCS7J20IHRoaXMucHJvcHPsl5Ag7ISk7KCV65Cc64ukLlxuXHRcdHJldHVybiB7IHRpdGxlOiAnVGl0bGUnLCB2aXNpYmxlOiB0cnVlLCBhY3Rpb25zOiBbJ1BpbicsICdNaW5pbWl6ZScsICdNYXhpbWl6ZScsICdDbG9zZSddLCBtb2RhbDogZmFsc2UsIHJlc2l6YWJsZTogdHJ1ZSwgbWluV2lkdGg6IDE1MCwgbWluSGVpZ2h0OiAxMDAgfTtcblx0fSxcbiAgICBjb21wb25lbnRXaWxsTW91bnQ6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDstZzstIgg66CM642U66eB7J20IOydvOyWtOuCmOq4sCDsp4HsoIQo7ZWc67KIIO2YuOy2nClcbiAgICAgICAgbGV0IGlkID0gdGhpcy5wcm9wcy5pZDtcbiAgICAgICAgaWYodHlwZW9mIGlkID09PSAndW5kZWZpbmVkJykge1xuICAgICAgICAgICAgaWQgPSBVdGlsLmdldFVVSUQoKTtcbiAgICAgICAgfVxuXG4gICAgICAgIHRoaXMuaWQgPSBpZDtcbiAgICB9LFxuICAgIGNvbXBvbmVudERpZE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpwg64uk7J2MKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIHRoaXMuJHdpbmRvdyA9ICQoJyMnK3RoaXMuaWQpO1xuICAgICAgICB0aGlzLndpbmRvdyA9IHRoaXMuJHdpbmRvdy5rZW5kb1dpbmRvdyh0aGlzLmdldE9wdGlvbnMoKSkuZGF0YSgna2VuZG9XaW5kb3cnKTtcblxuICAgICAgICAvLyBFdmVudHNcbiAgICAgICAgdGhpcy53aW5kb3cuYmluZCgnb3BlbicsIHRoaXMub25PcGVuKTtcbiAgICAgICAgdGhpcy53aW5kb3cuYmluZCgnY2xvc2UnLCB0aGlzLm9uQ2xvc2UpO1xuICAgICAgICB0aGlzLndpbmRvdy5iaW5kKCdyZXNpemUnLCB0aGlzLm9uUmVzaXplKTtcbiAgICAgICAgdGhpcy53aW5kb3cuYmluZCgnZHJhZ3N0YXJ0JywgdGhpcy5vbkRyYWdTdGFydCk7XG4gICAgICAgIHRoaXMud2luZG93LmJpbmQoJ2RyYWdlbmQnLCB0aGlzLm9uRHJhZ0VuZCk7XG4gICAgICAgIHRoaXMud2luZG93LmJpbmQoJ3JlZnJlc2gnLCB0aGlzLm9uUmVmcmVzaCk7XG4gICAgICAgIHRoaXMud2luZG93LmJpbmQoJ2FjdGl2YXRlJywgdGhpcy5vbkFjdGl2YXRlKTtcbiAgICAgICAgdGhpcy53aW5kb3cuYmluZCgnZGVhY3RpdmF0ZScsIHRoaXMub25EZWFjdGl2YXRlKTtcblxuXG4gICAgfSxcbiAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xuICAgICAgICAvLyDtlYTsiJgg7ZWt66qpXG4gICAgICAgIGNvbnN0IHsgY2xhc3NOYW1lLCBjaGlsZHJlbiB9ID0gdGhpcy5wcm9wcztcblxuICAgICAgICByZXR1cm4gKFxuICAgICAgICAgICAgPGRpdiBpZD17dGhpcy5pZH0gY2xhc3NOYW1lPXtjbGFzc05hbWVzKGNsYXNzTmFtZSl9PntjaGlsZHJlbn08L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBXaW5kb3c7IiwiLyoqXHJcbiAqIFRhYiBjb21wb25lbnRcclxuICpcclxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wOC8wNlxyXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiA8UHVmLlRhYiAvPlxyXG4gKlxyXG4gKiBLZW5kbyBUYWJTdHJpcCDrnbzsnbTruIzrn6zrpqzsl5Ag7KKF7IaN7KCB7J2064ukLlxyXG4gKi9cclxuJ3VzZSBzdHJpY3QnO1xyXG5cclxudmFyIFJlYWN0ID0gcmVxdWlyZSgncmVhY3QnKTtcclxuXHJcbnZhciBUYWIgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICAgICAgZGlzcGxheU5hbWU6ICdUYWInLFxyXG4gICAgICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XHJcbiAgICAgICAgICAgIC8vIO2VhOyImCDtla3rqqlcclxuICAgICAgICAgICAgcmV0dXJuIChcclxuICAgICAgICAgICAgICAgIDxsaT57dGhpcy5wcm9wcy5jaGlsZHJlbn08L2xpPlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhYjsiLCIvKipcclxuICogVGFiQ29udGVudCBjb21wb25lbnRcclxuICpcclxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wOC8wNlxyXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiA8UHVmLlRhYkNvbnRlbnQgLz5cclxuICpcclxuICogS2VuZG8gVGFiU3RyaXAg77+977+977+9zLrqt6/vv73vv73vv73vv70g77+977+977+977+977+977+977+9zLTvv70uXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIFRhYkNvbnRlbnQgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICAgICAgZGlzcGxheU5hbWU6ICdUYWJDb250ZW50JyxcclxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyDvv73KvO+/vSDvv73XuO+/vVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPGRpdj5cclxuICAgICAgICAgICAgICAgICAgICB7dGhpcy5wcm9wcy5jaGlsZHJlbn1cclxuICAgICAgICAgICAgICAgIDwvZGl2PlxyXG4gICAgICAgICAgICApO1xyXG4gICAgICAgIH1cclxufSk7XHJcblxyXG5tb2R1bGUuZXhwb3J0cyA9IFRhYkNvbnRlbnQ7IiwiLyoqXG4gKiBUYWJTdHJpcCBjb21wb25lbnRcbiAqXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzA4LzA2XG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxuICpcbiAqIGV4YW1wbGU6XG4gKiA8UHVmLlRhYlN0cmlwIGNsYXNzTmFtZT17Y2xhc3NOYW1lfSBzZWxlY3RlZEluZGV4PXswfSBvblNlbGVjdD17ZnVuY30gLz5cbiAqXG4gKiBLZW5kbyBUYWJTdHJpcCDrnbzsnbTruIzrn6zrpqzsl5Ag7KKF7IaN7KCB7J2064ukLlxuICovXG4ndXNlIHN0cmljdCc7XG5cbnZhciBSZWFjdCA9IHJlcXVpcmUoJ3JlYWN0Jyk7XG52YXIgUHJvcFR5cGVzID0gcmVxdWlyZSgncmVhY3QnKS5Qcm9wVHlwZXM7XG5cbnZhciBVdGlsID0gcmVxdWlyZSgnLi4vLi4vc2VydmljZXMvVXRpbCcpO1xuXG52YXIgVGFiU3RyaXAgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XG4gICAgZGlzcGxheU5hbWU6ICdUYWJTdHJpcCcsXG4gICAgcHJvcFR5cGVzOiB7XG4gICAgICAgIGNsYXNzTmFtZTogUHJvcFR5cGVzLnN0cmluZyxcbiAgICAgICAgc2VsZWN0ZWRJbmRleDogUHJvcFR5cGVzLm51bWJlcixcbiAgICAgICAgY29udGVudFVybHM6IFByb3BUeXBlcy5hcnJheSxcbiAgICAgICAgYW5pbWF0aW9uOiBQcm9wVHlwZXMub25lT2ZUeXBlKFtcbiAgICAgICAgICAgIFByb3BUeXBlcy5vYmplY3QsXG4gICAgICAgICAgICBQcm9wVHlwZXMuYm9vbFxuICAgICAgICBdKSxcbiAgICAgICAgdGFiUG9zaXRpb246IFByb3BUeXBlcy5vbmVPZihbJ2xlZnQnLCdyaWdodCcsJ2JvdHRvbSddKSxcbiAgICAgICAgb25TZWxlY3Q6IFByb3BUeXBlcy5mdW5jLFxuICAgICAgICBvbkFjdGl2YXRlOiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25TaG93OiBQcm9wVHlwZXMuZnVuYyxcbiAgICAgICAgb25Db250ZW50TG9hZDogUHJvcFR5cGVzLmZ1bmMsXG4gICAgICAgIG9uRXJyb3I6IFByb3BUeXBlcy5mdW5jXG4gICAgfSxcbiAgICBpZDogJycsXG4gICAgc2VsZWN0OiBmdW5jdGlvbihpbmRleCkge1xuICAgICAgICB0aGlzLnRhYnN0cmlwLnNlbGVjdChpbmRleCk7XG4gICAgfSxcbiAgICBvblNlbGVjdDogZnVuY3Rpb24oZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvblNlbGVjdCcpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGUpO1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vblNlbGVjdCA9PT0gJ2Z1bmN0aW9uJykge1xuICAgICAgICAgICAgdGhpcy5wcm9wcy5vblNlbGVjdChlKTsgLy8gZS5pdGVtLCBpbmRleCDslYzslYTrgrTshJwg64SY6riw7J6QXG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uQWN0aXZhdGU6IGZ1bmN0aW9uKGUpIHtcbiAgICAgICAgLy9jb25zb2xlLmxvZygnb25BY3RpdmF0ZScpO1xuICAgICAgICAvL2NvbnNvbGUubG9nKGUpO1xuICAgICAgICBpZih0eXBlb2YgdGhpcy5wcm9wcy5vbkFjdGl2YXRlID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uQWN0aXZhdGUoZSk7XG4gICAgICAgIH1cbiAgICB9LFxuICAgIG9uU2hvdzogZnVuY3Rpb24oZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvblNob3cnKTtcbiAgICAgICAgLy9jb25zb2xlLmxvZyhlKTtcbiAgICAgICAgaWYodHlwZW9mIHRoaXMucHJvcHMub25TaG93ID09PSAnZnVuY3Rpb24nKSB7XG4gICAgICAgICAgICB0aGlzLnByb3BzLm9uU2hvdyhlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25Db250ZW50TG9hZDogZnVuY3Rpb24oZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvbkNvbnRlbnRMb2FkJyk7XG4gICAgICAgIC8vY29uc29sZS5sb2coZSk7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uQ29udGVudExvYWQgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25Db250ZW50TG9hZChlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgb25FcnJvcjogZnVuY3Rpb24oZSkge1xuICAgICAgICAvL2NvbnNvbGUubG9nKCdvbkVycm9yJyk7XG4gICAgICAgIC8vY29uc29sZS5sb2coZSk7XG4gICAgICAgIGlmKHR5cGVvZiB0aGlzLnByb3BzLm9uRXJyb3IgPT09ICdmdW5jdGlvbicpIHtcbiAgICAgICAgICAgIHRoaXMucHJvcHMub25FcnJvcihlKTtcbiAgICAgICAgfVxuICAgIH0sXG4gICAgZ2V0Q2hpbGRyZW46IGZ1bmN0aW9uKCkge1xuICAgICAgICB2YXIgY2hpbGRyZW4gPSB0aGlzLnByb3BzLmNoaWxkcmVuLFxuICAgICAgICAgICAgY291bnQgPSAwO1xuXG4gICAgICAgIHJldHVybiBSZWFjdC5DaGlsZHJlbi5tYXAoY2hpbGRyZW4sIChjaGlsZCkgPT4ge1xuICAgICAgICAgICAgaWYoY2hpbGQgPT09IG51bGwpIHtcbiAgICAgICAgICAgICAgICByZXR1cm4gbnVsbDtcbiAgICAgICAgICAgIH1cbiAgICAgICAgICAgIHZhciByZXN1bHQ7XG5cbiAgICAgICAgICAgIC8vIFRhYnNcbiAgICAgICAgICAgIGlmKGNvdW50KysgPT09IDApIHtcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBSZWFjdC5jbG9uZUVsZW1lbnQoY2hpbGQsIHtcbiAgICAgICAgICAgICAgICAgICAgY2hpbGRyZW46IFJlYWN0LkNoaWxkcmVuLm1hcChjaGlsZC5wcm9wcy5jaGlsZHJlbiwgKHRhYikgPT4ge1xuICAgICAgICAgICAgICAgICAgICAgICAgaWYodGFiID09PSBudWxsKSB7XG4gICAgICAgICAgICAgICAgICAgICAgICAgICAgcmV0dXJuIG51bGw7XG4gICAgICAgICAgICAgICAgICAgICAgICB9XG5cbiAgICAgICAgICAgICAgICAgICAgICAgIHJldHVybiBSZWFjdC5jbG9uZUVsZW1lbnQodGFiKTtcbiAgICAgICAgICAgICAgICAgICAgfSlcbiAgICAgICAgICAgICAgICB9KTtcblxuICAgICAgICAgICAgfWVsc2Uge1xuICAgICAgICAgICAgICAgIC8vIFRhYkNvbnRlbnRcbiAgICAgICAgICAgICAgICByZXN1bHQgPSBSZWFjdC5jbG9uZUVsZW1lbnQoY2hpbGQpO1xuICAgICAgICAgICAgfVxuICAgICAgICAgICAgcmV0dXJuIHJlc3VsdDtcbiAgICAgICAgfSk7XG4gICAgfSxcbiAgICBnZXRPcHRpb25zOiBmdW5jdGlvbigpIHtcbiAgICAgICAgY29uc3Qge2FuaW1hdGlvbiwgY29udGVudFVybHMsIHRhYlBvc2l0aW9ufSA9IHRoaXMucHJvcHM7XG5cbiAgICAgICAgLy8gYW5pbWF0aW9uIChmYWxzZXxvYmplY3QpIHRydWXripQg7Jyg7Zqo7ZWY7KeAIOyViuydjFxuICAgICAgICB2YXIgX2FuaW1hdGlvbjtcbiAgICAgICAgaWYodHlwZW9mIGFuaW1hdGlvbiA9PT0gJ2Jvb2xlYW4nICYmIGFuaW1hdGlvbiA9PT0gdHJ1ZSkge1xuICAgICAgICAgICAgX2FuaW1hdGlvbiA9IHtcbiAgICAgICAgICAgICAgICBvcGVuOiB7XG4gICAgICAgICAgICAgICAgICAgIGVmZmVjdHM6ICdmYWRlSW4nXG4gICAgICAgICAgICAgICAgfVxuICAgICAgICAgICAgfVxuICAgICAgICB9ZWxzZSB7XG4gICAgICAgICAgICBfYW5pbWF0aW9uID0gYW5pbWF0aW9uO1xuICAgICAgICB9XG5cbiAgICAgICAgdmFyIG9wdGlvbnMgPSB7XG4gICAgICAgICAgICBhbmltYXRpb246IF9hbmltYXRpb25cbiAgICAgICAgfTtcblxuICAgICAgICAvLyB0YWJQb3NpdGlvblxuICAgICAgICBpZih0YWJQb3NpdGlvbikge1xuICAgICAgICAgICAgJC5leHRlbmQob3B0aW9ucywge3RhYlBvc2l0aW9uOiB0YWJQb3NpdGlvbn0pO1xuICAgICAgICB9XG5cbiAgICAgICAgLy8gY29udGVudFVybHNcbiAgICAgICAgaWYoY29udGVudFVybHMpIHtcbiAgICAgICAgICAgICQuZXh0ZW5kKG9wdGlvbnMsIHtjb250ZW50VXJsczogY29udGVudFVybHN9KTtcbiAgICAgICAgfVxuXG4gICAgICAgIHJldHVybiBvcHRpb25zO1xuICAgIH0sXG4gICAgZ2V0RGVmYXVsdFByb3BzOiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7YG0656Y7Iqk6rCAIOyDneyEseuQoCDrlYwg7ZWc67KIIO2YuOy2nOuQmOqzoCDsupDsi5zrkJzri6QuXG4gICAgICAgIC8vIOu2gOuqqCDsu7Ttj6zrhIztirjsl5DshJwgcHJvcOydtCDrhJjslrTsmKTsp4Ag7JWK7J2AIOqyveyasCAoaW4g7Jew7IKw7J6Q66GcIO2ZleyduCkg66ek7ZWR7J2YIOqwkuydtCB0aGlzLnByb3Bz7JeQIOyEpOygleuQnOuLpC5cbiAgICAgICAgcmV0dXJuIHtzZWxlY3RlZEluZGV4OiAwLCBhbmltYXRpb246IGZhbHNlfTtcbiAgICB9LFxuICAgIGdldEluaXRpYWxTdGF0ZTogZnVuY3Rpb24oKSB7XG5cbiAgICAgICAgcmV0dXJuIHt9O1xuICAgIH0sXG4gICAgY29tcG9uZW50V2lsbE1vdW50OiBmdW5jdGlvbigpIHtcbiAgICAgICAgLy8g7LWc7LSIIOugjOuNlOungeydtCDsnbzslrTrgpjquLAg7KeB7KCEKO2VnOuyiCDtmLjstpwpXG4gICAgICAgIGxldCBpZCA9IHRoaXMucHJvcHMuaWQ7XG4gICAgICAgIGlmKHR5cGVvZiBpZCA9PT0gJ3VuZGVmaW5lZCcpIHtcbiAgICAgICAgICAgIGlkID0gVXRpbC5nZXRVVUlEKCk7XG4gICAgICAgIH1cblxuICAgICAgICB0aGlzLmlkID0gaWQ7XG4gICAgfSxcbiAgICBjb21wb25lbnREaWRNb3VudDogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIOy1nOy0iCDroIzrjZTrp4HsnbQg7J287Ja064KcIOuLpOydjCjtlZzrsogg7Zi47LacKVxuICAgICAgICB0aGlzLiR0YWJzdHJpcCA9ICQoJyMnK3RoaXMuaWQpO1xuICAgICAgICB0aGlzLnRhYnN0cmlwID0gdGhpcy4kdGFic3RyaXAua2VuZG9UYWJTdHJpcCh0aGlzLmdldE9wdGlvbnMoKSkuZGF0YSgna2VuZG9UYWJTdHJpcCcpO1xuXG4gICAgICAgIC8vIEV2ZW50c1xuICAgICAgICB0aGlzLnRhYnN0cmlwLmJpbmQoJ3NlbGVjdCcsIHRoaXMub25TZWxlY3QpO1xuICAgICAgICB0aGlzLnRhYnN0cmlwLmJpbmQoJ2FjdGl2YXRlJywgdGhpcy5vbkFjdGl2YXRlKTtcbiAgICAgICAgdGhpcy50YWJzdHJpcC5iaW5kKCdzaG93JywgdGhpcy5vblNob3cpO1xuICAgICAgICB0aGlzLnRhYnN0cmlwLmJpbmQoJ2NvbnRlbnRMb2FkJywgdGhpcy5vbkNvbnRlbnRMb2FkKTtcbiAgICAgICAgdGhpcy50YWJzdHJpcC5iaW5kKCdlcnJvcicsIHRoaXMub25FcnJvcik7XG5cbiAgICAgICAgdGhpcy5zZWxlY3QodGhpcy5wcm9wcy5zZWxlY3RlZEluZGV4KTtcbiAgICB9LFxuICAgIHJlbmRlcjogZnVuY3Rpb24oKSB7XG4gICAgICAgIC8vIO2VhOyImCDtla3rqqlcbiAgICAgICAgcmV0dXJuIChcbiAgICAgICAgICAgIDxkaXYgaWQ9e3RoaXMuaWR9IGNsYXNzTmFtZT17dGhpcy5wcm9wcy5jbGFzc05hbWV9PlxuICAgICAgICAgICAgICAgIHt0aGlzLmdldENoaWxkcmVuKCl9XG4gICAgICAgICAgICA8L2Rpdj5cbiAgICAgICAgKTtcbiAgICB9XG59KTtcblxubW9kdWxlLmV4cG9ydHMgPSBUYWJTdHJpcDsiLCIvKipcclxuICogVGFicyBjb21wb25lbnRcclxuICpcclxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wOC8wNlxyXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxyXG4gKlxyXG4gKiBleGFtcGxlOlxyXG4gKiA8UHVmLlRhYnMgLz5cclxuICpcclxuICogS2VuZG8gVGFiU3RyaXAg77+977+977+9zLrqt6/vv73vv73vv73vv70g77+977+977+977+977+977+977+9zLTvv70uXHJcbiAqL1xyXG4ndXNlIHN0cmljdCc7XHJcblxyXG52YXIgUmVhY3QgPSByZXF1aXJlKCdyZWFjdCcpO1xyXG5cclxudmFyIFRhYnMgPSBSZWFjdC5jcmVhdGVDbGFzcyh7XHJcbiAgICAgICAgZGlzcGxheU5hbWU6ICdUYWJzJyxcclxuICAgICAgICByZW5kZXI6IGZ1bmN0aW9uKCkge1xyXG4gICAgICAgICAgICAvLyDvv73KvO+/vSDvv73XuO+/vVxyXG4gICAgICAgICAgICByZXR1cm4gKFxyXG4gICAgICAgICAgICAgICAgPHVsPnt0aGlzLnByb3BzLmNoaWxkcmVufTwvdWw+XHJcbiAgICAgICAgICAgICk7XHJcbiAgICAgICAgfVxyXG59KTtcclxuXHJcbm1vZHVsZS5leHBvcnRzID0gVGFiczsiLCIvKipcbiAqIHBzLXV0aWwgc2VydmljZXNcbiAqIFxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wMy8wMVxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqIFxuICogZXhhbXBsZTpcbiAqIGFwcC5jb250cm9sbGVyKCdDdHJsJywgWyckc2NvcGUnLCAncHNVdGlsJywgZnVuY3Rpb24oJHNjb3BlLCBwc1V0aWwpIHtcbiAqIFx0ICAgdmFyIHJvb3RQYXRoID0gcHNVdGlsLmdldFJvb3RQYXRoKCk7XG4gKiB9XSk7XG4gKiBcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG5mdW5jdGlvbiBnZXREYXRlVG9TdHJpbmcoZGF0ZSkge1xuXHR2YXIgeWVhciA9IGRhdGUuZ2V0RnVsbFllYXIoKSxcblx0XHRtb250aCA9IHplcm9maWxsKGRhdGUuZ2V0TW9udGgoKSArIDEsIDIpLFxuXHRcdGRheSA9IHplcm9maWxsKGRhdGUuZ2V0RGF0ZSgpLCAyKSxcblx0XHRob3VycyA9IChkYXRlLmdldEhvdXJzKCkgPCAwKSA/ICcwMCcgOiB6ZXJvZmlsbChkYXRlLmdldEhvdXJzKCksIDIpLFx0Ly8gZGF0ZXJhbmdlcGlja2VyIGhvdXJzIDnsi5zqsIQg7Jik67KE7ZGc7Iuc65CY64qUIOuyhOq3uOuhnCDsnbjtlbQg67m87KSA64ukLlxuXHRcdG1pbnV0ZXMgPSB6ZXJvZmlsbChkYXRlLmdldE1pbnV0ZXMoKSwgMiksXG5cdFx0c2Vjb25kcyA9IHplcm9maWxsKGRhdGUuZ2V0U2Vjb25kcygpLCAyKSxcblx0XHRkYXRlU3RyaW5nID0geWVhciArICctJyArIG1vbnRoICsgJy0nICsgZGF5ICsgJyAnICsgaG91cnMgKyAnOicgKyBtaW51dGVzICsgJzonICsgc2Vjb25kcztcblxuXHRyZXR1cm4gZGF0ZVN0cmluZztcbn1cblxuZnVuY3Rpb24gemVyb2ZpbGwobiwgZGlnaXRzKSB7XG5cdHZhciB6ZXJvID0gJyc7XG5cdG4gPSBuLnRvU3RyaW5nKCk7XG5cblx0aWYgKG4ubGVuZ3RoIDwgZGlnaXRzKSB7XG5cdFx0Zm9yICh2YXIgaSA9IDA7IGkgPCBkaWdpdHMgLSBuLmxlbmd0aDsgaSsrKSB7XG5cdFx0XHR6ZXJvICs9ICcwJztcblx0XHR9XG5cdH1cblxuXHRyZXR1cm4gemVybyArIG47XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRnZXREYXRlVG9TdHJpbmc6IGdldERhdGVUb1N0cmluZ1xufTsiLCIvKipcbiAqIE51bWJlclV0aWwgc2VydmljZXNcbiAqIFxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wNS8xOVxuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqIFxuICogZXhhbXBsZTpcbiAqIHZhciBOdW1iZXJVdGlsID0gcmVxdWlyZSgnLi4vc2VydmljZXMvTnVtYmVyVXRpbCcpO1xuICogTnVtYmVyVXRpbC5kaWdpdCgpO1xuICpcbiAqIFB1Zi5OdW1iZXJVdGlsLmRpZ2l0KCk7XG4gKi9cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZGlnaXQoaSkge1xuXHR2YXIgZGlzcGxheVRleHQ7XG5cdGlmKGk8MTApIHtcblx0XHRkaXNwbGF5VGV4dCA9ICcwJytpO1xuXHR9ZWxzZSB7XG5cdFx0ZGlzcGxheVRleHQgPSBpLnRvU3RyaW5nKCk7XG5cdH1cblx0cmV0dXJuIGRpc3BsYXlUZXh0O1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0ZGlnaXQ6IGRpZ2l0XG59OyIsIi8qKlxuICogUmVnRXhwIHNlcnZpY2VzXG4gKiBcbiAqIHZlcnNpb24gPHR0PiQgVmVyc2lvbjogMS4wICQ8L3R0PiBkYXRlOjIwMTYvMDUvMjBcbiAqIGF1dGhvciA8YSBocmVmPVwibWFpbHRvOmhyYWhuQG5raWEuY28ua3JcIj5BaG4gSHl1bmctUm88L2E+XG4gKiBcbiAqIGV4YW1wbGU6XG4gKiB2YXIgUmVnRXhwID0gcmVxdWlyZSgnLi4vc2VydmljZXMvUmVnRXhwJyk7XG4gKiBSZWdFeHAuY2hlY2tFbWFpbChzdHJWYWx1ZSk7XG4gKlxuICogUHVmLlJlZ0V4cC5jaGVja0VtYWlsKHN0clZhbHVlKTtcbiAqL1xuJ3VzZSBzdHJpY3QnO1xuXG52YXIgcmVnRXhwX0VNQUlMID0gL1swLTlhLXpBLVpdW18wLTlhLXpBLVotXSpAW18wLTlhLXpBLVotXSsoXFwuW18wLTlhLXpBLVotXSspezEsMn0kLztcblxuZnVuY3Rpb24gY2hlY2tFbWFpbChzdHJWYWx1ZSkge1xuXHRpZiAoIXN0clZhbHVlLm1hdGNoKHJlZ0V4cF9FTUFJTCkpIHtcblx0XHRyZXR1cm4gZmFsc2U7XG5cdH1cblx0cmV0dXJuIHRydWU7XG59XG5cbm1vZHVsZS5leHBvcnRzID0ge1xuXHRjaGVja0VtYWlsOiBjaGVja0VtYWlsXG59OyIsIi8qKlxuICogUmVzb3VyY2Ugc2VydmljZXNcbiAqIFxuICogdmVyc2lvbiA8dHQ+JCBWZXJzaW9uOiAxLjAgJDwvdHQ+IGRhdGU6MjAxNi8wNi8wM1xuICogYXV0aG9yIDxhIGhyZWY9XCJtYWlsdG86aHJhaG5AbmtpYS5jby5rclwiPkFobiBIeXVuZy1SbzwvYT5cbiAqIFxuICogZXhhbXBsZTpcbiAqIFB1Zi5SZXNvdXJjZS5sb2FkUmVzb3VyY2UoKTtcbiAqIFB1Zi5SZXNvdXJjZS5pMThuKGtleSk7XG4gKlxuICog64uk6rWt7Ja0IOyymOumrFxuICovXG4ndXNlIHN0cmljdCc7XG5cbi8vIGxvYWQgcHJvcGVydGllc1xudmFyIGxvYWRSZXNvdXJjZSA9IGZ1bmN0aW9uKG5hbWUsIHBhdGgsIG1vZGUsIGxhbmd1YWdlLCBjYWxsYmFjaykge1xuXG5cdCQuaTE4bi5wcm9wZXJ0aWVzKHtcblx0ICAgIG5hbWU6IG5hbWUsXG5cdCAgICBwYXRoOiBwYXRoLFxuXHQgICAgbW9kZTogbW9kZSxcblx0ICAgIGxhbmd1YWdlOiBsYW5ndWFnZSxcblx0ICAgIGNhbGxiYWNrOiBjYWxsYmFja1xuXHRcdC8qXG5cdFx0ZnVuY3Rpb24oKSB7XG5cdFx0XHQvLyBBY2Nlc3NpbmcgYSBzaW1wbGUgdmFsdWUgdGhyb3VnaCB0aGUgbWFwXG5cdFx0XHRqUXVlcnkuaTE4bi5wcm9wKCdtc2dfaGVsbG8nKTtcblx0XHRcdC8vIEFjY2Vzc2luZyBhIHZhbHVlIHdpdGggcGxhY2Vob2xkZXJzIHRocm91Z2ggdGhlIG1hcFxuXHRcdFx0alF1ZXJ5LmkxOG4ucHJvcCgnbXNnX2NvbXBsZXgnLCAnSm9obicpO1xuXHRcblx0XHRcdC8vIEFjY2Vzc2luZyBhIHNpbXBsZSB2YWx1ZSB0aHJvdWdoIGEgSlMgdmFyaWFibGVcblx0XHRcdGFsZXJ0KG1zZ19oZWxsbyArJyAnKyBtc2dfd29ybGQpO1xuXHRcdFx0Ly8gQWNjZXNzaW5nIGEgdmFsdWUgd2l0aCBwbGFjZWhvbGRlcnMgdGhyb3VnaCBhIEpTIGZ1bmN0aW9uXG5cdFx0XHRhbGVydChtc2dfY29tcGxleCgnSm9obicpKTtcblx0XHRcdGFsZXJ0KG1zZ19oZWxsbyk7XG5cdCAgICB9XG5cdCAgICAqL1xuXHR9KTtcbn07XG5cbnZhciBpMThuID0gZnVuY3Rpb24oa2V5KSB7XG5cdC8vdmFyIGFyZ3MgPSAnXFwnJyArIGtleSArICdcXCcnO1xuXHQvL2ZvciAodmFyIGk9MTsgaTxhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcbiAgICAgLy8gICBhcmdzICs9ICcsIFxcJycgKyBhcmd1bWVudHNbaV0gKyAnXFwnJztcblx0Ly99XG5cdC8vcmV0dXJuIGV2YWwoJyQuaTE4bi5wcm9wKCcgKyBhcmdzICsgJyknKTtcblx0cmV0dXJuICQuaTE4bi5wcm9wLmFwcGx5KHRoaXMsIGFyZ3VtZW50cyk7XG59O1xuXG52YXIgaTE4bkJ5S2V5ID0gZnVuY3Rpb24oa2V5KSB7XG5cdC8vdmFyIGFyZ3MgPSAnXFwnJyArIGtleSArICdcXCcnO1xuXHQvL2ZvciAodmFyIGk9MTsgaTxhcmd1bWVudHMubGVuZ3RoOyBpKyspIHtcblx0Ly9cdGFyZ3MgKz0gJywgXFwnJyArICQuaTE4bi5wcm9wKGFyZ3VtZW50c1tpXSkgKyAnXFwnJztcblx0Ly99XG5cdC8vcmV0dXJuIGV2YWwoJyQuaTE4bi5wcm9wKCcgKyBhcmdzICsgJyknKTtcblx0dmFyIGFyZ3MgPSBba2V5XTtcblx0Zm9yICh2YXIgaT0xOyBpPGFyZ3VtZW50cy5sZW5ndGg7IGkrKykge1xuXHRcdGFyZ3MucHVzaCgkLmkxOG4ucHJvcChhcmd1bWVudHNbaV0pKTtcblx0fVxuXHRyZXR1cm4gJC5pMThuLnByb3AuYXBwbHkodGhpcywgYXJncyk7XG59O1xuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0bG9hZFJlc291cmNlOiBsb2FkUmVzb3VyY2UsXG5cdGkxOG46IGkxOG4sXG5cdGkxOG5CeUtleTogaTE4bkJ5S2V5XG59OyIsIi8qKlxuICogVXRpbCBzZXJ2aWNlc1xuICogXG4gKiB2ZXJzaW9uIDx0dD4kIFZlcnNpb246IDEuMCAkPC90dD4gZGF0ZToyMDE2LzAzLzAxXG4gKiBhdXRob3IgPGEgaHJlZj1cIm1haWx0bzpocmFobkBua2lhLmNvLmtyXCI+QWhuIEh5dW5nLVJvPC9hPlxuICogXG4gKiBleGFtcGxlOlxuICogdmFyIFV0aWwgPSByZXF1aXJlKCcuLi9zZXJ2aWNlcy9VdGlsJyk7XG4gKiBVdGlsLmdldFVVSUQoKTtcbiAqXG4gKi9cbid1c2Ugc3RyaWN0JztcblxuZnVuY3Rpb24gZ2V0VVVJRCgpIHtcblx0cmV0dXJuICd4eHh4eHh4eC14eHh4LTR4eHgteXh4eC14eHh4eHh4eHh4eHgnLnJlcGxhY2UoL1t4eV0vZywgZnVuY3Rpb24oYykge1xuXHRcdHZhciByID0gTWF0aC5yYW5kb20oKSoxNnwwLCB2ID0gYyA9PSAneCcgPyByIDogKHImMHgzfDB4OCk7XG5cdFx0cmV0dXJuIHYudG9TdHJpbmcoMTYpO1xuXHR9KTtcbn1cblxuZnVuY3Rpb24gdW5pcXVlSUQoKSB7XG5cdHJldHVybiAnaWQtJyArIE1hdGgucmFuZG9tKCkudG9TdHJpbmcoMzYpLnN1YnN0cigyLCA5KTtcbn1cblxuZnVuY3Rpb24gc2xlZXAobWlsbGlzZWNvbmRzKSB7XG5cdHZhciBzdGFydCA9IG5ldyBEYXRlKCkuZ2V0VGltZSgpO1xuXHRmb3IgKHZhciBpID0gMDsgaSA8IDFlNzsgaSsrKSB7XG5cdFx0aWYgKChuZXcgRGF0ZSgpLmdldFRpbWUoKSAtIHN0YXJ0KSA+IG1pbGxpc2Vjb25kcykge1xuXHRcdFx0YnJlYWs7XG5cdFx0fVxuXHR9XG59XG5cbi8vIOyLnOyeke2OmOydtOyngOuhnCDshKTsoJVcbmZ1bmN0aW9uIHNldFN0YXJ0UGFnZShvYmosIHVybCkge1xuXHRvYmouc3R5bGUuYmVoYXZpb3I9J3VybCgjZGVmYXVsdCNob21lcGFnZSknO1xuXHQvL29iai5zZXRIb21lUGFnZSgnaHR0cDovL2ludGVybmV0LnNjb3VydC5nby5rci8nKTtcblx0b2JqLnNldEhvbWVQYWdlKHVybCk7XG59XG5cbi8vIOy/oO2CpCDshKTsoJVcbi8qXG5mdW5jdGlvbiBzZXRDb29raWUobmFtZSwgdmFsdWUsIGV4cGlyZXMpIHtcblx0Ly8gYWxlcnQobmFtZSArIFwiLCBcIiArIHZhbHVlICsgXCIsIFwiICsgZXhwaXJlcyk7XG5cdGRvY3VtZW50LmNvb2tpZSA9IG5hbWUgKyBcIj1cIiArIGVzY2FwZSh2YWx1ZSkgKyBcIjsgcGF0aD0vOyBleHBpcmVzPVwiICsgZXhwaXJlcy50b0dNVFN0cmluZygpO1xufVxuKi9cbmZ1bmN0aW9uIHNldENvb2tpZShjbmFtZSwgY3ZhbHVlLCBleGRheXMsIGNkb21haW4pIHtcblx0dmFyIGQgPSBuZXcgRGF0ZSgpO1xuXHRkLnNldFRpbWUoZC5nZXRUaW1lKCkgKyAoZXhkYXlzKjI0KjYwKjYwKjEwMDApKTtcblx0dmFyIGV4cGlyZXMgPSAnZXhwaXJlcz0nICsgZC50b1VUQ1N0cmluZygpO1xuXHR2YXIgZG9tYWluO1xuXHRpZihjZG9tYWluKSB7XG5cdFx0ZG9tYWluID0gJzsgZG9tYWluPScgKyBjZG9tYWluO1xuXHR9XG5cdGRvY3VtZW50LmNvb2tpZSA9IGNuYW1lICsgJz0nICsgZXNjYXBlKGN2YWx1ZSkgKyAnOyBwYXRoPS87ICcgKyBleHBpcmVzICsgZG9tYWluO1xufVxuXG4vLyDsv6DtgqQg6rCA7KC47Jik6riwXG4vKlxuZnVuY3Rpb24gZ2V0Q29va2llKE5hbWUpIHtcblx0dmFyIHNlYXJjaCA9IE5hbWUgKyBcIj1cIlxuXHRpZiAoZG9jdW1lbnQuY29va2llLmxlbmd0aCA+IDApIHsgLy8g7L+g7YKk6rCAIOyEpOygleuQmOyWtCDsnojri6TrqbRcblx0XHRvZmZzZXQgPSBkb2N1bWVudC5jb29raWUuaW5kZXhPZihzZWFyY2gpXG5cdFx0aWYgKG9mZnNldCAhPSAtMSkgeyAvLyDsv6DtgqTqsIAg7KG07J6s7ZWY66m0XG5cdFx0XHRvZmZzZXQgKz0gc2VhcmNoLmxlbmd0aFxuXHRcdFx0Ly8gc2V0IGluZGV4IG9mIGJlZ2lubmluZyBvZiB2YWx1ZVxuXHRcdFx0ZW5kID0gZG9jdW1lbnQuY29va2llLmluZGV4T2YoXCI7XCIsIG9mZnNldClcblx0XHRcdC8vIOy/oO2CpCDqsJLsnZgg66eI7KeA66eJIOychOy5mCDsnbjrjbHsiqQg67KI7Zi4IOyEpOyglVxuXHRcdFx0aWYgKGVuZCA9PSAtMSlcblx0XHRcdFx0ZW5kID0gZG9jdW1lbnQuY29va2llLmxlbmd0aFxuXHRcdFx0cmV0dXJuIHVuZXNjYXBlKGRvY3VtZW50LmNvb2tpZS5zdWJzdHJpbmcob2Zmc2V0LCBlbmQpKVxuXHRcdH1cblx0fVxuXHRyZXR1cm4gXCJcIjtcbn1cbiovXG5mdW5jdGlvbiBnZXRDb29raWUoY25hbWUpIHtcblx0dmFyIG5hbWUgPSBjbmFtZSArICc9Jztcblx0dmFyIGNhID0gZG9jdW1lbnQuY29va2llLnNwbGl0KCc7Jyk7XG5cdGZvcih2YXIgaSA9IDA7IGkgPGNhLmxlbmd0aDsgaSsrKSB7XG5cdFx0dmFyIGMgPSBjYVtpXTtcblx0XHR3aGlsZSAoYy5jaGFyQXQoMCk9PScgJykge1xuXHRcdFx0YyA9IGMuc3Vic3RyaW5nKDEpO1xuXHRcdH1cblx0XHRpZiAoYy5pbmRleE9mKG5hbWUpID09IDApIHtcblx0XHRcdHJldHVybiB1bmVzY2FwZShjLnN1YnN0cmluZyhuYW1lLmxlbmd0aCwgYy5sZW5ndGgpKTtcblx0XHR9XG5cdH1cblx0cmV0dXJuICcnO1xufVxuXG5tb2R1bGUuZXhwb3J0cyA9IHtcblx0Z2V0VVVJRDogZ2V0VVVJRCxcblx0dW5pcXVlSUQ6IHVuaXF1ZUlELFxuXHRzbGVlcDogc2xlZXAsXG5cdHNldENvb2tpZTogc2V0Q29va2llLFxuXHRnZXRDb29raWU6IGdldENvb2tpZVxufTtcblxuLy9hbmd1bGFyLm1vZHVsZSgncHMuc2VydmljZXMudXRpbCcsIFtdKVxuLy8uZmFjdG9yeSgncHNVdGlsJywgWyckd2luZG93JywgJyRsb2NhdGlvbicsIGZ1bmN0aW9uKCR3aW5kb3csICRsb2NhdGlvbikge1xuLy9cdHZhciBmYWN0b3J5ID0ge307XG4vL1x0ZmFjdG9yeS5zaG93ID0gZnVuY3Rpb24obXNnKSB7XG4vLyAgICAgICAgJHdpbmRvdy5hbGVydChtc2cpO1xuLy8gICAgfTtcbi8vXG4vLyAgICBmYWN0b3J5LnJldmVyc2UgPSBmdW5jdGlvbihuYW1lKSB7XG4vL1x0XHRyZXR1cm4gbmFtZS5zcGxpdChcIlwiKS5yZXZlcnNlKCkuam9pbihcIlwiKTtcbi8vXHR9O1xuLy9cbi8vXHQvLyByb290IHBhdGhcbi8vXHRmYWN0b3J5LmdldFJvb3RQYXRoID0gZnVuY3Rpb24oKSB7XG4vL1x0XHQvLyBqc+yXkOyEnCBDb250ZXh0UGF0aCDrpbwg7Ja77J2EIOyImCDsl4bsnYwgLSBSb290IFBhdGjrpbwg7Ja77Ja07IScIOydkeyaqe2VmOyekC5cbi8vXHRcdC8qdmFyIG9mZnNldD1sb2NhdGlvbi5ocmVmLmluZGV4T2YobG9jYXRpb24uaG9zdCkrbG9jYXRpb24uaG9zdC5sZW5ndGg7XG4vL1x0ICAgIHZhciBjdHhQYXRoPWxvY2F0aW9uLmhyZWYuc3Vic3RyaW5nKG9mZnNldCxsb2NhdGlvbi5ocmVmLmluZGV4T2YoJy8nLG9mZnNldCsxKSk7XG4vL1x0ICAgIHJldHVybiBjdHhQYXRoOyovXG4vL1xuLy9cdCAgICB2YXIgb2Zmc2V0ID0gJHdpbmRvdy5sb2NhdGlvbi5ocmVmLmluZGV4T2YoJHdpbmRvdy5sb2NhdGlvbi5ob3N0KSArICR3aW5kb3cubG9jYXRpb24uaG9zdC5sZW5ndGg7XG4vL1x0ICAgIHZhciBjdHhQYXRoID0gJHdpbmRvdy5sb2NhdGlvbi5ocmVmLnN1YnN0cmluZyhvZmZzZXQsICR3aW5kb3cubG9jYXRpb24uaHJlZi5pbmRleE9mKCcvJywgb2Zmc2V0ICsgMSkpO1xuLy9cdCAgICByZXR1cm4gY3R4UGF0aDtcbi8vXHR9O1xuLy9cbi8vXHQvLyB1dWlkXG4vL1x0ZmFjdG9yeS5nZXRVVUlEID0gZnVuY3Rpb24oKSB7XG4vL1x0XHRyZXR1cm4gJ3h4eHh4eHh4LXh4eHgtNHh4eC15eHh4LXh4eHh4eHh4eHh4eCcucmVwbGFjZSgvW3h5XS9nLCBmdW5jdGlvbihjKSB7XG4vL1x0XHRcdHZhciByID0gTWF0aC5yYW5kb20oKSoxNnwwLCB2ID0gYyA9PSAneCcgPyByIDogKHImMHgzfDB4OCk7XG4vL1x0XHRcdHJldHVybiB2LnRvU3RyaW5nKDE2KTtcbi8vXHRcdH0pO1xuLy9cdH07XG4vL1xuLy9cdC8vIHRvb2x0aXBcbi8vXHRmYWN0b3J5LnRvb2x0aXAgPSBmdW5jdGlvbihzZWxlY3Rvcikge1xuLy9cbi8vXHRcdGlmKHR5cGVvZiBzZWxlY3RvciA9PT0gJ3VuZGVmaW5lZCcpIHtcbi8vXHRcdFx0c2VsZWN0b3IgPSAnW2RhdGEtdG9nZ2xlPVwidG9vbHRpcFwiXSc7XG4vL1x0XHR9XG4vLy8vXHRcdCQoc2VsZWN0b3IpLmJzVG9vbHRpcCgpO1xuLy9cdFx0JChzZWxlY3RvcikudG9vbHRpcCgpO1xuLy9cdH07XG4vL1xuLy8gICAgcmV0dXJuIGZhY3Rvcnk7XG4vL31dKTtcbiJdfQ==
