import prismaClient from "../db/prismaClient.js";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errorHandler.js";

export const getAuctionMembers = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const members = await prismaClient.auctionWatchlist.findMany({
      where: {
        auctionId: Number(id),
      },
    });
    res.status(200).json({
      success: true,
      data: members,
    });
  },
);

export const addAuctionMember = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const userId = req.user?.id;
    await prismaClient.auctionWatchlist.create({
      data: {
        auctionId: Number(id),
        userId: userId!,
      },
    });
    res.status(200).json({
      success: true,
      message: "Added to watchlist",
    });
  },
);

export const removeAuctionMember = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const userId = req.user?.id;
    await prismaClient.auctionWatchlist.delete({
      where: {
        auctionId_userId: {
          auctionId: Number(id),
          userId: userId!,
        },
      },
    });
    res.status(200).json({
      success: true,
      message: "Removed from watchlist",
    });
  },
);
