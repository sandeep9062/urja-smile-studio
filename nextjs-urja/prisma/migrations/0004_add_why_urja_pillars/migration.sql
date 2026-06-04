-- CreateTable
CREATE TABLE "why_urja_pillars" (
    "id" TEXT NOT NULL,
    "order" INTEGER NOT NULL DEFAULT 0,
    "tag" TEXT NOT NULL,
    "headline" TEXT NOT NULL,
    "body" TEXT NOT NULL,
    "image" TEXT NOT NULL,
    "fallbackGradient" TEXT NOT NULL,
    "imageAlt" TEXT NOT NULL,
    "nudge" TEXT NOT NULL DEFAULT 'mt-0',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "why_urja_pillars_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "why_urja_pillars_order_idx" ON "why_urja_pillars"("order");

-- CreateIndex
CREATE INDEX "why_urja_pillars_isActive_idx" ON "why_urja_pillars"("isActive");