import React, { useState, useContext } from "react";
import { useTranslation } from "react-i18next";
import { toast } from "react-toastify";
import ProductServices from "@/services/ProductServices";
import { SidebarContext } from "@/context/SidebarContext";

const BulkActionsDropdown = ({ selectedIds, onRefresh, onOpenBatchEdit }) => {
  const { t } = useTranslation();
  const { setIsUpdate } = useContext(SidebarContext);
  const [loading, setLoading] = useState(false);

  const handleBulkAction = async (e) => {
    const value = e.target.value;

    // Reset select to default
    e.target.value = "";

    if (!value || value === "") {
      return;
    }

    if (!selectedIds || selectedIds.length === 0) {
      toast.error(t("Please select at least one product"));
      return;
    }

    setLoading(true);

    try {
      switch (value) {
        case "batch_edit":
          onOpenBatchEdit();
          setLoading(false);
          return;

        case "trash":
          await ProductServices.deleteManyProducts({ ids: selectedIds });
          toast.success(t("Products moved to trash successfully"));
          break;

        case "featured":
          await ProductServices.bulkUpdateProducts({
            ids: selectedIds,
            isFeatured: true,
          });
          toast.success(t("Products marked as featured successfully"));
          break;

        case "unfeatured":
          await ProductServices.bulkUpdateProducts({
            ids: selectedIds,
            isFeatured: false,
          });
          toast.success(t("Products unfeatured successfully"));
          break;

        case "stock_in":
          await ProductServices.bulkUpdateProducts({
            ids: selectedIds,
            stock: 1,
          });
          toast.success(t("Stock status updated to In Stock"));
          break;

        case "stock_out":
          await ProductServices.bulkUpdateProducts({
            ids: selectedIds,
            stock: 0,
          });
          toast.success(t("Stock status updated to Out of Stock"));
          break;

        case "stock_backorder":
          await ProductServices.bulkUpdateProducts({
            ids: selectedIds,
            stock: -1,
          });
          toast.success(t("Stock status updated to On Backorder"));
          break;

        default:
          toast.error(t("Unknown action"));
          setLoading(false);
          return;
      }

      setIsUpdate(true);
      if (onRefresh) onRefresh();
    } catch (error) {
      toast.error(error.message || t("Failed to perform bulk action"));
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block w-full">
      <select
        disabled={!selectedIds || selectedIds.length === 0 || loading}
        onChange={handleBulkAction}
        defaultValue=""
        className="w-full min-h-[48px] px-4 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        <option value="" disabled>
          {loading ? t("Processing...") : t("Bulk Actions")}
        </option>
        <option value="batch_edit">{t("Batch Edit")}</option>
        <optgroup label={t("Featured Status")}>
          <option value="featured">{t("Mark as Featured")}</option>
          <option value="unfeatured">{t("Mark as Unfeatured")}</option>
        </optgroup>
        <optgroup label={t("Stock Status")}>
          <option value="stock_in">{t("Set to In Stock")}</option>
          <option value="stock_out">{t("Set to Out of Stock")}</option>
          <option value="stock_backorder">{t("Set to On Backorder")}</option>
        </optgroup>
        <option value="trash" className="text-red-600 dark:text-red-400">
          {t("Move to Trash")}
        </option>
      </select>
    </div>
  );
};

export default BulkActionsDropdown;

