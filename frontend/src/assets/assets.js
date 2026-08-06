import logo from "./logo.png";
import about_us_img from "./About_us_img.png";
import hero_img from "./hero_img.png";
import history_icon from "./history_img.png";
import target_icon from "./target.png";
import value_icon from "./values.png";
import vision_icon from "./vision.png";
import what_we_do_img from "./what_we_do_img.png";
import FAQs_img from "./FAQs-img.png";
import impact_img from "./impact_img.png";
import charity from "./Charity.png";
import {
  FaSearch,
  FaHandsHelping,
  FaLightbulb,
  FaRegSmileBeam,
  FaHeart,
  FaShieldAlt,
  FaCoins,
  FaPrayingHands,
} from "react-icons/fa";

export const assets = {
  logo,
  about_us_img,
  hero_img,
  history_icon,
  target_icon,
  value_icon,
  vision_icon,
  charity,
  what_we_do_img,
  FAQs_img,
  impact_img,
};

export const opportunitiesData = [
  {
    id: 1,
    title: "Community Volunteering",
    description:
      "Help us run educational programs and support children in need.",
    image:
      "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop",
    volunteerText: "Join as Volunteer",
    actionText: "View Details",
  },
  {
    id: 2,
    title: "Healthcare Outreach",
    description: "Assist in health awareness campaigns and medical check-ups.",
    image:
      "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop",
    volunteerText: "Participate Now",
    actionText: "View Details",
  },
  {
    id: 3,
    title: "Fundraising Events",
    description:
      "Organize or help in charity events to raise funds for our programs.",
    image:
      "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop",
    volunteerText: "Get Involved",
    actionText: "View Details",
  },
  {
    id: 4,
    title: "Community Awareness",
    description:
      "Spread the word about our initiatives and impact in the community.",
    image:
      "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&w=830&h=844&auto=format&fit=crop",
    volunteerText: "Spread Awareness",
    actionText: "View Details",
  },
];

// ✅ Blog Section
export const blogs = [
  {
    id: 1,
    title: "How Your Donations Changed Lives in 2024",
    author: "Admin",
    date: "2025-09-10",
    excerpt:
      "Last year, we supported hundreds of families with food and healthcare...",
    image: "/images/blog1.jpg",
  },
  {
    id: 2,
    title: "Youth Empowerment in Ibadan – Our Next Step",
    author: "Admin",
    date: "2025-09-05",
    excerpt:
      "We are launching a new program to equip youths with IT and vocational skills...",
    image: "/images/blog2.jpg",
  },
  {
    id: 3,
    title: "Celebrating Women Entrepreneurs",
    author: "Ngozi Adeyemi",
    date: "2025-08-28",
    excerpt:
      "Our Women in Business program has already impacted dozens of families...",
    image: "/images/blog3.jpg",
  },
];

// ✅ FAQ Section
export const faqs = [
  {
    id: 1,
    question: "How can I donate?",
    answer:
      "Click the 'Donate Now' button to see our bank details. You can transfer directly and notify us.",
  },
  {
    id: 2,
    question: "Do I need to be a member to donate?",
    answer:
      "No. Anyone can donate, but members get access to a dashboard and notifications.",
  },
  {
    id: 3,
    question: "How are funds used?",
    answer:
      "100% of donations go into programs like education, health, and youth empowerment.",
  },
  {
    id: 4,
    question: "Can I volunteer?",
    answer:
      "Yes, we welcome volunteers for our programs. Visit the 'Get Involved' section to register.",
  },
  {
    id: 5,
    question: "Will I receive updates on projects?",
    answer:
      "Yes, we send newsletters and updates on ongoing and completed projects to our donors and members.",
  },
];
export const our_board = [
  {
    id: 1,
    name: "Chairman Alh Danlami Zubairu",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    role: "Chairman",
    bg: "bg-purple-50",
  },
  {
    id: 2,
    name: "Abdulmumini Abubakar Abdul",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    role: "Board Member",
    bg: "bg-green-50",
  },
  {
    id: 3,
    name: "Baba Sam Jb",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    role: "Board Member",
    bg: "bg-yellow-50",
  },
  {
    id: 4,
    name: "Alh Ibrahim Atao",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    role: "Board Member",
    bg: "bg-pink-50",
  },
  {
    id: 5,
    name: "Danlami Sulaiman Dabo",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    role: "Board Member",
    bg: "bg-blue-50",
  },
  {
    id: 6,
    name: "Usman Adamu Usman",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    role: "Board Member",
    bg: "bg-orange-50",
  },
  {
    id: 7,
    name: "Alh Naziru Danazimi",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    role: "Board Member",
    bg: "bg-teal-50",
  },
  {
    id: 8,
    name: "Alh Ibrahim Lawal",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    role: "Board Member",
    bg: "bg-lime-50",
  },
  {
    id: 9,
    name: "Alh Surajo Mangal Musa Ayuba",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    role: "Board Member",
    bg: "bg-cyan-50",
  },
  {
    id: 10,
    name: "Abubakar Kime Muhammad",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    role: "Board Member",
    bg: "bg-rose-50",
  },
  {
    id: 11,
    name: "Alh Yahaya Ali Ibrahim",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    role: "Board Member",
    bg: "bg-amber-50",
  },
  {
    id: 12,
    name: "Alh Multar Ali",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    role: "Board Member",
    bg: "bg-fuchsia-50",
  },
];

