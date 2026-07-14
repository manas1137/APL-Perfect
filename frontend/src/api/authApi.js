import api from "./axios";

const authApi = {
  login: (data) => api.post("/auth/login", data),
  logout: () => api.post("/auth/logout"),
};

export default authApi;