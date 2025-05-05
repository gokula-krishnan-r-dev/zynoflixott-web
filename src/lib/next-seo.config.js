/**
 * Default SEO configuration for ZynoflixOTT
 * This configuration will be used across the site 
 * and can be extended on individual pages
 */

const SEO = {
  defaultTitle: "ZynoflixOTT - Premier Platform for Short Films & Independent Filmmakers",
  titleTemplate: "%s | ZynoflixOTT",
  description: "Discover, watch and upload high-quality short films on ZynoflixOTT. The leading OTT platform for independent filmmakers featuring curated content in multiple languages.",
  canonical: "https://zynoflixott.com",
  
  // Open Graph
  openGraph: {
    type: "website",
    locale: "en_IE",
    url: "https://zynoflixott.com",
    siteName: "ZynoflixOTT",
    title: "ZynoflixOTT - Watch & Upload Short Films",
    description: "Discover, watch and upload high-quality short films on ZynoflixOTT. The leading OTT platform for independent filmmakers.",
    images: [
      {
        url: "/og-image.jpg", 
        width: 1200,
        height: 630,
        alt: "ZynoflixOTT",
        type: "image/jpeg",
      },
    ],
  },
  
  // Twitter
  twitter: {
    handle: "@zynoflixott",
    site: "@zynoflixott",
    cardType: "summary_large_image",
  },
  
  // Additional metadata
  additionalMetaTags: [
    {
      name: "keywords",
      content: "OTT, short films, independent films, streaming, Tamil films, English films, Kannada films, film directors, production companies",
    },
    {
      name: "author",
      content: "ZynoflixOTT",
    },
  ],
  
  // Additional link tags
  additionalLinkTags: [
    {
      rel: "icon",
      href: "/seo.png",
    },
    {
      rel: "apple-touch-icon",
      href: "/apple-touch-icon.png",
      sizes: "180x180",
    },
    {
      rel: "manifest",
      href: "/site.webmanifest",
    },
  ],
};

export default SEO; 