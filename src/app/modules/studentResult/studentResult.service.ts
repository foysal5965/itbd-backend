import { IAuthUser } from "../../interfaces/commont"
import prisma from "../../shared/prisma"

const insertIntoDB = async (payload: any, user: IAuthUser) => {
    const userData = await prisma.user.findFirstOrThrow({
        where: {
            email: user?.email
        },
        include: {
            Student: true
        }
    })
    const result = await prisma.studentResult.create({
        //@ts-ignore
        data: {
            studentId: userData?.Student?.id,
            examId: payload.examId,
            score: payload.score
        }
    })
    return result
}




const getMyResults = async (user: IAuthUser) => {
    const userData = await prisma.user.findFirstOrThrow({
        where: {
            email: user?.email
        },
        include: {
            Student: true
        }
    })
    const result = await prisma.studentResult.findMany({
        where: {
            studentId: userData?.Student?.id
        },
        include:{
            exam:true
        }
    })
    return result
}
export const studentResultService = {
    insertIntoDB,
    getMyResults
}