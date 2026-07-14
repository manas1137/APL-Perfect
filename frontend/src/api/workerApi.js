import api from "./axios";

const workerApi = {
  getAll: (params) => api.get("/workers", { params }),
  getById: (id) => api.get(`/workers/${id}`),
  create: (data) => api.post("/workers/add", data),
  update: (id, data) => api.put(`/workers/${id}`, data),
  delete: (id) => api.delete(`/workers/${id}`),
};

export default workerApi;