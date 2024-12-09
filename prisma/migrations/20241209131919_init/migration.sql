-- CreateEnum
CREATE TYPE "status" AS ENUM ('在庫あり', '要購入');

-- CreateTable
CREATE TABLE "products" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "image_path" TEXT,
    "order_url" TEXT,
    "barcode" TEXT,
    "status" "status" NOT NULL DEFAULT '在庫あり',
    "description" TEXT,
    "yahoo_checked" BOOLEAN NOT NULL DEFAULT false,
    "webhook_checked" BOOLEAN NOT NULL DEFAULT false,
    "purchase_location" TEXT NOT NULL,
    "stock_quantity" INTEGER NOT NULL DEFAULT 1,
    "minimum_stock" INTEGER NOT NULL DEFAULT 1,
    "created_at" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "products_pkey" PRIMARY KEY ("id")
);
