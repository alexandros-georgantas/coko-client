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

if [ -e "themeOverrides.js" ]; then
    echo "Theme overrides file found at: themeOverrides.js"

    THEME_OVERRIDES_VALUE=$(perl -0777 -ne 'print $1 if /module\.exports\s*=\s*{([^}]*)}/s' "themeOverrides.js")
    THEME_OVERRIDES_VALUE="{ $THEME_OVERRIDES_VALUE }"
else
    echo "No theme overrides found."
    exit 1
fi

cat <<EOF > _build/env.js
window.env = {
    serverUrl: '${SERVER_URL}',
    websocketServerUrl: '${WEBSOCKET_SERVER_URL}',
    themeOverrides: $THEME_OVERRIDES_VALUE,
}
EOF

exec "$@"
