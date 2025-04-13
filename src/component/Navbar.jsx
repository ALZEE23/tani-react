import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import Logo from "../assets/logo-removebg-preview 1.svg";
import { FaBars } from "react-icons/fa6";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isIndex, setIsIndex] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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
          <button
            onClick={() => setIsSidebarOpen(!isSidebarOpen)}
            className="text-lg font-semibold bg-[#4C563C] text-[#FFFFFF] py-3 px-7 rounded-[5px] z-20"
          >
            <FaBars />
          </button>
        </div>

       
        <div
          className={`fixed top-0 right-0 h-screen w-64 z-30 bg-[#D8DAD5] transform transition-transform duration-300 ease-in-out ${
            isSidebarOpen ? "translate-x-0" : "translate-x-full"
          } md:hidden`}
        >
          <div className="flex flex-col items-center pt-14 space-y-8">
            <button
              onClick={() => setIsSidebarOpen(false)}
              className="text-lg font-semibold bg-[#4C563C] text-[#FFFFFF] py-3 px-7 rounded-[5px]"
            >
              <FaBars />
            </button>
            <Link
              to="/"
              className="font-semibold text-lg"
              onClick={() => setIsSidebarOpen(false)}
            >
              Home
            </Link>
            {isIndex ? (
              <a
                href="#about"
                className="font-semibold text-lg"
                onClick={() => setIsSidebarOpen(false)}
              >
                About
              </a>
            ) : (
              <Link
                to="/"
                className="font-semibold text-lg"
                onClick={(e) => {
                  handleAboutClick(e);
                  setIsSidebarOpen(false);
                }}
              >
                About
              </Link>
            )}
            <Link
              to="/blog"
              className="font-semibold text-lg"
              onClick={() => setIsSidebarOpen(false)}
            >
              Blog
            </Link>
            <Link
              to="/login"
              className="text-lg font-semibold bg-[#4C563C] text-[#FFFFFF] py-3 px-7 rounded-[5px]"
              onClick={() => setIsSidebarOpen(false)}
            >
              Get Started
            </Link>
          </div>
        </div>

        
        {isSidebarOpen && (
          <div
            className="fixed inset-0 bg-black bg-opacity-50 md:hidden z-20"
            onClick={() => setIsSidebarOpen(false)}
          />
        )}
      </div>
    </nav>
  );
}
