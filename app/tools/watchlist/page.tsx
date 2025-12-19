"use client";

import { useState, useEffect } from "react";
import { Movie } from "../../../lib/supabase";
import MovieCard from "../../components/MovieCard";
import ErrorBoundary from "../../components/ErrorBoundary";
import MovieSuggestions from "../../components/MovieSuggestions";
import { searchMovies } from "../../../lib/database";
import Link from "next/link";

export default function WatchlistPage() {
  const [watchlist, setWatchlist] = useState<Movie[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [showSearch, setShowSearch] = useState(false);

  // Load watchlist from localStorage on component mount
  useEffect(() => {
    const saved = localStorage.getItem("movieWatchlist");
    if (saved) {
      try {
        setWatchlist(JSON.parse(saved));
      } catch (error) {
        console.error("Error loading watchlist:", error);
        localStorage.removeItem("movieWatchlist");
      }
    }
  }, []);

  // Save watchlist to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem("movieWatchlist", JSON.stringify(watchlist));
  }, [watchlist]);

  // Search for movies with debounce
  useEffect(() => {
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    const timeoutId = setTimeout(async () => {
      setIsSearching(true);
      try {
        const results = await searchMovies(searchQuery, 10);
        setSearchResults(results);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchQuery]);

  const addToWatchlist = (movie: Movie) => {
    if (!watchlist.find((m) => m.id === movie.id)) {
      setWatchlist((prev) => [...prev, movie]);
      setSearchQuery("");
      setSearchResults([]);
    }
  };

  const removeFromWatchlist = (movieId: number) => {
    setWatchlist((prev) => prev.filter((m) => m.id !== movieId));
  };

  const clearWatchlist = () => {
    if (confirm("Are you sure you want to clear your entire watchlist?")) {
      setWatchlist([]);
    }
  };

  const exportWatchlist = () => {
    const watchlistText = watchlist
      .map(
        (movie) =>
          `${movie.title} (${new Date(movie.release_date).getFullYear()})`
      )
      .join("\n");

    const blob = new Blob([watchlistText], { type: "text/plain" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "my-movie-watchlist.txt";
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gray-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-violet-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold">
              📋 My Watchlist
            </h1>
            <p className="mt-2 sm:mt-4 text-lg sm:text-xl text-violet-100">
              Save movies to watch later and organize your film discoveries
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {/* Controls */}
          <div className="bg-white rounded-xl shadow-md p-4 sm:p-6 mb-6 sm:mb-8">
            <div className="flex flex-col gap-4">
              <div>
                <h2 className="text-lg sm:text-xl font-bold text-gray-900">
                  {watchlist.length}{" "}
                  {watchlist.length === 1 ? "Movie" : "Movies"} in Watchlist
                </h2>
                <p className="text-sm sm:text-base text-gray-600">
                  {watchlist.length === 0
                    ? "Start building your watchlist by adding movies below"
                    : "Your saved movies for future viewing"}
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3">
                <button
                  onClick={() => setShowSearch(!showSearch)}
                  className="bg-violet-600 text-white px-4 py-3 rounded-lg hover:bg-violet-700 transition-all duration-200 font-medium touch-friendly transform active:scale-95 flex-1 sm:flex-none"
                >
                  {showSearch ? "Hide Search" : "Add Movies"}
                </button>

                {watchlist.length > 0 && (
                  <>
                    <button
                      onClick={exportWatchlist}
                      className="bg-green-600 text-white px-4 py-3 rounded-lg hover:bg-green-700 transition-all duration-200 font-medium touch-friendly transform active:scale-95 flex-1 sm:flex-none"
                    >
                      Export List
                    </button>

                    <button
                      onClick={clearWatchlist}
                      className="bg-red-600 text-white px-4 py-3 rounded-lg hover:bg-red-700 transition-all duration-200 font-medium touch-friendly transform active:scale-95 flex-1 sm:flex-none"
                    >
                      Clear All
                    </button>
                  </>
                )}
              </div>
            </div>

            {/* Search Section */}
            {showSearch && (
              <div className="mt-4 sm:mt-6 pt-4 sm:pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Search Movies to Add
                </h3>

                <div className="relative">
                  <input
                    type="text"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    placeholder="Search for movies to add to watchlist..."
                    className="w-full px-3 sm:px-4 py-2 sm:py-3 text-base border border-gray-300 rounded-lg focus:ring-2 focus:ring-violet-500 focus:border-transparent"
                  />

                  {isSearching && (
                    <div className="absolute right-3 top-2 sm:top-3">
                      <div className="animate-spin rounded-full h-4 w-4 border-2 border-violet-600 border-t-transparent"></div>
                    </div>
                  )}
                </div>

                {/* Search Results */}
                {searchResults.length > 0 && (
                  <div className="mt-4">
                    <h4 className="font-medium text-gray-900 mb-3">
                      Search Results
                    </h4>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                      {searchResults.map((movie) => {
                        const isInWatchlist = watchlist.find(
                          (m) => m.id === movie.id
                        );
                        return (
                          <div
                            key={movie.id}
                            className="bg-gray-50 rounded-lg p-3 sm:p-4 border border-gray-200"
                          >
                            <h5 className="font-medium text-gray-900 mb-1 text-sm sm:text-base">
                              {movie.title}
                            </h5>
                            <p className="text-xs sm:text-sm text-gray-600 mb-2">
                              {new Date(movie.release_date).getFullYear()} • ⭐{" "}
                              {movie.vote_average.toFixed(1)}
                            </p>
                            <button
                              onClick={() => addToWatchlist(movie)}
                              disabled={!!isInWatchlist}
                              className={`w-full px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 touch-friendly transform active:scale-95 ${
                                isInWatchlist
                                  ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                                  : "bg-violet-600 text-white hover:bg-violet-700"
                              }`}
                            >
                              {isInWatchlist
                                ? "Already Added"
                                : "Add to Watchlist"}
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Watchlist Display */}
          {watchlist.length > 0 ? (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {watchlist.map((movie) => (
                  <div key={movie.id} className="relative">
                    {/* Remove Button */}
                    <button
                      onClick={() => removeFromWatchlist(movie.id)}
                      className="absolute top-2 right-2 z-10 bg-red-600 text-white rounded-full w-7 h-7 sm:w-8 sm:h-8 flex items-center justify-center hover:bg-red-700 transition-all duration-200 text-xs sm:text-sm font-bold touch-friendly transform active:scale-95 shadow-md"
                      title="Remove from watchlist"
                    >
                      ✕
                    </button>

                    <MovieCard movie={movie} />
                  </div>
                ))}
              </div>

              {/* Movie Suggestions */}
              <div className="mt-8 sm:mt-12">
                <MovieSuggestions
                  currentMovie={watchlist[0]}
                  limit={6}
                  className="suggestions"
                />
              </div>
            </>
          ) : !showSearch ? (
            /* Empty State */
            <div className="text-center py-12 sm:py-16">
              <div className="text-5xl sm:text-6xl mb-4 sm:mb-6">🎬</div>
              <h3 className="text-lg sm:text-xl font-medium text-gray-900 mb-2">
                Your Watchlist is Empty
              </h3>
              <p className="text-sm sm:text-base text-gray-600 mb-6 sm:mb-8 max-w-md mx-auto px-4">
                Start adding movies you want to watch later. Build your personal
                collection of films to discover.
              </p>

              <div className="space-y-4 px-4">
                <button
                  onClick={() => setShowSearch(true)}
                  className="bg-violet-600 text-white px-6 py-3 rounded-lg hover:bg-violet-700 transition-all duration-200 font-medium touch-friendly transform active:scale-95"
                >
                  Add Your First Movie
                </button>

                <div className="text-xs sm:text-sm text-gray-500">
                  Or explore our{" "}
                  <Link
                    href="/tools"
                    className="text-violet-600 hover:text-violet-700 font-medium"
                  >
                    movie discovery tools
                  </Link>
                </div>
              </div>
            </div>
          ) : null}

          {/* Features Info */}
          <div className="mt-12 sm:mt-16 bg-gradient-to-r from-violet-50 to-purple-50 rounded-xl p-4 sm:p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              🌟 Watchlist Features
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">💾 Auto-Save</h4>
                <p className="text-gray-600 text-sm">
                  Your watchlist is automatically saved to your browser and
                  persists between visits.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">📤 Export</h4>
                <p className="text-gray-600 text-sm">
                  Export your watchlist as a text file to share or backup your
                  movie collection.
                </p>
              </div>
              <div>
                <h4 className="font-medium text-gray-900 mb-2">
                  🔍 Quick Search
                </h4>
                <p className="text-gray-600 text-sm">
                  Easily search and add movies from our database with instant
                  results.
                </p>
              </div>
            </div>
          </div>

          {/* Enhanced Content Sections */}
          <div className="mt-12 sm:mt-16 space-y-8 sm:space-y-12">
            {/* Why Use a Watchlist */}
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">🎯</div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Why Use a Movie Watchlist?
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    📚 Never Forget Great Recommendations
                  </h3>
                  <p className="text-gray-600 mb-4">
                    How many times have you heard about an amazing movie, only to
                    completely forget about it later? A watchlist captures those
                    golden recommendations from friends, critics, and discovery
                    sessions.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Save movies mentioned in conversations</li>
                    <li>• Track festival award winners</li>
                    <li>• Remember critic recommendations</li>
                    <li>• Collect social media discoveries</li>
                  </ul>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🧠 Reduce Decision Fatigue
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Eliminate the "What should we watch?" dilemma. With a curated
                    watchlist, you'll always have quality options ready for any
                    mood or occasion.
                  </p>
                  <ul className="space-y-2 text-sm text-gray-600">
                    <li>• Pre-vetted quality selections</li>
                    <li>• Options for different moods</li>
                    <li>• No more endless browsing</li>
                    <li>• Perfect for spontaneous viewing</li>
                  </ul>
                </div>
              </div>

              <div className="bg-violet-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-3">
                  💡 Pro Tip: Strategic Watchlist Building
                </h3>
                <p className="text-gray-600 text-sm">
                  Aim for a diverse mix of 15-25 movies covering different
                  genres, decades, and moods. This ensures you'll always have the
                  perfect option whether you want comedy, drama, action, or
                  something completely unexpected.
                </p>
              </div>
            </div>

            {/* Watchlist Organization Strategies */}
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">📋</div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Smart Watchlist Organization
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div className="bg-blue-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-blue-600">🎭</span>
                    By Mood & Genre
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Organize movies by the experience you're seeking:
                  </p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• Feel-good comedies for rough days</li>
                    <li>• Thought-provoking dramas for reflection</li>
                    <li>• Action thrillers for energy</li>
                    <li>• Documentaries for learning moods</li>
                  </ul>
                </div>

                <div className="bg-green-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-green-600">⏰</span>
                    By Time Available
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Sort by viewing time for different occasions:
                  </p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• Quick watches (under 90 minutes)</li>
                    <li>• Standard films (90-120 minutes)</li>
                    <li>• Epic experiences (2+ hours)</li>
                    <li>• Series for binge sessions</li>
                  </ul>
                </div>

                <div className="bg-purple-50 rounded-lg p-6">
                  <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                    <span className="text-purple-600">🎯</span>
                    By Priority Level
                  </h3>
                  <p className="text-gray-600 text-sm mb-3">
                    Rank by urgency and excitement:
                  </p>
                  <ul className="space-y-1 text-xs text-gray-600">
                    <li>• Must-watch immediately</li>
                    <li>• High priority when possible</li>
                    <li>• Casual interest</li>
                    <li>• Someday maybe</li>
                  </ul>
                </div>
              </div>

              <div className="bg-gray-50 rounded-lg p-6">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🔄 Watchlist Maintenance Tips
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Regular Reviews
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Monthly cleanup removes outdated interests and keeps your list
                      fresh and relevant.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Size Management
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Keep 15-30 movies max. Too many choices can be overwhelming
                      and defeat the purpose.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Diversity Balance
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Mix old and new, different genres, and various countries for a
                      well-rounded selection.
                    </p>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      Context Notes
                    </h4>
                    <p className="text-gray-600 text-sm">
                      Remember why you added each movie - friend's recommendation,
                      award winner, etc.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Watchlist Viewing Strategies */}
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">🎬</div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Effective Viewing Strategies
                </h2>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-violet-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🎲 The Random Selection Method
                  </h3>
                  <p className="text-gray-600 mb-3">
                    When overwhelmed by choices, pick randomly from your top 5-10
                    options. This eliminates decision paralysis and often leads to
                    delightful surprises.
                  </p>
                  <div className="bg-gray-50 rounded-lg p-4">
                    <p className="text-sm text-gray-600">
                      <strong>Try this:</strong> Close your eyes and scroll through
                      your watchlist, stopping randomly. Watch whatever you land on
                      - no take-backs!
                    </p>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    📅 Themed Viewing Sessions
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Create mini film festivals from your watchlist by grouping
                    movies around themes, directors, actors, or time periods.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Director Spotlights
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Watch 2-3 films by the same director to understand their
                        style and evolution.
                      </p>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Decade Deep Dives
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Explore the cultural context of different eras through their
                        cinema.
                      </p>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🎯 Priority-Based Watching
                  </h3>
                  <p className="text-gray-600 mb-3">
                    Tackle your highest-priority films first, especially
                    time-sensitive ones (leaving streaming services, limited
                    releases, etc.).
                  </p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-700">
                      <strong>Weekly Goal:</strong> Watch at least one high-priority
                      film per week to keep your list fresh and ensure you don't
                      miss important releases.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Advanced Watchlist Features */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">⚡</div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Maximize Your Watchlist Experience
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl mb-2">📊</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Track Progress
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Keep notes on what you've watched and your thoughts for future
                      reference.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl mb-2">👥</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Share Lists
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Export and share your watchlist with friends for group viewing
                      sessions.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl mb-2">🔄</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Regular Updates
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Refresh your list monthly with new discoveries and remove watched
                      films.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-white rounded-lg p-4 shadow-sm">
                    <div className="text-2xl mb-2">🎨</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Mood Matching
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Organize by emotional needs - what mood are you in right now?
                    </p>
                  </div>
                </div>
              </div>

              <div className="mt-8 bg-white rounded-lg p-6 border border-indigo-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                  <span className="text-indigo-600">🏆</span>
                  Watchlist Success Metrics
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
                  <div>
                    <div className="text-2xl font-bold text-indigo-600">80%+</div>
                    <p className="text-sm text-gray-600">
                      Completion rate for optimal list management
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-green-600">2-3</div>
                    <p className="text-sm text-gray-600">
                      New additions per week keeps it fresh
                    </p>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-purple-600">15-25</div>
                    <p className="text-sm text-gray-600">
                      Ideal watchlist size for manageable choice
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
