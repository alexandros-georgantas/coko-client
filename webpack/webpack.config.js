const path = require('path')
const appRootPath = require('app-root-path')
const startsWith = require('lodash/startsWith')

const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const rules = require('./rules')

// TO DO: install babel-preset-minify?

//
/* SET UP VARS */
//

const {
  CLIENT_APP_ROOT_PATH,
  CLIENT_BUILD_FOLDER_PATH,
  CLIENT_ENTRY_FILE_PATH,
  CLIENT_FAVICON_PATH,
  CLIENT_PAGE_TITLE,
  CLIENT_STATIC_FOLDER_PATH,
  CLIENT_PORT,
  NODE_ENV,
} = process.env

const knownVariables = [
  'CLIENT_APP_ROOT_PATH',
  'CLIENT_BUILD_FOLDER_PATH',
  'CLIENT_ENTRY_FILE',
  'CLIENT_FAVICON_PATH',
  'CLIENT_PAGE_TITLE',
  'CLIENT_STATIC_FOLDER_PATH',
  'CLIENT_PORT',
  'SERVER_PROTOCOL',
  'SERVER_HOST',
  'SERVER_PORT',
  'NODE_ENV',
]

const otherVariables = Object.keys(process.env).filter(k => {
  return !knownVariables.includes(k) && startsWith(k, 'CLIENT_')
})

const mode = NODE_ENV === 'production' ? 'production' : 'development'
const isEnvDevelopment = mode === 'development'
const isEnvProduction = mode === 'production'

const templatePath = path.resolve(__dirname, 'index.ejs')

let appPath

if (CLIENT_APP_ROOT_PATH) {
  appPath = path.resolve(CLIENT_APP_ROOT_PATH)
} else {
  appPath = path.resolve(appRootPath.toString(), 'app')
}

const staticFolderPath =
  CLIENT_STATIC_FOLDER_PATH || path.resolve(appPath, '..', 'static')

const buildFolderPath =
  CLIENT_BUILD_FOLDER_PATH || path.resolve(appPath, '..', '_build')

//
/* BASE CONFIG */
//

const webpackConfig = {
  context: appPath,
  entry: CLIENT_ENTRY_FILE_PATH || './start.js',
  name: 'client',
  mode,
  target: 'web',

  // dev
  // should be dev only?
  devtool: 'cheap-module-source-map',

  module: { rules },
  output: {
    chunkFilename: isEnvProduction
      ? 'js/[name].[hash:8].chunk.js'
      : isEnvDevelopment && 'js/[name].chunk.js',
    filename: isEnvProduction
      ? 'js/[name].[hash:8].js'
      : isEnvDevelopment && 'js/bundle.js',
    // There are also additional JS chunk files if you use code splitting.
    // path: contentBase,
    path: buildFolderPath,
    // publicPath: isEnvProduction ? '/assets/' : '/',
    publicPath: '/',
  },

  //
  /* PLUGINS */
  //

  plugins: [
    // Use the index.ejs template to create the base index.html file of the bundle
    new HtmlWebpackPlugin({
      favicon: CLIENT_FAVICON_PATH,
      template: templatePath,
      title: CLIENT_PAGE_TITLE,
    }),

    // DEV-ONLY
    // React fast-refresh
    isEnvDevelopment && new webpack.HotModuleReplacementPlugin(),
    isEnvDevelopment && new ReactRefreshWebpackPlugin(),

    // PROD-ONLY
    isEnvProduction &&
      new MiniCssExtractPlugin({
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        filename: 'static/css/[name].[contenthash:8].css',
      }),

    // Make sure environment variables are defined
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'SERVER_PROTOCOL',
      'SERVER_HOST',
      'SERVER_PORT',
      ...otherVariables,
    ]),

    // Copy static assets to root of build folder
    new CopyPlugin({
      patterns: [{ from: staticFolderPath }],
    }),

    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin(),

    // TO DELETE
    // new webpack.NoEmitOnErrorsPlugin(),
    // new webpack.optimize.OccurrenceOrderPlugin(),
  ].filter(Boolean),

  // TO DELETE
  // resolve: {
  //   alias: {
  //     config: clientConfigPath,
  //     joi: 'joi-browser',
  //   },
  //   enforceExtension: false,
  //   extensions: ['.mjs', '.js', '.jsx', '.json', '.scss'],
  // },
}

if (isEnvDevelopment) {
  //
  /* WEBPACK DEV SERVER CONFIGURATION */
  //

  webpackConfig.devServer = {
    historyApiFallback: true,
    host: '0.0.0.0',
    port: CLIENT_PORT,
  }
}

module.exports = webpackConfig
