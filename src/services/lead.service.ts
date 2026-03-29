import { eq, ilike } from "drizzle-orm";
import { db } from "../db/db";
import { leads } from "../db/schema";
import { createDefaultTask } from "./task.service";
import { leadStatusEnum } from "../validation/leads.validation";

export const createLeadService = async (data: any) => {
  return db.transaction(async (tx) => {
    const existing = await tx
      .select()
      .from(leads)
      .where(eq(leads.email, data.email));

    if (existing.length > 0) {
      throw new Error("Lead with this email already exists");
    }

    const [newLead] = await tx.insert(leads).values(data).returning();

    await createDefaultTask(newLead.id, tx);

    return newLead;
  });
};


export const updateLead = async (id: string, data: any) => {
  if (data.email) {
    const existingLead = await db
      .select()
      .from(leads)
      .where(eq(leads.email, data.email));

    if (existingLead.length > 0 && existingLead[0].id !== id) {
      throw new Error("Email already exists for another lead");
    }
  }

  const [updated] = await db
    .update(leads)
    .set(data)
    .where(eq(leads.id, id))
    .returning();

  return updated;
};


export const deleteLead = async (id: string) => {
  await db.delete(leads).where(eq(leads.id, id));
};


export const filterByStatus = async (status: string) => {
  // Validate the status against enum
  const validStatus = leadStatusEnum.parse(status);
  
  return db
    .select()
    .from(leads)
    .where(eq(leads.status, validStatus));
};


export const searchLeads = async (query: string) => {
  return db
    .select()
    .from(leads)
    .where(
      ilike(leads.name, `%${query}%`)
    );
};

export const getAllLeads = async () => {
  return db.select().from(leads);
};

export const getLeadById = async (id: string) => {
  const [lead] = await db
    .select()
    .from(leads)
    .where(eq(leads.id, id));
  
  return lead;
};

export const searchLeadsByEmail = async (query: string) => {
  return db
    .select()
    .from(leads)
    .where(
      ilike(leads.email, `%${query}%`)
    );
};