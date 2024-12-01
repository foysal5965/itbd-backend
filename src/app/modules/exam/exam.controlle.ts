import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { examSevice } from "./exam.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";

const insertIntoDB = catchAsync(async (req: Request, res: Response) => {
   

    const result = await examSevice.insertIntoDB(req)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Exam created successfuly!",
        data: result
    })
});
const getAllFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['title', 'searchTerm']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await examSevice.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "exam data fetched!",
        meta: result.meta,
        data: result.data
    })
})
const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await examSevice.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course category updated!",
        data: result
    })
})
const updatedExam = catchAsync(async (req: Request, res: Response) => {

    const result = await examSevice.updateExam(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Exam updated!",
        data: result
    })
})
const updatedExamStatus = catchAsync(async (req: Request, res: Response) => {

    const result = await examSevice.updateExamStatus(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Exam status updated!",
        data: result
    })
})
const getMyExam = catchAsync(async (req: Request, res: Response) => {
const user = req.user
    const result = await examSevice.getMyExam(user);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My exams fetched",
        data: result
    })
})

export const examController = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updatedExam,
    updatedExamStatus,
    getMyExam
}