import type { Request, Response, NextFunction } from "express";
import { AppError } from "../utils/errorHandler.js";
import { ZodError } from "zod";
import { Prisma } from "@prisma/client";
import jwt from "jsonwebtoken";

export const errorMiddleware = (
  err: unknown,
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // ✅ Zod validation error
  if (err instanceof ZodError) {
    return res.status(400).json({
      status: "failed",
      message: "Validation failed",
      errors: err.issues.map((e) => ({
        field: e.path.join("."),
        message: e.message,
      })),
    });
  }

  // ✅ Prisma known errors
  if (err instanceof Prisma.PrismaClientKnownRequestError) {
    if (err.code === "P2002") {
      return res.status(409).json({
        status: "failed",
        message: `Duplicate field value: ${err.meta?.target}`,
      });
    }

    if (err.code === "P2025") {
      return res.status(404).json({
        status: "failed",
        message: "Record not found",
      });
    }
  }

  // ✅ Prisma validation error
  if (err instanceof Prisma.PrismaClientValidationError) {
    return res.status(400).json({
      status: "failed",
      message: "Invalid data provided",
    });
  }

  // ✅ JWT errors
  if (err instanceof jwt.JsonWebTokenError) {
    return res.status(401).json({
      status: "failed",
      message: "Invalid token",
    });
  }

  if (err instanceof jwt.TokenExpiredError) {
    return res.status(401).json({
      status: "failed",
      message: "Token expired",
    });
  }

  // ✅ Custom AppError
  if (err instanceof AppError) {
    return res.status(err.statusCode).json({
      status: "failed",
      message: err.message,
    });
  }

  // ❌ Unknown error (fallback)
  console.error("UNEXPECTED ERROR:", err);

  return res.status(500).json({
    status: "failed",
    message:
      process.env.NODE_ENV === "production"
        ? "Something went wrong"
        : err instanceof Error
          ? err.message
          : "Unknown error",
  });
};
