import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import morgan from "morgan";
import path from "path";
import { fileURLToPath } from "url";

import connectDB from "./config/db.js";
import authRoutes from "./routes/auth.routes.js";
import jobRoutes from "./routes/job.routes.js";
import applicationRoutes from "./routes/application.routes.js";
import { requireAuth, requireRole } from "./middleware/auth.js";

const app = express();
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


// global middleware
app.use(cors());
app.use(express.json());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join(__dirname, "../uploads")));


// default route
app.get("/", (req, res) => {
  res.json({ message: "API works" });
});

// routes
app.use("/api/auth", authRoutes);
app.use("/api/jobs", jobRoutes);
app.use("/api", applicationRoutes);


// protected routes JWT
app.get("/api/protected", requireAuth, (req, res) => {
  res.json({ message: "You are authenticated", user: req.user });
});

app.get("/api/employer-only", requireAuth, requireRole("employer"), (req, res) => {
    res.json({ message: "Welcome employer" });
  }
);

const PORT = process.env.PORT || 5000;

const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
};

startServer();
