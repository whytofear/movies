"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MagnifyingGlassIcon, XMarkIcon, AdjustmentsHorizontalIcon, SparklesIcon } from "@heroicons/react/24/outline";

interface Movie {
  id: number;
  title: string;
  slug: string;
  year?: number;
  poster_path?: string;
  vote_average: number;
  genres?: string;
  titleHighlight?: string;
  descriptionHighlight?: string;
}

interface SearchFilters {
  genres: string[];
  minYear?: number;
  maxYear?: number;
  minRating?: number;
  maxRating?: number;
  sortBy: "relevance" | "rating" | "year" | "popularity";
  semantic: boolean;
}

interface SearchBarProps {
  className?: string;
  placeholder?: string;
  expanded?: boolean;
  onSearch?: (query: string) => void;
  initialQuery?: string;
  showFilters?: boolean;
}

export default function SearchBar({
  className = "",
  placeholder = "Search movies, actors, genres...",
  expanded = false,
  onSearch,
  initialQuery = "",
  showFilters = false,
}: SearchBarProps) {
  const [isSearching, setIsSearching] = useState(expanded);
  const [searchQuery, setSearchQuery] = useState(initialQuery);
  const [searchResults, setSearchResults] = useState<Movie[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFiltersPanel, setShowFiltersPanel] = useState(false);
  const [filters, setFilters] = useState<SearchFilters>({
    genres: [],
    sortBy: "relevance",
    semantic: false,
  });
  
  const searchRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  const availableGenres = [
    "Action", "Adventure", "Animation", "Comedy", "Crime", "Documentary",
    "Drama", "Family", "Fantasy", "Horror", "Music", "Mystery", "Romance",
    "Science Fiction", "Thriller", "War", "Western"
  ];

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        searchRef.current &&
        !searchRef.current.contains(event.target as Node)
      ) {
        setIsSearching(expanded);
        setShowFiltersPanel(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [expanded]);

  useEffect(() => {
    if (isSearching && inputRef.current) {
      inputRef.current.focus();
    }
  }, [isSearching]);

  useEffect(() => {
    setSearchQuery(initialQuery);
  }, [initialQuery]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length >= 2) {
        setIsLoading(true);
        try {
          const params = new URLSearchParams({
            q: searchQuery,
            limit: "8"
          });

          // Add filters to params
          if (filters.genres.length > 0) {
            params.append("genres", filters.genres.join(","));
          }
          if (filters.minYear) params.append("minYear", filters.minYear.toString());
          if (filters.maxYear) params.append("maxYear", filters.maxYear.toString());
          if (filters.minRating) params.append("minRating", filters.minRating.toString());
          if (filters.maxRating) params.append("maxRating", filters.maxRating.toString());
          params.append("sortBy", filters.sortBy);
          if (filters.semantic) params.append("semantic", "true");

          const response = await fetch(`/api/search?${params}`);
          if (response.ok) {
            const data = await response.json();
            setSearchResults(data.movies || []);
          }
        } catch (error) {
          console.error("Error searching movies:", error);
        } finally {
          setIsLoading(false);
        }
      } else {
        setSearchResults([]);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery, filters]);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      if (onSearch) {
        onSearch(searchQuery);
      } else {
        const params = new URLSearchParams({ q: searchQuery });
        
        // Add active filters to URL
        if (filters.genres.length > 0) {
          params.append("genres", filters.genres.join(","));
        }
        if (filters.minYear) params.append("minYear", filters.minYear.toString());
        if (filters.maxYear) params.append("maxYear", filters.maxYear.toString());
        if (filters.minRating) params.append("minRating", filters.minRating.toString());
        if (filters.maxRating) params.append("maxRating", filters.maxRating.toString());
        if (filters.sortBy !== "relevance") params.append("sortBy", filters.sortBy);
        if (filters.semantic) params.append("semantic", "true");
        
        router.push(`/search?${params}`);
      }
      if (!expanded) {
        setIsSearching(false);
      }
    }
  };

  const handleClear = () => {
    setSearchQuery("");
    setSearchResults([]);
    if (inputRef.current) {
      inputRef.current.focus();
    }
  };

  const toggleGenre = (genre: string) => {
    setFilters(prev => ({
      ...prev,
      genres: prev.genres.includes(genre)
        ? prev.genres.filter(g => g !== genre)
        : [...prev.genres, genre]
    }));
  };

  const clearFilters = () => {
    setFilters({
      genres: [],
      sortBy: "relevance",
      semantic: false,
    });
  };

  const hasActiveFilters = filters.genres.length > 0 || filters.minYear || filters.maxYear || 
                          filters.minRating || filters.maxRating || filters.semantic;

  return (
    <div ref={searchRef} className={`relative ${className}`}>
      {!isSearching ? (
        <div
          onClick={() => setIsSearching(true)}
          className="flex items-center w-full border-2 border-gray-700 rounded-xl shadow-lg hover:shadow-xl bg-gradient-to-r from-gray-900 to-gray-800 cursor-pointer transition-all duration-300 hover:border-red-500 group"
        >
          <MagnifyingGlassIcon className="h-5 w-5 text-red-400 ml-4 mr-3 flex-shrink-0 group-hover:text-red-300" />
          <span className="text-gray-300 truncate py-4 text-sm">{placeholder}</span>
          <div className="mr-4 ml-auto">
            <SparklesIcon className="h-4 w-4 text-yellow-400 opacity-60" />
          </div>
        </div>
      ) : (
        <div className="w-full z-50 bg-gradient-to-br from-gray-900 via-gray-800 to-black rounded-xl shadow-2xl overflow-hidden border-2 border-red-500/50 backdrop-blur-sm">
          <form onSubmit={handleSearchSubmit} className="flex items-center">
            <div className="flex-1 flex items-center">
              <MagnifyingGlassIcon className="h-5 w-5 text-red-400 ml-4 flex-shrink-0" />
              <input
                type="text"
                placeholder={placeholder}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full px-3 py-4 focus:outline-none text-white bg-transparent placeholder-gray-400 text-sm"
                autoFocus
                ref={inputRef}
              />
            </div>
            
            {/* Action Buttons */}
            <div className="flex items-center">
              {searchQuery && (
                <button
                  type="button"
                  onClick={handleClear}
                  className="p-2 text-gray-400 hover:text-red-400 transition-colors"
                  aria-label="Clear search"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
              
              {showFilters && (
                <button
                  type="button"
                  onClick={() => setShowFiltersPanel(!showFiltersPanel)}
                  className={`p-2 transition-colors ${
                    hasActiveFilters ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                  }`}
                  aria-label="Search filters"
                >
                  <AdjustmentsHorizontalIcon className="h-5 w-5" />
                </button>
              )}
              
              <button
                type="button"
                onClick={() => setFilters(prev => ({ ...prev, semantic: !prev.semantic }))}
                className={`p-2 mr-2 transition-colors ${
                  filters.semantic ? 'text-yellow-400' : 'text-gray-400 hover:text-yellow-400'
                }`}
                aria-label="Smart search"
                title="AI-powered natural language search"
              >
                <SparklesIcon className="h-5 w-5" />
              </button>
              
              {!expanded && (
                <button
                  type="button"
                  onClick={() => setIsSearching(false)}
                  className="p-3 text-gray-400 hover:text-red-400 mr-1"
                  aria-label="Close search"
                >
                  <XMarkIcon className="h-5 w-5" />
                </button>
              )}
            </div>
          </form>

          {/* Filters Panel */}
          {showFiltersPanel && (
            <div className="border-t border-gray-700 p-4 bg-black/30 backdrop-blur">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">Genres</label>
                  <div className="flex flex-wrap gap-1 max-h-32 overflow-y-auto">
                    {availableGenres.map(genre => (
                      <button
                        key={genre}
                        type="button"
                        onClick={() => toggleGenre(genre)}
                        className={`px-2 py-1 text-xs rounded-full border transition-colors ${
                          filters.genres.includes(genre)
                            ? 'bg-red-600 border-red-500 text-white'
                            : 'border-gray-600 text-gray-300 hover:border-red-500'
                        }`}
                      >
                        {genre}
                      </button>
                    ))}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Min Year</label>
                      <input
                        type="number"
                        placeholder="1900"
                        min="1900"
                        max="2030"
                        value={filters.minYear || ""}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          minYear: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-xs text-gray-300 mb-1">Max Year</label>
                      <input
                        type="number"
                        placeholder="2030"
                        min="1900"
                        max="2030"
                        value={filters.maxYear || ""}
                        onChange={(e) => setFilters(prev => ({ 
                          ...prev, 
                          maxYear: e.target.value ? parseInt(e.target.value) : undefined 
                        }))}
                        className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-white focus:border-red-500 focus:outline-none"
                      />
                    </div>
                  </div>
                  
                  <div>
                    <label className="block text-xs text-gray-300 mb-1">Sort By</label>
                    <select
                      value={filters.sortBy}
                      onChange={(e) => setFilters(prev => ({ 
                        ...prev, 
                        sortBy: e.target.value as typeof filters.sortBy 
                      }))}
                      className="w-full px-2 py-1 text-xs bg-gray-800 border border-gray-600 rounded text-white focus:border-red-500 focus:outline-none"
                    >
                      <option value="relevance">Relevance</option>
                      <option value="rating">Rating</option>
                      <option value="year">Year</option>
                      <option value="popularity">Popularity</option>
                    </select>
                  </div>
                  
                  {hasActiveFilters && (
                    <button
                      type="button"
                      onClick={clearFilters}
                      className="text-xs text-red-400 hover:text-red-300 underline"
                    >
                      Clear all filters
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Loading State */}
          {isLoading && (
            <div className="px-4 py-3 text-gray-400 text-sm flex items-center border-t border-gray-700 bg-black/20">
              <svg className="animate-spin -ml-1 mr-3 h-4 w-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              {filters.semantic ? "AI is thinking..." : "Searching..."}
            </div>
          )}

          {/* Search Results */}
          {searchResults.length > 0 && !isLoading && (
            <div className="max-h-96 overflow-y-auto border-t border-gray-700">
              <ul className="divide-y divide-gray-700">
                {searchResults.map((movie) => (
                  <li key={movie.id}>
                    <Link
                      href={`/similar-to/${encodeURIComponent(movie.slug)}`}
                      className="flex items-center px-4 py-3 hover:bg-red-900/20 transition-all duration-200 group"
                      onClick={() => !expanded && setIsSearching(false)}
                    >
                      {movie.poster_path && (
                        <img 
                          src={`https://image.tmdb.org/t/p/w92${movie.poster_path}`} 
                          alt={movie.title}
                          className="w-10 h-15 object-cover rounded mr-3 ring-1 ring-gray-600 group-hover:ring-red-500 transition-all"
                          onError={(e) => {
                            (e.target as HTMLImageElement).style.display = 'none';
                          }}
                        />
                      )}
                      <div className="flex-1">
                        <div className="font-medium text-white group-hover:text-red-300 transition-colors">
                          {movie.titleHighlight ? (
                            <span dangerouslySetInnerHTML={{ __html: movie.titleHighlight }} />
                          ) : (
                            movie.title
                          )}
                        </div>
                        <div className="flex items-center space-x-2 text-xs text-gray-400">
                          {movie.year && <span>{movie.year}</span>}
                          {movie.vote_average > 0 && (
                            <span className="flex items-center">
                              <span className="text-yellow-400">★</span>
                              <span className="ml-1">{movie.vote_average.toFixed(1)}</span>
                            </span>
                          )}
                          {movie.genres && (
                            <span className="truncate">{movie.genres.split(',')[0]?.trim()}</span>
                          )}
                        </div>
                      </div>
                    </Link>
                  </li>
                ))}
              </ul>
              
              {/* View All Results Button */}
              <div className="p-3 border-t border-gray-700 bg-black/30">
                <button
                  onClick={handleSearchSubmit}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white py-2 px-4 rounded-lg text-sm font-medium transition-all duration-200 flex items-center justify-center group"
                >
                  <MagnifyingGlassIcon className="h-4 w-4 mr-2 group-hover:scale-110 transition-transform" /> 
                  View all results for "{searchQuery}"
                </button>
              </div>
            </div>
          )}

          {/* No Results State */}
          {searchQuery.length >= 2 && searchResults.length === 0 && !isLoading && (
            <div className="px-4 py-6 text-gray-400 text-sm flex flex-col items-center border-t border-gray-700 bg-black/20">
              <span className="text-3xl mb-2">🎬</span>
              <span className="font-medium text-gray-300">No movies found</span>
              <span className="mt-1 text-center">
                Try different keywords or use the {" "}
                <button 
                  onClick={() => setFilters(prev => ({ ...prev, semantic: true }))}
                  className="text-yellow-400 hover:text-yellow-300 underline"
                >
                  AI search
                </button>
              </span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
