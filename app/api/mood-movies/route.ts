import { NextRequest, NextResponse } from "next/server";
import { getAllMovies } from "../../../lib/database";
import { 
  checkRateLimit, 
  createErrorResponse, 
  createRateLimitResponse,
  logSecurityEvent,
  sanitizeNumber,
  sanitizeArray
} from "../../../lib/security";

export async function POST(request: NextRequest) {
  // Apply rate limiting
  if (!checkRateLimit(request)) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { endpoint: "/api/mood-movies" }, request);
    return createRateLimitResponse();
  }

  try {
    // Validate Content-Type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return createErrorResponse("Invalid content type. Expected application/json");
    }

    // Parse and validate request body
    let body;
    try {
      body = await request.json();
    } catch (error) {
      logSecurityEvent("INVALID_JSON", { error: error instanceof Error ? error.message : "Invalid JSON" }, request);
      return createErrorResponse("Invalid JSON in request body");
    }

    // Validate and sanitize input
    const genres = sanitizeArray(body.genres, 10);
    const keywords = sanitizeArray(body.keywords, 10);
    const minRating = sanitizeNumber(body.minRating, 0, 10);
    const limit = sanitizeNumber(body.limit || 20, 1, 100);

    const movies = await getAllMovies();

    let filteredMovies = movies.filter((movie) => {
      // Rating filter
      if (movie.vote_average < minRating) return false;

      // Genre matching
      if (genres && genres.length > 0) {
        const movieGenres =
          movie.genres
            ?.toLowerCase()
            .split(",")
            .map((g) => g.trim()) || [];
        const hasMatchingGenre = genres.some((selectedGenre) =>
          movieGenres.some((movieGenre) =>
            movieGenre.includes(selectedGenre.toLowerCase())
          )
        );
        if (!hasMatchingGenre) return false;
      }

      return true;
    });

    // Score movies based on mood matching
    const scoredMovies = filteredMovies.map((movie) => {
      let score =
        movie.vote_average * 0.5 + Math.min(movie.popularity / 100, 1) * 0.3;

      // Keyword matching bonus
      if (keywords && keywords.length > 0) {
        const movieText = `${movie.title} ${movie.description} ${
          movie.keywords || ""
        }`.toLowerCase();
        const keywordMatches = keywords.filter((keyword) =>
          movieText.includes(keyword.toLowerCase())
        ).length;
        score += keywordMatches * 0.5;
      }

      // Genre matching bonus
      if (genres && genres.length > 0) {
        const movieGenres =
          movie.genres
            ?.toLowerCase()
            .split(",")
            .map((g) => g.trim()) || [];
        const genreMatches = genres.filter((selectedGenre) =>
          movieGenres.some((movieGenre) =>
            movieGenre.includes(selectedGenre.toLowerCase())
          )
        ).length;
        score += genreMatches * 0.3;
      }

      return { ...movie, moodScore: score };
    });

    // Sort by mood score
    scoredMovies.sort((a, b) => b.moodScore - a.moodScore);

    // Add some randomness to top results
    const topResults = scoredMovies.slice(
      0,
      Math.min(limit * 2, scoredMovies.length)
    );
    const shuffled = topResults.sort(() => Math.random() - 0.5);

    return NextResponse.json({
      movies: shuffled.slice(0, limit),
    }, {
      headers: {
        "Cache-Control": "no-cache", // Don't cache mood-based recommendations
      }
    });
  } catch (error) {
    logSecurityEvent("API_ERROR", { 
      error: error instanceof Error ? error.message : "Unknown error", 
      endpoint: "/api/mood-movies" 
    }, request);
    console.error("Error getting mood movies:", error);
    return createErrorResponse("Failed to get mood movies", 500);
  }
}
