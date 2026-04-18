import Express from "express";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
const ItemsRouter = Express.Router();

ItemsRouter.route("/").get(AuthMiddleware).post(AuthMiddleware);
ItemsRouter.route("/:id").patch(AuthMiddleware).post(AuthMiddleware);

export default ItemsRouter;
