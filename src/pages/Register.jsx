import { useState } from "react";
import { Link } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "../assets/free-photo-of-vietnamese-farmer-walking-in-lush-green-rice-field 2(1).svg";
import Logo from "../assets/logo-removebg-preview 1.svg";

export default function Register() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();

  };

  return (
    <div className="h-screen flex overflow-hidden">
      <div className="relative w-[50%] sm:flex hidden">
        <img
          src={Image}
          alt="Farmer in rice field"
          className="absolute w-[97%] h-[97%] object-cover m-3 rounded-lg"
        />
      </div>

      <div className="flex flex-col sm:w-[50%] w-[100%] bg-[#D8DAD5] h-full">
        <div className="flex flex-col items-center justify-center h-full w-full px-4 space-y-6">
          <img src={Logo} alt="" className="w-16 h-16" />
          <h1 className="text-4xl font-bold">Create Account</h1>
          <h1 className="w-[70%] text-center text-lg">
            Join our community and explore agricultural insights
          </h1>

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-5 md:w-[60%] w-[70%]"
          >
            <input
              type="text"
              placeholder="Username"
              className="border-black border-2 rounded-lg p-3 bg-[#D8DAD5] placeholder:text-black"
              required
            />
            <input
              type="email"
              placeholder="Email"
              className="border-black border-2 rounded-lg p-3 bg-[#D8DAD5] placeholder:text-black"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="Password"
                className="border-black border-2 rounded-lg p-3 bg-[#D8DAD5] placeholder:text-black w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showPassword ? <FaEyeSlash size={20} /> : <FaEye size={20} />}
              </button>
            </div>

            <div className="relative">
              <input
                type={showConfirmPassword ? "text" : "password"}
                placeholder="Confirm Password"
                className="border-black border-2 rounded-lg p-3 bg-[#D8DAD5] placeholder:text-black w-full"
                required
              />
              <button
                type="button"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-600 hover:text-gray-800"
              >
                {showConfirmPassword ? (
                  <FaEyeSlash size={20} />
                ) : (
                  <FaEye size={20} />
                )}
              </button>
            </div>

            <button
              type="submit"
              className="bg-[#4C563C] text-white text-lg py-3 rounded-lg font-bold hover:bg-[#5a6849] transition-colors"
            >
              Register
            </button>
            <div className="flex justify-center space-x-1">
              <span>Already have an account?</span>
              <Link
                to="/login"
                className="text-[#4C563C] font-semibold hover:underline"
              >
                Login here
              </Link>
            </div>
          </form>

          <div className="md:px-60 px-10">
            <p className="text-center text-sm">
              By registering, you agree to our Terms of Service and Privacy
              Policy
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
