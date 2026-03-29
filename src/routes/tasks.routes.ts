import { Router } from "express";
import {
  createTaskController,
  getTasksForLeadController,
  markTaskAsCompletedController,
  getTaskByIdController,
  deleteTaskController,
} from "../controllers/task.controller";

const router = Router();

router.post("/", createTaskController);
router.get("/lead/:leadId", getTasksForLeadController);
router.get("/:taskId", getTaskByIdController);
router.patch("/:taskId/complete", markTaskAsCompletedController);
router.delete("/:taskId", deleteTaskController);

export default router;
