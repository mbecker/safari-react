const path = require('path');
const express = require('express');
const compression = require('compression')
const webpack = require('webpack');
const webpackMiddleware = require('webpack-dev-middleware');
const webpackHotMiddleware = require('webpack-hot-middleware');
const config = require('./webpack.config.js');

// We need to add a configuration to our proxy server,
// as we are now proxying outside localhost
var httpProxy = require('http-proxy');
var proxy = httpProxy.createProxyServer({
    changeOrigin: true
});

var app = express();

var isProduction = process.env.NODE_ENV === 'production';
var port = isProduction ? process.env.PORT : 3000;
var publicPath = path.resolve(__dirname, 'dist');

/** cache values */
const ONE_HOUR = 60 * 60;
const ONE_WEEK = ONE_HOUR * 24 * 7;
const ONE_MONTH = ONE_WEEK * 4;
const ONE_YEAR = ONE_MONTH * 12;

// Proxy request to local server to Firebase
// localhost:3000/db/items.json to glowing-carpet-4534.firebaseio.com/db/items
app.all('/db/*', function(req, res) {
    proxy.web(req, res, {
        target: 'https://glowing-carpet-4534.firebaseio.com'
    });
});


if (!isProduction) {
    console.log('-- Development');
    const compiler = webpack(config);
    const middleware = webpackMiddleware(compiler, {
        publicPath: '/',
        contentBase: 'src',
        stats: {
            colors: true,
            hash: false,
            timings: true,
            chunks: false,
            chunkModules: false,
            modules: false
        }
    });

    app.use(middleware);
    app.use(webpackHotMiddleware(compiler));
    app.get('*', function response(req, res) {
        console.log(path.join(publicPath, 'index.html'));
        res.write(middleware.fileSystem.readFileSync(path.join(publicPath, 'index.html')));
        res.end();
    });
} else {
    console.log('-- Production');
    // compress all requests
    app.use(compression());
    // Since we're sending far-future expires, we don't need ETags for
    // static content.
    //   developer.yahoo.com/performance/rules.html#etags
    app.use(express.static(publicPath, {
        maxage: ONE_WEEK,
        etag: false
    }))
    app.get('*', function response(req, res) {
        /**
         * Set Keep-Alive Header
         */
        // Keep-Alive allows the server to send multiple requests through one
        // TCP-expression. Be aware of possible disadvantages of this setting. Turn on
        // if you serve a lot of static content.
        res.setHeader('Connection', 'keep-alive');
        res.removeHeader('X-Powered-By');
        res.sendFile(path.join(__dirname, 'dist/index.html'));
    });
}

proxy.on('error', function(e) {
    console.log('Could not connect to proxy, please try again...');
});

app.listen(port, '0.0.0.0', function onStart(err) {
    if (err) {
        console.log(err);
    }
    console.info('==> 🌎 Listening on port %s. Open up http://0.0.0.0:%s/ in your browser.', port, port);
});
