import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { register } from "../config/Api";
import Image from "../assets/free-photo-of-vietnamese-farmer-walking-in-lush-green-rice-field 2(1).svg";
import Logo from "../assets/logo-removebg-preview 1.svg";

export default function Register() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    // Validate password match
    if (formData.password !== formData.confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    // Validate password length
    if (formData.password.length < 6) {
      setError("Password must be at least 6 characters long");
      return;
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) {
      setError("Please enter a valid email address");
      return;
    }

    try {
      setIsLoading(true);
      const registerData = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
      };

      console.log("Sending registration data:", registerData);

      const response = await register(registerData);
      console.log("Registration response:", response);

      if (response.data?.userId) {
        navigate("/login");
      } else {
        throw new Error("Registration failed - no user ID received");
      }
    } catch (err) {
      console.error("Registration error details:", {
        message: err.message,
        response: err.response?.data,
        status: err.response?.status,
      });

      setError(
        err.response?.data?.error ||
          err.response?.data?.message ||
          "Registration failed. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
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

          {error && (
            <div className="text-red-600 text-sm text-center">{error}</div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-5 md:w-[60%] w-[70%]"
          >
            <input
              type="text"
              name="username"
              placeholder="Username"
              value={formData.username}
              onChange={handleChange}
              className="border-black border-2 rounded-lg p-3 bg-[#D8DAD5] placeholder:text-black"
              required
            />
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border-black border-2 rounded-lg p-3 bg-[#D8DAD5] placeholder:text-black"
              required
            />

            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
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
                name="confirmPassword"
                placeholder="Confirm Password"
                value={formData.confirmPassword}
                onChange={handleChange}
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
              disabled={isLoading}
              className={`bg-[#4C563C] text-white text-lg py-3 rounded-lg font-bold 
                ${
                  isLoading
                    ? "opacity-50 cursor-not-allowed"
                    : "hover:bg-[#5a6849]"
                } 
                transition-colors`}
            >
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Registering...
                </div>
              ) : (
                "Register"
              )}
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
