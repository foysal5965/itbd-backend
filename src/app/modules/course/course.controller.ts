import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import {  courseService } from "./course.service";
import pick from "../../shared/pick";

const createCourse = catchAsync(async (req: Request, res: Response) => {

    const result = await courseService.createCourse(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course Created successfuly!",
        data: result
    })
});

const getAllFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, ['courseName', 'searchTerm', "categoryId",'id']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    console.log(options)
    const result = await courseService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course data fetched!",
        meta: result.meta,
        data: result.data
    })
})

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await courseService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course category updated!",
        data: result
    })
})
export const courseController ={
    createCourse,
    getAllFromDB,
    getByIdFromDB
}