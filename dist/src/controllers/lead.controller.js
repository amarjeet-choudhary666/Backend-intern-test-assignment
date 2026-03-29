"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchLeadsController = exports.filterLeadsByStatusController = exports.deleteLeadController = exports.updateLeadController = exports.getLeadByIdController = exports.getAllLeadsController = exports.createLead = void 0;
const asyncHandler_1 = __importDefault(require("../utils/asyncHandler"));
const leads_validation_1 = require("../validation/leads.validation");
const lead_service_1 = require("../services/lead.service");
const apiResponse_1 = require("../utils/apiResponse");
const apiError_1 = require("../utils/apiError");
exports.createLead = (0, asyncHandler_1.default)(async (req, res, next) => {
    const result = leads_validation_1.createLeadSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    try {
        const lead = await (0, lead_service_1.createLeadService)(result.data);
        if (!lead) {
            throw new apiError_1.ApiError(400, "Failed to create lead");
        }
        return res.status(201).json(new apiResponse_1.ApiResponse(201, lead, "Lead created successfully"));
    }
    catch (error) {
        throw new apiError_1.ApiError(400, error.message || "Failed to create lead");
    }
});
exports.getAllLeadsController = (0, asyncHandler_1.default)(async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 50;
    if (page < 1 || limit < 1 || limit > 100) {
        throw new apiError_1.ApiError(400, "Invalid pagination parameters");
    }
    const leads = await (0, lead_service_1.getAllLeads)(page, limit);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, leads, "Leads retrieved successfully"));
});
exports.getLeadByIdController = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    const lead = await (0, lead_service_1.getLeadById)(Array.isArray(id) ? id[0] : id);
    if (!lead) {
        throw new apiError_1.ApiError(404, "Lead not found");
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, lead, "Lead retrieved successfully"));
});
exports.updateLeadController = (0, asyncHandler_1.default)(async (req, res, next) => {
    const result = leads_validation_1.updateLeadSchema.safeParse(req.body);
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    const { id } = req.params;
    const updatedLead = await (0, lead_service_1.updateLead)(Array.isArray(id) ? id[0] : id, result.data);
    if (!updatedLead) {
        throw new apiError_1.ApiError(404, "Lead not found");
    }
    return res.status(200).json(new apiResponse_1.ApiResponse(200, updatedLead, "Lead updated successfully"));
});
exports.deleteLeadController = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { id } = req.params;
    await (0, lead_service_1.deleteLead)(Array.isArray(id) ? id[0] : id);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, null, "Lead deleted successfully"));
});
exports.filterLeadsByStatusController = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { status } = req.query;
    if (!status) {
        throw new apiError_1.ApiError(400, "Status parameter is required");
    }
    const leads = await (0, lead_service_1.filterByStatus)(status);
    return res.status(200).json(new apiResponse_1.ApiResponse(200, leads, `Leads filtered by status: ${status}`));
});
exports.searchLeadsController = (0, asyncHandler_1.default)(async (req, res, next) => {
    const { q } = req.query;
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
        throw new apiError_1.ApiError(400, "Search query is required and cannot be empty");
    }
    if (q.length > 100) {
        throw new apiError_1.ApiError(400, "Search query is too long (max 100 characters)");
    }
    const query = q.trim();
    const nameResults = await (0, lead_service_1.searchLeads)(query);
    const emailResults = await (0, lead_service_1.searchLeadsByEmail)(query);
    const results = [...nameResults, ...emailResults];
    const unique = results.filter((lead, index, self) => index === self.findIndex(l => l.id === lead.id));
    return res.status(200).json(new apiResponse_1.ApiResponse(200, unique, `Search results for: ${query}`));
});
