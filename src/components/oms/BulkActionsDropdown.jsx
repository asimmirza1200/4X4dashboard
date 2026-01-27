import React, { useState } from "react";
import { notifyError, notifySuccess } from "@/utils/toast";
import OrderServices from "@/services/OrderServices";

/**
 * BulkActionsDropdown Component for OMS
 * Handles bulk actions on selected orders using a simple select dropdown
 */
const BulkActionsDropdown = ({
  selectedIds,
  onRefresh,
  onStatusChange,
}) => {
  const [loading, setLoading] = useState(false);

  const handleBulkAction = async (e) => {
    const value = e.target.value;

    // Reset select to default
    e.target.value = "";

    if (!value || value === "") {
      return;
    }

    if (!selectedIds || selectedIds.length === 0) {
      notifyError("Please select at least one order");
      return;
    }

    setLoading(true);

    try {
      let response;

      if (value === "trash") {
        // Move to trash
        response = await OrderServices.bulkUpdateOrders({
          orderIds: selectedIds,
          action: "trash",
        });
        notifySuccess(
          `${selectedIds.length} order(s) moved to trash successfully`
        );
      } else {
        // Change status
        response = await OrderServices.bulkUpdateOrders({
          orderIds: selectedIds,
          action: "changeStatus",
          status: value,
        });
        notifySuccess(
          `${selectedIds.length} order(s) status updated to ${value}`
        );
        if (onStatusChange) onStatusChange();
      }

      if (onRefresh) onRefresh();
    } catch (error) {
      notifyError(error.message || "Failed to perform bulk action");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative inline-block">
      <select
        disabled={!selectedIds || selectedIds.length === 0 || loading}
        onChange={handleBulkAction}
        defaultValue=""
        className="min-h-[48px] px-4 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
          backgroundPosition: 'right 0.5rem center',
          backgroundRepeat: 'no-repeat',
          backgroundSize: '1.5em 1.5em',
          paddingRight: '2.5rem',
        }}
      >
        <option value="" disabled>
          {loading ? "Processing..." : "Bulk Actions"}
        </option>
        <option value="trash" className="text-red-600 dark:text-red-400">
          Move to Trash
        </option>
        <optgroup label="Change Status">
          <option value="Processing">Processing</option>
          <option value="Awaiting Stock">Awaiting Stock</option>
          <option value="On-Hold">On-Hold</option>
          <option value="Picking/Packing">Picking/Packing</option>
          <option value="Awaiting Delivery">Awaiting Delivery</option>
          <option value="Completed">Completed</option>
          <option value="Cancelled">Cancelled</option>
        </optgroup>
      </select>
    </div>
  );
};

export default BulkActionsDropdown;

