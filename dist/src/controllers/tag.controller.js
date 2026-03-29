"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getTagsForLeadController = exports.removeTagFromLeadController = exports.assignMultipleTagsToLeadController = exports.assignTagToLeadController = exports.getAllTagsController = exports.createTagController = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const tags_validation_1 = require("../validation/tags.validation");
const tag_service_1 = require("../services/tag.service");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
exports.createTagController = (0, asyncHandler_1.default)(async (req, res) => {
    const result = tags_validation_1.createTagSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    const tag = await (0, tag_service_1.createTag)(result.data.name);
    res.status(201).json(new apiResponse_1.ApiResponse(201, tag, "Tag created successfully"));
});
exports.getAllTagsController = (0, asyncHandler_1.default)(async (req, res) => {
    const tags = await (0, tag_service_1.getAllTags)();
    res.status(200).json(new apiResponse_1.ApiResponse(200, tags, "Tags retrieved successfully"));
});
exports.assignTagToLeadController = (0, asyncHandler_1.default)(async (req, res) => {
    const result = tags_validation_1.assignTagSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    const assignment = await (0, tag_service_1.assignTagToLead)(result.data.leadId, result.data.tagName);
    res.status(201).json(new apiResponse_1.ApiResponse(201, assignment, "Tag assigned to lead successfully"));
});
exports.assignMultipleTagsToLeadController = (0, asyncHandler_1.default)(async (req, res) => {
    const result = tags_validation_1.assignMultipleTagsSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    const assignments = await (0, tag_service_1.assignMultipleTagsToLead)(result.data.leadId, result.data.tagNames);
    res.status(201).json(new apiResponse_1.ApiResponse(201, assignments, "Tags assigned to lead successfully"));
});
exports.removeTagFromLeadController = (0, asyncHandler_1.default)(async (req, res) => {
    const result = tags_validation_1.removeTagSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    const removed = await (0, tag_service_1.removeTagFromLead)(result.data.leadId, result.data.tagId);
    if (!removed) {
        throw new apiError_1.ApiError(404, "Tag assignment not found");
    }
    res.status(200).json(new apiResponse_1.ApiResponse(200, null, "Tag removed from lead successfully"));
});
exports.getTagsForLeadController = (0, asyncHandler_1.default)(async (req, res) => {
    const { leadId } = req.params;
    const tags = await (0, tag_service_1.getTagsForLead)(leadId);
    res.status(200).json(new apiResponse_1.ApiResponse(200, tags, "Tags retrieved successfully"));
});
