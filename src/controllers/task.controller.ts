import asyncHandler from "../utils/asyncHandler";
import { 
  createTaskSchema,  
} from "../validation/tasks.validation";
import { 
  createTask, 
  getTasksForLead, 
  markTaskAsCompleted, 
  getTaskById,
  deleteTask 
} from "../services/task.service";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

export const createTaskController = asyncHandler(async(req, res) => {
  const { leadId, title, dueDate } = createTaskSchema.parse(req.body);
  const effectiveDueDate = dueDate
    ? new Date(dueDate)
    : new Date(Date.now() + 24 * 60 * 60 * 1000); // auto 24h later

  const task = await createTask(leadId, title, effectiveDueDate);
  
  return res.status(201).json(
    new ApiResponse(201, task, "Task created successfully")
  );
});

export const getTasksForLeadController = asyncHandler(async(req, res) => {
  const { leadId } = req.params;
  const tasks = await getTasksForLead(leadId as string);
  
  return res.status(200).json(
    new ApiResponse(200, tasks, "Tasks retrieved successfully")
  );
});

export const markTaskAsCompletedController = asyncHandler(async(req, res) => {
  const { taskId } = req.params;
  const task = await markTaskAsCompleted(taskId as string);
  
  return res.status(200).json(
    new ApiResponse(200, task, "Task marked as completed successfully")
  );
});

export const getTaskByIdController = asyncHandler(async(req, res) => {
  const { taskId } = req.params;
  const task = await getTaskById(taskId as string);
  
  if (!task) {
    throw new ApiError(404, "Task not found");
  }
  
  return res.status(200).json(
    new ApiResponse(200, task, "Task retrieved successfully")
  );
});

export const deleteTaskController = asyncHandler(async(req, res) => {
  const { taskId } = req.params;
  const deleted = await deleteTask(taskId as string);
  
  if (!deleted) {
    throw new ApiError(404, "Task not found");
  }
  
  return res.status(200).json(
    new ApiResponse(200, null, "Task deleted successfully")
  );
});
