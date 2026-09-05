import React, { useState } from "react";
import { Play, X, ZoomIn, Camera, Video, Sparkles, Heart } from "lucide-react";
import { Link } from "react-router-dom";
import Meta from "../../components/Meta";

const mediaItems = [
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Impactful moment",
    category: "Community",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1542810634-71277d95dcbb?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Community support",
    category: "Education",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Education support",
    category: "Education",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1628348068343-c0a848d59348?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Volunteer action",
    category: "Volunteering",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1531206715517-5cd946ad5047?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Teamwork",
    category: "Community",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1517048676732-d65bc937f952?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Youth empowerment",
    category: "Youth",
  },
  {
    type: "video",
    src: "https://www.w3schools.com/html/mov_bbb.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?q=80&w=800&auto=format&fit=crop",
    alt: "Community Impact Story",
    category: "Stories",
  },
  {
    type: "video",
    src: "https://www.w3schools.com/html/movie.mp4",
    thumbnail:
      "https://images.unsplash.com/photo-1495567720989-cebdbdd97913?q=80&w=800&auto=format&fit=crop",
    alt: "Educational Initiative",
    category: "Education",
  },
];

const categories = ["all", "Community", "Education", "Volunteering", "Youth", "Stories"];

const Media = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [lightboxItem, setLightboxItem] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const filteredItems =
    selectedFilter === "all"
      ? mediaItems
      : mediaItems.filter((item) => item.category === selectedFilter);

  return (
    <div className="bg-white min-h-screen">
      <Meta
        title="Media Gallery"
        description="Explore the visual journey of impact at Sabo, Ibadan. View photos and videos of our community initiatives and community involvement."
      />

      {/* ── HERO ── */}
      <section className="relative pt-28 pb-24 bg-gray-900 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-900 to-emerald-950/40" />
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-5 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 border border-white/10 text-emerald-400 text-xs font-semibold uppercase tracking-wider">
            <Camera className="w-3.5 h-3.5" />
            Visual Gallery
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-tight tracking-tight">
            Moments of{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-teal-400">
              Impact
            </span>
          </h1>
          <p className="text-lg text-gray-400 max-w-xl mx-auto leading-relaxed">
            A visual journey through the streets of Sabo and the lives we are
            transforming together.
          </p>
        </div>
      </section>

      {/* ── FILTER BAR ── */}
      <div className="sticky top-16 z-40 bg-white/95 backdrop-blur-md border-b border-gray-100 py-4 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-2">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-5 py-2 rounded-xl text-xs font-semibold uppercase tracking-wider transition-all ${
                selectedFilter === cat
                  ? "bg-gray-900 text-white shadow-md"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* ── GALLERY GRID ── */}
      <section className="py-16 px-4">
        <div className="max-w-7xl mx-auto">
          {filteredItems.length === 0 ? (
            <div className="text-center py-20 text-gray-400">
              <Camera className="w-10 h-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm font-medium">No items in this category</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
              {filteredItems.map((item, i) => (
                <div
                  key={i}
                  className="group relative rounded-2xl overflow-hidden bg-gray-100 shadow-sm hover:shadow-xl border border-gray-100 cursor-pointer transition-all duration-300 hover:-translate-y-1"
                  onClick={() =>
                    item.type === "image"
                      ? setLightboxItem(item)
                      : setPlayingVideo(item)
                  }
                >
                  <div
                    className={`relative overflow-hidden ${
                      i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"
                    }`}
                  >
                    <img
                      src={item.type === "image" ? item.src : item.thumbnail}
                      alt={item.alt}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-gray-900/70 via-gray-900/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Category Badge */}
                    <div className="absolute top-3 left-3 flex items-center gap-1.5 px-2.5 py-1 bg-white/90 backdrop-blur-sm rounded-lg text-[10px] font-semibold uppercase tracking-wider text-gray-700">
                      {item.type === "video" ? (
                        <Video size={10} />
                      ) : (
                        <Camera size={10} />
                      )}
                      {item.category}
                    </div>

                    {/* Play Button for Video */}
                    {item.type === "video" && (
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-14 h-14 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center group-hover:bg-emerald-500 group-hover:scale-110 transition-all shadow-xl">
                          <Play className="text-white fill-white ml-0.5" size={20} />
                        </div>
                      </div>
                    )}

                    {/* Hover Info */}
                    <div className="absolute bottom-0 left-0 right-0 p-5 opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all duration-300">
                      <h4 className="text-sm font-bold text-white leading-tight mb-1">
                        {item.alt}
                      </h4>
                      <div className="flex items-center gap-1.5 text-emerald-400 text-xs font-medium">
                        {item.type === "video" ? "Watch Video" : "View Photo"}
                        <ZoomIn size={12} />
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ── LIGHTBOX ── */}
      {(lightboxItem || playingVideo) && (
        <div
          className="fixed inset-0 bg-gray-950/95 backdrop-blur-md z-[100] flex items-center justify-center p-4 sm:p-16"
          onClick={() => {
            setLightboxItem(null);
            setPlayingVideo(null);
          }}
        >
          <button className="absolute top-5 right-5 w-12 h-12 bg-white/10 hover:bg-white/20 rounded-xl flex items-center justify-center text-white transition-colors">
            <X size={24} />
          </button>

          <div
            className="max-w-5xl w-full"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxItem ? (
              <img
                src={lightboxItem.src}
                className="w-full h-auto rounded-2xl shadow-2xl"
                alt="Preview"
              />
            ) : (
              <div className="aspect-video bg-black rounded-2xl overflow-hidden shadow-2xl">
                <video controls autoPlay className="w-full h-full">
                  <source src={playingVideo.src} type="video/mp4" />
                </video>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── CTA ── */}
      <section className="py-20 bg-gray-50 border-t border-gray-100">
        <div className="max-w-3xl mx-auto px-4 text-center space-y-6">
          <div className="w-12 h-12 rounded-xl bg-emerald-100 flex items-center justify-center text-emerald-600 mx-auto">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="text-2xl sm:text-3xl font-extrabold text-gray-900 tracking-tight">
            Ready to create the next{" "}
            <span className="text-emerald-600">Moment?</span>
          </h3>
          <p className="text-sm text-gray-500 max-w-md mx-auto">
            Your contributions directly translate into these visual stories of
            hope and progress.
          </p>
          <Link
            to="/make-donation"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-gray-900 text-white font-semibold rounded-xl hover:bg-emerald-700 transition-colors shadow-lg text-sm"
          >
            Make a Donation
            <Heart size={16} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Media;
