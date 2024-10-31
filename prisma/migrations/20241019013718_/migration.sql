/*
  Warnings:

  - The values [GRADING,COMPLETED,CANCELLED] on the enum `ExamStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "ExamStatus_new" AS ENUM ('DRAFT', 'PUBLISHED', 'ACTIVE', 'CLOSED');
ALTER TABLE "exams" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "exams" ALTER COLUMN "status" TYPE "ExamStatus_new" USING ("status"::text::"ExamStatus_new");
ALTER TYPE "ExamStatus" RENAME TO "ExamStatus_old";
ALTER TYPE "ExamStatus_new" RENAME TO "ExamStatus";
DROP TYPE "ExamStatus_old";
ALTER TABLE "exams" ALTER COLUMN "status" SET DEFAULT 'DRAFT';
COMMIT;
