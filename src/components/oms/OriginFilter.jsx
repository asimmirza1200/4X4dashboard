import React from "react";
import { Select, Label } from "@windmill/react-ui";
import { FiGlobe } from "react-icons/fi";

/**
 * OriginFilter Component
 * Filters orders by referral channel/origin
 */
const OriginFilter = ({ value, onChange }) => {
  const originOptions = [
    { value: "", label: "All Origins" },
    { value: "Website", label: "Website" },
    { value: "Phone Order", label: "Phone Order" },
    { value: "Mobile App", label: "Mobile App" },
    { value: "Facebook", label: "Facebook" },
    { value: "Instagram", label: "Instagram" },
    { value: "Google Ads", label: "Google Ads" },
    { value: "Referral", label: "Referral" },
    { value: "Other", label: "Other" },
  ];

  return (
    <div>
      <Label>
        <span className="flex items-center gap-2">
          <FiGlobe className="w-4 h-4" />
          Origin
        </span>
      </Label>
      <Select
        className="mt-1"
        value={value || ""}
        onChange={(e) => onChange(e.target.value)}
      >
        {originOptions.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </Select>
    </div>
  );
};

export default OriginFilter;

