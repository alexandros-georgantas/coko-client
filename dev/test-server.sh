#!/bin/sh

# THIS SCRIPT RUNS THE FAKE APP

export NODE_ENV='development'

export CLIENT_APP_ROOT_PATH='./dev/app'
export CLIENT_FAVICON_PATH='./favicon.ico'
export CLIENT_PAGE_TITLE='Cokoapps client playground'

export SERVER_PROTOCOL='https'
export SERVER_HOST='48p1r2roz4.sse.codesandbox.io'
export SERVER_PORT='443'

export WEBPACK_CONFIG_DIR='../client/src/webpack/webpack.config.js'

# yarn coko-client

# sh ./node_modules/.bin/coko-client.sh
sh ../client/src/scripts/coko-client.sh
