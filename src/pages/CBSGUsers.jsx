import React, { useContext, useState } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Input,
  Button,
  Card,
  CardBody,
  Pagination,
  Badge,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiCheck, FiX, FiEye } from "react-icons/fi";
import { toast } from "react-toastify";

import useAsync from "@/hooks/useAsync";
import NotFound from "@/components/table/NotFound";
import CBSGServices from "@/services/CBSGServices";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";

const CBSGUsers = () => {
  const { t } = useTranslation();
  const {
    currentPage,
    handleChangePage,
    searchText,
    searchRef,
    handleSubmitForAll,
    limitData,
  } = useContext(SidebarContext);

  const [showPendingOnly, setShowPendingOnly] = useState(true);

  // Fetch pending users
  const { data, loading, error, time } = useAsync(() =>
    CBSGServices.getPendingUsers({
      page: currentPage,
      limit: limitData,
      search: searchText || "",
    })
  );
  console.log("error",error)
  const users = data?.users || [];
  const totalResults = data?.totalDocs || 0;
  const totalPages = data?.totalPages || 1;

  // Approve/Reject user
  const handleApproveUser = async (userId, approved, reason = "") => {
    try {
      await CBSGServices.approveUser({
        userId,
        approved,
        reason,
      });
      toast.success(`User ${approved ? "approved" : "rejected"} successfully`);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  return (
    <>
      <PageTitle>CBSG - User Management</PageTitle>

      <AnimatedContent>
        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
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
                  placeholder="Search users by name, email, or handle..."
                />
              </div>
              <div className="flex items-center gap-2">
                <Button type="submit" className="h-12 w-full bg-emerald-700">
                  {t("Search")}
                </Button>
              </div>
            </form>
          </CardBody>
        </Card>

        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800">
          <CardBody>
            {loading ? (
              <TableLoading />
            ) : error ? (
              <span className="text-center text-xl text-red-500">
                {error}
              </span>
            ) : users.length === 0 ? (
              <NotFound title="No pending users found" />
            ) : (
              <TableContainer>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Handle</TableCell>
                      <TableCell>Provider</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell className="text-right">Actions</TableCell>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {users.map((user) => (
                      <tr key={user._id}>
                        <TableCell>
                          <div className="flex items-center">
                            {user.avatar_url && (
                              <img
                                src={user.avatar_url}
                                alt={user.name}
                                className="w-10 h-10 rounded-full mr-3 object-cover"
                              />
                            )}
                            <span className="font-semibold">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          {user.handle ? (
                            <span className="text-blue-600">@{user.handle}</span>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge type="neutral">{user.provider || "native"}</Badge>
                        </TableCell>
                        <TableCell>
                          <Badge type={user.approved ? "success" : "warning"}>
                            {user.approved ? "Approved" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end items-center gap-2">
                            {!user.approved && (
                              <Button
                                layout="link"
                                size="small"
                                onClick={() => handleApproveUser(user._id, true)}
                              >
                                <FiCheck className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
                            {user.approved && (
                              <Button
                                layout="link"
                                size="small"
                                onClick={() => handleApproveUser(user._id, false)}
                              >
                                <FiX className="w-4 h-4 text-red-600" />
                              </Button>
                            )}
                          </div>
                        </TableCell>
                      </tr>
                    ))}
                  </tbody>
                </Table>
                <TableFooter>
                  <Pagination
                    totalResults={totalResults}
                    resultsPerPage={limitData}
                    label="Table navigation"
                    onChange={handleChangePage}
                  />
                </TableFooter>
              </TableContainer>
            )}
          </CardBody>
        </Card>
      </AnimatedContent>
    </>
  );
};

export default CBSGUsers;

