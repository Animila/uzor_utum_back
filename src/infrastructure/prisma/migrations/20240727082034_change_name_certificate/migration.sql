/*
  Warnings:

  - You are about to drop the `sertification_types` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `sertifications` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE "sertifications" DROP CONSTRAINT "sertifications_sertification_type_id_fkey";

-- DropTable
DROP TABLE "sertification_types";

-- DropTable
DROP TABLE "sertifications";

-- CreateTable
CREATE TABLE "certificate_types" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "certificate_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "certificates" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_to" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "certificate_type_id" TEXT NOT NULL,

    CONSTRAINT "certificates_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "certificates_code_key" ON "certificates"("code");

-- AddForeignKey
ALTER TABLE "certificates" ADD CONSTRAINT "certificates_certificate_type_id_fkey" FOREIGN KEY ("certificate_type_id") REFERENCES "certificate_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
