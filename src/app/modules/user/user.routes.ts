import express, { NextFunction, Request, Response } from 'express'
import { userController } from './user.controller'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'
import { fileUploader } from '../../helpers/fileUploader'
import { userValidation } from './user.validation'
const router = express.Router()

router.get('/', userController.getAllFromDB)
router.get(
    '/me',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN, UserRole.STUDENT),
    userController.getMyProfile
)
router.post(
    "/create-admin",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.uploadSingleImage,
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createAdmin.parse(JSON.parse(req.body.data))
        return userController.createAdmin(req, res, next)
    }
);
router.post(
    "/create-student",
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.uploadSingleImage,
    (req: Request, res: Response, next: NextFunction) => {
        req.body = userValidation.createStudent.parse(JSON.parse(req.body.data))
        return userController.createStudent(req, res, next)
    }
);

router.patch(
    "/update-my-profile",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN,  UserRole.STUDENT),
    fileUploader.uploadSingleImage,
    (req: Request, res: Response, next: NextFunction) => {
        req.body = JSON.parse(req.body.data)
        return userController.updateMyProfie(req, res, next)
    }
);


export const userRouter = router