import { Link } from "react-router-dom";
import Logo from "../assets/logo-removebg-preview 1.svg";

export default function Navbar() {
  return (
    <nav className="flex w-full h-25 px-16 py-10 mt-2">
      <div className="my-auto justify-between flex w-screen">
        <img src={Logo} alt="" className="w-16 h-16" />
        <div className="space-x-10 my-auto md:flex hidden">
          <Link to="/" className="font-semibold text-lg">
            Home
          </Link>
          <a href="#about" className="font-semibold text-lg">
            About
          </a>
          <Link to="/blog" className="font-semibold text-lg">
            Blog
          </Link>
        </div>
        <div className="my-auto space-x-5">
          <Link
            href=""
            className="text-lg font-semibold bg-[#4C563C] text-[#FFFFFF] py-3 px-7 rounded-[5px]"
          >
            Get Started
          </Link>
        </div>
      </div>
    </nav>
  );
}
