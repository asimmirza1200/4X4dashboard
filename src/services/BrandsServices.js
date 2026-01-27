import requests from './httpService';

const BrandServices = {
  // Get all brands with search, filter, pagination
  getAllBrands: async ({
    page = 1,
    limit = 50,
    search = '',
    is_active,
    sort_by = 'name',
    sort_dir = 'asc',
  }) => {
    let queryString = `/brand?page=${page}&limit=${limit}`;
    if (search) queryString += `&search=${encodeURIComponent(search)}`;
    if (is_active !== undefined && is_active !== '') {
      queryString += `&is_active=${is_active}`;
    }
    if (sort_by) queryString += `&sort_by=${sort_by}`;
    if (sort_dir) queryString += `&sort_dir=${sort_dir}`;
    return requests.get(queryString);
  },

  // Get brand by ID
  getBrandById: async (id) => {
    return requests.get(`/brand/${id}`);
  },

  // Create new brand
  addBrand: async (body) => {
    return requests.post('/brand', body);
  },

  // Update brand
  updateBrand: async (id, body) => {
    return requests.patch(`/brand/${id}`, body);
  },

  // Delete brand
  deleteBrand: async (id) => {
    return requests.delete(`/brand/${id}`);
  },

  // Get products for a brand
  getBrandProducts: async (id, { page = 1, limit = 50 }) => {
    return requests.get(`/brand/${id}/products?page=${page}&limit=${limit}`);
  },

  // Contact management
  getBrandContacts: async (id) => {
    return requests.get(`/brand/${id}/contacts`);
  },

  addBrandContact: async (id, body) => {
    return requests.post(`/brand/${id}/contacts`, body);
  },

  updateBrandContact: async (id, contactId, body) => {
    return requests.patch(`/brand/${id}/contacts/${contactId}`, body);
  },

  deleteBrandContact: async (id, contactId) => {
    return requests.delete(`/brand/${id}/contacts/${contactId}`);
  },
};

export default BrandServices;
