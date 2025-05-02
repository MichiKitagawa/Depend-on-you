-- CreateTable
CREATE TABLE "RankingEntry" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "rank" INTEGER NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "cluster" TEXT,
    "calculatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "RankingEntry_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "RankingEntry_postId_idx" ON "RankingEntry"("postId");

-- CreateIndex
CREATE INDEX "RankingEntry_calculatedAt_idx" ON "RankingEntry"("calculatedAt");

-- CreateIndex
CREATE UNIQUE INDEX "RankingEntry_cluster_rank_key" ON "RankingEntry"("cluster" DESC, "rank");
