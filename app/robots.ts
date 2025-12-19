import { MetadataRoute } from "next";

export default function robots(): MetadataRoute.Robots {
  return {
    rules: {
      userAgent: "*",
      allow: [
        "/",
        "/about",
        "/contact",
        "/privacy",
        "/terms",
        "/disclaimer",
        "/movies",
        "/movies/popular",
        "/movies/recent",
        "/movies/top-rated",
        "/genres",
        "/genres/*",
        "/similar-to/*",
        "/tools",
        "/tools/*",
      ],
      disallow: ["/api/"],
    },
    sitemap: "https://SimilarMovie.me/sitemap.xml",
  };
}
