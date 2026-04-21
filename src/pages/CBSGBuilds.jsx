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
  Badge,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiEye, FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-toastify";
import { useHistory } from "react-router-dom";

import useAsync from "@/hooks/useAsync";
import NotFound from "@/components/table/NotFound";
import CBSGServices from "@/services/CBSGServices";
import PageTitle from "@/components/Typography/PageTitle";
import { SidebarContext } from "@/context/SidebarContext";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";
import { getImageUrl } from "@/utils/getImageUrl";

const CBSGBuilds = () => {
  const { t } = useTranslation();
  const history = useHistory();
  const {
    currentPage,
    handleChangePage,
    searchText,
    searchRef,
    handleSubmitForAll,
    limitData,
  } = useContext(SidebarContext);

  const [status, setStatus] = useState("all"); // all, approved, pending
  const [visibility, setVisibility] = useState("all"); // all, public, private
  const [sortBy, setSortBy] = useState("date");
  const [sortDir, setSortDir] = useState("desc");

  // Fetch builds
  const { data, loading, error, time } = useAsync(() =>
    CBSGServices.getAllBuilds({
      page: currentPage,
      limit: limitData,
      search: searchText || "",
      approved: status === "all" ? undefined : status === "approved",
      visibility: visibility === "all" ? undefined : visibility,
      sort_by: sortBy,
      sort_dir: sortDir,
    })
  );

  const builds = data?.builds || [];
  const totalResults = data?.totalDocs || 0;
  const totalPages = data?.totalPages || 1;

  // Approve/Reject build
  const handleApproveBuild = async (buildId, approved, reason = "") => {
    try {
      await CBSGServices.approveBuild(buildId, {
        approved,
        reason,
      });
      toast.success(`Build ${approved ? "approved" : "rejected"} successfully`);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update build");
    }
  };

  // Delete build
  const handleDeleteBuild = async (buildId) => {
    if (window.confirm("Are you sure you want to delete this build?")) {
      try {
        await CBSGServices.deleteBuild(buildId);
        toast.success("Build deleted successfully");
        window.location.reload();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete build");
      }
    }
  };

  return (
    <>
      <PageTitle>CBSG - Builds Management</PageTitle>

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
                  placeholder="Search builds..."
                />
              </div>
              <div className="flex items-center gap-2">
                <Select
                  className="w-full"
                  value={status}
                  onChange={(e) => setStatus(e.target.value)}
                >
                  <option value="all">All Status</option>
                  <option value="approved">Approved</option>
                  <option value="pending">Pending</option>
                </Select>
                <Select
                  className="w-full"
                  value={visibility}
                  onChange={(e) => setVisibility(e.target.value)}
                >
                  <option value="all">All Visibility</option>
                  <option value="public">Public</option>
                  <option value="private">Private</option>
                </Select>
                <Select
                  className="w-full"
                  value={`${sortBy}_${sortDir}`}
                  onChange={(e) => {
                    const [by, dir] = e.target.value.split("_");
                    setSortBy(by);
                    setSortDir(dir);
                  }}
                >
                  <option value="date_desc">Newest First</option>
                  <option value="date_asc">Oldest First</option>
                  <option value="popularity_desc">Most Popular</option>
                  <option value="name_asc">Name A-Z</option>
                  <option value="name_desc">Name Z-A</option>
                </Select>
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
                {error?.message || "Failed to load builds"}
              </span>
            ) : builds.length === 0 ? (
              <NotFound title="No builds found" />
            ) : (
              <TableContainer>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>Build Name</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Vehicle</TableCell>
                      <TableCell>Status</TableCell>
                      <TableCell>Visibility</TableCell>
                      <TableCell>Likes</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell className="text-right">Actions</TableCell>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {builds.map((build) => (
                      <tr key={build._id}>
                        <TableCell>
                          <div className="flex items-center">
                            {build.hero_image_url && (
                              build.hero_image_url.match(/\.(mp4|webm|ogg|mov|avi)$/i) ? (
                                <video
                                  src={getImageUrl(build.hero_image_url)}
                                  alt={build.name}
                                  className="w-10 h-10 rounded mr-3 object-cover"
                                  muted
                                />
                              ) : (
                                <img
                                  src={getImageUrl(build.hero_image_url)}
                                  alt={build.name}
                                  className="w-10 h-10 rounded mr-3 object-cover"
                                />
                              )
                            )}
                            <span className="font-semibold">{build.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div>
                            <div className="font-medium">
                              {build.user_id?.name || "Unknown"}
                            </div>
                            {build.user_id?.handle && (
                              <div className="text-sm text-gray-500">
                                @{build.user_id.handle}
                              </div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          {build.specs?.make && build.specs?.model ? (
                            <div>
                              {build.specs.make} {build.specs.model}
                              {build.specs.year && ` (${build.specs.year})`}
                            </div>
                          ) : (
                            <span className="text-gray-400">-</span>
                          )}
                        </TableCell>
                        <TableCell>
                          <Badge
                            type={build.approved ? "success" : "warning"}
                          >
                            {build.approved ? "Approved" : "Pending"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            type={build.visibility === "public" ? "primary" : "neutral"}
                          >
                            {build.visibility}
                          </Badge>
                        </TableCell>
                        <TableCell>{build.likesCount || 0}</TableCell>
                        <TableCell>
                          {new Date(build.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end items-center gap-2">
                            <Button
                              layout="link"
                              size="small"
                              onClick={() =>
                                history.push(`/cbsg/builds/${build._id}`)
                              }
                            >
                              <FiEye className="w-4 h-4" />
                            </Button>
                            {!build.approved && (
                              <Button
                                layout="link"
                                size="small"
                                onClick={() =>
                                  handleApproveBuild(build._id, true)
                                }
                              >
                                <FiCheck className="w-4 h-4 text-green-600" />
                              </Button>
                            )}
                            {build.approved && (
                              <Button
                                layout="link"
                                size="small"
                                onClick={() =>
                                  handleApproveBuild(build._id, false)
                                }
                              >
                                <FiX className="w-4 h-4 text-red-600" />
                              </Button>
                            )}
                            <Button
                              layout="link"
                              size="small"
                              onClick={() => handleDeleteBuild(build._id)}
                            >
                              <FiTrash2 className="w-4 h-4 text-red-600" />
                            </Button>
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

export default CBSGBuilds;

