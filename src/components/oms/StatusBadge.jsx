import React from "react";
import { Badge } from "@windmill/react-ui";

/**
 * StatusBadge Component for OMS
 * Displays order status with color-coded badges
 */
const StatusBadge = ({ status }) => {
  if (!status || typeof status !== "string") {
    return (
      <Badge className="dark:bg-gray-700 dark:text-gray-200 bg-gray-200 text-gray-800">
        N/A
      </Badge>
    );
  }

  // Color mapping for status badges
  const getBadgeProps = (status) => {
    const statusLower = status?.toLowerCase() || "";

    // Payment Processing - Blue
    if (statusLower.includes("payment-processing")) {
      return { type: "primary", className: "" };
    }

    // Pending - Yellow/Warning
    if (statusLower === "pending") {
      return { type: "warning", className: "" };
    }

    // Processing - Blue
    if (statusLower === "processing" || statusLower==="paid" ) {
      return { type: "primary", className: "" };
    }

    // Awaiting Stock - Orange
    if (statusLower.includes("awaiting stock")) {
      return {
        className: "dark:bg-orange-900 dark:text-orange-200 bg-orange-100 text-orange-800",
      };
    }

    // On-Hold - Yellow
    if (statusLower.includes("on-hold") || statusLower.includes("on hold")) {
      return { type: "warning", className: "" };
    }

    // Picking/Packing - Purple
    if (
      statusLower.includes("picking") ||
      statusLower.includes("packing")
    ) {
      return {
        className: "dark:bg-purple-900 dark:text-purple-200 bg-purple-100 text-purple-800",
      };
    }

    // Awaiting Delivery - Teal
    if (statusLower.includes("awaiting delivery")) {
      return {
        className: "dark:bg-teal-900 dark:text-teal-200 bg-teal-100 text-teal-800",
      };
    }

    // Out for Delivery - Indigo
    if (
      statusLower.includes("out-for-delivery") ||
      statusLower.includes("out for delivery")
    ) {
      return {
        className: "dark:bg-indigo-900 dark:text-indigo-200 bg-indigo-100 text-indigo-800",
      };
    }

    // Delivered - Green
    if (statusLower === "delivered") {
      return { type: "success", className: "" };
    }

    // Completed - Green
    if (statusLower === "completed") {
      return { type: "success", className: "" };
    }

    // Cancelled/Cancel - Red
    if (statusLower === "cancelled" || statusLower === "cancel") {
      return { type: "danger", className: "" };
    }

    // Refunded - Gray
    if (statusLower === "refunded") {
      return {
        className: "dark:bg-gray-700 dark:text-gray-200 bg-gray-200 text-gray-800",
      };
    }

    // Default - Gray
    return {
      className: "dark:bg-gray-700 dark:text-gray-200 bg-gray-200 text-gray-800",
    };
  };

  const badgeProps = getBadgeProps(status);
  const displayStatus = status
    .replace(/-/g, " ")
    .replace(/\b\w/g, (l) => l.toUpperCase());

  return (
    <Badge {...badgeProps} className={badgeProps.className || ""}>
      {displayStatus}
    </Badge>
  );
};

export default StatusBadge;

