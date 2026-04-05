import prismaClient from "../db/prismaClient.js";
import type { Request, Response } from "express";
import { loginSchema, registerSchema } from "../schema/auth.schema.js";
import { AppError } from "../utils/errorHandler.js";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import { asyncHandler } from "../utils/asyncHandler.js";

// REGISTER
export const registerUser = asyncHandler(
  async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    registerSchema.parse({ name, email, password });

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await prismaClient.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
      },
    });

    if (!user) {
      throw new AppError(500, "Failed to register user");
    }

    return res.status(201).json({
      status: "success",
      message: "User registered successfully",
    });
  },
);

// LOGIN
export const loginUser = asyncHandler(async (req: Request, res: Response) => {
  const { email, password } = req.body;

  loginSchema.parse({ email, password });

  const user = await prismaClient.user.findUnique({
    where: { email },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  const validPassword = await bcrypt.compare(password, user.password);

  if (!validPassword) {
    throw new AppError(401, "Invalid email or password");
  }

  const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET as string, {
    expiresIn: process.env.JWT_EXPIRES_IN as SignOptions["expiresIn"],
  });

  return res
    .status(200)
    .cookie("access_token", token, {
      maxAge: 1 * 60 * 60 * 1000,
      httpOnly: true,
      secure: false, // change to true in production (HTTPS)
    })
    .json({
      status: "success",
      message: "User logged in successfully",
    });
});

// LOGOUT
export const logoutUser = asyncHandler(async (req: Request, res: Response) => {
  return res
    .clearCookie("access_token", {
      httpOnly: true,
      secure: false, // change to true in production
    })
    .status(200)
    .json({
      status: "success",
      message: "User logged out successfully",
    });
});
