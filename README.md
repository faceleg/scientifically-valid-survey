# Scientifically Valid Survey

![Obligitory meme](https://i.imgflip.com/wyp1d.jpg)

## Requirements

 - Node.js >= 4
 - MySQL

## Running

 1. Clone the repository `git clone https://github.com/faceleg/scientifically-valid-survey.git`
 2. Copy `_config.sh` to `config.sh`, open `config.sh` and change `MYSQL_CONNECTION` to be a valid connection string to an available MySQL database, e.g. `mysql://username:password@localhost/svs`
 3. Run the application `./start-app.sh`
 4. Point a browser to `http://localhost:3030/`
 5. Do science

## Login details

Everybody's favourite rapper, Dr. Dooom is the only scientist with an account:

> drdoom@svs.com
> secretpassword

## Notes

 - If you've changed the port from the default `3030`, you must adjust the URL used to access the site accordingly.
 - `express-session` was used to store the respondent's id. This means that the app will "forget" that a respondent has
answered a question if it is restarted.
