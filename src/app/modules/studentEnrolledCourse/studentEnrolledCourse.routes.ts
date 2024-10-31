import express from 'express'
import { studentEnrolledCourseController } from './studentEnrolledCourse.controler';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
const router = express.Router();
router.get('/my-courses',
    auth(UserRole.STUDENT),
    studentEnrolledCourseController.getMyCourse)
router.post('/', studentEnrolledCourseController.insertIntoDb)
export const studentEnrolledCourseRouter = router