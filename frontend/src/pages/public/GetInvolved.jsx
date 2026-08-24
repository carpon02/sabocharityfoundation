import React, { useState } from "react";
import {
  Users,
  HandHeart,
  Globe,
  ArrowRight,
  CheckCircle2,
  Sparkles,
  ShieldCheck,
  Zap,
  Star,
  X,
  Upload,
  Loader,
  CheckCircle,
  AlertCircle,
  Mail,
  Phone,
  MapPin,
  Building2,
  User,
  FileText,
  Calendar,
  Briefcase,
} from "lucide-react";
import { useDispatch, useSelector } from "react-redux";
import { submitVolunteerApplication } from "../../features/volunteer/volunteerSlice";
import { submitContactForm } from "../../features/contact/contactSlice";
import toast from "react-hot-toast";
import Meta from "../../components/Meta";

const opportunities = [
  {
    id: "volunteer",
    icon: HandHeart,
    title: "Community Volunteer",
    desc: "Join our frontline teams in Sabo to help distribute aid, tutor children, or assist in healthcare programs.",
    benefits: ["Direct community impact", "Skill development", "Certification"],
    cta: "Apply to Volunteer",
    accent: "bg-primary-50 text-primary-600",
  },
  {
    id: "ambassador",
    icon: Zap,
    title: "Impact Ambassador",
    desc: "Use your platform and voice to raise awareness and funds for the Sabo Youth Foundation globally.",
    benefits: [
      "Network growth",
      "Exclusive event access",
      "Global recognition",
    ],
    cta: "Become an Ambassador",
    accent: "bg-secondary-50 text-secondary-600",
  },
  {
    id: "corporate",
    icon: Globe,
    title: "Corporate Partner",
    desc: "Align your CSR strategy with our mission to create sustainable change in Nigerian youth communities.",
    benefits: ["CSR reporting", "Tax benefits", "Brand alignment"],
    cta: "Partner with Us",
    accent: "bg-dark text-white",
  },
];

