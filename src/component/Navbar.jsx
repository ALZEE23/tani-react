import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../assets/logo-removebg-preview 1.svg";
import { FaBars } from "react-icons/fa6";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isIndex, setIsIndex] = useState(true);

  useEffect(() => {
    setIsIndex(location.pathname === "/");
    
    if (location.hash === "#about") {
      setTimeout(() => {
        const element = document.getElementById("about");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  }, [location]);

  const handleAboutClick = (e) => {
    if (!isIndex) {
      e.preventDefault();
      navigate("/");
      setTimeout(() => {
        const element = document.getElementById("about");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }
  };

  return (
    <nav className="flex w-full h-25 md:px-16 px-10 py-10 mt-2">
      <div className="my-auto justify-between flex w-screen">
        <img src={Logo} alt="" className="w-16 h-16" />
        <div className="space-x-10 my-auto md:flex hidden">
          <Link to="/" className="font-semibold text-lg">
            Home
          </Link>
          {isIndex ? (
            <a href="#about" className="font-semibold text-lg">
              About
            </a>
          ) : (
            <Link
              to="/"
              className="font-semibold text-lg"
              onClick={handleAboutClick}
            >
              About
            </Link>
          )}
          <Link to="/blog" className="font-semibold text-lg">
            Blog
          </Link>
        </div>
        <div className="my-auto space-x-5 md:flex hidden">
          <Link
            to="/login"
            className="text-lg font-semibold bg-[#4C563C] text-[#FFFFFF] py-3 px-7 rounded-[5px] "
          >
            Get Started
          </Link>
        </div>
        <div className="my-auto space-x-5 md:hidden flex">
          <Link
            to="/login"
            className="text-lg font-semibold bg-[#4C563C] text-[#FFFFFF] py-3 px-7 rounded-[5px] "
          >
            <FaBars></FaBars>
          </Link>
        </div>
      </div>
    </nav>
  );
}
