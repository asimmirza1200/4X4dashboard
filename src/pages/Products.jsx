import React, { useContext, useState, useEffect, useMemo } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Select,
  Input,
  Button,
  Card,
  CardBody,
  Pagination,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiPlus, FiChevronUp, FiChevronDown, FiDownload } from "react-icons/fi";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import exportFromJSON from "export-from-json";

//internal import

import useAsync from "@/hooks/useAsync";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import usePermissions from "@/hooks/usePermissions";
import NotFound from "@/components/table/NotFound";
import ProductServices from "@/services/ProductServices";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import ProductTable from "@/components/product/ProductTable";
import MainDrawer from "@/components/drawer/MainDrawer";
import ProductDrawer from "@/components/drawer/ProductDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import useProductFilter from "@/hooks/useProductFilter";
import DeleteModal from "@/components/modal/DeleteModal";
import BulkActionDrawer from "@/components/drawer/BulkActionDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import SelectCategory from "@/components/form/selectOption/SelectCategory";
import SelectProductType from "@/components/form/selectOption/SelectProductType";
import SelectStockStatus from "@/components/form/selectOption/SelectStockStatus";
import SelectBrandFilter from "@/components/form/selectOption/SelectBrandFilter";
import SelectSEORank from "@/components/form/selectOption/SelectSEORank";
import AnimatedContent from "@/components/common/AnimatedContent";
import BulkActionsDropdown from "@/components/product/BulkActionsDropdown";
import ProductCardMobile from "@/components/product/ProductCardMobile";
import FiltersDrawer from "@/components/product/FiltersDrawer";
import PermissionWrapper from "@/components/auth/PermissionWrapper";
import { FiFilter } from "react-icons/fi";

