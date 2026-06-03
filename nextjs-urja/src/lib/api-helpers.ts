import { NextRequest, NextResponse } from "next/server";
import { z, ZodError, ZodSchema } from "zod";
import { auth } from "@/auth";
import {
  rateLimit,
  buildIdentifier,
  getClientIdentifier,
  RateLimitPreset,
  RateLimitResult,
} from "@/lib/rate-limit";
import { formatZodErrors, FieldErrors } from "@/lib/validators";

// --- Response Helpers --------------------------------------------------------

export function successResponse<T>(data: T, message?: string, status = 200) {
  return NextResponse.json({ success: true, data, message }, { status });
}

export function paginatedResponse<T>(
  items: T[],
  total: number,
  page: number,
  limit: number,
) {
  return NextResponse.json({
    success: true,
    data: {
      items,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    },
  });
}

export function errorResponse(error: string, status = 400) {
  return NextResponse.json({ success: false, error }, { status });
}

export function unauthorizedResponse(message = "Unauthorized") {
  return NextResponse.json({ success: false, error: message }, { status: 401 });
}

export function forbiddenResponse(message = "Forbidden") {
  return NextResponse.json({ success: false, error: message }, { status: 403 });
}

export function notFoundResponse(message = "Resource not found") {
  return NextResponse.json({ success: false, error: message }, { status: 404 });
}

/**
 * Return a 400 with both a top-level message AND a field-keyed error map
 * (produced by Zod). The shape matches the rest of our API responses.
 */
export function validationErrorResponse(
  zodError: ZodError,
  status = 400,
): NextResponse {
  const { message, fieldErrors } = formatZodErrors(zodError);
  return NextResponse.json(
    { success: false, error: message, fieldErrors },
    { status },
  );
}

/**
 * Return a 429 with rate-limit headers. Always sets the standard
 * `X-RateLimit-*` and `Retry-After` headers so clients can back off.
 */
export function rateLimitResponse(
  result: RateLimitResult,
  message = "Too many requests, please try again later.",
): NextResponse {
  const retryAfterSec = Math.max(1, Math.ceil((result.reset - Date.now()) / 1000));
  const res = NextResponse.json(
    { success: false, error: message, retryAfter: result.reset },
    { status: 429 },
  );
  res.headers.set("X-RateLimit-Limit", String(result.limit));
  res.headers.set("X-RateLimit-Remaining", "0");
  res.headers.set("X-RateLimit-Reset", String(Math.floor(result.reset / 1000)));
  res.headers.set("Retry-After", String(retryAfterSec));
  return res;
}

// --- Auth Session Helper -----------------------------------------------------

export async function requireAuth(): Promise<
  { userId: string; email: string; role: string } | NextResponse
> {
  const session = await auth();
  if (!session?.user) {
    return unauthorizedResponse() as NextResponse;
  }
  const user = session.user as any;
  return { userId: user.id, email: user.email, role: user.role };
}

// --- Query Helpers -----------------------------------------------------------

export function getPaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get("page") || "1", 10));
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get("limit") || "10", 10)));
  const skip = (page - 1) * limit;

  return { page, limit, skip };
}

export function getSearchParams(searchParams: URLSearchParams) {
  const search = searchParams.get("search") || "";
  const status = searchParams.get("status") || "";
  const category = searchParams.get("category") || "";
  const sort = searchParams.get("sort") || "createdAt";
  const order = searchParams.get("order") || "desc";

  return { search, status, category, sort, order };
}

// --- Validation Helper -------------------------------------------------------

export type ParsedJson<T> =
  | { ok: true; data: T }
  | { ok: false; response: NextResponse };

/**
 * Parse and validate a JSON body using a Zod schema. Returns a discriminated
 * union — call sites do:
 *
 *   const parsed = await parseJsonBody(request, createBlogSchema);
 *   if (!parsed.ok) return parsed.response;
 *   const data = parsed.data; // fully typed
 */
export async function parseJsonBody<T>(
  request: NextRequest,
  schema: ZodSchema<T>,
): Promise<ParsedJson<T>> {
  let raw: unknown;
  try {
    raw = await request.json();
  } catch {
    return {
      ok: false,
      response: NextResponse.json(
        { success: false, error: "Invalid JSON body" },
        { status: 400 },
      ),
    };
  }
  const result = schema.safeParse(raw);
  if (!result.success) {
    return { ok: false, response: validationErrorResponse(result.error) };
  }
  return { ok: true, data: result.data };
}

/** Validate search params (or any plain object) against a Zod schema. */
export function parseQuery<T extends ZodSchema>(
  source: URLSearchParams | Record<string, string | string[] | undefined>,
  schema: T,
): ParsedJson<z.infer<T>> {
  const obj: Record<string, string> = {};
  if (source instanceof URLSearchParams) {
    source.forEach((v, k) => {
      obj[k] = v;
    });
  } else {
    for (const [k, v] of Object.entries(source)) {
      if (v == null) continue;
      obj[k] = Array.isArray(v) ? v[0] ?? "" : v;
    }
  }
  const result = schema.safeParse(obj);
  if (!result.success) {
    return { ok: false, response: validationErrorResponse(result.error) };
  }
  return { ok: true, data: result.data };
}

// --- Rate Limiting Helpers ---------------------------------------------------

export interface ApplyRateLimitOptions {
  /** Preset name or custom config. */
  preset: RateLimitPreset;
  /** Bucket namespace so different routes don't share counters. */
  namespace: string;
  /** When true, identify by user id (auth) instead of IP. */
  identifyByUser?: boolean;
}

/**
 * Apply rate limiting to a request. Returns either `null` (allowed) or a
 * `NextResponse` to return immediately (429).
 *
 * If you need access to the result (e.g. to set `X-RateLimit-Remaining`),
 * use `enforceRateLimit` + `rateLimitResponse` directly.
 */
export async function applyRateLimit(
  request: NextRequest,
  options: ApplyRateLimitOptions,
): Promise<NextResponse | null> {
  const { preset, namespace, identifyByUser } = options;

  let identifier: string;
  if (identifyByUser) {
    const session = await auth();
    const userId = (session?.user as any)?.id;
    identifier = userId
      ? `${namespace}:user:${userId}`
      : `${namespace}:ip:${getClientIdentifier(request)}`;
  } else {
    identifier = buildIdentifier(request, namespace);
  }

  const result = await rateLimit(identifier, preset);
  if (!result.success) {
    return rateLimitResponse(result);
  }
  return null;
}

// Re-exports for convenience
export { getClientIdentifier, buildIdentifier, rateLimit, formatZodErrors };
export type { FieldErrors, RateLimitResult };
