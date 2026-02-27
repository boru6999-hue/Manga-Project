/*
  Warnings:

  - You are about to drop the `payback` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropForeignKey
ALTER TABLE `payback` DROP FOREIGN KEY `Payback_paymentId_fkey`;

-- DropForeignKey
ALTER TABLE `payback` DROP FOREIGN KEY `Payback_userId_fkey`;

-- DropTable
DROP TABLE `payback`;
