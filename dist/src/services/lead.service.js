"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLeadsByEmail = exports.getLeadById = exports.getAllLeads = exports.searchLeads = exports.filterByStatus = exports.deleteLead = exports.updateLead = exports.createLeadService = void 0;
const drizzle_orm_1 = require("drizzle-orm");
const db_1 = require("../db/db");
const schema_1 = require("../db/schema");
const task_service_1 = require("./task.service");
const leads_validation_1 = require("../validation/leads.validation");
const createLeadService = async (data) => {
    return db_1.db.transaction(async (tx) => {
        const existing = await tx
            .select()
            .from(schema_1.leads)
            .where((0, drizzle_orm_1.eq)(schema_1.leads.email, data.email));
        if (existing.length > 0) {
            throw new Error("Lead with this email already exists");
        }
        const [newLead] = await tx.insert(schema_1.leads).values(data).returning();
        await (0, task_service_1.createDefaultTask)(newLead.id, tx);
        return newLead;
    });
};
exports.createLeadService = createLeadService;
const updateLead = async (id, data) => {
    if (data.email) {
        const existingLead = await db_1.db
            .select()
            .from(schema_1.leads)
            .where((0, drizzle_orm_1.eq)(schema_1.leads.email, data.email));
        if (existingLead.length > 0 && existingLead[0].id !== id) {
            throw new Error("Email already exists for another lead");
        }
    }
    const [updated] = await db_1.db
        .update(schema_1.leads)
        .set(data)
        .where((0, drizzle_orm_1.eq)(schema_1.leads.id, id))
        .returning();
    return updated;
};
exports.updateLead = updateLead;
const deleteLead = async (id) => {
    await db_1.db.delete(schema_1.leads).where((0, drizzle_orm_1.eq)(schema_1.leads.id, id));
};
exports.deleteLead = deleteLead;
const filterByStatus = async (status) => {
    const validStatus = leads_validation_1.leadStatusEnum.parse(status);
    return db_1.db
        .select()
        .from(schema_1.leads)
        .where((0, drizzle_orm_1.eq)(schema_1.leads.status, validStatus));
};
exports.filterByStatus = filterByStatus;
const searchLeads = async (query) => {
    return db_1.db
        .select()
        .from(schema_1.leads)
        .where((0, drizzle_orm_1.ilike)(schema_1.leads.name, `%${query}%`));
};
exports.searchLeads = searchLeads;
const getAllLeads = async (page = 1, limit = 50) => {
    const offset = (page - 1) * limit;
    return db_1.db
        .select()
        .from(schema_1.leads)
        .limit(limit)
        .offset(offset);
};
exports.getAllLeads = getAllLeads;
const getLeadById = async (id) => {
    const [lead] = await db_1.db
        .select()
        .from(schema_1.leads)
        .where((0, drizzle_orm_1.eq)(schema_1.leads.id, id));
    return lead;
};
exports.getLeadById = getLeadById;
const searchLeadsByEmail = async (query) => {
    return db_1.db
        .select()
        .from(schema_1.leads)
        .where((0, drizzle_orm_1.ilike)(schema_1.leads.email, `%${query}%`));
};
exports.searchLeadsByEmail = searchLeadsByEmail;
