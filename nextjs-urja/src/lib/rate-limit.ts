/**
 * Rate limiting via Upstash Redis.
 *
 * Usage:
 *   import { rateLimit, RateLimitPresets, getClientIdentifier } from "@/lib/rate-limit";
 *   const identifier = getClientIdentifier(request);
 *   const { success, remaining, reset } = await rateLimit(identifier, RateLimitPresets.contact);
 *   if (!success) return rateLimitResponse(reset);
 *
 * If Upstash is not configured (env vars missing), the limiter FAILS OPEN
 * (i.e. always returns `success: true`) so the app keeps working in dev.
 *
 * Setup:
 *   1. Create a free Upstash Redis database at https://upstash.com
 *   2. Copy the REST URL and Token to your .env:
 *        UPSTASH_REDIS_REST_URL="https://xxx.upstash.io"
 *        UPSTASH_REDIS_REST_TOKEN="AX..."
 *   3. Optionally tune the presets below.
 */

import { NextRequest } from "next/server";
import { Ratelimit } from "@upstash/ratelimit";
import { Redis } from "@upstash/redis";

// ---------------------------------------------------------------------------
// Upstash client (lazy-initialised)
// ---------------------------------------------------------------------------

let _redis: Redis | null | undefined;

function getRedis(): Redis | null {
  if (_redis !== undefined) return _redis;

  const url = process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.UPSTASH_REDIS_REST_TOKEN;

  if (!url || !token) {
    if (process.env.NODE_ENV === "production") {
      console.warn(
        "[rate-limit] UPSTASH_REDIS_REST_URL / UPSTASH_REDIS_REST_TOKEN are not set. " +
          "Rate limiting is disabled. Set them in your environment to enable production rate limiting.",
      );
    }
    _redis = null;
    return null;
  }

  _redis = new Redis({ url, token });
  return _redis;
}

// ---------------------------------------------------------------------------
// Presets
// ---------------------------------------------------------------------------

/**
 * Pre-configured rate-limit profiles.
 *
 *   contact       — public contact / appointment forms (strict)
 *   auth          — login & password-reset attempts
 *   admin         — authenticated admin actions (generous)
 *   adminRead     — authenticated read endpoints (very generous)
 *   public        — public read endpoints
 *   upload        — heavy operations like Cloudinary uploads
 */
export const RateLimitPresets = {
  contact: { limit: 5, window: "1 m" as const, prefix: "rl:contact" },
  auth: { limit: 10, window: "10 m" as const, prefix: "rl:auth" },
  admin: { limit: 120, window: "1 m" as const, prefix: "rl:admin" },
  adminRead: { limit: 300, window: "1 m" as const, prefix: "rl:admin-r" },
  public: { limit: 60, window: "1 m" as const, prefix: "rl:public" },
  upload: { limit: 20, window: "1 m" as const, prefix: "rl:upload" },
} as const;

export type RateLimitPreset = keyof typeof RateLimitPresets;

export interface RateLimitConfig {
  limit: number;
  window: `${number} ${"s" | "m" | "h" | "d"}`;
  prefix: string;
}

// ---------------------------------------------------------------------------
// Limiter cache (one Ratelimit instance per unique prefix)
// ---------------------------------------------------------------------------

const _limiters = new Map<string, Ratelimit>();

function getLimiter(cfg: RateLimitConfig): Ratelimit | null {
  const redis = getRedis();
  if (!redis) return null;

  const cacheKey = `${cfg.prefix}:${cfg.limit}:${cfg.window}`;
  let limiter = _limiters.get(cacheKey);
  if (limiter) return limiter;

  limiter = new Ratelimit({
    redis,
    limiter: Ratelimit.slidingWindow(cfg.limit, cfg.window),
    analytics: true,
    prefix: cfg.prefix,
  });
  _limiters.set(cacheKey, limiter);
  return limiter;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface RateLimitResult {
  success: boolean;
  /** Remaining requests in the current window. `Number.POSITIVE_INFINITY` if disabled. */
  remaining: number;
  /** Unix epoch (ms) when the window resets. */
  reset: number;
  /** Configured ceiling. */
  limit: number;
  /** True if the limiter is not configured (failing open). */
  disabled: boolean;
}

/**
 * Check (and increment) the rate-limit counter for the given identifier.
 *
 * Always resolves; never throws. If Upstash is not configured, returns
 * `success: true` with `disabled: true`.
 */
export async function rateLimit(
  identifier: string,
  preset: RateLimitPreset | RateLimitConfig,
): Promise<RateLimitResult> {
  const cfg: RateLimitConfig =
    typeof preset === "string" ? RateLimitPresets[preset] : preset;

  const limiter = getLimiter(cfg);
  if (!limiter) {
    return {
      success: true,
      remaining: Number.POSITIVE_INFINITY,
      reset: Date.now() + 60_000,
      limit: cfg.limit,
      disabled: true,
    };
  }

  try {
    const { success, remaining, reset } = await limiter.limit(identifier);
    return { success, remaining, reset, limit: cfg.limit, disabled: false };
  } catch (err) {
    // Fail open if Redis has an outage — never block legitimate users
    // because of infrastructure issues.
    console.error("[rate-limit] Upstash call failed; failing open:", err);
    return {
      success: true,
      remaining: Number.POSITIVE_INFINITY,
      reset: Date.now() + 60_000,
      limit: cfg.limit,
      disabled: true,
    };
  }
}

// ---------------------------------------------------------------------------
// Identifier helpers
// ---------------------------------------------------------------------------

/**
 * Best-effort client identifier for rate limiting.
 *
 * Uses `x-forwarded-for` / `x-real-ip` (honoring the first hop) and falls
 * back to `unknown` if neither is present. In production behind a trusted
 * proxy, set the right headers (Vercel, Cloudflare, etc. populate these
 * automatically).
 */
export function getClientIdentifier(
  request: NextRequest,
  fallback = "anonymous",
): string {
  const xff = request.headers.get("x-forwarded-for");
  if (xff) {
    // First IP in the chain is the original client.
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  const xri = request.headers.get("x-real-ip");
  if (xri) return xri.trim();
  // Vercel sets this on every request.
  const vercelIp = request.headers.get("x-vercel-forwarded-for");
  if (vercelIp) return vercelIp.split(",")[0]?.trim() || fallback;
  return fallback;
}

/**
 * Build a namespaced identifier so different routes don't share buckets.
 *
 *   rateLimit(buildIdentifier(request, "contact"), RateLimitPresets.contact)
 */
export function buildIdentifier(request: NextRequest, namespace: string): string {
  return `${namespace}:${getClientIdentifier(request)}`;
}
