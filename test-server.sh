#!/bin/sh

# THIS SCRIPT RUNS THE FAKE APP (the ./dev folder)

export NODE_ENV='development'

export CLIENT_APP_ROOT_PATH='./dev'
export CLIENT_FAVICON_PATH='./favicon.ico'
export CLIENT_PAGE_TITLE='Cokoapps client playground'

export SERVER_PROTOCOL='https'
export SERVER_HOST='48p1r2roz4.sse.codesandbox.io'
export SERVER_PORT='443'

export WEBPACK_CONFIG_DIR='./src/webpack/webpack.config.js'

sh ./src/scripts/coko-client.sh
