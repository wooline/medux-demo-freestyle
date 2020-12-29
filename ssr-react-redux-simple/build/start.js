const webpack = require('webpack');
const WebpackDevServer = require('webpack-dev-server');
const {patch} = require('@medux/dev-utils/dist/patch-actions');
const {clientConfig, serverConfig, devServerConfig} = require('./webpack.config');

patch();

const compiler = webpack([clientConfig, serverConfig]);

const devServer = new WebpackDevServer(compiler, devServerConfig);

devServer.listen(devServerConfig.port, '0.0.0.0', (err) => {
  if (err) throw err;
});
