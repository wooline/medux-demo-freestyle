const path = require('path');
const express = require('express');
const chalk = require('chalk');
const serverBundle = require('./server/main');

const server = 'http://localhost:3000';
const [, , port] = server.split(/:\/*/);

const app = express();
app.use('/client', express.static(path.join(__dirname, './client'), {fallthrough: false}));
app.use((req, res, next) => {
  serverBundle
    .default(req, res)
    .then((str) => {
      res.end(str.replace('main.48190915.js', 'main.880d17b4.js').replace('main.95d1dbcc.css', 'main.6c48b7c3.css'));
    })
    .catch((e) => {
      console.log(e);
      res.status(500).end(e.toString());
    });
});
app.listen(port, () => console.info(chalk`.....${new Date().toLocaleString()} starting {red SSR Server} on {green ${server}/} \n`));
process.send && process.send(1);
