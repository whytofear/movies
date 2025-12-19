import { Metadata } from "next";
import Link from "next/link";
import { getAllMovies } from "../../lib/database";
import MovieCard from "../components/MovieCard";
import { getCanonicalUrl } from "../../lib/seo";
import SearchBar from "../components/SearchBar";
import SearchExamples from "../components/SearchExamples";

export const metadata: Metadata = {
  title: "Movies Database - Browse All Films | SimilarMovie.me",
  description:
    "Browse our complete collection of movies with advanced search and filtering. Find detailed information, ratings, and discover similar films from our extensive database.",
  keywords:
    "all movies, movie collection, film database, movie catalog, browse movies, find movies, movie search, film directory, cinema database, movie finder",
  alternates: {
    canonical: getCanonicalUrl("/movies"),
  },
  openGraph: {
    title: "Movies Database - Browse All Films | SimilarMovie.me",
    description:
      "Browse our complete collection of movies with advanced search and filtering. Find detailed information, ratings, and discover similar films.",
    url: getCanonicalUrl("/movies"),
    type: "website",
  },
};

export default async function MoviesPage() {
  const movies = await getAllMovies();
  const featuredMovies = movies.slice(0, 12); // Show first 12 movies as featured

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-black to-gray-900">
      {/* Cinematic Header */}
      <div className="relative bg-gradient-to-r from-red-900 via-black to-red-900 border-b border-red-800/50">
        {/* Background pattern */}
        <div className="absolute inset-0 opacity-10">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.1'%3E%3Cpath d='M30 30c0-11.046-8.954-20-20-20s-20 8.954-20 20 8.954 20 20 20 20-8.954 20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="text-center text-white">
            <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold mb-4 sm:mb-6 text-transparent bg-gradient-to-r from-yellow-400 via-red-400 to-yellow-400 bg-clip-text">
              🎬 Movie Database
            </h1>
            <p className="text-lg sm:text-xl md:text-2xl text-gray-300 mb-6 sm:mb-8 max-w-3xl mx-auto px-4">
              Discover from our collection of{" "}
              <span className="text-yellow-400 font-bold">
                {movies.length.toLocaleString()}
              </span>{" "}
              carefully curated films
            </p>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap justify-center gap-2 sm:gap-4 mb-6 sm:mb-8 px-4">
              <Link
                href="/movies/popular"
                className="group px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                <span>🔥</span>
                <span className="hidden sm:inline">Popular Movies</span>
                <span className="sm:hidden">Popular</span>
              </Link>
              <Link
                href="/movies/top-rated"
                className="group px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-yellow-600 to-amber-600 hover:from-yellow-700 hover:to-amber-700 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                <span>⭐</span>
                <span className="hidden sm:inline">Top Rated</span>
                <span className="sm:hidden">Top</span>
              </Link>
              <Link
                href="/movies/recent"
                className="group px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-purple-600 to-purple-700 hover:from-purple-700 hover:to-purple-800 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                <span>🆕</span>
                <span className="hidden sm:inline">Recent Releases</span>
                <span className="sm:hidden">Recent</span>
              </Link>
              <Link
                href="/genres"
                className="group px-3 sm:px-6 py-2 sm:py-3 bg-gradient-to-r from-indigo-600 to-indigo-700 hover:from-indigo-700 hover:to-indigo-800 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-xl hover:scale-105 flex items-center space-x-1 sm:space-x-2 text-sm sm:text-base"
              >
                <span>🎭</span>
                <span className="hidden sm:inline">Browse Genres</span>
                <span className="sm:hidden">Genres</span>
              </Link>
            </div>
          </div>
        </div>
      </div>

      {/* Enhanced Search Section */}
      <div className="bg-gradient-to-r from-black via-gray-900 to-black py-8 sm:py-12 border-b border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-6 sm:mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold text-white mb-3 sm:mb-4">
              🔍 Find Your Perfect Movie
            </h2>
            <p className="text-gray-400 text-base sm:text-lg px-4">
              Search by title, actor, director, genre, or describe what you're
              looking for
            </p>
          </div>

          {/* Advanced Search Bar */}
          <div className="relative">
            <SearchBar
              expanded={true}
              showFilters={true}
              placeholder="Search movies, actors, genres, or try 'funny action movies from the 90s'..."
            />
          </div>

          {/* Search Tips */}
          <div className="mt-6 text-center">
            <p className="text-gray-500 text-sm mb-3">
              💡 Try these search examples:
            </p>
            <SearchExamples
              examples={[
                "Tom Hanks space movies",
                "funny action movies from the 90s",
                "romantic comedies with high ratings",
                "Christopher Nolan mind-bending films",
                "animated movies for families",
              ]}
            />
          </div>
        </div>
      </div>

      {/* Movie Discovery Tools */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="mb-16 bg-gradient-to-r from-red-900/20 via-black/50 to-red-900/20 rounded-2xl p-8 md:p-12 border border-red-800/30">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-white mb-4">
              🛠️ Movie Discovery Tools
            </h2>
            <p className="text-red-200 text-lg max-w-3xl mx-auto">
              Can't decide what to watch? Use our AI-powered tools to discover
              your perfect movie match
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <Link
              href="/tools/pick-movie"
              className="group bg-gradient-to-br from-red-900/40 to-black/60 backdrop-blur-sm rounded-xl p-6 hover:from-red-800/50 hover:to-black/70 transition-all duration-300 border border-red-800/30 hover:border-red-600/50 hover:scale-105"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                🎲
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Pick a Movie
              </h3>
              <p className="text-red-200 text-sm">
                Answer a few questions and let our AI pick the perfect movie for
                your mood
              </p>
            </Link>

            <Link
              href="/tools/mood-finder"
              className="group bg-gradient-to-br from-purple-900/40 to-black/60 backdrop-blur-sm rounded-xl p-6 hover:from-purple-800/50 hover:to-black/70 transition-all duration-300 border border-purple-800/30 hover:border-purple-600/50 hover:scale-105"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                🎭
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Mood Finder</h3>
              <p className="text-purple-200 text-sm">
                Discover movies that match your current mood and emotional state
              </p>
            </Link>

            <Link
              href="/tools/random-movie"
              className="group bg-gradient-to-br from-yellow-900/40 to-black/60 backdrop-blur-sm rounded-xl p-6 hover:from-yellow-800/50 hover:to-black/70 transition-all duration-300 border border-yellow-800/30 hover:border-yellow-600/50 hover:scale-105"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                🎰
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Random Movie
              </h3>
              <p className="text-yellow-200 text-sm">
                Feeling adventurous? Get a completely random movie
                recommendation
              </p>
            </Link>

            <Link
              href="/tools/date-night"
              className="group bg-gradient-to-br from-pink-900/40 to-black/60 backdrop-blur-sm rounded-xl p-6 hover:from-pink-800/50 hover:to-black/70 transition-all duration-300 border border-pink-800/30 hover:border-pink-600/50 hover:scale-105"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                💕
              </div>
              <h3 className="text-xl font-bold text-white mb-2">Date Night</h3>
              <p className="text-pink-200 text-sm">
                Find the perfect movie for you and your partner's date night
              </p>
            </Link>

            <Link
              href="/tools/movie-recommender"
              className="group bg-gradient-to-br from-blue-900/40 to-black/60 backdrop-blur-sm rounded-xl p-6 hover:from-blue-800/50 hover:to-black/70 transition-all duration-300 border border-blue-800/30 hover:border-blue-600/50 hover:scale-105"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                🎯
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Smart Recommender
              </h3>
              <p className="text-blue-200 text-sm">
                Get personalized recommendations based on your preferences
              </p>
            </Link>

            <Link
              href="/tools/movie-comparison"
              className="group bg-gradient-to-br from-green-900/40 to-black/60 backdrop-blur-sm rounded-xl p-6 hover:from-green-800/50 hover:to-black/70 transition-all duration-300 border border-green-800/30 hover:border-green-600/50 hover:scale-105"
            >
              <div className="text-3xl mb-4 group-hover:scale-110 transition-transform">
                ⚖️
              </div>
              <h3 className="text-xl font-bold text-white mb-2">
                Movie Comparison
              </h3>
              <p className="text-green-200 text-sm">
                Compare two movies side by side to make the best choice
              </p>
            </Link>
          </div>
        </div>

        {/* Featured Movies Section */}
        <div className="mb-16">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-3xl font-bold text-white">
              🎬 Featured Movies
            </h2>
            <Link
              href="/search"
              className="px-6 py-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white rounded-full font-medium transition-all duration-300 hover:scale-105"
            >
              View All Movies →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-6">
            {featuredMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} />
            ))}
          </div>
        </div>

        {/* Statistics */}
        <div className="bg-gradient-to-r from-gray-800 to-gray-900 rounded-xl p-8 border border-gray-700">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <div className="text-3xl font-bold text-yellow-400 mb-2">
                {movies.length.toLocaleString()}
              </div>
              <div className="text-gray-300">Movies in Database</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-red-400 mb-2">
                {
                  new Set(
                    movies
                      .map((m) => m.genres)
                      .join(",")
                      .split(",")
                  ).size
                }
              </div>
              <div className="text-gray-300">Unique Genres</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-purple-400 mb-2">
                {movies.length > 0
                  ? (
                      Math.round(
                        (movies.reduce((acc, m) => acc + m.vote_average, 0) /
                          movies.length) *
                          10
                      ) / 10
                    ).toFixed(1)
                  : "0.0"}
              </div>
              <div className="text-gray-300">Average Rating</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
