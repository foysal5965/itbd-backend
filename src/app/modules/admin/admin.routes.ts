import express from 'express'
import { adminController } from './admin.controller';
import { UserRole } from '@prisma/client';
import auth from '../../middlewares/auth';
import validateRequest from '../../middlewares/validateRequest';
import { adminValidationSchemas } from './admin.validation';
const router = express.Router();

router.get(
    '/',
    auth(UserRole.SUPER_ADMIN),
    adminController.getAllFromDB
);

router.get('/:id', adminController.getByIdFromDB);



router.delete('/:id', adminController.deleteFromDB);

router.delete('/soft/:id', adminController.softDeleteFromDB);
export const AdminRoutes = router;