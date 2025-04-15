import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaBookmark,
  FaRegBookmark,
  FaPenToSquare,
  FaTrash,
} from "react-icons/fa6";
import API, {
  addBookmark,
  deleteBookmark,
  deleteBlog,
} from "../config/Api";

export default function MyBlog() {
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [bookmarkedBlogs, setBookmarkedBlogs] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMyBlogs();
    fetchBookmarks();
  }, []);

  const fetchMyBlogs = async () => {
    try {
      const response = await API.get("/myblogs", { timeout: 30000 });
      setBlogs(response.data?.blogs || []);
    } catch (err) {
      setError("Failed to fetch blogs");
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const fetchBookmarks = async () => {
    try {
      const response = await API.get("/bookmarks", { timeout: 30000 });
      console.log("Fetched bookmarks:", response.data);

      const bookmarkedIds =
        response.data?.bookmarks?.map((bookmark) => bookmark.blog_id) || [];

      // Store full bookmark data for reference
      console.log("Bookmark details:", response.data?.bookmarks);

      setBookmarkedBlogs(bookmarkedIds);
    } catch (err) {
      console.error("Error fetching bookmarks:", err);
      if (err.response?.status !== 401) {
        setBookmarkedBlogs([]);
      }
    }
  };

  // Add this useEffect to refresh bookmarks when blogs change
  useEffect(() => {
    if (blogs.length > 0) {
      fetchBookmarks();
    }
  }, [blogs]);

  const handleBookmark = async (e, blogId) => {
    e.stopPropagation(); // Prevent navigation when clicking bookmark
    try {
      if (bookmarkedBlogs.includes(blogId)) {
        // Find the bookmark ID for this blog
        const bookmark = await API.get("/bookmarks");
        const bookmarkData = bookmark.data.bookmarks.find(
          (b) => b.blog_id === blogId
        );

        if (bookmarkData) {
          await deleteBookmark(bookmarkData.id); // Use bookmark.id instead of blog.id
          setBookmarkedBlogs((prev) => prev.filter((id) => id !== blogId));
          console.log("Bookmark deleted:", bookmarkData.id);
        }
      } else {
        await addBookmark(blogId);
        setBookmarkedBlogs((prev) => [...prev, blogId]);
        console.log("Bookmark added:", blogId);
      }
    } catch (err) {
      console.error("Error toggling bookmark:", err);
      console.log("Error details:", {
        status: err.response?.status,
        message: err.response?.data?.message || err.message,
      });
      alert("Failed to update bookmark. Please try again.");
    }
  };

  const handleDelete = async (e, blogId) => {
    e.stopPropagation(); // Prevent navigation
    if (window.confirm("Are you sure you want to delete this blog?")) {
      try {
        await deleteBlog(blogId);
        setBlogs((prev) => prev.filter((blog) => blog.id !== blogId));
      } catch (err) {
        console.error("Error deleting blog:", err);
        alert("Failed to delete blog. Please try again.");
      }
    }
  };

  const handleEdit = (e, blogId) => {
    e.stopPropagation(); // Prevent navigation
    navigate(`/edit-blog/${blogId}`);
  };

  const getPreviewText = (content) => {
    const textBlock = content.find((block) => block.type === "text");
    if (!textBlock) return "";
    return textBlock.content.substring(0, 150) + "...";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4C563C] border-t-transparent"></div>
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
            {blog.content?.find(
              (block) =>
                block.type === "image" && block.image_url?.startsWith("data:")
            )?.image_url && (
              <img
                src={
                  blog.content.find(
                    (block) =>
                      block.type === "image" &&
                      block.image_url?.startsWith("data:")
                  ).image_url
                }
                alt={blog.title}
                className="w-full h-full object-cover rounded-lg"
              />
            )}
            <div className="absolute bottom-3 right-4 flex gap-2">
              <button
                onClick={(e) => handleEdit(e, blog.id)}
                className="h-10 w-9 bg-white rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <FaPenToSquare className="text-[#4C563C]" />
              </button>
              <button
                onClick={(e) => handleDelete(e, blog.id)}
                className="h-10 w-9 bg-white rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                <FaTrash className="text-red-500" />
              </button>
              <button
                onClick={(e) => handleBookmark(e, blog.id)}
                className="h-10 w-9 bg-white rounded-md flex items-center justify-center hover:bg-gray-100 transition-colors"
              >
                {bookmarkedBlogs.includes(blog.id) ? (
                  <FaBookmark className="text-[#4C563C]" />
                ) : (
                  <FaRegBookmark className="text-[#4C563C]" />
                )}
              </button>
            </div>
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
