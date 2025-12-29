/**
 * Rate Limiting Utility
 * Limits requests per IP address to prevent abuse
 */

interface RateLimitStore {
  [key: string]: {
    count: number;
    resetTime: number;
  };
}

const store: RateLimitStore = {};

// Clean up expired entries every 5 minutes
setInterval(() => {
  const now = Date.now();
  for (const key in store) {
    if (store[key].resetTime < now) {
      delete store[key];
    }
  }
}, 5 * 60 * 1000);

interface RateLimitOptions {
  limit: number; // Max requests allowed
  windowMs: number; // Time window in milliseconds
}

interface RateLimitResult {
  success: boolean;
  remaining: number;
  resetTime: number;
}

/**
 * Check rate limit for a given identifier
 * @param identifier - Usually IP address or user ID
 * @param options - Rate limit configuration
 */
export function checkRateLimit(
  identifier: string,
  options: RateLimitOptions = { limit: 100, windowMs: 60 * 1000 }
): RateLimitResult {
  const now = Date.now();
  const key = identifier;

  // Initialize or reset if window has passed
  if (!store[key] || store[key].resetTime < now) {
    store[key] = {
      count: 0,
      resetTime: now + options.windowMs,
    };
  }

  store[key].count++;

  const remaining = Math.max(0, options.limit - store[key].count);
  const success = store[key].count <= options.limit;

  return {
    success,
    remaining,
    resetTime: store[key].resetTime,
  };
}

/**
 * Rate limit configurations for different endpoints
 */
export const rateLimits = {
  // Authentication endpoints - stricter limits
  auth: { limit: 5, windowMs: 60 * 1000 }, // 5 per minute

  // Contact/subscription forms
  contact: { limit: 3, windowMs: 60 * 1000 }, // 3 per minute
  subscribe: { limit: 5, windowMs: 60 * 1000 }, // 5 per minute

  // General API calls
  api: { limit: 100, windowMs: 60 * 1000 }, // 100 per minute

  // Search
  search: { limit: 30, windowMs: 60 * 1000 }, // 30 per minute
};

/**
 * Get client IP from request headers
 */
export function getClientIP(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for");
  if (forwarded) {
    return forwarded.split(",")[0].trim();
  }

  const realIp = request.headers.get("x-real-ip");
  if (realIp) {
    return realIp;
  }

  // Fallback - in production, should always have forwarded header
  return "unknown";
}

/**
 * Apply rate limiting to a request
 * Returns error response if rate limited, null otherwise
 */
export function applyRateLimit(
  request: Request,
  options: RateLimitOptions = rateLimits.api
): Response | null {
  const ip = getClientIP(request);
  const result = checkRateLimit(ip, options);

  if (!result.success) {
    return new Response(
      JSON.stringify({
        success: false,
        error: "Too many requests. Please try again later.",
        retryAfter: Math.ceil((result.resetTime - Date.now()) / 1000),
      }),
      {
        status: 429,
        headers: {
          "Content-Type": "application/json",
          "Retry-After": Math.ceil(
            (result.resetTime - Date.now()) / 1000
          ).toString(),
          "X-RateLimit-Limit": options.limit.toString(),
          "X-RateLimit-Remaining": result.remaining.toString(),
          "X-RateLimit-Reset": result.resetTime.toString(),
        },
      }
    );
  }

  return null;
}
