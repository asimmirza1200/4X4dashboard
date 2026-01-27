import React from "react";
import { Input, Label } from "@windmill/react-ui";
import { FiUser } from "react-icons/fi";

/**
 * CustomerFilter Component
 * Filters orders by registered customer (name or email)
 */
const CustomerFilter = ({ value, onChange, onClear }) => {
  return (
    <div className="relative">
      <Label>
        <span className="flex items-center gap-2">
          <FiUser className="w-4 h-4" />
          Filter by Customer
        </span>
      </Label>
      <div className="relative mt-1">
        <Input
          type="text"
          placeholder="Search by customer name or email..."
          value={value || ""}
          onChange={(e) => onChange(e.target.value)}
          className="pr-10"
        />
        {value && (
          <button
            onClick={onClear}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
          >
            ×
          </button>
        )}
      </div>
    </div>
  );
};

export default CustomerFilter;

