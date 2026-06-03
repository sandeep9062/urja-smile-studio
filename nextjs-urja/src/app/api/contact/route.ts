/**
 * Public contact-form endpoint.
 *
 *   POST /api/contact
 *
 * Validates input with Zod, applies strict per-IP rate limiting, and persists
 * the submission as an `Enquiry` in the database so the admin dashboard can
 * pick it up.
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
import { contactSubmissionSchema } from "@/lib/validators";
import { RateLimitPresets } from "@/lib/rate-limit";

export const runtime = "nodejs";

export async function POST(request: NextRequest) {
  // Strict rate limit: 5 submissions / minute / IP.
  const limited = await applyRateLimit(request, {
    preset: "contact",
    namespace: "contact",
  });
  if (limited) return limited;

  const parsed = await parseJsonBody(request, contactSubmissionSchema);
  if (!parsed.ok) return parsed.response;
  const { name, phone, email, subject, message, website } = parsed.data;

  // Honeypot trap — silently pretend success so bots learn nothing.
  if (website && website.length > 0) {
    return successResponse(
      { id: "spam-filtered" },
      "Thanks! We'll be in touch shortly.",
      201,
    );
  }

  try {
    const enquiry = await prisma.enquiry.create({
      data: {
        name,
        phone,
        email,
        subject: subject || "Contact form submission",
        message,
      },
      select: { id: true, createdAt: true },
    });

    return successResponse(
      { id: enquiry.id },
      "Thanks! We'll respond within one business day.",
      201,
    );
  } catch (error) {
    console.error("[api/contact] error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to submit your message. Please try again." },
      { status: 500 },
    );
  }
}
