
import prisma from "../../shared/prisma"

const insertIntoDb = async (payload: any) => {
    console.log(payload)
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
export const studentEnrolledCourseService = {
    insertIntoDb
}