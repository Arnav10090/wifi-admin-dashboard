'use client';

import { useSession } from 'next-auth/react';
import { useState, useEffect } from 'react';

export function usePermissions() {
  const { data: session, status } = useSession();
  const [permissions, setPermissions] = useState([]);
  const [attributes, setAttributes] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'loading') return;
    
    if (!session?.user?.id) {
      setPermissions([]);
      setAttributes({});
      setLoading(false);
      return;
    }

    fetchUserPermissions();
  }, [session, status]);

  const fetchUserPermissions = async () => {
    try {
      const response = await fetch('/api/auth/permissions');
      if (response.ok) {
        const data = await response.json();
        setPermissions(data.permissions);
        setAttributes(data.attributes);
      }
    } catch (error) {
      console.error('Failed to fetch permissions:', error);
    } finally {
      setLoading(false);
    }
  };

  const hasPermission = (resource, action) => {
    return permissions.some(permission => 
      permission.resource === resource && permission.action === action
    );
  };

  const hasAttribute = (key, value) => {
    return attributes[key] === value;
  };

  const canAccess = (resource, action, context = {}) => {
    // Check RBAC first
    if (!hasPermission(resource, action)) {
      return false;
    }

    // Check ABAC conditions
    for (const [key, value] of Object.entries(context)) {
      if (!hasAttribute(key, value)) {
        return false;
      }
    }

    return true;
  };

  return {
    permissions,
    attributes,
    loading,
    hasPermission,
    hasAttribute,
    canAccess,
    isAuthenticated: !!session?.user
  };
}

// Higher-order component for protecting components
export function withPermission(WrappedComponent, requiredPermission, abacContext = null) {
  return function PermissionWrapper(props) {
    const { canAccess, loading, isAuthenticated } = usePermissions();
    
    if (loading) {
      return <div>Loading...</div>;
    }

    if (!isAuthenticated) {
      return <div>Please log in to access this page.</div>;
    }

    const { resource, action } = requiredPermission;
    if (!canAccess(resource, action, abacContext)) {
      return <div>You don't have permission to access this resource.</div>;
    }

    return <WrappedComponent {...props} />;
  };
} 