import React from "react";
import { Input, Label } from "@windmill/react-ui";
import { FiCalendar } from "react-icons/fi";

/**
 * DateRangeFilter Component
 * Allows filtering orders by date range
 */
const DateRangeFilter = ({ startDate, endDate, onStartDateChange, onEndDateChange, onClear }) => {
  // Format date to YYYY-MM-DD for date input
  const formatDateForInput = (date) => {
    if (!date) return "";
    
    // If it's already in YYYY-MM-DD format, return as is
    if (typeof date === "string" && date.match(/^\d{4}-\d{2}-\d{2}$/)) {
      return date;
    }
    
    // If it's an ISO date string (e.g., "2025-01-16T11:30:00.000Z"), extract the date part
    if (typeof date === "string" && date.includes("T")) {
      const datePart = date.split("T")[0];
      if (datePart.match(/^\d{4}-\d{2}-\d{2}$/)) {
        return datePart;
      }
    }
    
    // If it's a Date object, format it
    if (date instanceof Date) {
      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");
      return `${year}-${month}-${day}`;
    }
    
    // Try to parse as Date if it's a string
    if (typeof date === "string") {
      const parsedDate = new Date(date);
      if (!isNaN(parsedDate.getTime())) {
        const year = parsedDate.getFullYear();
        const month = String(parsedDate.getMonth() + 1).padStart(2, "0");
        const day = String(parsedDate.getDate()).padStart(2, "0");
        return `${year}-${month}-${day}`;
      }
    }
    
    return "";
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label>
          <span className="flex items-center gap-2">
            <FiCalendar className="w-4 h-4" />
            Date Range
          </span>
        </Label>
        {(startDate || endDate) && (
          <button
            onClick={onClear}
            className="text-xs text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 underline"
          >
            Clear
          </button>
        )}
      </div>
      <div className="flex flex-col gap-2">
        <Input
          type="date"
          value={formatDateForInput(startDate)}
          onChange={(e) => onStartDateChange(e.target.value || "")}
          className="w-full"
        />
        <Input
          type="date"
          value={formatDateForInput(endDate)}
          onChange={(e) => onEndDateChange(e.target.value || "")}
          className="w-full"
        />
      </div>
    </div>
  );
};

export default DateRangeFilter;

