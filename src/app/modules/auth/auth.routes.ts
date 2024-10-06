import express from 'express'
import { authService } from './auth.service';
import { authControlller } from './auth.controller';
import auth from '../../middlewares/auth';
import { UserRole } from '@prisma/client';
const router = express.Router();

router.post(
    '/login',
    authControlller.loginUser
);
router.post(
    '/refresh-token',
    authControlller.refreshToken
)

router.post(
    '/change-password',
    auth(
        UserRole.SUPER_ADMIN,
        UserRole.ADMIN
    ),
    authControlller.changePassword
);
router.post(
    '/forgot-password',
    authControlller.forgotPassword
);


router.post(
    '/reset-password',
    authControlller.resetPassword
)
export const AuthRoutes = router;