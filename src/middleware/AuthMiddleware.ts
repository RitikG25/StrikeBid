import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errorHandler.js";
import jwt from "jsonwebtoken";
import prismaClient from "../db/prismaClient.js";

export const AuthMiddleware = async (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  try {
    const token = req.cookies.access_token;
    if (!token) {
      next(new AppError(401, "Unauthorized: No token provided"));
      return;
    }
    const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
      id: number;
    };
    const user = await prismaClient.user.findUnique({
      where: {
        id: decoded.id,
      },
    });

    if (!user) {
      next(new AppError(401, "Unauthorized: Invalid token"));
      return;
    }

    req.user = user;
    next();
  } catch (error) {
    console.log(error);
    return res.status(500).json({
      status: "failed",
      message: error instanceof Error ? error.message : "Something went wrong",
    });
  }
};
