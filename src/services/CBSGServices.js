import requests from "./httpService";

const CBSGServices = {
  // Build Management
  getAllBuilds: async ({ page = 1, limit = 20, search = "", approved, visibility, user_id, make, model, tags, sort_by, sort_dir }) => {
    let queryString = `/builds?page=${page}&limit=${limit}`;
    if (search) queryString += `&search=${encodeURIComponent(search)}`;
    if (approved !== undefined && approved !== null) queryString += `&approved=${approved}`;
    if (visibility) queryString += `&visibility=${visibility}`;
    if (user_id) queryString += `&user_id=${user_id}`;
    if (make) queryString += `&make=${encodeURIComponent(make)}`;
    if (model) queryString += `&model=${encodeURIComponent(model)}`;
    if (tags) queryString += `&tags=${encodeURIComponent(tags)}`;
    if (sort_by) queryString += `&sort_by=${sort_by}`;
    if (sort_dir) queryString += `&sort_dir=${sort_dir}`;
    return requests.get(queryString);
  },

  getBuildById: async (id) => {
    return requests.get(`/builds/${id}`);
  },

  approveBuild: async (id, body) => {
    return requests.patch(`/builds/${id}/approve`, body);
  },

  deleteBuild: async (id) => {
    return requests.delete(`/builds/${id}`);
  },

  // User Management
  getUsers: async ({ page = 1, limit = 20, search = "" }) => {
    let queryString = `/users/?page=${page}&limit=${limit}`;
    if (search) queryString += `&search=${encodeURIComponent(search)}`;
    return requests.get(queryString);
  },

  approveUser: async (body) => {
    return requests.post("/users/approve", body);
  },

  getUserProfile: async (id) => {
    return requests.get(`/users/${id}/profile`);
  },

  // Moderation
  getModerationQueue: async ({ type = "all", page = 1, limit = 50 }) => {
    return requests.get(`/moderation/queue?type=${type}&page=${page}&limit=${limit}`);
  },

  getModerationStats: async () => {
    return requests.get("/moderation/stats");
  },

  getModerationLogs: async ({ page = 1, limit = 50, action_type, target_type, moderator_id, start_date, end_date }) => {
    let queryString = `/moderation/logs?page=${page}&limit=${limit}`;
    if (action_type) queryString += `&action_type=${action_type}`;
    if (target_type) queryString += `&target_type=${target_type}`;
    if (moderator_id) queryString += `&moderator_id=${moderator_id}`;
    if (start_date) queryString += `&start_date=${start_date}`;
    if (end_date) queryString += `&end_date=${end_date}`;
    return requests.get(queryString);
  },

  disableUser: async (id, body) => {
    return requests.post(`/moderation/users/${id}/disable`, body);
  },

  disableBuild: async (id, body) => {
    return requests.post(`/moderation/builds/${id}/disable`, body);
  },

  deleteComment: async (id, body = {}) => {
    return requests.delete(`/moderation/comments/${id}`, body);
  },

  deletePost: async (id, body = {}) => {
    return requests.delete(`/moderation/posts/${id}`, body);
  },

  unflagComment: async (id) => {
    return requests.post(`/moderation/comments/${id}/unflag`);
  },

  // CBSG Settings
  getCBSGSettings: async () => {
    return requests.get("/settings/cbsg");
  },

  updateCBSGSettings: async (body) => {
    return requests.patch("/settings/cbsg", body);
  },
};

export default CBSGServices;

