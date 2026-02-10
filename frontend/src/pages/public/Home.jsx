import React from "react";
import HeroModern from "../../components/HeroModern";
import CausesGrid from "../../components/CausesGrid";
import ImpactSection from "../../components/ImpactSection";
import Testimonials from "../../components/Testimonials";
import Support from "../../components/Support";
import ContactSection from "../../components/ContactSection";

const Home = () => {
  return (
    <main className="min-h-screen bg-paper">
      {/* Modern Hero Section */}
      <HeroModern />

      {/* Trust Bar / Logos if any could go here */}

      {/* Core Initiatives Grid - High Contrast */}
      <CausesGrid />

      {/* Impact Statistics Section */}
      <ImpactSection />

      {/* Social Proof / Testimonials */}
      <Testimonials />

      {/* Support / Partners */}
      <Support />

      {/* CTA / Contact Section */}
      <ContactSection />
    </main>
  );
};

export default Home;
