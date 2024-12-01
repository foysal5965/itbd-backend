
import express from 'express'
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
import { studentResultController } from './studentResult.controller';
const router = express.Router();
router.get('/my-results', auth(UserRole.STUDENT), studentResultController.getMyResults)
router.post('/', auth(UserRole.STUDENT), studentResultController.insertIntoDB)

export const studentResultRouter = router