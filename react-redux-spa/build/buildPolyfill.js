const path = require('path');
const fs = require('fs');
const webpack = require('webpack');

const distPath = path.join(__dirname, '../public/client');

const polyfillWebpackConfig = {
  mode: 'production',
  target: 'es5',
  stats: 'minimal',
  devtool: false,
  entry: path.join(__dirname, './polyfill.js'),
  output: {
    path: distPath,
    filename: 'polyfill.js',
  },
};

const compiler = webpack(polyfillWebpackConfig);

compiler.run((err, stats) => {
  if (err) throw err;
  const str = fs.readFileSync(path.join(distPath, 'polyfill.js'));
  fs.writeFileSync(path.join(distPath, 'polyfill.js'), `/* eslint-disable */\n${str}`);
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
