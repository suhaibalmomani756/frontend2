import { PrismaClient } from "@prisma/client";
import { Request, Response } from "express";

const prisma = new PrismaClient();

export const rateCourse = async (
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const { courseId } = req.params;
    const { value } = req.body;
    const studentId = req.user!.userId;

    if (value < 1 || value > 5) {
      res
        .status(400)
        .json({ message: "Rating value must be between 1 and 5." });
      return;
    }

    const rating = await prisma.rating.upsert({
      where: {
        studentId_courseId: { studentId, courseId },
      },
      update: { value },
      create: { studentId, courseId, value },
    });

    res.status(200).json(rating);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};

export const getMyRatings = async (req: Request, res: Response) => {
  try {
    const studentId = req.user!.userId;
    const ratings = await prisma.rating.findMany({
      where: { studentId },
      select: { courseId: true, value: true },
    });
    res.status(200).json(ratings);
  } catch (error: any) {
    res.status(500).json({ message: error.message });
  }
};
