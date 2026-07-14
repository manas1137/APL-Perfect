import api from "./axios";

const materialApi = {
  getAll: (params) => api.get("/materials", { params }),
  getById: (id) => api.get(`/materials/${id}`),
  create: (data) => api.post("/materials/add", data),
  update: (id, data) => api.put(`/materials/${id}`, data),
  delete: (id) => api.delete(`/materials/${id}`),
};

export default materialApi;