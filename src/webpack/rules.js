// const path = require('path')

// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = [
  { test: /\.tsx?$/, loader: 'ts-loader' },
  {
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  },
  // {
  //   test: /\.js$|\.jsx$/,
  //   loader: 'babel-loader',
  //   options: {
  //     presets: ['@babel/preset-env', '@babel/preset-react'],
  //     plugins: [require.resolve('react-refresh/babel')],
  //   },
  // },
  {
    test: /\.js$|\.jsx$/,
    //   exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        //       include: [
        //         // include app folder
        //         path.join(__dirname),
        //         // path.join(__dirname, '..', 'app'),
        //         // path.join(__dirname, '..', 'ui'),
        //         // include pubsweet packages which are published untranspiled
        //         /pubsweet-[^/\\]+\/(?!node_modules)/,
        //         /@pubsweet\/[^/\\]+\/(?!node_modules)/,
        //       ],
        //       presets: [
        //         '@babel/preset-env',
        //         // ['@babel/preset-env', { modules: false }],
        //         '@babel/preset-react',
        //       ],
        plugins: [
          'babel-plugin-styled-components',
          require.resolve('react-refresh/babel'),
          // '@babel/plugin-proposal-class-properties',
          // 'transform-decorators-legacy',
        ],
        //       // env: {
        //       //   production: {
        //       //     /* bug requires mangle:false https://github.com/babel/minify/issues/556#issuecomment-339751209 */
        //       //     presets: [['minify', { builtIns: false, mangle: false }]],
        //       //   },
        //       // },
      },
    },
  },
  // {
  //   test: /\.js$|\.jsx$/,
  //   loader: 'babel-loader',
  //   query: {
  //     presets: [
  //       ['@babel/preset-env', { modules: false }],
  //       '@babel/preset-react',
  //     ],
  //     plugins: [
  //       'babel-plugin-styled-components',
  //       require.resolve('react-refresh/babel'),
  //       // require.resolve('react-hot-loader/babel'),
  //       '@babel/plugin-proposal-class-properties',
  //       // 'transform-decorators-legacy',
  //     ],
  //     env: {
  //       production: {
  //         /* bug requires mangle:false https://github.com/babel/minify/issues/556#issuecomment-339751209 */
  //         presets: [['minify', { builtIns: false, mangle: false }]],
  //       },
  //     },
  //   },
  //   include: [
  //     // include app folder
  //     path.join(__dirname),
  //     // path.join(__dirname, '..', 'app'),
  //     // path.join(__dirname, '..', 'ui'),
  //     // include pubsweet packages which are published untranspiled
  //     /pubsweet-[^/\\]+\/(?!node_modules)/,
  //     /@pubsweet\/[^/\\]+\/(?!node_modules)/,
  //   ],
  // },
  {
    test: /\.png|\.jpg$/,
    loader: 'url-loader',
    // options: {
    //   limit: 5000,
    // },
  },
  {
    test: /\.(woff|woff2|eot|ttf|otf)$/i,
    type: 'asset/resource',
  },
  // {
  //   test: /\.woff|\.woff2|\.svg|.eot|\.ttf/,
  //   loader: 'url-loader',
  //   options: {
  //     name: 'static/media/[name].[hash:8].[ext]',
  //     // fonts break without this line, revisit when webpack dependencies are upgraded
  //     esModule: false,
  //   },
  // },
  { test: /\.html$/, loader: 'html-loader' },
  {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader'],
  },
  // {
  //   test: /\.css$|\.scss$/,
  //   exclude: /\.local\.s?css$/, // Exclude local styles from global
  //   loader: [
  //     {
  //       loader: 'style-loader',
  //     },
  //     {
  //       loader: 'css-loader',
  //     },
  //   ],
  // },
  // {
  //   test: /\.css$|\.scss$/,
  //   include: /\.local\.s?css/, // Local styles
  //   loader: [
  //     {
  //       loader: 'style-loader',
  //     },
  //     {
  //       loader: MiniCssExtractPlugin.loader,
  //       options: {
  //         hmr: process.env.NODE_ENV === 'development',
  //       },
  //     },
  //     {
  //       loader: 'css-loader',
  //       options: {
  //         modules: true,
  //         importLoaders: 1,
  //         localIdentName: '[name]_[local]-[hash:base64:8]',
  //       },
  //     },
  //   ],
  // },
]
