// Cache utilities for performance optimization
const CACHE_TTL = {
  SHORT: 5 * 60 * 1000, // 5 minutes
  MEDIUM: 30 * 60 * 1000, // 30 minutes
  LONG: 60 * 60 * 1000, // 1 hour
  VERY_LONG: 24 * 60 * 60 * 1000, // 24 hours
};

interface CacheItem<T> {
  data: T;
  timestamp: number;
  ttl: number;
}

class MemoryCache {
  private cache = new Map<string, CacheItem<any>>();

  set<T>(key: string, data: T, ttl: number = CACHE_TTL.MEDIUM): void {
    this.cache.set(key, {
      data,
      timestamp: Date.now(),
      ttl,
    });

    // Clean up old entries periodically
    if (this.cache.size > 1000) {
      this.cleanup();
    }
  }

  get<T>(key: string): T | null {
    const item = this.cache.get(key);

    if (!item) {
      return null;
    }

    if (Date.now() - item.timestamp > item.ttl) {
      this.cache.delete(key);
      return null;
    }

    return item.data;
  }

  delete(key: string): void {
    this.cache.delete(key);
  }

  clear(): void {
    this.cache.clear();
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, item] of this.cache.entries()) {
      if (now - item.timestamp > item.ttl) {
        this.cache.delete(key);
      }
    }
  }

  size(): number {
    return this.cache.size;
  }
}

// Global cache instance
export const memoryCache = new MemoryCache();

// Cache wrapper function
export async function withCache<T>(
  key: string,
  fetcher: () => Promise<T>,
  ttl: number = CACHE_TTL.MEDIUM
): Promise<T> {
  // Try to get from cache first
  const cached = memoryCache.get<T>(key);
  if (cached !== null) {
    return cached;
  }

  // Fetch fresh data
  const data = await fetcher();

  // Store in cache
  memoryCache.set(key, data, ttl);

  return data;
}

// Cache key generators
export const cacheKeys = {
  allMovies: () => "movies:all",
  movieBySlug: (slug: string) => `movie:slug:${slug}`,
  movieById: (id: number) => `movie:id:${id}`,
  popularMovies: (limit: number) => `movies:popular:${limit}`,
  topRatedMovies: (limit: number) => `movies:top-rated:${limit}`,
  recentMovies: (limit: number) => `movies:recent:${limit}`,
  moviesByGenre: (genre: string, limit: number) =>
    `movies:genre:${genre}:${limit}`,
  similarMovies: (movieId: number, limit: number) =>
    `similar:${movieId}:${limit}`,
  genres: () => "genres:all",
  movieCount: () => "movies:count",
  searchMovies: (query: string, limit: number) => `search:${query}:${limit}`,
  moviesWithFilters: (filters: string) => `movies:filters:${filters}`,
};

// Cache TTL constants
export { CACHE_TTL };

// Browser cache utilities
export const browserCache = {
  set(key: string, data: any, ttlMinutes: number = 30): void {
    if (typeof window === "undefined") return;

    const item = {
      data,
      timestamp: Date.now(),
      ttl: ttlMinutes * 60 * 1000,
    };

    try {
      localStorage.setItem(`cache:${key}`, JSON.stringify(item));
    } catch (error) {
      console.warn("Failed to save to localStorage:", error);
    }
  },

  get<T>(key: string): T | null {
    if (typeof window === "undefined") return null;

    try {
      const item = localStorage.getItem(`cache:${key}`);
      if (!item) return null;

      const parsed = JSON.parse(item);

      if (Date.now() - parsed.timestamp > parsed.ttl) {
        localStorage.removeItem(`cache:${key}`);
        return null;
      }

      return parsed.data;
    } catch (error) {
      console.warn("Failed to read from localStorage:", error);
      return null;
    }
  },

  delete(key: string): void {
    if (typeof window === "undefined") return;
    localStorage.removeItem(`cache:${key}`);
  },

  clear(): void {
    if (typeof window === "undefined") return;

    const keys = Object.keys(localStorage);
    keys.forEach((key) => {
      if (key.startsWith("cache:")) {
        localStorage.removeItem(key);
      }
    });
  },
};
