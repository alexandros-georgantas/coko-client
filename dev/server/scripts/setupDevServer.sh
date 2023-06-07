#!/bin/sh
set -x

node_modules/.bin/pubsweet migrate
node ./scripts/seedGlobalTeams.js
node ./scripts/seedAdminUser.js

exec "$@"
