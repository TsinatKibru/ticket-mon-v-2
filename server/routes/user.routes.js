import { Router } from "express";
import {
  deleteUser,
  getUser,
  getUsers,
  searchUsers,
  updateUser,
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
userRouter.post(
  "/:id/upload-profile-image",
  authorize(["admin", "user", "support_agent"]),
  upload.single("profileImage"),
  uploadProfileImage
);
userRouter.put("/:id", authorize(["admin", "user", "support_agent"]), updateUser);
userRouter.post("/", (req, res) => res.send({ title: "Create  new User" }));
userRouter.delete("/:id", authorize(["admin"]), deleteUser);

export default userRouter;
