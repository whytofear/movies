import { NextRequest, NextResponse } from "next/server";
import { getAllMovies } from "../../../lib/database";
import { 
  checkRateLimit, 
  validateMoviePreferences, 
  createErrorResponse, 
  createRateLimitResponse,
  logSecurityEvent,
  sanitizeNumber,
  sanitizeArray
} from "../../../lib/security";

export async function POST(request: NextRequest) {
  // Apply rate limiting
  if (!checkRateLimit(request)) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { endpoint: "/api/recommendations" }, request);
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
    const minRating = sanitizeNumber(body.minRating, 0, 10);
    const minYear = sanitizeNumber(body.minYear, 1900, 2030);
    const maxYear = sanitizeNumber(body.maxYear, 1900, 2030);
    const limit = sanitizeNumber(body.limit || 20, 1, 100);

    const movies = await getAllMovies();

    let filteredMovies = movies.filter((movie) => {
      // Rating filter
      if (movie.vote_average < minRating) return false;

      // Year filter
      const releaseYear = new Date(movie.release_date).getFullYear();
      if (releaseYear < minYear || releaseYear > maxYear) return false;

      // Genre filter
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

    // Sort by a combination of rating and popularity
    filteredMovies = filteredMovies.sort((a, b) => {
      const scoreA =
        a.vote_average * 0.7 + Math.min(a.popularity / 100, 1) * 0.3;
      const scoreB =
        b.vote_average * 0.7 + Math.min(b.popularity / 100, 1) * 0.3;
      return scoreB - scoreA;
    });

    // Add some randomness to the top results
    const topResults = filteredMovies.slice(
      0,
      Math.min(limit * 2, filteredMovies.length)
    );
    const shuffled = topResults.sort(() => Math.random() - 0.5);

    return NextResponse.json({
      movies: shuffled.slice(0, limit),
      total: filteredMovies.length,
    }, {
      headers: {
        "Cache-Control": "public, max-age=600", // 10 minutes cache
      }
    });
  } catch (error) {
    logSecurityEvent("API_ERROR", { 
      error: error instanceof Error ? error.message : "Unknown error", 
      endpoint: "/api/recommendations" 
    }, request);
    console.error("Error getting recommendations:", error);
    return createErrorResponse("Failed to get recommendations", 500);
  }
}
