import express from "express";
import { createJob, getAllJobs, getJobById, getEmployerJobs, updateJob, deleteJob } from "../controllers/job.controller.js";

import { requireAuth, requireRole } from "../middleware/auth.js";

const router = express.Router();

// employer only
router.post("/", requireAuth, requireRole("employer"), createJob);

// employer dashboard
router.get("/employer/my-jobs", requireAuth, requireRole("employer"), getEmployerJobs);

// update job
router.put("/:id", requireAuth, requireRole("employer"), updateJob);

// delete job
router.delete("/:id", requireAuth, requireRole("employer"), deleteJob);

// public
router.get("/", getAllJobs);
router.get("/:id", getJobById);


export default router;
