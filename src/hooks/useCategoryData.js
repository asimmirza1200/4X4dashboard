import { useState, useEffect } from 'react';
import useAsync from './useAsync';
import CategoryServices from '@/services/CategoryServices';
import useUtilsFunction from './useUtilsFunction';

const useCategoryData = () => {
  const { showingTranslateValue } = useUtilsFunction();
  const { data, loading, error } = useAsync(CategoryServices?.getAllCategory);
  const [flatCategories, setFlatCategories] = useState([]);
  const [categoryMap, setCategoryMap] = useState(new Map());

  // Flatten categories and create category map
  useEffect(() => {
    if (data) {
      const flat = [];
      const map = new Map();
      
      const flattenCategories = (categories) => {
        for (let category of categories) {
          const categoryObj = {
            _id: category._id,
            name: showingTranslateValue(category.name),
          };
          flat.push(categoryObj);
          map.set(category._id, categoryObj);
          
          if (category?.children?.length > 0) {
            flattenCategories(category.children);
          }
        }
      };
      
      flattenCategories(data);
      setFlatCategories(flat);
      setCategoryMap(map);
    }
  }, [data, showingTranslateValue]);

  const getCategoryById = (id) => {
    return categoryMap.get(id);
  };

  return {
    categories: flatCategories,
    loading,
    error,
    getCategoryById,
  };
};

export default useCategoryData;
