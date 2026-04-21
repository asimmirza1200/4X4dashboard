import React, { useState } from 'react';
import { Button, Input, Textarea } from '@windmill/react-ui';
import { FiPlus, FiTrash2, FiUpload } from 'react-icons/fi';
import CMSImageUploader from './CMSImageUploader';

const DynamicValuesManager = ({ values = [], onChange }) => {
  const [newItem, setNewItem] = useState({ title: '', description: '', icon: '' });

  const handleAddItem = () => {
    if (newItem.title.trim()) {
      onChange([...values, { ...newItem, id: Date.now() }]);
      setNewItem({ title: '', description: '', icon: '' });
    }
  };

  const handleUpdateItem = (index, field, value) => {
    const updated = [...values];
    updated[index] = { ...updated[index], [field]: value };
    onChange(updated);
  };

  const handleRemoveItem = (index) => {
    onChange(values.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-4">
      {values.map((item, index) => (
        <div key={item.id || index} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Value Title
              </label>
              <Input
                type="text"
                placeholder="e.g., Quality"
                value={item.title || ''}
                onChange={(e) => handleUpdateItem(index, 'title', e.target.value)}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Icon
              </label>
              <CMSImageUploader
                imageUrl={item.icon || ''}
                setImageUrl={(url) => handleUpdateItem(index, 'icon', url)}
              />
            </div>
          </div>
          <div className="mt-4">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Description
            </label>
            <Textarea
              placeholder="Describe this value..."
              value={item.description || ''}
              onChange={(e) => handleUpdateItem(index, 'description', e.target.value)}
              rows={3}
              className="w-full"
            />
          </div>
          <div className="mt-4 flex justify-end ">
            <button  style={{ width: 'auto', height: 'auto', minWidth: '0' }}
             
              onClick={() => handleRemoveItem(index)}
    
               className="flex items-center justify-center bg-white  text-gray-500 hover:text-gray-700 border border-gray-300 rounded hover:bg-gray-50 p-2 transition-colors duration-200"
            >
              <FiTrash2 className="mr-2 text-black" />
              Remove
            </button>
          </div>
        </div>
      ))}

      {/* Add new item form */}
      <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-4">
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-4">Add New Value</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Value Title
            </label>
            <Input
              type="text"
              placeholder="e.g., Quality"
              value={newItem.title}
              onChange={(e) => setNewItem({ ...newItem, title: e.target.value })}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Icon
            </label>
            <CMSImageUploader
              imageUrl={newItem.icon}
              setImageUrl={(url) => setNewItem({ ...newItem, icon: url })}
            />
          </div>
        </div>
        <div className="mt-4">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            Description
          </label>
          <Textarea
            placeholder="Describe this value..."
            value={newItem.description}
            onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
            rows={3}
            className="w-full"
          />
        </div>
        <div className="mt-4">
          <button
           style={{ width: 'auto', height: 'auto', minWidth: '0' }}
            onClick={handleAddItem}
            disabled={!newItem.title.trim()}
           className="flex items-center justify-center bg-white  text-gray-500 hover:text-gray-700 border border-gray-300 rounded hover:bg-gray-50 p-2 transition-colors duration-200"
          >
            <FiPlus className="mr-2" />
            Add Value
          </button>
        </div>
      </div>
    </div>
  );
};

export default DynamicValuesManager;
