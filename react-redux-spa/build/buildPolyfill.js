const path = require('path');
const webpack = require('webpack');

const polyfillWebpackConfig = {
  mode: 'production',
  target: 'es5',
  stats: 'minimal',
  devtool: false,
  entry: path.join(__dirname, './polyfill.js'),
  output: {
    path: path.join(__dirname, '../public/client'),
    filename: 'polyfill.js',
  },
};

const compiler = webpack(polyfillWebpackConfig);

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
