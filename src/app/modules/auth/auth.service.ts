import { UserStatus } from "@prisma/client";
import prisma from "../../shared/prisma";
import bcrypt from 'bcrypt'
import { jwtHelpers } from "../../helpers/jwrHelpers";
import config from "../../config";
import { Secret } from "jsonwebtoken";
import emailSender from "./emailSender";
import ApiError from "../../error/ApiError";
import httpStatus from "http-status";
import { NOTFOUND } from "dns";

const loginUser = async (payload: {
    email: string,
    password: string
}) => {
    const userData = await prisma.user.findFirst({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });
    if(!userData){
        throw new ApiError(httpStatus.NOT_FOUND, 'User does not exist!')
    }
    const isCorrectPassword: boolean = await bcrypt.compare(payload.password, userData.password);

    if (!isCorrectPassword) {
        throw new Error("Password incorrect!")
    }
    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    const refreshToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.refresh_token_secret as Secret,
        config.jwt.refresh_token_expires_in as string
    );

    return {
        accessToken,
        refreshToken,
        needPasswordChange: userData.needPasswordChange
    };
};

const refreshToken = async (token: string) => {
    let decodedData;
    try {
        decodedData = jwtHelpers.verifyToken(token, config.jwt.refresh_token_secret as Secret);
    }
    catch (err) {
        throw new ApiError(httpStatus.UNAUTHORIZED,'your are not authorized')
    }

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: decodedData.email,
            status: UserStatus.ACTIVE
        }
    });

    const accessToken = jwtHelpers.generateToken({
        email: userData.email,
        role: userData.role
    },
        config.jwt.jwt_secret as Secret,
        config.jwt.expires_in as string
    );

    return {
        accessToken,
        needPasswordChange: userData.needPasswordChange
    };

};



const changePassword = async (user: any, payload: any) => {

    let error = ''
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: user.email,
            status: UserStatus.ACTIVE
        }
    });

    const isCorrectPassword: boolean = await bcrypt.compare(payload.oldPassword, userData.password);

    if (!isCorrectPassword) {
        throw new ApiError(httpStatus.NOT_FOUND,"Password incorrect!")
    }

    const hashedPassword: string = await bcrypt.hash(payload.newPassword, 12);

    await prisma.user.update({
        where: {
            email: userData.email
        },
        data: {
            password: hashedPassword,
            needPasswordChange: false
        }
    })

    return {
        message: "Password changed successfully!"
    }
};



const forgotPassword = async (payload: { email: string }) => {
    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            email: payload.email,
            status: UserStatus.ACTIVE
        }
    });

    const resetPassToken = jwtHelpers.generateToken(
        { email: userData.email, role: userData.role },
        config.jwt.reset_pass_secret as Secret,
        config.jwt.reset_pass_token_expires_in as string
    )

    const resetPassLink = config.reset_pass_link + `?userId=${userData.id}&token=${resetPassToken}`

    await emailSender(
        userData.email,
        `
        <div>
            <p>Dear User,</p>
            <p>Your password reset link 
                <a href=${resetPassLink}>
                    <button>
                        Reset Password
                    </button>
                </a>
            </p>

        </div>
        `
    )
};


const resetPassword = async (token: string, payload: { id: string, password: string }) => {

    const userData = await prisma.user.findUniqueOrThrow({
        where: {
            id: payload.id,
            status: UserStatus.ACTIVE
        }
    });

    const isValidToken = jwtHelpers.verifyToken(token, config.jwt.reset_pass_secret as Secret)

    if (!isValidToken) {
        throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
    }

    // hash password
    const password = await bcrypt.hash(payload.password, 12);

    // update into database
    await prisma.user.update({
        where: {
            id: payload.id
        },
        data: {
            password
        }
    })
};
export const authService = {
    loginUser,
    refreshToken,
    changePassword,
    forgotPassword,
    resetPassword
}