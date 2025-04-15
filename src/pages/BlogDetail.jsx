import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import API from "../config/Api";

export default function BlogDetail() {
  const { id } = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBlogDetail();
  }, [id]);

  const fetchBlogDetail = async () => {
    try {
      const response = await API.get(`/blogs/${id}`);
      setBlog(response.data);
    } catch (err) {
      setError("Failed to fetch blog details");
      console.error("Error fetching blog:", err);
    } finally {
      setLoading(false);
    }
  };

  const renderBlock = (block) => {
    switch (block.type) {
      case "title":
        return <h1 className="text-4xl font-bold mb-4">{block.content}</h1>;
      case "header":
        return <h2 className="text-2xl font-semibold mb-3">{block.content}</h2>;
      case "subheader":
        return <h3 className="text-xl font-medium mb-2">{block.content}</h3>;
      case "text":
        return (
          <p className="text-gray-700 mb-4 leading-relaxed">{block.content}</p>
        );
      case "image":
        
        if (block.image_url?.startsWith("data:")) {
          return (
            <div className="my-4">
              <img
                src={block.image_url}
                alt="Blog content"
                className="max-w-full rounded-lg shadow-md"
              />
            </div>
          );
        }
        
        return null;
      default:
        return null;
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4C563C] border-t-transparent"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error || "Blog not found"}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Author Info */}
      <div className="flex items-center mb-8">
        <div className="w-12 h-12 rounded-full bg-black flex items-center justify-center text-white">
          {blog.users.username.charAt(0).toUpperCase()}
        </div>
        <div className="ml-4">
          <p className="font-semibold">{blog.users.username}</p>
          <p className="text-sm text-gray-500">
            {new Date(blog.created_at).toLocaleDateString("id-ID", {
              day: "numeric",
              month: "long",
              year: "numeric",
            })}
          </p>
        </div>
      </div>

      {/* Blog Content */}
      <article className="prose max-w-none">
        {blog.content
          .sort((a, b) => a.position - b.position)
          .map((block) => (
            <div key={block.id}>{renderBlock(block)}</div>
          ))}
      </article>
    </div>
  );
}
