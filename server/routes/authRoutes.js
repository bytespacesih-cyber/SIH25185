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

// Handle GET requests to registration endpoint with helpful error
router.get("/register", (req, res) => {
  res.status(405).json({
    success: false,
    message: "GET method not allowed. Use POST method to register a user.",
    allowedMethods: ["POST"],
    usage: {
      method: "POST",
      endpoint: "/api/auth/register",
      body: {
        name: "string (required)",
        email: "string (required)",
        password: "string (required)",
        role: "string (optional: 'user', 'reviewer', 'staff')",
        department: "string (optional)"
      }
    }
  });
});

// Similar handler for login endpoint
router.get("/login", (req, res) => {
  res.status(405).json({
    success: false,
    message: "GET method not allowed. Use POST method to login.",
    allowedMethods: ["POST"],
    usage: {
      method: "POST",
      endpoint: "/api/auth/login",
      body: {
        email: "string (required)",
        password: "string (required)"
      }
    }
  });
});

// Protected routes
router.get("/me", protect, getProfile);
router.put("/profile", protect, updateProfile);

// Reviewer only routes
router.get("/staff", protect, authorize('reviewer'), getStaffMembers);

export default router;
