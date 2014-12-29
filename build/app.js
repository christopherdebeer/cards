(function e(t,n,r){function s(o,u){if(!n[o]){if(!t[o]){var a=typeof require=="function"&&require;if(!u&&a)return a(o,!0);if(i)return i(o,!0);var f=new Error("Cannot find module '"+o+"'");throw f.code="MODULE_NOT_FOUND",f}var l=n[o]={exports:{}};t[o][0].call(l.exports,function(e){var n=t[o][1][e];return s(n?n:e)},l,l.exports,e,t,n,r)}return n[o].exports}var i=typeof require=="function"&&require;for(var o=0;o<r.length;o++)s(r[o]);return s})({1:[function(require,module,exports){
var $, Backbone, CardCollectionView, Marionette, viewDeps, _;

_ = require('underscore');

Backbone = require('backbone');

Backbone.$ = $ = require('jquery');

Marionette = require('backbone.marionette');

Marionette.$ = Backbone.$;

viewDeps = {
  $: $,
  _: _,
  Backbone: Backbone,
  Marionette: Marionette
};

CardCollectionView = require('./views/CardCollectionView.coffee')(viewDeps);

$(function() {
  var region, view;
  require('./views/AppView.scss');
  region = new Marionette.Region({
    el: $('#app')[0]
  });
  view = new CardCollectionView({
    collection: new Backbone.Collection([{}, {}])
  });
  return region.show(view);
});



},{"./views/AppView.scss":12,"./views/CardCollectionView.coffee":13,"backbone":7,"backbone.marionette":3,"jquery":8,"underscore":11}],2:[function(require,module,exports){
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = function() {
  var Card;
  return Card = (function(_super) {
    __extends(Card, _super);

    function Card() {
      return Card.__super__.constructor.apply(this, arguments);
    }

    Card.prototype.initialize = function(_arg) {
      this.title = _arg.title, this.description = _arg.description, this.img = _arg.img;
    };

    return Card;

  })(Backbone.Model);
};



},{}],3:[function(require,module,exports){
// MarionetteJS (Backbone.Marionette)
// ----------------------------------
// v2.3.0
//
// Copyright (c)2014 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://marionettejs.com

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore', 'backbone.wreqr', 'backbone.babysitter'], function(Backbone, _) {
      return (root.Marionette = root.Mn = factory(root, Backbone, _));
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    var Wreqr = require('backbone.wreqr');
    var BabySitter = require('backbone.babysitter');
    module.exports = factory(root, Backbone, _);
  } else {
    root.Marionette = root.Mn = factory(root, root.Backbone, root._);
  }

}(this, function(root, Backbone, _) {
  'use strict';

  var previousMarionette = root.Marionette;
  var previousMn = root.Mn;

  var Marionette = Backbone.Marionette = {};

  Marionette.VERSION = '2.3.0';

  Marionette.noConflict = function() {
    root.Marionette = previousMarionette;
    root.Mn = previousMn;
    return this;
  };

  // Get the Deferred creator for later use
  Marionette.Deferred = Backbone.$.Deferred;

  /* jshint unused: false *//* global console */
  
  // Helpers
  // -------
  
  // Marionette.extend
  // -----------------
  
  // Borrow the Backbone `extend` method so we can use it as needed
  Marionette.extend = Backbone.Model.extend;
  
  // Marionette.isNodeAttached
  // -------------------------
  
  // Determine if `el` is a child of the document
  Marionette.isNodeAttached = function(el) {
    return Backbone.$.contains(document.documentElement, el);
  };
  
  
  // Marionette.getOption
  // --------------------
  
  // Retrieve an object, function or other value from a target
  // object or its `options`, with `options` taking precedence.
  Marionette.getOption = function(target, optionName) {
    if (!target || !optionName) { return; }
    if (target.options && (target.options[optionName] !== undefined)) {
      return target.options[optionName];
    } else {
      return target[optionName];
    }
  };
  
  // Proxy `Marionette.getOption`
  Marionette.proxyGetOption = function(optionName) {
    return Marionette.getOption(this, optionName);
  };
  
  // Marionette.normalizeMethods
  // ----------------------
  
  // Pass in a mapping of events => functions or function names
  // and return a mapping of events => functions
  Marionette.normalizeMethods = function(hash) {
    return _.reduce(hash, function(normalizedHash, method, name) {
      if (!_.isFunction(method)) {
        method = this[method];
      }
      if (method) {
        normalizedHash[name] = method;
      }
      return normalizedHash;
    }, {}, this);
  };
  
  // utility method for parsing @ui. syntax strings
  // into associated selector
  Marionette.normalizeUIString = function(uiString, ui) {
    return uiString.replace(/@ui\.[a-zA-Z_$0-9]*/g, function(r) {
      return ui[r.slice(4)];
    });
  };
  
  // allows for the use of the @ui. syntax within
  // a given key for triggers and events
  // swaps the @ui with the associated selector.
  // Returns a new, non-mutated, parsed events hash.
  Marionette.normalizeUIKeys = function(hash, ui) {
    return _.reduce(hash, function(memo, val, key) {
      var normalizedKey = Marionette.normalizeUIString(key, ui);
      memo[normalizedKey] = val;
      return memo;
    }, {});
  };
  
  // allows for the use of the @ui. syntax within
  // a given value for regions
  // swaps the @ui with the associated selector
  Marionette.normalizeUIValues = function(hash, ui) {
    _.each(hash, function(val, key) {
      if (_.isString(val)) {
        hash[key] = Marionette.normalizeUIString(val, ui);
      }
    });
    return hash;
  };
  
  // Mix in methods from Underscore, for iteration, and other
  // collection related features.
  // Borrowing this code from Backbone.Collection:
  // http://backbonejs.org/docs/backbone.html#section-121
  Marionette.actAsCollection = function(object, listProperty) {
    var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
      'select', 'reject', 'every', 'all', 'some', 'any', 'include',
      'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
      'last', 'without', 'isEmpty', 'pluck'];
  
    _.each(methods, function(method) {
      object[method] = function() {
        var list = _.values(_.result(this, listProperty));
        var args = [list].concat(_.toArray(arguments));
        return _[method].apply(_, args);
      };
    });
  };
  
  var deprecate = Marionette.deprecate = function(message, test) {
    if (_.isObject(message)) {
      message = (
        message.prev + ' is going to be removed in the future. ' +
        'Please use ' + message.next + ' instead.' +
        (message.url ? ' See: ' + message.url : '')
      );
    }
  
    if ((test === undefined || !test) && !deprecate._cache[message]) {
      deprecate._warn('Deprecation warning: ' + message);
      deprecate._cache[message] = true;
    }
  };
  
  deprecate._warn = typeof console !== 'undefined' && (console.warn || console.log) || function() {};
  deprecate._cache = {};
  
  /* jshint maxstatements: 14, maxcomplexity: 7 */
  
  // Trigger Method
  // --------------
  
  
  Marionette._triggerMethod = (function() {
    // split the event name on the ":"
    var splitter = /(^|:)(\w)/gi;
  
    // take the event section ("section1:section2:section3")
    // and turn it in to uppercase name
    function getEventName(match, prefix, eventName) {
      return eventName.toUpperCase();
    }
  
    return function(context, event, args) {
      var noEventArg = arguments.length < 3;
      if (noEventArg) {
        args = event;
        event = args[0];
      }
  
      // get the method name from the event name
      var methodName = 'on' + event.replace(splitter, getEventName);
      var method = context[methodName];
      var result;
  
      // call the onMethodName if it exists
      if (_.isFunction(method)) {
        // pass all args, except the event name
        result = method.apply(context, noEventArg ? _.rest(args) : args);
      }
  
      // trigger the event, if a trigger method exists
      if (_.isFunction(context.trigger)) {
        if (noEventArg + args.length > 1) {
          context.trigger.apply(context, noEventArg ? args : [event].concat(_.rest(args, 0)));
        } else {
          context.trigger(event);
        }
      }
  
      return result;
    };
  })();
  
  // Trigger an event and/or a corresponding method name. Examples:
  //
  // `this.triggerMethod("foo")` will trigger the "foo" event and
  // call the "onFoo" method.
  //
  // `this.triggerMethod("foo:bar")` will trigger the "foo:bar" event and
  // call the "onFooBar" method.
  Marionette.triggerMethod = function(event) {
    return Marionette._triggerMethod(this, arguments);
  };
  
  // triggerMethodOn invokes triggerMethod on a specific context
  //
  // e.g. `Marionette.triggerMethodOn(view, 'show')`
  // will trigger a "show" event or invoke onShow the view.
  Marionette.triggerMethodOn = function(context) {
    var fnc = _.isFunction(context.triggerMethod) ?
                  context.triggerMethod :
                  Marionette.triggerMethod;
  
    return fnc.apply(context, _.rest(arguments));
  };
  
  // DOM Refresh
  // -----------
  
  // Monitor a view's state, and after it has been rendered and shown
  // in the DOM, trigger a "dom:refresh" event every time it is
  // re-rendered.
  
  Marionette.MonitorDOMRefresh = function(view) {
  
    // track when the view has been shown in the DOM,
    // using a Marionette.Region (or by other means of triggering "show")
    function handleShow() {
      view._isShown = true;
      triggerDOMRefresh();
    }
  
    // track when the view has been rendered
    function handleRender() {
      view._isRendered = true;
      triggerDOMRefresh();
    }
  
    // Trigger the "dom:refresh" event and corresponding "onDomRefresh" method
    function triggerDOMRefresh() {
      if (view._isShown && view._isRendered && Marionette.isNodeAttached(view.el)) {
        if (_.isFunction(view.triggerMethod)) {
          view.triggerMethod('dom:refresh');
        }
      }
    }
  
    view.on({
      show: handleShow,
      render: handleRender
    });
  };
  
  /* jshint maxparams: 5 */
  
  // Bind Entity Events & Unbind Entity Events
  // -----------------------------------------
  //
  // These methods are used to bind/unbind a backbone "entity" (collection/model)
  // to methods on a target object.
  //
  // The first parameter, `target`, must have a `listenTo` method from the
  // EventBinder object.
  //
  // The second parameter is the entity (Backbone.Model or Backbone.Collection)
  // to bind the events from.
  //
  // The third parameter is a hash of { "event:name": "eventHandler" }
  // configuration. Multiple handlers can be separated by a space. A
  // function can be supplied instead of a string handler name.
  
  (function(Marionette) {
    'use strict';
  
    // Bind the event to handlers specified as a string of
    // handler names on the target object
    function bindFromStrings(target, entity, evt, methods) {
      var methodNames = methods.split(/\s+/);
  
      _.each(methodNames, function(methodName) {
  
        var method = target[methodName];
        if (!method) {
          throw new Marionette.Error('Method "' + methodName +
            '" was configured as an event handler, but does not exist.');
        }
  
        target.listenTo(entity, evt, method);
      });
    }
  
    // Bind the event to a supplied callback function
    function bindToFunction(target, entity, evt, method) {
      target.listenTo(entity, evt, method);
    }
  
    // Bind the event to handlers specified as a string of
    // handler names on the target object
    function unbindFromStrings(target, entity, evt, methods) {
      var methodNames = methods.split(/\s+/);
  
      _.each(methodNames, function(methodName) {
        var method = target[methodName];
        target.stopListening(entity, evt, method);
      });
    }
  
    // Bind the event to a supplied callback function
    function unbindToFunction(target, entity, evt, method) {
      target.stopListening(entity, evt, method);
    }
  
  
    // generic looping function
    function iterateEvents(target, entity, bindings, functionCallback, stringCallback) {
      if (!entity || !bindings) { return; }
  
      // type-check bindings
      if (!_.isFunction(bindings) && !_.isObject(bindings)) {
        throw new Marionette.Error({
          message: 'Bindings must be an object or function.',
          url: 'marionette.functions.html#marionettebindentityevents'
        });
      }
  
      // allow the bindings to be a function
      if (_.isFunction(bindings)) {
        bindings = bindings.call(target);
      }
  
      // iterate the bindings and bind them
      _.each(bindings, function(methods, evt) {
  
        // allow for a function as the handler,
        // or a list of event names as a string
        if (_.isFunction(methods)) {
          functionCallback(target, entity, evt, methods);
        } else {
          stringCallback(target, entity, evt, methods);
        }
  
      });
    }
  
    // Export Public API
    Marionette.bindEntityEvents = function(target, entity, bindings) {
      iterateEvents(target, entity, bindings, bindToFunction, bindFromStrings);
    };
  
    Marionette.unbindEntityEvents = function(target, entity, bindings) {
      iterateEvents(target, entity, bindings, unbindToFunction, unbindFromStrings);
    };
  
    // Proxy `bindEntityEvents`
    Marionette.proxyBindEntityEvents = function(entity, bindings) {
      return Marionette.bindEntityEvents(this, entity, bindings);
    };
  
    // Proxy `unbindEntityEvents`
    Marionette.proxyUnbindEntityEvents = function(entity, bindings) {
      return Marionette.unbindEntityEvents(this, entity, bindings);
    };
  })(Marionette);
  

  // Error
  // -----
  
  var errorProps = ['description', 'fileName', 'lineNumber', 'name', 'message', 'number'];
  
  Marionette.Error = Marionette.extend.call(Error, {
    urlRoot: 'http://marionettejs.com/docs/v' + Marionette.VERSION + '/',
  
    constructor: function(message, options) {
      if (_.isObject(message)) {
        options = message;
        message = options.message;
      } else if (!options) {
        options = {};
      }
  
      var error = Error.call(this, message);
      _.extend(this, _.pick(error, errorProps), _.pick(options, errorProps));
  
      this.captureStackTrace();
  
      if (options.url) {
        this.url = this.urlRoot + options.url;
      }
    },
  
    captureStackTrace: function() {
      if (Error.captureStackTrace) {
        Error.captureStackTrace(this, Marionette.Error);
      }
    },
  
    toString: function() {
      return this.name + ': ' + this.message + (this.url ? ' See: ' + this.url : '');
    }
  });
  
  Marionette.Error.extend = Marionette.extend;
  
  // Callbacks
  // ---------
  
  // A simple way of managing a collection of callbacks
  // and executing them at a later point in time, using jQuery's
  // `Deferred` object.
  Marionette.Callbacks = function() {
    this._deferred = Marionette.Deferred();
    this._callbacks = [];
  };
  
  _.extend(Marionette.Callbacks.prototype, {
  
    // Add a callback to be executed. Callbacks added here are
    // guaranteed to execute, even if they are added after the
    // `run` method is called.
    add: function(callback, contextOverride) {
      var promise = _.result(this._deferred, 'promise');
  
      this._callbacks.push({cb: callback, ctx: contextOverride});
  
      promise.then(function(args) {
        if (contextOverride){ args.context = contextOverride; }
        callback.call(args.context, args.options);
      });
    },
  
    // Run all registered callbacks with the context specified.
    // Additional callbacks can be added after this has been run
    // and they will still be executed.
    run: function(options, context) {
      this._deferred.resolve({
        options: options,
        context: context
      });
    },
  
    // Resets the list of callbacks to be run, allowing the same list
    // to be run multiple times - whenever the `run` method is called.
    reset: function() {
      var callbacks = this._callbacks;
      this._deferred = Marionette.Deferred();
      this._callbacks = [];
  
      _.each(callbacks, function(cb) {
        this.add(cb.cb, cb.ctx);
      }, this);
    }
  });
  
  // Controller
  // ----------
  
  // A multi-purpose object to use as a controller for
  // modules and routers, and as a mediator for workflow
  // and coordination of other objects, views, and more.
  Marionette.Controller = function(options) {
    this.options = options || {};
  
    if (_.isFunction(this.initialize)) {
      this.initialize(this.options);
    }
  };
  
  Marionette.Controller.extend = Marionette.extend;
  
  // Controller Methods
  // --------------
  
  // Ensure it can trigger events with Backbone.Events
  _.extend(Marionette.Controller.prototype, Backbone.Events, {
    destroy: function() {
      Marionette._triggerMethod(this, 'before:destroy', arguments);
      Marionette._triggerMethod(this, 'destroy', arguments);
  
      this.stopListening();
      this.off();
      return this;
    },
  
    // import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: Marionette.triggerMethod,
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption
  
  });
  
  // Object
  // ------
  
  // A Base Class that other Classes should descend from.
  // Object borrows many conventions and utilities from Backbone.
  Marionette.Object = function(options) {
    this.options = _.extend({}, _.result(this, 'options'), options);
  
    this.initialize.apply(this, arguments);
  };
  
  Marionette.Object.extend = Marionette.extend;
  
  // Object Methods
  // --------------
  
  // Ensure it can trigger events with Backbone.Events
  _.extend(Marionette.Object.prototype, Backbone.Events, {
  
    //this is a noop method intended to be overridden by classes that extend from this base
    initialize: function() {},
  
    destroy: function() {
      this.triggerMethod('before:destroy');
      this.triggerMethod('destroy');
      this.stopListening();
    },
  
    // Import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: Marionette.triggerMethod,
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption,
  
    // Proxy `bindEntityEvents` to enable binding view's events from another entity.
    bindEntityEvents: Marionette.proxyBindEntityEvents,
  
    // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
    unbindEntityEvents: Marionette.proxyUnbindEntityEvents
  });
  
  /* jshint maxcomplexity: 16, maxstatements: 45, maxlen: 120 */
  
  // Region
  // ------
  
  // Manage the visual regions of your composite application. See
  // http://lostechies.com/derickbailey/2011/12/12/composite-js-apps-regions-and-region-managers/
  
  Marionette.Region = Marionette.Object.extend({
    constructor: function (options) {
  
      // set options temporarily so that we can get `el`.
      // options will be overriden by Object.constructor
      this.options = options || {};
      this.el = this.getOption('el');
  
      // Handle when this.el is passed in as a $ wrapped element.
      this.el = this.el instanceof Backbone.$ ? this.el[0] : this.el;
  
      if (!this.el) {
        throw new Marionette.Error({
          name: 'NoElError',
          message: 'An "el" must be specified for a region.'
        });
      }
  
      this.$el = this.getEl(this.el);
      Marionette.Object.call(this, options);
    },
  
    // Displays a backbone view instance inside of the region.
    // Handles calling the `render` method for you. Reads content
    // directly from the `el` attribute. Also calls an optional
    // `onShow` and `onDestroy` method on your view, just after showing
    // or just before destroying the view, respectively.
    // The `preventDestroy` option can be used to prevent a view from
    // the old view being destroyed on show.
    // The `forceShow` option can be used to force a view to be
    // re-rendered if it's already shown in the region.
    show: function(view, options){
      if (!this._ensureElement()) {
        return;
      }
  
      this._ensureViewIsIntact(view);
  
      var showOptions     = options || {};
      var isDifferentView = view !== this.currentView;
      var preventDestroy  = !!showOptions.preventDestroy;
      var forceShow       = !!showOptions.forceShow;
  
      // We are only changing the view if there is a current view to change to begin with
      var isChangingView = !!this.currentView;
  
      // Only destroy the current view if we don't want to `preventDestroy` and if
      // the view given in the first argument is different than `currentView`
      var _shouldDestroyView = isDifferentView && !preventDestroy;
  
      // Only show the view given in the first argument if it is different than
      // the current view or if we want to re-show the view. Note that if
      // `_shouldDestroyView` is true, then `_shouldShowView` is also necessarily true.
      var _shouldShowView = isDifferentView || forceShow;
  
      if (isChangingView) {
        this.triggerMethod('before:swapOut', this.currentView, this, options);
      }
  
      if (this.currentView) {
        delete this.currentView._parent;
      }
  
      if (_shouldDestroyView) {
        this.empty();
  
      // A `destroy` event is attached to the clean up manually removed views.
      // We need to detach this event when a new view is going to be shown as it
      // is no longer relevant.
      } else if (isChangingView && _shouldShowView) {
        this.currentView.off('destroy', this.empty, this);
      }
  
      if (_shouldShowView) {
  
        // We need to listen for if a view is destroyed
        // in a way other than through the region.
        // If this happens we need to remove the reference
        // to the currentView since once a view has been destroyed
        // we can not reuse it.
        view.once('destroy', this.empty, this);
        view.render();
  
        view._parent = this;
  
        if (isChangingView) {
          this.triggerMethod('before:swap', view, this, options);
        }
  
        this.triggerMethod('before:show', view, this, options);
        Marionette.triggerMethodOn(view, 'before:show', view, this, options);
  
        if (isChangingView) {
          this.triggerMethod('swapOut', this.currentView, this, options);
        }
  
        // An array of views that we're about to display
        var attachedRegion = Marionette.isNodeAttached(this.el);
  
        // The views that we're about to attach to the document
        // It's important that we prevent _getNestedViews from being executed unnecessarily
        // as it's a potentially-slow method
        var displayedViews = [];
  
        var triggerBeforeAttach = showOptions.triggerBeforeAttach || this.triggerBeforeAttach;
        var triggerAttach = showOptions.triggerAttach || this.triggerAttach;
  
        if (attachedRegion && triggerBeforeAttach) {
          displayedViews = this._displayedViews(view);
          this._triggerAttach(displayedViews, 'before:');
        }
  
        this.attachHtml(view);
        this.currentView = view;
  
        if (attachedRegion && triggerAttach) {
          displayedViews = this._displayedViews(view);
          this._triggerAttach(displayedViews);
        }
  
        if (isChangingView) {
          this.triggerMethod('swap', view, this, options);
        }
  
        this.triggerMethod('show', view, this, options);
        Marionette.triggerMethodOn(view, 'show', view, this, options);
  
        return this;
      }
  
      return this;
    },
  
    triggerBeforeAttach: true,
    triggerAttach: true,
  
    _triggerAttach: function(views, prefix) {
      var eventName = (prefix || '') + 'attach';
      _.each(views, function(view) {
        Marionette.triggerMethodOn(view, eventName, view, this);
      }, this);
    },
  
    _displayedViews: function(view) {
      return _.union([view], _.result(view, '_getNestedViews') || []);
    },
  
    _ensureElement: function(){
      if (!_.isObject(this.el)) {
        this.$el = this.getEl(this.el);
        this.el = this.$el[0];
      }
  
      if (!this.$el || this.$el.length === 0) {
        if (this.getOption('allowMissingEl')) {
          return false;
        } else {
          throw new Marionette.Error('An "el" ' + this.$el.selector + ' must exist in DOM');
        }
      }
      return true;
    },
  
    _ensureViewIsIntact: function(view) {
      if (!view) {
        throw new Marionette.Error({
          name: 'ViewNotValid',
          message: 'The view passed is undefined and therefore invalid. You must pass a view instance to show.'
        });
      }
  
      if (view.isDestroyed) {
        throw new Marionette.Error({
          name: 'ViewDestroyedError',
          message: 'View (cid: "' + view.cid + '") has already been destroyed and cannot be used.'
        });
      }
    },
  
    // Override this method to change how the region finds the
    // DOM element that it manages. Return a jQuery selector object.
    getEl: function(el) {
      return Backbone.$(el);
    },
  
    // Override this method to change how the new view is
    // appended to the `$el` that the region is managing
    attachHtml: function(view) {
      // empty the node and append new view
      // We can not use `.innerHTML` due to the fact that IE
      // will not let us clear the html of tables and selects.
      // We also do not want to use the more declarative `empty` method
      // that jquery exposes since `.empty` loops over all of the children DOM
      // nodes and unsets the listeners on each node. While this seems like
      // a desirable thing, it comes at quite a high perf cost. For that reason
      // we are simply clearing the html contents of the node.
      this.$el.html('');
      this.el.appendChild(view.el);
    },
  
    // Destroy the current view, if there is one. If there is no
    // current view, it does nothing and returns immediately.
    empty: function() {
      var view = this.currentView;
  
      // If there is no view in the region
      // we should not remove anything
      if (!view) { return; }
  
      view.off('destroy', this.empty, this);
      this.triggerMethod('before:empty', view);
      this._destroyView();
      this.triggerMethod('empty', view);
  
      // Remove region pointer to the currentView
      delete this.currentView;
      return this;
    },
  
    // call 'destroy' or 'remove', depending on which is found
    // on the view (if showing a raw Backbone view or a Marionette View)
    _destroyView: function() {
      var view = this.currentView;
  
      if (view.destroy && !view.isDestroyed) {
        view.destroy();
      } else if (view.remove) {
        view.remove();
  
        // appending isDestroyed to raw Backbone View allows regions
        // to throw a ViewDestroyedError for this view
        view.isDestroyed = true;
      }
    },
  
    // Attach an existing view to the region. This
    // will not call `render` or `onShow` for the new view,
    // and will not replace the current HTML for the `el`
    // of the region.
    attachView: function(view) {
      this.currentView = view;
      return this;
    },
  
    // Checks whether a view is currently present within
    // the region. Returns `true` if there is and `false` if
    // no view is present.
    hasView: function() {
      return !!this.currentView;
    },
  
    // Reset the region by destroying any existing view and
    // clearing out the cached `$el`. The next time a view
    // is shown via this region, the region will re-query the
    // DOM for the region's `el`.
    reset: function() {
      this.empty();
  
      if (this.$el) {
        this.el = this.$el.selector;
      }
  
      delete this.$el;
      return this;
    }
  
  },
  
  // Static Methods
  {
  
    // Build an instance of a region by passing in a configuration object
    // and a default region class to use if none is specified in the config.
    //
    // The config object should either be a string as a jQuery DOM selector,
    // a Region class directly, or an object literal that specifies a selector,
    // a custom regionClass, and any options to be supplied to the region:
    //
    // ```js
    // {
    //   selector: "#foo",
    //   regionClass: MyCustomRegion,
    //   allowMissingEl: false
    // }
    // ```
    //
    buildRegion: function(regionConfig, DefaultRegionClass) {
      if (_.isString(regionConfig)) {
        return this._buildRegionFromSelector(regionConfig, DefaultRegionClass);
      }
  
      if (regionConfig.selector || regionConfig.el || regionConfig.regionClass) {
        return this._buildRegionFromObject(regionConfig, DefaultRegionClass);
      }
  
      if (_.isFunction(regionConfig)) {
        return this._buildRegionFromRegionClass(regionConfig);
      }
  
      throw new Marionette.Error({
        message: 'Improper region configuration type.',
        url: 'marionette.region.html#region-configuration-types'
      });
    },
  
    // Build the region from a string selector like '#foo-region'
    _buildRegionFromSelector: function(selector, DefaultRegionClass) {
      return new DefaultRegionClass({ el: selector });
    },
  
    // Build the region from a configuration object
    // ```js
    // { selector: '#foo', regionClass: FooRegion, allowMissingEl: false }
    // ```
    _buildRegionFromObject: function(regionConfig, DefaultRegionClass) {
      var RegionClass = regionConfig.regionClass || DefaultRegionClass;
      var options = _.omit(regionConfig, 'selector', 'regionClass');
  
      if (regionConfig.selector && !options.el) {
        options.el = regionConfig.selector;
      }
  
      var region = new RegionClass(options);
  
      // override the `getEl` function if we have a parentEl
      // this must be overridden to ensure the selector is found
      // on the first use of the region. if we try to assign the
      // region's `el` to `parentEl.find(selector)` in the object
      // literal to build the region, the element will not be
      // guaranteed to be in the DOM already, and will cause problems
      if (regionConfig.parentEl) {
        region.getEl = function(el) {
          if (_.isObject(el)) {
            return Backbone.$(el);
          }
          var parentEl = regionConfig.parentEl;
          if (_.isFunction(parentEl)) {
            parentEl = parentEl();
          }
          return parentEl.find(el);
        };
      }
  
      return region;
    },
  
    // Build the region directly from a given `RegionClass`
    _buildRegionFromRegionClass: function(RegionClass) {
      return new RegionClass();
    }
  });
  
  // Region Manager
  // --------------
  
  // Manage one or more related `Marionette.Region` objects.
  Marionette.RegionManager = Marionette.Controller.extend({
    constructor: function(options) {
      this._regions = {};
  
      Marionette.Controller.call(this, options);
  
      this.addRegions(this.getOption('regions'));
    },
  
    // Add multiple regions using an object literal or a
    // function that returns an object literal, where
    // each key becomes the region name, and each value is
    // the region definition.
    addRegions: function(regionDefinitions, defaults) {
      if (_.isFunction(regionDefinitions)) {
        regionDefinitions = regionDefinitions.apply(this, arguments);
      }
  
      var regions = {};
  
      _.each(regionDefinitions, function(definition, name) {
        if (_.isString(definition)) {
          definition = {selector: definition};
        }
  
        if (definition.selector) {
          definition = _.defaults({}, definition, defaults);
        }
  
        var region = this.addRegion(name, definition);
        regions[name] = region;
      }, this);
  
      return regions;
    },
  
    // Add an individual region to the region manager,
    // and return the region instance
    addRegion: function(name, definition) {
      var region;
  
      if (definition instanceof Marionette.Region) {
        region = definition;
      } else {
        region = Marionette.Region.buildRegion(definition, Marionette.Region);
      }
  
      this.triggerMethod('before:add:region', name, region);
  
      region._parent = this;
      this._store(name, region);
  
      this.triggerMethod('add:region', name, region);
      return region;
    },
  
    // Get a region by name
    get: function(name) {
      return this._regions[name];
    },
  
    // Gets all the regions contained within
    // the `regionManager` instance.
    getRegions: function(){
      return _.clone(this._regions);
    },
  
    // Remove a region by name
    removeRegion: function(name) {
      var region = this._regions[name];
      this._remove(name, region);
  
      return region;
    },
  
    // Empty all regions in the region manager, and
    // remove them
    removeRegions: function() {
      var regions = this.getRegions();
      _.each(this._regions, function(region, name) {
        this._remove(name, region);
      }, this);
  
      return regions;
    },
  
    // Empty all regions in the region manager, but
    // leave them attached
    emptyRegions: function() {
      var regions = this.getRegions();
      _.invoke(regions, 'empty');
      return regions;
    },
  
    // Destroy all regions and shut down the region
    // manager entirely
    destroy: function() {
      this.removeRegions();
      return Marionette.Controller.prototype.destroy.apply(this, arguments);
    },
  
    // internal method to store regions
    _store: function(name, region) {
      this._regions[name] = region;
      this._setLength();
    },
  
    // internal method to remove a region
    _remove: function(name, region) {
      this.triggerMethod('before:remove:region', name, region);
      region.empty();
      region.stopListening();
  
      delete region._parent;
      delete this._regions[name];
      this._setLength();
      this.triggerMethod('remove:region', name, region);
    },
  
    // set the number of regions current held
    _setLength: function() {
      this.length = _.size(this._regions);
    }
  });
  
  Marionette.actAsCollection(Marionette.RegionManager.prototype, '_regions');
  

  // Template Cache
  // --------------
  
  // Manage templates stored in `<script>` blocks,
  // caching them for faster access.
  Marionette.TemplateCache = function(templateId) {
    this.templateId = templateId;
  };
  
  // TemplateCache object-level methods. Manage the template
  // caches from these method calls instead of creating
  // your own TemplateCache instances
  _.extend(Marionette.TemplateCache, {
    templateCaches: {},
  
    // Get the specified template by id. Either
    // retrieves the cached version, or loads it
    // from the DOM.
    get: function(templateId) {
      var cachedTemplate = this.templateCaches[templateId];
  
      if (!cachedTemplate) {
        cachedTemplate = new Marionette.TemplateCache(templateId);
        this.templateCaches[templateId] = cachedTemplate;
      }
  
      return cachedTemplate.load();
    },
  
    // Clear templates from the cache. If no arguments
    // are specified, clears all templates:
    // `clear()`
    //
    // If arguments are specified, clears each of the
    // specified templates from the cache:
    // `clear("#t1", "#t2", "...")`
    clear: function() {
      var i;
      var args = _.toArray(arguments);
      var length = args.length;
  
      if (length > 0) {
        for (i = 0; i < length; i++) {
          delete this.templateCaches[args[i]];
        }
      } else {
        this.templateCaches = {};
      }
    }
  });
  
  // TemplateCache instance methods, allowing each
  // template cache object to manage its own state
  // and know whether or not it has been loaded
  _.extend(Marionette.TemplateCache.prototype, {
  
    // Internal method to load the template
    load: function() {
      // Guard clause to prevent loading this template more than once
      if (this.compiledTemplate) {
        return this.compiledTemplate;
      }
  
      // Load the template and compile it
      var template = this.loadTemplate(this.templateId);
      this.compiledTemplate = this.compileTemplate(template);
  
      return this.compiledTemplate;
    },
  
    // Load a template from the DOM, by default. Override
    // this method to provide your own template retrieval
    // For asynchronous loading with AMD/RequireJS, consider
    // using a template-loader plugin as described here:
    // https://github.com/marionettejs/backbone.marionette/wiki/Using-marionette-with-requirejs
    loadTemplate: function(templateId) {
      var template = Backbone.$(templateId).html();
  
      if (!template || template.length === 0) {
        throw new Marionette.Error({
          name: 'NoTemplateError',
          message: 'Could not find template: "' + templateId + '"'
        });
      }
  
      return template;
    },
  
    // Pre-compile the template before caching it. Override
    // this method if you do not need to pre-compile a template
    // (JST / RequireJS for example) or if you want to change
    // the template engine used (Handebars, etc).
    compileTemplate: function(rawTemplate) {
      return _.template(rawTemplate);
    }
  });
  
  // Renderer
  // --------
  
  // Render a template with data by passing in the template
  // selector and the data to render.
  Marionette.Renderer = {
  
    // Render a template with data. The `template` parameter is
    // passed to the `TemplateCache` object to retrieve the
    // template function. Override this method to provide your own
    // custom rendering and template handling for all of Marionette.
    render: function(template, data) {
      if (!template) {
        throw new Marionette.Error({
          name: 'TemplateNotFoundError',
          message: 'Cannot render the template since its false, null or undefined.'
        });
      }
  
      var templateFunc;
      if (typeof template === 'function') {
        templateFunc = template;
      } else {
        templateFunc = Marionette.TemplateCache.get(template);
      }
  
      return templateFunc(data);
    }
  };
  

  /* jshint maxlen: 114, nonew: false */
  // View
  // ----
  
  // The core view class that other Marionette views extend from.
  Marionette.View = Backbone.View.extend({
  
    constructor: function(options) {
      _.bindAll(this, 'render');
  
      options = _.isFunction(options) ? options.call(this) : options;
  
      // this exposes view options to the view initializer
      // this is a backfill since backbone removed the assignment
      // of this.options
      // at some point however this may be removed
      this.options = _.extend({}, _.result(this, 'options'), options);
  
      this._behaviors = Marionette.Behaviors(this);
  
      Backbone.View.apply(this, arguments);
  
      Marionette.MonitorDOMRefresh(this);
      this.on('show', this.onShowCalled);
    },
  
    // Get the template for this view
    // instance. You can set a `template` attribute in the view
    // definition or pass a `template: "whatever"` parameter in
    // to the constructor options.
    getTemplate: function() {
      return this.getOption('template');
    },
  
    // Serialize a model by returning its attributes. Clones
    // the attributes to allow modification.
    serializeModel: function(model){
      return model.toJSON.apply(model, _.rest(arguments));
    },
  
    // Mix in template helper methods. Looks for a
    // `templateHelpers` attribute, which can either be an
    // object literal, or a function that returns an object
    // literal. All methods and attributes from this object
    // are copies to the object passed in.
    mixinTemplateHelpers: function(target) {
      target = target || {};
      var templateHelpers = this.getOption('templateHelpers');
      if (_.isFunction(templateHelpers)) {
        templateHelpers = templateHelpers.call(this);
      }
      return _.extend(target, templateHelpers);
    },
  
    // normalize the keys of passed hash with the views `ui` selectors.
    // `{"@ui.foo": "bar"}`
    normalizeUIKeys: function(hash) {
      var uiBindings = _.result(this, '_uiBindings');
      return Marionette.normalizeUIKeys(hash, uiBindings || _.result(this, 'ui'));
    },
  
    // normalize the values of passed hash with the views `ui` selectors.
    // `{foo: "@ui.bar"}`
    normalizeUIValues: function(hash) {
      var ui = _.result(this, 'ui');
      var uiBindings = _.result(this, '_uiBindings');
      return Marionette.normalizeUIValues(hash, uiBindings || ui);
    },
  
    // Configure `triggers` to forward DOM events to view
    // events. `triggers: {"click .foo": "do:foo"}`
    configureTriggers: function() {
      if (!this.triggers) { return; }
  
      // Allow `triggers` to be configured as a function
      var triggers = this.normalizeUIKeys(_.result(this, 'triggers'));
  
      // Configure the triggers, prevent default
      // action and stop propagation of DOM events
      return _.reduce(triggers, function(events, value, key) {
        events[key] = this._buildViewTrigger(value);
        return events;
      }, {}, this);
    },
  
    // Overriding Backbone.View's delegateEvents to handle
    // the `triggers`, `modelEvents`, and `collectionEvents` configuration
    delegateEvents: function(events) {
      this._delegateDOMEvents(events);
      this.bindEntityEvents(this.model, this.getOption('modelEvents'));
      this.bindEntityEvents(this.collection, this.getOption('collectionEvents'));
  
      _.each(this._behaviors, function(behavior) {
        behavior.bindEntityEvents(this.model, behavior.getOption('modelEvents'));
        behavior.bindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
      }, this);
  
      return this;
    },
  
    // internal method to delegate DOM events and triggers
    _delegateDOMEvents: function(eventsArg) {
      var events = eventsArg || this.events;
      if (_.isFunction(events)) { events = events.call(this); }
  
      // normalize ui keys
      events = this.normalizeUIKeys(events);
      if(_.isUndefined(eventsArg)) {this.events = events;}
  
      var combinedEvents = {};
  
      // look up if this view has behavior events
      var behaviorEvents = _.result(this, 'behaviorEvents') || {};
      var triggers = this.configureTriggers();
      var behaviorTriggers = _.result(this, 'behaviorTriggers') || {};
  
      // behavior events will be overriden by view events and or triggers
      _.extend(combinedEvents, behaviorEvents, events, triggers, behaviorTriggers);
  
      Backbone.View.prototype.delegateEvents.call(this, combinedEvents);
    },
  
    // Overriding Backbone.View's undelegateEvents to handle unbinding
    // the `triggers`, `modelEvents`, and `collectionEvents` config
    undelegateEvents: function() {
      Backbone.View.prototype.undelegateEvents.apply(this, arguments);
  
      this.unbindEntityEvents(this.model, this.getOption('modelEvents'));
      this.unbindEntityEvents(this.collection, this.getOption('collectionEvents'));
  
      _.each(this._behaviors, function(behavior) {
        behavior.unbindEntityEvents(this.model, behavior.getOption('modelEvents'));
        behavior.unbindEntityEvents(this.collection, behavior.getOption('collectionEvents'));
      }, this);
  
      return this;
    },
  
    // Internal method, handles the `show` event.
    onShowCalled: function() {},
  
    // Internal helper method to verify whether the view hasn't been destroyed
    _ensureViewIsIntact: function() {
      if (this.isDestroyed) {
        throw new Marionette.Error({
          name: 'ViewDestroyedError',
          message: 'View (cid: "' + this.cid + '") has already been destroyed and cannot be used.'
        });
      }
    },
  
    // Default `destroy` implementation, for removing a view from the
    // DOM and unbinding it. Regions will call this method
    // for you. You can specify an `onDestroy` method in your view to
    // add custom code that is called after the view is destroyed.
    destroy: function() {
      if (this.isDestroyed) { return; }
  
      var args = _.toArray(arguments);
  
      this.triggerMethod.apply(this, ['before:destroy'].concat(args));
  
      // mark as destroyed before doing the actual destroy, to
      // prevent infinite loops within "destroy" event handlers
      // that are trying to destroy other views
      this.isDestroyed = true;
      this.triggerMethod.apply(this, ['destroy'].concat(args));
  
      // unbind UI elements
      this.unbindUIElements();
  
      // remove the view from the DOM
      this.remove();
  
      // Call destroy on each behavior after
      // destroying the view.
      // This unbinds event listeners
      // that behaviors have registered for.
      _.invoke(this._behaviors, 'destroy', args);
  
      return this;
    },
  
    bindUIElements: function() {
      this._bindUIElements();
      _.invoke(this._behaviors, this._bindUIElements);
    },
  
    // This method binds the elements specified in the "ui" hash inside the view's code with
    // the associated jQuery selectors.
    _bindUIElements: function() {
      if (!this.ui) { return; }
  
      // store the ui hash in _uiBindings so they can be reset later
      // and so re-rendering the view will be able to find the bindings
      if (!this._uiBindings) {
        this._uiBindings = this.ui;
      }
  
      // get the bindings result, as a function or otherwise
      var bindings = _.result(this, '_uiBindings');
  
      // empty the ui so we don't have anything to start with
      this.ui = {};
  
      // bind each of the selectors
      _.each(_.keys(bindings), function(key) {
        var selector = bindings[key];
        this.ui[key] = this.$(selector);
      }, this);
    },
  
    // This method unbinds the elements specified in the "ui" hash
    unbindUIElements: function() {
      this._unbindUIElements();
      _.invoke(this._behaviors, this._unbindUIElements);
    },
  
    _unbindUIElements: function() {
      if (!this.ui || !this._uiBindings) { return; }
  
      // delete all of the existing ui bindings
      _.each(this.ui, function($el, name) {
        delete this.ui[name];
      }, this);
  
      // reset the ui element to the original bindings configuration
      this.ui = this._uiBindings;
      delete this._uiBindings;
    },
  
    // Internal method to create an event handler for a given `triggerDef` like
    // 'click:foo'
    _buildViewTrigger: function(triggerDef) {
      var hasOptions = _.isObject(triggerDef);
  
      var options = _.defaults({}, (hasOptions ? triggerDef : {}), {
        preventDefault: true,
        stopPropagation: true
      });
  
      var eventName = hasOptions ? options.event : triggerDef;
  
      return function(e) {
        if (e) {
          if (e.preventDefault && options.preventDefault) {
            e.preventDefault();
          }
  
          if (e.stopPropagation && options.stopPropagation) {
            e.stopPropagation();
          }
        }
  
        var args = {
          view: this,
          model: this.model,
          collection: this.collection
        };
  
        this.triggerMethod(eventName, args);
      };
    },
  
    setElement: function() {
      var ret = Backbone.View.prototype.setElement.apply(this, arguments);
  
      // proxy behavior $el to the view's $el.
      // This is needed because a view's $el proxy
      // is not set until after setElement is called.
      _.invoke(this._behaviors, 'proxyViewProperties', this);
  
      return ret;
    },
  
    // import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: function() {
      var triggerMethod = Marionette._triggerMethod;
      var ret = triggerMethod(this, arguments);
      var behaviors = this._behaviors;
      // Use good ol' for as this is a very hot function
      for (var i = 0, length = behaviors && behaviors.length; i < length; i++) {
        triggerMethod(behaviors[i], arguments);
      }
  
      return ret;
    },
  
    // This method returns any views that are immediate
    // children of this view
    _getImmediateChildren: function() {
      return [];
    },
  
    // Returns an array of every nested view within this view
    _getNestedViews: function() {
      var children = this._getImmediateChildren();
  
      if (!children.length) { return children; }
  
      return _.reduce(children, function(memo, view) {
        if (!view._getNestedViews) { return memo; }
        return memo.concat(view._getNestedViews());
      }, children);
    },
  
    // Imports the "normalizeMethods" to transform hashes of
    // events=>function references/names to a hash of events=>function references
    normalizeMethods: Marionette.normalizeMethods,
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption,
  
    // Proxy `bindEntityEvents` to enable binding view's events from another entity.
    bindEntityEvents: Marionette.proxyBindEntityEvents,
  
    // Proxy `unbindEntityEvents` to enable unbinding view's events from another entity.
    unbindEntityEvents: Marionette.proxyUnbindEntityEvents
  });
  
  // Item View
  // ---------
  
  // A single item view implementation that contains code for rendering
  // with underscore.js templates, serializing the view's model or collection,
  // and calling several methods on extended views, such as `onRender`.
  Marionette.ItemView = Marionette.View.extend({
  
    // Setting up the inheritance chain which allows changes to
    // Marionette.View.prototype.constructor which allows overriding
    constructor: function() {
      Marionette.View.apply(this, arguments);
    },
  
    // Serialize the model or collection for the view. If a model is
    // found, the view's `serializeModel` is called. If a collection is found,
    // each model in the collection is serialized by calling
    // the view's `serializeCollection` and put into an `items` array in
    // the resulting data. If both are found, defaults to the model.
    // You can override the `serializeData` method in your own view definition,
    // to provide custom serialization for your view's data.
    serializeData: function(){
      if (!this.model && !this.collection) {
        return {};
      }
  
      var args = [this.model || this.collection];
      if (arguments.length) {
        args.push.apply(args, arguments);
      }
  
      if (this.model) {
        return this.serializeModel.apply(this, args);
      } else {
        return {
          items: this.serializeCollection.apply(this, args)
        };
      }
    },
  
    // Serialize a collection by serializing each of its models.
    serializeCollection: function(collection){
      return collection.toJSON.apply(collection, _.rest(arguments));
    },
  
    // Render the view, defaulting to underscore.js templates.
    // You can override this in your view definition to provide
    // a very specific rendering for your view. In general, though,
    // you should override the `Marionette.Renderer` object to
    // change how Marionette renders views.
    render: function() {
      this._ensureViewIsIntact();
  
      this.triggerMethod('before:render', this);
  
      this._renderTemplate();
      this.bindUIElements();
  
      this.triggerMethod('render', this);
  
      return this;
    },
  
    // Internal method to render the template with the serialized data
    // and template helpers via the `Marionette.Renderer` object.
    // Throws an `UndefinedTemplateError` error if the template is
    // any falsely value but literal `false`.
    _renderTemplate: function() {
      var template = this.getTemplate();
  
      // Allow template-less item views
      if (template === false) {
        return;
      }
  
      if (!template) {
        throw new Marionette.Error({
          name: 'UndefinedTemplateError',
          message: 'Cannot render the template since it is null or undefined.'
        });
      }
  
      // Add in entity data and template helpers
      var data = this.serializeData();
      data = this.mixinTemplateHelpers(data);
  
      // Render and add to el
      var html = Marionette.Renderer.render(template, data, this);
      this.attachElContent(html);
  
      return this;
    },
  
    // Attaches the content of a given view.
    // This method can be overridden to optimize rendering,
    // or to render in a non standard way.
    //
    // For example, using `innerHTML` instead of `$el.html`
    //
    // ```js
    // attachElContent: function(html) {
    //   this.el.innerHTML = html;
    //   return this;
    // }
    // ```
    attachElContent: function(html) {
      this.$el.html(html);
  
      return this;
    }
  });
  
  /* jshint maxstatements: 14 */
  
  // Collection View
  // ---------------
  
  // A view that iterates over a Backbone.Collection
  // and renders an individual child view for each model.
  Marionette.CollectionView = Marionette.View.extend({
  
    // used as the prefix for child view events
    // that are forwarded through the collectionview
    childViewEventPrefix: 'childview',
  
    // constructor
    // option to pass `{sort: false}` to prevent the `CollectionView` from
    // maintaining the sorted order of the collection.
    // This will fallback onto appending childView's to the end.
    constructor: function(options){
      var initOptions = options || {};
      if (_.isUndefined(this.sort)){
        this.sort = _.isUndefined(initOptions.sort) ? true : initOptions.sort;
      }
  
      this.once('render', this._initialEvents);
      this._initChildViewStorage();
  
      Marionette.View.apply(this, arguments);
  
      this.initRenderBuffer();
    },
  
    // Instead of inserting elements one by one into the page,
    // it's much more performant to insert elements into a document
    // fragment and then insert that document fragment into the page
    initRenderBuffer: function() {
      this.elBuffer = document.createDocumentFragment();
      this._bufferedChildren = [];
    },
  
    startBuffering: function() {
      this.initRenderBuffer();
      this.isBuffering = true;
    },
  
    endBuffering: function() {
      this.isBuffering = false;
      this._triggerBeforeShowBufferedChildren();
      this.attachBuffer(this, this.elBuffer);
      this._triggerShowBufferedChildren();
      this.initRenderBuffer();
    },
  
    _triggerBeforeShowBufferedChildren: function() {
      if (this._isShown) {
        _.each(this._bufferedChildren, _.partial(this._triggerMethodOnChild, 'before:show'));
      }
    },
  
    _triggerShowBufferedChildren: function() {
      if (this._isShown) {
        _.each(this._bufferedChildren, _.partial(this._triggerMethodOnChild, 'show'));
  
        this._bufferedChildren = [];
      }
    },
  
    // Internal method for _.each loops to call `Marionette.triggerMethodOn` on
    // a child view
    _triggerMethodOnChild: function(event, childView) {
      Marionette.triggerMethodOn(childView, event);
    },
  
    // Configured the initial events that the collection view
    // binds to.
    _initialEvents: function() {
      if (this.collection) {
        this.listenTo(this.collection, 'add', this._onCollectionAdd);
        this.listenTo(this.collection, 'remove', this._onCollectionRemove);
        this.listenTo(this.collection, 'reset', this.render);
  
        if (this.sort) {
          this.listenTo(this.collection, 'sort', this._sortViews);
        }
      }
    },
  
    // Handle a child added to the collection
    _onCollectionAdd: function(child) {
      this.destroyEmptyView();
      var ChildView = this.getChildView(child);
      var index = this.collection.indexOf(child);
      this.addChild(child, ChildView, index);
    },
  
    // get the child view by model it holds, and remove it
    _onCollectionRemove: function(model) {
      var view = this.children.findByModel(model);
      this.removeChildView(view);
      this.checkEmpty();
    },
  
    // Override from `Marionette.View` to trigger show on child views
    onShowCalled: function() {
      this.children.each(_.partial(this._triggerMethodOnChild, 'show'));
    },
  
    // Render children views. Override this method to
    // provide your own implementation of a render function for
    // the collection view.
    render: function() {
      this._ensureViewIsIntact();
      this.triggerMethod('before:render', this);
      this._renderChildren();
      this.triggerMethod('render', this);
      return this;
    },
  
    // Render view after sorting. Override this method to
    // change how the view renders after a `sort` on the collection.
    // An example of this would be to only `renderChildren` in a `CompositeView`
    // rather than the full view.
    resortView: function() {
      this.render();
    },
  
    // Internal method. This checks for any changes in the order of the collection.
    // If the index of any view doesn't match, it will render.
    _sortViews: function() {
      // check for any changes in sort order of views
      var orderChanged = this.collection.find(function(item, index){
        var view = this.children.findByModel(item);
        return !view || view._index !== index;
      }, this);
  
      if (orderChanged) {
        this.resortView();
      }
    },
  
    // Internal reference to what index a `emptyView` is.
    _emptyViewIndex: -1,
  
    // Internal method. Separated so that CompositeView can have
    // more control over events being triggered, around the rendering
    // process
    _renderChildren: function() {
      this.destroyEmptyView();
      this.destroyChildren();
  
      if (this.isEmpty(this.collection)) {
        this.showEmptyView();
      } else {
        this.triggerMethod('before:render:collection', this);
        this.startBuffering();
        this.showCollection();
        this.endBuffering();
        this.triggerMethod('render:collection', this);
      }
    },
  
    // Internal method to loop through collection and show each child view.
    showCollection: function() {
      var ChildView;
      this.collection.each(function(child, index) {
        ChildView = this.getChildView(child);
        this.addChild(child, ChildView, index);
      }, this);
    },
  
    // Internal method to show an empty view in place of
    // a collection of child views, when the collection is empty
    showEmptyView: function() {
      var EmptyView = this.getEmptyView();
  
      if (EmptyView && !this._showingEmptyView) {
        this.triggerMethod('before:render:empty');
  
        this._showingEmptyView = true;
        var model = new Backbone.Model();
        this.addEmptyView(model, EmptyView);
  
        this.triggerMethod('render:empty');
      }
    },
  
    // Internal method to destroy an existing emptyView instance
    // if one exists. Called when a collection view has been
    // rendered empty, and then a child is added to the collection.
    destroyEmptyView: function() {
      if (this._showingEmptyView) {
        this.triggerMethod('before:remove:empty');
  
        this.destroyChildren();
        delete this._showingEmptyView;
  
        this.triggerMethod('remove:empty');
      }
    },
  
    // Retrieve the empty view class
    getEmptyView: function() {
      return this.getOption('emptyView');
    },
  
    // Render and show the emptyView. Similar to addChild method
    // but "child:added" events are not fired, and the event from
    // emptyView are not forwarded
    addEmptyView: function(child, EmptyView) {
  
      // get the emptyViewOptions, falling back to childViewOptions
      var emptyViewOptions = this.getOption('emptyViewOptions') ||
                            this.getOption('childViewOptions');
  
      if (_.isFunction(emptyViewOptions)){
        emptyViewOptions = emptyViewOptions.call(this, child, this._emptyViewIndex);
      }
  
      // build the empty view
      var view = this.buildChildView(child, EmptyView, emptyViewOptions);
  
      view._parent = this;
  
      // Proxy emptyView events
      this.proxyChildEvents(view);
  
      // trigger the 'before:show' event on `view` if the collection view
      // has already been shown
      if (this._isShown) {
        Marionette.triggerMethodOn(view, 'before:show');
      }
  
      // Store the `emptyView` like a `childView` so we can properly
      // remove and/or close it later
      this.children.add(view);
  
      // Render it and show it
      this.renderChildView(view, this._emptyViewIndex);
  
      // call the 'show' method if the collection view
      // has already been shown
      if (this._isShown) {
        Marionette.triggerMethodOn(view, 'show');
      }
    },
  
    // Retrieve the `childView` class, either from `this.options.childView`
    // or from the `childView` in the object definition. The "options"
    // takes precedence.
    // This method receives the model that will be passed to the instance
    // created from this `childView`. Overriding methods may use the child
    // to determine what `childView` class to return.
    getChildView: function(child) {
      var childView = this.getOption('childView');
  
      if (!childView) {
        throw new Marionette.Error({
          name: 'NoChildViewError',
          message: 'A "childView" must be specified'
        });
      }
  
      return childView;
    },
  
    // Render the child's view and add it to the
    // HTML for the collection view at a given index.
    // This will also update the indices of later views in the collection
    // in order to keep the children in sync with the collection.
    addChild: function(child, ChildView, index) {
      var childViewOptions = this.getOption('childViewOptions');
      if (_.isFunction(childViewOptions)) {
        childViewOptions = childViewOptions.call(this, child, index);
      }
  
      var view = this.buildChildView(child, ChildView, childViewOptions);
  
      // increment indices of views after this one
      this._updateIndices(view, true, index);
  
      this._addChildView(view, index);
  
      view._parent = this;
  
      return view;
    },
  
    // Internal method. This decrements or increments the indices of views after the
    // added/removed view to keep in sync with the collection.
    _updateIndices: function(view, increment, index) {
      if (!this.sort) {
        return;
      }
  
      if (increment) {
        // assign the index to the view
        view._index = index;
  
        // increment the index of views after this one
        this.children.each(function (laterView) {
          if (laterView._index >= view._index) {
            laterView._index++;
          }
        });
      }
      else {
        // decrement the index of views after this one
        this.children.each(function (laterView) {
          if (laterView._index >= view._index) {
            laterView._index--;
          }
        });
      }
    },
  
  
    // Internal Method. Add the view to children and render it at
    // the given index.
    _addChildView: function(view, index) {
      // set up the child view event forwarding
      this.proxyChildEvents(view);
  
      this.triggerMethod('before:add:child', view);
  
      // Store the child view itself so we can properly
      // remove and/or destroy it later
      this.children.add(view);
      this.renderChildView(view, index);
  
      if (this._isShown && !this.isBuffering) {
        Marionette.triggerMethodOn(view, 'show');
      }
  
      this.triggerMethod('add:child', view);
    },
  
    // render the child view
    renderChildView: function(view, index) {
      view.render();
      this.attachHtml(this, view, index);
      return view;
    },
  
    // Build a `childView` for a model in the collection.
    buildChildView: function(child, ChildViewClass, childViewOptions) {
      var options = _.extend({model: child}, childViewOptions);
      return new ChildViewClass(options);
    },
  
    // Remove the child view and destroy it.
    // This function also updates the indices of
    // later views in the collection in order to keep
    // the children in sync with the collection.
    removeChildView: function(view) {
  
      if (view) {
        this.triggerMethod('before:remove:child', view);
        // call 'destroy' or 'remove', depending on which is found
        if (view.destroy) { view.destroy(); }
        else if (view.remove) { view.remove(); }
  
        delete view._parent;
        this.stopListening(view);
        this.children.remove(view);
        this.triggerMethod('remove:child', view);
  
        // decrement the index of views after this one
        this._updateIndices(view, false);
      }
  
      return view;
    },
  
    // check if the collection is empty
    isEmpty: function() {
      return !this.collection || this.collection.length === 0;
    },
  
    // If empty, show the empty view
    checkEmpty: function() {
      if (this.isEmpty(this.collection)) {
        this.showEmptyView();
      }
    },
  
    // You might need to override this if you've overridden attachHtml
    attachBuffer: function(collectionView, buffer) {
      collectionView.$el.append(buffer);
    },
  
    // Append the HTML to the collection's `el`.
    // Override this method to do something other
    // than `.append`.
    attachHtml: function(collectionView, childView, index) {
      if (collectionView.isBuffering) {
        // buffering happens on reset events and initial renders
        // in order to reduce the number of inserts into the
        // document, which are expensive.
        collectionView.elBuffer.appendChild(childView.el);
        collectionView._bufferedChildren.push(childView);
      }
      else {
        // If we've already rendered the main collection, append
        // the new child into the correct order if we need to. Otherwise
        // append to the end.
        if (!collectionView._insertBefore(childView, index)){
          collectionView._insertAfter(childView);
        }
      }
    },
  
    // Internal method. Check whether we need to insert the view into
    // the correct position.
    _insertBefore: function(childView, index) {
      var currentView;
      var findPosition = this.sort && (index < this.children.length - 1);
      if (findPosition) {
        // Find the view after this one
        currentView = this.children.find(function (view) {
          return view._index === index + 1;
        });
      }
  
      if (currentView) {
        currentView.$el.before(childView.el);
        return true;
      }
  
      return false;
    },
  
    // Internal method. Append a view to the end of the $el
    _insertAfter: function(childView) {
      this.$el.append(childView.el);
    },
  
    // Internal method to set up the `children` object for
    // storing all of the child views
    _initChildViewStorage: function() {
      this.children = new Backbone.ChildViewContainer();
    },
  
    // Handle cleanup and other destroying needs for the collection of views
    destroy: function() {
      if (this.isDestroyed) { return; }
  
      this.triggerMethod('before:destroy:collection');
      this.destroyChildren();
      this.triggerMethod('destroy:collection');
  
      return Marionette.View.prototype.destroy.apply(this, arguments);
    },
  
    // Destroy the child views that this collection view
    // is holding on to, if any
    destroyChildren: function() {
      var childViews = this.children.map(_.identity);
      this.children.each(this.removeChildView, this);
      this.checkEmpty();
      return childViews;
    },
  
    // Set up the child view event forwarding. Uses a "childview:"
    // prefix in front of all forwarded events.
    proxyChildEvents: function(view) {
      var prefix = this.getOption('childViewEventPrefix');
  
      // Forward all child view events through the parent,
      // prepending "childview:" to the event name
      this.listenTo(view, 'all', function() {
        var args = _.toArray(arguments);
        var rootEvent = args[0];
        var childEvents = this.normalizeMethods(_.result(this, 'childEvents'));
  
        args[0] = prefix + ':' + rootEvent;
        args.splice(1, 0, view);
  
        // call collectionView childEvent if defined
        if (typeof childEvents !== 'undefined' && _.isFunction(childEvents[rootEvent])) {
          childEvents[rootEvent].apply(this, args.slice(1));
        }
  
        this.triggerMethod.apply(this, args);
      }, this);
    },
  
    _getImmediateChildren: function() {
      return _.values(this.children._views);
    }
  });
  
  /* jshint maxstatements: 17, maxlen: 117 */
  
  // Composite View
  // --------------
  
  // Used for rendering a branch-leaf, hierarchical structure.
  // Extends directly from CollectionView and also renders an
  // a child view as `modelView`, for the top leaf
  Marionette.CompositeView = Marionette.CollectionView.extend({
  
    // Setting up the inheritance chain which allows changes to
    // Marionette.CollectionView.prototype.constructor which allows overriding
    // option to pass '{sort: false}' to prevent the CompositeView from
    // maintaining the sorted order of the collection.
    // This will fallback onto appending childView's to the end.
    constructor: function() {
      Marionette.CollectionView.apply(this, arguments);
    },
  
    // Configured the initial events that the composite view
    // binds to. Override this method to prevent the initial
    // events, or to add your own initial events.
    _initialEvents: function() {
  
      // Bind only after composite view is rendered to avoid adding child views
      // to nonexistent childViewContainer
  
      if (this.collection) {
        this.listenTo(this.collection, 'add', this._onCollectionAdd);
        this.listenTo(this.collection, 'remove', this._onCollectionRemove);
        this.listenTo(this.collection, 'reset', this._renderChildren);
  
        if (this.sort) {
          this.listenTo(this.collection, 'sort', this._sortViews);
        }
      }
    },
  
    // Retrieve the `childView` to be used when rendering each of
    // the items in the collection. The default is to return
    // `this.childView` or Marionette.CompositeView if no `childView`
    // has been defined
    getChildView: function(child) {
      var childView = this.getOption('childView') || this.constructor;
  
      return childView;
    },
  
    // Serialize the model for the view.
    // You can override the `serializeData` method in your own view
    // definition, to provide custom serialization for your view's data.
    serializeData: function() {
      var data = {};
  
      if (this.model){
        data = _.partial(this.serializeModel, this.model).apply(this, arguments);
      }
  
      return data;
    },
  
    // Renders the model and the collection.
    render: function() {
      this._ensureViewIsIntact();
      this.isRendered = true;
      this.resetChildViewContainer();
  
      this.triggerMethod('before:render', this);
  
      this._renderTemplate();
      this._renderChildren();
  
      this.triggerMethod('render', this);
      return this;
    },
  
    _renderChildren: function() {
      if (this.isRendered) {
        Marionette.CollectionView.prototype._renderChildren.call(this);
      }
    },
  
    // Render the root template that the children
    // views are appended to
    _renderTemplate: function() {
      var data = {};
      data = this.serializeData();
      data = this.mixinTemplateHelpers(data);
  
      this.triggerMethod('before:render:template');
  
      var template = this.getTemplate();
      var html = Marionette.Renderer.render(template, data, this);
      this.attachElContent(html);
  
      // the ui bindings is done here and not at the end of render since they
      // will not be available until after the model is rendered, but should be
      // available before the collection is rendered.
      this.bindUIElements();
      this.triggerMethod('render:template');
    },
  
    // Attaches the content of the root.
    // This method can be overridden to optimize rendering,
    // or to render in a non standard way.
    //
    // For example, using `innerHTML` instead of `$el.html`
    //
    // ```js
    // attachElContent: function(html) {
    //   this.el.innerHTML = html;
    //   return this;
    // }
    // ```
    attachElContent: function(html) {
      this.$el.html(html);
  
      return this;
    },
  
    // You might need to override this if you've overridden attachHtml
    attachBuffer: function(compositeView, buffer) {
      var $container = this.getChildViewContainer(compositeView);
      $container.append(buffer);
    },
  
    // Internal method. Append a view to the end of the $el.
    // Overidden from CollectionView to ensure view is appended to
    // childViewContainer
    _insertAfter: function (childView) {
      var $container = this.getChildViewContainer(this, childView);
      $container.append(childView.el);
    },
  
    // Internal method to ensure an `$childViewContainer` exists, for the
    // `attachHtml` method to use.
    getChildViewContainer: function(containerView, childView) {
      if ('$childViewContainer' in containerView) {
        return containerView.$childViewContainer;
      }
  
      var container;
      var childViewContainer = Marionette.getOption(containerView, 'childViewContainer');
      if (childViewContainer) {
  
        var selector = _.isFunction(childViewContainer) ? childViewContainer.call(containerView) : childViewContainer;
  
        if (selector.charAt(0) === '@' && containerView.ui) {
          container = containerView.ui[selector.substr(4)];
        } else {
          container = containerView.$(selector);
        }
  
        if (container.length <= 0) {
          throw new Marionette.Error({
            name: 'ChildViewContainerMissingError',
            message: 'The specified "childViewContainer" was not found: ' + containerView.childViewContainer
          });
        }
  
      } else {
        container = containerView.$el;
      }
  
      containerView.$childViewContainer = container;
      return container;
    },
  
    // Internal method to reset the `$childViewContainer` on render
    resetChildViewContainer: function() {
      if (this.$childViewContainer) {
        delete this.$childViewContainer;
      }
    }
  });
  
  // Layout View
  // -----------
  
  // Used for managing application layoutViews, nested layoutViews and
  // multiple regions within an application or sub-application.
  //
  // A specialized view class that renders an area of HTML and then
  // attaches `Region` instances to the specified `regions`.
  // Used for composite view management and sub-application areas.
  Marionette.LayoutView = Marionette.ItemView.extend({
    regionClass: Marionette.Region,
  
    // Ensure the regions are available when the `initialize` method
    // is called.
    constructor: function(options) {
      options = options || {};
  
      this._firstRender = true;
      this._initializeRegions(options);
  
      Marionette.ItemView.call(this, options);
    },
  
    // LayoutView's render will use the existing region objects the
    // first time it is called. Subsequent calls will destroy the
    // views that the regions are showing and then reset the `el`
    // for the regions to the newly rendered DOM elements.
    render: function() {
      this._ensureViewIsIntact();
  
      if (this._firstRender) {
        // if this is the first render, don't do anything to
        // reset the regions
        this._firstRender = false;
      } else {
        // If this is not the first render call, then we need to
        // re-initialize the `el` for each region
        this._reInitializeRegions();
      }
  
      return Marionette.ItemView.prototype.render.apply(this, arguments);
    },
  
    // Handle destroying regions, and then destroy the view itself.
    destroy: function() {
      if (this.isDestroyed) { return this; }
  
      this.regionManager.destroy();
      return Marionette.ItemView.prototype.destroy.apply(this, arguments);
    },
  
    // Add a single region, by name, to the layoutView
    addRegion: function(name, definition) {
      var regions = {};
      regions[name] = definition;
      return this._buildRegions(regions)[name];
    },
  
    // Add multiple regions as a {name: definition, name2: def2} object literal
    addRegions: function(regions) {
      this.regions = _.extend({}, this.regions, regions);
      return this._buildRegions(regions);
    },
  
    // Remove a single region from the LayoutView, by name
    removeRegion: function(name) {
      delete this.regions[name];
      return this.regionManager.removeRegion(name);
    },
  
    // Provides alternative access to regions
    // Accepts the region name
    // getRegion('main')
    getRegion: function(region) {
      return this.regionManager.get(region);
    },
  
    // Get all regions
    getRegions: function(){
      return this.regionManager.getRegions();
    },
  
    // internal method to build regions
    _buildRegions: function(regions) {
      var defaults = {
        regionClass: this.getOption('regionClass'),
        parentEl: _.partial(_.result, this, '$el')
      };
  
      return this.regionManager.addRegions(regions, defaults);
    },
  
    // Internal method to initialize the regions that have been defined in a
    // `regions` attribute on this layoutView.
    _initializeRegions: function(options) {
      var regions;
      this._initRegionManager();
  
      if (_.isFunction(this.regions)) {
        regions = this.regions(options);
      } else {
        regions = this.regions || {};
      }
  
      // Enable users to define `regions` as instance options.
      var regionOptions = this.getOption.call(options, 'regions');
  
      // enable region options to be a function
      if (_.isFunction(regionOptions)) {
        regionOptions = regionOptions.call(this, options);
      }
  
      _.extend(regions, regionOptions);
  
      // Normalize region selectors hash to allow
      // a user to use the @ui. syntax.
      regions = this.normalizeUIValues(regions);
  
      this.addRegions(regions);
    },
  
    // Internal method to re-initialize all of the regions by updating the `el` that
    // they point to
    _reInitializeRegions: function() {
      this.regionManager.invoke('reset');
    },
  
    // Enable easy overriding of the default `RegionManager`
    // for customized region interactions and business specific
    // view logic for better control over single regions.
    getRegionManager: function() {
      return new Marionette.RegionManager();
    },
  
    // Internal method to initialize the region manager
    // and all regions in it
    _initRegionManager: function() {
      this.regionManager = this.getRegionManager();
      this.regionManager._parent = this;
  
      this.listenTo(this.regionManager, 'before:add:region', function(name) {
        this.triggerMethod('before:add:region', name);
      });
  
      this.listenTo(this.regionManager, 'add:region', function(name, region) {
        this[name] = region;
        this.triggerMethod('add:region', name, region);
      });
  
      this.listenTo(this.regionManager, 'before:remove:region', function(name) {
        this.triggerMethod('before:remove:region', name);
      });
  
      this.listenTo(this.regionManager, 'remove:region', function(name, region) {
        delete this[name];
        this.triggerMethod('remove:region', name, region);
      });
    },
  
    _getImmediateChildren: function() {
      return _.chain(this.regionManager.getRegions())
        .pluck('currentView')
        .compact()
        .value();
    }
  });
  

  // Behavior
  // --------
  
  // A Behavior is an isolated set of DOM /
  // user interactions that can be mixed into any View.
  // Behaviors allow you to blackbox View specific interactions
  // into portable logical chunks, keeping your views simple and your code DRY.
  
  Marionette.Behavior = Marionette.Object.extend({
    constructor: function(options, view) {
      // Setup reference to the view.
      // this comes in handle when a behavior
      // wants to directly talk up the chain
      // to the view.
      this.view = view;
      this.defaults = _.result(this, 'defaults') || {};
      this.options  = _.extend({}, this.defaults, options);
  
      Marionette.Object.apply(this, arguments);
    },
  
    // proxy behavior $ method to the view
    // this is useful for doing jquery DOM lookups
    // scoped to behaviors view.
    $: function() {
      return this.view.$.apply(this.view, arguments);
    },
  
    // Stops the behavior from listening to events.
    // Overrides Object#destroy to prevent additional events from being triggered.
    destroy: function() {
      this.stopListening();
    },
  
    proxyViewProperties: function (view) {
      this.$el = view.$el;
      this.el = view.el;
    }
  });
  
  /* jshint maxlen: 143 */
  // Behaviors
  // ---------
  
  // Behaviors is a utility class that takes care of
  // gluing your behavior instances to their given View.
  // The most important part of this class is that you
  // **MUST** override the class level behaviorsLookup
  // method for things to work properly.
  
  Marionette.Behaviors = (function(Marionette, _) {
  
    function Behaviors(view, behaviors) {
  
      if (!_.isObject(view.behaviors)) {
        return {};
      }
  
      // Behaviors defined on a view can be a flat object literal
      // or it can be a function that returns an object.
      behaviors = Behaviors.parseBehaviors(view, behaviors || _.result(view, 'behaviors'));
  
      // Wraps several of the view's methods
      // calling the methods first on each behavior
      // and then eventually calling the method on the view.
      Behaviors.wrap(view, behaviors, _.keys(methods));
      return behaviors;
    }
  
    var methods = {
      behaviorTriggers: function(behaviorTriggers, behaviors) {
        var triggerBuilder = new BehaviorTriggersBuilder(this, behaviors);
        return triggerBuilder.buildBehaviorTriggers();
      },
  
      behaviorEvents: function(behaviorEvents, behaviors) {
        var _behaviorsEvents = {};
        var viewUI = _.result(this, 'ui');
  
        _.each(behaviors, function(b, i) {
          var _events = {};
          var behaviorEvents = _.clone(_.result(b, 'events')) || {};
          var behaviorUI = _.result(b, 'ui');
  
          // Construct an internal UI hash first using
          // the views UI hash and then the behaviors UI hash.
          // This allows the user to use UI hash elements
          // defined in the parent view as well as those
          // defined in the given behavior.
          var ui = _.extend({}, viewUI, behaviorUI);
  
          // Normalize behavior events hash to allow
          // a user to use the @ui. syntax.
          behaviorEvents = Marionette.normalizeUIKeys(behaviorEvents, ui);
  
          _.each(_.keys(behaviorEvents), function(key) {
            // Append white-space at the end of each key to prevent behavior key collisions.
            // This is relying on the fact that backbone events considers "click .foo" the same as
            // "click .foo ".
  
            // +2 is used because new Array(1) or 0 is "" and not " "
            var whitespace = (new Array(i + 2)).join(' ');
            var eventKey   = key + whitespace;
            var handler    = _.isFunction(behaviorEvents[key]) ? behaviorEvents[key] : b[behaviorEvents[key]];
  
            _events[eventKey] = _.bind(handler, b);
          });
  
          _behaviorsEvents = _.extend(_behaviorsEvents, _events);
        });
  
        return _behaviorsEvents;
      }
    };
  
    _.extend(Behaviors, {
  
      // Placeholder method to be extended by the user.
      // The method should define the object that stores the behaviors.
      // i.e.
      //
      // ```js
      // Marionette.Behaviors.behaviorsLookup: function() {
      //   return App.Behaviors
      // }
      // ```
      behaviorsLookup: function() {
        throw new Marionette.Error({
          message: 'You must define where your behaviors are stored.',
          url: 'marionette.behaviors.html#behaviorslookup'
        });
      },
  
      // Takes care of getting the behavior class
      // given options and a key.
      // If a user passes in options.behaviorClass
      // default to using that. Otherwise delegate
      // the lookup to the users `behaviorsLookup` implementation.
      getBehaviorClass: function(options, key) {
        if (options.behaviorClass) {
          return options.behaviorClass;
        }
  
        // Get behavior class can be either a flat object or a method
        return _.isFunction(Behaviors.behaviorsLookup) ? Behaviors.behaviorsLookup.apply(this, arguments)[key] : Behaviors.behaviorsLookup[key];
      },
  
      // Iterate over the behaviors object, for each behavior
      // instantiate it and get its grouped behaviors.
      parseBehaviors: function(view, behaviors) {
        return _.chain(behaviors).map(function(options, key) {
          var BehaviorClass = Behaviors.getBehaviorClass(options, key);
  
          var behavior = new BehaviorClass(options, view);
          var nestedBehaviors = Behaviors.parseBehaviors(view, _.result(behavior, 'behaviors'));
  
          return [behavior].concat(nestedBehaviors);
        }).flatten().value();
      },
  
      // Wrap view internal methods so that they delegate to behaviors. For example,
      // `onDestroy` should trigger destroy on all of the behaviors and then destroy itself.
      // i.e.
      //
      // `view.delegateEvents = _.partial(methods.delegateEvents, view.delegateEvents, behaviors);`
      wrap: function(view, behaviors, methodNames) {
        _.each(methodNames, function(methodName) {
          view[methodName] = _.partial(methods[methodName], view[methodName], behaviors);
        });
      }
    });
  
    // Class to build handlers for `triggers` on behaviors
    // for views
    function BehaviorTriggersBuilder(view, behaviors) {
      this._view      = view;
      this._viewUI    = _.result(view, 'ui');
      this._behaviors = behaviors;
      this._triggers  = {};
    }
  
    _.extend(BehaviorTriggersBuilder.prototype, {
      // Main method to build the triggers hash with event keys and handlers
      buildBehaviorTriggers: function() {
        _.each(this._behaviors, this._buildTriggerHandlersForBehavior, this);
        return this._triggers;
      },
  
      // Internal method to build all trigger handlers for a given behavior
      _buildTriggerHandlersForBehavior: function(behavior, i) {
        var ui = _.extend({}, this._viewUI, _.result(behavior, 'ui'));
        var triggersHash = _.clone(_.result(behavior, 'triggers')) || {};
  
        triggersHash = Marionette.normalizeUIKeys(triggersHash, ui);
  
        _.each(triggersHash, _.partial(this._setHandlerForBehavior, behavior, i), this);
      },
  
      // Internal method to create and assign the trigger handler for a given
      // behavior
      _setHandlerForBehavior: function(behavior, i, eventName, trigger) {
        // Unique identifier for the `this._triggers` hash
        var triggerKey = trigger.replace(/^\S+/, function(triggerName) {
          return triggerName + '.' + 'behaviortriggers' + i;
        });
  
        this._triggers[triggerKey] = this._view._buildViewTrigger(eventName);
      }
    });
  
    return Behaviors;
  
  })(Marionette, _);
  

  // App Router
  // ----------
  
  // Reduce the boilerplate code of handling route events
  // and then calling a single method on another object.
  // Have your routers configured to call the method on
  // your object, directly.
  //
  // Configure an AppRouter with `appRoutes`.
  //
  // App routers can only take one `controller` object.
  // It is recommended that you divide your controller
  // objects in to smaller pieces of related functionality
  // and have multiple routers / controllers, instead of
  // just one giant router and controller.
  //
  // You can also add standard routes to an AppRouter.
  
  Marionette.AppRouter = Backbone.Router.extend({
  
    constructor: function(options) {
      this.options = options || {};
  
      Backbone.Router.apply(this, arguments);
  
      var appRoutes = this.getOption('appRoutes');
      var controller = this._getController();
      this.processAppRoutes(controller, appRoutes);
      this.on('route', this._processOnRoute, this);
    },
  
    // Similar to route method on a Backbone Router but
    // method is called on the controller
    appRoute: function(route, methodName) {
      var controller = this._getController();
      this._addAppRoute(controller, route, methodName);
    },
  
    // process the route event and trigger the onRoute
    // method call, if it exists
    _processOnRoute: function(routeName, routeArgs) {
      // make sure an onRoute before trying to call it
      if (_.isFunction(this.onRoute)) {
        // find the path that matches the current route
        var routePath = _.invert(this.getOption('appRoutes'))[routeName];
        this.onRoute(routeName, routePath, routeArgs);
      }
    },
  
    // Internal method to process the `appRoutes` for the
    // router, and turn them in to routes that trigger the
    // specified method on the specified `controller`.
    processAppRoutes: function(controller, appRoutes) {
      if (!appRoutes) { return; }
  
      var routeNames = _.keys(appRoutes).reverse(); // Backbone requires reverted order of routes
  
      _.each(routeNames, function(route) {
        this._addAppRoute(controller, route, appRoutes[route]);
      }, this);
    },
  
    _getController: function() {
      return this.getOption('controller');
    },
  
    _addAppRoute: function(controller, route, methodName) {
      var method = controller[methodName];
  
      if (!method) {
        throw new Marionette.Error('Method "' + methodName + '" was not found on the controller');
      }
  
      this.route(route, methodName, _.bind(method, controller));
    },
  
    // Proxy `getOption` to enable getting options from this or this.options by name.
    getOption: Marionette.proxyGetOption,
  
    triggerMethod: Marionette.triggerMethod,
  
    bindEntityEvents: Marionette.proxyBindEntityEvents,
  
    unbindEntityEvents: Marionette.proxyUnbindEntityEvents
  });
  
  // Application
  // -----------
  
  // Contain and manage the composite application as a whole.
  // Stores and starts up `Region` objects, includes an
  // event aggregator as `app.vent`
  Marionette.Application = Marionette.Object.extend({
    constructor: function(options) {
      this._initializeRegions(options);
      this._initCallbacks = new Marionette.Callbacks();
      this.submodules = {};
      _.extend(this, options);
      this._initChannel();
      Marionette.Object.call(this, options);
    },
  
    // Command execution, facilitated by Backbone.Wreqr.Commands
    execute: function() {
      this.commands.execute.apply(this.commands, arguments);
    },
  
    // Request/response, facilitated by Backbone.Wreqr.RequestResponse
    request: function() {
      return this.reqres.request.apply(this.reqres, arguments);
    },
  
    // Add an initializer that is either run at when the `start`
    // method is called, or run immediately if added after `start`
    // has already been called.
    addInitializer: function(initializer) {
      this._initCallbacks.add(initializer);
    },
  
    // kick off all of the application's processes.
    // initializes all of the regions that have been added
    // to the app, and runs all of the initializer functions
    start: function(options) {
      this.triggerMethod('before:start', options);
      this._initCallbacks.run(options, this);
      this.triggerMethod('start', options);
    },
  
    // Add regions to your app.
    // Accepts a hash of named strings or Region objects
    // addRegions({something: "#someRegion"})
    // addRegions({something: Region.extend({el: "#someRegion"}) });
    addRegions: function(regions) {
      return this._regionManager.addRegions(regions);
    },
  
    // Empty all regions in the app, without removing them
    emptyRegions: function() {
      return this._regionManager.emptyRegions();
    },
  
    // Removes a region from your app, by name
    // Accepts the regions name
    // removeRegion('myRegion')
    removeRegion: function(region) {
      return this._regionManager.removeRegion(region);
    },
  
    // Provides alternative access to regions
    // Accepts the region name
    // getRegion('main')
    getRegion: function(region) {
      return this._regionManager.get(region);
    },
  
    // Get all the regions from the region manager
    getRegions: function(){
      return this._regionManager.getRegions();
    },
  
    // Create a module, attached to the application
    module: function(moduleNames, moduleDefinition) {
  
      // Overwrite the module class if the user specifies one
      var ModuleClass = Marionette.Module.getClass(moduleDefinition);
  
      var args = _.toArray(arguments);
      args.unshift(this);
  
      // see the Marionette.Module object for more information
      return ModuleClass.create.apply(ModuleClass, args);
    },
  
    // Enable easy overriding of the default `RegionManager`
    // for customized region interactions and business-specific
    // view logic for better control over single regions.
    getRegionManager: function() {
      return new Marionette.RegionManager();
    },
  
    // Internal method to initialize the regions that have been defined in a
    // `regions` attribute on the application instance
    _initializeRegions: function(options) {
      var regions = _.isFunction(this.regions) ? this.regions(options) : this.regions || {};
  
      this._initRegionManager();
  
      // Enable users to define `regions` in instance options.
      var optionRegions = Marionette.getOption(options, 'regions');
  
      // Enable region options to be a function
      if (_.isFunction(optionRegions)) {
        optionRegions = optionRegions.call(this, options);
      }
  
      // Overwrite current regions with those passed in options
      _.extend(regions, optionRegions);
  
      this.addRegions(regions);
  
      return this;
    },
  
    // Internal method to set up the region manager
    _initRegionManager: function() {
      this._regionManager = this.getRegionManager();
      this._regionManager._parent = this;
  
      this.listenTo(this._regionManager, 'before:add:region', function() {
        Marionette._triggerMethod(this, 'before:add:region', arguments);
      });
  
      this.listenTo(this._regionManager, 'add:region', function(name, region) {
        this[name] = region;
        Marionette._triggerMethod(this, 'add:region', arguments);
      });
  
      this.listenTo(this._regionManager, 'before:remove:region', function() {
        Marionette._triggerMethod(this, 'before:remove:region', arguments);
      });
  
      this.listenTo(this._regionManager, 'remove:region', function(name) {
        delete this[name];
        Marionette._triggerMethod(this, 'remove:region', arguments);
      });
    },
  
    // Internal method to setup the Wreqr.radio channel
    _initChannel: function() {
      this.channelName = _.result(this, 'channelName') || 'global';
      this.channel = _.result(this, 'channel') || Backbone.Wreqr.radio.channel(this.channelName);
      this.vent = _.result(this, 'vent') || this.channel.vent;
      this.commands = _.result(this, 'commands') || this.channel.commands;
      this.reqres = _.result(this, 'reqres') || this.channel.reqres;
    }
  });
  
  /* jshint maxparams: 9 */
  
  // Module
  // ------
  
  // A simple module system, used to create privacy and encapsulation in
  // Marionette applications
  Marionette.Module = function(moduleName, app, options) {
    this.moduleName = moduleName;
    this.options = _.extend({}, this.options, options);
    // Allow for a user to overide the initialize
    // for a given module instance.
    this.initialize = options.initialize || this.initialize;
  
    // Set up an internal store for sub-modules.
    this.submodules = {};
  
    this._setupInitializersAndFinalizers();
  
    // Set an internal reference to the app
    // within a module.
    this.app = app;
  
    if (_.isFunction(this.initialize)) {
      this.initialize(moduleName, app, this.options);
    }
  };
  
  Marionette.Module.extend = Marionette.extend;
  
  // Extend the Module prototype with events / listenTo, so that the module
  // can be used as an event aggregator or pub/sub.
  _.extend(Marionette.Module.prototype, Backbone.Events, {
  
    // By default modules start with their parents.
    startWithParent: true,
  
    // Initialize is an empty function by default. Override it with your own
    // initialization logic when extending Marionette.Module.
    initialize: function() {},
  
    // Initializer for a specific module. Initializers are run when the
    // module's `start` method is called.
    addInitializer: function(callback) {
      this._initializerCallbacks.add(callback);
    },
  
    // Finalizers are run when a module is stopped. They are used to teardown
    // and finalize any variables, references, events and other code that the
    // module had set up.
    addFinalizer: function(callback) {
      this._finalizerCallbacks.add(callback);
    },
  
    // Start the module, and run all of its initializers
    start: function(options) {
      // Prevent re-starting a module that is already started
      if (this._isInitialized) { return; }
  
      // start the sub-modules (depth-first hierarchy)
      _.each(this.submodules, function(mod) {
        // check to see if we should start the sub-module with this parent
        if (mod.startWithParent) {
          mod.start(options);
        }
      });
  
      // run the callbacks to "start" the current module
      this.triggerMethod('before:start', options);
  
      this._initializerCallbacks.run(options, this);
      this._isInitialized = true;
  
      this.triggerMethod('start', options);
    },
  
    // Stop this module by running its finalizers and then stop all of
    // the sub-modules for this module
    stop: function() {
      // if we are not initialized, don't bother finalizing
      if (!this._isInitialized) { return; }
      this._isInitialized = false;
  
      this.triggerMethod('before:stop');
  
      // stop the sub-modules; depth-first, to make sure the
      // sub-modules are stopped / finalized before parents
      _.invoke(this.submodules, 'stop');
  
      // run the finalizers
      this._finalizerCallbacks.run(undefined, this);
  
      // reset the initializers and finalizers
      this._initializerCallbacks.reset();
      this._finalizerCallbacks.reset();
  
      this.triggerMethod('stop');
    },
  
    // Configure the module with a definition function and any custom args
    // that are to be passed in to the definition function
    addDefinition: function(moduleDefinition, customArgs) {
      this._runModuleDefinition(moduleDefinition, customArgs);
    },
  
    // Internal method: run the module definition function with the correct
    // arguments
    _runModuleDefinition: function(definition, customArgs) {
      // If there is no definition short circut the method.
      if (!definition) { return; }
  
      // build the correct list of arguments for the module definition
      var args = _.flatten([
        this,
        this.app,
        Backbone,
        Marionette,
        Backbone.$, _,
        customArgs
      ]);
  
      definition.apply(this, args);
    },
  
    // Internal method: set up new copies of initializers and finalizers.
    // Calling this method will wipe out all existing initializers and
    // finalizers.
    _setupInitializersAndFinalizers: function() {
      this._initializerCallbacks = new Marionette.Callbacks();
      this._finalizerCallbacks = new Marionette.Callbacks();
    },
  
    // import the `triggerMethod` to trigger events with corresponding
    // methods if the method exists
    triggerMethod: Marionette.triggerMethod
  });
  
  // Class methods to create modules
  _.extend(Marionette.Module, {
  
    // Create a module, hanging off the app parameter as the parent object.
    create: function(app, moduleNames, moduleDefinition) {
      var module = app;
  
      // get the custom args passed in after the module definition and
      // get rid of the module name and definition function
      var customArgs = _.rest(arguments, 3);
  
      // Split the module names and get the number of submodules.
      // i.e. an example module name of `Doge.Wow.Amaze` would
      // then have the potential for 3 module definitions.
      moduleNames = moduleNames.split('.');
      var length = moduleNames.length;
  
      // store the module definition for the last module in the chain
      var moduleDefinitions = [];
      moduleDefinitions[length - 1] = moduleDefinition;
  
      // Loop through all the parts of the module definition
      _.each(moduleNames, function(moduleName, i) {
        var parentModule = module;
        module = this._getModule(parentModule, moduleName, app, moduleDefinition);
        this._addModuleDefinition(parentModule, module, moduleDefinitions[i], customArgs);
      }, this);
  
      // Return the last module in the definition chain
      return module;
    },
  
    _getModule: function(parentModule, moduleName, app, def, args) {
      var options = _.extend({}, def);
      var ModuleClass = this.getClass(def);
  
      // Get an existing module of this name if we have one
      var module = parentModule[moduleName];
  
      if (!module) {
        // Create a new module if we don't have one
        module = new ModuleClass(moduleName, app, options);
        parentModule[moduleName] = module;
        // store the module on the parent
        parentModule.submodules[moduleName] = module;
      }
  
      return module;
    },
  
    // ## Module Classes
    //
    // Module classes can be used as an alternative to the define pattern.
    // The extend function of a Module is identical to the extend functions
    // on other Backbone and Marionette classes.
    // This allows module lifecyle events like `onStart` and `onStop` to be called directly.
    getClass: function(moduleDefinition) {
      var ModuleClass = Marionette.Module;
  
      if (!moduleDefinition) {
        return ModuleClass;
      }
  
      // If all of the module's functionality is defined inside its class,
      // then the class can be passed in directly. `MyApp.module("Foo", FooModule)`.
      if (moduleDefinition.prototype instanceof ModuleClass) {
        return moduleDefinition;
      }
  
      return moduleDefinition.moduleClass || ModuleClass;
    },
  
    // Add the module definition and add a startWithParent initializer function.
    // This is complicated because module definitions are heavily overloaded
    // and support an anonymous function, module class, or options object
    _addModuleDefinition: function(parentModule, module, def, args) {
      var fn = this._getDefine(def);
      var startWithParent = this._getStartWithParent(def, module);
  
      if (fn) {
        module.addDefinition(fn, args);
      }
  
      this._addStartWithParent(parentModule, module, startWithParent);
    },
  
    _getStartWithParent: function(def, module) {
      var swp;
  
      if (_.isFunction(def) && (def.prototype instanceof Marionette.Module)) {
        swp = module.constructor.prototype.startWithParent;
        return _.isUndefined(swp) ? true : swp;
      }
  
      if (_.isObject(def)) {
        swp = def.startWithParent;
        return _.isUndefined(swp) ? true : swp;
      }
  
      return true;
    },
  
    _getDefine: function(def) {
      if (_.isFunction(def) && !(def.prototype instanceof Marionette.Module)) {
        return def;
      }
  
      if (_.isObject(def)) {
        return def.define;
      }
  
      return null;
    },
  
    _addStartWithParent: function(parentModule, module, startWithParent) {
      module.startWithParent = module.startWithParent && startWithParent;
  
      if (!module.startWithParent || !!module.startWithParentIsConfigured) {
        return;
      }
  
      module.startWithParentIsConfigured = true;
  
      parentModule.addInitializer(function(options) {
        if (module.startWithParent) {
          module.start(options);
        }
      });
    }
  });
  

  return Marionette;
}));

},{"backbone":7,"backbone.babysitter":4,"backbone.wreqr":5,"underscore":6}],4:[function(require,module,exports){
// Backbone.BabySitter
// -------------------
// v0.1.5
//
// Copyright (c)2014 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://github.com/marionettejs/backbone.babysitter

(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return factory(Backbone, _);
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(Backbone, _);
  } else {
    factory(root.Backbone, root._);
  }

}(this, function(Backbone, _) {
  'use strict';

  var previousChildViewContainer = Backbone.ChildViewContainer;

  // BabySitter.ChildViewContainer
  // -----------------------------
  //
  // Provide a container to store, retrieve and
  // shut down child views.
  
  Backbone.ChildViewContainer = (function (Backbone, _) {
  
    // Container Constructor
    // ---------------------
  
    var Container = function(views){
      this._views = {};
      this._indexByModel = {};
      this._indexByCustom = {};
      this._updateLength();
  
      _.each(views, this.add, this);
    };
  
    // Container Methods
    // -----------------
  
    _.extend(Container.prototype, {
  
      // Add a view to this container. Stores the view
      // by `cid` and makes it searchable by the model
      // cid (and model itself). Optionally specify
      // a custom key to store an retrieve the view.
      add: function(view, customIndex){
        var viewCid = view.cid;
  
        // store the view
        this._views[viewCid] = view;
  
        // index it by model
        if (view.model){
          this._indexByModel[view.model.cid] = viewCid;
        }
  
        // index by custom
        if (customIndex){
          this._indexByCustom[customIndex] = viewCid;
        }
  
        this._updateLength();
        return this;
      },
  
      // Find a view by the model that was attached to
      // it. Uses the model's `cid` to find it.
      findByModel: function(model){
        return this.findByModelCid(model.cid);
      },
  
      // Find a view by the `cid` of the model that was attached to
      // it. Uses the model's `cid` to find the view `cid` and
      // retrieve the view using it.
      findByModelCid: function(modelCid){
        var viewCid = this._indexByModel[modelCid];
        return this.findByCid(viewCid);
      },
  
      // Find a view by a custom indexer.
      findByCustom: function(index){
        var viewCid = this._indexByCustom[index];
        return this.findByCid(viewCid);
      },
  
      // Find by index. This is not guaranteed to be a
      // stable index.
      findByIndex: function(index){
        return _.values(this._views)[index];
      },
  
      // retrieve a view by its `cid` directly
      findByCid: function(cid){
        return this._views[cid];
      },
  
      // Remove a view
      remove: function(view){
        var viewCid = view.cid;
  
        // delete model index
        if (view.model){
          delete this._indexByModel[view.model.cid];
        }
  
        // delete custom index
        _.any(this._indexByCustom, function(cid, key) {
          if (cid === viewCid) {
            delete this._indexByCustom[key];
            return true;
          }
        }, this);
  
        // remove the view from the container
        delete this._views[viewCid];
  
        // update the length
        this._updateLength();
        return this;
      },
  
      // Call a method on every view in the container,
      // passing parameters to the call method one at a
      // time, like `function.call`.
      call: function(method){
        this.apply(method, _.tail(arguments));
      },
  
      // Apply a method on every view in the container,
      // passing parameters to the call method one at a
      // time, like `function.apply`.
      apply: function(method, args){
        _.each(this._views, function(view){
          if (_.isFunction(view[method])){
            view[method].apply(view, args || []);
          }
        });
      },
  
      // Update the `.length` attribute on this container
      _updateLength: function(){
        this.length = _.size(this._views);
      }
    });
  
    // Borrowing this code from Backbone.Collection:
    // http://backbonejs.org/docs/backbone.html#section-106
    //
    // Mix in methods from Underscore, for iteration, and other
    // collection related features.
    var methods = ['forEach', 'each', 'map', 'find', 'detect', 'filter',
      'select', 'reject', 'every', 'all', 'some', 'any', 'include',
      'contains', 'invoke', 'toArray', 'first', 'initial', 'rest',
      'last', 'without', 'isEmpty', 'pluck'];
  
    _.each(methods, function(method) {
      Container.prototype[method] = function() {
        var views = _.values(this._views);
        var args = [views].concat(_.toArray(arguments));
        return _[method].apply(_, args);
      };
    });
  
    // return the public API
    return Container;
  })(Backbone, _);
  

  Backbone.ChildViewContainer.VERSION = '0.1.5';

  Backbone.ChildViewContainer.noConflict = function () {
    Backbone.ChildViewContainer = previousChildViewContainer;
    return this;
  };

  return Backbone.ChildViewContainer;

}));

},{"backbone":7,"underscore":6}],5:[function(require,module,exports){
// Backbone.Wreqr (Backbone.Marionette)
// ----------------------------------
// v1.3.1
//
// Copyright (c)2014 Derick Bailey, Muted Solutions, LLC.
// Distributed under MIT license
//
// http://github.com/marionettejs/backbone.wreqr


(function(root, factory) {

  if (typeof define === 'function' && define.amd) {
    define(['backbone', 'underscore'], function(Backbone, _) {
      return factory(Backbone, _);
    });
  } else if (typeof exports !== 'undefined') {
    var Backbone = require('backbone');
    var _ = require('underscore');
    module.exports = factory(Backbone, _);
  } else {
    factory(root.Backbone, root._);
  }

}(this, function(Backbone, _) {
  "use strict";

  var previousWreqr = Backbone.Wreqr;

  var Wreqr = Backbone.Wreqr = {};

  Backbone.Wreqr.VERSION = '1.3.1';

  Backbone.Wreqr.noConflict = function () {
    Backbone.Wreqr = previousWreqr;
    return this;
  };

  // Handlers
  // --------
  // A registry of functions to call, given a name
  
  Wreqr.Handlers = (function(Backbone, _){
    "use strict";
    
    // Constructor
    // -----------
  
    var Handlers = function(options){
      this.options = options;
      this._wreqrHandlers = {};
      
      if (_.isFunction(this.initialize)){
        this.initialize(options);
      }
    };
  
    Handlers.extend = Backbone.Model.extend;
  
    // Instance Members
    // ----------------
  
    _.extend(Handlers.prototype, Backbone.Events, {
  
      // Add multiple handlers using an object literal configuration
      setHandlers: function(handlers){
        _.each(handlers, function(handler, name){
          var context = null;
  
          if (_.isObject(handler) && !_.isFunction(handler)){
            context = handler.context;
            handler = handler.callback;
          }
  
          this.setHandler(name, handler, context);
        }, this);
      },
  
      // Add a handler for the given name, with an
      // optional context to run the handler within
      setHandler: function(name, handler, context){
        var config = {
          callback: handler,
          context: context
        };
  
        this._wreqrHandlers[name] = config;
  
        this.trigger("handler:add", name, handler, context);
      },
  
      // Determine whether or not a handler is registered
      hasHandler: function(name){
        return !! this._wreqrHandlers[name];
      },
  
      // Get the currently registered handler for
      // the specified name. Throws an exception if
      // no handler is found.
      getHandler: function(name){
        var config = this._wreqrHandlers[name];
  
        if (!config){
          return;
        }
  
        return function(){
          var args = Array.prototype.slice.apply(arguments);
          return config.callback.apply(config.context, args);
        };
      },
  
      // Remove a handler for the specified name
      removeHandler: function(name){
        delete this._wreqrHandlers[name];
      },
  
      // Remove all handlers from this registry
      removeAllHandlers: function(){
        this._wreqrHandlers = {};
      }
    });
  
    return Handlers;
  })(Backbone, _);
  
  // Wreqr.CommandStorage
  // --------------------
  //
  // Store and retrieve commands for execution.
  Wreqr.CommandStorage = (function(){
    "use strict";
  
    // Constructor function
    var CommandStorage = function(options){
      this.options = options;
      this._commands = {};
  
      if (_.isFunction(this.initialize)){
        this.initialize(options);
      }
    };
  
    // Instance methods
    _.extend(CommandStorage.prototype, Backbone.Events, {
  
      // Get an object literal by command name, that contains
      // the `commandName` and the `instances` of all commands
      // represented as an array of arguments to process
      getCommands: function(commandName){
        var commands = this._commands[commandName];
  
        // we don't have it, so add it
        if (!commands){
  
          // build the configuration
          commands = {
            command: commandName, 
            instances: []
          };
  
          // store it
          this._commands[commandName] = commands;
        }
  
        return commands;
      },
  
      // Add a command by name, to the storage and store the
      // args for the command
      addCommand: function(commandName, args){
        var command = this.getCommands(commandName);
        command.instances.push(args);
      },
  
      // Clear all commands for the given `commandName`
      clearCommands: function(commandName){
        var command = this.getCommands(commandName);
        command.instances = [];
      }
    });
  
    return CommandStorage;
  })();
  
  // Wreqr.Commands
  // --------------
  //
  // A simple command pattern implementation. Register a command
  // handler and execute it.
  Wreqr.Commands = (function(Wreqr){
    "use strict";
  
    return Wreqr.Handlers.extend({
      // default storage type
      storageType: Wreqr.CommandStorage,
  
      constructor: function(options){
        this.options = options || {};
  
        this._initializeStorage(this.options);
        this.on("handler:add", this._executeCommands, this);
  
        var args = Array.prototype.slice.call(arguments);
        Wreqr.Handlers.prototype.constructor.apply(this, args);
      },
  
      // Execute a named command with the supplied args
      execute: function(name, args){
        name = arguments[0];
        args = Array.prototype.slice.call(arguments, 1);
  
        if (this.hasHandler(name)){
          this.getHandler(name).apply(this, args);
        } else {
          this.storage.addCommand(name, args);
        }
  
      },
  
      // Internal method to handle bulk execution of stored commands
      _executeCommands: function(name, handler, context){
        var command = this.storage.getCommands(name);
  
        // loop through and execute all the stored command instances
        _.each(command.instances, function(args){
          handler.apply(context, args);
        });
  
        this.storage.clearCommands(name);
      },
  
      // Internal method to initialize storage either from the type's
      // `storageType` or the instance `options.storageType`.
      _initializeStorage: function(options){
        var storage;
  
        var StorageType = options.storageType || this.storageType;
        if (_.isFunction(StorageType)){
          storage = new StorageType();
        } else {
          storage = StorageType;
        }
  
        this.storage = storage;
      }
    });
  
  })(Wreqr);
  
  // Wreqr.RequestResponse
  // ---------------------
  //
  // A simple request/response implementation. Register a
  // request handler, and return a response from it
  Wreqr.RequestResponse = (function(Wreqr){
    "use strict";
  
    return Wreqr.Handlers.extend({
      request: function(){
        var name = arguments[0];
        var args = Array.prototype.slice.call(arguments, 1);
        if (this.hasHandler(name)) {
          return this.getHandler(name).apply(this, args);
        }
      }
    });
  
  })(Wreqr);
  
  // Event Aggregator
  // ----------------
  // A pub-sub object that can be used to decouple various parts
  // of an application through event-driven architecture.
  
  Wreqr.EventAggregator = (function(Backbone, _){
    "use strict";
    var EA = function(){};
  
    // Copy the `extend` function used by Backbone's classes
    EA.extend = Backbone.Model.extend;
  
    // Copy the basic Backbone.Events on to the event aggregator
    _.extend(EA.prototype, Backbone.Events);
  
    return EA;
  })(Backbone, _);
  
  // Wreqr.Channel
  // --------------
  //
  // An object that wraps the three messaging systems:
  // EventAggregator, RequestResponse, Commands
  Wreqr.Channel = (function(Wreqr){
    "use strict";
  
    var Channel = function(channelName) {
      this.vent        = new Backbone.Wreqr.EventAggregator();
      this.reqres      = new Backbone.Wreqr.RequestResponse();
      this.commands    = new Backbone.Wreqr.Commands();
      this.channelName = channelName;
    };
  
    _.extend(Channel.prototype, {
  
      // Remove all handlers from the messaging systems of this channel
      reset: function() {
        this.vent.off();
        this.vent.stopListening();
        this.reqres.removeAllHandlers();
        this.commands.removeAllHandlers();
        return this;
      },
  
      // Connect a hash of events; one for each messaging system
      connectEvents: function(hash, context) {
        this._connect('vent', hash, context);
        return this;
      },
  
      connectCommands: function(hash, context) {
        this._connect('commands', hash, context);
        return this;
      },
  
      connectRequests: function(hash, context) {
        this._connect('reqres', hash, context);
        return this;
      },
  
      // Attach the handlers to a given message system `type`
      _connect: function(type, hash, context) {
        if (!hash) {
          return;
        }
  
        context = context || this;
        var method = (type === 'vent') ? 'on' : 'setHandler';
  
        _.each(hash, function(fn, eventName) {
          this[type][method](eventName, _.bind(fn, context));
        }, this);
      }
    });
  
  
    return Channel;
  })(Wreqr);
  
  // Wreqr.Radio
  // --------------
  //
  // An object that lets you communicate with many channels.
  Wreqr.radio = (function(Wreqr){
    "use strict";
  
    var Radio = function() {
      this._channels = {};
      this.vent = {};
      this.commands = {};
      this.reqres = {};
      this._proxyMethods();
    };
  
    _.extend(Radio.prototype, {
  
      channel: function(channelName) {
        if (!channelName) {
          throw new Error('Channel must receive a name');
        }
  
        return this._getChannel( channelName );
      },
  
      _getChannel: function(channelName) {
        var channel = this._channels[channelName];
  
        if(!channel) {
          channel = new Wreqr.Channel(channelName);
          this._channels[channelName] = channel;
        }
  
        return channel;
      },
  
      _proxyMethods: function() {
        _.each(['vent', 'commands', 'reqres'], function(system) {
          _.each( messageSystems[system], function(method) {
            this[system][method] = proxyMethod(this, system, method);
          }, this);
        }, this);
      }
    });
  
  
    var messageSystems = {
      vent: [
        'on',
        'off',
        'trigger',
        'once',
        'stopListening',
        'listenTo',
        'listenToOnce'
      ],
  
      commands: [
        'execute',
        'setHandler',
        'setHandlers',
        'removeHandler',
        'removeAllHandlers'
      ],
  
      reqres: [
        'request',
        'setHandler',
        'setHandlers',
        'removeHandler',
        'removeAllHandlers'
      ]
    };
  
    var proxyMethod = function(radio, system, method) {
      return function(channelName) {
        var messageSystem = radio._getChannel(channelName)[system];
        var args = Array.prototype.slice.call(arguments, 1);
  
        return messageSystem[method].apply(messageSystem, args);
      };
    };
  
    return new Radio();
  
  })(Wreqr);
  

  return Backbone.Wreqr;

}));

},{"backbone":7,"underscore":6}],6:[function(require,module,exports){
//     Underscore.js 1.6.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Establish the object that gets returned to break out of a loop iteration.
  var breaker = {};

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeForEach      = ArrayProto.forEach,
    nativeMap          = ArrayProto.map,
    nativeReduce       = ArrayProto.reduce,
    nativeReduceRight  = ArrayProto.reduceRight,
    nativeFilter       = ArrayProto.filter,
    nativeEvery        = ArrayProto.every,
    nativeSome         = ArrayProto.some,
    nativeIndexOf      = ArrayProto.indexOf,
    nativeLastIndexOf  = ArrayProto.lastIndexOf,
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object via a string identifier,
  // for Closure Compiler "advanced" mode.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.6.0';

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles objects with the built-in `forEach`, arrays, and raw objects.
  // Delegates to **ECMAScript 5**'s native `forEach` if available.
  var each = _.each = _.forEach = function(obj, iterator, context) {
    if (obj == null) return obj;
    if (nativeForEach && obj.forEach === nativeForEach) {
      obj.forEach(iterator, context);
    } else if (obj.length === +obj.length) {
      for (var i = 0, length = obj.length; i < length; i++) {
        if (iterator.call(context, obj[i], i, obj) === breaker) return;
      }
    } else {
      var keys = _.keys(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        if (iterator.call(context, obj[keys[i]], keys[i], obj) === breaker) return;
      }
    }
    return obj;
  };

  // Return the results of applying the iterator to each element.
  // Delegates to **ECMAScript 5**'s native `map` if available.
  _.map = _.collect = function(obj, iterator, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeMap && obj.map === nativeMap) return obj.map(iterator, context);
    each(obj, function(value, index, list) {
      results.push(iterator.call(context, value, index, list));
    });
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`. Delegates to **ECMAScript 5**'s native `reduce` if available.
  _.reduce = _.foldl = _.inject = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduce && obj.reduce === nativeReduce) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduce(iterator, memo) : obj.reduce(iterator);
    }
    each(obj, function(value, index, list) {
      if (!initial) {
        memo = value;
        initial = true;
      } else {
        memo = iterator.call(context, memo, value, index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  // Delegates to **ECMAScript 5**'s native `reduceRight` if available.
  _.reduceRight = _.foldr = function(obj, iterator, memo, context) {
    var initial = arguments.length > 2;
    if (obj == null) obj = [];
    if (nativeReduceRight && obj.reduceRight === nativeReduceRight) {
      if (context) iterator = _.bind(iterator, context);
      return initial ? obj.reduceRight(iterator, memo) : obj.reduceRight(iterator);
    }
    var length = obj.length;
    if (length !== +length) {
      var keys = _.keys(obj);
      length = keys.length;
    }
    each(obj, function(value, index, list) {
      index = keys ? keys[--length] : --length;
      if (!initial) {
        memo = obj[index];
        initial = true;
      } else {
        memo = iterator.call(context, memo, obj[index], index, list);
      }
    });
    if (!initial) throw new TypeError(reduceError);
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    any(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Delegates to **ECMAScript 5**'s native `filter` if available.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    if (nativeFilter && obj.filter === nativeFilter) return obj.filter(predicate, context);
    each(obj, function(value, index, list) {
      if (predicate.call(context, value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, function(value, index, list) {
      return !predicate.call(context, value, index, list);
    }, context);
  };

  // Determine whether all of the elements match a truth test.
  // Delegates to **ECMAScript 5**'s native `every` if available.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = true;
    if (obj == null) return result;
    if (nativeEvery && obj.every === nativeEvery) return obj.every(predicate, context);
    each(obj, function(value, index, list) {
      if (!(result = result && predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if at least one element in the object matches a truth test.
  // Delegates to **ECMAScript 5**'s native `some` if available.
  // Aliased as `any`.
  var any = _.some = _.any = function(obj, predicate, context) {
    predicate || (predicate = _.identity);
    var result = false;
    if (obj == null) return result;
    if (nativeSome && obj.some === nativeSome) return obj.some(predicate, context);
    each(obj, function(value, index, list) {
      if (result || (result = predicate.call(context, value, index, list))) return breaker;
    });
    return !!result;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (nativeIndexOf && obj.indexOf === nativeIndexOf) return obj.indexOf(target) != -1;
    return any(obj, function(value) {
      return value === target;
    });
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element or (element-based computation).
  // Can't optimize arrays of integers longer than 65,535 elements.
  // See [WebKit Bug 80797](https://bugs.webkit.org/show_bug.cgi?id=80797)
  _.max = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.max.apply(Math, obj);
    }
    var result = -Infinity, lastComputed = -Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed > lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iterator, context) {
    if (!iterator && _.isArray(obj) && obj[0] === +obj[0] && obj.length < 65535) {
      return Math.min.apply(Math, obj);
    }
    var result = Infinity, lastComputed = Infinity;
    each(obj, function(value, index, list) {
      var computed = iterator ? iterator.call(context, value, index, list) : value;
      if (computed < lastComputed) {
        result = value;
        lastComputed = computed;
      }
    });
    return result;
  };

  // Shuffle an array, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var rand;
    var index = 0;
    var shuffled = [];
    each(obj, function(value) {
      rand = _.random(index++);
      shuffled[index - 1] = shuffled[rand];
      shuffled[rand] = value;
    });
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // An internal function to generate lookup iterators.
  var lookupIterator = function(value) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return value;
    return _.property(value);
  };

  // Sort the object's values by a criterion produced by an iterator.
  _.sortBy = function(obj, iterator, context) {
    iterator = lookupIterator(iterator);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iterator.call(context, value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iterator, context) {
      var result = {};
      iterator = lookupIterator(iterator);
      each(obj, function(value, index) {
        var key = iterator.call(context, value, index, obj);
        behavior(result, key, value);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, key, value) {
    _.has(result, key) ? result[key].push(value) : result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, key, value) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, key) {
    _.has(result, key) ? result[key]++ : result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iterator, context) {
    iterator = lookupIterator(iterator);
    var value = iterator.call(context, obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = (low + high) >>> 1;
      iterator.call(context, array[mid]) < value ? low = mid + 1 : high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return (obj.length === +obj.length) ? obj.length : _.keys(obj).length;
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, array.length - ((n == null) || guard ? 1 : n));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if ((n == null) || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, (n == null) || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    each(input, function(value) {
      if (_.isArray(value) || _.isArguments(value)) {
        shallow ? push.apply(output, value) : flatten(value, shallow, output);
      } else {
        output.push(value);
      }
    });
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Split an array into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(array, predicate) {
    var pass = [], fail = [];
    each(array, function(elem) {
      (predicate(elem) ? pass : fail).push(elem);
    });
    return [pass, fail];
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iterator, context) {
    if (_.isFunction(isSorted)) {
      context = iterator;
      iterator = isSorted;
      isSorted = false;
    }
    var initial = iterator ? _.map(array, iterator, context) : array;
    var results = [];
    var seen = [];
    each(initial, function(value, index) {
      if (isSorted ? (!index || seen[seen.length - 1] !== value) : !_.contains(seen, value)) {
        seen.push(value);
        results.push(array[index]);
      }
    });
    return results;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(_.flatten(arguments, true));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    var rest = slice.call(arguments, 1);
    return _.filter(_.uniq(array), function(item) {
      return _.every(rest, function(other) {
        return _.contains(other, item);
      });
    });
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = concat.apply(ArrayProto, slice.call(arguments, 1));
    return _.filter(array, function(value){ return !_.contains(rest, value); });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function() {
    var length = _.max(_.pluck(arguments, 'length').concat(0));
    var results = new Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, '' + i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // If the browser doesn't supply us with indexOf (I'm looking at you, **MSIE**),
  // we need this function. Return the position of the first occurrence of an
  // item in an array, or -1 if the item is not included in the array.
  // Delegates to **ECMAScript 5**'s native `indexOf` if available.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = (isSorted < 0 ? Math.max(0, length + isSorted) : isSorted);
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    if (nativeIndexOf && array.indexOf === nativeIndexOf) return array.indexOf(item, isSorted);
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  // Delegates to **ECMAScript 5**'s native `lastIndexOf` if available.
  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var hasIndex = from != null;
    if (nativeLastIndexOf && array.lastIndexOf === nativeLastIndexOf) {
      return hasIndex ? array.lastIndexOf(item, from) : array.lastIndexOf(item);
    }
    var i = (hasIndex ? from : array.length);
    while (i--) if (array[i] === item) return i;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = arguments[2] || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var idx = 0;
    var range = new Array(length);

    while(idx < length) {
      range[idx++] = start;
      start += step;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError;
    args = slice.call(arguments, 2);
    return bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      ctor.prototype = func.prototype;
      var self = new ctor;
      ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (Object(result) === result) return result;
      return self;
    };
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var funcs = slice.call(arguments, 1);
    if (funcs.length === 0) throw new Error('bindAll must be passed function names');
    each(funcs, function(f) { obj[f] = _.bind(obj[f], obj); });
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memo = {};
    hasher || (hasher = _.identity);
    return function() {
      var key = hasher.apply(this, arguments);
      return _.has(memo, key) ? memo[key] : (memo[key] = func.apply(this, arguments));
    };
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){ return func.apply(null, args); }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    options || (options = {});
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;
      if (last < wait) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) {
        timeout = setTimeout(later, wait);
      }
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = function(func) {
    var ran = false, memo;
    return function() {
      if (ran) return memo;
      ran = true;
      memo = func.apply(this, arguments);
      func = null;
      return memo;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var funcs = arguments;
    return function() {
      var args = arguments;
      for (var i = funcs.length - 1; i >= 0; i--) {
        args = [funcs[i].apply(this, args)];
      }
      return args[0];
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = new Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = new Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    each(keys, function(key) {
      if (key in obj) copy[key] = obj[key];
    });
    return copy;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj) {
    var copy = {};
    var keys = concat.apply(ArrayProto, slice.call(arguments, 1));
    for (var key in obj) {
      if (!_.contains(keys, key)) copy[key] = obj[key];
    }
    return copy;
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    each(slice.call(arguments, 1), function(source) {
      if (source) {
        for (var prop in source) {
          if (obj[prop] === void 0) obj[prop] = source[prop];
        }
      }
    });
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a == 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className != toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, dates, and booleans are compared by value.
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return a == String(b);
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive. An `egal` comparison is performed for
        // other numeric values.
        return a != +a ? b != +b : (a == 0 ? 1 / a == 1 / b : a == +b);
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a == +b;
      // RegExps are compared by their source patterns and flags.
      case '[object RegExp]':
        return a.source == b.source &&
               a.global == b.global &&
               a.multiline == b.multiline &&
               a.ignoreCase == b.ignoreCase;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] == a) return bStack[length] == b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (aCtor !== bCtor && !(_.isFunction(aCtor) && (aCtor instanceof aCtor) &&
                             _.isFunction(bCtor) && (bCtor instanceof bCtor))
                        && ('constructor' in a && 'constructor' in b)) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size = 0, result = true;
    // Recursively compare objects and arrays.
    if (className == '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size == b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      for (var key in a) {
        if (_.has(a, key)) {
          // Count the expected number of properties.
          size++;
          // Deep compare each member.
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
      // Ensure that both objects contain the same number of properties.
      if (result) {
        for (key in b) {
          if (_.has(b, key) && !(size--)) break;
        }
        result = !size;
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) == '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    return obj === Object(obj);
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) == '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return !!(obj && _.has(obj, 'callee'));
    };
  }

  // Optimize `isFunction` if appropriate.
  if (typeof (/./) !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj === 'function';
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj != +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) == '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iterators.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function () {
      return value;
    };
  };

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    return function(obj) {
      if (obj === attrs) return true; //avoid comparing an object to itself.
      for (var key in attrs) {
        if (attrs[key] !== obj[key])
          return false;
      }
      return true;
    }
  };

  // Run a function **n** times.
  _.times = function(n, iterator, context) {
    var accum = Array(Math.max(0, n));
    for (var i = 0; i < n; i++) accum[i] = iterator.call(context, i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() { return new Date().getTime(); };

  // List of HTML entities for escaping.
  var entityMap = {
    escape: {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#x27;'
    }
  };
  entityMap.unescape = _.invert(entityMap.escape);

  // Regexes containing the keys and values listed immediately above.
  var entityRegexes = {
    escape:   new RegExp('[' + _.keys(entityMap.escape).join('') + ']', 'g'),
    unescape: new RegExp('(' + _.keys(entityMap.unescape).join('|') + ')', 'g')
  };

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  _.each(['escape', 'unescape'], function(method) {
    _[method] = function(string) {
      if (string == null) return '';
      return ('' + string).replace(entityRegexes[method], function(match) {
        return entityMap[method][match];
      });
    };
  });

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? value.call(object) : value;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\t':     't',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\t|\u2028|\u2029/g;

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  _.template = function(text, data, settings) {
    var render;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = new RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset)
        .replace(escaper, function(match) { return '\\' + escapes[match]; });

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      }
      if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      }
      if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }
      index = offset + match.length;
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + "return __p;\n";

    try {
      render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    if (data) return render(data, _);
    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled function source as a convenience for precompilation.
    template.source = 'function(' + (settings.variable || 'obj') + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function, which will delegate to the wrapper.
  _.chain = function(obj) {
    return _(obj).chain();
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name == 'shift' || name == 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  _.extend(_.prototype, {

    // Start chaining a wrapped Underscore object.
    chain: function() {
      this._chain = true;
      return this;
    },

    // Extracts the result from a wrapped and chained object.
    value: function() {
      return this._wrapped;
    }

  });

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}).call(this);

},{}],7:[function(require,module,exports){
//     Backbone.js 1.1.2

//     (c) 2010-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Backbone may be freely distributed under the MIT license.
//     For all details and documentation:
//     http://backbonejs.org

(function(root, factory) {

  // Set up Backbone appropriately for the environment. Start with AMD.
  if (typeof define === 'function' && define.amd) {
    define(['underscore', 'jquery', 'exports'], function(_, $, exports) {
      // Export global even in AMD case in case this script is loaded with
      // others that may still expect a global Backbone.
      root.Backbone = factory(root, exports, _, $);
    });

  // Next for Node.js or CommonJS. jQuery may not be needed as a module.
  } else if (typeof exports !== 'undefined') {
    var _ = require('underscore');
    factory(root, exports, _);

  // Finally, as a browser global.
  } else {
    root.Backbone = factory(root, {}, root._, (root.jQuery || root.Zepto || root.ender || root.$));
  }

}(this, function(root, Backbone, _, $) {

  // Initial Setup
  // -------------

  // Save the previous value of the `Backbone` variable, so that it can be
  // restored later on, if `noConflict` is used.
  var previousBackbone = root.Backbone;

  // Create local references to array methods we'll want to use later.
  var array = [];
  var push = array.push;
  var slice = array.slice;
  var splice = array.splice;

  // Current version of the library. Keep in sync with `package.json`.
  Backbone.VERSION = '1.1.2';

  // For Backbone's purposes, jQuery, Zepto, Ender, or My Library (kidding) owns
  // the `$` variable.
  Backbone.$ = $;

  // Runs Backbone.js in *noConflict* mode, returning the `Backbone` variable
  // to its previous owner. Returns a reference to this Backbone object.
  Backbone.noConflict = function() {
    root.Backbone = previousBackbone;
    return this;
  };

  // Turn on `emulateHTTP` to support legacy HTTP servers. Setting this option
  // will fake `"PATCH"`, `"PUT"` and `"DELETE"` requests via the `_method` parameter and
  // set a `X-Http-Method-Override` header.
  Backbone.emulateHTTP = false;

  // Turn on `emulateJSON` to support legacy servers that can't deal with direct
  // `application/json` requests ... will encode the body as
  // `application/x-www-form-urlencoded` instead and will send the model in a
  // form param named `model`.
  Backbone.emulateJSON = false;

  // Backbone.Events
  // ---------------

  // A module that can be mixed in to *any object* in order to provide it with
  // custom events. You may bind with `on` or remove with `off` callback
  // functions to an event; `trigger`-ing an event fires all callbacks in
  // succession.
  //
  //     var object = {};
  //     _.extend(object, Backbone.Events);
  //     object.on('expand', function(){ alert('expanded'); });
  //     object.trigger('expand');
  //
  var Events = Backbone.Events = {

    // Bind an event to a `callback` function. Passing `"all"` will bind
    // the callback to all events fired.
    on: function(name, callback, context) {
      if (!eventsApi(this, 'on', name, [callback, context]) || !callback) return this;
      this._events || (this._events = {});
      var events = this._events[name] || (this._events[name] = []);
      events.push({callback: callback, context: context, ctx: context || this});
      return this;
    },

    // Bind an event to only be triggered a single time. After the first time
    // the callback is invoked, it will be removed.
    once: function(name, callback, context) {
      if (!eventsApi(this, 'once', name, [callback, context]) || !callback) return this;
      var self = this;
      var once = _.once(function() {
        self.off(name, once);
        callback.apply(this, arguments);
      });
      once._callback = callback;
      return this.on(name, once, context);
    },

    // Remove one or many callbacks. If `context` is null, removes all
    // callbacks with that function. If `callback` is null, removes all
    // callbacks for the event. If `name` is null, removes all bound
    // callbacks for all events.
    off: function(name, callback, context) {
      var retain, ev, events, names, i, l, j, k;
      if (!this._events || !eventsApi(this, 'off', name, [callback, context])) return this;
      if (!name && !callback && !context) {
        this._events = void 0;
        return this;
      }
      names = name ? [name] : _.keys(this._events);
      for (i = 0, l = names.length; i < l; i++) {
        name = names[i];
        if (events = this._events[name]) {
          this._events[name] = retain = [];
          if (callback || context) {
            for (j = 0, k = events.length; j < k; j++) {
              ev = events[j];
              if ((callback && callback !== ev.callback && callback !== ev.callback._callback) ||
                  (context && context !== ev.context)) {
                retain.push(ev);
              }
            }
          }
          if (!retain.length) delete this._events[name];
        }
      }

      return this;
    },

    // Trigger one or many events, firing all bound callbacks. Callbacks are
    // passed the same arguments as `trigger` is, apart from the event name
    // (unless you're listening on `"all"`, which will cause your callback to
    // receive the true name of the event as the first argument).
    trigger: function(name) {
      if (!this._events) return this;
      var args = slice.call(arguments, 1);
      if (!eventsApi(this, 'trigger', name, args)) return this;
      var events = this._events[name];
      var allEvents = this._events.all;
      if (events) triggerEvents(events, args);
      if (allEvents) triggerEvents(allEvents, arguments);
      return this;
    },

    // Tell this object to stop listening to either specific events ... or
    // to every object it's currently listening to.
    stopListening: function(obj, name, callback) {
      var listeningTo = this._listeningTo;
      if (!listeningTo) return this;
      var remove = !name && !callback;
      if (!callback && typeof name === 'object') callback = this;
      if (obj) (listeningTo = {})[obj._listenId] = obj;
      for (var id in listeningTo) {
        obj = listeningTo[id];
        obj.off(name, callback, this);
        if (remove || _.isEmpty(obj._events)) delete this._listeningTo[id];
      }
      return this;
    }

  };

  // Regular expression used to split event strings.
  var eventSplitter = /\s+/;

  // Implement fancy features of the Events API such as multiple event
  // names `"change blur"` and jQuery-style event maps `{change: action}`
  // in terms of the existing API.
  var eventsApi = function(obj, action, name, rest) {
    if (!name) return true;

    // Handle event maps.
    if (typeof name === 'object') {
      for (var key in name) {
        obj[action].apply(obj, [key, name[key]].concat(rest));
      }
      return false;
    }

    // Handle space separated event names.
    if (eventSplitter.test(name)) {
      var names = name.split(eventSplitter);
      for (var i = 0, l = names.length; i < l; i++) {
        obj[action].apply(obj, [names[i]].concat(rest));
      }
      return false;
    }

    return true;
  };

  // A difficult-to-believe, but optimized internal dispatch function for
  // triggering events. Tries to keep the usual cases speedy (most internal
  // Backbone events have 3 arguments).
  var triggerEvents = function(events, args) {
    var ev, i = -1, l = events.length, a1 = args[0], a2 = args[1], a3 = args[2];
    switch (args.length) {
      case 0: while (++i < l) (ev = events[i]).callback.call(ev.ctx); return;
      case 1: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1); return;
      case 2: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2); return;
      case 3: while (++i < l) (ev = events[i]).callback.call(ev.ctx, a1, a2, a3); return;
      default: while (++i < l) (ev = events[i]).callback.apply(ev.ctx, args); return;
    }
  };

  var listenMethods = {listenTo: 'on', listenToOnce: 'once'};

  // Inversion-of-control versions of `on` and `once`. Tell *this* object to
  // listen to an event in another object ... keeping track of what it's
  // listening to.
  _.each(listenMethods, function(implementation, method) {
    Events[method] = function(obj, name, callback) {
      var listeningTo = this._listeningTo || (this._listeningTo = {});
      var id = obj._listenId || (obj._listenId = _.uniqueId('l'));
      listeningTo[id] = obj;
      if (!callback && typeof name === 'object') callback = this;
      obj[implementation](name, callback, this);
      return this;
    };
  });

  // Aliases for backwards compatibility.
  Events.bind   = Events.on;
  Events.unbind = Events.off;

  // Allow the `Backbone` object to serve as a global event bus, for folks who
  // want global "pubsub" in a convenient place.
  _.extend(Backbone, Events);

  // Backbone.Model
  // --------------

  // Backbone **Models** are the basic data object in the framework --
  // frequently representing a row in a table in a database on your server.
  // A discrete chunk of data and a bunch of useful, related methods for
  // performing computations and transformations on that data.

  // Create a new model with the specified attributes. A client id (`cid`)
  // is automatically generated and assigned for you.
  var Model = Backbone.Model = function(attributes, options) {
    var attrs = attributes || {};
    options || (options = {});
    this.cid = _.uniqueId('c');
    this.attributes = {};
    if (options.collection) this.collection = options.collection;
    if (options.parse) attrs = this.parse(attrs, options) || {};
    attrs = _.defaults({}, attrs, _.result(this, 'defaults'));
    this.set(attrs, options);
    this.changed = {};
    this.initialize.apply(this, arguments);
  };

  // Attach all inheritable methods to the Model prototype.
  _.extend(Model.prototype, Events, {

    // A hash of attributes whose current and previous value differ.
    changed: null,

    // The value returned during the last failed validation.
    validationError: null,

    // The default name for the JSON `id` attribute is `"id"`. MongoDB and
    // CouchDB users may want to set this to `"_id"`.
    idAttribute: 'id',

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Return a copy of the model's `attributes` object.
    toJSON: function(options) {
      return _.clone(this.attributes);
    },

    // Proxy `Backbone.sync` by default -- but override this if you need
    // custom syncing semantics for *this* particular model.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Get the value of an attribute.
    get: function(attr) {
      return this.attributes[attr];
    },

    // Get the HTML-escaped value of an attribute.
    escape: function(attr) {
      return _.escape(this.get(attr));
    },

    // Returns `true` if the attribute contains a value that is not null
    // or undefined.
    has: function(attr) {
      return this.get(attr) != null;
    },

    // Set a hash of model attributes on the object, firing `"change"`. This is
    // the core primitive operation of a model, updating the data and notifying
    // anyone who needs to know about the change in state. The heart of the beast.
    set: function(key, val, options) {
      var attr, attrs, unset, changes, silent, changing, prev, current;
      if (key == null) return this;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options || (options = {});

      // Run validation.
      if (!this._validate(attrs, options)) return false;

      // Extract attributes and options.
      unset           = options.unset;
      silent          = options.silent;
      changes         = [];
      changing        = this._changing;
      this._changing  = true;

      if (!changing) {
        this._previousAttributes = _.clone(this.attributes);
        this.changed = {};
      }
      current = this.attributes, prev = this._previousAttributes;

      // Check for changes of `id`.
      if (this.idAttribute in attrs) this.id = attrs[this.idAttribute];

      // For each `set` attribute, update or delete the current value.
      for (attr in attrs) {
        val = attrs[attr];
        if (!_.isEqual(current[attr], val)) changes.push(attr);
        if (!_.isEqual(prev[attr], val)) {
          this.changed[attr] = val;
        } else {
          delete this.changed[attr];
        }
        unset ? delete current[attr] : current[attr] = val;
      }

      // Trigger all relevant attribute changes.
      if (!silent) {
        if (changes.length) this._pending = options;
        for (var i = 0, l = changes.length; i < l; i++) {
          this.trigger('change:' + changes[i], this, current[changes[i]], options);
        }
      }

      // You might be wondering why there's a `while` loop here. Changes can
      // be recursively nested within `"change"` events.
      if (changing) return this;
      if (!silent) {
        while (this._pending) {
          options = this._pending;
          this._pending = false;
          this.trigger('change', this, options);
        }
      }
      this._pending = false;
      this._changing = false;
      return this;
    },

    // Remove an attribute from the model, firing `"change"`. `unset` is a noop
    // if the attribute doesn't exist.
    unset: function(attr, options) {
      return this.set(attr, void 0, _.extend({}, options, {unset: true}));
    },

    // Clear all attributes on the model, firing `"change"`.
    clear: function(options) {
      var attrs = {};
      for (var key in this.attributes) attrs[key] = void 0;
      return this.set(attrs, _.extend({}, options, {unset: true}));
    },

    // Determine if the model has changed since the last `"change"` event.
    // If you specify an attribute name, determine if that attribute has changed.
    hasChanged: function(attr) {
      if (attr == null) return !_.isEmpty(this.changed);
      return _.has(this.changed, attr);
    },

    // Return an object containing all the attributes that have changed, or
    // false if there are no changed attributes. Useful for determining what
    // parts of a view need to be updated and/or what attributes need to be
    // persisted to the server. Unset attributes will be set to undefined.
    // You can also pass an attributes object to diff against the model,
    // determining if there *would be* a change.
    changedAttributes: function(diff) {
      if (!diff) return this.hasChanged() ? _.clone(this.changed) : false;
      var val, changed = false;
      var old = this._changing ? this._previousAttributes : this.attributes;
      for (var attr in diff) {
        if (_.isEqual(old[attr], (val = diff[attr]))) continue;
        (changed || (changed = {}))[attr] = val;
      }
      return changed;
    },

    // Get the previous value of an attribute, recorded at the time the last
    // `"change"` event was fired.
    previous: function(attr) {
      if (attr == null || !this._previousAttributes) return null;
      return this._previousAttributes[attr];
    },

    // Get all of the attributes of the model at the time of the previous
    // `"change"` event.
    previousAttributes: function() {
      return _.clone(this._previousAttributes);
    },

    // Fetch the model from the server. If the server's representation of the
    // model differs from its current attributes, they will be overridden,
    // triggering a `"change"` event.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        if (!model.set(model.parse(resp, options), options)) return false;
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Set a hash of model attributes, and sync the model to the server.
    // If the server returns an attributes hash that differs, the model's
    // state will be `set` again.
    save: function(key, val, options) {
      var attrs, method, xhr, attributes = this.attributes;

      // Handle both `"key", value` and `{key: value}` -style arguments.
      if (key == null || typeof key === 'object') {
        attrs = key;
        options = val;
      } else {
        (attrs = {})[key] = val;
      }

      options = _.extend({validate: true}, options);

      // If we're not waiting and attributes exist, save acts as
      // `set(attr).save(null, opts)` with validation. Otherwise, check if
      // the model will be valid when the attributes, if any, are set.
      if (attrs && !options.wait) {
        if (!this.set(attrs, options)) return false;
      } else {
        if (!this._validate(attrs, options)) return false;
      }

      // Set temporary attributes if `{wait: true}`.
      if (attrs && options.wait) {
        this.attributes = _.extend({}, attributes, attrs);
      }

      // After a successful server-side save, the client is (optionally)
      // updated with the server-side state.
      if (options.parse === void 0) options.parse = true;
      var model = this;
      var success = options.success;
      options.success = function(resp) {
        // Ensure attributes are restored during synchronous saves.
        model.attributes = attributes;
        var serverAttrs = model.parse(resp, options);
        if (options.wait) serverAttrs = _.extend(attrs || {}, serverAttrs);
        if (_.isObject(serverAttrs) && !model.set(serverAttrs, options)) {
          return false;
        }
        if (success) success(model, resp, options);
        model.trigger('sync', model, resp, options);
      };
      wrapError(this, options);

      method = this.isNew() ? 'create' : (options.patch ? 'patch' : 'update');
      if (method === 'patch') options.attrs = attrs;
      xhr = this.sync(method, this, options);

      // Restore attributes.
      if (attrs && options.wait) this.attributes = attributes;

      return xhr;
    },

    // Destroy this model on the server if it was already persisted.
    // Optimistically removes the model from its collection, if it has one.
    // If `wait: true` is passed, waits for the server to respond before removal.
    destroy: function(options) {
      options = options ? _.clone(options) : {};
      var model = this;
      var success = options.success;

      var destroy = function() {
        model.trigger('destroy', model, model.collection, options);
      };

      options.success = function(resp) {
        if (options.wait || model.isNew()) destroy();
        if (success) success(model, resp, options);
        if (!model.isNew()) model.trigger('sync', model, resp, options);
      };

      if (this.isNew()) {
        options.success();
        return false;
      }
      wrapError(this, options);

      var xhr = this.sync('delete', this, options);
      if (!options.wait) destroy();
      return xhr;
    },

    // Default URL for the model's representation on the server -- if you're
    // using Backbone's restful methods, override this to change the endpoint
    // that will be called.
    url: function() {
      var base =
        _.result(this, 'urlRoot') ||
        _.result(this.collection, 'url') ||
        urlError();
      if (this.isNew()) return base;
      return base.replace(/([^\/])$/, '$1/') + encodeURIComponent(this.id);
    },

    // **parse** converts a response into the hash of attributes to be `set` on
    // the model. The default implementation is just to pass the response along.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new model with identical attributes to this one.
    clone: function() {
      return new this.constructor(this.attributes);
    },

    // A model is new if it has never been saved to the server, and lacks an id.
    isNew: function() {
      return !this.has(this.idAttribute);
    },

    // Check if the model is currently in a valid state.
    isValid: function(options) {
      return this._validate({}, _.extend(options || {}, { validate: true }));
    },

    // Run validation against the next complete set of model attributes,
    // returning `true` if all is well. Otherwise, fire an `"invalid"` event.
    _validate: function(attrs, options) {
      if (!options.validate || !this.validate) return true;
      attrs = _.extend({}, this.attributes, attrs);
      var error = this.validationError = this.validate(attrs, options) || null;
      if (!error) return true;
      this.trigger('invalid', this, error, _.extend(options, {validationError: error}));
      return false;
    }

  });

  // Underscore methods that we want to implement on the Model.
  var modelMethods = ['keys', 'values', 'pairs', 'invert', 'pick', 'omit'];

  // Mix in each Underscore method as a proxy to `Model#attributes`.
  _.each(modelMethods, function(method) {
    Model.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.attributes);
      return _[method].apply(_, args);
    };
  });

  // Backbone.Collection
  // -------------------

  // If models tend to represent a single row of data, a Backbone Collection is
  // more analagous to a table full of data ... or a small slice or page of that
  // table, or a collection of rows that belong together for a particular reason
  // -- all of the messages in this particular folder, all of the documents
  // belonging to this particular author, and so on. Collections maintain
  // indexes of their models, both in order, and for lookup by `id`.

  // Create a new **Collection**, perhaps to contain a specific type of `model`.
  // If a `comparator` is specified, the Collection will maintain
  // its models in sort order, as they're added and removed.
  var Collection = Backbone.Collection = function(models, options) {
    options || (options = {});
    if (options.model) this.model = options.model;
    if (options.comparator !== void 0) this.comparator = options.comparator;
    this._reset();
    this.initialize.apply(this, arguments);
    if (models) this.reset(models, _.extend({silent: true}, options));
  };

  // Default options for `Collection#set`.
  var setOptions = {add: true, remove: true, merge: true};
  var addOptions = {add: true, remove: false};

  // Define the Collection's inheritable methods.
  _.extend(Collection.prototype, Events, {

    // The default model for a collection is just a **Backbone.Model**.
    // This should be overridden in most cases.
    model: Model,

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // The JSON representation of a Collection is an array of the
    // models' attributes.
    toJSON: function(options) {
      return this.map(function(model){ return model.toJSON(options); });
    },

    // Proxy `Backbone.sync` by default.
    sync: function() {
      return Backbone.sync.apply(this, arguments);
    },

    // Add a model, or list of models to the set.
    add: function(models, options) {
      return this.set(models, _.extend({merge: false}, options, addOptions));
    },

    // Remove a model, or a list of models from the set.
    remove: function(models, options) {
      var singular = !_.isArray(models);
      models = singular ? [models] : _.clone(models);
      options || (options = {});
      var i, l, index, model;
      for (i = 0, l = models.length; i < l; i++) {
        model = models[i] = this.get(models[i]);
        if (!model) continue;
        delete this._byId[model.id];
        delete this._byId[model.cid];
        index = this.indexOf(model);
        this.models.splice(index, 1);
        this.length--;
        if (!options.silent) {
          options.index = index;
          model.trigger('remove', model, this, options);
        }
        this._removeReference(model, options);
      }
      return singular ? models[0] : models;
    },

    // Update a collection by `set`-ing a new list of models, adding new ones,
    // removing models that are no longer present, and merging models that
    // already exist in the collection, as necessary. Similar to **Model#set**,
    // the core operation for updating the data contained by the collection.
    set: function(models, options) {
      options = _.defaults({}, options, setOptions);
      if (options.parse) models = this.parse(models, options);
      var singular = !_.isArray(models);
      models = singular ? (models ? [models] : []) : _.clone(models);
      var i, l, id, model, attrs, existing, sort;
      var at = options.at;
      var targetModel = this.model;
      var sortable = this.comparator && (at == null) && options.sort !== false;
      var sortAttr = _.isString(this.comparator) ? this.comparator : null;
      var toAdd = [], toRemove = [], modelMap = {};
      var add = options.add, merge = options.merge, remove = options.remove;
      var order = !sortable && add && remove ? [] : false;

      // Turn bare objects into model references, and prevent invalid models
      // from being added.
      for (i = 0, l = models.length; i < l; i++) {
        attrs = models[i] || {};
        if (attrs instanceof Model) {
          id = model = attrs;
        } else {
          id = attrs[targetModel.prototype.idAttribute || 'id'];
        }

        // If a duplicate is found, prevent it from being added and
        // optionally merge it into the existing model.
        if (existing = this.get(id)) {
          if (remove) modelMap[existing.cid] = true;
          if (merge) {
            attrs = attrs === model ? model.attributes : attrs;
            if (options.parse) attrs = existing.parse(attrs, options);
            existing.set(attrs, options);
            if (sortable && !sort && existing.hasChanged(sortAttr)) sort = true;
          }
          models[i] = existing;

        // If this is a new, valid model, push it to the `toAdd` list.
        } else if (add) {
          model = models[i] = this._prepareModel(attrs, options);
          if (!model) continue;
          toAdd.push(model);
          this._addReference(model, options);
        }

        // Do not add multiple models with the same `id`.
        model = existing || model;
        if (order && (model.isNew() || !modelMap[model.id])) order.push(model);
        modelMap[model.id] = true;
      }

      // Remove nonexistent models if appropriate.
      if (remove) {
        for (i = 0, l = this.length; i < l; ++i) {
          if (!modelMap[(model = this.models[i]).cid]) toRemove.push(model);
        }
        if (toRemove.length) this.remove(toRemove, options);
      }

      // See if sorting is needed, update `length` and splice in new models.
      if (toAdd.length || (order && order.length)) {
        if (sortable) sort = true;
        this.length += toAdd.length;
        if (at != null) {
          for (i = 0, l = toAdd.length; i < l; i++) {
            this.models.splice(at + i, 0, toAdd[i]);
          }
        } else {
          if (order) this.models.length = 0;
          var orderedModels = order || toAdd;
          for (i = 0, l = orderedModels.length; i < l; i++) {
            this.models.push(orderedModels[i]);
          }
        }
      }

      // Silently sort the collection if appropriate.
      if (sort) this.sort({silent: true});

      // Unless silenced, it's time to fire all appropriate add/sort events.
      if (!options.silent) {
        for (i = 0, l = toAdd.length; i < l; i++) {
          (model = toAdd[i]).trigger('add', model, this, options);
        }
        if (sort || (order && order.length)) this.trigger('sort', this, options);
      }

      // Return the added (or merged) model (or models).
      return singular ? models[0] : models;
    },

    // When you have more items than you want to add or remove individually,
    // you can reset the entire set with a new list of models, without firing
    // any granular `add` or `remove` events. Fires `reset` when finished.
    // Useful for bulk operations and optimizations.
    reset: function(models, options) {
      options || (options = {});
      for (var i = 0, l = this.models.length; i < l; i++) {
        this._removeReference(this.models[i], options);
      }
      options.previousModels = this.models;
      this._reset();
      models = this.add(models, _.extend({silent: true}, options));
      if (!options.silent) this.trigger('reset', this, options);
      return models;
    },

    // Add a model to the end of the collection.
    push: function(model, options) {
      return this.add(model, _.extend({at: this.length}, options));
    },

    // Remove a model from the end of the collection.
    pop: function(options) {
      var model = this.at(this.length - 1);
      this.remove(model, options);
      return model;
    },

    // Add a model to the beginning of the collection.
    unshift: function(model, options) {
      return this.add(model, _.extend({at: 0}, options));
    },

    // Remove a model from the beginning of the collection.
    shift: function(options) {
      var model = this.at(0);
      this.remove(model, options);
      return model;
    },

    // Slice out a sub-array of models from the collection.
    slice: function() {
      return slice.apply(this.models, arguments);
    },

    // Get a model from the set by id.
    get: function(obj) {
      if (obj == null) return void 0;
      return this._byId[obj] || this._byId[obj.id] || this._byId[obj.cid];
    },

    // Get the model at the given index.
    at: function(index) {
      return this.models[index];
    },

    // Return models with matching attributes. Useful for simple cases of
    // `filter`.
    where: function(attrs, first) {
      if (_.isEmpty(attrs)) return first ? void 0 : [];
      return this[first ? 'find' : 'filter'](function(model) {
        for (var key in attrs) {
          if (attrs[key] !== model.get(key)) return false;
        }
        return true;
      });
    },

    // Return the first model with matching attributes. Useful for simple cases
    // of `find`.
    findWhere: function(attrs) {
      return this.where(attrs, true);
    },

    // Force the collection to re-sort itself. You don't need to call this under
    // normal circumstances, as the set will maintain sort order as each item
    // is added.
    sort: function(options) {
      if (!this.comparator) throw new Error('Cannot sort a set without a comparator');
      options || (options = {});

      // Run sort based on type of `comparator`.
      if (_.isString(this.comparator) || this.comparator.length === 1) {
        this.models = this.sortBy(this.comparator, this);
      } else {
        this.models.sort(_.bind(this.comparator, this));
      }

      if (!options.silent) this.trigger('sort', this, options);
      return this;
    },

    // Pluck an attribute from each model in the collection.
    pluck: function(attr) {
      return _.invoke(this.models, 'get', attr);
    },

    // Fetch the default set of models for this collection, resetting the
    // collection when they arrive. If `reset: true` is passed, the response
    // data will be passed through the `reset` method instead of `set`.
    fetch: function(options) {
      options = options ? _.clone(options) : {};
      if (options.parse === void 0) options.parse = true;
      var success = options.success;
      var collection = this;
      options.success = function(resp) {
        var method = options.reset ? 'reset' : 'set';
        collection[method](resp, options);
        if (success) success(collection, resp, options);
        collection.trigger('sync', collection, resp, options);
      };
      wrapError(this, options);
      return this.sync('read', this, options);
    },

    // Create a new instance of a model in this collection. Add the model to the
    // collection immediately, unless `wait: true` is passed, in which case we
    // wait for the server to agree.
    create: function(model, options) {
      options = options ? _.clone(options) : {};
      if (!(model = this._prepareModel(model, options))) return false;
      if (!options.wait) this.add(model, options);
      var collection = this;
      var success = options.success;
      options.success = function(model, resp) {
        if (options.wait) collection.add(model, options);
        if (success) success(model, resp, options);
      };
      model.save(null, options);
      return model;
    },

    // **parse** converts a response into a list of models to be added to the
    // collection. The default implementation is just to pass it through.
    parse: function(resp, options) {
      return resp;
    },

    // Create a new collection with an identical list of models as this one.
    clone: function() {
      return new this.constructor(this.models);
    },

    // Private method to reset all internal state. Called when the collection
    // is first initialized or reset.
    _reset: function() {
      this.length = 0;
      this.models = [];
      this._byId  = {};
    },

    // Prepare a hash of attributes (or other model) to be added to this
    // collection.
    _prepareModel: function(attrs, options) {
      if (attrs instanceof Model) return attrs;
      options = options ? _.clone(options) : {};
      options.collection = this;
      var model = new this.model(attrs, options);
      if (!model.validationError) return model;
      this.trigger('invalid', this, model.validationError, options);
      return false;
    },

    // Internal method to create a model's ties to a collection.
    _addReference: function(model, options) {
      this._byId[model.cid] = model;
      if (model.id != null) this._byId[model.id] = model;
      if (!model.collection) model.collection = this;
      model.on('all', this._onModelEvent, this);
    },

    // Internal method to sever a model's ties to a collection.
    _removeReference: function(model, options) {
      if (this === model.collection) delete model.collection;
      model.off('all', this._onModelEvent, this);
    },

    // Internal method called every time a model in the set fires an event.
    // Sets need to update their indexes when models change ids. All other
    // events simply proxy through. "add" and "remove" events that originate
    // in other collections are ignored.
    _onModelEvent: function(event, model, collection, options) {
      if ((event === 'add' || event === 'remove') && collection !== this) return;
      if (event === 'destroy') this.remove(model, options);
      if (model && event === 'change:' + model.idAttribute) {
        delete this._byId[model.previous(model.idAttribute)];
        if (model.id != null) this._byId[model.id] = model;
      }
      this.trigger.apply(this, arguments);
    }

  });

  // Underscore methods that we want to implement on the Collection.
  // 90% of the core usefulness of Backbone Collections is actually implemented
  // right here:
  var methods = ['forEach', 'each', 'map', 'collect', 'reduce', 'foldl',
    'inject', 'reduceRight', 'foldr', 'find', 'detect', 'filter', 'select',
    'reject', 'every', 'all', 'some', 'any', 'include', 'contains', 'invoke',
    'max', 'min', 'toArray', 'size', 'first', 'head', 'take', 'initial', 'rest',
    'tail', 'drop', 'last', 'without', 'difference', 'indexOf', 'shuffle',
    'lastIndexOf', 'isEmpty', 'chain', 'sample'];

  // Mix in each Underscore method as a proxy to `Collection#models`.
  _.each(methods, function(method) {
    Collection.prototype[method] = function() {
      var args = slice.call(arguments);
      args.unshift(this.models);
      return _[method].apply(_, args);
    };
  });

  // Underscore methods that take a property name as an argument.
  var attributeMethods = ['groupBy', 'countBy', 'sortBy', 'indexBy'];

  // Use attributes instead of properties.
  _.each(attributeMethods, function(method) {
    Collection.prototype[method] = function(value, context) {
      var iterator = _.isFunction(value) ? value : function(model) {
        return model.get(value);
      };
      return _[method](this.models, iterator, context);
    };
  });

  // Backbone.View
  // -------------

  // Backbone Views are almost more convention than they are actual code. A View
  // is simply a JavaScript object that represents a logical chunk of UI in the
  // DOM. This might be a single item, an entire list, a sidebar or panel, or
  // even the surrounding frame which wraps your whole app. Defining a chunk of
  // UI as a **View** allows you to define your DOM events declaratively, without
  // having to worry about render order ... and makes it easy for the view to
  // react to specific changes in the state of your models.

  // Creating a Backbone.View creates its initial element outside of the DOM,
  // if an existing element is not provided...
  var View = Backbone.View = function(options) {
    this.cid = _.uniqueId('view');
    options || (options = {});
    _.extend(this, _.pick(options, viewOptions));
    this._ensureElement();
    this.initialize.apply(this, arguments);
    this.delegateEvents();
  };

  // Cached regex to split keys for `delegate`.
  var delegateEventSplitter = /^(\S+)\s*(.*)$/;

  // List of view options to be merged as properties.
  var viewOptions = ['model', 'collection', 'el', 'id', 'attributes', 'className', 'tagName', 'events'];

  // Set up all inheritable **Backbone.View** properties and methods.
  _.extend(View.prototype, Events, {

    // The default `tagName` of a View's element is `"div"`.
    tagName: 'div',

    // jQuery delegate for element lookup, scoped to DOM elements within the
    // current view. This should be preferred to global lookups where possible.
    $: function(selector) {
      return this.$el.find(selector);
    },

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // **render** is the core function that your view should override, in order
    // to populate its element (`this.el`), with the appropriate HTML. The
    // convention is for **render** to always return `this`.
    render: function() {
      return this;
    },

    // Remove this view by taking the element out of the DOM, and removing any
    // applicable Backbone.Events listeners.
    remove: function() {
      this.$el.remove();
      this.stopListening();
      return this;
    },

    // Change the view's element (`this.el` property), including event
    // re-delegation.
    setElement: function(element, delegate) {
      if (this.$el) this.undelegateEvents();
      this.$el = element instanceof Backbone.$ ? element : Backbone.$(element);
      this.el = this.$el[0];
      if (delegate !== false) this.delegateEvents();
      return this;
    },

    // Set callbacks, where `this.events` is a hash of
    //
    // *{"event selector": "callback"}*
    //
    //     {
    //       'mousedown .title':  'edit',
    //       'click .button':     'save',
    //       'click .open':       function(e) { ... }
    //     }
    //
    // pairs. Callbacks will be bound to the view, with `this` set properly.
    // Uses event delegation for efficiency.
    // Omitting the selector binds the event to `this.el`.
    // This only works for delegate-able events: not `focus`, `blur`, and
    // not `change`, `submit`, and `reset` in Internet Explorer.
    delegateEvents: function(events) {
      if (!(events || (events = _.result(this, 'events')))) return this;
      this.undelegateEvents();
      for (var key in events) {
        var method = events[key];
        if (!_.isFunction(method)) method = this[events[key]];
        if (!method) continue;

        var match = key.match(delegateEventSplitter);
        var eventName = match[1], selector = match[2];
        method = _.bind(method, this);
        eventName += '.delegateEvents' + this.cid;
        if (selector === '') {
          this.$el.on(eventName, method);
        } else {
          this.$el.on(eventName, selector, method);
        }
      }
      return this;
    },

    // Clears all callbacks previously bound to the view with `delegateEvents`.
    // You usually don't need to use this, but may wish to if you have multiple
    // Backbone views attached to the same DOM element.
    undelegateEvents: function() {
      this.$el.off('.delegateEvents' + this.cid);
      return this;
    },

    // Ensure that the View has a DOM element to render into.
    // If `this.el` is a string, pass it through `$()`, take the first
    // matching element, and re-assign it to `el`. Otherwise, create
    // an element from the `id`, `className` and `tagName` properties.
    _ensureElement: function() {
      if (!this.el) {
        var attrs = _.extend({}, _.result(this, 'attributes'));
        if (this.id) attrs.id = _.result(this, 'id');
        if (this.className) attrs['class'] = _.result(this, 'className');
        var $el = Backbone.$('<' + _.result(this, 'tagName') + '>').attr(attrs);
        this.setElement($el, false);
      } else {
        this.setElement(_.result(this, 'el'), false);
      }
    }

  });

  // Backbone.sync
  // -------------

  // Override this function to change the manner in which Backbone persists
  // models to the server. You will be passed the type of request, and the
  // model in question. By default, makes a RESTful Ajax request
  // to the model's `url()`. Some possible customizations could be:
  //
  // * Use `setTimeout` to batch rapid-fire updates into a single request.
  // * Send up the models as XML instead of JSON.
  // * Persist models via WebSockets instead of Ajax.
  //
  // Turn on `Backbone.emulateHTTP` in order to send `PUT` and `DELETE` requests
  // as `POST`, with a `_method` parameter containing the true HTTP method,
  // as well as all requests with the body as `application/x-www-form-urlencoded`
  // instead of `application/json` with the model in a param named `model`.
  // Useful when interfacing with server-side languages like **PHP** that make
  // it difficult to read the body of `PUT` requests.
  Backbone.sync = function(method, model, options) {
    var type = methodMap[method];

    // Default options, unless specified.
    _.defaults(options || (options = {}), {
      emulateHTTP: Backbone.emulateHTTP,
      emulateJSON: Backbone.emulateJSON
    });

    // Default JSON-request options.
    var params = {type: type, dataType: 'json'};

    // Ensure that we have a URL.
    if (!options.url) {
      params.url = _.result(model, 'url') || urlError();
    }

    // Ensure that we have the appropriate request data.
    if (options.data == null && model && (method === 'create' || method === 'update' || method === 'patch')) {
      params.contentType = 'application/json';
      params.data = JSON.stringify(options.attrs || model.toJSON(options));
    }

    // For older servers, emulate JSON by encoding the request into an HTML-form.
    if (options.emulateJSON) {
      params.contentType = 'application/x-www-form-urlencoded';
      params.data = params.data ? {model: params.data} : {};
    }

    // For older servers, emulate HTTP by mimicking the HTTP method with `_method`
    // And an `X-HTTP-Method-Override` header.
    if (options.emulateHTTP && (type === 'PUT' || type === 'DELETE' || type === 'PATCH')) {
      params.type = 'POST';
      if (options.emulateJSON) params.data._method = type;
      var beforeSend = options.beforeSend;
      options.beforeSend = function(xhr) {
        xhr.setRequestHeader('X-HTTP-Method-Override', type);
        if (beforeSend) return beforeSend.apply(this, arguments);
      };
    }

    // Don't process data on a non-GET request.
    if (params.type !== 'GET' && !options.emulateJSON) {
      params.processData = false;
    }

    // If we're sending a `PATCH` request, and we're in an old Internet Explorer
    // that still has ActiveX enabled by default, override jQuery to use that
    // for XHR instead. Remove this line when jQuery supports `PATCH` on IE8.
    if (params.type === 'PATCH' && noXhrPatch) {
      params.xhr = function() {
        return new ActiveXObject("Microsoft.XMLHTTP");
      };
    }

    // Make the request, allowing the user to override any Ajax options.
    var xhr = options.xhr = Backbone.ajax(_.extend(params, options));
    model.trigger('request', model, xhr, options);
    return xhr;
  };

  var noXhrPatch =
    typeof window !== 'undefined' && !!window.ActiveXObject &&
      !(window.XMLHttpRequest && (new XMLHttpRequest).dispatchEvent);

  // Map from CRUD to HTTP for our default `Backbone.sync` implementation.
  var methodMap = {
    'create': 'POST',
    'update': 'PUT',
    'patch':  'PATCH',
    'delete': 'DELETE',
    'read':   'GET'
  };

  // Set the default implementation of `Backbone.ajax` to proxy through to `$`.
  // Override this if you'd like to use a different library.
  Backbone.ajax = function() {
    return Backbone.$.ajax.apply(Backbone.$, arguments);
  };

  // Backbone.Router
  // ---------------

  // Routers map faux-URLs to actions, and fire events when routes are
  // matched. Creating a new one sets its `routes` hash, if not set statically.
  var Router = Backbone.Router = function(options) {
    options || (options = {});
    if (options.routes) this.routes = options.routes;
    this._bindRoutes();
    this.initialize.apply(this, arguments);
  };

  // Cached regular expressions for matching named param parts and splatted
  // parts of route strings.
  var optionalParam = /\((.*?)\)/g;
  var namedParam    = /(\(\?)?:\w+/g;
  var splatParam    = /\*\w+/g;
  var escapeRegExp  = /[\-{}\[\]+?.,\\\^$|#\s]/g;

  // Set up all inheritable **Backbone.Router** properties and methods.
  _.extend(Router.prototype, Events, {

    // Initialize is an empty function by default. Override it with your own
    // initialization logic.
    initialize: function(){},

    // Manually bind a single named route to a callback. For example:
    //
    //     this.route('search/:query/p:num', 'search', function(query, num) {
    //       ...
    //     });
    //
    route: function(route, name, callback) {
      if (!_.isRegExp(route)) route = this._routeToRegExp(route);
      if (_.isFunction(name)) {
        callback = name;
        name = '';
      }
      if (!callback) callback = this[name];
      var router = this;
      Backbone.history.route(route, function(fragment) {
        var args = router._extractParameters(route, fragment);
        router.execute(callback, args);
        router.trigger.apply(router, ['route:' + name].concat(args));
        router.trigger('route', name, args);
        Backbone.history.trigger('route', router, name, args);
      });
      return this;
    },

    // Execute a route handler with the provided parameters.  This is an
    // excellent place to do pre-route setup or post-route cleanup.
    execute: function(callback, args) {
      if (callback) callback.apply(this, args);
    },

    // Simple proxy to `Backbone.history` to save a fragment into the history.
    navigate: function(fragment, options) {
      Backbone.history.navigate(fragment, options);
      return this;
    },

    // Bind all defined routes to `Backbone.history`. We have to reverse the
    // order of the routes here to support behavior where the most general
    // routes can be defined at the bottom of the route map.
    _bindRoutes: function() {
      if (!this.routes) return;
      this.routes = _.result(this, 'routes');
      var route, routes = _.keys(this.routes);
      while ((route = routes.pop()) != null) {
        this.route(route, this.routes[route]);
      }
    },

    // Convert a route string into a regular expression, suitable for matching
    // against the current location hash.
    _routeToRegExp: function(route) {
      route = route.replace(escapeRegExp, '\\$&')
                   .replace(optionalParam, '(?:$1)?')
                   .replace(namedParam, function(match, optional) {
                     return optional ? match : '([^/?]+)';
                   })
                   .replace(splatParam, '([^?]*?)');
      return new RegExp('^' + route + '(?:\\?([\\s\\S]*))?$');
    },

    // Given a route, and a URL fragment that it matches, return the array of
    // extracted decoded parameters. Empty or unmatched parameters will be
    // treated as `null` to normalize cross-browser behavior.
    _extractParameters: function(route, fragment) {
      var params = route.exec(fragment).slice(1);
      return _.map(params, function(param, i) {
        // Don't decode the search params.
        if (i === params.length - 1) return param || null;
        return param ? decodeURIComponent(param) : null;
      });
    }

  });

  // Backbone.History
  // ----------------

  // Handles cross-browser history management, based on either
  // [pushState](http://diveintohtml5.info/history.html) and real URLs, or
  // [onhashchange](https://developer.mozilla.org/en-US/docs/DOM/window.onhashchange)
  // and URL fragments. If the browser supports neither (old IE, natch),
  // falls back to polling.
  var History = Backbone.History = function() {
    this.handlers = [];
    _.bindAll(this, 'checkUrl');

    // Ensure that `History` can be used outside of the browser.
    if (typeof window !== 'undefined') {
      this.location = window.location;
      this.history = window.history;
    }
  };

  // Cached regex for stripping a leading hash/slash and trailing space.
  var routeStripper = /^[#\/]|\s+$/g;

  // Cached regex for stripping leading and trailing slashes.
  var rootStripper = /^\/+|\/+$/g;

  // Cached regex for detecting MSIE.
  var isExplorer = /msie [\w.]+/;

  // Cached regex for removing a trailing slash.
  var trailingSlash = /\/$/;

  // Cached regex for stripping urls of hash.
  var pathStripper = /#.*$/;

  // Has the history handling already been started?
  History.started = false;

  // Set up all inheritable **Backbone.History** properties and methods.
  _.extend(History.prototype, Events, {

    // The default interval to poll for hash changes, if necessary, is
    // twenty times a second.
    interval: 50,

    // Are we at the app root?
    atRoot: function() {
      return this.location.pathname.replace(/[^\/]$/, '$&/') === this.root;
    },

    // Gets the true hash value. Cannot use location.hash directly due to bug
    // in Firefox where location.hash will always be decoded.
    getHash: function(window) {
      var match = (window || this).location.href.match(/#(.*)$/);
      return match ? match[1] : '';
    },

    // Get the cross-browser normalized URL fragment, either from the URL,
    // the hash, or the override.
    getFragment: function(fragment, forcePushState) {
      if (fragment == null) {
        if (this._hasPushState || !this._wantsHashChange || forcePushState) {
          fragment = decodeURI(this.location.pathname + this.location.search);
          var root = this.root.replace(trailingSlash, '');
          if (!fragment.indexOf(root)) fragment = fragment.slice(root.length);
        } else {
          fragment = this.getHash();
        }
      }
      return fragment.replace(routeStripper, '');
    },

    // Start the hash change handling, returning `true` if the current URL matches
    // an existing route, and `false` otherwise.
    start: function(options) {
      if (History.started) throw new Error("Backbone.history has already been started");
      History.started = true;

      // Figure out the initial configuration. Do we need an iframe?
      // Is pushState desired ... is it available?
      this.options          = _.extend({root: '/'}, this.options, options);
      this.root             = this.options.root;
      this._wantsHashChange = this.options.hashChange !== false;
      this._wantsPushState  = !!this.options.pushState;
      this._hasPushState    = !!(this.options.pushState && this.history && this.history.pushState);
      var fragment          = this.getFragment();
      var docMode           = document.documentMode;
      var oldIE             = (isExplorer.exec(navigator.userAgent.toLowerCase()) && (!docMode || docMode <= 7));

      // Normalize root to always include a leading and trailing slash.
      this.root = ('/' + this.root + '/').replace(rootStripper, '/');

      if (oldIE && this._wantsHashChange) {
        var frame = Backbone.$('<iframe src="javascript:0" tabindex="-1">');
        this.iframe = frame.hide().appendTo('body')[0].contentWindow;
        this.navigate(fragment);
      }

      // Depending on whether we're using pushState or hashes, and whether
      // 'onhashchange' is supported, determine how we check the URL state.
      if (this._hasPushState) {
        Backbone.$(window).on('popstate', this.checkUrl);
      } else if (this._wantsHashChange && ('onhashchange' in window) && !oldIE) {
        Backbone.$(window).on('hashchange', this.checkUrl);
      } else if (this._wantsHashChange) {
        this._checkUrlInterval = setInterval(this.checkUrl, this.interval);
      }

      // Determine if we need to change the base url, for a pushState link
      // opened by a non-pushState browser.
      this.fragment = fragment;
      var loc = this.location;

      // Transition from hashChange to pushState or vice versa if both are
      // requested.
      if (this._wantsHashChange && this._wantsPushState) {

        // If we've started off with a route from a `pushState`-enabled
        // browser, but we're currently in a browser that doesn't support it...
        if (!this._hasPushState && !this.atRoot()) {
          this.fragment = this.getFragment(null, true);
          this.location.replace(this.root + '#' + this.fragment);
          // Return immediately as browser will do redirect to new url
          return true;

        // Or if we've started out with a hash-based route, but we're currently
        // in a browser where it could be `pushState`-based instead...
        } else if (this._hasPushState && this.atRoot() && loc.hash) {
          this.fragment = this.getHash().replace(routeStripper, '');
          this.history.replaceState({}, document.title, this.root + this.fragment);
        }

      }

      if (!this.options.silent) return this.loadUrl();
    },

    // Disable Backbone.history, perhaps temporarily. Not useful in a real app,
    // but possibly useful for unit testing Routers.
    stop: function() {
      Backbone.$(window).off('popstate', this.checkUrl).off('hashchange', this.checkUrl);
      if (this._checkUrlInterval) clearInterval(this._checkUrlInterval);
      History.started = false;
    },

    // Add a route to be tested when the fragment changes. Routes added later
    // may override previous routes.
    route: function(route, callback) {
      this.handlers.unshift({route: route, callback: callback});
    },

    // Checks the current URL to see if it has changed, and if it has,
    // calls `loadUrl`, normalizing across the hidden iframe.
    checkUrl: function(e) {
      var current = this.getFragment();
      if (current === this.fragment && this.iframe) {
        current = this.getFragment(this.getHash(this.iframe));
      }
      if (current === this.fragment) return false;
      if (this.iframe) this.navigate(current);
      this.loadUrl();
    },

    // Attempt to load the current URL fragment. If a route succeeds with a
    // match, returns `true`. If no defined routes matches the fragment,
    // returns `false`.
    loadUrl: function(fragment) {
      fragment = this.fragment = this.getFragment(fragment);
      return _.any(this.handlers, function(handler) {
        if (handler.route.test(fragment)) {
          handler.callback(fragment);
          return true;
        }
      });
    },

    // Save a fragment into the hash history, or replace the URL state if the
    // 'replace' option is passed. You are responsible for properly URL-encoding
    // the fragment in advance.
    //
    // The options object can contain `trigger: true` if you wish to have the
    // route callback be fired (not usually desirable), or `replace: true`, if
    // you wish to modify the current URL without adding an entry to the history.
    navigate: function(fragment, options) {
      if (!History.started) return false;
      if (!options || options === true) options = {trigger: !!options};

      var url = this.root + (fragment = this.getFragment(fragment || ''));

      // Strip the hash for matching.
      fragment = fragment.replace(pathStripper, '');

      if (this.fragment === fragment) return;
      this.fragment = fragment;

      // Don't include a trailing slash on the root.
      if (fragment === '' && url !== '/') url = url.slice(0, -1);

      // If pushState is available, we use it to set the fragment as a real URL.
      if (this._hasPushState) {
        this.history[options.replace ? 'replaceState' : 'pushState']({}, document.title, url);

      // If hash changes haven't been explicitly disabled, update the hash
      // fragment to store history.
      } else if (this._wantsHashChange) {
        this._updateHash(this.location, fragment, options.replace);
        if (this.iframe && (fragment !== this.getFragment(this.getHash(this.iframe)))) {
          // Opening and closing the iframe tricks IE7 and earlier to push a
          // history entry on hash-tag change.  When replace is true, we don't
          // want this.
          if(!options.replace) this.iframe.document.open().close();
          this._updateHash(this.iframe.location, fragment, options.replace);
        }

      // If you've told us that you explicitly don't want fallback hashchange-
      // based history, then `navigate` becomes a page refresh.
      } else {
        return this.location.assign(url);
      }
      if (options.trigger) return this.loadUrl(fragment);
    },

    // Update the hash location, either replacing the current entry, or adding
    // a new one to the browser history.
    _updateHash: function(location, fragment, replace) {
      if (replace) {
        var href = location.href.replace(/(javascript:|#).*$/, '');
        location.replace(href + '#' + fragment);
      } else {
        // Some browsers require that `hash` contains a leading #.
        location.hash = '#' + fragment;
      }
    }

  });

  // Create the default Backbone.history.
  Backbone.history = new History;

  // Helpers
  // -------

  // Helper function to correctly set up the prototype chain, for subclasses.
  // Similar to `goog.inherits`, but uses a hash of prototype properties and
  // class properties to be extended.
  var extend = function(protoProps, staticProps) {
    var parent = this;
    var child;

    // The constructor function for the new subclass is either defined by you
    // (the "constructor" property in your `extend` definition), or defaulted
    // by us to simply call the parent's constructor.
    if (protoProps && _.has(protoProps, 'constructor')) {
      child = protoProps.constructor;
    } else {
      child = function(){ return parent.apply(this, arguments); };
    }

    // Add static properties to the constructor function, if supplied.
    _.extend(child, parent, staticProps);

    // Set the prototype chain to inherit from `parent`, without calling
    // `parent`'s constructor function.
    var Surrogate = function(){ this.constructor = child; };
    Surrogate.prototype = parent.prototype;
    child.prototype = new Surrogate;

    // Add prototype properties (instance properties) to the subclass,
    // if supplied.
    if (protoProps) _.extend(child.prototype, protoProps);

    // Set a convenience property in case the parent's prototype is needed
    // later.
    child.__super__ = parent.prototype;

    return child;
  };

  // Set up inheritance for the model, collection, router, view and history.
  Model.extend = Collection.extend = Router.extend = View.extend = History.extend = extend;

  // Throw an error when a URL is needed, and none is supplied.
  var urlError = function() {
    throw new Error('A "url" property or function must be specified');
  };

  // Wrap an optional error callback with a fallback error event.
  var wrapError = function(model, options) {
    var error = options.error;
    options.error = function(resp) {
      if (error) error(model, resp, options);
      model.trigger('error', model, resp, options);
    };
  };

  return Backbone;

}));

},{"underscore":11}],8:[function(require,module,exports){
/*!
 * jQuery JavaScript Library v2.1.3
 * http://jquery.com/
 *
 * Includes Sizzle.js
 * http://sizzlejs.com/
 *
 * Copyright 2005, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-18T15:11Z
 */

(function( global, factory ) {

	if ( typeof module === "object" && typeof module.exports === "object" ) {
		// For CommonJS and CommonJS-like environments where a proper `window`
		// is present, execute the factory and get jQuery.
		// For environments that do not have a `window` with a `document`
		// (such as Node.js), expose a factory as module.exports.
		// This accentuates the need for the creation of a real `window`.
		// e.g. var jQuery = require("jquery")(window);
		// See ticket #14549 for more info.
		module.exports = global.document ?
			factory( global, true ) :
			function( w ) {
				if ( !w.document ) {
					throw new Error( "jQuery requires a window with a document" );
				}
				return factory( w );
			};
	} else {
		factory( global );
	}

// Pass this if window is not defined yet
}(typeof window !== "undefined" ? window : this, function( window, noGlobal ) {

// Support: Firefox 18+
// Can't be in strict mode, several libs including ASP.NET trace
// the stack via arguments.caller.callee and Firefox dies if
// you try to trace through "use strict" call chains. (#13335)
//

var arr = [];

var slice = arr.slice;

var concat = arr.concat;

var push = arr.push;

var indexOf = arr.indexOf;

var class2type = {};

var toString = class2type.toString;

var hasOwn = class2type.hasOwnProperty;

var support = {};



var
	// Use the correct document accordingly with window argument (sandbox)
	document = window.document,

	version = "2.1.3",

	// Define a local copy of jQuery
	jQuery = function( selector, context ) {
		// The jQuery object is actually just the init constructor 'enhanced'
		// Need init if jQuery is called (just allow error to be thrown if not included)
		return new jQuery.fn.init( selector, context );
	},

	// Support: Android<4.1
	// Make sure we trim BOM and NBSP
	rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g,

	// Matches dashed string for camelizing
	rmsPrefix = /^-ms-/,
	rdashAlpha = /-([\da-z])/gi,

	// Used by jQuery.camelCase as callback to replace()
	fcamelCase = function( all, letter ) {
		return letter.toUpperCase();
	};

jQuery.fn = jQuery.prototype = {
	// The current version of jQuery being used
	jquery: version,

	constructor: jQuery,

	// Start with an empty selector
	selector: "",

	// The default length of a jQuery object is 0
	length: 0,

	toArray: function() {
		return slice.call( this );
	},

	// Get the Nth element in the matched element set OR
	// Get the whole matched element set as a clean array
	get: function( num ) {
		return num != null ?

			// Return just the one element from the set
			( num < 0 ? this[ num + this.length ] : this[ num ] ) :

			// Return all the elements in a clean array
			slice.call( this );
	},

	// Take an array of elements and push it onto the stack
	// (returning the new matched element set)
	pushStack: function( elems ) {

		// Build a new jQuery matched element set
		var ret = jQuery.merge( this.constructor(), elems );

		// Add the old object onto the stack (as a reference)
		ret.prevObject = this;
		ret.context = this.context;

		// Return the newly-formed element set
		return ret;
	},

	// Execute a callback for every element in the matched set.
	// (You can seed the arguments with an array of args, but this is
	// only used internally.)
	each: function( callback, args ) {
		return jQuery.each( this, callback, args );
	},

	map: function( callback ) {
		return this.pushStack( jQuery.map(this, function( elem, i ) {
			return callback.call( elem, i, elem );
		}));
	},

	slice: function() {
		return this.pushStack( slice.apply( this, arguments ) );
	},

	first: function() {
		return this.eq( 0 );
	},

	last: function() {
		return this.eq( -1 );
	},

	eq: function( i ) {
		var len = this.length,
			j = +i + ( i < 0 ? len : 0 );
		return this.pushStack( j >= 0 && j < len ? [ this[j] ] : [] );
	},

	end: function() {
		return this.prevObject || this.constructor(null);
	},

	// For internal use only.
	// Behaves like an Array's method, not like a jQuery method.
	push: push,
	sort: arr.sort,
	splice: arr.splice
};

jQuery.extend = jQuery.fn.extend = function() {
	var options, name, src, copy, copyIsArray, clone,
		target = arguments[0] || {},
		i = 1,
		length = arguments.length,
		deep = false;

	// Handle a deep copy situation
	if ( typeof target === "boolean" ) {
		deep = target;

		// Skip the boolean and the target
		target = arguments[ i ] || {};
		i++;
	}

	// Handle case when target is a string or something (possible in deep copy)
	if ( typeof target !== "object" && !jQuery.isFunction(target) ) {
		target = {};
	}

	// Extend jQuery itself if only one argument is passed
	if ( i === length ) {
		target = this;
		i--;
	}

	for ( ; i < length; i++ ) {
		// Only deal with non-null/undefined values
		if ( (options = arguments[ i ]) != null ) {
			// Extend the base object
			for ( name in options ) {
				src = target[ name ];
				copy = options[ name ];

				// Prevent never-ending loop
				if ( target === copy ) {
					continue;
				}

				// Recurse if we're merging plain objects or arrays
				if ( deep && copy && ( jQuery.isPlainObject(copy) || (copyIsArray = jQuery.isArray(copy)) ) ) {
					if ( copyIsArray ) {
						copyIsArray = false;
						clone = src && jQuery.isArray(src) ? src : [];

					} else {
						clone = src && jQuery.isPlainObject(src) ? src : {};
					}

					// Never move original objects, clone them
					target[ name ] = jQuery.extend( deep, clone, copy );

				// Don't bring in undefined values
				} else if ( copy !== undefined ) {
					target[ name ] = copy;
				}
			}
		}
	}

	// Return the modified object
	return target;
};

jQuery.extend({
	// Unique for each copy of jQuery on the page
	expando: "jQuery" + ( version + Math.random() ).replace( /\D/g, "" ),

	// Assume jQuery is ready without the ready module
	isReady: true,

	error: function( msg ) {
		throw new Error( msg );
	},

	noop: function() {},

	isFunction: function( obj ) {
		return jQuery.type(obj) === "function";
	},

	isArray: Array.isArray,

	isWindow: function( obj ) {
		return obj != null && obj === obj.window;
	},

	isNumeric: function( obj ) {
		// parseFloat NaNs numeric-cast false positives (null|true|false|"")
		// ...but misinterprets leading-number strings, particularly hex literals ("0x...")
		// subtraction forces infinities to NaN
		// adding 1 corrects loss of precision from parseFloat (#15100)
		return !jQuery.isArray( obj ) && (obj - parseFloat( obj ) + 1) >= 0;
	},

	isPlainObject: function( obj ) {
		// Not plain objects:
		// - Any object or value whose internal [[Class]] property is not "[object Object]"
		// - DOM nodes
		// - window
		if ( jQuery.type( obj ) !== "object" || obj.nodeType || jQuery.isWindow( obj ) ) {
			return false;
		}

		if ( obj.constructor &&
				!hasOwn.call( obj.constructor.prototype, "isPrototypeOf" ) ) {
			return false;
		}

		// If the function hasn't returned already, we're confident that
		// |obj| is a plain object, created by {} or constructed with new Object
		return true;
	},

	isEmptyObject: function( obj ) {
		var name;
		for ( name in obj ) {
			return false;
		}
		return true;
	},

	type: function( obj ) {
		if ( obj == null ) {
			return obj + "";
		}
		// Support: Android<4.0, iOS<6 (functionish RegExp)
		return typeof obj === "object" || typeof obj === "function" ?
			class2type[ toString.call(obj) ] || "object" :
			typeof obj;
	},

	// Evaluates a script in a global context
	globalEval: function( code ) {
		var script,
			indirect = eval;

		code = jQuery.trim( code );

		if ( code ) {
			// If the code includes a valid, prologue position
			// strict mode pragma, execute code by injecting a
			// script tag into the document.
			if ( code.indexOf("use strict") === 1 ) {
				script = document.createElement("script");
				script.text = code;
				document.head.appendChild( script ).parentNode.removeChild( script );
			} else {
			// Otherwise, avoid the DOM node creation, insertion
			// and removal by using an indirect global eval
				indirect( code );
			}
		}
	},

	// Convert dashed to camelCase; used by the css and data modules
	// Support: IE9-11+
	// Microsoft forgot to hump their vendor prefix (#9572)
	camelCase: function( string ) {
		return string.replace( rmsPrefix, "ms-" ).replace( rdashAlpha, fcamelCase );
	},

	nodeName: function( elem, name ) {
		return elem.nodeName && elem.nodeName.toLowerCase() === name.toLowerCase();
	},

	// args is for internal usage only
	each: function( obj, callback, args ) {
		var value,
			i = 0,
			length = obj.length,
			isArray = isArraylike( obj );

		if ( args ) {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.apply( obj[ i ], args );

					if ( value === false ) {
						break;
					}
				}
			}

		// A special, fast, case for the most common use of each
		} else {
			if ( isArray ) {
				for ( ; i < length; i++ ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			} else {
				for ( i in obj ) {
					value = callback.call( obj[ i ], i, obj[ i ] );

					if ( value === false ) {
						break;
					}
				}
			}
		}

		return obj;
	},

	// Support: Android<4.1
	trim: function( text ) {
		return text == null ?
			"" :
			( text + "" ).replace( rtrim, "" );
	},

	// results is for internal usage only
	makeArray: function( arr, results ) {
		var ret = results || [];

		if ( arr != null ) {
			if ( isArraylike( Object(arr) ) ) {
				jQuery.merge( ret,
					typeof arr === "string" ?
					[ arr ] : arr
				);
			} else {
				push.call( ret, arr );
			}
		}

		return ret;
	},

	inArray: function( elem, arr, i ) {
		return arr == null ? -1 : indexOf.call( arr, elem, i );
	},

	merge: function( first, second ) {
		var len = +second.length,
			j = 0,
			i = first.length;

		for ( ; j < len; j++ ) {
			first[ i++ ] = second[ j ];
		}

		first.length = i;

		return first;
	},

	grep: function( elems, callback, invert ) {
		var callbackInverse,
			matches = [],
			i = 0,
			length = elems.length,
			callbackExpect = !invert;

		// Go through the array, only saving the items
		// that pass the validator function
		for ( ; i < length; i++ ) {
			callbackInverse = !callback( elems[ i ], i );
			if ( callbackInverse !== callbackExpect ) {
				matches.push( elems[ i ] );
			}
		}

		return matches;
	},

	// arg is for internal usage only
	map: function( elems, callback, arg ) {
		var value,
			i = 0,
			length = elems.length,
			isArray = isArraylike( elems ),
			ret = [];

		// Go through the array, translating each of the items to their new values
		if ( isArray ) {
			for ( ; i < length; i++ ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}

		// Go through every key on the object,
		} else {
			for ( i in elems ) {
				value = callback( elems[ i ], i, arg );

				if ( value != null ) {
					ret.push( value );
				}
			}
		}

		// Flatten any nested arrays
		return concat.apply( [], ret );
	},

	// A global GUID counter for objects
	guid: 1,

	// Bind a function to a context, optionally partially applying any
	// arguments.
	proxy: function( fn, context ) {
		var tmp, args, proxy;

		if ( typeof context === "string" ) {
			tmp = fn[ context ];
			context = fn;
			fn = tmp;
		}

		// Quick check to determine if target is callable, in the spec
		// this throws a TypeError, but we will just return undefined.
		if ( !jQuery.isFunction( fn ) ) {
			return undefined;
		}

		// Simulated bind
		args = slice.call( arguments, 2 );
		proxy = function() {
			return fn.apply( context || this, args.concat( slice.call( arguments ) ) );
		};

		// Set the guid of unique handler to the same of original handler, so it can be removed
		proxy.guid = fn.guid = fn.guid || jQuery.guid++;

		return proxy;
	},

	now: Date.now,

	// jQuery.support is not used in Core but other projects attach their
	// properties to it so it needs to exist.
	support: support
});

// Populate the class2type map
jQuery.each("Boolean Number String Function Array Date RegExp Object Error".split(" "), function(i, name) {
	class2type[ "[object " + name + "]" ] = name.toLowerCase();
});

function isArraylike( obj ) {
	var length = obj.length,
		type = jQuery.type( obj );

	if ( type === "function" || jQuery.isWindow( obj ) ) {
		return false;
	}

	if ( obj.nodeType === 1 && length ) {
		return true;
	}

	return type === "array" || length === 0 ||
		typeof length === "number" && length > 0 && ( length - 1 ) in obj;
}
var Sizzle =
/*!
 * Sizzle CSS Selector Engine v2.2.0-pre
 * http://sizzlejs.com/
 *
 * Copyright 2008, 2014 jQuery Foundation, Inc. and other contributors
 * Released under the MIT license
 * http://jquery.org/license
 *
 * Date: 2014-12-16
 */
(function( window ) {

var i,
	support,
	Expr,
	getText,
	isXML,
	tokenize,
	compile,
	select,
	outermostContext,
	sortInput,
	hasDuplicate,

	// Local document vars
	setDocument,
	document,
	docElem,
	documentIsHTML,
	rbuggyQSA,
	rbuggyMatches,
	matches,
	contains,

	// Instance-specific data
	expando = "sizzle" + 1 * new Date(),
	preferredDoc = window.document,
	dirruns = 0,
	done = 0,
	classCache = createCache(),
	tokenCache = createCache(),
	compilerCache = createCache(),
	sortOrder = function( a, b ) {
		if ( a === b ) {
			hasDuplicate = true;
		}
		return 0;
	},

	// General-purpose constants
	MAX_NEGATIVE = 1 << 31,

	// Instance methods
	hasOwn = ({}).hasOwnProperty,
	arr = [],
	pop = arr.pop,
	push_native = arr.push,
	push = arr.push,
	slice = arr.slice,
	// Use a stripped-down indexOf as it's faster than native
	// http://jsperf.com/thor-indexof-vs-for/5
	indexOf = function( list, elem ) {
		var i = 0,
			len = list.length;
		for ( ; i < len; i++ ) {
			if ( list[i] === elem ) {
				return i;
			}
		}
		return -1;
	},

	booleans = "checked|selected|async|autofocus|autoplay|controls|defer|disabled|hidden|ismap|loop|multiple|open|readonly|required|scoped",

	// Regular expressions

	// Whitespace characters http://www.w3.org/TR/css3-selectors/#whitespace
	whitespace = "[\\x20\\t\\r\\n\\f]",
	// http://www.w3.org/TR/css3-syntax/#characters
	characterEncoding = "(?:\\\\.|[\\w-]|[^\\x00-\\xa0])+",

	// Loosely modeled on CSS identifier characters
	// An unquoted value should be a CSS identifier http://www.w3.org/TR/css3-selectors/#attribute-selectors
	// Proper syntax: http://www.w3.org/TR/CSS21/syndata.html#value-def-identifier
	identifier = characterEncoding.replace( "w", "w#" ),

	// Attribute selectors: http://www.w3.org/TR/selectors/#attribute-selectors
	attributes = "\\[" + whitespace + "*(" + characterEncoding + ")(?:" + whitespace +
		// Operator (capture 2)
		"*([*^$|!~]?=)" + whitespace +
		// "Attribute values must be CSS identifiers [capture 5] or strings [capture 3 or capture 4]"
		"*(?:'((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\"|(" + identifier + "))|)" + whitespace +
		"*\\]",

	pseudos = ":(" + characterEncoding + ")(?:\\((" +
		// To reduce the number of selectors needing tokenize in the preFilter, prefer arguments:
		// 1. quoted (capture 3; capture 4 or capture 5)
		"('((?:\\\\.|[^\\\\'])*)'|\"((?:\\\\.|[^\\\\\"])*)\")|" +
		// 2. simple (capture 6)
		"((?:\\\\.|[^\\\\()[\\]]|" + attributes + ")*)|" +
		// 3. anything else (capture 2)
		".*" +
		")\\)|)",

	// Leading and non-escaped trailing whitespace, capturing some non-whitespace characters preceding the latter
	rwhitespace = new RegExp( whitespace + "+", "g" ),
	rtrim = new RegExp( "^" + whitespace + "+|((?:^|[^\\\\])(?:\\\\.)*)" + whitespace + "+$", "g" ),

	rcomma = new RegExp( "^" + whitespace + "*," + whitespace + "*" ),
	rcombinators = new RegExp( "^" + whitespace + "*([>+~]|" + whitespace + ")" + whitespace + "*" ),

	rattributeQuotes = new RegExp( "=" + whitespace + "*([^\\]'\"]*?)" + whitespace + "*\\]", "g" ),

	rpseudo = new RegExp( pseudos ),
	ridentifier = new RegExp( "^" + identifier + "$" ),

	matchExpr = {
		"ID": new RegExp( "^#(" + characterEncoding + ")" ),
		"CLASS": new RegExp( "^\\.(" + characterEncoding + ")" ),
		"TAG": new RegExp( "^(" + characterEncoding.replace( "w", "w*" ) + ")" ),
		"ATTR": new RegExp( "^" + attributes ),
		"PSEUDO": new RegExp( "^" + pseudos ),
		"CHILD": new RegExp( "^:(only|first|last|nth|nth-last)-(child|of-type)(?:\\(" + whitespace +
			"*(even|odd|(([+-]|)(\\d*)n|)" + whitespace + "*(?:([+-]|)" + whitespace +
			"*(\\d+)|))" + whitespace + "*\\)|)", "i" ),
		"bool": new RegExp( "^(?:" + booleans + ")$", "i" ),
		// For use in libraries implementing .is()
		// We use this for POS matching in `select`
		"needsContext": new RegExp( "^" + whitespace + "*[>+~]|:(even|odd|eq|gt|lt|nth|first|last)(?:\\(" +
			whitespace + "*((?:-\\d)?\\d*)" + whitespace + "*\\)|)(?=[^-]|$)", "i" )
	},

	rinputs = /^(?:input|select|textarea|button)$/i,
	rheader = /^h\d$/i,

	rnative = /^[^{]+\{\s*\[native \w/,

	// Easily-parseable/retrievable ID or TAG or CLASS selectors
	rquickExpr = /^(?:#([\w-]+)|(\w+)|\.([\w-]+))$/,

	rsibling = /[+~]/,
	rescape = /'|\\/g,

	// CSS escapes http://www.w3.org/TR/CSS21/syndata.html#escaped-characters
	runescape = new RegExp( "\\\\([\\da-f]{1,6}" + whitespace + "?|(" + whitespace + ")|.)", "ig" ),
	funescape = function( _, escaped, escapedWhitespace ) {
		var high = "0x" + escaped - 0x10000;
		// NaN means non-codepoint
		// Support: Firefox<24
		// Workaround erroneous numeric interpretation of +"0x"
		return high !== high || escapedWhitespace ?
			escaped :
			high < 0 ?
				// BMP codepoint
				String.fromCharCode( high + 0x10000 ) :
				// Supplemental Plane codepoint (surrogate pair)
				String.fromCharCode( high >> 10 | 0xD800, high & 0x3FF | 0xDC00 );
	},

	// Used for iframes
	// See setDocument()
	// Removing the function wrapper causes a "Permission Denied"
	// error in IE
	unloadHandler = function() {
		setDocument();
	};

// Optimize for push.apply( _, NodeList )
try {
	push.apply(
		(arr = slice.call( preferredDoc.childNodes )),
		preferredDoc.childNodes
	);
	// Support: Android<4.0
	// Detect silently failing push.apply
	arr[ preferredDoc.childNodes.length ].nodeType;
} catch ( e ) {
	push = { apply: arr.length ?

		// Leverage slice if possible
		function( target, els ) {
			push_native.apply( target, slice.call(els) );
		} :

		// Support: IE<9
		// Otherwise append directly
		function( target, els ) {
			var j = target.length,
				i = 0;
			// Can't trust NodeList.length
			while ( (target[j++] = els[i++]) ) {}
			target.length = j - 1;
		}
	};
}

function Sizzle( selector, context, results, seed ) {
	var match, elem, m, nodeType,
		// QSA vars
		i, groups, old, nid, newContext, newSelector;

	if ( ( context ? context.ownerDocument || context : preferredDoc ) !== document ) {
		setDocument( context );
	}

	context = context || document;
	results = results || [];
	nodeType = context.nodeType;

	if ( typeof selector !== "string" || !selector ||
		nodeType !== 1 && nodeType !== 9 && nodeType !== 11 ) {

		return results;
	}

	if ( !seed && documentIsHTML ) {

		// Try to shortcut find operations when possible (e.g., not under DocumentFragment)
		if ( nodeType !== 11 && (match = rquickExpr.exec( selector )) ) {
			// Speed-up: Sizzle("#ID")
			if ( (m = match[1]) ) {
				if ( nodeType === 9 ) {
					elem = context.getElementById( m );
					// Check parentNode to catch when Blackberry 4.6 returns
					// nodes that are no longer in the document (jQuery #6963)
					if ( elem && elem.parentNode ) {
						// Handle the case where IE, Opera, and Webkit return items
						// by name instead of ID
						if ( elem.id === m ) {
							results.push( elem );
							return results;
						}
					} else {
						return results;
					}
				} else {
					// Context is not a document
					if ( context.ownerDocument && (elem = context.ownerDocument.getElementById( m )) &&
						contains( context, elem ) && elem.id === m ) {
						results.push( elem );
						return results;
					}
				}

			// Speed-up: Sizzle("TAG")
			} else if ( match[2] ) {
				push.apply( results, context.getElementsByTagName( selector ) );
				return results;

			// Speed-up: Sizzle(".CLASS")
			} else if ( (m = match[3]) && support.getElementsByClassName ) {
				push.apply( results, context.getElementsByClassName( m ) );
				return results;
			}
		}

		// QSA path
		if ( support.qsa && (!rbuggyQSA || !rbuggyQSA.test( selector )) ) {
			nid = old = expando;
			newContext = context;
			newSelector = nodeType !== 1 && selector;

			// qSA works strangely on Element-rooted queries
			// We can work around this by specifying an extra ID on the root
			// and working up from there (Thanks to Andrew Dupont for the technique)
			// IE 8 doesn't work on object elements
			if ( nodeType === 1 && context.nodeName.toLowerCase() !== "object" ) {
				groups = tokenize( selector );

				if ( (old = context.getAttribute("id")) ) {
					nid = old.replace( rescape, "\\$&" );
				} else {
					context.setAttribute( "id", nid );
				}
				nid = "[id='" + nid + "'] ";

				i = groups.length;
				while ( i-- ) {
					groups[i] = nid + toSelector( groups[i] );
				}
				newContext = rsibling.test( selector ) && testContext( context.parentNode ) || context;
				newSelector = groups.join(",");
			}

			if ( newSelector ) {
				try {
					push.apply( results,
						newContext.querySelectorAll( newSelector )
					);
					return results;
				} catch(qsaError) {
				} finally {
					if ( !old ) {
						context.removeAttribute("id");
					}
				}
			}
		}
	}

	// All others
	return select( selector.replace( rtrim, "$1" ), context, results, seed );
}

/**
 * Create key-value caches of limited size
 * @returns {Function(string, Object)} Returns the Object data after storing it on itself with
 *	property name the (space-suffixed) string and (if the cache is larger than Expr.cacheLength)
 *	deleting the oldest entry
 */
function createCache() {
	var keys = [];

	function cache( key, value ) {
		// Use (key + " ") to avoid collision with native prototype properties (see Issue #157)
		if ( keys.push( key + " " ) > Expr.cacheLength ) {
			// Only keep the most recent entries
			delete cache[ keys.shift() ];
		}
		return (cache[ key + " " ] = value);
	}
	return cache;
}

/**
 * Mark a function for special use by Sizzle
 * @param {Function} fn The function to mark
 */
function markFunction( fn ) {
	fn[ expando ] = true;
	return fn;
}

/**
 * Support testing using an element
 * @param {Function} fn Passed the created div and expects a boolean result
 */
function assert( fn ) {
	var div = document.createElement("div");

	try {
		return !!fn( div );
	} catch (e) {
		return false;
	} finally {
		// Remove from its parent by default
		if ( div.parentNode ) {
			div.parentNode.removeChild( div );
		}
		// release memory in IE
		div = null;
	}
}

/**
 * Adds the same handler for all of the specified attrs
 * @param {String} attrs Pipe-separated list of attributes
 * @param {Function} handler The method that will be applied
 */
function addHandle( attrs, handler ) {
	var arr = attrs.split("|"),
		i = attrs.length;

	while ( i-- ) {
		Expr.attrHandle[ arr[i] ] = handler;
	}
}

/**
 * Checks document order of two siblings
 * @param {Element} a
 * @param {Element} b
 * @returns {Number} Returns less than 0 if a precedes b, greater than 0 if a follows b
 */
function siblingCheck( a, b ) {
	var cur = b && a,
		diff = cur && a.nodeType === 1 && b.nodeType === 1 &&
			( ~b.sourceIndex || MAX_NEGATIVE ) -
			( ~a.sourceIndex || MAX_NEGATIVE );

	// Use IE sourceIndex if available on both nodes
	if ( diff ) {
		return diff;
	}

	// Check if b follows a
	if ( cur ) {
		while ( (cur = cur.nextSibling) ) {
			if ( cur === b ) {
				return -1;
			}
		}
	}

	return a ? 1 : -1;
}

/**
 * Returns a function to use in pseudos for input types
 * @param {String} type
 */
function createInputPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return name === "input" && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for buttons
 * @param {String} type
 */
function createButtonPseudo( type ) {
	return function( elem ) {
		var name = elem.nodeName.toLowerCase();
		return (name === "input" || name === "button") && elem.type === type;
	};
}

/**
 * Returns a function to use in pseudos for positionals
 * @param {Function} fn
 */
function createPositionalPseudo( fn ) {
	return markFunction(function( argument ) {
		argument = +argument;
		return markFunction(function( seed, matches ) {
			var j,
				matchIndexes = fn( [], seed.length, argument ),
				i = matchIndexes.length;

			// Match elements found at the specified indexes
			while ( i-- ) {
				if ( seed[ (j = matchIndexes[i]) ] ) {
					seed[j] = !(matches[j] = seed[j]);
				}
			}
		});
	});
}

/**
 * Checks a node for validity as a Sizzle context
 * @param {Element|Object=} context
 * @returns {Element|Object|Boolean} The input node if acceptable, otherwise a falsy value
 */
function testContext( context ) {
	return context && typeof context.getElementsByTagName !== "undefined" && context;
}

// Expose support vars for convenience
support = Sizzle.support = {};

/**
 * Detects XML nodes
 * @param {Element|Object} elem An element or a document
 * @returns {Boolean} True iff elem is a non-HTML XML node
 */
isXML = Sizzle.isXML = function( elem ) {
	// documentElement is verified for cases where it doesn't yet exist
	// (such as loading iframes in IE - #4833)
	var documentElement = elem && (elem.ownerDocument || elem).documentElement;
	return documentElement ? documentElement.nodeName !== "HTML" : false;
};

/**
 * Sets document-related variables once based on the current document
 * @param {Element|Object} [doc] An element or document object to use to set the document
 * @returns {Object} Returns the current document
 */
setDocument = Sizzle.setDocument = function( node ) {
	var hasCompare, parent,
		doc = node ? node.ownerDocument || node : preferredDoc;

	// If no document and documentElement is available, return
	if ( doc === document || doc.nodeType !== 9 || !doc.documentElement ) {
		return document;
	}

	// Set our document
	document = doc;
	docElem = doc.documentElement;
	parent = doc.defaultView;

	// Support: IE>8
	// If iframe document is assigned to "document" variable and if iframe has been reloaded,
	// IE will throw "permission denied" error when accessing "document" variable, see jQuery #13936
	// IE6-8 do not support the defaultView property so parent will be undefined
	if ( parent && parent !== parent.top ) {
		// IE11 does not have attachEvent, so all must suffer
		if ( parent.addEventListener ) {
			parent.addEventListener( "unload", unloadHandler, false );
		} else if ( parent.attachEvent ) {
			parent.attachEvent( "onunload", unloadHandler );
		}
	}

	/* Support tests
	---------------------------------------------------------------------- */
	documentIsHTML = !isXML( doc );

	/* Attributes
	---------------------------------------------------------------------- */

	// Support: IE<8
	// Verify that getAttribute really returns attributes and not properties
	// (excepting IE8 booleans)
	support.attributes = assert(function( div ) {
		div.className = "i";
		return !div.getAttribute("className");
	});

	/* getElement(s)By*
	---------------------------------------------------------------------- */

	// Check if getElementsByTagName("*") returns only elements
	support.getElementsByTagName = assert(function( div ) {
		div.appendChild( doc.createComment("") );
		return !div.getElementsByTagName("*").length;
	});

	// Support: IE<9
	support.getElementsByClassName = rnative.test( doc.getElementsByClassName );

	// Support: IE<10
	// Check if getElementById returns elements by name
	// The broken getElementById methods don't pick up programatically-set names,
	// so use a roundabout getElementsByName test
	support.getById = assert(function( div ) {
		docElem.appendChild( div ).id = expando;
		return !doc.getElementsByName || !doc.getElementsByName( expando ).length;
	});

	// ID find and filter
	if ( support.getById ) {
		Expr.find["ID"] = function( id, context ) {
			if ( typeof context.getElementById !== "undefined" && documentIsHTML ) {
				var m = context.getElementById( id );
				// Check parentNode to catch when Blackberry 4.6 returns
				// nodes that are no longer in the document #6963
				return m && m.parentNode ? [ m ] : [];
			}
		};
		Expr.filter["ID"] = function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				return elem.getAttribute("id") === attrId;
			};
		};
	} else {
		// Support: IE6/7
		// getElementById is not reliable as a find shortcut
		delete Expr.find["ID"];

		Expr.filter["ID"] =  function( id ) {
			var attrId = id.replace( runescape, funescape );
			return function( elem ) {
				var node = typeof elem.getAttributeNode !== "undefined" && elem.getAttributeNode("id");
				return node && node.value === attrId;
			};
		};
	}

	// Tag
	Expr.find["TAG"] = support.getElementsByTagName ?
		function( tag, context ) {
			if ( typeof context.getElementsByTagName !== "undefined" ) {
				return context.getElementsByTagName( tag );

			// DocumentFragment nodes don't have gEBTN
			} else if ( support.qsa ) {
				return context.querySelectorAll( tag );
			}
		} :

		function( tag, context ) {
			var elem,
				tmp = [],
				i = 0,
				// By happy coincidence, a (broken) gEBTN appears on DocumentFragment nodes too
				results = context.getElementsByTagName( tag );

			// Filter out possible comments
			if ( tag === "*" ) {
				while ( (elem = results[i++]) ) {
					if ( elem.nodeType === 1 ) {
						tmp.push( elem );
					}
				}

				return tmp;
			}
			return results;
		};

	// Class
	Expr.find["CLASS"] = support.getElementsByClassName && function( className, context ) {
		if ( documentIsHTML ) {
			return context.getElementsByClassName( className );
		}
	};

	/* QSA/matchesSelector
	---------------------------------------------------------------------- */

	// QSA and matchesSelector support

	// matchesSelector(:active) reports false when true (IE9/Opera 11.5)
	rbuggyMatches = [];

	// qSa(:focus) reports false when true (Chrome 21)
	// We allow this because of a bug in IE8/9 that throws an error
	// whenever `document.activeElement` is accessed on an iframe
	// So, we allow :focus to pass through QSA all the time to avoid the IE error
	// See http://bugs.jquery.com/ticket/13378
	rbuggyQSA = [];

	if ( (support.qsa = rnative.test( doc.querySelectorAll )) ) {
		// Build QSA regex
		// Regex strategy adopted from Diego Perini
		assert(function( div ) {
			// Select is set to empty string on purpose
			// This is to test IE's treatment of not explicitly
			// setting a boolean content attribute,
			// since its presence should be enough
			// http://bugs.jquery.com/ticket/12359
			docElem.appendChild( div ).innerHTML = "<a id='" + expando + "'></a>" +
				"<select id='" + expando + "-\f]' msallowcapture=''>" +
				"<option selected=''></option></select>";

			// Support: IE8, Opera 11-12.16
			// Nothing should be selected when empty strings follow ^= or $= or *=
			// The test attribute must be unknown in Opera but "safe" for WinRT
			// http://msdn.microsoft.com/en-us/library/ie/hh465388.aspx#attribute_section
			if ( div.querySelectorAll("[msallowcapture^='']").length ) {
				rbuggyQSA.push( "[*^$]=" + whitespace + "*(?:''|\"\")" );
			}

			// Support: IE8
			// Boolean attributes and "value" are not treated correctly
			if ( !div.querySelectorAll("[selected]").length ) {
				rbuggyQSA.push( "\\[" + whitespace + "*(?:value|" + booleans + ")" );
			}

			// Support: Chrome<29, Android<4.2+, Safari<7.0+, iOS<7.0+, PhantomJS<1.9.7+
			if ( !div.querySelectorAll( "[id~=" + expando + "-]" ).length ) {
				rbuggyQSA.push("~=");
			}

			// Webkit/Opera - :checked should return selected option elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":checked").length ) {
				rbuggyQSA.push(":checked");
			}

			// Support: Safari 8+, iOS 8+
			// https://bugs.webkit.org/show_bug.cgi?id=136851
			// In-page `selector#id sibing-combinator selector` fails
			if ( !div.querySelectorAll( "a#" + expando + "+*" ).length ) {
				rbuggyQSA.push(".#.+[+~]");
			}
		});

		assert(function( div ) {
			// Support: Windows 8 Native Apps
			// The type and name attributes are restricted during .innerHTML assignment
			var input = doc.createElement("input");
			input.setAttribute( "type", "hidden" );
			div.appendChild( input ).setAttribute( "name", "D" );

			// Support: IE8
			// Enforce case-sensitivity of name attribute
			if ( div.querySelectorAll("[name=d]").length ) {
				rbuggyQSA.push( "name" + whitespace + "*[*^$|!~]?=" );
			}

			// FF 3.5 - :enabled/:disabled and hidden elements (hidden elements are still enabled)
			// IE8 throws error here and will not see later tests
			if ( !div.querySelectorAll(":enabled").length ) {
				rbuggyQSA.push( ":enabled", ":disabled" );
			}

			// Opera 10-11 does not throw on post-comma invalid pseudos
			div.querySelectorAll("*,:x");
			rbuggyQSA.push(",.*:");
		});
	}

	if ( (support.matchesSelector = rnative.test( (matches = docElem.matches ||
		docElem.webkitMatchesSelector ||
		docElem.mozMatchesSelector ||
		docElem.oMatchesSelector ||
		docElem.msMatchesSelector) )) ) {

		assert(function( div ) {
			// Check to see if it's possible to do matchesSelector
			// on a disconnected node (IE 9)
			support.disconnectedMatch = matches.call( div, "div" );

			// This should fail with an exception
			// Gecko does not error, returns false instead
			matches.call( div, "[s!='']:x" );
			rbuggyMatches.push( "!=", pseudos );
		});
	}

	rbuggyQSA = rbuggyQSA.length && new RegExp( rbuggyQSA.join("|") );
	rbuggyMatches = rbuggyMatches.length && new RegExp( rbuggyMatches.join("|") );

	/* Contains
	---------------------------------------------------------------------- */
	hasCompare = rnative.test( docElem.compareDocumentPosition );

	// Element contains another
	// Purposefully does not implement inclusive descendent
	// As in, an element does not contain itself
	contains = hasCompare || rnative.test( docElem.contains ) ?
		function( a, b ) {
			var adown = a.nodeType === 9 ? a.documentElement : a,
				bup = b && b.parentNode;
			return a === bup || !!( bup && bup.nodeType === 1 && (
				adown.contains ?
					adown.contains( bup ) :
					a.compareDocumentPosition && a.compareDocumentPosition( bup ) & 16
			));
		} :
		function( a, b ) {
			if ( b ) {
				while ( (b = b.parentNode) ) {
					if ( b === a ) {
						return true;
					}
				}
			}
			return false;
		};

	/* Sorting
	---------------------------------------------------------------------- */

	// Document order sorting
	sortOrder = hasCompare ?
	function( a, b ) {

		// Flag for duplicate removal
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		// Sort on method existence if only one input has compareDocumentPosition
		var compare = !a.compareDocumentPosition - !b.compareDocumentPosition;
		if ( compare ) {
			return compare;
		}

		// Calculate position if both inputs belong to the same document
		compare = ( a.ownerDocument || a ) === ( b.ownerDocument || b ) ?
			a.compareDocumentPosition( b ) :

			// Otherwise we know they are disconnected
			1;

		// Disconnected nodes
		if ( compare & 1 ||
			(!support.sortDetached && b.compareDocumentPosition( a ) === compare) ) {

			// Choose the first element that is related to our preferred document
			if ( a === doc || a.ownerDocument === preferredDoc && contains(preferredDoc, a) ) {
				return -1;
			}
			if ( b === doc || b.ownerDocument === preferredDoc && contains(preferredDoc, b) ) {
				return 1;
			}

			// Maintain original order
			return sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;
		}

		return compare & 4 ? -1 : 1;
	} :
	function( a, b ) {
		// Exit early if the nodes are identical
		if ( a === b ) {
			hasDuplicate = true;
			return 0;
		}

		var cur,
			i = 0,
			aup = a.parentNode,
			bup = b.parentNode,
			ap = [ a ],
			bp = [ b ];

		// Parentless nodes are either documents or disconnected
		if ( !aup || !bup ) {
			return a === doc ? -1 :
				b === doc ? 1 :
				aup ? -1 :
				bup ? 1 :
				sortInput ?
				( indexOf( sortInput, a ) - indexOf( sortInput, b ) ) :
				0;

		// If the nodes are siblings, we can do a quick check
		} else if ( aup === bup ) {
			return siblingCheck( a, b );
		}

		// Otherwise we need full lists of their ancestors for comparison
		cur = a;
		while ( (cur = cur.parentNode) ) {
			ap.unshift( cur );
		}
		cur = b;
		while ( (cur = cur.parentNode) ) {
			bp.unshift( cur );
		}

		// Walk down the tree looking for a discrepancy
		while ( ap[i] === bp[i] ) {
			i++;
		}

		return i ?
			// Do a sibling check if the nodes have a common ancestor
			siblingCheck( ap[i], bp[i] ) :

			// Otherwise nodes in our document sort first
			ap[i] === preferredDoc ? -1 :
			bp[i] === preferredDoc ? 1 :
			0;
	};

	return doc;
};

Sizzle.matches = function( expr, elements ) {
	return Sizzle( expr, null, null, elements );
};

Sizzle.matchesSelector = function( elem, expr ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	// Make sure that attribute selectors are quoted
	expr = expr.replace( rattributeQuotes, "='$1']" );

	if ( support.matchesSelector && documentIsHTML &&
		( !rbuggyMatches || !rbuggyMatches.test( expr ) ) &&
		( !rbuggyQSA     || !rbuggyQSA.test( expr ) ) ) {

		try {
			var ret = matches.call( elem, expr );

			// IE 9's matchesSelector returns false on disconnected nodes
			if ( ret || support.disconnectedMatch ||
					// As well, disconnected nodes are said to be in a document
					// fragment in IE 9
					elem.document && elem.document.nodeType !== 11 ) {
				return ret;
			}
		} catch (e) {}
	}

	return Sizzle( expr, document, null, [ elem ] ).length > 0;
};

Sizzle.contains = function( context, elem ) {
	// Set document vars if needed
	if ( ( context.ownerDocument || context ) !== document ) {
		setDocument( context );
	}
	return contains( context, elem );
};

Sizzle.attr = function( elem, name ) {
	// Set document vars if needed
	if ( ( elem.ownerDocument || elem ) !== document ) {
		setDocument( elem );
	}

	var fn = Expr.attrHandle[ name.toLowerCase() ],
		// Don't get fooled by Object.prototype properties (jQuery #13807)
		val = fn && hasOwn.call( Expr.attrHandle, name.toLowerCase() ) ?
			fn( elem, name, !documentIsHTML ) :
			undefined;

	return val !== undefined ?
		val :
		support.attributes || !documentIsHTML ?
			elem.getAttribute( name ) :
			(val = elem.getAttributeNode(name)) && val.specified ?
				val.value :
				null;
};

Sizzle.error = function( msg ) {
	throw new Error( "Syntax error, unrecognized expression: " + msg );
};

/**
 * Document sorting and removing duplicates
 * @param {ArrayLike} results
 */
Sizzle.uniqueSort = function( results ) {
	var elem,
		duplicates = [],
		j = 0,
		i = 0;

	// Unless we *know* we can detect duplicates, assume their presence
	hasDuplicate = !support.detectDuplicates;
	sortInput = !support.sortStable && results.slice( 0 );
	results.sort( sortOrder );

	if ( hasDuplicate ) {
		while ( (elem = results[i++]) ) {
			if ( elem === results[ i ] ) {
				j = duplicates.push( i );
			}
		}
		while ( j-- ) {
			results.splice( duplicates[ j ], 1 );
		}
	}

	// Clear input after sorting to release objects
	// See https://github.com/jquery/sizzle/pull/225
	sortInput = null;

	return results;
};

/**
 * Utility function for retrieving the text value of an array of DOM nodes
 * @param {Array|Element} elem
 */
getText = Sizzle.getText = function( elem ) {
	var node,
		ret = "",
		i = 0,
		nodeType = elem.nodeType;

	if ( !nodeType ) {
		// If no nodeType, this is expected to be an array
		while ( (node = elem[i++]) ) {
			// Do not traverse comment nodes
			ret += getText( node );
		}
	} else if ( nodeType === 1 || nodeType === 9 || nodeType === 11 ) {
		// Use textContent for elements
		// innerText usage removed for consistency of new lines (jQuery #11153)
		if ( typeof elem.textContent === "string" ) {
			return elem.textContent;
		} else {
			// Traverse its children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				ret += getText( elem );
			}
		}
	} else if ( nodeType === 3 || nodeType === 4 ) {
		return elem.nodeValue;
	}
	// Do not include comment or processing instruction nodes

	return ret;
};

Expr = Sizzle.selectors = {

	// Can be adjusted by the user
	cacheLength: 50,

	createPseudo: markFunction,

	match: matchExpr,

	attrHandle: {},

	find: {},

	relative: {
		">": { dir: "parentNode", first: true },
		" ": { dir: "parentNode" },
		"+": { dir: "previousSibling", first: true },
		"~": { dir: "previousSibling" }
	},

	preFilter: {
		"ATTR": function( match ) {
			match[1] = match[1].replace( runescape, funescape );

			// Move the given value to match[3] whether quoted or unquoted
			match[3] = ( match[3] || match[4] || match[5] || "" ).replace( runescape, funescape );

			if ( match[2] === "~=" ) {
				match[3] = " " + match[3] + " ";
			}

			return match.slice( 0, 4 );
		},

		"CHILD": function( match ) {
			/* matches from matchExpr["CHILD"]
				1 type (only|nth|...)
				2 what (child|of-type)
				3 argument (even|odd|\d*|\d*n([+-]\d+)?|...)
				4 xn-component of xn+y argument ([+-]?\d*n|)
				5 sign of xn-component
				6 x of xn-component
				7 sign of y-component
				8 y of y-component
			*/
			match[1] = match[1].toLowerCase();

			if ( match[1].slice( 0, 3 ) === "nth" ) {
				// nth-* requires argument
				if ( !match[3] ) {
					Sizzle.error( match[0] );
				}

				// numeric x and y parameters for Expr.filter.CHILD
				// remember that false/true cast respectively to 0/1
				match[4] = +( match[4] ? match[5] + (match[6] || 1) : 2 * ( match[3] === "even" || match[3] === "odd" ) );
				match[5] = +( ( match[7] + match[8] ) || match[3] === "odd" );

			// other types prohibit arguments
			} else if ( match[3] ) {
				Sizzle.error( match[0] );
			}

			return match;
		},

		"PSEUDO": function( match ) {
			var excess,
				unquoted = !match[6] && match[2];

			if ( matchExpr["CHILD"].test( match[0] ) ) {
				return null;
			}

			// Accept quoted arguments as-is
			if ( match[3] ) {
				match[2] = match[4] || match[5] || "";

			// Strip excess characters from unquoted arguments
			} else if ( unquoted && rpseudo.test( unquoted ) &&
				// Get excess from tokenize (recursively)
				(excess = tokenize( unquoted, true )) &&
				// advance to the next closing parenthesis
				(excess = unquoted.indexOf( ")", unquoted.length - excess ) - unquoted.length) ) {

				// excess is a negative index
				match[0] = match[0].slice( 0, excess );
				match[2] = unquoted.slice( 0, excess );
			}

			// Return only captures needed by the pseudo filter method (type and argument)
			return match.slice( 0, 3 );
		}
	},

	filter: {

		"TAG": function( nodeNameSelector ) {
			var nodeName = nodeNameSelector.replace( runescape, funescape ).toLowerCase();
			return nodeNameSelector === "*" ?
				function() { return true; } :
				function( elem ) {
					return elem.nodeName && elem.nodeName.toLowerCase() === nodeName;
				};
		},

		"CLASS": function( className ) {
			var pattern = classCache[ className + " " ];

			return pattern ||
				(pattern = new RegExp( "(^|" + whitespace + ")" + className + "(" + whitespace + "|$)" )) &&
				classCache( className, function( elem ) {
					return pattern.test( typeof elem.className === "string" && elem.className || typeof elem.getAttribute !== "undefined" && elem.getAttribute("class") || "" );
				});
		},

		"ATTR": function( name, operator, check ) {
			return function( elem ) {
				var result = Sizzle.attr( elem, name );

				if ( result == null ) {
					return operator === "!=";
				}
				if ( !operator ) {
					return true;
				}

				result += "";

				return operator === "=" ? result === check :
					operator === "!=" ? result !== check :
					operator === "^=" ? check && result.indexOf( check ) === 0 :
					operator === "*=" ? check && result.indexOf( check ) > -1 :
					operator === "$=" ? check && result.slice( -check.length ) === check :
					operator === "~=" ? ( " " + result.replace( rwhitespace, " " ) + " " ).indexOf( check ) > -1 :
					operator === "|=" ? result === check || result.slice( 0, check.length + 1 ) === check + "-" :
					false;
			};
		},

		"CHILD": function( type, what, argument, first, last ) {
			var simple = type.slice( 0, 3 ) !== "nth",
				forward = type.slice( -4 ) !== "last",
				ofType = what === "of-type";

			return first === 1 && last === 0 ?

				// Shortcut for :nth-*(n)
				function( elem ) {
					return !!elem.parentNode;
				} :

				function( elem, context, xml ) {
					var cache, outerCache, node, diff, nodeIndex, start,
						dir = simple !== forward ? "nextSibling" : "previousSibling",
						parent = elem.parentNode,
						name = ofType && elem.nodeName.toLowerCase(),
						useCache = !xml && !ofType;

					if ( parent ) {

						// :(first|last|only)-(child|of-type)
						if ( simple ) {
							while ( dir ) {
								node = elem;
								while ( (node = node[ dir ]) ) {
									if ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) {
										return false;
									}
								}
								// Reverse direction for :only-* (if we haven't yet done so)
								start = dir = type === "only" && !start && "nextSibling";
							}
							return true;
						}

						start = [ forward ? parent.firstChild : parent.lastChild ];

						// non-xml :nth-child(...) stores cache data on `parent`
						if ( forward && useCache ) {
							// Seek `elem` from a previously-cached index
							outerCache = parent[ expando ] || (parent[ expando ] = {});
							cache = outerCache[ type ] || [];
							nodeIndex = cache[0] === dirruns && cache[1];
							diff = cache[0] === dirruns && cache[2];
							node = nodeIndex && parent.childNodes[ nodeIndex ];

							while ( (node = ++nodeIndex && node && node[ dir ] ||

								// Fallback to seeking `elem` from the start
								(diff = nodeIndex = 0) || start.pop()) ) {

								// When found, cache indexes on `parent` and break
								if ( node.nodeType === 1 && ++diff && node === elem ) {
									outerCache[ type ] = [ dirruns, nodeIndex, diff ];
									break;
								}
							}

						// Use previously-cached element index if available
						} else if ( useCache && (cache = (elem[ expando ] || (elem[ expando ] = {}))[ type ]) && cache[0] === dirruns ) {
							diff = cache[1];

						// xml :nth-child(...) or :nth-last-child(...) or :nth(-last)?-of-type(...)
						} else {
							// Use the same loop as above to seek `elem` from the start
							while ( (node = ++nodeIndex && node && node[ dir ] ||
								(diff = nodeIndex = 0) || start.pop()) ) {

								if ( ( ofType ? node.nodeName.toLowerCase() === name : node.nodeType === 1 ) && ++diff ) {
									// Cache the index of each encountered element
									if ( useCache ) {
										(node[ expando ] || (node[ expando ] = {}))[ type ] = [ dirruns, diff ];
									}

									if ( node === elem ) {
										break;
									}
								}
							}
						}

						// Incorporate the offset, then check against cycle size
						diff -= last;
						return diff === first || ( diff % first === 0 && diff / first >= 0 );
					}
				};
		},

		"PSEUDO": function( pseudo, argument ) {
			// pseudo-class names are case-insensitive
			// http://www.w3.org/TR/selectors/#pseudo-classes
			// Prioritize by case sensitivity in case custom pseudos are added with uppercase letters
			// Remember that setFilters inherits from pseudos
			var args,
				fn = Expr.pseudos[ pseudo ] || Expr.setFilters[ pseudo.toLowerCase() ] ||
					Sizzle.error( "unsupported pseudo: " + pseudo );

			// The user may use createPseudo to indicate that
			// arguments are needed to create the filter function
			// just as Sizzle does
			if ( fn[ expando ] ) {
				return fn( argument );
			}

			// But maintain support for old signatures
			if ( fn.length > 1 ) {
				args = [ pseudo, pseudo, "", argument ];
				return Expr.setFilters.hasOwnProperty( pseudo.toLowerCase() ) ?
					markFunction(function( seed, matches ) {
						var idx,
							matched = fn( seed, argument ),
							i = matched.length;
						while ( i-- ) {
							idx = indexOf( seed, matched[i] );
							seed[ idx ] = !( matches[ idx ] = matched[i] );
						}
					}) :
					function( elem ) {
						return fn( elem, 0, args );
					};
			}

			return fn;
		}
	},

	pseudos: {
		// Potentially complex pseudos
		"not": markFunction(function( selector ) {
			// Trim the selector passed to compile
			// to avoid treating leading and trailing
			// spaces as combinators
			var input = [],
				results = [],
				matcher = compile( selector.replace( rtrim, "$1" ) );

			return matcher[ expando ] ?
				markFunction(function( seed, matches, context, xml ) {
					var elem,
						unmatched = matcher( seed, null, xml, [] ),
						i = seed.length;

					// Match elements unmatched by `matcher`
					while ( i-- ) {
						if ( (elem = unmatched[i]) ) {
							seed[i] = !(matches[i] = elem);
						}
					}
				}) :
				function( elem, context, xml ) {
					input[0] = elem;
					matcher( input, null, xml, results );
					// Don't keep the element (issue #299)
					input[0] = null;
					return !results.pop();
				};
		}),

		"has": markFunction(function( selector ) {
			return function( elem ) {
				return Sizzle( selector, elem ).length > 0;
			};
		}),

		"contains": markFunction(function( text ) {
			text = text.replace( runescape, funescape );
			return function( elem ) {
				return ( elem.textContent || elem.innerText || getText( elem ) ).indexOf( text ) > -1;
			};
		}),

		// "Whether an element is represented by a :lang() selector
		// is based solely on the element's language value
		// being equal to the identifier C,
		// or beginning with the identifier C immediately followed by "-".
		// The matching of C against the element's language value is performed case-insensitively.
		// The identifier C does not have to be a valid language name."
		// http://www.w3.org/TR/selectors/#lang-pseudo
		"lang": markFunction( function( lang ) {
			// lang value must be a valid identifier
			if ( !ridentifier.test(lang || "") ) {
				Sizzle.error( "unsupported lang: " + lang );
			}
			lang = lang.replace( runescape, funescape ).toLowerCase();
			return function( elem ) {
				var elemLang;
				do {
					if ( (elemLang = documentIsHTML ?
						elem.lang :
						elem.getAttribute("xml:lang") || elem.getAttribute("lang")) ) {

						elemLang = elemLang.toLowerCase();
						return elemLang === lang || elemLang.indexOf( lang + "-" ) === 0;
					}
				} while ( (elem = elem.parentNode) && elem.nodeType === 1 );
				return false;
			};
		}),

		// Miscellaneous
		"target": function( elem ) {
			var hash = window.location && window.location.hash;
			return hash && hash.slice( 1 ) === elem.id;
		},

		"root": function( elem ) {
			return elem === docElem;
		},

		"focus": function( elem ) {
			return elem === document.activeElement && (!document.hasFocus || document.hasFocus()) && !!(elem.type || elem.href || ~elem.tabIndex);
		},

		// Boolean properties
		"enabled": function( elem ) {
			return elem.disabled === false;
		},

		"disabled": function( elem ) {
			return elem.disabled === true;
		},

		"checked": function( elem ) {
			// In CSS3, :checked should return both checked and selected elements
			// http://www.w3.org/TR/2011/REC-css3-selectors-20110929/#checked
			var nodeName = elem.nodeName.toLowerCase();
			return (nodeName === "input" && !!elem.checked) || (nodeName === "option" && !!elem.selected);
		},

		"selected": function( elem ) {
			// Accessing this property makes selected-by-default
			// options in Safari work properly
			if ( elem.parentNode ) {
				elem.parentNode.selectedIndex;
			}

			return elem.selected === true;
		},

		// Contents
		"empty": function( elem ) {
			// http://www.w3.org/TR/selectors/#empty-pseudo
			// :empty is negated by element (1) or content nodes (text: 3; cdata: 4; entity ref: 5),
			//   but not by others (comment: 8; processing instruction: 7; etc.)
			// nodeType < 6 works because attributes (2) do not appear as children
			for ( elem = elem.firstChild; elem; elem = elem.nextSibling ) {
				if ( elem.nodeType < 6 ) {
					return false;
				}
			}
			return true;
		},

		"parent": function( elem ) {
			return !Expr.pseudos["empty"]( elem );
		},

		// Element/input types
		"header": function( elem ) {
			return rheader.test( elem.nodeName );
		},

		"input": function( elem ) {
			return rinputs.test( elem.nodeName );
		},

		"button": function( elem ) {
			var name = elem.nodeName.toLowerCase();
			return name === "input" && elem.type === "button" || name === "button";
		},

		"text": function( elem ) {
			var attr;
			return elem.nodeName.toLowerCase() === "input" &&
				elem.type === "text" &&

				// Support: IE<8
				// New HTML5 attribute values (e.g., "search") appear with elem.type === "text"
				( (attr = elem.getAttribute("type")) == null || attr.toLowerCase() === "text" );
		},

		// Position-in-collection
		"first": createPositionalPseudo(function() {
			return [ 0 ];
		}),

		"last": createPositionalPseudo(function( matchIndexes, length ) {
			return [ length - 1 ];
		}),

		"eq": createPositionalPseudo(function( matchIndexes, length, argument ) {
			return [ argument < 0 ? argument + length : argument ];
		}),

		"even": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 0;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"odd": createPositionalPseudo(function( matchIndexes, length ) {
			var i = 1;
			for ( ; i < length; i += 2 ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"lt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; --i >= 0; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		}),

		"gt": createPositionalPseudo(function( matchIndexes, length, argument ) {
			var i = argument < 0 ? argument + length : argument;
			for ( ; ++i < length; ) {
				matchIndexes.push( i );
			}
			return matchIndexes;
		})
	}
};

Expr.pseudos["nth"] = Expr.pseudos["eq"];

// Add button/input type pseudos
for ( i in { radio: true, checkbox: true, file: true, password: true, image: true } ) {
	Expr.pseudos[ i ] = createInputPseudo( i );
}
for ( i in { submit: true, reset: true } ) {
	Expr.pseudos[ i ] = createButtonPseudo( i );
}

// Easy API for creating new setFilters
function setFilters() {}
setFilters.prototype = Expr.filters = Expr.pseudos;
Expr.setFilters = new setFilters();

tokenize = Sizzle.tokenize = function( selector, parseOnly ) {
	var matched, match, tokens, type,
		soFar, groups, preFilters,
		cached = tokenCache[ selector + " " ];

	if ( cached ) {
		return parseOnly ? 0 : cached.slice( 0 );
	}

	soFar = selector;
	groups = [];
	preFilters = Expr.preFilter;

	while ( soFar ) {

		// Comma and first run
		if ( !matched || (match = rcomma.exec( soFar )) ) {
			if ( match ) {
				// Don't consume trailing commas as valid
				soFar = soFar.slice( match[0].length ) || soFar;
			}
			groups.push( (tokens = []) );
		}

		matched = false;

		// Combinators
		if ( (match = rcombinators.exec( soFar )) ) {
			matched = match.shift();
			tokens.push({
				value: matched,
				// Cast descendant combinators to space
				type: match[0].replace( rtrim, " " )
			});
			soFar = soFar.slice( matched.length );
		}

		// Filters
		for ( type in Expr.filter ) {
			if ( (match = matchExpr[ type ].exec( soFar )) && (!preFilters[ type ] ||
				(match = preFilters[ type ]( match ))) ) {
				matched = match.shift();
				tokens.push({
					value: matched,
					type: type,
					matches: match
				});
				soFar = soFar.slice( matched.length );
			}
		}

		if ( !matched ) {
			break;
		}
	}

	// Return the length of the invalid excess
	// if we're just parsing
	// Otherwise, throw an error or return tokens
	return parseOnly ?
		soFar.length :
		soFar ?
			Sizzle.error( selector ) :
			// Cache the tokens
			tokenCache( selector, groups ).slice( 0 );
};

function toSelector( tokens ) {
	var i = 0,
		len = tokens.length,
		selector = "";
	for ( ; i < len; i++ ) {
		selector += tokens[i].value;
	}
	return selector;
}

function addCombinator( matcher, combinator, base ) {
	var dir = combinator.dir,
		checkNonElements = base && dir === "parentNode",
		doneName = done++;

	return combinator.first ?
		// Check against closest ancestor/preceding element
		function( elem, context, xml ) {
			while ( (elem = elem[ dir ]) ) {
				if ( elem.nodeType === 1 || checkNonElements ) {
					return matcher( elem, context, xml );
				}
			}
		} :

		// Check against all ancestor/preceding elements
		function( elem, context, xml ) {
			var oldCache, outerCache,
				newCache = [ dirruns, doneName ];

			// We can't set arbitrary data on XML nodes, so they don't benefit from dir caching
			if ( xml ) {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						if ( matcher( elem, context, xml ) ) {
							return true;
						}
					}
				}
			} else {
				while ( (elem = elem[ dir ]) ) {
					if ( elem.nodeType === 1 || checkNonElements ) {
						outerCache = elem[ expando ] || (elem[ expando ] = {});
						if ( (oldCache = outerCache[ dir ]) &&
							oldCache[ 0 ] === dirruns && oldCache[ 1 ] === doneName ) {

							// Assign to newCache so results back-propagate to previous elements
							return (newCache[ 2 ] = oldCache[ 2 ]);
						} else {
							// Reuse newcache so results back-propagate to previous elements
							outerCache[ dir ] = newCache;

							// A match means we're done; a fail means we have to keep checking
							if ( (newCache[ 2 ] = matcher( elem, context, xml )) ) {
								return true;
							}
						}
					}
				}
			}
		};
}

function elementMatcher( matchers ) {
	return matchers.length > 1 ?
		function( elem, context, xml ) {
			var i = matchers.length;
			while ( i-- ) {
				if ( !matchers[i]( elem, context, xml ) ) {
					return false;
				}
			}
			return true;
		} :
		matchers[0];
}

function multipleContexts( selector, contexts, results ) {
	var i = 0,
		len = contexts.length;
	for ( ; i < len; i++ ) {
		Sizzle( selector, contexts[i], results );
	}
	return results;
}

function condense( unmatched, map, filter, context, xml ) {
	var elem,
		newUnmatched = [],
		i = 0,
		len = unmatched.length,
		mapped = map != null;

	for ( ; i < len; i++ ) {
		if ( (elem = unmatched[i]) ) {
			if ( !filter || filter( elem, context, xml ) ) {
				newUnmatched.push( elem );
				if ( mapped ) {
					map.push( i );
				}
			}
		}
	}

	return newUnmatched;
}

function setMatcher( preFilter, selector, matcher, postFilter, postFinder, postSelector ) {
	if ( postFilter && !postFilter[ expando ] ) {
		postFilter = setMatcher( postFilter );
	}
	if ( postFinder && !postFinder[ expando ] ) {
		postFinder = setMatcher( postFinder, postSelector );
	}
	return markFunction(function( seed, results, context, xml ) {
		var temp, i, elem,
			preMap = [],
			postMap = [],
			preexisting = results.length,

			// Get initial elements from seed or context
			elems = seed || multipleContexts( selector || "*", context.nodeType ? [ context ] : context, [] ),

			// Prefilter to get matcher input, preserving a map for seed-results synchronization
			matcherIn = preFilter && ( seed || !selector ) ?
				condense( elems, preMap, preFilter, context, xml ) :
				elems,

			matcherOut = matcher ?
				// If we have a postFinder, or filtered seed, or non-seed postFilter or preexisting results,
				postFinder || ( seed ? preFilter : preexisting || postFilter ) ?

					// ...intermediate processing is necessary
					[] :

					// ...otherwise use results directly
					results :
				matcherIn;

		// Find primary matches
		if ( matcher ) {
			matcher( matcherIn, matcherOut, context, xml );
		}

		// Apply postFilter
		if ( postFilter ) {
			temp = condense( matcherOut, postMap );
			postFilter( temp, [], context, xml );

			// Un-match failing elements by moving them back to matcherIn
			i = temp.length;
			while ( i-- ) {
				if ( (elem = temp[i]) ) {
					matcherOut[ postMap[i] ] = !(matcherIn[ postMap[i] ] = elem);
				}
			}
		}

		if ( seed ) {
			if ( postFinder || preFilter ) {
				if ( postFinder ) {
					// Get the final matcherOut by condensing this intermediate into postFinder contexts
					temp = [];
					i = matcherOut.length;
					while ( i-- ) {
						if ( (elem = matcherOut[i]) ) {
							// Restore matcherIn since elem is not yet a final match
							temp.push( (matcherIn[i] = elem) );
						}
					}
					postFinder( null, (matcherOut = []), temp, xml );
				}

				// Move matched elements from seed to results to keep them synchronized
				i = matcherOut.length;
				while ( i-- ) {
					if ( (elem = matcherOut[i]) &&
						(temp = postFinder ? indexOf( seed, elem ) : preMap[i]) > -1 ) {

						seed[temp] = !(results[temp] = elem);
					}
				}
			}

		// Add elements to results, through postFinder if defined
		} else {
			matcherOut = condense(
				matcherOut === results ?
					matcherOut.splice( preexisting, matcherOut.length ) :
					matcherOut
			);
			if ( postFinder ) {
				postFinder( null, results, matcherOut, xml );
			} else {
				push.apply( results, matcherOut );
			}
		}
	});
}

function matcherFromTokens( tokens ) {
	var checkContext, matcher, j,
		len = tokens.length,
		leadingRelative = Expr.relative[ tokens[0].type ],
		implicitRelative = leadingRelative || Expr.relative[" "],
		i = leadingRelative ? 1 : 0,

		// The foundational matcher ensures that elements are reachable from top-level context(s)
		matchContext = addCombinator( function( elem ) {
			return elem === checkContext;
		}, implicitRelative, true ),
		matchAnyContext = addCombinator( function( elem ) {
			return indexOf( checkContext, elem ) > -1;
		}, implicitRelative, true ),
		matchers = [ function( elem, context, xml ) {
			var ret = ( !leadingRelative && ( xml || context !== outermostContext ) ) || (
				(checkContext = context).nodeType ?
					matchContext( elem, context, xml ) :
					matchAnyContext( elem, context, xml ) );
			// Avoid hanging onto element (issue #299)
			checkContext = null;
			return ret;
		} ];

	for ( ; i < len; i++ ) {
		if ( (matcher = Expr.relative[ tokens[i].type ]) ) {
			matchers = [ addCombinator(elementMatcher( matchers ), matcher) ];
		} else {
			matcher = Expr.filter[ tokens[i].type ].apply( null, tokens[i].matches );

			// Return special upon seeing a positional matcher
			if ( matcher[ expando ] ) {
				// Find the next relative operator (if any) for proper handling
				j = ++i;
				for ( ; j < len; j++ ) {
					if ( Expr.relative[ tokens[j].type ] ) {
						break;
					}
				}
				return setMatcher(
					i > 1 && elementMatcher( matchers ),
					i > 1 && toSelector(
						// If the preceding token was a descendant combinator, insert an implicit any-element `*`
						tokens.slice( 0, i - 1 ).concat({ value: tokens[ i - 2 ].type === " " ? "*" : "" })
					).replace( rtrim, "$1" ),
					matcher,
					i < j && matcherFromTokens( tokens.slice( i, j ) ),
					j < len && matcherFromTokens( (tokens = tokens.slice( j )) ),
					j < len && toSelector( tokens )
				);
			}
			matchers.push( matcher );
		}
	}

	return elementMatcher( matchers );
}

function matcherFromGroupMatchers( elementMatchers, setMatchers ) {
	var bySet = setMatchers.length > 0,
		byElement = elementMatchers.length > 0,
		superMatcher = function( seed, context, xml, results, outermost ) {
			var elem, j, matcher,
				matchedCount = 0,
				i = "0",
				unmatched = seed && [],
				setMatched = [],
				contextBackup = outermostContext,
				// We must always have either seed elements or outermost context
				elems = seed || byElement && Expr.find["TAG"]( "*", outermost ),
				// Use integer dirruns iff this is the outermost matcher
				dirrunsUnique = (dirruns += contextBackup == null ? 1 : Math.random() || 0.1),
				len = elems.length;

			if ( outermost ) {
				outermostContext = context !== document && context;
			}

			// Add elements passing elementMatchers directly to results
			// Keep `i` a string if there are no elements so `matchedCount` will be "00" below
			// Support: IE<9, Safari
			// Tolerate NodeList properties (IE: "length"; Safari: <number>) matching elements by id
			for ( ; i !== len && (elem = elems[i]) != null; i++ ) {
				if ( byElement && elem ) {
					j = 0;
					while ( (matcher = elementMatchers[j++]) ) {
						if ( matcher( elem, context, xml ) ) {
							results.push( elem );
							break;
						}
					}
					if ( outermost ) {
						dirruns = dirrunsUnique;
					}
				}

				// Track unmatched elements for set filters
				if ( bySet ) {
					// They will have gone through all possible matchers
					if ( (elem = !matcher && elem) ) {
						matchedCount--;
					}

					// Lengthen the array for every element, matched or not
					if ( seed ) {
						unmatched.push( elem );
					}
				}
			}

			// Apply set filters to unmatched elements
			matchedCount += i;
			if ( bySet && i !== matchedCount ) {
				j = 0;
				while ( (matcher = setMatchers[j++]) ) {
					matcher( unmatched, setMatched, context, xml );
				}

				if ( seed ) {
					// Reintegrate element matches to eliminate the need for sorting
					if ( matchedCount > 0 ) {
						while ( i-- ) {
							if ( !(unmatched[i] || setMatched[i]) ) {
								setMatched[i] = pop.call( results );
							}
						}
					}

					// Discard index placeholder values to get only actual matches
					setMatched = condense( setMatched );
				}

				// Add matches to results
				push.apply( results, setMatched );

				// Seedless set matches succeeding multiple successful matchers stipulate sorting
				if ( outermost && !seed && setMatched.length > 0 &&
					( matchedCount + setMatchers.length ) > 1 ) {

					Sizzle.uniqueSort( results );
				}
			}

			// Override manipulation of globals by nested matchers
			if ( outermost ) {
				dirruns = dirrunsUnique;
				outermostContext = contextBackup;
			}

			return unmatched;
		};

	return bySet ?
		markFunction( superMatcher ) :
		superMatcher;
}

compile = Sizzle.compile = function( selector, match /* Internal Use Only */ ) {
	var i,
		setMatchers = [],
		elementMatchers = [],
		cached = compilerCache[ selector + " " ];

	if ( !cached ) {
		// Generate a function of recursive functions that can be used to check each element
		if ( !match ) {
			match = tokenize( selector );
		}
		i = match.length;
		while ( i-- ) {
			cached = matcherFromTokens( match[i] );
			if ( cached[ expando ] ) {
				setMatchers.push( cached );
			} else {
				elementMatchers.push( cached );
			}
		}

		// Cache the compiled function
		cached = compilerCache( selector, matcherFromGroupMatchers( elementMatchers, setMatchers ) );

		// Save selector and tokenization
		cached.selector = selector;
	}
	return cached;
};

/**
 * A low-level selection function that works with Sizzle's compiled
 *  selector functions
 * @param {String|Function} selector A selector or a pre-compiled
 *  selector function built with Sizzle.compile
 * @param {Element} context
 * @param {Array} [results]
 * @param {Array} [seed] A set of elements to match against
 */
select = Sizzle.select = function( selector, context, results, seed ) {
	var i, tokens, token, type, find,
		compiled = typeof selector === "function" && selector,
		match = !seed && tokenize( (selector = compiled.selector || selector) );

	results = results || [];

	// Try to minimize operations if there is no seed and only one group
	if ( match.length === 1 ) {

		// Take a shortcut and set the context if the root selector is an ID
		tokens = match[0] = match[0].slice( 0 );
		if ( tokens.length > 2 && (token = tokens[0]).type === "ID" &&
				support.getById && context.nodeType === 9 && documentIsHTML &&
				Expr.relative[ tokens[1].type ] ) {

			context = ( Expr.find["ID"]( token.matches[0].replace(runescape, funescape), context ) || [] )[0];
			if ( !context ) {
				return results;

			// Precompiled matchers will still verify ancestry, so step up a level
			} else if ( compiled ) {
				context = context.parentNode;
			}

			selector = selector.slice( tokens.shift().value.length );
		}

		// Fetch a seed set for right-to-left matching
		i = matchExpr["needsContext"].test( selector ) ? 0 : tokens.length;
		while ( i-- ) {
			token = tokens[i];

			// Abort if we hit a combinator
			if ( Expr.relative[ (type = token.type) ] ) {
				break;
			}
			if ( (find = Expr.find[ type ]) ) {
				// Search, expanding context for leading sibling combinators
				if ( (seed = find(
					token.matches[0].replace( runescape, funescape ),
					rsibling.test( tokens[0].type ) && testContext( context.parentNode ) || context
				)) ) {

					// If seed is empty or no tokens remain, we can return early
					tokens.splice( i, 1 );
					selector = seed.length && toSelector( tokens );
					if ( !selector ) {
						push.apply( results, seed );
						return results;
					}

					break;
				}
			}
		}
	}

	// Compile and execute a filtering function if one is not provided
	// Provide `match` to avoid retokenization if we modified the selector above
	( compiled || compile( selector, match ) )(
		seed,
		context,
		!documentIsHTML,
		results,
		rsibling.test( selector ) && testContext( context.parentNode ) || context
	);
	return results;
};

// One-time assignments

// Sort stability
support.sortStable = expando.split("").sort( sortOrder ).join("") === expando;

// Support: Chrome 14-35+
// Always assume duplicates if they aren't passed to the comparison function
support.detectDuplicates = !!hasDuplicate;

// Initialize against the default document
setDocument();

// Support: Webkit<537.32 - Safari 6.0.3/Chrome 25 (fixed in Chrome 27)
// Detached nodes confoundingly follow *each other*
support.sortDetached = assert(function( div1 ) {
	// Should return 1, but returns 4 (following)
	return div1.compareDocumentPosition( document.createElement("div") ) & 1;
});

// Support: IE<8
// Prevent attribute/property "interpolation"
// http://msdn.microsoft.com/en-us/library/ms536429%28VS.85%29.aspx
if ( !assert(function( div ) {
	div.innerHTML = "<a href='#'></a>";
	return div.firstChild.getAttribute("href") === "#" ;
}) ) {
	addHandle( "type|href|height|width", function( elem, name, isXML ) {
		if ( !isXML ) {
			return elem.getAttribute( name, name.toLowerCase() === "type" ? 1 : 2 );
		}
	});
}

// Support: IE<9
// Use defaultValue in place of getAttribute("value")
if ( !support.attributes || !assert(function( div ) {
	div.innerHTML = "<input/>";
	div.firstChild.setAttribute( "value", "" );
	return div.firstChild.getAttribute( "value" ) === "";
}) ) {
	addHandle( "value", function( elem, name, isXML ) {
		if ( !isXML && elem.nodeName.toLowerCase() === "input" ) {
			return elem.defaultValue;
		}
	});
}

// Support: IE<9
// Use getAttributeNode to fetch booleans when getAttribute lies
if ( !assert(function( div ) {
	return div.getAttribute("disabled") == null;
}) ) {
	addHandle( booleans, function( elem, name, isXML ) {
		var val;
		if ( !isXML ) {
			return elem[ name ] === true ? name.toLowerCase() :
					(val = elem.getAttributeNode( name )) && val.specified ?
					val.value :
				null;
		}
	});
}

return Sizzle;

})( window );



jQuery.find = Sizzle;
jQuery.expr = Sizzle.selectors;
jQuery.expr[":"] = jQuery.expr.pseudos;
jQuery.unique = Sizzle.uniqueSort;
jQuery.text = Sizzle.getText;
jQuery.isXMLDoc = Sizzle.isXML;
jQuery.contains = Sizzle.contains;



var rneedsContext = jQuery.expr.match.needsContext;

var rsingleTag = (/^<(\w+)\s*\/?>(?:<\/\1>|)$/);



var risSimple = /^.[^:#\[\.,]*$/;

// Implement the identical functionality for filter and not
function winnow( elements, qualifier, not ) {
	if ( jQuery.isFunction( qualifier ) ) {
		return jQuery.grep( elements, function( elem, i ) {
			/* jshint -W018 */
			return !!qualifier.call( elem, i, elem ) !== not;
		});

	}

	if ( qualifier.nodeType ) {
		return jQuery.grep( elements, function( elem ) {
			return ( elem === qualifier ) !== not;
		});

	}

	if ( typeof qualifier === "string" ) {
		if ( risSimple.test( qualifier ) ) {
			return jQuery.filter( qualifier, elements, not );
		}

		qualifier = jQuery.filter( qualifier, elements );
	}

	return jQuery.grep( elements, function( elem ) {
		return ( indexOf.call( qualifier, elem ) >= 0 ) !== not;
	});
}

jQuery.filter = function( expr, elems, not ) {
	var elem = elems[ 0 ];

	if ( not ) {
		expr = ":not(" + expr + ")";
	}

	return elems.length === 1 && elem.nodeType === 1 ?
		jQuery.find.matchesSelector( elem, expr ) ? [ elem ] : [] :
		jQuery.find.matches( expr, jQuery.grep( elems, function( elem ) {
			return elem.nodeType === 1;
		}));
};

jQuery.fn.extend({
	find: function( selector ) {
		var i,
			len = this.length,
			ret = [],
			self = this;

		if ( typeof selector !== "string" ) {
			return this.pushStack( jQuery( selector ).filter(function() {
				for ( i = 0; i < len; i++ ) {
					if ( jQuery.contains( self[ i ], this ) ) {
						return true;
					}
				}
			}) );
		}

		for ( i = 0; i < len; i++ ) {
			jQuery.find( selector, self[ i ], ret );
		}

		// Needed because $( selector, context ) becomes $( context ).find( selector )
		ret = this.pushStack( len > 1 ? jQuery.unique( ret ) : ret );
		ret.selector = this.selector ? this.selector + " " + selector : selector;
		return ret;
	},
	filter: function( selector ) {
		return this.pushStack( winnow(this, selector || [], false) );
	},
	not: function( selector ) {
		return this.pushStack( winnow(this, selector || [], true) );
	},
	is: function( selector ) {
		return !!winnow(
			this,

			// If this is a positional/relative selector, check membership in the returned set
			// so $("p:first").is("p:last") won't return true for a doc with two "p".
			typeof selector === "string" && rneedsContext.test( selector ) ?
				jQuery( selector ) :
				selector || [],
			false
		).length;
	}
});


// Initialize a jQuery object


// A central reference to the root jQuery(document)
var rootjQuery,

	// A simple way to check for HTML strings
	// Prioritize #id over <tag> to avoid XSS via location.hash (#9521)
	// Strict HTML recognition (#11290: must start with <)
	rquickExpr = /^(?:\s*(<[\w\W]+>)[^>]*|#([\w-]*))$/,

	init = jQuery.fn.init = function( selector, context ) {
		var match, elem;

		// HANDLE: $(""), $(null), $(undefined), $(false)
		if ( !selector ) {
			return this;
		}

		// Handle HTML strings
		if ( typeof selector === "string" ) {
			if ( selector[0] === "<" && selector[ selector.length - 1 ] === ">" && selector.length >= 3 ) {
				// Assume that strings that start and end with <> are HTML and skip the regex check
				match = [ null, selector, null ];

			} else {
				match = rquickExpr.exec( selector );
			}

			// Match html or make sure no context is specified for #id
			if ( match && (match[1] || !context) ) {

				// HANDLE: $(html) -> $(array)
				if ( match[1] ) {
					context = context instanceof jQuery ? context[0] : context;

					// Option to run scripts is true for back-compat
					// Intentionally let the error be thrown if parseHTML is not present
					jQuery.merge( this, jQuery.parseHTML(
						match[1],
						context && context.nodeType ? context.ownerDocument || context : document,
						true
					) );

					// HANDLE: $(html, props)
					if ( rsingleTag.test( match[1] ) && jQuery.isPlainObject( context ) ) {
						for ( match in context ) {
							// Properties of context are called as methods if possible
							if ( jQuery.isFunction( this[ match ] ) ) {
								this[ match ]( context[ match ] );

							// ...and otherwise set as attributes
							} else {
								this.attr( match, context[ match ] );
							}
						}
					}

					return this;

				// HANDLE: $(#id)
				} else {
					elem = document.getElementById( match[2] );

					// Support: Blackberry 4.6
					// gEBID returns nodes no longer in the document (#6963)
					if ( elem && elem.parentNode ) {
						// Inject the element directly into the jQuery object
						this.length = 1;
						this[0] = elem;
					}

					this.context = document;
					this.selector = selector;
					return this;
				}

			// HANDLE: $(expr, $(...))
			} else if ( !context || context.jquery ) {
				return ( context || rootjQuery ).find( selector );

			// HANDLE: $(expr, context)
			// (which is just equivalent to: $(context).find(expr)
			} else {
				return this.constructor( context ).find( selector );
			}

		// HANDLE: $(DOMElement)
		} else if ( selector.nodeType ) {
			this.context = this[0] = selector;
			this.length = 1;
			return this;

		// HANDLE: $(function)
		// Shortcut for document ready
		} else if ( jQuery.isFunction( selector ) ) {
			return typeof rootjQuery.ready !== "undefined" ?
				rootjQuery.ready( selector ) :
				// Execute immediately if ready is not present
				selector( jQuery );
		}

		if ( selector.selector !== undefined ) {
			this.selector = selector.selector;
			this.context = selector.context;
		}

		return jQuery.makeArray( selector, this );
	};

// Give the init function the jQuery prototype for later instantiation
init.prototype = jQuery.fn;

// Initialize central reference
rootjQuery = jQuery( document );


var rparentsprev = /^(?:parents|prev(?:Until|All))/,
	// Methods guaranteed to produce a unique set when starting from a unique set
	guaranteedUnique = {
		children: true,
		contents: true,
		next: true,
		prev: true
	};

jQuery.extend({
	dir: function( elem, dir, until ) {
		var matched = [],
			truncate = until !== undefined;

		while ( (elem = elem[ dir ]) && elem.nodeType !== 9 ) {
			if ( elem.nodeType === 1 ) {
				if ( truncate && jQuery( elem ).is( until ) ) {
					break;
				}
				matched.push( elem );
			}
		}
		return matched;
	},

	sibling: function( n, elem ) {
		var matched = [];

		for ( ; n; n = n.nextSibling ) {
			if ( n.nodeType === 1 && n !== elem ) {
				matched.push( n );
			}
		}

		return matched;
	}
});

jQuery.fn.extend({
	has: function( target ) {
		var targets = jQuery( target, this ),
			l = targets.length;

		return this.filter(function() {
			var i = 0;
			for ( ; i < l; i++ ) {
				if ( jQuery.contains( this, targets[i] ) ) {
					return true;
				}
			}
		});
	},

	closest: function( selectors, context ) {
		var cur,
			i = 0,
			l = this.length,
			matched = [],
			pos = rneedsContext.test( selectors ) || typeof selectors !== "string" ?
				jQuery( selectors, context || this.context ) :
				0;

		for ( ; i < l; i++ ) {
			for ( cur = this[i]; cur && cur !== context; cur = cur.parentNode ) {
				// Always skip document fragments
				if ( cur.nodeType < 11 && (pos ?
					pos.index(cur) > -1 :

					// Don't pass non-elements to Sizzle
					cur.nodeType === 1 &&
						jQuery.find.matchesSelector(cur, selectors)) ) {

					matched.push( cur );
					break;
				}
			}
		}

		return this.pushStack( matched.length > 1 ? jQuery.unique( matched ) : matched );
	},

	// Determine the position of an element within the set
	index: function( elem ) {

		// No argument, return index in parent
		if ( !elem ) {
			return ( this[ 0 ] && this[ 0 ].parentNode ) ? this.first().prevAll().length : -1;
		}

		// Index in selector
		if ( typeof elem === "string" ) {
			return indexOf.call( jQuery( elem ), this[ 0 ] );
		}

		// Locate the position of the desired element
		return indexOf.call( this,

			// If it receives a jQuery object, the first element is used
			elem.jquery ? elem[ 0 ] : elem
		);
	},

	add: function( selector, context ) {
		return this.pushStack(
			jQuery.unique(
				jQuery.merge( this.get(), jQuery( selector, context ) )
			)
		);
	},

	addBack: function( selector ) {
		return this.add( selector == null ?
			this.prevObject : this.prevObject.filter(selector)
		);
	}
});

function sibling( cur, dir ) {
	while ( (cur = cur[dir]) && cur.nodeType !== 1 ) {}
	return cur;
}

jQuery.each({
	parent: function( elem ) {
		var parent = elem.parentNode;
		return parent && parent.nodeType !== 11 ? parent : null;
	},
	parents: function( elem ) {
		return jQuery.dir( elem, "parentNode" );
	},
	parentsUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "parentNode", until );
	},
	next: function( elem ) {
		return sibling( elem, "nextSibling" );
	},
	prev: function( elem ) {
		return sibling( elem, "previousSibling" );
	},
	nextAll: function( elem ) {
		return jQuery.dir( elem, "nextSibling" );
	},
	prevAll: function( elem ) {
		return jQuery.dir( elem, "previousSibling" );
	},
	nextUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "nextSibling", until );
	},
	prevUntil: function( elem, i, until ) {
		return jQuery.dir( elem, "previousSibling", until );
	},
	siblings: function( elem ) {
		return jQuery.sibling( ( elem.parentNode || {} ).firstChild, elem );
	},
	children: function( elem ) {
		return jQuery.sibling( elem.firstChild );
	},
	contents: function( elem ) {
		return elem.contentDocument || jQuery.merge( [], elem.childNodes );
	}
}, function( name, fn ) {
	jQuery.fn[ name ] = function( until, selector ) {
		var matched = jQuery.map( this, fn, until );

		if ( name.slice( -5 ) !== "Until" ) {
			selector = until;
		}

		if ( selector && typeof selector === "string" ) {
			matched = jQuery.filter( selector, matched );
		}

		if ( this.length > 1 ) {
			// Remove duplicates
			if ( !guaranteedUnique[ name ] ) {
				jQuery.unique( matched );
			}

			// Reverse order for parents* and prev-derivatives
			if ( rparentsprev.test( name ) ) {
				matched.reverse();
			}
		}

		return this.pushStack( matched );
	};
});
var rnotwhite = (/\S+/g);



// String to Object options format cache
var optionsCache = {};

// Convert String-formatted options into Object-formatted ones and store in cache
function createOptions( options ) {
	var object = optionsCache[ options ] = {};
	jQuery.each( options.match( rnotwhite ) || [], function( _, flag ) {
		object[ flag ] = true;
	});
	return object;
}

/*
 * Create a callback list using the following parameters:
 *
 *	options: an optional list of space-separated options that will change how
 *			the callback list behaves or a more traditional option object
 *
 * By default a callback list will act like an event callback list and can be
 * "fired" multiple times.
 *
 * Possible options:
 *
 *	once:			will ensure the callback list can only be fired once (like a Deferred)
 *
 *	memory:			will keep track of previous values and will call any callback added
 *					after the list has been fired right away with the latest "memorized"
 *					values (like a Deferred)
 *
 *	unique:			will ensure a callback can only be added once (no duplicate in the list)
 *
 *	stopOnFalse:	interrupt callings when a callback returns false
 *
 */
jQuery.Callbacks = function( options ) {

	// Convert options from String-formatted to Object-formatted if needed
	// (we check in cache first)
	options = typeof options === "string" ?
		( optionsCache[ options ] || createOptions( options ) ) :
		jQuery.extend( {}, options );

	var // Last fire value (for non-forgettable lists)
		memory,
		// Flag to know if list was already fired
		fired,
		// Flag to know if list is currently firing
		firing,
		// First callback to fire (used internally by add and fireWith)
		firingStart,
		// End of the loop when firing
		firingLength,
		// Index of currently firing callback (modified by remove if needed)
		firingIndex,
		// Actual callback list
		list = [],
		// Stack of fire calls for repeatable lists
		stack = !options.once && [],
		// Fire callbacks
		fire = function( data ) {
			memory = options.memory && data;
			fired = true;
			firingIndex = firingStart || 0;
			firingStart = 0;
			firingLength = list.length;
			firing = true;
			for ( ; list && firingIndex < firingLength; firingIndex++ ) {
				if ( list[ firingIndex ].apply( data[ 0 ], data[ 1 ] ) === false && options.stopOnFalse ) {
					memory = false; // To prevent further calls using add
					break;
				}
			}
			firing = false;
			if ( list ) {
				if ( stack ) {
					if ( stack.length ) {
						fire( stack.shift() );
					}
				} else if ( memory ) {
					list = [];
				} else {
					self.disable();
				}
			}
		},
		// Actual Callbacks object
		self = {
			// Add a callback or a collection of callbacks to the list
			add: function() {
				if ( list ) {
					// First, we save the current length
					var start = list.length;
					(function add( args ) {
						jQuery.each( args, function( _, arg ) {
							var type = jQuery.type( arg );
							if ( type === "function" ) {
								if ( !options.unique || !self.has( arg ) ) {
									list.push( arg );
								}
							} else if ( arg && arg.length && type !== "string" ) {
								// Inspect recursively
								add( arg );
							}
						});
					})( arguments );
					// Do we need to add the callbacks to the
					// current firing batch?
					if ( firing ) {
						firingLength = list.length;
					// With memory, if we're not firing then
					// we should call right away
					} else if ( memory ) {
						firingStart = start;
						fire( memory );
					}
				}
				return this;
			},
			// Remove a callback from the list
			remove: function() {
				if ( list ) {
					jQuery.each( arguments, function( _, arg ) {
						var index;
						while ( ( index = jQuery.inArray( arg, list, index ) ) > -1 ) {
							list.splice( index, 1 );
							// Handle firing indexes
							if ( firing ) {
								if ( index <= firingLength ) {
									firingLength--;
								}
								if ( index <= firingIndex ) {
									firingIndex--;
								}
							}
						}
					});
				}
				return this;
			},
			// Check if a given callback is in the list.
			// If no argument is given, return whether or not list has callbacks attached.
			has: function( fn ) {
				return fn ? jQuery.inArray( fn, list ) > -1 : !!( list && list.length );
			},
			// Remove all callbacks from the list
			empty: function() {
				list = [];
				firingLength = 0;
				return this;
			},
			// Have the list do nothing anymore
			disable: function() {
				list = stack = memory = undefined;
				return this;
			},
			// Is it disabled?
			disabled: function() {
				return !list;
			},
			// Lock the list in its current state
			lock: function() {
				stack = undefined;
				if ( !memory ) {
					self.disable();
				}
				return this;
			},
			// Is it locked?
			locked: function() {
				return !stack;
			},
			// Call all callbacks with the given context and arguments
			fireWith: function( context, args ) {
				if ( list && ( !fired || stack ) ) {
					args = args || [];
					args = [ context, args.slice ? args.slice() : args ];
					if ( firing ) {
						stack.push( args );
					} else {
						fire( args );
					}
				}
				return this;
			},
			// Call all the callbacks with the given arguments
			fire: function() {
				self.fireWith( this, arguments );
				return this;
			},
			// To know if the callbacks have already been called at least once
			fired: function() {
				return !!fired;
			}
		};

	return self;
};


jQuery.extend({

	Deferred: function( func ) {
		var tuples = [
				// action, add listener, listener list, final state
				[ "resolve", "done", jQuery.Callbacks("once memory"), "resolved" ],
				[ "reject", "fail", jQuery.Callbacks("once memory"), "rejected" ],
				[ "notify", "progress", jQuery.Callbacks("memory") ]
			],
			state = "pending",
			promise = {
				state: function() {
					return state;
				},
				always: function() {
					deferred.done( arguments ).fail( arguments );
					return this;
				},
				then: function( /* fnDone, fnFail, fnProgress */ ) {
					var fns = arguments;
					return jQuery.Deferred(function( newDefer ) {
						jQuery.each( tuples, function( i, tuple ) {
							var fn = jQuery.isFunction( fns[ i ] ) && fns[ i ];
							// deferred[ done | fail | progress ] for forwarding actions to newDefer
							deferred[ tuple[1] ](function() {
								var returned = fn && fn.apply( this, arguments );
								if ( returned && jQuery.isFunction( returned.promise ) ) {
									returned.promise()
										.done( newDefer.resolve )
										.fail( newDefer.reject )
										.progress( newDefer.notify );
								} else {
									newDefer[ tuple[ 0 ] + "With" ]( this === promise ? newDefer.promise() : this, fn ? [ returned ] : arguments );
								}
							});
						});
						fns = null;
					}).promise();
				},
				// Get a promise for this deferred
				// If obj is provided, the promise aspect is added to the object
				promise: function( obj ) {
					return obj != null ? jQuery.extend( obj, promise ) : promise;
				}
			},
			deferred = {};

		// Keep pipe for back-compat
		promise.pipe = promise.then;

		// Add list-specific methods
		jQuery.each( tuples, function( i, tuple ) {
			var list = tuple[ 2 ],
				stateString = tuple[ 3 ];

			// promise[ done | fail | progress ] = list.add
			promise[ tuple[1] ] = list.add;

			// Handle state
			if ( stateString ) {
				list.add(function() {
					// state = [ resolved | rejected ]
					state = stateString;

				// [ reject_list | resolve_list ].disable; progress_list.lock
				}, tuples[ i ^ 1 ][ 2 ].disable, tuples[ 2 ][ 2 ].lock );
			}

			// deferred[ resolve | reject | notify ]
			deferred[ tuple[0] ] = function() {
				deferred[ tuple[0] + "With" ]( this === deferred ? promise : this, arguments );
				return this;
			};
			deferred[ tuple[0] + "With" ] = list.fireWith;
		});

		// Make the deferred a promise
		promise.promise( deferred );

		// Call given func if any
		if ( func ) {
			func.call( deferred, deferred );
		}

		// All done!
		return deferred;
	},

	// Deferred helper
	when: function( subordinate /* , ..., subordinateN */ ) {
		var i = 0,
			resolveValues = slice.call( arguments ),
			length = resolveValues.length,

			// the count of uncompleted subordinates
			remaining = length !== 1 || ( subordinate && jQuery.isFunction( subordinate.promise ) ) ? length : 0,

			// the master Deferred. If resolveValues consist of only a single Deferred, just use that.
			deferred = remaining === 1 ? subordinate : jQuery.Deferred(),

			// Update function for both resolve and progress values
			updateFunc = function( i, contexts, values ) {
				return function( value ) {
					contexts[ i ] = this;
					values[ i ] = arguments.length > 1 ? slice.call( arguments ) : value;
					if ( values === progressValues ) {
						deferred.notifyWith( contexts, values );
					} else if ( !( --remaining ) ) {
						deferred.resolveWith( contexts, values );
					}
				};
			},

			progressValues, progressContexts, resolveContexts;

		// Add listeners to Deferred subordinates; treat others as resolved
		if ( length > 1 ) {
			progressValues = new Array( length );
			progressContexts = new Array( length );
			resolveContexts = new Array( length );
			for ( ; i < length; i++ ) {
				if ( resolveValues[ i ] && jQuery.isFunction( resolveValues[ i ].promise ) ) {
					resolveValues[ i ].promise()
						.done( updateFunc( i, resolveContexts, resolveValues ) )
						.fail( deferred.reject )
						.progress( updateFunc( i, progressContexts, progressValues ) );
				} else {
					--remaining;
				}
			}
		}

		// If we're not waiting on anything, resolve the master
		if ( !remaining ) {
			deferred.resolveWith( resolveContexts, resolveValues );
		}

		return deferred.promise();
	}
});


// The deferred used on DOM ready
var readyList;

jQuery.fn.ready = function( fn ) {
	// Add the callback
	jQuery.ready.promise().done( fn );

	return this;
};

jQuery.extend({
	// Is the DOM ready to be used? Set to true once it occurs.
	isReady: false,

	// A counter to track how many items to wait for before
	// the ready event fires. See #6781
	readyWait: 1,

	// Hold (or release) the ready event
	holdReady: function( hold ) {
		if ( hold ) {
			jQuery.readyWait++;
		} else {
			jQuery.ready( true );
		}
	},

	// Handle when the DOM is ready
	ready: function( wait ) {

		// Abort if there are pending holds or we're already ready
		if ( wait === true ? --jQuery.readyWait : jQuery.isReady ) {
			return;
		}

		// Remember that the DOM is ready
		jQuery.isReady = true;

		// If a normal DOM Ready event fired, decrement, and wait if need be
		if ( wait !== true && --jQuery.readyWait > 0 ) {
			return;
		}

		// If there are functions bound, to execute
		readyList.resolveWith( document, [ jQuery ] );

		// Trigger any bound ready events
		if ( jQuery.fn.triggerHandler ) {
			jQuery( document ).triggerHandler( "ready" );
			jQuery( document ).off( "ready" );
		}
	}
});

/**
 * The ready event handler and self cleanup method
 */
function completed() {
	document.removeEventListener( "DOMContentLoaded", completed, false );
	window.removeEventListener( "load", completed, false );
	jQuery.ready();
}

jQuery.ready.promise = function( obj ) {
	if ( !readyList ) {

		readyList = jQuery.Deferred();

		// Catch cases where $(document).ready() is called after the browser event has already occurred.
		// We once tried to use readyState "interactive" here, but it caused issues like the one
		// discovered by ChrisS here: http://bugs.jquery.com/ticket/12282#comment:15
		if ( document.readyState === "complete" ) {
			// Handle it asynchronously to allow scripts the opportunity to delay ready
			setTimeout( jQuery.ready );

		} else {

			// Use the handy event callback
			document.addEventListener( "DOMContentLoaded", completed, false );

			// A fallback to window.onload, that will always work
			window.addEventListener( "load", completed, false );
		}
	}
	return readyList.promise( obj );
};

// Kick off the DOM ready check even if the user does not
jQuery.ready.promise();




// Multifunctional method to get and set values of a collection
// The value/s can optionally be executed if it's a function
var access = jQuery.access = function( elems, fn, key, value, chainable, emptyGet, raw ) {
	var i = 0,
		len = elems.length,
		bulk = key == null;

	// Sets many values
	if ( jQuery.type( key ) === "object" ) {
		chainable = true;
		for ( i in key ) {
			jQuery.access( elems, fn, i, key[i], true, emptyGet, raw );
		}

	// Sets one value
	} else if ( value !== undefined ) {
		chainable = true;

		if ( !jQuery.isFunction( value ) ) {
			raw = true;
		}

		if ( bulk ) {
			// Bulk operations run against the entire set
			if ( raw ) {
				fn.call( elems, value );
				fn = null;

			// ...except when executing function values
			} else {
				bulk = fn;
				fn = function( elem, key, value ) {
					return bulk.call( jQuery( elem ), value );
				};
			}
		}

		if ( fn ) {
			for ( ; i < len; i++ ) {
				fn( elems[i], key, raw ? value : value.call( elems[i], i, fn( elems[i], key ) ) );
			}
		}
	}

	return chainable ?
		elems :

		// Gets
		bulk ?
			fn.call( elems ) :
			len ? fn( elems[0], key ) : emptyGet;
};


/**
 * Determines whether an object can have data
 */
jQuery.acceptData = function( owner ) {
	// Accepts only:
	//  - Node
	//    - Node.ELEMENT_NODE
	//    - Node.DOCUMENT_NODE
	//  - Object
	//    - Any
	/* jshint -W018 */
	return owner.nodeType === 1 || owner.nodeType === 9 || !( +owner.nodeType );
};


function Data() {
	// Support: Android<4,
	// Old WebKit does not have Object.preventExtensions/freeze method,
	// return new empty object instead with no [[set]] accessor
	Object.defineProperty( this.cache = {}, 0, {
		get: function() {
			return {};
		}
	});

	this.expando = jQuery.expando + Data.uid++;
}

Data.uid = 1;
Data.accepts = jQuery.acceptData;

Data.prototype = {
	key: function( owner ) {
		// We can accept data for non-element nodes in modern browsers,
		// but we should not, see #8335.
		// Always return the key for a frozen object.
		if ( !Data.accepts( owner ) ) {
			return 0;
		}

		var descriptor = {},
			// Check if the owner object already has a cache key
			unlock = owner[ this.expando ];

		// If not, create one
		if ( !unlock ) {
			unlock = Data.uid++;

			// Secure it in a non-enumerable, non-writable property
			try {
				descriptor[ this.expando ] = { value: unlock };
				Object.defineProperties( owner, descriptor );

			// Support: Android<4
			// Fallback to a less secure definition
			} catch ( e ) {
				descriptor[ this.expando ] = unlock;
				jQuery.extend( owner, descriptor );
			}
		}

		// Ensure the cache object
		if ( !this.cache[ unlock ] ) {
			this.cache[ unlock ] = {};
		}

		return unlock;
	},
	set: function( owner, data, value ) {
		var prop,
			// There may be an unlock assigned to this node,
			// if there is no entry for this "owner", create one inline
			// and set the unlock as though an owner entry had always existed
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		// Handle: [ owner, key, value ] args
		if ( typeof data === "string" ) {
			cache[ data ] = value;

		// Handle: [ owner, { properties } ] args
		} else {
			// Fresh assignments by object are shallow copied
			if ( jQuery.isEmptyObject( cache ) ) {
				jQuery.extend( this.cache[ unlock ], data );
			// Otherwise, copy the properties one-by-one to the cache object
			} else {
				for ( prop in data ) {
					cache[ prop ] = data[ prop ];
				}
			}
		}
		return cache;
	},
	get: function( owner, key ) {
		// Either a valid cache is found, or will be created.
		// New caches will be created and the unlock returned,
		// allowing direct access to the newly created
		// empty data object. A valid owner object must be provided.
		var cache = this.cache[ this.key( owner ) ];

		return key === undefined ?
			cache : cache[ key ];
	},
	access: function( owner, key, value ) {
		var stored;
		// In cases where either:
		//
		//   1. No key was specified
		//   2. A string key was specified, but no value provided
		//
		// Take the "read" path and allow the get method to determine
		// which value to return, respectively either:
		//
		//   1. The entire cache object
		//   2. The data stored at the key
		//
		if ( key === undefined ||
				((key && typeof key === "string") && value === undefined) ) {

			stored = this.get( owner, key );

			return stored !== undefined ?
				stored : this.get( owner, jQuery.camelCase(key) );
		}

		// [*]When the key is not a string, or both a key and value
		// are specified, set or extend (existing objects) with either:
		//
		//   1. An object of properties
		//   2. A key and value
		//
		this.set( owner, key, value );

		// Since the "set" path can have two possible entry points
		// return the expected data based on which path was taken[*]
		return value !== undefined ? value : key;
	},
	remove: function( owner, key ) {
		var i, name, camel,
			unlock = this.key( owner ),
			cache = this.cache[ unlock ];

		if ( key === undefined ) {
			this.cache[ unlock ] = {};

		} else {
			// Support array or space separated string of keys
			if ( jQuery.isArray( key ) ) {
				// If "name" is an array of keys...
				// When data is initially created, via ("key", "val") signature,
				// keys will be converted to camelCase.
				// Since there is no way to tell _how_ a key was added, remove
				// both plain key and camelCase key. #12786
				// This will only penalize the array argument path.
				name = key.concat( key.map( jQuery.camelCase ) );
			} else {
				camel = jQuery.camelCase( key );
				// Try the string as a key before any manipulation
				if ( key in cache ) {
					name = [ key, camel ];
				} else {
					// If a key with the spaces exists, use it.
					// Otherwise, create an array by matching non-whitespace
					name = camel;
					name = name in cache ?
						[ name ] : ( name.match( rnotwhite ) || [] );
				}
			}

			i = name.length;
			while ( i-- ) {
				delete cache[ name[ i ] ];
			}
		}
	},
	hasData: function( owner ) {
		return !jQuery.isEmptyObject(
			this.cache[ owner[ this.expando ] ] || {}
		);
	},
	discard: function( owner ) {
		if ( owner[ this.expando ] ) {
			delete this.cache[ owner[ this.expando ] ];
		}
	}
};
var data_priv = new Data();

var data_user = new Data();



//	Implementation Summary
//
//	1. Enforce API surface and semantic compatibility with 1.9.x branch
//	2. Improve the module's maintainability by reducing the storage
//		paths to a single mechanism.
//	3. Use the same single mechanism to support "private" and "user" data.
//	4. _Never_ expose "private" data to user code (TODO: Drop _data, _removeData)
//	5. Avoid exposing implementation details on user objects (eg. expando properties)
//	6. Provide a clear path for implementation upgrade to WeakMap in 2014

var rbrace = /^(?:\{[\w\W]*\}|\[[\w\W]*\])$/,
	rmultiDash = /([A-Z])/g;

function dataAttr( elem, key, data ) {
	var name;

	// If nothing was found internally, try to fetch any
	// data from the HTML5 data-* attribute
	if ( data === undefined && elem.nodeType === 1 ) {
		name = "data-" + key.replace( rmultiDash, "-$1" ).toLowerCase();
		data = elem.getAttribute( name );

		if ( typeof data === "string" ) {
			try {
				data = data === "true" ? true :
					data === "false" ? false :
					data === "null" ? null :
					// Only convert to a number if it doesn't change the string
					+data + "" === data ? +data :
					rbrace.test( data ) ? jQuery.parseJSON( data ) :
					data;
			} catch( e ) {}

			// Make sure we set the data so it isn't changed later
			data_user.set( elem, key, data );
		} else {
			data = undefined;
		}
	}
	return data;
}

jQuery.extend({
	hasData: function( elem ) {
		return data_user.hasData( elem ) || data_priv.hasData( elem );
	},

	data: function( elem, name, data ) {
		return data_user.access( elem, name, data );
	},

	removeData: function( elem, name ) {
		data_user.remove( elem, name );
	},

	// TODO: Now that all calls to _data and _removeData have been replaced
	// with direct calls to data_priv methods, these can be deprecated.
	_data: function( elem, name, data ) {
		return data_priv.access( elem, name, data );
	},

	_removeData: function( elem, name ) {
		data_priv.remove( elem, name );
	}
});

jQuery.fn.extend({
	data: function( key, value ) {
		var i, name, data,
			elem = this[ 0 ],
			attrs = elem && elem.attributes;

		// Gets all values
		if ( key === undefined ) {
			if ( this.length ) {
				data = data_user.get( elem );

				if ( elem.nodeType === 1 && !data_priv.get( elem, "hasDataAttrs" ) ) {
					i = attrs.length;
					while ( i-- ) {

						// Support: IE11+
						// The attrs elements can be null (#14894)
						if ( attrs[ i ] ) {
							name = attrs[ i ].name;
							if ( name.indexOf( "data-" ) === 0 ) {
								name = jQuery.camelCase( name.slice(5) );
								dataAttr( elem, name, data[ name ] );
							}
						}
					}
					data_priv.set( elem, "hasDataAttrs", true );
				}
			}

			return data;
		}

		// Sets multiple values
		if ( typeof key === "object" ) {
			return this.each(function() {
				data_user.set( this, key );
			});
		}

		return access( this, function( value ) {
			var data,
				camelKey = jQuery.camelCase( key );

			// The calling jQuery object (element matches) is not empty
			// (and therefore has an element appears at this[ 0 ]) and the
			// `value` parameter was not undefined. An empty jQuery object
			// will result in `undefined` for elem = this[ 0 ] which will
			// throw an exception if an attempt to read a data cache is made.
			if ( elem && value === undefined ) {
				// Attempt to get data from the cache
				// with the key as-is
				data = data_user.get( elem, key );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to get data from the cache
				// with the key camelized
				data = data_user.get( elem, camelKey );
				if ( data !== undefined ) {
					return data;
				}

				// Attempt to "discover" the data in
				// HTML5 custom data-* attrs
				data = dataAttr( elem, camelKey, undefined );
				if ( data !== undefined ) {
					return data;
				}

				// We tried really hard, but the data doesn't exist.
				return;
			}

			// Set the data...
			this.each(function() {
				// First, attempt to store a copy or reference of any
				// data that might've been store with a camelCased key.
				var data = data_user.get( this, camelKey );

				// For HTML5 data-* attribute interop, we have to
				// store property names with dashes in a camelCase form.
				// This might not apply to all properties...*
				data_user.set( this, camelKey, value );

				// *... In the case of properties that might _actually_
				// have dashes, we need to also store a copy of that
				// unchanged property.
				if ( key.indexOf("-") !== -1 && data !== undefined ) {
					data_user.set( this, key, value );
				}
			});
		}, null, value, arguments.length > 1, null, true );
	},

	removeData: function( key ) {
		return this.each(function() {
			data_user.remove( this, key );
		});
	}
});


jQuery.extend({
	queue: function( elem, type, data ) {
		var queue;

		if ( elem ) {
			type = ( type || "fx" ) + "queue";
			queue = data_priv.get( elem, type );

			// Speed up dequeue by getting out quickly if this is just a lookup
			if ( data ) {
				if ( !queue || jQuery.isArray( data ) ) {
					queue = data_priv.access( elem, type, jQuery.makeArray(data) );
				} else {
					queue.push( data );
				}
			}
			return queue || [];
		}
	},

	dequeue: function( elem, type ) {
		type = type || "fx";

		var queue = jQuery.queue( elem, type ),
			startLength = queue.length,
			fn = queue.shift(),
			hooks = jQuery._queueHooks( elem, type ),
			next = function() {
				jQuery.dequeue( elem, type );
			};

		// If the fx queue is dequeued, always remove the progress sentinel
		if ( fn === "inprogress" ) {
			fn = queue.shift();
			startLength--;
		}

		if ( fn ) {

			// Add a progress sentinel to prevent the fx queue from being
			// automatically dequeued
			if ( type === "fx" ) {
				queue.unshift( "inprogress" );
			}

			// Clear up the last queue stop function
			delete hooks.stop;
			fn.call( elem, next, hooks );
		}

		if ( !startLength && hooks ) {
			hooks.empty.fire();
		}
	},

	// Not public - generate a queueHooks object, or return the current one
	_queueHooks: function( elem, type ) {
		var key = type + "queueHooks";
		return data_priv.get( elem, key ) || data_priv.access( elem, key, {
			empty: jQuery.Callbacks("once memory").add(function() {
				data_priv.remove( elem, [ type + "queue", key ] );
			})
		});
	}
});

jQuery.fn.extend({
	queue: function( type, data ) {
		var setter = 2;

		if ( typeof type !== "string" ) {
			data = type;
			type = "fx";
			setter--;
		}

		if ( arguments.length < setter ) {
			return jQuery.queue( this[0], type );
		}

		return data === undefined ?
			this :
			this.each(function() {
				var queue = jQuery.queue( this, type, data );

				// Ensure a hooks for this queue
				jQuery._queueHooks( this, type );

				if ( type === "fx" && queue[0] !== "inprogress" ) {
					jQuery.dequeue( this, type );
				}
			});
	},
	dequeue: function( type ) {
		return this.each(function() {
			jQuery.dequeue( this, type );
		});
	},
	clearQueue: function( type ) {
		return this.queue( type || "fx", [] );
	},
	// Get a promise resolved when queues of a certain type
	// are emptied (fx is the type by default)
	promise: function( type, obj ) {
		var tmp,
			count = 1,
			defer = jQuery.Deferred(),
			elements = this,
			i = this.length,
			resolve = function() {
				if ( !( --count ) ) {
					defer.resolveWith( elements, [ elements ] );
				}
			};

		if ( typeof type !== "string" ) {
			obj = type;
			type = undefined;
		}
		type = type || "fx";

		while ( i-- ) {
			tmp = data_priv.get( elements[ i ], type + "queueHooks" );
			if ( tmp && tmp.empty ) {
				count++;
				tmp.empty.add( resolve );
			}
		}
		resolve();
		return defer.promise( obj );
	}
});
var pnum = (/[+-]?(?:\d*\.|)\d+(?:[eE][+-]?\d+|)/).source;

var cssExpand = [ "Top", "Right", "Bottom", "Left" ];

var isHidden = function( elem, el ) {
		// isHidden might be called from jQuery#filter function;
		// in that case, element will be second argument
		elem = el || elem;
		return jQuery.css( elem, "display" ) === "none" || !jQuery.contains( elem.ownerDocument, elem );
	};

var rcheckableType = (/^(?:checkbox|radio)$/i);



(function() {
	var fragment = document.createDocumentFragment(),
		div = fragment.appendChild( document.createElement( "div" ) ),
		input = document.createElement( "input" );

	// Support: Safari<=5.1
	// Check state lost if the name is set (#11217)
	// Support: Windows Web Apps (WWA)
	// `name` and `type` must use .setAttribute for WWA (#14901)
	input.setAttribute( "type", "radio" );
	input.setAttribute( "checked", "checked" );
	input.setAttribute( "name", "t" );

	div.appendChild( input );

	// Support: Safari<=5.1, Android<4.2
	// Older WebKit doesn't clone checked state correctly in fragments
	support.checkClone = div.cloneNode( true ).cloneNode( true ).lastChild.checked;

	// Support: IE<=11+
	// Make sure textarea (and checkbox) defaultValue is properly cloned
	div.innerHTML = "<textarea>x</textarea>";
	support.noCloneChecked = !!div.cloneNode( true ).lastChild.defaultValue;
})();
var strundefined = typeof undefined;



support.focusinBubbles = "onfocusin" in window;


var
	rkeyEvent = /^key/,
	rmouseEvent = /^(?:mouse|pointer|contextmenu)|click/,
	rfocusMorph = /^(?:focusinfocus|focusoutblur)$/,
	rtypenamespace = /^([^.]*)(?:\.(.+)|)$/;

function returnTrue() {
	return true;
}

function returnFalse() {
	return false;
}

function safeActiveElement() {
	try {
		return document.activeElement;
	} catch ( err ) { }
}

/*
 * Helper functions for managing events -- not part of the public interface.
 * Props to Dean Edwards' addEvent library for many of the ideas.
 */
jQuery.event = {

	global: {},

	add: function( elem, types, handler, data, selector ) {

		var handleObjIn, eventHandle, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.get( elem );

		// Don't attach events to noData or text/comment nodes (but allow plain objects)
		if ( !elemData ) {
			return;
		}

		// Caller can pass in an object of custom data in lieu of the handler
		if ( handler.handler ) {
			handleObjIn = handler;
			handler = handleObjIn.handler;
			selector = handleObjIn.selector;
		}

		// Make sure that the handler has a unique ID, used to find/remove it later
		if ( !handler.guid ) {
			handler.guid = jQuery.guid++;
		}

		// Init the element's event structure and main handler, if this is the first
		if ( !(events = elemData.events) ) {
			events = elemData.events = {};
		}
		if ( !(eventHandle = elemData.handle) ) {
			eventHandle = elemData.handle = function( e ) {
				// Discard the second event of a jQuery.event.trigger() and
				// when an event is called after a page has unloaded
				return typeof jQuery !== strundefined && jQuery.event.triggered !== e.type ?
					jQuery.event.dispatch.apply( elem, arguments ) : undefined;
			};
		}

		// Handle multiple events separated by a space
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// There *must* be a type, no attaching namespace-only handlers
			if ( !type ) {
				continue;
			}

			// If event changes its type, use the special event handlers for the changed type
			special = jQuery.event.special[ type ] || {};

			// If selector defined, determine special event api type, otherwise given type
			type = ( selector ? special.delegateType : special.bindType ) || type;

			// Update special based on newly reset type
			special = jQuery.event.special[ type ] || {};

			// handleObj is passed to all event handlers
			handleObj = jQuery.extend({
				type: type,
				origType: origType,
				data: data,
				handler: handler,
				guid: handler.guid,
				selector: selector,
				needsContext: selector && jQuery.expr.match.needsContext.test( selector ),
				namespace: namespaces.join(".")
			}, handleObjIn );

			// Init the event handler queue if we're the first
			if ( !(handlers = events[ type ]) ) {
				handlers = events[ type ] = [];
				handlers.delegateCount = 0;

				// Only use addEventListener if the special events handler returns false
				if ( !special.setup || special.setup.call( elem, data, namespaces, eventHandle ) === false ) {
					if ( elem.addEventListener ) {
						elem.addEventListener( type, eventHandle, false );
					}
				}
			}

			if ( special.add ) {
				special.add.call( elem, handleObj );

				if ( !handleObj.handler.guid ) {
					handleObj.handler.guid = handler.guid;
				}
			}

			// Add to the element's handler list, delegates in front
			if ( selector ) {
				handlers.splice( handlers.delegateCount++, 0, handleObj );
			} else {
				handlers.push( handleObj );
			}

			// Keep track of which events have ever been used, for event optimization
			jQuery.event.global[ type ] = true;
		}

	},

	// Detach an event or set of events from an element
	remove: function( elem, types, handler, selector, mappedTypes ) {

		var j, origCount, tmp,
			events, t, handleObj,
			special, handlers, type, namespaces, origType,
			elemData = data_priv.hasData( elem ) && data_priv.get( elem );

		if ( !elemData || !(events = elemData.events) ) {
			return;
		}

		// Once for each type.namespace in types; type may be omitted
		types = ( types || "" ).match( rnotwhite ) || [ "" ];
		t = types.length;
		while ( t-- ) {
			tmp = rtypenamespace.exec( types[t] ) || [];
			type = origType = tmp[1];
			namespaces = ( tmp[2] || "" ).split( "." ).sort();

			// Unbind all events (on this namespace, if provided) for the element
			if ( !type ) {
				for ( type in events ) {
					jQuery.event.remove( elem, type + types[ t ], handler, selector, true );
				}
				continue;
			}

			special = jQuery.event.special[ type ] || {};
			type = ( selector ? special.delegateType : special.bindType ) || type;
			handlers = events[ type ] || [];
			tmp = tmp[2] && new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" );

			// Remove matching events
			origCount = j = handlers.length;
			while ( j-- ) {
				handleObj = handlers[ j ];

				if ( ( mappedTypes || origType === handleObj.origType ) &&
					( !handler || handler.guid === handleObj.guid ) &&
					( !tmp || tmp.test( handleObj.namespace ) ) &&
					( !selector || selector === handleObj.selector || selector === "**" && handleObj.selector ) ) {
					handlers.splice( j, 1 );

					if ( handleObj.selector ) {
						handlers.delegateCount--;
					}
					if ( special.remove ) {
						special.remove.call( elem, handleObj );
					}
				}
			}

			// Remove generic event handler if we removed something and no more handlers exist
			// (avoids potential for endless recursion during removal of special event handlers)
			if ( origCount && !handlers.length ) {
				if ( !special.teardown || special.teardown.call( elem, namespaces, elemData.handle ) === false ) {
					jQuery.removeEvent( elem, type, elemData.handle );
				}

				delete events[ type ];
			}
		}

		// Remove the expando if it's no longer used
		if ( jQuery.isEmptyObject( events ) ) {
			delete elemData.handle;
			data_priv.remove( elem, "events" );
		}
	},

	trigger: function( event, data, elem, onlyHandlers ) {

		var i, cur, tmp, bubbleType, ontype, handle, special,
			eventPath = [ elem || document ],
			type = hasOwn.call( event, "type" ) ? event.type : event,
			namespaces = hasOwn.call( event, "namespace" ) ? event.namespace.split(".") : [];

		cur = tmp = elem = elem || document;

		// Don't do events on text and comment nodes
		if ( elem.nodeType === 3 || elem.nodeType === 8 ) {
			return;
		}

		// focus/blur morphs to focusin/out; ensure we're not firing them right now
		if ( rfocusMorph.test( type + jQuery.event.triggered ) ) {
			return;
		}

		if ( type.indexOf(".") >= 0 ) {
			// Namespaced trigger; create a regexp to match event type in handle()
			namespaces = type.split(".");
			type = namespaces.shift();
			namespaces.sort();
		}
		ontype = type.indexOf(":") < 0 && "on" + type;

		// Caller can pass in a jQuery.Event object, Object, or just an event type string
		event = event[ jQuery.expando ] ?
			event :
			new jQuery.Event( type, typeof event === "object" && event );

		// Trigger bitmask: & 1 for native handlers; & 2 for jQuery (always true)
		event.isTrigger = onlyHandlers ? 2 : 3;
		event.namespace = namespaces.join(".");
		event.namespace_re = event.namespace ?
			new RegExp( "(^|\\.)" + namespaces.join("\\.(?:.*\\.|)") + "(\\.|$)" ) :
			null;

		// Clean up the event in case it is being reused
		event.result = undefined;
		if ( !event.target ) {
			event.target = elem;
		}

		// Clone any incoming data and prepend the event, creating the handler arg list
		data = data == null ?
			[ event ] :
			jQuery.makeArray( data, [ event ] );

		// Allow special events to draw outside the lines
		special = jQuery.event.special[ type ] || {};
		if ( !onlyHandlers && special.trigger && special.trigger.apply( elem, data ) === false ) {
			return;
		}

		// Determine event propagation path in advance, per W3C events spec (#9951)
		// Bubble up to document, then to window; watch for a global ownerDocument var (#9724)
		if ( !onlyHandlers && !special.noBubble && !jQuery.isWindow( elem ) ) {

			bubbleType = special.delegateType || type;
			if ( !rfocusMorph.test( bubbleType + type ) ) {
				cur = cur.parentNode;
			}
			for ( ; cur; cur = cur.parentNode ) {
				eventPath.push( cur );
				tmp = cur;
			}

			// Only add window if we got to document (e.g., not plain obj or detached DOM)
			if ( tmp === (elem.ownerDocument || document) ) {
				eventPath.push( tmp.defaultView || tmp.parentWindow || window );
			}
		}

		// Fire handlers on the event path
		i = 0;
		while ( (cur = eventPath[i++]) && !event.isPropagationStopped() ) {

			event.type = i > 1 ?
				bubbleType :
				special.bindType || type;

			// jQuery handler
			handle = ( data_priv.get( cur, "events" ) || {} )[ event.type ] && data_priv.get( cur, "handle" );
			if ( handle ) {
				handle.apply( cur, data );
			}

			// Native handler
			handle = ontype && cur[ ontype ];
			if ( handle && handle.apply && jQuery.acceptData( cur ) ) {
				event.result = handle.apply( cur, data );
				if ( event.result === false ) {
					event.preventDefault();
				}
			}
		}
		event.type = type;

		// If nobody prevented the default action, do it now
		if ( !onlyHandlers && !event.isDefaultPrevented() ) {

			if ( (!special._default || special._default.apply( eventPath.pop(), data ) === false) &&
				jQuery.acceptData( elem ) ) {

				// Call a native DOM method on the target with the same name name as the event.
				// Don't do default actions on window, that's where global variables be (#6170)
				if ( ontype && jQuery.isFunction( elem[ type ] ) && !jQuery.isWindow( elem ) ) {

					// Don't re-trigger an onFOO event when we call its FOO() method
					tmp = elem[ ontype ];

					if ( tmp ) {
						elem[ ontype ] = null;
					}

					// Prevent re-triggering of the same event, since we already bubbled it above
					jQuery.event.triggered = type;
					elem[ type ]();
					jQuery.event.triggered = undefined;

					if ( tmp ) {
						elem[ ontype ] = tmp;
					}
				}
			}
		}

		return event.result;
	},

	dispatch: function( event ) {

		// Make a writable jQuery.Event from the native event object
		event = jQuery.event.fix( event );

		var i, j, ret, matched, handleObj,
			handlerQueue = [],
			args = slice.call( arguments ),
			handlers = ( data_priv.get( this, "events" ) || {} )[ event.type ] || [],
			special = jQuery.event.special[ event.type ] || {};

		// Use the fix-ed jQuery.Event rather than the (read-only) native event
		args[0] = event;
		event.delegateTarget = this;

		// Call the preDispatch hook for the mapped type, and let it bail if desired
		if ( special.preDispatch && special.preDispatch.call( this, event ) === false ) {
			return;
		}

		// Determine handlers
		handlerQueue = jQuery.event.handlers.call( this, event, handlers );

		// Run delegates first; they may want to stop propagation beneath us
		i = 0;
		while ( (matched = handlerQueue[ i++ ]) && !event.isPropagationStopped() ) {
			event.currentTarget = matched.elem;

			j = 0;
			while ( (handleObj = matched.handlers[ j++ ]) && !event.isImmediatePropagationStopped() ) {

				// Triggered event must either 1) have no namespace, or 2) have namespace(s)
				// a subset or equal to those in the bound event (both can have no namespace).
				if ( !event.namespace_re || event.namespace_re.test( handleObj.namespace ) ) {

					event.handleObj = handleObj;
					event.data = handleObj.data;

					ret = ( (jQuery.event.special[ handleObj.origType ] || {}).handle || handleObj.handler )
							.apply( matched.elem, args );

					if ( ret !== undefined ) {
						if ( (event.result = ret) === false ) {
							event.preventDefault();
							event.stopPropagation();
						}
					}
				}
			}
		}

		// Call the postDispatch hook for the mapped type
		if ( special.postDispatch ) {
			special.postDispatch.call( this, event );
		}

		return event.result;
	},

	handlers: function( event, handlers ) {
		var i, matches, sel, handleObj,
			handlerQueue = [],
			delegateCount = handlers.delegateCount,
			cur = event.target;

		// Find delegate handlers
		// Black-hole SVG <use> instance trees (#13180)
		// Avoid non-left-click bubbling in Firefox (#3861)
		if ( delegateCount && cur.nodeType && (!event.button || event.type !== "click") ) {

			for ( ; cur !== this; cur = cur.parentNode || this ) {

				// Don't process clicks on disabled elements (#6911, #8165, #11382, #11764)
				if ( cur.disabled !== true || event.type !== "click" ) {
					matches = [];
					for ( i = 0; i < delegateCount; i++ ) {
						handleObj = handlers[ i ];

						// Don't conflict with Object.prototype properties (#13203)
						sel = handleObj.selector + " ";

						if ( matches[ sel ] === undefined ) {
							matches[ sel ] = handleObj.needsContext ?
								jQuery( sel, this ).index( cur ) >= 0 :
								jQuery.find( sel, this, null, [ cur ] ).length;
						}
						if ( matches[ sel ] ) {
							matches.push( handleObj );
						}
					}
					if ( matches.length ) {
						handlerQueue.push({ elem: cur, handlers: matches });
					}
				}
			}
		}

		// Add the remaining (directly-bound) handlers
		if ( delegateCount < handlers.length ) {
			handlerQueue.push({ elem: this, handlers: handlers.slice( delegateCount ) });
		}

		return handlerQueue;
	},

	// Includes some event props shared by KeyEvent and MouseEvent
	props: "altKey bubbles cancelable ctrlKey currentTarget eventPhase metaKey relatedTarget shiftKey target timeStamp view which".split(" "),

	fixHooks: {},

	keyHooks: {
		props: "char charCode key keyCode".split(" "),
		filter: function( event, original ) {

			// Add which for key events
			if ( event.which == null ) {
				event.which = original.charCode != null ? original.charCode : original.keyCode;
			}

			return event;
		}
	},

	mouseHooks: {
		props: "button buttons clientX clientY offsetX offsetY pageX pageY screenX screenY toElement".split(" "),
		filter: function( event, original ) {
			var eventDoc, doc, body,
				button = original.button;

			// Calculate pageX/Y if missing and clientX/Y available
			if ( event.pageX == null && original.clientX != null ) {
				eventDoc = event.target.ownerDocument || document;
				doc = eventDoc.documentElement;
				body = eventDoc.body;

				event.pageX = original.clientX + ( doc && doc.scrollLeft || body && body.scrollLeft || 0 ) - ( doc && doc.clientLeft || body && body.clientLeft || 0 );
				event.pageY = original.clientY + ( doc && doc.scrollTop  || body && body.scrollTop  || 0 ) - ( doc && doc.clientTop  || body && body.clientTop  || 0 );
			}

			// Add which for click: 1 === left; 2 === middle; 3 === right
			// Note: button is not normalized, so don't use it
			if ( !event.which && button !== undefined ) {
				event.which = ( button & 1 ? 1 : ( button & 2 ? 3 : ( button & 4 ? 2 : 0 ) ) );
			}

			return event;
		}
	},

	fix: function( event ) {
		if ( event[ jQuery.expando ] ) {
			return event;
		}

		// Create a writable copy of the event object and normalize some properties
		var i, prop, copy,
			type = event.type,
			originalEvent = event,
			fixHook = this.fixHooks[ type ];

		if ( !fixHook ) {
			this.fixHooks[ type ] = fixHook =
				rmouseEvent.test( type ) ? this.mouseHooks :
				rkeyEvent.test( type ) ? this.keyHooks :
				{};
		}
		copy = fixHook.props ? this.props.concat( fixHook.props ) : this.props;

		event = new jQuery.Event( originalEvent );

		i = copy.length;
		while ( i-- ) {
			prop = copy[ i ];
			event[ prop ] = originalEvent[ prop ];
		}

		// Support: Cordova 2.5 (WebKit) (#13255)
		// All events should have a target; Cordova deviceready doesn't
		if ( !event.target ) {
			event.target = document;
		}

		// Support: Safari 6.0+, Chrome<28
		// Target should not be a text node (#504, #13143)
		if ( event.target.nodeType === 3 ) {
			event.target = event.target.parentNode;
		}

		return fixHook.filter ? fixHook.filter( event, originalEvent ) : event;
	},

	special: {
		load: {
			// Prevent triggered image.load events from bubbling to window.load
			noBubble: true
		},
		focus: {
			// Fire native event if possible so blur/focus sequence is correct
			trigger: function() {
				if ( this !== safeActiveElement() && this.focus ) {
					this.focus();
					return false;
				}
			},
			delegateType: "focusin"
		},
		blur: {
			trigger: function() {
				if ( this === safeActiveElement() && this.blur ) {
					this.blur();
					return false;
				}
			},
			delegateType: "focusout"
		},
		click: {
			// For checkbox, fire native event so checked state will be right
			trigger: function() {
				if ( this.type === "checkbox" && this.click && jQuery.nodeName( this, "input" ) ) {
					this.click();
					return false;
				}
			},

			// For cross-browser consistency, don't fire native .click() on links
			_default: function( event ) {
				return jQuery.nodeName( event.target, "a" );
			}
		},

		beforeunload: {
			postDispatch: function( event ) {

				// Support: Firefox 20+
				// Firefox doesn't alert if the returnValue field is not set.
				if ( event.result !== undefined && event.originalEvent ) {
					event.originalEvent.returnValue = event.result;
				}
			}
		}
	},

	simulate: function( type, elem, event, bubble ) {
		// Piggyback on a donor event to simulate a different one.
		// Fake originalEvent to avoid donor's stopPropagation, but if the
		// simulated event prevents default then we do the same on the donor.
		var e = jQuery.extend(
			new jQuery.Event(),
			event,
			{
				type: type,
				isSimulated: true,
				originalEvent: {}
			}
		);
		if ( bubble ) {
			jQuery.event.trigger( e, null, elem );
		} else {
			jQuery.event.dispatch.call( elem, e );
		}
		if ( e.isDefaultPrevented() ) {
			event.preventDefault();
		}
	}
};

jQuery.removeEvent = function( elem, type, handle ) {
	if ( elem.removeEventListener ) {
		elem.removeEventListener( type, handle, false );
	}
};

jQuery.Event = function( src, props ) {
	// Allow instantiation without the 'new' keyword
	if ( !(this instanceof jQuery.Event) ) {
		return new jQuery.Event( src, props );
	}

	// Event object
	if ( src && src.type ) {
		this.originalEvent = src;
		this.type = src.type;

		// Events bubbling up the document may have been marked as prevented
		// by a handler lower down the tree; reflect the correct value.
		this.isDefaultPrevented = src.defaultPrevented ||
				src.defaultPrevented === undefined &&
				// Support: Android<4.0
				src.returnValue === false ?
			returnTrue :
			returnFalse;

	// Event type
	} else {
		this.type = src;
	}

	// Put explicitly provided properties onto the event object
	if ( props ) {
		jQuery.extend( this, props );
	}

	// Create a timestamp if incoming event doesn't have one
	this.timeStamp = src && src.timeStamp || jQuery.now();

	// Mark it as fixed
	this[ jQuery.expando ] = true;
};

// jQuery.Event is based on DOM3 Events as specified by the ECMAScript Language Binding
// http://www.w3.org/TR/2003/WD-DOM-Level-3-Events-20030331/ecma-script-binding.html
jQuery.Event.prototype = {
	isDefaultPrevented: returnFalse,
	isPropagationStopped: returnFalse,
	isImmediatePropagationStopped: returnFalse,

	preventDefault: function() {
		var e = this.originalEvent;

		this.isDefaultPrevented = returnTrue;

		if ( e && e.preventDefault ) {
			e.preventDefault();
		}
	},
	stopPropagation: function() {
		var e = this.originalEvent;

		this.isPropagationStopped = returnTrue;

		if ( e && e.stopPropagation ) {
			e.stopPropagation();
		}
	},
	stopImmediatePropagation: function() {
		var e = this.originalEvent;

		this.isImmediatePropagationStopped = returnTrue;

		if ( e && e.stopImmediatePropagation ) {
			e.stopImmediatePropagation();
		}

		this.stopPropagation();
	}
};

// Create mouseenter/leave events using mouseover/out and event-time checks
// Support: Chrome 15+
jQuery.each({
	mouseenter: "mouseover",
	mouseleave: "mouseout",
	pointerenter: "pointerover",
	pointerleave: "pointerout"
}, function( orig, fix ) {
	jQuery.event.special[ orig ] = {
		delegateType: fix,
		bindType: fix,

		handle: function( event ) {
			var ret,
				target = this,
				related = event.relatedTarget,
				handleObj = event.handleObj;

			// For mousenter/leave call the handler if related is outside the target.
			// NB: No relatedTarget if the mouse left/entered the browser window
			if ( !related || (related !== target && !jQuery.contains( target, related )) ) {
				event.type = handleObj.origType;
				ret = handleObj.handler.apply( this, arguments );
				event.type = fix;
			}
			return ret;
		}
	};
});

// Support: Firefox, Chrome, Safari
// Create "bubbling" focus and blur events
if ( !support.focusinBubbles ) {
	jQuery.each({ focus: "focusin", blur: "focusout" }, function( orig, fix ) {

		// Attach a single capturing handler on the document while someone wants focusin/focusout
		var handler = function( event ) {
				jQuery.event.simulate( fix, event.target, jQuery.event.fix( event ), true );
			};

		jQuery.event.special[ fix ] = {
			setup: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix );

				if ( !attaches ) {
					doc.addEventListener( orig, handler, true );
				}
				data_priv.access( doc, fix, ( attaches || 0 ) + 1 );
			},
			teardown: function() {
				var doc = this.ownerDocument || this,
					attaches = data_priv.access( doc, fix ) - 1;

				if ( !attaches ) {
					doc.removeEventListener( orig, handler, true );
					data_priv.remove( doc, fix );

				} else {
					data_priv.access( doc, fix, attaches );
				}
			}
		};
	});
}

jQuery.fn.extend({

	on: function( types, selector, data, fn, /*INTERNAL*/ one ) {
		var origFn, type;

		// Types can be a map of types/handlers
		if ( typeof types === "object" ) {
			// ( types-Object, selector, data )
			if ( typeof selector !== "string" ) {
				// ( types-Object, data )
				data = data || selector;
				selector = undefined;
			}
			for ( type in types ) {
				this.on( type, selector, data, types[ type ], one );
			}
			return this;
		}

		if ( data == null && fn == null ) {
			// ( types, fn )
			fn = selector;
			data = selector = undefined;
		} else if ( fn == null ) {
			if ( typeof selector === "string" ) {
				// ( types, selector, fn )
				fn = data;
				data = undefined;
			} else {
				// ( types, data, fn )
				fn = data;
				data = selector;
				selector = undefined;
			}
		}
		if ( fn === false ) {
			fn = returnFalse;
		} else if ( !fn ) {
			return this;
		}

		if ( one === 1 ) {
			origFn = fn;
			fn = function( event ) {
				// Can use an empty set, since event contains the info
				jQuery().off( event );
				return origFn.apply( this, arguments );
			};
			// Use same guid so caller can remove using origFn
			fn.guid = origFn.guid || ( origFn.guid = jQuery.guid++ );
		}
		return this.each( function() {
			jQuery.event.add( this, types, fn, data, selector );
		});
	},
	one: function( types, selector, data, fn ) {
		return this.on( types, selector, data, fn, 1 );
	},
	off: function( types, selector, fn ) {
		var handleObj, type;
		if ( types && types.preventDefault && types.handleObj ) {
			// ( event )  dispatched jQuery.Event
			handleObj = types.handleObj;
			jQuery( types.delegateTarget ).off(
				handleObj.namespace ? handleObj.origType + "." + handleObj.namespace : handleObj.origType,
				handleObj.selector,
				handleObj.handler
			);
			return this;
		}
		if ( typeof types === "object" ) {
			// ( types-object [, selector] )
			for ( type in types ) {
				this.off( type, selector, types[ type ] );
			}
			return this;
		}
		if ( selector === false || typeof selector === "function" ) {
			// ( types [, fn] )
			fn = selector;
			selector = undefined;
		}
		if ( fn === false ) {
			fn = returnFalse;
		}
		return this.each(function() {
			jQuery.event.remove( this, types, fn, selector );
		});
	},

	trigger: function( type, data ) {
		return this.each(function() {
			jQuery.event.trigger( type, data, this );
		});
	},
	triggerHandler: function( type, data ) {
		var elem = this[0];
		if ( elem ) {
			return jQuery.event.trigger( type, data, elem, true );
		}
	}
});


var
	rxhtmlTag = /<(?!area|br|col|embed|hr|img|input|link|meta|param)(([\w:]+)[^>]*)\/>/gi,
	rtagName = /<([\w:]+)/,
	rhtml = /<|&#?\w+;/,
	rnoInnerhtml = /<(?:script|style|link)/i,
	// checked="checked" or checked
	rchecked = /checked\s*(?:[^=]|=\s*.checked.)/i,
	rscriptType = /^$|\/(?:java|ecma)script/i,
	rscriptTypeMasked = /^true\/(.*)/,
	rcleanScript = /^\s*<!(?:\[CDATA\[|--)|(?:\]\]|--)>\s*$/g,

	// We have to close these tags to support XHTML (#13200)
	wrapMap = {

		// Support: IE9
		option: [ 1, "<select multiple='multiple'>", "</select>" ],

		thead: [ 1, "<table>", "</table>" ],
		col: [ 2, "<table><colgroup>", "</colgroup></table>" ],
		tr: [ 2, "<table><tbody>", "</tbody></table>" ],
		td: [ 3, "<table><tbody><tr>", "</tr></tbody></table>" ],

		_default: [ 0, "", "" ]
	};

// Support: IE9
wrapMap.optgroup = wrapMap.option;

wrapMap.tbody = wrapMap.tfoot = wrapMap.colgroup = wrapMap.caption = wrapMap.thead;
wrapMap.th = wrapMap.td;

// Support: 1.x compatibility
// Manipulating tables requires a tbody
function manipulationTarget( elem, content ) {
	return jQuery.nodeName( elem, "table" ) &&
		jQuery.nodeName( content.nodeType !== 11 ? content : content.firstChild, "tr" ) ?

		elem.getElementsByTagName("tbody")[0] ||
			elem.appendChild( elem.ownerDocument.createElement("tbody") ) :
		elem;
}

// Replace/restore the type attribute of script elements for safe DOM manipulation
function disableScript( elem ) {
	elem.type = (elem.getAttribute("type") !== null) + "/" + elem.type;
	return elem;
}
function restoreScript( elem ) {
	var match = rscriptTypeMasked.exec( elem.type );

	if ( match ) {
		elem.type = match[ 1 ];
	} else {
		elem.removeAttribute("type");
	}

	return elem;
}

// Mark scripts as having already been evaluated
function setGlobalEval( elems, refElements ) {
	var i = 0,
		l = elems.length;

	for ( ; i < l; i++ ) {
		data_priv.set(
			elems[ i ], "globalEval", !refElements || data_priv.get( refElements[ i ], "globalEval" )
		);
	}
}

function cloneCopyEvent( src, dest ) {
	var i, l, type, pdataOld, pdataCur, udataOld, udataCur, events;

	if ( dest.nodeType !== 1 ) {
		return;
	}

	// 1. Copy private data: events, handlers, etc.
	if ( data_priv.hasData( src ) ) {
		pdataOld = data_priv.access( src );
		pdataCur = data_priv.set( dest, pdataOld );
		events = pdataOld.events;

		if ( events ) {
			delete pdataCur.handle;
			pdataCur.events = {};

			for ( type in events ) {
				for ( i = 0, l = events[ type ].length; i < l; i++ ) {
					jQuery.event.add( dest, type, events[ type ][ i ] );
				}
			}
		}
	}

	// 2. Copy user data
	if ( data_user.hasData( src ) ) {
		udataOld = data_user.access( src );
		udataCur = jQuery.extend( {}, udataOld );

		data_user.set( dest, udataCur );
	}
}

function getAll( context, tag ) {
	var ret = context.getElementsByTagName ? context.getElementsByTagName( tag || "*" ) :
			context.querySelectorAll ? context.querySelectorAll( tag || "*" ) :
			[];

	return tag === undefined || tag && jQuery.nodeName( context, tag ) ?
		jQuery.merge( [ context ], ret ) :
		ret;
}

// Fix IE bugs, see support tests
function fixInput( src, dest ) {
	var nodeName = dest.nodeName.toLowerCase();

	// Fails to persist the checked state of a cloned checkbox or radio button.
	if ( nodeName === "input" && rcheckableType.test( src.type ) ) {
		dest.checked = src.checked;

	// Fails to return the selected option to the default selected state when cloning options
	} else if ( nodeName === "input" || nodeName === "textarea" ) {
		dest.defaultValue = src.defaultValue;
	}
}

jQuery.extend({
	clone: function( elem, dataAndEvents, deepDataAndEvents ) {
		var i, l, srcElements, destElements,
			clone = elem.cloneNode( true ),
			inPage = jQuery.contains( elem.ownerDocument, elem );

		// Fix IE cloning issues
		if ( !support.noCloneChecked && ( elem.nodeType === 1 || elem.nodeType === 11 ) &&
				!jQuery.isXMLDoc( elem ) ) {

			// We eschew Sizzle here for performance reasons: http://jsperf.com/getall-vs-sizzle/2
			destElements = getAll( clone );
			srcElements = getAll( elem );

			for ( i = 0, l = srcElements.length; i < l; i++ ) {
				fixInput( srcElements[ i ], destElements[ i ] );
			}
		}

		// Copy the events from the original to the clone
		if ( dataAndEvents ) {
			if ( deepDataAndEvents ) {
				srcElements = srcElements || getAll( elem );
				destElements = destElements || getAll( clone );

				for ( i = 0, l = srcElements.length; i < l; i++ ) {
					cloneCopyEvent( srcElements[ i ], destElements[ i ] );
				}
			} else {
				cloneCopyEvent( elem, clone );
			}
		}

		// Preserve script evaluation history
		destElements = getAll( clone, "script" );
		if ( destElements.length > 0 ) {
			setGlobalEval( destElements, !inPage && getAll( elem, "script" ) );
		}

		// Return the cloned set
		return clone;
	},

	buildFragment: function( elems, context, scripts, selection ) {
		var elem, tmp, tag, wrap, contains, j,
			fragment = context.createDocumentFragment(),
			nodes = [],
			i = 0,
			l = elems.length;

		for ( ; i < l; i++ ) {
			elem = elems[ i ];

			if ( elem || elem === 0 ) {

				// Add nodes directly
				if ( jQuery.type( elem ) === "object" ) {
					// Support: QtWebKit, PhantomJS
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, elem.nodeType ? [ elem ] : elem );

				// Convert non-html into a text node
				} else if ( !rhtml.test( elem ) ) {
					nodes.push( context.createTextNode( elem ) );

				// Convert html into DOM nodes
				} else {
					tmp = tmp || fragment.appendChild( context.createElement("div") );

					// Deserialize a standard representation
					tag = ( rtagName.exec( elem ) || [ "", "" ] )[ 1 ].toLowerCase();
					wrap = wrapMap[ tag ] || wrapMap._default;
					tmp.innerHTML = wrap[ 1 ] + elem.replace( rxhtmlTag, "<$1></$2>" ) + wrap[ 2 ];

					// Descend through wrappers to the right content
					j = wrap[ 0 ];
					while ( j-- ) {
						tmp = tmp.lastChild;
					}

					// Support: QtWebKit, PhantomJS
					// push.apply(_, arraylike) throws on ancient WebKit
					jQuery.merge( nodes, tmp.childNodes );

					// Remember the top-level container
					tmp = fragment.firstChild;

					// Ensure the created nodes are orphaned (#12392)
					tmp.textContent = "";
				}
			}
		}

		// Remove wrapper from fragment
		fragment.textContent = "";

		i = 0;
		while ( (elem = nodes[ i++ ]) ) {

			// #4087 - If origin and destination elements are the same, and this is
			// that element, do not do anything
			if ( selection && jQuery.inArray( elem, selection ) !== -1 ) {
				continue;
			}

			contains = jQuery.contains( elem.ownerDocument, elem );

			// Append to fragment
			tmp = getAll( fragment.appendChild( elem ), "script" );

			// Preserve script evaluation history
			if ( contains ) {
				setGlobalEval( tmp );
			}

			// Capture executables
			if ( scripts ) {
				j = 0;
				while ( (elem = tmp[ j++ ]) ) {
					if ( rscriptType.test( elem.type || "" ) ) {
						scripts.push( elem );
					}
				}
			}
		}

		return fragment;
	},

	cleanData: function( elems ) {
		var data, elem, type, key,
			special = jQuery.event.special,
			i = 0;

		for ( ; (elem = elems[ i ]) !== undefined; i++ ) {
			if ( jQuery.acceptData( elem ) ) {
				key = elem[ data_priv.expando ];

				if ( key && (data = data_priv.cache[ key ]) ) {
					if ( data.events ) {
						for ( type in data.events ) {
							if ( special[ type ] ) {
								jQuery.event.remove( elem, type );

							// This is a shortcut to avoid jQuery.event.remove's overhead
							} else {
								jQuery.removeEvent( elem, type, data.handle );
							}
						}
					}
					if ( data_priv.cache[ key ] ) {
						// Discard any remaining `private` data
						delete data_priv.cache[ key ];
					}
				}
			}
			// Discard any remaining `user` data
			delete data_user.cache[ elem[ data_user.expando ] ];
		}
	}
});

jQuery.fn.extend({
	text: function( value ) {
		return access( this, function( value ) {
			return value === undefined ?
				jQuery.text( this ) :
				this.empty().each(function() {
					if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
						this.textContent = value;
					}
				});
		}, null, value, arguments.length );
	},

	append: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.appendChild( elem );
			}
		});
	},

	prepend: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.nodeType === 1 || this.nodeType === 11 || this.nodeType === 9 ) {
				var target = manipulationTarget( this, elem );
				target.insertBefore( elem, target.firstChild );
			}
		});
	},

	before: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this );
			}
		});
	},

	after: function() {
		return this.domManip( arguments, function( elem ) {
			if ( this.parentNode ) {
				this.parentNode.insertBefore( elem, this.nextSibling );
			}
		});
	},

	remove: function( selector, keepData /* Internal Use Only */ ) {
		var elem,
			elems = selector ? jQuery.filter( selector, this ) : this,
			i = 0;

		for ( ; (elem = elems[i]) != null; i++ ) {
			if ( !keepData && elem.nodeType === 1 ) {
				jQuery.cleanData( getAll( elem ) );
			}

			if ( elem.parentNode ) {
				if ( keepData && jQuery.contains( elem.ownerDocument, elem ) ) {
					setGlobalEval( getAll( elem, "script" ) );
				}
				elem.parentNode.removeChild( elem );
			}
		}

		return this;
	},

	empty: function() {
		var elem,
			i = 0;

		for ( ; (elem = this[i]) != null; i++ ) {
			if ( elem.nodeType === 1 ) {

				// Prevent memory leaks
				jQuery.cleanData( getAll( elem, false ) );

				// Remove any remaining nodes
				elem.textContent = "";
			}
		}

		return this;
	},

	clone: function( dataAndEvents, deepDataAndEvents ) {
		dataAndEvents = dataAndEvents == null ? false : dataAndEvents;
		deepDataAndEvents = deepDataAndEvents == null ? dataAndEvents : deepDataAndEvents;

		return this.map(function() {
			return jQuery.clone( this, dataAndEvents, deepDataAndEvents );
		});
	},

	html: function( value ) {
		return access( this, function( value ) {
			var elem = this[ 0 ] || {},
				i = 0,
				l = this.length;

			if ( value === undefined && elem.nodeType === 1 ) {
				return elem.innerHTML;
			}

			// See if we can take a shortcut and just use innerHTML
			if ( typeof value === "string" && !rnoInnerhtml.test( value ) &&
				!wrapMap[ ( rtagName.exec( value ) || [ "", "" ] )[ 1 ].toLowerCase() ] ) {

				value = value.replace( rxhtmlTag, "<$1></$2>" );

				try {
					for ( ; i < l; i++ ) {
						elem = this[ i ] || {};

						// Remove element nodes and prevent memory leaks
						if ( elem.nodeType === 1 ) {
							jQuery.cleanData( getAll( elem, false ) );
							elem.innerHTML = value;
						}
					}

					elem = 0;

				// If using innerHTML throws an exception, use the fallback method
				} catch( e ) {}
			}

			if ( elem ) {
				this.empty().append( value );
			}
		}, null, value, arguments.length );
	},

	replaceWith: function() {
		var arg = arguments[ 0 ];

		// Make the changes, replacing each context element with the new content
		this.domManip( arguments, function( elem ) {
			arg = this.parentNode;

			jQuery.cleanData( getAll( this ) );

			if ( arg ) {
				arg.replaceChild( elem, this );
			}
		});

		// Force removal if there was no new content (e.g., from empty arguments)
		return arg && (arg.length || arg.nodeType) ? this : this.remove();
	},

	detach: function( selector ) {
		return this.remove( selector, true );
	},

	domManip: function( args, callback ) {

		// Flatten any nested arrays
		args = concat.apply( [], args );

		var fragment, first, scripts, hasScripts, node, doc,
			i = 0,
			l = this.length,
			set = this,
			iNoClone = l - 1,
			value = args[ 0 ],
			isFunction = jQuery.isFunction( value );

		// We can't cloneNode fragments that contain checked, in WebKit
		if ( isFunction ||
				( l > 1 && typeof value === "string" &&
					!support.checkClone && rchecked.test( value ) ) ) {
			return this.each(function( index ) {
				var self = set.eq( index );
				if ( isFunction ) {
					args[ 0 ] = value.call( this, index, self.html() );
				}
				self.domManip( args, callback );
			});
		}

		if ( l ) {
			fragment = jQuery.buildFragment( args, this[ 0 ].ownerDocument, false, this );
			first = fragment.firstChild;

			if ( fragment.childNodes.length === 1 ) {
				fragment = first;
			}

			if ( first ) {
				scripts = jQuery.map( getAll( fragment, "script" ), disableScript );
				hasScripts = scripts.length;

				// Use the original fragment for the last item instead of the first because it can end up
				// being emptied incorrectly in certain situations (#8070).
				for ( ; i < l; i++ ) {
					node = fragment;

					if ( i !== iNoClone ) {
						node = jQuery.clone( node, true, true );

						// Keep references to cloned scripts for later restoration
						if ( hasScripts ) {
							// Support: QtWebKit
							// jQuery.merge because push.apply(_, arraylike) throws
							jQuery.merge( scripts, getAll( node, "script" ) );
						}
					}

					callback.call( this[ i ], node, i );
				}

				if ( hasScripts ) {
					doc = scripts[ scripts.length - 1 ].ownerDocument;

					// Reenable scripts
					jQuery.map( scripts, restoreScript );

					// Evaluate executable scripts on first document insertion
					for ( i = 0; i < hasScripts; i++ ) {
						node = scripts[ i ];
						if ( rscriptType.test( node.type || "" ) &&
							!data_priv.access( node, "globalEval" ) && jQuery.contains( doc, node ) ) {

							if ( node.src ) {
								// Optional AJAX dependency, but won't run scripts if not present
								if ( jQuery._evalUrl ) {
									jQuery._evalUrl( node.src );
								}
							} else {
								jQuery.globalEval( node.textContent.replace( rcleanScript, "" ) );
							}
						}
					}
				}
			}
		}

		return this;
	}
});

jQuery.each({
	appendTo: "append",
	prependTo: "prepend",
	insertBefore: "before",
	insertAfter: "after",
	replaceAll: "replaceWith"
}, function( name, original ) {
	jQuery.fn[ name ] = function( selector ) {
		var elems,
			ret = [],
			insert = jQuery( selector ),
			last = insert.length - 1,
			i = 0;

		for ( ; i <= last; i++ ) {
			elems = i === last ? this : this.clone( true );
			jQuery( insert[ i ] )[ original ]( elems );

			// Support: QtWebKit
			// .get() because push.apply(_, arraylike) throws
			push.apply( ret, elems.get() );
		}

		return this.pushStack( ret );
	};
});


var iframe,
	elemdisplay = {};

/**
 * Retrieve the actual display of a element
 * @param {String} name nodeName of the element
 * @param {Object} doc Document object
 */
// Called only from within defaultDisplay
function actualDisplay( name, doc ) {
	var style,
		elem = jQuery( doc.createElement( name ) ).appendTo( doc.body ),

		// getDefaultComputedStyle might be reliably used only on attached element
		display = window.getDefaultComputedStyle && ( style = window.getDefaultComputedStyle( elem[ 0 ] ) ) ?

			// Use of this method is a temporary fix (more like optimization) until something better comes along,
			// since it was removed from specification and supported only in FF
			style.display : jQuery.css( elem[ 0 ], "display" );

	// We don't have any data stored on the element,
	// so use "detach" method as fast way to get rid of the element
	elem.detach();

	return display;
}

/**
 * Try to determine the default display value of an element
 * @param {String} nodeName
 */
function defaultDisplay( nodeName ) {
	var doc = document,
		display = elemdisplay[ nodeName ];

	if ( !display ) {
		display = actualDisplay( nodeName, doc );

		// If the simple way fails, read from inside an iframe
		if ( display === "none" || !display ) {

			// Use the already-created iframe if possible
			iframe = (iframe || jQuery( "<iframe frameborder='0' width='0' height='0'/>" )).appendTo( doc.documentElement );

			// Always write a new HTML skeleton so Webkit and Firefox don't choke on reuse
			doc = iframe[ 0 ].contentDocument;

			// Support: IE
			doc.write();
			doc.close();

			display = actualDisplay( nodeName, doc );
			iframe.detach();
		}

		// Store the correct default display
		elemdisplay[ nodeName ] = display;
	}

	return display;
}
var rmargin = (/^margin/);

var rnumnonpx = new RegExp( "^(" + pnum + ")(?!px)[a-z%]+$", "i" );

var getStyles = function( elem ) {
		// Support: IE<=11+, Firefox<=30+ (#15098, #14150)
		// IE throws on elements created in popups
		// FF meanwhile throws on frame elements through "defaultView.getComputedStyle"
		if ( elem.ownerDocument.defaultView.opener ) {
			return elem.ownerDocument.defaultView.getComputedStyle( elem, null );
		}

		return window.getComputedStyle( elem, null );
	};



function curCSS( elem, name, computed ) {
	var width, minWidth, maxWidth, ret,
		style = elem.style;

	computed = computed || getStyles( elem );

	// Support: IE9
	// getPropertyValue is only needed for .css('filter') (#12537)
	if ( computed ) {
		ret = computed.getPropertyValue( name ) || computed[ name ];
	}

	if ( computed ) {

		if ( ret === "" && !jQuery.contains( elem.ownerDocument, elem ) ) {
			ret = jQuery.style( elem, name );
		}

		// Support: iOS < 6
		// A tribute to the "awesome hack by Dean Edwards"
		// iOS < 6 (at least) returns percentage for a larger set of values, but width seems to be reliably pixels
		// this is against the CSSOM draft spec: http://dev.w3.org/csswg/cssom/#resolved-values
		if ( rnumnonpx.test( ret ) && rmargin.test( name ) ) {

			// Remember the original values
			width = style.width;
			minWidth = style.minWidth;
			maxWidth = style.maxWidth;

			// Put in the new values to get a computed value out
			style.minWidth = style.maxWidth = style.width = ret;
			ret = computed.width;

			// Revert the changed values
			style.width = width;
			style.minWidth = minWidth;
			style.maxWidth = maxWidth;
		}
	}

	return ret !== undefined ?
		// Support: IE
		// IE returns zIndex value as an integer.
		ret + "" :
		ret;
}


function addGetHookIf( conditionFn, hookFn ) {
	// Define the hook, we'll check on the first run if it's really needed.
	return {
		get: function() {
			if ( conditionFn() ) {
				// Hook not needed (or it's not possible to use it due
				// to missing dependency), remove it.
				delete this.get;
				return;
			}

			// Hook needed; redefine it so that the support test is not executed again.
			return (this.get = hookFn).apply( this, arguments );
		}
	};
}


(function() {
	var pixelPositionVal, boxSizingReliableVal,
		docElem = document.documentElement,
		container = document.createElement( "div" ),
		div = document.createElement( "div" );

	if ( !div.style ) {
		return;
	}

	// Support: IE9-11+
	// Style of cloned element affects source element cloned (#8908)
	div.style.backgroundClip = "content-box";
	div.cloneNode( true ).style.backgroundClip = "";
	support.clearCloneStyle = div.style.backgroundClip === "content-box";

	container.style.cssText = "border:0;width:0;height:0;top:0;left:-9999px;margin-top:1px;" +
		"position:absolute";
	container.appendChild( div );

	// Executing both pixelPosition & boxSizingReliable tests require only one layout
	// so they're executed at the same time to save the second computation.
	function computePixelPositionAndBoxSizingReliable() {
		div.style.cssText =
			// Support: Firefox<29, Android 2.3
			// Vendor-prefix box-sizing
			"-webkit-box-sizing:border-box;-moz-box-sizing:border-box;" +
			"box-sizing:border-box;display:block;margin-top:1%;top:1%;" +
			"border:1px;padding:1px;width:4px;position:absolute";
		div.innerHTML = "";
		docElem.appendChild( container );

		var divStyle = window.getComputedStyle( div, null );
		pixelPositionVal = divStyle.top !== "1%";
		boxSizingReliableVal = divStyle.width === "4px";

		docElem.removeChild( container );
	}

	// Support: node.js jsdom
	// Don't assume that getComputedStyle is a property of the global object
	if ( window.getComputedStyle ) {
		jQuery.extend( support, {
			pixelPosition: function() {

				// This test is executed only once but we still do memoizing
				// since we can use the boxSizingReliable pre-computing.
				// No need to check if the test was already performed, though.
				computePixelPositionAndBoxSizingReliable();
				return pixelPositionVal;
			},
			boxSizingReliable: function() {
				if ( boxSizingReliableVal == null ) {
					computePixelPositionAndBoxSizingReliable();
				}
				return boxSizingReliableVal;
			},
			reliableMarginRight: function() {

				// Support: Android 2.3
				// Check if div with explicit width and no margin-right incorrectly
				// gets computed margin-right based on width of container. (#3333)
				// WebKit Bug 13343 - getComputedStyle returns wrong value for margin-right
				// This support function is only executed once so no memoizing is needed.
				var ret,
					marginDiv = div.appendChild( document.createElement( "div" ) );

				// Reset CSS: box-sizing; display; margin; border; padding
				marginDiv.style.cssText = div.style.cssText =
					// Support: Firefox<29, Android 2.3
					// Vendor-prefix box-sizing
					"-webkit-box-sizing:content-box;-moz-box-sizing:content-box;" +
					"box-sizing:content-box;display:block;margin:0;border:0;padding:0";
				marginDiv.style.marginRight = marginDiv.style.width = "0";
				div.style.width = "1px";
				docElem.appendChild( container );

				ret = !parseFloat( window.getComputedStyle( marginDiv, null ).marginRight );

				docElem.removeChild( container );
				div.removeChild( marginDiv );

				return ret;
			}
		});
	}
})();


// A method for quickly swapping in/out CSS properties to get correct calculations.
jQuery.swap = function( elem, options, callback, args ) {
	var ret, name,
		old = {};

	// Remember the old values, and insert the new ones
	for ( name in options ) {
		old[ name ] = elem.style[ name ];
		elem.style[ name ] = options[ name ];
	}

	ret = callback.apply( elem, args || [] );

	// Revert the old values
	for ( name in options ) {
		elem.style[ name ] = old[ name ];
	}

	return ret;
};


var
	// Swappable if display is none or starts with table except "table", "table-cell", or "table-caption"
	// See here for display values: https://developer.mozilla.org/en-US/docs/CSS/display
	rdisplayswap = /^(none|table(?!-c[ea]).+)/,
	rnumsplit = new RegExp( "^(" + pnum + ")(.*)$", "i" ),
	rrelNum = new RegExp( "^([+-])=(" + pnum + ")", "i" ),

	cssShow = { position: "absolute", visibility: "hidden", display: "block" },
	cssNormalTransform = {
		letterSpacing: "0",
		fontWeight: "400"
	},

	cssPrefixes = [ "Webkit", "O", "Moz", "ms" ];

// Return a css property mapped to a potentially vendor prefixed property
function vendorPropName( style, name ) {

	// Shortcut for names that are not vendor prefixed
	if ( name in style ) {
		return name;
	}

	// Check for vendor prefixed names
	var capName = name[0].toUpperCase() + name.slice(1),
		origName = name,
		i = cssPrefixes.length;

	while ( i-- ) {
		name = cssPrefixes[ i ] + capName;
		if ( name in style ) {
			return name;
		}
	}

	return origName;
}

function setPositiveNumber( elem, value, subtract ) {
	var matches = rnumsplit.exec( value );
	return matches ?
		// Guard against undefined "subtract", e.g., when used as in cssHooks
		Math.max( 0, matches[ 1 ] - ( subtract || 0 ) ) + ( matches[ 2 ] || "px" ) :
		value;
}

function augmentWidthOrHeight( elem, name, extra, isBorderBox, styles ) {
	var i = extra === ( isBorderBox ? "border" : "content" ) ?
		// If we already have the right measurement, avoid augmentation
		4 :
		// Otherwise initialize for horizontal or vertical properties
		name === "width" ? 1 : 0,

		val = 0;

	for ( ; i < 4; i += 2 ) {
		// Both box models exclude margin, so add it if we want it
		if ( extra === "margin" ) {
			val += jQuery.css( elem, extra + cssExpand[ i ], true, styles );
		}

		if ( isBorderBox ) {
			// border-box includes padding, so remove it if we want content
			if ( extra === "content" ) {
				val -= jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );
			}

			// At this point, extra isn't border nor margin, so remove border
			if ( extra !== "margin" ) {
				val -= jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		} else {
			// At this point, extra isn't content, so add padding
			val += jQuery.css( elem, "padding" + cssExpand[ i ], true, styles );

			// At this point, extra isn't content nor padding, so add border
			if ( extra !== "padding" ) {
				val += jQuery.css( elem, "border" + cssExpand[ i ] + "Width", true, styles );
			}
		}
	}

	return val;
}

function getWidthOrHeight( elem, name, extra ) {

	// Start with offset property, which is equivalent to the border-box value
	var valueIsBorderBox = true,
		val = name === "width" ? elem.offsetWidth : elem.offsetHeight,
		styles = getStyles( elem ),
		isBorderBox = jQuery.css( elem, "boxSizing", false, styles ) === "border-box";

	// Some non-html elements return undefined for offsetWidth, so check for null/undefined
	// svg - https://bugzilla.mozilla.org/show_bug.cgi?id=649285
	// MathML - https://bugzilla.mozilla.org/show_bug.cgi?id=491668
	if ( val <= 0 || val == null ) {
		// Fall back to computed then uncomputed css if necessary
		val = curCSS( elem, name, styles );
		if ( val < 0 || val == null ) {
			val = elem.style[ name ];
		}

		// Computed unit is not pixels. Stop here and return.
		if ( rnumnonpx.test(val) ) {
			return val;
		}

		// Check for style in case a browser which returns unreliable values
		// for getComputedStyle silently falls back to the reliable elem.style
		valueIsBorderBox = isBorderBox &&
			( support.boxSizingReliable() || val === elem.style[ name ] );

		// Normalize "", auto, and prepare for extra
		val = parseFloat( val ) || 0;
	}

	// Use the active box-sizing model to add/subtract irrelevant styles
	return ( val +
		augmentWidthOrHeight(
			elem,
			name,
			extra || ( isBorderBox ? "border" : "content" ),
			valueIsBorderBox,
			styles
		)
	) + "px";
}

function showHide( elements, show ) {
	var display, elem, hidden,
		values = [],
		index = 0,
		length = elements.length;

	for ( ; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}

		values[ index ] = data_priv.get( elem, "olddisplay" );
		display = elem.style.display;
		if ( show ) {
			// Reset the inline display of this element to learn if it is
			// being hidden by cascaded rules or not
			if ( !values[ index ] && display === "none" ) {
				elem.style.display = "";
			}

			// Set elements which have been overridden with display: none
			// in a stylesheet to whatever the default browser style is
			// for such an element
			if ( elem.style.display === "" && isHidden( elem ) ) {
				values[ index ] = data_priv.access( elem, "olddisplay", defaultDisplay(elem.nodeName) );
			}
		} else {
			hidden = isHidden( elem );

			if ( display !== "none" || !hidden ) {
				data_priv.set( elem, "olddisplay", hidden ? display : jQuery.css( elem, "display" ) );
			}
		}
	}

	// Set the display of most of the elements in a second loop
	// to avoid the constant reflow
	for ( index = 0; index < length; index++ ) {
		elem = elements[ index ];
		if ( !elem.style ) {
			continue;
		}
		if ( !show || elem.style.display === "none" || elem.style.display === "" ) {
			elem.style.display = show ? values[ index ] || "" : "none";
		}
	}

	return elements;
}

jQuery.extend({

	// Add in style property hooks for overriding the default
	// behavior of getting and setting a style property
	cssHooks: {
		opacity: {
			get: function( elem, computed ) {
				if ( computed ) {

					// We should always get a number back from opacity
					var ret = curCSS( elem, "opacity" );
					return ret === "" ? "1" : ret;
				}
			}
		}
	},

	// Don't automatically add "px" to these possibly-unitless properties
	cssNumber: {
		"columnCount": true,
		"fillOpacity": true,
		"flexGrow": true,
		"flexShrink": true,
		"fontWeight": true,
		"lineHeight": true,
		"opacity": true,
		"order": true,
		"orphans": true,
		"widows": true,
		"zIndex": true,
		"zoom": true
	},

	// Add in properties whose names you wish to fix before
	// setting or getting the value
	cssProps: {
		"float": "cssFloat"
	},

	// Get and set the style property on a DOM Node
	style: function( elem, name, value, extra ) {

		// Don't set styles on text and comment nodes
		if ( !elem || elem.nodeType === 3 || elem.nodeType === 8 || !elem.style ) {
			return;
		}

		// Make sure that we're working with the right name
		var ret, type, hooks,
			origName = jQuery.camelCase( name ),
			style = elem.style;

		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( style, origName ) );

		// Gets hook for the prefixed version, then unprefixed version
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// Check if we're setting a value
		if ( value !== undefined ) {
			type = typeof value;

			// Convert "+=" or "-=" to relative numbers (#7345)
			if ( type === "string" && (ret = rrelNum.exec( value )) ) {
				value = ( ret[1] + 1 ) * ret[2] + parseFloat( jQuery.css( elem, name ) );
				// Fixes bug #9237
				type = "number";
			}

			// Make sure that null and NaN values aren't set (#7116)
			if ( value == null || value !== value ) {
				return;
			}

			// If a number, add 'px' to the (except for certain CSS properties)
			if ( type === "number" && !jQuery.cssNumber[ origName ] ) {
				value += "px";
			}

			// Support: IE9-11+
			// background-* props affect original clone's values
			if ( !support.clearCloneStyle && value === "" && name.indexOf( "background" ) === 0 ) {
				style[ name ] = "inherit";
			}

			// If a hook was provided, use that value, otherwise just set the specified value
			if ( !hooks || !("set" in hooks) || (value = hooks.set( elem, value, extra )) !== undefined ) {
				style[ name ] = value;
			}

		} else {
			// If a hook was provided get the non-computed value from there
			if ( hooks && "get" in hooks && (ret = hooks.get( elem, false, extra )) !== undefined ) {
				return ret;
			}

			// Otherwise just get the value from the style object
			return style[ name ];
		}
	},

	css: function( elem, name, extra, styles ) {
		var val, num, hooks,
			origName = jQuery.camelCase( name );

		// Make sure that we're working with the right name
		name = jQuery.cssProps[ origName ] || ( jQuery.cssProps[ origName ] = vendorPropName( elem.style, origName ) );

		// Try prefixed name followed by the unprefixed name
		hooks = jQuery.cssHooks[ name ] || jQuery.cssHooks[ origName ];

		// If a hook was provided get the computed value from there
		if ( hooks && "get" in hooks ) {
			val = hooks.get( elem, true, extra );
		}

		// Otherwise, if a way to get the computed value exists, use that
		if ( val === undefined ) {
			val = curCSS( elem, name, styles );
		}

		// Convert "normal" to computed value
		if ( val === "normal" && name in cssNormalTransform ) {
			val = cssNormalTransform[ name ];
		}

		// Make numeric if forced or a qualifier was provided and val looks numeric
		if ( extra === "" || extra ) {
			num = parseFloat( val );
			return extra === true || jQuery.isNumeric( num ) ? num || 0 : val;
		}
		return val;
	}
});

jQuery.each([ "height", "width" ], function( i, name ) {
	jQuery.cssHooks[ name ] = {
		get: function( elem, computed, extra ) {
			if ( computed ) {

				// Certain elements can have dimension info if we invisibly show them
				// but it must have a current display style that would benefit
				return rdisplayswap.test( jQuery.css( elem, "display" ) ) && elem.offsetWidth === 0 ?
					jQuery.swap( elem, cssShow, function() {
						return getWidthOrHeight( elem, name, extra );
					}) :
					getWidthOrHeight( elem, name, extra );
			}
		},

		set: function( elem, value, extra ) {
			var styles = extra && getStyles( elem );
			return setPositiveNumber( elem, value, extra ?
				augmentWidthOrHeight(
					elem,
					name,
					extra,
					jQuery.css( elem, "boxSizing", false, styles ) === "border-box",
					styles
				) : 0
			);
		}
	};
});

// Support: Android 2.3
jQuery.cssHooks.marginRight = addGetHookIf( support.reliableMarginRight,
	function( elem, computed ) {
		if ( computed ) {
			return jQuery.swap( elem, { "display": "inline-block" },
				curCSS, [ elem, "marginRight" ] );
		}
	}
);

// These hooks are used by animate to expand properties
jQuery.each({
	margin: "",
	padding: "",
	border: "Width"
}, function( prefix, suffix ) {
	jQuery.cssHooks[ prefix + suffix ] = {
		expand: function( value ) {
			var i = 0,
				expanded = {},

				// Assumes a single number if not a string
				parts = typeof value === "string" ? value.split(" ") : [ value ];

			for ( ; i < 4; i++ ) {
				expanded[ prefix + cssExpand[ i ] + suffix ] =
					parts[ i ] || parts[ i - 2 ] || parts[ 0 ];
			}

			return expanded;
		}
	};

	if ( !rmargin.test( prefix ) ) {
		jQuery.cssHooks[ prefix + suffix ].set = setPositiveNumber;
	}
});

jQuery.fn.extend({
	css: function( name, value ) {
		return access( this, function( elem, name, value ) {
			var styles, len,
				map = {},
				i = 0;

			if ( jQuery.isArray( name ) ) {
				styles = getStyles( elem );
				len = name.length;

				for ( ; i < len; i++ ) {
					map[ name[ i ] ] = jQuery.css( elem, name[ i ], false, styles );
				}

				return map;
			}

			return value !== undefined ?
				jQuery.style( elem, name, value ) :
				jQuery.css( elem, name );
		}, name, value, arguments.length > 1 );
	},
	show: function() {
		return showHide( this, true );
	},
	hide: function() {
		return showHide( this );
	},
	toggle: function( state ) {
		if ( typeof state === "boolean" ) {
			return state ? this.show() : this.hide();
		}

		return this.each(function() {
			if ( isHidden( this ) ) {
				jQuery( this ).show();
			} else {
				jQuery( this ).hide();
			}
		});
	}
});


function Tween( elem, options, prop, end, easing ) {
	return new Tween.prototype.init( elem, options, prop, end, easing );
}
jQuery.Tween = Tween;

Tween.prototype = {
	constructor: Tween,
	init: function( elem, options, prop, end, easing, unit ) {
		this.elem = elem;
		this.prop = prop;
		this.easing = easing || "swing";
		this.options = options;
		this.start = this.now = this.cur();
		this.end = end;
		this.unit = unit || ( jQuery.cssNumber[ prop ] ? "" : "px" );
	},
	cur: function() {
		var hooks = Tween.propHooks[ this.prop ];

		return hooks && hooks.get ?
			hooks.get( this ) :
			Tween.propHooks._default.get( this );
	},
	run: function( percent ) {
		var eased,
			hooks = Tween.propHooks[ this.prop ];

		if ( this.options.duration ) {
			this.pos = eased = jQuery.easing[ this.easing ](
				percent, this.options.duration * percent, 0, 1, this.options.duration
			);
		} else {
			this.pos = eased = percent;
		}
		this.now = ( this.end - this.start ) * eased + this.start;

		if ( this.options.step ) {
			this.options.step.call( this.elem, this.now, this );
		}

		if ( hooks && hooks.set ) {
			hooks.set( this );
		} else {
			Tween.propHooks._default.set( this );
		}
		return this;
	}
};

Tween.prototype.init.prototype = Tween.prototype;

Tween.propHooks = {
	_default: {
		get: function( tween ) {
			var result;

			if ( tween.elem[ tween.prop ] != null &&
				(!tween.elem.style || tween.elem.style[ tween.prop ] == null) ) {
				return tween.elem[ tween.prop ];
			}

			// Passing an empty string as a 3rd parameter to .css will automatically
			// attempt a parseFloat and fallback to a string if the parse fails.
			// Simple values such as "10px" are parsed to Float;
			// complex values such as "rotate(1rad)" are returned as-is.
			result = jQuery.css( tween.elem, tween.prop, "" );
			// Empty strings, null, undefined and "auto" are converted to 0.
			return !result || result === "auto" ? 0 : result;
		},
		set: function( tween ) {
			// Use step hook for back compat.
			// Use cssHook if its there.
			// Use .style if available and use plain properties where available.
			if ( jQuery.fx.step[ tween.prop ] ) {
				jQuery.fx.step[ tween.prop ]( tween );
			} else if ( tween.elem.style && ( tween.elem.style[ jQuery.cssProps[ tween.prop ] ] != null || jQuery.cssHooks[ tween.prop ] ) ) {
				jQuery.style( tween.elem, tween.prop, tween.now + tween.unit );
			} else {
				tween.elem[ tween.prop ] = tween.now;
			}
		}
	}
};

// Support: IE9
// Panic based approach to setting things on disconnected nodes
Tween.propHooks.scrollTop = Tween.propHooks.scrollLeft = {
	set: function( tween ) {
		if ( tween.elem.nodeType && tween.elem.parentNode ) {
			tween.elem[ tween.prop ] = tween.now;
		}
	}
};

jQuery.easing = {
	linear: function( p ) {
		return p;
	},
	swing: function( p ) {
		return 0.5 - Math.cos( p * Math.PI ) / 2;
	}
};

jQuery.fx = Tween.prototype.init;

// Back Compat <1.8 extension point
jQuery.fx.step = {};




var
	fxNow, timerId,
	rfxtypes = /^(?:toggle|show|hide)$/,
	rfxnum = new RegExp( "^(?:([+-])=|)(" + pnum + ")([a-z%]*)$", "i" ),
	rrun = /queueHooks$/,
	animationPrefilters = [ defaultPrefilter ],
	tweeners = {
		"*": [ function( prop, value ) {
			var tween = this.createTween( prop, value ),
				target = tween.cur(),
				parts = rfxnum.exec( value ),
				unit = parts && parts[ 3 ] || ( jQuery.cssNumber[ prop ] ? "" : "px" ),

				// Starting value computation is required for potential unit mismatches
				start = ( jQuery.cssNumber[ prop ] || unit !== "px" && +target ) &&
					rfxnum.exec( jQuery.css( tween.elem, prop ) ),
				scale = 1,
				maxIterations = 20;

			if ( start && start[ 3 ] !== unit ) {
				// Trust units reported by jQuery.css
				unit = unit || start[ 3 ];

				// Make sure we update the tween properties later on
				parts = parts || [];

				// Iteratively approximate from a nonzero starting point
				start = +target || 1;

				do {
					// If previous iteration zeroed out, double until we get *something*.
					// Use string for doubling so we don't accidentally see scale as unchanged below
					scale = scale || ".5";

					// Adjust and apply
					start = start / scale;
					jQuery.style( tween.elem, prop, start + unit );

				// Update scale, tolerating zero or NaN from tween.cur(),
				// break the loop if scale is unchanged or perfect, or if we've just had enough
				} while ( scale !== (scale = tween.cur() / target) && scale !== 1 && --maxIterations );
			}

			// Update tween properties
			if ( parts ) {
				start = tween.start = +start || +target || 0;
				tween.unit = unit;
				// If a +=/-= token was provided, we're doing a relative animation
				tween.end = parts[ 1 ] ?
					start + ( parts[ 1 ] + 1 ) * parts[ 2 ] :
					+parts[ 2 ];
			}

			return tween;
		} ]
	};

// Animations created synchronously will run synchronously
function createFxNow() {
	setTimeout(function() {
		fxNow = undefined;
	});
	return ( fxNow = jQuery.now() );
}

// Generate parameters to create a standard animation
function genFx( type, includeWidth ) {
	var which,
		i = 0,
		attrs = { height: type };

	// If we include width, step value is 1 to do all cssExpand values,
	// otherwise step value is 2 to skip over Left and Right
	includeWidth = includeWidth ? 1 : 0;
	for ( ; i < 4 ; i += 2 - includeWidth ) {
		which = cssExpand[ i ];
		attrs[ "margin" + which ] = attrs[ "padding" + which ] = type;
	}

	if ( includeWidth ) {
		attrs.opacity = attrs.width = type;
	}

	return attrs;
}

function createTween( value, prop, animation ) {
	var tween,
		collection = ( tweeners[ prop ] || [] ).concat( tweeners[ "*" ] ),
		index = 0,
		length = collection.length;
	for ( ; index < length; index++ ) {
		if ( (tween = collection[ index ].call( animation, prop, value )) ) {

			// We're done with this property
			return tween;
		}
	}
}

function defaultPrefilter( elem, props, opts ) {
	/* jshint validthis: true */
	var prop, value, toggle, tween, hooks, oldfire, display, checkDisplay,
		anim = this,
		orig = {},
		style = elem.style,
		hidden = elem.nodeType && isHidden( elem ),
		dataShow = data_priv.get( elem, "fxshow" );

	// Handle queue: false promises
	if ( !opts.queue ) {
		hooks = jQuery._queueHooks( elem, "fx" );
		if ( hooks.unqueued == null ) {
			hooks.unqueued = 0;
			oldfire = hooks.empty.fire;
			hooks.empty.fire = function() {
				if ( !hooks.unqueued ) {
					oldfire();
				}
			};
		}
		hooks.unqueued++;

		anim.always(function() {
			// Ensure the complete handler is called before this completes
			anim.always(function() {
				hooks.unqueued--;
				if ( !jQuery.queue( elem, "fx" ).length ) {
					hooks.empty.fire();
				}
			});
		});
	}

	// Height/width overflow pass
	if ( elem.nodeType === 1 && ( "height" in props || "width" in props ) ) {
		// Make sure that nothing sneaks out
		// Record all 3 overflow attributes because IE9-10 do not
		// change the overflow attribute when overflowX and
		// overflowY are set to the same value
		opts.overflow = [ style.overflow, style.overflowX, style.overflowY ];

		// Set display property to inline-block for height/width
		// animations on inline elements that are having width/height animated
		display = jQuery.css( elem, "display" );

		// Test default display if display is currently "none"
		checkDisplay = display === "none" ?
			data_priv.get( elem, "olddisplay" ) || defaultDisplay( elem.nodeName ) : display;

		if ( checkDisplay === "inline" && jQuery.css( elem, "float" ) === "none" ) {
			style.display = "inline-block";
		}
	}

	if ( opts.overflow ) {
		style.overflow = "hidden";
		anim.always(function() {
			style.overflow = opts.overflow[ 0 ];
			style.overflowX = opts.overflow[ 1 ];
			style.overflowY = opts.overflow[ 2 ];
		});
	}

	// show/hide pass
	for ( prop in props ) {
		value = props[ prop ];
		if ( rfxtypes.exec( value ) ) {
			delete props[ prop ];
			toggle = toggle || value === "toggle";
			if ( value === ( hidden ? "hide" : "show" ) ) {

				// If there is dataShow left over from a stopped hide or show and we are going to proceed with show, we should pretend to be hidden
				if ( value === "show" && dataShow && dataShow[ prop ] !== undefined ) {
					hidden = true;
				} else {
					continue;
				}
			}
			orig[ prop ] = dataShow && dataShow[ prop ] || jQuery.style( elem, prop );

		// Any non-fx value stops us from restoring the original display value
		} else {
			display = undefined;
		}
	}

	if ( !jQuery.isEmptyObject( orig ) ) {
		if ( dataShow ) {
			if ( "hidden" in dataShow ) {
				hidden = dataShow.hidden;
			}
		} else {
			dataShow = data_priv.access( elem, "fxshow", {} );
		}

		// Store state if its toggle - enables .stop().toggle() to "reverse"
		if ( toggle ) {
			dataShow.hidden = !hidden;
		}
		if ( hidden ) {
			jQuery( elem ).show();
		} else {
			anim.done(function() {
				jQuery( elem ).hide();
			});
		}
		anim.done(function() {
			var prop;

			data_priv.remove( elem, "fxshow" );
			for ( prop in orig ) {
				jQuery.style( elem, prop, orig[ prop ] );
			}
		});
		for ( prop in orig ) {
			tween = createTween( hidden ? dataShow[ prop ] : 0, prop, anim );

			if ( !( prop in dataShow ) ) {
				dataShow[ prop ] = tween.start;
				if ( hidden ) {
					tween.end = tween.start;
					tween.start = prop === "width" || prop === "height" ? 1 : 0;
				}
			}
		}

	// If this is a noop like .hide().hide(), restore an overwritten display value
	} else if ( (display === "none" ? defaultDisplay( elem.nodeName ) : display) === "inline" ) {
		style.display = display;
	}
}

function propFilter( props, specialEasing ) {
	var index, name, easing, value, hooks;

	// camelCase, specialEasing and expand cssHook pass
	for ( index in props ) {
		name = jQuery.camelCase( index );
		easing = specialEasing[ name ];
		value = props[ index ];
		if ( jQuery.isArray( value ) ) {
			easing = value[ 1 ];
			value = props[ index ] = value[ 0 ];
		}

		if ( index !== name ) {
			props[ name ] = value;
			delete props[ index ];
		}

		hooks = jQuery.cssHooks[ name ];
		if ( hooks && "expand" in hooks ) {
			value = hooks.expand( value );
			delete props[ name ];

			// Not quite $.extend, this won't overwrite existing keys.
			// Reusing 'index' because we have the correct "name"
			for ( index in value ) {
				if ( !( index in props ) ) {
					props[ index ] = value[ index ];
					specialEasing[ index ] = easing;
				}
			}
		} else {
			specialEasing[ name ] = easing;
		}
	}
}

function Animation( elem, properties, options ) {
	var result,
		stopped,
		index = 0,
		length = animationPrefilters.length,
		deferred = jQuery.Deferred().always( function() {
			// Don't match elem in the :animated selector
			delete tick.elem;
		}),
		tick = function() {
			if ( stopped ) {
				return false;
			}
			var currentTime = fxNow || createFxNow(),
				remaining = Math.max( 0, animation.startTime + animation.duration - currentTime ),
				// Support: Android 2.3
				// Archaic crash bug won't allow us to use `1 - ( 0.5 || 0 )` (#12497)
				temp = remaining / animation.duration || 0,
				percent = 1 - temp,
				index = 0,
				length = animation.tweens.length;

			for ( ; index < length ; index++ ) {
				animation.tweens[ index ].run( percent );
			}

			deferred.notifyWith( elem, [ animation, percent, remaining ]);

			if ( percent < 1 && length ) {
				return remaining;
			} else {
				deferred.resolveWith( elem, [ animation ] );
				return false;
			}
		},
		animation = deferred.promise({
			elem: elem,
			props: jQuery.extend( {}, properties ),
			opts: jQuery.extend( true, { specialEasing: {} }, options ),
			originalProperties: properties,
			originalOptions: options,
			startTime: fxNow || createFxNow(),
			duration: options.duration,
			tweens: [],
			createTween: function( prop, end ) {
				var tween = jQuery.Tween( elem, animation.opts, prop, end,
						animation.opts.specialEasing[ prop ] || animation.opts.easing );
				animation.tweens.push( tween );
				return tween;
			},
			stop: function( gotoEnd ) {
				var index = 0,
					// If we are going to the end, we want to run all the tweens
					// otherwise we skip this part
					length = gotoEnd ? animation.tweens.length : 0;
				if ( stopped ) {
					return this;
				}
				stopped = true;
				for ( ; index < length ; index++ ) {
					animation.tweens[ index ].run( 1 );
				}

				// Resolve when we played the last frame; otherwise, reject
				if ( gotoEnd ) {
					deferred.resolveWith( elem, [ animation, gotoEnd ] );
				} else {
					deferred.rejectWith( elem, [ animation, gotoEnd ] );
				}
				return this;
			}
		}),
		props = animation.props;

	propFilter( props, animation.opts.specialEasing );

	for ( ; index < length ; index++ ) {
		result = animationPrefilters[ index ].call( animation, elem, props, animation.opts );
		if ( result ) {
			return result;
		}
	}

	jQuery.map( props, createTween, animation );

	if ( jQuery.isFunction( animation.opts.start ) ) {
		animation.opts.start.call( elem, animation );
	}

	jQuery.fx.timer(
		jQuery.extend( tick, {
			elem: elem,
			anim: animation,
			queue: animation.opts.queue
		})
	);

	// attach callbacks from options
	return animation.progress( animation.opts.progress )
		.done( animation.opts.done, animation.opts.complete )
		.fail( animation.opts.fail )
		.always( animation.opts.always );
}

jQuery.Animation = jQuery.extend( Animation, {

	tweener: function( props, callback ) {
		if ( jQuery.isFunction( props ) ) {
			callback = props;
			props = [ "*" ];
		} else {
			props = props.split(" ");
		}

		var prop,
			index = 0,
			length = props.length;

		for ( ; index < length ; index++ ) {
			prop = props[ index ];
			tweeners[ prop ] = tweeners[ prop ] || [];
			tweeners[ prop ].unshift( callback );
		}
	},

	prefilter: function( callback, prepend ) {
		if ( prepend ) {
			animationPrefilters.unshift( callback );
		} else {
			animationPrefilters.push( callback );
		}
	}
});

jQuery.speed = function( speed, easing, fn ) {
	var opt = speed && typeof speed === "object" ? jQuery.extend( {}, speed ) : {
		complete: fn || !fn && easing ||
			jQuery.isFunction( speed ) && speed,
		duration: speed,
		easing: fn && easing || easing && !jQuery.isFunction( easing ) && easing
	};

	opt.duration = jQuery.fx.off ? 0 : typeof opt.duration === "number" ? opt.duration :
		opt.duration in jQuery.fx.speeds ? jQuery.fx.speeds[ opt.duration ] : jQuery.fx.speeds._default;

	// Normalize opt.queue - true/undefined/null -> "fx"
	if ( opt.queue == null || opt.queue === true ) {
		opt.queue = "fx";
	}

	// Queueing
	opt.old = opt.complete;

	opt.complete = function() {
		if ( jQuery.isFunction( opt.old ) ) {
			opt.old.call( this );
		}

		if ( opt.queue ) {
			jQuery.dequeue( this, opt.queue );
		}
	};

	return opt;
};

jQuery.fn.extend({
	fadeTo: function( speed, to, easing, callback ) {

		// Show any hidden elements after setting opacity to 0
		return this.filter( isHidden ).css( "opacity", 0 ).show()

			// Animate to the value specified
			.end().animate({ opacity: to }, speed, easing, callback );
	},
	animate: function( prop, speed, easing, callback ) {
		var empty = jQuery.isEmptyObject( prop ),
			optall = jQuery.speed( speed, easing, callback ),
			doAnimation = function() {
				// Operate on a copy of prop so per-property easing won't be lost
				var anim = Animation( this, jQuery.extend( {}, prop ), optall );

				// Empty animations, or finishing resolves immediately
				if ( empty || data_priv.get( this, "finish" ) ) {
					anim.stop( true );
				}
			};
			doAnimation.finish = doAnimation;

		return empty || optall.queue === false ?
			this.each( doAnimation ) :
			this.queue( optall.queue, doAnimation );
	},
	stop: function( type, clearQueue, gotoEnd ) {
		var stopQueue = function( hooks ) {
			var stop = hooks.stop;
			delete hooks.stop;
			stop( gotoEnd );
		};

		if ( typeof type !== "string" ) {
			gotoEnd = clearQueue;
			clearQueue = type;
			type = undefined;
		}
		if ( clearQueue && type !== false ) {
			this.queue( type || "fx", [] );
		}

		return this.each(function() {
			var dequeue = true,
				index = type != null && type + "queueHooks",
				timers = jQuery.timers,
				data = data_priv.get( this );

			if ( index ) {
				if ( data[ index ] && data[ index ].stop ) {
					stopQueue( data[ index ] );
				}
			} else {
				for ( index in data ) {
					if ( data[ index ] && data[ index ].stop && rrun.test( index ) ) {
						stopQueue( data[ index ] );
					}
				}
			}

			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && (type == null || timers[ index ].queue === type) ) {
					timers[ index ].anim.stop( gotoEnd );
					dequeue = false;
					timers.splice( index, 1 );
				}
			}

			// Start the next in the queue if the last step wasn't forced.
			// Timers currently will call their complete callbacks, which
			// will dequeue but only if they were gotoEnd.
			if ( dequeue || !gotoEnd ) {
				jQuery.dequeue( this, type );
			}
		});
	},
	finish: function( type ) {
		if ( type !== false ) {
			type = type || "fx";
		}
		return this.each(function() {
			var index,
				data = data_priv.get( this ),
				queue = data[ type + "queue" ],
				hooks = data[ type + "queueHooks" ],
				timers = jQuery.timers,
				length = queue ? queue.length : 0;

			// Enable finishing flag on private data
			data.finish = true;

			// Empty the queue first
			jQuery.queue( this, type, [] );

			if ( hooks && hooks.stop ) {
				hooks.stop.call( this, true );
			}

			// Look for any active animations, and finish them
			for ( index = timers.length; index--; ) {
				if ( timers[ index ].elem === this && timers[ index ].queue === type ) {
					timers[ index ].anim.stop( true );
					timers.splice( index, 1 );
				}
			}

			// Look for any animations in the old queue and finish them
			for ( index = 0; index < length; index++ ) {
				if ( queue[ index ] && queue[ index ].finish ) {
					queue[ index ].finish.call( this );
				}
			}

			// Turn off finishing flag
			delete data.finish;
		});
	}
});

jQuery.each([ "toggle", "show", "hide" ], function( i, name ) {
	var cssFn = jQuery.fn[ name ];
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return speed == null || typeof speed === "boolean" ?
			cssFn.apply( this, arguments ) :
			this.animate( genFx( name, true ), speed, easing, callback );
	};
});

// Generate shortcuts for custom animations
jQuery.each({
	slideDown: genFx("show"),
	slideUp: genFx("hide"),
	slideToggle: genFx("toggle"),
	fadeIn: { opacity: "show" },
	fadeOut: { opacity: "hide" },
	fadeToggle: { opacity: "toggle" }
}, function( name, props ) {
	jQuery.fn[ name ] = function( speed, easing, callback ) {
		return this.animate( props, speed, easing, callback );
	};
});

jQuery.timers = [];
jQuery.fx.tick = function() {
	var timer,
		i = 0,
		timers = jQuery.timers;

	fxNow = jQuery.now();

	for ( ; i < timers.length; i++ ) {
		timer = timers[ i ];
		// Checks the timer has not already been removed
		if ( !timer() && timers[ i ] === timer ) {
			timers.splice( i--, 1 );
		}
	}

	if ( !timers.length ) {
		jQuery.fx.stop();
	}
	fxNow = undefined;
};

jQuery.fx.timer = function( timer ) {
	jQuery.timers.push( timer );
	if ( timer() ) {
		jQuery.fx.start();
	} else {
		jQuery.timers.pop();
	}
};

jQuery.fx.interval = 13;

jQuery.fx.start = function() {
	if ( !timerId ) {
		timerId = setInterval( jQuery.fx.tick, jQuery.fx.interval );
	}
};

jQuery.fx.stop = function() {
	clearInterval( timerId );
	timerId = null;
};

jQuery.fx.speeds = {
	slow: 600,
	fast: 200,
	// Default speed
	_default: 400
};


// Based off of the plugin by Clint Helfers, with permission.
// http://blindsignals.com/index.php/2009/07/jquery-delay/
jQuery.fn.delay = function( time, type ) {
	time = jQuery.fx ? jQuery.fx.speeds[ time ] || time : time;
	type = type || "fx";

	return this.queue( type, function( next, hooks ) {
		var timeout = setTimeout( next, time );
		hooks.stop = function() {
			clearTimeout( timeout );
		};
	});
};


(function() {
	var input = document.createElement( "input" ),
		select = document.createElement( "select" ),
		opt = select.appendChild( document.createElement( "option" ) );

	input.type = "checkbox";

	// Support: iOS<=5.1, Android<=4.2+
	// Default value for a checkbox should be "on"
	support.checkOn = input.value !== "";

	// Support: IE<=11+
	// Must access selectedIndex to make default options select
	support.optSelected = opt.selected;

	// Support: Android<=2.3
	// Options inside disabled selects are incorrectly marked as disabled
	select.disabled = true;
	support.optDisabled = !opt.disabled;

	// Support: IE<=11+
	// An input loses its value after becoming a radio
	input = document.createElement( "input" );
	input.value = "t";
	input.type = "radio";
	support.radioValue = input.value === "t";
})();


var nodeHook, boolHook,
	attrHandle = jQuery.expr.attrHandle;

jQuery.fn.extend({
	attr: function( name, value ) {
		return access( this, jQuery.attr, name, value, arguments.length > 1 );
	},

	removeAttr: function( name ) {
		return this.each(function() {
			jQuery.removeAttr( this, name );
		});
	}
});

jQuery.extend({
	attr: function( elem, name, value ) {
		var hooks, ret,
			nType = elem.nodeType;

		// don't get/set attributes on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		// Fallback to prop when attributes are not supported
		if ( typeof elem.getAttribute === strundefined ) {
			return jQuery.prop( elem, name, value );
		}

		// All attributes are lowercase
		// Grab necessary hook if one is defined
		if ( nType !== 1 || !jQuery.isXMLDoc( elem ) ) {
			name = name.toLowerCase();
			hooks = jQuery.attrHooks[ name ] ||
				( jQuery.expr.match.bool.test( name ) ? boolHook : nodeHook );
		}

		if ( value !== undefined ) {

			if ( value === null ) {
				jQuery.removeAttr( elem, name );

			} else if ( hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ) {
				return ret;

			} else {
				elem.setAttribute( name, value + "" );
				return value;
			}

		} else if ( hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ) {
			return ret;

		} else {
			ret = jQuery.find.attr( elem, name );

			// Non-existent attributes return null, we normalize to undefined
			return ret == null ?
				undefined :
				ret;
		}
	},

	removeAttr: function( elem, value ) {
		var name, propName,
			i = 0,
			attrNames = value && value.match( rnotwhite );

		if ( attrNames && elem.nodeType === 1 ) {
			while ( (name = attrNames[i++]) ) {
				propName = jQuery.propFix[ name ] || name;

				// Boolean attributes get special treatment (#10870)
				if ( jQuery.expr.match.bool.test( name ) ) {
					// Set corresponding property to false
					elem[ propName ] = false;
				}

				elem.removeAttribute( name );
			}
		}
	},

	attrHooks: {
		type: {
			set: function( elem, value ) {
				if ( !support.radioValue && value === "radio" &&
					jQuery.nodeName( elem, "input" ) ) {
					var val = elem.value;
					elem.setAttribute( "type", value );
					if ( val ) {
						elem.value = val;
					}
					return value;
				}
			}
		}
	}
});

// Hooks for boolean attributes
boolHook = {
	set: function( elem, value, name ) {
		if ( value === false ) {
			// Remove boolean attributes when set to false
			jQuery.removeAttr( elem, name );
		} else {
			elem.setAttribute( name, name );
		}
		return name;
	}
};
jQuery.each( jQuery.expr.match.bool.source.match( /\w+/g ), function( i, name ) {
	var getter = attrHandle[ name ] || jQuery.find.attr;

	attrHandle[ name ] = function( elem, name, isXML ) {
		var ret, handle;
		if ( !isXML ) {
			// Avoid an infinite loop by temporarily removing this function from the getter
			handle = attrHandle[ name ];
			attrHandle[ name ] = ret;
			ret = getter( elem, name, isXML ) != null ?
				name.toLowerCase() :
				null;
			attrHandle[ name ] = handle;
		}
		return ret;
	};
});




var rfocusable = /^(?:input|select|textarea|button)$/i;

jQuery.fn.extend({
	prop: function( name, value ) {
		return access( this, jQuery.prop, name, value, arguments.length > 1 );
	},

	removeProp: function( name ) {
		return this.each(function() {
			delete this[ jQuery.propFix[ name ] || name ];
		});
	}
});

jQuery.extend({
	propFix: {
		"for": "htmlFor",
		"class": "className"
	},

	prop: function( elem, name, value ) {
		var ret, hooks, notxml,
			nType = elem.nodeType;

		// Don't get/set properties on text, comment and attribute nodes
		if ( !elem || nType === 3 || nType === 8 || nType === 2 ) {
			return;
		}

		notxml = nType !== 1 || !jQuery.isXMLDoc( elem );

		if ( notxml ) {
			// Fix name and attach hooks
			name = jQuery.propFix[ name ] || name;
			hooks = jQuery.propHooks[ name ];
		}

		if ( value !== undefined ) {
			return hooks && "set" in hooks && (ret = hooks.set( elem, value, name )) !== undefined ?
				ret :
				( elem[ name ] = value );

		} else {
			return hooks && "get" in hooks && (ret = hooks.get( elem, name )) !== null ?
				ret :
				elem[ name ];
		}
	},

	propHooks: {
		tabIndex: {
			get: function( elem ) {
				return elem.hasAttribute( "tabindex" ) || rfocusable.test( elem.nodeName ) || elem.href ?
					elem.tabIndex :
					-1;
			}
		}
	}
});

if ( !support.optSelected ) {
	jQuery.propHooks.selected = {
		get: function( elem ) {
			var parent = elem.parentNode;
			if ( parent && parent.parentNode ) {
				parent.parentNode.selectedIndex;
			}
			return null;
		}
	};
}

jQuery.each([
	"tabIndex",
	"readOnly",
	"maxLength",
	"cellSpacing",
	"cellPadding",
	"rowSpan",
	"colSpan",
	"useMap",
	"frameBorder",
	"contentEditable"
], function() {
	jQuery.propFix[ this.toLowerCase() ] = this;
});




var rclass = /[\t\r\n\f]/g;

jQuery.fn.extend({
	addClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).addClass( value.call( this, j, this.className ) );
			});
		}

		if ( proceed ) {
			// The disjunction here is for better compressibility (see removeClass)
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					" "
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						if ( cur.indexOf( " " + clazz + " " ) < 0 ) {
							cur += clazz + " ";
						}
					}

					// only assign if different to avoid unneeded rendering.
					finalValue = jQuery.trim( cur );
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	removeClass: function( value ) {
		var classes, elem, cur, clazz, j, finalValue,
			proceed = arguments.length === 0 || typeof value === "string" && value,
			i = 0,
			len = this.length;

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( j ) {
				jQuery( this ).removeClass( value.call( this, j, this.className ) );
			});
		}
		if ( proceed ) {
			classes = ( value || "" ).match( rnotwhite ) || [];

			for ( ; i < len; i++ ) {
				elem = this[ i ];
				// This expression is here for better compressibility (see addClass)
				cur = elem.nodeType === 1 && ( elem.className ?
					( " " + elem.className + " " ).replace( rclass, " " ) :
					""
				);

				if ( cur ) {
					j = 0;
					while ( (clazz = classes[j++]) ) {
						// Remove *all* instances
						while ( cur.indexOf( " " + clazz + " " ) >= 0 ) {
							cur = cur.replace( " " + clazz + " ", " " );
						}
					}

					// Only assign if different to avoid unneeded rendering.
					finalValue = value ? jQuery.trim( cur ) : "";
					if ( elem.className !== finalValue ) {
						elem.className = finalValue;
					}
				}
			}
		}

		return this;
	},

	toggleClass: function( value, stateVal ) {
		var type = typeof value;

		if ( typeof stateVal === "boolean" && type === "string" ) {
			return stateVal ? this.addClass( value ) : this.removeClass( value );
		}

		if ( jQuery.isFunction( value ) ) {
			return this.each(function( i ) {
				jQuery( this ).toggleClass( value.call(this, i, this.className, stateVal), stateVal );
			});
		}

		return this.each(function() {
			if ( type === "string" ) {
				// Toggle individual class names
				var className,
					i = 0,
					self = jQuery( this ),
					classNames = value.match( rnotwhite ) || [];

				while ( (className = classNames[ i++ ]) ) {
					// Check each className given, space separated list
					if ( self.hasClass( className ) ) {
						self.removeClass( className );
					} else {
						self.addClass( className );
					}
				}

			// Toggle whole class name
			} else if ( type === strundefined || type === "boolean" ) {
				if ( this.className ) {
					// store className if set
					data_priv.set( this, "__className__", this.className );
				}

				// If the element has a class name or if we're passed `false`,
				// then remove the whole classname (if there was one, the above saved it).
				// Otherwise bring back whatever was previously saved (if anything),
				// falling back to the empty string if nothing was stored.
				this.className = this.className || value === false ? "" : data_priv.get( this, "__className__" ) || "";
			}
		});
	},

	hasClass: function( selector ) {
		var className = " " + selector + " ",
			i = 0,
			l = this.length;
		for ( ; i < l; i++ ) {
			if ( this[i].nodeType === 1 && (" " + this[i].className + " ").replace(rclass, " ").indexOf( className ) >= 0 ) {
				return true;
			}
		}

		return false;
	}
});




var rreturn = /\r/g;

jQuery.fn.extend({
	val: function( value ) {
		var hooks, ret, isFunction,
			elem = this[0];

		if ( !arguments.length ) {
			if ( elem ) {
				hooks = jQuery.valHooks[ elem.type ] || jQuery.valHooks[ elem.nodeName.toLowerCase() ];

				if ( hooks && "get" in hooks && (ret = hooks.get( elem, "value" )) !== undefined ) {
					return ret;
				}

				ret = elem.value;

				return typeof ret === "string" ?
					// Handle most common string cases
					ret.replace(rreturn, "") :
					// Handle cases where value is null/undef or number
					ret == null ? "" : ret;
			}

			return;
		}

		isFunction = jQuery.isFunction( value );

		return this.each(function( i ) {
			var val;

			if ( this.nodeType !== 1 ) {
				return;
			}

			if ( isFunction ) {
				val = value.call( this, i, jQuery( this ).val() );
			} else {
				val = value;
			}

			// Treat null/undefined as ""; convert numbers to string
			if ( val == null ) {
				val = "";

			} else if ( typeof val === "number" ) {
				val += "";

			} else if ( jQuery.isArray( val ) ) {
				val = jQuery.map( val, function( value ) {
					return value == null ? "" : value + "";
				});
			}

			hooks = jQuery.valHooks[ this.type ] || jQuery.valHooks[ this.nodeName.toLowerCase() ];

			// If set returns undefined, fall back to normal setting
			if ( !hooks || !("set" in hooks) || hooks.set( this, val, "value" ) === undefined ) {
				this.value = val;
			}
		});
	}
});

jQuery.extend({
	valHooks: {
		option: {
			get: function( elem ) {
				var val = jQuery.find.attr( elem, "value" );
				return val != null ?
					val :
					// Support: IE10-11+
					// option.text throws exceptions (#14686, #14858)
					jQuery.trim( jQuery.text( elem ) );
			}
		},
		select: {
			get: function( elem ) {
				var value, option,
					options = elem.options,
					index = elem.selectedIndex,
					one = elem.type === "select-one" || index < 0,
					values = one ? null : [],
					max = one ? index + 1 : options.length,
					i = index < 0 ?
						max :
						one ? index : 0;

				// Loop through all the selected options
				for ( ; i < max; i++ ) {
					option = options[ i ];

					// IE6-9 doesn't update selected after form reset (#2551)
					if ( ( option.selected || i === index ) &&
							// Don't return options that are disabled or in a disabled optgroup
							( support.optDisabled ? !option.disabled : option.getAttribute( "disabled" ) === null ) &&
							( !option.parentNode.disabled || !jQuery.nodeName( option.parentNode, "optgroup" ) ) ) {

						// Get the specific value for the option
						value = jQuery( option ).val();

						// We don't need an array for one selects
						if ( one ) {
							return value;
						}

						// Multi-Selects return an array
						values.push( value );
					}
				}

				return values;
			},

			set: function( elem, value ) {
				var optionSet, option,
					options = elem.options,
					values = jQuery.makeArray( value ),
					i = options.length;

				while ( i-- ) {
					option = options[ i ];
					if ( (option.selected = jQuery.inArray( option.value, values ) >= 0) ) {
						optionSet = true;
					}
				}

				// Force browsers to behave consistently when non-matching value is set
				if ( !optionSet ) {
					elem.selectedIndex = -1;
				}
				return values;
			}
		}
	}
});

// Radios and checkboxes getter/setter
jQuery.each([ "radio", "checkbox" ], function() {
	jQuery.valHooks[ this ] = {
		set: function( elem, value ) {
			if ( jQuery.isArray( value ) ) {
				return ( elem.checked = jQuery.inArray( jQuery(elem).val(), value ) >= 0 );
			}
		}
	};
	if ( !support.checkOn ) {
		jQuery.valHooks[ this ].get = function( elem ) {
			return elem.getAttribute("value") === null ? "on" : elem.value;
		};
	}
});




// Return jQuery for attributes-only inclusion


jQuery.each( ("blur focus focusin focusout load resize scroll unload click dblclick " +
	"mousedown mouseup mousemove mouseover mouseout mouseenter mouseleave " +
	"change select submit keydown keypress keyup error contextmenu").split(" "), function( i, name ) {

	// Handle event binding
	jQuery.fn[ name ] = function( data, fn ) {
		return arguments.length > 0 ?
			this.on( name, null, data, fn ) :
			this.trigger( name );
	};
});

jQuery.fn.extend({
	hover: function( fnOver, fnOut ) {
		return this.mouseenter( fnOver ).mouseleave( fnOut || fnOver );
	},

	bind: function( types, data, fn ) {
		return this.on( types, null, data, fn );
	},
	unbind: function( types, fn ) {
		return this.off( types, null, fn );
	},

	delegate: function( selector, types, data, fn ) {
		return this.on( types, selector, data, fn );
	},
	undelegate: function( selector, types, fn ) {
		// ( namespace ) or ( selector, types [, fn] )
		return arguments.length === 1 ? this.off( selector, "**" ) : this.off( types, selector || "**", fn );
	}
});


var nonce = jQuery.now();

var rquery = (/\?/);



// Support: Android 2.3
// Workaround failure to string-cast null input
jQuery.parseJSON = function( data ) {
	return JSON.parse( data + "" );
};


// Cross-browser xml parsing
jQuery.parseXML = function( data ) {
	var xml, tmp;
	if ( !data || typeof data !== "string" ) {
		return null;
	}

	// Support: IE9
	try {
		tmp = new DOMParser();
		xml = tmp.parseFromString( data, "text/xml" );
	} catch ( e ) {
		xml = undefined;
	}

	if ( !xml || xml.getElementsByTagName( "parsererror" ).length ) {
		jQuery.error( "Invalid XML: " + data );
	}
	return xml;
};


var
	rhash = /#.*$/,
	rts = /([?&])_=[^&]*/,
	rheaders = /^(.*?):[ \t]*([^\r\n]*)$/mg,
	// #7653, #8125, #8152: local protocol detection
	rlocalProtocol = /^(?:about|app|app-storage|.+-extension|file|res|widget):$/,
	rnoContent = /^(?:GET|HEAD)$/,
	rprotocol = /^\/\//,
	rurl = /^([\w.+-]+:)(?:\/\/(?:[^\/?#]*@|)([^\/?#:]*)(?::(\d+)|)|)/,

	/* Prefilters
	 * 1) They are useful to introduce custom dataTypes (see ajax/jsonp.js for an example)
	 * 2) These are called:
	 *    - BEFORE asking for a transport
	 *    - AFTER param serialization (s.data is a string if s.processData is true)
	 * 3) key is the dataType
	 * 4) the catchall symbol "*" can be used
	 * 5) execution will start with transport dataType and THEN continue down to "*" if needed
	 */
	prefilters = {},

	/* Transports bindings
	 * 1) key is the dataType
	 * 2) the catchall symbol "*" can be used
	 * 3) selection will start with transport dataType and THEN go to "*" if needed
	 */
	transports = {},

	// Avoid comment-prolog char sequence (#10098); must appease lint and evade compression
	allTypes = "*/".concat( "*" ),

	// Document location
	ajaxLocation = window.location.href,

	// Segment location into parts
	ajaxLocParts = rurl.exec( ajaxLocation.toLowerCase() ) || [];

// Base "constructor" for jQuery.ajaxPrefilter and jQuery.ajaxTransport
function addToPrefiltersOrTransports( structure ) {

	// dataTypeExpression is optional and defaults to "*"
	return function( dataTypeExpression, func ) {

		if ( typeof dataTypeExpression !== "string" ) {
			func = dataTypeExpression;
			dataTypeExpression = "*";
		}

		var dataType,
			i = 0,
			dataTypes = dataTypeExpression.toLowerCase().match( rnotwhite ) || [];

		if ( jQuery.isFunction( func ) ) {
			// For each dataType in the dataTypeExpression
			while ( (dataType = dataTypes[i++]) ) {
				// Prepend if requested
				if ( dataType[0] === "+" ) {
					dataType = dataType.slice( 1 ) || "*";
					(structure[ dataType ] = structure[ dataType ] || []).unshift( func );

				// Otherwise append
				} else {
					(structure[ dataType ] = structure[ dataType ] || []).push( func );
				}
			}
		}
	};
}

// Base inspection function for prefilters and transports
function inspectPrefiltersOrTransports( structure, options, originalOptions, jqXHR ) {

	var inspected = {},
		seekingTransport = ( structure === transports );

	function inspect( dataType ) {
		var selected;
		inspected[ dataType ] = true;
		jQuery.each( structure[ dataType ] || [], function( _, prefilterOrFactory ) {
			var dataTypeOrTransport = prefilterOrFactory( options, originalOptions, jqXHR );
			if ( typeof dataTypeOrTransport === "string" && !seekingTransport && !inspected[ dataTypeOrTransport ] ) {
				options.dataTypes.unshift( dataTypeOrTransport );
				inspect( dataTypeOrTransport );
				return false;
			} else if ( seekingTransport ) {
				return !( selected = dataTypeOrTransport );
			}
		});
		return selected;
	}

	return inspect( options.dataTypes[ 0 ] ) || !inspected[ "*" ] && inspect( "*" );
}

// A special extend for ajax options
// that takes "flat" options (not to be deep extended)
// Fixes #9887
function ajaxExtend( target, src ) {
	var key, deep,
		flatOptions = jQuery.ajaxSettings.flatOptions || {};

	for ( key in src ) {
		if ( src[ key ] !== undefined ) {
			( flatOptions[ key ] ? target : ( deep || (deep = {}) ) )[ key ] = src[ key ];
		}
	}
	if ( deep ) {
		jQuery.extend( true, target, deep );
	}

	return target;
}

/* Handles responses to an ajax request:
 * - finds the right dataType (mediates between content-type and expected dataType)
 * - returns the corresponding response
 */
function ajaxHandleResponses( s, jqXHR, responses ) {

	var ct, type, finalDataType, firstDataType,
		contents = s.contents,
		dataTypes = s.dataTypes;

	// Remove auto dataType and get content-type in the process
	while ( dataTypes[ 0 ] === "*" ) {
		dataTypes.shift();
		if ( ct === undefined ) {
			ct = s.mimeType || jqXHR.getResponseHeader("Content-Type");
		}
	}

	// Check if we're dealing with a known content-type
	if ( ct ) {
		for ( type in contents ) {
			if ( contents[ type ] && contents[ type ].test( ct ) ) {
				dataTypes.unshift( type );
				break;
			}
		}
	}

	// Check to see if we have a response for the expected dataType
	if ( dataTypes[ 0 ] in responses ) {
		finalDataType = dataTypes[ 0 ];
	} else {
		// Try convertible dataTypes
		for ( type in responses ) {
			if ( !dataTypes[ 0 ] || s.converters[ type + " " + dataTypes[0] ] ) {
				finalDataType = type;
				break;
			}
			if ( !firstDataType ) {
				firstDataType = type;
			}
		}
		// Or just use first one
		finalDataType = finalDataType || firstDataType;
	}

	// If we found a dataType
	// We add the dataType to the list if needed
	// and return the corresponding response
	if ( finalDataType ) {
		if ( finalDataType !== dataTypes[ 0 ] ) {
			dataTypes.unshift( finalDataType );
		}
		return responses[ finalDataType ];
	}
}

/* Chain conversions given the request and the original response
 * Also sets the responseXXX fields on the jqXHR instance
 */
function ajaxConvert( s, response, jqXHR, isSuccess ) {
	var conv2, current, conv, tmp, prev,
		converters = {},
		// Work with a copy of dataTypes in case we need to modify it for conversion
		dataTypes = s.dataTypes.slice();

	// Create converters map with lowercased keys
	if ( dataTypes[ 1 ] ) {
		for ( conv in s.converters ) {
			converters[ conv.toLowerCase() ] = s.converters[ conv ];
		}
	}

	current = dataTypes.shift();

	// Convert to each sequential dataType
	while ( current ) {

		if ( s.responseFields[ current ] ) {
			jqXHR[ s.responseFields[ current ] ] = response;
		}

		// Apply the dataFilter if provided
		if ( !prev && isSuccess && s.dataFilter ) {
			response = s.dataFilter( response, s.dataType );
		}

		prev = current;
		current = dataTypes.shift();

		if ( current ) {

		// There's only work to do if current dataType is non-auto
			if ( current === "*" ) {

				current = prev;

			// Convert response if prev dataType is non-auto and differs from current
			} else if ( prev !== "*" && prev !== current ) {

				// Seek a direct converter
				conv = converters[ prev + " " + current ] || converters[ "* " + current ];

				// If none found, seek a pair
				if ( !conv ) {
					for ( conv2 in converters ) {

						// If conv2 outputs current
						tmp = conv2.split( " " );
						if ( tmp[ 1 ] === current ) {

							// If prev can be converted to accepted input
							conv = converters[ prev + " " + tmp[ 0 ] ] ||
								converters[ "* " + tmp[ 0 ] ];
							if ( conv ) {
								// Condense equivalence converters
								if ( conv === true ) {
									conv = converters[ conv2 ];

								// Otherwise, insert the intermediate dataType
								} else if ( converters[ conv2 ] !== true ) {
									current = tmp[ 0 ];
									dataTypes.unshift( tmp[ 1 ] );
								}
								break;
							}
						}
					}
				}

				// Apply converter (if not an equivalence)
				if ( conv !== true ) {

					// Unless errors are allowed to bubble, catch and return them
					if ( conv && s[ "throws" ] ) {
						response = conv( response );
					} else {
						try {
							response = conv( response );
						} catch ( e ) {
							return { state: "parsererror", error: conv ? e : "No conversion from " + prev + " to " + current };
						}
					}
				}
			}
		}
	}

	return { state: "success", data: response };
}

jQuery.extend({

	// Counter for holding the number of active queries
	active: 0,

	// Last-Modified header cache for next request
	lastModified: {},
	etag: {},

	ajaxSettings: {
		url: ajaxLocation,
		type: "GET",
		isLocal: rlocalProtocol.test( ajaxLocParts[ 1 ] ),
		global: true,
		processData: true,
		async: true,
		contentType: "application/x-www-form-urlencoded; charset=UTF-8",
		/*
		timeout: 0,
		data: null,
		dataType: null,
		username: null,
		password: null,
		cache: null,
		throws: false,
		traditional: false,
		headers: {},
		*/

		accepts: {
			"*": allTypes,
			text: "text/plain",
			html: "text/html",
			xml: "application/xml, text/xml",
			json: "application/json, text/javascript"
		},

		contents: {
			xml: /xml/,
			html: /html/,
			json: /json/
		},

		responseFields: {
			xml: "responseXML",
			text: "responseText",
			json: "responseJSON"
		},

		// Data converters
		// Keys separate source (or catchall "*") and destination types with a single space
		converters: {

			// Convert anything to text
			"* text": String,

			// Text to html (true = no transformation)
			"text html": true,

			// Evaluate text as a json expression
			"text json": jQuery.parseJSON,

			// Parse text as xml
			"text xml": jQuery.parseXML
		},

		// For options that shouldn't be deep extended:
		// you can add your own custom options here if
		// and when you create one that shouldn't be
		// deep extended (see ajaxExtend)
		flatOptions: {
			url: true,
			context: true
		}
	},

	// Creates a full fledged settings object into target
	// with both ajaxSettings and settings fields.
	// If target is omitted, writes into ajaxSettings.
	ajaxSetup: function( target, settings ) {
		return settings ?

			// Building a settings object
			ajaxExtend( ajaxExtend( target, jQuery.ajaxSettings ), settings ) :

			// Extending ajaxSettings
			ajaxExtend( jQuery.ajaxSettings, target );
	},

	ajaxPrefilter: addToPrefiltersOrTransports( prefilters ),
	ajaxTransport: addToPrefiltersOrTransports( transports ),

	// Main method
	ajax: function( url, options ) {

		// If url is an object, simulate pre-1.5 signature
		if ( typeof url === "object" ) {
			options = url;
			url = undefined;
		}

		// Force options to be an object
		options = options || {};

		var transport,
			// URL without anti-cache param
			cacheURL,
			// Response headers
			responseHeadersString,
			responseHeaders,
			// timeout handle
			timeoutTimer,
			// Cross-domain detection vars
			parts,
			// To know if global events are to be dispatched
			fireGlobals,
			// Loop variable
			i,
			// Create the final options object
			s = jQuery.ajaxSetup( {}, options ),
			// Callbacks context
			callbackContext = s.context || s,
			// Context for global events is callbackContext if it is a DOM node or jQuery collection
			globalEventContext = s.context && ( callbackContext.nodeType || callbackContext.jquery ) ?
				jQuery( callbackContext ) :
				jQuery.event,
			// Deferreds
			deferred = jQuery.Deferred(),
			completeDeferred = jQuery.Callbacks("once memory"),
			// Status-dependent callbacks
			statusCode = s.statusCode || {},
			// Headers (they are sent all at once)
			requestHeaders = {},
			requestHeadersNames = {},
			// The jqXHR state
			state = 0,
			// Default abort message
			strAbort = "canceled",
			// Fake xhr
			jqXHR = {
				readyState: 0,

				// Builds headers hashtable if needed
				getResponseHeader: function( key ) {
					var match;
					if ( state === 2 ) {
						if ( !responseHeaders ) {
							responseHeaders = {};
							while ( (match = rheaders.exec( responseHeadersString )) ) {
								responseHeaders[ match[1].toLowerCase() ] = match[ 2 ];
							}
						}
						match = responseHeaders[ key.toLowerCase() ];
					}
					return match == null ? null : match;
				},

				// Raw string
				getAllResponseHeaders: function() {
					return state === 2 ? responseHeadersString : null;
				},

				// Caches the header
				setRequestHeader: function( name, value ) {
					var lname = name.toLowerCase();
					if ( !state ) {
						name = requestHeadersNames[ lname ] = requestHeadersNames[ lname ] || name;
						requestHeaders[ name ] = value;
					}
					return this;
				},

				// Overrides response content-type header
				overrideMimeType: function( type ) {
					if ( !state ) {
						s.mimeType = type;
					}
					return this;
				},

				// Status-dependent callbacks
				statusCode: function( map ) {
					var code;
					if ( map ) {
						if ( state < 2 ) {
							for ( code in map ) {
								// Lazy-add the new callback in a way that preserves old ones
								statusCode[ code ] = [ statusCode[ code ], map[ code ] ];
							}
						} else {
							// Execute the appropriate callbacks
							jqXHR.always( map[ jqXHR.status ] );
						}
					}
					return this;
				},

				// Cancel the request
				abort: function( statusText ) {
					var finalText = statusText || strAbort;
					if ( transport ) {
						transport.abort( finalText );
					}
					done( 0, finalText );
					return this;
				}
			};

		// Attach deferreds
		deferred.promise( jqXHR ).complete = completeDeferred.add;
		jqXHR.success = jqXHR.done;
		jqXHR.error = jqXHR.fail;

		// Remove hash character (#7531: and string promotion)
		// Add protocol if not provided (prefilters might expect it)
		// Handle falsy url in the settings object (#10093: consistency with old signature)
		// We also use the url parameter if available
		s.url = ( ( url || s.url || ajaxLocation ) + "" ).replace( rhash, "" )
			.replace( rprotocol, ajaxLocParts[ 1 ] + "//" );

		// Alias method option to type as per ticket #12004
		s.type = options.method || options.type || s.method || s.type;

		// Extract dataTypes list
		s.dataTypes = jQuery.trim( s.dataType || "*" ).toLowerCase().match( rnotwhite ) || [ "" ];

		// A cross-domain request is in order when we have a protocol:host:port mismatch
		if ( s.crossDomain == null ) {
			parts = rurl.exec( s.url.toLowerCase() );
			s.crossDomain = !!( parts &&
				( parts[ 1 ] !== ajaxLocParts[ 1 ] || parts[ 2 ] !== ajaxLocParts[ 2 ] ||
					( parts[ 3 ] || ( parts[ 1 ] === "http:" ? "80" : "443" ) ) !==
						( ajaxLocParts[ 3 ] || ( ajaxLocParts[ 1 ] === "http:" ? "80" : "443" ) ) )
			);
		}

		// Convert data if not already a string
		if ( s.data && s.processData && typeof s.data !== "string" ) {
			s.data = jQuery.param( s.data, s.traditional );
		}

		// Apply prefilters
		inspectPrefiltersOrTransports( prefilters, s, options, jqXHR );

		// If request was aborted inside a prefilter, stop there
		if ( state === 2 ) {
			return jqXHR;
		}

		// We can fire global events as of now if asked to
		// Don't fire events if jQuery.event is undefined in an AMD-usage scenario (#15118)
		fireGlobals = jQuery.event && s.global;

		// Watch for a new set of requests
		if ( fireGlobals && jQuery.active++ === 0 ) {
			jQuery.event.trigger("ajaxStart");
		}

		// Uppercase the type
		s.type = s.type.toUpperCase();

		// Determine if request has content
		s.hasContent = !rnoContent.test( s.type );

		// Save the URL in case we're toying with the If-Modified-Since
		// and/or If-None-Match header later on
		cacheURL = s.url;

		// More options handling for requests with no content
		if ( !s.hasContent ) {

			// If data is available, append data to url
			if ( s.data ) {
				cacheURL = ( s.url += ( rquery.test( cacheURL ) ? "&" : "?" ) + s.data );
				// #9682: remove data so that it's not used in an eventual retry
				delete s.data;
			}

			// Add anti-cache in url if needed
			if ( s.cache === false ) {
				s.url = rts.test( cacheURL ) ?

					// If there is already a '_' parameter, set its value
					cacheURL.replace( rts, "$1_=" + nonce++ ) :

					// Otherwise add one to the end
					cacheURL + ( rquery.test( cacheURL ) ? "&" : "?" ) + "_=" + nonce++;
			}
		}

		// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
		if ( s.ifModified ) {
			if ( jQuery.lastModified[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-Modified-Since", jQuery.lastModified[ cacheURL ] );
			}
			if ( jQuery.etag[ cacheURL ] ) {
				jqXHR.setRequestHeader( "If-None-Match", jQuery.etag[ cacheURL ] );
			}
		}

		// Set the correct header, if data is being sent
		if ( s.data && s.hasContent && s.contentType !== false || options.contentType ) {
			jqXHR.setRequestHeader( "Content-Type", s.contentType );
		}

		// Set the Accepts header for the server, depending on the dataType
		jqXHR.setRequestHeader(
			"Accept",
			s.dataTypes[ 0 ] && s.accepts[ s.dataTypes[0] ] ?
				s.accepts[ s.dataTypes[0] ] + ( s.dataTypes[ 0 ] !== "*" ? ", " + allTypes + "; q=0.01" : "" ) :
				s.accepts[ "*" ]
		);

		// Check for headers option
		for ( i in s.headers ) {
			jqXHR.setRequestHeader( i, s.headers[ i ] );
		}

		// Allow custom headers/mimetypes and early abort
		if ( s.beforeSend && ( s.beforeSend.call( callbackContext, jqXHR, s ) === false || state === 2 ) ) {
			// Abort if not done already and return
			return jqXHR.abort();
		}

		// Aborting is no longer a cancellation
		strAbort = "abort";

		// Install callbacks on deferreds
		for ( i in { success: 1, error: 1, complete: 1 } ) {
			jqXHR[ i ]( s[ i ] );
		}

		// Get transport
		transport = inspectPrefiltersOrTransports( transports, s, options, jqXHR );

		// If no transport, we auto-abort
		if ( !transport ) {
			done( -1, "No Transport" );
		} else {
			jqXHR.readyState = 1;

			// Send global event
			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxSend", [ jqXHR, s ] );
			}
			// Timeout
			if ( s.async && s.timeout > 0 ) {
				timeoutTimer = setTimeout(function() {
					jqXHR.abort("timeout");
				}, s.timeout );
			}

			try {
				state = 1;
				transport.send( requestHeaders, done );
			} catch ( e ) {
				// Propagate exception as error if not done
				if ( state < 2 ) {
					done( -1, e );
				// Simply rethrow otherwise
				} else {
					throw e;
				}
			}
		}

		// Callback for when everything is done
		function done( status, nativeStatusText, responses, headers ) {
			var isSuccess, success, error, response, modified,
				statusText = nativeStatusText;

			// Called once
			if ( state === 2 ) {
				return;
			}

			// State is "done" now
			state = 2;

			// Clear timeout if it exists
			if ( timeoutTimer ) {
				clearTimeout( timeoutTimer );
			}

			// Dereference transport for early garbage collection
			// (no matter how long the jqXHR object will be used)
			transport = undefined;

			// Cache response headers
			responseHeadersString = headers || "";

			// Set readyState
			jqXHR.readyState = status > 0 ? 4 : 0;

			// Determine if successful
			isSuccess = status >= 200 && status < 300 || status === 304;

			// Get response data
			if ( responses ) {
				response = ajaxHandleResponses( s, jqXHR, responses );
			}

			// Convert no matter what (that way responseXXX fields are always set)
			response = ajaxConvert( s, response, jqXHR, isSuccess );

			// If successful, handle type chaining
			if ( isSuccess ) {

				// Set the If-Modified-Since and/or If-None-Match header, if in ifModified mode.
				if ( s.ifModified ) {
					modified = jqXHR.getResponseHeader("Last-Modified");
					if ( modified ) {
						jQuery.lastModified[ cacheURL ] = modified;
					}
					modified = jqXHR.getResponseHeader("etag");
					if ( modified ) {
						jQuery.etag[ cacheURL ] = modified;
					}
				}

				// if no content
				if ( status === 204 || s.type === "HEAD" ) {
					statusText = "nocontent";

				// if not modified
				} else if ( status === 304 ) {
					statusText = "notmodified";

				// If we have data, let's convert it
				} else {
					statusText = response.state;
					success = response.data;
					error = response.error;
					isSuccess = !error;
				}
			} else {
				// Extract error from statusText and normalize for non-aborts
				error = statusText;
				if ( status || !statusText ) {
					statusText = "error";
					if ( status < 0 ) {
						status = 0;
					}
				}
			}

			// Set data for the fake xhr object
			jqXHR.status = status;
			jqXHR.statusText = ( nativeStatusText || statusText ) + "";

			// Success/Error
			if ( isSuccess ) {
				deferred.resolveWith( callbackContext, [ success, statusText, jqXHR ] );
			} else {
				deferred.rejectWith( callbackContext, [ jqXHR, statusText, error ] );
			}

			// Status-dependent callbacks
			jqXHR.statusCode( statusCode );
			statusCode = undefined;

			if ( fireGlobals ) {
				globalEventContext.trigger( isSuccess ? "ajaxSuccess" : "ajaxError",
					[ jqXHR, s, isSuccess ? success : error ] );
			}

			// Complete
			completeDeferred.fireWith( callbackContext, [ jqXHR, statusText ] );

			if ( fireGlobals ) {
				globalEventContext.trigger( "ajaxComplete", [ jqXHR, s ] );
				// Handle the global AJAX counter
				if ( !( --jQuery.active ) ) {
					jQuery.event.trigger("ajaxStop");
				}
			}
		}

		return jqXHR;
	},

	getJSON: function( url, data, callback ) {
		return jQuery.get( url, data, callback, "json" );
	},

	getScript: function( url, callback ) {
		return jQuery.get( url, undefined, callback, "script" );
	}
});

jQuery.each( [ "get", "post" ], function( i, method ) {
	jQuery[ method ] = function( url, data, callback, type ) {
		// Shift arguments if data argument was omitted
		if ( jQuery.isFunction( data ) ) {
			type = type || callback;
			callback = data;
			data = undefined;
		}

		return jQuery.ajax({
			url: url,
			type: method,
			dataType: type,
			data: data,
			success: callback
		});
	};
});


jQuery._evalUrl = function( url ) {
	return jQuery.ajax({
		url: url,
		type: "GET",
		dataType: "script",
		async: false,
		global: false,
		"throws": true
	});
};


jQuery.fn.extend({
	wrapAll: function( html ) {
		var wrap;

		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapAll( html.call(this, i) );
			});
		}

		if ( this[ 0 ] ) {

			// The elements to wrap the target around
			wrap = jQuery( html, this[ 0 ].ownerDocument ).eq( 0 ).clone( true );

			if ( this[ 0 ].parentNode ) {
				wrap.insertBefore( this[ 0 ] );
			}

			wrap.map(function() {
				var elem = this;

				while ( elem.firstElementChild ) {
					elem = elem.firstElementChild;
				}

				return elem;
			}).append( this );
		}

		return this;
	},

	wrapInner: function( html ) {
		if ( jQuery.isFunction( html ) ) {
			return this.each(function( i ) {
				jQuery( this ).wrapInner( html.call(this, i) );
			});
		}

		return this.each(function() {
			var self = jQuery( this ),
				contents = self.contents();

			if ( contents.length ) {
				contents.wrapAll( html );

			} else {
				self.append( html );
			}
		});
	},

	wrap: function( html ) {
		var isFunction = jQuery.isFunction( html );

		return this.each(function( i ) {
			jQuery( this ).wrapAll( isFunction ? html.call(this, i) : html );
		});
	},

	unwrap: function() {
		return this.parent().each(function() {
			if ( !jQuery.nodeName( this, "body" ) ) {
				jQuery( this ).replaceWith( this.childNodes );
			}
		}).end();
	}
});


jQuery.expr.filters.hidden = function( elem ) {
	// Support: Opera <= 12.12
	// Opera reports offsetWidths and offsetHeights less than zero on some elements
	return elem.offsetWidth <= 0 && elem.offsetHeight <= 0;
};
jQuery.expr.filters.visible = function( elem ) {
	return !jQuery.expr.filters.hidden( elem );
};




var r20 = /%20/g,
	rbracket = /\[\]$/,
	rCRLF = /\r?\n/g,
	rsubmitterTypes = /^(?:submit|button|image|reset|file)$/i,
	rsubmittable = /^(?:input|select|textarea|keygen)/i;

function buildParams( prefix, obj, traditional, add ) {
	var name;

	if ( jQuery.isArray( obj ) ) {
		// Serialize array item.
		jQuery.each( obj, function( i, v ) {
			if ( traditional || rbracket.test( prefix ) ) {
				// Treat each array item as a scalar.
				add( prefix, v );

			} else {
				// Item is non-scalar (array or object), encode its numeric index.
				buildParams( prefix + "[" + ( typeof v === "object" ? i : "" ) + "]", v, traditional, add );
			}
		});

	} else if ( !traditional && jQuery.type( obj ) === "object" ) {
		// Serialize object item.
		for ( name in obj ) {
			buildParams( prefix + "[" + name + "]", obj[ name ], traditional, add );
		}

	} else {
		// Serialize scalar item.
		add( prefix, obj );
	}
}

// Serialize an array of form elements or a set of
// key/values into a query string
jQuery.param = function( a, traditional ) {
	var prefix,
		s = [],
		add = function( key, value ) {
			// If value is a function, invoke it and return its value
			value = jQuery.isFunction( value ) ? value() : ( value == null ? "" : value );
			s[ s.length ] = encodeURIComponent( key ) + "=" + encodeURIComponent( value );
		};

	// Set traditional to true for jQuery <= 1.3.2 behavior.
	if ( traditional === undefined ) {
		traditional = jQuery.ajaxSettings && jQuery.ajaxSettings.traditional;
	}

	// If an array was passed in, assume that it is an array of form elements.
	if ( jQuery.isArray( a ) || ( a.jquery && !jQuery.isPlainObject( a ) ) ) {
		// Serialize the form elements
		jQuery.each( a, function() {
			add( this.name, this.value );
		});

	} else {
		// If traditional, encode the "old" way (the way 1.3.2 or older
		// did it), otherwise encode params recursively.
		for ( prefix in a ) {
			buildParams( prefix, a[ prefix ], traditional, add );
		}
	}

	// Return the resulting serialization
	return s.join( "&" ).replace( r20, "+" );
};

jQuery.fn.extend({
	serialize: function() {
		return jQuery.param( this.serializeArray() );
	},
	serializeArray: function() {
		return this.map(function() {
			// Can add propHook for "elements" to filter or add form elements
			var elements = jQuery.prop( this, "elements" );
			return elements ? jQuery.makeArray( elements ) : this;
		})
		.filter(function() {
			var type = this.type;

			// Use .is( ":disabled" ) so that fieldset[disabled] works
			return this.name && !jQuery( this ).is( ":disabled" ) &&
				rsubmittable.test( this.nodeName ) && !rsubmitterTypes.test( type ) &&
				( this.checked || !rcheckableType.test( type ) );
		})
		.map(function( i, elem ) {
			var val = jQuery( this ).val();

			return val == null ?
				null :
				jQuery.isArray( val ) ?
					jQuery.map( val, function( val ) {
						return { name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
					}) :
					{ name: elem.name, value: val.replace( rCRLF, "\r\n" ) };
		}).get();
	}
});


jQuery.ajaxSettings.xhr = function() {
	try {
		return new XMLHttpRequest();
	} catch( e ) {}
};

var xhrId = 0,
	xhrCallbacks = {},
	xhrSuccessStatus = {
		// file protocol always yields status code 0, assume 200
		0: 200,
		// Support: IE9
		// #1450: sometimes IE returns 1223 when it should be 204
		1223: 204
	},
	xhrSupported = jQuery.ajaxSettings.xhr();

// Support: IE9
// Open requests must be manually aborted on unload (#5280)
// See https://support.microsoft.com/kb/2856746 for more info
if ( window.attachEvent ) {
	window.attachEvent( "onunload", function() {
		for ( var key in xhrCallbacks ) {
			xhrCallbacks[ key ]();
		}
	});
}

support.cors = !!xhrSupported && ( "withCredentials" in xhrSupported );
support.ajax = xhrSupported = !!xhrSupported;

jQuery.ajaxTransport(function( options ) {
	var callback;

	// Cross domain only allowed if supported through XMLHttpRequest
	if ( support.cors || xhrSupported && !options.crossDomain ) {
		return {
			send: function( headers, complete ) {
				var i,
					xhr = options.xhr(),
					id = ++xhrId;

				xhr.open( options.type, options.url, options.async, options.username, options.password );

				// Apply custom fields if provided
				if ( options.xhrFields ) {
					for ( i in options.xhrFields ) {
						xhr[ i ] = options.xhrFields[ i ];
					}
				}

				// Override mime type if needed
				if ( options.mimeType && xhr.overrideMimeType ) {
					xhr.overrideMimeType( options.mimeType );
				}

				// X-Requested-With header
				// For cross-domain requests, seeing as conditions for a preflight are
				// akin to a jigsaw puzzle, we simply never set it to be sure.
				// (it can always be set on a per-request basis or even using ajaxSetup)
				// For same-domain requests, won't change header if already provided.
				if ( !options.crossDomain && !headers["X-Requested-With"] ) {
					headers["X-Requested-With"] = "XMLHttpRequest";
				}

				// Set headers
				for ( i in headers ) {
					xhr.setRequestHeader( i, headers[ i ] );
				}

				// Callback
				callback = function( type ) {
					return function() {
						if ( callback ) {
							delete xhrCallbacks[ id ];
							callback = xhr.onload = xhr.onerror = null;

							if ( type === "abort" ) {
								xhr.abort();
							} else if ( type === "error" ) {
								complete(
									// file: protocol always yields status 0; see #8605, #14207
									xhr.status,
									xhr.statusText
								);
							} else {
								complete(
									xhrSuccessStatus[ xhr.status ] || xhr.status,
									xhr.statusText,
									// Support: IE9
									// Accessing binary-data responseText throws an exception
									// (#11426)
									typeof xhr.responseText === "string" ? {
										text: xhr.responseText
									} : undefined,
									xhr.getAllResponseHeaders()
								);
							}
						}
					};
				};

				// Listen to events
				xhr.onload = callback();
				xhr.onerror = callback("error");

				// Create the abort callback
				callback = xhrCallbacks[ id ] = callback("abort");

				try {
					// Do send the request (this may raise an exception)
					xhr.send( options.hasContent && options.data || null );
				} catch ( e ) {
					// #14683: Only rethrow if this hasn't been notified as an error yet
					if ( callback ) {
						throw e;
					}
				}
			},

			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




// Install script dataType
jQuery.ajaxSetup({
	accepts: {
		script: "text/javascript, application/javascript, application/ecmascript, application/x-ecmascript"
	},
	contents: {
		script: /(?:java|ecma)script/
	},
	converters: {
		"text script": function( text ) {
			jQuery.globalEval( text );
			return text;
		}
	}
});

// Handle cache's special case and crossDomain
jQuery.ajaxPrefilter( "script", function( s ) {
	if ( s.cache === undefined ) {
		s.cache = false;
	}
	if ( s.crossDomain ) {
		s.type = "GET";
	}
});

// Bind script tag hack transport
jQuery.ajaxTransport( "script", function( s ) {
	// This transport only deals with cross domain requests
	if ( s.crossDomain ) {
		var script, callback;
		return {
			send: function( _, complete ) {
				script = jQuery("<script>").prop({
					async: true,
					charset: s.scriptCharset,
					src: s.url
				}).on(
					"load error",
					callback = function( evt ) {
						script.remove();
						callback = null;
						if ( evt ) {
							complete( evt.type === "error" ? 404 : 200, evt.type );
						}
					}
				);
				document.head.appendChild( script[ 0 ] );
			},
			abort: function() {
				if ( callback ) {
					callback();
				}
			}
		};
	}
});




var oldCallbacks = [],
	rjsonp = /(=)\?(?=&|$)|\?\?/;

// Default jsonp settings
jQuery.ajaxSetup({
	jsonp: "callback",
	jsonpCallback: function() {
		var callback = oldCallbacks.pop() || ( jQuery.expando + "_" + ( nonce++ ) );
		this[ callback ] = true;
		return callback;
	}
});

// Detect, normalize options and install callbacks for jsonp requests
jQuery.ajaxPrefilter( "json jsonp", function( s, originalSettings, jqXHR ) {

	var callbackName, overwritten, responseContainer,
		jsonProp = s.jsonp !== false && ( rjsonp.test( s.url ) ?
			"url" :
			typeof s.data === "string" && !( s.contentType || "" ).indexOf("application/x-www-form-urlencoded") && rjsonp.test( s.data ) && "data"
		);

	// Handle iff the expected data type is "jsonp" or we have a parameter to set
	if ( jsonProp || s.dataTypes[ 0 ] === "jsonp" ) {

		// Get callback name, remembering preexisting value associated with it
		callbackName = s.jsonpCallback = jQuery.isFunction( s.jsonpCallback ) ?
			s.jsonpCallback() :
			s.jsonpCallback;

		// Insert callback into url or form data
		if ( jsonProp ) {
			s[ jsonProp ] = s[ jsonProp ].replace( rjsonp, "$1" + callbackName );
		} else if ( s.jsonp !== false ) {
			s.url += ( rquery.test( s.url ) ? "&" : "?" ) + s.jsonp + "=" + callbackName;
		}

		// Use data converter to retrieve json after script execution
		s.converters["script json"] = function() {
			if ( !responseContainer ) {
				jQuery.error( callbackName + " was not called" );
			}
			return responseContainer[ 0 ];
		};

		// force json dataType
		s.dataTypes[ 0 ] = "json";

		// Install callback
		overwritten = window[ callbackName ];
		window[ callbackName ] = function() {
			responseContainer = arguments;
		};

		// Clean-up function (fires after converters)
		jqXHR.always(function() {
			// Restore preexisting value
			window[ callbackName ] = overwritten;

			// Save back as free
			if ( s[ callbackName ] ) {
				// make sure that re-using the options doesn't screw things around
				s.jsonpCallback = originalSettings.jsonpCallback;

				// save the callback name for future use
				oldCallbacks.push( callbackName );
			}

			// Call if it was a function and we have a response
			if ( responseContainer && jQuery.isFunction( overwritten ) ) {
				overwritten( responseContainer[ 0 ] );
			}

			responseContainer = overwritten = undefined;
		});

		// Delegate to script
		return "script";
	}
});




// data: string of html
// context (optional): If specified, the fragment will be created in this context, defaults to document
// keepScripts (optional): If true, will include scripts passed in the html string
jQuery.parseHTML = function( data, context, keepScripts ) {
	if ( !data || typeof data !== "string" ) {
		return null;
	}
	if ( typeof context === "boolean" ) {
		keepScripts = context;
		context = false;
	}
	context = context || document;

	var parsed = rsingleTag.exec( data ),
		scripts = !keepScripts && [];

	// Single tag
	if ( parsed ) {
		return [ context.createElement( parsed[1] ) ];
	}

	parsed = jQuery.buildFragment( [ data ], context, scripts );

	if ( scripts && scripts.length ) {
		jQuery( scripts ).remove();
	}

	return jQuery.merge( [], parsed.childNodes );
};


// Keep a copy of the old load method
var _load = jQuery.fn.load;

/**
 * Load a url into a page
 */
jQuery.fn.load = function( url, params, callback ) {
	if ( typeof url !== "string" && _load ) {
		return _load.apply( this, arguments );
	}

	var selector, type, response,
		self = this,
		off = url.indexOf(" ");

	if ( off >= 0 ) {
		selector = jQuery.trim( url.slice( off ) );
		url = url.slice( 0, off );
	}

	// If it's a function
	if ( jQuery.isFunction( params ) ) {

		// We assume that it's the callback
		callback = params;
		params = undefined;

	// Otherwise, build a param string
	} else if ( params && typeof params === "object" ) {
		type = "POST";
	}

	// If we have elements to modify, make the request
	if ( self.length > 0 ) {
		jQuery.ajax({
			url: url,

			// if "type" variable is undefined, then "GET" method will be used
			type: type,
			dataType: "html",
			data: params
		}).done(function( responseText ) {

			// Save response for use in complete callback
			response = arguments;

			self.html( selector ?

				// If a selector was specified, locate the right elements in a dummy div
				// Exclude scripts to avoid IE 'Permission Denied' errors
				jQuery("<div>").append( jQuery.parseHTML( responseText ) ).find( selector ) :

				// Otherwise use the full result
				responseText );

		}).complete( callback && function( jqXHR, status ) {
			self.each( callback, response || [ jqXHR.responseText, status, jqXHR ] );
		});
	}

	return this;
};




// Attach a bunch of functions for handling common AJAX events
jQuery.each( [ "ajaxStart", "ajaxStop", "ajaxComplete", "ajaxError", "ajaxSuccess", "ajaxSend" ], function( i, type ) {
	jQuery.fn[ type ] = function( fn ) {
		return this.on( type, fn );
	};
});




jQuery.expr.filters.animated = function( elem ) {
	return jQuery.grep(jQuery.timers, function( fn ) {
		return elem === fn.elem;
	}).length;
};




var docElem = window.document.documentElement;

/**
 * Gets a window from an element
 */
function getWindow( elem ) {
	return jQuery.isWindow( elem ) ? elem : elem.nodeType === 9 && elem.defaultView;
}

jQuery.offset = {
	setOffset: function( elem, options, i ) {
		var curPosition, curLeft, curCSSTop, curTop, curOffset, curCSSLeft, calculatePosition,
			position = jQuery.css( elem, "position" ),
			curElem = jQuery( elem ),
			props = {};

		// Set position first, in-case top/left are set even on static elem
		if ( position === "static" ) {
			elem.style.position = "relative";
		}

		curOffset = curElem.offset();
		curCSSTop = jQuery.css( elem, "top" );
		curCSSLeft = jQuery.css( elem, "left" );
		calculatePosition = ( position === "absolute" || position === "fixed" ) &&
			( curCSSTop + curCSSLeft ).indexOf("auto") > -1;

		// Need to be able to calculate position if either
		// top or left is auto and position is either absolute or fixed
		if ( calculatePosition ) {
			curPosition = curElem.position();
			curTop = curPosition.top;
			curLeft = curPosition.left;

		} else {
			curTop = parseFloat( curCSSTop ) || 0;
			curLeft = parseFloat( curCSSLeft ) || 0;
		}

		if ( jQuery.isFunction( options ) ) {
			options = options.call( elem, i, curOffset );
		}

		if ( options.top != null ) {
			props.top = ( options.top - curOffset.top ) + curTop;
		}
		if ( options.left != null ) {
			props.left = ( options.left - curOffset.left ) + curLeft;
		}

		if ( "using" in options ) {
			options.using.call( elem, props );

		} else {
			curElem.css( props );
		}
	}
};

jQuery.fn.extend({
	offset: function( options ) {
		if ( arguments.length ) {
			return options === undefined ?
				this :
				this.each(function( i ) {
					jQuery.offset.setOffset( this, options, i );
				});
		}

		var docElem, win,
			elem = this[ 0 ],
			box = { top: 0, left: 0 },
			doc = elem && elem.ownerDocument;

		if ( !doc ) {
			return;
		}

		docElem = doc.documentElement;

		// Make sure it's not a disconnected DOM node
		if ( !jQuery.contains( docElem, elem ) ) {
			return box;
		}

		// Support: BlackBerry 5, iOS 3 (original iPhone)
		// If we don't have gBCR, just use 0,0 rather than error
		if ( typeof elem.getBoundingClientRect !== strundefined ) {
			box = elem.getBoundingClientRect();
		}
		win = getWindow( doc );
		return {
			top: box.top + win.pageYOffset - docElem.clientTop,
			left: box.left + win.pageXOffset - docElem.clientLeft
		};
	},

	position: function() {
		if ( !this[ 0 ] ) {
			return;
		}

		var offsetParent, offset,
			elem = this[ 0 ],
			parentOffset = { top: 0, left: 0 };

		// Fixed elements are offset from window (parentOffset = {top:0, left: 0}, because it is its only offset parent
		if ( jQuery.css( elem, "position" ) === "fixed" ) {
			// Assume getBoundingClientRect is there when computed position is fixed
			offset = elem.getBoundingClientRect();

		} else {
			// Get *real* offsetParent
			offsetParent = this.offsetParent();

			// Get correct offsets
			offset = this.offset();
			if ( !jQuery.nodeName( offsetParent[ 0 ], "html" ) ) {
				parentOffset = offsetParent.offset();
			}

			// Add offsetParent borders
			parentOffset.top += jQuery.css( offsetParent[ 0 ], "borderTopWidth", true );
			parentOffset.left += jQuery.css( offsetParent[ 0 ], "borderLeftWidth", true );
		}

		// Subtract parent offsets and element margins
		return {
			top: offset.top - parentOffset.top - jQuery.css( elem, "marginTop", true ),
			left: offset.left - parentOffset.left - jQuery.css( elem, "marginLeft", true )
		};
	},

	offsetParent: function() {
		return this.map(function() {
			var offsetParent = this.offsetParent || docElem;

			while ( offsetParent && ( !jQuery.nodeName( offsetParent, "html" ) && jQuery.css( offsetParent, "position" ) === "static" ) ) {
				offsetParent = offsetParent.offsetParent;
			}

			return offsetParent || docElem;
		});
	}
});

// Create scrollLeft and scrollTop methods
jQuery.each( { scrollLeft: "pageXOffset", scrollTop: "pageYOffset" }, function( method, prop ) {
	var top = "pageYOffset" === prop;

	jQuery.fn[ method ] = function( val ) {
		return access( this, function( elem, method, val ) {
			var win = getWindow( elem );

			if ( val === undefined ) {
				return win ? win[ prop ] : elem[ method ];
			}

			if ( win ) {
				win.scrollTo(
					!top ? val : window.pageXOffset,
					top ? val : window.pageYOffset
				);

			} else {
				elem[ method ] = val;
			}
		}, method, val, arguments.length, null );
	};
});

// Support: Safari<7+, Chrome<37+
// Add the top/left cssHooks using jQuery.fn.position
// Webkit bug: https://bugs.webkit.org/show_bug.cgi?id=29084
// Blink bug: https://code.google.com/p/chromium/issues/detail?id=229280
// getComputedStyle returns percent when specified for top/left/bottom/right;
// rather than make the css module depend on the offset module, just check for it here
jQuery.each( [ "top", "left" ], function( i, prop ) {
	jQuery.cssHooks[ prop ] = addGetHookIf( support.pixelPosition,
		function( elem, computed ) {
			if ( computed ) {
				computed = curCSS( elem, prop );
				// If curCSS returns percentage, fallback to offset
				return rnumnonpx.test( computed ) ?
					jQuery( elem ).position()[ prop ] + "px" :
					computed;
			}
		}
	);
});


// Create innerHeight, innerWidth, height, width, outerHeight and outerWidth methods
jQuery.each( { Height: "height", Width: "width" }, function( name, type ) {
	jQuery.each( { padding: "inner" + name, content: type, "": "outer" + name }, function( defaultExtra, funcName ) {
		// Margin is only for outerHeight, outerWidth
		jQuery.fn[ funcName ] = function( margin, value ) {
			var chainable = arguments.length && ( defaultExtra || typeof margin !== "boolean" ),
				extra = defaultExtra || ( margin === true || value === true ? "margin" : "border" );

			return access( this, function( elem, type, value ) {
				var doc;

				if ( jQuery.isWindow( elem ) ) {
					// As of 5/8/2012 this will yield incorrect results for Mobile Safari, but there
					// isn't a whole lot we can do. See pull request at this URL for discussion:
					// https://github.com/jquery/jquery/pull/764
					return elem.document.documentElement[ "client" + name ];
				}

				// Get document width or height
				if ( elem.nodeType === 9 ) {
					doc = elem.documentElement;

					// Either scroll[Width/Height] or offset[Width/Height] or client[Width/Height],
					// whichever is greatest
					return Math.max(
						elem.body[ "scroll" + name ], doc[ "scroll" + name ],
						elem.body[ "offset" + name ], doc[ "offset" + name ],
						doc[ "client" + name ]
					);
				}

				return value === undefined ?
					// Get width or height on the element, requesting but not forcing parseFloat
					jQuery.css( elem, type, extra ) :

					// Set width or height on the element
					jQuery.style( elem, type, value, extra );
			}, type, chainable ? margin : undefined, chainable, null );
		};
	});
});


// The number of elements contained in the matched element set
jQuery.fn.size = function() {
	return this.length;
};

jQuery.fn.andSelf = jQuery.fn.addBack;




// Register as a named AMD module, since jQuery can be concatenated with other
// files that may use define, but not via a proper concatenation script that
// understands anonymous AMD modules. A named AMD is safest and most robust
// way to register. Lowercase jquery is used because AMD module names are
// derived from file names, and jQuery is normally delivered in a lowercase
// file name. Do this after creating the global so that if an AMD module wants
// to call noConflict to hide this version of jQuery, it will work.

// Note that for maximum portability, libraries that are not jQuery should
// declare themselves as anonymous modules, and avoid setting a global if an
// AMD loader is present. jQuery is a special case. For more information, see
// https://github.com/jrburke/requirejs/wiki/Updating-existing-libraries#wiki-anon

if ( typeof define === "function" && define.amd ) {
	define( "jquery", [], function() {
		return jQuery;
	});
}




var
	// Map over jQuery in case of overwrite
	_jQuery = window.jQuery,

	// Map over the $ in case of overwrite
	_$ = window.$;

jQuery.noConflict = function( deep ) {
	if ( window.$ === jQuery ) {
		window.$ = _$;
	}

	if ( deep && window.jQuery === jQuery ) {
		window.jQuery = _jQuery;
	}

	return jQuery;
};

// Expose jQuery and $ identifiers, even in AMD
// (#7102#comment:10, https://github.com/jquery/jquery/pull/557)
// and CommonJS for browser emulators (#13566)
if ( typeof noGlobal === strundefined ) {
	window.jQuery = window.$ = jQuery;
}




return jQuery;

}));

},{}],9:[function(require,module,exports){
module.exports = require('cssify');
},{"cssify":10}],10:[function(require,module,exports){
module.exports = function (css, customDocument) {
  var doc = customDocument || document;
  if (doc.createStyleSheet) {
    doc.createStyleSheet().cssText = css;
  } else {
    var head = doc.getElementsByTagName('head')[0],
        style = doc.createElement('style');

    style.type = 'text/css';
  
    if (style.styleSheet) {
      style.styleSheet.cssText = css;
    } else {
      style.appendChild(doc.createTextNode(css));
    }
    
    head.appendChild(style); 
  }
};

module.exports.byUrl = function(url) {
  if (document.createStyleSheet) {
    document.createStyleSheet(url);
  } else {
    var head = document.getElementsByTagName('head')[0],
        link = document.createElement('link');

    link.rel = 'stylesheet';
    link.href = url;
  
    head.appendChild(link); 
  }
};

},{}],11:[function(require,module,exports){
//     Underscore.js 1.7.0
//     http://underscorejs.org
//     (c) 2009-2014 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
//     Underscore may be freely distributed under the MIT license.

(function() {

  // Baseline setup
  // --------------

  // Establish the root object, `window` in the browser, or `exports` on the server.
  var root = this;

  // Save the previous value of the `_` variable.
  var previousUnderscore = root._;

  // Save bytes in the minified (but not gzipped) version:
  var ArrayProto = Array.prototype, ObjProto = Object.prototype, FuncProto = Function.prototype;

  // Create quick reference variables for speed access to core prototypes.
  var
    push             = ArrayProto.push,
    slice            = ArrayProto.slice,
    concat           = ArrayProto.concat,
    toString         = ObjProto.toString,
    hasOwnProperty   = ObjProto.hasOwnProperty;

  // All **ECMAScript 5** native function implementations that we hope to use
  // are declared here.
  var
    nativeIsArray      = Array.isArray,
    nativeKeys         = Object.keys,
    nativeBind         = FuncProto.bind;

  // Create a safe reference to the Underscore object for use below.
  var _ = function(obj) {
    if (obj instanceof _) return obj;
    if (!(this instanceof _)) return new _(obj);
    this._wrapped = obj;
  };

  // Export the Underscore object for **Node.js**, with
  // backwards-compatibility for the old `require()` API. If we're in
  // the browser, add `_` as a global object.
  if (typeof exports !== 'undefined') {
    if (typeof module !== 'undefined' && module.exports) {
      exports = module.exports = _;
    }
    exports._ = _;
  } else {
    root._ = _;
  }

  // Current version.
  _.VERSION = '1.7.0';

  // Internal function that returns an efficient (for current engines) version
  // of the passed-in callback, to be repeatedly applied in other Underscore
  // functions.
  var createCallback = function(func, context, argCount) {
    if (context === void 0) return func;
    switch (argCount == null ? 3 : argCount) {
      case 1: return function(value) {
        return func.call(context, value);
      };
      case 2: return function(value, other) {
        return func.call(context, value, other);
      };
      case 3: return function(value, index, collection) {
        return func.call(context, value, index, collection);
      };
      case 4: return function(accumulator, value, index, collection) {
        return func.call(context, accumulator, value, index, collection);
      };
    }
    return function() {
      return func.apply(context, arguments);
    };
  };

  // A mostly-internal function to generate callbacks that can be applied
  // to each element in a collection, returning the desired result — either
  // identity, an arbitrary callback, a property matcher, or a property accessor.
  _.iteratee = function(value, context, argCount) {
    if (value == null) return _.identity;
    if (_.isFunction(value)) return createCallback(value, context, argCount);
    if (_.isObject(value)) return _.matches(value);
    return _.property(value);
  };

  // Collection Functions
  // --------------------

  // The cornerstone, an `each` implementation, aka `forEach`.
  // Handles raw objects in addition to array-likes. Treats all
  // sparse array-likes as if they were dense.
  _.each = _.forEach = function(obj, iteratee, context) {
    if (obj == null) return obj;
    iteratee = createCallback(iteratee, context);
    var i, length = obj.length;
    if (length === +length) {
      for (i = 0; i < length; i++) {
        iteratee(obj[i], i, obj);
      }
    } else {
      var keys = _.keys(obj);
      for (i = 0, length = keys.length; i < length; i++) {
        iteratee(obj[keys[i]], keys[i], obj);
      }
    }
    return obj;
  };

  // Return the results of applying the iteratee to each element.
  _.map = _.collect = function(obj, iteratee, context) {
    if (obj == null) return [];
    iteratee = _.iteratee(iteratee, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        results = Array(length),
        currentKey;
    for (var index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      results[index] = iteratee(obj[currentKey], currentKey, obj);
    }
    return results;
  };

  var reduceError = 'Reduce of empty array with no initial value';

  // **Reduce** builds up a single result from a list of values, aka `inject`,
  // or `foldl`.
  _.reduce = _.foldl = _.inject = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index = 0, currentKey;
    if (arguments.length < 3) {
      if (!length) throw new TypeError(reduceError);
      memo = obj[keys ? keys[index++] : index++];
    }
    for (; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // The right-associative version of reduce, also known as `foldr`.
  _.reduceRight = _.foldr = function(obj, iteratee, memo, context) {
    if (obj == null) obj = [];
    iteratee = createCallback(iteratee, context, 4);
    var keys = obj.length !== + obj.length && _.keys(obj),
        index = (keys || obj).length,
        currentKey;
    if (arguments.length < 3) {
      if (!index) throw new TypeError(reduceError);
      memo = obj[keys ? keys[--index] : --index];
    }
    while (index--) {
      currentKey = keys ? keys[index] : index;
      memo = iteratee(memo, obj[currentKey], currentKey, obj);
    }
    return memo;
  };

  // Return the first value which passes a truth test. Aliased as `detect`.
  _.find = _.detect = function(obj, predicate, context) {
    var result;
    predicate = _.iteratee(predicate, context);
    _.some(obj, function(value, index, list) {
      if (predicate(value, index, list)) {
        result = value;
        return true;
      }
    });
    return result;
  };

  // Return all the elements that pass a truth test.
  // Aliased as `select`.
  _.filter = _.select = function(obj, predicate, context) {
    var results = [];
    if (obj == null) return results;
    predicate = _.iteratee(predicate, context);
    _.each(obj, function(value, index, list) {
      if (predicate(value, index, list)) results.push(value);
    });
    return results;
  };

  // Return all the elements for which a truth test fails.
  _.reject = function(obj, predicate, context) {
    return _.filter(obj, _.negate(_.iteratee(predicate)), context);
  };

  // Determine whether all of the elements match a truth test.
  // Aliased as `all`.
  _.every = _.all = function(obj, predicate, context) {
    if (obj == null) return true;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (!predicate(obj[currentKey], currentKey, obj)) return false;
    }
    return true;
  };

  // Determine if at least one element in the object matches a truth test.
  // Aliased as `any`.
  _.some = _.any = function(obj, predicate, context) {
    if (obj == null) return false;
    predicate = _.iteratee(predicate, context);
    var keys = obj.length !== +obj.length && _.keys(obj),
        length = (keys || obj).length,
        index, currentKey;
    for (index = 0; index < length; index++) {
      currentKey = keys ? keys[index] : index;
      if (predicate(obj[currentKey], currentKey, obj)) return true;
    }
    return false;
  };

  // Determine if the array or object contains a given value (using `===`).
  // Aliased as `include`.
  _.contains = _.include = function(obj, target) {
    if (obj == null) return false;
    if (obj.length !== +obj.length) obj = _.values(obj);
    return _.indexOf(obj, target) >= 0;
  };

  // Invoke a method (with arguments) on every item in a collection.
  _.invoke = function(obj, method) {
    var args = slice.call(arguments, 2);
    var isFunc = _.isFunction(method);
    return _.map(obj, function(value) {
      return (isFunc ? method : value[method]).apply(value, args);
    });
  };

  // Convenience version of a common use case of `map`: fetching a property.
  _.pluck = function(obj, key) {
    return _.map(obj, _.property(key));
  };

  // Convenience version of a common use case of `filter`: selecting only objects
  // containing specific `key:value` pairs.
  _.where = function(obj, attrs) {
    return _.filter(obj, _.matches(attrs));
  };

  // Convenience version of a common use case of `find`: getting the first object
  // containing specific `key:value` pairs.
  _.findWhere = function(obj, attrs) {
    return _.find(obj, _.matches(attrs));
  };

  // Return the maximum element (or element-based computation).
  _.max = function(obj, iteratee, context) {
    var result = -Infinity, lastComputed = -Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value > result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed > lastComputed || computed === -Infinity && result === -Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Return the minimum element (or element-based computation).
  _.min = function(obj, iteratee, context) {
    var result = Infinity, lastComputed = Infinity,
        value, computed;
    if (iteratee == null && obj != null) {
      obj = obj.length === +obj.length ? obj : _.values(obj);
      for (var i = 0, length = obj.length; i < length; i++) {
        value = obj[i];
        if (value < result) {
          result = value;
        }
      }
    } else {
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index, list) {
        computed = iteratee(value, index, list);
        if (computed < lastComputed || computed === Infinity && result === Infinity) {
          result = value;
          lastComputed = computed;
        }
      });
    }
    return result;
  };

  // Shuffle a collection, using the modern version of the
  // [Fisher-Yates shuffle](http://en.wikipedia.org/wiki/Fisher–Yates_shuffle).
  _.shuffle = function(obj) {
    var set = obj && obj.length === +obj.length ? obj : _.values(obj);
    var length = set.length;
    var shuffled = Array(length);
    for (var index = 0, rand; index < length; index++) {
      rand = _.random(0, index);
      if (rand !== index) shuffled[index] = shuffled[rand];
      shuffled[rand] = set[index];
    }
    return shuffled;
  };

  // Sample **n** random values from a collection.
  // If **n** is not specified, returns a single random element.
  // The internal `guard` argument allows it to work with `map`.
  _.sample = function(obj, n, guard) {
    if (n == null || guard) {
      if (obj.length !== +obj.length) obj = _.values(obj);
      return obj[_.random(obj.length - 1)];
    }
    return _.shuffle(obj).slice(0, Math.max(0, n));
  };

  // Sort the object's values by a criterion produced by an iteratee.
  _.sortBy = function(obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context);
    return _.pluck(_.map(obj, function(value, index, list) {
      return {
        value: value,
        index: index,
        criteria: iteratee(value, index, list)
      };
    }).sort(function(left, right) {
      var a = left.criteria;
      var b = right.criteria;
      if (a !== b) {
        if (a > b || a === void 0) return 1;
        if (a < b || b === void 0) return -1;
      }
      return left.index - right.index;
    }), 'value');
  };

  // An internal function used for aggregate "group by" operations.
  var group = function(behavior) {
    return function(obj, iteratee, context) {
      var result = {};
      iteratee = _.iteratee(iteratee, context);
      _.each(obj, function(value, index) {
        var key = iteratee(value, index, obj);
        behavior(result, value, key);
      });
      return result;
    };
  };

  // Groups the object's values by a criterion. Pass either a string attribute
  // to group by, or a function that returns the criterion.
  _.groupBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key].push(value); else result[key] = [value];
  });

  // Indexes the object's values by a criterion, similar to `groupBy`, but for
  // when you know that your index values will be unique.
  _.indexBy = group(function(result, value, key) {
    result[key] = value;
  });

  // Counts instances of an object that group by a certain criterion. Pass
  // either a string attribute to count by, or a function that returns the
  // criterion.
  _.countBy = group(function(result, value, key) {
    if (_.has(result, key)) result[key]++; else result[key] = 1;
  });

  // Use a comparator function to figure out the smallest index at which
  // an object should be inserted so as to maintain order. Uses binary search.
  _.sortedIndex = function(array, obj, iteratee, context) {
    iteratee = _.iteratee(iteratee, context, 1);
    var value = iteratee(obj);
    var low = 0, high = array.length;
    while (low < high) {
      var mid = low + high >>> 1;
      if (iteratee(array[mid]) < value) low = mid + 1; else high = mid;
    }
    return low;
  };

  // Safely create a real, live array from anything iterable.
  _.toArray = function(obj) {
    if (!obj) return [];
    if (_.isArray(obj)) return slice.call(obj);
    if (obj.length === +obj.length) return _.map(obj, _.identity);
    return _.values(obj);
  };

  // Return the number of elements in an object.
  _.size = function(obj) {
    if (obj == null) return 0;
    return obj.length === +obj.length ? obj.length : _.keys(obj).length;
  };

  // Split a collection into two arrays: one whose elements all satisfy the given
  // predicate, and one whose elements all do not satisfy the predicate.
  _.partition = function(obj, predicate, context) {
    predicate = _.iteratee(predicate, context);
    var pass = [], fail = [];
    _.each(obj, function(value, key, obj) {
      (predicate(value, key, obj) ? pass : fail).push(value);
    });
    return [pass, fail];
  };

  // Array Functions
  // ---------------

  // Get the first element of an array. Passing **n** will return the first N
  // values in the array. Aliased as `head` and `take`. The **guard** check
  // allows it to work with `_.map`.
  _.first = _.head = _.take = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[0];
    if (n < 0) return [];
    return slice.call(array, 0, n);
  };

  // Returns everything but the last entry of the array. Especially useful on
  // the arguments object. Passing **n** will return all the values in
  // the array, excluding the last N. The **guard** check allows it to work with
  // `_.map`.
  _.initial = function(array, n, guard) {
    return slice.call(array, 0, Math.max(0, array.length - (n == null || guard ? 1 : n)));
  };

  // Get the last element of an array. Passing **n** will return the last N
  // values in the array. The **guard** check allows it to work with `_.map`.
  _.last = function(array, n, guard) {
    if (array == null) return void 0;
    if (n == null || guard) return array[array.length - 1];
    return slice.call(array, Math.max(array.length - n, 0));
  };

  // Returns everything but the first entry of the array. Aliased as `tail` and `drop`.
  // Especially useful on the arguments object. Passing an **n** will return
  // the rest N values in the array. The **guard**
  // check allows it to work with `_.map`.
  _.rest = _.tail = _.drop = function(array, n, guard) {
    return slice.call(array, n == null || guard ? 1 : n);
  };

  // Trim out all falsy values from an array.
  _.compact = function(array) {
    return _.filter(array, _.identity);
  };

  // Internal implementation of a recursive `flatten` function.
  var flatten = function(input, shallow, strict, output) {
    if (shallow && _.every(input, _.isArray)) {
      return concat.apply(output, input);
    }
    for (var i = 0, length = input.length; i < length; i++) {
      var value = input[i];
      if (!_.isArray(value) && !_.isArguments(value)) {
        if (!strict) output.push(value);
      } else if (shallow) {
        push.apply(output, value);
      } else {
        flatten(value, shallow, strict, output);
      }
    }
    return output;
  };

  // Flatten out an array, either recursively (by default), or just one level.
  _.flatten = function(array, shallow) {
    return flatten(array, shallow, false, []);
  };

  // Return a version of the array that does not contain the specified value(s).
  _.without = function(array) {
    return _.difference(array, slice.call(arguments, 1));
  };

  // Produce a duplicate-free version of the array. If the array has already
  // been sorted, you have the option of using a faster algorithm.
  // Aliased as `unique`.
  _.uniq = _.unique = function(array, isSorted, iteratee, context) {
    if (array == null) return [];
    if (!_.isBoolean(isSorted)) {
      context = iteratee;
      iteratee = isSorted;
      isSorted = false;
    }
    if (iteratee != null) iteratee = _.iteratee(iteratee, context);
    var result = [];
    var seen = [];
    for (var i = 0, length = array.length; i < length; i++) {
      var value = array[i];
      if (isSorted) {
        if (!i || seen !== value) result.push(value);
        seen = value;
      } else if (iteratee) {
        var computed = iteratee(value, i, array);
        if (_.indexOf(seen, computed) < 0) {
          seen.push(computed);
          result.push(value);
        }
      } else if (_.indexOf(result, value) < 0) {
        result.push(value);
      }
    }
    return result;
  };

  // Produce an array that contains the union: each distinct element from all of
  // the passed-in arrays.
  _.union = function() {
    return _.uniq(flatten(arguments, true, true, []));
  };

  // Produce an array that contains every item shared between all the
  // passed-in arrays.
  _.intersection = function(array) {
    if (array == null) return [];
    var result = [];
    var argsLength = arguments.length;
    for (var i = 0, length = array.length; i < length; i++) {
      var item = array[i];
      if (_.contains(result, item)) continue;
      for (var j = 1; j < argsLength; j++) {
        if (!_.contains(arguments[j], item)) break;
      }
      if (j === argsLength) result.push(item);
    }
    return result;
  };

  // Take the difference between one array and a number of other arrays.
  // Only the elements present in just the first array will remain.
  _.difference = function(array) {
    var rest = flatten(slice.call(arguments, 1), true, true, []);
    return _.filter(array, function(value){
      return !_.contains(rest, value);
    });
  };

  // Zip together multiple lists into a single array -- elements that share
  // an index go together.
  _.zip = function(array) {
    if (array == null) return [];
    var length = _.max(arguments, 'length').length;
    var results = Array(length);
    for (var i = 0; i < length; i++) {
      results[i] = _.pluck(arguments, i);
    }
    return results;
  };

  // Converts lists into objects. Pass either a single array of `[key, value]`
  // pairs, or two parallel arrays of the same length -- one of keys, and one of
  // the corresponding values.
  _.object = function(list, values) {
    if (list == null) return {};
    var result = {};
    for (var i = 0, length = list.length; i < length; i++) {
      if (values) {
        result[list[i]] = values[i];
      } else {
        result[list[i][0]] = list[i][1];
      }
    }
    return result;
  };

  // Return the position of the first occurrence of an item in an array,
  // or -1 if the item is not included in the array.
  // If the array is large and already in sort order, pass `true`
  // for **isSorted** to use binary search.
  _.indexOf = function(array, item, isSorted) {
    if (array == null) return -1;
    var i = 0, length = array.length;
    if (isSorted) {
      if (typeof isSorted == 'number') {
        i = isSorted < 0 ? Math.max(0, length + isSorted) : isSorted;
      } else {
        i = _.sortedIndex(array, item);
        return array[i] === item ? i : -1;
      }
    }
    for (; i < length; i++) if (array[i] === item) return i;
    return -1;
  };

  _.lastIndexOf = function(array, item, from) {
    if (array == null) return -1;
    var idx = array.length;
    if (typeof from == 'number') {
      idx = from < 0 ? idx + from + 1 : Math.min(idx, from + 1);
    }
    while (--idx >= 0) if (array[idx] === item) return idx;
    return -1;
  };

  // Generate an integer Array containing an arithmetic progression. A port of
  // the native Python `range()` function. See
  // [the Python documentation](http://docs.python.org/library/functions.html#range).
  _.range = function(start, stop, step) {
    if (arguments.length <= 1) {
      stop = start || 0;
      start = 0;
    }
    step = step || 1;

    var length = Math.max(Math.ceil((stop - start) / step), 0);
    var range = Array(length);

    for (var idx = 0; idx < length; idx++, start += step) {
      range[idx] = start;
    }

    return range;
  };

  // Function (ahem) Functions
  // ------------------

  // Reusable constructor function for prototype setting.
  var Ctor = function(){};

  // Create a function bound to a given object (assigning `this`, and arguments,
  // optionally). Delegates to **ECMAScript 5**'s native `Function.bind` if
  // available.
  _.bind = function(func, context) {
    var args, bound;
    if (nativeBind && func.bind === nativeBind) return nativeBind.apply(func, slice.call(arguments, 1));
    if (!_.isFunction(func)) throw new TypeError('Bind must be called on a function');
    args = slice.call(arguments, 2);
    bound = function() {
      if (!(this instanceof bound)) return func.apply(context, args.concat(slice.call(arguments)));
      Ctor.prototype = func.prototype;
      var self = new Ctor;
      Ctor.prototype = null;
      var result = func.apply(self, args.concat(slice.call(arguments)));
      if (_.isObject(result)) return result;
      return self;
    };
    return bound;
  };

  // Partially apply a function by creating a version that has had some of its
  // arguments pre-filled, without changing its dynamic `this` context. _ acts
  // as a placeholder, allowing any combination of arguments to be pre-filled.
  _.partial = function(func) {
    var boundArgs = slice.call(arguments, 1);
    return function() {
      var position = 0;
      var args = boundArgs.slice();
      for (var i = 0, length = args.length; i < length; i++) {
        if (args[i] === _) args[i] = arguments[position++];
      }
      while (position < arguments.length) args.push(arguments[position++]);
      return func.apply(this, args);
    };
  };

  // Bind a number of an object's methods to that object. Remaining arguments
  // are the method names to be bound. Useful for ensuring that all callbacks
  // defined on an object belong to it.
  _.bindAll = function(obj) {
    var i, length = arguments.length, key;
    if (length <= 1) throw new Error('bindAll must be passed function names');
    for (i = 1; i < length; i++) {
      key = arguments[i];
      obj[key] = _.bind(obj[key], obj);
    }
    return obj;
  };

  // Memoize an expensive function by storing its results.
  _.memoize = function(func, hasher) {
    var memoize = function(key) {
      var cache = memoize.cache;
      var address = hasher ? hasher.apply(this, arguments) : key;
      if (!_.has(cache, address)) cache[address] = func.apply(this, arguments);
      return cache[address];
    };
    memoize.cache = {};
    return memoize;
  };

  // Delays a function for the given number of milliseconds, and then calls
  // it with the arguments supplied.
  _.delay = function(func, wait) {
    var args = slice.call(arguments, 2);
    return setTimeout(function(){
      return func.apply(null, args);
    }, wait);
  };

  // Defers a function, scheduling it to run after the current call stack has
  // cleared.
  _.defer = function(func) {
    return _.delay.apply(_, [func, 1].concat(slice.call(arguments, 1)));
  };

  // Returns a function, that, when invoked, will only be triggered at most once
  // during a given window of time. Normally, the throttled function will run
  // as much as it can, without ever going more than once per `wait` duration;
  // but if you'd like to disable the execution on the leading edge, pass
  // `{leading: false}`. To disable execution on the trailing edge, ditto.
  _.throttle = function(func, wait, options) {
    var context, args, result;
    var timeout = null;
    var previous = 0;
    if (!options) options = {};
    var later = function() {
      previous = options.leading === false ? 0 : _.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };
    return function() {
      var now = _.now();
      if (!previous && options.leading === false) previous = now;
      var remaining = wait - (now - previous);
      context = this;
      args = arguments;
      if (remaining <= 0 || remaining > wait) {
        clearTimeout(timeout);
        timeout = null;
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && options.trailing !== false) {
        timeout = setTimeout(later, remaining);
      }
      return result;
    };
  };

  // Returns a function, that, as long as it continues to be invoked, will not
  // be triggered. The function will be called after it stops being called for
  // N milliseconds. If `immediate` is passed, trigger the function on the
  // leading edge, instead of the trailing.
  _.debounce = function(func, wait, immediate) {
    var timeout, args, context, timestamp, result;

    var later = function() {
      var last = _.now() - timestamp;

      if (last < wait && last > 0) {
        timeout = setTimeout(later, wait - last);
      } else {
        timeout = null;
        if (!immediate) {
          result = func.apply(context, args);
          if (!timeout) context = args = null;
        }
      }
    };

    return function() {
      context = this;
      args = arguments;
      timestamp = _.now();
      var callNow = immediate && !timeout;
      if (!timeout) timeout = setTimeout(later, wait);
      if (callNow) {
        result = func.apply(context, args);
        context = args = null;
      }

      return result;
    };
  };

  // Returns the first function passed as an argument to the second,
  // allowing you to adjust arguments, run code before and after, and
  // conditionally execute the original function.
  _.wrap = function(func, wrapper) {
    return _.partial(wrapper, func);
  };

  // Returns a negated version of the passed-in predicate.
  _.negate = function(predicate) {
    return function() {
      return !predicate.apply(this, arguments);
    };
  };

  // Returns a function that is the composition of a list of functions, each
  // consuming the return value of the function that follows.
  _.compose = function() {
    var args = arguments;
    var start = args.length - 1;
    return function() {
      var i = start;
      var result = args[start].apply(this, arguments);
      while (i--) result = args[i].call(this, result);
      return result;
    };
  };

  // Returns a function that will only be executed after being called N times.
  _.after = function(times, func) {
    return function() {
      if (--times < 1) {
        return func.apply(this, arguments);
      }
    };
  };

  // Returns a function that will only be executed before being called N times.
  _.before = function(times, func) {
    var memo;
    return function() {
      if (--times > 0) {
        memo = func.apply(this, arguments);
      } else {
        func = null;
      }
      return memo;
    };
  };

  // Returns a function that will be executed at most one time, no matter how
  // often you call it. Useful for lazy initialization.
  _.once = _.partial(_.before, 2);

  // Object Functions
  // ----------------

  // Retrieve the names of an object's properties.
  // Delegates to **ECMAScript 5**'s native `Object.keys`
  _.keys = function(obj) {
    if (!_.isObject(obj)) return [];
    if (nativeKeys) return nativeKeys(obj);
    var keys = [];
    for (var key in obj) if (_.has(obj, key)) keys.push(key);
    return keys;
  };

  // Retrieve the values of an object's properties.
  _.values = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var values = Array(length);
    for (var i = 0; i < length; i++) {
      values[i] = obj[keys[i]];
    }
    return values;
  };

  // Convert an object into a list of `[key, value]` pairs.
  _.pairs = function(obj) {
    var keys = _.keys(obj);
    var length = keys.length;
    var pairs = Array(length);
    for (var i = 0; i < length; i++) {
      pairs[i] = [keys[i], obj[keys[i]]];
    }
    return pairs;
  };

  // Invert the keys and values of an object. The values must be serializable.
  _.invert = function(obj) {
    var result = {};
    var keys = _.keys(obj);
    for (var i = 0, length = keys.length; i < length; i++) {
      result[obj[keys[i]]] = keys[i];
    }
    return result;
  };

  // Return a sorted list of the function names available on the object.
  // Aliased as `methods`
  _.functions = _.methods = function(obj) {
    var names = [];
    for (var key in obj) {
      if (_.isFunction(obj[key])) names.push(key);
    }
    return names.sort();
  };

  // Extend a given object with all the properties in passed-in object(s).
  _.extend = function(obj) {
    if (!_.isObject(obj)) return obj;
    var source, prop;
    for (var i = 1, length = arguments.length; i < length; i++) {
      source = arguments[i];
      for (prop in source) {
        if (hasOwnProperty.call(source, prop)) {
            obj[prop] = source[prop];
        }
      }
    }
    return obj;
  };

  // Return a copy of the object only containing the whitelisted properties.
  _.pick = function(obj, iteratee, context) {
    var result = {}, key;
    if (obj == null) return result;
    if (_.isFunction(iteratee)) {
      iteratee = createCallback(iteratee, context);
      for (key in obj) {
        var value = obj[key];
        if (iteratee(value, key, obj)) result[key] = value;
      }
    } else {
      var keys = concat.apply([], slice.call(arguments, 1));
      obj = new Object(obj);
      for (var i = 0, length = keys.length; i < length; i++) {
        key = keys[i];
        if (key in obj) result[key] = obj[key];
      }
    }
    return result;
  };

   // Return a copy of the object without the blacklisted properties.
  _.omit = function(obj, iteratee, context) {
    if (_.isFunction(iteratee)) {
      iteratee = _.negate(iteratee);
    } else {
      var keys = _.map(concat.apply([], slice.call(arguments, 1)), String);
      iteratee = function(value, key) {
        return !_.contains(keys, key);
      };
    }
    return _.pick(obj, iteratee, context);
  };

  // Fill in a given object with default properties.
  _.defaults = function(obj) {
    if (!_.isObject(obj)) return obj;
    for (var i = 1, length = arguments.length; i < length; i++) {
      var source = arguments[i];
      for (var prop in source) {
        if (obj[prop] === void 0) obj[prop] = source[prop];
      }
    }
    return obj;
  };

  // Create a (shallow-cloned) duplicate of an object.
  _.clone = function(obj) {
    if (!_.isObject(obj)) return obj;
    return _.isArray(obj) ? obj.slice() : _.extend({}, obj);
  };

  // Invokes interceptor with the obj, and then returns obj.
  // The primary purpose of this method is to "tap into" a method chain, in
  // order to perform operations on intermediate results within the chain.
  _.tap = function(obj, interceptor) {
    interceptor(obj);
    return obj;
  };

  // Internal recursive comparison function for `isEqual`.
  var eq = function(a, b, aStack, bStack) {
    // Identical objects are equal. `0 === -0`, but they aren't identical.
    // See the [Harmony `egal` proposal](http://wiki.ecmascript.org/doku.php?id=harmony:egal).
    if (a === b) return a !== 0 || 1 / a === 1 / b;
    // A strict comparison is necessary because `null == undefined`.
    if (a == null || b == null) return a === b;
    // Unwrap any wrapped objects.
    if (a instanceof _) a = a._wrapped;
    if (b instanceof _) b = b._wrapped;
    // Compare `[[Class]]` names.
    var className = toString.call(a);
    if (className !== toString.call(b)) return false;
    switch (className) {
      // Strings, numbers, regular expressions, dates, and booleans are compared by value.
      case '[object RegExp]':
      // RegExps are coerced to strings for comparison (Note: '' + /a/i === '/a/i')
      case '[object String]':
        // Primitives and their corresponding object wrappers are equivalent; thus, `"5"` is
        // equivalent to `new String("5")`.
        return '' + a === '' + b;
      case '[object Number]':
        // `NaN`s are equivalent, but non-reflexive.
        // Object(NaN) is equivalent to NaN
        if (+a !== +a) return +b !== +b;
        // An `egal` comparison is performed for other numeric values.
        return +a === 0 ? 1 / +a === 1 / b : +a === +b;
      case '[object Date]':
      case '[object Boolean]':
        // Coerce dates and booleans to numeric primitive values. Dates are compared by their
        // millisecond representations. Note that invalid dates with millisecond representations
        // of `NaN` are not equivalent.
        return +a === +b;
    }
    if (typeof a != 'object' || typeof b != 'object') return false;
    // Assume equality for cyclic structures. The algorithm for detecting cyclic
    // structures is adapted from ES 5.1 section 15.12.3, abstract operation `JO`.
    var length = aStack.length;
    while (length--) {
      // Linear search. Performance is inversely proportional to the number of
      // unique nested structures.
      if (aStack[length] === a) return bStack[length] === b;
    }
    // Objects with different constructors are not equivalent, but `Object`s
    // from different frames are.
    var aCtor = a.constructor, bCtor = b.constructor;
    if (
      aCtor !== bCtor &&
      // Handle Object.create(x) cases
      'constructor' in a && 'constructor' in b &&
      !(_.isFunction(aCtor) && aCtor instanceof aCtor &&
        _.isFunction(bCtor) && bCtor instanceof bCtor)
    ) {
      return false;
    }
    // Add the first object to the stack of traversed objects.
    aStack.push(a);
    bStack.push(b);
    var size, result;
    // Recursively compare objects and arrays.
    if (className === '[object Array]') {
      // Compare array lengths to determine if a deep comparison is necessary.
      size = a.length;
      result = size === b.length;
      if (result) {
        // Deep compare the contents, ignoring non-numeric properties.
        while (size--) {
          if (!(result = eq(a[size], b[size], aStack, bStack))) break;
        }
      }
    } else {
      // Deep compare objects.
      var keys = _.keys(a), key;
      size = keys.length;
      // Ensure that both objects contain the same number of properties before comparing deep equality.
      result = _.keys(b).length === size;
      if (result) {
        while (size--) {
          // Deep compare each member
          key = keys[size];
          if (!(result = _.has(b, key) && eq(a[key], b[key], aStack, bStack))) break;
        }
      }
    }
    // Remove the first object from the stack of traversed objects.
    aStack.pop();
    bStack.pop();
    return result;
  };

  // Perform a deep comparison to check if two objects are equal.
  _.isEqual = function(a, b) {
    return eq(a, b, [], []);
  };

  // Is a given array, string, or object empty?
  // An "empty" object has no enumerable own-properties.
  _.isEmpty = function(obj) {
    if (obj == null) return true;
    if (_.isArray(obj) || _.isString(obj) || _.isArguments(obj)) return obj.length === 0;
    for (var key in obj) if (_.has(obj, key)) return false;
    return true;
  };

  // Is a given value a DOM element?
  _.isElement = function(obj) {
    return !!(obj && obj.nodeType === 1);
  };

  // Is a given value an array?
  // Delegates to ECMA5's native Array.isArray
  _.isArray = nativeIsArray || function(obj) {
    return toString.call(obj) === '[object Array]';
  };

  // Is a given variable an object?
  _.isObject = function(obj) {
    var type = typeof obj;
    return type === 'function' || type === 'object' && !!obj;
  };

  // Add some isType methods: isArguments, isFunction, isString, isNumber, isDate, isRegExp.
  _.each(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp'], function(name) {
    _['is' + name] = function(obj) {
      return toString.call(obj) === '[object ' + name + ']';
    };
  });

  // Define a fallback version of the method in browsers (ahem, IE), where
  // there isn't any inspectable "Arguments" type.
  if (!_.isArguments(arguments)) {
    _.isArguments = function(obj) {
      return _.has(obj, 'callee');
    };
  }

  // Optimize `isFunction` if appropriate. Work around an IE 11 bug.
  if (typeof /./ !== 'function') {
    _.isFunction = function(obj) {
      return typeof obj == 'function' || false;
    };
  }

  // Is a given object a finite number?
  _.isFinite = function(obj) {
    return isFinite(obj) && !isNaN(parseFloat(obj));
  };

  // Is the given value `NaN`? (NaN is the only number which does not equal itself).
  _.isNaN = function(obj) {
    return _.isNumber(obj) && obj !== +obj;
  };

  // Is a given value a boolean?
  _.isBoolean = function(obj) {
    return obj === true || obj === false || toString.call(obj) === '[object Boolean]';
  };

  // Is a given value equal to null?
  _.isNull = function(obj) {
    return obj === null;
  };

  // Is a given variable undefined?
  _.isUndefined = function(obj) {
    return obj === void 0;
  };

  // Shortcut function for checking if an object has a given property directly
  // on itself (in other words, not on a prototype).
  _.has = function(obj, key) {
    return obj != null && hasOwnProperty.call(obj, key);
  };

  // Utility Functions
  // -----------------

  // Run Underscore.js in *noConflict* mode, returning the `_` variable to its
  // previous owner. Returns a reference to the Underscore object.
  _.noConflict = function() {
    root._ = previousUnderscore;
    return this;
  };

  // Keep the identity function around for default iteratees.
  _.identity = function(value) {
    return value;
  };

  _.constant = function(value) {
    return function() {
      return value;
    };
  };

  _.noop = function(){};

  _.property = function(key) {
    return function(obj) {
      return obj[key];
    };
  };

  // Returns a predicate for checking whether an object has a given set of `key:value` pairs.
  _.matches = function(attrs) {
    var pairs = _.pairs(attrs), length = pairs.length;
    return function(obj) {
      if (obj == null) return !length;
      obj = new Object(obj);
      for (var i = 0; i < length; i++) {
        var pair = pairs[i], key = pair[0];
        if (pair[1] !== obj[key] || !(key in obj)) return false;
      }
      return true;
    };
  };

  // Run a function **n** times.
  _.times = function(n, iteratee, context) {
    var accum = Array(Math.max(0, n));
    iteratee = createCallback(iteratee, context, 1);
    for (var i = 0; i < n; i++) accum[i] = iteratee(i);
    return accum;
  };

  // Return a random integer between min and max (inclusive).
  _.random = function(min, max) {
    if (max == null) {
      max = min;
      min = 0;
    }
    return min + Math.floor(Math.random() * (max - min + 1));
  };

  // A (possibly faster) way to get the current timestamp as an integer.
  _.now = Date.now || function() {
    return new Date().getTime();
  };

   // List of HTML entities for escaping.
  var escapeMap = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#x27;',
    '`': '&#x60;'
  };
  var unescapeMap = _.invert(escapeMap);

  // Functions for escaping and unescaping strings to/from HTML interpolation.
  var createEscaper = function(map) {
    var escaper = function(match) {
      return map[match];
    };
    // Regexes for identifying a key that needs to be escaped
    var source = '(?:' + _.keys(map).join('|') + ')';
    var testRegexp = RegExp(source);
    var replaceRegexp = RegExp(source, 'g');
    return function(string) {
      string = string == null ? '' : '' + string;
      return testRegexp.test(string) ? string.replace(replaceRegexp, escaper) : string;
    };
  };
  _.escape = createEscaper(escapeMap);
  _.unescape = createEscaper(unescapeMap);

  // If the value of the named `property` is a function then invoke it with the
  // `object` as context; otherwise, return it.
  _.result = function(object, property) {
    if (object == null) return void 0;
    var value = object[property];
    return _.isFunction(value) ? object[property]() : value;
  };

  // Generate a unique integer id (unique within the entire client session).
  // Useful for temporary DOM ids.
  var idCounter = 0;
  _.uniqueId = function(prefix) {
    var id = ++idCounter + '';
    return prefix ? prefix + id : id;
  };

  // By default, Underscore uses ERB-style template delimiters, change the
  // following template settings to use alternative delimiters.
  _.templateSettings = {
    evaluate    : /<%([\s\S]+?)%>/g,
    interpolate : /<%=([\s\S]+?)%>/g,
    escape      : /<%-([\s\S]+?)%>/g
  };

  // When customizing `templateSettings`, if you don't want to define an
  // interpolation, evaluation or escaping regex, we need one that is
  // guaranteed not to match.
  var noMatch = /(.)^/;

  // Certain characters need to be escaped so that they can be put into a
  // string literal.
  var escapes = {
    "'":      "'",
    '\\':     '\\',
    '\r':     'r',
    '\n':     'n',
    '\u2028': 'u2028',
    '\u2029': 'u2029'
  };

  var escaper = /\\|'|\r|\n|\u2028|\u2029/g;

  var escapeChar = function(match) {
    return '\\' + escapes[match];
  };

  // JavaScript micro-templating, similar to John Resig's implementation.
  // Underscore templating handles arbitrary delimiters, preserves whitespace,
  // and correctly escapes quotes within interpolated code.
  // NB: `oldSettings` only exists for backwards compatibility.
  _.template = function(text, settings, oldSettings) {
    if (!settings && oldSettings) settings = oldSettings;
    settings = _.defaults({}, settings, _.templateSettings);

    // Combine delimiters into one regular expression via alternation.
    var matcher = RegExp([
      (settings.escape || noMatch).source,
      (settings.interpolate || noMatch).source,
      (settings.evaluate || noMatch).source
    ].join('|') + '|$', 'g');

    // Compile the template source, escaping string literals appropriately.
    var index = 0;
    var source = "__p+='";
    text.replace(matcher, function(match, escape, interpolate, evaluate, offset) {
      source += text.slice(index, offset).replace(escaper, escapeChar);
      index = offset + match.length;

      if (escape) {
        source += "'+\n((__t=(" + escape + "))==null?'':_.escape(__t))+\n'";
      } else if (interpolate) {
        source += "'+\n((__t=(" + interpolate + "))==null?'':__t)+\n'";
      } else if (evaluate) {
        source += "';\n" + evaluate + "\n__p+='";
      }

      // Adobe VMs need the match returned to produce the correct offest.
      return match;
    });
    source += "';\n";

    // If a variable is not specified, place data values in local scope.
    if (!settings.variable) source = 'with(obj||{}){\n' + source + '}\n';

    source = "var __t,__p='',__j=Array.prototype.join," +
      "print=function(){__p+=__j.call(arguments,'');};\n" +
      source + 'return __p;\n';

    try {
      var render = new Function(settings.variable || 'obj', '_', source);
    } catch (e) {
      e.source = source;
      throw e;
    }

    var template = function(data) {
      return render.call(this, data, _);
    };

    // Provide the compiled source as a convenience for precompilation.
    var argument = settings.variable || 'obj';
    template.source = 'function(' + argument + '){\n' + source + '}';

    return template;
  };

  // Add a "chain" function. Start chaining a wrapped Underscore object.
  _.chain = function(obj) {
    var instance = _(obj);
    instance._chain = true;
    return instance;
  };

  // OOP
  // ---------------
  // If Underscore is called as a function, it returns a wrapped object that
  // can be used OO-style. This wrapper holds altered versions of all the
  // underscore functions. Wrapped objects may be chained.

  // Helper function to continue chaining intermediate results.
  var result = function(obj) {
    return this._chain ? _(obj).chain() : obj;
  };

  // Add your own custom functions to the Underscore object.
  _.mixin = function(obj) {
    _.each(_.functions(obj), function(name) {
      var func = _[name] = obj[name];
      _.prototype[name] = function() {
        var args = [this._wrapped];
        push.apply(args, arguments);
        return result.call(this, func.apply(_, args));
      };
    });
  };

  // Add all of the Underscore functions to the wrapper object.
  _.mixin(_);

  // Add all mutator Array functions to the wrapper.
  _.each(['pop', 'push', 'reverse', 'shift', 'sort', 'splice', 'unshift'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      var obj = this._wrapped;
      method.apply(obj, arguments);
      if ((name === 'shift' || name === 'splice') && obj.length === 0) delete obj[0];
      return result.call(this, obj);
    };
  });

  // Add all accessor Array functions to the wrapper.
  _.each(['concat', 'join', 'slice'], function(name) {
    var method = ArrayProto[name];
    _.prototype[name] = function() {
      return result.call(this, method.apply(this._wrapped, arguments));
    };
  });

  // Extracts the result from a wrapped and chained object.
  _.prototype.value = function() {
    return this._wrapped;
  };

  // AMD registration happens at the end for compatibility with AMD loaders
  // that may not enforce next-turn semantics on modules. Even though general
  // practice for AMD registration is to be anonymous, underscore registers
  // as a named module because, like jQuery, it is a base library that is
  // popular enough to be bundled in a third party lib, but not be part of
  // an AMD load request. Those cases could generate an error when an
  // anonymous define() is called outside of a loader request.
  if (typeof define === 'function' && define.amd) {
    define('underscore', [], function() {
      return _;
    });
  }
}.call(this));

},{}],12:[function(require,module,exports){
var css = "html, body {\n  background-color: #888; }\n\n#app {\n  margin-top: 3em;\n  text-align: center; }\n";(require('sassify'))(css); module.exports = css;
},{"sassify":9}],13:[function(require,module,exports){
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = function(viewDeps) {
  var CardCollectionView, CardView, Marionette;
  Marionette = viewDeps.Marionette;
  CardView = require('./CardView.coffee')(viewDeps);
  require('./CardCollectionView.scss');
  return CardCollectionView = (function(_super) {
    __extends(CardCollectionView, _super);

    function CardCollectionView() {
      return CardCollectionView.__super__.constructor.apply(this, arguments);
    }

    CardCollectionView.prototype.className = 'card-collection-view';

    CardCollectionView.prototype.childView = CardView;

    return CardCollectionView;

  })(Marionette.CollectionView);
};



},{"./CardCollectionView.scss":14,"./CardView.coffee":15}],14:[function(require,module,exports){
var css = "";(require('sassify'))(css); module.exports = css;
},{"sassify":9}],15:[function(require,module,exports){
var __hasProp = {}.hasOwnProperty,
  __extends = function(child, parent) { for (var key in parent) { if (__hasProp.call(parent, key)) child[key] = parent[key]; } function ctor() { this.constructor = child; } ctor.prototype = parent.prototype; child.prototype = new ctor(); child.__super__ = parent.prototype; return child; };

module.exports = function(_arg) {
  var Card, CardView, Marionette, _;
  Marionette = _arg.Marionette, _ = _arg._;
  Card = require('../models/Card.coffee');
  require('./CardView.scss');
  return CardView = (function(_super) {
    __extends(CardView, _super);

    function CardView() {
      return CardView.__super__.constructor.apply(this, arguments);
    }

    CardView.prototype.className = 'card white';

    CardView.prototype.template = _.template("<div class=\"rating\" title=\"2.5 Stars\">\n	<span class=\"fa fa-star\"></span>\n	<span class=\"fa fa-star\"></span>\n	<span class=\"fa fa-star-half-o\"></span>\n</div>\n<h1 class=\"title\">Lucy</h1>\n<div class=\"image\">\n	<img src=\"data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wCEAAkGBxQTEhUUExQWFRUXGBcWFxYYFBcXGBgYFxUXFhcUFxcYHCggGBolHBQYIjEhJSkrLi4uFx8zODMsNygtLisBCgoKDg0NFw8QGjclHRwuNys4Mi0xODg3ODEsKy83NzA3NzQ0KywvLC40NzMzNzQ3Kyw3LDArKzQrLCwsLy03LP/AABEIAOEA4QMBIgACEQEDEQH/xAAcAAABBQEBAQAAAAAAAAAAAAAEAQIDBQYABwj/xAA9EAABAwIDBQYFAgQHAAMBAAABAAIRAyEEMUEFElFhgQZxkaGx8BMiMsHRQuEUI1LxB2JykqKywiQzgxX/xAAXAQEBAQEAAAAAAAAAAAAAAAAAAQID/8QAHBEBAQEBAAIDAAAAAAAAAAAAAAERAhJBAxMh/9oADAMBAAIRAxEAPwDcV33Q8z780r51Shn268kE1EAN9+K4nVNJy4CY99FHWfA5+z6oFDpJnID7qBxJPEn2T5qVlm8fzP7BPwjAAXHv6DKOsoG1SKTeLjkOJ/CDMuMk/b2F13uLzEmzeTZ+8eSSq/qAYgZuJ05/tyQKXwNAPfuErSTpA87+iSjSJOUnjoOQ/KssNgzpfnp+yCKlR1dbgNSi6JJyEc/wpBhxr8x/Hkj8PT1Nhr/fUoAThp4+p/Hqh8Q1rZ4+J6nRW9VpdYS0anXuHBMOBHD7+ygoHSTkp8Lnw/J9lXTcENRdRPwQl3Mx/wBR+fFAFQmQOf3TSCD1Ks3YKHtgZR+6fjMBkRlaUFXTOuYPu6IZTkWy48NUXh8EA4g3Hv31XVsKabgRkSghbTjO4U7KJH0+H4RlCmD3HJcaEW09CgZhq0WNgfIqT4cOIFjw9FA46OsRY8Dw/uiqR3mg6j5T76oCKZke+oTQYskpGfXxzS4ptiRnFvX7IFKirtkeqWnUkToU+EFYkR++OC5Bj5Iuen5TAdfDrqm1nTAm3v8AddI9+/cIHF0HuA/fzlQB28Y9yVFWq5p+BFyeZ8ALeqAx7dByHUyPum7QMNDBqb/6QIjvJjzUuHyc7v8Awgy7ecToMvfVAj+HKE6lhsgBfj91JRpzc+/f2V3s3AQN4i50Pv3HNALh8DobCJJ1jgityRAEN4ceZU1S3S99XcTyEqCk4uPsICKNEaIxlNMwyMCCD4afuKRoTwxBBuJjaUnr79EVupWMQRPpSR3qWrTkRyUkJSEAzaeXvRSV6O82FIWpwQVuFESOo8cvE+aMLZCixDIIPE+/siQEAOMpS2dR6e4TcGRBA1g+Vj/xI6IwugkFA0PlfunUkDjEfuEE9L67ZH14IjOD7ugMI65PB7vCCj25dfugBw1i5vAn0keXoiqTlBVbFUkatnqPYUjXQffeEEm6Fyklcg87JTHP5ckpHXr6prkELwe/oiqIhvvmSoWm9hbjz4BE4dunubIJa7obu909BJ8yfBCUCTPh6/dOxzoB5A+ijwxEngPD3dBd4DD7zwIyv4aeK0dRkW4evu/gq3s/Tzdz9B958kTtGvDDoTbq79ggq8fV3jy/HT3KmwbbBA07nlYe/VWVFAZhgjGBD0boxgQOaEsJQuQdCULiuCBVybqnIOXLlyBlYWStXVGyCEyiZHvPVAmIbZAOH8xjpsW/9b++9WNcW96qvcflHeR1gH8jqgHwZ+dw4veek7o9FbUTLfH1VFhX23uU+QnzcrfCP/ls5j7T9kDMcYM8p/5NCHrVoiNPsbfZSY51+RHo5VmLfkOLRHQkH3zQW2//AJvJcgviBcgydQaqFPe8FI1wQOoU9Si6AIBdrkO/Kel/HkoGNnMwPtxU5yysMu4IK7aNQ7pAEk2FxxAnPSQUzDPFtbAeHy/+UN2iqAMgQCWHWLb7ZjWRATNlVAQDMRGuVt4eqD0HYrwGHhYeMn0AQO3K8EibjMf8Z8iodkYmwb1PgPsPNM2s0moM7/3Pr5oJ8IyyNpG6gwzLKQlBaYVGtVZgnqyYgelCaSla5ArlybvSe5K0oFSpFwKBVySbrigVQ0M3Dn63UoKHpH53D3ogkxH0lVWNqBtMk6m3kPVW1bIrK7excFrdPzJ/HggIJhjovYD9/JHUqsMp94aeoj0VS100yMi0T0mFNh8Rm0nMNIOgcCZ82jxQWWJMkgnL7z+Aq/FzDTGTR/yElG0nznqC3uOnp5qM0wTHFu6B6enkgrf4o8B4Lkn8C7+kf7kqCiLJ0UtOlyU1LDd8JRE6+qBzWoDG4wSWMguGY4cvLLuT9oPfDgyRGZGZzMDnbvuq59MNY4729a0cm+HE9TdBRdoaxc7dm/yttmdXd0QPcI7ZQ+U5wSZ7id0AcNEJUw7nOB+p0Dd5TFhF406c1c0KIpim0XgjxmZPHMmefRBc7IfcSTJEnuJn7+AR2JM1I5+BgCfLzVVg6wb873QNScg0GXEnuAXYXtHQc5zt43OrT5DPLgg0dBOegMJtWk/6Xg+P3RzazTEEICsHmramVVYUiVaUTZApCirVosLk+7okhN+GJmEEdJkCOOanAXOyTKb5QSKKra6kTXIOmbp0qsxOObSPzGAhx2kob26KjZOQ3hfiPNBcRB5FQgfzJ4jz9yq53aFm8WgF3cldtMyP5Tujhcd3cgtqossl2koSZhamm9xF2x1lVG2qMtJv098kFPsx8tAOYEHnIkfhcZkt/UCS3ODkS3qfUKlpbQbSxdOmd6HsOliA4ye9ufcStLjsHviQYPG1uY9eiCTZeLD2g9CIuCMweBBBsjauc6g5csj5LP8AZ/GfEJn5azTu1BEExYGLg5Zgm0dL1tQEWz9eBCCS3+bxXIb4rv6h5JEFC9x3dZP9v3S02kC3TPxmE+hgyYuIubmPYnuyRjdnmM7RxznXO/egqt25m49TYydNFG7DbwIIN+IB9OA9yrR+BM6/ZSU8JzPdJ9gIM83B7pmTflHK0eCBxVTd78hJ75d3K+2qy0NIHFxgADUiZn3cLHdo8SGNLaZ3nEXcSSTrbhxnujiAq9vbYNX/AOOyoRMhxGt8p0APWR3hVrOz4lzn1Qd6TcxrytyyWXrPdTLnSQ69+GnyjQ8PZVd/NrOgb1QnSSfYQbB/xaP0YhvdvNII5ElF0O1+KZBsQM53zpoZhZyh2KxBqUqRAD6tM1WgfNADgIJGt5tOYQ2xuzlarWdSIdSLA4ucWOIbGluJiO9Yvycy5b+tTm2a9a2J/iII/mBxPK89wzW82L2so1gNxwJ4a+7r57r9l8RRpU61UEUqn01QC+mDvFhFQES2QJtaCrTBzhKjfjNNIuALKtN80qgNxfTqtsvpKjjwQpmVgSvLdh9q2uhk34za3NbTZWO39UGiq5HuVG3HFpKvcwqnF7LBPJBXY3tcxgNpi3eeA4rO7V7cPIhha2eUm+molXmM7P0RJcJ4yTHG/FeZdqMK+s4tpi02a0QAJgF8RmeP2QM2r2ha8nfqBmf1vaziLA38gidiYqkR8tR3/wCYdHiY3u+Y5LJYTsNVNSsxzoqMpGpuNADnl29ugcB8sW1UvZXsk7EYetUq1MRh30nQ1p3gCN2STvN0IFpXP7OfK8+41ec58vT1ej2ipURelVjLe3HP8XMBWh2L2nw1YTTcOHceHIryw9kMfRoUq+Hqmq2pSY403EMeHOaHbodZrheLwieztV1WoS6kadZvyv8Alc3e/wBQykXuujL2mniA7IoXH05aUFsKk6LqyxZsg8y24N2s1u64lwiQPpAeLj5eJyOdu8XnZvashocb5Te8GADNxym8g8Vnu3AIqsIcB9RHe1zSOlyq/Z9QtfTiYfMgZNbO8OViYng4ckHoOKw4Dy8NAmIIFwR+l3GL34HldgqmL+9FHg8WS2CZzE93uQUhABztCArf7/EflIgd737C5A2liWgwC0zpN+/PpkjsPiATl6BYhm1KriB8ucfLNozDosOoV3hcWXReARNpuINssv2QaD40ndaAeLtOEc9FNXe2m0zBJzn3l77s/wDxxb9ECG/WRfvA65zx4J7apLATnE3nUa+XkgqttYt76m4ct3eiY3r2HIDdPigaGA3iSRJJMzxVXg8cKmKrO3pHy7h03QXMHQ7k9VqMA8cEGd292aY9jjAmDpqsL2b2oMBid2uwPok7pgfM0f1t4kcOBK91dgd9q887V9ifiHeY24ug1B2ZQxzaVTC4hgfTJNOoLls2cx7LHdOosbaQrin2Zr1DFavTbTdAf8OS54HAkDc8/uvPthdjaZMu32OgNlpLSIGciJM36L0DZ3Z2AIq1iBkDVee/MqXnm3bEs1pcZhaQw/wWsaaYaGNZEtAAgDwXlO1+z7GB1MNquoOP0fDdFIGf5lNxiADm3hedF6vQw7mCzj4lUW3cS50gmyqvEa+y34V8B0wbHQiV6t2Cxe+0TpCyG28HeRz6cgtJ/hyM+nqg9UbkkIShcgrtp4TfFshMjisxivgUqgLQQHZyLg6kk93mtrUbIhUG0Nkl3NBS7T2ZRxJbUpVfhV2CA8fMCD+lwBuOoIUlDYL6g3cRWD6X62Ma7575OccmnUeaHxHZlj5Bbuk6/Se+Rf8AsjMH2Rpz8xcRnBe4jKLgm/VTJu4lkova+PD/AOVShzsvlgtZpJIsXRPyjL1P2DsZlKkG7t/HzRWB2aymButFkcAqrmsAyQeOcjlV7Seg8z7ZEOxLGnIAuPCCYvyshcNFwwW/TOpBjejxMfspO0UPrOM6tYOl58XH/aitj4UufvH6RBHAn76eSC/wVLdYBwA1nK3p6KeqPwo2uz0sfwnVHZ31/CBY9yuUEjj5LkGRw9Ek7jchJN4LrEmdAPp8Fe0QWU5a2LbrcptHzcpjIRZQU6LWDKAczqSdOWiZXxgnjBymIHCPJA7CuLwTEbzi0GP03uepUXa3afwaJbIBeC0ng28gRfePLLkpKGP4NHdMnK0W4BZntFRdVc8n5t2BJGViD3X8LcEFF2Yxbf4hwE/M02yA3SI05lehYGpfT30WK7O7PAeHADeb8ucuENLdDYa+4Gqw9XdNxE/ebIN9seqCAja+DBMwsvsfG3/da7BVwQgFo7KbwVjh8KGopoCRyAfFugWWR2w+JK0O0a0LF7dxKCj2kQQVcf4fk7xHvNZnaNb5StJ/h68CUHqTckqbTNgnIETXNT0iCI0wlDFJC6ECAJVy5A2o6AqHadWxVrjKqy3aDFbtN5GceenmgwtA79Z7g2fmcQSZvJA5DMLSYCnutAvJuTrfT7dAs7sHDgOM8jB492toWmomQIPmgnpOi50v9/feue60nU+/TzSFv6QocXUiBwLfM8OnmgX4gSpIPL30XIAq+GEl2ZGkjoqrEsubC9hPMm/qryvVEx1001HdCrKDQ4iYs53/ABDoPdZBFhiA8n5YkCx0tBjjbzQdej/NflBdloQ6ZHmjKsTLbw6PCxHfKkFL5mkgZj1HrfxCDBdocIaZ36VQs4EOIIJ/S+9xqJ1OUElaoVt+m14P1Na4dQDHeEL2gwoDiC0FrpBubGxA6jzC7ZbHfADSLsJb0N//AF5IDdnbQLXRbx/dbnY+PNjPmvLqji10ic/vkStHsPaJtoEHqVDGSpK+JWZwm0BGaLqYzeCBm0K8rG7bxESbeK0WOr2zWF7Y4ncpPccoPfkgpq+0Q9+4Lye9ei9iNnlgE6wvHuzbCa4Ls7dNV772biB3BBrKeSemsTkHLk1y4FA5cuXIOTKroCcShMVUQAYytmvM/wDFLGH4DaYiXvBNwPlZ8x891egY582Xmvb9pfUaAYLWkDKJdc3Izy/CCXsvRDWgabxF+AEDXktKxkEZWCz2zmQ1oOh46lsBaGnWDhIz1HAxr3Sg4PsSc8/3ULwCe/Lmcx75oCpXIflMGDOgN2/bxKKDxfLK1+FxHcgm3+Y8FyG+KeA8/wArkFI+sXuE/USSTvD6TlrY3HQBG4Kr8xAgCLZQLGBGuZUWHbTpMndl51Og79Ba0KupYkB8gEfURztnGki3UcUBFCqXOIJ/WTe/MEdAFcVBLA7mb+QOWSo3uAqFwDodDrEjLhHW3d1Lq4uwa42zPAHMOPKAPEoH7dw4cHGNGmP9Jn7IXZf1uaf1DpIuB1BN/wDKrSoZYw3MgZdDN+viqvHU/hRUaZIggRGUk+VuqCu2vS3H3mDwjwjvUOz8bumDOvDP3CvttYcVKW80mI3geRCxwcQYJM90X5nvCDd7P2gCBmrehirLz7D1t3XWP2stRszEyBefdkFxWfKwn+IVImk06b7ZHKQtw1koDauxxWY5jxIIiEHnOzcM/wCJvNYYIzXr/Y7Gb7R/ULELy/avZPEtgU6ziG3b87mOF8paYPeRKuux1XaFON9hrNt80j4g/wBX9Y5596D3Wk+yV1QDVZ7ZOLfWiAWnWQRHQo7aWxW1m7rrjU7xny1QWTKgORSRBUeCwgptgEnmVOQg4FLKSEhQNeVXYuojKzlWYpyCtxNRefbVl+850SXEjhE7o6gHw7ltNs1CKZAMF3yi2p9+YWdxWBmlBaSYHfy858UEOA+kkwB8jrEZ5Og9wPgpNm4vdcROQAPCwIMc7KPZ7f5TRBtAPOSW/c+Kq8VW3Km9cAEEEWje+ZrjHcQc7dyCz2tSuXD5rXixgd17i08lX06u4DwbBmZmx/IRFHaEi8jPXIzG7/pPHTwUNZrZJINxGVr6fewQS/xLeH/ILkD8dnPz/KRA3F4veP0kAZRl11y05KBlUBwPzTbvJv4XiyY6oLDhbLKefcmtqjIWtckDuj1QWmEJc1+/ZouCM28AOJveePhJUpvIzbbPSbQHAESDy52zsBi9oDdFNoIET3kRM8zw0spW1bB4BkD7RBQaPDfS0ERYDoBa+tgmbTZNPK7SdP8AKYgd5ULcTdov6xMgeR80TiKkg5WAPmYlBUbGxgh1Jxu24toYPqfNUG1cNu1CROc+fqrHCvisXGYbIOkiDA7592ReLa2qA9pEcZz89IQUAmMzbP18VodkV+dvf5VVUw51OdzrGfPmiME8jT3GaDcYS4RBcFR4bG7rJKrMR2oaDG8Le7oNFiKe+YC0/ZfBgNysFjdkbQpuaHucBOmpv/dazZ+3qVMhptIzQXLWhlfk4KyVS/FU3PD96QBYAIynj2HWO8ICki5rgcjK5ByY5PUbygFrlVeLcj8S5UuOrQDHRBS4+KlWP0tEdTE6cgEtamI/fgiKdHXh7+yjqH6ibXPkM0FMxtnCDN48nDz9VWY+n/MmDlHTMd4gkdAr3FgAzxBJy1H5CEqvBLflMnJwAsLEe+aCqwuGLbMNv6XRYT9h5qHFioHCZiSZAMG856ZeStWtEGZGY8+OtrKqxlcmImDp1zhAT8T/AC+X7LkB8Z/Fvi78rkFWwwOPTjbVK1xNxEiAOOXHogWVyCL8LeXiimVx15a2z80ERLp3gM5+/wBlbNr7rAPeWR4oRuHBFo68Zv8AdEta0QDFxLuX1X/ZAb8RwaCDOZGQyyUr8WQ03uQAMpzhNc0aC0ZHSwDR4fdQYmlaeFs+P7eqDK7Vxj3T88TvWAGp4k65eCtOy1ZzDuPLTTMQDEh0xaNCIty70PVIHfpedYmc9T7CCxWLLRkA7mYtxMaX+yDfOwg1Hs8tUIcJuE8DytPUKDsztT4lNrKpBebtvnru94Hp429SjM2y/vCCu202aDhvFpixGYK8uxbn03D5t+dcjPAxnmvUcfTJaQAMoWQ2hsVrrOMcHcOIKBuwsfXjeFBzmTI3XNJtmPmI5LWUtuQPno125/VT3r3/AKC48lTdkcWcM/4b4iZa7SDqD7K9Z2TtNtRt2tPCyCg2Z2uohoH80GLD4FS3L6YsI8VaYftK98/Dw1d3MtY0HqXz5K73aJglo6AIllZjfpEoKzCVcU6/w20+98kdGj7qzoYSo8guquJbeG2aTzBknxSDeeYCt8LSDGoOpvIsV1Sqm1HoWu9BDjKuaotoPu2+v3CPqvlVW1BduXshARS095oR/wBUaEEk8tY8UTQuJso8TG7Ghz7kFZVqF5EQILpHmP8AqFC2gS9tvpA8skf8MDSNU0Re51knTnKCo2lDWOn9Vh1JJKpqjDFuF9M5/C0G0MA6pBpuY4AEQDByz4KoxGHcww5pBzi2QOfqgA+CeC5FfFH9A8vwlQZDP7fa3ipGCMzkMpBP7Z5Z8k3LSORN/ROa3/LF4zvPBAbQrRf0udf2R38SOF9fweaDwuEe7IG/MX8Qpa2Ge3MAdQgsDVixM3setvv5KF8lr9YB0PKD5Qg8vqcDy7xPXgnUMVvOIkQQWk2zI+U+PqgAe/5hPK5ER3DiQoG4SmXXgznyuFDXJmTIaCZPl3KWg4S3Lnl48u5BJjqHwAIdEkuYReCDmIWx7NbX+O3dqACqAJyG+P6gBkeI692a2tTD6bTa05RqM/JB7P3mOa4OIIIvlHXwQeg4nC6x55Khx1EDMeXP91fbD2uK7YJHxQJIiAeY/HNM2rhw7Js2QZqlsovHyGx0iQr/AGU3EUYG6HjvI+3JWHZ+m0iCBI4LXYSgBogz+H2k8m9Mjz+yucHUnMQtDQotIyHgpjhW8EAmEbGSJMpRSAySuegHqWVXia89ylxuIkxogXFA1xQO0KZc2wuDa6Ke5QurRqgFo4qLe+9Or1ZCQ1gT+ycxw4Qgi3TFzHvy6oSu6RGnmUZUeOCDePcoKx43DvskOF/Ph3K+r4ZlZrSRIgEHXiII71UYoWPd/ZWWwqk0GX0I8CQgG/8A4LeL/wDd+y5XEhcg8foUC4gATzB0Vxh9n7oJdBOd9O9W1DChpDQOfBR7XtTIGbrdNSgoa+03l0NgN46xl0SOxHG51M+7/hQ/wxm8d8JW0nZW4Z+SCGtVnT3FvVDTeQIjVHfCPEeXvVROpXvfT3wQBYhrSJsD5dLqXA0t7QCIHj1umVaV8uUCbcNeaK2S4CxAHj+UFpToBzHN4/m3mmjDjI5jwhGsgTEefFGGk0gSPVBTYVrmOBY4ggyCMwtdh8T8ZomBUGbdDzb+FS0KInTPn+Vb4ajwz0zn1QDbPrGnWjIE2759hegYLFBzQfJY6uwO+oXz3hn1Gv7I7Z+Jc2xy5INvQxCObUlZOhjfcI1uOdFkF5UqqrxeLmwQlXEk5lDuqoJHOUFRyY+oh6lUIHVqtlW4nEDipa9Se7qgKgn2UCiuTkUv8T1UEZj8/lK5o9z4ZoJ/4rn4lJ8Y8kIXZ/e/vNIHHl4IFxdWATnZHbDqD4LYGc+pVNtCrGUeitdhCKQmLyc+Zv5oLee5ck+J3eSRBnqf1DuP/lAbX+roP+xSLkFTiffgFHqlXIIlFU+65cgAxP09fynbN+roVy5Be4TJvvVXLPpHclXIE/UOvoFZ4bJcuQS1ETh8/fNKuQHUESEq5AjlC5cuQRVEPU0XLkEevviVGcz19SuXIBqn3Pqozke77pVyCBmvVJV+nwXLkFVtFaHZP/0s6LlyCwXLlyD/2Q==\" alt=\"Title Card Image\">\n</div>\n<div class=\"tags\">\n	<div class=\"primary\">\n		<a href=\"magnet:?xt=urn:btih:931010dc56e28250b93e665d15d46489afcc6e74&dn=Lucy.2014.KORSUB.720p.WEBRip.XviD.MP3-RARBG&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.istole.it%3A80%2Fannounce&tr=http%3A%2F%2Fshadowshq.yi.org%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.tfile.me%2Fannounce&tr=http%3A%2F%2Ftracker.istole.it%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80%2Fannounce&tr=udp%3A%2F%2Ftracker.openbittorrent.com%3A80&tr=udp%3A%2F%2Ftracker.publicbt.com%3A80&tr=http%3A%2F%2Fbttrack.9you.com%2Fannounce&tr=http%3A%2F%2Fwww.eddie4.nl%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.com%3A2710%2Fannounce&tr=http%3A%2F%2Fbt.careland.com.cn%3A6969%2Fannounce&tr=http%3A%2F%2Fbt2.careland.com.cn%3A6969%2Fannounce&tr=http%3A%2F%2Fwww.elitezones.ro%2Fannounce.php&tr=http%3A%2F%2Ftracker2.wasabii.com.tw%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker1.wasabii.com.tw%3A6969%2Fannounce&tr=http%3A%2F%2Fbt01.gamebar.com%3A6969%2Fannounce&tr=udp%3A%2F%2F9.rarbg.me%3A2710%2Fannounce&tr=http%3A%2F%2Felitezones.ro%2Fannounce.php&tr=http%3A%2F%2Ftracker.dler.org%3A6969%2Fannounce&tr=udp%3A%2F%2F11.rarbg.me%3A80%2Fannounce&tr=http%3A%2F%2Fbttracker.crunchbanglinux.org%3A6969%2Fannounce&tr=udp%3A%2F%2F10.rarbg.me%3A80%2Fannounce&tr=http%3A%2F%2Fretracker.perm.ertelecom.ru%2Fannounce&tr=http%3A%2F%2Fbigfoot1942.sektori.org%3A6969%2Fannounce&tr=http%3A%2F%2Fsugoi.pomf.se%2Fannounce&tr=http%3A%2F%2Feddie4.nl%3A6969%2Fannounce&tr=http%3A%2F%2Fshadowshq.eddie4.nl%3A6969%2Fannounce&tr=udp%3A%2F%2F12.rarbg.me%3A80%2Fannounce&tr=udp%3A%2F%2Fopen.demonii.com%3A1337%2Fannounce&tr=http%3A%2F%2Ftracker.trackerfix.com%2Fannounce&tr=http%3A%2F%2Ftracker.kuaikuai.cn%3A8080%2Fannounce&tr=http%3A%2F%2Fbt3.careland.com.cn%3A6969%2Fannounce&tr=http%3A%2F%2Fserver2.9sheng.cn%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.leechers-paradise.org%3A6969%2Fannounce&tr=http%3A%2F%2Fserver1.9sheng.cn%3A6969%2Fannounce&tr=http%3A%2F%2F210.244.71.11%3A6969%2Fannounce&tr=http%3A%2F%2Fmgtracker.org%3A2710%2Fannounce&tr=http%3A%2F%2Fretracker.adminko.org%2Fannounce&tr=http%3A%2F%2Ftracker.files.fm%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.yoshi210.com%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.mg64.net%3A6881%2Fannounce&tr=http%3A%2F%2Fretracker.uln-ix.ru%2Fannounce&tr=http%3A%2F%2Fsugoi.pomf.se%3A2710%2Fannounce&tr=http%3A%2F%2Ftracker.best-torrents.net%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.blucd.org%3A2710%2Fannounce&tr=http%3A%2F%2Ftracker4.itzmx.com%3A2710%2Fannounce&tr=http%3A%2F%2Fbt.ttk.artvid.ru%3A6969%2Fannounce&tr=http%3A%2F%2Fbt.artvid.ru%3A6969%2Fannounce&tr=http%3A%2F%2F95.85.40.114%2Fannounce&tr=http%3A%2F%2Fretracker.telecom.kz%2Fannounce&tr=http%3A%2F%2Ftracker.pomf.se%2Fannounce&tr=http%3A%2F%2Fcastradio.net%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.flashtorrents.org%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker2.yoshi210.com%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker1.ohys.net%2Fannounce&tr=http%3A%2F%2Ftracker.skyts.net%3A6969%2Fannounce&tr=http%3A%2F%2Fbt.365tracker.us%3A6969%2Fannounce&tr=http%3A%2F%2F91.121.54.8%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.flashtorrents.org%3A6969%2Fannounce%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BDc%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EF%BF%BD%EE%83%BF&tr=http%3A%2F%2Ftrackertorrents.ga%3A6969%2Fannounce&tr=http%3A%2F%2Ftracker.flashtorrents.org%3A6969%2Fannounce%3F%3F%3F%3F%3F%3F%3F%3F%3F%3F%3F%3Fc&tr=http%3A%2F%2F91.218.230.81%3A6969%2Fannounce\" title=\"Magnet\">\n			<i class=\"fa fa-magnet\"></i>\n		</a>\n	</div>\n	<div class=\"secondary\">Movie</div>\n	<div class=\"tag\">Action</div>\n	<div class=\"tag\">Sci-Fi</div>\n</div>\n<div class=\"description\">\n	<p>A woman, accidentally caught in a dark deal, turns the tables on her captors and transforms into a merciless warrior evolved beyond human logic.</p>\n	<p>Starring Scarlet Johansen et al</p>\n</div>\n\n<div class=\"rating-set\">\n	<div class=\"rating over-above\" title=\"Userscore: 5.9\">5.9</div>\n	<div class=\"rating over-above\" title=\"Metascore: 61\">61</div>\n	<div class=\"rating over-above\" title=\"Metacritic Ratings\"><i class=\"fa fa-heart\"></i> </div>\n</div>\n\n<div class=\"foot\">\n	<span class=\"artist\">Directed by: Luc Besson</span>\n	<span class=\"hash\">#: Da2434sDGA4234s3Y£H$66WKDS</span>\n</div>");

    CardView.prototype.initialize = function() {};

    return CardView;

  })(Marionette.ItemView);
};



},{"../models/Card.coffee":2,"./CardView.scss":16}],16:[function(require,module,exports){
var css = ".card .image, .card .description {\n  border: 2px solid white;\n  box-shadow: 1px 1px 1px -1px #737373;\n  border-left-color: #737373;\n  border-top-color: #737373; }\n\n.card {\n  position: absolute;\n  display: block;\n  font-size: 10px;\n  width: 300px;\n  margin: 0;\n  padding: 1em;\n  border: 10px solid black;\n  border-radius: 5px;\n  background: top left transparent;\n  background-size: cover;\n  box-shadow: 0px -1px rgba(255, 255, 255, 0.25), 0px 0px 10px rgba(0, 0, 0, 0.5);\n  text-shadow: 0px 1px 0px white;\n  background-color: #d8d8d8;\n  overflow: auto;\n  left: 50%;\n  margin-left: -150px;\n  text-align: left; }\n  .card:nth-child(-n+1) {\n    transform: translate3d(2px, 2px, 0); }\n  .card.white {\n    background-image: url(\"data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMZaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjE2NDkzOEUwOEY3RDExRTRBRjZDRTU5MEQyMDk5MEMxIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjE2NDkzOERGOEY3RDExRTRBRjZDRTU5MEQyMDk5MEMxIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSI3MEExMTU4MEIxODk2REUxRkRCM0E1NTA4MjIwMkY3NiIgc3RSZWY6ZG9jdW1lbnRJRD0iNzBBMTE1ODBCMTg5NkRFMUZEQjNBNTUwODIyMDJGNzYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAmQWRvYmUAZMAAAAABAwAVBAMGCg0AAGgoAAI9xQADPbEABDD//9sAhAABAQEBAQEBAQEBAQEB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\"); }\n  .card.red {\n    background-image: url(\"data:image/jpeg;base64,/9j/4QAYRXhpZgAASUkqAAgAAAAAAAAAAAAAAP/sABFEdWNreQABAAQAAABkAAD/4QMZaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wLwA8P3hwYWNrZXQgYmVnaW49Iu+7vyIgaWQ9Ilc1TTBNcENlaGlIenJlU3pOVGN6a2M5ZCI/PiA8eDp4bXBtZXRhIHhtbG5zOng9ImFkb2JlOm5zOm1ldGEvIiB4OnhtcHRrPSJBZG9iZSBYTVAgQ29yZSA1LjMtYzAxMSA2Ni4xNDU2NjEsIDIwMTIvMDIvMDYtMTQ6NTY6MjcgICAgICAgICI+IDxyZGY6UkRGIHhtbG5zOnJkZj0iaHR0cDovL3d3dy53My5vcmcvMTk5OS8wMi8yMi1yZGYtc3ludGF4LW5zIyI+IDxyZGY6RGVzY3JpcHRpb24gcmRmOmFib3V0PSIiIHhtbG5zOnhtcE1NPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvbW0vIiB4bWxuczpzdFJlZj0iaHR0cDovL25zLmFkb2JlLmNvbS94YXAvMS4wL3NUeXBlL1Jlc291cmNlUmVmIyIgeG1sbnM6eG1wPSJodHRwOi8vbnMuYWRvYmUuY29tL3hhcC8xLjAvIiB4bXBNTTpEb2N1bWVudElEPSJ4bXAuZGlkOjVCMDk2RkY4OEY3RTExRTQ4REMxQjJFNjQ3MUIyNUYwIiB4bXBNTTpJbnN0YW5jZUlEPSJ4bXAuaWlkOjVCMDk2RkY3OEY3RTExRTQ4REMxQjJFNjQ3MUIyNUYwIiB4bXA6Q3JlYXRvclRvb2w9IkFkb2JlIFBob3Rvc2hvcCBDUzYgV2luZG93cyI+IDx4bXBNTTpEZXJpdmVkRnJvbSBzdFJlZjppbnN0YW5jZUlEPSI3MEExMTU4MEIxODk2REUxRkRCM0E1NTA4MjIwMkY3NiIgc3RSZWY6ZG9jdW1lbnRJRD0iNzBBMTE1ODBCMTg5NkRFMUZEQjNBNTUwODIyMDJGNzYiLz4gPC9yZGY6RGVzY3JpcHRpb24+IDwvcmRmOlJERj4gPC94OnhtcG1ldGE+IDw/eHBhY2tldCBlbmQ9InIiPz7/7gAmQWRvYmUAZMAAAAABAwAVBAMGCg0AAIQYAACfZwABNPIAAklW/9sAhAABAQEBAQEBAQEBAQEB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\");\n    color: black; }\n  .card .title {\n    font-size: 20px;\n    margin: 0;\n    line-height: 18px;\n    padding: 0 5px;\n    text-shadow: 0px -2px 0px white, 0px 1px rgba(0, 0, 0, 0.25);\n    margin-bottom: 10px; }\n  .card .rating {\n    float: right;\n    font-size: 14px;\n    border-radius: 1em;\n    border: 1px solid black;\n    padding: 0 0.4em;\n    right: 10px;\n    background-color: white;\n    z-index: 999;\n    line-height: 17px;\n    background-color: #f0f0f0;\n    font-weight: bold;\n    box-shadow: 0px -1px 2px white, 0px 1px rgba(0, 0, 0, 0.25);\n    right: 5px;\n    border-color: #737373;\n    border-left-width: 0; }\n    .card .rating.over-above {\n      position: relative;\n      margin-top: -1em;\n      margin-bottom: 10px; }\n    .card .rating i.fa {\n      font-size: 10px;\n      line-height: 14px; }\n  .card .rating-set .rating {\n    border-radius: 0; }\n    .card .rating-set .rating:last-child {\n      border-bottom-left-radius: 1em;\n      border-top-left-radius: 1em;\n      border-left-width: 1px; }\n    .card .rating-set .rating:nth-child(-n+1) {\n      border-bottom-right-radius: 1em;\n      border-top-right-radius: 1em;\n      border-left-width: 0; }\n  .card .image {\n    position: relative;\n    margin-bottom: 1em;\n    padding-bottom: 75%;\n    overflow: hidden;\n    height: 0; }\n    .card .image img {\n      display: block;\n      width: 100%;\n      position: absolute;\n      margin-top: -50%;\n      top: 50%; }\n  .card .tags {\n    overflow: auto;\n    font-size: 14px;\n    padding: 0 5px;\n    font-style: italic;\n    font-weight: bold; }\n    .card .tags a {\n      color: inherit; }\n    .card .tags .primary {\n      float: right;\n      font-family: monospace;\n      font-style: normal; }\n    .card .tags .secondary, .card .tags .tag {\n      float: left; }\n      .card .tags .secondary:before, .card .tags .tag:before {\n        content: \"\";\n        margin-right: 0; }\n      .card .tags .secondary.secondary:before, .card .tags .tag.secondary:before {\n        content: \"\";\n        margin-right: 0; }\n      .card .tags .secondary.secondary:after, .card .tags .tag.secondary:after {\n        content: \"\\2014\";\n        margin-left: 5px;\n        margin-right: 5px; }\n    .card .tags .tag ~ .tag:before {\n      content: \",\";\n      margin-right: 5px; }\n  .card .description {\n    font-size: 16px;\n    padding: 5px;\n    background-color: rgba(240, 240, 240, 0.5);\n    margin: 0.4em 0;\n    min-height: 8em;\n    color: black; }\n    .card .description > *:first-child {\n      margin-top: 0; }\n    .card .description > *:last-child {\n      margin-bottom: 0; }\n  .card .foot {\n    clear: both; }\n    .card .foot .artist, .card .foot .hash {\n      line-height: 10px;\n      vertical-align: baseline;\n      display: inline-block; }\n    .card .foot .hash {\n      font-size: 8px;\n      float: right; }\n";(require('sassify'))(css); module.exports = css;
},{"sassify":9}]},{},[1]);
