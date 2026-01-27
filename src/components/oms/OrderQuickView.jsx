import React from "react";
import { Modal, ModalBody, ModalHeader, Button } from "@windmill/react-ui";
import { FiX, FiPackage, FiUser, FiDollarSign, FiTruck } from "react-icons/fi";
import StatusBadge from "./StatusBadge";
import useUtilsFunction from "@/hooks/useUtilsFunction";

/**
 * OrderQuickView Modal Component
 * Displays a quick preview of order details
 */
const OrderQuickView = ({ isOpen, onClose, order }) => {
  const { showDateTimeFormat, currency, getNumberTwo } = useUtilsFunction();

  if (!order) return null;

  const customerName = order.user_info?.name || order.user?.name || "N/A";
  const customerEmail = order.user_info?.email || order.user?.email || "N/A";
  const customerContact = order.user_info?.contact || "N/A";

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalHeader className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold text-gray-800 dark:text-gray-200">
            Order #{order.orderId || order.invoice}
          </h2>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
            Invoice: {order.invoice || "N/A"}
          </p>
        </div>
        <Button
          layout="link"
          onClick={onClose}
          className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
        >
          <FiX className="w-5 h-5" />
        </Button>
      </ModalHeader>

      <ModalBody className="space-y-6">
        {/* Order Status */}
        <div className="flex items-center justify-between pb-4 border-b border-gray-200 dark:border-gray-700">
          <div>
            <p className="text-sm text-gray-500 dark:text-gray-400">Status</p>
            <div className="mt-1">
              <StatusBadge status={order.status} />
            </div>
          </div>
          <div className="text-right">
            <p className="text-sm text-gray-500 dark:text-gray-400">Order Date</p>
            <p className="text-sm font-medium text-gray-800 dark:text-gray-200 mt-1">
              {showDateTimeFormat(order.createdAt)}
            </p>
          </div>
        </div>

        {/* Customer Information */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiUser className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Customer Information
            </h3>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <p className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Name:</span>{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {customerName}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-gray-500 dark:text-gray-400">Email:</span>{" "}
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {customerEmail}
              </span>
            </p>
            {customerContact !== "N/A" && (
              <p className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Contact:</span>{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {customerContact}
                </span>
              </p>
            )}
          </div>
        </div>

        {/* Order Items Summary */}
        {order.cart && order.cart.length > 0 && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiPackage className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Order Items ({order.cart.length})
              </h3>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2 max-h-48 overflow-y-auto">
              {order.cart.slice(0, 5).map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-2 border-b border-gray-200 dark:border-gray-700 last:border-0"
                >
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-800 dark:text-gray-200">
                      {item.title || item.name || "Product"}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      Qty: {item.quantity || 1} × {currency}
                      {getNumberTwo(item.price || 0)}
                    </p>
                  </div>
                  <p className="text-sm font-semibold text-gray-800 dark:text-gray-200">
                    {currency}
                    {getNumberTwo((item.price || 0) * (item.quantity || 1))}
                  </p>
                </div>
              ))}
              {order.cart.length > 5 && (
                <p className="text-xs text-gray-500 dark:text-gray-400 text-center pt-2">
                  +{order.cart.length - 5} more items
                </p>
              )}
            </div>
          </div>
        )}

        {/* Shipping Information */}
        {order.shipmentTracking && (
          <div>
            <div className="flex items-center gap-2 mb-3">
              <FiTruck className="w-5 h-5 text-gray-500" />
              <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                Shipping
              </h3>
            </div>
            <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4">
              <p className="text-sm">
                <span className="text-gray-500 dark:text-gray-400">Tracking:</span>{" "}
                <span className="font-medium text-gray-800 dark:text-gray-200">
                  {order.shipmentTracking}
                </span>
              </p>
            </div>
          </div>
        )}

        {/* Order Totals */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <FiDollarSign className="w-5 h-5 text-gray-500" />
            <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
              Order Summary
            </h3>
          </div>
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Subtotal:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {currency}
                {getNumberTwo(order.subTotal || 0)}
              </span>
            </div>
            {order.discount > 0 && (
              <div className="flex justify-between text-sm">
                <span className="text-gray-500 dark:text-gray-400">Discount:</span>
                <span className="font-medium text-red-600 dark:text-red-400">
                  -{currency}
                  {getNumberTwo(order.discount || 0)}
                </span>
              </div>
            )}
            <div className="flex justify-between text-sm">
              <span className="text-gray-500 dark:text-gray-400">Shipping:</span>
              <span className="font-medium text-gray-800 dark:text-gray-200">
                {currency}
                {getNumberTwo(order.shippingCost || 0)}
              </span>
            </div>
            <div className="flex justify-between text-base font-semibold pt-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-gray-800 dark:text-gray-200">Total:</span>
              <span className="text-gray-800 dark:text-gray-200">
                {currency}
                {getNumberTwo(order.total || 0)}
              </span>
            </div>
          </div>
        </div>

        {/* Payment Method */}
        <div className="flex justify-between items-center pt-4 border-t border-gray-200 dark:border-gray-700">
          <span className="text-sm text-gray-500 dark:text-gray-400">
            Payment Method:
          </span>
          <span className="text-sm font-medium text-gray-800 dark:text-gray-200">
            {order.paymentMethod || "N/A"}
          </span>
        </div>
      </ModalBody>
    </Modal>
  );
};

export default OrderQuickView;

