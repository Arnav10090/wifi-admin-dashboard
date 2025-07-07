'use strict';
/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('Settings', {
      id: {
        allowNull: false,
        autoIncrement: true,
        primaryKey: true,
        type: Sequelize.INTEGER
      },
      ssid: {
        type: Sequelize.STRING
      },
      wifiPassword: {
        type: Sequelize.STRING
      },
      securityType: {
        type: Sequelize.STRING
      },
      channel: {
        type: Sequelize.INTEGER
      },
      frequency: {
        type: Sequelize.STRING
      },
      ipAddress: {
        type: Sequelize.STRING
      },
      subnetMask: {
        type: Sequelize.STRING
      },
      gateway: {
        type: Sequelize.STRING
      },
      dns: {
        type: Sequelize.STRING
      },
      wifiEnabled: {
        type: Sequelize.BOOLEAN
      },
      firewallEnabled: {
        type: Sequelize.BOOLEAN
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE
      }
    });
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('Settings');
  }
};