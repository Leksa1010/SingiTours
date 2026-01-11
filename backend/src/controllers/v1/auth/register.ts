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
    role?: "operator" | "traveller";
};

const register = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password, role } = req.body as RegisterBody;

        // default: traveller
        const requestedRole: "operator" | "traveller" = role ?? "traveller";

        // allow operator ONLY if whitelisted
        if (requestedRole === "operator" && !config.WHITELIST_OPERATORS_MAIL.includes(email)) {
            res.status(403).json({
                code: "Authorization Error",
                message: "Insufficient privileges!",
            });
            logger.warn("Non-whitelisted operator registration attempt", { email });
            return;
        }

        const username = genUsername();

        const newUser = await User.create({
            username,
            email,
            password,
            role: requestedRole,
        });

        const accessToken = generateAccessToken(newUser._id);
        const refreshToken = generateRefreshToken(newUser._id);

        await Token.findOneAndUpdate(
            { userId: newUser._id },
            { token: refreshToken },
            { upsert: true, new: true }
        );

        const isProd = config.NODE_ENV === "production";

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

        res.status(201).json({
            user: {
                id: newUser._id,
                username: newUser.username,
                email: newUser.email,
                role: newUser.role,
            },
        });

        logger.info("User registered", { userId: newUser._id, email: newUser.email, role: newUser.role });
    } catch (err) {
        logger.error("Error while registering user", err);
        res.status(500).json({
            code: "ServerError",
            message: "Internal Server Error",
        });
    }
};

export default register;
