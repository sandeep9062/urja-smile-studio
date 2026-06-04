/**
 * Public newsletter subscription endpoint.
 *
 *   POST /api/newsletter
 *
 * Validates input with Zod, applies rate limiting, and persists
 * the subscriber as a `NewsletterSubscriber` in the database.
 *
 * Public endpoint — no auth required. A `website` honeypot field is included
 * in the schema; any value in it is treated as spam and silently 200-OK'd.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import {
  applyRateLimit,
  parseJsonBody,
  successResponse,
} from "@/lib/api-helpers";
import { newsletterSubscriptionSchema } from "@/lib/validators";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // Rate limit: 5 subscriptions / minute / IP.
  const limited = await applyRateLimit(request, {
    preset: "contact",
    namespace: "newsletter",
  });
  if (limited) return limited;

  const parsed = await parseJsonBody(request, newsletterSubscriptionSchema);
  if (!parsed.ok) return parsed.response;
  const { email, name, website } = parsed.data;

  // Honeypot trap — silently pretend success so bots learn nothing.
  if (website && website.length > 0) {
    return successResponse(
      { id: "spam-filtered" },
      "Thanks for subscribing!",
      201,
    );
  }

  try {
    // Upsert: if email already exists, reactivate if previously unsubscribed
    const subscriber = await prisma.newsletterSubscriber.upsert({
      where: { email },
      update: { isActive: true, name: name || undefined },
      create: { email, name: name || undefined },
      select: { id: true, createdAt: true },
    });

    return successResponse(
      { id: subscriber.id },
      "Thanks for subscribing to our newsletter!",
      201,
    );
  } catch (error) {
    console.error("[api/newsletter] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to subscribe. Please try again." },
      { status: 500 },
    );
  }
}