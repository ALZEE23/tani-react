import Image from "../assets/free-photo-of-vietnamese-farmer-walking-in-lush-green-rice-field 2(1).svg";
import Logo from "../assets/logo-removebg-preview 1.svg";

export default function Login() {
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
          <form className="flex flex-col space-y-5 md:w-[60%] w-[70%]">
            <input
              type="text"
              placeholder="Username"
              className="border-black border-2 rounded-lg p-3 bg-[#D8DAD5] placeholder:text-black"
            />
            <input
              type="password"
              placeholder="Password"
              className="border-black border-2 rounded-lg p-3 bg-[#D8DAD5] placeholder:text-black"
            />
            <button className="bg-[#4C563C] text-white text-lg py-3 rounded-lg font-bold">
              Masuk
            </button>
            <div className="flex flex-col">
              <button>Forgot your password?</button>
              <button>Sign Up</button>
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
