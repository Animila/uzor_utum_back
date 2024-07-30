/*
  Warnings:

  - You are about to drop the column `attributes` on the `products` table. All the data in the column will be lost.
  - Added the required column `image_path` to the `categories` table without a default value. This is not possible if the table is not empty.
  - Added the required column `image_path` to the `materials` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "categories" ADD COLUMN     "image_path" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "materials" ADD COLUMN     "image_path" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "products" DROP COLUMN "attributes",
ADD COLUMN     "decoration_ids" TEXT[],
ADD COLUMN     "prob_ids" TEXT[],
ADD COLUMN     "size_ids" TEXT[];

-- CreateTable
CREATE TABLE "sizes" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "sizes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "probs" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "probs_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "decorations" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,

    CONSTRAINT "decorations_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sizes_title_key" ON "sizes"("title");

-- CreateIndex
CREATE UNIQUE INDEX "probs_title_key" ON "probs"("title");

-- CreateIndex
CREATE UNIQUE INDEX "decorations_title_key" ON "decorations"("title");
