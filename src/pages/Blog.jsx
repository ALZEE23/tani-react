export default function Blog() {
  // Example blog data array
  const blogPosts = [
    {
      title: "Panduan Dasar Bertanam Hidroponik",
      date: "10 Desember 2024",
      content: "Lorem ipsum dolor sit amet consectetur adipisicing elit...",
      author: "Penulis",
    },
    // Add more blog posts as needed
  ];

  return (
    <div className="grid grid-cols-3 mt-14 px-32 w-full gap-y-8">
      {blogPosts.map((post, index) => (
        <div
          key={index}
          className="w-[90%] h-[28rem] bg-[#FFFFFF] rounded-xl p-3 space-y-2"
        >
          <div className="bg-slate-300 w-full h-[45%] rounded-lg relative">
            <div className="h-10 w-9 bg-white rounded-md absolute bottom-3 right-4"></div>
          </div>
          <h1 className="text-2xl w-[80%] font-bold">{post.title}</h1>
          <h1>{post.date}</h1>
          <h1 className="text-xs">{post.content}</h1>
          <div className="flex gap-x-3">
            <div className="w-10 h-10 rounded-full bg-black"></div>
            <div className="flex flex-col">
              <h1 className="text-xs">Written by</h1>
              <h1 className="text-sm font-semibold">{post.author}</h1>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
