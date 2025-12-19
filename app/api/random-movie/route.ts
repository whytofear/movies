import { NextRequest, NextResponse } from "next/server";
import { getAllMovies } from "../../../lib/database";
import { slugify } from "../../../lib/utils";
import { 
  checkRateLimit, 
  createErrorResponse, 
  createRateLimitResponse,
  logSecurityEvent,
  sanitizeNumber,
  sanitizeString
} from "../../../lib/security";

export async function POST(request: NextRequest) {
  // Apply rate limiting
  if (!checkRateLimit(request)) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { endpoint: "/api/random-movie" }, request);
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
    const genre = sanitizeString(body.genre || "", 50);
    const minRating = sanitizeNumber(body.minRating, 0, 10);
    const minYear = sanitizeNumber(body.minYear, 1900, 2030);
    const maxYear = sanitizeNumber(body.maxYear, 1900, 2030);
    const excludeAdult = Boolean(body.excludeAdult);

    const movies = await getAllMovies();

    let filteredMovies = movies.filter((movie) => {
      // Rating filter
      if (movie.vote_average < minRating) return false;

      // Year filter
      const releaseYear = new Date(movie.release_date).getFullYear();
      if (releaseYear < minYear || releaseYear > maxYear) return false;

      // Adult content filter
      if (excludeAdult && movie.adult) return false;

      // Genre filter
      if (genre && genre !== "") {
        const movieGenres = movie.genres?.toLowerCase() || "";
        if (!movieGenres.includes(genre.toLowerCase())) return false;
      }

      return true;
    });

    if (filteredMovies.length === 0) {
      return NextResponse.json(
        { error: "No movies found matching criteria" },
        { status: 404 }
      );
    }

    // Pick a random movie
    const randomIndex = Math.floor(Math.random() * filteredMovies.length);
    const randomMovie = filteredMovies[randomIndex];

    // Ensure the movie has a slug
    if (!randomMovie.slug) {
      randomMovie.slug = slugify(randomMovie.title);
    }

    return NextResponse.json({
      movie: randomMovie,
      totalMatches: filteredMovies.length,
    }, {
      headers: {
        "Cache-Control": "no-cache", // Don't cache random selections
      }
    });
  } catch (error) {
    logSecurityEvent("API_ERROR", { 
      error: error instanceof Error ? error.message : "Unknown error", 
      endpoint: "/api/random-movie" 
    }, request);
    console.error("Error getting random movie:", error);
    return createErrorResponse("Failed to get random movie", 500);
  }
}
