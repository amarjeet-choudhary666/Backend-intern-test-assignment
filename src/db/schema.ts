import {
  pgTable,
  uuid,
  varchar,
  timestamp,
  pgEnum,
  text,
} from "drizzle-orm/pg-core";

import { relations } from "drizzle-orm";


export const leadSourceEnum = pgEnum("lead_source", [
  "linkedin",
  "whatsapp",
  "email",
]);

export const leadStatusEnum = pgEnum("lead_status", [
  "new",
  "contacted",
  "qualified",
  "closed",
]);

export const taskStatusEnum = pgEnum("task_status", [
  "pending",
  "completed",
]);

export const leads = pgTable("leads", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 255 }).notNull(),

  email: varchar("email", { length: 255 }).notNull().unique(),

  phone: varchar("phone", { length: 20 }).notNull(),

  source: leadSourceEnum("source").notNull(),

  status: leadStatusEnum("status").default("new").notNull(),

  created_at: timestamp("created_at").defaultNow().notNull(),
});

export const tags = pgTable("tags", {
  id: uuid("id").defaultRandom().primaryKey(),

  name: varchar("name", { length: 100 }).notNull().unique(),
});

export const leadTags = pgTable("lead_tags", {
  id: uuid("id").defaultRandom().primaryKey(),

  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),

  tagId: uuid("tag_id")
    .notNull()
    .references(() => tags.id, { onDelete: "cascade" }),
});

export const tasks = pgTable("tasks", {
  id: uuid("id").defaultRandom().primaryKey(),

  leadId: uuid("lead_id")
    .notNull()
    .references(() => leads.id, { onDelete: "cascade" }),

  title: text("title").notNull(),

  dueDate: timestamp("due_date").notNull(),

  status: taskStatusEnum("status").default("pending").notNull(),
});


export const leadsRelations = relations(leads, ({ many }) => ({
  tasks: many(tasks),
  leadTags: many(leadTags),
}));

export const tagsRelations = relations(tags, ({ many }) => ({
  leadTags: many(leadTags),
}));

export const leadTagsRelations = relations(leadTags, ({ one }) => ({
  lead: one(leads, {
    fields: [leadTags.leadId],
    references: [leads.id],
  }),
  tag: one(tags, {
    fields: [leadTags.tagId],
    references: [tags.id],
  }),
}));

export const tasksRelations = relations(tasks, ({ one }) => ({
  lead: one(leads, {
    fields: [tasks.leadId],
    references: [leads.id],
  }),
}));