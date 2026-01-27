import { Select } from "@windmill/react-ui";
import React from "react";
import { useTranslation } from "react-i18next";

//internal import
import useAsync from "@/hooks/useAsync";
import BrandServices from "@/services/BrandsServices";

const SelectBrand = ({ setBrand, selectedBrand, includeInactive = false }) => {
  const { t } = useTranslation();
  
  // Fetch only active brands by default, or all brands if includeInactive is true
  const { data, loading, error } = useAsync(
    () => BrandServices.getAllBrands({
      page: 1,
      limit: 1000, // Get all brands
      is_active: includeInactive ? undefined : true,
      sort_by: 'name',
      sort_dir: 'asc'
    })
  );

  if (loading) {
    return (
      <Select disabled>
        <option>{t("Loading brands...")}</option>
      </Select>
    );
  }

  if (error) {
    return (
      <Select disabled>
        <option>{t("Error loading brands")}</option>
      </Select>
    );
  }

  const brands = data?.brands || [];

  return (
    <>
      <Select 
        value={selectedBrand || ""} 
        onChange={(e) => setBrand(e.target.value)}
      >
        <option value="" defaultValue hidden>
          {t("Select Brand")}
        </option>
        {brands.length > 0 ? (
          brands.map((brand) => (
            <option key={brand._id} value={brand._id}>
              {brand.name} {!brand.is_active && brand.is_active !== undefined ? `(${t("Inactive")})` : ''}
            </option>
          ))
        ) : (
          <option disabled>{t("No brands available")}</option>
        )}
      </Select>
      {brands.length === 0 && (
        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
          {t("No brands found. Create a brand first.")}
        </p>
      )}
    </>
  );
};

export default SelectBrand;

