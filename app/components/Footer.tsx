import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300 py-8 sm:py-12 mt-auto overflow-x-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {/* Brand */}
          <div className="sm:col-span-2 lg:col-span-1">
            <h3 className="text-lg sm:text-xl font-bold text-blue-400 mb-3 sm:mb-4">
              SimilarMovie
            </h3>
            <p className="text-xs sm:text-sm">
              Discover movies similar to your favorites based on genres,
              ratings, and more. Find your next favorite film with our
              intelligent recommendation system.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Quick Links</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/"
                  className="hover:text-blue-400 transition-colors"
                >
                  Home
                </Link>
              </li>
              <li>
                <Link
                  href="/movies"
                  className="hover:text-blue-400 transition-colors"
                >
                  Browse Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/genres"
                  className="hover:text-blue-400 transition-colors"
                >
                  All Genres
                </Link>
              </li>
              <li>
                <Link
                  href="/movies/popular"
                  className="hover:text-blue-400 transition-colors"
                >
                  Popular Movies
                </Link>
              </li>
              <li>
                <Link
                  href="/movies/top-rated"
                  className="hover:text-blue-400 transition-colors"
                >
                  Top Rated
                </Link>
              </li>
            </ul>
          </div>

          {/* Tools */}
          <div>
            <h4 className="font-semibold text-white mb-3 sm:mb-4 text-sm sm:text-base">Movie Tools</h4>
            <ul className="space-y-1.5 sm:space-y-2 text-xs sm:text-sm">
              <li>
                <Link
                  href="/tools/pick-movie"
                  className="hover:text-blue-400 transition-colors"
                >
                  🎲 Pick a Movie
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/movie-recommender"
                  className="hover:text-blue-400 transition-colors"
                >
                  🎯 Movie Recommender
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/mood-finder"
                  className="hover:text-blue-400 transition-colors"
                >
                  🎭 Mood Finder
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/random-movie"
                  className="hover:text-blue-400 transition-colors"
                >
                  🎲 Random Movie
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/movie-comparison"
                  className="hover:text-blue-400 transition-colors"
                >
                  ⚖️ Movie Comparison
                </Link>
              </li>
              <li>
                <Link
                  href="/tools/date-night"
                  className="hover:text-blue-400 transition-colors"
                >
                  💕 Date Night Finder
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal */}
          <div>
            <h4 className="font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm">
              <li>
                <Link
                  href="/about"
                  className="hover:text-blue-400 transition-colors"
                >
                  About Us
                </Link>
              </li>
              <li>
                <Link
                  href="/contact"
                  className="hover:text-blue-400 transition-colors"
                >
                  Contact
                </Link>
              </li>
              <li>
                <Link
                  href="/privacy"
                  className="hover:text-blue-400 transition-colors"
                >
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link
                  href="/terms"
                  className="hover:text-blue-400 transition-colors"
                >
                  Terms of Service
                </Link>
              </li>
              <li>
                <Link
                  href="/disclaimer"
                  className="hover:text-blue-400 transition-colors"
                >
                  Disclaimer
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm">
          <p>
            &copy; {new Date().getFullYear()} SimilarMovie. All rights reserved.
          </p>
          <p className="mt-2">
            Movie data provided for educational and recommendation purposes. All
            movie titles, images, and descriptions are property of their
            respective owners.
          </p>
        </div>
      </div>
    </footer>
  );
}
