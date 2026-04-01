import requests from "./httpService";

const CMServices = {
  // Get all CMS content
  getAllCMS: async () => {
    try {
      const response = await requests.get("/cms");
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Get specific page content
  getCMSByPage: async (page) => {
    try {
      const response = await requests.get(`/cms/${page}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create/Update page content
  updateCMSContent: async (page, data) => {
    try {
      const response = await requests.put(`/cms/${page}`, data);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Create new page content
  createCMSContent: async (data) => {
    try {
      const response = await requests.put(`/cms/${data.page}`, data);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },

  // Delete page content
  deleteCMSContent: async (page) => {
    try {
      const response = await requests.delete(`/cms/${page}`);
      return response;
    } catch (error) {
      throw error.response?.data || error.message;
    }
  },
};

export default CMServices;
