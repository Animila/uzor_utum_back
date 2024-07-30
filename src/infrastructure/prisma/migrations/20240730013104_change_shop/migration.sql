/*
  Warnings:

  - The `phone` column on the `shops` table would be dropped and recreated. This will lead to data loss if there is data in the column.
  - Added the required column `email` to the `shops` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "shops" ADD COLUMN     "email" TEXT NOT NULL,
DROP COLUMN "phone",
ADD COLUMN     "phone" TEXT[];
