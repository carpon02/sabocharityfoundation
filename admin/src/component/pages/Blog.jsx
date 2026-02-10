// admin/src/component/pages/Blog.jsx - Foundation Blog Hub
import React, { useState, useEffect, useMemo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { motion, AnimatePresence } from "framer-motion";
import {
  Search,
  Plus,
  Edit,
  Trash2,
  Eye,
  X,
  Save,
  Upload,
  FileText,
  Calendar,
  Tag,
  Image as ImageIcon,
  Globe,
  TrendingUp,
  Heart,
  MessageCircle,
  MoreVertical,
  Clock,
  Loader,
  Activity,
  ShieldCheck,
  Zap,
  PenTool,
  ChevronDown,
} from "lucide-react";
import { useTheme } from "../../context/ThemeContext";
import {
  fetchBlogs,
  fetchBlogStats,
  createBlog,
  updateBlog,
  deleteBlog,
} from "../../features/blog/blogSlice";
import { LoadingSpinner, StatsCard } from "../shared";
import toast from "react-hot-toast";

const Blog = () => {
  const { darkMode } = useTheme();
  const dispatch = useDispatch();

  const { blogs, stats, pagination, loading } = useSelector(
    (state) => state.adminBlogs,
  );
  const [searchQuery, setSearchQuery] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [modalMode, setModalMode] = useState("create");
  const [selectedBlog, setSelectedBlog] = useState(null);
  const [imagePreview, setImagePreview] = useState("");

  const [formData, setFormData] = useState({
    title: "",
    slug: "",
    excerpt: "",
    content: "",
    category: "Success Stories",
    tags: "",
    status: "draft",
    publishDate: "",
    metaTitle: "",
    metaDescription: "",
    metaKeywords: "",
  });

  useEffect(() => {
    dispatch(fetchBlogs({ page: pagination.page, limit: pagination.limit }));
    dispatch(fetchBlogStats());
  }, [dispatch, pagination.page]);

  const internalStats = useMemo(
    () => [
      {
        label: "Total Stories",
        value: stats?.stats?.total?.[0]?.count?.toString() || "0",
        subtitle: "Foundation Archive",
        icon: FileText,
        bgColor: "from-emerald-600 to-teal-600",
        trend: "+4",
        trendUp: true,
      },
      {
        label: "Published",
        value: stats?.stats?.published?.[0]?.count?.toString() || "0",
        subtitle: "Live Updates",
        icon: Globe,
        bgColor: "from-emerald-500 to-teal-500",
        trend: "+2",
        trendUp: true,
      },
      {
        label: "Story Views",
        value: stats?.stats?.totalViews?.[0]?.total?.toString() || "0",
        subtitle: "Community Impact",
        icon: Activity,
        bgColor: "from-teal-500 to-cyan-500",
        trend: "+12.5%",
        trendUp: true,
      },
      {
        label: "Drafts",
        value: stats?.stats?.draft?.[0]?.count?.toString() || "0",
        subtitle: "Pending Stories",
        icon: Clock,
        bgColor: "from-amber-400 to-orange-500",
      },
    ],
    [stats],
  );

  const categories = [
    "Success Stories",
    "Campaign Updates",
    "Community News",
    "Events",
    "Announcements",
    "Volunteer Stories",
    "Impact Reports",
  ];

  const openModal = (mode, blog = null) => {
    setModalMode(mode);
    setSelectedBlog(blog);
    if (mode === "edit" && blog) {
      setFormData({
        title: blog.title || "",
        slug: blog.slug || "",
        excerpt: blog.excerpt || "",
        content: blog.content || "",
        category: blog.category || "Success Stories",
        tags: Array.isArray(blog.tags) ? blog.tags.join(", ") : "",
        status: blog.status || "draft",
        publishDate: blog.publishDate ? blog.publishDate.split("T")[0] : "",
        metaTitle: blog.metaTitle || "",
        metaDescription: blog.metaDescription || "",
        metaKeywords: blog.metaKeywords || "",
      });
      setImagePreview(blog.featuredImage?.url || "");
    } else {
      setFormData({
        title: "",
        slug: "",
        excerpt: "",
        content: "",
        category: "Success Stories",
        tags: "",
        status: "draft",
        publishDate: "",
        metaTitle: "",
        metaDescription: "",
        metaKeywords: "",
      });
      setImagePreview("");
    }
    setShowModal(true);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData((prev) => ({ ...prev, featuredImage: file }));
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const blogData = { ...formData };

    try {
      if (modalMode === "create") {
        await dispatch(createBlog(blogData)).unwrap();
        toast.success("Story created successfully");
      } else {
        await dispatch(updateBlog({ id: selectedBlog._id, blogData })).unwrap();
        toast.success("Story updated successfully");
      }
      setShowModal(false);
    } catch (err) {
      toast.error(typeof err === "string" ? err : "Operation failed");
    }
  };

  const handleDelete = async (id) => {
    if (
      window.confirm(
        "Confirm deletion of this story? This action cannot be undone.",
      )
    ) {
      try {
        await dispatch(deleteBlog(id)).unwrap();
        toast.success("Story deleted");
      } catch (err) {
        toast.error("Delete failed");
      }
    }
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: {
      opacity: 1,
      y: 0,
    },
  };

  return (
    <div className="space-y-8 relative">
      {/* Decorative Background Blob */}
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-teal-500/5 rounded-full blur-3xl -z-10 pointer-events-none" />

      {/* Editorial Header */}
      <div className="flex flex-col lg:flex-row justify-between lg:items-center gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="w-10 h-1 bg-gradient-to-r from-emerald-500 to-teal-400 rounded-full" />
            <span className="text-xs font-bold text-emerald-600 uppercase tracking-wider">
              Content Management
            </span>
          </div>
          <h1
            className={`text-3xl lg:text-4xl font-extrabold mb-2 tracking-tight ${
              darkMode ? "text-white" : "text-dark"
            }`}
          >
            Foundation <span className="text-emerald-500">Stories</span>
          </h1>
          <p
            className={`text-base max-w-xl ${
              darkMode ? "text-gray-400" : "text-gray-600"
            }`}
          >
            Share our impact, celebrate community success, and keep supporters
            informed with compelling narratives.
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => openModal("create")}
          className="bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-white px-8 py-4 rounded-2xl font-bold text-sm flex items-center gap-3 shadow-xl shadow-emerald-500/30 transition-all w-fit"
        >
          <Plus size={20} />
          <span className="whitespace-nowrap">Create New Story</span>
        </motion.button>
      </div>

      {/* Intelligence Snapshot */}
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        {internalStats.map((stat, i) => (
          <motion.div
            key={i}
            variants={itemVariants}
            whileHover={{ y: -5, transition: { duration: 0.2 } }}
          >
            <StatsCard {...stat} index={i} />
          </motion.div>
        ))}
      </motion.div>

      {/* Discovery Console */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
        className={`p-6 rounded-3xl border backdrop-blur-sm ${
          darkMode
            ? "bg-dark-lighter/80 border-gray-800"
            : "bg-white/80 border-gray-100 shadow-xl shadow-gray-100/50"
        }`}
      >
        <div className="flex flex-col lg:flex-row gap-4">
          {/* Search */}
          <div className="relative flex-1 group">
            <Search
              className="absolute left-5 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-emerald-500 transition-colors"
              size={20}
            />
            <input
              type="text"
              placeholder="Search stories..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className={`w-full pl-14 pr-6 py-4 rounded-2xl border-2 outline-none transition-all text-sm font-semibold ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700 text-white focus:border-emerald-500 focus:bg-gray-800"
                  : "bg-gray-50 border-gray-100 text-dark focus:border-emerald-500 focus:bg-white focus:shadow-lg focus:shadow-emerald-500/10"
              }`}
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap gap-4 w-full xl:w-auto">
            <select
              className={`px-8 py-4 rounded-2xl border-2 outline-none cursor-pointer text-sm font-bold xl:min-w-[200px] ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700 text-white focus:border-emerald-500"
                  : "bg-gray-50 border-gray-100 text-dark focus:border-emerald-500 hover:bg-white transition-colors"
              }`}
            >
              <option>All Classifications</option>
              {categories.map((c) => (
                <option key={c}>{c}</option>
              ))}
            </select>
            <button
              className={`px-8 py-4 rounded-2xl border-2 font-bold text-sm transition-all flex items-center gap-2 hover:scale-105 active:scale-95 whitespace-nowrap ${
                darkMode
                  ? "bg-gray-800/50 border-gray-700 text-gray-300 hover:text-white hover:bg-gray-700"
                  : "bg-white border-gray-200 text-gray-600 hover:text-emerald-600 hover:border-emerald-200"
              }`}
            >
              <TrendingUp size={18} />{" "}
              <span className="whitespace-nowrap">Analytics</span>
            </button>
          </div>
        </div>
      </motion.div>

      {/* Artifact Grid */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
      >
        <AnimatePresence mode="popLayout">
          {blogs.map((blog, i) => (
            <motion.div
              key={blog._id}
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.2 } }}
              transition={{ delay: i * 0.05 }}
              whileHover={{ y: -8, transition: { duration: 0.3 } }}
              className={`group rounded-[2.5rem] border overflow-hidden flex flex-col ${
                darkMode
                  ? "bg-dark-lighter border-gray-800 hover:border-emerald-500/30"
                  : "bg-white border-gray-100 shadow-xl shadow-gray-100/50 hover:shadow-2xl hover:shadow-emerald-500/10"
              }`}
            >
              {/* Image Container */}
              <div className="relative h-56 overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent z-10 opacity-60 group-hover:opacity-40 transition-opacity" />
                <img
                  src={
                    blog.featuredImage?.url ||
                    `https://ui-avatars.com/api/?name=${encodeURIComponent(blog.title)}&background=random`
                  }
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ease-out"
                  alt={blog.title}
                />

                {/* Badges */}
                <div className="absolute top-4 left-4 z-20 flex flex-col gap-2">
                  <div
                    className={`px-3 py-1.5 rounded-xl text-[10px] font-bold uppercase tracking-wider backdrop-blur-md border border-white/10 shadow-lg ${
                      blog.status === "published"
                        ? "bg-emerald-500/80 text-white"
                        : "bg-amber-500/80 text-white"
                    }`}
                  >
                    {blog.status}
                  </div>
                </div>

                <div className="absolute bottom-4 left-4 z-20">
                  <span className="px-3 py-1.5 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-white text-[10px] font-bold uppercase tracking-wider">
                    {blog.category}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-8 flex-1 flex flex-col">
                <div className="flex-1">
                  <h3
                    className={`text-xl font-bold tracking-tight mb-3 group-hover:text-emerald-500 transition-colors line-clamp-2 leading-tight ${
                      darkMode ? "text-white" : "text-dark"
                    }`}
                  >
                    {blog.title}
                  </h3>
                  <p
                    className={`text-sm font-medium leading-relaxed line-clamp-3 mb-6 ${darkMode ? "text-gray-400" : "text-gray-500"}`}
                  >
                    {blog.excerpt}
                  </p>
                </div>

                <div className="pt-6 mt-auto border-t border-gray-100 dark:border-gray-800 flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                      <Eye size={14} /> <span>{blog.views || 0}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs font-bold text-gray-400">
                      <Heart size={14} /> <span>{blog.likes || 0}</span>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => openModal("edit", blog)}
                      className={`p-2.5 rounded-xl transition-all ${
                        darkMode
                          ? "bg-gray-800 text-gray-400 hover:text-white hover:bg-gray-700"
                          : "bg-gray-50 text-gray-500 hover:text-emerald-600 hover:bg-emerald-50"
                      }`}
                    >
                      <Edit size={16} />
                    </motion.button>
                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      onClick={() => handleDelete(blog._id)}
                      className={`p-2.5 rounded-xl transition-all ${
                        darkMode
                          ? "bg-rose-500/10 text-rose-500 hover:bg-rose-500 hover:text-white"
                          : "bg-rose-50 text-rose-500 hover:bg-rose-500 hover:text-white"
                      }`}
                    >
                      <Trash2 size={16} />
                    </motion.button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </AnimatePresence>
      </motion.div>

      {/* Editorial Note */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className={`p-10 rounded-3xl border relative overflow-hidden ${
          darkMode
            ? "bg-gradient-to-br from-teal-950/20 to-dark-lighter border-teal-900/30"
            : "bg-gradient-to-br from-teal-50 to-white border-teal-100"
        }`}
      >
        <div className="absolute top-0 right-0 p-12 opacity-5 pointer-events-none">
          <PenTool size={140} />
        </div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
          <div className="flex-1">
            <div className="flex items-center gap-3 mb-4">
              <div
                className={`p-2 rounded-lg ${darkMode ? "bg-emerald-900/50" : "bg-emerald-100"}`}
              >
                <Zap className="text-emerald-600" size={24} />
              </div>
              <span className="text-xs font-bold tracking-widest uppercase text-emerald-500">
                Content Strategy
              </span>
            </div>
            <h2
              className={`text-2xl font-extrabold mb-3 ${
                darkMode ? "text-white" : "text-dark"
              }`}
            >
              Content Resilience
            </h2>
            <p
              className={`text-base leading-relaxed max-w-2xl ${
                darkMode ? "text-gray-400" : "text-gray-600"
              }`}
            >
              Stories are the heart of our mission. Sharing impact stories helps
              donors see the direct result of their contributions and encourages
              community growth.
            </p>
          </div>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-white text-emerald-700 border-2 border-emerald-100 hover:border-emerald-200 px-8 py-4 rounded-2xl font-bold shadow-xl shadow-gray-200/50 hover:shadow-2xl transition-all flex items-center gap-3"
          >
            <PenTool size={20} />
            <span>Draft Story Update</span>
          </motion.button>
        </div>
      </motion.div>

      {/* Narrative Constructor Modal */}
      <AnimatePresence>
        {showModal && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/60 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className={`p-10 lg:p-14 rounded-[3rem] max-w-4xl w-full border max-h-[90vh] overflow-y-auto ${
                darkMode
                  ? "bg-gray-950 border-gray-800"
                  : "bg-white border-gray-100 shadow-2xl"
              }`}
            >
              <div className="flex items-center justify-between mb-10">
                <div>
                  <div className="flex items-center gap-2 mb-2">
                    <span className="w-8 h-1 bg-emerald-500 rounded-full" />
                    <span className="text-xs font-bold text-emerald-500 uppercase tracking-widest">
                      Editor Mode
                    </span>
                  </div>
                  <h2
                    className={`text-3xl font-black tracking-tighter ${
                      darkMode ? "text-white" : "text-dark"
                    }`}
                  >
                    Story Editor
                  </h2>
                </div>
                <motion.button
                  whileHover={{ rotate: 90 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setShowModal(false)}
                  className={`p-4 rounded-2xl transition-colors ${darkMode ? "bg-gray-900 text-gray-400 hover:text-white" : "bg-gray-100 text-gray-500 hover:text-dark"}`}
                >
                  <X size={24} />
                </motion.button>
              </div>

              <form className="space-y-8" onSubmit={handleSubmit}>
                {/* Image Upload Trigger */}
                <div className="flex justify-center mb-8">
                  <label
                    className={`cursor-pointer group relative w-full h-48 md:w-64 md:h-64 rounded-3xl overflow-hidden flex items-center justify-center border-2 border-dashed transition-all ${
                      darkMode
                        ? "bg-gray-900/50 border-gray-700 hover:border-emerald-500"
                        : "bg-gray-50 border-gray-200 hover:border-emerald-500"
                    }`}
                  >
                    <input
                      type="file"
                      className="hidden"
                      onChange={handleImageChange}
                      accept="image/*"
                    />
                    {imagePreview ? (
                      <div className="relative w-full h-full">
                        <img
                          src={imagePreview}
                          className="w-full h-full object-cover"
                          alt="Preview"
                        />
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <span className="text-white font-bold text-sm">
                            Change Cover
                          </span>
                        </div>
                      </div>
                    ) : (
                      <div className="flex flex-col items-center text-gray-400 group-hover:text-emerald-500 transition-colors">
                        <div
                          className={`p-4 rounded-2xl mb-3 ${darkMode ? "bg-gray-800" : "bg-white shadow-sm"}`}
                        >
                          <Upload size={24} />
                        </div>
                        <span className="text-xs font-bold uppercase tracking-widest">
                          Upload Cover Image
                        </span>
                      </div>
                    )}
                  </label>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-6">
                      Post Title
                    </label>
                    <input
                      name="title"
                      onChange={handleInputChange}
                      value={formData.title}
                      placeholder="Enter a captivating title..."
                      className={`w-full px-8 py-5 rounded-[2rem] border-2 font-bold text-sm outline-none transition-all ${
                        darkMode
                          ? "bg-gray-900/50 border-gray-800 text-white focus:border-emerald-500"
                          : "bg-gray-50 border-gray-100 text-dark focus:border-emerald-500 focus:bg-white"
                      }`}
                    />
                  </div>
                  <div className="space-y-3">
                    <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-6">
                      Classification
                    </label>
                    <div className="relative">
                      <select
                        name="category"
                        value={formData.category}
                        onChange={handleInputChange}
                        className={`w-full px-8 py-5 rounded-[2rem] border-2 font-bold text-sm outline-none appearance-none cursor-pointer transition-all ${
                          darkMode
                            ? "bg-gray-900/50 border-gray-800 text-white focus:border-emerald-500"
                            : "bg-gray-50 border-gray-100 text-dark focus:border-emerald-500 focus:bg-white"
                        }`}
                      >
                        {categories.map((c) => (
                          <option key={c} value={c}>
                            {c}
                          </option>
                        ))}
                      </select>
                      <ChevronDown
                        className="absolute right-6 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none"
                        size={18}
                      />
                    </div>
                  </div>
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-6">
                    Story Summary (Excerpt)
                  </label>
                  <textarea
                    name="excerpt"
                    value={formData.excerpt}
                    onChange={handleInputChange}
                    rows={3}
                    placeholder="Briefly summarize the story for previews..."
                    className={`w-full px-8 py-5 rounded-[2.5rem] border-2 font-medium text-sm outline-none resize-none transition-all ${
                      darkMode
                        ? "bg-gray-900/50 border-gray-800 text-white focus:border-emerald-500"
                        : "bg-gray-50 border-gray-100 text-dark focus:border-emerald-500 focus:bg-white"
                    }`}
                  />
                </div>

                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-500 ml-6">
                    Full Narrative Content
                  </label>
                  <textarea
                    name="content"
                    value={formData.content}
                    onChange={handleInputChange}
                    rows={10}
                    placeholder="Write your story here..."
                    className={`w-full px-8 py-8 rounded-[3rem] border-2 font-medium text-sm outline-none resize-none transition-all ${
                      darkMode
                        ? "bg-gray-900/50 border-gray-800 text-white focus:border-emerald-500"
                        : "bg-gray-50 border-gray-100 text-dark focus:border-emerald-500 focus:bg-white"
                    }`}
                  />
                </div>

                <div className="pt-4">
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    className="w-full py-6 rounded-[2.5rem] bg-gradient-to-r from-emerald-600 to-emerald-500 text-white font-black uppercase tracking-widest text-xs shadow-xl shadow-emerald-500/30 hover:shadow-2xl transition-all"
                  >
                    {modalMode === "create" ? "Publish Story" : "Save Changes"}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Blog;
