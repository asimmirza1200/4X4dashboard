import requests from "./httpService";

const PageServices = {
  addPage: async (body) => {
    return requests.post("/page/add", body);
  },
  getAllPages: async () => {
    return requests.get("/page");
  },
  getPageById: async (id) => {
    return requests.get(`/page/${id}`);
  },
  updatePage: async (id, body) => {
    return requests.put(`/page/${id}`, body);
  },
  deletePage: async (id) => {
    return requests.delete(`/page/${id}`);
  },
};

export default PageServices;
