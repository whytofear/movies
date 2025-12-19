"use client";

import { useState, useEffect } from "react";
import { Movie } from "../../../lib/supabase";
import { slugify } from "../../../lib/utils";
import MovieCard from "../../components/MovieCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import ErrorBoundary from "../../components/ErrorBoundary";
import MovieSuggestions from "../../components/MovieSuggestions";
import Link from "next/link";

interface PickPreferences {
  mood: string;
  duration: string;
  rating: string;
  genres: string[];
  era: string;
  popularity: string;
}

export default function PickMoviePage() {
  const [preferences, setPreferences] = useState<PickPreferences>({
    mood: "any",
    duration: "any",
    rating: "any",
    genres: [],
    era: "any",
    popularity: "any",
  });

  const [isLoading, setIsLoading] = useState(false);
  const [pickedMovie, setPickedMovie] = useState<Movie | null>(null);
  const [availableGenres, setAvailableGenres] = useState<string[]>([]);
  const [showAdvanced, setShowAdvanced] = useState(false);

  useEffect(() => {
    // Load available genres
    fetch("/api/genres")
      .then((res) => res.json())
      .then((data) => setAvailableGenres(data.genres || []))
      .catch((err) => console.error("Error fetching genres:", err));
  }, []);

  const moods = [
    { value: "any", label: "🎭 Surprise Me", description: "Any mood or genre" },
    {
      value: "happy",
      label: "😊 Feel Good",
      description: "Uplifting and positive",
    },
    {
      value: "adventure",
      label: "🗺️ Adventure",
      description: "Exciting and thrilling",
    },
    {
      value: "romantic",
      label: "💕 Romantic",
      description: "Love and relationships",
    },
    {
      value: "funny",
      label: "😂 Comedy",
      description: "Laugh out loud moments",
    },
    {
      value: "intense",
      label: "🔥 Intense",
      description: "Action and suspense",
    },
    { value: "thoughtful", label: "🤔 Deep", description: "Thought-provoking" },
  ];

  const durations = [
    { value: "any", label: "Any Length" },
    { value: "short", label: "Quick (< 90 min)" },
    { value: "medium", label: "Standard (90-130 min)" },
    { value: "long", label: "Epic (> 130 min)" },
  ];

  const ratings = [
    { value: "any", label: "Any Rating" },
    { value: "family", label: "Family Friendly" },
    { value: "teen", label: "Teen & Up" },
    { value: "mature", label: "Mature Audiences" },
  ];

  const eras = [
    { value: "any", label: "Any Era" },
    { value: "classic", label: "Classic (Before 1990)" },
    { value: "retro", label: "Retro (1990-2005)" },
    { value: "modern", label: "Modern (2006-2015)" },
    { value: "recent", label: "Recent (2016+)" },
  ];

  const popularityLevels = [
    { value: "any", label: "Any Popularity" },
    { value: "hidden", label: "Hidden Gems" },
    { value: "popular", label: "Popular Favorites" },
    { value: "blockbuster", label: "Major Blockbusters" },
  ];

  const handleGenreToggle = (genre: string) => {
    setPreferences((prev) => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter((g) => g !== genre)
        : [...prev.genres, genre],
    }));
  };

  const pickMovie = async () => {
    setIsLoading(true);
    try {
      const response = await fetch("/api/pick-movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      if (data.movie) {
        setPickedMovie(data.movie);
      }
    } catch (error) {
      console.error("Error picking movie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const quickPick = async (quickPrefs: Partial<PickPreferences>) => {
    const combinedPrefs = { ...preferences, ...quickPrefs };
    setPreferences(combinedPrefs);
    setIsLoading(true);
    try {
      const response = await fetch("/api/pick-movie", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(combinedPrefs),
      });

      const data = await response.json();
      if (data.movie) {
        setPickedMovie(data.movie);
      }
    } catch (error) {
      console.error("Error picking movie:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-purple-50">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
            <div className="text-center">
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
                🎲 Pick a Movie for Me
              </h1>
              <p className="text-base sm:text-lg lg:text-xl text-indigo-100 max-w-3xl mx-auto">
                Can't decide what to watch? Tell us your preferences and we'll
                pick the perfect movie for you!
              </p>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
          {!pickedMovie ? (
            <>
              {/* Quick Picks - Mobile Optimized */}
              <div className="mb-8">
                <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                  🚀 Quick Picks
                </h2>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
                  <button
                    onClick={() => quickPick({ mood: "any" })}
                    disabled={isLoading}
                    className="bg-gradient-to-br from-purple-500 to-pink-500 text-white p-3 sm:p-4 lg:p-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🎲</div>
                    <div className="font-semibold text-sm sm:text-base">
                      Total Surprise
                    </div>
                    <div className="text-xs sm:text-sm opacity-90 hidden sm:block">
                      Completely random
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      quickPick({
                        mood: "happy",
                        genres: ["Comedy", "Animation"],
                      })
                    }
                    disabled={isLoading}
                    className="bg-gradient-to-br from-yellow-400 to-orange-500 text-white p-3 sm:p-4 lg:p-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">😊</div>
                    <div className="font-semibold text-sm sm:text-base">
                      Feel Good
                    </div>
                    <div className="text-xs sm:text-sm opacity-90 hidden sm:block">
                      Happy & uplifting
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      quickPick({
                        mood: "intense",
                        genres: ["Action", "Thriller"],
                      })
                    }
                    disabled={isLoading}
                    className="bg-gradient-to-br from-red-500 to-pink-600 text-white p-3 sm:p-4 lg:p-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🔥</div>
                    <div className="font-semibold text-sm sm:text-base">
                      Adrenaline Rush
                    </div>
                    <div className="text-xs sm:text-sm opacity-90 hidden sm:block">
                      Action & thrills
                    </div>
                  </button>

                  <button
                    onClick={() =>
                      quickPick({
                        mood: "thoughtful",
                        genres: ["Drama", "Science Fiction"],
                      })
                    }
                    disabled={isLoading}
                    className="bg-gradient-to-br from-indigo-500 to-purple-600 text-white p-3 sm:p-4 lg:p-6 rounded-xl hover:shadow-lg transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50"
                  >
                    <div className="text-2xl sm:text-3xl mb-1 sm:mb-2">🤔</div>
                    <div className="font-semibold text-sm sm:text-base">
                      Mind Bender
                    </div>
                    <div className="text-xs sm:text-sm opacity-90 hidden sm:block">
                      Deep & thoughtful
                    </div>
                  </button>
                </div>
              </div>

              {/* Custom Preferences - Mobile Optimized */}
              <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6 mb-8">
                <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center mb-4 sm:mb-6 space-y-2 sm:space-y-0">
                  <h2 className="text-xl sm:text-2xl font-bold text-gray-900">
                    🎯 Custom Preferences
                  </h2>
                  <button
                    onClick={() => setShowAdvanced(!showAdvanced)}
                    className="text-indigo-600 hover:text-indigo-800 font-medium text-sm sm:text-base px-4 py-2 rounded-lg bg-indigo-50 hover:bg-indigo-100 transition-colors"
                  >
                    {showAdvanced ? "Simple" : "Advanced"} Options
                  </button>
                </div>

                {/* Mood Selection - Mobile Optimized */}
                <div className="mb-6">
                  <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                    What's your mood?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-2 sm:gap-3">
                    {moods.map((mood) => (
                      <button
                        key={mood.value}
                        onClick={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            mood: mood.value,
                          }))
                        }
                        className={`p-2 sm:p-3 rounded-lg text-center transition-all transform hover:scale-105 active:scale-95 ${
                          preferences.mood === mood.value
                            ? "bg-indigo-500 text-white shadow-md"
                            : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                        }`}
                      >
                        <div className="text-lg sm:text-xl mb-1">
                          {mood.label.split(" ")[0]}
                        </div>
                        <div className="text-xs sm:text-sm font-medium">
                          {mood.label.split(" ").slice(1).join(" ")}
                        </div>
                      </button>
                    ))}
                  </div>
                </div>

                {showAdvanced && (
                  <>
                    {/* Duration - Mobile Optimized */}
                    <div className="mb-6">
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                        How much time do you have?
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
                        {durations.map((duration) => (
                          <button
                            key={duration.value}
                            onClick={() =>
                              setPreferences((prev) => ({
                                ...prev,
                                duration: duration.value,
                              }))
                            }
                            className={`p-2 sm:p-3 rounded-lg text-center text-sm sm:text-base transition-all transform hover:scale-105 active:scale-95 ${
                              preferences.duration === duration.value
                                ? "bg-green-500 text-white shadow-md"
                                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                            }`}
                          >
                            {duration.label}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Genres - Mobile Optimized */}
                    <div className="mb-6">
                      <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                        Favorite genres (optional)
                      </label>
                      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-2">
                        {availableGenres.map((genre) => (
                          <button
                            key={genre}
                            onClick={() => handleGenreToggle(genre)}
                            className={`px-2 sm:px-3 py-2 text-xs sm:text-sm rounded-lg transition-all transform hover:scale-105 active:scale-95 ${
                              preferences.genres.includes(genre)
                                ? "bg-blue-600 text-white shadow-md"
                                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
                            }`}
                          >
                            {genre}
                          </button>
                        ))}
                      </div>
                    </div>

                    {/* Era and Popularity - Mobile Optimized */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                          Era preference
                        </label>
                        <div className="space-y-2">
                          {eras.map((era) => (
                            <button
                              key={era.value}
                              onClick={() =>
                                setPreferences((prev) => ({
                                  ...prev,
                                  era: era.value,
                                }))
                              }
                              className={`w-full p-2 sm:p-3 text-left text-sm sm:text-base rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                                preferences.era === era.value
                                  ? "bg-indigo-500 text-white shadow-md"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              }`}
                            >
                              {era.label}
                            </button>
                          ))}
                        </div>
                      </div>

                      <div>
                        <label className="block text-sm sm:text-base font-medium text-gray-700 mb-3">
                          Popularity level
                        </label>
                        <div className="space-y-2">
                          {popularityLevels.map((level) => (
                            <button
                              key={level.value}
                              onClick={() =>
                                setPreferences((prev) => ({
                                  ...prev,
                                  popularity: level.value,
                                }))
                              }
                              className={`w-full p-2 sm:p-3 text-left text-sm sm:text-base rounded-lg transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
                                preferences.popularity === level.value
                                  ? "bg-purple-500 text-white shadow-md"
                                  : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                              }`}
                            >
                              {level.label}
                            </button>
                          ))}
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Pick Button - Mobile Optimized */}
                <div className="mt-6 sm:mt-8 text-center">
                  <button
                    onClick={pickMovie}
                    disabled={isLoading}
                    className="w-full sm:w-auto bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 sm:px-8 py-3 sm:py-4 rounded-xl font-semibold hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base"
                  >
                    {isLoading ? (
                      <div className="flex items-center justify-center space-x-2">
                        <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                        <span>Finding Your Perfect Movie...</span>
                      </div>
                    ) : (
                      <>🎬 Pick My Movie!</>
                    )}
                  </button>
                </div>
              </div>

              {/* How It Works - Mobile Optimized */}
              <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-4 sm:p-6 border border-blue-200">
                <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 text-center sm:text-left">
                  🔍 How Our Smart Picker Works
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
                  <div className="text-center sm:text-left">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      🎯 Smart Matching
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Our algorithm analyzes your preferences and matches them
                      with movies from our curated database.
                    </p>
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      ⭐ Quality Filtering
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      We prioritize highly-rated movies to ensure you get
                      quality recommendations.
                    </p>
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      🎲 Perfect Randomness
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Within your criteria, we pick completely randomly to keep
                      things surprising.
                    </p>
                  </div>
                  <div className="text-center sm:text-left">
                    <h4 className="font-medium text-gray-900 mb-2 text-sm sm:text-base">
                      🔄 Keep Rolling
                    </h4>
                    <p className="text-gray-600 text-xs sm:text-sm">
                      Don't like the pick? Just click again for another great
                      option.
                    </p>
                  </div>
                </div>
              </div>
            </>
          ) : (
            /* Movie Result - Mobile Optimized */
            <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
              <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
                🎉 Your Perfect Movie Pick!
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8 mb-6 sm:mb-8">
                <div className="lg:col-span-1 flex justify-center">
                  <div className="w-full max-w-xs">
                    <MovieCard movie={pickedMovie} />
                  </div>
                </div>

                <div className="lg:col-span-2">
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-900 mb-2 sm:mb-3 text-center lg:text-left">
                    {pickedMovie.title}
                  </h3>

                  {pickedMovie.tagline && (
                    <p className="text-base sm:text-lg text-gray-600 italic mb-3 sm:mb-4 text-center lg:text-left">
                      "{pickedMovie.tagline}"
                    </p>
                  )}

                  <div className="flex flex-wrap items-center justify-center lg:justify-start gap-3 sm:gap-4 mb-3 sm:mb-4">
                    <span className="flex items-center text-yellow-500 text-sm sm:text-base">
                      ⭐ {pickedMovie.vote_average}/10
                    </span>
                    <span className="text-gray-600 text-sm sm:text-base">
                      📅 {new Date(pickedMovie.release_date).getFullYear()}
                    </span>
                    {pickedMovie.runtime && (
                      <span className="text-gray-600 text-sm sm:text-base">
                        ⏱️ {Math.floor(pickedMovie.runtime / 60)}h{" "}
                        {pickedMovie.runtime % 60}m
                      </span>
                    )}
                  </div>

                  {pickedMovie.genres && (
                    <div className="mb-3 sm:mb-4 flex justify-center lg:justify-start">
                      <div className="flex flex-wrap gap-2 justify-center lg:justify-start">
                        {pickedMovie.genres.split(",").map((genre, index) => (
                          <span
                            key={index}
                            className="px-2 py-1 bg-blue-100 text-blue-800 rounded-md text-xs sm:text-sm"
                          >
                            {genre.trim()}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  <p className="text-gray-700 mb-4 sm:mb-6 text-sm sm:text-base text-center lg:text-left leading-relaxed">
                    {pickedMovie.description}
                  </p>

                  <div className="flex flex-col sm:flex-row flex-wrap gap-2 sm:gap-3">
                    <button
                      onClick={pickMovie}
                      disabled={isLoading}
                      className="bg-green-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-green-700 transition-all transform hover:scale-105 active:scale-95 disabled:opacity-50 text-sm sm:text-base font-medium"
                    >
                      🎲 Pick Another
                    </button>

                    <Link
                      href={`/similar-to/${
                        pickedMovie.slug || slugify(pickedMovie.title)
                      }`}
                      className="bg-blue-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-blue-700 transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base font-medium text-center"
                    >
                      Find Similar Movies
                    </Link>

                    <button
                      onClick={() => setPickedMovie(null)}
                      className="bg-gray-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105 active:scale-95 text-sm sm:text-base font-medium"
                    >
                      New Search
                    </button>
                  </div>
                </div>
              </div>

              {/* Why This Movie - Mobile Optimized */}
              <div className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-4 border border-gray-200">
                <h4 className="font-semibold text-gray-900 mb-3 text-center sm:text-left text-sm sm:text-base">
                  🎯 Why We Picked This Movie
                </h4>
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 text-xs sm:text-sm">
                  <div className="text-center">
                    <span className="text-gray-600 block">Rating:</span>
                    <div className="font-medium text-gray-900">
                      ⭐ {pickedMovie.vote_average}/10
                    </div>
                  </div>
                  {pickedMovie.popularity && (
                    <div className="text-center">
                      <span className="text-gray-600 block">Popularity:</span>
                      <div className="font-medium text-gray-900">
                        🔥 {Math.round(pickedMovie.popularity)}
                      </div>
                    </div>
                  )}
                  <div className="text-center">
                    <span className="text-gray-600 block">Era:</span>
                    <div className="font-medium text-gray-900">
                      {new Date(pickedMovie.release_date).getFullYear()}
                    </div>
                  </div>
                  <div className="text-center">
                    <span className="text-gray-600 block">Genres:</span>
                    <div className="font-medium text-gray-900">
                      {pickedMovie.genres?.split(",").length || 0} matched
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Movie Suggestions */}
          {pickedMovie && (
            <div className="mt-6 sm:mt-8">
              <MovieSuggestions
                currentMovie={pickedMovie}
                limit={4}
                className="mt-6 sm:mt-8"
              />
            </div>
          )}
        </div>
      </div>
    </ErrorBoundary>
  );
}
