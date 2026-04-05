import zod from "zod";

export const registerSchema = zod.object({
  name: zod.string().min(1, "Name is required"),
  email: zod.email("Invalid email address"),
  password: zod
    .string()
    .min(6, "Password must be at least 6 characters long")
    .regex(
      /^(?=.*[A-Za-z])(?=.*\d).{6,}$/,
      "Password must contain at least one letter and one number",
    ),
});

export const loginSchema = zod.object({
  email: zod.email("Invalid email address"),
  password: zod.string().min(1, "Password is required"),
});

export const UpdateUserSchema = zod.object({
  name: zod.string().min(1).optional(),
  email: zod.email("Invalid email address").optional(),
});
