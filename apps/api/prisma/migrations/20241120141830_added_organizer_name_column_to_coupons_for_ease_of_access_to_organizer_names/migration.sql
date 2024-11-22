-- AlterTable
ALTER TABLE `coupons` ADD COLUMN `organizerName` VARCHAR(191) NOT NULL DEFAULT 'admin';

-- AddForeignKey
ALTER TABLE `Coupons` ADD CONSTRAINT `Coupons_organizerName_fkey` FOREIGN KEY (`organizerName`) REFERENCES `Organizers`(`name`) ON DELETE RESTRICT ON UPDATE CASCADE;
