'use strict';

var fs = require('fs');
var path = require('path');

require('./models/index.js')
.then(function(models) {
  var fileContent = fs.readFileSync(path.resolve(__dirname, 'seeders/initial-data.sql'), 'utf-8');
  models.sequelize.query(fileContent, {
    raw: true
  })
  .then(function() {
    process.exit();
  })
  .catch(function() {
    process.exit();
  });
})
