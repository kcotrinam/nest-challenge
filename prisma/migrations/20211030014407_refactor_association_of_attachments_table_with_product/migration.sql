/*
  Warnings:

  - You are about to drop the column `user_id` on the `attachments` table. All the data in the column will be lost.
  - Added the required column `product_id` to the `attachments` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "attachments" DROP CONSTRAINT "attachments_user_id_fkey";

-- AlterTable
ALTER TABLE "attachments" DROP COLUMN "user_id",
ADD COLUMN     "product_id" INTEGER NOT NULL;

-- AddForeignKey
ALTER TABLE "attachments" ADD CONSTRAINT "attachments_product_id_fkey" FOREIGN KEY ("product_id") REFERENCES "products"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
