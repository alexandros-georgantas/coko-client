const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')

module.exports = {
  mode: 'development',
  context: path.resolve(__dirname),
  entry: './App.js',
  output: {
    filename: 'bundle.js',
    path: path.resolve(__dirname, '_build'),
  },
  devServer: {
    contentBase: path.join(__dirname),
    hot: true,
  },
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
      template: './index.ejs',
      title: 'Cokoapps client playground',
    }),
    new webpack.HotModuleReplacementPlugin(),
    new webpack.EnvironmentPlugin({
      SERVER_PROTOCOL: 'https',
      SERVER_HOST: '48p1r2roz4.sse.codesandbox.io',
      SERVER_PORT: '443',
    }),
  ],
}
