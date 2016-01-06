# Scientifically Valid Survey

## Requirements

 - Node.js >= 4
 - MySQL

## Running

 1. Clone the repository `git clone https://github.com/faceleg/scientifically-valid-survey.git`
 2. Copy `_config.sh` to `config.sh`, open `config.sh` and change `MYSQL_CONNECTION` to be a valid connection string to an available MySQL database, e.g. `mysql://username:password@localhost/svs`
 3. Run the application `./start-app.sh`
 4. Point a browser to `http://localhost:3000/`
 5. Do science

## Notes

`express-session` was used to store the respondent's id. This means that the app will "forget" that a respondent has
answered a question if it is restarted.
