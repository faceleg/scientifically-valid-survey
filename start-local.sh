#!/bin/bash

if [ ! -f ./config.sh ]; then
    echo "Please copy _config.sh and update its values to suit your environment"
    exit 1
fi

source config.sh

export TOKEN_SECRET=$TOKEN_SECRET
export PORT=$PORT
export NODE_ENV=$NODE_ENV
export DEBUG=$DEBUG

export RDS_USERNAME=$RDS_USERNAME
export RDS_HOSTNAME=$RDS_HOSTNAME
export RDS_PASSWORD=$RDS_PASSWORD
export RDS_PORT=$RDS_PORT
export RDS_DB_NAME=$RDS_DB_NAME

npm install --production
node_modules/.bin/bower install --production

node server/seed-db.js

node_modules/.bin/gulp
