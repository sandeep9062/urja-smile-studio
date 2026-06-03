import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { requireAuth, successResponse, errorResponse, applyRateLimit } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  const limited = await applyRateLimit(request, { preset: "adminRead", namespace: "admin:seo:scores" });
  if (limited) return limited;
  try {
    const authResult = await requireAuth();
    if (authResult instanceof Response) return authResult;

    // Generate SEO scores based on actual data in the database
    const [services, blogs, pages] = await Promise.all([
      prisma.service.findMany({ select: { name: true, metaTitle: true, metaDescription: true, keywords: true } }),
      prisma.blogPost.findMany({ select: { title: true, metaTitle: true, metaDescription: true } }),
      prisma.pageContent.findMany({ select: { title: true, metaTitle: true, metaDescription: true } }),
    ]);

    const calculateScore = (item: { metaTitle: string | null; metaDescription: string | null }) => {
      let score = 100;
      const checks: { type: "success" | "warning" | "error"; message: string }[] = [];

      if (item.metaTitle && item.metaTitle.length >= 30 && item.metaTitle.length <= 60) {
        checks.push({ type: "success", message: "Meta title length is optimal" });
      } else if (item.metaTitle) {
        score -= 10;
        checks.push({ type: "warning", message: "Meta title length should be 30-60 characters" });
      } else {
        score -= 20;
        checks.push({ type: "error", message: "Meta title is missing" });
      }

      if (item.metaDescription && item.metaDescription.length >= 120 && item.metaDescription.length <= 160) {
        checks.push({ type: "success", message: "Meta description length is optimal" });
      } else if (item.metaDescription) {
        score -= 10;
        checks.push({ type: "warning", message: "Meta description should be 120-160 characters" });
      } else {
        score -= 20;
        checks.push({ type: "error", message: "Meta description is missing" });
      }

      checks.push({ type: "success", message: "Valid URL structure" });
      return { score, checks };
    };

    const scores = [
      { page: "Home", ...calculateScore({ metaTitle: "Home", metaDescription: "Welcome to our dental clinic" }) },
      ...services.map((s) => ({ page: s.name, ...calculateScore({ metaTitle: s.metaTitle, metaDescription: s.metaDescription }) })),
      ...blogs.map((b) => ({ page: b.title, ...calculateScore({ metaTitle: b.metaTitle, metaDescription: b.metaDescription }) })),
    ];

    return successResponse(scores.slice(0, 20)); // Return top 20
  } catch (error) { return errorResponse("An error occurred", 500); }
}