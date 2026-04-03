import React, { useState, useEffect } from "react";
import {
  FiEye,
  FiCheck,
  FiX,
  FiTrash2,
  FiMoreVertical,
  FiFlag,
  FiUsers,
  FiTrendingUp,
  FiMessageSquare,
  FiHeart,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiSearch,
  FiCalendar,
  FiBarChart2
} from "react-icons/fi";
import PageTitle from "@/components/common/PageTitle";
import requests from "@/services/httpService";
import { getImageUrl } from "@/utils/getImageUrl";
import {
  Card,
  Button,
  Badge,
  Table,
  TableHeader,
  TableCell,
  TableBody,
  TableRow,
  Select,
  Input,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Dropdown,
  DropdownItem,
  Pagination,
  Avatar
} from "@windmill/react-ui";
import CommunityStats from "@/components/community/CommunityStats";

const AdminCommunityDashboard = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPosts, setSelectedPosts] = useState([]);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showBulkModal, setShowBulkModal] = useState(false);
  const [bulkAction, setBulkAction] = useState("");
  const [stats, setStats] = useState(null);
  const [showRejectModal, setShowRejectModal] = useState(false);
  const [moderationReason, setModerationReason] = useState("");
  const [selectedPostId, setSelectedPostId] = useState(null);

  const postsPerPage = 20;

  useEffect(() => {
    fetchPosts();
    fetchStats();
  }, [filter, statusFilter, searchTerm, currentPage]);

  const fetchPosts = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: postsPerPage,
        filter: filter,
        status: statusFilter,
        search: searchTerm
      });

      const data = await requests.get(`/admin/posts?${params}`);
      
      setPosts(data.posts || []);
      setTotalPages(Math.ceil(data.total / postsPerPage));
    } catch (error) {
      console.error("Failed to fetch posts:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchStats = async () => {
    try {
      const data = await requests.get("posts/admin/stats");
      console.log("Community Stats API response:", data);
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch stats:", error);
    }
  };

  const handlePostStatusUpdate = async (postId, newStatus, reason = "") => {
    try {
      await requests.patch(`/posts/${postId}/status`, { status: newStatus, moderationReason: reason });
      setPosts(posts.map(post => 
        post._id === postId ? { ...post, status: newStatus } : post
      ));
      setShowRejectModal(false);
      setModerationReason("");
      setSelectedPostId(null);
    } catch (error) {
      console.error("Failed to update post status:", error);
    }
  };

  const openRejectModal = (postId) => {
    setSelectedPostId(postId);
    setModerationReason("");
    setShowRejectModal(true);
  };

  const handlePermanentDelete = async (postId) => {
    if (!confirm("Are you sure you want to permanently delete this post?")) {
      return;
    }

    try {
      await requests.delete(`/admin/posts/${postId}/permanent`);
      setPosts(posts.filter(post => post.id !== postId));
    } catch (error) {
      console.error("Failed to delete post:", error);
    }
  };

  const handleBulkModerate = async () => {
    if (selectedPosts.length === 0) return;

    try {
      await requests.post("/admin/posts/bulk-moderate", {
        postIds: selectedPosts,
        action: bulkAction
      });
      fetchPosts();
      setSelectedPosts([]);
      setShowBulkModal(false);
      setBulkAction("");
    } catch (error) {
      console.error("Failed to bulk moderate posts:", error);
    }
  };

  const handleSelectAll = (checked) => {
    if (checked) {
      setSelectedPosts(posts.map(post => post.id));
    } else {
      setSelectedPosts([]);
    }
  };

  const handleSelectPost = (postId, checked) => {
    if (checked) {
      setSelectedPosts([...selectedPosts, postId]);
    } else {
      setSelectedPosts(selectedPosts.filter(id => id !== postId));
    }
  };

  const getStatusBadge = (status) => {
    const statusConfig = {
      pending: { type: "warning", label: "Pending" },
      approved: { type: "success", label: "Approved" },
      rejected: { type: "danger", label: "Rejected" },
      flagged: { type: "danger", label: "Flagged" },
      deleted: { type: "neutral", label: "Deleted" }
    };

    const config = statusConfig[status] || { type: "neutral", label: status };
    return <Badge type={config.type}>{config.label}</Badge>;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const exportData = async () => {
    try {
      const response = await requests.get(`/admin/posts/export?filter=${filter}&status=${statusFilter}`, {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `community-posts-${new Date().toISOString().split('T')[0]}.csv`;
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);
    } catch (error) {
      console.error("Failed to export data:", error);
    }
  };

  return (
    <>
      <PageTitle>Community Management</PageTitle>

      {/* Stats Overview */}
      {stats && <CommunityStats stats={stats} />}

      {/* Filters and Actions */}
      <Card className="p-6 mb-6 ">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <FiFilter className="w-4 h-4 text-gray-500" />
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-32"
              >
                <option value="all">All Posts</option>
                <option value="reported">Reported</option>
                <option value="trending">Trending</option>
                <option value="media">With Media</option>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-32"
              >
                <option value="all">All Status</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
                <option value="flagged">Flagged</option>
              </Select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <FiSearch className="text-gray-400 w-4 h-4" />
              </div>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search posts..."
                className="pl-10 w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
            {selectedPosts.length > 0 && (
              <Button
                onClick={() => setShowBulkModal(true)}
                className="flex items-center space-x-2"
              >
                <span>Bulk Action ({selectedPosts.length})</span>
              </Button>
            )}
            
            <Button
              variant="ghost"
              onClick={exportData}
              className="flex items-center space-x-2"
            >
              <FiDownload className="w-4 h-4" />
              <span>Export</span>
            </Button>

            <Button
              variant="ghost"
              onClick={() => {
                fetchPosts();
                fetchStats();
              }}
              className="flex items-center space-x-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Posts Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr>
                <th className="px-4 py-3">
                  <input
                    type="checkbox"
                    checked={selectedPosts.length === posts.length && posts.length > 0}
                    onChange={(e) => handleSelectAll(e.target.checked)}
                    className="rounded"
                  />
                </th>
                <th className="px-4 py-3">Post</th>
                <th className="px-4 py-3">Author</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Engagement</th>
                <th className="px-4 py-3">Date</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-4 py-3">
                      <div className="animate-pulse h-4 w-4 bg-gray-300 rounded"></div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="animate-pulse h-4 w-48 bg-gray-300 rounded"></div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="animate-pulse h-4 w-24 bg-gray-300 rounded"></div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="animate-pulse h-4 w-16 bg-gray-300 rounded"></div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="animate-pulse h-4 w-20 bg-gray-300 rounded"></div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="animate-pulse h-4 w-24 bg-gray-300 rounded"></div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="animate-pulse h-4 w-20 bg-gray-300 rounded"></div>
                    </TableCell>
                  </TableRow>
                ))
              ) : posts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="7" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <FiMessageSquare className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-300">No posts found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                posts.map((post) => (
                  <TableRow key={post.id}>
                    <TableCell className="px-4 py-3">
                      <input
                        type="checkbox"
                        checked={selectedPosts.includes(post.id)}
                        onChange={(e) => handleSelectPost(post.id, e.target.checked)}
                        className="rounded"
                      />
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="max-w-md">
                        <p className="text-sm text-gray-900 dark:text-gray-100 truncate">
                          {post.caption}
                        </p>
                        {post.media_files && post.media_files.length > 0 && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {post.media_files[0].type === "image" ? "📷" : "🎥"} {post.media_files[0].type === "image" ? "image" : "video"} ({post.media_files.length})
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        {post.user?.image ? (
                        <Avatar
                          src={getImageUrl(post.user.image)}
                          alt={post.user.name}
                          className="w-8 h-8"
                        />
                      ) : (
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <span className="text-xs text-white font-medium">
                            {post.user?.name?.charAt(0).toUpperCase() || 'U'}
                          </span>
                        </div>
                      )}
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {post.user?.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {post.user?.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {getStatusBadge(post.status)}
                      {post.reports_count > 0 && (
                        <div className="flex items-center space-x-1 mt-1">
                          <FiFlag className="w-3 h-3 text-red-500" />
                          <span className="text-xs text-red-500">{post.reports_count}</span>
                        </div>
                      )}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <FiHeart className="w-3 h-3" />
                          <span>{post.likes_count || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiMessageSquare className="w-3 h-3" />
                          <span>{post.comments_count || 0}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {formatDate(post.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        
                        {post.status !== "approved" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePostStatusUpdate(post._id, "approved")}
                            className="text-green-600"
                            aria-label="Approve post"
                            title="Approve post"
                          >
                            <FiCheck className="w-4 h-4" />
                          </Button>
                        )}
                        
                        {post.status !== "rejected" && (
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => openRejectModal(post._id)}
                            className="text-red-600"
                            aria-label="Reject post"
                            title="Reject post"
                          >
                            <FiX className="w-4 h-4" />
                          </Button>
                        )}
                        
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handlePermanentDelete(post.id)}
                            className="text-gray-600 hover:text-red-600"
                            aria-label="Delete post"
                            title="Delete permanently"
                          >
                            <FiTrash2 className="w-4 h-4" />
                          </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="p-4 border-t border-gray-200 dark:border-gray-700">
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onChange={setCurrentPage}
            />
          </div>
        )}
      </Card>

      {/* Bulk Action Modal */}
      <Modal isOpen={showBulkModal} onClose={() => setShowBulkModal(false)}>
        <ModalHeader>Bulk Action</ModalHeader>
        <ModalBody>
          <p>Apply action to {selectedPosts.length} selected posts:</p>
          <div className="mt-4 space-y-2">
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setBulkAction("approve")}
            >
              <FiCheck className="w-4 h-4 mr-2" />
              Approve All
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start"
              onClick={() => setBulkAction("reject")}
            >
              <FiX className="w-4 h-4 mr-2" />
              Reject All
            </Button>
            <Button
              variant="ghost"
              className="w-full justify-start text-red-600"
              onClick={() => setBulkAction("delete")}
            >
              <FiTrash2 className="w-4 h-4 mr-2" />
              Delete All
            </Button>
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => setShowBulkModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={handleBulkModerate}
            disabled={!bulkAction}
          >
            Apply Action
          </Button>
        </ModalFooter>
      </Modal>

      {/* Reject Post Modal */}
      <Modal isOpen={showRejectModal} onClose={() => setShowRejectModal(false)}>
        <ModalHeader>Reject Post</ModalHeader>
        <ModalBody>
          <p>Are you sure you want to reject this post?</p>
          <div className="mt-3">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
              Rejection Reason
            </label>
            <textarea
              value={moderationReason}
              onChange={(e) => setModerationReason(e.target.value)}
              placeholder="Enter reason for rejecting this post..."
              className="w-full px-3 py-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-200"
              rows={3}
            />
          </div>
        </ModalBody>
        <ModalFooter>
          <Button
            variant="ghost"
            onClick={() => setShowRejectModal(false)}
          >
            Cancel
          </Button>
          <Button
            className="bg-red-600 hover:bg-red-700 text-white"
            onClick={() => handlePostStatusUpdate(selectedPostId, "rejected", moderationReason)}
          >
            Reject
          </Button>
        </ModalFooter>
      </Modal>
    </>
  );
};

export default AdminCommunityDashboard;
