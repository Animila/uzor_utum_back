-- CreateTable
CREATE TABLE "delivery_zones" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "polygon" JSONB NOT NULL,
    "price" TEXT NOT NULL,

    CONSTRAINT "delivery_zones_pkey" PRIMARY KEY ("id")
);
