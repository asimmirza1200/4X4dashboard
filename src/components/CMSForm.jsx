import React, { useState, useEffect } from 'react';
import { notifySuccess, notifyError } from "@/utils/toast";
import CMServices from "@/services/CMServices";
import { getPageConfig, cmsFormConfig } from "@/config/cmsFormConfig";
import { Card, CardBody, Label, Input, Textarea, Button, Select } from "@windmill/react-ui";
import { FiSave, FiX } from "react-icons/fi";
import CMSImageUploader from "@/components/CMSImageUploader";
import DynamicPromotionsManager from "@/components/DynamicPromotionsManager";
import DynamicCategoriesManager from "@/components/DynamicCategoriesManager";

const CMSForm = ({ pageType, existingPage, onSave, onCancel }) => {
  console.log('DEBUG CMSForm props:', { pageType, existingPage });
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPageType, setCurrentPageType] = useState(pageType);
  const config = getPageConfig(currentPageType);

  useEffect(() => {
    console.log('DEBUG CMSForm useEffect triggered');
    console.log('DEBUG existingPage:', existingPage);
    console.log('DEBUG currentPageType:', currentPageType);
    console.log('DEBUG config:', config);
    
    if (existingPage) {
      console.log('DEBUG: Using existingPage.content');
      setFormData(existingPage.content || {});
    } else {
      console.log('DEBUG: Using config.defaultContent');
      console.log('DEBUG config.defaultContent:', JSON.stringify(config.defaultContent, null, 2));
      setFormData(config.defaultContent || {});
    }
  }, [existingPage, currentPageType]);

  const handleFieldChange = (fieldPath, value) => {
    const keys = fieldPath.split('.');
    setFormData(prev => {
      const newData = { ...prev };
      let current = newData;
      
      for (let i = 0; i < keys.length - 1; i++) {
        if (!current[keys[i]]) {
          current[keys[i]] = {};
        }
        current = current[keys[i]];
      }
      
      // Handle array fields like qualityPoints
      if (keys[keys.length - 1] === 'qualityPoints') {
        current[keys[keys.length - 1]] = value.split('\n').filter(point => point.trim() !== '');
      } else {
        current[keys[keys.length - 1]] = value;
      }
      
      return newData;
    });
  };

  const getFieldValue = (fieldPath) => {
    const keys = fieldPath.split('.');
    let current = formData;
    
    for (const key of keys) {
      if (current && typeof current === 'object' && key in current) {
        current = current[key];
      } else {
        return '';
      }
    }
    
    // Handle array fields like qualityPoints
    if (Array.isArray(current)) {
      return current.join('\n');
    }
    
    return current || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const pageData = {
        page: currentPageType,
        content: formData,
        updatedAt: new Date().toISOString()
      };

      if (existingPage) {
        // For updates, use the original page name, not currentPageType
        pageData.page = existingPage.page;
        await CMServices.updateCMSContent(existingPage.page, pageData);
        notifySuccess(`${config.title} updated successfully`);
      } else {
        pageData.createdAt = new Date().toISOString();
        await CMServices.createCMSContent(pageData);
        notifySuccess(`${config.title} created successfully`);
      }

      onSave();
    } catch (error) {
      console.error('Error saving CMS page:', error);
      notifyError(error.message || "Failed to save CMS page");
    } finally {
      setLoading(false);
    }
  };

  const renderField = (sectionKey, field) => {
    const fieldPath = `${sectionKey}.${field.key}`;
    const value = getFieldValue(fieldPath);

    return (
      <div key={field.key} className={field.fullWidth ? 'col-span-1 md:col-span-2' : ''}>
        <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {field.label}
        </Label>
        {field.type === 'textarea' ? (
          <Textarea
            value={value}
            onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
            placeholder={field.placeholder}
            rows={field.rows || 3}
            className="w-full"
          />
        ) : field.type === 'image' ? (
          <div>
            <CMSImageUploader
              imageUrl={value}
              setImageUrl={(url) => handleFieldChange(fieldPath, url)}
            />
          </div>
        ) : field.type === 'dynamic-promotions' ? (
          <DynamicPromotionsManager
            promotions={(() => {
              // Check if promotions data exists and has items
              const promotionsData = getFieldValue('promotions');
              console.log('DEBUG promotionsData:', promotionsData);
              console.log('DEBUG formData:', formData);
              
              if (promotionsData && promotionsData.items && Array.isArray(promotionsData.items)) {
                console.log('DEBUG found promotions.items:', promotionsData.items);
                return promotionsData.items;
              }
              // Check for old format data
              if (promotionsData && Object.keys(promotionsData).length > 0) {
                console.log('DEBUG found old format promotions:', promotionsData);
                // Convert old format to new items if needed
                return [];
              }
              console.log('DEBUG no promotions found, returning empty array');
              return [];
            })()}
            onChange={(items) => handleFieldChange('promotions.items', items)}
          />
        ) : field.type === 'dynamic-categories' ? (
          <DynamicCategoriesManager
            categories={(() => {
              // Check if categories data exists and has items
              const categoriesData = getFieldValue('categories');
              console.log('DEBUG categoriesData:', categoriesData);
              
              if (categoriesData && categoriesData.items && Array.isArray(categoriesData.items)) {
                console.log('DEBUG found categories.items:', categoriesData.items);
                return categoriesData.items;
              }
              // Check for old format data
              if (categoriesData && Object.keys(categoriesData).length > 0) {
                console.log('DEBUG found old format categories:', categoriesData);
                // Convert old format to new items if needed
                return [];
              }
              console.log('DEBUG no categories found, returning empty array');
              return [];
            })()}
            onChange={(items) => handleFieldChange('categories.items', items)}
          />
        ) : (
          <Input
            type={field.type}
            value={value}
            onChange={(e) => handleFieldChange(fieldPath, e.target.value)}
            placeholder={field.placeholder}
            className="w-full"
          />
        )}
      </div>
    );
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen p-4">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
          <div className="sticky top-0 bg-white dark:bg-gray-800 border-b border-gray-200 dark:border-gray-700 px-6 py-4">
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-100">
                {existingPage ? `Edit ${config.title}` : `Create New Page`}
              </h2>
              <Button
                onClick={onCancel}
                layout="outline"
                size="icon"
                className="text-gray-500 hover:text-gray-700 w-50"
              >
                <FiX className="text-black" />
              </Button>
            </div>
            {!existingPage && (
              <div className="mt-4">
                <Label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Select Page Type
                </Label>
                <Select
                  value={currentPageType}
                  onChange={(e) => setCurrentPageType(e.target.value)}
                  className="w-full md:w-64"
                >
                  {Object.keys(cmsFormConfig).map(key => (
                    <option key={key} value={key}>
                      {cmsFormConfig[key].title}
                    </option>
                  ))}
                </Select>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">
                  {config.description}
                </p>
              </div>
            )}
          </div>

          <form onSubmit={handleSubmit} className="p-6">
            {config.formSections.map((section) => (
              <Card key={section.key} className="mb-6">
                <CardBody>
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-100 mb-4">
                    {section.title}
                  </h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {section.fields.map((field) => renderField(section.key, field))}
                  </div>
                </CardBody>
              </Card>
            ))}

            <div className="flex justify-end gap-3 mt-6">
              <Button
                type="button"
                onClick={onCancel}
                layout="outline"
                disabled={loading}
                className="w-80"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700 w-[200px]"
              >
                {loading ? (
                  'Saving...'
                ) : (
                  <>
                    <FiSave className="mr-2" />
                    {existingPage ? 'Update Page' : 'Create Page'}
                  </>
                )}
              </Button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default CMSForm;
