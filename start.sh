#!/bin/bash
set -o nounset
set -o errexit

if [ "$NODE_ENV" == "development" ]; then
    npm run development
else
    npm start
fi


