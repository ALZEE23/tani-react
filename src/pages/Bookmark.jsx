import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark } from "react-icons/fa6";
import { getAllBlogs, getBookmarks, deleteBookmark } from "../config/Api";

export default function Bookmark() {
  const [bookmarks, setBookmarks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBookmarkedBlogs();
  }, []);

  const fetchBookmarkedBlogs = async () => {
    try {
      const [blogsResponse, bookmarksResponse] = await Promise.all([
        getAllBlogs(),
        getBookmarks(),
      ]);

      const blogs = blogsResponse.data?.blogs || [];
      const bookmarkData = bookmarksResponse.data?.bookmarks || [];

      
      const bookmarkedBlogs = bookmarkData
        .map((bookmark) => {
          const blog = blogs.find((blog) => blog.id === bookmark.blog_id);
          return {
            ...blog,
            bookmarkId: bookmark.id, 
          };
        })
        .filter(Boolean); 

      setBookmarks(bookmarkedBlogs);
    } catch (err) {
      setError("Failed to fetch bookmarks");
      console.error("Error fetching bookmarked blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleRemoveBookmark = async (e, bookmarkId) => {
    e.stopPropagation(); 
    try {
      await deleteBookmark(bookmarkId);
      setBookmarks((prev) =>
        prev.filter((blog) => blog.bookmarkId !== bookmarkId)
      );
    } catch (err) {
      console.error("Error removing bookmark:", err);
      console.log("Error details:", {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
      alert("Failed to remove bookmark. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4C563C] border-t-transparent"></div>
      </div>
    );
  }

  if (!bookmarks || bookmarks.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">No bookmarks found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center mt-14 mb-20 px-4 md:px-16 lg:px-32 w-full gap-8">
      {bookmarks.map((blog) => (
        <div
          key={blog.id}
          onClick={() => navigate(`/blog/${blog.id}`)}
          className="w-full md:w-[calc(50%-2rem)] mx-10 md:mx-0 lg:w-[calc(33.333%-2rem)] h-[28rem] bg-[#FFFFFF] rounded-xl p-3 space-y-2 cursor-pointer hover:shadow-lg transition-shadow"
        >
          <div className="bg-slate-300 w-full h-[45%] rounded-lg relative">
            {blog.content.find((block) => block.type === "image")
              ?.image_url && (
              <img
                src={
                  blog.content.find((block) => block.type === "image").image_url
                }
                alt={blog.title}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            <button
              onClick={(e) => handleRemoveBookmark(e, blog.bookmarkId)}
              className="h-10 w-9 bg-white rounded-md absolute bottom-3 right-4 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              <FaBookmark className="text-[#4C563C]" />
            </button>
          </div>
          <h1 className="text-2xl w-[20rem] font-bold">{blog.title}</h1>
          <h1>
            {new Date(blog.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </h1>
          <h1 className="text-xs line-clamp-3">
            {blog.content.find((block) => block.type === "text")?.content ||
              "No content"}
          </h1>
          <div className="flex gap-x-3">
            <div className="w-10 h-10 rounded-full bg-black flex items-center justify-center text-white">
              {blog.user.username.charAt(0).toUpperCase()}
            </div>
            <div className="flex flex-col">
              <h1 className="text-xs">Written by</h1>
              <h1 className="text-sm font-semibold">{blog.user.username}</h1>
            </div>
          </div>
        </div>
      ))}

      {error && (
        <div className="w-full text-center text-red-600 py-4">{error}</div>
      )}
    </div>
  );
}
