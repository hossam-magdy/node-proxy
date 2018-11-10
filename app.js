const http = require('http');
const connect = require('connect');
const httpProxy = require('http-proxy');
const transformerProxy = require('transformer-proxy');

const config = {
    port: 5050,
    target: 'http://127.0.0.1:3000'
};

// Create a proxy server with custom application logic
const proxy = httpProxy.createProxyServer({});

proxy.on('proxyReq', (proxyReq, req, res, options) => {
    console.log('Raw Request from the target', req.headers);

    // REQUEST HEADER MANIPULATION GOES HERE
    proxyReq.setHeader('X-Special-Proxy-Header', 'foobar');
    proxyReq.removeHeader('user-agent');
});

proxy.on('proxyRes', (proxyRes, req, res) => {
    console.log('Raw Response from the server', proxyRes.headers);
});

const app = connect();

// RESPONSE HEADER MANIPULATION GOES HERE
const headers = [{
    name: 'x-powered-by',
    value: null
}];

app.use(transformerProxy(i => i, { headers: headers }));

app.use((req, res) => {
    // REQUEST HEADER MANIPULATION GOES HERE TOO
    // delete req.headers['user-agent'];
    proxy.web(req, res, { target: config.target });
});

const server = http.createServer(app);

console.log("listening on port " + config.port)
server.listen(config.port);
