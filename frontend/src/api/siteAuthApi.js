import api from "./axios";

const siteAuthApi = {
  login: (data) => api.post("/site/auth/login", data),
  logout: () => api.post("/site/auth/logout"),
};

export default siteAuthApi;
