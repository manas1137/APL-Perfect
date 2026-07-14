import api from "./axios";

const attendanceApi = {
  submit: (data) => api.post("/attendance/submit", data),
  getHistory: (params) => api.get("/attendance/history", { params }),
  getAll: (params) => api.get("/attendance", { params }),
  getById: (id) => api.get(`/attendance/${id}`),
  approve: (id, adminRemark) => api.patch(`/attendance/${id}/approve`, { adminRemark }),
  reject: (id, adminRemark) => api.patch(`/attendance/${id}/reject`, { adminRemark }),
};

export default attendanceApi;
