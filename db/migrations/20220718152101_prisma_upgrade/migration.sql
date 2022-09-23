-- RenameIndex
ALTER INDEX "License.canonicalUrl_unique" RENAME TO "License_canonicalUrl_key";

-- RenameIndex
ALTER INDEX "Resource.resourceUrl_unique" RENAME TO "Resource_resourceUrl_key";

-- RenameIndex
ALTER INDEX "ResourceDetails.aspect_fileformat_size_unique" RENAME TO "ResourceDetails_aspect_fileformat_size_key";

-- RenameIndex
ALTER INDEX "Session.handle_unique" RENAME TO "Session_handle_key";

-- RenameIndex
ALTER INDEX "Token.hashedToken_type_unique" RENAME TO "Token_hashedToken_type_key";

-- RenameIndex
ALTER INDEX "User.email_unique" RENAME TO "User_email_key";

-- RenameIndex
ALTER INDEX "WikidataItemLabel.wdId_locale_unique" RENAME TO "WikidataItemLabel_wdId_locale_key";
