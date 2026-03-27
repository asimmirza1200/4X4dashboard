import React from 'react';
import { Card, CardBody } from '@windmill/react-ui';
import usePermissions from '@/hooks/usePermissions';
import PermissionWrapper from '@/components/auth/PermissionWrapper';
import { ROLES, PERMISSIONS } from '@/utils/permissions';

const PermissionTest = () => {
  const { userRole, can, canAny, canAll, isAdmin, isManager, isStaff } = usePermissions();

  return React.createElement('div', {className: 'p-6 space-y-6'}, 
    React.createElement(Card, null,
      React.createElement(CardBody, null,
        React.createElement('h2', {className: 'text-2xl font-bold mb-4'}, 'Permission System Test'),
        
        React.createElement('div', {className: 'mb-6 p-4 bg-gray-100 dark:bg-gray-800 rounded'},
          React.createElement('h3', {className: 'text-lg font-semibold mb-2'}, `Current User Role: ${userRole || 'Not logged in'}`),
          React.createElement('div', {className: 'grid grid-cols-3 gap-4 text-sm'},
            React.createElement('div', null, `Is Admin: ${isAdmin() ? '✅ Yes' : '❌ No'}`),
            React.createElement('div', null, `Is Manager: ${isManager() ? '✅ Yes' : '❌ No'}`),
            React.createElement('div', null, `Is Staff: ${isStaff() ? '✅ Yes' : '❌ No'}`)
          )
        ),

        React.createElement('div', {className: 'space-y-4'},
          React.createElement('h3', {className: 'text-lg font-semibold'}, 'Permission Tests:'),
          
          React.createElement('div', {className: 'grid grid-cols-2 gap-4'},
            React.createElement('div', {className: 'p-3 border rounded'},
              React.createElement('strong', null, 'Product Permissions:'),
              React.createElement('ul', {className: 'text-sm mt-2 space-y-1'},
                React.createElement('li', null, `View Products: ${can('view_products') ? '✅' : '❌'}`),
                React.createElement('li', null, `Add Products: ${can('add_products') ? '✅' : '❌'}`),
                React.createElement('li', null, `Delete Products: ${can('delete_products') ? '✅' : '❌'}`),
                React.createElement('li', null, `Update Inventory: ${can('update_inventory') ? '✅' : '❌'}`)
              )
            ),
            
            React.createElement('div', {className: 'p-3 border rounded'},
              React.createElement('strong', null, 'Order Permissions:'),
              React.createElement('ul', {className: 'text-sm mt-2 space-y-1'},
                React.createElement('li', null, `View Orders: ${can('view_orders') ? '✅' : '❌'}`),
                React.createElement('li', null, `Manage Orders: ${can('manage_orders') ? '✅' : '❌'}`)
              )
            )
          )
        ),

        React.createElement('div', {className: 'space-y-4 mt-6'},
          React.createElement('h3', {className: 'text-lg font-semibold'}, 'UI Component Tests:'),
          
          React.createElement(PermissionWrapper, {permission: 'add_products'},
            React.createElement('div', {className: 'p-3 bg-green-100 dark:bg-green-800 rounded'},
              '✅ Add Products Button - You can see this if you have add_products permission'
            )
          ),

          React.createElement(PermissionWrapper, {permission: 'delete_products'},
            React.createElement('div', {className: 'p-3 bg-red-100 dark:bg-red-800 rounded'},
              '✅ Delete Products Button - You can see this if you have delete_products permission'
            )
          ),

          React.createElement(PermissionWrapper, {permission: 'nonexistent_permission', fallback: 
            React.createElement('div', {className: 'p-3 bg-gray-100 dark:bg-gray-800 rounded'},
              '❌ This feature is restricted - You don\'t have permission'
            )
          },
            React.createElement('div', {className: 'p-3 bg-purple-100 dark:bg-purple-800 rounded'},
              '✅ Restricted Feature - You shouldn\'t see this'
            )
          )
        )
      )
    )
  );
};

export default PermissionTest;
