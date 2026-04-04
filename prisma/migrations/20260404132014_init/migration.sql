-- CreateEnum
CREATE TYPE "AuctionState" AS ENUM ('SCHEDULED', 'ACTIVE', 'CLOSING', 'CLOSED', 'SETTLED', 'CANCELLED');

-- CreateTable
CREATE TABLE "User" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Item" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "userId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Item_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "Auction" (
    "id" SERIAL NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "startingBid" DOUBLE PRECISION NOT NULL,
    "endTime" TIMESTAMP(3) NOT NULL,
    "startTime" TIMESTAMP(3) NOT NULL,
    "reservePrice" DOUBLE PRECISION NOT NULL,
    "state" "AuctionState" NOT NULL DEFAULT 'SCHEDULED',
    "auctionItemId" INTEGER NOT NULL,
    "ownerId" INTEGER NOT NULL,
    "durationSeconds" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "Auction_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionWatchlist" (
    "auctionId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "joinedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "leftAt" TIMESTAMP(3),

    CONSTRAINT "AuctionWatchlist_pkey" PRIMARY KEY ("auctionId","userId")
);

-- CreateTable
CREATE TABLE "AuctionBids" (
    "id" SERIAL NOT NULL,
    "amount" DOUBLE PRECISION NOT NULL,
    "userId" INTEGER NOT NULL,
    "auctionId" INTEGER NOT NULL,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionBids_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "AuctionResult" (
    "id" SERIAL NOT NULL,
    "auctionId" INTEGER NOT NULL,
    "winnerId" INTEGER NOT NULL,
    "highestBidId" INTEGER NOT NULL,
    "finalAmount" DOUBLE PRECISION NOT NULL,
    "reserveMet" BOOLEAN NOT NULL,
    "settledAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "AuctionResult_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "User_email_key" ON "User"("email");

-- CreateIndex
CREATE UNIQUE INDEX "AuctionResult_auctionId_key" ON "AuctionResult"("auctionId");

-- CreateIndex
CREATE UNIQUE INDEX "AuctionResult_highestBidId_key" ON "AuctionResult"("highestBidId");

-- AddForeignKey
ALTER TABLE "Item" ADD CONSTRAINT "Item_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_auctionItemId_fkey" FOREIGN KEY ("auctionItemId") REFERENCES "Item"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "Auction" ADD CONSTRAINT "Auction_ownerId_fkey" FOREIGN KEY ("ownerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionWatchlist" ADD CONSTRAINT "AuctionWatchlist_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionWatchlist" ADD CONSTRAINT "AuctionWatchlist_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBids" ADD CONSTRAINT "AuctionBids_userId_fkey" FOREIGN KEY ("userId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionBids" ADD CONSTRAINT "AuctionBids_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionResult" ADD CONSTRAINT "AuctionResult_auctionId_fkey" FOREIGN KEY ("auctionId") REFERENCES "Auction"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionResult" ADD CONSTRAINT "AuctionResult_winnerId_fkey" FOREIGN KEY ("winnerId") REFERENCES "User"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "AuctionResult" ADD CONSTRAINT "AuctionResult_highestBidId_fkey" FOREIGN KEY ("highestBidId") REFERENCES "AuctionBids"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
