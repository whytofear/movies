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

  const handlePickMovie = async () => {
    setIsLoading(true);
    setPickedMovie(null);

    try {
      const response = await fetch("/api/pick-movie", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      if (!response.ok) {
        throw new Error("Failed to pick movie");
      }

      const data = await response.json();

      if (data.movie) {
        // Ensure the movie has a slug
        const movieWithSlug = {
          ...data.movie,
          slug: data.movie.slug || slugify(data.movie.title),
        };
        setPickedMovie(movieWithSlug);

        // Scroll to result after a short delay
        setTimeout(() => {
          const resultElement = document.getElementById("movie-result");
          if (resultElement) {
            resultElement.scrollIntoView({
              behavior: "smooth",
              block: "start",
            });
          }
        }, 100);
      } else {
        throw new Error("No movie found with your preferences");
      }
    } catch (error) {
      console.error("Error picking movie:", error);
      alert("Sorry, couldn't find a movie. Try adjusting your preferences!");
    } finally {
      setIsLoading(false);
    }
  };

  const resetPreferences = () => {
    setPreferences({
      mood: "any",
      duration: "any",
      rating: "any",
      genres: [],
      era: "any",
      popularity: "any",
    });
    setPickedMovie(null);
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-purple-900 to-indigo-900">
        {/* Header */}
        <div className="bg-gradient-to-r from-purple-600 to-blue-600 text-white py-16 px-4">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">
              🎲 Movie Picker
            </h1>
            <p className="text-xl text-blue-100">
              Can't decide what to watch? Let us pick the perfect movie for you!
            </p>
          </div>
        </div>

        <div className="max-w-6xl mx-auto px-4 py-8">
          {/* Preferences Selection */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 mb-8 border border-white/20">
            <h2 className="text-2xl font-bold text-white mb-6">
              Tell us what you're in the mood for
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mood Selection */}
              <div>
                <label className="block text-white font-medium mb-3">
                  What's your mood? 🎭
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {moods.map((mood) => (
                    <button
                      key={mood.value}
                      onClick={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          mood: mood.value,
                        }))
                      }
                      className={`p-3 rounded-lg text-left transition-all duration-200 border ${
                        preferences.mood === mood.value
                          ? "bg-purple-600 border-purple-400 text-white"
                          : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      }`}
                    >
                      <div className="font-medium">{mood.label}</div>
                      <div className="text-sm opacity-75">
                        {mood.description}
                      </div>
                    </button>
                  ))}
                </div>
              </div>

              {/* Duration Selection */}
              <div>
                <label className="block text-white font-medium mb-3">
                  How much time do you have? ⏰
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {durations.map((duration) => (
                    <button
                      key={duration.value}
                      onClick={() =>
                        setPreferences((prev) => ({
                          ...prev,
                          duration: duration.value,
                        }))
                      }
                      className={`p-3 rounded-lg text-left transition-all duration-200 border ${
                        preferences.duration === duration.value
                          ? "bg-purple-600 border-purple-400 text-white"
                          : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                      }`}
                    >
                      {duration.label}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Advanced Options Toggle */}
            <div className="mt-8">
              <button
                onClick={() => setShowAdvanced(!showAdvanced)}
                className="inline-flex items-center px-4 py-2 bg-white/10 hover:bg-white/20 text-white rounded-lg border border-white/20 transition-all duration-200"
              >
                ⚙️ {showAdvanced ? "Hide" : "Show"} Advanced Options
                <svg
                  className={`ml-2 h-4 w-4 transition-transform ${
                    showAdvanced ? "rotate-180" : ""
                  }`}
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path
                    fillRule="evenodd"
                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            </div>

            {/* Advanced Options */}
            {showAdvanced && (
              <div className="mt-6 pt-6 border-t border-white/20">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {/* Rating Preference */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Content Rating 🏷️
                    </label>
                    {ratings.map((rating) => (
                      <button
                        key={rating.value}
                        onClick={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            rating: rating.value,
                          }))
                        }
                        className={`block w-full p-2 mb-2 rounded-lg text-left transition-all duration-200 border ${
                          preferences.rating === rating.value
                            ? "bg-purple-600 border-purple-400 text-white"
                            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        }`}
                      >
                        {rating.label}
                      </button>
                    ))}
                  </div>

                  {/* Era Preference */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Time Period 📅
                    </label>
                    {eras.map((era) => (
                      <button
                        key={era.value}
                        onClick={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            era: era.value,
                          }))
                        }
                        className={`block w-full p-2 mb-2 rounded-lg text-left transition-all duration-200 border ${
                          preferences.era === era.value
                            ? "bg-purple-600 border-purple-400 text-white"
                            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        }`}
                      >
                        {era.label}
                      </button>
                    ))}
                  </div>

                  {/* Popularity Preference */}
                  <div>
                    <label className="block text-white font-medium mb-3">
                      Popularity 🌟
                    </label>
                    {popularityLevels.map((level) => (
                      <button
                        key={level.value}
                        onClick={() =>
                          setPreferences((prev) => ({
                            ...prev,
                            popularity: level.value,
                          }))
                        }
                        className={`block w-full p-2 mb-2 rounded-lg text-left transition-all duration-200 border ${
                          preferences.popularity === level.value
                            ? "bg-purple-600 border-purple-400 text-white"
                            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        }`}
                      >
                        {level.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Genre Selection */}
                <div className="mt-6">
                  <label className="block text-white font-medium mb-3">
                    Preferred Genres (optional) 🎬
                  </label>
                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-2">
                    {availableGenres.slice(0, 20).map((genre) => (
                      <button
                        key={genre}
                        onClick={() => handleGenreToggle(genre)}
                        className={`p-2 rounded-lg text-sm transition-all duration-200 border ${
                          preferences.genres.includes(genre)
                            ? "bg-purple-600 border-purple-400 text-white"
                            : "bg-white/10 border-white/20 text-white hover:bg-white/20"
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 mt-8">
              <button
                onClick={handlePickMovie}
                disabled={isLoading}
                className="flex-1 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 disabled:from-gray-500 disabled:to-gray-600 text-white font-bold py-4 px-8 rounded-xl transition-all duration-300 transform hover:scale-105 disabled:scale-100 disabled:cursor-not-allowed"
              >
                {isLoading ? (
                  <div className="flex items-center justify-center">
                    <LoadingSpinner />
                    <span className="ml-2">Finding your movie...</span>
                  </div>
                ) : (
                  "🎲 Pick My Movie!"
                )}
              </button>

              <button
                onClick={resetPreferences}
                className="bg-white/10 hover:bg-white/20 text-white font-medium py-4 px-6 rounded-xl border border-white/20 transition-all duration-200"
              >
                🔄 Reset
              </button>
            </div>
          </div>

          {/* Results Section */}
          {pickedMovie && (
            <div
              id="movie-result"
              className="bg-white/10 backdrop-blur-sm rounded-2xl p-8 border border-white/20"
            >
              <h2 className="text-3xl font-bold text-white mb-8 text-center">
                🎬 Your Perfect Movie Match
              </h2>
              <div className="max-w-2xl mx-auto">
                <MovieCard movie={pickedMovie} />
                <div className="text-center mt-6">
                  <button
                    onClick={handlePickMovie}
                    className="inline-flex items-center px-6 py-3 bg-white/10 hover:bg-white/20 text-white font-medium rounded-xl border border-white/20 transition-all duration-300"
                  >
                    🔄 Pick Another Movie
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* Movie Suggestions */}
          <div className="mt-8">
            <MovieSuggestions />
          </div>

          {/* Navigation Links */}
          <div className="mt-12 text-center">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-4xl mx-auto">
              <Link
                href="/tools/mood-finder"
                className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl mb-2">🎭</div>
                <div className="font-medium">Mood Finder</div>
                <div className="text-sm opacity-75">
                  Find movies that match your mood
                </div>
              </Link>

              <Link
                href="/tools/random-movie"
                className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl mb-2">🎰</div>
                <div className="font-medium">Random Movie</div>
                <div className="text-sm opacity-75">
                  Get a completely random movie
                </div>
              </Link>

              <Link
                href="/tools/movie-recommender"
                className="bg-white/10 hover:bg-white/20 text-white p-6 rounded-xl border border-white/20 transition-all duration-300 hover:scale-105"
              >
                <div className="text-2xl mb-2">🎯</div>
                <div className="font-medium">Movie Recommender</div>
                <div className="text-sm opacity-75">
                  Get personalized recommendations
                </div>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </ErrorBoundary>
  );
}
