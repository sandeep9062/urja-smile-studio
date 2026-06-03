import { NextRequest } from "next/server";
import { prisma } from "@/lib/prisma";
import { successResponse, errorResponse, getPaginationParams } from "@/lib/api-helpers";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = request.nextUrl;
    const { page, limit, skip } = getPaginationParams(searchParams);
    const category = searchParams.get("category");
    const search = searchParams.get("search");

    const where: Record<string, unknown> = {
      status: "published",
    };

    if (category) {
      where.category = category;
    }

    if (search) {
      where.OR = [
        { title: { contains: search, mode: "insensitive" } },
        { excerpt: { contains: search, mode: "insensitive" } },
      ];
    }

    const [items, total] = await Promise.all([
      prisma.blogPost.findMany({
        where,
        skip,
        take: limit,
        orderBy: { publishDate: "desc" },
        select: {
          id: true,
          title: true,
          slug: true,
          excerpt: true,
          featuredImage: true,
          category: true,
          tags: true,
          publishDate: true,
          views: true,
          author: { select: { name: true } },
        },
      }),
      prisma.blogPost.count({ where }),
    ]);

    // Get unique categories
    const categories = await prisma.blogPost.findMany({
      where: { status: "published" },
      select: { category: true },
      distinct: ["category"],
    });

    return successResponse({
      items: items.map((b) => ({
        _id: b.id,
        title: b.title,
        slug: b.slug,
        excerpt: b.excerpt,
        featuredImage: b.featuredImage,
        category: b.category,
        tags: b.tags,
        publishDate: b.publishDate?.toISOString() || null,
        views: b.views,
        author: b.author?.name || "",
      })),
      categories: categories.map((c) => c.category),
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error("Get public blogs error:", error);
    return errorResponse("An error occurred", 500);
  }
}