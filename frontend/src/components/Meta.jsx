import React from "react";
import { Helmet } from "react-helmet-async";

const Meta = ({
  title = "Sabo Ibadan Youth Charity Foundation | Empowering the Future",
  description = "Empowering the youth and underprivileged in Sabo, Ibadan through sustainable charity, education, and community support initiatives.",
  keywords = "charity, ibadan, youth empowerment, Sabo Ibadan, donation, community support, education",
  ogTitle,
  ogDescription,
  ogImage = "/og-image.jpg",
  ogUrl = window.location.href,
  ogType = "website",
  twitterCard = "summary_large_image",
}) => {
  const siteTitle = title.includes("Sabo Ibadan")
    ? title
    : `${title} | Sabo Ibadan Youth Charity Foundation`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{siteTitle}</title>
      <meta name="title" content={siteTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />

      {/* Open Graph / Facebook */}
      <meta property="og:type" content={ogType} />
      <meta property="og:url" content={ogUrl} />
      <meta property="og:title" content={ogTitle || siteTitle} />
      <meta property="og:description" content={ogDescription || description} />
      <meta property="og:image" content={ogImage} />

      {/* Twitter */}
      <meta property="twitter:card" content={twitterCard} />
      <meta property="twitter:url" content={ogUrl} />
      <meta property="twitter:title" content={ogTitle || siteTitle} />
      <meta
        property="twitter:description"
        content={ogDescription || description}
      />
      <meta property="twitter:image" content={ogImage} />
    </Helmet>
  );
};

export default Meta;
