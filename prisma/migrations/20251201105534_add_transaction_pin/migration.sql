/*
  Warnings:

  - Added the required column `durationMonths` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `employmentStatus` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `monthlyIncome` to the `Loan` table without a default value. This is not possible if the table is not empty.
  - Added the required column `purpose` to the `Loan` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "public"."Loan" ADD COLUMN     "durationMonths" INTEGER NOT NULL,
ADD COLUMN     "employmentStatus" TEXT NOT NULL,
ADD COLUMN     "monthlyIncome" DOUBLE PRECISION NOT NULL,
ADD COLUMN     "purpose" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "public"."Transaction" ADD COLUMN     "metadata" JSONB;

-- AlterTable
ALTER TABLE "public"."User" ADD COLUMN     "transactionPin" TEXT,
ADD COLUMN     "transferOtp" TEXT,
ADD COLUMN     "transferOtpExpires" TIMESTAMP(3);

-- CreateTable
CREATE TABLE "public"."Transfer" (
    "id" TEXT NOT NULL,
    "userId" TEXT NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "bankName" TEXT NOT NULL,
    "accountNumber" TEXT NOT NULL,
    "accountName" TEXT NOT NULL,
    "routingNumber" TEXT,
    "swiftCode" TEXT,
    "bankAddress" TEXT,
    "houseAddress" TEXT,
    "zipCode" TEXT,
    "otp" TEXT,
    "otpExpires" TIMESTAMP(3),
    "status" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "scheduledAt" TIMESTAMP(3),

    CONSTRAINT "Transfer_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "public"."Transfer" ADD CONSTRAINT "Transfer_userId_fkey" FOREIGN KEY ("userId") REFERENCES "public"."User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
