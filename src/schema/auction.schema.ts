import zod from "zod";

export const AuctionSchema = zod.object({
  title: zod.string().min(1, "Title is required"),
  description: zod.string().min(1, "Description is required"),
  durationSeconds: zod.number().positive("Duration must be a positive number"),
  endTime: zod.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid end time format",
  }),
  auctionItemId: zod.number().min(1, "Auction item ID is required"),
  startingBid: zod.number().positive("Starting bid must be a positive number"),
  reservePrice: zod
    .number()
    .positive("Reserve price must be a positive number"),
  startTime: zod.string().refine((date) => !isNaN(Date.parse(date)), {
    message: "Invalid start time format",
  }),
});

export type AuctionInput = zod.infer<typeof AuctionSchema>;

export const AuctionUpdateSchema = zod.object({
  title: zod.string().min(1, "Title is required").optional(),
  description: zod.string().min(1, "Description is required").optional(),
  durationSeconds: zod
    .number()
    .positive("Duration must be a positive number")
    .optional(),
  endTime: zod
    .string()
    .refine((date) => !isNaN(Date.parse(date)), {
      message: "Invalid end time format",
    })
    .optional(),
  startingBid: zod
    .number()
    .positive("Starting bid must be a positive number")
    .optional(),
  reservePrice: zod
    .number()
    .positive("Reserve price must be a positive number")
    .optional(),
});
