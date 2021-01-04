const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const {patch} = require('@medux/dev-utils/dist/patch-actions');
const {clientConfig, devServerConfig} = require('./webpack.config');

patch();

const compiler = webpack(clientConfig);

const devServer = new WebpackDevServer(compiler, devServerConfig);

devServer.listen(devServerConfig.port, 'localhost', (err) => {
  if (err) throw err;
});
