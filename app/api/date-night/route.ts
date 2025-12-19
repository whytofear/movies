import { NextRequest, NextResponse } from "next/server";
import { getAllMovies } from "../../../lib/database";
import { 
  checkRateLimit, 
  createErrorResponse, 
  createRateLimitResponse,
  logSecurityEvent
} from "../../../lib/security";

interface DateNightRequest {
  mood: "romantic" | "comedy" | "adventure" | "thriller" | "any";
  duration: "short" | "medium" | "long" | "any";
  rating: "family" | "mature" | "any";
  era: "classic" | "modern" | "recent" | "any";
}

export async function POST(request: NextRequest) {
  // Apply rate limiting
  if (!checkRateLimit(request)) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { endpoint: "/api/date-night" }, request);
    return createRateLimitResponse();
  }

  try {
    // Validate Content-Type
    const contentType = request.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      return createErrorResponse("Invalid content type. Expected application/json");
    }

    // Parse and validate request body
    let body: DateNightRequest;
    try {
      body = await request.json();
    } catch (error) {
      logSecurityEvent("INVALID_JSON", { error: error instanceof Error ? error.message : "Invalid JSON" }, request);
      return createErrorResponse("Invalid JSON in request body");
    }

    // Validate enum values
    const validMoods = ["romantic", "comedy", "adventure", "thriller", "any"];
    const validDurations = ["short", "medium", "long", "any"];
    const validRatings = ["family", "mature", "any"];
    const validEras = ["classic", "modern", "recent", "any"];

    const mood = validMoods.includes(body.mood) ? body.mood : "any";
    const duration = validDurations.includes(body.duration) ? body.duration : "any";
    const rating = validRatings.includes(body.rating) ? body.rating : "any";
    const era = validEras.includes(body.era) ? body.era : "any";

    const movies = await getAllMovies();

    let filteredMovies = movies.filter((movie) => {
      // Basic quality filter for date night
      if (movie.vote_average < 6.0) return false;

      // Duration filter
      if (duration !== "any" && movie.runtime) {
        if (duration === "short" && movie.runtime >= 90) return false;
        if (
          duration === "medium" &&
          (movie.runtime < 90 || movie.runtime > 130)
        )
          return false;
        if (duration === "long" && movie.runtime <= 130) return false;
      }

      // Era filter
      if (era !== "any") {
        const releaseYear = new Date(movie.release_date).getFullYear();
        if (era === "classic" && releaseYear >= 2000) return false;
        if (era === "modern" && (releaseYear < 2000 || releaseYear > 2015))
          return false;
        if (era === "recent" && releaseYear < 2016) return false;
      }

      // Rating filter (adult content)
      if (rating === "family" && movie.adult) return false;

      // Mood/Genre filter
      if (mood !== "any") {
        const movieGenres = movie.genres?.toLowerCase() || "";

        switch (mood) {
          case "romantic":
            if (
              !movieGenres.includes("romance") &&
              !movieGenres.includes("drama")
            )
              return false;
            break;
          case "comedy":
            if (!movieGenres.includes("comedy")) return false;
            break;
          case "adventure":
            if (
              !movieGenres.includes("adventure") &&
              !movieGenres.includes("action")
            )
              return false;
            break;
          case "thriller":
            if (
              !movieGenres.includes("thriller") &&
              !movieGenres.includes("mystery")
            )
              return false;
            break;
        }
      }

      return true;
    });

    // Sort by rating and popularity, with preference for date-night appropriate movies
    filteredMovies = filteredMovies.sort((a, b) => {
      let scoreA = a.vote_average * 0.6 + Math.min(a.popularity / 100, 1) * 0.4;
      let scoreB = b.vote_average * 0.6 + Math.min(b.popularity / 100, 1) * 0.4;

      // Boost romantic movies for date night
      if (a.genres?.toLowerCase().includes("romance")) scoreA += 0.5;
      if (b.genres?.toLowerCase().includes("romance")) scoreB += 0.5;

      return scoreB - scoreA;
    });

    // Add some randomness while keeping quality high
    const topMovies = filteredMovies.slice(
      0,
      Math.min(40, filteredMovies.length)
    );
    const shuffled = topMovies.sort(() => Math.random() - 0.5);

    return NextResponse.json({
      movies: shuffled.slice(0, 20),
    }, {
      headers: {
        "Cache-Control": "no-cache", // Don't cache personalized date night recommendations
      }
    });
  } catch (error) {
    logSecurityEvent("API_ERROR", { 
      error: error instanceof Error ? error.message : "Unknown error", 
      endpoint: "/api/date-night" 
    }, request);
    console.error("Error getting date night movies:", error);
    return createErrorResponse("Failed to get date night movies", 500);
  }
}
