/*
  Warnings:

  - Added the required column `email` to the `orders` table without a default value. This is not possible if the table is not empty.
  - Added the required column `phone` to the `orders` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "orders" ADD COLUMN     "email" TEXT NOT NULL,
ADD COLUMN     "phone" TEXT NOT NULL,
ADD COLUMN     "shop_id" TEXT,
ALTER COLUMN "user_id" DROP NOT NULL,
ALTER COLUMN "address" DROP NOT NULL,
ALTER COLUMN "house" DROP NOT NULL,
ALTER COLUMN "postal_code" DROP NOT NULL,
ALTER COLUMN "cabinet" SET DATA TYPE TEXT,
ALTER COLUMN "delivery_at" DROP NOT NULL,
ALTER COLUMN "comment" DROP NOT NULL;

-- CreateTable
CREATE TABLE "shops" (
    "id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "longitude" TEXT NOT NULL,
    "latitude" TEXT NOT NULL,
    "time" JSONB NOT NULL,
    "phone" JSONB NOT NULL,

    CONSTRAINT "shops_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_shop_id_fkey" FOREIGN KEY ("shop_id") REFERENCES "shops"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
