/*
  Warnings:

  - You are about to drop the column `valid_from` on the `certificates` table. All the data in the column will be lost.
  - You are about to drop the column `valid_to` on the `certificates` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "certificates" DROP COLUMN "valid_from",
DROP COLUMN "valid_to",
ADD COLUMN     "accepted" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "delivery_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
ADD COLUMN     "email" TEXT,
ADD COLUMN     "phone" TEXT,
ADD COLUMN     "user_id" TEXT;

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
