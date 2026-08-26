import React, { useState, useMemo, useCallback, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import {
  MapPin,
  Calendar,
  Users,
  TrendingUp,
  Share2,
  Heart,
  Clock,
  CheckCircle,
  X,
  Upload,
  Copy,
  ChevronLeft,
  Facebook,
  Twitter,
  MessageCircle,
  FileText,
  DollarSign,
  AlertCircle,
  CreditCard,
  Building2,
  Loader,
  Sparkles,
  Target,
  ArrowRight,
  Eye,
  Image as ImageIcon,
} from "lucide-react";
import { fetchCampaignById } from "../features/campaign/userCampaignsSlice";
import { submitDonation } from "../features/donation/donationSlice";
import toast from "react-hot-toast";
import { formatDate } from "../utils/formatDate";
import { calculateProgress } from "../utils/calculateProgress";
import { getDaysLeft } from "../utils/getDaysLeft";
import { formatCurrency } from "../utils/formatCurrency";
import DonationModal from "./DonationModal";
import Meta from "./Meta";

const CampaignDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const { user } = useSelector((state) => state.auth);
  const { selectedCampaign, loading, error } = useSelector(
    (state) => state.userCampaigns
  );
  const donations = useSelector((state) => state.donations?.donations || []);
  const isSubmitting = useSelector(
    (state) => state.donations?.submitting || false
  );

  const [activeTab, setActiveTab] = useState("story");
  const [showDonationModal, setShowDonationModal] = useState(false);
  const [copied, setCopied] = useState(false);
  const [imageGallery, setImageGallery] = useState(false);
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);

  useEffect(() => {
    dispatch(fetchCampaignById(id));
  }, [dispatch, id]);

  // ── Live refresh: poll every 30 s + re-fetch on tab focus ─────────────────
  // Keeps raisedAmount current without a full page reload.
  // When an admin approves a donation while the user is viewing this page,
  // the progress bar will update within at most 30 seconds automatically.
  useEffect(() => {
    const refetch = () => dispatch(fetchCampaignById(id));

    // Poll every 30 seconds
    const interval = setInterval(refetch, 30_000);

    // Also re-fetch the instant the user focuses this tab
    window.addEventListener('focus', refetch);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', refetch);
    };
  }, [dispatch, id]);
  // ──────────────────────────────────────────────────────────────────────────

  // Reset modal when campaign changes
  useEffect(() => {
    setShowDonationModal(false);
  }, [id]);

  // Re-fetch campaign after modal closes to get updated raisedAmount / progress
  const handleModalClose = useCallback(() => {
    setShowDonationModal(false);
    dispatch(fetchCampaignById(id));
  }, [dispatch, id]);

  const campaign = selectedCampaign;

  const donationStatus = useMemo(() => {
    if (!user) return "none";
    const userDonation = donations.find(
      (d) =>
        (d.userId === user.id || d.userId === user._id) &&
        (d.campaignId === id || d.campaign?._id === id)
    );
    if (!userDonation) return "none";
    return userDonation.status || userDonation.approvalStatus || "pending";
  }, [donations, user, id]);

  const progress = useMemo(
    () =>
      calculateProgress(
        campaign?.raisedAmount || 0,
        campaign?.targetAmount || 1
      ),
    [campaign]
  );

  const daysLeft = useMemo(
    () => getDaysLeft(campaign?.endDate || new Date()),
    [campaign]
  );

  // Get recent donors from campaign donations
  const recentDonors = useMemo(() => {
    if (!campaign?.donations) return [];
    return campaign.donations
      .filter((d) => d.status === "completed" || d.approvalStatus === "approved")
      .slice(0, 10)
      .map((donation) => ({
        name: donation.anonymous
          ? "Anonymous"
          : donation.user?.name ||
            donation.donor?.fullName ||
            donation.donor?.name ||
            "Anonymous",
        amount: donation.amount,
        date: donation.createdAt || donation.createdDate,
        anonymous: donation.anonymous,
      }));
  }, [campaign]);

  const handleDonation = useCallback(
    (donationData) => {
      dispatch(submitDonation(donationData));
      toast.success("Donation submitted successfully! Awaiting verification.");
    },
    [dispatch]
  );

  const handleShare = useCallback(
    (platform) => {
      const url = window.location.href;
      const text = `Support ${campaign?.title} - ${campaign?.shortDescription || ""}`;

      const shareUrls = {
        facebook: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
          url
        )}`,
        twitter: `https://twitter.com/intent/tweet?text=${encodeURIComponent(
          text
        )}&url=${encodeURIComponent(url)}`,
        whatsapp: `https://wa.me/?text=${encodeURIComponent(text + " " + url)}`,
      };

      if (shareUrls[platform]) {
        window.open(shareUrls[platform], "_blank", "width=600,height=400");
        toast.success(`Sharing on ${platform}...`);
      }
    },
    [campaign]
  );

  const copyLink = useCallback(() => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    toast.success("Link copied to clipboard!");
    setTimeout(() => setCopied(false), 2000);
  }, []);

  const primaryImage =
    campaign?.images?.find((img) => img.isPrimary) || campaign?.images?.[0];
  const allImages = campaign?.images || [];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center">
        <div className="text-center">
          <Loader className="animate-spin text-primary-600 mx-auto mb-4" size={48} />
          <p className="text-gray-600 dark:text-gray-400 font-medium">
            Loading campaign details...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-red-100 dark:bg-red-900/20 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-red-500" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Error Loading Campaign
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">{error}</p>
          <div className="flex gap-4 justify-center">
            <button
              onClick={() => dispatch(fetchCampaignById(id))}
              className="inline-flex items-center gap-2 bg-primary-600 text-white px-6 py-3 rounded-xl font-semibold hover:bg-primary-700 transition-all shadow-lg"
            >
              <Loader size={20} />
              Try Again
            </button>
            <Link
              to="/campaigns"
              className="inline-flex items-center gap-2 bg-gray-200 dark:bg-gray-800 text-gray-700 dark:text-gray-300 px-6 py-3 rounded-xl font-semibold hover:bg-gray-300 dark:hover:bg-gray-700 transition-all"
            >
              <ChevronLeft size={20} />
              Back to Campaigns
            </Link>
          </div>
        </div>
      </div>
    );
  }

  if (!campaign) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-950 flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="w-20 h-20 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center mx-auto mb-6">
            <AlertCircle className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-3">
            Campaign Not Found
          </h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            The campaign you're looking for doesn't exist or has been removed.
          </p>
          <Link
            to="/campaigns"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-emerald-600 to-teal-600 text-white px-6 py-3 rounded-xl font-semibold hover:from-emerald-700 hover:to-teal-700 transition-all shadow-lg"
          >
            <ChevronLeft size={20} />
            Browse Campaigns
          </Link>
        </div>
      </div>
    );
  }

  const isCampaignActive = campaign.status === "active" && campaign.approved;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950">
      <Meta
        title={campaign.title}
        description={campaign.shortDescription || campaign.description?.substring(0, 160)}
        ogImage={primaryImage?.url || "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop"}
        ogType="article"
      />
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Breadcrumb */}
        <nav className="text-sm text-gray-500 dark:text-gray-400 mb-6 flex items-center gap-2 flex-wrap">
          <Link
            to="/"
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Home
          </Link>
          <ChevronLeft size={16} className="rotate-180" />
          <Link
            to="/campaigns"
            className="hover:text-primary-600 dark:hover:text-primary-400 transition-colors"
          >
            Campaigns
          </Link>
          <ChevronLeft size={16} className="rotate-180" />
          <span className="text-gray-900 dark:text-white font-medium line-clamp-1">
            {campaign.title}
          </span>
        </nav>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Campaign Image */}
            <div className="relative rounded-2xl overflow-hidden group">
              <img
                src={
                  primaryImage?.url ||
                  "https://images.unsplash.com/photo-1488521787991-ed7bbaae773c?w=800&h=600&fit=crop"
                }
                alt={campaign.title}
                className="w-full h-64 sm:h-80 lg:h-[500px] object-cover transition-transform duration-700 group-hover:scale-105"
              />
              {allImages.length > 1 && (
                <button
                  onClick={() => {
                    setImageGallery(true);
                    setSelectedImageIndex(0);
                  }}
                  className="absolute bottom-4 right-4 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white px-4 py-2 rounded-xl font-semibold flex items-center gap-2 hover:bg-white dark:hover:bg-gray-900 transition-all shadow-lg"
                >
                  <ImageIcon size={18} />
                  View Gallery ({allImages.length})
                </button>
              )}
              {campaign.featured && (
                <div className="absolute top-4 left-4 bg-gradient-to-r from-yellow-400 to-yellow-500 text-yellow-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <Sparkles size={16} />
                  Featured Campaign
                </div>
              )}
              {campaign.urgent && (
                <div className="absolute top-4 left-4 bg-red-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2 animate-pulse">
                  <AlertCircle size={16} />
                  Urgent
                </div>
              )}
              {isCampaignActive && (
                <div className="absolute top-4 right-4 bg-emerald-500 text-white px-4 py-2 rounded-full text-sm font-bold shadow-lg flex items-center gap-2">
                  <CheckCircle size={16} />
                  Active
                </div>
              )}
            </div>

            {/* Campaign Header */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl p-6 border border-gray-200 dark:border-gray-800 shadow-sm">
              <div className="flex flex-wrap items-center gap-3 mb-4">
                <span className="bg-primary-100 dark:bg-primary-900/30 text-primary-800 dark:text-primary-300 px-4 py-1.5 rounded-full text-sm font-semibold capitalize">
                  {campaign.category?.replace("_", " ") || campaign.category}
                </span>
                {campaign.location && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
                    <MapPin size={16} />
                    {campaign.location.city || campaign.location.state
                      ? `${campaign.location.city || ""}${
                          campaign.location.state ? `, ${campaign.location.state}` : ""
                        }`
                      : campaign.location.address || "Nigeria"}
                  </div>
                )}
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
                  <Calendar size={16} />
                  Started {formatDate(campaign.startDate || campaign.createdAt)}
                </div>
                {campaign.endDate && (
                  <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 gap-1">
                    <Clock size={16} />
                    {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                  </div>
                )}
              </div>

              <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4 leading-tight">
                {campaign.title}
              </h1>

              <p className="text-lg text-gray-600 dark:text-gray-300 leading-relaxed">
                {campaign.shortDescription || campaign.description?.substring(0, 200)}
              </p>
            </div>

            {/* Tabs */}
            <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 overflow-hidden shadow-sm">
              <div className="border-b border-gray-200 dark:border-gray-800">
                <nav className="flex overflow-x-auto">
                  {[
                    { id: "story", label: "Story", icon: FileText },
                    {
                      id: "updates",
                      label: "Updates",
                      icon: TrendingUp,
                      count: campaign.updates?.length || 0,
                    },
                    {
                      id: "donors",
                      label: "Donors",
                      icon: Users,
                      count: recentDonors.length || campaign.donorCount || 0,
                    },
                  ].map((tab) => (
                    <button
                      key={tab.id}
                      onClick={() => setActiveTab(tab.id)}
                      className={`flex-1 min-w-[120px] py-4 px-4 border-b-2 font-semibold text-sm transition-all whitespace-nowrap ${
                        activeTab === tab.id
                          ? "border-primary-500 text-primary-600 dark:text-primary-400 bg-primary-50 dark:bg-primary-900/20"
                          : "border-transparent text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                      }`}
                    >
                      <div className="flex items-center justify-center gap-2">
                        <tab.icon size={18} />
                        {tab.label}
                        {tab.count !== undefined && (
                          <span className="bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 py-0.5 px-2 rounded-full text-xs font-bold">
                            {tab.count}
                          </span>
                        )}
                      </div>
                    </button>
                  ))}
                </nav>
              </div>

              {/* Tab Content */}
              <div className="p-6">
                {activeTab === "story" && (
                  <div className="space-y-6">
                    <div className="prose prose-lg max-w-none dark:prose-invert">
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed whitespace-pre-line">
                        {campaign.description}
                      </p>
                    </div>

                    {/* Campaign Stats */}
                    {campaign.beneficiaries && (
                      <div className="grid grid-cols-2 gap-4 mt-8">
                        {campaign.beneficiaries.target && (
                          <div className="bg-gradient-to-br from-primary-50 to-primary-100 dark:from-primary-900/20 dark:to-primary-800/20 rounded-xl p-6 border border-primary-200 dark:border-primary-800">
                            <div className="flex items-center gap-3 mb-2">
                              <Target className="text-primary-600 dark:text-primary-400" size={24} />
                              <div>
                                <p className="text-sm text-primary-700 dark:text-primary-300 font-medium">
                                  Target Beneficiaries
                                </p>
                                <p className="text-2xl font-bold text-primary-900 dark:text-primary-100">
                                  {campaign.beneficiaries.target.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                        {campaign.beneficiaries.reached !== undefined && (
                          <div className="bg-gradient-to-br from-emerald-50 to-emerald-100 dark:from-emerald-900/20 dark:to-emerald-800/20 rounded-xl p-6 border border-emerald-200 dark:border-emerald-800">
                            <div className="flex items-center gap-3 mb-2">
                              <CheckCircle className="text-emerald-600 dark:text-emerald-400" size={24} />
                              <div>
                                <p className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">
                                  Reached
                                </p>
                                <p className="text-2xl font-bold text-emerald-900 dark:text-emerald-100">
                                  {campaign.beneficiaries.reached.toLocaleString()}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {campaign.createdBy && (
                      <div className="mt-8 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800 dark:to-gray-900 rounded-xl p-6 border border-gray-200 dark:border-gray-700">
                        <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                          <Users size={20} />
                          Campaign Organizer
                        </h3>
                        <div className="flex items-center gap-4">
                          <div className="flex-shrink-0">
                            <div className="w-16 h-16 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white text-2xl font-bold shadow-lg">
                              {campaign.createdBy?.name?.charAt(0) ||
                                campaign.createdBy?.fullName?.charAt(0) ||
                                "U"}
                            </div>
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-1">
                              <p className="font-bold text-gray-900 dark:text-white text-lg">
                                {campaign.createdBy?.name ||
                                  campaign.createdBy?.fullName ||
                                  "Anonymous"}
                              </p>
                              {campaign.createdBy?.verified && (
                                <CheckCircle className="w-5 h-5 text-primary-500" />
                              )}
                            </div>
                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                              {campaign.createdBy?.email && <p>{campaign.createdBy.email}</p>}
                              {campaign.createdBy?.phone && (
                                <p>{campaign.createdBy.phone}</p>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "updates" && (
                  <div className="space-y-4">
                    {campaign.updates?.length > 0 ? (
                      campaign.updates
                        .sort((a, b) => new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date))
                        .map((update, index) => (
                          <div
                            key={update.id || update._id || index}
                            className="bg-gray-50 dark:bg-gray-800 rounded-xl border border-gray-200 dark:border-gray-700 p-6 hover:shadow-md transition-shadow"
                          >
                            <div className="flex items-center justify-between mb-3">
                              <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                                {update.title}
                              </h3>
                              <span className="text-sm text-gray-500 dark:text-gray-400 flex items-center gap-1">
                                <Calendar size={14} />
                                {formatDate(update.createdAt || update.date)}
                              </span>
                            </div>
                            <p className="text-gray-700 dark:text-gray-300 mb-4 leading-relaxed whitespace-pre-line">
                              {update.content}
                            </p>
                            {update.images && update.images.length > 0 && (
                              <div className="grid grid-cols-2 gap-3 mt-4">
                                {update.images.slice(0, 4).map((img, imgIndex) => (
                                  <img
                                    key={imgIndex}
                                    src={typeof img === "string" ? img : img.url}
                                    alt={`${update.title} - Image ${imgIndex + 1}`}
                                    className="w-full h-48 object-cover rounded-lg cursor-pointer hover:opacity-90 transition-opacity"
                                    onClick={() => {
                                      setImageGallery(true);
                                      setSelectedImageIndex(
                                        allImages.findIndex(
                                          (i) => i.url === (typeof img === "string" ? img : img.url)
                                        )
                                      );
                                    }}
                                  />
                                ))}
                              </div>
                            )}
                          </div>
                        ))
                    ) : (
                      <div className="text-center py-12">
                        <TrendingUp className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                          No updates yet
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Check back later for campaign updates
                        </p>
                      </div>
                    )}
                  </div>
                )}

                {activeTab === "donors" && (
                  <div className="space-y-4">
                    {recentDonors.length > 0 ? (
                      <>
                        <div className="flex items-center justify-between mb-4">
                          <h3 className="text-lg font-bold text-gray-900 dark:text-white">
                            Recent Donors
                          </h3>
                          <span className="text-sm text-gray-500 dark:text-gray-400">
                            {campaign.donorCount || recentDonors.length} total donors
                          </span>
                        </div>
                        <div className="space-y-3">
                          {recentDonors.map((donor, index) => (
                            <div
                              key={index}
                              className="flex items-center justify-between bg-gray-50 dark:bg-gray-800 rounded-xl p-4 border border-gray-200 dark:border-gray-700 hover:shadow-md transition-shadow"
                            >
                              <div className="flex items-center gap-4">
                                <div className="w-12 h-12 bg-gradient-to-br from-primary-500 to-primary-600 rounded-full flex items-center justify-center text-white font-bold shadow-lg">
                                  {donor.anonymous
                                    ? "?"
                                    : donor.name.charAt(0).toUpperCase()}
                                </div>
                                <div>
                                  <p className="font-semibold text-gray-900 dark:text-white">
                                    {donor.name}
                                  </p>
                                  <p className="text-sm text-gray-500 dark:text-gray-400">
                                    {formatDate(donor.date)}
                                  </p>
                                </div>
                              </div>
                              <div className="text-right">
                                <p className="font-bold text-primary-600 dark:text-primary-400 text-lg">
                                  {formatCurrency(donor.amount)}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                        {campaign.donorCount > recentDonors.length && (
                          <p className="text-center text-sm text-gray-500 dark:text-gray-400 pt-4">
                            And {campaign.donorCount - recentDonors.length} more generous donors...
                          </p>
                        )}
                      </>
                    ) : (
                      <div className="text-center py-12">
                        <Heart className="mx-auto h-16 w-16 text-gray-300 dark:text-gray-700 mb-4" />
                        <p className="text-gray-500 dark:text-gray-400 font-medium">
                          Be the first to donate!
                        </p>
                        <p className="text-sm text-gray-400 dark:text-gray-500 mt-1">
                          Your contribution will make a difference
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-8 space-y-6">
              {/* Progress Card */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6 shadow-lg">
                <div className="text-center mb-6">
                  <div className="text-4xl font-bold text-gray-900 dark:text-white mb-2">
                    {formatCurrency(campaign.raisedAmount || 0)}
                  </div>
                  <div className="text-sm text-gray-500 dark:text-gray-400">
                    raised of{" "}
                    <span className="font-semibold text-gray-700 dark:text-gray-300">
                      {formatCurrency(campaign.targetAmount || 0)}
                    </span>{" "}
                    goal
                  </div>
                </div>

                <div className="mb-6">
                  <div className="relative h-3 w-full bg-gray-200 dark:bg-gray-800 rounded-full overflow-hidden mb-3">
                    <div
                      className="absolute top-0 left-0 h-full bg-gradient-to-r from-primary-500 to-primary-600 rounded-full transition-all duration-1000 shadow-lg"
                      style={{ width: `${Math.min(progress, 100)}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="font-bold text-primary-600 dark:text-primary-400">
                      {Math.round(progress)}% funded
                    </span>
                    <span className="font-semibold text-gray-600 dark:text-gray-400 flex items-center gap-1">
                      <Clock size={14} />
                      {daysLeft > 0 ? `${daysLeft} days left` : "Ended"}
                    </span>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-8 py-4 mb-6 bg-gray-50 dark:bg-gray-800 rounded-xl">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-primary-600 dark:text-primary-400">
                      {campaign.donorCount || 0}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Donors
                    </div>
                  </div>
                  <div className="h-10 w-px bg-gray-300 dark:bg-gray-700"></div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                      {daysLeft}
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400 font-medium">
                      Days Left
                    </div>
                  </div>
                </div>

                {/* Donation Button */}
                <button
                  onClick={() => setShowDonationModal(true)}
                  disabled={
                    donationStatus === "pending" ||
                    donationStatus === "approved" ||
                    donationStatus === "verified" ||
                    !isCampaignActive
                  }
                  className={`w-full py-4 rounded-xl font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-2 ${
                    donationStatus === "verified" || donationStatus === "approved"
                      ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200 cursor-not-allowed"
                      : donationStatus === "pending"
                      ? "bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-200 cursor-not-allowed"
                      : !isCampaignActive
                      ? "bg-gray-100 text-gray-500 dark:bg-gray-800 dark:text-gray-400 cursor-not-allowed"
                      : "bg-gradient-to-r from-primary-600 to-primary-700 hover:from-primary-700 hover:to-primary-800 text-white transform hover:scale-[1.02] shadow-xl hover:shadow-2xl"
                  }`}
                >
                  {donationStatus === "verified" || donationStatus === "approved" ? (
                    <>
                      <CheckCircle size={20} />
                      Thank You for Donating!
                    </>
                  ) : donationStatus === "pending" ? (
                    <>
                      <Clock size={20} />
                      Verification Pending
                    </>
                  ) : !isCampaignActive ? (
                    <>
                      <AlertCircle size={20} />
                      Campaign Inactive
                    </>
                  ) : (
                    <>
                      <Heart size={20} />
                      Donate Now
                    </>
                  )}
                </button>

                {donationStatus === "pending" && (
                  <p className="text-xs text-amber-600 dark:text-amber-400 mt-3 text-center leading-relaxed">
                    Your donation is being verified. You'll receive a confirmation
                    email soon.
                  </p>
                )}

                {isCampaignActive && donationStatus === "none" && (
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-3 text-center">
                    Choose between card payment or bank transfer
                  </p>
                )}
              </div>

              {/* Quick Stats */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <TrendingUp size={18} />
                  Campaign Stats
                </h3>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Remaining Amount
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {formatCurrency(
                        Math.max(
                          (campaign.targetAmount || 0) - (campaign.raisedAmount || 0),
                          0
                        )
                      )}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Average Donation
                    </span>
                    <span className="font-bold text-gray-900 dark:text-white">
                      {campaign.donorCount > 0
                        ? formatCurrency(
                            Math.round(
                              (campaign.raisedAmount || 0) / campaign.donorCount
                            )
                          )
                        : formatCurrency(0)}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Campaign Status
                    </span>
                    <span
                      className={`font-bold px-3 py-1 rounded-full text-xs ${
                        isCampaignActive
                          ? "bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-200"
                          : "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-400"
                      }`}
                    >
                      {campaign.status === "active" && campaign.approved
                        ? "Active"
                        : campaign.status === "pending"
                        ? "Pending Approval"
                        : campaign.status || "Inactive"}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tags */}
              {campaign.tags && campaign.tags.length > 0 && (
                <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                  <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                    <FileText size={18} />
                    Campaign Tags
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {campaign.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 px-3 py-1.5 rounded-full text-sm font-medium"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Share */}
              <div className="bg-white dark:bg-gray-900 rounded-2xl border border-gray-200 dark:border-gray-800 p-6">
                <h3 className="font-bold text-gray-900 dark:text-white mb-4 flex items-center gap-2">
                  <Share2 size={18} />
                  Share This Campaign
                </h3>
                <div className="space-y-3">
                  <button
                    onClick={() => handleShare("twitter")}
                    className="w-full flex items-center justify-center gap-3 bg-black hover:bg-gray-800 text-white py-3 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] font-semibold"
                  >
                    <Twitter size={20} />
                    Share on X
                  </button>
                  <button
                    onClick={() => handleShare("facebook")}
                    className="w-full flex items-center justify-center gap-3 bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] font-semibold"
                  >
                    <Facebook size={20} />
                    Share on Facebook
                  </button>
                  <button
                    onClick={() => handleShare("whatsapp")}
                    className="w-full flex items-center justify-center gap-3 bg-green-500 hover:bg-green-600 text-white py-3 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] font-semibold"
                  >
                    <MessageCircle size={20} />
                    Share on WhatsApp
                  </button>
                  <button
                    onClick={copyLink}
                    className="w-full flex items-center justify-center gap-3 bg-gray-200 dark:bg-gray-800 hover:bg-gray-300 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300 py-3 rounded-xl transition-all shadow-md hover:shadow-lg transform hover:scale-[1.02] font-semibold"
                  >
                    <Copy size={20} />
                    {copied ? "Link Copied!" : "Copy Link"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Image Gallery Modal */}
      {imageGallery && allImages.length > 0 && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90 backdrop-blur-sm">
          <div className="relative max-w-5xl w-full">
            <button
              onClick={() => setImageGallery(false)}
              className="absolute top-4 right-4 z-10 bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white p-2 rounded-full hover:bg-white dark:hover:bg-gray-900 transition-all shadow-lg"
            >
              <X size={24} />
            </button>
            <img
              src={allImages[selectedImageIndex]?.url}
              alt={`${campaign.title} - Image ${selectedImageIndex + 1}`}
              className="w-full h-auto max-h-[90vh] object-contain rounded-lg"
            />
            {allImages.length > 1 && (
              <div className="flex items-center justify-center gap-4 mt-4">
                <button
                  onClick={() =>
                    setSelectedImageIndex(
                      (prev) => (prev - 1 + allImages.length) % allImages.length
                    )
                  }
                  className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-gray-900 transition-all shadow-lg"
                >
                  <ChevronLeft size={20} />
                </button>
                <span className="text-white font-semibold">
                  {selectedImageIndex + 1} / {allImages.length}
                </span>
                <button
                  onClick={() =>
                    setSelectedImageIndex((prev) => (prev + 1) % allImages.length)
                  }
                  className="bg-white/90 dark:bg-gray-900/90 backdrop-blur-sm text-gray-900 dark:text-white p-3 rounded-full hover:bg-white dark:hover:bg-gray-900 transition-all shadow-lg"
                >
                  <ChevronLeft size={20} className="rotate-180" />
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Donation Modal */}
      <DonationModal
        isOpen={showDonationModal}
        onClose={handleModalClose}
        campaign={campaign}
        user={user}
      />
    </div>
  );
};

export default CampaignDetail;
