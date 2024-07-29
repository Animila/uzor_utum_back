-- CreateEnum
CREATE TYPE "StatusPayment" AS ENUM ('PENDING', 'SUCCESSED', 'CANCALLED');

-- CreateTable
CREATE TABLE "orders" (
    "id" TEXT NOT NULL,
    "user_id" TEXT NOT NULL,
    "status" "StatusPayment" NOT NULL,
    "token" TEXT NOT NULL,
    "payment_id" TEXT,
    "items" JSONB NOT NULL,
    "first_name" TEXT NOT NULL,
    "last_name" TEXT NOT NULL,
    "certificate_id" TEXT,
    "send_type_id" TEXT NOT NULL,
    "address" TEXT NOT NULL,
    "house" TEXT NOT NULL,
    "apartament" TEXT,
    "postal_code" INTEGER NOT NULL,
    "cabinet" INTEGER,
    "delivery_at" TIMESTAMP(3) NOT NULL,
    "comment" TEXT NOT NULL,
    "receiver_id" TEXT NOT NULL,
    "promocode_id" TEXT,
    "add_bonuses" INTEGER NOT NULL,
    "use_bonus" INTEGER NOT NULL,
    "total_amount" DOUBLE PRECISION NOT NULL,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "orders_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "send_types" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "price" INTEGER NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "send_types_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "receivers" (
    "id" TEXT NOT NULL,
    "token" TEXT NOT NULL,
    "full_name" TEXT NOT NULL,
    "phone" TEXT NOT NULL,

    CONSTRAINT "receivers_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_user_id_fkey" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_certificate_id_fkey" FOREIGN KEY ("certificate_id") REFERENCES "certificates"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_send_type_id_fkey" FOREIGN KEY ("send_type_id") REFERENCES "send_types"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_receiver_id_fkey" FOREIGN KEY ("receiver_id") REFERENCES "receivers"("id") ON DELETE NO ACTION ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "orders" ADD CONSTRAINT "orders_promocode_id_fkey" FOREIGN KEY ("promocode_id") REFERENCES "promocodes"("id") ON DELETE NO ACTION ON UPDATE CASCADE;
