/*
  Warnings:

  - You are about to drop the column `correctOptionId` on the `questions` table. All the data in the column will be lost.
  - Added the required column `correctOption` to the `questions` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "questions" DROP COLUMN "correctOptionId",
ADD COLUMN     "correctOption" TEXT NOT NULL;
