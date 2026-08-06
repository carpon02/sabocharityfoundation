// layouts/PublicLayout.jsx
import React from "react";
import { Outlet } from "react-router-dom";
import NavbarModern from "../components/NavbarModern";
import Footer from "../components/Footer";

const PublicLayout = () => {
  return (
    <>
      <NavbarModern />
      <main>
        <Outlet />
      </main>
      <Footer />
    </>
  );
};

export default PublicLayout;
