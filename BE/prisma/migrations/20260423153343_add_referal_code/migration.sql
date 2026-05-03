/*
  Warnings:

  - A unique constraint covering the columns `[refferalCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refferalCode" TEXT;

-- CreateIndex
CREATE UNIQUE INDEX "User_refferalCode_key" ON "User"("refferalCode");
