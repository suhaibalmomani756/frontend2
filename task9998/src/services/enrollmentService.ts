import { PrismaClient, Enrollment, User } from "@prisma/client";

const prisma = new PrismaClient();

export const enrollmentService = {
  async enrollInCourse(userId: string, courseId: string) {
    const enrollment = await prisma.enrollment.create({
      data: {
        studentId: userId,
        courseId,
      },
    });
    return enrollment;
  },

  async withdrawFromCourse(userId: string, courseId: string) {
    await prisma.enrollment.delete({
      where: {
        studentId_courseId: {
          studentId: userId,
          courseId,
        },
      },
    });
  },

  async getMyCourses(userId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        studentId: userId,
      },
      include: {
        course: {
          include: {
            instructor: {
              select: { id: true, email: true },
            },
          },
        },
      },
    });
    return enrollments.map((enrollment) => ({
      ...enrollment.course,
      instructor: enrollment.course.instructor,
    }));
  },

  async getEnrolledStudents(courseId: string) {
    const enrollments = await prisma.enrollment.findMany({
      where: {
        courseId,
      },
      include: {
        student: {
          select: {
            id: true,
            email: true,
          },
        },
      },
    });
    // Fetch ratings for all students in this course
    const ratings = await prisma.rating.findMany({
      where: { courseId },
      select: { studentId: true, value: true },
    });
    const ratingMap = Object.fromEntries(ratings.map(r => [r.studentId, r.value]));
    return enrollments.map((enrollment) => {
      const student = (enrollment as Enrollment & { student: User }).student;
      return {
        ...student,
        rating: ratingMap[student.id] || null,
      };
    });
  },
}; 