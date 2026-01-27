import React from "react";
import { TableBody, TableCell, TableRow, Badge } from "@windmill/react-ui";
import { FiZoomIn, FiEye } from "react-icons/fi";
import { Link } from "react-router-dom";
import { useTranslation } from "react-i18next";
import StatusBadge from "./StatusBadge";
import Tooltip from "@/components/tooltip/Tooltip";
import useUtilsFunction from "@/hooks/useUtilsFunction";

/**
 * OMSTable Component
 * Enhanced order table with all OMS requirements
 */
const OMSTable = ({
  orders,
  selectedOrders,
  onSelectOrder,
  onSelectAll,
  onQuickView,
  sortBy,
  sortOrder,
  onSort,
}) => {
  const { t } = useTranslation();
  const { showDateTimeFormat, currency, getNumberTwo } = useUtilsFunction();

  const allSelected =
    orders.length > 0 &&
    orders.every((order) => selectedOrders.includes(order._id));

  const handleSort = (field) => {
    if (onSort) {
      const newOrder = sortBy === field && sortOrder === "asc" ? "desc" : "asc";
      onSort(field, newOrder);
    }
  };

  const getSortIcon = (field) => {
    if (sortBy !== field) return null;
    return sortOrder === "asc" ? "▲" : "▼";
  };

  return (
    <TableBody className="dark:bg-gray-900">
      {orders?.length === 0 ? (
        <TableRow>
          <TableCell colSpan="8" className="text-center py-8">
            <p className="text-gray-500 dark:text-gray-400">No orders found</p>
          </TableCell>
        </TableRow>
      ) : (
        orders?.map((order, i) => {
          const isSelected = selectedOrders.includes(order._id);
          const customerName =
            order.user_info?.name || order.user?.name || "N/A";

          return (
            <TableRow key={order._id || i}>
              {/* Checkbox */}
              <TableCell>
                <input
                  type="checkbox"
                  checked={isSelected}
                  onChange={() => onSelectOrder(order._id)}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
              </TableCell>

              {/* Order ID + Customer Name */}
              <TableCell>
                <div>
                  <Link
                    to={`/order/${order._id}`}
                    className="font-semibold text-sm text-blue-600 dark:text-blue-400 hover:underline"
                  >
                    #{order.orderId || order.invoice}
                  </Link>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                    {customerName}
                  </p>
                </div>
              </TableCell>

              {/* Date - Sortable */}
              <TableCell>
                <button
                  onClick={() => handleSort("date")}
                  className="text-left flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span className="text-sm">
                    {showDateTimeFormat(order.createdAt)}
                  </span>
                  {getSortIcon("date") && (
                    <span className="text-xs">{getSortIcon("date")}</span>
                  )}
                </button>
              </TableCell>

              {/* Shipment Tracking */}
              <TableCell>
                <span className="text-sm">
                  {order.shipmentTracking || (
                    <span className="text-gray-400 dark:text-gray-500">
                      N/A
                    </span>
                  )}
                </span>
              </TableCell>

              {/* Status */}
              <TableCell>
                {StatusBadge ? (
                  <StatusBadge status={order.status} />
                ) : (
                  <Badge className="dark:bg-gray-700 dark:text-gray-200 bg-gray-200 text-gray-800">
                    {order.status || "N/A"}
                  </Badge>
                )}
              </TableCell>

              {/* Total - Sortable */}
              <TableCell>
                <button
                  onClick={() => handleSort("total")}
                  className="text-left flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <span className="text-sm font-semibold">
                    {currency}
                    {getNumberTwo(order.total || 0)}
                  </span>
                  {getSortIcon("total") && (
                    <span className="text-xs">{getSortIcon("total")}</span>
                  )}
                </button>
              </TableCell>

              {/* Origin */}
              <TableCell>
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {order.origin || "Website"}
                </span>
              </TableCell>

              {/* Actions */}
              <TableCell className="text-right">
                <div className="flex justify-end items-center gap-2">
                  {/* Quick View */}
                  <button
                    onClick={() => onQuickView(order)}
                    className="p-2 cursor-pointer text-gray-400 hover:text-blue-600 dark:hover:text-blue-400"
                    title="Quick View"
                  >
                    <FiEye className="w-5 h-5" />
                  </button>

                  {/* View Details */}
                  <Link to={`/order/${order._id}`}>
                    {Tooltip ? (
                      <Tooltip
                        id={`view-${order._id}`}
                        Icon={FiZoomIn}
                        title={t("View Details")}
                        bgColor="#059669"
                      />
                    ) : (
                      <FiZoomIn className="w-5 h-5 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" />
                    )}
                  </Link>
                </div>
              </TableCell>
            </TableRow>
          );
        })
      )}
    </TableBody>
  );
};

export default OMSTable;

