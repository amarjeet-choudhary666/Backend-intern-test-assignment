"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.markTaskCompletedSchema = exports.updateTaskSchema = exports.createTaskSchema = exports.taskStatusEnum = void 0;
const zod_1 = require("zod");
exports.taskStatusEnum = zod_1.z.enum([
    "pending",
    "completed",
]);
exports.createTaskSchema = zod_1.z.object({
    leadId: zod_1.z.string().uuid("Invalid lead ID"),
    title: zod_1.z.string().min(1, "Task title is required").max(500, "Task title must be less than 500 characters").trim(),
    dueDate: zod_1.z.string().datetime("Invalid due date format")
        .refine((date) => new Date(date) > new Date(), "Due date must be in the future")
        .optional(),
});
exports.updateTaskSchema = zod_1.z.object({
    title: zod_1.z.string().min(1).max(500).optional(),
    dueDate: zod_1.z.string().datetime().optional(),
    status: exports.taskStatusEnum.optional(),
});
exports.markTaskCompletedSchema = zod_1.z.object({
    taskId: zod_1.z.string().uuid("Invalid task ID"),
});
