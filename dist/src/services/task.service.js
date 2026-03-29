"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteTask = exports.updateTask = exports.getTaskById = exports.createDefaultTask = exports.markTaskAsCompleted = exports.getTasksForLead = exports.createTask = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
const createTask = async (leadId, title, dueDate, dbClient = db_1.db) => {
    const lead = await dbClient.select().from(schema_1.leads).where((0, drizzle_orm_1.eq)(schema_1.leads.id, leadId));
    if (lead.length === 0) {
        throw new Error("Lead not found");
    }
    const [newTask] = await dbClient
        .insert(schema_1.tasks)
        .values({
        leadId,
        title,
        dueDate,
        status: "pending",
    })
        .returning();
    return newTask;
};
exports.createTask = createTask;
const getTasksForLead = async (leadId) => {
    return db_1.db
        .select()
        .from(schema_1.tasks)
        .where((0, drizzle_orm_1.eq)(schema_1.tasks.leadId, leadId));
};
exports.getTasksForLead = getTasksForLead;
const markTaskAsCompleted = async (taskId) => {
    const [updatedTask] = await db_1.db
        .update(schema_1.tasks)
        .set({ status: "completed" })
        .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId))
        .returning();
    if (!updatedTask) {
        throw new Error("Task not found");
    }
    return updatedTask;
};
exports.markTaskAsCompleted = markTaskAsCompleted;
const createDefaultTask = async (leadId, dbClient = db_1.db) => {
    const dueDate = new Date();
    dueDate.setHours(dueDate.getHours() + 24);
    return (0, exports.createTask)(leadId, "Follow up within 24 hours", dueDate, dbClient);
};
exports.createDefaultTask = createDefaultTask;
const getTaskById = async (taskId) => {
    const [task] = await db_1.db
        .select()
        .from(schema_1.tasks)
        .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId));
    return task;
};
exports.getTaskById = getTaskById;
const updateTask = async (taskId, status) => {
    const [updatedTask] = await db_1.db
        .update(schema_1.tasks)
        .set({ status })
        .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId))
        .returning();
    if (!updatedTask) {
        throw new Error("Task not found");
    }
    return updatedTask;
};
exports.updateTask = updateTask;
const deleteTask = async (taskId) => {
    const result = await db_1.db
        .delete(schema_1.tasks)
        .where((0, drizzle_orm_1.eq)(schema_1.tasks.id, taskId))
        .returning();
    return result.length > 0;
};
exports.deleteTask = deleteTask;
