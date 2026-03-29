"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assignMultipleTagsToLead = exports.getTagsForLead = exports.removeTagFromLead = exports.assignTagToLead = exports.getAllTags = exports.createTag = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
const createTag = async (name) => {
    const existing = await db_1.db
        .select()
        .from(schema_1.tags)
        .where((0, drizzle_orm_1.eq)(schema_1.tags.name, name));
    if (existing.length > 0) {
        return existing[0];
    }
    const [newTag] = await db_1.db.insert(schema_1.tags).values({ name }).returning();
    return newTag;
};
exports.createTag = createTag;
const getAllTags = async () => {
    return db_1.db.select().from(schema_1.tags);
};
exports.getAllTags = getAllTags;
const assignTagToLead = async (leadId, tagName) => {
    const lead = await db_1.db.select().from(schema_1.leads).where((0, drizzle_orm_1.eq)(schema_1.leads.id, leadId));
    if (lead.length === 0) {
        throw new Error("Lead not found");
    }
    const tag = await (0, exports.createTag)(tagName);
    const existingAssignment = await db_1.db
        .select()
        .from(schema_1.leadTags)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.leadTags.leadId, leadId), (0, drizzle_orm_1.eq)(schema_1.leadTags.tagId, tag.id)));
    if (existingAssignment.length > 0) {
        return existingAssignment[0];
    }
    const [assignment] = await db_1.db
        .insert(schema_1.leadTags)
        .values({ leadId, tagId: tag.id })
        .returning();
    return assignment;
};
exports.assignTagToLead = assignTagToLead;
const removeTagFromLead = async (leadId, tagId) => {
    const result = await db_1.db
        .delete(schema_1.leadTags)
        .where((0, drizzle_orm_1.and)((0, drizzle_orm_1.eq)(schema_1.leadTags.leadId, leadId), (0, drizzle_orm_1.eq)(schema_1.leadTags.tagId, tagId)))
        .returning();
    return result.length > 0;
};
exports.removeTagFromLead = removeTagFromLead;
const getTagsForLead = async (leadId) => {
    const result = await db_1.db
        .select({
        id: schema_1.tags.id,
        name: schema_1.tags.name,
    })
        .from(schema_1.leadTags)
        .innerJoin(schema_1.tags, (0, drizzle_orm_1.eq)(schema_1.leadTags.tagId, schema_1.tags.id))
        .where((0, drizzle_orm_1.eq)(schema_1.leadTags.leadId, leadId));
    return result;
};
exports.getTagsForLead = getTagsForLead;
const assignMultipleTagsToLead = async (leadId, tagNames) => {
    return Promise.all(tagNames.map(tagName => (0, exports.assignTagToLead)(leadId, tagName)));
};
exports.assignMultipleTagsToLead = assignMultipleTagsToLead;
