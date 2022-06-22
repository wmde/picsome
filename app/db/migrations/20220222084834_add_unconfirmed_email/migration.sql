-- AlterEnum
-- ALTER TYPE "TokenType" ADD VALUE 'CONFIRM_NEW_EMAIL';

-- AlterTable
ALTER TABLE "User" ADD COLUMN "newUnconfirmedEmail" TEXT;
