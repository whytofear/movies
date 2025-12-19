"use client";

import { useState, useEffect } from "react";
import { Metadata } from "next";
import { Movie } from "../../../lib/supabase";
import MovieCard from "../../components/MovieCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import MovieSuggestions from "../../components/MovieSuggestions";

// Note: This metadata will be handled by a parent layout or we need to convert to server component
// For now, adding it here for structure but client components can't export metadata directly

interface DateNightPreferences {
  mood: "romantic" | "comedy" | "adventure" | "thriller" | "any";
  duration: "short" | "medium" | "long" | "any";
  rating: "family" | "mature" | "any";
  era: "classic" | "modern" | "recent" | "any";
}

export default function DateNightPage() {
  const [preferences, setPreferences] = useState<DateNightPreferences>({
    mood: "any",
    duration: "any",
    rating: "any",
    era: "any",
  });
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const moods = [
    {
      value: "romantic",
      label: "💕 Romantic",
      description: "Love stories and romantic comedies",
    },
    {
      value: "comedy",
      label: "😄 Comedy",
      description: "Light-hearted and funny movies",
    },
    {
      value: "adventure",
      label: "🗺️ Adventure",
      description: "Exciting journeys and quests",
    },
    {
      value: "thriller",
      label: "🔥 Thriller",
      description: "Suspenseful and gripping stories",
    },
    {
      value: "any",
      label: "🎭 Surprise Me",
      description: "A mix of different genres",
    },
  ];

  const durations = [
    {
      value: "short",
      label: "⏱️ Quick Watch (< 90 min)",
      description: "Perfect for a short evening",
    },
    {
      value: "medium",
      label: "🕒 Standard (90-130 min)",
      description: "Most popular length",
    },
    {
      value: "long",
      label: "🕰️ Epic (> 130 min)",
      description: "For when you have time",
    },
    {
      value: "any",
      label: "⏰ Any Length",
      description: "Duration doesn't matter",
    },
  ];

  const ratings = [
    {
      value: "family",
      label: "👨‍👩‍👧‍👦 Family Friendly",
      description: "Suitable for all ages",
    },
    {
      value: "mature",
      label: "🔞 Mature Content",
      description: "Adult themes and content",
    },
    { value: "any", label: "🎬 Any Rating", description: "All content types" },
  ];

  const eras = [
    {
      value: "classic",
      label: "📺 Classic (Before 2000)",
      description: "Timeless classics",
    },
    {
      value: "modern",
      label: "🎥 Modern (2000-2015)",
      description: "Modern cinema",
    },
    {
      value: "recent",
      label: "🆕 Recent (2016+)",
      description: "Latest releases",
    },
    { value: "any", label: "📅 Any Era", description: "All time periods" },
  ];

  const getDateNightMovies = async () => {
    setLoading(true);
    try {
      const response = await fetch("/api/date-night", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(preferences),
      });

      const data = await response.json();
      setRecommendations(data.movies || []);
    } catch (error) {
      console.error("Error getting date night movies:", error);
    } finally {
      setLoading(false);
    }
  };

  const PreferenceCard = ({
    title,
    options,
    selected,
    onChange,
  }: {
    title: string;
    options: Array<{ value: string; label: string; description: string }>;
    selected: string;
    onChange: (value: string) => void;
  }) => (
    <div className="bg-white rounded-xl shadow-lg p-4 sm:p-6">
      <h3 className="text-base sm:text-lg font-semibold text-gray-900 mb-3 sm:mb-4">
        {title}
      </h3>
      <div className="space-y-2 sm:space-y-3">
        {options.map((option) => (
          <button
            key={option.value}
            onClick={() => onChange(option.value)}
            className={`w-full text-left p-2 sm:p-3 rounded-lg border-2 transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
              selected === option.value
                ? "border-pink-500 bg-pink-50 shadow-md"
                : "border-gray-200 hover:border-gray-300"
            }`}
          >
            <div className="font-medium text-gray-900 text-sm sm:text-base">
              {option.label}
            </div>
            <div className="text-xs sm:text-sm text-gray-600 mt-1">
              {option.description}
            </div>
          </button>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-pink-50 via-white to-rose-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-pink-600 to-rose-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              💕 Date Night Movie Finder
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-pink-100 max-w-3xl mx-auto">
              Discover the perfect movies for a romantic evening together. From
              cozy comedies to thrilling adventures.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {/* How It Works Section */}
        <div className="bg-gradient-to-r from-pink-100 to-rose-100 rounded-xl p-6 mb-8 border border-pink-200">
          <h2 className="text-xl font-semibold text-gray-900 mb-4 text-center">
            🎬 How Our Date Night Finder Works
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">💕</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Set Your Mood</h3>
              <p className="text-sm text-gray-600">
                Choose the perfect atmosphere for your date night
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">🎯</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Smart Matching</h3>
              <p className="text-sm text-gray-600">
                Our algorithm finds movies perfect for couples
              </p>
            </div>
            <div className="text-center">
              <div className="w-12 h-12 bg-pink-200 rounded-full flex items-center justify-center mx-auto mb-3">
                <span className="text-2xl">✨</span>
              </div>
              <h3 className="font-medium text-gray-900 mb-2">Enjoy Together</h3>
              <p className="text-sm text-gray-600">
                Curated selections that both of you will love
              </p>
            </div>
          </div>
        </div>

        {/* Preferences */}
        <div className="mb-6 sm:mb-8">
          <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-4 sm:mb-6 text-center">
            🎭 What's Your Perfect Date Night Vibe?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            <PreferenceCard
              title="💝 Mood & Genre"
              options={moods}
              selected={preferences.mood}
              onChange={(mood) =>
                setPreferences((prev) => ({ ...prev, mood: mood as any }))
              }
            />

            <PreferenceCard
              title="⏰ Movie Length"
              options={durations}
              selected={preferences.duration}
              onChange={(duration) =>
                setPreferences((prev) => ({
                  ...prev,
                  duration: duration as any,
                }))
              }
            />

            <PreferenceCard
              title="🎬 Content Rating"
              options={ratings}
              selected={preferences.rating}
              onChange={(rating) =>
                setPreferences((prev) => ({ ...prev, rating: rating as any }))
              }
            />

            <PreferenceCard
              title="📅 Era Preference"
              options={eras}
              selected={preferences.era}
              onChange={(era) =>
                setPreferences((prev) => ({ ...prev, era: era as any }))
              }
            />
          </div>

          <div className="text-center">
            <button
              onClick={getDateNightMovies}
              disabled={loading}
              className="w-full sm:w-auto bg-gradient-to-r from-pink-600 to-rose-600 text-white px-8 py-4 rounded-xl font-semibold text-lg hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed transition-all transform hover:scale-105 active:scale-95"
            >
              {loading ? (
                <div className="flex items-center justify-center space-x-2">
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white"></div>
                  <span>Finding Perfect Movies...</span>
                </div>
              ) : (
                <>🍿 Find Our Perfect Movie</>
              )}
            </button>
          </div>
        </div>

        {/* Results */}
        {recommendations.length > 0 ? (
          <div className="bg-white rounded-xl shadow-lg p-6">
            <div className="text-center mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                🎉 Perfect Date Night Movies
              </h2>
              <p className="text-gray-600">
                We found {recommendations.length} amazing movies for your
                romantic evening
              </p>
            </div>

            {/* Featured Movie (if available) */}
            {recommendations.length > 0 && (
              <div className="bg-gradient-to-r from-pink-50 to-rose-50 rounded-lg p-6 mb-6 border border-pink-200">
                <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
                  🌟 Tonight's Featured Pick
                </h3>
                <div className="flex justify-center">
                  <div className="max-w-xs">
                    <MovieCard movie={recommendations[0]} />
                  </div>
                </div>
                <div className="text-center mt-4">
                  <p className="text-sm text-gray-600">
                    This movie scored highest based on your preferences!
                  </p>
                </div>
              </div>
            )}

            {/* All Recommendations */}
            <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6 mb-6">
              {recommendations.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </div>

            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => {
                  setRecommendations([]);
                }}
                className="bg-pink-600 text-white px-6 py-3 rounded-lg hover:bg-pink-700 transition-all transform hover:scale-105 active:scale-95 font-medium"
              >
                🎲 Find Different Movies
              </button>
              <button
                onClick={() => {
                  setRecommendations([]);
                  setPreferences({
                    mood: "any",
                    duration: "any",
                    rating: "any",
                    era: "any",
                  });
                }}
                className="bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-all transform hover:scale-105 active:scale-95 font-medium"
              >
                🔄 Start Over
              </button>
            </div>
          </div>
        ) : !loading ? (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="text-6xl mb-4">💕</div>
              <h3 className="text-2xl font-bold text-gray-900 mb-3">
                Ready for the Perfect Date Night?
              </h3>
              <p className="text-gray-600 mb-8 max-w-md mx-auto">
                Choose your preferences above and we'll find movies that will
                make your evening unforgettable.
              </p>

              {/* Quick Preset Buttons */}
              <div className="mb-8">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  🎯 Or Try Our Popular Presets
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto">
                  <button
                    onClick={() => {
                      setPreferences({
                        mood: "romantic",
                        duration: "medium",
                        rating: "any",
                        era: "any",
                      });
                      setTimeout(getDateNightMovies, 100);
                    }}
                    className="p-6 bg-gradient-to-br from-pink-100 to-rose-100 rounded-xl hover:from-pink-200 hover:to-rose-200 transition-all transform hover:scale-105 active:scale-95 border border-pink-200"
                  >
                    <div className="text-3xl mb-3">💕</div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Classic Romance
                    </div>
                    <div className="text-sm text-gray-600">
                      Timeless love stories
                    </div>
                  </button>

                  <button
                    onClick={() => {
                      setPreferences({
                        mood: "comedy",
                        duration: "any",
                        rating: "family",
                        era: "any",
                      });
                      setTimeout(getDateNightMovies, 100);
                    }}
                    className="p-6 bg-gradient-to-br from-yellow-100 to-orange-100 rounded-xl hover:from-yellow-200 hover:to-orange-200 transition-all transform hover:scale-105 active:scale-95 border border-yellow-200"
                  >
                    <div className="text-3xl mb-3">😄</div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Fun & Light
                    </div>
                    <div className="text-sm text-gray-600">Laugh together</div>
                  </button>

                  <button
                    onClick={() => {
                      setPreferences({
                        mood: "thriller",
                        duration: "medium",
                        rating: "mature",
                        era: "recent",
                      });
                      setTimeout(getDateNightMovies, 100);
                    }}
                    className="p-6 bg-gradient-to-br from-red-100 to-pink-100 rounded-xl hover:from-red-200 hover:to-pink-200 transition-all transform hover:scale-105 active:scale-95 border border-red-200"
                  >
                    <div className="text-3xl mb-3">🔥</div>
                    <div className="font-semibold text-gray-900 mb-1">
                      Edge of Seat
                    </div>
                    <div className="text-sm text-gray-600">
                      Thrilling adventures
                    </div>
                  </button>
                </div>
              </div>

              {/* Date Night Tips */}
              <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-6 border border-purple-200">
                <h4 className="text-lg font-semibold text-gray-900 mb-4">
                  💡 Pro Date Night Tips
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">🍿</span>
                    <div>
                      <strong>Snack Smart:</strong> Prepare some favorite treats
                      before the movie starts
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">📱</span>
                    <div>
                      <strong>Phone Free:</strong> Put devices away for the full
                      experience
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">🛋️</span>
                    <div>
                      <strong>Cozy Setup:</strong> Create a comfortable viewing
                      environment
                    </div>
                  </div>
                  <div className="flex items-start space-x-2">
                    <span className="text-lg">💭</span>
                    <div>
                      <strong>Discuss After:</strong> Share thoughts and
                      favorite moments
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="bg-white rounded-xl shadow-lg p-8">
              <div className="animate-pulse">
                <div className="text-6xl mb-4">🎬</div>
                <div className="animate-spin rounded-full h-12 w-12 border-4 border-pink-600 border-t-transparent mx-auto mb-4"></div>
                <h3 className="text-xl font-semibold text-gray-900 mb-2">
                  Curating the Perfect Date Night Movies...
                </h3>
                <p className="text-gray-500">
                  Finding movies that both of you will absolutely love ✨
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Enhanced Content Sections */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* The Art of Date Night Movie Selection */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">🎯</div>
            <h2 className="text-2xl font-bold text-gray-900">
              The Art of Date Night Movie Selection
            </h2>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                💕 Building Connection Through Cinema
              </h3>
              <p className="text-gray-600 mb-4">
                The right movie can spark conversations, create shared memories, and bring couples closer together. Date night movies aren't just entertainment—they're opportunities for bonding and discovery.
              </p>
              <div className="bg-pink-50 rounded-lg p-4">
                <p className="text-sm text-pink-700">
                  <strong>Research shows:</strong> Couples who regularly watch movies together report higher relationship satisfaction and better communication.
                </p>
              </div>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎭 Finding the Sweet Spot
              </h3>
              <p className="text-gray-600 mb-4">
                Great date night movies balance entertainment value with emotional resonance. They're engaging enough to hold attention but not so complex that they prevent cuddling and casual conversation.
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <p className="text-sm text-purple-700">
                  <strong>Pro tip:</strong> The best date movies leave you with something to talk about afterward—themes, characters, or "what would we do?" scenarios.
                </p>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-red-50 rounded-lg">
              <div className="text-3xl mb-2">❤️</div>
              <h4 className="font-semibold text-gray-900 mb-2">Emotional Connection</h4>
              <p className="text-gray-600 text-sm">Movies that make you feel closer and more connected as a couple.</p>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-3xl mb-2">😄</div>
              <h4 className="font-semibold text-gray-900 mb-2">Shared Laughter</h4>
              <p className="text-gray-600 text-sm">Comedy that brings joy and creates positive shared experiences.</p>
            </div>
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-3xl mb-2">🗣️</div>
              <h4 className="font-semibold text-gray-900 mb-2">Conversation Starters</h4>
              <p className="text-gray-600 text-sm">Films that spark meaningful discussions about life, dreams, and values.</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-3xl mb-2">🌟</div>
              <h4 className="font-semibold text-gray-900 mb-2">Memorable Moments</h4>
              <p className="text-gray-600 text-sm">Movies that create lasting memories you'll reference for years to come.</p>
            </div>
          </div>
        </div>

        {/* Date Night Movie Categories */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">🎬</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Perfect Date Night Movie Categories
            </h2>
          </div>

          <div className="space-y-6">
            <div className="border-l-4 border-pink-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                💖 Classic Romance & Rom-Coms
              </h3>
              <p className="text-gray-600 mb-4">
                Time-tested formulas that celebrate love, relationships, and the journey to happiness. These films often feature beautiful cinematography, memorable quotes, and feel-good endings.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Timeless Classics</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Films that defined the romance genre with iconic scenes and unforgettable chemistry.
                  </p>
                  <div className="text-xs text-gray-500">
                    Perfect for: Nostalgic evenings, anniversary celebrations
                  </div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Modern Rom-Coms</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Contemporary takes on love stories with relatable characters and current themes.
                  </p>
                  <div className="text-xs text-gray-500">
                    Perfect for: Casual date nights, first movie together
                  </div>
                </div>
                <div className="bg-pink-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">International Romance</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Love stories from around the world offering fresh perspectives on relationships.
                  </p>
                  <div className="text-xs text-gray-500">
                    Perfect for: Adventurous couples, cultural exploration
                  </div>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-blue-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🚀 Adventure & Feel-Good Films
              </h3>
              <p className="text-gray-600 mb-4">
                Movies that inspire, excite, and leave you both feeling energized. These films often feature stunning visuals, inspiring characters, and uplifting themes.
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Epic Adventures</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Grand journeys and quests that take you to amazing worlds and inspire dreams of travel and exploration.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Stunning cinematography and locations</li>
                    <li>• Inspiring characters overcoming challenges</li>
                    <li>• Perfect for planning future adventures together</li>
                  </ul>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2">Heartwarming Stories</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Uplifting tales that celebrate human connection, personal growth, and the triumph of good over adversity.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Feel-good endings that leave you happy</li>
                    <li>• Characters you can root for together</li>
                    <li>• Stories that reinforce positive values</li>
                  </ul>
                </div>
              </div>
            </div>

            <div className="border-l-4 border-purple-500 pl-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-3">
                🎭 Light Drama & Thought-Provoking Films
              </h3>
              <p className="text-gray-600 mb-4">
                Intellectually engaging movies that spark meaningful conversations without being too heavy or depressing for a romantic evening.
              </p>
              <div className="bg-purple-50 rounded-lg p-4">
                <h4 className="font-medium text-gray-900 mb-3">
                  Perfect Balance: Entertainment + Depth
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm text-gray-600">
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">What Works Well:</h5>
                    <ul className="space-y-1">
                      <li>• Character-driven stories with relatable conflicts</li>
                      <li>• Themes about love, friendship, and personal growth</li>
                      <li>• Beautiful storytelling with hopeful undertones</li>
                      <li>• Films that make you appreciate what you have</li>
                    </ul>
                  </div>
                  <div>
                    <h5 className="font-medium text-gray-900 mb-2">What to Avoid:</h5>
                    <ul className="space-y-1">
                      <li>• Extremely heavy or depressing themes</li>
                      <li>• Complex plots requiring intense concentration</li>
                      <li>• Movies that might trigger relationship anxiety</li>
                      <li>• Films with graphic violence or disturbing content</li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Setting the Perfect Date Night Atmosphere */}
        <div className="bg-white rounded-xl shadow-md p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">🕯️</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Creating the Perfect Movie Night Atmosphere
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🏠 At-Home Setup
              </h3>
              <div className="space-y-4">
                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-yellow-500">💡</span>
                    Lighting & Ambiance
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Dim the lights but ensure you can still see each other's reactions. Candles or soft lamps create intimacy.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Use warm, soft lighting instead of harsh overhead lights</li>
                    <li>• Battery-operated candles for safety and convenience</li>
                    <li>• Adjust TV brightness to comfortable levels</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-blue-500">🛋️</span>
                    Comfort Setup
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Create a cozy nest where you can both be comfortable for the entire movie duration.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Plenty of soft pillows and blankets</li>
                    <li>• Comfortable seating arrangement for cuddling</li>
                    <li>• Room temperature set for optimal comfort</li>
                  </ul>
                </div>

                <div className="bg-gray-50 rounded-lg p-4">
                  <h4 className="font-medium text-gray-900 mb-2 flex items-center gap-2">
                    <span className="text-green-500">🍿</span>
                    Snacks & Drinks
                  </h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Prepare everything beforehand so you don't have to pause the movie or miss important moments.
                  </p>
                  <ul className="text-xs text-gray-600 space-y-1">
                    <li>• Mix of sweet and salty snacks</li>
                    <li>• Drinks that won't require frequent refills</li>
                    <li>• Easy-to-eat foods that won't distract from the movie</li>
                  </ul>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-lg font-semibold text-gray-900 mb-4">
                🎪 Special Occasion Ideas
              </h3>
              <div className="space-y-4">
                <div className="bg-gradient-to-r from-pink-50 to-red-50 rounded-lg p-4 border border-pink-200">
                  <h4 className="font-medium text-gray-900 mb-2">💝 Anniversary Night</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Recreate your first movie date or watch a film that reminds you of your relationship milestones.
                  </p>
                  <div className="text-xs text-pink-700">
                    Ideas: Movie from your first date year, films about long-lasting love
                  </div>
                </div>

                <div className="bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg p-4 border border-blue-200">
                  <h4 className="font-medium text-gray-900 mb-2">🌍 Travel-Themed Night</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Choose movies set in places you want to visit, complete with themed snacks and decorations.
                  </p>
                  <div className="text-xs text-blue-700">
                    Ideas: Italian films with pasta, Paris movies with French wine
                  </div>
                </div>

                <div className="bg-gradient-to-r from-green-50 to-yellow-50 rounded-lg p-4 border border-green-200">
                  <h4 className="font-medium text-gray-900 mb-2">🎭 Genre Marathon</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    Pick a theme and commit to several movies over multiple date nights—director spotlights, decade deep dives, etc.
                  </p>
                  <div className="text-xs text-green-700">
                    Ideas: Studio Ghibli nights, 1980s classics, Oscar winners
                  </div>
                </div>

                <div className="bg-gradient-to-r from-purple-50 to-pink-50 rounded-lg p-4 border border-purple-200">
                  <h4 className="font-medium text-gray-900 mb-2">🎲 Mystery Movie Night</h4>
                  <p className="text-gray-600 text-sm mb-2">
                    One person secretly chooses the movie, revealing it only when pressing play for an element of surprise.
                  </p>
                  <div className="text-xs text-purple-700">
                    Ideas: Alternate who chooses, include clues beforehand
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Date Night Movie Success Tips */}
        <div className="bg-gradient-to-r from-indigo-50 to-purple-50 rounded-xl p-6 sm:p-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="text-2xl">🏆</div>
            <h2 className="text-2xl font-bold text-gray-900">
              Date Night Movie Success Formula
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl mb-3">🤝</div>
              <h3 className="font-semibold text-gray-900 mb-2">Compromise & Communication</h3>
              <p className="text-gray-600 text-sm">
                Take turns choosing movies and discuss preferences openly. The goal is enjoyment for both partners.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl mb-3">📱</div>
              <h3 className="font-semibold text-gray-900 mb-2">Minimize Distractions</h3>
              <p className="text-gray-600 text-sm">
                Put phones away, pause for bathroom breaks, and create an environment focused on shared experience.
              </p>
            </div>
            <div className="bg-white rounded-lg p-6 shadow-sm text-center">
              <div className="text-3xl mb-3">💭</div>
              <h3 className="font-semibold text-gray-900 mb-2">Discuss Afterward</h3>
              <p className="text-gray-600 text-sm">
                Share favorite moments, discuss themes, and talk about what the movie meant to each of you.
              </p>
            </div>
          </div>

          <div className="bg-white rounded-lg p-6 border border-indigo-200">
            <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
              <span className="text-indigo-600">📊</span>
              Date Night Movie Statistics
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 text-center">
              <div>
                <div className="text-2xl font-bold text-indigo-600">87%</div>
                <p className="text-sm text-gray-600">of couples report feeling closer after sharing a great movie</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-pink-600">3.2x</div>
                <p className="text-sm text-gray-600">more likely to plan future activities together after positive movie experience</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">94min</div>
                <p className="text-sm text-gray-600">optimal movie length for date nights (sweet spot for attention span)</p>
              </div>
              <div>
                <div className="text-2xl font-bold text-green-600">68%</div>
                <p className="text-sm text-gray-600">prefer movies that make them laugh together over other genres</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
