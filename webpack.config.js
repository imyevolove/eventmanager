var path = require('path');
const libraryFilename   = 'event-manager.js';

module.exports = {
    watch: true,
    devtool: 'source-map',
    entry: path.join(__dirname, 'src/index.js'),
    output: {
        path:           path.join(__dirname, '/build'),
        filename:       libraryFilename,
        libraryTarget:  'umd',
        umdNamedDefine: true
    },
    module: {
        rules: [{
            test: /\.jsx?$/,
            use: {
                loader: "babel-loader?presets[]=es2015",
                options: {
                    presets: ['@babel/preset-env'],
                    plugins: [
                        "@babel/plugin-proposal-class-properties",
                        "@babel/plugin-proposal-private-methods"
                    ]
                }
            }
        }]
    },
    stats: {
        colors: true
    }
};