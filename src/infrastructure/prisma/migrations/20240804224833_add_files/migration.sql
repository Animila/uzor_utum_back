-- CreateTable
CREATE TABLE "files" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "path" TEXT NOT NULL,
    "entity_type" TEXT NOT NULL,
    "entity_id" INTEGER NOT NULL,
    "typefile" TEXT NOT NULL,

    CONSTRAINT "files_pkey" PRIMARY KEY ("id")
);
