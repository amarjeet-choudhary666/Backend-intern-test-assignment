import { Router } from "express";
import {
  createTagController,
  getAllTagsController,
  assignTagToLeadController,
  assignMultipleTagsToLeadController,
  removeTagFromLeadController,
  getTagsForLeadController,
} from "../controllers/tag.controller";

const router = Router();

router.post("/", createTagController);
router.get("/", getAllTagsController);
router.post("/assign", assignTagToLeadController);
router.post("/assign-multiple", assignMultipleTagsToLeadController);
router.delete("/remove", removeTagFromLeadController);
router.get("/lead/:leadId", getTagsForLeadController);

export default router;
