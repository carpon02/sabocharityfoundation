import React, { useState, useMemo, useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  Search,
  SlidersHorizontal,
  Grid3x3,
  List,
  X,
  Sparkles,
  MapPin,
  Clock,
  Users,
  Loader,
  Heart,
  Filter,
  ArrowRight,
} from "lucide-react";
import { fetchAllCampaigns } from "../../features/campaign/campaignsSlice";
import CampaignCardModern from "../../components/CampaignCardModern";
import Meta from "../../components/Meta";

const Campaigns = () => {
  const dispatch = useDispatch();
  const { campaigns, loading, error } = useSelector((state) => state.campaigns);

  // State
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [statusFilter] = useState("all");
  const [sortBy, setSortBy] = useState("featured");
  const [viewMode, setViewMode] = useState("grid");
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Categories (Matching seeder/backend exactly)
  const categories = [
    "education",
    "health",
    "empowerment",
    "food_relief",
    "infrastructure",
    "welfare",
  ];

  const categoryLabels = {
    education: "Education",
    health: "Health",
    empowerment: "Empowerment",
    food_relief: "Food Relief",
    infrastructure: "Infrastructure",
    welfare: "Welfare",
  };

  useEffect(() => {
    dispatch(fetchAllCampaigns());
  }, [dispatch]);

  // Filter and sort campaigns
  const filteredAndSortedCampaigns = useMemo(() => {
    let filtered = campaigns || [];

    if (searchQuery.trim()) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(
        (c) =>
          c.title?.toLowerCase().includes(query) ||
          c.description?.toLowerCase().includes(query),
      );
    }

    if (selectedCategories.length > 0) {
      filtered = filtered.filter((c) =>
        selectedCategories.some(
          (cat) => cat.toLowerCase() === c.category?.toLowerCase(),
        ),
      );
    }

    if (statusFilter !== "all") {
      filtered = filtered.filter((c) => c.status === statusFilter);
    }

    // Sort Logic (Simplified for brevity)
    return [...filtered].sort((a, b) => {
      if (sortBy === "newest")
        return new Date(b.createdAt) - new Date(a.createdAt);
      if (sortBy === "target-desc") return b.targetAmount - a.targetAmount;
      return 0;
    });
  }, [campaigns, searchQuery, selectedCategories, statusFilter, sortBy]);

  return (
    <div className="min-h-screen bg-paper">
      <Meta
        title="Active Missions"
        description="Browse our ongoing charity campaigns in Sabo, Ibadan. From education to healthcare, find a mission that resonates with you and make a difference today."
      />
      {/* --- HERO HEADER --- */}
      <section className="relative pt-32 pb-20 bg-dark overflow-hidden">
        <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-primary-900/10 rounded-full blur-[100px]" />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary-500 font-bold text-xs uppercase tracking-widest animate-fade-in-up">
            <Sparkles className="w-4 h-4" />
            Empowerment in Action
          </div>
          <h1 className="text-6xl md:text-7xl font-black text-white leading-tight animate-fade-in-up">
            Our Active{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-primary-400 to-primary-600">
              Campaigns
            </span>
          </h1>
          <p className="text-xl text-gray-400 max-w-2xl mx-auto animate-fade-in-up stagger-1">
            Every naira raised goes directly to the field. Browse our ongoing
            initiatives and find a cause that speaks to you.
          </p>
        </div>
      </section>

      {/* --- FILTER & SEARCH BAR --- */}
      <section className="sticky top-20 z-40 bg-paper/80 backdrop-blur-md border-b border-gray-100 py-6">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            {/* Search */}
            <div className="relative w-full md:w-96 group">
              <Search
                className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 group-focus-within:text-primary-600 transition-colors"
                size={20}
              />
              <input
                type="text"
                placeholder="Search campaigns..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-2xl focus:ring-2 focus:ring-primary-500/20 focus:border-primary-500 outline-none transition-all"
              />
            </div>

            {/* Actions */}
            <div className="flex items-center gap-4 w-full md:w-auto overflow-x-auto pb-2 md:pb-0">
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className={`flex items-center gap-2 px-6 py-3 rounded-2xl font-bold text-sm transition-all whitespace-nowrap ${
                  isFilterOpen
                    ? "bg-primary-900 text-white"
                    : "bg-gray-100 text-dark hover:bg-gray-200"
                }`}
              >
                <Filter size={18} />
                Filters
              </button>

              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="px-6 py-3 bg-gray-100 border-none rounded-2xl font-bold text-sm outline-none focus:ring-2 focus:ring-primary-500/20"
              >
                <option value="featured">Featured First</option>
                <option value="newest">Newest First</option>
                <option value="target-desc">Highest Goal</option>
              </select>

              <div className="flex bg-gray-100 p-1 rounded-2xl">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-2 rounded-xl transition-all ${
                    viewMode === "grid"
                      ? "bg-white shadow-sm text-primary-600"
                      : "text-gray-400"
                  }`}
                >
                  <Grid3x3 size={20} />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-2 rounded-xl transition-all ${
                    viewMode === "list"
                      ? "bg-white shadow-sm text-primary-600"
                      : "text-gray-400"
                  }`}
                >
                  <List size={20} />
                </button>
              </div>
            </div>
          </div>

          {/* Expanded Filters */}
          {isFilterOpen && (
            <div className="mt-8 pt-8 border-t border-gray-100 grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4 animate-fade-in-up">
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => {
                    if (selectedCategories.includes(cat)) {
                      setSelectedCategories(
                        selectedCategories.filter((c) => c !== cat),
                      );
                    } else {
                      setSelectedCategories([...selectedCategories, cat]);
                    }
                  }}
                  className={`px-4 py-3 rounded-xl border text-sm font-bold transition-all ${
                    selectedCategories.includes(cat)
                      ? "bg-primary-50 border-primary-500 text-primary-700"
                      : "bg-white border-gray-200 text-gray-500 hover:border-primary-200"
                  }`}
                >
                  {categoryLabels[cat] || cat.replace("_", " ")}
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- CAMPAIGN GRID --- */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          {loading ? (
            <div className="flex flex-col items-center justify-center py-40 animate-pulse">
              <Loader className="w-12 h-12 text-primary-500 animate-spin mb-4" />
              <p className="text-gray-500 font-bold uppercase tracking-widest text-xs">
                Curating Impact...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-40">
              <div className="text-red-500 font-bold mb-4">
                Oops! Failed to load campaigns.
              </div>
              <button
                onClick={() => dispatch(fetchAllCampaigns())}
                className="text-primary-600 font-bold underline"
              >
                Try Again
              </button>
            </div>
          ) : filteredAndSortedCampaigns.length === 0 ? (
            <div className="text-center py-40">
              <div className="text-4xl font-black text-dark mb-4">
                No Campaigns Found
              </div>
              <p className="text-gray-500 mb-4">
                {campaigns.length === 0
                  ? "There are no active campaigns available at the moment. Please check back later."
                  : "Try adjusting your filters or search terms."}
              </p>
              {error && (
                <p className="text-red-500 text-sm mt-2">Error: {error}</p>
              )}
            </div>
          ) : (
            <div
              className={`grid gap-8 ${
                viewMode === "grid"
                  ? "md:grid-cols-2 lg:grid-cols-3"
                  : "grid-cols-1"
              }`}
            >
              {filteredAndSortedCampaigns.map((campaign) => (
                <CampaignCardModern
                  key={campaign._id || campaign.id}
                  campaign={campaign}
                />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* --- CTA Section --- */}
      <section className="py-24 bg-primary-50">
        <div className="max-w-7xl mx-auto px-4 text-center space-y-8">
          <h2 className="text-4xl md:text-5xl font-black text-dark tracking-tight leading-tight">
            Can't find what you're{" "}
            <span className="text-primary-700">looking for?</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            We have many hidden micro-projects happening in the Sabo community.
            Reach out to us to find a custom way to contribute.
          </p>
          <Link
            to="/contact"
            className="inline-flex items-center gap-3 px-10 py-5 bg-dark text-white font-black rounded-2xl hover:bg-primary-900 transition-all shadow-xl"
          >
            Get in Touch
            <ArrowRight size={20} />
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Campaigns;
