import { Prisma } from "@prisma/client";
import { paginationHelper } from "../../helpers/paginationHelper";
import { IPaginationOptions } from "../../interfaces/pagination";
import prisma from "../../shared/prisma";

interface IStudentFilterRequest{
    email?:string;
    contactNumber?:string;
    name?:string;
    searchTerm?:string
}
const getAllFromDB = async (params: IStudentFilterRequest, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andCondions: Prisma.StudentWhereInput[] = [];

    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: ['email', 'name', 'phoneNumber','contactNumber'].map(field => ({
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
                    equals: (filterData as any)[key]
                }
            }))
        })
    };

    andCondions.push({
        isDeleted: false
    })

    //console.dir(andCondions, { depth: 'inifinity' })
    const whereConditons: Prisma.StudentWhereInput = { AND: andCondions }

    const result = await prisma.student.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.student.count({
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

export const studentService={
    getAllFromDB
}