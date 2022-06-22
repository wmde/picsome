/*
  Warnings:

  - Added the required column `description` to the `WikidataItemLabel` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "WikidataItemLabel" ADD COLUMN     "description" TEXT NOT NULL;

-- AddForeignKey
ALTER TABLE "WikidataItemLabel" ADD FOREIGN KEY ("wdId") REFERENCES "WikidataItem"("wdId") ON DELETE CASCADE ON UPDATE CASCADE;
