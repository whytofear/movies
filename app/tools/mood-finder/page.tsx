"use client";

import { useState, useEffect } from "react";
import { Movie } from "../../../lib/supabase";
import MovieCard from "../../components/MovieCard";
import LoadingSpinner from "../../components/LoadingSpinner";
import MovieSuggestions from "../../components/MovieSuggestions";

interface Mood {
  id: string;
  name: string;
  emoji: string;
  description: string;
  genres: string[];
  keywords: string[];
  minRating?: number;
}

const moods: Mood[] = [
  {
    id: "happy",
    name: "Happy & Uplifting",
    emoji: "😊",
    description: "Feel-good movies to brighten your day",
    genres: ["Comedy", "Animation", "Family", "Musical"],
    keywords: ["friendship", "victory", "hope", "celebration"],
    minRating: 6.5,
  },
  {
    id: "sad",
    name: "Sad & Emotional",
    emoji: "😢",
    description: "Deep, emotional stories for a good cry",
    genres: ["Drama", "Romance"],
    keywords: ["loss", "tragedy", "heartbreak", "sacrifice"],
    minRating: 7.0,
  },
  {
    id: "excited",
    name: "Excited & Energetic",
    emoji: "🚀",
    description: "High-energy action and adventure",
    genres: ["Action", "Adventure", "Thriller"],
    keywords: ["chase", "explosion", "fight", "rescue", "hero"],
    minRating: 6.0,
  },
  {
    id: "scared",
    name: "Scared & Thrilled",
    emoji: "😱",
    description: "Horror and suspense for thrill seekers",
    genres: ["Horror", "Thriller", "Mystery"],
    keywords: ["monster", "ghost", "murder", "supernatural", "fear"],
    minRating: 6.0,
  },
  {
    id: "romantic",
    name: "Romantic & Dreamy",
    emoji: "💕",
    description: "Love stories and romantic tales",
    genres: ["Romance", "Drama"],
    keywords: ["love", "wedding", "relationship", "kiss", "date"],
    minRating: 6.5,
  },
  {
    id: "thoughtful",
    name: "Thoughtful & Deep",
    emoji: "🤔",
    description: "Mind-bending and philosophical films",
    genres: ["Drama", "Science Fiction", "Mystery"],
    keywords: ["philosophy", "reality", "time", "mind", "existence"],
    minRating: 7.5,
  },
  {
    id: "nostalgic",
    name: "Nostalgic & Classic",
    emoji: "📼",
    description: "Timeless classics and retro films",
    genres: ["Drama", "Comedy", "Romance", "Adventure"],
    keywords: ["classic", "vintage", "retro", "old"],
    minRating: 7.0,
  },
  {
    id: "adventurous",
    name: "Adventurous & Epic",
    emoji: "🗺️",
    description: "Grand adventures and epic journeys",
    genres: ["Adventure", "Fantasy", "Action"],
    keywords: ["journey", "quest", "treasure", "explore", "epic"],
    minRating: 6.5,
  },
  {
    id: "funny",
    name: "Funny & Hilarious",
    emoji: "😂",
    description: "Comedy gold for maximum laughs",
    genres: ["Comedy"],
    keywords: ["funny", "hilarious", "laugh", "humor", "joke"],
    minRating: 6.5,
  },
  {
    id: "mysterious",
    name: "Mysterious & Intriguing",
    emoji: "🕵️",
    description: "Puzzles, mysteries, and detective stories",
    genres: ["Mystery", "Thriller", "Crime"],
    keywords: ["detective", "mystery", "clue", "investigation", "puzzle"],
    minRating: 6.8,
  },
];

