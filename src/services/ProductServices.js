import requests from "./httpService";

const ProductServices = {
  getAllProducts: async ({
    page,
    limit,
    category,
    title,
    price,
    search,
    sort_by,
    sort_dir,
    status, // Phase 3: Status filter
    product_type, // Phase 3: Product type filter
    stock_status, // Phase 3: Stock status filter
    brand, // Phase 3: Brand filter
  }) => {
    const searchCategory = category !== null ? category : "";
    const searchTitle = title !== null ? title : "";
    const searchPrice = price !== null ? price : "";
    const searchTerm = search !== null ? search : searchTitle;
    const sortBy = sort_by || "";
    const sortDir = sort_dir || "";

    let queryString = `/products?page=${page}&limit=${limit}`;
    if (searchCategory) queryString += `&category=${searchCategory}`;
    if (searchTerm) queryString += `&search=${encodeURIComponent(searchTerm)}`;
    // Only send price if sort_by is not set (to avoid conflicts)
    if (searchPrice && !sortBy) queryString += `&price=${searchPrice}`;
    if (sortBy) queryString += `&sort_by=${sortBy}`;
    if (sortDir) queryString += `&sort_dir=${sortDir}`;
    // Always send status (even if "all" - backend handles it)
    if (status !== undefined && status !== null && status !== "")
      queryString += `&status=${status}`;
    if (product_type) queryString += `&product_type=${product_type}`;
    if (stock_status) queryString += `&stock_status=${stock_status}`;
    if (brand) queryString += `&brand=${brand}`;
    // Ensure vendor data is populated
    queryString += `&populate=vendor`;

    return requests.get(queryString);
  },

  // Phase 3: Get status counts for tabs
  getProductStatusCounts: async () => {
    return requests.get("/products/status/counts");
  },

  getProductById: async (id) => {
    return requests.post(`/products/${id}`);
  },
  addProduct: async (body) => {
    return requests.post("/products/add", body);
  },
  addAllProducts: async (body) => {
    return requests.post("/products/all", body);
  },
  updateProduct: async (id, body) => {
    return requests.patch(`/products/${id}`, body);
  },
  updateManyProducts: async (body) => {
    return requests.patch("products/update/many", body);
  },
  updateStatus: async (id, body) => {
    return requests.put(`/products/status/${id}`, body);
  },

  deleteProduct: async (id) => {
    return requests.delete(`/products/${id}`);
  },
  deleteManyProducts: async (body) => {
    return requests.patch("/products/delete/many", body);
  },

  // Phase 4: Duplicate product
  duplicateProduct: async (id) => {
    return requests.post(`/products/duplicate/${id}`);
  },

  // Phase 5: Bulk update products (for featured, stock status, etc.)
  bulkUpdateProducts: async (body) => {
    return requests.patch("/products/update/many", body);
  },

  // Phase 6: Export products to CSV
  exportProductsToCSV: async (params) => {
    const queryString = Object.keys(params)
      .filter(
        (key) =>
          params[key] !== null &&
          params[key] !== undefined &&
          params[key] !== ""
      )
      .map((key) => `${key}=${encodeURIComponent(params[key])}`)
      .join("&");

    return requests.get(
      `/products/export/csv${queryString ? "?" + queryString : ""}`,
      {
        responseType: "blob", // Important for file download
      }
    );
  },
};

export default ProductServices;
