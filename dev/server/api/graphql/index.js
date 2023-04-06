const merge = require('lodash/merge')

const root = require('./root')

module.exports = {
  typeDefs: [root.typeDefs].join(' '),
  resolvers: merge({}, root.resolvers),
}
