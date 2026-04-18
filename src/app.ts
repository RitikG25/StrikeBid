import Express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import AuthRouter from "./routes/authRoutes.js";
import { errorMiddleware } from "./middleware/ErrorMiddleware.js";
import UserRouter from "./routes/userRoutes.js";
import ItemsRouter from "./routes/itemsRoutes.js";
import AuctionRouter from "./routes/auctionsRoutes.js";
dotenv.config();

const app = Express();
const PORT = process.env.PORT;

app.use(Express.json());
app.use(cookieParser());
app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.use("/api/v1/auth", AuthRouter);
app.use("/api/v1/users", UserRouter);
app.use("/api/v1/items", ItemsRouter);
app.use("/api/v1/auctions", AuctionRouter);
app.use(errorMiddleware);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
