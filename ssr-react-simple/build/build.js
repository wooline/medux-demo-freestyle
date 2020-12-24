const webpack = require('webpack');
const fs = require('fs-extra');
const path = require('path');
const {clientConfig, serverConfig, distPath, mediaPath, staticPath, configPath} = require('./webpack.config');

fs.ensureDirSync(distPath);
fs.emptyDirSync(distPath);
fs.copySync(staticPath, distPath, {dereference: true});
fs.copySync(configPath, distPath, {dereference: true});

const compiler = webpack([clientConfig, serverConfig]);

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
