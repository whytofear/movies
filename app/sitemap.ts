import { MetadataRoute } from "next";
import { getAllMovies, getAllGenres } from "@/lib/database";
import { slugify } from "@/lib/utils";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const baseUrl = "https://SimilarMovie.me";
  const currentDate = new Date().toISOString();

  // Get all movies and genres for dynamic URLs
  const [movies, genres] = await Promise.all([getAllMovies(), getAllGenres()]);

  // Static pages with improved structure
  const staticPages = [
    { route: "", priority: 1.0, changeFreq: "daily" },
    { route: "/about", priority: 0.8, changeFreq: "monthly" },
    { route: "/contact", priority: 0.7, changeFreq: "monthly" },
    { route: "/privacy", priority: 0.3, changeFreq: "yearly" },
    { route: "/terms", priority: 0.3, changeFreq: "yearly" },
    { route: "/disclaimer", priority: 0.3, changeFreq: "yearly" },
    { route: "/movies", priority: 0.9, changeFreq: "daily" },
    { route: "/movies/popular", priority: 0.8, changeFreq: "daily" },
    { route: "/movies/recent", priority: 0.8, changeFreq: "daily" },
    { route: "/movies/top-rated", priority: 0.8, changeFreq: "weekly" },
    { route: "/genres", priority: 0.9, changeFreq: "weekly" },
    { route: "/tools", priority: 0.9, changeFreq: "weekly" },
    { route: "/tools/pick-movie", priority: 0.8, changeFreq: "weekly" },
    { route: "/tools/date-night", priority: 0.8, changeFreq: "weekly" },
    { route: "/tools/mood-finder", priority: 0.8, changeFreq: "weekly" },
    { route: "/tools/random-movie", priority: 0.8, changeFreq: "weekly" },
    { route: "/tools/advanced-search", priority: 0.8, changeFreq: "weekly" },
    { route: "/tools/movie-comparison", priority: 0.7, changeFreq: "weekly" },
    { route: "/tools/watchlist", priority: 0.7, changeFreq: "weekly" },
  ].map((page) => ({
    url: `${baseUrl}${page.route}`,
    lastModified: currentDate,
    changeFrequency: page.changeFreq as
      | "daily"
      | "weekly"
      | "monthly"
      | "yearly",
    priority: page.priority,
  }));

  // Genre pages
  const genreUrls = genres.flatMap((genre) => {
    const genreSlug = genre.toLowerCase().replace(/\s+/g, "-");
    return [
      {
        url: `${baseUrl}/genres/${genreSlug}`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.7,
      },
      {
        url: `${baseUrl}/genres/${genreSlug}/all`,
        lastModified: currentDate,
        changeFrequency: "weekly" as const,
        priority: 0.6,
      },
    ];
  });

  // Movie pages (limit to first 1000 for sitemap size)
  const movieUrls = movies.slice(0, 1000).map((movie) => ({
    url: `${baseUrl}/similar-to/${movie.slug || slugify(movie.title)}`,
    lastModified: currentDate,
    changeFrequency: "monthly" as const,
    priority: 0.5,
  }));

  return [...staticPages, ...genreUrls, ...movieUrls];
}
