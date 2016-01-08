#!/bin/bash
set -o nounset
set -o errexit

node server/seed-db.js

if [ "$NODE_ENV" == "development" ]; then
    npm run development
else
    npm start
fi


