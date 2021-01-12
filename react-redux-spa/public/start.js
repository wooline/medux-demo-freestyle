const path = require('path');
const express = require('express');
const chalk = require('chalk');
const fallback = require('express-history-api-fallback');
const {createProxyMiddleware} = require('http-proxy-middleware');
const createMockMiddleware = require('@medux/dev-utils/lib/api-mock');
const config = require('./config');

const apiProxy = config.apiProxy || {};
const server = 'http://localhost:3000';
const [, , port] = server.split(/:\/*/);

const staticPath = path.join(__dirname, './client');

const mockMiddleware = createMockMiddleware(path.join(__dirname, 'mock'));
const app = express();
app.use('/client', express.static(staticPath));
Object.keys(apiProxy).forEach((key) => {
  config.apiMock && app.use(key, mockMiddleware);
  app.use(key, createProxyMiddleware(apiProxy[key]));
});
app.use(fallback('index.html', {root: staticPath}));
app.listen(port, () => console.info(chalk`.....${new Date().toLocaleString()} starting {red Server} on {green ${server}/} \n`));
process.send && process.send(1);
