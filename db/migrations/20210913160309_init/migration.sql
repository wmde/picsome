-- CreateEnum
CREATE TYPE "TokenType" AS ENUM ('RESET_PASSWORD');

-- CreateEnum
CREATE TYPE "ResourceFileformat" AS ENUM ('JPG', 'PNG', 'GIF', 'SVG', 'Other');

-- CreateEnum
CREATE TYPE "ResourceAspect" AS ENUM ('Portrait', 'Landscape', 'Square');

-- CreateEnum
CREATE TYPE "ResourceSize" AS ENUM ('Big', 'Medium', 'Small');

-- CreateEnum
CREATE TYPE "AssetRepository" AS ENUM ('Flickr', 'Wikicommons');

-- CreateEnum
CREATE TYPE "LicenseSource" AS ENUM ('Seed', 'AttributionAPI', 'Wikidata');

-- CreateEnum
CREATE TYPE "LicenseGroupValue" AS ENUM ('CC0', 'PD', 'CCBY', 'CCBYSA', 'CCBYNC', 'CCBYND', 'CCBYNCSA', 'CCBYNCND');

-- CreateEnum
CREATE TYPE "LicenseFeatureValue" AS ENUM ('Commercial', 'Modify', 'Distribute', 'NameAuthor', 'ShareAlike');

-- CreateEnum
CREATE TYPE "ReportReason" AS ENUM ('CopyrightViolation', 'MatureContent', 'Other');

-- CreateEnum
CREATE TYPE "ReportStatus" AS ENUM ('Reported', 'Inprocess', 'Closed');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "name" TEXT,
    "email" TEXT NOT NULL,
    "hashedPassword" TEXT,
    "role" TEXT NOT NULL DEFAULT E'USER',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Session" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "expiresAt" TIMESTAMP(3),
    "handle" TEXT NOT NULL,
    "hashedSessionToken" TEXT,
    "antiCSRFToken" TEXT,
    "publicData" TEXT,
    "privateData" TEXT,
    "userId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Token" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "hashedToken" TEXT NOT NULL,
    "type" "TokenType" NOT NULL,
    "expiresAt" TIMESTAMP(3) NOT NULL,
    "sentTo" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Resource" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resourceUrl" TEXT NOT NULL,
    "thumbUrl" TEXT NOT NULL,
    "imgUrl" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "authorName" TEXT NOT NULL,
    "authorUrl" TEXT NOT NULL,
    "resolutionX" INTEGER NOT NULL,
    "resolutionY" INTEGER NOT NULL,
    "sizeBytes" INTEGER NOT NULL,
    "licenseId" INTEGER NOT NULL,
    "detailsId" INTEGER NOT NULL,
    "repository" "AssetRepository" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ResourceDetails" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "aspect" "ResourceAspect" NOT NULL,
    "fileformat" "ResourceFileformat" NOT NULL,
    "size" "ResourceSize" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "License" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wdId" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "groupId" "LicenseGroupValue" NOT NULL,
    "version" TEXT NOT NULL,
    "variant" TEXT NOT NULL,
    "spdxCode" TEXT NOT NULL,
    "canonicalUrl" TEXT NOT NULL,
    "source" "LicenseSource" NOT NULL DEFAULT E'Seed',
    "rawSource" JSONB,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseGroup" (
    "id" "LicenseGroupValue" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "LicenseFeature" (
    "id" "LicenseFeatureValue" NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Tag" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "wdId" TEXT NOT NULL,
    "label" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "resourceId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "CollectionItem" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "resourceId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "collectionId" INTEGER,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Collection" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "title" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Report" (
    "id" SERIAL NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,
    "reason" "ReportReason" NOT NULL,
    "userId" INTEGER,
    "resourceId" INTEGER NOT NULL,
    "message" TEXT NOT NULL,
    "status" "ReportStatus" NOT NULL DEFAULT E'Reported',

    PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "_LicenseFeatureToLicenseGroup" (
    "A" "LicenseFeatureValue" NOT NULL,
    "B" "LicenseGroupValue" NOT NULL
);

-- CreateIndex
CREATE UNIQUE INDEX "User.email_unique" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Session.handle_unique" ON "Session"("handle");

-- CreateIndex
CREATE UNIQUE INDEX "Token.hashedToken_type_unique" ON "Token"("hashedToken", "type");

-- CreateIndex
CREATE UNIQUE INDEX "Resource.resourceUrl_unique" ON "Resource"("resourceUrl");

-- CreateIndex
CREATE UNIQUE INDEX "ResourceDetails.aspect_fileformat_size_unique" ON "ResourceDetails"("aspect", "fileformat", "size");

-- CreateIndex
CREATE UNIQUE INDEX "License.canonicalUrl_unique" ON "License"("canonicalUrl");

-- CreateIndex
CREATE UNIQUE INDEX "_LicenseFeatureToLicenseGroup_AB_unique" ON "_LicenseFeatureToLicenseGroup"("A", "B");

-- CreateIndex
CREATE INDEX "_LicenseFeatureToLicenseGroup_B_index" ON "_LicenseFeatureToLicenseGroup"("B");

-- AddForeignKey
ALTER TABLE "Session" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Token" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD FOREIGN KEY ("licenseId") REFERENCES "License"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Resource" ADD FOREIGN KEY ("detailsId") REFERENCES "ResourceDetails"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "License" ADD FOREIGN KEY ("groupId") REFERENCES "LicenseGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Tag" ADD FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "CollectionItem" ADD FOREIGN KEY ("collectionId") REFERENCES "Collection"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Collection" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Report" ADD FOREIGN KEY ("resourceId") REFERENCES "Resource"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LicenseFeatureToLicenseGroup" ADD FOREIGN KEY ("A") REFERENCES "LicenseFeature"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "_LicenseFeatureToLicenseGroup" ADD FOREIGN KEY ("B") REFERENCES "LicenseGroup"("id") ON DELETE CASCADE ON UPDATE CASCADE;
