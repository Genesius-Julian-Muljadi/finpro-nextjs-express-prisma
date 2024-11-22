/*
  Warnings:

  - You are about to drop the column `ticketsSold` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `events` DROP COLUMN `ticketsSold`,
    ADD COLUMN `normalsSold` INTEGER NOT NULL DEFAULT 0;
