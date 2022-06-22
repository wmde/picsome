-- CreateEnum
CREATE TYPE "CollectionType" AS ENUM ('PrivateCollection', 'JointCollection');

-- AlterTable
ALTER TABLE "Collection" ADD COLUMN     "type" "CollectionType" NOT NULL DEFAULT E'PrivateCollection';

-- CreateTable
CREATE TABLE "_UserJoinedCollections" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "_UserJoinedCollections_AB_unique" ON "_UserJoinedCollections"("A", "B");

-- CreateIndex
CREATE INDEX "_UserJoinedCollections_B_index" ON "_UserJoinedCollections"("B");

-- AddForeignKey
ALTER TABLE "_UserJoinedCollections" ADD FOREIGN KEY ("A") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_UserJoinedCollections" ADD FOREIGN KEY ("B") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;
