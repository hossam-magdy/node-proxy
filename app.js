const http = require('http'),
    connect = require('connect'),
    httpProxy = require('http-proxy'),
    transformerProxy = require('transformer-proxy');

const CONFIG = {
    PORT: 5050,
    TARGET: 'http://127.0.0.1:3000',
    REQUEST_HEADERS: [
        { name: 'X-Secret-Header', value: 'injected header value' },
    ],
    RESPONSE_HEADERS: [
        { name: 'X-Secret-Header', value: null }, // null => remove header
    ],
};

const proxy = httpProxy.createProxyServer({});
proxy.on('proxyReq', (proxyReq, req, res, options) => {
    console.log('Raw reqHeaders:', proxyReq._headers);
    for (let header of CONFIG.REQUEST_HEADERS) {
        if (header.value === null) proxyReq.removeHeader(header.name);
        else proxyReq.setHeader(header.name, header.value);
    }
});
proxy.on('proxyRes', (proxyRes, req, res) => {
    console.log('Raw respHeaders:', proxyRes.headers);
});

const app = connect();
app.use(transformerProxy(i => i, { headers: CONFIG.RESPONSE_HEADERS }));
app.use((req, res) => {
    // Also possible here to change headers: delete req.headers['user-agent'];
    proxy.web(req, res, { target: CONFIG.TARGET });
});

const server = http.createServer(app);
server.listen(CONFIG.PORT);
