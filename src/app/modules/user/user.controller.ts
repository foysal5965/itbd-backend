import { Request, RequestHandler, Response } from "express";
import { userService } from "./user.service";
import catchAsync from "../../shared/catchAsync";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";
import pick from "../../shared/pick";
import { IAuthUser } from "../../interfaces/commont";

const createAdmin = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createAdmin(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Admin Created successfuly!",
        data: result
    })
});
const createStudent = catchAsync(async (req: Request, res: Response) => {

    const result = await userService.createStudent(req);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Student Created successfuly!",
        data: result
    })
});

const getAllFromDB: RequestHandler = catchAsync(async (req: Request, res: Response) => {
    const filters = pick(req.query, ['email', 'searchTerm', "id"]);
    const options = pick(req.query, ['limit', 'page', 'sortBy', 'sortOrder'])
    const result = await userService.getAllFromDB(filters, options)

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "user data fetched!",
        meta: result.meta,
        data: result.data
    })
})
const getMyProfile = catchAsync(async (req: Request, res: Response) => {

    const user = req.user;

    const result = await userService.getMyProfile(user as IAuthUser);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile data fetched!",
        data: result
    })
});
const updateMyProfie = catchAsync(async (req: Request, res: Response) => {

    const user = req.user;

    const result = await userService.updateMyProfie(user as IAuthUser, req);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "My profile updated!",
        data: result
    })
});
export const userController ={
    createAdmin,
    createStudent,
    getAllFromDB,
    updateMyProfie,
    getMyProfile
}