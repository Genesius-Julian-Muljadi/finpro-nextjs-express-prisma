/*
  Warnings:

  - You are about to drop the `samples` table. If the table is not empty, all the data it contains will be lost.

*/
-- DropTable
DROP TABLE `samples`;

-- CreateTable
CREATE TABLE `Users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `firstName` VARCHAR(30) NOT NULL,
    `lastName` VARCHAR(30) NULL,
    `username` VARCHAR(30) NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `pointBalance` INTEGER NOT NULL DEFAULT 0,
    `referralCode` VARCHAR(15) NOT NULL,
    `failedLogins` INTEGER NOT NULL DEFAULT 0,
    `active` ENUM('Active', 'Locked', 'Inactive', 'Other') NOT NULL DEFAULT 'Active',
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Users_referralCode_key`(`referralCode`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Organizers` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(50) NOT NULL,
    `username` VARCHAR(30) NOT NULL,
    `password` VARCHAR(50) NOT NULL,
    `failedLogins` INTEGER NOT NULL DEFAULT 0,
    `active` ENUM('Active', 'Locked', 'Inactive', 'Other') NOT NULL DEFAULT 'Active',
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Events` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `organizerID` INTEGER NOT NULL,
    `title` VARCHAR(50) NOT NULL,
    `eventDate` DATETIME(3) NOT NULL,
    `leads` VARCHAR(100) NOT NULL,
    `genre` ENUM('Classical', 'Pop', 'Jazz', 'Rock', 'Metal', 'Other') NOT NULL DEFAULT 'Other',
    `venue` VARCHAR(50) NOT NULL,
    `eventDesc` VARCHAR(191) NOT NULL,
    `maxUsers` INTEGER NOT NULL,
    `ticketsSold` INTEGER NOT NULL DEFAULT 0,
    `maxVIPs` INTEGER NOT NULL DEFAULT 0,
    `VIPPrice` INTEGER NULL,
    `normalPrice` INTEGER NOT NULL DEFAULT 0,
    `discountType` ENUM('None', 'Limited', 'Deadline', 'LimitedDeadline') NOT NULL DEFAULT 'None',
    `ratingAvg` DOUBLE NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transactions` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `eventID` INTEGER NULL,
    `ticketCount` INTEGER NOT NULL DEFAULT 1,
    `VIPs` INTEGER NOT NULL DEFAULT 0,
    `normalPrice` INTEGER NULL,
    `VIPPrice` INTEGER NULL,
    `discount` INTEGER NOT NULL DEFAULT 0,
    `discountDesc` VARCHAR(191) NULL,
    `pointDiscount` INTEGER NULL,
    `total` INTEGER NOT NULL DEFAULT 0,
    `type` ENUM('Purchase', 'Refund', 'Other') NOT NULL DEFAULT 'Purchase',
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `History` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `userID` INTEGER NOT NULL,
    `eventID` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Point_Balance` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `user1ID` INTEGER NOT NULL,
    `user2ID` INTEGER NOT NULL,
    `nominal` INTEGER NOT NULL DEFAULT 10000,
    `expiryDate` DATETIME(3) NOT NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    UNIQUE INDEX `Point_Balance_user2ID_key`(`user2ID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Coupons` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `code` VARCHAR(15) NOT NULL,
    `userID` INTEGER NULL,
    `organizerID` INTEGER NOT NULL DEFAULT 1,
    `discount` INTEGER NOT NULL DEFAULT 10,
    `expiryDate` DATETIME(3) NULL,
    `active` BOOLEAN NOT NULL DEFAULT true,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updated` DATETIME(3) NOT NULL,

    UNIQUE INDEX `Coupons_code_key`(`code`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event_Artists` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventID` INTEGER NOT NULL,
    `name` VARCHAR(30) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Event_Ratings` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventID` INTEGER NOT NULL,
    `rating` INTEGER NOT NULL,
    `feedback` VARCHAR(191) NULL,
    `dateCreated` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Events_Discount_Limited` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventID` INTEGER NOT NULL,
    `breakpoint` INTEGER NOT NULL,
    `discount` INTEGER NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Events_Discount_Deadline` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `eventID` INTEGER NOT NULL,
    `deadline` DATETIME(3) NOT NULL,
    `discount` INTEGER NOT NULL,

    UNIQUE INDEX `Events_Discount_Deadline_eventID_key`(`eventID`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- CreateTable
CREATE TABLE `Transactions_Special` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `transactionID` INTEGER NOT NULL,
    `desc` VARCHAR(191) NOT NULL,

    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;

-- AddForeignKey
ALTER TABLE `Events` ADD CONSTRAINT `Events_organizerID_fkey` FOREIGN KEY (`organizerID`) REFERENCES `Organizers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions` ADD CONSTRAINT `Transactions_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `Events`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `History` ADD CONSTRAINT `History_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Point_Balance` ADD CONSTRAINT `Point_Balance_user1ID_fkey` FOREIGN KEY (`user1ID`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Point_Balance` ADD CONSTRAINT `Point_Balance_user2ID_fkey` FOREIGN KEY (`user2ID`) REFERENCES `Users`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coupons` ADD CONSTRAINT `Coupons_userID_fkey` FOREIGN KEY (`userID`) REFERENCES `Users`(`id`) ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Coupons` ADD CONSTRAINT `Coupons_organizerID_fkey` FOREIGN KEY (`organizerID`) REFERENCES `Organizers`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Artists` ADD CONSTRAINT `Event_Artists_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Event_Ratings` ADD CONSTRAINT `Event_Ratings_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Events_Discount_Limited` ADD CONSTRAINT `Events_Discount_Limited_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Events_Discount_Deadline` ADD CONSTRAINT `Events_Discount_Deadline_eventID_fkey` FOREIGN KEY (`eventID`) REFERENCES `Events`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE `Transactions_Special` ADD CONSTRAINT `Transactions_Special_transactionID_fkey` FOREIGN KEY (`transactionID`) REFERENCES `Transactions`(`id`) ON DELETE RESTRICT ON UPDATE CASCADE;
