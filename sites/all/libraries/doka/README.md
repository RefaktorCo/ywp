# Doka Image Editor Readme

Thank you so much for purchasing Doka Image Editor!

We've tried to make the documentation as extensive and concise as possible. If you have any questions after reading it, do let us know, we're always happy to assist.

Documentation: https://pqina.nl/doka/docs/
Support: https://dash.pqina.nl/login/

## Quick Start

If you just want to get on your way, you can use on of the included preset projects as a starting point.

## License key

The license key is only used for registering the purchase and gaining access to the PQINA customer portal, it does not have to be set on the JavaScript package.

## Package

-   The _packages_ folder contains the library files suitable for various project types.
-   The _presets_ folder contains multiple example integrations with different JavaScript framework and file upload components.

The _packages_ folder contains the core _doka_ folder which includes the Doka Image Editor IIFE, UMD, and JavaScript Module builds as well as the stylesheet.

All other folders inside the _packages_ folder are for use with specific project types.

We strongly advise to use the _JavaScript Module_ build.

## Compatibility

The Doka Image Editor JavaScript Module works on all modern browsers and devices.

-   Chrome
-   Firefox
-   Edge 79+
-   Safari 13+
-   Opera
-   Chrome for Android
-   Firefox Android
-   iOS Safari 13+
-   Chrome for iOS
-   Firefox iOS

JavaScript module support statistics: https://caniuse.com/es6-module

### Safar 11 and 12

-   Safari 11 (global usage 0.05%)
-   Safari 12 (global usage 0.01%)

To add support for these browsers we need to polyfill Pointer Events.
Download polyfill here: https://github.com/Rich-Harris/Points

### Safari 10 and Edge 18

-   Safari 10 (global usage 0.01%)
-   Edge 18 (global usage 0.23%)

These browsers don't fully support JavaScript modules and will require polyfills to function correctly. To make Doka Image Editor work on these browsers you'll need to load the IIFE version or transpile a compatible version yourself.

Required polyfills for Edge 18:

-   Symbol.asyncIterator
-   HTMLCanvasElement.prototype.toBlob

Include this URL in your page to polyfill both the APIs above: https://polyfill.io/v3/polyfill.min.js?features=Symbol.asyncIterator%2CHTMLCanvasElement.prototype.toBlob

### Internet Explorer 11

Internet Explorer 11 is currently not supported, global usage is at around 1.12%.

We're surveying customer requirements, please let use know if you require compatibility and why.

### JavaScript Module

This is the JavaScript module build of Doka Image Editor. We can add this version to the page by setting the script `type` attribute to `"module"`.

If you're not familiar with JavaScript modules, please read this JavaScript modules introduction on MDN: https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Modules#Introducing_an_example

The Doka Image Editor module supports tree-shaking and will work perfectly with webpack, rollup.js, Parcel, or Snowpack.

We can load the JavaScript module version like this:

```html
<script type="module">
    import { openEditor } from './doka/doka.js';
    openEditor({
        /* editor options */
    });
</script>
```

**Please note that the JavaScript module version isn't minified.**

After importing the required submodules, compressing the result with a tool like Terser, and gzipping the package, the end result is around 100KB depending on which plugins you use.

### IIFE

This version adds a `doka` variable to the global window namespace. Include in the page with a normal script tag. This version of Doka Image Editor is minified.

```html
<script src="./doka/doka-iife.js"></script>
<script>
    doka.openEditor({
        /* editor options */
    });
</script>
```

### UMD

This version is for use with RequireJS or other AMD module loaders. The UMD version of Doka Image Editor is also minified.

```js
define('./doka/doka-umd', ([doka]) => {
    doka.openEditor({
        /* editor options */
    });
});
```

## Support

If you've run into an issue or have a question. No worries, we're here to help out!

Make sure you've updated Doka Image Editor to the latest version, files are available on the PQINA customer portal.

Customer portal: https://dash.pqina.nl/

**Please make sure the problem is not related to one of the file upload plugins. To confirm this, please run a test with the basic file input example first.**

### We can help out with the following

-   Available to answer questions;
-   Assistance with reported Doka Image Editor bugs and issues;
-   Answer questions related to the installation of Doka Image Editor;

### We can't help out with

-   Customisation of Doka Image Editor;
-   Debugging of project specific code;

### Support details

When contacting support, try to supply us with as much information as possible, this helps us resolves the issue faster. Please see the list below for an overview of what to send.

-   What browsers and devices have you testing on;
-   Which OS are you testing on;
-   Screenshots or videos that clearly show the problem;
-   A step-by-step test scenario (so we know how to reproduce the problem);
-   A concise and publicly accessible test case or website;

Support: https://dash.pqina.nl/
