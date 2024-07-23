-- CreateEnum
CREATE TYPE "LikeType" AS ENUM ('like', 'unlike');

-- AlterTable
ALTER TABLE "likes" ADD COLUMN     "type" "LikeType" NOT NULL DEFAULT 'like';
