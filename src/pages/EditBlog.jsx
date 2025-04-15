import { useState, useRef, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import {
  FaPlus,
  FaMinus,
  FaImage,
  FaHeading,
  FaAlignLeft,
  FaGripVertical,
} from "react-icons/fa6";
import API, { updateBlog } from "../config/Api";

const SortableBlock = ({ block, index, ...props }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: block.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  return (
    <div ref={setNodeRef} style={style} {...props}>
      <div className="relative group mb-6">
        <div className="flex items-start gap-4 group">
          {block.type !== "title" && (
            <button
              className="mt-3 cursor-grab opacity-0 group-hover:opacity-100 transition-opacity"
              {...attributes}
              {...listeners}
            >
              <FaGripVertical className="text-gray-400" />
            </button>
          )}
          {props.children}
        </div>
      </div>
    </div>
  );
};

export default function EditBlog() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([]);
  const [showMenu, setShowMenu] = useState(null);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const blockTypes = [
    { type: "header", icon: <FaHeading />, label: "Header" },
    {
      type: "subheader",
      icon: <FaHeading className="text-sm" />,
      label: "Subheader",
    },
    { type: "text", icon: <FaAlignLeft />, label: "Text" },
    { type: "image", icon: <FaImage />, label: "Image" },
  ];

  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  useEffect(() => {
    fetchBlogData();
  }, [id]);

  const fetchBlogData = async () => {
    try {
      console.log("Fetching blog with ID:", id);
      const response = await API.get(`/blogs/${id}`);
      console.log("API Response:", response);

      const blog = response.data;
      if (!blog) {
        throw new Error("No blog data received");
      }

      console.log("Raw blog data:", blog);

      // Transform blog data into blocks format
      const transformedBlocks = [
        {
          id: 1,
          type: "title",
          content: blog.title || "",
        },
      ];

      // Handle content blocks if they exist
      if (Array.isArray(blog.content)) {
        const contentBlocks = blog.content.map((block, index) => ({
          id: index + 2,
          type: block.type,
          content:
            block.type === "image"
              ? block.image_url || block.imageUrl || ""
              : block.content || "",
          position: block.position || index + 1,
        }));
        transformedBlocks.push(...contentBlocks);
      } else {
        console.warn("Blog content is not an array:", blog.content);
      }

      console.log("Transformed blocks:", transformedBlocks);

      if (transformedBlocks.length === 0) {
        throw new Error("No blocks created from blog data");
      }

      setBlocks(transformedBlocks);
      console.log("Blocks state updated:", transformedBlocks);
    } catch (err) {
      console.error("Error in fetchBlogData:", err);
      setError(err.message || "Failed to fetch blog");
    } finally {
      setLoading(false);
    }
  };

  const handleContentChange = (id, newContent) => {
    setBlocks((blocks) =>
      blocks.map((block) =>
        block.id === id ? { ...block, content: newContent } : block
      )
    );
  };

  const handleAddBlock = (index, type) => {
    const newBlock = {
      id: Math.max(...blocks.map((block) => block.id)) + 1,
      type,
      content: "",
    };

    const newBlocks = [...blocks];
    newBlocks.splice(index + 1, 0, newBlock);
    setBlocks(newBlocks);
    setShowMenu(null);
  };

  const handleRemoveBlock = (id) => {
    setBlocks((blocks) => blocks.filter((block) => block.id !== id));
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over?.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);

        return arrayMove(blocks, oldIndex, newIndex);
      });
    }
  };

  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    if (file) {
      try {
        const reader = new FileReader();
        reader.onloadend = () => {
          // Get the index where we want to add or update the image
          const blockIndex = blocks.findIndex((block) => block.id === showMenu);

          if (blockIndex !== -1) {
            // Insert new image block after the current block
            const newBlock = {
              id: Math.max(...blocks.map((block) => block.id)) + 1,
              type: "image",
              content: reader.result,
            };

            const newBlocks = [...blocks];
            newBlocks.splice(blockIndex + 1, 0, newBlock);
            setBlocks(newBlocks);
          }

          console.log("Image loaded:", reader.result.substring(0, 100) + "...");
        };
        reader.readAsDataURL(file);
      } catch (error) {
        console.error("Error processing image:", error);
        alert("Failed to process image. Please try again.");
      }
    }
    setShowMenu(null);
  };

  const renderBlock = (block) => {
    switch (block.type) {
      case "title":
        return (
          <input
            type="text"
            placeholder="Title"
            className="w-full text-4xl font-bold outline-none bg-transparent placeholder-gray-400"
            value={block.content}
            onChange={(e) => handleContentChange(block.id, e.target.value)}
          />
        );
      case "header":
        return (
          <input
            type="text"
            placeholder="Header"
            className="w-full text-2xl font-semibold outline-none bg-transparent placeholder-gray-400"
            value={block.content}
            onChange={(e) => handleContentChange(block.id, e.target.value)}
          />
        );
      case "subheader":
        return (
          <input
            type="text"
            placeholder="Subheader"
            className="w-full text-xl font-medium outline-none bg-transparent placeholder-gray-400"
            value={block.content}
            onChange={(e) => handleContentChange(block.id, e.target.value)}
          />
        );
      case "image":
        return block.content ? (
          <div className="relative w-full">
            <img
              src={block.content}
              alt="Blog content"
              className="w-full max-h-[500px] object-cover rounded-lg"
              onError={(e) => {
                console.error("Image failed to load:", block.content);
                e.target.style.display = "none";
              }}
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button
                onClick={() => fileInputRef.current?.click()}
                className="p-2 bg-white rounded-full shadow-md hover:bg-gray-100"
              >
                <FaImage className="text-gray-600" />
              </button>
            </div>
          </div>
        ) : (
          <div
            onClick={() => fileInputRef.current?.click()}
            className="w-full h-48 bg-gray-100 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-colors"
          >
            <FaImage className="text-gray-400 text-2xl" />
          </div>
        );
      default:
        return (
          <textarea
            placeholder="Tell your story..."
            className="w-full min-h-[100px] outline-none border-none bg-transparent placeholder-gray-400 resize-none"
            value={block.content}
            onChange={(e) => handleContentChange(block.id, e.target.value)}
          />
        );
    }
  };

  const handleSubmit = async () => {
    if (!blocks[0].content) {
      alert("Title is required");
      return;
    }

    setIsSubmitting(true);
    try {
      const blogData = {
        title: blocks[0].content,
        content: blocks.slice(1).map((block, index) => ({
          type: block.type,
          content: block.type === "image" ? null : block.content,
          imageUrl: block.type === "image" ? block.content : null,
          position: index + 1,
        })),
      };

      const imageBlock = blocks.find(
        (block) => block.type === "image" && block.content?.startsWith("data:")
      );
      if (imageBlock) {
        const base64Response = await fetch(imageBlock.content);
        const blob = await base64Response.blob();
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        blogData.image = file;
      }

      await updateBlog(id, blogData);
      navigate(`/blog/${id}`);
    } catch (error) {
      console.error("Failed to update blog:", error);
      alert("Failed to update blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-[#4C563C] border-t-transparent"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-red-600">{error}</div>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <input
        type="file"
        accept="image/*"
        className="hidden"
        ref={fileInputRef}
        onChange={handleImageUpload}
      />

      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={blocks.map((block) => block.id)}
          strategy={verticalListSortingStrategy}
        >
          {blocks.map((block, index) => (
            <SortableBlock key={block.id} block={block} index={index}>
              <div className="flex items-start gap-4 group flex-1">
                <div className="relative">
                  <button
                    className="mt-3 p-2 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() =>
                      setShowMenu(showMenu === block.id ? null : block.id)
                    }
                  >
                    <FaPlus className="text-gray-400" />
                  </button>

                  {showMenu === block.id && (
                    <div className="absolute left-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 z-10">
                      <div className="py-1">
                        {blockTypes.map((type) => (
                          <button
                            key={type.type}
                            className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100"
                            onClick={() => handleAddBlock(index, type.type)}
                          >
                            <span className="mr-2">{type.icon}</span>
                            {type.label}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}
                </div>

                <div className="flex-1 relative">
                  {renderBlock(block)}

                  {block.type !== "title" && block.content && (
                    <button
                      className="absolute -right-10 top-3 p-2 rounded-full hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={() => handleRemoveBlock(block.id)}
                    >
                      <FaMinus className="text-gray-400" />
                    </button>
                  )}
                </div>
              </div>
            </SortableBlock>
          ))}
        </SortableContext>
      </DndContext>

      <div className="flex justify-end gap-4 mt-8">
        <button
          onClick={() => navigate(`/blog/${id}`)}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleSubmit}
          disabled={isSubmitting}
          className={`px-4 py-2 bg-[#4C563C] text-white rounded-lg ${
            isSubmitting
              ? "opacity-50 cursor-not-allowed"
              : "hover:bg-[#5a6849]"
          }`}
        >
          {isSubmitting ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Updating...
            </span>
          ) : (
            "Update Blog"
          )}
        </button>
      </div>
    </div>
  );
}
