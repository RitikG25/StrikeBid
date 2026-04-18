import prismaClient from "../db/prismaClient.js";
import { ItemSchema, UpdateItemSchema } from "../schema/item.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import type { Request, Response, NextFunction } from "express";

export const getAllItems = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const items = await prismaClient.item.findMany({
      where: {
        userId: req.user?.id,
      },
    });
    res.status(200).json({
      status: "success",
      data: items,
    });
  },
);

export const createItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description } = req.body;
    const parsedData = ItemSchema.parse({ name, description });
    const item = await prismaClient.item.create({
      data: {
        name: parsedData.name,
        description: parsedData.description,
        userId: req.user?.id!,
      },
    });
    res.status(201).json({
      status: "success",
      data: item,
      message: `Item ${item.name} created successfully`,
    });
  },
);

export const updateItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const itemId = parseInt(id as string);
    const { name, description } = req.body;
    const parsedData = UpdateItemSchema.parse({ name, description });
    const item = await prismaClient.item.updateMany({
      where: {
        id: itemId,
        userId: req.user?.id!,
      },
      data: {
        ...parsedData,
      },
    });
    res.status(200).json({
      status: "success",
      data: item,
      message: "Item updated successfully",
    });
  },
);

export const deleteItem = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;
    const itemId = parseInt(id as string);
    await prismaClient.item.deleteMany({
      where: {
        id: itemId,
        userId: req.user?.id!,
      },
    });
    res.status(200).json({
      status: "success",
      message: "Item deleted successfully",
    });
  },
);
