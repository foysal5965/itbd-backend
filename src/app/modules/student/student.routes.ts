import express from 'express';
import { studentController } from './student.controller';
import exp from 'constants';
const router = express.Router();
router.get('/', studentController.getAllFromDB);
export const studentRouter = router