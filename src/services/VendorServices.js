import requests from "./httpService";

const VendorServices = {
  getAllVendors: async ({ searchText = "" } = {}) => {
    return requests.get(`/vendor?searchText=${searchText}`);
  },

  getVendorById: async (id) => {
    return requests.get(`/vendor/${id}`);
  },

  createVendor: async (body) => {
    return requests.post("/vendor/create", body);
  },

  updateVendor: async (id, body) => {
    return requests.put(`/vendor/${id}`, body);
  },

  deleteVendor: async (id) => {
    return requests.delete(`/vendor/${id}`);
  },

  updateVendorStatus: async (id, body) => {
    return requests.put(`/vendor/status/${id}`, body);
  },
};

export default VendorServices;