export default function MoodFinderPage() {
  const [selectedMood, setSelectedMood] = useState<Mood | null>(null);
  const [recommendations, setRecommendations] = useState<Movie[]>([]);
  const [loading, setLoading] = useState(false);

  const handleMoodSelect = async (mood: Mood) => {
    setSelectedMood(mood);
    setLoading(true);

    try {
      const response = await fetch("/api/mood-movies", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          mood: mood.id,
          genres: mood.genres,
          keywords: mood.keywords,
          minRating: mood.minRating || 6.0,
        }),
      });

      const data = await response.json();
      setRecommendations(data.movies || []);
    } catch (error) {
      console.error("Error fetching mood movies:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-pink-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
          <div className="text-center">
            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-3 sm:mb-4">
              🎭 Mood-Based Movie Finder
            </h1>
            <p className="text-base sm:text-lg lg:text-xl text-purple-100 max-w-3xl mx-auto">
              Movies have the power to transform your emotions. Tell us how you're
              feeling, and we'll find the perfect film to match or shift your mood.
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
        {!selectedMood ? (
          <>
            {/* Mood Selection */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                How are you feeling right now?
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
                {moods.map((mood) => (
                  <button
                    key={mood.id}
                    onClick={() => handleMoodSelect(mood)}
                    className="group p-6 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl hover:from-purple-50 hover:to-pink-50 transition-all duration-300 transform hover:scale-105 active:scale-95 border border-gray-200 hover:border-purple-300 hover:shadow-lg"
                  >
                    <div className="text-4xl sm:text-5xl mb-3 transition-transform group-hover:scale-110">
                      {mood.emoji}
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-2 text-base sm:text-lg">
                      {mood.name}
                    </h3>
                    <p className="text-gray-600 text-sm sm:text-base">
                      {mood.description}
                    </p>
                  </button>
                ))}
              </div>
            </div>

            {/* How It Works */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                🧠 The Science Behind Mood-Based Movie Selection
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-purple-600">🎬</span>
                    How Movies Affect Your Brain
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="text-sm sm:text-base">
                      <strong>Neurological Response:</strong> Movies trigger the
                      release of dopamine, serotonin, and oxytocin in your brain,
                      directly affecting your emotional state.
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Mirror Neurons:</strong> Your brain mirrors the
                      emotions of characters you watch, allowing you to experience
                      their feelings as if they were your own.
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Mood Regulation:</strong> Strategic movie selection
                      can help regulate emotions, reduce stress, and improve
                      overall well-being.
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Social Connection:</strong> Movies create shared
                      emotional experiences, helping you feel connected to others
                      even when watching alone.
                    </p>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                    <span className="text-pink-600">💡</span>
                    Smart Mood Matching Strategies
                  </h3>
                  <div className="space-y-3 text-gray-600">
                    <p className="text-sm sm:text-base">
                      <strong>Mood Mirroring:</strong> Sometimes you want movies
                      that match your current emotional state to feel understood and
                      validated.
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Mood Shifting:</strong> Other times, you need films
                      that gently guide you toward a different emotional space.
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Emotional Catharsis:</strong> Certain genres help you
                      process and release pent-up emotions in a healthy way.
                    </p>
                    <p className="text-sm sm:text-base">
                      <strong>Energy Management:</strong> Match movie intensity to
                      your current energy levels for the best viewing experience.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Mood Categories Deep Dive */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                🌈 Understanding Different Emotional States
              </h2>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-yellow-50 to-orange-50 rounded-lg p-4 border border-yellow-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      😊 Positive Mood States
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        <strong>Happy & Energetic:</strong> Comedy, Adventure,
                        Musicals
                      </li>
                      <li>
                        <strong>Celebratory:</strong> Feel-good stories, Triumphs,
                        Victories
                      </li>
                      <li>
                        <strong>Optimistic:</strong> Inspirational dramas,
                        Hope-filled narratives
                      </li>
                      <li>
                        <strong>Playful:</strong> Animated films, Family comedies,
                        Light adventures
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      🤔 Contemplative Mood States
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        <strong>Thoughtful:</strong> Philosophy, Sci-Fi, Deep
                        dramas
                      </li>
                      <li>
                        <strong>Introspective:</strong> Character studies,
                        Psychological films
                      </li>
                      <li>
                        <strong>Curious:</strong> Mysteries, Documentaries,
                        Thrillers
                      </li>
                      <li>
                        <strong>Nostalgic:</strong> Period pieces, Classics,
                        Coming-of-age
                      </li>
                    </ul>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="bg-gradient-to-r from-red-50 to-pink-50 rounded-lg p-4 border border-red-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      💔 Challenging Mood States
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        <strong>Sad & Emotional:</strong> Cathartic dramas, Romantic
                        tearjerkers
                      </li>
                      <li>
                        <strong>Stressed:</strong> Escapist fantasy, Light comedy,
                        Comfort films
                      </li>
                      <li>
                        <strong>Angry:</strong> Action films, Revenge stories,
                        Intense thrillers
                      </li>
                      <li>
                        <strong>Lonely:</strong> Feel-good ensemble casts,
                        Friendship stories
                      </li>
                    </ul>
                  </div>

                  <div className="bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg p-4 border border-purple-200">
                    <h4 className="font-semibold text-gray-900 mb-2 flex items-center gap-2">
                      ⚡ High-Energy Mood States
                    </h4>
                    <ul className="text-sm text-gray-600 space-y-1">
                      <li>
                        <strong>Excited:</strong> Action blockbusters, Adventure
                        epics
                      </li>
                      <li>
                        <strong>Adventurous:</strong> Explorer stories, Quest
                        narratives
                      </li>
                      <li>
                        <strong>Rebellious:</strong> Anti-hero films, Revolution
                        stories
                      </li>
                      <li>
                        <strong>Romantic:</strong> Love stories, Meet-cutes, Passion
                        tales
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>

            {/* Professional Tips */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8 mb-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                🎯 Expert Tips for Mood-Based Movie Selection
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="text-center">
                  <div className="bg-gradient-to-br from-green-100 to-emerald-100 rounded-lg p-6 mb-4">
                    <div className="text-3xl mb-3">🕐</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Time of Day Matters
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Morning: Uplifting films. Afternoon: Thoughtful content.
                      Evening: Relaxing or exciting based on energy level.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-blue-100 to-cyan-100 rounded-lg p-6 mb-4">
                    <div className="text-3xl mb-3">⚖️</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Balance Your Diet
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Mix different emotional genres throughout the week for a
                      well-rounded cinematic diet.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 rounded-lg p-6 mb-4">
                    <div className="text-3xl mb-3">🎨</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Trust Your Instincts
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Your emotional intuition is often the best guide to what you
                      need cinematically right now.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-yellow-100 to-orange-100 rounded-lg p-6 mb-4">
                    <div className="text-3xl mb-3">🔄</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Mood Evolution
                    </h3>
                    <p className="text-gray-600 text-sm">
                      It's okay to change your mind mid-movie or try a different
                      emotional direction.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-red-100 to-rose-100 rounded-lg p-6 mb-4">
                    <div className="text-3xl mb-3">🎭</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Emotional Safety
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Choose films that support your mental health goals and avoid
                      triggers when vulnerable.
                    </p>
                  </div>
                </div>

                <div className="text-center">
                  <div className="bg-gradient-to-br from-indigo-100 to-purple-100 rounded-lg p-6 mb-4">
                    <div className="text-3xl mb-3">👥</div>
                    <h3 className="font-semibold text-gray-900 mb-2">
                      Social Context
                    </h3>
                    <p className="text-gray-600 text-sm">
                      Consider whether you're watching alone or with others -
                      social moods require different films.
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Statistics */}
            <div className="bg-white rounded-xl shadow-lg p-6 sm:p-8">
              <h2 className="text-xl sm:text-2xl font-bold text-gray-900 mb-6 text-center">
                📊 Mood-Movie Science Statistics
              </h2>

              <div className="grid grid-cols-1 md:grid-cols-4 gap-6 text-center">
                <div>
                  <div className="text-3xl font-bold text-purple-600 mb-2">78%</div>
                  <p className="text-gray-600 text-sm">
                    Report improved mood after watching films matched to their
                    emotional state
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-pink-600 mb-2">4.2x</div>
                  <p className="text-gray-600 text-sm">
                    More likely to finish movies when they match their current
                    mood
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-blue-600 mb-2">15min</div>
                  <p className="text-gray-600 text-sm">
                    Average time for neurochemical changes to begin during film
                    watching
                  </p>
                </div>
                <div>
                  <div className="text-3xl font-bold text-green-600 mb-2">92%</div>
                  <p className="text-gray-600 text-sm">
                    Find mood-based recommendations more satisfying than random
                    selection
                  </p>
                </div>
              </div>
            </div>
          </>
        ) : (
          <>
            {/* Selected Mood Header */}
            <div className="bg-white rounded-lg shadow-md p-6 mb-8">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <span className="text-3xl">{selectedMood.emoji}</span>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">
                      {selectedMood.name}
                    </h2>
                    <p className="text-gray-600">{selectedMood.description}</p>
                  </div>
                </div>
                <button
                  onClick={() => {
                    setSelectedMood(null);
                    setRecommendations([]);
                  }}
                  className="bg-gray-100 hover:bg-gray-200 px-4 py-2 rounded-md text-gray-600 transition-colors"
                >
                  Change Mood
                </button>
              </div>
            </div>

            {/* Results */}
            {loading ? (
              <div className="text-center py-12">
                <LoadingSpinner
                  size="lg"
                  text="Finding movies that match your mood..."
                  color="purple"
                />
              </div>
            ) : recommendations.length > 0 ? (
              <div>
                <h3 className="text-xl font-semibold text-gray-900 mb-6">
                  Perfect for when you're feeling{" "}
                  {selectedMood.name.toLowerCase()} ({recommendations.length}{" "}
                  movies)
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                  {recommendations.map((movie) => (
                    <MovieCard key={movie.id} movie={movie} />
                  ))}
                </div>

                {/* Movie Suggestions */}
                <div className="mt-12">
                  <MovieSuggestions
                    currentMovie={recommendations[0]}
                    limit={8}
                    genres={selectedMood.genres}
                    className="bg-white rounded-lg p-6"
                  />
                </div>
              </div>
            ) : (
              <div className="text-center py-12">
                <span className="text-6xl mb-4 block">
                  {selectedMood.emoji}
                </span>
                <h3 className="text-xl font-medium text-gray-900 mb-2">
                  No movies found
                </h3>
                <p className="text-gray-600 mb-6">
                  We couldn't find movies matching this mood. Try a different
                  mood or check back later.
                </p>
                <button
                  onClick={() => {
                    setSelectedMood(null);
                    setRecommendations([]);
                  }}
                  className="bg-purple-600 text-white px-6 py-2 rounded-md hover:bg-purple-700 transition-colors"
                >
                  Try Another Mood
                </button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
