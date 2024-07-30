-- AlterTable
ALTER TABLE "cart_items" ADD COLUMN     "decorate_id" TEXT,
ADD COLUMN     "proba_id" TEXT,
ADD COLUMN     "size_id" TEXT;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_size_id_fkey" FOREIGN KEY ("size_id") REFERENCES "sizes"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_decorate_id_fkey" FOREIGN KEY ("decorate_id") REFERENCES "decorations"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "cart_items" ADD CONSTRAINT "cart_items_proba_id_fkey" FOREIGN KEY ("proba_id") REFERENCES "probs"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
