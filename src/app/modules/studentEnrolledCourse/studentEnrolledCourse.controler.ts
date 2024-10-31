import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { studentEnrolledCourseService } from "./studentEnrolledCourse.service";
import { IAuthUser } from "../../interfaces/commont";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {

    const result = await studentEnrolledCourseService.insertIntoDb(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "booked course successfuly",
        data: result
    })
});
const getMyCourse = catchAsync(async (req: Request, res: Response) => {

    const user = req.user;

    const result = await studentEnrolledCourseService.getCourses(user as IAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My course fetched!",
        data: result
    })
});
export const studentEnrolledCourseController ={
    insertIntoDb,
    getMyCourse
}