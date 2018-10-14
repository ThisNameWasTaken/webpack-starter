[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/ThisNameWasTaken/webpack-starter/blob/master/LICENSE)
[![Build Status](https://travis-ci.org/ThisNameWasTaken/webpack-starter.svg?branch=master)](https://travis-ci.org/ThisNameWasTaken/webpack-starter)
[![devDependency Status](https://david-dm.org/ThisNameWasTaken/webpack-starter/dev-status.svg)](https://david-dm.org/ThisNameWasTaken/webpack-starter#info=devDependencies)
# Webpack Starter

**Webpack Starter** is a simple webpack config meant for projects using vanilla javascript.

## What does Webpack Starter do?

* It loads html and imports partials using the [HTMLWeabpackPlugin](https://webpack.js.org/plugins/html-webpack-plugin/)
* It transpiles pug into html using the [pug-plain-loader](https://www.npmjs.com/package/pug-plain-loader)
* It transpiles ES6 code to ES5 using [babel](http://babeljs.io/docs/setup/#installation)
* It transpiles sass into css using [sass-loader](https://www.npmjs.com/package/sass-loader)
* It ensures browser compatility using [autoprefixer](https://www.npmjs.com/package/autoprefixer)
* It inlines critical styles using the [critical-plugin for webpack](https://www.npmjs.com/package/critical-plugin)
* It removes unused css rules using [purgecss](https://www.npmjs.com/package/purgecss-webpack-plugin)
* It creates a development server using [webpack-dev-server](https://www.npmjs.com/package/webpack-dev-server)
* It adds offline support using [webpack-workbox-plugin](https://developers.google.com/web/tools/workbox/modules/workbox-webpack-plugin)

## Install dependencies

```
npm install
```

## Start the development server

```
npm start
```

## Build for production

```
npm run build
```

## How to import html files instead of pug files
Inside an html file add the fallowing code

```js
<!-- header goes here -->
${require('./includes/header.html')}

...

<!-- footer goes here -->
${require('./includes/footer.html')}
```

Inside `webpack.common.js` look for the `HTMLWebpackPlugin` and replace the `.pug` extension with `.html`

```diff
plugins: [
    ...

    new HtmlWebpackPlugin({
-       template: './src/views/index.pug',
+       template: './src/views/index.html',
        chunks: ['main']
    }),

    ...
]
```

That is about it. Remember either to restart the server or rebuild.