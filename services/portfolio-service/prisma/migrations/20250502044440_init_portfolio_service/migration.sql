-- CreateTable
CREATE TABLE "UserActivitySummary" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "totalReads" INTEGER NOT NULL DEFAULT 0,
    "totalLikes" INTEGER NOT NULL DEFAULT 0,
    "totalBoosts" INTEGER NOT NULL DEFAULT 0,
    "lastUpdatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "UserActivitySummary_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CreditScore" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "calculatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "CreditScore_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "UserActivitySummary_userId_key" ON "UserActivitySummary"("userId");

-- CreateIndex
CREATE UNIQUE INDEX "CreditScore_userId_key" ON "CreditScore"("userId");

-- CreateIndex
CREATE INDEX "CreditScore_score_idx" ON "CreditScore"("score");

-- CreateIndex
CREATE INDEX "CreditScore_calculatedAt_idx" ON "CreditScore"("calculatedAt");
