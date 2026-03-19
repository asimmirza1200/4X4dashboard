import {
  Avatar,
  Badge,
  TableBody,
  TableCell,
  TableRow,
} from "@windmill/react-ui";
import { DotLottieReact } from '@lottiefiles/dotlottie-react';
import { t } from "i18next";
import { FiZoomIn, FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import React, { useState, useContext } from "react";
import { toast } from "react-toastify";

//internal import
import MainDrawer from "@/components/drawer/MainDrawer";
import ProductDrawer from "@/components/drawer/ProductDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import ProductInfoModal from "@/components/product/ProductInfoModal";
import EditDeleteButton from "@/components/table/EditDeleteButton";
import ShowHideButton from "@/components/table/ShowHideButton";
import Tooltip from "@/components/tooltip/Tooltip";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import ProductRowActions from "@/components/product/ProductRowActions";
import QuickEditModal from "@/components/product/QuickEditModal";
import ProductServices from "@/services/ProductServices";
import { SidebarContext } from "@/context/SidebarContext";
import { getImageUrl } from "@/utils/getImageUrl";

//internal import

const ProductTable = ({ products, isCheck, setIsCheck }) => {
  const { title, serviceId, handleModalOpen, handleUpdate } = useToggleDrawer();
  const { currency, showingTranslateValue, getNumberTwo } = useUtilsFunction();
  const { setIsUpdate } = useContext(SidebarContext);
  const [quickEditProduct, setQuickEditProduct] = useState(null);
  const [isQuickEditOpen, setIsQuickEditOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [isInfoModalOpen, setIsInfoModalOpen] = useState(false);

  // Website base URL (adjust based on your environment)
  const websiteBaseUrl = process.env.REACT_APP_WEBSITE_URL || "http://localhost:3000";

  const handleClick = (e) => {
    const { id, checked } = e.target;
    // console.log("id", id, checked);

    setIsCheck([...isCheck, id]);
    if (!checked) {
      setIsCheck(isCheck.filter((item) => item !== id));
    }
  };

  // Phase 4: Row action handlers
  const handleEdit = (product) => {
    handleUpdate(product._id);
  };

  const handleQuickEdit = (product) => {
    setQuickEditProduct(product);
    setIsQuickEditOpen(true);
  };

  const handleView = (product) => {
    setSelectedProduct(product);
    setIsInfoModalOpen(true);
  };

  const handleDuplicate = async (product) => {
    try {
      const response = await ProductServices.duplicateProduct(product._id);
      toast.success(t("Product duplicated successfully"));
      setIsUpdate(true); // Trigger refresh via context
    } catch (error) {
      toast.error(error.message || t("Failed to duplicate product"));
    }
  };

  const handleTrash = (product) => {
    handleModalOpen(product._id, showingTranslateValue(product?.title), product);
  };

  const handleQuickEditUpdate = () => {
    setIsUpdate(true); // Trigger refresh via context
  };

  return (
    <>
      {isCheck?.length < 1 && <DeleteModal id={serviceId} title={title} />}

      {isCheck?.length < 2 && (
        <MainDrawer>
          <ProductDrawer currency={currency} id={serviceId} />
        </MainDrawer>
      )}

      {/* Phase 4: Quick Edit Modal */}
      <QuickEditModal
        isOpen={isQuickEditOpen}
        onClose={() => {
          setIsQuickEditOpen(false);
          setQuickEditProduct(null);
        }}
        product={quickEditProduct}
        onUpdate={handleQuickEditUpdate}
      />

      <TableBody>
        {products?.map((product, i) => {
          // Parse tags safely - handle multiple levels of stringification
          const parseTags = (tagData) => {
            if (!tagData) return [];

            // If it's already an array, return it (filter out empty strings)
            if (Array.isArray(tagData)) {
              return tagData.filter(tag => tag && typeof tag === 'string' && tag.trim());
            }

            // If it's a string, try to parse it recursively
            if (typeof tagData === 'string') {
              let current = tagData;
              let attempts = 0;
              const maxAttempts = 10; // Prevent infinite loops

              while (attempts < maxAttempts) {
                try {
                  const parsed = JSON.parse(current);

                  // If we got an array, return it
                  if (Array.isArray(parsed)) {
                    return parsed.filter(tag => tag && typeof tag === 'string' && tag.trim());
                  }

                  // If we got a string, try parsing again
                  if (typeof parsed === 'string') {
                    current = parsed;
                    attempts++;
                    continue;
                  }

                  // If we got something else, wrap it in an array
                  return [parsed].filter(tag => tag && typeof tag === 'string' && tag.trim());
                } catch (e) {
                  // If parsing fails, check if it's a valid tag string
                  if (current.trim() && !current.startsWith('[') && !current.startsWith('"')) {
                    // It's a plain string tag, return it as array
                    return [current.trim()];
                  }
                  // Invalid JSON, return empty array
                  return [];
                }
              }

              // If we've exhausted attempts, return empty array
              return [];
            }

            return [];
          };

          const tags = parseTags(product.tag);

          // Format date
          const formattedDate = product.updatedAt
            ? dayjs(product.updatedAt).format('YYYY/MM/DD [at] h:mm a')
            : product.createdAt
              ? dayjs(product.createdAt).format('YYYY/MM/DD [at] h:mm a')
              : '—';

          // Get categories (show all categories, not just default)
          const categories = product.categories || [];
          const categoryNames = categories.length > 0
            ? categories.map(cat => showingTranslateValue(cat?.name)).join(', ')
            : showingTranslateValue(product?.category?.name) || '—';

          // Stock status
          const stockStatus = product.stock > 0
            ? 'in_stock'
            : product.stock === 0
              ? 'out_of_stock'
              : 'on_backorder';

          return (
            <TableRow key={i + 1} className="group">
              {/* Checkbox */}
              <TableCell className="w-12">
                <CheckBox
                  type="checkbox"
                  name={product?.title?.en}
                  id={product._id}
                  handleClick={handleClick}
                  isChecked={isCheck?.includes(product._id)}
                />
              </TableCell>

              {/* Thumbnail */}
              <TableCell className="w-20 relative">
                <div className="flex items-center justify-center gap-4">
                  {product?.image?.[0] ? (
                    <Avatar
                      className="p-2 bg-gray-50 shadow-none"
                      src={getImageUrl(product.image[0])}
                      alt="product"
                      size="large"
                    />
                  ) : (
                    <Avatar
                      src={`https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png`}
                      alt="product"
                      size="small"
                    />
                  )}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <button
                      type="button"
                      onClick={() => handleView(product)}
                      className="p-1 rounded  transition-colors"
                    >
                      <DotLottieReact
                        src="https://lottie.host/fb33c828-a199-44c1-8201-6399c60dde8b/ovXlMY3Ntd.lottie"
                        loop
                        autoplay
                        className="w-8 h-8 cursor-pointer"
                      />
                    </button>
                  </div>
                </div>
              </TableCell>

              {/* Name with Row Actions */}
              <TableCell className="w-48 min-w-[180px] max-w-[200px]">
                <div className="flex items-center gap-2">
                  <div className="flex-1 min-w-0">
                    <h2
                      className="text-sm font-medium truncate"
                      title={showingTranslateValue(product?.title)}
                    >
                      {showingTranslateValue(product?.title)}
                    </h2>
                    {product.status === 'hide' && (
                      <span className="text-xs text-gray-400 italic">— Draft</span>
                    )}
                  </div>
                  {/* Phase 4: Row Actions Menu */}
                  <div className="opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0">
                    <ProductRowActions
                      product={product}
                      onEdit={() => handleEdit(product)}
                      onQuickEdit={() => handleQuickEdit(product)}
                      onView={() => handleView(product)}
                      onDuplicate={() => handleDuplicate(product)}
                      onTrash={() => handleTrash(product)}
                    />
                    
                  </div>
                </div>
              </TableCell>

              {/* SKU */}
              <TableCell className="w-32 min-w-[100px] max-w-[120px]">
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate block" title={product.sku || '—'}>
                  {product.sku || '—'}
                </span>
              </TableCell>

              {/* Stock */}
              <TableCell className="w-24 min-w-[80px] max-w-[100px]">
                <div className="flex flex-col">
                  <span className="text-sm">{product.stock ?? 0}</span>
                  {stockStatus === 'in_stock' && (
                    <Badge type="success" className="text-xs mt-1">In stock</Badge>
                  )}
                  {stockStatus === 'out_of_stock' && (
                    <Badge type="danger" className="text-xs mt-1">Out of stock</Badge>
                  )}
                  {stockStatus === 'on_backorder' && (
                    <Badge type="warning" className="text-xs mt-1">On backorder</Badge>
                  )}
                </div>
              </TableCell>

              {/* Price */}
              <TableCell className="w-24 min-w-[80px] max-w-[100px]">
                <span className="text-sm font-semibold">
                  {currency}
                  {product?.isCombination
                    ? getNumberTwo(product?.variants[0]?.price || product?.variants[0]?.originalPrice)
                    : getNumberTwo(product?.prices?.price || product?.prices?.originalPrice)}
                </span>
              </TableCell>

              {/* Categories */}
              <TableCell className="w-40 min-w-[120px] max-w-[150px]">
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate block" title={categoryNames}>
                  {categoryNames}
                </span>
              </TableCell>

              {/* Tags */}
              <TableCell className="w-40 min-w-[120px] max-w-[150px]">
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate block" title={tags.length > 0 ? tags.join(', ') : '—'}>
                  {tags.length > 0 ? tags.join(', ') : '—'}
                </span>
              </TableCell>

              {/* Featured (Star Icon) */}
              <TableCell className="w-16 text-center">
                {product.isFeatured ? (
                  <FiStar className="w-5 h-5 text-yellow-400 fill-current mx-auto" />
                ) : (
                  <FiStar className="w-5 h-5 text-gray-300 mx-auto" />
                )}
              </TableCell>

              {/* Date (Last Modified) */}
              <TableCell className="w-40 min-w-[140px] max-w-[160px]">
                <span className="text-sm text-gray-600 dark:text-gray-400 truncate block" title={`Last Modified ${formattedDate}`}>
                  Last Modified {formattedDate}
                </span>
              </TableCell>

              {/* Brands */}
              <TableCell className="w-32 min-w-[100px] max-w-[120px]">
                {product.brand?._id ? (
                  <Link
                    to={`/brands/${product.brand._id}`}
                    className="text-sm text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 truncate block hover:underline"
                    title={product.brand.name}
                  >
                    {product.brand.name}
                  </Link>
                ) : (
                  <span className="text-sm text-gray-600 dark:text-gray-400 truncate block" title="—">
                    —
                  </span>
                )}
              </TableCell>

              {/* Phase 6: Statistics */}
              <TableCell className="w-24 min-w-[80px] max-w-[100px]">
                <div className="flex flex-col text-xs">
                  <span className="text-gray-600 dark:text-gray-400">
                    Views: {product.views || 0}
                  </span>
                  <span className="text-gray-600 dark:text-gray-400">
                    Sales: {product.sales || 0}
                  </span>
                </div>
              </TableCell>

              {/* Actions */}
              <TableCell className="w-20 text-right">
                <EditDeleteButton
                  id={product._id}
                  product={product}
                  isCheck={isCheck}
                  handleUpdate={handleUpdate}
                  handleModalOpen={handleModalOpen}
                  title={showingTranslateValue(product?.title)}
                />
              </TableCell>
            </TableRow>
          );
        })}
      </TableBody>

      {/* Product Info Modal */}
      <ProductInfoModal
        product={selectedProduct}
        isOpen={isInfoModalOpen}
        onClose={() => {
          setIsInfoModalOpen(false);
          setSelectedProduct(null);
        }}
      />
    </>
  );
};

export default ProductTable;
