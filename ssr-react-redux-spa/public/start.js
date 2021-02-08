const path = require('path');
const express = require('express');
const chalk = require('chalk');
const {createProxyMiddleware} = require('http-proxy-middleware');
const {createMiddleware} = require('@medux/dev-utils/lib/api-mock');
const serverBundle = require('./server/main');
const config = require('./config');

global.ENV = config.serverGlobalVar;
const apiProxy = config.apiProxy || {};
const server = config.devServer;
const [, , port] = server.split(/:\/*/);
const staticPath = path.join(__dirname, './client');
const mockMiddleware = createMiddleware(path.join(__dirname, 'mock/index.js'));

const app = express();
app.use('/client', express.static(path.join(__dirname, './client'), {fallthrough: false}));
Object.keys(apiProxy).forEach((key) => {
  config.apiMock && app.use(key, mockMiddleware);
  app.use(key, createProxyMiddleware(apiProxy[key]));
});
app.use((req, res, next) => {
  try {
    serverBundle
      .default(req, res)
      .then((str) => {
        res.end(str.replace('main.0ec5e296.js', 'main.4424c8c0.js').replace('main.985b0032.css', 'main.001e7ac6.css'));
      })
      .catch((e) => {
        console.log(e);
        res.status(500).end(e.toString());
      });
  } catch (e) {
    console.log(e);
    res.status(500).end(e.toString());
  }
});
app.listen(port, () => console.info(chalk`.....${new Date().toLocaleString()} starting {red Server} on {green ${server}/} \n`));
process.send && process.send(1);
