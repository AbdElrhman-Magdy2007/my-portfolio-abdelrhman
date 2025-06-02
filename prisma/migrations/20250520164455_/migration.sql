/*
  Warnings:

  - You are about to drop the column `name` on the `Category` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE "Category" DROP COLUMN "name";

-- CreateTable
CREATE TABLE "ProductTech" (
    "id" TEXT NOT NULL,
    "name" TEXT NOT NULL,
    "productId" TEXT NOT NULL,

    CONSTRAINT "ProductTech_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "ProductTech" ADD CONSTRAINT "ProductTech_productId_fkey" FOREIGN KEY ("productId") REFERENCES "Product"("id") ON DELETE CASCADE ON UPDATE CASCADE;
