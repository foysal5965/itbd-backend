import express, { NextFunction, Request, Response } from 'express'
import { fileUploader } from '../../helpers/fileUploader';
import { examController } from './exam.controlle';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
const router = express.Router()
router.get('/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    examController.getAllFromDB
)
router.get('/my-exams',
    auth(UserRole.STUDENT),
    examController.getMyExam)
router.post(
    "/create-exam",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.upload,
    (req: Request, res: Response, next: NextFunction) => {
        return examController.insertIntoDB(req, res, next)
    }
);
router.get('/:id',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    examController.getByIdFromDB
)
router.patch('/update/:id',
    fileUploader.upload,
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    (req: Request, res: Response, next: NextFunction) => {
      
        return examController.updatedExam(req, res, next)
    }
)
router.patch('/update/status/:id', examController.updatedExamStatus)
export const ExamRouter = router