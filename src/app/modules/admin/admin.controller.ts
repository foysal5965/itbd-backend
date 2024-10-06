import { Request, RequestHandler, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { adminFilterableFields } from "./admin.constant";
import pick from "../../shared/pick";
import { adminService } from "./admin.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from 'http-status';

const getAllFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    // console.log(req.query)
    const filters = pick(req.query, adminFilterableFields);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    console.log(options)
    const result = await adminService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data fetched!",
        meta: result.meta,
        data: result.data
    })
})

const getByIdFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminService.getByIdFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data fetched by id!",
        data: result
    });
})


const updateIntoDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminService.updateIntoDB(id, req.body);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data updated!",
        data: result
    })
})

const deleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminService.deleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data deleted!",
        data: result
    })
})


const softDeleteFromDB = catchAsync(async (req: Request, res: Response) => {
    const { id } = req.params;

    const result = await adminService.softDeleteFromDB(id);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin data deleted!",
        data: result
    })
});
export const adminController ={
    getAllFromDB,
    getByIdFromDB,
    updateIntoDB,
    deleteFromDB,
    softDeleteFromDB
}