/*
  Warnings:

  - Made the column `feedback` on table `event_ratings` required. This step will fail if there are existing NULL values in that column.

*/
-- AlterTable
ALTER TABLE `event_ratings` MODIFY `feedback` VARCHAR(191) NOT NULL DEFAULT '';
