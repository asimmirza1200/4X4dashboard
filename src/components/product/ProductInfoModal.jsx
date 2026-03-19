import React, { useState } from 'react';
import { getImageUrl } from "@/utils/getImageUrl";
const ProductInfoModal = ({ product, isOpen, onClose }) => {
  if (!isOpen || !product) return null;
  
  const [quantity, setQuantity] = useState(1);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  
  // Helper function to get translated value
  const getTranslatedValue = (value) => {
    if (!value) return '—';
    if (typeof value === 'string') return value;
    if (typeof value === 'object' && value.en) return value.en;
    return String(value);
  };
  
  const toNum = (v) => (v != null && v !== '' ? Number(v) : 0);
  const raw = product._original?.prices || product.prices || {};
  const listFromRaw = toNum(raw.price) || toNum(raw.originalPrice) || toNum(raw.tradePrice) || 0;
  const discountFromRaw = toNum(raw.discount);
  const displayPrice = toNum(product.price) || (discountFromRaw > 0 ? discountFromRaw : listFromRaw) || 0;
  const displayCompareAt = toNum(product.compareAtPrice) || (discountFromRaw > 0 ? (toNum(raw.price) || toNum(raw.originalPrice) || listFromRaw) : null);

  const hasDiscount = displayCompareAt != null && displayCompareAt > displayPrice;
  const discountPercent = hasDiscount
    ? Math.round(((displayCompareAt - displayPrice) / displayCompareAt) * 100)
    : 0;
  const isOutOfStock = product.stock?.availability === 'out_of_stock' || product.stock?.quantity === 0;
  const productImages = product.image || [];
  const mainImage = productImages[selectedImageIndex];
  
  const productName = getTranslatedValue(product.title);
  const productDescription = getTranslatedValue(product.description);
  console.log("product", product);
  console.log("productImages", productImages);
  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        {/* Background overlay */}
        <div 
          className="fixed inset-0 transition-opacity bg-gray-500 bg-opacity-75 dark:bg-gray-900 dark:bg-opacity-75"
          onClick={onClose}
        />

        {/* Modal panel */}
        <div className="inline-block w-full max-w-4xl p-6 my-8 overflow-hidden text-left align-middle transition-all transform bg-white shadow-xl dark:bg-gray-800 rounded-lg">
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
              Product Details
            </h3>
            <button
              type="button"
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Product Images */}
            <div>
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

            {/* Product Info */}
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">{productName}</h1>

              {/* Rating */}
              <div className="flex items-center gap-2 mb-4">
                <div className="flex items-center">
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      className={`w-5 h-5 ${i < Math.round(product.rating || 0) ? 'text-yellow-400' : 'text-gray-300'}`}
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <span className="text-gray-600 dark:text-gray-400">({product.reviewsCount || 0} reviews)</span>
              </div>

              {/* Price */}
              <div className="mb-6">
                {displayPrice > 0 || displayCompareAt > 0 ? (
                  hasDiscount ? (
                    <div className="flex items-center gap-4 flex-wrap">
                      <span className="text-3xl font-bold text-gray-900 dark:text-white">${displayPrice.toFixed(2)}</span>
                      <span className="text-xl text-gray-500 line-through">${displayCompareAt.toFixed(2)}</span>
                      <span className="px-3 py-1 text-sm font-semibold text-white bg-red-600 rounded">
                        Save ${(displayCompareAt - displayPrice).toFixed(2)}
                      </span>
                    </div>
                  ) : (
                    <span className="text-3xl font-bold text-gray-900 dark:text-white">${(displayPrice || displayCompareAt).toFixed(2)}</span>
                  )
                ) : (
                  <span className="text-lg text-gray-500">Price on request</span>
                )}
              </div>

              {/* Description */}
              <p className="text-gray-700 dark:text-gray-300 mb-6 leading-relaxed">{productDescription}</p>

              {/* Stock Status */}
              <div className="mb-6">
                {isOutOfStock ? (
                  <span className="inline-block px-4 py-2 text-red-600 bg-red-50 dark:bg-red-900/20 rounded-lg font-semibold">
                    Out of Stock
                  </span>
                ) : (
                  <span className="inline-block px-4 py-2 text-green-600 bg-green-50 dark:bg-green-900/20 rounded-lg font-semibold">
                    In Stock ({product.stock?.quantity || product.stock || 0} available)
                  </span>
                )}
              </div>

              {/* Product Details Grid */}
              <div className="grid grid-cols-2 gap-4 mb-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    SKU
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {product.sku || '—'}
                  </p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <p className="text-sm text-gray-900 dark:text-white">
                    {product.status === 'hide' ? 'Draft' : 'Published'}
                  </p>
                </div>
              </div>

              {/* Tags */}
              {product.tags && product.tags.length > 0 && (
                <div className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                    Tags
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {product.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-full"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-emerald-500 dark:bg-gray-700 dark:text-gray-300 dark:border-gray-600 dark:hover:bg-gray-600"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductInfoModal;
