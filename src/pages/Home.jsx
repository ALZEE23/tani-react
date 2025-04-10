import HeaderImage from "../assets/free-photo-of-idyllic-english-countryside-with-rolling-hills 1.svg"
import Logo from "../assets/logo-removebg-preview 1.svg";
import AboutImage from "../assets/pexels-photo-17691920 1.svg";

export default function Home() {
  return (
    <div>
      <section>
        <div class="flex flex-col mt-14">
          <div class="flex mx-auto h-72">
            <h1 class="self-center text-8xl text-center font-semibold bg-gradient-to-r from-[#075D07] via-[#5A8A42] to-[#8AC310] bg-clip-text text-transparent m-40">
              Artikel Pertanian, Solusi untuk Masa Depan
            </h1>
          </div>
          <div class="relative w-full h-screen flex flex-col">
            <h1 class="self-center text-2xl">
              Temukan berbagai informasi mengenai pertanian dalam
              artikel-artikel yang tersedia!
            </h1>
            <img src={HeaderImage} alt="" class="scale-125 absolute bottom-30" />
          </div>
        </div>
      </section>

      <section id="about">
        <div class="flex flex-col mt-40 mx-[137px]">
          <img src={Logo} alt="" class="w-20 h-20" />

          <div class="flex h-screen w-full ">
            <div class="mt-14 space-y-20  w-[60%] h-[100%]">
              <h1 class="text-6xl w-[90%] font-semibold">
                TUMBUHIN Menumbuhkan Pengetahuan Pertanian
              </h1>
              <div class="flex flex-col gap-16">
                <h1 class="w-[70%] text-2xl">
                  Tumbuhin adalah platform yang menghadirkan artikel seputar
                  sektor pertanian. Kami menyajikan informasi yang mudah
                  diakses, membantu menemukan jawaban langsung dari artikel yang
                  tersedia.
                </h1>
                <a
                  href=""
                  class="text-lg font-semibold w-40 text-center text-[#FFFFFF] bg-[#4C563C] p-3 rounded-[5px]"
                >
                  Learn More
                </a>
              </div>
            </div>
            <div class="h-full w-[40%] flex pt-10">
              <img src={AboutImage} alt="" class="w-[390px] h-[585px]" />
            </div>
          </div>
        </div>
        <div class="mt-20 h-40"></div>
      </section>
    </div>
  );
}
