/*
  Warnings:

  - You are about to drop the column `quantity` on the `orders` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "orders" DROP COLUMN "quantity";

-- AlterTable
ALTER TABLE "products" ALTER COLUMN "image" DROP NOT NULL;

-- AlterTable
ALTER TABLE "tokens" ALTER COLUMN "refresh_token" DROP NOT NULL;

-- AlterTable
ALTER TABLE "users" ALTER COLUMN "email_verification_token" DROP NOT NULL,
ALTER COLUMN "email_verified_at" DROP NOT NULL;
