import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { courseCategoryService } from "./courseCategory.service";
import pick from "../../shared/pick";

const createCategory = catchAsync(async (req: Request, res: Response) => {

    const result = await courseCategoryService.createCategory(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Category Created successfuly!",
        data: result
    })
});


const getAllFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, ['categoryName', 'searchTerm']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    console.log(options)
    const result = await courseCategoryService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Course category data fetched!",
        meta: result.meta,
        data: result.data
    })
})
export const courseCategoryController ={
    createCategory,
    getAllFromDB
}