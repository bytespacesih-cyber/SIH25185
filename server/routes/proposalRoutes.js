import express from "express";
import { 
  createProposal,
  getProposals, 
  getMyProposals,
  getAssignedProposals,
  getProposalById,
  updateProposal,
  addFeedback,
  assignStaff,
  updateProposalStatus,
  submitStaffReport
} from "../controllers/prroposalControllers.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// All routes require authentication
router.use(protect);

// General routes
router.post("/", authorize('user'), createProposal);
router.get("/", getMyProposals); // i changed this line to getMyProposals
router.get("/:id", getMyProposals); // i changed this line to getMyProposals

// User-specific routes
router.get("/my-proposals", protect, authorize('user'), getMyProposals);
router.put("/:id", authorize('user'), updateProposal);

// Staff-specific routes  
router.get("/assigned", authorize('staff'), getAssignedProposals);
router.post("/:id/staff-report", authorize('staff'), submitStaffReport);

// Reviewer-specific routes
router.post("/:id/feedback", authorize('reviewer', 'staff'), addFeedback);
router.post("/:id/assign", authorize('reviewer'), assignStaff);
router.put("/:id/status", authorize('reviewer'), updateProposalStatus);

// Legacy upload route (for backward compatibility)
router.post("/upload", authorize('user'), createProposal);

export default router;
