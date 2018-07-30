const path = require('path');
const glob = require('glob');
const { DefinePlugin, HashedModuleIdsPlugin } = require('webpack');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const UglifyJsPlugin = require('uglifyjs-webpack-plugin');
const PurgecssPlugin = require('purgecss-webpack-plugin');
const OptimizeCssAssetsPlugin = require('optimize-css-assets-webpack-plugin');

module.exports = merge(commonConfig, {
    mode: 'production',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].[chunkhash].js'
    },

    optimization: {
        minimizer: [
            new UglifyJsPlugin({
                parallel: true,
                sourceMap: true,
                uglifyOptions: {
                    mangle: true,
                    toplevel: false,
                    output: {
                        comments: false,
                    },
                    nameCache: null,
                    ie8: false,
                    keep_classnames: false,
                    keep_fnames: false,
                    safari10: false,
                }
            })
        ]
    },

    plugins: [
        new DefinePlugin({
            'process.env.NODE_ENV': JSON.stringify('production')
        }),

        new MiniCssExtractPlugin({
            filename: "[name].[contenthash].css",
            chunkFilename: "[id].[contenthash].css",
        }),

        new OptimizeCssAssetsPlugin({
            cssProcessorOptions: {
                map: { inline: false }
            }
        }),

        new PurgecssPlugin({
            paths: glob.sync(`${path.join(__dirname, 'src')}/**/*`, { nodir: true })
        }),

        new HashedModuleIdsPlugin()
    ],

    devtool: 'source-map'
});