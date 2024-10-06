-- CreateTable
CREATE TABLE "payments" (
    "id" TEXT NOT NULL,
    "enrolledCourseId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "transactionId" TEXT NOT NULL,
    "status" "PaymentStatus" NOT NULL DEFAULT 'UNPAID',
    "paymentGatewayData" JSONB,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "payments_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "payments_enrolledCourseId_key" ON "payments"("enrolledCourseId");

-- CreateIndex
CREATE UNIQUE INDEX "payments_transactionId_key" ON "payments"("transactionId");

-- AddForeignKey
ALTER TABLE "payments" ADD CONSTRAINT "payments_enrolledCourseId_fkey" FOREIGN KEY ("enrolledCourseId") REFERENCES "student_enrolled_courses"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
