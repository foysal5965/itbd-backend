import { UserRole, UserStatus } from "@prisma/client";
import { z } from "zod";

const createAdmin = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    admin: z.object({
        name: z.string({
            required_error: "Name is required!"
        }),
        email: z.string({
            required_error: "Email is required!"
        }),
        contactNumber: z.string({
            required_error: "Contact Number is required!"
        })
    })
});
const createStudent = z.object({
    password: z.string({
        required_error: "Password is required"
    }),
    student: z.object({
        name: z.string({
            required_error: "Name is required!"
        }),
        email: z.string({
            required_error: "Email is required!"
        }),
        contactNumber: z.string({
            required_error: "Contact Number is required!"
        })
    })
});


const updateStatus = z.object({
    body: z.object({
        status: z.enum([UserStatus.ACTIVE, UserStatus.BLOCKED, UserStatus.DELETED])
    })
})

export const userValidation = {
    createAdmin,
    createStudent,

    updateStatus
}