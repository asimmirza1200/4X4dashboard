import { Select } from "@windmill/react-ui";
import React from "react";
import { useTranslation } from "react-i18next";

//internal import
import useCategoryData from "@/hooks/useCategoryData";

const SelectCategory = ({ setCategory, selectedCategory, label = "Select Category" }) => {
  const { t } = useTranslation();
  const { categories, loading, error } = useCategoryData();

  if (loading) {
    return (
      <Select disabled>
        <option>{t("Loading categories...")}</option>
      </Select>
    );
  }

  if (error) {
    return (
      <Select disabled>
        <option>{t("Error loading categories")}</option>
      </Select>
    );
  }

  return (
    <>
      <Select 
        value={selectedCategory || ""} 
        onChange={(e) => setCategory(e.target.value)}
      >
        <option value="" defaultValue hidden>
          {t(label)}
        </option>
        {categories.length > 0 ? (
          categories.map((category) => (
            <option key={category._id} value={category._id}>
              {category.name}
            </option>
          ))
        ) : (
          <option disabled>{t("No categories available")}</option>
        )}
      </Select>
      {categories.length === 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t("No categories found. Create a category first.")}
        </p>
      )}
    </>
  );
};

export default SelectCategory;
