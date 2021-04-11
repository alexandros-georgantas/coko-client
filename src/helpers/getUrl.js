const {
  CLIENT_PROTOCOL,
  CLIENT_HOST,
  CLIENT_PORT,
  SERVER_PROTOCOL,
  SERVER_HOST,
  SERVER_PORT,
} = process.env

const mapper = {
  client: {
    protocol: CLIENT_PROTOCOL,
    host: CLIENT_HOST,
    port: CLIENT_PORT,
  },
  server: {
    protocol: SERVER_PROTOCOL,
    host: SERVER_HOST,
    port: SERVER_PORT,
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
