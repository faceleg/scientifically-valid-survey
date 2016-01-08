#!/bin/bash

# usage()
# {
# cat << EOF
# usage: $0 options

# This script runs tests and watch for changes

# OPTIONS:
#    -c      required - database connection string
#    -d      optional - debug string (defaults to "") use "*" to output verbose debug information
#    -u      print usage and exit
# EOF
# }

# MYSQL_CONNECTION=""
# TOKEN_SECRET="TOKEN_SECRET"
# DEBUG=
# while getopts "c:d:" OPTION
# do
#      case $OPTION in
#          c)
#              MYSQL_CONNECTION=$OPTARG
#              ;;
#          d)
#              DEBUG=$OPTARG
#              ;;
#          u)
#              usage
#              exit
#              ;;
#      esac
# done

# if [[ -z $MYSQL_CONNECTION ]]
# then
#      usage
#      exit 1
#   fi

# export PORT=3031
# export NODE_ENV="development"

# export MYSQL_CONNECTION=$MYSQL_CONNECTION

# export TOKEN_SECRET=$TOKEN_SECRET
# export DEBUG=$DEBUG

# mkdir -p coverage

# User -g 'some string' to cause mocha to run only those tests with a matching 'it'
# node_modules/.bin/istanbul cover --report html node_modules/.bin/_mocha -- -w --timeout 5000 --recursive --reporter spec test/server/configure.js test/server/**/*.js
# node_modules/.bin/istanbul report text-summary > coverage/text-summary.txt
# node_modules/.bin/coverage-average coverage/text-summary.txt --limit 95

node_modules/.bin/istanbul cover --dir coverage/server node_modules/.bin/_mocha -- -w --timeout 5000 --recursive --reporter spec test/server/configure.js test/server/**/*.js
node_modules/.bin/istanbul report text-summary > coverage/server/text-summary.txt
node_modules/.bin/coverage-average coverage/text-summary.txt --limit 95
