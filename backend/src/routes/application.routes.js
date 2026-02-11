import express from "express";
import { applyForJob, getJobApplications, updateApplicationStatus } from "../controllers/application.controller.js";

import { requireAuth, requireRole } from "../middleware/auth.js";
import { uploadResume } from "../middleware/upload.js";


const router = express.Router();

// job seeker applies
router.post("/jobs/:id/apply", requireAuth, requireRole("job_seeker"), 
uploadResume.single("resume"), applyForJob);

// employer views applications  
router.get("/employer/jobs/:id/applications", requireAuth, 
requireRole("employer"), getJobApplications);

// employer updates application status
router.patch("/employer/applications/:applicationId/status", requireAuth,
  requireRole("employer"),
  updateApplicationStatus
);


export default router;
