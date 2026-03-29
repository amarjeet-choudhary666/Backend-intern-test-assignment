import { z } from "zod";

export const taskStatusEnum = z.enum([
  "pending",
  "completed",
]);

export const createTaskSchema = z.object({
  leadId: z.string().uuid("Invalid lead ID"),
  title: z.string().min(1, "Task title is required").max(500, "Task title must be less than 500 characters").trim(),
  dueDate: z.string().datetime("Invalid due date format")
    .refine((date) => new Date(date) > new Date(), "Due date must be in the future")
    .optional(),
});

export const updateTaskSchema = z.object({
  title: z.string().min(1).max(500).optional(),
  dueDate: z.string().datetime().optional(),
  status: taskStatusEnum.optional(),
});

export const markTaskCompletedSchema = z.object({
  taskId: z.string().uuid("Invalid task ID"),
});
