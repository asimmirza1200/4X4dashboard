import { useContext } from 'react';
import { AdminContext } from '@/context/AdminContext';
import { hasPermission, hasAnyPermission, hasAllPermissions } from '@/utils/permissions';

const usePermissions = () => {
  const { state } = useContext(AdminContext);
  const { adminInfo } = state;
  
  // Extract role from JWT token if not directly available
  let userRole = adminInfo?.role;
  
  if (!userRole && adminInfo?.token) {
    try {
      // Decode JWT token to get role
      const tokenPayload = JSON.parse(atob(adminInfo.token.split('.')[1]));
      userRole = tokenPayload.role;
      console.log('Role extracted from token:', userRole);
    } catch (error) {
      console.error('Error decoding token:', error);
    }
  }
  
  // Debug: Log the adminInfo to see what's actually stored
  console.log('AdminInfo from context:', adminInfo);
  console.log('User role:', userRole);

  const can = (permission) => {
    if (!userRole || !permission) return false;
    return hasPermission(userRole, permission);
  };

  const canAny = (permissions) => {
    if (!userRole || !permissions || !Array.isArray(permissions)) return false;
    return hasAnyPermission(userRole, permissions);
  };

  const canAll = (permissions) => {
    if (!userRole || !permissions || !Array.isArray(permissions)) return false;
    return hasAllPermissions(userRole, permissions);
  };

  const isAdmin = () => userRole === 'Admin';
  const isManager = () => userRole === 'Manager';
  const isStaff = () => userRole === 'Staff';

  return {
    userRole,
    can,
    canAny,
    canAll,
    isAdmin,
    isManager,
    isStaff,
    adminInfo // Include adminInfo for debugging
  };
};

export default usePermissions;
