import { z } from "zod";

export const createTagSchema = z.object({
  name: z.string().min(1, "Tag name is required").max(100, "Tag name must be less than 100 characters"),
});

export const assignTagSchema = z.object({
  leadId: z.string().uuid("Invalid lead ID"),
  tagName: z.string().min(1, "Tag name is required"),
});

export const assignMultipleTagsSchema = z.object({
  leadId: z.string().uuid("Invalid lead ID"),
  tagNames: z.array(z.string().min(1)).min(1, "At least one tag is required"),
});

export const removeTagSchema = z.object({
  leadId: z.string().uuid("Invalid lead ID"),
  tagId: z.string().uuid("Invalid tag ID"),
});
