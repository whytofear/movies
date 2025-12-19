"use client";

import { useState, useEffect } from "react";
import { Movie } from "../../../lib/supabase";
import MovieCard from "../../components/MovieCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorBoundary from "../../components/ErrorBoundary";
import { searchMovies } from "../../../lib/database";
import {
  getSharedGenres,
  getYear,
  formatRevenue,
  formatVoteCount,
} from "../../../lib/utils";

export default function MovieComparisonPage() {
  const [movie1, setMovie1] = useState<Movie | null>(null);
  const [movie2, setMovie2] = useState<Movie | null>(null);
  const [search1, setSearch1] = useState("");
  const [search2, setSearch2] = useState("");
  const [searchResults1, setSearchResults1] = useState<Movie[]>([]);
  const [searchResults2, setSearchResults2] = useState<Movie[]>([]);
  const [loading1, setLoading1] = useState(false);
  const [loading2, setLoading2] = useState(false);

  // Search debounce for movie 1
  useEffect(() => {
    if (search1.length < 2) {
      setSearchResults1([]);
      return;
    }

    const delaySearch = setTimeout(async () => {
      setLoading1(true);
      try {
        const results = await searchMovies(search1, 10);
        setSearchResults1(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading1(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [search1]);

  // Search debounce for movie 2
  useEffect(() => {
    if (search2.length < 2) {
      setSearchResults2([]);
      return;
    }

    const delaySearch = setTimeout(async () => {
      setLoading2(true);
      try {
        const results = await searchMovies(search2, 10);
        setSearchResults2(results);
      } catch (error) {
        console.error("Search error:", error);
      } finally {
        setLoading2(false);
      }
    }, 300);

    return () => clearTimeout(delaySearch);
  }, [search2]);

  const selectMovie1 = (movie: Movie) => {
    setMovie1(movie);
    setSearch1(movie.title);
    setSearchResults1([]);
  };

  const selectMovie2 = (movie: Movie) => {
    setMovie2(movie);
    setSearch2(movie.title);
    setSearchResults2([]);
  };

  const clearComparison = () => {
    setMovie1(null);
    setMovie2(null);
    setSearch1("");
    setSearch2("");
    setSearchResults1([]);
    setSearchResults2([]);
  };

  const sharedGenres = movie1 && movie2 ? getSharedGenres(movie1, movie2) : [];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-cyan-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
            ⚖️ Movie Comparison Tool
          </h1>
          <p className="mt-2 sm:mt-4 text-lg sm:text-xl text-cyan-100">
            Compare two movies side-by-side to see their similarities and
            differences
          </p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          {/* Comparison Tool */}
          <div className="bg-white rounded-lg shadow-lg p-6 mb-12">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* First Movie Search */}
              <div>
                <label
                  htmlFor="movie1-search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  First Movie
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="movie1-search"
                    value={search1}
                    onChange={(e) => setSearch1(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                    placeholder="Search for a movie..."
                  />
                  {loading1 && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <LoadingSpinner size="sm" color="blue" />
                    </div>
                  )}
                </div>
                {/* Search Results */}
                {searchResults1.length > 0 && (
                  <ul className="mt-2 max-h-72 overflow-auto rounded-md bg-white shadow-md z-10 border border-gray-200">
                    {searchResults1.map((movie) => (
                      <li
                        key={movie.id}
                        onClick={() => selectMovie1(movie)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                      >
                        {(movie.poster_path || movie.posterurl) && (
                          <img
                            src={
                              (
                                movie.poster_path || movie.posterurl
                              )?.startsWith("http")
                                ? movie.poster_path || movie.posterurl
                                : `https://image.tmdb.org/t/p/w92${
                                    movie.poster_path || movie.posterurl
                                  }`
                            }
                            alt={movie.title}
                            className="w-8 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{movie.title}</div>
                          <div className="text-xs text-gray-500">
                            {getYear(movie.release_date)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>

              {/* Second Movie Search */}
              <div>
                <label
                  htmlFor="movie2-search"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Second Movie
                </label>
                <div className="relative">
                  <input
                    type="text"
                    id="movie2-search"
                    value={search2}
                    onChange={(e) => setSearch2(e.target.value)}
                    className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 pr-10"
                    placeholder="Search for a movie..."
                  />
                  {loading2 && (
                    <div className="absolute inset-y-0 right-0 flex items-center pr-3">
                      <LoadingSpinner size="sm" color="blue" />
                    </div>
                  )}
                </div>
                {/* Search Results */}
                {searchResults2.length > 0 && (
                  <ul className="mt-2 max-h-72 overflow-auto rounded-md bg-white shadow-md z-10 border border-gray-200">
                    {searchResults2.map((movie) => (
                      <li
                        key={movie.id}
                        onClick={() => selectMovie2(movie)}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer flex items-center space-x-2"
                      >
                        {(movie.poster_path || movie.posterurl) && (
                          <img
                            src={
                              (
                                movie.poster_path || movie.posterurl
                              )?.startsWith("http")
                                ? movie.poster_path || movie.posterurl
                                : `https://image.tmdb.org/t/p/w92${
                                    movie.poster_path || movie.posterurl
                                  }`
                            }
                            alt={movie.title}
                            className="w-8 h-12 object-cover rounded"
                          />
                        )}
                        <div>
                          <div className="font-medium">{movie.title}</div>
                          <div className="text-xs text-gray-500">
                            {getYear(movie.release_date)}
                          </div>
                        </div>
                      </li>
                    ))}
                  </ul>
                )}
              </div>
            </div>

            {/* Comparison Results */}
            {movie1 && movie2 ? (
              <div className="mt-8">
                <div className="flex justify-between mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Comparison Results
                  </h2>
                  <button
                    onClick={clearComparison}
                    className="px-4 py-2 bg-gray-100 text-gray-600 rounded-md hover:bg-gray-200"
                  >
                    Clear Comparison
                  </button>
                </div>

                {/* Comparison cards */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  {movie1 && <MovieCard movie={movie1} />}
                  {movie2 && <MovieCard movie={movie2} />}
                </div>

                {/* Detailed Comparison */}
                <div className="overflow-hidden border-b border-gray-200 shadow rounded-lg">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"
                        >
                          Comparison
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"
                        >
                          {movie1.title}
                        </th>
                        <th
                          scope="col"
                          className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-1/3"
                        >
                          {movie2.title}
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {/* Rating comparison */}
                      <tr>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                          Rating
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ⭐ {movie1.vote_average.toFixed(1)}/10
                          {movie1.vote_average > movie2.vote_average && (
                            <span className="ml-2 text-green-600 font-medium">
                              🏆 Higher rated
                            </span>
                          )}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                          ⭐ {movie2.vote_average.toFixed(1)}/10
                          {movie2.vote_average > movie1.vote_average && (
                            <span className="ml-2 text-green-600 font-medium">
                              🏆 Higher rated
                            </span>
                          )}
                        </td>
                      </tr>

                      {/* Add other comparison rows as needed */}
                    </tbody>
                  </table>
                </div>
              </div>
            ) : (
              <div className="mt-8 text-center py-12">
                <div className="text-6xl mb-4">⚖️</div>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  Search and select two movies to compare
                </h3>
                <p className="text-gray-600 max-w-md mx-auto">
                  Use the search boxes above to find movies you want to compare
                  side-by-side.
                </p>
              </div>
            )}
          </div>

          {/* Educational Content - Moved below the tool */}
          <div className="mt-12 space-y-16">
            {/* Why Compare Movies */}
            <div className="bg-white py-16 rounded-lg shadow-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    Why Compare Movies?
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Movie comparison helps you make informed viewing decisions,
                    understand different approaches to similar themes, and
                    discover what makes each film unique.
                  </p>
                </div>

                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="w-16 h-16 bg-cyan-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🤔</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Smart Decision Making
                    </h3>
                    <p className="text-gray-600">
                      Compare ratings, genres, and themes to choose the perfect
                      movie for your mood and preferences.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🎭</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Understanding Cinema
                    </h3>
                    <p className="text-gray-600">
                      Analyze different directorial styles, acting approaches,
                      and storytelling techniques across similar films.
                    </p>
                  </div>

                  <div className="text-center">
                    <div className="w-16 h-16 bg-indigo-100 rounded-full flex items-center justify-center mx-auto mb-4">
                      <span className="text-2xl">🔍</span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3">
                      Discovery Tool
                    </h3>
                    <p className="text-gray-600">
                      Use comparisons to identify patterns in your preferences
                      and discover new films that match your taste.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* How to Use This Tool */}
            <div className="bg-gray-50 py-16 rounded-lg shadow-md">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                <div className="text-center mb-12">
                  <h2 className="text-3xl font-bold text-gray-900 mb-4">
                    How to Use the Comparison Tool
                  </h2>
                  <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                    Get the most out of movie comparisons with these expert tips
                    and strategies.
                  </p>
                </div>

                <div className="grid md:grid-cols-2 gap-8">
                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-2xl mr-3">📝</span>
                      Step-by-Step Guide
                    </h3>
                    <ol className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold">
                          1
                        </span>
                        <span>
                          Search for your first movie using the search box above
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold">
                          2
                        </span>
                        <span>Select the movie from the dropdown results</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold">
                          3
                        </span>
                        <span>Repeat the process for your second movie</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold">
                          4
                        </span>
                        <span>Review the detailed side-by-side comparison</span>
                      </li>
                      <li className="flex items-start">
                        <span className="bg-cyan-500 text-white rounded-full w-6 h-6 flex items-center justify-center mr-3 mt-0.5 text-sm font-bold">
                          5
                        </span>
                        <span>
                          Use the insights to make your viewing decision
                        </span>
                      </li>
                    </ol>
                  </div>

                  <div className="bg-white rounded-lg p-6 shadow-md">
                    <h3 className="text-xl font-semibold text-gray-900 mb-4 flex items-center">
                      <span className="text-2xl mr-3">💡</span>
                      Comparison Tips
                    </h3>
                    <ul className="space-y-3 text-gray-600">
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>
                          Compare movies within the same genre for style
                          differences
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>
                          Look at ratings to gauge critical and audience
                          reception
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>Check runtime to plan your viewing session</span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>
                          Notice shared genres to understand thematic
                          similarities
                        </span>
                      </li>
                      <li className="flex items-start">
                        <span className="text-blue-500 mr-2">•</span>
                        <span>
                          Compare release years to see how cinema has evolved
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </ErrorBoundary>
      </div>
    </div>
  );
}
