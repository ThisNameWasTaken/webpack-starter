const path = require('path');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const InlineSVGPlugin = require('html-webpack-inline-svg-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CrittersPlugin = require('critters-webpack-plugin');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ScriptExtHtmlWebpackPlugin = require('script-ext-html-webpack-plugin');
const { GenerateSW, InjectManifest } = require('workbox-webpack-plugin');

// Environment constants
const IS_DEV = process.argv.includes('development');
const IS_PROD = !IS_DEV;

module.exports = {
    entry: {
        main: './src/js/main.js'
    },

    module: {
        rules: [{
            test: /\.(html)$/i,
            use: {
                loader: 'html-loader',
                options: {
                    attrs: [':src', ':data-src', 'source:srcset', 'source:data-srcset'], // load images from html
                    minimize: IS_PROD,
                    removeComments: IS_PROD,
                    collapseWhitespace: IS_PROD,
                    conservativeCollapse: false,
                    interpolate: true
                }
            }
        }, {
            // transpile es6 to es5
            test: /\.js$/i,
            exclude: /node_modules/,
            use: [{
                loader: 'babel-loader',
                options: {
                    presets: [
                        ['env', { modules: false /* allow tree shaking */ }]
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
                loader: 'css-loader',
                options: {
                    sourceMap: true,
                    minimize: true
                }
            }, {
                loader: 'postcss-loader',
                options: {
                    sourceMap: true,
                    plugins: [require('autoprefixer')({ browsers: ['last 2 versions', '> 1%'] })]
                }
            }, {
                loader: 'sass-loader', options: {
                    sourceMap: true,
                    includePaths: ['node_modules']
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
            template: './src/index.html',
            chunks: ['main'],
            minify: {
                removeRedundantAttributes: true,
                removeScriptTypeAttributes: true,
                removeStyleLinkTypeAttributes: true
            }
        }),

        new ScriptExtHtmlWebpackPlugin({
            defaultAttribute: 'async'
        }),

        new CrittersPlugin(),

        new InlineSVGPlugin(),

        new InjectManifest({
            swSrc: './src/serviceWorker.js'
        })
    ]
};