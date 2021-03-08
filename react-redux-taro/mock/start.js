const path = require('path');
const express = require('express');
const chalk = require('chalk');
const {createMiddleware} = require('@medux/dev-utils/lib/api-mock');
const {createProxyMiddleware} = require('http-proxy-middleware');
const bodyParser = require('body-parser');

const staticPath = path.join(__dirname, './static');
const mockMiddleware = createMiddleware(path.join(__dirname, './index.ts'));

const apiProxy = {
  '/api': {
    target: 'http://192.168.0.232:8000',
    pathRewrite: {
      '^/api': '',
    },
    xfwd: true,
    secure: false,
    changeOrigin: true,
    timeout: 3000,
    proxyTimeout: 3000,
  },
};
const server = 'http://localhost:4002';
const [, , port] = server.split(/:\/*/);

const app = express();
app.use('/client', express.static(staticPath));
app.use(bodyParser.urlencoded({extended: true}));
app.use(bodyParser.json());
Object.keys(apiProxy).forEach((key) => {
  app.use(key, (req, res, next) => {
    res.set({
      'Access-Control-Allow-Credentials': true,
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': '*',
      'Access-Control-Allow-Headers': '*',
    });
    if (req.method.toLowerCase() === 'options') {
      res.sendStatus(200).end();
    } else {
      next();
    }
  });
  app.use(key, mockMiddleware);
  app.use(key, createProxyMiddleware(apiProxy[key]));
});

app.listen(port, () =>
  console.info(`\n \n.....${new Date().toLocaleString()} starting ${chalk.redBright('Server')} on ${chalk.underline.redBright(server)} \n`)
);
