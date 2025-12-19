import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const response = NextResponse.next();
  const url = request.nextUrl.clone();
  
  // HTTPS/HSTS enforcement (in production)
  if (process.env.NODE_ENV === "production" && request.headers.get("x-forwarded-proto") !== "https") {
    url.protocol = "https:";
    return NextResponse.redirect(url);
  }
  
  // Add comprehensive security headers
  response.headers.set("X-DNS-Prefetch-Control", "on");
  response.headers.set("X-XSS-Protection", "1; mode=block");
  response.headers.set("X-Frame-Options", "SAMEORIGIN");
  response.headers.set("X-Content-Type-Options", "nosniff");
  response.headers.set("Referrer-Policy", "strict-origin-when-cross-origin");
  
  // Strict Transport Security (HSTS)
  if (process.env.NODE_ENV === "production") {
    response.headers.set("Strict-Transport-Security", "max-age=31536000; includeSubDomains; preload");
  }
  
  // Permissions Policy - restrict potentially dangerous browser features
  response.headers.set("Permissions-Policy", 
    "camera=(), microphone=(), geolocation=(), payment=(), usb=(), bluetooth=(), magnetometer=(), gyroscope=(), accelerometer=(), interest-cohort=()"
  );
  
  // Enhanced Content Security Policy
  const cspHeader = [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' 'unsafe-inline' *.vercel.com *.google.com *.googleapis.com *.gstatic.com",
    "style-src 'self' 'unsafe-inline' fonts.googleapis.com *.gstatic.com",
    "font-src 'self' fonts.gstatic.com fonts.googleapis.com",
    "img-src 'self' data: blob: *.tmdb.org *.vercel.com *.googleusercontent.com",
    "connect-src 'self' *.supabase.co *.vercel.com *.googleapis.com",
    "frame-src 'self' *.youtube.com *.vimeo.com",
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'self'",
    "upgrade-insecure-requests"
  ].join("; ");
  
  response.headers.set("Content-Security-Policy", cspHeader);
  
  // Add cache control for static assets
  if (url.pathname.startsWith("/_next/static/") || 
      url.pathname.includes(".") && !url.pathname.startsWith("/api/")) {
    response.headers.set("Cache-Control", "public, max-age=31536000, immutable");
  }
  
  // API rate limiting headers
  if (url.pathname.startsWith("/api/")) {
    response.headers.set("X-RateLimit-Limit", "100");
    response.headers.set("X-RateLimit-Remaining", "99"); // This would be dynamic in a real implementation
    response.headers.set("X-RateLimit-Reset", String(Math.floor(Date.now() / 1000) + 60));
  }

  // Search query redirect handling
  if (url.pathname === "/" && url.searchParams.has("q")) {
    const query = url.searchParams.get("q");
    if (query && query.length <= 100 && !/[<>{}]/.test(query)) {
      url.pathname = "/search";
      return NextResponse.redirect(url);
    }
  }

  return response;
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"],
};
