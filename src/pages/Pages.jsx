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
import { useContext, useState } from "react";
import { FiPlus, FiTrash2 } from "react-icons/fi";
import { useTranslation } from "react-i18next";
import { SidebarContext } from "@/context/SidebarContext";
import useAsync from "@/hooks/useAsync";
import useToggleDrawer from "@/hooks/useToggleDrawer";
import useFilter from "@/hooks/useFilter";
import PageTitle from "@/components/Typography/PageTitle";
import DeleteModal from "@/components/modal/DeleteModal";
import MainDrawer from "@/components/drawer/MainDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import CheckBox from "@/components/form/others/CheckBox";
import NotFound from "@/components/table/NotFound";
import AnimatedContent from "@/components/common/AnimatedContent";
import PageServices from "@/services/PageServices";
import PageDrawer from "@/components/drawer/PageDrawer";
import PageTable from "@/components/Page/PageTable";

const Pages = () => {
  const { t } = useTranslation();
  const { toggleDrawer } = useContext(SidebarContext);
  const { data, loading, error } = useAsync(PageServices.getAllPages);
  const [isCheckAll, setIsCheckAll] = useState(false);
  const [isCheck, setIsCheck] = useState([]);

  const { allId, serviceId, handleDeleteMany } = useToggleDrawer();
  const {
    couponRef,
    dataTable,
    totalResults,
    resultsPerPage,
    handleChangePage,
    setSearchCoupon,
    handleSubmitCoupon,
  } = useFilter(data?.pages);

  const handleSelectAll = () => {
    setIsCheckAll(!isCheckAll);
    setIsCheck(isCheckAll ? [] : (data?.pages || []).map((p) => p._id));
  };

  const handleResetField = () => {
    setSearchCoupon("");
    if (couponRef?.current) couponRef.current.value = "";
  };

  return (
    <>
      <PageTitle>Pages</PageTitle>
      <DeleteModal ids={allId} setIsCheck={setIsCheck} title="Selected Pages" />

      <MainDrawer>
        <PageDrawer id={serviceId} />
      </MainDrawer>

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={handleSubmitCoupon}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 xl:flex"
            >
              <div className="flex justify-start xl:w-1/2 md:w-full" />
              <div className="lg:flex md:flex xl:justify-end xl:w-1/2 md:w-full md:justify-start flex-grow-0">
                <div className="w-full md:w-32 lg:w-32 xl:w-32 mr-3 mb-3 lg:mb-0">
                  <Button
                    disabled={isCheck.length < 1}
                    onClick={() => handleDeleteMany(isCheck)}
                    className="w-full rounded-md h-12 bg-red-500 btn-red"
                  >
                    <span className="mr-2">
                      <FiTrash2 />
                    </span>
                    {t("Delete")}
                  </Button>
                </div>
                <div className="w-full md:w-48 lg:w-48 xl:w-48">
                  <Button onClick={toggleDrawer} className="w-full rounded-md h-12">
                    <span className="mr-2">
                      <FiPlus />
                    </span>
                    Add Page
                  </Button>
                </div>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={handleSubmitCoupon}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  ref={couponRef}
                  type="search"
                  placeholder="Search page by title"
                />
              </div>
              <div className="flex items-center gap-2 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <div className="w-full mx-1">
                  <Button type="submit" className="h-12 w-full bg-red-600 hover:bg-red-700">
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
      </AnimatedContent>

      {loading ? (
        <TableLoading row={12} col={8} width={140} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : dataTable?.length > 0 ? (
        <TableContainer className="mb-8">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>
                  <CheckBox
                    type="checkbox"
                    name="selectAll"
                    id="selectAll"
                    handleClick={handleSelectAll}
                    isChecked={isCheckAll}
                  />
                </TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Slug</TableCell>
                <TableCell>Content</TableCell>
                <TableCell className="text-center">Published</TableCell>
                <TableCell className="text-right">{t("CoupTblActions")}</TableCell>
              </tr>
            </TableHeader>
            <PageTable isCheck={isCheck} pages={dataTable} setIsCheck={setIsCheck} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={data?.totalDoc}
              resultsPerPage={resultsPerPage || 10}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="No pages yet. Add one to manage About, Terms, etc. from the dashboard." />
      )}
    </>
  );
};

export default Pages;
