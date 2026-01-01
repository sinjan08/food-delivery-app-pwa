/*
  Warnings:

  - You are about to drop the column `formStepCompleted` on the `Restaurant` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Restaurant" DROP COLUMN "formStepCompleted";

-- AlterTable
ALTER TABLE "User" ADD COLUMN     "formStepCompleted" INTEGER NOT NULL DEFAULT 0;
