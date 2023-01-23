#!/bin/sh

# THIS SCRIPT RUNS THE FAKE APP WITH WEBPACK DEV SERVER

export NODE_ENV='development'

export CLIENT_APP_ROOT_PATH='./dev/app'
export CLIENT_FAVICON_PATH='./favicon.ico'
export CLIENT_PAGE_TITLE='Cokoapps client playground'

export SERVER_URL='https://48p1r2roz4.sse.codesandbox.io:443'

export WEBPACK_CONFIG_PATH='./webpack/webpack.config.js'

export CLIENT_FAST_REFRESH=1

sh ./scripts/coko-client-dev.sh
