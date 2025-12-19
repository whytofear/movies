"use client";

import { useState, useEffect } from "react";
import { Movie } from "../../lib/supabase";
import { browserCache } from "../../lib/cache";
import { slugify } from "../../lib/utils";
import LoadingSpinner from "./LoadingSpinner";
import ErrorBoundary from "./ErrorBoundary";
import Link from "next/link";

interface MovieSuggestionsProps {
  currentMovie?: Movie;
  limit?: number;
  genres?: string[];
  className?: string;
}

export default function MovieSuggestions({
  currentMovie,
  limit = 4,
  genres = [],
  className = "",
}: MovieSuggestionsProps) {
  const [suggestions, setSuggestions] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function fetchSuggestions() {
      setLoading(true);
      setError(null);

      try {
        // Create cache key based on current movie and genres
        const cacheKey = `suggestions:${
          currentMovie?.id || "none"
        }:${genres.join(",")}:${limit}`;

        // Try to get from browser cache first
        const cached = browserCache.get<Movie[]>(cacheKey);
        if (cached) {
          setSuggestions(cached);
          setLoading(false);
          return;
        }

        let url = "/api/recommendations";
        let body: any = { limit };

        if (currentMovie) {
          // Get similar movies if we have a current movie
          const movieGenres =
            currentMovie.genres?.split(",").map((g) => g.trim()) || [];
          body.genres = movieGenres.slice(0, 3); // Use first 3 genres
          body.minRating = Math.max(6.0, currentMovie.vote_average - 1);
        } else if (genres.length > 0) {
          // Use provided genres
          body.genres = genres;
          body.minRating = 6.5;
        } else {
          // Get popular movies as fallback
          url = "/api/popular";
        }

        const response = await fetch(url, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });

        if (!response.ok) {
          throw new Error("Failed to fetch suggestions");
        }

        const data = await response.json();
        const movies = data.movies || [];

        // Filter out current movie if present
        const filteredMovies = currentMovie
          ? movies.filter((m: Movie) => m.id !== currentMovie.id)
          : movies;

        setSuggestions(filteredMovies.slice(0, limit));

        // Cache the results
        browserCache.set(cacheKey, filteredMovies.slice(0, limit), 15); // 15 minutes cache
      } catch (err) {
        setError(
          err instanceof Error ? err.message : "Failed to load suggestions"
        );
      } finally {
        setLoading(false);
      }
    }

    fetchSuggestions();
  }, [currentMovie?.id, genres.join(","), limit]);

  if (loading) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Suggested Movies
        </h3>
        <LoadingSpinner size="md" text="Loading suggestions..." />
      </div>
    );
  }

  if (error) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Suggested Movies
        </h3>
        <div className="text-center py-8">
          <p className="text-gray-600 mb-4">Failed to load suggestions</p>
          <button
            onClick={() => window.location.reload()}
            className="text-blue-600 hover:text-blue-800 font-medium"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (suggestions.length === 0) {
    return (
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          Suggested Movies
        </h3>
        <p className="text-gray-600 text-center py-4">
          No suggestions available at the moment.
        </p>
      </div>
    );
  }

  return (
    <ErrorBoundary>
      <div className={`bg-white rounded-lg shadow-md p-6 ${className}`}>
        <h3 className="text-lg font-semibold text-gray-900 mb-4">
          {currentMovie
            ? `More Like ${currentMovie.title}`
            : "Suggested Movies"}
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {suggestions.map((movie) => (
            <Link
              href={`/similar-to/${movie.slug || slugify(movie.title)}`}
              key={movie.id}
              className="group block"
            >
              <div className="aspect-[2/3] bg-gray-200 rounded-lg overflow-hidden mb-2 group-hover:shadow-lg transition-shadow">
                {movie.poster_path || movie.posterurl ? (
                  <Image
                    src={
                      (movie.poster_path || movie.posterurl)?.startsWith("http")
                        ? (movie.poster_path || movie.posterurl)!
                        : `https://image.tmdb.org/t/p/w300${
                            movie.poster_path || movie.posterurl
                          }`
                    }
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    loading="lazy"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <span className="text-4xl">🎬</span>
                  </div>
                )}
              </div>

              <h4 className="font-medium text-gray-900 text-sm mb-1 line-clamp-2 group-hover:text-blue-600 transition-colors">
                {movie.title}
              </h4>

              <div className="flex items-center justify-between text-xs text-gray-600">
                <span>⭐ {movie.vote_average.toFixed(1)}</span>
                <span>{new Date(movie.release_date).getFullYear()}</span>
              </div>
            </Link>
          ))}
        </div>

        {currentMovie && (
          <div className="mt-4 text-center">
            <a
              href={`/similar-to/${
                currentMovie.slug || slugify(currentMovie.title)
              }`}
              className="text-blue-600 hover:text-blue-800 font-medium text-sm"
            >
              View All Similar Movies →
            </a>
          </div>
        )}
      </div>
    </ErrorBoundary>
  );
}
