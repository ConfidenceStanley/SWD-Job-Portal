import Application from "../models/Application.js";
import Job from "../models/Job.js";
import User from "../models/User.js";
import sendEmail from "../utils/sendEmail.js";


export const applyForJob = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "Resume is required" });
    }

    const job = await Job.findById(req.params.id);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // const application = await Application.create({
    //   jobId: job._id,
    //   applicantId: req.user.userId,
    //   resumeUrl: `/uploads/${req.file.filename}`
    // });

    // const employer = await User.findById(job.employerId);

    // if (!employer || !employer.email) {
    //   console.warn("Employer email not found for job:", job._id);
    //   return res.status(201).json({
    //     message: "Application submitted successfully (email not sent)",
    //     application
    //   });
    // }

    //     await sendEmail({
    //       to: employer.email,
    //       subject: "New Job Application Received",
    //       text: `Hello ${employer.name},

    // A new candidate has applied for the position "${job.title}".

    // Please log in to your dashboard to review the application.

    // Regards,
    // SWD Resume Job Portal`
    //     });

    //     res.status(201).json({
    //       message: "Application submitted successfully",
    //       application
    //     });

    // Save application
    
    const resumeUrl =
  `${req.protocol}://${req.get("host")}/uploads/${req.file.filename}`;


    const application = await Application.create({
      jobId: job._id,
      applicantId: req.user.userId,
      resumeUrl
    });

    // Respond immediately
    res.status(201).json({
      message: "Application submitted successfully",
      application
    });

    // Fetch employer 
        const employer = await User.findById(job.employerId);
        if (!employer || !employer.email) return;

    // Send email in background 
    sendEmail({
      to: employer.email,
      subject: `New Job Application Received For ${job.title}`,
      text: `Hello ${employer.name},

    A new candidate has applied for the position "${job.title}".

    Please log in to your dashboard to review the application.

    Regards,
    SWD Resume Job Portal`

    }).catch(err => {
      console.error("EMAIL FAILED (ignored):", err.message);
    });

  } catch (error) {
    console.error("APPLY JOB ERROR:", error);
    res.status(500).json({ message: error.message });

    // Only send error if response NOT already sent
    if (!res.headersSent) {
      res.status(500).json({ message: "Server error" });
    }
  }
};


export const getJobApplications = async (req, res) => {
  
  try {
    const jobId = req.params.id;

    // find job
    const job = await Job.findById(jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    // ownership check
    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to view applications" });
    }

    const applications = await Application.find({ jobId })
      .populate("applicantId", "name email")
      .sort({ createdAt: -1 });

    res.json({
      count: applications.length,
      applications
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


export const updateApplicationStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const applicationId = req.params.applicationId;

    const allowedStatuses = ["pending", "reviewed", "accepted", "rejected"];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    const application = await Application.findById(applicationId);
    if (!application) {
      return res.status(404).json({ message: "Application not found" });
    }

    const job = await Job.findById(application.jobId);
    if (!job) {
      return res.status(404).json({ message: "Job not found" });
    }

    if (job.employerId.toString() !== req.user.userId) {
      return res.status(403).json({ message: "Not authorized to update this application" });
    }

    application.status = status;
    await application.save();

    res.json({
      message: "Application status updated",
      application
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
