import React, { useState, useEffect } from "react";
import { useHistory } from "react-router-dom";
import {
  FiUsers,
  FiMail,
  FiCalendar,
  FiMessageSquare,
  FiHeart,
  FiXCircle,
  FiTrash2,
  FiSearch,
  FiFilter,
  FiDownload,
  FiRefreshCw,
  FiEye,
  FiShield,
  FiTrendingUp
} from "react-icons/fi";
import PageTitle from "@/components/common/PageTitle";
import requests from "@/services/httpService";
import { getImageUrl } from "@/utils/getImageUrl";
import UserRowActions from "@/components/community/UserRowActions";
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
  Dropdown,
  DropdownItem,
  Pagination,
  Avatar
} from "@windmill/react-ui";

const UserManagement = () => {
  const history = useHistory();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [showBlockModal, setShowBlockModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const usersPerPage = 20;

  useEffect(() => {
    fetchUsers();
  }, [filter, statusFilter, searchTerm, currentPage]);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        page: currentPage,
        limit: usersPerPage,
        filter: filter,
        status: statusFilter,
        search: searchTerm,
        includeStats: "true"
      });

      const data = await requests.get(`/admin/users/post-stats?${params}`);
      
      setUsers(data.users || []);
      setTotalPages(Math.ceil(data.total / usersPerPage));
    } catch (error) {
      console.error("Failed to fetch users:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBlockUser = async (userId, isBlocked) => {
    try {
      if (isBlocked) {
        await requests.delete(`/admin/users/${userId}/block`);
      } else {
        await requests.post(`/admin/users/${userId}/block`);
      }
      setUsers(users.map(user => 
        user.id === userId ? { ...user, isBlocked: !isBlocked } : user
      ));
      setShowBlockModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to block/unblock user:", error);
    }
  };

  const handleDeleteUser = async (userId) => {
    try {
      await requests.delete(`/admin/users/${userId}`);
      setUsers(users.filter(user => user._id !== userId));
      setShowDeleteModal(false);
      setSelectedUser(null);
    } catch (error) {
      console.error("Failed to delete user:", error);
    }
  };

  const getStatusBadge = (user) => {
    if (user.isBlocked) {
      return <Badge type="danger">Blocked</Badge>;
    }
    if (user.isAdmin) {
      return <Badge type="success">Admin</Badge>;
    }
    if (user.isModerator) {
      return <Badge type="warning">Moderator</Badge>;
    }
    return <Badge type="neutral">User</Badge>;
  };

  const formatDate = (timestamp) => {
    return new Date(timestamp).toLocaleDateString();
  };

  const formatNumber = (num) => {
    if (num >= 1000) {
      return (num / 1000).toFixed(1) + "K";
    }
    return num.toString();
  };

  const exportData = async () => {
    try {
      const response = await requests.get(`/admin/users/export?filter=${filter}&status=${statusFilter}`, {
        responseType: "blob"
      });
      const url = window.URL.createObjectURL(response);
      const a = document.createElement('a');
      a.href = url;
      a.download = `community-users-${new Date().toISOString().split('T')[0]}.csv`;
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
      <PageTitle>User Management</PageTitle>

      {/* Quick Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6 mt-6">
        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Total Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {formatNumber(users.length)}
              </p>
            </div>
            <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
              <FiUsers className="w-6 h-6 text-blue-600 dark:text-blue-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Active Today
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.filter(u => u.isActive).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
              <FiTrendingUp className="w-6 h-6 text-green-600 dark:text-green-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                Blocked Users
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.filter(u => u.isBlocked).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-red-100 dark:bg-red-900 rounded-lg flex items-center justify-center">
              <FiXCircle className="w-6 h-6 text-red-600 dark:text-red-400" />
            </div>
          </div>
        </Card>

        <Card className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                New This Week
              </p>
              <p className="text-2xl font-bold text-gray-900 dark:text-gray-100">
                {users.filter(u => {
                  const weekAgo = new Date();
                  weekAgo.setDate(weekAgo.getDate() - 7);
                  return new Date(u.createdAt) > weekAgo;
                }).length}
              </p>
            </div>
            <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
              <FiCalendar className="w-6 h-6 text-purple-600 dark:text-purple-400" />
            </div>
          </div>
        </Card>
      </div>

      {/* Filters and Actions */}
      <Card className="p-6 mb-6">
        <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center space-y-4 lg:space-y-0">
          <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-4">
            <div className="flex items-center space-x-2">
              <FiFilter className="w-4 h-4 text-gray-500" />
              <Select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="w-32"
              >
                <option value="all">All Users</option>
                <option value="active">Active</option>
                <option value="inactive">Inactive</option>
                <option value="new">New Users</option>
                <option value="top">Top Posters</option>
              </Select>
            </div>

            <div className="flex items-center space-x-2">
              <Select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="w-32"
              >
                <option value="all">All Status</option>
                <option value="user">Users</option>
                <option value="moderator">Moderators</option>
                <option value="admin">Admins</option>
                <option value="blocked">Blocked</option>
              </Select>
            </div>

            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <FiSearch className="text-gray-400 w-4 h-4" />
              </div>
              <Input
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search users..."
                className="pl-10 w-64"
              />
            </div>
          </div>

          <div className="flex items-center space-x-2">
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
              onClick={fetchUsers}
              className="flex items-center space-x-2"
            >
              <FiRefreshCw className="w-4 h-4" />
              <span>Refresh</span>
            </Button>
          </div>
        </div>
      </Card>

      {/* Users Table */}
      <Card className="overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <tr>
                <th className="px-4 py-3">User</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Posts</th>
                <th className="px-4 py-3">Engagement</th>
                <th className="px-4 py-3">Joined</th>
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
                      <div className="animate-pulse h-4 w-32 bg-gray-300 rounded"></div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="animate-pulse h-4 w-16 bg-gray-300 rounded"></div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="animate-pulse h-4 w-12 bg-gray-300 rounded"></div>
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
              ) : users.length === 0 ? (
                <TableRow>
                  <TableCell colSpan="7" className="px-4 py-8 text-center">
                    <div className="flex flex-col items-center">
                      <FiUsers className="w-12 h-12 text-gray-400 mb-4" />
                      <p className="text-gray-600 dark:text-gray-300">No users found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                users.map((user) => (
                  <TableRow key={user._id}>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center space-x-3">
                        <Avatar
                          src={getImageUrl(user.image)}
                          alt={user.name}
                          className="w-10 h-10"
                        />
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-gray-100">
                            {user.name}
                          </p>
                          <p className="text-xs text-gray-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      {getStatusBadge(user)}
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <FiMessageSquare className="w-3 h-3" />
                          <span>{user.postCount || 0}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center space-x-1">
                          <FiHeart className="w-3 h-3" />
                          <span>{user.totalLikes || 0}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <FiMessageSquare className="w-3 h-3" />
                          <span>{user.totalComments || 0}</span>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <span className="text-sm text-gray-600">
                        {formatDate(user.createdAt)}
                      </span>
                    </TableCell>
                    <TableCell className="px-4 py-3">
                      <div className="flex items-center space-x-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => history.push(`/admin/user-details/${user._id}`)}
                          aria-label="View user details"
                        >
                          <FiEye className="w-4 h-4" />
                        </Button>
                        
                        <UserRowActions
                          user={user}
                          onBlockUser={(user) => {
                            setSelectedUser(user);
                            setShowBlockModal(true);
                          }}
                          onDeleteUser={(user) => {
                            setSelectedUser(user);
                            setShowDeleteModal(true);
                          }}
                        />
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

      {/* Block User Modal */}
      <Modal isOpen={showBlockModal} onClose={() => setShowBlockModal(false)}>
        <Modal.Header>
          {selectedUser?.isBlocked ? "Unblock User" : "Block User"}
        </Modal.Header>
        <Modal.Body>
          <p>
            Are you sure you want to {selectedUser?.isBlocked ? "unblock" : "block"}{" "}
            <strong>{selectedUser?.name}</strong>?
          </p>
          {!selectedUser?.isBlocked && (
            <p className="mt-2 text-sm text-gray-600">
              Blocked users cannot create posts, comment, or interact with the community.
            </p>
          )}
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="ghost"
            onClick={() => setShowBlockModal(false)}
          >
            Cancel
          </Button>
          <Button
            onClick={() => handleBlockUser(selectedUser.id, selectedUser.isBlocked)}
            className={selectedUser?.isBlocked ? "bg-green-600 hover:bg-green-700" : "bg-yellow-600 hover:bg-yellow-700"}
          >
            {selectedUser?.isBlocked ? "Unblock" : "Block"}
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Delete User Modal */}
      <Modal isOpen={showDeleteModal} onClose={() => setShowDeleteModal(false)}>
        <Modal.Header>Delete User</Modal.Header>
        <Modal.Body>
          <p className="text-red-600 font-medium mb-2">
            ⚠️ This action cannot be undone!
          </p>
          <p>
            Are you sure you want to permanently delete <strong>{selectedUser?.name}</strong>?
          </p>
          <p className="mt-2 text-sm text-gray-600">
            This will remove all their posts, comments, and data from the system.
          </p>
        </Modal.Body>
        <Modal.Footer>
          <Button
            variant="ghost"
            onClick={() => setShowDeleteModal(false)}
          >
            Cancel
          </Button>
          <Button
            variant="danger"
            onClick={() => handleDeleteUser(selectedUser.id)}
          >
            Delete Permanently
          </Button>
        </Modal.Footer>
      </Modal>
    </>
  );
};

export default UserManagement;
