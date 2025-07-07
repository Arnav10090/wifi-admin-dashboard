'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Settings extends Model {
    static associate(models) {
    }
  }
  Settings.init({
    ssid: DataTypes.STRING,
    wifiPassword: DataTypes.STRING,
    securityType: DataTypes.STRING,
    channel: DataTypes.INTEGER,
    frequency: DataTypes.STRING,
    ipAddress: DataTypes.STRING,
    subnetMask: DataTypes.STRING,
    gateway: DataTypes.STRING,
    dns: DataTypes.STRING,
    wifiEnabled: DataTypes.BOOLEAN,
    firewallEnabled: DataTypes.BOOLEAN
  }, {
    sequelize,
    modelName: 'Settings',
  });
  return Settings;
};