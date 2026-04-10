import React, { useState } from 'react';
import { Button, Input } from '@windmill/react-ui';
import { FiPlus, FiTrash2 } from 'react-icons/fi';

const DynamicStatsManager = ({ items = [], onChange }) => {
  const [newItem, setNewItem] = useState({ number: '', label: '' });

  const handleAddItem = () => {
    if (newItem.number.trim() && newItem.label.trim()) {
      onChange([...items, { ...newItem, id: Date.now() }]);
      setNewItem({ number: '', label: '' });
    }
  };

  const handleUpdateItem = (index, field, value) => {
    const updated = [...items];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemoveItem = (index) => {
    onChange(items.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {items.map((item, index) => (
        <div key={item.id || index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Number/Statistic
              </label>
              <Input
                type="text"
                placeholder="e.g., 10+, 50K+, 24/7"
                value={item.number || ''}
                onChange={(e) => handleUpdateItem(index, 'number', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Label
              </label>
              <Input
                type="text"
                placeholder="e.g., Years in Business"
                value={item.label || ''}
                onChange={(e) => handleUpdateItem(index, 'label', e.target.value)}
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end">
            <Button
              type="button"
              onClick={() => handleRemoveItem(index)}
              layout="outline"
              size="small"
              className="text-red-500 border-red-300 hover:bg-red-50"
            >
              <FiTrash2 className="mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ))}

      {/* Add new item form */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Add New Statistic</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Number/Statistic
            </label>
            <Input
              type="text"
              placeholder="e.g., 10+, 50K+, 24/7"
              value={newItem.number}
              onChange={(e) => setNewItem({ ...newItem, number: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Label
            </label>
            <Input
              type="text"
              placeholder="e.g., Years in Business"
              value={newItem.label}
              onChange={(e) => setNewItem({ ...newItem, label: e.target.value })}
            />
          </div>
        </div>
        <div className="mt-4">
          <Button
            type="button"
            onClick={handleAddItem}
            disabled={!newItem.number.trim() || !newItem.label.trim()}
            className="bg-blue-600 hover:bg-blue-700"
          >
            <FiPlus className="mr-2" />
            Add Statistic
          </Button>
        </div>
      </div>
    </div>
  );
};

export default DynamicStatsManager;
