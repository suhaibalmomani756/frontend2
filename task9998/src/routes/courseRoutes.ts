import { RequestHandler, Router } from "express";
import {
  createCourse,
  deleteCourse,
  getInstructorCourses,
  getAllCourses,
} from "../controllers/courseController";
import { requireAuth, requireRole } from "../middlewares/authMiddleware";

const router = Router();

// Get all courses (public)
router.get("/", getAllCourses);

// INSTRUCTOR routes
router.post(
  "/",
  requireAuth as RequestHandler,
  requireRole("INSTRUCTOR") as RequestHandler,
  createCourse
);
router.delete(
  "/:id",
  requireAuth as RequestHandler,
  requireRole("INSTRUCTOR") as RequestHandler,
  deleteCourse as RequestHandler
);
router.get(
  "/instructor/my-courses",
  requireAuth as RequestHandler,
  requireRole("INSTRUCTOR") as RequestHandler,
  getInstructorCourses
);

export default router;
