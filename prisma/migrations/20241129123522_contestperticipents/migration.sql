-- CreateEnum
CREATE TYPE "IsStudent" AS ENUM ('YES', 'NO');

-- CreateEnum
CREATE TYPE "TShirtSize" AS ENUM ('S', 'M', 'L', 'XL', 'XXL');

-- CreateEnum
CREATE TYPE "JobExperience" AS ENUM ('NONE', 'ONE_TO_SIX', 'SIX_TO_TWELVE', 'MORE_THAN_TWELVE');

-- CreateTable
CREATE TABLE "contestPerticipents" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "isStudent" "IsStudent" NOT NULL DEFAULT 'YES',
    "jobExperience" "JobExperience" NOT NULL DEFAULT 'NONE',
    "tShirtSize" "TShirtSize" NOT NULL DEFAULT 'L',
    "image" TEXT,
    "permissionLetter" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "contestPerticipents_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "contestPerticipents_email_key" ON "contestPerticipents"("email");

-- AddForeignKey
ALTER TABLE "contestPerticipents" ADD CONSTRAINT "contestPerticipents_email_fkey" FOREIGN KEY ("email") REFERENCES "users"("email") ON DELETE RESTRICT ON UPDATE CASCADE;
