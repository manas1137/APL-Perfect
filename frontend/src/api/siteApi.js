import api from "./axios";

const siteApi = {
  getAll: (params) => api.get("/sites", { params }),
  getById: (id) => api.get(`/sites/${id}`),
  getAssignedWorkers: (id) => api.get(`/sites/${id}/assigned-workers`),
  getStats: (id) => api.get(`/sites/${id}/stats`),
  create: (data) => api.post("/sites", data),
  update: (id, data) => api.put(`/sites/${id}`, data),
  delete: (id) => api.delete(`/sites/${id}`),
  dashboard: () => api.get("/site/dashboard"),
  details: () => api.get("/site/details"),
  materials: () => api.get("/site/materials"),
  assignedWorkers: () => api.get("/site/assigned-workers"),
};

export default siteApi;