import {
  Card,
  Button,
  CardBody,
  Input,
  Pagination,
  Table,
  TableCell,
  TableContainer,
  TableFooter,
  TableHeader,
} from "@windmill/react-ui";
import React, { useContext, useRef, useState } from "react";
import { FiPlus } from "react-icons/fi";

import useAsync from "@/hooks/useAsync";
import useFilter from "@/hooks/useFilter";
import MainDrawer from "@/components/drawer/MainDrawer";
import VendorDrawer from "@/components/drawer/VendorDrawer";
import TableLoading from "@/components/preloader/TableLoading";
import VendorTable from "@/components/vendor/VendorTable";
import NotFound from "@/components/table/NotFound";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import VendorServices from "@/services/VendorServices";
import AnimatedContent from "@/components/common/AnimatedContent";

const VendorManagement = () => {
  const { toggleDrawer } = useContext(SidebarContext);

  const { data, loading, error } = useAsync(VendorServices.getAllVendors);

  const {
    userRef,
    dataTable,
    serviceData,
    totalResults,
    resultsPerPage,
    handleSubmitUser,
    handleChangePage,
  } = useFilter(data);

  const [searchUser, setSearchUser] = useState("");

  const handleResetField = () => {
    setSearchUser("");
    if (userRef?.current) {
      userRef.current.value = "";
    }
  };

  return (
    <>
      <PageTitle>Vendor Management</PageTitle>

      <MainDrawer>
        <VendorDrawer />
      </MainDrawer>

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <form
              onSubmit={handleSubmitUser}
              className="py-3 grid gap-4 lg:gap-6 xl:gap-6 md:flex xl:flex"
            >
              <div className="flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <Input
                  ref={userRef}
                  type="search"
                  name="search"
                  placeholder="Search vendor by name, email, or company..."
                />
                <button
                  type="submit"
                  className="absolute right-0 top-0 mt-5 mr-1"
                ></button>
              </div>

              <div className="w-full md:w-56 lg:w-56 xl:w-56">
                <Button
                  onClick={toggleDrawer}
                  className="w-full rounded-md h-12"
                >
                  <span className="mr-3">
                    <FiPlus />
                  </span>
                  Add Vendor
                </Button>
              </div>

              <div className="mt-2 md:mt-0 flex items-center xl:gap-x-4 gap-x-1 flex-grow-0 md:flex-grow lg:flex-grow xl:flex-grow">
                <div className="w-full mx-1">
                  <Button type="submit" className="h-12 w-full bg-emerald-700">
                    Filter
                  </Button>
                </div>

                <div className="w-full">
                  <Button
                    layout="outline"
                    onClick={handleResetField}
                    type="reset"
                    className="px-4 md:py-1 py-3 text-sm dark:bg-gray-700"
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
        <TableLoading row={12} col={8} width={150} height={20} />
      ) : error ? (
        <span className="text-center mx-auto text-red-500">{error}</span>
      ) : serviceData?.length !== 0 ? (
        <TableContainer className="mb-8 rounded-b-lg">
          <Table>
            <TableHeader>
              <tr>
                <TableCell>Vendor Name</TableCell>
                <TableCell>Email</TableCell>
                <TableCell>Phone</TableCell>
                <TableCell>City / Postal Code</TableCell>
                <TableCell>Country</TableCell>
                <TableCell className="text-center">Status</TableCell>
                <TableCell>Joined</TableCell>
                <TableCell className="text-right">Actions</TableCell>
              </tr>
            </TableHeader>
            <VendorTable vendors={dataTable} />
          </Table>
          <TableFooter>
            <Pagination
              totalResults={totalResults}
              resultsPerPage={resultsPerPage}
              onChange={handleChangePage}
              label="Table navigation"
            />
          </TableFooter>
        </TableContainer>
      ) : (
        <NotFound title="Sorry, There are no vendors right now." />
      )}
    </>
  );
};

export default VendorManagement;
