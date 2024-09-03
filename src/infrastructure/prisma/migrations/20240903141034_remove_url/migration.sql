/*
  Warnings:

  - You are about to drop the column `url` on the `reviews` table. All the data in the column will be lost.

*/
-- DropIndex
DROP INDEX "reviews_url_key";

-- AlterTable
ALTER TABLE "reviews" DROP COLUMN "url";
