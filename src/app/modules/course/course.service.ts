import { Admin, Course, CourseCategory, Prisma, PrismaClient, UserRole } from "@prisma/client"

import { IFile } from "../../interfaces/file";
import { fileUploader } from "../../helpers/fileUploader";
import { Request } from "express";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";
const prisma = new PrismaClient()
const createCourse = async (req: Request): Promise<Course> => {

    const file = req.file as IFile;

    if (file) {
        const uploadToCloudinary = await fileUploader.uploadToCloudinary(file);
        req.body.image = uploadToCloudinary?.secure_url
    }



    const result = await prisma.$transaction(async (transactionClient) => {


        const createdCourseData = await transactionClient.course.create({
            data: req.body
        });

        return createdCourseData;
    });

    return result;
};
type ICourseFilterRequest={
    courseName?: string | undefined;
    searchTerm?: string | undefined;
    id?:string | undefined
    }
const getAllFromDB = async (params: ICourseFilterRequest, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;
// console.log(filterData,searchTerm)
    const andCondions: Prisma.CourseWhereInput[] = [];

    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: ['courseName','categoryId','id'].map(field => ({
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
    const whereConditons: Prisma.CourseWhereInput = { AND: andCondions }

    const result = await prisma.course.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.course.count({
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
export const courseService = {
    createCourse,
    getAllFromDB
}