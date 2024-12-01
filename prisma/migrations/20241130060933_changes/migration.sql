/*
  Warnings:

  - Added the required column `contestId` to the `contestPerticipents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contestPerticipents" ADD COLUMN     "contestId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "contestPerticipents" ADD CONSTRAINT "contestPerticipents_contestId_fkey" FOREIGN KEY ("contestId") REFERENCES "contests"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
