import express from "express";
import cors from "cors";
import authRoutes from "./routes/authRoutes";
import courseRoutes from "./routes/courseRoutes";
import enrollmentRoutes from "./routes/enrollmentRoutes";
import ratingRoutes from "./routes/ratingRoutes";

const app = express();

app.use(cors());
app.use(express.json());

// Base Routes
app.use("/api/auth", authRoutes);
app.use("/api/courses", courseRoutes);
app.use("/api/enrollments", enrollmentRoutes);
app.use("/api/ratings", ratingRoutes);
// Health Check
app.get("/", (req, res) => {
  res.send("API is running...");
});

export default app;
