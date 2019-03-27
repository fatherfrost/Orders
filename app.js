'use strict';

let SwaggerExpress = require('swagger-express-mw');
let app = require('express')();
let mongoose = require('mongoose');
let conf  = require('./config');
module.exports = app;

let config = {
  appRoot: __dirname
};

mongoose.connect(conf.database);
app.set('secret', conf.secret);

SwaggerExpress.create(config, function(err, swaggerExpress) {
  if (err) { throw err; }

  swaggerExpress.register(app);

  let port = process.env.PORT || 10010;
  app.listen(port);
  console.log('Server started: http://localhost:' + port);
});
