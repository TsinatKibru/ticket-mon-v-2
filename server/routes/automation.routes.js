import { Router } from "express";
import {
    createAutomation,
    getAutomations,
    updateAutomation,
    deleteAutomation,
} from "../controllers/automation.controller.js";
import authorize from "../middlewares/auth.middleware.js";

const automationRouter = Router();

// Only admins can manage automation
automationRouter.use(authorize(["admin"]));

automationRouter.get("/", getAutomations);
automationRouter.post("/", createAutomation);
automationRouter.put("/:id", updateAutomation);
automationRouter.delete("/:id", deleteAutomation);

export default automationRouter;
