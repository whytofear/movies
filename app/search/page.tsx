"use client";

import { useEffect, useState, useRef, useCallback, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import MovieCard from "../components/MovieCard";
import LoadingSpinner from "../components/LoadingSpinner";
import Link from "next/link";
import { Movie } from "../../lib/supabase";
import { MagnifyingGlassIcon, XMarkIcon } from "@heroicons/react/24/outline";
import SearchBar from "../components/SearchBar";

interface SearchMovie extends Movie {
  // Override optional fields that might come from search API
  poster_path?: string;
  year?: number;
}

function SearchResults() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";
  const [searchInput, setSearchInput] = useState(query);
  const [results, setResults] = useState<SearchMovie[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoad, setInitialLoad] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [totalResults, setTotalResults] = useState(0);
  const observer = useRef<IntersectionObserver | null>(null);
  const loadingRef = useRef<HTMLDivElement>(null);
  const RESULTS_PER_PAGE = 20;

  // Search for movies on initial load and when query changes
  useEffect(() => {
    setPage(1);
    setResults([]);
    setHasMore(true);
    setError(null);

    if (query) {
      fetchSearchResults(1);
    } else {
      // Show popular movies if no query
      fetchPopularMovies(1);
    }
    setInitialLoad(false);
  }, [query]);

  // Setup intersection observer for infinite scrolling
  useEffect(() => {
    if (loading || !hasMore) return;
    
    const observerCallback = (entries: IntersectionObserverEntry[]) => {
      if (entries[0].isIntersecting && hasMore && !loading) {
        setPage((prevPage) => prevPage + 1);
      }
    };
    
    const options = {
      root: null,
      rootMargin: '100px',
      threshold: 0.1
    };
    
    const currentObserver = new IntersectionObserver(observerCallback, options);
    
    if (loadingRef.current) {
      currentObserver.observe(loadingRef.current);
    }
    
    return () => {
      if (currentObserver) {
        currentObserver.disconnect();
      }
    };
  }, [loading, hasMore, results.length]);

  // Load more movies when page changes
  useEffect(() => {
    if (page > 1) {
      if (query) {
        fetchSearchResults(page);
      } else {
        fetchPopularMovies(page);
      }
    }
  }, [page]);

  const fetchSearchResults = async (pageNum: number) => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `/api/search?q=${encodeURIComponent(query)}&page=${pageNum}&limit=${RESULTS_PER_PAGE}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch search results");
      }

      const data = await response.json();
      const movies = (data.movies || []).map((movie: any): SearchMovie => ({
        // Core Movie interface fields with defaults
        id: movie.id,
        title: movie.title || 'Unknown Title',
        vote_average: movie.vote_average || 0,
        vote_count: movie.vote_count || 0,
        status: movie.status || 'Released',
        release_date: movie.release_date || '',
        revenue: movie.revenue || 0,
        runtime: movie.runtime || 0,
        adult: movie.adult || false,
        additional_image: movie.additional_image || '',
        budget: movie.budget || 0,
        homepage: movie.homepage || '',
        original_language: movie.original_language || 'en',
        movie_name: movie.movie_name || movie.title || '',
        description: movie.description || movie.overview || '',
        popularity: movie.popularity || 0,
        posterurl: movie.posterurl || movie.poster_path || '',
        tagline: movie.tagline || '',
        genres: movie.genres || '',
        production_companies: movie.production_companies || '',
        production_countries: movie.production_countries || '',
        spoken_languages: movie.spoken_languages || '',
        keywords: movie.keywords || '',
        slug: movie.slug,
        // Additional fields for search
        poster_path: movie.poster_path,
        year: movie.year || (movie.release_date ? new Date(movie.release_date).getFullYear() : undefined),
      }));
      
      if (pageNum === 1) {
        setResults(movies);
        setTotalResults(data.total || movies.length || 0);
      } else {
        // Filter out duplicates when appending new results
        const newMovieIds = new Set(movies.map((m: SearchMovie) => m.id));
        const filteredCurrentMovies = results.filter((m) => !newMovieIds.has(m.id));
        setResults([...filteredCurrentMovies, ...movies]);
      }

      setHasMore(movies.length === RESULTS_PER_PAGE);
    } catch (err) {
      console.error("Error fetching search results:", err);
      setError("An error occurred while searching for movies");
    } finally {
      setLoading(false);
    }
  };

  const fetchPopularMovies = async (pageNum: number) => {
    try {
      setLoading(true);
      
      const response = await fetch(
        `/api/recommendations?page=${pageNum}&limit=${RESULTS_PER_PAGE}`
      );

      if (!response.ok) {
        throw new Error("Failed to fetch popular movies");
      }

      const data = await response.json();
      const movies = data.movies || [];

      if (pageNum === 1) {
        setResults(movies);
        setTotalResults(data.total || movies.length || 0);
      } else {
        // Filter out duplicates when appending new results
        const newMovieIds = new Set(movies.map((m: SearchMovie) => m.id));
        const filteredCurrentMovies = results.filter((m) => !newMovieIds.has(m.id));
        setResults([...filteredCurrentMovies, ...movies]);
      }

      setHasMore(movies.length === RESULTS_PER_PAGE);
    } catch (err) {
      console.error("Error fetching popular movies:", err);
      setError("An error occurred while fetching movies");
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query: string) => {
    if (query.trim()) {
      router.push(`/search?q=${encodeURIComponent(query.trim())}`);
    } else {
      router.push("/search");
    }
  };

  const clearSearch = () => {
    setSearchInput("");
    router.push("/search");
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <nav className="flex" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-4">
              <li>
                <Link href="/" className="text-gray-400 hover:text-gray-500">
                  Home
                </Link>
              </li>
              <li>
                <div className="flex items-center">
                  <svg
                    className="flex-shrink-0 h-5 w-5 text-gray-300"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                  >
                    <path
                      fillRule="evenodd"
                      d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                      clipRule="evenodd"
                    />
                  </svg>
                  <span className="ml-4 text-sm font-medium text-gray-900">
                    Search
                  </span>
                </div>
              </li>
            </ol>
          </nav>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Enhanced Search Input with our improved SearchBar component */}
        <div className="mb-8">
          <SearchBar
            expanded={true}
            initialQuery={query}
            onSearch={handleSearch}
            placeholder="Search for movies by title, actor, director, or genre..."
            className="w-full"
          />
        </div>

        {/* Search Results or Popular Movies Title */}
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900">
            {query ? `Search Results for "${query}"` : "Popular Movies"}
          </h1>
          {totalResults > 0 && query && (
            <p className="text-gray-600 mt-1">
              Found {totalResults.toLocaleString()} movies matching your search
            </p>
          )}
        </div>

        {/* Results Grid with Infinite Scroll */}
        {error ? (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg">
            {error}
          </div>
        ) : results.length > 0 ? (
          <>
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
              {results.map((movie, index) => (
                <div key={`${movie.id}-${index}`}>
                  <MovieCard movie={movie} />
                </div>
              ))}
            </div>
            
            {/* Loader element for infinite scroll - observed by intersection observer */}
            <div 
              ref={loadingRef} 
              className="w-full h-20 flex justify-center items-center mt-8"
            >
              {hasMore && !loading && results.length > 0 && (
                <div className="w-12 h-1 bg-gray-200 rounded-full"></div>
              )}
            </div>
          </>
        ) : !loading && !initialLoad ? (
          <div className="text-center py-16 bg-white rounded-lg shadow-sm">
            <div className="text-6xl mb-4">🎬</div>
            <h2 className="text-2xl font-medium text-gray-900 mb-2">
              No movies found
            </h2>
            <p className="text-gray-600 max-w-md mx-auto mb-6">
              Try adjusting your search terms or explore our popular movies collection below
            </p>
            <button 
              onClick={clearSearch}
              className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none"
            >
              Browse Popular Movies
            </button>
          </div>
        ) : null}

        {/* Loading State */}
        {loading && (
          <div className="flex justify-center items-center py-12">
            <LoadingSpinner size={results.length > 0 ? "md" : "lg"} color="blue" />
            <span className="ml-3 text-gray-600 font-medium">
              {results.length > 0 ? "Loading more movies..." : "Searching movies..."}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export default function SearchPage() {
  return (
    <Suspense
      fallback={
        <div className="container mx-auto px-4 py-8">
          <div className="flex justify-center py-12">
            <LoadingSpinner size="lg" color="blue" text="Loading search..." />
          </div>
        </div>
      }
    >
      <SearchResults />
    </Suspense>
  );
}
