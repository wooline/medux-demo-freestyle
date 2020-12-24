const path = require('path');
const chalk = require('chalk');
const deepExtend = require('deep-extend');
const webpack = require('webpack');
const {patchRequire} = require('fs-monkey');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const MiniCssExtractPlugin = require('mini-css-extract-plugin');
const CssMinimizerPlugin = require('css-minimizer-webpack-plugin');
const ESLintPlugin = require('eslint-webpack-plugin');
const StylelintPlugin = require('stylelint-webpack-plugin');
const {getSsrInjectPlugin} = require('@medux/dev-webpack/dist/plugin/ssr-inject');

const SsrPlugin = getSsrInjectPlugin();
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

console.log(`USE ENV:\n ${chalk.green(configPath)} \n ${chalk.blue(JSON.stringify(projConfig))}`);

const {clientPublicPath} = projConfig;

const modulesResolve = {
  extensions: ['.js', '.ts', '.tsx', '.json'],
  modules: [srcPath, 'node_modules'],
};
/**
 * output.path 决定生成文件的物理path ,output.publicPath 仅决定html中引入的url
 * devServer只将第一个配置中的output.path设置为生成目录
 * devServer.dev.publicPath，为生成目录设置访问路径，默认为'/'，该参数直接传递给webpack-dev-middleware
 * devServer.static.publicPath 为静态目录设置访问路径，默认为'/'
 * devServer先查找静态资源，如果找不到会执行onAfterSetupMiddleware
 */

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

function getStyleLoader(cssModule, isServer, isLess) {
  let base = [];
  if (!isServer) {
    base = isProdModel ? [{loader: MiniCssExtractPlugin.loader}] : [{loader: 'style-loader'}];
  }
  base.push({
    loader: 'css-loader',
    options: {
      importLoaders: 1,
      modules: cssModule
        ? {
            // localIdentName: '[path][name]_[local]',
            getLocalIdent,
            localIdentContext: srcPath,
            exportOnlyLocals: isServer,
          }
        : false,
    },
  });
  if (!isServer) {
    base.push('postcss-loader');
  }
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
  // devtool: 'cheap-module-eval-source-map',
  entry: path.join(srcPath, './client'),
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
    isProdModel &&
      new MiniCssExtractPlugin({
        ignoreOrder: true,
        filename: '[name].[contenthash].css',
      }),
    SsrPlugin,
  ].filter(Boolean),
};

const serverConfig = {
  name: 'server',
  mode: nodeEnv,
  target: 'node',
  stats: 'minimal',
  optimization: {
    minimize: false,
  },
  // devtool: 'cheap-module-eval-source-map',
  entry: path.join(srcPath, './server'),
  output: {
    libraryTarget: 'commonjs2',
    path: path.join(distPath, './server'),
    hashDigestLength: 8,
    filename: '[name].js',
  },
  resolve: {...modulesResolve, mainFields: ['jsnext:main', 'module', 'main']},
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
            use: getStyleLoader(true, true),
          },
          {
            test: /\.(less|css)$/,
            // include: pathsConfig.moduleSearch,
            use: 'null-loader',
          },
          fileLoader,
        ],
      },
    ],
  },
  plugins: [
    new webpack.ProgressPlugin(),
    new webpack.DefinePlugin({
      'process.env.PROJ_CONFIG': JSON.stringify(projConfig),
    }),
    SsrPlugin,
  ],
};

const devServerConfig = {
  port: 8080,
  static: {serveIndex: false, publicPath: '/client', directory: path.join(staticPath, './client')},
  dev: {
    publicPath: '/client',
    serverSideRender: true,
  },
  onAfterSetupMiddleware: (server) => {
    server.use((req, res, next) => {
      const serverBundle = require(SsrPlugin.getEntryPath(res));
      serverBundle
        .default(req, res)
        .then((str) => {
          res.end(str);
        })
        .catch((e) => {
          res.status(500).end(e.toString());
        });
    });
  },
};
module.exports = {clientConfig, serverConfig, devServerConfig, distPath, mediaPath, staticPath, configPath};
