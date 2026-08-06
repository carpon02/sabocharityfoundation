import React, { useState } from "react";
import { Play, X, ZoomIn, Filter, Camera, Video, Sparkles } from "lucide-react";
import Meta from "../../components/Meta";

const mediaItems = [
  // Images
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
  // Videos
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

const Media = () => {
  const [selectedFilter, setSelectedFilter] = useState("all");
  const [lightboxItem, setLightboxItem] = useState(null);
  const [playingVideo, setPlayingVideo] = useState(null);

  const categories = [
    "all",
    "Community",
    "Education",
    "Volunteering",
    "Youth",
    "Stories",
  ];

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
      {/* --- HERO HEADER --- */}
      <section className="relative pt-32 pb-24 bg-dark overflow-hidden">
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-900/10 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8 relative z-10">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary-500 font-bold text-xs uppercase tracking-widest animate-fade-in-up">
            <Camera className="w-4 h-4" />
            Visual Anthology
          </div>
          <h1 className="text-6xl md:text-8xl font-black text-white leading-[0.9] tracking-tighter animate-fade-in-up">
            Moments of <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Impact.
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up stagger-1">
            A raw, visual journey through the streets of Sabo and the lives we
            are transforming together.
          </p>
        </div>
      </section>

      {/* --- FILTERS --- */}
      <section className="sticky top-20 z-40 bg-white/80 backdrop-blur-md border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-center gap-3">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedFilter(cat)}
              className={`px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all ${
                selectedFilter === cat
                  ? "bg-primary-900 text-white shadow-xl scale-105"
                  : "bg-gray-100 text-gray-500 hover:bg-gray-200"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </section>

      {/* --- MASONRY GRID --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredItems.map((item, i) => (
              <div
                key={i}
                className="group relative rounded-[3rem] overflow-hidden bg-gray-100 shadow-xl hover:shadow-[0_40px_80px_-20px_rgba(0,0,0,0.25)] transition-all duration-700 animate-fade-in-up"
                style={{ animationDelay: `${i * 100}ms` }}
                onClick={() =>
                  item.type === "image"
                    ? setLightboxItem(item)
                    : setPlayingVideo(item)
                }
              >
                <div
                  className={`relative ${
                    i % 3 === 0 ? "aspect-[3/4]" : "aspect-square"
                  } overflow-hidden`}
                >
                  <img
                    src={item.type === "image" ? item.src : item.thumbnail}
                    alt={item.alt}
                    className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-[2s]"
                  />

                  {/* Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-dark/80 via-dark/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

                  {/* Badge */}
                  <div className="absolute top-6 left-6 flex items-center gap-2 px-4 py-1.5 glass-card rounded-full text-[10px] font-black uppercase tracking-widest text-primary-700">
                    {item.type === "video" ? (
                      <Video size={12} />
                    ) : (
                      <Camera size={12} />
                    )}
                    {item.category}
                  </div>

                  {/* Play Button for Video */}
                  {item.type === "video" && (
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-full bg-white/20 backdrop-blur-md flex items-center justify-center group-hover:bg-primary-500 group-hover:scale-110 transition-all shadow-2xl">
                        <Play
                          className="text-white fill-white ml-1"
                          size={24}
                        />
                      </div>
                    </div>
                  )}

                  {/* Info */}
                  <div className="absolute bottom-10 left-10 p-2 opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <h4 className="text-xl font-black text-white leading-tight">
                      {item.alt}
                    </h4>
                    <div className="flex items-center gap-2 text-primary-400 font-bold text-xs mt-2 uppercase tracking-widest">
                      View Experience <ZoomIn size={14} />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- LIGHTBOX & VIDEO PLAYER --- */}
      {(lightboxItem || playingVideo) && (
        <div
          className="fixed inset-0 bg-dark/95 backdrop-blur-xl z-[100] flex items-center justify-center p-6 sm:p-20"
          onClick={() => {
            setLightboxItem(null);
            setPlayingVideo(null);
          }}
        >
          <button className="absolute top-10 right-10 w-16 h-16 bg-white/5 hover:bg-white/10 rounded-full flex items-center justify-center text-white transition-all">
            <X size={32} />
          </button>

          <div
            className="max-w-6xl w-full animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {lightboxItem ? (
              <img
                src={lightboxItem.src}
                className="w-full h-auto rounded-[3rem] shadow-2xl"
                alt="Preview"
              />
            ) : (
              <div className="aspect-video bg-black rounded-[3rem] overflow-hidden shadow-2xl relative">
                <video controls autoPlay className="w-full h-full">
                  <source src={playingVideo.src} type="video/mp4" />
                </video>
              </div>
            )}
          </div>
        </div>
      )}

      {/* --- CTA BOTTOM --- */}
      <section className="py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 flex flex-col items-center text-center space-y-10">
          <div className="w-20 h-20 rounded-3xl bg-primary-100 flex items-center justify-center text-primary-600">
            <Sparkles className="w-10 h-10" />
          </div>
          <h3 className="text-4xl md:text-6xl font-black text-dark tracking-tighter max-w-3xl">
            Ready to create the next{" "}
            <span className="text-primary-700">Moment?</span>
          </h3>
          <p className="text-lg text-gray-500 max-w-xl">
            Your contributions directly translate into these visual stories of
            hope and progress.
          </p>
          <button className="px-12 py-6 bg-primary-900 text-white font-black rounded-[2rem] shadow-2xl hover:bg-dark transition-all scale-110">
            Make a Donation
          </button>
        </div>
      </section>
    </div>
  );
};

export default Media;
