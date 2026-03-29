"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tasksRelations = exports.leadTagsRelations = exports.tagsRelations = exports.leadsRelations = exports.tasks = exports.leadTags = exports.tags = exports.leads = exports.taskStatusEnum = exports.leadStatusEnum = exports.leadSourceEnum = void 0;
const pg_core_1 = require("drizzle-orm/pg-core");
const drizzle_orm_1 = require("drizzle-orm");
exports.leadSourceEnum = (0, pg_core_1.pgEnum)("lead_source", [
    "linkedin",
    "whatsapp",
    "email",
]);
exports.leadStatusEnum = (0, pg_core_1.pgEnum)("lead_status", [
    "new",
    "contacted",
    "qualified",
    "closed",
]);
exports.taskStatusEnum = (0, pg_core_1.pgEnum)("task_status", [
    "pending",
    "completed",
]);
exports.leads = (0, pg_core_1.pgTable)("leads", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 255 }).notNull(),
    email: (0, pg_core_1.varchar)("email", { length: 255 }).notNull().unique(),
    phone: (0, pg_core_1.varchar)("phone", { length: 20 }).notNull(),
    source: (0, exports.leadSourceEnum)("source").notNull(),
    status: (0, exports.leadStatusEnum)("status").default("new").notNull(),
    created_at: (0, pg_core_1.timestamp)("created_at").defaultNow().notNull(),
});
exports.tags = (0, pg_core_1.pgTable)("tags", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    name: (0, pg_core_1.varchar)("name", { length: 100 }).notNull().unique(),
});
exports.leadTags = (0, pg_core_1.pgTable)("lead_tags", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    leadId: (0, pg_core_1.uuid)("lead_id")
        .notNull()
        .references(() => exports.leads.id, { onDelete: "cascade" }),
    tagId: (0, pg_core_1.uuid)("tag_id")
        .notNull()
        .references(() => exports.tags.id, { onDelete: "cascade" }),
});
exports.tasks = (0, pg_core_1.pgTable)("tasks", {
    id: (0, pg_core_1.uuid)("id").defaultRandom().primaryKey(),
    leadId: (0, pg_core_1.uuid)("lead_id")
        .notNull()
        .references(() => exports.leads.id, { onDelete: "cascade" }),
    title: (0, pg_core_1.text)("title").notNull(),
    dueDate: (0, pg_core_1.timestamp)("due_date").notNull(),
    status: (0, exports.taskStatusEnum)("status").default("pending").notNull(),
});
exports.leadsRelations = (0, drizzle_orm_1.relations)(exports.leads, ({ many }) => ({
    tasks: many(exports.tasks),
    leadTags: many(exports.leadTags),
}));
exports.tagsRelations = (0, drizzle_orm_1.relations)(exports.tags, ({ many }) => ({
    leadTags: many(exports.leadTags),
}));
exports.leadTagsRelations = (0, drizzle_orm_1.relations)(exports.leadTags, ({ one }) => ({
    lead: one(exports.leads, {
        fields: [exports.leadTags.leadId],
        references: [exports.leads.id],
    }),
    tag: one(exports.tags, {
        fields: [exports.leadTags.tagId],
        references: [exports.tags.id],
    }),
}));
exports.tasksRelations = (0, drizzle_orm_1.relations)(exports.tasks, ({ one }) => ({
    lead: one(exports.leads, {
        fields: [exports.tasks.leadId],
        references: [exports.leads.id],
    }),
}));
