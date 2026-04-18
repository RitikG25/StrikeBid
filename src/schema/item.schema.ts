import zod from "zod";

export const ItemSchema = zod.object({
  name: zod.string().min(1, "Name is required"),
  description: zod.string().min(1, "Description is required"),
});

export const UpdateItemSchema = zod.object({
  name: zod.string().min(1, "Name is required").optional(),
  description: zod.string().min(1, "Description is required").optional(),
});
