#!/bin/bash

# connect-sequelize does not manage it's promises properly, resulting in a torrent of warning output
export BLUEBIRD_W_FORGOTTEN_RETURN=0

mkdir -p coverage/server

node_modules/.bin/istanbul cover --dir coverage/server node_modules/.bin/_mocha -- --timeout 5000 --recursive --reporter spec test/server/configure.js test/server/
node_modules/.bin/istanbul report text-summary > coverage/server/text-summary.txt
node_modules/.bin/coverage-average coverage/text-summary.txt --limit 50
