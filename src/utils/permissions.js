export const ROLES = {
  ADMIN: 'Admin',
  MANAGER: 'Manager', 
  STAFF: 'Staff'
};

export const PERMISSIONS = {
  // Product permissions
  VIEW_PRODUCTS: 'view_products',
  ADD_PRODUCTS: 'add_products',
  EDIT_PRODUCTS: 'edit_products',
  DELETE_PRODUCTS: 'delete_products',
  UPDATE_INVENTORY: 'update_inventory',
  
  // Order permissions
  VIEW_ORDERS: 'view_orders',
  MANAGE_ORDERS: 'manage_orders',
  
  // Staff permissions
  VIEW_STAFF: 'view_staff',
  ADD_STAFF: 'add_staff',
  EDIT_STAFF: 'edit_staff',
  DELETE_STAFF: 'delete_staff',
  MANAGE_ROLES: 'manage_roles',
  
  // Customer permissions
  VIEW_CUSTOMERS: 'view_customers',
  MANAGE_CUSTOMERS: 'manage_customers',
  
  // Analytics permissions
  VIEW_ANALYTICS: 'view_analytics',
  VIEW_REPORTS: 'view_reports',
  
  // System permissions
  UPLOAD_CSV: 'upload_csv',
  MANAGE_SETTINGS: 'manage_settings',
  VIEW_DASHBOARD: 'view_dashboard'
};

export const ROLE_PERMISSIONS = {
  [ROLES.ADMIN]: [
    // Admin has all permissions
    ...Object.values(PERMISSIONS)
  ],
  
  [ROLES.MANAGER]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.ADD_PRODUCTS,
    PERMISSIONS.EDIT_PRODUCTS,
    PERMISSIONS.DELETE_PRODUCTS,
    PERMISSIONS.UPDATE_INVENTORY,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.VIEW_CUSTOMERS,
    PERMISSIONS.VIEW_ANALYTICS,
    PERMISSIONS.VIEW_REPORTS,
    PERMISSIONS.UPLOAD_CSV,
    PERMISSIONS.VIEW_DASHBOARD
  ],
  
  [ROLES.STAFF]: [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.UPDATE_INVENTORY,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.VIEW_DASHBOARD
  ]
};

export const hasPermission = (userRole, permission) => {
  if (!userRole || !permission) return false;
  
  const userPermissions = ROLE_PERMISSIONS[userRole] || [];
  return userPermissions.includes(permission);
};

export const hasAnyPermission = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false;
  
  return permissions.some(permission => hasPermission(userRole, permission));
};

export const hasAllPermissions = (userRole, permissions) => {
  if (!userRole || !permissions || !Array.isArray(permissions)) return false;
  
  return permissions.every(permission => hasPermission(userRole, permission));
};

export const getPermissionsForRole = (role) => {
  return ROLE_PERMISSIONS[role] || [];
};
