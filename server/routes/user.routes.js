import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  searchUsers,
  updateUserRole,
  uploadProfileImage,
} from "../controllers/user.controller.js";
import authorize from "../middlewares/auth.middleware.js";
import { upload } from "../middlewares/multer.js";
const userRouter = Router();
userRouter.get("/search", authorize(["admin", "support_agent"]), searchUsers);

userRouter.get("/", authorize(["admin", "support_agent", "user"]), getUsers);
userRouter.get("/:id", authorize(["admin", "user", "support_agent"]), getUser);
userRouter.put("/:id/role", authorize(["admin"]), updateUserRole);
userRouter.post("/", (req, res) => res.send({ title: "Create  new User" }));
userRouter.put("/:id", (req, res) => res.send({ title: "Update User" }));
userRouter.delete("/:id", authorize(["admin"]), deleteUser);
userRouter.post(
  "/:id/upload-profile-image",
  authorize(["admin", "user", "support_agent"]),
  upload.single("profileImage"),
  uploadProfileImage
);

export default userRouter;
