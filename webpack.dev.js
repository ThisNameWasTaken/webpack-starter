const path = require('path');
const merge = require('webpack-merge');
const commonConfig = require('./webpack.common');

module.exports = merge(commonConfig, {
    mode: 'production',

    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js'
    },

    devServer: {
        contentBase: './dist'
    },

    devtool: 'inline-source-map'
});