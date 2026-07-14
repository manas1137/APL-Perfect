import api from "./axios";

const paymentApi = {
  submit: (data) => api.post("/payment/submit", data),
  getHistory: (params) => api.get("/payment/history", { params }),
  getAll: (params) => api.get("/payment", { params }),
  getById: (id) => api.get(`/payment/${id}`),
  approve: (id) => api.patch(`/payment/${id}/approve`),
  reject: (id) => api.patch(`/payment/${id}/reject`),
};

export default paymentApi;