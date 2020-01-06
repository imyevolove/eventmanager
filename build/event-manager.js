!function(e,t){if("object"==typeof exports&&"object"==typeof module)module.exports=t();else if("function"==typeof define&&define.amd)define([],t);else{var n=t();for(var r in n)("object"==typeof exports?exports:e)[r]=n[r]}}(window,(function(){return function(e){var t={};function n(r){if(t[r])return t[r].exports;var i=t[r]={i:r,l:!1,exports:{}};return e[r].call(i.exports,i,i.exports,n),i.l=!0,i.exports}return n.m=e,n.c=t,n.d=function(e,t,r){n.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:r})},n.r=function(e){"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},n.t=function(e,t){if(1&t&&(e=n(e)),8&t)return e;if(4&t&&"object"==typeof e&&e&&e.__esModule)return e;var r=Object.create(null);if(n.r(r),Object.defineProperty(r,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var i in e)n.d(r,i,function(t){return e[t]}.bind(null,i));return r},n.n=function(e){var t=e&&e.__esModule?function(){return e.default}:function(){return e};return n.d(t,"a",t),t},n.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},n.p="",n(n.s=0)}([function(e,t,n){"use strict";function r(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function i(e,t,n){return t&&r(e.prototype,t),n&&r(e,n),e}function o(e,t,n){var r=t.get(e);if(!r)throw new TypeError("attempted to set private field on non-instance");if(r.set)r.set.call(e,n);else{if(!r.writable)throw new TypeError("attempted to set read only private field");r.value=n}return n}function u(e,t){var n=t.get(e);if(!n)throw new TypeError("attempted to get private field on non-instance");return n.get?n.get.call(e):n.value}n.r(t);var s=function(){function e(t,n){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),f.add(this),a.set(this,{writable:!0,value:!1}),c.set(this,{writable:!0,value:void 0}),l.set(this,{writable:!0,value:void 0}),o(this,c,t),o(this,l,n)}return i(e,[{key:"isActive",get:function(){return!u(this,a)}}]),i(e,[{key:"unsubscribe",value:function(){return!u(this,a)&&(o(this,a,u(this,c).unsubscribe(u(this,l))),u(this,a)&&function(e,t,n){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return n}(this,f,p).call(this),u(this,a))}}]),e}(),a=new WeakMap,c=new WeakMap,l=new WeakMap,f=new WeakSet,p=function(){o(this,c,null),o(this,l,null)};function v(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}var h=function(){function e(t,n,r,i){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),this.token=t,this.subscription=i,this.callback=n,this.eventName=r}var t,n,r;return t=e,(n=[{key:"destroy",value:function(){this.token=null,this.subscription=null,this.callback=null,this.eventName=null}}])&&v(t.prototype,n),r&&v(t,r),e}();function b(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function y(e,t,n){return t in e?Object.defineProperty(e,t,{value:n,enumerable:!0,configurable:!0,writable:!0}):e[t]=n,e}function d(e,t,n){if(!t.has(e))throw new TypeError("attempted to get private field on non-instance");return n}var w=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),g.add(this),y(this,"subscriptionDescriptors",[]),y(this,"subscriptions",{})}var t,n,r;return t=e,(n=[{key:"registerDescriptor",value:function(e){return this.subscriptionDescriptors.push(e),this.getOrCreateEventCollection(e.eventName).push(e),e}},{key:"unregisterDescriptor",value:function(e){return d(this,g,k).call(this,this.subscriptionDescriptors,e),d(this,g,k).call(this,this.getOrCreateEventCollection(e.eventName),e),this.removeEmptyEvent(e.eventName),!0}},{key:"unregisterDescriptorByToken",value:function(e){var t=!(arguments.length>1&&void 0!==arguments[1])||arguments[1],n=this.getDescriptor(e),r=!!n&&this.unregisterDescriptor(n);return r&&t&&n.destroy(),r}},{key:"getDescriptor",value:function(e){return this.subscriptionDescriptors.find((function(t){return t.token==e}))}},{key:"getOrCreateEventCollection",value:function(e){return this.subscriptions.hasOwnProperty(e)?this.subscriptions[e]:this.subscriptions[e]=[]}},{key:"getEventCollection",value:function(e){return this.subscriptions.hasOwnProperty(e)?this.subscriptions[e]:null}},{key:"hasEvent",value:function(e){return this.subscriptions.hasOwnProperty(e)}},{key:"removeEvent",value:function(e){this.hasEvent(e)&&delete this.subscriptions[e]}},{key:"removeEmptyEvent",value:function(e){this.hasEvent(e)&&0==this.subscriptions[e].length&&delete this.subscriptions[e]}}])&&b(t.prototype,n),r&&b(t,r),e}(),g=new WeakSet,k=function(e,t){var n=e.findIndex((function(e){return e==t}));return!(n<0)&&1==e.splice(n,1)};function m(e,t){for(var n=0;n<t.length;n++){var r=t[n];r.enumerable=r.enumerable||!1,r.configurable=!0,"value"in r&&(r.writable=!0),Object.defineProperty(e,r.key,r)}}function E(e,t){var n=t.get(e);if(!n)throw new TypeError("attempted to get private field on non-instance");return n.get?n.get.call(e):n.value}var O=void 0,j=function(){function e(){!function(e,t){if(!(e instanceof t))throw new TypeError("Cannot call a class as a function")}(this,e),T.set(this,{writable:!0,value:new w})}var t,n,r;return t=e,r=[{key:"create",value:function(){return new e}},{key:"global",get:function(){return O||(O=new e)}}],(n=[{key:"subscribe",value:function(e,t){var n=E(this,T),r=Symbol("token"),i=new s(this,r),o=new h(r,t,e,i);return n.registerDescriptor(o).subscription}},{key:"unsubscribe",value:function(e){return E(this,T).unregisterDescriptorByToken(e)}},{key:"dispatch",value:function(e,t){var n=E(this,T).getEventCollection(e);return!!n&&(n.forEach((function(e){return e.callback(t)})),!0)}}])&&m(t.prototype,n),r&&m(t,r),e}(),T=new WeakMap;n.d(t,"EventManager",(function(){return j}))}])}));
//# sourceMappingURL=event-manager.js.map