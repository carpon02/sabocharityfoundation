// components/ProgramsSection.jsx
import React, { useEffect } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { SectionHeader } from "./SectionHeader";
import { ArrowRight, Loader } from "lucide-react";
import { CampaignCard } from "./CampaignCard";
import { fetchAllCampaigns } from "../features/campaign/campaignsSlice";

const ProgramsSection = () => {
  const dispatch = useDispatch();
  const { campaigns, loading, error } = useSelector((state) => state.campaigns);

  useEffect(() => {
    // Fetch campaigns if not already loaded
    if (campaigns.length === 0) {
      dispatch(fetchAllCampaigns({ limit: 3 }));
    }
  }, [dispatch, campaigns.length]);

  const displayCampaigns = campaigns?.slice(0, 3) || [];

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <SectionHeader
        title="Our Programs"
        highlight="& Campaigns"
        subtitle="We run impactful programs across education, health, youth empowerment, and community support."
      />

      {/* Campaigns Grid (limit to 3) */}
      {loading && campaigns.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20">
          <Loader className="w-8 h-8 text-primary-500 animate-spin mb-4" />
          <p className="text-gray-500 text-sm">Loading campaigns...</p>
        </div>
      ) : error ? (
        <div className="text-center py-20">
          <p className="text-red-500 text-sm mb-4">
            Failed to load campaigns. Please try again later.
          </p>
        </div>
      ) : displayCampaigns.length === 0 ? (
        <div className="text-center py-20">
          <p className="text-gray-500 text-sm">No campaigns available at the moment.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {displayCampaigns.map((program) => (
            <CampaignCard key={program._id || program.id} campaign={program} />
          ))}
        </div>
      )}

      {/* View More Button */}
      <div className="mt-12 flex justify-center">
        <Link
          to="/campaigns"
          className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold rounded-full shadow-lg hover:from-green-600 hover:to-green-700 transition-all"
        >
          View More Campaigns
          <ArrowRight className="w-5 h-5" />
        </Link>
      </div>
    </section>
  );
};

export default ProgramsSection;
