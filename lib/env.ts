// Environment variable validation and security configuration
import { z } from "zod";

// Define the schema for environment variables
const envSchema = z.object({
  NODE_ENV: z
    .enum(["development", "production", "test"])
    .default("development"),
  NEXT_PUBLIC_SUPABASE_URL: z.string().url("Invalid Supabase URL"),
  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string()
    .min(1, "Supabase anon key is required"),
  SITE_URL: z
    .string()
    .url("Invalid site URL")
    .default("https://SimilarMovie.me"),

  // Optional security-related environment variables
  RATE_LIMIT_MAX: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1).max(1000))
    .default("100"),
  RATE_LIMIT_WINDOW: z
    .string()
    .transform(Number)
    .pipe(z.number().min(1000).max(3600000))
    .default("60000"),
  ENABLE_SECURITY_HEADERS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
  LOG_SECURITY_EVENTS: z
    .string()
    .transform((val) => val === "true")
    .default("true"),
});

// Validate environment variables
function validateEnv() {
  try {
    const env = envSchema.parse(process.env);
    return env;
  } catch (error) {
    console.error("❌ Invalid environment variables:", error);
    throw new Error("Environment validation failed");
  }
}

// Export validated environment
export const env = validateEnv();

// Security configuration based on environment
export const securityConfig = {
  rateLimiting: {
    maxRequests: env.RATE_LIMIT_MAX,
    windowMs: env.RATE_LIMIT_WINDOW,
    enabled: env.NODE_ENV === "production",
  },
  headers: {
    enabled: env.ENABLE_SECURITY_HEADERS,
    hsts: env.NODE_ENV === "production",
  },
  logging: {
    securityEvents: env.LOG_SECURITY_EVENTS,
    level: env.NODE_ENV === "production" ? "warn" : "debug",
  },
  csp: {
    // Content Security Policy configuration
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: [
        "'self'",
        "'unsafe-eval'",
        "'unsafe-inline'",
        "*.vercel.com",
        "*.google.com",
        "*.googleapis.com",
        "*.gstatic.com",
      ],
      styleSrc: [
        "'self'",
        "'unsafe-inline'",
        "fonts.googleapis.com",
        "*.gstatic.com",
      ],
      fontSrc: ["'self'", "fonts.gstatic.com", "fonts.googleapis.com"],
      imgSrc: [
        "'self'",
        "data:",
        "blob:",
        "*.tmdb.org",
        "*.vercel.com",
        "*.googleusercontent.com",
      ],
      connectSrc: [
        "'self'",
        "*.supabase.co",
        "*.vercel.com",
        "*.googleapis.com",
      ],
      frameSrc: ["'self'", "*.youtube.com", "*.vimeo.com"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'self'"],
    },
  },
};

// Utility functions for security
export function isProduction() {
  return env.NODE_ENV === "production";
}

export function shouldEnforceHTTPS() {
  return isProduction();
}

export function getCanonicalDomain() {
  return new URL(env.SITE_URL).hostname;
}

export function generateCSPHeader() {
  const { directives } = securityConfig.csp;

  return Object.entries(directives)
    .map(([key, values]) => {
      const directive = key.replace(/([A-Z])/g, "-$1").toLowerCase();
      return `${directive} ${
        Array.isArray(values) ? values.join(" ") : values
      }`;
    })
    .join("; ");
}
