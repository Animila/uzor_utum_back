/*
  Warnings:

  - You are about to drop the column `image_path` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `image_path` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `preview_path` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `path_images` on the `products` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "categories" DROP COLUMN "image_path";

-- AlterTable
ALTER TABLE "materials" DROP COLUMN "image_path";

-- AlterTable
ALTER TABLE "news" DROP COLUMN "preview_path";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "path_images";
