import React, { useEffect, useMemo } from "react";
import { Link, useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { ArrowLeft, Calendar, Clock, User } from "lucide-react";
import {
  clearSelectedBlog,
  fetchBlogById,
} from "../../features/blog/blogsSlice";
import Meta from "../../components/Meta";

const getImageUrl = (blog) => {
  if (!blog) return "";
  if (typeof blog.featuredImage === "string") return blog.featuredImage;
  if (blog.featuredImage?.url) return blog.featuredImage.url;
  if (blog.images?.[0]?.url) return blog.images[0].url;
  return "";
};

const getAuthorName = (author) => {
  if (!author) return "Foundation Team";
  if (author.fullName) return author.fullName;
  const name = [author.firstName, author.lastName].filter(Boolean).join(" ");
  return name || author.name || "Foundation Team";
};

const formatDate = (ds) => {
  if (!ds) return "Recent";
  return new Date(ds).toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric",
  });
};

const BlogDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { selectedBlog, loading, error } = useSelector((state) => state.blogs);

  useEffect(() => {
    if (id) dispatch(fetchBlogById(id));
    return () => {
      dispatch(clearSelectedBlog());
    };
  }, [dispatch, id]);

  const imageUrl = getImageUrl(selectedBlog);
  const isHtml = useMemo(() => {
    const content = selectedBlog?.content || "";
    return /<\/?[a-z][\s\S]*>/i.test(content);
  }, [selectedBlog?.content]);

  if (loading && !selectedBlog) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-20 animate-pulse">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">
          Loading story...
        </p>
      </div>
    );
  }

  if (error || !selectedBlog) {
    return (
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-8 text-center">
        <h1 className="text-3xl font-black text-dark mb-3">Story not found</h1>
        <p className="text-gray-500 mb-8 max-w-md">
          {error || "This update may have been unpublished or the link is outdated."}
        </p>
        <Link
          to="/blogs"
          className="inline-flex items-center gap-2 px-6 py-3 rounded-2xl bg-primary-900 text-white font-bold"
        >
          <ArrowLeft size={16} />
          Back to stories
        </Link>
      </div>
    );
  }

  const description =
    selectedBlog.metaDescription ||
    selectedBlog.excerpt ||
    selectedBlog.content?.replace(/<[^>]*>/g, "").slice(0, 160);

  return (
    <article className="bg-paper min-h-screen">
      <Meta
        title={selectedBlog.metaTitle || selectedBlog.title}
        description={description}
        ogType="article"
        ogImage={imageUrl || "/og-image.jpg"}
      />

      <section className="relative pt-32 pb-16 bg-dark-darker overflow-hidden">
        <div className="absolute top-0 right-0 w-[640px] h-[640px] bg-primary-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3" />
        <div className="max-w-3xl mx-auto px-4 relative z-10 space-y-6">
          <Link
            to="/blogs"
            className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-secondary-500 hover:text-white transition-colors"
          >
            <ArrowLeft size={14} />
            All stories
          </Link>
          <div className="flex flex-wrap items-center gap-3 text-xs font-bold text-gray-400 uppercase tracking-widest">
            <span className="px-3 py-1 rounded-full bg-primary-600 text-white">
              {selectedBlog.category || "Community"}
            </span>
            <span className="inline-flex items-center gap-1">
              <Calendar size={12} />
              {formatDate(selectedBlog.publishDate || selectedBlog.createdAt)}
            </span>
            {selectedBlog.readingTime ? (
              <span className="inline-flex items-center gap-1">
                <Clock size={12} />
                {selectedBlog.readingTime} min read
              </span>
            ) : null}
          </div>
          <h1 className="text-4xl md:text-6xl font-black text-white leading-tight tracking-tight">
            {selectedBlog.title}
          </h1>
          <p className="text-lg text-gray-400 leading-relaxed">
            {selectedBlog.excerpt}
          </p>
          <div className="flex items-center gap-3 pt-2 text-sm text-gray-400">
            <User size={16} className="text-primary-400" />
            {getAuthorName(selectedBlog.author)}
          </div>
        </div>
      </section>

      {imageUrl ? (
        <div className="max-w-5xl mx-auto px-4 -mt-10 relative z-10">
          <img
            src={imageUrl}
            alt={selectedBlog.title}
            className="w-full max-h-[480px] object-cover rounded-[2rem] border border-gray-100 shadow-xl"
          />
        </div>
      ) : null}

      <div className="max-w-3xl mx-auto px-4 py-16">
        {isHtml ? (
          <div
            className="prose prose-lg max-w-none text-gray-700 leading-relaxed"
            dangerouslySetInnerHTML={{ __html: selectedBlog.content }}
          />
        ) : (
          <div className="text-gray-700 leading-relaxed whitespace-pre-wrap text-lg">
            {selectedBlog.content}
          </div>
        )}

        {selectedBlog.relatedPosts?.length > 0 ? (
          <div className="mt-20 pt-10 border-t border-gray-200">
            <h2 className="text-2xl font-black text-dark mb-6">Related stories</h2>
            <div className="grid gap-4">
              {selectedBlog.relatedPosts.map((post) => (
                <Link
                  key={post._id}
                  to={`/blogs/${post._id}`}
                  className="block p-5 rounded-2xl bg-white border border-gray-100 hover:border-primary-200 transition-colors"
                >
                  <p className="text-xs font-bold uppercase tracking-widest text-primary-600 mb-1">
                    {post.category}
                  </p>
                  <p className="font-bold text-dark">{post.title}</p>
                </Link>
              ))}
            </div>
          </div>
        ) : null}
      </div>
    </article>
  );
};

export default BlogDetail;
