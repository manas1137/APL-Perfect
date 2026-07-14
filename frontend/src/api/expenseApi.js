import api from "./axios";

const expenseApi = {
  submit: (data) => api.post("/expense/submit", data),
  getWallet: (params) => api.get("/expense/wallet", { params }),
  getHistory: (params) => api.get("/expense/history", { params }),
  getDetail: (id) => api.get(`/expense/payment/${id}`),
  getAdminSummary: (params) => api.get("/expense/admin/summary", { params }),
  getAdminHistory: (params) => api.get("/expense/admin/history", { params }),
  getAdminDetail: (id) => api.get(`/expense/admin/payment/${id}`),
};

export default expenseApi;
