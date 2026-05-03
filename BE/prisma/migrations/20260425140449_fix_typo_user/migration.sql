/*
  Warnings:

  - You are about to drop the column `refferalCode` on the `User` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[referralCode]` on the table `User` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `referralCode` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "User_refferalCode_key";

-- AlterTable
ALTER TABLE "User" DROP COLUMN "refferalCode",
ADD COLUMN     "referralCode" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "User_referralCode_key" ON "User"("referralCode");
