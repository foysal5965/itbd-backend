import { Request } from "express";
import { fileUploader } from "../../helpers/fileUploader"; // Assuming this handles the image upload
import prisma from "../../shared/prisma";
import ApiError from "../../error/ApiError";
import httpStatus, { NOT_EXTENDED } from "http-status";
import { IPaginationOptions } from "../../interfaces/pagination";
import { paginationHelper } from "../../helpers/paginationHelper";
import { Exam, Prisma, PrismaClient } from "@prisma/client";

const insertIntoDB = async (req: Request) => {
    const { courseId, title, time, questions } = req.body;

    // Parse the questions JSON
    const parsedQuestions = typeof questions === 'string' ? JSON.parse(questions) : questions;

    // Extract question images from req.files and assert the type
    const questionImages = req.files as { [key: string]: Express.Multer.File[] } || {};
    const isExamExist = await prisma.exam.findFirst({
        where: {
            courseId: courseId,
            title
        }
    })
    if (isExamExist) {
        throw new ApiError(httpStatus.ALREADY_REPORTED, 'This exam already exist')
    }
    const result = await prisma.$transaction(async (tx) => {

        // Step 1: Create the exam
        const exam = await tx.exam.create({
            data: {
                courseId,
                title,
                time: parseInt(time),
            },
            include: {
                course: true,
            },
        });

        // Step 2: Loop through each question
        for (const [index, questionData] of parsedQuestions.entries()) {
            let uploadedImageUrl = null;

            // Step 2a: Check if the corresponding image exists for the current question
            const imageKey = `questionImages[${index}]` as keyof typeof questionImages; // Type assertion for safety
            const imageFiles = questionImages[imageKey];

            if (imageFiles && imageFiles.length > 0) {
                const imageFile = imageFiles[0]; // Get the first file for the question
                console.log(`Uploading image for question ${index}:`, imageFile);

                // Upload the image to Cloudinary or another service and get the URL
                const uploadToCloudinary = await fileUploader.uploadToCloudinary(imageFile);
                if (uploadToCloudinary && !Array.isArray(uploadToCloudinary)) {
                    uploadedImageUrl = uploadToCloudinary.secure_url; // Get the image URL
                }
            }

            // Step 2b: Create the question with the uploaded image URL (if any)
            const question = await tx.question.create({
                data: {
                    questionText: questionData.questionText,
                    examId: exam.id,
                    correctOption: '',
                    image: uploadedImageUrl,  // Store the image URL in the question
                },
            });

            // Step 3: Create the options for the question
            let correctOption: string | null = null;
            for (const optionText of questionData.options) {
                const option = await tx.option.create({
                    data: {
                        optionText,
                        questionId: question.id,  // Associate option with the created question
                    },
                });

                // Step 4: Capture the correct option
                if (optionText === questionData.correctOption) {
                    correctOption = option.optionText;
                }
            }

            // Step 5: Update the question to set the correctOptionId
            if (correctOption) {
                await tx.question.update({
                    where: { id: question.id },
                    data: { correctOption },
                });
            }
        }

        return exam;
    });

    return result;
};

