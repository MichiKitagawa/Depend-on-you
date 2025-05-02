-- CreateTable
CREATE TABLE "PostScore" (
    "id" TEXT NOT NULL,
    "postId" TEXT NOT NULL,
    "score" DOUBLE PRECISION NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "PostScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "PostScore_postId_key" ON "PostScore"("postId");

-- CreateIndex
CREATE INDEX "PostScore_score_idx" ON "PostScore"("score");

-- CreateIndex
CREATE INDEX "PostScore_calculatedAt_idx" ON "PostScore"("calculatedAt");
