import express from 'express'
import { studentEnrolledCourseController } from './studentEnrolledCourse.controler';
const router = express.Router();
router.post('/', studentEnrolledCourseController.insertIntoDb)
export const studentEnrolledCourseRouter = router