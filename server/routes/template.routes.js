import { Router } from "express";
import {
    createTemplate,
    getTemplates,
    updateTemplate,
    deleteTemplate,
} from "../controllers/template.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const templateRouter = Router();

// Users can read templates to use them
templateRouter.get("/", authorize(["admin", "support_agent", "user"]), getTemplates);

// Only admins can manage templates
templateRouter.post("/", authorize(["admin"]), createTemplate);
templateRouter.put("/:id", authorize(["admin"]), updateTemplate);
templateRouter.delete("/:id", authorize(["admin"]), deleteTemplate);

export default templateRouter;
