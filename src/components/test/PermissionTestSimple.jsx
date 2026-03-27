import React from 'react';
import { Card, CardBody } from '@windmill/react-ui';
import usePermissions from '@/hooks/usePermissions';
import PermissionWrapper from '@/components/auth/PermissionWrapper';

const PermissionTestSimple = () => {
  const { userRole, can, isAdmin, isManager, isStaff, adminInfo } = usePermissions();

  return (
    <div className="p-6">
      <Card className="mb-4">
        <CardBody>
          <h2 className="text-xl font-bold mb-4">Permission System Test</h2>
          
          <div className="mb-4 p-4 bg-gray-100 dark:bg-gray-800 rounded">
            <h3 className="text-lg font-semibold mb-2">
              Current User Role: {userRole || 'Not logged in'}
            </h3>
            <div className="grid grid-cols-3 gap-4 text-sm">
              <div>Is Admin: {isAdmin() ? '✅ Yes' : '❌ No'}</div>
              <div>Is Manager: {isManager() ? '✅ Yes' : '❌ No'}</div>
              <div>Is Staff: {isStaff() ? '✅ Yes' : '❌ No'}</div>
            </div>
            
            {/* Debug info */}
            <div className="mt-4 p-3 bg-yellow-100 dark:bg-yellow-800 rounded text-xs">
              <strong>Debug Info:</strong>
              <pre className="mt-1 whitespace-pre-wrap">
                {JSON.stringify(adminInfo, null, 2)}
              </pre>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Permission Tests:</h3>
            
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 border rounded">
                <strong>Product Permissions:</strong>
                <ul className="text-sm mt-2 space-y-1">
                  <li>View Products: {can('view_products') ? '✅' : '❌'}</li>
                  <li>Add Products: {can('add_products') ? '✅' : '❌'}</li>
                  <li>Delete Products: {can('delete_products') ? '✅' : '❌'}</li>
                  <li>Update Inventory: {can('update_inventory') ? '✅' : '❌'}</li>
                </ul>
              </div>

              <div className="p-3 border rounded">
                <strong>Order Permissions:</strong>
                <ul className="text-sm mt-2 space-y-1">
                  <li>View Orders: {can('view_orders') ? '✅' : '❌'}</li>
                  <li>Manage Orders: {can('manage_orders') ? '✅' : '❌'}</li>
                </ul>
              </div>
            </div>
          </div>

          <div className="space-y-4 mt-6">
            <h3 className="text-lg font-semibold">UI Component Tests:</h3>
            
            <PermissionWrapper permission="add_products">
              <div className="p-3 bg-green-100 dark:bg-green-800 rounded">
                ✅ Add Products Button - You can see this if you have add_products permission
              </div>
            </PermissionWrapper>

            <PermissionWrapper permission="delete_products">
              <div className="p-3 bg-red-100 dark:bg-red-800 rounded">
                ✅ Delete Products Button - You can see this if you have delete_products permission
              </div>
            </PermissionWrapper>

            <PermissionWrapper permission="upload_csv">
              <div className="p-3 bg-blue-100 dark:bg-blue-800 rounded">
                ✅ CSV Upload Button - You can see this if you have upload_csv permission
              </div>
            </PermissionWrapper>

            <PermissionWrapper 
              permission="nonexistent_permission" 
              fallback={
                <div className="p-3 bg-gray-100 dark:bg-gray-800 rounded">
                  ❌ This feature is restricted - You don't have permission
                </div>
              }
            >
              <div className="p-3 bg-purple-100 dark:bg-purple-800 rounded">
                ✅ Restricted Feature - You shouldn't see this
              </div>
            </PermissionWrapper>
          </div>
        </CardBody>
      </Card>
    </div>
  );
};

export default PermissionTestSimple;
