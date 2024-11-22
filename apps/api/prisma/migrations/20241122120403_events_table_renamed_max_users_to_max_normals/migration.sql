/*
  Warnings:

  - You are about to drop the column `maxUsers` on the `events` table. All the data in the column will be lost.

*/
-- AlterTable
ALTER TABLE `events` DROP COLUMN `maxUsers`,
    ADD COLUMN `maxNormals` INTEGER NULL;
