// layouts/PublicLayout.jsx
import React from "react";
import { Outlet, useLocation } from "react-router-dom";
import NavbarModern from "../components/NavbarModern";
import Banner from "../components/Banner";
import Footer from "../components/Footer";

const PublicLayout = () => {
  const location = useLocation();

  // Don't show banner on the blogs page
  const hideBannerRoutes = ["/blogs"];
  const showBanner = !hideBannerRoutes.includes(location.pathname);

  return (
    <>
      <NavbarModern />
      {showBanner && <Banner />}
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
