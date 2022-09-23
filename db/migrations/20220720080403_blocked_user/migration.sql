-- CreateTable
CREATE TABLE "BlockedUser" (
    "id" INTEGER NOT NULL,
    "email" TEXT NOT NULL,
    "blockMessage" TEXT NOT NULL,
    "blockedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "BlockedUser_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "BlockedUser_email_key" ON "BlockedUser"("email");
