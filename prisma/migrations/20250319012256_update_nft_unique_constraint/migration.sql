/*
  Warnings:

  - A unique constraint covering the columns `[tokenId,contractAddress]` on the table `NFT` will be added. If there are existing duplicate values, this will fail.

*/
-- DropIndex
DROP INDEX "NFT_tokenId_key";

-- CreateIndex
CREATE UNIQUE INDEX "NFT_tokenId_contractAddress_key" ON "NFT"("tokenId", "contractAddress");
