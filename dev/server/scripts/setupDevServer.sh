#!/bin/sh
set -x

node_modules/.bin/pubsweet migrate
node ./scripts/seedAdminUser.js

exec "$@"
