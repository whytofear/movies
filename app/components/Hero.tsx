"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon } from "@heroicons/react/24/outline";

export default function Hero() {
  const [query, setQuery] = useState("");
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query)}`);
    }
  };

  return (
    <div className="relative flex flex-col items-center justify-center py-8 sm:py-12 lg:py-16 xl:py-24 bg-gradient-to-br from-black via-gray-900 to-red-950 text-white text-center overflow-hidden w-full">
      {/* Cinematic Background Pattern */}
      <div className="absolute inset-0 opacity-15">
        <div
          className="absolute inset-0"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23dc2626' fill-opacity='0.08'%3E%3Cpath d='M40 0l20 20-20 20-20-20z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}
        />
      </div>

      {/* Film Strip Decoration */}
      <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 opacity-60"></div>
      <div className="absolute bottom-0 left-0 w-full h-2 bg-gradient-to-r from-red-600 via-yellow-500 to-red-600 opacity-60"></div>

      <div className="relative z-10 space-y-4 sm:space-y-6 lg:space-y-8 px-4 w-full max-w-5xl">
        <div className="space-y-3 sm:space-y-4 lg:space-y-6">
          <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-extrabold tracking-tight leading-tight px-2">
            🎬 Find Your Next{" "}
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-red-400 via-yellow-400 to-red-500">
              Perfect Movie
            </span>
          </h1>
          <p className="text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl max-w-3xl mx-auto text-gray-300 leading-relaxed px-4">
            Discover movies similar to your favorites using our advanced
            AI-powered recommendation engine. Explore over 1 million+ movies with
            cinematic precision and personalized suggestions.
          </p>
        </div>

        <div className="max-w-2xl mx-auto w-full">
          <form onSubmit={handleSearch} className="relative group">
            <div className="absolute inset-0 bg-gradient-to-r from-red-600 to-yellow-600 rounded-full opacity-20 group-hover:opacity-30 transition-opacity duration-300 blur-sm"></div>
            <div className="relative">
              <input
                type="text"
                placeholder="Search for a movie, actor, or genre..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full py-3 sm:py-4 px-4 sm:px-6 pl-12 sm:pl-14 text-sm sm:text-lg rounded-full bg-black/40 backdrop-blur-sm border border-red-800/50 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-red-500 transition-all duration-300 hover:bg-black/50"
              />
              <MagnifyingGlassIcon className="absolute left-3 sm:left-5 top-1/2 transform -translate-y-1/2 h-5 w-5 sm:h-6 sm:w-6 text-red-400" />
              <button
                type="submit"
                className="absolute right-1 sm:right-2 top-1/2 transform -translate-y-1/2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-3 sm:px-6 py-1.5 sm:py-2 rounded-full transition-all duration-300 font-medium shadow-lg hover:shadow-red-500/25 hover:scale-105 text-sm sm:text-base"
              >
                🎬 Search
              </button>
            </div>
          </form>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 mt-8 sm:mt-12 max-w-4xl mx-auto px-2">
          <div className="text-center p-4 sm:p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-red-900/30 hover:border-red-600/50 transition-all duration-300 hover:scale-105">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🎯</div>
            <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-1 sm:mb-2">AI-Powered Recommendations</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Get personalized movie suggestions based on your preferences</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-red-900/30 hover:border-red-600/50 transition-all duration-300 hover:scale-105">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🔍</div>
            <h3 className="text-base sm:text-lg font-semibold text-yellow-400 mb-1 sm:mb-2">Advanced Search</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Find movies by genre, year, rating, cast, and more</p>
          </div>
          <div className="text-center p-4 sm:p-6 bg-black/30 backdrop-blur-sm rounded-xl border border-red-900/30 hover:border-red-600/50 transition-all duration-300 hover:scale-105 sm:col-span-2 lg:col-span-1">
            <div className="text-2xl sm:text-3xl mb-2 sm:mb-3">🎭</div>
            <h3 className="text-base sm:text-lg font-semibold text-red-400 mb-1 sm:mb-2">Discover Hidden Gems</h3>
            <p className="text-gray-400 text-xs sm:text-sm">Explore curated collections and trending movies</p>
          </div>
        </div>
      </div>
    </div>
  );
}
