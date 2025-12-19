import { NextRequest, NextResponse } from "next/server";
import { getAllMovies } from "../../../lib/database";
import { 
  checkRateLimit, 
  createErrorResponse, 
  createRateLimitResponse,
  logSecurityEvent
} from "../../../lib/security";

export async function GET(request: NextRequest) {
  // Apply rate limiting
  if (!checkRateLimit(request)) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { endpoint: "/api/genres" }, request);
    return createRateLimitResponse();
  }

  try {
    const movies = await getAllMovies();

    // Extract unique genres from all movies
    const genreSet = new Set<string>();

    movies.forEach((movie) => {
      if (movie.genres) {
        movie.genres.split(",").forEach((genre) => {
          const trimmedGenre = genre.trim();
          if (trimmedGenre) {
            genreSet.add(trimmedGenre);
          }
        });
      }
    });

    const genres = Array.from(genreSet).sort();

    return NextResponse.json({ genres }, {
      headers: {
        "Cache-Control": "public, max-age=3600", // Cache for 1 hour
      }
    });
  } catch (error) {
    logSecurityEvent("API_ERROR", { 
      error: error instanceof Error ? error.message : "Unknown error", 
      endpoint: "/api/genres" 
    }, request);
    console.error("Error fetching genres:", error);
    return createErrorResponse("Failed to fetch genres", 500);
  }
}
