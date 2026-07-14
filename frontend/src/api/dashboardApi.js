import api from "./axios";

const dashboardApi = {
  getAdmin: () => api.get("/dashboard/admin"),
  getSite: () => api.get("/dashboard/site"),
};

export default dashboardApi;
