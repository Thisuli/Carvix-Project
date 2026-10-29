import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

/* Attach admin JWT automatically */
api.interceptors.request.use(
  (config) => {
    const token =
      localStorage.getItem("carvixAdminToken") ||
      sessionStorage.getItem("carvixAdminToken");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

/* Handle expired / invalid admin sessions */
api.interceptors.response.use(
  (response) => response,

  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("carvixAdminToken");
      localStorage.removeItem("carvixAdmin");

      sessionStorage.removeItem("carvixAdminToken");
      sessionStorage.removeItem("carvixAdmin");

      const isAdminPage =
        window.location.pathname.startsWith("/admin");

      const isLoginPage =
        window.location.pathname === "/admin-login";

      if (isAdminPage && !isLoginPage) {
        window.location.href = "/admin-login";
      }
    }

    return Promise.reject(error);
  }
);

export default api;