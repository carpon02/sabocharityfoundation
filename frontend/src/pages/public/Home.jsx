import React from "react";
import Meta from "../../components/Meta";
import HeroModern from "../../components/HeroModern";
import TrustBar from "../../components/TrustBar";
import WhatWeDo from "../../components/WhatWeDo";
import HowItHelps from "../../components/HowItHelps";
import CausesGrid from "../../components/CausesGrid";
import ImpactSection from "../../components/ImpactSection";
import GreenTrustBanner from "../../components/GreenTrustBanner";
import UpcomingEvents from "../../components/UpcomingEvents";
import VolunteerSpotlight from "../../components/VolunteerSpotlight";
import Testimonials from "../../components/Testimonials";
import Support from "../../components/Support";
import NewsletterCTA from "../../components/NewsletterCTA";
import ContactSection from "../../components/ContactSection";

const Home = () => {
  return (
    <main className="min-h-screen bg-paper">
      <Meta
        title="Home"
        description="Welcome to the Sabo Ibadan Youth Charity Foundation. We are dedicated to empowering the youth of Sabo, Ibadan through education, health, and economic initiatives."
      />

      {/* 1. THE HOOK: Visionary Hub Hero */}
      <HeroModern />

      {/* 2. IMMEDIATE LEGITIMACY: Partner & Certification Marquee */}
      <TrustBar />

      {/* 3. THE MISSION: Strategic Pillars (Education, Health, Welfare) */}
      <WhatWeDo />

      {/* 4. DATA PROOF: Audited Performance Metrics & Live Stats */}
      <ImpactSection />

      {/* 5. CORE ACTION: High-Impact Campaigns (Direct Funding) */}
      <CausesGrid />

      {/* 6. CONVERSION NODES: Triple-Node Trust Protocol & Immediate CTA */}
      <GreenTrustBanner />

      {/* 7. THE LOGIC: Transparency Mapping (₦ -> Outcome) */}
      <HowItHelps />

      {/* 8. GROUND REALITY: Active Missions & Groundwork Briefings */}
      <UpcomingEvents />

      {/* 9. HUMAN CONTEXT: Field Intelligence & Community Stories */}
      <VolunteerSpotlight />

      {/* 10. VERIFICATION: Peer-Reviewed Impact & Testimonials */}
      <Testimonials />

      {/* 11. STAY INFORMED: Newsletter Subscription */}
      <NewsletterCTA />

      {/* 12. STRATEGIC ALLIANCES: Corporate & NGO Endorsements */}
      <Support />

      {/* 13. CONTACT: Get In Touch */}
      <ContactSection />
    </main>
  );
};

export default Home;
