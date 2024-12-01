import express, { NextFunction, Request, Response } from 'express'
import { contestPerticipentController } from './contestPerticipent.controller'
import { fileUploader } from '../../helpers/fileUploader';
import { ContestPerticipentSchema } from './contestPerticipentValidation';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
const router = express.Router()
router.get('/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    contestPerticipentController.getAllFromDB
)
router.post(
    "/registration",
    fileUploader.uploadSingleImage,
    (req: Request, res: Response, next: NextFunction) => {
        // console.log(req.body,'data')
        req.body = ContestPerticipentSchema.parse(JSON.parse(req.body.data))
        return contestPerticipentController.insertIntoDb(req, res, next)
    }
);
export const contestPerticipentRouter = router