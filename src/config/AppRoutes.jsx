// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import PrivateRoute from "./PrivateRoute";
import Home from "../pages/Home";
import Blog from "../pages/Blog";
import Login from "../pages/Login";
import Register from "../pages/Register";
import MyBlog from "../pages/MyBlog";
import BlogDetail from "../pages/BlogDetail";
import Bookmark from "../pages/Bookmark";
import FormBlog from "../pages/FormBlog";
import Profile from "../pages/Profile";

const AppRoutes = () => {
  return (
    <Routes>
      
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/blogdetail/:id" element={<BlogDetail />} />

      
      <Route element={<PrivateRoute />}>
        <Route path="/myblog" element={<MyBlog />} />
        <Route path="/bookmark" element={<Bookmark />} />
        <Route path="/formblog" element={<FormBlog />} />
        <Route path="/formblog/:id" element={<FormBlog />} />
        <Route path="/profile" element={<Profile />} />
      </Route>
    </Routes>
  );
};

export default AppRoutes;
