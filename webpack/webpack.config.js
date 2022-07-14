const path = require('path')
const appRootPath = require('app-root-path')
const startsWith = require('lodash/startsWith')

const webpack = require('webpack')
const CompressionPlugin = require('compression-webpack-plugin')
const CopyPlugin = require('copy-webpack-plugin')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const MiniCssExtractPlugin = require('mini-css-extract-plugin')
const ReactRefreshWebpackPlugin = require('@pmmmwh/react-refresh-webpack-plugin')
const AntDesignThemePlugin = require('antd-theme-webpack-plugin')

const antdThemeVariables = require('./antdThemeVariables')

const {
  NODE_ENV,

  CLIENT_APP_ROOT_PATH,
  CLIENT_BUILD_FOLDER_PATH,
  CLIENT_ENTRY_FILE_PATH,
  CLIENT_FAST_REFRESH,
  CLIENT_FAVICON_PATH,
  CLIENT_PAGE_TITLE,
  CLIENT_STATIC_FOLDER_PATH,
  CLIENT_PAGES_FOLDER_PATH,
  CLIENT_PORT,
  CLIENT_UI_FOLDER_PATH,
  CLIENT_LANGUAGE,

  SERVER_PROTOCOL,
  SERVER_HOST,
  SERVER_PORT,
} = process.env

//
/* SET UP VARS */
//

// Environment variables that will only be used in this config
const variablesForWebpackConfig = [
  'CLIENT_APP_ROOT_PATH',
  'CLIENT_BUILD_FOLDER_PATH',
  'CLIENT_ENTRY_FILE_PATH',
  'CLIENT_FAST_REFRESH',
  'CLIENT_FAVICON_PATH',
  'CLIENT_LANGUAGE',
  'CLIENT_PAGE_TITLE',
  'CLIENT_PAGES_FOLDER_PATH',
  'CLIENT_PORT',
  'CLIENT_STATIC_FOLDER_PATH',
  'CLIENT_UI_FOLDER_PATH',
]

// Environment variables that will be passed down to the build
const variablesForBuild = [
  'NODE_ENV',
  'SERVER_PROTOCOL',
  'SERVER_HOST',
  'SERVER_PORT',
]

// Allow custom variables that start with CLIENT_ to pass into the build
const customVariables = Object.keys(process.env).filter(k => {
  return (
    !variablesForWebpackConfig.includes(k) &&
    !variablesForBuild.includes(k) &&
    startsWith(k, 'CLIENT_')
  )
})

const variablesInBuild = [...variablesForBuild, ...customVariables]

const mode = NODE_ENV === 'production' ? 'production' : 'development'
const isEnvDevelopment = mode === 'development'
const isEnvProduction = mode === 'production'

let appPath

if (CLIENT_APP_ROOT_PATH) {
  appPath = path.resolve(CLIENT_APP_ROOT_PATH)
} else {
  appPath = path.resolve(appRootPath.toString(), 'app')
}

const uiFolderPath = path.resolve(appPath, CLIENT_UI_FOLDER_PATH || 'ui')

const pagesFolderPath = path.resolve(
  appPath,
  CLIENT_PAGES_FOLDER_PATH || 'pages',
)

const noopPath = path.resolve(__dirname, 'noop.js')

const staticFolderPath =
  CLIENT_STATIC_FOLDER_PATH || path.resolve(appPath, '..', 'static')

const buildFolderPath =
  CLIENT_BUILD_FOLDER_PATH || path.resolve(appPath, '..', '_build')

// react's fast-refresh is opt-in for the time being
const fastRefreshValue =
  CLIENT_FAST_REFRESH && CLIENT_FAST_REFRESH.toString().toLowerCase()

const useFastRefresh = fastRefreshValue === '1' || fastRefreshValue === 'true'

const templatePath = path.resolve(__dirname, 'index.ejs')
const entryFilePath = CLIENT_ENTRY_FILE_PATH || './start.js'
const devSeverPort = CLIENT_PORT || 8080
const faviconPath = CLIENT_FAVICON_PATH
const pageTitle = CLIENT_PAGE_TITLE
const language = CLIENT_LANGUAGE
const defaultLanguage = 'en-US'

const serverUrl = `${SERVER_PROTOCOL}://${SERVER_HOST}${
  SERVER_PORT ? `:${SERVER_PORT}` : ''
}`

const antPath = path.join(path.dirname(require.resolve('antd')), '..')

// const antVariablesPath = require.resolve(
//   path.join(antPath, 'lib/style/themes/default.less'),
// )

const antPluginOptions = {
  antDir: antPath,
  // stylesDir: path.join(__dirname),
  varFile: path.join(__dirname, 'variables.less'),
  // varFile: antVariablesPath,
  themeVariables: antdThemeVariables,
  // indexFileName: 'index.html',
  generateOnce: isEnvProduction,
  // customColorRegexArray: [],
}

