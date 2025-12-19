import { NextRequest, NextResponse } from "next/server";
import { searchMovies, semanticSearchMovies } from "@/lib/database";
import { 
  checkRateLimit, 
  validateSearchParams, 
  createErrorResponse, 
  createRateLimitResponse,
  logSecurityEvent 
} from "@/lib/security";

export async function GET(request: NextRequest) {
  // Apply rate limiting
  if (!checkRateLimit(request)) {
    logSecurityEvent("RATE_LIMIT_EXCEEDED", { endpoint: "/api/search" }, request);
    return createRateLimitResponse();
  }

  try {
    // Validate and sanitize search parameters
    const validatedParams = validateSearchParams(request.nextUrl.searchParams);
    const { q: query, limit } = validatedParams;
    
    // Extract additional search parameters
    const searchParams = request.nextUrl.searchParams;
    const genres = searchParams.get("genres")?.split(",").filter(Boolean) || [];
    const minYear = searchParams.get("minYear") ? parseInt(searchParams.get("minYear")!) : undefined;
    const maxYear = searchParams.get("maxYear") ? parseInt(searchParams.get("maxYear")!) : undefined;
    const minRating = searchParams.get("minRating") ? parseFloat(searchParams.get("minRating")!) : undefined;
    const maxRating = searchParams.get("maxRating") ? parseFloat(searchParams.get("maxRating")!) : undefined;
    const sortBy = searchParams.get("sortBy") as "relevance" | "rating" | "year" | "popularity" || "relevance";
    const semantic = searchParams.get("semantic") === "true";

    if (!query || query.length < 1) {
      return NextResponse.json({ movies: [], total: 0 }, { status: 200 });
    }

    // Additional validation for suspicious queries
    if (query.length > 100 || /[<>{}]/.test(query)) {
      logSecurityEvent("SUSPICIOUS_SEARCH_QUERY", { query }, request);
      return createErrorResponse("Invalid search query");
    }

    let results;
    
    // Use semantic search for natural language queries if requested
    if (semantic || isNaturalLanguageQuery(query)) {
      results = await semanticSearchMovies(query, limit);
    } else {
      // Use enhanced search with filters
      const filters = {
        genres: genres.length > 0 ? genres : undefined,
        minYear,
        maxYear,
        minRating,
        maxRating,
        sortBy
      };
      results = await searchMovies(query, limit, filters);
    }

    // Add search highlighting
    const highlightedResults = results.map(movie => ({
      ...movie,
      titleHighlight: highlightText(movie.title, query),
      descriptionHighlight: highlightText(movie.description || "", query)
    }));

    return NextResponse.json({ 
      movies: highlightedResults, 
      total: highlightedResults.length,
      query: query,
      filters: {
        genres,
        minYear,
        maxYear,
        minRating,
        maxRating,
        sortBy,
        semantic
      }
    }, { 
      status: 200,
      headers: {
        "Cache-Control": "public, max-age=300", // 5 minutes cache
      }
    });
  } catch (error) {
    logSecurityEvent("API_ERROR", { error: error instanceof Error ? error.message : "Unknown error", endpoint: "/api/search" }, request);
    console.error("Search API error:", error);
    return createErrorResponse("Error searching movies", 500);
  }
}

// Helper function to detect natural language queries
function isNaturalLanguageQuery(query: string): boolean {
  const naturalLanguageIndicators = [
    'movies about',
    'films with',
    'like',
    'similar to',
    'comedy from',
    'action in',
    'drama about',
    'funny',
    'scary',
    'romantic',
    'from the',
    'in the',
    'with',
    'starring'
  ];
  
  const queryLower = query.toLowerCase();
  return naturalLanguageIndicators.some(indicator => queryLower.includes(indicator)) ||
         query.split(' ').length > 3; // Queries with more than 3 words are likely natural language
}

// Helper function to highlight search terms in text
function highlightText(text: string, query: string): string {
  if (!text || !query) return text;
  
  const searchTerms = query.toLowerCase().split(/\s+/).filter(term => term.length > 1);
  let highlightedText = text;
  
  searchTerms.forEach(term => {
    const regex = new RegExp(`(${term})`, 'gi');
    highlightedText = highlightedText.replace(regex, '<mark>$1</mark>');
  });
  
  return highlightedText;
}
