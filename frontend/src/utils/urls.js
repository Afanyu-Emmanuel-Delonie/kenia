const defaultApiBase = import.meta.env.PROD
  ? "https://kenia-backend.onrender.com/api/v1"
  : "/api/v1";

export const API_BASE = import.meta.env.VITE_API_URL || defaultApiBase;
export const API_ORIGIN = API_BASE.replace(/\/api\/v1\/?$/, "");
