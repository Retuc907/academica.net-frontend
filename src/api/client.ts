import axios from "axios";

export const TOKEN_KEY = "academianet_token";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  timeout: 15_000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// ─── Interceptor de Request ───────────────────────────────────────────────
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // Log seguro: config.data puede ser string o objeto según el estado de serialización
    const bodyLog = config.data
      ? (typeof config.data === "string" ? JSON.parse(config.data) : config.data)
      : {};
    console.log("📤 [API] Request →", config.method?.toUpperCase(), `${config.baseURL ?? ""}${config.url ?? ""}`, bodyLog);
    return config;
  },
  (error) => Promise.reject(error)
);

// ─── Interceptor de Response ──────────────────────────────────────────────
apiClient.interceptors.response.use(
  (response) => {
    console.log("📥 [API] Response →", response.status, response.config.url, response.data);
    return response;
  },
  (error) => {
    const isTimeout = error.code === "ECONNABORTED" || error.message?.includes("timeout");
    if (isTimeout) {
      console.error("📥 [API] Timeout → el servidor tardó demasiado en responder (¿Render en cold start?)");
    } else {
      console.error("📥 [API] Error →", error?.response?.status, error?.response?.config?.url, error?.response?.data);
    }
    if (error.response?.status === 401) {
      localStorage.removeItem(TOKEN_KEY);
      window.location.href = "/";
    }
    return Promise.reject(error);
  }
);

export default apiClient;
