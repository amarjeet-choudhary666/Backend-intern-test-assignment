import asyncHandler from "../utils/asyncHandler";
import { createLeadSchema, updateLeadSchema } from "../validation/leads.validation";
import { 
  createLeadService, 
  getAllLeads, 
  getLeadById, 
  updateLead, 
  deleteLead, 
  filterByStatus, 
  searchLeads, 
  searchLeadsByEmail 
} from "../services/lead.service";
import { ApiResponse } from "../utils/apiResponse";
import { ApiError } from "../utils/apiError";

export const createLead = asyncHandler(async(req, res, next) => {
    const result = createLeadSchema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    
    try {
        const lead = await createLeadService(result.data);

        if(!lead){
            throw new ApiError(400, "Failed to create lead");
        }
        
        return res.status(201).json(
            new ApiResponse(201, lead, "Lead created successfully")
        );

    } catch (error: any) {
        throw new ApiError(400, error.message || "Failed to create lead");
    }
});

export const getAllLeadsController = asyncHandler(async(req, res, next) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 50;
    
    if (page < 1 || limit < 1 || limit > 100) {
        throw new ApiError(400, "Invalid pagination parameters");
    }
    
    const leads = await getAllLeads(page, limit);
    return res.status(200).json(
        new ApiResponse(200, leads, "Leads retrieved successfully")
    );
});

export const getLeadByIdController = asyncHandler(async(req, res, next) => {
    const { id } = req.params;
    const lead = await getLeadById(Array.isArray(id) ? id[0] : id);
    
    if (!lead) {
        throw new ApiError(404, "Lead not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, lead, "Lead retrieved successfully")
    );
});

export const updateLeadController = asyncHandler(async(req, res, next) => {
    const result = updateLeadSchema.safeParse(req.body);
    
    if (!result.success) {
        return res.status(400).json({
            error: result.error.format()
        });
    }
    
    const { id } = req.params;
    const updatedLead = await updateLead(Array.isArray(id) ? id[0] : id, result.data);
    
    if (!updatedLead) {
        throw new ApiError(404, "Lead not found");
    }
    
    return res.status(200).json(
        new ApiResponse(200, updatedLead, "Lead updated successfully")
    );
});

export const deleteLeadController = asyncHandler(async(req, res, next) => {
    const { id } = req.params;
    await deleteLead(Array.isArray(id) ? id[0] : id);
    
    return res.status(200).json(
        new ApiResponse(200, null, "Lead deleted successfully")
    );
});

export const filterLeadsByStatusController = asyncHandler(async(req, res, next) => {
    const { status } = req.query;
    
    if (!status) {
        throw new ApiError(400, "Status parameter is required");
    }
    
    const leads = await filterByStatus(status as string);
    
    return res.status(200).json(
        new ApiResponse(200, leads, `Leads filtered by status: ${status}`)
    );
});

export const searchLeadsController = asyncHandler(async(req, res, next) => {
    const { q } = req.query;
    
    if (!q || typeof q !== 'string' || q.trim().length === 0) {
        throw new ApiError(400, "Search query is required and cannot be empty");
    }
    
    if (q.length > 100) {
        throw new ApiError(400, "Search query is too long (max 100 characters)");
    }
    
    const query = q.trim();
    const nameResults = await searchLeads(query);
    const emailResults = await searchLeadsByEmail(query);
    
    const results = [...nameResults, ...emailResults];
    const unique = results.filter((lead, index, self) => 
        index === self.findIndex(l => l.id === lead.id)
    );
    
    return res.status(200).json(
        new ApiResponse(200, unique, `Search results for: ${query}`)
    );
});