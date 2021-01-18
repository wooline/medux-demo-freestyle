const webpack = require('webpack');
const chalk = require('chalk');
const WebpackDevServer = require('webpack-dev-server');
const {patch} = require('@medux/dev-utils/lib/patch-actions');
const {clientWebpackConfig, serverWebpackConfig, devServerConfig} = require('./webpack.config');

patch();

const server = 'http://localhost:4000';
const [, , port] = server.split(':');
devServerConfig.port = port;

const compiler = webpack([clientWebpackConfig, serverWebpackConfig]);

const devServer = new WebpackDevServer(compiler, devServerConfig);

devServer.listen(port, '0.0.0.0', (err) => {
  if (err) throw err;
  console.info(`\n \n.....${new Date().toLocaleString()} starting ${chalk.redBright('Server')} on ${chalk.underline.redBright(server)} \n`);
});
