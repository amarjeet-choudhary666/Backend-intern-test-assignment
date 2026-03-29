import asyncHandler from "../utils/asyncHandler";
import { 
  createTagSchema, 
  assignTagSchema, 
  assignMultipleTagsSchema, 
  removeTagSchema 
} from "../validation/tags.validation";
import { 
  createTag, 
  getAllTags, 
  assignTagToLead, 
  removeTagFromLead, 
  getTagsForLead, 
  assignMultipleTagsToLead 
} from "../services/tag.service";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

export const createTagController = asyncHandler(async(req, res) => {
  const result = createTagSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      error: result.error.format()
    });
  }
  
  const tag = await createTag(result.data.name);
  
  res.status(201).json(
    new ApiResponse(201, tag, "Tag created successfully")
  );
});

export const getAllTagsController = asyncHandler(async(req, res) => {
  const tags = await getAllTags();
  res.status(200).json(
    new ApiResponse(200, tags, "Tags retrieved successfully")
  );
});

export const assignTagToLeadController = asyncHandler(async(req, res) => {
  const result = assignTagSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      error: result.error.format()
    });
  }
  
  const assignment = await assignTagToLead(result.data.leadId, result.data.tagName);
  
  res.status(201).json(
    new ApiResponse(201, assignment, "Tag assigned to lead successfully")
  );
});

export const assignMultipleTagsToLeadController = asyncHandler(async(req, res) => {
  const result = assignMultipleTagsSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      error: result.error.format()
    });
  }
  
  const assignments = await assignMultipleTagsToLead(result.data.leadId, result.data.tagNames);
  
  res.status(201).json(
    new ApiResponse(201, assignments, "Tags assigned to lead successfully")
  );
});

export const removeTagFromLeadController = asyncHandler(async(req, res) => {
  const result = removeTagSchema.safeParse(req.body);
  
  if (!result.success) {
    return res.status(400).json({
      error: result.error.format()
    });
  }
  
  const removed = await removeTagFromLead(result.data.leadId, result.data.tagId);
  
  if (!removed) {
    throw new ApiError(404, "Tag assignment not found");
  }
  
  res.status(200).json(
    new ApiResponse(200, null, "Tag removed from lead successfully")
  );
});

export const getTagsForLeadController = asyncHandler(async(req, res) => {
  const { leadId } = req.params;
  const tags = await getTagsForLead(leadId as string);
  
  res.status(200).json(
    new ApiResponse(200, tags, "Tags retrieved successfully")
  );
});
