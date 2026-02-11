import Job from "../models/Job.js";

// Employer CREATE JOB
export const createJob = async (req, res) => {
  try {
    const { title, company, location, description, salary } = req.body;

    const job = await Job.create({
      title,
      company,
      location,
      description,
      salary,
      employerId: req.user.userId 
    });

    res.status(201).json({
      message: "Job created successfully",
      job
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET ALL JOBS (Public)
// export const getAllJobs = async (req, res) => {
//   try {
//     const jobs = await Job.find().sort({ createdAt: -1 });

//     res.json(jobs);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


export const getAllJobs = async (req, res) => {
  try {
    // Read query params
    const page = Number(req.query.page) || 1;
    const limit = Number(req.query.limit) || 10;
    const search = req.query.search || "";

    // Calculate skip
    const skip = (page - 1) * limit;

    // Build search filter
    const searchFilter = search
      ? {
          $or: [
            { title: { $regex: search, $options: "i" } },
            { company: { $regex: search, $options: "i" } },
            { location: { $regex: search, $options: "i" } }
          ]
        }
      : {};

    // Fetch jobs
    const jobs = await Job.find(searchFilter)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    // Count total jobs
    const totalJobs = await Job.countDocuments(searchFilter);

    res.json({
      page,
      limit,
      totalJobs,
      totalPages: Math.ceil(totalJobs / limit),
      jobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET SINGLE JOB
export const getJobById = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    res.json(job);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// GET JOBS CREATED BY LOGGED-IN EMPLOYER
export const getEmployerJobs = async (req, res) => {
  try {
    const employerId = req.user.userId;

    const jobs = await Job.find({ employerId })
      .sort({ createdAt: -1 });

    res.json({
      count: jobs.length,
      jobs
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



// UPDATE JOB (Employer + Owner only)
export const updateJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this job" });
    }

    const updatedJob = await Job.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    );

    res.json({
      message: "Job updated successfully",
      job: updatedJob
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// DELETE JOB (Employer + Owner only)
export const deleteJob = async (req, res) => {
  try {
    const job = await Job.findById(req.params.id);

    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to delete this job" });
    }

    await job.deleteOne();

    res.json({ message: "Job deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
