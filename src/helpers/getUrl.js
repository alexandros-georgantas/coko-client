const mapper = {
  client: {
    protocol: process.env.CLIENT_PROTOCOL,
    host: process.env.CLIENT_HOST,
    port: process.env.CLIENT_PORT,
  },
  server: {
    protocol: process.env.SERVER_PROTOCOL,
    host: process.env.SERVER_HOST,
    port: process.env.SERVER_PORT,
  },
}

const makeUrl = type => {
  const { protocol, host, port } = mapper[type]
  return `${protocol}://${host}${port ? `:${port}` : ''}`
}

const clientUrl = makeUrl('client')
const serverUrl = makeUrl('server')

module.exports = {
  clientUrl,
  serverUrl,
}
