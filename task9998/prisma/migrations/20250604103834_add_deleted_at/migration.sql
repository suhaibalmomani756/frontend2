/*
  Warnings:

  - Added the required column `updatedAt` to the `Course` table without a default value. This is not possible if the table is not empty.

*/
-- Add createdAt and updatedAt columns with default values
ALTER TABLE "Course" ADD COLUMN "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
ALTER TABLE "Course" ADD COLUMN "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;

-- Remove default values after data is set
ALTER TABLE "Course" ALTER COLUMN "createdAt" DROP DEFAULT;
ALTER TABLE "Course" ALTER COLUMN "updatedAt" DROP DEFAULT;
