import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

console.log("[Axios] Instance created. baseURL:", import.meta.env.VITE_API_URL);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error.response?.status;
    const url = error.config?.url || "";

    if (status === 401 && !url.includes("/auth/")) {
      if (typeof window !== "undefined") {
        window.location.href = "/auth";
      }
    }

    return Promise.reject(error);
  }
);

export default api;
