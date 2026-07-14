import api from "./axios";

const notificationApi = {
  getAll: (params) => api.get("/notifications", { params }),
  getById: (id) => api.get(`/${id}`),
  read: (id) => api.patch(`/${id}/read`),
  readAll: () => api.patch("/notifications/read-all"),
  delete: (id) => api.delete(`/notifications/${id}`),
  deleteAll: () => api.delete("/notifications"),
  getUnreadCount: () => api.get("/unread-count"),
  getLatest: () => api.get("/latest"),
  getDashboard: () => api.get("/dashboard"),
  getSite: (params) => api.get("/notifications/site", { params }),
  getSiteUnreadCount: () => api.get("/notifications/site/unread-count"),
  readSite: (id) => api.patch(`/notifications/site/${id}/read`),
  readSiteAll: () => api.patch("/notifications/site/read-all"),
  deleteSite: (id) => api.delete(`/notifications/site/${id}`),
};

export default notificationApi;
