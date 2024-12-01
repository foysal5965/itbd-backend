
import { Prisma } from "@prisma/client"
import { paginationHelper } from "../../helpers/paginationHelper"
import { IPaginationOptions } from "../../interfaces/pagination"
import prisma from "../../shared/prisma"

const insertIntoDB = async(payload:any)=>{
    const result = await prisma.contest.create({
        data:payload
    })

    return result
}
type IContestFilterRequest = {
    name?: string | undefined;
    searchTerm?: string | undefined;
}
const getAllFromDB = async (params: IContestFilterRequest, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;
    const andCondions: Prisma.ContestWhereInput[] = [];

    if (params.searchTerm) {
        andCondions.push({
            OR: ['name',].map(field => ({
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
    const whereConditons: Prisma.ContestWhereInput = { AND: andCondions }

    const result = await prisma.contest.findMany({
        where: whereConditons,
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.contest.count({
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


export const contestService = {
    insertIntoDB,
    getAllFromDB
}