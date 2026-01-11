import type { Request, Response } from "express";
import { logger } from "@/lib/winston";
import Token from "@/models/token";

const logout = async (req: Request, res: Response): Promise<void> => {
    try {
        const refreshToken = req.cookies?.refreshToken;

        if (refreshToken) {
            await Token.findOneAndDelete({ token: refreshToken });
        }

        res.clearCookie("accessToken", { path: "/" });
        res.clearCookie("refreshToken", { path: "/" });

        res.status(200).json({ message: "Successfully logged out" });
        logger.info("User logged out");
    } catch (err) {
        logger.error("Error during logout", err);
        res.status(500).json({ code: "ServerError", message: "Internal Server Error" });
    }
};

export default logout;
