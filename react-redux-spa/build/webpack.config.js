const path = require('path');
const chalk = require('chalk');
const deepExtend = require('deep-extend');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');

const debugMode = !!process.env.DEBUG;
const nodeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const isProdModel = nodeEnv === 'production';
const projEnv = process.env.PROJ_ENV || 'common';

const rootPath = path.join(__dirname, '../');
const srcPath = path.join(rootPath, './src');
const distPath = path.join(rootPath, './dist', projEnv);
const staticPath = path.join(rootPath, './public');
const envPath = path.join(rootPath, './env');
const configPath = path.join(envPath, projEnv);
const commonConfig = require(path.join(envPath, 'common', 'config'));
const currentConfig = require(path.join(configPath, 'config'));

const projConfig = deepExtend({}, commonConfig[nodeEnv], currentConfig[nodeEnv]);
// eslint-disable-next-line no-nested-ternary
const devtool = isProdModel ? 'cheap-module-source-map' : debugMode ? 'eval-cheap-module-source-map' : 'eval';
console.log(`env: ${nodeEnv}(debuger ${devtool}) \n ${chalk.green(configPath)} \n ${chalk.blue(JSON.stringify(projConfig))}`);

const {clientPublicPath} = projConfig;

const modulesResolve = {
  extensions: ['.js', '.ts', '.tsx', '.json'],
  modules: [srcPath, 'node_modules'],
};

const mediaPath = 'media';

const fileLoader = {
  test: /\.(gif|png|jpe?g|svg)$/,
  loader: 'url-loader',
  options: {
    limit: 1024,
    publicPath: clientPublicPath,
    name: `${mediaPath}/[name]${isProdModel ? '.[hash:8]' : ''}.[ext]`,
  },
};

function generateScopedName(localName, mfileName) {
  if (mfileName.match(/[/\\]assets[/\\]css[/\\]global.m.\w+?$/)) {
    return `g-${localName}`;
  }
  mfileName = mfileName
    .replace(srcPath, '')
    .replace(/\W/g, '-')
    .replace(/^-|-index-m-\w+$|-m-\w+$/g, '')
    .replace(/^components-/, 'comp-')
    .replace(/^modules-.*?(\w+)-views(-?)(.*)/, '$1$2$3')
    .replace(/^modules-.*?(\w+)-components(-?)(.*)/, '$1-comp$2$3');
  return localName === 'root' ? mfileName : `${mfileName}_${localName}`;
}
function getLocalIdent(context, localIdentName, localName) {
  return generateScopedName(localName, context.resourcePath);
}

function getStyleLoader(cssModule, isLess) {
  const base = isProdModel ? [{loader: MiniCssExtractPlugin.loader}] : [{loader: 'style-loader'}];
  base.push({
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      modules: cssModule
        ? {
            // localIdentName: '[path][name]_[local]',
            getLocalIdent,
            localIdentContext: srcPath,
          }
        : false,
    },
  });
  base.push('postcss-loader');
  if (isLess) {
    base.push({
      loader: 'less-loader',
      options: {
        lessOptions: {
          javascriptEnabled: true,
        },
      },
    });
  }
  return base;
}

const clientConfig = {
  name: 'client',
  mode: nodeEnv,
  target: 'web',
  stats: 'minimal',
  devtool,
  entry: path.join(srcPath),
  watchOptions: {
    ignored: /node_modules/,
  },
  output: {
    publicPath: clientPublicPath,
    path: path.join(distPath, './client'),
    hashDigestLength: 8,
    filename: isProdModel ? '[name].[contenthash].js' : '[name].js',
  },
  resolve: modulesResolve,
  optimization: {
    minimizer: ['...', new CssMinimizerPlugin()],
  },
  module: {
    rules: [
      {
        test: /\.js$/,
        enforce: 'pre',
        use: 'source-map-loader',
      },
      {
        oneOf: [
          {
            test: /\.(tsx|ts)$/,
            use: 'babel-loader',
          },
          {
            test: /\.m\.less$/,
            // include: pathsConfig.moduleSearch,
            use: getStyleLoader(true, false, true),
          },
          {
            test: /\.less$/,
            // include: pathsConfig.moduleSearch,
            use: getStyleLoader(false, false, true),
          },
          {
            test: /\.css$/,
            use: getStyleLoader(false, false, false),
          },
          fileLoader,
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new ESLintPlugin(),
    new StylelintPlugin({files: 'src/**/*.less', cache: true}),
    new webpack.DefinePlugin({
      'process.env.PROJ_CONFIG': JSON.stringify(projConfig),
    }),
    new HtmlWebpackPlugin({minify: false, template: path.join(staticPath, './client/index.html')}),
    new HtmlReplaceWebpackPlugin([
      {
        pattern: '@@ClientPublicPath@@',
        replacement: clientPublicPath,
      },
    ]),
    isProdModel &&
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: '[name].[contenthash].css',
      }),
  ].filter(Boolean),
};

const devServerConfig = {
  port: 8080,
  static: {publicPath: clientPublicPath, directory: path.join(staticPath, './client')},
  historyApiFallback: {index: '/client/index.html'},
};
module.exports = {clientConfig, devServerConfig, distPath, mediaPath, staticPath, configPath};
