/*
  Warnings:

  - The `accountType` column on the `User` table would be dropped and recreated. This will lead to data loss if there is data in the column.

*/
-- CreateEnum
CREATE TYPE "public"."AccountType" AS ENUM ('SAVINGS', 'FIXED', 'SALARY', 'DEMAT');

-- AlterTable
ALTER TABLE "public"."User" DROP COLUMN "accountType",
ADD COLUMN     "accountType" "public"."AccountType" DEFAULT 'SAVINGS';
