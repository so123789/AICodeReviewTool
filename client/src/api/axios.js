import axios from "axios";

// Normalizes API base URL from process/vite environment variables.
// Ensures local development defaults to http://localhost:5000/api while
// deployed production builds seamlessly use VITE_API_URL without slash issues.
function getBaseURL() {
  const envUrl = import.meta.env.VITE_API_URL;
  if (!envUrl) return "http://localhost:5000/api";

  const trimmed = envUrl.trim().replace(/\/$/, "");
  return trimmed.endsWith("/api") ? trimmed : `${trimmed}/api`;
}

const API = axios.create({
  baseURL: getBaseURL(),
});

// Attach JWT token to every request automatically
API.interceptors.request.use((req) => {
  const token = localStorage.getItem("token");
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auto-handle 401 Unauthorized errors by clearing stale sessions
API.interceptors.response.use(
  (res) => res,
  (err) => {
    const url = err.config?.url || "";
    const isAuthRoute = url.includes("/auth/login") || url.includes("/auth/register");
    if (err.response?.status === 401 && !isAuthRoute && window.location.pathname !== "/login") {
      localStorage.removeItem("token");
      localStorage.removeItem("name");
      window.location.href = "/login";
    }
    return Promise.reject(err);
  }
);

export default API;
