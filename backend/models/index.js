'use strict';
// This file loads all the model files in this folder and connects them to the database.
// It also links models to each other (e.g. Cart belongs to User).

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const process = require('process');
const basename = path.basename(__filename);
const env = process.env.NODE_ENV || 'development'; // which environment we're running in
const config = require(__dirname + '/../config/config.js')[env]; // DB settings for that environment
const db = {}; // will hold all loaded models, e.g. db.User, db.Cart

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}

// Read every .js file in this folder (except this file) and load it as a model.
fs
  .readdirSync(__dirname)
  .filter(file => {
    return (
      file.indexOf('.') !== 0 &&
      file !== basename &&
      file.slice(-3) === '.js' &&
      file.indexOf('.test.js') === -1
    );
  })
  .forEach(file => {
    const exported = require(path.join(__dirname, file));
    if (typeof exported !== 'function') return; // skip non-model helper files (e.g. paymentData.js)
    const model = exported(sequelize, Sequelize.DataTypes);
    db[model.name] = model;
  });

// After all models are loaded, set up the relationships between them.
Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize; // the active DB connection
db.Sequelize = Sequelize; // the Sequelize library itself

module.exports = db;
