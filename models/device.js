'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Device extends Model {
    static associate(models) {
    }
  }
  Device.init({
    name: DataTypes.STRING,
    ipAddress: DataTypes.STRING,
    macAddress: DataTypes.STRING,
    connectionType: DataTypes.STRING,
    status: DataTypes.STRING,
    department: DataTypes.STRING
  }, {
    sequelize,
    modelName: 'Device',
  });
  return Device;
};