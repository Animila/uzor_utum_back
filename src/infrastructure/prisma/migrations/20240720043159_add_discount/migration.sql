-- DropIndex
DROP INDEX "products_attributes_idx";

-- DropIndex
DROP INDEX "products_name_trgm_idx";

-- CreateTable
CREATE TABLE "discounts" (
    "id" TEXT NOT NULL,
    "percentage" DOUBLE PRECISION NOT NULL,
    "start_date" TIMESTAMP(3) NOT NULL,
    "end_date" TIMESTAMP(3) NOT NULL,
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "product_id" TEXT NOT NULL,

    CONSTRAINT "discounts_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "discounts" ADD CONSTRAINT "discounts_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE CASCADE ON UPDATE CASCADE;
