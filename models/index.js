'use strict';

const Sequelize = require('sequelize');
const process = require('process');
const env = process.env.NODE_ENV || 'development';
const config = require('../config/config.json')[env];
config.dialectModule = require('mysql2');
const db = {};

let sequelize;
if (config.use_env_variable) {
  sequelize = new Sequelize(process.env[config.use_env_variable], config);
} else {
  sequelize = new Sequelize(config.database, config.username, config.password, config);
}
const user = require('./user.js')(sequelize, Sequelize.DataTypes);
db[user.name] = user;

const settings = require('./settings.js')(sequelize, Sequelize.DataTypes);
db[settings.name] = settings;

const device = require('./device.js')(sequelize, Sequelize.DataTypes);
db[device.name] = device;

const role = require('./role.js')(sequelize, Sequelize.DataTypes);
db[role.name] = role;

const permission = require('./permission.js')(sequelize, Sequelize.DataTypes);
db[permission.name] = permission;

const userAttribute = require('./userAttribute.js')(sequelize, Sequelize.DataTypes);
db[userAttribute.name] = userAttribute;

const rolePermission = require('./rolePermission.js')(sequelize, Sequelize.DataTypes);
db[rolePermission.name] = rolePermission;

Object.keys(db).forEach(modelName => {
  if (db[modelName].associate) {
    db[modelName].associate(db);
  }
});

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
