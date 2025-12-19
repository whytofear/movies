// Security utilities for input validation and sanitization
import { NextRequest } from "next/server";

// Rate limiting storage (in production, use Redis or similar)
const rateLimitMap = new Map<string, { count: number; resetTime: number }>();

// Configuration
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const RATE_LIMIT_MAX_REQUESTS = 100; // per window
const MAX_QUERY_LENGTH = 100;
const MAX_ARRAY_LENGTH = 20;

/**
 * Rate limiting middleware
 */
export function checkRateLimit(request: NextRequest): boolean {
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "unknown";
  const now = Date.now();
  
  const clientData = rateLimitMap.get(ip);
  
  if (!clientData || now > clientData.resetTime) {
    // Reset or create new entry
    rateLimitMap.set(ip, {
      count: 1,
      resetTime: now + RATE_LIMIT_WINDOW
    });
    return true;
  }
  
  if (clientData.count >= RATE_LIMIT_MAX_REQUESTS) {
    return false;
  }
  
  clientData.count++;
  return true;
}

/**
 * Sanitize and validate string input
 */
export function sanitizeString(input: any, maxLength = MAX_QUERY_LENGTH): string {
  if (typeof input !== "string") {
    return "";
  }
  
  // Remove potentially dangerous characters
  const sanitized = input
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, "") // Remove script tags
    .replace(/[<>'"]/g, "") // Remove HTML special characters
    .replace(/javascript:/gi, "") // Remove javascript: protocol
    .replace(/on\w+\s*=/gi, "") // Remove event handlers
    .trim();
  
  return sanitized.length > maxLength ? sanitized.substring(0, maxLength) : sanitized;
}

/**
 * Validate and sanitize numeric input
 */
export function sanitizeNumber(input: any, min = 0, max = 10000): number {
  const num = typeof input === "string" ? parseInt(input, 10) : Number(input);
  
  if (isNaN(num)) {
    return min;
  }
  
  return Math.max(min, Math.min(max, num));
}

/**
 * Validate and sanitize array input
 */
export function sanitizeArray(input: any, maxLength = MAX_ARRAY_LENGTH): string[] {
  if (!Array.isArray(input)) {
    return [];
  }
  
  return input
    .slice(0, maxLength)
    .map(item => sanitizeString(item))
    .filter(item => item.length > 0);
}

/**
 * Validate movie search preferences
 */
export interface MoviePreferences {
  mood?: string;
  duration?: string;
  rating?: string;
  genres?: string[];
  era?: string;
  popularity?: string;
  decade?: string;
  minRating?: number;
  maxRating?: number;
  limit?: number;
}

export function validateMoviePreferences(body: any): MoviePreferences {
  const validMoods = ["any", "happy", "sad", "exciting", "relaxing", "thoughtful", "romantic", "scary"];
  const validDurations = ["any", "short", "medium", "long"];
  const validRatings = ["any", "family", "teen", "mature"];
  const validEras = ["any", "classic", "retro", "modern", "recent"];
  const validPopularity = ["any", "mainstream", "indie", "cult"];
  const validDecades = ["any", "1970s", "1980s", "1990s", "2000s", "2010s", "2020s"];
  
  return {
    mood: validMoods.includes(body.mood) ? body.mood : "any",
    duration: validDurations.includes(body.duration) ? body.duration : "any",
    rating: validRatings.includes(body.rating) ? body.rating : "any",
    genres: sanitizeArray(body.genres, 10),
    era: validEras.includes(body.era) ? body.era : "any",
    popularity: validPopularity.includes(body.popularity) ? body.popularity : "any",
    decade: validDecades.includes(body.decade) ? body.decade : "any",
    minRating: sanitizeNumber(body.minRating, 0, 10),
    maxRating: sanitizeNumber(body.maxRating, 0, 10),
    limit: sanitizeNumber(body.limit, 1, 100)
  };
}

/**
 * Validate search query parameters
 */
export function validateSearchParams(searchParams: URLSearchParams) {
  return {
    q: sanitizeString(searchParams.get("q") || ""),
    limit: sanitizeNumber(searchParams.get("limit") || "20", 1, 100),
    genre: sanitizeString(searchParams.get("genre") || ""),
    year: sanitizeNumber(searchParams.get("year") || "0", 1900, 2030),
    minRating: sanitizeNumber(searchParams.get("minRating") || "0", 0, 10),
    maxRating: sanitizeNumber(searchParams.get("maxRating") || "10", 0, 10)
  };
}

/**
 * Create standardized error responses
 */
export function createErrorResponse(message: string, status = 400) {
  return Response.json(
    { 
      error: message,
      timestamp: new Date().toISOString()
    },
    { status }
  );
}

/**
 * Create rate limit error response
 */
export function createRateLimitResponse() {
  return Response.json(
    { 
      error: "Too many requests. Please try again later.",
      timestamp: new Date().toISOString()
    },
    { 
      status: 429,
      headers: {
        "Retry-After": "60"
      }
    }
  );
}

/**
 * Log security events (in production, use proper logging service)
 */
export function logSecurityEvent(event: string, details: any, request: NextRequest) {
  const timestamp = new Date().toISOString();
  const ip = request.headers.get("x-forwarded-for") || 
             request.headers.get("x-real-ip") || 
             "unknown";
  const userAgent = request.headers.get("user-agent") || "unknown";
  
  console.warn(`[SECURITY] ${timestamp} - ${event}`, {
    ip,
    userAgent,
    details
  });
}

/**
 * Clean up old rate limit entries
 */
export function cleanupRateLimit() {
  const now = Date.now();
  for (const [ip, data] of rateLimitMap.entries()) {
    if (now > data.resetTime) {
      rateLimitMap.delete(ip);
    }
  }
}

// Cleanup every 5 minutes
if (typeof window === "undefined") {
  setInterval(cleanupRateLimit, 5 * 60 * 1000);
}
