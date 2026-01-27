import {
  Button,
  Card,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import { useContext, useState, useEffect, useRef } from "react";
import { IoCloudDownloadOutline } from "react-icons/io5";
import { FiFilter, FiX } from "react-icons/fi";
import { useTranslation } from "react-i18next";

// Internal imports
import { notifyError, notifySuccess } from "@/utils/toast";
import useAsync from "@/hooks/useAsync";
import OrderServices from "@/services/OrderServices";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import TableLoading from "@/components/preloader/TableLoading";
import spinnerLoadingImage from "@/assets/img/spinner.gif";
import useUtilsFunction from "@/hooks/useUtilsFunction";
import AnimatedContent from "@/components/common/AnimatedContent";

// OMS Components
import OrderQuickView from "@/components/oms/OrderQuickView";
import BulkActionsDropdown from "@/components/oms/BulkActionsDropdown";
import DateRangeFilter from "@/components/oms/DateRangeFilter";
import CustomerFilter from "@/components/oms/CustomerFilter";
import StatusFilter from "@/components/oms/StatusFilter";
import OriginFilter from "@/components/oms/OriginFilter";
import OMSTable from "@/components/oms/OMSTable";

const Orders = () => {
  const { t } = useTranslation();
  const {
    currentPage,
    setCurrentPage,
    handleChangePage,
    resultsPerPage,
    isUpdate,
    setIsUpdate,
  } = useContext(SidebarContext);

  // State management
  const [activeTab, setActiveTab] = useState("All"); // All, Completed, Refunded
  const [selectedOrders, setSelectedOrders] = useState([]);
  const [quickViewOrder, setQuickViewOrder] = useState(null);
  const [isQuickViewOpen, setIsQuickViewOpen] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [loadingExport, setLoadingExport] = useState(false);

  // Filter states
  const [filters, setFilters] = useState({
    search: "",
    customer: "",
    status: "",
    origin: "",
    startDate: "",
    endDate: "",
    method: "",
  });

  // Sorting state
  const [sorting, setSorting] = useState({
    sortBy: "date",
    sortOrder: "desc",
  });

  const searchRef = useRef(null);

  // Build API params
  const buildApiParams = () => {
    const params = {
      page: currentPage,
      limit: resultsPerPage || 50,
    };

    // Tab-based status filter
    if (activeTab === "Completed") {
      params.status = "Completed";
    } else if (activeTab === "Refunded") {
      params.status = "Refunded";
    } else if (filters.status) {
      params.status = filters.status;
    }

    // Other filters
    if (filters.search) params.search = filters.search;
    if (filters.customer) params.customer = filters.customer;
    if (filters.origin) params.origin = filters.origin;
    if (filters.startDate) params.startDate = filters.startDate;
    if (filters.endDate) params.endDate = filters.endDate;
    if (filters.method) params.method = filters.method;

    // Sorting
    if (sorting.sortBy) {
      params.sortBy =
        sorting.sortBy === "date"
          ? "date"
          : sorting.sortBy === "total"
          ? "total"
          : "orderId";
      params.sortOrder = sorting.sortOrder;
    }

    return params;
  };

  // Fetch orders - useAsync will refetch when dependencies change
  const { data, loading, error } = useAsync(
    () => OrderServices.getAllOrders(buildApiParams()),
    [
      activeTab,
      currentPage,
      filters.search,
      filters.customer,
      filters.status,
      filters.origin,
      filters.startDate,
      filters.endDate,
      filters.method,
      sorting.sortBy,
      sorting.sortOrder,
      resultsPerPage,
      isUpdate,
    ]
  );

  // Reset selected orders when data changes
  useEffect(() => {
    setSelectedOrders([]);
  }, [data?.orders]);

  // Handle tab change
  const handleTabChange = (tab) => {
    setActiveTab(tab);
    setCurrentPage(1);
    setSelectedOrders([]);
  };

  // Handle order selection
  const handleSelectOrder = (orderId) => {
    setSelectedOrders((prev) =>
      prev.includes(orderId)
        ? prev.filter((id) => id !== orderId)
        : [...prev, orderId]
    );
  };

  // Handle select all
  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedOrders(data?.orders?.map((order) => order._id) || []);
    } else {
      setSelectedOrders([]);
    }
  };

  // Handle quick view
  const handleQuickView = (order) => {
    setQuickViewOrder(order);
    setIsQuickViewOpen(true);
  };

  // Handle filter change
  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
    setCurrentPage(1);
  };

  // Handle sort
  const handleSort = (field, order) => {
    setSorting({ sortBy: field, sortOrder: order });
    setCurrentPage(1);
  };

  // Handle reset filters
  const handleResetFilters = () => {
    setFilters({
      search: "",
      customer: "",
      status: "",
      origin: "",
      startDate: "",
      endDate: "",
      method: "",
    });
    if (searchRef.current) searchRef.current.value = "";
    setCurrentPage(1);
    setActiveTab("All");
  };

  // Handle bulk action refresh
  const handleBulkActionRefresh = () => {
    setSelectedOrders([]);
    setIsUpdate(true);
  };

  // Handle export
  const handleExport = async () => {
    try {
      setLoadingExport(true);
      const params = buildApiParams();
      params.page = 1;
      params.limit = data?.totalDoc || 1000;

      const response = await OrderServices.exportOrders(params);
      
      // Create blob and download
      const blob = new Blob([response], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `orders_${new Date().toISOString().split("T")[0]}.csv`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);

      notifySuccess("Orders exported successfully");
      setLoadingExport(false);
    } catch (err) {
      setLoadingExport(false);
      notifyError(err?.response?.data?.message || err?.message || "Export failed");
    }
  };

  // Handle search submit
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const searchValue = searchRef.current?.value || "";
    handleFilterChange("search", searchValue);
  };

  const statusCounts = data?.statusCounts || {
    all: 0,
    completed: 0,
    refunded: 0,
  };

  return (
    <>
      <PageTitle>{t("Orders")}</PageTitle>

      <AnimatedContent>
        {/* Header Tabs */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody className="p-0">
            <div className="flex border-b border-gray-200 dark:border-gray-700">
              <button
                onClick={() => handleTabChange("All")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "All"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                All ({statusCounts.all || 0})
              </button>
              <button
                onClick={() => handleTabChange("Completed")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "Completed"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Completed ({statusCounts.completed || 0})
              </button>
              <button
                onClick={() => handleTabChange("Refunded")}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-colors ${
                  activeTab === "Refunded"
                    ? "border-emerald-500 text-emerald-600 dark:text-emerald-400"
                    : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
                }`}
              >
                Refunded ({statusCounts.refunded || 0})
              </button>
            </div>
          </CardBody>
        </Card>

        {/* Action Toolbar */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <div className="flex flex-col lg:flex-row gap-4 items-start lg:items-center justify-between">
              {/* Left side: Bulk Actions and Search */}
              <div className="flex flex-col sm:flex-row gap-4 flex-1 w-full lg:w-auto">
                <BulkActionsDropdown
                  selectedIds={selectedOrders}
                  onRefresh={handleBulkActionRefresh}
                  onStatusChange={handleBulkActionRefresh}
                />

                <form onSubmit={handleSearchSubmit} className="flex-1 min-w-[200px]">
                  <Input
                    ref={searchRef}
                    type="search"
                    placeholder="Search by order ID, customer name, email..."
                    className="w-full"
                  />
                </form>
              </div>

              {/* Right side: Filter Toggle and Export */}
              <div className="flex gap-2">
                <Button
                  layout="outline"
                  onClick={() => setShowFilters(!showFilters)}
                  className="flex items-center gap-2"
                >
                  <FiFilter className="w-4 h-4" />
                  Filters
                </Button>
                <Button
                  onClick={handleExport}
                  disabled={loadingExport || !data?.orders?.length}
                  className="flex items-center gap-2"
                >
                  {loadingExport ? (
                    <>
                      <img
                        src={spinnerLoadingImage}
                        alt="Loading"
                        width={16}
                        height={16}
                      />
                      Exporting...
                    </>
                  ) : (
                    <>
                      <IoCloudDownloadOutline className="w-5 h-5" />
                      Export
                    </>
                  )}
                </Button>
              </div>
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200 dark:border-gray-700">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
                    Filters
                  </h3>
                  <button
                    onClick={() => setShowFilters(false)}
                    className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                  >
                    <FiX className="w-5 h-5" />
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  <StatusFilter
                    value={filters.status}
                    onChange={(value) => handleFilterChange("status", value)}
                  />
                  <OriginFilter
                    value={filters.origin}
                    onChange={(value) => handleFilterChange("origin", value)}
                  />
                  <CustomerFilter
                    value={filters.customer}
                    onChange={(value) => handleFilterChange("customer", value)}
                    onClear={() => handleFilterChange("customer", "")}
                  />
                  <DateRangeFilter
                    startDate={filters.startDate}
                    endDate={filters.endDate}
                    onStartDateChange={(value) =>
                      handleFilterChange("startDate", value)
                    }
                    onEndDateChange={(value) =>
                      handleFilterChange("endDate", value)
                    }
                    onClear={() => {
                      handleFilterChange("startDate", "");
                      handleFilterChange("endDate", "");
                    }}
                  />
                </div>

                <div className="mt-4 flex gap-2">
                  <Button onClick={handleResetFilters} layout="outline">
                    Reset All Filters
                  </Button>
                </div>
              </div>
            )}
          </CardBody>
        </Card>

        {/* Selected Orders Info */}
        {selectedOrders.length > 0 && (
          <Card className="min-w-0 shadow-xs overflow-hidden bg-emerald-50 dark:bg-emerald-900/20 mb-5">
            <CardBody className="py-3">
              <p className="text-sm text-emerald-800 dark:text-emerald-200">
                {selectedOrders.length} order(s) selected
              </p>
            </CardBody>
          </Card>
        )}

        {/* Orders Table */}
        {loading ? (
          <TableLoading row={12} col={8} width={160} height={20} />
        ) : error ? (
          <Card className="mb-5">
            <CardBody>
              <p className="text-center text-red-500">{error}</p>
            </CardBody>
          </Card>
        ) : data?.orders?.length > 0 ? (
          <TableContainer className="mb-8 dark:bg-gray-900">
            <Table>
              <TableHeader>
                <tr>
                  <TableCell>
                    <input
                      type="checkbox"
                      checked={
                        data?.orders?.length > 0 &&
                        selectedOrders.length === data.orders.length
                      }
                      onChange={(e) => handleSelectAll(e.target.checked)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                  </TableCell>
                  <TableCell>Order</TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        handleSort(
                          "date",
                          sorting.sortBy === "date" && sorting.sortOrder === "asc"
                            ? "desc"
                            : "asc"
                        )
                      }
                      className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      Date
                      {sorting.sortBy === "date" &&
                        (sorting.sortOrder === "asc" ? "▲" : "▼")}
                    </button>
                  </TableCell>
                  <TableCell>Shipment Tracking</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>
                    <button
                      onClick={() =>
                        handleSort(
                          "total",
                          sorting.sortBy === "total" && sorting.sortOrder === "asc"
                            ? "desc"
                            : "asc"
                        )
                      }
                      className="flex items-center gap-1 hover:text-gray-600 dark:hover:text-gray-300"
                    >
                      Total
                      {sorting.sortBy === "total" &&
                        (sorting.sortOrder === "asc" ? "▲" : "▼")}
                    </button>
                  </TableCell>
                  <TableCell>Origin</TableCell>
                  <TableCell className="text-right">Actions</TableCell>
                </tr>
              </TableHeader>

              <OMSTable
                orders={data.orders}
                selectedOrders={selectedOrders}
                onSelectOrder={handleSelectOrder}
                onSelectAll={handleSelectAll}
                onQuickView={handleQuickView}
                sortBy={sorting.sortBy}
                sortOrder={sorting.sortOrder}
                onSort={handleSort}
              />
            </Table>

            <TableFooter>
              <Pagination
                totalResults={data?.totalDoc || 0}
                resultsPerPage={resultsPerPage || 50}
                onChange={handleChangePage}
                label="Table navigation"
              />
            </TableFooter>
          </TableContainer>
        ) : (
          <NotFound title="Sorry, There are no orders right now." />
        )}

        {/* Quick View Modal */}
        <OrderQuickView
          isOpen={isQuickViewOpen}
          onClose={() => {
            setIsQuickViewOpen(false);
            setQuickViewOrder(null);
          }}
          order={quickViewOrder}
        />
      </AnimatedContent>
    </>
  );
};

export default Orders;
