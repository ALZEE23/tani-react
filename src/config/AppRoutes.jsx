// src/AppRoutes.jsx
import { Routes, Route } from "react-router-dom";
import Home from "../pages/Home";
import Blog from "../pages/Blog";
import Login from "../pages/Login";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/blog" element={<Blog />} />
      <Route path="/login" element={<Login />} />

    </Routes>
  );
};

export default AppRoutes;
