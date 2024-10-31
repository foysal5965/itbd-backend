-- CreateEnum
CREATE TYPE "ExamStatus" AS ENUM ('DRAFT', 'PUBLISHED', 'ACTIVE', 'CLOSED', 'GRADING', 'COMPLETED', 'CANCELLED');

-- AlterTable
ALTER TABLE "exams" ADD COLUMN     "status" "ExamStatus" NOT NULL DEFAULT 'DRAFT';
