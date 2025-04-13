import axios from "axios";

const API = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api",
  timeout: 5000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

API.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

API.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);


export const login = (data) => API.post("/login", data);
export const register = (data) => API.post("/register", data);


export const getAllBlogs = () => API.get("/blogs");
export const getMyBlogs = () => API.get("/myblogs");
export const createBlog = (formData) =>
  API.post("/blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const updateBlog = (id, formData) =>
  API.put(`/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
export const deleteBlog = (id) => API.delete(`/blogs/${id}`);


export const getBookmarks = () => API.get("/bookmarks");
export const addBookmark = (blogId) => API.post("/bookmarks", { blogId });
export const deleteBookmark = (id) => API.delete(`/bookmarks/${id}`);


export const updateUser = (data) => API.put("/user", data);


export const getProtectedData = () => API.get("/protected");

export default API;
