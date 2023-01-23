const mapper = {
  client: {
    protocol: process.env.CLIENT_PROTOCOL,
    host: process.env.CLIENT_HOST,
    port: process.env.CLIENT_PORT,
  },
}

const makeUrl = type => {
  const { protocol, host, port } = mapper[type]
  return `${protocol}://${host}${port ? `:${port}` : ''}`
}

const clientUrl = makeUrl('client')
const serverUrl = process.env.SERVER_URL

module.exports = {
  clientUrl,
  serverUrl,
}
