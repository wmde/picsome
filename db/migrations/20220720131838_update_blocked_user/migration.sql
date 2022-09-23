/*
  Warnings:

  - A unique constraint covering the columns `[originalUserId]` on the table `BlockedUser` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `originalUserId` to the `BlockedUser` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
CREATE SEQUENCE "blockeduser_id_seq";
ALTER TABLE "BlockedUser" ADD COLUMN     "originalUserId" INTEGER NOT NULL,
ALTER COLUMN "id" SET DEFAULT nextval('blockeduser_id_seq');
ALTER SEQUENCE "blockeduser_id_seq" OWNED BY "BlockedUser"."id";

-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_originalUserId_key" ON "BlockedUser"("originalUserId");
