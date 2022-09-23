/*
  Warnings:

  - The values [Reported,Edited] on the enum `ReportStatus` will be removed. If these variants are still used in the database, this will fail.

*/
-- AlterEnum
ALTER TYPE "CollectionType" ADD VALUE 'SmartCollection';

-- AlterEnum
BEGIN;
CREATE TYPE "ReportStatus_new" AS ENUM ('Pending', 'Removed', 'Settled', 'Closed');
ALTER TABLE "Report" ALTER COLUMN "status" DROP DEFAULT;
ALTER TABLE "Report" ALTER COLUMN "status" TYPE "ReportStatus_new" USING ("status"::text::"ReportStatus_new");
ALTER TYPE "ReportStatus" RENAME TO "ReportStatus_old";
ALTER TYPE "ReportStatus_new" RENAME TO "ReportStatus";
DROP TYPE "ReportStatus_old";
ALTER TABLE "Report" ALTER COLUMN "status" SET DEFAULT 'Pending';
COMMIT;

-- AlterEnum
ALTER TYPE "TokenType" ADD VALUE 'CONFIRM_NEW_EMAIL';

-- DropForeignKey
ALTER TABLE "Report" DROP CONSTRAINT "Report_resourceId_fkey";

-- AlterTable
ALTER TABLE "Report" ADD COLUMN     "collectionId" INTEGER,
ADD COLUMN     "ruling" TEXT,
ALTER COLUMN "resourceId" DROP NOT NULL,
ALTER COLUMN "status" SET DEFAULT E'Pending';

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE CASCADE ON UPDATE CASCADE;
