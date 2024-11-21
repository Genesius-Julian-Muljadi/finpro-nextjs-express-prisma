/*
  Warnings:

  - You are about to drop the column `leads` on the `events` table. All the data in the column will be lost.
  - Added the required column `overview` to the `Events` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE `events` DROP COLUMN `leads`,
    ADD COLUMN `overview` VARCHAR(100) NOT NULL;
