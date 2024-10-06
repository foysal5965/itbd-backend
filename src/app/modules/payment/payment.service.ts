
import config from '../../config';
import prisma from '../../shared/prisma';
import { PaymentStatus } from '@prisma/client';
import { SSLService } from '../SSL/ssl.service';
const initPayment = async (enrolledCourseId: string) => {
    const paymentData= await prisma.payment.findFirstOrThrow({
        where:{
            enrolledCourseId
        },
        include:{
            studentEnrolledCourse:{
                include:{
                    course:true,
                    student:true
                }
            }
        }
    })
    console.log(paymentData,'data')
    const initPaymentData = {
        amount: paymentData.studentEnrolledCourse.course.courseFee,
        transactionId: paymentData.transactionId,
        name: paymentData.studentEnrolledCourse.student.name,
        email: paymentData.studentEnrolledCourse.student.email,
        phoneNumber: paymentData.studentEnrolledCourse.student.contactNumber
    }
    const result = await SSLService.initPayment(initPaymentData);
    return {
        paymentUrl: result.GatewayPageURL
        
    };

};

const validatePayment = async (payload: any) => {
    // if (!payload || !payload.status || !(payload.status === 'VALID')) {
    //     return {
    //         message: "Invalid Payment!"
    //     }
    // }

    // const response = await SSLService.validatePayment(payload);

    // if (response?.status !== 'VALID') {
    //     return {
    //         message: "Payment Failed!"
    //     }
    // }

    const response = payload;

    await prisma.$transaction(async (tx) => {
        const updatedPaymentData = await tx.payment.update({
            where: {
                transactionId: response.tran_id
            },
            data: {
                status: PaymentStatus.PAID,
                paymentGatewayData: response
            }
        });

        await tx.studentEnrolledCourse.update({
            where: {
                id: updatedPaymentData.enrolledCourseId
            },
            data: {
                paymentStatus: PaymentStatus.PAID
            }
        })
    });

    return {
        message: "Payment success!"
    }

}

export const PaymentServie = {
    initPayment,
    validatePayment
}