-- CreateEnum
CREATE TYPE "BonusesType" AS ENUM ('minus', 'plus');

-- CreateTable
CREATE TABLE "bonuses" (
    "id" TEXT NOT NULL,
    "type" "BonusesType" NOT NULL,
    "description" TEXT NOT NULL,
    "count" INTEGER NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "user_id" TEXT NOT NULL,

    CONSTRAINT "bonuses_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "bonuses" ADD CONSTRAINT "bonuses_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
