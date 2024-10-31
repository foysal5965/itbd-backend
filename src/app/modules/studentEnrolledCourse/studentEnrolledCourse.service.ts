
import httpStatus from "http-status"
import ApiError from "../../error/ApiError"
import { IAuthUser } from "../../interfaces/commont"
import prisma from "../../shared/prisma"

const insertIntoDb = async (payload: any) => {
    
    const result = await prisma.$transaction(async (tx) => {
        const studentEnrolledCourseData = await tx.studentEnrolledCourse.create({
            data: {
                studentId: payload.studentId,
                courseId: payload.courseId
            },
            include: {
                student: true,
                course: true
            }
        })
        const today = new Date();

        const transactionId = "itbd" + today.getFullYear() + "-" + today.getMonth() + "-" + today.getDay() + "-" + today.getHours() + "-" + today.getMinutes();

        await tx.payment.create({
            data: {
                enrolledCourseId: studentEnrolledCourseData.id,
                amount: studentEnrolledCourseData.course.courseFee,
                transactionId
            }
        })
        return studentEnrolledCourseData
    })
    return result
}

const getCourses = async(user: IAuthUser)=>{
    const userInfo = await prisma.student.findFirst({
        where: {
            email: user?.email
        }
    });
    if(!userInfo){
        throw new ApiError(httpStatus.NOT_FOUND,'user not found')
    }
    const result = await prisma.studentEnrolledCourse.findMany({
        where:{
            student:{
                email: userInfo.email
            }
        },
        include:{
            course:true
        }
    })
    // console.log(result)
    return result
}
export const studentEnrolledCourseService = {
    insertIntoDb,
    getCourses
}