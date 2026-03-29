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
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(255, "Name must be less than 255 characters").trim(),
    email: zod_1.z
        .string()
        .email("Invalid email format")
        .toLowerCase()
        .trim(),
    phone: zod_1.z
        .string()
        .regex(/^\+?[1-9]\d{9,14}$/, "Phone must be a valid number with 10-15 digits, optionally starting with +")
        .transform((val) => val.replace(/\D/g, '').slice(-15)),
    source: exports.leadSourceEnum,
    status: exports.leadStatusEnum.optional().default("new"),
});
exports.updateLeadSchema = zod_1.z.object({
    name: zod_1.z.string().min(2, "Name must be at least 2 characters").max(255, "Name must be less than 255 characters").trim().optional(),
    email: zod_1.z
        .string()
        .email("Invalid email format")
        .toLowerCase()
        .trim()
        .optional(),
    phone: zod_1.z
        .string()
        .regex(/^\+?[1-9]\d{9,14}$/, "Phone must be a valid number with 10-15 digits, optionally starting with +")
        .transform((val) => val.replace(/\D/g, '').slice(-15))
        .optional(),
    source: exports.leadSourceEnum.optional(),
    status: exports.leadStatusEnum.optional(),
});
