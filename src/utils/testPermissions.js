// Test script to verify permission system
import { ROLES, PERMISSIONS, hasPermission, hasAnyPermission, hasAllPermissions } from './permissions.js';

console.log('🧪 Testing Permission System...\n');

// Test each role
const roles = [ROLES.ADMIN, ROLES.MANAGER, ROLES.STAFF];

roles.forEach(role => {
  console.log(`📋 Testing ${role} Role:`);
  console.log('-----------------------------------');
  
  // Test key permissions
  const keyPermissions = [
    PERMISSIONS.VIEW_PRODUCTS,
    PERMISSIONS.ADD_PRODUCTS,
    PERMISSIONS.DELETE_PRODUCTS,
    PERMISSIONS.UPDATE_INVENTORY,
    PERMISSIONS.VIEW_ORDERS,
    PERMISSIONS.MANAGE_ORDERS,
    PERMISSIONS.VIEW_STAFF,
    PERMISSIONS.ADD_STAFF,
    PERMISSIONS.UPLOAD_CSV
  ];
  
  keyPermissions.forEach(permission => {
    const hasAccess = hasPermission(role, permission);
    const status = hasAccess ? '✅' : '❌';
    console.log(`${status} ${permission}`);
  });
  
  // Test multiple permissions
  console.log('\n🔗 Multiple Permission Tests:');
  const productPerms = [PERMISSIONS.VIEW_PRODUCTS, PERMISSIONS.ADD_PRODUCTS];
  console.log(`Can Any (product perms): ${hasAnyPermission(role, productPerms) ? '✅' : '❌'}`);
  console.log(`Can All (product perms): ${hasAllPermissions(role, productPerms) ? '✅' : '❌'}`);
  
  console.log('\n');
});

// Test role-specific expectations
console.log('🎯 Role Expectations Verification:');
console.log('=====================================');

const expectations = {
  [ROLES.ADMIN]: {
    shouldHave: Object.values(PERMISSIONS), // Admin should have all permissions
    shouldNotHave: []
  },
  [ROLES.MANAGER]: {
    shouldHave: [
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
    shouldNotHave: [
      PERMISSIONS.ADD_STAFF,
      PERMISSIONS.EDIT_STAFF,
      PERMISSIONS.DELETE_STAFF,
      PERMISSIONS.MANAGE_ROLES,
      PERMISSIONS.MANAGE_CUSTOMERS,
      PERMISSIONS.MANAGE_SETTINGS
    ]
  },
  [ROLES.STAFF]: {
    shouldHave: [
      PERMISSIONS.VIEW_PRODUCTS,
      PERMISSIONS.UPDATE_INVENTORY,
      PERMISSIONS.VIEW_ORDERS,
      PERMISSIONS.VIEW_DASHBOARD
    ],
    shouldNotHave: [
      PERMISSIONS.ADD_PRODUCTS,
      PERMISSIONS.EDIT_PRODUCTS,
      PERMISSIONS.DELETE_PRODUCTS,
      PERMISSIONS.MANAGE_ORDERS,
      PERMISSIONS.VIEW_STAFF,
      PERMISSIONS.ADD_STAFF,
      PERMISSIONS.UPLOAD_CSV
    ]
  }
};

Object.entries(expectations).forEach(([role, expected]) => {
  console.log(`\n🔍 Verifying ${role}:`);
  
  // Check should have permissions
  expected.shouldHave.forEach(permission => {
    const hasAccess = hasPermission(role, permission);
    const status = hasAccess ? '✅' : '❌';
    console.log(`${status} Should have ${permission}`);
  });
  
  // Check should not have permissions
  expected.shouldNotHave.forEach(permission => {
    const hasAccess = hasPermission(role, permission);
    const status = !hasAccess ? '✅' : '❌';
    console.log(`${status} Should NOT have ${permission}`);
  });
});

console.log('\n🎉 Permission System Test Complete!');
console.log('Visit /test-permissions route to see interactive test UI.');
