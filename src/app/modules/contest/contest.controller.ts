import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import { contestService } from "./contest.service";
import pick from "../../shared/pick";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {

    const result = await contestService.insertIntoDB(req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "contest created successfuly",
        data: result
    })
});
const getAllFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['name', 'searchTerm']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await contestService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "contest data fetched!",
        meta: result.meta,
        data: result.data
    })
})
export const contestController= {
    insertIntoDb,
    getAllFromDB
}