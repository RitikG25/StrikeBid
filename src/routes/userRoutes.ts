import Express from "express";
import { DeleteUser, GetMe, UpdateUser } from "../controllers/users.js";
import { AuthMiddleware } from "../middleware/AuthMiddleware.js";
const UserRouter = Express.Router();

UserRouter.route("/me").get(AuthMiddleware, GetMe);
UserRouter.route("/")
  .patch(AuthMiddleware, UpdateUser)
  .delete(AuthMiddleware, DeleteUser);
export default UserRouter;
