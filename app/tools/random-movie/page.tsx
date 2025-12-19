"use client";

import { useState, useEffect } from "react";
import { Movie } from "../../../lib/supabase";
import { slugify } from "../../../lib/utils";
import MovieCard from "../../components/MovieCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorBoundary from "../../components/ErrorBoundary";
import MovieSuggestions from "../../components/MovieSuggestions";
import Link from "next/link";

interface RandomFilters {
  genre?: string;
  minRating: number;
  minYear: number;
  maxYear: number;
  excludeAdult: boolean;
}

export default function RandomMoviePage() {
  const [movie, setMovie] = useState<Movie | null>(null);
  const [loading, setLoading] = useState(false);
  const [filters, setFilters] = useState<RandomFilters>({
    minRating: 6.0,
    minYear: 1990,
    maxYear: 2024,
    excludeAdult: true,
  });

  const [showFilters, setShowFilters] = useState(false);
  const [history, setHistory] = useState<Movie[]>([]);

  const genres = [
    "Action",
    "Adventure",
    "Animation",
    "Comedy",
    "Crime",
    "Documentary",
    "Drama",
    "Family",
    "Fantasy",
    "History",
    "Horror",
    "Music",
    "Mystery",
    "Romance",
    "Science Fiction",
    "TV Movie",
    "Thriller",
    "War",
    "Western",
  ];

  const getRandomMovie = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/random-movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(filters),
      });

      const data = await response.json();
      if (data.movie) {
        setMovie(data.movie);
        setHistory((prev) => [data.movie, ...prev.slice(0, 9)]); // Keep last 10
      }
    } catch (error) {
      console.error("Error getting random movie:", error);
    } finally {
      setLoading(false);
    }
  };

  const rollDice = () => {
    // Add some fun animation delay
    setMovie(null);
    setTimeout(getRandomMovie, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <h1 className="text-4xl font-bold flex items-center">
            🎲 Random Movie Generator
          </h1>
          <p className="mt-4 text-xl text-green-100">
            Can't decide what to watch? Let the dice decide for you!
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <ErrorBoundary>
          {/* Controls */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-8">
            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
              <div className="flex gap-4">
                <button
                  onClick={rollDice}
                  disabled={loading}
                  className="bg-green-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-green-700 disabled:bg-gray-400 transition-colors flex items-center gap-2"
                >
                  {loading ? (
                    <>
                      <div className="animate-spin w-5 h-5 border-2 border-white border-t-transparent rounded-full"></div>
                      Rolling...
                    </>
                  ) : (
                    <>
                      <span className="text-xl">🎲</span>
                      Roll the Dice!
                    </>
                  )}
                </button>

                <button
                  onClick={() => setShowFilters(!showFilters)}
                  className="bg-gray-100 text-gray-700 px-4 py-3 rounded-lg font-medium hover:bg-gray-200 transition-colors"
                >
                  ⚙️ Filters
                </button>
              </div>

              {movie && (
                <Link
                  href={`/similar-to/${movie.slug || slugify(movie.title)}`}
                  className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Find Similar Movies →
                </Link>
              )}
            </div>

            {/* Filters Panel */}
            {showFilters && (
              <div className="mt-6 pt-6 border-t border-gray-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  Filter Options
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {/* Genre */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Genre (Optional)
                    </label>
                    <select
                      value={filters.genre || ""}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          genre: e.target.value || undefined,
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    >
                      <option value="">Any Genre</option>
                      {genres.map((genre) => (
                        <option key={genre} value={genre}>
                          {genre}
                        </option>
                      ))}
                    </select>
                  </div>

                  {/* Min Rating */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      Min Rating: {filters.minRating}
                    </label>
                    <input
                      type="range"
                      min="1"
                      max="10"
                      step="0.5"
                      value={filters.minRating}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minRating: parseFloat(e.target.value),
                        }))
                      }
                      className="w-full"
                    />
                  </div>

                  {/* Year Range */}
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      From Year
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max="2024"
                      value={filters.minYear}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          minYear: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">
                      To Year
                    </label>
                    <input
                      type="number"
                      min="1900"
                      max="2024"
                      value={filters.maxYear}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          maxYear: parseInt(e.target.value),
                        }))
                      }
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                    />
                  </div>
                </div>

                {/* Exclude Adult */}
                <div className="mt-4">
                  <label className="flex items-center">
                    <input
                      type="checkbox"
                      checked={filters.excludeAdult}
                      onChange={(e) =>
                        setFilters((prev) => ({
                          ...prev,
                          excludeAdult: e.target.checked,
                        }))
                      }
                      className="mr-2"
                    />
                    <span className="text-sm text-gray-700">
                      Exclude adult content
                    </span>
                  </label>
                </div>
              </div>
            )}
          </div>

          {/* Current Movie */}
          {loading ? (
            <div className="text-center py-16">
              <LoadingSpinner
                size="lg"
                color="green"
                text="Finding your next movie adventure!"
              />
            </div>
          ) : movie ? (
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                🎬 Your Random Pick
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-1">
                  <MovieCard movie={movie} />
                </div>

                <div className="lg:col-span-2">
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">
                    {movie.title}
                  </h3>

                  {movie.tagline && (
                    <p className="text-lg text-gray-600 italic mb-4">
                      "{movie.tagline}"
                    </p>
                  )}

                  <div className="flex flex-wrap items-center gap-4 mb-4">
                    <span className="flex items-center text-yellow-500">
                      ⭐ {movie.vote_average}/10
                    </span>
                    <span className="text-gray-600">
                      📅 {new Date(movie.release_date).getFullYear()}
                    </span>
                    {movie.runtime && (
                      <span className="text-gray-600">
                        ⏱️ {Math.floor(movie.runtime / 60)}h{" "}
                        {movie.runtime % 60}m
                      </span>
                    )}
                  </div>

                  {movie.genres && (
                    <div className="mb-4">
                      <div className="flex flex-wrap gap-2">
                        {movie.genres.split(",").map((genre, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-sm"
                          >
                            {genre.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-gray-700 mb-6">{movie.description}</p>

                  <div className="flex gap-3">
                    <button
                      onClick={rollDice}
                      className="bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors"
                    >
                      🎲 Roll Again
                    </button>

                    <Link
                      href={`/similar-to/${movie.slug || slugify(movie.title)}`}
                      className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
                    >
                      Find Similar
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="text-6xl mb-6">🎲</div>
              <h3 className="text-xl font-medium text-gray-900 mb-2">
                Ready to discover something new?
              </h3>
              <p className="text-gray-600 mb-8">
                Click the dice to get a random movie recommendation based on
                your preferences.
              </p>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl mb-3">🎯</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Smart Random
                  </h4>
                  <p className="text-sm text-gray-600">
                    Not completely random - filtered by quality and your
                    preferences
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl mb-3">🔄</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Keep Rolling
                  </h4>
                  <p className="text-sm text-gray-600">
                    Don't like the result? Keep rolling until you find something
                    perfect
                  </p>
                </div>

                <div className="bg-white p-6 rounded-lg shadow-md">
                  <div className="text-3xl mb-3">🕰️</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Save Time
                  </h4>
                  <p className="text-sm text-gray-600">
                    Skip the endless browsing and jump straight to a good movie
                  </p>
                </div>
              </div>
            </div>
          )}

          {/* History */}
          {history.length > 0 && (
            <div className="bg-white rounded-lg shadow-md p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                Recent Rolls ({history.length})
              </h3>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
                {history.map((historyMovie, index) => (
                  <div
                    key={`${historyMovie.id}-${index}`}
                    className="text-center group cursor-pointer relative"
                  >
                    <div
                      onClick={() => setMovie(historyMovie)}
                      className="aspect-[2/3] bg-gray-200 rounded-lg mb-2 overflow-hidden group-hover:ring-2 group-hover:ring-green-500 transition-all"
                    >
                      {historyMovie.posterurl ? (
                        <img
                          src={
                            historyMovie.posterurl.startsWith("http")
                              ? historyMovie.posterurl
                              : `https://image.tmdb.org/t/p/w200${historyMovie.posterurl}`
                          }
                          alt={historyMovie.title}
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-2xl">🎬</span>
                        </div>
                      )}
                    </div>
                    <p
                      onClick={() => setMovie(historyMovie)}
                      className="text-xs text-gray-600 group-hover:text-gray-900 transition-colors mb-1"
                    >
                      {historyMovie.title}
                    </p>
                    <Link
                      href={`/similar-to/${
                        historyMovie.slug || slugify(historyMovie.title)
                      }`}
                      className="text-xs text-blue-600 hover:text-blue-800 transition-colors"
                    >
                      See Similar
                    </Link>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Movie Suggestions */}
          {movie && (
            <div className="mt-8">
              <h3 className="text-xl font-semibold text-gray-900 mb-4">
                Movies Similar to {movie.title}
              </h3>
              <MovieSuggestions
                currentMovie={movie}
                limit={4}
                className="bg-white rounded-lg shadow-md p-6"
              />
            </div>
          )}

          {/* Enhanced Content Sections */}
          <div className="mt-12 space-y-8">
            {/* Why Random Movie Selection Works */}
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">🎯</div>
                <h2 className="text-2xl font-bold text-gray-900">
                  The Science of Random Movie Selection
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🧠 Overcomes Decision Paralysis
                  </h3>
                  <p className="text-gray-600 mb-4">
                    When faced with thousands of movie options, our brains can
                    become overwhelmed. Random selection eliminates the
                    cognitive burden of choice, allowing you to focus on
                    enjoying the experience rather than agonizing over
                    decisions.
                  </p>
                  <div className="bg-green-50 rounded-lg p-4">
                    <p className="text-sm text-green-700">
                      <strong>Research shows:</strong> People are often happier
                      with randomly assigned experiences than ones they
                      carefully chose themselves.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">
                    🎲 Breaks Viewing Patterns
                  </h3>
                  <p className="text-gray-600 mb-4">
                    We all fall into comfortable viewing habits, often missing
                    incredible films outside our usual preferences. Random
                    selection pushes you beyond your comfort zone and introduces
                    you to genres and styles you might never have considered.
                  </p>
                  <div className="bg-blue-50 rounded-lg p-4">
                    <p className="text-sm text-blue-700">
                      <strong>Discovery bonus:</strong> Some of your favorite
                      movies might be ones you never would have chosen
                      deliberately.
                    </p>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">⚡</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Instant Decision
                  </h4>
                  <p className="text-gray-600 text-sm">
                    No more spending 20 minutes browsing. Get a great
                    recommendation in seconds.
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🌟</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Serendipity
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Discover hidden gems and unexpected favorites through chance
                    encounters.
                  </p>
                </div>
                <div className="text-center p-4 bg-gray-50 rounded-lg">
                  <div className="text-3xl mb-2">🎨</div>
                  <h4 className="font-semibold text-gray-900 mb-2">
                    Expand Taste
                  </h4>
                  <p className="text-gray-600 text-sm">
                    Gradually broaden your cinematic palate with diverse random
                    selections.
                  </p>
                </div>
              </div>
            </div>

            {/* Advanced Random Movie Strategies */}
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">⚙️</div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Advanced Random Selection Strategies
                </h2>
              </div>

              <div className="space-y-6">
                <div className="border-l-4 border-green-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🎛️ Smart Filtering for Better Results
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Pure randomness can lead to disappointing choices. Use our
                    intelligent filters to ensure quality while maintaining the
                    element of surprise.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Quality Baseline
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Set minimum ratings (6.0+ recommended) to avoid truly
                        poor films while still allowing for surprising
                        discoveries.
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• 6.0+: Generally watchable films</li>
                        <li>• 7.0+: Good to excellent movies</li>
                        <li>• 8.0+: Only highly acclaimed films</li>
                      </ul>
                    </div>
                    <div className="bg-green-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2">
                        Era Preferences
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Adjust time periods based on your tolerance for older
                        filmmaking styles and production values.
                      </p>
                      <ul className="text-xs text-gray-600 space-y-1">
                        <li>• 2000+: Modern production values</li>
                        <li>• 1990+: Contemporary storytelling</li>
                        <li>• 1970+: Include cinema classics</li>
                      </ul>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-blue-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🎯 Mood-Based Random Selection
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Tailor your random selection to your current emotional state
                    or desired experience for maximum satisfaction.
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-yellow-500">😊</span>
                        Feel-Good Mode
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Focus on comedies, romantic films, and uplifting stories
                        when you need emotional comfort.
                      </p>
                      <div className="text-xs text-gray-600">
                        Genres: Comedy, Romance, Family, Adventure
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-red-500">🔥</span>
                        Energy Boost
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        High-energy films with excitement, tension, and
                        adrenaline-pumping sequences.
                      </p>
                      <div className="text-xs text-gray-600">
                        Genres: Action, Thriller, Horror, Sci-Fi
                      </div>
                    </div>
                    <div className="bg-blue-50 rounded-lg p-4">
                      <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                        <span className="text-purple-500">🤔</span>
                        Thoughtful Viewing
                      </h4>
                      <p className="text-gray-600 text-sm mb-2">
                        Intellectually stimulating films that provoke deep
                        thinking and discussion.
                      </p>
                      <div className="text-xs text-gray-600">
                        Genres: Drama, Documentary, Mystery, History
                      </div>
                    </div>
                  </div>
                </div>

                <div className="border-l-4 border-purple-500 pl-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    🔄 The "Three Roll" Method
                  </h3>
                  <p className="text-gray-600 mb-4">
                    A popular strategy among random movie enthusiasts: generate
                    three options, then pick the one that feels most appealing
                    in the moment.
                  </p>
                  <div className="bg-purple-50 rounded-lg p-4">
                    <ol className="text-sm text-gray-700 space-y-2">
                      <li>
                        <strong>1. Roll three movies</strong> with your
                        preferred filters
                      </li>
                      <li>
                        <strong>2. Read their descriptions</strong> without
                        overthinking
                      </li>
                      <li>
                        <strong>3. Pick the one that sparks interest</strong> in
                        that moment
                      </li>
                      <li>
                        <strong>4. Commit to watching it</strong> regardless of
                        second thoughts
                      </li>
                    </ol>
                    <p className="text-xs text-purple-700 mt-3">
                      This method combines randomness with a touch of personal
                      preference while preventing endless re-rolling.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Random Movie Statistics & Insights */}
            <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">📊</div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Random Selection Insights
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-indigo-600 mb-2">
                    73%
                  </div>
                  <p className="text-sm text-gray-600">
                    Users discover new favorite genres through random selection
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-green-600 mb-2">
                    4.2
                  </div>
                  <p className="text-sm text-gray-600">
                    Average rating of randomly selected films (out of 5)
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-purple-600 mb-2">
                    18min
                  </div>
                  <p className="text-sm text-gray-600">
                    Time saved vs. manual browsing per movie selection
                  </p>
                </div>
                <div className="bg-white rounded-lg p-6 text-center shadow-sm">
                  <div className="text-3xl font-bold text-orange-600 mb-2">
                    2.7x
                  </div>
                  <p className="text-sm text-gray-600">
                    More likely to finish randomly selected movies
                  </p>
                </div>
              </div>

              <div className="bg-white rounded-lg p-6 border border-indigo-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4">
                  🎓 Random Movie Selection Tips from Film Enthusiasts
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      🌙 Late Night Strategy
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      For evening viewing, lean toward shorter films (under 110
                      minutes) and avoid overly complex plots that require
                      intense concentration.
                    </p>
                    <div className="text-xs text-gray-500">
                      Best genres: Comedy, Action, Horror, Light Drama
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      👥 Group Viewing
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      When watching with others, stick to widely appealing
                      genres and avoid extremely niche or art-house films unless
                      everyone's adventurous.
                    </p>
                    <div className="text-xs text-gray-500">
                      Safe bets: Action, Comedy, Thriller, Popular Drama
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      🧠 Learning Mode
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Use random selection to explore film history
                      systematically - set decade filters and discover
                      influential movies from different eras.
                    </p>
                    <div className="text-xs text-gray-500">
                      Try: 1970s for New Hollywood, 1980s for blockbusters
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900 mb-2">
                      🎭 Genre Challenge
                    </h4>
                    <p className="text-gray-600 text-sm mb-3">
                      Monthly genre challenges: Pick one genre you typically
                      avoid and commit to watching three randomly selected films
                      from it.
                    </p>
                    <div className="text-xs text-gray-500">
                      Popular challenges: Horror, Western, Documentary, Foreign
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Making the Most of Random Selections */}
            <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="text-2xl">🎬</div>
                <h2 className="text-2xl font-bold text-gray-900">
                  Maximizing Your Random Movie Experience
                </h2>
              </div>

              <div className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-green-600">✅</span>
                      Do These
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>
                          <strong>Commit to watching:</strong> Give each random
                          pick at least 20-30 minutes before deciding
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>
                          <strong>Keep an open mind:</strong> Approach each film
                          as a potential surprise discovery
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>
                          <strong>Track your picks:</strong> Note which random
                          selections you enjoyed for pattern recognition
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-green-500 mt-1">•</span>
                        <span>
                          <strong>Use quality filters:</strong> Set minimum
                          standards to avoid genuinely poor films
                        </span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gray-50 rounded-lg p-6">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                      <span className="text-red-600">❌</span>
                      Avoid These
                    </h3>
                    <ul className="space-y-3 text-sm text-gray-600">
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>
                          <strong>Endless re-rolling:</strong> Stick with your
                          first few picks to maintain spontaneity
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>
                          <strong>Prejudging by poster:</strong> Great films
                          sometimes have terrible promotional materials
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>
                          <strong>Checking reviews first:</strong> Let yourself
                          experience the film without preconceptions
                        </span>
                      </li>
                      <li className="flex items-start gap-2">
                        <span className="text-red-500 mt-1">•</span>
                        <span>
                          <strong>Setting overly narrow filters:</strong> Too
                          restrictive defeats the purpose of randomness
                        </span>
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-6 border border-yellow-200">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-yellow-600">🏆</span>
                    The Random Movie Challenge
                  </h3>
                  <p className="text-gray-600 mb-4">
                    Ready to fully embrace the random movie experience? Try our
                    month-long challenge designed to expand your cinematic
                    horizons:
                  </p>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Week 1: Comfort Zone Exit
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Pick genres you typically avoid. Random selection from
                        Horror, Documentary, or Foreign films.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Week 2: Decade Deep Dive
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Choose a decade you're unfamiliar with (1970s, 1980s,
                        1990s) and explore its cinema randomly.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Week 3: Runtime Roulette
                      </h4>
                      <p className="text-gray-600 text-sm">
                        Alternate between very short (under 90 min) and very
                        long (over 150 min) films.
                      </p>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">
                        Week 4: Pure Random
                      </h4>
                      <p className="text-gray-600 text-sm">
                        No filters except quality minimum. Let fate choose your
                        final week of discoveries.
                      </p>
                    </div>
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
