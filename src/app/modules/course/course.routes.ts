import express, { NextFunction, Request, Response } from 'express'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'
import { fileUploader } from '../../helpers/fileUploader'
import { courseController } from './course.controller'
import { courseValidation } from './course.validation'
const router = express.Router()

router.get('/', courseController.getAllFromDB)
router.post(
    "/create-course",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.uploadSingleImage,
    (req: Request, res: Response, next: NextFunction) => {
        req.body = courseValidation.createCourseSchema.parse(JSON.parse(req.body.data))
        return courseController.createCourse(req, res, next)
    }
);
router.get('/:id', courseController.getByIdFromDB)
export const courseRouter = router