/*
  Warnings:

  - You are about to drop the column `postId` on the `ActionLog` table. All the data in the column will be lost.
  - Added the required column `targetId` to the `ActionLog` table without a default value. This is not possible if the table is not empty.
  - Added the required column `targetType` to the `ActionLog` table without a default value. This is not possible if the table is not empty.

*/
-- AlterEnum
ALTER TYPE "ActionType" ADD VALUE 'SHARE';

-- DropIndex
DROP INDEX "ActionLog_postId_idx";

-- AlterTable
ALTER TABLE "ActionLog" DROP COLUMN "postId",
ADD COLUMN     "boostAmount" INTEGER,
ADD COLUMN     "commentText" TEXT,
ADD COLUMN     "readDurationSeconds" INTEGER,
ADD COLUMN     "sharePlatform" TEXT,
ADD COLUMN     "targetId" TEXT NOT NULL,
ADD COLUMN     "targetType" TEXT NOT NULL;

-- CreateIndex
CREATE INDEX "ActionLog_targetType_targetId_idx" ON "ActionLog"("targetType", "targetId");
