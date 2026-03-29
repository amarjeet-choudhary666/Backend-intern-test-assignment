import { Router } from "express";
import {
  createLead,
  getAllLeadsController,
  getLeadByIdController,
  updateLeadController,
  deleteLeadController,
  filterLeadsByStatusController,
  searchLeadsController,
} from "../controllers/lead.controller";

const router = Router();

router.post("/", createLead);
router.get("/", getAllLeadsController);
router.get("/filter/status", filterLeadsByStatusController);
router.get("/search", searchLeadsController);
router.get("/:id", getLeadByIdController);
router.put("/:id", updateLeadController);
router.delete("/:id", deleteLeadController);

export default router;
