import express from "express";
import { 
  loginUser, 
  registerUser, 
  getProfile, 
  updateProfile,
  getStaffMembers
} from "../controllers/authControllers.js";
import { protect, authorize } from "../middleware/authMiddleware.js";

const router = express.Router();

// Public routes
router.post("/login", loginUser);
router.post("/register", registerUser);

// Protected routes
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Reviewer only routes
router.get("/staff", protect, authorize('reviewer'), getStaffMembers);

export default router;
