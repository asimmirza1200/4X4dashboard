import {
  Avatar,
  Badge,
  TableBody,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import { t } from "i18next";
import { FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import dayjs from "dayjs";
import React from "react";

//internal import
import CheckBox from "@/components/form/others/CheckBox";
import SwitchToggle from "@/components/form/switch/SwitchToggle";
import { getImageUrl } from "@/utils/getImageUrl";

const BrandTable = ({
  brands,
  isCheck,
  setIsCheck,
  handleToggleVisibility,
  handleViewBrand,
  handleEditBrand,
  handleDelete,
}) => {
  const handleClick = (e) => {
    const { id, checked } = e.target;
    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  return (
    <TableBody>
      {brands?.map((brand) => (
        <TableRow key={brand._id}>
          <TableCell className="w-12">
            <CheckBox
              type="checkbox"
              name={brand._id}
              id={brand._id}
              handleClick={handleClick}
              isChecked={isCheck.includes(brand._id)}
            />
          </TableCell>

          {/* Logo */}
          <TableCell>
            <Avatar
              className="hidden mr-3 md:block"
              src={getImageUrl(brand.logo_url || brand.image) || ""}
              alt={brand.name}
              size="large"
            />
          </TableCell>

          {/* Brand Name */}
          <TableCell>
            <div className="flex items-center">
              <span className="text-sm font-medium text-gray-700 dark:text-gray-400">
                {brand.name}
              </span>
            </div>
          </TableCell>

          {/* Product Count */}
          <TableCell>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {brand.productCount || 0}
            </span>
          </TableCell>

          {/* Status */}
          <TableCell className="text-center">
            <SwitchToggle
              id={brand._id}
              processOption={brand.is_active !== false}
              handleProcess={() =>
                handleToggleVisibility(brand._id, brand.is_active !== false)
              }
            />
          </TableCell>

          {/* Date */}
          <TableCell>
            <span className="text-sm text-gray-600 dark:text-gray-400">
              {dayjs(brand.updatedAt).format("MMM DD, YYYY")}
            </span>
          </TableCell>

          {/* Actions */}
          <TableCell className="text-right">
            <div className="flex justify-end items-center space-x-2">
              <button
                onClick={() => handleViewBrand(brand._id)}
                className="text-gray-600 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-400"
                title={t("View Details")}
              >
                <FiEye className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleEditBrand(brand._id)}
                className="text-gray-600 hover:text-blue-600 dark:text-gray-400 dark:hover:text-blue-400"
                title={t("Edit")}
              >
                <FiEdit className="w-5 h-5" />
              </button>
              <button
                onClick={() => handleDelete(brand._id)}
                className="text-gray-600 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                title={t("Delete")}
              >
                <FiTrash2 className="w-5 h-5" />
              </button>
            </div>
          </TableCell>
        </TableRow>
      ))}
    </TableBody>
  );
};

export default BrandTable;
