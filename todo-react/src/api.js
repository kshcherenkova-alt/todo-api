import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
});

// Перехватчик: добавляет токен к каждому запросу
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// При 401 удаляем токен и просим войти заново
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem("token");
      window.dispatchEvent(new Event("auth-expired"));
    }
    return Promise.reject(err);
  },
);

export const login = (email, password) =>
  api.post("/auth/login", { email, password });
export const register = (email, password) =>
  api.post("/auth/register", { email, password });

export const fetchTasks = (search = "", signal) =>
  api.get("/tasks", { params: search ? { search } : {}, signal });
export const addTask = (task) => api.post("/tasks", task);
export const updateTask = (id, updated) => api.put(`/tasks/${id}`, updated);
export const deleteTask = (id) => api.delete(`/tasks/${id}`);
