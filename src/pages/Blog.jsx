import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { FaBookmark, FaRegBookmark } from "react-icons/fa6";
import API, { addBookmark, deleteBookmark } from "../config/Api";

export default function Blog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
    fetchBookmarks();
  }, []);

  const fetchBlogs = async () => {
    try {
      const response = await API.get("/blogs");

      setBlogs(response.data?.blogs || []);
    } catch (err) {
      setError("Failed to fetch blogs");
      console.error("Error fetching blogs:", err);
      setBlogs([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await API.get("/bookmarks", { timeout: 30000 });
      console.log("Bookmark response:", response.data);

      // Extract blog_ids from bookmarks array
      const bookmarkedIds =
        response.data?.bookmarks?.map((bookmark) => bookmark.blog_id) || [];

      // Remove any duplicate IDs
      const uniqueBookmarkedIds = [...new Set(bookmarkedIds)];
      setBookmarkedBlogs(uniqueBookmarkedIds);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      // Don't set bookmarks to empty array on error to prevent UI flicker
      if (err.response?.status !== 401) {
        setBookmarkedBlogs([]);
      }
    }
  };

  const handleBookmark = async (e, blogId) => {
    e.stopPropagation(); // Prevent navigation when clicking bookmark
    try {
      if (bookmarkedBlogs.includes(blogId)) {
        await deleteBookmark(blogId); // Changed from removeBookmark to deleteBookmark
        setBookmarkedBlogs((prev) => prev.filter((id) => id !== blogId));
      } else {
        await addBookmark(blogId);
        setBookmarkedBlogs((prev) => [...prev, blogId]);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      alert("Failed to update bookmark. Please try again.");
    }
  };

  const getPreviewText = (content) => {
    const textBlocks = content.filter((block) => block.type === "text");
    if (textBlocks.length === 0) return "";
    return textBlocks[0].content.substring(0, 150) + "...";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4C563C] border-t-transparent"></div>
      </div>
    );
  }

  if (!blogs || blogs.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-gray-600">No blogs found</div>
      </div>
    );
  }

  return (
    <div className="flex flex-wrap justify-center mt-14 px-4 md:px-16 lg:px-32 w-full gap-8">
      {blogs.map((blog) => (
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
              onClick={(e) => handleBookmark(e, blog.id)}
              className="h-10 w-9 bg-white rounded-md absolute bottom-3 right-4 flex items-center justify-center hover:bg-gray-100 transition-colors"
            >
              {bookmarkedBlogs.includes(blog.id) ? (
                <FaBookmark className="text-[#4C563C]" />
              ) : (
                <FaRegBookmark className="text-[#4C563C]" />
              )}
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
            {getPreviewText(blog.content)}
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
