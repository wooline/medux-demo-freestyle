const webpack = require('webpack');
const fs = require('fs-extra');
const path = require('path');
const {clientConfig, serverConfig, distPath, mediaPath} = require('./webpack.config');

fs.emptyDirSync(distPath);

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
