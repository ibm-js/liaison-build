define("liaison/BindingSource",[],function(){"use strict";function a(a,b){try{return a.call(this,b)}catch(c){return console.error("Error occured in data converter callback: "+(c.stack||c)),b}}var b=function(){var b={_openObserver:function(){function a(a){try{a(this.newValue,this.oldValue)}catch(b){console.error("Error occured in BindingSource callback: "+(b.stack||b))}}return function(){if(!this.observerIsOpen){var b=this._ensureObserver().open(function(b,c){this.boundFormatter&&(b=this.boundFormatter(b),c=Object(c)!==c||Object(this.value)===this.value?this.boundFormatter(c):this.value),this.value=b,this.callbacks.forEach(a,{newValue:b,oldValue:c})},this);this.value=this.boundFormatter?this.boundFormatter(b):b,this.observerIsOpen=!0}}}(),_closeObserver:function(){this.observer&&(this.observer.close(),this.observer=null),this.observerIsOpen=!1},observe:function(a){return this._openObserver(),this.callbacks=this.callbacks||[],this.callbacks.indexOf(a)<0&&this.callbacks.push(a),{remove:function(){var b=this.callbacks.indexOf(a);b>=0&&(this.callbacks.splice(b,1),0!==this.callbacks.length||this.keepObserver||this._closeObserver())}.bind(this)}},open:function(a,b){return this.callbacks&&(this.callbacks.length=0),this.observe(a.bind(b)),this.value},getFrom:function(){return this._openObserver(),this.deliver(),this.value},setTo:function(a){this._ensureObserver().setValue(this.boundParser?this.boundParser(a):a)},deliver:function(){this._ensureObserver().deliver()},discardChanges:function(){var a=this._ensureObserver().discardChanges();return this.boundFormatter?this.boundFormatter(a):a},get formatter(){return this._formatter},set formatter(b){this._formatter=b,(this._formatter=b)&&(this.boundFormatter=a.bind(this,b))},get parser(){return this._parser},set parser(b){this._parser=b,(this._parser=b)&&(this.boundParser=a.bind(this,b))},remove:function(){this.callbacks&&(this.callbacks.length=0),this.observer&&this.observer.close()}};return b.setValue=b.setTo,b.close=b.remove,b}();return b}),define("liaison/BindingSourceList",["./BindingSource"],function(a){"use strict";function b(a,b,c){this.sources=a,this.formatter=b,this.parser=c}return b.prototype=Object.create(a),b.Observer=function(a){this.sources=a,this.remove=this.close},b.Observer.prototype={open:function(){function a(a,b,c){this.deliveringRest||(this.oldValues=this.values.slice()),this.values[a]=b,this.oldValues[a]=c,this.deliveringRest||(this.deliveringRest=!0,this.sources.forEach(function(b,c){c!==a&&b.deliver()}),this.callback(this.values,this.oldValues),this.deliveringRest=!1)}return function(b,c){this.callback=b.bind(c),this.values=[],this.handles=[];for(var d=0,e=this.sources.length;e>d;++d)if("function"==typeof this.sources[d].observe)this.values[d]=this.sources[d].getFrom(),this.handles[d]=this.sources[d].observe(a.bind(this,d));else{if("function"!=typeof this.sources[d].open)throw new Error("Cannot observe source: "+this.sources[d]+" at index: "+d);this.handles[d]=this.sources[d],this.values[d]=this.sources[d].open(a.bind(this,d))}return this.opened=!0,this.values}}(),deliver:function(){this.beingDelivered=!0,this.sources.forEach(function(a){a.deliver()}),this.beingDelivered=!1},discardChanges:function(){for(var a=[],b=0,c=this.sources.length;c>b;++b)a[b]=this.sources[b].discardChanges();return a},setValue:function(a){for(var b=0,c=this.sources.length;c>b;++b)this.sources[b].setValue(a[b])},close:function(){if(this.handles)for(var a;a=this.handles.shift();)"function"==typeof a.remove?a.remove():a.close();this.closed=!0}},b.prototype._ensureObserver=function(){return this.observer||(this.observer=new b.Observer(this.sources)),this.observer},b}),define("liaison/BindingTarget",[],function(){"use strict";function a(a,b,c){this.object=a,this.property=b,this.options=c;var d=a.bindings;d||Object.defineProperty(a,"bindings",{value:d={},configurable:!0}),d[b]=this}var b={};return a.prototype={get value(){return this.object[this.property]},set value(a){"function"==typeof this.object.set?this.object.set(this.property,a):this.object[this.property]=a},bind:function(){function a(a){this.value=a}return function(c){return this.h&&(this.h.remove(),this.h=null),this.source=c,"function"==typeof(c||b).observe?(this.h=c.observe(a.bind(this)),this.value=c.getFrom()):"function"==typeof(c||b).open?(this.h={remove:c.close.bind(c)},this.value=c.open(a,this)):this.value=c,this}}(),updateSource:function(){(this.source||b).setTo&&this.source.setTo(this.value)},remove:function(){this.h&&(this.h.remove(),this.h=null),this.source=null;var a,b=this.object.bindings;b&&delete b[this.property];for(var c in b){a=!0;break}a||delete this.object.bindings}},a.prototype.close=a.prototype.remove,a}),define("liaison/DOMBindingTarget",["decor/Observable","./features","./BindingTarget"],function(a,b,c){"use strict";function d(c,d,e){var f,g,h=d in c?"update":"add",i=c[d],j=a.is(e,i);if(b("object-observe-api")&&!j&&(f=c.constructor._autoEmit=c.constructor._autoEmit||{},d in f||(f[d]=!1,Object.observe(c,g=function(){f[d]=!0}))),c[d]=e,b("object-observe-api")&&g&&(Object.deliverChangeRecords(g),Object.unobserve(c,g)),!j&&(b("object-observe-api")?!f[d]:void 0===(Object.getOwnPropertyDescriptor(c,d)||l).set)){var k={type:h,object:c,name:d+""};"update"===h&&(k.oldValue=i),a.getNotifier(c).notify(k)}return e}function e(){var a=m.slice.call(arguments);a[1]=a[1].toLowerCase(),c.apply(this,a),this.targetProperty=(s.exec(a[1])||m)[1]||a[1]}function f(){var a=m.slice.call(arguments);a[1]=a[1].toLowerCase(),c.apply(this,a),this.targetAttribute=this.property.substr(0,this.property.length-1)}function g(){var a=m.slice.call(arguments);c.apply(this,a),this.targetProperty=(s.exec(a[1])||m)[1]||a[1]}function h(){g.apply(this,arguments),this.object.addEventListener(this.eventName,this.boundEventListenerCallback=this.eventListenerCallback.bind(this))}function i(a){var b=[],c=a.form;if(!a.form)for(c=a;c.parentNode;)c=c.parentNode;for(var d=c.querySelectorAll('input[type="radio"][name="'+a.name+'"]'),e=0,f=d.length;f>e;++e)d[e]===a||"INPUT"!==d[e].tagName||!n.test(d[e].type)||d[e].name.toLowerCase()!==a.name.toLowerCase()||!a.form&&d[e].form||b.push(d[e]);return b}function j(){var a=m.slice.call(arguments);a[1]="checked",h.apply(this,a)}function k(){var a=m.slice.call(arguments);a[1]="nodeValue",g.apply(this,a)}var l={},m=[],n=/^radio$/i,o=/^(checkbox|radio)$/i,p=/^(_?)value$/i,q=/^(_?)checked$/i,r=/^(_?)selectedIndex$/i,s=/^_(.*)$/,t="undefined"!=typeof Element,u=t&&"function"==typeof HTMLElement.prototype.bind;e.prototype=Object.create(c.prototype),Object.defineProperty(e.prototype,"value",{get:function(){return this.object.getAttribute(this.targetProperty)},set:function(b){var c={type:"update",object:this.object,name:this.targetProperty,oldValue:this.value};this.object.setAttribute(this.targetProperty,null!=b?b:""),a.getNotifier(this.object).notify(c)},enumerable:!0,configurable:!0}),e.useExisting=u,f.prototype=Object.create(c.prototype),Object.defineProperty(f.prototype,"value",{get:function(){return this.object.hasAttribute(this.targetAttribute)},set:function(a){a?this.object.setAttribute(this.targetAttribute,""):this.object.removeAttribute(this.targetAttribute)},enumerable:!0,configurable:!0}),!u&&t&&(Node.prototype.bind=Node.prototype.unbind=function(){throw new TypeError("Cannot bind/unbind to/from this node type: "+this.nodeType)},HTMLElement.prototype.bind=function(a,b){var c=(this.bindings||l)[a];return c=c||(a.lastIndexOf("?")===a.length-1?new f(this,a):new e(this,a)),c.bind(b)},HTMLElement.prototype.unbind=function(a){(this.bindings||l)[a]&&this.bindings[a].remove()},void 0!==typeof SVGElement&&(SVGElement.prototype.bind=HTMLElement.prototype.bind,SVGElement.prototype.unbind=HTMLElement.prototype.unbind)),g.prototype=Object.create(c.prototype),Object.defineProperty(g.prototype,"value",{get:function(){return this.object[this.targetProperty]},set:function(a){d(this.object,this.targetProperty,null!=a?a:"")},enumerable:!0,configurable:!0}),h.prototype=Object.create(g.prototype),h.prototype.eventName="change",h.prototype.eventListenerCallback=h.prototype.updateSource,h.prototype.remove=h.prototype.close=function(){c.prototype.remove.call(this),this.boundEventListenerCallback&&(this.object.removeEventListener(this.eventName,this.boundEventListenerCallback),this.boundEventListenerCallback=null)};var v=function(){var a;return function(){var b=m.slice.call(arguments);if(b[1]="value",h.apply(this,b),void 0===a){var c=document.documentMode;a=parseFloat(navigator.appVersion.split("MSIE ")[1])||void 0,c&&5!==c&&Math.floor(a)!==c&&(a=c)}if(10>a){v.all||(v.all=[]),v.all.push(this);var d=this.object.ownerDocument;v.docs.indexOf(d)<0&&(v.docs.push(d),d.addEventListener("selectionchange",v.updateSourceForActiveElement))}}}();return v.prototype=Object.create(h.prototype),v.prototype.eventName="input",v.prototype.remove=v.prototype.close=function(){h.prototype.remove.apply(this,arguments);for(var a;(a=(v.all||m).indexOf(this))>=0;)v.all.splice(a,1);if(0===(v.all||m).length){for(var b;b=v.docs.shift();)b.removeEventListener("selectionchange",v.updateSourceForActiveElement);delete v.all}},v.docs=[],v.updateSourceForActiveElement=function(){var a=((document.activeElement||l).bindings||l).value;a&&"INPUT"===a.object.tagName&&a.updateSource&&a.updateSource()},j.prototype=Object.create(h.prototype),j.prototype.eventListenerCallback=function(){if(this.updateSource(),n.test(this.object.type))for(var a=i(this.object),b=0,c=a.length;c>b;++b){var d=(a[b].bindings||l).checked;d&&d.updateSource()}},Object.defineProperty(j.prototype,"value",{get:function(){return this.object[this.property]},set:function(a){if(d(this.object,this.property,a),a&&n.test(this.object.type))for(var b=i(this.object),c=0,e=b.length;e>c;++c){var f=(b[c].bindings||l).checked;f&&f.updateSource()}}}),!u&&t&&(HTMLInputElement.prototype.bind=HTMLTextAreaElement.prototype.bind=function(a,b){var c=(this.bindings||l)[a];if(!c){var d,e=o.test(this.type);c=!e&&(d=p.exec(a))?new v(this,d[1]+"value"):e&&(d=q.exec(a))?new j(this,d[1]+"checked"):HTMLElement.prototype.bind.call(this,a)}return c.bind(b)},HTMLSelectElement.prototype.bind=function(a,b){var c,d=(this.bindings||l)[a];return d||(d=(c=p.exec(a))?new h(this,c[1]+"value"):(c=r.exec(a))?new h(this,c[1]+"selectedIndex"):HTMLElement.prototype.bind.call(this,a)),d.bind(b)}),k.prototype=Object.create(g.prototype),!u&&t&&(Text.prototype.bind=function(a,b){var c;for(var d in this.bindings){c=this.bindings[d];break}return(c||new k(this,a)).bind(b)},Text.prototype.unbind=function(){for(var a in this.bindings)this.bindings[a].remove()}),e}),define("liaison/DOMTreeBindingTarget",["./features","./schedule","./ObservableArray","./ObservablePath","./BindingSourceList","./BindingTarget","./DOMBindingTarget","./computed","./templateBinder"],function(a,b,c,d,e,f,g,h,i){"use strict";function j(){var a=p.slice.call(arguments);a[1]=r,f.apply(this,a),this.bound=[]}function k(){var a=p.slice.call(arguments);a[1]=s,f.apply(this,a),this.bound=[]}function l(){var a=p.slice.call(arguments);a[1]=q,f.apply(this,a)}function m(){var a=p.slice.call(arguments);a[1]=t,g.apply(this,a)}function n(a,b,c){var d=a.bindings&&a.bindings[b];if(!d){var e=u.test(b)&&l||v.test(b)&&j||w.test(b)&&k||x.test(b)&&m;e&&(d=new e(a,b))}return d&&d.bind(c)}var o={},p=[],q="if",r="bind",s="repeat",t="ref",u=/^if$/i,v=/^bind$/i,w=/^repeat$/i,x=/^ref$/i,y=/^template$/i,z=/template$/i,A="undefined"!=typeof Element,B=Object.defineProperty;j.prototype=Object.create(f.prototype),j.prototype.getTemplate=function(){var a=this.object.getAttribute("ref"),b=a&&this.object.ownerDocument.getElementById(a)||this.object;return a&&!b&&console.warn("Invalid template reference detected. Ignoring: "+a),b.upgradeToTemplate()},j.prototype.remove=j.prototype.close=function(){this.instanceData&&(this.instanceData.remove(),this.instanceData=null),this.hInstantiation&&(this.hInstantiation.remove(),this.hInstantiation=null),f.prototype.remove.apply(this,arguments)},B(j.prototype,"value",{get:function(){return this.model},set:function(){function a(){this.hInstantiation=null,this.instanceData&&(this.instanceData.remove(),this.instanceData=null);var a=this.object.bindings[q];!this.model||a&&!a.value||(this.instanceData=this.getTemplate().instantiate(this.model),this.object.parentNode.insertBefore(this.instanceData.content,this.object.nextSibling))}return function(c){this.model=c,this.hInstantiation=this.hInstantiation||b(a.bind(this))}}(),enumerable:!0,configurable:!0}),k.prototype=Object.create(j.prototype),k.prototype.remove=k.prototype.close=function(){if(this.ha&&(this.ha.remove(),this.ha=null),this.instanceDataList)for(var a;a=this.instanceDataList.shift();)a.remove();this.hInstantiation&&(this.hInstantiation.remove(),this.hInstantiation=null),j.prototype.remove.apply(this,arguments)},B(k.prototype,"value",{get:function(){return this.model},set:function(){function a(a){for(var b=0,c=a.length;c>b;++b){for(var d,e=a[b].index,f=this.instanceDataList.splice(e,a[b].removed.length);d=f.shift();)d.remove();var g,h=this.object.nextSibling;if(e<this.instanceDataList.length){for(g=this.instanceDataList[e].childNodes[0];g;g=g.nextSibling)if(g.parentNode===this.object.parentNode){h=g;break}}else if(e>=1&&e-1<this.instanceDataList.length){var i=this.instanceDataList[e-1].childNodes;for(g=i[i.length-1];g;g=g.previousSibling)if(g.parentNode===this.object.parentNode){h=g.nextSibling;break}}for(var j=0;j<a[b].addedCount;++j){var k=this.template.instantiate(this.model[e+j]);this.object.parentNode.insertBefore(k.content,h),this.instanceDataList.splice(e+j,0,k)}}}function d(b){this.hInstantiation=null,this.instanceDataList=this.instanceDataList||[],c.canObserve(this.model)&&(this.ha=c.observe(this.model,a.bind(this))),void 0!==this.model&&"function"!=typeof(this.model||o).splice&&console.warn("An attempt to set a non-array value is detected. Auto-repeat won't happen.");var d=this.object.bindings[q],e="function"==typeof(this.model||o).splice&&(!d||d.value);this.template=this.getTemplate(),a.call(this,[{index:0,removed:"function"==typeof(b||o).splice?b:p,addedCount:e?this.model.length:0}])}return function(a){this.ha&&(this.ha.remove(),this.ha=null);var c=this.model;this.model=a,this.hInstantiation=this.hInstantiation||b(d.bind(this,c))}}(),enumerable:!0,configurable:!0}),l.prototype=Object.create(f.prototype),B(l.prototype,"value",{get:function(){return this.condition},set:function(a){this.condition=a;var b=this.object.bindings[s]||this.object.bindings[r];b&&(b.value=b.value)},enumerable:!0,configurable:!0}),m.prototype=Object.create(g.prototype),B(m.prototype,"value",{get:function(){return this.object.getAttribute(this.property)},set:function(a){this.object.setAttribute(this.property,null!=a?a:"");var b=this.object.bindings[s]||this.object.bindings[r];b&&(b.value=b.value)},enumerable:!0,configurable:!0});var C=[];A&&(C.push("undefined"!=typeof HTMLTemplateElement?HTMLTemplateElement:"undefined"!=typeof HTMLUnknownElement?HTMLUnknownElement:HTMLElement,HTMLScriptElement),"undefined"!=typeof Element&&C.push(Element),"undefined"!=typeof SVGElement&&C.push(SVGElement)),g.useExisting||C.forEach(function(a){var b=a.prototype.bind;a.prototype.bind=function(a,c){var d=y.test(this.tagName)||"SCRIPT"===this.tagName&&z.test(this.getAttribute("type"));return d&&n(this,a,c)||b.apply(this,arguments)}});var D=function(){function b(a){return"TEMPLATE"===a.tagName||"template"===a.tagName&&"http://www.w3.org/2000/svg"===a.namespaceURI||a.hasAttribute("template")||"SCRIPT"===a.tagName&&z.test(a.getAttribute("type"))}function c(a){return(a.content||o).nodeType===Node.DOCUMENT_FRAGMENT_NODE}return function(){if(!b(this))throw new TypeError('Only <template>, <element template>, or <script type="x-template"> (except in SVG context) can be used as a template.');if(!c(this))if(a("polymer-template-decorate"))HTMLTemplateElement.decorate(this);else{var d=this;if("SCRIPT"===d.tagName&&((d=this.ownerDocument.createElement("template")).innerHTML=this.innerHTML),c(d))d!==this&&(this.content=d.content.cloneNode(!0));else{for(var e=d.ownerDocument.createDocumentFragment();d.firstChild;)e.appendChild(d.firstChild);this.content=e}}return a("polymer-template-decorate")&&HTMLTemplateElement.bootstrap(this),this}}();C.forEach(function(a){a.prototype.upgradeToTemplate=D});var E=function(){function a(a,b){for(var c=null;c=a.shift();)c.remove();for(var d;d=this.childNodes.pop();)d.parentNode&&d.parentNode.removeChild(d),d._instanceData=null;if(b)for(var e;e=b.shift();)e.remove()}function b(){return this.instanceData}return function(c){var d=y.test(this.tagName)||"SCRIPT"===this.tagName&&z.test(this.getAttribute("type"));if(!d)throw new TypeError("Wrong element type for instantiating template content: "+this.tagName);var e="function"==typeof this.createInstance;this.content.parsed=this.content.parsed||!e&&i.parseNode(this.content);var f=[],g=[],j=this.createBindingSourceFactory.bind(this),k=e?this.createInstance(c,this.createBindingSourceFactory&&{prepareBinding:j},void 0,g):i.createContent(this,this.content.parsed,f);!e&&i.assignSources.call(this,c,f,j);var l={model:c,content:k,childNodes:p.slice.call(k.childNodes)},m=h.apply(c);return B(l,"instanceData",{get:b.bind(this),configurable:!0}),l.remove=a.bind(l,e?g.map(function(a){return a.remove=a.close,a}):i.bind(f),!this.preventRemoveComputed&&m),p.forEach.call(l.childNodes,function(a){a._instanceData=l}),l}}();return C.forEach(function(a){a.prototype.instantiate=E}),"undefined"==typeof Node||Object.getOwnPropertyDescriptor(Node.prototype,"instanceData")||B(Node.prototype,"instanceData",{get:function(){return this._instanceData||this.templateInstance_||(this.parentNode||o).instanceData},configurable:!0}),j}),define("liaison/Each",["decor/Observable","./ObservableArray","./BindingSource","./ObservablePath","./BindingSourceList"],function(a,b,c,d,e){"use strict";function f(a,b,c,d){this.sources=a,"function"!=typeof b?(this.paths=b,this.formatter=c,this.parser=d):(this.formatter=b,this.parser=c)}var g={},h=[];return f.prototype=Object.create(c),f.Observer=function(a,b){if(!Array.isArray(b=void 0!==b?b:h))throw new TypeError("Paths in Each must be an array of paths corresponding to each sources. We instead got: "+b);return new e.Observer(a.map(function(a,c){return new f.SubObserver(a,b[c])}))},f.SubObserver=function(a,b){this.source=a,this.paths=b,this.remove=this.close},f.SubObserver.prototype={open:function(){function a(a,b){var c=-1,d=0;return a.forEach(function(a,e){0>c&&b.index<a.index&&(c=e,d+=b.addedCount-b.removed.length),a.index+=d}),a.splice(c>=0?c:a.length,0,{index:b.index,removed:b.removed.slice(),addedCount:b.addedCount}),a}function c(a){var b=new e.Observer(this.paths.map(function(b){return new d.Observer(a,b)},this));return b.open(j,this),b}function f(b){b.reduce(a,[]).forEach(function(a){var b=this.a.slice(a.index,a.index+a.addedCount).map(c,this);b.unshift(a.index,a.removed.length),h.splice.apply(this.hEntries,b).forEach(Function.prototype.call,e.Observer.prototype.close)},this)}function g(a){this.splicesBeingDiscarded||(this.hEntries&&f.call(this,a),j.call(this))}function i(a){if(this.ha&&(this.splicesBeingDiscarded=!0,this.ha.deliver(),this.splicesBeingDiscarded=!1,this.ha.remove(),this.ha=null),this.hEntries&&f.call(this,[{index:0,removed:this.hEntries,addedCount:0}]),this.a=a,"undefined"!=typeof ArrayObserver&&Array.isArray(a)?(this.ha=Object.create(new ArrayObserver(a)),this.ha.open(g,this),this.ha.remove=this.ha.close):b.canObserve(a)&&(this.ha=Object.create(b.observe(a,g.bind(this)))),void 0!==this.paths&&Array.isArray(this.a)){if(!Array.isArray(this.paths))throw new TypeError("Paths in Each must be an array of paths corresponding to each sources. We instead got: "+this.paths);this.hEntries=this.hEntries||[],f.call(this,[{index:0,removed:h,addedCount:this.a.length}])}this.opened&&j.call(this)}function j(){if(!this.beingDiscarded&&!this.deliveringRest&&!this.closed){var a=this.value;this.deliveringRest=!0,this.deliver(),this.deliveringRest=!1,this.value=Array.isArray(this.a)?this.a.slice():this.a,this.callback(this.value,a)}}return function(a,b){var c=this.source.open(i,this);return this.callback=a.bind(b),i.call(this,c),this.value=Array.isArray(c)?c.slice():c,this.opened=!0,c}}(),deliver:function(){this.source.deliver(),this.ha&&this.ha.deliver(),this.hEntries&&this.hEntries.forEach(Function.prototype.call,e.Observer.prototype.deliver)},discardChanges:function(){return this.beingDiscarded=!0,this.source.deliver(),this.ha&&this.ha.deliver(),this.hEntries&&this.hEntries.forEach(Function.prototype.call,e.Observer.prototype.discardChanges),this.beingDiscarded=!1,this.a},setValue:function(a){this.source.setValue(a)},close:function(){this.source.close(),this.ha&&(this.ha.remove(),this.ha=null),this.closed=!0}},f.prototype._ensureObserver=function(){return function(){if(!this.observer){if(!Array.isArray(this.sources))throw new TypeError("Sources in Each must be an array. We instead got: "+this.sources);this.observer=new f.Observer(this.sources.map(function(b){return"function"==typeof(b||g).deliver?b:new d.Observer(new a({a:b}),"a")}),this.paths)}return this.observer}}(),f}),define("liaison/ObservableArray",["requirejs-dplugins/has","decor/Observable"],function(a,b){"use strict";var c,d,e=Object.defineProperty,f=[],g=/\[\s*object\s+global\s*\]/i;return function(){var h="_observableArray";c=a("object-observe-api")?function(a){var c=[];return b.call(c),e(c,h,{value:1}),e(c,"set",Object.getOwnPropertyDescriptor(b.prototype,"set")),"number"==typeof a&&1===arguments.length?c.length=a:f.push.apply(c,arguments),c}:function(a){var i=this&&!g.test(this)&&!this.hasOwnProperty("length"),j=i?[]:new c;if(i){b.call(j),e(j,h,{value:1});for(var k in d)e(j,k,{value:d[k],configurable:!0,writable:!0})}return"number"==typeof a&&1===arguments.length?j.length=a:f.push.apply(j,arguments),j},c.test=function(a){return a&&a[h]}}(),c.canObserve=a("object-observe-api")?function(a){return"function"==typeof(a||{}).splice}:c.test,a("object-observe-api")||!function(){function a(a,c){0>a&&(a=this.length+a);var d=this.length,e={index:a,removed:this.slice(a,a+c),addedCount:arguments.length-2},g=f.splice.apply(this,arguments),h=d!==this.length&&{type:"update",object:this,name:"length",oldValue:d},i=b.getNotifier(this);return i.performChange("splice",function(){return h&&i.notify(h),e}),g}d={splice:a,set:function(c,d){var e;return"length"===c?(e=new Array(Math.max(d-this.length,0)),e.unshift(Math.min(this.length,d),Math.max(this.length-d,0)),a.apply(this,e)):!isNaN(c)&&+c>=this.length?(e=new Array(c-this.length),e.push(d),e.unshift(this.length,0),a.apply(this,e)):b.prototype.set.call(this,c,d),d},pop:function(){return a.call(this,-1,1)[0]},push:function(){var b=[this.length,0];return f.push.apply(b,arguments),a.apply(this,b),this.length},reverse:function(){var a={type:"splice",object:this,index:0,removed:this.slice(),addedCount:this.length},c=f.reverse.apply(this,arguments);return b.getNotifier(this).notify(a),c},shift:function(){return a.call(this,0,1)[0]},sort:function(){var a={type:"splice",object:this,index:0,removed:this.slice(),addedCount:this.length},c=f.sort.apply(this,arguments);return b.getNotifier(this).notify(a),c},unshift:function(){var b=[0,0];return f.push.apply(b,arguments),a.apply(this,b),this.length}}}(),c.observe=function(){function c(a,b,c,d){return c>=b?b-c:a>=d?d-a:Math.min(b,d)-Math.max(a,c)}function d(a){return"add"!==a.type&&"update"!==a.type?a:{type:"splice",object:a.object,index:+a.name,removed:[a.oldValue],addedCount:1}}function e(b,e){var g=[];e.forEach(function(b){b=d(b);for(var e=!1,h=0,i=0;i<g.length;++i){var j;a("object-observe-api")&&Object.isFrozen(g[i])?j=g[i]={type:"splice",object:g[i].object,index:g[i].index+h,removed:g[i].removed,addedCount:g[i].addedCount}:(j=g[i],j.index+=h);var k=c(j.index,j.index+j.addedCount,b.index,b.index+b.removed.length);if(k>=0){g.splice(i--,1);var l,m=j.addedCount-k+b.addedCount;j.index<b.index?(l=b.removed.slice(Math.max(k,0)),f.unshift.apply(l,j.removed)):(l=b.removed.slice(0,k>0?j.index-b.index:b.length),f.push.apply(l,j.removed),f.push.apply(l,b.removed.slice(j.index+j.addedCount-b.index))),0===l.length&&0===m?e=!0:b={type:"splice",object:j.object,index:Math.min(j.index,b.index),removed:l,addedCount:m},h-=j.addedCount-j.removed.length}else if(b.index<j.index){var n=b.addedCount-b.removed.length;j.index+=n,h+=n,g.splice(i++,0,b),e=!0}}e||g.push(b)}),g.length>0&&b(g)}return a("object-observe-api")?function(a,b){return Array.observe(a,b=e.bind(a,b)),{deliver:Object.deliverChangeRecords.bind(Object,b),remove:Array.unobserve.bind(Array,a,b)}}:function(a,c){var d=Object.create(b.observe(a,c=e.bind(a,c),["add","update","delete","splice"]));return d.deliver=b.deliverChangeRecords.bind(b,c),d}}(),c}),define("liaison/ObservablePath",["decor/Observable","./features","./BindingSource"],function(a,b,c){"use strict";function d(a,b){return""===a?[]:"function"!=typeof a.splice?a.split("."):b?a.slice():a}function e(a,b){for(var c=d(b),e=0,f=c.length;f>e;++e){var g=c[e];a=null==a?a:a[g]}return a}function f(a,b,c){var f=d(b,!0),g=f.pop();return a=f.length>0?e(a,f):a,Object(a)===a&&b?"function"==typeof a.set?a.set(g,c):a[g]=c:void 0}function g(a,b,c,d){this.object=a,this.path=b,this.formatter=c,this.parser=d}var h={};return g.prototype=Object.create(c),g.Observer=b("polymer-pathobserver")?PathObserver:function(a,b){b=Array.isArray(b)?b:null!=b?""+b:[];var c=d(b,!0);this.o=a,this.prop=c.shift(),this.remainder=c,this.remove=this.close},b("polymer-pathobserver")||(g.Observer.prototype={open:function(){function b(b,c){if(!this.closed){for(var d,f,h,i=0,j=c.length;j>i;++i)if(c[i].name===this.prop){d=!0,h=c[i].oldValue,f=this.o[this.prop];break}if(d){var k=this.remainder.length>0;if(a.is(f,h)||(this.observerRemainder&&(this.observerRemainder.remove(),this.observerRemainder=null),k&&Object(this.o[this.prop])===this.o[this.prop]&&(this.observerRemainder=new g.Observer(this.o[this.prop],this.remainder),this.observerRemainder.open(b))),!this.beingDiscarded){var l=k?e(h,this.remainder):h,m=k?e(f,this.remainder):f;a.is(l,m)||b(m,l)}}}}return function(c,d){if(Object(this.o)!==this.o)console.warn("Non-object "+this.o+" is used with ObservablePath. Observation not happening.");else{var f=b.bind(this,c=c.bind(d));this.hProp=a.observe(this.o,f),this.hProp.boundCallback=f,this.remainder.length>0&&Object(this.o[this.prop])===this.o[this.prop]&&(this.observerRemainder=new g.Observer(this.o[this.prop],this.remainder)).open(c)}return this.opened=!0,e(this.prop?(this.o||h)[this.prop]:this.o,this.remainder)}}(),deliver:function(){this.hProp&&a.deliverChangeRecords(this.hProp.boundCallback),this.observerRemainder&&this.observerRemainder.deliver()},discardChanges:function(){return this.beingDiscarded=!0,this.hProp&&a.deliverChangeRecords(this.hProp.boundCallback),this.beingDiscarded=!1,this.observerRemainder?this.observerRemainder.discardChanges():e(this.prop?(this.o||h)[this.prop]:this.o,this.remainder)},setValue:function(a){this.remainder.length>0?f((this.o||h)[this.prop],this.remainder,a):"function"==typeof(this.o||h).set&&this.prop?this.o.set(this.prop,a):Object(this.o)===this.o&&this.prop&&(this.o[this.prop]=a)},close:function(){this.hProp&&(this.hProp.remove(),this.hProp=null),this.observerRemainder&&(this.observerRemainder.close(),this.observerRemainder=null),this.closed=!0}}),g.prototype._ensureObserver=function(){return function(){return this.observer||(this.observer=new g.Observer(this.object,this.path)),this.observer}}(),g.getObjectPath=e,g.setObjectPath=f,g}),define("liaison/alternateBindingSource",["./features","./ObservablePath"],function(a,b){"use strict";function c(a,b,c,d){this.object=a,this.path=b,this.node=c,this.name=d}function d(a){this.source=a,this.deliver=a.deliver.bind(a),this.close=this.remove=a.close.bind(a)}function e(a,b,c){d.call(this,a),this.update=function(a){return b.style.display=!c^!a?"none":"",a}}function f(a,b){d.call(this,a),this.update=function(a){return a?b:""}}var g={},h=/^on\-(.+)$/i;if(c.prototype={open:function(){function a(a,b,c){return a.addEventListener(b,c),{remove:a.removeEventListener.bind(a,b,c)}}function c(a){for(var c,d=this.object,e=this.node.instanceData;"function"!=typeof(c=b.getObjectPath(d,this.path))&&e;d=e.model,e=e.instanceData);"function"==typeof c?c.call(d,a,a.detail,this.node):console.warn("Event handler function "+this.path+" not found.")}return function(){return this.callback=c.bind(this),this.h=a(this.node,h.exec(this.name)[1],this.callback),this.node.getAttribute(this.name)}}(),deliver:function(){},discardChanges:function(){return this.callback},setValue:function(){},close:function(){this.h&&(this.h.remove(),this.h=null)}},d.prototype={open:function(a,b){return this.update(this.source.open(function(c,d){a.call(b,this.update(c),d)},this))},discardChanges:function(){return this.update(this.source.discardChanges())},setValue:function(){}},e.prototype=Object.create(d.prototype),f.prototype=Object.create(d.prototype),"undefined"!=typeof Element){var i=Element.prototype.createBindingSourceFactory;Element.prototype.createBindingSourceFactory=function(a,d){var j,k=(this.bindingDelegate||g).prepareBinding;if("l-show"===d||"l-hide"===d)return j=k?k(a,""):this.createBindingSourceFactory(a,""),function(c,f){var g=j&&j(c,f)||new b.Observer(c,a);return new e(g,f,"l-show"===d)};if("class"===d&&a.indexOf(":")>=0){var l=a.split(":"),m=l[0],n=l.slice(1).join(":");return j=k?k(n,d+":"+m):this.createBindingSourceFactory(n,d+":"+m),function(a,c){var d=j&&j(a,c)||new b.Observer(a,n);return new f(d,m)}}return j=i&&i.apply(this,arguments),j?j:h.test(d)?function(b,e){return new c(b,a,e,d)}:void 0}}return a("polymer-createInstance")&&!function(){function a(){return this.instanceData}if("undefined"!=typeof HTMLTemplateElement&&"function"==typeof HTMLTemplateElement.prototype.createInstance){var b=HTMLTemplateElement.prototype.createInstance;HTMLTemplateElement.prototype.createInstance=function(){function c(a,b,c,d){return a&&a(c,d)||(b||g).prepareBinding&&b.prepareBinding(c,d)}return function(d,e){var f=[].slice.call(arguments),g=Object.create(e||null);g.prepareBinding=c.bind(g,this.createBindingSourceFactory.bind(this),e),f.splice(0,2,d,g);var h=b.apply(this,f);return h.firstChild&&Object.defineProperty(h.firstChild.templateInstance,"instanceData",{get:a.bind(this),configurable:!0}),h}}()}"undefined"==typeof Node||Object.getOwnPropertyDescriptor(Node.prototype,"instanceData")||Object.defineProperty(Node.prototype,"instanceData",{get:function(){return this._instanceData||this.templateInstance_||(this.parentNode||g).instanceData},configurable:!0})}(),c}),define("liaison/computed",["decor/Observable","./ObservablePath","./Each"],function(a,b,c){"use strict";function d(a,b){this[a]=b}function e(a,b){return a.apply(this,b)}function f(a){return new b(this,a)}function g(a,b){this.callback=a,this.paths=b}var h={},i=[],j=/^_computed/,k=/^_.*Attr$/,l=Object.getPrototypeOf;g.prototype={_computedMarker:"_computed",clone:function(){return new g(this.callback,this.paths).init(this.o,this.name)},init:function(a,b){return this.remove(),void 0!==a&&(this.o=a),void 0!==b&&(this.name=b),this},activate:function(){var a=this.o;if("function"!=typeof a._getProps||!k.test(this.name)){var b=[],g=[];this.paths.forEach(function(a){if("@"!==a[0])b.push(a);else{var c=b.length-1;(g[c]=g[c]||[]).push(a.substr(1))}},this);var h=b.map(f,a),i=e.bind(a,this.callback);this.source=new c(h,g,i),d.call(a,this.name,this.source.open(("function"==typeof a.set?a.set:d).bind(a,this.name)))}return this},remove:function(){this.source&&(this.source.remove(),this.source=null)}};var m=function(a){return new g(a,i.slice.call(arguments,1))};return m.apply=function(b){function c(b){var g,h=e.indexOf(b),i=d===b;if(0>h){if(e.push(b),Array.isArray(b))b.forEach(function(a,d){m.test(a)?f.push(a.clone().init(b,d).activate()):c(a)});else if(a.test(b)||b&&"object"==typeof b&&(i||(g=l(b))&&!l(g)))for(var j in b){var k;
try{k=b[j]}catch(n){continue}m.test(k)?f.push(k.clone().init(b,j).activate()):c(k)}e.pop()}}var d=b,e=[],f=[];return c(b),f},m.test=function(a){return j.test((a||h)._computedMarker)},m}),define("liaison/features",["requirejs-dplugins/has"],function(a){return a.add("object-observe-api","function"==typeof Object.observe&&"function"==typeof Array.observe),a.add("object-is-api",Object.is),a.add("setimmediate-api","function"==typeof setImmediate),a.add("mutation-observer-api","undefined"!=typeof MutationObserver&&(/\[\s*native\s+code\s*\]/i.test(MutationObserver)||!/^\s*function/.test(MutationObserver))),a.add("polymer-platform","undefined"!=typeof Platform),a.add("polymer","undefined"!=typeof Polymer),a.add("polymer-pathobserver","undefined"!=typeof PathObserver),a.add("polymer-createInstance","undefined"!=typeof HTMLTemplateElement&&"function"==typeof HTMLTemplateElement.prototype.createInstance),a.add("polymer-template-decorate","undefined"!=typeof HTMLTemplateElement&&"function"==typeof HTMLTemplateElement.decorate),a}),define("liaison/schedule",["./features"],function(a){"use strict";return function(){function b(){for(var a=!0;a;){a=!1;for(var b in g){var d=g[b];delete g[b],d(),a=!0}}c=!1}var c,d="_schedule",e=0,f=Math.random()+"",g={},h=a("mutation-observer-api")&&document.createElement("div");return a("mutation-observer-api")?(h.id=0,new MutationObserver(b).observe(h,{attributes:!0})):a("setimmediate-api")||window.addEventListener("message",function(a){a.data===f&&b()}),function(i){var j=d+e++;return g[j]=i,c||(a("mutation-observer-api")?++h.id:a("setimmediate-api")?setImmediate(b):window.postMessage(f,"*"),c=!0),{remove:function(){delete g[j]}}}}()}),define("liaison/templateBinder",["./ObservablePath","./BindingSourceList","./DOMBindingTarget","./alternateBindingSource"],function(a,b){"use strict";function c(a){for(var b=0,c=[];;){var d=a.indexOf(j,b);if(0>d)break;var e=a.indexOf(l,d+k);if(0>e)break;c.push(a.substring(b,d));var f=a.substring(d,b=e+m);c.push(f)}return c.push(a.substr(b)),c}function d(a){for(var b=[],c=0,d=this.length;d>c;++c)b.push(this[c],null!=a[c]?a[c]:"");return b.join("")}var e={},f=/template$/i,g="if",h="bind",i="repeat",j="{{",k=2,l="}}",m=2,n=4,o=4,p=0,q=1,r=2,s=3,t=[].forEach,u={parseNode:function(a){for(var b,c=[],d=a.ownerDocument.createNodeIterator(a,NodeFilter.SHOW_ELEMENT|NodeFilter.SHOW_TEXT,null,!1);b=d.nextNode();)b.nodeType===Node.ELEMENT_NODE?t.call(b.attributes,function(a){if(a.value.indexOf(j)>=0){c.push(b,a.name,a.value,void 0);var d="TEMPLATE"===b.tagName||b.hasAttribute("template")||"SCRIPT"===b.tagName&&f.test(b.getAttribute("type"));!d||a.name.toLowerCase()!==g||b.getAttribute(h)||b.getAttribute(i)||c.push(b,h,"{{}}",void 0)}}):b.nodeType===Node.TEXT_NODE&&b.nodeValue.indexOf(j)>=0&&c.push(b,"nodeValue",b.nodeValue,void 0);return c},importNode:function(a,b,c,d){var e,j="TEMPLATE"===b.tagName||"template"===b.tagName&&"http://www.w3.org/2000/svg"===b.namespaceURI||"SCRIPT"===b.tagName&&f.test(b.type);if(!j&&b.nodeType===Node.ELEMENT_NODE&&b.hasAttribute("template")){e=a.createElement("template"),e.content||(e.content=a.createDocumentFragment());var k=e.content.appendChild(a.importNode(b,!0));k.removeAttribute("template"),k.removeAttribute(g),k.removeAttribute(h),k.removeAttribute(i)}else if(e=a.importNode(b,!!j),j)e.content&&(e.innerHTML=b.innerHTML),e.upgradeToTemplate();else for(var l=b.firstChild;l;l=l.nextSibling)e.appendChild(u.importNode(a,l,c,d));for(var m=0;(m=c.indexOf(b,m))>=0;m+=o)d.push(e,c[m+q],c[m+r],c[m+s]);return e},createContent:function(a,b,c){return u.importNode(a.ownerDocument,a.content,b,c)},assignSources:function(e,f,g){for(var h=0,i=f.length;i>h;h+=o){var j,l,m=f[h+p],t=f[h+q],u=f[h+r],v=c(u);if(3!==v.length||v[0]||v[2]){for(var w=[],x=[],y=0,z=v.length;z>y;++y)y%2===0?x.push(v[y]):(j=v[y].substr(k,v[y].length-n).trim(),l=g&&g.call(this,j,t),w.push(l?l(e,m):new a(e,j)));f[h+s]=new b(w,d.bind(x))}else j=v[1].substr(k,v[1].length-n).trim(),l=g&&g.call(this,j,t),f[h+s]=l?l(e,m):new a(e,j)}},bind:function(a){for(var b=[],c=0,d=a.length;d>c;c+=o){var f=a[c+q],g=a[c+s];"function"==typeof(g||e).observe||"function"==typeof(g||e).open?b.push(a[c+p].bind(f,g)):console.warn("The specified binding source "+g+" does not have BindingSource interface. Ignoring.")}return b}};return u}),define("liaison/wrapper",["decor/Observable","./ObservableArray"],function(a,b){"use strict";function c(c){function d(c){var h=g.indexOf(c);if(h>=0)return g[h+1];var i,j=Array.isArray(c),k=a.test(c)||c&&"object"==typeof c&&(c===f||(i=e(c))&&!e(i)),l=j?new b:k?new a:c;if(g.push(c,l),j)for(var m=0,n=c.length;n>m;++m)l[m]=d(c[m]);else if(k)for(var o in c)l[o]=d(c[o]);return g.splice(-2,2),l}var f=c,g=[];return d(c)}function d(b){function c(b){var f=d.indexOf(b);if(f>=0)return d[f+1];var g,h=Array.isArray(b),i=a.test(b)||b&&"object"==typeof b&&(g=e(b))&&!e(g),j=h?[]:i?{}:b;if(d.push(b,j),h)for(var k=0,l=b.length;l>k;++k)j[k]=c(b[k]);else if(i)for(var m in b)j[m]=c(b[m]);return d.splice(-2,2),j}var d=[];return c(b)}var e=Object.getPrototypeOf;return{wrap:c,unwrap:d}});
//# sourceMappingURL=layer.map
require.config({
	"packages": [
		{
			"name": "liaison",
			"location": "liaison-build"
		},
		{
			"name": "decor",
			"location": "decor-build"
		}
	]
});
define("liaison-build/layer", ["decor-build/layer"], function(){});