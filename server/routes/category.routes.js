import express from "express";
import {
    getCategories,
    createCategory,
    updateCategory,
    deleteCategory,
} from "../controllers/category.controller.js";
import { authorize } from "../middlewares/auth.middleware.js";

const categoryRouter = express.Router();

// Public (or authenticated basic user) access to view categories?
// Assuming all logged-in users can see categories. Admin only for editing.
categoryRouter.get("/", getCategories);

categoryRouter.use(authorize(["admin"])); // Only admins can modify categories
categoryRouter.post("/", createCategory);
categoryRouter.put("/:id", updateCategory);
categoryRouter.delete("/:id", deleteCategory);

export default categoryRouter;
