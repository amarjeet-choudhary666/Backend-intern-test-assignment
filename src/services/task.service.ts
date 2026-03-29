import { eq } from "drizzle-orm";
import { db } from "../db/db";
import { tasks, leads } from "../db/schema";

export const createTask = async (
  leadId: string,
  title: string,
  dueDate: Date,
  dbClient: any = db
) => {
  const lead = await dbClient.select().from(leads).where(eq(leads.id, leadId));
  if (lead.length === 0) {
    throw new Error("Lead not found");
  }

  if (dueDate <= new Date()) {
    throw new Error("Due date must be in the future");
  }

  const [newTask] = await dbClient
    .insert(tasks)
    .values({
      leadId,
      title,
      dueDate,
      status: "pending",
    })
    .returning();

  return newTask;
};

export const getTasksForLead = async (leadId: string) => {
  return db
    .select()
    .from(tasks)
    .where(eq(tasks.leadId, leadId));
};

export const markTaskAsCompleted = async (taskId: string) => {
  const existingTask = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, taskId));

  if (existingTask.length === 0) {
    throw new Error("Task not found");
  }

  if (existingTask[0].status === "completed") {
    throw new Error("Task is already completed");
  }

  const [updatedTask] = await db
    .update(tasks)
    .set({ status: "completed" })
    .where(eq(tasks.id, taskId))
    .returning();

  return updatedTask;
};

export const createDefaultTask = async (
  leadId: string,
  dbClient: any = db
) => {
  const dueDate = new Date();
  dueDate.setHours(dueDate.getHours() + 24);

  return createTask(leadId, "Follow up within 24 hours", dueDate, dbClient);
};

export const getTaskById = async (taskId: string) => {
  const [task] = await db
    .select()
    .from(tasks)
    .where(eq(tasks.id, taskId));

  return task;
};

export const updateTask = async (taskId: string, status: "pending" | "completed") => {
  const [updatedTask] = await db
    .update(tasks)
    .set({ status })
    .where(eq(tasks.id, taskId))
    .returning();

  if (!updatedTask) {
    throw new Error("Task not found");
  }

  return updatedTask;
};

export const deleteTask = async (taskId: string) => {
  const result = await db
    .delete(tasks)
    .where(eq(tasks.id, taskId))
    .returning();

  return result.length > 0;
};

