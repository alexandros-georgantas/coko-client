const fs = require('fs')
const path = require('path')

const rootResolvers = require('./root.resolvers')

module.exports = {
  typeDefs: fs.readFileSync(path.join(__dirname, 'root.graphql'), 'utf-8'),
  resolvers: rootResolvers,
}
