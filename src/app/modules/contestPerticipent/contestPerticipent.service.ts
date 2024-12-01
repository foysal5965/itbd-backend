import { Request } from "express"
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../helpers/fileUploader";
import prisma from "../../shared/prisma";
import { Prisma, UserRole } from "@prisma/client";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";
import ConfirmationEmailSender from "./confirmationMail";

const insertIntoDb = async (req: Request) => {
    console.log(req.body, 'data')
    const file = req.file as IFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        if (!Array.isArray(uploadToCloudinary)) {
            req.body.image = uploadToCloudinary?.secure_url
        }
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        const isUserExist = await transactionClient.user.findFirst({
            where: {
                email: req.body.email
            }
        })
        if (isUserExist) {
            throw new ApiError(httpStatus.CONFLICT, 'user already exist. Try another email.')
        }
        await transactionClient.user.create({
            data: {
                email: req.body.email,
                password: '123456',
                role: UserRole.CONTESTPERTICIPENT
            }
        })
        const perticipentResult = await transactionClient.contestPerticipent.create({
            data: req.body
        },

        )
        if (perticipentResult) {
            await ConfirmationEmailSender(perticipentResult.email, `<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333; padding: 20px; border: 1px solid #ddd; border-radius: 10px; max-width: 600px; margin: auto; background-color: #f9f9f9;">
  <h2 style="text-align: center; color: #4CAF50;">Registration Confirmation</h2>
  <p>Dear <strong>${perticipentResult.name}</strong>,</p>
  <p>
    Thank you for registering for the <strong>Inter Colligiete Networking Contest</strong>! Your registration details are as follows:
  </p>
  <table style="width: 100%; margin: 20px 0; border-collapse: collapse;">
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Name:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${perticipentResult.name}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Email:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${perticipentResult.email}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>T-Shirt Size:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${perticipentResult.tShirtSize}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Job Experience:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${perticipentResult.isStudent}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Student Status:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">${perticipentResult.isStudent ? 'Yes' : 'No'}</td>
    </tr>
    <tr>
      <td style="padding: 8px; border: 1px solid #ddd;"><strong>Permission Letter:</strong></td>
      <td style="padding: 8px; border: 1px solid #ddd;">
        <a href="${perticipentResult.permissionLetter}" style="color: #4CAF50; text-decoration: none;" target="_blank">View Letter</a>
      </td>
    </tr>
  </table>
  <p>
    To learn more about the contest or make any changes to your registration, click the button below:
  </p>
  <a href="/" target="_blank" style="text-decoration: none;">
    <button style="background-color: #4CAF50; color: white; padding: 10px 20px; border: none; border-radius: 5px; cursor: pointer; font-size: 16px;">
      View Contest Details
    </button>
  </a>
  <p style="margin-top: 20px;">
    If you have any questions or need further assistance, feel free to contact us at <a href="/" style="color: #4CAF50;">supportemail@gmail.com</a>.
  </p>
  <p style="margin-top: 20px; text-align: center; font-size: 14px; color: #999;">
    &copy; ${new Date().getFullYear()} IT Bangladesh. All rights reserved.
  </p>
</div>
`)
        }
        return perticipentResult
    })
    return result
}


type IContestParticipantsFilterRequest = {
    name?: string | undefined;
    email?: string | undefined;
    searchTerm?: string | undefined;
}
const getAllFromDB = async (params: IContestParticipantsFilterRequest, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    const andCondions: Prisma.ContestPerticipentWhereInput[] = [];

    if (params.searchTerm) {
        andCondions.push({
            OR: ['name', 'email'].map(field => ({
                [field]: {
                    contains: params.searchTerm,
                    mode: 'insensitive'
                }
            }))
        })
    };

    if (Object.keys(filterData).length > 0) {
        andCondions.push({
            AND: Object.keys(filterData).map(key => ({
                [key]: {
                    equals: (filterData as any)[key],
                    mode: 'insensitive'
                }
            }))
        })
    };



    //console.dir(andCondions, { depth: 'inifinity' })
    const whereConditons: Prisma.ContestPerticipentWhereInput = { AND: andCondions }

    const result = await prisma.contestPerticipent.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.contestPerticipent.count({
        where: whereConditons
    });

    return {
        meta: {
            page,
            limit,
            total
        },
        data: result
    };
};

export const contestPerticipentService = {
    insertIntoDb,
    getAllFromDB
}