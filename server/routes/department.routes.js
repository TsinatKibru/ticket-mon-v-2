import { Router } from "express";
import authorize from "../middlewares/auth.middleware.js";
import {
  assignUserToDepartment,
  createDepartment,
  deleteDepartment,
  getDepartment,
  getDepartments,
  updateAssignmentAlgorithm,
  updateDepartment,
} from "../controllers/department.controller.js";

// department.routes.js
const departmentRouter = Router();
departmentRouter.post("/", authorize(["admin"]), createDepartment);
departmentRouter.get(
  "/",
  authorize(["admin", "support_agent", "user"]),
  getDepartments
);
departmentRouter.get(
  "/:id",
  authorize(["admin", "support_agent"]),
  getDepartment
);
departmentRouter.put("/:id", authorize(["admin"]), updateDepartment);
departmentRouter.delete("/:id", authorize(["admin"]), deleteDepartment);
departmentRouter.post(
  "/:id/assign-user",
  authorize(["admin"]),
  assignUserToDepartment
);

departmentRouter.put(
  "/:id/assignment-algorithm",
  authorize(["admin"]),
  updateAssignmentAlgorithm
);

export default departmentRouter;
