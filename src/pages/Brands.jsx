import React, { useContext, useState, useEffect } from "react";
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
import { FiPlus, FiEdit, FiTrash2, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

//internal import
import useAsync from "@/hooks/useAsync";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import NotFound from "@/components/table/NotFound";
import BrandServices from "@/services/BrandsServices";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import BrandTable from "@/components/brand/BrandTable";
import MainDrawer from "@/components/drawer/MainDrawer";
import BrandDrawer from "@/components/drawer/BrandDrawer";
import CheckBox from "@/components/form/others/CheckBox";
import DeleteModal from "@/components/modal/DeleteModal";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";
import SwitchToggle from "@/components/form/switch/SwitchToggle";

const Brands = () => {
  const { title, allId, serviceId, handleDeleteMany, handleUpdate } =
    useToggleDrawer();

  const { t } = useTranslation();
  const history = useHistory();
  const {
    toggleDrawer,
    lang,
    currentPage,
    handleChangePage,
    searchRef,
    handleSubmitForAll,
    limitData,
    setIsUpdate,
    isUpdate,
  } = useContext(SidebarContext);

  // State for filters
  const [searchText, setSearchText] = useState("");
  const [isActiveFilter, setIsActiveFilter] = useState("all"); // all, true, false
  const [sortBy, setSortBy] = useState("name");
  const [sortDir, setSortDir] = useState("asc");

  // Build API params
  const apiParams = {
    page: currentPage,
    limit: limitData,
    search: searchText || "",
    is_active: isActiveFilter === "all" ? undefined : isActiveFilter === "true",
    sort_by: sortBy,
    sort_dir: sortDir,
  };

  const { data, loading, error } = useAsync(
    () => BrandServices.getAllBrands(apiParams),
    [currentPage, limitData, searchText, isActiveFilter, sortBy, sortDir, isUpdate]
  );

  // React hooks
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(data?.brands?.map((brand) => brand._id) || []);
    if (isCheckAll) {
      setIsCheck([]);
    }
  };

  // Handle search
  const handleSearch = (e) => {
    e.preventDefault();
    const searchValue = searchRef.current.value;
    setSearchText(searchValue);
    setIsUpdate(true);
  };

  // Handle reset filters
  const handleResetField = () => {
    setSearchText("");
    setIsActiveFilter("all");
    setSortBy("name");
    setSortDir("asc");
    if (searchRef.current) {
      searchRef.current.value = "";
    }
    setIsUpdate(true);
  };

  // Handle delete brand
  const handleDelete = async (id) => {
    try {
      await BrandServices.deleteBrand(id);
      toast.success(t("Brand deleted successfully"));
      setIsUpdate(true);
    } catch (error) {
      toast.error(error.message || t("Failed to delete brand"));
    }
  };

  // Handle toggle brand visibility
  const handleToggleVisibility = async (brandId, currentStatus) => {
    const newStatus = !currentStatus;
    
    // If disabling, show confirmation with warning about products
    if (!newStatus) {
      // Get brand info to show product count
      try {
        const brandInfo = await BrandServices.getBrandById(brandId);
        const productCount = brandInfo.productCount || 0;
        
        const confirmMessage = productCount > 0
          ? t("Disabling this brand will hide all {{count}} linked products. Are you sure?", { count: productCount })
          : t("Are you sure you want to disable this brand?");
        
        if (!window.confirm(confirmMessage)) {
          return;
        }
      } catch (error) {
        // If we can't get brand info, still show confirmation
        if (!window.confirm(t("Disabling this brand will hide all linked products. Are you sure?"))) {
          return;
        }
      }
    }

    try {
      const response = await BrandServices.updateBrand(brandId, { is_active: newStatus });
      const affectedCount = response.affectedProductsCount || 0;
      const productCount = response.productCount || 0;
      
      if (newStatus) {
        toast.success(
          affectedCount > 0
            ? t("Brand enabled successfully. {{count}} products are now visible.", { count: affectedCount })
            : productCount > 0
            ? t("Brand enabled successfully. All {{count}} products are visible.", { count: productCount })
            : t("Brand enabled successfully")
        );
      } else {
        toast.success(
          affectedCount > 0
            ? t("Brand disabled successfully. {{count}} products have been hidden.", { count: affectedCount })
            : t("Brand disabled successfully")
        );
      }
      setIsUpdate(true);
    } catch (error) {
      toast.error(error.message || t("Failed to update brand status"));
    }
  };

  // Handle view brand details
  const handleViewBrand = (id) => {
    history.push(`/brands/${id}`);
  };

  // Handle edit brand
  const handleEditBrand = (id) => {
    handleUpdate(id);
    toggleDrawer();
  };

  return (
    <>
      <PageTitle>{t("Brands")}</PageTitle>
      <DeleteModal ids={allId} setIsCheck={setIsCheck} />

      <MainDrawer>
        <BrandDrawer id={serviceId} lang={lang} />
      </MainDrawer>

      <AnimatedContent>
        {/* Search and Filter Card */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form onSubmit={handleSearch} className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex">
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  ref={searchRef}
                  type="search"
                  name="search"
                  placeholder={t("Search brands by name")}
                />
              </div>

              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Select
                  value={isActiveFilter}
                  onChange={(e) => {
                    setIsActiveFilter(e.target.value);
                    setIsUpdate(true);
                  }}
                >
                  <option value="all">{t("All Status")}</option>
                  <option value="true">{t("Active")}</option>
                  <option value="false">{t("Inactive")}</option>
                </Select>
              </div>

              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Select
                  value={`${sortBy}_${sortDir}`}
                  onChange={(e) => {
                    const [field, dir] = e.target.value.split("_");
                    setSortBy(field);
                    setSortDir(dir);
                    setIsUpdate(true);
                  }}
                >
                  <option value="name_asc">{t("Name (A-Z)")}</option>
                  <option value="name_desc">{t("Name (Z-A)")}</option>
                  <option value="created_desc">{t("Newest First")}</option>
                  <option value="created_asc">{t("Oldest First")}</option>
                </Select>
              </div>

              <div className="flex items-center gap-2">
                <Button
                  type="button"
                  onClick={handleResetField}
                  className="px-4 md:py-1 py-2 h-12 text-sm dark:bg-gray-700"
                >
                  {t("Reset")}
                </Button>
                <Button
                  type="submit"
                  className="px-4 md:py-1 py-2 h-12 text-sm bg-emerald-600 hover:bg-emerald-700"
                >
                  {t("Search")}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        {/* Action Bar */}
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-2">
                <Button
                  onClick={toggleDrawer}
                  className="rounded-md h-12 bg-emerald-600 hover:bg-emerald-700"
                >
                  <span className="mr-2">
                    <FiPlus />
                  </span>
                  {t("Add Brand")}
                </Button>
              </div>
            </div>
          </CardBody>
        </Card>

        {/* Brands Table */}
        {loading ? (
          <TableLoading row={12} col={6} width={160} height={20} />
        ) : error ? (
          <span className="text-center mx-auto text-red-500">{error}</span>
        ) : data?.brands && data.brands.length > 0 ? (
          <>
            <TableContainer className="mb-8 rounded-b-lg overflow-x-auto">
              <Table className="w-full whitespace-no-wrap">
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
                    <TableCell>{t("Logo")}</TableCell>
                    <TableCell>{t("Brand Name")}</TableCell>
                    <TableCell>{t("Product Count")}</TableCell>
                    <TableCell className="text-center">{t("Status")}</TableCell>
                    <TableCell>{t("Date")}</TableCell>
                    <TableCell className="text-right">{t("Actions")}</TableCell>
                  </tr>
                </TableHeader>
                <BrandTable
                  lang={lang}
                  isCheck={isCheck}
                  setIsCheck={setIsCheck}
                  brands={data.brands}
                  handleToggleVisibility={handleToggleVisibility}
                  handleViewBrand={handleViewBrand}
                  handleEditBrand={handleEditBrand}
                  handleDelete={handleDelete}
                />
              </Table>
              <TableFooter>
                <Pagination
                  totalResults={data?.totalDoc || 0}
                  resultsPerPage={limitData}
                  onChange={handleChangePage}
                  label="Brand Page Navigation"
                />
              </TableFooter>
            </TableContainer>
          </>
        ) : (
          <NotFound title="Brand" />
        )}
      </AnimatedContent>
    </>
  );
};

export default Brands;
