import React from "react";
import { Card, CardBody, Badge, Avatar } from "@windmill/react-ui";
import { FiStar } from "react-icons/fi";
import { Link } from "react-router-dom";
import dayjs from "dayjs";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import ProductRowActions from "@/components/product/ProductRowActions";
import CheckBox from "@/components/form/others/CheckBox";
import { getImageUrl } from "@/utils/getImageUrl";

const ProductCardMobile = ({
    product,
    isCheck,
    setIsCheck,
    onEdit,
    onQuickEdit,
    onView,
    onDuplicate,
    onTrash,
}) => {
    const { showingTranslateValue, getNumberTwo, currency } = useUtilsFunction();

    const handleClick = (e) => {
        const { id, checked } = e.target;
        setIsCheck([...isCheck, id]);
        if (!checked) {
            setIsCheck(isCheck.filter((item) => item !== id));
        }
    };

    // Format date
    const formattedDate = product.updatedAt
        ? dayjs(product.updatedAt).format("YYYY/MM/DD [at] h:mm a")
        : product.createdAt
            ? dayjs(product.createdAt).format("YYYY/MM/DD [at] h:mm a")
            : "—";

    // Get categories
    const categories = product.categories || [];
    const categoryNames =
        categories.length > 0
            ? categories.map((cat) => showingTranslateValue(cat?.name)).join(", ")
            : showingTranslateValue(product?.category?.name) || "—";

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

    // Stock status
    const stockStatus =
        product.stock > 0
            ? "in_stock"
            : product.stock === 0
                ? "out_of_stock"
                : "on_backorder";

    return (
        <Card className="mb-4">
            <CardBody>
                <div className="flex items-start gap-3">
                    {/* Checkbox */}
                    <div className="pt-1 touch-manipulation">
                        <CheckBox
                            type="checkbox"
                            name={product?.title?.en}
                            id={product._id}
                            handleClick={handleClick}
                            isChecked={isCheck?.includes(product._id)}
                        />
                    </div>

                    {/* Thumbnail */}
                    <div className="flex-shrink-0">
                        {product?.image?.[0] ? (
                            <Avatar
                                className="p-1 bg-gray-50 shadow-none"
                                src={getImageUrl(product.image[0])}
                                alt="product"
                                size="regular"
                            />
                        ) : (
                            <Avatar
                                src={`https://res.cloudinary.com/ahossain/image/upload/v1655097002/placeholder_kvepfp.png`}
                                alt="product"
                                size="regular"
                            />
                        )}
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0">
                        {/* Name and Actions */}
                        <div className="flex items-start justify-between gap-2 mb-2">
                            <div className="flex-1 min-w-0">
                                <h3 className="text-sm font-semibold text-gray-900 dark:text-gray-100 truncate">
                                    {showingTranslateValue(product?.title)}
                                </h3>
                                {product.status === "hide" && (
                                    <span className="text-xs text-gray-400 italic">— Draft</span>
                                )}
                            </div>
                            <div className="flex items-center gap-2 flex-shrink-0 touch-manipulation">
                                {product.isFeatured && (
                                    <FiStar className="w-4 h-4 text-yellow-400 fill-current" />
                                )}
                                <ProductRowActions
                                    product={product}
                                    onEdit={() => onEdit(product)}
                                    onQuickEdit={() => onQuickEdit(product)}
                                    onView={() => onView(product)}
                                    onDuplicate={() => onDuplicate(product)}
                                    onTrash={() => onTrash(product)}
                                />
                            </div>
                        </div>

                        {/* SKU and Brand */}
                        <div className="flex flex-wrap gap-3 text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {product.sku && (
                                <span>
                                    <strong>SKU:</strong> {product.sku}
                                </span>
                            )}
                            {product.brand?.name && (
                                <span>
                                    <strong>Brand:</strong>{" "}
                                    {product.brand._id ? (
                                        <Link
                                            to={`/brands/${product.brand._id}`}
                                            className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-400 dark:hover:text-emerald-300 hover:underline"
                                        >
                                            {product.brand.name}
                                        </Link>
                                    ) : (
                                        product.brand.name
                                    )}
                                </span>
                            )}
                        </div>

                        {/* Stock and Price */}
                        <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center gap-2">
                                <span className="text-sm font-medium">
                                    Stock: {product.stock ?? 0}
                                </span>
                                {stockStatus === "in_stock" && (
                                    <Badge type="success" className="text-xs">
                                        In stock
                                    </Badge>
                                )}
                                {stockStatus === "out_of_stock" && (
                                    <Badge type="danger" className="text-xs">
                                        Out of stock
                                    </Badge>
                                )}
                                {stockStatus === "on_backorder" && (
                                    <Badge type="warning" className="text-xs">
                                        On backorder
                                    </Badge>
                                )}
                            </div>
                            <div className="text-sm font-semibold">
                                {currency}
                                {product?.isCombination
                                    ? getNumberTwo(
                                        product?.variants[0]?.price ||
                                        product?.variants[0]?.originalPrice
                                    )
                                    : getNumberTwo(
                                        product?.prices?.price || product?.prices?.originalPrice
                                    )}
                            </div>
                        </div>

                        {/* Categories and Tags */}
                        <div className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                            {categoryNames !== "—" && (
                                <div className="mb-1">
                                    <strong>Categories:</strong> {categoryNames}
                                </div>
                            )}
                            {tags.length > 0 && (
                                <div>
                                    <strong>Tags:</strong> {tags.join(", ")}
                                </div>
                            )}
                        </div>

                        {/* Statistics */}
                        <div className="flex items-center gap-4 text-xs text-gray-600 dark:text-gray-400 mb-2">
                            <span>
                                <strong>Views:</strong> {product.views || 0}
                            </span>
                            <span>
                                <strong>Sales:</strong> {product.sales || 0}
                            </span>
                        </div>

                        {/* Date */}
                        <div className="text-xs text-gray-500 dark:text-gray-400">
                            Last Modified {formattedDate}
                        </div>
                    </div>
                </div>
            </CardBody>
        </Card>
    );
};

export default ProductCardMobile;

