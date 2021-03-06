
(function(l, r) { if (l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (window.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.head.appendChild(r) })(window.document);
var app = (function () {
    'use strict';

    function noop() { }
    function assign(tar, src) {
        // @ts-ignore
        for (const k in src)
            tar[k] = src[k];
        return tar;
    }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function create_slot(definition, ctx, $$scope, fn) {
        if (definition) {
            const slot_ctx = get_slot_context(definition, ctx, $$scope, fn);
            return definition[0](slot_ctx);
        }
    }
    function get_slot_context(definition, ctx, $$scope, fn) {
        return definition[1] && fn
            ? assign($$scope.ctx.slice(), definition[1](fn(ctx)))
            : $$scope.ctx;
    }
    function get_slot_changes(definition, $$scope, dirty, fn) {
        if (definition[2] && fn) {
            const lets = definition[2](fn(dirty));
            if ($$scope.dirty) {
                const merged = [];
                const len = Math.max($$scope.dirty.length, lets.length);
                for (let i = 0; i < len; i += 1) {
                    merged[i] = $$scope.dirty[i] | lets[i];
                }
                return merged;
            }
            return lets;
        }
        return $$scope.dirty;
    }
    function exclude_internal_props(props) {
        const result = {};
        for (const k in props)
            if (k[0] !== '$')
                result[k] = props[k];
        return result;
    }

    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function element(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function custom_event(type, detail) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, false, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error(`Function called outside component initialization`);
        return current_component;
    }
    function beforeUpdate(fn) {
        get_current_component().$$.before_update.push(fn);
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }
    function onDestroy(fn) {
        get_current_component().$$.on_destroy.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    function flush() {
        const seen_callbacks = new Set();
        do {
            // first, call beforeUpdate functions
            // and update components
            while (dirty_components.length) {
                const component = dirty_components.shift();
                set_current_component(component);
                update(component.$$);
            }
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    callback();
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            $$.fragment && $$.fragment.p($$.ctx, $$.dirty);
            $$.dirty = [-1];
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function group_outros() {
        outros = {
            r: 0,
            c: [],
            p: outros // parent group
        };
    }
    function check_outros() {
        if (!outros.r) {
            run_all(outros.c);
        }
        outros = outros.p;
    }
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined' ? window : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        // onMount happens before the initial afterUpdate
        add_render_callback(() => {
            const new_on_destroy = on_mount.map(run).filter(is_function);
            if (on_destroy) {
                on_destroy.push(...new_on_destroy);
            }
            else {
                // Edge case - component was destroyed immediately,
                // most likely as a result of a binding initialising
                run_all(new_on_destroy);
            }
            component.$$.on_mount = [];
        });
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const prop_values = options.props || {};
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : []),
            // everything else
            callbacks: blank_object(),
            dirty
        };
        let ready = false;
        $$.ctx = instance
            ? instance(component, prop_values, (i, ret, value = ret) => {
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if ($$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(children(options.target));
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor);
            flush();
        }
        set_current_component(parent_component);
    }
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set() {
            // overridden by instance, if it has props
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, detail));
    }
    function append_dev(target, node) {
        dispatch_dev("SvelteDOMInsert", { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev("SvelteDOMInsert", { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev("SvelteDOMRemove", { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ["capture"] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev("SvelteDOMAddEventListener", { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev("SvelteDOMRemoveEventListener", { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev("SvelteDOMRemoveAttribute", { node, attribute });
        else
            dispatch_dev("SvelteDOMSetAttribute", { node, attribute, value });
    }
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error(`'target' is a required option`);
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn(`Component was already destroyed`); // eslint-disable-line no-console
            };
        }
    }

    /*!
     * Doka 6.3.0
     * Copyright 2019 PQINA Inc - All Rights Reserved
     * Please visit https://pqina.nl/doka/ for further information
     */
    /* eslint-disable */


    function _typeof(e){return (_typeof="function"==typeof Symbol&&"symbol"==typeof Symbol.iterator?function(e){return typeof e}:function(e){return e&&"function"==typeof Symbol&&e.constructor===Symbol&&e!==Symbol.prototype?"symbol":typeof e})(e)}function _defineProperty(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function _objectSpread(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{},n=Object.keys(r);"function"==typeof Object.getOwnPropertySymbols&&(n=n.concat(Object.getOwnPropertySymbols(r).filter(function(e){return Object.getOwnPropertyDescriptor(r,e).enumerable}))),n.forEach(function(t){_defineProperty(e,t,r[t]);});}return e}function _readOnlyError(e){throw new Error('"'+e+'" is read-only')}function _slicedToArray(e,t){return _arrayWithHoles(e)||_iterableToArrayLimit(e,t)||_nonIterableRest()}function _toConsumableArray(e){return _arrayWithoutHoles(e)||_iterableToArray(e)||_nonIterableSpread()}function _arrayWithoutHoles(e){if(Array.isArray(e)){for(var t=0,r=new Array(e.length);t<e.length;t++)r[t]=e[t];return r}}function _arrayWithHoles(e){if(Array.isArray(e))return e}function _iterableToArray(e){if(Symbol.iterator in Object(e)||"[object Arguments]"===Object.prototype.toString.call(e))return Array.from(e)}function _iterableToArrayLimit(e,t){var r=[],n=!0,i=!1,o=void 0;try{for(var a,c=e[Symbol.iterator]();!(n=(a=c.next()).done)&&(r.push(a.value),!t||r.length!==t);n=!0);}catch(e){i=!0,o=e;}finally{try{n||null==c.return||c.return();}finally{if(i)throw o}}return r}function _nonIterableSpread(){throw new TypeError("Invalid attempt to spread non-iterable instance")}function _nonIterableRest(){throw new TypeError("Invalid attempt to destructure non-iterable instance")}var isNode=function(e){return e instanceof HTMLElement},insertBefore=function(e,t){return t.parentNode.insertBefore(e,t)},insertAfter=function(e,t){return t.parentNode.insertBefore(e,t.nextSibling)},isObject=function(e){return "object"===_typeof(e)&&null!==e},createStore=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:[],n=_objectSpread({},e),i=[],o=[],a=function(e,t,r){r?o.push({type:e,data:t}):(s[e]&&s[e](t),i.push({type:e,data:t}));},c=function(e){for(var t,r=arguments.length,n=new Array(r>1?r-1:0),i=1;i<r;i++)n[i-1]=arguments[i];return u[e]?(t=u)[e].apply(t,n):null},l={getState:function(){return _objectSpread({},n)},processActionQueue:function(){var e=[].concat(i);return i.length=0,e},processDispatchQueue:function(){var e=[].concat(o);o.length=0,e.forEach(function(e){var t=e.type,r=e.data;a(t,r);});},dispatch:a,query:c},u={};t.forEach(function(e){u=_objectSpread({},e(n),u);});var s={};return r.forEach(function(e){s=_objectSpread({},e(a,c,n),s);}),l},defineProperty=function(e,t,r){"function"!=typeof r?Object.defineProperty(e,t,r):e[t]=r;},forin=function(e,t){for(var r in e)e.hasOwnProperty(r)&&t(r,e[r]);},createObject=function(e){var t={};return forin(e,function(r){defineProperty(t,r,e[r]);}),t},attr$1=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;if(null===r)return e.getAttribute(t)||e.hasAttribute(t);e.setAttribute(t,r);},ns="http://www.w3.org/2000/svg",svgElements=["svg","path"],isSVGElement=function(e){return svgElements.includes(e)},createElement=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};"object"===_typeof(t)&&(r=t,t=null);var n=isSVGElement(e)?document.createElementNS(ns,e):document.createElement(e);return t&&(isSVGElement(e)?attr$1(n,"class",t):n.className=t),forin(r,function(e,t){attr$1(n,e,t);}),n},appendChild=function(e){return function(t,r){void 0!==r&&e.children[r]?e.insertBefore(t,e.children[r]):e.appendChild(t);}},appendChildView=function(e,t){return function(e,r){return void 0!==r?t.splice(r,0,e):t.push(e),e}},removeChildView=function(e,t){return function(r){return t.splice(t.indexOf(r),1),r.element.parentNode&&e.removeChild(r.element),r}},getViewRect=function(e,t,r,n){var i=r[0]||e.left,o=r[1]||e.top,a=i+e.width,c=o+e.height*(n[1]||1),l={element:_objectSpread({},e),inner:{left:e.left,top:e.top,right:e.right,bottom:e.bottom},outer:{left:i,top:o,right:a,bottom:c}};return t.filter(function(e){return !e.isRectIgnored()}).map(function(e){return e.rect}).forEach(function(e){expandRect(l.inner,_objectSpread({},e.inner)),expandRect(l.outer,_objectSpread({},e.outer));}),calculateRectSize(l.inner),l.outer.bottom+=l.element.marginBottom,l.outer.right+=l.element.marginRight,calculateRectSize(l.outer),l},expandRect=function(e,t){t.top+=e.top,t.right+=e.left,t.bottom+=e.top,t.left+=e.left,t.bottom>e.bottom&&(e.bottom=t.bottom),t.right>e.right&&(e.right=t.right);},calculateRectSize=function(e){e.width=e.right-e.left,e.height=e.bottom-e.top;},isNumber=function(e){return "number"==typeof e},thereYet=function(e,t,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:.001;return Math.abs(e-t)<n&&Math.abs(r)<n},spring=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.stiffness,r=void 0===t?.5:t,n=e.damping,i=void 0===n?.75:n,o=e.mass,a=void 0===o?10:o,c=e.delay,l=void 0===c?0:c,u=null,s=null,d=0,p=!1,f=null,h=createObject({interpolate:function(e){if(null===f&&(f=e),!(e-l<f||p)){if(!isNumber(u)||!isNumber(s))return p=!0,void(d=0);thereYet(s+=d+=-(s-u)*r/a,u,d*=i)?(s=u,d=0,p=!0,h.onupdate(s),h.oncomplete(s)):h.onupdate(s);}},target:{set:function(e){if(isNumber(e)&&!isNumber(s)&&(s=e,f=null),null===u&&(u=e,s=e,f=null),p&&(f=null),s===(u=e)||void 0===u)return p=!0,d=0,f=null,h.onupdate(s),void h.oncomplete(s);p=!1;},get:function(){return u}},resting:{get:function(){return p}},onupdate:function(){},oncomplete:function(){},position:{get:function(){return s}}});return h},easeInOutQuad=function(e){return e<.5?2*e*e:(4-2*e)*e-1},tween=function(){var e,t,r=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},n=r.duration,i=void 0===n?500:n,o=r.easing,a=void 0===o?easeInOutQuad:o,c=r.delay,l=void 0===c?0:c,u=null,s=!0,d=!1,p=null,f=createObject({interpolate:function(r){s||null===p||(null===u&&(u=r),r-u<l||((e=r-u-l)<i?(t=e/i,f.onupdate((e>=0?a(d?1-t:t):0)*p)):(e=1,t=d?0:1,f.onupdate(t*p),f.oncomplete(t*p),s=!0)));},target:{get:function(){return d?0:p},set:function(e){if(null===p)return p=e,f.onupdate(e),void f.oncomplete(e);e<p?(p=1,d=!0):(d=!1,p=e),s=!1,u=null;}},resting:{get:function(){return s}},onupdate:function(){},oncomplete:function(){}});return f},animator={spring:spring,tween:tween},createAnimator=function(e,t,r){var n=e[t]&&"object"===_typeof(e[t][r])?e[t][r]:e[t]||e,i="string"==typeof n?n:n.type,o="object"===_typeof(n)?_objectSpread({},n):{};return animator[i]?animator[i](o):null},addGetSet=function(e,t,r){var n=arguments.length>3&&void 0!==arguments[3]&&arguments[3];(t=Array.isArray(t)?t:[t]).forEach(function(t){e.forEach(function(e){var i=e,o=function(){return r[e]},a=function(t){return r[e]=t};"object"===_typeof(e)&&(i=e.key,o=e.getter||o,a=e.setter||a),t[i]&&!n||(t[i]={get:o,set:a});});});},animations=function(e){var t=e.mixinConfig,r=e.viewProps,n=e.viewInternalAPI,i=e.viewExternalAPI,o=_objectSpread({},r),a=[];return forin(t,function(e,t){var c=createAnimator(t);c&&(c.onupdate=function(t){r[e]=t;},c.target=o[e],addGetSet([{key:e,setter:function(e){c.target!==e&&(c.target=e);},getter:function(){return r[e]}}],[n,i],r,!0),a.push(c));}),{write:function(e){var t=!0;return a.forEach(function(r){r.resting||(t=!1),r.interpolate(e);}),t},destroy:function(){}}},addEvent=function(e){return function(t,r){e.addEventListener(t,r);}},removeEvent=function(e){return function(t,r){e.removeEventListener(t,r);}},listeners=function(e){var t=e.viewExternalAPI,r=e.view,n=[],i=addEvent(r.element),o=removeEvent(r.element);return t.on=function(e,t){n.push({type:e,fn:t}),i(e,t);},t.off=function(e,t){n.splice(n.findIndex(function(r){return r.type===e&&r.fn===t}),1),o(e,t);},{write:function(){return !0},destroy:function(){n.forEach(function(e){o(e.type,e.fn);});}}},apis=function(e){var t=e.mixinConfig,r=e.viewProps,n=e.viewExternalAPI;addGetSet(t,n,r);},defaults={opacity:1,scaleX:1,scaleY:1,translateX:0,translateY:0,rotateX:0,rotateY:0,rotateZ:0,originX:0,originY:0},styles=function(e){var t=e.mixinConfig,r=e.viewProps,n=e.viewInternalAPI,i=e.viewExternalAPI,o=e.view,a=_objectSpread({},r),c={};addGetSet(t,[n,i],r);var l=function(){return o.rect?getViewRect(o.rect,o.childViews,[r.translateX||0,r.translateY||0],[r.scaleX||0,r.scaleY||0]):null};return n.rect={get:l},i.rect={get:l},t.forEach(function(e){r[e]=void 0===a[e]?defaults[e]:a[e];}),{write:function(){if(propsHaveChanged(c,r))return applyStyles(o.element,r),Object.assign(c,_objectSpread({},r)),!0},destroy:function(){}}},propsHaveChanged=function(e,t){if(Object.keys(e).length!==Object.keys(t).length)return !0;for(var r in t)if(t[r]!==e[r])return !0;return !1},applyStyles=function(e,t){var r=t.opacity,n=t.perspective,i=t.translateX,o=t.translateY,a=t.scaleX,c=t.scaleY,l=t.rotateX,u=t.rotateY,s=t.rotateZ,d=t.originX,p=t.originY,f=t.width,h=t.height,g="",m="";null==d&&null==p||(m+="transform-origin: ".concat(d||0,"px ").concat(p||0,"px;")),null!=n&&(g+="perspective(".concat(n,"px) ")),null==i&&null==o||(g+="translate3d(".concat(i||0,"px, ").concat(o||0,"px, 0) ")),null==a&&null==c||(g+="scale3d(".concat(null!=a?a:1,", ").concat(null!=c?c:1,", 1) ")),null!=s&&(g+="rotateZ(".concat(s,"rad) ")),null!=l&&(g+="rotateX(".concat(l,"rad) ")),null!=u&&(g+="rotateY(".concat(u,"rad) ")),""!=g&&(m+="transform:".concat(g,";")),null!=r&&(m+="opacity:".concat(r,";"),r<1&&(m+="pointer-events:none;"),0===r&&"BUTTON"===e.nodeName&&(m+="visibility:hidden;")),null!=f&&(m+="width:".concat(f,"px;")),null!=h&&(m+="height:".concat(h,"px;"));var v=e.elementCurrentStyle||"";m.length===v.length&&m===v||(e.style.cssText=m,e.elementCurrentStyle=m);},Mixins={styles:styles,listeners:listeners,animations:animations,apis:apis},updateRect=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return t.layoutCalculated||(e.paddingTop=parseInt(r.paddingTop,10)||0,e.marginTop=parseInt(r.marginTop,10)||0,e.marginRight=parseInt(r.marginRight,10)||0,e.marginBottom=parseInt(r.marginBottom,10)||0,e.marginLeft=parseInt(r.marginLeft,10)||0,t.layoutCalculated=!0),e.left=t.offsetLeft||0,e.top=t.offsetTop||0,e.width=t.offsetWidth||0,e.height=t.offsetHeight||0,e.right=e.left+e.width,e.bottom=e.top+e.height,e.scrollTop=t.scrollTop,e.hidden=null===t.offsetParent&&"fixed"!==r.position,e},IS_BROWSER="undefined"!=typeof window&&void 0!==window.document,isBrowser=function(){return IS_BROWSER},testElement=isBrowser()?createElement("svg"):{},getChildCount="children"in testElement?function(e){return e.children.length}:function(e){return e.childNodes.length},createView=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=e.tag,r=void 0===t?"div":t,n=e.name,i=void 0===n?null:n,o=e.attributes,a=void 0===o?{}:o,c=e.read,l=void 0===c?function(){}:c,u=e.write,s=void 0===u?function(){}:u,d=e.create,p=void 0===d?function(){}:d,f=e.destroy,h=void 0===f?function(){}:f,g=e.filterFrameActionsForChild,m=void 0===g?function(e,t){return t}:g,v=e.didCreateView,y=void 0===v?function(){}:v,E=e.didWriteView,T=void 0===E?function(){}:E,_=e.shouldUpdateChildViews,R=void 0===_?function(){return !0}:_,w=e.ignoreRect,I=void 0!==w&&w,A=e.ignoreRectUpdate,C=void 0!==A&&A,S=e.mixins,O=void 0===S?[]:S;return function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},n=createElement(r,i?"doka--".concat(i):null,a),o=window.getComputedStyle(n,null),c=updateRect(),u=null,d=!1,f=[],g=[],v={},E={},_=[s],w=[l],A=[h],S=function(){return n},x=function(){return [].concat(f)},b=function(){return u||(u=getViewRect(c,f,[0,0],[1,1]))},M=function(){return n.layoutCalculated=!1},L={element:{get:S},style:{get:function(){return o}},childViews:{get:x}},P=_objectSpread({},L,{rect:{get:b},ref:{get:function(){return v}},is:function(e){return i===e},appendChild:appendChild(n),createChildView:function(e){return function(t,r){return t(e,r)}}(e),linkView:function(e){return f.push(e),e},unlinkView:function(e){f.splice(f.indexOf(e),1);},appendChildView:appendChildView(n,f),removeChildView:removeChildView(n,f),registerWriter:function(e){return _.push(e)},registerReader:function(e){return w.push(e)},registerDestroyer:function(e){return A.push(e)},invalidateLayout:M,dispatch:e.dispatch,query:e.query}),G={element:{get:S},childViews:{get:x},rect:{get:b},resting:{get:function(){return d}},isRectIgnored:function(){return I},invalidateLayout:M,_read:function(){u=null,R({root:D,props:t})&&f.forEach(function(e){return e._read()}),!(C&&c.width&&c.height)&&updateRect(c,n,o);var e={root:D,props:t,rect:c};w.forEach(function(t){return t(e)});},_write:function(e){var r=arguments.length>1&&void 0!==arguments[1]?arguments[1]:[],n=0===r.length;return _.forEach(function(i){!1===i({props:t,root:D,actions:r,timestamp:e})&&(n=!1);}),g.forEach(function(t){!1===t.write(e)&&(n=!1);}),R({props:t,root:D,actions:r,timestamp:e})&&(f.filter(function(e){return !!e.element.parentNode}).forEach(function(t){t._write(e,m(t,r))||(n=!1);}),f.forEach(function(t,i){t.element.parentNode||(D.appendChild(t.element,i),t._read(),t._write(e,m(t,r)),n=!1);})),d=n,T({props:t,root:D,actions:r,timestamp:e}),n},_destroy:function(){g.forEach(function(e){return e.destroy()}),A.forEach(function(e){e({root:D});}),f.forEach(function(e){return e._destroy()});}},k=_objectSpread({},L,{rect:{get:function(){return c}}});Object.keys(O).sort(function(e,t){return "styles"===e?1:"styles"===t?-1:0}).forEach(function(e){var r=Mixins[e]({mixinConfig:O[e],viewProps:t,viewState:E,viewInternalAPI:P,viewExternalAPI:G,view:createObject(k)});r&&g.push(r);});var D=createObject(P);p({root:D,props:t});var V=getChildCount(n)||0;return f.forEach(function(e,t){D.appendChild(e.element,V+t);}),y(D),createObject(G)}},createPainter=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:60,n="__framePainter";if(window[n])return window[n].readers.push(e),void window[n].writers.push(t);window[n]={readers:[e],writers:[t]};var i=window[n],o=1e3/r,a=null,c=null,l=null,u=null,s=function(){document.hidden?(l=function(){return window.setTimeout(function(){return d(performance.now())},o)},u=function(){return window.clearTimeout(c)}):(l=function(){return window.requestAnimationFrame(d)},u=function(){return window.cancelAnimationFrame(c)});};document.addEventListener("visibilitychange",function(){u&&u(),s(),d(performance.now());});var d=function e(t){c=l(e),a||(a=t);var r=t-a;r<=o||(a=t-r%o,i.readers.forEach(function(e){return e()}),i.writers.forEach(function(e){return e(t)}));};return s(),d(performance.now()),{pause:function(){u(c);}}},createRoute=function(e,t){return function(r){var n=r.root,i=r.props,o=r.actions,a=void 0===o?[]:o,c=r.timestamp;if(a.filter(function(t){return e[t.type]}).forEach(function(t){return e[t.type]({root:n,props:i,action:t.data,timestamp:c})}),t)return t({root:n,props:i,actions:a,timestamp:c})}},isArray=function(e){return Array.isArray(e)},isEmpty=function(e){return null==e},trim=function(e){return e.trim()},toString=function(e){return ""+e},toArray=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:",";return isEmpty(e)?[]:isArray(e)?e:toString(e).split(t).map(trim).filter(function(e){return e.length})},isBoolean=function(e){return "boolean"==typeof e},toBoolean=function(e){return isBoolean(e)?e:"true"===e},isString=function(e){return "string"==typeof e},toNumber=function(e){return isNumber(e)?e:isString(e)?toString(e).replace(/[a-z]+/gi,""):0},toInt=function(e){return parseInt(toNumber(e),10)},toFloat=function(e){return parseFloat(toNumber(e))},isInt=function(e){return isNumber(e)&&isFinite(e)&&Math.floor(e)===e},toBytes=function(e){if(isInt(e))return e;var t=toString(e).trim();return /MB$/i.test(t)?(t=t.replace(/MB$i/,"").trim(),1e3*toInt(t)*1e3):/KB/i.test(t)?(t=t.replace(/KB$i/,"").trim(),1e3*toInt(t)):toInt(t)},isFunction=function(e){return "function"==typeof e},toFunctionReference=function(e){for(var t=self,r=e.split("."),n=null;n=r.shift();)if(!(t=t[n]))return null;return t},isNull=function(e){return null===e},getType=function(e){return isArray(e)?"array":isNull(e)?"null":isInt(e)?"int":/^[0-9]+ ?(?:GB|MB|KB)$/gi.test(e)?"bytes":_typeof(e)},replaceSingleQuotes=function(e){return e.replace(/{\s*'/g,'{"').replace(/'\s*}/g,'"}').replace(/'\s*:/g,'":').replace(/:\s*'/g,':"').replace(/,\s*'/g,',"').replace(/'\s*,/g,'",')},conversionTable={array:toArray,boolean:toBoolean,int:function(e){return "bytes"===getType(e)?toBytes(e):toInt(e)},float:toFloat,bytes:toBytes,string:function(e){return isFunction(e)?e:toString(e)},object:function(e){try{return JSON.parse(replaceSingleQuotes(e))}catch(t){return e}},file:function(e){return e},function:function(e){return toFunctionReference(e)}},convertTo=function(e,t){return conversionTable[t](e)},getValueByType=function(e,t,r){if(e===t)return e;var n=getType(e);if(n!==r){var i=convertTo(e,r);if(n=getType(i),null===i)throw 'Trying to assign value with incorrect type, allowed type: "'.concat(r,'"');e=i;}return e},createOption=function(e,t){var r=e;return {enumerable:!0,get:function(){return r},set:function(n){r=getValueByType(n,e,t);}}},createOptions=function(e){var t={};return forin(e,function(r){var n=isString(e[r])?e[r]:r,i=e[n];t[r]=n===r?createOption(i[0],i[1]):t[n];}),createObject(t)},resetState=function(e){e.file=null,e.activeView=null,e.markup=[],e.markupToolValues={},e.rootRect={x:0,y:0,left:0,top:0,width:0,height:0},e.stage=null,e.stageOffset=null,e.image=null,e.zoomTimeoutId=null,e.instantUpdate=!1,e.filePromise=null,e.fileLoader=null,e.instructions={size:null,crop:null,filter:null,color:null},e.filter=null,e.filterName=null,e.filterValue=null,e.colorValues={},e.colorMatrices={},e.size={width:!1,height:!1,aspectRatioLocked:!0,aspectRatioPrevious:!1},e.crop={rectangle:null,transforms:null,rotation:null,flip:null,aspectRatio:null,isRotating:!1,isDirty:!1,limitToImageBounds:!0,draft:{rectangle:null,transforms:null}};},createInitialState=function(e){var t={noImageTimeout:null,options:createOptions(e)};return resetState(t),t},fromCamels=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"-";return e.split(/(?=[A-Z])/).map(function(e){return e.toLowerCase()}).join(t)},createOptionAPI=function(e,t){var r={};return forin(t,function(n){var i=isString(t[n])?t[n]:n;r[n]={get:function(){return e.getState().options[i]},set:function(t){e.dispatch("SET_".concat(fromCamels(i,"_").toUpperCase()),{value:t});}};}),r},createOptionActions=function(e){return function(t,r,n){var i={};return forin(e,function(e){var r=fromCamels(e,"_").toUpperCase();i["SET_".concat(r)]=function(i){var o;try{o=n.options[e],n.options[e]=i.value;}catch(e){}t("DID_SET_".concat(r),{value:n.options[e],prevValue:o});};}),i}},createOptionQueries=function(e){return function(t){var r={};return forin(e,function(e){r["GET_".concat(fromCamels(e,"_").toUpperCase())]=function(){return t.options[e]};}),r}},getUniqueId=function(){return Math.random().toString(36).substr(2,9)},arrayRemove=function(e,t){return e.splice(t,1)},on=function(){var e=[],t=function(t,r){arrayRemove(e,e.findIndex(function(e){return e.event===t&&(e.cb===r||!r)}));};return {fire:function(t){for(var r=arguments.length,n=new Array(r>1?r-1:0),i=1;i<r;i++)n[i-1]=arguments[i];e.filter(function(e){return e.event===t}).map(function(e){return e.cb}).forEach(function(e){setTimeout(function(){e.apply(void 0,n);},0);});},on:function(t,r){e.push({event:t,cb:r});},onOnce:function(r,n){e.push({event:r,cb:function(){t(r,n),n.apply(void 0,arguments);}});},off:t}},Type={BOOLEAN:"boolean",INT:"int",NUMBER:"number",STRING:"string",ARRAY:"array",OBJECT:"object",FUNCTION:"function",FILE:"file"},testResult=null,isIOS=function(){return null===testResult&&(testResult=(/iPad|iPhone|iPod/.test(navigator.userAgent)||"MacIntel"===navigator.platform&&navigator.maxTouchPoints>1)&&!window.MSStream),testResult},getOptions=function(){return _objectSpread({},defaultOptions)},setOptions=function(e){forin(e,function(e,t){defaultOptions[e]&&setOption(e,t);});},correctDeprecatedOption=function(e){return isString(defaultOptions[e])?defaultOptions[e]:e},setOption=function(e,t){e=correctDeprecatedOption(e),defaultOptions[e][0]=getValueByType(t,defaultOptions[e][0],defaultOptions[e][1]);},defaultOptions={id:[null,Type.STRING],className:[null,Type.STRING],src:[null,Type.FILE],storageName:["doka",Type.STRING],maxImagePreviewWidth:[1500,Type.INT],maxImagePreviewHeight:[1500,Type.INT],imagePreviewScaleMode:["stage",Type.STRING],allowPreviewFitToView:[!0,Type.BOOLEAN],allowButtonCancel:[!0,Type.BOOLEAN],allowButtonConfirm:[!0,Type.BOOLEAN],allowDropFiles:[!1,Type.BOOLEAN],allowBrowseFiles:[!0,Type.BOOLEAN],allowAutoClose:[!0,Type.BOOLEAN],allowAutoDestroy:[!1,Type.BOOLEAN],utils:[["crop","filter","color","markup"],Type.ARRAY],util:[null,Type.STRING],initialState:[null,Type.OBJECT],outputData:[!1,Type.BOOLEAN],outputFile:[!0,Type.BOOLEAN],outputCorrectImageExifOrientation:[!0,Type.BOOLEAN],outputStripImageHead:[!0,Type.BOOLEAN],outputType:[null,Type.STRING],outputQuality:[null,Type.INT],outputFit:["cover",Type.STRING],outputUpscale:[!0,Type.BOOLEAN],outputWidth:[null,Type.INT],outputHeight:[null,Type.INT],outputCanvasBackgroundColor:[null,Type.STRING],outputCanvasMemoryLimit:[isBrowser()&&isIOS()?16777216:null,Type.INT],size:[null,Type.OBJECT],sizeMin:[{width:1,height:1},Type.OBJECT],sizeMax:[{width:9999,height:9999},Type.OBJECT],filter:[null,Type.OBJECT],filters:[{original:{label:"Original",matrix:function(){return null}},chrome:{label:"Chrome",matrix:function(){return [1.398,-.316,.065,-.273,.201,-.051,1.278,-.08,-.273,.201,-.051,.119,1.151,-.29,.215,0,0,0,1,0]}},fade:{label:"Fade",matrix:function(){return [1.073,-.015,.092,-.115,-.017,.107,.859,.184,-.115,-.017,.015,.077,1.104,-.115,-.017,0,0,0,1,0]}},mono:{label:"Mono",matrix:function(){return [.212,.715,.114,0,0,.212,.715,.114,0,0,.212,.715,.114,0,0,0,0,0,1,0]}},noir:{label:"Noir",matrix:function(){return [.15,1.3,-.25,.1,-.2,.15,1.3,-.25,.1,-.2,.15,1.3,-.25,.1,-.2,0,0,0,1,0]}}},Type.OBJECT],crop:[null,Type.OBJECT],cropShowSize:[!1,Type.BOOLEAN],cropZoomTimeout:[null,Type.INT],cropMask:[null,Type.FUNCTION],cropMaskInset:[0,Type.INT],cropAllowResizeRect:[!0,Type.BOOLEAN],cropAllowImageTurnLeft:[!0,Type.BOOLEAN],cropAllowImageTurnRight:[!1,Type.BOOLEAN],cropAllowImageFlipHorizontal:[!0,Type.BOOLEAN],cropAllowImageFlipVertical:[!0,Type.BOOLEAN],cropAllowToggleLimit:[!1,Type.BOOLEAN],cropLimitToImageBounds:[!0,Type.BOOLEAN],cropAllowInstructionZoom:[!1,Type.BOOLEAN],cropAllowRotate:[!0,Type.BOOLEAN],cropResizeMatchImageAspectRatio:[!1,Type.BOOLEAN],cropResizeKeyCodes:[[18,91,92,93],Type.ARRAY],cropResizeScrollRectOnly:[!1,Type.BOOLEAN],cropAspectRatio:[null,Type.STRING],cropAspectRatioOptions:[null,Type.ARRAY],cropMinImageWidth:[1,Type.INT],cropMinImageHeight:[1,Type.INT],colorBrightness:[0,Type.NUMBER],colorBrightnessRange:[[-.25,.25],Type.ARRAY],colorContrast:[1,Type.NUMBER],colorContrastRange:[[.5,1.5],Type.ARRAY],colorExposure:[1,Type.NUMBER],colorExposureRange:[[.5,1.5],Type.ARRAY],colorSaturation:[1,Type.NUMBER],colorSaturationRange:[[0,2],Type.ARRAY],markup:[null,Type.ARRAY],markupUtil:["select",Type.STRING],markupFilter:[function(){return !0},Type.FUNCTION],markupAllowAddMarkup:[!0,Type.BOOLEAN],markupAllowCustomColor:[!0,Type.BOOLEAN],markupDrawDistance:[4,Type.NUMBER],markupColor:["#000",Type.STRING],markupColorOptions:[[["White","#fff","#f6f6f6"],["Silver","#9e9e9e"],["Black","#000","#333"],["Red","#f44336"],["Orange","#ff9800"],["Yellow","#ffeb3b"],["Green","#4caf50"],["Blue","#2196f3"],["Violet","#3f51b5"],["Purple","#9c27b0"]],Type.ARRAY],markupFontSize:[.1,Type.NUMBER],markupFontSizeOptions:[[["XL",.15],["L",.125],["M",.1],["S",.075],["XS",.05]],Type.ARRAY],markupFontFamily:["Helvetica, Arial, Verdana",Type.STRING],markupFontFamilyOptions:[[["Serif","Palatino, 'Times New Roman', serif"],["Sans Serif","Helvetica, Arial, Verdana"],["Monospaced","Monaco, 'Lucida Console', monospaced"]],Type.ARRAY],markupShapeStyle:[[.015,null],Type.ARRAY],markupShapeStyleOptions:[[["Fill",0,null,0],["Outline thick",.025,null,4],["Outline default",.015,null,2],["Outline thin",.005,null,1],["Outline dashed",.005,[.01],1]],Type.ARRAY],markupLineStyle:[[.015,null],Type.ARRAY],markupLineStyleOptions:[[["Thick",.025,null,4],["Default",.015,null,2],["Thin",.005,null,1],["Dashed",.005,[.01],1]],Type.ARRAY],markupLineDecoration:[["arrow-end"],Type.ARRAY],markupLineDecorationOptions:[[["None",[]],["Single arrow",["arrow-end"]],["Double arrow",["arrow-begin","arrow-end"]]],Type.ARRAY],beforeCreateBlob:[null,Type.FUNCTION],afterCreateBlob:[null,Type.FUNCTION],afterCreateOutput:[null,Type.FUNCTION],onconfirm:[null,Type.FUNCTION],oncancel:[null,Type.FUNCTION],onclose:[null,Type.FUNCTION],onloadstart:[null,Type.FUNCTION],onload:[null,Type.FUNCTION],onloaderror:[null,Type.FUNCTION],onupdate:[null,Type.FUNCTION],oninit:[null,Type.FUNCTION],ondestroy:[null,Type.FUNCTION],labelButtonReset:["Reset",Type.STRING],labelButtonCancel:["Cancel",Type.STRING],labelButtonConfirm:["Done",Type.STRING],labelButtonUtilCrop:["Crop",Type.STRING],labelButtonUtilResize:["Resize",Type.STRING],labelButtonUtilFilter:["Filter",Type.STRING],labelButtonUtilColor:["Colors",Type.STRING],labelButtonUtilMarkup:["Markup",Type.STRING],labelStatusMissingWebGL:["WebGL is required but is disabled on your browser",Type.STRING],labelStatusAwaitingImage:["Waiting for image…",Type.STRING],labelStatusLoadImageError:["Error loading image…",Type.STRING],labelStatusLoadingImage:["Loading image…",Type.STRING],labelStatusProcessingImage:["Processing image…",Type.STRING],labelColorBrightness:["Brightness",Type.STRING],labelColorContrast:["Contrast",Type.STRING],labelColorExposure:["Exposure",Type.STRING],labelColorSaturation:["Saturation",Type.STRING],labelMarkupTypeRectangle:["Square",Type.STRING],labelMarkupTypeEllipse:["Circle",Type.STRING],labelMarkupTypeText:["Text",Type.STRING],labelMarkupTypeLine:["Arrow",Type.STRING],labelMarkupSelectFontSize:["Size",Type.STRING],labelMarkupSelectFontFamily:["Font",Type.STRING],labelMarkupSelectLineDecoration:["Decoration",Type.STRING],labelMarkupSelectLineStyle:["Style",Type.STRING],labelMarkupSelectShapeStyle:["Style",Type.STRING],labelMarkupRemoveShape:["Remove",Type.STRING],labelMarkupToolSelect:["Select",Type.STRING],labelMarkupToolDraw:["Draw",Type.STRING],labelMarkupToolLine:["Arrow",Type.STRING],labelMarkupToolText:["Text",Type.STRING],labelMarkupToolRect:["Square",Type.STRING],labelMarkupToolEllipse:["Circle",Type.STRING],labelResizeWidth:["Width",Type.STRING],labelResizeHeight:["Height",Type.STRING],labelResizeApplyChanges:["Apply",Type.STRING],labelCropInstructionZoom:["Zoom in and out with your scroll wheel or touchpad.",Type.STRING],labelButtonCropZoom:["Zoom",Type.STRING],labelButtonCropRotateLeft:["Rotate left",Type.STRING],labelButtonCropRotateRight:["Rotate right",Type.STRING],labelButtonCropRotateCenter:["Center rotation",Type.STRING],labelButtonCropFlipHorizontal:["Flip horizontal",Type.STRING],labelButtonCropFlipVertical:["Flip vertical",Type.STRING],labelButtonCropAspectRatio:["Aspect ratio",Type.STRING],labelButtonCropToggleLimit:["Crop selection",Type.STRING],labelButtonCropToggleLimitEnable:["Limited to image",Type.STRING],labelButtonCropToggleLimitDisable:["Select outside image",Type.STRING],pointerEventsPolyfillScope:["root",Type.STRING],styleCropCorner:["circle",Type.STRING],styleFullscreenSafeArea:[isBrowser()&&/iPad|iPhone|iPod/.test(navigator.userAgent)&&!window.MSStream?"bottom":"none",Type.STRING],styleLayoutMode:[null,Type.STRING]},limit=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:0,r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1;return Math.min(r,Math.max(t,e))},roundFloat=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:10;return parseFloat(e.toFixed(t))},vectorEqual=function(e,t){return roundFloat(e.x)===roundFloat(t.x)&&roundFloat(e.y)===roundFloat(t.y)},roundVector=function(e,t){return {x:roundFloat(e.x,t),y:roundFloat(e.y,t)}},vectorSubtract=function(e,t){return createVector(e.x-t.x,e.y-t.y)},vectorDot=function(e,t){return e.x*t.x+e.y*t.y},vectorDistanceSquared=function(e,t){return vectorDot(vectorSubtract(e,t),vectorSubtract(e,t))},vectorDistance=function(e,t){return Math.sqrt(vectorDistanceSquared(e,t))},vectorAngleBetween=function(e,t){var r=vectorSubtract(e,t);return Math.atan2(r.y,r.x)},vectorLimit=function(e,t){return createVector(limit(e.x,t.x,t.x+t.width),limit(e.y,t.y,t.y+t.height))},vectorRotate=function(e,t,r){var n=Math.cos(t),i=Math.sin(t),o=createVector(e.x-r.x,e.y-r.y);return createVector(r.x+n*o.x-i*o.y,r.y+i*o.x+n*o.y)},createVector=function(){return {x:arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,y:arguments.length>1&&void 0!==arguments[1]?arguments[1]:0}},rectEqualsRect=function(e,t){return e.x===t.x&&e.y===t.y&&e.width===t.width&&e.height===t.height},rectFitsInRect=function(e,t){var r=rectBounds(e),n=rectBounds(t);return r.left>=n.left&&r.top>=n.top&&r.bottom<=n.bottom&&r.right<=n.right},rotateRectCorners=function(e,t,r){return 0===t?{tl:e.tl,tr:e.tr,br:e.br,bl:e.bl}:{tl:vectorRotate(e.tl,t,r),tr:vectorRotate(e.tr,t,r),br:vectorRotate(e.br,t,r),bl:vectorRotate(e.bl,t,r)}},rectRotate=function(e,t,r){var n=rotateRectCorners(rectCorners(e),t,r),i=n.tl,o=n.tr,a=n.br,c=n.bl,l=Math.min(i.x,o.x,a.x,c.x),u=Math.min(i.y,o.y,a.y,c.y),s=Math.max(i.x,o.x,a.x,c.x),d=Math.max(i.y,o.y,a.y,c.y);return createRect(l,u,s-l,d-u)},rectScale=function(e,t,r){return createRect(t*(e.x-r.x)+r.x,t*(e.y-r.y)+r.y,t*e.width,t*e.height)},rectTranslate=function(e,t){return createRect(e.x+t.x,e.y+t.y,e.width,e.height)},TRANSFORM_MAP={translate:rectTranslate,rotate:rectRotate,scale:rectScale},rectTransform=function(e,t,r){return t.reduce(function(e,t){return (0, TRANSFORM_MAP[t[0]])(e,t[1],r)},e)},rectClone=function(e){return createRect(e.x,e.y,e.width,e.height)},rectBounds=function(e){return {top:e.y,right:e.x+e.width,bottom:e.y+e.height,left:e.x}},rectFromBounds=function(e){var t=e.top,r=e.right,n=e.bottom,i=e.left;return {x:i,y:t,width:r-i,height:n-t}},rectCenter=function(e){return createVector(e.x+.5*e.width,e.y+.5*e.height)},rectCorners=function(e){return {tl:{x:e.x,y:e.y},tr:{x:e.x+e.width,y:e.y},br:{x:e.x+e.width,y:e.y+e.height},bl:{x:e.x,y:e.y+e.height}}},createRect=function(e,t,r,n){return {x:e,y:t,width:r,height:n}},getNumericAspectRatioFromString=function(e){if(isEmpty(e))return e;if(/:/.test(e)){var t=e.split(":"),r=t[0];return t[1]/r}return parseFloat(e)},getCenteredCropRect=function(e,t){var r=e.width,n=r*t;return n>e.height&&(r=(n=e.height)/t),{x:.5*(e.width-r),y:.5*(e.height-n),width:r,height:n}},calculateCanvasSize=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,n=e.height/e.width,i=t,o=1,a=n;a>i&&(o=(a=i)/n);var c=Math.max(1/o,i/a),l=e.width/(r*c*o);return {width:l,height:l*t}},createVector$1=function(e,t){return {x:e,y:t}},vectorDot$1=function(e,t){return e.x*t.x+e.y*t.y},vectorSubtract$1=function(e,t){return createVector$1(e.x-t.x,e.y-t.y)},vectorDistanceSquared$1=function(e,t){return vectorDot$1(vectorSubtract$1(e,t),vectorSubtract$1(e,t))},vectorDistance$1=function(e,t){return Math.sqrt(vectorDistanceSquared$1(e,t))},getOffsetPointOnEdge=function(e,t){var r=e,n=t,i=1.5707963267948966-t,o=Math.sin(1.5707963267948966),a=Math.sin(n),c=Math.sin(i),l=Math.cos(i),u=r/o;return createVector$1(l*(u*a),l*(u*c))},getRotatedRectSize=function(e,t){var r=e.width,n=e.height,i=getOffsetPointOnEdge(r,t),o=getOffsetPointOnEdge(n,t),a=createVector$1(e.x+Math.abs(i.x),e.y-Math.abs(i.y)),c=createVector$1(e.x+e.width+Math.abs(o.y),e.y+Math.abs(o.x)),l=createVector$1(e.x-Math.abs(o.y),e.y+e.height-Math.abs(o.x));return {width:vectorDistance$1(a,c),height:vectorDistance$1(a,l)}},getImageRectZoomFactor=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:0,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{x:.5,y:.5},i=n.x>.5?1-n.x:n.x,o=n.y>.5?1-n.y:n.y,a=2*i*e.width,c=2*o*e.height,l=getRotatedRectSize(t,r);return Math.max(l.width/a,l.height/c)},getAxisAlignedImageRect=function(e,t){var r=t.origin,n=t.translation,i=t.scale;return rectTransform(e,[["scale",i],["translate",n]],r)},getOffsetPointOnEdge$1=function(e,t){var r=e,n=t,i=1.5707963267948966-t,o=Math.sin(1.5707963267948966),a=Math.sin(n),c=Math.sin(i),l=Math.cos(i),u=r/o;return createVector(l*(u*a),l*(u*c))},getRotatedRectCorners=function(e,t){var r=e.width,n=e.height,i=t%(Math.PI/2),o=getOffsetPointOnEdge$1(r,i),a=getOffsetPointOnEdge$1(n,i),c=rectCorners(e);return {tl:createVector(c.tl.x+Math.abs(o.x),c.tl.y-Math.abs(o.y)),tr:createVector(c.tr.x+Math.abs(a.y),c.tr.y+Math.abs(a.x)),br:createVector(c.br.x-Math.abs(o.x),c.br.y+Math.abs(o.y)),bl:createVector(c.bl.x-Math.abs(a.y),c.bl.y-Math.abs(a.x))}},getAxisAlignedCropRect=function(e,t,r,n){var i={x:e.x+t.x,y:e.y+t.y},o=getRotatedRectCorners(n,r),a=vectorRotate(o.tl,-r,i),c=vectorRotate(o.tr,-r,i),l=vectorRotate(o.br,-r,i);return createRect(Math.min(a.x,c.x,l.x),Math.min(a.y,c.y,l.y),Math.max(a.x,c.x,l.x)-Math.min(a.x,c.x,l.x),Math.max(a.y,c.y,l.y)-Math.min(a.y,c.y,l.y))},getCropFromView=function(e,t,r){var n=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],i=r.origin,o=r.translation,a=getAxisAlignedImageRect(e,r),c=2*Math.PI+r.rotation%(2*Math.PI),l=getAxisAlignedCropRect(i,o,c,t),u=rectCenter(l),s=t.height/t.width,d={x:(u.x-a.x)/a.width,y:(u.y-a.y)/a.height},p=d.y>.5?1-d.y:d.y,f=2*(d.x>.5?1-d.x:d.x)*a.width,h=2*p*a.height;return {center:d,zoom:n?Math.min(f/l.width,h/l.height):Math.min(a.width/l.width,a.height/l.height),rotation:r.rotation,aspectRatio:s,scaleToFit:n}},getCropFromStateRounded=function(e,t){var r=getCropFromState(e,t);return {center:{x:roundFloat(r.center.x),y:roundFloat(r.center.y)},rotation:roundFloat(r.rotation),zoom:roundFloat(r.zoom),aspectRatio:roundFloat(r.aspectRatio),flip:_objectSpread({},t.flip),scaleToFit:r.scaleToFit}},getCropFromState=function(e,t){var r=getCropFromView(e,t.rectangle,t.transforms,t.limitToImageBounds);return {center:{x:r.center.x,y:r.center.y},rotation:r.rotation,zoom:r.zoom,aspectRatio:r.aspectRatio,flip:_objectSpread({},t.flip),scaleToFit:r.scaleToFit}},limitSize=function(e,t,r,n){var i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:"width",o=e.width,a=e.height;if(!o&&!a)return {width:o,height:a};if(o=o&&limit(o,t.width,r.width),a=a&&limit(a,t.height,r.height),!n)return {width:o,height:a};if(a)if(o)"width"===i?a=o/n:"height"===i?o=a*n:(a*n<t.width?a=(o=t.width)/n:o/n<t.height&&(o=(a=t.height)*n),a*n>r.width?a=(o=r.width)/n:o/n>r.height&&(o=(a=r.height)*n));else{a=limit(a*n,t.width,r.width)/n;}else o=limit(o/n,t.height,r.height)*n;return {width:o,height:a}},dotColorMatrix=function(e,t){var r=new Array(20);return r[0]=e[0]*t[0]+e[1]*t[5]+e[2]*t[10]+e[3]*t[15],r[1]=e[0]*t[1]+e[1]*t[6]+e[2]*t[11]+e[3]*t[16],r[2]=e[0]*t[2]+e[1]*t[7]+e[2]*t[12]+e[3]*t[17],r[3]=e[0]*t[3]+e[1]*t[8]+e[2]*t[13]+e[3]*t[18],r[4]=e[0]*t[4]+e[1]*t[9]+e[2]*t[14]+e[3]*t[19]+e[4],r[5]=e[5]*t[0]+e[6]*t[5]+e[7]*t[10]+e[8]*t[15],r[6]=e[5]*t[1]+e[6]*t[6]+e[7]*t[11]+e[8]*t[16],r[7]=e[5]*t[2]+e[6]*t[7]+e[7]*t[12]+e[8]*t[17],r[8]=e[5]*t[3]+e[6]*t[8]+e[7]*t[13]+e[8]*t[18],r[9]=e[5]*t[4]+e[6]*t[9]+e[7]*t[14]+e[8]*t[19]+e[9],r[10]=e[10]*t[0]+e[11]*t[5]+e[12]*t[10]+e[13]*t[15],r[11]=e[10]*t[1]+e[11]*t[6]+e[12]*t[11]+e[13]*t[16],r[12]=e[10]*t[2]+e[11]*t[7]+e[12]*t[12]+e[13]*t[17],r[13]=e[10]*t[3]+e[11]*t[8]+e[12]*t[13]+e[13]*t[18],r[14]=e[10]*t[4]+e[11]*t[9]+e[12]*t[14]+e[13]*t[19]+e[14],r[15]=e[15]*t[0]+e[16]*t[5]+e[17]*t[10]+e[18]*t[15],r[16]=e[15]*t[1]+e[16]*t[6]+e[17]*t[11]+e[18]*t[16],r[17]=e[15]*t[2]+e[16]*t[7]+e[17]*t[12]+e[18]*t[17],r[18]=e[15]*t[3]+e[16]*t[8]+e[17]*t[13]+e[18]*t[18],r[19]=e[15]*t[4]+e[16]*t[9]+e[17]*t[14]+e[18]*t[19]+e[19],r},toRGBColorArray=function(e){var t;if(/^#/.test(e)){if(4===e.length){var r=e.split("");e="#"+r[1]+r[1]+r[2]+r[2]+r[3]+r[3];}var n=/^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(e);t=[parseInt(n[1],16),parseInt(n[2],16),parseInt(n[3],16)];}else if(/^rgb/.test(e)){(t=e.match(/\d+/g).map(function(e){return parseInt(e,10)})).length=3;}return t},viewCache=[],getColorMatrixFromMatrices=function(e){var t=[];return forin(e,function(e,r){return t.push(r)}),t.length?t.reduce(function(e,t){return dotColorMatrix(_toConsumableArray(e),t)},t.shift()):[]},getImageScalar=function(e){return e.crop.draft.transforms?e.crop.draft.transforms.scale:e.crop.transforms.scale},getMinCropSize=function(e){var t=e.image.width/e.image.naturalWidth,r=getImageScalar(e);return {width:e.options.cropMinImageWidth*r*t,height:e.options.cropMinImageHeight*r*t}},getMaxCropSize=function(e){var t=getImageScalar(e);return {width:e.image.width*t,height:e.image.height*t}},getWidth=function(e){return e.options.size?e.options.size.width:null},getHeight=function(e){return e.options.size?e.options.size.height:null},getOutputSizeWidth=function(e){return !1===e.size.width?getWidth(e):e.size.width},getOutputSizeHeight=function(e){return !1===e.size.height?getHeight(e):e.size.height},getAspectRatioOptions=function(e){return e.options.cropAspectRatioOptions?e.options.cropAspectRatioOptions.map(function(e){var t={aspectRatio:null,width:null,height:null};return "number"==typeof e.value&&(t.aspectRatio=e.value),"string"==typeof e.value&&(t.aspectRatio=getNumericAspectRatioFromString(e.value)),"object"===_typeof(e.value)&&null!==e.value&&(t.width=e.value.width,t.height=e.value.height,t.aspectRatio=t.height/t.width),{label:e.label,value:t}}):null},getCropStageRect=function(e,t){t.aspectRatio||(t.aspectRatio=e.image.height/e.image.width);var r=getCurrentCropSize(e.image,t,t.scaleToFit),n=r.width/r.height;return e.stage.width<r.width&&(r.width=e.stage.width,r.height=r.width/n),e.stage.height<r.height&&(r.height=e.stage.height,r.width=r.height*n),createRect(.5*e.stage.width-.5*r.width,.5*e.stage.height-.5*r.height,r.width,r.height)},getImageStageRect=function(e){var t=e.image.naturalWidth,r=e.image.naturalHeight,n=r/t;return e.stage.width<t&&(r=n*(t=e.stage.width)),e.stage.height<r&&(t=(r=e.stage.height)/n),createRect(.5*e.stage.width-.5*t,.5*e.stage.height-.5*r,t,r)},queries=function(e){return {ALLOW_MANUAL_RESIZE:function(){return e.options.utils.includes("resize")},GET_SIZE:function(){return !1!==e.size.width&&!1!==e.size.height?{width:e.size.width,height:e.size.height}:{width:null,height:null}},GET_SIZE_INPUT:function(){return {width:e.size.width,height:e.size.height}},GET_SIZE_ASPECT_RATIO_LOCK:function(){return e.size.aspectRatioLocked},IS_ACTIVE_VIEW:function(t){return e.activeView===t},GET_ACTIVE_VIEW:function(){return e.activeView},GET_STYLES:function(){return Object.keys(e.options).filter(function(e){return /^style/.test(e)}).map(function(t){return {name:t,value:e.options[t]}})},GET_FILE:function(){return e.file},GET_IMAGE:function(){return e.image},GET_STAGE:function(){return _objectSpread({},e.stage,e.stageOffset)},GET_STAGE_RECT:function(t){var r,n=e.options.imagePreviewScaleMode;return "crop"===n?(console.log(t,getImageStageRect(e)),r=t?getCropStageRect(e,t):getImageStageRect(e)):r="image"===n?getImageStageRect(e):_objectSpread({},e.stage),r.fits=r.width<e.stage.width&&r.height<e.stage.height,r.mode=n,r},GET_IMAGE_STAGE_RECT:function(){return getImageStageRect(e)},GET_ROOT:function(){return e.rootRect},GET_ROOT_SIZE:function(){return {width:e.rootRect.width,height:e.rootRect.height}},GET_MIN_IMAGE_SIZE:function(){return {width:e.options.cropMinImageWidth,height:e.options.cropMinImageHeight}},GET_IMAGE_PREVIEW_SCALE_FACTOR:function(){return e.image.width/e.image.naturalWidth},GET_MIN_PREVIEW_IMAGE_SIZE:function(){var t=e.image.width/e.image.naturalWidth;return {width:e.options.cropMinImageWidth*t,height:e.options.cropMinImageHeight*t}},GET_MIN_CROP_SIZE:function(){return getMinCropSize(e)},GET_MAX_CROP_SIZE:function(){return getMaxCropSize(e)},GET_MIN_PIXEL_CROP_SIZE:function(){var t=e.crop.transforms.scale,r=getMinCropSize(e);return {width:r.width/t,height:r.height/t}},GET_MAX_PIXEL_CROP_SIZE:function(){var t=e.crop.transforms.scale,r=getMaxCropSize(e);return {width:r.width/t,height:r.height/t}},GET_CROP_ASPECT_RATIO_OPTIONS:function(){return getAspectRatioOptions(e)},GET_ACTIVE_CROP_ASPECT_RATIO:function(){var t=e.crop.aspectRatio;return isString(t)?getNumericAspectRatioFromString(t):t},GET_CROP_ASPECT_RATIO:function(){var t=isString(e.options.cropAspectRatio)?getNumericAspectRatioFromString(e.options.cropAspectRatio):e.options.cropAspectRatio,r=getAspectRatioOptions(e);return !r||r&&!r.length?t:r.find(function(e){return e.value.aspectRatio===t})?t:r[0].value.aspectRatio},GET_CROP_RECTANGLE_ASPECT_RATIO:function(){var t=e.crop,r=t.rectangle,n=t.aspectRatio;return r?r.width/r.height:n},GET_CROP:function(t,r){var n=viewCache[t];if(n&&n.ts===r)return n;var i=getCropView(e);return i&&(i.ts=r,viewCache[t]=i),i},GET_COLOR_MATRIX:function(){return getColorMatrixFromMatrices(e.colorMatrices)},GET_COLOR_VALUES:function(){return _objectSpread({exposure:e.options.colorExposure,brightness:e.options.colorBrightness,contrast:e.options.colorContrast,saturation:e.options.colorSaturation},e.colorValues)},GET_MARKUP_TOOL_VALUES:function(){return _objectSpread({color:e.options.markupColor,fontFamily:e.options.markupFontFamily,fontSize:e.options.markupFontSize,shapeStyle:e.options.markupShapeStyle,lineStyle:e.options.markupLineStyle,lineDecoration:e.options.markupLineDecoration},e.markupToolValues)},GET_PREVIEW_IMAGE_DATA:function(){return e.file.preview},GET_THUMB_IMAGE_DATA:function(){return e.file.thumb},GET_FILTER:function(){return e.filter},GET_UID:function(){return e.uid},GET_MARKUP_BY_ID:function(t){return e.markup.find(function(e){return e[1].id===t})},GET_BACKGROUND_COLOR:function(){var t=e.options.outputCanvasBackgroundColor;if(!t)return COLOR_TRANSPARENT;if(ColorTable[t])return ColorTable[t];var r=toRGBColorArray(t);return ColorTable[t]=r.concat(1),ColorTable[t]}}},ColorTable={},COLOR_TRANSPARENT=[0,0,0,0],getCurrentImageSize=function(e,t){var r=getOutputSizeWidth(e),n=getOutputSizeHeight(e),i=t.width/t.height;return limitSize({width:r,height:n},e.options.sizeMin,e.options.sizeMax,i)},getCurrentCropSize=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=!(arguments.length>2&&void 0!==arguments[2])||arguments[2],n=t.zoom,i=t.rotation,o=t.center,a=t.aspectRatio,c=calculateCanvasSize(e,a,n),l={x:.5*c.width,y:.5*c.height},u={x:0,y:0,width:c.width,height:c.height,center:l},s=n*getImageRectZoomFactor(e,getCenteredCropRect(u,a),i,r?o:{x:.5,y:.5});return {widthFloat:c.width/s,heightFloat:c.height/s,width:Math.round(c.width/s),height:Math.round(c.height/s)}},canZoom=function(e,t){var r=rectCenter(t),n=rectCenter(e);return !vectorEqual(n,r)},getCropView=function(e){if(!e.stage||!e.image)return null;var t=e.crop.draft.rectangle||{free:e.crop.rectangle,limited:e.crop.rectangle},r=e.crop.draft.transforms||e.crop.transforms,n=r.origin,i=r.translation,o=r.scale,a=r.interaction,c=e.crop.rotation,l=e.crop.flip,u=!(!e.crop.draft.rectangle&&!e.crop.draft.transforms),s=u||e.instantUpdate,d=canZoom(t.limited,e.stage),p=e.crop.isDirty||u,f=e.crop.isRotating,h=void 0===e.crop.limitToImageBounds||e.crop.limitToImageBounds,g={width:e.image.naturalWidth,height:e.image.naturalHeight},m=getColorMatrixFromMatrices(e.colorMatrices),v=getCropFromState(e.image,{rectangle:t.limited,transforms:{origin:n,translation:i,scale:o,rotation:c.main+c.sub},flip:l,limitToImageBounds:e.crop.limitToImageBounds}),y={props:v,crop:getCurrentCropSize(g,v,e.crop.limitToImageBounds),image:getCurrentImageSize(e,t.limited)},E=y.image,T=y.crop,_=T.width,R=T.height,w=T.widthFloat/T.heightFloat;E.width&&E.height?(_=E.width,R=E.height):E.width&&!E.height?(_=E.width,R=E.width/w):E.height&&!E.width&&(R=E.height,_=E.height*w),y.currentWidth=Math.round(_),y.currentHeight=Math.round(R);var I={x:0,y:0},A=0,C=0;if(s&&a){if(a.translation){var S=a.translation.x-i.x,O=a.translation.y-i.y;I.x=100*Math.sign(S)*Math.log10(1+Math.abs(S)/100),I.y=100*Math.sign(O)*Math.log10(1+Math.abs(O)/100);}if(a.scale){var x=a.scale-o;A=.25*Math.sign(x)*Math.log10(1+Math.abs(x)/.25);}if(a.rotation){var b=a.rotation-(c.main+c.sub);C=.05*Math.sign(b)*Math.log10(1+Math.abs(b)/.05);}}var M={},L=t.free,P=rectBounds(L),G=rectBounds(t.limited);return forin(P,function(e){var t=P[e]-G[e];M[e]=G[e]+5*Math.sign(t)*Math.log10(1+Math.abs(t)/5);}),{canRecenter:d,canReset:p,isDraft:s,isRotating:f,isLimitedToImageBounds:h,cropRect:{x:M.left,y:M.top,width:M.right-M.left,height:M.bottom-M.top},origin:n,translation:i,translationBand:I,scale:o,scaleBand:A,rotation:c,rotationBand:C,flip:l,interaction:a,cropStatus:y,colorMatrix:m,markup:e.markup}},isImage=function(e){return /^image/.test(e.type)},MATRICES={1:function(){return [1,0,0,1,0,0]},2:function(e){return [-1,0,0,1,e,0]},3:function(e,t){return [-1,0,0,-1,e,t]},4:function(e,t){return [1,0,0,-1,0,t]},5:function(){return [0,1,1,0,0,0]},6:function(e,t){return [0,1,-1,0,t,0]},7:function(e,t){return [0,-1,-1,0,t,e]},8:function(e){return [0,-1,1,0,0,e]}},getImageOrientationMatrix=function(e,t,r){return -1===r&&(r=1),MATRICES[r](e,t)},canvasRelease=function(e){e.width=1,e.height=1,e.getContext("2d").clearRect(0,0,1,1);},isFlipped=function(e){return e&&(e.horizontal||e.vertical)},getBitmap=function(e,t,r){if(t<=1&&!isFlipped(r))return e.width=e.naturalWidth,e.height=e.naturalHeight,e;var n=document.createElement("canvas"),i=e.naturalWidth,o=e.naturalHeight,a=t>=5&&t<=8;a?(n.width=o,n.height=i):(n.width=i,n.height=o);var c=n.getContext("2d");if(t&&c.transform.apply(c,getImageOrientationMatrix(i,o,t)),isFlipped(r)){var l=[1,0,0,1,0,0];(!a&&r.horizontal||a&r.vertical)&&(l[0]=-1,l[4]=i),(!a&&r.vertical||a&&r.horizontal)&&(l[3]=-1,l[5]=o),c.transform.apply(c,l);}return c.drawImage(e,0,0,i,o),n},imageToImageData=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},i=n.canvasMemoryLimit,o=n.background,a=void 0===o?null:o,c=r.zoom||1,l=getBitmap(e,t,r.flip),u={width:l.width,height:l.height},s=r.aspectRatio||u.height/u.width,d=calculateCanvasSize(u,s,c);if(i){var p=d.width*d.height;if(p>i){var f=Math.sqrt(i)/Math.sqrt(p);u.width=Math.floor(u.width*f),u.height=Math.floor(u.height*f),d=calculateCanvasSize(u,s,c);}}var h=document.createElement("canvas"),g={x:.5*d.width,y:.5*d.height},m={x:0,y:0,width:d.width,height:d.height,center:g},v=void 0===r.scaleToFit||r.scaleToFit,y=c*getImageRectZoomFactor(u,getCenteredCropRect(m,s),r.rotation,v?r.center:{x:.5,y:.5});h.width=Math.round(d.width/y),h.height=Math.round(d.height/y),g.x/=y,g.y/=y;var E=g.x-u.width*(r.center?r.center.x:.5),T=g.y-u.height*(r.center?r.center.y:.5),_=h.getContext("2d");a&&(_.fillStyle=a,_.fillRect(0,0,h.width,h.height)),_.translate(g.x,g.y),_.rotate(r.rotation||0),_.drawImage(l,E-g.x,T-g.y,u.width,u.height);var R=_.getImageData(0,0,h.width,h.height);return canvasRelease(h),R},IS_BROWSER$1="undefined"!=typeof window&&void 0!==window.document;IS_BROWSER$1&&(HTMLCanvasElement.prototype.toBlob||Object.defineProperty(HTMLCanvasElement.prototype,"toBlob",{value:function(e,t,r){var n=this.toDataURL(t,r).split(",")[1];setTimeout(function(){for(var r=atob(n),i=r.length,o=new Uint8Array(i),a=0;a<i;a++)o[a]=r.charCodeAt(a);e(new Blob([o],{type:t||"image/png"}));});}}));var canvasToBlob=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null;return new Promise(function(n){var i=r?r(e):e;Promise.resolve(i).then(function(e){e.toBlob(n,t.type,t.quality);});})},vectorMultiply$1=function(e,t){return createVector$2(e.x*t,e.y*t)},vectorAdd$1=function(e,t){return createVector$2(e.x+t.x,e.y+t.y)},vectorNormalize$1=function(e){var t=Math.sqrt(e.x*e.x+e.y*e.y);return 0===t?{x:0,y:0}:createVector$2(e.x/t,e.y/t)},vectorRotate$1=function(e,t,r){var n=Math.cos(t),i=Math.sin(t),o=createVector$2(e.x-r.x,e.y-r.y);return createVector$2(r.x+n*o.x-i*o.y,r.y+i*o.x+n*o.y)},createVector$2=function(){return {x:arguments.length>0&&void 0!==arguments[0]?arguments[0]:0,y:arguments.length>1&&void 0!==arguments[1]?arguments[1]:0}},getMarkupValue=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,n=arguments.length>3?arguments[3]:void 0;return "string"==typeof e?parseFloat(e)*r:"number"==typeof e?e*(n?t[n]:Math.min(t.width,t.height)):void 0},getMarkupStyles=function(e,t,r){var n=e.borderStyle||e.lineStyle||"solid",i=e.backgroundColor||e.fontColor||"transparent",o=e.borderColor||e.lineColor||"transparent",a=getMarkupValue(e.borderWidth||e.lineWidth,t,r);return {"stroke-linecap":e.lineCap||"round","stroke-linejoin":e.lineJoin||"round","stroke-width":a||0,"stroke-dasharray":"string"==typeof n?"":n.map(function(e){return getMarkupValue(e,t,r)}).join(","),stroke:o,fill:i,opacity:e.opacity||1}},isDefined=function(e){return null!=e},getMarkupRect=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:1,n=getMarkupValue(e.x,t,r,"width")||getMarkupValue(e.left,t,r,"width"),i=getMarkupValue(e.y,t,r,"height")||getMarkupValue(e.top,t,r,"height"),o=getMarkupValue(e.width,t,r,"width"),a=getMarkupValue(e.height,t,r,"height"),c=getMarkupValue(e.right,t,r,"width"),l=getMarkupValue(e.bottom,t,r,"height");return isDefined(i)||(i=isDefined(a)&&isDefined(l)?t.height-a-l:l),isDefined(n)||(n=isDefined(o)&&isDefined(c)?t.width-o-c:c),isDefined(o)||(o=isDefined(n)&&isDefined(c)?t.width-n-c:0),isDefined(a)||(a=isDefined(i)&&isDefined(l)?t.height-i-l:0),{x:n||0,y:i||0,width:o||0,height:a||0}},pointsToPathShape=function(e){return e.map(function(e,t){return "".concat(0===t?"M":"L"," ").concat(e.x," ").concat(e.y)}).join(" ")},setAttributes=function(e,t){return Object.keys(t).forEach(function(r){return e.setAttribute(r,t[r])})},ns$1="http://www.w3.org/2000/svg",svg=function(e,t){var r=document.createElementNS(ns$1,e);return t&&setAttributes(r,t),r},updateRect$1=function(e){return setAttributes(e,_objectSpread({},e.rect,e.styles))},updateEllipse=function(e){var t=e.rect.x+.5*e.rect.width,r=e.rect.y+.5*e.rect.height,n=.5*e.rect.width,i=.5*e.rect.height;return setAttributes(e,_objectSpread({cx:t,cy:r,rx:n,ry:i},e.styles))},IMAGE_FIT_STYLE={contain:"xMidYMid meet",cover:"xMidYMid slice"},updateImage=function(e,t){setAttributes(e,_objectSpread({},e.rect,e.styles,{preserveAspectRatio:IMAGE_FIT_STYLE[t.fit]||"none"}));},TEXT_ANCHOR={left:"start",center:"middle",right:"end"},updateText=function(e,t,r,n){var i=getMarkupValue(t.fontSize,r,n),o=t.fontFamily||"sans-serif",a=t.fontWeight||"normal",c=TEXT_ANCHOR[t.textAlign]||"start";setAttributes(e,_objectSpread({},e.rect,e.styles,{"stroke-width":0,"font-weight":a,"font-size":i,"font-family":o,"text-anchor":c})),e.text!==t.text&&(e.text=t.text,e.textContent=t.text.length?t.text:" ");},updateLine=function(e,t,r,n){setAttributes(e,_objectSpread({},e.rect,e.styles,{fill:"none"}));var i=e.childNodes[0],o=e.childNodes[1],a=e.childNodes[2],c=e.rect,l={x:e.rect.x+e.rect.width,y:e.rect.y+e.rect.height};if(setAttributes(i,{x1:c.x,y1:c.y,x2:l.x,y2:l.y}),t.lineDecoration){o.style.display="none",a.style.display="none";var u=vectorNormalize$1({x:l.x-c.x,y:l.y-c.y}),s=getMarkupValue(.05,r,n);if(-1!==t.lineDecoration.indexOf("arrow-begin")){var d=vectorMultiply$1(u,s),p=vectorAdd$1(c,d),f=vectorRotate$1(c,2,p),h=vectorRotate$1(c,-2,p);setAttributes(o,{style:"display:block;",d:"M".concat(f.x,",").concat(f.y," L").concat(c.x,",").concat(c.y," L").concat(h.x,",").concat(h.y)});}if(-1!==t.lineDecoration.indexOf("arrow-end")){var g=vectorMultiply$1(u,-s),m=vectorAdd$1(l,g),v=vectorRotate$1(l,2,m),y=vectorRotate$1(l,-2,m);setAttributes(a,{style:"display:block;",d:"M".concat(v.x,",").concat(v.y," L").concat(l.x,",").concat(l.y," L").concat(y.x,",").concat(y.y)});}}},updatePath=function(e,t,r,n){setAttributes(e,_objectSpread({},e.styles,{fill:"none",d:pointsToPathShape(t.points.map(function(e){return {x:getMarkupValue(e.x,r,n,"width"),y:getMarkupValue(e.y,r,n,"height")}}))}));},createShape=function(e){return function(t){return svg(e,{id:t.id})}},createImage=function(e){var t=svg("image",{id:e.id,"stroke-linecap":"round","stroke-linejoin":"round",opacity:"0"});return t.onload=function(){t.setAttribute("opacity",e.opacity||1);},t.setAttributeNS("http://www.w3.org/1999/xlink","xlink:href",e.src),t},createLine=function(e){var t=svg("g",{id:e.id,"stroke-linecap":"round","stroke-linejoin":"round"}),r=svg("line");t.appendChild(r);var n=svg("path");t.appendChild(n);var i=svg("path");return t.appendChild(i),t},CREATE_TYPE_ROUTES={image:createImage,rect:createShape("rect"),ellipse:createShape("ellipse"),text:createShape("text"),path:createShape("path"),line:createLine},UPDATE_TYPE_ROUTES={rect:updateRect$1,ellipse:updateEllipse,image:updateImage,text:updateText,path:updatePath,line:updateLine},createMarkupByType=function(e,t){return CREATE_TYPE_ROUTES[e](t)},updateMarkupByType=function(e,t,r,n,i){"path"!==t&&(e.rect=getMarkupRect(r,n,i)),e.styles=getMarkupStyles(r,n,i),UPDATE_TYPE_ROUTES[t](e,r,n,i);},sortMarkupByZIndex=function(e,t){return e[1].zIndex>t[1].zIndex?1:e[1].zIndex<t[1].zIndex?-1:0},cropSVG=function(e,t,r,n){return new Promise(function(i){var o=n.background,a=void 0===o?null:o,c=new FileReader;c.onloadend=function(){var e=c.result,n=document.createElement("div");n.style.cssText="position:absolute;pointer-events:none;width:0;height:0;visibility:hidden;",n.innerHTML=e;var o=n.querySelector("svg");document.body.appendChild(n);var l=o.getBBox();n.parentNode.removeChild(n);var u=n.querySelector("title"),s=o.getAttribute("viewBox")||"",d=o.getAttribute("width")||"",p=o.getAttribute("height")||"",f=parseFloat(d)||null,h=parseFloat(p)||null,g=(d.match(/[a-z]+/)||[])[0]||"",m=(p.match(/[a-z]+/)||[])[0]||"",v=s.split(" ").map(parseFloat),y=v.length?{x:v[0],y:v[1],width:v[2],height:v[3]}:l,E=null!=f?f:y.width,T=null!=h?h:y.height;o.style.overflow="visible",o.setAttribute("width",E),o.setAttribute("height",T);var _="";if(r&&r.length){var R={width:E,height:T};_=r.sort(sortMarkupByZIndex).reduce(function(e,t){var r=createMarkupByType(t[0],t[1]);return updateMarkupByType(r,t[0],t[1],R),r.removeAttribute("id"),1===r.getAttribute("opacity")&&r.removeAttribute("opacity"),e+"\n"+r.outerHTML+"\n"},""),_="\n\n<g>".concat(_.replace(/&nbsp;/g," "),"</g>\n\n");}var w=t.aspectRatio||T/E,I=E,A=I*w,C=void 0===t.scaleToFit||t.scaleToFit,S=getImageRectZoomFactor({width:E,height:T},getCenteredCropRect({width:I,height:A},w),t.rotation,C?t.center:{x:.5,y:.5}),O=t.zoom*S,x=t.rotation*(180/Math.PI),b={x:.5*I,y:.5*A},M={x:b.x-E*t.center.x,y:b.y-T*t.center.y},L=["rotate(".concat(x," ").concat(b.x," ").concat(b.y,")"),"translate(".concat(b.x," ").concat(b.y,")"),"scale(".concat(O,")"),"translate(".concat(-b.x," ").concat(-b.y,")"),"translate(".concat(M.x," ").concat(M.y,")")],P=["scale(".concat(t.flip.horizontal?-1:1," ").concat(t.flip.vertical?-1:1,")"),"translate(".concat(t.flip.horizontal?-E:0," ").concat(t.flip.vertical?-T:0,")")],G='<?xml version="1.0" encoding="UTF-8"?>\n<svg width="'.concat(I).concat(g,'" height="').concat(A).concat(m,'" \nviewBox="0 0 ').concat(I," ").concat(A,'" ').concat(a?'style="background:'+a+'" ':"",'\npreserveAspectRatio="xMinYMin"\nxmlns:xlink="http://www.w3.org/1999/xlink"\nxmlns="http://www.w3.org/2000/svg">\n\x3c!-- Generated by PQINA - https://pqina.nl/ --\x3e\n<title>').concat(u?u.textContent:"",'</title>\n<g transform="').concat(L.join(" "),'">\n<g transform="').concat(P.join(" "),'">\n').concat(o.outerHTML).concat(_,"\n</g>\n</g>\n</svg>");i(G);},c.readAsText(e);})},objectToImageData=function(e){var t;try{t=new ImageData(e.width,e.height);}catch(r){t=document.createElement("canvas").getContext("2d").createImageData(e.width,e.height);}return t.data.set(e.data),t},TransformWorker=function(){var e={resize:function(e,t){var n=t.mode,a=void 0===n?"contain":n,c=t.upscale,l=void 0!==c&&c,u=t.width,s=t.height,d=t.matrix;if(d=!d||i(d)?null:d,!u&&!s)return o(e,d);null===u?u=s:null===s&&(s=u);if("force"!==a){var p=u/e.width,f=s/e.height,h=1;if("cover"===a?h=Math.max(p,f):"contain"===a&&(h=Math.min(p,f)),h>1&&!1===l)return o(e,d);u=e.width*h,s=e.height*h;}for(var g=e.width,m=e.height,v=Math.round(u),y=Math.round(s),E=e.data,T=new Uint8ClampedArray(v*y*4),_=g/v,R=m/y,w=Math.ceil(.5*_),I=Math.ceil(.5*R),A=0;A<y;A++)for(var C=0;C<v;C++){for(var S=4*(C+A*v),O=0,x=0,b=0,M=0,L=0,P=0,G=0,k=(A+.5)*R,D=Math.floor(A*R);D<(A+1)*R;D++)for(var V=Math.abs(k-(D+.5))/I,U=(C+.5)*_,B=V*V,N=Math.floor(C*_);N<(C+1)*_;N++){var F=Math.abs(U-(N+.5))/w,z=Math.sqrt(B+F*F);if(z>=-1&&z<=1&&(O=2*z*z*z-3*z*z+1)>0){var W=E[(F=4*(N+D*g))+3];G+=O*W,b+=O,W<255&&(O=O*W/250),M+=O*E[F],L+=O*E[F+1],P+=O*E[F+2],x+=O;}}T[S]=M/x,T[S+1]=L/x,T[S+2]=P/x,T[S+3]=G/b,d&&r(S,T,d);}return {data:T,width:v,height:y}},filter:o},t=function(t,r){var n=t.transforms,i=null;if(n.forEach(function(e){"filter"===e.type&&(i=e);}),i){var o=null;n.forEach(function(e){"resize"===e.type&&(o=e);}),o&&(o.data.matrix=i.data,n=n.filter(function(e){return "filter"!==e.type}));}r(function(t,r){return t.forEach(function(t){r=e[t.type](r,t.data);}),r}(n,t.imageData));};function r(e,t,r){for(var n=0,i=0,o=0,a=t[e]/255,c=t[e+1]/255,l=t[e+2]/255,u=t[e+3]/255;n<4;n++)o=255*(a*r[i=5*n]+c*r[i+1]+l*r[i+2]+u*r[i+3]+r[i+4]),t[e+n]=Math.max(0,Math.min(o,255));}self.onmessage=function(e){t(e.data.message,function(t){self.postMessage({id:e.data.id,message:t},[t.data.buffer]);});};var n=self.JSON.stringify([1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0]);function i(e){return self.JSON.stringify(e||[])===n}function o(e,t){if(!t||i(t))return e;for(var r=e.data,n=r.length,o=t[0],a=t[1],c=t[2],l=t[3],u=t[4],s=t[5],d=t[6],p=t[7],f=t[8],h=t[9],g=t[10],m=t[11],v=t[12],y=t[13],E=t[14],T=t[15],_=t[16],R=t[17],w=t[18],I=t[19],A=0,C=0,S=0,O=0,x=0;A<n;A+=4)C=r[A]/255,S=r[A+1]/255,O=r[A+2]/255,x=r[A+3]/255,r[A]=Math.max(0,Math.min(255*(C*o+S*a+O*c+x*l+u),255)),r[A+1]=Math.max(0,Math.min(255*(C*s+S*d+O*p+x*f+h),255)),r[A+2]=Math.max(0,Math.min(255*(C*g+S*m+O*v+x*y+E),255)),r[A+3]=Math.max(0,Math.min(255*(C*T+S*_+O*R+x*w+I),255));return e}},correctOrientation=function(e,t){if(1165519206===e.getUint32(t+4,!1)){t+=4;var r=18761===e.getUint16(t+=6,!1);t+=e.getUint32(t+4,r);var n=e.getUint16(t,r);t+=2;for(var i=0;i<n;i++)if(274===e.getUint16(t+12*i,r))return e.setUint16(t+12*i+8,1,r),!0;return !1}},readData=function(e){var t=new DataView(e);if(65496!==t.getUint16(0))return null;for(var r,n,i=2,o=!1;i<t.byteLength;){if(r=t.getUint16(i,!1),n=t.getUint16(i+2,!1)+2,!(r>=65504&&r<=65519||65534===r))break;if(o||(o=correctOrientation(t,i)),i+n>t.byteLength)break;i+=n;}return e.slice(0,i)},getImageHead=function(e){return new Promise(function(t){var r=new FileReader;r.onload=function(){return t(readData(r.result)||null)},r.readAsArrayBuffer(e.slice(0,262144));})},getBlobBuilder=function(){return window.BlobBuilder=window.BlobBuilder||window.WebKitBlobBuilder||window.MozBlobBuilder||window.MSBlobBuilder},createBlob=function(e,t){var r=getBlobBuilder();if(r){var n=new r;return n.append(e),n.getBlob(t)}return new Blob([e],{type:t})},getUniqueId$1=function(){return Math.random().toString(36).substr(2,9)},createWorker=function(e){var t=new Blob(["(",e.toString(),")()"],{type:"application/javascript"}),r=URL.createObjectURL(t),n=new Worker(r),i=[];return {transfer:function(){},post:function(e,t,r){var o=getUniqueId$1();i[o]=t,n.onmessage=function(e){var t=i[e.data.id];t&&(t(e.data.message),delete i[e.data.id]);},n.postMessage({id:o,message:e},r);},terminate:function(){n.terminate(),URL.revokeObjectURL(r);}}},loadImage=function(e){return new Promise(function(t,r){var n=new Image;n.onload=function(){t(n);},n.onerror=function(e){r(e);},n.src=e;})},chain=function(e){return e.reduce(function(e,t){return e.then(function(e){return t().then(Array.prototype.concat.bind(e))})},Promise.resolve([]))},canvasApplyMarkup=function(e,t){return new Promise(function(r){var n={width:e.width,height:e.height},i=e.getContext("2d"),o=t.sort(sortMarkupByZIndex).map(function(e){return function(){return new Promise(function(t){TYPE_DRAW_ROUTES[e[0]](i,n,e[1],t)&&t();})}});chain(o).then(function(){return r(e)});})},applyMarkupStyles=function(e,t){e.beginPath(),e.lineCap=t["stroke-linecap"],e.lineJoin=t["stroke-linejoin"],e.lineWidth=t["stroke-width"],t["stroke-dasharray"].length&&e.setLineDash(t["stroke-dasharray"].split(",")),e.fillStyle=t.fill,e.strokeStyle=t.stroke,e.globalAlpha=t.opacity||1;},drawMarkupStyles=function(e){e.fill(),e.stroke(),e.globalAlpha=1;},drawRect=function(e,t,r){var n=getMarkupRect(r,t),i=getMarkupStyles(r,t);return applyMarkupStyles(e,i),e.rect(n.x,n.y,n.width,n.height),drawMarkupStyles(e),!0},drawEllipse=function(e,t,r){var n=getMarkupRect(r,t),i=getMarkupStyles(r,t);applyMarkupStyles(e,i);var o=n.x,a=n.y,c=n.width,l=n.height,u=c/2*.5522848,s=l/2*.5522848,d=o+c,p=a+l,f=o+c/2,h=a+l/2;return e.moveTo(o,h),e.bezierCurveTo(o,h-s,f-u,a,f,a),e.bezierCurveTo(f+u,a,d,h-s,d,h),e.bezierCurveTo(d,h+s,f+u,p,f,p),e.bezierCurveTo(f-u,p,o,h+s,o,h),drawMarkupStyles(e),!0},drawImage=function(e,t,r,n){var i=getMarkupRect(r,t),o=getMarkupStyles(r,t);applyMarkupStyles(e,o);var a=new Image;a.onload=function(){if("cover"===r.fit){var t=i.width/i.height,c=t>1?a.width:a.height*t,l=t>1?a.width/t:a.height,u=.5*a.width-.5*c,s=.5*a.height-.5*l;e.drawImage(a,u,s,c,l,i.x,i.y,i.width,i.height);}else if("contain"===r.fit){var d=Math.min(i.width/a.width,i.height/a.height),p=d*a.width,f=d*a.height,h=i.x+.5*i.width-.5*p,g=i.y+.5*i.height-.5*f;e.drawImage(a,0,0,a.width,a.height,h,g,p,f);}else e.drawImage(a,0,0,a.width,a.height,i.x,i.y,i.width,i.height);drawMarkupStyles(e),n();},a.src=r.src;},drawText=function(e,t,r){var n=getMarkupRect(r,t),i=getMarkupStyles(r,t);applyMarkupStyles(e,i);var o=getMarkupValue(r.fontSize,t),a=r.fontFamily||"sans-serif",c=r.fontWeight||"normal",l=r.textAlign||"left";return e.font="".concat(c," ").concat(o,"px ").concat(a),e.textAlign=l,e.fillText(r.text,n.x,n.y),drawMarkupStyles(e),!0},drawPath=function(e,t,r){var n=getMarkupStyles(r,t);applyMarkupStyles(e,n),e.beginPath();var i=r.points.map(function(e){return {x:getMarkupValue(e.x,t,1,"width"),y:getMarkupValue(e.y,t,1,"height")}});e.moveTo(i[0].x,i[0].y);for(var o=i.length,a=1;a<o;a++)e.lineTo(i[a].x,i[a].y);return drawMarkupStyles(e),!0},drawLine=function(e,t,r){var n=getMarkupRect(r,t),i=getMarkupStyles(r,t);applyMarkupStyles(e,i),e.beginPath();var o={x:n.x,y:n.y},a={x:n.x+n.width,y:n.y+n.height};e.moveTo(o.x,o.y),e.lineTo(a.x,a.y);var c=vectorNormalize$1({x:a.x-o.x,y:a.y-o.y}),l=.04*Math.min(t.width,t.height);if(-1!==r.lineDecoration.indexOf("arrow-begin")){var u=vectorMultiply$1(c,l),s=vectorAdd$1(o,u),d=vectorRotate$1(o,2,s),p=vectorRotate$1(o,-2,s);e.moveTo(d.x,d.y),e.lineTo(o.x,o.y),e.lineTo(p.x,p.y);}if(-1!==r.lineDecoration.indexOf("arrow-end")){var f=vectorMultiply$1(c,-l),h=vectorAdd$1(a,f),g=vectorRotate$1(a,2,h),m=vectorRotate$1(a,-2,h);e.moveTo(g.x,g.y),e.lineTo(a.x,a.y),e.lineTo(m.x,m.y);}return drawMarkupStyles(e),!0},TYPE_DRAW_ROUTES={rect:drawRect,ellipse:drawEllipse,image:drawImage,text:drawText,line:drawLine,path:drawPath},imageDataToCanvas=function(e){var t=document.createElement("canvas");return t.width=e.width,t.height=e.height,t.getContext("2d").putImageData(e,0,0),t},transformImage=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return new Promise(function(n,i){if(!e||!isImage(e))return i({status:"not an image file",file:e});var o=r.stripImageHead,a=r.beforeCreateBlob,c=r.afterCreateBlob,l=r.canvasMemoryLimit,u=t.crop,s=t.size,d=t.filter,p=t.markup,f=t.output,h=t.image&&t.image.orientation?Math.max(1,Math.min(8,t.image.orientation)):null,g=f&&f.quality,m=null===g?null:g/100,v=f&&f.type||null,y=f&&f.background||null,E=[];!s||"number"!=typeof s.width&&"number"!=typeof s.height||E.push({type:"resize",data:s}),d&&20===d.length&&E.push({type:"filter",data:d});var T=function(e){var t=c?c(e):e;Promise.resolve(t).then(n);},_=function(t,r){var n=imageDataToCanvas(t),c=p.length?canvasApplyMarkup(n,p):n;Promise.resolve(c).then(function(t){canvasToBlob(t,r,a).then(function(r){if(canvasRelease(t),o)return T(r);getImageHead(e).then(function(e){null!==e&&(r=new Blob([e,r.slice(20)],{type:r.type})),T(r);});}).catch(i);});};if(/svg/.test(e.type)&&null===v)return cropSVG(e,u,p,{background:y}).then(function(e){n(createBlob(e,"image/svg+xml"));});var R=URL.createObjectURL(e);loadImage(R).then(function(t){URL.revokeObjectURL(R);var r=imageToImageData(t,h,u,{canvasMemoryLimit:l,background:y}),n={quality:m,type:v||e.type};if(!E.length)return _(r,n);var i=createWorker(TransformWorker);i.post({transforms:E,imageData:r},function(e){_(objectToImageData(e),n),i.terminate();},[r.data.buffer]);}).catch(i);})},readExif=function(e,t){if(1165519206!==e.getUint32(t+=2,!1))return -1;var r=18761===e.getUint16(t+=6,!1);t+=e.getUint32(t+4,r);var n=e.getUint16(t,r);t+=2;for(var i=0;i<n;i++)if(274===e.getUint16(t+12*i,r))return e.getUint16(t+12*i+8,r)},readData$1=function(e){var t=new DataView(e);if(65496!=t.getUint16(0,!1))return null;for(var r,n=t.byteLength,i=2;i<n;){if(t.getUint16(i+2,!1)<=8)return -1;if(r=t.getUint16(i,!1),i+=2,65505===r)return readExif(t,i);if(65280!=(65280&r))return null;i+=t.getUint16(i,!1);}},getImageOrientation=function(e){return new Promise(function(t){var r=new FileReader;r.onload=function(){return t(readData$1(r.result)||-1)},r.readAsArrayBuffer(e.slice(0,262144));})},Direction={HORIZONTAL:1,VERTICAL:2},getImageTransformsFromCrop=function(e,t,r){var n=!(arguments.length>3&&void 0!==arguments[3])||arguments[3],i=e.center,o=e.zoom,a=e.aspectRatio,c=rectCenter(t),l={x:c.x-r.width*i.x,y:c.y-r.height*i.y},u=2*Math.PI+e.rotation%(2*Math.PI),s=o*getImageRectZoomFactor(r,getCenteredCropRect(t,a||r.height/r.width),u,n?i:{x:.5,y:.5});return {origin:{x:i.x*r.width,y:i.y*r.height},translation:l,scale:s,rotation:e.rotation}},copyImageTransforms=function(e){return {origin:_objectSpread({},e.origin),translation:_objectSpread({},e.translation),rotation:e.rotation,scale:e.scale}},limitImageTransformsToCropRect=function(e,t,r,n){var i=r.translation,o=r.scale,a=r.rotation,c=r.origin,l={origin:_objectSpread({},c),translation:_objectSpread({},i),scale:o,rotation:2*Math.PI+a%(2*Math.PI)},u=e.height/e.width,s=getAxisAlignedCropRect(c,i,l.rotation,t),d=rectCenter(s),p=rectBounds(s),f=getAxisAlignedImageRect(e,r),h=rectCenter(f),g={x:f.x,y:f.y},m={x:h.x,y:h.y},v=d.x,y=d.y,E={x:g.x,y:g.y,width:f.width,height:f.height};if(!rectFitsInRect(s,f))if("moving"===n){E.y>s.y?E.y=s.y:E.y+E.height<p.bottom&&(E.y=p.bottom-E.height),E.x>s.x?E.x=s.x:E.x+E.width<p.right&&(E.x=p.right-E.width);var T=getAxisAlignedImageRect(e,_objectSpread({},r,{scale:l.scale})),_=rectCenter(T);m.x=_.x,m.y=_.y,g.x=T.x,g.y=T.y,E.x=m.x-.5*E.width,E.y=m.y-.5*E.height,E.y>s.y?E.y=s.y:E.y+E.height<p.bottom&&(E.y=p.bottom-E.height),E.x>s.x?E.x=s.x:E.x+E.width<p.right&&(E.x=p.right-E.width);var R={x:E.x-g.x,y:E.y-g.y},w={x:R.x*Math.cos(l.rotation)-R.y*Math.sin(l.rotation),y:R.x*Math.sin(l.rotation)+R.y*Math.cos(l.rotation)};l.translation.x+=w.x,l.translation.y+=w.y;}else if("resizing"===n){f.width<s.width&&(E.width=s.width,E.height=E.width*u,E.height<s.height&&(E.height=s.height,E.width=E.height/u)),f.height<s.height&&(E.height=s.height,E.width=E.height/u,E.width<s.width&&(E.width=s.width,E.height=E.width*u)),E.x=m.x-.5*E.width,E.y=m.y-.5*E.height,E.y>s.y?E.y=s.y:E.y+E.height<p.bottom&&(E.y=p.bottom-E.height),E.x>s.x?E.x=s.x:E.x+E.width<p.right&&(E.x=p.right-E.width),l.scale=getImageRectZoomFactor(e,t,l.rotation,{x:(v-E.x)/E.width,y:(y-E.y)/E.height});var I=getAxisAlignedImageRect(e,_objectSpread({},r,{scale:l.scale})),A=rectCenter(I);m.x=A.x,m.y=A.y,g.x=I.x,g.y=I.y,E.x=m.x-.5*E.width,E.y=m.y-.5*E.height,E.y>s.y?E.y=s.y:E.y+E.height<p.bottom&&(E.y=p.bottom-E.height),E.x>s.x?E.x=s.x:E.x+E.width<p.right&&(E.x=p.right-E.width);var C={x:E.x-g.x,y:E.y-g.y},S={x:C.x*Math.cos(l.rotation)-C.y*Math.sin(l.rotation),y:C.x*Math.sin(l.rotation)+C.y*Math.cos(l.rotation)};l.translation.x+=S.x,l.translation.y+=S.y;}else if("rotating"===n){var O=!1;if(E.y>s.y){var x=E.y-s.y;E.y=s.y,E.height+=2*x,O=!0;}if(E.y+E.height<p.bottom){var b=p.bottom-(E.y+E.height);E.y=p.bottom-E.height,E.height+=2*b,O=!0;}if(E.x>s.x){var M=E.x-s.x;E.x=s.x,E.width+=2*M,O=!0;}if(E.x+E.width<p.right){var L=p.right-(E.x+E.width);E.x=p.right-E.width,E.width+=2*L,O=!0;}O&&(l.scale=getImageRectZoomFactor(e,t,l.rotation,{x:(v-f.x)/f.width,y:(y-f.y)/f.height}));}return _objectSpread({},l,{rotation:r.rotation})},getTransformOrigin=function(e,t,r){var n=r.origin,i=r.translation,o=r.scale,a=2*Math.PI+r.rotation%(2*Math.PI),c={x:n.x+i.x,y:n.y+i.y},l=getAxisAlignedCropRect(n,i,a,t),u=getAxisAlignedImageRect(e,r),s=rectCorners(u),d=rectCenter(u),p=vectorRotate(s.tl,a,c),f=vectorRotate(s.br,a,c),h=p.x+.5*(f.x-p.x),g=p.y+.5*(f.y-p.y),m=rectTranslate(u,{x:h-d.x,y:g-d.y}),v=rectTranslate(l,{x:h-d.x,y:g-d.y}),y=rectCenter(v),E={x:m.x,y:m.y},T=m.width,_=m.height,R=(y.x-E.x)/T,w=(y.y-E.y)/_,I={x:R*e.width,y:w*e.height},A=1-o,C=I.x*A,S=I.y*A,O={x:E.x+T*R,y:E.y+_*w},x=vectorRotate(E,a,{x:E.x+.5*T,y:E.y+.5*_}),b=vectorRotate(E,a,O),M=x.x-b.x,L=x.y-b.y;return {origin:roundVector(I),translation:roundVector({x:E.x-C+M,y:E.y-S+L})}},EdgeMap={n:function(e){return {x:e.x+.5*e.width,y:e.y}},e:function(e){return {x:e.x+e.width,y:e.y+.5*e.height}},s:function(e){return {x:e.x+.5*e.width,y:e.y+e.height}},w:function(e){return {x:e.x,y:e.y+.5*e.height}}},getEdgeCenterCoordinates=function(e,t){return EdgeMap[e](t)},getImageTransformsFromRect=function(e,t,r){var n=r.origin,i=r.translation,o=2*Math.PI+r.rotation%(2*Math.PI),a=getAxisAlignedImageRect(e,r),c={x:n.x+i.x,y:n.y+i.y},l=getAxisAlignedCropRect(n,i,o,t),u=rectBounds(l),s=rectBounds(a),d=a;if(u.top<s.top||u.right>s.right||u.bottom>s.bottom||u.left<s.left){var p=_objectSpread({},s);if(u.top<=p.top){var f=p.bottom-p.top,h=p.right-p.left,g=Math.max(1,l.height/f),m=f*g,v=h*g-h;p.bottom=u.top+m,p.top=u.top,p.left-=.5*v,p.right+=.5*v;}if(u.bottom>=p.bottom){var y=p.bottom-p.top,E=p.right-p.left,T=Math.max(1,l.height/y),_=y*T,R=E*T-E;p.bottom=u.bottom,p.top=u.bottom-_,p.left-=.5*R,p.right+=.5*R;}if(u.left<=p.left){var w=p.bottom-p.top,I=p.right-p.left,A=Math.max(1,l.width/I),C=I*A,S=w*A-w;p.right=u.left+C,p.left=u.left,p.top-=.5*S,p.bottom+=.5*S;}if(u.right>=p.right){var O=p.bottom-p.top,x=p.right-p.left,b=Math.max(1,l.width/x),M=x*b,L=O*b-O;p.right=u.right,p.left=u.right-M,p.top-=.5*L,p.bottom+=.5*L;}d=createRect(p.left,p.top,p.right-p.left,p.bottom-p.top);}var P=rectCorners(d),G=rectCenter(d),k=vectorRotate(P.tl,o,c),D=vectorRotate(P.br,o,c),V=k.x+.5*(D.x-k.x),U=k.y+.5*(D.y-k.y),B=rectTranslate(d,{x:V-G.x,y:U-G.y}),N=rectTranslate(l,{x:V-G.x,y:U-G.y}),F=rectCenter(N),z={x:B.x,y:B.y},W=B.width,q=B.height,H=(F.x-z.x)/W,Y=(F.y-z.y)/q,j=W/e.width,Z={x:H*e.width,y:Y*e.height},$=1-j,X=Z.x*$,K=Z.y*$,Q={x:z.x+W*H,y:z.y+q*Y},J=vectorRotate(z,o,{x:z.x+.5*W,y:z.y+.5*q}),ee=vectorRotate(z,o,Q),te=J.x-ee.x,re=J.y-ee.y;return {origin:Z,translation:{x:z.x-X+te,y:z.y-K+re},scale:j,rotation:r.rotation}},getEdgeTargetRect=function(e,t,r,n,i,o,a,c,l){var u=o.left,s=o.right,d=o.top,p=o.bottom,f=s-u,h=p-d,g=i.left,m=i.right,v=i.top,y=i.bottom;if(r===Direction.VERTICAL){if(v=e.y>0?n.y:Math.min(n.y,Math.max(t.y,d)),y=e.y>0?Math.max(n.y,Math.min(t.y,p)):n.y,a){var E=(y-v)/a;g=n.x-.5*E,m=n.x+.5*E;}}else if(g=e.x>0?n.x:Math.min(n.x,Math.max(t.x,u)),m=e.x>0?Math.max(n.x,Math.min(t.x,s)):n.x,a){var T=(m-g)*a;v=n.y-.5*T,y=n.y+.5*T;}var _,R,w,I,A=c.width,C=c.height;if(r===Direction.VERTICAL?(_=n.x-.5*A,R=n.x+.5*A,e.y<0?(w=n.y-C,I=n.y):e.y>0&&(w=n.y,I=n.y+C)):(w=n.y-.5*C,I=n.y+.5*C,e.x<0?(_=n.x-A,R=n.x):e.x>0&&(_=n.x,R=n.x+A)),a)if(r===Direction.VERTICAL){var S=Math.min((y-v)/a,f),O=S*a;g<u&&(m=(g=u)+S),m>s&&(g=(m=s)-S),n.x=g+.5*S,e.y<0?v=n.y-O:e.y>0&&(y=n.y+O);}else{var x=Math.min((m-g)*a,h),b=x/a;v<d&&(y=(v=d)+x),y>p&&(v=(y=p)-x),n.y=v+.5*x,e.x<0?g=n.x-b:e.x>0&&(m=n.x+b);}var M=rectFromBounds({top:v,right:m,bottom:y,left:g}),L=function(){var t=A*a;r===Direction.HORIZONTAL?(v=n.y-.5*t,y=n.y+.5*t):e.y<0?(y=n.y,v=y-t):e.y>0&&(v=n.y,y=v+t);},P=function(){var t=C/a;r===Direction.VERTICAL?(g=n.x-.5*t,m=n.x+.5*t):e.x<0?(m=n.x,g=m-t):e.x>0&&(g=n.x,m=g+t);};m<R&&(m=R,g=R-A,a&&L()),g>_&&(g=_,m=_+A,a&&L()),v>w&&(v=w,y=w+C,a&&P()),y<I&&(y=I,v=I-C,a&&P());var G=l.width,k=l.height;if(a&&(a<1?G=k/a:k=G*a),m-g>G&&(e.x<0?g=n.x-G:m=n.x+G),y-v>k&&(e.y<0?v=n.y-k:y=n.y+k),m-g==0&&(e.x>0?m=n.x+2:g=n.x-2),y-v==0&&(e.y>0?y=n.y+2:v=n.y-2),Math.round(g)<u||Math.round(m)>s||Math.round(v)<d||Math.round(y)>p){var D=p-d,V=s-u;if(g<u){g=u;var U=Math.min(m-g,V);m=g+U;}if(m>s){m=s;var B=Math.min(m-g,V);g=m-B;}if(v<d){v=d;var N=Math.min(y-v,D);y=v+N;}if(y>p){y=p;var F=Math.min(y-v,D);v=y-F;}M=rectFromBounds({top:v,right:m,bottom:y,left:g});}return {free:M,limited:rectFromBounds({top:v,right:m,bottom:y,left:g})}},CornerMap={nw:function(e){return {x:e.x,y:e.y}},ne:function(e){return {x:e.x+e.width,y:e.y}},se:function(e){return {x:e.x+e.width,y:e.y+e.height}},sw:function(e){return {x:e.x,y:e.y+e.height}}},getCornerCoordinates=function(e,t){return CornerMap[e](t)},getCornerTargetRect=function(e,t,r,n,i,o,a){var c=rectBounds(n),l=c.left,u=c.right,s=c.top,d=c.bottom,p=vectorLimit({x:t.x,y:t.y},n),f=e.x>0?r.x:Math.min(p.x,r.x),h=e.x>0?Math.max(r.x,p.x):r.x,g=e.y>0?r.y:Math.min(p.y,r.y),m=e.y>0?Math.max(r.y,p.y):r.y;if(i){var v=p.x-r.x;e.x>0?h=Math.max(r.x,r.x+e.x*v):f=Math.min(r.x,r.x-e.x*v),e.y>0?m=Math.max(r.y,r.y+e.x*v*i):g=Math.min(r.y,r.y-e.x*v*i);}var y=rectFromBounds({top:g,right:h,bottom:m,left:f});rectFromBounds({top:g,right:h,bottom:m,left:f});if(o.width&&o.height){var E=o.width,T=o.height;i&&(1===i?T=E=Math.max(E,T):E<T?E=T/i:E>T?T=E*i:E=T/i),h-f<E&&(e.x>0?h=r.x+E:f=r.x-E),m-g<T&&(e.y>0?m=r.y+T:g=r.y-T);var _=a.width,R=a.height;i&&(i<1?_=R/i:R=_*i),h-f>_&&(e.x<0?f=r.x-_:h=r.x+_),m-g>R&&(e.y<0?g=r.y-R:m=r.y+R);}if(h-f==0&&(e.x>0?h=r.x+2:f=r.x-2),m-g==0&&(e.y>0?m=r.y+2:g=r.y-2),Math.round(f)<l||Math.round(h)>u||Math.round(g)<s||Math.round(m)>d){var w=d-s,I=u-l;if(f<l){f=l;var A=Math.min(h-f,I);h=f+A,i&&(e.y>0&&(m=r.y+A*i),e.y<0&&(g=r.y-A*i));}if(h>u){h=u;var C=Math.min(h-f,I);f=h-C,i&&(e.y>0&&(m=r.y+C*i),e.y<0&&(g=r.y-C*i));}if(g<s){g=s;var S=Math.min(m-g,w);m=g+S,i&&(e.x>0&&(h=r.x+S/i),e.x<0&&(f=r.x-S/i));}if(m>d){m=d;var O=Math.min(m-g,w);g=m-O,i&&(e.x>0&&(h=r.x+O/i),e.x<0&&(f=r.x-O/i));}y=rectFromBounds({top:g,right:h,bottom:m,left:f});}return {free:y,limited:rectFromBounds({top:g,right:h,bottom:m,left:f})}},getTargetRect=function(e,t,r){var n=rectClone(e);return n.width=Math.min(n.height,n.width),n.height=n.width,n.height=n.width*t,n.height<r.height&&(n.height=r.height,n.width=n.height/t),n.width<r.width&&(n.width=r.width,n.height=n.width*t),n},TURN=Math.PI/2,PI_QUARTER=Math.PI/4,splitRotation=function(e){var t=roundFloat(PI_QUARTER),r=roundFloat(TURN),n=e/r,i=Math.floor(n)*r,o=e-i;return o>t&&(o-=r,i+=r),{main:i,sub:o}},getImageSize=function(e){return new Promise(function(t,r){var n=new Image;n.src=URL.createObjectURL(e),n.onerror=function(e){clearInterval(i),r(e);};var i=setInterval(function(){n.naturalWidth&&n.naturalHeight&&(clearInterval(i),URL.revokeObjectURL(n.src),t({width:n.naturalWidth,height:n.naturalHeight}));},1);})},scaleImageSize=function(e,t){var r={width:e.width,height:e.height};if(e.width>t.width||e.height>t.height){var n=e.height/e.width,i=t.width/e.width,o=t.height/e.height;i<o?(r.width=e.width*i,r.height=r.width*n):(r.height=e.height*o,r.width=r.height/n);}return r},leftPad=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"";return (t+e).slice(-t.length)},getDateString=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:new Date;return "".concat(e.getFullYear(),"-").concat(leftPad(e.getMonth()+1,"00"),"-").concat(leftPad(e.getDate(),"00"),"_").concat(leftPad(e.getHours(),"00"),"-").concat(leftPad(e.getMinutes(),"00"),"-").concat(leftPad(e.getSeconds(),"00"))},getBaseCropInstructions=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{},n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:{},i=e("GET_CROP_ASPECT_RATIO"),o={center:{x:.5,y:.5},flip:{horizontal:!1,vertical:!1},zoom:1,rotation:0,aspectRatio:null};r?Object.assign(o,r):t.options.crop?Object.assign(o,t.options.crop):o.aspectRatio=i;var a=n.width,c=n.height;if(a&&c)o.aspectRatio=c/a;else if(t.instructions.size){var l=t.instructions.size,u=l.width,s=l.height;u&&s&&(o.aspectRatio=s/u);}return o},capitalizeFirstLetter=function(e){return e.charAt(0).toUpperCase()+e.slice(1)},getExtensionFromFilename=function(e){return e.split(".").pop()},guesstimateExtension=function(e){if("string"!=typeof e)return "";var t=e.split("/").pop();return /svg/.test(t)?"svg":/zip|compressed/.test(t)?"zip":/plain/.test(t)?"txt":/msword/.test(t)?"doc":/[a-z]+/.test(t)?"jpeg"===t?"jpg":t:""},getFileFromBlob=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:null,n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:null,i="string"==typeof r?e.slice(0,e.size,r):e.slice(0,e.size,e.type);return i.lastModifiedDate=new Date,isString(t)||(t=getDateString()),t&&null===n&&getExtensionFromFilename(t)?i.name=t:(n=n||guesstimateExtension(i.type),i.name=t+(n?"."+n:"")),i},getFilenameWithoutExtension=function(e){return e.substr(0,e.lastIndexOf("."))||e},ExtensionMap={jpeg:"jpg","svg+xml":"svg"},renameFileToMatchMimeType=function(e,t){var r=getFilenameWithoutExtension(e),n=t.split("/")[1],i=ExtensionMap[n]||n;return "".concat(r,".").concat(i)},getValidOutputMimeType=function(e){return /jpeg|png|svg\+xml/.test(e)?e:"image/jpeg"},isColorMatrix=function(e){return Array.isArray(e)&&20===e.length},MARKUP_RECT=["x","y","left","top","right","bottom","width","height"],toOptionalFraction=function(e){return "string"==typeof e&&/%/.test(e)?parseFloat(e)/100:e},getUniqueId$2=function(){return Math.random().toString(36).substr(2,9)},prepareMarkup=function(e){var t=_slicedToArray(e,2),r=t[0],n=t[1],i=!1!==n.allowSelect,o=!1!==n.allowMove,a=!1!==n.allowResize,c=!1!==n.allowInput,l=!1!==n.allowDestroy,u=void 0===n.allowEdit||n.allowEdit;(!0===n.allowResize||!0===n.allowMove||!0===n.allowInput||n.allowEdit)&&(i=!0),!1===n.allowMove&&(a=!1),!0===n.allowResize&&(o=!0);var s=n.points?{}:MARKUP_RECT.reduce(function(e,t){return e[t]=toOptionalFraction(n[t]),e},{});return n.points&&(a=!1),[r,_objectSpread({zIndex:0,id:getUniqueId$2()},n,s,{isDestroyed:!1,isSelected:!1,isDirty:!0,allowDestroy:l,allowSelect:i,allowMove:o,allowResize:a,allowInput:c,allowEdit:u})]},getFilenameFromHeader=function(e){if(!e)return null;var t=e.split(/filename=|filename\*=.+''/).splice(1).map(function(e){return e.trim().replace(/^["']|[;"']{0,2}$/g,"")}).filter(function(e){return e.length});return t.length?decodeURI(t[t.length-1]):null},brightness=function(e){return [1,0,0,0,e,0,1,0,0,e,0,0,1,0,e,0,0,0,1,0]},contrast=function(e){return [e,0,0,0,.5*(1-e),0,e,0,0,.5*(1-e),0,0,e,0,.5*(1-e),0,0,0,1,0]},saturation=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:0;return [.213+.787*e,.715-.715*e,.072-.072*e,0,0,.213-.213*e,.715+.285*e,.072-.072*e,0,0,.213-.213*e,.715-.715*e,.072+.928*e,0,0,0,0,0,1,0]},exposure=function(e){return [e,0,0,0,0,0,e,0,0,0,0,0,e,0,0,0,0,0,1,0]},COLOR_TOOLS={contrast:contrast,exposure:exposure,brightness:brightness,saturation:saturation},getColorProperty=function(e){return e.borderWidth?"borderColor":e.lineWidth?"lineColor":e.fontColor?"fontColor":e.backgroundColor?"backgroundColor":void 0},getColor=function(e){var t=e.fontColor,r=e.backgroundColor,n=e.lineColor,i=e.borderColor;return t||r||n||i},TURN$1=Math.PI/2,getOutputSize=function(e){var t={upscale:e("GET_OUTPUT_UPSCALE"),mode:e("GET_OUTPUT_FIT"),width:e("GET_OUTPUT_WIDTH"),height:e("GET_OUTPUT_HEIGHT")},r=e("GET_SIZE_INPUT");if(e("ALLOW_MANUAL_RESIZE")&&(r.width||r.height)){var n=r.width,i=r.height,o=e("GET_CROP_RECTANGLE_ASPECT_RATIO");n&&!i?i=n/o:i&&!n&&(n=i*o),t.width=n,t.height=i,t.upscale=!0,t.mode="force";}return t},getPreparedImageSize=function(e,t){var r=t("GET_UID"),n=t("GET_CROP",r,Date.now()),i={width:n.cropStatus.currentWidth,height:n.cropStatus.currentHeight},o=e.mode,a=e.width,c=e.height,l=e.upscale;if(!a&&!c)return i;if(null===a?a=c:null===c&&(c=a),"force"!==o){var u=a/i.width,s=c/i.height,d=1;if("cover"===o?d=Math.max(u,s):"contain"===o&&(d=Math.min(u,s)),d>1&&!1===l)return i;a=i.width*d,c=i.height*d;}return {width:Math.round(a),height:Math.round(c)}},getActiveMarkupFromState=function(e){return e.markup.filter(function(e){return !e[1].isDestroyed})},prepareOutput=function(e,t,r){return new Promise(function(n,i){var o={data:null,file:null},a=getCropFromStateRounded(t.image,t.crop),c=getOutputSize(r),l={crop:a,image:_objectSpread({},getPreparedImageSize(c,r),{orientation:t.file.orientation}),size:c,output:{type:r("GET_OUTPUT_TYPE"),quality:r("GET_OUTPUT_QUALITY"),background:t.options.outputCanvasBackgroundColor},filter:t.colorMatrices.filter?{id:t.filterName,value:t.filterValue,matrix:t.colorMatrices.filter}:null,color:Object.keys(t.colorValues).length?Object.keys(t.colorValues).reduce(function(e,r){return e[r]={value:t.colorValues[r],matrix:t.colorMatrices[r].map(function(e){return roundFloat(e,5)})},e},{}):null,markup:getActiveMarkupFromState(t).map(function(e){return [e[0],_objectSpread({},e[1])]}),colorMatrix:r("GET_COLOR_MATRIX")};if(e.data&&(o.data=l),e.file){var u={beforeCreateBlob:r("GET_BEFORE_CREATE_BLOB"),afterCreateBlob:r("GET_AFTER_CREATE_BLOB"),stripImageHead:r("GET_OUTPUT_STRIP_IMAGE_HEAD"),canvasMemoryLimit:r("GET_OUTPUT_CANVAS_MEMORY_LIMIT")},s=t.file.data,d=_objectSpread({},l,{filter:l.colorMatrix,markup:l.markup});transformImage(s,d,u).then(function(e){o.file=getFileFromBlob(e,renameFileToMatchMimeType(s.name,getValidOutputMimeType(e.type))),n(o);}).catch(i);}else n(o);})},resetRotationScale=function(e){e.crop.draft.rotateMinScale=null;},storeRotationScale=function(e){e.crop.draft.rotateMinScale||(e.crop.draft.rotateMinScale=e.crop.transforms.scale);},rotate=function(e,t,r){var n=arguments.length>3&&void 0!==arguments[3]&&arguments[3],i=!(arguments.length>4&&void 0!==arguments[4])||arguments[4];storeRotationScale(e);var o=_objectSpread({},e.crop.transforms,{scale:e.crop.draft.rotateMinScale});e.crop.draft.transforms=getRotateTransforms(e.image,e.crop.rectangle,o,t.main+t.sub,r,e.crop.draft.transforms?e.crop.draft.transforms.rotation:e.crop.rotation.main+e.crop.rotation.sub,n,i),e.crop.rotation=splitRotation(e.crop.draft.transforms.rotation);},reset=function(e,t,r){if(null!==e.stage){clearCenterTimeout(e),e.size.width=!!e.instructions.size&&e.instructions.size.width,e.size.height=!!e.instructions.size&&e.instructions.size.height,e.size.aspectRatioLocked=!0,e.size.aspectRatioPrevious=!1;var n=void 0===e.instructions.crop.scaleToFit?void 0===e.crop.limitToImageBounds?e.options.cropLimitToImageBounds:e.crop.limitToImageBounds:e.instructions.crop.scaleToFit,i=t("GET_STAGE_RECT",e.instructions.crop);e.crop.rectangle=getCenteredCropRect(i.fits?i:e.stage,e.instructions.crop.aspectRatio||e.image.aspectRatio),e.crop.draft.rectangle=null,"stage"!==i.mode&&i.fits&&(e.crop.rectangle.x=i.x,e.crop.rectangle.y=i.y),e.crop.transforms=getImageTransformsFromCrop(e.instructions.crop,i,e.image,n),e.crop.draft.transforms=null,e.crop.rotation=splitRotation(e.instructions.crop.rotation),e.crop.flip=_objectSpread({},e.instructions.crop.flip);var o=t("GET_CROP_ASPECT_RATIO_OPTIONS")||[],a=o.map(function(e){return e.value.aspectRatio}).find(function(t){return t===e.instructions.crop.aspectRatio}),c=o.find(function(e){return null===e.value.aspectRatio});a?e.crop.aspectRatio=a:c&&o.length?e.crop.aspectRatio=null:e.crop.aspectRatio=t("GET_CROP_ASPECT_RATIO"),e.crop.isDirty=!1,e.instructions.markup&&r("MARKUP_SET_VALUE",{value:e.instructions.markup.map(prepareMarkup).sort(sortMarkupByZIndex)}),r("CROP_SET_LIMIT",{value:n,silent:!0}),Object.keys(e.instructions.color).forEach(function(t){return r("COLOR_SET_VALUE",{key:t,value:e.instructions.color[t]})}),r("FILTER_SET_VALUE",{value:e.instructions.filter}),resetRotationScale(e);}},recenter=function(e,t){if(e.stage){clearCenterTimeout(e);var r=e.crop.rectangle,n=r.height/r.width,i=e.crop.aspectRatio;if(null!==i&&roundFloat(n,3)!==roundFloat(i,3)){var o=t("GET_MIN_CROP_SIZE");o.width=roundFloat(o.width),o.height=roundFloat(o.height);var a=Math.min(r.width,r.height);Math.min(a*i,a/i)<Math.max(o.width,o.height)&&(e.crop.rectangle=getTargetRect(_objectSpread({},e.crop.rectangle),i,o),e.crop.draft.transforms=getImageTransformsFromRect(e.image,e.crop.rectangle,e.crop.transforms));}var c=e.crop.draft.transforms||e.crop.transforms,l=getCropFromView(e.image,e.crop.rectangle,c,e.crop.limitToImageBounds);e.crop.aspectRatio&&(l.aspectRatio=e.crop.aspectRatio);var u=t("GET_STAGE_RECT",l);e.crop.transforms=getImageTransformsFromCrop(l,u,e.image,l.scaleToFit),e.crop.draft.transforms=null;var s=e.crop.aspectRatio||e.crop.rectangle.height/e.crop.rectangle.width;e.crop.rectangle=getCenteredCropRect(u,s),e.crop.draft.rectangle=null,"stage"!==u.mode&&(e.crop.rectangle.x+=u.x,e.crop.rectangle.y+=u.y),resetRotationScale(e);}},startCenterTimeout=function(e,t,r){var n=t("GET_CROP_ZOOM_TIMEOUT");n&&(clearTimeout(e.zoomTimeoutId),e.zoomTimeoutId=setTimeout(function(){r("CROP_ZOOM");},n));},resetCenterTimeout=function(e,t,r){clearCenterTimeout(e),startCenterTimeout(e,t,r);},clearCenterTimeout=function(e){clearTimeout(e.zoomTimeoutId);},confirmCropDraft=function(e){e.crop.rectangle=e.crop.draft.rectangle.limited,e.crop.draft.rectangle=null,confirmImageDraft(e),resetRotationScale(e);},copyConfirmed=function(e){e.crop.draft.transforms=copyImageTransforms(e.crop.transforms),e.crop.draft.rectangle={limited:rectClone(e.crop.rectangle),free:rectClone(e.crop.rectangle)},clearCenterTimeout(e);},getMinScale=function(e,t){return Math.min(e.width/t.width,e.height/t.height)},getRotateTransforms=function(e,t,r,n,i,o,a,c){var l=_objectSpread({},copyImageTransforms(r),{rotation:n}),u=c?limitImageTransformsToCropRect(e,t,l,"rotating"):l,s=getMinScale(t,i);return roundFloat(u.scale,5)>roundFloat(s,5)?(a&&(o+=2*a),_objectSpread({},copyImageTransforms(r),{rotation:o,interaction:{rotation:u.rotation}})):(u.scale=Math.min(s,u.scale),u.interaction={rotation:u.rotation},u)},getResizeTransforms=function(e,t,r,n,i,o){var a=Math.max(1e-10,n),c=_objectSpread({},copyImageTransforms(r),{scale:a}),l=o?limitImageTransformsToCropRect(e,t,c,"resizing"):c,u=getMinScale(t,i);return l.scale=Math.min(u,l.scale),l.interaction={scale:a},l},getTranslateTransforms=function(e,t,r,n,i){var o={x:r.translation.x+n.x,y:r.translation.y+n.y},a=_objectSpread({},copyImageTransforms(r),{translation:o}),c=i?limitImageTransformsToCropRect(e,t,a,"moving"):a;return c.interaction={translation:o},c},correctCropRectangleByResize=function(e,t){var r=roundFloat(e.crop.draft.transforms.scale,5);if(!(roundFloat(e.crop.draft.targetSize,5)<r))return !1;if(null!==e.crop.aspectRatio)return !1;if(!1===e.crop.limitToImageBounds)return !1;if(0!==roundFloat(e.crop.rotation.sub,5))return !1;var n=!(roundFloat(e.crop.rotation.main/TURN$1,5)%2==0)?e.image.width/e.image.height:e.image.height/e.image.width;if(n===e.crop.rectangle.height/e.crop.rectangle.width)return !1;var i=e.stage.x+.5*e.stage.width,o=e.stage.y+.5*e.stage.height,a=e.crop.rectangle.x+.5*e.crop.rectangle.width,c=e.crop.rectangle.y+.5*e.crop.rectangle.height;if(a!==i||c!==o)return !1;var l=t("GET_STAGE_RECT");return e.crop.rectangle=getCenteredCropRect(l,n),"stage"!==l.mode&&(e.crop.rectangle.x+=l.x,e.crop.rectangle.y+=l.y),e.crop.transforms=getImageTransformsFromCrop({center:{x:.5,y:.5},rotation:e.crop.transforms.rotation,zoom:1,aspectRatio:n},l,e.image,!0),e.crop.draft.transforms=null,!0},confirmImageDraft=function(e){e.crop.draft.rectangle=null,e.crop.transforms=e.crop.draft.transforms||e.crop.transforms,e.crop.transforms.interaction=null,e.crop.draft.transforms=null,e.crop.transforms=_objectSpread({},e.crop.transforms,getTransformOrigin(e.image,e.crop.rectangle,e.crop.transforms)),e.crop.isRotating=!1,e.crop.isDirty=!0;},getResponseHeaderSilent=function(e,t){return e.getAllResponseHeaders().indexOf(t)>=0?e.getResponseHeader("Content-Disposition"):null},loadImageFromURL=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=t.progress,n=void 0===r?function(e){}:r,i=t.load,o=void 0===i?function(e,t){}:i,a=t.error,c=void 0===a?function(){}:a,l=new XMLHttpRequest;l.onprogress=function(e){return n(e.lengthComputable?e.loaded/e.total:null)},l.onerror=function(){return c(l)},l.onload=function(){var e=l.response;if(!e)return c(l);var t=l.getResponseHeader("Content-Type"),r=getResponseHeaderSilent(l,"Content-Disposition"),n=r?getFilenameFromHeader(r):null,i=getResponseHeaderSilent(l,"Content-Doka"),a=null;if(i)try{a=JSON.parse(i);}catch(e){}!e.type.length&&t&&(_readOnlyError("blob"),e=e.slice(0,e.size,t)),n&&(e.name=n),o(e,a);},l.open("GET",e),l.responseType="blob",l.send();},loadImage$1=function(e,t){var r=t.progress;return new Promise(function(t,n){if(isString(e))loadImageFromURL(e,{progress:/^data:/.test(e)?function(){}:r,error:n,load:function(e,r){return t({file:e,fileInstructions:r})}});else if(e instanceof Blob)t({file:e});else{if("IMG"===e.nodeName){var i=function(e){var r=document.createElement("canvas");r.width=e.naturalWidth,r.height=e.naturalHeight,r.getContext("2d").drawImage(e,0,0),r.toBlob(function(e){return t({file:e})});};return e.complete?void i(e):void(e.onload=function(){return i(e)})}"CANVAS"!==e.nodeName?n(e):e.toBlob(function(e){return t({file:e})});}})},shouldAbortImageLoad=function(e){return !1===e.file},actions=function(e,t,r){return _objectSpread({SET_UID:function(e){var t=e.id;r.uid=t;},AWAIT_IMAGE:function(){r.file||(r.noImageTimeout=setTimeout(function(){e("AWAITING_IMAGE");},250));},REQUEST_REMOVE_IMAGE:function(){e("UNLOAD_IMAGE"),r.file=!1,r.noImageTimeout=setTimeout(function(){e("AWAITING_IMAGE");},500);},DID_UNLOAD_IMAGE:function(){e("ABORT_IMAGE");},REQUEST_ABORT_IMAGE:function(t){e("UNLOAD_IMAGE"),r.file=!1,r.queuedFile=t;},DID_SET_SRC:function(t){t.value!==t.prevValue&&(clearTimeout(r.noImageTimeout),e("REQUEST_LOAD_IMAGE",{source:t.value}));},ABORT_IMAGE:function(){if(r.file=null,r.queuedFile){var t=r.queuedFile;r.queuedFile=null,e("REQUEST_LOAD_IMAGE",t);}},REQUEST_LOAD_IMAGE:function(t){var n=t.source,i=t.success,o=void 0===i?function(){}:i,a=t.failure,c=void 0===a?function(e){}:a,l=t.options,u=t.resolveOnConfirm,s=void 0!==u&&u;if(clearTimeout(r.noImageTimeout),!n)return c("no-image-source");null===r.file?(resetState(r),r.file={uid:getUniqueId()},e("DID_REQUEST_LOAD_IMAGE",{source:n}),loadImage$1(n,{progress:function(t){return null!==t&&e("DID_MAKE_PROGRESS",{progress:t})}}).then(function(t){var n=t.file,i=t.fileInstructions;if(!l&&i){var a=i.crop,u=i.filter,d=i.colorMatrix,p=i.color,f=i.markup,h=i.size;l={crop:a,filter:u?u.id||u.matrix:d,color:p,markup:f,size:h};}if(shouldAbortImageLoad(r))return e("ABORT_IMAGE");n.name||(n.name=getDateString()),r.file.orientation=-1,r.file.data=n,e("LOAD_IMAGE",{success:o,failure:c,options:l,resolveOnConfirm:s},!0),e("KICK");}).catch(function(t){if(shouldAbortImageLoad(r))return e("ABORT_IMAGE");e("DID_LOAD_IMAGE_ERROR",{error:{status:"IMAGE_LOAD_ERROR",data:t}}),c(t);})):e("REQUEST_ABORT_IMAGE",{source:n,success:o,failure:c,options:l,resolveOnConfirm:s});},LOAD_IMAGE:function(n){var i=n.success,o=n.failure,a=n.options,c=void 0===a?{}:a,l=n.resolveOnConfirm;if(shouldAbortImageLoad(r))return e("ABORT_IMAGE");var u=r.file.data;Promise.all([getImageSize(u),getImageOrientation(u)]).then(function(n){var a=_slicedToArray(n,2),u=a[0],s=a[1];if(shouldAbortImageLoad(r))return e("ABORT_IMAGE");if(r.file.orientation=t("GET_OUTPUT_CORRECT_IMAGE_EXIF_ORIENTATION")?s:-1,r.file.orientation>-1){var d=u.width,p=u.height;s>=5&&s<=8&&(u.width=p,u.height=d);}var f=t("GET_MIN_IMAGE_SIZE");if(u.width<f.width||u.height<f.height)return e("DID_LOAD_IMAGE_ERROR",{error:{status:"IMAGE_MIN_SIZE_VALIDATION_ERROR",data:{size:u,minImageSize:f}}}),resetState(r),void o();var h=scaleImageSize(u,{width:t("GET_MAX_IMAGE_PREVIEW_WIDTH"),height:t("GET_MAX_IMAGE_PREVIEW_HEIGHT")});if(r.image={x:0,y:0,width:h.width,height:h.height,naturalWidth:u.width,naturalHeight:u.height,aspectRatio:u.height/u.width},t("ALLOW_MANUAL_RESIZE")&&c.size&&(r.size.width=c.size.width,r.size.height=c.size.height,r.size.aspectRatioLocked=!0,r.size.aspectRatioPrevious=!1,r.instructions.size={width:c.size.width,height:c.size.height}),r.instructions.crop=getBaseCropInstructions(t,r,c.crop?_objectSpread({},c.crop):null,r.size),r.crop.limitToImageBounds=r.options.cropLimitToImageBounds,!1===r.instructions.crop.scaleToFit&&(r.crop.limitToImageBounds=r.instructions.crop.scaleToFit),void 0===c.filter)r.instructions.filter=r.options.filter;else{var g=c.filter;r.instructions.filter=null===g?g:g.id||g.matrix||g;}var m=r.options.markup||[];r.instructions.markup=m.concat(c.markup||[]),r.instructions.color=Object.keys(COLOR_TOOLS).reduce(function(e,t){return e[t]=c.color&&void 0!==c.color[t]?"number"==typeof c.color[t]?c.color[t]:c.color[t].value:r.options["color".concat(capitalizeFirstLetter(t))],e},{}),e("DID_LOAD_IMAGE",{image:_objectSpread({size:r.file.data.size,name:r.file.data.name,type:r.file.data.type,orientation:s},u)}),r.filePromise={resolveOnConfirm:l,success:i,failure:o};}).catch(function(t){if(shouldAbortImageLoad(r))return e("ABORT_IMAGE");e("DID_LOAD_IMAGE_ERROR",{error:{status:"IMAGE_UNKNOWN_ERROR",data:t}}),resetState(r),o();});},CHANGE_VIEW:function(t){var n=t.id;r.activeView=n,e("SHOW_VIEW",{id:n});},UPDATE_ROOT_RECT:function(e){var t=e.rect;r.rootRect=t;},DID_RESIZE_STAGE:function(n){var i=n.size,o=n.offset,a=n.animate,c=null===r.stage;if(r.stage=createRect(0,0,i.width,i.height),r.stageOffset=createVector(o.x,o.y),!t("GET_ALLOW_PREVIEW_FIT_TO_VIEW")){var l=t("GET_IMAGE_STAGE_RECT");r.stage=createRect(0,0,l.width,l.height),r.stageOffset=createVector(r.stageOffset.x+l.x,r.stageOffset.y+l.y);}if(c){if(reset(r,t,e),!r.filePromise.resolveOnConfirm){var u=getCropFromStateRounded(r.image,r.crop),s=getOutputSize(t);r.filePromise.success({crop:u,image:{orientation:r.file.orientation},size:s,output:{type:t("GET_OUTPUT_TYPE"),quality:t("GET_OUTPUT_QUALITY")}});}}else r.instantUpdate=!a,recenter(r,t),setTimeout(function(){r.instantUpdate=!1;},16);},RESIZE_SET_OUTPUT_SIZE_ASPECT_RATIO_LOCK:function(e){var t=e.value;r.size.aspectRatioLocked=t;},RESIZE_SET_OUTPUT_SIZE:function(n){var i=n.width,o=n.height,a=limitSize({width:i=i||null,height:o=o||null},t("GET_SIZE_MIN"),t("GET_SIZE_MAX"),t("GET_CROP_RECTANGLE_ASPECT_RATIO"));if(r.size.width=a.width?Math.round(a.width):null,r.size.height=a.height?Math.round(a.height):null,i&&o){var c=o/i;if(c===r.crop.aspectRatio)return;!1===r.size.aspectRatioPrevious&&(r.size.aspectRatioPrevious=r.crop.aspectRatio),e("CROP_SET_ASPECT_RATIO",{value:c});}else!1!==r.size.aspectRatioPrevious&&(e("CROP_SET_ASPECT_RATIO",{value:r.size.aspectRatioPrevious}),r.size.aspectRatioPrevious=!1);},CROP_SET_ASPECT_RATIO:function(e){var n=e.value;if(clearCenterTimeout(r),r.crop.aspectRatio=isString(n)?getNumericAspectRatioFromString(n):n,r.crop.aspectRatio&&recenter(r,t),r.crop.isDirty=!0,r.size.width&&r.size.height)if(r.crop.aspectRatio){var i=r.size.width*r.crop.aspectRatio,o=limit(i,t("GET_SIZE_MIN").height,t("GET_SIZE_MAX").height);r.size.height=o,r.size.width=o/r.crop.aspectRatio;}else r.size.height=null;},DID_SET_CROP_ASPECT_RATIO:function(t){var r=t.value,n=t.prevValue;getNumericAspectRatioFromString(r)!==getNumericAspectRatioFromString(n)&&e("CROP_SET_ASPECT_RATIO",{value:r});},CROP_ZOOM:function(){r.stage&&(clearCenterTimeout(r),recenter(r,t));},DID_SET_CROP_LIMIT_TO_IMAGE_BOUNDS:function(t){var n=t.value,i=t.prevValue;r.crop.limitToImageBounds=n,!1===i&&n&&e("CROP_ENABLED_LIMIT_TO_IMAGE_BOUNDS");},CROP_ENABLED_LIMIT_TO_IMAGE_BOUNDS:function(){var e=r.stage,n=r.image,i=r.crop.rectangle.height/r.crop.rectangle.width,o=getCenteredCropRect(e,i);r.crop.rectangle=o,r.crop.transforms=limitImageTransformsToCropRect(n,r.crop.rectangle,r.crop.transforms,"moving"),r.crop.transforms=limitImageTransformsToCropRect(n,r.crop.rectangle,r.crop.transforms,"resizing"),r.crop.transforms=limitImageTransformsToCropRect(n,r.crop.rectangle,r.crop.transforms,"rotating"),r.crop.draft.rectangle=null,r.crop.draft.transforms=null,recenter(r,t);},CROP_SET_LIMIT:function(t){var n=t.value,i=t.silent,o=void 0!==i&&i,a=r.crop.limitToImageBounds!==n;r.crop.limitToImageBounds=n,a&&!o&&(r.crop.isDirty=!0),a&&n&&e("CROP_ENABLED_LIMIT_TO_IMAGE_BOUNDS");},CROP_IMAGE_RESIZE_GRAB:function(){copyConfirmed(r),clearCenterTimeout(r);},CROP_IMAGE_ROTATE_GRAB:function(){copyConfirmed(r),clearCenterTimeout(r),r.crop.isRotating=!0;},CROP_RECT_DRAG_GRAB:function(){copyConfirmed(r),clearCenterTimeout(r);},CROP_RECT_DRAG_RELEASE:function(){confirmCropDraft(r),startCenterTimeout(r,t,e);},CROP_RECT_EDGE_DRAG:function(e){var n=e.offset,i=e.origin,o=e.anchor,a=r.image,c=r.stage,l=/n|s/.test(i)?Direction.VERTICAL:Direction.HORIZONTAL,u=getEdgeCenterCoordinates(i,r.crop.rectangle),s=getEdgeCenterCoordinates(o,r.crop.rectangle),d=vectorLimit({x:u.x+(l===Direction.HORIZONTAL?n.x:0),y:u.y+(l===Direction.VERTICAL?n.y:0)},c),p=t("GET_MIN_CROP_SIZE"),f=t("GET_MAX_CROP_SIZE");p.width=roundFloat(p.width),p.height=roundFloat(p.height);var h=getMinScale(r.crop.rectangle,t("GET_MIN_PREVIEW_IMAGE_SIZE"))/(r.crop.draft.transforms.scale||r.crop.transforms.scale);f.width=roundFloat(f.width*h),f.height=roundFloat(f.height*h);var g={x:Math.sign(u.x-s.x),y:Math.sign(u.y-s.y)};r.crop.draft.rectangle=getEdgeTargetRect(g,d,l,s,rectBounds(r.crop.rectangle),rectBounds(c),r.crop.aspectRatio,p,f),r.crop.limitToImageBounds&&(r.crop.draft.transforms=getImageTransformsFromRect(a,r.crop.draft.rectangle.limited,r.crop.transforms));},CROP_RECT_CORNER_DRAG:function(e){var n=e.offset,i=e.origin,o=e.anchor,a=r.image,c=r.stage,l=getCornerCoordinates(i,r.crop.rectangle),u=getCornerCoordinates(o,r.crop.rectangle),s={x:l.x+n.x,y:l.y+n.y},d=t("GET_MIN_CROP_SIZE"),p=t("GET_MAX_CROP_SIZE");d.width=roundFloat(d.width),d.height=roundFloat(d.height);var f=getMinScale(r.crop.rectangle,t("GET_MIN_PREVIEW_IMAGE_SIZE"))/(r.crop.draft.transforms.scale||r.crop.transforms.scale);p.width=roundFloat(p.width*f),p.height=roundFloat(p.height*f);var h={x:Math.sign(l.x-u.x),y:Math.sign(l.y-u.y)};r.crop.draft.rectangle=getCornerTargetRect(h,s,u,c,r.crop.aspectRatio,d,p),r.crop.limitToImageBounds&&(r.crop.draft.transforms=getImageTransformsFromRect(a,r.crop.draft.rectangle.limited,r.crop.transforms));},CROP_IMAGE_DRAG_GRAB:function(){return copyConfirmed(r)||clearCenterTimeout(r)},CROP_IMAGE_DRAG_RELEASE:function(){confirmImageDraft(r),resetRotationScale(r),startCenterTimeout(r,t,e);},CROP_IMAGE_ROTATE_RELEASE:function(){confirmImageDraft(r),startCenterTimeout(r,t,e);},CROP_IMAGE_DRAG:function(e){var t=e.value;clearCenterTimeout(r),r.crop.draft.transforms=getTranslateTransforms(r.image,r.crop.rectangle,r.crop.transforms,t,r.crop.limitToImageBounds);},CROP_IMAGE_RESIZE_RELEASE:function(){t("GET_CROP_RESIZE_MATCH_IMAGE_ASPECT_RATIO")&&correctCropRectangleByResize(r,t),confirmImageDraft(r),resetRotationScale(r),startCenterTimeout(r,t,e);},CROP_IMAGE_RESIZE:function(e){var n=e.value;clearCenterTimeout(r);var i=r.crop.transforms;r.crop.draft.targetSize=i.scale+i.scale*n,r.crop.draft.transforms=getResizeTransforms(r.image,r.crop.rectangle,i,r.crop.draft.targetSize,t("GET_MIN_PREVIEW_IMAGE_SIZE"),r.crop.limitToImageBounds);},CROP_IMAGE_RESIZE_MULTIPLY:function(e){var n=e.value;clearCenterTimeout(r);var i=r.crop.transforms;r.crop.draft.targetSize=i.scale*n,r.crop.draft.transforms=getResizeTransforms(r.image,r.crop.rectangle,i,r.crop.draft.targetSize,t("GET_MIN_PREVIEW_IMAGE_SIZE"),r.crop.limitToImageBounds);},CROP_IMAGE_RESIZE_AMOUNT:function(e){var n=e.value;clearCenterTimeout(r);var i=r.crop.transforms;r.crop.draft.targetSize=(r.crop.draft.transforms?r.crop.draft.transforms.scale:i.scale)+n,r.crop.draft.transforms=getResizeTransforms(r.image,r.crop.rectangle,i,r.crop.draft.targetSize,t("GET_MIN_PREVIEW_IMAGE_SIZE"),r.crop.limitToImageBounds);},CROP_IMAGE_ROTATE:function(e){var n=e.value;clearCenterTimeout(r),r.crop.isRotating=!0,rotate(r,{main:r.crop.rotation.main,sub:n},t("GET_MIN_PREVIEW_IMAGE_SIZE"),!1,r.crop.limitToImageBounds);},CROP_IMAGE_ROTATE_ADJUST:function(e){var n=e.value;clearCenterTimeout(r),rotate(r,{main:r.crop.rotation.main,sub:Math.min(Math.PI/4,Math.max(-Math.PI/4,r.crop.rotation.sub+n))},t("GET_MIN_PREVIEW_IMAGE_SIZE"),!1,r.crop.limitToImageBounds),confirmImageDraft(r);},CROP_IMAGE_ROTATE_CENTER:function(){clearCenterTimeout(r),rotate(r,{main:r.crop.rotation.main,sub:0},t("GET_MIN_PREVIEW_IMAGE_SIZE"),!1,r.crop.limitToImageBounds),confirmImageDraft(r);},CROP_IMAGE_ROTATE_LEFT:function(){resetCenterTimeout(r,t,e),rotate(r,{main:r.crop.rotation.main-TURN$1,sub:r.crop.rotation.sub},t("GET_MIN_PREVIEW_IMAGE_SIZE"),-TURN$1,r.crop.limitToImageBounds),confirmImageDraft(r),t("GET_CROP_FORCE_LETTERBOX")&&e("CROP_UPDATE_LETTERBOX");},CROP_IMAGE_ROTATE_RIGHT:function(){resetCenterTimeout(r,t,e),rotate(r,{main:r.crop.rotation.main+TURN$1,sub:r.crop.rotation.sub},t("GET_MIN_PREVIEW_IMAGE_SIZE"),TURN$1,r.crop.limitToImageBounds),confirmImageDraft(r),t("GET_CROP_FORCE_LETTERBOX")&&e("CROP_UPDATE_LETTERBOX");},CROP_IMAGE_FLIP_HORIZONTAL:function(){resetCenterTimeout(r,t,e),0===roundFloat(r.crop.rotation.main%Math.PI/2,5)?r.crop.flip.horizontal=!r.crop.flip.horizontal:r.crop.flip.vertical=!r.crop.flip.vertical,r.crop.isDirty=!0;},CROP_IMAGE_FLIP_VERTICAL:function(){resetCenterTimeout(r,t,e),0===roundFloat(r.crop.rotation.main%Math.PI/2,5)?r.crop.flip.vertical=!r.crop.flip.vertical:r.crop.flip.horizontal=!r.crop.flip.horizontal,r.crop.isDirty=!0;},DID_RECEIVE_IMAGE_DATA:function(e){var t=e.previewData,n=e.thumbData;r.file.preview=t,r.file.thumb=n;},MARKUP_SET_VALUE:function(e){var t=e.value;r.markup=t;},MARKUP_ADD_DEFAULT:function(r){var n=r.value,i=function(){return -.5+Math.random()},o=.25*t("GET_CROP_RECTANGLE_ASPECT_RATIO"),a=function(){return {width:.25,height:o,x:.5+.5*i()-.125,y:.5+.5*i()-.5*o}},c=function(e){return t("GET_MARKUP_TOOL_VALUES")[e]},l=function(){var e=c("shapeStyle"),t=c("color");return {backgroundColor:e[0]||e[1]?null:t,borderWidth:e[0],borderStyle:e[1]?e[1]:null,borderColor:t}},u={rect:function(){return _objectSpread({},a(),l())},ellipse:function(){return _objectSpread({},a(),l())},text:function(){return {x:.5+.5*i()-.1,y:.5+.5*i(),width:0,height:0,fontColor:c("color"),fontSize:c("fontSize"),fontFamily:c("fontFamily"),text:"Text"}},line:function(){var e=c("lineStyle");return _objectSpread({},a(),{lineColor:c("color"),lineWidth:e[0],lineStyle:e[1]?e[1]:null,lineDecoration:c("lineDecoration")})}}[n]();e("MARKUP_ADD",[n,u]);},MARKUP_ADD:function(n){r.markup.forEach(function(e){return e[1].isSelected=!1}),r.markup=r.markup.filter(function(e){return !e[1].isDestroyed});var i=prepareMarkup(n);r.markup.push(i),r.markup.sort(sortMarkupByZIndex),"draw"!==t("GET_MARKUP_UTIL")&&e("MARKUP_SELECT",{id:i[1].id}),r.crop.isDirty=!0;},MARKUP_SELECT:function(e){var t=e.id;r.markup.forEach(function(e){e[1].isSelected=e[1].id===t,e[1].isDirty=!0;});},MARKUP_ELEMENT_DRAG:function(e){var t=e.id,n=e.origin,i=e.offset,o=e.size,a=r.markup.find(function(e){return e[1].id===t});if(a){var c=a[1],l=n.x/o.width,u=n.y/o.height,s=n.width/o.width,d=n.height/o.height,p=i.x/o.width,f=i.y/o.height;c.x=l+p,c.y=u+f,c.width=s,c.height=d,c.left=void 0,c.top=void 0,c.right=void 0,c.bottom=void 0,c.isDirty=!0,r.crop.isDirty=!0;}},MARKUP_ELEMENT_RESIZE:function(e){var t=e.id,n=e.corner,i=e.origin,o=e.offset,a=e.size,c=r.markup.find(function(e){return e[1].id===t});if(c){var l=_slicedToArray(c,2),u=l[0],s=l[1],d=(i.x+o.x)/a.width,p=(i.y+o.y)/a.height;if(/n/.test(n))if("line"===u)s.height=s.height-(p-s.y),s.y=p;else{var f=s.y+s.height;p>f&&(p=f),s.height=s.height-(p-s.y),s.y=p;}if(/w/.test(n))if("line"===u)s.width=s.width-(d-s.x),s.x=d;else{var h=s.x+s.width;d>h&&(d=h),s.width=s.width-(d-s.x),s.x=d;}/s/.test(n)&&(s.height="line"===u?p-s.y:Math.max(0,p-s.y)),/e/.test(n)&&(s.width="line"===u?d-s.x:Math.max(0,d-s.x)),s.left=void 0,s.top=void 0,s.right=void 0,s.bottom=void 0,s.isDirty=!0,r.crop.isDirty=!0;}},MARKUP_DELETE:function(t){var n=t.id,i=r.markup.find(function(e){return e[1].id===n});if(i){var o=i[1];o.allowDestroy&&(o.isDestroyed=!0,o.isSelected=!1,o.isDirty=!0);for(var a=null,c=r.markup.length;c>0;){c--;var l=r.markup[c][1];if(!l.isDestroyed&&l.allowDestroy){a=l.id;break}}e("MARKUP_SELECT",{id:a});}},MARKUP_UPDATE:function(e){var t=e.style,n=e.value;r.markupToolValues[t]=n,r.markup.map(function(e){return e[1]}).filter(function(e){return e.isSelected}).forEach(function(e){if("color"===t)e[getColorProperty(e)]=n;else if("shapeStyle"===t){var r=getColor(e);e.borderWidth=n[0],e.borderStyle=n[1],e.backgroundColor=n[0]||n[1]?null:r;}else"lineStyle"===t?(e.lineWidth=n[0],e.lineStyle=n[1]):e[t]=n;e.isDirty=!0;}),r.crop.isDirty=!0;}},["color","shapeStyle","lineStyle","textDecoration","fontSize","fontFamily"].reduce(function(t,n){var i=n.split(/(?=[A-Z])/).join("_").toUpperCase(),o=capitalizeFirstLetter(n);return t["SET_MARKUP_"+i]=function(t){var i=t.value;i!==t.prevValue&&(r.options["markup".concat(o)]=i,e("MARKUP_UPDATE",{style:n,value:i}));},t},{}),{COLOR_SET_COLOR_VALUE:function(t){var n=t.key,i=t.value;r.crop.isDirty=!0,e("COLOR_SET_VALUE",{key:n,value:i});},COLOR_SET_VALUE:function(t){var n=t.key,i=t.value;r.colorValues[n]=i,e("SET_COLOR_MATRIX",{key:n,matrix:COLOR_TOOLS[n](i)});}},Object.keys(COLOR_TOOLS).reduce(function(n,i){var o=i.toUpperCase(),a=capitalizeFirstLetter(i);return n["SET_COLOR_".concat(o)]=function(n){var c=n.value;if(c!==n.prevValue){var l=_slicedToArray(t("GET_COLOR_".concat(o,"_RANGE")),2),u=l[0],s=l[1],d=limit(c,u,s);r.options["color".concat(a)]=d,r.instructions.color||(r.instructions.color={}),r.instructions.color[i]=d,e("COLOR_SET_VALUE",{key:i,value:d});}},n},{}),{SET_COLOR_MATRIX:function(t){var n=t.key,i=t.matrix;i?r.colorMatrices[n]=_toConsumableArray(i):delete r.colorMatrices[n],e("DID_SET_COLOR_MATRIX",{key:n,matrix:i});},FILTER_SET_FILTER:function(t){var n=t.value;r.crop.isDirty=!0,e("FILTER_SET_VALUE",{value:n});},FILTER_SET_VALUE:function(n){var i=n.value,o=isColorMatrix(i)?i:null;if(isString(i)){var a=t("GET_FILTERS");forin(a,function(e,t){e===i&&(o=t.matrix());});}r.filter=i,r.filterName=isString(i)?i:null,e("SET_COLOR_MATRIX",{key:"filter",matrix:o});},DID_SET_UTIL:function(t){var n=t.value;t.prevValue;-1!==r.options.utils.indexOf(n)&&e("CHANGE_VIEW",{id:n});},DID_SET_FILTER:function(t){var r=t.value;r!==t.prevValue&&(e("FILTER_SET_VALUE",{value:r}),e("SET_DATA",{filter:r}));},DID_SET_SIZE:function(t){var r=t.value;r!==t.prevValue&&e("SET_DATA",{size:r});},DID_SET_CROP:function(t){var r=t.value;r!==t.prevValue&&e("SET_DATA",{crop:r});},DID_SET_MARKUP_UTIL:function(t){var r=t.value;r!==t.prevValue&&r&&(/^(draw|line|text|rect|ellipse)$/.test(r)||(r="select"),e("SWITCH_MARKUP_UTIL",{util:r}));},DID_SET_MARKUP:function(t){var r=t.value,n=t.prevValue;r!==n&&JSON.stringify(r)===JSON.stringify(n)||e("SET_DATA",{markup:r});},SET_DATA:function(n){if(n.size&&t("ALLOW_MANUAL_RESIZE")){var i=_objectSpread({width:null,height:null},n.size),o=limitSize(i,t("GET_SIZE_MIN"),t("GET_SIZE_MAX"),null);r.instructions.size=_objectSpread({},o),e("RESIZE_SET_OUTPUT_SIZE",o);}n.filter&&(r.instructions.filter=n.filter?n.filter.id||n.filter.matrix:n.colorMatrix),r.instructions.markup=n.markup||[],r.instructions.color=Object.keys(COLOR_TOOLS).reduce(function(e,t){var i=void 0===n.color||void 0===n.color[t],o=r.options["color".concat(capitalizeFirstLetter(t))];return e[t]=i?o:isNumber(n.color[t])?n.color[t]:n.color[t].value,e},{}),n.crop&&(r.instructions.crop=getBaseCropInstructions(t,r,n.crop,r.size),r.crop.limitToImageBounds=r.options.cropLimitToImageBounds,!1===r.instructions.crop.scaleToFit&&(r.crop.limitToImageBounds=r.instructions.crop.scaleToFit),e("EDIT_RESET"));},DID_SET_INITIAL_STATE:function(e){var n=e.value||{},i=n.crop,o=n.filter,a=n.color,c=n.size,l=void 0===c?{}:c,u=n.markup,s=void 0===u?[]:u,d=_objectSpread({width:null,height:null},l),p=limitSize(d,t("GET_SIZE_MIN"),t("GET_SIZE_MAX"),null);r.instructions.size=_objectSpread({},p),r.instructions.crop=getBaseCropInstructions(t,r,i),r.crop.limitToImageBounds=r.options.cropLimitToImageBounds,!1===r.instructions.crop.scaleToFit&&(r.crop.limitToImageBounds=r.instructions.crop.scaleToFit),r.instructions.filter=o||null,r.instructions.color=Object.keys(COLOR_TOOLS).reduce(function(e,t){return e[t]=void 0===a||void 0===a[t]?r.options["color".concat(capitalizeFirstLetter(t))]:a[t],e},{}),r.instructions.markup=s,r.crop.isDirty=!0;},GET_DATA:function(n){var i=n.success,o=n.failure,a=n.file,c=n.data;if(!r.file)return o("no-image-source");if(!r.stage)return o("image-not-fully-loaded");var l={file:isBoolean(a)?a:t("GET_OUTPUT_FILE"),data:isBoolean(c)?c:t("GET_OUTPUT_DATA"),success:i,failure:o};e(l.file?"REQUEST_PREPARE_OUTPUT":"PREPARE_OUTPUT",l);},REQUEST_PREPARE_OUTPUT:function(t){var r=t.file,n=t.data,i=t.success,o=t.failure;e("PREPARE_OUTPUT",{file:r,data:n,success:i,failure:o},!0),e("DID_REQUEST_PREPARE_OUTPUT");},PREPARE_OUTPUT:function(n){var i=n.file,o=n.data,a=n.success,c=void 0===a?function(){}:a,l=n.failure,u=void 0===l?function(){}:l;if(shouldAbortImageLoad(r))return e("ABORT_IMAGE");var s=function(t){if(e("DID_PREPARE_OUTPUT"),shouldAbortImageLoad(r))return e("ABORT_IMAGE");c(t);},d=function(t){if(shouldAbortImageLoad(r))return e("ABORT_IMAGE");u(t);};prepareOutput({file:i,data:o},r,t).then(function(t){var n=r.options.afterCreateOutput,i=n?n(t,function(t){return e("DID_REQUEST_POSTPROCESS_OUTPUT",{label:t}),function(t){e("DID_MAKE_PROGRESS",{progress:t});}}):t;Promise.resolve(i).then(s).catch(d);}).catch(d);},EDIT_RESET:function(){clearCenterTimeout(r),reset(r,t,e);},EDIT_CONFIRM:function(){if(r.file&&r.stage){clearCenterTimeout(r),e("CROP_ZOOM");var n={file:t("GET_OUTPUT_FILE"),data:t("GET_OUTPUT_DATA"),success:function(t){r.filePromise.resolveOnConfirm&&r.filePromise.success(t),e("DID_CONFIRM",{output:t});},failure:console.error};e(n.file?"REQUEST_PREPARE_OUTPUT":"PREPARE_OUTPUT",n);}},EDIT_CANCEL:function(){r.filePromise&&r.filePromise.success(null),e("DID_CANCEL");},EDIT_CLOSE:function(){clearCenterTimeout(r);},EDIT_DESTROY:function(){resetState(r);},SET_OPTIONS:function(t){var r=t.options;forin(r,function(t,r){e("SET_".concat(fromCamels(t,"_").toUpperCase()),{value:r});});}})},createIcon=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:24;return '<svg width="'.concat(t,'" height="').concat(t,'" viewBox="0 0 ').concat(t," ").concat(t,'" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">').concat(e,"</svg>")},button=createView({ignoreRect:!0,ignoreRectUpdate:!0,name:"button",mixins:{styles:["opacity"],animations:{opacity:{type:"tween",duration:250}},apis:["id"],listeners:!0},tag:"button",create:function(e){var t=e.root,r=e.props;t.element.innerHTML="".concat(r.icon||"","<span>").concat(r.label,"</span>"),t.element.setAttribute("type",r.type||"button"),r.name&&r.name.split(" ").forEach(function(e){t.element.className+=" doka--button-".concat(e);}),t.ref.handleClick=function(){"string"==typeof r.action?t.dispatch(r.action):r.action();},t.element.addEventListener("click",t.ref.handleClick),t.ref.handlePointer=function(e){return e.stopPropagation()},t.element.addEventListener("pointerdown",t.ref.handlePointer),r.create&&r.create({root:t,props:r});},destroy:function(e){var t=e.root;t.element.removeEventListener("pointerdown",t.ref.handlePointer),t.element.removeEventListener("click",t.ref.handleClick);}}),textNode=function(e){return createView({ignoreRect:!0,tag:e,create:function(e){var t=e.root,r=e.props;t.element.textContent=r.text;}})},progressIndicator=createView({name:"status-progress",tag:"svg",ignoreRect:!0,ignoreRectUpdate:!0,mixins:{apis:["progress"],animations:{progress:{type:"spring",stiffness:.25,damping:.25,mass:2.5}}},create:function(e){var t=e.root;t.opacity=0,t.progress=0,t.element.setAttribute("data-value",0),t.element.setAttribute("width",24),t.element.setAttribute("height",24),t.element.setAttribute("viewBox","0 0 20 20");var r=t.ref.circle=document.createElementNS("http://www.w3.org/2000/svg","circle"),n={r:5,cx:10,cy:10,fill:"none",stroke:"currentColor","stroke-width":10,transform:"rotate(-90) translate(-20)"};Object.keys(n).forEach(function(e){r.setAttribute(e,n[e]);}),t.element.appendChild(r);},write:createRoute({DID_MAKE_PROGRESS:function(e){var t=e.root,r=e.action;t.progress=r.progress,t.element.setAttribute("data-value",r.progress);}},function(e){var t=e.root;t.ref.circle.setAttribute("stroke-dasharray","".concat(31.42*Math.min(1,t.progress)," 31.42"));})}),statusBubbleInner=createView({name:"status-bubble-inner",create:function(e){var t=e.root,r=e.props;r.onClose?t.appendChildView(t.createChildView(button,{label:"Close",name:"icon-only status-bubble-close",icon:createIcon('<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></g>'),action:r.onClose})):t.ref.progressIndicator=t.appendChildView(t.createChildView(progressIndicator)),t.appendChildView(t.createChildView(textNode("p"),{text:r.label}));}}),statusBubble=createView({name:"status-bubble",styles:["opacity","translateY"],apis:["markedForRemoval"],animations:{opacity:{type:"tween",duration:500},translateY:{type:"spring",mass:20}},create:function(e){var t=e.root,r=e.props;return t.appendChildView(t.createChildView(statusBubbleInner,r))}}),hideBusyIndicators=function(e){e.element.dataset.viewStatus="idle",hideBusyIndicatorsAnimated(e);},hideBusyIndicatorsAnimated=function(e){e.ref.busyIndicators.forEach(function(e){e.translateY=-10,e.opacity=0,e.markedForRemoval=!0;});},showBusyIndicator=function(e,t,r){e.element.dataset.viewStatus="busy";var n=addBusyIndicator(e,t,r);hideBusyIndicatorsAnimated(e),e.ref.busyIndicators.push(n),n.markedForRemoval=!1,n.translateY=0,n.opacity=1;},addBusyIndicator=function(e,t){var r=arguments.length>2&&void 0!==arguments[2]&&arguments[2];return e.appendChildView(e.createChildView(statusBubble,{translateY:20,opacity:0,label:t,onClose:r}))},editStatus=createView({name:"edit-status",ignoreRect:!0,create:function(e){var t=e.root;t.ref.busyIndicators=[],t.element.setAttribute("tabindex",-1);},write:createRoute({MISSING_WEBGL:function(e){var t=e.root,r=/fullscreen/.test(t.query("GET_STYLE_LAYOUT_MODE"));showBusyIndicator(t,t.query("GET_LABEL_STATUS_MISSING_WEB_G_L"),r?function(){t.dispatch("EDIT_CANCEL");}:null);},AWAITING_IMAGE:function(e){var t=e.root;showBusyIndicator(t,t.query("GET_LABEL_STATUS_AWAITING_IMAGE"));},DID_PRESENT_IMAGE:function(e){var t=e.root;hideBusyIndicators(t);},DID_LOAD_IMAGE_ERROR:function(e){var t=e.root,r=e.action,n=/fullscreen/.test(t.query("GET_STYLE_LAYOUT_MODE")),i=t.query("GET_LABEL_STATUS_LOAD_IMAGE_ERROR"),o="function"==typeof i?i(r.error):i;showBusyIndicator(t,o,n?function(){t.dispatch("EDIT_CANCEL");}:null);},DID_REQUEST_LOAD_IMAGE:function(e){var t=e.root;showBusyIndicator(t,t.query("GET_LABEL_STATUS_LOADING_IMAGE"));},DID_REQUEST_PREPARE_OUTPUT:function(e){var t=e.root;showBusyIndicator(t,t.query("GET_LABEL_STATUS_PROCESSING_IMAGE"));},DID_REQUEST_POSTPROCESS_OUTPUT:function(e){var t=e.root,r=e.action;showBusyIndicator(t,r.label);},DID_PREPARE_OUTPUT:function(e){var t=e.root;hideBusyIndicators(t);}}),didWriteView:function(e){var t=e.root;t.ref.busyIndicators=t.ref.busyIndicators.filter(function(e){return !e.markedForRemoval||0!==e.opacity||(t.removeChildView(e),!1)});}}),Interaction={down:"pointerdown",move:"pointermove",up:"pointerup"},createPointerRegistry=function(){var e=[],t=function(t){return e.findIndex(function(e){return e.pointerId===t.pointerId})};return {update:function(r){var n=t(r);n<0||(e[n]=r);},multiple:function(){return e.length>1},count:function(){return e.length},active:function(){return e.concat()},push:function(r){(function(e){return t(e)>=0})(r)||e.push(r);},pop:function(r){var n=t(r);n<0||e.splice(n,1);}}},addEvent$1=function(e,t,r,n){return e.addEventListener(Interaction[t],r,n)},removeEvent$1=function(e,t,r){return e.removeEventListener(Interaction[t],r)},contains=function(e,t){"contains"in e&&e.contains(t);var r=t;do{if(r===e)return !0}while(r=r.parentNode);return !1},createDragger=function(e,t,r,n){var i=arguments.length>4&&void 0!==arguments[4]?arguments[4]:{stopPropagation:!0,cancelOnMultiple:!1},o={x:0,y:0},a={enabled:!0,origin:null,cancel:!1,cancelled:!1,pointers:createPointerRegistry()},c=null,l=function(e,t){t&&(c||u(e,t),cancelAnimationFrame(c),c=requestAnimationFrame(function(){u(e,t),c=null;}));},u=function(e,t){return t.apply(null,[e,function(e){return {x:e.pageX-o.x,y:e.pageY-o.y}}(e)])},s=function(r){var n=0===a.pointers.count();n&&(a.active=!1,a.cancel=!1,a.cancelled=!1),a.pointers.push(r),addEvent$1(document.documentElement,"up",p),n?(e===r.target||contains(e,r.target))&&r.isPrimary&&(r.preventDefault(),i.stopPropagation&&(r.stopPropagation(),r.stopImmediatePropagation()),a.active=!0,o.x=r.pageX,o.y=r.pageY,addEvent$1(document.documentElement,"move",d),t(r)):i.cancelOnMultiple&&(a.cancel=!0);},d=function(e){e.isPrimary&&(a.cancelled||(e.preventDefault(),i.stopPropagation&&e.stopPropagation(),l(e,r),a.cancel&&(a.cancelled=!0,l(e,n))));},p=function e(t){a.pointers.pop(t),0===a.pointers.count()&&(removeEvent$1(document.documentElement,"move",d),removeEvent$1(document.documentElement,"up",e)),a.active&&(a.cancelled||(t.preventDefault(),i.stopPropagation&&t.stopPropagation(),l(t,r),l(t,n)));};return addEvent$1(document.documentElement,"down",s),{enable:function(){a.enabled||addEvent$1(document.documentElement,"down",s),a.enabled=!0;},disable:function(){a.enabled&&removeEvent$1(document.documentElement,"down",s),a.enabled=!1;},destroy:function(){removeEvent$1(document.documentElement,"up",p),removeEvent$1(document.documentElement,"move",d),removeEvent$1(document.documentElement,"down",s);}}},imageOverlaySpring={type:"spring",stiffness:.4,damping:.65,mass:7},activateMarkupUtil=function(e,t){if(/^(line|text|ellipse|rect)$/.test(t))e.dispatch("MARKUP_ADD_DEFAULT",{value:t}),e.dispatch("SET_MARKUP_UTIL",{value:"select"});else if("draw"===t&&!e.ref.drawInput){var r=e.ref,n=r.drawState,i=r.viewSize,o=0,a=0,c={},l=e.query("GET_MARKUP_DRAW_DISTANCE");e.ref.drawInput=createDragger(e.element,function(t){var r=e.query("GET_MARKUP_TOOL_VALUES"),l=r.lineStyle[0],u=r.lineStyle[1];n.lineColor=r.color,n.lineWidth=l,n.lineStyle=u,o=t.offsetX-e.markupX,a=t.offsetY-e.markupY,c.x=0,c.y=0,n.points.push({x:o/i.width,y:a/i.height});},function(t,r){if(e.dispatch("KICK"),l){var u=vectorDistance(r,c);if(u>l){var s=vectorAngleBetween(c,r)+Math.PI/2,d=l-u;c.x+=Math.sin(s)*d,c.y-=Math.cos(s)*d,n.points.push({x:(o+c.x)/i.width,y:(a+c.y)/i.height});}}else n.points.push({x:(o+r.x)/i.width,y:(a+r.y)/i.height});},function(t,r){n.points.length>1&&e.dispatch("MARKUP_ADD",["path",_objectSpread({},n)]),n.points=[];});}"draw"!==t&&e.ref.drawInput&&(e.ref.drawInput.destroy(),e.ref.drawInput=null);},getColor$1=function(e){var t=e.fontColor,r=e.backgroundColor,n=e.lineColor,i=e.borderColor;return t||r||n||i},MARKUP_MARGIN=10,setAttributes$1=function(e,t){return Object.keys(t).forEach(function(r){e.setAttribute(r,t[r]);})},ns$2="http://www.w3.org/2000/svg",svg$1=function(e,t){var r=document.createElementNS(ns$2,e);return t&&setAttributes$1(r,t),r},LINE_CORNERS=["nw","se"],RECT_CORNERS=["nw","n","ne","w","e","sw","s","se"],CORNER_CURSOR={nw:"nwse",n:"ns",ne:"nesw",w:"ew",e:"ew",sw:"nesw",s:"ns",se:"nwse"},CORNER_COORDINATES={nw:function(e){return {x:e.x,y:e.y}},n:function(e){return {x:e.x+.5*e.width,y:e.y}},ne:function(e){return {x:e.x+e.width,y:e.y}},w:function(e){return {x:e.x,y:e.y+.5*e.height}},e:function(e){return {x:e.x+e.width,y:e.y+.5*e.height}},sw:function(e){return {x:e.x,y:e.y+e.height}},s:function(e){return {x:e.x+.5*e.width,y:e.y+e.height}},se:function(e){return {x:e.x+e.width,y:e.y+e.height}}},imageMarkup=createView({tag:"div",name:"image-markup",ignoreRect:!0,mixins:{styles:["opacity"],animations:{opacity:"spring",markupX:imageOverlaySpring,markupY:imageOverlaySpring,markupWidth:imageOverlaySpring,markupHeight:imageOverlaySpring},listeners:!0,apis:["toolsReference","onSelect","onDrag","markupX","markupY","markupWidth","markupHeight","allowInteraction"]},create:function(e){var t=e.root,r=e.props,n=r.onSelect,i=void 0===n?function(){}:n,o=r.onUpdate,a=void 0===o?function(){}:o,c=svg$1("svg",{xmlns:"http://www.w3.org/2000/svg","xmlns:xlink":"http://www.w3.org/1999/xlink"});t.ref.canvas=c;var l=t.query("GET_ROOT_SIZE");c.setAttribute("width",l.width),c.setAttribute("height",l.height);var u=document.createElement("input");setAttributes$1(u,{type:"text",autocomplete:"off",autocapitalize:"off"}),u.addEventListener("keydown",function(e){e.stopPropagation(),13===e.keyCode||9===e.keyCode?(e.target.blur(),d()):8!==e.keyCode||t.ref.input.value.length||t.dispatch("MARKUP_DELETE",{id:t.ref.selected.id});}),t.appendChild(u),t.ref.input=u,t.ref.elements=[],t.ref.viewSize={width:0,height:0,scale:0},t.ref.resetSelected=function(){return t.ref.selected={id:null,type:null,settings:{}},t.ref.selected},t.ref.resetSelected();var s=function(e){return e.id?e:e.parentNode},d=function(){t.ref.resetSelected(),i(null);};t.ref.handleDeselect=function(e){var n;t.query("IS_ACTIVE_VIEW","markup")&&(t.ref.selected.id&&e.target!==t.ref.removeButton.element&&(n=e.target,t.ref.selected.id!==s(n).id&&(function(e){return contains(t.ref.manipulatorGroup,e)||e===t.ref.input}(e.target)||r.isMarkupUtil(e.target)||d())));},addEvent$1(document.body,"down",t.ref.handleDeselect),t.ref.handleTextInput=function(){return a("text",t.ref.input.value)},t.ref.input.addEventListener("input",t.ref.handleTextInput),t.ref.handleAttemptDelete=function(e){t.query("IS_ACTIVE_VIEW","markup")&&(!t.ref.selected.id||8!==e.keyCode&&46!==e.keyCode||(e.stopPropagation(),e.preventDefault(),t.dispatch("MARKUP_DELETE",{id:t.ref.selected.id})));},document.body.addEventListener("keydown",t.ref.handleAttemptDelete);var p=svg$1("g"),f=svg$1("g",{class:"doka--shape-group"});p.appendChild(f),t.ref.shapeGroup=f;var h=svg$1("g",{fill:"none",class:"doka--manipulator-group"}),g=svg$1("rect",{x:0,y:0,width:0,height:0,fill:"none"}),m=svg$1("path");h.appendChild(m),h.appendChild(g),t.ref.manipulatorPath=m,t.ref.manipulatorRect=g,t.ref.manipulators=[];for(var v=0;v<10;v++){var y=svg$1("circle",{r:6,"stroke-width":2,style:"display:none"});h.appendChild(y),t.ref.manipulators.push(y);}p.appendChild(h),t.ref.manipulatorGroup=h,c.appendChild(p),t.ref.shapeOffsetGroup=p,t.ref.removeButton=t.appendChildView(t.createChildView(button,{label:t.query("GET_LABEL_MARKUP_REMOVE_SHAPE"),name:"destroy-shape",action:function(){t.dispatch("MARKUP_DELETE",{id:t.ref.selected.id});}})),t.query("IS_ACTIVE_VIEW","markup")&&(t.element.dataset.active=!0),t.ref.drawInput=null,t.ref.drawState={lineColor:null,lineWidth:null,lineStyle:null,points:[]};var E=svg$1("path",{fill:"none",class:"doka--draw-path"});t.ref.drawPath=E,c.appendChild(E),t.element.appendChild(c),"draw"===t.query("GET_MARKUP_UTIL")&&activateMarkupUtil(t,"draw");},destroy:function(e){var t=e.root;t.ref.elements.concat(t.ref.manipulators).forEach(function(e){e.dragger&&e.dragger.destroy();}),t.ref.input.removeEventListener("input",t.ref.handleTextInput),document.body.removeEventListener("keydown",t.ref.handleAttemptDelete),removeEvent$1(document.body,"down",t.ref.handleDeselect);},read:function(e){var t=e.root;if(!t.rect.element.hidden)for(var r in t.ref.elements){var n=t.ref.elements[r];if(n&&"text"===n.nodeName&&n.parentNode){var i=n.getBBox();n.bbox={x:i.x,y:i.y,width:i.width,height:i.height};}}},write:createRoute({SHOW_VIEW:function(e){var t=e.root,r=e.props;"markup"===e.action.id?t.element.dataset.active=!0:(t.element.dataset.active=!1,r.onSelect(null));},MARKUP_SET_VALUE:function(e){e.root.ref.shapeGroup.innerHTML="";},UPDATE_ROOT_RECT:function(e){var t=e.root,r=e.action,n=t.ref.canvas;n.setAttribute("width",r.rect.width),n.setAttribute("height",r.rect.height),t.ref.previousScale=null;},SWITCH_MARKUP_UTIL:function(e){var t=e.root,r=e.action.util;activateMarkupUtil(t,r);}},function(e){var t=e.root,r=e.props,n=e.timestamp;if(!(t.opacity<=0)){var i=t.query("GET_CROP",r.id,n);if(i){var o=t.query("GET_MARKUP_UTIL");t.element.dataset.util=o||"";var a=i.markup,c=i.cropStatus,l=r.onSelect,u=r.onDrag,s=t.ref,d=s.manipulatorGroup,p=s.drawPath,f=s.viewSize,h=s.shapeOffsetGroup,g=s.manipulators,m=s.manipulatorPath,v=s.manipulatorRect,y=s.removeButton,E=s.drawState,T=t.query("GET_OUTPUT_WIDTH"),_=t.query("GET_OUTPUT_HEIGHT"),R=c.image,w=c.crop,I=w.width,A=w.height,C=w.widthFloat/w.heightFloat;if(T||_){var S=t.query("GET_OUTPUT_FIT");T&&!_&&(_=T),_&&!T&&(T=_);var O,x=T/I,b=_/A;if("force"===S)I=T,A=_;else"cover"===S?O=Math.max(x,b):"contain"===S&&(O=Math.min(x,b)),I*=O,A*=O;}else R.width&&R.height?(I=R.width,A=R.height):R.width&&!R.height?(I=R.width,A=R.width/C):R.height&&!R.width&&(A=R.height,I=R.height*C);var M=E.points.length,L=roundFloat(t.markupX,3),P=roundFloat(t.markupY,3),G=roundFloat(t.markupWidth,3),k=roundFloat(t.markupHeight,3),D=roundFloat(Math.min(t.markupWidth/I,t.markupHeight/A),4);if(f.width=G,f.height=k,f.scale=D,stateHasChanged(t,{drawLength:M,markupX:L,markupY:P,scale:D,markup:a,currentWidth:I,currentHeight:A})&&(h.setAttribute("transform","translate(".concat(L," ").concat(P,")")),t.ref.previousDrawLength=M,t.ref.previousX=L,t.ref.previousY=P,t.ref.previousScale=D,t.ref.previousCurrentHeight=A,t.ref.previousCurrentWidth=I,t.ref.previousMarkupLength=a.length,!(f.width<1||f.height<1))){var V,U=a.find(function(e){return e[1].isSelected}),B=U&&t.ref.selected.id!==U[1].id||t.ref.selected.id&&!U;if(V=U?t.ref.selected={id:U[1].id,type:U[0],settings:U[1]}:t.ref.resetSelected(),E.points.length){var N=getMarkupStyles(E,f,D);return N.d=pointsToPathShape(E.points.map(function(e){return {x:L+e.x*f.width,y:P+e.y*f.height}})),void setAttributes$1(p,N)}p.removeAttribute("d"),t.ref.input.hidden="text"!==t.ref.selected.type,y.element.dataset.active=null!==t.ref.selected.id,m.setAttribute("style","opacity:0"),v.setAttribute("style","opacity:0"),g.forEach(function(e){return e.setAttribute("style","opacity:0;pointer-events:none;")});var F=t.query("GET_MARKUP_FILTER");a.filter(F).sort(sortMarkupByZIndex).forEach(function(e,n){var i=_slicedToArray(e,2),o=i[0],a=i[1],c=a.id,s=a.isDestroyed,p=a.isDirty,h=a.isSelected,E=a.allowSelect,T=a.allowMove,_=a.allowResize,R=a.allowInput;if(s){var w=t.ref.elements[c];w&&(w.dragger&&w.dragger.destroy(),t.ref.elements[c]=null,w.parentNode.removeChild(w));}else{var I,A,C,S=t.ref.elements[c];if(!S)if(S=createMarkupByType(o,a),t.ref.elements[c]=S,E)S.dragger=createDragger(S,function(){A=Date.now(),I=_objectSpread({},S.rect),(C=c===t.ref.selected.id)||l(c);},function(e,t){T&&u(c,I,t,f,D);},function(e,r){if(R&&"text"===o&&C){var n=vectorDistanceSquared({x:0,y:0},r),i=Date.now()-A;if(!(n>10||i>750)){t.ref.input.focus();var a=t.markupX+S.bbox.x,c=S.bbox.width,l=(e.offsetX-a)/c,u=Math.round(t.ref.input.value.length*l);t.ref.input.setSelectionRange(u,u);}}}),S.dragger.disable();else S.setAttribute("style","pointer-events:none;");if(S.dragger&&(r.allowInteraction?S.dragger.enable():S.dragger.disable()),n!==S.index){S.index=n;var O=t.ref.shapeGroup;O.insertBefore(S,O.childNodes[n+1]);}if(p&&updateMarkupByType(S,o,a,f,D),h){var x=y.rect.element.width,b=y.rect.element.height,M=t.markupX-.5*x,L=t.markupY-b-15,P="text"===o?S.bbox:S.rect,G=!1,k=getColor$1(a);if(k){var V=toRGBColorArray(k);G=(.2126*V[0]+.7152*V[1]+.0722*V[2])/255>.65,d.setAttribute("is-bright-color",G);}"line"===o?(M+=P.x,L+=P.y,setAttributes$1(m,{d:"M ".concat(P.x," ").concat(P.y," L ").concat(P.x+P.width," ").concat(P.y+P.height),style:"opacity:1"})):"path"===o?(M+=(P={x:a.points[0].x*f.width,y:a.points[0].y*f.height,width:0,height:0}).x,L+=P.y,setAttributes$1(m,{d:pointsToPathShape(a.points.map(function(e){return {x:e.x*f.width,y:e.y*f.height}})),style:"opacity:1"})):P&&(M+=P.x+.5*P.width,L+=P.y,setAttributes$1(v,{x:P.x-("text"===o?5:0),y:P.y,width:P.width+("text"===o?10:0),height:P.height,style:"opacity:1"}));var U=t.markupY+MARKUP_MARGIN,B=t.markupY+t.markupHeight-MARKUP_MARGIN,N=t.markupX+MARKUP_MARGIN,F=t.markupX+t.markupWidth-MARKUP_MARGIN;if(L<U?L=U:L+b>B&&(L=B-b),M<N?M=N:M+x>F&&(M=F-x),P||(y.element.dataset.active="false"),y.element.setAttribute("style","transform: translate3d(".concat(M,"px, ").concat(L,"px, 0)")),"text"===o&&P){var z=P.width+65,W=t.markupWidth-P.x,q="\n                        width: ".concat(Math.min(z,W),"px;\n                        height: ").concat(P.height,"px;\n                        color: ").concat(S.getAttribute("fill"),";\n                        font-family: ").concat(S.getAttribute("font-family"),";\n                        font-size: ").concat(S.getAttribute("font-size").replace(/px/,""),"px;\n                        font-weight: ").concat(S.getAttribute("font-weight")||"normal",";\n                    ");isIOS()?q+="\n                            left: ".concat(Math.round(t.markupX+P.x),"px;\n                            top: ").concat(Math.round(t.markupY+P.y),"px;\n                        "):q+="\n                            transform: translate3d(".concat(Math.round(t.markupX+P.x),"px,").concat(Math.round(t.markupY+P.y),"px,0);\n                        "),t.ref.input.setAttribute("style",q),S.setAttribute("fill","none");}if("text"===o)return;if(!_)return;var H="line"===o?LINE_CORNERS:RECT_CORNERS;g.forEach(function(e,t){var r=H[t];if(r){var n="line"===o?"move":"".concat(CORNER_CURSOR[r],"-resize"),i=CORNER_COORDINATES[r](S.rect);setAttributes$1(e,{cx:i.x,cy:i.y,style:"opacity:1;cursor:".concat(n)});}});}a.isDirty=!1;}}),B&&(destroyElementControls(t),"text"===V.type?t.ref.input.value=V.settings.text:t.ref.selected.id&&setupElementControls(t,r.onResize));}}}})}),markAllAsDirty=function(e){return e.forEach(function(e){return e[1].isDirty=!0})},stateHasChanged=function(e,t){var r=t.drawLength,n=t.markup,i=t.markupX,o=t.markupY,a=t.currentWidth,c=t.currentHeight,l=t.scale;return r!==e.ref.previousDrawLength||(i!==e.ref.previousX?(markAllAsDirty(n),!0):o!==e.ref.previousY?(markAllAsDirty(n),!0):l!==e.ref.previousScale?(markAllAsDirty(n),!0):c!==e.ref.previousCurrentHeight?(markAllAsDirty(n),!0):a!==e.ref.previousCurrentWidth?(markAllAsDirty(n),!0):n.length!==e.ref.previousMarkupLength||!!n.find(function(e){return e[1].isDirty}))},setupElementControls=function(e,t){var r=e.ref.selected.id,n="g"===e.ref.elements[r].nodeName?LINE_CORNERS:RECT_CORNERS;e.ref.manipulators.forEach(function(i,o){var a=n[o];if(a){var c=null;i.dragger=createDragger(i,function(){c={x:parseFloat(attr$1(i,"cx")),y:parseFloat(attr$1(i,"cy"))};},function(n,i){t(r,a,c,i,e.ref.viewSize);},null,{stopPropagation:!0});}});},destroyElementControls=function(e){e.ref.manipulators.forEach(function(e){e.dragger&&(e.dragger.destroy(),e.dragger=null);});},KEY_MAP={38:"up",40:"down",37:"left",39:"right",189:"minus",187:"plus",72:"h",76:"l",81:"q",82:"r",84:"t",86:"v",90:"z",219:"left_bracket",221:"right_bracket"},createKeyboard=function(e,t,r,n,i){var o=null,a=!0,c={enabled:!0},l=function(e){var i=KEY_MAP[e.keyCode]||e.keyCode;r[i]&&(e.stopPropagation(),a&&(o=t(i),a=!1),r[i](o),n(o));},u=function(e){var t=KEY_MAP[e.keyCode]||e.keyCode;r[t]&&(e.stopPropagation(),i(o),a=!0);};return e.addEventListener("keydown",l),e.addEventListener("keyup",u),{enable:function(){c.enabled||(e.addEventListener("keydown",l),e.addEventListener("keyup",u)),c.enabled=!0;},disable:function(){c.enabled&&(e.removeEventListener("keydown",l),e.removeEventListener("keyup",u)),c.enabled=!1;},destroy:function(){e.removeEventListener("keydown",l),e.removeEventListener("keyup",u);}}},createPreviewImage=function(e,t,r){var n=arguments.length>3&&void 0!==arguments[3]?arguments[3]:1,i=arguments.length>4?arguments[4]:void 0;t=Math.round(t),r=Math.round(r);var o=i||document.createElement("canvas"),a=o.getContext("2d");return n>=5&&n<=8?(o.width=r,o.height=t):(o.width=t,o.height=r),a.save(),-1!==n&&a.transform.apply(a,getImageOrientationMatrix(t,r,n)),a.drawImage(e,0,0,t,r),a.restore(),o},BitmapWorker=function(){self.onmessage=function(e){createImageBitmap(e.data.message.file).then(function(t){self.postMessage({id:e.data.id,message:t},[t]);});};},isBitmap=function(e){return /^image/.test(e.type)&&!/svg/.test(e.type)},canCreateImageBitmap=function(e){return "createImageBitmap"in window&&isBitmap(e)},loadImage$2=function(e){return new Promise(function(t,r){var n=new Image;n.onload=function(){t(n);},n.onerror=function(e){r(e);},n.src=e;})},compileShader=function(e,t,r){var n=e.createShader(r);return e.shaderSource(n,t),e.compileShader(n),n},createProgram=function(e,t,r){var n=e.createProgram();return e.attachShader(n,compileShader(e,t,e.VERTEX_SHADER)),e.attachShader(n,compileShader(e,r,e.FRAGMENT_SHADER)),e.linkProgram(n),n},createTexture=function(e,t,r,n,i){var o=e.createTexture();e.activeTexture(e.TEXTURE0+n),e.bindTexture(e.TEXTURE_2D,o),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MIN_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_MAG_FILTER,e.LINEAR),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_S,e.CLAMP_TO_EDGE),e.texParameteri(e.TEXTURE_2D,e.TEXTURE_WRAP_T,e.CLAMP_TO_EDGE),e.uniform1i(t,n),e.uniform2f(r,i.width,i.height);try{e.texImage2D(e.TEXTURE_2D,0,e.RGBA,e.RGBA,e.UNSIGNED_BYTE,i);}catch(t){e.texImage2D(e.TEXTURE_2D,0,e.RGBA,i.width,i.height,0,e.RGBA,e.UNSIGNED_BYTE,null);}return o},create=function(){var e=new Float32Array(16);return e[0]=1,e[5]=1,e[10]=1,e[15]=1,e},perspective=function(e,t,r,n,i){var o=1/Math.tan(t/2),a=1/(n-i);e[0]=o/r,e[1]=0,e[2]=0,e[3]=0,e[4]=0,e[5]=o,e[6]=0,e[7]=0,e[8]=0,e[9]=0,e[11]=-1,e[12]=0,e[13]=0,e[15]=0,e[10]=(i+n)*a,e[14]=2*i*n*a;},translate=function(e,t){var r=t[0],n=t[1],i=t[2];e[12]=e[0]*r+e[4]*n+e[8]*i+e[12],e[13]=e[1]*r+e[5]*n+e[9]*i+e[13],e[14]=e[2]*r+e[6]*n+e[10]*i+e[14],e[15]=e[3]*r+e[7]*n+e[11]*i+e[15];},scale=function(e,t){var r=t[0],n=t[1],i=t[2];e[0]=e[0]*r,e[1]=e[1]*r,e[2]=e[2]*r,e[3]=e[3]*r,e[4]=e[4]*n,e[5]=e[5]*n,e[6]=e[6]*n,e[7]=e[7]*n,e[8]=e[8]*i,e[9]=e[9]*i,e[10]=e[10]*i,e[11]=e[11]*i;},rotateX=function(e,t){var r=Math.sin(t),n=Math.cos(t),i=e[4],o=e[5],a=e[6],c=e[7],l=e[8],u=e[9],s=e[10],d=e[11];e[4]=i*n+l*r,e[5]=o*n+u*r,e[6]=a*n+s*r,e[7]=c*n+d*r,e[8]=l*n-i*r,e[9]=u*n-o*r,e[10]=s*n-a*r,e[11]=d*n-c*r;},rotateY=function(e,t){var r=Math.sin(t),n=Math.cos(t),i=e[0],o=e[1],a=e[2],c=e[3],l=e[8],u=e[9],s=e[10],d=e[11];e[0]=i*n-l*r,e[1]=o*n-u*r,e[2]=a*n-s*r,e[3]=c*n-d*r,e[8]=i*r+l*n,e[9]=o*r+u*n,e[10]=a*r+s*n,e[11]=c*r+d*n;},rotateZ=function(e,t){var r=Math.sin(t),n=Math.cos(t),i=e[0],o=e[1],a=e[2],c=e[3],l=e[4],u=e[5],s=e[6],d=e[7];e[0]=i*n+l*r,e[1]=o*n+u*r,e[2]=a*n+s*r,e[3]=c*n+d*r,e[4]=l*n-i*r,e[5]=u*n-o*r,e[6]=s*n-a*r,e[7]=d*n-c*r;},mat4={create:create,perspective:perspective,translate:translate,scale:scale,rotateX:rotateX,rotateY:rotateY,rotateZ:rotateZ},degToRad=function(e){return e*Math.PI/180},imageFragmentShader="\nprecision mediump float;\n\nuniform sampler2D uTexture;\nuniform vec2 uTextureSize;\n\nuniform float uColorOpacity;\nuniform mat4 uColorMatrix;\nuniform vec4 uColorOffset;\n\nuniform vec4 uOverlayColor;\nuniform vec2 uOverlayLeftTop;\nuniform vec2 uOverlayRightBottom;\n\n// received from vertex shader\nvarying vec2 vTexCoord;\nvarying vec4 vPosition;\n\nvoid main () {\n\n\t// get texture color\n\tvec4 color = texture2D(uTexture, vTexCoord);\n\t\n\t// apply color matrix\n\tcolor = color * uColorMatrix + uColorOffset;\n\n\t// test if falls within \n    if ((gl_FragCoord.x < uOverlayLeftTop.x || gl_FragCoord.x > uOverlayRightBottom.x) || \n        (gl_FragCoord.y > uOverlayLeftTop.y || gl_FragCoord.y < uOverlayRightBottom.y)) {\n\t\tcolor *= uOverlayColor;\n\t}\n\t\n    gl_FragColor = color * uColorOpacity;\n}\n",imageVertexShader="\nattribute vec4 aPosition;\nattribute vec2 aTexCoord;\nuniform mat4 uMatrix;\n\n// send to fragment shader\nvarying vec2 vTexCoord;\nvarying vec4 vPosition;\n\nvoid main () {\n    vPosition = uMatrix * aPosition;\n    gl_Position = vPosition;\n    vTexCoord = aTexCoord;\n}\n",backgroundFragmentShader="\nprecision mediump float;\n\nuniform vec2 uViewportSize;\nuniform vec3 uColorStart;\nuniform vec3 uColorEnd;\nuniform vec2 uOverlayLeftTop;\nuniform vec2 uOverlayRightBottom;\nuniform vec4 uColorCanvasBackground;\n\nvoid main() {\n\n\tfloat x = gl_FragCoord.x;\n\tfloat y = gl_FragCoord.y;\n\n\tvec2 center = vec2(.5, .5);\n\tvec2 st = vec2(x / uViewportSize.x, y / uViewportSize.y);\n\tfloat mixValue = distance(st, center) * 1.5; // expand outside view (same as doka--root::after)\n\tvec3 color = mix(uColorStart, uColorEnd, mixValue);\n\n\tif (uColorCanvasBackground[3] == 1.0) {\n\n\t\tfloat innerLeft = uOverlayLeftTop.x;\n\t\tfloat innerRight = uOverlayRightBottom.x;\n\t\tfloat innerTop = uOverlayRightBottom.y;\n\t\tfloat innerBottom = uOverlayLeftTop.y;\n\n\t\tif (x < innerLeft || x > innerRight || y < innerTop || y > innerBottom) {\n\t\t\tgl_FragColor = vec4(color, 1.0);\n\t\t\treturn;\n\t\t}\n\n\t\tgl_FragColor = uColorCanvasBackground;\n\t\treturn;\n\t}\n\t\n\tgl_FragColor = vec4(color, 1.0);\n}\n",outlineFragmentShader="\nprecision mediump float;\n\nuniform vec2 uOverlayLeftTop;\nuniform vec2 uOverlayRightBottom;\nuniform vec4 uOutlineColor;\nuniform float uOutlineWidth;\n\nvoid main() {\n\n\tfloat x = gl_FragCoord.x;\n\tfloat y = gl_FragCoord.y;\n\n\tfloat innerLeft = uOverlayLeftTop.x;\n\tfloat innerRight = uOverlayRightBottom.x;\n\tfloat innerTop = uOverlayRightBottom.y;\n\tfloat innerBottom = uOverlayLeftTop.y;\n\n\tfloat outerLeft = innerLeft - uOutlineWidth;\n\tfloat outerRight = innerRight + uOutlineWidth;\n\tfloat outerTop = innerTop - uOutlineWidth;\n\tfloat outerBottom = innerBottom + uOutlineWidth;\n\t\n\tif (x < outerLeft || x >= outerRight || y < outerTop || y >= outerBottom) {\n\t\tdiscard;\n\t}\n\n\tif (x < innerLeft || x >= innerRight || y < innerTop || y >= innerBottom) {\n\t\tgl_FragColor = uOutlineColor;\n\t}\n}\n",simpleVertexShader="\nattribute vec4 aPosition;\nvoid main() {\n\tgl_Position = aPosition;\n}\n",setup=function(e,t,r){var n={width:0,height:0},i={x:0,y:0},o=null,a=degToRad(30),c=Math.tan(a/2),l={antialias:!1,alpha:!1},u=e.getContext("webgl",l)||e.getContext("experimental-webgl",l);if(!u)return null;u.enable(u.BLEND),u.blendFunc(u.SRC_ALPHA,u.ONE_MINUS_SRC_ALPHA);var s=createProgram(u,simpleVertexShader,backgroundFragmentShader),d=u.getUniformLocation(s,"uColorStart"),p=u.getUniformLocation(s,"uColorEnd"),f=u.getUniformLocation(s,"uViewportSize"),h=u.getAttribLocation(s,"aPosition"),g=u.getUniformLocation(s,"uOverlayLeftTop"),m=u.getUniformLocation(s,"uOverlayRightBottom"),v=u.getUniformLocation(s,"uColorCanvasBackground"),y=u.createBuffer(),E=new Float32Array([1,-1,1,1,-1,-1,-1,1]);u.bindBuffer(u.ARRAY_BUFFER,y),u.bufferData(u.ARRAY_BUFFER,E,u.STATIC_DRAW),u.bindBuffer(u.ARRAY_BUFFER,null);var T=createProgram(u,simpleVertexShader,outlineFragmentShader),_=u.getAttribLocation(T,"aPosition"),R=u.getUniformLocation(T,"uOutlineWidth"),w=u.getUniformLocation(T,"uOutlineColor"),I=u.getUniformLocation(T,"uOverlayLeftTop"),A=u.getUniformLocation(T,"uOverlayRightBottom"),C=u.createBuffer(),S=new Float32Array([1,-1,1,1,-1,-1,-1,1]);u.bindBuffer(u.ARRAY_BUFFER,C),u.bufferData(u.ARRAY_BUFFER,S,u.STATIC_DRAW),u.bindBuffer(u.ARRAY_BUFFER,null);var O=createProgram(u,imageVertexShader,imageFragmentShader);u.useProgram(O);var x=u.getUniformLocation(O,"uMatrix"),b=u.getUniformLocation(O,"uTexture"),M=u.getUniformLocation(O,"uTextureSize"),L=u.getUniformLocation(O,"uOverlayColor"),P=u.getUniformLocation(O,"uOverlayLeftTop"),G=u.getUniformLocation(O,"uOverlayRightBottom"),k=u.getUniformLocation(O,"uColorOpacity"),D=u.getUniformLocation(O,"uColorOffset"),V=u.getUniformLocation(O,"uColorMatrix"),U=u.getAttribLocation(O,"aPosition"),B=u.getAttribLocation(O,"aTexCoord"),N=createTexture(u,b,M,0,t),F=t.width*r,z=t.height*r,W=-.5*F,q=.5*z,H=.5*F,Y=-.5*z,j=new Float32Array([W,q,W,Y,H,q,H,Y]),Z=new Float32Array([0,0,0,1,1,0,1,1]),$=j.length/2,X=u.createBuffer();u.bindBuffer(u.ARRAY_BUFFER,X),u.bufferData(u.ARRAY_BUFFER,j,u.STATIC_DRAW),u.bindBuffer(u.ARRAY_BUFFER,null);var K=u.createBuffer();u.bindBuffer(u.ARRAY_BUFFER,K),u.bufferData(u.ARRAY_BUFFER,Z,u.STATIC_DRAW),u.bindBuffer(u.ARRAY_BUFFER,null);var Q=0,J=0;return {release:function(){e.width=1,e.height=1;},resize:function(t,a){e.width=t*r,e.height=a*r,e.style.width="".concat(t,"px"),e.style.height="".concat(a,"px"),n.width=t*r,n.height=a*r,i.x=.5*n.width,i.y=.5*n.height,o=n.width/n.height,u.viewport(0,0,u.canvas.width,u.canvas.height);},update:function(e,l,E,S,b,M,F,z,W,q,H,Y,j,Z,ee,te,re,ne,ie){var oe=H?H.height*r:n.height;Q=t.width*r,J=t.height*r,e*=r,l*=r,E*=r,S*=r;var ae=J/2/c*(n.height/oe)*-1;ae/=-c*ae*2/n.height;var ce=.5*Q,le=.5*J;e-=ce,l-=le;var ue=z,se=-(i.x-ce)+E,de=i.y-le-S,pe=mat4.create();mat4.perspective(pe,a,o,1,2*-ae),mat4.translate(pe,[se,de,ae]),mat4.translate(pe,[e,-l,0]),mat4.scale(pe,[ue,ue,ue]),mat4.rotateZ(pe,-F),mat4.translate(pe,[-e,l,0]),mat4.rotateY(pe,M),mat4.rotateX(pe,b),u.clearColor(Z[0],Z[1],Z[2],1),u.clear(u.COLOR_BUFFER_BIT);var fe=Y.x*r,he=Y.y*r,ge=Y.width*r,me=Y.height*r,ve=fe,ye=ve+ge,Ee=n.height-he,Te=n.height-(he+me);u.useProgram(s),u.uniform3fv(d,ee),u.uniform3fv(p,te),u.uniform4fv(v,ie.map(function(e,t){return t<3?e/255:e})),u.uniform2f(f,n.width,n.height),u.uniform2f(g,ve,Ee),u.uniform2f(m,ye,Te),u.bindBuffer(u.ARRAY_BUFFER,y),u.vertexAttribPointer(h,2,u.FLOAT,!1,0,0),u.enableVertexAttribArray(h),u.drawArrays(u.TRIANGLE_STRIP,0,4),u.useProgram(O),u.bindFramebuffer(u.FRAMEBUFFER,null),u.bindTexture(u.TEXTURE_2D,N),u.bindBuffer(u.ARRAY_BUFFER,X),u.vertexAttribPointer(U,2,u.FLOAT,!1,0,0),u.enableVertexAttribArray(U),u.bindBuffer(u.ARRAY_BUFFER,K),u.vertexAttribPointer(B,2,u.FLOAT,!1,0,0),u.enableVertexAttribArray(B),u.uniformMatrix4fv(x,!1,pe),u.uniform2f(P,ve,Ee),u.uniform2f(G,ye,Te),u.uniform4fv(L,j),u.uniform1f(k,q),u.uniform4f(D,W[4],W[9],W[14],W[19]),u.uniformMatrix4fv(V,!1,[].concat(_toConsumableArray(W.slice(0,4)),_toConsumableArray(W.slice(5,9)),_toConsumableArray(W.slice(10,14)),_toConsumableArray(W.slice(15,19)))),u.drawArrays(u.TRIANGLE_STRIP,0,$),u.useProgram(T),u.uniform1f(R,re),u.uniform4fv(w,ne),u.uniform2f(I,ve,Ee),u.uniform2f(A,ye,Te),u.bindBuffer(u.ARRAY_BUFFER,C),u.vertexAttribPointer(_,2,u.FLOAT,!1,0,0),u.enableVertexAttribArray(_),u.drawArrays(u.TRIANGLE_STRIP,0,4);}}},createSpringRect=function(e){var t=0,r={},n=spring(e),i=spring(e),o=spring(e),a=spring(e);return n.onupdate=function(e){return r.x=e},n.oncomplete=function(){return t++},i.onupdate=function(e){return r.y=e},i.oncomplete=function(){return t++},o.onupdate=function(e){return r.width=e},o.oncomplete=function(){return t++},a.onupdate=function(e){return r.height=e},a.oncomplete=function(){return t++},{interpolate:function(e){n.interpolate(e),i.interpolate(e),o.interpolate(e),a.interpolate(e);},setTarget:function(e){t=0,n.target=e?e.x:null,i.target=e?e.y:null,o.target=e?e.width:null,a.target=e?e.height:null;},getRect:function(){return _objectSpread({},r)},isStable:function(){return 4===t}}},createSpringColor=function(e){var t=0,r={},n=spring(e),i=spring(e),o=spring(e);return n.onupdate=function(e){return r.r=e},n.oncomplete=function(){return t++},i.onupdate=function(e){return r.g=e},i.oncomplete=function(){return t++},o.onupdate=function(e){return r.b=e},o.oncomplete=function(){return t++},{interpolate:function(e){n.interpolate(e),i.interpolate(e),o.interpolate(e);},setTarget:function(e){t=0,n.target=e?e[0]:null,i.target=e?e[1]:null,o.target=e?e[2]:null;},getColor:function(){return [r.r,r.g,r.b]},isStable:function(){return 3===t}}},ColorSpring={stiffness:.25,damping:.25,mass:2.5},IdentityMatrix=[1,0,0,0,0,0,1,0,0,0,0,0,1,0,0,0,0,0,1,0],imageGL=createView({name:"image-gl",ignoreRect:!0,ignoreRectUpdate:!0,mixins:{apis:["top","left","width","height","xOrigin","yOrigin","xTranslation","yTranslation","xRotation","yRotation","zRotation","scale","overlay","stage","colorMatrix","colorOpacity","overlayOpacity","outlineWidth","isDraft"],animations:{xTranslation:imageOverlaySpring,yTranslation:imageOverlaySpring,xOrigin:imageOverlaySpring,yOrigin:imageOverlaySpring,scale:imageOverlaySpring,xRotation:{type:"spring",stiffness:.25,damping:.25,mass:2.5},yRotation:{type:"spring",stiffness:.25,damping:.25,mass:2.5},zRotation:{type:"spring",stiffness:.25,damping:.25,mass:2.5},colorOpacity:{type:"tween",delay:150,duration:750},overlayOpacity:"spring",introScale:{type:"spring",stiffness:.25,damping:.75,mass:15},outlineWidth:imageOverlaySpring}},create:function(e){var t=e.root;t.ref.canvas=document.createElement("canvas"),t.ref.canvas.width=0,t.ref.canvas.height=0,t.appendChild(t.ref.canvas),t.ref.gl=null,t.introScale=1,t.ref.isPreview="preview"===t.query("GET_STYLE_LAYOUT_MODE"),t.ref.shouldZoom=!t.ref.isPreview,t.ref.didZoom=!1,t.ref.backgroundColor=null,t.ref.backgroundColorSpring=createSpringColor(ColorSpring),t.ref.backgroundColorCenter=null,t.ref.backgroundColorCenterSpring=createSpringColor(ColorSpring),t.ref.overlaySpring=createSpringRect(imageOverlaySpring),t.ref.stageSpring=createSpringRect(imageOverlaySpring),t.ref.outlineSpring=spring(imageOverlaySpring),t.ref.colorMatrixSpring=[],t.ref.colorMatrixStable=!0,t.ref.colorMatrixStableCount=0,t.ref.colorMatrixPositions=[];for(var r=0;r<20;r++)!function(){var e=r,n=spring(ColorSpring);n.target=IdentityMatrix[e],n.onupdate=function(r){t.ref.colorMatrixPositions[e]=r;},n.oncomplete=function(){t.ref.colorMatrixStableCount++;},t.ref.colorMatrixSpring[e]=n;}();t.ref.dragger=createDragger(t.element,function(){t.dispatch("CROP_IMAGE_DRAG_GRAB");},function(e,r){t.dispatch("CROP_IMAGE_DRAG",{value:r});},function(){t.dispatch("CROP_IMAGE_DRAG_RELEASE");},{cancelOnMultiple:!0});var n=0,i=0;t.ref.keyboard=createKeyboard(t.element,function(){return n=0,i=0,{x:0,y:0}},{up:function(e){e.y-=20;},down:function(e){e.y+=20;},left:function(e){e.x-=20;},right:function(e){e.x+=20;},plus:function(){n+=.1,t.dispatch("CROP_IMAGE_RESIZE_AMOUNT",{value:n}),t.dispatch("CROP_IMAGE_RESIZE_RELEASE");},minus:function(){n-=.1,t.dispatch("CROP_IMAGE_RESIZE_AMOUNT",{value:n}),t.dispatch("CROP_IMAGE_RESIZE_RELEASE");},left_bracket:function(){i-=Math.PI/128,t.dispatch("CROP_IMAGE_ROTATE_ADJUST",{value:i});},right_bracket:function(){i+=Math.PI/128,t.dispatch("CROP_IMAGE_ROTATE_ADJUST",{value:i});},h:function(){t.dispatch("CROP_IMAGE_FLIP_HORIZONTAL");},l:function(){t.dispatch("CROP_IMAGE_ROTATE_LEFT");},q:function(){t.dispatch("CROP_RESET");},r:function(){t.dispatch("CROP_IMAGE_ROTATE_RIGHT");},v:function(){t.dispatch("CROP_IMAGE_FLIP_VERTICAL");},z:function(){t.dispatch("CROP_ZOOM");}},function(e){e&&t.dispatch("CROP_IMAGE_DRAG",{value:e});},function(e){e&&t.dispatch("CROP_IMAGE_DRAG_RELEASE");});var o=t.query("GET_FILE"),a=URL.createObjectURL(o.data),c=function(e){var r=scaleImageSize(e,{width:t.query("GET_MAX_IMAGE_PREVIEW_WIDTH"),height:t.query("GET_MAX_IMAGE_PREVIEW_HEIGHT")}),n=createPreviewImage(e,r.width,r.height,o.orientation),i=Math.max(1,.75*window.devicePixelRatio),a=n.height/n.width,c=96*i,l=createPreviewImage(n,a>1?c:c/a,a>1?c*a:c),u=n.getContext("2d").getImageData(0,0,n.width,n.height),s=l.getContext("2d").getImageData(0,0,l.width,l.height);canvasRelease(n),canvasRelease(l),t.ref.gl=setup(t.ref.canvas,u,i),t.ref.gl?(t.dispatch("DID_RECEIVE_IMAGE_DATA",{previewData:u,thumbData:s}),t.dispatch("DID_PRESENT_IMAGE")):t.dispatch("MISSING_WEBGL");},l=function(){loadImage$2(a).then(c);};if(canCreateImageBitmap(o.data)){var u=createWorker(BitmapWorker);u.post({file:o.data},function(e){u.terminate(),e?c(e):l();});}else l();t.ref.canvasStyle=getComputedStyle(t.ref.canvas),t.ref.previousBackgroundColor,t.ref.previousLeft,t.ref.previousTop,t.ref.previousWidth,t.ref.previousHeight,t.element.dataset.showInteractionIndicator=!1,t.ref.handleFocus=function(e){9===e.keyCode&&(t.element.dataset.showInteractionIndicator=!0);},t.ref.handleBlur=function(e){t.element.dataset.showInteractionIndicator=!1;},addEvent(t.element)("keyup",t.ref.handleFocus),addEvent(t.element)("blur",t.ref.handleBlur);},destroy:function(e){var t=e.root;t.ref.gl&&(t.ref.gl.release(),t.ref.gl=null),t.ref.dragger.destroy(),removeEvent(t.element)("keyup",t.ref.handleFocus),removeEvent(t.element)("blur",t.ref.handleBlur);},read:function(e){var t=e.root,r=t.ref.canvasStyle.backgroundColor,n=t.ref.canvasStyle.color;if("transparent"!==n&&""!==n||(n=null),"transparent"!==r&&""!==r||(r=null),r&&r!==t.ref.previousBackgroundColor){var i=toRGBColorArray(r).map(function(e){return e/255}),o=(i[0]+i[1]+i[2])/3;t.ref.backgroundColor=i,t.ref.backgroundColorCenter=i.map(function(e){return o>.5?e-.15:e+.15}),t.ref.previousBackgroundColor=r;}n&&n!==t.ref.previousOutlineColor&&(t.ref.outlineColor=toRGBColorArray(n).map(function(e){return e/255}).concat(1),t.ref.previousOutlineColor=n);},write:createRoute({SHOW_VIEW:function(e){var t=e.root;"crop"===e.action.id?(t.ref.dragger.enable(),t.element.setAttribute("tabindex","0")):(t.ref.dragger.disable(),t.element.removeAttribute("tabindex"));}},function(e){var t=e.root,r=e.props,n=(e.actions,e.timestamp);if(t.ref.gl&&r.width&&r.height){var i=t.ref,o=i.gl,a=i.previousWidth,c=i.previousHeight,l=i.shouldZoom,u=i.stageSpring,s=i.overlaySpring,d=i.backgroundColorSpring,p=i.backgroundColorCenterSpring;r.width===a&&r.height===c||(t.ref.gl.resize(r.width,r.height),t.ref.previousWidth=r.width,t.ref.previousHeight=r.height),r.left===t.ref.previousLeft&&r.top===t.ref.previousTop||(t.ref.canvas.style.transform="translate(".concat(-r.left,"px, ").concat(-r.top,"px)"),t.ref.previousLeft=r.left,t.ref.previousTop=r.top),l&&!t.ref.didZoom&&(t.introScale=null,t.introScale=1.15,t.introScale=1,t.ref.didZoom=!0),d.setTarget(t.ref.backgroundColor),d.interpolate(n);var f=d.isStable();p.setTarget(t.ref.backgroundColorCenter),p.interpolate(n);var h=p.isStable();t.ref.colorMatrixStableCount=0;var g=r.colorMatrix||IdentityMatrix,m=t.ref.colorMatrixSpring.map(function(e,r){return e.target=g[r],e.interpolate(n),t.ref.colorMatrixPositions[r]}),v=20===t.ref.colorMatrixStableCount;r.isDraft&&s.setTarget(null),s.setTarget(r.overlay),s.interpolate(n);var y=s.isStable();r.isDraft&&u.setTarget(null),u.setTarget(r.stage),u.interpolate(n);var E=u.isStable();return o.update(t.xOrigin,t.yOrigin,t.xTranslation+r.left,t.yTranslation+r.top,t.xRotation,t.yRotation,t.zRotation,t.scale*t.introScale,m,t.ref.isPreview?1:t.colorOpacity,u.getRect(),s.getRect(),[1,1,1,1-t.overlayOpacity],d.getColor(),p.getColor(),d.getColor(),t.outlineWidth,t.ref.outlineColor,t.query("GET_BACKGROUND_COLOR")),y&&E&&v&&f&&h}})}),image=createView({name:"image",ignoreRect:!0,mixins:{apis:["offsetTop"]},create:function(e){var t=e.root,r=e.props;t.ref.imageGL=t.appendChildView(t.createChildView(imageGL)),/markup/.test(t.query("GET_UTILS"))&&(t.ref.markup=t.appendChildView(t.createChildView(imageMarkup,{id:r.id,opacity:0,onSelect:function(e){t.dispatch("MARKUP_SELECT",{id:e});},onDrag:function(e,r,n,i,o){t.dispatch("MARKUP_ELEMENT_DRAG",{id:e,origin:r,offset:n,size:i,scale:o});},onResize:function(e,r,n,i,o){t.dispatch("MARKUP_ELEMENT_RESIZE",{id:e,corner:r,origin:n,offset:i,size:o});},onUpdate:function(e,r){t.dispatch("MARKUP_UPDATE",{style:e,value:r});},isMarkupUtil:function(e){var t=e;do{if("doka--markup-tools"===t.className)return !0}while(t=t.parentNode);return !1}}))),t.ref.isModal=/modal/.test(t.query("GET_STYLE_LAYOUT_MODE"));},write:createRoute({DID_PRESENT_IMAGE:function(e){e.root.ref.imageGL.colorOpacity=1;}},function(e){var t=e.root,r=e.props,n=e.timestamp,i=t.ref.imageGL,o=t.ref.markup,a=t.query("GET_CROP",r.id,n);if(a){var c=a.isDraft,l=a.cropRect,u=a.cropStatus,s=a.origin,d=a.translation,p=a.translationBand,f=a.scale,h=a.scaleBand,g=a.rotation,m=a.rotationBand,v=a.flip,y=a.colorMatrix,E=t.query("GET_ROOT"),T=t.query("GET_STAGE"),_=T.x,R=T.y;c&&(i.scale=null,i.zRotation=null,i.xTranslation=null,i.yTranslation=null,i.xOrigin=null,i.yOrigin=null),i.colorMatrix=y;var w=t.query("IS_ACTIVE_VIEW","crop"),I=t.query("IS_ACTIVE_VIEW","markup"),A=w?.75:.95,C=_objectSpread({},l),S=1,O=w?1:5;if(t.query("IS_ACTIVE_VIEW","resize")){var x=u.image.width,b=u.image.height;S=null===x&&null===b?u.crop.width/l.width:null===x?b/l.height:x/l.width,S/=window.devicePixelRatio;var M=l.width*S,L=l.height*S;C.x=C.x+(.5*l.width-.5*M),C.y=C.y+(.5*l.height-.5*L),C.width=M,C.height=L;}var P=t.ref.isModal?0:E.left,G=t.ref.isModal?0:E.top,k=t.ref.isModal?0:E.width-t.rect.element.width,D=t.ref.isModal?0:E.height-t.rect.element.height-r.offsetTop,V=(f+h)*S;i.isDraft=c,i.overlayOpacity=A,i.xOrigin=s.x,i.yOrigin=s.y,i.xTranslation=d.x+p.x+_,i.yTranslation=d.y+p.y+R,i.left=P,i.top=G+r.offsetTop,i.width=t.rect.element.width+k,i.height=t.rect.element.height+D+r.offsetTop,i.scale=V,i.xRotation=v.vertical?Math.PI:0,i.yRotation=v.horizontal?Math.PI:0,i.zRotation=g.main+g.sub+m,i.stage={x:T.x+P,y:T.y+G+r.offsetTop,width:T.width,height:T.height},i.overlay={x:C.x+_+P,y:C.y+R+G+r.offsetTop,width:C.width,height:C.height},i.outlineWidth=O,o&&(c&&(o.translateX=null,o.translateY=null,o.markupX=null,o.markupY=null,o.markupWidth=null,o.markupHeight=null),o.opacity=w?.3:1,o.markupX=C.x+_,o.markupY=C.y+R,o.markupWidth=C.width,o.markupHeight=C.height,o.allowInteraction=I);}})}),createGroup=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:"group",t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:["opacity"],r=arguments.length>2&&void 0!==arguments[2]?arguments[2]:{};return createView({ignoreRect:!0,name:e,mixins:{styles:["opacity"].concat(_toConsumableArray(t)),animations:_objectSpread({opacity:{type:"spring",stiffness:.25,damping:.5,mass:5}},r)},create:function(e){var t=e.root,r=e.props;(r.controls||[]).map(function(e){var r=t.createChildView(e.view,e);e.didCreateView&&e.didCreateView(r),t.appendChildView(r);}),r.element&&t.element.appendChild(r.element);}})},list=createView({ignoreRect:!0,tag:"div",name:"dropdown-list",mixins:{styles:["translateY","opacity"],apis:["selectedValue","options","onSelect"],animations:{translateY:"spring",opacity:{type:"tween",duration:250}}},create:function(e){var t=e.root,r=e.props;t.element.setAttribute("role","list"),t.ref.handleClick=function(){return r.action&&r.action()},t.element.addEventListener("click",t.ref.handleClick),t.ref.activeOptions=null,t.ref.activeSelectedValue;},write:function(e){var t=e.root,r=e.props;if(r.options!==t.ref.activeOptions&&(t.ref.activeOptions=r.options,t.childViews.forEach(function(e){return t.removeChildView(e)}),r.options.map(function(e){var n=t.createChildView(button,_objectSpread({},e,{action:function(){return r.onSelect(e.value)}}));return t.appendChildView(n)})),r.selectedValue!==t.ref.activeSelectedValue){t.ref.activeSelectedValue=r.selectedValue;var n=r.options.findIndex(function(e){return "object"===_typeof(e.value)&&r.selectedValue?JSON.stringify(e.value)===JSON.stringify(r.selectedValue):e.value===r.selectedValue});t.childViews.forEach(function(e,t){e.element.setAttribute("aria-selected",t===n);});}},destroy:function(e){var t=e.root;t.element.removeEventListener("click",t.ref.handleClick);}}),dropdown=createView({ignoreRect:!0,tag:"div",name:"dropdown",mixins:{styles:["opacity"],animations:{opacity:"spring"},apis:["direction","selectedValue","options","onSelect"]},create:function(e){var t=e.root,r=e.props;t.ref.open=!1;var n=function(e){t.ref.open=e,t.dispatch("KICK");};t.ref.button=t.appendChildView(t.createChildView(button,_objectSpread({},r,{action:function(){n(!t.ref.open);}}))),t.ref.list=t.appendChildView(t.createChildView(list,_objectSpread({},r,{opacity:0,action:function(){n(!1);}}))),t.ref.handleBodyClick=function(e){t.element.contains(e.target)||n(!1);},t.element.addEventListener("focusin",function(e){e.target!==t.ref.button.element&&n(!0);}),t.element.addEventListener("focusout",function(e){t.element.contains(e.relatedTarget)||n(!1);}),document.body.addEventListener("click",t.ref.handleBodyClick);},destroy:function(e){var t=e.root;document.body.removeEventListener("click",t.ref.handleBodyClick);},write:function(e){var t=e.root,r=e.props;if(t.ref.list.opacity=t.ref.open?1:0,t.ref.list.selectedValue=r.selectedValue,t.ref.list.options=r.options,"up"===r.direction){var n=t.ref.list.rect.element.height;t.ref.list.translateY=(t.ref.open?-(n+5):-n)-t.rect.element.height;}else t.ref.list.translateY=t.ref.open?0:-5;}}),MAGIC=312,createDiv=function(e,t){return createView({name:e,ignoreRect:!0,create:t})},cropRotatorLine=createView({name:"crop-rotator-line",ignoreRect:!0,ignoreRectUpdate:!0,mixins:{styles:["translateX"],animations:{translateX:"spring"}},create:function(e){for(var t=e.root,r='<svg viewBox="-90 -5 180 10" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">',n=0;n<=180;n+=2){var i=n*(176/180)-90+2,o=n%10==0?.5:.2;if(r+='<circle fill="currentColor" cx="'.concat(i,'" cy="').concat(0,'" r="').concat(o,'"/>'),n%10==0)r+='<text fill="currentColor" x="'.concat(i+(i<0?-2.25:0===i?-.75:-1.5),'" y="').concat(3.5,'">').concat(-90+n,"&deg;</text>");}r+="</svg>",t.element.innerHTML=r;}}),cropRotator=createView({name:"crop-rotator",ignoreRect:!0,mixins:{styles:["opacity","translateY"],animations:{opacity:{type:"spring",damping:.5,mass:5},translateY:"spring"},apis:["rotation","animate","setAllowInteraction"]},create:function(e){var t=e.root,r=e.props;t.element.setAttribute("tabindex",0);var n=document.createElement("button");n.innerHTML="<span>".concat(t.query("GET_LABEL_BUTTON_CROP_ROTATE_CENTER"),"</span>"),n.className="doka--crop-rotator-center",n.addEventListener("click",function(){t.dispatch("CROP_IMAGE_ROTATE_CENTER");}),t.appendChild(n);var i=null;t.appendChildView(t.createChildView(createDiv("crop-rotator-line-mask",function(e){var t=e.root,r=e.props;i=t.appendChildView(t.createChildView(cropRotatorLine,{translateX:Math.round(r.rotation*MAGIC)}));}),r)),t.ref.line=i;var o=document.createElement("div");o.className="doka--crop-rotator-bar",t.appendChild(o);var a=Math.PI/4,c=0;t.ref.dragger=createDragger(o,function(){c=i.translateX/MAGIC,t.dispatch("CROP_IMAGE_ROTATE_GRAB");},function(e,r){var n=r.x/t.rect.element.width*(Math.PI/2),i=limit(c+n,-a,a);t.dispatch("CROP_IMAGE_ROTATE",{value:-i});},function(){t.dispatch("CROP_IMAGE_ROTATE_RELEASE");},{stopPropagation:!0}),r.setAllowInteraction=function(e){e?t.ref.dragger.enable():t.ref.dragger.disable();},t.ref.keyboard=createKeyboard(t.element,function(){c=0;},{left:function(){c+=Math.PI/128,t.dispatch("CROP_IMAGE_ROTATE_ADJUST",{value:c});},right:function(){c-=Math.PI/128,t.dispatch("CROP_IMAGE_ROTATE_ADJUST",{value:c});}},function(){},function(){}),t.ref.prevRotation;},destroy:function(e){var t=e.root;t.ref.dragger.destroy(),t.ref.keyboard.destroy();},write:function(e){var t=e.root,r=e.props,n=e.timestamp,i=r.animate,o=r.rotation;if(t.ref.prevRotation!==o){t.ref.prevRotation=o,i||0===o||(t.ref.line.translateX=null);var a=0,c=t.query("GET_CROP",r.id,n);if(c&&c.interaction&&c.interaction.rotation){var l=splitRotation(c.interaction.rotation).sub-o;a=.025*Math.sign(l)*Math.log10(1+Math.abs(l)/.025);}t.ref.line.translateX=Math.round((-o-a)*MAGIC);}}}),corners=["nw","ne","se","sw"],getOppositeCorner=function(e){return corners[(corners.indexOf(e)+2)%corners.length]},edges=["n","e","s","w"],getOppositeEdge=function(e){return edges[(edges.indexOf(e)+2)%edges.length]},autoPrecision=isBrowser()&&1===window.devicePixelRatio?function(e){return Math.round(e)}:function(e){return e},line=createView({ignoreRect:!0,ignoreRectUpdate:!0,name:"crop-rect-focal-line",mixins:{styles:["translateX","translateY","scaleX","scaleY","opacity"],animations:{translateX:"spring",translateY:"spring",scaleX:"spring",scaleY:"spring",opacity:"spring"}}}),createEdge=function(e){return createView({ignoreRect:!0,ignoreRectUpdate:!0,tag:"div",name:"crop-rect-edge-".concat(e),mixins:{styles:["translateX","translateY","scaleX","scaleY"],apis:["setAllowInteraction"]},create:function(t){var r=t.root,n=t.props;r.element.classList.add("doka--crop-rect-edge"),r.element.setAttribute("tabindex",0),r.element.setAttribute("role","button");var i=e,o=getOppositeEdge(e);r.ref.dragger=createDragger(r.element,function(){r.dispatch("CROP_RECT_DRAG_GRAB");},function(e,t){return r.dispatch("CROP_RECT_EDGE_DRAG",{offset:t,origin:i,anchor:o})},function(){return r.dispatch("CROP_RECT_DRAG_RELEASE")},{stopPropagation:!0,cancelOnMultiple:!0}),n.setAllowInteraction=function(e){e?r.ref.dragger.enable():r.ref.dragger.disable();},r.ref.keyboard=createKeyboard(r.element,function(){return {x:0,y:0}},{up:function(e){e.y-=20;},down:function(e){e.y+=20;},left:function(e){e.x-=20;},right:function(e){e.x+=20;}},function(e){r.dispatch("CROP_RECT_DRAG_GRAB"),r.dispatch("CROP_RECT_EDGE_DRAG",{offset:e,origin:i,anchor:o});},function(){r.dispatch("CROP_RECT_DRAG_RELEASE");});},destroy:function(e){var t=e.root;t.ref.keyboard.destroy(),t.ref.dragger.destroy();}})},createCorner=function(e,t,r){return createView({ignoreRect:!0,ignoreRectUpdate:!0,tag:"div",name:"crop-rect-corner-".concat(e),mixins:{styles:["translateX","translateY","scaleX","scaleY"],animations:{translateX:imageOverlaySpring,translateY:imageOverlaySpring,scaleX:{type:"spring",delay:r},scaleY:{type:"spring",delay:r},opacity:{type:"spring",delay:t}},apis:["setAllowInteraction"]},create:function(t){var r=t.root,n=t.props;r.element.classList.add("doka--crop-rect-corner"),r.element.setAttribute("role","button"),r.element.setAttribute("tabindex",-1);var i=e,o=getOppositeCorner(e);r.ref.dragger=createDragger(r.element,function(){r.dispatch("CROP_RECT_DRAG_GRAB");},function(e,t){r.dispatch("CROP_RECT_CORNER_DRAG",{offset:t,origin:i,anchor:o});},function(){r.dispatch("CROP_RECT_DRAG_RELEASE");},{stopPropagation:!0,cancelOnMultiple:!0}),n.setAllowInteraction=function(e){e?r.ref.dragger.enable():r.ref.dragger.disable();};},destroy:function(e){e.root.ref.dragger.destroy();}})},cropRect=createView({ignoreRect:!0,ignoreRectUpdate:!0,name:"crop-rect",mixins:{apis:["rectangle","draft","rotating","enabled"]},create:function(e){var t=e.root;t.ref.wasRotating=!1;corners.forEach(function(e,r){var n=10*r,i=250+n+50,o=250+n;t.ref[e]=t.appendChildView(t.createChildView(createCorner(e,i,o),{opacity:0,scaleX:.5,scaleY:.5}));}),edges.forEach(function(e){t.ref[e]=t.appendChildView(t.createChildView(createEdge(e)));}),t.ref.lines=[];for(var r=0;r<10;r++)t.ref.lines.push(t.appendChildView(t.createChildView(line,{opacity:0})));t.ref.animationDir=null,t.ref.previousRotating,t.ref.previousRect={},t.ref.previousEnabled,t.ref.previousDraft;},write:function(e){var t=e.root,r=e.props,n=r.rectangle,i=r.draft,o=r.rotating,a=r.enabled;if(n&&(!rectEqualsRect(n,t.ref.previousRect)||o!==t.ref.previousRotating||a!==t.ref.previousEnabled||i!==t.ref.previousDraft)){t.ref.previousRect=n,t.ref.previousRotating=o,t.ref.previousEnabled=a,t.ref.previousDraft=i;var c=t.ref,l=c.n,u=c.e,s=c.s,d=c.w,p=c.nw,f=c.ne,h=c.se,g=c.sw,m=c.lines,v=c.animationDir,y=n.x,E=n.y,T=n.x+n.width,_=n.y+n.height,R=_-E,w=T-y,I=Math.min(w,R);t.element.dataset.indicatorSize=I<80?"none":"default",edges.forEach(function(e){return t.ref[e].setAllowInteraction(a)}),corners.forEach(function(e){return t.ref[e].setAllowInteraction(a)});var A=t.query("IS_ACTIVE_VIEW","crop");if(A&&"in"!==v?(t.ref.animationDir="in",corners.map(function(e){return t.ref[e]}).forEach(function(e){e.opacity=1,e.scaleX=1,e.scaleY=1;})):A||"out"===v||(t.ref.animationDir="out",corners.map(function(e){return t.ref[e]}).forEach(function(e){e.opacity=0,e.scaleX=.5,e.scaleY=.5;})),transformTranslate(i,p,y,E),transformTranslate(i,f,T,E),transformTranslate(i,h,T,_),transformTranslate(i,g,y,_),transformTranslateScale(i,l,y,E,w/100,1),transformTranslateScale(i,u,T,E,1,R/100),transformTranslateScale(i,s,y,_,w/100,1),transformTranslateScale(i,d,y,E,1,R/100),o){t.ref.wasRotating=!0;var C=m.slice(0,5),S=1/C.length;C.forEach(function(e,t){transformTranslateScale(i,e,y,E+R*(S+t*S),w/100,.01),e.opacity=.5;});var O=m.slice(5);S=1/O.length,O.forEach(function(e,t){transformTranslateScale(i,e,y+w*(S+t*S),E,.01,R/100),e.opacity=.5;});}else if(i){t.ref.wasRotating=!1;var x=m[0],b=m[1],M=m[2],L=m[3];transformTranslateScale(i,x,y,E+.333*R,w/100,.01),transformTranslateScale(i,b,y,E+.666*R,w/100,.01),transformTranslateScale(i,M,y+.333*w,E,.01,R/100),transformTranslateScale(i,L,y+.666*w,E,.01,R/100),x.opacity=.5,b.opacity=.5,M.opacity=.5,L.opacity=.5;}else{var P=m[0],G=m[1],k=m[2],D=m[3];!t.ref.wasRotating&&P.opacity>0&&(transformTranslateScale(i,P,y,E+.333*R,w/100,.01),transformTranslateScale(i,G,y,E+.666*R,w/100,.01),transformTranslateScale(i,k,y+.333*w,E,.01,R/100),transformTranslateScale(i,D,y+.666*w,E,.01,R/100)),m.forEach(function(e){return e.opacity=0});}}}}),transformTranslateScale=function(e,t,r,n,i,o){e&&(t.translateX=null,t.translateY=null,t.scaleX=null,t.scaleY=null),t.translateX=autoPrecision(r),t.translateY=autoPrecision(n),t.scaleX=i,t.scaleY=o;},transformTranslate=function(e,t,r,n){e&&(t.translateX=null,t.translateY=null),t.translateX=autoPrecision(r),t.translateY=autoPrecision(n);},setInnerHTML=function(e,t){if(!/svg/.test(e.namespaceURI)||"innerHTML"in e)e.innerHTML=t;else{var r=document.createElement("div");r.innerHTML="<svg>"+t+"</svg>";for(var n=r.firstChild;n.firstChild;)e.appendChild(n.firstChild);}},cropMask=createView({ignoreRect:!0,ignoreRectUpdate:!0,name:"crop-mask",tag:"svg",mixins:{styles:["opacity","translateX","translateY"],animations:{scale:imageOverlaySpring,maskWidth:imageOverlaySpring,maskHeight:imageOverlaySpring,translateX:imageOverlaySpring,translateY:imageOverlaySpring,opacity:{type:"tween",delay:0,duration:1e3}},apis:["rectangle","animate","maskWidth","maskHeight","scale"]},create:function(e){var t=e.root;t.customWriter=t.query("GET_CROP_MASK")(t.element,setInnerHTML)||function(){};},didWriteView:function(e){var t=e.root,r=e.props,n=r.maskWidth,i=r.maskHeight,o=r.scale;if(n&&i){t.element.setAttribute("width",autoPrecision(n)),t.element.setAttribute("height",autoPrecision(i));var a=t.query("GET_CROP_MASK_INSET");t.customWriter({x:o*a,y:o*a,width:n-o*a*2,height:i-o*a*2},{width:n,height:i});}}}),updateText$1=function(e,t){var r=e.childNodes[0];r?t!==r.nodeValue&&(r.nodeValue=t):(r=document.createTextNode(t),e.appendChild(r));},sizeSpring={type:"spring",stiffness:.25,damping:.1,mass:1},cropSize=createView({ignoreRect:!0,name:"crop-size",mixins:{styles:["translateX","translateY","opacity"],animations:{translateX:"spring",translateY:"spring",opacity:"spring",sizeWidth:sizeSpring,sizeHeight:sizeSpring},apis:["sizeWidth","sizeHeight"],listeners:!0},create:function(e){var t=e.root,r=createElement("span");r.className="doka--crop-size-info doka--crop-resize-percentage",t.ref.resizePercentage=r,t.appendChild(r);var n=createElement("span");n.className="doka--crop-size-info";var i=createElement("span");i.className="doka--crop-size-multiply",i.textContent="×";var o=createElement("span"),a=createElement("span");t.ref.outputWidth=o,t.ref.outputHeight=a,n.appendChild(o),n.appendChild(i),n.appendChild(a),t.appendChild(n),t.ref.previousValues={width:0,height:0,percentage:0};},write:function(e){var t=e.root,r=e.props,n=e.timestamp;if(!(t.opacity<=0)){var i=t.query("GET_CROP",r.id,n);if(i){var o=i.cropStatus,a=i.isDraft,c=t.ref,l=c.outputWidth,u=c.outputHeight,s=c.resizePercentage,d=c.previousValues,p=o.image,f=o.crop,h=o.currentWidth,g=o.currentHeight,m=p.width?Math.round(p.width/f.width*100):0;a&&(t.sizeWidth=null,t.sizeHeight=null),t.sizeWidth=h,t.sizeHeight=g;var v=Math.round(t.sizeWidth),y=Math.round(t.sizeHeight);v!==d.width&&(updateText$1(l,v),d.width=v),y!==d.height&&(updateText$1(u,y),d.height=y),m!==d.percentage&&(p.width?updateText$1(s,"".concat(m,"%")):updateText$1(s,""),d.percentage=m);}}}}),wrapper=function(e,t){return createView({ignoreRect:!0,name:e,mixins:t,create:function(e){var t=e.root,r=e.props;r.className&&t.element.classList.add(r.className),r.controls.map(function(e){var r=t.createChildView(e.view,e);e.didCreateView&&e.didCreateView(r),t.appendChildView(r);});}})},getData=function(e){return JSON.parse(localStorage.getItem(e)||"{}")},setStoredValue=function(e,t,r){var n=getData(e);return n[t]=r,localStorage.setItem(e,JSON.stringify(n)),r},getStoredValue=function(e,t,r){var n=getData(e);return void 0===n[t]?r:n[t]},canHover=function(){return window.matchMedia("(pointer: fine) and (hover: hover)").matches},instructionsBubble=createView({ignoreRect:!0,ignoreRectUpdate:!0,name:"instructions-bubble",mixins:{styles:["opacity","translateX","translateY"],animations:{opacity:{type:"tween",duration:400}},apis:["seen"]},create:function(e){var t=e.root,r=e.props;return t.element.innerHTML=(r.iconBefore||"")+r.text},write:function(e){var t=e.root;e.props.seen&&(t.opacity=0);}}),SPRING_TRANSLATE={type:"spring",stiffness:.4,damping:.65,mass:7},cropSubject=createView({name:"crop-subject",ignoreRect:!0,mixins:{styles:["opacity","translateX","translateY"],animations:{opacity:{type:"tween",duration:250},translateX:SPRING_TRANSLATE,translateY:SPRING_TRANSLATE}},create:function(e){var t=e.root,r=e.props;(t.opacity=1,t.ref.timestampOffset=null,t.query("GET_CROP_ALLOW_INSTRUCTION_ZOOM")&&canHover())&&(getStoredValue(t.query("GET_STORAGE_NAME"),"instruction_zoom_shown",!1)||(t.ref.instructions=t.appendChildView(t.createChildView(instructionsBubble,{opacity:0,seen:!1,text:t.query("GET_LABEL_CROP_INSTRUCTION_ZOOM"),iconBefore:createIcon('<rect stroke-width="1.5" fill="none" stroke="currentColor" x="5" y="1" width="14" height="22" rx="7" ry="7"></rect><circle fill="currentColor" stroke="none" cx="12" cy="8" r="2"></circle>')}))));t.query("GET_CROP_MASK")&&(t.ref.maskView=t.appendChildView(t.createChildView(cropMask))),t.query("GET_CROP_ALLOW_RESIZE_RECT")&&(t.ref.cropView=t.appendChildView(t.createChildView(cropRect))),t.query("GET_CROP_SHOW_SIZE")&&(t.ref.cropSize=t.appendChildView(t.createChildView(cropSize,{id:r.id,opacity:1,scaleX:1,scaleY:1,translateX:null}))),t.query("GET_CROP_ZOOM_TIMEOUT")||(t.ref.btnZoom=t.appendChildView(t.createChildView(wrapper("zoom-wrapper",{styles:["opacity","translateX","translateY"],animations:{opacity:{type:"tween",duration:250}}}),{opacity:0,controls:[{view:button,label:t.query("GET_LABEL_BUTTON_CROP_ZOOM"),name:"zoom",icon:createIcon('<g fill="currentColor" fill-rule="nonzero"><path d="M12.5 19a6.5 6.5 0 1 1 0-13 6.5 6.5 0 0 1 0 13zm0-2a4.5 4.5 0 1 0 0-9 4.5 4.5 0 0 0 0 9z"/><path d="M15.765 17.18a1 1 0 1 1 1.415-1.415l3.527 3.528a1 1 0 0 1-1.414 1.414l-3.528-3.527z"/></g>',26),action:function(){return t.dispatch("CROP_ZOOM")}}]})));},write:createRoute({CROP_IMAGE_RESIZE_MULTIPLY:function(e){var t=e.root,r=t.ref.instructions;r&&!r.seen&&(r.seen=!0,setStoredValue(t.query("GET_STORAGE_NAME"),"instruction_zoom_shown",!0));},CROP_RECT_DRAG_RELEASE:function(e){var t=e.root,r=e.props,n=e.timestamp,i=t.ref.btnZoom;if(i){var o=t.query("GET_CROP",r.id,n).cropRect,a=o.x+.5*o.width,c=o.y+.5*o.height;i.translateX=a,i.translateY=c;}}},function(e){var t=e.root,r=e.props,n=e.timestamp,i=t.ref,o=i.cropView,a=i.maskView,c=i.btnZoom,l=i.cropSize,u=i.instructions;if(!t.query("IS_ACTIVE_VIEW","crop")&&o)return o.enabled=!1,t.ref.timestampOffset=null,void(l&&(l.opacity=0));t.ref.timestampOffset||(t.ref.timestampOffset=n);var s=t.query("GET_CROP",r.id,n);if(s){var d=s.cropRect,p=s.isRotating,f=s.isDraft,h=s.scale,g=t.query("GET_STAGE");if(t.translateX=g.x-t.rect.element.left,t.translateY=g.y-t.rect.element.top,o&&(o.draft=f,o.rotating=p,o.rectangle=d,o.enabled=!0),l){l.opacity=1,f&&(l.translateX=null,l.translateY=null);var m=getCropSizeOffset(t.rect.element,l.rect.element,d);l.translateX=f?m.x:autoPrecision(m.x),l.translateY=f?m.y:autoPrecision(m.y);}if(a&&(f&&(a.translateX=null,a.translateY=null,a.maskWidth=null,a.maskHeight=null),a.translateX=autoPrecision(d.x),a.translateY=autoPrecision(d.y),a.maskWidth=d.width,a.maskHeight=d.height,a.scale=h),s.canRecenter)u&&(u.opacity=0),c&&(c.opacity=s.isDraft?0:1);else if(c&&(c.opacity=0),u&&!u.seen&&!s.isDraft){var v=d.x+.5*d.width,y=d.y+.5*d.height;u.translateX=Math.round(v-.5*u.rect.element.width),u.translateY=Math.round(y-.5*u.rect.element.height),n-t.ref.timestampOffset>2e3&&(u.opacity=1);}}})}),getCropSizeOffset=function(e,t,r){var n=r.x,i=r.x+r.width,o=r.y+r.height,a=i-t.width-16,c=o-t.height-16;return t.width>r.width-32&&(a=n+(.5*r.width-.5*t.width),(c=o+16)>e.height-t.height&&(c=o-t.height-16)),{x:a=Math.max(0,Math.min(a,e.width-t.width)),y:c}},now=function(){return performance.now()},throttle=function(e,t){var r=null,n=null;return function(){var i=arguments;if(!n)return e.apply(null,Array.from(arguments)),void(n=now());clearTimeout(r),r=setTimeout(function(){now()-n>=t&&(e.apply(null,Array.from(i)),n=now());},t-(now()-n));}},climb=function(e,t){for(;1===e.nodeType&&!t(e);)e=e.parentNode;return 1===e.nodeType?e:null},isMyTarget=function(e,t){var r=climb(t,function(e){return e.classList.contains("doka--root")});return !!r&&r.contains(e)},updateIndicators=function(e){var t=e.root,r=e.props,n=e.action.position,i=r.pivotPoint,o=t.ref,a=o.indicatorA,c=o.indicatorB,l=i.x-n.x,u=i.y-n.y,s={x:i.x+l,y:i.y+u},d={x:i.x-l,y:i.y-u};a.style.cssText="transform: translate3d(".concat(s.x,"px, ").concat(s.y,"px, 0)"),c.style.cssText="transform: translate3d(".concat(d.x,"px, ").concat(d.y,"px, 0)");},getPositionFromEvent=function(e){return {x:e.pageX,y:e.pageY}},cropResize=createView({ignoreRect:!0,ignoreRectUpdate:!0,name:"crop-resizer",mixins:{apis:["pivotPoint","scrollRect"]},create:function(e){var t=e.root,r=e.props;t.ref.isActive=!1,t.ref.isCropping=!1,t.ref.indicatorA=document.createElement("div"),t.appendChild(t.ref.indicatorA),t.ref.indicatorB=document.createElement("div"),t.appendChild(t.ref.indicatorB);var n=t.query("GET_CROP_RESIZE_KEY_CODES");t.ref.hasEnabledResizeModifier=n.length>0;var i={origin:{x:null,y:null},position:{x:null,y:null},selecting:!1,enabled:!1,scrollY:0,offsetX:0,offsetY:0},o=now();t.ref.state=i;var a=createPointerRegistry(),c=0,l=!1;t.ref.resizeStart=function(e){if(t.ref.isActive&&(0===a.count()&&(l=!1),a.push(e),addEvent$1(document.documentElement,"up",t.ref.resizeEnd),isMyTarget(t.element,e.target)&&a.multiple())){e.stopPropagation(),e.preventDefault();var r=a.active(),n=getPositionFromEvent(r[0]),i=getPositionFromEvent(r[1]);c=vectorDistance(n,i),addEvent$1(document.documentElement,"move",t.ref.resizeMove),l=!0;}},t.ref.resizeMove=function(e){if(t.ref.isActive&&l&&(e.preventDefault(),2===a.count())){a.update(e);var r=a.active(),n=getPositionFromEvent(r[0]),i=getPositionFromEvent(r[1]),o=(vectorDistance(n,i)-c)/c;t.dispatch("CROP_IMAGE_RESIZE",{value:o});}},t.ref.resizeEnd=function(e){if(t.ref.isActive){a.pop(e);var r=0===a.count();r&&(removeEvent$1(document.documentElement,"move",t.ref.resizeMove),removeEvent$1(document.documentElement,"up",t.ref.resizeEnd)),l&&(e.preventDefault(),r&&t.dispatch("CROP_IMAGE_RESIZE_RELEASE"));}},addEvent$1(document.documentElement,"down",t.ref.resizeStart);var u=performance.now(),s=0,d=1,p=throttle(function(e){if(!t.ref.isCropping){var r=Math.sign(e.wheelDelta||e.deltaY),n=now(),i=n-u;u=n,(i>750||s!==r)&&(d=1,s=r),d+=.05*r,t.dispatch("CROP_IMAGE_RESIZE_MULTIPLY",{value:Math.max(.1,d)}),t.dispatch("CROP_IMAGE_RESIZE_RELEASE");}},100);t.ref.wheel=function(e){if(t.ref.isActive&&isMyTarget(t.element,e.target)){if(r.scrollRect){var n=r.scrollRect,i=t.query("GET_ROOT"),o=getPositionFromEvent(e),a={x:o.x-i.leftScroll,y:o.y-i.topScroll};if(a.x<n.x||a.x>n.x+n.width||a.y<n.y||a.y>n.y+n.height)return}e.preventDefault(),p(e);}},document.addEventListener("wheel",t.ref.wheel,{passive:!1}),t.ref.hasEnabledResizeModifier&&(t.ref.move=function(e){if(t.ref.isActive&&!t.ref.isCropping&&(i.position.x=e.pageX-t.ref.state.offsetX,i.position.y=e.pageY-t.ref.state.scrollY-t.ref.state.offsetY,i.enabled))if(isMyTarget(t.element,e.target)){"idle"===t.element.dataset.state&&t.dispatch("RESIZER_SHOW",{position:_objectSpread({},i.position)}),e.preventDefault(),t.dispatch("RESIZER_MOVE",{position:_objectSpread({},i.position)});var n=r.pivotPoint,a=n.x-i.position.x,l=n.y-i.position.y,u={x:n.x+a,y:n.y+l},s=_objectSpread({},i.position);if(i.selecting){var d=(vectorDistance(u,s)-c)/c,p=performance.now();p-o>25&&(o=p,t.dispatch("CROP_IMAGE_RESIZE",{value:d}));}}else t.dispatch("RESIZER_CANCEL");},t.ref.select=function(e){if(t.ref.isActive&&isMyTarget(t.element,e.target)){var n=r.pivotPoint,o=n.x-i.position.x,a=n.y-i.position.y,l={x:n.x+o,y:n.y+a},u=i.position;c=vectorDistance(l,u),i.selecting=!0,i.origin.x=e.pageX,i.origin.y=e.pageY,t.dispatch("CROP_IMAGE_RESIZE_GRAB");}},t.ref.confirm=function(e){t.ref.isActive&&isMyTarget(t.element,e.target)&&(i.selecting=!1,t.dispatch("CROP_IMAGE_RESIZE_RELEASE"));},t.ref.blur=function(){t.ref.isActive&&(i.selecting=!1,i.enabled=!1,document.removeEventListener("mousedown",t.ref.select),document.removeEventListener("mouseup",t.ref.confirm),t.dispatch("RESIZER_CANCEL"));},window.addEventListener("blur",t.ref.blur),document.addEventListener("mousemove",t.ref.move),t.ref.keyDown=function(e){t.ref.isActive&&n.includes(e.keyCode)&&i.position&&(i.enabled=!0,document.addEventListener("mousedown",t.ref.select),document.addEventListener("mouseup",t.ref.confirm),t.dispatch("RESIZER_SHOW",{position:_objectSpread({},i.position)}));},t.ref.keyUp=function(e){t.ref.isActive&&n.includes(e.keyCode)&&(i.enabled=!1,document.removeEventListener("mousedown",t.ref.select),document.removeEventListener("mouseup",t.ref.confirm),t.dispatch("RESIZER_CANCEL"));},document.body.addEventListener("keydown",t.ref.keyDown),document.body.addEventListener("keyup",t.ref.keyUp));},destroy:function(e){var t=e.root;document.removeEventListener("touchmove",t.ref.resizeMove),document.removeEventListener("touchend",t.ref.resizeEnd),document.removeEventListener("touchstart",t.ref.resizeStart),document.removeEventListener("wheel",t.ref.wheel),document.removeEventListener("mousedown",t.ref.select),document.removeEventListener("mouseup",t.ref.confirm),t.ref.hasEnabledResizeModifier&&(document.removeEventListener("mousemove",t.ref.move),document.body.removeEventListener("keydown",t.ref.keyDown),document.body.removeEventListener("keyup",t.ref.keyUp),window.removeEventListener("blur",t.ref.blur));},read:function(e){var t=e.root;t.ref.state.scrollY=window.scrollY;var r=t.element.getBoundingClientRect();t.ref.state.offsetX=r.x,t.ref.state.offsetY=r.y;},write:createRoute({CROP_RECT_DRAG_GRAB:function(e){e.root.ref.isCropping=!0;},CROP_RECT_DRAG_RELEASE:function(e){e.root.ref.isCropping=!1;},SHOW_VIEW:function(e){var t=e.root,r=e.action;t.ref.isActive="crop"===r.id;},RESIZER_SHOW:function(e){var t=e.root,r=e.props,n=e.action;t.element.dataset.state="multi-touch",updateIndicators({root:t,props:r,action:n});},RESIZER_CANCEL:function(e){e.root.element.dataset.state="idle";},RESIZER_MOVE:updateIndicators})}),setOpacity=function(e,t){return e.style.opacity=t},updateImageBoundsIcon=function(e,t){var r=Array.from(e.element.querySelectorAll(".doka--icon-crop-limit rect"));r.length&&(setOpacity(r[0],t?.3:0),setOpacity(r[1],t?1:0),setOpacity(r[2],t?0:.3),setOpacity(r[3],t?0:1));},updateAspectRatioIcon=function(e,t){var r=e.element.querySelectorAll(".doka--icon-aspect-ratio rect");if(r.length){if(!t)return setOpacity(r[0],.2),setOpacity(r[1],.3),void setOpacity(r[2],.4);setOpacity(r[0],t>1?1:.3),setOpacity(r[1],1===t?.85:.5),setOpacity(r[2],t<1?1:.3);}},updateTurnIcons=function(e,t){Array.from(e.element.querySelectorAll(".doka--icon-turn rect")).forEach(function(e){t>1&&(e.setAttribute("x",e.previousElementSibling?5:4),e.setAttribute("width",9)),t<1&&(e.setAttribute("y",11),e.setAttribute("height",10));});},createRectangle=function(e){var t,r;e>1?(r=14,t=Math.round(r/e)):(t=14,r=Math.round(t*e));var n=Math.round(.5*(23-t)),i=Math.round(.5*(23-r));return '<svg width="23" height="23" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g fill="currentColor"><rect x="'.concat(n,'" y="').concat(i,'" width="').concat(t,'" height="').concat(r,'" rx="2.5"/></g></svg>')},cropRoot=createView({name:"crop",ignoreRect:!0,mixins:{apis:["viewId","stagePosition","hidden","offsetTop"]},create:function(e){var t=e.root,r=e.props;r.viewId="crop",r.hidden=!1,t.ref.isHiding=!1;var n=[];t.query("GET_CROP_ALLOW_IMAGE_TURN_LEFT")&&n.push({view:button,name:"tool",label:t.query("GET_LABEL_BUTTON_CROP_ROTATE_LEFT"),icon:createIcon('<g transform="translate(3 2)" fill="currentColor" fill-rule="evenodd" class="doka--icon-turn"><rect y="9" width="12" height="12" rx="1"/><path d="M9.823 5H11a5 5 0 0 1 5 5 1 1 0 0 0 2 0 7 7 0 0 0-7-7H9.626l.747-.747A1 1 0 0 0 8.958.84L6.603 3.194a1 1 0 0 0 0 1.415l2.355 2.355a1 1 0 0 0 1.415-1.414L9.823 5z" fill-rule="nonzero" /></g>',26),action:function(){return t.dispatch("CROP_IMAGE_ROTATE_LEFT")}}),t.query("GET_CROP_ALLOW_IMAGE_TURN_RIGHT")&&n.push({view:button,name:"tool",label:t.query("GET_LABEL_BUTTON_CROP_ROTATE_RIGHT"),icon:createIcon('<g transform="translate(5 2)" fill="currentColor" fill-rule="evenodd" class="doka--icon-turn"><path d="M8.177 5H7a5 5 0 0 0-5 5 1 1 0 0 1-2 0 7 7 0 0 1 7-7h1.374l-.747-.747A1 1 0 0 1 9.042.84l2.355 2.355a1 1 0 0 1 0 1.415L9.042 6.964A1 1 0 0 1 7.627 5.55l.55-.55z" fill-rule="nonzero"/><rect x="6" y="9" width="12" height="12" rx="1"/></g>',26),action:function(){return t.dispatch("CROP_IMAGE_ROTATE_RIGHT")}}),t.query("GET_CROP_ALLOW_IMAGE_FLIP_HORIZONTAL")&&n.push({view:button,name:"tool",label:t.query("GET_LABEL_BUTTON_CROP_FLIP_HORIZONTAL"),icon:createIcon('<g fill="currentColor" fill-rule="evenodd"><path d="M11.93 7.007V20a1 1 0 0 1-1 1H5.78a1 1 0 0 1-.93-1.368l5.15-12.993a1 1 0 0 1 1.929.368z"/><path d="M14 7.007V20a1 1 0 0 0 1 1h5.149a1 1 0 0 0 .93-1.368l-5.15-12.993A1 1 0 0 0 14 7.007z" opacity=".6"/></g>',26),action:function(){return t.dispatch("CROP_IMAGE_FLIP_HORIZONTAL")}}),t.query("GET_CROP_ALLOW_IMAGE_FLIP_VERTICAL")&&n.push({view:button,name:"tool",label:t.query("GET_LABEL_BUTTON_CROP_FLIP_VERTICAL"),icon:createIcon('<g fill="currentColor" fill-rule="evenodd"><path d="M19.993 12.143H7a1 1 0 0 1-1-1V5.994a1 1 0 0 1 1.368-.93l12.993 5.15a1 1 0 0 1-.368 1.93z"/><path d="M19.993 14a1 1 0 0 1 .368 1.93L7.368 21.078A1 1 0 0 1 6 20.148V15a1 1 0 0 1 1-1h12.993z" opacity=".6"/></g>',26),action:function(){return t.dispatch("CROP_IMAGE_FLIP_VERTICAL")}});var i=t.query("GET_CROP_ASPECT_RATIO_OPTIONS");i&&i.length&&n.push({view:dropdown,name:"tool",label:t.query("GET_LABEL_BUTTON_CROP_ASPECT_RATIO"),icon:createIcon('<g class="doka--icon-aspect-ratio" fill="currentColor" fill-rule="evenodd"><rect x="2" y="4" opacity=".3" width="10" height="18" rx="1"/><rect opacity=".5" x="4" y="8" width="14" height="14" rx="1"/><rect x="6" y="12" width="17" height="10" rx="1"/></g>',26),options:null,onSelect:function(e){e.width&&e.height?t.dispatch("RESIZE_SET_OUTPUT_SIZE",{width:e.width,height:e.height}):(t.query("GET_CROP_ASPECT_RATIO_OPTIONS").find(function(e){return e.value&&e.value.width||e.value.height})&&t.dispatch("RESIZE_SET_OUTPUT_SIZE",{width:null,height:null}),t.dispatch("CROP_SET_ASPECT_RATIO",{value:e.aspectRatio}));},didCreateView:function(e){t.ref.aspectRatioDropdown=e;}}),t.query("GET_CROP_ALLOW_TOGGLE_LIMIT")&&n.push({view:dropdown,name:"tool",label:t.query("GET_LABEL_BUTTON_CROP_TOGGLE_LIMIT"),icon:createIcon('<g class="doka--icon-crop-limit" fill="currentColor" fill-rule="evenodd">\n                    <rect x="2" y="3" width="20" height="20" rx="1"/>\n                    <rect x="7" y="8" width="10" height="10" rx="1"/>\n                    <rect x="4" y="8" width="14" height="14" rx="1"/>\n                    <rect x="12" y="4" width="10" height="10" rx="1"/>\n                </g>',26),options:[{value:!0,label:t.query("GET_LABEL_BUTTON_CROP_TOGGLE_LIMIT_ENABLE"),icon:'<svg width="23" height="23" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g fill="currentColor"><rect x="3" y="3" width="17" height="17" rx="2.5" opacity=".3"/><rect x="7" y="7" width="9" height="9" rx="2.5"/></g></svg>'},{value:!1,label:t.query("GET_LABEL_BUTTON_CROP_TOGGLE_LIMIT_DISABLE"),icon:'<svg width="23" height="23" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false"><g fill="currentColor"><rect x="3" y="6" width="13" height="13" rx="2.5" opacity=".3"/><rect x="10" y="3" width="9" height="9" rx="2.5"/></g></svg>'}],onSelect:function(e){t.dispatch("CROP_SET_LIMIT",{value:e});},didCreateView:function(e){t.ref.cropToggleLimitDropdown=e;}}),t.ref.menu=t.appendChildView(t.createChildView(createGroup("toolbar",["opacity"],{opacity:{type:"spring",mass:15,delay:50}}),{opacity:0,controls:n})),t.ref.menuItemsRequiredWidth=null,t.ref.subject=t.appendChildView(t.createChildView(cropSubject,_objectSpread({},r))),t.query("GET_CROP_ALLOW_ROTATE")&&(t.ref.rotator=t.appendChildView(t.createChildView(cropRotator,{rotation:0,opacity:0,translateY:20,id:r.id}))),t.ref.resizer=t.appendChildView(t.createChildView(cropResize,{pivotPoint:{x:0,y:0}})),t.ref.updateControls=function(){var e=t.query("GET_IMAGE");if(updateTurnIcons(t,e.height/e.width),t.ref.cropToggleLimitDropdown&&(t.ref.isLimitedToImageBounds=t.query("GET_CROP_LIMIT_TO_IMAGE_BOUNDS"),updateImageBoundsIcon(t,t.ref.isLimitedToImageBounds),t.ref.cropToggleLimitDropdown.selectedValue=t.ref.isLimitedToImageBounds),t.ref.aspectRatioDropdown){var r=t.query("GET_MIN_IMAGE_SIZE"),n=i.filter(function(t){if(!t.value.aspectRatio)return !0;if(t.value.aspectRatio<1){if(e.naturalWidth*t.value.aspectRatio<r.height)return !1}else if(e.naturalHeight/t.value.aspectRatio<r.width)return !1;return !0});t.ref.aspectRatioDropdown.options=n.map(function(e){return _objectSpread({},e,{icon:createRectangle(e.value.aspectRatio)})});}},t.ref.isModal=/modal|fullscreen/.test(t.query("GET_STYLE_LAYOUT_MODE"));},read:function(e){var t=e.root,r=e.props;if(r.hidden)t.ref.menuItemsRequiredWidth=null;else{var n=t.rect;if(0!==n.element.width&&0!==n.element.height){if(null===t.ref.menuItemsRequiredWidth){var i=t.ref.menu.childViews.reduce(function(e,t){return e+t.rect.outer.width},0);t.ref.menuItemsRequiredWidth=0===i?null:i;}var o=t.ref.subject.rect.element,a=o.left,c=o.top,l=o.width,u=o.height;r.stagePosition={x:a,y:c,width:l,height:u};}}},shouldUpdateChildViews:function(e){var t=e.props,r=e.actions;return !t.hidden||t.hidden&&r&&r.length},write:createRoute({SHOW_VIEW:function(e){var t=e.root,r=e.action,n=e.props,i=t.ref,o=i.menu,a=i.rotator,c=i.subject;n.viewId===r.id?(c.opacity=1,o.opacity=1,a&&(a.opacity=1,a.translateY=0),n.hidden=!1,t.ref.isHiding=!1,t.ref.updateControls()):(c.opacity=0,o.opacity=0,a&&(a.opacity=0,a.translateY=20),t.ref.isHiding=!0);},UNLOAD_IMAGE:function(e){var t=e.root.ref,r=t.menu,n=t.rotator;r.opacity=0,n&&(n.opacity=0,n.translateY=20);},DID_PRESENT_IMAGE:function(e){var t=e.root,r=t.ref,n=r.menu,i=r.rotator;n.opacity=1,i&&(i.opacity=1,i.translateY=0),t.ref.updateControls();}},function(e){var t=e.root,r=e.props,n=e.timestamp,i=t.ref,o=i.resizer,a=i.subject,c=i.menu,l=i.rotator,u=i.isHiding,s=i.cropToggleLimitDropdown,d=i.aspectRatioDropdown,p=r.hidden,f=0===a.opacity&&0===c.opacity&&(!l||l&&0===l.opacity);if(!p&&u&&f&&(t.ref.isHiding=!1,r.hidden=!0),!r.hidden){var h=t.query("GET_CROP",r.id,n);if(h){if(d){var g=t.query("GET_ACTIVE_CROP_ASPECT_RATIO"),m=t.query("GET_SIZE"),v=d.selectedValue;v?(v.aspectRatio!==g&&updateAspectRatioIcon(t,g),v.aspectRatio===g&&v.width===m.width&&v.height===m.height||(d.selectedValue={aspectRatio:g,width:m.width,height:m.height})):(d.selectedValue={aspectRatio:g,width:m.width,height:m.height},updateAspectRatioIcon(t,g));}if(s&&t.ref.isLimitedToImageBounds!==h.isLimitedToImageBounds&&(t.ref.isLimitedToImageBounds=h.isLimitedToImageBounds,updateImageBoundsIcon(t,h.isLimitedToImageBounds),s.selectedValue=h.isLimitedToImageBounds),o.pivotPoint={x:.5*o.rect.element.width,y:.5*o.rect.element.height},l&&(l.animate=!h.isDraft,l.rotation=h.rotation.sub,l.setAllowInteraction(t.query("IS_ACTIVE_VIEW","crop"))),c.element.dataset.layout=t.ref.menuItemsRequiredWidth>t.ref.menu.rect.element.width?"compact":"spacious",t.query("GET_CROP_RESIZE_SCROLL_RECT_ONLY")){var y=t.query("GET_STAGE"),E=y.x,T=y.y,_=t.query("GET_ROOT"),R=t.ref.isModal?_.left:0,w=t.ref.isModal?_.top:0;o.scrollRect={x:R+E+h.cropRect.x,y:w+T+h.cropRect.y+r.offsetTop,width:h.cropRect.width,height:h.cropRect.height};}}}})}),sizeInput=createView({name:"size-input",mixins:{listeners:!0,apis:["id","value","placeholder","getValue","setValue","setPlaceholder","hasFocus","onChange"]},create:function(e){var t=e.root,r=e.props,n=r.id,i=r.min,o=r.max,a=r.value,c=r.placeholder,l=r.onChange,u=void 0===l?function(){}:l,s=r.onBlur,d=void 0===s?function(){}:s,p="doka--".concat(n,"-").concat(getUniqueId()),f=createElement("input",{type:"number",step:1,id:p,min:i,max:o,value:a,placeholder:c}),h=f.getAttribute("max").length,g=createElement("label",{for:p});g.textContent=r.label;var m=function(e,t,r){return isString(e)?((e=e.replace(/[^0-9]/g,"")).length>h&&(e=e.slice(0,h)),e=parseInt(e,10)):e=Math.round(e),isNaN(e)?null:limit(e,t,r)},v=function(e){return e.length?parseInt(f.value,10):null};t.ref.handleInput=function(){f.value=m(f.value,1,o),u(v(f.value));},t.ref.handleBlur=function(){f.value=m(f.value,i,o),d(v(f.value));},f.addEventListener("input",t.ref.handleInput),f.addEventListener("blur",t.ref.handleBlur),t.appendChild(f),t.appendChild(g),t.ref.input=f,r.hasFocus=function(){return f===document.activeElement},r.getValue=function(){return v(f.value)},r.setValue=function(e){return f.value=e?m(e,1,999999):null},r.setPlaceholder=function(e){return f.placeholder=e};},destroy:function(e){var t=e.root;t.ref.input.removeEventListener("input",t.ref.handleInput),t.ref.input.removeEventListener("blur",t.ref.handleBlur);}}),checkboxInput=createView({name:"checkable",tag:"span",mixins:{listeners:!0,apis:["id","checked","onChange","onSetValue","setValue","getValue"]},create:function(e){var t=e.root,r=e.props,n=r.id,i=r.checked,o=r.onChange,a=void 0===o?function(){}:o,c=r.onSetValue,l=void 0===c?function(){}:c,u="doka--".concat(n,"-").concat(getUniqueId()),s=createElement("input",{type:"checkbox",value:1,id:u});s.checked=i,t.ref.input=s;var d=createElement("label",{for:u});d.innerHTML=r.label,t.appendChild(s),t.appendChild(d),t.ref.handleChange=function(){l(s.checked),a(s.checked);},s.addEventListener("change",t.ref.handleChange),r.getValue=function(){return s.checked},r.setValue=function(e){s.checked=e,l(s.checked);},setTimeout(function(){l(s.checked);},0);},destroy:function(e){var t=e.root;t.ref.input.removeEventListener("change",t.ref.handleChange);}}),testResult$1=null,isAndroid=function(){return null===testResult$1&&(testResult$1=/Android/i.test(navigator.userAgent)),testResult$1},resizeForm=createView({ignoreRect:!0,name:"resize-form",tag:"form",mixins:{styles:["opacity"],animations:{opacity:{type:"spring",mass:15,delay:150}}},create:function(e){var t=e.root;t.element.setAttribute("novalidate","novalidate"),t.element.setAttribute("action","#"),t.ref.shouldBlurKeyboard=isIOS()||isAndroid();var r=t.query("GET_SIZE_MAX"),n=t.query("GET_SIZE_MIN"),i=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},i=e.axisLock,o=void 0===i?"none":i,a=e.enforceLimits,c=void 0!==a&&a,l=t.ref,u=l.inputImageWidth,s=l.inputImageHeight,d=l.buttonConfirm,p=t.query("GET_SIZE_ASPECT_RATIO_LOCK"),f=t.query("GET_CROP_RECTANGLE_ASPECT_RATIO"),h={width:u.getValue(),height:s.getValue()},g=limitSize(h,c?n:{width:1,height:1},c?r:{width:999999,height:999999},p?f:null,o);if(p)"width"===o?s.setValue(g.width/f):"height"===o?u.setValue(g.height*f):(u.setValue(g.width||g.height*f),s.setValue(g.height||g.width/f));else if(g.width&&!g.height){var m=Math.round(g.width/f),v=limitSize({width:g.width,height:m},c?n:{width:1,height:1},c?r:{width:999999,height:999999},f,o);c&&u.setValue(Math.round(v.width)),s.setPlaceholder(Math.round(v.height));}else if(g.height&&!g.width){var y=Math.round(g.height*f);u.setPlaceholder(y);}var E=t.query("GET_SIZE_INPUT"),T=E.width,_=E.height,R=isNumber(T)?Math.round(T):null,w=isNumber(_)?Math.round(_):null,I=u.getValue(),A=s.getValue(),C=I!==R||A!==w;return d.opacity=C?1:0,t.dispatch("KICK"),{width:u.getValue(),height:s.getValue()}},o=t;t.appendChildView(t.createChildView(createFieldGroup("Image size",function(e){var t=e.root,a=t.query("GET_SIZE"),c=t.appendChildView(t.createChildView(sizeInput,{id:"image-width",label:t.query("GET_LABEL_RESIZE_WIDTH"),value:isNumber(a.width)?Math.round(a.width):null,min:n.width,max:r.width,placeholder:0,onChange:function(){return i({axisLock:"width"})},onBlur:function(){return i({enforceLimits:!1})}})),l=t.appendChildView(t.createChildView(checkboxInput,{id:"aspect-ratio-lock",label:createIcon('<g fill="none" fill-rule="evenodd"><path stroke="currentColor" stroke-width="1.5" stroke-linecap="round" class="doka--aspect-ratio-lock-ring" d="M9.401 10.205v-.804a2.599 2.599 0 0 1 5.198 0V14"/><rect fill="currentColor" x="7" y="10" width="10" height="7" rx="1.5"/></g>'),checked:t.query("GET_SIZE_ASPECT_RATIO_LOCK"),onSetValue:function(e){var t=e?0:-3;l.element.querySelector(".doka--aspect-ratio-lock-ring").setAttribute("transform","translate(0 ".concat(t,")"));},onChange:function(e){t.dispatch("RESIZE_SET_OUTPUT_SIZE_ASPECT_RATIO_LOCK",{value:e}),i();}})),u=t.appendChildView(t.createChildView(sizeInput,{id:"image-height",label:t.query("GET_LABEL_RESIZE_HEIGHT"),value:isNumber(a.height)?Math.round(a.height):null,min:n.height,max:r.height,placeholder:0,onChange:function(){return i({axisLock:"height"})},onBlur:function(){return i({enforceLimits:!1})}}));o.ref.aspectRatioLock=l,o.ref.inputImageWidth=c,o.ref.inputImageHeight=u;}))),t.ref.buttonConfirm=t.appendChildView(t.createChildView(button,{name:"app action-confirm icon-only",label:t.query("GET_LABEL_RESIZE_APPLY_CHANGES"),action:function(){},opacity:0,icon:createIcon('<polyline fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="20 6 9 17 4 12"></polyline>'),type:"submit"})),t.ref.confirmForm=function(e){var r=i({enforceLimits:!0});e.preventDefault();var n=t.ref,o=n.shouldBlurKeyboard,a=n.buttonConfirm;o&&(document.activeElement.blur(),a.element.focus()),a.opacity=0,t.dispatch("RESIZE_SET_OUTPUT_SIZE",r);},t.element.addEventListener("submit",t.ref.confirmForm);},destroy:function(e){var t=e.root;t.element.removeEventListener("submit",t.ref.confirmForm);},write:createRoute({EDIT_RESET:function(e){var t=e.root,r=t.query("GET_SIZE"),n=t.ref,i=n.inputImageWidth,o=n.inputImageHeight,a=n.aspectRatioLock,c=n.buttonConfirm;i.setValue(r.width),o.setValue(r.height),a.setValue(t.query("GET_SIZE_ASPECT_RATIO_LOCK")),c.opacity=0;},RESIZE_SET_OUTPUT_SIZE:function(e){var t=e.root,r=e.action,n=t.ref,i=n.inputImageWidth,o=n.inputImageHeight;i.setValue(r.width),o.setValue(r.height);},CROP_SET_ASPECT_RATIO:function(e){var t=e.root,r=e.props,n=e.action,i=e.timestamp,o=t.query("GET_CROP",r.id,i);if(o){var a=o.cropStatus,c=t.ref,l=c.inputImageWidth,u=c.inputImageHeight;null!==n.value?(l.setValue(a.image.width),l.setPlaceholder(a.crop.width),u.setValue(a.image.height),u.setPlaceholder(a.crop.height)):l.getValue()&&u.getValue()&&(u.setValue(null),u.setPlaceholder(a.crop.height));}}},function(e){var t=e.root,r=e.props,n=e.timestamp,i=t.query("GET_CROP",r.id,n);if(i){t.opacity;var o=i.cropStatus,a=t.ref,c=a.inputImageWidth,l=a.inputImageHeight;if(!c.hasFocus()&&!l.hasFocus()){var u=t.query("GET_CROP_RECTANGLE_ASPECT_RATIO");if(null===c.getValue()&&null===l.getValue())c.setPlaceholder(o.crop.width),l.setPlaceholder(o.crop.height);else if(null===c.getValue()&&null!==o.image.height){var s=Math.round(o.image.height*u);c.setPlaceholder(s);}else if(null===l.getValue()&&null!==o.image.width){var d=Math.round(o.image.width/u);l.setPlaceholder(d);}}}})}),createFieldGroup=function(e,t){return createView({tag:"fieldset",create:function(r){var n=r.root,i=createElement("legend");i.textContent=e,n.element.appendChild(i),t({root:n});}})},resizeRoot=createView({name:"resize",ignoreRect:!0,mixins:{apis:["viewId","stagePosition","hidden"]},create:function(e){var t=e.root,r=e.props;r.viewId="resize",r.hidden=!1,t.ref.isHiding=!1,t.ref.form=t.appendChildView(t.createChildView(resizeForm,{opacity:0,id:r.id}));},read:function(e){var t=e.root,r=e.props;if(!r.hidden){var n=t.rect;if(0!==n.element.width&&0!==n.element.height){var i=t.ref.form.rect;r.stagePosition={x:n.element.left,y:n.element.top+i.element.height,width:n.element.width,height:n.element.height-i.element.height};}}},shouldUpdateChildViews:function(e){var t=e.props,r=e.actions;return !t.hidden||t.hidden&&r&&r.length},write:createRoute({SHOW_VIEW:function(e){var t=e.root,r=e.action,n=e.props;r.id===n.viewId?(t.ref.isHiding=!1,t.ref.form.opacity=1):(t.ref.isHiding=!0,t.ref.form.opacity=0);}},function(e){var t=e.root,r=e.props,n=t.ref,i=n.form,o=n.isHiding,a=r.hidden;o&&0===i.opacity&&!a?r.hidden=!0:r.hidden=!1;})}),rangeInput=createView({name:"range-input",tag:"span",mixins:{listeners:!0,apis:["onUpdate","setValue","getValue","setAllowInteraction"]},create:function(e){var t=e.root,r=e.props,n=r.id,i=r.min,o=r.max,a=r.step,c=r.value,l=r.onUpdate,u=void 0===l?function(){}:l,s="doka--".concat(n,"-").concat(getUniqueId()),d=createElement("input",{type:"range",id:s,min:i,max:o,step:a});d.value=c,t.ref.input=d;var p=createElement("span");p.className="doka--range-input-inner";var f=createElement("label",{for:s});f.innerHTML=r.label;var h=i+.5*(o-i);t.element.dataset.centered=c===h,t.ref.handleRecenter=function(){r.setValue(h),t.ref.handleChange();};var g=createElement("button",{type:"button"});g.textContent="center",g.addEventListener("click",t.ref.handleRecenter),t.ref.recenter=g,p.appendChild(d),p.appendChild(g),t.appendChild(f),t.appendChild(p),t.ref.handleChange=function(){var e=r.getValue();t.element.dataset.centered=e===h,u(e);},d.addEventListener("input",t.ref.handleChange);var m=null;t.ref.dragger=createDragger(p,function(){m=d.getBoundingClientRect();},function(e){var r=(e.pageX-m.left)/m.width;d.value=i+r*(o-i),t.ref.handleChange();},function(){},{stopPropagation:!0}),r.getValue=function(){return parseFloat(d.value)},r.setValue=function(e){return d.value=e},r.setAllowInteraction=function(e){e?t.ref.dragger.enable():t.ref.dragger.disable();};},destroy:function(e){var t=e.root;t.ref.dragger.destroy(),t.ref.recenter.removeEventListener("click",t.ref.handleRecenter),t.ref.input.removeEventListener("input",t.ref.handleChange);}}),COLOR_TOOLS$1={brightness:{icon:createIcon('<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="7"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></g>')},contrast:{icon:createIcon('<g fill="none" fill-rule="evenodd"><circle stroke="currentColor" stroke-width="3" cx="12" cy="12" r="10"/><path d="M12 2v20C6.477 22 2 17.523 2 12S6.477 2 12 2z" fill="currentColor"/></g>')},exposure:{icon:createIcon('<g fill="none" fill-rule="evenodd"><rect stroke="currentColor" stroke-width="3" x="2" y="2" width="20" height="20" rx="4"/><path d="M20.828 3.172L3.172 20.828A3.987 3.987 0 0 1 2 18V6a4 4 0 0 1 4-4h12c1.105 0 2.105.448 2.828 1.172zM7 7H5v2h2v2h2V9h2V7H9V5H7v2zM12 15h5v2h-5z" fill="currentColor"/></g>')},saturation:{icon:createIcon('<g fill="none" fill-rule="evenodd"><rect stroke="currentColor" stroke-width="3" x="2" y="2" width="20" height="20" rx="4"/><path fill="currentColor" opacity=".3" d="M7 2.5h5v18.75H7z"/><path fill="currentColor" opacity=".6" d="M12 2.5h5v18.75h-5z"/><path fill="currentColor" opacity=".9" d="M17 2.5h4v18.75h-4z"/></g>')}},colorForm=createView({ignoreRect:!0,name:"color-form",tag:"form",mixins:{styles:["opacity"],animations:{opacity:{type:"spring",mass:15}}},create:function(e){var t=e.root;t.element.setAttribute("novalidate","novalidate");var r=t.query("GET_COLOR_VALUES");t.ref.tools=Object.keys(COLOR_TOOLS$1).reduce(function(e,n){var i=n,o=COLOR_TOOLS$1[n].icon,a=t.query("GET_LABEL_COLOR_".concat(n.toUpperCase())),c=t.query("GET_COLOR_".concat(n.toUpperCase(),"_RANGE")),l=r[n];return e[i]={view:t.appendChildView(t.createChildView(rangeInput,{id:i,label:"".concat(o,"<span>").concat(a,"</span>"),min:c[0],max:c[1],step:.01,value:l,onUpdate:function(e){return t.dispatch("COLOR_SET_COLOR_VALUE",{key:i,value:e})}}))},e},{});},write:createRoute({COLOR_SET_VALUE:function(e){var t=e.root,r=e.action;t.ref.tools[r.key].view.setValue(r.value);},SHOW_VIEW:function(e){var t=e.root,r=e.action;Object.keys(t.ref.tools).forEach(function(e){t.ref.tools[e].view.setAllowInteraction("color"===r.id);});}})}),tilePreviewWorker=null,tilePreviewWorkerTerminationTimeout=null,updateColors=function(e,t){var r=t.brightness,n=t.exposure,i=t.contrast,o=t.saturation;if(0!==r){var a=r<0,c=a?"multiply":"overlay",l=a?0:255,u=a?Math.abs(r):1-r;e.ref.imageOverlay.style.cssText="mix-blend-mode: ".concat(c,"; background: rgba(").concat(l,",").concat(l,",").concat(l,",").concat(u,")");}return e.ref.imageOverlay.style.cssText="background:transparent",e.ref.image.style.cssText="filter: brightness(".concat(n,") contrast(").concat(i,") saturate(").concat(o,")"),t},colorKeys=Object.keys(COLOR_TOOLS$1),colorEquals=function(e,t){return colorKeys.findIndex(function(r){return e[r]!==t[r]})<0},createFilterTile=function(e){return createView({ignoreRect:!0,tag:"li",name:"filter-tile",mixins:{styles:["opacity","translateY"],animations:{translateY:{type:"spring",delay:10*e},opacity:{type:"spring",delay:30*e}}},create:function(e){var t=e.root,r=e.props,n="doka--filter-".concat(r.style,"-").concat(getUniqueId()),i=createElement("input",{id:n,type:"radio",name:"filter"});t.appendChild(i),i.checked=r.selected,i.value=r.style,i.addEventListener("change",function(){i.checked&&r.onSelect();});var o=createElement("label",{for:n});o.textContent=r.label,t.appendChild(o);var a=r.imageData,c=Math.min(a.width,a.height),l=c,u=createElement("canvas");u.width=c,u.height=l;var s=u.getContext("2d");t.ref.image=u;var d=createElement("div");t.ref.imageOverlay=d;var p={x:.5*c-.5*a.width,y:.5*l-.5*a.height},f=createElement("div");f.appendChild(u),f.appendChild(d),t.appendChild(f),t.ref.imageWrapper=f,r.matrix?(tilePreviewWorker||(tilePreviewWorker=createWorker(TransformWorker)),clearTimeout(tilePreviewWorkerTerminationTimeout),tilePreviewWorker.post({transforms:[{type:"filter",data:r.matrix}],imageData:a},function(e){s.putImageData(e,p.x,p.y),clearTimeout(tilePreviewWorkerTerminationTimeout),tilePreviewWorkerTerminationTimeout=setTimeout(function(){tilePreviewWorker.terminate(),tilePreviewWorker=null;},1e3);},[a.data.buffer]),t.ref.activeColors=updateColors(t,t.query("GET_COLOR_VALUES"))):s.putImageData(a,p.x,p.y);},write:function(e){var t=e.root;if(!(t.opacity<=0)){var r=t.query("GET_COLOR_VALUES"),n=t.ref.activeColors;(!n&&r||!colorEquals(n,r))&&(t.ref.activeColors=r,updateColors(t,r));}}})},cloneImageData=function(e){var t;try{t=new ImageData(e.width,e.height);}catch(r){t=document.createElement("canvas").getContext("2d").createImageData(e.width,e.height);}return t.data.set(new Uint8ClampedArray(e.data)),t},arrayEqual=function(e,t){return Array.isArray(e)&&Array.isArray(t)&&e.length===t.length&&e.every(function(e,r){return e===t[r]})},filterList=createView({ignoreRect:!0,tag:"ul",name:"filter-list",mixins:{apis:["filterOpacity","hidden"]},create:function(e){var t=e.root,r=e.props;t.element.setAttribute("role","list"),t.ref.tiles=[];var n=t.query("GET_THUMB_IMAGE_DATA"),i=t.query("GET_FILTERS"),o=[];forin(i,function(e,t){o.push(_objectSpread({id:e},t));}),t.ref.activeFilter=t.query("GET_FILTER"),t.ref.tiles=o.map(function(e,i){var o=e.matrix(),a=t.ref.activeFilter===e.id||arrayEqual(t.ref.activeFilter,o)||0===i;return t.appendChildView(t.createChildView(createFilterTile(i),{opacity:0,translateY:-5,id:r.id,style:e.id,label:e.label,matrix:o,imageData:cloneImageData(n),selected:a,onSelect:function(){return t.dispatch("FILTER_SET_FILTER",{value:o?e.id:null})}}))});},write:function(e){var t=e.root,r=e.props;if(!r.hidden){var n=t.query("GET_FILTER");if(n!==t.ref.activeFilter){t.ref.activeFilter=n;var i=t.query("GET_FILTERS"),o=n?isString(n)?n:isColorMatrix(n)?Object.keys(i).find(function(e){return arrayEqual(i[e].matrix(),n)}):null:"original";Array.from(t.element.querySelectorAll("input")).forEach(function(e){return e.checked=e.value===o});}t.query("IS_ACTIVE_VIEW","filter")?t.ref.tiles.forEach(function(e){e.opacity=1,e.translateY=0;}):t.ref.tiles.forEach(function(e){e.opacity=0,e.translateY=-5;}),r.filterOpacity=t.ref.tiles.reduce(function(e,t){return e+t.opacity},0)/t.ref.tiles.length;}}}),filterScroller=createView({name:"filter-scroller",ignoreRect:!0,ignoreRectUpdate:!0,mixins:{styles:["opacity"],animations:{opacity:{type:"spring"}},apis:["hidden","filterOpacity"]},create:function(e){var t,r=e.root,n=e.props;(r.ref.filters=r.appendChildView(r.createChildView(filterList,{id:n.id})),r.element.isScrollContainer=!0,canHover())&&(r.ref.handleMouseWheel=function(e){var t=r.element.scrollLeft,n=r.ref.scrollWidth-r.rect.element.width,i=t+e.deltaX;(i<0||i>n)&&(r.element.scrollLeft=Math.min(Math.max(i,0),n),e.preventDefault());},r.element.addEventListener("mousewheel",r.ref.handleMouseWheel),r.element.dataset.dragState="end",r.ref.dragger=createDragger(r.ref.filters.element,function(){r.element.dataset.dragState="start",t=r.element.scrollLeft;},function(e,n){r.element.scrollLeft=t-n.x,vectorDistanceSquared({x:0,y:0},n)>0&&(r.element.dataset.dragState="dragging");},function(){r.element.dataset.dragState="end";},{stopPropagation:!0}));},destroy:function(e){var t=e.root;t.ref.handleMouseWheel&&t.element.removeEventListener("mousewheel",t.ref.handleMouseWheel),t.ref.dragger&&t.ref.dragger.destroy();},read:function(e){var t=e.root;t.ref.scrollWidth=t.element.scrollWidth;},write:function(e){var t=e.root,r=e.props;t.ref.filters.hidden=r.hidden,r.filterOpacity=t.ref.filters.filterOpacity;}}),filterRoot=createView({name:"filter",ignoreRect:!0,mixins:{apis:["viewId","stagePosition","hidden"]},create:function(e){var t=e.root,r=e.props;r.viewId="filter",r.hidden=!1,t.ref.isHiding=!1,t.ref.filters=t.appendChildView(t.createChildView(filterScroller,{id:r.id}));},read:function(e){var t=e.root,r=e.props;if(t.ref.filters&&!r.hidden){var n=t.rect;if(0!==n.element.width&&0!==n.element.height){var i=t.ref.filters.rect,o=0===i.element.top,a=o?n.element.top+i.element.height+i.element.marginBottom:n.element.top,c=o?n.element.height-i.element.height-i.element.marginBottom:n.element.height-i.element.height-n.element.top;r.stagePosition={x:n.element.left,y:a,width:n.element.width,height:c};}}},shouldUpdateChildViews:function(e){var t=e.props,r=e.actions;return !t.hidden||t.hidden&&r&&r.length},write:createRoute({SHOW_VIEW:function(e){var t=e.root,r=e.action,n=e.props;t.ref.filters&&(r.id===n.viewId?(t.ref.isHiding=!1,n.hidden=!1,t.ref.filters.hidden=!1):t.ref.isHiding=!0);}},function(e){var t=e.root,r=e.props;t.ref.filters.opacity=t.ref.isHiding||t.ref.filters.hidden?0:1,t.ref.isHiding&&t.ref.filters.filterOpacity<=0&&(t.ref.isHiding=!1,r.hidden=!0,t.ref.filters.hidden=!0);})}),colorRoot=createView({name:"color",ignoreRect:!0,mixins:{apis:["viewId","stagePosition","hidden"]},create:function(e){var t=e.root,r=e.props;r.viewId="color",r.hidden=!1,t.ref.isHiding=!1,t.ref.form=t.appendChildView(t.createChildView(colorForm,{opacity:0,id:r.id}));},read:function(e){var t=e.root,r=e.props;if(!r.hidden){var n=t.rect;if(0!==n.element.width&&0!==n.element.height){var i=t.ref.form.rect,o=i.element.height,a=0===i.element.top,c=a?n.element.top+o:n.element.top,l=a?n.element.height-o:n.element.height-o-n.element.top;r.stagePosition={x:n.element.left+i.element.left,y:c,width:n.element.width-i.element.left,height:l};}}},shouldUpdateChildViews:function(e){var t=e.props,r=e.actions;return !t.hidden||t.hidden&&r&&r.length},write:createRoute({SHOW_VIEW:function(e){var t=e.root,r=e.action,n=e.props;r.id===n.viewId?(t.ref.isHiding=!1,t.ref.form.opacity=1,n.hidden=!1):(t.ref.isHiding=!0,t.ref.form.opacity=0);}},function(e){var t=e.root,r=e.props;t.ref.isHiding&&0===t.ref.form.opacity&&(t.ref.isHiding=!1,r.hidden=!0);})}),supportsColorPicker=function(){try{var e=createElement("input",{type:"color"}),t="color"===e.type;return /^((?!chrome|android).)*safari/i.test(navigator.userAgent)?t:t&&"number"!=typeof e.selectionStart}catch(e){return !1}},toHSL=function(e,t,r){var n,i=Math.max(e,t,r),o=Math.min(e,t,r),a=i-o,c=0===i?0:a/i,l=i/255;switch(i){case o:n=0;break;case e:n=t-r+a*(t<r?6:0),n/=6*a;break;case t:n=r-e+2*a,n/=6*a;break;case r:n=e-t+4*a,n/=6*a;}return [n,c,l]},markupColor=createView({ignoreRect:!0,tag:"div",name:"markup-color",mixins:{animations:{opacity:"spring"},styles:["opacity"],apis:["onSelect","selectedValue"]},create:function(e){var t=e.root,r=e.props,n=r.colors,i=r.name,o=r.onSelect;t.ref.handleChange=function(e){o(e.target.value),e.stopPropagation();},t.element.addEventListener("change",t.ref.handleChange);var a=createElement("ul");if(t.ref.inputs=n.map(function(e){var t="doka--color-"+getUniqueId(),r=createElement("li"),n=createElement("input",{id:t,name:i,type:"radio",value:e[1]}),o=createElement("label",{for:t,title:e[0],style:"background-color: "+(e[2]||e[1])});return o.textContent=e[0],appendChild(r)(n),appendChild(r)(o),appendChild(a)(r),n}),t.element.appendChild(a),t.query("GET_MARKUP_ALLOW_CUSTOM_COLOR")&&supportsColorPicker()){var c=createElement("div",{class:"doka--color-input"}),l="doka--color-"+getUniqueId(),u=createElement("label",{for:l});u.textContent="Choose color";var s=createElement("input",{id:l,name:i,type:"color"}),d=createElement("span",{class:"doka--color-visualizer"}),p=createElement("span",{class:"doka--color-brightness"});t.ref.handleCustomColorChange=function(){var e=toRGBColorArray(s.value),t=toHSL.apply(void 0,_toConsumableArray(e)),r=360*t[0]-90,n=.625*t[1],i=1-t[2];d.style.backgroundColor=s.value,d.style.transform="rotateZ(".concat(r,"deg) translateX(").concat(n,"em)"),p.style.opacity=i,o(s.value);};var f=!0;t.ref.handleCustomColorSelect=function(e){f?o(e.target.value):t.ref.handleCustomColorChange(),f=!1;},s.addEventListener("click",t.ref.handleCustomColorSelect),s.addEventListener("input",t.ref.handleCustomColorChange),appendChild(c)(s),appendChild(c)(u),appendChild(c)(d),appendChild(c)(p),t.appendChild(c),t.ref.customInput=s;}},write:function(e){var t=e.root,r=e.props;if(r.selectedValue!==t.ref.activeSelectedValue){t.ref.activeSelectedValue=r.selectedValue;var n=!1;if(t.ref.inputs.forEach(function(e){e.checked=e.value===r.selectedValue,e.checked&&(n=!0);}),!t.ref.customInput)return;t.ref.customInput.dataset.selected=t.ref.inputs.length&&!n,n||(t.ref.customInput.value=r.selectedValue,t.ref.handleCustomColorChange());}},destroy:function(e){var t=e.root;t.element.removeEventListener("change",t.ref.handleChange),t.ref.customInput&&(t.ref.customInput.removeEventListener("click",t.ref.handleCustomColorSelect),t.ref.customInput.removeEventListener("input",t.ref.handleCustomColorChange));}}),showDrawTool=function(e){var t=e.ref,r=t.colorSelect,n=t.fontFamilySelect,i=t.fontSizeSelect,o=t.shapeStyleSelect,a=t.lineStyleSelect;[n,i,o,t.lineDecorationSelect].forEach(function(e){e.element.dataset.active="false";}),[r,a].forEach(function(e){e.element.dataset.active="true";});},ALL_SETTINGS=["fontFamily","fontSize","fontWeight","textAlign","backgroundColor","fontColor","borderColor","borderWidth","borderStyle","lineColor","lineWidth","lineDecoration","lineJoin","lineCap"],createSVG=function(e){return '<svg width="23" height="23" xmlns="http://www.w3.org/2000/svg" aria-hidden="true" focusable="false">'.concat(e,"</svg>")},createShapeStyleIcon=function(e){var t=0===e?"currentColor":"none",r=e;return createSVG('<rect stroke="'.concat(0===e?"none":"currentColor",'" fill="').concat(t,'" stroke-width="').concat(r,'" x="2" y="3" width="17" height="17" rx="3"/>'))},createLineStyleIcon=function(e){return createSVG('<line stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" stroke-width="'.concat(e,'" x1="3" y1="12" x2="20" y2="12"/>'))},markupTools=createView({name:"markup-tools",ignoreRect:!0,mixins:{apis:["onUpdate"],animations:{translateY:"spring",opacity:"spring"},styles:["translateY","opacity"]},create:function(e){var t=e.root,r=e.props.onUpdate;t.ref.colorSelect=t.appendChildView(t.createChildView(markupColor,{onSelect:function(e){t.ref.colorSelect.selectedValue=e,r("color",e);},name:"color-select",colors:t.query("GET_MARKUP_COLOR_OPTIONS")})),t.ref.shapeStyleSelect=t.appendChildView(t.createChildView(dropdown,{onSelect:function(e){t.ref.shapeStyleSelect.selectedValue=e,r("shapeStyle",[e[1],e[2]]);},name:"tool",label:t.query("GET_LABEL_MARKUP_SELECT_SHAPE_STYLE"),direction:"up",options:t.query("GET_MARKUP_SHAPE_STYLE_OPTIONS").map(function(e){return {value:e,label:e[0],icon:createShapeStyleIcon(e[3])}})})),t.ref.lineStyleSelect=t.appendChildView(t.createChildView(dropdown,{onSelect:function(e){t.ref.lineStyleSelect.selectedValue=e,r("lineStyle",[e[1],e[2]]);},name:"tool",label:t.query("GET_LABEL_MARKUP_SELECT_LINE_STYLE"),direction:"up",options:t.query("GET_MARKUP_LINE_STYLE_OPTIONS").map(function(e){return {value:e,label:e[0],icon:createLineStyleIcon(e[3])}})})),t.ref.lineDecorationSelect=t.appendChildView(t.createChildView(dropdown,{onSelect:function(e){t.ref.lineDecorationSelect.selectedValue=e,r("lineDecoration",e);},name:"tool",label:t.query("GET_LABEL_MARKUP_SELECT_LINE_DECORATION"),direction:"up",options:t.query("GET_MARKUP_LINE_DECORATION_OPTIONS").map(function(e){return {value:e[1],label:e[0]}})})),t.ref.fontFamilySelect=t.appendChildView(t.createChildView(dropdown,{onSelect:function(e){t.ref.fontFamilySelect.selectedValue=e,r("fontFamily",e);},name:"tool",label:t.query("GET_LABEL_MARKUP_SELECT_FONT_FAMILY"),direction:"up",options:t.query("GET_MARKUP_FONT_FAMILY_OPTIONS").map(function(e){return {value:e[1],label:'<span style="font-family:'.concat(e[1],';font-weight:600;">').concat(e[0],"</span>")}})})),t.ref.fontSizeSelect=t.appendChildView(t.createChildView(dropdown,{onSelect:function(e){t.ref.fontSizeSelect.selectedValue=e,r("fontSize",e);},name:"tool",label:t.query("GET_LABEL_MARKUP_SELECT_FONT_SIZE"),direction:"up",options:t.query("GET_MARKUP_FONT_SIZE_OPTIONS").map(function(e){return {value:e[1],label:e[0]}})})),"draw"===t.query("GET_MARKUP_UTIL")&&showDrawTool(t);},write:createRoute({SWITCH_MARKUP_UTIL:function(e){var t=e.root;"draw"===e.action.util&&showDrawTool(t);},MARKUP_SELECT:function(e){var t=e.root,r=e.action,n=t.ref,i=n.colorSelect,o=n.fontFamilySelect,a=n.fontSizeSelect,c=n.shapeStyleSelect,l=n.lineStyleSelect,u=n.lineDecorationSelect,s=r.id?t.query("GET_MARKUP_BY_ID",r.id):null,d=[i,o,a,c,l,u],p=[];if(s){var f=_slicedToArray(s,2),h=f[0],g=f[1],m=Array.isArray(g.allowEdit)?g.allowEdit:!1===g.allowEdit?[]:ALL_SETTINGS,v=ALL_SETTINGS.reduce(function(e,t){return e[t]=-1!==m.indexOf(t),e},{});if(v.color=!!m.find(function(e){return /[a-z]Color/.test(e)}),"image"!==h&&v.color&&(i.selectedValue=getColor$2(g),p.push(i)),"text"===h&&(v.fontFamily&&(o.selectedValue=g.fontFamily,p.push(o)),v.fontSize&&(a.selectedValue=g.fontSize,p.push(a))),("rect"===h||"ellipse"===h)&&v.borderStyle){var y=t.query("GET_MARKUP_SHAPE_STYLE_OPTIONS").find(function(e){var t=g.borderWidth===e[1],r=g.borderStyle===e[2]||arrayEqual(g.borderStyle,e[2]);return t&&r});c.selectedValue=y,p.push(c);}if("line"===h||"path"===h){if(v.lineWidth){var E=t.query("GET_MARKUP_LINE_STYLE_OPTIONS").find(function(e){var t=g.lineWidth===e[1],r=g.lineStyle===e[2]||arrayEqual(g.lineStyle,e[2]);return t&&r});l.selectedValue=E,p.push(l);}"line"===h&&v.lineDecoration&&(u.selectedValue=g.lineDecoration,p.push(u));}d.forEach(function(e){e.element.dataset.active="false";}),p.forEach(function(e){e.element.dataset.active="true";});}},MARKUP_UPDATE:function(e){var t=e.root,r=e.action,n=r.style,i=r.value;t.ref[n+"Select"]&&(t.ref[n+"Select"].selectedValue=i);}})}),getColor$2=function(e){var t=e.fontColor,r=e.backgroundColor,n=e.lineColor,i=e.borderColor;return t||r||n||i},markupRoot=createView({name:"markup",ignoreRect:!0,mixins:{apis:["viewId","stagePosition","hidden"]},create:function(e){var t=e.root,r=e.props;r.viewId="markup",r.hidden=!1,t.ref.isHiding=!1;var n=[["select",{label:t.query("GET_LABEL_MARKUP_TOOL_SELECT"),icon:createIcon('<g fill="none" fill-rule="evenodd"><path d="M7 13H5a1 1 0 01-1-1V5a1 1 0 011-1h7a1 1 0 011 1v2" stroke="currentColor" stroke-width="2" stroke-linecap="round"/><path d="M10.22 8.914l12.58 5.18a1 1 0 01.012 1.844l-4.444 1.904a1 1 0 00-.526.526l-1.904 4.444a1 1 0 01-1.844-.013l-5.18-12.58a1 1 0 011.305-1.305z" fill="currentColor"/></g>',26)}],["draw",{label:t.query("GET_LABEL_MARKUP_TOOL_DRAW"),icon:createIcon('<g fill="currentColor"><path d="M17.86 5.71a2.425 2.425 0 013.43 3.43L9.715 20.714 5 22l1.286-4.715L17.86 5.71z"/></g>',26)}],["line",{label:t.query("GET_LABEL_MARKUP_TOOL_LINE"),icon:createIcon('<g transform="translate(3 4.5)" fill-rule="nonzero" fill="currentColor" stroke="none"><path d="M15.414 9.414l-6.01 6.01a2 2 0 1 1-2.829-2.828L9.172 10H2a2 2 0 1 1 0-4h7.172L6.575 3.404A2 2 0 1 1 9.404.575l6.01 6.01c.362.363.586.863.586 1.415s-.224 1.052-.586 1.414z"/></g>',26)}],["text",{label:t.query("GET_LABEL_MARKUP_TOOL_TEXT"),icon:createIcon('<g transform="translate(5 5)" fill="currentColor" fill-rule="evenodd"><path d="M10 4v11a1 1 0 0 1-1 1H7a1 1 0 0 1-1-1V4H1a1 1 0 0 1-1-1V1a1 1 0 0 1 1-1h14a1 1 0 0 1 1 1v2a1 1 0 0 1-1 1h-5z"/></g>',26)}],["rect",{label:t.query("GET_LABEL_MARKUP_TOOL_RECT"),icon:createIcon('<g fill="currentColor"><rect x="5" y="5" width="16" height="16" rx="2"/></g>',26)}],["ellipse",{label:t.query("GET_LABEL_MARKUP_TOOL_ELLIPSE"),icon:createIcon('<g fill="currentColor"><circle cx="13" cy="13" r="9"/></g>',26)}]];t.ref.utils=createElement("fieldset"),t.ref.utils.className="doka--markup-utils",t.ref.utilsList=createElement("ul");var i="markup-utils-".concat(getUniqueId());t.ref.inputs=n.map(function(e){var r=e[0],n=e[1],o="doka--markup-tool-"+getUniqueId(),a=createElement("li"),c=createElement("input");c.id=o,c.checked=t.query("GET_MARKUP_UTIL")===r,c.setAttribute("type","radio"),c.setAttribute("name",i),c.value=r;var l=createElement("label");return l.setAttribute("for",o),l.className="doka--button-tool",l.innerHTML=n.icon+"<span>"+n.label+"</span>",l.title=n.label,a.appendChild(c),a.appendChild(l),t.ref.utilsList.appendChild(a),c}),t.ref.utils.appendChild(t.ref.utilsList),t.ref.utilsList.addEventListener("change",function(e){t.dispatch("SET_MARKUP_UTIL",{value:e.target.value});}),t.query("GET_MARKUP_ALLOW_ADD_MARKUP")&&(t.ref.menu=t.appendChildView(t.createChildView(createGroup("toolbar",["opacity"],{opacity:{type:"spring",mass:15,delay:50}}),{opacity:0,element:t.ref.utils})));var o=t.ref.tools=t.appendChildView(t.createChildView(markupTools,{opacity:0,onUpdate:function(e,r){t.dispatch("MARKUP_UPDATE",{style:e,value:r});}}));t.ref.menuItemsRequiredWidth=null,"draw"===t.query("GET_MARKUP_UTIL")&&(o.opacity=1,o.translateY=0,o.element.dataset.active="true");},read:function(e){var t=e.root,r=e.props;if(r.hidden)t.ref.menuItemsRequiredWidth=null;else{var n=t.rect;if(0!==n.element.width&&0!==n.element.height){if(t.ref.menu&&null===t.ref.menuItemsRequiredWidth){var i=t.ref.menu.rect.element.width;t.ref.menuItemsRequiredWidth=0===i?null:i;}var o=t.ref.menu&&t.ref.menu.rect,a=t.ref.tools.rect.element.height,c=o?o.element.height:a,l=!o||0===o.element.top,u=l?n.element.top+c:n.element.top,s=l?n.element.height-c:n.element.height-c-n.element.top;r.stagePosition={x:n.element.left+20,y:u,width:n.element.width-40,height:s-a};}}},shouldUpdateChildViews:function(e){var t=e.props,r=e.actions;return !t.hidden||t.hidden&&r&&r.length},write:createRoute({SHOW_VIEW:function(e){var t=e.root,r=e.action,n=e.props;r.id===n.viewId?(n.hidden=!1,t.ref.isHiding=!1,t.ref.menu&&(t.ref.menu.opacity=1)):(t.ref.isHiding=!0,t.ref.menu&&(t.ref.menu.opacity=0),t.ref.tools.opacity=0,t.ref.tools.translateY=5);},MARKUP_SELECT:function(e){var t=e.root,r=e.action;t.ref.tools.opacity=r.id?1:0,t.ref.tools.translateY=r.id?0:5,t.ref.tools.element.dataset.active=r.id?"true":"false";},DID_SET_MARKUP_UTIL:function(e){var t=e.root,r=e.action,n=t.ref,i=n.inputs,o=n.tools;i.forEach(function(e){e.checked=e.value===r.value;}),"draw"===r.value&&(o.opacity=1,o.translateY=0,o.element.dataset.active="true");}},function(e){var t=e.root,r=e.props;t.ref.isHiding&&t.ref.menu&&0===t.ref.menu.opacity&&(t.ref.isHiding=!1,r.hidden=!0),r.hidden||(t.ref.menu.element.dataset.layout=t.ref.menuItemsRequiredWidth>t.rect.element.width?"compact":"spacious");})}),hasStagePositionChanged=function(e,t){return !e||!t||!rectEqualsRect(e,t)},VIEW_MAP={crop:cropRoot,resize:resizeRoot,filter:filterRoot,color:colorRoot,markup:markupRoot},viewStack=createView({name:"view-stack",ignoreRect:!0,mixins:{apis:["offsetTop"]},create:function(e){var t=e.root;t.ref.activeView=null,t.ref.activeStagePosition=null,t.ref.shouldFocus=!1;},write:createRoute({SHOW_VIEW:function(e){var t=e.root,r=e.props,n=e.action,i=0===t.childViews.length,o=t.childViews.find(function(e){return e.viewId===n.id});o||(o=t.appendChildView(t.createChildView(VIEW_MAP[n.id],_objectSpread({},r)))),t.ref.activeView=o,t.childViews.map(function(e){return e.element}).forEach(function(e){e.dataset.viewActive="false",e.removeAttribute("tabindex");});var a=t.ref.activeView.element;a.dataset.viewActive="true",a.setAttribute("tabindex",-1),t.ref.shouldFocus=!i;},DID_PRESENT_IMAGE:function(e){var t=e.root;t.dispatch("CHANGE_VIEW",{id:t.query("GET_UTIL")||t.query("GET_UTILS")[0]});},DID_SET_UTILS:function(e){var t=e.root;t.dispatch("CHANGE_VIEW",{id:t.query("GET_UTIL")||t.query("GET_UTILS")[0]});}},function(e){var t=e.root,r=e.props,n=t.ref,i=n.activeView,o=n.previousStagePosition;if(i&&i.stagePosition&&(t.childViews.forEach(function(e){e.offsetTop=r.offsetTop,e.element.viewHidden!==e.hidden&&(e.element.viewHidden=e.hidden,e.element.dataset.viewHidden=e.hidden);}),hasStagePositionChanged(i.stagePosition,o))){var a=i.stagePosition,c=a.x,l=a.y,u=a.width,s=a.height;if(0===u&&0===s)return;t.dispatch("DID_RESIZE_STAGE",{offset:{x:c,y:l},size:{width:u,height:s},animate:!0}),t.ref.previousStagePosition=i.stagePosition;}}),didWriteView:function(e){var t=e.root;t.ref.shouldFocus&&(t.ref.activeView.element.focus({preventScroll:!0}),t.ref.shouldFocus=!1);}}),editContent=createView({name:"content",ignoreRect:!0,mixins:{styles:["opacity"],animations:{opacity:{type:"tween",duration:250}}},create:function(e){var t=e.root,r=e.props;t.opacity=1,t.ref.viewStack=t.appendChildView(t.createChildView(viewStack,{id:r.id})),t.ref.image=null;},write:createRoute({DID_LOAD_IMAGE:function(e){var t=e.root,r=e.props;t.ref.image=t.appendChildView(t.createChildView(image,{id:r.id}));}},function(e){var t=e.root,r=t.ref,n=r.image,i=r.viewStack;if(n){var o=t.rect.element.top;i.offsetTop=o,n.offsetTop=o;}})}),updateResizeButton=function(e,t){e.element.dataset.scaleDirection=null===t||t>1?"up":"down";},editUtils=createView({name:"utils",create:function(e){var t=e.root,r={crop:{title:t.query("GET_LABEL_BUTTON_UTIL_CROP"),icon:createIcon('<g fill="none" fill-rule="evenodd" stroke-linecap="round" stroke-linejoin="round" stroke="currentColor" stroke-width="2"><path d="M23 17H9a2 2 0 0 1-2-2v-5m0-3V1"/><path d="M1 7h14a2 2 0 0 1 2 2v7m0 4v3"/></g>')},filter:{title:t.query("GET_LABEL_BUTTON_UTIL_FILTER"),icon:createIcon('<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M18.347 9.907a6.5 6.5 0 1 0-1.872 3.306M3.26 11.574a6.5 6.5 0 1 0 2.815-1.417"/><path d="M10.15 17.897A6.503 6.503 0 0 0 16.5 23a6.5 6.5 0 1 0-6.183-8.51"/></g>')},color:{title:t.query("GET_LABEL_BUTTON_UTIL_COLOR"),icon:createIcon('<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M4 1v5.5m0 3.503V23M12 1v10.5m0 3.5v8M20 1v15.5m0 3.5v3M2 7h4M10 12h4M18 17h4"/></g>')},markup:{title:t.query("GET_LABEL_BUTTON_UTIL_MARKUP"),icon:createIcon('<g fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M17.086 2.914a2.828 2.828 0 1 1 4 4l-14.5 14.5-5.5 1.5 1.5-5.5 14.5-14.5z"/></g>')},resize:{title:t.query("GET_LABEL_BUTTON_UTIL_RESIZE"),icon:createIcon('<g fill="none" fill-rule="evenodd" stroke-width="2" stroke="currentColor" stroke-linecap="round" stroke-linejoin="round"><rect x="2" y="12" width="10" height="10" rx="2"/><path d="M4 11.5V4a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-5.5"/><path d="M14 10l3.365-3.365M14 6h4v4" class="doka--icon-resize-arrow-ne"/><path d="M14 10l3.365-3.365M14 6v4h4" class="doka--icon-resize-arrow-sw"/></g>')}};t.ref.utils=Object.keys(r).map(function(e){return _objectSpread({id:e},r[e])}),t.ref.utilMenuRequiredWidth=null;},read:function(e){var t=e.root;if(null===t.ref.utilMenuRequiredWidth){var r=t.childViews.reduce(function(e,t){return e+t.rect.outer.width},0);t.ref.utilMenuRequiredWidth=0===r?null:r;}},write:createRoute({DID_SET_UTILS:function(e){var t=e.root,r=_toConsumableArray(t.query("GET_UTILS"));t.childViews.forEach(function(e){return t.removeChildView(e)}),t.element.dataset.utilCount=r.length,1===r.length&&(r.length=0),r.forEach(function(e){var r=t.ref.utils.find(function(t){return t.id===e}),n=t.appendChildView(t.createChildView(button,{name:"tab",view:button,label:r.title,opacity:1,icon:r.icon,id:r.id,action:function(){return t.dispatch("CHANGE_VIEW",{id:r.id})}}));t.ref["util_button_".concat(r.id)]=n;});},SHOW_VIEW:function(e){var t=e.root,r=e.action;t.childViews.forEach(function(e){e.element.dataset.active=e.id===r.id;});}},function(e){var t=e.root,r=e.props,n=e.timestamp,i=t.query("GET_CROP",r.id,n);if(i){var o=i.cropStatus;t.ref.util_button_resize&&updateResizeButton(t.ref.util_button_resize,o.image.width?o.image.width/o.crop.width:null),t.element.dataset.layout=t.ref.utilMenuRequiredWidth>t.rect.element.width?"compact":"spacious";}})}),HAS_WEBGL=isBrowser()&&function(){try{var e={antialias:!1,alpha:!1},t=document.createElement("canvas");return !!window.WebGLRenderingContext&&(t.getContext("webgl",e)||t.getContext("experimental-webgl",e))}catch(e){return !1}}(),hasWebGL=function(){return HAS_WEBGL},editContainer=createView({name:"container",create:function(e){var t=e.root,r=[{view:button,opacity:0,label:t.query("GET_LABEL_BUTTON_RESET"),didCreateView:function(e){return t.ref.btnReset=e},name:"app action-reset icon-only",icon:createIcon('<g fill="currentColor" fill-rule="nonzero"><path d="M6.036 13.418L4.49 11.872A.938.938 0 1 0 3.163 13.2l2.21 2.209a.938.938 0 0 0 1.326 0l2.209-2.21a.938.938 0 0 0-1.327-1.326l-1.545 1.546zM12 10.216a1 1 0 0 1 2 0V13a1 1 0 0 1-2 0v-2.784z"/><path d="M15.707 14.293a1 1 0 0 1-1.414 1.414l-2-2a1 1 0 0 1 1.414-1.414l2 2z"/><path d="M8.084 19.312a1 1 0 0 1 1.23-1.577 6 6 0 1 0-2.185-3.488 1 1 0 0 1-1.956.412 8 8 0 1 1 2.912 4.653z"/></g>',26),action:function(){return t.dispatch("EDIT_RESET")}}];t.query("GET_ALLOW_BUTTON_CANCEL")&&r.unshift({view:button,label:t.query("GET_LABEL_BUTTON_CANCEL"),name:"app action-cancel icon-fallback",opacity:1,icon:createIcon('<g fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round"><path d="M18 6L6 18M6 6l12 12"/></g>'),didCreateView:function(e){t.ref.btnCancel=e;},action:function(){t.dispatch("EDIT_CANCEL");}}),r.push({view:editUtils}),t.query("GET_ALLOW_BUTTON_CONFIRM")&&r.push({view:button,label:t.query("GET_LABEL_BUTTON_CONFIRM"),name:"app action-confirm icon-fallback",opacity:1,icon:createIcon('<polyline fill="none" stroke="currentColor" stroke-width="3" stroke-linecap="round" stroke-linejoin="round" points="20 6 9 17 4 12"></polyline>'),didCreateView:function(e){t.ref.btnConfirm=e;},action:function(){t.dispatch("EDIT_CONFIRM");}}),t.ref.menu=t.appendChildView(t.createChildView(createGroup("menu"),{controls:r})),t.ref.menu.opacity=0,t.ref.status=t.appendChildView(t.createChildView(editStatus)),t.ref.hasWebGL=hasWebGL(),t.ref.hasWebGL?t.dispatch("AWAIT_IMAGE"):t.dispatch("MISSING_WEBGL"),t.ref.handleFocusOut=function(){var e=t.ref.status;"busy"===e.element.dataset.viewStatus&&e.element.focus();},t.ref.handleFocusIn=function(e){var r=t.ref,n=r.menu,i=r.content,o=e.target;if(!n.element.contains(o)&&i&&i.element.contains(o)){if(!Array.from(t.element.querySelectorAll("[data-view-active=false]")).reduce(function(e,t){return t.contains(o)&&(e=!0),e},!1))return;n.element.querySelector("button,input,[tabindex]").focus();}},t.element.addEventListener("focusin",t.ref.handleFocusIn),t.element.addEventListener("focusout",t.ref.handleFocusOut),t.ref.previousState=null;},destroy:function(e){var t=e.root;t.element.removeEventListener("focusin",t.ref.handleFocusIn),t.element.removeEventListener("focusout",t.ref.handleFocusOut);},write:createRoute({UNLOAD_IMAGE:function(e){var t=e.root;t.ref.content&&(t.ref.content.opacity=0,t.ref.menu.opacity=0);},DID_UNLOAD_IMAGE:function(e){var t=e.root;t.removeChildView(t.ref.content),t.ref.content=null;},DID_LOAD_IMAGE:function(e){var t=e.root,r=e.props;t.ref.hasWebGL&&(t.ref.content=t.appendChildView(t.createChildView(editContent,{opacity:null,id:r.id})),t.ref.menu.opacity=1);},SHOW_VIEW:function(e){var t=e.root,r=e.action;t.element.dataset.limitOverflow="resize"===r.id;}},function(e){var t=e.root,r=e.props,n=e.timestamp,i=t.query("GET_CROP",r.id,n);if(i){var o=i.cropStatus,a=o.props,c={crop:{center:{x:roundFloat(a.center.x,5),y:roundFloat(a.center.y,5)},rotation:roundFloat(a.rotation,5),zoom:roundFloat(a.zoom,5),aspectRatio:roundFloat(a.aspectRatio,5),flip:{horizontal:a.flip.horizontal,vertical:a.flip.vertical},scaleToFit:a.scaleToFit,width:o.currentWidth,height:o.currentHeight}};hasStateChanged(t.ref.previousState,c)&&(t.dispatch("DID_UPDATE",{state:_objectSpread({},c)}),t.ref.previousState=c);var l=t.ref,u=l.btnCancel,s=l.content,d=i.canReset;if(t.ref.btnReset.opacity=d?1:0,u&&t.query("GET_UTILS").length>1){var p=t.query("GET_ROOT_SIZE");u.opacity=d&&p.width<600?0:1;}s&&0===s.opacity&&t.dispatch("DID_UNLOAD_IMAGE");}})}),hasStateChanged=function(e,t){if(!e)return !0;var r=e.crop,n=t.crop;return r.width!==n.width||r.height!==n.height||r.center.x!==n.center.x||r.center.y!==n.center.y||r.rotation!==n.rotation||r.scaleToFit!==n.scaleToFit||r.zoom!==n.zoom||r.aspectRatio!==n.aspectRatio||r.flip.horizontal!==n.flip.horizontal||r.flip.vertical!==n.flip.vertical},createPointerEvents=function(e){var t={destroy:function(){}};if("onpointerdown"in window||e.pointersPolyfilled)return t;e.pointersPolyfilled=!0;var r=0,n=[],i=function(e,t,r){var n=new UIEvent(t.type,{view:window,bubbles:!r});Object.keys(t).forEach(function(e){Object.defineProperty(n,e,{value:t[e],writable:!1});}),e.dispatchEvent(n);},o=function(e,t,o){return Array.from(t.changedTouches).map(function(a){var c=n[a.identifier],l={type:e,pageX:a.pageX,pageY:a.pageY,pointerId:a.identifier,isPrimary:c?c.isPrimary:0===r,preventDefault:function(){return t.preventDefault()}};return i(a.target,l,o),l})},a=function(e){o("pointerdown",e).forEach(function(e){n[e.pointerId]=e,r++;});},c=function(e){o("pointermove",e);},l=function(e){o("pointerup",e).forEach(function(e){delete n[e.pointerId],r--;});},u=function(e,t,r){var n={type:e,pageX:t.pageX,pageY:t.pageY,pointerId:0,isPrimary:!0,preventDefault:function(){return t.preventDefault()}};return i(t.target,n,r),n},s=function(e){u("pointerdown",e);},d=function(e){u("pointermove",e);},p=function(e){u("pointerup",e);};return "ontouchstart"in window?(e.addEventListener("touchstart",a),e.addEventListener("touchmove",c),e.addEventListener("touchend",l)):"onmousedown"in window&&(e.addEventListener("mousedown",s),e.addEventListener("mousemove",d),e.addEventListener("mouseup",p)),t.destroy=function(){n.length=0,e.pointersPolyfilled=!1,e.removeEventListener("touchstart",a),e.removeEventListener("touchmove",c),e.removeEventListener("touchend",l),e.removeEventListener("mousedown",s),e.removeEventListener("mousemove",d),e.removeEventListener("mouseup",p);},t},prevent=function(e){"gesturestart"!==e.type?climb(e.target,function(e){return e.isScrollContainer})||e.preventDefault():e.preventDefault();},editor=createView({name:"editor",ignoreRect:!0,mixins:{styles:["opacity"],animations:{opacity:{type:"tween",duration:350}},apis:["markedForRemoval"]},create:function(e){var t=e.root,r=e.props;r.markedForRemoval=!1,isIOS()&&(t.element.addEventListener("touchmove",prevent,{passive:!1}),t.element.addEventListener("gesturestart",prevent)),t.ref.pointerPolyfill=createPointerEvents("root"===t.query("GET_POINTER_EVENTS_POLYFILL_SCOPE")?t.element:document.documentElement),t.appendChildView(t.createChildView(editContainer,_objectSpread({},r)));},destroy:function(e){var t=e.root;t.ref.pointerPolyfill.destroy(),t.element.removeEventListener("touchmove",prevent,!0),t.element.removeEventListener("gesturestart",prevent);}}),createTouchDetector=function(){function e(){t.fire("touch-detected"),window.removeEventListener("touchstart",e,!1);}var t=_objectSpread({},on(),{destroy:function(){window.removeEventListener("touchstart",e,!1);}});return window.addEventListener("touchstart",e,!1),t},createFileCatcher=function(e){var t,r={browseEnabled:!1},n=function(){t.files.length&&i.fire("drop",Array.from(t.files));},i=_objectSpread({},on(),{enableBrowse:function(){r.browseEnabled||((t=document.createElement("input")).style.display="none",t.setAttribute("type","file"),t.addEventListener("change",n),e.appendChild(t),e.addEventListener("click",o),r.browseEnabled=!0);},disableBrowse:function(){r.browseEnabled&&(t.removeEventListener("change",n),t.parentNode.removeChild(t),e.removeEventListener("click",o),r.browseEnabled=!1);},destroy:function(){e.removeEventListener("dragover",a),e.removeEventListener("drop",c),e.removeEventListener("click",o),t&&t.removeEventListener("change",n);}}),o=function(){return t.click()},a=function(e){return e.preventDefault()},c=function(e){e.preventDefault();var t=Array.from(e.dataTransfer.items||e.dataTransfer.files).map(function(e){return e.getAsFile&&"file"===e.kind?e.getAsFile():e});i.fire("drop",t);};return e.addEventListener("dragover",a),e.addEventListener("drop",c),i},createFocusTrap=function(e){var t=function(t){if(9===t.keyCode){var r=Array.from(e.querySelectorAll("button,input,[tabindex]")).filter(function(e){return "hidden"!==e.style.visibility&&-1!==e.tabIndex}),n=r[0],i=r[r.length-1];t.shiftKey?document.activeElement===n&&(i.focus(),t.preventDefault()):document.activeElement===i&&(n.focus(),t.preventDefault());}};return e.addEventListener("keydown",t),{destroy:function(){e.removeEventListener("keydown",t);}}},isFullscreen=function(e){return e.ref.isFullscreen},shouldBeFullscreen=function(e){return /fullscreen/.test(e.query("GET_STYLE_LAYOUT_MODE"))},isFloating=function(e){return /fullscreen|preview/.test(e.query("GET_STYLE_LAYOUT_MODE"))},isModal=function(e){return /modal/.test(e.query("GET_STYLE_LAYOUT_MODE"))},mayBeAutoClosed=function(e){return e.query("GET_ALLOW_AUTO_CLOSE")},canBeAutoClosed=isFloating,canBeClosed=isFloating,updateStyleViewport=function(e){var t=e.ref,r=t.environment,n=t.isSingleUtil,i=t.canBeControlled;e.element.dataset.styleViewport=getViewportBySize(e.rect.element.width,e.rect.element.height)+" "+r.join(" ")+(n?" single-util":" multi-util")+(i?" flow-controls":" no-flow-controls");},setupFullscreenMode=function(e){var t=e.element,r=e.ref,n=r.handleFullscreenUpdate,i=r.handleEscapeKey;t.setAttribute("tabindex",-1),n(),e.ref.focusTrap=createFocusTrap(t),t.addEventListener("keydown",i),window.addEventListener("resize",n),window.innerWidth-document.documentElement.clientWidth>0&&document.body.classList.add("doka--parent"),document.body.appendChild(t);var o=document.querySelector("meta[name=viewport]");e.ref.defaultViewportContent=o?o.getAttribute("content"):null,o||((o=document.createElement("meta")).setAttribute("name","viewport"),document.head.appendChild(o)),o.setAttribute("content","width=device-width, height=device-height, initial-scale=1, maximum-scale=1, user-scalable=0"),e.opacity=1,e.element.contains(document.activeElement)||t.focus(),e.dispatch("INVALIDATE_VIEWPORT"),e.ref.isFullscreen=!0;},cleanFullscreenMode=function(e){var t=e.element,r=e.ref,n=r.handleFullscreenUpdate,i=r.focusTrap,o=r.handleEscapeKey;t.removeAttribute("tabindex"),i.destroy(),t.removeEventListener("keydown",o),window.removeEventListener("resize",n),document.body.classList.remove("doka--parent");var a=document.querySelector("meta[name=viewport]");e.ref.defaultViewportContent?(a.setAttribute("content",e.ref.defaultViewportContent),e.ref.defaultViewportContent=null):a.parentNode.removeChild(a),e.ref.isFullscreen=!1;},root=createView({name:"root",ignoreRect:!0,mixins:{styles:["opacity"],animations:{opacity:{type:"tween",duration:350}}},create:function(e){var t=e.root,r=e.props;t.element.id=t.query("GET_ID")||"doka-".concat(r.id);var n=t.query("GET_CLASS_NAME");n&&t.element.classList.add(n),t.ref.environment=[],t.ref.shouldBeDestroyed=!1,t.ref.isClosing=!1,t.ref.isClosed=!1,t.ref.isFullscreen=!1,t.query("GET_ALLOW_DROP_FILES")&&(t.ref.catcher=createFileCatcher(t.element),t.ref.catcher.on("drop",function(e){e.forEach(function(e){t.dispatch("REQUEST_LOAD_IMAGE",{source:e});});})),t.ref.touchDetector=createTouchDetector(),t.ref.touchDetector.onOnce("touch-detected",function(){t.ref.environment.push("touch");}),t.ref.editor=t.appendChildView(t.createChildView(editor,{id:r.id})),t.query("GET_STYLES").filter(function(e){return !isEmpty(e.value)}).map(function(e){var r=e.name,n=e.value;t.element.dataset[r]=n;}),t.ref.updateViewport=function(){t.dispatch("INVALIDATE_VIEWPORT");},window.addEventListener("resize",t.ref.updateViewport),window.addEventListener("scroll",t.ref.updateViewport),t.ref.isSingleUtil=1===t.query("GET_UTILS").length,t.ref.canBeControlled=t.query("GET_ALLOW_BUTTON_CONFIRM")||t.query("GET_ALLOW_BUTTON_CANCEL"),updateStyleViewport(t);var i=document.createElement("div");i.style.cssText="position:fixed;height:100vh;top:0;",t.ref.measure=i,document.body.appendChild(i),t.ref.handleEscapeKey=function(e){27===e.keyCode&&t.dispatch("EDIT_CANCEL");},t.ref.initialScreenMeasureHeight=null,t.ref.handleFullscreenUpdate=function(){t.element.dataset.styleFullscreen=window.innerHeight===t.ref.initialScreenMeasureHeight;},t.ref.clientRect={left:0,top:0},isModal(t)&&(t.ref.handleModalTap=function(e){e.target===t.element&&t.dispatch("EDIT_CANCEL");},t.element.addEventListener("pointerdown",t.ref.handleModalTap));},read:function(e){var t=e.root,r=t.ref.measure;r&&(t.ref.initialScreenMeasureHeight=r.offsetHeight,r.parentNode.removeChild(r),t.ref.measure=null),t.ref.clientRect=t.element.getBoundingClientRect(),t.ref.clientRect.leftScroll=t.ref.clientRect.left+(window.scrollX||window.pageXOffset),t.ref.clientRect.topScroll=t.ref.clientRect.top+(window.scrollY||window.pageYOffset);},write:createRoute({ENTER_FULLSCREEN:function(e){var t=e.root;setupFullscreenMode(t);},EXIT_FULLSCREEN:function(e){var t=e.root;cleanFullscreenMode(t);},SHOW_VIEW:function(e){var t=e.root,r=e.action;t.element.dataset.view=r.id;},DID_SET_STYLE_LAYOUT_MODE:function(e){var t=e.root,r=e.action;t.element.dataset.styleLayoutMode=r.value||"none",/fullscreen/.test(r.value)&&!/fullscreen/.test(r.prevValue)&&t.dispatch("ENTER_FULLSCREEN");},AWAITING_IMAGE:function(e){var t=e.root;t.ref.catcher&&t.query("GET_ALLOW_BROWSE_FILES")&&t.ref.catcher.enableBrowse();},DID_REQUEST_LOAD_IMAGE:function(e){var t=e.root;if(t.ref.catcher&&t.query("GET_ALLOW_BROWSE_FILES")&&t.ref.catcher.disableBrowse(),0===t.opacity&&(t.opacity=1),t.ref.isClosing=!1,t.ref.isClosed=!1,!shouldBeFullscreen(t)||isFullscreen(t)){var r=t.query("GET_STYLE_LAYOUT_MODE");null!==r&&"modal"!==r||t.element.parentNode||t.dispatch("SET_STYLE_LAYOUT_MODE",{value:("fullscreen "+(r||"")).trim()});}else t.dispatch("ENTER_FULLSCREEN");},DID_CANCEL:function(e){var t=e.root;canBeAutoClosed(t)&&mayBeAutoClosed(t)&&t.dispatch("EDIT_CLOSE");},DID_CONFIRM:function(e){var t=e.root;canBeAutoClosed(t)&&mayBeAutoClosed(t)&&t.dispatch("EDIT_CLOSE");},EDIT_CLOSE:function(e){var t=e.root;canBeClosed(t)&&(t.opacity=t.opacity||1,t.opacity=0,t.ref.isClosed=!1,t.ref.isClosing=!0,t.query("GET_ALLOW_AUTO_DESTROY")&&(t.ref.shouldBeDestroyed=!0),isFullscreen(t)&&t.dispatch("EXIT_FULLSCREEN"));},DID_SET_UTILS:function(e){var t=e.root;t.ref.isSingleUtil=1===t.query("GET_UTILS").length;}},function(e){var t=e.root;updateStyleViewport(t);var r=t.query("GET_ROOT"),n=t.rect.element;r.width===n.width&&r.height===n.height&&r.y===t.ref.clientRect.top&&r.topScroll===t.ref.clientRect.topScroll||t.dispatch("UPDATE_ROOT_RECT",{rect:{x:t.ref.clientRect.left,y:t.ref.clientRect.top,left:t.ref.editor.rect.element.left,top:t.ref.editor.rect.element.top,leftScroll:t.ref.clientRect.leftScroll,topScroll:t.ref.clientRect.topScroll,width:t.rect.element.width,height:t.rect.element.height}});}),didWriteView:function(e){var t=e.root,r=t.ref,n=r.isClosed,i=r.isClosing,o=r.shouldBeDestroyed;!n&&i&&0===t.opacity&&(t.dispatch("DID_CLOSE"),t.ref.isClosed=!0,t.ref.isClosing=!1,shouldBeFullscreen(t)&&t.element.parentNode&&document.body.removeChild(t.element),o&&t.dispatch("EDIT_DESTROY"));},destroy:function(e){var t=e.root;isFullscreen(t)&&cleanFullscreenMode(t),isModal(t)&&t.element.removeEventListener("pointerdown",t.ref.handleModalTap),shouldBeFullscreen(t)&&t.element.parentNode&&document.body.removeChild(t.element),window.removeEventListener("resize",t.ref.updateViewport),t.ref.touchDetector.destroy(),t.ref.catcher&&t.ref.catcher.destroy();}}),getViewportBySize=function(e,t){var r="";return 0===e&&0===t?"detached":(r+=t>e?"portrait":"landscape",(r+=e<=600?" x-cramped":e<=1e3?" x-comfortable":" x-spacious").trim())},createApp=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=getOptions(),r=createStore(createInitialState(t),[queries,createOptionQueries(t)],[actions,createOptionActions(t)]);r.dispatch("SET_OPTIONS",{options:e});var n=function(){document.hidden||r.dispatch("KICK");};document.addEventListener("visibilitychange",n);var i=getUniqueId();r.dispatch("SET_UID",{id:i});var o=null,a=root(r,{id:i}),c=!1,l={_read:function(){c||a._read();},_write:function(e){var t=r.processActionQueue().filter(function(e){return !/^SET_/.test(e.type)});c&&!t.length||(d(t),(c=a._write(e,t))&&r.processDispatchQueue(),t.find(function(e){return "EDIT_DESTROY"===e.type})&&p());}},u=function(e){return function(t){var r={type:e};return t?(t.hasOwnProperty("error")&&(r.error=isObject(t.error)?_objectSpread({},t.error):t.error||null),t.hasOwnProperty("output")&&(r.output=t.output),t.hasOwnProperty("image")&&(r.image=t.image),t.hasOwnProperty("source")&&(r.source=t.source),t.hasOwnProperty("state")&&(r.state=t.state),r):r}},s={DID_CONFIRM:u("confirm"),DID_CANCEL:u("cancel"),DID_REQUEST_LOAD_IMAGE:u("loadstart"),DID_LOAD_IMAGE:u("load"),DID_LOAD_IMAGE_ERROR:u("loaderror"),DID_UPDATE:u("update"),DID_CLOSE:u("close"),DID_DESTROY:u("destroy"),DID_INIT:u("init")},d=function(e){e.length&&e.forEach(function(e){if(s[e.type]){var t=s[e.type];(Array.isArray(t)?t:[t]).forEach(function(t){setTimeout(function(){!function(e){var t=_objectSpread({doka:f},e);delete t.type,a&&a.element.dispatchEvent(new CustomEvent("Doka:".concat(e.type),{detail:t,bubbles:!0,cancelable:!0,composed:!0}));var n=[];e.hasOwnProperty("error")&&n.push(e.error);var i=["type","error"];Object.keys(e).filter(function(e){return !i.includes(e)}).forEach(function(t){return n.push(e[t])}),f.fire.apply(f,[e.type].concat(n));var o=r.query("GET_ON".concat(e.type.toUpperCase()));o&&o.apply(void 0,n);}(t(e.data));},0);});}});},p=function(){f.fire("destroy",a.element),document.removeEventListener("visibilitychange",n),a._destroy(),r.dispatch("DID_DESTROY");},f=_objectSpread({},on(),l,createOptionAPI(r,t),{setOptions:function(e){return r.dispatch("SET_OPTIONS",{options:e})},setData:function(e){r.dispatch("SET_DATA",e);},getData:function(e){return new Promise(function(t,n){r.dispatch("GET_DATA",_objectSpread({},e,{success:t,failure:n}));})},open:function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{};return new Promise(function(n,i){e&&r.dispatch("REQUEST_LOAD_IMAGE",{source:e,options:t,success:n,failure:i,resolveOnConfirm:!!t&&t.resolveOnConfirm});})},edit:function(e,t){return f.open(e,_objectSpread({},t,{resolveOnConfirm:!0}))},save:function(e){return new Promise(function(t,n){r.dispatch("GET_DATA",_objectSpread({},e,{success:t,failure:n}));})},clear:function(){return r.dispatch("REQUEST_REMOVE_IMAGE")},close:function(){return r.dispatch("EDIT_CLOSE")},destroy:p,insertBefore:function(e){insertBefore(a.element,e);},insertAfter:function(e){insertAfter(a.element,e);},appendTo:function(e){e.appendChild(a.element);},replaceElement:function(e){insertBefore(a.element,e),e.parentNode.removeChild(e),o=e;},restoreElement:function(){o&&(insertAfter(o,a.element),a.element.parentNode.removeChild(a.element),o=null);},isAttachedTo:function(e){return !!a&&(a.element===e||o===e)},element:{get:function(){return a?a.element:null}}});return r.dispatch("DID_INIT"),createObject(f)},createAppObject=function(){var e=arguments.length>0&&void 0!==arguments[0]?arguments[0]:{},t=getOptions(),r={};return forin(t,function(e,t){isString(t)||(r[e]=t[0]);}),createApp(_objectSpread({},r,e))},toCamels=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:"-";return e.replace(new RegExp("".concat(t,"."),"g"),function(e){return e.charAt(1).toUpperCase()})},lowerCaseFirstLetter=function(e){return e.charAt(0).toLowerCase()+e.slice(1)},attributeNameToPropertyName=function(e){return toCamels(e.replace(/^data-/,""))},mapObject=function e(t,r){forin(r,function(r,n){forin(t,function(e,i){var o=new RegExp(r);if(o.test(e)&&(delete t[e],!1!==n))if(isString(n))t[n]=i;else{var a=n.group;isObject(n)&&!t[a]&&(t[a]={}),t[a][lowerCaseFirstLetter(e.replace(o,""))]=i;}}),n.mapping&&e(t[n.group],n.mapping);});},getAttributesAsObject=function(e){var t=arguments.length>1&&void 0!==arguments[1]?arguments[1]:{},r=[];forin(e.attributes,function(t){return r.push(e.attributes[t])});var n=r.filter(function(e){return e.name}).reduce(function(t,r){var n=attr$1(e,r.name);return t[attributeNameToPropertyName(r.name)]=n===r.name||n,t},{});return mapObject(n,t),n},createAppAtElement=function(e){var t=_objectSpread({},arguments.length>1&&void 0!==arguments[1]?arguments[1]:{}),r=getAttributesAsObject(e,{"^class$":"className"});Object.keys(r).forEach(function(e){isObject(r[e])?(isObject(t[e])||(t[e]={}),Object.assign(t[e],r[e])):t[e]=r[e];}),"CANVAS"!==e.nodeName&&"IMG"!==e.nodeName||(t.src=e.dataset.dokaSrc?e.dataset.dokaSrc:e);var n=createAppObject(t);return n.replaceElement(e),n},createApp$1=function(){for(var e=arguments.length,t=new Array(e),r=0;r<e;r++)t[r]=arguments[r];return isNode(t[0])?createAppAtElement.apply(void 0,t):createAppObject.apply(void 0,_toConsumableArray(t.filter(function(e){return e})))},copyObjectPropertiesToObject=function(e,t,r){Object.getOwnPropertyNames(e).filter(function(e){return !r.includes(e)}).forEach(function(r){return Object.defineProperty(t,r,Object.getOwnPropertyDescriptor(e,r))});},PRIVATE_METHODS=["fire","_read","_write"],createAppAPI=function(e){var t={};return copyObjectPropertiesToObject(e,t,PRIVATE_METHODS),t},isOperaMini=function(){return "[object OperaMini]"===Object.prototype.toString.call(window.operamini)},hasPromises=function(){return "Promise"in window},hasBlobSlice=function(){return "slice"in Blob.prototype},hasCreateObjectURL=function(){return "URL"in window&&"createObjectURL"in window.URL},hasVisibility=function(){return "visibilityState"in document},hasTiming=function(){return "performance"in window},supported=function(){var e=isBrowser()&&!isOperaMini()&&hasVisibility()&&hasPromises()&&hasBlobSlice()&&hasCreateObjectURL()&&hasTiming();return function(){return e}}(),state={apps:[]},name="doka",fn=function(){},OptionTypes={},create$1=fn,destroy=fn,parse=fn,find=fn,getOptions$1=fn,setOptions$1=fn;if(supported()){createPainter(function(){state.apps.forEach(function(e){return e._read()});},function(e){state.apps.forEach(function(t){return t._write(e)});});var dispatch=function e(){document.dispatchEvent(new CustomEvent("doka:loaded",{detail:{supported:supported,create:create$1,destroy:destroy,parse:parse,find:find,setOptions:setOptions$1}})),document.removeEventListener("DOMContentLoaded",e);};"loading"!==document.readyState?setTimeout(function(){return dispatch()},0):document.addEventListener("DOMContentLoaded",dispatch);var updateOptionTypes=function(){return forin(getOptions(),function(e,t){OptionTypes[e]=t[1];})};OptionTypes={},updateOptionTypes(),create$1=function(){var e=createApp$1.apply(void 0,arguments);return e.on("destroy",destroy),state.apps.push(e),createAppAPI(e)},destroy=function(e){var t=state.apps.findIndex(function(t){return t.isAttachedTo(e)});return t>=0&&(state.apps.splice(t,1)[0].restoreElement(),!0)},parse=function(e){return Array.from(e.querySelectorAll(".".concat(name))).filter(function(e){return !state.apps.find(function(t){return t.isAttachedTo(e)})}).map(function(e){return create$1(e)})},find=function(e){var t=state.apps.find(function(t){return t.isAttachedTo(e)});return t?createAppAPI(t):null},getOptions$1=function(){var e={};return forin(getOptions(),function(t,r){e[t]=r[0];}),e},setOptions$1=function(e){return isObject(e)&&(state.apps.forEach(function(t){t.setOptions(e);}),setOptions(e)),getOptions$1()};}

    /* src/svelte-doka/components/DokaModal.svelte generated by Svelte v3.16.4 */

    function create_fragment(ctx) {
    	const block = {
    		c: noop,
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: noop,
    		p: noop,
    		i: noop,
    		o: noop,
    		d: noop
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1($$self, $$props, $$invalidate) {
    	let instance;

    	onMount(() => {
    		instance = create$1($$props);
    	});

    	beforeUpdate(() => {
    		if (!instance) return;
    		instance.setOptions($$props);
    	});

    	onDestroy(() => {
    		instance.destroy();
    		instance = null;
    	});

    	$$self.$set = $$new_props => {
    		$$invalidate(1, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    	};

    	$$self.$capture_state = () => {
    		return { instance };
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(1, $$props = assign(assign({}, $$props), $$new_props));
    		if ("instance" in $$props) instance = $$new_props.instance;
    	};

    	$$props = exclude_internal_props($$props);
    	return [];
    }

    class DokaModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DokaModal",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    /* src/svelte-doka/components/Doka.svelte generated by Svelte v3.16.4 */

    const { console: console_1 } = globals;
    const file = "src/svelte-doka/components/Doka.svelte";

    function create_fragment$1(ctx) {
    	let div1;
    	let div0;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[6].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[5], null);

    	const block = {
    		c: function create() {
    			div1 = element("div");

    			if (!default_slot) {
    				div0 = element("div");
    			}

    			if (default_slot) default_slot.c();

    			if (!default_slot) {
    				add_location(div0, file, 31, 8, 554);
    			}

    			add_location(div1, file, 29, 0, 509);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);

    			if (!default_slot) {
    				append_dev(div1, div0);
    				/*div0_binding*/ ctx[7](div0);
    			}

    			if (default_slot) {
    				default_slot.m(div1, null);
    			}

    			/*div1_binding*/ ctx[8](div1);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty[0] & /*$$scope*/ 32) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[5], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[5], dirty, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);

    			if (!default_slot) {
    				/*div0_binding*/ ctx[7](null);
    			}

    			if (default_slot) default_slot.d(detaching);
    			/*div1_binding*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1$1($$self, $$props, $$invalidate) {
    	let { style } = $$props;
    	let root;
    	let wrapper;
    	let instance;

    	onMount(() => {
    		$$invalidate(1, wrapper.style.cssText = style, wrapper);
    		instance = create$1(root || wrapper.children[0], $$props);
    		console.log(style);
    	});

    	beforeUpdate(() => {
    		if (!instance) return;
    		instance.setOptions($$props);
    	});

    	onDestroy(() => {
    		instance.destroy();
    		instance = null;
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(0, root = $$value);
    		});
    	}

    	function div1_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(1, wrapper = $$value);
    		});
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("style" in $$new_props) $$invalidate(2, style = $$new_props.style);
    		if ("$$scope" in $$new_props) $$invalidate(5, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { style, root, wrapper, instance };
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(4, $$props = assign(assign({}, $$props), $$new_props));
    		if ("style" in $$props) $$invalidate(2, style = $$new_props.style);
    		if ("root" in $$props) $$invalidate(0, root = $$new_props.root);
    		if ("wrapper" in $$props) $$invalidate(1, wrapper = $$new_props.wrapper);
    		if ("instance" in $$props) instance = $$new_props.instance;
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		root,
    		wrapper,
    		style,
    		instance,
    		$$props,
    		$$scope,
    		$$slots,
    		div0_binding,
    		div1_binding
    	];
    }

    class Doka extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1$1, create_fragment$1, safe_not_equal, { style: 2 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Doka",
    			options,
    			id: create_fragment$1.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*style*/ ctx[2] === undefined && !("style" in props)) {
    			console_1.warn("<Doka> was created without expected prop 'style'");
    		}
    	}

    	get style() {
    		throw new Error("<Doka>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set style(value) {
    		throw new Error("<Doka>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* src/svelte-doka/components/DokaOverlay.svelte generated by Svelte v3.16.4 */
    const file$1 = "src/svelte-doka/components/DokaOverlay.svelte";

    function create_fragment$2(ctx) {
    	let div2;
    	let t;
    	let div1;
    	let div0;
    	let current;
    	const default_slot_template = /*$$slots*/ ctx[7].default;
    	const default_slot = create_slot(default_slot_template, ctx, /*$$scope*/ ctx[6], null);

    	const block = {
    		c: function create() {
    			div2 = element("div");
    			if (default_slot) default_slot.c();
    			t = space();
    			div1 = element("div");
    			div0 = element("div");
    			add_location(div0, file$1, 51, 8, 1034);
    			attr_dev(div1, "class", "doka-svelte--container");
    			add_location(div1, file$1, 50, 4, 989);
    			attr_dev(div2, "class", "doka-svelte--overlay");
    			add_location(div2, file$1, 48, 0, 932);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);

    			if (default_slot) {
    				default_slot.m(div2, null);
    			}

    			append_dev(div2, t);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			/*div0_binding*/ ctx[8](div0);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (default_slot && default_slot.p && dirty[0] & /*$$scope*/ 64) {
    				default_slot.p(get_slot_context(default_slot_template, ctx, /*$$scope*/ ctx[6], null), get_slot_changes(default_slot_template, /*$$scope*/ ctx[6], dirty, null));
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(default_slot, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(default_slot, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    			if (default_slot) default_slot.d(detaching);
    			/*div0_binding*/ ctx[8](null);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance_1$2($$self, $$props, $$invalidate) {
    	let { enabled } = $$props;

    	const createDokaInstance = () => {
    		if (instance) return;

    		instance = create$1(root, {
    			...$$props,
    			styleLayoutMode: "preview",
    			outputData: true,
    			onclose: () => {
    				instance.destroy();
    				instance = null;
    			}
    		});
    	};

    	const destroyDokaInstance = () => {
    		if (!instance) return;
    		instance.destroy();
    		instance = null;
    	};

    	let root;
    	let instance;

    	beforeUpdate(() => {
    		if (enabled && !instance) {
    			createDokaInstance();
    		} else if (!enabled && instance) {
    			destroyDokaInstance();
    		} else if (instance) {
    			instance.setOptions($$props);
    		}
    	});

    	onDestroy(() => {
    		destroyInstance();
    	});

    	let { $$slots = {}, $$scope } = $$props;

    	function div0_binding($$value) {
    		binding_callbacks[$$value ? "unshift" : "push"](() => {
    			$$invalidate(0, root = $$value);
    		});
    	}

    	$$self.$set = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), exclude_internal_props($$new_props)));
    		if ("enabled" in $$new_props) $$invalidate(1, enabled = $$new_props.enabled);
    		if ("$$scope" in $$new_props) $$invalidate(6, $$scope = $$new_props.$$scope);
    	};

    	$$self.$capture_state = () => {
    		return { enabled, root, instance };
    	};

    	$$self.$inject_state = $$new_props => {
    		$$invalidate(5, $$props = assign(assign({}, $$props), $$new_props));
    		if ("enabled" in $$props) $$invalidate(1, enabled = $$new_props.enabled);
    		if ("root" in $$props) $$invalidate(0, root = $$new_props.root);
    		if ("instance" in $$props) instance = $$new_props.instance;
    	};

    	$$props = exclude_internal_props($$props);

    	return [
    		root,
    		enabled,
    		instance,
    		createDokaInstance,
    		destroyDokaInstance,
    		$$props,
    		$$scope,
    		$$slots,
    		div0_binding
    	];
    }

    class DokaOverlay extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance_1$2, create_fragment$2, safe_not_equal, { enabled: 1 });

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DokaOverlay",
    			options,
    			id: create_fragment$2.name
    		});

    		const { ctx } = this.$$;
    		const props = options.props || ({});

    		if (/*enabled*/ ctx[1] === undefined && !("enabled" in props)) {
    			console.warn("<DokaOverlay> was created without expected prop 'enabled'");
    		}
    	}

    	get enabled() {
    		throw new Error("<DokaOverlay>: Props cannot be read directly from the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}

    	set enabled(value) {
    		throw new Error("<DokaOverlay>: Props cannot be set directly on the component instance unless compiling with 'accessors: true' or '<svelte:options accessors/>'");
    	}
    }

    /* eslint-disable */

    const DokaOverlay$1 = DokaOverlay;
    const Doka$1 = Doka;
    const DokaModal$1 = DokaModal;
    const toURL = (src) => src instanceof Blob ? URL.createObjectURL(src) : src;

    /* src/DemoInline.svelte generated by Svelte v3.16.4 */
    const file$2 = "src/DemoInline.svelte";

    function create_fragment$3(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let current;

    	const doka = new Doka$1({
    			props: {
    				style: "width: 800px; height: 480px",
    				src: "./assets/photo.jpeg",
    				utils: "crop, filter, color, markup, resize",
    				cropAspectRatio: /*cropAspectRatio*/ ctx[0],
    				oncancel: /*handleCancel*/ ctx[2],
    				onconfirm: /*handleConfirm*/ ctx[1],
    				cropAspectRatioOptions: [
    					{ label: "Free", value: null },
    					{ label: "Portrait", value: 1.5 },
    					{ label: "Square", value: 1 },
    					{ label: "Landscape", value: 0.75 }
    				]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Demo Inline";
    			t1 = space();
    			create_component(doka.$$.fragment);
    			add_location(h2, file$2, 16, 4, 241);
    			add_location(div, file$2, 14, 0, 230);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			mount_component(doka, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(doka.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(doka.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(doka);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$3.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self) {
    	let cropAspectRatio = 1;

    	const handleConfirm = output => {
    		console.log("Confirm edit!", output);
    	};

    	const handleCancel = () => {
    		console.log("Cancel edit!");
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("cropAspectRatio" in $$props) $$invalidate(0, cropAspectRatio = $$props.cropAspectRatio);
    	};

    	return [cropAspectRatio, handleConfirm, handleCancel];
    }

    class DemoInline extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment$3, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DemoInline",
    			options,
    			id: create_fragment$3.name
    		});
    	}
    }

    /* src/DemoModal.svelte generated by Svelte v3.16.4 */
    const file$3 = "src/DemoModal.svelte";

    // (29:4) {#if enabled}
    function create_if_block_1(ctx) {
    	let current;

    	const dokamodal = new DokaModal$1({
    			props: {
    				src: /*src*/ ctx[2],
    				cropAspectRatio: "1",
    				onconfirm: /*handleConfirm*/ ctx[3],
    				oncancel: /*handleCancel*/ ctx[4],
    				onclose: /*handleClose*/ ctx[5]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dokamodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dokamodal, target, anchor);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dokamodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dokamodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dokamodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(29:4) {#if enabled}",
    		ctx
    	});

    	return block;
    }

    // (38:4) {#if result}
    function create_if_block(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*result*/ ctx[1])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$3, 38, 4, 711);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*result*/ 2 && img.src !== (img_src_value = /*result*/ ctx[1])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(38:4) {#if result}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$4(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let button;
    	let t3;
    	let t4;
    	let current;
    	let dispose;
    	let if_block0 = /*enabled*/ ctx[0] && create_if_block_1(ctx);
    	let if_block1 = /*result*/ ctx[1] && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Demo Modal";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Show Modal";
    			t3 = space();
    			if (if_block0) if_block0.c();
    			t4 = space();
    			if (if_block1) if_block1.c();
    			add_location(h2, file$3, 24, 4, 416);
    			add_location(button, file$3, 26, 4, 441);
    			add_location(div, file$3, 22, 0, 405);
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, button);
    			append_dev(div, t3);
    			if (if_block0) if_block0.m(div, null);
    			append_dev(div, t4);
    			if (if_block1) if_block1.m(div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			if (/*enabled*/ ctx[0]) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    					transition_in(if_block0, 1);
    				} else {
    					if_block0 = create_if_block_1(ctx);
    					if_block0.c();
    					transition_in(if_block0, 1);
    					if_block0.m(div, t4);
    				}
    			} else if (if_block0) {
    				group_outros();

    				transition_out(if_block0, 1, 1, () => {
    					if_block0 = null;
    				});

    				check_outros();
    			}

    			if (/*result*/ ctx[1]) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    				} else {
    					if_block1 = create_if_block(ctx);
    					if_block1.c();
    					if_block1.m(div, null);
    				}
    			} else if (if_block1) {
    				if_block1.d(1);
    				if_block1 = null;
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(if_block0);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(if_block0);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			if (if_block0) if_block0.d();
    			if (if_block1) if_block1.d();
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$4.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let src = "assets/photo.jpeg";
    	let enabled = false;
    	let result = null;

    	const handleConfirm = output => {
    		console.log("Confirm edit!", output);
    		$$invalidate(1, result = toURL(output.file));
    	};

    	const handleCancel = () => {
    		console.log("Cancel edit!");
    	};

    	const handleClose = () => {
    		console.log("Close edit!");
    		$$invalidate(0, enabled = false);
    	};

    	const click_handler = () => $$invalidate(0, enabled = true);

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("src" in $$props) $$invalidate(2, src = $$props.src);
    		if ("enabled" in $$props) $$invalidate(0, enabled = $$props.enabled);
    		if ("result" in $$props) $$invalidate(1, result = $$props.result);
    	};

    	return [enabled, result, src, handleConfirm, handleCancel, handleClose, click_handler];
    }

    class DemoModal extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$4, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DemoModal",
    			options,
    			id: create_fragment$4.name
    		});
    	}
    }

    /* src/DemoPreview.svelte generated by Svelte v3.16.4 */
    const file$4 = "src/DemoPreview.svelte";

    // (32:4) <DokaOverlay         {enabled}         utils="crop"         src={imageSource}         crop={imagePreviewCrop}         onconfirm={handleConfirm}         oncancel={handleCancel}>
    function create_default_slot(ctx) {
    	let img;
    	let img_src_value;

    	const block = {
    		c: function create() {
    			img = element("img");
    			if (img.src !== (img_src_value = /*imagePreviewSource*/ ctx[2])) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			add_location(img, file$4, 38, 8, 829);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty[0] & /*imagePreviewSource*/ 4 && img.src !== (img_src_value = /*imagePreviewSource*/ ctx[2])) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot.name,
    		type: "slot",
    		source: "(32:4) <DokaOverlay         {enabled}         utils=\\\"crop\\\"         src={imageSource}         crop={imagePreviewCrop}         onconfirm={handleConfirm}         oncancel={handleCancel}>",
    		ctx
    	});

    	return block;
    }

    function create_fragment$5(ctx) {
    	let div;
    	let h2;
    	let t1;
    	let button;
    	let t3;
    	let current;
    	let dispose;

    	const dokaoverlay = new DokaOverlay$1({
    			props: {
    				enabled: /*enabled*/ ctx[0],
    				utils: "crop",
    				src: /*imageSource*/ ctx[3],
    				crop: /*imagePreviewCrop*/ ctx[1],
    				onconfirm: /*handleConfirm*/ ctx[4],
    				oncancel: /*handleCancel*/ ctx[5],
    				$$slots: { default: [create_default_slot] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			div = element("div");
    			h2 = element("h2");
    			h2.textContent = "Demo Preview";
    			t1 = space();
    			button = element("button");
    			button.textContent = "Show Overlay";
    			t3 = space();
    			create_component(dokaoverlay.$$.fragment);
    			add_location(h2, file$4, 27, 4, 550);
    			add_location(button, file$4, 29, 4, 577);
    			add_location(div, file$4, 25, 0, 539);
    			dispose = listen_dev(button, "click", /*click_handler*/ ctx[6], false, false, false);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h2);
    			append_dev(div, t1);
    			append_dev(div, button);
    			append_dev(div, t3);
    			mount_component(dokaoverlay, div, null);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dokaoverlay_changes = {};
    			if (dirty[0] & /*enabled*/ 1) dokaoverlay_changes.enabled = /*enabled*/ ctx[0];
    			if (dirty[0] & /*imagePreviewCrop*/ 2) dokaoverlay_changes.crop = /*imagePreviewCrop*/ ctx[1];

    			if (dirty[0] & /*$$scope, imagePreviewSource*/ 132) {
    				dokaoverlay_changes.$$scope = { dirty, ctx };
    			}

    			dokaoverlay.$set(dokaoverlay_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dokaoverlay.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dokaoverlay.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(dokaoverlay);
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$5.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let enabled = false;

    	let imagePreviewCrop = {
    		aspectRatio: 0.5,
    		rotation: -1.5707963268
    	};

    	let imagePreviewSource = "assets/photo-preview.jpeg";
    	let imageSource = "assets/photo.jpeg";

    	const handleConfirm = output => {
    		console.log("Confirm edit!", output);
    		$$invalidate(0, enabled = false);
    		$$invalidate(2, imagePreviewSource = toURL(output.file));
    		$$invalidate(1, imagePreviewCrop = output.data.crop);
    	};

    	const handleCancel = () => {
    		console.log("Cancel edit!");
    		$$invalidate(0, enabled = false);
    	};

    	const click_handler = () => $$invalidate(0, enabled = true);

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("enabled" in $$props) $$invalidate(0, enabled = $$props.enabled);
    		if ("imagePreviewCrop" in $$props) $$invalidate(1, imagePreviewCrop = $$props.imagePreviewCrop);
    		if ("imagePreviewSource" in $$props) $$invalidate(2, imagePreviewSource = $$props.imagePreviewSource);
    		if ("imageSource" in $$props) $$invalidate(3, imageSource = $$props.imageSource);
    	};

    	return [
    		enabled,
    		imagePreviewCrop,
    		imagePreviewSource,
    		imageSource,
    		handleConfirm,
    		handleCancel,
    		click_handler
    	];
    }

    class DemoPreview extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$5, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DemoPreview",
    			options,
    			id: create_fragment$5.name
    		});
    	}
    }

    /* src/DemoProfile.svelte generated by Svelte v3.16.4 */
    const file$5 = "src/DemoProfile.svelte";

    // (160:8) {#if !banner.enabled}
    function create_if_block_2(ctx) {
    	let button;
    	let t1;
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Edit";
    			t1 = space();
    			input = element("input");
    			attr_dev(button, "class", "button-edit svelte-8kpjj2");
    			add_location(button, file$5, 160, 8, 3390);
    			attr_dev(input, "class", "input-file svelte-8kpjj2");
    			attr_dev(input, "type", "file");
    			attr_dev(input, "accept", "image/*");
    			add_location(input, file$5, 161, 8, 3476);

    			dispose = [
    				listen_dev(button, "click", /*handleToggleBannerEditor*/ ctx[3], false, false, false),
    				listen_dev(input, "change", /*handleFileChangeBanner*/ ctx[4], false, false, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(160:8) {#if !banner.enabled}",
    		ctx
    	});

    	return block;
    }

    // (151:4) <DokaOverlay          class="banner"         utils="crop"         crop={banner.crop}         src={banner.src}         enabled={banner.enabled}         onconfirm={handleDokaConfirmBanner}         oncancel={handleDokaCancelBanner}>
    function create_default_slot$1(ctx) {
    	let t;
    	let img;
    	let img_src_value;
    	let if_block = !/*banner*/ ctx[0].enabled && create_if_block_2(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			t = space();
    			img = element("img");
    			if (img.src !== (img_src_value = /*banner*/ ctx[0].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-8kpjj2");
    			add_location(img, file$5, 164, 8, 3591);
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, t, anchor);
    			insert_dev(target, img, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (!/*banner*/ ctx[0].enabled) {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block_2(ctx);
    					if_block.c();
    					if_block.m(t.parentNode, t);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}

    			if (dirty[0] & /*banner*/ 1 && img.src !== (img_src_value = /*banner*/ ctx[0].image)) {
    				attr_dev(img, "src", img_src_value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(t);
    			if (detaching) detach_dev(img);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_default_slot$1.name,
    		type: "slot",
    		source: "(151:4) <DokaOverlay          class=\\\"banner\\\"         utils=\\\"crop\\\"         crop={banner.crop}         src={banner.src}         enabled={banner.enabled}         onconfirm={handleDokaConfirmBanner}         oncancel={handleDokaCancelBanner}>",
    		ctx
    	});

    	return block;
    }

    // (170:8) {#if !profile.enabled}
    function create_if_block_1$1(ctx) {
    	let button;
    	let t1;
    	let input;
    	let dispose;

    	const block = {
    		c: function create() {
    			button = element("button");
    			button.textContent = "Edit";
    			t1 = space();
    			input = element("input");
    			attr_dev(button, "class", "button-edit svelte-8kpjj2");
    			add_location(button, file$5, 170, 8, 3714);
    			attr_dev(input, "class", "input-file svelte-8kpjj2");
    			attr_dev(input, "type", "file");
    			attr_dev(input, "accept", "image/*");
    			add_location(input, file$5, 171, 8, 3801);

    			dispose = [
    				listen_dev(button, "click", /*handleToggleProfileEditor*/ ctx[7], false, false, false),
    				listen_dev(input, "change", /*handleFileChangeProfile*/ ctx[8], false, false, false)
    			];
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, button, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, input, anchor);
    		},
    		p: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(button);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(input);
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(170:8) {#if !profile.enabled}",
    		ctx
    	});

    	return block;
    }

    // (181:0) {#if profile.enabled }
    function create_if_block$1(ctx) {
    	let current;

    	const dokamodal = new DokaModal$1({
    			props: {
    				utils: "crop, filter, color",
    				cropAspectRatio: "1",
    				src: /*profile*/ ctx[1].src,
    				crop: /*profile*/ ctx[1].crop,
    				outputData: true,
    				cropMask: /*mask*/ ctx[2],
    				onconfirm: /*handleDokaConfirmProfile*/ ctx[9],
    				oncancel: /*handleDokaCancelProfile*/ ctx[10]
    			},
    			$$inline: true
    		});

    	const block = {
    		c: function create() {
    			create_component(dokamodal.$$.fragment);
    		},
    		m: function mount(target, anchor) {
    			mount_component(dokamodal, target, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dokamodal_changes = {};
    			if (dirty[0] & /*profile*/ 2) dokamodal_changes.src = /*profile*/ ctx[1].src;
    			if (dirty[0] & /*profile*/ 2) dokamodal_changes.crop = /*profile*/ ctx[1].crop;
    			dokamodal.$set(dokamodal_changes);
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dokamodal.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dokamodal.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			destroy_component(dokamodal, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(181:0) {#if profile.enabled }",
    		ctx
    	});

    	return block;
    }

    function create_fragment$6(ctx) {
    	let h2;
    	let t1;
    	let div1;
    	let t2;
    	let div0;
    	let t3;
    	let img;
    	let img_src_value;
    	let t4;
    	let if_block1_anchor;
    	let current;

    	const dokaoverlay = new DokaOverlay$1({
    			props: {
    				class: "banner",
    				utils: "crop",
    				crop: /*banner*/ ctx[0].crop,
    				src: /*banner*/ ctx[0].src,
    				enabled: /*banner*/ ctx[0].enabled,
    				onconfirm: /*handleDokaConfirmBanner*/ ctx[5],
    				oncancel: /*handleDokaCancelBanner*/ ctx[6],
    				$$slots: { default: [create_default_slot$1] },
    				$$scope: { ctx }
    			},
    			$$inline: true
    		});

    	let if_block0 = !/*profile*/ ctx[1].enabled && create_if_block_1$1(ctx);
    	let if_block1 = /*profile*/ ctx[1].enabled && create_if_block$1(ctx);

    	const block = {
    		c: function create() {
    			h2 = element("h2");
    			h2.textContent = "Doka Profile";
    			t1 = space();
    			div1 = element("div");
    			create_component(dokaoverlay.$$.fragment);
    			t2 = space();
    			div0 = element("div");
    			if (if_block0) if_block0.c();
    			t3 = space();
    			img = element("img");
    			t4 = space();
    			if (if_block1) if_block1.c();
    			if_block1_anchor = empty();
    			add_location(h2, file$5, 146, 0, 3066);
    			if (img.src !== (img_src_value = /*profile*/ ctx[1].image)) attr_dev(img, "src", img_src_value);
    			attr_dev(img, "alt", "");
    			attr_dev(img, "class", "svelte-8kpjj2");
    			add_location(img, file$5, 174, 8, 3917);
    			attr_dev(div0, "class", "profile svelte-8kpjj2");
    			add_location(div0, file$5, 167, 4, 3652);
    			attr_dev(div1, "class", "demo-profile svelte-8kpjj2");
    			add_location(div1, file$5, 148, 0, 3089);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, h2, anchor);
    			insert_dev(target, t1, anchor);
    			insert_dev(target, div1, anchor);
    			mount_component(dokaoverlay, div1, null);
    			append_dev(div1, t2);
    			append_dev(div1, div0);
    			if (if_block0) if_block0.m(div0, null);
    			append_dev(div0, t3);
    			append_dev(div0, img);
    			insert_dev(target, t4, anchor);
    			if (if_block1) if_block1.m(target, anchor);
    			insert_dev(target, if_block1_anchor, anchor);
    			current = true;
    		},
    		p: function update(ctx, dirty) {
    			const dokaoverlay_changes = {};
    			if (dirty[0] & /*banner*/ 1) dokaoverlay_changes.crop = /*banner*/ ctx[0].crop;
    			if (dirty[0] & /*banner*/ 1) dokaoverlay_changes.src = /*banner*/ ctx[0].src;
    			if (dirty[0] & /*banner*/ 1) dokaoverlay_changes.enabled = /*banner*/ ctx[0].enabled;

    			if (dirty[0] & /*$$scope, banner*/ 2049) {
    				dokaoverlay_changes.$$scope = { dirty, ctx };
    			}

    			dokaoverlay.$set(dokaoverlay_changes);

    			if (!/*profile*/ ctx[1].enabled) {
    				if (if_block0) {
    					if_block0.p(ctx, dirty);
    				} else {
    					if_block0 = create_if_block_1$1(ctx);
    					if_block0.c();
    					if_block0.m(div0, t3);
    				}
    			} else if (if_block0) {
    				if_block0.d(1);
    				if_block0 = null;
    			}

    			if (!current || dirty[0] & /*profile*/ 2 && img.src !== (img_src_value = /*profile*/ ctx[1].image)) {
    				attr_dev(img, "src", img_src_value);
    			}

    			if (/*profile*/ ctx[1].enabled) {
    				if (if_block1) {
    					if_block1.p(ctx, dirty);
    					transition_in(if_block1, 1);
    				} else {
    					if_block1 = create_if_block$1(ctx);
    					if_block1.c();
    					transition_in(if_block1, 1);
    					if_block1.m(if_block1_anchor.parentNode, if_block1_anchor);
    				}
    			} else if (if_block1) {
    				group_outros();

    				transition_out(if_block1, 1, 1, () => {
    					if_block1 = null;
    				});

    				check_outros();
    			}
    		},
    		i: function intro(local) {
    			if (current) return;
    			transition_in(dokaoverlay.$$.fragment, local);
    			transition_in(if_block1);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(dokaoverlay.$$.fragment, local);
    			transition_out(if_block1);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(h2);
    			if (detaching) detach_dev(t1);
    			if (detaching) detach_dev(div1);
    			destroy_component(dokaoverlay);
    			if (if_block0) if_block0.d();
    			if (detaching) detach_dev(t4);
    			if (if_block1) if_block1.d(detaching);
    			if (detaching) detach_dev(if_block1_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$6.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$3($$self, $$props, $$invalidate) {
    	const mask = (root, setInnerHTML) => {
    		setInnerHTML(root, `
        <mask id="my-mask">
            <rect x="0" y="0" width="100%" height="100%" fill="white"/>
            <circle cx="50%" cy="50%" r="50%" fill="black"/>
        </mask>
        <rect fill="rgba(255,255,255,.3125)" x="0" y="0" width="100%" height="100%" mask="url(#my-mask)"/>
        <circle cx="50%" cy="50%" r="50%" fill="transparent" stroke-width="1" stroke="#fff"/>
    `);
    	};

    	const handleToggleBannerEditor = () => {
    		console.log("Toggle Doka Banner Overlay");
    		$$invalidate(0, banner = { ...banner, enabled: !banner.enabled });
    	};

    	const handleFileChangeBanner = e => {
    		if (!e.target.files.length) return;
    		console.log("File Change Doka Banner Overlay");

    		$$invalidate(0, banner = {
    			...banner,
    			srcPrev: banner.src,
    			src: e.target.files[0],
    			enabled: true
    		});
    	};

    	const handleDokaConfirmBanner = output => {
    		console.log("Confirmed Doka Banner Overlay", output);

    		$$invalidate(0, banner = {
    			...banner,
    			src: banner.srcPrev || banner.src,
    			srcPrev: null,
    			image: toURL(output.file),
    			crop: output.data.crop,
    			enabled: false
    		});

    		console.log(banner);
    	};

    	const handleDokaCancelBanner = () => {
    		console.log("Cancelled Doka Banner Overlay");

    		$$invalidate(0, banner = {
    			...banner,
    			src: banner.srcPrev || banner.src,
    			srcPrev: null,
    			enabled: false
    		});
    	};

    	const handleToggleProfileEditor = () => {
    		console.log("Toggle Doka Profile Modal");
    		$$invalidate(1, profile = { ...profile, enabled: !profile.enabled });
    	};

    	const handleFileChangeProfile = e => {
    		if (!e.target.files.length) return;
    		console.log("File Change Doka Profile Overlay");

    		$$invalidate(1, profile = {
    			...profile,
    			srcPrev: profile.src,
    			src: e.target.files[0],
    			enabled: true
    		});
    	};

    	const handleDokaConfirmProfile = output => {
    		console.log("Confirmed Doka Profile Modal", output);

    		$$invalidate(1, profile = {
    			...profile,
    			src: profile.srcPrev || profile.src,
    			srcPrev: null,
    			image: toURL(output.file),
    			crop: output.data.crop,
    			enabled: false
    		});
    	};

    	const handleDokaCancelProfile = () => {
    		console.log("Cancelled Doka Profile Modal");

    		$$invalidate(1, profile = {
    			...profile,
    			src: profile.srcPrev || profile.src,
    			srcPrev: null,
    			enabled: false
    		});
    	};

    	$$self.$capture_state = () => {
    		return {};
    	};

    	$$self.$inject_state = $$props => {
    		if ("banner" in $$props) $$invalidate(0, banner = $$props.banner);
    		if ("profile" in $$props) $$invalidate(1, profile = $$props.profile);
    	};

    	let banner;
    	let profile;

    	 $$invalidate(0, banner = {
    		enabled: false,
    		image: "./assets/profile-banner-preview.jpeg",
    		src: "./assets/profile-banner.jpeg",
    		crop: {
    			aspectRatio: 0.223,
    			center: { x: 0.5, y: 0.543 }
    		}
    	});

    	 $$invalidate(1, profile = {
    		enabled: false,
    		image: "./assets/profile-picture-preview.jpeg",
    		src: "./assets/profile-picture.jpeg",
    		crop: {
    			aspectRatio: 1,
    			center: { x: 0.5378, y: 0.355 }
    		}
    	});

    	return [
    		banner,
    		profile,
    		mask,
    		handleToggleBannerEditor,
    		handleFileChangeBanner,
    		handleDokaConfirmBanner,
    		handleDokaCancelBanner,
    		handleToggleProfileEditor,
    		handleFileChangeProfile,
    		handleDokaConfirmProfile,
    		handleDokaCancelProfile
    	];
    }

    class DemoProfile extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$3, create_fragment$6, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "DemoProfile",
    			options,
    			id: create_fragment$6.name
    		});
    	}
    }

    /* src/App.svelte generated by Svelte v3.16.4 */
    const file$6 = "src/App.svelte";

    function create_fragment$7(ctx) {
    	let div;
    	let h1;
    	let t1;
    	let t2;
    	let t3;
    	let t4;
    	let current;
    	const demoinline = new DemoInline({ $$inline: true });
    	const demomodal = new DemoModal({ $$inline: true });
    	const demoprofile = new DemoProfile({ $$inline: true });
    	const demopreview = new DemoPreview({ $$inline: true });

    	const block = {
    		c: function create() {
    			div = element("div");
    			h1 = element("h1");
    			h1.textContent = "Doka Demos";
    			t1 = space();
    			create_component(demoinline.$$.fragment);
    			t2 = space();
    			create_component(demomodal.$$.fragment);
    			t3 = space();
    			create_component(demoprofile.$$.fragment);
    			t4 = space();
    			create_component(demopreview.$$.fragment);
    			add_location(h1, file$6, 8, 1, 213);
    			attr_dev(div, "class", "svelte-8fs6dc");
    			add_location(div, file$6, 7, 0, 206);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			append_dev(div, h1);
    			append_dev(div, t1);
    			mount_component(demoinline, div, null);
    			append_dev(div, t2);
    			mount_component(demomodal, div, null);
    			append_dev(div, t3);
    			mount_component(demoprofile, div, null);
    			append_dev(div, t4);
    			mount_component(demopreview, div, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(demoinline.$$.fragment, local);
    			transition_in(demomodal.$$.fragment, local);
    			transition_in(demoprofile.$$.fragment, local);
    			transition_in(demopreview.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(demoinline.$$.fragment, local);
    			transition_out(demomodal.$$.fragment, local);
    			transition_out(demoprofile.$$.fragment, local);
    			transition_out(demopreview.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    			destroy_component(demoinline);
    			destroy_component(demomodal);
    			destroy_component(demoprofile);
    			destroy_component(demopreview);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$7.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, null, create_fragment$7, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment$7.name
    		});
    	}
    }

    const app = new App({
    	target: document.body,
    	props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