export const our_leadership_team = [
  {
    id: 1,
    name: "Chairman Alh Danlami",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    role: "Chairman",
    bg: "bg-purple-50",
  },
  {
    id: 2,
    name: "Usman Adamu Usman",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    role: "Vice Chairman",
    bg: "bg-green-50",
  },
  {
    id: 3,
    name: "Alh Adewuo",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    role: "Vice Chairman",
    bg: "bg-yellow-50",
  },
  {
    id: 4,
    name: "Abdulmumini Abubakar Abdul",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    role: "Secretary 1",
    bg: "bg-pink-50",
  },
  {
    id: 5,
    name: "Alh Surajo Musa Ayuba",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    role: "Secretary 2",
    bg: "bg-blue-50",
  },
  {
    id: 6,
    name: "Aba Salisu Kabir",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    role: "Financial Secretary 1",
    bg: "bg-orange-50",
  },
  {
    id: 7,
    name: "Alh Hadi Gambo",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    role: "Financial Secretary 2",
    bg: "bg-teal-50",
  },
  {
    id: 8,
    name: "Bashir Mohammed",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    role: "Financial Secretary 3 / Social Secretary",
    bg: "bg-lime-50",
  },
  {
    id: 9,
    name: "Alh Ibrahim Olu Ibrahim",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    role: "Social Secretary 1",
    bg: "bg-cyan-50",
  },
  {
    id: 10,
    name: "Malam Rabiu",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    role: "Welfare Secretary 1",
    bg: "bg-rose-50",
  },
  {
    id: 11,
    name: "Malam Bausode",
    avatar:
      "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=200",
    role: "Welfare Secretary 2",
    bg: "bg-amber-50",
  },
  {
    id: 12,
    name: "P.R.O 1",
    avatar:
      "https://images.unsplash.com/photo-1527980965255-d3b416303d12?w=200&auto=format&fit=crop&q=60",
    role: "Public Relations Officer 1",
    bg: "bg-fuchsia-50",
  },
  {
    id: 13,
    name: "P.R.O 2",
    avatar:
      "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=200&auto=format&fit=crop&q=60",
    role: "Public Relations Officer 2",
    bg: "bg-indigo-50",
  },
];
export const mediaItems = [
  // Images
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1719368472026-dc26f70a9b76?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Impactful moment",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1649265825072-f7dd6942baed?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Community support",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1555212697-194d092e3b8f?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Education support",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1601568494843-772eb04aca5d?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Volunteer action",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1585687501004-615dfdfde7f1?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Teamwork",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1515165562835-c4c5b814d0d8?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Youth empowerment",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1593113598332-cd58b34b4c2d?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Children at event",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Community gathering",
  },
  {
    type: "image",
    src: "https://images.unsplash.com/photo-1533117093234-4f3f3f55c0b3?q=80&h=800&w=800&auto=format&fit=crop",
    alt: "Celebration",
  },
];

export const howItWorks = [
  {
    id: 1,
    title: "Identify a Needy Family or Child",
    description:
      "We connect you with those in urgent need of education, healthcare, or daily essentials.",
    icon: FaSearch,
    bgColor: "bg-blue-100 text-blue-600",
  },
  {
    id: 2,
    title: "Provide Consistent Support",
    description:
      "Your sponsorship ensures steady help such as school fees, medical care, and food supplies.",
    icon: FaHandsHelping,
    bgColor: "bg-green-100 text-green-600",
  },
  {
    id: 3,
    title: "Empower for a Brighter Future",
    description:
      "Sponsorship doesn’t just meet today’s needs; it builds opportunities for self-reliance tomorrow.",
    icon: FaLightbulb,
    bgColor: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 4,
    title: "See the Impact Firsthand",
    description:
      "We keep you updated so you can witness the positive change your kindness brings.",
    icon: FaRegSmileBeam,
    bgColor: "bg-pink-100 text-pink-600",
  },
];

export const benefits = [
  {
    id: 1,
    title: "Earning Allah’s Mercy",
    description:
      "“And spend in the way of Allah and do not throw yourselves with your own hands into destruction. And do good; indeed, Allah loves the doers of good.” (Qur’an 2:195)",
    icon: FaHeart,
    bgColor: "bg-red-100 text-red-600",
  },
  {
    id: 2,
    title: "A Shield on the Day of Judgment",
    description:
      "“The believer’s shade on the Day of Resurrection will be his charity.” (Hadith, Tirmidhi)",
    icon: FaShieldAlt,
    bgColor: "bg-indigo-100 text-indigo-600",
  },
  {
    id: 3,
    title: "Blessings in Wealth",
    description:
      "“The example of those who spend their wealth in the way of Allah is like a seed that grows seven spikes, each spike with a hundred grains.” (Qur’an 2:261)",
    icon: FaCoins,
    bgColor: "bg-yellow-100 text-yellow-600",
  },
  {
    id: 4,
    title: "Spiritual Purification",
    description:
      "“Take from their wealth a charity by which you purify them and cause them increase, and invoke Allah’s blessings upon them.” (Qur’an 9:103)",
    icon: FaPrayingHands,
    bgColor: "bg-green-100 text-green-600",
  },
];

const today = new Date();

