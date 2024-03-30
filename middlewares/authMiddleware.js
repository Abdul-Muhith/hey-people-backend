import asyncHandler from 'express-async-handler';
import jwt from "jsonwebtoken";

import User from "../models/userModel.js";

export const authMiddleware = asyncHandler(async (req, res, next) => {
    let token;

    if (req?.headers?.authorization?.startsWith("Bearer ")) {
        token = req.headers.authorization.split(" ")[1];

        if (!token) {
            throw new Error("Not Authorized token expired, Please Login again");
        }

        const decode = jwt.verify(token, process.env.JWT_SECRET);

        const user = await User.findById(decode?.id);

        if (!user) {
            throw new Error("Not Authorized User");
        }

        req.user = user;
        next();
    } else {
        throw new Error("There is no token attached to header");
    }
});

export const isAdmin = asyncHandler(async (req, res, next) => {
    const { email } = req.user;

    const adminUser = await User.findOne({ email });

    // when role type is String
    // if (adminUser?.role !== 'admin') {
    //     throw new Error('You are not an Admin')
    // } else {
    //     next();
    // }

    // when role type is Array
    const admin = adminUser?.role?.find((role) => role === 'admin');

    if (!admin) throw new Error('You are not an Admin');

    next();
});

// check Role is Student or not

export const isStudent = asyncHandler(async (req, res, next) => { 
    const { email } = req.user;

    const findUser = await User.findOne({ email });

    if (!findUser) throw new Error('User not exist');

    const student = findUser?.role?.find((role) => role === 'student');

    if (!student) throw new Error('You are not an Student');

    next();
}); // ALHAMDULILLAH...
