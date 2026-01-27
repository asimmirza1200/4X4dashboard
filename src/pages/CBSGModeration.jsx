import React, { useState } from "react";
import {
  Table,
  TableHeader,
  TableCell,
  TableFooter,
  TableContainer,
  Select,
  Button,
  Card,
  CardBody,
  Pagination,
  Badge,
} from "@windmill/react-ui";
import { useTranslation } from "react-i18next";
import { FiTrash2, FiCheck, FiX } from "react-icons/fi";
import { toast } from "react-toastify";

import useAsync from "@/hooks/useAsync";
import NotFound from "@/components/table/NotFound";
import CBSGServices from "@/services/CBSGServices";
import PageTitle from "@/components/Typography/PageTitle";
import TableLoading from "@/components/preloader/TableLoading";
import AnimatedContent from "@/components/common/AnimatedContent";

const CBSGModeration = () => {
  const { t } = useTranslation();
  const [currentPage, setCurrentPage] = useState(1);
  const [limitData] = useState(20);
  const [queueType, setQueueType] = useState("all"); // all, users, builds, comments

  // Fetch moderation queue
  const { data, loading, error } = useAsync(() =>
    CBSGServices.getModerationQueue({
      type: queueType,
      page: currentPage,
      limit: limitData,
    })
  );

  // Fetch stats
  const { data: stats } = useAsync(() => CBSGServices.getModerationStats());

  const queue = data?.queue || {};
  const pendingUsers = queue.pendingUsers || [];
  const pendingBuilds = queue.pendingBuilds || [];
  const flaggedComments = queue.flaggedComments || [];

  // Handle actions
  const handleApproveUser = async (userId, approved) => {
    try {
      await CBSGServices.approveUser({ userId, approved });
      toast.success(`User ${approved ? "approved" : "rejected"}`);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update user");
    }
  };

  const handleApproveBuild = async (buildId, approved) => {
    try {
      await CBSGServices.approveBuild(buildId, { approved });
      toast.success(`Build ${approved ? "approved" : "rejected"}`);
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to update build");
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (window.confirm("Are you sure you want to delete this comment?")) {
      try {
        await CBSGServices.deleteComment(commentId, {});
        toast.success("Comment deleted");
        window.location.reload();
      } catch (error) {
        toast.error(error.response?.data?.message || "Failed to delete comment");
      }
    }
  };

  const handleUnflagComment = async (commentId) => {
    try {
      await CBSGServices.unflagComment(commentId);
      toast.success("Comment unflagged");
      window.location.reload();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to unflag comment");
    }
  };

  return (
    <>
      <PageTitle>CBSG - Moderation Queue</PageTitle>

      <AnimatedContent>
        {/* Stats Cards */}
        {stats && (
          <div className="grid gap-6 mb-8 md:grid-cols-2 xl:grid-cols-4">
            <Card>
              <CardBody>
                <div className="flex items-center">
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pending Users
                    </p>
                    <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                      {stats.pendingUsers || 0}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-center">
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Pending Builds
                    </p>
                    <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                      {stats.pendingBuilds || 0}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-center">
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Flagged Comments
                    </p>
                    <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                      {stats.flaggedComments || 0}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
            <Card>
              <CardBody>
                <div className="flex items-center">
                  <div>
                    <p className="mb-1 text-sm font-medium text-gray-600 dark:text-gray-400">
                      Recent Actions (7d)
                    </p>
                    <p className="text-2xl font-semibold text-gray-700 dark:text-gray-200">
                      {stats.recentActions || 0}
                    </p>
                  </div>
                </div>
              </CardBody>
            </Card>
          </div>
        )}

        <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
          <CardBody>
            <div className="flex items-center gap-4">
              <Select
                className="w-full"
                value={queueType}
                onChange={(e) => setQueueType(e.target.value)}
              >
                <option value="all">All Items</option>
                <option value="users">Pending Users</option>
                <option value="builds">Pending Builds</option>
                <option value="comments">Flagged Comments</option>
              </Select>
            </div>
          </CardBody>
        </Card>

        {/* Pending Users */}
        {(queueType === "all" || queueType === "users") && pendingUsers.length > 0 && (
          <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
            <CardBody>
              <h3 className="text-lg font-semibold mb-4">Pending Users</h3>
              <TableContainer>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>Name</TableCell>
                      <TableCell>Email</TableCell>
                      <TableCell>Handle</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell className="text-right">Actions</TableCell>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {pendingUsers.map((user) => (
                      <tr key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.handle || "-"}</TableCell>
                        <TableCell>
                          {new Date(user.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              layout="link"
                              size="small"
                              onClick={() => handleApproveUser(user._id, true)}
                            >
                              <FiCheck className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              layout="link"
                              size="small"
                              onClick={() => handleApproveUser(user._id, false)}
                            >
                              <FiX className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        )}

        {/* Pending Builds */}
        {(queueType === "all" || queueType === "builds") && pendingBuilds.length > 0 && (
          <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800 mb-5">
            <CardBody>
              <h3 className="text-lg font-semibold mb-4">Pending Builds</h3>
              <TableContainer>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>Build Name</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell className="text-right">Actions</TableCell>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {pendingBuilds.map((build) => (
                      <tr key={build._id}>
                        <TableCell>{build.name}</TableCell>
                        <TableCell>
                          {build.user_id?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {new Date(build.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              layout="link"
                              size="small"
                              onClick={() => handleApproveBuild(build._id, true)}
                            >
                              <FiCheck className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              layout="link"
                              size="small"
                              onClick={() => handleApproveBuild(build._id, false)}
                            >
                              <FiX className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        )}

        {/* Flagged Comments */}
        {(queueType === "all" || queueType === "comments") && flaggedComments.length > 0 && (
          <Card className="min-w-0 shadow-xs overflow-hidden bg-white dark:bg-gray-800">
            <CardBody>
              <h3 className="text-lg font-semibold mb-4">Flagged Comments</h3>
              <TableContainer>
                <Table>
                  <TableHeader>
                    <tr>
                      <TableCell>Comment</TableCell>
                      <TableCell>User</TableCell>
                      <TableCell>Build</TableCell>
                      <TableCell>Created</TableCell>
                      <TableCell className="text-right">Actions</TableCell>
                    </tr>
                  </TableHeader>
                  <tbody>
                    {flaggedComments.map((comment) => (
                      <tr key={comment._id}>
                        <TableCell>
                          <div className="max-w-md truncate">{comment.body}</div>
                        </TableCell>
                        <TableCell>
                          {comment.user_id?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {comment.build_id?.name || "Unknown"}
                        </TableCell>
                        <TableCell>
                          {new Date(comment.createdAt).toLocaleDateString()}
                        </TableCell>
                        <TableCell>
                          <div className="flex justify-end gap-2">
                            <Button
                              layout="link"
                              size="small"
                              onClick={() => handleUnflagComment(comment._id)}
                            >
                              <FiCheck className="w-4 h-4 text-green-600" />
                            </Button>
                            <Button
                              layout="link"
                              size="small"
                              onClick={() => handleDeleteComment(comment._id)}
                            >
                              <FiTrash2 className="w-4 h-4 text-red-600" />
                            </Button>
                          </div>
                        </TableCell>
                      </tr>
                    ))}
                  </tbody>
                </Table>
              </TableContainer>
            </CardBody>
          </Card>
        )}

        {loading && <TableLoading />}
        {!loading && 
          pendingUsers.length === 0 && 
          pendingBuilds.length === 0 && 
          flaggedComments.length === 0 && (
          <NotFound title="No items in moderation queue" />
        )}
      </AnimatedContent>
    </>
  );
};

export default CBSGModeration;

