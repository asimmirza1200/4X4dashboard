import requests from "./httpService";

const OrderServices = {
  getAllOrders: async ({
    body,
    headers,
    customerName,
    customer,
    status,
    page = 1,
    limit = 50,
    day,
    method,
    startDate,
    endDate,
    origin,
    search,
    sortBy,
    sortOrder,
    includeTrashed,
  }) => {
    // Build query params
    const params = new URLSearchParams();
    if (page) params.append("page", page);
    if (limit) params.append("limit", limit);
    if (status) params.append("status", status);
    if (customerName) params.append("customerName", customerName);
    if (customer) params.append("customer", customer);
    if (day) params.append("day", day);
    if (method) params.append("method", method);
    if (startDate) params.append("startDate", startDate);
    if (endDate) params.append("endDate", endDate);
    if (origin) params.append("origin", origin);
    if (search) params.append("search", search);
    if (sortBy) params.append("sortBy", sortBy);
    if (sortOrder) params.append("sortOrder", sortOrder);
    if (includeTrashed) params.append("includeTrashed", includeTrashed);

    return requests.get(`/orders?${params.toString()}`, body, headers);
  },

  getAllOrdersTwo: async ({ invoice, body, headers }) => {
    const searchInvoice = invoice !== null ? invoice : "";
    return requests.get(`/orders/all?invoice=${searchInvoice}`, body, headers);
  },

  getRecentOrders: async ({
    page = 1,
    limit = 8,
    startDate = "1:00",
    endDate = "23:59",
  }) => {
    return requests.get(
      `/orders/recent?page=${page}&limit=${limit}&startDate=${startDate}&endDate=${endDate}`
    );
  },

  getOrderCustomer: async (id, body) => {
    return requests.get(`/orders/customer/${id}`, body);
  },

  // OMS: Bulk update orders
  bulkUpdateOrders: async (data, body, headers) => {
    return requests.post(`/orders/bulk`, data, body, headers);
  },

  // OMS: Add note to order
  addOrderNote: async (id, data, body, headers) => {
    return requests.post(`/orders/${id}/notes`, data, body, headers);
  },

  // OMS: Export orders to CSV
  exportOrders: async (params, body, headers) => {
    const queryString = new URLSearchParams(params).toString();
    return requests.get(`/orders/export?${queryString}`, body, headers);
  },

  getOrderById: async (id, body) => {
    return requests.get(`/orders/${id}`, body);
  },

  updateOrder: async (id, body, headers) => {
    return requests.put(`/orders/${id}`, body, headers);
  },

  deleteOrder: async (id) => {
    return requests.delete(`/orders/${id}`);
  },

  getDashboardOrdersData: async ({
    page = 1,
    limit = 8,
    endDate = "23:59",
  }) => {
    return requests.get(
      `/orders/dashboard?page=${page}&limit=${limit}&endDate=${endDate}`
    );
  },

  getDashboardAmount: async () => {
    return requests.get("/orders/dashboard-amount");
  },

  getDashboardCount: async () => {
    return requests.get("/orders/dashboard-count");
  },

  getDashboardRecentOrder: async ({ page = 1, limit = 8 }) => {
    return requests.get(
      `/orders/dashboard-recent-order?page=${page}&limit=${limit}`
    );
  },

  getBestSellerProductChart: async () => {
    return requests.get("/orders/best-seller/chart");
  },
};

export default OrderServices;
