import express from 'express';
import { studentController } from './student.controller';
import exp from 'constants';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
const router = express.Router();
router.get('/',
    auth(UserRole.ADMIN, UserRole.SUPER_ADMIN),
     studentController.getAllFromDB);
export const studentRouter = router