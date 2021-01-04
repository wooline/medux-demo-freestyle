const webpack = require('webpack');
const fs = require('fs-extra');
const path = require('path');
const {patch} = require('@medux/dev-utils/dist/patch-actions');
const {clientConfig, distPath, staticPath, configPath} = require('./webpack.config');

patch();

fs.ensureDirSync(distPath);
fs.emptyDirSync(distPath);
fs.copySync(staticPath, distPath, {dereference: true});
fs.copySync(configPath, distPath, {dereference: true});

const compiler = webpack(clientConfig);

compiler.run((err, stats) => {
  if (err) throw err;

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
