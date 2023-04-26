#!/bin/sh

rm -f ./_build/env.js
touch ./_build/env.js

# remove double or single quotes around values, if any
SERVER_URL=${SERVER_URL#\"}
SERVER_URL=${SERVER_URL%\"}
SERVER_URL=${SERVER_URL#\'}
SERVER_URL=${SERVER_URL%\'}
WEBSOCKET_SERVER_URL=${WEBSOCKET_SERVER_URL#\"}
WEBSOCKET_SERVER_URL=${WEBSOCKET_SERVER_URL%\"}
WEBSOCKET_SERVER_URL=${WEBSOCKET_SERVER_URL#\'}
WEBSOCKET_SERVER_URL=${WEBSOCKET_SERVER_URL%\'}

cat <<EOF > _build/env.js
window.env = {
    serverUrl: '${SERVER_URL}',
    websocketServerUrl: '${WEBSOCKET_SERVER_URL}',
}
EOF

exec "$@"
