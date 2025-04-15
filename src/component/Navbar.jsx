import { Link, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import Logo from "../assets/logo-removebg-preview 1.svg";
import {
  FaBars,
  FaUser,
  FaChevronDown,
  FaArrowRightToBracket,
  FaBookmark,
  FaBlog,
  FaUpload,
} from "react-icons/fa6";

export default function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [isIndex, setIsIndex] = useState(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [showProfileMenu, setShowProfileMenu] = useState(false);
  const profileMenuRef = useRef(null);

  useEffect(() => {
    setIsIndex(location.pathname === "/");

    if (location.hash === "#about") {
      setTimeout(() => {
        const element = document.getElementById("about");
        element?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    }

    // Check if user is logged in
    const token = localStorage.getItem("token");
    setIsAuthenticated(!!token);

    // Close dropdown when clicking outside
    const handleClickOutside = (event) => {
      if (
        profileMenuRef.current &&
        !profileMenuRef.current.contains(event.target)
      ) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
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

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  // Replace the Get Started button with this profile section
  const renderAuthButton = () => {
    if (isAuthenticated) {
      return (
        <div className="relative" ref={profileMenuRef}>
          <button
            onClick={() => setShowProfileMenu(!showProfileMenu)}
            className="flex items-center space-x-2 text-lg font-semibold bg-[#4C563C] text-[#FFFFFF] py-3 px-7 rounded-[5px]"
          >
            <div className="w-8 h-8 rounded-full bg-white flex items-center justify-center">
              <FaUser className="text-[#4C563C]" />
            </div>
            <FaChevronDown
              className={`transition-transform ${
                showProfileMenu ? "rotate-180" : ""
              }`}
            />
          </button>

          {/* Profile Dropdown */}
          {showProfileMenu && (
            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50">
              <Link
                to="/formblog"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setShowProfileMenu(false)}
              >
                <FaUpload className="mr-2" />
                Upload Blog
              </Link>
              <Link
                to="/bookmark"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setShowProfileMenu(false)}
              >
                <FaBookmark className="mr-2" />
                Bookmark
              </Link>
              <Link
                to="/myblog"
                className="flex items-center px-4 py-2 text-gray-700 hover:bg-gray-100"
                onClick={() => setShowProfileMenu(false)}
              >
                <FaBlog className="mr-2" />
                My Blog
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-gray-100"
              >
                <FaArrowRightToBracket className="mr-2" />
                Logout
              </button>
            </div>
          )}
        </div>
      );
    }

    return (
      <Link
        to="/login"
        className="text-lg font-semibold bg-[#4C563C] text-[#FFFFFF] py-3 px-7 rounded-[5px]"
      >
        Get Started
      </Link>
    );
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
          {renderAuthButton()}
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

            {isAuthenticated ? (
              <>
                <Link
                  to="/formblog"
                  className="flex items-center gap-2 font-semibold text-lg"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FaUpload /> Upload Blog
                </Link>
                <Link
                  to="/bookmark"
                  className="flex items-center gap-2 font-semibold text-lg"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FaBookmark /> Bookmark
                </Link>
                <Link
                  to="/myblog"
                  className="flex items-center gap-2 font-semibold text-lg"
                  onClick={() => setIsSidebarOpen(false)}
                >
                  <FaBlog /> My Blog
                </Link>
                <button
                  onClick={() => {
                    handleLogout();
                    setIsSidebarOpen(false);
                  }}
                  className="flex items-center gap-2 text-lg font-semibold text-red-600"
                >
                  <FaArrowRightToBracket /> Logout
                </button>
              </>
            ) : (
              <Link
                to="/login"
                className="text-lg font-semibold bg-[#4C563C] text-[#FFFFFF] py-3 px-7 rounded-[5px]"
                onClick={() => setIsSidebarOpen(false)}
              >
                Get Started
              </Link>
            )}
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
