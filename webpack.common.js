const fs = require('fs');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const { GenerateSW, InjectManifest } = require('workbox-webpack-plugin');
const autoprefixer = require('autoprefixer');

// installed node modules that must be transpiled through babel
const includedNodeModules = [
    'MODULE_THAT_MUST_BE_INCLUDED',
    'ANOTHER_MODULE_THAT_MUST_BE_INCLUDED'
];

// Environment constants
const IS_DEV = process.argv.includes('development');
const IS_PROD = !IS_DEV;

const sassPath = './src/sass/main.sass';
const scssPath = sassPath.replace(/\.sass$/g, '.scss');

const htmlLoaderConfig = {
    loader: 'html-loader',
    options: {
        attrs: [':src', ':data-src', 'source:srcset', 'source:data-srcset'], // load images from html
        interpolate: true
    }
};

module.exports = {
    entry: {
        main: [
            fs.existsSync(sassPath) ? sassPath : scssPath,
            './src/js/main.js'
        ]
    },

    module: {
        rules: [{
            test: /\.html$/i,
            use: htmlLoaderConfig
        }, {
            test: /\.pug$/i,
            use: [htmlLoaderConfig, {
                loader: 'pug-plain-loader'
            }]
        }, {
            // transpile es6 to es5
            test: /\.js$/i,
            exclude: new RegExp(`node_modules/(?!(${includedNodeModules.join('|')})/).*`),
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['@babel/preset-env', { modules: false /* allow tree shaking */ }]
                    ],
                }
            }, {
                loader: 'eslint-loader'
            }]
        }, {
            // transpile sass and autoprefix it
            test: /\.(sass|scss|css)$/i,
            use: [{
                loader: IS_PROD ? MiniCssExtractPlugin.loader : 'style-loader'
            }, {
                loader: 'css-loader'
            }, {
                loader: 'postcss-loader',
                options: {
                    plugins: [
                        autoprefixer({ browsers: ['last 2 versions', '> 1%'] })
                    ]
                }
            }, {
                loader: 'sass-loader',
                options: {
                    includePaths: ['./node_modules']
                }
            }]
        }, {
            // load images
            test: /\.(png|jpe?g|gif|webp)$/i,
            use: [{
                loader: 'url-loader',
                options: { limit: 8192 }
            }]
        }, {
            test: /\.svg$/i,
            use: [{
                loader: 'url-loader',
                options: { limit: 1 }
            }]
        }]
    },

    plugins: [
        new CleanWebpackPlugin('dist'),

        new HtmlWebpackPlugin({
            template: './src/views/index.pug',
            chunks: ['main']
        }),

        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'async'
        }),

        new InlineSVGPlugin(),

        new InjectManifest({
            swSrc: './src/serviceWorker.js'
        })
    ]
};