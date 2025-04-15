import { useState, useRef } from "react";
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
import { createBlog } from "../config/Api";
import { useNavigate } from "react-router-dom";

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

export default function FormBlog() {
  const navigate = useNavigate();
  const [blocks, setBlocks] = useState([
    { id: 1, type: "title", content: "" },
    { id: 2, type: "text", content: "" },
  ]);
  const [showMenu, setShowMenu] = useState(null);
  const fileInputRef = useRef(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSavingDraft, setIsSavingDraft] = useState(false);

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

  const handleAddBlock = (index, type) => {
    const newBlock = {
      id: blocks.length + 1,
      type: type,
      content: "",
    };
    setBlocks([
      ...blocks.slice(0, index + 1),
      newBlock,
      ...blocks.slice(index + 1),
    ]);
    setShowMenu(null);
  };

  const handleRemoveBlock = (id) => {
    if (blocks.length > 2) {
      setBlocks(blocks.filter((block) => block.id !== id));
    }
  };

  const handleContentChange = (id, value) => {
    setBlocks(
      blocks.map((block) =>
        block.id === id ? { ...block, content: value } : block
      )
    );
  };

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        delay: 250,
        tolerance: 5,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setBlocks((blocks) => {
        const oldIndex = blocks.findIndex((block) => block.id === active.id);
        const newIndex = blocks.findIndex((block) => block.id === over.id);

        if (oldIndex === 0 || newIndex === 0) {
          return blocks;
        }

        return arrayMove(blocks, oldIndex, newIndex);
      });
    }
  };

  const handleImageUpload = (e, blockId) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (e) => {
        handleContentChange(blockId, e.target.result);
      };
      reader.readAsDataURL(file);
    }
  };

  const renderBlock = (block) => {
    switch (block.type) {
      case "title":
        return (
          <input
            type="text"
            placeholder="Title"
            className="w-full text-4xl font-bold outline-none border-none bg-transparent placeholder-gray-400"
            value={block.content}
            onChange={(e) => handleContentChange(block.id, e.target.value)}
          />
        );
      case "header":
        return (
          <input
            type="text"
            placeholder="Header"
            className="w-full text-2xl font-semibold outline-none border-none bg-transparent placeholder-gray-400"
            value={block.content}
            onChange={(e) => handleContentChange(block.id, e.target.value)}
          />
        );
      case "subheader":
        return (
          <input
            type="text"
            placeholder="Subheader"
            className="w-full text-xl font-medium outline-none border-none bg-transparent placeholder-gray-400"
            value={block.content}
            onChange={(e) => handleContentChange(block.id, e.target.value)}
          />
        );
      case "image":
        return (
          <div className="w-full">
            {block.content ? (
              <div className="relative group">
                <img
                  src={block.content}
                  alt=""
                  className="max-w-full rounded-lg"
                />
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-50 opacity-0 group-hover:opacity-100 transition-opacity text-white"
                >
                  Change Image
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, block.id)}
                />
              </div>
            ) : (
              <div className="relative">
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="w-full p-8 border-2 border-dashed border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  <FaImage className="mx-auto text-gray-400 text-xl" />
                  <span className="block mt-2 text-gray-500">
                    Click to upload image
                  </span>
                </button>
                <input
                  type="file"
                  ref={fileInputRef}
                  className="hidden"
                  accept="image/*"
                  onChange={(e) => handleImageUpload(e, block.id)}
                />
              </div>
            )}
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
        publish: true,
      };

      const imageBlock = blocks.find(
        (block) => block.type === "image" && block.content
      );
      if (imageBlock) {
        const base64Response = await fetch(imageBlock.content);
        const blob = await base64Response.blob();
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        blogData.image = file;
      }

      const { data } = await createBlog(blogData);

      if (!data) {
        throw new Error("No response data received");
      }

      // if (!data.id) {
      //   throw new Error("No blog ID in response");
      // }

      navigate(`/blog`);
    } catch (error) {
      console.error("Failed to save blog:", error);
      alert("Failed to save blog. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDraft = async () => {
    setIsSavingDraft(true);
    try {
      const blogData = {
        title: blocks[0].content || "Untitled Draft",
        content: blocks.slice(1).map((block, index) => ({
          type: block.type,
          content: block.type === "image" ? null : block.content,
          imageUrl: block.type === "image" ? block.content : null,
          position: index + 1,
        })),
        publish: false,
      };

      const imageBlock = blocks.find(
        (block) => block.type === "image" && block.content
      );
      if (imageBlock) {
        const base64Response = await fetch(imageBlock.content);
        const blob = await base64Response.blob();
        const file = new File([blob], "image.jpg", { type: "image/jpeg" });
        blogData.image = file;
      }

      const { data } = await createBlog(blogData);

      if (!data) {
        throw new Error("No response data received");
      }

      // if (!data.id) {
      //   throw new Error("No blog ID in response");
      // }

      navigate(`/blog`);
    } catch (error) {
      console.error("Failed to save draft:", error);
      alert("Failed to save draft. Please try again.");
    } finally {
      setIsSavingDraft(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
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
          onClick={handleDraft}
          disabled={isSavingDraft}
          className={`px-4 py-2 text-gray-600 border border-gray-300 rounded-lg ${
            isSavingDraft ? "opacity-50 cursor-not-allowed" : "hover:bg-gray-50"
          }`}
        >
          {isSavingDraft ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-gray-600 border-t-transparent rounded-full animate-spin" />
              Saving...
            </span>
          ) : (
            "Save as Draft"
          )}
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
              Publishing...
            </span>
          ) : (
            "Publish"
          )}
        </button>
      </div>
    </div>
  );
}
