const path = require('path')
const appRootPath = require('app-root-path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const startsWith = require('lodash/startsWith')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')

const {
  CLIENT_APP_ROOT_PATH,
  CLIENT_FAVICON_PATH,
  CLIENT_PAGE_TITLE,
  NODE_ENV,
} = process.env

const knownVariables = [
  'CLIENT_APP_ROOT_PATH',
  'CLIENT_FAVICON_PATH',
  'CLIENT_PAGE_TITLE',
  'SERVER_PROTOCOL',
  'SERVER_HOST',
  'SERVER_PORT',
  'NODE_ENV',
]

const otherVariables = Object.keys(process.env).filter(k => {
  return !knownVariables.includes(k) && startsWith(k, 'CLIENT_')
})

const mode = NODE_ENV === 'production' ? 'production' : 'development'

const templatePath = path.resolve(__dirname, 'index.ejs')

let appPath

if (CLIENT_APP_ROOT_PATH) {
  appPath = path.resolve(CLIENT_APP_ROOT_PATH)
} else {
  appPath = path.resolve(appRootPath, 'app')
}

module.exports = {
  context: appPath,
  devServer: {
    contentBase: path.join(__dirname),
    hot: true,
  },
  devtool: 'cheap-module-source-map',
  entry: './start.js',
  mode,
  module: {
    rules: [
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
      {
        test: /\.js$|\.jsx$/,
        loader: 'babel-loader',
        options: {
          plugins: [require.resolve('react-refresh/babel')],
        },
      },
      {
        test: /\.css$/i,
        use: ['style-loader', 'css-loader'],
      },
      {
        test: /\.(woff|woff2|eot|ttf|otf)$/i,
        type: 'asset/resource',
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      favicon: CLIENT_FAVICON_PATH,
      template: templatePath,
      title: CLIENT_PAGE_TITLE,
    }),
    new webpack.HotModuleReplacementPlugin(),
    new ReactRefreshWebpackPlugin(),
    new webpack.EnvironmentPlugin([
      'NODE_ENV',
      'SERVER_PROTOCOL',
      'SERVER_HOST',
      'SERVER_PORT',
      ...otherVariables,
    ]),
  ],
}
