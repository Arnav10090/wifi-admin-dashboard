const { getServerSession } = require('next-auth');
const { authOptions } = require('../app/api/auth/[...nextauth]/route');
const PermissionManager = require('./permissions');

// Middleware for API routes
async function withAuth(handler, requiredPermission = null, abacContext = null) {
  return async (req, res) => {
    try {
      const session = await getServerSession(req, res, authOptions);
      
      if (!session?.user?.id) {
        return res.status(401).json({ error: 'Unauthorized' });
      }

      // If no specific permission required, just check if user is authenticated
      if (!requiredPermission) {
        req.user = session.user;
        return handler(req, res);
      }

      const { resource, action } = requiredPermission;
      const hasAccess = await PermissionManager.canAccessResource(
        session.user.id, 
        resource, 
        action, 
        abacContext
      );

      if (!hasAccess) {
        return res.status(403).json({ error: 'Forbidden' });
      }

      req.user = session.user;
      return handler(req, res);
    } catch (error) {
      console.error('Auth middleware error:', error);
      return res.status(500).json({ error: 'Internal server error' });
    }
  };
}

// Helper function to create permission requirements
function requirePermission(resource, action) {
  return { resource, action };
}

// Helper function to create ABAC context
function withABACContext(context) {
  return context;
}

module.exports = {
  withAuth,
  requirePermission,
  withABACContext
}; 