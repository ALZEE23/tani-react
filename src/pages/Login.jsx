import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Image from "../assets/free-photo-of-vietnamese-farmer-walking-in-lush-green-rice-field 2(1).svg";
import Logo from "../assets/logo-removebg-preview 1.svg";
import { login } from "../config/Api";


export default function Login() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    email: "",
    password: "",
  });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await login(formData);
      
      localStorage.setItem("token", response.data.token);
      
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
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
          <h1 className="text-4xl font-bold">WELCOME!</h1>
          <h1 className="w-[70%] text-center text-lg">
            Masuk untuk mengakses berbagai artikel pertanian pilihan dan temukan
            wawasan baru untuk mendukung keberhasilan pertanianmu.
          </h1>

          {error && (
            <div className="w-[70%] bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <form
            onSubmit={handleSubmit}
            className="flex flex-col space-y-5 md:w-[60%] w-[70%]"
          >
            <input
              type="email"
              name="email"
              placeholder="Email"
              value={formData.email}
              onChange={handleChange}
              className="border-black border-2 rounded-lg p-3 bg-[#D8DAD5] placeholder:text-black"
              required
            />
            <input
              type="password"
              name="password"
              placeholder="Password"
              value={formData.password}
              onChange={handleChange}
              className="border-black border-2 rounded-lg p-3 bg-[#D8DAD5] placeholder:text-black"
              required
            />
            <button
              type="submit"
              disabled={loading}
              className={`bg-[#4C563C] text-white text-lg py-3 rounded-lg font-bold ${
                loading ? "opacity-50 cursor-not-allowed" : "hover:bg-[#5a6849]"
              }`}
            >
              {loading ? "Loading..." : "Masuk"}
            </button>
            <div className="flex flex-col">
              <button type="button">Forgot your password?</button>
              <button type="button" onClick={() => navigate("/register")}>
                Sign Up
              </button>
            </div>
          </form>

          <div className="md:px-60 px-10">
            <h1 className="text-center text-lg">
              By proceeding, you agree to use Terme fee Reed our Privacy Policy
            </h1>
          </div>
        </div>
      </div>
    </div>
  );
}
