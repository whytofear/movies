import { NextRequest, NextResponse } from "next/server";
import { getAllMovies } from "../../../lib/database";
import { slugify } from "../../../lib/utils";
import { 
  checkRateLimit, 
  validateMoviePreferences, 
  createErrorResponse, 
  createRateLimitResponse,
  logSecurityEvent 
} from "../../../lib/security";

export async function POST(request: NextRequest) {
  // Apply rate limiting
  if (!checkRateLimit(request)) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { endpoint: "/api/pick-movie" }, request);
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

    // Validate and sanitize preferences
    const validatedPrefs = validateMoviePreferences(body);
    const { mood, duration, rating, genres, era, popularity } = validatedPrefs;

    const movies = await getAllMovies();

    let filteredMovies = movies.filter((movie) => {
      // Basic quality filter
      if (movie.vote_average < 5.5) return false;

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
        if (era === "classic" && releaseYear >= 1990) return false;
        if (era === "retro" && (releaseYear < 1990 || releaseYear > 2005))
          return false;
        if (era === "modern" && (releaseYear < 2006 || releaseYear > 2015))
          return false;
        if (era === "recent" && releaseYear < 2016) return false;
      }

      // Rating filter
      if (rating === "family" && movie.adult) return false;
      if (rating === "mature" && !movie.adult && movie.vote_average < 7.0)
        return false;

      // Popularity filter
      if (popularity !== "any") {
        if (popularity === "hidden" && movie.popularity > 50) return false;
        if (
          popularity === "popular" &&
          (movie.popularity < 30 || movie.popularity > 80)
        )
          return false;
        if (popularity === "blockbuster" && movie.popularity < 70) return false;
      }

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

    // Mood-based filtering and scoring
    if (mood !== "any") {
      filteredMovies = filteredMovies.filter((movie) => {
        const movieGenres = movie.genres?.toLowerCase() || "";
        const movieText = `${movie.title} ${
          movie.description || ""
        }`.toLowerCase();

        switch (mood) {
          case "happy":
            return (
              movieGenres.includes("comedy") ||
              movieGenres.includes("animation") ||
              movieGenres.includes("family") ||
              movieGenres.includes("musical")
            );
          case "adventure":
            return (
              movieGenres.includes("adventure") ||
              movieGenres.includes("action") ||
              movieGenres.includes("fantasy")
            );
          case "romantic":
            return (
              movieGenres.includes("romance") || movieText.includes("love")
            );
          case "funny":
            return movieGenres.includes("comedy");
          case "intense":
            return (
              movieGenres.includes("action") ||
              movieGenres.includes("thriller") ||
              movieGenres.includes("horror")
            );
          case "thoughtful":
            return (
              movieGenres.includes("drama") ||
              movieGenres.includes("science fiction") ||
              movieGenres.includes("mystery")
            );
          default:
            return true;
        }
      });
    }

    if (filteredMovies.length === 0) {
      // Fallback to any good movie if filters are too restrictive
      filteredMovies = movies.filter((movie) => movie.vote_average >= 7.0);
    }

    if (filteredMovies.length === 0) {
      return NextResponse.json({ error: "No movies found" }, { status: 404 });
    }

    // Score and sort movies
    const scoredMovies = filteredMovies.map((movie) => {
      let score =
        movie.vote_average * 0.6 + Math.min(movie.popularity / 100, 1) * 0.4;

      // Boost score based on mood match
      if (mood !== "any") {
        const movieGenres = movie.genres?.toLowerCase() || "";
        if (
          mood === "happy" &&
          (movieGenres.includes("comedy") || movieGenres.includes("animation"))
        )
          score += 1;
        if (mood === "romantic" && movieGenres.includes("romance")) score += 1;
        if (
          mood === "intense" &&
          (movieGenres.includes("action") || movieGenres.includes("thriller"))
        )
          score += 1;
      }

      return { ...movie, pickScore: score };
    });

    // Sort by score and pick from top results with some randomness
    scoredMovies.sort((a, b) => b.pickScore - a.pickScore);
    const topMovies = scoredMovies.slice(0, Math.min(20, scoredMovies.length));

    // Pick randomly from top movies
    const randomIndex = Math.floor(Math.random() * topMovies.length);
    const pickedMovie = topMovies[randomIndex];

    // Ensure the movie has a slug
    if (!pickedMovie.slug) {
      pickedMovie.slug = slugify(pickedMovie.title);
    }

    return NextResponse.json({
      movie: pickedMovie,
      totalOptions: filteredMovies.length,
    }, {
      headers: {
        "Cache-Control": "no-cache", // Don't cache personalized recommendations
      }
    });
  } catch (error) {
    logSecurityEvent("API_ERROR", { 
      error: error instanceof Error ? error.message : "Unknown error", 
      endpoint: "/api/pick-movie" 
    }, request);
    console.error("Error picking movie:", error);
    return createErrorResponse("Failed to pick movie", 500);
  }
}
