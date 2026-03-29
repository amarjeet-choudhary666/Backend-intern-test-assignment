"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTaskController = exports.getTaskByIdController = exports.markTaskAsCompletedController = exports.getTasksForLeadController = exports.createTaskController = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const tasks_validation_1 = require("../validation/tasks.validation");
const task_service_1 = require("../services/task.service");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
exports.createTaskController = (0, asyncHandler_1.default)(async (req, res) => {
    const result = tasks_validation_1.createTaskSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    const dueDate = result.data.dueDate
        ? new Date(result.data.dueDate)
        : new Date(Date.now() + 24 * 60 * 60 * 1000);
    const task = await (0, task_service_1.createTask)(result.data.leadId, result.data.title, dueDate);
    return res.status(201).json(new apiResponse_1.ApiResponse(201, task, "Task created successfully"));
});
exports.getTasksForLeadController = (0, asyncHandler_1.default)(async (req, res) => {
    const { leadId } = req.params;
    const tasks = await (0, task_service_1.getTasksForLead)(leadId);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, tasks, "Tasks retrieved successfully"));
});
exports.markTaskAsCompletedController = (0, asyncHandler_1.default)(async (req, res) => {
    const { taskId } = req.params;
    const task = await (0, task_service_1.markTaskAsCompleted)(taskId);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, task, "Task marked as completed successfully"));
});
exports.getTaskByIdController = (0, asyncHandler_1.default)(async (req, res) => {
    const { taskId } = req.params;
    const task = await (0, task_service_1.getTaskById)(taskId);
    if (!task) {
        throw new apiError_1.ApiError(404, "Task not found");
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, task, "Task retrieved successfully"));
});
exports.deleteTaskController = (0, asyncHandler_1.default)(async (req, res) => {
    const { taskId } = req.params;
    const deleted = await (0, task_service_1.deleteTask)(taskId);
    if (!deleted) {
        throw new apiError_1.ApiError(404, "Task not found");
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, "Task deleted successfully"));
});
