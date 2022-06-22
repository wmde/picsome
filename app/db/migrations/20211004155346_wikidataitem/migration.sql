/*
  Warnings:

  - Added the required column `wikidataItemWdId` to the `Tag` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Tag" ADD COLUMN     "wikidataItemWdId" TEXT NOT NULL;

-- CreateTable
CREATE TABLE "WikidataItem" (
    "wdId" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("wdId")
);

-- CreateTable
CREATE TABLE "WikidataItemLabel" (
    "id" SERIAL NOT NULL,
    "wdId" TEXT NOT NULL,
    "locale" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "WikidataItemLabel.wdId_locale_unique" ON "WikidataItemLabel"("wdId", "locale");

-- AddForeignKey
ALTER TABLE "Tag" ADD FOREIGN KEY ("wikidataItemWdId") REFERENCES "WikidataItem"("wdId") ON DELETE CASCADE ON UPDATE CASCADE;
