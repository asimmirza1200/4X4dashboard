import React from "react";
import { Badge } from "@windmill/react-ui";
import { FiCreditCard, FiClock, FiCheckCircle, FiXCircle, FiAlertTriangle } from "react-icons/fi";

/**
 * PaymentStatus Component
 * Displays comprehensive payment status with color coding and icons
 * Works with backend order data structure
 */
const PaymentStatus = ({ order }) => {
  if (!order) {
    return (
      <Badge className="dark:bg-gray-700 dark:text-gray-200 bg-gray-200 text-gray-800">
        No Order Data
      </Badge>
    );
  }

  // Use backend order data directly
  const status = order.paymentStatus;
  const method = order.paymentMethod;
  const amount = Number(order.paymentAmount) || 0;
  const currency = order.paymentCurrency || '$';
  const transactionId = order.stripePaymentIntentId;
  const paymentDate = order.paymentDate;
  const refundAmount = Number(order.refundAmount) || 0;

  // Debug logging
  console.log('PaymentStatus Debug:', {
    refundAmount: refundAmount,
    refundAmountType: typeof refundAmount,
    refundAmountNotZero: refundAmount !== 0,
    refundAmountGreaterThanZero: refundAmount > 0
  });
  
  // Simple status styling
  const getStatusStyle = (status) => {
    const statusLower = (status || '').toLowerCase();
    
    switch (statusLower) {
      case 'paid':
      case 'completed':
        return { type: 'success', color: 'text-green-600', icon: FiCheckCircle };
      case 'pending':
      case 'processing':
        return { type: 'warning', color: 'text-yellow-600', icon: FiClock };
      case 'failed':
      case 'declined':
        return { type: 'danger', color: 'text-red-600', icon: FiXCircle };
      default:
        return { type: 'default', color: 'text-gray-600', icon: FiCreditCard };
    }
  };

  const statusStyle = getStatusStyle(status);
  const Icon = statusStyle.icon;

  return (
    <div className="space-y-2">
      {/* Payment Status Badge */}
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${statusStyle.color}`} />
        <Badge type={statusStyle.type}>
          {status?.replace(/-/g, ' ').replace(/\b\w/g, (l) => l.toUpperCase()) || 'Unknown'}
        </Badge>
      </div>

      {/* Payment Method */}
      {method && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Method:</span> {method}
        </div>
      )}

      {/* Transaction ID */}
      {transactionId && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Transaction ID:</span> {transactionId}
        </div>
      )}

      {/* Payment Date */}
      {paymentDate && (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <span className="font-medium">Paid:</span> {new Date(paymentDate).toLocaleDateString()}
        </div>
      )}

      {/* Amount */}
      {amount && (
        <div className="text-sm font-medium text-gray-800 dark:text-gray-200">
          Amount: {currency === 'USD' ? '$' : currency}{amount.toFixed(2)}
        </div>
      )}

      {/* Refund Information */}
      {refundAmount && refundAmount > 0 ? (
        <div className="text-sm text-gray-600 dark:text-gray-400">
          <div className="font-medium">Refund Info:</div>
          <div className="ml-2">
            <div>Amount: {currency === 'USD' ? '$' : currency}{refundAmount.toFixed(2)}</div>
          </div>
        </div>
      ):null}
    </div>
  );
};

export default PaymentStatus;
