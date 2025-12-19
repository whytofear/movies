"use client";

import { useState, useEffect } from "react";
import { Movie } from "../../../lib/supabase";
import MovieCard from "../../components/MovieCard";
import ErrorBoundary from "../../components/ErrorBoundary";
import MovieSuggestions from "../../components/MovieSuggestions";
import { getMoviesWithFilters } from "../../../lib/database";

interface SearchFilters {
  title: string;
  genres: string[];
  minRating: number;
  maxRating: number;
  minYear: number;
  maxYear: number;
  minRuntime: number;
  maxRuntime: number;
  sortBy: "rating" | "popularity" | "release_date" | "title";
  sortOrder: "asc" | "desc";
}

// Original function disabled
function _DisabledAdvancedSearchPage() {
  const [filters, setFilters] = useState<SearchFilters>({
    title: "",
    genres: [],
    minRating: 0,
    maxRating: 10,
    minYear: 1900,
    maxYear: new Date().getFullYear(),
    minRuntime: 0,
    maxRuntime: 300,
    sortBy: "popularity",
    sortOrder: "desc",
  });

  const [movies, setMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);

  // Load available genres
  useEffect(() => {
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setAvailableGenres(data.genres || []))
      .catch((err) => console.error("Error fetching genres:", err));
  }, []);

  const handleGenreToggle = (genre: string) => {
    setFilters((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const searchMovies = async () => {
    setLoading(true);
    setHasSearched(true);

    try {
      const results = await getMoviesWithFilters({
        title: filters.title || undefined,
        genres: filters.genres.length > 0 ? filters.genres : undefined,
        minRating: filters.minRating > 0 ? filters.minRating : undefined,
        maxRating: filters.maxRating < 10 ? filters.maxRating : undefined,
        minYear: filters.minYear > 1900 ? filters.minYear : undefined,
        maxYear:
          filters.maxYear < new Date().getFullYear()
            ? filters.maxYear
            : undefined,
        minRuntime: filters.minRuntime > 0 ? filters.minRuntime : undefined,
        maxRuntime: filters.maxRuntime < 300 ? filters.maxRuntime : undefined,
        sortBy: filters.sortBy,
        sortOrder: filters.sortOrder,
        limit: 100,
      });

      setMovies(results);
    } catch (error) {
      console.error("Search error:", error);
      setMovies([]);
    } finally {
      setLoading(false);
    }
  };

  const resetFilters = () => {
    setFilters({
      title: "",
      genres: [],
      minRating: 0,
      maxRating: 10,
      minYear: 1900,
      maxYear: new Date().getFullYear(),
      minRuntime: 0,
      maxRuntime: 300,
      sortBy: "popularity",
      sortOrder: "desc",
    });
    setMovies([]);
    setHasSearched(false);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              🔍 Advanced Movie Search
            </h1>
            <p className="mt-2 sm:mt-4 text-lg sm:text-xl text-emerald-100">
              Use powerful filters to find exactly the movies you're looking for
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Search Filters */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6">
              Search Filters
            </h2>

            <div className="space-y-4 sm:space-y-6">
              {/* Title Search */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Movie Title
                </label>
                <input
                  type="text"
                  value={filters.title}
                  onChange={(e) =>
                    setFilters((prev) => ({ ...prev, title: e.target.value }))
                  }
                  placeholder="Enter movie title..."
                  className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                />
              </div>

              {/* Genres */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">
                  Genres ({filters.genres.length} selected)
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2 sm:gap-3">
                  {availableGenres.map((genre) => (
                    <button
                      key={genre}
                      onClick={() => handleGenreToggle(genre)}
                      className={`px-3 py-2 text-sm rounded-lg transition-all duration-200 font-medium touch-friendly transform active:scale-95 ${
                        filters.genres.includes(genre)
                          ? "bg-emerald-600 text-white shadow-md hover:bg-emerald-700"
                          : "bg-gray-100 text-gray-700 hover:bg-gray-200 hover:shadow-sm"
                      }`}
                    >
                      {genre}
                    </button>
                  ))}
                </div>
              </div>

              {/* Rating Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Minimum Rating: {filters.minRating}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.minRating}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minRating: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Maximum Rating: {filters.maxRating}
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="10"
                    step="0.1"
                    value={filters.maxRating}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxRating: parseFloat(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Year Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    From Year: {filters.minYear}
                  </label>
                  <input
                    type="range"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={filters.minYear}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minYear: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    To Year: {filters.maxYear}
                  </label>
                  <input
                    type="range"
                    min="1900"
                    max={new Date().getFullYear()}
                    value={filters.maxYear}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxYear: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Runtime Range */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Min Runtime: {filters.minRuntime} minutes
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={filters.minRuntime}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        minRuntime: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Max Runtime: {filters.maxRuntime} minutes
                  </label>
                  <input
                    type="range"
                    min="0"
                    max="300"
                    value={filters.maxRuntime}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        maxRuntime: parseInt(e.target.value),
                      }))
                    }
                    className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>
              </div>

              {/* Sort Options */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={filters.sortBy}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortBy: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 sm:py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="popularity">Popularity</option>
                    <option value="rating">Rating</option>
                    <option value="release_date">Release Date</option>
                    <option value="title">Title</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort Order
                  </label>
                  <select
                    value={filters.sortOrder}
                    onChange={(e) =>
                      setFilters((prev) => ({
                        ...prev,
                        sortOrder: e.target.value as any,
                      }))
                    }
                    className="w-full px-3 py-2 sm:py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
                  >
                    <option value="desc">Highest First</option>
                    <option value="asc">Lowest First</option>
                  </select>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 pt-4">
                <button
                  onClick={searchMovies}
                  disabled={loading}
                  className="bg-emerald-600 text-white px-6 py-3 sm:py-3 rounded-lg hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 font-medium flex items-center justify-center space-x-2 touch-friendly transform active:scale-95 flex-1 sm:flex-none"
                >
                  {loading && (
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent"></div>
                  )}
                  <span>{loading ? "Searching..." : "🔍 Search Movies"}</span>
                </button>

                <button
                  onClick={resetFilters}
                  className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all duration-200 font-medium touch-friendly transform active:scale-95 flex-1 sm:flex-none"
                >
                  Reset Filters
                </button>
              </div>
            </div>
          </div>

          {/* Results */}
          {hasSearched && (
            <div className="bg-white rounded-xl shadow-md p-4 sm:p-6">
              <h3 className="text-lg sm:text-xl font-bold text-gray-900 mb-4">
                {loading ? "Searching..." : `${movies.length} Results Found`}
              </h3>

              {movies.length > 0 ? (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                    {movies.map((movie) => (
                      <MovieCard key={movie.id} movie={movie} />
                    ))}
                  </div>

                  {/* Movie Suggestions */}
                  <div className="mt-8 sm:mt-12">
                    <MovieSuggestions
                      currentMovie={movies[0]}
                      limit={6}
                      className="suggestions"
                    />
                  </div>
                </>
              ) : !loading ? (
                <div className="text-center py-8 sm:py-12">
                  <div className="text-4xl mb-4">🎭</div>
                  <h4 className="text-lg font-medium text-gray-900 mb-2">
                    No movies found
                  </h4>
                  <p className="text-gray-600">
                    Try adjusting your search filters to find more results.
                  </p>
                </div>
              ) : null}
            </div>
          )}

          {/* Search Tips */}
          {!hasSearched && (
            <div className="bg-gradient-to-r from-emerald-50 to-teal-50 rounded-xl p-4 sm:p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎯 Search Tips
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    🎬 Genre Filtering
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Select multiple genres to find movies that match any of
                    them. Great for discovering crossover films.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    ⭐ Rating Range
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Use rating filters to find hidden gems (6-7) or critically
                    acclaimed masterpieces (8+).
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    📅 Time Periods
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Explore different eras of cinema from classic Hollywood to
                    modern blockbusters.
                  </p>
                </div>
                <div>
                  <h4 className="font-medium text-gray-900 mb-2">
                    ⏱️ Runtime Control
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Find quick watches under 90 minutes or epic experiences over
                    2.5 hours.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}

// New exported function that replaces the original
import Link from "next/link";
export default function AdvancedSearchPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-gray-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              🔍 Advanced Search Guide
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-gray-100 max-w-3xl mx-auto">
              Learn powerful search techniques and discover our alternative tools for finding your perfect movie
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* Status Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center gap-3">
            <div className="text-yellow-600 text-2xl">⚠️</div>
            <div>
              <h2 className="text-lg font-semibold text-yellow-800 mb-2">Advanced Search Temporarily Unavailable</h2>
              <p className="text-yellow-700 mb-4">
                Our advanced search tool is currently under maintenance to bring you an even better experience. 
                Meanwhile, discover our powerful alternative search methods below.
              </p>
              <Link
                href="/search"
                className="bg-yellow-600 text-white px-4 py-2 rounded-lg hover:bg-yellow-700 transition-colors inline-block"
              >
                Try Our Main Search →
              </Link>
            </div>
          </div>
        </div>

        {/* Alternative Search Methods */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            🛠️ Powerful Alternative Search Tools
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link href="/search" className="group">
              <div className="bg-gradient-to-br from-blue-100 to-indigo-100 rounded-lg p-6 border border-blue-200 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <div className="text-3xl mb-3">🔍</div>
                <h3 className="font-semibold text-gray-900 mb-2">Smart Search</h3>
                <p className="text-gray-600 text-sm">
                  Intelligent search with auto-suggestions and real-time results
                </p>
              </div>
            </Link>

            <Link href="/tools/movie-recommender" className="group">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6 border border-purple-200 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <div className="text-3xl mb-3">🎯</div>
                <h3 className="font-semibold text-gray-900 mb-2">AI Recommender</h3>
                <p className="text-gray-600 text-sm">
                  Personalized recommendations based on genres, ratings, and years
                </p>
              </div>
            </Link>

            <Link href="/tools/mood-finder" className="group">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-6 border border-green-200 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <div className="text-3xl mb-3">🎭</div>
                <h3 className="font-semibold text-gray-900 mb-2">Mood Finder</h3>
                <p className="text-gray-600 text-sm">
                  Find movies based on your current emotional state
                </p>
              </div>
            </Link>

            <Link href="/tools/random-movie" className="group">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-6 border border-yellow-200 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <div className="text-3xl mb-3">🎲</div>
                <h3 className="font-semibold text-gray-900 mb-2">Random Discovery</h3>
                <p className="text-gray-600 text-sm">
                  Discover movies with smart randomization and filters
                </p>
              </div>
            </Link>

            <Link href="/genres" className="group">
              <div className="bg-gradient-to-br from-red-100 to-rose-100 rounded-lg p-6 border border-red-200 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <div className="text-3xl mb-3">🎬</div>
                <h3 className="font-semibold text-gray-900 mb-2">Genre Explorer</h3>
                <p className="text-gray-600 text-sm">
                  Browse comprehensive genre-based movie collections
                </p>
              </div>
            </Link>

            <Link href="/movies" className="group">
              <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg p-6 border border-indigo-200 hover:shadow-lg transition-all duration-200 transform hover:scale-105">
                <div className="text-3xl mb-3">📊</div>
                <h3 className="font-semibold text-gray-900 mb-2">Curated Lists</h3>
                <p className="text-gray-600 text-sm">
                  Popular, recent, and top-rated movie collections
                </p>
              </div>
            </Link>
          </div>
        </div>

        {/* Advanced Search Techniques */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            🎓 Master Advanced Search Techniques
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-blue-600">🔤</span>
                Smart Search Strategies
              </h3>
              <div className="space-y-3 text-gray-600">
                <p className="text-sm sm:text-base">
                  <strong>Partial Matching:</strong> Type part of a movie title, actor name, or director to get intelligent suggestions.
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Year Searches:</strong> Include years in your search (e.g., "comedy 2020") to find movies from specific periods.
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Genre Keywords:</strong> Use genre terms combined with descriptors (e.g., "sci-fi thriller").
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Quality Indicators:</strong> Search for "best," "top-rated," or "acclaimed" to find quality films.
                </p>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <span className="text-purple-600">🎯</span>
                Precision Search Tips
              </h3>
              <div className="space-y-3 text-gray-600">
                <p className="text-sm sm:text-base">
                  <strong>Multiple Keywords:</strong> Combine movie elements like "space adventure comedy" for specific results.
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Franchise Searches:</strong> Search for series names like "Marvel," "Star Wars," or "Fast and Furious."
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Mood-Based Terms:</strong> Use emotional keywords like "heartwarming," "intense," or "mind-bending."
                </p>
                <p className="text-sm sm:text-base">
                  <strong>Cultural Context:</strong> Include country or culture terms like "Japanese horror" or "British comedy."
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Search Workflow */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            🗺️ Efficient Movie Discovery Workflow
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="text-center">
              <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-6 mb-4">
                <div className="text-3xl mb-3">1️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Define Intent</h3>
                <p className="text-gray-600 text-sm">
                  Know if you want comfort viewing, discovery, or something specific
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-6 mb-4">
                <div className="text-3xl mb-3">2️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Choose Method</h3>
                <p className="text-gray-600 text-sm">
                  Select the right tool based on your mood and preferences
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6 mb-4">
                <div className="text-3xl mb-3">3️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Refine Results</h3>
                <p className="text-gray-600 text-sm">
                  Use filters and additional searches to narrow down options
                </p>
              </div>
            </div>

            <div className="text-center">
              <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-6 mb-4">
                <div className="text-3xl mb-3">4️⃣</div>
                <h3 className="font-semibold text-gray-900 mb-2">Explore Similar</h3>
                <p className="text-gray-600 text-sm">
                  Use "Similar Movies" feature to discover related films
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Future Features */}
        <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
            🚀 Coming Soon: Enhanced Advanced Search
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl mb-3">🎛️</div>
              <h3 className="font-semibold text-gray-900 mb-2">Multi-Filter Interface</h3>
              <p className="text-gray-600 text-sm">
                Combine genre, rating, year, runtime, and mood filters in one powerful interface
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">🤖</div>
              <h3 className="font-semibold text-gray-900 mb-2">AI-Powered Queries</h3>
              <p className="text-gray-600 text-sm">
                Natural language search like "funny movies from the 90s with good ratings"
              </p>
            </div>
            <div>
              <div className="text-3xl mb-3">📈</div>
              <h3 className="font-semibold text-gray-900 mb-2">Advanced Analytics</h3>
              <p className="text-gray-600 text-sm">
                Detailed statistics and trends based on your search preferences
              </p>
            </div>
          </div>

          <div className="text-center mt-8">
            <Link
              href="/tools"
              className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors inline-block font-medium"
            >
              Explore All Available Tools
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
