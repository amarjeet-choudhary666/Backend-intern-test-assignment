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
  const { name } = createTagSchema.parse(req.body);
  const tag = await createTag(name);
  
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
  const { leadId, tagName } = assignTagSchema.parse(req.body);
  const assignment = await assignTagToLead(leadId, tagName);
  
  res.status(201).json(
    new ApiResponse(201, assignment, "Tag assigned to lead successfully")
  );
});

export const assignMultipleTagsToLeadController = asyncHandler(async(req, res) => {
  const { leadId, tagNames } = assignMultipleTagsSchema.parse(req.body);
  const assignments = await assignMultipleTagsToLead(leadId, tagNames);
  
  res.status(201).json(
    new ApiResponse(201, assignments, "Tags assigned to lead successfully")
  );
});

export const removeTagFromLeadController = asyncHandler(async(req, res) => {
  const { leadId, tagId } = removeTagSchema.parse(req.body);
  const removed = await removeTagFromLead(leadId, tagId);
  
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
