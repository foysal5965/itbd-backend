import express, { NextFunction, Request, Response } from 'express'
import auth from '../../middlewares/auth'
import { UserRole } from '@prisma/client'
import { fileUploader } from '../../helpers/fileUploader'
import { courseCategoryValidation } from './category.validation'
import { courseCategoryController } from './courseCategory.controller'
const router = express.Router()
router.get('/', courseCategoryController.getAllFromDB)

router.post(
    "/create-category",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.uploadSingleImage,
    (req: Request, res: Response, next: NextFunction) => {
        req.body = courseCategoryValidation.createCategoryValidation.parse(JSON.parse(req.body.data))
        // return courseCategoryController.createCategory(req, res, next)
    }
);
router.get('/:id', courseCategoryController.getByIdFromDB)
router.patch(
    "/update/:id",
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    fileUploader.uploadSingleImage,
    (req: Request, res: Response, next: NextFunction) => {
        req.body = courseCategoryValidation.updateCategoryValidation.parse(JSON.parse(req.body.data))
        return courseCategoryController.updateIntoDB(req, res, next)
    }
);
router.delete('/:id', courseCategoryController.deleteFromDB)
export const courseCategoryRouter = router