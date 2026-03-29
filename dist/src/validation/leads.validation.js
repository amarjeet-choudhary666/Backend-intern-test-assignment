"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateLeadSchema = exports.createLeadSchema = exports.leadStatusEnum = exports.leadSourceEnum = void 0;
const zod_1 = require("zod");
exports.leadSourceEnum = zod_1.z.enum([
    "linkedin",
    "whatsapp",
    "email",
]);
exports.leadStatusEnum = zod_1.z.enum([
    "new",
    "contacted",
    "qualified",
    "closed",
]);
exports.createLeadSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name is required"),
    email: zod_1.z
        .string()
        .email("Invalid email format"),
    phone: zod_1.z
        .string()
        .min(10, "Phone must be at least 10 digits"),
    source: exports.leadSourceEnum,
    status: exports.leadStatusEnum.optional(),
});
exports.updateLeadSchema = zod_1.z.object({
    name: zod_1.z.string().min(2).optional(),
    email: zod_1.z.string().email().optional(),
    phone: zod_1.z.string().min(10).optional(),
    source: exports.leadSourceEnum.optional(),
    status: exports.leadStatusEnum.optional(),
});
