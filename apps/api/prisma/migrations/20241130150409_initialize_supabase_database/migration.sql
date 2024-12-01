-- CreateEnum
CREATE TYPE "ActiveStatus" AS ENUM ('Active', 'Locked', 'Inactive', 'Other');

-- CreateEnum
CREATE TYPE "Genres" AS ENUM ('Classical', 'Pop', 'Jazz', 'Rock', 'Metal', 'Other');

-- CreateEnum
CREATE TYPE "DiscountTypes" AS ENUM ('None', 'Limited', 'Deadline', 'LimitedDeadline');

-- CreateEnum
CREATE TYPE "TransactionTypes" AS ENUM ('Purchase', 'Refund', 'Other');

-- CreateTable
CREATE TABLE "Users" (
    "id" SERIAL NOT NULL,
    "firstName" VARCHAR(30) NOT NULL,
    "lastName" VARCHAR(30),
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "pointBalance" INTEGER NOT NULL DEFAULT 0,
    "referralCode" VARCHAR(15) NOT NULL,
    "failedLogins" INTEGER NOT NULL DEFAULT 0,
    "active" "ActiveStatus" NOT NULL DEFAULT 'Active',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Users_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Organizers" (
    "id" SERIAL NOT NULL,
    "name" VARCHAR(50) NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "failedLogins" INTEGER NOT NULL DEFAULT 0,
    "active" "ActiveStatus" NOT NULL DEFAULT 'Active',
    "emailVerified" BOOLEAN NOT NULL DEFAULT false,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Organizers_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events" (
    "id" SERIAL NOT NULL,
    "organizerID" INTEGER NOT NULL,
    "image" TEXT NOT NULL DEFAULT '',
    "title" VARCHAR(50) NOT NULL,
    "eventDate" TIMESTAMP(3) NOT NULL,
    "overview" VARCHAR(100) NOT NULL,
    "genre" "Genres" NOT NULL DEFAULT 'Other',
    "venue" VARCHAR(50) NOT NULL,
    "eventDesc" TEXT NOT NULL,
    "maxNormals" INTEGER,
    "maxVIPs" INTEGER NOT NULL DEFAULT 0,
    "normalsSold" INTEGER NOT NULL DEFAULT 0,
    "VIPsSold" INTEGER NOT NULL DEFAULT 0,
    "normalPrice" INTEGER NOT NULL DEFAULT 0,
    "VIPPrice" INTEGER,
    "discountType" "DiscountTypes" NOT NULL DEFAULT 'None',
    "ratingAvg" DOUBLE PRECISION,
    "revenue" INTEGER NOT NULL DEFAULT 0,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Events_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "eventID" INTEGER,
    "ticketCount" INTEGER NOT NULL DEFAULT 1,
    "VIPs" INTEGER NOT NULL DEFAULT 0,
    "normalPrice" INTEGER NOT NULL,
    "VIPPrice" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL DEFAULT 0,
    "discountDesc" TEXT,
    "pointDiscount" INTEGER,
    "total" INTEGER NOT NULL DEFAULT 0,
    "type" "TransactionTypes" NOT NULL DEFAULT 'Purchase',
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Transactions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "History" (
    "id" SERIAL NOT NULL,
    "userID" INTEGER NOT NULL,
    "transactionID" INTEGER NOT NULL,

    CONSTRAINT "History_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Point_Balance" (
    "id" SERIAL NOT NULL,
    "user1ID" INTEGER NOT NULL,
    "user2ID" INTEGER NOT NULL,
    "nominal" INTEGER NOT NULL DEFAULT 10000,
    "expiryDate" TIMESTAMP(3) NOT NULL,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Point_Balance_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Coupons" (
    "id" SERIAL NOT NULL,
    "code" VARCHAR(15) NOT NULL,
    "userID" INTEGER,
    "organizerID" INTEGER NOT NULL DEFAULT 1,
    "organizerName" TEXT NOT NULL DEFAULT 'admin',
    "discount" INTEGER NOT NULL DEFAULT 10,
    "expiryDate" TIMESTAMP(3),
    "active" BOOLEAN NOT NULL DEFAULT true,
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Coupons_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event_Artists" (
    "id" SERIAL NOT NULL,
    "eventID" INTEGER NOT NULL,
    "name" VARCHAR(30) NOT NULL,

    CONSTRAINT "Event_Artists_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Event_Ratings" (
    "id" SERIAL NOT NULL,
    "eventID" INTEGER NOT NULL,
    "rating" INTEGER NOT NULL,
    "feedback" TEXT NOT NULL DEFAULT '',
    "dateCreated" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "Event_Ratings_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events_Discount_Limited" (
    "id" SERIAL NOT NULL,
    "eventID" INTEGER NOT NULL,
    "breakpoint" INTEGER NOT NULL,
    "discount" INTEGER NOT NULL,

    CONSTRAINT "Events_Discount_Limited_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Events_Discount_Deadline" (
    "id" SERIAL NOT NULL,
    "eventID" INTEGER NOT NULL,
    "deadline" TIMESTAMP(3) NOT NULL,
    "discount" INTEGER NOT NULL,

    CONSTRAINT "Events_Discount_Deadline_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Transactions_Special" (
    "id" SERIAL NOT NULL,
    "transactionID" INTEGER NOT NULL,
    "desc" TEXT NOT NULL,

    CONSTRAINT "Transactions_Special_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "Users_email_key" ON "Users"("email");

-- CreateIndex
CREATE UNIQUE INDEX "Users_referralCode_key" ON "Users"("referralCode");

-- CreateIndex
CREATE UNIQUE INDEX "Organizers_name_key" ON "Organizers"("name");

-- CreateIndex
CREATE UNIQUE INDEX "Organizers_email_key" ON "Organizers"("email");

-- CreateIndex
CREATE UNIQUE INDEX "History_transactionID_key" ON "History"("transactionID");

-- CreateIndex
CREATE UNIQUE INDEX "Point_Balance_user2ID_key" ON "Point_Balance"("user2ID");

-- CreateIndex
CREATE UNIQUE INDEX "Events_Discount_Deadline_eventID_key" ON "Events_Discount_Deadline"("eventID");

-- AddForeignKey
ALTER TABLE "Events" ADD CONSTRAINT "Events_organizerID_fkey" FOREIGN KEY ("organizerID") REFERENCES "Organizers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions" ADD CONSTRAINT "Transactions_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Events"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "History" ADD CONSTRAINT "History_transactionID_fkey" FOREIGN KEY ("transactionID") REFERENCES "Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Point_Balance" ADD CONSTRAINT "Point_Balance_user1ID_fkey" FOREIGN KEY ("user1ID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Point_Balance" ADD CONSTRAINT "Point_Balance_user2ID_fkey" FOREIGN KEY ("user2ID") REFERENCES "Users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupons" ADD CONSTRAINT "Coupons_userID_fkey" FOREIGN KEY ("userID") REFERENCES "Users"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupons" ADD CONSTRAINT "Coupons_organizerID_fkey" FOREIGN KEY ("organizerID") REFERENCES "Organizers"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Coupons" ADD CONSTRAINT "Coupons_organizerName_fkey" FOREIGN KEY ("organizerName") REFERENCES "Organizers"("name") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event_Artists" ADD CONSTRAINT "Event_Artists_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Event_Ratings" ADD CONSTRAINT "Event_Ratings_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events_Discount_Limited" ADD CONSTRAINT "Events_Discount_Limited_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Events_Discount_Deadline" ADD CONSTRAINT "Events_Discount_Deadline_eventID_fkey" FOREIGN KEY ("eventID") REFERENCES "Events"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Transactions_Special" ADD CONSTRAINT "Transactions_Special_transactionID_fkey" FOREIGN KEY ("transactionID") REFERENCES "Transactions"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
