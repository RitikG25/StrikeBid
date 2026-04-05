import prismaClient from "../db/prismaClient.js";
import { UpdateUserSchema } from "../schema/auth.schema.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { AppError } from "../utils/errorHandler.js";

export const GetMe = asyncHandler(async (req, res, next) => {
  const userId = req.user?.id;
  const user = await prismaClient.user.findUnique({
    where: { id: userId },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  if (!user) {
    throw new AppError(404, "User not found");
  }
  res.status(200).json({
    status: "success",
    message: "User retrieved successfully",
    data: user,
  });
});

export const DeleteUser = asyncHandler(async (req, res, next) => {
  const user_id = req.user?.id;
  const user = await prismaClient.user.delete({
    where: { id: user_id },
  });
  res.status(200).json({
    status: "success",
    message: `User ${user.name} deleted successfully`,
  });
});

export const UpdateUser = asyncHandler(async (req, res, next) => {
  const user_id = req.user?.id;
  const { name, email } = req.body;
  const updatedData = UpdateUserSchema.parse({ name, email });
  console.log(updatedData);
  const updatedUser = await prismaClient.user.update({
    where: { id: user_id },
    data: { ...updatedData },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      updatedAt: true,
    },
  });
  res.status(200).json({
    status: "success",
    message: "User updated successfully",
    data: updatedUser,
  });
});
