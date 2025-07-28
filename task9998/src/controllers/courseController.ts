import { Request, Response } from "express";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

// Get all courses
export const getAllCourses = async (req: Request, res: Response) => {
  try {
    const courses = await prisma.course.findMany({
      include: {
        instructor: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    res.status(200).json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Create a course
export const createCourse = async (req: Request, res: Response) => {
  try {
    const { title, description } = req.body;
    const instructorId = req.user!.userId;

    const course = await prisma.course.create({
      data: {
        title,
        description,
        instructorId,
      },
    });

    res.status(201).json(course);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a course
export const deleteCourse = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const instructorId = req.user!.userId;

    const course = await prisma.course.findUnique({ where: { id } });

    if (!course || course.instructorId !== instructorId) {
      return res
        .status(403)
        .json({ message: "You are not allowed to delete this course" });
    }

    await prisma.course.delete({
      where: { id },
    });
    
    res.status(200).json({ message: "Course deleted" });
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

// Get instructor's courses with enrolled students
export const getInstructorCourses = async (req: Request, res: Response) => {
  try {
    const instructorId = req.user!.userId;

    const courses = await prisma.course.findMany({
      where: { 
        instructorId,
      },
      include: {
        enrollments: {
          include: {
            student: {
              select: { id: true, email: true },
            },
          },
        },
      },
    });

    res.status(200).json(courses);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
