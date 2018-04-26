'use strict';

var fs        = require('fs');
var path      = require('path');
var Sequelize = require('sequelize');
var basename  = path.basename(__filename);
var db        = {};

var sequelize;
if (CONFIG.DATABASE_URL) {
    console.log("--------------");
    console.log("SERVIDOR");
    // the application is executed on Heroku ... use the postgres database
    var match = CONFIG.DATABASE_URL.match(/postgres:\/\/([^:]+):([^@]+)@([^:]+):(\d+)\/(.+)/);
    console.log(CONFIG.DATABASE_URL);
    console.log("--------------");
    console.log(match);
    console.log("--------------");
    sequelize = new Sequelize(match[5], match[1], match[2], {
        dialect:  'postgres',
        protocol: 'postgres',
        port:     match[4],
        host:     match[3],
        logging: false
    });
  } else {
    console.log("--------------");
    console.log("local");
    console.log("--------------");
    // the application is executed on the local machine ... use postgres
    sequelize = new Sequelize(CONFIG.db_name, CONFIG.db_user, CONFIG.db_password, {
      host: CONFIG.db_host,
      dialect: CONFIG.db_dialect,
      port: CONFIG.db_port,
      operatorsAliases: false
    });
  }


fs
  .readdirSync(__dirname)
  .filter(file => {
    return (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js');
  })
  .forEach(file => {
    var model = sequelize['import'](path.join(__dirname, file));
    db[model.name] = model;
  });

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
