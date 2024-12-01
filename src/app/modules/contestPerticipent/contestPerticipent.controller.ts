import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { contestPerticipentService } from "./contestPerticipent.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";

const insertIntoDb = catchAsync(async (req: Request, res: Response) => {

    const result = await contestPerticipentService.insertIntoDb(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Loged in successfully",
        data: result
    })
});
const getAllFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['name','email', 'searchTerm']);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await contestPerticipentService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "contest participant data fetched!",
        meta: result.meta,
        data: result.data
    })
})
export const contestPerticipentController ={
    insertIntoDb,
    getAllFromDB
}