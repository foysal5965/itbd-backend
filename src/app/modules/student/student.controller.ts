import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import pick from "../../shared/pick";
import { studentService } from "./student.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const getAllFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, ['email','contactNumber','name','searchTerm']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    console.log(options)
    const result = await studentService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "student data fetched!",
        meta: result.meta,
        data: result.data
    })
})
export const studentController={
    getAllFromDB
}