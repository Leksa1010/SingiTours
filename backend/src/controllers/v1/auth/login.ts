import * as bcrypt from "bcrypt";
import type { Request, Response } from "express";

import config from "@/config";
import { logger } from "@/lib/winston";
import { generateAccessToken, generateRefreshToken } from "@/lib/jwt";

import User from "@/models/user";
import Token from "@/models/token";

type LoginBody = { email: string; password: string };

const login = async (req: Request, res: Response): Promise<void> => {
    try {
        const { email, password } = req.body as LoginBody;

        const user = await User.findOne({ email }).select("+password").exec();
        if (!user) {
            res.status(401).json({ code: "Authentication Error", message: "Invalid credentials" });
            return;
        }

        const ok = await bcrypt.compare(password, user.password);
        if (!ok) {
            res.status(401).json({ code: "Authentication Error", message: "Invalid credentials" });
            return;
        }

        const accessToken = generateAccessToken(user._id);
        const refreshToken = generateRefreshToken(user._id);

        await Token.findOneAndUpdate(
            { userId: user._id },
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

        res.status(200).json({
            user: { id: user._id, username: user.username, email: user.email, role: user.role },
        });

        logger.info("User logged in", { userId: user._id, email: user.email, role: user.role });
    } catch (err) {
        logger.error("Error while logging in user", err);
        res.status(500).json({ code: "ServerError", message: "Internal Server Error" });
    }
};

export default login;
