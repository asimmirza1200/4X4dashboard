import React, { useState, useRef, useEffect } from 'react';
import { getImageUrl } from "@/utils/getImageUrl";
import { useBarcodeModal } from '../../hooks/useBarcodeModal';
const ProductInfoModal = ({ product, isOpen, onClose }) => {
  localStorage.setItem("product",JSON.stringify(product))
  if (!isOpen || !product) return null;

  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  // Barcode functionality
  const { openBarcodeModal, barcodeModal, barcodeCanvasRef, closeBarcodeModal, printBarcode } = useBarcodeModal();

  // Helper function to get translated value
  const getTranslatedValue = (value) => {
    if (!value) return 'Not specified';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.en) return value.en;
    if (typeof value === 'object' && value.name) return value.name;
    if (typeof value === 'object' && value._id && value.name) return value.name;
    if (Array.isArray(value) && value.length > 0) {
      const firstItem = value[0];
      if (typeof firstItem === 'string') return firstItem;
      if (typeof firstItem === 'object' && firstItem.name) return firstItem.name;
      if (typeof firstItem === 'object' && firstItem.en) return firstItem.en;
      return String(firstItem);
    }
    return 'Not specified';
  };
  
  // Helper function to get category name
  const getCategoryName = (category) => {
    if (!category) return 'Not specified';
    if (typeof category === 'string') return category;
    if (category.name) {
      if (typeof category.name === 'object' && category.name.en) return category.name.en;
      return category.name;
    }
    if (Array.isArray(category) && category.length > 0) {
      const firstCat = category[0];
      if (firstCat && firstCat.name) {
        if (typeof firstCat.name === 'object' && firstCat.name.en) return firstCat.name.en;
        return firstCat.name;
      }
      return firstCat || 'Not specified';
    }
    return 'Not specified';
  };
  
  // Helper function to get brand name
  const getBrandName = (brand) => {
    if (!brand) return 'Not specified';
    if (typeof brand === 'string') return brand;
    if (brand.name) return brand.name;
    return 'Not specified';
  };
  
  // Helper function to get vendor name
  const getVendorName = (vendor) => {
    if (!vendor) return 'Not specified';
    if (typeof vendor === 'string') return vendor;
    if (vendor.name) return vendor.name;
    return 'Not specified';
  };

  // Helper function to format currency
  const formatCurrency = (value, currency = '$') => {
    const num = parseFloat(value) || 0;
    return `${currency}${num.toFixed(2)}`;
  };

  // Helper function to format date
  const formatDate = (dateString) => {
    if (!dateString) return 'Not specified';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'Invalid date';
    }
  };

  // Helper function to convert to number
  const toNum = (v) => (v != null && v !== '' ? Number(v) : 0);
  // Get pricing data from prices object
  const prices = product.prices || {};
  const wholesalePrice = toNum(prices.tradePrice);
  const rrpPrice = toNum(prices.originalPrice);
  const finalPrice = toNum(prices.price) || rrpPrice;
  const discountAmount = toNum(prices.discount);

  // Calculate display prices
  const hasDiscount = discountAmount > 0 && rrpPrice > finalPrice;
  const displayPrice = finalPrice;
  const displayCompareAt = hasDiscount ? rrpPrice : null;
  const discountPercent = hasDiscount
    ? Math.round(((rrpPrice - finalPrice) / rrpPrice) * 100)
    : 0;
  const isOutOfStock = product.stock?.availability === 'out_of_stock' || product.stock?.quantity === 0;

  const productImages = product.image || [];
  const mainImage = productImages[selectedImageIndex];

  const productName = getTranslatedValue(product.title);
  const productDescription = getTranslatedValue(product.description);

  const staticProfitDollar = rrpPrice - wholesalePrice;
  const staticProfitPercent = rrpPrice > 0 ? (staticProfitDollar / rrpPrice) * 100 : 0;

  const discountProfitDollar = finalPrice - wholesalePrice;
  const discountProfitPercent = rrpPrice > 0 ? (discountProfitDollar / rrpPrice) * 100 : 0;

  // Stock status
  const stockQuantity = toNum(product.stock);
  const stockStatus = stockQuantity <= 0 ? 'Out of Stock' : stockQuantity <= 10 ? 'Low Stock' : 'Normal Stock';
  const stockColor = stockQuantity <= 0 ? 'red' : stockQuantity <= 10 ? 'yellow' : 'green';

  // Dimensions
  const dimensions = {
    weight: toNum(product.weight),
    length: toNum(product.length),
    width: toNum(product.width),
    height: toNum(product.height)
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-6xl p-6 my-8 text-left align-middle transition-all transform bg-white shadow-xl dark:bg-gray-800 rounded-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 pb-4 border-b bg-white dark:bg-gray-800">
    <h3 className="text-2xl font-semibold text-gray-900 dark:text-white">
      Complete Product Details
    </h3>

    <button
      type="button"
      onClick={onClose}
      className="sticky top-4 z-50 ml-auto text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors bg-white dark:bg-gray-900 p-2 rounded-full shadow"
    >
      <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
      </svg>
    </button>
  </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product Images - Left Column */}
            <div className="lg:col-span-1">
              <div className="relative aspect-square bg-gray-100 rounded-lg overflow-hidden mb-4">
                <img
                  src={getImageUrl(mainImage)}
                  alt={productName}
                  className="object-cover w-full h-full"
                />
                {hasDiscount && (
                  <div className="absolute top-4 right-4">
                    <span className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded">
                      -{discountPercent}%
                    </span>
                  </div>
                )}
                {product.badge && (
                  <div className="absolute top-4 left-4">
                    <span className="px-3 py-1 text-sm font-semibold text-white bg-blue-600 rounded">
                      {product.badge}
                    </span>
                  </div>
                )}
              </div>
              {/* Thumbnail Gallery */}
              {productImages.length > 1 && (
                <div className="grid grid-cols-4 gap-2">
                  {productImages.map((img, idx) => {
                    const imageSrc = getImageUrl(img);
                    const isSelected = idx === selectedImageIndex;
                    return (
                      <button
                        key={idx}
                        onClick={() => setSelectedImageIndex(idx)}
                        className={`relative aspect-square rounded-lg overflow-hidden border-2 transition-all ${
                          isSelected 
                            ? 'border-blue-500 ring-2 ring-blue-200' 
                            : 'border-transparent hover:border-gray-300'
                        }`}
                      >
                        <img
                          src={imageSrc}
                          alt={`${productName} ${idx + 1}`}
                          className="object-cover w-full h-full"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Product Details - Middle & Right Columns */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-blue-500 rounded-full mr-2"></span>
                  Basic Information
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Product ID:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{product.productId || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Title:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 text-right max-w-xs">{productName}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Slug:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-mono text-right">{product.slug || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Description:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 text-right max-w-xs">{productDescription}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Excerpt:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 text-right max-w-xs">{getTranslatedValue(product.excerpt)}</span>
                  </div>
                  
                  {product.tags && product.tags.length > 0 && (
                    <div className="flex justify-between items-start">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Tags:</span>
                      <div className="flex flex-wrap gap-1 justify-end">
                        {product.tags.map((tag, idx) => (
                          <span key={idx} className="px-2 py-1 text-xs bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100 rounded">
                            {tag}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Pricing Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Pricing & Profit Analysis
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Wholesale Price:</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(wholesalePrice)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">RRP Price:</span>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{formatCurrency(rrpPrice)}</span>
                    </div>
                    
                    <div className="flex justify-between">
                      <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Final Price:</span>
                      <span className="text-sm font-semibold text-blue-600 dark:text-blue-400">{formatCurrency(finalPrice)}</span>
                    </div>
                    
                    {hasDiscount && (
                      <>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Discount:</span>
                          <span className="text-sm font-semibold text-red-600 dark:text-red-400">-{discountPercent}%</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-sm font-medium text-gray-600 dark:text-gray-400">You Save:</span>
                          <span className="text-sm font-semibold text-green-600 dark:text-green-400">{formatCurrency(displayCompareAt - displayPrice)}</span>
                        </div>
                      </>
                    )}
                  </div>
                  
                  <div className="space-y-3">
                    <div className="border rounded-lg p-3 bg-green-50 dark:bg-green-900/20 border-green-300 dark:border-green-600">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Static Profit ($)</div>
                      <div className="text-lg font-semibold text-green-700 dark:text-green-200">{formatCurrency(staticProfitDollar)}</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">RRP vs Wholesale</div>
                    </div>
                    
                    <div className="border rounded-lg p-3 bg-blue-50 dark:bg-blue-900/20 border-blue-300 dark:border-blue-600">
                      <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Static Profit (%)</div>
                      <div className="text-lg font-semibold text-blue-700 dark:text-blue-200">{staticProfitPercent.toFixed(2)}%</div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">RRP vs Wholesale</div>
                    </div>
                    
                    {hasDiscount && (
                      <>
                        <div className="border rounded-lg p-3 bg-purple-50 dark:bg-purple-900/20 border-purple-300 dark:border-purple-600">
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Discount Profit ($)</div>
                          <div className="text-lg font-semibold text-purple-700 dark:text-purple-200">{formatCurrency(discountProfitDollar)}</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Final vs Wholesale</div>
                        </div>
                        
                        <div className="border rounded-lg p-3 bg-orange-50 dark:bg-orange-900/20 border-orange-300 dark:border-orange-600">
                          <div className="text-xs font-medium text-gray-600 dark:text-gray-400 mb-1">Discount Profit (%)</div>
                          <div className="text-lg font-semibold text-orange-700 dark:text-orange-200">{discountProfitPercent.toFixed(2)}%</div>
                          <div className="text-xs text-gray-500 dark:text-gray-400">Final vs Wholesale</div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* Stock & Inventory */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Stock & Inventory
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Quantity:</span>
                    <div className="flex items-center gap-2">
                      <div className={`w-3 h-3 rounded-full bg-${stockColor}-500`}></div>
                      <span className="text-sm font-semibold text-gray-900 dark:text-gray-100">{stockQuantity}</span>
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      stockStatus === 'Normal Stock' ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' :
                      stockStatus === 'Low Stock' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-800 dark:text-yellow-100' :
                      'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {stockStatus}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Stock Arrival Date:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{formatDate(product.stockArrivalDate)}</span>
                  </div>
                </div>
              </div>

              {/* Product Dimensions */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Physical Dimensions
                </h2>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Weight:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{dimensions.weight} kg</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Length:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{dimensions.length} cm</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Width:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{dimensions.width} cm</span>
                  </div>
                  
                  <div className="flex justify-between">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Height:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{dimensions.height} cm</span>
                  </div>
                </div>
              </div>

              {/* SKU Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  SKU Information
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Manufacturer SKU:</span>
                    <div className="text-right">
                      <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{product.manufacturerSku || 'Not specified'}</span>
                      {product.brand && product.manufacturerSku && (
                        <div className="text-xs text-blue-600 dark:text-blue-400 mt-1">
                          Customer format: [{getBrandName(product.brand)}] PID: {product.manufacturerSku}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Internal SKU:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{product.internalSku || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Categories & Brand */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-pink-500 rounded-full mr-2"></span>
                  Categories & Brand
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Brand:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{getBrandName(product.brand)}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{getCategoryName(product.categories)}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Default Category:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{getCategoryName(product.defaultCategory)}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Vendor:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{getVendorName(product.vendor)}</span>
                  </div>
                </div>
              </div>

              {/* Additional Details */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-teal-500 rounded-full mr-2"></span>
                  Additional Information
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Additional Details:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 text-right max-w-xs">{getTranslatedValue(product.additionalProductDetails)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Batch Ordered:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{formatDate(product.lastBatchOrderedFromManufacturer)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Batch Quantity:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{product.lastBatchOrderQuantity || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Last Batch Reference:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-mono text-right">{product.lastBatchOrderReference || 'Not specified'}</span>
                  </div>
                </div>
              </div>

              {/* Additional Product Fields */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-orange-500 rounded-full mr-2"></span>
                  Additional Product Fields
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Barcode:</span>
                    <div className="text-right">
                      {product.barcode ? (
                        <div className="space-y-2">
                          <span className="text-sm text-gray-900 dark:text-gray-100 font-mono block">{product.barcode}</span>
                          <button
                            onClick={() => openBarcodeModal("Product Barcode", product.barcode)}
                            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-500 hover:bg-blue-600 text-white rounded transition-colors"
                          >
                            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17H7m10 2a2 2 0 012-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2m10-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10m10-2a2 2 0 002-2m-2 2H7" />
                            </svg>
                            View & Print
                          </button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500 dark:text-gray-400">Not specified</span>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">SKU:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{product.sku || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Vehicle Make:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{product.vehicleMake || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Vehicle Model:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{product.vehicleModel || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Flat Rate Drop Shipping:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{formatCurrency(product.flatRateForDropShipping)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Ship Out Location:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{product.shipOutLocation || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Supplier Link:</span>
                    <span className="text-sm text-blue-600 dark:text-blue-400 text-right max-w-xs truncate">
                      {product.directSupplierLink ? (
                        <a href={product.directSupplierLink} target="_blank" rel="noopener noreferrer" className="hover:underline">
                          {product.directSupplierLink}
                        </a>
                      ) : 'Not specified'}
                    </span>
                  </div>
                </div>
              </div>

              {/* SEO & Meta Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                  SEO & Meta Information
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Meta Title:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 text-right max-w-xs">{product.metaTitle || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Meta Description:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 text-right max-w-xs">{product.metaDescription || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-start">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Meta Keywords:</span>
                    <div className="text-right max-w-xs">
                      {product.metaKeywords && product.metaKeywords.length > 0 ? (
                        <div className="flex flex-wrap gap-1 justify-end">
                          {product.metaKeywords.map((keyword, idx) => (
                            <span key={idx} className="px-2 py-1 text-xs bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded">
                              {keyword}
                            </span>
                          ))}
                        </div>
                      ) : 'Not specified'}
                    </div>
                  </div>
                </div>
              </div>

              {/* Quick Discount Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-purple-500 rounded-full mr-2"></span>
                  Quick Discount Settings
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Quick Discount Active:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      product.quickDiscount?.isActive 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {product.quickDiscount?.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Dollar Amount:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{formatCurrency(product.quickDiscount?.dollarAmount)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Percentage Amount:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{product.quickDiscount?.percentageAmount || 0}%</span>
                  </div>
                </div>
              </div>

              {/* Product Variants */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-yellow-500 rounded-full mr-2"></span>
                  Product Variants
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Number of Variants:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{product.variants?.length || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Is Combination:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      product.isCombination 
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-800 dark:text-blue-100' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {product.isCombination ? 'Combination Product' : 'Simple Product'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Reviews Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-cyan-500 rounded-full mr-2"></span>
                  Reviews Information
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Number of Reviews:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{product.reviews?.length || 0}</span>
                  </div>
                </div>
              </div>

              {/* Sales & Performance */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-green-500 rounded-full mr-2"></span>
                  Sales & Performance
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Sales Count:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{product.sales || 0}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Is Featured:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      product.isFeatured 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300'
                    }`}>
                      {product.isFeatured ? 'Featured' : 'Regular'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      product.status === 'show' 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {product.status === 'show' ? 'Active' : 'Hidden'}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Is Visible:</span>
                    <span className={`px-2 py-1 text-xs font-semibold rounded ${
                      product.is_visible 
                        ? 'bg-green-100 text-green-800 dark:bg-green-800 dark:text-green-100' 
                        : 'bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100'
                    }`}>
                      {product.is_visible ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                </div>
              </div>

              {/* System Information */}
              <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
                  <span className="w-2 h-2 bg-gray-500 rounded-full mr-2"></span>
                  System Information
                </h2>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Product ID:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100 font-mono">{product._id || 'Not specified'}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Created:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{formatDate(product.createdAt)}</span>
                  </div>
                  
                  <div className="flex justify-between items-center">
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400">Updated:</span>
                    <span className="text-sm text-gray-900 dark:text-gray-100">{formatDate(product.updatedAt)}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Barcode Modal */}
      {barcodeModal.isOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{barcodeModal.title}</h3>
              <button
                onClick={closeBarcodeModal}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
              >
                ✕
              </button>
            </div>

            <div className="mb-6 p-4 border border-gray-200 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700">
              <div className="text-center">
                <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
                  Barcode Preview (Code 128)
                </div>
                <div className="bg-white dark:bg-gray-700 p-4 rounded border border-gray-300 dark:border-gray-600 inline-block">
                  <canvas
                    ref={barcodeCanvasRef}
                    width="400"
                    height="150"
                    className="border border-gray-300 dark:border-gray-600"
                    style={{
                      background: 'white',
                      display: 'block',
                      margin: '0 auto'
                    }}
                  />
                </div>
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  Barcode: {barcodeModal.skuValue}
                </div>
              </div>
            </div>

            <div className="flex gap-3 justify-end">
              <button
                onClick={closeBarcodeModal}
                className="px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={printBarcode}
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-md flex items-center gap-2 transition-colors"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17H7m10 2a2 2 0 012-2v-4a2 2 0 00-2-2H7a2 2 0 00-2 2v4a2 2 0 002 2m10-2V7a2 2 0 00-2-2H7a2 2 0 00-2 2v10m10-2a2 2 0 002-2m-2 2H7" />
                </svg>
                Print Barcode
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductInfoModal;
