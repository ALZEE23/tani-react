import HeaderImage from "../assets/free-photo-of-idyllic-english-countryside-with-rolling-hills 1.svg";
import Logo from "../assets/logo-removebg-preview 1.svg";
import AboutImage from "../assets/pexels-photo-17691920 1.svg";

export default function Home() {
  return (
    <div>
      <section>
        <div className="flex flex-col mt-14">
          <div className="flex mx-auto h-72 z-10 bg-[#F1E9E9]">
            <h1 className="self-center md:text-8xl text-5xl text-center font-semibold bg-gradient-to-r from-[#1C2F11] to-[#466535] bg-clip-text text-transparent md:m-40 m-10">
              Artikel Pertanian, Solusi untuk Masa Depan
            </h1>
          </div>
          <div className="relative w-full md:h-[90vh] flex flex-col ">
            <h1 className="self-center md:text-2xl md:m-0 mx-10 text-lg text-center">
              Temukan berbagai informasi mengenai pertanian dalam
              artikel-artikel yang tersedia!
            </h1>
            <img
              src={HeaderImage}
              alt=""
              className="scale-125 absolute md:bottom-40 md:-top-32 top-28 w-full border-none "
            />
          </div>
        </div>
      </section>

      <section id="about" className="md:py-8 py-20 md:mt-0 mt-72">
        <div className="flex flex-col md:mx-[137px] m-10">
          <img src={Logo} alt="" className="w-20 h-20" />

          <div className="flex h-screen w-full">
            <div className="mt-14 md:space-y-10 md:w-[60%] h-[100%] space-y-10">
              <h1 className="md:text-6xl text-4xl md:w-[90%] font-semibold">
                TUMBUHIN Menumbuhkan Pengetahuan Pertanian
              </h1>
              <div className="flex flex-col md:gap-16 gap-7">
                <h1 className="md:w-[70%] md:text-2xl text-xl">
                  Tumbuhin adalah platform yang menghadirkan artikel seputar
                  sektor pertanian. Kami menyajikan informasi yang mudah
                  diakses, membantu menemukan jawaban langsung dari artikel yang
                  tersedia.
                </h1>
                <a
                  href=""
                  className="text-lg font-semibold w-40 text-center text-[#FFFFFF] bg-[#4C563C] p-3 rounded-[5px]"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div className="h-full w-[40%] flex pt-10">
              <img
                src={AboutImage}
                alt=""
                className="w-[390px] h-[585px] md:flex hidden"
              />
            </div>
          </div>
        </div>
        <div className="mt-20 h-40"></div>
      </section>
    </div>
  );
}
