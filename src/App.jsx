// src/App.jsx
import AppRoutes from "./config/AppRoutes";
import Navbar from "./component/Navbar";
import { useLocation } from "react-router-dom";
import { useEffect, useState } from "react";

function App() {
  const location = useLocation();
  const [isNavbar, setIsNavbar] = useState(true);
  useEffect(() => {
    if (location.pathname === "/login" || location.pathname === "/register") {
      setIsNavbar(false);   
    }
  },[location]);
  return (
    <div className="bg-[#F1E9E9] text-[#1b1b18] w-screen min-h-screen overflow-x-hidden">
      {isNavbar && (
          <Navbar />
      )}
      <AppRoutes />
    </div>
  );
}

export default App;
