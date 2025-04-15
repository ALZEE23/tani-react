import axios from "axios";

const API = axios.create({
  baseURL:
    import.meta.env.API_BASE_URL || "https://tumbuhin-api.vercel.app/api",
  timeout: 30000,
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
export const register = async (userData) => {
  try {
    const response = await API.post("/register", userData);
    return response;
  } catch (error) {
    if (error.response?.status === 400) {
      
      const errorMessage = error.response.data?.error || "Registration failed";
      throw new Error(errorMessage);
    }
    throw error;
  }
};

export const getAllBlogs = () => API.get("/blogs");
export const getMyBlogs = () => API.get("/myblogs");
export const createBlog = (blogData) => {
  const formData = new FormData();
  formData.append("title", blogData.title);
  formData.append("publish", blogData.publish || false);

  
  const contentBlocks = blogData.content.map((block, index) => ({
    type: block.type,
    content: block.content || null,
    imageUrl: block.imageUrl || null,
    position: index + 1,
  }));
  formData.append("content", JSON.stringify(contentBlocks));

  
  if (blogData.image) {
    formData.append("image", blogData.image);
  }

  return API.post("/blogs", formData, {
    headers: { "Content-Type": "multipart/form-data" },
    timeout: 30000,
  });
};

export const updateBlog = (id, blogData) => {
  const formData = new FormData();
  formData.append("title", blogData.title);

  const contentBlocks = blogData.content.map((block, index) => ({
    type: block.type,
    content: block.content,
    position: index + 1,
  }));
  formData.append("content", JSON.stringify(contentBlocks));

  if (blogData.image) {
    formData.append("image", blogData.image);
  }

  return API.put(`/blogs/${id}`, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

export const deleteBlog = (id) => API.delete(`/blogs/${id}`);

export const getBookmarks = () => API.get("/bookmarks");
export const addBookmark = (blogId) => API.post("/bookmarks", { blogId });
export const deleteBookmark = (id) => API.delete(`/bookmarks/${id}`);

export const updateUser = (userData) => {
  const token = localStorage.getItem("token");
  return API.put("https://tumbuhin-api.vercel.app/api/user", userData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json",
    },
  });
};

export const getUser = () => API.get("/user");

export const getProtectedData = () => API.get("/protected");

export default API;
