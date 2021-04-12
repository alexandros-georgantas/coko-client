// const path = require('path')
// const MiniCssExtractPlugin = require('mini-css-extract-plugin')

module.exports = [
  // Typescript
  { test: /\.tsx?$/, loader: 'ts-loader' },

  // TO DELETE?
  // mjs files: needed because of apollo client??
  {
    test: /\.m?js/,
    resolve: {
      fullySpecified: false,
    },
  },

  // js files
  {
    test: /\.js$|\.jsx$/,
    // exclude: /(node_modules|bower_components)/,
    use: {
      loader: 'babel-loader',
      options: {
        // include: [
        //   // include app folder
        //   path.join(__dirname),
        //   // path.join(__dirname, '..', 'app'),
        //   // path.join(__dirname, '..', 'ui'),
        //   // include pubsweet packages which are published untranspiled
        //   /pubsweet-[^/\\]+\/(?!node_modules)/,
        //   /@pubsweet\/[^/\\]+\/(?!node_modules)/,
        // ],
        presets: [
          '@babel/preset-env',
          // ['@babel/preset-env', { modules: false }],
          '@babel/preset-react',
        ],
        plugins: [
          // https://github.com/styled-components/babel-plugin-styled-components#babel-plugin-styled-components
          'babel-plugin-styled-components',

          // https://babeljs.io/docs/en/babel-plugin-proposal-class-properties
          '@babel/plugin-proposal-class-properties',

          // 'transform-decorators-legacy',
        ].filter(Boolean),

        env: {
          development: {
            plugins: [require.resolve('react-refresh/babel')],
          },
          //   production: {
          //     /* bug requires mangle:false https://github.com/babel/minify/issues/556#issuecomment-339751209 */
          //     presets: [['minify', { builtIns: false, mangle: false }]],
          //   },
        },
      },
    },
  },

  // Images
  {
    test: /\.png|\.jpg$/,
    loader: 'url-loader',
    // options: {
    //   limit: 5000,
    // },
  },

  // Fonts
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

  // HTML
  { test: /\.html$/, loader: 'html-loader' },

  // CSS
  {
    test: /\.css$/i,
    use: ['style-loader', 'css-loader'],
  },
]
