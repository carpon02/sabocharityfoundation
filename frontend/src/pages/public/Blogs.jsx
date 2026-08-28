import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Link } from "react-router-dom";
import {
  fetchAllBlogs,
  fetchTrendingBlogs,
} from "../../features/blog/blogsSlice";
import { fetchAllEvents } from "../../features/event/eventsSlice";
import { MapPin, Sparkles, Calendar, ArrowRight, Clock } from "lucide-react";

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
      <div className="min-h-screen bg-paper flex flex-col items-center justify-center p-20 animate-pulse">
        <div className="w-16 h-16 border-4 border-primary-500 border-t-transparent rounded-full animate-spin mb-6" />
        <p className="text-gray-400 font-bold uppercase tracking-[0.2em] text-xs">
          Curating Stories...
        </p>
      </div>
    );
  }

  return (
    <div className="bg-paper min-h-screen">
      {/* --- HERO HEADER --- */}
      <section className="relative pt-32 pb-20 bg-dark-darker overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary-500 font-bold text-xs uppercase tracking-widest animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            Impact Reports & Insights
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter animate-fade-in-up">
            Stories of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600 underline decoration-primary-900">
              Impact.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up stagger-1">
            Discover the real humans behind the numbers. Insights, updates, and
            deep dives into the Sabo community.
          </p>
        </div>
      </section>

      {/* --- FEATURED ARTICLE --- */}
      {featuredPost && (
        <section className="relative -mt-20 z-20 px-4 mb-32">
          <div className="max-w-7xl mx-auto">
            <Link
              to={`/blogs/${featuredPost._id}`}
              className="group block relative bg-dark rounded-[3rem] overflow-hidden shadow-[0_50px_100px_-20px_rgba(0,0,0,0.4)] border border-white/5"
            >
              <div className="grid lg:grid-cols-2">
                <div className="relative h-[400px] lg:h-[600px] overflow-hidden">
                  <img
                    src={getImageUrl(featuredPost)}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-[3s]"
                    alt="Featured"
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-dark to-transparent hidden lg:block" />
                  <div className="absolute inset-0 bg-gradient-to-t from-dark to-transparent lg:hidden" />
                </div>

                <div className="p-12 md:p-20 flex flex-col justify-center space-y-8 relative">
                  <div className="flex items-center gap-4">
                    <span className="px-4 py-1.5 bg-primary-600 text-white rounded-full text-[10px] font-black uppercase tracking-widest">
                      {featuredPost.category || "COMMUNITY"}
                    </span>
                    <span className="text-gray-500 text-xs font-bold">
                      {formatDate(featuredPost.createdAt)}
                    </span>
                  </div>

                  <h2 className="text-4xl md:text-5xl font-black text-white leading-tight group-hover:text-primary-400 transition-colors">
                    {featuredPost.title}
                  </h2>

                  <p className="text-gray-400 text-lg leading-relaxed line-clamp-3">
                    {featuredPost.excerpt ||
                      featuredPost.content?.substring(0, 200)}
                  </p>

                  <div className="flex items-center justify-between pt-8 border-t border-white/10">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-primary-400 font-black">
                        {featuredPost.author?.firstName?.[0] || "F"}
                      </div>
                      <div>
                        <p className="text-white text-sm font-bold">
                          {featuredPost.author?.name || "Foundation Team"}
                        </p>
                        <p className="text-gray-500 text-xs uppercase tracking-tighter">
                          Strategic Impact Lead
                        </p>
                      </div>
                    </div>
                    <ArrowRight className="w-10 h-10 text-secondary-500 group-hover:translate-x-4 transition-transform" />
                  </div>
                </div>
              </div>
            </Link>
          </div>
        </section>
      )}

      {/* --- RECENT ARTICLES GRID --- */}
      <section className="py-20 px-4 bg-paper">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-end justify-between mb-16 px-4">
            <div className="space-y-4">
              <div className="text-secondary-600 font-bold uppercase tracking-widest text-xs">
                Latest Insights
              </div>
              <h3 className="text-5xl font-black text-dark tracking-tighter">
                Recent Analysis.
              </h3>
            </div>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-12">
            {recentPosts.slice(0, 9).map((post, i) => (
              <Link
                key={i}
                to={`/blogs/${post._id}`}
                className="group flex flex-col space-y-6 animate-fade-in-up hover:-translate-y-2 transition-transform duration-500"
              >
                <div className="relative rounded-[40px] overflow-hidden aspect-[16/10] shadow-xl border-8 border-gray-50 group-hover:shadow-2xl transition-all">
                  <img
                    src={getImageUrl(post)}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                    alt="Post"
                  />
                  <div className="absolute top-6 left-6 px-4 py-1.5 glass-card rounded-full text-[10px] font-black uppercase tracking-widest text-primary-700">
                    {post.category || "IMPACT"}
                  </div>
                </div>

                <div className="px-2 space-y-4">
                  <div className="flex items-center gap-3 text-xs font-bold text-gray-500">
                    <Calendar size={14} className="text-primary-500" />
                    {formatDate(post.createdAt)}
                  </div>
                  <h4 className="text-2xl font-black text-dark group-hover:text-primary-700 transition-colors leading-tight">
                    {post.title}
                  </h4>
                  <p className="text-gray-500 leading-relaxed text-sm line-clamp-3">
                    {post.excerpt || post.content?.substring(0, 150)}
                  </p>
                  <div className="flex items-center gap-2 text-primary-700 font-black text-xs uppercase tracking-widest group-hover:gap-4 transition-all">
                    Read Report <ArrowRight size={14} />
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* --- UPCOMING MISSIONS/EVENTS --- */}
      {events && events.length > 0 && (
        <section className="py-32 px-4 bg-dark-darker overflow-hidden relative">
          <div className="absolute top-0 left-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/carbon-fibre.png')] opacity-[0.05] pointer-events-none" />
          <div className="max-w-7xl mx-auto relative z-10">
            <div className="mb-20 text-center space-y-4">
              <div className="text-primary-500 font-bold uppercase tracking-[0.4em] text-xs">
                Tactical Deployments
              </div>
              <h3 className="text-5xl md:text-7xl font-black text-white tracking-tighter">
                Upcoming Missions.
              </h3>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {events.slice(0, 3).map((event, i) => (
                <div
                  key={i}
                  className="group relative bg-white/5 backdrop-blur-xl rounded-[3rem] p-10 border border-white/10 hover:border-primary-500/50 transition-all duration-700 hover:-translate-y-4"
                >
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary-500/10 rounded-full blur-[50px] opacity-0 group-hover:opacity-100 transition-opacity" />

                  <div className="space-y-6">
                    <div className="flex justify-between items-start">
                      <div className="w-16 h-16 rounded-2xl bg-primary-500/10 flex flex-col items-center justify-center border border-primary-500/20 text-primary-500">
                        <span className="text-xl font-black leading-none">
                          {new Date(event.eventDate).getDate()}
                        </span>
                        <span className="text-[10px] font-bold uppercase tracking-widest">
                          {new Date(event.eventDate).toLocaleString("default", {
                            month: "short",
                          })}
                        </span>
                      </div>
                      <div className="px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-[10px] font-bold text-gray-400 uppercase tracking-widest">
                        {event.category?.replace("_", " ") || "MISSION"}
                      </div>
                    </div>

                    <h4 className="text-2xl font-black text-white group-hover:text-primary-400 transition-colors">
                      {event.title}
                    </h4>

                    <p className="text-gray-400 text-sm leading-relaxed line-clamp-2">
                      {event.description}
                    </p>

                    <div className="pt-6 border-t border-white/5 flex items-center justify-between text-xs text-gray-500">
                      <div className="flex items-center gap-2">
                        <Clock size={14} className="text-primary-500" />
                        {event.eventTime?.start}
                      </div>
                      <div className="flex items-center gap-2">
                        <MapPin size={14} className="text-primary-500" />
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

      {/* --- NEWSLETTER CTA --- */}
      <section className="py-32 px-4">
        <div className="max-w-7xl mx-auto bg-gray-50 rounded-[5rem] p-12 md:p-24 flex flex-col items-center text-center space-y-10 border border-gray-100 shadow-sm">
          <div className="w-20 h-20 rounded-3xl bg-secondary-100 flex items-center justify-center text-secondary-600">
            <Sparkles className="w-10 h-10" />
          </div>
          <h3 className="text-4xl md:text-6xl font-black text-dark max-w-2xl leading-[1.1]">
            Join our circle of Impact Strategists.
          </h3>
          <p className="text-lg text-gray-500 max-w-xl">
            Get raw, unfiltered updates on how your contributions are shifting
            the needle for the youth of Ibadan.
          </p>
          <div className="w-full max-w-md relative">
            <input
              type="email"
              placeholder="Enter your email"
              className="w-full py-6 px-8 rounded-3xl bg-white border border-gray-200 outline-none focus:ring-4 focus:ring-primary-500/10 shadow-xl"
            />
            <button className="absolute right-2 top-2 bottom-2 px-8 bg-primary-900 text-white font-black rounded-2xl hover:bg-dark transition-colors">
              Join
            </button>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Blogs;
