import { eq, and } from "drizzle-orm";
import { db } from "../db/db";
import { tags, leadTags, leads } from "../db/schema";

export const createTag = async (name: string) => {
  const existing = await db
    .select()
    .from(tags)
    .where(eq(tags.name, name));

  if (existing.length > 0) {
    return existing[0];
  }

  const [newTag] = await db.insert(tags).values({ name }).returning();
  return newTag;
};

export const getAllTags = async () => {
  return db.select().from(tags);
};

export const assignTagToLead = async (leadId: string, tagName: string) => {
  const lead = await db.select().from(leads).where(eq(leads.id, leadId));
  if (lead.length === 0) {
    throw new Error("Lead not found");
  }

  const tag = await createTag(tagName);

  const existingAssignment = await db
    .select()
    .from(leadTags)
    .where(and(eq(leadTags.leadId, leadId), eq(leadTags.tagId, tag.id)));

  if (existingAssignment.length > 0) {
    return existingAssignment[0];
  }

  const [assignment] = await db
    .insert(leadTags)
    .values({ leadId, tagId: tag.id })
    .returning();

  return assignment;
};

export const removeTagFromLead = async (leadId: string, tagId: string) => {
  const result = await db
    .delete(leadTags)
    .where(and(eq(leadTags.leadId, leadId), eq(leadTags.tagId, tagId)))
    .returning();

  return result.length > 0;
};

export const getTagsForLead = async (leadId: string) => {
  const result = await db
    .select({
      id: tags.id,
      name: tags.name,
    })
    .from(leadTags)
    .innerJoin(tags, eq(leadTags.tagId, tags.id))
    .where(eq(leadTags.leadId, leadId));

  return result;
};

export const assignMultipleTagsToLead = async (leadId: string, tagNames: string[]) => {
  return Promise.all(tagNames.map(tagName => assignTagToLead(leadId, tagName)));
};
