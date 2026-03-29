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
  name: z.string().min(2, "Name is required"),

  email: z
    .string()
    .email("Invalid email format"),

  phone: z
    .string()
    .min(10, "Phone must be at least 10 digits"),

  source: leadSourceEnum,

  status: leadStatusEnum.optional(), // default = "new"
});


export const updateLeadSchema = z.object({
  name: z.string().min(2).optional(),

  email: z.string().email().optional(),

  phone: z.string().min(10).optional(),

  source: leadSourceEnum.optional(),

  status: leadStatusEnum.optional(),
});