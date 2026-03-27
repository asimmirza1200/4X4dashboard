import React from 'react';
import usePermissions from '@/hooks/usePermissions';

const PermissionWrapper = ({ 
  permission, 
  permissions, 
  requireAll = false, 
  fallback = null, 
  children 
}) => {
  const { can, canAny, canAll } = usePermissions();

  let hasAccess = false;

  if (permission) {
    hasAccess = can(permission);
  } else if (permissions && Array.isArray(permissions)) {
    hasAccess = requireAll ? canAll(permissions) : canAny(permissions);
  }

  return hasAccess ? React.Children.toArray(children) : React.Children.toArray(fallback);
};

export default PermissionWrapper;
