import React, { useState, useEffect } from 'react';
import { Button, Input, Textarea, Label } from "@windmill/react-ui";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import CMSImageUploader from "@/components/CMSImageUploader";

const DynamicPromotionsManager = ({ promotions, onChange }) => {
  const [items, setItems] = useState(promotions || []);

  useEffect(() => {
    setItems(promotions || []);
  }, [promotions]);

  const addItem = () => {
    const newItem = {
      id: Date.now(),
      title: '',
      subtitle: '',
      backgroundImage: '',
      button: 'Shop Now'
    };
    const newItems = [...items, newItem];
    setItems(newItems);
    onChange(newItems);
  };

  const updateItem = (index, field, value) => {
    const newItems = [...items];
    newItems[index][field] = value;
    setItems(newItems);
    onChange(newItems);
  };

  const removeItem = (index) => {
    const newItems = items.filter((_, i) => i !== index);
    setItems(newItems);
    onChange(newItems);
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center ">
        <Button onClick={addItem} size="small" className="bg-blue-600 hover:bg-blue-700">
          <FiPlus className="mr-2" />
          Add Promotion
        </Button>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-8 border-2 border-dashed border-gray-300 rounded-lg">
          <p className="text-gray-500">No promotions added yet. Click "Add Promotion" to get started.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {items.map((item, index) => (
            <div key={item.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-4">
                <h4 className="text-lg font-medium text-gray-800 dark:text-gray-200">
                  Promotion Banner {index + 1}
                </h4>
                <button
                  onClick={() => removeItem(index)}
                  className="bg-white text-red-600 border border-red-600 rounded hover:bg-red-50 px-3 py-2 transition-colors duration-200"
                  style={{ width: 'auto', height: 'auto', minWidth: '0' }}
                >
                  <FiTrash2 className="text-black"/>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Title
                  </Label>
                  <Input
                    value={item.title}
                    onChange={(e) => updateItem(index, 'title', e.target.value)}
                    placeholder="Enter promotion title"
                    className="w-full"
                  />
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Button Text
                  </Label>
                  <Input
                    value={item.button}
                    onChange={(e) => updateItem(index, 'button', e.target.value)}
                    placeholder="Shop Now"
                    className="w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Subtitle
                  </Label>
                  <Textarea
                    value={item.subtitle}
                    onChange={(e) => updateItem(index, 'subtitle', e.target.value)}
                    placeholder="Enter promotion subtitle"
                    rows={2}
                    className="w-full"
                  />
                </div>

                <div className="md:col-span-2">
                  <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Background Image
                  </Label>
                  <CMSImageUploader
                    imageUrl={item.backgroundImage}
                    setImageUrl={(url) => updateItem(index, 'backgroundImage', url)}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DynamicPromotionsManager;
