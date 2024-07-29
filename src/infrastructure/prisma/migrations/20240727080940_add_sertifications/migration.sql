-- CreateTable
CREATE TABLE "sertification_types" (
    "id" TEXT NOT NULL,
    "value" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "sertification_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "sertifications" (
    "id" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "activated" BOOLEAN NOT NULL DEFAULT false,
    "valid_from" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "valid_to" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "sertification_type_id" TEXT NOT NULL,

    CONSTRAINT "sertifications_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "sertifications_code_key" ON "sertifications"("code");

-- AddForeignKey
ALTER TABLE "sertifications" ADD CONSTRAINT "sertifications_sertification_type_id_fkey" FOREIGN KEY ("sertification_type_id") REFERENCES "sertification_types"("id") ON DELETE CASCADE ON UPDATE CASCADE;
