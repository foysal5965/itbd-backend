import { Admin, CourseCategory, Prisma, PrismaClient, UserRole } from "@prisma/client"

import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../helpers/fileUploader";
import { Request } from "express";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";
const prisma = new PrismaClient()
const createCategory = async (req: Request): Promise<CourseCategory> => {

    const file = req.file as IFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.image = uploadToCloudinary?.secure_url
    }

    const result = await prisma.$transaction(async (transactionClient) => {


        const createdAdminData = await transactionClient.courseCategory.create({
            data: req.body
        });

        return createdAdminData;
    });

    return result;
};

type ICategoryFilterRequest={
categoryName?: string | undefined;
searchTerm?: string | undefined;
}
const getAllFromDB = async (params: ICategoryFilterRequest, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andCondions: Prisma.CourseCategoryWhereInput[] = [];

    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: ['categoryName'].map(field => ({
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
    const whereConditons: Prisma.CourseCategoryWhereInput = { AND: andCondions }

    const result = await prisma.courseCategory.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.courseCategory.count({
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
export const courseCategoryService = {
    createCategory,
    getAllFromDB
}