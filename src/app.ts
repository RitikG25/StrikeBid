import Express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
dotenv.config();

const app = Express();
const PORT = process.env.PORT;

app.use(Express.json());
app.use(cookieParser());

app.get("/health", (req, res) => {
  res.status(200).json({ status: "OK" });
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
