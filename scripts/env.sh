#!/bin/sh

rm -f ./_build/env.js
touch ./_build/env.js

# remove double or single quotes around value, if any
SERVER_URL=${SERVER_URL#\"}
SERVER_URL=${SERVER_URL%\"}
SERVER_URL=${SERVER_URL#\'}
SERVER_URL=${SERVER_URL%\'}

cat <<EOF > _build/env.js
window.env = {
    serverUrl: '${SERVER_URL}'
}
EOF

exec "$@"
