# Scientifically Valid Survey
[![Circle CI](https://circleci.com/gh/faceleg/scientifically-valid-survey.svg?style=svg)](https://circleci.com/gh/faceleg/scientifically-valid-survey)
[![Code Climate](https://codeclimate.com/github/faceleg/scientifically-valid-survey/badges/gpa.svg)](https://codeclimate.com/github/faceleg/scientifically-valid-survey)
[![Test Coverage](https://codeclimate.com/github/faceleg/scientifically-valid-survey/badges/coverage.svg)](https://codeclimate.com/github/faceleg/scientifically-valid-survey/coverage)

A reference application showing how one may approach an Express/MySQL/AngularJS stack.

![Obligitory meme](https://i.imgflip.com/wyp1d.jpg)

## Requirements

 - Node.js >= 4
 - MySQL

## Running

 1. Clone the repository `git clone https://github.com/faceleg/scientifically-valid-survey.git`
 2. Copy `_config.sh` to `config.sh`, open `config.sh` and change `RDS_*` variables to suit your environment
 3. Run the application `./start-local.sh`
 4. Point a browser to `http://localhost:3030/`
 5. Do science

## Login details

Due to budget constrains, registration has not been implemented. Everybody's favourite rapper, Dr. Dooom is the only scientist with an account:

Username: drdoom@svs.com

The password is a super-secret, if you need to know it you've been told.

## Tests

The frontend tests may be run with `npm run test-karma`. Backend tests require `docker-compose`, and may be run with `npm run test-server`. The CircleCi build may be viewed by clicking on the *hopefully* green button: [![Circle CI](https://circleci.com/gh/faceleg/scientifically-valid-survey.svg?style=svg)](https://circleci.com/gh/faceleg/scientifically-valid-survey)

## Notes

 - If you've changed the port from the default `3030`, you must adjust the URL used to access the site accordingly.
 - `express-session` was used to store the respondent's id. This means that the app will "forget" that a respondent has
answered a question if it is restarted.
