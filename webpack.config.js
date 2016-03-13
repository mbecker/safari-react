var webpack = require('webpack');

module.exports = {
    // Makes sure errors in console map to the correct file
    // and line number
    devtool: "eval",
    entry: [
        // The script refreshing the browser on none hot updates
        'webpack-dev-server/client?http://localhost:8080',
        // For hot style updates
        'webpack/hot/only-dev-server',
        // Our application
        './src/index.jsx',
        './css/theguide.scss'
    ],
    module: {
        loaders: [{
            test: /.jsx?$/,
            loader: 'babel-loader',
            exclude: /(node_modules|bower_components)/
        }, {
            test: /\.scss$/,
            loader: "style!css!sass",
            exclude: /(node_modules|bower_components)/
        }]
    },
    resolve: {
        extensions: ['', '.js', '.jsx']
    },
    output: {
        // We need to give Webpack a path. It does not actually need it,
        // because files are kept in memory in webpack-dev-server, but an
        // error will occur if nothing is specified. We use the buildPath
        // as that points to where the files will eventually be bundled
        // in production
        path: __dirname + '/dist',
        publicPath: '/',
        filename: 'bundle.js'
    },
    devServer: {
        contentBase: './dist',
        hot: true
    },
    plugins: [
        new webpack.HotModuleReplacementPlugin()
    ]
};
