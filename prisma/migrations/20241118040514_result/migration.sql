-- CreateTable
CREATE TABLE "student_results" (
    "id" TEXT NOT NULL,
    "examName" TEXT NOT NULL,
    "score" INTEGER NOT NULL,
    "studentId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "student_results_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "student_results" ADD CONSTRAINT "student_results_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "students"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