// Volunteer Application Modal
const VolunteerModal = ({ isOpen, onClose, type = "volunteer" }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.volunteer);
  const { user } = useSelector((state) => state.auth);

  const [formData, setFormData] = useState({
    personalInfo: {
      firstName:
        user?.fullName?.split(" ")[0] || user?.name?.split(" ")[0] || "",
      lastName:
        user?.fullName?.split(" ").slice(1).join(" ") ||
        user?.name?.split(" ").slice(1).join(" ") ||
        "",
      email: user?.email || "",
      phone: user?.phone || "",
      dateOfBirth: "",
      gender: "",
      address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "Nigeria",
      },
    },
    professionalInfo: {
      occupation: "",
      employer: "",
      education: {
        level: "",
        fieldOfStudy: "",
        institution: "",
      },
      skills: [],
    },
    volunteerPreferences: {
      availability: "",
      timeCommitment: "",
      preferredAreas: [],
      willingToTravel: false,
      hasTransportation: false,
    },
    motivation: "",
    resume: null,
    applicationType: type, // "volunteer" or "ambassador"
  });

  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 3;

  const handleInputChange = (e) => {
    const { name, value, type, checked, files } = e.target;

    // Determine the actual value based on input type
    const inputValue = type === "checkbox" ? checked : value;

    if (name.includes(".")) {
      const [parent, child, grandchild] = name.split(".");
      if (grandchild) {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: {
              ...prev[parent][child],
              [grandchild]: inputValue,
            },
          },
        }));
      } else {
        setFormData((prev) => ({
          ...prev,
          [parent]: {
            ...prev[parent],
            [child]: inputValue,
          },
        }));
      }
    } else if (type === "file") {
      setFormData((prev) => ({
        ...prev,
        [name]: files[0] || null,
      }));
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: inputValue,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validation
    if (
      !formData.personalInfo.firstName ||
      !formData.personalInfo.lastName ||
      !formData.personalInfo.email ||
      !formData.personalInfo.phone
    ) {
      toast.error("Please fill in all required personal information fields");
      return;
    }

    if (
      !formData.volunteerPreferences.availability ||
      !formData.volunteerPreferences.timeCommitment
    ) {
      toast.error("Please select your availability and time commitment");
      return;
    }

    try {
      const applicationData = {
        ...formData,
        personalInfo: {
          ...formData.personalInfo,
          firstName: formData.personalInfo.firstName,
          lastName: formData.personalInfo.lastName,
        },
      };

      await dispatch(submitVolunteerApplication(applicationData)).unwrap();
      toast.success(
        type === "ambassador"
          ? "Ambassador application submitted successfully! We'll review and get back to you soon."
          : "Volunteer application submitted successfully! We'll review and get back to you soon.",
      );
      onClose();
      // Reset form
      setFormData({
        personalInfo: {
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          dateOfBirth: "",
          gender: "",
          address: {
            street: "",
            city: "",
            state: "",
            postalCode: "",
            country: "Nigeria",
          },
        },
        professionalInfo: {
          occupation: "",
          employer: "",
          education: {
            level: "",
            fieldOfStudy: "",
            institution: "",
          },
          skills: [],
        },
        volunteerPreferences: {
          availability: "",
          timeCommitment: "",
          preferredAreas: [],
          willingToTravel: false,
          hasTransportation: false,
        },
        motivation: "",
        resume: null,
        applicationType: type,
      });
      setCurrentStep(1);
    } catch (error) {
      toast.error(error || "Failed to submit application. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between z-10">
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {type === "ambassador"
                ? "Impact Ambassador Application"
                : "Volunteer Application"}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Step {currentStep} of {totalSteps}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Step 1: Personal Information */}
          {currentStep === 1 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <User size={20} />
                Personal Information
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    First Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="personalInfo.firstName"
                    value={formData.personalInfo.firstName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Last Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    name="personalInfo.lastName"
                    value={formData.personalInfo.lastName}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Email <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="email"
                    name="personalInfo.email"
                    value={formData.personalInfo.email}
                    onChange={handleInputChange}
                    required
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Phone <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="tel"
                    name="personalInfo.phone"
                    value={formData.personalInfo.phone}
                    onChange={handleInputChange}
                    required
                    placeholder="+234 xxx xxx xxxx"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Date of Birth
                  </label>
                  <input
                    type="date"
                    name="personalInfo.dateOfBirth"
                    value={formData.personalInfo.dateOfBirth}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Gender
                  </label>
                  <select
                    name="personalInfo.gender"
                    value={formData.personalInfo.gender}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                  >
                    <option value="">Select Gender</option>
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                    <option value="prefer_not_to_say">Prefer not to say</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Address
                </label>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <input
                    type="text"
                    name="personalInfo.address.street"
                    value={formData.personalInfo.address.street}
                    onChange={handleInputChange}
                    placeholder="Street Address"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                  />
                  <input
                    type="text"
                    name="personalInfo.address.city"
                    value={formData.personalInfo.address.city}
                    onChange={handleInputChange}
                    placeholder="City"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                  />
                  <input
                    type="text"
                    name="personalInfo.address.state"
                    value={formData.personalInfo.address.state}
                    onChange={handleInputChange}
                    placeholder="State"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                  />
                  <input
                    type="text"
                    name="personalInfo.address.postalCode"
                    value={formData.personalInfo.address.postalCode}
                    onChange={handleInputChange}
                    placeholder="Postal Code"
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Professional & Preferences */}
          {currentStep === 2 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <Briefcase size={20} />
                Professional Information & Preferences
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Occupation
                  </label>
                  <input
                    type="text"
                    name="professionalInfo.occupation"
                    value={formData.professionalInfo.occupation}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                  />
                </div>
                <div>
                  <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                    Employer
                  </label>
                  <input
                    type="text"
                    name="professionalInfo.employer"
                    value={formData.professionalInfo.employer}
                    onChange={handleInputChange}
                    className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Availability <span className="text-red-500">*</span>
                </label>
                <select
                  name="volunteerPreferences.availability"
                  value={formData.volunteerPreferences.availability}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                >
                  <option value="">Select Availability</option>
                  <option value="weekdays">Weekdays</option>
                  <option value="weekends">Weekends</option>
                  <option value="flexible">Flexible</option>
                  <option value="specific_days">Specific Days</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Time Commitment <span className="text-red-500">*</span>
                </label>
                <select
                  name="volunteerPreferences.timeCommitment"
                  value={formData.volunteerPreferences.timeCommitment}
                  onChange={handleInputChange}
                  required
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
                >
                  <option value="">Select Time Commitment</option>
                  <option value="1-5_hours">1-5 hours per week</option>
                  <option value="5-10_hours">5-10 hours per week</option>
                  <option value="10-20_hours">10-20 hours per week</option>
                  <option value="20+_hours">20+ hours per week</option>
                </select>
              </div>

              <div className="flex items-center gap-4">
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="volunteerPreferences.willingToTravel"
                    checked={formData.volunteerPreferences.willingToTravel}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">
                    Willing to Travel
                  </span>
                </label>
                <label className="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    name="volunteerPreferences.hasTransportation"
                    checked={formData.volunteerPreferences.hasTransportation}
                    onChange={handleInputChange}
                    className="w-4 h-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <span className="text-sm text-gray-900 dark:text-white">
                    Has Transportation
                  </span>
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Motivation & Resume */}
          {currentStep === 3 && (
            <div className="space-y-6">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white flex items-center gap-2">
                <FileText size={20} />
                Motivation & Documents
              </h3>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Why do you want to{" "}
                  {type === "ambassador" ? "become an ambassador" : "volunteer"}
                  ? <span className="text-red-500">*</span>
                </label>
                <textarea
                  name="motivation"
                  value={formData.motivation}
                  onChange={handleInputChange}
                  required
                  rows={6}
                  placeholder="Tell us about your motivation and what drives you to make a difference..."
                  className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all resize-none"
                />
              </div>

              <div>
                <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                  Resume/CV (Optional)
                </label>
                <div className="border-2 border-dashed border-gray-300 dark:border-gray-700 rounded-xl p-8 text-center hover:border-primary-500 dark:hover:border-primary-500 transition-all">
                  {formData.resume ? (
                    <div className="space-y-4">
                      <FileText className="mx-auto h-12 w-12 text-primary-500" />
                      <p className="text-sm font-medium text-gray-600 dark:text-gray-400">
                        {formData.resume.name}
                      </p>
                      <button
                        type="button"
                        onClick={() =>
                          setFormData((prev) => ({ ...prev, resume: null }))
                        }
                        className="text-red-600 hover:text-red-700 dark:text-red-400 text-sm font-semibold flex items-center gap-2 mx-auto"
                      >
                        <X size={16} />
                        Remove File
                      </button>
                    </div>
                  ) : (
                    <div>
                      <Upload className="mx-auto h-12 w-12 text-gray-400 mb-3" />
                      <label htmlFor="resume-upload" className="cursor-pointer">
                        <span className="block text-base font-semibold text-gray-900 dark:text-white mb-1">
                          Click to upload resume
                        </span>
                        <span className="block text-sm text-gray-500 dark:text-gray-400">
                          PDF, DOC, or DOCX up to 5MB
                        </span>
                      </label>
                      <input
                        id="resume-upload"
                        name="resume"
                        type="file"
                        accept=".pdf,.doc,.docx"
                        onChange={handleInputChange}
                        className="hidden"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex gap-3 pt-6 border-t border-gray-200 dark:border-gray-800">
            {currentStep > 1 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
              >
                Previous
              </button>
            )}
            {currentStep < totalSteps ? (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep + 1)}
                className="flex-1 bg-primary-600 hover:bg-primary-700 text-white py-3 rounded-xl font-semibold transition-all shadow-lg"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                disabled={loading}
                className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader className="animate-spin" size={20} />
                    Submitting...
                  </>
                ) : (
                  <>
                    <CheckCircle size={20} />
                    Submit Application
                  </>
                )}
              </button>
            )}
          </div>
        </form>
      </div>
    </div>
  );
};

