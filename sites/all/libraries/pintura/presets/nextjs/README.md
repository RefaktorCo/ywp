# Readme

Because the Pintura Image Editor packages are installed locally we need the "next-transpile-modules" package to tell NextJS to transpile the local packages (see https://github.com/vercel/next.js/issues/706).

https://github.com/martpie/next-transpile-modules

`npm i next-transpile-modules --save`

And add or adjust the next.config.js file like this:

```js
// next.config.js
const withTM = require('next-transpile-modules')(['pintura', 'react-pintura']);
module.exports = withTM();
```
