import prismaClient from "../db/prismaClient.js";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";

export const getAuctionBids = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const bids = await prismaClient.auctionBids.findMany({
      where: {
        auctionId: Number(id),
      },
    });
    res.status(200).json({
      success: true,
      data: bids,
    });
  },
);
