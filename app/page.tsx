import { Metadata } from "next";
import Link from "next/link";
import {
  getPopularMovies,
  getTopRatedMovies,
  getRecentMovies,
  getMovieCount,
} from "../lib/database";
import { getCanonicalUrl } from "../lib/seo";
import MovieCard from "./components/MovieCard";
import Hero from "./components/Hero";

export const metadata: Metadata = {
  title: "Find Movies Like Your Favorites |SimilarMovie.me",
  description:
    "Discover movies similar to your favorites with AI-powered recommendations. Browse millions of films by genre and rating.",
  keywords: [
    "movie recommendations",
    "similar movies",
    "movie discovery",
    "film recommendations",
    "movie database",
    "find movies like",
    "movie similarity",
    "AI movie recommendations",
    "personalized movie suggestions",
    "cinema database",
  ].join(", "),
  authors: [{ name: "SimilarMovie" }],
  creator: "SimilarMovie",
  publisher: "SimilarMovie",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL("https://SimilarMovie.me"),
  alternates: {
    canonical: getCanonicalUrl(),
  },
  openGraph: {
    title: "Find Movies Like Your Favorites |SimilarMovie.me",
    description:
      "Discover movies similar to your favorites with AI-powered recommendations. Browse millions of films by genre and rating.",
    url: getCanonicalUrl(),
    siteName: "SimilarMovie",
    images: [
      {
        url: "/og-image.jpg",
        width: 1200,
        height: 630,
        alt: "SimilarMovie - Complete Movie Discovery Platform",
      },
    ],
    locale: "en_US",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Find Movies Like Your Favorites |SimilarMovie.me",
    description:
      "Discover movies similar to your favorites with AI-powered recommendations. Browse millions of films.",
    images: ["/og-image.jpg"],
    creator: "@SimilarMovie",
  },
  robots: {
    index: true,
    follow: true,
    nocache: true,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      "max-video-preview": -1,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
  verification: {
    google: "google-site-verification-code",
  },
};

export default async function HomePage() {
  const [popularMovies, topRatedMovies, recentMovies, totalMovies] =
    await Promise.all([
      getPopularMovies(8),
      getTopRatedMovies(8),
      getRecentMovies(8),
      getMovieCount(),
    ]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-black via-gray-900 to-red-950 overflow-x-hidden">
      {/* Hero Section with Search */}
      <Hero />

      {/* Popular Movies */}
      <section className="py-12 sm:py-16 lg:py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                🔥 Popular Movies
              </h2>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                Trending movies that everyone's talking about
              </p>
            </div>
            <Link
              href="/movies/popular"
              className="group bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-red-500/25 flex items-center space-x-2 text-sm sm:text-base"
            >
              <span>View All</span>
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {popularMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showWatchButton={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Top Rated Movies */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-r from-gray-900 to-black border-y border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                ⭐ Top Rated Movies
              </h2>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                Critically acclaimed films with the highest ratings
              </p>
            </div>
            <Link
              href="/movies/top-rated"
              className="group bg-gradient-to-r from-yellow-600 to-yellow-700 hover:from-yellow-500 hover:to-yellow-600 text-black px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-yellow-500/25 flex items-center space-x-2 text-sm sm:text-base"
            >
              <span>View All</span>
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {topRatedMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showWatchButton={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Recent Movies */}
      <section className="py-12 sm:py-16 lg:py-20 bg-gradient-to-br from-red-950 to-black">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 sm:mb-12 gap-4">
            <div>
              <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold text-white mb-2">
                🎬 Recent Releases
              </h2>
              <p className="text-gray-300 text-sm sm:text-base lg:text-lg">
                Latest movies fresh from the cinema
              </p>
            </div>
            <Link
              href="/movies/recent"
              className="group bg-gradient-to-r from-red-600 to-yellow-600 hover:from-red-500 hover:to-yellow-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-full font-semibold transition-all duration-300 shadow-lg hover:shadow-orange-500/25 flex items-center space-x-2 text-sm sm:text-base"
            >
              <span>View All</span>
              <svg
                className="w-3 h-3 sm:w-4 sm:h-4 transition-transform group-hover:translate-x-0.5"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {recentMovies.map((movie) => (
              <MovieCard key={movie.id} movie={movie} showWatchButton={true} />
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-16 bg-gradient-to-r from-black to-gray-900 border-y border-red-900/30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl sm:text-3xl font-bold text-white text-center mb-8 sm:mb-12">
            🎯 How It Works
          </h2>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-600/50">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">Find a Movie</h3>
              <p className="text-gray-300">
                Search or browse our extensive movie database to find films you
                love.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-yellow-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-yellow-600/50">
                <svg
                  className="w-8 h-8 text-yellow-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Get Recommendations
              </h3>
              <p className="text-gray-300">
                Our algorithm analyzes genres, ratings, and keywords to find
                similar movies.
              </p>
            </div>

            <div className="text-center">
              <div className="w-16 h-16 bg-red-900/30 rounded-full flex items-center justify-center mx-auto mb-4 border border-red-600/50">
                <svg
                  className="w-8 h-8 text-red-400"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-semibold mb-2 text-white">
                Discover New Favorites
              </h3>
              <p className="text-gray-300">
                Explore curated lists of similar movies and find your next
                favorite film.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Tools Section */}
      <section className="py-20 bg-gradient-to-br from-red-950 via-black to-gray-900 text-white relative overflow-hidden">
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-400 to-red-400">
              🛠️ Movie Discovery Tools
            </h2>
            <p className="text-xl text-gray-300 max-w-3xl mx-auto">
              Powerful cinematic tools to help you discover your next favorite movie
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Link
              href="/tools/pick-movie"
              className="group bg-gradient-to-br from-black/60 to-red-950/60 backdrop-blur-sm rounded-2xl p-8 hover:from-red-950/80 hover:to-black/80 transition-all duration-300 border border-red-800/30 hover:border-red-500/50 hover:scale-105 hover:shadow-2xl hover:shadow-red-500/20"
            >
              <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
                🎲
              </div>
              <h3 className="text-2xl font-bold mb-4 text-red-400 group-hover:text-red-300">
                Pick a Movie
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Can't decide what to watch? Let our smart tool pick a great
                movie for you based on your preferences and mood.
              </p>
            </Link>

            <Link
              href="/tools/movie-recommender"
              className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 hover:from-gray-700/80 hover:to-gray-800/80 transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
                🎯
              </div>
              <h3 className="text-2xl font-bold mb-4 text-green-400 group-hover:text-green-300">
                Movie Recommender
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Get personalized movie recommendations based on your favorite
                genres, ratings, and viewing history.
              </p>
            </Link>

            <Link
              href="/tools/date-night"
              className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 hover:from-gray-700/80 hover:to-gray-800/80 transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
                💕
              </div>
              <h3 className="text-2xl font-bold mb-4 text-pink-400 group-hover:text-pink-300">
                Date Night Finder
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Find the perfect movies for a romantic date night with curated
                selections that both of you will love.
              </p>
            </Link>

            <Link
              href="/tools/advanced-search"
              className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 hover:from-gray-700/80 hover:to-gray-800/80 transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
                🔍
              </div>
              <h3 className="text-2xl font-bold mb-4 text-purple-400 group-hover:text-purple-300">
                Advanced Search
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Use powerful filters to find movies by genre, rating, year,
                runtime, and many more criteria.
              </p>
            </Link>

            <Link
              href="/tools/watchlist"
              className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 hover:from-gray-700/80 hover:to-gray-800/80 transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
                📋
              </div>
              <h3 className="text-2xl font-bold mb-4 text-orange-400 group-hover:text-orange-300">
                My Watchlist
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Save movies to watch later and organize your personal film
                collection with custom lists.
              </p>
            </Link>

            <Link
              href="/tools/movie-comparison"
              className="group bg-gradient-to-br from-gray-800/80 to-gray-900/80 backdrop-blur-sm rounded-2xl p-8 hover:from-gray-700/80 hover:to-gray-800/80 transition-all duration-300 border border-white/10 hover:border-white/20 hover:scale-105 hover:shadow-2xl"
            >
              <div className="text-5xl mb-4 transition-transform group-hover:scale-110">
                ⚖️
              </div>
              <h3 className="text-2xl font-bold mb-4 text-cyan-400 group-hover:text-cyan-300">
                Movie Comparison
              </h3>
              <p className="text-gray-300 leading-relaxed">
                Compare two movies side by side to see their similarities,
                differences, and ratings.
              </p>
            </Link>
          </div>

          <div className="text-center mt-16">
            <Link
              href="/genres"
              className="group bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 px-10 py-4 rounded-full font-bold text-lg transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 inline-flex items-center space-x-3"
            >
              <svg
                className="w-6 h-6 transition-transform group-hover:scale-110"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path d="M7 3a1 1 0 000 2h6a1 1 0 100-2H7zM4 7a1 1 0 011-1h10a1 1 0 110 2H5a1 1 0 01-1-1zM2 11a2 2 0 012-2h12a2 2 0 012 2v4a2 2 0 01-2 2H4a2 2 0 01-2-2v-4z" />
              </svg>
              <span>Browse by Genre</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose SimilarMovie Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              🌟 Why Choose SimilarMovie?
            </h2>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              The most advanced movie discovery platform with intelligent
              recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Smart Algorithms
              </h3>
              <p className="text-gray-600">
                Advanced intelligent algorithms analyze movie patterns, genres,
                and user preferences to deliver highly accurate recommendations.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-green-500 to-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Massive Database
              </h3>
              <p className="text-gray-600">
                Over {totalMovies.toLocaleString()} movies from every genre,
                decade, and country. From classics to the latest releases.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-purple-500 to-pink-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M13 10V3L4 14h7v7l9-11h-7z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Lightning Fast
              </h3>
              <p className="text-gray-600">
                Get instant movie recommendations in seconds. No waiting, no
                loading - just immediate results tailored to your taste.
              </p>
            </div>

            <div className="text-center group">
              <div className="w-20 h-20 bg-gradient-to-r from-orange-500 to-red-600 rounded-full flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform duration-300">
                <svg
                  className="w-10 h-10 text-white"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                  />
                </svg>
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                100% Free
              </h3>
              <p className="text-gray-600">
                All features completely free forever. No hidden fees, no
                subscriptions, no premium tiers - just pure movie discovery.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Statistics Section */}
      <section className="py-16 bg-gradient-to-r from-blue-600 to-purple-600 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">
              📊 SimilarMovie by the Numbers
            </h2>
            <p className="text-blue-100 text-lg">
              Trusted by movie lovers worldwide
            </p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                {Math.floor(totalMovies / 1000)}K+
              </div>
              <div className="text-blue-200 font-medium">
                Movies in Database
              </div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                25+
              </div>
              <div className="text-blue-200 font-medium">Movie Genres</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                7
              </div>
              <div className="text-blue-200 font-medium">Discovery Tools</div>
            </div>
            <div className="group">
              <div className="text-4xl md:text-5xl font-bold mb-2 group-hover:scale-110 transition-transform duration-300">
                100%
              </div>
              <div className="text-blue-200 font-medium">Free Forever</div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20 bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              ❓ Frequently Asked Questions
            </h2>
            <p className="text-xl text-gray-600">
              Everything you need to know about finding your next favorite movie
            </p>
          </div>

          <div className="space-y-8">
            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                How does SimilarMovie's recommendation algorithm work?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our AI analyzes multiple factors including genres, directors,
                cast, plot keywords, user ratings, and viewing patterns. We use
                collaborative filtering and content-based filtering to find
                movies that share similar characteristics with films you already
                love. The more specific your preferences, the more accurate our
                recommendations become.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Is SimilarMovie really completely free?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Yes! SimilarMovie is 100% free with no hidden costs, premium
                tiers, or subscription fees. All our movie discovery tools,
                recommendations, and database access are completely free
                forever. We believe everyone should have access to great movie
                recommendations without barriers.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                How large is your movie database?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Our database contains over {totalMovies.toLocaleString()} movies
                spanning from silent films to the latest releases. We include
                movies from every genre, country, and decade, with detailed
                information about cast, crew, ratings, and plot summaries. Our
                database is continuously updated with new releases and classic
                films.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Can I save movies to watch later?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                Absolutely! Use our Watchlist tool to save movies you want to
                watch later. You can organize movies into custom lists, add
                personal notes, and track what you've watched. Your watchlist is
                saved locally in your browser, so it's always available when you
                return.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                What makes SimilarMovie different from other movie sites?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                SimilarMovie focuses exclusively on movie discovery and
                recommendations. Unlike streaming platforms or review sites,
                we're designed specifically to help you find movies you'll love
                based on films you already enjoy. Our intelligent tools,
                comprehensive database, and user-friendly interface make movie
                discovery both fun and effective.
              </p>
            </div>

            <div className="bg-white rounded-xl p-8 shadow-sm border border-gray-100">
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Do you show where I can watch the movies?
              </h3>
              <p className="text-gray-600 leading-relaxed">
                We focus on movie discovery and recommendations. For streaming
                availability, we recommend checking platforms like Netflix,
                Amazon Prime, Hulu, Disney+, or using services like JustWatch to
                find where specific movies are currently available in your
                region. Our goal is to help you discover great movies regardless
                of where you watch them.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Movie Discovery Tips */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-6">
              💡 Pro Tips for Movie Discovery
            </h2>
            <p className="text-xl text-gray-600">
              Get the most out of SimilarMovie with these expert recommendations
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <div className="bg-gradient-to-br from-blue-50 to-indigo-100 rounded-xl p-8 border border-blue-200">
              <div className="text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Be Specific
              </h3>
              <p className="text-gray-600">
                The more specific your movie preferences, the better our
                recommendations. Try searching for niche genres like
                "psychological thrillers" or "indie comedies" for more targeted
                results.
              </p>
            </div>

            <div className="bg-gradient-to-br from-green-50 to-emerald-100 rounded-xl p-8 border border-green-200">
              <div className="text-4xl mb-4">🔄</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Try Multiple Tools
              </h3>
              <p className="text-gray-600">
                Each discovery tool offers a different approach. Use the Movie
                Picker for random suggestions, Mood Finder for feeling-based
                recommendations, and Advanced Search for specific criteria.
              </p>
            </div>

            <div className="bg-gradient-to-br from-purple-50 to-violet-100 rounded-xl p-8 border border-purple-200">
              <div className="text-4xl mb-4">🎭</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Explore Genres
              </h3>
              <p className="text-gray-600">
                Don't limit yourself to familiar genres. Explore our genre pages
                to discover hidden gems in categories you might not normally
                consider.
              </p>
            </div>

            <div className="bg-gradient-to-br from-orange-50 to-amber-100 rounded-xl p-8 border border-orange-200">
              <div className="text-4xl mb-4">⭐</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Check Ratings
              </h3>
              <p className="text-gray-600">
                Use our top-rated movies section to find critically acclaimed
                films. High ratings often indicate movies with broad appeal and
                lasting quality.
              </p>
            </div>

            <div className="bg-gradient-to-br from-pink-50 to-rose-100 rounded-xl p-8 border border-pink-200">
              <div className="text-4xl mb-4">🕒</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Consider Era
              </h3>
              <p className="text-gray-600">
                Mix classic films with recent releases. Our database spans
                decades, so you can discover both timeless classics and
                contemporary masterpieces.
              </p>
            </div>

            <div className="bg-gradient-to-br from-teal-50 to-cyan-100 rounded-xl p-8 border border-teal-200">
              <div className="text-4xl mb-4">📝</div>
              <h3 className="text-xl font-bold text-gray-900 mb-4">
                Use Your Watchlist
              </h3>
              <p className="text-gray-600">
                Save interesting movies to your watchlist as you browse. This
                creates your personal collection of films to watch when you have
                time.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="py-20 bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            🎬 Ready to Discover Your Next Favorite Movie?
          </h2>
          <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed">
            Join thousands of movie lovers who use SimilarMovie to find amazing
            films every day
          </p>

          <div className="flex flex-col sm:flex-row gap-6 justify-center items-center">
            <Link
              href="/tools/pick-movie"
              className="group bg-white text-indigo-600 px-8 py-4 rounded-full font-bold text-lg hover:bg-gray-100 transition-all duration-300 shadow-xl hover:shadow-2xl hover:-translate-y-1 flex items-center space-x-3"
            >
              <span>🎲 Pick a Movie Now</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>

            <Link
              href="/genres"
              className="group bg-transparent border-2 border-white text-white px-8 py-4 rounded-full font-bold text-lg hover:bg-white hover:text-indigo-600 transition-all duration-300 flex items-center space-x-3"
            >
              <span>🎭 Browse Genres</span>
              <svg
                className="w-5 h-5 transition-transform group-hover:translate-x-1"
                fill="currentColor"
                viewBox="0 0 20 20"
              >
                <path
                  fillRule="evenodd"
                  d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z"
                  clipRule="evenodd"
                />
              </svg>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
