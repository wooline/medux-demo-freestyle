const webpack = require('webpack');
const fs = require('fs-extra');
const path = require('path');
const {patch} = require('@medux/dev-utils/lib/patch-actions');
const {clientWebpackConfig, serverWebpackConfig, projectConfigJson, distPath, mediaPath, publicPath, envPath, mockPath} = require('./webpack.config');

patch();

fs.ensureDirSync(distPath);
fs.emptyDirSync(distPath);
fs.copySync(publicPath, distPath, {dereference: true});
fs.copySync(envPath, distPath, {dereference: true});
fs.moveSync(path.join(distPath, '../mock'), path.join(distPath, 'mock'), {dereference: true});
fs.writeFileSync(path.join(distPath, 'config.js'), `module.exports = ${projectConfigJson}`);

const compiler = webpack([clientWebpackConfig, serverWebpackConfig]);

compiler.run((err, stats) => {
  if (err) throw err;
  fs.removeSync(path.join(distPath, 'server', mediaPath));

  process.stdout.write(
    `${stats.toString({
      colors: true,
      modules: false,
      children: false,
      chunks: false,
      chunkModules: false,
    })}\n\n`
  );
});
