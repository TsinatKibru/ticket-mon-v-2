import { Router } from "express";
import { signIn, signOut, signUp } from "../controllers/auth.controller.js";
import { registerValidation, loginValidation, validate } from "../middlewares/validation.middleware.js";
const authRouter = Router();

authRouter.post("/sign-up", registerValidation, validate, signUp);
authRouter.post("/sign-in", loginValidation, validate, signIn);
authRouter.post("/sign-out", signOut);

export default authRouter;