type IExamFilterRequest = {
    title?: string | undefined;
    searchTerm?: string | undefined;
}
const getAllFromDB = async (params: IExamFilterRequest, options: IPaginationOptions) => {
    const { page, limit, skip } = paginationHelper.calculatePagination(options);
    const { searchTerm, ...filterData } = params;

    const andCondions: Prisma.ExamWhereInput[] = [];

    //console.log(filterData);
    if (params.searchTerm) {
        andCondions.push({
            OR: ['title'].map(field => ({
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
    const whereConditons: Prisma.ExamWhereInput = { AND: andCondions }

    const result = await prisma.exam.findMany({
        where: whereConditons,
        include: { course: true },
        skip,
        take: limit,
        orderBy: options.sortBy && options.sortOrder ? {
            [options.sortBy]: options.sortOrder
        } : {
            createdAt: 'desc'
        }
    });

    const total = await prisma.exam.count({
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
const getByIdFromDB = async (id: string): Promise<Exam | null> => {
    const result = await prisma.exam.findUnique({
        where: {
            id
        },
        include: {
            course: true,
            questions: {
                include: {
                    options: true
                }
            }

        }
    })

    return result;
};

const updateExam = async (req: Request) => {
    const examId = req.params.id
    const questionImages = req.files as { [key: string]: Express.Multer.File[] };

    const { courseId, title, time, questions } = req.body;

    // Parse the questions JSON
    const parsedQuestions = JSON.parse(questions);
    const examData = await prisma.exam.findFirstOrThrow({
        where: {
            id: examId
        }
    })
    const result = await prisma.$transaction(async (tx) => {
        const updateData = {
            time: parseInt(time),
            title,
            courseId: courseId !== 'undefined' ? courseId : examData.courseId,
        }

        const updatedExam = await tx.exam.update({
            where: { id: examId },
            data: updateData,
        });
        await tx.option.deleteMany({
            where: {
                question: {
                    examId, // Assuming options are linked to questions which are linked to the exam
                },
            },
        });
        await tx.question.deleteMany({
            where: { examId }
        })



        for (const [index, questionData] of parsedQuestions.entries()) {
            let uploadedImageUrl = null;

            // Step 2a: Check if the corresponding image exists for the current question
            const imageKey = `questionImages[${index}]` as keyof typeof questionImages; // Type assertion for safety
            const imageFiles = questionImages[imageKey];
            if (imageFiles && imageFiles.length > 0) {
                const imageFile = imageFiles[0];

                // Upload the image to Cloudinary or another service and get the URL
                const uploadToCloudinary = await fileUploader.uploadToCloudinary(imageFile);
                if (uploadToCloudinary && !Array.isArray(uploadToCloudinary)) {
                    uploadedImageUrl = uploadToCloudinary.secure_url; // Get the image URL
                }
            }

            // Step 2b: Create the question with the uploaded image URL (if any)
            const question = await tx.question.create({
                data: {
                    questionText: questionData.questionText,
                    examId,
                    correctOption: '',
                    image: uploadedImageUrl,  // Store the image URL in the question
                },
            });
            // Step 3: Create the options for the question
            let correctOption: string | null = null;
            for (const optionText of questionData.options) {
                const option = await tx.option.create({
                    data: {
                        optionText,
                        questionId: question.id,  // Associate option with the created question
                    },
                });

                // Step 4: Capture the correct option
                if (optionText === questionData.correctOption) {
                    correctOption = option.id;
                }
            }

            // Step 5: Update the question to set the correctOptionId
            if (correctOption) {
                await tx.question.update({
                    where: { id: question.id },
                    data: { correctOption },
                });
            }
        }
        return 'Exam updated successfuly'
    })
    return result
}
const STATUS_OPTIONS = ['DRAFT', 'PUBLISHED', 'ACTIVE', 'CLOSED', 'GRADING', 'COMPLETED', 'CANCELLED'];
const updateExamStatus = async (req: Request) => {

    const examId = req.params.id;
    console.log(req.body, 'data')
    const { status } = req.body;
    // console.log(status,examId,'data')
    // Validate the incoming status
    if (!STATUS_OPTIONS.includes(status)) {
        // return res.status(400).json({ error: 'Invalid status value.' });
    }
    try {
        // Start a transaction to handle exam status updates
        await prisma.$transaction(async (tx) => {
            // Step 1: Fetch the exam from the database
            const examData = await tx.exam.findFirstOrThrow({
                where: { id: examId }
            });

            // console.log('Current exam data:', examData);

            // Step 2: Handle the status transitions within the transaction
            if (status === 'DRAFT') {
                await tx.exam.update({
                    where: { id: examData.id },
                    data: { status: "DRAFT" }
                })
            } else if (status === 'PUBLISHED') {
                await publishExam(examData, prisma);
            } else if (examData.status === 'ACTIVE') {
                // If active, check if it needs to be closed based on the duration
                // If the new status is ACTIVE, activate the exam
                await activateExam(examData, prisma);
            } else if (status === 'CLOSED') {
                // If the new status is CLOSED, close the exam if needed
                await checkAndCloseExam(examData, prisma);
            }
        });


    } catch (error) {
        console.error('Error updating exam status:', error);
    }
};

// Step 3: Publish the exam and transition to ACTIVE immediately, within the transaction
async function publishExam(examData: Exam, prisma: PrismaClient) {
    // Update status to PUBLISHED within the transaction
    const updatedExam = await prisma.exam.update({
        where: { id: examData.id },
        data: {
            status: 'PUBLISHED',
            updatedAt: new Date() // Update the timestamp
        }
    });

    console.log('Exam published:', updatedExam);

    // Activate the exam immediately within the same transaction
    await activateExam(updatedExam, prisma);
}

// Step 4: Activate the exam and schedule the closure after the `time` (in minutes), within the transaction
async function activateExam(examData: Exam, prisma: PrismaClient) {
    const updatedExam = await prisma.exam.update({
        where: { id: examData.id },
        data: {
            status: 'ACTIVE',
            updatedAt: new Date() // Track activation time
        }
    });

    console.log('Exam activated:', updatedExam);

    const durationInMs = updatedExam.time * 60 * 1000; // Convert time from minutes to milliseconds

    // Schedule the exam to be closed after the specified duration
    setTimeout(async () => {
        await closeExam(updatedExam, prisma);
    }, durationInMs);
}

// Step 5: Close the exam after the duration expires, within the transaction
async function closeExam(examData: Exam, prisma: PrismaClient) {
    const updatedExam = await prisma.exam.update({
        where: { id: examData.id },
        data: {
            status: 'CLOSED',
            updatedAt: new Date() // Update the timestamp
        }
    });

    console.log('Exam closed:', updatedExam);
}

// Step 6: Optional - Check if the exam needs to be closed, within the transaction
async function checkAndCloseExam(examData: Exam, prisma: PrismaClient) {
    const now = new Date();
    const elapsedTimeMs = now.getTime() - new Date(examData.updatedAt).getTime();
    const durationMs = examData.time * 60 * 1000;

    if (elapsedTimeMs >= durationMs) {
        // If the exam has been active longer than its duration, close it
        await closeExam(examData, prisma);
    }
}



const getMyExam = async (user: any) => {
    const studentData = await prisma.student.findFirstOrThrow({
        where: {
            email: user.email
        }
    })

    const isStudentEnrolledCourseExist = await prisma.studentEnrolledCourse.findFirstOrThrow({
        where: {
            studentId: studentData.id
        }
    })
    if (!isStudentEnrolledCourseExist) {
        throw new ApiError(NOT_EXTENDED, 'You do not have any course')
    }

    const result = await prisma.exam.findFirst({
        where: {
            course: {
                id: isStudentEnrolledCourseExist.courseId
            },
            status: "ACTIVE"
        },
        include: {
            questions: {
                include: {
                    options: true
                }
            }

        }
    })
    const jsonData = JSON.stringify(result);
    const newData = JSON.parse(jsonData)
    return newData
}
export const examSevice = {
    insertIntoDB,
    getAllFromDB,
    getByIdFromDB,
    updateExam,
    updateExamStatus,
    getMyExam
};
