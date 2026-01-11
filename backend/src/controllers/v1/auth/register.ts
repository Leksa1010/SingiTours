import type { Request, Response } from "express";

import { logger } from "@/lib/winston";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";
import config from "@/config";
import { genUsername } from "@/utils";

import User from "@/models/user";
import Token from "@/models/token";

type RegisterBody = {
    email: string;
    password: string;
};

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as RegisterBody;

        const username = genUsername();

        const newUser = await User.create({
            username,
            email,
            password,
            role: "traveller",
        });

        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        // 1 refresh token per user
        await Token.findOneAndUpdate(
            { userId: newUser._id },
            { token: refreshToken },
            { upsert: true, new: true }
        );

        const isProd = config.NODE_ENV === "production";

        // Same cookie as in login
        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            path: "/",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            path: "/",
            maxAge: 7 * 24 * 60 * 60 * 1000,
        });

        // No password in response
        res.status(201).json({
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });

        // No password nor token in log
        logger.info("User registered", {
            userId: newUser._id,
            email: newUser.email,
            role: newUser.role,
        });
    } catch (err) {
        logger.error("Error while registering user", err);
        res.status(500).json({
            code: "ServerError",
            message: "Internal Server Error",
        });
    }
};

export default register;
