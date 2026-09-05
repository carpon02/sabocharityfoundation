import React from "react";
import Meta from "../../components/Meta";
import HeroModern from "../../components/HeroModern";
import ImpactSection from "../../components/ImpactSection";
import AboutUsSection from "../../components/AboutUsSection";
import CausesGrid from "../../components/CausesGrid";
import SuccessStories from "../../components/SuccessStories";
import GetInvolvedSection from "../../components/GetInvolvedSection";
import DonateSection from "../../components/DonateSection";
import NewsletterCTA from "../../components/NewsletterCTA";
import ContactSection from "../../components/ContactSection";
import TrustBar from "../../components/TrustBar";

const Home = () => {
  return (
    <main className="min-h-screen bg-paper">
      <Meta
        title="Home"
        description="Welcome to the Sabo Ibadan Youth Charity Foundation. We are dedicated to empowering the youth of Sabo, Ibadan through education, health, and economic initiatives."
      />

      {/* 1. HERO: Compelling hero, mission statement & Donate Now CTA */}
      <HeroModern />

      {/* 2. IMPACT HIGHLIGHTS: Real-time statistics, key numbers & proof */}
      <ImpactSection />

      {/* 3. ABOUT US: Our Story, Mission, Team & Financial Transparency */}
      <AboutUsSection />

      {/* 4. OUR WORK: Active Projects with Progress Trackers */}
      <CausesGrid />

      {/* 5. SUCCESS STORIES: Beneficiary Case Studies & Testimonials */}
      <SuccessStories />

      {/* 6. GET INVOLVED: Volunteer, Fundraise & Corporate Partnerships */}
      <GetInvolvedSection />

      {/* 7. DONATE: Secure Giving, Recurring Donations & Impact Tiers */}
      <DonateSection />

      {/* 8. NEWSLETTER: Stay informed with community updates */}
      <NewsletterCTA />

      {/* 9. CONTACT: Email, phone, address & social channels */}
      <ContactSection />

      {/* 10. TRUST ELEMENTS: Partner logos & certification seals (near footer) */}
      <TrustBar />
    </main>
  );
};

export default Home;

