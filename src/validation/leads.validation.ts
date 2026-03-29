import { z } from "zod";


export const leadSourceEnum = z.enum([
  "linkedin",
  "whatsapp",
  "email",
]);

export const leadStatusEnum = z.enum([
  "new",
  "contacted",
  "qualified",
  "closed",
]);


export const createLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255, "Name must be less than 255 characters").trim(),

  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim(),

  phone: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, "Phone must be a valid number with 10-15 digits, optionally starting with +")
    .transform((val) => val.replace(/\D/g, '').slice(-15)), // Keep only digits, max 15

  source: leadSourceEnum,

  status: leadStatusEnum.optional().default("new"),
});


export const updateLeadSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(255, "Name must be less than 255 characters").trim().optional(),

  email: z
    .string()
    .email("Invalid email format")
    .toLowerCase()
    .trim()
    .optional(),

  phone: z
    .string()
    .regex(/^\+?[1-9]\d{9,14}$/, "Phone must be a valid number with 10-15 digits, optionally starting with +")
    .transform((val) => val.replace(/\D/g, '').slice(-15))
    .optional(),

  source: leadSourceEnum.optional(),

  status: leadStatusEnum.optional(),
});