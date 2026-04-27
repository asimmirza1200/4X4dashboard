import React, { useState } from 'react';
import { Card, CardBody, Button, Input, Label } from '@windmill/react-ui';
import { FiPlus, FiTrash2, FiEdit2, FiCheck, FiX } from 'react-icons/fi';
import CMSImageUploader from '@/components/CMSImageUploader';

const DynamicFeaturesManager = ({ features = [], onChange }) => {
  const [editingIndex, setEditingIndex] = useState(null);
  const [editingFeature, setEditingFeature] = useState(null);

  const handleAddFeature = () => {
    const newFeature = {
      icon: '',
      title: '',
      subtitle: '',
    };
    const updatedFeatures = [...features, newFeature];
    onChange(updatedFeatures);
    setEditingIndex(features.length);
    setEditingFeature(newFeature);
  };

  const handleEditFeature = (index) => {
    setEditingIndex(index);
    setEditingFeature({ ...features[index] });
  };

  const handleSaveFeature = () => {
    if (editingIndex !== null && editingFeature) {
      const updatedFeatures = [...features];
      updatedFeatures[editingIndex] = editingFeature;
      onChange(updatedFeatures);
      setEditingIndex(null);
      setEditingFeature(null);
    }
  };

  const handleCancelEdit = () => {
    // If canceling a new feature that hasn't been saved, remove it
    if (editingIndex !== null && editingFeature && (!editingFeature.title || !editingFeature.subtitle)) {
      const updatedFeatures = features.filter((_, i) => i !== editingIndex);
      onChange(updatedFeatures);
    }
    setEditingIndex(null);
    setEditingFeature(null);
  };

  const handleDeleteFeature = (index) => {
    const updatedFeatures = features.filter((_, i) => i !== index);
    onChange(updatedFeatures);
  };

  const handleFeatureChange = (field, value) => {
    setEditingFeature(prev => ({
      ...prev,
      [field]: value
    }));
  };


  return (
    <div className="space-y-4 ">
      <div className="flex justify-between items-center">
        <h4 className="text-lg font-medium text-gray-900 dark:text-gray-100">
          Feature Items ({features.length})
        </h4>
       <div className="flex justify-between items-center ">
               <Button onClick={handleAddFeature} size="small" className="bg-blue-600 hover:bg-blue-700">
                 <FiPlus className="mr-2" />
                 Add Feature
               </Button>
             </div>
      </div>

      {features.length === 0 ? (
        <div className="text-center py-8 bg-gray-50 dark:bg-gray-800 rounded-lg border-2 border-dashed border-gray-300 dark:border-gray-600">
          <p className="text-gray-500 dark:text-gray-400">
            No features added yet. Click "Add Feature" to get started.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 ">
          {features.map((feature, index) => (
            <Card key={index} className="relative">
              <CardBody>
                {editingIndex === index ? (
                  <div className="space-y-3">
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Icon
                      </Label>
                      <CMSImageUploader
                        imageUrl={editingFeature.icon}
                        setImageUrl={(url) => handleFeatureChange('icon', url)}
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Feature Title
                      </Label>
                      <Input
                        value={editingFeature.title || ''}
                        onChange={(e) => handleFeatureChange('title', e.target.value)}
                        placeholder="e.g., Free Shipping"
                        className="w-full"
                      />
                    </div>
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                        Subtitle
                      </Label>
                      <Input
                        value={editingFeature.subtitle || ''}
                        onChange={(e) => handleFeatureChange('subtitle', e.target.value)}
                        placeholder="e.g., On orders over $100"
                        className="w-full"
                      />
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={handleSaveFeature}
                        className="bg-green-600 hover:bg-green-700 text-white rounded px-4 py-2 transition-colors duration-200 flex items-center justify-center"
                        style={{ width: 'auto', height: 'auto', minWidth: '0' }}
                      >
                        <FiCheck className="mr-1" />
                        Save
                      </button>
                      <button
                        onClick={handleCancelEdit}
                        className="bg-white text-gray-700 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 px-4 py-2 transition-colors duration-200 flex items-center justify-center"
                        style={{ width: 'auto', height: 'auto', minWidth: '0' }}
                      >
                        <FiX className="mr-1" />
                        Cancel
                      </button>
                    </div>
                  </div>
                ) : (
                  <div>
                    <div className="flex justify-between items-start mb-2">
                      <div className="flex items-center gap-3">
                        {feature.icon && (
                          <img
                            src={feature.icon}
                            alt={feature.title || 'Feature icon'}
                            className="h-10 w-10 object-contain"
                          />
                        )}
                        <div>
                          <h5 className="font-medium text-gray-900 dark:text-gray-100">
                            {feature.title || 'Untitled Feature'}
                          </h5>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {feature.subtitle || 'No subtitle'}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="flex gap-2 mt-3">
                      <button
                        onClick={() => handleEditFeature(index)}
                        className="bg-white text-gray-700 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 px-3 py-2 transition-colors duration-200 flex items-center justify-center"
                        style={{ width: 'auto', height: 'auto', minWidth: '0' }}
                      >
                        <FiEdit2 className="mr-1" />
                        Edit
                      </button>
                      <button
                        onClick={() => handleDeleteFeature(index)}
                        className="bg-white text-red-600 border border-red-600 rounded hover:bg-red-50 dark:hover:bg-red-900/20 px-3 py-2 transition-colors duration-200 flex items-center justify-center"
                        style={{ width: 'auto', height: 'auto', minWidth: '0' }}
                      >
                        <FiTrash2 className="mr-1" />
                        Delete
                      </button>
                    </div>
                  </div>
                )}
              </CardBody>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicFeaturesManager;
