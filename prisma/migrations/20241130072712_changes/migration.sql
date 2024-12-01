/*
  Warnings:

  - Added the required column `instituteName` to the `contestPerticipents` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "contestPerticipents" ADD COLUMN     "instituteName" TEXT NOT NULL;
