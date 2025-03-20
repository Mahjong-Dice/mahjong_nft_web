/*
  Warnings:

  - A unique constraint covering the columns `[nftId]` on the table `Listing` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Listing_nftId_key" ON "Listing"("nftId");
