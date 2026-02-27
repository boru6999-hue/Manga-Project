/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `wallet` table. All the data in the column will be lost.
  - Added the required column `updatedAts` to the `Wallet` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `favourite` DROP FOREIGN KEY `Favourite_mangaId_fkey`;

-- DropForeignKey
ALTER TABLE `favourite` DROP FOREIGN KEY `Favourite_userId_fkey`;

-- AlterTable
ALTER TABLE `wallet` DROP COLUMN `updatedAt`,
    ADD COLUMN `updatedAts` DATETIME(3) NOT NULL;

-- AddForeignKey
ALTER TABLE `Favourite` ADD CONSTRAINT `Favourite_userId_fkey` FOREIGN KEY (`userId`) REFERENCES `User`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Favourite` ADD CONSTRAINT `Favourite_mangaId_fkey` FOREIGN KEY (`mangaId`) REFERENCES `Manga`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
