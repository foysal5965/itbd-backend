import express from 'express'
import { userRouter } from '../modules/user/user.routes'
import { AuthRoutes } from '../modules/auth/auth.routes';
import { AdminRoutes } from '../modules/admin/admin.routes';
import { courseCategoryRouter } from '../modules/courseCategory/courseCategory.routes';
import { courseRouter } from '../modules/course/course.routes';
import { studentEnrolledCourseRouter } from '../modules/studentEnrolledCourse/studentEnrolledCourse.routes';
import { paymentRouter } from '../modules/payment/payment.routes';
import { studentRouter } from '../modules/student/student.routes';
import { ExamRouter } from '../modules/exam/exam.routes';
import { studentResultRouter } from '../modules/studentResult/studentResult.routes';
import { contestRouter } from '../modules/contest/constest.routes';
import { contestPerticipentRouter } from '../modules/contestPerticipent/contestPerticipent.routes';
const router = express.Router()
const moduleRoutes = [
    // ... routes
    {
        path: "/user",
        route: userRouter
    },
    {
        path: "/admin",
        route: AdminRoutes
    },
    {
        path: "/student",
        route: studentRouter
    },
    {
        path: "/auth",
        route: AuthRoutes
    },
    {
        path: "/category",
        route: courseCategoryRouter
    },
    {
        path: "/course",
        route: courseRouter
    },
    {
        path: "/student-enrolled-course",
        route: studentEnrolledCourseRouter
    },
    {
        path: "/payment",
        route: paymentRouter
    },
    {
        path: "/exam",
        route: ExamRouter
    },
    {
        path: "/student-result",
        route: studentResultRouter
    },
    {
        path: "/contest",
        route: contestRouter
    },
    {
        path: "/manage-contest",
        route: contestPerticipentRouter
    },

]
moduleRoutes.forEach(route => router.use(route.path, route.route));
export default router;