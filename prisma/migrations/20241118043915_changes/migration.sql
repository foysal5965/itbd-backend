/*
  Warnings:

  - You are about to drop the column `examName` on the `student_results` table. All the data in the column will be lost.
  - Added the required column `examId` to the `student_results` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "student_results" DROP COLUMN "examName",
ADD COLUMN     "examId" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "student_results" ADD CONSTRAINT "student_results_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
