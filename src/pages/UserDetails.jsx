import React, { useState, useEffect } from "react";
import { useHistory, useParams } from "react-router-dom";
import {
  FiArrowLeft,
  FiUser,
  FiMail,
  FiCalendar,
  FiMessageSquare,
  FiHeart,
  FiEye,
  FiFilter,
  FiSearch,
  FiRefreshCw
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
  Avatar
} from "@windmill/react-ui";

const UserDetails = () => {
  const { userId } = useParams();
  const history = useHistory();
  const [user, setUser] = useState(null);
  const [userPosts, setUserPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [postsLoading, setPostsLoading] = useState(false);
  const [filter, setFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  const postsPerPage = 20;

  const fetchUserDetails = async () => {
    try {
      const data = await requests.get(`/posts/user/${userId}`);
      setUser(data.user || data);
      setUserPosts(data.posts || []);
      setTotalPages(Math.ceil((data.total || 0) / postsPerPage));
    } catch (error) {
      console.error("Failed to fetch user details:", error);
    }
  };

  const fetchUserPosts = async () => {
    setPostsLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: postsPerPage,
        filter: filter,
        search: searchTerm
      });

      const data = await requests.get(`/posts/user/${userId}?${params}`);
      setUserPosts(data.posts || []);
      setTotalPages(Math.ceil(data.total / postsPerPage));
    } catch (error) {
      console.error("Failed to fetch user posts:", error);
    } finally {
      setPostsLoading(false);
    }
  };

  useEffect(() => {
    const fetchInitialData = async () => {
      setLoading(true);
      try {
        // Single API call to get user details and posts
        await fetchUserDetails();
      } catch (error) {
        console.error("Failed to fetch initial data:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchInitialData();
  }, [userId]); // Only run when userId changes

  useEffect(() => {
    // Only fetch posts when filter, search, or page changes (but not on initial load)
    if (!loading) {
      fetchUserPosts();
    }
  }, [filter, searchTerm, currentPage]);

  const getStatusBadge = (status) => {
    const statusConfig = {
      approved: { type: "success", label: "Approved" },
      pending: { type: "warning", label: "Pending" },
      rejected: { type: "danger", label: "Rejected" },
      reported: { type: "danger", label: "Reported" }
    };
    const config = statusConfig[status] || { type: "neutral", label: status };
    return <Badge type={config.type}>{config.label}</Badge>;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleString();
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  if (loading) {
    return (
      <>
        <PageTitle>User Details</PageTitle>
        <div className="flex items-center justify-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </>
    );
  }

  return (
    <>
      <PageTitle>User Details</PageTitle>

      {/* User Info Card */}
      <Card className="p-6 mb-6">
        <div className="flex items-center justify-between mb-4">
          <Button
            variant="ghost"
            onClick={() => history.push('/admin/users')}
            className="flex items-center space-x-2"
          >
            <FiArrowLeft className="w-4 h-4" />
            <span>Back to Users</span>
          </Button>
        </div>

        <div className="flex items-center space-x-6">
          <Avatar
            src={getImageUrl(user?.image)}
            alt={user?.name}
            className="w-80 h-80 rounded-full"
          />
          <div className="flex-1">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-2">
              {user?.name || 'Unknown User'}
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <FiMail className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">{user?.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <FiCalendar className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  Joined {formatDate(user?.createdAt)}
                </span>
              </div>
              <div className="flex items-center space-x-2">
                <FiMessageSquare className="w-4 h-4 text-gray-500" />
                <span className="text-sm text-gray-600">
                  {user?.totalPosts || 0} posts
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* User Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
              {user?.totalPosts || 0}
            </p>
            <p className="text-sm text-gray-600">Total Posts</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-green-600">
              {user?.approvedPosts || 0}
            </p>
            <p className="text-sm text-gray-600">Approved</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">
              {user?.pendingPosts || 0}
            </p>
            <p className="text-sm text-gray-600">Pending</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-red-600">
              {user?.rejectedPosts || 0}
            </p>
            <p className="text-sm text-gray-600">Rejected</p>
          </div>
        </div>
      </Card>

      {/* Posts Section */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100">
            User Posts
          </h3>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center space-x-2">
              <FiFilter className="w-4 h-4 text-gray-500" />
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-32"
              >
                <option value="all">All Posts</option>
                <option value="approved">Approved</option>
                <option value="pending">Pending</option>
                <option value="rejected">Rejected</option>
                <option value="reported">Reported</option>
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

            <Button
              variant="ghost"
              onClick={fetchUserPosts}
              className="flex items-center space-x-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>

        {/* Posts Table */}
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr>
                <th className="px-4 py-3">Content</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Engagement</th>
                <th className="px-4 py-3">Created</th>
                <th className="px-4 py-3">Actions</th>
              </tr>
            </TableHeader>
            <TableBody>
              {postsLoading ? (
                Array.from({ length: 5 }).map((_, i) => (
                  <TableRow key={i}>
                    <TableCell className="px-4 py-3">
                      <div className="animate-pulse h-4 w-32 bg-gray-300 rounded"></div>
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
              ) : userPosts.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="5" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <FiMessageSquare className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-300">No posts found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                userPosts.map((post) => (
                  <TableRow key={post._id}>
                    <TableCell className="px-4 py-3">
                      <div className="max-w-md">
                        <p className="text-sm text-gray-900 dark:text-gray-100 line-clamp-2">
                          {post.content}
                        </p>
                        {post.media && post.media.length > 0 && (
                          <div className="flex items-center space-x-2 mt-1">
                            <span className="text-xs text-gray-500">
                              {post.media.length} media file(s)
                            </span>
                          </div>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {getStatusBadge(post.status)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <FiHeart className="w-3 h-3" />
                          <span>{post.likes || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiMessageSquare className="w-3 h-3" />
                          <span>{post.comments || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiEye className="w-3 h-3" />
                          <span>{post.views || 0}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {formatDate(post.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => window.open(`/admin/post-details/${post._id}`, '_blank')}
                        aria-label="View post details"
                      >
                        <FiEye className="w-4 h-4" />
                      </Button>
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
            <div className="flex items-center justify-between">
              <span className="text-sm text-gray-600">
                Showing {userPosts.length} of {totalPages * postsPerPage} posts
              </span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="ghost"
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                >
                  Previous
                </Button>
                <span className="text-sm text-gray-600">
                  Page {currentPage} of {totalPages}
                </span>
                <Button
                  variant="ghost"
                  disabled={currentPage === totalPages}
                  onClick={() => setCurrentPage(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </div>
        )}
      </Card>
    </>
  );
};

export default UserDetails;
