const path = require('path')

const components = require('./components')

module.exports = {
  authsome: { mode: path.join(__dirname, 'authsome.js') },
  pubsweet: {
    components,
  },
  'pubsweet-server': {
    graphiql: true,
    host: 'localhost',
    port: 3000,
    secret: 'test',
    // tokenExpiresIn: '5 seconds',
  },
  teams: {
    global: {
      editor: {
        displayName: 'Editor',
        role: 'editor',
      },
      reviewer: {
        displayName: 'Reviewer',
        role: 'reviewer',
      },
      admin: {
        displayName: 'Admin',
        role: 'admin',
      },
    },
    nonGlobal: [],
  },
}
