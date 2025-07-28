import { Request, Response } from "express";
import { enrollmentService } from "../services/enrollmentService";

// Enroll in a course
export const enrollInCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    await enrollmentService.enrollInCourse(userId, courseId);
    res.status(200).json({ message: "Successfully enrolled in course" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Withdraw from a course
export const withdrawFromCourse = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.body;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    await enrollmentService.withdrawFromCourse(userId, courseId);
    res.status(200).json({ message: "Successfully withdrawn from course" });
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Get student's enrolled courses
export const getMyCourses = async (req: Request, res: Response) => {
  try {
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const courses = await enrollmentService.getMyCourses(userId);
    res.status(200).json(courses);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};

// Returns: [{ id, email, rating }, ...]
export const getEnrolledStudents = async (req: Request, res: Response) => {
  try {
    const { courseId } = req.params;
    const userId = req.user?.userId;

    if (!userId) {
      res.status(401).json({ message: "User not authenticated" });
      return;
    }

    const students = await enrollmentService.getEnrolledStudents(courseId);
    res.status(200).json(students);
  } catch (error: any) {
    res.status(400).json({ message: error.message });
  }
};
