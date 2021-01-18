const path = require('path');
const chalk = require('chalk');
const fs = require('fs');
const deepExtend = require('deep-extend');
const jsonFormat = require('json-format');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const HtmlReplaceWebpackPlugin = require('html-replace-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin');
const {createMiddleware} = require('@medux/dev-utils/lib/api-mock');

const debugMode = !!process.env.DEBUG;
const nodeEnv = process.env.NODE_ENV === 'production' ? 'production' : 'development';
const isProdModel = nodeEnv === 'production';
const envName = process.env.PROJ_ENV || 'local';

const rootPath = path.join(__dirname, '../');
const srcPath = path.join(rootPath, './src');
const distPath = path.join(rootPath, './dist', envName);
const publicPath = path.join(rootPath, './public');
const envPath = path.join(rootPath, './env', envName);
const mockPath = path.join(rootPath, './mock');
const baseConfigPath = path.join(publicPath, 'config.js');
const envConfigPath = path.join(envPath, 'config.js');

const baseConfig = require(baseConfigPath);
const envConfig = fs.existsSync(envConfigPath) ? require(envConfigPath) : {};
const projectConfig = deepExtend({}, baseConfig[nodeEnv], envConfig[nodeEnv]);
const projectConfigJson = jsonFormat(projectConfig, {type: 'space'});
// eslint-disable-next-line no-nested-ternary
const devtool = isProdModel ? 'cheap-module-source-map' : debugMode ? 'eval-cheap-module-source-map' : 'eval';

console.info(`config: \n${chalk.blue(projectConfigJson)}`);
console.info(`mode: ${chalk.magenta(nodeEnv)} \ndebuger: ${chalk.magenta(devtool)} \nenv: ${chalk.magenta(envName)}`);

const {clientPublicPath, apiMock, apiProxy, global} = projectConfig;

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

const clientWebpackConfig = {
  name: 'client',
  mode: nodeEnv,
  target: 'browserslist',
  stats: 'minimal',
  devtool,
  entry: srcPath,
  performance: false,
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
    // minimize: false,
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
            use: isProdModel
              ? 'babel-loader'
              : [
                  {loader: '@medux/dev-webpack/lib/loader/module-hot-loader'},
                  {loader: 'babel-loader', options: {plugins: [require.resolve('react-refresh/babel')]}},
                ],
          },
          {
            test: /\.m\.less$/,
            // include: pathsConfig.moduleSearch,
            use: getStyleLoader(true, true),
          },
          {
            test: /\.less$/,
            // include: pathsConfig.moduleSearch,
            use: getStyleLoader(false, true),
          },
          {
            test: /\.css$/,
            use: getStyleLoader(false, false),
          },
          fileLoader,
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new ESLintPlugin({extensions: ['ts', 'js', 'tsx', 'jsx']}),
    new StylelintPlugin({files: '**/*.less', cache: true}),
    // new webpack.DefinePlugin({}),
    new HtmlWebpackPlugin({minify: false, inject: 'body', template: path.join(publicPath, './client/index.html')}),
    new HtmlReplaceWebpackPlugin([
      {
        pattern: '$$ClientPublicPath$$',
        replacement: clientPublicPath,
      },
      {
        pattern: '$$ClientGlobalVar$$',
        replacement: JSON.stringify(projectConfig.globalVar),
      },
    ]),
    isProdModel &&
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: '[name].[contenthash].css',
      }),
    !isProdModel && new ReactRefreshWebpackPlugin({overlay: false}),
    !isProdModel && new webpack.HotModuleReplacementPlugin(),
  ].filter(Boolean),
};

const mockMiddleware = createMiddleware(path.join(mockPath, 'index.ts'));

const devServerConfig = {
  static: [
    {publicPath: clientPublicPath, directory: path.join(envPath, './client')},
    {publicPath: clientPublicPath, directory: path.join(publicPath, './client'), staticOptions: {fallthrough: false}},
  ],
  historyApiFallback: {index: '/client/index.html'},
  onBeforeSetupMiddleware: (server) => {
    if (apiMock) {
      Object.keys(apiProxy).forEach((key) => {
        server.use(key, mockMiddleware);
      });
    }
  },
};
module.exports = {clientWebpackConfig, devServerConfig, projectConfigJson, projectConfig, distPath, publicPath, envPath, mockPath};
