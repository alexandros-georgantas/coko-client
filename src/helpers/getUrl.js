const mapper = {
  client: {
    protocol: process.env.CLIENT_PROTOCOL,
    host: process.env.CLIENT_HOST,
    port: process.env.CLIENT_PORT,
  },
}

const removeTrailingSlashes = url => url.replace(/\/+$/, '')

const sanitizeUrl = url => {
  if (!url) return null
  return removeTrailingSlashes(url)
}

const makeUrl = type => {
  const { protocol, host, port } = mapper[type]
  if (!protocol || !host || !port) return null
  const url = `${protocol}://${host}${port ? `:${port}` : ''}`
  return sanitizeUrl(url)
}

const clientUrl = makeUrl('client')
const serverUrl = sanitizeUrl(window.env?.serverUrl || process.env.SERVER_URL)

const webSocketServerUrl = sanitizeUrl(
  window.env?.websocketServerUrl || process.env.WEBSOCKET_SERVER_URL,
)

module.exports = {
  clientUrl,
  serverUrl,
  webSocketServerUrl,
}
