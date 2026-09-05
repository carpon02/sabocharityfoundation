import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAllBlogs,
  fetchTrendingBlogs,
} from "../../features/blog/blogsSlice";
import { fetchAllEvents } from "../../features/event/eventsSlice";
import {
  MapPin,
  Sparkles,
  Calendar,
  ArrowRight,
  Clock,
  Loader2,
  BookOpen,
} from "lucide-react";

const Blogs = () => {
  const dispatch = useDispatch();
  const {
    blogs,
    trendingBlogs,
    loading: blogsLoading,
  } = useSelector((state) => state.blogs);
  const { events, loading: eventsLoading } = useSelector(
    (state) => state.allEvents
  );

  useEffect(() => {
    dispatch(fetchAllBlogs({ limit: 20 }));
    dispatch(fetchTrendingBlogs());
    dispatch(fetchAllEvents({ limit: 3 }));
  }, [dispatch]);

  const featuredPost = trendingBlogs?.[0] || blogs?.[0];
  const recentPosts = blogs?.filter((b) => b._id !== featuredPost?._id) || [];

  const getImageUrl = (blog) => {
    if (typeof blog?.featuredImage === "string") return blog.featuredImage;
    if (blog?.featuredImage?.url) return blog.featuredImage.url;
    if (blog?.images?.[0]?.url) return blog.images[0].url;
    return "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=1200&fit=crop";
  };

  const formatDate = (ds) => {
    if (!ds) return "Recent";
    return new Date(ds).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  if (
    (blogsLoading && blogs.length === 0) ||
    (eventsLoading && events.length === 0)
  ) {
    return (
      <div className="min-h-screen bg-white flex flex-col items-center justify-center gap-3">
        <Loader2 className="w-8 h-8 text-emerald-500 animate-spin" />
        <p className="text-sm text-gray-400 font-medium">Loading stories...</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      {/* ── HERO ── */}
      <section className="relative pt-28 pb-28 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <BookOpen className="w-3.5 h-3.5" />
            Impact Reports & Insights
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Stories of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Impact
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            Discover the real humans behind the numbers. Insights, updates, and
            deep dives into the Sabo community.
          </p>
        </div>
      </section>

      {/* ── FEATURED ARTICLE ── */}
      {featuredPost && (
        <section className="relative -mt-16 z-20 px-4 mb-20">
          <div className="max-w-7xl mx-auto">
            <Link
              to={`/blogs/${featuredPost._id}`}
              className="group block rounded-2xl overflow-hidden bg-gray-900 shadow-xl border border-white/10"
            >
              <div className="grid lg:grid-cols-2">
                <div className="relative h-72 lg:h-auto overflow-hidden">
                  <img
                    src={getImageUrl(featuredPost)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                    alt="Featured"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-gray-900 to-transparent hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-gray-900 to-transparent lg:hidden" />
                </div>

                <div className="p-8 sm:p-12 flex flex-col justify-center space-y-5">
                  <div className="flex items-center gap-3">
                    <span className="px-3 py-1 bg-emerald-500/20 text-emerald-400 rounded-lg text-xs font-semibold uppercase tracking-wider">
                      {featuredPost.category || "Community"}
                    </span>
                    <span className="text-gray-500 text-xs font-medium">
                      {formatDate(featuredPost.createdAt)}
                    </span>
                  </div>

                  <h2 className="text-2xl sm:text-3xl font-bold text-white leading-tight group-hover:text-emerald-400 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-gray-400 text-sm leading-relaxed line-clamp-3">
                    {featuredPost.excerpt ||
                      featuredPost.content?.substring(0, 200)}
                  </p>

                  <div className="flex items-center justify-between pt-5 border-t border-white/10">
                    <div className="flex items-center gap-3">
                      <div className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center text-emerald-400 text-sm font-bold">
                        {featuredPost.author?.firstName?.[0] || "F"}
                      </div>
                      <div>
                        <p className="text-white text-sm font-medium">
                          {featuredPost.author?.name || "Foundation Team"}
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-5 h-5 text-emerald-400 group-hover:translate-x-2 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* ── RECENT ARTICLES ── */}
      <section className="py-20 px-4 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="mb-12">
            <div className="text-xs font-semibold text-emerald-600 uppercase tracking-wider mb-2">
              Latest Insights
            </div>
            <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
              Recent Articles
            </h3>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {recentPosts.slice(0, 9).map((post, i) => (
              <Link
                key={i}
                to={`/blogs/${post._id}`}
                className="group flex flex-col hover:-translate-y-1 transition-transform duration-300"
              >
                <div className="relative rounded-2xl overflow-hidden aspect-[16/10] shadow-md border border-gray-100 group-hover:shadow-lg transition-shadow">
                  <img
                    src={getImageUrl(post)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    alt="Post"
                    loading="lazy"
                  />
                  <div className="absolute top-3 left-3 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-semibold uppercase tracking-wider text-gray-700">
                    {post.category || "Impact"}
                  </div>
                </div>

                <div className="pt-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-medium text-gray-400">
                    <Calendar size={12} className="text-emerald-500" />
                    {formatDate(post.createdAt)}
                  </div>
                  <h4 className="text-lg font-bold text-gray-900 group-hover:text-emerald-600 transition-colors leading-tight line-clamp-2">
                    {post.title}
                  </h4>
                  <p className="text-gray-500 text-sm leading-relaxed line-clamp-2">
                    {post.excerpt || post.content?.substring(0, 150)}
                  </p>
                  <div className="flex items-center gap-1.5 text-emerald-600 font-semibold text-xs pt-1 group-hover:gap-3 transition-all">
                    Read More <ArrowRight size={12} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── UPCOMING EVENTS ── */}
      {events && events.length > 0 && (
        <section className="py-24 px-4 bg-gray-900">
          <div className="max-w-7xl mx-auto">
            <div className="mb-14 text-center space-y-3">
              <div className="text-xs font-semibold text-emerald-400 uppercase tracking-wider">
                Upcoming
              </div>
              <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                Events & Missions
              </h3>
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {events.slice(0, 3).map((event, i) => (
                <div
                  key={i}
                  className="group rounded-2xl p-7 bg-white/5 border border-white/10 hover:border-emerald-500/30 hover:shadow-lg transition-all duration-300"
                >
                  <div className="space-y-5">
                    <div className="flex justify-between items-start">
                      <div className="w-14 h-14 rounded-xl bg-emerald-500/10 flex flex-col items-center justify-center border border-emerald-500/20 text-emerald-400">
                        <span className="text-lg font-bold leading-none">
                          {new Date(event.eventDate).getDate()}
                        </span>
                        <span className="text-[10px] font-medium uppercase">
                          {new Date(event.eventDate).toLocaleString("default", {
                            month: "short",
                          })}
                        </span>
                      </div>
                      <div className="px-3 py-1 rounded-lg bg-white/5 border border-white/10 text-[10px] font-medium text-gray-400 uppercase tracking-wider">
                        {event.category?.replace("_", " ") || "Event"}
                      </div>
                    </div>

                    <h4 className="text-lg font-bold text-white group-hover:text-emerald-400 transition-colors">
                      {event.title}
                    </h4>

                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {event.description}
                    </p>

                    <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-1.5">
                        <Clock size={12} className="text-emerald-500" />
                        {event.eventTime?.start}
                      </div>
                      <div className="flex items-center gap-1.5">
                        <MapPin size={12} className="text-emerald-500" />
                        {event.location?.venue}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* ── NEWSLETTER ── */}
      <section className="py-24 px-4 bg-gray-50">
        <div className="max-w-2xl mx-auto bg-white rounded-2xl border border-gray-200 shadow-lg p-10 sm:p-14 text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Stay in the Loop
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Get raw, unfiltered updates on how your contributions are shifting
            the needle for the youth of Ibadan.
          </p>
          <div className="flex gap-2 max-w-md mx-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="flex-1 px-5 py-3 bg-gray-50 border border-gray-200 rounded-xl text-sm outline-none focus:border-emerald-500 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
            <button className="px-6 py-3 bg-gray-900 text-white text-sm font-semibold rounded-xl hover:bg-emerald-700 transition-colors">
              Join
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
