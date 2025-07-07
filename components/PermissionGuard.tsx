'use client';

import { usePermissions } from '@/hooks/usePermissions';
import { ReactNode } from 'react';

interface PermissionGuardProps {
  resource: string;
  action: string;
  children: ReactNode;
  fallback?: ReactNode;
  abacContext?: Record<string, any>;
}

export function PermissionGuard({ 
  resource, 
  action, 
  children, 
  fallback = null,
  abacContext = {}
}: PermissionGuardProps) {
  const { canAccess, loading } = usePermissions();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!canAccess(resource, action, abacContext)) {
    return <>{fallback}</>;
  }

  return <>{children}</>;
}

// Simple permission check hook
export function usePermissionCheck() {
  const { hasPermission, hasAttribute } = usePermissions();
  
  return {
    can: (resource: string, action: string) => hasPermission(resource, action),
    has: (key: string, value: string) => hasAttribute(key, value)
  };
} 