const themePlugin = new AntDesignThemePlugin(antPluginOptions)

/* eslint-disable no-console */
console.log('\n###################\n')

console.log('=> COKO CLIENT INFO\n')
console.log(`env is: ${NODE_ENV}`)

console.log('')
console.log(`app context path is set to: ${appPath}`)
isEnvProduction && console.log(`build will be written to: ${buildFolderPath}`)
console.log(`static folder path found at: ${staticFolderPath}`)
console.log(`app entry file will be: ${entryFilePath}`)
console.log(`favicon path will be: ${faviconPath}`)
console.log(`page title set to: ${pageTitle}`)
console.log(`language set to: ${language || `${defaultLanguage} (default)`}`)
console.log(`ui folder path will be: ${uiFolderPath}`)
console.log(`pages folder path will be: ${pagesFolderPath}`)

console.log('')
isEnvDevelopment && console.log(`dev server will run at port: ${devSeverPort}`)
console.log(`server will be requested at: ${serverUrl}`)
console.log(`react fast-refresh is: ${useFastRefresh ? 'on' : 'off'}`)

console.log(
  `custom environment variables detected: ${
    customVariables.length > 0 ? `${customVariables}` : 'none'
  }`,
)

console.log('\n###################\n')
/* eslint-enable no-console */

//
/* BASE CONFIG */
//

const webpackConfig = {
  context: appPath,
  entry: entryFilePath,
  name: 'client',
  mode,
  // TO D0 -- browserlist?
  target: 'web',

  // TO DO -- bundle analyzer
  // TO DO -- code splitting
  // TO DO -- hash is deprecated
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
  /* RULES */
  //

  module: {
    rules: [
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
        exclude: /node_modules/,
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
              'babel-plugin-styled-components',
              '@babel/plugin-proposal-class-properties',
              '@babel/plugin-transform-runtime',
              // 'transform-decorators-legacy',
            ].filter(Boolean),

            env: {
              development: {
                plugins: [
                  useFastRefresh && require.resolve('react-refresh/babel'),
                ].filter(Boolean),
              },
              // TO DO: install babel-preset-minify?
              //   production: {
              //     /* bug requires mangle:false https://github.com/babel/minify/issues/556#issuecomment-339751209 */
              //     presets: [['minify', { builtIns: false, mangle: false }]],
              //   },
            },
          },
        },
      },

      // TO DO -- remove url-loader from dependencies

      // Images
      {
        test: /\.png|\.jpg$/,
        type: 'asset/resource',
      },
      // {
      //   test: /\.png|\.jpg$/,
      //   loader: 'url-loader',
      //   // options: {
      //   //   limit: 5000,
      //   // },
      // },

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

      {
        test: /\.less$/,
        use: [
          {
            loader: 'style-loader',
          },
          {
            loader: 'css-loader', // translates CSS into CommonJS
          },
          {
            loader: 'less-loader', // compiles Less to CSS
            options: {
              lessOptions: {
                // override default (antd) less variables
                // modifyVars: lessThemeMapper(themeVariables),
                javascriptEnabled: true,
              },
            },
          },
        ],
      },
    ],
  },

  //
  /* PLUGINS */
  //

  plugins: [
    // Use the index.ejs template to create the base index.html file of the bundle
    new HtmlWebpackPlugin({
      favicon: faviconPath,
      template: templatePath,
      title: pageTitle,
      language: language || defaultLanguage,
    }),

    // DEV-ONLY
    // React fast-refresh
    isEnvDevelopment &&
      useFastRefresh &&
      new webpack.HotModuleReplacementPlugin(),
    isEnvDevelopment && useFastRefresh && new ReactRefreshWebpackPlugin(),

    // PROD-ONLY
    isEnvProduction &&
      new MiniCssExtractPlugin({
        chunkFilename: 'static/css/[name].[contenthash:8].chunk.css',
        filename: 'static/css/[name].[contenthash:8].css',
      }),

    // Make sure environment variables are defined
    new webpack.EnvironmentPlugin(variablesInBuild),

    // Copy static assets to root of build folder
    new CopyPlugin({
      patterns: [{ from: staticFolderPath }],
    }),

    new webpack.optimize.AggressiveMergingPlugin(),
    new CompressionPlugin(),

    themePlugin,

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

  resolve: {
    alias: {
      pages: pagesFolderPath,
      ui: uiFolderPath,
    },
    fallback: {
      pages: noopPath,
      ui: noopPath,
    },
  },
}

if (isEnvDevelopment) {
  // TO DO -- use any source map in production?
  webpackConfig.devtool = 'cheap-module-source-map'

  //
  /* WEBPACK DEV SERVER */
  //

  webpackConfig.devServer = {
    // handle unknown routes
    historyApiFallback: true,
    // play nice from a within a docker container
    host: '0.0.0.0',
    port: devSeverPort,
  }
}

module.exports = webpackConfig
