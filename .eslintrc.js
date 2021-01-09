const { eslint } = require('@coko/lint')

const allowDevImportPaths =
  eslint.rules['import/no-extraneous-dependencies'][1].devDependencies
const pattern = 'dev/**'
if (!allowDevImportPaths.includes(pattern)) allowDevImportPaths.push(pattern)

module.exports = eslint
