-- DropForeignKey
ALTER TABLE "_CollectionTags" DROP CONSTRAINT "_CollectionTags_B_fkey";

-- AlterTable
ALTER TABLE "_CollectionTags" ALTER COLUMN "B" SET DATA TYPE TEXT;

-- AddForeignKey
ALTER TABLE "_CollectionTags" ADD FOREIGN KEY ("B") REFERENCES "WikidataItem"("wdId") ON DELETE CASCADE ON UPDATE CASCADE;
