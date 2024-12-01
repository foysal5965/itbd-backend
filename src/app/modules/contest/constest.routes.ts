import express from 'express'
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { contestController } from './contest.controller';
const router = express.Router();
router.get('/',
    // auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    contestController.getAllFromDB
)
router.post('/',
    auth(UserRole.SUPER_ADMIN, UserRole.ADMIN),
    contestController.insertIntoDb
)
export const contestRouter = 
    router
