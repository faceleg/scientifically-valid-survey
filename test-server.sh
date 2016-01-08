#!/bin/bash

mkdir -p coverage/server

node_modules/.bin/istanbul cover --dir coverage/server node_modules/.bin/_mocha -- --timeout 5000 --recursive --reporter spec test/server/configure.js test/server/**/*.js
node_modules/.bin/istanbul report text-summary > coverage/server/text-summary.txt
node_modules/.bin/coverage-average coverage/text-summary.txt --limit 95
