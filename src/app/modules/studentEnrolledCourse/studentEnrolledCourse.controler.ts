import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { studentEnrolledCourseService } from "./studentEnrolledCourse.service";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {

    const result = await studentEnrolledCourseService.insertIntoDb(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "booked course successfuly",
        data: result
    })
});
export const studentEnrolledCourseController ={
    insertIntoDb
}