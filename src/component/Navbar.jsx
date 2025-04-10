import { Link } from "react-router-dom";
import Logo from "../assets/logo-removebg-preview 1.svg";

export default function Navbar() {
  return (
        <nav class="flex w-full h-25 px-16 py-10 mt-2">
            <div class="my-auto justify-between flex w-screen">
                <img src={Logo} alt="" class="w-16 h-16"/>
                <div class="space-x-10 my-auto"> 
                    <Link to="/" class="font-semibold text-lg">Home</Link>
                    <a href="#about" class="font-semibold text-lg">About</a>
                    <Link to="/blog" class="font-semibold text-lg">Blog</Link>
                </div>
                <div class="my-auto space-x-5">
                    <Link href="" class="text-lg font-semibold bg-[#4C563C] text-[#FFFFFF] py-3 px-7 rounded-[5px]">Get Started</Link>
                </div>
            </div>
        </nav>
  );
}