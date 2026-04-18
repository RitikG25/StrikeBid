import prismaClient from "../db/prismaClient.js";
import type { Request, Response, NextFunction } from "express";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AuctionState } from "@prisma/client";
import {
  AuctionSchema,
  AuctionUpdateSchema,
} from "../schema/auction.schema.js";
import { AppError } from "../utils/errorHandler.js";

export const getMyAuctions = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const auctions = await prismaClient.auction.findMany({
      where: {
        ownerId: id,
      },
    });
    res.status(200).json({
      success: true,
      data: auctions,
    });
  },
);

export const getAuctionList = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const query = req.query as { state?: string };
    const auctions = await prismaClient.auction.findMany({
      where: query.state ? { state: query.state as AuctionState } : undefined,
    });
    res.status(200).json({
      success: true,
      data: auctions,
    });
  },
);

export const getAuctionDetails = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const auction = await prismaClient.auction.findUnique({
      where: {
        id: Number(id),
      },
    });
    if (!auction) {
      next(new AppError(404, "Auction not found"));
      return;
    }
    res.status(200).json({
      success: true,
      data: auction,
    });
  },
);

export const createAuction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.user?.id;
    const parsedInput = AuctionSchema.parse(req.body);

    const auction = await prismaClient.auction.create({
      data: {
        ...parsedInput,
        ownerId: id!,
      },
    });
    res.status(201).json({
      success: true,
      message: `Auction ${auction.title} is now scheduled to start at ${auction.startTime} and end at ${auction.endTime}`,
      data: auction,
    });
  },
);

export const deleteAuction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const auction = await prismaClient.auction.findUnique({
      where: {
        id: Number(id),
        ownerId: req.user?.id,
      },
    });

    if (!auction) {
      next(
        new AppError(
          404,
          "Auction not found or you do not have permission to delete it",
        ),
      );
      return;
    }

    if (auction.state !== "SCHEDULED") {
      next(new AppError(400, "Only scheduled auctions can be deleted"));
      return;
    }

    await prismaClient.auction.delete({
      where: {
        id: Number(id),
        ownerId: req.user?.id,
      },
    });

    res.status(200).json({
      success: true,
      message: "Auction deleted successfully",
    });
  },
);

export const updateAuction = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const id = req.params.id;
    const auction = await prismaClient.auction.findUnique({
      where: {
        id: Number(id),
        ownerId: req.user?.id,
      },
    });

    if (!auction) {
      next(
        new AppError(
          404,
          "Auction not found or you do not have permission to update it",
        ),
      );
      return;
    }

    if (auction.state !== "SCHEDULED") {
      next(new AppError(400, "Only scheduled auctions can be updated"));
      return;
    }

    const parsedInput = AuctionUpdateSchema.parse(req.body);
    const updatedAuction = await prismaClient.auction.update({
      where: {
        id: Number(id),
        ownerId: req.user?.id,
      },
      data: parsedInput,
    });
    res.status(200).json({
      success: true,
      message: "Auction updated successfully",
      data: updatedAuction,
    });
  },
);
