const path = require('path');
const express = require('express');
const chalk = require('chalk');
const fallback = require('express-history-api-fallback');

const server = 'http://localhost:3000';
const [, , port] = server.split(/:\/*/);

const staticPath = path.join(__dirname, './client');

const app = express();
app.use('/client', express.static(staticPath));
app.use(fallback('index.html', {root: staticPath}));
app.listen(port, () => console.info(chalk`.....${new Date().toLocaleString()} starting {red Dev Server} on {green ${server}/} \n`));
process.send && process.send(1);
