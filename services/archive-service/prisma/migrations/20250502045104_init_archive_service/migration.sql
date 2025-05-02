-- CreateEnum
CREATE TYPE "ArchiveStatus" AS ENUM ('ARCHIVED');

-- CreateTable
CREATE TABLE "ArchivedMagazine" (
    "id" TEXT NOT NULL,
    "originalData" JSONB NOT NULL,
    "status" "ArchiveStatus" NOT NULL DEFAULT 'ARCHIVED',
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastFeaturedAt" TIMESTAMP(3),

    CONSTRAINT "ArchivedMagazine_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ArchivedPost" (
    "id" TEXT NOT NULL,
    "originalData" JSONB NOT NULL,
    "status" "ArchiveStatus" NOT NULL DEFAULT 'ARCHIVED',
    "archivedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "lastFeaturedAt" TIMESTAMP(3),

    CONSTRAINT "ArchivedPost_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "ArchivedMagazine_status_idx" ON "ArchivedMagazine"("status");

-- CreateIndex
CREATE INDEX "ArchivedMagazine_archivedAt_idx" ON "ArchivedMagazine"("archivedAt");

-- CreateIndex
CREATE INDEX "ArchivedPost_status_idx" ON "ArchivedPost"("status");

-- CreateIndex
CREATE INDEX "ArchivedPost_archivedAt_idx" ON "ArchivedPost"("archivedAt");
