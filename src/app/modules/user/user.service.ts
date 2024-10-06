import { Admin, Prisma, PrismaClient, Student, UserRole } from "@prisma/client"
import * as bcrypt from 'bcrypt'
import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../helpers/fileUploader";
import { Request } from "express";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";
const prisma = new PrismaClient()
const createAdmin = async (req: Request): Promise<Admin> => {
    const isExist = await prisma.user.findFirst({
        where: {
            email: req.body.admin.email
        }
    })

    if (isExist) {
        throw new ApiError(409, 'Email already exist')
    }
    const file = req.file as IFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.admin.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.admin.email,
        password: hashedPassword,
        role: UserRole.ADMIN
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdAdminData = await transactionClient.admin.create({
            data: req.body.admin
        });

        return createdAdminData;
    });

    return result;
};
const createStudent = async (req: Request): Promise<Student> => {
   
    const isExist = await prisma.user.findFirst({
        where: {
            email: req.body.student.email
        }
    })

    if (isExist) {
        throw new ApiError(409, 'Email already exist')
    }
    const file = req.file as IFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.student.profilePhoto = uploadToCloudinary?.secure_url
    }

    const hashedPassword: string = await bcrypt.hash(req.body.password, 12)

    const userData = {
        email: req.body.student.email,
        password: hashedPassword,
        role: UserRole.STUDENT
    }

    const result = await prisma.$transaction(async (transactionClient) => {
        await transactionClient.user.create({
            data: userData
        });

        const createdStudentData = await transactionClient.student.create({
            data: req.body.student
        });

        return createdStudentData;
    });

    return result;
};

interface IUserFilterRequest {
    email?: string | undefined;
    searchTerm?: string | undefined;
    id?: string | undefined
}
const getAllFromDB = async (params: IUserFilterRequest, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    // console.log(filterData,searchTerm)
    const andCondions: Prisma.UserWhereInput[] = [];

    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: ['email', 'id'].map(field => ({
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
    const whereConditons: Prisma.UserWhereInput = { AND: andCondions }

    const result = await prisma.user.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.user.count({
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


export const userService = {
    createAdmin,
    createStudent,
    getAllFromDB
}