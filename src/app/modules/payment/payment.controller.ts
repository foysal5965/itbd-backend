import { Request, Response } from "express";
import catchAsync from "../../shared/catchAsync";
import { PaymentServie } from "./payment.service";
import sendResponse from "../../shared/sendResponse";
import httpStatus from "http-status";

const initPayment = catchAsync(async (req: Request, res: Response) => {
    const{enrolledCourseId}= req.params
    const result = await PaymentServie.initPayment(enrolledCourseId);

    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: "Payment initiet successfully!",
        data: result
    });
});
const validatePayment = catchAsync(async (req: Request, res: Response) => {
    const result = await PaymentServie.validatePayment(req.query);
    sendResponse(res, {
        statusCode: httpStatus.OK,
        success: true,
        message: 'Payment validate successfully',
        data: result,
    });
});
export const paymentController={
    initPayment,
    validatePayment
}