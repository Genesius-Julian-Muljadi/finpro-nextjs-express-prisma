/*
  Warnings:

  - You are about to drop the column `eventID` on the `history` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[transactionID]` on the table `History` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `transactionID` to the `History` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE `history` DROP FOREIGN KEY `History_eventID_fkey`;

-- AlterTable
ALTER TABLE `history` DROP COLUMN `eventID`,
    ADD COLUMN `transactionID` INTEGER NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX `History_transactionID_key` ON `History`(`transactionID`);

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_transactionID_fkey` FOREIGN KEY (`transactionID`) REFERENCES `Transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
