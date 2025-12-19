"use client";

import { useState, useEffect } from "react";
import { Movie } from "../../../lib/supabase";
import MovieCard from "../../components/MovieCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorBoundary from "../../components/ErrorBoundary";

export default function MovieRecommenderPage() {
  const [genres, setGenres] = useState<string[]>([]);
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [minRating, setMinRating] = useState<number>(6.0);
  const [minYear, setMinYear] = useState<number>(2000);
  const [maxYear, setMaxYear] = useState<number>(2024);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  useEffect(() => {
    // Fetch available genres
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setAvailableGenres(data.genres))
      .catch((err) => console.error("Error fetching genres:", err));
  }, []);

  const handleGenreToggle = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre]
    );
  };

  const getRecommendations = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/recommendations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          genres: selectedGenres,
          minRating,
          minYear,
          maxYear,
          limit: 20,
        }),
      });

      const data = await response.json();
      setRecommendations(data.movies || []);
    } catch (error) {
      console.error("Error getting recommendations:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              🎯 Movie Recommender
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-blue-100 max-w-3xl mx-auto">
              Get personalized movie recommendations based on your preferences
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!recommendations.length && !loading ? (
          <>
            {/* Recommendation Tool - Moved to the top */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6">
                🎬 Find Your Next Favorite Movie
              </h2>

              {/* Genre Selection */}
              <div className="mb-6">
                <label className="block text-base font-medium text-gray-700 mb-3">
                  Select genres (choose up to 3)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      disabled={
                        selectedGenres.length >= 3 &&
                        !selectedGenres.includes(genre)
                      }
                      className={`px-3 py-2 text-sm rounded-md transition-all ${
                        selectedGenres.includes(genre)
                          ? "bg-blue-600 text-white"
                          : selectedGenres.length >= 3
                          ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                          : "bg-gray-100 text-gray-800 hover:bg-gray-200"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
                <p className="text-xs text-gray-500 mt-2">
                  {selectedGenres.length}/3 genres selected
                </p>
              </div>

              {/* Minimum Rating */}
              <div className="mb-6">
                <label
                  htmlFor="min-rating"
                  className="block text-base font-medium text-gray-700 mb-3"
                >
                  Minimum Rating: {minRating.toFixed(1)}
                </label>
                <input
                  type="range"
                  id="min-rating"
                  min="1"
                  max="9"
                  step="0.5"
                  value={minRating}
                  onChange={(e) => setMinRating(parseFloat(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>1.0</span>
                  <span>9.0</span>
                </div>
              </div>

              {/* Year Range */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-6">
                <div>
                  <label
                    htmlFor="min-year"
                    className="block text-base font-medium text-gray-700 mb-3"
                  >
                    From Year: {minYear}
                  </label>
                  <input
                    type="range"
                    id="min-year"
                    min="1920"
                    max="2024"
                    step="1"
                    value={minYear}
                    onChange={(e) =>
                      setMinYear(Math.min(parseInt(e.target.value), maxYear))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1920</span>
                    <span>2024</span>
                  </div>
                </div>

                <div>
                  <label
                    htmlFor="max-year"
                    className="block text-base font-medium text-gray-700 mb-3"
                  >
                    To Year: {maxYear}
                  </label>
                  <input
                    type="range"
                    id="max-year"
                    min="1920"
                    max="2024"
                    step="1"
                    value={maxYear}
                    onChange={(e) =>
                      setMaxYear(Math.max(parseInt(e.target.value), minYear))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-blue-600"
                  />
                  <div className="flex justify-between text-xs text-gray-500 mt-1">
                    <span>1920</span>
                    <span>2024</span>
                  </div>
                </div>
              </div>

              {/* Get Recommendations Button */}
              <div className="flex justify-center">
                <button
                  onClick={getRecommendations}
                  disabled={loading || selectedGenres.length === 0}
                  className={`px-8 py-4 rounded-lg text-lg font-medium ${
                    selectedGenres.length === 0
                      ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                      : "bg-gradient-to-r from-blue-600 to-indigo-600 text-white shadow-md hover:shadow-lg transition-all transform hover:scale-105"
                  }`}
                >
                  {loading ? (
                    <span className="flex items-center">
                      <LoadingSpinner size="sm" color="blue" />
                      <span className="ml-2">Finding Movies...</span>
                    </span>
                  ) : (
                    "Get Recommendations"
                  )}
                </button>
              </div>
            </div>
          </>
        ) : (
          // Results section
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900">
                {recommendations.length > 0
                  ? "Your Personalized Recommendations"
                  : "Finding movies..."}
              </h2>
              <button
                onClick={() => setRecommendations([])}
                className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 transition-colors"
              >
                Back to Options
              </button>
            </div>

            {loading ? (
              <div className="flex justify-center items-center py-12">
                <LoadingSpinner size="lg" color="blue" />
              </div>
            ) : (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
                {recommendations.map((movie) => (
                  <MovieCard key={movie.id} movie={movie} />
                ))}
              </div>
            )}
          </div>
        )}

        {/* Educational Content - Moved below the tool */}
        {!recommendations.length && !loading && (
          <div className="mt-12 space-y-8">
            {/* Educational Content */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                🤖 Advanced Movie Recommendations
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-blue-600">🧠</span>
                    How Our Recommendation Engine Works
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="text-sm sm:text-base">
                      <strong>Genre Intelligence:</strong> Our system analyzes
                      genre preferences beyond simple categories, understanding
                      subgenres and crossover appeal.
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Quality Filtering:</strong> We prioritize
                      critically acclaimed and audience-loved films based on
                      your minimum rating threshold.
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Era Matching:</strong> Time period preferences are
                      carefully considered to match your nostalgic preferences
                      or modern tastes.
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Diversity Algorithm:</strong> Results are balanced
                      to include both popular hits and hidden gems you might
                      have missed.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-indigo-600">⚡</span>
                    Why Personalized Recommendations Matter
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="text-sm sm:text-base">
                      <strong>Time Saving:</strong> Skip hours of browsing
                      through catalogs by getting targeted suggestions that
                      match your taste.
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Discovery:</strong> Find amazing films outside
                      your usual comfort zone that you'll still love.
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Quality Assurance:</strong> All recommendations
                      meet your quality standards, so you won't waste time on
                      poor films.
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Mood Optimization:</strong> Get suggestions that
                      perfectly fit your current viewing preferences and energy
                      level.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Recommendation Strategies */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                🎯 Strategic Movie Discovery Approaches
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-6 mb-4">
                    <div className="text-3xl mb-3">🌟</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Safe Discovery
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Stay within your comfort zone while discovering new
                      favorites in familiar genres.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-6 mb-4">
                    <div className="text-3xl mb-3">🚀</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Adventure Mode
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Branch out into new genres and time periods for exciting
                      cinematic adventures.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6 mb-4">
                    <div className="text-3xl mb-3">🎭</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Curator's Choice
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Focus on critically acclaimed films that have stood the
                      test of time.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
