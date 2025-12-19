import { Movie } from "./supabase";

/**
 * Convert movie title to URL-friendly slug
 * Enhanced to better handle special characters, international characters and edge cases
 */
export function slugify(title: string): string {
  if (!title) return "";

  // Handle specific unicode characters and symbols that are commonly used in movie titles
  let slug = title
    .toLowerCase()
    // First replace common entities and punctuation with spaces or appropriate replacements
    .replace(/&amp;|&/g, "and")
    .replace(/[\u2019'']/g, "") // Smart quotes
    .replace(/[:\.,;!?@#$%^*(){}[\]|\\/<>~`=+]/g, " ") // Common punctuation to spaces

    // Replace special characters that might be in movie titles with appropriate alternatives
    .replace(/½/g, "half")
    .replace(/[¼]/g, "quarter")
    .replace(/[¾]/g, "three-quarter")
    .replace(/©/g, "c")
    .replace(/®/g, "r")
    .replace(/™/g, "tm")
    .replace(/\$/g, "dollar")
    .replace(/€/g, "euro")
    .replace(/£/g, "pound")
    .replace(/°/g, "degrees")
    .replace(/\s\+\s/g, "-plus-") // " + " to "-plus-"
    .replace(/\s+vs\.?\s+/g, "-vs-") // "vs" or "vs." with spaces to "-vs-"

    // Handle specific patterns like "Part II" or "Chapter IV" that should be preserved in a cleaner format
    .replace(/\s+(i{1,3}|iv|v|vi{1,3}|ix|x)$/i, "-$1") // Convert "Part II" to "part-ii"

    // Normalize and remove remaining non-URL friendly characters
    .normalize("NFKD") // Normalize unicode (e.g., é -> e)
    .replace(/[\u0300-\u036f]/g, "") // Remove diacritical marks
    .replace(/[^\w\s-]/g, "") // Remove remaining non-word chars
    .trim()
    .replace(/[\s_-]+/g, "-") // Replace spaces, underscores and multiple hyphens with a single hyphen
    .replace(/^-+|-+$/g, ""); // Remove leading/trailing hyphens

  // Ensure we have at least one character for very unusual cases
  if (!slug) {
    return "movie";
  }

  return slug.substring(0, 100); // Limit slug length for extremely long titles
}

/**
 * Convert slug back to search pattern for database lookup
 * Enhanced to handle the more sophisticated slugify function
 */
export function slugToSearchPattern(slug: string): string {
  // Basic conversion of hyphens to spaces
  let pattern = slug.replace(/-/g, " ");

  // Handle special replacements we made in slugify
  pattern = pattern
    .replace(/(\s|^)and(\s|$)/g, " & ") // "and" might have been "&" originally
    .replace(/(\s|^)vs(\s|$)/g, " vs. "); // "vs" might have been "vs." originally

  // Add fuzzy matching characters for improved search
  return pattern.trim();
}

/**
 * Format currency values
 */
export function formatCurrency(value: number): string {
  if (value === 0) return "N/A";
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

/**
 * Format runtime in minutes to hours and minutes
 */
export function formatRuntime(minutes: number): string {
  if (!minutes) return "N/A";
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  if (hours === 0) return `${mins}m`;
  if (mins === 0) return `${hours}h`;
  return `${hours}h ${mins}m`;
}

/**
 * Format revenue/budget values
 */
export function formatRevenue(value: number): string {
  if (value >= 1000000000) {
    return `$${(value / 1000000000).toFixed(1)}B`;
  }
  if (value >= 1000000) {
    return `$${(value / 1000000).toFixed(1)}M`;
  }
  if (value >= 1000) {
    return `$${(value / 1000).toFixed(1)}K`;
  }
  return `$${value.toLocaleString()}`;
}

/**
 * Calculate Jaccard similarity between two sets
 */
function jaccardSimilarity(set1: Set<string>, set2: Set<string>): number {
  const intersection = new Set([...set1].filter((x) => set2.has(x)));
  const union = new Set([...set1, ...set2]);

  if (union.size === 0) return 0;
  return intersection.size / union.size;
}

/**
 * Parse comma-separated string into cleaned array
 */
function parseCommaSeparated(str: string): string[] {
  if (!str) return [];
  return str
    .split(",")
    .map((item) => item.trim().toLowerCase())
    .filter(Boolean);
}

/**
 * Calculate similarity score between two movies
 */
export function calculateSimilarity(movieA: Movie, movieB: Movie): number {
  // Parse genres and keywords
  const genresA = new Set(parseCommaSeparated(movieA.genres));
  const genresB = new Set(parseCommaSeparated(movieB.genres));
  const keywordsA = new Set(parseCommaSeparated(movieA.keywords));
  const keywordsB = new Set(parseCommaSeparated(movieB.keywords));

  // Calculate Jaccard similarities
  const genreSimilarity = jaccardSimilarity(genresA, genresB);
  const keywordSimilarity = jaccardSimilarity(keywordsA, keywordsB);

  // Normalize rating and popularity for scoring
  const ratingA = movieA.vote_average / 10;
  const ratingB = movieB.vote_average / 10;
  const popularityA = Math.min(movieA.popularity / 100, 1); // Cap at 100
  const popularityB = Math.min(movieB.popularity / 100, 1);

  // Calculate quality boost (average of both movies' metrics)
  const qualityBoost = (ratingA + ratingB + popularityA + popularityB) / 4;

  // Weighted similarity score
  const baseScore = genreSimilarity * 0.6 + keywordSimilarity * 0.4;
  const finalScore = baseScore * (0.7 + qualityBoost * 0.3); // Quality boost up to 30%

  return finalScore;
}

/**
 * Get similar movies with similarity scores
 */
export function getSimilarMovies(
  targetMovie: Movie,
  allMovies: Movie[],
  limit: number = 50
): Array<Movie & { similarity: number }> {
  const similarMovies = allMovies
    .filter((movie) => movie.id !== targetMovie.id)
    .map((movie) => ({
      ...movie,
      similarity: calculateSimilarity(targetMovie, movie),
    }))
    .filter((movie) => movie.similarity > 0) // Only include movies with some similarity
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);

  return similarMovies;
}

/**
 * Extract year from date string
 */
export function getYear(dateString: string): string {
  if (!dateString) return "N/A";
  return new Date(dateString).getFullYear().toString();
}

/**
 * Get shared genres between two movies
 */
export function getSharedGenres(movieA: Movie, movieB: Movie): string[] {
  const genresA = new Set(parseCommaSeparated(movieA.genres));
  const genresB = new Set(parseCommaSeparated(movieB.genres));
  return [...genresA].filter((genre) => genresB.has(genre));
}

/**
 * Format vote count with K/M suffixes
 */
export function formatVoteCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M`;
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K`;
  }
  return count.toString();
}

/**
 * Generate movie page title for SEO
 */
export function generateMovieTitle(movie: Movie, similarCount: number): string {
  return `${similarCount} Movies Similar to ${movie.title} |SimilarMovie.me`;
}

/**
 * Generate movie page description for SEO
 */
export function generateMovieDescription(
  movie: Movie,
  similarCount: number
): string {
  const genres = parseCommaSeparated(movie.genres).slice(0, 3).join(", ");
  return `Discover ${similarCount} movies like ${movie.title}${
    genres ? ` in ${genres}` : ""
  } based on genres, ratings, and production info. Find your next favorite film.`;
}

/**
 * Validate and clean poster URL
 */
export function getValidPosterUrl(posterurl: string): string | null {
  if (!posterurl || posterurl.trim() === "") return null;

  // If it's already a full URL, return as is
  if (posterurl.startsWith("http")) return posterurl;

  // If it's a path, it might be from TMDB
  if (posterurl.startsWith("/")) {
    return `https://image.tmdb.org/t/p/w500${posterurl}`;
  }

  // If it's not a URL or path with slash, treat it as a TMDB ID
  return `https://image.tmdb.org/t/p/w500/${posterurl}`;
}
