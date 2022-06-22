/*
  Warnings:

  - Changed the type of `repository` on the `Resource` table. No cast exists, the column would be dropped and recreated, which cannot be done if there is data, since the column is required.

*/
-- AlterTable
ALTER TABLE "Resource" DROP COLUMN "repository",
ADD COLUMN     "repository" TEXT NOT NULL;

-- DropEnum
DROP TYPE "AssetRepository";
