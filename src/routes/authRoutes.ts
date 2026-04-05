import express from "express";
import { loginUser, logoutUser, registerUser } from "../controllers/auth.js";
const AuthRouter = express.Router();

AuthRouter.post("/register", registerUser);
AuthRouter.post("/login", loginUser);
AuthRouter.post("/logout", logoutUser);

export default AuthRouter;
