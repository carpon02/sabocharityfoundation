// admin/src/component/pages/Blog.jsx — Clerk-Style UI
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search, Plus, Edit, Trash2, Eye, X, Upload,
  FileText, Globe, Clock, Activity, Heart, TrendingUp,
  PenTool, Zap,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  fetchBlogs, fetchBlogStats, createBlog, updateBlog, deleteBlog,
} from "../../features/blog/blogSlice";
import { StatsCard } from "../shared";
import toast from "react-hot-toast";

const CATEGORIES = [
  "Success Stories", "Campaign Updates", "Community News",
  "Events", "Announcements", "Volunteer Stories", "Impact Reports",
];

const Blog = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();
  const { blogs, stats, pagination, loading } = useSelector((s) => s.adminBlogs);

  const [searchQuery,   setSearchQuery]   = useState("");
  const [showModal,     setShowModal]     = useState(false);
  const [modalMode,     setModalMode]     = useState("create");
  const [selectedBlog,  setSelectedBlog]  = useState(null);
  const [imagePreview,  setImagePreview]  = useState("");

  const emptyForm = {
    title: "", slug: "", excerpt: "", content: "",
    category: "Success Stories", tags: "", status: "draft",
    publishDate: "", metaTitle: "", metaDescription: "", metaKeywords: "",
  };
  const [formData, setFormData] = useState(emptyForm);

  useEffect(() => {
    dispatch(fetchBlogs({ page: pagination.page, limit: pagination.limit }));
    dispatch(fetchBlogStats());
  }, [dispatch, pagination.page]);

  const internalStats = useMemo(() => [
    { label: "Total Stories",  value: stats?.stats?.total?.[0]?.count?.toString()      || "0", subtitle: "Foundation Archive", icon: FileText,   bgColor: "from-emerald-600 to-teal-600" },
    { label: "Published",      value: stats?.stats?.published?.[0]?.count?.toString()  || "0", subtitle: "Live Updates",       icon: Globe,      bgColor: "from-emerald-500 to-teal-500" },
    { label: "Story Views",    value: stats?.stats?.totalViews?.[0]?.total?.toString() || "0", subtitle: "Community Impact",   icon: Activity,   bgColor: "from-teal-500 to-cyan-500" },
    { label: "Drafts",         value: stats?.stats?.draft?.[0]?.count?.toString()      || "0", subtitle: "Pending Stories",    icon: Clock,      bgColor: "from-amber-400 to-orange-500" },
  ], [stats]);

  const filteredBlogs = useMemo(() => {
    if (!searchQuery.trim()) return blogs;
    return blogs.filter((b) => b.title.toLowerCase().includes(searchQuery.toLowerCase()));
  }, [blogs, searchQuery]);

  const openModal = (mode, blog = null) => {
    setModalMode(mode);
    setSelectedBlog(blog);
    if (mode === "edit" && blog) {
      setFormData({
        title: blog.title || "", slug: blog.slug || "", excerpt: blog.excerpt || "",
        content: blog.content || "", category: blog.category || "Success Stories",
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
        status: blog.status || "draft",
        publishDate: blog.publishDate ? blog.publishDate.split("T")[0] : "",
        metaTitle: blog.metaTitle || "", metaDescription: blog.metaDescription || "",
        metaKeywords: blog.metaKeywords || "",
      });
      setImagePreview(blog.featuredImage?.url || "");
    } else {
      setFormData(emptyForm);
      setImagePreview("");
    }
    setShowModal(true);
  };

  const handleInput = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((p) => ({ ...p, featuredImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (modalMode === "create") {
        await dispatch(createBlog({ ...formData })).unwrap();
        toast.success("Story created successfully");
      } else {
        await dispatch(updateBlog({ id: selectedBlog._id, blogData: { ...formData } })).unwrap();
        toast.success("Story updated successfully");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this story? This action cannot be undone.")) return;
    try {
      await dispatch(deleteBlog(id)).unwrap();
      toast.success("Story deleted");
    } catch { toast.error("Delete failed"); }
  };

  // ── Shared style tokens ──────────────────────────────────────────────────
  const cardBase  = `rounded-xl border ${darkMode ? "bg-dark-lighter border-gray-800/70" : "bg-white border-gray-200/80 shadow-sm"}`;
  const modalBase = `rounded-xl border shadow-xl ${darkMode ? "bg-[#111] border-gray-800" : "bg-white border-gray-200"}`;
  const inputCls  = `w-full px-3 py-2 rounded-lg border text-sm outline-none transition-all ${darkMode ? "bg-gray-800/60 border-gray-700/60 text-white placeholder-gray-500 focus:border-primary-500/50" : "bg-gray-50 border-gray-200 text-gray-900 placeholder-gray-400 focus:border-primary-400"}`;

  return (
    <div className="space-y-6 pb-10">

      {/* ── Header ───────────────────────────────────────────────────── */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className={`text-xl font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Blog</h1>
          <p className={`text-sm mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
            {blogs.length} stories · share your foundation's impact
          </p>
        </div>
        <button
          onClick={() => openModal("create")}
          className="px-3 py-2 rounded-lg bg-primary-500 hover:bg-primary-600 text-white text-sm font-medium flex items-center gap-1.5 transition-all shadow-sm"
        >
          <Plus size={15} /> New Story
        </button>
      </div>

      {/* ── Stats ────────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {internalStats.map((s, i) => <StatsCard key={i} {...s} index={i} />)}
      </div>

      {/* ── Filters ──────────────────────────────────────────────────── */}
      <div className={`${cardBase} p-4 flex flex-col sm:flex-row gap-3`}>
        <div className="relative flex-1">
          <Search className={`absolute left-3 top-1/2 -translate-y-1/2 ${darkMode ? "text-gray-500" : "text-gray-400"}`} size={15} />
          <input
            type="text"
            placeholder="Search stories..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`${inputCls} pl-9`}
          />
        </div>
        <select className={inputCls} style={{ width: "auto" }}>
          <option>All Categories</option>
          {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
        </select>
      </div>

      {/* ── Blog Grid ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        <AnimatePresence mode="popLayout">
          {loading ? (
            Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className={`h-72 rounded-xl animate-pulse ${darkMode ? "bg-gray-800/60" : "bg-gray-100"}`} />
            ))
          ) : filteredBlogs.length === 0 ? (
            <div className={`col-span-full py-20 text-center ${cardBase}`}>
              <FileText size={32} className={`mx-auto mb-3 ${darkMode ? "text-gray-600" : "text-gray-300"}`} />
              <p className={`text-sm font-medium ${darkMode ? "text-gray-400" : "text-gray-500"}`}>No stories found</p>
            </div>
          ) : filteredBlogs.map((blog, i) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, y: 12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97 }}
              transition={{ delay: i * 0.04 }}
              className={`group flex flex-col overflow-hidden rounded-xl border transition-all hover:shadow-md ${
                darkMode ? "bg-dark-lighter border-gray-800/70 hover:border-gray-700" : "bg-white border-gray-200/80 shadow-sm hover:border-gray-300"
              }`}
            >
              {/* Image */}
              <div className="relative h-40 overflow-hidden bg-gray-100 dark:bg-gray-800">
                <img
                  src={blog.featuredImage?.url || `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.title)}&background=random`}
                  alt={blog.title}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                {/* Status badge */}
                <div className="absolute top-2.5 left-2.5">
                  <span className={`inline-block px-2 py-1 rounded-md text-[11px] font-semibold ${blog.status === "published" ? "bg-emerald-500 text-white" : "bg-amber-500 text-white"}`}>
                    {blog.status}
                  </span>
                </div>
                <div className="absolute bottom-2.5 left-2.5">
                  <span className={`inline-block px-2 py-1 rounded-md text-[10px] font-medium backdrop-blur-sm bg-black/30 text-white`}>
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 flex flex-col flex-1">
                <h3 className={`text-sm font-semibold leading-snug line-clamp-2 mb-1.5 ${darkMode ? "text-white" : "text-gray-900"}`}>
                  {blog.title}
                </h3>
                <p className={`text-xs leading-relaxed line-clamp-2 flex-1 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                  {blog.excerpt}
                </p>

                <div className={`mt-3 pt-3 border-t flex items-center justify-between ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
                  <div className="flex items-center gap-3">
                    <span className={`flex items-center gap-1 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      <Eye size={12} /> {blog.views || 0}
                    </span>
                    <span className={`flex items-center gap-1 text-xs ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      <Heart size={12} /> {blog.likes || 0}
                    </span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => openModal("edit", blog)}
                      className={`p-1.5 rounded-lg transition-all ${darkMode ? "text-gray-400 hover:text-white hover:bg-gray-800" : "text-gray-500 hover:text-gray-900 hover:bg-gray-100"}`}
                      title="Edit"
                    >
                      <Edit size={14} />
                    </button>
                    <button
                      onClick={() => handleDelete(blog._id)}
                      className={`p-1.5 rounded-lg transition-all ${darkMode ? "text-red-400 hover:bg-red-950/30" : "text-red-500 hover:bg-red-50"}`}
                      title="Delete"
                    >
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </div>

      {/* ── Content note ─────────────────────────────────────────────── */}
      <div className={`${cardBase} p-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4`}>
        <div className="flex items-start gap-3">
          <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${darkMode ? "bg-emerald-950/30" : "bg-emerald-50"}`}>
            <Zap size={18} className="text-emerald-600" />
          </div>
          <div>
            <p className={`text-sm font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>Content Strategy</p>
            <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-400" : "text-gray-500"}`}>
              Stories are the heart of our mission. Share impact to grow community trust.
            </p>
          </div>
        </div>
        <button
          onClick={() => openModal("create")}
          className={`px-4 py-2 rounded-lg border text-sm font-medium flex items-center gap-1.5 flex-shrink-0 ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}
        >
          <PenTool size={14} /> Draft Story
        </button>
      </div>

      {/* ── Create / Edit Modal ───────────────────────────────────────── */}
      <AnimatePresence>
        {showModal && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              onClick={() => setShowModal(false)}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.97, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.97, y: 16 }}
              className="fixed inset-0 z-50 flex items-center justify-center p-4 overflow-y-auto"
            >
              <div className={`relative w-full max-w-2xl my-8 ${modalBase}`}>
                {/* Header */}
                <div className={`px-6 py-4 border-b flex items-center justify-between ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
                  <div>
                    <h2 className={`text-base font-semibold ${darkMode ? "text-white" : "text-gray-900"}`}>
                      {modalMode === "create" ? "Create Story" : "Edit Story"}
                    </h2>
                    <p className={`text-xs mt-0.5 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                      {modalMode === "create" ? "Publish a new foundation story" : "Update this story"}
                    </p>
                  </div>
                  <button
                    onClick={() => setShowModal(false)}
                    className={`p-1.5 rounded-lg ${darkMode ? "text-gray-400 hover:bg-gray-800" : "text-gray-400 hover:bg-gray-100"}`}
                  >
                    <X size={18} />
                  </button>
                </div>

                {/* Form */}
                <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[65vh] overflow-y-auto">
                  {/* Cover image */}
                  <label className={`relative flex items-center justify-center h-36 rounded-lg border-2 border-dashed cursor-pointer overflow-hidden transition-all ${darkMode ? "border-gray-700 hover:border-primary-500/60 bg-gray-800/30" : "border-gray-200 hover:border-primary-400 bg-gray-50"}`}>
                    <input type="file" className="hidden" onChange={handleImageChange} accept="image/*" />
                    {imagePreview ? (
                      <>
                        <img src={imagePreview} alt="" className="w-full h-full object-cover" />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                          <span className="text-white text-xs font-medium">Change cover</span>
                        </div>
                      </>
                    ) : (
                      <div className={`flex flex-col items-center gap-2 ${darkMode ? "text-gray-500" : "text-gray-400"}`}>
                        <Upload size={20} />
                        <span className="text-xs">Upload cover image</span>
                      </div>
                    )}
                  </label>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Title *</label>
                      <input name="title" value={formData.title} onChange={handleInput} required placeholder="Enter a captivating title..." className={inputCls} />
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Category</label>
                      <select name="category" value={formData.category} onChange={handleInput} className={inputCls}>
                        {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Status</label>
                      <select name="status" value={formData.status} onChange={handleInput} className={inputCls}>
                        <option value="draft">Draft</option>
                        <option value="published">Published</option>
                      </select>
                    </div>
                    <div>
                      <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Publish Date</label>
                      <input type="date" name="publishDate" value={formData.publishDate} onChange={handleInput} className={inputCls} />
                    </div>
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Excerpt (summary)</label>
                    <textarea name="excerpt" value={formData.excerpt} onChange={handleInput} rows={2} placeholder="Brief summary for previews..." className={`${inputCls} resize-none`} />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Full Content *</label>
                    <textarea name="content" value={formData.content} onChange={handleInput} required rows={8} placeholder="Write your story here..." className={`${inputCls} resize-none`} />
                  </div>

                  <div>
                    <label className={`block text-xs font-medium mb-1.5 ${darkMode ? "text-gray-400" : "text-gray-600"}`}>Tags (comma-separated)</label>
                    <input name="tags" value={formData.tags} onChange={handleInput} placeholder="charity, education, impact..." className={inputCls} />
                  </div>
                </form>

                {/* Footer */}
                <div className={`px-6 py-4 border-t flex gap-2 ${darkMode ? "border-gray-800/60" : "border-gray-100"}`}>
                  <button type="button" onClick={() => setShowModal(false)} className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all ${darkMode ? "border-gray-700 text-gray-300 hover:bg-gray-800" : "border-gray-200 text-gray-700 hover:bg-gray-50"}`}>
                    Cancel
                  </button>
                  <button type="submit" onClick={handleSubmit} className="flex-1 py-2 rounded-lg text-sm font-medium bg-primary-500 hover:bg-primary-600 text-white transition-all shadow-sm">
                    {modalMode === "create" ? "Publish Story" : "Save Changes"}
                  </button>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
