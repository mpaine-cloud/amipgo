import { useEffect } from "react";

interface SEOProps {
  title: string;
  description: string;
  image?: string;
  url?: string;
  type?: string;
  keywords?: string;
  robots?: string;
}

export default function SEO({
  title,
  description,
  image = "https://www.amipgo.com/og-image-perfect.jpg",
  url = "https://www.amipgo.com",
  type = "website",
  keywords = "amipgo, laboratorio digital, capital, fondos, startups, innovacion, emprendimiento",
  robots = "index, follow"
}: SEOProps) {
  useEffect(() => {
    // 1. Title
    document.title = title;

    // Helper function to set or create meta tags
    const setMetaTag = (attrName: string, attrVal: string, content: string) => {
      let element = document.querySelector(`meta[${attrName}="${attrVal}"]`);
      if (element) {
        element.setAttribute("content", content);
      } else {
        const meta = document.createElement("meta");
        meta.setAttribute(attrName, attrVal);
        meta.setAttribute("content", content);
        document.head.appendChild(meta);
      }
    };

    // Helper function to set or create link tags
    const setLinkTag = (rel: string, href: string) => {
      let element = document.querySelector(`link[rel="${rel}"]`);
      if (element) {
        element.setAttribute("href", href);
      } else {
        const link = document.createElement("link");
        link.setAttribute("rel", rel);
        link.setAttribute("href", href);
        document.head.appendChild(link);
      }
    };

    // 2. Standard Meta Tags
    setMetaTag("name", "description", description);
    setMetaTag("name", "keywords", keywords);
    setMetaTag("name", "robots", robots);

    // 3. Open Graph / Facebook Meta Tags
    setMetaTag("property", "og:title", title);
    setMetaTag("property", "og:description", description);
    setMetaTag("property", "og:image", image);
    setMetaTag("property", "og:image:secure_url", image);
    setMetaTag("property", "og:url", url);
    setMetaTag("property", "og:type", type);

    // 4. Twitter Card Meta Tags
    setMetaTag("name", "twitter:title", title);
    setMetaTag("name", "twitter:description", description);
    setMetaTag("name", "twitter:image", image);

    // 5. Canonical Link
    setLinkTag("canonical", url);

    // 6. WhatsApp and legacy crawlers fallback tags
    setMetaTag("itemprop", "name", title);
    setMetaTag("itemprop", "description", description);
    setMetaTag("itemprop", "image", image);
    setLinkTag("image_src", image);

    // 7. Track page view in Google Analytics
    if (typeof window.gtag === "function") {
      const gaId = import.meta.env.VITE_GA_MEASUREMENT_ID;
      if (gaId) {
        window.gtag("event", "page_view", {
          page_title: title,
          page_location: url,
          page_path: window.location.pathname + window.location.search
        });
      }
    }
  }, [title, description, image, url, type, keywords, robots]);

  return null;
}