export const allActivities = [
  // Campaigns
  {
    id: 1,
    type: "campaign",
    title: "School Supplies for Underprivileged Children",
    description:
      "Providing essential school supplies to children in the Sabo community to support their education.",
    about:
      "Join us in transforming the educational experience of children in the Sabo community. By volunteering, you will help distribute essential school supplies, inspire hope, and directly contribute to building a brighter future for underprivileged students. Your efforts will ensure these children have the tools they need to succeed academically and personally.",
    imageUrl: "https://source.unsplash.com/600x400/?school,children",
    goalAmount: 500000,
    raisedAmount: 350000,
    startDate: "2025-09-01",
    endDate: "2025-12-31",
    category: "Education",
    status:
      new Date("2025-09-01") > today
        ? "upcoming"
        : new Date("2025-12-31") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 2,
    type: "campaign",
    title: "Youth Vocational Training Program",
    description:
      "Empowering youths with skills in IT, tailoring, and carpentry to improve their employability.",
    about:
      "Empower the next generation by volunteering in this youth vocational training initiative. Help teach practical skills in IT, tailoring, and carpentry, opening doors to employment opportunities and financial independence. Your guidance can build confidence, competence, and hope among young people striving to succeed.",
    imageUrl: "https://source.unsplash.com/600x400/?youth,training",
    goalAmount: 700000,
    raisedAmount: 420000,
    startDate: "2025-10-01",
    endDate: "2026-03-31",
    category: "Youth Empowerment",
    status:
      new Date("2025-10-01") > today
        ? "upcoming"
        : new Date("2026-03-31") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 3,
    type: "campaign",
    title: "Food Drive for Vulnerable Families",
    description:
      "Distributing food packs to low-income families and elderly individuals in Sabo Ibadan.",
    about:
      "Be a lifeline for families and elderly residents struggling with hunger. Volunteering in this food drive allows you to distribute essential food packs and offer emotional support, making a tangible difference in people’s daily lives. Together, we can ensure no one in our community goes hungry.",
    imageUrl: "https://source.unsplash.com/600x400/?food,charity",
    goalAmount: 300000,
    raisedAmount: 150000,
    startDate: "2025-09-15",
    endDate: "2025-11-15",
    category: "Basic Needs",
    status:
      new Date("2025-09-15") > today
        ? "upcoming"
        : new Date("2025-11-15") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 4,
    type: "campaign",
    title: "Community Health Awareness Campaign",
    description:
      "Organizing free health checkups and awareness campaigns on hygiene and nutrition.",
    about:
      "Help improve community health by volunteering in this campaign. Assist in organizing checkups, educating families on hygiene and nutrition, and spreading awareness of preventive healthcare practices. Your participation directly contributes to healthier, more informed communities.",
    imageUrl: "https://source.unsplash.com/600x400/?health,community",
    goalAmount: 400000,
    raisedAmount: 200000,
    startDate: "2025-09-20",
    endDate: "2025-12-31",
    category: "Health & Wellness",
    status:
      new Date("2025-09-20") > today
        ? "upcoming"
        : new Date("2025-12-31") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 5,
    type: "campaign",
    title: "Clean Water Initiative",
    description:
      "Installing clean water points for households in underprivileged areas of Sabo community.",
    about:
      "Join our mission to provide safe drinking water to underprivileged households. As a volunteer, you will help install water points, educate residents on hygiene, and ensure sustainable access to clean water. Your efforts will have a long-lasting impact on public health and community development.",
    imageUrl: "https://source.unsplash.com/600x400/?water,community",
    goalAmount: 600000,
    raisedAmount: 350000,
    startDate: "2025-09-10",
    endDate: "2026-02-28",
    category: "Community Development",
    status:
      new Date("2025-09-10") > today
        ? "upcoming"
        : new Date("2026-02-28") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 6,
    type: "campaign",
    title: "Computer Lab for Sabo Youth",
    description:
      "Providing computers and internet access for youth learning programs.",
    about:
      "Help bridge the digital divide by volunteering to set up and run computer labs for Sabo youth. Support students in learning essential IT skills, access online resources, and develop digital literacy that opens doors to modern opportunities.",
    imageUrl: "https://source.unsplash.com/600x400/?computer,learning",
    goalAmount: 800000,
    raisedAmount: 450000,
    startDate: "2025-11-01",
    endDate: "2026-05-31",
    category: "Education",
    status:
      new Date("2025-11-01") > today
        ? "upcoming"
        : new Date("2026-05-31") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 7,
    type: "campaign",
    title: "Clothing Drive for Families",
    description:
      "Collecting and distributing clothes to needy families and children during the cold season.",
    about:
      "Spread warmth and comfort during the cold season. Volunteer to collect and distribute clothing to families and children in need, ensuring they stay protected from harsh weather. Your support brings dignity, hope, and relief to vulnerable community members.",
    imageUrl: "https://source.unsplash.com/600x400/?clothing,charity",
    goalAmount: 250000,
    raisedAmount: 120000,
    startDate: "2025-09-05",
    endDate: "2025-12-15",
    category: "Basic Needs",
    status:
      new Date("2025-09-05") > today
        ? "upcoming"
        : new Date("2025-12-15") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 8,
    type: "campaign",
    title: "Women Entrepreneurship Program",
    description:
      "Training and mentoring women to start small businesses and earn sustainable income.",
    about:
      "Empower women to achieve financial independence by volunteering in this entrepreneurship program. Help mentor and train aspiring businesswomen, offering guidance, encouragement, and practical skills to launch and sustain their own businesses. Make a meaningful impact in promoting gender equality and economic growth.",
    imageUrl: "https://source.unsplash.com/600x400/?women,business",
    goalAmount: 700000,
    raisedAmount: 380000,
    startDate: "2025-10-15",
    endDate: "2026-03-31",
    category: "Youth Empowerment",
    status:
      new Date("2025-10-15") > today
        ? "upcoming"
        : new Date("2026-03-31") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 9,
    type: "campaign",
    title: "Community Garden Project",
    description:
      "Creating community gardens to improve nutrition and promote sustainable agriculture.",
    about:
      "Promote food security and environmental sustainability by volunteering to create community gardens. Assist in planting, maintaining, and educating residents on gardening practices. Your involvement encourages healthy eating, strengthens communities, and fosters environmental stewardship.",
    imageUrl: "https://source.unsplash.com/600x400/?garden,community",
    goalAmount: 400000,
    raisedAmount: 180000,
    startDate: "2025-09-25",
    endDate: "2026-04-30",
    category: "Community Development",
    status:
      new Date("2025-09-25") > today
        ? "upcoming"
        : new Date("2026-04-30") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 10,
    type: "campaign",
    title: "Health & Vaccination Drive",
    description:
      "Providing free vaccination and basic health services to children and elderly in Sabo.",
    about:
      "Make a life-saving difference by volunteering in our vaccination and health drive. Help provide essential vaccines, basic health checks, and guidance to children and the elderly. Your efforts protect community health, prevent diseases, and promote well-being.",
    imageUrl: "https://source.unsplash.com/600x400/?vaccination,health",
    goalAmount: 500000,
    raisedAmount: 320000,
    startDate: "2025-10-01",
    endDate: "2026-01-31",
    category: "Health & Wellness",
    status:
      new Date("2025-10-01") > today
        ? "upcoming"
        : new Date("2026-01-31") < today
          ? "completed"
          : "ongoing",
  },

  // Fundraisers
  {
    id: 11,
    type: "fundraiser",
    title: "Annual Charity Gala",
    description:
      "Join us for an evening of giving, networking, and fun to raise funds for youth empowerment programs.",
    about:
      "Be part of a glamorous event with a purpose. Volunteering at our charity gala allows you to help coordinate activities, welcome guests, and ensure a seamless event that raises vital funds for youth programs. Your involvement contributes directly to supporting education and empowerment initiatives.",
    date: "2025-11-10",
    location: "Sabo Community Hall, Ibadan",
    goalAmount: 1000000,
    raisedAmount: 600000,
    imageUrl: "https://source.unsplash.com/600x400/?gala,charity",
    startDate: "2025-11-10",
    endDate: "2025-11-10",
    status:
      new Date("2025-11-10") > today
        ? "upcoming"
        : new Date("2025-11-10") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 12,
    type: "fundraiser",
    title: "Marathon for a Cause",
    description:
      "Participate in our community marathon to support educational initiatives and health programs.",
    about:
      "Join the race to make a difference! Volunteering in this marathon includes helping with logistics, cheering participants, and distributing essentials. Your support ensures a successful event that raises funds for education and healthcare, empowering countless lives.",
    date: "2025-12-05",
    location: "Ibadan City Stadium",
    goalAmount: 500000,
    raisedAmount: 250000,
    imageUrl: "https://source.unsplash.com/600x400/?marathon,run",
    startDate: "2025-12-05",
    endDate: "2025-12-05",
    status:
      new Date("2025-12-05") > today
        ? "upcoming"
        : new Date("2025-12-05") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 13,
    type: "fundraiser",
    title: "Online Crowdfunding Campaign",
    description:
      "Help us raise funds online to provide food, clothing, and scholarships to underprivileged youth.",
    about:
      "Support youth initiatives from anywhere by volunteering to promote and manage our online crowdfunding campaign. Your efforts in sharing, engaging, and coordinating digital contributions help provide food, clothing, and education opportunities for underprivileged youth.",
    date: "2025-09-25",
    location: "Online",
    goalAmount: 750000,
    raisedAmount: 400000,
    imageUrl: "https://source.unsplash.com/600x400/?crowdfunding,online",
    startDate: "2025-09-25",
    endDate: "2025-09-25",
    status:
      new Date("2025-09-25") > today
        ? "upcoming"
        : new Date("2025-09-25") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 14,
    type: "fundraiser",
    title: "Charity Music Night",
    description:
      "A music concert featuring local artists to raise awareness and funds for community programs.",
    about:
      "Combine your love for music with community service by volunteering at our charity music night. Help with organizing, welcoming guests, and coordinating activities to raise funds for essential community programs. Your involvement ensures the event is both fun and impactful.",
    date: "2025-10-20",
    location: "Ibadan Cultural Center",
    goalAmount: 300000,
    raisedAmount: 150000,
    imageUrl: "https://source.unsplash.com/600x400/?music,concert",
    startDate: "2025-10-20",
    endDate: "2025-10-20",
    status:
      new Date("2025-10-20") > today
        ? "upcoming"
        : new Date("2025-10-20") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 15,
    type: "fundraiser",
    title: "Bake Sale for Education",
    description:
      "Local volunteers selling baked goods to fund scholarships and school supplies.",
    about:
      "Sweeten someone’s day while making a difference! Volunteer to help organize and sell baked goods at our community bake sale. Your contribution helps fund scholarships, school supplies, and educational programs, directly benefiting students in need.",
    date: "2025-09-30",
    location: "Sabo Community Square",
    goalAmount: 200000,
    raisedAmount: 120000,
    imageUrl: "https://source.unsplash.com/600x400/?bake,sale",
    startDate: "2025-09-30",
    endDate: "2025-09-30",
    status:
      new Date("2025-09-30") > today
        ? "upcoming"
        : new Date("2025-09-30") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 16,
    type: "fundraiser",
    title: "Charity Art Exhibition",
    description:
      "Showcasing local artists and selling their artwork to raise funds for youth programs.",
    about:
      "Celebrate creativity and make an impact by volunteering at our charity art exhibition. Help organize exhibits, guide guests, and manage sales to raise funds that support youth programs. Your involvement ensures local artists shine while empowering the community.",
    date: "2025-11-25",
    location: "Ibadan Art Gallery",
    goalAmount: 400000,
    raisedAmount: 250000,
    imageUrl: "https://source.unsplash.com/600x400/?art,exhibition",
    startDate: "2025-11-25",
    endDate: "2025-11-25",
    status:
      new Date("2025-11-25") > today
        ? "upcoming"
        : new Date("2025-11-25") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 17,
    type: "fundraiser",
    title: "Community Fun Run",
    description:
      "A fun run event to engage the community and raise funds for health initiatives.",
    about:
      "Promote health, fitness, and community spirit by volunteering at our fun run event. Assist with registrations, route management, and cheering participants to ensure a safe and enjoyable event that raises vital funds for community health initiatives.",
    date: "2025-12-15",
    location: "Sabo Park, Ibadan",
    goalAmount: 350000,
    raisedAmount: 180000,
    imageUrl: "https://source.unsplash.com/600x400/?fun,run",
    startDate: "2025-12-15",
    endDate: "2025-12-15",
    status:
      new Date("2025-12-15") > today
        ? "upcoming"
        : new Date("2025-12-15") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 18,
    type: "fundraiser",
    title: "Virtual Gaming Tournament",
    description:
      "Online gaming tournament where participants donate to join, with proceeds supporting education programs.",
    about:
      "Combine fun and philanthropy by volunteering in our virtual gaming tournament. Help manage participants, organize matches, and engage online audiences to raise funds for educational programs. Your involvement ensures a smooth, exciting, and impactful event.",
    date: "2025-10-05",
    location: "Online",
    goalAmount: 250000,
    raisedAmount: 90000,
    imageUrl: "https://source.unsplash.com/600x400/?gaming,tournament",
    startDate: "2025-10-05",
    endDate: "2025-10-05",
    status:
      new Date("2025-10-05") > today
        ? "upcoming"
        : new Date("2025-10-05") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 19,
    type: "fundraiser",
    title: "Community Talent Show",
    description:
      "Local talent show to raise awareness and funds for youth programs.",
    about:
      "Showcase community talent while supporting youth initiatives. Volunteer to help organize performances, manage audience engagement, and ensure the event runs smoothly. Your contribution helps raise funds and inspires young people to follow their passions.",
    date: "2025-11-15",
    location: "Sabo Community Hall, Ibadan",
    goalAmount: 150000,
    raisedAmount: 70000,
    imageUrl: "https://source.unsplash.com/600x400/?talent,show",
    startDate: "2025-11-15",
    endDate: "2025-11-15",
    status:
      new Date("2025-11-15") > today
        ? "upcoming"
        : new Date("2025-11-15") < today
          ? "completed"
          : "ongoing",
  },
  {
    id: 20,
    type: "fundraiser",
    title: "Neighborhood Charity Fair",
    description:
      "A fun fair with games, food, and activities to raise funds for local education initiatives.",
    about:
      "Bring joy and support education at our neighborhood charity fair. Volunteer to manage games, food stalls, and entertainment activities. Your help ensures a fun-filled event that raises essential funds for local educational programs, benefiting children and the community as a whole.",
    date: "2025-12-20",
    location: "Sabo Community Square",
    goalAmount: 300000,
    raisedAmount: 160000,
    imageUrl: "https://source.unsplash.com/600x400/?fair,charity",
    startDate: "2025-12-20",
    endDate: "2025-12-20",
    status:
      new Date("2025-12-20") > today
        ? "upcoming"
        : new Date("2025-12-20") < today
          ? "completed"
          : "ongoing",
  },
];

