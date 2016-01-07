#!/bin/bash

set -e

if [ ! -f ./config.sh ]; then
    echo "Please copy _config.sh and update its values to suit your environment"
    exit 1
fi

source config.sh

export MYSQL_CONNECTION=$MYSQL_CONNECTION
export TOKEN_SECRET=$TOKEN_SECRET
export PORT=$PORT
export NODE_ENV=$NODE_ENV
export DEBUG=$DEBUG

npm install --production
node_modules/.bin/bower install --production

node server/seed-db.js

node_modules/.bin/gulp
