var http = require('http'),
    httpProxy = require('http-proxy');

var proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', function (proxyReq, req, res, options) {
    console.log('Raw Request from the target', req.headers);
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
});

proxy.on('proxyRes', function (proxyRes, req, res) {
    var resWriteHead = res.writeHead.bind(res);
    res.writeHead = function (code, headers) {
        res.removeHeader('Content-Length');

        var o_headers = [{
            name: 'x-powered-by',
            value: null
        }];

        if (o_headers) {
            o_headers.forEach(function (header) {
                if (header.value) {
                    res.setHeader(header.name, header.value);
                } else {
                    res.removeHeader(header.name);
                }
            });
        }

        if (headers) {
            delete headers['content-length'];
        }

        resWriteHead.apply(null, arguments);
    };
    res.setHeader('Access-Control-Allow-Methods', 'POST, GET, OPTIONS');
    console.log('Raw Response from the server', proxyRes.headers);
});

// Create your custom server and just call `proxy.web()` to proxy
// a web request to the target passed in the options
// also you can use `proxy.ws()` to proxy a websockets request
var server = http.createServer(function (req, res) {
    // You can define here your custom logic to handle the request
    // and then proxy the request.
    proxy.web(req, res, { target: 'http://127.0.0.1:3000' });
});

console.log("listening on port 5050")
server.listen(5050);
