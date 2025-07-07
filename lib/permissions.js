const { User, Role, Permission, UserAttribute } = require('../models');

class PermissionManager {
  // Cache user permissions to avoid repeated database queries
  static userPermissionCache = new Map();

  static async getUserPermissions(userId) {
    if (this.userPermissionCache.has(userId)) {
      return this.userPermissionCache.get(userId);
    }

    const user = await User.findOne({
      where: { id: userId },
      include: [
        {
          model: Role,
          include: [
            {
              model: Permission,
              through: { attributes: [] }
            }
          ]
        },
        {
          model: UserAttribute,
          attributes: ['key', 'value']
        }
      ]
    });

    if (!user) {
      return { permissions: [], attributes: {} };
    }

    const permissions = user.Role?.Permissions || [];
    const attributes = {};
    
    user.UserAttributes?.forEach(attr => {
      attributes[attr.key] = attr.value;
    });

    const result = { permissions, attributes };
    this.userPermissionCache.set(userId, result);
    
    // Clear cache after 5 minutes
    setTimeout(() => {
      this.userPermissionCache.delete(userId);
    }, 5 * 60 * 1000);

    return result;
  }

  static async hasPermission(userId, resource, action) {
    const { permissions } = await this.getUserPermissions(userId);
    
    return permissions.some(permission => 
      permission.resource === resource && permission.action === action
    );
  }

  static async getUserAttributes(userId) {
    const { attributes } = await this.getUserPermissions(userId);
    return attributes;
  }

  static async canAccessResource(userId, resource, action, context = {}) {
    // First check RBAC permissions
    const hasRBACPermission = await this.hasPermission(userId, resource, action);
    if (!hasRBACPermission) {
      return false;
    }

    // Then check ABAC conditions if context is provided
    if (Object.keys(context).length > 0) {
      const userAttributes = await this.getUserAttributes(userId);
      return this.evaluateABACConditions(userAttributes, context);
    }

    return true;
  }

  static evaluateABACConditions(userAttributes, context) {
    // Simple ABAC evaluation - can be extended for more complex rules
    for (const [key, value] of Object.entries(context)) {
      if (userAttributes[key] !== value) {
        return false;
      }
    }
    return true;
  }

  static clearUserCache(userId) {
    if (userId) {
      this.userPermissionCache.delete(userId);
    } else {
      this.userPermissionCache.clear();
    }
  }

  static async isAdmin(userId) {
    const user = await User.findOne({
      where: { id: userId },
      include: [{ model: Role }]
    });
    return user && user.Role && user.Role.name === 'Admin';
  }
}

module.exports = PermissionManager; 