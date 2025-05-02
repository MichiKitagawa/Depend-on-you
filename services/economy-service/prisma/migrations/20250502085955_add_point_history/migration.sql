-- CreateEnum
CREATE TYPE "PointHistoryType" AS ENUM ('CREDIT', 'DEBIT');

-- CreateTable
CREATE TABLE "PointHistory" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "walletId" TEXT NOT NULL,
    "amount" INTEGER NOT NULL,
    "type" "PointHistoryType" NOT NULL,
    "reason" TEXT NOT NULL,
    "relatedId" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "PointHistory_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "PointHistory_userId_idx" ON "PointHistory"("userId");

-- CreateIndex
CREATE INDEX "PointHistory_walletId_idx" ON "PointHistory"("walletId");

-- CreateIndex
CREATE INDEX "PointHistory_createdAt_idx" ON "PointHistory"("createdAt");

-- AddForeignKey
ALTER TABLE "PointHistory" ADD CONSTRAINT "PointHistory_walletId_fkey" FOREIGN KEY ("walletId") REFERENCES "Wallet"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