export const MOCK_CAMPAIGNS = [
  {
    id: "CAM-2024-001",
    title: "Clean Water for Sabo Community",
    description:
      "Installing water boreholes and purification systems for 500 families in Sabo, Mokola area who lack access to clean drinking water. This project will provide sustainable access to clean water, reducing waterborne diseases and improving quality of life for residents.",
    image:
      "https://images.unsplash.com/photo-1594398901394-4e34939a4fd0?w=800&h=500&fit=crop",
    category: "Basic Needs",
    target: 500000,
    raised: 387500,
    donors: 156,
    startDate: "2024-01-15T00:00:00Z",
    endDate: "2025-12-15T23:59:59Z",
    createdDate: "2024-01-10T08:30:00Z",
    isActive: true,
    location: "Sabo, Mokola, Ibadan",
    featured: true,
    tags: ["water", "health", "community"],
    organizer: {
      name: "Sabo Ibadan Youth Charity Foundation",
      email: "contact@saboyouthfoundation.org",
      phone: "+234 803 123 4567",
      verified: true,
    },
    updates: [
      {
        id: 1,
        date: "2024-01-25T10:00:00Z",
        title: "Site Survey Completed",
        content:
          "We have successfully completed the site survey and identified 3 optimal locations for boreholes in consultation with community leaders and water engineers.",
        image:
          "https://images.unsplash.com/photo-1581833971358-2c8b550f87b3?w=400&h=300&fit=crop",
      },
      {
        id: 2,
        date: "2024-01-20T14:30:00Z",
        title: "Campaign Launch Success",
        content:
          "Thank you to our first 50 donors! We are off to a great start and already have strong community support.",
        image: null,
      },
    ],
    expenses: [
      {
        id: 1,
        item: "Site Survey & Permits",
        amount: 25000,
        date: "2024-01-18T00:00:00Z",
      },
      {
        id: 2,
        item: "Equipment Deposit",
        amount: 75000,
        date: "2024-01-22T00:00:00Z",
      },
    ],
    bankDetails: {
      bankName: "First Bank of Nigeria",
      accountName: "Sabo Ibadan Youth Charity Foundation",
      accountNumber: "2034567890",
    },
  },
  {
    id: "CAM-2024-002",
    title: "School Supplies for Orphaned Children",
    description:
      "Providing essential learning materials such as books, uniforms, and stationery to 300 orphaned children in Sabo, Ibadan.",
    image:
      "https://images.unsplash.com/photo-1606761568499-6f64dcd9b85b?w=800&h=500&fit=crop",
    category: "Education",
    target: 300000,
    raised: 185000,
    donors: 98,
    startDate: "2024-02-01T00:00:00Z",
    endDate: "2025-11-01T23:59:59Z",
    createdDate: "2025-01-28T08:30:00Z",
    isActive: true,
    location: "Sabo, Ibadan",
    featured: false,
    tags: ["education", "children", "orphans"],
    organizer: {
      name: "Sabo Ibadan Youth Charity Foundation",
      email: "contact@saboyouthfoundation.org",
      phone: "+234 803 987 6543",
      verified: true,
    },
    updates: [
      {
        id: 1,
        date: "2024-02-15T12:00:00Z",
        title: "First Batch Delivered",
        content:
          "150 children have received their new uniforms and books. Smiles all around!",
        image:
          "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=400&h=300&fit=crop",
      },
    ],
    expenses: [
      { id: 1, item: "Uniforms", amount: 80000, date: "2024-02-10T00:00:00Z" },
      {
        id: 2,
        item: "Books & Stationery",
        amount: 65000,
        date: "2024-02-12T00:00:00Z",
      },
    ],
    bankDetails: {
      bankName: "GTBank",
      accountName: "Sabo Ibadan Youth Charity Foundation",
      accountNumber: "2045678901",
    },
  },
  {
    id: "CAM-2024-003",
    title: "Health Outreach for Sabo Residents",
    description:
      "A free medical outreach providing consultations, medicines, and health talks for 1,000 residents of Sabo community.",
    image:
      "https://images.unsplash.com/photo-1588776814546-2f2f92d2ec9c?w=800&h=500&fit=crop",
    category: "Health",
    target: 400000,
    raised: 276000,
    donors: 123,
    startDate: "2024-03-01T00:00:00Z",
    endDate: "2024-05-01T23:59:59Z",
    createdDate: "2024-02-20T08:30:00Z",
    isActive: true,
    location: "Sabo, Ibadan",
    featured: true,
    tags: ["health", "outreach", "community"],
    organizer: {
      name: "Sabo Ibadan Youth Charity Foundation",
      email: "health@saboyouthfoundation.org",
      phone: "+234 802 456 7890",
      verified: true,
    },
    updates: [
      {
        id: 1,
        date: "2024-03-15T09:00:00Z",
        title: "Outreach Day 1",
        content:
          "Over 300 residents were attended to by volunteer doctors and nurses.",
        image:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=400&h=300&fit=crop",
      },
    ],
    expenses: [
      {
        id: 1,
        item: "Medicines",
        amount: 120000,
        date: "2024-03-05T00:00:00Z",
      },
      { id: 2, item: "Logistics", amount: 50000, date: "2024-03-06T00:00:00Z" },
    ],
    bankDetails: {
      bankName: "Access Bank",
      accountName: "Sabo Ibadan Youth Charity Foundation",
      accountNumber: "2056789012",
    },
  },
  {
    id: "CAM-2024-004",
    title: "Youth Empowerment Vocational Training",
    description:
      "Offering free vocational training in tailoring, carpentry, and ICT to 200 unemployed youths in Sabo, Ibadan.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop",
    category: "Empowerment",
    target: 600000,
    raised: 422000,
    donors: 145,
    startDate: "2024-04-01T00:00:00Z",
    endDate: "2024-06-01T23:59:59Z",
    createdDate: "2024-03-25T08:30:00Z",
    isActive: true,
    location: "Sabo, Ibadan",
    featured: false,
    tags: ["youth", "training", "empowerment"],
    organizer: {
      name: "Sabo Ibadan Youth Charity Foundation",
      email: "youth@saboyouthfoundation.org",
      phone: "+234 805 654 3210",
      verified: true,
    },
    updates: [
      {
        id: 1,
        date: "2024-04-15T15:00:00Z",
        title: "First Training Session",
        content:
          "40 youths have begun their training in tailoring and ICT, facilitated by professional trainers.",
        image:
          "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?w=400&h=300&fit=crop",
      },
    ],
    expenses: [
      {
        id: 1,
        item: "Training Materials",
        amount: 100000,
        date: "2024-04-10T00:00:00Z",
      },
      {
        id: 2,
        item: "Trainer Fees",
        amount: 150000,
        date: "2024-04-12T00:00:00Z",
      },
    ],
    bankDetails: {
      bankName: "UBA",
      accountName: "Sabo Ibadan Youth Charity Foundation",
      accountNumber: "2067890123",
    },
  },
  {
    id: "CAM-2024-005",
    title: "Food Relief for Vulnerable Families",
    description:
      "Distributing food packages to 400 low-income families in Sabo to alleviate hunger and malnutrition.",
    image:
      "https://images.unsplash.com/photo-1606788075761-41a6a251d6e3?w=800&h=500&fit=crop",
    category: "Food Relief",
    target: 350000,
    raised: 275000,
    donors: 110,
    startDate: "2024-05-01T00:00:00Z",
    endDate: "2024-06-30T23:59:59Z",
    createdDate: "2024-04-25T08:30:00Z",
    isActive: true,
    location: "Sabo, Ibadan",
    featured: true,
    tags: ["food", "relief", "community"],
    organizer: {
      name: "Sabo Ibadan Youth Charity Foundation",
      email: "relief@saboyouthfoundation.org",
      phone: "+234 806 321 7654",
      verified: true,
    },
    updates: [
      {
        id: 1,
        date: "2024-05-20T12:00:00Z",
        title: "First Food Distribution",
        content:
          "200 families have already received rice, beans, and vegetable oil packages.",
        image:
          "https://images.unsplash.com/photo-1606788075761-41a6a251d6e3?w=400&h=300&fit=crop",
      },
    ],
    expenses: [
      {
        id: 1,
        item: "Food Supplies",
        amount: 180000,
        date: "2024-05-10T00:00:00Z",
      },
      {
        id: 2,
        item: "Transportation",
        amount: 40000,
        date: "2024-05-12T00:00:00Z",
      },
    ],
    bankDetails: {
      bankName: "Zenith Bank",
      accountName: "Sabo Ibadan Youth Charity Foundation",
      accountNumber: "2078901234",
    },
  },
  {
    id: "CAM-2024-006",
    title: "Girls in Tech Program",
    description:
      "Empowering 100 young girls in Sabo through free coding, robotics, and digital skills workshops to prepare them for future opportunities in technology.",
    image:
      "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=800&h=500&fit=crop",
    category: "Education",
    target: 450000,
    raised: 310000,
    donors: 132,
    startDate: "2024-06-15T00:00:00Z",
    endDate: "2024-08-15T23:59:59Z",
    createdDate: "2024-06-01T08:30:00Z",
    isActive: true,
    location: "Sabo, Ibadan",
    featured: false,
    tags: ["education", "girls", "technology"],
    organizer: {
      name: "Sabo Ibadan Youth Charity Foundation",
      email: "edu@saboyouthfoundation.org",
      phone: "+234 807 222 3344",
      verified: true,
    },
    updates: [
      {
        id: 1,
        date: "2024-07-01T10:00:00Z",
        title: "Program Kickoff",
        content:
          "First 30 girls enrolled in basic web development and robotics classes.",
        image:
          "https://images.unsplash.com/photo-1581092336925-5d8f7f7a274a?w=400&h=300&fit=crop",
      },
    ],
    expenses: [
      {
        id: 1,
        item: "Laptops & Kits",
        amount: 200000,
        date: "2024-06-20T00:00:00Z",
      },
      {
        id: 2,
        item: "Trainers Fees",
        amount: 100000,
        date: "2024-06-25T00:00:00Z",
      },
    ],
    bankDetails: {
      bankName: "Polaris Bank",
      accountName: "Sabo Ibadan Youth Charity Foundation",
      accountNumber: "2089012345",
    },
  },
  {
    id: "CAM-2024-007",
    title: "Community Library Renovation",
    description:
      "Renovating the old community library in Sabo with new furniture, solar lighting, and modern books to encourage a reading culture among youths.",
    image:
      "https://images.unsplash.com/photo-1532012197267-da84d127e765?w=800&h=500&fit=crop",
    category: "Education",
    target: 500000,
    raised: 290000,
    donors: 115,
    startDate: "2024-07-01T00:00:00Z",
    endDate: "2024-09-01T23:59:59Z",
    createdDate: "2024-06-28T08:30:00Z",
    isActive: true,
    location: "Sabo, Ibadan",
    featured: true,
    tags: ["library", "education", "youth"],
    organizer: {
      name: "Sabo Ibadan Youth Charity Foundation",
      email: "library@saboyouthfoundation.org",
      phone: "+234 809 555 6677",
      verified: true,
    },
    updates: [
      {
        id: 1,
        date: "2024-07-20T15:00:00Z",
        title: "Renovation Begins",
        content:
          "The old structure is being refurbished with new shelves and solar lighting installation.",
        image:
          "https://images.unsplash.com/photo-1581090700227-4c4cdd7a7b2e?w=400&h=300&fit=crop",
      },
    ],
    expenses: [
      {
        id: 1,
        item: "Construction Materials",
        amount: 150000,
        date: "2024-07-05T00:00:00Z",
      },
      {
        id: 2,
        item: "Books Purchase",
        amount: 100000,
        date: "2024-07-12T00:00:00Z",
      },
    ],
    bankDetails: {
      bankName: "Stanbic IBTC",
      accountName: "Sabo Ibadan Youth Charity Foundation",
      accountNumber: "2090123456",
    },
  },
  {
    id: "CAM-2024-008",
    title: "Free Eye Screening & Glasses",
    description:
      "Providing free eye screening and prescription glasses to 500 residents of Sabo who cannot afford proper eye care.",
    image:
      "https://images.unsplash.com/photo-1588776814546-2f2f92d2ec9c?w=800&h=500&fit=crop",
    category: "Health",
    target: 300000,
    raised: 195000,
    donors: 90,
    startDate: "2024-08-01T00:00:00Z",
    endDate: "2024-09-30T23:59:59Z",
    createdDate: "2024-07-25T08:30:00Z",
    isActive: true,
    location: "Sabo, Ibadan",
    featured: false,
    tags: ["health", "eye-care", "community"],
    organizer: {
      name: "Sabo Ibadan Youth Charity Foundation",
      email: "healthcare@saboyouthfoundation.org",
      phone: "+234 808 777 8888",
      verified: true,
    },
    updates: [
      {
        id: 1,
        date: "2024-08-15T14:00:00Z",
        title: "First 100 Screened",
        content:
          "100 residents successfully screened and 40 received free glasses.",
        image:
          "https://images.unsplash.com/photo-1598257006624-4b44d3cf1c5f?w=400&h=300&fit=crop",
      },
    ],
    expenses: [
      {
        id: 1,
        item: "Glasses Procurement",
        amount: 100000,
        date: "2024-08-10T00:00:00Z",
      },
      {
        id: 2,
        item: "Medical Equipment",
        amount: 60000,
        date: "2024-08-12T00:00:00Z",
      },
    ],
    bankDetails: {
      bankName: "FCMB",
      accountName: "Sabo Ibadan Youth Charity Foundation",
      accountNumber: "2101234567",
    },
  },
  {
    id: "CAM-2024-009",
    title: "Sports for Development",
    description:
      "Organizing a football and athletics tournament for 300 youths in Sabo to promote unity, fitness, and talent discovery.",
    image:
      "https://images.unsplash.com/photo-1517649763962-0c623066013b?w=800&h=500&fit=crop",
    category: "Sports",
    target: 250000,
    raised: 160000,
    donors: 70,
    startDate: "2024-09-01T00:00:00Z",
    endDate: "2024-10-15T23:59:59Z",
    createdDate: "2024-08-20T08:30:00Z",
    isActive: true,
    location: "Sabo, Ibadan",
    featured: true,
    tags: ["sports", "youth", "development"],
    organizer: {
      name: "Sabo Ibadan Youth Charity Foundation",
      email: "sports@saboyouthfoundation.org",
      phone: "+234 810 123 4567",
      verified: true,
    },
    updates: [
      {
        id: 1,
        date: "2024-09-10T11:00:00Z",
        title: "Tournament Begins",
        content:
          "8 football teams and 50 athletes participated in the opening games with strong community support.",
        image:
          "https://images.unsplash.com/photo-1521412644187-c49fa049e84d?w=400&h=300&fit=crop",
      },
    ],
    expenses: [
      {
        id: 1,
        item: "Sports Kits",
        amount: 80000,
        date: "2024-09-05T00:00:00Z",
      },
      {
        id: 2,
        item: "Venue & Logistics",
        amount: 50000,
        date: "2024-09-06T00:00:00Z",
      },
    ],
    bankDetails: {
      bankName: "Wema Bank",
      accountName: "Sabo Ibadan Youth Charity Foundation",
      accountNumber: "2112345678",
    },
  },
  {
    id: "CAM-2024-010",
    title: "Elderly Care Support",
    description:
      "Supporting 200 elderly residents of Sabo with monthly stipends, health checks, and food items to improve their welfare.",
    image:
      "https://images.unsplash.com/photo-1599940843191-88f1c244a8ed?w=800&h=500&fit=crop",
    category: "Welfare",
    target: 400000,
    raised: 240000,
    donors: 85,
    startDate: "2024-10-01T00:00:00Z",
    endDate: "2024-12-01T23:59:59Z",
    createdDate: "2024-09-28T08:30:00Z",
    isActive: true,
    location: "Sabo, Ibadan",
    featured: false,
    tags: ["elderly", "welfare", "support"],
    organizer: {
      name: "Sabo Ibadan Youth Charity Foundation",
      email: "welfare@saboyouthfoundation.org",
      phone: "+234 812 999 0000",
      verified: true,
    },
    updates: [
      {
        id: 1,
        date: "2024-10-20T13:00:00Z",
        title: "First Distribution Completed",
        content:
          "120 elderly residents received their stipends and food packages for October.",
        image:
          "https://images.unsplash.com/photo-1599940843191-88f1c244a8ed?w=400&h=300&fit=crop",
      },
    ],
    expenses: [
      {
        id: 1,
        item: "Food Supplies",
        amount: 100000,
        date: "2024-10-10T00:00:00Z",
      },
      {
        id: 2,
        item: "Medical Checks",
        amount: 60000,
        date: "2024-10-12T00:00:00Z",
      },
    ],
    bankDetails: {
      bankName: "Heritage Bank",
      accountName: "Sabo Ibadan Youth Charity Foundation",
      accountNumber: "2123456789",
    },
  },
];
