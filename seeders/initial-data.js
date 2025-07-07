'use strict';
const bcrypt = require('bcryptjs');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    const adminPassword = await bcrypt.hash('adminpass', 10);
    const techPassword = await bcrypt.hash('techpass', 10);
    const guestPassword = await bcrypt.hash('guestpass', 10);

    await queryInterface.bulkInsert('Users', [
      {
        username: 'admin',
        password: adminPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'technician',
        password: techPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        username: 'guest',
        password: guestPassword,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});

    await queryInterface.bulkInsert('Settings', [{
      ssid: 'Home_Network',
      wifiPassword: 'password123',
      securityType: 'WPA2',
      channel: 6,
      frequency: '2.4GHz',
      ipAddress: '192.168.1.1',
      subnetMask: '255.255.255.0',
      gateway: '192.168.1.1',
      dns: '8.8.8.8',
      wifiEnabled: true,
      firewallEnabled: false,
      createdAt: new Date(),
      updatedAt: new Date()
    }], {});

    await queryInterface.bulkInsert('Devices', [
      {
        name: 'Living Room TV',
        ipAddress: '192.168.1.100',
        macAddress: 'AA:BB:CC:DD:EE:FF',
        connectionType: 'Wireless',
        status: 'Connected',
        department: 'IT',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'John\'s Laptop',
        ipAddress: '192.168.1.101',
        macAddress: '11:22:33:44:55:66',
        connectionType: 'Wireless',
        status: 'Connected',
        department: 'Engineering',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Network Printer',
        ipAddress: '192.168.1.102',
        macAddress: 'AA:11:BB:22:CC:33',
        connectionType: 'Wired',
        status: 'Connected',
        department: 'Marketing',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Sarah\'s Desktop',
        ipAddress: '192.168.1.103',
        macAddress: 'FF:EE:DD:CC:BB:AA',
        connectionType: 'Wired',
        status: 'Connected',
        department: 'IT',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Conference Room TV',
        ipAddress: '192.168.1.104',
        macAddress: '12:34:56:78:9A:BC',
        connectionType: 'Wireless',
        status: 'Disconnected',
        department: 'Marketing',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        name: 'Mike\'s Phone',
        ipAddress: '192.168.1.105',
        macAddress: 'DE:AD:BE:EF:CA:FE',
        connectionType: 'Wireless',
        status: 'Connected',
        department: 'Engineering',
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ], {});
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Users', null, {});
    await queryInterface.bulkDelete('Settings', null, {});
    await queryInterface.bulkDelete('Devices', null, {});
  }
}; 