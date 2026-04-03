import { Select } from "@windmill/react-ui";
import React from "react";
import { Link } from "react-router-dom";
import { FiAlertCircle } from "react-icons/fi";

import useAsync from "@/hooks/useAsync";
import VendorServices from "@/services/VendorServices";

const SelectVendor = ({ register, name, label, required = true }) => {
  const { data, loading, error } = useAsync(VendorServices.getAllVendors);

  const vendors = Array.isArray(data) ? data : [];
  const activeVendors = vendors.filter((v) => v.status === "active");

  if (loading) {
    return (
      <Select disabled>
        <option>Loading vendors...</option>
      </Select>
    );
  }

  if (error) {
    return (
      <Select disabled>
        <option>Error loading vendors</option>
      </Select>
    );
  }

  if (activeVendors.length === 0) {
    return (
      <div className="rounded-lg border-2 border-yellow-300 bg-yellow-50 dark:bg-yellow-900 dark:border-yellow-600 p-4">
        <div className="flex items-center gap-2 mb-2">
          <FiAlertCircle className="w-5 h-5 text-yellow-600 dark:text-yellow-400" />
          <span className="text-sm font-semibold text-yellow-800 dark:text-yellow-200">
            No Vendors Found
          </span>
        </div>
        <p className="text-sm text-yellow-700 dark:text-yellow-300 mb-2">
          Please add a vendor first before creating a product.
        </p>
        <Link
          to="/vendors"
          className="inline-flex items-center text-sm font-medium text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 underline"
        >
          Go to Vendor Management →
        </Link>
      </div>
    );
  }

  return (
    <Select
      {...register(name, {
        required: required ? `${label} is required!` : false,
      })}
      name={name}
    >
      <option value="" defaultValue hidden>
        Select Vendor
      </option>
      {activeVendors.map((vendor) => (
        <option key={vendor._id} value={vendor._id}>
          {vendor.name}
          {vendor.companyName ? ` (${vendor.companyName})` : ""}
        </option>
      ))}
    </Select>
  );
};

export default SelectVendor;
