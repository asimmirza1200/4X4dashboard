import { Select } from "@windmill/react-ui";
import React from "react";
import { useTranslation } from "react-i18next";

//internal import
import useAsync from "@/hooks/useAsync";
import BrandServices from "@/services/BrandsServices";

const SelectBrandFilter = ({ setBrand, selectedBrand }) => {
    const { t } = useTranslation();
    const { data } = useAsync(() => BrandServices.getAllBrands({
        page: 1,
        limit: 1000, // Get all brands
        is_active: true // Only active brands
    }));

    return (
        <>
            <Select
                value={selectedBrand || ""}
                onChange={(e) => setBrand(e.target.value)}
            >
                <option value="" defaultValue hidden>
                    {t("Filter by Brand")}
                </option>
                {/* Handle both array and object response formats */}
                {(Array.isArray(data) ? data : data?.brands || [])?.map((brand) => (
                    <option key={brand._id} value={brand._id}>
                        {brand.name}
                    </option>
                ))}
            </Select>
        </>
    );
};

export default SelectBrandFilter;

