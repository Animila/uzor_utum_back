-- AlterTable
ALTER TABLE "users" ADD COLUMN     "activated_at" BOOLEAN NOT NULL DEFAULT false,
ADD COLUMN     "last_online_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP;
