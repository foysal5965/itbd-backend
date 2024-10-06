import { z } from 'zod';

const createCourseSchema = z.object({
  courseName: z.string().min(1, "Course name is required"), // Required string
  duration: z.string().min(1, "Duration is required"),      // Required string
  lectures: z.number().int().min(0, "Lectures must be a positive integer"), // Integer >= 0
  projects: z.number().int().min(0, "Projects must be a positive integer"), // Integer >= 0
  courseOverView: z.string().min(1, "Course overview is required"),  // Required string
  courseCurriculum: z.array(z.string()).nonempty("Course curriculum cannot be empty"), // Array of strings
  courseFee: z.number().int().min(0, "Course fee must be a positive integer"), // Integer >= 0
  categoryId: z.string().min(1, "Category ID is required"), // Required unique string
});

export const courseValidation={
    createCourseSchema
}