// Corporate Partnership Modal
const CorporateModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    corporateTitle: "",
    companyName: "",
    message: "",
    agreedToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.message ||
      !formData.agreedToTerms
    ) {
      toast.error("Please fill in all required fields and agree to terms");
      return;
    }

    try {
      const contactData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: `Corporate Partnership Inquiry\n\nCorporate Title: ${formData.corporateTitle || "N/A"}\nCompany Name: ${formData.companyName || "N/A"}\n\nMessage:\n${formData.message}`,
        agreedToTerms: formData.agreedToTerms,
      };

      await dispatch(submitContactForm(contactData)).unwrap();
      toast.success(
        "Partnership inquiry submitted successfully! We'll contact you soon.",
      );
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        corporateTitle: "",
        companyName: "",
        message: "",
        agreedToTerms: false,
      });
    } catch (error) {
      toast.error(error || "Failed to submit inquiry. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Corporate Partnership Inquiry
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                First Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+234 xxx xxx xxxx"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Corporate Title
              </label>
              <input
                type="text"
                name="corporateTitle"
                value={formData.corporateTitle}
                onChange={handleInputChange}
                placeholder="e.g., CSR Manager"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Company Name
              </label>
              <input
                type="text"
                name="companyName"
                value={formData.companyName}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Message <span className="text-red-500">*</span>
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              required
              rows={6}
              placeholder="Tell us about your partnership interests and how we can collaborate..."
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all resize-none"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms"
              name="agreedToTerms"
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={handleInputChange}
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="terms"
              className="ml-2 block text-sm text-gray-900 dark:text-white"
            >
              I agree to the terms and conditions{" "}
              <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-primary-600 hover:bg-primary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                <>
                  <CheckCircle size={20} />
                  Submit Inquiry
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

// Request Prospectus Modal
const ProspectusModal = ({ isOpen, onClose }) => {
  const dispatch = useDispatch();
  const { loading } = useSelector((state) => state.contact);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    corporateTitle: "",
    tierOfInterest: "",
    message: "",
    agreedToTerms: false,
  });

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.firstName ||
      !formData.lastName ||
      !formData.email ||
      !formData.phone ||
      !formData.agreedToTerms
    ) {
      toast.error("Please fill in all required fields and agree to terms");
      return;
    }

    try {
      const contactData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phone: formData.phone,
        message: `Sponsorship Prospectus Request\n\nCorporate Title: ${formData.corporateTitle || "N/A"}\nTier of Interest: ${formData.tierOfInterest || "Not specified"}\n\nMessage:\n${formData.message || "Requesting sponsorship prospectus"}`,
        agreedToTerms: formData.agreedToTerms,
      };

      await dispatch(submitContactForm(contactData)).unwrap();
      toast.success(
        "Prospectus request submitted successfully! We'll send you the information soon.",
      );
      onClose();
      setFormData({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        corporateTitle: "",
        tierOfInterest: "",
        message: "",
        agreedToTerms: false,
      });
    } catch (error) {
      toast.error(error || "Failed to submit request. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/70 backdrop-blur-sm">
      <div className="bg-white dark:bg-gray-900 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        <div className="sticky top-0 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-800 p-6 flex items-center justify-between z-10">
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
            Request Sponsorship Prospectus
          </h2>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-all"
          >
            <X size={24} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Full Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="firstName"
                value={formData.firstName}
                onChange={handleInputChange}
                required
                placeholder="First Name"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Last Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                name="lastName"
                value={formData.lastName}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Email <span className="text-red-500">*</span>
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleInputChange}
                required
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Phone <span className="text-red-500">*</span>
              </label>
              <input
                type="tel"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                required
                placeholder="+234 xxx xxx xxxx"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Corporate Title (Optional)
              </label>
              <input
                type="text"
                name="corporateTitle"
                value={formData.corporateTitle}
                onChange={handleInputChange}
                placeholder="e.g., CSR Manager"
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
                Tier of Interest
              </label>
              <select
                name="tierOfInterest"
                value={formData.tierOfInterest}
                onChange={handleInputChange}
                className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all"
              >
                <option value="">Select Tier of Interest</option>
                <option value="Platinum Foundation ($10k+)">
                  Platinum Foundation ($10k+)
                </option>
                <option value="Gold Empowerment ($5k+)">
                  Gold Empowerment ($5k+)
                </option>
                <option value="Community Builder ($1k+)">
                  Community Builder ($1k+)
                </option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-semibold text-gray-900 dark:text-white mb-2">
              Additional Message (Optional)
            </label>
            <textarea
              name="message"
              value={formData.message}
              onChange={handleInputChange}
              rows={4}
              placeholder="Any specific questions or information you'd like to include..."
              className="w-full px-4 py-3 border-2 border-gray-300 dark:border-gray-700 rounded-xl focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:bg-gray-800 dark:text-white transition-all resize-none"
            />
          </div>

          <div className="flex items-center">
            <input
              id="terms-prospectus"
              name="agreedToTerms"
              type="checkbox"
              checked={formData.agreedToTerms}
              onChange={handleInputChange}
              required
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
            />
            <label
              htmlFor="terms-prospectus"
              className="ml-2 block text-sm text-gray-900 dark:text-white"
            >
              I agree to the terms and conditions{" "}
              <span className="text-red-500">*</span>
            </label>
          </div>

          <div className="flex gap-3">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 py-3 rounded-xl font-semibold hover:bg-gray-200 dark:hover:bg-gray-700 transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-secondary-600 hover:bg-secondary-700 disabled:opacity-50 disabled:cursor-not-allowed text-white py-3 rounded-xl font-semibold transition-all shadow-lg flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader className="animate-spin" size={20} />
                  Submitting...
                </>
              ) : (
                <>
                  <ArrowRight size={20} />
                  Request Prospectus
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

const GetInvolved = () => {
  const [activeModal, setActiveModal] = useState(null);

  const openModal = (type) => {
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
  };

  return (
    <div className="bg-white dark:bg-gray-950 min-h-screen overflow-hidden">
      <Meta
        title="Get Involved"
        description="Join the Sabo Ibadan Youth Charity Foundation. Volunteer, become an ambassador, or partner with us to create a lasting impact."
      />
      {/* --- HERO SECTION --- */}
      <section className="relative pt-32 pb-40 bg-primary-950 overflow-hidden">
        {/* Abstract Background */}
        <div className="absolute top-0 right-0 w-[800px] h-[800px] bg-primary-800/20 rounded-full blur-[120px] -translate-y-1/2 translate-x-1/2" />
        <div className="absolute bottom-0 left-0 w-[600px] h-[600px] bg-secondary-800/10 rounded-full blur-[100px] translate-y-1/2 -translate-x-1/2" />

        <div className="max-w-7xl mx-auto px-4 relative z-10 text-center space-y-8">
          <div className="inline-flex items-center gap-3 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-secondary-400 font-bold text-xs uppercase tracking-[0.2em] animate-fade-in-up">
            <Star className="w-4 h-4 fill-secondary-400" />
            Join the Vanguard
          </div>
          <h1 className="text-6xl md:text-9xl font-black text-white leading-[0.8] tracking-tighter animate-fade-in-up">
            Be the <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-secondary-400 to-secondary-500">
              Catalyst.
            </span>
          </h1>
          <p className="text-xl text-primary-100 max-w-2xl mx-auto animate-fade-in-up stagger-1 font-medium italic">
            "The best way to find yourself is to lose yourself in the service of
            others."
          </p>
        </div>
      </section>

      {/* --- CORE OPPORTUNITIES --- */}
      <section className="relative -mt-32 z-20 px-4 pb-32">
        <div className="max-w-7xl mx-auto">
          <div className="grid lg:grid-cols-3 gap-10">
            {opportunities.map((opt, i) => (
              <div
                key={i}
                className="group relative h-full bg-white dark:bg-gray-900 rounded-[4rem] p-12 shadow-[0_50px_100px_-20px_rgba(0,0,0,0.1)] border border-gray-100 dark:border-gray-800 hover:shadow-2xl hover:-translate-y-4 transition-all duration-700 animate-fade-in-up"
                style={{ animationDelay: `${i * 150}ms` }}
              >
                <div
                  className={`w-20 h-20 rounded-3xl ${opt.accent} flex items-center justify-center mb-10 group-hover:rotate-6 transition-transform`}
                >
                  <opt.icon size={32} />
                </div>

                <h3 className="text-3xl font-black text-dark dark:text-white mb-6 tracking-tight leading-tight">
                  {opt.title}
                </h3>
                <p className="text-gray-500 dark:text-gray-400 font-medium mb-10 leading-relaxed">
                  {opt.desc}
                </p>

                <div className="space-y-4 mb-12">
                  {opt.benefits.map((ben, j) => (
                    <div
                      key={j}
                      className="flex items-center gap-3 text-sm font-bold text-dark dark:text-white"
                    >
                      <CheckCircle2 size={18} className="text-primary-600" />
                      {ben}
                    </div>
                  ))}
                </div>

                <button
                  onClick={() => {
                    if (opt.id === "corporate") {
                      openModal("corporate");
                    } else {
                      openModal(opt.id);
                    }
                  }}
                  className={`w-full py-5 rounded-2xl font-black text-sm uppercase tracking-widest transition-all ${
                    opt.title === "Corporate Partner"
                      ? "bg-dark text-white hover:bg-primary-900 shadow-xl"
                      : "bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-300 hover:bg-primary-100 dark:hover:bg-primary-900/50"
                  }`}
                >
                  {opt.cta}
                </button>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- SPONSORSHIP LEVELS (PREMIUM CARD) --- */}
      <section className="py-24 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-7xl mx-auto bg-primary-900 rounded-[5rem] overflow-hidden relative shadow-2xl">
          <div className="absolute inset-0 bg-gradient-premium opacity-90" />
          <div className="absolute top-0 right-0 w-full h-full bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-10" />

          <div className="relative z-10 p-12 md:p-24 grid lg:grid-cols-2 gap-20 items-center">
            <div className="space-y-10">
              <div className="flex items-center gap-3">
                <span className="w-12 h-0.5 bg-secondary-400" />
                <span className="text-secondary-400 font-black uppercase tracking-widest text-xs">
                  Strategic Sponsorship
                </span>
              </div>
              <h2 className="text-5xl md:text-7xl font-black text-white leading-tight">
                Your Legacy <br /> Starts{" "}
                <span className="text-secondary-500">Here.</span>
              </h2>
              <p className="text-xl text-primary-100 leading-relaxed font-medium">
                We offer structured sponsorship programs for individuals and
                organizations who want to fund specific long-term projects like
                schools or solar clinics.
              </p>
              <div className="flex items-center gap-6">
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center">
                  <ShieldCheck className="w-10 h-10 text-primary-400 mb-2" />
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">
                    Audited Transparency
                  </span>
                </div>
                <div className="p-6 rounded-3xl bg-white/5 border border-white/10 flex flex-col items-center">
                  <Sparkles className="w-10 h-10 text-secondary-500 mb-2" />
                  <span className="text-white text-[10px] font-black uppercase tracking-widest">
                    Legacy Branding
                  </span>
                </div>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-900 p-12 rounded-[3.5rem] shadow-2xl">
              <h4 className="text-2xl font-black text-dark dark:text-white text-center mb-6">
                Inquiry Dashboard
              </h4>
              <button
                onClick={() => openModal("prospectus")}
                className="w-full py-6 bg-secondary-600 hover:bg-secondary-700 text-white font-black rounded-2xl shadow-xl transition-all flex items-center justify-center gap-4"
              >
                Request Prospectus
                <ArrowRight size={20} />
              </button>
              <p className="text-sm text-gray-500 dark:text-gray-400 text-center mt-4">
                Click above to request our detailed sponsorship prospectus
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* --- FAQ MINI SECTION --- */}
      <section className="py-32 px-4 bg-white dark:bg-gray-950">
        <div className="max-w-3xl mx-auto text-center space-y-16">
          <h3 className="text-4xl font-black text-dark dark:text-white tracking-tighter">
            Common <span className="text-primary-700">Questions</span>
          </h3>
          <div className="space-y-6 text-left">
            {[
              "How do I receive proof of my impact?",
              "Can I choose which specific project I volunteer for?",
              "Is there a minimum time commitment?",
            ].map((q, i) => (
              <div
                key={i}
                className="p-8 rounded-[2.5rem] bg-gray-50 dark:bg-gray-900 border border-gray-100 dark:border-gray-800 flex items-center justify-between group hover:bg-white dark:hover:bg-gray-800 hover:shadow-lg transition-all cursor-pointer"
              >
                <p className="font-black text-dark dark:text-white">{q}</p>
                <div className="w-10 h-10 rounded-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 flex items-center justify-center group-hover:bg-primary-900 group-hover:text-white transition-all">
                  <ArrowRight size={18} />
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Modals */}
      <VolunteerModal
        isOpen={activeModal === "volunteer"}
        onClose={closeModal}
        type="volunteer"
      />
      <VolunteerModal
        isOpen={activeModal === "ambassador"}
        onClose={closeModal}
        type="ambassador"
      />
      <CorporateModal
        isOpen={activeModal === "corporate"}
        onClose={closeModal}
      />
      <ProspectusModal
        isOpen={activeModal === "prospectus"}
        onClose={closeModal}
      />
    </div>
  );
};

export default GetInvolved;
