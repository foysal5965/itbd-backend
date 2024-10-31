import { NextFunction,Request,Response } from "express";
import ApiError from "../error/ApiError";
import httpStatus from "http-status";
import { jwtHelpers } from "../helpers/jwrHelpers";
import config from "../config";
import { Secret } from "jsonwebtoken";



const auth = (...roles: string[]) => {
    return async (req: Request , res: Response, next: NextFunction) => {
        try {
            const token = req.headers?.authorization
            console.log(token,'data')
            if (!token) {
                throw new ApiError(httpStatus.UNAUTHORIZED, "You are not authorized!?")
            }

            const verifiedUser = jwtHelpers.verifyToken(token, config.jwt.jwt_secret as Secret)

            req.user = verifiedUser;

            if (roles.length && !roles.includes(verifiedUser.role)) {
                throw new ApiError(httpStatus.FORBIDDEN, "Forbidden!")
            }
            next()
        }
        catch (err) {
            next(err)
        }
    }
};

export default auth;