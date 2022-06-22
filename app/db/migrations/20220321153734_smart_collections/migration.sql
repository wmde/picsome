-- AlterEnum
-- ALTER TYPE "CollectionType" ADD VALUE 'SmartCollection';

-- CreateTable
CREATE TABLE "_CollectionTags" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_CollectionTags_AB_unique" ON "_CollectionTags"("A", "B");

-- CreateIndex
CREATE INDEX "_CollectionTags_B_index" ON "_CollectionTags"("B");

-- AddForeignKey
ALTER TABLE "_CollectionTags" ADD FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_CollectionTags" ADD FOREIGN KEY ("B") REFERENCES "Tag"("id") ON DELETE CASCADE ON UPDATE CASCADE;
