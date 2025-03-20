/*
  Warnings:

  - A unique constraint covering the columns `[refreshToken]` on the table `UserToken` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "UserToken_refreshToken_key" ON "UserToken"("refreshToken");
