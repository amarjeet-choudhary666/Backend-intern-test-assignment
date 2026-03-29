"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.removeTagSchema = exports.assignMultipleTagsSchema = exports.assignTagSchema = exports.createTagSchema = void 0;
const zod_1 = require("zod");
exports.createTagSchema = zod_1.z.object({
    name: zod_1.z.string().min(1, "Tag name is required").max(100, "Tag name must be less than 100 characters"),
});
exports.assignTagSchema = zod_1.z.object({
    leadId: zod_1.z.string().uuid("Invalid lead ID"),
    tagName: zod_1.z.string().min(1, "Tag name is required"),
});
exports.assignMultipleTagsSchema = zod_1.z.object({
    leadId: zod_1.z.string().uuid("Invalid lead ID"),
    tagNames: zod_1.z.array(zod_1.z.string().min(1)).min(1, "At least one tag is required"),
});
exports.removeTagSchema = zod_1.z.object({
    leadId: zod_1.z.string().uuid("Invalid lead ID"),
    tagId: zod_1.z.string().uuid("Invalid tag ID"),
});
