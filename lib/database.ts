import { supabase, Movie } from "./supabase";
import { slugify, slugToSearchPattern } from "./utils";
import { memoryCache, CACHE_TTL } from "./cache";

/**
 * Get all movies from database with caching
 */
export async function getAllMovies(): Promise<Movie[]> {
  const cacheKey = "all_movies";
  const cached = memoryCache.get<Movie[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("popularity", { ascending: false });

  if (error) {
    console.error("Error fetching movies:", error);
    return [];
  }

  // Ensure all movies have slugs
  const movies = (data || []).map((movie) => ({
    ...movie,
    slug: movie.slug || slugify(movie.title),
  }));

  memoryCache.set(cacheKey, movies, CACHE_TTL.LONG);
  return movies;
}

/**
 * Get movie by slug with caching
 * Updated to use the dedicated slug column
 */
export async function getMovieBySlug(slug: string): Promise<Movie | null> {
  const cacheKey = `movie_slug:${slug}`;
  const cached = memoryCache.get<Movie | null>(cacheKey);
  if (cached !== null) return cached;

  // First try to find by the exact slug in the database
  let { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("slug", slug)
    .single();

  // If not found by slug, fall back to searching by title converted to slug
  if (error) {
    const searchPattern = slugToSearchPattern(slug);

    // Try matching by title
    const fuzzyResult = await supabase
      .from("movies")
      .select("*")
      .ilike("title", `%${searchPattern}%`)
      .order("popularity", { ascending: false })
      .limit(1)
      .single();

    data = fuzzyResult.data;
    error = fuzzyResult.error;

    // If still not found, try breaking up the search pattern into words for more flexible matching
    if (error && searchPattern.includes(" ")) {
      const words = searchPattern.split(" ").filter((word) => word.length > 2);
      if (words.length > 0) {
        // Try to match using the most significant words from the title
        const significantWord = words[0]; // Usually first word is significant
        const lastResort = await supabase
          .from("movies")
          .select("*")
          .ilike("title", `%${significantWord}%`)
          .order("popularity", { ascending: false })
          .limit(1)
          .single();

        data = lastResort.data;
        error = lastResort.error;
      }
    }
  }

  if (error) {
    console.error("Error fetching movie by slug:", error);
    memoryCache.set(cacheKey, null, CACHE_TTL.MEDIUM);
    return null;
  }

  memoryCache.set(cacheKey, data, CACHE_TTL.MEDIUM);
  return data;
}

/**
 * Get movie by exact ID
 */
export async function getMovieById(id: number): Promise<Movie | null> {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error("Error fetching movie by ID:", error);
    return null;
  }

  return data;
}

/**
 * Get movies by genre with caching
 */
export async function getMoviesByGenre(
  genre: string,
  limit: number = 50
): Promise<Movie[]> {
  const cacheKey = `movies_genre:${genre}:${limit}`;
  const cached = memoryCache.get<Movie[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .ilike("genres", `%${genre}%`)
    .order("vote_average", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching movies by genre:", error);
    return [];
  }

  const movies = data || [];
  memoryCache.set(cacheKey, movies, CACHE_TTL.MEDIUM);
  return movies;
}

/**
 * Get top-rated movies with caching
 */
export async function getTopRatedMovies(limit: number = 50): Promise<Movie[]> {
  const cacheKey = `top_rated_movies:${limit}`;
  const cached = memoryCache.get<Movie[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .gte("vote_count", 100) // At least 100 votes
    .order("vote_average", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching top-rated movies:", error);
    return [];
  }

  // Ensure all movies have slugs
  const movies = (data || []).map((movie) => ({
    ...movie,
    slug: movie.slug || slugify(movie.title),
  }));

  memoryCache.set(cacheKey, movies, CACHE_TTL.MEDIUM);
  return movies;
}

/**
 * Get popular movies with caching
 */
export async function getPopularMovies(limit: number = 50): Promise<Movie[]> {
  const cacheKey = `popular_movies:${limit}`;
  const cached = memoryCache.get<Movie[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .order("popularity", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching popular movies:", error);
    return [];
  }

  // Ensure all movies have slugs
  const movies = (data || []).map((movie) => ({
    ...movie,
    slug: movie.slug || slugify(movie.title),
  }));

  memoryCache.set(cacheKey, movies, CACHE_TTL.MEDIUM);
  return movies;
}

/**
 * Get recent movies (by release date) with caching
 */
export async function getRecentMovies(limit: number = 50): Promise<Movie[]> {
  const cacheKey = `recent_movies:${limit}`;
  const cached = memoryCache.get<Movie[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .not("release_date", "is", null)
    .order("release_date", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching recent movies:", error);
    return [];
  }

  // Ensure all movies have slugs
  const movies = (data || []).map((movie) => ({
    ...movie,
    slug: movie.slug || slugify(movie.title),
  }));

  memoryCache.set(cacheKey, movies, CACHE_TTL.MEDIUM);
  return movies;
}

/**
 * Enhanced search movies with full-text search, ranking, and filtering
 */
export async function searchMovies(
  query: string,
  limit: number = 20,
  filters?: {
    genres?: string[];
    minYear?: number;
    maxYear?: number;
    minRating?: number;
    maxRating?: number;
    sortBy?: "relevance" | "rating" | "year" | "popularity";
  }
): Promise<Movie[]> {
  if (!query.trim()) return [];

  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);
  
  // Build search query with multiple fields and relevance scoring
  let supabaseQuery = supabase
    .from("movies")
    .select("*");

  // Create comprehensive search conditions
  const searchConditions = [
    `title.ilike.%${query}%`,
    `movie_name.ilike.%${query}%`,
    `description.ilike.%${query}%`,
    `genres.ilike.%${query}%`,
    `keywords.ilike.%${query}%`,
    `production_companies.ilike.%${query}%`,
    `spoken_languages.ilike.%${query}%`
  ];

  // Add individual term searches for better partial matching
  searchTerms.forEach(term => {
    if (term.length >= 2) {
      searchConditions.push(`title.ilike.%${term}%`);
      searchConditions.push(`description.ilike.%${term}%`);
      searchConditions.push(`genres.ilike.%${term}%`);
    }
  });

  supabaseQuery = supabaseQuery.or(searchConditions.join(","));

  // Apply filters if provided
  if (filters?.minYear) {
    supabaseQuery = supabaseQuery.gte("release_date", `${filters.minYear}-01-01`);
  }
  if (filters?.maxYear) {
    supabaseQuery = supabaseQuery.lte("release_date", `${filters.maxYear}-12-31`);
  }
  if (filters?.minRating !== undefined) {
    supabaseQuery = supabaseQuery.gte("vote_average", filters.minRating);
  }
  if (filters?.maxRating !== undefined) {
    supabaseQuery = supabaseQuery.lte("vote_average", filters.maxRating);
  }

  const { data, error } = await supabaseQuery.limit(limit * 2); // Get more results for better ranking

  if (error) {
    console.error("Error searching movies:", error);
    return [];
  }

  if (!data || data.length === 0) return [];

  // Calculate relevance scores and rank results
  const scoredMovies = data.map((movie) => {
    let score = 0;
    const titleLower = (movie.title || "").toLowerCase();
    const descriptionLower = (movie.description || "").toLowerCase();
    const genresLower = (movie.genres || "").toLowerCase();
    const queryLower = query.toLowerCase();

    // Title exact match (highest priority)
    if (titleLower === queryLower) score += 100;
    // Title starts with query
    else if (titleLower.startsWith(queryLower)) score += 50;
    // Title contains query
    else if (titleLower.includes(queryLower)) score += 25;

    // Genre matches
    if (genresLower.includes(queryLower)) score += 15;

    // Description matches
    if (descriptionLower.includes(queryLower)) score += 10;

    // Individual term matches
    searchTerms.forEach(term => {
      if (titleLower.includes(term)) score += 5;
      if (genresLower.includes(term)) score += 3;
      if (descriptionLower.includes(term)) score += 2;
    });

    // Boost score based on movie quality metrics
    score += Math.min(movie.vote_average * 2, 20); // Max 20 points for rating
    score += Math.min(movie.popularity / 10, 10); // Max 10 points for popularity
    score += Math.min(movie.vote_count / 1000, 5); // Max 5 points for vote count

    return { ...movie, relevanceScore: score };
  });

  // Sort by relevance or specified criteria
  const sortBy = filters?.sortBy || "relevance";
  scoredMovies.sort((a, b) => {
    switch (sortBy) {
      case "rating":
        return b.vote_average - a.vote_average;
      case "year":
        return new Date(b.release_date || "").getTime() - new Date(a.release_date || "").getTime();
      case "popularity":
        return b.popularity - a.popularity;
      default: // relevance
        return b.relevanceScore - a.relevanceScore;
    }
  });

  // Filter by genres if specified
  let filteredMovies = scoredMovies;
  if (filters?.genres && filters.genres.length > 0) {
    filteredMovies = scoredMovies.filter(movie => {
      const movieGenres = (movie.genres || "").toLowerCase();
      return filters.genres!.some(genre => 
        movieGenres.includes(genre.toLowerCase())
      );
    });
  }

  // Ensure all movies have slugs and return limited results
  const moviesWithSlugs = filteredMovies.slice(0, limit).map((movie) => ({
    ...movie,
    slug: movie.slug || slugify(movie.title),
  }));

  return moviesWithSlugs;
}

/**
 * Get random movies for tools with caching
 */
export async function getRandomMovies(count: number = 10): Promise<Movie[]> {
  const cacheKey = `random_movies:${count}`;
  const cached = memoryCache.get<Movie[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase.rpc("get_random_movies", {
    movie_count: count,
  });

  if (error) {
    // Fallback to getting popular movies if RPC function doesn't exist
    return getPopularMovies(count);
  }

  const movies = data || [];
  // Shorter cache time for random results to maintain variety
  memoryCache.set(cacheKey, movies, CACHE_TTL.SHORT);
  return movies;
}

/**
 * Get movies for date night (romantic, comedy, feel-good genres) with caching
 */
export async function getDateNightMovies(limit: number = 20): Promise<Movie[]> {
  const cacheKey = `date_night_movies:${limit}`;
  const cached = memoryCache.get<Movie[]>(cacheKey);
  if (cached) return cached;

  const dateNightGenres = ["Romance", "Comedy", "Family", "Animation"];

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .or(dateNightGenres.map((genre) => `genres.ilike.%${genre}%`).join(","))
    .gte("vote_average", 6.0) // Good ratings only
    .order("vote_average", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching date night movies:", error);
    return [];
  }

  const movies = data || [];
  memoryCache.set(cacheKey, movies, CACHE_TTL.MEDIUM);
  return movies;
}

/**
 * Get all unique genres from database with caching
 */
export async function getAllGenres(): Promise<string[]> {
  const cacheKey = "all_genres";
  const cached = memoryCache.get<string[]>(cacheKey);
  if (cached) return cached;

  const { data, error } = await supabase
    .from("movies")
    .select("genres")
    .not("genres", "is", null);

  if (error) {
    console.error("Error fetching genres:", error);
    return [];
  }

  const genreSet = new Set<string>();

  data?.forEach((movie) => {
    if (movie.genres) {
      movie.genres.split(",").forEach((genre: string) => {
        const trimmed = genre.trim();
        if (trimmed) genreSet.add(trimmed);
      });
    }
  });

  const genres = Array.from(genreSet).sort();
  memoryCache.set(cacheKey, genres, CACHE_TTL.LONG);
  return genres;
}

/**
 * Get movie count for statistics
 */
export async function getMovieCount(): Promise<number> {
  const { count, error } = await supabase
    .from("movies")
    .select("*", { count: "exact", head: true });

  if (error) {
    console.error("Error fetching movie count:", error);
    return 0;
  }

  return count || 0;
}

/**
 * Get movies by keywords (search in title, description, keywords)
 */
export async function getMoviesByKeywords(
  keywords: string[],
  limit: number = 50
): Promise<Movie[]> {
  if (keywords.length === 0) return [];

  // Create search patterns for each keyword
  const searchConditions = keywords.map(
    (keyword) =>
      `or(title.ilike.%${keyword}%,description.ilike.%${keyword}%,keywords.ilike.%${keyword}%)`
  );

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .or(searchConditions.join(","))
    .order("popularity", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching movies by keywords:", error);
    return [];
  }

  return data || [];
}

/**
 * Get movies by decade
 */
export async function getMoviesByDecade(
  startYear: number,
  endYear: number,
  limit: number = 50
): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .gte("release_date", `${startYear}-01-01`)
    .lte("release_date", `${endYear}-12-31`)
    .not("release_date", "is", null)
    .order("vote_average", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching movies by decade:", error);
    return [];
  }

  return data || [];
}

/**
 * Get movies by runtime range
 */
export async function getMoviesByRuntimeRange(
  minRuntime: number,
  maxRuntime: number,
  limit: number = 50
): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .gte("runtime", minRuntime)
    .lte("runtime", maxRuntime)
    .not("runtime", "is", null)
    .order("vote_average", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching movies by runtime range:", error);
    return [];
  }

  return data || [];
}

/**
 * Advanced filtering function for complex queries
 */
export async function getMoviesWithFilters(filters: {
  title?: string;
  genres?: string[];
  minRating?: number;
  maxRating?: number;
  minYear?: number;
  maxYear?: number;
  minRuntime?: number;
  maxRuntime?: number;
  excludeAdult?: boolean;
  keywords?: string[];
  minPopularity?: number;
  sortBy?: "rating" | "popularity" | "release_date" | "title";
  sortOrder?: "asc" | "desc";
  limit?: number;
}): Promise<Movie[]> {
  let query = supabase.from("movies").select("*");

  // Title filter
  if (filters.title && filters.title.trim()) {
    query = query.or(
      `title.ilike.%${filters.title}%,movie_name.ilike.%${filters.title}%`
    );
  }

  // Rating filters
  if (filters.minRating !== undefined) {
    query = query.gte("vote_average", filters.minRating);
  }
  if (filters.maxRating !== undefined) {
    query = query.lte("vote_average", filters.maxRating);
  }

  // Year filters
  if (filters.minYear !== undefined) {
    query = query.gte("release_date", `${filters.minYear}-01-01`);
  }
  if (filters.maxYear !== undefined) {
    query = query.lte("release_date", `${filters.maxYear}-12-31`);
  }

  // Runtime filters
  if (filters.minRuntime !== undefined) {
    query = query.gte("runtime", filters.minRuntime);
  }
  if (filters.maxRuntime !== undefined) {
    query = query.lte("runtime", filters.maxRuntime);
  }

  // Adult content filter
  if (filters.excludeAdult) {
    query = query.eq("adult", false);
  }

  // Popularity filter
  if (filters.minPopularity !== undefined) {
    query = query.gte("popularity", filters.minPopularity);
  }

  // Genre filters (applied after other filters for performance)
  if (filters.genres && filters.genres.length > 0) {
    const genreConditions = filters.genres.map(
      (genre) => `genres.ilike.%${genre}%`
    );
    query = query.or(genreConditions.join(","));
  }

  // Apply sorting
  const sortBy = filters.sortBy || "popularity";
  const sortOrder = filters.sortOrder || "desc";
  const ascending = sortOrder === "asc";

  switch (sortBy) {
    case "rating":
      query = query.order("vote_average", { ascending });
      break;
    case "popularity":
      query = query.order("popularity", { ascending });
      break;
    case "release_date":
      query = query.order("release_date", { ascending });
      break;
    case "title":
      query = query.order("title", { ascending });
      break;
    default:
      query = query.order("popularity", { ascending: false });
  }

  query = query.limit(filters.limit || 50);

  const { data, error } = await query;

  if (error) {
    console.error("Error fetching movies with filters:", error);
    return [];
  }

  let result = data || [];

  // Apply keyword filtering in JavaScript if needed (can't do complex text search efficiently in Supabase without proper setup)
  if (filters.keywords && filters.keywords.length > 0) {
    result = result.filter((movie) => {
      const movieText = `${movie.title || ""} ${movie.description || ""} ${
        movie.keywords || ""
      }`.toLowerCase();
      return filters.keywords!.some((keyword) =>
        movieText.includes(keyword.toLowerCase())
      );
    });
  }

  return result;
}

/**
 * Get movies for mood-based recommendations (optimized version)
 */
export async function getMoviesByMood(
  genres: string[],
  keywords: string[],
  minRating: number = 6.0,
  limit: number = 50
): Promise<Movie[]> {
  // Use the advanced filtering function
  const movies = await getMoviesWithFilters({
    genres,
    minRating,
    keywords,
    limit: limit * 2, // Get more to allow for keyword filtering
  });

  // Score movies based on keyword and genre matching
  const scoredMovies = movies.map((movie) => {
    let score =
      movie.vote_average * 0.5 + Math.min(movie.popularity / 100, 1) * 0.3;

    // Keyword matching bonus
    if (keywords && keywords.length > 0) {
      const movieText = `${movie.title} ${movie.description} ${
        movie.keywords || ""
      }`.toLowerCase();
      const keywordMatches = keywords.filter((keyword) =>
        movieText.includes(keyword.toLowerCase())
      ).length;
      score += keywordMatches * 0.5;
    }

    // Genre matching bonus
    if (genres && genres.length > 0) {
      const movieGenres =
        movie.genres
          ?.toLowerCase()
          .split(",")
          .map((g) => g.trim()) || [];
      const genreMatches = genres.filter((selectedGenre) =>
        movieGenres.some((movieGenre) =>
          movieGenre.includes(selectedGenre.toLowerCase())
        )
      ).length;
      score += genreMatches * 0.3;
    }

    return { ...movie, moodScore: score };
  });

  // Sort by mood score and return top results
  return scoredMovies.sort((a, b) => b.moodScore - a.moodScore).slice(0, limit);
}

/**
 * Get highly rated movies by specific criteria
 */
export async function getHighlyRatedMovies(
  minRating: number = 8.0,
  minVotes: number = 1000,
  limit: number = 50
): Promise<Movie[]> {
  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .gte("vote_average", minRating)
    .gte("vote_count", minVotes)
    .order("vote_average", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching highly rated movies:", error);
    return [];
  }

  return data || [];
}

/**
 * Get movies similar to a given movie by genre and keywords
 */
export async function getSimilarMovies(
  movie: Movie,
  limit: number = 20
): Promise<Movie[]> {
  if (!movie.genres) return [];

  const movieGenres = movie.genres.split(",").map((g) => g.trim());
  const movieKeywords = movie.keywords
    ? movie.keywords.split(",").map((k) => k.trim())
    : [];

  // Get movies with similar genres
  const similarMovies = await getMoviesWithFilters({
    genres: movieGenres,
    minRating: Math.max(movie.vote_average - 1, 5.0), // Similar or better rating
    limit: limit * 3, // Get more to filter out the original movie
  });

  // Filter out the original movie and score by similarity
  const scoredMovies = similarMovies
    .filter((m) => m.id !== movie.id)
    .map((m) => {
      let similarity = 0;

      // Genre similarity
      const otherGenres = m.genres?.split(",").map((g) => g.trim()) || [];
      const genreMatches = movieGenres.filter((genre) =>
        otherGenres.some((otherGenre) =>
          otherGenre.toLowerCase().includes(genre.toLowerCase())
        )
      ).length;
      similarity += genreMatches * 0.4;

      // Keyword similarity
      if (movieKeywords.length > 0 && m.keywords) {
        const otherKeywords = m.keywords.split(",").map((k) => k.trim());
        const keywordMatches = movieKeywords.filter((keyword) =>
          otherKeywords.some((otherKeyword) =>
            otherKeyword.toLowerCase().includes(keyword.toLowerCase())
          )
        ).length;
        similarity += keywordMatches * 0.3;
      }

      // Rating similarity bonus
      const ratingDiff = Math.abs(movie.vote_average - m.vote_average);
      similarity += Math.max(0, 1 - ratingDiff / 5) * 0.3;

      return { ...m, similarity };
    });

  return scoredMovies
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, limit);
}

/**
 * Get trending movies (high popularity, recent release)
 */
export async function getTrendingMovies(limit: number = 50): Promise<Movie[]> {
  const currentYear = new Date().getFullYear();
  const twoYearsAgo = currentYear - 2;

  const { data, error } = await supabase
    .from("movies")
    .select("*")
    .gte("release_date", `${twoYearsAgo}-01-01`)
    .gte("popularity", 20) // Reasonably popular
    .gte("vote_average", 6.0) // Good quality
    .order("popularity", { ascending: false })
    .limit(limit);

  if (error) {
    console.error("Error fetching trending movies:", error);
    return [];
  }

  return data || [];
}

/**
 * Semantic search for natural language queries like "funny action movies from the 90s"
 */
export async function semanticSearchMovies(
  query: string,
  limit: number = 20
): Promise<Movie[]> {
  if (!query.trim()) return [];

  const queryLower = query.toLowerCase();
  
  // Extract semantic information from the query
  const genreKeywords = {
    action: ['action', 'adventure', 'fight', 'battle', 'war', 'spy', 'hero'],
    comedy: ['funny', 'hilarious', 'comedy', 'laugh', 'humor', 'comedic'],
    drama: ['drama', 'emotional', 'touching', 'serious', 'deep'],
    horror: ['scary', 'horror', 'frightening', 'terrifying', 'spooky'],
    romance: ['romantic', 'love', 'romance', 'relationship', 'dating'],
    thriller: ['suspense', 'thriller', 'tension', 'mystery', 'psychological'],
    'science fiction': ['sci-fi', 'space', 'future', 'alien', 'robot', 'technology'],
    fantasy: ['magic', 'fantasy', 'wizard', 'supernatural', 'mythical'],
    animation: ['animated', 'cartoon', 'animation'],
    documentary: ['documentary', 'real', 'true story', 'factual'],
    family: ['family', 'kids', 'children', 'wholesome'],
    musical: ['musical', 'music', 'singing', 'songs']
  };

  const moodKeywords = {
    feel_good: ['feel good', 'uplifting', 'positive', 'happy', 'cheerful'],
    dark: ['dark', 'gritty', 'noir', 'serious', 'intense'],
    light: ['light', 'easy', 'casual', 'simple'],
    epic: ['epic', 'grand', 'massive', 'spectacular', 'blockbuster']
  };

  // Extract decade/year information
  const decades = {
    '1950s': ['50s', '1950s', 'fifties'],
    '1960s': ['60s', '1960s', 'sixties'],
    '1970s': ['70s', '1970s', 'seventies'],
    '1980s': ['80s', '1980s', 'eighties'],
    '1990s': ['90s', '1990s', 'nineties'],
    '2000s': ['2000s', 'two thousands', 'millennium'],
    '2010s': ['2010s', 'twenty tens'],
    '2020s': ['2020s', 'twenty twenties', 'recent', 'new', 'latest']
  };

  // Identify genres from query
  const detectedGenres = Object.entries(genreKeywords).filter(([genre, keywords]) =>
    keywords.some(keyword => queryLower.includes(keyword))
  ).map(([genre]) => genre);

  // Identify time period
  let yearFilter: { min?: number; max?: number } = {};
  Object.entries(decades).forEach(([decade, keywords]) => {
    if (keywords.some(keyword => queryLower.includes(keyword))) {
      const startYear = parseInt(decade.substring(0, 4));
      yearFilter = { min: startYear, max: startYear + 9 };
    }
  });

  // Check for specific years
  const yearMatches = queryLower.match(/\b(19|20)\d{2}\b/g);
  if (yearMatches) {
    const year = parseInt(yearMatches[0]);
    yearFilter = { min: year - 2, max: year + 2 }; // Allow some flexibility
  }

  // Identify mood/tone preferences
  const detectedMoods = Object.entries(moodKeywords).filter(([mood, keywords]) =>
    keywords.some(keyword => queryLower.includes(keyword))
  ).map(([mood]) => mood);

  // Build search with detected parameters
  let searchQuery = supabase
    .from("movies")
    .select("*");

  // Apply genre filters
  if (detectedGenres.length > 0) {
    const genreConditions = detectedGenres.map(genre => `genres.ilike.%${genre}%`);
    searchQuery = searchQuery.or(genreConditions.join(","));
  }

  // Apply year filters
  if (yearFilter.min) {
    searchQuery = searchQuery.gte("release_date", `${yearFilter.min}-01-01`);
  }
  if (yearFilter.max) {
    searchQuery = searchQuery.lte("release_date", `${yearFilter.max}-12-31`);
  }

  // If no specific criteria detected, fall back to regular search
  if (detectedGenres.length === 0 && !yearFilter.min) {
    return searchMovies(query, limit);
  }

  const { data, error } = await searchQuery.limit(limit * 2);

  if (error) {
    console.error("Error in semantic search:", error);
    return [];
  }

  if (!data || data.length === 0) {
    // Fallback to regular search if semantic search yields no results
    return searchMovies(query, limit);
  }

  // Score based on semantic relevance
  const scoredMovies = data.map(movie => {
    let score = movie.vote_average * 5; // Base score from rating

    // Boost for genre matches
    detectedGenres.forEach(genre => {
      if ((movie.genres || "").toLowerCase().includes(genre)) {
        score += 20;
      }
    });

    // Boost for mood matches in description
    detectedMoods.forEach(mood => {
      const description = (movie.description || "").toLowerCase();
      if (mood === 'feel_good' && (description.includes('uplifting') || description.includes('heartwarming'))) {
        score += 15;
      }
      if (mood === 'dark' && (description.includes('dark') || description.includes('intense'))) {
        score += 15;
      }
    });

    // Boost for popularity
    score += Math.min(movie.popularity / 10, 10);

    return { ...movie, semanticScore: score };
  });

  // Sort by semantic relevance
  scoredMovies.sort((a, b) => b.semanticScore - a.semanticScore);

  // Ensure slugs and return results
  const moviesWithSlugs = scoredMovies.slice(0, limit).map((movie) => ({
    ...movie,
    slug: movie.slug || slugify(movie.title),
  }));

  return moviesWithSlugs;
}
