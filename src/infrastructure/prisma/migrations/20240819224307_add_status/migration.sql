/*
  Warnings:

  - The values [CANCALLED] on the enum `StatusPayment` will be removed. If these variants are still used in the database, this will fail.
  - You are about to drop the column `image_path` on the `categories` table. All the data in the column will be lost.
  - You are about to drop the column `image_path` on the `materials` table. All the data in the column will be lost.
  - You are about to drop the column `preview_path` on the `news` table. All the data in the column will be lost.
  - You are about to drop the column `path_images` on the `products` table. All the data in the column will be lost.

*/
-- AlterEnum
BEGIN;
CREATE TYPE "StatusPayment_new" AS ENUM ('PENDING', 'CANCELLED', 'PAIDING', 'BUILDING', 'SENDING', 'AWAITING', 'SUCCESSED');
ALTER TABLE "orders" ALTER COLUMN "status" TYPE "StatusPayment_new" USING ("status"::text::"StatusPayment_new");
ALTER TYPE "StatusPayment" RENAME TO "StatusPayment_old";
ALTER TYPE "StatusPayment_new" RENAME TO "StatusPayment";
DROP TYPE "StatusPayment_old";
COMMIT;

-- AlterTable
ALTER TABLE "categories" DROP COLUMN "image_path";

-- AlterTable
ALTER TABLE "materials" DROP COLUMN "image_path";

-- AlterTable
ALTER TABLE "news" DROP COLUMN "preview_path";

-- AlterTable
ALTER TABLE "products" DROP COLUMN "path_images";
