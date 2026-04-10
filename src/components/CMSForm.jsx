import React, { useState, useEffect } from 'react';
import { notifySuccess, notifyError } from "@/utils/toast";
import CMServices from "@/services/CMServices";
import { getPageConfig, cmsFormConfig } from "@/config/cmsFormConfig";
import { Card, CardBody, Label, Input, Textarea, Button, Select } from "@windmill/react-ui";
import { FiSave, FiX } from "react-icons/fi";
import CMSImageUploader from "@/components/CMSImageUploader";
import DynamicPromotionsManager from "@/components/DynamicPromotionsManager";
import DynamicCategoriesManager from "@/components/DynamicCategoriesManager";
import DynamicFeaturesManager from "@/components/DynamicFeaturesManager";
import DynamicValuesManager from "@/components/DynamicValuesManager";
import DynamicTeamManager from "@/components/DynamicTeamManager";
import DynamicStatsManager from "@/components/DynamicStatsManager";

const CMSForm = ({ pageType, existingPage, onSave, onCancel }) => {
  console.log('DEBUG CMSForm props:', { pageType, existingPage });
  const [formData, setFormData] = useState({});
  const [loading, setLoading] = useState(false);
  const [currentPageType, setCurrentPageType] = useState(pageType);
  const config = getPageConfig(currentPageType);

  const ensureIndicatorsDefaults = (content) => {
    // Create a deep copy of the content to avoid mutation
    const updatedContent = JSON.parse(JSON.stringify(content));
    
    // Ensure header indicators always have default values
    if (updatedContent.header && updatedContent.header.indicators) {
      const indicators = updatedContent.header.indicators;
      
      // Set default values for all indicator fields if they're undefined
      if (indicators.showWishlist === undefined) indicators.showWishlist = true;
      if (indicators.showAccount === undefined) indicators.showAccount = true;
      if (indicators.showCart === undefined) indicators.showCart = true;
    } else if (updatedContent.header) {
      // If indicators object doesn't exist, create it with defaults
      updatedContent.header.indicators = {
        showWishlist: true,
        showAccount: true,
        showCart: true
      };
    }
    
    return updatedContent;
  };

  useEffect(() => {
    console.log('DEBUG CMSForm useEffect triggered');
    console.log('DEBUG existingPage:', existingPage);
    console.log('DEBUG currentPageType:', currentPageType);
    console.log('DEBUG config:', config);
    
    let initialData;
    if (existingPage) {
      console.log('DEBUG: Using existingPage.content');
      initialData = existingPage.content || {};
    } else {
      console.log('DEBUG: Using config.defaultContent');
      console.log('DEBUG config.defaultContent:', JSON.stringify(config.defaultContent, null, 2));
      initialData = config.defaultContent || {};
    }
    
    // Ensure indicators have default values in the initial data
    const processedData = ensureIndicatorsDefaults(initialData);
    console.log('DEBUG: Processed initial data with indicator defaults:', processedData);
    
    setFormData(processedData);
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
        // Check if this is an indicator field and return default true
        if (fieldPath.includes('indicators.show')) {
          return true;
        }
        return '';
      }
    }
    
    // Handle array fields like qualityPoints
    if (Array.isArray(current)) {
  return current;
}
    
    // For boolean fields (like indicators), ensure we return proper boolean values
    if (typeof current === 'boolean') {
      return current;
    }
    
    return current || '';
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      // Ensure all indicators have default values before saving
      const processedContent = ensureIndicatorsDefaults(formData);
      
      const pageData = {
        page: currentPageType,
        content: processedContent,
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
        ) : field.type === 'dynamic-features' ? (
          <DynamicFeaturesManager
            features={(() => {
              // Check if features data exists and has items
              const featuresData = getFieldValue('features');
              console.log('DEBUG featuresData:', featuresData);
              
              if (featuresData && featuresData.items && Array.isArray(featuresData.items)) {
                console.log('DEBUG found features.items:', featuresData.items);
                return featuresData.items;
              }
              // Check for old format data
              if (featuresData && Object.keys(featuresData).length > 0) {
                console.log('DEBUG found old format features:', featuresData);
                // Convert old format to new items if needed
                return [];
              }
              console.log('DEBUG no features found, returning empty array');
              return [];
            })()}
            onChange={(items) => handleFieldChange('features.items', items)}
          />
        ) : field.type === 'dynamic-values' ? (
          <DynamicValuesManager
            values={(() => {
              console.log('DEBUG dynamic-values fieldPath:', fieldPath);
              const valuesData = getFieldValue(fieldPath);
              console.log('DEBUG dynamic-values valuesData:', valuesData);
              if (Array.isArray(valuesData)) {
                console.log('DEBUG dynamic-values found items:', valuesData);
                return valuesData;
              }
              console.log('DEBUG dynamic-values no items found, returning empty');
              return [];
            })()}
            onChange={(items) => handleFieldChange(fieldPath, items)}
          />
        ) : field.type === 'dynamic-team' ? (
          <DynamicTeamManager
            members={(() => {
              console.log('DEBUG dynamic-team fieldPath:', fieldPath);
              const teamData = getFieldValue(fieldPath);
              console.log('DEBUG dynamic-team teamData:', teamData);
              if (Array.isArray(teamData)) {
                console.log('DEBUG dynamic-team found members:', teamData);
                return teamData;
              }
              console.log('DEBUG dynamic-team no members found, returning empty');
              return [];
            })()}
            onChange={(members) => handleFieldChange(fieldPath, members)}
          />
        ) : field.type === 'dynamic-stats' ? (
          <DynamicStatsManager
            items={(() => {
              console.log('DEBUG dynamic-stats fieldPath:', fieldPath);
              const statsData = getFieldValue(fieldPath);
              console.log('DEBUG dynamic-stats statsData:', statsData);
              if (Array.isArray(statsData)) {
                console.log('DEBUG dynamic-stats found items:', statsData);
                return statsData;
              }
              console.log('DEBUG dynamic-stats no items found, returning empty');
              return [];
            })()}
            onChange={(items) => handleFieldChange(fieldPath, items)}
          />
        ) : field.type === 'dynamic-navigation' ? (
          <div className="space-y-2">
            <Textarea
              value={value}
              onChange={(e) => {
                const titles = e.target.value.split('\n').filter(t => t.trim());
                const items = titles.map(title => ({ title: title.trim() }));
                handleFieldChange(fieldPath, items);
              }}
              placeholder="Enter navigation items (one per line)"
              rows={4}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Enter one navigation item per line</p>
          </div>
        ) : field.type === 'dynamic-links' ? (

         (() => {
    const links = Array.isArray(value) ? value : [];

    return (
      <div className="space-y-3">
        {links.map((link, index) => (
          <div key={index} className="flex gap-2">
            <Input
              type="text"
              placeholder="Title"
              value={link.title || ''}
              onChange={(e) => {
                const updated = [...links];
                updated[index].title = e.target.value;
                handleFieldChange(fieldPath, updated);
              }}
            />

            <Input
              type="text"
              placeholder="/url name"
              value={link.url || ''}
              onChange={(e) => {
                const updated = [...links];
                updated[index].url = e.target.value;
                handleFieldChange(fieldPath, updated);
              }}
            />

            <button
              type="button"
              onClick={() => {
                const updated = links.filter((_, i) => i !== index);
                handleFieldChange(fieldPath, updated);
              }}
              className="text-red-500 px-2"
            >
              ✕
            </button>
          </div>
        ))}

        <Button
          type="button"
          onClick={() => {
            handleFieldChange(fieldPath, [...links, { title: '', url: '' }]);
          }}
        >
          + Add Link
        </Button>
      </div>
    );
  })()
        ) : field.type === 'array' ? (
          <div className="space-y-2">
            <Textarea
              value={value}
              onChange={(e) => {
                const titles = e.target.value.split('\n').filter(t => t.trim());
                const items = titles.map(title => ({ title: title.trim() }));
                handleFieldChange(fieldPath, items);
              }}
              placeholder={field.placeholder || "Enter items (one per line)"}
              rows={4}
              className="w-full"
            />
            <p className="text-xs text-gray-500">Enter one item per line</p>
          </div>
        ) : field.type === 'checkbox' ? (
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={value === true || value === 'true'}
              onChange={(e) => handleFieldChange(fieldPath, e.target.checked)}
              className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700 dark:text-gray-300">
              {field.label}
            </span>
          </div>
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
              <button
                onClick={onCancel}
                className="bg-white text-gray-500 hover:text-gray-700 border border-gray-300 rounded hover:bg-gray-50 p-2 transition-colors duration-200"
                style={{ width: 'auto', height: 'auto', minWidth: '0' }}
              >
                <FiX className="text-black" />
              </button>
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
            {config.formSections.sort((a, b) => {
              // For home page, put header section first
              if (currentPageType === 'home' || pageType === 'home') {
                if (a.key === 'header') return -1;
                if (b.key === 'header') return 1;
                // Also put footer section last
                if (a.key === 'footer') return 1;
                if (b.key === 'footer') return -1;
              }
              return 0;
            }).map((section) => (
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
              <button
                type="button"
                onClick={onCancel}
                disabled={loading}
                className="bg-white text-gray-700 hover:text-gray-900 border border-gray-300 rounded hover:bg-gray-50 px-4 py-2 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed"
                style={{ width: 'auto', height: 'auto', minWidth: '0' }}
              >
                Cancel
              </button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-blue-600 hover:bg-blue-700"
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