const Products = () => {
  const { title, allId, serviceId, handleDeleteMany, handleUpdateMany, handleUpdate } =
    useToggleDrawer();

  const { t } = useTranslation();
  const { can } = usePermissions();
  const {
    toggleDrawer,
    lang,
    currentPage,
    handleChangePage,
    searchText,
    category,
    setCategory,
    searchRef,
    handleSubmitForAll,
    sortedField,
    setSortedField,
    limitData,
    isUpdate,
    setIsUpdate,
    toggleBulkDrawer,
    windowDimension,
    isDrawerOpen,
  } = useContext(SidebarContext);

  // Phase 7: Check if mobile view
  const isMobile = windowDimension <= 768;

  // Phase 3: Status tabs and filters state - empty by default
  const [status, setStatus] = useState("all");
  const [productType, setProductType] = useState("");
  const [stockStatus, setStockStatus] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  // Phase 6: SEO Rank filter (placeholder for Rank Math integration)
  const [seoRank, setSEORank] = useState("");

  // Phase 2: Sorting state - must be declared before apiParams
  const [sortBy, setSortBy] = useState('date'); // Default: date
  const [sortDir, setSortDir] = useState('desc'); // Default: descending

  // Reset to page 1 when drawer closes after adding product (to see new product)
  useEffect(() => {
    if (!isDrawerOpen && isUpdate && currentPage !== 1) {
      // Reset to first page to see the newly added product
      handleChangePage(1);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isDrawerOpen, isUpdate]);

  // Phase 3: Fetch status counts for tabs
  const { data: statusCounts } = useAsync(() =>
    ProductServices.getProductStatusCounts()
  );

  // Build API params
  // Handle sortedField (old price filter) - map to sortBy/sortDir or price parameter
  let effectiveSortBy = sortBy;
  let effectiveSortDir = sortDir;
  let priceParam = null;

  // If sortedField is set and it's a price-related value, use it instead of sortBy
  if (sortedField && sortedField !== "All") {
    if (sortedField === "low") {
      // Low to High = price ascending
      effectiveSortBy = "price";
      effectiveSortDir = "asc";
    } else if (sortedField === "high") {
      // High to Low = price descending
      effectiveSortBy = "price";
      effectiveSortDir = "desc";
    } else {
      // Other sortedField values (published, unPublished, etc.) use the old price parameter
      priceParam = sortedField;
    }
  }

  const apiParams = {
    page: currentPage,
    limit: limitData,
    category: category || "",
    title: searchText || "",
    search: searchText || "", // Enhanced search (name, SKU, description)
    sort_by: effectiveSortBy || "",
    sort_dir: effectiveSortDir || "",
    status: status || "all", // Phase 3: Status filter
    product_type: productType || "", // Phase 3: Product type filter
    stock_status: stockStatus || "", // Phase 3: Stock status filter
    brand: selectedBrand || "", // Phase 3: Brand filter
  };

  // Send price parameter for non-price sorting options (published, unPublished, etc.)
  if (priceParam) {
    apiParams.price = priceParam;
  }

  const { data, loading, error } = useAsync(() =>
    ProductServices.getAllProducts(apiParams),
    [
      currentPage,
      limitData,
      category,
      searchText,
      sortedField,
      sortBy,
      sortDir,
      status,
      productType,
      stockStatus,
      selectedBrand,
      isUpdate, // Add isUpdate to trigger refetch when product is added/updated
    ]
  );

  // react hooks
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  // Debug: Log data structure
  // console.log("product page data:", data);
  // console.log("product page data.products:", data?.products);
  // console.log("product page serviceData:", serviceData);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data?.products.map((li) => li._id));
    if (isCheckAll) {
      setIsCheck([]);
    }
  };
  // handle reset field
  const handleResetField = () => {
    setCategory("");
    setSortedField("");
    setSortBy('date');
    setSortDir('desc');
    setStatus('all');
    setProductType("");
    setStockStatus("");
    setSelectedBrand("");
    searchRef.current.value = "";
  };

  // Handle column sorting
  const handleSort = (column) => {
    // Clear sortedField when using column header sorting
    if (sortedField && sortedField !== "All") {
      setSortedField("All");
    }
    if (sortBy === column) {
      // Toggle direction if same column
      setSortDir(sortDir === 'asc' ? 'desc' : 'asc');
    } else {
      // New column, default to ascending
      setSortBy(column);
      setSortDir('asc');
    }
  };

  // Get sort icon for column
  const getSortIcon = (column) => {
    if (sortBy !== column) {
      return <FiChevronUp className="w-4 h-4 text-gray-400 opacity-50" />;
    }
    return sortDir === 'asc'
      ? <FiChevronUp className="w-4 h-4 text-emerald-600" />
      : <FiChevronDown className="w-4 h-4 text-emerald-600" />;
  };

  // Phase 6: Export state
  const [loadingExport, setLoadingExport] = useState({
    type: "",
    status: false,
  });

  // Phase 7: Mobile filters drawer state
  const [isFiltersDrawerOpen, setIsFiltersDrawerOpen] = useState(false);
  
  // Import section state
  const [isImportBoxShown, setIsImportBoxShown] = useState(false);

  // console.log('productss',products)
  const {
    serviceData,
    filename,
    isDisabled,
    handleSelectFile,
    handleUploadMultiple,
    handleRemoveSelectFile,
  } = useProductFilter(data?.products || []);

  // Use serviceData if available, otherwise fallback to data?.products
  const displayProducts = useMemo(() => {
    if (serviceData && Array.isArray(serviceData) && serviceData.length > 0) {
      return serviceData;
    }
    if (data?.products && Array.isArray(data.products)) {
      return data.products;
    }
    return [];
  }, [serviceData, data?.products]);

  // Phase 6: Handle Export (CSV, JSON, Template)
  const handleExport = async (exportType) => {
    if (!data?.products || data.products.length === 0) {
      toast.error(t("No products to export"));
      return;
    }

    try {
      setLoadingExport({ type: exportType, status: true });

      if (exportType === "template") {
        // Download CSV Template
        const templateData = [
          {
            "ID": "unique-product-id",
            "Name": "Sample Product",
            "Description": "Product description goes here",
            "SKU": "SKU001",
            "Weight": "1.5",
            "Brand": "Brand",
            "Tags": "tag1|tag2|tag3",
            "Images": "image1.jpg|image2.jpg",
            "Price": "100.00",
            "Status": "Published",
            "Stock": "10",
            "Featured": "Yes",
            "Date Modified": new Date().toISOString().split('T')[0]
          }
        ];

        exportFromJSON({
          data: templateData,
          fileName: "product-import-template",
          exportType: exportFromJSON.types.csv,
        });
        toast.success(t("Template downloaded successfully"));
        setLoadingExport({ type: "", status: false });
        return;
      }

      // For CSV and JSON, get all products with current filters
      const response = await ProductServices.getAllProducts({
        page: 1,
        limit: data?.totalDoc || 10000,
        category: category || null,
        title: searchText || null,
        price: 0,
        search: searchText,
        status: status === "all" ? undefined : status,
        product_type: productType || undefined,
        stock_status: stockStatus || undefined,
        brand: selectedBrand || undefined,
        sort_by: sortBy,
        sort_dir: sortDir,
      });

      const products = response.products || [];
     console.log("products", products)
      if (exportType === "csv") {
        // Use backend CSV export if available, otherwise use client-side
        try {
          const csvResponse = await ProductServices.exportProductsToCSV({
            search: searchText,
            status: status,
            category: category,
            product_type: productType,
            stock_status: stockStatus,
            brand: selectedBrand,
            sort_by: sortBy,
            sort_dir: sortDir,
          });
          console.log("csvResponse", csvResponse)
          const blob = new Blob([csvResponse.data], { type: 'text/csv;charset=utf-8;' });
          const link = document.createElement('a');
          const url = URL.createObjectURL(blob);
          link.setAttribute('href', url);

          const now = new Date();
          const dateStr = now.toISOString().split('T')[0].replace(/-/g, '');
          const timeStr = now.toTimeString().split(' ')[0].replace(/:/g, '');
          link.setAttribute('download', `products_export_${dateStr}_${timeStr}.csv`);

          link.style.visibility = 'hidden';
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
        } catch (csvError) {
          // Fallback to client-side export with export format
          const transformedProducts = products.map(product => ({
            "ID": product._id || product.productId || "",
            "Name": product.title?.en || product.title || "",
            "Description": product.description?.en || product.description || "",
            "SKU": product.sku || "",
            "Weight": product.weight || "",
            "Brand": product.brand|| "",
            "Tags": product.tag ? product.tag.join("|") : "",
            "Images": product.image ? product.image.join("|") : "",
            "Price": product.prices?.price || product.prices?.originalPrice || "",
            "Status": product.status === "show" ? "Published" : "Draft",
            "Stock": product.stock || 0,
            "Featured": product.isFeatured ? "Yes" : "No",
            "Date Modified": product.updatedAt ? new Date(product.updatedAt).toISOString().split('T')[0] : new Date().toISOString().split('T')[0]
          }));
          
          exportFromJSON({
            data: transformedProducts,
            fileName: "products",
            exportType: exportFromJSON.types.csv,
          });
        }
        toast.success(t("Products exported to CSV successfully"));
      } else if (exportType === "json") {
        exportFromJSON({
          data: products,
          fileName: "products",
          exportType: exportFromJSON.types.json,
        });
        toast.success(t("Products exported to JSON successfully"));
      }

      setLoadingExport({ type: "", status: false });
    } catch (error) {
      toast.error(error.message || t("Failed to export products"));
      setLoadingExport({ type: "", status: false });
    }
  };

  // Phase 7: Row action handlers for mobile cards
  const handleEdit = (product) => {
    // Opens ProductDrawer for editing
    handleUpdate(product._id);
  };

  const handleQuickEdit = (product) => {
    // For mobile, open full drawer instead of quick edit modal
    handleUpdate(product._id);
  };

  const handleView = (product) => {
    const websiteBaseUrl = process.env.REACT_APP_WEBSITE_URL || "http://localhost:3000";
    if (product.slug) {
      const productUrl = `${websiteBaseUrl}/product/${product.slug}`;
      window.open(productUrl, "_blank");
    } else {
      toast.error(t("Product slug not found"));
    }
  };

  const handleDuplicate = async (product) => {
    try {
      await ProductServices.duplicateProduct(product._id);
      toast.success(t("Product duplicated successfully"));
      setIsUpdate(true);
    } catch (error) {
      toast.error(error.message || t("Failed to duplicate product"));
    }
  };

  const handleTrash = (product) => {
    handleDeleteMany([product._id], [product]);
  };

  return (
    <>
      <PageTitle>{t("ProductsPage")}</PageTitle>
      <DeleteModal ids={allId} setIsCheck={setIsCheck} title={title} />
      <BulkActionDrawer ids={allId} title="Products" />
      <MainDrawer>
        <ProductDrawer id={serviceId} />
      </MainDrawer>
      <AnimatedContent>
        {/* Phase 3: Status Tabs - Phase 7: Mobile Responsive */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <div className="flex flex-wrap gap-2 border-b border-gray-200 dark:border-gray-700 overflow-x-auto">
              <button
                type="button"
                onClick={() => setStatus("all")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors touch-manipulation min-h-[44px] ${status === "all"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
              >
                {t("All")} ({statusCounts?.all || 0})
              </button>
              <button
                type="button"
                onClick={() => setStatus("published")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors touch-manipulation min-h-[44px] ${status === "published"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
              >
                {t("Published")} ({statusCounts?.published || 0})
              </button>
              <button
                type="button"
                onClick={() => setStatus("drafts")}
                className={`px-3 sm:px-4 py-2 text-xs sm:text-sm font-medium border-b-2 transition-colors touch-manipulation min-h-[44px] ${status === "drafts"
                  ? "border-emerald-600 text-emerald-600"
                  : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                  }`}
              >
                {t("Drafts")} ({statusCounts?.drafts || 0})
              </button>
            </div>
          </CardBody>
        </Card>

        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody className="">
            <form
              onSubmit={handleSubmitForAll}
              className="py-3 md:pb-0 grid gap-4 lg:gap-6 xl:gap-6 xl:flex"
            >
              <div className="flex-grow-0 sm:flex-grow md:flex-grow lg:flex-grow xl:flex-grow">
                {/* Import functionality only - export removed */}
                <div className="flex flex-col">
                  <PermissionWrapper permission="upload_csv">
                    <button
                      onClick={() => setIsImportBoxShown(!isImportBoxShown)}
                      className="border flex justify-center items-center h-10 w-20 hover:text-yellow-400 border-gray-300 dark:text-gray-300 cursor-pointer py-2 hover:border-yellow-400 rounded-md focus:outline-none"
                    >
                      <FiDownload className="mr-2" />
                      <span className="text-xs">{t("Import")}</span>
                    </button>
                    {/* Import box */}
                    {isImportBoxShown && (
                      <div className="w-full my-2 lg:my-0 md:my-0 flex flex-col sm:flex-row gap-2">
                        <div className="h-10 border border-dashed border-emerald-500 rounded-md flex-1">
                          <label htmlFor="import-file-input" className="w-full rounded-lg h-10 flex justify-center items-center text-xs dark:text-gray-400 leading-none cursor-pointer">
                            <Input
                              disabled={isDisabled}
                              type="file"
                              accept=".csv,.xls,.json"
                              onChange={handleSelectFile}
                              className="hidden"
                              id="import-file-input"
                            />
                            {filename ? (
                              <span className="px-2">{filename}</span>
                            ) : (
                              <span className="mx-2 text-emerald-500 text-lg dark:text-gray-400">
                                {t("SelectYourJSON/CSV")} {t("File")}
                              </span>
                            )}
                          </label>
                        </div>
                        {filename && (
                          <button
                            onClick={handleRemoveSelectFile}
                            className="text-red-500 hover:text-red-700 text-lg px-2"
                            type="button"
                          >
                            ×
                          </button>
                        )}
                        <Button
                          onClick={handleUploadMultiple}
                          className="h-10 px-4"
                          disabled={!filename}
                        >
                          <span className="text-xs">{t("ImportNow")}</span>
                        </Button>
                      </div>
                    )}
                  </PermissionWrapper>
                </div>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                {/* Phase 5: Bulk Actions Dropdown */}
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <BulkActionsDropdown
                    selectedIds={isCheck}
                    onRefresh={() => {
                      setIsCheck([]);
                      setIsUpdate(true);
                    }}
                    onOpenBatchEdit={() => {
                      handleUpdateMany(isCheck);
                    }}
                  />
                </div>
                {/* Phase 6: Export Dropdown - CSV, JSON, Template */}
                <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                  <select
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value) {
                        handleExport(value);
                        e.target.value = ""; // Reset to default
                      }
                    }}
                    disabled={loadingExport.status || !data?.products || data?.products.length === 0}
                    defaultValue=""
                    className="w-full min-h-[48px] px-4 pr-10 text-sm border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 disabled:opacity-50 disabled:cursor-not-allowed appearance-none cursor-pointer"
                    style={{
                      backgroundImage: `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' fill='none' viewBox='0 0 20 20'%3E%3Cpath stroke='%236b7280' stroke-linecap='round' stroke-linejoin='round' stroke-width='1.5' d='M6 8l4 4 4-4'/%3E%3C/svg%3E")`,
                      backgroundPosition: 'right 0.5rem center',
                      backgroundRepeat: 'no-repeat',
                      backgroundSize: '1.5em 1.5em',
                      paddingRight: '2.5rem',
                    }}
                  >
                    <option value="" disabled>
                      {loadingExport.status
                        ? `${t("Exporting")}...`
                        : t("Export")}
                    </option>
                    <option value="csv">
                      {t("Export to CSV")}
                    </option>
                    <option value="json">
                      {t("Export to JSON")}
                    </option>
                    <option value="template">
                      {t("Download CSV Template")}
                    </option>
                  </select>
                </div>
                <PermissionWrapper permission="add_products">
                  <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                    <Button
                      onClick={toggleDrawer}
                      className="w-full rounded-md h-12 min-h-[48px] touch-manipulation"
                    >
                      <span className="mr-2">
                        <FiPlus />
                      </span>
                      {t("AddProduct")}
                    </Button>
                  </div>
                </PermissionWrapper>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 rounded-t-lg rounded-0 mb-4">
          <CardBody>
            <form
              onSubmit={handleSubmitForAll}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  ref={searchRef}
                  type="search"
                  name="search"
                  placeholder="Search products (name, SKU, description)"
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-5 mr-1"
                ></button>
              </div>

              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <SelectCategory setCategory={setCategory} lang={lang} />
              </div>

              {/* Phase 3: Product Type Filter */}
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <SelectProductType
                  setProductType={setProductType}
                  selectedProductType={productType}
                />
              </div>

              {/* Phase 3: Stock Status Filter */}
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <SelectStockStatus
                  setStockStatus={setStockStatus}
                  selectedStockStatus={stockStatus}
                />
              </div>

              {/* Phase 3: Brand Filter */}
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <SelectBrandFilter
                  setBrand={setSelectedBrand}
                  selectedBrand={selectedBrand}
                />
              </div>

              {/* Phase 6: SEO Rank Filter (Rank Math placeholder) */}
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <SelectSEORank
                  setSEORank={setSEORank}
                  selectedSEORank={seoRank}
                />
              </div>

              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Select
                  value={sortedField || "All"}
                  onChange={(e) => {
                    const value = e.target.value;
                    setSortedField(value);
                    // Clear sortBy/sortDir when using price filter dropdown (low/high)
                    if (value === "low" || value === "high") {
                      setSortBy('date'); // Reset to default
                      setSortDir('desc');
                    }
                  }}
                >
                  <option value="All" hidden>
                    {t("Price")}
                  </option>
                  <option value="low">{t("LowtoHigh")}</option>
                  <option value="high">{t("HightoLow")}</option>
                  <option value="published">{t("Published")}</option>
                  <option value="unPublished">{t("Unpublished")}</option>
                  <option value="status-selling">{t("StatusSelling")}</option>
                  <option value="status-out-of-stock">
                    {t("StatusStock")}
                  </option>
                  <option value="date-added-asc">{t("DateAddedAsc")}</option>
                  <option value="date-added-desc">{t("DateAddedDesc")}</option>
                  <option value="date-updated-asc">
                    {t("DateUpdatedAsc")}
                  </option>
                  <option value="date-updated-desc">
                    {t("DateUpdatedDesc")}
                  </option>
                </Select>
              </div>
              <div className="flex items-center gap-2 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <div className="w-full mx-1">
                  <Button type="submit" className="h-12 w-full bg-emerald-700">
                    Filter
                  </Button>
                </div>

                <div className="w-full mx-1">
                  <Button
                    layout="outline"
                    onClick={handleResetField}
                    type="reset"
                    className="px-4 md:py-1 py-2 h-12 text-sm dark:bg-gray-700"
                  >
                    <span className="text-black dark:text-gray-200">Reset</span>
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Phase 7: Mobile Search Bar */}
        <Card className="lg:hidden min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-4">
          <CardBody>
            <form onSubmit={handleSubmitForAll} className="flex gap-2">
              <div className="flex-1">
                <Input
                  ref={searchRef}
                  type="search"
                  name="search"
                  placeholder="Search products..."
                  className="h-12 min-h-[48px] text-base"
                />
              </div>
              <Button
                type="button"
                onClick={() => setIsFiltersDrawerOpen(true)}
                className="h-12 min-h-[48px] px-4 bg-emerald-600 min-w-[60px] touch-manipulation"
                aria-label="Open filters"
              >
                <FiFilter className="w-5 h-5" />
              </Button>
            </form>
          </CardBody>
        </Card>

        {/* Phase 7: Mobile Filters Drawer */}
        <FiltersDrawer
          isOpen={isFiltersDrawerOpen}
          onClose={() => setIsFiltersDrawerOpen(false)}
          onOpen={() => setIsFiltersDrawerOpen(true)}
          lang={lang}
          searchRef={searchRef}
          handleSubmitForAll={handleSubmitForAll}
          category={category}
          setCategory={setCategory}
          productType={productType}
          setProductType={setProductType}
          stockStatus={stockStatus}
          setStockStatus={setStockStatus}
          selectedBrand={selectedBrand}
          setSelectedBrand={setSelectedBrand}
          seoRank={seoRank}
          setSEORank={setSEORank}
          sortedField={sortedField}
          setSortedField={setSortedField}
          handleResetField={handleResetField}
          setSortBy={setSortBy}
          setSortDir={setSortDir}
          t={t}
        />
      </AnimatedContent>

      {loading ? (
        <TableLoading row={12} col={7} width={160} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : displayProducts && displayProducts.length > 0 ? (
        <>
          {/* Phase 7: Desktop Table View - Hidden on Mobile */}
          <div className="hidden lg:block">
            <TableContainer className="mb-8 rounded-b-lg overflow-x-auto">
              <Table className="min-w-full table-fixed">
                <TableHeader>
                  <tr>
                    <TableCell className="w-12">
                      <CheckBox
                        type="checkbox"
                        name="selectAll"
                        id="selectAll"
                        isChecked={isCheckAll}
                        handleClick={handleSelectAll}
                      />
                    </TableCell>
                    <TableCell className="w-16">{t("Thumbnail")}</TableCell>
                    <TableCell className="w-48 min-w-[180px] max-w-[200px]">
                      <button
                        type="button"
                        onClick={() => handleSort('name')}
                        className="flex items-center gap-1 hover:text-emerald-600"
                      >
                        {t("ProductNameTbl")}
                        {getSortIcon('name')}
                      </button>
                    </TableCell>
                    <TableCell className="w-32 min-w-[100px] max-w-[120px]">
                      <button
                        type="button"
                        onClick={() => handleSort('sku')}
                        className="flex items-center gap-1 hover:text-emerald-600"
                      >
                        {t("SKU")}
                        {getSortIcon('sku')}
                      </button>
                    </TableCell>
                    <TableCell className="w-24 min-w-[80px] max-w-[100px]">
                      <button
                        type="button"
                        onClick={() => handleSort('stock')}
                        className="flex items-center gap-1 hover:text-emerald-600"
                      >
                        {t("StockTbl")}
                        {getSortIcon('stock')}
                      </button>
                    </TableCell>
                    <TableCell className="w-24 min-w-[80px] max-w-[100px]">
                      <button
                        type="button"
                        onClick={() => handleSort('price')}
                        className="flex items-center gap-1 hover:text-emerald-600"
                      >
                        {t("PriceTbl")}
                        {getSortIcon('price')}
                      </button>
                    </TableCell>
                    <TableCell className="w-40 min-w-[120px] max-w-[150px]">{t("CategoryTbl")}</TableCell>
                    <TableCell className="w-40 min-w-[120px] max-w-[150px]">{t("Tags")}</TableCell>
                    <TableCell className="w-16 text-center">{t("Featured")}</TableCell>
                    <TableCell className="w-40 min-w-[140px] max-w-[160px]">
                      <button
                        type="button"
                        onClick={() => handleSort('date')}
                        className="flex items-center gap-1 hover:text-emerald-600"
                      >
                        {t("Date")}
                        {getSortIcon('date')}
                      </button>
                    </TableCell>
                    <TableCell className="w-32 min-w-[100px] max-w-[120px]">
                      <button
                        type="button"
                        onClick={() => handleSort('brand')}
                        className="flex items-center gap-1 hover:text-emerald-600"
                      >
                        {t("Brands")}
                        {getSortIcon('brand')}
                      </button>
                    </TableCell>
                    {/* Phase 6: Statistics Column */}
                    <TableCell className="w-24 min-w-[80px] max-w-[100px]">{t("Statistics")}</TableCell>
                    <TableCell className="w-20 text-right">{t("ActionsTbl")}</TableCell>
                  </tr>
                </TableHeader>
                <ProductTable
                  lang={lang}
                  isCheck={isCheck}
                  products={data?.products}
                  setIsCheck={setIsCheck}
                />
              </Table>
              <TableFooter>
                <Pagination
                  totalResults={data?.totalDoc}
                  resultsPerPage={limitData}
                  onChange={handleChangePage}
                  label="Product Page Navigation"
                />
              </TableFooter>
            </TableContainer>
          </div>

          {/* Phase 7: Mobile Card View - Visible on Mobile Only */}
          <div className="lg:hidden">
            <div className="mb-4">
              {/* Mobile Select All */}
              <div className="flex items-center justify-between mb-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                <CheckBox
                  type="checkbox"
                  name="selectAll"
                  id="selectAll"
                  isChecked={isCheckAll}
                  handleClick={handleSelectAll}
                />
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {isCheck.length > 0 && `${isCheck.length} selected`}
                </span>
              </div>

              {/* Product Cards */}
              <div className="space-y-4">
                {data?.products?.map((product) => (
                  <ProductCardMobile
                    key={product._id}
                    product={product}
                    isCheck={isCheck}
                    setIsCheck={setIsCheck}
                    onEdit={handleEdit}
                    onQuickEdit={handleQuickEdit}
                    onView={handleView}
                    onDuplicate={handleDuplicate}
                    onTrash={handleTrash}
                  />
                ))}
              </div>
            </div>

            {/* Mobile Pagination */}
            <div className="flex justify-center mt-6">
              <Pagination
                totalResults={data?.totalDoc}
                resultsPerPage={limitData}
                onChange={handleChangePage}
                label="Product Page Navigation"
              />
            </div>
          </div>
        </>
      ) : (
        <NotFound title="Product" />
      )}
    </>
  );
};

export default Products;
