"use client";

import Link from "next/link";
import { useState } from "react";

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  return (
    <nav className="bg-gradient-to-r from-gray-900 via-black to-gray-900 text-white shadow-2xl border-b border-red-900/50 w-full">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          <div className="flex items-center min-w-0">
            <Link
              href="/"
              className="text-lg sm:text-xl font-bold text-transparent bg-gradient-to-r from-red-400 via-yellow-400 to-red-400 bg-clip-text hover:from-red-300 hover:via-yellow-300 hover:to-red-300 transition-all duration-300 truncate"
            >
              🎬 SimilarMovie
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link 
              href="/" 
              className="hover:text-red-400 transition-colors duration-200 font-medium hover:scale-105 transform"
            >
              Home
            </Link>
            <Link
              href="/movies"
              className="hover:text-red-400 transition-colors duration-200 font-medium hover:scale-105 transform"
            >
              🎥 Browse Movies
            </Link>
            <Link
              href="/genres"
              className="hover:text-red-400 transition-colors duration-200 font-medium hover:scale-105 transform"
            >
              🎭 Genres
            </Link>
            
            {/* Tools Dropdown */}
            <div className="relative group">
              <button className="hover:text-red-400 transition-colors duration-200 font-medium flex items-center">
                🛠️ Tools
                <svg className="ml-1 h-4 w-4 transition-transform group-hover:rotate-180" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </button>
              <div className="absolute top-full left-1/2 transform -translate-x-1/2 mt-2 w-80 bg-gradient-to-br from-gray-900 to-black rounded-xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 z-[9999] border border-red-900/50">
                <div className="p-3">
                  <Link
                    href="/tools/pick-movie"
                    className="block px-4 py-3 hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-[1.02] border border-transparent hover:border-red-500/30"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">🎲</span>
                      <div>
                        <div className="font-medium text-white">Pick a Movie</div>
                        <div className="text-xs text-gray-400">Let us choose for you</div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/tools/movie-recommender"
                    className="block px-4 py-3 hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-[1.02] border border-transparent hover:border-red-500/30"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">🎯</span>
                      <div>
                        <div className="font-medium text-white">Movie Recommender</div>
                        <div className="text-xs text-gray-400">Personalized suggestions</div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/tools/mood-finder"
                    className="block px-4 py-3 hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-[1.02] border border-transparent hover:border-red-500/30"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">🎭</span>
                      <div>
                        <div className="font-medium text-white">Mood Finder</div>
                        <div className="text-xs text-gray-400">Match your mood</div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/tools/random-movie"
                    className="block px-4 py-3 hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-[1.02] border border-transparent hover:border-red-500/30"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">🎰</span>
                      <div>
                        <div className="font-medium text-white">Random Movie</div>
                        <div className="text-xs text-gray-400">Surprise me!</div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/tools/movie-comparison"
                    className="block px-4 py-3 hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-[1.02] border border-transparent hover:border-red-500/30"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">⚖️</span>
                      <div>
                        <div className="font-medium text-white">Movie Comparison</div>
                        <div className="text-xs text-gray-400">Compare side by side</div>
                      </div>
                    </div>
                  </Link>
                  <Link
                    href="/tools/date-night"
                    className="block px-4 py-3 hover:bg-red-900/30 rounded-lg transition-all duration-200 hover:scale-[1.02] border border-transparent hover:border-red-500/30"
                  >
                    <div className="flex items-center">
                      <span className="text-xl mr-3">💕</span>
                      <div>
                        <div className="font-medium text-white">Date Night Finder</div>
                        <div className="text-xs text-gray-400">Perfect for couples</div>
                      </div>
                    </div>
                  </Link>
                </div>
              </div>
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 rounded-lg text-gray-300 hover:text-white hover:bg-red-900/30 focus:outline-none focus:ring-2 focus:ring-red-500 transition-all duration-200"
            >
              <span className="sr-only">Open main menu</span>
              <svg
                className={`${isMenuOpen ? "hidden" : "block"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
              <svg
                className={`${isMenuOpen ? "block" : "hidden"} h-6 w-6`}
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                aria-hidden="true"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      <div className={`${isMenuOpen ? "block" : "hidden"} md:hidden border-t border-red-900/50`}>
        <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3 bg-gradient-to-b from-black/50 to-gray-900/50 backdrop-blur">
          <Link
            href="/"
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-red-900/30 transition-all duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            🏠 Home
          </Link>
          <Link
            href="/movies"
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-red-900/30 transition-all duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            🎥 Browse Movies
          </Link>
          <Link
            href="/genres"
            className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-red-900/30 transition-all duration-200"
            onClick={() => setIsMenuOpen(false)}
          >
            🎭 Genres
          </Link>
          
          {/* Mobile Tools Section */}
          <div className="border-t border-gray-700 mt-2 pt-2">
            <div className="px-3 py-2 text-sm font-semibold text-gray-400 uppercase tracking-wider">
              Movie Tools
            </div>
            <Link
              href="/tools/pick-movie"
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-red-900/30 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              🎲 Pick a Movie
            </Link>
            <Link
              href="/tools/movie-recommender"
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-red-900/30 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              🎯 Movie Recommender
            </Link>
            <Link
              href="/tools/mood-finder"
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-red-900/30 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              🎭 Mood Finder
            </Link>
            <Link
              href="/tools/random-movie"
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-red-900/30 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              🎰 Random Movie
            </Link>
            <Link
              href="/tools/movie-comparison"
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-red-900/30 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              ⚖️ Movie Comparison
            </Link>
            <Link
              href="/tools/date-night"
              className="block px-3 py-2 rounded-lg text-base font-medium hover:bg-red-900/30 transition-all duration-200"
              onClick={() => setIsMenuOpen(false)}
            >
              💕 Date Night Finder
            </Link>
          </div>
        </div>
      </div>
    </nav>
  );
}
