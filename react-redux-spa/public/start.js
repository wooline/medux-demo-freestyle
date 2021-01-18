const path = require('path');
const express = require('express');
const chalk = require('chalk');
const fallback = require('express-history-api-fallback');
const {createProxyMiddleware} = require('http-proxy-middleware');
const {createMiddleware} = require('@medux/dev-utils/lib/api-mock');
const config = require('./config');

const apiProxy = config.apiProxy || {};
const server = config.devServer;
const [, , port] = server.split(/:\/*/);
const staticPath = path.join(__dirname, './client');
const mockMiddleware = createMiddleware(path.join(__dirname, 'mock/index.js'));

const app = express();
app.use('/client', express.static(staticPath));
Object.keys(apiProxy).forEach((key) => {
  config.apiMock && app.use(key, mockMiddleware);
  app.use(key, createProxyMiddleware(apiProxy[key]));
});
app.use(fallback('index.html', {root: staticPath}));
app.listen(port, () =>
  console.info(`\n \n.....${new Date().toLocaleString()} starting ${chalk.redBright('Server')} on ${chalk.underline.redBright(server)} \n`)
);
process.send && process.send(1);
