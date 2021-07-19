const path = require('path')

const { execSync } = require('child_process')

const defaultWebpackConfig = path.join('..', 'webpack', 'webpack.config.js')

module.exports = async argsOverride => {
  // const webpackConfig = path.join(
  //   'webpack',
  //   `webpack.${config.util.getEnv('NODE_ENV')}.config.js`,
  // )

  const webpackConfig = defaultWebpackConfig

  execSync(`yarn webpack-dev-server --config ${webpackConfig}`, {
    stdio: 'inherit',
  })
}
