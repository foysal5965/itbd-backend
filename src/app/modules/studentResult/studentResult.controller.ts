import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { studentResultService } from "./studentResult.service";
import { IAuthUser } from "../../interfaces/commont";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const insertIntoDB = catchAsync(async(req:Request, res:Response)=>{
    
    const result = await studentResultService.insertIntoDB(req.body, req.user as IAuthUser)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "insert successfuly!",
        data: result
    })
})
const getMyResults = catchAsync(async(req:Request, res:Response)=>{
    
    const result = await studentResultService.getMyResults( req.user as IAuthUser)
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "result fetched!",
        data: result
    })
})


export const studentResultController = {
    insertIntoDB,
    getMyResults
}