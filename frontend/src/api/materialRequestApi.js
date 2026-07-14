import api from "./axios";

const materialRequestApi = {
  getHistory: (params) => api.get("/material-request/history", { params }),
  getAll: (params) => api.get("/material-request", { params }),
  getById: (id) => api.get(`/material-request/${id}`),
  submit: (data) => api.post("/material-request/submit", data),
  approve: (id, adminRemark) => api.patch(`/material-request/${id}/approve`, { adminRemark }),
  reject: (id, adminRemark) => api.patch(`/material-request/${id}/reject`, { adminRemark }),
};

export default materialRequestApi;
