import React from "react";
import { Select, Label } from "@windmill/react-ui";
import { FiFilter } from "react-icons/fi";

/**
 * StatusFilter Component
 * Filters orders by status
 */
const StatusFilter = ({ value, onChange }) => {
  const statusOptions = [
    { value: "", label: "All Statuses" },
    { value: "Payment-Processing", label: "Payment Processing" },
    { value: "Pending", label: "Pending" },
    { value: "Processing", label: "Processing" },
    { value: "Paid", label: "Paid" },
    { value: "Awaiting Stock", label: "Awaiting Stock" },
    { value: "On-Hold", label: "On Hold" },
    { value: "Picking/Packing", label: "Picking/Packing" },
    { value: "Awaiting Delivery", label: "Awaiting Delivery" },
    { value: "Out-for-Delivery", label: "Out for Delivery" },
    { value: "Delivered", label: "Delivered" },
    { value: "Completed", label: "Completed" },
    { value: "Cancelled", label: "Cancelled" },
    { value: "Refunded", label: "Refunded" },
  ];

  return (
    <div>
      <Label>
        <span className="flex items-center gap-2">
          <FiFilter className="w-4 h-4" />
          Status
        </span>
      </Label>
      <Select
        className="mt-1"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {statusOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default StatusFilter;

