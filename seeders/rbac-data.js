const { Role, Permission, User, UserAttribute, RolePermission } = require('../models');

async function seedRBACData() {
  try {
    console.log('Creating roles...');
    // Create roles (idempotent)
    const [adminRole] = await Role.findOrCreate({
      where: { name: 'Admin' },
      defaults: { description: 'Full system access' }
    });
    const [technicianRole] = await Role.findOrCreate({
      where: { name: 'Technician' },
      defaults: { description: 'Limited access for device management' }
    });
    const [guestRole] = await Role.findOrCreate({
      where: { name: 'Guest' },
      defaults: { description: 'Read-only access' }
    });

    console.log('Creating permissions...');
    // Create permissions (idempotent)
    const permissionDefs = [
      { name: 'devices:read', resource: 'devices', action: 'read', description: 'View devices' },
      { name: 'devices:update', resource: 'devices', action: 'update', description: 'Update device status' },
      { name: 'devices:create', resource: 'devices', action: 'create', description: 'Create new devices' },
      { name: 'devices:delete', resource: 'devices', action: 'delete', description: 'Delete devices' },
      { name: 'network:read', resource: 'network', action: 'read', description: 'View network info' },
      { name: 'stats:read', resource: 'stats', action: 'read', description: 'View statistics' },
      { name: 'settings:read', resource: 'settings', action: 'read', description: 'View settings' },
      { name: 'settings:update', resource: 'settings', action: 'update', description: 'Update settings' },
      { name: 'users:manage', resource: 'users', action: 'manage', description: 'Manage users' }
    ];
    const permissions = [];
    for (const def of permissionDefs) {
      const [perm] = await Permission.findOrCreate({ where: { name: def.name }, defaults: def });
      permissions.push(perm);
    }

    console.log('Assigning permissions to roles...');
    // Assign permissions to roles manually (idempotent)
    const assignRolePermissions = async (role, permNames) => {
      for (const name of permNames) {
        const perm = permissions.find(p => p.name === name);
        if (perm) {
          await RolePermission.findOrCreate({
            where: { roleId: role.id, permissionId: perm.id }
          });
        }
      }
    };
    await assignRolePermissions(adminRole, permissionDefs.map(p => p.name));
    await assignRolePermissions(technicianRole, [
      'devices:read', 'devices:update', 'network:read', 'stats:read'
    ]);
    await assignRolePermissions(guestRole, [
      'devices:read', 'network:read', 'stats:read'
    ]);

    console.log('Updating users with roles...');
    // Update existing users with roles
    const users = await User.findAll();
    for (const user of users) {
      if (user.username === 'admin') {
        await user.update({ roleId: adminRole.id });
      } else {
        await user.update({ roleId: technicianRole.id });
      }
    }

    console.log('Adding user attributes...');
    // Add user attributes for ABAC - only for existing users
    const existingUsers = await User.findAll();
    const userAttributes = [];
    existingUsers.forEach((user, index) => {
      const departments = ['IT', 'Engineering', 'Marketing'];
      userAttributes.push({
        userId: user.id,
        key: 'department',
        value: departments[index % departments.length]
      });
    });
    for (const attr of userAttributes) {
      await UserAttribute.findOrCreate({
        where: { userId: attr.userId, key: attr.key },
        defaults: { value: attr.value }
      });
    }

    console.log('RBAC data seeded successfully');
  } catch (error) {
    console.error('Error seeding RBAC data:', error);
    throw error;
  }
}

if (require.main === module) {
  // Ensure models are initialized
  require('../models');
  seedRBACData()
    .then(() => {
      console.log('Seeding complete');
      process.exit(0);
    })
    .catch(err => {
      console.error('Seeding failed:', err);
      process.exit(1);
    });
}

module.exports = seedRBACData; 