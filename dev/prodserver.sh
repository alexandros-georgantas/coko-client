#!/bin/sh

# THIS SCRIPT RUNS THE FAKE APP IN A PRODUCTION BUILD

export NODE_ENV='production'

export CLIENT_APP_ROOT_PATH='./dev/app'
export CLIENT_FAVICON_PATH='./favicon.ico'
export CLIENT_PAGE_TITLE='Cokoapps client playground'

export SERVER_URL='https://48p1r2roz4.sse.codesandbox.io:443'

export WEBPACK_CONFIG_PATH='./webpack/webpack.config.js'

# BUILD
sh ./scripts/coko-client-build.sh

# SERVE (path relative to package.json)
yarn http-server -p 8080 ./dev/_build
