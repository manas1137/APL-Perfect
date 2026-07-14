import api from "./axios";

const paymentRequestApi = {
  getHistory: (params) => api.get("/payment/history", { params }),
  getAll: (params) => api.get("/payment", { params }),
  getById: (id) => api.get(`/payment/${id}`),
  submit: (data) => api.post("/payment/submit", data),
  approve: (id, adminRemark) => api.patch(`/payment/${id}/approve`, { adminRemark }),
  reject: (id, adminRemark) => api.patch(`/payment/${id}/reject`, { adminRemark }),
};

export default paymentRequestApi;
